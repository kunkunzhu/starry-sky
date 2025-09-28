import { Client } from '@notionhq/client'
import { StarData } from './types/misc'
import { NotionPage } from './types/notion'

const notion = new Client({
    auth: process.env.NOTION_TOKEN,
})

export const DATABASE_ID = process.env.NOTION_DATABASE_ID!

export async function getStarsFromNotion(): Promise<StarData[]> {
    try {
        // Use the correct method name for querying databases
        const response = await notion.dataSources.query({
            data_source_id: DATABASE_ID,
            filter: {
                property: 'Public',
                checkbox: {
                    equals: true
                }
            },
        })

        return response.results
            .map((page) => {
                const star = (page as NotionPage).properties

                return {
                    id: page.id,
                    title: star.Title?.title?.[0]?.plain_text || '',
                    message: star.Message?.rich_text?.[0]?.plain_text || '',
                    public: star.Public?.checkbox || false,
                }
            })
    } catch (error) {
        console.error('⚠️ error fetching stars from Notion:', error)
        return []
    }
}

export async function getStarFromNotion(pageId: string): Promise<StarData | null> {
    try {
        const response = await notion.pages.retrieve({ page_id: pageId })

        const star = (response as NotionPage).properties

        return {
            id: response.id,
            title: star.Title?.title?.[0]?.plain_text || '',
            message: star.Message?.rich_text?.[0]?.plain_text || '',
            public: star.Public?.checkbox || false,
        }
    } catch (error) {
        console.error('⚠️ error fetching star from Notion:', error)
        return null
    }
}