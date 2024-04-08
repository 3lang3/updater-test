import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { TableLogRow } from '../main/db/schema'

// Custom APIs for renderer
const api = {
  dbq: {
    getLogs: async () => {
      return ipcRenderer.invoke('db:getLogs') as Promise<TableLogRow[]>
    },
    insertLog: async (text: string) => {
      return ipcRenderer.invoke('db:insertLog', text) as Promise<void>
    }
  }
}

export type GlobalWindowApi = typeof api

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
