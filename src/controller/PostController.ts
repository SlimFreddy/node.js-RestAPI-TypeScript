import express from "express";
import verify from "../services/JwtService";
import PostService from "../services/PostService";

const postController = express();

// GET ALL POST
postController.get("/", async (req, res, next) => {
  try {
    const posts = await PostService.getAllPost();
    return res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
});
// GET POST BY ID
postController.get("/post/:postId", verify, async (req, res, next) => {
  try {
    const post = await PostService.getPostById(req.params.postId);
    return res.status(200).json({
      post,
    });
  } catch (error) {
    next(error);
  }
});
// DELETE POST BY ID
postController.delete("/post/:postId", verify, async (req, res, next) => {
  try {
    const post = await PostService.deletePostByIdAndUserId(
      req.params.postId,
      req.user._id
    );
    return res.status(200).json({
      post,
    });
  } catch (error) {
    next(error);
  }
});
// ADD NEW POST
postController.post("/post/add", verify, async (req, res, next) => {
  try {
    const post = await PostService.addNewPost(req.body, req.user._id);
    return res.status(201).json({
      post: post,
    });
  } catch (error) {
    next(error);
  }
});

export default postController;
