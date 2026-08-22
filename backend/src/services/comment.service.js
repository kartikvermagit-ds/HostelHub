import { supabaseAdmin } from '../config/supabase.js';
import { ApiError } from '../utils/apiError.js';
import { getPaginationParams, buildPaginationMetadata } from '../utils/pagination.js';

export class CommentService {
  static async getResourceComments(resourceId, query) {
    const { page, limit, rangeFrom, rangeTo } = getPaginationParams(query, 50);

    const { data: comments, error, count } = await supabaseAdmin
      .from('comments')
      .select(`
        id, content, created_at, updated_at,
        user:profiles!comments_user_id_fkey(id, full_name, avatar_url, role)
      `, { count: 'exact' })
      .eq('resource_id', resourceId)
      .order('created_at', { ascending: true })
      .range(rangeFrom, rangeTo);

    if (error) {
      throw ApiError.internal('Failed to retrieve comments', error);
    }

    return {
      items: comments || [],
      pagination: buildPaginationMetadata(page, limit, count || 0),
    };
  }

  static async createComment(resourceId, userProfileId, content) {
    // Check if resource exists
    const { data: resource } = await supabaseAdmin
      .from('resources')
      .select('id')
      .eq('id', resourceId)
      .single();

    if (!resource) {
      throw ApiError.notFound('Resource not found');
    }

    const { data: comment, error } = await supabaseAdmin
      .from('comments')
      .insert({
        resource_id: resourceId,
        user_id: userProfileId,
        content,
      })
      .select(`
        id, content, created_at, updated_at,
        user:profiles!comments_user_id_fkey(id, full_name, avatar_url, role)
      `)
      .single();

    if (error) {
      throw ApiError.internal('Failed to post comment', error);
    }

    return comment;
  }

  static async updateComment(commentId, userProfile, newContent) {
    const { data: existingComment } = await supabaseAdmin
      .from('comments')
      .select('id, user_id')
      .eq('id', commentId)
      .single();

    if (!existingComment) {
      throw ApiError.notFound('Comment not found');
    }

    if (existingComment.user_id !== userProfile.id && userProfile.role !== 'ADMIN') {
      throw ApiError.forbidden('You can only edit your own comments');
    }

    const { data: updatedComment, error } = await supabaseAdmin
      .from('comments')
      .update({ content: newContent })
      .eq('id', commentId)
      .select(`
        id, content, created_at, updated_at,
        user:profiles!comments_user_id_fkey(id, full_name, avatar_url, role)
      `)
      .single();

    if (error) {
      throw ApiError.internal('Failed to update comment', error);
    }

    return updatedComment;
  }

  static async deleteComment(commentId, userProfile) {
    const { data: existingComment } = await supabaseAdmin
      .from('comments')
      .select('id, user_id')
      .eq('id', commentId)
      .single();

    if (!existingComment) {
      throw ApiError.notFound('Comment not found');
    }

    if (
      existingComment.user_id !== userProfile.id &&
      !['ADMIN', 'MODERATOR'].includes(userProfile.role)
    ) {
      throw ApiError.forbidden('You do not have permission to delete this comment');
    }

    const { error } = await supabaseAdmin
      .from('comments')
      .delete()
      .eq('id', commentId);

    if (error) {
      throw ApiError.internal('Failed to delete comment', error);
    }

    return true;
  }
}
