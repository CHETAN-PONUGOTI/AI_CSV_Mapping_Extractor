import { Router } from 'express';
// Fix 1: Import the instance (lowercase 'u') we exported in the controller
import { uploadController } from '../../controllers/upload.controller'; 
import { upload } from '../../middleware/upload.middleware';

const router = Router();

// Fix 2: Point to the new, all-in-one upload method
router.post('/upload', upload.single('file'), uploadController.uploadFile);

// Fix 3: Point to the status mock endpoint we created
router.get('/:id/status', uploadController.getStatus);

// (Optional) Fix 4: If your frontend still expects to hit these endpoints, 
// we provide dummy responses so it doesn't crash with a 404. 
// If your frontend doesn't use them anymore, you can safely delete these two lines.
router.post('/:id/confirm', (req, res) => { res.json({ success: true }) });
router.get('/:id/results', (req, res) => { res.json({ data: [] }) });

export { router as importRoutes };