import { Router } from 'express';
import { importRoutes } from './v1/import.routes';
import { HealthController } from '../controllers/health.controller';

const router = Router();

router.get('/health', HealthController.check);
router.use('/v1/import', importRoutes);

export { router as apiRoutes };