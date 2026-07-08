import 'dotenv/config';

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export class GeminiService {
  static async extractBatch(rawDataArray: any[]): Promise<any[]> {
    try {
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-2.5-flash',
        generationConfig: { 
          responseMimeType: "application/json",
          // CRITICAL: Force deterministic output for data extraction
          temperature: 0, 
          topK: 1,
          topP: 0.1
        }
      });

      // Pass the exact length into the prompt to prevent the LLM from skipping rows
      const expectedLength = rawDataArray.length;

      const prompt = `
        You are an expert CRM data extractor. 
        Input JSON: ${JSON.stringify(rawDataArray)}
        
        CRITICAL INSTRUCTIONS:
        1. Output a JSON object with a "records" key.
        2. The "records" array MUST contain EXACTLY ${expectedLength} objects. Do not skip any rows.
        3. Each object MUST match these keys exactly:
        - "name": string (or null)
        - "email": string (or null)
        - "country_code": string (or null)
        - "mobile_without_country_code": string (or null)
        - "crm_status": "GOOD_LEAD_FOLLOW_UP" | "DID_NOT_CONNECT" | "BAD_LEAD" | "SALE_DONE"
        
        Ensure at least one of "email" or "mobile_without_country_code" is present.
        If data is missing, use null. DO NOT include any extra text or markdown formatting.
      `;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      
      try {
        const parsed = JSON.parse(text);
        return parsed.records || [];
      } catch (parseError) {
        // Log the raw text so you can see exactly how the LLM hallucinated the JSON
        console.error("🚨 JSON Parsing Failed! Raw LLM Output:", text);
        return []; 
      }

    } catch (error) {
      console.error("Gemini API Error:", error);
      return []; 
    }
  }
}