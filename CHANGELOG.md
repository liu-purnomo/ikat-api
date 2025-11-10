# Changelog

All notable changes to this project will be documented in this file.

## [2.0.1] - 2025-01-11

### Changed
- Cleaned up unnecessary development dependencies
- Removed `happy-dom` package (security vulnerability and unused)
- Removed `@vitest/ui` package (not needed for production)
- Removed `dotenv` package (unused in source code)
- Removed `standard-version` package (changelog will be managed manually)
- Removed unnecessary npm scripts related to standard-version
- Updated CHANGELOG format to manual management

### Fixed
- Resolved security vulnerability in happy-dom dependency

---

## [2.0.0] - 2025-01-11

### Added - V2 Features

#### New Class: `IkatV2`
- New modern API client with enhanced features
- Base URL changed from `https://api.ikat.id` to `https://ikat.id`
- Uses `POST` method instead of `PUT` for uploads

#### Image Optimization
- Automatic WebP conversion for uploaded images
- Three optimized sizes generated automatically:
  - **Large**: 1920px width (for hero images)
  - **Small**: 800px width (for content images)
  - **Thumb**: 300px width (for thumbnails)
- Original file is always preserved
- Non-image files return only the original URL

#### Public/Private Access Control
- New `allowPublicAccess` parameter for uploads (default: `true`)
- Control file access: public (anyone) or private (requires authentication)
- Example: `await ikat.upload({ bucket, file, allowPublicAccess: false })`

#### Bucket Deletion
- New `deleteBucket(bucket: string)` method
- Deletes entire bucket and all its contents
- Returns count of deleted files

#### Enhanced Response Format
- Upload response now includes multiple URLs for images:
  - `urls.original` - Original file
  - `urls.large` - 1920px WebP version
  - `urls.small` - 800px WebP version
  - `urls.thumb` - 300px WebP version

#### Improved Delete Operations
- Delete operations automatically remove optimized WebP versions
- Prevents orphaned files in storage

### Changed

- **V1 Deprecated**: The original `Ikat` class is deprecated but still functional
- **Export Structure**: Both `Ikat` (V1) and `IkatV2` are exported
- **Documentation**: Added comprehensive migration guide (MIGRATION.md)

### Breaking Changes (V2 Only)

1. **Base URL**: `https://api.ikat.id` → `https://ikat.id`
2. **Upload Method**: `PUT` → `POST`
3. **Response Format**: Single `url` → `urls` object with multiple versions

### Migration

See [MIGRATION.md](./MIGRATION.md) for detailed migration guide from V1 to V2.

---

## [1.2.0](https://github.com/liu-purnomo/ikat-api/compare/v1.1.0...v1.2.0) (2025-06-25)


### 🐛 Bug Fixes

* make replace() deletion step non-blocking ([6d4d11b](https://github.com/liu-purnomo/ikat-api/commit/6d4d11b56c8bf7cd88a55a27597b5fd3d5daac7e))

## [1.1.0](https://github.com/liu-purnomo/ikat-api/compare/v1.0.1...v1.1.0) (2025-06-25)


### ✨ Features

* support full URL in delete/remove ([ef6f6e3](https://github.com/liu-purnomo/ikat-api/commit/ef6f6e3d70afabefc73a0d66fe0cc9232e4613b1))

### 1.0.1 (2025-06-24)
