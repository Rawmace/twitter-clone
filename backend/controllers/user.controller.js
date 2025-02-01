import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";

import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";

// ----------------------Get user profile by username-----------------
export const getUserProfile = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username }).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error in getUserProfile:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ------------------Follow or unfollow a user----------------
export const followUnfollowUser = async (req, res) => {
  const { id } = req.params;

  try {
    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    // Check if the user is trying to follow/unfollow themselves
    if (id === req.user._id.toString()) {
      return res
        .status(400)
        .json({ error: "You can't follow/unfollow yourself" });
    }

    // Check if both users exist
    if (!userToModify || !currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const isFollowing = currentUser.following.includes(id);
    if (isFollowing) {
      // Unfollow the user
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
      res.status(200).json({ message: "User unfollowed successfully" });
    } else {
      // Follow the user
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
      // ===========Optionally send notification to the user here

      const newNotification = new Notification({
        type: "follow",
        from: req.user._id,
        to: userToModify._id,
      });
      await newNotification.save();

      //TODo return the id of the user asa a response

      res.status(200).json({ message: "User followed successfully" });
    }
  } catch (error) {
    console.error("Error in followUnfollowUser:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//---------------------------get suggested users ---------------------
export const getSuggestedUsers = async (req, res) => {
  try {
    // Exclude ourselves on our Profile
    const userId = req.user._id;
    const { following } = await User.findById(userId)
      .select("following")
      .lean(); // Use lean() for better performance

    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: userId }, // Exclude the authenticated user
        },
      },
      { $sample: { size: 10 } }, // Get 10 random users
    ]);

    // Filter out users that are already followed by the authenticated user
    const filteredUsers = users.filter((user) => !following.includes(user._id));

    // Get the first 4 suggested users
    const suggestedUsers = filteredUsers.slice(0, 4);

    // Remove password from suggested users
    suggestedUsers.forEach((user) => (user.password = null));

    res.status(200).json(suggestedUsers); // Return the correct variable
  } catch (error) {
    console.log("Error in getSuggestedUsers:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// -----------------------user wants to update the information---------------
export const updateUser = async (req, res) => {
  const { fullName, email, username, currentPassword, newPassword, bio, link } =
    req.body; // Extract user input from request body
  let { profileImg, coverImg } = req.body; // Extract image data from request body
  const userId = req.user._id; // Get user ID from authenticated request

  try {
    let user = await User.findById(userId); // Find user in database and let is because we are updating the value
    if (!user) return res.status(404).json({ message: "User not found" }); // Return error if user not found

    // Handle password update
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password); // Check if current password is correct
      if (!isMatch)
        return res.status(400).json({ error: "Current password is incorrect" }); // Return error if password doesn't match
      if (newPassword.length < 6)
        return res
          .status(400)
          .json({ error: "Password must be at least 6 characters long" }); // Check new password length
      const salt = await bcrypt.genSalt(10); // Generate salt for password hashing
      user.password = await bcrypt.hash(newPassword, salt); // Hash and set new password
    } else if (currentPassword || newPassword) {
      return res
        .status(400)
        .json({
          error: "Please provide both current password and new password",
        }); // Return error if only one password field is provided
    }

    // Handle profile image update
    if (profileImg) {
      if (user.profileImg) {
        await cloudinary.uploader.destroy(
          user.profileImg.split("/").pop().split(".")[0]
        ); // Delete old profile image from Cloudinary
      }
      const uploadedResponse = await cloudinary.uploader.upload(profileImg); // Upload new profile image
      profileImg = uploadedResponse.secure_url; // Get secure URL of uploaded image
    }

    // Handle cover image update
    if (coverImg) {
      if (user.coverImg) {
        await cloudinary.uploader.destroy(
          user.coverImg.split("/").pop().split(".")[0]
        ); // Delete old cover image from Cloudinary
      }
      const uploadedResponse = await cloudinary.uploader.upload(coverImg); // Upload new cover image
      coverImg = uploadedResponse.secure_url; // Get secure URL of uploaded image
    }

    // Update user fields
    user.fullName = fullName || user.fullName; // Update fullName if provided, otherwise keep existing
    user.email = email || user.email;
    user.username = username || user.username;
    user.bio = bio || user.bio;
    user.link = link || user.link;
    user.profileImg = profileImg || user.profileImg;
    user.coverImg = coverImg || user.coverImg;

    await user.save(); // Save updated user to database

    user.password = null; // Remove password from user object before sending response

    res.status(200).json({ message: "User updated successfully", user }); // Send success response with updated user data
  } catch (error) {
    console.error("Error in updateUser:", error); // Log error for debugging
    res.status(500).json({ error: "Internal server error" }); // Send generic error response
  }
};
