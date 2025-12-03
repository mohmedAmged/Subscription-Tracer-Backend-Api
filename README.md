# Subscription Tracer API

Learning project: Node.js + Express + MongoDB (Mongoose). Tracks subscriptions with full auth, CRUD, reminders and security.

## Completed (latest)
- Full authentication (sign-up, sign-in) with JWT.
- Sign-out implemented with token blacklisting (RevokedToken model + TTL).
- Protected routes via `authorize` middleware (attaches `req.user` and `req.token`).
- Full CRUD for Users and Subscriptions.
- Subscription model:
  - Auto-calculated `renewalDate` based on `startDate` + `frequency`.
  - Auto-updates `status` to `expired` when renewal passed.
  - Mongoose pre-save hooks fixed to use async functions (no `next()`).
- Reminder workflows using Upstash Workflows (server-side background workflow).
- Email reminders via Nodemailer (template driven).
- Arcjet integrated for bot detection, Shield protection and token-bucket rate limiting.
  - Fixed Arcjet categories (e.g. `CATEGORY:POSTMAN`).
- DB connection caching to reuse Mongoose connection across runs.
- App starts only after DB connection established.
- Config and helpers for deployment (Render / Vercel) readiness.

## Tech stack
- Node.js, Express
- MongoDB, Mongoose
- JWT, bcryptjs
- Nodemailer (SMTP)
- Upstash Workflows
- Arcjet (bot detection, rate limit, Shield)
- dotenv, nodemon

## Quickstart (Windows)
1. Clone and open project
```bash
git clone <repo-url>
cd "f:\web development\backend\subscription-tracker"
```
2. Install
```bash
npm install
```
3. Create env file
Copy `.env.development.local.example` → `.env.development.local` and set values shown below.
4. Run (development)
```bash
npm run dev
```
Server logs: `subscription tracer api work on http://localhost:5500`

## Required environment variables (examples)
Set these locally or in your host (Render/Vercel):
```env
PORT=5500
NODE_ENV=development
SERVER_URL=http://localhost:5500

DB_URI=<your_mongodb_uri>
JWT_SECRET=<your_jwt_secret>
JWT_EXPIRES_IN=1d

ARCJET_KEY=<arcjet_key>
ARCJET_ENV=development

QSTASH_URL=<upstash_qstash_url>
QSTASH_TOKEN=<qstash_token>

SMTP_HOST=<smtp_host>
SMTP_PORT=<smtp_port>
SMTP_USER=<smtp_user>
EMAIL_PASSWORD=<smtp_password>
```

## API overview

Authentication
- POST /api/v1/auth/sign-up — register (returns token + user)
- POST /api/v1/auth/sign-in — login (returns token + user)
- POST /api/v1/auth/sign-out — logout (requires `authorize`, blacklists token)

Users (protected)
- GET /api/v1/users
- GET /api/v1/users/:id
- PATCH /api/v1/users/:id
- DELETE /api/v1/users/:id

Subscriptions (protected)
- POST /api/v1/subscriptions — create (auto `renewalDate`)
- GET /api/v1/subscriptions — all (admin)
- GET /api/v1/subscriptions/user/:id — user's subscriptions
- GET /api/v1/subscriptions/:id
- PATCH /api/v1/subscriptions/:id
- DELETE /api/v1/subscriptions/:id
- POST /api/v1/subscriptions/:id/cancel
- POST /api/v1/subscriptions/:id/activate

Protected routes require header:
```
Authorization: Bearer <token>
```

## Email reminders & workflows
- Upstash Workflows are used to schedule and trigger reminder emails.
- sendReminderEmail(to, type, subscription) expects (to, typeLabel, subscription).
- Email templates live in `utils/email-template.js`.
- If using Gmail, use app-specific password or a production SMTP provider (SendGrid, Mailgun).

## Arcjet security
- Config in `config/arcjet.js`.
- Rules: Shield, bot detection (allow search engines & Postman), token-bucket rate limiter.
- Ensure `ARCJET_KEY` and `ARCJET_ENV` set in env.

## Deployment notes

Render
- Push repo to GitHub.
- Create Render Web Service:
  - Build command: `npm install`
  - Start command: `npm start`
- Add environment variables in Render dashboard (do not commit .env files).
- For scheduled/long tasks, use Render Background Worker or Upstash Workflows (do not sleep inside web requests).
- Ensure MongoDB Atlas allows connections from Render.

Database connection
- `database/mongodb.js` caches Mongoose connection to avoid reconnect storms.

## Troubleshooting
- Root `/` hangs: ensure server logged listening line and DB connected.
- "next is not a function" during pre-save: ensure pre-save hook is `async function () {}` and does not call `next()`.
- Arcjet category errors: use uppercase `CATEGORY:POSTMAN`.
- Missing email params: `sendReminderEmail` requires `to` and `type`.
- Token reuse after sign-out: sign-out blacklists token; `authorize` checks RevokedToken collection.
- Nodemailer in production: prefer SMTP provider credentials as env vars.

## Important files
- `app.js` — app initialization and start after DB connect
- `config/env.js` — env loader
- `config/arcjet.js` — Arcjet rules
- `config/nodemailer.js` — SMTP transporter
- `config/upstash.js` — Upstash workflow client
- `database/mongodb.js` — cached DB connect
- `controllers/` — auth, users, subscriptions, workflow handlers
- `models/` — User, Subscription, RevokedToken
- `middlewares/` — auth middleware, arcjet middleware, error handler
- `utils/` — send-email, templates

## Next steps / TODO
- Add request validation (Joi/Zod).
- Add tests (Jest + Supertest).
- Add Swagger/OpenAPI docs.
- Add CI and automated deployments (render.yaml / vercel config).
- Add analytics and spending reports.

## License
MIT
