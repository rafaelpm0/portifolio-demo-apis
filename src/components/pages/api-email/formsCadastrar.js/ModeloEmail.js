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
    const [message, setMessage] = useState('');
    const [type, setType] = useState("");
    const [modeloEmail, setModeloEmail] = useState({});
    const [tags, setTags] = useState([]);
    const [addtags, setAddTags] = useState([])
    const [contentModeloEmail, setContentModeloEmail] = useState([]);
    const [currentModeloEmail, setCurrentModeloEmail] = useState();
    const [alterModeloEmail, setAlterModeloEmail] = useState({});
    const [tagsEmail, setTagsEmail] = useState({})
    

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
        let d = modeloEmail.hasOwnProperty('assinatura');

        if ((!(a && b && c && d))) {
            setType("error");
            setMessage("Campos obrigatórios: Nome, Titulo, Corpo e Assinatura.");
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
            return resp.json();
        }).then(resp => {
            return Promise.all(handleIncluirTag(resp.id, addtags));
        }).then(resp =>{
            setIsLoading(false);  
            setType('success');
            setMessage('Email modelo incluido com sucesso');
            resetMessage();    
        })
                
            .catch(err => {
                setIsLoading(false);
                setType('error');
                setMessage('Erro na inclusão do Modelo de Email');
                resetMessage();

            });
    }


function handleIncluirTag(idEmail, lista) {
        const promises = lista.map(item =>
            new Promise((resolve, reject) => {
                fetch(`${conf.url}/insert/ModeloEmail_tag`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({id_modeloEmail: idEmail, nome_tag: item})
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Erro na solicitação');
                    }
                    resolve(); // Resolva a Promise se a solicitação for bem-sucedida
                })
                .catch(error => reject(error)); // Rejeita a Promise se houver erro na solicitação
            })
        );
        return promises;
    }
    
    useEffect(() => {

        const fetchData = async () => {

            try {
                setIsLoading(true);
                let resp = await fetch(`${conf.url}/search/modeloEmail`)
                let data = await resp.json();
                setContentModeloEmail(data)


                resp = await fetch(`${conf.url}/search/modeloEmail_tag`);
                data = await resp.json();

                setTagsEmail(data)

                resp = await fetch(`${conf.url}/search/tagEmpty`);
                data = await resp.json();
                setTags(data);


                setIsLoading(false);

            }
            catch (err) {
                setIsLoading(false);
                setType("error");
                setMessage("Erro ao carregar a pagina!");

            }
        }

        fetchData();
    }, [incluirExcluir]);

    function handleCurrentModEmailChange(e) {
        setCurrentModeloEmail(e.target.value)
        setEdite(false);
        if (e.target.value !== "") {
            setEdite(false)
            setAlterModeloEmail(contentModeloEmail[contentModeloEmail.findIndex((item) => item.id === parseInt(e.target.value, 10))]);
        } else {
            setModeloEmail("");
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
                    if (item.id === alterModeloEmail.id) {
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
                setIsLoading(false);
                setType('error');
                setMessage("Erro ao apagar a Modelo Email!");
            }
        }
        handleDelete();
    }

    function onClickAddTag(e) {
        let elemento = document.getElementById("tags")

        if ((elemento.value !== "") && !addtags.includes(elemento.value)) {
            setAddTags(prevData => [...prevData,
            elemento.value])
        } else {
            if(elemento.value !== ""){
            setType('error');
            setMessage("Tag já incluida!")
            resetMessage();
            } else {
                setType('error');
            setMessage("Selecione uma Tag!")
            resetMessage();
            }
        }

    }
    function onClickDeleteAddTag(item) {
        setAddTags(addtags.filter(element => element !== item));
    }

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
                        <label htmlFor="nome">Nome: </label>
                        <input type="text" name="nome" onChange={handleInserMEOnChange} value={modeloEmail.nome} />
                    </div>
                    <div className={styles.entradas}>
                        <label htmlFor="titulo">Titulo: </label>
                        <input type="text" name="titulo" onChange={handleInserMEOnChange} value={modeloEmail.titulo} />
                    </div>
                    <div className={`${styles.entradas} ${styles.corpo}`}>
                        <label htmlFor="corpo">Corpo: </label>
                        <textarea name="corpo" onChange={handleInserMEOnChange} value={modeloEmail.corpo} />
                    </div>
                    <div className={`${styles.entradas} ${styles.ass}`}>
                        <label htmlFor="assinatura">Assinatura: </label>
                        <textarea name="assinatura" onChange={handleInserMEOnChange} value={modeloEmail.assinatura} />
                    </div>
                    <div className={styles.entradas}>
                        <label htmlFor="url_imagem">URL Assinatura: </label>
                        <input type="text" name="url_imagem" onChange={handleInserMEOnChange} value={modeloEmail.imagem_url} />
                    </div>
                    <div className={`${styles.entradas} ${styles.button} ${styles.bSize}`}>
                        <label htmlFor="tags">Tags: </label>
                        <select name="tags" id="tags" >
                            <option value={""}>Selecione uma tag</option>
                            {
                                tags.map(element => (
                                    <option value={element.nome}>{element.nome}</option>
                                ))
                            }

                        </select>
                        <button onClick={onClickAddTag} className={styles}>Adicionar</button>
                    </div>
                    <div className={styles.mostrarTags}>
                    {
                            addtags.map(element => (
                                <div>
                                    <p>{element}</p>
                                    <button onClick={() => onClickDeleteAddTag(element)}>Apagar</button>
                                </div>

                            ))
                        }
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
                                                    <p className={styles.entradas}>Nome: {item.nome}</p>
                                                    <p className={styles.entradas}>Titulo: {item.titulo}</p>
                                                    <p className={styles.entradas}>Corpo: {item.corpo}</p>
                                                    <p className={styles.entradas}>Assinatura: {item.assinatura}</p>
                                                    <p className={styles.entradas}>Url Imagem: {item.imagel_url}</p>
                                                    <ul className={`${styles.entradas} ${styles.tags}`}>Tags:
                                                        {

                                                            tagsEmail.map((element, index) => {
                                                                if (parseInt(currentModeloEmail, 10) === element.id_modeloEmail) {
                                                                    return <li key={index}>{element.nome_tag} | </li>;
                                                                }else{
                                                                    return null
                                                                }
                                                            })
                                                        }

                                                    </ul>
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