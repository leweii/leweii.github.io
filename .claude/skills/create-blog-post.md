---
name: create-blog-post
description: Create a new blog post with proper format and structure for this Jekyll blog
---

# Create Blog Post Skill

This skill helps create new blog posts for this Jekyll-based blog (Chirpy theme).

## Project Information

**Theme**: Jekyll Chirpy Theme
**Language**: Chinese (zh)
**Timezone**: Asia/Shanghai
**Site URL**: https://www.jakobhe.com
**Author**: Jakob He (leweii)

## Project Structure

```
leweii.github.io/
├── .claude/
│   └── skills/              # Claude Code skills
├── _config.yml              # Jekyll configuration
├── _data/                   # Data files (authors, contact, locales)
├── _includes/               # Reusable components
├── _layouts/                # Page layouts (post, page, home, etc.)
├── _posts/                  # Blog posts (organized by year/month)
│   ├── 2014/
│   ├── 2015/
│   ├── ...
│   ├── 2025/
│   └── 2026/
│       ├── 01/
│       └── 02/
├── _sass/                   # Stylesheets
├── _tabs/                   # Main navigation tabs
│   ├── about.md
│   ├── archives.md
│   ├── categories.md
│   └── tags.md
├── assets/                  # Static assets
│   ├── css/
│   ├── img/
│   └── js/
└── _site/                   # Generated site (ignored in git)
```

## Blog Post Structure

### Directory Structure
Posts are organized by year and month:
```
_posts/
  └── YYYY/
      └── MM/
          └── YYYY-MM-DD-post-slug.md
```

### File Naming Convention
- Format: `YYYY-MM-DD-post-slug.md`
- Example: `2026-02-03-ai-development-workflow.md`
- Use lowercase with hyphens for the slug

### Frontmatter Format
Every blog post must start with YAML frontmatter:

```yaml
---
title: "文章标题"
description:
create_time: YYYY-MM-DD HH:MM
tags:
  - tag1
  - tag2
  - tag3
published: true
---
```

#### Frontmatter Fields
- `title`: The post title (can be in Chinese or English)
- `description`: Optional brief description of the post
- `create_time`: Creation timestamp in format `YYYY-MM-DD HH:MM`
- `tags`: List of tags (array format with `-` prefix)
- `published`: Boolean, set to `true` to publish, `false` to keep as draft

## Common Tags

### Recent Tags (2025-2026)
The most commonly used tags in recent posts:
- `ai` - AI-related topics
- `claude-code` - Claude Code tool and usage
- `skill` - Skill development and guides
- `workflow` - Development workflows and processes
- `development` - Software development
- `agent` - AI agents
- `tech` - Technical topics
- `life` - Life and personal posts
- `photo` - Photography

### Historical Tags
Other tags used throughout the blog:
- `career` - Career development
- `devops` - DevOps practices
- `engineering` - Engineering topics
- `essay` - Essay-style posts
- `productivity` - Productivity tips
- `reading` - Reading notes
- `tips` - Tips and tricks

## Steps to Create a New Post

1. **Determine the date**: Use today's date in YYYY-MM-DD format
2. **Create directory structure**:
   ```bash
   mkdir -p _posts/YYYY/MM
   ```
3. **Choose a descriptive slug**: Short, lowercase, hyphenated title
4. **Create the file**: `_posts/YYYY/MM/YYYY-MM-DD-slug.md`
5. **Add frontmatter**: Copy the frontmatter template and fill in:
   - title
   - create_time (use today's date with 00:00 time)
   - tags (relevant tags for the post)
   - published (set to true if ready to publish)
6. **Leave content area empty**: After the closing `---`, add a blank line

## Example

For a post about "AI Development Workflow" on 2026-02-03:

**File**: `_posts/2026/02/2026-02-03-ai-development-workflow.md`

**Content**:
```markdown
---
title: "AI 的开发流程"
description:
create_time: 2026-02-03 00:00
tags:
  - ai
  - workflow
  - development
published: true
---

```

## Recent Blog Topics

Recent posts (2026) have focused on:
- Claude Code skills and tips
- AI development workflows
- Agent development and forms
- Vertical domain skill development
- File system management
- Spec-driven development projects

The blog tends to focus on:
- Technical guides and tutorials
- AI and development tools
- Personal reflections on work and life
- Photography and creative pursuits

## Configuration Details

### From _config.yml
- **Language**: `zh` (Chinese)
- **Timezone**: `Asia/Shanghai`
- **Pagination**: 10 posts per page
- **TOC**: Enabled by default for posts
- **Comments**: Enabled via Giscus
- **Theme Mode**: Auto (follows system preference with toggle)
- **Markdown Engine**: Kramdown with Rouge syntax highlighting
- **Permalink**: `/posts/:title/`

### Post Defaults
All posts in `_posts/` automatically get:
- Layout: `post`
- Comments: `true`
- TOC: `true`

### Directory Organization
Posts are organized by year/month to avoid clutter:
```
_posts/
  └── YYYY/          # Year folder
      └── MM/        # Month folder (01-12)
          └── YYYY-MM-DD-slug.md
```

## Best Practices

1. **Naming**: Use descriptive, hyphenated slugs (e.g., `ai-development-workflow`)
2. **Tags**: Choose 2-4 relevant tags from the common tags list
3. **Title**: Write clear, descriptive titles (can be Chinese or English)
4. **Date**: Always use today's date in format `YYYY-MM-DD HH:MM`
5. **Published**: Set to `true` when ready, or `false` to keep as draft

## Quick Commands

### Create new post directory
```bash
mkdir -p _posts/$(date +%Y/%m)
```

### Create new post file
```bash
touch _posts/$(date +%Y/%m)/$(date +%Y-%m-%d)-post-slug.md
```

### Build and serve locally
```bash
bundle exec jekyll serve
```

### Check site at
```
http://localhost:4000
```

## Notes
- The blog supports both English and Chinese content
- Leave a blank line after the frontmatter closing `---`
- Most posts in this blog are written in Chinese
- The `description` field is often left empty
- Time in `create_time` is typically set to `00:00`
- The site uses CDN: `https://img.jakobhe.com` for media resources
- Posts automatically have Table of Contents (TOC) enabled
- Comments are powered by Giscus (GitHub Discussions)
- The blog uses responsive design and supports dark/light themes
