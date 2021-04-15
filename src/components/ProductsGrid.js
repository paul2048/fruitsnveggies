import Product from './Product';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Grid, Paper, Typography } from '@material-ui/core';

const classes = {
    gridItem: {
        '& :hover': {
            transform: 'scale(1.04)',
        },
        '& *': {
            transition: '0.2s',
        },
        '& img': {
            width: '90%',
            height: '90%',
            objectFit: 'contain',
            position: 'absolute',
            opacity: 0.6,
        },
    }
}

export default function ProductsGrid(props) {
    const [products, setProducts] = useState([]);
    const type = props.productsType;

    useEffect(() => {
        axios.get(`http://localhost:4000/products/${type === 'all' ? '' : type }`)
            .then((res) => setProducts(res.data))
            .catch((e) => console.error(e))
    }, []);

    return (
        <Grid className={classes.grid} container spacing={4} justify="center">
            {products.map(({ name, price, is_sold_per_unit }) => (
                <Grid className={classes.gridItem} item xs={12} sm={6} key={name}>
                    <Paper elevation={3}>
                        <Product name={name} price={price} is_sold_per_unit={is_sold_per_unit} />
                    </Paper>
                </Grid>
            ))}
        </Grid>
    )
}