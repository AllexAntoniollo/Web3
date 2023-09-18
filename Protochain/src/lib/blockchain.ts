import Block from "./block";
import Validation from "./validation";
import BlockInfo from "./blockInfo";
import Transaction from "./transaction";
import TransactionType from "./transactionType";
import TransactionSearch from "./transactionSearch";
import TransactionInput from "./transactionInput";
/**
 * Blockchain class
 */
export default class Blockchain{
    static readonly DIFFICULTY_FACTOR = 5
    static readonly TX_PER_BLOCK = 2
    static readonly MAX_DIFFICULTY = 62

    blocks    : Block[]
    nextIndex : number = 0
    mempool   : Transaction[]

    constructor() {
        this.mempool = []
        this.blocks = [new Block({
            index: this.nextIndex,
            previousHash: "",
            transactions: [new Transaction({
                type : TransactionType.FEE,
                txInput : new TransactionInput()
            } as Transaction)]
        } as Block)]
        this.nextIndex++;
    }

    getLastBlock() : Block{
        return this.blocks[this.blocks.length-1];
    }

    getDifficulty() : number{
        return Math.ceil(this.blocks.length/Blockchain.DIFFICULTY_FACTOR) + 1
    }

    getTransaction(hash:string) : TransactionSearch{
        const mempoolIndex = this.mempool.findIndex(tx => tx.hash === hash)
        if(mempoolIndex !== -1)
            return {
                mempoolIndex,
                transaction: this.mempool[mempoolIndex]
        } as TransactionSearch

        const blockIndex = this.blocks.findIndex(b => b.transactions.some(tx => tx.hash === hash))
        if(blockIndex !== -1)
            return {
                blockIndex,
                transaction: this.blocks[blockIndex].transactions.find(tx => tx.hash === hash)
            } as TransactionSearch
        
        return {
            blockIndex: -1,
            mempoolIndex: -1,         
        } as TransactionSearch

    }

    addTransaction(transaction : Transaction) : Validation{
        if(transaction.txInput){
            const from = transaction.txInput.fromAddress
            const pendingtx = this.mempool.map(tx => tx.txInput).filter(txi => txi!.fromAddress === from)
            if(pendingtx && pendingtx.length){
                return new Validation(false,"This wallet has a pending transaction.")
            }
        }

        const validation = transaction.isValid()
        if(!validation.success)
            return new Validation(false,"Invalid tx: "+validation.message)
        if(this.blocks.some(b => b.transactions.some(tx => tx.hash === transaction.hash)))
            return new Validation(false,"Duplicated tx in blockchain.")

        this.mempool.push(transaction)
        return new Validation(true,transaction.hash)
    }

    addBlock(block : Block) : Validation{
        const lastBlock = this.getLastBlock()

        const validation = block.isValid(lastBlock.hash,lastBlock.index, this.getDifficulty())
        
        if(!validation.success) return new Validation(false,`Invalid Block. ${validation.message}`);

        const txs = block.transactions.filter(tx => tx.type !== TransactionType.FEE).map(tx => tx.hash)
        const newMempool = this.mempool.filter(tx => !txs.includes(tx.hash))

        if(newMempool.length + txs.length !== this.mempool.length)
            return new Validation(false,"invalid tx in block: mempool")
        this.mempool = newMempool
        this.blocks.push(block);
        this.nextIndex++;
        return new Validation(true,block.hash);
    }

    isValid() : Validation{
        for (let index = this.blocks.length-1; index > 0; index--) {
            const currentBlock = this.blocks[index];
            const previousBlock = this.blocks[index-1];
            const isValid = currentBlock.isValid(previousBlock.hash, previousBlock.index, this.getDifficulty());
            if(!isValid.success ) return new Validation(false,`Invalid Block #${currentBlock.index}: ${isValid.message}`);
            
        }
        return new Validation()
    }

    getBlock(hash : string) : Block | undefined{
        return this.blocks.find(b => b.hash === hash)
    }

    getFeePerTx() : number{
        return 1
    }

    getNextBlock() : BlockInfo | null{
        if(!this.mempool || !this.mempool.length)
            return null

        const transactions = this.mempool.slice(0,Blockchain.TX_PER_BLOCK)
        const difficulty = this.getDifficulty()
        const previousHash = this.getLastBlock().hash
        const index = this.blocks.length
        const feePerTx = this.getFeePerTx()
        const maxDifficulty = Blockchain.MAX_DIFFICULTY
        return {
            transactions,difficulty,previousHash,index,feePerTx,maxDifficulty
        } as BlockInfo;
    }
}