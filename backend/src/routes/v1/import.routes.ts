import { Router } from 'express';
import { UploadController } from '../../controllers/upload.controller';
import { upload } from '../../middleware/upload.middleware';

const router = Router();

router.post('/upload', upload.single('file'), UploadController.uploadAndPreview);
router.post('/:id/confirm', UploadController.confirmAndProcess);
router.get('/:id/status', UploadController.getBatchStatus);
router.get('/:id/results', UploadController.getBatchResults);

export { router as importRoutes };