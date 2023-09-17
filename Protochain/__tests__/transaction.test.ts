import {describe, test, expect, jest} from '@jest/globals'
import Transaction from '../src/lib/transaction'
import TransactionType from '../src/lib/transactionType'
import TransactionInput from '../src/lib/transactionInput'

jest.mock('../src/lib/transactionInput')

describe("Transactions tests", () => {

    test("should be valid (REGULAR DEFAULT)", () => {
        const tx = new Transaction({
            txInput: new TransactionInput(),
            to: "walletTo"
        }  as Transaction)

        const valid = tx.isValid();
        expect(valid.success).toBeTruthy();
    })
    test("should NOT be valid (invalid hash)", () => {
        const tx = new Transaction({
            to: "walletTo",
            type: TransactionType.REGULAR,
            timestamp: Date.now(),
            hash: "abc"
        }  as Transaction)

        const valid = tx.isValid();
        expect(valid.success).toBeFalsy();
    })

    test("should be valid (FEE)", () => {
        const tx = new Transaction({
            to: "walletTo",
            type: TransactionType.FEE
        }  as Transaction)

        tx.txInput = undefined
        tx.hash = tx.getHash()

        const valid = tx.isValid();
        expect(valid.success).toBeTruthy();
    })

    test("should NOT be valid (invalid to)", () => {
        const tx = new Transaction()

        const valid = tx.isValid();
        expect(valid.success).toBeFalsy();
    })

    test("should NOT be valid (invalid txInput)", () => {
        const tx = new Transaction({
            to: "walletTo",
            txInput: new TransactionInput({
                amount: -10,
                fromAddress: "carteiraFrom",
                signature: "abc"
            }as TransactionInput)
        } as Transaction)

        const valid = tx.isValid();
        expect(valid.success).toBeFalsy();
    })

})