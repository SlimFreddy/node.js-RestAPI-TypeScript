import { Query } from "mongoose";
import IPost from "../models/interfaces/IPost";
import Post from "../models/Post";
import { validatePost } from "../models/validation/PostValidation";

class PostService {
  public async getAllPost(): Promise<IPost[]> {
    try {
      const posts = await Post.find({});
      if (posts) {
        return posts;
      } else {
        throw new Error(`No Posts found`);
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  public async getPostById(id: string): Promise<IPost> {
    try {
      const post = await Post.findById(id);
      if (post) {
        return post;
      } else {
        throw new Error(`Post with id ${id} not found`);
      }
    } catch (error) {
      throw new Error(error.message);
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
        throw new Error(error.message);
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
          throw new Error(`Not allowd to delete this post with id ${postId}`);
        }
      } else {
        throw new Error(`Post with id ${postId} not found`);
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
export default new PostService();
