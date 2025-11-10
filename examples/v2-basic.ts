/**
 * Basic V2 Usage Examples
 *
 * This file demonstrates basic operations with IkatV2.
 * Make sure to set your API key in the environment variable IKAT_API_KEY.
 */

import { IkatV2 } from 'ikat-api';

// Initialize the client
const ikat = new IkatV2({
  apiKey: process.env.IKAT_API_KEY || 'your-api-key',
  origin: 'https://yourdomain.com' // optional, for CORS validation
});

/**
 * Example 1: Upload a public image
 * Returns multiple optimized versions
 */
async function uploadPublicImage(file: File) {
  const result = await ikat.upload({
    bucket: 'public-images',
    file,
    allowPublicAccess: true // default, can be omitted
  });

  console.log('Upload successful!');
  console.log('Original:', result.urls.original);
  console.log('Large (1920px):', result.urls.large);
  console.log('Small (800px):', result.urls.small);
  console.log('Thumb (300px):', result.urls.thumb);

  return result;
}

/**
 * Example 2: Upload a private document
 * Requires API key to access
 */
async function uploadPrivateDocument(file: File) {
  const result = await ikat.upload({
    bucket: 'private-docs',
    file,
    allowPublicAccess: false // requires authentication
  });

  console.log('Private document uploaded');
  console.log('URL:', result.urls.original);
  console.log('Access:', result.file.allowPublicAccess ? 'Public' : 'Private');

  return result;
}

/**
 * Example 3: List all files in a bucket
 */
async function listFiles(bucket: string) {
  const response = await ikat.list(bucket);

  console.log(`Files in bucket '${bucket}':`);
  response.files.forEach((file: any) => {
    console.log(`- ${file.original} (${file.size} bytes)`);
    console.log(`  URL: ${file.url}`);
  });

  return response.files;
}

/**
 * Example 4: Delete a file
 * Automatically removes optimized versions for images
 */
async function deleteFile(bucket: string, key: string) {
  const result = await ikat.remove({ bucket, key });

  console.log(`Deleted file: ${key}`);
  console.log(result.message);

  return result;
}

/**
 * Example 5: Replace a file
 * Deletes old file and uploads new one
 */
async function replaceAvatar(file: File, oldUrl: string) {
  const result = await ikat.replace({
    bucket: 'avatars',
    file,
    oldUrl,
    allowPublicAccess: true
  });

  console.log('Avatar replaced successfully');
  console.log('New thumbnail:', result.urls.thumb);

  return result;
}

/**
 * Example 6: Upload multiple files
 */
async function uploadGallery(files: File[]) {
  const results = await ikat.uploadMultiple('gallery', files, true);

  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  console.log(`Uploaded ${successful.length} files`);
  if (failed.length > 0) {
    console.log(`Failed to upload ${failed.length} files`);
    failed.forEach(f => console.error(`  - ${f.file}: ${f.error}`));
  }

  return results;
}

/**
 * Example 7: Delete multiple files
 */
async function cleanupOldFiles(bucket: string, keys: string[]) {
  const results = await ikat.deleteMultiple(bucket, keys);

  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  console.log(`Deleted ${successful.length} files`);
  if (failed.length > 0) {
    console.log(`Failed to delete ${failed.length} files`);
  }

  return results;
}

/**
 * Example 8: Delete entire bucket
 * Use with caution!
 */
async function deleteBucket(bucket: string) {
  const confirmation = confirm(`Are you sure you want to delete bucket '${bucket}'?`);
  if (!confirmation) {
    console.log('Bucket deletion cancelled');
    return;
  }

  const result = await ikat.deleteBucket(bucket);

  console.log(`Deleted bucket '${bucket}'`);
  console.log(`Files deleted: ${result.filesDeleted}`);

  return result;
}

/**
 * Example 9: Handle errors gracefully
 */
async function uploadWithErrorHandling(file: File) {
  try {
    const result = await ikat.upload({
      bucket: 'my-bucket',
      file
    });

    console.log('Upload successful');
    return result;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Upload failed:', error.message);

      // Handle specific errors
      if (error.message.includes('UNSUPPORTED')) {
        console.error('File type not supported');
      } else if (error.message.includes('RATE_LIMIT')) {
        console.error('Too many requests, please wait');
      } else if (error.message.includes('QUOTA')) {
        console.error('Storage quota exceeded');
      }
    }
    throw error;
  }
}

/**
 * Example 10: Responsive image HTML
 * Generate HTML with multiple sizes
 */
async function uploadAndGenerateHTML(file: File, alt: string) {
  const result = await ikat.upload({
    bucket: 'articles',
    file,
    allowPublicAccess: true
  });

  const html = `
    <picture>
      <source
        srcset="${result.urls.large}"
        media="(min-width: 1200px)"
        type="image/webp"
      />
      <source
        srcset="${result.urls.small}"
        media="(min-width: 768px)"
        type="image/webp"
      />
      <img
        src="${result.urls.original}"
        alt="${alt}"
        loading="lazy"
      />
    </picture>
  `;

  console.log('HTML generated:');
  console.log(html);

  return html;
}

// Export all examples
export {
  uploadPublicImage,
  uploadPrivateDocument,
  listFiles,
  deleteFile,
  replaceAvatar,
  uploadGallery,
  cleanupOldFiles,
  deleteBucket,
  uploadWithErrorHandling,
  uploadAndGenerateHTML
};
