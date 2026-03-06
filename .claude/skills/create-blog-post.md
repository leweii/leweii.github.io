---
name: create-blog-post
description: |
  Create a new blog post draft with frontmatter metadata.
  Trigger: user says to create a new post, or provides a title and optional directory path.
  Input: post title (required), target directory path (optional), tags (optional), published status (optional).
---

# Create Blog Post

## File Path Rules

1. **Directory**: `_posts/YYYY/MM/` — organized by year and month
   - If user provides a path like `_posts/2026/03`, use it directly
   - If no path given, use today's date: `_posts/$(date +%Y)/$(date +%m)/`
   - Create the directory if it doesn't exist: `mkdir -p <dir>`

2. **File name**: `YYYY-MM-DD-slug.md`
   - Date defaults to today
   - Slug: derive from the title, lowercase, hyphenated, English
   - Example: title "Develop an AI Develop Team" → `2026-03-06-develop-an-ai-develop-team.md`

3. **Full path example**: `_posts/2026/03/2026-03-06-develop-an-ai-develop-team.md`

## Frontmatter Template

```yaml
---
title: "<post title as provided by user>"
create_time: YYYY-MM-DD HH:MM
tags:
  - tag1
  - tag2
published: false
---
```

### Field Rules

| Field | Rule |
|-------|------|
| `title` | Use the exact title the user provides. Can be Chinese or English. |
| `create_time` | Today's date + `10:00` as default time. Format: `YYYY-MM-DD HH:MM` |
| `tags` | Infer 2-3 relevant tags from the title. Common: `ai`, `claude-code`, `skill`, `workflow`, `development`, `agent`, `tech`, `life` |
| `published` | Default `false` (draft). Set `true` only if user explicitly says to publish. |
| `description` | Omit unless user provides one. |

## YAML Frontmatter Validation Rules

These rules prevent broken builds. **Always follow them.**

1. **No trailing whitespace** — especially on `---` delimiters and tag lines. Trailing spaces can merge YAML lines and break parsing (e.g. `- ai  - developmentpublished: false`)
2. **Always quote the title** — use `title: "My Title"`, never `title: My Title`
3. **Use `create_time`, not `date`** — the field name is `create_time: YYYY-MM-DD HH:MM`
4. **No `categories` field** — this project uses `tags` only, never `categories`
5. **Tags must be lowercase** — use `life` not `Life`, `claude-code` not `Claude`
6. **Tags as YAML list** — each tag on its own indented line with `  - tag`, never inline
7. **Always include `description:`** — even if empty, include the field
8. **Double-check the filename slug** — no typos, must match the title accurately

## Procedure

1. Determine the file path from user input or today's date
2. Create the directory if needed (`mkdir -p`)
3. Write the file with frontmatter only — no body content unless user provides it
4. **Validate frontmatter** against the rules above before writing
5. Confirm the created file path to the user
