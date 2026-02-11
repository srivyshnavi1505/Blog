import exp from "express";
import {authenticate} from "../services/authServices.js";
import {hash,compare} from "bcryptjs";
import {verifyToken} from "../middlewares/verifyToken.js";
import { UserTypeModel } from "../models/UserTypeModel.js";

export const commonRoute = exp.Router();

//login
commonRoute.post("/login", async (req, res, next) => {
  try {
    // take only email & password (NO role)
    let { email, password } = req.body;

    // call authenticate service
    let { token, user } = await authenticate({ email, password });

    // save token as httpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });

    res.status(200).json({ message: "login success", payload: user });
  } catch (err) {
    next(err);
  }
});


// LOGOUT
commonRoute.get("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  res.status(200).json({ message: "logout successfully" });
});

// CHANGE PASSWORD
commonRoute.put("/change-password", verifyToken, async (req, res) => {
  try {
    let { email, oldPassword, newPassword } = req.body;

    let user = await UserTypeModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "no user with this email" });
    }
    //we are checking if it matches with old pass

    const isMatch = await compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Sorry wrong password" });
    }
    //new pass creation

    const hashedPassword = await hash(newPassword, 12);

     let updatedUser = await UserTypeModel.findOneAndUpdate(
      { email },
      { $set: { password: hashedNewPass } },
      { new: true }
    );

    res
      .status(200)
      .json({ message: "changed the password successfully", payload: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "error", reason: err.message });
  }
});