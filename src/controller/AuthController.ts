import express from "express";
import { IUsernameValid } from "src/models/interfaces/IUsernameValid";
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
    res.header("jwt", jwtToken).json({ jwt: jwtToken });
  } catch (error) {
    next(error);
  }
});
// CHECK IF USER NAME IS IN USE AND VALID
authController.get("/username/:username", async (req, res, next) => {
  try {
    const usernameValid: IUsernameValid = await AuthService.checkUsername(
      req.params.username
    );
    return res.json({ usernameValid });
  } catch (error) {
    next(error);
  }
});

export default authController;
