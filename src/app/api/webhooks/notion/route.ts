import { NextRequest, NextResponse } from 'next/server';
import { NotionService } from '@/lib/services/notion';
import { eq } from 'drizzle-orm';
import { db, star_index } from '@/lib/db/index';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const challenge = searchParams.get('challenge');

        if (challenge) {
            console.log('Webhook verification received:', challenge);
            return new Response(challenge, {
                status: 200,
                headers: {
                    'Content-Type': 'text/plain',
                },
            });
        }

        return NextResponse.json({ error: 'No challenge provided' }, { status: 400 });
    } catch (error) {
        console.error('Webhook verification error:', error);
        return NextResponse.json(
            { error: 'Verification failed' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const payload = await request.json();
        const { event, data } = payload;

        switch (event) {
            case 'page.created':
            case 'page.updated':
                await handlePageUpdate(data.page_id);
                break;
            case 'page.deleted':
                await handlePageDelete(data.page_id);
                break;
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json(
            { error: 'Webhook processing failed' },
            { status: 500 }
        );
    }
}

async function handlePageUpdate(pageId: string) {
    try {
        const notionService = new NotionService();
        const star = await notionService.getStarData(pageId);

        if (!star) return;

        const existingStar = await db
            .select()
            .from(star_index)
            .where(eq(star_index.id, pageId))
            .limit(1);

        const indexData = {
            id: pageId,
            title: star.title,
            message: star.message,
            public: star.public,
        };

        if (existingStar.length === 0) {
            await db.insert(star_index).values(indexData);
        } else {
            await db
                .update(star_index)
                .set(indexData)
                .where(eq(star_index.id, pageId));
        }
    } catch (error) {
        console.error(`Error updating page ${pageId}:`, error);
    }
}

async function handlePageDelete(pageId: string) {
    try {
        await db
            .update(star_index)
            .set({ public: false })
            .where(eq(star_index.id, pageId));
    } catch (error) {
        console.error(`⚠️ error deleting page ${pageId}:`, error);
    }
}