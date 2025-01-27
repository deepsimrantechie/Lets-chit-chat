import express from "express";
import cors from "cors";
import connectDB from "./config/mongodb.js";
import dotenv from "dotenv";
import router from "./routes/auth.router.js";
import cookieParser from "cookie-parser";
import MessageRoutes from "./routes/MessageRoute.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4001;

// Middleware to handle large payloads
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from this origin
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(cookieParser());

// Routes
app.use("/api/auth", router);
app.use("/api/messages", MessageRoutes);

// API endpoint
app.get("/", (req, res) => {
  res.send("API WORKING");
});

// Start the server
const StartServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error.message);
    process.exit(1); // Exit process on failure
  }
};

StartServer();
