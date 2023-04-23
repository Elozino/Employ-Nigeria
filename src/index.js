import express from "express";
import logger from "./utils/logger.js";
import db from "./utils/db.js";
import authRoutes from "./routes/authRoute.js";
import profileRoutes from "./routes/profileRoute.js";
import errorHandler from "./middleware/error.js";
import cookieParser from "cookie-parser";

const app = express();
const PORT = 5000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.get("/", (req, res) => {
  res.status(500).send("Welcome to Employ Nigeria Server");
});

app.use("/api/auth", authRoutes);
app.use("/api/user", profileRoutes);

// Error Handling (when api is not found)
app.use(errorHandler);

// Spin server
app.listen(PORT, async () => {
  logger.info(`App is listening on port http://localhost:${PORT}`);
  await db();
});
