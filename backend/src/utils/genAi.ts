import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();
export const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
// const response = await ai.models.generateContent({
//     model: 'gemini-2.5-flash-lite',
//     contents: 'why is the sky blue?',
//     config: {
//         candidateCount: 2,
//     }
// });
// console.log(response);