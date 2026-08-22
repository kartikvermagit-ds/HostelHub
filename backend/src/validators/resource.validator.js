import { z } from 'zod';

export const resourceTypeEnum = z.enum([
  'NOTES',
  'PYQ',
  'IMPORTANT_QUESTIONS',
  'VIDEO',
  'IMAGE',
  'OTHER'
]);

export const createResourceSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters long').max(200),
    description: z.string().max(2000).optional(),
    subject_id: z.string().uuid('Invalid subject ID'),
    unit: z.number().int().min(1).max(10).optional().nullable(),
    resource_type: resourceTypeEnum.default('NOTES'),
    file_name: z.string().min(1, 'File name is required'),
    file_path: z.string().min(1, 'File path is required'),
    file_url: z.string().url('File URL must be a valid URL'),
    file_size: z.number().int().positive('File size must be positive'),
    mime_type: z.string().min(1, 'MIME type is required'),
    thumbnail_url: z.string().url().optional().nullable(),
    tags: z.array(z.string().min(1).max(50)).optional(),
  }),
});

export const updateResourceSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid resource ID'),
  }),
  body: z.object({
    title: z.string().min(3).max(200).optional(),
    description: z.string().max(2000).optional(),
    subject_id: z.string().uuid().optional(),
    unit: z.number().int().min(1).max(10).optional().nullable(),
    resource_type: resourceTypeEnum.optional(),
    tags: z.array(z.string().min(1).max(50)).optional(),
  }),
});

export const listResourcesSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    subject: z.string().optional(),
    subject_id: z.string().uuid().optional(),
    unit: z.string().optional(),
    type: resourceTypeEnum.optional(),
    sort: z.enum(['latest', 'popular', 'downloads', 'views']).default('latest'),
  }),
});

export const searchResourcesSchema = z.object({
  query: z.object({
    q: z.string().min(1, 'Search query is required'),
    page: z.string().optional(),
    limit: z.string().optional(),
    subject: z.string().optional(),
    subject_id: z.string().uuid().optional(),
    unit: z.string().optional(),
    resource_type: resourceTypeEnum.optional(),
    sort: z.enum(['latest', 'popular', 'relevance']).default('relevance'),
  }),
});
