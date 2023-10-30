import { Link } from 'react-router-dom'
import { BiArrowBack } from "react-icons/bi";

const Balance = ()=> {
    return(
        <div className="caixa">


        <div className="t">  
            <Link className="volta" to="/"><BiArrowBack/></Link>
            <h1>Balanço</h1>
        </div>

        <div>
            <p className='p'>Chave pública</p>
        </div>

        <div className='input'>
            <input type="text" placeholder='Digite sua chave pública...'/>
        </div>

        <div className='btn'>
            <button style={{width:'100px'}}>Consultar</button>
        </div>
 
    </div>
    )
}

export default Balance