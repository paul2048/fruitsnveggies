// import { useState } from 'react';
import { Paper, makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles({
    footer: {
        height: 280,
        margin: "32px 0px",
        padding: 10,
    },
});

export default function Footer() {
    const classes = useStyles();

    return (
        <Paper className={classes.footer} elevation={3}>
            <Typography variant="h3">Test</Typography>
        </Paper>
    );
}
