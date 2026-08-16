# Kupa — AI Financial Wellness Companion

> **Money stress, made gentle.**

Kupa turns a 60-second daily check-in into one small, personalised nudge. Built for
students, gig workers, and anyone living on irregular income, it treats financial anxiety
as the wellness issue it is — no budgeting spreadsheets, no guilt, no jargon.

```
"Mood: Anxious. Rent is due before my next gig pays."
└─> 😐 One nudge: "Rent came up 3 days running. Move N$ 50 aside today — small, but it quiets the loop."
```

---

## What the application does

Kupa is a full-stack web app with two surfaces:

1. **A marketing/landing site** (`/`) that explains the product, how it works, its features,
   and the community promise.
2. **An authenticated app** (`/app/*`) — a dashboard, a daily check-in flow, a persistent
   AI chat, plus mood, goals, nudge, and community screens — everything behind a sign-in.

The core loop is deliberately small:

| Step | What happens |
| --- | --- |
| **Check in** | Type how money feels today (mood, rough spend, one worry). Three questions, about 60 seconds. |
| **The agent listens** | Kupa's backend reads your words, classifies stress, and generates a single kind, specific tip — never generic advice. |
| **Chat it out** | Talk through nagging money worries with a persistent AI companion that remembers the conversation. |
| **Follow up gently** | Nudges and a mood trend show how your money stress is (or isn't) shifting over time. |

Kupa never presents itself as financial or clinical advice. Responses are clearly AI-generated.

---

## Features

### Live, end-to-end
- **Email/password authentication** — sign up, sign in, and protected `/app` routes.
  Sessions are handled by Convex Auth (Password provider) with JWT-based sessions.
- **AI chat with persistence** (`/app/chat`) — create, rename, and delete conversations.
  Messages are stored in Convex (`chats` / `chatMessages`) and replies are generated via
  OpenRouter with the conversation history as context.
  - Short, warm replies (max ~3 sentences unless detail is requested).
  - **Crisis detection** — if a user mentions self-harm or suicide, Kupa stops giving
    financial advice and gently points to real support lines (e.g. US 988, UK Samaritans 116 123).
  - **Graceful fallback** — if the model call fails, the user gets a kind retry message,
    never an error wall.

### Check-in + AI nudge (feature flow; backend ready)
- `/app/checkin` walks through three steps (mood → spending → worry) and returns a nudge.
- The Convex backend exposes the full pipeline: `checkins.submit` (an **action** that calls
  the AI to generate the nudge, then persists the check-in), `ai.generateNudge`, and
  `ai.extractCheckInInsights` (structured JSON themes + urgency for future insights).
- `checkins.listMine` returns the user's last 30 check-ins, ready for the mood/trend screens.

### Presentational screens (landing + app)
The following screens ship polished UI with sample/seed data. Their Convex tables and
functions are already in place where relevant:
- **Mood trends** (`/app/mood`) — a 4-week mood bar chart and recent check-in list.
- **Nudges** (`/app/nudges`) — a feed of past nudges with "helpful / not for me" actions.
- **Goals** (`/app/goals`) — tiny savings goals (rent buffer, data fund, textbooks) with
  progress bars in Namibian dollars (N$).
- **Encouragement board** (`/app/community`) — anonymous notes with a heart counter.
- **Onboarding** (`/app/onboarding`) — a 3-tap setup (who you are, biggest stress, nudge timing).

> **Status note:** `profiles`, `checkIns`, `chats`, and `chatMessages` are the four
> application tables defined in `convex/schema.ts`. Auth and chat are fully wired to them;
> check-in/mood/goals/community pages currently run on front-end state and will be connected
> as the features progress.

---

## Tech stack

| Layer | Technology |
| --- | --- |
| Framework | [TanStack Start](https://tanstack.com/start) (React 19) + file-based routing ([TanStack Router](https://tanstack.com/router)) |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`), Radix UI primitives, `tw-animate-css`, `motion` |
| Icons | `lucide-react` |
| Backend | [Convex](https://www.convex.dev) — reactive database, queries/mutations/actions, auth tables |
| Auth | `@convex-dev/auth` with the **Password** provider (JWT via `jose`) |
| AI | [OpenRouter](https://openrouter.ai) chat completions (default model: `deepseek/deepseek-v4-flash`) |
| Build/deploy | Vite 8 + Nitro (Netlify preset) → server-side rendered function + static assets |
| Tests | Vitest + Testing Library (jsdom) |
| Tooling | ESLint (flat config), Prettier, TypeScript strict |
| Package managers | npm and Bun (both lockfiles are kept in sync) |

### Why SSG-ish SSR on Netlify
The app is server-side rendered so the landing page and app shells are fast and
SEO-friendly, while static assets (`dist/`) are cached by Netlify's CDN. The SSR runtime is
emitted as a Netlify internal function (`.netlify/functions-internal/server`).

---

## Project structure

```
kupa/
├── convex/                  # Backend: database, functions, auth
│   ├── schema.ts            # Tables: profiles, checkIns, chats, chatMessages + auth tables
│   ├── auth.ts              # Convex Auth config (Password provider)
│   ├── http.ts              # HTTP router (auth routes)
│   ├── users.ts             # current / ensureProfile / completeOnboarding
│   ├── checkins.ts          # submit (action) → generateNudge + save; listMine
│   ├── ai.ts                # generateNudge, extractCheckInInsights (OpenRouter actions)
│   ├── chat.ts              # chat.send action — history-aware replies + crisis handling
│   ├── chats.ts             # CRUD for conversations (+ internal clear)
│   ├── messages.ts          # list / history / insert (ownership-checked)
│   ├── lib/openrouter.ts    # chatCompletion + model helpers (reads env, requires API key)
│   └── _generated/          # Auto-generated Convex client/bindings (do not edit)
├── src/
│   ├── routes/              # File-based routes: landing, signin/signup, /app/* 
│   │                        # (index, signin, signup, forgot-password, __root,
│   │                        #  app, app.index, app.checkin, app.chat, app.mood,
│   │                        #  app.goals, app.nudges, app.community, app.onboarding,
│   │                        #  app.profile, app.settings)
│   ├── components/          # Navbar, Hero, Footer, AppShell, AuthLayout, landing sections
│   │                        # + shadcn/Radix "ui" primitives
│   ├── router.tsx           # Router + Convex QueryClient + SSR query integration
│   ├── server.ts            # SSR entry wrapper (catastrophic-error handling, error page)
│   ├── start.ts             # Start instance + CSRF/error middleware
│   └── styles.css           # Tailwind theme tokens (plum, blush, butter, lilac, mint…)
├── tests/                   # Vitest suites (ai, chat, chats, checkins, openrouter, …)
├── public/                  # Static assets (robots.txt)
├── netlify.toml             # Netlify build/publish config
├── vite.config.ts           # Vite + TanStack Start + Nitro (netlify preset)
├── generateKeys.mjs         # Generates JWT_PRIVATE_KEY + JWKS pair
└── scripts/sync-convex-env.mjs  # Pushes selected .env values into the Convex deployment
```

### Key source maps
- Protected app shell + sign-out: `src/components/AppShell.tsx`, `src/routes/app.tsx`
- Auth guard: `src/routes/app.tsx` (redirects unauthenticated users to `/signin`)
- Root head/SEO + fonts: `src/routes/__root.tsx`
- AI conversation logic (prompt + crisis handling): `convex/chat.ts`

---

## How the pieces fit together (how it works)

1. **User signs up** → `convex/auth` stores credentials; `profiles` row is created on first
   use via `users.ensureProfile`.
2. **Chat** (`/app/chat`) → `chats.create` / `chats.rename` / `chats.remove`,
   `messages.list` for the thread, and `chat.send` (an **action**) which:
   - loads the last 20 messages as context,
   - checks for crisis keywords,
   - calls OpenRouter (`chatCompletion`) with a system prompt,
   - writes both the user message and the assistant reply to `chatMessages`.
3. **Check-in** → `checkins.submit` (an **action**) runs `ai.generateNudge` then
   `checkins.save`, so the user sees one personalised nudge and the record is stored.
4. **Landing/`/app` shell SSR** → Nitro server-renders the app; static assets and headers
   (`_headers`, `_redirects`) are written into `dist/`. `src/server.ts` normalises any
   swallowed SSR errors into a clean error page.

---

## Getting started

### Prerequisites
- **Node.js ≥ 22** (Nitro/TanStack Start toolchain requires `>=22.12`)
- npm **and/or** Bun 1.x
- A **Convex** account + project (the dashboard CLI is free to use locally)
- An **OpenRouter** API key for AI replies

### 1. Install dependencies
```bash
npm install      # or: bun install
```

### 2. Configure environment variables
```bash
cp .env.example .env
```
Fill in the values (see the table below). For auth you need an RSA keypair:

```bash
node generateKeys.mjs     # prints JWT_PRIVATE_KEY=... and JWKS=...
```
Paste both lines into `.env`.

### 3. Start Convex locally
```bash
npx convex dev            # long-running: pushes schema, starts a local deploy, codegen
```
Then push the backend env vars into that deployment:
```bash
npm run convex:env        # reads .env and sets OPENROUTER_*, JWT keys, JWKS on Convex
```

### 4. Run the app
```bash
npm run dev               # Vite dev server (TanStack Start)
```
Open the local URL printed by Vite after startup (default `http://localhost:5173`).

---

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_CONVEX_URL` | Yes | Convex deployment URL (exposed to the client as `import.meta.env.VITE_CONVEX_URL`) |
| `OPENROUTER_API_KEY` | Yes (for AI) | OpenRouter API key (server-side, kept in Convex env) |
| `OPENROUTER_BASE_URL` | No | Defaults to `https://openrouter.ai/api/v1` |
| `RESPONSE_MODEL` | No | Model for chat + nudges. Default `deepseek/deepseek-v4-flash` |
| `EXTRACTION_MODEL` | No | Model for check-in insight extraction. Default `deepseek/deepseek-v4-flash` |
| `JWT_PRIVATE_KEY` | Yes (for auth) | RSA PKCS#8 private key used by Convex Auth to sign tokens |
| `JWKS` | Yes (for auth) | Public JWKS JSON for token verification |
| `CONVEX_SITE_URL` | Yes (for auth) | The site URL the auth provider is served from |

> `.env*` is git-ignored; only `.env.example` (placeholders) is committed. Server-side
> secrets (`OPENROUTER_*`, `JWT_PRIVATE_KEY`, `JWKS`, `CONVEX_SITE_URL`) live in the Convex
> deployment environment, pushed with `npm run convex:env`.

---

## Available scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build (Vite + Nitro, Netlify preset → `.netlify/functions-internal` + `dist`) |
| `npm run build:dev` | Development-mode build |
| `npm run preview` | Preview the production build |
| `npm run lint` | ESLint (flat config) across the project |
| `npm run format` | Prettier (writes) |
| `npm test` | Run the Vitest suite |
| `npm run convex:dev` | Local Convex dev server + codegen |
| `npm run convex:codegen` | Regenerate `convex/_generated/*` |
| `npm run convex:env` | Sync selected `.env` values into the Convex deployment |

---

## Testing

```bash
npm test
```
The suite (79 tests across 10 files) covers the server/backend logic and UI helpers:
AI nudge/insight generation, chat reply flow (including crisis responses and the graceful
fallback when the model fails), chat/check-in persistence (with mocked Convex invocation),
OpenRouter client behaviour, schema shapes, the root error page, and the `use-mobile` hook.

---

## Deployment

### Netlify
- Config lives in `netlify.toml`: `npm run build`, publish directory `dist`.
- The build emits:
  - **`.netlify/functions-internal/server`** — the SSR function (Netlify internal function,
    auto-deployed) that handles all routes,
  - **`dist/`** — static assets + `_headers`/`_redirects` for cache policy.
- In the Netlify UI (or via env), set `VITE_CONVEX_URL` for the build, and make sure the
  **Convex production deployment** has `OPENROUTER_API_KEY`, the response/extraction models,
  `JWT_PRIVATE_KEY`, `JWKS`, and `CONVEX_SITE_URL` configured (`npm run convex:env` against
  production).

### Convex
`convex/auth.config.ts` binds the auth provider to `CONVEX_SITE_URL`. Ensure both the app on
Netlify and Convex are given the same site URL so the auth callback works.

---

## Safety & privacy

- **Not financial or clinical advice.** All assistant output is generated content and is
  labelled as such in the UI.
- **Crisis handling.** `convex/chat.ts` detects at-risk language and responds with supportive
  guidance and real helpline numbers instead of financial advice.
- **Private by default.** Check-in text and chat history are per-user and never public
  unless you choose to post something to the encouragement board.
- **Secrets stay out of git.** Environment files are ignored; keys are pushed to Convex
  rather than committed.

---

## Credits

Developed by **Saya Mubiana**.

Contact options appear at the bottom of the site footer (a small dropdown):
- **Email:** mubianasaya@gmail.com
- **Phone:** +264 81 558 0036

Built with TanStack Start, Convex, Tailwind CSS, and a lot of kindness for CS Girlies
Hackathon 2026. 🌸

---

## License

No license is specified in this repository — all rights reserved unless stated otherwise.