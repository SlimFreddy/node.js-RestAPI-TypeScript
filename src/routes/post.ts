import express, { request } from "express";
import verify from "./verifyToken";
import { validatePost } from "../models/validation/PostValidation";
import Post from "../models/Post";
const postService = express();

postService.get("/", verify, async (req, res) => {
  const posts = await Post.find({});
  return res.status(200).json({
    posts,
  });
});

postService.get("/post/:postId", verify, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    return res.status(200).json({
      post,
    });
  } catch (err) {
    return res.status(404).send(err.message);
  }
});
postService.delete("/post/:postId", verify, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (post && (post.userId as string) === req.user._id) {
      try {
        const deletePost = await Post.deleteOne(post);
        return res.status(200).json({
          deletePost,
        });
      } catch (err) {
        return res.status(404).send(err.message);
      }
    } else {
      return res.status(401).send("Acces Denied, not allowd to delete");
    }
  } catch (err) {
    return res.status(404).send(err.message);
  }
});
postService.post("/post/add", verify, (req, res) => {
  const { error } = validatePost(req.body);
  if (error) {
    return res.status(500).json({
      message: error.details[0].message,
    });
  }
  const post = new Post({
    userId: req.user._id,
    postTitle: req.body.postTitle,
    postBody: req.body.postBody,
  });

  return post
    .save()
    .then((result) => {
      return res.status(201).json({
        post: result,
      });
    })
    .catch((error) => {
      return res.status(500).json({
        message: error.message,
        error,
      });
    });
});

export default postService;
