import styles from './App.module.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Portifolio from './components/pages/Portifolio';
import Contato from './components/pages/Contato';
import Instrucoes from './components/pages/api-email/Intrucoes';
import Cadastrar from './components/pages/api-email/Cadastrar.js';
import Enviar from './components/pages/api-email/Enviar';
 
function App() {
  return (
    <Router>
      <NavBar classname={styles.navbarFooter}/>
      <div className={styles.body}>
      <Routes>
        <Route path="/" element={<Portifolio />} />
        <Route path="/contato" element={<Contato />} />
        <Route path='/instrucoes' element={<Instrucoes/>} />
        <Route path='/cadastrar' element={<Cadastrar/>} />
        <Route path='/enviar' element={<Enviar/>} />
      </Routes>
      </div>
      <Footer classname={styles.navbarFooter}/>
    </Router>

  );
}

export default App;
