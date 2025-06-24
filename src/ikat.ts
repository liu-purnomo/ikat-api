// src/ikat.ts
import axios, { AxiosInstance } from 'axios';
import FormData from 'form-data';

interface IkatOptions {
  apiKey: string;
  origin?: string;
  baseUrl?: string;
}

interface UploadParams {
  bucket: string;
  file: Buffer;
  name: string;
  type?: string;
}

interface DeleteParams {
  bucket: string;
  key: string;
}

export class Ikat {
  private http: AxiosInstance;
  private key: string;
  private origin?: string;

  constructor({
    apiKey,
    origin,
    baseUrl = 'https://api.ikat.id',
  }: IkatOptions) {
    this.key = apiKey;
    this.origin = origin;
    this.http = axios.create({ baseURL: baseUrl });
  }

  async upload({ bucket, file, name, type }: UploadParams) {
    const form = new FormData();
    form.append('file', file, {
      filename: name,
      contentType: type || 'application/octet-stream',
    });

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

  async remove({ bucket, key }: DeleteParams) {
    try {
      const res = await this.http.post(
        '/files/delete',
        { bucket, key },
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
}
