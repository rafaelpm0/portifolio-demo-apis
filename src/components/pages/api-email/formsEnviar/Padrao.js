import { useEffect, useState } from "react";
import conf from '../../../../conf';
import Loading from "../../../layout/Loading";
import styles from './Padrao.module.css';
import Message from '../../../layout/Message';

function Padrao({ info }) {
    const [data, setData] = useState({

        host: "",
        port: "",
        user: "",
        pass: "",
        from: "",
        tags: {},
        remetente: '', // Substitua pelo ID do remetente criado anteriormente
        modeloEmail: info.id // Substitua pelo ID do modelo de e-mail criado anteriormente

    });
    const [model, setModel] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [remetentes, setRemetentes] = useState([]);
    const [erro, setError] = useState('');
    const [tags, setTags] = useState([]);
    const [contentTags, setContentTags] = useState([]);
    const [text, setText] = useState({
        titulo: info.titulo,
        corpo: info.corpo,
        assinatura: info.assinatura
    });
    const [loading, setLoading] = useState();
    const [message, setMessage] = useState();
    const [type, setType] = useState();

    useEffect(() => {

        function defaultInfo() {
            if (!model) {
                setData(value => ({
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
                setData(value => ({
                    ...value,
                    ...valorPadrao
                })

                )
            }

        }
        defaultInfo();

    }, [model]);

    function handleModelChange(e) {
        if (e.target.value == 'true') {
            setModel(true);
        } else {
            setModel(false);
        }
    };

    function handleDataChange(e) {
        const { name, value } = e.target
        setData({
            ...data,
            [name]: value
        })
    };

    useEffect(() => {
        // setar Data em branco ao trocar de texto
        setData(prevInfo => ({
            ...prevInfo,
            modeloEmail: info.id,
            tags: {}
        }))
        //setar Text em branco caso mudar de modelo
        setText({
            titulo: info.titulo,
            corpo: info.corpo,
            assinatura: info.assinatura
        });
    }, [info.id]);

    useEffect(() => {

        const fetchRemetente = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${conf.url}/search/remetente`);
                const responseData = await response.json();
                setRemetentes(responseData);
            } catch (err) {
                setError(true);
            } finally {
                setIsLoading(false);
            }

        }

        fetchRemetente();

    }, []);


    useEffect(() => {
        const fetchTags = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${conf.url}/search/modeloEmail_tag/${info.id}`);
                const responseData = await response.json();
                setTags(responseData.rows);
            } catch (err) {
                setError(true);
            } finally {
                setIsLoading(false);
            }
        }
        fetchTags();
    }, [info.id]);


    useEffect(() => {
        const fetchContentTags = async () => {
            let responses;

            try {
                responses = await Promise.all(tags.map(async (item) => {
                    const response = await fetch(`${conf.url}/search/tag/${item.nome_tag}`);
                    return response.json();
                }));

                setContentTags(responses.flat());

            } catch (err) {
                setError(true);
            }
        };

        fetchContentTags();
    }, [tags]);

    useEffect(() => {
        const alterText = () => {
            let novoText = {
                titulo: info.titulo,
                corpo: info.corpo,
                assinatura: info.assinatura
            };

            let idRemetente = data.remetente;

            if (idRemetente !== "") {
                let remetente = remetentes.filter(item => item.id == idRemetente)[0];

                Object.keys(novoText).forEach(chave => {
                    Object.keys(remetente).forEach(valor => {
                        novoText[chave] = novoText[chave].replace(`{remetente.${valor}}`, remetente[valor]);
                    });
                });
            };
            if (Object.keys(data.tags).length !== 0) {
                Object.keys(novoText).forEach(chave => {
                    Object.keys(data.tags).forEach(nome => {
                        let valor = data.tags[nome];
                        let valorTag = contentTags[contentTags.findIndex(obj => obj.nome === nome && obj.referencia === valor)]['retorno'];
                        novoText[chave] = novoText[chave].replace(`{${nome}}`, valorTag);
                    });
                });
            }
            setText(novoText);
        };

        alterText();
    }, [data]);

    function handleTagChange(e) {
        const [nome, valor, retorno] = e.target.value.split(',');

        if (valor === '') {
            let newObj = { ...data };
            delete newObj.tags[`${nome}`];
            setData(newObj);
            return;
        };
        setData(prevInfo => ({
            ...prevInfo,
            tags: {
                ...prevInfo.tags,
                [nome]: valor
            }
        }));
    }

    function handelRemetenteChange(e) {

        const value = e.target.value;

        setData((prevData) => ({
            ...prevData, // Copia o estado anterior
            remetente: value // Atualiza apenas a parte desejada do estado
        }));
    }

    function resetMessage(){
        setMessage('');
    }

    function sendEmail() {   
        
        // regra logica para testar se todos os campos foram preenchidos
        if ((data.remetente === '' || Object.keys(data.tags).length !== tags.length)) {
            setMessage("Preencha os campos obrigatórios");
            setType("error");
            return;
        }

        setLoading(true);

        fetch(`${conf.url}/send/emailPadrao`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => {
                setLoading(false);
                if (!response.ok) {
                    setLoading(false);
                    setMessage("Erro ao enviar Email");
                    setType('error');
                }
                console.log('Enviado');
                setMessage("Email enviado com sucesso");
                setType("success");
            })
            .catch(error => {
                console.log('Erro no catch: ', error);
                setLoading(false);
                setMessage("Erro ao enviar Email");
                setType('error');
            });
    }

    return (

        isLoading ? (<div><Loading /></div>) : (
            <div className={styles.padrao}>
                <div className={styles.left}>  {/* lado esquerdo da tela */}

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

                    <div className={styles.entradas}>
                        <label htmlFor="remetente">Remetente</label>
                        <select name="remetente" id="remetente" onChange={handelRemetenteChange}>
                            <option key={''} value={''}>Escolha o remetente</option>
                            {

                                remetentes.map((remetente) => (
                                    <option key={remetente.nome} value={remetente.id}>{remetente.nome}</option>
                                ))

                            }
                        </select>
                    </div>

                    <div>
                        {
                            tags.map(item => (
                                <div className={styles.entradas}>
                                    <label htmlFor={item.nome_tag}>{item.nome_tag}</label>
                                    <select onChange={handleTagChange}>
                                        <option key={item.nome_tag} value={[item.nome_tag, '', '']}>Escolha a tag</option>
                                        {

                                            contentTags
                                                .filter((element) => element.nome === item.nome_tag)
                                                .map(subItem => (
                                                    <option key={subItem.referencia} value={[subItem.nome, subItem.referencia, subItem.retorno]}>{
                                                        subItem.retorno
                                                    }</option>

                                                ))

                                        }
                                    </select>
                                </div>

                            ))}

                    </div>
                    <div className={styles.button}>
                        <button onClick={sendEmail}>Enviar</button>
                    </div>
                    <div>
                        {
                            loading && (
                                <div>
                                    <Loading />
                                </div>
                            )}
                    </div>

                    <div className={styles.message}>
                        <Message type={type} msg={message} reset={resetMessage}/>
                    </div>
                </div>
                <div>
                    <p className={styles.right} htmlFor="">Represetacao do email a ser enviado: </p>
                    <div className={`${styles.right} content`}> {/* lado direito da tela */}
                        <p>{text.titulo}<br /><br />{text.corpo}<br /><br /><br />
                            <img src={info.imagem_url} alt="image signature" />
                            <br />{text.assinatura}</p>
                    </div>
                </div>

            </div>
        )




    )
}

export default Padrao