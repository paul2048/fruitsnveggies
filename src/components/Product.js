import AddShoppingCartRoundedIcon from '@material-ui/icons/AddShoppingCartRounded';
import { Typography, Grid, makeStyles, Button, Link, FormControl, OutlinedInput } from '@material-ui/core';

const useStyles = makeStyles({
    nameAndPicLink: {
        textAlign: 'center',
        cursor: 'pointer',
        '& :hover': {
            '& *': {
                transform: 'scale(1.04)',
            },
        },
    },
    formGrid: {
      textAlign: 'center',  
    },
    quntityInput: {
        width: 64,
        height: 36,
    },
    addBtn: {
        width: "100%",
    },
});

export default function Product(props) {
    // const [quantity, setProducts] = useState([]);
    const { name, price, is_sold_per_unit } = props;
    const classes = useStyles();

    return (
        <Grid container spacing={1} justify="center" alignItems="center">
            <Grid item sm={12}>
                <Link className={classes.nameAndPicLink} to="test">
                    <Grid container alignItems="center" direction="column">
                        <Grid item sm={12}>
                            <Typography variant="h5">{name}</Typography>
                        </Grid>

                        <Grid item sm={12}>
                            {console.log(`../images/products/${name.toLowerCase()}.png`)}
                            <img src={require(`../images/products/${name.toLowerCase()}.png`).default} alt={name} />
                        </Grid>
                    </Grid>
                </Link> 
            </Grid>

            <Grid item sm={12}>
                <form variant="contained">
                    <Grid
                        className={classes.formGrid}
                        container
                        spacing={2}
                        justify="center"
                        alignItems="center"
                    >
                        <Grid item xs={3} sm={6} md={3}>
                            £{price}
                            <small>/{is_sold_per_unit ? "unit" : "200g" }</small>
                        </Grid>

                        <Grid item xs={3} sm={6} md={3}>
                            <FormControl>
                                <OutlinedInput
                                    className={classes.quntityInput}
                                    type="number"
                                    inputProps={{ min: 1, max: 32}}
                                />
                            </FormControl>
                        </Grid>

                        <Grid item xs={6} sm={12} md={6}>
                            <Button
                                className={classes.addBtn}
                                variant="contained"
                                color="primary"
                            >
                                <AddShoppingCartRoundedIcon /> Add £{price}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Grid>
        </Grid>
    )
}