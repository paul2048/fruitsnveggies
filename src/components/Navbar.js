import logo from '../logo.svg';
// import { useState } from 'react';
import { AppBar, Toolbar, Container, makeStyles, List, ListItem, ListItemText } from '@material-ui/core';

const useStyles = makeStyles({
    navDisplayFlex: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    linkText: {
        textDecoration: 'none',
        textTransform: 'uppercase',
        color: 'white',
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
    const navLinks = [
        { title: 'fruits', path: '/fruits' },
        { title: 'vegetables', path: '/vegetables' },
        { title: 'discounts', path: '/discounts' },
        { title: 'about us', path: '/about' }
    ];

    return (
        <AppBar position="fixed">
            <Toolbar>
                <Container className={classes.navbarDisplayFlex}>
                    <div className={classes.navbarDisplayFlex}>
                        <a href="/">
                            <img className={classes.logo} src={logo} alt="logo" />
                        </a>

                        <List className={classes.navDisplayFlex} component="nav" aria-labelledby="main navigation">
                            {navLinks.map(({ title, path }) => (
                                <a className={classes.linkText} href={path} key={title}>
                                    <ListItem button>
                                        <ListItemText primary={title} />
                                    </ListItem>
                                </a>
                            ))}
                        </List>
                    </div>

                    <div className={classes.navDisplayFlex}>
                        <a className={classes.linkText} href="/login">
                            <ListItem button>
                                <ListItemText primary="sign in" />
                            </ListItem>
                        </a>
                    </div>
                </Container>
            </Toolbar>
        </AppBar>
    )
}
