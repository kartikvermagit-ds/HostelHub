import { z } from 'zod';

export const presignedUrlSchema = z.object({
  body: z.object({
    fileName: z.string().min(1, 'File name is required'),
    fileType: z.string().min(1, 'MIME type is required'),
    fileSize: z.number().int().positive('File size must be positive'),
    category: z.enum(['pdf', 'image', 'video', 'other']).default('pdf'),
  }),
});
