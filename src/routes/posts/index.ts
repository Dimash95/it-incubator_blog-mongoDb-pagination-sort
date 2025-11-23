import express, { Request, Response } from "express";
import { PostModel } from "./model";
import { BlogModel } from "../blogs/model";
import { postValidation } from "./validation";
import { basicAuth } from "../../middlewares/auth";
import { inputValidation } from "../../middlewares/input-validation";
import { HttpResponses } from "../../const";

export const postsRouter = express.Router();

postsRouter.get("/:id", async (req: Request, res: Response) => {
  const post = await PostModel.findById(req.params.id);

  if (!post)
    return res.status(HttpResponses.NOT_FOUND).send({
      errorsMessages: [
        {
          message: "Post not found",
          field: "id",
        },
      ],
    });

  return res.status(HttpResponses.OK).send(post);
});

postsRouter.get("/", async (req, res) => {
  const posts = await PostModel.find();
  res.status(HttpResponses.OK).send(posts);
});

postsRouter.post(
  "/",
  basicAuth,
  postValidation,
  inputValidation,
  async (req: Request, res: Response) => {
    const { title, shortDescription, content, blogId } = req.body;

    const blog = await BlogModel.findById(blogId);

    if (!blog)
      return res.status(HttpResponses.NOT_FOUND).send({
        errorsMessages: [{ field: "blogId", message: "Invalid blogId" }],
      });

    const newPost = await PostModel.create({
      title,
      shortDescription,
      content,
      blogId,
      blogName: blog.name,
    });

    return res.status(HttpResponses.CREATED).send(newPost);
  }
);

postsRouter.put(
  "/:id",
  basicAuth,
  postValidation,
  inputValidation,
  async (req: Request, res: Response) => {
    const { title, shortDescription, content, blogId } = req.body;

    const blog = await BlogModel.findById(blogId);
    if (!blog)
      return res.status(HttpResponses.NOT_FOUND).send({
        errorsMessages: [
          {
            message: "Blog not found",
            field: "id",
          },
        ],
      });

    const updated = await PostModel.findByIdAndUpdate(
      req.params.id,
      {
        title,
        shortDescription,
        content,
        blogId,
        blogName: blog.name,
      },
      { new: true }
    );

    if (!updated)
      return res.status(HttpResponses.NOT_FOUND).send({
        errorsMessages: [
          {
            message: "Post not found",
            field: "id",
          },
        ],
      });

    return res.sendStatus(HttpResponses.NO_CONTENT);
  }
);

postsRouter.delete("/:id", basicAuth, async (req, res) => {
  const deleted = await PostModel.findByIdAndDelete(req.params.id);

  if (!deleted)
    return res.status(HttpResponses.NOT_FOUND).send({
      errorsMessages: [
        {
          message: "Post not found",
          field: "id",
        },
      ],
    });

  return res.sendStatus(HttpResponses.NO_CONTENT);
});
