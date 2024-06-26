import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { autoUpdater } from 'electron-updater'
import logger from 'electron-log'
import { sqliteInit, sqliteMigrateUpdate } from './db/init'
import { registerHandlers } from './handlers'

let mainWindow: BrowserWindow

// autoUpdater.forceDevUpdateConfig = true
autoUpdater.autoDownload = true
autoUpdater.autoInstallOnAppQuit = false
autoUpdater.autoRunAppAfterInstall = true

function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      devTools: is.dev
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

let canInstall = false

app
  .whenReady()
  .then(sqliteInit)
  .then(sqliteMigrateUpdate)
  .then(registerHandlers)
  .then(() => {
    function sendStatusToWindow(text) {
      logger.info(text)
      mainWindow.webContents.send('message', text)
    }

    autoUpdater.on('checking-for-update', () => {
      sendStatusToWindow('Checking for update...')
    })
    autoUpdater.on('update-available', (info) => {
      console.log('🚀 ~ autoUpdater.on ~ info:', info)
      sendStatusToWindow(`Update available.${JSON.stringify(info)}`)
    })
    autoUpdater.on('update-not-available', () => {
      sendStatusToWindow('Update not available, 2 minutes later check again.')
      setTimeout(() => autoUpdater.checkForUpdatesAndNotify(), 2 * 60 * 1000)
    })
    autoUpdater.on('error', (err) => {
      sendStatusToWindow('Error in auto-updater. ' + err)
    })
    autoUpdater.on('download-progress', (progressObj) => {
      let log_message = 'Download speed: ' + progressObj.bytesPerSecond
      log_message = log_message + ' - Downloaded ' + progressObj.percent + '%'
      log_message = log_message + ' (' + progressObj.transferred + '/' + progressObj.total + ')'
      sendStatusToWindow(log_message)
    })
    autoUpdater.on('update-downloaded', () => {
      sendStatusToWindow('Update downloaded')
      canInstall = true
    })

    // Set app user model id for windows
    electronApp.setAppUserModelId('com.electron')

    // Default open or close DevTools by F12 in development
    // and ignore CommandOrControl + R in production.
    // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
    app.on('browser-window-created', (_, window) => {
      optimizer.watchWindowShortcuts(window)
    })

    // IPC test
    ipcMain.on('ping', () => sendStatusToWindow(app.getVersion()))
    ipcMain.on('install-update', () => {
      if (canInstall) {
        dialog
          .showMessageBox({
            type: 'info',
            title: 'Install Update',
            message: 'A new version of the app is available. Do you want to install it now?',
            buttons: ['Yes', 'No']
          })
          .then((result) => {
            if (result.response === 0) {
              autoUpdater.quitAndInstall()
            }
          })
      } else {
        sendStatusToWindow('Update not downloaded, please wait...')
      }
    })

    createWindow()

    app.on('activate', function () {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })

app.on('ready', () => {
  autoUpdater.checkForUpdatesAndNotify()
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
