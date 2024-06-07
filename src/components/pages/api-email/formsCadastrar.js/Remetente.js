import styles from './Remetente.module.css'
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

    const [remetente, setRementente] = useState({}); // quando altera no incluir
    const [contentRemet, setContentRemet] = useState([]);
    const [currentRemet, setCurrentRemet] = useState();
    const [edite, setEdite] = useState(false);
    const [editeButton, setEditeButton] = useState(false);
    const [alterRementente, setAlterRementente] = useState({});


    const [message, setMessage] = useState('');
    const [type, setType] = useState();


    function resetMessage() {
        setMessage('');
    }

    function handleInExOnChange(e) {
        setIncluirExcluir(e.target.value === 'true');
    }

    function handleTaInserRTOnChange(e) {
        let { name, value } = e.target;


        if (value === "") {
            let obj = { ...remetente };
            delete obj[name];
            setRementente(obj);
        } else {
            setRementente((prevData) => ({
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

    function handleIncluirRemetente() {

        let a = remetente.hasOwnProperty('nome');
        let b = remetente.hasOwnProperty('email');


        if (!(a && b)) {
            setType("error");
            setMessage("Campos obrigatórios: Nome e Email.");
            resetMessage();
            return;
        }

        setIsLoading(true);

        fetch(`${conf.url}/insert/remetente`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(remetente)
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
                let resp = await fetch(`${conf.url}/search/remetente`)
                let data = await resp.json();

                setContentRemet(data)
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

    function handleCurrentRemetChange(e) {
        setCurrentRemet(e.target.value)
        setEdite(false);
        if (e.target.value !== "") {
            setEdite(false)
            setAlterRementente(contentRemet[contentRemet.findIndex((item) => item.id === parseInt(e.target.value, 10))]);
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

        setAlterRementente((prevData) => ({
            ...prevData,
            [name]: value
        }))
    }



    function patchRemetente() {
        setMessage("");
        setType("");
        const pRet = async () => {
            setIsLoading(true);
            try {
                await fetch(`${conf.url}/update/remetente`,
                    {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(alterRementente)
                    });
                contentRemet.forEach((item, index) => {
                    if (item.id === alterRementente.id) {
                        let obj = [...contentRemet];
                        obj[index] = alterRementente;
                        setContentRemet(obj);

                    }
                })
                setType('success');
                setMessage("Remetente alterado com sucesso!");
                handleEditeOnClick();
                setEditeButton(false);
                setIsLoading(false);

            } catch (err) {
                handleEditeOnClick();
                setEditeButton(false);
                setIsLoading(false);
                setType('error');
                setMessage("Erro ao alterar o Rementente");
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
                let deletar = await fetch(`${conf.url}/delete/remetente`,
                    {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ id: id })
                    })
                setIsLoading(false);

                if (deletar.ok) {
                    let obj = [...contentRemet];
                    obj = obj.filter(item => (item.id !== parseInt(id)));
                    setContentRemet(obj);
                    setType('success');
                    setMessage("Remetente deletado com sucesso");
                    setCurrentRemet(-1)
                } else {
                    setType('error');
                    setMessage("Erro ao apagar o Remetente");
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
        <div className={styles.remetente}>

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
                        <input type="text" name="nome" onChange={handleTaInserRTOnChange} value={remetente.nome} />
                    </div>
                    <div className={styles.entradas}>
                        <label htmlFor="">Email: </label>
                        <input type="text" name="email" onChange={handleTaInserRTOnChange} value={remetente.email} />
                    </div>
                    <div className={styles.entradas}>
                        <label htmlFor="">Telefone: </label>
                        <input type="text" name="telefone" onChange={handleTaInserRTOnChange} value={remetente.telefone} />
                    </div>
                    <div className={styles.entradas}>
                        <label htmlFor="">Informação adicional 1: </label>
                        <input type="text" name="info_ad_1" onChange={handleTaInserRTOnChange} value={remetente.info_ad_1} />
                    </div>
                    <div className={styles.entradas}>
                        <label htmlFor="">Informação adicional 2: </label>
                        <input type="text" name="info_ad_2" onChange={handleTaInserRTOnChange} value={remetente.info_ad_2} />
                    </div>
                    <div className={styles.entradas}>
                        <label htmlFor="">Informação adicional 3: </label>
                        <input type="text" name="info_ad_3" onChange={handleTaInserRTOnChange} value={remetente.info_ad_3} />
                    </div>
                    <div className={styles.button}>
                        <button onClick={handleIncluirRemetente}>Enviar</button>
                    </div>
                </div>
            )}

            {!incluirExcluir && (
                <div>
                    <div className={styles.entradas}>
                        <label htmlFor="">Remetente: </label>
                        <select name="Remetente" id="Remetente" onChange={handleCurrentRemetChange} value={currentRemet}>
                            <option key={""} value={-1}>Selecione Rementente</option>
                            {
                                contentRemet.map((item, index) => (
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
                                    <FaTrashAlt onClick={() => handleDeleteOnClick(currentRemet)}
                                        size={18} />

                                </button>
                            </div>

                            {(editeButton) && (
                                <div className={styles.editarExcluir}>
                                    <button onClick={patchRemetente}><IoIosCheckmarkCircle size={22} /></button>
                                    <button onClick={handleEditeOnClick}><IoIosRemoveCircle size={22} /></button>
                                </div>)

                            }

                        </div>
                    </div>
                    <div>
                        {
                            contentRemet.map((item, index) =>
                                (item.id === Number(currentRemet)) && (
                                    <div>

                                        {(edite) ?
                                            (
                                                <div className={styles.alinhamentoEntradas}>

                                                    <div className={`${styles.entradas} ${styles.b} ${styles.c}`}>
                                                        <label htmlFor="">Nome: </label>
                                                        <input type="text" name="nome" onChange={handleEditeOnChange} value={alterRementente.nome} />
                                                    </div>
                                                    <div className={`${styles.entradas} ${styles.b} ${styles.c}`}>
                                                        <label htmlFor="">Email: </label>
                                                        <input type="text" name="email" onChange={handleEditeOnChange} value={alterRementente.email} />
                                                    </div>
                                                    <div className={`${styles.entradas} ${styles.b} ${styles.c}`}>
                                                        <label htmlFor="">Telefone: </label>
                                                        <input type="text" name="telefone" onChange={handleEditeOnChange} value={alterRementente.telefone} />
                                                    </div>
                                                    <div className={`${styles.entradas} ${styles.b} ${styles.c}`}>
                                                        <label htmlFor="">Informação adicional 1: </label>
                                                        <input type="text" name="info_ad_1" onChange={handleEditeOnChange} value={alterRementente.info_ad_1} />
                                                    </div>
                                                    <div className={`${styles.entradas} ${styles.b} ${styles.c}`}>
                                                        <label htmlFor="">Informação adicional 2: </label>
                                                        <input type="text" name="info_ad_2" onChange={handleEditeOnChange} value={alterRementente.info_ad_2} />
                                                    </div>
                                                    <div className={`${styles.entradas} ${styles.b} ${styles.c}`}>
                                                        <label htmlFor="">Informação adicional 3: </label>
                                                        <input type="text" name="info_ad_3" onChange={handleEditeOnChange} value={alterRementente.info_ad_3} />
                                                    </div>
                                                </div>
                                            )
                                            : (
                                                <div>
                                                    <p className={`${styles.entradas} ${styles.b}`}>Nome: {item.nome}</p>
                                                    <p className={`${styles.entradas} ${styles.b}`}> Email: {item.email}</p>
                                                    <p className={`${styles.entradas} ${styles.b}`}>Telefone: {item.telefone}</p>
                                                    <p className={`${styles.entradas} ${styles.b}`}>Info adicional 1: {item.info_ad_1}</p>
                                                    <p className={`${styles.entradas} ${styles.b}`}>Info adicional 2: {item.info_ad_2}</p>
                                                    <p className={`${styles.entradas} ${styles.b}`}>Info adicional 3: {item.info_ad_3}</p>
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