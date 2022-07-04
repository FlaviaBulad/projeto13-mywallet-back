import { Router } from "express";

import { userSession } from "./../middlewares/authMiddleware.js";

const balanceRouter = Router();
balanceRouter.use(userSession);

balanceRouter.get("/balance", async(req, res));

balanceRouter.post("/balance", async(req, res));

export default balanceRouter;
