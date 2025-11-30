# Subscription Tracer API

A learning project built with Node.js, Express and MongoDB (Mongoose) to track subscriptions. Implements full authentication (JWT), user CRUD and subscription management.

## Features
- User registration and login (hashed passwords + JWT)
- Protected routes with JWT
- CRUD endpoints for users and subscriptions
- MongoDB connection via Mongoose
- Error handling middleware
- Development-friendly environment setup

## Tech stack
- Node.js
- Express
- MongoDB + Mongoose
- JWT for auth
- dotenv for environment variables
- nodemon for development

## Prerequisites
- Node.js (v16+ recommended)
- npm
- A MongoDB URI (MongoDB Atlas or local)

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

## Project structure (important files)
- app.js — express app, middleware, routes, root route
- controllers/ — request handlers (auth.controller.js, user.controller.js, ...)
- models/ — Mongoose models (user.model.js, subscription.model.js)
- routes/ — route definitions
- middlewares/ — auth and error middlewares
- database/ or config/ — DB connection logic
- .env.development.local — environment variables

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
- If CORS issues appear, enable CORS in app.js:
```js
import cors from 'cors';
app.use(cors());
```

## Testing
- Add unit / integration tests (recommended frameworks: Jest, Supertest).
- Add a `test` script in package.json and run with `npm test`.

## Next steps / TODO
- Complete subscription CRUD and validation
- Add input validation and sanitization
- Add request logging and rate limiting
- Add tests and CI config
- Add README badges and more documentation per endpoint

## License
MIT — feel free to use for learning and personal projects.

```// filepath: f:\web development\backend\subscription-tracker\README.md
# Subscription Tracer API

A learning project built with Node.js, Express and MongoDB (Mongoose) to track subscriptions. Implements full authentication (JWT), user CRUD and subscription management.

## Features
- User registration and login (hashed passwords + JWT)
- Protected routes with JWT
- CRUD endpoints for users and subscriptions
- MongoDB connection via Mongoose
- Error handling middleware
- Development-friendly environment setup

## Tech stack
- Node.js
- Express
- MongoDB + Mongoose
- JWT for auth
- dotenv for environment variables
- nodemon for development

## Prerequisites
- Node.js (v16+ recommended)
- npm
- A MongoDB URI (MongoDB Atlas or local)

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

## Project structure (important files)
- app.js — express app, middleware, routes, root route
- controllers/ — request handlers (auth.controller.js, user.controller.js, ...)
- models/ — Mongoose models (user.model.js, subscription.model.js)
- routes/ — route definitions
- middlewares/ — auth and error middlewares
- database/ or config/ — DB connection logic
- .env.development.local — environment variables

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
- If CORS issues appear, enable CORS in app.js:
```js
import cors from 'cors';
app.use(cors());
```


## Next steps / TODO
- Complete subscription CRUD and validation
- Add input validation and sanitization
- Add request logging and rate limiting
- Add tests and CI config
- Add README badges and more documentation per endpoint

## License
MIT — feel free to use for learning and personal projects.
