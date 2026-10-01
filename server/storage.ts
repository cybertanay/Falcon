import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { SupabaseClient } from '@supabase/supabase-js';

const currentFilename = fileURLToPath(import.meta.url);
const currentDirname = path.dirname(currentFilename);
const UPLOADS_DIR = path.resolve(currentDirname, '..', 'public', 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Magic bytes validator for JPEG, PNG, WEBP
function validateImageMagicBytes(buffer: Buffer): { valid: boolean; ext: string; mime: string } {
  if (buffer.length < 12) return { valid: false, ext: '', mime: '' };

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { valid: true, ext: 'jpg', mime: 'image/jpeg' };
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return { valid: true, ext: 'png', mime: 'image/png' };
  }

  // WEBP: 'RIFF' ... 'WEBP'
  const isRiff = buffer.toString('ascii', 0, 4) === 'RIFF';
  const isWebp = buffer.toString('ascii', 8, 12) === 'WEBP';
  if (isRiff && isWebp) {
    return { valid: true, ext: 'webp', mime: 'image/webp' };
  }

  return { valid: false, ext: '', mime: '' };
}

export interface UploadResult {
  url: string;
  filename: string;
  sizeBytes: number;
  storageProvider: 'supabase' | 'local';
}

/**
 * Uploads an image using Supabase Storage when available,
 * with verified image magic bytes validation and safe local fallback for development.
 */
export async function uploadProductImage(
  imageData: string,
  suggestedName: string,
  supabase: SupabaseClient | null
): Promise<UploadResult> {
  // 1. Validate data URI structure
  const matches = imageData.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/);
  if (!matches) {
    throw new Error('Invalid image data format. Expected base64 data URI (e.g. data:image/jpeg;base64,...).');
  }

  const rawMime = matches[1].toLowerCase();
  const buffer = Buffer.from(matches[2], 'base64');

  // 2. Size limit: 5MB
  if (buffer.length > 5 * 1024 * 1024) {
    throw new Error('Image exceeds maximum allowable size limit of 5MB.');
  }

  // 3. Inspect magic bytes directly to prevent disguised file execution
  const magic = validateImageMagicBytes(buffer);
  if (!magic.valid) {
    throw new Error('Invalid or corrupted image content. Allowed formats: JPEG, PNG, WEBP.');
  }

  const cleanBase = (suggestedName || 'spice_product')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .substring(0, 30);
  const safeFilename = `${cleanBase}_${Date.now()}.${magic.ext}`;

  // 4. If Supabase is configured, upload to Supabase Storage bucket 'product-images'
  if (supabase) {
    try {
      const bucketName = process.env.SUPABASE_STORAGE_BUCKET || 'product-images';
      
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(safeFilename, buffer, {
          contentType: magic.mime,
          cacheControl: '31536000',
          upsert: false
        });

      if (!error && data) {
        const { data: publicUrlData } = supabase.storage
          .from(bucketName)
          .getPublicUrl(safeFilename);

        return {
          url: publicUrlData.publicUrl,
          filename: safeFilename,
          sizeBytes: buffer.length,
          storageProvider: 'supabase'
        };
      }
      console.warn('[Storage] Supabase storage upload returned error, using local fallback:', error?.message);
    } catch (err: any) {
      console.warn('[Storage] Supabase storage exception:', err?.message);
      if (process.env.NODE_ENV === 'production') {
        throw new Error(`Production storage upload failed: ${err?.message || 'Storage error'}`);
      }
    }
  }

  // 5. Local filesystem fallback for development
  if (process.env.NODE_ENV === 'production' && !process.env.ALLOW_LOCAL_STORAGE_IN_PROD) {
    throw new Error('Production deployment requires cloud object storage (Supabase Storage). Local file persistence is forbidden in production.');
  }

  const localFilePath = path.join(UPLOADS_DIR, safeFilename);
  fs.writeFileSync(localFilePath, buffer);

  return {
    url: `/uploads/${safeFilename}`,
    filename: safeFilename,
    sizeBytes: buffer.length,
    storageProvider: 'local'
  };
}
