import { Query } from "mongoose";
import { RPost, RUser } from "src/models/interfaces/Response";
import HttpException from "../models/exceptions/HttpException";
import IPost from "../models/interfaces/IPost";
import Post from "../models/mongo-db/Post";
import User from "../models/mongo-db/User";
import { validatePost } from "../models/validations/PostValidation";

class PostService {
  public async getAllPost(): Promise<RPost[]> {
    try {
      const posts = (await Post.find({})) as IPost[];
      if (posts.length > 0) {
        const rPosts: RPost[] = await Promise.all(
          posts.map(async (post) => {
            const user = await User.findById(post.author);
            const rUser: RUser = {
              _id: user ? user._id : "NOT FOUND",
              username: user ? user.username : "NOT FOUND",
            };
            const rPost: RPost = {
              _id: post._id,
              postTitle: post.postTitle,
              postBody: post.postBody,
              date: post.date,
              author: rUser,
            };
            return rPost;
          })
        );
        return rPosts;
      } else {
        throw new HttpException(404, `No Posts found`);
      }
    } catch (error) {
      throw new HttpException(error.status || 500, error.message);
    }
  }

  public async getPostById(id: string): Promise<RPost> {
    try {
      const post = await Post.findById(id);

      if (post) {
        const user = await User.findById(post.author);
        const rUser: RUser = {
          _id: user ? user._id : "NOT FOUND",
          username: user ? user.username : "NOT FOUND",
        };
        const rPost: RPost = {
          _id: post._id,
          postTitle: post.postTitle,
          postBody: post.postBody,
          date: post.date,
          author: rUser,
        };
        return rPost;
      } else {
        throw new HttpException(404, `Post with id ${id} not found`);
      }
    } catch (error) {
      throw new HttpException(error.status || 500, error.message);
    }
  }

  public async addNewPost(post: IPost, userId: string) {
    const user = await User.findById(userId);
    if (user) {
      const { error } = validatePost(post);
      if (error) {
        throw new Error(error.details[0].message);
      }
      const newPost = new Post({
        author: user._id,
        postTitle: post.postTitle,
        postBody: post.postBody,
      });

      return newPost
        .save()
        .then((result) => {
          return result;
        })
        .catch((error) => {
          throw new HttpException(500, error.message);
        });
    }
  }

  public async deletePostByIdAndUserId(
    postId: string,
    userId: string
  ): Promise<Query<any, IPost>> {
    try {
      const post = await Post.findById(postId);
      if (post) {
        if ((post.author as string) === userId) {
          const deletePost = await Post.deleteOne(post);
          return deletePost;
        } else {
          throw new HttpException(
            500,
            `Not allowd to delete this post with id ${postId}`
          );
        }
      } else {
        throw new HttpException(404, `Post with id ${postId} not found`);
      }
    } catch (error) {
      throw new HttpException(error.status || 500, error.message);
    }
  }
}
export default new PostService();
