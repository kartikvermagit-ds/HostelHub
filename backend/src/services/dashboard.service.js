import { supabaseAdmin } from '../config/supabase.js';
import { CTService } from './ct.service.js';
import { ApiError } from '../utils/apiError.js';
import { logger } from '../utils/logger.js';

export class DashboardService {
  static async getDashboardData() {
    try {
      const [
        upcomingCTs,
        latestResourcesResult,
        popularResourcesResult,
        announcementsResult,
        totalResourcesResult,
        totalUsersResult,
        totalDownloadsResult
      ] = await Promise.all([
        // 1. Upcoming CTs
        CTService.getUpcomingCTs().catch(() => []),

        // 2. Latest Resources
        supabaseAdmin
          .from('resources')
          .select(`
            id, title, description, unit, resource_type, file_name, file_size, mime_type, file_url,
            download_count, view_count, created_at,
            subject:subjects(id, name, code),
            uploaded_by_profile:profiles!resources_uploaded_by_fkey(id, full_name, avatar_url),
            resource_tags(tag:tags(id, name))
          `)
          .order('created_at', { ascending: false })
          .limit(8),

        // 3. Popular Resources
        supabaseAdmin
          .from('resources')
          .select(`
            id, title, description, unit, resource_type, file_name, file_size, mime_type, file_url,
            download_count, view_count, created_at,
            subject:subjects(id, name, code),
            uploaded_by_profile:profiles!resources_uploaded_by_fkey(id, full_name, avatar_url)
          `)
          .order('download_count', { ascending: false })
          .limit(6),

        // 4. Announcements
        supabaseAdmin
          .from('announcements')
          .select(`
            id, title, content, priority, created_at,
            created_by_profile:profiles!announcements_created_by_fkey(id, full_name)
          `)
          .eq('is_published', true)
          .order('created_at', { ascending: false })
          .limit(4),

        // 5. Total Resources Count
        supabaseAdmin.from('resources').select('id', { count: 'exact', head: true }),

        // 6. Total Users Count
        supabaseAdmin.from('profiles').select('id', { count: 'exact', head: true }),

        // 7. Total Downloads Sum
        supabaseAdmin.from('resources').select('download_count'),
      ]);

      const formatTags = (items) =>
        (items || []).map((res) => ({
          ...res,
          tags: (res.resource_tags || []).map((rt) => rt.tag?.name).filter(Boolean),
        }));

      const totalDownloads = (totalDownloadsResult.data || []).reduce(
        (acc, curr) => acc + (curr.download_count || 0),
        0
      );

      return {
        upcomingCTs: upcomingCTs || [],
        latestResources: formatTags(latestResourcesResult.data),
        popularResources: popularResourcesResult.data || [],
        announcements: announcementsResult.data || [],
        stats: {
          totalResources: totalResourcesResult.count || 0,
          totalUsers: totalUsersResult.count || 0,
          totalDownloads: totalDownloads || 0,
        },
      };
    } catch (error) {
      logger.error('Failed to construct dashboard response', error);
      throw ApiError.internal('Failed to load dashboard data', error);
    }
  }
}
