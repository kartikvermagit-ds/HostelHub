import { supabaseAdmin } from '../config/supabase.js';
import { ApiError } from '../utils/apiError.js';
import { logger } from '../utils/logger.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiError.unauthorized('Authentication token is required');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw ApiError.unauthorized('Invalid authorization header format');
    }

    // Verify token with Supabase Auth
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      logger.warn(`Authentication failed for token: ${authError?.message || 'User not found'}`);
      throw ApiError.unauthorized('Invalid or expired authentication token');
    }

    // Fetch user profile from database
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('auth_user_id', user.id)
      .single();

    if (profileError || !profile) {
      // Auto-create or handle missing profile gracefully if newly registered
      const { data: newProfile, error: insertError } = await supabaseAdmin
        .from('profiles')
        .insert({
          auth_user_id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.email.split('@')[0],
          role: 'STUDENT',
        })
        .select()
        .single();

      if (insertError || !newProfile) {
        throw ApiError.unauthorized('User profile could not be loaded');
      }

      req.user = user;
      req.profile = newProfile;
      return next();
    }

    req.user = user;
    req.profile = profile;
    return next();
  } catch (error) {
    return next(error);
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null;
      req.profile = null;
      return next();
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      req.user = null;
      req.profile = null;
      return next();
    }

    const { data: { user } } = await supabaseAdmin.auth.getUser(token);

    if (user) {
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('auth_user_id', user.id)
        .single();

      req.user = user;
      req.profile = profile || null;
    } else {
      req.user = null;
      req.profile = null;
    }

    return next();
  } catch {
    req.user = null;
    req.profile = null;
    return next();
  }
};
