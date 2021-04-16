import Product from './Product';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Grid, makeStyles, Paper, Typography } from '@material-ui/core';

const useStyles = makeStyles({
    headerPaper: {
        height: 280,
        fontWeight: 'bolder',
        padding: 10,
        textAlign: 'center',
        flexDirection: 'column',
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
});

export default function ProductsGrid(props) {
    const [products, setProducts] = useState([]);
    const type = props.productsType;
    const classes = useStyles();

    useEffect(() => {
        axios.get(`http://localhost:4000/products/${type === 'all' ? '' : type }`)
            .then((res) => setProducts(res.data))
            .catch((e) => console.error(e))
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
            {products.map(({ name, price, is_sold_per_unit }) => (
                <Grid className={classes.gridItem} item xs={12} sm={6} key={name}>
                    <Paper className={classes.gridItemPaper} elevation={3}>
                        <Product
                            name={name}
                            price={price}
                            is_sold_per_unit={is_sold_per_unit}
                        />
                    </Paper>
                </Grid>
            ))}
        </Grid>
    )
}