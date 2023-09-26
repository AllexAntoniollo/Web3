import React from 'react'
import '../style/SendTx.css'
import { Link } from 'react-router-dom'
import { BiArrowBack } from "react-icons/bi";

const SendTx = ()=> {
    return(
        <div class="caixa">


        <div class="t1">  
            <Link class="volta" to="/"><BiArrowBack/></Link>
            <h1>Enviar Transação</h1>
        </div>
        
        <div>
            <p className='p'>Endereço</p>
        </div>
        
        <div className='input'>
            <input type="text" placeholder='Digite seu endereço...'/>
        </div>

        <div>
            <p className='p'>Qunatidade</p>
        </div>

        <div className='input'>
            <input type="number" min="1" placeholder='Digite sua chave privada ou WIF...'/>
        </div>

        <div className='btn'>
            <button style={{width:'100px'}}>Enviar</button>
        </div>
 
    </div>
    )
}

export default SendTx