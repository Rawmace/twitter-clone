import express from "express";
import {
  login,
  logout,
  signup,
  getMe,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/protectRoute.js"; // for getMe

const router = express.Router();

// Protected route to get current user information
router.get("/me", protectRoute, getMe);

// Public routes for user authentication
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

export default router;
