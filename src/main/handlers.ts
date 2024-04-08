import { ipcMain } from 'electron'

// import { updaterHandlers } from './updater'
import { dbq } from './db'

// Note: all of these handlers will be the single-source-of-truth for the apis exposed to the renderer process
export const allHandlers = {
  // updater: updaterHandlers,
  db: dbq
}

export const registerHandlers = () => {
  // TODO: listen to namespace instead of individual event types
  ipcMain.setMaxListeners(100)
  for (const [namespace, namespaceHandlers] of Object.entries(allHandlers)) {
    for (const [key, handler] of Object.entries(namespaceHandlers)) {
      const chan = `${namespace}:${key}`
      ipcMain.handle(chan, async (e, ...args) => {
        const start = performance.now()
        try {
          const result =
            namespace === 'db'
              ? await (handler as any)(...args)
              : await (handler as any)(e, ...args)
          console.log(
            '[ipc-api]',
            chan,
            args.filter((arg) => typeof arg !== 'function' && typeof arg !== 'object'),
            '-',
            (performance.now() - start).toFixed(2),
            'ms'
          )
          return result
        } catch (error) {
          console.error('[ipc]', chan, error)
        }
      })
    }
  }
}
