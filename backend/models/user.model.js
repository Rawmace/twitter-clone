import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true, // Automatically trim whitespace
    },
    fullName: {
      type: String,
      required: true,
      trim: true, // Automatically trim whitespace
    },
    password: {
      type: String,
      required: true,
      minLength: 6, // Minimum length of 6 characters
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true, // Automatically trim whitespace
      lowercase: true, // Store email in lowercase
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [], // Default to an empty array
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [], // Default to an empty array
      },
    ],
    profileImg: {
      type: String,
      default: "",
    },
    coverImg: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
      trim: true, // Automatically trim whitespace
    },
    link: {
      type: String,
      default: "",
    },
    // user wants to see the no of likes and comments on his profile
    likedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        default: [],
      },
    ],
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

// Create User model
const User = mongoose.model("User", userSchema);
export default User;
