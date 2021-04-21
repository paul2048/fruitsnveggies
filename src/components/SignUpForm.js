import axios from 'axios';
import CreateRoundedIcon from '@material-ui/icons/CreateRounded';
import { useState } from 'react';
import { Grid, MenuItem, TextField, Select, Button, Typography, FormHelperText, FormControl, InputLabel } from '@material-ui/core';

export default function SignUpForm() {
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [city, setCity] = useState('');
  const [postcode, setPostcode] = useState('');
  const [street, setStreet] = useState('');
  const [formErrors, setFormErrors] = useState({});

  const [citiesArr, setCitiesArr] = useState([]);
  // const classes = useStyles();

  const getCities = () =>
    axios.get('http://localhost:4000/cities')
      .then((resp) => setCitiesArr(resp.data.cities));

  const handleFormErrors = (err) => {
    console.log(err.response)
    setFormErrors(err.response.data)
  };

  const signUpUser = (e) => {
    // Prevent the page from reloading
    e.preventDefault();
    console.log(formErrors)

    // Object that holds the data of the form
    const data = {
      firstname: firstname,
      lastname: lastname,
      email: email,
      password1: password1,
      password2: password2,
      city: city,
      postcode: postcode,
      street: street
    };

    // Send a request to the server to sign up the user
    axios.post('http://localhost:4000/accounts/signup', data, { withCredentials: true })
      .then((res) => {
        console.log(res)
        window.location.reload();
      })
      .catch((err) => handleFormErrors(err));
  }

  const handleFirstName = (e) => {
    setFirstName(e.target.value);
  }

  const handleLastName = (e) => {
    setLastName(e.target.value);
  }

  const handleEmail = (e) => {
    setEmail(e.target.value);
  }

  const handlePassword1 = (e) => {
    setPassword1(e.target.value);
  }

  const handlePassword2 = (e) => {
    setPassword2(e.target.value);
  }

  const handleCity = (e) => {
    setCity(e.target.value);
  }

  const handlePostcode = (e) => {
    setPostcode(e.target.value);
  }

  const handleStreet = (e) => {
    setStreet(e.target.value);
  }

  return (
    <form method="POST" onSubmit={signUpUser}>
      <Grid container spacing={2} alignItems="center" direction="column">
        <Grid item>
          <Typography variant="h3">Sign up</Typography>
        </Grid>

        <Grid item>
          <FormControl error={formErrors?.firstname !== undefined}>
            <TextField
              value={firstname}
              onChange={handleFirstName}
              label="First name"
              variant="outlined"
              error={formErrors?.firstname !== undefined}
            />
            {formErrors?.firstname &&
              <FormHelperText>{formErrors.firstname}</FormHelperText>}
          </FormControl>
        </Grid>

        <Grid item>
          <FormControl error={formErrors?.lastname !== undefined}>
            <TextField
              value={lastname}
              onChange={handleLastName}
              label="Last name"
              variant="outlined"
              error={formErrors?.lastname !== undefined}
            />
            {formErrors?.lastname &&
              <FormHelperText>{formErrors.lastname}</FormHelperText>}
          </FormControl>
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
          <FormControl error={formErrors?.password1 !== undefined}>
            <TextField
              value={password1}
              onChange={handlePassword1}
              label="Password"
              type="password"
              variant="outlined"
              error={formErrors?.password1 !== undefined}
            />
            {formErrors?.password1 &&
              <FormHelperText>{formErrors.password1}</FormHelperText>}
          </FormControl>
        </Grid>

        <Grid item>
          <FormControl error={formErrors?.password2 !== undefined}>
            <TextField
              value={password2}
              onChange={handlePassword2}
              label="Confirm password"
              type="password"
              variant="outlined"
              error={formErrors?.password2 !== undefined}
            />
            {formErrors?.password2 &&
              <FormHelperText>{formErrors.password2}</FormHelperText>}
          </FormControl>
        </Grid>

        <Grid item>
          <FormControl variant="outlined" error={formErrors?.city !== undefined}>
            <InputLabel>City</InputLabel>
            <Select
              value={city}
              onChange={handleCity}
              onOpen={getCities}
              label="City"
              variant="outlined"
              error={formErrors?.city !== undefined}
            >
              <MenuItem value=""></MenuItem>
              {citiesArr.map((city, i) =>
                <MenuItem key={i} value={city}>{city}</MenuItem>)}
            </Select>
            {formErrors?.city &&
              <FormHelperText>{formErrors.city}</FormHelperText>}
          </FormControl>
        </Grid>

        <Grid item>
          <FormControl error={formErrors?.postcode !== undefined}>
            <TextField
              value={postcode}
              onChange={handlePostcode}
              label="Postcode"
              variant="outlined"
              error={formErrors?.postcode !== undefined}
            />
            {formErrors?.postcode &&
              <FormHelperText>{formErrors.postcode}</FormHelperText>}
          </FormControl>
        </Grid>

        <Grid item>
          <FormControl error={formErrors?.street !== undefined}>
            <TextField
              value={street}
              onChange={handleStreet}
              label="Street"
              variant="outlined"
              error={formErrors?.street !== undefined}
            />
            {formErrors?.street &&
              <FormHelperText>{formErrors.street}</FormHelperText>}
          </FormControl>
        </Grid>

        <Grid item>
          <Button variant="contained" color="primary" type="submit">
            <CreateRoundedIcon />Sign up
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}