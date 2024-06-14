import instagram from '../../img/instagram.svg';
import github from '../../img/github.svg';
import wpp from '../../img/whatsapp.svg';
import email from '../../img/gmail.svg'
import styles from './Contato.module.css';

function Contato() {
    return (
        <div class={styles.contato}>
            <ul>
                <li>
                    <a href="https://www.instagram.com/rafaelm0_/" target='_blanck'>
                        <img src={instagram} alt="Instagram" />
                    </a>
                    <p>Instagram: rafael_pm0</p>
                </li>
                <li>
                    <a href="https://github.com/rafaelpm0/" target='_blanck'>
                        <img src={github} alt="Github"/>
                    </a> 
                    <p>GitHub: https://github.com/rafaelpm0</p>
                </li>
                <li>
                    <a href="https://wa.me/5548998385803/" target='_blanck'>
                    <img src={wpp} alt="WhatsApp"/></a> 
                    <p>Telefone(+55): 48 99838-5803 </p>
                </li>
                <li>
                    <a href="mailto:rafaelpmedeiros00@gmail.com" target='_blanck'>
                    <img src={email} alt="WhatsApp"/></a>
                    <p>Email: rafaelpmedeiros00@gmail.com</p>
                </li>
            </ul>
        </div>
    )
}

export default Contato;