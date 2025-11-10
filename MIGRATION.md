# Migration Guide: V1 → V2

This guide will help you migrate from the deprecated V1 API to the new V2 API with enhanced features.

## Table of Contents

- [Why Migrate?](#why-migrate)
- [Quick Start](#quick-start)
- [Feature Comparison](#feature-comparison)
- [Step-by-Step Migration](#step-by-step-migration)
- [Breaking Changes](#breaking-changes)
- [New Features in V2](#new-features-in-v2)
- [Code Examples](#code-examples)
- [FAQ](#faq)

## Why Migrate?

V2 offers significant improvements over V1:

| Feature | V1 (Deprecated) | V2 (Recommended) |
|---------|----------------|------------------|
| Base URL | `https://api.ikat.id` | `https://ikat.id` |
| Upload Method | `PUT` | `POST` |
| Image Optimization | ❌ No | ✅ Yes (WebP, 3 sizes) |
| Public/Private Toggle | ❌ No | ✅ Yes |
| Bucket Deletion | ❌ No | ✅ Yes |
| Response Format | Single URL | Multiple URLs for images |
| Future Support | ❌ No updates | ✅ Active development |

## Quick Start

### Before (V1)
```ts
import { Ikat } from 'ikat-api';

const ikat = new Ikat({ apiKey: 'your-key' });
const result = await ikat.upload({ bucket: 'images', file });
console.log(result.url); // Single URL
```

### After (V2)
```ts
import { IkatV2 } from 'ikat-api';

const ikat = new IkatV2({ apiKey: 'your-key' });
const result = await ikat.upload({ bucket: 'images', file });
console.log(result.urls.original); // Original
console.log(result.urls.large);    // 1920px WebP
console.log(result.urls.small);    // 800px WebP
console.log(result.urls.thumb);    // 300px WebP
```

## Feature Comparison

### Upload

#### V1 (Deprecated)
```ts
// Single URL response
await ikat.upload({ bucket: 'images', file });
// Returns: { url: 'https://api.ikat.id/...' }
```

#### V2 (Recommended)
```ts
// Multiple URLs for images + public/private control
await ikat.upload({
  bucket: 'images',
  file,
  allowPublicAccess: true // New! Control access
});
// Returns: {
//   urls: {
//     original: 'https://ikat.id/...',
//     large: 'https://ikat.id/...-large.webp',
//     small: 'https://ikat.id/...-small.webp',
//     thumb: 'https://ikat.id/...-thumb.webp'
//   }
// }
```

### Delete

#### V1 (Deprecated)
```ts
// Only deletes original file
await ikat.remove({ bucket: 'images', key: 'photo.jpg' });
```

#### V2 (Recommended)
```ts
// Automatically deletes all versions (original + WebP)
await ikat.remove({ bucket: 'images', key: 'photo.jpg' });

// New! Delete entire bucket
await ikat.deleteBucket('old-bucket');
```

### Upload Multiple

#### V1 (Deprecated)
```ts
// All files are public
await ikat.uploadMultiple('bucket', [file1, file2]);
```

#### V2 (Recommended)
```ts
// Control public/private for all files
await ikat.uploadMultiple('bucket', [file1, file2], false); // Private
```

## Step-by-Step Migration

### Step 1: Install/Update Package

The package name remains the same:
```bash
npm install ikat-api@latest
```

### Step 2: Update Imports

Replace `Ikat` with `IkatV2`:

```diff
- import { Ikat } from 'ikat-api';
+ import { IkatV2 } from 'ikat-api';
```

### Step 3: Update Client Initialization

Change the class name:

```diff
- const ikat = new Ikat({
+ const ikat = new IkatV2({
    apiKey: process.env.IKAT_API_KEY,
    origin: 'https://yourdomain.com'
  });
```

### Step 4: Update Upload Calls

Adjust response handling for images:

```diff
- const result = await ikat.upload({ bucket: 'images', file });
- const imageUrl = result.url;
+ const result = await ikat.upload({ bucket: 'images', file });
+ const imageUrl = result.urls.original;
+ // Optionally use optimized versions:
+ const thumbUrl = result.urls.thumb; // 300px WebP
```

### Step 5: Add Access Control (Optional)

Take advantage of the new public/private toggle:

```ts
// Public files (default)
await ikat.upload({
  bucket: 'public-images',
  file,
  allowPublicAccess: true
});

// Private files (requires authentication)
await ikat.upload({
  bucket: 'user-documents',
  file,
  allowPublicAccess: false
});
```

### Step 6: Update Hardcoded URLs

Search and replace URLs in your codebase:

```diff
- https://api.ikat.id/user-id/bucket/file.jpg
+ https://ikat.id/user-id/bucket/file.jpg
```

### Step 7: Test Your Integration

Run your test suite and verify:
- ✅ Uploads work correctly
- ✅ Image URLs are valid
- ✅ Delete operations succeed
- ✅ Public/private access works as expected

## Breaking Changes

### 1. Base URL Changed
- **Old**: `https://api.ikat.id`
- **New**: `https://ikat.id`
- **Impact**: All file URLs will use the new domain
- **Action**: Update any hardcoded URLs in your code/database

### 2. Upload Method Changed
- **Old**: `PUT /upload/:bucket`
- **New**: `POST /upload/:bucket`
- **Impact**: Direct API calls need to be updated
- **Action**: Use the SDK (handles this automatically)

### 3. Response Format Changed
- **Old**: Single `url` field
- **New**: `urls` object with multiple versions
- **Impact**: Code that reads `result.url` needs updating
- **Action**: Change to `result.urls.original`

## New Features in V2

### 1. Automatic Image Optimization

V2 automatically generates WebP versions of uploaded images:

```ts
const result = await ikat.upload({ bucket: 'photos', file });

// Use the best version for your needs:
result.urls.original; // Original format and size
result.urls.large;    // 1920px wide WebP (hero images)
result.urls.small;    // 800px wide WebP (content images)
result.urls.thumb;    // 300px wide WebP (thumbnails)
```

### 2. Public/Private Access Control

Control who can access your files:

```ts
// Public file (anyone can access)
await ikat.upload({
  bucket: 'marketing',
  file: logoFile,
  allowPublicAccess: true
});

// Private file (requires API key)
await ikat.upload({
  bucket: 'invoices',
  file: invoiceFile,
  allowPublicAccess: false
});
```

### 3. Bucket Deletion

Delete entire buckets with one call:

```ts
const result = await ikat.deleteBucket('old-project');
console.log(`Deleted ${result.filesDeleted} files`);
```

### 4. Better Error Messages

V2 provides more detailed error messages:

```ts
try {
  await ikat.upload({ bucket: 'test', file });
} catch (error) {
  console.error(error.message); // Detailed error info
}
```

## Code Examples

### Example 1: Simple Image Upload

```ts
import { IkatV2 } from 'ikat-api';

const ikat = new IkatV2({ apiKey: process.env.IKAT_API_KEY });

async function uploadProfilePicture(file) {
  const result = await ikat.upload({
    bucket: 'profiles',
    file,
    allowPublicAccess: true
  });

  return {
    original: result.urls.original,
    thumbnail: result.urls.thumb
  };
}
```

### Example 2: Upload with Replace

```ts
async function updateAvatar(file, oldUrl) {
  const result = await ikat.replace({
    bucket: 'avatars',
    file,
    oldUrl, // Automatically deletes old file
    allowPublicAccess: true
  });

  return result.urls.small; // Use 800px version
}
```

### Example 3: Private Document Upload

```ts
async function uploadInvoice(file) {
  const result = await ikat.upload({
    bucket: 'invoices',
    file,
    allowPublicAccess: false // Requires authentication
  });

  // Store in database
  await db.invoices.create({
    url: result.urls.original,
    fileSize: result.file.size,
    mimeType: result.file.mimetype
  });

  return result.urls.original;
}
```

### Example 4: Bulk Upload with Progress

```ts
async function uploadGallery(files) {
  const results = await ikat.uploadMultiple('gallery', files, true);

  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  console.log(`Uploaded ${successful.length} files`);
  if (failed.length > 0) {
    console.error(`Failed to upload ${failed.length} files`);
  }

  return successful.map(r => r.data.urls);
}
```

### Example 5: Responsive Images

```ts
async function uploadResponsiveImage(file) {
  const result = await ikat.upload({
    bucket: 'articles',
    file,
    allowPublicAccess: true
  });

  // Generate HTML with responsive images
  return `
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
        alt="Article image"
        loading="lazy"
      />
    </picture>
  `;
}
```

## FAQ

### Q: Do I have to migrate immediately?
**A:** No, V1 still works but shows deprecation warnings. However, V1 won't receive updates or bug fixes. We recommend migrating when convenient.

### Q: Will my existing files still work?
**A:** Files uploaded with V1 remain accessible. However, they won't have optimized WebP versions. New uploads with V2 will have optimization.

### Q: Can I use both V1 and V2 in the same project?
**A:** Yes! Import both classes:
```ts
import { Ikat, IkatV2 } from 'ikat-api';
```

### Q: What happens to my old URLs?
**A:** Old URLs (`api.ikat.id`) continue working. But new uploads use `ikat.id`. Update your app gradually.

### Q: Do I need a new API key?
**A:** No, your existing API key works with both V1 and V2.

### Q: How do I handle non-image files?
**A:** Non-image files (PDFs, ZIPs, etc.) return only `urls.original`. The optimization is automatic for images only.

### Q: What if I don't want image optimization?
**A:** Just use `urls.original` instead of the optimized versions. The original file is always available.

### Q: Can I disable public access for existing files?
**A:** V2 only sets access control during upload. To change existing files, re-upload them with the desired `allowPublicAccess` setting.

### Q: Will bucket deletion remove files immediately?
**A:** Yes, `deleteBucket()` permanently deletes all files in the bucket. Use with caution!

## Need Help?

If you encounter issues during migration:

- 📧 Email: [hi@liupurnomo.com](mailto:hi@liupurnomo.com)
- 📚 Documentation: [https://pro.ikat.id/docs](https://pro.ikat.id/docs)
- 🐛 Issues: [GitHub Issues](https://github.com/liu-purnomo/ikat-api/issues)

---

Made with ❤️ to simplify file uploads.
