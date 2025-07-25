import { Request, Response } from "express";
import { LoginSchema, SignupSchema } from "../model/userSchema.js";
import { PrismaClient } from "@prisma/client";
import * as crypto from "crypto";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer"
const prisma = new PrismaClient();
const saltRounds = 10;
import dotenv from "dotenv";
dotenv.config();


export const Signup = async (req: Request, res: Response) => {
    const validation = SignupSchema.safeParse(req.body);
    if (!validation.success) {
        res.status(400).json({
            message: "signup validation error",
            err: validation.error.format()
        })
        return
    }
    try {
        const { username, email, password, bio, picture } = validation.data;
        const existingUser = await prisma.user.findUnique({
            where: { email }
        })
        if (existingUser) {
            res.status(400).json({
                message: "User already exists with this email",
            })
        }
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        const user = await prisma.user.create({
            data: {
                password: hashedPassword,
                email,
                username,
                picture,
                bio
            }
        })
        if (user) {
            const token = jwt.sign(
                {
                    id: user.id,
                    username: user.username,
                    email: user.email
                },
                `${process.env.JWT_SECRET}`
            )
            res.status(201).json({
                message: "user successfully created",
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email
                }
            })
        }
    } catch (error) {
        console.log("error", error);
        res.status(500).json({
            message: "Internal server Error in signup"
        })
    }
}
export const Login = async (req: Request, res: Response) => {
    const validation = LoginSchema.safeParse(req.body);
    if (!validation.success) {
        res.status(400).json({
            message: "login validation failed",
            err: validation.error.format
        })
        return
    }
    try {
        const { email, password } = validation.data
        const user = await prisma.user.findUnique({
            where: { email }
        })
        if (!user) {
            res.status(404).json({
                message: "No user exists with this email, please check your email again"
            })
            return
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            res.status(401).json({
                message: "Incorrect Password, please try again"
            })
            return
        }
        const token = jwt.sign(
            {
                id: user.id,
                username: user.username,
                email: user.email
            },
            `${process.env.JWT_SECRET}`
        )
        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        })


    } catch (error) {
        console.log("error", error);
        res.status(500).json({
            message: "Internal server Error in Login"
        })
    }
}
export const ForgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;
    const userExist = await prisma.user.findUnique({
        where: { email }
    })
    if (!userExist) {
        res.status(401).json({
            message: "No user exists with this email"
        })
        return
    }
    try {
        const token = crypto.randomBytes(20).toString("hex");
        const updateResetToken = await prisma.user.update({
            where: {
                email: email
            },
            data: {
                resetToken: token
            }
        })
        if (!updateResetToken) {
            res.status(500).json({
                message: "Error in saving the token to the database"
            })
        }
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD
            }
        });
        const mailOptions = {
            from: "partiktanwar30402@gmail.com",
            to: email,
            subject: "Password Reset Link - MyBlogs",
            text: `Click the following link to reset your password: ${process.env.VITE_BASE_URL}/reset-password/${token}`
        }
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                res.status(500).send("Error sending email").json({
                    message: "Error sending reset email"
                })
            }
            res.status(200).json({
                message: "Check your email for instructions on resetting your password"
            })
        })
    } catch (error) {
        console.log("error", error);
        res.status(500).json({
            message: "Internal server Error in forgot password"
        })
    }
}
export const ResetPassword = async (req: Request, res: Response) => {
    const { token } = req.params
    if (!token) {
        res.status(400).json({
            message: "no token found"
        })
    }
    try {
        const isValid = await prisma.user.findUnique({
            where: {
                resetToken: token
            }
        })
        if (!isValid) {
            res.status(400).send(
                "token is not valid"
            )
            return
        }
        res.send(`'<form method="post" action="/api/v1/reset-password"><input type="hidden" name="token" value=${token} /><input type="password" name="password" required><input type="submit" value="Reset Password"></form>'`)
    } catch (error) {
        console.log("error", error);
        res.status(500).json({
            message: "Internal server Error in reset password"
        })
    }

}

export const UpdatePassord = async (req: Request, res: Response) => {
    const { token, password } = req.body;

    if (!token) {
        res.status(400).json({
            message: "No token provided"
        });
        return
    }

    if (!password) {
        res.status(400).json({
            message: "No password provided"
        });
        return
    }
    console.log("token", token);
    // console.log("password",password);
    try {
        const theuser = await prisma.user.findFirst({
            where: {
                resetToken: token
            }
        })
        if (!theuser) {
            res.status(404).json({
                message: "no user with this token"
            })
            return
        }
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        const updatePass = await prisma.user.update({
            where: {
                email: theuser.email
            },
            data: {
                password: hashedPassword,
                resetToken: null
            }
        })
        if (!updatePass) {
            res.status(400).send("unable to update new pass").json({
                message: "unable to update new pass"
            })
        }
        res.status(200).json({
            message: "password updated successfully"
        })
    } catch (error) {
        console.log("error", error);
        res.status(500).json({
            message: "Internal server Error in updating the password"
        })
    }

}
