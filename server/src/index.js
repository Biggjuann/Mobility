import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config.js';
import { query, migrate } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the legal pages once at startup so requests are pure memory reads.
const PRIVACY_HTML = fs.readFileSync(path.join(__dirname, 'legal/privacy.html'), 'utf8');
const TERMS_HTML = fs.readFileSync(path.join(__dirname, 'legal/terms.html'), 'utf8');
const SUPPORT_HTML = fs.readFileSync(path.join(__dirname, 'legal/support.html'), 'utf8');

const app = express();

// Railway terminates TLS at its proxy; trust it so client IPs (used by the
// rate limiter) are accurate.
app.set('trust proxy', 1);

// CSP off because the API returns JSON (CSP doesn't apply to it) and would
// otherwise block the inline styles in the legal HTML pages. Helmet still
// applies all the other useful headers (HSTS, X-Frame-Options, nosniff, etc.).
app.use(helmet({ contentSecurityPolicy: false }));
app.use(
  cors({
    origin(origin, cb) {
      // Allow same-origin / native tooling requests with no Origin header.
      if (!origin) return cb(null, true);
      if (config.corsOrigins.includes(origin)) return cb(null, true);
      return cb(new Error('Not allowed by CORS'));
    },
  }),
);
// Small cap — the sync payload is tiny; reject anything suspiciously large.
app.use(express.json({ limit: '64kb' }));

// ── Validation schemas ─────────────────────────────────────────────────────
// bcrypt only considers the first 72 bytes, so we cap length to avoid silent
// truncation surprises.
const credentials = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  password: z.string().min(8).max(72),
});

// Only the known progress keys may be synced, each a bounded string. This keeps
// the store from being used as arbitrary cloud storage.
const SYNC_KEYS = [
  'mobility-completed',
  'mobility-current-month',
  'mobility-month-start',
  'mobility-dismissed-advance',
];
const statePayload = z.object({
  state: z
    .record(z.enum(SYNC_KEYS), z.string().max(100000))
    .refine((obj) => Object.keys(obj).length <= SYNC_KEYS.length, {
      message: 'Too many keys',
    }),
});

// ── Rate limiters ──────────────────────────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many attempts. Please try again later.' },
});
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});

// ── Auth helpers ───────────────────────────────────────────────────────────
function signToken(userId) {
  return jwt.sign({ sub: userId }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
}

function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Authentication required.' });
  try {
    const payload = jwt.verify(token, config.jwtSecret);
    req.userId = payload.sub;
    next();
  } catch {
    return res.status(401).json({ error: 'Session expired. Please sign in again.' });
  }
}

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// ── Routes ─────────────────────────────────────────────────────────────────
app.get('/', (_req, res) => res.json({ service: 'mobility-api', ok: true }));
app.get('/health', (_req, res) => res.json({ ok: true }));

// Public legal pages (linked from the paywall and App Store Connect listing).
app.get('/privacy', (_req, res) => res.type('html').send(PRIVACY_HTML));
app.get('/terms', (_req, res) => res.type('html').send(TERMS_HTML));
app.get('/support', (_req, res) => res.type('html').send(SUPPORT_HTML));

// Drill illustrations and other static assets. Layout follows
// /assets/drills/<drill-id>/{hero,phase-*,avoid}.png — drop PNGs and they
// appear in the app without a code change.
app.use(
  '/assets',
  express.static(path.join(__dirname, '../assets'), {
    maxAge: '30d',
    fallthrough: true,
    index: false,
  }),
);

app.post(
  '/api/auth/register',
  authLimiter,
  asyncHandler(async (req, res) => {
    const parsed = credentials.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Enter a valid email and a password of at least 8 characters.' });
    }
    const { email, password } = parsed.data;
    const hash = await bcrypt.hash(password, config.bcryptRounds);
    try {
      const { rows } = await query(
        'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id',
        [email, hash],
      );
      const token = signToken(rows[0].id);
      return res.status(201).json({ token });
    } catch (err) {
      if (err.code === '23505') {
        return res.status(409).json({ error: 'An account with that email already exists.' });
      }
      throw err;
    }
  }),
);

app.post(
  '/api/auth/login',
  authLimiter,
  asyncHandler(async (req, res) => {
    const parsed = credentials.safeParse(req.body);
    // Generic message — never reveal whether the email exists.
    const generic = { error: 'Invalid email or password.' };
    if (!parsed.success) return res.status(401).json(generic);
    const { email, password } = parsed.data;
    const { rows } = await query(
      'SELECT id, password_hash FROM users WHERE email = $1',
      [email],
    );
    const user = rows[0];
    // Always run a bcrypt comparison to keep timing uniform whether or not the
    // user exists (mitigates user-enumeration via response timing).
    const hash = user ? user.password_hash : '$2b$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinva';
    const ok = await bcrypt.compare(password, hash);
    if (!user || !ok) return res.status(401).json(generic);
    return res.json({ token: signToken(user.id) });
  }),
);

app.get(
  '/api/state',
  apiLimiter,
  requireAuth,
  asyncHandler(async (req, res) => {
    const { rows } = await query(
      'SELECT state FROM user_state WHERE user_id = $1',
      [req.userId],
    );
    return res.json({ state: rows[0]?.state || {} });
  }),
);

app.put(
  '/api/state',
  apiLimiter,
  requireAuth,
  asyncHandler(async (req, res) => {
    const parsed = statePayload.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid state payload.' });
    }
    await query(
      `INSERT INTO user_state (user_id, state, updated_at)
       VALUES ($1, $2::jsonb, now())
       ON CONFLICT (user_id)
       DO UPDATE SET state = EXCLUDED.state, updated_at = now()`,
      [req.userId, JSON.stringify(parsed.data.state)],
    );
    return res.json({ ok: true });
  }),
);

// Full account deletion (required by App Store Guideline 5.1.1(v) for any
// app that supports account creation). The user_state row is removed via
// the ON DELETE CASCADE foreign key.
app.delete(
  '/api/account',
  apiLimiter,
  requireAuth,
  asyncHandler(async (req, res) => {
    await query('DELETE FROM users WHERE id = $1', [req.userId]);
    return res.json({ ok: true });
  }),
);

// ── Error handling ─────────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  if (err && err.message === 'Not allowed by CORS') {
    return res.status(403).json({ error: 'Origin not allowed.' });
  }
  console.error(err);
  // Never leak internals to the client.
  return res.status(500).json({ error: 'Something went wrong. Please try again.' });
});

// ── Boot ───────────────────────────────────────────────────────────────────
migrate()
  .then(() => {
    app.listen(config.port, () => {
      console.log(`Mobility API listening on :${config.port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to run migrations:', err);
    process.exit(1);
  });
