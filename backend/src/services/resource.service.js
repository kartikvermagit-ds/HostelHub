import { supabaseAdmin } from '../config/supabase.js';
import { StorageService } from './storage.service.js';
import { ApiError } from '../utils/apiError.js';
import { getPaginationParams, buildPaginationMetadata } from '../utils/pagination.js';
import { logger } from '../utils/logger.js';

export class ResourceService {
  static async createResource(resourceData, uploadedByProfileId) {
    const { tags = [], ...data } = resourceData;

    // 1. Insert resource record
    const { data: resource, error } = await supabaseAdmin
      .from('resources')
      .insert({
        ...data,
        uploaded_by: uploadedByProfileId,
      })
      .select(`
        id, title, description, unit, resource_type, file_name, file_path, file_url,
        file_size, mime_type, thumbnail_url, download_count, view_count, created_at,
        subject:subjects(id, name, code),
        uploaded_by_profile:profiles!resources_uploaded_by_fkey(id, full_name, avatar_url)
      `)
      .single();

    if (error) {
      logger.error('Failed to insert resource record', error);
      throw ApiError.internal('Failed to create resource', error);
    }

    // 2. Process and associate tags
    if (tags && tags.length > 0) {
      for (const tagName of tags) {
        const cleanTag = tagName.trim().replace(/^#/, '');
        if (!cleanTag) continue;

        // Upsert tag
        const { data: tagRecord } = await supabaseAdmin
          .from('tags')
          .upsert({ name: cleanTag }, { onConflict: 'name' })
          .select('id')
          .single();

        if (tagRecord) {
          await supabaseAdmin
            .from('resource_tags')
            .upsert({ resource_id: resource.id, tag_id: tagRecord.id });
        }
      }
    }

    return {
      ...resource,
      tags: tags || [],
    };
  }

  static async getAllResources(query, currentUserId = null) {
    const { page, limit, rangeFrom, rangeTo } = getPaginationParams(query);

    let queryBuilder = supabaseAdmin
      .from('resources')
      .select(`
        id, title, description, unit, resource_type, file_name, file_size, mime_type, file_url,
        download_count, view_count, created_at,
        subject:subjects(id, name, code),
        uploaded_by_profile:profiles!resources_uploaded_by_fkey(id, full_name, avatar_url),
        resource_tags(tag:tags(id, name))
      `, { count: 'exact' });

    // Subject Filter (by ID or Code)
    if (query.subject_id) {
      queryBuilder = queryBuilder.eq('subject_id', query.subject_id);
    } else if (query.subject && query.subject !== 'All') {
      const { data: subjectRecord } = await supabaseAdmin
        .from('subjects')
        .select('id')
        .ilike('code', query.subject)
        .single();

      if (subjectRecord) {
        queryBuilder = queryBuilder.eq('subject_id', subjectRecord.id);
      }
    }

    // Unit Filter
    if (query.unit) {
      queryBuilder = queryBuilder.eq('unit', parseInt(query.unit, 10));
    }

    // Resource Type Filter
    if (query.type) {
      queryBuilder = queryBuilder.eq('resource_type', query.type);
    }

    // Sorting
    switch (query.sort) {
      case 'popular':
      case 'views':
        queryBuilder = queryBuilder.order('view_count', { ascending: false });
        break;
      case 'downloads':
        queryBuilder = queryBuilder.order('download_count', { ascending: false });
        break;
      case 'latest':
      default:
        queryBuilder = queryBuilder.order('created_at', { ascending: false });
        break;
    }

    queryBuilder = queryBuilder.range(rangeFrom, rangeTo);

    const { data: resources, error, count } = await queryBuilder;

    if (error) {
      logger.error('Failed to list resources', error);
      throw ApiError.internal('Failed to retrieve resources', error);
    }

    // Flatten tags structure
    const formattedResources = (resources || []).map((res) => ({
      ...res,
      tags: (res.resource_tags || []).map((rt) => rt.tag?.name).filter(Boolean),
    }));

    return {
      items: formattedResources,
      pagination: buildPaginationMetadata(page, limit, count || 0),
    };
  }

  static async searchResources(query) {
    const { page, limit, rangeFrom, rangeTo } = getPaginationParams(query);
    const searchTerm = query.q.trim();

    let queryBuilder = supabaseAdmin
      .from('resources')
      .select(`
        id, title, description, unit, resource_type, file_name, file_size, mime_type, file_url,
        download_count, view_count, created_at,
        subject:subjects!inner(id, name, code),
        uploaded_by_profile:profiles!resources_uploaded_by_fkey(id, full_name, avatar_url),
        resource_tags(tag:tags(id, name))
      `, { count: 'exact' });

    // Use PostgreSQL full text search + ilike fallback on title & description
    queryBuilder = queryBuilder.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,subject.code.ilike.%${searchTerm}%`);

    if (query.subject_id) {
      queryBuilder = queryBuilder.eq('subject_id', query.subject_id);
    }
    if (query.unit) {
      queryBuilder = queryBuilder.eq('unit', parseInt(query.unit, 10));
    }
    if (query.resource_type) {
      queryBuilder = queryBuilder.eq('resource_type', query.resource_type);
    }

    queryBuilder = queryBuilder.order('created_at', { ascending: false }).range(rangeFrom, rangeTo);

    const { data: resources, error, count } = await queryBuilder;

    if (error) {
      logger.error('Search query failed', error);
      throw ApiError.internal('Resource search failed', error);
    }

    const items = (resources || []).map((res) => ({
      ...res,
      tags: (res.resource_tags || []).map((rt) => rt.tag?.name).filter(Boolean),
    }));

    return {
      items,
      pagination: buildPaginationMetadata(page, limit, count || 0),
    };
  }

  static async getResourceById(resourceId) {
    const { data: resource, error } = await supabaseAdmin
      .from('resources')
      .select(`
        id, title, description, unit, resource_type, file_name, file_path, file_url,
        file_size, mime_type, thumbnail_url, download_count, view_count, created_at, updated_at,
        subject:subjects(id, name, code),
        uploaded_by_profile:profiles!resources_uploaded_by_fkey(id, full_name, avatar_url, branch, year),
        resource_tags(tag:tags(id, name))
      `)
      .eq('id', resourceId)
      .single();

    if (error || !resource) {
      throw ApiError.notFound('Resource not found');
    }

    // Increment view count asynchronously
    supabaseAdmin
      .from('resources')
      .update({ view_count: (resource.view_count || 0) + 1 })
      .eq('id', resourceId)
      .then();

    return {
      ...resource,
      view_count: (resource.view_count || 0) + 1,
      tags: (resource.resource_tags || []).map((rt) => rt.tag?.name).filter(Boolean),
    };
  }

  static async updateResource(resourceId, updateData, userProfile) {
    const resource = await this.getResourceById(resourceId);

    // Authorization check: User must be owner or Admin
    if (resource.uploaded_by_profile.id !== userProfile.id && userProfile.role !== 'ADMIN') {
      throw ApiError.forbidden('You do not have permission to modify this resource');
    }

    const { tags, ...data } = updateData;

    const { data: updatedResource, error } = await supabaseAdmin
      .from('resources')
      .update(data)
      .eq('id', resourceId)
      .select(`
        id, title, description, unit, resource_type, file_name, file_url,
        file_size, mime_type, download_count, view_count, updated_at,
        subject:subjects(id, name, code)
      `)
      .single();

    if (error) {
      throw ApiError.internal('Failed to update resource', error);
    }

    return updatedResource;
  }

  static async deleteResource(resourceId, userProfile) {
    const resource = await this.getResourceById(resourceId);

    // Authorization check: Owner, Moderator, or Admin
    if (
      resource.uploaded_by_profile.id !== userProfile.id &&
      !['ADMIN', 'MODERATOR'].includes(userProfile.role)
    ) {
      throw ApiError.forbidden('You do not have permission to delete this resource');
    }

    // 1. Delete physical file from Supabase storage
    if (resource.file_path) {
      await StorageService.deleteFile(resource.file_path);
    }

    // 2. Delete database record
    const { error } = await supabaseAdmin
      .from('resources')
      .delete()
      .eq('id', resourceId);

    if (error) {
      throw ApiError.internal('Failed to delete resource', error);
    }

    return true;
  }

  static async downloadResource(resourceId) {
    const resource = await this.getResourceById(resourceId);

    // Increment download count
    await supabaseAdmin
      .from('resources')
      .update({ download_count: (resource.download_count || 0) + 1 })
      .eq('id', resourceId);

    // Generate signed download URL (valid for 1 hour)
    const downloadUrl = await StorageService.generateSignedDownloadUrl(resource.file_path);

    return {
      downloadUrl,
      fileName: resource.file_name,
      fileSize: resource.file_size,
      mimeType: resource.mime_type,
    };
  }
}
