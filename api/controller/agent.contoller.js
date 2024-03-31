import bcryptjs from 'bcryptjs'
import { errhandler } from "../utils/error.js";
import agent from '../model/agent.model.js';
import list from '../model/list.model.js';

export const test = (req,res) => {
    res.json({
        message : "this is test of api route"
    });
}

export const updateagent = async (req,res,next) => {
    
    if(req.agent._id !== req.params.id) return next(errhandler(401,"*You are not authorized to do so!!!"));
    try {
        console.log(req.body);
        if(!req.body.agpassword && req.body.agnewpassword)
            return next(errhandler(404,"*Please enter old password first!!!"));
        else if(req.body.agnewpassword){
            console.log("inside 2");
            const checkAgent = await agent.findById(req.params.id);
            if(!bcryptjs.compareSync(req.body.agpassword, checkAgent.password))
                return next(errhandler(404,"*password is incorrect!!!"));
            else if(bcryptjs.compareSync(req.body.agnewpassword, checkAgent.password))
                return next(errhandler(404,"*Your new password must be different from your old password!!!"));
            else
                req.body.agpassword = bcryptjs.hashSync(req.body.agnewpassword,10);
        }
        const updateagent = await agent.findByIdAndUpdate(req.params.id,{
                $set:{
                    agentname:req.body.agname,
                    email:req.body.agemail,
                    password:req.body.agpassword,
                    role: req.body.role,
                    location: {
                        country: req.body.country,
                        state: req.body.state,
                        city: req.body.city
                    },
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
        res.clearCookie('DrEstate_agent_access_token');
        res.status(200).json('agent has been deleted!');

    } catch (error) {
        next(error);
    }
}

export const verifynewlisting = async (req, res, next) => {
    if(req.agent._id !== req.params.id) return next(errhandler(401,"*You are not authorized to do so!!!"));
    try {
        console.log("verifynewlisting");
        const verifynewListings = await list.find({ reqAccepted: 0, agent: req.params.id, reqViewd:false });
        
        if(verifynewListings) 
            res.status(200).json({ success: true, data: verifynewListings });
        else
            next(errhandler(404,"No new listing"));
    } catch (error) {
        next(errhandler(500,error));
    }
};

export const verifyrecentlisting = async (req, res, next) => {
    if(req.agent._id !== req.params.id) return next(errhandler(401,"*You are not authorized to do so!!!"));
    try {
        console.log("verifyrecentlisting");
        const verifyrecentListings = await list.find({ reqAccepted: 0, agent: req.params.id, reqViewd:true });
        
        if(verifyrecentListings) 
            res.status(200).json({ success: true, data: verifyrecentListings });
        else
            next(errhandler(404,"No recent listing"));
    } catch (error) {
        next(errhandler(500,error));
    }
};

export const newCount = async (req, res, next) => {
    if(req.agent._id !== req.params.id) return next(errhandler(401,"*You are not authorized to do so!!!"));
    try {
        
        const newCounts = await agent.findById(req.params.id);
        res.status(200).json({ success: true, data: newCounts.new });
    } catch (error) {
        next(errhandler(500,error));
    }
};