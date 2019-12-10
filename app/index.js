const { app, BrowserWindow, ipcMain, Menu, dialog, Tray } = require('electron')
const path = require('path')
const os = require('os')
const renderFile = path.resolve(__dirname, '../view/index.html')
const icon = path.resolve(__dirname, '../icon.ico')
const rt = require('is-root')

let mainWin = null
let tray = null
let isRoot = rt()
const isMac = os.platform() === 'darwin'



const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    if (mainWin) {
      if (mainWin.isMinimized()) mainWin.restore()
      mainWin.show()
      mainWin.focus()
    }
  })
  app.on('ready', createWindow)
}

function createWindow () {
  if (!isRoot) {
    let w = '请使用管理员身份运行'
    let m = '请使用root身份运行\nsudo '+ app.getPath("exe")+' ; exit ;'
    dialog.showErrorBox('错误提示：', isMac ? m : w)
    quit()
    return false
  }
  // 创建浏览器窗口
  mainWin = new BrowserWindow({
    icon,
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  const contextMenu = Menu.buildFromTemplate([
    {
      label: '退出',
      click: () => {
        quit()
      }
    }
  ])
  tray = new Tray(path.join(__dirname, './h.png'))
  tray.on('click', () => {
    mainWin.isVisible() ? mainWin.hide() : mainWin.show()
  })
  tray.on('right-click', () => {
    tray.popUpContextMenu(contextMenu)
  })
  tray.setToolTip('hosts编辑器')
  // tray.setContextMenu(contextMenu)



  if (isMac) {
    app.dock.hide()
  } else {
    mainWin.setSkipTaskbar(true)
  }
  mainWin.on('show', () => {
    tray.setImage(path.join(__dirname, './h.png'))
  })
  mainWin.on('hide', () => {
    tray.setImage(path.join(__dirname, './h1.png'))
  })
  mainWin.on('close', (event) => {
    mainWin.hide()
    event.preventDefault()
  })
  // Menu.setApplicationMenu(null)
  // 加载index.html文件
  mainWin.loadFile(renderFile)
}

function quit() {
  if (tray.isDestroyed()) {
    mainWin.destroy()
    app.quit()
  } else {
    tray.destroy()
    mainWin.destroy()
    app.quit()
  }
}