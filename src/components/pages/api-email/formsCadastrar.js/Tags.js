import styles from './Tags.module.css'
import { useEffect, useState } from "react";
import conf from '../../../../conf'
import Loading from "../../../layout/Loading";
import Message from "../../../layout/Message";
import { FaPencilAlt } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";

function Tags() {

    const [incluirExcluir, setIncluirExcluir] = useState(true);
    const [tagRetorno, setTagRetorno] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState();
    const [tag, setTag] = useState({});
    const [nameTags, setNameTags] = useState([]);
    const [contentTag, setContentTag] = useState([]);
    const [currentTag, setCurrentTag] = useState();
    const [alterTag, setAlterTag] = useState({});

    function handleInExOnChange(e) {
        setIncluirExcluir(e.target.value === 'true');
    }

    function handleTagRetOnChange(e) {
        setTagRetorno(e.target.value === 'true');
        setTag({});
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

        if (((Object.keys(tag).length !== 2) && (tagRetorno === false))   /*Regra para tag, um campo e não pode ser repetido. Regra para retorno
        2 campos apenas*/
        || ((Object.keys(tag).length !== 1) && (tagRetorno === true))) {
            setType("error");
            setMessage("Preencha todos os campos!");
            resetMessage();
            return;
        }

        for (let i = 0; i < contentTag.length; i++) {
            let element = contentTag[i];
            if ((tagRetorno === true) && (tag.nome === element.nome)) {
                setType("error");
                setMessage("Tag existente!");
                resetMessage();
                return;
            }
            if ((tagRetorno === false) && ((tag.nome === element.nome) && ((tag.retorno === element.retorno)))) {
                setType("error");
                setMessage("Retorno já cadastrado!");
                resetMessage();
                return;
            }
        };
        
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
            resetMessage();
            contentTag.push(tag);

        })
            .catch(resp => {
                setIsLoading(false);
                setType('error');
                setMessage('Erro na inclusão da tag');
                resetMessage();

            });
    }

    function atualizarNametags(data){
                let list = [];
                data.forEach((item) => {
                    if (!list.includes(item.nome)) {
                      list.push(item.nome);
                    }
                  });
                setNameTags(list);
    }

    useEffect(() => {

        const fetchTag = async () => {

            try {
                setIsLoading(true);
                let resp = await fetch(`${conf.url}/search/tag`)
                let data = await resp.json();
                setContentTag(data);
                setIsLoading(false);
                atualizarNametags(data);
            }
            catch (err) {
                setIsLoading(false);
                setType("error");
                setMessage("Erro ao carregar a pagina!");

            }
        }
        fetchTag();

    }, [incluirExcluir, tagRetorno]);
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
                    if (item.referencia === alterTag.referencia) {
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

    function handleDeleteOnClick(tag) {
        setMessage("");
        setType("");

            let cont=0;
            for(let i=0; i< contentTag.length; i++){
                if(contentTag[i].nome === tag.nome){
                    cont++;
                    if((cont > 1))
                    break;
                }
            }

            if((tag.retorno === null) && (cont > 1)){
                setType('error');
                setMessage("Exclua os demais!");
                resetMessage();
                return;
            }
        setIsLoading(true)    
        const handleDelete = async () => {
            try {
                let deletar = await fetch(`${conf.url}/delete/tag`,
                    {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ referencia: tag.referencia })
                    })
                setIsLoading(false);

                if (deletar.ok) {
                    let obj = [...contentTag];
                    obj = obj.filter(item => (item.referencia !== tag.referencia));
                    setContentTag(obj);
                    setType('success');
                    setMessage("Tag deletada com sucesso");
                    atualizarNametags(contentTag);
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

                <div>
                    <div class={styles.tagRetorno}>
                        <div className={styles.elementInEx}>

                            <label htmlFor="tag"> Tag </label>
                            <input type="checkbox" id="tag" value={true}
                                checked={tagRetorno} onChange={handleTagRetOnChange} />

                            <label htmlFor="tag">
                                <FaCheckCircle style={tagRetorno ? { color: '#FFBB33' } : ""} />
                            </label>

                        </div>
                        <div className={styles.elementInEx}>

                            <label htmlFor="retorno"> Retorno </label>
                            <input type="checkbox" id="retorno" value={false}
                                checked={!tagRetorno} onChange={handleTagRetOnChange} />

                            <label htmlFor="retorno">
                                <FaCheckCircle style={!tagRetorno ? { color: '#FFBB33' } : ""} />
                            </label>

                        </div>
                    </div>

                    <div className={styles.alinhamentoEntradas}>
                        <p className={styles.entradas}>Informe: </p>


                        {tagRetorno && (
                            <div className={styles.entradas}>
                                <label htmlFor="tag">Tag: </label>
                                <input type="text" name="nome" onChange={handleTaInsertgOnChange} />
                            </div>
                        )}


                        {!tagRetorno && (
                            <div>
                                <div className={styles.entradas}>
                                    <label htmlFor="">Nome: </label>
                                    <select name="nome" id="nome" onChange={handleTaInsertgOnChange}>
                                        <option key={"nome"} value={""}>Selecione uma tag</option>
                                        {
                                            nameTags.map((item) => (
                                                <option key={item} value={item}>{item}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                                <div className={styles.entradas}>
                                    <label htmlFor="">Retorno: </label>
                                    <input type="text" name="retorno" onChange={handleTaInsertgOnChange} />
                                </div>
                            </div>
                        )}

                        <div className={styles.button}>
                            <button onClick={handleIncluirTag}>Enviar</button>
                        </div>
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
                                                    value={alterTag.retorno} onChange={handleEditeOnChange} />

                                            )
                                            : (<p>{item.retorno}</p>)
                                        }

                                        <div className={styles.editarExcluir}>
                                            <button onClick={() => handleEditeOnClick(item)}>
                                                <FaPencilAlt  size={20} />
                                            </button>
                                            <button onClick={() => handleDeleteOnClick(item)}>
                                                <FaTrashAlt 
                                                    size={16} />

                                            </button>
                                        </div>


                                        {((alterTag.referencia === item.referencia) && (alterTag.retorno !== item.retorno)) &&
                                            (<div className={styles.editarExcluir}>
                                                <button onClick={patchTag}><FaCheckCircle size={17} /></button>
                                                <button onClick={() => handleEditeOnClick(item)}>d1</button>
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