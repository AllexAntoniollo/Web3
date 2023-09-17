import {describe, test, expect, beforeAll, jest} from '@jest/globals'
import Block from '../src/lib/block'
import BlockInfo from '../src/lib/blockInfo'
import Transaction from '../src/lib/transaction'
import TransactionType from '../src/lib/transactionType'
import TransactionInput from '../src/lib/transactionInput'

jest.mock('../src/lib/transaction')
jest.mock('../src/lib/transactionInput')


describe("Block tests", () => {

    const exampleDifficulty = 0
    const exampleMiner = "Allex"
    let Genesis : Block;

    beforeAll(() => {
        Genesis = new Block({
            transactions: [new Transaction({
                txInput: new TransactionInput()
            } as Transaction)]
        }as Block);
    })

    test("should be valid", () => {
        const block = Block.fromBlockInfo({
            transactions: [new Transaction({
                txInput: new TransactionInput()
            } as Transaction)],
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
        const block = new Block({
            index :1, 
            transactions: [new Transaction({
                txInput: new TransactionInput()
            } as Transaction)],
            previousHash: Genesis.hash, 
} as Block);
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
        const block = new Block({
            index :1, 
            previousHash:  "abc", 
            transactions: [new Transaction({
                txInput: new TransactionInput()
            } as Transaction)],
        } as Block);
        const valid = block.isValid(Genesis.hash,Genesis.index, exampleDifficulty);
        expect(valid.success).toBeFalsy();
    })

    test("should NOT be valid (timestamp)", () => {
        const block = new Block({
            index :1, previousHash:  Genesis.hash, 
            transactions: [new Transaction({
                txInput: new TransactionInput()
            } as Transaction)],
        } as Block);
        block.timestamp = -1;
        block.hash = block.getHash();
        const valid = block.isValid(Genesis.hash,Genesis.index, exampleDifficulty);
        expect(valid.success).toBeFalsy();
    })

    test("should NOT be valid (empty hash)", () => {
        const block = new Block({
            index :1, 
            previousHash:  Genesis.hash, 
            transactions: [new Transaction({
                txInput: new TransactionInput()
            } as Transaction)],
        } as Block);
        block.mine(exampleDifficulty,exampleMiner)
        block.hash = ""
        const valid = block.isValid(Genesis.hash,Genesis.index, exampleDifficulty);
        expect(valid.success).toBeFalsy();
    })
    test("should NOT be valid (no mined)", () => {
        const block = new Block({index :1, 
            previousHash:  Genesis.hash, 
            transactions: [new Transaction({
                txInput: new TransactionInput()
            } as Transaction)],
        } as Block);

        const valid = block.isValid(Genesis.hash,Genesis.index, exampleDifficulty);
        expect(valid.success).toBeFalsy();
    })

    test("should NOT be valid (txInput)", () => {
        const txInput =  new TransactionInput()
        txInput.amount = -1

        const block = new Block({index :1, 
            previousHash:  Genesis.hash, 
            transactions: [new Transaction({
                txInput
            } as Transaction)],
        } as Block);
        const valid = block.isValid(Genesis.hash,Genesis.index,exampleDifficulty);
        expect(valid.success).toBeFalsy();
    })
    
    test("should NOT be valid (index)", () => {
        const block = new Block({index :-1, 
            previousHash:  Genesis.hash, 
            transactions: [new Transaction({
                txInput: new TransactionInput()
            } as Transaction)],
        } as Block);
        const valid = block.isValid(Genesis.hash,Genesis.index,exampleDifficulty);
        expect(valid.success).toBeFalsy();
    })

    test("should NOT be valid(2 fee)", () => {
        const block = Block.fromBlockInfo({
            transactions: [new Transaction({
                txInput: new TransactionInput(),
                type: TransactionType.FEE
            } as Transaction),
            new Transaction({
                txInput: new TransactionInput(),
                type: TransactionType.FEE
            } as Transaction)    
        ],
            difficulty: exampleDifficulty,
            feePerTx: 1,
            index: 1,
            maxDifficulty: 62,
            previousHash: Genesis.hash
        }as BlockInfo)
        block.mine(exampleDifficulty,exampleMiner)
        const valid = block.isValid(Genesis.hash,Genesis.index, exampleDifficulty);
        expect(valid.success).toBeFalsy();
    })

    test("should NOT be valid(invalid tx)", () => {

        const block = new Block({
            index: 1,
            previousHash: Genesis.hash,
            transactions: [new Transaction()]
        }as Block)
        block.mine(exampleDifficulty,exampleMiner)
        block.transactions[0].to = ""
        const valid = block.isValid(Genesis.hash,Genesis.index, exampleDifficulty);
        expect(valid.success).toBeFalsy();
    })
})