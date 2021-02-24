import express from "express";
import authService from "./routes/auth";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import postController from "./routes/PostController";

const app = express();

dotenv.config();


mongoose.connect("mongodb://localhost:27017/blog", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());
app.use("/api/user", authService);
app.use("/api/posts", postController);
app.listen(process.env.SERVER_PORT, () => {
  console.log(
    `[server]: Server is running at https://localhost:${process.env.SERVER_PORT}`
  );
});
