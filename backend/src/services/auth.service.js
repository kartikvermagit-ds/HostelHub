import { supabase, supabaseAdmin } from '../config/supabase.js';
import { ApiError } from '../utils/apiError.js';
import { logger } from '../utils/logger.js';

export class AuthService {
  static async register({ email, password, full_name, branch, year, hostel, room_number }) {
    // 1. Sign up user via Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
        },
      },
    });

    if (authError || !authData.user) {
      logger.error('Supabase Auth registration failed', authError);
      throw ApiError.badRequest(authError?.message || 'Registration failed');
    }

    const authUserId = authData.user.id;

    // 2. Create corresponding profile record in public.profiles table
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert({
        auth_user_id: authUserId,
        email,
        full_name,
        branch: branch || null,
        year: year || null,
        hostel: hostel || null,
        room_number: room_number || null,
        role: 'STUDENT',
      })
      .select()
      .single();

    if (profileError) {
      logger.error('Profile creation failed after auth signup', profileError);
      throw ApiError.internal('Account created but profile setup failed', profileError);
    }

    return {
      user: {
        id: profile.id,
        auth_user_id: authUserId,
        email: profile.email,
        full_name: profile.full_name,
        role: profile.role,
        branch: profile.branch,
        year: profile.year,
        hostel: profile.hostel,
        room_number: profile.room_number,
      },
      session: authData.session,
    };
  }

  static async login({ email, password }) {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      logger.warn(`Failed login attempt for email: ${email}`);
      throw ApiError.unauthorized('Invalid email or password');
    }

    // Load profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('auth_user_id', authData.user.id)
      .single();

    if (profileError || !profile) {
      throw ApiError.notFound('User profile not found for this account');
    }

    return {
      user: {
        id: profile.id,
        auth_user_id: authData.user.id,
        email: profile.email,
        full_name: profile.full_name,
        role: profile.role,
        avatar_url: profile.avatar_url,
        branch: profile.branch,
        year: profile.year,
        hostel: profile.hostel,
        room_number: profile.room_number,
        bio: profile.bio,
      },
      session: authData.session,
    };
  }

  static async logout(accessToken) {
    if (accessToken) {
      await supabase.auth.admin.signOut(accessToken).catch(() => {});
    }
    return true;
  }
}
