import express from "express";
import chalk from "chalk";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import cors from "cors";
import joi from "joi";
import { v4 as uuid } from "uuid";
import db from "./db.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

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
  try {
    const { email, password } = req.body;

    const user = await db.collection("users").findOne({ email });

    if (!user) return res.status(404).send("User not found");

    if (user && bcrypt.compareSync(password, user.password)) {
      const token = uuid();
      await db.collection("sessions").insertOne({ token, userId: user._id });
      return res.send({ token, name: user.name });
    } else {
      return res.sendStatus(401);
    }
  } catch (error) {
    console.log("Login error:", error);
    return res.sendStatus(500);
  }
});

app.get("/logout", async (req, res) => {});

app.listen(PORT, () => {
  console.log(
    chalk.green.bold(`Server running on port: http://localhost:${PORT}`)
  );
});
