import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';
import logo from '../../img/logo.png';
import { useState } from 'react';

function NavBar() {

    const [showOptions, setShowOptions] = useState(false)
    const [showOptionsB, setShowOptionsB] = useState(false)

    return (
        <nav className={styles.nav}>
            <Link to='/'>
                <img src={logo} alt="Logo" className={styles.logo} />
            </Link>
            <ul className={styles.list}>
                <li className={styles.item}><Link to='/'>PORTIFOLIO</Link></li>
                <li className={`${styles.item} ${styles.option}`}
                    onMouseEnter={() => setShowOptions(true)}
                    onMouseLeave={() => setShowOptions(false)}
                >API

                    {showOptions && (
                        <div className={styles.sub_options}>
                            <p className={styles.sub_option}
                                onMouseEnter={() => setShowOptionsB(true)}
                                onMouseLeave={() => setShowOptionsB(false)}
                            >Email
                                {showOptionsB && (
                                    <div className={styles.sub_optionsB}>
                                        <a href="/instrucoes">
                                            <p className={styles.sub_option}>Instruções</p>
                                        </a>
                                        <a href="/cadastrar">
                                            <p className={styles.sub_option}>Cadastrar</p>
                                        </a>
                                        <a href="/enviar">
                                            <p className={styles.sub_option}>Enviar</p>
                                        </a>



                                    </div>
                                )}

                            </p>
                        </div>
                    )

                    }</li>
                <li className={styles.item}><Link to='/contato'>CONTATO</Link></li>
            </ul>
        </nav>
    )
}

export default NavBar;