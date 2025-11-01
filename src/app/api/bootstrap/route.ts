import { IndexService } from "@/lib/services";
import { NextResponse } from "next/server";

export async function POST() {
    try {

        const indexService = new IndexService();
        const result = await indexService.bootstrapIndex();

        return NextResponse.json({
            success: true,
            ...result,
        });
    } catch (error) {
        console.error('⚠️ bootstrap API error:', error);
        return NextResponse.json(
            {
                success: false,
                error: '⚠️ bootstrap failed',
                details: error instanceof Error ? error.message : '⚠️ unknown error'
            },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const indexService = new IndexService();
        const stars = await indexService.getStarList();

        return NextResponse.json({
            success: true,
            count: stars.length,
            posts: stars.map(star => ({
                id: star.id,
                title: star.title,
                message: star.message
            })),
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: `⚠️ failed to get stars, ${error}` },
            { status: 500 }
        );
    }
}