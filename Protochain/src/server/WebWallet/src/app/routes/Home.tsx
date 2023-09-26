import React, { useState } from 'react'
import { Link, redirect } from 'react-router-dom'




const Home = ()=> {


const [val, setVal] = useState('')

    return(
        
        <div className="caixa">

        <div className="titulo">
            <h1>Carteira</h1>
        </div>

        <div className="colunas">

            <div className="coluna">
                <div className="radio-button">
                    <input type="radio" name="CreateWallet" value='CreateWallet' onChange={(e)=> {setVal(e.target.value)}} checked = {val === 'CreateWallet'}></input>
                    <span>Criar Carteira</span>
                </div>
                <div className="radio-button">
                    <input type="radio" name="RecoverWallet" value='RecoverWallet' onChange={(e)=> {setVal(e.target.value)}} checked = {val === 'RecoverWallet'}></input>
                    <span>Recuperar Carteira</span>
                </div>
                <div className="radio-button">
                    <input type="radio" name="Balance" value='Balance' onChange={(e)=> {setVal(e.target.value)}} checked = {val === 'Balance'}></input>
                    <span>Ver Balanço</span> 
                </div>
            </div>

            
            <div className="coluna">
                <div className="radio-button">
                    <input type="radio" name="SendTx" value='SendTx' onChange={(e)=> {setVal(e.target.value)}} checked = {val === 'SendTx'} ></input>
                    <span >Enviar Transação</span>
                </div>
                <div className="radio-button">
                    <input type="radio" name="GetTx" value='GetTx' onChange={(e)=> {setVal(e.target.value)}} checked = {val === 'GetTx'}></input>
                    <span>Consultar Transação</span>
                </div>
                <div className="radio-button">
                    <input type="radio" name="Logout" value='Logout' onChange={(e)=> {setVal(e.target.value)}} checked = {val === 'Logout'}></input>
                    <span>Logout</span>
                </div>
            </div>
        </div>
                
        <div className="btn">
            <Link onClick={()=> { 
            }} to={"/"+val}><button>Confirmar</button></Link>
        </div>

    </div>
    )
}

export default Home