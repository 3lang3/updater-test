import { BetterSQLite3Database, drizzle } from 'drizzle-orm/better-sqlite3'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import Database from 'better-sqlite3'
import path from 'node:path'
import { app } from 'electron'
import { logger } from './logger'

export let db: BetterSQLite3Database

export const sqliteInit = () => {
  const dbPath =
    process.env.NODE_ENV === 'development'
      ? path.join(process.cwd(), `./sqlite.db`)
      : path.join(process.resourcesPath, `./sqlite.db`)

  console.log('DB path is', dbPath)

  db = drizzle(new Database(dbPath))
}

export const sqliteMigrateUpdate = () => {
  try {
    const migrationsFolder = app.isPackaged
      ? path.join(process.resourcesPath, './migrations')
      : path.join(process.cwd(), './src/main/db/migrations')
    migrate(db, { migrationsFolder })
  } catch (error) {
    logger.error('数据库迁移失败', error)
  }
}
