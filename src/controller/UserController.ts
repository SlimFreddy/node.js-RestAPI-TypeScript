import express from "express";
import verify from "../services/JwtService";
import multer from "multer";
import HttpException from "../models/exceptions/HttpException";
import UserService from "../services/UserService";
import * as path from "path";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.USER_IMAGE_UPLOAD_PATH as string);
  },
  filename: (req, file, cb) => {
    cb(null, req.user._id + "." + file.mimetype.split("/")[1]);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 8,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(new HttpException(403, "Only jpeg and png files are allowed"));
    }
  },
});

const userController = express();
//UPLOAD USER IMAGE
userController.post(
  "/user/user-image",
  verify,
  upload.single("user-image"),
  async (req, res, next) => {
    try {
      const user = await UserService.saveUserImage(req);
      return res.json({ user });
    } catch (error) {
      next(error);
    }
  }
);

//DELETE USER IMAGE
userController.delete("/user/user-image", verify, async (req, res, next) => {
  try {
    const user = await UserService.deleteUserImage(req.user._id);
    return res.json({ user });
  } catch (error) {
    next(error);
  }
});

//GET USER IMAGE
userController.get("/user/user-image/:userId", async (req, res, next) => {
  try {
    const filePath = await UserService.getUserImage(req.params.userId);
    return res.sendFile(filePath, { root: path.join(process.cwd(), "./") });
  } catch (error) {
    next(error);
  }
});

userController.get("/user/:userId", async (req, res, next) => {
  try {
    const user = await UserService.getUser(req.params.userId);
    return res.json(user);
  } catch (error) {
    next(error);
  }
});
export default userController;
