import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { OAuth2Client } from "google-auth-library";
import { prisma } from "../config/db.js";
dotenv.config();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const createToken = (user: { id: string; username: string; email: string }) => {
    return jwt.sign(user, process.env.JWT_SECRET as string, { expiresIn: "7d" });
};

// ---------------- GOOGLE LOGIN ----------------
export const LoginWithGoogle = async (req: Request, res: Response): Promise<void> => {
    try {
        const { credential } = req.body;

        if (!credential) {
            res.status(400).json({ message: "Google credential is required" });
            return
        }

        // Verify Google token
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();

        if (!payload || !payload.email) {
            res.status(401).json({ message: "Invalid Google token" });
            return
        }

        const email = payload.email;
        const username = payload.name || email.split("@")[0];
        const picture = payload.picture || null;

        // Find or create user
        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    email,
                    username,
                    picture,
                    provider: "google"
                }
            });
        }

        // Create JWT
        const token = createToken({
            id: user.id,
            email: user.email,
            username: user.username
        });

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                picture: user.picture
            }
        });
        return
    } catch (error) {
        console.error("Google login error:", error);
        res.status(500).json({ message: "Internal server error during login" });
        return
    }
};