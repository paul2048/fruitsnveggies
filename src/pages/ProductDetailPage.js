import AddShoppingCartRoundedIcon from '@material-ui/icons/AddShoppingCartRounded';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Paper, Grid, Typography, makeStyles, Button, FormControl, OutlinedInput, withStyles } from '@material-ui/core';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';


const useStyles = makeStyles({
  mainContainer: {
    padding: 30,
  },
  prodImg: {
    width: '100%',
  },
  quantityInput: {
    width: 64,
    height: 36,
  },
  addBtn: {
    width: "100%",
  },
  formGrid: {
    textAlign: 'center',
  },
});

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.primary.main,
    fontSize: 18,
  },
  body: {
    fontSize: 15,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '& td, th': {
      paddingRight: '35px !important',
    },
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

export default function ProductDetailPage() {
  const [product, setProduct] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [nutrients, setNutrients] = useState({});
  const classes = useStyles();

  const handleQuntity = (e) => {
    setQuantity(e.target.value);
  };

  useEffect(() => {
    axios.get(window.location.href.replace(':3000', ':4000'))
      .then((res) => {
        const product = res.data;
        setProduct(product);
        
        const nutrients = Object.fromEntries(
          Object.entries(product).filter(([key]) => {
            return key.split(' -').length === 2;
          }));
        console.log(nutrients)

        setNutrients(nutrients);
        setIsLoading(false);
      })
      .catch((e) => console.error(e));
  }, []);

  return (!isLoading &&
    <Paper>
      <Grid className={classes.mainContainer} container spacing={2}>
        <Grid item xs={12} sm={5}>
          <Grid container spacing={3} justify="center">
            <Grid item xs={12}>
              <Typography align="center" variant="h3">{product.name}</Typography>
            </Grid>

            <Grid item xs={10}>
              <img
                className={classes.prodImg}
                src={require(`../images/products/${product.name.toLowerCase()}.png`).default}
                alt={product.name} />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} sm={7}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <form method="POST">
                <Grid
                  className={classes.formGrid}
                  container
                  spacing={2}
                  justify="center"
                  alignItems="center"
                >
                  <Grid item xs={6} sm={6} md={3}>
                    <Typography variant="h5">
                      £{product.price}
                      <small>/{product.is_sold_per_unit ? "unit" : "200g"}</small>
                    </Typography>
                  </Grid>

                  <Grid item xs={6} sm={6} md={2}>
                    <FormControl>
                      <OutlinedInput
                        className={classes.quantityInput}
                        type="number"
                        value={quantity}
                        onChange={handleQuntity}
                        inputProps={{ min: 1, max: 32 }}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={12} md={7}>
                    <Button
                      className={classes.addBtn}
                      variant="contained"
                      color="primary"
                    >
                      <AddShoppingCartRoundedIcon />&nbsp;
                      Add to cart (£{(quantity * product.price).toFixed(2)})
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h5">Description</Typography>
              <Typography>{product.description}</Typography>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h4" align="center">Nutrition</Typography>
            </Grid>

            <Grid item xs={12} md={7}>
              <TableContainer component={Paper}>
                <Table className={classes.table} size="small" aria-label="a dense table">
                  <TableHead>
                    <StyledTableRow>
                      <StyledTableCell align="right">Nutrient</StyledTableCell>
                      <StyledTableCell align="right">Nutritional value per 100 g</StyledTableCell>
                    </StyledTableRow>
                  </TableHead>

                  <TableBody>
                    <StyledTableRow>
                      <StyledTableCell align="right">energy</StyledTableCell>
                      <StyledTableCell align="right">{product.kj} kJ ({product.kcal} kcal)</StyledTableCell>
                    </StyledTableRow>

                    {Object.entries(nutrients).map(([nutrient, value]) => (
                      <StyledTableRow key={nutrient}>
                        <StyledTableCell align="right">{nutrient.split(' -')[0]}</StyledTableCell>
                        <StyledTableCell align="right">
                          {parseFloat(value.toFixed(4))} <small>({nutrient.split(' -')[1]})</small>
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}
