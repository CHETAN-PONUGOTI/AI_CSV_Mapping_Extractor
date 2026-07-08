import { CrmLeadSchema, AiBatchResponseSchema } from '../domain/crm.schema';
import { CsvParserService } from './csv.parser.service';
import { GeminiService } from '../infrastructure/ai/gemini.service';
import { logger } from '../utils/logger';

export class ImportManager {
  async processImport(fileBuffer: Buffer) {
    try {
      // 1. Parse CSV
      const rawData = await CsvParserService.parseBuffer(fileBuffer);
      
      // 2. Map data using AI
      const aiResponse = await GeminiService.extractBatch(rawData);
      
      // 3. Validate AI response
      const parsedData = AiBatchResponseSchema.safeParse(aiResponse);
      
      if (!parsedData.success) {
        logger.error("AI response failed schema validation", parsedData.error.format());
        throw new Error("Invalid format returned from AI mapping");
      }

      const results = {
        successCount: 0,
        skippedCount: 0,
        data: [] as any[]
      };

      // 4. Validate each record with detailed logging
      for (const record of parsedData.data.records) {
        const validation = CrmLeadSchema.safeParse(record);
        
        if (validation.success) {
          results.successCount++;
          results.data.push(validation.data);
        } else {
          results.skippedCount++;
          // CRITICAL: Log exact Zod errors to Render backend logs
          logger.warn("Skipping invalid record:", {
            error: validation.error.format(),
            record: record
          });
        }
      }

      return results;
    } catch (error) {
      logger.error("Import process failed:", error);
      throw error;
    }
  }
}

export const importManager = new ImportManager();