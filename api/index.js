import express from 'express';  //make type in package.json as "module"
// const express = require('express');
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userrouter from './routes/user.route.js';
import authrouter from './routes/auth.route.js';

dotenv.config();
const app = express();
const port = 1624;
mongoose.connect(process.env.MONGO)
        .then(() => console.log("--Connected to real-estate database--"))
        .catch((err) => {console.log(err);})

app.listen(port, ()=>{
    console.log("--Server running on port 1624--");
});
app.use(express.json());    //enable to get json data to server
app.use('/api/user',userrouter);    //user test route
app.use('/api/auth',authrouter);    //authentication route "sign-up"