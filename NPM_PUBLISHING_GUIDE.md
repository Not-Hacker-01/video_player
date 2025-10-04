# NPM Publishing Guide for Video Ad Player SDK

This guide will walk you through publishing your Video Ad Player SDK to npm so anyone can install and use it.

## Package Name

The package is currently named: **`video-ad-player-sdk`**

You can change this name in `package.json` by editing the `"name"` field:

```json
{
  "name": "video-ad-player-sdk"  // Change this to your preferred name
}
```

### Naming Guidelines:

1. **Unscoped packages**: `video-ad-player-sdk`, `my-video-player`, `awesome-video-ads`
2. **Scoped packages** (recommended): `@yourname/video-ad-player`, `@company/video-ads`
   - Scoped packages prevent name conflicts
   - Example: `@john/video-player` or `@mycompany/ad-player`

**To use a scoped package**, change the name to:
```json
{
  "name": "@yourusername/video-ad-player"
}
```

## Prerequisites

1. **npm account**: Create one at [npmjs.com/signup](https://www.npmjs.com/signup)
2. **Git repository** (optional but recommended): GitHub, GitLab, or Bitbucket
3. **Email verified** on your npm account

## Step-by-Step Publishing Instructions

### Step 1: Login to npm

Open your terminal and run:

```bash
npm login
```

Enter your:
- Username
- Password
- Email (this is public)
- One-time password (if 2FA is enabled)

Verify login:
```bash
npm whoami
```

### Step 2: Update Package Information

Edit `package.json` and update these fields:

```json
{
  "name": "video-ad-player-sdk",  // Your chosen package name
  "version": "1.0.0",
  "author": "Your Name <your.email@example.com>",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/video-ad-player-sdk.git"
  },
  "bugs": {
    "url": "https://github.com/yourusername/video-ad-player-sdk/issues"
  },
  "homepage": "https://github.com/yourusername/video-ad-player-sdk#readme"
}
```

### Step 3: Create a README.md

Copy the SDK documentation from `src/sdk/README.md` to the root:

```bash
cp src/sdk/README.md README.md
```

Then update the package name in all examples throughout README.md.

### Step 4: Add a LICENSE File

Create a `LICENSE` file in the root. For MIT License:

```
MIT License

Copyright (c) 2025 Your Name

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### Step 5: Build the Library

Build the library for distribution:

```bash
npm run build:lib
```

This will:
1. Run TypeScript compiler to generate type definitions
2. Bundle the SDK with Vite
3. Create a `dist/` folder with your package files

### Step 6: Test the Package Locally

Before publishing, test your package locally:

```bash
npm pack
```

This creates a `.tgz` file. Install it in another project to test:

```bash
cd /path/to/test-project
npm install /path/to/video-ad-player-sdk/video-ad-player-sdk-1.0.0.tgz
```

### Step 7: Publish to npm

#### For Public Packages (Free):

```bash
npm publish
```

#### For Scoped Public Packages:

```bash
npm publish --access public
```

#### For Private Packages (Requires paid npm account):

```bash
npm publish
```

### Step 8: Verify Publication

1. Visit: `https://www.npmjs.com/package/video-ad-player-sdk` (use your package name)
2. Check that all information is correct
3. Try installing it:

```bash
npm install video-ad-player-sdk
```

## Updating Your Package

When you make changes and want to publish a new version:

### 1. Update Version Number

Use npm's built-in versioning:

```bash
# For bug fixes (1.0.0 -> 1.0.1)
npm version patch

# For new features (1.0.0 -> 1.1.0)
npm version minor

# For breaking changes (1.0.0 -> 2.0.0)
npm version major
```

### 2. Publish the Update

```bash
npm publish
```

## How Others Will Use Your Package

Once published, anyone can install and use your SDK:

### Installation:

```bash
npm install video-ad-player-sdk
```

### Usage:

```typescript
import { createVideoAdPlayer } from 'video-ad-player-sdk';

const player = createVideoAdPlayer({
  videoId: 'dQw4w9WgXcQ',
  position: 'bottom-right',
  size: 'medium',
  closeable: true
});
```

## Unpublishing (Emergency Only)

If you need to unpublish (within 72 hours):

```bash
npm unpublish video-ad-player-sdk --force
```

**Warning**: Unpublishing is discouraged. Use `npm deprecate` instead for old versions:

```bash
npm deprecate video-ad-player-sdk@1.0.0 "Please upgrade to 1.1.0"
```

## Best Practices

1. **Semantic Versioning**: Follow semver (major.minor.patch)
2. **Changelog**: Keep a CHANGELOG.md file
3. **Git Tags**: Tag releases in git
4. **Documentation**: Keep README.md up-to-date
5. **Testing**: Test before each publish
6. **CI/CD**: Consider automating with GitHub Actions

## Common Issues

### Package Name Already Taken

If the name is taken, try:
1. Use a scoped package: `@yourname/video-ad-player`
2. Add a suffix: `video-ad-player-pro`, `video-ad-player-sdk`
3. Use a unique name: `videoadz`, `adplay-video`

### Authentication Error

```bash
npm logout
npm login
```

### Build Errors

```bash
rm -rf node_modules dist
npm install
npm run build:lib
```

## Example: Complete Publishing Flow

```bash
# 1. Login to npm
npm login

# 2. Update package.json with your info
# Edit: name, author, repository, etc.

# 3. Build the library
npm run build:lib

# 4. Test locally
npm pack
# Test the .tgz file in another project

# 5. Publish
npm publish --access public

# 6. Verify
npm info video-ad-player-sdk

# Done! Your package is live!
```

## Getting Help

- npm documentation: https://docs.npmjs.com/
- npm support: https://www.npmjs.com/support
- Package naming: https://docs.npmjs.com/cli/v10/configuring-npm/package-json#name

## Success!

Once published, share your package:
- npm page: `https://www.npmjs.com/package/your-package-name`
- GitHub releases
- Social media
- Developer communities
