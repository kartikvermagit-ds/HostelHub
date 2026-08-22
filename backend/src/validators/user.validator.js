import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z.object({
    full_name: z.string().min(2).optional(),
    avatar_url: z.string().url().optional().nullable(),
    branch: z.string().optional().nullable(),
    year: z.number().int().min(1).max(5).optional().nullable(),
    hostel: z.string().optional().nullable(),
    room_number: z.string().optional().nullable(),
    bio: z.string().max(500).optional().nullable(),
  }),
});
