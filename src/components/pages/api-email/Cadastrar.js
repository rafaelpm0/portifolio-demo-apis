import styles from './Cadastrar.module.css';
import { useState } from 'react';
import Tags from './formsCadastrar.js/Tags';
import ModeloEmail from './formsCadastrar.js/ModeloEmail';
import Remetente from './formsCadastrar.js/Remetente';

function Cadastrar() {

    const [cadastro, setCadastro] = useState();

    function handleCadastroChange(e) {
        let info = e.target.value;
        setCadastro(info);
    }
    return (
        <div className={styles.cadastrar}>

            <div className={styles.cadastro}>
                <label htmlFor="modeloEmail" className={styles.label} > Cadastro: </label>
                <select className={styles.select} id="modeloEmail" 
                name="modeloEmail" onChange={handleCadastroChange}>
                    <option className={styles.option} value={0} key="vazio">Selecione um cadastro</option>
                    <option className={styles.option} value={1} key="Tags">Tags</option>
                </select>
            </div>

            <div>
                {cadastro === '1' && (<Tags/>)}
                {cadastro === '2' && (<ModeloEmail/>)}
                {cadastro === '3' && (<Remetente/>)}
            </div>



        </div>);
}

export default Cadastrar