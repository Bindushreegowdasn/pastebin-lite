import { kv } from '@vercel/kv';

export type Paste = {
  id: string;
  content: string;
  createdAt: number;
  ttlSeconds?: number;
  maxViews?: number;
  viewCount: number;
  expiresAt?: number | null;
};

/* ---------- helpers ---------- */

export function getCurrentTime(request?: Request) {
  if (process.env.TEST_MODE === '1') {
    const header = request?.headers.get('x-test-now-ms');
    if (header) {
      const t = Number(header);
      if (!Number.isNaN(t)) return t;
    }
  }
  return Date.now();
}

export function isExpired(paste: Paste, now: number) {
  if (!paste.expiresAt) return false;
  return now >= paste.expiresAt;
}

export function isViewLimitExceeded(paste: Paste) {
  if (paste.maxViews == null) return false;
  return paste.viewCount >= paste.maxViews;
}

/* ---------- KV operations ---------- */

export async function savePaste(paste: Paste) {
  const expiresAt = paste.ttlSeconds
    ? paste.createdAt + paste.ttlSeconds * 1000
    : null;

  const data: Paste = {
    ...paste,
    expiresAt,
  };

  await kv.set(`paste:${paste.id}`, data);
  return true;
}

export async function getPaste(id: string) {
  return (await kv.get<Paste>(`paste:${id}`)) ?? null;
}

export async function incrementViewCount(id: string) {
  const paste = await getPaste(id);
  if (!paste) return null;

  paste.viewCount += 1;
  await kv.set(`paste:${id}`, paste);
  return paste;
}

export async function deletePaste(id: string) {
  await kv.del(`paste:${id}`);
}
