# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Currently supported versions:

| Version | Supported          |
| ------- | ------------------ |
| 2.0.x   | :white_check_mark: |
| 1.x.x   | :x:                |

## Reporting a Vulnerability

We take the security of ikat-api seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### Please do NOT:

- Open a public GitHub issue for security vulnerabilities
- Disclose the vulnerability publicly before it has been addressed

### Please DO:

1. **Email us directly** at [hi@liupurnomo.com](mailto:hi@liupurnomo.com) with:
   - Description of the vulnerability
   - Steps to reproduce the issue
   - Potential impact
   - Any suggested fixes (optional)

2. **Allow us reasonable time** to respond and address the issue before public disclosure

3. **Use a descriptive subject line** such as "Security Vulnerability in ikat-api"

## What to Expect

After you submit a vulnerability report:

1. **Acknowledgment**: We will acknowledge receipt of your report within 48 hours
2. **Investigation**: We will investigate and validate the issue
3. **Timeline**: We aim to provide an initial assessment within 7 days
4. **Resolution**: We will work on a fix and keep you informed of progress
5. **Credit**: With your permission, we will credit you in the security advisory

## Security Best Practices

When using ikat-api, we recommend:

### 1. API Key Security

- **Never commit API keys** to version control
- **Use environment variables** to store API keys
- **Rotate keys regularly** if they may have been exposed
- **Use different keys** for development and production

```javascript
// Good
const apiKey = process.env.IKAT_API_KEY;

// Bad - Never do this
const apiKey = 'your-actual-api-key-here';
```

### 2. Origin Protection

- **Always set origin** in production to prevent unauthorized access
- **Use HTTPS** for all requests
- **Validate file types** before upload

```javascript
const ikat = new IkatV2({
  apiKey: process.env.IKAT_API_KEY,
  origin: 'https://yourdomain.com' // Always set in production
});
```

### 3. File Upload Security

- **Validate file types** on both client and server
- **Check file sizes** before upload
- **Scan files** for malware if handling user uploads
- **Use private buckets** for sensitive data

```javascript
// Use private access for sensitive files
await ikat.upload({
  bucket: 'user-documents',
  file,
  allowPublicAccess: false // Requires authentication
});
```

### 4. Dependencies

- **Keep dependencies updated** regularly
- **Review security advisories** via `npm audit`
- **Monitor for vulnerabilities** in your package-lock.json

```bash
# Check for vulnerabilities
npm audit

# Fix automatically when possible
npm audit fix
```

## Known Security Considerations

### 1. File Type Validation

The API validates file types based on:
- File extension
- MIME type detection

However, you should implement additional validation on your application side for sensitive use cases.

### 2. Public vs Private Files

- **Public files** (default) are accessible without authentication
- **Private files** require API key for access
- Choose the appropriate setting based on your use case

### 3. CORS Protection

- Origin validation is optional but strongly recommended
- Set allowed origins in your Ikat dashboard
- Use the `origin` parameter when initializing the SDK

## Security Updates

Security updates will be:
- Released as patch versions (e.g., 2.0.2)
- Announced in the CHANGELOG
- Documented in GitHub Security Advisories
- Communicated via email to registered users (if critical)

## Disclosure Policy

When we receive a security report:

1. We will privately confirm the issue
2. We will work on a fix
3. We will release a patch version
4. We will publish a security advisory
5. We will credit the reporter (with permission)

Typical timeline:
- **0-2 days**: Initial response
- **7 days**: Assessment and validation
- **30 days**: Fix development and testing
- **Public disclosure**: After fix is released

## Security Checklist

Before deploying to production:

- [ ] API keys stored in environment variables
- [ ] Origin protection enabled
- [ ] HTTPS enforced
- [ ] File type validation implemented
- [ ] File size limits configured
- [ ] Private buckets used for sensitive data
- [ ] Dependencies updated and audited
- [ ] Error handling implemented
- [ ] Rate limiting configured (server-side)
- [ ] Access logs monitored

## Contact

For security concerns:
- **Email**: [hi@liupurnomo.com](mailto:hi@liupurnomo.com)
- **Subject**: "Security - ikat-api"

For general issues:
- **GitHub Issues**: [github.com/liu-purnomo/ikat-api/issues](https://github.com/liu-purnomo/ikat-api/issues)

## Hall of Fame

We would like to thank the following individuals for responsibly disclosing security vulnerabilities:

*(No vulnerabilities reported yet)*

---

**Note**: This security policy applies to the ikat-api package. For issues with the Ikat service itself, please contact the service provider directly at [https://ikat.id](https://ikat.id).

Last updated: January 11, 2025
