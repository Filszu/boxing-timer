/** Inclusive random integer in [a, b] */
export function randomBetween(a: number, b: number): number {
  const lo = Math.min(a, b);
  const hi = Math.max(a, b);
  if (hi <= lo) return lo;
  return Math.floor(Math.random() * (hi - lo + 1)) + lo;
}

export type AccelRange = { start: number; end: number };

/**
 * Build non-overlapping acceleration windows within a work round (elapsed seconds from 0).
 * Pattern: gap → accel → gap → accel → … until the round would exceed `roundSeconds`.
 */
export function computeAccelRanges(
  roundSeconds: number,
  durationFixed: number,
  durationRandom: boolean,
  durationMin: number,
  durationMax: number,
  breakFixed: number,
  breakRandom: boolean,
  breakMin: number,
  breakMax: number
): AccelRange[] {
  const R = Math.max(1, roundSeconds);
  const ranges: AccelRange[] = [];
  let t = 0;

  while (t < R) {
    const gap = breakRandom
      ? randomBetween(Math.max(1, breakMin), Math.max(1, breakMax))
      : Math.max(0, breakFixed);
    t += gap;
    if (t >= R) break;

    const rawDur = durationRandom
      ? randomBetween(Math.max(1, durationMin), Math.max(1, durationMax))
      : Math.max(1, durationFixed);
    const d = Math.min(Math.max(1, rawDur), R - t);
    ranges.push({ start: t, end: t + d });
    t += d;
  }

  return ranges;
}

/** Elapsed second indices (1-based timeline: after `t` seconds, elapsed is `t`) when a beep should fire. */
export function computeBeepTimes(
  roundSeconds: number,
  gapMin: number,
  gapMax: number
): number[] {
  const R = Math.max(1, roundSeconds);
  const gMin = Math.max(1, Math.min(gapMin, gapMax));
  const gMax = Math.max(gMin, Math.max(gapMin, gapMax));
  const times: number[] = [];
  let t = randomBetween(gMin, gMax);
  while (t < R) {
    times.push(t);
    t += randomBetween(gMin, gMax);
  }
  return times;
}

export function isInsideAccelRange(
  ranges: AccelRange[],
  elapsed: number
): boolean {
  return ranges.some((r) => elapsed >= r.start && elapsed < r.end);
}

/** Whole seconds left in the current acceleration window, or null if not in one. */
export function getAccelRemainingSeconds(
  ranges: AccelRange[],
  elapsed: number
): number | null {
  for (const r of ranges) {
    if (elapsed >= r.start && elapsed < r.end) {
      return r.end - elapsed;
    }
  }
  return null;
}
