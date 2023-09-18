import dotenv from 'dotenv'
dotenv.config()
import Wallet from "../lib/wallet";
import readline from "readline"
import axios from "axios";
import Transaction from '../lib/transaction';
import TransactionType from '../lib/transactionType';
import TransactionInput from '../lib/transactionInput';

const BLOCKCHAIN_SERVER = process.env.BLOCKCHAIN_SERVER 
let myWalletPub = "";
let myWalletPriv = "";


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

function menu(){
    setTimeout(() => {
        console.clear()

        if(myWalletPub){
            console.log("you are logged "+myWalletPriv);
        }else{
            console.log("you aren't logged");
        }
        console.log("1 - Create Wallet");
        console.log("2 - Recover Wallet");
        console.log("3 - Balance");
        console.log("4 - Send tx");
        console.log("5 - Search tx");
        console.log("6 - Logout");


        rl.question("Choose your option: ",(answer) => {
            switch (answer) {
                case "1": createWallet()                 
                    break;
                case "2": recoverWallet()
                    break
                case "3": getBalance()
                    break
                case "4": sendTx()
                    break
                case "5": searchTx()
                    break
                case "6": logout()
                    break
                
            
                default:
                    console.log("Wrong Option!");
                    menu()
            }
        })

        

    }, 1000)
}

function preMenu(){
    rl.question("Press any key to continue...", () => {
        menu()
    })
}

function logout(){
    myWalletPriv = ""
    myWalletPub = ""
    menu()
}
function searchTx(){
    console.clear()
    rl.question("Your tx hash: ",async (hash) => {
        const response = await axios.get(BLOCKCHAIN_SERVER+"transactions/"+hash)
        console.log(response.data);
        preMenu()
        
    })
}
function sendTx(){
    console.clear()
    if(!myWalletPub){
        console.log("You don't have a wallet yet.");
        return preMenu()
    }
    console.log(`Your wallet is ${myWalletPub}`);
    rl.question("To wallet: ", (toWallet) => {
        if(toWallet.length < 66){
            console.log("Invalid wallet.");
            return preMenu()
        }
        rl.question("Amount: ", async (amountStr) => {
            const amount = parseInt(amountStr)
            if(!amount){
                console.log("Invalid amount.");
                return preMenu()    
            }

            const tx = new Transaction()
            tx.timestamp = Date.now()
            tx.to = toWallet
            tx.type = TransactionType.REGULAR
            tx.txInput = new TransactionInput({
                amount,
                fromAddress: myWalletPub
            }as TransactionInput)
            tx.txInput.sign(myWalletPriv)
            tx.hash = tx.getHash()

            try {
                const txResponse = await axios.post(`${BLOCKCHAIN_SERVER}transactions/`, tx)
                console.log("Transaction accepted. Waiting the miners!");
                console.log(txResponse.data.hash);
                
                
            } catch (err : any) {
                console.error(err.response ? err.response.data.message : err.message);
            }
            return preMenu()

        })
        

    })


    
    preMenu()
}

function createWallet(){
    console.clear()
    const wallet = new Wallet()
    console.log("Your new wallet: ");
    console.log(wallet);

    myWalletPriv = wallet.privateKey
    myWalletPub = wallet.publicKey
    
    preMenu()
}

function recoverWallet(){
    console.clear()
    rl.question("What is you PrivateKey or WIF?",(wifOrPrivateKey) => {
        const wallet = new Wallet(wifOrPrivateKey)
        console.log("Your recovered wallet: ");
        console.log(wallet);
    
        myWalletPriv = wallet.privateKey
        myWalletPub = wallet.publicKey

        preMenu()

    })
}

function getBalance(){
    console.clear()
    if(!myWalletPub){
        console.log("You don't have a wallet yet.");
        return preMenu()
    }
    preMenu()
}

menu()