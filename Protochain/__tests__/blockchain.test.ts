import {describe, test, expect, jest} from '@jest/globals'
import Blockchain from '../src/lib/blockchain'
import Block from '../src/lib/block'

jest.mock('../src/lib/block.ts')

describe("Block tests", () => {

    test("Should has genesis block", () => {
        const blockchain = new Blockchain();
        expect(blockchain.blocks.length).toEqual(1);
    })

    test("Should be valid (genesis)", () => {
        const blockchain = new Blockchain();
        expect(blockchain.isValid().success).toEqual(true)
    })

    test("Should be valid (two blocks)", () => {
        const blockchain = new Blockchain();
        blockchain.addBlock(new Block({index :1, previousHash: blockchain.blocks[0].hash, data: "Block 2"} as Block));
        expect(blockchain.isValid().success).toEqual(true)
    })

    test("Should add Block", () => {
        const blockchain = new Blockchain();
        const result = blockchain.addBlock(new Block({index :1, previousHash: blockchain.blocks[0].hash, data: "Block 2"} as Block));
        expect(result.success).toBeTruthy();
    })

    test("Should NOT add Block", () => {
        const blockchain = new Blockchain();
        const block = blockchain.addBlock(new Block({index :-1, previousHash: blockchain.blocks[0].hash, data: "Block 2"} as Block));
        expect(block.success).toBeFalsy();
    })

    test("Should NOT be valid (two blocks)", () => {
        const blockchain = new Blockchain();
        blockchain.addBlock(new Block(new Block({index :1, previousHash: blockchain.blocks[0].hash, data: "Block 2"} as Block)));
        blockchain.blocks[1].index = -1
        expect(blockchain.isValid().success).toEqual(false)
    })
    
    test("Should get block", () => {
        const blockchain = new Blockchain();
        const block = blockchain.getBlock(blockchain.blocks[0].hash)
        expect(block).toBeTruthy();
    })
})