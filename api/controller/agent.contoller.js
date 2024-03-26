import bcrypt from 'bcryptjs'
import { errhandler } from "../utils/error.js";
import agent from '../model/agent.model.js';

export const test = (req,res) => {
    res.json({
        message : "this is test of api route"
    });
}

export const updateagent = async (req,res,next) => {
    // console.log(req.agent._id);
    // console.log(req.params.id);
    if(req.agent._id !== req.params.id) return next(errhandler(401,"*You are not authorized to do so!!!"));
    try {
        if(req.body.password){
            req.body.password = bcrypt.hashSync(req.body.password,10);
        }

        const updateagent = await agent.findByIdAndUpdate(req.params.id,{
                $set:{
                    agentname:req.body.agentname,
                    email:req.body.email,
                    password:req.body.password,
                    profilePic:req.body.profilePic,
                }
            },{new:true}
        );
        console.log("agent updated!!!");

        const {password,...rest} = updateagent._doc;
        console.log(rest);
        res.status(200).json(rest);
    } catch (error) {
        next(error)
    }
}

export const deleteagent = async (req,res,next) => {

    if(req.agent._id !== req.params.id) return next(errhandler(401,"*You are not authorized to do so!!!"));

    try {
        await agent.findByIdAndDelete(req.params.id);
        res.clearCookie('DrEstate_access_token');
        res.status(200).json('agent has been deleted!');

    } catch (error) {
        next(error);
    }
} 