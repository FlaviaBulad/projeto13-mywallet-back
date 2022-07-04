import { Router } from "express";

import { userSession } from "../middlewares/authMiddleware.js";
import { getBalance, addAmount } from "../controllers/balanceController.js";

const balanceRouter = Router();
balanceRouter.use(userSession);

balanceRouter.get("/balance", getBalance);
balanceRouter.post("/balance", addAmount);

export default balanceRouter;
