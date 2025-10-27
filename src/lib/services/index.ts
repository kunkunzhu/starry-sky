import { db, star_index } from '../db';
import { NotionService } from './notion';

export class IndexService {
    private notionService: NotionService;

    constructor() {
        this.notionService = new NotionService();
    }

    // bulk imports existing content from Notion database
    async bootstrapIndex(): Promise<{ indexed: number; errors: string[] }> {

        const stats = {
            indexed: 0,
            errors: [] as string[],
        };

        try {
            console.log('1️⃣. querying all pages in Notion database ...');
            const response = await fetch(
                `https://api.notion.com/v1/databases/${process.env.NOTION_DATABASE_ID}/query`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
                        'Content-Type': 'application/json',
                        'Notion-Version': '2022-06-28',
                    },
                    body: JSON.stringify({}),
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`⚠️ Notion API error (${response.status}): ${errorText}`);
            }

            const data = await response.json();

            if (!data.results) {
                console.error('Notion API response:', JSON.stringify(data, null, 2));
                throw new Error('⚠️ no results in Notion API response');
            }


            console.log(`☑️ found ${data.results.length} stars from Notion !`);

            console.log('2️⃣. processing each star ...');
            for (const star of data.results) {
                try {
                    const starData = await this.notionService.getStarData(star.id)

                    if (!starData) {
                        console.warn(`⚠️ skipping page ${star.id} - could not get info`);
                        continue;
                    }

                    await db.insert(star_index).values({
                        id: starData.id,
                        title: starData.title,
                        message: starData.message,
                        public: starData.public,
                    }).onConflictDoUpdate({
                        target: star_index.id,
                        set: {
                            title: starData.title,
                            message: starData.message,
                            public: starData.public,
                        },
                    });

                    stats.indexed++;
                    console.log(`☑️ indexed: ${starData.title}`);

                } catch (error) {
                    const errorMsg = `⚠️ error indexing page ${star.id}: ${error}`;
                    console.error(errorMsg);
                    stats.errors.push(errorMsg);
                }
            }

            console.log('\n=== bootstrap complete ===');
            console.log(`☑️ successfully indexed: ${stats.indexed} stars`);
            console.log(`⚠️ errors: ${stats.errors.length}`);

            return stats;

        } catch (error) {
            const errorMsg = `⚠️ bootstrap failed: ${error}`;
            console.error(errorMsg);
            stats.errors.push(errorMsg);
            return stats;
        }
    }


    async getStarList() {
        return await db
            .select()
            .from(star_index);
    }
}