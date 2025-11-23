import express from "express";
import { dropRouter } from "./drop";
import { blogsRouter } from "./blogs";
import { postsRouter } from "./posts";

export const apiRouter = express.Router();

apiRouter.use("/testing/all-data", dropRouter);
apiRouter.use("/blogs", blogsRouter);
apiRouter.use("/posts", postsRouter);
