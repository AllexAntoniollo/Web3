import {describe, test, expect, beforeAll} from '@jest/globals'
import Wallet from '../src/lib/wallet'


describe("Wallet tests", () => {

    const exampleWif = "5HueCGU8rMjxEXxiPuD5BDku4MkFqeZyd4dZ1jvhTVqvbTLvyTJ"
    let alice : Wallet

    beforeAll(() => {
        alice = new Wallet()
    })

    test("should generate wallet", () => {
        const wallet = new Wallet()

        expect(wallet.privateKey).toBeTruthy();
        expect(wallet.publicKey).toBeTruthy();

    })
    
    test("should recover wallet (PK)", () => {
        const wallet = new Wallet(alice.privateKey)

        expect(wallet.publicKey).toEqual(alice.publicKey);

    })
    test("should recover wallet (WIF)", () => {
        const wallet = new Wallet(exampleWif)
        expect(wallet.privateKey).toBeTruthy();

        expect(wallet.publicKey).toBeTruthy();

    })
})