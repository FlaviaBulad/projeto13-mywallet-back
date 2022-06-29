import express from "express";
import chalk from "chalk";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const username = process.env.USER_NAME;

app.get("/test", (_, res) => {
  res.send(`Hello, ${username}! the server is running on port ${PORT}.`);
});

app.listen(process.env.PORT, () => {
  console.log(
    chalk.green.bold(`Server running on port: http://localhost:${PORT}`)
  );
});
