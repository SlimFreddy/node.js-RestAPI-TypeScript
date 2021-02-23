import mongoose, { Schema } from "mongoose";
import IPost from "./interfaces/IPost";

const PostSchema: Schema = new Schema({
  userId: { type: String, required: true },
  postTitle: { type: String, required: true },
  postBody: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

export default mongoose.model<IPost>("Post", PostSchema);
