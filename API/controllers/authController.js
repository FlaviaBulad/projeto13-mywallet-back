import bcrypt from "bcrypt";
import joi from "joi";
import { v4 as uuid } from "uuid";
import db from "../../db.js";

export async function signUp(req, res) {
  const user = req.body;
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
}

export async function Login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return res.status(404).send("User not found");
    }

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
}

export async function Logout(req, res) {
  const { authorization } = req.headers;

  const token = authorization?.replace("Bearer", "").trim();

  if (!token) return res.send(403);

  try {
    await db.collection("sessions").deleteOne({ token });
    res.sendStatus(200);
  } catch (error) {
    console.log("Logout error:", error);
    return res.sendStatus(500);
  }
}
