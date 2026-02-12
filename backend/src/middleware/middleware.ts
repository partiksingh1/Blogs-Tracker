import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const Auth = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const authHeader = req.header("Authorization");

        if (!authHeader) {
            res.status(401).json({ message: "Authorization header missing" });
            return; // just return, don't return res
        }

        const parts = authHeader.split(" ");
        if (parts.length !== 2 || parts[0] !== "Bearer") {
            res.status(401).json({ message: "Authorization header must be 'Bearer <token>'" });
            return;
        }

        const token = parts[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET!);

        // Attach decoded payload
        (req as any).user = decoded;

        next(); // ✅ call next
    } catch (error: any) {
        console.error("JWT verification error:", error);

        if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
            res.status(401).json({ message: "Invalid or expired token" });
            return;
        }

        res.status(500).json({ message: "Server error during token verification" });
    }
};
