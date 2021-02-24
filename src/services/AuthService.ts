import HttpException from "../models/exceptions/HttpException";
import User from "../models/mongo-db/User";
import {
  validateUserSignIn,
  validateUserSignUp,
} from "../models/validations/UserValidation";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import IUser from "../models/interfaces/IUser";

class AuthService {
  public async signUpNewUser(newUser: IUser) {
    const { error } = validateUserSignUp(newUser);
    if (error) {
      throw new HttpException(500, error.details[0].message);
    }
    const usernameExist = await User.findOne({ username: newUser.username });
    if (usernameExist) {
      throw new HttpException(500, "Username already in use");
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newUser.password, salt);

    const user = new User({
      username: newUser.username,
      password: hashPassword,
    });
    return user
      .save()
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new HttpException(500, error.message);
      });
  }

  public async signInUser(user: IUser) {
    const { error } = validateUserSignIn(user);
    if (error) {
      throw new HttpException(500, error.details[0].message);
    }
    const dbUser = await User.findOne({ username: user.username });
    if (!dbUser) {
      throw new HttpException(500, "User dont exist");
    }
    const validPassword = await bcrypt.compare(user.password, dbUser.password);
    if (!validPassword) {
      throw new HttpException(500, "Password wrong");
    }
    return jwt.sign(
      { _id: dbUser._id },
      process.env.JWT_TOKEN_SECRET as string
    );
  }
}
export default new AuthService();
