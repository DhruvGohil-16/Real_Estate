import bcryptjs from "bcryptjs";
import agent from "../model/agent.model.js";
import { errhandler } from "../utils/error.js";
import { sendEmail } from "./sendEmail.js";

export const addAgent = async (req, res, next) => {
    //makes call asynchronous
    console.log(req.body);
    const { agname, agemail, agpassword, role, country, state, city } = req.body;
    const encryptedPassword = bcryptjs.hashSync(agpassword, 10);
    const newAgent = new agent({
      name:agname,
      email:agemail,
      password: encryptedPassword,
      role,
      location: { country, state, city },
    });
    
    try {
        const newagent = await newAgent.save();
        const my_id = newagent._id;
        await agent.findByIdAndUpdate(my_id,{
            $set: {
                agentId: my_id
            }
            },{new:true}
        );

        const email = process.env.AgentMail;
        const subject = " Welcome to Our Dr.Estate Team: Important Onboarding Details";
        const text = `Dear ${agname},\n\n` + 
        `     Welcome aboard! We are thrilled to have you join our Real Estate team as a valued member.Your expertise and dedication are precisely what we've been searching for,and we are confident that your presence will significantly contribute to our collective success.\n\n`
        +
        `     As you embark on this exciting journey with us, we want to ensure that you have all the necessary tools and information to hit the ground running. To that end, please find below your Agent ID, which will serve as your unique identifier within our organization:\n\n
        Your agent ID: ${my_id}\n\n`
        + 
        `     Please ensure to keep this ID secure, as it will be integral for various internal processes and communications moving forward.If you have any questions or need further assistance, feel free to reach out to us.\n\n` + 
        `Best regards,\n`
        + 
        `agents.drestate@gmail.com`;

        var flag = await sendEmail(email,agemail,subject,text,next);  //sends mail to agent with id

        console.log(flag);

        if(!flag)
            return res.status(201).json("Agent created successfully...");
        else
            next(errhandler(404,"Error while sending mail"));
        } catch (err) {
        console.log("Inside catch err");
        err.statusCode = 400;
        if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
            // Duplicate key error for 'email'
            err.message = '*Email already exists. Please choose a different email.';
        }
        next(err);
    }
  };