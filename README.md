# Subscription Tracer API

A learning project built with Node.js, Express and MongoDB (Mongoose) to track subscriptions. Implements full authentication (JWT), user CRUD, subscription management, and security features (Arcjet for bot detection and rate limiting).

## Features
- User registration and login (hashed passwords + JWT)
- User sign-out with token blacklisting (RevokedToken model)
- Protected routes with JWT authorization middleware
- Full CRUD endpoints for users and subscriptions
- Auto-calculated renewal dates and expiry status for subscriptions
- MongoDB connection via Mongoose with transactions support
- Error handling middleware
- **Bot detection and rate limiting with Arcjet**
- SQL injection protection via Arcjet Shield
- Development-friendly environment setup

## Tech stack
- Node.js
- Express
- MongoDB + Mongoose
- JWT for auth with token revocation
- Arcjet for security (bot detection, rate limiting, Shield)
- bcryptjs for password hashing
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

## API Endpoints

### Authentication
- **POST** /api/v1/auth/sign-up — register new user (returns JWT token)
- **POST** /api/v1/auth/sign-in — login user (returns JWT token)
- **POST** /api/v1/auth/sign-out — logout (requires `authorize` middleware, blacklists token)

### Users (Protected)
- **GET** /api/v1/users — list all users (admin only, no password field)
- **GET** /api/v1/users/:id — get user by ID (protected, excludes password)
- **PATCH** /api/v1/users/:id — update user (protected)
- **DELETE** /api/v1/users/:id — delete user (protected)

### Subscriptions (Protected)
- **POST** /api/v1/subscriptions — create subscription (auto-calculates renewal date)
- **GET** /api/v1/subscriptions — get all subscriptions (admin only)
- **GET** /api/v1/subscriptions/user/:id — get user's subscriptions (protected)
- **GET** /api/v1/subscriptions/:id — get subscription by ID (protected)
- **PATCH** /api/v1/subscriptions/:id — update subscription (protected)
- **DELETE** /api/v1/subscriptions/:id — delete subscription (protected)
- **POST** /api/v1/subscriptions/:id/cancel — cancel subscription (protected)
- **POST** /api/v1/subscriptions/:id/activate — activate cancelled subscription (protected)

Protected routes require header:
```
Authorization: Bearer <token>
```

All endpoints are protected by Arcjet rate limiting and bot detection.

## Project structure (important files)
- app.js — express app, middleware, routes, root route
- config/arcjet.js — Arcjet security configuration (bot detection, rate limiting, Shield)
- config/env.js — environment variables loader
- controllers/
  - auth.controller.js — signUp, signIn, signOut handlers
  - user.controller.js — getUsers, getUser, updateUser, deleteUser handlers
  - subscription.controller.js — createSubscription, getUserSubscriptions, getAllSubscriptions, getSubscriptionById, updateSubscription, deleteSubscription, cancelSubscription, activateSubscription handlers
- models/
  - user.model.js — User schema with email validation
  - subscription.model.js — Subscription schema with auto-calculated renewalDate and status
  - revokedToken.model.js — RevokedToken schema (TTL index for automatic cleanup)
- routes/
  - auth.routes.js — auth endpoints
  - user.routes.js — user endpoints
  - subscription.routes.js — subscription endpoints
- middlewares/
  - auth.middleware.js — `authorize` middleware for protected routes (checks JWT, revoked tokens, user)
  - error.middleware.js — global error handler
- database/ or config/ — DB connection logic
- .env.development.local — environment variables (do not commit)

## Authentication & Authorization

### Sign-up
```json
POST /api/v1/auth/sign-up
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
Response: { success: true, data: { token, user } }
```

### Sign-in
```json
POST /api/v1/auth/sign-in
{
  "email": "john@example.com",
  "password": "securepassword"
}
Response: { success: true, data: { token, user } }
```

### Sign-out
```
POST /api/v1/auth/sign-out
Headers: Authorization: Bearer <token>
Response: { success: true, message: "User signed out successfully", data: null }
```
The token is blacklisted (added to RevokedToken collection) and cannot be reused. Tokens auto-clean up after expiry via MongoDB TTL index.

## Subscription Management

### Auto-calculated Fields
- **renewalDate** — automatically calculated based on `startDate` and `frequency` (daily, weekly, monthly, yearly)
- **status** — auto-updates to "expired" if renewalDate has passed

### Subscription Model Fields
- name (required, 2-100 chars)
- price (required, >= 0)
- currency (USD, EUR, EGP)
- frequency (daily, weekly, monthly, yearly)
- category (entertainment, education, productivity, health, other)
- paymentMethod (credit_card, debit_card, paypal, bank_transfer, other)
- status (active, cancelled, expired)
- startDate (required, must be <= today)
- renewalDate (auto-calculated, must be > startDate)
- user (required, linked to User)

### Example: Create Subscription
```json
POST /api/v1/subscriptions
Headers: Authorization: Bearer <token>
{
  "name": "Netflix",
  "price": 15.99,
  "currency": "USD",
  "frequency": "monthly",
  "category": "entertainment",
  "paymentMethod": "credit_card",
  "startDate": "2025-12-02"
}
Response: { success: true, message: "Subscription created successfully", data: { ...subscription with auto-calculated renewalDate } }
```

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

- If create/update subscription fails:
  - Ensure `authorize` middleware is applied to the route.
  - Verify all required fields are provided in the request body.
  - Check that `startDate` is not in the future.
  - Ensure Mongoose pre-save hooks are async functions (no `next()` callback).

- If CORS issues appear, enable CORS in app.js:
```js
import cors from 'cors';
app.use(cors());
```


## Next steps / TODO
- Add input validation and sanitization middleware
- Add request logging and monitoring
- Add comprehensive unit and integration tests
- Add email notifications for upcoming renewals
- Add cost analytics and spending reports
- Add tests and CI/CD config
- Add API documentation (Swagger/OpenAPI)
- Fine-tune Arcjet rate limit rules per environment

## License
MIT — feel free to use for learning and personal projects.
