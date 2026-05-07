import { NextRequest, NextResponse } from 'next/server';
import { getTVByCategoryPaginated } from '@/lib/tmdb';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page') ?? '1', 10);

    if (!category) {
        return NextResponse.json({ error: 'category is required' }, { status: 400 });
    }

    try {
        const data = await getTVByCategoryPaginated(category, page);
        return NextResponse.json(data);
    } catch {
        return NextResponse.json({ error: 'Failed to fetch TV shows' }, { status: 500 });
    }
}
