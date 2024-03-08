import { Timestamp } from "bson";
import mongoose from "mongoose";
import Jwt from "jsonwebtoken";
import Joi from "joi";
import JoiPasswordComplexity from "joi-password-complexity";

const userSchema = new mongoose.Schema({    //user attribute to be stored in database
        username : {
            type : String,
            required : true,
            unique : true,
        },

        email : {
            type : String,
            required : true,
            unique : true,
        },

        password : {
            type : String,
            required : true,
            minlength : 8,
        },
        profilePic :{
            type : String,
            default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRk8Gl9eN3We2TcCYbPyAxqG6SqN02Wey-1vB0iuhZfyw&s",
        },
    },{timestamps:true});

    //  generate jwt token containing userid,private key & expiring time
    userSchema.methods.generateAuthToken = function(){
        console.log("Inside jwt generate");
        const token = Jwt.sign({_id:this._id},process.env.JwtPrivateKey,{expiresIn:"7d"});
        return token;
    };

const user = mongoose.model('User',userSchema);

const validate = (data) => {
    console.log("inside validate");
    const schema = Joi.object({
        username:Joi.string().required().label("username"),
        email:Joi.string().required().label("email"),
        password:JoiPasswordComplexity().required().label("password"),
    });
    return schema.validate(data);
};

export default user;