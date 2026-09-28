# AIExamResult.com — Automated Content Pipeline Documentation

## 1. System Architecture Overview

The **AIExamResult Content Pipeline** is a fully automated, people-first content discovery, fact verification, original article generation, SEO optimization, and Git/Vercel deployment system.

```
PUBLIC SIGNALS (SarkariExam / Official Feeds)
              │
              ▼ (Topic Entity Only)
  [ Content Discovery Engine ]
              │
              ▼ (Resolve Official Board)
  [ Official Authority Resolver ]
              │  (SSC, UPSC, RRB, NTA, State PSCs, etc.)
              ▼
  [ Fact Verification & Source Engine ]
              │
              ▼ (100% Original AIExamResult Content)
  [ Original Content Generator ]
              │
              ├─ Category Engine (latestJobs, results, admitCards, etc.)
              ├─ Search Intent Classifier
              ├─ SEO & Schema Generator (Article, Breadcrumbs, FAQ, JobPosting)
              └─ Duplicate Content Guard (Fingerprinting & Similarity)
              │
              ▼
  [ Quality & SEO Validation Suite ]
              │
              ├─ Admin Review Preview (content-preview/[slug].md)
              ├─ Content Queue State (content-queue.json)
              └─ Execution Reporter (content-sync-report.json)
              │
              ▼ (Publish Mode Only)
  [ Production Build Check (npm run build) ]
              │
              ▼
  [ Git Commit & GitHub Push -> Vercel Deployment ]
```

---

## 2. CLI Commands Reference

| Command | Purpose |
|---------|---------|
| `npm run content:discover` | Discovers trending exam/job topics without writing content. |
| `npm run content:sync:dry` | **Dry Run Mode:** Discovers topics, researches facts, generates preview articles in `content-preview/`, validates SEO, and checks duplicates without modifying production database or committing. |
| `npm run content:sync:publish` | **Safe Publish Mode:** Runs discovery, fact research, validation, writes post files, updates `data/scraped.json`, verifies production build, and commits to Git. |
| `npm run content:update` | Updates previously published articles with new dates, links, or statuses. |
| `npm run content:report` | Displays summary of the latest sync and deployment status. |
| `npm run seo:check` | Audits all articles for SEO title length, description length, canonical URLs, and structured data. |
| `npm run lint` | Runs ESLint across all codebase and pipeline scripts. |
| `npm run build` | Compiles Next.js production build and static pages. |

---

## 3. Strict Compliance & Originality Rules

1. **Topic Discovery Only:**
   Public signals (such as SarkariExam.com) are utilized purely as discovery indicators to identify candidate exam entities (e.g. *"SSC CGL 2026"*).
2. **Zero Content Copying:**
   Paragraphs, tables, FAQs, CSS, layout, and phrasing from competitor websites are NEVER copied, scraped, or spun.
3. **Official Ground Truth:**
   Factual parameters (application dates, vacancies, eligibility, fees, age limit, official links) are verified against official recruitment authorities (e.g., `ssc.gov.in`, `upsc.gov.in`, `rrbcdg.gov.in`, `nta.ac.in`).
4. **Honest Fallbacks:**
   If dates or vacancies are unannounced, the system states: *"Information will be updated after the official notification."* Fake or invented claims are strictly prohibited.

---

## 4. Structured Data & SEO Standard

Every article automatically includes:
- **Canonical URL:** `https://www.aiexamresult.com/post/[slug]`
- **BreadcrumbList Schema:** Home $\rightarrow$ Category $\rightarrow$ Post
- **Article & WebPage Schema:** With author, publisher, and timestamps
- **FAQPage Schema:** Matching visible questions and answers (English & Hindi)
- **JobPosting Schema:** For recruitment notices with hiringOrganization, jobLocation, and baseSalary
- **Dynamic OpenGraph Image:** Generated via `/api/og?title=...`

---

## 5. Deployment Workflow (GitHub + Vercel)

When `npm run content:sync:publish` is triggered:
1. Validated articles are saved to `data/posts/[slug].json`.
2. `data/scraped.json` and `data/scraped-data.ts` are updated.
3. `npm run build` executes to guarantee zero build breakages.
4. Git stages updated content files, commits with a message, and pushes to `origin/main`.
5. Vercel automatically detects the push and deploys the production release.
