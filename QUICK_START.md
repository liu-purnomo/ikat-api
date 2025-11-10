# Quick Start Guide

Get started with Ikat API in 5 minutes!

## Installation

```bash
npm install ikat-api
```

## Get Your API Key

Visit [https://pro.ikat.id](https://pro.ikat.id) to register and get your API key.

## Choose Your Version

### V2 (Recommended) ⭐

Modern API with image optimization and access control.

```ts
import { IkatV2 } from 'ikat-api';

const ikat = new IkatV2({
  apiKey: 'your-api-key',
  origin: 'https://yourdomain.com' // optional
});
```

### V1 (Deprecated)

Legacy API for backward compatibility.

```ts
import { Ikat } from 'ikat-api';

const ikat = new Ikat({
  apiKey: 'your-api-key',
  origin: 'https://yourdomain.com'
});
```

## Common Operations

### Upload a File

```ts
// Get file from input
const input = document.querySelector('input[type="file"]');
const file = input.files[0];

// Upload
const result = await ikat.upload({
  bucket: 'my-bucket',
  file,
  allowPublicAccess: true // V2 only
});

// Use URLs
console.log(result.urls.original); // Original file
console.log(result.urls.thumb);    // Thumbnail (V2 only, for images)
```

### Delete a File

```ts
await ikat.remove({
  bucket: 'my-bucket',
  key: 'photo.jpg' // or full URL
});
```

### List Files

```ts
const files = await ikat.list('my-bucket');
files.forEach(file => {
  console.log(file.url, file.size);
});
```

### Replace a File

```ts
await ikat.replace({
  bucket: 'avatars',
  file: newFile,
  oldUrl: 'https://ikat.id/user/avatars/old.jpg'
});
```

## V2 Exclusive Features

### Image Optimization

Automatically generates multiple sizes:

```ts
const result = await ikat.upload({ bucket: 'photos', file });

// For images, you get:
result.urls.original; // Original size and format
result.urls.large;    // 1920px WebP
result.urls.small;    // 800px WebP
result.urls.thumb;    // 300px WebP
```

### Private Files

Control access with authentication:

```ts
await ikat.upload({
  bucket: 'private-docs',
  file,
  allowPublicAccess: false // Requires API key to access
});
```

### Bucket Deletion

Delete entire buckets:

```ts
await ikat.deleteBucket('old-bucket');
```

## Next Steps

- 📖 Read the full [README](./README.md)
- 🔄 Check the [Migration Guide](./MIGRATION.md) for V1 → V2
- 📊 Compare [V1 vs V2](./V1_VS_V2.md) features
- 📝 Review the [Changelog](./CHANGELOG.md)

## Need Help?

- 📧 Email: [hi@liupurnomo.com](mailto:hi@liupurnomo.com)
- 📚 Documentation: [https://pro.ikat.id/docs](https://pro.ikat.id/docs)

---

**Pro Tip:** Use V2 for all new projects to get automatic image optimization and access control!
