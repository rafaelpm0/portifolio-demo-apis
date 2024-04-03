import styles from './Tags.module.css'
import { useEffect, useState } from "react";
import conf from '../../../../conf'
import Loading from "../../../layout/Loading";
import Message from "../../../layout/Message";
import { MdModeEdit, } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import { IoIosRemoveCircle } from "react-icons/io";

function Tags() {

    const [incluirExcluir, setIncluirExcluir] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState();
    const [tag, setTag] = useState({});
    const [nameTags, setNameTags] = useState([]);
    const [contentTag, setContentTag] = useState([]);
    const [currentTag, setCurrentTag] = useState();
    const [alterTag, setAlterTag] = useState({});



    function resetMessage() {
        setMessage('');
    }

    function handleInExOnChange(e) {
        setIncluirExcluir(e.target.value === 'true');
    }

    function handleTaInsertgOnChange(e) {
        let { name, value } = e.target;


        if (value === "") {
            let obj = { ...tag };
            delete obj[name];
            setTag(obj);
        } else {
            setTag((prevData) => ({
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

    function handleIncluirTag() {

        if (Object.keys(tag).length !== 2) {
            setType("error");
            setMessage("Preencha todos os campos!");
            resetMessage();
            return;
        }

        setIsLoading(true);

        fetch(`${conf.url}/insert/tag`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tag)
        }).then(resp => {
            setIsLoading(false);
            setType('success');
            setMessage('Tag Incluida com sucesso');

        })
            .catch(resp => {
                setIsLoading(false);
                setType('error');
                setMessage('Erro na inclusão da tag');

            });
    }

    useEffect(() => {

        const fetchTag = async () => {

            try {
                setIsLoading(true);
                let resp = await fetch(`${conf.url}/search/tag`)
                let data = await resp.json();
                setContentTag(data);
                setIsLoading(false);
                let list = [];
                data.map((item) => { if (!list.includes(item.nome)) { list.push(item.nome) } })
                setNameTags(list);
            }
            catch (err) {
                setIsLoading(false);
                setType("error");
                setMessage("Erro ao carregar a pagina!");

            }
        }
        if (incluirExcluir === false) {
            fetchTag();
        }

    }, [incluirExcluir]);

    function handleCurrentTagChange(e) {
        setCurrentTag(e.target.value)
    };

    function handleEditeOnClick(item) {
        if (item.referencia === alterTag.referencia) {
            setAlterTag("")
            return;
        }
        setAlterTag(item);
    }

    function handleEditeOnChange(e) {
        setAlterTag((prevData) => ({
            ...prevData,
            retorno: e.target.value
        }))
    }

    function patchTag() {
        setMessage("");
        setType("");
        const pTag = async () => {
            setIsLoading(true);
            try {
                await fetch(`${conf.url}/update/tag`,
                    {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(alterTag)
                    });
                contentTag.forEach((item, index) => {
                    if (item.referencia == alterTag.referencia) {
                        let obj = [...contentTag];
                        obj[index] = alterTag;
                        setContentTag(obj);
                        setAlterTag("");

                    }
                })
                setIsLoading(false);
                setType('success');
                setMessage("Tag alterada com sucesso!");


            } catch (err) {

                setIsLoading(false);
                setType('error');
                setMessage("Erro ao alterar a Tag");
            }


        }
        pTag();
    }

    function handleDeleteOnClick(id) {
        setIsLoading(true)
        setMessage("");
        setType("");

        const handleDelete = async () => {
            try {
                let deletar = await fetch(`${conf.url}/delete/tag`,
                    {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ referencia: id })
                    })
                setIsLoading(false);

                if (deletar.ok) {
                    let obj = [...contentTag];
                    obj = obj.filter(item => (item.referencia !== id));
                    setContentTag(obj);
                    setType('success');
                    setMessage("Tag deletada com sucesso");
                } else {
                    setType('error');
                    setMessage("Erro ao apagar a Tag");
                }
            } catch (err) {
                console.log(err)
                setIsLoading(false);
                setType('error');
                setMessage("Erro ao apagar a Tag!");
            }
        }
        handleDelete();

    }
    
    return (
        <div className={styles.tags}>

            <div className={styles.incluirExcluir}>

                <div className={styles.elementInEx}>

                    <label htmlFor="incluir"> Incluir </label>
                    <input type="checkbox" id="incluir" value={true}
                        checked={incluirExcluir} onChange={handleInExOnChange} />

                    <label htmlFor="incluir">
                        <FaCheckCircle style={incluirExcluir ? { color: '#FFBB33' } : ""} />
                    </label>

                </div>
                <div className={styles.elementInEx}>

                    <label htmlFor="excluir">Alterar/Excluir </label>
                    <input type="checkbox" id="excluir" value={false}
                        checked={!incluirExcluir} onChange={handleInExOnChange} />

                    <label htmlFor="excluir">
                        <FaCheckCircle style={!incluirExcluir ? { color: '#FFBB33' } : ""} />
                    </label>

                </div>


            </div>
            {incluirExcluir && (
                <div className={styles.alinhamentoEntradas}>
                    <p className={styles.entradas}>Informe: </p>
                    <div className={styles.entradas}>
                        <label htmlFor="">Nome: </label>
                        <input type="text" name="nome" onChange={handleTaInsertgOnChange} />
                    </div>
                    <div className={styles.entradas}>
                        <label htmlFor="">Retorno: </label>
                        <input type="text" name="retorno" onChange={handleTaInsertgOnChange} />
                    </div>
                    <div className={styles.button}>
                        <button onClick={handleIncluirTag}>Enviar</button>
                    </div>


                </div>
            )}

            {!incluirExcluir && (
                <div>
                    <div className={styles.entradas}>
                        <label htmlFor="">Selecione a tag: </label>
                        <select name="tag" id="tag" onChange={handleCurrentTagChange}>
                            <option key={""} value={""}>Selecione uma tag</option>
                            {
                                nameTags.map((item) => (
                                    <option key={item} value={item}>{item}</option>
                                ))
                            }
                        </select>
                    </div>
                    <div>
                        {
                            contentTag.map((item) =>
                                (item.nome === currentTag) && (
                                    <div className={`${styles.entradas} ${styles.b} ${styles.c}`}>
                                        <label htmlFor="alterTag">{item.nome} : </label>

                                        {(alterTag.referencia === item.referencia) ?
                                            (
                                                <input name={item.nome} type="text"
                                                value={alterTag.retorno} onChange={handleEditeOnChange}  />

                                            )
                                            : (<p>{item.retorno}</p>)
                                        }

                                        <div className={styles.editarExcluir}>
                                            <button onClick={() => handleEditeOnClick(item)}>
                                                <MdModeEdit size={20} />
                                            </button>
                                            <button>
                                                <FaTrashAlt onClick={() => handleDeleteOnClick(item.referencia)}
                                                    size={16} />

                                            </button>
                                        </div>


                                        {((alterTag.referencia === item.referencia) && (alterTag.retorno !== item.retorno)) &&
                                            (<div className={styles.editarExcluir}>
                                                <button onClick={patchTag}><FaCheckCircle size={17}/></button>
                                                <button onClick={() => handleEditeOnClick(item)}><IoIosRemoveCircle size={20}/></button>
                                            </div>)

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