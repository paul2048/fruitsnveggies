import axios from 'axios';
import ExitToAppRoundedIcon from '@material-ui/icons/ExitToAppRounded';
import { useState } from 'react';
import { TextField, Grid, Button, Typography, FormControl, FormHelperText } from '@material-ui/core';

export default function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState({});

  const handleFormErrors = (err) => {
    setFormErrors({ password: 'Credetials are incorrect', email: 'Credetials are incorrect' })
  };

  const signInUser = (e) => {
    // Prevent the page from reloading
    e.preventDefault();

    // Object that holds the data of the form
    const data = {
      email: email,
      password: password,
    };
    console.log(data);

    // Send a request to the server to sign in the user
    axios.post('http://localhost:4000/accounts/login', data, { withCredentials: true })
      .then((res) => console.log(res))
      .catch((err) => handleFormErrors(err));

    // Axios({
    //     method: 'GET',
    //     withCredentials: true,
    //     url: 'http://localhost:4000/user',
    // }).then((res) => {
    //     console.log('This is what I get from backend: ')
    //     console.log(res)
    // });
  }

  const handleEmail = (e) => {
    setEmail(e.target.value);
  }

  const handlePassword = (e) => {
    setPassword(e.target.value);
  }

  return (
    <form method="POST" onSubmit={signInUser}>
      <Grid container spacing={2} alignItems="center" direction="column">
        <Grid item>
          <Typography variant="h3">Sign in</Typography>
        </Grid>

        <Grid item>
          <FormControl error={formErrors?.email !== undefined}>
            <TextField
              value={email}
              onChange={handleEmail}
              label="Email address"
              variant="outlined"
              error={formErrors?.email !== undefined}
            />
            {formErrors?.email &&
              <FormHelperText>{formErrors.email}</FormHelperText>}
          </FormControl>
        </Grid>

        <Grid item>
          <FormControl error={formErrors?.password !== undefined}>
            <TextField
              value={password}
              onChange={handlePassword}
              label="Password"
              type="password"
              variant="outlined"
              error={formErrors?.password !== undefined}
            />
            {formErrors?.password &&
              <FormHelperText>{formErrors.password}</FormHelperText>}
          </FormControl>
        </Grid>

        <Grid item>
          <Button variant="contained" color="primary" type="submit">
            <ExitToAppRoundedIcon />Sign in
                    </Button>
        </Grid>
      </Grid>
    </form>
  )
}