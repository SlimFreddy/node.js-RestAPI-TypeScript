import express, { Request, Response, NextFunction } from "express";
import authController from "./routes/AuthController";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import postController from "./routes/PostController";
import morgan from "morgan";
import HttpException from "./models/exceptions/HttpException";


dotenv.config();
mongoose.connect("mongodb://localhost:27017/blog", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use("/api/user", authController);
app.use("/api/posts", postController);

app.use((req, res, next) => {
  const error = new HttpException(404, "Not Found");
  next(error);
});

app.use(
  (err: HttpException, req: Request, res: Response, next: NextFunction) => {
    res.status(err.status || 500);
    res.json({
      error: {
        status: err.status || 500,
        message: err.message,
      },
    });
  }
);
app.listen(process.env.SERVER_PORT, () => {
  console.log(
    `[server]: Server is running at https://localhost:${process.env.SERVER_PORT}`
  );
});
