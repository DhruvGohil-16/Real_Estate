import jwt from "jsonwebtoken";
import { errhandler } from "./error.js";

export const verifyToken = (req,res,next) => { //we need to add package cookie parser to get any data from cookie in backend
    const token = req.cookies.DrEstate_access_token;
    console.log(token);

    if(!token) return next(errhandler(401,"unauthorized"));

    jwt.verify(token,process.env.JwtPrivateKey, (err, user) => {
        if(err) return next(errhandler(403,"forbidden"));

        req.user = user;
        console.log("User verified!!!");
        console.log(user);
        next();
    });
}