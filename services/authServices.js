import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { UserTypeModel} from "../models/UserTypeModel.js";

//authservices is a service provided to diff api's , we are not creating any routes like we did for APIs

//register function 
export const register = async(userObj) =>{
    //create document : Remember that userDoc is not js obj it is mongodb document 
    const userDoc =  new UserTypeModel(userObj);
    //validate for empty password 
    await userDoc.validate();
    //hash and replace plain pass
    userDoc.password = await bcrypt.hash(userDoc.password, 10); //10 is salt value
    //save
    const created = await userDoc.save();
    //convert doc to obj to removie pass 
    const newUserObj =created.toObject();
    //remove the password 
    delete newUserObj.password;
    //return user obj without pass
    return newUserObj;
};

//authenticate function
/*

export const authenticate = async({email,password,role })=>{
    const user = await UserTypeModel.findOne({email,role});
    if(!user){
        const err = new Error("invalid email of the user ");
        err.status = 401;
        throw err;
    }
    //compare passwords 
    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch){
    const err = new Error("password isnt a correct match");
    err.status = 401;
    throw err;
    }
    //generate token 
    const token = jwt.sign({userId : user._id,
        role : user.role,email : user.email
    },process.env.JWT_SECRET,{
        expiresIn : "1h",
    });
    const userObj = user.toObject();
    delete userObj.password;

    return {token, user: userObj};


}
    */
   
   export const authenticate = async ({ email, password }) => {
  // 1. find user only by email (no role now)
  const user = await UserTypeModel.findOne({ email });

  if (!user) {
    const err = new Error("invalid email of the user ");
    err.status = 401;
    throw err;
  }

  // 2. check if user is blocked by admin
  if (user.isActive === false) {
    const err = new Error("You're blocked, contact admin");
    err.status = 403;
    throw err;
  }

  // 3. compare passwords 
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const err = new Error("password isnt a correct match");
    err.status = 401;
    throw err;
  }

  // 4. generate token 
  const token = jwt.sign(
    {
      userId: user._id,
      role: user.role,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );
  // 5. remove password before sending response
  const userObj = user.toObject();
  delete userObj.password;

  return { token, user: userObj };
};


