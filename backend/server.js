// Import required modules
import express from "express";
import authRoutes from "./routes/auth.routes.js";
import dotenv from "dotenv";
import connectMongoDB from "./db/connectMongoDB.js";

//-------------------------------------------------------import area ends -----------------------------------

//define and decalre

dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();

//Middleware to parse JSON requests
app.use(express.json());

//logging the MONGO URI for debugging purposes
console.log(process.env.MONGO_URI);

// use authentication routes
app.use("/api/auth", authRoutes);

//erro handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
//start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}, http://localhost:${PORT}`);
  connectMongoDB();
});
