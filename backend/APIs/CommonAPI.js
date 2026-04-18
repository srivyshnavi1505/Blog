import exp from "express";
import {authenticate} from "../services/authServices.js";
import {hash,compare} from "bcryptjs";
import {verifyToken} from "../middlewares/verifyToken.js";
import { UserTypeModel } from "../models/UserTypeModel.js";

export const commonRoute = exp.Router();

//login
commonRoute.post("/login", async (req, res, next) => {
  try {
    let { email, password } = req.body;
    let { token, user } = await authenticate({ email, password });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    res.status(200).json({ message: "login success", payload: user });
  } catch(err) {
    next(err);
  }
});

// LOGOUT
commonRoute.get("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  res.status(200).json({ message: "logout successfully" });
});

// CHANGE PASSWORD
commonRoute.put("/change-password", verifyToken("USER", "AUTHOR", "ADMIN"), async (req, res) => {
  try {
    let { email, oldPassword, newPassword } = req.body;

    let user = await UserTypeModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "no user with this email" });
    }

    const isMatch = await compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Sorry wrong password" });
    }

    const hashedPassword = await hash(newPassword, 12);

    let updatedUser = await UserTypeModel.findOneAndUpdate(
      { email },
      { $set: { password: hashedPassword } },
      { new: true }
    );

    res.status(200).json({ message: "changed the password successfully", payload: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "error", reason: err.message });
  }
});

// PAGE REFRESH — return full user from DB so _id, ProfileImageUrl etc. are present
// ✅ FIX: was returning req.user (JWT payload only: { userId, role, email })
//         which caused user._id to be undefined after refresh
commonRoute.get("/check-auth", verifyToken("USER", "AUTHOR", "ADMIN"), async (req, res) => {
  try {
    const user = await UserTypeModel.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    res.status(200).json({
      message: "authenticated",
      payload: user, // full user object — same shape as login response
    });
  } catch (err) {
    res.status(500).json({ message: "error", reason: err.message });
  }
});