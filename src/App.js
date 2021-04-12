import './App.css';
import Navbar from './components/Navbar.js';
import Main from './components/Main.js';
import Footer from './components/Footer.js';
import { Container } from '@material-ui/core';

function App() {
  return (
    <Container maxWidth="md" className="App">
      <Navbar />
      <Main />
      <Footer />
    </Container>
  );
}

export default App;
