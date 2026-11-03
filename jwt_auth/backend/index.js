import express from "express";
import "dotenv/config";
import { errorMiddleware } from "./middleware/error.middleware.js";
import { pgPool } from "./config/db_config.js";
import authRouter from "./routes/auth.route.js";

const app = express();

app.use(express.json());

app.use("/auth", authRouter);

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Server is running",
  });
});

const startServer = async () => {
  try {
    await pgPool.query("SELECT 1");

    console.log("DB connected successfully");

    app.listen(3000, () => {
      console.log("App listening on port 3000");
    });
  } catch (error) {
    console.error("Application startup failed:", error.message);
    process.exitCode = 1;
  }
};

// Register error middleware after the routes.
app.use(errorMiddleware);

startServer();
