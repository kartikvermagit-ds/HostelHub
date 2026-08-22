import { supabaseAdmin } from './supabase.js';
import { logger } from '../utils/logger.js';

export const checkDatabaseConnection = async () => {
  try {
    const { data, error } = await supabaseAdmin.from('subjects').select('count', { count: 'exact', head: true });
    if (error && error.code !== 'PGRST116') {
      logger.warn(`Database connection check returned notice: ${error.message}`);
      return false;
    }
    logger.info('Database connection successfully established with Supabase.');
    return true;
  } catch (err) {
    logger.warn(`Database health check unreachable: ${err.message}`);
    return false;
  }
};
