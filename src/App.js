import './App.css';

import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import FruitsPage from './pages/FruitsPage';
import VegetablesPage from './pages/VegetablesPage';
import DiscountsPage from './pages/DiscountsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AllPage from './pages/AllPage';
import ProfilePage from './pages/ProfilePage';
import BasketPage from './pages/BasketPage';
import AboutUsPage from './pages/AboutUsPage';
import SignPage from './pages/SignPage';
import Footer from './components/Footer';

import axios from 'axios';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { Container, ThemeProvider } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';
import { useState } from 'react';

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
    },
  },
  palette: {
    primary: {
      main: '#70d14f',
    },
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
      },
    },
    MuiFormControl: {
      root: {
        minWidth: 210.4,
      },
    },
  },
  props: {
    MuiPaper: {
      elevation: 4,
    },
  },
});

export default function App() {
  const [auth, setAuth] = useState(localStorage.getItem('user') !== null);

  window.addEventListener('storage', () => {
    if (localStorage.getItem('user') === null) {
      axios.get('http://localhost:4000/accounts/logout');
      window.location.reload();
    }
  }, false);

  axios.get('http://localhost:4000/user', { withCredentials: true })
    .then((res) => {
      if (res.data === '' && localStorage.getItem('user') !== null) {
        localStorage.removeItem('user');
        axios.get('http://localhost:4000/accounts/logout');
        window.location.reload();
      }
      else if (res.data !== '') {
        setAuth(true);
      }
    })
    .catch((err) => console.log(err));

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
            <Route exact path="/profile" render={() => (auth ? (<ProfilePage />) : (<Redirect to="/login" />))} />
            <Route exact path="/basket" render={() => (auth ? (<BasketPage />) : (<Redirect to="/login" />))} />
            <Route exact path="/about" component={AboutUsPage} />
            <Route exact path="/login" component={SignPage} />
          </Switch>
          <Footer />
        </Router>
      </ThemeProvider>
    </Container>
  );
}
