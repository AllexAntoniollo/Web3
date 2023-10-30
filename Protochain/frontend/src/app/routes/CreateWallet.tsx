import { Link } from 'react-router-dom'
import { BiArrowBack } from "react-icons/bi";

const createWallet = ()=> {
    return(
        <div className="caixa">


        <div className="titul">  
            <Link className="volta" to="/"><BiArrowBack/></Link>
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
            <button style={{width:'100px'}}>Criar</button>
        </div>
 
    </div>
    )
}

export default createWallet