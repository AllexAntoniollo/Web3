import * as ecc from 'tiny-secp256k1'
import ECPairFactory from 'ecpair'
import { SHA256 } from 'crypto-js'
import Validation from './validation'
import TransactionOutput from './transactionOutput'
const ECPair = ECPairFactory(ecc)
/**
 * Transaction Input Class
 */
export default class TransactionInput {
    fromAddress : string
    amount      : number
    signature   : string
    previousTx  : string

    /**
     * Creates a new transaction input
     * @param txInput TxInput data
     */
    constructor(txInput? : TransactionInput){
        this.previousTx = txInput?.previousTx || ""
        this.fromAddress = txInput?.fromAddress || ""
        this.amount      = txInput?.amount      || 0
        this.signature   = txInput?.signature   || ""

    }
    /**
     * Generate the tx input signature
     * @param privateKey The 'from' private key
     */
    sign(privateKey : string) : void{
        this.signature = ECPair.fromPrivateKey(Buffer.from(privateKey,"hex"))
            .sign(Buffer.from(this.getHash(),"hex"))
            .toString("hex")
    }
    /**
     * Generates the tx input hash
     * @returns The tx input hash
     */
    getHash() : string{
        return SHA256(this.fromAddress+this.amount+this.previousTx).toString()
    }
    /**
     * Validates if the tx input is OK
     * @returns returns a validation result object
     */
    isValid() : Validation{
        if(!this.previousTx || !this.signature) return new Validation(false,"Signature and Previous tx are required")
        if(this.amount < 1) return new Validation(false,"Amount must be greater than zero")

        const hash = Buffer.from(this.getHash(),"hex")
        const isValid = ECPair.fromPublicKey(Buffer.from(this.fromAddress,"hex"))
            .verify(hash,Buffer.from(this.signature,"hex"))
        return isValid ? new Validation() : new Validation(false,"Invalid transaction input signature.")
    }

    static fromTxo(txo : TransactionOutput) : TransactionInput{
        return new TransactionInput({
            amount: txo.amount,
            fromAddress: txo.toAddress,
            previousTx: txo.tx
        }as TransactionInput)
    }
}