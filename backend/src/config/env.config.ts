import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('8080'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string(),
  GEMINI_API_KEY: z.string(),
  MAX_UPLOAD_SIZE_MB: z.coerce.number().default(50),
});

export const env = envSchema.parse(process.env);