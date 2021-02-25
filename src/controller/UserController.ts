import express from "express";
import verify from "../services/JwtService";
import multer from "multer";
import HttpException from "../models/exceptions/HttpException";
import UserService from "../services/UserService";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/user-images/");
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
  "/user/add-user-image",
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
userController.delete(
  "/user/add-user-image",
  verify,
  async (req, res, next) => {
    try {
      const user = await UserService.deleteUserImage(req.user._id);
      return res.json({ user });
    } catch (error) {
      next(error);
    }
  }
);

export default userController;
