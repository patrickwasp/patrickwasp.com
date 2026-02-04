#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const POSTS_DIR = path.join(process.cwd(), 'content/posts');
const PUBLIC_DIR = path.join(process.cwd(), 'public/blog');

// Ensure public/blog directory exists
if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}

// Get all post directories
const postDirs = fs.readdirSync(POSTS_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

// Copy assets for each post
for (const postSlug of postDirs) {
    const assetsSource = path.join(POSTS_DIR, postSlug, 'assets');
    const assetsTarget = path.join(PUBLIC_DIR, postSlug, 'assets');

    if (fs.existsSync(assetsSource)) {
        // Ensure target directory exists
        fs.mkdirSync(path.dirname(assetsTarget), { recursive: true });

        // Copy assets directory
        if (fs.existsSync(assetsTarget)) {
            fs.rmSync(assetsTarget, { recursive: true });
        }

        copyDir(assetsSource, assetsTarget);
        console.log(`✓ Copied assets for ${postSlug}`);
    }
}

function copyDir(src, dest) {
    fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

console.log('Post assets copied to public directory');
