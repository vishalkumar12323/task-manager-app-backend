import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes.js";
import { connectDB } from "./config/db.js";
import taskRoutes from "./routes/taskRoutes.js";
import "./config/passport.js";

dotenv.config({ quiet: true });

const PORT = process.env.PORT || 9000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());
app.use(morgan("dev"));

app.use(passport.initialize());

app.get("/", (_req, res) => {
  res.send("Task Manager API is running...");
});

app.use("/api/tasks", taskRoutes);
app.use("/api/auth", authRoutes);

async function init() {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log("mongodb connected!");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (error) {
    console.log("error: ", error);
    process.exit(1);
  }
}

init();
