import exp from 'express'
import{verifyToken} from "../middlewares/verifyToken.js";
import{ArticleModel} from "../models/ArticleModel.js";
import {UserTypeModel} from "../models/UserTypeModel.js"


export const adminRoute = exp.Router();

////authenticate
const checkAdmin = async (req, res, next) => {
  try {
    // get adminId from token (verifyToken should set req.user)
    const adminId = req.user?.userId;  

    if (!adminId) {
      return res.status(401).json({ message: 'Unauthorized: Admin not logged in' });
    }

    const admin = await UserTypeModel.findById(adminId);

    if (!admin) {
      return res.status(401).json({ message: 'Invalid Admin' });
    }

    if (admin.role !== 'ADMIN') {
      return res.status(403).json({ message: 'User is not an Admin' });
    }

    if (!admin.isActive) {
      return res.status(403).json({ message: 'Admin account is not active' });
    }

    next();
  } catch (err) {
    res.status(500).json({ message: "error", reason: err.message });
  }
};



//  Read all articles 
adminRoute.get("/articles", verifyToken, checkAdmin, async (req, res) => {
  try {
    const allArticles = await ArticleModel.find()
      .populate("author comments.user");

    res.status(200).json({ message: "All articles", payload: allArticles });
  } catch (err) {
    res.status(500).json({ message: "error", reason: err.message });
  }
});

// Block user 
adminRoute.put("/block/:uid", verifyToken, checkAdmin, async (req, res) => {
  try {
    const { uid } = req.params;

    const user = await UserTypeModel.findById(uid);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const blockedUser = await UserTypeModel.findByIdAndUpdate(
      uid,
      { $set: { isActive: false } },
      { new: true }
    );

    res.status(200).json({ message: "User blocked", payload: blockedUser });
  } catch (err) {
    res.status(500).json({ message: "error", reason: err.message });
  }
});

//  Unblock user 
adminRoute.put("/unblock/:uid", verifyToken, checkAdmin, async (req, res) => {
  try {
    const { uid } = req.params;

    const user = await UserTypeModel.findById(uid);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const unblockedUser = await UserTypeModel.findByIdAndUpdate(
      uid,
      { $set: { isActive: true } },
      { new: true }
    );

    res.status(200).json({ message: "User unblocked", payload: unblockedUser });
  } catch (err) {
    res.status(500).json({ message: "error", reason: err.message });
  }
});