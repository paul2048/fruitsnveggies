import AddShoppingCartRoundedIcon from '@material-ui/icons/AddShoppingCartRounded';
import axios from 'axios';

import { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Typography, Grid, makeStyles, Button, FormControl, OutlinedInput } from '@material-ui/core';

const useStyles = makeStyles({
  nameAndPicLink: {
    color: 'black',
    cursor: 'pointer',
    '& :hover': {
      '& *': {
        transform: 'scale(1.04)',
      },
    },
  },
  formGrid: {
    textAlign: 'center',
  },
  quantityInput: {
    width: 64,
    height: 36,
  },
  addBtn: {
    width: "100%",
  },
});

export default function Product(props) {
  const [quantity, setQuantity] = useState(1);
  const [btnLoading, setBtnLoading] = useState(false);
  const { id, name, price, sell_per_unit } = props;
  const classes = useStyles();
  const history = useHistory();

  const handleQuantity = (e) => {
    setQuantity(e.target.value);
  };

  const addToCart = () => {
    setBtnLoading(true);

    const data = {
      productId: id,
      quantity: quantity,
    };

    if (localStorage.getItem('user') !== null) {
      axios.post('http://localhost:4000/basket/add', data, { withCredentials: true })
        .catch((err) => alert(err.response.data))
        .finally(() => setBtnLoading(false));
    }
    else {
      history.push('/login');
    }
  };

  return (
    <Grid container spacing={1} justify="center" alignItems="center">
      <Grid item sm={12}>
        <Link className={classes.nameAndPicLink} to={`/product?name=${name}`}>
          <Grid container alignItems="center" direction="column">
            <Grid item sm={12}>
              <Typography variant="h5">{name}</Typography>
            </Grid>

            <Grid item sm={12}>
              <img
                src={require(`../images/products/${name.toLowerCase()}.png`).default}
                alt={name} />
            </Grid>
          </Grid>
        </Link>
      </Grid>

      <Grid item sm={12}>
        <form variant="contained">
          <Grid
            className={classes.formGrid}
            container
            spacing={2}
            justify="center"
            alignItems="center"
          >
            <Grid item xs={3} sm={6} md={3}>
              £{price}
              <small>/{sell_per_unit ? "unit" : "200g"}</small>
            </Grid>

            <Grid item xs={3} sm={6} md={3}>
              <FormControl>
                <OutlinedInput
                  className={classes.quantityInput}
                  type="number"
                  value={quantity}
                  onChange={handleQuantity}
                  inputProps={{ min: 1, max: 32 }}
                />
              </FormControl>
            </Grid>

            <Grid item xs={6} sm={12} md={6}>
              <Button
                className={classes.addBtn}
                variant="contained"
                color="primary"
                onClick={addToCart}
                disabled={btnLoading}
              >
                <AddShoppingCartRoundedIcon />&nbsp; £{(quantity * price).toFixed(2)}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Grid>
    </Grid>
  )
}