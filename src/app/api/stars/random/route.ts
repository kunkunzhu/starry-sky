import { NextResponse } from 'next/server';
import { db, star_index } from '@/lib/db';
import { NotionService } from '@/lib/services/notion';
import { eq, sql } from 'drizzle-orm';

export async function GET() {
    try {
        const randomStar = await db
            .select()
            .from(star_index)
            .where(eq(star_index.public, true))
            .orderBy(sql`RANDOM()`)
            .limit(1);

        if (randomStar.length === 0) {
            return NextResponse.json(
                { error: '⚠️ no posts found' },
                { status: 404 }
            );
        }

        const starIndex = randomStar[0];

        const notionService = new NotionService();
        const starData = await notionService.getStarData(starIndex.id);

        if (!starData) {
            return NextResponse.json(
                { error: '⚠️ star not found in Notion' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            star: starData,
        });
    } catch (error) {
        console.error('⚠️ random post API error:', error);
        return NextResponse.json(
            {
                success: false,
                error: '⚠️ failed to get random star'
            },
            { status: 500 }
        );
    }
}