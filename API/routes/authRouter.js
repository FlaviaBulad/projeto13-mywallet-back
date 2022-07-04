import { Router } from "express";
import { Login, Logout, signUp } from "../controllers/authController.js";
import {
  validateSignIn,
  validateSignUp,
} from "../middlewares/validadeAuthMiddleware.js";

const authRouter = Router();

authRouter.post("/sign-up", validateSignUp, signUp);

authRouter.post("/login", validateSignIn, Login);

authRouter.get("/logout", Logout);

export default authRouter;
