import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { Ikat } from '../src/ikat';

dotenv.config({ path: '.env.test' });

const apiKey = process.env.IKAT_API_KEY!;
const bucket = process.env.IKAT_BUCKET!;
const origin = process.env.IKAT_ORIGIN!;

const ikat = new Ikat({ apiKey, origin });

describe('Ikat API - Reject Invalid File Type (.txt)', () => {
  const testFilename = 'test-reject.txt';
  const filePath = path.join(__dirname, testFilename);

  // Create dummy .txt file before test
  beforeAll(() => {
    fs.writeFileSync(filePath, 'This is a test text file.');
  });

  // Delete the file locally after test
  afterAll(() => {
    fs.unlinkSync(filePath);
  });

  it('should reject upload of unsupported .txt file', async () => {
    const fileBuffer = fs.readFileSync(filePath);

    try {
      await ikat.upload({
        bucket,
        file: fileBuffer,
        name: testFilename,
        type: 'text/plain',
      });
      throw new Error('Upload should have failed but succeeded');
    } catch (err: any) {
      expect(err.message).toMatch(/not allowed|Unsupported|Invalid/i);
    }
  });
});
