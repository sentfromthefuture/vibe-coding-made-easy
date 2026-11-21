export type Limiter = { limit(o: { key: string }): Promise<{ success: boolean }> };

/** Best-effort fallback when the Cloudflare binding is missing. Per isolate only, so it is weak by design. */
export function memoryLimiter(limit: number, periodMs: number, now: () => number = Date.now): Limiter {
  const windows = new Map<string, { count: number; reset: number }>();
  return {
    async limit({ key }) {
      const t = now();
      if (windows.size > 5000) for (const [k, w] of windows) if (w.reset <= t) windows.delete(k);
      const w = windows.get(key);
      if (!w || w.reset <= t) { windows.set(key, { count: 1, reset: t + periodMs }); return { success: true }; }
      w.count++;
      return { success: w.count <= limit };
    },
  };
}
