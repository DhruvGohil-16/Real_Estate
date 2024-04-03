import bcryptjs from 'bcryptjs'
import { errhandler } from "../utils/error.js";
import agent from '../model/agent.model.js';
import list from '../model/list.model.js';
import permlist from '../model/permlist.model.js';
import { sendEmail } from '../utils/sendEmail.js';
import user from '../model/user.model.js';
import listBuyMap from '../model/listBuy.model.js';

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

export const verifynewBuylisting = async (req, res, next) => {
    if(req.agent._id !== req.params.id) return next(errhandler(401,"*You are not authorized to do so!!!"));
    try {
        const verifyNewBuylistings = await listBuyMap.find({agentId:req.params.id, viewed:false, accepted:0});
        
        if(verifyNewBuylistings){
            const reqArray = [];
            for (const listing of verifyNewBuylistings) {
                const { userId, listId, buyerName,date,offer} = listing;

                const newUser = await user.findById(userId);
                const permList = await permlist.findOne({ propertyId: listId });

                if(newUser && permList) {
                    reqArray.push({ newUser, permList, buyerName,date,offer});
                }
            }
            
            res.status(200).json({ success: true, data: reqArray});
        }
        else
            next(errhandler(404,"No new buy listing"));
    } catch (error) {
        console.log(error);
        next(errhandler(500,error));
    }
};

export const verifyRecentBuylisting = async (req, res, next) => {
    if(req.agent._id !== req.params.id) return next(errhandler(401,"*You are not authorized to do so!!!"));
    try {
        const verifyRecentBuylistings = await listBuyMap.find({agentId:req.params.id, viewed:true, accepted:0});
        if(verifyRecentBuylistings){
            const reqArray = [];

            for (const listing of verifyRecentBuylistings) {
                const { userId,listId, buyerName,date, offer} = listing;

                const newUser = await user.findById(userId);
                const permList = await permlist.findOne({ propertyId: listId });

                if(newUser && permList) {
                    reqArray.push({ newUser, permList, buyerName,date, offer});
                }
            }
            res.status(200).json({ success: true, data: reqArray});
        }
        else
            next(errhandler(404,"No recent buy listing"));
    } catch (error) {
        console.log(error);
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
        if(propUser){

            if(status==1){
                propAgent.verified = propAgent.verified+1;
                await propAgent.save();
                console.log("creating...");
                const newListing = new permlist({
                    propertyName: updatedProperty.propertyName,
                    propertyId: updatedProperty.propertyId,
                    owner:updatedProperty.owner,
                    agentName:propAgent.name,
                    user: updatedProperty.user,
                    userProfile:propUser.profilePic,
                    agent: propAgent.agentId,
                    agentProfile:propAgent.profilePic,
                    agentEmail:propAgent.email,
                    userEmail:propUser.email,
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
                    var text = `Dear ${updatedProperty.owner},\n\n` +
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
                    var text = `Dear ${updatedProperty.owner},\n\n` +
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
        }
        else
            next(errhandler(404,"*Owner account Deleted!!!"));
    } catch (error) {
        console.log(error);
        next(errhandler(500,error));
    }
};
export const updateBuylisting = async (req, res, next) => {
    if(req.agent._id !== req.params.id) return next(errhandler(401,"*You are not authorized to do so!!!"));
    try {
        const {status,buyLead} = req.body;
        const permlisting = await permlist.findOne({propertyId:buyLead.permList.propertyId,sold:false});
        console.log(req.body.rejMessage);
        
        if(permlisting){

            if(status==1){

                await listBuyMap.updateOne(
                    { userId: buyLead.newUser._id, agentId: buyLead.permList.agent, listId: buyLead.permList.propertyId },
                    { $set: { accepted: 1 } }
                );
                    
                await listBuyMap.updateMany(
                    { agentId: buyLead.permList.agent, listId: buyLead.permList.propertyId, accepted: 0 },
                    { $set: { accepted: -1 } }
                );

                permlisting.sold = true;
                await permlisting.save();

                const updatedBuy = await listBuyMap.find({listId: buyLead.permList.propertyId,accepted:-1});
                
                var email,subject,text;
                if(listBuyMap && permlisting){

                    const emailPromises = updatedBuy.map(async (rejRequest) => {
                        const buyer = await user.findById(rejRequest.userId);
                        email = process.env.TeamMail;
                        subject = `Notification: Regarding Your Property Buy Request!!!`;
                        text = `Dear ${rejRequest.buyerName},\n\n` +
                        `     We hope this message finds you well.We regret to inform you that your recent buy request has been rejected by the agent. The decision was made after careful consideration of your property offer.\n\n` +
                        `     We're writing to inform you that a new lead has been assigned to you for verification. Please find the details below:\n\n` +
                        `     Agent's Name: ${permlisting.agentName}\n`+
                        `     Agent's Email: ${permlisting.agentEmail}\n\n` +
                        `     Here are some details about your buy request:\n` +
                        `     Property Name: ${permlisting.propertyName}\n` +
                        `     Address: ${permlisting.address}\n` +
                        `     Offerd: ₹${rejRequest.offer}\n`+
                        `     Sold at: ₹${buyLead.offer}\n\n`+
                        `     Please don't be discouraged by this outcome. We encourage you to review the feedback provided by the agent.\n\n` +
                        `     Kindly note that this is an automated email, and we kindly request you not to reply to it.If you have any questions or need further assistance, please feel free to reach out to us. We're here to support you in your property endeavors.\n\n` +
                        `     Thank you once again for choosing DrEstate as your real estate partner. We look forward to serving you and helping you achieve your property goals!\n\n` +
                        `     Thank you for your cooperation.\n\n` +
                        `Best regards,\n` +
                        `DrEstate Team`;
                        await sendEmail(email,buyer.email,subject,text,next);
                    });
                
                    const flag = await Promise.all(emailPromises);
                    const price = (buyLead.permList.offer ? buyLead.permList.discountPrice : buyLead.permList.price)
                    email = process.env.TeamMail;
                    subject = `Congratulations!!! Your Property Has Been Successfully Sold`;
                    text = `Dear ${buyLead.permList.owner},\n\n` +
                    `     We hope this message finds you well. We are delighted to inform you that your property listing for ${permlisting.propertyName} has been successfully sold through our real estate platform. This marks an exciting milestone in your property journey, and we are thrilled to have played a part in achieving your goals.\n\n` +
                    `     Here are the details of the property sale:\n\n` +
                    `     Property Name: ${permlisting.propertyName}\n` +
                    `     Address: ${permlisting.address}\n` +
                    `     Ask : ₹${price}\n`+
                    `     Sold at: ₹${buyLead.offer}\n\n`+
                    `     Agent's Name: ${permlisting.agentName}\n`+
                    `     Buyer's Name: ${buyLead.buyerName}\n`+
                    `     Buyer's Email: ${buyLead.newUser.email}\n\n` +
                    `     We would like to express our sincere appreciation for choosing our services and entrusting us with the sale of your property. Our dedicated team will work diligently to ensure a smooth and seamless transaction process.\n\n` +
                    `     Should you have any questions or require further assistance regarding the sale or any other real estate matters, please do not hesitate to contact us. We are here to support you every step of the way.\n\n` +
                    `     Once again, congratulations on the successful sale of your property! We look forward to serving you again in the future and helping you achieve your real estate goals.\n\n` +
                    `     Thank you for your cooperation.\n\n` +
                    `Best regards,\n` +
                    `DrEstate Team`;
                    const flag1 = await sendEmail(email,buyLead.permList.userEmail,subject,text,next);

                    subject = `Congratulations! You've Successfully Purchased a Property`;
                    text = `Dear ${buyLead.buyerName},\n\n` +
                    `     We hope this message finds you well. We are pleased to inform you that your offer for the property ${permlisting.propertyName} has been accepted, and the purchase process has been successfully completed. Congratulations on becoming the proud owner of your new property!\n\n` +
                    `     Here are the details of the property sale:\n\n` +
                    `     Property Name: ${permlisting.propertyName}\n` +
                    `     Address: ${permlisting.address}\n` +
                    `     Ask : ₹${price}\n`+
                    `     Sold at: ₹${buyLead.offer}\n\n`+
                    `     Agent's Name: ${permlisting.agentName}\n`+
                    `     Owner's Name: ${buyLead.permList.owner}\n`+
                    `     Owner's Email: ${buyLead.permList.userEmail}\n\n` +
                    `     We trust that this property will bring you joy and fulfill your aspirations of homeownership. It will been a pleasure assisting you throughout the purchasing process, and we are grateful for the opportunity to be a part of your real estate journey.\n\n` +
                    `     If you have any queries or require further assistance regarding your new property or any related matters, please feel free to reach out to us. We are committed to ensuring your satisfaction and are here to support you in any way we can.\n\n` +
                    `     Once again, congratulations on your successful property purchase! We wish you many wonderful memories and fulfilling experiences in your new home.
                    \n\n` +
                    `     Thank you for your cooperation.\n\n` +
                    `Best regards,\n` +
                    `DrEstate Team`;
                    const flag2 = await sendEmail(email,buyLead.newUser.email,subject,text,next);
                    
                    const propAgent = await agent.findById(req.params.id);
                    propAgent.sold = propAgent.sold + 1;
                    await propAgent.save();

                    if(flag && !flag1 && !flag2)
                        return res.status(200).json({ success: true, data: "Property sold successfully!!!" });
                    else
                        next(errhandler(404,"Error while sending mail"));   
                }
                else
                    next(errhandler(404,"*Can't list property!!!"));
            }
            else{
                const reqMap = await listBuyMap.findOne({agentId: buyLead.permList.agent, userId:buyLead.newUser._id, listId: buyLead.permList.propertyId,accepted:0});
                if(reqMap){
                    await listBuyMap.updateOne(
                        { agentId: buyLead.permList.agent, listId: buyLead.permList.propertyId, accepted: 0 },
                        { $set: { accepted: -1 } }
                    );
                    email = process.env.TeamMail;
                    subject = `Notification: Regarding Your Property Buy Request!!!`;
                    text = `Dear ${buyLead.buyerName},\n\n` +
                    `     We hope this message finds you well.We regret to inform you that your recent buy request has been rejected by the agent. The decision was made after careful consideration of your property offer.\n\n` +
                    `     We're writing to inform you that a new lead has been assigned to you for verification. Please find the details below:\n\n` +
                    `     Agent's Name: ${permlisting.agentName}\n`+
                    `     Agent's Email: ${permlisting.agentEmail}\n\n` +
                    `     Here are some details about your buy request:\n` +
                    `     Property Name: ${permlisting.propertyName}\n` +
                    `     Address: ${permlisting.address}\n` +
                    `     Offerd: ₹${buyLead.offer}\n`+
                    `     Agent's Rejection Message:\n` +
                    `     ${req.body.rejMessage}\n\n`+
                    `     Please don't be discouraged by this outcome. We encourage you to review the feedback provided by the agent.\n\n` +
                    `     Kindly note that this is an automated email, and we kindly request you not to reply to it.If you have any questions or need further assistance, please feel free to reach out to us. We're here to support you in your property endeavors.\n\n` +
                    `     Thank you once again for choosing DrEstate as your real estate partner. We look forward to serving you and helping you achieve your property goals!\n\n` +
                    `     Thank you for your cooperation.\n\n` +
                    `Best regards,\n` +
                    `DrEstate Team`;
                    var flag = await sendEmail(email,buyLead.newUser.email,subject,text,next);
                    
                    if(!flag)
                        return res.status(200).json({ success: true, data: "Property buy request rejected!!!" });
                    else
                        next(errhandler(404,"Error while sending mail"));     
                }
                else
                    return res.status(200).json({ success: false, data: "*Request Already executed!!!" });
            }
        }
        else
            return res.status(200).json({ success: false, data: "*Request Already executed!!!" });
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

export const newBuyCount = async (req, res, next) => {
    if(req.agent._id !== req.params.id) return next(errhandler(401,"*You are not authorized to do so!!!"));
    try {
        
        const newBuyCounts = await listBuyMap.find({agentId:req.params.id,viewed:false});
        console.log(newBuyCounts.length);
        res.status(200).json({ success: true, data: newBuyCounts.length });
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
                rejected:counts.rejected,
                sold:counts.sold
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

export const updateNewBuyCount = async (req, res, next) => {
    if(req.agent._id !== req.params.id) return next(errhandler(401,"*You are not authorized to do so!!!"));
    try {   
        const listMap = await listBuyMap.findOne({agentId:req.params.id,userId:req.body.userId,viewed:false});
        listMap.viewed = true;
        await listMap.save();
        res.status(200).json({ success: true, data:"success" });
    } catch (error) {
        console.log(error);
        next(errhandler(500,error));
    }
};