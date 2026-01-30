# Pastebin-Lite

A minimal Pastebin-like web application built as a take-home assignment.
The application allows users to create text pastes and share a URL to view them.
Each paste can optionally expire based on time (TTL) or view count.
This project focuses on correctness, clean API behavior, and persistence suitable
for serverless environments.

---

## Features

- Create a paste containing arbitrary text
- Generate a shareable URL for each paste
- View pastes via API and HTML page
- Optional time-based expiry (TTL)
- Optional view-count limit
- Automatic deletion once constraints are met
- Safe HTML rendering (no script execution)
- Deterministic time support for automated testing

---

## Tech Stack

- **Framework**: Next.js (App Router)
- **Runtime**: Node.js
- **Persistence**: Redis (Vercel KV / compatible Redis)
- **Deployment**: Vercel

---

## API Endpoints

### Health Check
GET /api/healthz

Returns HTTP 200 with JSON response indicating service health.

---

### Create Paste
POST /api/pastes

Request body:
```json
{
  "content": "string",
  "ttl_seconds": 60,
  "max_views": 5
}

Rules:
content is required and must be non-empty
ttl_seconds is optional and must be ≥ 1
max_views is optional and must be ≥ 1

Response:
{
  "id": "string",
  "url": "https://your-domain.vercel.app/p/<id>"
}
Fetch Paste (API)
GET /api/pastes/:id

Response:
{
  "content": "string",
  "remaining_views": 4,
  "expires_at": "2026-01-01T00:00:00.000Z"
}

Unavailable pastes return HTTP 404.
View Paste (HTML)
GET /p/:id
Returns an HTML page displaying the paste content
Content is safely escaped (no script execution)
Returns HTTP 404 if the paste is unavailable
Expiry Rules
Pastes expire when either:
TTL is reached
View count reaches zero
If both constraints exist, the first triggered constraint makes the paste unavailable
Unavailable pastes always return HTTP 404
Deterministic Time Testing
For automated testing, deterministic time is supported.
If the environment variable below is set:
TEST_MODE=1
The request header:
x-test-now-ms: <milliseconds since epoch>
is used as the current time for expiry logic (API routes only).

Running Locally
npm install
npm run dev

Application runs at:
http://localhost:3000

Environment Variables
Required:
Redis / KV credentials (via Vercel or compatible provider)
Optional:
TEST_MODE=1 for deterministic TTL testing

## Notes
Designed to work correctly in serverless environments
No in-memory persistence is used
All unavailable pastes consistently return HTTP 404
UI is intentionally minimal; functionality is the primary focus

