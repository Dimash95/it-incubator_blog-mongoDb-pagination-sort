import express from "express";
import { apiRouter } from "./routes";
import { connectDB } from "./db";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());
app.use("/api", apiRouter);

async function start() {
  await connectDB();

  app.listen(process.env.PORT || 6060, () => {
    console.log(`Example app listening on port ${process.env.PORT}`);
  });
}

start();

export default app;
