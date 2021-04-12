// import { useState } from 'react';
import { Paper, Grid, makeStyles, Typography } from "@material-ui/core";

const useStyles = makeStyles({
    grid: {
        marginTop: 70,
    },
    welcomePaper: {
        height: 280,
    },
    midPaper: {
        height: 280,
        width: 280,
        padding: 10,
    }
});

export default function Main() {
    const classes = useStyles();

    return (
        <Grid className={classes.grid} container spacing={4} justify="center">
            <Grid item xs={12}>
                <Paper className={classes.welcomePaper} elevation={3}>
                    <Typography variant="h2">Hello</Typography>
                </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Paper className={classes.midPaper} elevation={3} />
            </Grid>
            <Grid item xs={12} sm={6}>
                <Paper className={classes.midPaper} elevation={3} />
            </Grid>
            <Grid item xs={12} sm={6}>
                <Paper className={classes.midPaper} elevation={3} />
            </Grid>
            <Grid item xs={12} sm={6}>
                <Paper className={classes.midPaper} elevation={3} />
            </Grid>
        </Grid>
    );
}
