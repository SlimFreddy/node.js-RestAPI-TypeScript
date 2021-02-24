import express, { Request, Response, NextFunction } from "express";
import authController from "./controller/AuthController";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import postController from "./controller/PostController";
import morgan from "morgan";
import HttpException from "./models/exceptions/HttpException";
import userController from "./controller/UserController";

// ENVIRONMENT  FILE
dotenv.config();
// DATABASE CONNECTION
mongoose.connect("mongodb://localhost:27017/blog", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const app = express();
// SERVER LOGGER FOR REQUEST
app.use(morgan("dev"));
// JSON FORMATTER
app.use(express.json());
//AUTHENTICATION REST API
app.use("/api/user", authController);
//POST REST API
app.use("/api/posts", postController);
//USER REST API
app.use("/api/users/", userController);

//PAGE NOT FOUND ERROR
app.use((req, res, next) => {
  const error = new HttpException(404, "Not Found");
  next(error);
});
//GENERAL ERROR RESPONSE
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
// SERVER PORT
app.listen(process.env.SERVER_PORT, () => {
  console.log(
    `[server]: Server is running at https://localhost:${process.env.SERVER_PORT}`
  );
});
