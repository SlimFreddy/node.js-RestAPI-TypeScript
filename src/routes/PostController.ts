import express from "express";
import verify from "./verifyToken";
import { validatePost } from "../models/validation/PostValidation";
import Post from "../models/Post";
import PostService from "../services/PostService";

const postController = express();

// GET ALL POST
postController.get("/", verify, async (req, res) => {
  try {
    const posts = await PostService.getAllPost();
    return res.status(200).json({
      posts,
    });
  } catch (err) {
    return res.status(404).send(err.message);
  }
});
// GET POST BY ID
postController.get("/post/:postId", verify, async (req, res) => {
  try {
    const post = await PostService.getPostById(req.params.postId);
    return res.status(200).json({
      post,
    });
  } catch (err) {
    return res.status(404).send(err.message);
  }
});
// DELETE POST BY ID
postController.delete("/post/:postId", verify, async (req, res) => {
  try {
    const post = await PostService.deletePostByIdAndUserId(
      req.params.postId,
      req.user._id
    );
    return res.status(200).json({
      post,
    });
  } catch (err) {
    return res.status(404).send(err.message);
  }
});
// ADD NEW POST
postController.post("/post/add", verify, async (req, res) => {
  try {
    const post = await PostService.addNewPost(req.body, req.user._id);
    return res.status(201).json({
      post: post,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error,
    });
  }
});

export default postController;
