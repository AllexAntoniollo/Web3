import TransactionType from "./transactionType";
import { SHA256 } from "crypto-js";
import Validation from "./validation";
import TransactionInput from "./transactionInput";

/**
 * Transaction Class
 */
export default class Transaction{
    type: TransactionType;
    timestamp: number
    hash : string
    to : string
    txInput : TransactionInput | undefined

    constructor(tx?:Transaction) {
        this.type = tx?.type || TransactionType.REGULAR
        this.to = tx?.to || ""
        this.timestamp = tx?.timestamp || Date.now()
        if(tx && tx.txInput){
            this.txInput = new TransactionInput(tx.txInput)
        }else{
            this.txInput = undefined
        }
        this.hash = tx?.hash || this.getHash()

    }

    getHash() : string{
        const from = this.txInput ? this.txInput.getHash() : ""
        return SHA256(this.type+this.to+this.timestamp+from).toString()
    }

    isValid() : Validation{
        if(this.hash !== this.getHash())
            return new Validation(false,"Invalid Hash.")

        if(!this.to)
              return new Validation(false,"Invalid to.")

        if(this.txInput){
            const validation = this.txInput.isValid()
            if(!validation.success) return new Validation(false,"Invalid tx "+validation.message)
            
        }

        return new Validation()
    }


}