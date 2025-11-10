# V1 vs V2 Feature Comparison

Quick reference guide comparing features between V1 (Deprecated) and V2 (Recommended).

## Quick Summary

| Aspect | V1 (Deprecated) | V2 (Recommended) |
|--------|----------------|------------------|
| **Status** | ⚠️ Deprecated | ✅ Active |
| **Base URL** | `api.ikat.id` | `ikat.id` |
| **Upload Method** | PUT | POST |
| **Image Optimization** | ❌ No | ✅ Yes (3 sizes) |
| **Public/Private** | ❌ No | ✅ Yes |
| **Bucket Deletion** | ❌ No | ✅ Yes |
| **Response** | Single URL | Multiple URLs |

---

## Class Names

```ts
// V1
import { Ikat } from 'ikat-api';
const ikat = new Ikat({ apiKey: 'key' });

// V2
import { IkatV2 } from 'ikat-api';
const ikat = new IkatV2({ apiKey: 'key' });
```

---

## Feature Comparison

### 1. Upload Single File

#### V1 (Deprecated)
```ts
await ikat.upload({
  bucket: 'images',
  file
});
// Returns: { url: 'https://api.ikat.id/...' }
```

#### V2 (Recommended)
```ts
await ikat.upload({
  bucket: 'images',
  file,
  allowPublicAccess: true // New parameter!
});
// Returns: {
//   urls: {
//     original: 'https://ikat.id/...',
//     large: 'https://ikat.id/...-large.webp',    // 1920px
//     small: 'https://ikat.id/...-small.webp',    // 800px
//     thumb: 'https://ikat.id/...-thumb.webp'     // 300px
//   }
// }
```

**V2 Advantages:**
- ✅ Multiple optimized versions for images
- ✅ WebP format for better compression
- ✅ Control public/private access
- ✅ Better response structure

---

### 2. Upload Multiple Files

#### V1 (Deprecated)
```ts
await ikat.uploadMultiple('bucket', [file1, file2]);
// All files are public
```

#### V2 (Recommended)
```ts
await ikat.uploadMultiple('bucket', [file1, file2], true);
// Third parameter controls public/private
```

**V2 Advantages:**
- ✅ Control access for all files at once
- ✅ Image optimization for each file

---

### 3. Replace File

#### V1 (Deprecated)
```ts
await ikat.replace({
  bucket: 'images',
  file: newFile,
  oldUrl: 'https://api.ikat.id/user/bucket/old.jpg'
});
```

#### V2 (Recommended)
```ts
await ikat.replace({
  bucket: 'images',
  file: newFile,
  oldUrl: 'https://ikat.id/user/bucket/old.jpg',
  allowPublicAccess: true // Control access
});
```

**V2 Advantages:**
- ✅ Deletes all optimized versions of old file
- ✅ Generates optimized versions for new file
- ✅ Control public/private access

---

### 4. Delete File

#### V1 (Deprecated)
```ts
await ikat.remove({
  bucket: 'images',
  key: 'photo.jpg'
});
// Only deletes original file
```

#### V2 (Recommended)
```ts
await ikat.remove({
  bucket: 'images',
  key: 'photo.jpg'
});
// Automatically deletes optimized versions too
```

**V2 Advantages:**
- ✅ Automatically removes WebP versions
- ✅ No orphaned files

---

### 5. Delete Multiple Files

#### V1 (Deprecated)
```ts
await ikat.deleteMultiple('bucket', ['file1.jpg', 'file2.png']);
```

#### V2 (Recommended)
```ts
await ikat.deleteMultiple('bucket', ['file1.jpg', 'file2.png']);
// Same syntax, but deletes optimized versions
```

**V2 Advantages:**
- ✅ Cleans up all related files automatically

---

### 6. List Files

#### V1 (Deprecated)
```ts
const files = await ikat.list('bucket');
```

#### V2 (Recommended)
```ts
const files = await ikat.list('bucket');
// Same syntax and behavior
```

**No difference** - Works the same in both versions.

---

### 7. Delete Bucket

#### V1 (Deprecated)
```ts
// ❌ NOT AVAILABLE
```

#### V2 (Recommended)
```ts
const result = await ikat.deleteBucket('old-bucket');
console.log(`Deleted ${result.filesDeleted} files`);
```

**V2 Exclusive:**
- ✅ Delete entire bucket with one call
- ✅ Returns count of deleted files

---

## Response Format Comparison

### Upload Response

#### V1
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "url": "https://api.ikat.id/user/bucket/file.jpg",
  "file": {
    "original": "photo.jpg",
    "mimetype": "image/jpeg",
    "size": 1234567
  }
}
```

#### V2 (Images)
```json
{
  "success": true,
  "message": "Image uploaded successfully with optimized versions",
  "urls": {
    "original": "https://ikat.id/user/bucket/file.jpg",
    "large": "https://ikat.id/user/bucket/file-large.webp",
    "small": "https://ikat.id/user/bucket/file-small.webp",
    "thumb": "https://ikat.id/user/bucket/file-thumb.webp"
  },
  "file": {
    "original": "photo.jpg",
    "mimetype": "image/jpeg",
    "size": 1234567,
    "allowPublicAccess": true
  }
}
```

#### V2 (Non-Images)
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "urls": {
    "original": "https://ikat.id/user/bucket/document.pdf"
  },
  "file": {
    "original": "document.pdf",
    "mimetype": "application/pdf",
    "size": 1234567,
    "allowPublicAccess": true
  }
}
```

---

## Image Optimization Details (V2 Only)

When you upload an image with V2, it automatically generates:

| Version | Width | Format | Use Case |
|---------|-------|--------|----------|
| **original** | Unchanged | Original format | Highest quality needed |
| **large** | 1920px | WebP | Desktop hero images |
| **small** | 800px | WebP | Content images |
| **thumb** | 300px | WebP | Thumbnails, previews |

**Benefits:**
- 🚀 Faster loading times
- 💾 Reduced bandwidth usage
- 📱 Better mobile experience
- 🎨 Automatic responsive images

---

## Public/Private Access Control (V2 Only)

### Public Files (default)
```ts
await ikat.upload({
  bucket: 'public-images',
  file,
  allowPublicAccess: true // Anyone can access
});
```

Use for:
- Marketing materials
- Public blog images
- Product photos
- Profile pictures

### Private Files
```ts
await ikat.upload({
  bucket: 'user-documents',
  file,
  allowPublicAccess: false // Requires authentication
});
```

Use for:
- User documents
- Invoices
- Private photos
- Sensitive data

---

## Migration Path

### Option 1: Full Migration
Replace all V1 code with V2:
```ts
// Before
import { Ikat } from 'ikat-api';
const ikat = new Ikat({ apiKey: 'key' });

// After
import { IkatV2 } from 'ikat-api';
const ikat = new IkatV2({ apiKey: 'key' });
```

### Option 2: Gradual Migration
Use both versions during transition:
```ts
import { Ikat, IkatV2 } from 'ikat-api';

// Keep V1 for existing features
const oldClient = new Ikat({ apiKey: 'key' });

// Use V2 for new features
const newClient = new IkatV2({ apiKey: 'key' });
```

---

## Use Case Recommendations

### Use V1 if:
- ❌ You have legacy code that can't be updated yet
- ❌ You need backward compatibility
- ⚠️ Not recommended for new projects

### Use V2 if:
- ✅ Starting a new project
- ✅ Need image optimization
- ✅ Want public/private file control
- ✅ Want bucket management
- ✅ Need better performance
- ✅ Want continued support

---

## Breaking Changes Summary

When migrating from V1 to V2:

1. **Import name** changes: `Ikat` → `IkatV2`
2. **Base URL** changes: `api.ikat.id` → `ikat.id`
3. **Response format** changes: `url` → `urls` (for images)
4. **Upload method** changes: PUT → POST (internal)

---

## Conclusion

| Category | Winner | Reason |
|----------|--------|--------|
| Performance | **V2** | Image optimization, better infrastructure |
| Features | **V2** | More capabilities |
| Ease of Use | **Tie** | Both simple to use |
| Future Support | **V2** | Active development |
| Backward Compat | **V1** | Legacy code support |

**Recommendation:** Migrate to V2 for all new projects and gradually update existing projects.

---

Need help migrating? Check out [MIGRATION.md](./MIGRATION.md) for detailed guide.
