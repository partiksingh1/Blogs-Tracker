import express from 'express'
import { summarize } from '../controller/aiController.js';
import { Auth } from '../middleware/middleware.js';


export const aiRouter = express.Router();

aiRouter.post("/summarize",Auth,summarize);