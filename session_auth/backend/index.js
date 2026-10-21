import express from "express";
import "dotenv/config";
import { AppDataSource } from "./config/data-source.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import authRouter from "./routes/auth.route.js";
import { sessionMiddleWare } from "./config/session.js";

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(express.json());
app.use(sessionMiddleWare);
app.use("/auth", authRouter);

//Error middlewere
app.use(errorMiddleware);

async function startServer() {
  try {
    await AppDataSource.initialize();
    console.log("TypeORM connected to PostgreSQL.");

    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start application:", error);
    process.exit(1);
  }
}

startServer();
