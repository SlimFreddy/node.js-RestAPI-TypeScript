import Joi from "joi";
import IPost from "../interfaces/IPost";

export const validatePost = (post: IPost) => {
  const postSchema = Joi.object<IPost>({
    postTitle: Joi.string().required(),
    postBody: Joi.string().required(),
  });
  return postSchema.validate(post);
};
