import { sql } from '@vercel/postgres'
import { StarRecord } from './types/misc'

export async function getRandomStarFromDB(): Promise<StarRecord | null> {
    try {
        const result = await sql`
        SELECT * FROM stars 
        WHERE public = true 
        ORDER BY RANDOM() 
        LIMIT 1
      `

        return result.rows[0] ? (result.rows[0] as StarRecord) : null
    } catch (error) {
        console.error('⚠️ error getting random star:', error)
        return null
    }
}

export async function upsertStar(starData: {
    notionId: string
    title: string
    message: string
    public: boolean
}): Promise<StarRecord | null> {
    try {
        const result = await sql`
        INSERT INTO stars (
          notion_id, title, message, public, created_at, updated_at
        ) VALUES (
          ${starData.notionId},
          ${starData.title},
          ${starData.message},
          ${starData.public},
          CURRENT_TIMESTAMP
        )
        ON CONFLICT (notion_id) 
        DO UPDATE SET
          title = EXCLUDED.title,
          message = EXCLUDED.message,
          public = EXCLUDED.published,
          updated_at = CURRENT_TIMESTAMP
        RETURNING *
      `

        return result.rows[0] as StarRecord
    } catch (error) {
        console.error('⚠️ error upserting star:', error)
        return null
    }
}

export async function deleteStarByNotionId(notionId: string): Promise<boolean> {
    try {
        await sql`
        DELETE FROM stars 
        WHERE notion_id = ${notionId}
      `

        return true
    } catch (error) {
        console.error('⚠️ error deleting star:', error)
        return false
    }
}