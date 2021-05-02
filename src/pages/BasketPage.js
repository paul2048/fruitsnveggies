import RemoveShoppingCartOutlinedIcon from '@material-ui/icons/RemoveShoppingCartOutlined';

import axios from 'axios';
import { Paper, makeStyles, withStyles, Table, TableBody, TableHead, TableRow, TableCell, TableContainer, Button } from '@material-ui/core';
import { useEffect, useState } from 'react';

const useStyles = makeStyles({
  basketPaper: {
    padding: 20,
  },
  table: {
    minWidth: 0,
  },
  basketImg: {
    width: 60,
    height: 60,
  },
});

const StyledTableRow = withStyles(() => ({
  root: {
    '& td, th': {
      paddingRight: '35px',
      paddingLeft: '35px',
    },
  },
}))(TableRow);

export default function BasketPage() {
  const [basket, setBasket] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const classes = useStyles();

  useEffect(() => {
    axios.get('http://localhost:4000/basket', { withCredentials: true })
      .then((res) => {
        setBasket(res.data);
        setIsLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  return (!isLoading &&
    <Paper className={classes.basketPaper}>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <StyledTableRow>
              <TableCell></TableCell>
              <TableCell align="right">Item name</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="right">Portion price</TableCell>
              <TableCell align="right">Total price</TableCell>
              <TableCell align="right"></TableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {basket.map(({ name, sell_per_unit, price, quantity }) => (
              <StyledTableRow key={`${name}_${price}`}>
                <TableCell component="th" scope="row">
                  <img
                    className={classes.basketImg}
                    src={require(`../images/products/${name.toLowerCase()}.png`).default}
                    alt={name} />
                </TableCell>
                <TableCell align="right">{name}</TableCell>
                <TableCell align="right">
                  {sell_per_unit ? quantity : `${quantity * 200}g`}
                  </TableCell>
                <TableCell align="right">£{price}</TableCell>
                <TableCell align="right">£{(+price * quantity).toFixed(2)}</TableCell>
                <TableCell align="right">
                  <Button size="large" variant="outlined" color="secondary">
                    <RemoveShoppingCartOutlinedIcon />
                  </Button>
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
