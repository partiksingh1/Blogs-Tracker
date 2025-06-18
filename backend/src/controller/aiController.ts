import { Request, Response } from "express"
import { PrismaClient } from "@prisma/client"
import * as cheerio from 'cheerio';
import { ai } from "../utils/genAi.js";
const prisma = new PrismaClient()
import scrapingbee from 'scrapingbee';
const scrapingbeeKey = process.env.SCRAPEBEE_API_KEY as string
const client = new scrapingbee.ScrapingBeeClient(scrapingbeeKey)
export const summarize = async (req: Request, res: Response) => {
    const { url } = req.body;
    const response = await client.get({
        url: url,
        params: {
        },
    })
    if (response) {
        var decoder = new TextDecoder();
        var text = decoder.decode(response.data);
        const summary = await getAiSummary(text, "summarize this and start with 'this artile/blog is about' ");
        if (summary) {
            res.status(200).json({
                message: "successfully summarized",
                summary
            })
            return
        }
    }
}
async function getAiSummary(text: string, prompt: string) {
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

export const fetchContent = async (req: Request, res: Response) => {
    const { url } = req.body;
    try {
        const response = await client.get({ url });
        if (!response) {
            res.status(500).json({ message: "Failed to fetch page" });
            return
        }
        const decoder = new TextDecoder();
        const html = decoder.decode(response.data);
        const $ = cheerio.load(html);
        const title = $("title").text() || "Untitled";
        const description =
            $('meta[name="description"]').attr("content") || "";
        const bodyText = extractMainContent($);
        const tags = await getAiSummary(bodyText, "Suggest 3 to 5 tags for this content, comma-separated: ");
        res.status(200).json({
            message: "Successfully summarized",
            data: {
                title,
                description,
                tags: tags?.split(',').map(tag => tag.trim()).filter(Boolean),
                url,
            },
        });
    } catch (error) {
        console.error("Error summarizing:", error);
        res.status(500).json({ message: "Error processing URL", error });
    }

}

// ✅ Extract main article content using simple heuristics
function extractMainContent($: cheerio.CheerioAPI): string {
    // Try common article containers first
    const article =
        $("article").text() ||
        $("#main").text() ||
        $(".main-content").text() ||
        $("body").text();

    return article.replace(/\s+/g, " ").trim().slice(0, 4000); // Limit length for AI
}

