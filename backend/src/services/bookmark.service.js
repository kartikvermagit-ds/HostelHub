import { supabaseAdmin } from '../config/supabase.js';
import { ApiError } from '../utils/apiError.js';

export class BookmarkService {
  static async addBookmark(profileId, resourceId) {
    // Check if resource exists
    const { data: resource, error: resourceError } = await supabaseAdmin
      .from('resources')
      .select('id')
      .eq('id', resourceId)
      .single();

    if (resourceError || !resource) {
      throw ApiError.notFound('Resource to bookmark not found');
    }

    const { data: bookmark, error } = await supabaseAdmin
      .from('bookmarks')
      .insert({
        user_id: profileId,
        resource_id: resourceId,
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        throw ApiError.conflict('Resource is already bookmarked');
      }
      throw ApiError.internal('Failed to bookmark resource', error);
    }

    return bookmark;
  }

  static async removeBookmark(profileId, resourceId) {
    const { error } = await supabaseAdmin
      .from('bookmarks')
      .delete()
      .eq('user_id', profileId)
      .eq('resource_id', resourceId);

    if (error) {
      throw ApiError.internal('Failed to remove bookmark', error);
    }

    return true;
  }

  static async isBookmarked(profileId, resourceId) {
    const { data } = await supabaseAdmin
      .from('bookmarks')
      .select('id')
      .eq('user_id', profileId)
      .eq('resource_id', resourceId)
      .maybeSingle();

    return !!data;
  }
}
