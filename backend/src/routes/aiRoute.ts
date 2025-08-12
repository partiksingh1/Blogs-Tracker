import express from 'express'
import { fetchContent, summarize } from '../controller/aiController.js';
import { Auth } from '../middleware/middleware.js';


export const aiRouter = express.Router();

aiRouter.post("/summarize", Auth, summarize);
aiRouter.post("/fetchContent", Auth, fetchContent);