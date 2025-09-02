import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.ts";

dotenv.config();

const PORT = process.env.PORT || 5000;
const app: Application = express();

// Middleware to parse JSON
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World 🌍");
});

// Connect Database
connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
