import {describe, test, expect, beforeAll, jest} from '@jest/globals'
import Block from '../src/lib/block'
import BlockInfo from '../src/lib/blockInfo'
import Transaction from '../src/lib/transaction'
import TransactionType from '../src/lib/transactionType'
import TransactionInput from '../src/lib/transactionInput'
import TransactionOutput from '../src/lib/transactionOutput'
import Wallet from '../src/lib/wallet'

jest.mock('../src/lib/transaction')
jest.mock('../src/lib/transactionInput')
jest.mock('../src/lib/transactionOutput')



describe("Block tests", () => {

    const exampleDifficulty = 1
    let Genesis : Block;
    let alice   : Wallet

    beforeAll(() => {
        Genesis = new Block({
            transactions: [new Transaction({
                txInputs: [new TransactionInput()]
            } as Transaction)]
        }as Block);
        alice = new Wallet()
    })


    test("should be valid", () => {
        const block = new Block({
            transactions: [] as Transaction[],
            index: 1,
            previousHash: Genesis.hash
        }as Block)
        block.transactions.push(new Transaction({
            type: TransactionType.FEE,
            txOutputs: [new TransactionOutput({
                toAddress: alice.publicKey,
                amount:1
            }as TransactionOutput)]
        } as Transaction))

        block.hash = block.getHash()
        block.mine(exampleDifficulty,alice.publicKey)
        const valid = block.isValid(Genesis.hash,Genesis.index, exampleDifficulty);
        expect(valid.success).toBeTruthy();
    })
    test("should NOT be valid (invalid hash)", () => {
        const block = new Block({
            transactions: [] as Transaction[],
            index: 1,
            previousHash: Genesis.hash
        }as Block)
        block.transactions.push(new Transaction({
            type: TransactionType.FEE,
            txOutputs: [new TransactionOutput({
                toAddress: alice.publicKey,
                amount:1
            }as TransactionOutput)]
        } as Transaction))

        block.hash = block.getHash()
        block.mine(exampleDifficulty,alice.publicKey)
        block.hash = "abc"
        const valid = block.isValid(Genesis.hash,Genesis.index, exampleDifficulty);
        expect(valid.success).toBeTruthy();
    })
    test("should NOT be valid (no fee)", () => {
        const block = Block.fromBlockInfo({
            transactions: [new Transaction({
                txInputs: [new TransactionInput()]
            } as Transaction)],
            difficulty: exampleDifficulty,
            feePerTx: 1,
            index: 1,
            maxDifficulty: 62,
            previousHash: Genesis.hash
        }as BlockInfo)

        block.mine(exampleDifficulty,alice.publicKey)
        const valid = block.isValid(Genesis.hash,Genesis.index, exampleDifficulty);
        expect(valid.success).toBeFalsy();
    })

    test("should create from blockInfo", () => {
        const block = Block.fromBlockInfo({
            transactions: [],
            index: 1,
            maxDifficulty: 62,
            previousHash: Genesis.hash,
            feePerTx: 1,
            difficulty: exampleDifficulty
        }as BlockInfo)

        block.transactions.push(new Transaction({
            type: TransactionType.FEE,
            txOutputs: [new TransactionOutput({
                toAddress: alice.publicKey,
                amount: 1
            }as TransactionOutput)]
        } as Transaction))

        block.hash = block.getHash()

        block.mine(exampleDifficulty,alice.publicKey)
        const valid = block.isValid(Genesis.hash,Genesis.index, exampleDifficulty);
        expect(valid.success).toBeTruthy();
    })
    test("should NOT be valid (fallbacks)", () => {
        const block = new Block();
        block.transactions.push(new Transaction({
            type: TransactionType.FEE,
            txOutputs: [new TransactionOutput()]
        } as Transaction))

        block.hash = block.getHash()
        const valid = block.isValid(Genesis.hash,Genesis.index, exampleDifficulty);
        expect(valid.success).toBeFalsy();
    })

    test("should NOT be valid (previous hash)", () => {
        const block = new Block({
            index :1, 
            previousHash:  "abc", 
            transactions: [] as Transaction[]
        } as Block);
        block.transactions.push(new Transaction({
            type: TransactionType.FEE,
            txOutputs: [new TransactionOutput({
                toAddress:alice.publicKey,
                amount:1
            }as TransactionOutput)]
        } as Transaction))

        block.hash = block.getHash()
        block.mine(exampleDifficulty,alice.publicKey)

        const valid = block.isValid(Genesis.hash,Genesis.index, exampleDifficulty);
        expect(valid.success).toBeFalsy();
    })

    test("should NOT be valid (timestamp)", () => {
        const block = new Block({
            index :1, previousHash:  Genesis.hash, 
            transactions: [] as Transaction[]
        } as Block);
        block.timestamp = -1;
        block.transactions.push(new Transaction({
            type: TransactionType.FEE,
            txOutputs: [new TransactionOutput({
                toAddress:alice.publicKey,
                amount:1
            }as TransactionOutput)]
        } as Transaction))

        block.hash = block.getHash()
        block.mine(exampleDifficulty,alice.publicKey)

        const valid = block.isValid(Genesis.hash,Genesis.index, exampleDifficulty);
        expect(valid.success).toBeFalsy();
    })

    test("should NOT be valid (empty hash)", () => {
        const block = new Block({
            index :1, 
            previousHash:  Genesis.hash, 
            transactions: [new Transaction({
                txInputs: [new TransactionInput()]
            } as Transaction)],
        } as Block);
        block.transactions.push(new Transaction({
            type: TransactionType.FEE,
            txOutputs: [new TransactionOutput()]
        } as Transaction))
        block.mine(exampleDifficulty,alice.publicKey)
        block.hash = ""
        const valid = block.isValid(Genesis.hash,Genesis.index, exampleDifficulty);
        expect(valid.success).toBeFalsy();
    })
    test("should NOT be valid (no mined)", () => {
        const block = new Block({
            index :1, 
            previousHash:  Genesis.hash, 
            nonce: 0,
            miner: alice.publicKey,
            transactions: [] as Transaction[]
        } as Block);
        block.transactions.push(new Transaction({
            type: TransactionType.FEE,
            txOutputs: [new TransactionOutput({
                toAddress:alice.publicKey,
                amount:1
            }as TransactionOutput)]
        } as Transaction))

        block.hash = block.getHash()
        const valid = block.isValid(Genesis.hash,Genesis.index, exampleDifficulty);
        expect(valid.success).toBeFalsy();
    })

    test("should NOT be valid (txInput)", () => {
        const txInputs =  [new TransactionInput()]
        txInputs[0].amount = -1

        const block = new Block({
            index :1, 
            previousHash:  Genesis.hash, 
            transactions: [new Transaction({
                txInputs
            } as Transaction)],
        } as Block);
        block.transactions.push(new Transaction({
            type: TransactionType.FEE,
            txOutputs: [new TransactionOutput()]
        } as Transaction))

        block.hash = block.getHash()
        const valid = block.isValid(Genesis.hash,Genesis.index,exampleDifficulty);
        expect(valid.success).toBeFalsy();
    })
    
    test("should NOT be valid (invalid index)", () => {
        const block = new Block({
            index :-1, 
            previousHash:  Genesis.hash, 
            transactions: [] as Transaction[]
        } as Block);
        block.transactions.push(new Transaction({
            type: TransactionType.FEE,
            txOutputs: [new TransactionOutput({
                toAddress:alice.publicKey,
                amount:1
            }as TransactionOutput)]
        } as Transaction))

        block.hash = block.getHash()
        block.mine(exampleDifficulty,alice.publicKey)
        const valid = block.isValid(Genesis.hash,Genesis.index,exampleDifficulty);
        expect(valid.success).toBeFalsy();
    })

    test("should NOT be valid(2 fee)", () => {
        const block = Block.fromBlockInfo({
            transactions: [new Transaction({
                txInputs: [new TransactionInput()],
                type: TransactionType.FEE
            } as Transaction),
            new Transaction({
                txInputs: [new TransactionInput()],
                type: TransactionType.FEE
            } as Transaction)    
        ],
            difficulty: exampleDifficulty,
            feePerTx: 1,
            index: 1,
            maxDifficulty: 62,
            previousHash: Genesis.hash
        }as BlockInfo)
        block.mine(exampleDifficulty,alice.publicKey)
        const valid = block.isValid(Genesis.hash,Genesis.index, exampleDifficulty);
        expect(valid.success).toBeFalsy();
    })

    test("should NOT be valid (invalid tx)", () => {

        const block = new Block({
            index: 1,
            previousHash: Genesis.hash,
            transactions: [] as Transaction[]
        }as Block)

        block.transactions.push(new Transaction({
            type: TransactionType.FEE,
            timestamp: -1,
            txOutputs: [new TransactionOutput({
                toAddress:alice.publicKey,
                amount:1
            }as TransactionOutput)]
        } as Transaction))

        block.hash = block.getHash()
        block.mine(exampleDifficulty,alice.publicKey)
        
        const valid = block.isValid(Genesis.hash,Genesis.index, exampleDifficulty);
        expect(valid.success).toBeFalsy();
    })
})