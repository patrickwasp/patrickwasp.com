# Content Structure

All blog posts are self-contained within their own folders under `content/posts/`.

## Post Folder Structure

Each post should follow this structure:

```
content/posts/my-post-slug/
├── index.mdx          # Main post content
├── components/        # Post-specific React components (optional)
│   └── MyComponent.tsx
└── assets/           # Post-specific images and files (optional)
    └── hero.svg
```

## Creating a New Post

1. Create a new folder: `content/posts/your-post-slug/`
2. Create `index.mdx` with frontmatter:

```mdx
---
title: "Your Post Title"
date: "2024-01-01"
description: "A brief description"
image: "/blog/your-post-slug/assets/hero.svg"
tags: ["tag1", "tag2"]
draft: false
---

Your post content goes here...
```

## Using Components

Import components from the local `components` folder:

```mdx
---
title: "Your Post Title"
date: "2024-01-01"
description: "A brief description"
image: "/blog/your-post-slug/assets/hero.svg"
tags: ["tag1", "tag2"]
draft: false
---

import { MyComponent } from './components/MyComponent';

Regular markdown content...

<MyComponent prop="value" />

More content...
```

## Using Images

1. Place images in the `assets/` folder
2. Reference them with: `/blog/your-post-slug/assets/image.svg`
3. Assets are automatically copied to `public/blog/` during build

## Important Notes

- **Metadata**: Use YAML frontmatter at the top of the file
- **Components**: Must include `'use client'` directive for interactive components
- **Images**: Use relative paths starting with `/blog/post-slug/assets/`
- **Self-Contained**: Each post folder should be portable and self-contained
