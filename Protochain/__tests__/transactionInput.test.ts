import {describe, test, expect, beforeAll} from '@jest/globals'
import TransactionInput from '../src/lib/transactionInput'
import Wallet from '../src/lib/wallet'
import TransactionOutput from '../src/lib/transactionOutput'


describe("TransactionInput tests", () => {

    let alice : Wallet
    let bob   : Wallet
    const exampleTx = "02e21bc6a8ad867682ee39cdacdf56ed4b77010f4d218ffb1899aa7ed4e7e0f9b6"


    beforeAll(() => {
        alice = new Wallet()
        bob   = new Wallet()
    })

    test("should be valid", () => {
        const txInput = new TransactionInput({
            amount: 10,
            fromAddress: alice.publicKey,
            previousTx: "abc"

        } as TransactionInput)
        txInput.sign(alice.privateKey)

        const valid = txInput.isValid();
        expect(valid.success).toBeTruthy();
    })
    test("should NOT be valid (default)", () => {
        const txInput = new TransactionInput()
        txInput.sign(alice.privateKey)

        const valid = txInput.isValid();
        expect(valid.success).toBeFalsy();
    })
    test("should NOT be valid (empty signature)", () => {
        const txInput = new TransactionInput({
            amount: 10,
            fromAddress: alice.publicKey,
            previousTx: "abc"


        } as TransactionInput)

        const valid = txInput.isValid();
        expect(valid.success).toBeFalsy();
    })
    test("should NOT be valid (negative amount)", () => {
        const txInput = new TransactionInput({
            amount: -10,
            fromAddress: alice.publicKey,
            previousTx: "abc"
    
        } as TransactionInput)
        txInput.sign(alice.privateKey)
    
        const valid = txInput.isValid();
        expect(valid.success).toBeFalsy();
    })
    test("should NOT be valid (invalid signature)", () => {
        const txInput = new TransactionInput({
            amount: 10,
            fromAddress: alice.publicKey,
            previousTx: "abc"
    
        } as TransactionInput)
        txInput.sign(bob.privateKey)

        const valid = txInput.isValid();
        expect(valid.success).toBeFalsy();
    })
    test("should NOT be valid (invalid previous tx)", () => {
        const txInput = new TransactionInput({
            amount: 10,
            fromAddress: alice.publicKey,
    
        } as TransactionInput)
        txInput.sign(bob.privateKey)

        const valid = txInput.isValid();
        expect(valid.success).toBeFalsy();
    })

    test("Should create from TXO",() =>{
        const txi = TransactionInput.fromTxo({
            amount:10,
            toAddress:alice.publicKey,
            tx: exampleTx
            
        }as TransactionOutput) 
        txi.sign(alice.privateKey)
        txi.amount = 11
        const result = txi.isValid()
        expect(result.success).toBeFalsy()
    })
})
