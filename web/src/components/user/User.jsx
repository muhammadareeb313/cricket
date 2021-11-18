import * as React from 'react';

import axios from 'axios';
import { useState, useEffect } from "react"
import { baseUrl } from "../../core"
// import { GlobalContext } from './../../context/Context';
// import { useContext } from "react";
// import Post from "./post"
// import Profile from '../profile';
import { useHistory } from 'react-router';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import io from 'socket.io-client';
// import * as yup from 'yup';
// import { useFormik } from "formik";








function Admin (){
    const [posts, setPosts] = useState([])
    const [postsB, setPostsB] = useState([])
    const [postsC, setPostsC] = useState([])




    useEffect(() => {
        axios.get(`${baseUrl}/api/v1/ball?page=0`, {
            withCredentials: true
        })
            .then((res) => {
                console.log("res ball api: ", res.data);
                setPosts(res.data)

            })
    }, [])

    
    useEffect(() => {
        axios.get(`${baseUrl}/api/v1/score?page=0`, {
            withCredentials: true
        })
            .then((res) => {
                console.log("res score api: ", res.data);
                setPostsB(res.data)

            })
    }, [])
     
    useEffect(() => {
        axios.get(`${baseUrl}/api/v1/player?page=0`, {
            withCredentials: true
        })
            .then((res) => {
                console.log("res player api: ", res.data);
                setPostsC(res.data)

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
        socket.on('SCORE', function (data) {
            console.log(data);
            setPostsB([data, ...postsB])
            console.log(postsB);

        });
          socket.on('PLAYER', function (data) {
            console.log(data);
            setPostsC([data, ...postsC])
            console.log(postsC);

        });

        return () => {
            socket.close();
        };
    }, []);








    return(

    <div>
       
        <div className="row row-cols-1 row-cols-md-2 g-4 mt-1">
        <div className="col">
            <div className="card">
                <div className="card-body">
                 <h1>Pakistan</h1>   
                {postsB.map((eachPost, index) => (<h1 key={index} style={{display:"inline"}}>{eachPost?.score} / </h1>))}
                {postsB.map((eachPost, index) => (<h1 key={index} style={{display:"inline"}}>{eachPost?.wicket} </h1>))}
                {posts.map((eachPost, index) => (<h1 key={index} style={{display:"inline" ,marginLeft:"5%"}}>({eachPost?.over})Overs</h1>))}<br/><br/><br/>
                {postsC.map((eachPost, index) => (<h1 key={index} style={{display:"inline"}}>({eachPost?.batsmanAName})*</h1>))}
                {posts.map((eachPost, index) => (<h1 key={index} style={{display:"inline"}}>({eachPost?.batsmanBalls})</h1>))}
                {postsC.map((eachPost, index) => (<h1 key={index} style={{display:"inline"}}>Runs{eachPost?.batsmanARuns}</h1>))}
                {postsC.map((eachPost, index) => (<h3 key={index} style={{display:"inline"}}>Balls{eachPost?.batsmanABalls}</h3>))}<br/>

                {postsC.map((eachPost, index) => (<h1 key={index} style={{display:"inline"}}>{eachPost?.batsmanBName}</h1>))}
                {postsC.map((eachPost, index) => (<h3 key={index} style={{display:"inline"}}>Runs{eachPost?.batsmanBRuns}</h3>))}
                {postsC.map((eachPost, index) => (<h3 key={index} style={{display:"inline"}}>Balls{eachPost?.batsmanBBalls}</h3>))}



                </div>
            </div>
        </div>
        <div className="col">
            <div className="card">
                <div className="card-body">
              <h1>Australia</h1>   
              {postsC.map((eachPost, index) => (<h3 key={index} >{eachPost?.bowlerNameA}</h3>))}
                {postsC.map((eachPost, index) => (<h3 key={index} style={{display:"inline"}}>{eachPost?.bowlerNameB}</h3>))}    {postsB.map((eachPost, index) => (<h1 key={index} style={{display:"inline"}}>{eachPost?.bowlerwicket}w</h1>))}<br/><br/><br/>

                <h2 style={{display:"inline"}}className="card-title">BowlerB</h2><h3 style={{display:"inline"}}>Bowler runs</h3><h3 style={{display:"inline"}}>Bowler wicket</h3>

                  
                </div>
            </div>
        </div>
       
    </div>
    </div>
    )
};
export default Admin