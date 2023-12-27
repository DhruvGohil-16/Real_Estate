import express from 'express';  //make type in package.json as "module"
// const express = require('express');
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const port = 1624;
mongoose.connect(process.env.MONGO)
        .then(() => console.log("--Connected to real-estate database--"))
        .catch((err) => {console.log(err);})

app.listen(port, ()=>{
    console.log("--Server running on port 1624--");
});