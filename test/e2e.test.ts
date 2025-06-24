import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { describe, expect, it } from 'vitest';
import { Ikat } from '../src/ikat';

dotenv.config({ path: '.env.test' });

const apiKey = process.env.IKAT_API_KEY!;
const bucket = process.env.IKAT_BUCKET!;
const origin = process.env.IKAT_ORIGIN!;

const ikat = new Ikat({ apiKey, origin });

describe('Ikat API - Full Flow (Image File)', () => {
  const testFilename = 'image.png';
  const filePath = path.join(__dirname, '../public', testFilename);

  it('should upload, list, and delete a file successfully', async () => {
    // Step 1: Upload
    const fileBuffer = fs.readFileSync(filePath);
    const upload = await ikat.upload({
      bucket,
      file: fileBuffer,
      name: testFilename,
      type: 'image/png',
    });

    expect(upload.success).toBe(true);
    expect(upload.file.original).toBe(testFilename);

    const uploadedKey = upload.url.split('/').pop();
    expect(uploadedKey).toBeTruthy();

    // Step 2: List
    const list = await ikat.list(bucket);
    const found = list.files.find((f: any) => f.original === testFilename);
    expect(found).toBeDefined();

    // Step 3: Delete
    const deleted = await ikat.remove({
      bucket,
      key: uploadedKey!,
    });

    expect(deleted.success).toBe(true);
    expect(deleted.key).toBe(uploadedKey);
  });
});
