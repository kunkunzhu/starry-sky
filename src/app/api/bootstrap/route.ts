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