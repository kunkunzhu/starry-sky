// // lib/notion-webhook.ts
// import { NextRequest } from 'next/server'
// import { syncStarToDatabase } from './database-sync'

// export async function handleNotionWebhook(req: NextRequest) {
//     const body = await req.json()

//     if (body.event === 'page.updated' || body.event === 'page.created') {
//         const pageId = body.page.id
//         await syncStarToDatabase(pageId)
//     }

//     return new Response('OK', { status: 200 })
// }