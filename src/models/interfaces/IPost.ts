import { Document } from "mongoose";

export default interface IUser extends Document {
  userId: string;
  postTitle: string;
  postBody: string;
  date: Date;
}
