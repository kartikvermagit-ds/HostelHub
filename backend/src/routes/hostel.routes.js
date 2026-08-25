import express from 'express';
import {
  getHostels,
  getHostelById,
  createHostel,
  updateHostel,
  deleteHostel,
  getHostelRooms
} from '../controllers/hostel.controller.js';
import { authenticateUser, requireAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes for students to view 3D digital twins
router.get('/', getHostels);
router.get('/:id', getHostelById);
router.get('/:id/rooms', getHostelRooms);

// Admin-only management endpoints
router.post('/', authenticateUser, requireAdmin, createHostel);
router.patch('/:id', authenticateUser, requireAdmin, updateHostel);
router.delete('/:id', authenticateUser, requireAdmin, deleteHostel);

export default router;
