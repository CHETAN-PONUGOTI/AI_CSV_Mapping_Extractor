import 'dotenv/config';

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export class GeminiService {
  static async extractBatch(rawDataArray: any[]): Promise<any[]> {
    try {
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-2.5-flash',
        generationConfig: { responseMimeType: "application/json" }
      });

      const prompt = `
        You are an expert CRM data extractor. 
        Input JSON: ${JSON.stringify(rawDataArray)}
        
        Output a JSON object with a "records" key. The value MUST be an array of objects.
        Each object MUST match these keys exactly:
        - "name": string
        - "email": string (or null)
        - "country_code": string (or null)
        - "mobile_without_country_code": string (or null)
        - "crm_status": "GOOD_LEAD_FOLLOW_UP" | "DID_NOT_CONNECT" | "BAD_LEAD" | "SALE_DONE"
        
        Ensure at least one of "email" or "mobile_without_country_code" is present.
        If data is missing, use null. DO NOT include any extra text.
      `;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const parsed = JSON.parse(text);
      
      return parsed.records || [];
    } catch (error) {
      console.error("Gemini Extraction Error:", error);
      return []; // Returning empty forces the manager to mark these as SKIPPED
    }
  }
}