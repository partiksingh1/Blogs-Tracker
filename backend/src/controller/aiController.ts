import { Request, Response } from "express"
import { PrismaClient } from "@prisma/client"
import * as cheerio from 'cheerio';
import { ai } from "../utils/genAi.js";
const prisma = new PrismaClient()
import scrapingbee from 'scrapingbee';
const scrapingbeeKey = process.env.SCRAPEBEE_API_KEY as string
const client  = new scrapingbee.ScrapingBeeClient(scrapingbeeKey)
export const summarize = async (req:Request,res:Response)=>{
    const {url} = req.body;
    const response  = await client.get({
        url: url,
        params: {  
        },
      })
    if(response){
        var decoder = new TextDecoder();
        var text = decoder.decode(response.data);
        const summary = await getAiSummary(text,"summarize this and start with 'this artile/blog is about' ");
        if(summary){
            res.status(200).json({
                message:"successfully summarized",
                summary
            })
            return
        }
    }
}
async function getAiSummary(text:string,prompt:string){
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: `${prompt}${text}`,
        })
        return response.text;
    } catch (error) {
        console.log(error);
        
    }
}

async function fetchContent(url:string){

}

