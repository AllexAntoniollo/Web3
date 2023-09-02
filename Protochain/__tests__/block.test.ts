import {describe, test, expect, beforeAll} from '@jest/globals'
import Block from '../src/lib/block'
import BlockInfo from '../src/lib/blockInfo'

describe("Block tests", () => {

    const exampleDifficulty = 0
    const exampleMiner = "Allex"
    let Genesis : Block;

    beforeAll(() => {
        Genesis = new Block({
            data: "Genesis Block"
        }as Block);
    })

    test("should be valid", () => {
        const block = Block.fromBlockInfo({
            data: "block 2",
            difficulty: exampleDifficulty,
            feePerTx: 1,
            index: 1,
            maxDifficulty: 62,
            previousHash: Genesis.hash
        }as BlockInfo)
        block.mine(exampleDifficulty,exampleMiner)
        const valid = block.isValid(Genesis.hash,Genesis.index, exampleDifficulty);
        expect(valid.success).toBeTruthy();
    })
    test("should create from blockInfo", () => {
        const block = new Block({index :1, previousHash:  Genesis.hash, data: "Block 2"} as Block);
        block.mine(exampleDifficulty,exampleMiner)
        const valid = block.isValid(Genesis.hash,Genesis.index, exampleDifficulty);
        expect(valid.success).toBeTruthy();
    })
    test("should NOT be valid (fallbacks)", () => {
        const block = new Block();
        const valid = block.isValid(Genesis.hash,Genesis.index, exampleDifficulty);
        expect(valid.success).toBeFalsy();
    })

    test("should NOT be valid (previous hash)", () => {
        const block = new Block({index :1, previousHash:  "abc", data: "Block 2"} as Block);
        const valid = block.isValid(Genesis.hash,Genesis.index, exampleDifficulty);
        expect(valid.success).toBeFalsy();
    })

    test("should NOT be valid (timestamp)", () => {
        const block = new Block({index :1, previousHash:  Genesis.hash, data: "Block 2"} as Block);
        block.timestamp = -1;
        block.hash = block.getHash();
        const valid = block.isValid(Genesis.hash,Genesis.index, exampleDifficulty);
        expect(valid.success).toBeFalsy();
    })

    test("should NOT be valid (empty hash)", () => {
        const block = new Block({index :1, previousHash:  Genesis.hash, data: "Block 2"} as Block);
        block.mine(exampleDifficulty,exampleMiner)
        block.hash = ""
        const valid = block.isValid(Genesis.hash,Genesis.index, exampleDifficulty);
        expect(valid.success).toBeFalsy();
    })
    test("should NOT be valid (no mined)", () => {
        const block = new Block({index :1, previousHash:  Genesis.hash, data: "Block 2"} as Block);

        const valid = block.isValid(Genesis.hash,Genesis.index, exampleDifficulty);
        expect(valid.success).toBeFalsy();
    })

    test("should NOT be valid (data)", () => {
        const block = new Block({index :1, previousHash:  Genesis.hash, data: ""} as Block);
        const valid = block.isValid(Genesis.hash,Genesis.index,exampleDifficulty);
        expect(valid.success).toBeFalsy();
    })
    
    test("should NOT be valid (index)", () => {
        const block = new Block({index :-1, previousHash:  Genesis.hash, data: "Block 2"} as Block);
        const valid = block.isValid(Genesis.hash,Genesis.index,exampleDifficulty);
        expect(valid.success).toBeFalsy();
    })
})