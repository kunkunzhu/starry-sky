// // lib/database-sync.ts
// import { getStarFromNotion, getStarsFromNotion } from './api/notion'
// import { db } from './database' // Your SQL client (Prisma, Drizzle, etc.)

// export async function syncStarToDatabase(notionPageId: string) {
//     try {
//         // Fetch from Notion
//         const notionStar = await getStarFromNotion(notionPageId)

//         if (!notionStar) return

//         await db.star.upsert({
//             where: { notion_id: notionPageId },
//             update: {
//                 title: notionStar.title,
//                 message: notionStar.message,
//                 public: notionStar.public,
//                 updated_at: new Date()
//             },
//             create: {
//                 title: notionStar.title,
//                 message: notionStar.message,
//                 public: notionStar.public,
//                 created_at: new Date(),
//                 updated_at: new Date()
//             }
//         })

//         console.log(`☑️ synced star ${notionPageId} to database`)
//     } catch (error) {
//         console.error('☑️ failed to sync star:', error)
//     }
// }

// export async function syncAllStarsToDatabase() {
//     const allStars = await getStarsFromNotion()

//     for (const star of allStars) {
//         await syncStarToDatabase(star.id)
//     }
// }