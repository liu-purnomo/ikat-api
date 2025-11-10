# 📦 ikat-api

Simple SDK for [Ikat](https://ikat.id) – a modern and minimalist file hosting service that works like S3 or Cloudinary, but way simpler (and free!).

---

## 📋 Version Information

This package now includes **two versions**:

### Version 1 (Deprecated) - `Ikat`
> ⚠️ **DEPRECATED**: Uses old base URL `https://api.ikat.id`. Kept for backward compatibility.

- Base URL: `https://api.ikat.id`
- Upload method: `PUT /upload/:bucket`
- Response: Single URL only
- Features: Basic upload, delete, list

### Version 2 (Recommended) - `IkatV2`
> ✅ **RECOMMENDED**: Uses new base URL `https://ikat.id` with enhanced features.

- Base URL: `https://ikat.id`
- Upload method: `POST /upload/:bucket`
- Response: Multiple URLs (original + optimized versions for images)
- Features:
  - 🖼️ **Automatic image optimization** (generates large, small, thumb WebP versions)
  - 🔒 **Public/Private toggle** (`allowPublicAccess` parameter)
  - 🗑️ **Bucket deletion** (delete entire bucket and contents)
  - ⚡ **Better performance** with optimized infrastructure

---

## ✨ What is Ikat?

[Ikat](https://ikat.id) is a zero-config file storage service. It lets you:
- Upload files under a specific bucket
- Get a public URL instantly (or keep it private)
- Automatic image optimization with multiple sizes
- Delete, list, or replace files via API
- Use API keys with domain restrictions

---

## 🚀 Quick Start

### 1. Register & Get API Key

👉 https://ikat.id/

You'll receive:
- ✅ API Key
- ✅ Allowed Origin (for CORS protection)
- ✅ Access to docs at https://ikat.id/docs

---

### 2. Install Package

```bash
npm install ikat-api
````

---

## 🛠️ Usage

### ✅ Initialize (Version 2 - Recommended)

```ts
import { IkatV2 } from 'ikat-api';

const ikat = new IkatV2({
  apiKey: 'your-api-key',
  origin: 'https://yourdomain.com', // optional, highly recommended for browser
});
```

### ✅ Initialize (Version 1 - Deprecated)

```ts
import { Ikat } from 'ikat-api';

const ikat = new Ikat({
  apiKey: 'your-api-key',
  origin: 'https://yourdomain.com', // optional, highly recommended for browser
});
```

---

### 📤 Upload a File

#### Version 2 (Recommended)

```ts
const input = document.querySelector('input[type="file"]');
const file = input.files[0];

// Upload with public access (default)
const result = await ikat.upload({
  bucket: 'my-bucket',
  file,
});

// For images, you get multiple optimized versions
console.log(result.urls.original); // Original file
console.log(result.urls.large);    // 1920px WebP version
console.log(result.urls.small);    // 800px WebP version
console.log(result.urls.thumb);    // 300px WebP version

// Upload with private access
const privateResult = await ikat.upload({
  bucket: 'private-docs',
  file,
  allowPublicAccess: false, // File requires authentication
});
```

#### Version 1 (Deprecated)

```ts
const input = document.querySelector('input[type="file"]');
const file = input.files[0];

await ikat.upload({
  bucket: 'my-bucket',
  file,
});
// Returns single URL only, no image optimization
```

---

### 📥 Upload Multiple Files

#### Version 2 (Recommended)

```ts
const files = [...document.querySelector('input[type="file"]').files];

// Upload all as public
await ikat.uploadMultiple('my-bucket', files, true);

// Upload all as private
await ikat.uploadMultiple('private-bucket', files, false);
```

#### Version 1 (Deprecated)

```ts
const files = [...document.querySelector('input[type="file"]').files];
await ikat.uploadMultiple('my-bucket', files);
```

---

### 🔁 Replace a File

#### Version 2 (Recommended)

```ts
await ikat.replace({
  bucket: 'my-bucket',
  file: newFile,
  oldUrl: 'https://ikat.id/user-id/my-bucket/old-image.jpg',
  allowPublicAccess: true, // Optional, defaults to true
});
```

#### Version 1 (Deprecated)

```ts
await ikat.replace({
  bucket: 'my-bucket',
  file: newFile,
  oldUrl: 'https://api.ikat.id/user-id/my-bucket/old-image.jpg',
});
```

> ✅ You can pass either full URL or just filename (e.g., `old-image.jpg`)

---

### ❌ Delete a File

```ts
// Works the same in both versions
await ikat.remove({
  bucket: 'my-bucket',
  key: 'old-image.jpg', // or full URL
});
```

> 🔥 V2 automatically deletes optimized WebP versions when deleting images

---

### ❌❌ Delete Multiple Files

```ts
// Works the same in both versions
await ikat.deleteMultiple('my-bucket', [
  'img1.png',
  'https://ikat.id/user-id/my-bucket/img2.png',
]);
```

---

### 🗑️ Delete Entire Bucket (V2 Only)

```ts
// Only available in Version 2
const result = await ikat.deleteBucket('old-bucket');
console.log(`Deleted ${result.filesDeleted} files`);
```

---

### 📂 List Files in Bucket

```ts
// Works the same in both versions
const files = await ikat.list('my-bucket');
console.log(files);
```

---

## 🧾 Supported File Types

| Extension | MIME Type         |
| --------- | ----------------- |
| `.jpg`    | `image/jpeg`      |
| `.jpeg`   | `image/jpeg`      |
| `.png`    | `image/png`       |
| `.pdf`    | `application/pdf` |
| `.zip`    | `application/zip` |

---

## 🔒 Origin Protection (CORS)

To secure your API:

1. Go to [https://api.ikat.id](https://api.ikat.id)
2. Set allowed origins (e.g. `https://yourdomain.com`)
3. In your code, always set:

```ts
const ikat = new Ikat({
  apiKey: 'your-api-key',
  origin: 'https://yourdomain.com',
});
```

---

## 🧪 Testing

```bash
npm run test
```

---

## 📄 License

MIT © [Liu Purnomo](https://liupurnomo.com)

---

## 🔒 Security

For security issues, please see our [Security Policy](./SECURITY.md).

We take security seriously and follow best practices for handling vulnerabilities.

---

## 🤝 Contributing

We welcome contributions! Please read our [Code of Conduct](./CODE_OF_CONDUCT.md) before contributing.

---

## 🔄 Migration Guide (V1 → V2)

### Why Migrate to V2?

Version 2 offers significant improvements:
- ✅ **Automatic image optimization** - Get WebP versions in multiple sizes
- ✅ **Public/Private toggle** - Control file access with `allowPublicAccess`
- ✅ **Bucket deletion** - Delete entire buckets with one call
- ✅ **Better performance** - Simplified base URL `https://ikat.id`
- ✅ **Continued support** - V1 is deprecated and won't receive updates

### Migration Steps

#### 1. Update Import

```diff
- import { Ikat } from 'ikat-api';
+ import { IkatV2 } from 'ikat-api';
```

#### 2. Update Initialization

```diff
- const ikat = new Ikat({
+ const ikat = new IkatV2({
    apiKey: 'your-api-key',
    origin: 'https://yourdomain.com',
  });
```

#### 3. Update Upload Calls

```diff
- await ikat.upload({ bucket: 'images', file });
+ const result = await ikat.upload({ bucket: 'images', file });
+ // Now you get multiple URLs for images:
+ console.log(result.urls.original);
+ console.log(result.urls.large); // 1920px WebP
+ console.log(result.urls.small); // 800px WebP
+ console.log(result.urls.thumb); // 300px WebP
```

#### 4. Add Privacy Control (Optional)

```ts
// V2 allows you to control public access
await ikat.upload({
  bucket: 'private-docs',
  file,
  allowPublicAccess: false, // Requires authentication
});
```

#### 5. Update URL References

Replace all hardcoded URLs in your code:
```diff
- https://api.ikat.id/user-id/bucket/file.jpg
+ https://ikat.id/user-id/bucket/file.jpg
```

### Breaking Changes

1. **Base URL changed**: `https://api.ikat.id` → `https://ikat.id`
2. **Upload method changed**: `PUT /upload/:bucket` → `POST /upload/:bucket`
3. **Response format changed**: Single `url` → Multiple `urls` object for images

### Backward Compatibility

Don't worry! Both versions are available in the same package:
- `Ikat` (V1) - Still works, shows deprecation warning
- `IkatV2` (V2) - New recommended version

You can migrate gradually:
```ts
import { Ikat, IkatV2 } from 'ikat-api';

// Keep using V1 for existing features
const oldClient = new Ikat({ apiKey: 'key' });

// Use V2 for new features
const newClient = new IkatV2({ apiKey: 'key' });
```

### Need Help?

For questions or support during migration, please contact [hi@liupurnomo.com](mailto:hi@liupurnomo.com)

---

Made with ❤️ to simplify file uploads.
