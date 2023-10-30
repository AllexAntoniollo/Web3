import Transaction from "./transaction";
/**
 * Transaction Model
 */
export default interface TransactionSearch{
    transaction  : Transaction,
    mempoolIndex : number,
    blockIndex   : number

}