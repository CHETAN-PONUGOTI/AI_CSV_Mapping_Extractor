import { CsvParserService } from './csv.parser.service';
import { GeminiService } from '../infrastructure/ai/gemini.service';
import { prisma } from '../infrastructure/database/prisma.client';
import { chunkArray } from '../utils/chunker';
import { CrmLeadSchema } from '../domain/crm.schema';
import { UploadPreviewResponse } from '../domain/types';

export class ImportManager {
  static async createPreviewBatch(buffer: Buffer, fileName: string): Promise<UploadPreviewResponse> {
    const rawRows = await CsvParserService.parseBuffer(buffer);
    
    const batch = await prisma.importBatch.create({
      data: { fileName, totalRows: rawRows.length, status: 'PENDING_CONFIRMATION' }
    });

    const recordsToInsert = rawRows.map(row => ({
      batchId: batch.id,
      originalData: JSON.stringify(row),
      status: 'PENDING'
    }));

    await prisma.leadRecord.createMany({ data: recordsToInsert });

    return {
      batchId: batch.id,
      totalRows: rawRows.length,
      previewRows: rawRows.slice(0, 5) 
    };
  }

  static async processConfirmedBatch(batchId: string): Promise<void> {
    await prisma.importBatch.update({
      where: { id: batchId },
      data: { status: 'PROCESSING' }
    });

    const pendingRecords = await prisma.leadRecord.findMany({
      where: { batchId, status: 'PENDING' }
    });

    const chunks = chunkArray(pendingRecords, 50); 
    let processed = 0;
    let skipped = 0;

    for (const chunk of chunks) {
      try {
        const rawDataArray = chunk.map(r => JSON.parse(r.originalData));
        const extracted = await GeminiService.extractBatch(rawDataArray);
        
        for (let i = 0; i < chunk.length; i++) {
          const dbRecord = chunk[i];
          const mapped = extracted[i];
          const validation = CrmLeadSchema.safeParse(mapped);
          
          if (validation.success) {
            await prisma.leadRecord.update({
              where: { id: dbRecord.id },
              data: { parsedData: JSON.stringify(validation.data), status: 'SUCCESS' }
            });
            processed++;
          } else {
            await prisma.leadRecord.update({
              where: { id: dbRecord.id },
              data: { status: 'SKIPPED', errorMessage: 'Validation failed or missing key fields' }
            });
            skipped++;
          }
        }
      } catch (error) {
        for (const dbRecord of chunk) {
          await prisma.leadRecord.update({
            where: { id: dbRecord.id },
            data: { status: 'FAILED', errorMessage: error instanceof Error ? error.message : 'AI Error' }
          });
          skipped++;
        }
      }

      await prisma.importBatch.update({
        where: { id: batchId },
        data: { processedRows: processed, skippedRows: skipped }
      });
    }

    await prisma.importBatch.update({
      where: { id: batchId },
      data: { status: 'COMPLETED' }
    });
  }
}