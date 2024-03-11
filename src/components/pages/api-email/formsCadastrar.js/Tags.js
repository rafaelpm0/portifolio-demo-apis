import { useState } from "react";

function Tags() {

    const [incluirExcluir, setIncluirExcluir] = useState(true);
    const [incluirAlterar, setIncluirAlterar] = useState(true);


    function handleInExOnChange(e) {
        setIncluirExcluir(e.target.value === 'true');
    }

    function handleInAlOnChange(e) {
        setIncluirAlterar(e.target.value === 'true');
    }

    return (
        <div>
            <div>
                <div>
                    <div>
                        <label htmlFor="incluir"> Incluir </label>
                        <input type="checkbox" id="incluir" value={true}
                            checked={incluirExcluir} onChange={handleInExOnChange} />
                    </div>
                    <div>
                        <label htmlFor="excluir">Excluir</label>
                        <input type="checkbox" id="excluir" value={false}
                            checked={!incluirExcluir} onChange={handleInExOnChange} />
                    </div>
                </div>

            </div>
            {incluirExcluir && (
                <div>
                    <div>
                        <label htmlFor="incluir"c>Incluir </label>
                        <input type="checkbox" id="incluir" value={true}
                            checked={incluirAlterar} onChange={handleInAlOnChange} />

                    </div>
                    <div>
                        <label htmlFor="excluir">   Alterar   </label>
                        <input type="checkbox" id="alterar" value={false}
                            checked={!incluirAlterar} onChange={handleInAlOnChange} />
                    </div>

                    {incluirAlterar && (
                        <div>
                            <div>
                                <label htmlFor=""></label>
                                <input type="text" />
                            </div>


                        </div>
                    )}

                    {!incluirAlterar && (
                        <div>Alterar</div>
                    )}
                </div>
            )}


            {!incluirExcluir && (
                <div>
                    <p>Excluir</p>
                </div>
            )}


        </div>
    );
}

export default Tags;