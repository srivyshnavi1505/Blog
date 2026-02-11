import exp from 'express';
import { connect } from 'mongoose';
import { config } from 'dotenv' ;
import { userRoute } from './APIs/UserAPI.js';
import { authorRoute } from './APIs/AuthorAPI.js';
import { adminRoute } from './APIs/AdminAPI.js' ;
import {commonRoute} from "./APIs/CommonAPI.js"
import cookieParser from "cookie-parser";
import { checkAuthor } from './middlewares/checkAuthor.js';

config() //process.env
const app = exp()
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


app.use((err, req, res, next) => {
  console.log("error :", err);
  res.status(err.status || 500).json({ message: "error", reason: err.message });
});
//function declaration vs function expression