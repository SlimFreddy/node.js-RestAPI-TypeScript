import { Document } from "mongoose";

export default interface IPost extends Document {
  userId: string;
  postTitle: string;
  postBody: string;
  date: Date;
}
