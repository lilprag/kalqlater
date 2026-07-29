# मेरा व्यक्तित्व — Product Requirements

## Problem Statement
Hindi-language personality test website (like 16Personalities, but with original Hindi content) based on the Myers-Briggs / Jungian 16-personality-type framework. Full Hindi UI with Hindi ↔ English toggle. Users answer 60 Likert-scale questions and get a personality type report with detailed Hindi explanation.

## Architecture
- **Frontend**: React 19 + React Router v7 + TailwindCSS + Framer Motion + shadcn/ui, hosted at `/app/frontend`. Language state in React context, persisted in localStorage.
- **Backend**: FastAPI + Motor (MongoDB async), all routes prefixed `/api`, hosted at `/app/backend`.
- **DB**: MongoDB (single collection `submissions`).
- **Env vars**: `REACT_APP_BACKEND_URL`, `MONGO_URL`, `DB_NAME`, `CORS_ORIGINS`.

## User Personas
1. **Curious Indian college student / young professional** who prefers Hindi content and self-discovery frameworks.
2. **Hindi-speaking parent or teacher** exploring personality types for family / classroom.
3. **English-preferring Indian** who wants an Indian-context personality test (uses EN toggle).

## Core Requirements (Static)
- 60 original Hindi + English Likert questions across 4 MBTI dimensions (E/I, S/N, T/F, J/P).
- 16 original type profiles (nickname, headline, description, strengths, weaknesses, career, relationships) in both languages.
- Result computation using signed direction per question and per-axis normalization.
- Anonymous submissions to backend, no login.
- Autosave in localStorage; resume dialog on return.
- Mobile-first responsive design with Devanagari-compatible typography.

## What's Been Implemented (2026-02-11)
- **Backend**: `/api/`, `POST /api/submissions`, `GET /api/submissions/{id}`, `GET /api/submissions/count/total` (with 128,473 base offset for trust indicator), `GET /api/stats/types`.
- **Landing page**: hero, trust indicator, 4-feature grid, 4-dimension explainer, bottom CTA.
- **Test page**: single-question flow (60 Qs), 5-point Likert with animated selection, animated progress bar, back/next, autosave + resume dialog, framer-motion transitions.
- **Result page**: type code + Hindi nickname + headline, 4 animated trait bars, description, strengths/weaknesses/career/relationships cards, WhatsApp share, copy link.
- **16 Types grid page** with group sections (Analysts / Diplomats / Sentinels / Explorers) + **TypeDetail page** for each of the 16 codes.
- **About page** and **Privacy page** with Hindi + English content.
- **Header** with sticky glassmorphism nav, mobile menu, Hindi/English toggle.
- **Footer** with links and site info.
- Custom color palette (saffron / peacock teal / plum / sand), Tiro Devanagari Hindi + Philosopher + Hind + Outfit fonts, organic blobs + grain overlay backgrounds.
- SEO meta title/description in Hindi in `public/index.html`.
- Tested end-to-end via testing subagent — backend 100%, frontend 100% on tested flows.

## Backlog

### P0 (must-have for launch)
- Nothing outstanding — MVP complete.

### P1 (next iteration)
- **Result share card image**: generate an OG image (Node canvas or serverless) for social previews.
- **Radar chart** alternative visualization on results page (Recharts already installed).
- **Autosave resume test**: full manual QA on resume-yes / resume-no.
- **Mobile viewport polish**: verified visually; run touch-target QA on real device.
- **Blog / articles section** for SEO (deferred).

### P2 (future)
- Email results to self (Resend integration).
- Analytics (test started / completed / shared events).
- Optional email capture for lead-gen (with skip option).
- Saved history behind an account (Phase 2).
- Paid detailed report tier.

## Next Tasks
- Design social share card image + og:image meta.
- Add radar chart to result page.
- Write 5–8 Hindi blog articles for SEO.
- Add sitemap.xml and robots.txt.
