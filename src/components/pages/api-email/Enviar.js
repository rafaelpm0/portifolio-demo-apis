import styles from './Enviar.module.css';
import { useState, useEffect } from 'react';
import Loading from '../../layout/Loading';
import Manual from './formsEnviar/Manual';
import Padrao from './formsEnviar/Padrao';
import conf from '../../../conf';

function Enviar() {

    const [modelo, setModelo] = useState({}) //carrga a lista da tabela ModeloEmail - texto, tags, id
    const [isLoading, setIsLoading] = useState(true)
    const [sendModel, setSendModel] = useState({}) // Carrega a tabela do ModeloEmail do select
    const [modeloOptions, setModeloOptions] = useState("") // ira receber "" para iniciar, livre para tipo livre de envio e Object para demais opcoes de envio


    function handleModelChange(e) {
        const valor = e.target.value;

        try {
            const numero = parseInt(valor);
            if (!isNaN(numero)) {
                setSendModel(modelo.filter(item => item.id === numero)[0]);
                setModeloOptions('padrao');
            } else {
                setModeloOptions(valor);
            }
        } catch (error) {
            console.error("Erro:", error);
            setModeloOptions(valor);
        }
    }
    

    useEffect(() => {


            const fetchData = async () => {
                try {
                    const response = await fetch(`${conf.url}/search/modeloEmail`);
                    const responseData = await response.json()
                    setModelo(responseData)
                } catch (err) {
                    console.log(err)
                } finally {
                    setIsLoading(false)
                }

            }
            fetchData();
        }, [])

    if (isLoading) {
        return (
            <div className={styles.loading}>
                <Loading />
            </div>
        )
    } else {
        return (
            <div className={styles.enviar}>
                <div className={styles.centro}>

                    <label htmlFor="modeloEmail" className={styles.label}> Modelo: </label>
                    <select className={styles.select} id="modeloEmail" name="modeloEmail" onChange={handleModelChange} >
                        <option className={styles.option} name="" value="" key="">Escolha um modelo envio</option>
                        <option className={styles.option} name="livre" value="livre" key="livre">Livre</option>
                        {modelo.map(item => (
                            (<option className={styles.option} name="modelo" value={item.id} key={item.id} >{item.nome}</option>)
                        ))}
                    </select>
                </div>
                <div>{
                    modeloOptions === 'livre' ? (
                        <Manual />
                    ) :
                        modeloOptions !== '' && (
                            <Padrao info={sendModel} />
                        )
                }</div>




            </div>)
    }


}

export default Enviar
