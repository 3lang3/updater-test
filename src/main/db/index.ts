import { db } from './init'
import * as schemas from './schema'

export const dbq = {
  getLogs: async () => {
    return db.select().from(schemas.logs).all()
  },
  insertLog: async (text: string) => {
    return db.insert(schemas.logs).values({ text }).run()
  }
}

export type DBQuery = typeof dbq
