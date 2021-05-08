import OrderHistoryTable from '../components/OrderHistoryTable';
import PaymentRoundedIcon from '@material-ui/icons/PaymentRounded';

import axios from 'axios';
import { Link } from 'react-router-dom';
import { deepPurple, grey } from '@material-ui/core/colors';
import { Paper, Grid, Typography, Avatar, Button, Chip, makeStyles } from '@material-ui/core';
import { FormControl, FormHelperText, TextField } from '@material-ui/core';
import { useState } from 'react';

const useStyles = makeStyles((theme) => ({
  userPaper: {
    padding: 30,
  },
  avatar: {
    width: 220,
    height: 220,
    margin: 'auto',
    fontSize: 80,
    color: theme.palette.getContrastText(deepPurple[500]),
    backgroundColor: deepPurple[500],
  },
  userInfo: {
    alignSelf: 'center',
    '& > div > div:nth-child(2)': {
      color: grey[500],
      marginBottom: 15,
    },
    [theme.breakpoints.down('xs')]: {
      textAlign: 'center',
    },
  },
}));

export default function ProfilePage() {
  const [amount, setAmount] = useState(25);
  const [ccName, setCcName] = useState('');
  const [ccNumber, setCcNumber] = useState('');
  const [ccDate, setCcDate] = useState(new Date().toLocaleDateString('swe-SW').slice(0, 7));
  const [cvc, setCvc] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [btnLoading, setBtnLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));
  const classes = useStyles();
  const userInfo = [
    ['Full name', `${user.firstname} ${user.lastname}`],
    ['Email address', user.email],
    ['Phisical address', `${user.city}, ${user.street}, ${user.postcode}`]];
  
  const handleFormErrors = (err) => {
    setFormErrors(err.response.data);
  };

  const handleAmount = (e) => {
    setAmount(e.target.value);
  };

  const handleCcName = (e) => {
    setCcName(e.target.value);
  };

  const handleCcNumber = (e) => {
    // Format the card number as "DDDD DDDD DDDD DDDD", where "D" is any digit 
    const regex = /^(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})$/g;
    const onlyNumbers = e.target.value.replace(/[^\d]/g, '');

    const final = onlyNumbers.replace(regex, (regex, $1, $2, $3, $4) =>
      [$1, $2, $3, $4].filter((group) => !!group).join(' '));

    setCcNumber(final);
  };

  const handleCcDate = (e) => {
    setCcDate(e.target.value);
  };

  const handleCvc = (e) => {
    setCvc(e.target.value);
  };

  const addBalance = (e) => {
    e.preventDefault();
    setBtnLoading(true);

    const data = { amount, ccName, ccNumber, ccDate, cvc };
    axios.post('http://localhost:4000/addBalance', data, { withCredentials: true })
      .then((res) => {
        // Update the balance of the user on the client side aswell
        const user = JSON.parse(localStorage.getItem('user'));
        const balance = (+user.balance + amount).toFixed(2);
        localStorage.setItem('user', JSON.stringify({ ...user, balance }));

        alert(res.data);
        window.location.reload();
      })
      .catch((err) => handleFormErrors(err))
      .finally(() => setBtnLoading(false));
  };

  return (
    <Grid container spacing={3} direction="column">
      <Grid item>
        <Paper className={classes.userPaper}>
          <Grid container spacing={4} justify="center">
            <Grid item xs={12}>
              <Typography variant="h3" align="center">User info</Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Avatar className={classes.avatar}>
                {user.firstname[0]}{user.lastname[0]}
              </Avatar>
            </Grid>

            <Grid className={classes.userInfo} item xs={12} md={8}>
              {userInfo.map(([attr, value]) => (
                <Grid container key={attr}>
                  <Grid item xs={12} sm={5}>
                    <Typography variant="h6">{attr}: </Typography>
                  </Grid>

                  <Grid item xs={12} sm={7}>
                    <Typography variant="h6">{value}</Typography>
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      <Grid item>
        <Paper className={classes.userPaper}>
          <Grid container spacing={4} justify="center">
            <Grid item xs={12}>
              <Typography variant="h3" align="center">Add balance funds</Typography>
            </Grid>

            <Grid item xs={12}>
              <form method="POST" onSubmit={addBalance}>
                <Grid container spacing={2} alignItems="center" direction="column">
                  <Grid item>
                    <Typography variant="h6">Your balance is &nbsp;
                      <Link to="/profile">
                        <Chip
                          className={classes.balance}
                          label={`£${JSON.parse(localStorage.getItem('user')).balance}`}
                          color="secondary" />
                      </Link>
                    </Typography>
                  </Grid>

                  <Grid item>
                    <FormControl error={formErrors?.amount !== undefined}>
                      <TextField
                        type="number"
                        value={amount}
                        onChange={handleAmount}
                        label="Amount to add"
                        variant="outlined"
                        error={formErrors?.amount !== undefined}
                        inputProps={{ min: 10 }}
                      />
                      {formErrors?.amount &&
                        <FormHelperText>{formErrors.amount}</FormHelperText>}
                    </FormControl>
                  </Grid>

                  <Grid item>
                    <FormControl error={formErrors?.ccName !== undefined}>
                      <TextField
                        value={ccName}
                        onChange={handleCcName}
                        label="Card name"
                        variant="outlined"
                        error={formErrors?.ccName !== undefined}
                      />
                      {formErrors?.ccName &&
                        <FormHelperText>{formErrors.ccName}</FormHelperText>}
                    </FormControl>
                  </Grid>

                  <Grid item>
                    <FormControl error={formErrors?.ccNumber !== undefined}>
                      <TextField
                        value={ccNumber}
                        onChange={handleCcNumber}
                        label="Card number"
                        variant="outlined"
                        InputProps={{ inputProps: { maxLength: 19 } }}
                        error={formErrors?.ccNumber !== undefined}
                      />
                      {formErrors?.ccNumber &&
                        <FormHelperText>{formErrors.ccNumber}</FormHelperText>}
                    </FormControl>
                  </Grid>

                  <Grid item>
                    <FormControl error={formErrors?.ccDate !== undefined}>
                      <TextField
                        value={ccDate}
                        onChange={handleCcDate}
                        label="Card expiry date"
                        variant="outlined"
                        type="month"
                        error={formErrors?.ccDate !== undefined}
                      />
                      {formErrors?.ccDate &&
                        <FormHelperText>{formErrors.ccDate}</FormHelperText>}
                    </FormControl>
                  </Grid>

                  <Grid item>
                    <FormControl error={formErrors?.cvc !== undefined}>
                      <TextField
                        value={cvc}
                        onChange={handleCvc}
                        label="CVC"
                        variant="outlined"
                        type="password"
                        InputProps={{ inputProps: { maxLength: 3 } }}
                        error={formErrors?.cvc !== undefined}
                      />
                      {formErrors?.cvc &&
                        <FormHelperText>{formErrors.cvc}</FormHelperText>}
                    </FormControl>
                  </Grid>

                  <Grid item>
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      type="submit"
                      disabled={btnLoading}
                    >
                      <PaymentRoundedIcon />&nbsp;Add balance
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      <Grid item>
        <Paper className={classes.userPaper}>
          <Grid container spacing={3} justify="center">
            <Grid item xs={12}>
              <Typography variant="h3" align="center">Order history</Typography>
            </Grid>

            <Grid item xs={12}>
              <OrderHistoryTable />
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
}
