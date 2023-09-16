import TransactionType from "./transactionType";
import { SHA256 } from "crypto-js";
import Validation from "./validation";

/**
 * Transaction Class
 */
export default class Transaction{
    type: TransactionType;
    timestamp: number
    hash : string
    data : string



    constructor(tx?:Transaction) {
        this.type = tx?.type || TransactionType.REGULAR
        this.data = tx?.data || ""
        this.timestamp = tx?.timestamp || Date.now()
        this.hash = tx?.hash || this.getHash()
    }

    getHash() : string{
        return SHA256(this.type+this.data+this.timestamp).toString()
    }

    isValid() : Validation{
        if(this.hash !== this.getHash())
            return new Validation(false,"Invalid Hash.")

        if(!this.data)
              return new Validation(false,"Invalid data.")

        return new Validation()
    }


}