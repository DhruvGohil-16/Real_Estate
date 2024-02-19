import user from '../model/user.model.js';
import bcryptjs from 'bcryptjs';
import { errhandler } from '../utils/error.js';
import validate from '../model/user.model.js';

export const signup = async(req,res,next) => {   //makes call asynchronous
    
    const {username, email, password} = req.body;
    const encryptpassword = bcryptjs.hashSync(password,10);
    const newUser = new user({username, email, password:encryptpassword});
    try{
        console.log("Inside auth controller...");
        await newUser.save()    //next line of te code will be executed after data saved in db 
        return res.status(201).json("User created successfully...");

    }catch(err){
        console.log("Inside catch err");
        console.log(err);
        err.statusCode = 400;
        if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
            // Duplicate key error for 'email'
            err.message = '*Email already exists. Please choose a different email.';
        }
        else if (err.code === 11000 && err.keyPattern && err.keyPattern.username) {
            // Duplicate key error for 'username'
            err.message = '*Username already exists. Please choose a different username.';
        }
        next(err);  //system error middleware generator
    }
}