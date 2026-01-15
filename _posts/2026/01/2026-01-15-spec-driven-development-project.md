---
title: "A Simple Spec-Driven Development Project"
description: "使用 Spec-Driven Development 方法构建一个在线调查问卷工具的完整示例"
create_time: 2026-01-15 00:00
tags:
  - tech
published: true
---

## Spec-Driven Development Project

An Online Survey Tool

### Idea → Prompt

````markdown
## Project Overview
Build a conversational Online Survey Bot with two primary modes:
1. **Survey Creator Mode** - Data collectors chat with the bot to design surveys
2. **Survey Responder Mode** - Survey participants chat with the bot to answer surveys

Deploy on Vercel with an online database backend and CSV export capability.

## Core Requirements

### 1. Survey Creation Flow (Creator Mode)
- Bot guides the data collector through survey design via natural conversation
- Collects:
  - Survey title and description
  - Questions (supports multiple types: text, multiple choice, rating, yes/no, date, number)
  - Question order and logic (skip logic if applicable)
  - Required vs optional fields
  - Validation rules (min/max values, character limits)
- Generates a unique survey ID/link for distribution
- Allows editing existing surveys through conversation

### 2. Survey Response Flow (Responder Mode)
- Bot presents questions conversationally, one at a time
- Validates responses in real-time
- Handles:
  - Clarification requests from respondents
  - Going back to previous questions
  - Saving partial responses (resume later)
- Confirms completion and thanks respondent

### 3. Data Management
- Store surveys and responses in online database
- Schema should support:
  - Surveys (id, title, description, questions JSON, created_at, creator_id)
  - Responses (id, survey_id, answers JSON, completed_at, respondent_id)
- Export responses to CSV format with proper column headers

## Tech Stack
- **Frontend**: Next.js (App Router) on Vercel
- **AI**: Google Gemini API via Vercel AI SDK (`@ai-sdk/google`)
- **Model**: `gemini-2.0-flash` or `gemini-1.5-pro`
- **Database**: Supabase / PlanetScale / Neon (choose one)
- **Auth**: Optional - can use simple survey codes initially

## Gemini Integration
```typescript
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

const model = google('gemini-2.0-flash');

// Use streamText for chat responses
const result = await streamText({
  model,
  system: "You are a survey assistant...",
  messages: conversationHistory,
});
```

## API Endpoints

- POST /api/chat/creator - Handle survey creation conversation
- POST /api/chat/responder - Handle survey response conversation
- GET /api/surveys/:id - Get survey details
- GET /api/surveys/:id/responses - Get all responses
- GET /api/surveys/:id/export - Download CSV

## Environment Variables

```
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key
DATABASE_URL=your_database_connection_string
```

## User Interface

- Clean chat interface with message bubbles
- Mode selector (Create Survey / Take Survey)
- Survey link input for responders
- Dashboard for creators to view responses and export data

## Example Conversation Flows

### Creator Mode:

```
Bot: Hi! I'll help you create a survey. What's the title of your survey?
User: Customer Satisfaction Survey
Bot: Great! What's a brief description for participants?
User: We want to understand your experience with our service
Bot: Perfect. Let's add questions. What's your first question?
User: How satisfied are you with our service?
Bot: What type of response should this be? (1) Rating 1-5, (2) Multiple choice, (3) Text, (4) Yes/No
User: Rating 1-5
Bot: Got it. Is this question required? (yes/no)
...
```

### Responder Mode:

```
Bot: Welcome to the Customer Satisfaction Survey! This will take about 2 minutes. Ready to begin?
User: Yes
Bot: Question 1 of 5: How satisfied are you with our service? (Rate 1-5, where 5 is very satisfied)
User: 4
Bot: Thanks! Question 2 of 5: What did you like most about our service?
...
```

## Deliverables

1. Working Next.js application deployed on Vercel
2. Database schema and connection
3. Chat interface for both modes using Gemini
4. CSV export functionality
5. Basic documentation on how to use

Key changes:
- AI provider switched to **Google Gemini** via `@ai-sdk/google`
- Added Gemini integration code example
- Added `GOOGLE_GENERATIVE_AI_API_KEY` environment variable
````

### Init

```
openspec init
```

```
/openspec:proposal [Pasted text #2 +112 lines]
```

### Make decisions

```
Which database provider do you prefer for this project?

❯ 1. Supabase (Recommended)
     PostgreSQL with built-in auth, real-time, and REST API. Easy setup, generous free tier.
  2. Neon
     Serverless PostgreSQL, scales to zero, branching support. Good for Vercel deployments.
  3. PlanetScale
     MySQL-compatible, serverless, horizontal scaling. Good for high traffic.
  4. Type something.

Enter to select · Tab/Arrow keys to navigate · Esc to cancel
```

### Planning

```
Wrote 75 lines to openspec/changes/add-survey-bot/tasks.md
     # Tasks: Add Conversational Survey Bot
     ## 1. Project Setup
     - [ ] 1.1 Initialize Next.js 14+ project with App Router and TypeScript
     - [ ] 1.2 Configure Tailwind CSS
     - [ ] 1.3 Set up Supabase project and obtain credentials
     - [ ] 1.4 Install dependencies: `@ai-sdk/google`, `ai`, `@supabase/supabase-js`, `nanoid`
     - [ ] 1.5 Configure environment variables (GOOGLE_GENERATIVE_AI_API_KEY, SUPABASE_URL, SUPABASE_ANON_KEY)
     - [ ] 1.6 Set up Supabase client utility (`lib/supabase.ts`)
     … +65 lines (ctrl+o to expand)
```

### Review

```
Key Design Decisions
  ┌────────────┬────────────────────────────────────────────────┐
  │  Decision  │                     Choice                     │
  ├────────────┼────────────────────────────────────────────────┤
  │ Database   │ Supabase (PostgreSQL)                          │
  ├────────────┼────────────────────────────────────────────────┤
  │ Auth       │ Simple creator codes (12-char nanoid)          │
  ├────────────┼────────────────────────────────────────────────┤
  │ AI         │ Google Gemini via @ai-sdk/google               │
  ├────────────┼────────────────────────────────────────────────┤
  │ Frontend   │ Next.js 14+ App Router with Tailwind           │
  ├────────────┼────────────────────────────────────────────────┤
  │ AI Actions │ Parse <ACTION>...</ACTION> tags from responses │
  └────────────┴────────────────────────────────────────────────┘
  Capabilities Defined
```

### Implement

```
/openspec:apply
```

```
Setting up Next.js project… (ctrl+c to interrupt · ctrl+t to hide todos · 2m 36s · ↓ 5.4k tokens · thinking)
  ⎿  ☐ Phase 1: Project Setup (1.1-1.6)
     ☐ Phase 2: Database Setup (2.1-2.4)
     ☐ Phase 3: Core UI Components (3.1-3.4)
     ☐ Phase 4: Survey Creator Mode (4.1-4.7)
     ☐ Phase 5: Survey Responder Mode (5.1-5.7)
     ☐ Phase 6: Survey CRUD API (6.1-6.5)
     ☐ Phase 7: Response Management API (7.1-7.2)
     ☐ Phase 8: Data Export (8.1-8.3)
     ☐ Phase 9: Creator Dashboard (9.1-9.4)
     ☐ Phase 10: Polish & Testing (10.1-10.6)
     ☐ Update tasks.md with completion status
```

```
⏺ Implementation Complete

  The Conversational Online Survey Bot has been implemented. Here's a summary:

  Project Structure

  src/
  ├── app/
  │   ├── page.tsx                    # Landing page with mode selector
  │   ├── create/page.tsx             # Survey creator chat interface
  │   ├── survey/[id]/page.tsx        # Survey responder interface
  │   ├── dashboard/                  # Creator dashboard
  │   └── api/
  │       ├── chat/creator/route.ts   # Creator AI chat endpoint
  │       ├── chat/responder/route.ts # Responder AI chat endpoint
  │       ├── surveys/                # Survey CRUD API
  │       └── responses/              # Response management API
  ├── components/
  │   ├── ChatInterface.tsx           # Reusable chat UI
  │   ├── MessageBubble.tsx           # Chat message component
  │   ├── ModeSelector.tsx            # Create/Take survey toggle
  │   └── SurveyCard.tsx              # Survey preview card
  ├── lib/
  │   ├── supabase.ts                 # Supabase client
  │   ├── ai.ts                       # Gemini AI configuration
  │   └── csv.ts                      # CSV export utility
  └── types/database.ts               # TypeScript types
```

### Deploy

![Image](/2026-01-15-spec-driven-development-project/deployment.png)

### Requirement change (loop)

```
/openspec:proposal Creator Mode Prompt is not as my expected, the app should auto generate a list of question base on the topic, all i need to do is to review, remove or add some more questions
```

```
Current Flow (Tedious)

1. Provide title → 2. Provide description → 3. Add question 1 → 4. Add question 2 → ... → N. Finalize

New Flow (Streamlined)

1. Describe topic (e.g., "customer satisfaction for a restaurant")
2. AI auto-generates title, description, and 5-8 questions
3. Review & edit - remove unwanted questions, add more if needed
4. Finalize when satisfied

New Actions

- set_questions - bulk set all generated questions at once
- remove_question - delete a question by index
```

### Remaining tasks & Archive tasks

```
Remaining (Manual Testing)
  - 5.1 测试 Pro 模型生成问卷质量 (21-28 questions)
  - 5.2 验证所有页面中文显示正确
  - 5.3 测试部分提交流程
  - 5.4 测试数据分析问答功能
```

```
/openspec:apply
```

```
/openspec:archive
```

## Finalize

[ct-online-survey.vercel.app](https://ct-online-survey.vercel.app/)
