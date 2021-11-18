import axios from 'axios';
import { useState, useEffect } from "react"
import { baseUrl } from "../../core"
// import { GlobalContext } from './../../context/Context';
// import { useContext } from "react";
// import Post from "./post"
import Dashboard from '.';
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
    batsmanARuns: yup
        .number('Enter Anyone number')
        .required('Ball is required'),
    batsmanABall: yup
        .number('Enter Anyone number')
        .required('Ball is required'),
    batsmanBRuns: yup
        .number('Enter Anyone number')
        .required('Ball is required'),
    batsmanBBall: yup
        .number('Enter Anyone number')
        .required('Ball is required'),
});



function Post() {
    const [batsmanNameA, setBatsmanNameA] = useState("Babar Azam");
    const [batsmanNameB, setBatsmanNameB] = useState("Rizwan");
    const [bowlerNameA, setBowlerNameA] = useState("Mitchell Starc");
    const [bowlerNameB, setBowlerNameB] = useState("Pat Cummins");
    const [posts, setPosts] = useState([])
    let history = useHistory();

    const formik = useFormik({
        validationSchema: validationSchema,
        initialValues: {
            batsmanABall: '',
            batsmanARuns: '',
            batsmanBBall: '',
            batsmanBRuns: '',
        },
        onSubmit: function (values) {
            console.log(values);
            values.batsmanNameA = batsmanNameA;
            values.batsmanNameB = batsmanNameB;
            values.bowlerNameA = bowlerNameA;
            values.bowlerNameB = bowlerNameB;


            console.log(values.batsmanNameA);
            console.log(values.batsmanNameB);
            console.log(values.bowlerNameA);
            console.log(values.bowlerNameB);



            axios.post(`${baseUrl}/api/v1/player`, {
                batsmanAName: values.batsmanNameA,
                batsmanBName: values.batsmanNameB,
                bowlerNameA: values.bowlerNameA,
                bowlerNameB: values.bowlerNameB,
                batsmanABall: values.batsmanABall,
                batsmanARuns: values.batsmanARuns,
                batsmanBBall: values.batsmanBBall,
                batsmanBRuns: values.batsmanBRuns,
            }, {
                withCredentials: true
            })
                .then((res) => {
                    console.log("res: ", res.data);
                })


        }
    });


    useEffect(() => {
        axios.get(`${baseUrl}/api/v1/player?page=0`, {
            withCredentials: true
        })
            .then((res) => {
                // console.log("res +++: ", res.data);
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

    const selectBatsmanA = (e) => {
        setBatsmanNameA(e.target.value);
    };


    const selectBatsmanB = (e) => {
        setBatsmanNameB(e.target.value);
    };

    const selectBowlerA = (e) => {
        setBowlerNameA(e.target.value);
    };
    const selectBowlerB = (e) => {
        setBowlerNameB(e.target.value);
    };
    return (
        <>
            <Box sx={{ flexGrow: 1 }} >
                <AppBar position="static" sx={{ flexGrow: 1 }}>
                    <Toolbar >
                        <Button variant="h6" color="inherit" onClick={() => { history.push("/user") }} sx={{ flexGrow: 1 }}>User Panel</Button >
                        {/* <Button variant="h6" color="inherit" onClick={() => { history.push("/signup") }} sx={{ flexGrow: 1 }}>Signup</Button> */}
                    </Toolbar>
                </AppBar>
            </Box>


<div style={{ display: "flex" ,flexDirection:"row",flexWrap:"wrap",justifyContent:"space-around", marginTop:"15px" }} >

<div> <Profile />  </div>
<div>  <Dashboard/> </div>
                
<div>
<div style={{ width: "40%" }}>
                    {/* <h1 style={{ textAlign: "center", color: "blueviolet" }}>dash</h1> */}
                 <form onSubmit={formik.handleSubmit}>
                        <Stack spacing={2}>
                            <select
                                style={{ width: "200px", height: "7vh", fontSize: "22px" }}
                                onChange={selectBatsmanA}
                            >
                                <option value="Babar Azam">Babar Azam</option>

                                <option value="Rizwan">Rizwan</option>
                                <option value="Fakhar Zaman">Fakhar Zaman</option>
                                <option value="Haider Ali">Haider Ali</option>
                                <option value="Mohammad Hafeez">Mohammad Hafeez</option>
                                <option value="Shoaib Malik">Shoaib Malik</option>
                                <option value="Asif Ali">Asif Ali</option>
                                <option value="Shadab Khan">Shadab Khan</option>
                                <option value="Imad Wasim">Imad Wasim</option>
                                <option value="Hasan Ali">Hasan Ali</option>
                                <option value="Shaheen Afridi">Shaheen Afridi</option>
                                <option value="Haris Rauf">Haris Rauf</option>
                            </select>
                            <select
                                style={{ width: "200px", height: "7vh", fontSize: "22px" }}
                                onChange={selectBatsmanB}
                            >

                                <option value="Mohammad Rizwan">Mohammad Rizwan</option>
                                <option value="Fakhar Zaman">Fakhar Zaman</option>
                                <option value="Haider Ali">Haider Ali</option>
                                <option value="Mohammad Hafeez">Mohammad Hafeez</option>
                                <option value="Shoaib Malik">Shoaib Malik</option>
                                <option value="Asif Ali">Asif Ali</option>
                                <option value="Shadab Khan">Shadab Khan</option>
                                <option value="Imad Wasim">Imad Wasim</option>
                                <option value="Hasan Ali">Hasan Ali</option>
                                <option value="Shaheen Afridi">Shaheen Afridi</option>
                                <option value="Haris Rauf">Haris Rauf</option>
                                <option value="Babar Azam">Babar Azam</option>
                            </select>


                            <select
                                style={{ width: "200px", height: "7vh", fontSize: "22px" }}
                                onChange={selectBowlerA}
                            >
                                <option value="Mitchell Starc">Mitchell Starc</option>
                                <option value="Adam Zampa">Adam Zampa</option>
                                <option value="Aaron Finch">Aaron Finch</option>
                                <option value="Ashton Agar">Ashton Agar</option>
                                <option value="Josh Hazlewood">Josh Hazlewood</option>
                                <option value="Josh Inglis">Josh Inglis</option>
                                <option value="Mitchell Marsh">Mitchell Marsh</option>
                                <option value="Glenn Maxwell">Glenn Maxwell</option>
                                <option value="Kane Richardson">Kane Richardson</option>
                                <option value="Steve Smith">Steve Smith</option>
                                <option value="Marcus Stoinis">Marcus Stoinis</option>
                                <option value="Pat Cummins">Pat Cummins</option>
                            </select>


                            <select
                                style={{ width: "200px", height: "7vh", fontSize: "22px" }}
                                onChange={selectBowlerB}
                            >
                                <option value="Pat Cummins">Pat Cummins</option>
                                <option value="Mitchell Starc">Mitchell Starc</option>
                                <option value="Adam Zampa">Adam Zampa</option>
                                <option value="Aaron Finch">Aaron Finch</option>
                                <option value="Ashton Agar">Ashton Agar</option>
                                <option value="Josh Hazlewood">Josh Hazlewood</option>
                                <option value="Josh Inglis">Josh Inglis</option>
                                <option value="Mitchell Marsh">Mitchell Marsh</option>
                                <option value="Glenn Maxwell">Glenn Maxwell</option>
                                <option value="Kane Richardson">Kane Richardson</option>
                                <option value="Steve Smith">Steve Smith</option>
                                <option value="Marcus Stoinis">Marcus Stoinis</option>
                            </select>




                            <TextField
                             style={{ width: "200px", height: "7vh", fontSize: "22px" }}
                                fullWidth
                                color="primary"
                                id="batsmanARuns"
                                label="batsmanARuns"
                                variant="outlined"
                                type="Number"
                                value={formik.values.batsmanARuns}
                                onChange={formik.handleChange}

                                error={formik.touched.batsmanARuns && Boolean(formik.errors.batsmanARuns)}
                                helperText={formik.touched.batsmanARuns && formik.errors.batsmanARuns}
                            />

                            <TextField
                             style={{ width: "200px", height: "7vh", fontSize: "22px" }}
                                fullWidth
                                color="primary"
                                id="batsmanABall"
                                label="batsmanABall"
                                variant="outlined"
                                type="Number"

                                value={formik.values.batsmanABall}
                                onChange={formik.handleChange}

                                error={formik.touched.batsmanABall && Boolean(formik.errors.batsmanABall)}
                                helperText={formik.touched.batsmanABall && formik.errors.batsmanABall}
                            />

                            <TextField
                             style={{ width: "20vw", height: "7vh", fontSize: "22px" }}
                                fullWidth
                                color="primary"
                                id="batsmanBRuns"
                                label="batsmanBRuns"
                                variant="outlined"
                                type="Number"


                                value={formik.values.batsmanBRuns}
                                onChange={formik.handleChange}

                                error={formik.touched.batsmanBRuns && Boolean(formik.errors.batsmanBRuns)}
                                helperText={formik.touched.batsmanBRuns && formik.errors.batsmanBRuns}
                            />
                            <TextField
                             style={{ width: "200px", height: "7vh", fontSize: "22px" }}
                                fullWidth
                                color="primary"
                                id="batsmanBBall"
                                label="batsmanBBall"
                                variant="outlined"
                                type="Number"


                                value={formik.values.batsmanBBall}
                                onChange={formik.handleChange}

                                error={formik.touched.batsmanBBall && Boolean(formik.errors.batsmanBBall)}
                                helperText={formik.touched.batsmanBBall && formik.errors.batsmanBBall}
                            />

                            <Button  style={{ width: "200px", height: "7vh", fontSize: "22px" }} fullWidth variant="contained" color="primary" type="submit">Send Data</Button>

                        </Stack>

                    </form>


                </div>
</div>
</div>




            {/* <div>
                <div>
                    
              
                </div>
               

              
            </div> */}

        </>
    );
}

export default Post;