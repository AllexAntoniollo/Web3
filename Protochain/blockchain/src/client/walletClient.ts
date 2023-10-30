import dotenv from 'dotenv'
dotenv.config()
import Wallet from "../lib/wallet";
import readline from "readline"
import axios from "axios";
import Transaction from '../lib/transaction';
import TransactionInput from '../lib/transactionInput';
import TransactionOutput from '../lib/transactionOutput';

const BLOCKCHAIN_SERVER = process.env.BLOCKCHAIN_SERVER 
let myWalletPub = "";
let myWalletPriv = "";


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

/**
 * Main Menu
 */
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
/**
 * A menu to redirect to main menu
 */
function preMenu(){
    rl.question("Press any key to continue...", () => {
        menu()
    })
}
/**
 * Logout the wallet
 */
function logout(){
    myWalletPriv = ""
    myWalletPub = ""
    menu()
}
/**
 * Search a Transaction
 */
function searchTx(){
    console.clear()
    rl.question("Your tx hash: ",async (hash) => {
        const response = await axios.get(BLOCKCHAIN_SERVER+"transactions/"+hash)
        console.log(response.data);
        preMenu()
        
    })
}
/**
 * Send a Transaction
 */
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

            const walletResponse = await axios.get(BLOCKCHAIN_SERVER+"wallets/"+myWalletPub)
            const balance = walletResponse.data.balance as number
            const fee = walletResponse.data.fee as number
            const utxo = walletResponse.data.utxo as TransactionOutput[]

            if(balance < amount+fee){
                console.log("Insufficient balance (tx+fee).");
                return preMenu() 
            }

            const txInputs = utxo.map(txo => TransactionInput.fromTxo(txo))
            txInputs.forEach((txi,index,arr) => arr[index].sign(myWalletPriv))

            const txOutputs = [] as TransactionOutput[]

            txOutputs.push(new TransactionOutput({
                toAddress: toWallet,
                amount
            }as TransactionOutput))

            const remainingBalance = balance-amount-fee

            txOutputs.push(new TransactionOutput({
                toAddress: myWalletPub,
                amount: remainingBalance
            }as TransactionOutput))

            const tx = new Transaction({
                txInputs,
                txOutputs
            }as Transaction)



            tx.hash = tx.getHash()
            tx.txOutputs.forEach((txo,index,arr) => arr[index].tx = tx.hash)

            console.log("\nRemaining balance: "+remainingBalance);
            
            

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
/**
 * Create a Wallet
 */
function createWallet(){
    console.clear()
    const wallet = new Wallet()
    console.log("Your new wallet: ");
    console.log(wallet);

    myWalletPriv = wallet.privateKey
    myWalletPub = wallet.publicKey
    
    preMenu()
}
/**
 * Recover a Wallet
 */
function recoverWallet(){
    console.clear()
    rl.question("What is you PrivateKey or WIF? ",(wifOrPrivateKey) => {
        const wallet = new Wallet(wifOrPrivateKey)
        console.log("Your recovered wallet: ");
        console.log(wallet);
    
        myWalletPriv = wallet.privateKey
        myWalletPub = wallet.publicKey

        preMenu()

    })
}
/**
 * Check the balance of an address
 */
async function getBalance(){
    console.clear()
    if(!myWalletPub){
        console.log("You don't have a wallet yet.");
        return preMenu()
    }
    const {data} = await axios.get(BLOCKCHAIN_SERVER+"wallets/"+myWalletPub)
    console.log("Balance: "+data.balance);
    
    preMenu()
}

menu()