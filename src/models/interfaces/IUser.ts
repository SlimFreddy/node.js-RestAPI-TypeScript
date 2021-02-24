import { Document } from "mongoose";

export default interface IUser extends Document {
  username: string;
  userImage?: string;
  password: string;
  date: Date;
}
