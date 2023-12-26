import express from 'express';  //make type in package.json as "module"
// const express = require('express');
const app = express();
const port = 1624;

app.listen(port, ()=>{
    console.log("Server running on port 1624!!!!");
});