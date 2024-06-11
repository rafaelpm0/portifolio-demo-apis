import styles from './Portifolio.module.css'
import perfil from '../../img/perfil.jpg'
function Portifolio() {

    return (
        <div className={styles.portifolio}>

            <div className={styles.introduction}>
                <img src={perfil} alt="Foto de perfil" />
                <div className={styles.intItems}>
                    <p>Portfolio de apresentação:</p>
                    <p>Rafael Pinho Medeiros, 26 anos</p>
                    <p>Ciência da Computação - UNIVALI | Ciências Contábeis - UNISUL</p>
                </div>
            </div>
            <div className={styles.apresentacao}>
                <p>APRESENTAÇÃO</p>
                <p>Contador formado, porém após algumas experiências profissionais no qual me aprofundei
                    em excel/macros, me interessei profundamente pela programação e particularmente pelo
                    desenvolvimento de soluções lógicas e criativas. Assim iniciei meus estudos por conta em
                    Python e posteriormente iniciei minha graduação em Ciências da Computação. Me
                    considero uma pessoa resiliente e com muita vontade de me desenvolver como
                    desenvolvedor, interesse no qual surgiu após o desenvolvimento de um projeto utilizando
                    pandas que auxiliava o escritório de contabilidade no qual atuava. Hoje busco
                    uma oportunidade para poder me inserir na área de desenvolvimento de
                    tecnologia.</p>
            </div>
            <ul className={styles.list}>
                <li>
                    <p>BASE CONTABILIDADE - ASSISTENTE FISCAL PLENO</p>
                    <p>Novembro de 2021 - Setembro 2023</p>
                    <p>Responsável pelas rotinas fiscais pertinentes à apuração de empresas
                        Simples Nacional e Lucro Presumido, incluindo lançamento de documentos,
                        envio de declarações acessórias (DIME, SPED IPI/ICMS, SPED CONTRIBUIÇÕES
                        E SINTEGRA-SC) e demais rotinas. Criação de planilhas auxiliares para conferência de informações</p>
                </li>
                <li>
                    <p>EQS Engenharia - ASSISTENTE DE FATURAMENTO</p>
                    <p>MAIO DE 2021 - NOVEMBRO DE 2021</p>
                    <p>Responsável por comprir o cronograma de faturamento, emissão de notas
                        fiscais eletrônicas, criação de planilhas para importação de informações
                        e obrigações acessórias</p>
                </li>
                <li>
                    <p>Brasao Sistemas - SUPORTE TÉC. AO USUÁRIO NÍVEL 2</p>
                    <p>NOVEMBRO DE 2017 - MARÇO DE 2020</p>
                    <p>Responsável por suporte técnico do ERP-RADAR ao cliente por telefone,
                        acesso remoto ou outros meios correlatos. Manutenção/Atualização do ERP,
                        identificação de erros do usuário ou do sistema e treinamentos pontuais.
                    </p>
                </li>
            </ul>
            <ul className={styles.list}>
                <li>
                    <p>FORMAÇÃO</p>
                    <p>UNISUL, CIÊNCIAS CONTÁBEIS, BACHARELADO, 06/2015 - 08/2019</p>    
                    <p>UNIVALI, CIÊNCIA DA COMPUTAÇÃO, BACHARELADO, 02/2023</p>
                </li>                  
            </ul>

            <ul className={styles.list}>
                <li>
                    <p>COMPETÊNCIAS</p>
                    <p>Python</p>
                    <p>C++</p>
                    <p>HTML/CSS/React</p>
                    <p>Ingles avançado</p>
                </li>
            </ul>
        </div>

    )
}

export default Portifolio;