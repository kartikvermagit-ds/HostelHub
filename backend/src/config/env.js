import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('5000').transform((val) => parseInt(val, 10)),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  API_PREFIX: z.string().default('/api/v1'),
  FRONTEND_URL: z.string().default('http://localhost:3000'),

  // Supabase Configuration
  SUPABASE_URL: z.string().url().default('https://mock-project-id.supabase.co'),
  SUPABASE_ANON_KEY: z.string().default('mock-anon-key'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().default('mock-service-role-key'),
  SUPABASE_STORAGE_BUCKET: z.string().default('hostelhub-resources'),

  // Storage Limits (in bytes)
  MAX_PDF_SIZE: z.string().default('20971520').transform((val) => parseInt(val, 10)),     // 20 MB
  MAX_IMAGE_SIZE: z.string().default('10485760').transform((val) => parseInt(val, 10)),   // 10 MB
  MAX_VIDEO_SIZE: z.string().default('104857600').transform((val) => parseInt(val, 10)),  // 100 MB

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.string().default('900000').transform((val) => parseInt(val, 10)),
  RATE_LIMIT_MAX: z.string().default('300').transform((val) => parseInt(val, 10)),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables configuration:', parsedEnv.error.format());
  throw new Error('Invalid environment configuration');
}

export const env = parsedEnv.data;
