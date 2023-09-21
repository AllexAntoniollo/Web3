import React from 'react'
import '../style/CreateWallet.css'
import { Link } from 'react-router-dom'
import { BiArrowBack } from "react-icons/bi";

const createWallet = ()=> {
    return(
        <div class="caixa">


        <div class="titul">  
            <Link class="volta" to="/"><BiArrowBack/></Link>
            <h1>Criar Carteira</h1>
        </div>

        <div className='um'>
            <h1>Chave Publica: </h1>
            <p>Sua Chave Publica</p>
        </div>

        <div className='dois'>
            <h1>Chave Privada: </h1>
            <p>Sua Chave Privada</p>
        </div>

        <div className='btn'>
            <button style={{width:'100px'}}>Enviar</button>
        </div>
 
    </div>
    )
}

export default createWallet