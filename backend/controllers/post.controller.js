import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import { v2 as cloudinary } from "cloudinary";
import Notification from "../models/notification.model.js";

//=====================USER WANTS TO CREATE A POST================================================
export const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    let { img } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!text && !img) {
      return res.status(400).json({ error: "Post must have text or image" });
    }

    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img);
      img = uploadedResponse.secure_url;
    }

    const newPost = new Post({
      user: userId,
      text,
      img,
    });

    await newPost.save();
    res.status(201).json({ newPost });
  } catch (error) {
    console.log("Error in the createPost controller", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//==============================USER WANTS TO DELETE A POST ==========================================
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id); //we are passing this id to delete this post

    // Check if we are the owner of the post exists
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Check if the user is the authenticated user
    if (post.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this post" });
    }

    // Delete image from Cloudinary if it exists
    if (post.img) {
      const imgId = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }

    // Delete the post
    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error in the deletePost controller:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//==============================USER WANTS TO COMMENT ON POST OWN HIS OWN OR OTHERS DOESNT MATTER========
export const commentOnPost = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.user._id;

    // Check if text is provided
    if (!text) {
      return res.status(400).json({ error: "Text is required for commenting" });
    }

    // Find the post by ID
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Create the comment object
    const comment = { user: userId, text };

    // Add the comment to the post's comments array
    post.comments.push(comment);

    // Save the updated post
    await post.save();

    // Send a success response
    res.status(201).json({ message: "Comment added successfully", post });
  } catch (error) {
    console.log("Error in commentOnPost", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//============================user wants to see all of his post in one =============================
export const getAllPosts = async (req, res) => {
  //check if user has posts
  //xa vane patha sabai
  //natra error

  try {
    //sab post find garxa and sort garxa and based on creation date(-1 means latest post on top descending order ma garxa )
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "-password" })
      .populate({
        path: "comments.user",
        select: "-password -email",
      }); //populate will add the username and
    // profile picture of the use instead of the userid and willl eliminate the password
    if (posts.length == 0) {
      return res.status(200).json([]); // return the array of 0
    }
    res.status(200).json(posts);
  } catch (error) {
    console.log("Error in getAllPosts Controller", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ==========================user wants to like or dislike the posts ===============================

export const likeUnlikePost = async (req, res) => {
  try {
    // Get the user ID and post ID
    const userId = req.user._id;
    const { id: postId } = req.params;

    // Validate post ID
    if (!postId) {
      return res.status(400).json({ error: "Post ID is missing" });
    }

    // Fetch the post with only necessary fields
    const post = await Post.findById(postId).select("likes user");
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Check if the user has already liked the post
    const userLikedPost = post.likes.includes(userId);

    if (userLikedPost) {
      // Unlike the post
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });
      res.status(200).json({ message: "Post unliked successfully" });
    } else {
      // Like the post
      await Post.updateOne({ _id: postId }, { $addToSet: { likes: userId } });
      await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });

      // Send notification if the post has a user
      if (post.user) {
        const notification = new Notification({
          from: userId,
          to: post.user,
          type: "like",
        });
        await notification.save();
      }

      res.status(200).json({ message: "Post liked successfully" });
    }
  } catch (error) {
    console.error("Error in likeUnlikePost controller:", error.message);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};
//==================================user want to see his liked posts and likes========================
export const getLikedPosts = async (req, res) => {
  const userId = req.params.id;

  try {
    // Find user by id
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user has liked posts
    if (!Array.isArray(user.likedPosts) || user.likedPosts.length === 0) {
      return res.status(200).json([]); // Return an empty array if no liked posts
    }

    // Fetch liked posts
    const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
      .populate({ path: "user", select: "-password" })
      .populate({ path: "comments.user", select: "-password" });

    res.status(200).json(likedPosts);
  } catch (error) {
    console.error("Error in getLikedPosts Controller:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

//========================================user wants to see the all post of all following ==================
export const getFollowingPosts = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get the list of users the current user is following
    const following = user.following;

    // If the user is not following anyone, return an empty array
    if (!Array.isArray(following) || following.length === 0) {
      return res.status(200).json([]);
    }

    // Fetch posts from users the current user is following
    const feedPosts = await Post.find({ user: { $in: following } })
      .sort({ createdAt: -1 }) // Sort by latest posts first
      .populate({ path: "user", select: "-password" }) // Populate user details (excluding password)
      .populate({ path: "comments.user", select: "-password" }); // Populate comment user details (excluding password)

    res.status(200).json(feedPosts);
  } catch (error) {
    console.error("Error in the getFollowingPosts controller:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

// =================to get the user posts =======================
export const getUserPosts = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });

    const posts = await Post.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "-password" })
      .populate({ path: "comments.user", select: "-password" });
    res.status(200).json(posts);
  } catch (error) {
    console.log("Error in the getUserController", error);
    res.status(500).json({ error: "Internal server Error" });
  }
};
