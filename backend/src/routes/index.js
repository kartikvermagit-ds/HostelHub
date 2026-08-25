import { Router } from 'express';
import { HealthController } from '../controllers/subject.controller.js';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import resourceRoutes from './resource.routes.js';
import uploadRoutes from './upload.routes.js';
import commentRoutes from './comment.routes.js';
import ctRoutes from './ct.routes.js';
import announcementRoutes from './announcement.routes.js';
import subjectRoutes from './subject.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import hostelRoutes from './hostel.routes.js';

const router = Router();

// Health Check
router.get('/health', HealthController.check);

// Feature Sub-Routers
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/resources', resourceRoutes);
router.use('/uploads', uploadRoutes);
router.use('/comments', commentRoutes);
router.use('/cts', ctRoutes);
router.use('/announcements', announcementRoutes);
router.use('/subjects', subjectRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/hostels', hostelRoutes);


export default router;
