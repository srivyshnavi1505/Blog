import jwt from "jsonwebtoken";
import {config} from "dotenv";
import cookieParser  from "cookie-parser";

config();

export const verifyToken = async(req, res,next)=>{
    //read token from request 
    let token = req.cookies.token; //{token :""}
    console.log("token:",token);
    if(token === undefined){
        res.status(400).json({message : "Unauthorized req, pleaase login"});

    }
    //verify the validity of the token (decoding the token)
    let decodedToken = jwt.verify(token,process.env.JWT_SECRET);
    //forward req to next midW / route 
    req.user = decodedToken;
    next();
}