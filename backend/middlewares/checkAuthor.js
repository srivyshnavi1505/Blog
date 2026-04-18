import { UserTypeModel } from "../models/UserTypeModel.js";

export const checkAuthor = async (req, res, next) => {
  // ✅ FIX: Fall back to req.user.userId for routes that don't pass author
  // in body or params (e.g. GET /article/:id, PATCH /articles/:id/status)
  // req.user is already verified by verifyToken, so this is safe
  const aid = req?.body?.author || req?.params?.authorId || req?.user?.userId;

  //verify the author 
  let author = await UserTypeModel.findById(aid);

  //if author not found
  if (!author) {
    return res.status(401).json({ message: "invalid author" });
  }
  //if author is found but role is different
  if (author.role !== "AUTHOR") {
    return res.status(403).json({ message: "Author not found or invalid role" });
  }
  //if author is blocked
  if (!author.isActive) {
    return res.status(403).json({ message: "author account is not active" });
  }

  //forward request to next 
  next();
};