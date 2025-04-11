import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const Auth = async (req: Request, res: Response, next: NextFunction) => {
    const token = (req.header("Authorization")?.replace("Bearer", ''))
    if (!token) {
        res.status(403).json({
            message: "No token, pass the token"
        })
        return
    }

    try {
        const decoded = jwt.verify(token as string, `${process.env.JWT_SECRET}`)
        if (!decoded) {
            res.status(401).json({
                message: "Access denied, invalid token"
            })
        }
        else{
            next();
        }
    } catch (error) {
         res.status(500).json({
            message: "Server error during token verification",
        });
    }
}