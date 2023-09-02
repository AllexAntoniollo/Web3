import Block from "./block";
import Validation from "./validation";
import BlockInfo from "./blockInfo";
/**
 * Blockchain class
 */
export default class Blockchain{
    static readonly DIFFICULTY_FACTOR = 5
    static readonly MAX_DIFFICULTY = 62

    blocks : Block[]
    nextIndex : number = 0

    constructor() {
        this.blocks = [new Block({index:this.nextIndex,previousHash:"",data:"Genesis Block"} as Block)]
        this.nextIndex++;
    }

    getLastBlock() : Block{
        return this.blocks[this.blocks.length-1];
    }

    getDifficulty() : number{
        return Math.ceil(this.blocks.length/Blockchain.DIFFICULTY_FACTOR)
    }

    addBlock(block : Block) : Validation{
        const lastBlock = this.getLastBlock()

        const validation = block.isValid(lastBlock.hash,lastBlock.index, this.getDifficulty())
        
        if(!validation.success) return new Validation(false,`Invalid Block. ${validation.message}`);
        this.blocks.push(block);
        this.nextIndex++;
        return new Validation();
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

    getNextBlock() : BlockInfo{
        const data = new Date().toString();
        const difficulty = this.getDifficulty()
        const previousHash = this.getLastBlock().hash
        const index = this.blocks.length
        const feePerTx = this.getFeePerTx()
        const maxDifficulty = Blockchain.MAX_DIFFICULTY
        return {
            data,difficulty,previousHash,index,feePerTx,maxDifficulty
        } as BlockInfo
    }
}