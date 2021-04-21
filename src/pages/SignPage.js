import SignInForm from '../components/SignInForm';
import SignUpForm from '../components/SignUpForm';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Paper, Typography, Button, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  formPaper: {
    textAlign: 'center',
    padding: 20,
  },
  switchFormTxt: {
    marginTop: 15,
  },
})

export default function LoginPage() {
  const [showSignIn, setShowSignIn] = useState(true);
  const classes = useStyles();
  const history = useHistory();

  const handleShowSignIn = () => setShowSignIn(!showSignIn);

  if (localStorage.getItem('user')) history.push('/');

  return (
    <Paper className={classes.formPaper}>
      {showSignIn
        ? <div>
          <SignInForm />
          <Typography className={classes.switchFormTxt}>Don't have an account? <Button onClick={handleShowSignIn} variant="contained">Sign up here!</Button></Typography>
        </div>
        : <div>
          <SignUpForm />
          <Typography className={classes.switchFormTxt}>Already have an account? <Button onClick={handleShowSignIn} variant="contained">Sign in here!</Button></Typography>
        </div>}
    </Paper>
  )
}