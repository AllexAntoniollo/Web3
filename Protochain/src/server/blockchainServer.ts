import dotenv from 'dotenv'
dotenv.config()

import  Express  from "express";
import morgan from "morgan";
import Blockchain from "../lib/blockchain";
import Block from "../lib/block";
import Transaction from '../lib/transaction';
import Wallet from '../lib/wallet';

/* c8 ignore next */
const PORT : number = parseInt(`${process.env.BLOCKCHAIN_PORT || 3000}`)

const app = Express()

/* c8 ignore start */
if(process.argv.includes("--run")){app.use(morgan(('tiny')))}
/* c8 ignore end */

app.use(Express.json())
 
const wallet = new Wallet(process.env.BLOCKCHAIN_WALLET)

const blockchain = new Blockchain(wallet.publicKey);
/**
 * Show the blockchain data
 */
app.get("/status", (req,res,next) => {
    res.json({
        mempool        : blockchain.mempool.length,
        blocks : blockchain.blocks.length,
        isValid        : blockchain.isValid(),
        lastBlock      : blockchain.getLastBlock()
    })
})
/**
 * Show the wallet data
 */
app.get("/wallets/:wallet", (req,res,next) => {
    const wallet = req.params.wallet

    const utxo = blockchain.getUtxo(wallet)
    const balance = blockchain.getBalance(wallet)
    const fee = blockchain.getFeePerTx()

    return res.json({balance,fee,utxo})
})

/**
 * Show the blockchain data
 */
app.get("/blocks/", (req,res,next) => {
    res.json(blockchain)
})
/**
 * Show the next block data or null
 */
app.get("/blocks/next", (req,res,next) => {
    res.json(blockchain.getNextBlock())
})
/**
 * Show a specified block
 */
app.get("/blocks/:indexOrHash", (req,res,next) => {
    let block

    if(/^[0-9]+$/.test(req.params.indexOrHash))
        block = blockchain.blocks[parseInt(req.params.indexOrHash)]
    else
        block = blockchain.getBlock(req.params.indexOrHash)

    if(!block)
        return res.sendStatus(404)
    else
        return res.json(block)
})
/**
 * Show a transaction or a mempool
 */
app.get("/transactions/:hash?", (req,res,next) =>{

    if(req.params.hash){
        res.json(blockchain.getTransaction(req.params.hash))
    }else{
        res.json({next: blockchain.mempool.slice(0,Blockchain.TX_PER_BLOCK), total: blockchain.mempool.length})
    }

})
/**
 * Add a block
 */
app.post("/blocks", (req,res,next) => {
    if(req.body.hash === undefined) return res.sendStatus(422)

    const block = new Block(req.body as Block);
    const validation = blockchain.addBlock(block);
    if(validation.success)
        res.status(201).json(block)
    else
        res.status(400).json(validation)
    
})
/**
 * Add a transaction
 */
app.post("/transactions", (req,res,next) => {
    if(req.body.hash === undefined) return res.sendStatus(422)

    const tx = new Transaction(req.body as Transaction);
    const validation = blockchain.addTransaction(tx);
    if(validation.success)
        res.status(201).json(tx)
    else
        res.status(400).json(validation)
    
})

/* c8 ignore start */
if(process.argv.includes("--run")){app.listen(PORT, () => {console.log("server is running at "+PORT+". Wallet: "+wallet.publicKey)})}
/* c8 ignore end */

export {
    app
}