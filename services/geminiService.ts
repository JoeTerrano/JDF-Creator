
import { GoogleGenAI, Type } from "@google/genai";
import type { JdfData } from '../types';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        jobName: { type: Type.STRING, description: 'A descriptive name for the print job, often derived from the document title or filename.' },
        pageCount: { type: Type.INTEGER, description: 'The total number of pages in the document.' },
        width: { type: Type.NUMBER, description: 'The width of the page.' },
        height: { type: Type.NUMBER, description: 'The height of the page.' },
        units: { type: Type.STRING, description: 'The measurement unit for width and height. Can be "points", "inches", or "mm". Default to points if unsure.' },
        colorIntent: { type: Type.STRING, description: 'The primary color space of the document, e.g., "CMYK", "RGB", or "Grayscale".' },
        quantity: { type: Type.INTEGER, description: 'The number of copies to be printed. Default to 1 if not specified in the document.' },
        paperType: { type: Type.STRING, description: 'The recommended paper stock if mentioned (e.g., "100lb Gloss Text"). Default to "Not specified".' },
        finishingInstructions: { type: Type.STRING, description: 'Any binding, cutting, or folding instructions mentioned in the document. Default to "None".' },
    },
    required: ["jobName", "pageCount", "width", "height", "units", "colorIntent", "quantity", "paperType", "finishingInstructions"]
};


export const analyzePdfForJdf = async (base64Pdf: string, fileName: string): Promise<JdfData> => {
    try {
        const prompt = `Analyze this PDF file named "${fileName}" for a print production workflow. Extract the job specifications according to the provided schema.
- Infer the jobName from the filename or document title if not explicitly stated.
- Determine page dimensions accurately. If multiple page sizes exist, use the most common one. Default to points (pt) for units.
- Identify the primary color space.
- If a quantity is mentioned in the text (e.g., "Print 500 copies"), extract it. Otherwise, default to 1.
- Extract any mentions of paper type or finishing processes like "binding", "folding", or "trimming". If none are found, use the default values.`;

        const pdfPart = {
            inlineData: {
                data: base64Pdf,
                mimeType: 'application/pdf',
            },
        };
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [{ text: prompt }, pdfPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });
        
        const text = response.text.trim();
        const parsedJson = JSON.parse(text);

        // A quick validation to ensure the object structure is as expected.
        if (typeof parsedJson.jobName !== 'string' || typeof parsedJson.pageCount !== 'number') {
            throw new Error("Received malformed data from API");
        }

        // Gemini might return a generic color string, let's normalize it
        const color = parsedJson.colorIntent.toUpperCase();
        let colorIntent: JdfData['colorIntent'] = 'Other';
        if (color.includes('CMYK')) colorIntent = 'CMYK';
        else if (color.includes('RGB')) colorIntent = 'RGB';
        else if (color.includes('GRAY') || color.includes('GREY')) colorIntent = 'Grayscale';

        return {
            ...parsedJson,
            colorIntent: colorIntent,
            // Ensure quantity is at least 1
            quantity: Math.max(1, parsedJson.quantity || 1)
        };

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to analyze PDF with Gemini. Please check the console for details.");
    }
};
