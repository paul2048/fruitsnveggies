import './App.css';
import Navbar from './components/Navbar.js';
import Main from './components/Main.js';
import Footer from './components/Footer.js';
import { Container, ThemeProvider } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  typography: {
    h2: {
      fontWeight: 900,
    },
    h3: {
      fontWeight: 900,
    }
  },
  shape: {
    borderRadius: 50,
  }
});

function App() {
  return (
    <Container maxWidth="md" className="App">
      <ThemeProvider theme={theme}>
        <Navbar />
        <Main />
        <Footer />
      </ThemeProvider>
    </Container>
  );
}

export default App;
