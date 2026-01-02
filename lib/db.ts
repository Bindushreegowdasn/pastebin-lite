import { kv } from '@vercel/kv';

export interface Paste {
  id: string;
  content: string;
  createdAt: number;
  ttlSeconds?: number;
  maxViews?: number;
  viewCount: number;
}

export function getCurrentTime(headers: Headers): number {
  const testMode = process.env.TEST_MODE === '1';
  if (testMode) {
    const testNow = headers.get('x-test-now-ms');
    if (testNow) {
      return parseInt(testNow, 10);
    }
  }
  return Date.now();
}

export function isExpired(paste: Paste, currentTime: number): boolean {
  if (paste.ttlSeconds) {
    const expiryTime = paste.createdAt + paste.ttlSeconds * 1000;
    if (currentTime >= expiryTime) {
      return true;
    }
  }
  return false;
}

export function isViewLimitExceeded(paste: Paste): boolean {
  if (paste.maxViews !== undefined && paste.viewCount >= paste.maxViews) {
    return true;
  }
  return false;
}

export async function getPaste(id: string): Promise<Paste | null> {
  try {
    const paste = await kv.get<Paste>(`paste:${id}`);
    return paste;
  } catch (error) {
    console.error('Error getting paste:', error);
    return null;
  }
}

export async function savePaste(paste: Paste): Promise<boolean> {
  try {
    await kv.set(`paste:${paste.id}`, paste);
    return true;
  } catch (error) {
    console.error('Error saving paste:', error);
    return false;
  }
}

export async function incrementViewCount(id: string): Promise<boolean> {
  try {
    const paste = await getPaste(id);
    if (!paste) return false;
    
    paste.viewCount += 1;
    await savePaste(paste);
    return true;
  } catch (error) {
    console.error('Error incrementing view count:', error);
    return false;
  }
}