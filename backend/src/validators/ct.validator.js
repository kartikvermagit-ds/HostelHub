import { z } from 'zod';

export const createCTSchema = z.object({
  body: z.object({
    subject_id: z.string().uuid('Invalid subject ID'),
    title: z.string().min(3).max(150),
    description: z.string().max(1000).optional(),
    exam_date: z.string().datetime({ message: 'Exam date must be a valid ISO 8601 string' }),
    resource_ids: z.array(z.string().uuid()).optional(),
  }),
});

export const updateCTSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid CT ID'),
  }),
  body: z.object({
    subject_id: z.string().uuid().optional(),
    title: z.string().min(3).max(150).optional(),
    description: z.string().max(1000).optional(),
    exam_date: z.string().datetime().optional(),
  }),
});

export const createAnnouncementSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(200),
    content: z.string().min(5).max(5000),
    priority: z.enum(['NORMAL', 'IMPORTANT', 'URGENT']).default('NORMAL'),
    is_published: z.boolean().default(true),
  }),
});

export const createSubjectSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100),
    code: z.string().min(2).max(20).toUpperCase(),
    description: z.string().max(500).optional(),
  }),
});
