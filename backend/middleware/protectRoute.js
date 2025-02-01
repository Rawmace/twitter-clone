import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// Middleware to protect routes by verifying JWT
export const protectRoute = async (req, res, next) => {
  // Check if JWT_SECRET is defined
  if (!process.env.JWT_SECRET) {
    return res
      .status(500)
      .json({ error: "Internal Server Error: JWT_SECRET is not defined" });
  }

  try {
    const token = req.cookies.jwt; // Get the token from cookies
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No Token Provided" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by ID from the decoded token
    const user = await User.findById(decoded.userId).select("-password"); // Exclude password from user object
    if (!user) {
      return res.status(401).json({ error: "Unauthorized: User not found" });
    }

    // Attach user information to the request object
    req.user = user;

    // Call the next middleware or route handler
    next();
  } catch (error) {
    console.error("Error in protectRoute middleware:", error.message);

    // Handle specific JWT errors
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Unauthorized: Token has expired" });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Unauthorized: Invalid Token" });
    }

    // Handle other errors
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
