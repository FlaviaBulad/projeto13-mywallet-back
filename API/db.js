import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import chalk from "chalk";

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI;

let db;
const mongoClient = new MongoClient(MONGO_URI);

mongoClient.connect(() => {
  db = mongoClient.db("my-wallet-api");
  console.log(chalk.magenta.bold("MongoDB connected"));
});

export default db;
