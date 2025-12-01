# Subscription Tracer API

A learning project built with Node.js, Express and MongoDB (Mongoose) to track subscriptions. Implements full authentication (JWT), user CRUD, subscription management, and security features (Arcjet for bot detection and rate limiting).

## Features
- User registration and login (hashed passwords + JWT)
- Protected routes with JWT
- CRUD endpoints for users and subscriptions
- MongoDB connection via Mongoose
- Error handling middleware
- **Bot detection and rate limiting with Arcjet**
- SQL injection protection via Arcjet Shield
- Development-friendly environment setup

## Tech stack
- Node.js
- Express
- MongoDB + Mongoose
- JWT for auth
- Arcjet for security (bot detection, rate limiting, Shield)
- dotenv for environment variables
- nodemon for development

## Prerequisites
- Node.js (v16+ recommended)
- npm
- A MongoDB URI (MongoDB Atlas or local)
- Arcjet account and API key (free tier available at https://arcjet.com)

## Quickstart (Windows)
1. Clone and open project
```bash
git clone <repo-url>
cd "f:\web development\backend\subscription-tracker"
```

2. Install dependencies
```bash
npm install
```

3. Create environment file
- Copy `.env.development.local.example` to `.env.development.local` (or create `.env.development.local`) and set values. Example:
```env
PORT=5500
NODE_ENV="development"
DB_URI="your_mongodb_uri_here"
JWT_SECRET="your_jwt_secret"
JWT_EXPIRES_IN="1d"
ARCJET_KEY="your_arcjet_key_here"
ARCJET_ENV="development"
```

4. Start in development
```bash
npm run dev
```
Server should log: `subscription tracer api work on http://localhost:5500`

## Scripts
- npm run dev — start with nodemon
- npm start — start production node server

## Environment variables
- PORT — port server listens on (default: 5500)
- NODE_ENV — environment (development/production)
- DB_URI — MongoDB connection string
- JWT_SECRET — secret for JWT signing
- JWT_EXPIRES_IN — token expiry (e.g. 1d)
- ARCJET_KEY — Arcjet API key for security
- ARCJET_ENV — Arcjet environment (development/production)

## Security features (Arcjet)

### Bot Detection
Arcjet protects your API from bots while allowing legitimate search engines:
- Blocks automated bots and scrapers
- Allows search engines (Google, Bing, etc.)
- Allows Postman for testing

### Rate Limiting
Token bucket algorithm:
- Refill rate: 5 tokens per 10 seconds
- Bucket capacity: 10 tokens
- Prevents API abuse and DDoS attacks

### Shield Protection
- Protects against common attacks (SQL injection, XSS, etc.)
- Runs in LIVE mode for production protection

Configuration file: [config/arcjet.js](config/arcjet.js)

## API (summary)
- GET / — root welcome message
- POST /api/v1/auth/sign-up — register
- POST /api/v1/auth/sign-in — login (returns JWT)
- POST /api/v1/auth/sign-out — logout
- GET /api/v1/users — list users
- GET /api/v1/users/:id — get user (example: excludes password)
- /api/v1/subscriptions — subscription routes (CRUD)

Protected routes require header:
```
Authorization: Bearer <token>
```

All endpoints are protected by Arcjet rate limiting and bot detection.

## Project structure (important files)
- app.js — express app, middleware, routes, root route
- config/arcjet.js — Arcjet security configuration (bot detection, rate limiting, Shield)
- config/env.js — environment variables loader
- controllers/ — request handlers (auth.controller.js, user.controller.js, ...)
- models/ — Mongoose models (user.model.js, subscription.model.js)
- routes/ — route definitions
- middlewares/ — auth and error middlewares
- database/ or config/ — DB connection logic
- .env.development.local — environment variables (do not commit)

## Troubleshooting
- If root (`/`) hangs:
  - Confirm server logs show listening port and DB connected.
  - Ensure you navigate to the same PORT (e.g. http://localhost:5500).
  - If using cookie-parser, ensure it is used correctly:
    ```js
    import cookieParser from 'cookie-parser';
    app.use(cookieParser()); // <--- call the function
    ```
  - Verify `.env.development.local` is loaded and DB_URI is correct.
  - Check terminal/output for uncaught errors.

- If you get Arcjet errors:
  - Verify ARCJET_KEY is set in `.env.development.local`
  - Ensure ARCJET_ENV is set to "development" or "production"
  - Check Arcjet dashboard at https://arcjet.com for API key status

- If you hit rate limit (429):
  - Normal behavior. Wait 10 seconds for token bucket refill or reduce request frequency.
  - Adjust `refillRate`, `interval`, and `capacity` in [config/arcjet.js](config/arcjet.js) as needed.

- If CORS issues appear, enable CORS in app.js:
```js
import cors from 'cors';
app.use(cors());
```


## Next steps / TODO
- Complete subscription CRUD and validation
- Add input validation and sanitization
- Add request logging
- Add tests and CI config
- Add README badges and more detailed endpoint documentation
- Fine-tune Arcjet rate limit rules per environment

## License
MIT — feel free to use for learning and personal projects.
