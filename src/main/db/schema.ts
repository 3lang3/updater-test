import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const logs = sqliteTable('logs', {
  id: integer('id').primaryKey({ autoIncrement: true }).notNull(),
  text: text('text').notNull()
})
export type TableLogRow = typeof logs.$inferSelect
export type InsertTableLogRow = typeof logs.$inferInsert
