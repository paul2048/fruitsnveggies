import logo from '../logo.svg';
import MenuRoundedIcon from '@material-ui/icons/MenuRounded';
import ExitToAppRoundedIcon from '@material-ui/icons/ExitToAppRounded';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Menu, MenuItem, Toolbar, IconButton, makeStyles, List, ListItem, ListItemText } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    navDisplayFlex: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    linkText: {
        textTransform: 'uppercase',
        color: 'black',
    },
    logo: {
        width: 70,
        height: 46,
    },
    grow: {
        flexGrow: 1,
    },
    sectionMobile: {
        display: 'flex',
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'flex',
        },
    },
}));

export default function Navbar() {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);
    const navLinks = ['fruits', 'vegetables', 'discounts'];
    const open = Boolean(anchorEl);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar position="fixed">
            <Toolbar>
                <div className={classes.sectionMobile}>
                    <IconButton
                        edge="start"
                        className={classes.menuButton}
                        aria-label="open drawer"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenu}
                    >
                        <MenuRoundedIcon />
                    </IconButton>

                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={open}
                        onClose={handleClose}
                    >
                        {navLinks.map((title) => (
                            <MenuItem
                                className={classes.linkText}
                                onClick={handleClose}
                                key={title}
                            >
                                <Link className={classes.linkText} to={title} key={title}>
                                    {title}
                                </Link>
                            </MenuItem>
                        ))}
                    </Menu> 
                </div>

                <Link to="/">
                    <img className={classes.logo} src={logo} alt="logo" />
                </Link>

                <div className={classes.sectionDesktop}>
                    <List
                        className={classes.navDisplayFlex}
                        component="nav"
                        aria-labelledby="main navigation">
                        {navLinks.map((title) => (
                            <Link className={classes.linkText} to={title} key={title}>
                                <ListItem button>
                                    <ListItemText primary={title} />
                                </ListItem>
                            </Link>
                        ))}
                    </List>
                </div>

                <div className={classes.grow} />
                <div className={classes.navDisplayFlex}>
                    <Link className={classes.linkText} to="/login">
                        <ListItem button>
                            <ExitToAppRoundedIcon />
                            <ListItemText primary="sign in" />
                        </ListItem>
                    </Link>
                </div>
            </Toolbar>
        </AppBar>
    )
}