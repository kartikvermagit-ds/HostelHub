import crypto from 'crypto';
import path from 'path';
import { supabaseAdmin } from '../config/supabase.js';
import { env } from '../config/env.js';
import { ApiError } from '../utils/apiError.js';
import { logger } from '../utils/logger.js';

const ALLOWED_MIME_TYPES = {
  pdf: ['application/pdf'],
  image: ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'],
  video: ['video/mp4', 'video/webm', 'video/quicktime'],
};

const ALLOWED_EXTENSIONS = {
  pdf: ['.pdf'],
  image: ['.jpg', '.jpeg', '.png', '.webp'],
  video: ['.mp4', '.webm', '.mov'],
};

export class StorageService {
  static validateFile(fileName, mimeType, fileSize) {
    const ext = path.extname(fileName).toLowerCase();
    let category = null;

    if (ALLOWED_MIME_TYPES.pdf.includes(mimeType) || ALLOWED_EXTENSIONS.pdf.includes(ext)) {
      category = 'pdf';
      if (fileSize > env.MAX_PDF_SIZE) {
        throw ApiError.badRequest(`PDF exceeds maximum allowed size of ${env.MAX_PDF_SIZE / (1024 * 1024)}MB`);
      }
    } else if (ALLOWED_MIME_TYPES.image.includes(mimeType) || ALLOWED_EXTENSIONS.image.includes(ext)) {
      category = 'images';
      if (fileSize > env.MAX_IMAGE_SIZE) {
        throw ApiError.badRequest(`Image exceeds maximum allowed size of ${env.MAX_IMAGE_SIZE / (1024 * 1024)}MB`);
      }
    } else if (ALLOWED_MIME_TYPES.video.includes(mimeType) || ALLOWED_EXTENSIONS.video.includes(ext)) {
      category = 'videos';
      if (fileSize > env.MAX_VIDEO_SIZE) {
        throw ApiError.badRequest(`Video exceeds maximum allowed size of ${env.MAX_VIDEO_SIZE / (1024 * 1024)}MB`);
      }
    } else {
      throw ApiError.badRequest(
        `Unsupported file type '${mimeType}' (${ext}). Allowed formats: PDF, JPG, PNG, WEBP, MP4, WEBM.`
      );
    }

    return { category, ext };
  }

  static generateStoragePath(category, fileName) {
    const sanitizedName = path.basename(fileName).replace(/[^a-zA-Z0-9._-]/g, '_');
    const uniquePrefix = crypto.randomUUID();
    return `resources/${category}/${uniquePrefix}-${sanitizedName}`;
  }

  static async generateSignedUploadUrl(fileName, mimeType, fileSize) {
    const { category } = this.validateFile(fileName, mimeType, fileSize);
    const storagePath = this.generateStoragePath(category, fileName);

    const { data, error } = await supabaseAdmin.storage
      .from(env.SUPABASE_STORAGE_BUCKET)
      .createSignedUploadUrl(storagePath);

    if (error) {
      logger.error('Failed to create signed upload URL', error);
      throw ApiError.internal('Could not generate upload authorization URL', error);
    }

    // Public or standard file access URL
    const { data: publicUrlData } = supabaseAdmin.storage
      .from(env.SUPABASE_STORAGE_BUCKET)
      .getPublicUrl(storagePath);

    return {
      signedUrl: data.signedUrl,
      token: data.token,
      path: data.path || storagePath,
      fileUrl: publicUrlData.publicUrl,
      category,
    };
  }

  static async uploadFileBuffer(fileBuffer, fileName, mimeType) {
    const { category } = this.validateFile(fileName, mimeType, fileBuffer.length);
    const storagePath = this.generateStoragePath(category, fileName);

    const { data, error } = await supabaseAdmin.storage
      .from(env.SUPABASE_STORAGE_BUCKET)
      .upload(storagePath, fileBuffer, {
        contentType: mimeType,
        upsert: false,
      });

    if (error) {
      logger.error('Failed to upload file buffer to Supabase Storage', error);
      throw ApiError.internal('File upload to storage failed', error);
    }

    const { data: publicUrlData } = supabaseAdmin.storage
      .from(env.SUPABASE_STORAGE_BUCKET)
      .getPublicUrl(storagePath);

    return {
      path: data.path || storagePath,
      fileUrl: publicUrlData.publicUrl,
      fileName,
      fileSize: fileBuffer.length,
      mimeType,
      category,
    };
  }

  static async generateSignedDownloadUrl(filePath, expiresInSeconds = 3600) {
    const { data, error } = await supabaseAdmin.storage
      .from(env.SUPABASE_STORAGE_BUCKET)
      .createSignedUrl(filePath, expiresInSeconds);

    if (error) {
      logger.error(`Failed to generate signed download URL for ${filePath}`, error);
      throw ApiError.notFound('Unable to locate file in storage');
    }

    return data.signedUrl;
  }

  static async deleteFile(filePath) {
    if (!filePath) return;
    try {
      await supabaseAdmin.storage
        .from(env.SUPABASE_STORAGE_BUCKET)
        .remove([filePath]);
    } catch (err) {
      logger.warn(`Storage file removal encountered notice: ${err.message}`);
    }
  }
}
