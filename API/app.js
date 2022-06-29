import express from "express";
import chalk from "chalk";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT;

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;
mongoClient.connect(() => {
  db = mongoClient.db("my-wallet-api");
});

app.listen(process.env.PORT, () => {
  console.log(
    chalk.green.bold(`Server running on port: http://localhost:${PORT}`)
  );
});
