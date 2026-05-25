// Date + formatting helpers.

export const todayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const daysBetween = (isoStart) => {
  if (!isoStart) return 0;
  const start = new Date(isoStart);
  const now = new Date();
  return Math.floor((now - start) / (1000 * 60 * 60 * 24));
};

export const formatTime = (s) => {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2, '0')}`;
};

export const dateKey = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate(),
  ).padStart(2, '0')}`;

export const addDays = (d, n) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};

// Build a 6x7 grid of Date cells for the given year/month (0-indexed month),
// padded with the surrounding month's days so the week rows are complete.
export const monthGrid = (year, month) => {
  const first = new Date(year, month, 1);
  const startOffset = first.getDay();
  const gridStart = addDays(first, -startOffset);
  const cells = [];
  for (let i = 0; i < 42; i++) cells.push(addDays(gridStart, i));
  return cells;
};

export const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];
