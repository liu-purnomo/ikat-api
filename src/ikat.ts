// src/ikat.ts
import axios, { AxiosInstance } from 'axios';
import FormData from 'form-data';

interface IkatOptions {
  apiKey: string;
  origin?: string;
}

interface UploadParams {
  bucket: string;
  file: File;
}

interface DeleteParams {
  bucket: string;
  key: string;
}

const extractKey = (value: string) =>
  value.includes('/') ? value.split('/').pop()! : value;

export class Ikat {
  private http: AxiosInstance;
  private key: string;
  private origin?: string;

  /**
   * Initialize the Ikat SDK
   * @param apiKey Your API key from ikat.id
   * @param origin Optional: Origin for CORS validation
   * @example
   * const ikat = new Ikat({ apiKey: 'your-api-key' });
   */
  constructor({ apiKey, origin }: IkatOptions) {
    this.key = apiKey;
    this.origin = origin;
    this.http = axios.create({ baseURL: 'https://api.ikat.id' });
  }

  /**
   * Upload a file to a specific bucket
   * @param bucket Bucket name
   * @param file File object to upload (browser File)
   * @returns File upload result
   * @example
   * await ikat.upload({ bucket: 'images', file });
   */
  async upload({ bucket, file }: UploadParams) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const form = new FormData();
    form.append('file', buffer, file.name);

    try {
      const res = await this.http.put(`/upload/${bucket}`, form, {
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
   * @returns Array of files
   * @example
   * const files = await ikat.list('my-bucket');
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
   * @param bucket Bucket name
   * @param key File key (or full file URL like https://api.ikat.id/user-id/bucket/file.jpg)
   * @returns Deletion result
   * @example
   * await ikat.remove({ bucket: 'images', key: 'photo.jpg' });
   * await ikat.remove({ bucket: 'images', key: 'https://api.ikat.id/abc/images/photo.jpg' });
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
   * @param bucket Bucket name
   * @param file New file to upload
   * @param oldUrl Optional URL of old file to delete
   * @returns Upload result
   * @example
   * await ikat.replace({ bucket: 'media', file, oldUrl: 'https://api.ikat.id/user-id/bucket/key-file123.jpg' });
   */
  async replace({
    bucket,
    file,
    oldUrl,
  }: {
    bucket: string;
    file: File;
    oldUrl?: string;
  }) {
    if (oldUrl) {
      const key = oldUrl.split('/').pop()!;
      await this.remove({ bucket, key });
    }

    return this.upload({ bucket, file });
  }

  /**
   * Delete multiple files by key or full URLs
   * @param bucket Bucket name
   * @param keys Array of keys or URLs
   * @returns Array of result status per file
   * @example
   * await ikat.deleteMultiple('media', ['file1.jpg', 'https://api.ikat.id/abc/media/file2.png']);
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
   * @returns Array of result status per file
   * @example
   * await ikat.uploadMultiple('my-bucket', [file1, file2]);
   */
  async uploadMultiple(bucket: string, files: File[]) {
    const results = [];

    for (const file of files) {
      try {
        const res = await this.upload({ bucket, file });
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
}
