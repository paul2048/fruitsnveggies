import RemoveShoppingCartRoundedIcon from '@material-ui/icons/RemoveShoppingCartRounded';
import ShopRoundedIcon from '@material-ui/icons/ShopRounded';

import axios from 'axios';
import { Paper, MenuItem, makeStyles, withStyles, Table, TableBody, TableHead, TableRow, TableCell, TableContainer, Button, Typography, Grid } from '@material-ui/core';
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
  const [basket, setBasket] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [payMethod, setPayMethod] = useState('card');
  const [ccName, setCcName] = useState('');
  const [ccNumber, setCcNumber] = useState('');
  const [ccDate, setCcDate] = useState(new Date().toLocaleDateString('swe-SW'));
  const [cvc, setCvc] = useState('');
  const [confirmBitcoin, setConfirmBitcoin] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const classes = useStyles();

  useEffect(() => {
    axios.get('http://localhost:4000/basket', { withCredentials: true })
      .then((res) => {
        setBasket(res.data);
        setIsLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleRemoveBasket = (name, price, discounted_price, i) => {
    const data = { name, price, discounted_price };
    axios.post('http://localhost:4000/basket/remove', data, { withCredentials: true })
      .then(() => {
        console.log(basket.slice(0, i))
        console.log(basket.slice(i + 1))
        const newBasket = [
          ...basket.slice(0, i),
          ...basket.slice(i + 1)];
        setBasket(newBasket);
      })
      .catch((err) => console.error(err));
  };

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
    setCcNumber(e.target.value);
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

  const placeOrder = (e) => {
    e.preventDefault();

    const data = { ccName, ccNumber, ccDate, cvc };
    axios.post('http://localhost:4000/order', data, { withCredentials: true })
      .then((res) => console.log(res))
      .catch((err) => handleFormErrors(err));
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
                        onClick={() => handleRemoveBasket(name, price, discounted_price, i)}
                      >
                        <RemoveShoppingCartRoundedIcon />
                      </Button>
                    </TableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid item xs={12} sm={6}>
          <form method="POST" onSubmit={placeOrder}>
            <Grid container spacing={2} alignItems="center" direction="column">
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
                    <MenuItem value="bitcoin">Bitcoin</MenuItem>
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
                          label="Card date"
                          variant="outlined"
                          type="date"
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
                : <Grid container spacing={2} alignItems="center" direction="column">
                    <Grid item>
                      <img
                        src={require('../images/bitcoin_wallet.png').default}
                        alt="bitcoin wallet" />
                    </Grid>

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
                >
                  <ShopRoundedIcon /> &nbsp;Place order
                </Button>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>
    </Paper>
  );
}
