import { Link } from 'react-router-dom'
import { BiArrowBack } from "react-icons/bi";

const GetTx = ()=> {
    return(
        <div className="caixa">


        <div className="ti">  
            <Link className="volta" to="/"><BiArrowBack/></Link>
            <h1>Consultar Transação</h1>
        </div>

        <div>
            <p className='p'>Hash da Transação</p>
        </div>

        <div className='input'>
            <input type="text" placeholder='Digite o hash...'/>
        </div>

        <div className='btn'>
            <button style={{width:'100px'}}>Consultar</button>
        </div>
 
    </div>
    )
}

export default GetTx