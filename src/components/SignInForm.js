import ExitToAppRoundedIcon from '@material-ui/icons/ExitToAppRounded';
import { useState } from 'react';
import { TextField, Grid, Button, Typography } from '@material-ui/core';

export default function SignInForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const signUserIn = (e) => {
        // Prevent the page from reloading
        e.preventDefault();

        // Object that holds the data of the form
        const data = {
            email: email,
            password: password,
        };
        console.log(data);
    }

    const handleEmail = (e) => {
        setEmail(e.target.value);
    }

    const handlePassword = (e) => {
        setPassword(e.target.value);
    }

    return (
        <form method="POST" onSubmit={signUserIn}>
            <Grid container spacing={2} alignItems="center" direction="column">
                <Grid item>
                    <Typography variant="h3">Sign in</Typography>
                </Grid>

                <Grid item>
                    <TextField
                        // id="email-input"
                        value={email}
                        onChange={handleEmail}
                        autoComplete
                        label="Email address"
                        variant="outlined"
                    />
                </Grid>

                <Grid item>
                    <TextField
                        // id="password-input"
                        value={password}
                        onChange={handlePassword}
                        label="Password"
                        type="password"
                        variant="outlined"
                    />
                </Grid>

                <Grid item>
                    <Button variant="contained" color="primary" type="submit">
                        <ExitToAppRoundedIcon />Sign in
                    </Button>
                </Grid>
            </Grid>
        </form>
    )
}