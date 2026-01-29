import express from 'express';
import { fetchContent } from '../controller/aiController.js';
import { Auth } from '../middleware/middleware.js';

export const aiRouter = express.Router();

// Async wrapper to catch all errors
const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

aiRouter.post("/fetchContent", Auth, asyncHandler(fetchContent));
