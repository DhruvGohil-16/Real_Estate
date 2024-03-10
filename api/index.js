import express from 'express';  //make type in package.json as "module"
// const express = require('express');
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userrouter from './routes/user.route.js';
import authrouter from './routes/auth.route.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

const port = process.env.PORT || 1624;

mongoose.connect(process.env.MONGO) //promise if we are connected of not method:mongoose.connect()
        .then(() => console.log("--Connected to real-estate database--"))
        .catch((err) => {console.log(err);})

app.listen(port, ()=>{
    console.log("--Server running on port 1624--");
});

app.get("/", (req,res)=>{
    res.send("Welcome to dhruv's real estate");
});

app.use(express.json());    //enable to get json data to server

app.use(cookieParser());

app.use('/api/user',userrouter);    //user test route

app.use('/api/auth',authrouter);    //authentication route "sign-up"

app.use((err,req,res,next) => {    //error handling middleware
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    // console.log(message);
    return res.status(statusCode).json({
        success:false,
        status:statusCode,
        message,
    });
});