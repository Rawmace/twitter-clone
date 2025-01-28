import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  // Set the cookie with the generated token
  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in milliseconds
    httpOnly: true, // Helps prevent XSS attacks
    sameSite: "strict", // Helps prevent CSRF attacks
    secure: process.env.NODE_ENV !== "development", // Use secure cookies in production
  });
};
