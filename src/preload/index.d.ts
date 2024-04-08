import { ElectronAPI } from '@electron-toolkit/preload'
import { GlobalWindowApi } from '.'

declare global {
  interface Window {
    electron: ElectronAPI
    api: GlobalWindowApi
  }
}
