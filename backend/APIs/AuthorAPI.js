import exp from "express";
import { register } from "../services/authServices.js";
import { UserTypeModel } from "../models/UserTypeModel.js";
import { ArticleModel } from "../models/ArticleModel.js";
import { checkAuthor } from "../middlewares/checkAuthor.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { upload } from '../config/multer.js';
import cloudinary from '../config/cloudinary.js';
import { uploadToCloudinary } from "../config/cloudinaryUpload.js";

export const authorRoute = exp.Router();

//////////////////////////////////////////////////////////////////
// ✅ REGISTER AUTHOR (PUBLIC)
authorRoute.post(
  "/users",
  upload.single("ProfileImageUrl"),
  async (req, res) => {
    let cloudinaryResult;

    try {
      console.log("req.body:", req.body);
      console.log("req.file:", req.file ? "file present" : "no file");

      let userObj = req.body;

      // Temporarily disable cloudinary upload
      // if (req.file) {
      //   console.log("Uploading to cloudinary...");
      //   cloudinaryResult = await uploadToCloudinary(req.file.buffer);
      //   console.log("Cloudinary result:", cloudinaryResult);
      // }

      const registerData = {
        ...userObj,
        role: "AUTHOR",
        // ProfileImageUrl: cloudinaryResult?.secure_url,
      };
      console.log("Register data:", registerData);

      const newUserObj = await register(registerData);

      res.status(201).json({
        message: "author created",
        payload: newUserObj,
      });

    } catch (err) {
      // if (cloudinaryResult?.public_id) {
      //   await cloudinary.uploader.destroy(cloudinaryResult.public_id);
      // }

      console.error("Registration error:", err.message);
      console.error("Error stack:", err.stack);
      res.status(400).json({ error: err.message });
    }
  }
);

//////////////////////////////////////////////////////////////////
// ✅ CREATE ARTICLE
authorRoute.post(
  "/articles",
  verifyToken("AUTHOR"),
  checkAuthor,
  async (req, res) => {
    try {
      let article = req.body;

      // prevent spoofing
      if (
        article.author &&
        article.author.toString() !== req.user.userId
      ) {
        return res.status(403).json({
          message: "Forbidden. You can only create articles for yourself",
        });
      }

      article.author = req.user.userId;

      const newArticle = new ArticleModel(article);
      const savedArticle = await newArticle.save();

      res.status(201).json({
        message: "article created",
        payload: savedArticle,
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error creating article" });
    }
  }
);

//////////////////////////////////////////////////////////////////
// ✅ GET ALL ARTICLES OF LOGGED-IN AUTHOR
authorRoute.get(
  "/articles/:authorId",
  verifyToken("AUTHOR"),
  checkAuthor,
  async (req, res) => {
    try {
      const aid = req.params.authorId;

      if (aid !== req.user.userId) {
        return res.status(403).json({
          message: "Forbidden. You can only view your own articles",
        });
      }

      const articles = await ArticleModel.find({
        author: aid,
        isArticleActive: true,
      }).populate("author", "firstName email");

      res.status(200).json({
        message: "articles",
        payload: articles,
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error fetching articles" });
    }
  }
);

//////////////////////////////////////////////////////////////////
// ✅ GET SINGLE ARTICLE (NEW - REQUIRED FOR EDIT PAGE)
authorRoute.get(
  "/article/:id",
  verifyToken("AUTHOR"),
  checkAuthor,
  async (req, res) => {
    try {
      const article = await ArticleModel.findById(req.params.id);

      if (!article) {
        return res.status(404).json({
          message: "Article not found",
        });
      }

      // ownership check (optional but safer)
      if (article.author.toString() !== req.user.userId) {
        return res.status(403).json({
          message: "Forbidden",
        });
      }

      res.status(200).json({
        payload: article,
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error fetching article" });
    }
  }
);

//////////////////////////////////////////////////////////////////
// ✅ EDIT ARTICLE
authorRoute.put(
  "/articles/:articleId",
  verifyToken("AUTHOR"),
  checkAuthor,
  async (req, res) => {
    try {
      const { articleId } = req.params;
      const { title, category, content } = req.body;

      const article = await ArticleModel.findById(articleId);

      if (!article) {
        return res.status(404).json({
          message: "Article not found",
        });
      }

      // ownership check
      if (article.author.toString() !== req.user.userId) {
        return res.status(403).json({
          message: "Forbidden. You can modify only your own articles",
        });
      }

      article.title = title;
      article.category = category;
      article.content = content;

      await article.save();

      res.status(200).json({
        message: "Article updated",
        payload: article,
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error updating article" });
    }
  }
);

//////////////////////////////////////////////////////////////////
// ✅ SOFT DELETE / RESTORE ARTICLE
authorRoute.patch(
  "/articles/:id/status",
  verifyToken("AUTHOR"),
  checkAuthor,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { isArticleActive } = req.body;

      const article = await ArticleModel.findById(id);

      if (!article) {
        return res.status(404).json({
          message: "Article not found",
        });
      }

      // ownership check
      if (article.author.toString() !== req.user.userId) {
        return res.status(403).json({
          message: "Forbidden. You can only modify your own articles",
        });
      }

      if (article.isArticleActive === isArticleActive) {
        return res.status(400).json({
          message: `Article is already ${
            isArticleActive ? "active" : "deleted"
          }`,
        });
      }

      article.isArticleActive = isArticleActive;
      await article.save();

      res.status(200).json({
        message: `Article ${
          isArticleActive ? "restored" : "deleted"
        } successfully`,
        payload: article,
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error updating status" });
    }
  }
);