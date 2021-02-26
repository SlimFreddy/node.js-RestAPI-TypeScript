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
mongoose.connect(
  process.env.MONGO_URL as string,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log(
      "\x1b[33m%s\x1b[0m",
      `[database]: Server connect to ${process.env.MONGO_URL} database`
    );
  }
);
const app = express();
// SERVER LOGGER FOR REQUEST
app.use(morgan("dev"));
// JSON FORMATTER
app.use(express.json());
//CORS SETTINGS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-METHOD", "POST, GET, DELETE");
    return res.status(200).json({});
  }
  next();
});
//AUTHENTICATION REST API
app.use("/api/auth", authController);
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
      status: err.status || 500,
      message: err.message,
    });
  }
);
// SERVER PORT
app.listen(process.env.SERVER_PORT, () => {
  console.log(
    "\x1b[33m%s\x1b[0m",
    `[server]: Server is running at https://localhost:${process.env.SERVER_PORT}`
  );
});
