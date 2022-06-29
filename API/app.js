import express, { json } from "express";
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

let db;
const mongoClient = new MongoClient(process.env.MONGO_URI);

mongoClient.connect(() => {
  db = mongoClient.db("my-wallet-api");
  console.log(chalk.magenta.bold("MongoDB connected"));
});

app.post("/sign-up", async (req, res) => {
  const user = req.body;

  const passwordHash = bcrypt.hashSync(user.password, 10);

  await db.collection("users").insertOne({ ...user, password: passwordHash });

  res.sendStatus(201);
});

app.post("/sign-in", async (req, res) => {
  const { email, password } = req.body;

  const user = await db.collection("users").findOne({ email });

  if (user && bcrypt.compareSync(password, user.password)) {
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
});

app.listen(process.env.PORT, () => {
  console.log(
    chalk.green.bold(`Server running on port: http://localhost:${PORT}`)
  );
});
