import logo from '../logo.svg';
// import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Container, makeStyles, List, ListItem, ListItemText } from '@material-ui/core';

const useStyles = makeStyles({
    navDisplayFlex: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    linkText: {
        textTransform: 'uppercase',
        color: 'black',
    },
    navbarDisplayFlex: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logo: {
        width: 70,
        height: 46,
    }
});

export default function Navbar() {
    const classes = useStyles();
    const navLinks = ['fruits', 'vegetables', 'discounts'];

    return (
        <AppBar position="fixed">
            <Toolbar>
                <Container className={classes.navbarDisplayFlex}>
                    <div className={classes.navbarDisplayFlex}>
                        <Link to="/">
                            <img className={classes.logo} src={logo} alt="logo" />
                        </Link>

                        <List className={classes.navDisplayFlex} component="nav" aria-labelledby="main navigation">
                            {navLinks.map((title) => (
                                <Link className={classes.linkText} to={title} key={title}>
                                    <ListItem button>
                                        <ListItemText primary={title} />
                                    </ListItem>
                                </Link>
                            ))}
                        </List>
                    </div>

                    <div className={classes.navDisplayFlex}>
                        <Link className={classes.linkText} to="/login">
                            <ListItem button>
                                <ListItemText primary="sign in" />
                            </ListItem>
                        </Link>
                    </div>
                </Container>
            </Toolbar>
        </AppBar>
    )
}