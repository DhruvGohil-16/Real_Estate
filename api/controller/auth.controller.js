import bcryptjs from "bcryptjs";
import { errhandler } from "../utils/error.js";
import user from "../model/user.model.js";
import agent from "../model/agent.model.js";
import { sendEmail } from "../utils/sendEmail.js";

export const signup = async (req, res, next) => {
  //makes call asynchronous

  const { username, email, password, role } = req.body;
  const encryptpassword = bcryptjs.hashSync(password, 10);
  const newUser = new user({ username, email, password: encryptpassword,role });
  try {
    console.log("Inside auth controller...");
    await newUser.save(); //next line of te code will be executed after data saved in db
    return res.status(201).json("User created successfully...");
  } catch (err) {
    console.log("Inside catch err");
    // console.log(err);
    err.statusCode = 400;
    if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
      // Duplicate key error for 'email'
      err.message = '*Email already exists. Please choose a different email.';
    } else if (
      err.code === 11000 &&
      err.keyPattern &&
      err.keyPattern.username
    ) {
      // Duplicate key error for 'username'
      err.message = '*Username already exists. Please choose a different username.';
      //system error middleware generator
    }
    next(err); 
  }
};

export const signin = async (req, res, next) => {
  const { email_username, password } = req.body;
  console.log(email_username);
  try {
    const validUser = await user.findOne({
      $or: [{ email: email_username }, { username: email_username }],
    });
    // console.log(validUser);
    if (!validUser) return next(errhandler(400, "*invalid credentials"));

    const validPassword = bcryptjs.compareSync(password, validUser.password);

    if (!validPassword) return next(errhandler(400, "*invalid credentials"));

    const token = validUser.generateAuthToken(); //generates jwt token
    const { password: pass, ...restCred } = validUser._doc;
    res.cookie("DrEstate_access_token", token, {  //  sending token back as response in form of cookie
        httpOnly: true,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      })
      .status(200)
      .json(restCred);
  } catch (err) {
    next(err);
  }
};

export const googleAuth = async (req,res,next) => {

  try {
    const authUser = await user.findOne({email:req.body.email});

    if(authUser){
      const token = authUser.generateAuthToken(); //generates jwt token
      
      const { password: pass, ...restCred } = authUser._doc;
      res //  sending token back as response in form of cookie
        .cookie("DrEstate_access_token", token, {
          httpOnly: true,
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        })
        .status(200)
        .json(restCred);
    }else{
        const generatePassword = Math.random().toString(36).slice(-8)+Math.random().toString(36).slice(-8);
        const hashGeneratedPass = bcryptjs.hashSync(generatePassword,10);
        const newUser = new user({
          username:req.body.name.split(" ").join("").toLowerCase()+Math.random().toString(36).slice(-5),
          email:req.body.email,
          password:hashGeneratedPass,
          profilePic:req.body.photo,
          role:req.body.role
        });

        await newUser.save(); //next line of te code will be executed after data saved in db
        const { password: pass, ...restCred } = newUser._doc;
        res //  sending token back as response in form of cookie
          .cookie("DrEstate_access_token", token, {
            httpOnly: true,
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
          })
          .status(200)
          .json(restCred);
    }
  } catch (error) {
    next(error);
  }
}

export const signout = async (req, res, next) => {
  try {
    res.clearCookie('DrEstate_access_token');
    res.status(200).json('User has been logged out!');
  } catch (error) {
    next(error);
  }
};

export const signupAgent = async (req, res, next) => {
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
    // console.log(err);
    err.statusCode = 400;
    if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
      // Duplicate key error for 'email'
      err.message = '*Email already exists. Please choose a different email.';
    }
    next(err);
  }
};

export const signinAgent = async (req, res, next) => {
  const { agid, agpassword } = req.body;
  try {
    console.log(req.body);
    const validAgent = await agent.findOne({agentId:agid});
    console.log(validAgent);
    if (!validAgent) return next(errhandler(400, "*invalid credentials"));

    const validPassword = bcryptjs.compareSync(agpassword, validAgent.password);

    if (!validPassword) return next(errhandler(400, "*invalid credentials"));

    const token = validAgent.generateAuthToken(); //generates jwt token
    const { password: pass, ...restCred } = validAgent._doc;
    res.cookie("DrEstate_agent_access_token", token, {  //  sending token back as response in form of cookie
        httpOnly: true,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      })
      .status(200)
      .json(restCred);
  } catch (err) {
    next(err);
  }
};

export const signoutAgent = async (req, res, next) => {
  try {
    res.clearCookie('DrEstate_agent_access_token');
    res.status(200).json('Agent has been logged out!');
  } catch (error) {
    next(error);
  }
};

