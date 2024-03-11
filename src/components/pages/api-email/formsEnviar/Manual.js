import {useEffect, useState } from 'react'
import styles from './Manual.module.css'
import Loading from '../../../layout/Loading';
import Message from '../../../layout/Message';
import conf from '../../../../conf';


function Manual() {

    const [model, setModel] = useState(false)  // definir se vai usar o email teste para enviar ou se vai usar e-mail proprio.
    const [info, setInfo] = useState({
        host: "",
        port: "",
        user: "",
        pass: "",
        from: "",
        to: "",
        title: "",
        body: "",
        url: "",
        signture: ""
    });

    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState();
    const [type, setType] = useState();

    function handleModelChange(e) {
        if (e.target.value == 'true') {
            setModel(true);
        } else {
            setModel(false);
        }
    }

    function handleDataChange(e) {
        const { name, value } = e.target
        setInfo({
            ...info,
            [name]: value
        })
    }

    function sendEmail() {

        setIsLoading(true);
        setMessage("");
        setType("");

        fetch(`${conf.url}/send/manual`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(info)
        }).then(response => {
            setIsLoading(false);
            if (!response.ok) {
                throw new Error('Erro ao enviar E-mail')
                setMessage("Erro ao enviar Email");
                setType('error')
            }
            console.log('Enviado');
            setMessage("Email enviado com sucesso");
            setType("success")
        })
            .catch(error => {
                console.log('erro no catch: ', error)
                setIsLoading(false);
                setMessage("Erro ao enviar Email");
                setType('error')
            })

    }

    useEffect(() => {

        function defaultInfo() {
            if (!model) {
                setInfo(value =>({
                    ...value,
                    ...conf.emailPadrao
                })

                )
            } else {
                const valorPadrao = {
                    host: '',
                    port: '',
                    user: '',
                    pass: ''
                }
                setInfo(value =>({
                    ...value,
                    ...valorPadrao
                })

                )
            }

        }
        defaultInfo();

    }, [model])
    
    return (
        <div className={styles.manual}>
            <div className={styles.message}>
                <Message type={type} msg={message} />
            </div>
            <div className={styles.message}>
                {isLoading && (
                    <Loading />
                )}
            </div>

            <div className={styles.entradas}>
                <label htmlFor="email">Email de envio:</label>
                <select name="email" onChange={handleModelChange}>
                    <option key="padrao" value={'false'}>Usar email padrão teste</option>
                    <option key="manual" value={'true'}>Informar e-mail próprio</option>
                </select>
            </div>

            {model && (
                <div>

                    <div className={styles.entradas}>
                        <label htmlFor="host">Host:</label>
                        <input type="text" name='host' id='host' value={info.host} onChange={handleDataChange} />
                    </div>

                    <div className={styles.entradas}>
                        <label htmlFor="port">Porta:</label>
                        <input type="number" name='port' id='port' value={info.port} onChange={handleDataChange} />
                    </div>

                    <div className={styles.entradas}>
                        <label htmlFor="user">Email:</label>
                        <input type="text" name='user' id='user' value={info.user} onChange={handleDataChange} />
                    </div>

                    <div className={styles.entradas}>
                        <label htmlFor="pass">Senha:</label>
                        <input type="password" name='pass' id='pass' value={info.pass} onChange={handleDataChange} />
                    </div>

                </div>
            )}

            <div>
                <div className={styles.entradas}>
                    <label htmlFor="from">De:</label>
                    <input type="text" name='from' id='from' value={info.from} onChange={handleDataChange} />
                </div>

                <div className={styles.entradas}>
                    <label htmlFor="to">Para:</label>
                    <input type="text" name='to' id='to' value={info.to} onChange={handleDataChange} />
                </div>

                <div className={`${styles.entradas} ${styles.textarea}`}>
                    <label htmlFor="body">Corpo:</label>
                    <textarea name='body' id='body' value={info.body} onChange={handleDataChange} />
                </div>

                <div className={styles.entradas}>
                    <label htmlFor="url">Imagem assinatura(URL):</label>
                    <input type="text" name='url' id='url' value={info.url} onChange={handleDataChange} />
                </div>

                <div className={styles.entradas}>
                    <label htmlFor="signture">Assinatura:</label>
                    <textarea name='signture' id='signture' value={info.signture} onChange={handleDataChange} />
                </div>


            </div>
            <div className={styles.button}>
                <button onClick={sendEmail}>Enviar</button>
            </div>

        </div>)
}

export default Manual