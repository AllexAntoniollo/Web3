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
    txInput : TransactionInput



    constructor(tx?:Transaction) {
        this.type = tx?.type || TransactionType.REGULAR
        this.to = tx?.to || ""
        this.timestamp = tx?.timestamp || Date.now()
        this.hash = tx?.hash || this.getHash()
        this.txInput = new TransactionInput(tx?.txInput) || new TransactionInput()
    }

    getHash() : string{
        return SHA256(this.type+this.to+this.timestamp+this.txInput.getHash()).toString()
    }

    isValid() : Validation{
        if(this.hash !== this.getHash())
            return new Validation(false,"Invalid Hash.")

        if(!this.to)
              return new Validation(false,"Invalid to.")

        return new Validation()
    }


}