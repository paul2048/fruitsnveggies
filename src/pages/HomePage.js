import { Link } from 'react-router-dom';
import { Paper, Grid, makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles({
    welcomePaper: {
        height: 280,
        background: `url(${require('../images/welcome_bg.svg').default})`,
        fontWeight: 'bolder',
        padding: 10,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        flexDirection: 'column',
    },
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
        '& img, h3': {
            pointerEvents: 'none',
        }
    },
    gridItemPaper: {
        height: 280,
        padding: 10,
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        userSelect: 'none',
        cursor: 'pointer',
    },
    blockTitle: {
        zIndex: 100,
    },
});

export default function Main() {
    const classes = useStyles();
    const blockTitles = ['fruits', 'vegetables', 'discounts', 'all'];

    return (
        <Grid container spacing={4} justify="center">
            <Grid item xs={12}>
                <Paper className={classes.welcomePaper} elevation={3}>
                    <Typography variant="h2">Welcome to</Typography>
                    <Typography variant="h2">Fruits n' Veggies!</Typography>
                </Paper>
            </Grid>

            {blockTitles.map((title) => (
                <Grid className={classes.gridItem} item xs={12} sm={6} key={title}>
                    <Link to={title}>
                        <Paper className={classes.gridItemPaper} elevation={3}>
                            <img src={require(`../images/${title}.png`).default} alt={title} />
                            <Typography className={classes.blockTitle} variant="h3">{title}</Typography>
                        </Paper>
                    </Link>
                </Grid>
            ))}
        </Grid>
    );
}