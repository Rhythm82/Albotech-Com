# Albotech employee profile API

## Configuration

Copy `.env.example` to `.env`, then set `MONGODB_URI`, `ADMIN_PASSWORD`, and a long random `ADMIN_TOKEN_SECRET`. The API exits at startup if the database or admin credentials are not configured.

## Run

From the repository root, run `npm run dev` to start the API and Vite together. Or run `npm run dev` from this directory to start only the API. The API listens on port 5000 by default.

## Routes

- `POST /api/employees` accepts multipart fields `fullName`, `designation`, `email`, `linkedin`, and `photo`.
- `POST /api/admin/login` accepts `{ "password": "..." }` and returns an eight hour bearer token.
- `GET /api/employees`, `GET /api/employees/:id/image`, and `DELETE /api/employees/:id` require `Authorization: Bearer <token>`.

Employee photos are stored as their original bytes in MongoDB. Supported formats are JPEG, PNG, WebP, and AVIF, with a 12 MB upload limit.
