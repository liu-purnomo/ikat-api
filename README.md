# 📦 ikat-api

Simple Node.js client for [Ikat Pro](https://ikat.id) – a lightweight file sharing service that works like S3 or Cloudinary, but way simpler (and free!).

---

## ✨ What is Ikat Pro?

[Ikat Pro](https://ikat.id) is a minimalist file hosting service. It lets you upload files (like images, PDFs, or ZIPs) via API, store them under a specific bucket, and manage them securely using API keys with domain restrictions.

---

## 🧑‍💻 Getting Started

Before using this package, **you need to register an account** at:

👉 https://api.ikat.id/

After registering and logging in, you’ll get:
- Your personal **API Key**
- The ability to set **Allowed Origins** (for domain-restricted access)
- Access to full documentation at:  
  👉 https://api.ikat.id/docs

---

## 📥 Installation

```bash
npm install ikat-api
````

---

## 🛠️ Usage

```ts
import { Ikat } from 'ikat-api';
import fs from 'fs';

const ikat = new Ikat({
  apiKey: 'your-api-key',
  origin: 'https://yourdomain.com', // optional but recommended
});

const file = fs.readFileSync('./my-image.png');

const uploaded = await ikat.add({
  bucket: 'your-bucket',
  file,
  filename: 'my-image.png',
  contentType: 'image/png',
});

console.log('URL:', uploaded.url);

// List files in bucket
const result = await ikat.file('your-bucket');
console.log(result.files);

// Delete a file
await ikat.delete({ bucket: 'your-bucket', key: 'my-image.png' });
```

---

## ✅ Supported File Types

Only the following file types are allowed:

| Extension | MIME Type         |
| --------- | ----------------- |
| `.jpg`    | `image/jpeg`      |
| `.jpeg`   | `image/jpeg`      |
| `.png`    | `image/png`       |
| `.pdf`    | `application/pdf` |
| `.zip`    | `application/zip` |

---

## 🌐 Origin Protection

To prevent abuse, you can restrict API usage to specific domains by setting `origin` in your Ikat dashboard. Then, pass it in the client:

```ts
const ikat = new Ikat({
  apiKey: 'your-api-key',
  origin: 'https://yourdomain.com',
});
```

---

## 🧪 Testing

This package is tested with [Vitest](https://vitest.dev/).

```bash
npm run test
```

---

## 📄 License

MIT © [Liu Purnomo](https://liupurnomo.com)
# ikat-api
