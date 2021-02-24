import express from "express";
import AuthService from "../services/AuthService";

const authController = express();
//CREATE NEW USER
authController.post("/sign-up", async (req, res, next) => {
  try {
    const result = await AuthService.signUpNewUser(req.body);
    return res.status(201).json({
      result,
    });
  } catch (error) {
    next(error);
  }
});
//LOGIN AN EXISTING USER
authController.post("/sign-in", async (req, res, next) => {
  try {
    const jwtToken = await AuthService.signInUser(req.body);
    res.header("jwt-token", jwtToken).send(jwtToken);
  } catch (error) {
    next(error);
  }
});

export default authController;
