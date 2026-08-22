import { supabaseAdmin } from '../config/supabase.js';
import { ApiError } from '../utils/apiError.js';

export class SubjectService {
  static async getAllSubjects() {
    const { data: subjects, error } = await supabaseAdmin
      .from('subjects')
      .select('id, name, code, description, created_at')
      .order('code', { ascending: true });

    if (error) {
      throw ApiError.internal('Failed to retrieve subjects', error);
    }

    return subjects || [];
  }

  static async createSubject(data) {
    const { data: newSubject, error } = await supabaseAdmin
      .from('subjects')
      .insert({
        name: data.name,
        code: data.code.toUpperCase(),
        description: data.description || null,
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        throw ApiError.conflict(`Subject with code '${data.code}' already exists`);
      }
      throw ApiError.internal('Failed to create subject', error);
    }

    return newSubject;
  }
}
