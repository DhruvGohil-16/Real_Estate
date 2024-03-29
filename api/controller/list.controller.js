import agent from "../model/agent.model.js";
import list from "../model/list.model.js";
import user from "../model/user.model.js";
import { errhandler } from "../utils/error.js";
import { sendEmail } from "../utils/sendEmail.js";

export const listing = async (req,res,next) => {
    try {
        const { country, state, city} = req.body.formData.location;

        const agentDetails = await agent.findOne({ "location.country": country, "location.state": state, "location.city": city });
        if (!agentDetails) {
        return res.status(404).json({ success: false, message: "No agent found for the specified location." });
        }
        const propUser = await user.findById(req.body.userId);
        const builtDate = req.body.formData.propertyDetails.builtDate;
        const formattedBuiltDate = builtDate.toISOString().substring(0, 10);

        const newProperty = new list({
            propertyName: req.body.formData.propertyDetails.propertyName,
            user: req.body.userId,
            agent: agentDetails._id,
            propertyType: req.body.formData.propertyDetails.propertyType,
            description: req.body.formData.propertyDetails.description,
            saleType: req.body.formData.propertyDetails.saleType,
            price: req.body.formData.propertyDetails.price,
            discountPrice: req.body.formData.propertyDetails.discountPrice,
            offer: req.body.formData.propertyDetails.offer,
            address: req.body.formData.propertyDetails.address,
            country: country,
            state: state,
            city: city,
            bedrooms: req.body.formData.propertyDetails.bedrooms,
            bathrooms: req.body.formData.propertyDetails.bathrooms,
            sqarea: req.body.formData.propertyDetails.area,
            images: req.body.formData.propertyDetails.images,
            parking: req.body.formData.propertyDetails.parking,
            noOfVehicle: req.body.formData.propertyDetails.noOfVehicle,
            amenities: req.body.formData.propertyDetails.amenities,
            furnished: req.body.formData.propertyDetails.furnished,
            builtDate: formattedBuiltDate,
        });

        const listProp = await newProperty.save();
        const propertyId = listProp._id;
        await list.findByIdAndUpdate(propertyId,{
            $set: {
              propertyId
            }
          },{new:true}
        );

        const email = process.env.TeamMail;
        const subject = `Welcome to DrEstate!!! 🏡 Let's Get Your Property Listed!`;
        const text = `Dear ${propUser.username},\n\n` +
        `     We are delighted to welcome you to DrEstate, your premier destination for all things real estate!\n\n` +
        `     At DrEstate, we pride ourselves on offering top-notch services tailored to meet your property needs. Whether you're looking to list your property or find your dream home, our dedicated team is here to assist you every step of the way.\n\n` +
        `     Your recent property listing request has been successfully received. Our team of experts will carefully review your submission to ensure that it meets our quality standards. Please note that this verification process may take up to 7-8 working days.\n\n` +
        `     We understand the importance of timely updates, and we assure you that we will keep you informed throughout the process. In the meantime, if you have any questions or require further assistance, please don't hesitate to reach out to us.\n\n` +
        `     Kindly note that this is an automated email, and we kindly request you not to reply to it. However, if you have any queries or need assistance, please feel free to contact us at ${process.env.TeamMail}. Our team will be more than happy to assist you.\n\n` +
        `     Thank you once again for choosing DrEstate. We look forward to serving you and helping you achieve your property goals!\n\n` +
        `Best regards,\n` +
        `DrEstate Team`;
        var flag = await sendEmail(email,propUser.email,subject,text,next);  //sends mail to agent with id

        console.log(flag);

        if(!flag)
        return res.status(201).json("Listing request created successfully...");
        else
        next(errhandler(404,"Error while sending mail"));
        
    } catch (error) {
        next(error);
    }
}

export const pendinglisting = async (req, res, next) => {
    if(req.user._id !== req.params.id) return next(errhandler(401,"*You are not authorized to do so!!!"));
    try {
        const pendingListings = await list.find({ reqAccepted: 0, user: req.params.id });

        console.log(pendingListings);
        res.status(200).json({ success: true, data: pendingListings });
    } catch (error) {
        next(errhandler(500,error));
    }
};

export const verifiedlisting = async (req, res, next) => {
    if(req.user._id !== req.params.id) return next(errhandler(401,"*You are not authorized to do so!!!"));
    try {
        const verifiedListings = await list.find({ reqAccepted: 1, user: req.params.id });
        console.log(verifiedListings);
        res.status(200).json({ success: true, data: verifiedListings });
    } catch (error) {
        next(errhandler(500,error));
    }
};