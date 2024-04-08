import { shell } from 'electron'
import log from 'electron-log'

log.initialize()

export const logger = log.scope('main')

export function getLogFilePath() {
  return log.transports.file.getFile().path
}

export async function revealLogFile() {
  const filePath = getLogFilePath()
  return await shell.openPath(filePath)
}
