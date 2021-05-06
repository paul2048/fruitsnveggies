import { Paper, Grid, Typography, Avatar, makeStyles } from '@material-ui/core';
import { deepPurple, grey } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
  userPaper: {
    padding: 30,
  },
  avatar: {
    width: '220px',
    height: '220px',
    margin: 'auto',
    fontSize: 80,
    color: theme.palette.getContrastText(deepPurple[500]),
    backgroundColor: deepPurple[500],
  },
  userInfo: {
    '& :nth-child(2)': {
      color: grey[500],
      marginBottom: 15,
    },
    [theme.breakpoints.down('xs')]: {
      textAlign: 'center',
    },
  },
}));

export default function ProfilePage() {
  const classes = useStyles();
  const user = JSON.parse(localStorage.getItem('user'));
  const userInfo = [
    ['Full name', `${user.firstname} ${user.lastname}`],
    ['Email address', user.email],
    ['Phisical address', `${user.city}, ${user.street}, ${user.postcode}`]];

  return (
    <Grid container spacing={3} direction="column">
      <Grid item>
        <Paper className={classes.userPaper}>
          <Grid container spacing={4} justify="center">
            <Grid item xs={12}>
              <Typography variant="h3" align="center">User info</Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Avatar className={classes.avatar}>
                {user.firstname[0]}{user.lastname[0]}
              </Avatar>
            </Grid>

            <Grid item xs={12} md={8} alignItems="center">
              {userInfo.map(([attr, value]) => (
                <Grid className={classes.userInfo} container>
                  <Grid item xs={12} sm={5}>
                    <Typography variant="h6">{attr}: </Typography>
                  </Grid>

                  <Grid item xs={12} sm={7}>
                    <Typography variant="h6">{value}</Typography>
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      <Grid item>
        <Paper className={classes.userPaper}>
          <Grid container justify="center">
            <Grid item xs={12}>
              <Typography variant="h3" align="center">Add balance funds</Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      <Grid item>
        <Paper className={classes.userPaper}>
          <Grid container justify="center">
            <Grid item xs={12}>
              <Typography variant="h3" align="center">Order history</Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
}
