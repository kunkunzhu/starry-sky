import { pgTable, text, boolean } from 'drizzle-orm/pg-core';

export const star_index = pgTable('star_index', {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    message: text('status').notNull(),
    public: boolean('is_active').default(true),
});

export type PostIndex = typeof star_index.$inferSelect;
export type NewPostIndex = typeof star_index.$inferInsert;