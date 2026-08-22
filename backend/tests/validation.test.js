import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Auth & Resource Validation API', () => {
  it('POST /api/v1/auth/register with invalid email should return 422 validation error', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: 'not-an-email',
        password: 'short',
        full_name: 'A',
      });

    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(Array.isArray(res.body.error.details)).toBe(true);
  });

  it('POST /api/v1/auth/login with empty password should return 422 validation error', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'test@hostel.edu',
        password: '',
      });

    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('POST /api/v1/resources without auth token should return 401 unauthorized', async () => {
    const res = await request(app)
      .post('/api/v1/resources')
      .send({
        title: 'Sample Notes',
        subject_id: '11111111-1111-1111-1111-111111111111',
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });
});
