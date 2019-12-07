const { app, BrowserWindow, ipcMain, Menu } = require('electron')
const { Registry } = require('rage-edit')
const path = require('path')
const renderFile = path.resolve(__dirname, '../view/index.html')
const suspendFile = path.resolve(__dirname, '../view/suspend.html')
const icon = path.resolve(__dirname, '../icon.ico')
var mainWin = null
var renderWin = null
Registry.set(
  'HKCU\\Software\\Microsoft\\Windows NT\\CurrentVersion\\AppCompatFlags\\Layers', //固定，管理员权限应用列表
  'app_change_hosts',
  app.getPath('exe'), //应用路径
  'RUNASADMIN', //固定写死
)
Registry.set(
  'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run',   //注册表开机启动应用路径
  'app_change_hosts', //随意写
  app.getPath('exe'), //当前应用路径，也是自动启动的应用路径
  'REG_SZ', // 固定的 
)

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    if (mainWin) {
      if (mainWin.isMinimized()) mainWin.restore()
      mainWin.focus()
      createRenderWindow()
    }
  })
  app.on('ready', createWindow)
}

function createWindow () {
  // 创建浏览器窗口
  mainWin = new BrowserWindow({
    width: 130,
    height: 36,
    frame: false,
    transparent: true,
    resizable: false,
    minimizable: false,
    maximizable: false,
    closable: false,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true
    }
  })
  mainWin.setSkipTaskbar(true)
  // 加载index.html文件
  mainWin.loadFile(suspendFile)
}


function createRenderWindow () {
  if (renderWin) {
    renderWin.show()
    return false
  } else {
    renderWin = new BrowserWindow({
      icon,
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true
      }
    })
    renderWin.setSkipTaskbar(true)
    // Menu.setApplicationMenu(null)
    // 加载index.html文件
    renderWin.loadFile(renderFile)
    renderWin.on('close', (event) => { 
      renderWin.hide()
      event.preventDefault()
    })
  }
  
}
ipcMain.on('add', ()=>{
  createRenderWindow()
})