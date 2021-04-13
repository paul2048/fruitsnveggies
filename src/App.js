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
            textShadow: '2px 2px 1px seashell',
            textTransform: 'uppercase',
        },
        h3: {
            fontWeight: 800,
            textShadow: '1px 1px 1px seashell',
            textTransform: 'capitalize',
        }
    },
    palette: {
        primary: {
            main: '#56ab45',
        }
    },
    shape: {
        borderRadius: 50,
    },
    overrides: {
        MuiButton: {
            sizeLarge: {
                height: 56,
            },
        },
    },
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
