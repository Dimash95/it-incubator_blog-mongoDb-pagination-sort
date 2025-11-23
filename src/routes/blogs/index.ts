import express, { Request, Response } from "express";
import { BlogModel } from "./model";
import { basicAuth } from "../../middlewares/auth";
import { createBlogValidation } from "./validation";
import { inputValidation } from "../../middlewares/input-validation";
import { HttpResponses } from "../../const";

export const blogsRouter = express.Router();

blogsRouter.get("/:id", async (req, res) => {
  const blog = await BlogModel.findById(req.params.id);

  if (!blog)
    return res.status(HttpResponses.NOT_FOUND).send({
      errorsMessages: [
        {
          message: "Blog not found",
          field: "id",
        },
      ],
    });

  return res.status(HttpResponses.OK).send(blog);
});

blogsRouter.get("/", async (req: Request, res: Response) => {
  let { searchNameTerm = "", pageNumber = 1, pageSize = 10 } = req.query;

  pageSize = +pageSize;
  pageNumber = +pageNumber;

  console.log(searchNameTerm);

  const blogs = await BlogModel.find({
    name: { $regex: searchNameTerm, $options: "i" },
  });

  const totalCount = blogs.length;
  const pagesCount = Math.ceil(totalCount / pageSize);

  const filteredBlogs = blogs.slice(
    (pageNumber - 1) * pageSize,
    (pageNumber - 1) * pageSize + pageSize
  );

  const result = {
    pagesCount,
    page: pageNumber,
    pageSize,
    totalCount,
    items: filteredBlogs,
  };

  res.status(HttpResponses.OK).send(result);
});

blogsRouter.post(
  "/",
  basicAuth,
  createBlogValidation,
  inputValidation,
  async (req: Request, res: Response) => {
    const { name, description, websiteUrl } = req.body;

    const blog = await BlogModel.create({
      name,
      description,
      websiteUrl,
    });

    return res.status(HttpResponses.CREATED).send(blog);
  }
);

blogsRouter.put(
  "/:id",
  basicAuth,
  createBlogValidation,
  inputValidation,
  async (req: Request, res: Response) => {
    const { name, description, websiteUrl } = req.body;

    const updated = await BlogModel.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        websiteUrl,
      },
      { new: true }
    );

    if (!updated)
      return res.status(HttpResponses.NOT_FOUND).send({
        errorsMessages: [
          {
            message: "Blog not found",
            field: "id",
          },
        ],
      });

    return res.sendStatus(HttpResponses.NO_CONTENT);
  }
);

blogsRouter.delete("/:id", basicAuth, async (req: Request, res: Response) => {
  const deleted = await BlogModel.findByIdAndDelete(req.params.id);

  if (!deleted)
    return res.status(HttpResponses.NOT_FOUND).send({
      errorsMessages: [
        {
          message: "Blog not found",
          field: "id",
        },
      ],
    });

  return res.sendStatus(HttpResponses.NO_CONTENT);
});
