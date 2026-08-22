import { describe, it, expect } from 'vitest';
import { StorageService } from '../src/services/storage.service.js';

describe('StorageService File Validation Unit Tests', () => {
  it('should accept valid PDF file within size limit', () => {
    const result = StorageService.validateFile('lecture_unit1.pdf', 'application/pdf', 5 * 1024 * 1024);
    expect(result.category).toBe('pdf');
    expect(result.ext).toBe('.pdf');
  });

  it('should accept valid Image file within size limit', () => {
    const result = StorageService.validateFile('diagram.png', 'image/png', 2 * 1024 * 1024);
    expect(result.category).toBe('images');
  });

  it('should accept valid Video file within size limit', () => {
    const result = StorageService.validateFile('lecture.mp4', 'video/mp4', 50 * 1024 * 1024);
    expect(result.category).toBe('videos');
  });

  it('should reject unsupported file types like .exe or .sh', () => {
    expect(() => {
      StorageService.validateFile('script.sh', 'application/x-sh', 1024);
    }).toThrow(/Unsupported file type/);
  });

  it('should reject oversized PDF exceeding limit', () => {
    expect(() => {
      StorageService.validateFile('large.pdf', 'application/pdf', 50 * 1024 * 1024); // 50MB > 20MB limit
    }).toThrow(/exceeds maximum allowed size/);
  });

  it('should generate sanitized and randomized storage path', () => {
    const path = StorageService.generateStoragePath('pdf', 'COA Unit 2 (Final Version!).pdf');
    expect(path.startsWith('resources/pdf/')).toBe(true);
    expect(path.includes('COA_Unit_2__Final_Version__.pdf')).toBe(true);
  });
});
