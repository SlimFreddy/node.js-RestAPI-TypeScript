import Joi, { number } from "joi";
import IUser from "../interfaces/IUser";

export const validateUserSignUp = (user: IUser) => {
  const userSchema = Joi.object<IUser>({
    username: Joi.string().min(6).required(),
    password: Joi.string().min(6).required(),
  });
  return userSchema.validate(user);
};

export const validateUserSignIn = (user: IUser) => {
  const userSchema = Joi.object<IUser>({
    username: Joi.string().min(6).required(),
    password: Joi.string().min(6).required(),
  });
  return userSchema.validate(user);
};
