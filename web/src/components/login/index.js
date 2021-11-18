import axios from 'axios';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import * as yup from 'yup';
import { baseUrl } from "./../../core"

import { GlobalContext } from '../../context/Context';
import { useContext } from "react";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import { useFormik} from "formik";
import { useHistory } from 'react-router';

const validationSchema = yup.object({
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

  let { dispatch } = useContext(GlobalContext);


  const formik = useFormik({
    validationSchema: validationSchema,
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: function (values) {
      console.log("values: ", values)

      axios.post(`${baseUrl}/api/v1/login`, {
        email: values.email,
        password: values.password,
      }, {
        withCredentials: true
      })
        .then((res) => {
          console.log("res: ", res.data);

          if (res.data.email) {

            dispatch({
              type: "USER_LOGIN",
              payload: {
                name: res.data.name,
                email: res.data.email,
                _id: res.data._id
              }
            })
            // history.push("/")
          }


        })

    }
  });

  return (

<>
<Box sx={{ flexGrow: 1 }} >
      <AppBar  position="static" > 
        <Toolbar
        >
      
          {/* <Button style={{textAlign:"center"}} variant="h1" color="inherit"onClick={() => { history.push("/") }}>Dashboard</Button> */}
          <Button variant="h6"color="inherit"onClick={() => { history.push("/") }} sx={{ flexGrow: 2 }}>Login</Button>
          <Button variant="h6"color="inherit"onClick={() => { history.push("/signup") }} sx={{ flexGrow: 2 }}>Signup</Button>
        </Toolbar>
      </AppBar>
    </Box>


    <div style={{ margin: "2rem" }}>
      <h1 style={{textAlign:"center",color:"blueviolet"}} >Login page</h1>

      <form onSubmit={formik.handleSubmit}>
        <Stack spacing={2}>

          <TextField
            fullWidth
            color="primary"
            id="outlined-basic"
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

          <Button fullWidth variant="contained" color="primary" type="submit">Login</Button>
          <Button  fullWidth variant="contained" color="primary"onClick={() => { history.push("/signup") }}>Create an Account</Button>
      
        </Stack>

      </form>

    </div>
</>

  );
}
export default Weather;