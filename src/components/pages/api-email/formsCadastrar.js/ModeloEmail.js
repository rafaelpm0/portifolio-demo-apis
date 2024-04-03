import styles from './ModeloEmail.module.css'
import { useEffect, useState } from "react";
import conf from '../../../../conf'
import Loading from "../../../layout/Loading";
import Message from "../../../layout/Message";
import { MdModeEdit, } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { IoIosRemoveCircle } from "react-icons/io";

function Tags() {

    const [incluirExcluir, setIncluirExcluir] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [edite, setEdite] = useState(false);
    const [editeButton, setEditeButton] = useState(false);
    const [alterRementente, setAlterRementente] = useState({});
    const [message, setMessage] = useState('');
    const [type, setType] = useState("");
    const [modeloEmail, setModeloEmail] = useState({}); 
    const [contentModeloEmail, setContentModeloEmail] = useState([]);
    const [currentModeloEmail, setCurrentModeloEmail] = useState();
    const [alterModeloEmail, setAlterModeloEmail] = useState({});

    function resetMessage() {
        setMessage('');
    }

    function handleInExOnChange(e) {
        setIncluirExcluir(e.target.value === 'true');
    }

    function handleInserMEOnChange(e) {
        let { name, value } = e.target;


        if (value === "") {
            let obj = { ...modeloEmail };
            delete obj[name];
            setModeloEmail(obj);
        } else {
            setModeloEmail((prevData) => ({
                ...prevData,
                [name]: value
            }));
        }

    }

    function resetMessage() {
        const timer = setTimeout(() => {
            setMessage("");
        }, 2900);
        return () => clearTimeout(timer);
    }

    function handleIncluirModeloEmail() {

        let a = modeloEmail.hasOwnProperty('nome');
        let b = modeloEmail.hasOwnProperty('titulo');
        let c = modeloEmail.hasOwnProperty('corpo');


        if (!((a && b) && c)) {
            setType("error");
            setMessage("Campos obrigatórios: Nome, Titulo e Corpo.");
            resetMessage();
            return;
        }

        setIsLoading(true);

        fetch(`${conf.url}/insert/modeloEmail`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(modeloEmail)
        }).then(resp => {
            setIsLoading(false);
            setType('success');
            setMessage('Remetente incluido com sucesso');

        })
            .catch(err => {
                setIsLoading(false);
                setType('error');
                setMessage('Erro na inclusão do remetente');

            });
    }

    useEffect(() => {


        const fetchRemet = async () => {

            try {
                setIsLoading(true);
                let resp = await fetch(`${conf.url}/search/modeloEmail`)
                let data = await resp.json();
                
                setContentModeloEmail(data)
                setIsLoading(false);
            }
            catch (err) {
                setIsLoading(false);
                setType("error");
                setMessage("Erro ao carregar a pagina!");

            }
        }
        if (incluirExcluir === false) {
            fetchRemet();
        }
    }, [incluirExcluir]);

    function handleCurrentModEmailChange(e) {
        setCurrentModeloEmail(e.target.value)
        setEdite(false);
        if (e.target.value !== "") {
            setEdite(false)
            setAlterModeloEmail(contentModeloEmail[contentModeloEmail.findIndex((item) => item.id == e.target.value)]);
        } else {
            setAlterRementente("");
        }
    };

    function handleEditeOnClick() {
        setEdite(!edite)
    }

    function handleEditeOnChange(e) {

        setEditeButton(true);
        let { name, value } = e.target;

        setAlterModeloEmail((prevData) => ({
            ...prevData,
            [name]: value
        }))
    }



    function patchModeloEmail() {
        setMessage("");
        setType("");
        const pRet = async () => {
            setIsLoading(true);
            try {
                await fetch(`${conf.url}/update/modeloEmail`,
                    {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(alterModeloEmail)
                    });
                contentModeloEmail.forEach((item, index) => {
                    if (item.id == alterModeloEmail.id) {
                        let obj = [...contentModeloEmail];
                        obj[index] = alterModeloEmail;
                        setContentModeloEmail(obj);

                    }
                })
                setType('success');
                setMessage("Modelo Email alterado com sucesso!");
                handleEditeOnClick();
                setEditeButton(false);
                setIsLoading(false);

            } catch (err) {
                handleEditeOnClick();
                setEditeButton(false);
                setIsLoading(false);
                setType('error');
                setMessage("Erro ao alterar o Modelo Email");
            }


        }
        pRet();
    }

    function handleDeleteOnClick(id) {
        setIsLoading(true)
        setMessage("");
        setType("");

        const handleDelete = async () => {
            try {
                let deletar = await fetch(`${conf.url}/delete/modeloEmail`,
                    {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ id: id })
                    })
                setIsLoading(false);

                if (deletar.ok) {
                    let obj = [...contentModeloEmail];
                    obj = obj.filter(item => (item.id !== parseInt(id)));
                    setContentModeloEmail(obj);
                    setType('success');
                    setMessage("Modelo Email deletado com sucesso");
                    setCurrentModeloEmail(-1)
                } else {
                    setType('error');
                    setMessage("Erro ao apagar o Modelo Email");
                }
            } catch (err) {
                console.log(err)
                setIsLoading(false);
                setType('error');
                setMessage("Erro ao apagar a Modelo Email!");
            }
        }
        handleDelete();

    }

    console.log(alterModeloEmail)

    return (
        <div className={styles.modeloEmail}>

            <div className={styles.incluirExcluir}>

                <div className={styles.elementInEx}>

                    <label htmlFor="incluir"> Incluir </label>
                    <input type="checkbox" id="incluir" value={true}
                        checked={incluirExcluir} onChange={handleInExOnChange} />

                    <label htmlFor="incluir">
                        <IoIosCheckmarkCircle style={incluirExcluir ? { color: '#FFBB33' } : ""} />
                    </label>

                </div>
                <div className={styles.elementInEx}>

                    <label htmlFor="excluir">Alterar/Excluir </label>
                    <input type="checkbox" id="excluir" value={false}
                        checked={!incluirExcluir} onChange={handleInExOnChange} />
                    <label htmlFor="excluir">
                        <IoIosCheckmarkCircle style={!incluirExcluir ? { color: '#FFBB33' } : ""} />
                    </label>

                </div>

            </div>
            {incluirExcluir && (
                <div className={styles.alinhamentoEntradas}>
                    <p className={styles.entradas}>Informe: </p>
                    <div className={styles.entradas}>
                        <label htmlFor="">Nome: </label>
                        <input type="text" name="nome" onChange={handleInserMEOnChange} value={modeloEmail.nome} />
                    </div>
                    <div className={styles.entradas}>
                        <label htmlFor="">Titulo: </label>
                        <input type="text" name="titulo" onChange={handleInserMEOnChange} value={modeloEmail.titulo} />
                    </div>
                    <div className={`${styles.entradas} ${styles.corpo}`}>
                        <label htmlFor="">Corpo: </label>
                        <textarea name="corpo" onChange={handleInserMEOnChange} value={modeloEmail.corpo} />
                    </div>
                    <div className={`${styles.entradas} ${styles.ass}`}>
                        <label htmlFor="">Assinatura: </label>
                        <textarea  name="assinatura" onChange={handleInserMEOnChange} value={modeloEmail.assinatura} />
                    </div>
                    <div className={styles.entradas}>
                        <label htmlFor="">URL Assinatura: </label>
                        <input type="text" name="url_imagem" onChange={handleInserMEOnChange} value={modeloEmail.imagem_url} />
                    </div>
                    <div className={styles.button}>
                        <button onClick={handleIncluirModeloEmail}>Enviar</button>
                    </div>
                </div>
            )}

            {!incluirExcluir && (
                <div>
                    <div className={styles.entradas}>
                        <label htmlFor="">Modelo Email:</label>
                        <select name="Remetente" id="Remetente" onChange={handleCurrentModEmailChange} value={currentModeloEmail}>
                            <option key={""} value={-1}>Selecione Modelo Email</option>
                            {
                                contentModeloEmail.map((item, index) => (
                                    <option key={index} value={item.id}>{item.nome}</option>
                                ))
                            }
                        </select>

                        <div className={styles.e}>

                            <div className={`${styles.editarExcluir}`}>
                                <button onClick={handleEditeOnClick}>
                                    <MdModeEdit size={22} />
                                </button>
                                <button>
                                    <FaTrashAlt onClick={() => handleDeleteOnClick(currentModeloEmail)}
                                        size={18} />

                                </button>
                            </div>

                            {(editeButton) && (
                                <div className={styles.editarExcluir}>
                                    <button onClick={patchModeloEmail}><IoIosCheckmarkCircle size={22} /></button>
                                    <button onClick={handleEditeOnClick}><IoIosRemoveCircle size={22} /></button>
                                </div>)

                            }

                        </div>
                    </div>
                    <div>
                        {
                            contentModeloEmail.map((item, index) =>
                                (item.id === Number(currentModeloEmail)) && (
                                    <div>

                                        {(edite) ?
                                            (
                                                <div className={styles.alinhamentoEntradas}>

                                                    <div className={`${styles.entradas} ${styles.c}`}>
                                                        <label htmlFor="">Nome: </label>
                                                        <input type="text" name="nome" onChange={handleEditeOnChange} value={alterModeloEmail.nome} />
                                                    </div>
                                                    <div className={`${styles.entradas}  ${styles.c}`}>
                                                        <label htmlFor="">Titulo: </label>
                                                        <input type="text" name="titulo" onChange={handleEditeOnChange} value={alterModeloEmail.titulo} />
                                                    </div>
                                                    <div className={`${styles.entradas} ${styles.c} ${styles.corpo}`}>
                                                        <label htmlFor="">Corpo: </label>
                                                        <textarea type="text" name="corpo" onChange={handleEditeOnChange} value={alterModeloEmail.corpo} />
                                                    </div>
                                                    <div className={`${styles.entradas} ${styles.c} ${styles.ass}`}>
                                                        <label htmlFor="">Assinatura: </label>
                                                        <textarea type="text" name="assinatura" onChange={handleEditeOnChange} value={alterModeloEmail.assinatura} />
                                                    </div>
                                                    <div className={`${styles.entradas} ${styles.c}`}>
                                                        <label htmlFor="">URL Assinatura: </label>
                                                        <input type="text" name="imagem_url" onChange={handleEditeOnChange} value={alterModeloEmail.imagem_url} />
                                                    </div>
                                                </div>
                                            )
                                            : (
                                                <div>
                                                    <p className={`${styles.entradas} ${styles.b}`}>Nome: {item.nome}</p>
                                                    <p className={`${styles.entradas} ${styles.b}`}>Titulo: {item.titulo}</p>
                                                    <p className={`${styles.entradas} ${styles.b}`}>Corpo: {item.corpo}</p>
                                                    <p className={`${styles.entradas} ${styles.b}`}>Assinatura: {item.assinatura}</p>
                                                    <p className={`${styles.entradas} ${styles.b}`}>Url Imagem: {item.imagel_url}</p>
                                                </div>
                                            )
                                        }

                                    </div>)
                            )
                        }
                    </div>

                </div>
            )}

            <div className={styles.message}>
                {
                    isLoading && (
                        <Loading />
                    )}
            </div>
            <div className={styles.message}>
                <Message msg={message} type={type} reset={resetMessage} />
            </div>

        </div>
    );
}

export default Tags;