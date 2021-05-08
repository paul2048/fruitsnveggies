import { Paper, makeStyles, Typography, Grid } from "@material-ui/core";

const useStyles = makeStyles({
  aboutPaper: {
    padding: 20,
  },
  perkImgContainer: {
    textAlign: 'center',
  },
  imgs: {
    width: '90%',
  },
  perkPaper: {
    padding: 30,
  },
});

export default function AboutUsPage() {
  const classes = useStyles();
  const perks = [
    ['undraw_healthy_options_sdo3', 'Health', 'We believe that health one of the most important things in life. The good part is that health usually comes at a small cost. For £10 you can eat a healthy and delicious salad! 🍎'],
    ['undraw_Website_setup_re_d4y9', 'Ease of use', 'Our interface has a minimalistic and aesthetically pleasing interface that allows everyone to easily search for the desired fruits and vegetables, add them to the basket, and order them! 🙌'],
    ['undraw_Bitcoin_P2P_re_1xqa', 'Crypto friendly', 'We love cryptocurrencies and we want to provide adoption to innovative ideas. You can spend your Bitcoin (BTC) on our fruits and vegetables! 🚀'],
  ];

  return (
    <Paper className={classes.aboutPaper}>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Typography variant="h3" align="center">About us</Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" align="center">
            We are a team of young and aspiring students that have the aim of give the world an online store that sells healthy products, is easy to use, and offers the options to pay with cryptocurrencies.
          </Typography>
        </Grid>

        {perks.map(([imgName, title, description]) => (
          <Grid item xs={12}>
            <Paper className={classes.perkPaper}>
              <Grid container spacing={3} justify="center">
                <Grid className={classes.perkImgContainer} item xs={12} sm={6}>
                  <img
                    className={classes.imgs}
                    src={require(`../images/${imgName}.svg`).default}
                    alt={imgName} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="h4" color="primary">{title}</Typography>
                  <Typography variant="h6">{description}</Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}