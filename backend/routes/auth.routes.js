import express from "express";
import {
  login,
  logout,
  signup,
  getMe,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/protectRoute.js"; // Middleware to protect routes

const router = express.Router();

// Protected route to get current user information
router.get("/me", protectRoute, getMe);

// Public routes for user authentication
router.post("/signup", signup); // Route for user signup
router.post("/login", login); // Route for user login
router.post("/logout", logout); // Route for user logout

export default router;
