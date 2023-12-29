import user from '../model/user.model.js';
import bcryptjs from 'bcryptjs';
import { errhandler } from '../utils/error.js';

export const signup = async(req,res,next) => {   //makes call asynchronous
    
    const {username, email, password} = req.body;
    const encryptpassword = bcryptjs.hashSync(password,10);
    const newUser = new user({username, email, password:encryptpassword});

    try{
        await newUser.save()    //next line of te code will be executed after data saved in db 
        res.status(201).json("User created successfully...");

    }catch(err){
        next(err);  //system error middleware generator
    }
}