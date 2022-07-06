import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import chalk from "chalk";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

let db;
const mongoClient = new MongoClient(
  "mongodb+srv://admin:admin@cluster0.top9izf.mongodb.net/?retryWrites=true&w=majority"
);

mongoClient.connect(() => {
  db = mongoClient.db("my-wallet-api");
  console.log(chalk.magenta.bold("MongoDB connected"));
});

export default db;
