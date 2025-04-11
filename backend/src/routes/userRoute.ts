import express from "express"
import { ForgotPassword, Login, ResetPassword, Signup, UpdatePassord } from "../controller/userController.js";

export const userRouter = express.Router();

userRouter.post("/signup",Signup)
userRouter.post("/login",Login)
userRouter.post("/forgot-password",ForgotPassword)
userRouter.get("/reset-password/:token",ResetPassword)
userRouter.post("/reset-password",UpdatePassord)


