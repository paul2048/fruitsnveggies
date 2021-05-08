import RemoveShoppingCartRoundedIcon from '@material-ui/icons/RemoveShoppingCartRounded';
import ShopRoundedIcon from '@material-ui/icons/ShopRounded';

import axios from 'axios';
import { Link } from 'react-router-dom';
import { Paper, MenuItem, makeStyles, withStyles, Button, Typography, Tooltip, Grid, Chip } from '@material-ui/core';
import { Table, TableBody, TableHead, TableRow, TableCell, TableContainer, TableFooter } from '@material-ui/core';
import { FormControl, InputLabel, Select, FormHelperText, FormControlLabel, TextField, Checkbox } from '@material-ui/core';
import { useEffect, useState } from 'react';

const useStyles = makeStyles((theme) => ({
  basketPaper: {
    padding: 20,
  },
  basketImg: {
    width: 60,
    height: 60,
  },
  imgColumn: {
    [theme.breakpoints.down(900)]: {
      display: 'none',
    },
  },
  rmBtn: {
    [theme.breakpoints.down(900)]: {
      height: 36,
      width: 36,
    },
  },
  balance: {
    cursor: 'pointer',
  },
  orderBtn: {
    width: '100%',
  },
}));

const StyledTableRow = withStyles(() => ({
  root: {
    '& td, th': {
      paddingRight: 35,
      paddingLeft: 35,
    },
  },
}))(TableRow);

export default function BasketPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [basket, setBasket] = useState([]);
  const [payMethod, setPayMethod] = useState('card');
  const [ccName, setCcName] = useState('');
  const [ccNumber, setCcNumber] = useState('');
  const [ccDate, setCcDate] = useState(new Date().toLocaleDateString('swe-SW').slice(0,7));
  const [cvc, setCvc] = useState('');
  const [confirmBitcoin, setConfirmBitcoin] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const classes = useStyles();

  useEffect(() => {
    // Get the items in the user's basket and store them in the `basket` state
    axios.get('http://localhost:4000/basket', { withCredentials: true })
      .then((res) => {
        setBasket(res.data);
        setIsLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleFormErrors = (err) => {
    setFormErrors(err.response.data);
  };

  const handlePayMethod = (e) => {
    setPayMethod(e.target.value);
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

  const handleConfirmBitcoin = (e) => {
    setConfirmBitcoin(e.target.checked);
  }

  const basketPrice = () => {
    // Return the total price of the basket items
    return basket.reduce((acc, { price, quantity }) => {
      return acc + (+price * quantity);
    }, 0).toFixed(2);
  }

  const hasEnoughBalance = () => {
    const balance = +JSON.parse(localStorage.getItem('user')).balance;
    return balance < basketPrice();
  }

  const removeFromBasket = (name, price, discounted_price, i) => {
    const data = { name, price, discounted_price };
    axios.post('http://localhost:4000/basket/remove', data, { withCredentials: true })
      .then(() => {
        // Remove the row from the table
        const newBasket = [
          ...basket.slice(0, i),
          ...basket.slice(i + 1)];
        setBasket(newBasket);
      })
      .catch((err) => console.error(err));
  };

  const placeOrder = (e) => {
    e.preventDefault();
    setBtnLoading(true);

    const data = { payMethod, ccName, ccNumber, ccDate, cvc, confirmBitcoin };
    axios.post('http://localhost:4000/order', data, { withCredentials: true })
      .then((res) => {
        if (payMethod === 'balance') {
          // Update the balance of the user on the client side aswell
          const user = JSON.parse(localStorage.getItem('user'));
          const balance = (user.balance - basketPrice()).toFixed(2);
          localStorage.setItem('user', JSON.stringify({ ...user, balance }));
        }

        // Empty the basket
        setBasket([]);
        alert(res.data);
        window.location.reload();
      })
      .catch((err) => handleFormErrors(err))
      .finally(() => setBtnLoading(false));
  };

  return (!isLoading &&
    <Paper className={classes.basketPaper}>
      <Grid container spacing={6} justify="center">
        <Grid item xs={12}>
          <Typography variant="h3" align="center">Your basket</Typography>
        </Grid>

        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <StyledTableRow>
                  <TableCell className={classes.imgColumn}></TableCell>
                  <TableCell align="right">Item name</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">Portion price</TableCell>
                  <TableCell align="right">Total price</TableCell>
                  <TableCell align="right"></TableCell>
                </StyledTableRow>
              </TableHead>

              <TableBody>
                {basket.map(({ name, sell_per_unit, price, discounted_price, quantity }, i) => (
                  <StyledTableRow key={`${name}_${price}_${discounted_price}`}>
                    <TableCell className={classes.imgColumn} component="th" scope="row">
                      <img
                        className={classes.basketImg}
                        src={require(`../images/products/${name.toLowerCase()}.png`).default}
                        alt={name} />
                    </TableCell>
                    <TableCell align="right">{name}</TableCell>
                    <TableCell align="right">
                      {sell_per_unit ? quantity : `${quantity * 200}g`}
                      </TableCell>
                    <TableCell align="right">£{(discounted_price ? discounted_price : price)}</TableCell>
                    <TableCell align="right">£{(+(discounted_price ? discounted_price : price) * quantity).toFixed(2)}</TableCell>
                    <TableCell align="right">
                      <Button
                        className={classes.rmBtn}
                        size="large"
                        variant="outlined"
                        color="secondary"
                        onClick={() => removeFromBasket(name, price, discounted_price, i)}
                      >
                        <RemoveShoppingCartRoundedIcon />
                      </Button>
                    </TableCell>
                  </StyledTableRow>
                ))}
              </TableBody>

              <TableFooter>
                <StyledTableRow>
                  <TableCell align="center" colSpan={6}>
                    <Typography variant="h6">Total: £{basketPrice()}</Typography>
                  </TableCell>
                </StyledTableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Grid>

        <Grid item xs={12} sm={6}>
          <form method="POST" onSubmit={placeOrder}>
            <Grid container spacing={10} alignItems="center" direction="column">
              <Grid item>
                <FormControl variant="outlined" error={formErrors?.city !== undefined}>
                  <InputLabel>Payment method</InputLabel>
                  <Select
                    value={payMethod}
                    onChange={handlePayMethod}
                    label="Payment Method"
                    variant="outlined"
                    error={formErrors?.payMethod !== undefined}
                  >
                    <MenuItem value="card">Card</MenuItem>
                    <MenuItem value="balance">Balance</MenuItem>
                    <MenuItem value="bitcoin">Bitcoin (BTC)</MenuItem>
                  </Select>
                  {formErrors?.city && <FormHelperText>{formErrors.city}</FormHelperText>}
                </FormControl>
              </Grid>

              {payMethod === 'card'
                ? <Grid container spacing={2} alignItems="center" direction="column">
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
                          InputProps={{ inputProps: { maxLength: 19 }}}
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
                          InputProps={{ inputProps: { maxLength: 3 }}}
                          error={formErrors?.cvc !== undefined}
                        />
                        {formErrors?.cvc &&
                          <FormHelperText>{formErrors.cvc}</FormHelperText>}
                      </FormControl>
                    </Grid>
                  </Grid>
                : payMethod === 'balance'
                ? <Typography variant="h6">Your balance is &nbsp;
                    <Link to="/profile">
                      <Tooltip title="Add more funds">
                        <Chip
                          className={classes.balance}
                          label={`£${JSON.parse(localStorage.getItem('user')).balance}`}
                          color="secondary" />
                      </Tooltip>
                    </Link>
                  </Typography>
                : <Grid container spacing={2} alignItems="center" direction="column">
                    <Grid item>
                      <img
                        src={require('../images/bitcoin_wallet.png').default}
                        alt="bitcoin wallet" />
                    </Grid>

                    <Grid item><b>1G3SZMP3FkgsATANikgYiLCtqdEqiMUSEP</b></Grid>

                    <Grid item>
                      <FormControl error={formErrors?.confirmBitcoin !== undefined}>
                        <FormControlLabel
                          control={<Checkbox
                            checked={confirmBitcoin}
                            onChange={handleConfirmBitcoin} />}
                          label="I confirm I have sent the funds"
                        />
                        {formErrors?.confirmBitcoin &&
                          <FormHelperText>{formErrors?.confirmBitcoin}</FormHelperText>}
                      </FormControl>
                    </Grid>
                  </Grid>}

              <Grid item>
                <Button
                  className={classes.orderBtn}
                  variant="contained"
                  color="primary"
                  size="large"
                  type="submit"
                disabled={
                  (payMethod === 'balance' && hasEnoughBalance())
                  || basket.length === 0
                  || btnLoading
                }
                >
                  <ShopRoundedIcon />&nbsp;Place order
                </Button>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>
    </Paper>
  );
}
