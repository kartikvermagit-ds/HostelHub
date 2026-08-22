import { z } from 'zod';

export const createCommentSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid resource ID'),
  }),
  body: z.object({
    content: z.string().min(1, 'Comment cannot be empty').max(1000),
  }),
});

export const updateCommentSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid comment ID'),
  }),
  body: z.object({
    content: z.string().min(1, 'Comment cannot be empty').max(1000),
  }),
});
