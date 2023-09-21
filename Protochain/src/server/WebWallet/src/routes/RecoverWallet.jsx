import React from 'react'
import '../style/RecoverWallet.css'
import { Link } from 'react-router-dom'
import { BiArrowBack } from "react-icons/bi";

const recoverWallet = ()=> {
    return(
        <div class="caixa">


        <div class="titu">  
            <Link class="voltar" to="/"><BiArrowBack/></Link>
            <h1>Restaurar Carteira</h1>
        </div>

        <div>
            <p className='p'>Chave privada ou WIF</p>
        </div>

        <div className='input'>
            <input type="text" placeholder='Digite sua chave privada ou WIF...'/>
        </div>

        <div className='btn'>
            <button style={{width:'100px'}}>Recuperar</button>
        </div>
 
    </div>
    )
}

export default recoverWallet