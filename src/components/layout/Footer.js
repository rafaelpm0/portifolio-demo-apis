import instagram from '../../img/instagram.svg';
import github from '../../img/github.svg';
import wpp from '../../img/whatsapp.svg';
import styles from './Footer.module.css';
import email from '../../img/gmail.svg'

function Footer(){
    return (
        <footer className={styles.footer}>
            <div>
                <p className={styles.cont}>Contato: </p>
            </div>
            
            <ul className={styles.list}>
                <li className={styles.item}><a href="https://www.instagram.com/rafaelm0_/" target='_blanck'>
                    <img src={instagram} alt="Instagram" className={styles.img}/></a>
                </li>
                <li className={styles.item}><a href="https://github.com/rafaelpm0/" target='_blanck'>
                    <img src={github} alt="Github" className={styles.img}/></a>
                </li>
                <li className={styles.item}><a href="https://wa.me/5548998385803/" target='_blanck'>
                    <img src={wpp} alt="WhatsApp" className={styles.img}/></a>
                </li>
                <li className={styles.item}><a href="mailto:rafaelpmedeiros00@gmail.com" target='_blanck'>
                    <img src={email} alt="WhatsApp" className={styles.img}/></a>
                </li>
            </ul>
        </footer>
    )
}

export default Footer;