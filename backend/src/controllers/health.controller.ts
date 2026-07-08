import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { prisma } from '../infrastructure/database/prisma.client';

export class HealthController {
  static async check(req: Request, res: Response): Promise<void> {
    try {
      await prisma.$queryRaw`SELECT 1`;
      res.status(StatusCodes.OK).json({ status: 'UP', database: 'CONNECTED' });
    } catch (error) {
      res.status(StatusCodes.SERVICE_UNAVAILABLE).json({ status: 'DOWN', database: 'DISCONNECTED' });
    }
  }
}