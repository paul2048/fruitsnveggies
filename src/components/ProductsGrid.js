import Product from './Product';
import axios from 'axios';
import SortRoundedIcon from '@material-ui/icons/SortRounded';
import { useState, useEffect } from 'react';
import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab';
import { Grid, makeStyles, Paper, Typography, Menu, MenuItem, Button } from '@material-ui/core';

const useStyles = makeStyles({
  headerPaper: {
    height: 280,
    fontWeight: 'bolder',
    padding: 10,
    textAlign: 'center',
    flexDirection: 'column',
  },
  sortPaper: {
    padding: 10,
    textAlign: 'right',
  },
  gridItem: {
    '& *': {
      transition: '0.2s',
    },
    '& img': {
      width: 190,
      height: 190,
    },
  },
  gridItemPaper: {
    height: 280,
    padding: 35,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectPagePaper: {
    padding: 10,
    textAlign: 'center',
  },
});

export default function ProductsGrid(props) {
  const sortFactors = ['Name', 'Price'];
  const selectedSort = new URLSearchParams(window.location.search).get('sortBy');
  const [anchorEl, setAnchorEl] = useState(null);
  const [sortBy, setSortBy] = useState(selectedSort || sortFactors[0]);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const type = props.productsType;
  const classes = useStyles();
  const open = Boolean(anchorEl);

  const handleMenu = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = (e) => {
    const sortByCriterion = e.target.innerText;
    if (sortByCriterion) setSortBy(sortByCriterion);
    setAnchorEl(null);
  };

  const handlePageChange = (e, page) => {
    setPage(page);
  };

  useEffect(() => {
    axios.get(`http://localhost:4000/products/${type === 'all' ? '' : type}?sortBy=${sortBy}`)
      .then((res) => {
        setProducts(res.data);
        setIsLoading(false);
      })
      .catch((e) => console.error(e));

    handlePageChange('', page);
  }, [type, page, sortBy]);

  return (
    <Grid className={classes.grid} container spacing={4}>
      <Grid item xs={12}>
        <Paper className={classes.headerPaper}>
          <Typography variant="h2">
            {type}
          </Typography>
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Paper className={classes.sortPaper}>
          <Button variant="contained" onClick={handleMenu}>
            Sorting by {sortBy} <SortRoundedIcon />
          </Button>

          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={open}
            onClose={handleClose}
          >
            {sortFactors.map((factor) => (
              <MenuItem onClick={handleClose} key={factor}>
                {factor}
              </MenuItem>
            ))}
          </Menu>
        </Paper>
      </Grid>

      {!isLoading && products.map(({ name, price, sell_per_unit, prices }) => (
        <Grid className={classes.gridItem} item xs={12} sm={6} key={name}>
          <Paper className={classes.gridItemPaper}>
            <Product
              name={name}
              price={price}
              sell_per_unit={sell_per_unit}
            />
          </Paper>
        </Grid>
      ))}

      <Grid item xs={12}>
        <Paper className={classes.selectPagePaper}>
          <ToggleButtonGroup size="large" value={page} exclusive onChange={handlePageChange}>
            <ToggleButton value={1}>
              1
            </ToggleButton>
            <ToggleButton value={2}>
              2
            </ToggleButton>
            <ToggleButton value={3}>
              3
            </ToggleButton>
            <ToggleButton value={4}>
              4
            </ToggleButton>
          </ToggleButtonGroup>
        </Paper>
      </Grid>
    </Grid>
  );
}
