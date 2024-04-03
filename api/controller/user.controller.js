import bcrypt from 'bcryptjs'
import { errhandler } from "../utils/error.js";
import user from '../model/user.model.js';
import listBuyMap from '../model/listBuy.model.js';
import { sendEmail } from '../utils/sendEmail.js';

export const test = (req,res) => {
    res.json({
        message : "this is test of api route"
    });
}

export const updateUser = async (req,res,next) => {
    // console.log(req.user._id);
    // console.log(req.params.id);
    if(req.user._id !== req.params.id) return next(errhandler(401,"*You are not authorized to do so!!!"));
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
        console.log("user updated!!!");

        const {password,...rest} = updateUser._doc;
        console.log(rest);
        res.status(200).json(rest);
    } catch (error) {
        next(error)
    }
}

export const deleteUser = async (req,res,next) => {

    if(req.user._id !== req.params.id) return next(errhandler(401,"*You are not authorized to do so!!!"));

    try {
        await user.findByIdAndDelete(req.params.id);
        res.clearCookie('DrEstate_access_token');
        res.status(200).json('User has been deleted!');

    } catch (error) {
        next(error);
    }
}

export const userListing = async (req,res,next) => {

    if(req.user._id !== req.params.id) return next(errhandler(401,"*You can't view others listing so!!!"));

    try {
        const User = await user.findById(req.params.id);

        res.status(200).json('User has been deleted!');

    } catch (error) {
        next(error);
    }
}

export const buyReq = async (req,res,next) => {

    if(req.user._id !== req.params.id) return next(errhandler(401,"*You can't view others listing so!!!"));

    try {
        console.log(req.body);
        const userMap = await listBuyMap.find({userId:req.params.id,listId:req.body.property.propertyId});
        const buyer = await user.findById(req.params.id);
        console.log(userMap);
        console.log(buyer);
        if(userMap.length ){
            return next(errhandler(404,"*Can't send request for same property!!!"));
        }
        else{
            const newMap = new listBuyMap({
                userId:req.params.id,
                agentId:req.body.property.agent,
                listId:req.body.property.propertyId,
                offer:req.body.offer,
                buyerName:req.body.username,
            });
            const mapCreated = await newMap.save();

            if(mapCreated){
                var email = process.env.TeamMail;
                var subject = `Notification: Property Purchase Request Sent Successfully!!!`;
                var text = `Dear ${req.body.username},\n\n` +
                `     We hope this message finds you well.\n\n` +
                `     This is to confirm that your property purchase request has been successfully sent to the agent. We will contact you as soon as possible regarding the status of your request. Please find the details below:\n\n` +
                `     Property Name: ${req.body.property.propertyName}\n`+
                `     Agent Name: ${req.body.property.agentName}\n`+
                `     Agent Contact Information: ${req.body.property.agentEmail}\n\n`+
                `     We appreciate your interest in the property and assure you that we will do our best to assist you further.\n\n` +
                `     Kindly note that this is an automated email, and we kindly request you not to reply to it. However, Should you have any questions or require further assistance, please don't hesitate to reach out to us.\n\n` +
                `     Thank you for choosing DrEstate. We look forward to facilitating this transaction and ensuring a smooth experience for you!\n\n` +
                `     Thank you for your cooperation.\n\n` +
                `Best regards,\n` +
                `DrEstate Team`;
                var flag = await sendEmail(email,buyer.email,subject,text,next);

                email = process.env.AgentMail;
                subject = `Notification: New Property Purchase Request!!!`;
                text = `Dear ${req.body.property.agentName},\n\n` +
                `     We hope this message finds you well.\n\n` +
                `     This is to notify you that a new property purchase request has been sent to you by a prospective buyer. Please find the details below:\n\n` +
                `     Property Name: ${req.body.property.propertyName}\n`+
                `     Owner Name: ${req.body.property.owner}\n`+
                `     Owner Contact Information: ${req.body.property.userEmail}\n\n`+
                `     Buyer Name: ${req.body.username}\n`+
                `     Buyer Contact Information: ${buyer.email}\n\n`+
                `     We kindly request you to review the request and respond to the buyer at your earliest convenience. The buyer will be eagerly awaiting your response.\n\n` +
                `     Please note that your prompt attention to this matter is greatly appreciated.\n\n` +
                `     Kindly note that this is an automated email, and we kindly request you not to reply to it. However, Should you have any questions or require further assistance, please don't hesitate to reach out to us.\n\n` +
                `     Thank you for choosing DrEstate. We look forward to facilitating this transaction and ensuring a smooth experience for both parties involved!\n\n` +
                `     Thank you for your cooperation.\n\n` +
                `Best regards,\n` +
                `DrEstate Team`;
                var flag1 = await sendEmail(email,req.body.property.agentEmail,subject,text,next);


                console.log(flag);

                if(!flag && !flag1)
                    res.status(201).json({success:true});
                else
                    return next(errhandler(404,"Error while sending mail"));
            }
            else
                return next(errhandler(404,"*Error occured while creating request!!!")); 
        }

    } catch (error) {
        return next(errhandler(404,error)); 
    }
}