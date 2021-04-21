import logo from '../logo.svg';
import MenuRoundedIcon from '@material-ui/icons/MenuRounded';
import ExitToAppRoundedIcon from '@material-ui/icons/ExitToAppRounded';
import MeetingRoomRoundedIcon from '@material-ui/icons/MeetingRoomRounded';
import ShoppingBasketRoundedIcon from '@material-ui/icons/ShoppingBasketRounded';
import AccountBoxRoundedIcon from '@material-ui/icons/AccountBoxRounded';

import axios from 'axios';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { AppBar, Menu, MenuItem, Toolbar, IconButton, makeStyles, List, ListItem, ListItemText, Avatar, Container } from '@material-ui/core';
import { deepPurple } from '@material-ui/core/colors';


const useStyles = makeStyles((theme) => ({
  navDisplayFlex: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  linkText: {
    color: 'black',
  },
  logo: {
    width: 70,
    height: 46,
  },
  grow: {
    flexGrow: 1,
  },
  purpleAvatar: {
    color: theme.palette.getContrastText(deepPurple[500]),
    backgroundColor: deepPurple[500],
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
  const [hamburgerAnchorEl, setHamburgerAnchorEl] = useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const classes = useStyles();
  const history = useHistory();
  const navLinks = ['Fruits', 'Vegetables', 'Discounts'];
  const hamburgerOpen = Boolean(hamburgerAnchorEl);
  const profileOpen = Boolean(profileAnchorEl);
  const user = JSON.parse(localStorage.getItem('user'));

  const handleHamburger = (event) => {
    setHamburgerAnchorEl(event.currentTarget);
  };

  const handleCloseHamburger = () => {
    setHamburgerAnchorEl(null);
  };

  const handleProfile = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleCloseProfile = () => {
    setProfileAnchorEl(null);
  };

  const handleSignOut = () => {
    axios.get('http://localhost:4000/accounts/logout')
    .then(() => {
        localStorage.removeItem('user');
        setProfileAnchorEl(null)
        history.push('/');
        window.location.reload();
      })
      .catch((err) => console.error(err));
  }

  return (
    <AppBar position="fixed">
      <Container>
        <Toolbar>
          <div className={classes.sectionMobile}>
            <IconButton
              edge="start"
              aria-label="open drawer"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleHamburger}
            >
              <MenuRoundedIcon />
            </IconButton>

            <Menu
              id="menu-appbar"
              anchorEl={hamburgerAnchorEl}
              open={hamburgerOpen}
              onClose={handleCloseHamburger}
            >
              {navLinks.map((title) => (
                <MenuItem onClick={handleCloseHamburger} key={title}>
                  <Link className={classes.linkText} to={`/${title}`} key={title}>
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
                <Link className={classes.linkText} to={`/${title}`} key={title}>
                  <ListItem button>
                    <ListItemText primary={title} />
                  </ListItem>
                </Link>
              ))}
            </List>
          </div>

          <div className={classes.grow} />
          {user
            ? <div>
              <IconButton color="inherit">
                <ShoppingBasketRoundedIcon fontSize="large" />
              </IconButton>
              <IconButton
                edge="start"
                aria-label="open profile menu"
                aria-controls="profile-appbar"
                aria-haspopup="true"
                onClick={handleProfile}
              >
                <Avatar className={classes.purpleAvatar}>
                  {user.firstname[0]}{user.lastname[0]}
                </Avatar>
              </IconButton>

              <Menu
                id="profile-appbar"
                anchorEl={profileAnchorEl}
                open={profileOpen}
                onClose={handleCloseProfile}
              >
                <Link className={classes.linkText} to="/profile">
                  <MenuItem onClick={handleCloseProfile}>
                    <AccountBoxRoundedIcon /> Profile
                  </MenuItem>
                </Link>
                <MenuItem onClick={handleSignOut}>
                  <ExitToAppRoundedIcon /> Sign out
                </MenuItem>
              </Menu>
            </div>
            : <div className={classes.navDisplayFlex}>
              <Link className={classes.linkText} to="/login">
                <ListItem button>
                  <MeetingRoomRoundedIcon />
                  <ListItemText primary="Sign in" />
                </ListItem>
              </Link>
            </div>}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
