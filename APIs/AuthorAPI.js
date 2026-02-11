import exp from "express";
import { authenticate, register } from "../services/authServices.js";
import {UserTypeModel} from "../models/UserTypeModel.js";
import { ArticleModel } from "../models/ArticleModel.js";
import { checkAuthor } from "../middlewares/checkAuthor.js";
import { verifyToken } from "../middlewares/verifyToken.js";

export const authorRoute = exp.Router();

//Register author(public)
authorRoute.post("/users", async (req, res) => {
  //get user obj from req
  let userObj = req.body;
  //call register
  const newUserObj = await register({ ...userObj, role: "AUTHOR" });
  //send res
  res.status(201).json({ message: "authroe created", payload: newUserObj });
});
/////////////////////////////////////////////////////////////////////////////////////
/*
//authenticate author(public)

authorRoute.post("/authenticate", async (req, res) => {
  //get user cred object
  let userCred = req.body;
  //call authenticate service
  let { token, user } = await authenticate(userCred);
  //save tokan as httpOnly cookie
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
  });
  //send res
  res.status(200).json({ message: "login success", payload: user });
});
--> commonAPI.js will handle the login instead 
*/
///////////////////////////////////////////////////////////////////////////////////////

//Create article(protected route)

authorRoute.post("/articles",verifyToken ,checkAuthor, async (req, res) => {
  //get article from req
  let article = req.body;

  //create article document
  let newArticleDoc = new ArticleModel(article);
  //save
  let createdArticleDoc = await newArticleDoc.save();
  //send res
  res.status(201).json({ message: "article created", payload: createdArticleDoc });
});
///////////////////////////////////////////////////////////////////////////////////

//Read artiles of author(protected route)

authorRoute.get("/articles/:authorId",verifyToken ,checkAuthor, async (req, res) => {
  //get author id
  let aid = req.params.authorId;

  //read atricles by this author which are acticve
  let articles = await ArticleModel.find({ author: aid, isArticleActive: true }).populate("author", "firstName email");
  //send res
  res.status(200).json({ message: "articles", payload: articles });
});

///////////////////////////////////////////////////////////////////////////////

//edit article(protected route)

authorRoute.put("/articles/:articleId",verifyToken ,checkAuthor,async (req, res) => {
  //get modified article from req
  const { articleId } = req.params;
  const { title, category, content,author } = req.body;
  //find article
  let articleOfDB = await ArticleModel.findOne({_id:articleId,author:author});
  if (!articleOfDB) {
    return res.status(401).json({ message: "Article not found" });
  }
  
  //update the article
  let updatedArticle = await ArticleModel.findByIdAndUpdate(
    articleId,
    {
      $set: { title, category, content },
    },
    { new: true },
  );
  //send res(updated article)
  res.status(200).json({ message: "article updated", payload: updatedArticle });
});
///////////////////////////////////////////////////////////////////////
/*
//delete(soft delete) article(Protected route)
authorRoute.delete("/articles/:articleId/:aurthorId")
*/
//delete(soft delete) article (Protected route)
authorRoute.put("/articles/:articleId", verifyToken, checkAuthor, async (req, res, next) => {
  try {
    // get article id from params
    const { articleId } = req.params;

    // get author id from body (as per your current design)
    const { author } = req.body;

    // find article and check ownership
    const articleOfDB = await ArticleModel.findOne({ _id: articleId, author: author });
    if (!articleOfDB) {
      return res.status(401).json({ message: "article not found or not belong to you" });
    }

    // soft delete: set isArticleActive = false
    const updatedArticle = await ArticleModel.findOneAndUpdate(
      { _id: articleId },
      { $set: { isArticleActive: false } },
      { new: true }
    );

    res.status(200).json({ message: "deleted the article softly", payload: updatedArticle });
  } catch (err) {
    next(err);
  }
});

//http://localhost:4000/user-api/users
//http://localhost:4000/author-api/users

//app.use(checkAuthor)