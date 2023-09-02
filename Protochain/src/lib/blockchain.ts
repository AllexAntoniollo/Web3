import Block from "./block";
import Validation from "./validation";
/**
 * Blockchain class
 */
export default class Blockchain{
    blocks : Block[]
    nextIndex : number = 0

    constructor() {
        this.blocks = [new Block({index:this.nextIndex,previousHash:"",data:"Genesis Block"} as Block)]
        this.nextIndex++;
    }

    getLastBlock() : Block{
        return this.blocks[this.blocks.length-1];
    }

    addBlock(block : Block) : Validation{
        const lastBlock = this.getLastBlock()

        const validation = block.isValid(lastBlock.hash,lastBlock.index)
        
        if(!validation.success) return new Validation(false,`Invalid Block. ${validation.message}`);
        this.blocks.push(block);
        this.nextIndex++;
        return new Validation();
    }

    isValid() : Validation{
        for (let index = this.blocks.length-1; index > 0; index--) {
            const currentBlock = this.blocks[index];
            const previousBlock = this.blocks[index-1];
            const isValid = currentBlock.isValid(previousBlock.hash, previousBlock.index);
            if(!isValid.success ) return new Validation(false,`Invalid Block #${currentBlock.index}: ${isValid.message}`);
            
        }
        return new Validation()
    }

    getBlock(hash : string) : Block | undefined{
        return this.blocks.find(b => b.hash === hash)
    }
}