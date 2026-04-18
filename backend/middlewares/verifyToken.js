import jwt from "jsonwebtoken";
import {config} from "dotenv";
import cookieParser  from "cookie-parser";

config();

export const verifyToken = (...allowedRoles) =>{
    return (req, res,next)=>{
    try {
    //read token from request 
    let token = req.cookies.token; //{token :""}
    console.log("token:",token);
    if(token === undefined){
        return res.status(401).json({message : "Unauthorized. Please login"});

    }
    //verify the validity of the token (decoding the token)
    let decodedToken = jwt.verify(token,process.env.JWT_SECRET);
    //forward req to next midW / route 

    //check if author is allowed 
    if(!allowedRoles.includes(decodedToken.role)){
        return res.status(403).json({message:"Forbidden. You dont have the permission"})
    }
    //attach user info to req for use in routes
    req.user = decodedToken;
    next();
    } catch (err){
    //jwt verify throws if token is invalid/expired
    if(err.name === "TokenExpiredError"){
        res.status(401).json({message:"Session expired"});
    }
    if(err.name ==="JsonWebTokenError"){
        return res.status(401).json({message: "Invalid token. Please login"})
    }
    next(err);
}
}
}