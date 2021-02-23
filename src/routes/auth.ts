import express from "express";
import User from "../models/User";
import {
  validateUserSignIn,
  validateUserSignUp,
} from "../models/validation/UserValidation";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const authService = express();
authService.post("/sign-up", async (req, res) => {
  const { error } = validateUserSignUp(req.body);
  if (error) {
    return res.status(500).json({
      message: error.details[0].message,
    });
  }
  const usernameExist = await User.findOne({ username: req.body.username });
  if (usernameExist) {
    return res.status(500).json({ message: "Username already in use" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    username: req.body.username,
    password: hashPassword,
  });
  return user
    .save()
    .then((result) => {
      return res.status(201).json({
        user: result,
      });
    })
    .catch((error) => {
      return res.status(500).json({
        message: error.message,
        error,
      });
    });
});

authService.post("/sign-in", async (req, res) => {
  const { error } = validateUserSignIn(req.body);
  if (error) {
    return res.status(500).json({
      message: error.details[0].message,
    });
  }
  const user = await User.findOne({ username: req.body.username });
  if (!user) {
    return res.status(500).json({ message: "User dont exist " });
  }
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    return res.status(500).json({ message: "Password wrong " });
  }
  const jwtToken = jwt.sign(
    { _id: user._id },
    process.env.JWT_TOKEN_SECRET as string
  );
  res.header("jwt-token", jwtToken).send(jwtToken);
});

export default authService;
