import bcrypt from 'bcryptjs'
import { errhandler } from "../utils/error.js";
import user from '../model/user.model.js';

export const test = (req,res) => {
    res.json({
        message : "this is test of api route"
    });
}

export const updateUser = async (req,res,next) => {
    // console.log(req.user._id);
    // console.log(req.params.id);
    if(req.user._id !== req.params.id) return next(errhandler(401,"you are not authorized to do so!!!"));
    try {
        if(req.body.password){
            req.body.password = bcrypt.hashSync(req.body.password,10);
        }

        const updateUser = await user.findByIdAndUpdate(req.params.id,{
                $set:{
                    username:req.body.username,
                    email:req.body.email,
                    password:req.body.password,
                    profilePic:req.body.profilePic,
                }
            },{new:true}
        );

        const {password,...rest} = updateUser._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error)
    }
}