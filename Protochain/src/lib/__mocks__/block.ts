import Transaction from './transaction'
import Validation from '../validation'
/**
 * Mocked Block class
 */
export default class Block {
    index        : number
    hash         : string
    previousHash : string
    timestamp    : number
    transactions : Transaction[]


    /**
     * Creates a new Mock Block
     * @param block the Mock Block data
     */
    constructor(block? : Block) {
        this.timestamp = block?.timestamp || Date.now();
        this.index = block?.index || 0;
        this.previousHash = block?.previousHash || ""
        this.transactions = block?.transactions || [] as Transaction[]
        this.hash = block?.hash || this.getHash();
 
    }
    /**
     * Validates the block
     * @returns Returns true if the mock block is valid
     */
    isValid(previousHash : string, previousIndex : number ) : Validation {
        if(!previousHash || previousIndex < 0 || this.index < 0)
            return new Validation(false,"Invalid mock block")
        
            return new Validation();

    }

    getHash() : string{
        return this.hash || "abc"
    }
}