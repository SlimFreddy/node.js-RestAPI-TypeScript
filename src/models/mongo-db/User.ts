import mongoose, { Schema, Document } from "mongoose";
import IUser from "../interfaces/IUser";

const UserSchema: Schema = new Schema({
  username: { type: String, required: true },
  userImage: {type: String},
  password: { type: String, required: true },
  date: { type: Date, default: Date.now}
});

export default mongoose.model<IUser>("User", UserSchema);
