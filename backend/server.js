// Import required modules
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";

import connectMongoDB from "./db/connectMongoDB.js";

// Load environment variables
dotenv.config();

//importing cloudinary api and cloud names
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// Define and declare constants
const PORT = process.env.PORT || 5000;
const app = express();

// Middleware to parse JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logging the MONGO URI for debugging purposes (consider removing in production)
if (process.env.NODE_ENV !== "production") {
  console.log("Mongo URI:", process.env.MONGO_URI);
}

// Use authentication routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({ error: "Something broke!" }); // Send a JSON response for consistency
});

// Start the server and connect to MongoDB
const startServer = async () => {
  try {
    await connectMongoDB(); // Ensure MongoDB connection before starting the server
    app.listen(PORT, () => {
      console.log(
        `Server is running on port ${PORT}, http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error.message);
    process.exit(1); // Exit the process with failure
  }
};

// Initialize the server
startServer();
// 4 hrs 40 mins
