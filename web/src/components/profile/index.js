import axios from 'axios';
import { useState, useEffect } from "react"
import { baseUrl } from "./../../core"
// import { GlobalContext } from './../../context/Context';
// import { useContext } from "react";
// import Post from "./post"
import { useHistory } from 'react-router';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import io from 'socket.io-client';
import * as yup from 'yup';
import { useFormik } from "formik";

const validationSchema = yup.object({
    score: yup
        .number('Enter Anyone number')
        .required('Ball is required'),
    wicket: yup
        .number('Enter Anyone number')
        .required('Ball is required'),
    bowlerwicket: yup
        .number('Enter Anyone number')
        .required('Ball is required'),
});


function Profile() {
    const [posts, setPosts] = useState([])
    let history = useHistory();

    const formik = useFormik({
        validationSchema: validationSchema,
        initialValues: {
            score: '',
            wicket: '',
            bowlerwicket: '',
        },
        onSubmit: function (values) {

            console.log(values);

            axios.post(`${baseUrl}/api/v1/score`, {
                score: values.score,
                wicket: values.wicket,
                bowlerwicket: values.bowlerwicket,
            }, {
                withCredentials: true
            })
                .then((res) => {
                    console.log("res: ", res.data);
                })

        }
    });


    useEffect(() => {
        axios.get(`${baseUrl}/api/v1/score?page=0`, {
            withCredentials: true
        })
            .then((res) => {
                console.log("res score api: ", res.data);
                setPosts(res.data)

            })
    }, [])

    useEffect(() => {
        const socket = io("http://localhost:5001"); // to connect with locally running Socker.io server

        socket.on('connect', function () {
            console.log("connected to server")
        });
        socket.on('disconnect', function (message) {
            console.log("disconnected from server: ", message);
        });
        socket.on('SCORE', function (data) {
            console.log(data);
            setPosts([data, ...posts])
            // console.log(posts);

        });

        return () => {
            socket.close();
        };
    }, []);

   

    return (
        <>
            {/* <Box sx={{ flexGrow: 1 }} >
                <AppBar position="static" sx={{ flexGrow: 1 }}>
                    <Toolbar >
                        <Button variant="h6" color="inherit" onClick={() => { history.push("/") }} sx={{ flexGrow: 1 }}>Login</Button >
                        <Button variant="h6" color="inherit" onClick={() => { history.push("/signup") }} sx={{ flexGrow: 1 }}>Signup</Button>
                    </Toolbar>
                </AppBar>
            </Box> */}


            <div style={{width: "30%"}}>
                {/* <h1 style={{ textAlign: "center", color: "blueviolet" }}>Signup page</h1> */}

                <form onSubmit={formik.handleSubmit}>
                    <Stack spacing={2}>

                        <TextField
                                style={{ width: "200px", height: "7vh", fontSize: "22px" }}

                            fullWidth
                            color="primary"
                            id="score"
                            label="score"
                            variant="outlined"
                            type="Number"
                            value={formik.values.score}
                            onChange={formik.handleChange}

                            error={formik.touched.score && Boolean(formik.errors.score)}
                            helperText={formik.touched.score && formik.errors.score}
                        />

                        <TextField
                                style={{ width: "200px", height: "7vh", fontSize: "22px" }}

                            fullWidth
                            color="primary"
                            id="wicket"
                            label="wicket"
                            variant="outlined"
                            type="Number"

                            value={formik.values.wicket}
                            onChange={formik.handleChange}

                            error={formik.touched.wicket && Boolean(formik.errors.wicket)}
                            helperText={formik.touched.wicket && formik.errors.wicket}
                        />

                        <TextField
                                style={{ width: "200px", height: "7vh", fontSize: "22px" }}

                            fullWidth
                            color="primary"
                            id="bowlerwicket"
                            label="bowlerwicket"
                            variant="outlined"
                            type="Number"


                            value={formik.values.bowlerwicket}
                            onChange={formik.handleChange}

                            error={formik.touched.bowlerwicket && Boolean(formik.errors.bowlerwicket)}
                            helperText={formik.touched.bowlerwicket && formik.errors.bowlerwicket}
                        />

                        <Button
                                style={{ width: "200px", height: "7vh", fontSize: "22px" }}
                                fullWidth variant="contained" color="primary" type="submit">Send Data</Button>

                    </Stack>

                </form>


              
            </div>


     </>
    );
}

export default Profile;