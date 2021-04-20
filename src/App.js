import './App.css';

import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import FruitsPage from './pages/FruitsPage';
import VegetablesPage from './pages/VegetablesPage';
import DiscountsPage from './pages/DiscountsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AllPage from './pages/AllPage';
import AboutUsPage from './pages/AboutUsPage';
import SignPage from './pages/SignPage';
import Footer from './components/Footer';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
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
      main: '#70d14f',
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
      text: {
        textTransform: 'none',
      }
    },
    MuiFormControl: {
      root: {
        minWidth: 210.4,
      }
    }
  },
  props: {
    MuiPaper: {
      elevation: 4,
    },
  },
});

function App() {
  return (
    <Container maxWidth="md" className="App">
      <ThemeProvider theme={theme}>
        <Router>
          <Navbar />
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route exact path="/fruits" component={FruitsPage} />
            <Route exact path="/vegetables" component={VegetablesPage} />
            <Route exact path="/product" component={ProductDetailPage} />
            <Route exact path="/discounts" component={DiscountsPage} />
            <Route exact path="/all" component={AllPage} />
            <Route exact path="/about" component={AboutUsPage} />
            <Route exact path="/login" component={SignPage} />
          </Switch>
          <Footer />
        </Router>
      </ThemeProvider>
    </Container>
  );
}

export default App;
