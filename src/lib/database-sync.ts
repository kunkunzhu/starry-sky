// lib/database-sync.ts
import { getStarFromNotion } from './notion'
import { db } from './database' // Your SQL client (Prisma, Drizzle, etc.)

export async function syncStarToDatabase(notionPageId: string) {
    try {
        // Fetch from Notion
        const notionStar = await getStarFromNotion(notionPageId)

        if (!notionStar) return

        // Upsert to SQL database
        await db.star.upsert({
            where: { notion_id: notionPageId },
            update: {
                title: notionStar.title,
                message: notionStar.message,
                author: notionStar.author,
                published: notionStar.published,
                coordinates_x: notionStar.coordinatesX,
                coordinates_y: notionStar.coordinatesY,
                updated_at: new Date()
            },
            create: {
                notion_id: notionPageId,
                title: notionStar.title,
                message: notionStar.message,
                author: notionStar.author,
                published: notionStar.published,
                coordinates_x: notionStar.coordinatesX,
                coordinates_y: notionStar.coordinatesY,
                created_at: new Date(),
                updated_at: new Date()
            }
        })

        console.log(`Synced star ${notionPageId} to database`)
    } catch (error) {
        console.error('Failed to sync star:', error)
    }
}

// Bulk sync all stars (for initial setup or recovery)
export async function syncAllStarsToDatabase() {
    const allStars = await getStarsFromNotion()

    for (const star of allStars) {
        await syncStarToDatabase(star.id)
    }
}