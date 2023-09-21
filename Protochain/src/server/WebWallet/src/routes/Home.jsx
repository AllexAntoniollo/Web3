import React, { useState } from 'react'
import { Link, redirect } from 'react-router-dom'




const Home = ()=> {


const [val, setVal] = useState('')

    return(
        
        <div class="caixa">

        <div class="titulo">
            <h1>Carteira</h1>
        </div>

        <div class="colunas">

            <div class="coluna">
                <div class="radio-button">
                    <input type="radio" name="CreateWallet" value='CreateWallet' onChange={(e)=> {setVal(e.target.value)}} checked = {val === 'CreateWallet'}></input>
                    <span for="opcao1">Criar Carteira</span>
                </div>
                <div class="radio-button">
                    <input type="radio" name="RecoverWallet" value='RecoverWallet' onChange={(e)=> {setVal(e.target.value)}} checked = {val === 'RecoverWallet'}></input>
                    <span for="opcao2">Recuperar Carteira</span>
                </div>
                <div class="radio-button">
                    <input type="radio" name="Balance" id="opcao3"></input>
                    <span for="opcao3">Ver Balanço</span> 
                </div>
            </div>

            
            <div class="coluna">
                <div class="radio-button">
                    <input type="radio" name="SendTx" id="opcao4"></input>
                    <span for="opcao4">Enviar Transação</span>
                </div>
                <div class="radio-button">
                    <input type="radio" name="GetTx" id="opcao5"></input>
                    <span for="opcao5">Consultar Transação</span>
                </div>
                <div class="radio-button">
                    <input type="radio" name="Logout" id="opcao6"></input>
                    <span for="opcao6">Logout</span>
                </div>
            </div>
        </div>
                
        <div class="btn">
            <Link to={"/"+val}><button>Enviar</button></Link>
        </div>

    </div>
    )
}

export default Home