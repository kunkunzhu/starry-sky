import { Client } from '@notionhq/client';
import { StarData } from '../types/misc';
import { NotionPage } from '../types/notion';

const notion = new Client({
    auth: process.env.NOTION_API_KEY,
});

export class NotionService {

    async getStarData(starId: string): Promise<StarData | null> {
        try {
            const response = await notion.pages.retrieve({ page_id: starId });
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
}