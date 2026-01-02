import { NextRequest, NextResponse } from 'next/server';
import { getPaste, getCurrentTime, isExpired, isViewLimitExceeded, incrementViewCount } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const paste = await getPaste(id);

    if (!paste) {
      return NextResponse.json(
        { error: 'Paste not found' },
        { status: 404 }
      );
    }

    const currentTime = getCurrentTime(request.headers);

    if (isExpired(paste, currentTime)) {
      return NextResponse.json(
        { error: 'Paste expired' },
        { status: 404 }
      );
    }

    if (isViewLimitExceeded(paste)) {
      return NextResponse.json(
        { error: 'View limit exceeded' },
        { status: 404 }
      );
    }

    await incrementViewCount(id);

    let remainingViews: number | null = null;
    if (paste.maxViews !== undefined) {
      remainingViews = paste.maxViews - (paste.viewCount + 1);
      if (remainingViews < 0) remainingViews = 0;
    }

    let expiresAt: string | null = null;
    if (paste.ttlSeconds) {
      expiresAt = new Date(paste.createdAt + paste.ttlSeconds * 1000).toISOString();
    }

    return NextResponse.json(
      {
        content: paste.content,
        remaining_views: remainingViews,
        expires_at: expiresAt,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching paste:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}