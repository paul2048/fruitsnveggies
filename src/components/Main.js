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
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
    },
    midPaper: {
        height: 280,
        padding: 10,
        textTransform: 'capitalize',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        userSelect: 'none',
        cursor: 'pointer',
    },
    blockImg: {
        width: '90%',
        height: '90%',
        objectFit: 'contain',
        position: 'absolute',
        opacity: 0.5,
    },
    blockTitle: {
        zIndex: 100,
    }
});

export default function Main() {
    const classes = useStyles();

    const blockTitles = ['fruits', 'vegetables', 'discounts', 'all'];

    return (
        <Grid className={classes.grid} container spacing={4} justify="center">
            <Grid item xs={12}>
                <Paper className={classes.welcomePaper} elevation={3}>
                    <Typography variant="h2">Welcome to Fruits n' Veggies!</Typography>
                </Paper>
            </Grid>

            {blockTitles.map((title) => (
                <Grid item xs={12} sm={6} key={title}>
                    <Paper className={classes.midPaper} elevation={3}>
                        <img className={classes.blockImg} src={require(`../images/${title}.png`).default} alt={title} />
                        <Typography className={classes.blockTitle} variant="h3">{title}</Typography>
                    </Paper>
                </Grid>
            ))}
        </Grid>
    );
}
