# Examples

This folder contains practical examples for using the Ikat API SDK.

## Files

### [v2-basic.ts](./v2-basic.ts)
Basic operations with IkatV2:
- Upload public/private files
- List files
- Delete files
- Replace files
- Batch operations
- Error handling
- Generate responsive HTML

### [migration-example.ts](./migration-example.ts)
Side-by-side comparison of V1 and V2 code:
- How to migrate each operation
- Using both versions together
- URL migration helpers
- Feature detection

## Running the Examples

### Prerequisites

1. Install dependencies:
```bash
npm install
```

2. Set your API key:
```bash
export IKAT_API_KEY="your-api-key"
```

Or create a `.env` file:
```
IKAT_API_KEY=your-api-key
```

### TypeScript

```bash
# Run with ts-node
npx ts-node examples/v2-basic.ts

# Or compile and run
npx tsc examples/v2-basic.ts
node examples/v2-basic.js
```

### JavaScript

```bash
# Compile first
npx tsc examples/v2-basic.ts

# Then run
node examples/v2-basic.js
```

## Quick Examples

### Upload an Image

```ts
import { IkatV2 } from 'ikat-api';

const ikat = new IkatV2({ apiKey: process.env.IKAT_API_KEY });

const result = await ikat.upload({
  bucket: 'photos',
  file,
  allowPublicAccess: true
});

// Use optimized versions
console.log(result.urls.thumb);  // 300px thumbnail
console.log(result.urls.small);  // 800px
console.log(result.urls.large);  // 1920px
```

### Upload a Private Document

```ts
const result = await ikat.upload({
  bucket: 'invoices',
  file,
  allowPublicAccess: false // Requires API key
});
```

### Delete a Bucket

```ts
const result = await ikat.deleteBucket('old-project');
console.log(`Deleted ${result.filesDeleted} files`);
```

## Common Use Cases

### Profile Picture Upload
```ts
async function uploadProfilePicture(file: File) {
  const result = await ikat.upload({
    bucket: 'profiles',
    file,
    allowPublicAccess: true
  });

  // Store thumbnail for avatars
  return result.urls.thumb;
}
```

### Gallery Upload
```ts
async function uploadGallery(files: File[]) {
  const results = await ikat.uploadMultiple('gallery', files, true);

  return results
    .filter(r => r.success)
    .map(r => r.data.urls);
}
```

### Private Document Storage
```ts
async function uploadInvoice(file: File) {
  const result = await ikat.upload({
    bucket: 'invoices',
    file,
    allowPublicAccess: false
  });

  return result.urls.original;
}
```

## Tips

1. **Use Environment Variables**: Store your API key in environment variables, never in code
2. **Handle Errors**: Wrap uploads in try-catch blocks
3. **Use TypeScript**: Get better IntelliSense and type safety
4. **Optimize Images**: Use V2's automatic optimization for better performance
5. **Access Control**: Set `allowPublicAccess: false` for sensitive files

## Need Help?

- 📖 Read the full [README](../README.md)
- 🔄 Check the [Migration Guide](../MIGRATION.md)
- 📊 Compare [V1 vs V2](../V1_VS_V2.md)

## Contributing

Found a bug or have a suggestion? Open an issue on [GitHub](https://github.com/liu-purnomo/ikat-api/issues).
