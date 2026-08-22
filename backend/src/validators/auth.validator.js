import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    full_name: z.string().min(2, 'Full name must be at least 2 characters long'),
    branch: z.string().optional(),
    year: z.number().int().min(1).max(5).optional(),
    hostel: z.string().optional(),
    room_number: z.string().optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});
