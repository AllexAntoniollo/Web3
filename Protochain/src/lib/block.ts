import sha256 from 'crypto-js/sha256'
import Validation from './validation'
import BlockInfo from './blockInfo'
import Transaction from './transaction'
import TransactionType from './transactionType'
/**
 * Block class
 */
export default class Block {

    index        : number
    hash         : string
    previousHash : string
    timestamp    : number
    nonce        : number
    miner        : string
    transactions  : Transaction[]


    /**
     * Creates a new Block
     * @param block the Block data
     */
    constructor(block? : Block) {

        this.index = block?.index || 0;
        this.timestamp = block?.timestamp || Date.now();
        this.previousHash = block?.previousHash || ""


        this.transactions = block?.transactions 
            ? block.transactions.map(tx => new Transaction(tx))
            : [] as Transaction[]

        this.nonce = block?.nonce || 0
        this.miner = block?.miner || ""
        this.hash = block?.hash || this.getHash();

    }
    /**
     * Generates a new valid hash for this block with the specified difficulty
     * @param difficulty The blockchain current difficult
     * @param miner The miner wallet address
     */
    mine(difficulty : number, miner : string) : void{   
        this.miner = miner
        const prefix = new Array(difficulty+1).join("0")

        do{
            this.nonce++
            this.hash = this.getHash()
        }while (!this.hash.startsWith(prefix)) {
            
        }

    }

    /**
     * Validates the block
     * @param previousHash The previews block hash
     * @param previousIndex The previews block index
     * @param difficulty The blockchain current difficult
     * @returns Returns true if the block is valid
     */
    isValid(previousHash : string, previousIndex : number, difficulty : number) : Validation {

        if (this.transactions && this.transactions.length) {
            if (this.transactions.filter(tx => tx.type === TransactionType.FEE).length > 1) {
                return new Validation(false,"Too many fees.")
            }


            const validation = this.transactions.map(tx => tx.isValid())
            const errors = validation.filter(v => !v.success).map(v => v.message)
            if (errors.length > 0) {
                return new Validation(false,"Invalid Block due to invalid tx: "+errors.reduce((a,b) => a+b))
            }

        }

        if(previousIndex !== this.index-1) return new Validation(false,"Invalid Index")

        if(this.timestamp < 1) return new Validation(false,"Invalid Timestamp")
        if(previousHash !== this.previousHash) return new Validation(false,"Invalid PreviousHash")
        if(!this.nonce || !this.miner) return new Validation(false,"No mined.")

        const prefix = new Array(difficulty+1).join("0")
        if(this.hash !== this.getHash() || !this.hash.startsWith(prefix)) return new Validation(false,"Invalid Hash")


        return new Validation();

    }

    getHash() : string{
        const txs = this.transactions && this.transactions.length
            ? this.transactions.map(tx => tx.hash).reduce((a,b) => a+b)
            : ""
        return sha256(txs+this.index+this.timestamp+this.previousHash+this.nonce+this.miner).toString();
    }

    static fromBlockInfo(blockInfo : BlockInfo) : Block{
        const block = new Block();
        block.index = blockInfo.index
        block.previousHash = blockInfo.previousHash
        block.transactions = blockInfo.transactions
        return block

    }
}