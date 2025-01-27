import jwt from "jsonwebtoken";
import usermodel from "../models/usermodel.js";

export const protectRoute = async (req, res, next) => {
  try {
    // Get the token from cookies
    const token = req.cookies.jwt;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.userId) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    // Find the user and attach to req
    const user = await usermodel.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user; // Attach user to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.log("Error in protection middleware", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
