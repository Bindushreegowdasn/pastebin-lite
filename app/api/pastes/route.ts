import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { savePaste, Paste } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.content || typeof body.content !== 'string' || body.content.trim() === '') {
      return NextResponse.json(
        { error: 'Content is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    if (body.ttl_seconds !== undefined) {
      if (!Number.isInteger(body.ttl_seconds) || body.ttl_seconds < 1) {
        return NextResponse.json(
          { error: 'ttl_seconds must be an integer >= 1' },
          { status: 400 }
        );
      }
    }

    if (body.max_views !== undefined) {
      if (!Number.isInteger(body.max_views) || body.max_views < 1) {
        return NextResponse.json(
          { error: 'max_views must be an integer >= 1' },
          { status: 400 }
        );
      }
    }

    const id = nanoid(10);
    const paste: Paste = {
      id,
      content: body.content,
      createdAt: Date.now(),
      ttlSeconds: body.ttl_seconds,
      maxViews: body.max_views,
      viewCount: 0,
    };

    const saved = await savePaste(paste);
    if (!saved) {
      return NextResponse.json(
        { error: 'Failed to save paste' },
        { status: 500 }
      );
    }

    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const url = `${protocol}://${host}/p/${id}`;

    return NextResponse.json(
      { id, url },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating paste:', error);
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}