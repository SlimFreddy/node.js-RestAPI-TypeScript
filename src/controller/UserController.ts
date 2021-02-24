import express from "express";
import verify from "../services/JwtService";
import multer from "multer";
import HttpException from "../models/exceptions/HttpException";
import User from "../models/mongo-db/User";
import fs from "fs";

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
    const filePath = req.file.path;
    try {
      const user = await User.findByIdAndUpdate(req.user._id, {
        userImage: filePath,
      });
      if (user) {
        res.json({ user });
      } else {
        fs.unlink(filePath, (error) => {
          return;
        });
        throw new HttpException(404, "User not Found");
      }
    } catch (error) {
      next(error);
    }
  }
);

export default userController;
