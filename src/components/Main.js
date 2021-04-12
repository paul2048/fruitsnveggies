// import { useState } from 'react';
import { Paper, Grid, makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles({
    grid: {
        marginTop: 70,
    },
    welcomePaper: {
        height: 280,
        textTransform: 'uppercase',
        fontWeight: 'bolder',
        padding: 10,
        display: 'flex',
        alignItems: 'center',
    },
    midPaper: {
        height: 280,
        padding: 10,
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default function Main() {
    const classes = useStyles();

    return (
        <Grid className={classes.grid} container spacing={4} justify="center">
            <Grid item xs={12}>
                <Paper className={classes.welcomePaper} elevation={3}>
                    <Typography variant="h2">Welcome to Fruits n' Veggies!</Typography>
                </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Paper className={classes.midPaper} elevation={3}>
                    <Typography variant="h3">Fruits</Typography>
                </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Paper className={classes.midPaper} elevation={3}>
                    <Typography variant="h3">Vegetables</Typography>
                </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Paper className={classes.midPaper} elevation={3}>
                    <Typography variant="h3">Discounts</Typography>
                </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Paper className={classes.midPaper} elevation={3}>
                    <Typography variant="h3">All</Typography>
                </Paper>
            </Grid>
        </Grid>
    );
}
