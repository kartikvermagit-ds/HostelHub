import { Router } from 'express';
import { DashboardController } from '../controllers/subject.controller.js';
import { optionalAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', optionalAuth, DashboardController.getDashboard);

export default router;
