import User from "../models/mongo-db/User";
import fs from "fs";
import HttpException from "../models/exceptions/HttpException";

class UserService {
  public async saveUserImage(req: Express.Request) {
    const filePath = req.file.path;
    const user = await User.findByIdAndUpdate(req.user._id, {
      userImage: filePath,
    });
    if (user) {
      return await User.findById(req.user._id);
    } else {
      fs.unlink(filePath, (error) => {
        return;
      });
      throw new HttpException(404, "User not Found");
    }
  }

  public async deleteUserImage(userId: string) {
    const user = await User.findById(userId);
    if (user) {
      if (user.userImage !== process.env.DEFAULT_USER_IMAGE_PATH) {
        const filePath = user.userImage;
        fs.unlink(filePath, (error) => {
          return;
        });
        await User.findByIdAndUpdate(userId, {
          userImage: process.env.DEFAULT_USER_IMAGE_PATH,
        });
        return await User.findById(userId);
      } else {
        throw new HttpException(
          404,
          "Default User Image is already in use, this cant be removed"
        );
      }
    } else {
      throw new HttpException(404, "User not Found");
    }
  }

  public async getUserImage(userId: string) {
    const user = await User.findById(userId);
    if (user) {
      return user.userImage;
    } else {
      throw new HttpException(404, "User Image not Found");
    }
  }

  public async getUser(userId: string) {
    const user = await User.findById(userId);
    if (user) {
      return { _id: user._id, username: user.username };
    } else {
      throw new HttpException(404, "User Image not Found");
    }
  }
}
export default new UserService();
