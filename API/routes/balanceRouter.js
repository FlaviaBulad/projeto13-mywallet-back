import { Router } from "express";
import bcrypt from "bcrypt";
import joi from "joi";
import { v4 as uuid } from "uuid";
import db from "./../db.js";

const balanceRouter = Router();

balanceRouter.get("/balance", async (req, res) => {
  res.sendStatus(200);
});

balanceRouter.post("/income", async (req, res) => {});

balanceRouter.post("/expenses", async (req, res) => {});
