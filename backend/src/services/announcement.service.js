import { supabaseAdmin } from '../config/supabase.js';
import { ApiError } from '../utils/apiError.js';
import { getPaginationParams, buildPaginationMetadata } from '../utils/pagination.js';

export class AnnouncementService {
  static async getAllAnnouncements(query, isAdmin = false) {
    const { page, limit, rangeFrom, rangeTo } = getPaginationParams(query);

    let queryBuilder = supabaseAdmin
      .from('announcements')
      .select(`
        id, title, content, priority, is_published, created_at, updated_at,
        created_by_profile:profiles!announcements_created_by_fkey(id, full_name, role)
      `, { count: 'exact' });

    if (!isAdmin) {
      queryBuilder = queryBuilder.eq('is_published', true);
    }

    queryBuilder = queryBuilder.order('created_at', { ascending: false }).range(rangeFrom, rangeTo);

    const { data: announcements, error, count } = await queryBuilder;

    if (error) {
      throw ApiError.internal('Failed to retrieve announcements', error);
    }

    return {
      items: announcements || [],
      pagination: buildPaginationMetadata(page, limit, count || 0),
    };
  }

  static async getAnnouncementById(id) {
    const { data: announcement, error } = await supabaseAdmin
      .from('announcements')
      .select(`
        id, title, content, priority, is_published, created_at, updated_at,
        created_by_profile:profiles!announcements_created_by_fkey(id, full_name, role)
      `)
      .eq('id', id)
      .single();

    if (error || !announcement) {
      throw ApiError.notFound('Announcement not found');
    }

    return announcement;
  }

  static async createAnnouncement(data, createdByProfileId) {
    const { data: announcement, error } = await supabaseAdmin
      .from('announcements')
      .insert({
        ...data,
        created_by: createdByProfileId,
      })
      .select(`
        id, title, content, priority, is_published, created_at,
        created_by_profile:profiles!announcements_created_by_fkey(id, full_name, role)
      `)
      .single();

    if (error) {
      throw ApiError.internal('Failed to publish announcement', error);
    }

    return announcement;
  }

  static async updateAnnouncement(id, updateData) {
    const { data: updated, error } = await supabaseAdmin
      .from('announcements')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw ApiError.internal('Failed to update announcement', error);
    }

    return updated;
  }

  static async deleteAnnouncement(id) {
    const { error } = await supabaseAdmin
      .from('announcements')
      .delete()
      .eq('id', id);

    if (error) {
      throw ApiError.internal('Failed to delete announcement', error);
    }

    return true;
  }
}
