import { Typography, Box, IconButton, Collapse, makeStyles } from '@material-ui/core';
import { Paper, TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import React, { useEffect, useState } from 'react';
import axios from 'axios';


const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
});

const useStyles = makeStyles({
  orderHistoryTable: {
    '& tr': {
      padding: '0 20px !important',
    },
  },
});

const Row = (props) => {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{row.timestamp}</TableCell>
        <TableCell>{row.type}</TableCell>
        <TableCell scope="row" align="right">
          £{row.basket.reduce((acc, {price, quantity}) => acc + price * quantity, 0).toFixed(2)}
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">Items</Typography>

              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">Portion price</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Total price</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {row.basket.map((basketRow, i) => (
                    <TableRow key={i}>
                      <TableCell component="th" scope="row">{basketRow.name}</TableCell>
                      <TableCell align="right">£{basketRow.price}</TableCell>
                      <TableCell align="right">{basketRow.quantity}</TableCell>
                      <TableCell align="right">
                        £{(basketRow.price * basketRow.quantity).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function OrderHistoryTable() {
  const [orders, setOrders] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    axios.post('http://localhost:4000/orderHistory', {}, { withCredentials: true })
      .then((res) => setOrders(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    orders.length !== 0
      ? <TableContainer component={Paper}>
        <Table className={classes.orderHistoryTable} aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Timestamp</TableCell>
              <TableCell>Transaction type</TableCell>
              <TableCell align="right">Cost</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((row, i) => (
              <Row key={i} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      : <Typography variant="h4" align="center">No orders made yet 🗿</Typography>
  );
}
