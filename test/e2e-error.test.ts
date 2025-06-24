import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { describe, expect, it } from 'vitest';
import { Ikat } from '../src/ikat';

dotenv.config({ path: '.env.test' });

const VALID_API_KEY = process.env.IKAT_API_KEY!;
const BUCKET = process.env.IKAT_BUCKET!;
const ORIGIN = process.env.IKAT_ORIGIN!;
const FILE_PATH = path.join(__dirname, '../public/image.png');
const FILE_BUFFER = fs.readFileSync(FILE_PATH);
const FILENAME = 'image.png';
const MIMETYPE = 'image/png';

describe('Ikat API - Error Handling Tests', () => {
  it('should fail upload with invalid API key', async () => {
    const ikat = new Ikat({ apiKey: 'INVALID_API_KEY', origin: ORIGIN });

    try {
      await ikat.upload({
        bucket: BUCKET,
        file: FILE_BUFFER,
        name: FILENAME,
        type: MIMETYPE,
      });
      throw new Error('Upload with invalid API key should fail');
    } catch (err: any) {
      expect(err.message).toMatch(/403|unauthorized|invalid api/i);
    }
  });

  it('should fail upload with invalid origin', async () => {
    const ikat = new Ikat({
      apiKey: VALID_API_KEY,
      origin: `${ORIGIN}-invalid`,
    });

    try {
      await ikat.upload({
        bucket: BUCKET,
        file: FILE_BUFFER,
        name: FILENAME,
        type: MIMETYPE,
      });
      throw new Error('Upload with invalid origin should fail');
    } catch (err: any) {
      expect(err.message).toMatch(/403|forbidden|origin/i);
    }
  });
});
