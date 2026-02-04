# patrickwasp.com

My personal blog.

## Overview

- **Framework**: Next.js (App Router) with static export
- **Content**: MDX posts with embedded React components
- **Styling**: Tailwind CSS
- **Comments**: Giscus (GitHub-backed)
- **Theme**: Light/Dark/System with persistent preference

## Setup

```bash
pnpm install
pnpm dev
```

## Project Structure

```
site/
├── app/              # Next.js pages and routes
├── components/       # Reusable React components
├── content/posts/    # MDX blog posts
├── lib/              # Utilities and helpers
└── public/           # Static assets
```

## Posts

Posts live in `content/posts/<slug>/` with their own assets:

```
content/posts/<slug>/
├── index.mdx         # Post content
└── assets/           # Images and files
```

## Build & Deploy

```bash
pnpm build      # Generates static export
pnpm start      # Serve production build
```

Static files are output to `.next/static` ready for any hosting.

## Key Commands

- `pnpm dev` – Development server with hot reload
- `pnpm build` – Create static export
- `pnpm generate-posts` – Index all posts
- `pnpm copy-assets` – Sync post assets to public
