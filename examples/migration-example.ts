/**
 * Migration Example: V1 to V2
 *
 * This file shows how to migrate from V1 to V2 code.
 * Side-by-side comparison of old and new code.
 */

import { Ikat, IkatV2 } from 'ikat-api';

const apiKey = process.env.IKAT_API_KEY || 'your-api-key';

// ============================================================================
// EXAMPLE 1: Initialize Client
// ============================================================================

// V1 (OLD)
function initV1() {
  const ikat = new Ikat({
    apiKey,
    origin: 'https://yourdomain.com'
  });
  return ikat;
}

// V2 (NEW)
function initV2() {
  const ikat = new IkatV2({
    apiKey,
    origin: 'https://yourdomain.com'
  });
  return ikat;
}

// ============================================================================
// EXAMPLE 2: Upload File
// ============================================================================

// V1 (OLD)
async function uploadFileV1(file: File) {
  const ikat = new Ikat({ apiKey });

  const result = await ikat.upload({
    bucket: 'images',
    file
  });

  // V1 returns single URL
  const imageUrl = result.url;
  console.log('Image URL:', imageUrl);

  return imageUrl;
}

// V2 (NEW)
async function uploadFileV2(file: File) {
  const ikat = new IkatV2({ apiKey });

  const result = await ikat.upload({
    bucket: 'images',
    file,
    allowPublicAccess: true // NEW: control access
  });

  // V2 returns multiple URLs for images
  const originalUrl = result.urls.original;
  const thumbnailUrl = result.urls.thumb; // NEW: optimized thumbnail

  console.log('Original URL:', originalUrl);
  console.log('Thumbnail URL:', thumbnailUrl);

  return {
    original: originalUrl,
    thumb: thumbnailUrl
  };
}

// ============================================================================
// EXAMPLE 3: Upload Multiple Files
// ============================================================================

// V1 (OLD)
async function uploadMultipleV1(files: File[]) {
  const ikat = new Ikat({ apiKey });

  const results = await ikat.uploadMultiple('photos', files);

  // All files are public in V1
  console.log(`Uploaded ${results.length} files`);

  return results;
}

// V2 (NEW)
async function uploadMultipleV2(files: File[], isPublic: boolean) {
  const ikat = new IkatV2({ apiKey });

  // NEW: control public/private for all files
  const results = await ikat.uploadMultiple('photos', files, isPublic);

  console.log(`Uploaded ${results.length} files`);
  console.log(`Access: ${isPublic ? 'Public' : 'Private'}`);

  return results;
}

// ============================================================================
// EXAMPLE 4: Replace File
// ============================================================================

// V1 (OLD)
async function replaceFileV1(newFile: File, oldUrl: string) {
  const ikat = new Ikat({ apiKey });

  const result = await ikat.replace({
    bucket: 'avatars',
    file: newFile,
    oldUrl // OLD URL: api.ikat.id
  });

  return result.url;
}

// V2 (NEW)
async function replaceFileV2(newFile: File, oldUrl: string) {
  const ikat = new IkatV2({ apiKey });

  const result = await ikat.replace({
    bucket: 'avatars',
    file: newFile,
    oldUrl, // NEW URL: ikat.id
    allowPublicAccess: true // NEW: control access
  });

  // NEW: get optimized versions
  return {
    original: result.urls.original,
    thumb: result.urls.thumb
  };
}

// ============================================================================
// EXAMPLE 5: Delete File
// ============================================================================

// V1 (OLD)
async function deleteFileV1(bucket: string, key: string) {
  const ikat = new Ikat({ apiKey });

  const result = await ikat.remove({ bucket, key });

  console.log('Deleted:', key);
  return result;
}

// V2 (NEW)
async function deleteFileV2(bucket: string, key: string) {
  const ikat = new IkatV2({ apiKey });

  // Same API, but V2 automatically deletes optimized versions too
  const result = await ikat.remove({ bucket, key });

  console.log('Deleted:', key);
  console.log('(including all optimized versions)');
  return result;
}

// ============================================================================
// EXAMPLE 6: Bucket Deletion (V2 ONLY)
// ============================================================================

// V1 (OLD)
async function deleteBucketV1(bucket: string) {
  const ikat = new Ikat({ apiKey });

  // NOT AVAILABLE IN V1
  // Would need to list all files and delete one by one
  const files = await ikat.list(bucket);

  for (const file of files.files) {
    await ikat.remove({ bucket, key: file.key });
  }

  console.log('Deleted all files manually');
}

// V2 (NEW)
async function deleteBucketV2(bucket: string) {
  const ikat = new IkatV2({ apiKey });

  // NEW: Delete entire bucket with one call
  const result = await ikat.deleteBucket(bucket);

  console.log(`Deleted bucket '${bucket}'`);
  console.log(`Files deleted: ${result.filesDeleted}`);

  return result;
}

// ============================================================================
// EXAMPLE 7: Complete Migration Example
// ============================================================================

/**
 * Before: V1 code
 */
async function oldImplementation() {
  const ikat = new Ikat({ apiKey });

  // Upload image
  const uploadResult = await ikat.upload({
    bucket: 'products',
    file: new File([''], 'product.jpg')
  });

  // Store URL in database
  const imageUrl = uploadResult.url; // api.ikat.id domain

  return imageUrl;
}

/**
 * After: V2 code with improvements
 */
async function newImplementation() {
  const ikat = new IkatV2({ apiKey });

  // Upload image with access control
  const uploadResult = await ikat.upload({
    bucket: 'products',
    file: new File([''], 'product.jpg'),
    allowPublicAccess: true // Explicit access control
  });

  // Store multiple URLs in database for responsive images
  const imageUrls = {
    original: uploadResult.urls.original, // ikat.id domain
    large: uploadResult.urls.large,       // 1920px WebP
    small: uploadResult.urls.small,       // 800px WebP
    thumb: uploadResult.urls.thumb        // 300px WebP
  };

  return imageUrls;
}

// ============================================================================
// EXAMPLE 8: Gradual Migration (Using Both Versions)
// ============================================================================

/**
 * Transition period: Use both versions
 */
class FileService {
  private v1Client: Ikat;
  private v2Client: IkatV2;

  constructor() {
    this.v1Client = new Ikat({ apiKey });
    this.v2Client = new IkatV2({ apiKey });
  }

  /**
   * Legacy method using V1
   */
  async uploadLegacy(file: File) {
    return this.v1Client.upload({
      bucket: 'legacy',
      file
    });
  }

  /**
   * New method using V2
   */
  async uploadNew(file: File, isPublic = true) {
    return this.v2Client.upload({
      bucket: 'new',
      file,
      allowPublicAccess: isPublic
    });
  }

  /**
   * Migrate specific file from V1 to V2
   */
  async migrateFile(oldUrl: string, newFile: File) {
    // Delete from V1 (if needed)
    const key = oldUrl.split('/').pop()!;
    await this.v1Client.remove({ bucket: 'legacy', key });

    // Upload to V2 with optimization
    const result = await this.v2Client.upload({
      bucket: 'new',
      file: newFile,
      allowPublicAccess: true
    });

    return result;
  }
}

// ============================================================================
// EXAMPLE 9: URL Migration Helper
// ============================================================================

/**
 * Helper to update URLs from V1 to V2 format
 */
function migrateUrl(oldUrl: string): string {
  // V1: https://api.ikat.id/user/bucket/file.jpg
  // V2: https://ikat.id/user/bucket/file.jpg
  return oldUrl.replace('api.ikat.id', 'ikat.id');
}

/**
 * Example: Update URLs in database
 */
async function updateDatabaseUrls() {
  // Pseudo-code for database update
  const records = []; // await db.images.findAll();

  for (const record of records) {
    const oldUrl = record.url;
    const newUrl = migrateUrl(oldUrl);

    // await db.images.update(record.id, { url: newUrl });
    console.log(`Updated: ${oldUrl} -> ${newUrl}`);
  }
}

// ============================================================================
// EXAMPLE 10: Feature Detection
// ============================================================================

/**
 * Check if feature is available
 */
function hasFeature(client: Ikat | IkatV2, feature: string): boolean {
  switch (feature) {
    case 'imageOptimization':
      return client instanceof IkatV2;
    case 'publicPrivateToggle':
      return client instanceof IkatV2;
    case 'bucketDeletion':
      return client instanceof IkatV2 && 'deleteBucket' in client;
    default:
      return false;
  }
}

/**
 * Use feature if available
 */
async function uploadWithFeatureDetection(client: Ikat | IkatV2, file: File) {
  if (client instanceof IkatV2) {
    // Use V2 features
    return client.upload({
      bucket: 'images',
      file,
      allowPublicAccess: true
    });
  } else {
    // Use V1 features
    return client.upload({
      bucket: 'images',
      file
    });
  }
}

// Export all examples
export {
  initV1,
  initV2,
  uploadFileV1,
  uploadFileV2,
  uploadMultipleV1,
  uploadMultipleV2,
  replaceFileV1,
  replaceFileV2,
  deleteFileV1,
  deleteFileV2,
  deleteBucketV1,
  deleteBucketV2,
  oldImplementation,
  newImplementation,
  FileService,
  migrateUrl,
  updateDatabaseUrls,
  hasFeature,
  uploadWithFeatureDetection
};
