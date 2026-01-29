import express from "express"
import { LoginWithGoogle } from "../controller/userController.js";
import { Auth } from "../middleware/middleware.js";
export const userRouter = express.Router();
userRouter.post("/auth/google", LoginWithGoogle);


