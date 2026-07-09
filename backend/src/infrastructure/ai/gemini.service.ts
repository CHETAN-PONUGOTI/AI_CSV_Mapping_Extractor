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
          temperature: 0
        }
      });

      const prompt = `
        You are an expert CRM data extractor. 
        Input JSON: ${JSON.stringify(rawDataArray)}
        
        Output a JSON object with a "records" key containing an array of extracted objects.
        Extract as many of the following fields as possible from the provided raw data. 
        
        Follow these strict rules:
        1. "crm_status": Must be one of: "GOOD_LEAD_FOLLOW_UP", "DID_NOT_CONNECT", "BAD_LEAD", "SALE_DONE".
        2. "data_source": Must be one of: "leads_on_demand", "meridian_tower", "eden_park", "varah_swamy", "sarjapur_plots". If none match confidently, leave it null.
        3. "created_at": Must be a valid ISO-8601 datetime string convertible by JavaScript's new Date().
        4. Multiple Contacts: If multiple emails exist, put the first in "email" and append the rest to "crm_note". If multiple phone numbers exist, put the first in "mobile_without_country_code" and append the rest to "crm_note".
        5. "crm_note": Use this for remarks, follow-up notes, extra contact info, and useful info that doesn't fit elsewhere.
        
        Schema for each object:
        - created_at (string or null)
        - name (string or null)
        - email (string or null)
        - country_code (string or null)
        - mobile_without_country_code (string or null)
        - company (string or null)
        - city (string or null)
        - state (string or null)
        - country (string or null)
        - lead_owner (string or null)
        - crm_status (string or null)
        - crm_note (string or null)
        - data_source (string or null)
        - possession_time (string or null)
        - description (string or null)
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
