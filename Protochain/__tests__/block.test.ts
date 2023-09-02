import {describe, test, expect, beforeAll} from '@jest/globals'
import Block from '../src/lib/block'

describe("Block tests", () => {

    let Genesis : Block;

    beforeAll(() => {
        Genesis = new Block({
            data: "Genesis Block"
        }as Block);
    })

    test("should be valid", () => {
        const block = new Block({index :1, previousHash:  Genesis.hash, data: "Block 2"} as Block);
        const valid = block.isValid(Genesis.hash,Genesis.index);
        expect(valid.success).toBeTruthy();
    })
    test("should NOT be valid (fallbacks)", () => {
        const block = new Block();
        const valid = block.isValid(Genesis.hash,Genesis.index);
        expect(valid.success).toBeFalsy();
    })

    test("should NOT be valid (previous hash)", () => {
        const block = new Block({index :1, previousHash:  "abc", data: "Block 2"} as Block);
        const valid = block.isValid(Genesis.hash,Genesis.index);
        expect(valid.success).toBeFalsy();
    })

    test("should NOT be valid (timestamp)", () => {
        const block = new Block({index :1, previousHash:  Genesis.hash, data: "Block 2"} as Block);
        block.timestamp = -1;
        block.hash = block.getHash();
        const valid = block.isValid(Genesis.hash,Genesis.index);
        expect(valid.success).toBeFalsy();
    })

    test("should NOT be valid (hash)", () => {
        const block = new Block({index :1, previousHash:  Genesis.hash, data: "Block 2"} as Block);
        block.hash = ""
        const valid = block.isValid(Genesis.hash,Genesis.index);
        expect(valid.success).toBeFalsy();
    })

    test("should NOT be valid (data)", () => {
        const block = new Block({index :1, previousHash:  Genesis.hash, data: ""} as Block);
        const valid = block.isValid(Genesis.hash,Genesis.index);
        expect(valid.success).toBeFalsy();
    })
    
    test("should NOT be valid (index)", () => {
        const block = new Block({index :-1, previousHash:  Genesis.hash, data: "Block 2"} as Block);
        const valid = block.isValid(Genesis.hash,Genesis.index);
        expect(valid.success).toBeFalsy();
    })
})