import sha256 from 'crypto-js/sha256'
import Validation from './validation'
/**
 * Block class
 */
export default class Block {
    index        : number
    hash         : string
    previousHash : string
    timestamp    : number
    data         : string


    /**
     * Creates a new Block
     * @param block the Block data
     */
    constructor(block? : Block) {
        this.timestamp = block?.timestamp || Date.now();
        this.index = block?.index || 0;
        this.previousHash = block?.previousHash || ""
        this.data = block?.data || ""
        this.hash = block?.hash || this.getHash();
 
    }
    /**
     * Validates the block
     * @returns Returns true if the block is valid
     */
    isValid(previousHash : string, previousIndex : number ) : Validation {
        if(previousIndex !== this.index-1) return new Validation(false,"Invalid Index")
        if(this.hash !== this.getHash()) return new Validation(false,"Invalid Hash")
        if(!this.data) return new Validation(false,"Invalid Data")
        if(this.timestamp < 1) return new Validation(false,"Invalid Timestamp")
        if(previousHash !== this.previousHash) return new Validation(false,"Invalid PreviousHash")



        return new Validation();

    }

    getHash() : string{
        return sha256(this.index+this.data+this.timestamp+this.previousHash).toString();
    }
}