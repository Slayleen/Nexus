# Project Nexus — PRD & Build Log

## Original Problem Statement
Build the "operating system" for ambitious high school students (grades 9–12): a collaboration platform where students find teammates, join projects, discover opportunities, build verified portfolios, and network — powered by AI matchmaking ("tell me your goal") instead of a search bar. Culture = collaboration & reputation over followers. MVP focus: help students instantly find collaborators.

## Architecture
- **Frontend**: React 19 (CRA + craco, `@` alias → src), Tailwind, neo-brutalist pastel design, Phosphor icons, sonner toasts, framer-motion available.
- **Backend**: FastAPI (single `server.py`), all routes under `/api`.
- **DB**: MongoDB (motor), collections: users, projects, opportunities, messages, forum_posts, forum_comments.
- **Auth**: JWT httpOnly cookie (secure, samesite=none), bcrypt. `.edu` emails auto-verified (simulated school email verification).
- **AI**: Emergent LLM key → OpenAI gpt-5.4-mini for teammate matching, with a local keyword-based fallback matcher.
- **CORS**: explicit allow-list from `CORS_ORIGINS` env (preview + production + localhost).

## User Personas
- The Builder (needs teammates/devs/designers), The Explorer (wants opportunities), The Leader (recruits for club/nonprofit).

## Core Requirements (static)
Profiles+onboarding · AI teammate matching · Project Hub · Opportunity Board · Direct Messaging · Community Forum · Reputation (completed projects/endorsements, not followers) · Verified students.

## Implemented (2026-07-07)
- JWT auth (register/login/logout/me) with cookie sessions; seeded admin + 8 demo students (password123).
- Landing page (bento hero, "tell me your goal" showcase, how-it-works, CTA).
- Dashboard: stats, AI prompt card, suggested teammates, closing-soon opportunities.
- AI Match page: natural-language goal → ranked matches with % score + "why they fit" reasons (LLM + fallback).
- Project Hub: list/filter, create modal, apply-to-join, progress bars.
- Opportunity Board: seeded internships/research/scholarships/competitions/hackathons, type filters.
- Discover: student directory, search, endorse, message.
- Messaging: conversation list + chat thread, polling, optimistic send.
- Forum: communities, posts, comments, upvotes, create post.
- Profile: fully customizable — avatar picker (8 styles + shuffle + custom URL), name/grade/school/bio, skills/interests/looking-for tag editors; verified badge; reputation display.
- Backend perf: batch-fetch (`user_map` + `$in`), forum comment counts via `$group` aggregation.
- Deployment health check: PASS.
- Testing: 20/20 backend pytest pass; all critical UI flows pass. Fixed logout redirect to landing.

## Backlog (prioritized)
- **P1**: Public profile view (see another student's full customized profile from Discover/Match). Verified collaboration flow (teammates confirm contributions → portfolio). Group chats.
- **P1**: Profile privacy toggles (hide school/name until connected) per Trust & Safety. AI opportunity recommendations personalized to profile.
- **P2**: Project accept/decline applicants + team management. Icebreaker generator & profile optimizer (AI). AI safety moderation. Communities (events/resources). Premium tier, organization accounts.

## Next Tasks
1. Public profile view + verified collaboration endorsements on completed projects.
2. Personalized AI opportunity recommendations.
3. Applicant management for project owners.

## Notes / Mocks
- AI matching uses the Emergent universal LLM key; if key budget is exhausted it transparently falls back to a local matcher (still ranked + reasoned). Top up via Profile → Universal Key → Add Balance for full LLM quality.
- No real email verification (`.edu` domains auto-marked verified).
