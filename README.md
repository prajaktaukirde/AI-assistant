# VedaAI — AI Assessment Creator

Generate beautiful, structured question papers from a prompt or source PDF. Built end-to-end with Next.js, Express, MongoDB, Redis, BullMQ, WebSockets, and Google Gemini.

## Tech stack

| Layer    | Stack |
| -------- | ----- |
| Frontend | Next.js 14 (App Router) · TypeScript · Tailwind · Zustand · React Hook Form + Zod · socket.io-client · jsPDF + html2canvas |
| Backend  | Node.js · Express · TypeScript · Mongoose · BullMQ · Redis (ioredis) · socket.io · Multer · pdf-parse |
| AI       | Google Gemini (`@google/generative-ai`) — falls back to a deterministic mock if no key is set |
| Infra    | MongoDB · Redis · Render (backend) · Vercel (frontend) |

## Architecture

```
   Browser ──HTTP──▶ Express API ──enqueue──▶ BullMQ (Redis)
       ▲                  │                       │
       │                  ▼                       ▼
       │             MongoDB                Background Worker
       │                                          │
       │                                          ▼
       │                                    Gemini API
       │                                          │
       └──── WebSocket (socket.io) ◀── progress / ready ─┘
```

1. User submits the form → `POST /api/assessments` (multipart with optional file).
2. Backend validates with Zod, persists to Mongo, enqueues a job in BullMQ.
3. Worker pulls the job, calls Gemini with a strict JSON-schema prompt, parses, validates, stores `paper`.
4. Worker emits `assessment:progress`, `assessment:ready`, or `assessment:failed` to the user's room.
5. Frontend subscribes via socket.io and rerenders the paper view when ready.

`RUN_WORKER_INLINE=true` runs the worker in-process (free Render plan friendly). Set to `false` and run `npm run worker:prod` separately for horizontal scaling.

## Repo layout

```
Ass/
├── backend/         Express + BullMQ + Mongoose + socket.io
│   ├── src/         config, models, routes, queues, services, sockets, utils
│   ├── docker-compose.yml   ← spins up local mongo + redis
│   ├── render.yaml
│   └── .env.example
└── frontend/        Next.js App Router
    ├── src/         app pages, components, lib, store
    ├── vercel.json
    └── .env.example
```

## Quick start (local)

### Prerequisites

- Node.js 20+
- **One of**: Docker (recommended), or local Mongo/Redis, or free MongoDB Atlas + Upstash Redis
- A free Gemini API key from <https://aistudio.google.com/app/apikey> (optional — backend falls back to a mock if missing)

### 1. Start Mongo + Redis (Docker)

```bash
cd backend
docker compose up -d
```

If you don't have Docker, either install Mongo + Redis locally or use the free cloud option (Atlas + Upstash) and update `MONGO_URI` / `REDIS_URL` in `.env`.

### 2. Backend

```bash
cd backend
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY (optional)
npm install
npm run dev
```

API on <http://localhost:4000>. With `RUN_WORKER_INLINE=true`, the BullMQ worker runs in-process.

### 3. Frontend

```bash
cd ../frontend
cp .env.example .env.local
npm install
npm run dev
```

Open <http://localhost:3000>.

## API

| Method | Path                                  | Notes                          |
| ------ | ------------------------------------- | ------------------------------ |
| POST   | `/api/assessments`                    | Multipart. Creates assignment, enqueues job |
| GET    | `/api/assessments/:id`                | Fetch state + paper            |
| GET    | `/api/assessments`                    | List (last 50)                 |
| POST   | `/api/assessments/:id/regenerate`     | Reset and re-enqueue           |
| DELETE | `/api/assessments/:id`                | Delete                         |
| GET    | `/health`                             | Liveness                       |

WebSocket events (room `assessment:<id>`, joined with `socket.emit('subscribe', id)`):

- `assessment:progress` `{ status, progress, message }`
- `assessment:ready` `{ assessmentId }`
- `assessment:failed` `{ assessmentId, message }`

## Deployment

### Backend on Render

1. Push to GitHub.
2. Render → **New +** → **Blueprint** → point to repo. `backend/render.yaml` is auto-detected.
3. Set env vars on the service:
   - `MONGO_URI` — MongoDB Atlas connection string (free tier)
   - `REDIS_URL` — Upstash Redis URL (use `rediss://` for TLS)
   - `GEMINI_API_KEY` — Google AI Studio key
   - `CLIENT_ORIGIN` — your Vercel URL once deployed
4. Deploy. Free plan runs API + worker inline.

### Frontend on Vercel

1. Import repo. Set **Root Directory** to `frontend`.
2. Add env: `NEXT_PUBLIC_API_URL=https://<your-render-backend>.onrender.com`.
3. Deploy.

After both are up, update `CLIENT_ORIGIN` on Render to the final Vercel URL to lock CORS.

## Approach

- **Prompt structuring.** The prompt declares an exact TypeScript shape for the JSON response, with constraints on totals, type breakdown, and section grouping. Gemini is configured with `responseMimeType: "application/json"`, and the parser strips fences and isolates the largest `{…}` block as a fallback.
- **Never render raw AI.** Responses are parsed, normalized (difficulty enum, marks coercion, MCQ options), and persisted on the document. The UI only ever reads the cleaned `paper` object.
- **Real-time UX.** The /result page subscribes to a WS room keyed by assessment ID, watches a 4-step progress timeline, and swaps in the paper when `ready`.
- **PDF export.** The paper view is print-friendly (`@media print` clears chrome) and exportable via `html2canvas` + `jsPDF` (multi-page A4).
- **Validation.** Zod on both server and client.

## Bonus features included

- ✅ PDF export (multi-page A4, not raw print)
- ✅ Regenerate action
- ✅ Print mode
- ✅ Inline worker for free-tier Render
- ✅ Source-grounded generation when a file is uploaded
- ✅ Mock fallback so the app works without an API key
- ✅ VedaAI UI: sidebar layout, orange/black brand, empty + filled assignments states, exam-style paper with answer key

## License

MIT
