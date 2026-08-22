import { supabaseAdmin } from '../config/supabase.js';
import { ApiError } from '../utils/apiError.js';
import { getPaginationParams, buildPaginationMetadata } from '../utils/pagination.js';

export class UserService {
  static async getProfileById(profileId) {
    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('id, full_name, email, avatar_url, branch, year, hostel, room_number, bio, role, created_at')
      .eq('id', profileId)
      .single();

    if (error || !profile) {
      throw ApiError.notFound('User profile not found');
    }

    // Also count uploads
    const { count: uploadsCount } = await supabaseAdmin
      .from('resources')
      .select('id', { count: 'exact', head: true })
      .eq('uploaded_by', profileId);

    return {
      ...profile,
      stats: {
        uploads: uploadsCount || 0,
      },
    };
  }

  static async updateProfile(profileId, updateData) {
    const { data: updatedProfile, error } = await supabaseAdmin
      .from('profiles')
      .update(updateData)
      .eq('id', profileId)
      .select('id, full_name, email, avatar_url, branch, year, hostel, room_number, bio, role, updated_at')
      .single();

    if (error) {
      throw ApiError.internal('Failed to update profile', error);
    }

    return updatedProfile;
  }

  static async getUserUploads(profileId, query) {
    const { page, limit, rangeFrom, rangeTo } = getPaginationParams(query);

    const { data: resources, error, count } = await supabaseAdmin
      .from('resources')
      .select(`
        id, title, description, unit, resource_type, file_name, file_size, mime_type, file_url,
        download_count, view_count, created_at,
        subject:subjects(id, name, code)
      `, { count: 'exact' })
      .eq('uploaded_by', profileId)
      .order('created_at', { ascending: false })
      .range(rangeFrom, rangeTo);

    if (error) {
      throw ApiError.internal('Failed to fetch user uploads', error);
    }

    return {
      items: resources || [],
      pagination: buildPaginationMetadata(page, limit, count || 0),
    };
  }

  static async getUserBookmarks(profileId, query) {
    const { page, limit, rangeFrom, rangeTo } = getPaginationParams(query);

    const { data: bookmarks, error, count } = await supabaseAdmin
      .from('bookmarks')
      .select(`
        id, created_at,
        resource:resources(
          id, title, description, unit, resource_type, file_name, file_size, mime_type, file_url,
          download_count, view_count, created_at,
          uploaded_by_profile:profiles!resources_uploaded_by_fkey(id, full_name, avatar_url),
          subject:subjects(id, name, code)
        )
      `, { count: 'exact' })
      .eq('user_id', profileId)
      .order('created_at', { ascending: false })
      .range(rangeFrom, rangeTo);

    if (error) {
      throw ApiError.internal('Failed to fetch user bookmarks', error);
    }

    const items = (bookmarks || []).map((b) => ({
      bookmark_id: b.id,
      bookmarked_at: b.created_at,
      ...b.resource,
    }));

    return {
      items,
      pagination: buildPaginationMetadata(page, limit, count || 0),
    };
  }
}
