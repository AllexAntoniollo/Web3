import Validation from '../validation'
/**
 *Mocked Transaction Input Class
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
        this.previousTx  = txInput?.previousTx  || "xyz"
        this.fromAddress = txInput?.fromAddress || "carteira1"
        this.amount      = txInput?.amount      || 10
        this.signature   = txInput?.signature   || "abc"


    }
    /**
     * Generate the tx input signature
     * @param privateKey The 'from' private key
     */
    sign(privateKey : string) : void{
        this.signature = "abc"
    }
    /**
     * Generates the tx input hash
     * @returns The tx input hash
     */
    getHash() : string{
        return "abc"
    }
    /**
     * Validates if the tx input is OK
     * @returns returns a validation result object
     */
    isValid() : Validation{
        if(!this.signature || this.previousTx) return new Validation(false,"Signature and Previous tx are required")
        if(this.amount < 1) return new Validation(false,"Amount must be greater than zero")


        return new Validation()
    }


}