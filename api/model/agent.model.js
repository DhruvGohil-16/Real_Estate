import mongoose from "mongoose";
import Jwt from "jsonwebtoken";

const agentSchema = new mongoose.Schema({
    agentId : {
        type : String,
        default:"default",
    },

    name : {
        type : String,
        required : true,
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

    role:{
        type: String,
        required: true
    },

    location: {
        country: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
    },

    rejected:{
        type: Number,
        required: true,
        default: 0
    },

    new:{
        type: Number,
        required: true,
        default: 0
    },

    viewed:{
        type: Number,
        required: true,
        default: 0
    },

    verified:{
        type: Number,
        required: true,
        default: 0
    },

    sold:{
        type: Number,
        required: true,
        default: 0
    },

    profilePic :{
        type : String,
        default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRk8Gl9eN3We2TcCYbPyAxqG6SqN02Wey-1vB0iuhZfyw&s",
    },
  }, { timestamps: true });

  //  generate jwt token containing userid,private key & expiring time
  agentSchema.methods.generateAuthToken = function(){
    console.log("Inside jwt generate");
    const token = Jwt.sign({_id:this._id},process.env.JwtPrivateKey,{expiresIn:"7d"});
    return token;
};

const agent = mongoose.model('Agent',agentSchema);

export default agent;