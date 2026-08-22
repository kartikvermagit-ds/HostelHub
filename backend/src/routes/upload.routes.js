import { Router } from 'express';
import multer from 'multer';
import { UploadController } from '../controllers/upload.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { presignedUrlSchema } from '../validators/upload.validator.js';
import { uploadRateLimiter } from '../middleware/rateLimit.middleware.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB max limit
});

const router = Router();

// Presigned upload URL generator for large client direct uploads
router.post('/signed-url', authenticate, uploadRateLimiter, validate(presignedUrlSchema), UploadController.getSignedUploadUrl);

// Direct multipart upload via Express buffer
router.post('/direct', authenticate, uploadRateLimiter, upload.single('file'), UploadController.directUpload);

export default router;
