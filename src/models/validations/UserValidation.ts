import Joi from "joi";
import IUser from "../interfaces/IUser";

export const validateUserSignUp = (user: IUser) => {
  const userSchema = Joi.object<IUser>({
    username: Joi.string().min(6).required(),
    password: Joi.string().min(6).required(),
  });
  return userSchema.validate(user);
};

export const validateUsername = (username :string) => {
  const checkValue = {
    username: username,
  }
  const usernameSchema = Joi.object<{ username: string }>({
    username: Joi.string().min(6).required(),
  });
  return usernameSchema.validate(checkValue);
};
