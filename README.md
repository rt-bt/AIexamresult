# All India Exam Result

Production-ready Next.js portal scaffold for `https://www.aiexamresult.com`.

## Stack

- Next.js 15, React 19, TypeScript, Tailwind CSS, Framer Motion
- Prisma ORM with PostgreSQL
- Redis-ready rate limiting layer
- JWT access and refresh token auth
- OpenAI API route for AI-assisted post generation
- Dynamic sitemap, robots, OpenGraph and Twitter metadata
- Docker and Vercel compatible

## Pages

- `/` home
- `/results`
- `/latest-jobs`
- `/admit-card`
- `/answer-key`
- `/admissions`
- `/syllabus`
- `/about`
- `/contact`
- `/privacy-policy`
- `/disclaimer`
- `/post/[slug]`
- `/admin/login`
- `/admin/dashboard`
- `/admin/ai-generator`

## Local Setup

```bash
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

Open `http://localhost:3000`.

## Docker

```bash
cp .env.example .env
docker compose up --build
```

## Deployment Notes

For Vercel, add `DATABASE_URL`, `REDIS_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `OPENAI_API_KEY` and `NEXT_PUBLIC_SITE_URL`.

For Ubuntu VPS:

1. Install Node.js 22, Docker and Nginx.
2. Point Cloudflare DNS to the VPS.
3. Run `docker compose up -d --build`.
4. Use Nginx as a reverse proxy to `localhost:3000`.
5. Enable Brotli, HTTP/2, cache static assets and terminate SSL with Cloudflare or Let&apos;s Encrypt.

## Production Hardening Checklist

- Replace demo login validation with database user lookup and `bcryptjs.compare`.
- Move the in-memory rate limiter to Redis for multi-instance deployments.
- Add secure upload scanning and object storage.
- Add editorial audit logs and two-factor authentication for admins.
- Connect push, email and Telegram integrations to verified provider credentials.
