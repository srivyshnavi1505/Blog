import exp from 'express'
import { register } from '../services/authServices.js'
import { verifyToken } from "../middlewares/verifyToken.js"
import { ArticleModel } from '../models/ArticleModel.js'
import { upload } from '../config/multer.js'
import cloudinary from '../config/cloudinary.js'
import { uploadToCloudinary } from "../config/cloudinaryUpload.js"

export const userRoute = exp.Router()

//create user/ register 
userRoute.post(
  "/users",
  upload.single("ProfileImageUrl"), 
  async (req, res, next) => {
    let cloudinaryResult;

    try {
      let userObj = req.body;

      if (req.file) {
        cloudinaryResult = await uploadToCloudinary(req.file.buffer);
      }

      const newUserObj = await register({
        ...userObj,
        ProfileImageUrl: cloudinaryResult?.secure_url,
      });

      res.status(201).json({
        message: "user created",
        payload: newUserObj,
      });

    } catch (err) {
      if (cloudinaryResult?.public_id) {
        await cloudinary.uploader.destroy(cloudinaryResult.public_id);
      }

      next(err);
    }
  }
);


//Read all articles(protected)
userRoute.get('/articles', verifyToken("USER"), async (req, res, next) => {
  try {
    const articles = await ArticleModel.find({ isArticleActive: true })
      .populate("author", "firstName lastName email")
     

    res.status(200).json({
      message: "all artilcles are fetched",
      payload: articles
    })
  } catch (err) {
    next(err);
  }
})


// add comment to an article
userRoute.put("/articles", verifyToken("USER"), async (req, res, next) => {
  try {

    const { articleId, userId, comment } = req.body;

    if (userId !== req.user.userId) {
      return res.status(403).json({ message: "FORBIDDEN" });
    }

    const article = await ArticleModel.findOne({
      _id: articleId,
      isArticleActive: true
    });

    if (!article) {
      return res.status(404).json({ message: "article not available" });
    }

    const newComment = {
      user: userId,
      comments: comment
    };

    article.comments.push(newComment);

    await article.save();

    res.status(200).json({
      message: "comment added successfully",
      payload: article
    });

  } catch (err) {
    next(err);
  }
});