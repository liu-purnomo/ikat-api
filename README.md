# 📦 ikat-api

Simple SDK for [Ikat Pro](https://ikat.id) – a modern and minimalist file hosting service that works like S3 or Cloudinary, but way simpler (and free!).

---

## ✨ What is Ikat Pro?

[Ikat Pro](https://ikat.id) is a zero-config file storage service. It lets you:
- Upload files under a specific bucket
- Get a public URL instantly
- Delete, list, or replace files via API
- Use API keys with domain restrictions

---

## 🚀 Quick Start

### 1. Register & Get API Key

👉 https://api.ikat.id/

You'll receive:
- ✅ API Key
- ✅ Allowed Origin (for CORS protection)
- ✅ Access to docs at https://api.ikat.id/docs

---

### 2. Install Package

```bash
npm install ikat-api
````

---

## 🛠️ Usage

### ✅ Initialize

```ts
import { Ikat } from 'ikat-api';

const ikat = new Ikat({
  apiKey: 'your-api-key',
  origin: 'https://yourdomain.com', // optional, highly recommended for browser
});
```

---

### 📤 Upload a File

```ts
const input = document.querySelector('input[type="file"]');
const file = input.files[0];

await ikat.upload({
  bucket: 'my-bucket',
  file,
});
```

---

### 📥 Upload Multiple Files

```ts
const files = [...document.querySelector('input[type="file"]').files];
await ikat.uploadMultiple('my-bucket', files);
```

---

### 🔁 Replace a File

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
await ikat.remove({
  bucket: 'my-bucket',
  key: 'old-image.jpg', // or full URL
});
```

---

### ❌❌ Delete Multiple Files

```ts
await ikat.deleteMultiple('my-bucket', [
  'img1.png',
  'https://api.ikat.id/user-id/my-bucket/img2.png',
]);
```

---

### 📂 List Files in Bucket

```ts
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

Made with ❤️ to simplify file uploads.
