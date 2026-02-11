import exp from 'express'
import {authenticate, register} from '../services/authServices.js'
import{UserTypeModel} from '../models/UserTypeModel.js'
import {verifyToken} from "../middlewares/verifyToken.js"
import { ArticleModel } from '../models/ArticleModel.js'

export const userRoute = exp.Router()


//register user  =>DRY rule => DO nOT REPEAT YOURSELF => instead REUSE 
userRoute.post('/users',async (req ,res, next )=> {
    try{
        console.log("Request body:", req.body);
        //get user obj from req
        const userObj = req.body;
        //call register
        const newUserObj = await register({...userObj,role :"USER"});
        //role is assigned by the server end , it cannot be given to client to access
        res.status(201).json({message : "user created ",payload : newUserObj});
    }catch(err){
        next(err);
    }
})
//Authenticate / Login user => hashing and all using Bcrypt 
/*
userRoute.post("/authenticate",async(req,res,next)=>{
    try{
        let userCred = req.body;
        //cal authenticate service
        let {token, user} = await authenticate(userCred);

        res.cookie("token",token,{
            httpOnly : true,
            sameSite : "lax",
            secure: false,
        });
        res.status(200).json({message:"login success",payload : user})
    }catch(err){
        next(err);
    }
});
 // change this to common-api.js for login
*/


//Read all articles
userRoute.get('/articles',verifyToken,async(req,res,next)=>{
    try{
        const articles = await ArticleModel.find({isArticleActive:true}).populate("author","firstName lastName email").populate("comments.user","firstName lastName");
    res.status(200).json({message: "all artilcles are fetched",payload: articles})
    } catch(err){
        next(err);
    }
})

//Add comment to an article
/*
userRoute.post("/articles/:articleId/comments",verifyToken,async(req,res)=>{
    const {articleId} = req.params;
onst { user, comments } = req.body;

    const updatedArticle = await ArticleModel.findByIdAndUpdate()
})
    */
   // add comment to an article (protected route)
userRoute.put("/articles/:articleId/comment/:userId", verifyToken, async (req, res, next) => {
  try {
    // get userId and articleId from params
    const { userId, articleId } = req.params;

    // check if article exists and is active
    const articleOfDB = await ArticleModel.findOne({
      _id: articleId,
      isArticleActive: true,
    });

    if (!articleOfDB) {
      return res.status(404).json({ message: "article not available" });
    }

    // push new comment
    const updatedArticle = await ArticleModel.findOneAndUpdate(
      { _id: articleId },
      {
        $push: {
          comments: {
            user: userId,
            comments: req.body.comment, // ⚠️ your schema uses 'comments' not 'comment'
          },
        },
      },
      { new: true }
    );

    res.status(200).json({ message: "comment added", payload: updatedArticle });
  } catch (err) {
    next(err);
  }
});
