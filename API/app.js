import express from "express";
import chalk from "chalk";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import cors from "cors";
import joi from "joi";
import { v4 as uuid } from "uuid";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const token = uuid();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI;

let db;
const mongoClient = new MongoClient(MONGO_URI);

mongoClient.connect(() => {
  db = mongoClient.db("my-wallet-api");
  console.log(chalk.magenta.bold("MongoDB connected"));
});

app.post("/sign-up", async (req, res) => {
  const user = req.body;

  const signupSchema = joi.object({
    name: joi.string().min(1).required(),
    email: joi.string().email().required(),
    password: joi.string().min(3).max(15).required().label("Password"),
    password_confirmation: joi
      .any()
      .equal(joi.ref("password"))
      .required()
      .label("Confirm password")
      .options({ messages: { "any.only": "{{#label}} does not match" } }),
  });

  const validation = signupSchema.validate(user, {
    abortEarly: false,
  });

  if (validation.error) {
    console.log(validation.error.details);
    return res.sendStatus(422);
  }

  try {
    const salt = 10;
    const passwordHash = bcrypt.hashSync(user.password, salt);

    await db.collection("users").insertOne({
      name: user.name,
      email: user.email,
      password: passwordHash,
    });

    res.status(201).send("User created");
  } catch (error) {
    res.status(500).send("Server error:", error);
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await db.collection("users").findOne({ email });

  if (user && bcrypt.compareSync(password, user.password)) {
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
});

app.listen(PORT, () => {
  console.log(
    chalk.green.bold(`Server running on port: http://localhost:${PORT}`)
  );
});
