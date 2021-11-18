import axios from 'axios';
import { useState, useEffect } from "react"
import { baseUrl } from "../../core"
// import { GlobalContext } from './../../context/Context';
// import { useContext } from "react";
// import Post from "./post"
import Profile from '../profile';
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
    over: yup
        .number('Enter Anyone number')
        .required('Ball is required'),
    bowlerBalls: yup
        .number('Enter Anyone number')
        .required('Ball is required'),
    batsmanBalls: yup
        .number('Enter Anyone number')
        .required('Ball is required'),
});



function Dashboard() {
    const [posts, setPosts] = useState([])
    let history = useHistory();

    const formik = useFormik({
        validationSchema: validationSchema,
        initialValues: {
            over: '',
            bowlerBalls: '',
            batsmanBalls: '',
        },
        onSubmit: function (values) {
            console.log(values);
            axios.post(`${baseUrl}/api/v1/ball`, {
                over: values.over,
                bowlerBalls: values.bowlerBalls,
                batsmanBalls: values.batsmanBalls,
            }, {
                withCredentials: true
            })
                .then((res) => {
                    console.log("res: ", res.data);
                })

        }
    });


    useEffect(() => {
        axios.get(`${baseUrl}/api/v1/ball?page=0`, {
            withCredentials: true
        })
            .then((res) => {
                console.log("res +++: ", res.data);
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
        socket.on('POSTS', function (data) {
            console.log(data);
            setPosts([data, ...posts])
            console.log(posts);

        });

        return () => {
            socket.close();
        };
    }, []);

    // const loadMore = () => {
    //         axios.get(`${baseUrl}/api/v1/posts?page=${posts.length}`,
    //             {
    //                 withCredentials: true
    //             })
    //             .then((res) => {
    //                 console.log("res +++: ", res.data);
    //                 if (res.data?.length) {
    //                     const newPosts = [...posts, ...res.data]
    //                     setPosts(newPosts)
    //                 } else {
    //                     setIsMore(false)
    //                 }
    //             })
    //     }
    return (
        <>
         <div style={{ width: "30%" }}>
                {/* <h1 style={{ textAlign: "center", color: "blueviolet" }}>dash</h1> */}

                <form onSubmit={formik.handleSubmit}>
                    <Stack spacing={2}>

                        <TextField
                                style={{ width: "200px", height: "7vh", fontSize: "22px" }}

                            fullWidth
                            color="primary"
                            id="over"
                            label="over"
                            variant="outlined"
                            type="Number"
                            value={formik.values.over}
                            onChange={formik.handleChange}

                            error={formik.touched.over && Boolean(formik.errors.over)}
                            helperText={formik.touched.over && formik.errors.over}
                        />

                        <TextField
                                style={{ width: "200px", height: "7vh", fontSize: "22px" }}

                            fullWidth
                            color="primary"
                            id="bowlerBalls"
                            label="bowlerBalls"
                            variant="outlined"
                            type="Number"

                            value={formik.values.bowlerBalls}
                            onChange={formik.handleChange}

                            error={formik.touched.bowlerBalls && Boolean(formik.errors.bowlerBalls)}
                            helperText={formik.touched.bowlerBalls && formik.errors.bowlerBalls}
                        />

                        <TextField
                                style={{ width: "200px", height: "7vh", fontSize: "22px" }}

                            fullWidth
                            color="primary"
                            id="batsmanBalls"
                            label="batsmanBalls"
                            variant="outlined"
                            type="Number"


                            value={formik.values.batsmanBalls}
                            onChange={formik.handleChange}

                            error={formik.touched.batsmanBalls && Boolean(formik.errors.batsmanBalls)}
                            helperText={formik.touched.batsmanBalls && formik.errors.batsmanBalls}
                        />

                        <Button 
                                style={{ width: "200px", height: "7vh", fontSize: "22px" }}
                                fullWidth variant="contained" color="primary" type="submit">Send Data</Button>

                    </Stack>

                </form>



            </div>

                                {/* <Profile /> */}
{/* 
            {posts.map((eachPost, index) => (
                <div key={index}>
                    <h1>over{eachPost?.over}</h1>
                    <h1>BowlerBowls{eachPost?.bowlerBalls}</h1>
                    <h1>batsmanBowls{eachPost?.batsmanBalls}</h1>
                    <div className="row row-cols-1 row-cols-md-2 g-4">
                        <div className="col">
                            <div className="card">

                                <div className="card-body">
                                    <h5 className="card-title">{eachPost?.over}</h5>
                                    <h5 className="card-text">{eachPost?.batsmanBalls}</h5>
                                    <h5 className="card-text">{eachPost?.bowlerBalls}</h5>
                                    
                                </div>
                            </div>
                        </div>
                        <div className="col">
                            <div className="card">

                                <div className="card-body">
                                    <h5 className="card-title">Card title</h5>
                                    <p className="card-text">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                                </div>
                            </div>
                        </div>
                     
                    </div>
                </div>

            ))} */}
        </>
    );
}

export default Dashboard;