import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Portifolio from './components/pages/Portfolio';
import Contato from './components/pages/Contato';
import Container from './components/layout/Container';
import Instrucoes from './components/pages/api-email/Intrucoes';
import Cadastrar from './components/pages/api-email/Cadastrar.js';
import Enviar from './components/pages/api-email/Enviar';
 
function App() {
  return (
    <Router>
      <NavBar />
      <Container customClass='minHeight'>
      <Routes>
        <Route path="/" element={<Portifolio />} />
        <Route path="/contato" element={<Contato />} />
        <Route path='/instrucoes' element={<Instrucoes/>} />
        <Route path='/cadastrar' element={<Cadastrar/>} />
        <Route path='/enviar' element={<Enviar/>} />
      </Routes>
      </Container>
      <Footer/>
    </Router>

  );
}

export default App;
