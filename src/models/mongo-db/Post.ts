import mongoose, { Schema } from "mongoose";
import IPost from "../interfaces/IPost";

const PostSchema: Schema = new Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  postTitle: { type: String, required: true },
  postBody: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

export default mongoose.model<IPost>("Post", PostSchema);
