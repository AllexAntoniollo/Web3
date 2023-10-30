import dotenv from 'dotenv'
dotenv.config()

import axios from "axios";
import BlockInfo from "../lib/blockInfo";
import Block from "../lib/block";
import Wallet from '../lib/wallet';
import Transaction from '../lib/transaction';
import TransactionOutput from '../lib/transactionOutput';
import Blockchain from '../lib/blockchain';

const BLOCKCHAIN_SERVER = process.env.BLOCKCHAIN_SERVER

const minerWallet = new Wallet(process.env.MINER_WALLET)
console.log("logged as "+ minerWallet.publicKey);
console.log("\nStarted Mining...");


let totalMined : number = 0


/**
 * 
 * @param blockInfo The information of the block difficulty
 * @param nextBlock The information of the fees
 * @returns Miner reward transaction
 */
function getRewardTx(blockInfo : BlockInfo, nextBlock:Block) : Transaction | undefined{

    let amount = 0

    if(blockInfo.difficulty <= blockInfo.maxDifficulty)
        amount += Blockchain.getRewardAmount(blockInfo.difficulty)

    const fees = nextBlock.transactions.map(tx => tx.getFee()).reduce((a,b) => a+b)
    const feeCheck = nextBlock.transactions.length * blockInfo.feePerTx
    if(fees < feeCheck){
        console.log("Low fees awaiting next block.");
        setTimeout(() =>{
            mine()
        },5000)
        return
        
    }
    amount+=fees

    const txo = new TransactionOutput({
        toAddress: minerWallet.publicKey,
        amount
    }as TransactionOutput)

    return Transaction.fromReward(txo)

}
/**
 * This function is responsible to mine a block. 
 * @returns A loop to mine a block
 */
async function mine() {
    
    const {data} = await axios.get(`${BLOCKCHAIN_SERVER}blocks/next`)
    if (!data) {

        return setTimeout(() => {
            mine()
        },5000)
    }
    const blockInfo = data as BlockInfo

    const newBlock = Block.fromBlockInfo(blockInfo)
    const tx = getRewardTx(blockInfo,newBlock)
    if(!tx) return

    newBlock.transactions.push(tx)



    newBlock.miner = minerWallet.publicKey
    newBlock.hash = newBlock.getHash()

    console.log("-------------------------------------");
    console.log("start mining block #"+blockInfo.index);
    newBlock.mine(blockInfo.difficulty,minerWallet.publicKey)
    console.log("block mined send to blockchain...");

    try {   
        await axios.post(`${BLOCKCHAIN_SERVER}blocks/`,newBlock)
        console.log("block sent and accepted.");
        totalMined++
        console.log("Total mined blocks: "+totalMined);
        console.log("-------------------------------------");

        
    } catch (error:any) {        
        console.error(error.response);
    }

    setTimeout(() => {
        mine()
    },1000)
    
    
}

mine()