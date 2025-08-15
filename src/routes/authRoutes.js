import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { protect } from "../middlewares/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

router.get("/user", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id, {
      updatedAt: false,
      createdAt: false,
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = jwt.sign(
      {
        id: req.user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/",
    });

    res.redirect("http://localhost:3000/home");
  }
);

router.delete("/logout", protect, (_req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
});

export default router;
