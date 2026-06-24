# AI Exam Result - Project Memory

## Overview
Government exam information portal (www.aiexamresult.com) that aggregates verified data from 5+ sources, syncs daily, and ranks on search engines.

## Tech Stack
- **Framework:** Next.js 15.5.19 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL (Prisma ORM)
- **Cache/Queue:** Redis
- **Deployment:** Vercel (rt-bts-projects/a-iexamresult)
- **Android:** Capacitor (removed)
- **Auth:** JWT (jose + bcryptjs)
- **AI:** OpenAI API

## Key URLs
- **Live:** https://www.aiexamresult.com
- **Vercel Dashboard:** https://vercel.com/rt-bts-projects/a-iexamresult
- **GitHub:** https://github.com/rt-bt/AIexamresult
- **GitHub Actions:** https://github.com/rt-bt/AIexamresult/actions

## Vercel Config
- **Alias:** www.aiexamresult.com → a-iexamresult-*.vercel.app
- **Org:** rt-bts-projects (`team_aLiUF1VX8eJtJLPmBo1toA1W`)
- **Project ID:** `prj_cqllpAD5gXemlwOlswAzxCj9asDw`
- **Logged in user:** `rt-bt`

## Environment Variables (Vercel Production)
| Variable | Status |
|----------|--------|
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | ✅ Set |
| `VAPID_PRIVATE_KEY` | ✅ Set |
| `PUSH_API_KEY` | ✅ Set |
| `GH_TOKEN` | ❌ Not set (needed for /api/trigger-sync) |
| `DATABASE_URL` | ❌ Not set (local PG) |
| `REDIS_URL` | ❌ Not set |

## GitHub Secrets (for Actions)
| Secret | Status |
|--------|--------|
| `VERCEL_TOKEN` | ❌ Not set |
| `PUSH_API_KEY` | ❌ Not set |

## Project Structure

### `/app` - Next.js Pages & API Routes
```
app/
├── layout.tsx              # Root layout (SW registration, GA, SEO)
├── page.tsx                # Homepage
├── globals.css             # Global Tailwind styles
├── [section]/page.tsx      # Category pages (results, admitCards, etc.)
├── post/[slug]/page.tsx    # Post detail page
├── state/[slug]/page.tsx   # State-wise pages
├── exam/[slug]/page.tsx    # Exam-specific pages (SSG, 50+ paths)
├── search/page.tsx         # Search results
├── current-affairs/        # Current affairs + quiz
├── admin/                  # Admin dashboard (login, AI generator, stats)
├── api/
│   ├── push/               # Web push notification APIs
│   │   ├── keys/route.ts       # GET: VAPID public key
│   │   ├── subscribe/route.ts  # POST: Store push subscription
│   │   ├── unsubscribe/route.ts# POST: Remove subscription
│   │   └── send/route.ts       # POST: Send notification to all subs
│   ├── subscribe/route.ts      # Email subscription (JSON file)
│   ├── trigger-sync/route.ts   # POST: Trigger GitHub Actions sync
│   ├── search/route.ts         # Search endpoint
│   ├── bot/route.ts            # Telegram bot webhook
│   ├── exam-analysis/route.ts  # Exam analysis data
│   ├── analytics/              # Analytics tracking
│   ├── calendar-events/        # Exam calendar
│   └── ...
```

### `/components` - React Components
```
components/
├── site/                   # Site-wide components
│   ├── header.tsx          # Header with marquee
│   ├── footer.tsx          # Footer
│   ├── hero.tsx            # Homepage hero
│   ├── category-columns.tsx# Category grid
│   ├── state-grid.tsx      # State-wise links
│   ├── nnotification-subscribe.tsx  # Email subscription form
│   └── ...
├── push-notification-prompt.tsx  # Web push subscribe popup
└── providers.tsx
```

### `/lib` - Shared Logic
```
lib/
├── data.ts                # Data loading & helpers (toPostCard, sectionItems)
├── scraper.ts             # Full scrape (all 5 sources, cloudscraper)
├── auto-sync.ts           # Quick sync (sarkariexam.com only)
├── run-scrape.ts          # Orchestrates full scrape
├── seo.ts                 # SEO utilities (makeMetadata, SITE_URL, exam/state maps)
├── exam-analysis.ts       # Exam analysis scraping
└── sources/index.ts       # Individual source scrapers
```

### `/data` - Scraped Data
```
data/
├── scraped-data.ts        # All items across 6 categories (~7092 lines)
├── posts/                 # Post detail JSONs (513+ files)
├── current-affairs.ts     # 68 current affairs + 10 quiz questions
└── subscribers.json       # Email subscribers (auto-generated)
```

### `/scripts` - Utility Scripts
```
scripts/
├── sync-sarkariresult.mjs # Standalone sync for sarkariresult.com
├── add-post.mjs           # Interactive tool to manually add posts
└── ...
```

### `/prisma` - Database Schema
```
prisma/
└── schema.prisma           # Models: User, Role, Post, Category, Tag, 
                             # Notification, PushSubscription, Comment, Media,
                             # SeoMetadata, AiGeneration
```

### `/public` - Static Assets
```
public/
├── sw.js                  # Service Worker (push notifications)
├── manifest.webmanifest   # PWA manifest
├── robots.txt             # SEO
├── sitemap.xml            # Sitemap (39+ routes)
├── BingSiteAuth.xml       # Bing verification code
└── favicon.ico
```

## GitHub Actions Workflows

### 1. `scrape.yml` - Full Scrape (every 30 min)
- Runs `npm run scrape` (all 5 sources)
- Commits changes if any
- Requires `VERCEL_TOKEN` for deploy

### 2. `sync-sarkariresult.yml` - SarkariResult Sync (every 6 hours)
- Runs `node scripts/sync-sarkariresult.mjs`
- Commits & pushes if new items
- Deploys to Vercel
- Calls `/api/push/send` after deploy (requires `PUSH_API_KEY` secret)
- Triggers: schedule + `workflow_dispatch`

### 3. `build-apk.yml` - Android APK Build (REMOVED)

## Sync Sources
1. **sarkariexam.com** - "Top Online Form" section
2. **sarkariresult.com** - 6 categories (results, admitCards, latestJobs, answerKeys, documents, admissions)
3. **resultbharat.com**
4. **testbook.com** - news/result
5. **sarkariresultshine.com**

## SEO Configuration
- **SITE_URL:** https://www.aiexamresult.com
- **Bing Verification:** `B618C86A0CD7394999F4770C1F2C4A40`
- **Google Analytics:** G-9MS5NTFB7W
- **Google Search Console:** via GA4
- **Sitemap:** 39+ routes at /sitemap.xml
- **Robots:** /robots.txt
- **PWA Manifest:** /manifest.webmanifest
- **Meta:** Every page has unique title, description, OG, Twitter Card, canonical
- **JSON-LD:** Structured data on post pages
- **Descriptions:** 150-160 chars
- **H1:** Every page has one

## Key Scripts (package.json)
| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `next dev` | Local dev server |
| `build` | `next build` | Production build |
| `start` | `next start` | Start production server |
| `scrape` | `tsx lib/run-scrape.ts` | Full scrape all 5 sources |
| `auto-sync` | `tsx lib/auto-sync.ts` | Quick sarkariexam.com sync |
| `sync-sarkariresult` | `node scripts/sync-sarkariresult.mjs` | SarkariResult.com sync |

## Batch/Scripts Files
| File | Purpose |
|------|---------|
| `sync-sarkariresult.cmd` | Run sync + Vercel deploy (double-click) |
| `add-post.cmd` | Interactive post adder |
| `scraper-runner.cmd` | Run full scrape |
| `auto-sync.cmd` | Quick sync |
| `setup-15min-sync.cmd` | Setup 15-min scheduled task |
| `setup-daily-task.cmd` | Setup daily scrape task |
| `run.cmd` | Start dev server |

## Push Notification System
- **Service Worker:** `/sw.js` (registered in layout.tsx)
- **Subscribe Flow:** Popup → permission → register SW → fetch VAPID key → subscribe → POST to `/api/push/subscribe`
- **Storage:** `data/push-subscriptions.json` (Vercel: `/tmp/data/`)
- **Auto-send:** After GitHub Actions sync completes → curl to `/api/push/send` with `x-api-key` header
- **VAPID Keys:** Generated via `web-push` library

## SEO Keywords Target
"sarkari result", "sarkari job alert", "rojgar result", exam names, state names, "sarkari result 2026"

## Critical Rules
- Post detail JSON filenames must match slug casing exactly (Vercel Linux is case-sensitive)
- `loadData()` in sync scripts uses `JSON.parse()` with regex stripping (handles TS wrapper, Windows/macOS line endings)
- Future `publishedDate` items are discarded during scrape; category listing falls back to today's date
- Result Timeline `isFuture()` parses `DD/MM/YYYY`, `DD-MM-YYYY`, `DD Month YYYY`, `Month YYYY` formats

## Build & Deploy
```bash
npm run build          # ~6-13s
npx vercel deploy --prod --yes   # Deploy to production
```

## Needed Setup
1. ✅ VAPID keys in Vercel env
2. ✅ PUSH_API_KEY in Vercel env
3. ❌ GH_TOKEN in Vercel env (for /api/trigger-sync)
4. ❌ VERCEL_TOKEN in GitHub secrets (for Actions auto-deploy)
5. ❌ PUSH_API_KEY in GitHub secrets (for Actions push notification)
    