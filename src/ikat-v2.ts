// src/ikat-v2.ts
import axios, { AxiosInstance } from 'axios';
import FormData from 'form-data';

interface IkatV2Options {
  apiKey: string;
  origin?: string;
}

interface UploadParams {
  bucket: string;
  file: File;
  allowPublicAccess?: boolean;
}

interface DeleteParams {
  bucket: string;
  key: string;
}

interface ImageUrls {
  original: string;
  large?: string;
  small?: string;
  thumb?: string;
}

interface UploadResponse {
  success: boolean;
  message: string;
  urls: ImageUrls;
  file: {
    original: string;
    mimetype: string;
    size: number;
    allowPublicAccess: boolean;
  };
}

const extractKey = (value: string) =>
  value.includes('/') ? value.split('/').pop()! : value;

/**
 * Ikat SDK v2 - Modern API client with image optimization support
 * @example
 * const ikat = new IkatV2({ apiKey: 'your-api-key' });
 */
export class IkatV2 {
  private http: AxiosInstance;
  private key: string;
  private origin?: string;

  /**
   * Initialize the Ikat SDK v2
   * @param apiKey Your API key from ikat.id
   * @param origin Optional: Origin for CORS validation
   * @example
   * const ikat = new IkatV2({ apiKey: 'your-api-key' });
   */
  constructor({ apiKey, origin }: IkatV2Options) {
    this.key = apiKey;
    this.origin = origin;
    this.http = axios.create({ baseURL: 'https://ikat.id' });
  }

  /**
   * Upload a file to a specific bucket
   * For images, automatically generates optimized WebP versions (large, small, thumb)
   * @param bucket Bucket name
   * @param file File object to upload (browser File)
   * @param allowPublicAccess Whether the file should be publicly accessible (default: true)
   * @returns File upload result with multiple URLs for images
   * @example
   * // Upload with default public access
   * const result = await ikat.upload({ bucket: 'images', file });
   * console.log(result.urls.original); // Original file
   * console.log(result.urls.large); // Large WebP version (if image)
   *
   * // Upload with private access
   * const result = await ikat.upload({
   *   bucket: 'private-docs',
   *   file,
   *   allowPublicAccess: false
   * });
   */
  async upload({ bucket, file, allowPublicAccess = true }: UploadParams): Promise<UploadResponse> {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const form = new FormData();
    form.append('file', buffer, file.name);
    form.append('allowPublicAccess', allowPublicAccess.toString());

    try {
      const res = await this.http.post<UploadResponse>(`/upload/${bucket}`, form, {
        headers: {
          ...form.getHeaders(),
          'x-api-key': this.key,
          ...(this.origin && { Origin: this.origin }),
        },
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
      });

      return res.data;
    } catch (err: any) {
      const msg = err?.response?.data?.message || err.message;
      throw new Error(`[upload] ${msg}`);
    }
  }

  /**
   * List all files in a bucket
   * @param bucket Bucket name
   * @returns Array of files with metadata
   * @example
   * const files = await ikat.list('my-bucket');
   * files.forEach(file => {
   *   console.log(file.url, file.mimetype, file.size);
   * });
   */
  async list(bucket: string) {
    try {
      const res = await this.http.get(`/files/${bucket}`, {
        headers: {
          'x-api-key': this.key,
          ...(this.origin && { Origin: this.origin }),
        },
      });

      return res.data;
    } catch (err: any) {
      const msg = err?.response?.data?.message || err.message;
      throw new Error(`[list] ${msg}`);
    }
  }

  /**
   * Delete a file by key or full URL
   * Also deletes optimized versions (WebP) if they exist
   * @param bucket Bucket name
   * @param key File key (or full file URL like https://ikat.id/user-id/bucket/file.jpg)
   * @returns Deletion result
   * @example
   * await ikat.remove({ bucket: 'images', key: 'photo.jpg' });
   * await ikat.remove({ bucket: 'images', key: 'https://ikat.id/abc/images/photo.jpg' });
   */
  async remove({ bucket, key }: DeleteParams) {
    const finalKey = extractKey(key);

    try {
      const res = await this.http.post(
        '/files/delete',
        { bucket, key: finalKey },
        {
          headers: {
            'x-api-key': this.key,
            'Content-Type': 'application/json',
            ...(this.origin && { Origin: this.origin }),
          },
        }
      );

      return res.data;
    } catch (err: any) {
      const msg = err?.response?.data?.message || err.message;
      throw new Error(`[remove] ${msg}`);
    }
  }

  /**
   * Replace an old file with a new one in the same bucket
   * Will continue uploading even if deletion fails
   * @param bucket Bucket name
   * @param file New file to upload
   * @param oldUrl Optional URL of old file to delete
   * @param allowPublicAccess Whether the new file should be publicly accessible (default: true)
   * @returns Upload result
   * @example
   * await ikat.replace({
   *   bucket: 'media',
   *   file,
   *   oldUrl: 'https://ikat.id/user-id/media/old-file.png',
   *   allowPublicAccess: true
   * });
   */
  async replace({
    bucket,
    file,
    oldUrl,
    allowPublicAccess = true,
  }: {
    bucket: string;
    file: File;
    oldUrl?: string;
    allowPublicAccess?: boolean;
  }) {
    if (oldUrl) {
      const key = extractKey(oldUrl);
      try {
        await this.remove({ bucket, key });
      } catch (err) {
        // Silent error logging — does not prevent upload
        if (process.env.NODE_ENV !== 'production') {
          console.warn(`[ikat.replace] Failed to delete old file: ${key}`);
        }
      }
    }

    return this.upload({ bucket, file, allowPublicAccess });
  }

  /**
   * Delete multiple files by key or full URLs
   * Also deletes optimized versions (WebP) if they exist
   * @param bucket Bucket name
   * @param keys Array of keys or URLs
   * @returns Array of result status per file
   * @example
   * const results = await ikat.deleteMultiple('media', [
   *   'file1.jpg',
   *   'https://ikat.id/abc/media/file2.png'
   * ]);
   */
  async deleteMultiple(bucket: string, keys: string[]) {
    const results = [];

    for (const rawKey of keys) {
      const key = extractKey(rawKey);
      try {
        const res = await this.remove({ bucket, key });
        results.push({ key, success: true });
      } catch (err) {
        results.push({
          key,
          success: false,
          error: (err as Error).message,
        });
      }
    }

    return results;
  }

  /**
   * Upload multiple files to a bucket
   * @param bucket Bucket name
   * @param files Array of File objects
   * @param allowPublicAccess Whether the files should be publicly accessible (default: true)
   * @returns Array of result status per file
   * @example
   * const results = await ikat.uploadMultiple('my-bucket', [file1, file2], true);
   */
  async uploadMultiple(bucket: string, files: File[], allowPublicAccess = true) {
    const results = [];

    for (const file of files) {
      try {
        const res = await this.upload({ bucket, file, allowPublicAccess });
        results.push({ file: file.name, success: true, data: res });
      } catch (err) {
        results.push({
          file: file.name,
          success: false,
          error: (err as Error).message,
        });
      }
    }

    return results;
  }

  /**
   * Delete an entire bucket and all its contents
   * @param bucket Bucket name
   * @returns Deletion result with count of deleted files
   * @example
   * const result = await ikat.deleteBucket('old-bucket');
   * console.log(`Deleted ${result.filesDeleted} files`);
   */
  async deleteBucket(bucket: string) {
    try {
      const res = await this.http.post(
        '/files/delete-bucket',
        { bucket },
        {
          headers: {
            'x-api-key': this.key,
            'Content-Type': 'application/json',
            ...(this.origin && { Origin: this.origin }),
          },
        }
      );

      return res.data;
    } catch (err: any) {
      const msg = err?.response?.data?.message || err.message;
      throw new Error(`[deleteBucket] ${msg}`);
    }
  }
}
