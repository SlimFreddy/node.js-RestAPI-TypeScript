import { Query } from "mongoose";
import HttpException from "../models/exceptions/HttpException";
import IPost from "../models/interfaces/IPost";
import Post from "../models/Post";
import { validatePost } from "../models/validations/PostValidation";

class PostService {
  public async getAllPost(): Promise<IPost[]> {
    try {
      const posts = await Post.find({});
      if (posts.length >0) {
        return posts;
      } else {
        throw new HttpException(404,`No Posts found`);
      }
    } catch (error) {
      throw new HttpException(error.status || 500, error.message);
    }
  }

  public async getPostById(id: string): Promise<IPost> {
    try {
      const post = await Post.findById(id);
      if (post) {
        return post;
      } else {
        throw new HttpException(404,`Post with id ${id} not found`);
      }
    } catch (error) {
      throw new HttpException(error.status || 500, error.message);
    }
  }

  public async addNewPost(post: IPost, userId: string) {
    const { error } = validatePost(post);
    if (error) {
      throw new Error(error.details[0].message);
    }
    const newPost = new Post({
      userId: userId,
      postTitle: post.postTitle,
      postBody: post.postBody,
    });

    return newPost
      .save()
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new HttpException(500,error.message);
      });
  }

  public async deletePostByIdAndUserId(
    postId: string,
    userId: string
  ): Promise<Query<any, IPost>> {
    try {
      const post = await Post.findById(postId);
      if (post) {
        if ((post.userId as string) === userId) {
          const deletePost = await Post.deleteOne(post);
          return deletePost;
        } else {
          throw new HttpException(500, `Not allowd to delete this post with id ${postId}`);
        }
      } else {
        throw new HttpException(404, `Post with id ${postId} not found`);
      }
    } catch (error) {
        throw new HttpException(error.status || 500 , error.message);
    }
  }
}
export default new PostService();
