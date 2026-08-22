import { Router } from 'express';
import { CommentController } from '../controllers/comment.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { updateCommentSchema } from '../validators/comment.validator.js';

const router = Router();

router.patch('/:id', authenticate, validate(updateCommentSchema), CommentController.updateComment);
router.delete('/:id', authenticate, CommentController.deleteComment);

export default router;
