import { kv } from '@vercel/kv';

export type Paste = {
  id: string;
  content: string;
  createdAt: number;
  ttlSeconds?: number;
  maxViews?: number;
  viewCount: number;
};

export async function savePaste(paste: Paste) {
  const key = `paste:${paste.id}`;

  const expiresAt = paste.ttlSeconds
    ? paste.createdAt + paste.ttlSeconds * 1000
    : null;

  const data = {
    ...paste,
    expiresAt,
  };

  await kv.set(key, data);

  return true;
}

export async function getPaste(id: string) {
  return await kv.get(`paste:${id}`);
}

export async function deletePaste(id: string) {
  await kv.del(`paste:${id}`);
}
