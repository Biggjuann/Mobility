import 'dotenv/config';

function required(name) {
  const v = process.env[name];
  if (!v) {
    console.error(`Missing required env var: ${name}`);
    process.exit(1);
  }
  return v;
}

const JWT_SECRET = required('JWT_SECRET');
// Reject weak secrets outright — a guessable signing key defeats auth entirely.
if (JWT_SECRET.length < 32) {
  console.error('JWT_SECRET must be at least 32 characters.');
  process.exit(1);
}

// Origins allowed to call the API. Capacitor's iOS webview uses
// capacitor://localhost; local Vite dev uses http://localhost:5173. Extra
// origins (e.g. the Railway-hosted web build) come from CORS_ORIGINS.
const DEFAULT_ORIGINS = [
  'capacitor://localhost',
  'ionic://localhost',
  'http://localhost',
  'http://localhost:5173',
];

const extraOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

export const config = {
  port: parseInt(process.env.PORT || '8080', 10),
  databaseUrl: required('DATABASE_URL'),
  jwtSecret: JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '30d',
  bcryptRounds: 12,
  corsOrigins: [...new Set([...DEFAULT_ORIGINS, ...extraOrigins])],
  isProd: process.env.NODE_ENV === 'production',
};
