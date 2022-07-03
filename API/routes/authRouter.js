import { Router } from "express";
import { Login, Logout, signUp } from "../controllers/authController.js";

const authRouter = Router();

authRouter.post("/sign-up", signUp);

authRouter.post("/login", Login);

authRouter.get("/logout", Logout);

export default authRouter;
