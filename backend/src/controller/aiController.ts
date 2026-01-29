import { Request, Response } from "express"
import { PrismaClient } from "@prisma/client"
import * as cheerio from 'cheerio';
import { ai } from "../utils/genAi.js";
const prisma = new PrismaClient()
import scrapingbee from 'scrapingbee';
const scrapingbeeKey = process.env.SCRAPEBEE_API_KEY as string
const client = new scrapingbee.ScrapingBeeClient(scrapingbeeKey)
async function getAiSummary(text: string): Promise<string> {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-lite",
            contents: [
                {
                    role: "user",
                    parts: [
                        { text: "Summarize the following article in detail." },
                        { text }
                    ]
                }
            ]
        });

        if (!response.text) throw new Error("AI returned empty response");
        return response.text;

    } catch (err: any) {
        // Wrap any non-Error into Error
        if (err instanceof Error) throw err;
        throw new Error(err?.message || "AI request failed");
    }
}

export const fetchContent = async (req: Request, res: Response): Promise<any> => {
    const { url } = req.body;

    if (!url || typeof url !== "string") {
        return res.status(400).json({ message: "Invalid URL" });
    }

    try {
        const response = await client.get({
            url,
            params: {
                render_js: false,
                block_resources: true,
                timeout: 15000
            }
        });

        const html = new TextDecoder().decode(response.data);
        const $ = cheerio.load(html);

        const title = $("title").text() || "Untitled";
        const description = $('meta[name="description"]').attr("content") || "";

        const content = extractMainContent($);
        if (!content) {
            return res.status(422).json({ message: "No readable content found" });
        }

        const summary = await getAiSummary(content);

        return res.json({
            title,
            description,
            summary,
            url
        });

    } catch (error) {
        console.error("Error summarizing:", error);

        return res.status(500).json({
            message: "Error processing URL",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};


// ✅ Extract main article content using simple heuristics
function extractMainContent($: cheerio.CheerioAPI): string {
    const candidates = [
        "article",
        "[role=main]",
        ".content",
        ".post",
        ".entry-content",
        "main"
    ];

    for (const selector of candidates) {
        const text = $(selector).text();
        if (text && text.length > 500) {
            return cleanText(text);
        }
    }

    return cleanText($("body").text());
}

function cleanText(text: string): string {
    return text
        .replace(/\s+/g, " ")
        .replace(/(cookie|privacy|subscribe)/gi, "")
        .trim()
        .slice(0, 5000);
}
// fetchContent is an API endpoint that:

// Accepts a URL from the client

// Fetches the page using ScrapingBee (bypasses bot protection)

// Parses HTML with Cheerio

// Extracts:

// <title>

// meta description

// main article text

// Sends extracted text to Gemini AI