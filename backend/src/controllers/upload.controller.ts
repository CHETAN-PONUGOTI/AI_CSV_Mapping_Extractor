import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { importManager } from '../services/import.manager';
import { logger } from '../utils/logger';

export class UploadController {
  
  // Single endpoint to handle the entire file upload and processing
  async uploadFile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const file = req.file;

      if (!file) {
        res.status(StatusCodes.BAD_REQUEST).json({ error: 'No file uploaded' });
        return;
      }

      logger.info(`Processing uploaded file: ${file.originalname}`);

      // Pass the file buffer to the new simplified processImport method
      const results = await importManager.processImport(file.buffer);

      // Return the final results directly to the frontend
      res.status(StatusCodes.OK).json({
        message: 'Import processed successfully',
        data: results
      });

    } catch (error) {
      logger.error('Error during file upload processing:', error);
      next(error); // Pass to the global error handler
    }
  }

  // If your frontend still expects a status endpoint, you can return a simple mock
  // Or remove this entirely if you are no longer using long-polling.
  async getStatus(req: Request, res: Response): Promise<void> {
    const { batchId } = req.params;
    res.status(StatusCodes.OK).json({ 
      batchId, 
      status: 'COMPLETED',
      progress: 100
    });
  }
}

export const uploadController = new UploadController();