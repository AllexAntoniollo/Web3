import TransactionType from "./transactionType";
import { SHA256 } from "crypto-js";
import Validation from "./validation";
import TransactionInput from "./transactionInput";
import TransactionOutput from "./transactionOutput";

/**
 * Transaction Class
 */
export default class Transaction{
    type: TransactionType;
    timestamp: number
    hash : string
    txOutputs : TransactionOutput[]
    txInputs : TransactionInput[] | undefined

    constructor(tx?:Transaction) {
        this.type = tx?.type || TransactionType.REGULAR
        this.timestamp = tx?.timestamp || Date.now()

        this.txInputs = tx?.txInputs 
            ? tx.txInputs?.map(txi => new TransactionInput(txi))
            : undefined

        this.txOutputs = tx?.txOutputs 
            ? tx.txOutputs?.map(txo => new TransactionOutput(txo))
            : []
        


        this.hash = tx?.hash || this.getHash()

        this.txOutputs.forEach((txo,index,arr) => arr[index].tx = this.hash)

    }

    getHash() : string{
        const from = this.txInputs && this.txInputs.length 
        ? this.txInputs.map(txi => txi.signature).join(",")
        : ""
        const to = this.txOutputs && this.txOutputs.length 
        ? this.txOutputs.map(txo => txo.getHash()).join(",")
        : ""
        return SHA256(this.type+to+from+this.timestamp).toString()
    }

    isValid() : Validation{
        if(this.hash !== this.getHash())
            return new Validation(false,"Invalid Hash.")

        if(!this.txOutputs || !this.txOutputs.length || this.txOutputs.map(txo => txo.isValid()).some(v => !v.success))
              return new Validation(false,"Invalid transaction output.")
        if(this.txInputs && this.txInputs.length){
            const validations = this.txInputs.map(txi => txi.isValid()).filter(v => !v.success)
            if(validations && validations.length){
                const message = validations.map(v => v.message).join(" ")
                return new Validation(false,"Invalid tx: "+message)
            }

            const inputSum = this.txInputs.map(txi => txi.amount).reduce((a,b) => a+b,0)
            const OutputSum = this.txOutputs.map(txo => txo.amount).reduce((a,b) => a+b,0)
            if(inputSum < OutputSum){
                return new Validation(false,"Invalid tx: Input amount must be equals or greater than Output amount.")
            }

        }

        if(this.txOutputs.some(txo => txo.tx !== this.hash)){
            return new Validation(false,"Invalid txo reference hash.")
        }


        return new Validation()
    }


}