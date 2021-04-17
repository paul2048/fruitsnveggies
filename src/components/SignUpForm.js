import axios from 'axios';
import CreateRoundedIcon from '@material-ui/icons/CreateRounded';
import { useState } from 'react';
import { Grid, MenuItem, TextField, Select, Button, Typography, makeStyles } from '@material-ui/core';

// const useStyles = makeStyles({
//     form: {
//         '& input': {
//             width: '100%',
//         },
//     },
// });

export default function SignUpForm() {
    const [firstname, setFirstName] = useState('');
    const [lastname, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [city, setCity] = useState('');
    const [postcode, setPostcode] = useState('');
    const [street, setStreet] = useState('');
    const [citiesArr, setCitiesArr] = useState([]);
    // const classes = useStyles();

    const getCities = () =>
        axios.get('http://localhost:4000/cities')
            .then((resp) => setCitiesArr(resp.data.cities));

    // const handleCity = (courseName) => {
    //     setCourseName(courseName);
    //     setRequirements(false);
    //     axios.get(`http://localhost:4000/course/${courseName}`)
    //         .then((resp) => {
    //             const reqDesc = resp.data.course.requirements;
    //             setRequirementsDesc(reqDesc);
    //             if (reqDesc) setRequirements(false);
    //             else setRequirements(true);
    //         })
    //         .catch(() => {
    //             setRequirementsDesc('');
    //             setRequirements(true);
    //         });
    // }

    const handleFormErrors = (err) => err;

    const signUserUp = (e) => {
        // Prevent the page from reloading
        e.preventDefault();

        // Object that holds the data of the form
        const data = {
            firstname: firstname,
            lastname: lastname,
            email: email,
            password1: password1,
            password2: password2,
            city: city,
            postcode: postcode,
            street: street
        };
        console.log(data);

        // Send a request to the server to sign the user up
        axios.post('http://localhost:4000/accounts/signup', data)
            .then((response) => {
                const msg = JSON.stringify(response.data);
                console.log(msg);
                // Empty the form
                // setFirstName('');
                // setLastName('');
                // setEmail('');
                // setDateOfBirth(defaultDate);
                // setCourseName('');
                // setRequirements(false);
                // setCoursesArr([]);
                // setRequirementsDesc('');
            })
            .catch((err) => handleFormErrors(err));
    }

    const handleFirstName = (e) => {
        setFirstName(e.target.value);
    }

    const handleLastName = (e) => {
        setLastName(e.target.value);
    }

    const handleEmail = (e) => {
        setEmail(e.target.value);
    }

    const handlePassword1 = (e) => {
        setPassword1(e.target.value);
    }

    const handlePassword2 = (e) => {
        setPassword2(e.target.value);
    }

    const handleCity = (e) => {
        setCity(e.target.value);
    }

    const handlePostcode = (e) => {
        setPostcode(e.target.value);
    }

    const handleStreet = (e) => {
        setStreet(e.target.value);
    }

    const handleCitiesArr = (e) => {
        setCitiesArr(e.target.value);
    }

    return (
        <form method="POST" onSubmit={signUserUp}>
            <Grid container spacing={2} alignItems="center" direction="column">
                <Grid item>
                    <Typography variant="h3">Sign up</Typography>
                </Grid>
                
                <Grid item>
                    <TextField
                        // id="first-name-input"
                        value={firstname}
                        onChange={handleFirstName}
                        label="First name"
                        variant="outlined"
                    />
                </Grid>

                <Grid item>
                    <TextField
                        // id="last-name-input"
                        value={lastname}
                        onChange={handleLastName}
                        label="Last name"
                        variant="outlined"
                    />
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
                        // id="password1-input"
                        value={password1}
                        onChange={handlePassword1}
                        label="Password"
                        type="password"
                        variant="outlined"
                    />
                </Grid>

                <Grid item>
                    <TextField
                        // id="password2-input"
                        value={password2}
                        onChange={handlePassword2}
                        label="Confirm password"
                        type="password"
                        variant="outlined"
                    />
                </Grid>

                <Grid item>
                    <Select
                        // id="city-input"
                        value={city}
                        onChange={handleCity}
                        onOpen={getCities}
                        label="City"
                        variant="outlined"
                    >
                        <MenuItem key={-1} value=""></MenuItem>
                        {citiesArr.map((city, i) =>
                            <MenuItem key={i} value={city}>{city}</MenuItem>)}
                    </Select>
                </Grid>

                <Grid item>
                    <TextField
                        // id="postcode-input"
                        value={postcode}
                        onChange={handlePostcode}
                        label="Postcode"
                        variant="outlined"
                    />
                </Grid>

                <Grid item>
                    <TextField
                        // id="street-input"
                        value={street}
                        onChange={handleStreet}
                        label="Street"
                        variant="outlined"
                    />
                </Grid>

                <Grid item>
                    <Button variant="contained" color="primary" type="submit">
                        <CreateRoundedIcon />Sign up
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
}