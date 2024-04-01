import bcryptjs from 'bcryptjs'
import { errhandler } from "../utils/error.js";
import agent from '../model/agent.model.js';
import list from '../model/list.model.js';
import permlist from '../model/permlist.model.js';
import { sendEmail } from '../utils/sendEmail.js';
import user from '../model/user.model.js';

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

export const totallisting = async (req, res, next) => {
    if(req.agent._id !== req.params.id) return next(errhandler(401,"*You are not authorized to do so!!!"));
    try {
        console.log("totallisting");
        const totalListings = await list.find({agent: req.params.id });
        
        if(totalListings) 
            res.status(200).json({ success: true, data: totalListings });
        else
            next(errhandler(404,"No recent listing"));
    } catch (error) {
        console.log(error);
        next(errhandler(500,error));
    }
};

export const updatelisting = async (req, res, next) => {
    if(req.agent._id !== req.params.id) return next(errhandler(401,"*You are not authorized to do so!!!"));
    try {
        console.log("verifyrecentlisting");
        const {status,propId} = req.body;

        console.log(req.body);
        let updateQuery;
        if (status === 1) {
            updateQuery = { reqAccepted: 1 };
        } else {
            updateQuery = { reqAccepted: -1 };
        }

        const propAgent = await agent.findById(req.params.id);

        const updatedProperty = await list.findOneAndUpdate(
            { propertyId: propId},
            updateQuery,
            { new: true }
        );

        const propUser = await user.findById(updatedProperty.user);
        console.log(updatedProperty);
        
        if(status==1){
            propAgent.verified = propAgent.verified+1;
            await propAgent.save();
            console.log("creating...");
            const newListing = new permlist({
                propertyName: updatedProperty.propertyName,
                propertyId: updatedProperty.propertyId,
                user: updatedProperty.user,
                agent: propAgent.name,
                agentEmail:propAgent.email,
                propertyType: updatedProperty.propertyType,
                description: updatedProperty.description,
                price: updatedProperty.price,
                discountPrice: updatedProperty.discountPrice,
                offer: updatedProperty.offer,
                address: updatedProperty.address,
                country: updatedProperty.country,
                state: updatedProperty.state,
                city: updatedProperty.city,
                bedrooms: updatedProperty.bedrooms,
                bathrooms: updatedProperty.bathrooms,
                sqarea: updatedProperty.sqarea,
                images: updatedProperty.images,
                noOfVehicle: updatedProperty.noOfVehicle,
                amenities: updatedProperty.amenities,
                furnished: updatedProperty.furnished,
                builtDate: updatedProperty.builtDate,
            });

            console.log("created...");
            console.log(newListing);
            const listInfo = await newListing.save();
            
            console.log("updating");

            if(updatedProperty && listInfo){
                var email = process.env.TeamMail;
                var subject = `Notification: Congratulations on Successfully Listing Your Property!!!`;
                var text = `Dear ${propUser.username},\n\n` +
                `     We hope this message finds you well. We are delighted to inform you that your property listing request has been successfully approved by the agent.\n\n` +
                `     Your property is now live on our platform and available for viewing by potential buyers or tenants. This is a significant milestone, and we congratulate you on successfully listing your property!\n\n` +
                `     Agent's Name: ${propAgent.name}\n`+
                `     Agent's Email: ${propAgent.email}\n\n` +
                `     Here are some details about your listing:\n\n` +
                `     Property Name: ${updatedProperty.propertyName}\n` +
                `     Address: ${updatedProperty.address}\n` +
                `     Price: ₹${updatedProperty.price}\n` + // Format price if necessary
                `     Bedrooms: ${updatedProperty.bedrooms}\n` +
                `     Bathrooms: ${updatedProperty.bedrooms}\n` +
                `     Square Feet Area: ${updatedProperty.sqarea}\n\n` +
                `     We wish you the best of luck in finding the right buyer or tenant for your property. If you need any assistance or have any questions, please feel free to reach out to us.\n\n` +
                `     Thank you for choosing DrEstate as your real estate partner. We're excited to be part of your property journey!\n\n` +
                `Best regards,\n` +
                `DrEstate Team`;
                var flag = await sendEmail(email,propUser.email,subject,text,next);
                if(!flag)
                    return res.status(200).json({ success: true, data: "Property Listed!!!" });
                else
                    next(errhandler(404,"Error while sending mail"));
            }
            else
                next(errhandler(404,"*Can't list property!!!"));
        }
        else{
            propAgent.rejected = propAgent.rejected+1;
            await propAgent.save();

            if(updatedProperty){
                
                var email = process.env.TeamMail;
                var subject = `Notification: Regarding Your Listing Request!!!`;
                var text = `Dear ${propUser.username},\n\n` +
                `     We hope this message finds you well.We regret to inform you that your recent listing request has been rejected by the agent. The decision was made after careful consideration of your property details.\n\n` +
                `     We're writing to inform you that a new lead has been assigned to you for verification. Please find the details below:\n\n` +
                `     Agent's Name: ${propAgent.name}\n`+
                `     Agent's Email: ${propAgent.email}\n\n` +
                `     Agent's Rejection Message:\n` +
                `     ${req.body.rejMessage}\n\n`+
                `     Please don't be discouraged by this outcome. We encourage you to review the feedback provided by the agent and consider making any necessary adjustments to your listing before resubmitting it.\n\n` +
                `     Kindly note that this is an automated email, and we kindly request you not to reply to it.If you have any questions or need further assistance, please feel free to reach out to us. We're here to support you in your property endeavors.\n\n` +
                `     Thank you once again for choosing DrEstate as your real estate partner. We look forward to serving you and helping you achieve your property goals!\n\n` +
                `     Thank you for your cooperation.\n\n` +
                `Best regards,\n` +
                `DrEstate Team`;
                var flag = await sendEmail(email,propUser.email,subject,text,next);
                if(!flag)
                    return res.status(200).json({ success: true, data: "Property has been rejected!!!" });
                else
                    next(errhandler(404,"Error while sending mail"));
            }
            else
                next(errhandler(404,"*Can't reject property!!!"));
        }

    } catch (error) {
        console.log(error);
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

export const totalReqCount = async (req, res, next) => {
    if(req.agent._id !== req.params.id) return next(errhandler(401,"*You are not authorized to do so!!!"));
    try {
        
        const counts = await agent.findById(req.params.id);

        const onlyViewed = counts.viewed - ( counts.new + counts.verified + counts.rejected);

        res.status(200).json({ success: true, data: 
            {   new:counts.new,
                'only-viewed':onlyViewed,
                verified:counts.verified,
                rejected:counts.rejected
            } 
        });

    } catch (error) {
        next(errhandler(500,error));
    }
};

export const updateNewCount = async (req, res, next) => {
    if(req.agent._id !== req.params.id) return next(errhandler(401,"*You are not authorized to do so!!!"));
    try {
        
        const updateAgent = await agent.findById(req.params.id);

        updateAgent.new = updateAgent.new-1;
        updateAgent.viewed = updateAgent.viewed+1;
        await updateAgent.save();

        await list.findByIdAndUpdate(req.body.propId,{
            $set: {
              reqViewd:true
            }
          },{new:true}
        );
        
        res.status(200).json({ success: true, data: updateAgent.new });
    } catch (error) {
        console.log(error);
        next(errhandler(500,error));
    }
};