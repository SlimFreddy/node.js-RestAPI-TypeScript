import { Document } from "mongoose";

export default interface IPost extends Document {
  author: string;
  postTitle: string;
  postBody: string;
  date: Date;
}
