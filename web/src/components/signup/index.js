import axios from 'axios';

import { useFormik } from "formik";
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import * as yup from 'yup';
import { baseUrl } from "./../../core"
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import { useHistory } from 'react-router';
const validationSchema = yup.object({
    name: yup
        .string('Enter your name')
        .required('Name is required'),
    email: yup
        .string('Enter your email')
        .email('Enter a valid email')
        .required('Email is required'),
    password: yup
        .string('Enter your password')
        .min(8, 'Password should be of minimum 8 characters length')
        .max(10, 'No more then 10')
        .required('Password is required'),
});

function Weather() {
    let history = useHistory();

    const formik = useFormik({
        validationSchema: validationSchema,
        initialValues: {
            name: '',
            email: '',
            password: '',
        },
        onSubmit: function (values) {
            axios.post(`${baseUrl}/api/v1/signup`, {
                name: values.name,
                email: values.email,
                password: values.password,
            })
                .then((res) => {
                    console.log("res: ", res.data);
                    history.push("/")
                })
        }
    });

    return (
<>
<Box sx={{ flexGrow: 1 }} >
      <AppBar  position="static" sx={{ flexGrow: 1 }}> 
        <Toolbar >
        <Button variant="h6"color="inherit"onClick={() => { history.push("/") }} sx={{ flexGrow: 1 }}>Login</Button >
          <Button variant="h6"color="inherit"onClick={() => { history.push("/signup") }} sx={{ flexGrow: 1 }}>Signup</Button>
        </Toolbar>
      </AppBar>
    </Box>


        <div style={{ margin: "2rem" }}>
            <h1 style={{textAlign:"center",color:"blueviolet"}}>Signup page</h1>

            <form onSubmit={formik.handleSubmit}>
                <Stack spacing={2}>

                    <TextField
                        fullWidth
                        color="primary"
                        id="outlined-basic"
                        label="Full Name"
                        variant="outlined"

                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}

                        error={formik.touched.name && Boolean(formik.errors.name)}
                        helperText={formik.touched.name && formik.errors.name}
                    />

                    <TextField
                        fullWidth
                        color="primary"
                        id="outlined-ba"
                        label="Email"
                        variant="outlined"

                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}

                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                    />

                    <TextField
                        fullWidth
                        color="primary"
                        id="filled-basic"
                        label="Password"
                        variant="outlined"
                        type="password"

                        name="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}

                        error={formik.touched.password && Boolean(formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password}
                    />

                    <Button fullWidth variant="contained" color="primary" type="submit">Signup</Button>
          <Button  fullWidth variant="contained" color="primary"onClick={() => { history.push("/") }}>Already have an Account</Button>

                </Stack>

            </form>

        </div>
        </>
    );
}
export default Weather;