import dotenv from 'dotenv'
dotenv.config()

import axios from "axios";
import BlockInfo from "../lib/blockInfo";
import Block from "../lib/block";

const BLOCKCHAIN_SERVER = process.env.BLOCKCHAIN_SERVER
const minerWallet = {
    "privateKey": "123",
    "publicKey": `${process.env.MINER_WALLET}`
}

console.log("logged as "+ minerWallet.publicKey);


let totalMined : number = 0

async function mine() {
    console.log("Getting next block info...");
    
    const {data} = await axios.get(`${BLOCKCHAIN_SERVER}blocks/next`)
    if (!data) {
        console.log("No tx found. Waiting...");

        return setTimeout(() => {
            mine()
        },5000)
    }
    const blockInfo = data as BlockInfo
    console.log(data);

    const newBlock = Block.fromBlockInfo(blockInfo)
    
    console.log("start mining block #"+blockInfo.index);
    newBlock.mine(blockInfo.difficulty,minerWallet.publicKey)
    console.log("block mined send to blockchain");

    try {   
        await axios.post(`${BLOCKCHAIN_SERVER}blocks/`,newBlock)
        console.log("block sent and accepted");
        totalMined++
        console.log("Total mined blocks "+totalMined);
        
        
    } catch (error:any) {
        console.error(error.response ? error.response.date : error.message);
    }

    setTimeout(() => {
        mine()
    },1000)
    
    
}

mine()