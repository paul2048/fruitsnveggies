import Product from './Product';
import axios from 'axios';
import SortRoundedIcon from '@material-ui/icons/SortRounded';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab';
import { Grid, makeStyles, Paper, Typography, IconButton, Menu, MenuItem, Button } from '@material-ui/core';

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
  const [anchorEl, setAnchorEl] = useState(null);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState(sortFactors[0]);
  const type = props.productsType;
  const classes = useStyles();
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (e) => {
    setSortBy(e.target.innerText);
    setAnchorEl(null);
  };

  const handlePageChange = (e, page) => {
    setPage(page);
  };

  useEffect(() => {
    axios.get(`http://localhost:4000/products/${type === 'all' ? '' : type}`)
      .then((res) => setProducts(res.data))
      .catch((e) => console.error(e));

    handlePageChange('', page);
  }, []);

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
          <IconButton
            edge="start"
            className={classes.menuButton}
            aria-label="open drawer"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
          >
            <Button variant="contained">
              Sorting by {sortBy} <SortRoundedIcon />
            </Button>
          </IconButton>

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

      {products.map(({ name, price, is_sold_per_unit }) => (
        <Grid className={classes.gridItem} item xs={12} sm={6} key={name}>
          <Link to={`/product?name=${name}`}>
            <Paper className={classes.gridItemPaper}>
              <Product
                name={name}
                price={price}
                is_sold_per_unit={is_sold_per_unit}
              />
            </Paper>
          </Link>
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
  )
}