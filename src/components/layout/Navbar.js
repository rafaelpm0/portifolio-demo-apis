import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';
import logo from '../../img/logo.png';
import { useState } from 'react';

function NavBar({ classname }) {

    const [showOptions, setShowOptions] = useState(false)
    const [showOptionsB, setShowOptionsB] = useState(false)

    return (
        <nav className={classname}>

            <a to='/' className={styles.logo}>
                <img src={logo} alt="Logo" />
            </a>

            <ul className={`${styles.menu}`}>

                <li className={styles.item}>
                    <Link to='/'>PORTFOLIO</Link>
                </li>
                <li className={`${styles.item}`}
                    onMouseEnter={() => setShowOptions(true)}
                    onMouseLeave={() => setShowOptions(false)}
                >API

                    {showOptions && (
                        <div className={styles.sub_options}>
                            <p className={styles.itemB}
                                onMouseEnter={() => setShowOptionsB(true)}
                                onMouseLeave={() => setShowOptionsB(false)}
                            >Email
                                {showOptionsB && (
                                    <div className={`${styles.sub_options} ${styles.sub_optionsB}`}>
                                        <ul>
                                            <li>
                                                <Link to="/instrucoes">
                                                    <p className={styles.itemB}>Instruções</p>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/cadastrar">
                                                    <p className={styles.itemB}>Cadastrar</p>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/enviar">
                                                    <p className={styles.itemB}>Enviar</p>
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                )}

                            </p>
                        </div>
                    )

                    }</li>
                <li className={styles.item}>
                    <Link to='/contato'>CONTATO</Link>
                </li>
            </ul>
        </nav>
    )
}

export default NavBar;