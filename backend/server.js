import exp from 'express';
import { connect } from 'mongoose';
import { config } from 'dotenv' ;
import { userRoute } from './APIs/UserAPI.js';
import { authorRoute } from './APIs/AuthorAPI.js';
import { adminRoute } from './APIs/AdminAPI.js' ;
import {commonRoute} from "./APIs/CommonAPI.js"
import cookieParser from "cookie-parser";
import { checkAuthor } from './middlewares/checkAuthor.js';
import cors from 'cors';

config() //process.env
const app = exp()


app.use(cors({origin:["http://localhost:5175","https://ink-it-blog.onrender.com"],credentials:true}));
//add body parser middleware
app.use(exp.json())  //
//add logging middleware

app.use(cookieParser())


app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, req.body);
    next();
});
//connect APIs
app.use("/common-api",commonRoute);
app.use('/user-api',userRoute);
app.use('/author-api',authorRoute);
app.use('/admin-api',adminRoute);


//connect to database 
const connectDB = async()=>{
    try{
    await connect(process.env.DB_URL)
    console.log("db connection success")
    app.listen(process.env.PORT,()=> console.log("server started"))
}catch(err){
console.log("Err in DB connection",err)
}
}
connectDB()



//function declaration vs function expression
app.use((err, req, res, next) => {

  console.log("Error name:", err.name);
  console.log("Error code:", err.code);
  console.log("Full error:", err);

  // mongoose validation error
  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "error occurred",
      error: err.message,
    });
  }

  // mongoose cast error
  if (err.name === "CastError") {
    return res.status(400).json({
      message: "error occurred",
      error: err.message,
    });
  }

  const errCode = err.code ?? err.cause?.code ?? err.errorResponse?.code;
  const keyValue = err.keyValue ?? err.cause?.keyValue ?? err.errorResponse?.keyValue;

  if (errCode === 11000) {
    const field = Object.keys(keyValue)[0];
    const value = keyValue[field];
    return res.status(409).json({
      message: "error occurred",
      error:` ${field} "${value}" already exists`,
    });
  }

  // HANDLE CUSTOM ERRORS
  if (err.status) {
    return res.status(err.status).json({
      message: "error occurred",
      error: err.message,
    });
  }

  // default server error
  res.status(500).json({
    message: "error occurred",
    error: "Server side error",
  });
});