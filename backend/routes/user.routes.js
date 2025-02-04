//-----this is for another part -- user info and follow unfollow --------

import express from "express";
import { protectRoute } from "../middleware/protectRoute.js"; // Middleware to protect routes
import {
  getUserProfile,
  followUnfollowUser,
  getSuggestedUsers,
  updateUser,
} from "../controllers/user.controller.js"; // Import your controller functions

const router = express.Router();

// Protected route to get a user's profile by username
router.get("/profile/:username", protectRoute, getUserProfile);
router.post("/follow/:id", protectRoute, followUnfollowUser);
router.get("/suggested", protectRoute, getSuggestedUsers); // Route for suggested users
router.post("/update", protectRoute, updateUser); // Route for updating user profile

export default router;
