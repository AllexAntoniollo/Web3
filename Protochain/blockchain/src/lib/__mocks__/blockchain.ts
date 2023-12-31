import Block from "./block";
import Validation from "../validation";
import BlockInfo from "../blockInfo";
import Transaction from "./transaction";
import TransactionSearch from "../transactionSearch";
import TransactionInput from "./transactionInput";
import TransactionOutput from "./transactionOutput";

/**
 * Mocked Blockchain class
 */
export default class Blockchain{
    blocks : Block[]
    mempool : Transaction[]
    nextIndex : number = 0

    constructor(miner : string ) {
        this.blocks = []
        this.mempool = [new Transaction()]
        this.blocks.push(new Block({
            index:0,
            hash: "abc",
            previousHash:"",
            miner,
            timestamp: Date.now()
        } as Block))
        this.nextIndex++;
    }

    getLastBlock() : Block{
        return this.blocks[this.blocks.length-1];
    }
    
    addTransaction(transaction : Transaction) : Validation{
        const validation = transaction.isValid(1,10)
        if(validation.success) return validation
        this.mempool.push(transaction)

        return new Validation()
    }

    getTransaction(hash : string) : TransactionSearch{
        if(hash === "-1")
            return {mempoolIndex:-1,blockIndex:-1} as TransactionSearch
        return {
            mempoolIndex: 0,
            transaction : new Transaction()
        } as TransactionSearch

    }

    addBlock(block : Block) : Validation{
        if(block.index < 0) return new Validation(false,"Invalid mock block")
 
        this.blocks.push(block);
        this.nextIndex++;
        return new Validation();
    }

    isValid() : Validation{
        return new Validation()
    }

    getBlock(hash : string) : Block | undefined{
        if(!hash || hash === "-1") return undefined
        return this.blocks.find(b => b.hash === hash)
    }

    getFeePerTx() : number{
        return 1
    }

    getNextBlock() : BlockInfo{
        return {
            transactions: this.mempool.slice(0,2),
            difficulty: 2,
            previousHash: this.getLastBlock().hash,
            index: this.blocks.length,
            feePerTx: this.getFeePerTx(),
            maxDifficulty: 62
        } as BlockInfo
    }

    getTxInputs(wallet : string) : (TransactionInput | undefined)[]{
        return [new TransactionInput({
            amount:10,
            previousTx:"abc",
            signature:"abc",
            fromAddress:wallet
        }as TransactionInput)]
    }
    getTxOututs(wallet : string) : TransactionOutput[]{
        return [new TransactionOutput({
            amount:10,
            tx:"abc",
            toAddress:wallet
        }as TransactionOutput)]
    }
    getUtxo(wallet:string) :TransactionOutput[]{
        return this.getTxOututs(wallet)
    }
    getBalance(wallet:string): number{
        return 10
    }
}