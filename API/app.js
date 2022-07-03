import express from "express";
import chalk from "chalk";
import dotenv from "dotenv";
import cors from "cors";

import authRouter from ".routes/authRouter.js";
import balanceRouter from ".routes/balanceRouter.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(authRouter);
app.use(balanceRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    chalk.green.bold(`Server running on port: http://localhost:${PORT}`)
  );
});
