import Block from "./block";
import Validation from "./validation";
import BlockInfo from "./blockInfo";
import Transaction from "./transaction";
import TransactionType from "./transactionType";
import TransactionSearch from "./transactionSearch";
import TransactionInput from "./transactionInput";
import TransactionOutput from "./transactionOutput";
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

    /**
     * Creates a new Blockchain
     * @param miner 
     */
    constructor(miner : string) {
        this.blocks = []
        this.mempool = []

        const genesis = this.createGenesis(miner)
        this.blocks.push(genesis)
        this.nextIndex++;
    }
    /**
     * Initialize a first block. 
     * @param miner 
     * @returns 
     */
    createGenesis(miner : string) : Block{
        const amount = Blockchain.getRewardAmount(this.getDifficulty())

        const tx = Transaction.fromReward(new TransactionOutput({
            amount,
            toAddress: miner
        } as TransactionOutput))
 

        const block = new Block()
        block.transactions = [tx]
        block.mine(this.getDifficulty(),miner)

        return block
    }
    /**
     * Get the last block
     * @returns 
     */
    getLastBlock() : Block{
        return this.blocks[this.blocks.length-1];
    }
    /**
     * Get the current difficulty
     */
    getDifficulty() : number{
        return Math.ceil(this.blocks.length/Blockchain.DIFFICULTY_FACTOR) + 1
    }
    /**
     * Get a transaction from hash
     * @param hash 
     * @returns 
     */
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
    /**
     * Add a transaction
     * @param transaction 
     * @returns 
     */
    addTransaction(transaction : Transaction) : Validation{
        if(transaction.txInputs && transaction.txInputs.length){
            const from = transaction.txInputs[0].fromAddress

            
            const pendingTx = this.mempool
                .filter(tx => tx.txInputs && tx.txInputs.length)
                .map(tx => tx.txInputs)
                .flat()
                .filter(txi => txi!.fromAddress === from)

            if(pendingTx && pendingTx.length){
                return new Validation(false,"This wallet has a pending transaction.")
            }

            const utxo = this.getUtxo(from)
            for (let index = 0; index < transaction.txInputs.length; index++) {
                const txi = transaction.txInputs[index]
                if(utxo.findIndex(txo => txo.tx === txi.previousTx && txo.amount >= txi.amount) === -1)
                    return new Validation(false,"Invalid tx: The TXO is already spent or nonexistent")
                
            }
        }

        const validation = transaction.isValid(this.getDifficulty(),this.getFeePerTx())
        if(!validation.success)
            return new Validation(false,"Invalid tx: "+validation.message)
        if(this.blocks.some(b => b.transactions.some(tx => tx.hash === transaction.hash)))
            return new Validation(false,"Duplicated tx in blockchain.")

        this.mempool.push(transaction)
        return new Validation(true,transaction.hash)
    }
    /**
     * Add a block
     * @param block 
     * @returns 
     */
    addBlock(block : Block) : Validation{
        const nextBlock = this.getNextBlock()
        if(!nextBlock){
            return new Validation(false,"There's no next block info.")
        }

        const validation = block.isValid(nextBlock.previousHash,nextBlock.index-1, nextBlock.difficulty,nextBlock.feePerTx )
        
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
    /**
     * Verify the blockchain
     * @returns 
     */
    isValid() : Validation{
        for (let index = this.blocks.length-1; index > 0; index--) {
            const currentBlock = this.blocks[index];
            const previousBlock = this.blocks[index-1];
            const isValid = currentBlock.isValid(previousBlock.hash, previousBlock.index, this.getDifficulty(),this.getFeePerTx());
            if(!isValid.success ) return new Validation(false,`Invalid Block #${currentBlock.index}: ${isValid.message}`);
            
        }
        return new Validation()
    }
    /**
     * Returns a block from hash
     * @param hash 
     * @returns 
     */
    getBlock(hash : string) : Block | undefined{
        return this.blocks.find(b => b.hash === hash)
    }
    /**
     * Returns a default fee of the transaction
     * @returns 
     */
    getFeePerTx() : number{
        return 1
    }
    /**
     * 
     * @param wallet 
     * @returns 
     */
    getTxInputs(wallet : string) : (TransactionInput | undefined)[] {
        return this.blocks
            .map(b => b.transactions)
            .flat()
            .filter(tx => tx.txInputs && tx.txInputs.length)
            .map(tx => tx.txInputs)
            .flat()
            .filter(txi => txi!.fromAddress === wallet)
    }
    /**
     * 
     * @param wallet 
     * @returns 
     */
    getTxOutputs(wallet : string) : TransactionOutput[]{
        return this.blocks
        .map(b => b.transactions)
        .flat()
        .filter(tx => tx.txOutputs && tx.txOutputs.length)
        .map(tx => tx.txOutputs)
        .flat()
        .filter(txo => txo!.toAddress === wallet)
    }
    /**
     * Return the available UTXOs
     * @param wallet 
     * @returns 
     */
    getUtxo(wallet : string) : TransactionOutput[]{
        const txIns = this.getTxInputs(wallet)
        const txOuts = this.getTxOutputs(wallet)

        if(!txIns || !txIns.length) return txOuts
        
        txIns.forEach(txi => {
            const index = txOuts.findIndex(txo => txo.amount === txi!.amount)
            txOuts.splice(index,1)
        })

        return txOuts

    }
    /**
     * Return next block info
     * @returns 
     */
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
    /**
     * Return the available balance
     * @param wallet 
     * @returns 
     */
    getBalance(wallet : string) : number{
        const utxo = this.getUtxo(wallet)
        if(!utxo || !utxo.length) return 0

        return utxo.reduce((a,b) => a+b.amount,0)

    } 
    /**
     * Reward for mining a block
     * @param difficulty 
     * @returns 
     */
    static getRewardAmount(difficulty:number) : number{
        return (64-difficulty)*10
    }
}