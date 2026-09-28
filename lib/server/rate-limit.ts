const memory = new Map<string, { count: number; resetAt: number }>();

export async function rateLimit(key: string, limit: number, windowSeconds: number) {
  const now = Date.now();
  const resetAt = now + windowSeconds * 1000;
  const current = memory.get(key);

  if (!current || current.resetAt < now) {
    memory.set(key, { count: 1, resetAt });
    return { ok: true, remaining: limit - 1 };
  }

  if (current.count >= limit) {
    return { ok: false, remaining: 0 };
  }

  current.count += 1;
  return { ok: true, remaining: limit - current.count };
}
