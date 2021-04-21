// import axios from 'axios';
import EmailRoundedIcon from '@material-ui/icons/EmailRounded';
import InfoRoundedIcon from '@material-ui/icons/InfoRounded';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Paper, makeStyles, Typography, TextField, Button, FormControl, Grid } from '@material-ui/core';

const useStyles = makeStyles({
  footer: {
    margin: "32px 0px",
    padding: 50,
    textAlign: 'center',
  },
  newsletterForm: {
    '& > *': {
      marginBottom: 10,
    },
  },
  footerTitle: {
    marginBottom: 10,
  },
  socialMediaBtn: {
    margin: 5,
    '& img': {
      width: 50,
      height: 50,
    }
  }
});

export default function Footer() {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const emailHandle = (e) => setEmail(e.target.value);
  const socialMediaPages = ['twitter', 'instagram', 'facebook'];

  const subscribe = (e) => {
    e.preventDefault();
  }

  return (
    <Paper className={classes.footer}>
      <Grid container spacing={4} justify="space-between">
        <Grid item xs={12}>
          <Typography
            className={classes.footerTitle}
            variant="h4"
          >
            Fruits n' Veggies
          </Typography>
          <Link to="/about">
            <Button variant="contained" color="secondary">
              <InfoRoundedIcon /> About us
            </Button>
          </Link>
        </Grid>

        <Grid item xs={12} md={6}>
          <form
            className={classes.newsletterForm}
            method="POST"
            onSubmit={subscribe}
          >
            <Typography variant="h6">Subscribe to our newsletter</Typography>
            <Grid container spacing={3} justify="center">
              <Grid item xs={12} sm={6} md={8}>
                <FormControl fullWidth={true}>
                  <TextField
                    value={email}
                    onChange={emailHandle}
                    label="Email address"
                    variant="outlined"
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4} md={4}>
                <Button
                  type="submit"
                  size="large"
                  fullWidth={true}
                  variant="contained"
                  color="primary"
                >
                  <EmailRoundedIcon /> Subscribe
                </Button>
              </Grid>
            </Grid>
          </form>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h6">Follow us</Typography>
          <Grid container justify="center">
            {socialMediaPages.map((page) => (
              <Grid item key={page}>
                <Button
                  className={classes.socialMediaBtn}
                  variant="contained"
                  color="secondary"
                >
                  <img src={require(`../images/${page}.svg`).default} alt={page} />
                </Button>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}
