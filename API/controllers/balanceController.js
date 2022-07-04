import dayjs from "dayjs";
import db from "../db.js";
import joi from "joi";

export async function getBalance(req, res) {
  const { user } = res.locals;
  try {
    const balance = await db
      .collection("balance")
      .find({ userId: user._id })
      .toArray();
    res.send(balance);
  } catch (error) {
    console.log("Error getting balance.", error);
    return res.sendStatus(500);
  }
}

export async function addAmount(req, res) {
  const balanceSchema = joi.object({
    type: joi.string().required(),
    description: joi.string().required(),
    value: joi.number().required(),
  });

  const { error } = balanceSchema.validate(req.body);
  if (error)
    return res.status(422).send(error.details.map((detail) => detail.message));

  const { user } = res.locals;
  try {
    const { type, description, value } = req.body;
    await db.collection("balance").insertOne({
      type,
      value,
      description,
      date: dayjs().format("DD/MM"),
      userId: user._id,
    });
    res.sendStatus(201);
  } catch (error) {
    console.log("Error adding new Amount.", error);
    return res.sendStatus(500);
  }
}
