# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal blog built with Jekyll using the Chirpy theme. The site is configured for Chinese language content, uses the Asia/Shanghai timezone, and is deployed at https://www.jakobhe.com.

**Key Technologies:**
- Jekyll 4.3+ (Static site generator)
- Chirpy Theme 7.3.1 (Responsive technical blog theme)
- Ruby ~3.1 (Required runtime)
- Node.js (For asset building)
- Bootstrap 5.3+ (CSS framework)
- Rollup (JavaScript bundler)

## Common Development Commands

### Jekyll Operations

```bash
# Install dependencies
bundle install
npm install

# Serve locally with live reload
bundle exec jekyll serve -l
# Or use the helper script:
bash tools/run.sh

# Serve with custom host
bash tools/run.sh -H 0.0.0.0

# Build for production
JEKYLL_ENV=production bundle exec jekyll build

# Test the built site (includes html-proofer)
bash tools/test.sh
```

### Asset Building

```bash
# Build all assets (CSS + JS)
npm run build

# Build CSS only (PurgeCSS)
npm run build:css

# Build JS only (Rollup)
npm run build:js

# Watch JS for changes
npm run watch:js

# Lint JavaScript
npm run lint:js

# Lint SCSS
npm run lint:scss

# Fix SCSS issues
npm run lint:fix:scss

# Run all tests (linting)
npm test
```

### Local Development
The site runs at `http://localhost:4000` by default. Jekyll uses incremental builds and live reload.

## Blog Post Structure

### File Organization
Posts are organized by year and month:
```
_posts/
  └── YYYY/          # Year folder (e.g., 2026/)
      └── MM/        # Month folder (e.g., 01/, 02/)
          └── YYYY-MM-DD-post-slug.md
```

### Post Frontmatter Format
```yaml
---
title: "文章标题"
description:             # Optional
create_time: YYYY-MM-DD HH:MM
tags:
  - tag1
  - tag2
published: true          # Set false for drafts
---
```

**Important:**
- File naming: `YYYY-MM-DD-slug.md` (lowercase, hyphenated)
- Create month directories if they don't exist: `mkdir -p _posts/$(date +%Y/%m)`
- Most posts are written in Chinese
- Common tags: `ai`, `claude-code`, `skill`, `workflow`, `development`, `agent`, `tech`, `life`

## Architecture

### Directory Structure

```
leweii.github.io/
├── _config.yml              # Jekyll & site configuration
├── _posts/YYYY/MM/          # Blog posts (organized by date)
├── _layouts/                # Page templates (post, page, home, etc.)
├── _includes/               # Reusable components & partials
├── _sass/                   # SCSS source files
├── _javascript/             # JavaScript source files
│   ├── *.js                 # Main scripts (commons, home, post, etc.)
│   └── pwa/                 # PWA-related scripts (app.js, sw.js)
├── _data/                   # Data files (authors, locales, contact)
├── _tabs/                   # Navigation tabs (about, archives, etc.)
├── assets/                  # Static assets (compiled CSS/JS, images)
│   └── js/dist/             # Compiled JavaScript output
├── _plugins/                # Custom Jekyll plugins
└── _site/                   # Generated site (git-ignored)
```

### Asset Build Pipeline

**CSS Pipeline:**
1. Bootstrap CSS is purged using PurgeCSS (`purgecss.js`)
2. Purged CSS output to `_sass/vendors/_bootstrap.scss`
3. Jekyll compiles SCSS to CSS during build

**JavaScript Pipeline:**
1. Source files in `_javascript/` (ES6+)
2. Rollup bundles and transpiles via Babel
3. Production builds are minified with Terser
4. Output to `assets/js/dist/*.min.js`
5. PWA scripts (`app.js`, `sw.js`) get Jekyll frontmatter injected

**Scripts built:** `commons`, `home`, `categories`, `page`, `post`, `misc`, `theme`, `app`, `sw`

### Layout System

**Layout Hierarchy:**
- `default.html` - Base layout (HTML structure, head, sidebar)
- `compress.html` - HTML compression wrapper
- `home.html` - Homepage with post list
- `post.html` - Individual blog post
- `page.html` - Static pages
- `archives.html` - Chronological post archive
- `categories.html` / `category.html` - Category views
- `tags.html` / `tag.html` - Tag views

**Key Includes:**
- `head.html` - Meta tags, CSS, favicons
- `sidebar.html` - Left sidebar navigation
- `topbar.html` - Top navigation bar
- `footer.html` - Site footer
- `toc.html` - Table of contents for posts
- `comment.html` - Comments system (Giscus)

### Configuration

**Jekyll Settings (_config.yml):**
- Language: `zh` (Chinese)
- Timezone: `Asia/Shanghai`
- Pagination: 10 posts per page
- Permalink: `/posts/:title/`
- Comments: Giscus (GitHub Discussions)
- CDN: `https://img.jakobhe.com` for media
- PWA enabled with offline cache

**Post Defaults:**
- Layout: `post`
- Comments: `true`
- TOC: `true`

## Commit Conventions

This project uses **Conventional Commits** enforced by Commitlint (via Husky).

**Format:** `type(scope): subject`

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `perf`: Performance improvement
- `refactor`: Code refactoring
- `docs`: Documentation changes
- `chore`: Maintenance tasks

**Example:** `feat(blog): add AI development workflow post`

The commit message hook runs automatically on commit.

## Skills and Automation

The repository has Claude Code skills in `.claude/skills/`:
- `create-blog-post.md` - Guide for creating new blog posts with proper format

When creating blog posts, always follow the format defined in this skill.

## Important Notes

- **Ruby Version:** Requires Ruby ~3.1 (check `.ruby-version`)
- **Generated Files:** `_site/` and `assets/js/dist/` are git-ignored
- **CSS Purging:** Modifying HTML/JS structure may require updating PurgeCSS safelist in `purgecss.js`
- **PWA:** Service worker is automatically generated; changes require cache bust
- **Media:** Images should use the CDN path prefix when possible
- **Testing:** `tools/test.sh` runs HTML Proofer to validate internal links
