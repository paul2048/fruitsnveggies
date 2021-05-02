import AddShoppingCartRoundedIcon from '@material-ui/icons/AddShoppingCartRounded';
import axios from 'axios';

import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { PieChart, Pie, Cell } from 'recharts';
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
    width: '100%',
  },
  formGrid: {
    textAlign: 'center',
  },
  pie: {
    margin: 'auto',
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
  const classes = useStyles();
  const history = useHistory();
  const macronutrients = ['carbohydrates (g)', 'protein (g)', 'fat (g)', 'fiber (g)'];
  const vitamins = ['vitamin a (IU)', 'vitamin c (mg)', 'vitamin b1 (mg)', 'vitamin b2 (mg)',
    'vitamin b3 (mg)', 'vitamin b5 (mg)', 'vitamin b6 (mg)', 'vitamin e (mg)'];
  const nutrients = ['water (g)', ...macronutrients, 'sugars (g)', 'calcium (mg)', 'iron (mg)',
    'magnesium (mg)', 'phosphorus (mg)', 'potassium (mg)', 'sodium (g)', ...vitamins];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }, nutrientsList) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="black" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {percent > 0.01
          ? `${nutrientsList[index].split(' (')[0]} (${(percent * 100).toFixed(0)}%)`
          : ''}
      </text>
    );
  };

  const handleQuntity = (e) => {
    setQuantity(e.target.value);
  };

  const addToCart = () => {
    const data = {
      productId: product.id,
      quantity: quantity,
    };

    if (localStorage.getItem('user') !== null) {
      axios.post('http://localhost:4000/basket/add', data, { withCredentials: true })
        .then((res) => console.log(res))
        .catch((err) => console.error(err));
    }
    else {
      history.push('/login');
    }
  };

  useEffect(() => {
    axios.get(window.location.href.replace(':3000', ':4000'))
      .then((res) => {
        setProduct(res.data);
        setIsLoading(false);
      })
      .catch((e) => console.error(e));
  }, []);

  return (!isLoading &&
    <Paper>
      <Grid className={classes.mainContainer} container spacing={2}>
        {/* Name and image */}
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

        {/* Add to cart + description */}
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
                    <Typography variant="h6">
                      £{product.price}
                      <small>/{product.sell_per_unit ? 'unit' : '200g'}</small>
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
                      onClick={addToCart}
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

        {/* Nutrition */}
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
                      <StyledTableCell align="right">energy (kcal/kJ)</StyledTableCell>
                      <StyledTableCell align="right">{product.kcal}/{product.kj}</StyledTableCell>
                    </StyledTableRow>

                    {nutrients.map((nutrient) => (
                      <StyledTableRow key={nutrient}>
                        <StyledTableCell align="right">{nutrient}</StyledTableCell>
                        <StyledTableCell align="right">
                          {/* Dislay the value of the nutrient only if the product has that nutrient */}
                          {product[nutrient] ? product[nutrient].toFixed(3) : '-'}
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            <Grid item xs={12} md={5}>
              <Grid container>
                <Grid item xs={12}>
                  <Typography variant="h5" align="center">Macronutrients</Typography>
                  <PieChart className={classes.pie} width={360} height={200}>
                    <Pie
                      data={macronutrients.map((nutrient) => ({ name: nutrient, value: product[nutrient] }))}
                      labelLine={false}
                      label={(pieData) => renderCustomizedLabel(pieData, macronutrients)}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {macronutrients.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h5" align="center">Vitamins</Typography>
                  <PieChart className={classes.pie} width={360} height={200}>
                    <Pie
                      data={vitamins.map((nutrient) => ({ name: nutrient, value: product[nutrient] }))}
                      labelLine={false}
                      label={(pieData) => renderCustomizedLabel(pieData, vitamins)}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {vitamins.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}
