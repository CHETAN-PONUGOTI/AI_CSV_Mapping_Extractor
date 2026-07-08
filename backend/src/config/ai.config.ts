import { GoogleGenAI } from '@google/genai';
import { env } from './env.config';

export const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });