import { supabaseAdmin } from '../config/supabase.js';
import { ApiError } from '../utils/apiError.js';
import { getPaginationParams, buildPaginationMetadata } from '../utils/pagination.js';

export class CTService {
  static async getAllCTs(query) {
    const { page, limit, rangeFrom, rangeTo } = getPaginationParams(query);

    const { data: cts, error, count } = await supabaseAdmin
      .from('cts')
      .select(`
        id, title, description, exam_date, created_at,
        subject:subjects(id, name, code)
      `, { count: 'exact' })
      .order('exam_date', { ascending: true })
      .range(rangeFrom, rangeTo);

    if (error) {
      throw ApiError.internal('Failed to retrieve class tests', error);
    }

    return {
      items: cts || [],
      pagination: buildPaginationMetadata(page, limit, count || 0),
    };
  }

  static async getUpcomingCTs() {
    const now = new Date().toISOString();

    const { data: upcomingCTs, error } = await supabaseAdmin
      .from('cts')
      .select(`
        id, title, description, exam_date, created_at,
        subject:subjects(id, name, code)
      `)
      .gte('exam_date', now)
      .order('exam_date', { ascending: true })
      .limit(6);

    if (error) {
      throw ApiError.internal('Failed to retrieve upcoming CTs', error);
    }

    // Calculate days left and formatted countdown
    const formattedCTs = (upcomingCTs || []).map((ct) => {
      const examDate = new Date(ct.exam_date);
      const diffMs = examDate - new Date();
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

      return {
        ...ct,
        days_left: diffDays,
        time_left_label: diffDays <= 0 ? 'Today' : diffDays === 1 ? '1 Day Left' : `${diffDays} Days Left`,
        is_urgent: diffDays <= 3,
      };
    });

    return formattedCTs;
  }

  static async getCTById(ctId) {
    const { data: ct, error } = await supabaseAdmin
      .from('cts')
      .select(`
        id, title, description, exam_date, created_at,
        subject:subjects(id, name, code)
      `)
      .eq('id', ctId)
      .single();

    if (error || !ct) {
      throw ApiError.notFound('Class Test (CT) not found');
    }

    return ct;
  }

  static async getCTResources(ctId) {
    const ct = await this.getCTById(ctId);

    // Fetch associated resources directly or through subject mapping
    const { data: linkedResources, error: linkedError } = await supabaseAdmin
      .from('ct_resources')
      .select(`
        topic_name,
        resource:resources(
          id, title, description, unit, resource_type, file_name, file_size, mime_type, file_url,
          download_count, view_count, created_at,
          uploaded_by_profile:profiles!resources_uploaded_by_fkey(id, full_name, avatar_url)
        )
      `)
      .eq('ct_id', ctId);

    // Also fetch general subject resources as preparation pool
    const { data: subjectResources } = await supabaseAdmin
      .from('resources')
      .select(`
        id, title, description, unit, resource_type, file_name, file_size, mime_type, file_url,
        download_count, view_count, created_at,
        uploaded_by_profile:profiles!resources_uploaded_by_fkey(id, full_name, avatar_url)
      `)
      .eq('subject_id', ct.subject.id)
      .order('download_count', { ascending: false })
      .limit(10);

    return {
      ct,
      preparation_materials: {
        notes: (subjectResources || []).filter((r) => r.resource_type === 'NOTES'),
        pyqs: (subjectResources || []).filter((r) => r.resource_type === 'PYQ'),
        videos: (subjectResources || []).filter((r) => r.resource_type === 'VIDEO'),
        important_questions: (subjectResources || []).filter((r) => r.resource_type === 'IMPORTANT_QUESTIONS'),
        linked_topics: linkedResources || [],
      },
    };
  }

  static async createCT(ctData, createdByProfileId) {
    const { resource_ids = [], ...data } = ctData;

    const { data: newCT, error } = await supabaseAdmin
      .from('cts')
      .insert({
        ...data,
        created_by: createdByProfileId,
      })
      .select(`
        id, title, description, exam_date, created_at,
        subject:subjects(id, name, code)
      `)
      .single();

    if (error) {
      throw ApiError.internal('Failed to create Class Test', error);
    }

    // Link resources if provided
    if (resource_ids && resource_ids.length > 0) {
      const links = resource_ids.map((resId) => ({
        ct_id: newCT.id,
        resource_id: resId,
      }));
      await supabaseAdmin.from('ct_resources').insert(links);
    }

    return newCT;
  }

  static async updateCT(ctId, updateData) {
    const { data: updatedCT, error } = await supabaseAdmin
      .from('cts')
      .update(updateData)
      .eq('id', ctId)
      .select(`
        id, title, description, exam_date, created_at,
        subject:subjects(id, name, code)
      `)
      .single();

    if (error) {
      throw ApiError.internal('Failed to update Class Test', error);
    }

    return updatedCT;
  }

  static async deleteCT(ctId) {
    const { error } = await supabaseAdmin
      .from('cts')
      .delete()
      .eq('id', ctId);

    if (error) {
      throw ApiError.internal('Failed to delete Class Test', error);
    }

    return true;
  }
}
