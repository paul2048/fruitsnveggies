import { Product } from './';
import { Grid, Paper, Typography } from '@material-ui/core';

export default function MainGrid(props) {
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

    return (
        <Grid className={classes.grid} container spacing={4} justify="center">
            <Grid item xs={12}>
                <Paper className={classes.welcomePaper} elevation={3}>
                    <Typography variant="h2">Welcome to</Typography>
                    <Typography variant="h2">Fruits n' Veggies!</Typography>
                </Paper>
            </Grid>

            {props.blockTitles.map((title) => (
                <Grid className={classes.gridItem} item xs={12} sm={6} key={title}>
                    <Paper elevation={3}>
                        <Product />
                    </Paper>
                </Grid>
            ))}
        </Grid>
    )
}