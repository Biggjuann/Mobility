# Mobility

A 6-month progressive mobility & strength program. Local-first iOS app
(React + Capacitor) with an optional cloud account for cross-device sync.

```
client/   Vite + React + Tailwind UI, wrapped for iOS via Capacitor
server/   Express + Postgres API (auth + progress sync) — deploys to Railway
```

The app works fully offline using on-device storage. Creating an account is
optional and only syncs your progress (completed drills, current month, streak).

## Client (web + iOS)

```bash
cd client
npm install
npm run dev            # local web dev server
npm run build          # production web build -> dist/

# iOS (requires macOS + Xcode; done automatically in Codemagic CI)
npx cap add ios        # one-time: generate the native project
npm run cap:sync       # copy web build into the native shell
npm run cap:open:ios   # open in Xcode
```

Set `VITE_API_URL` (see `client/.env.example`) to point at the deployed API.
Leave it empty for a pure offline build.

## Server (Railway)

1. Create a Railway project, add a **Postgres** plugin.
2. Add a service from this repo with **Root Directory = `server`**.
3. Set env vars (see `server/.env.example`):
   - `DATABASE_URL` → reference `${{ Postgres.DATABASE_URL }}`
   - `JWT_SECRET` → a long random string (≥32 chars)
   - `CORS_ORIGINS` → your hosted web origin, if any
   - `NODE_ENV=production`
4. Deploy. Tables are created automatically on boot; `/health` is the healthcheck.

```bash
cd server
npm install
cp .env.example .env   # fill in DATABASE_URL + JWT_SECRET
npm run dev
```

## iOS builds (Codemagic)

`codemagic.yaml` defines the iOS pipeline. In the Codemagic UI you must connect
an App Store Connect API key, configure signing for `com.mobility.app`, and add
a `VITE_API_URL` variable. The native iOS project is generated in CI.

## Security notes

- Passwords hashed with bcrypt (cost 12); secrets only ever come from env.
- JWT auth; login returns an identical generic error for wrong-password and
  unknown-email to prevent account enumeration.
- All SQL is parameterized; request bodies are validated and size-capped; the
  sync endpoint only accepts a fixed allowlist of progress keys.
- Helmet, CORS allowlist, and rate limiting on auth and API routes.
- Remaining `npm audit` warnings in `client/` are build-tooling only (Vite's
  esbuild dev server, Capacitor CLI's tar) and are not part of the shipped app.
