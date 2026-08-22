import { Router } from 'express';
import { SubjectController } from '../controllers/subject.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/role.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { createSubjectSchema } from '../validators/ct.validator.js';

const router = Router();

router.get('/', SubjectController.getAll);
router.post('/', authenticate, requireAdmin, validate(createSubjectSchema), SubjectController.create);

export default router;
