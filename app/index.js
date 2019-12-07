const { app, BrowserWindow, ipcMain, Menu } = require('electron')
const path = require('path')
const renderFile = path.resolve(__dirname, '../view/index.html')
const suspendFile = path.resolve(__dirname, '../view/suspend.html')
const icon = path.resolve(__dirname, '../icon.ico')
var mainWin = null
var renderWin = null
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
    Menu.setApplicationMenu(null)
    // 加载index.html文件
    renderWin.loadFile(renderFile)
    renderWin.on('close', (event) => { 
      renderWin.hide()
      event.preventDefault()
    })
  }
  
}

app.on('ready', createWindow)
ipcMain.on('add', ()=>{
  createRenderWindow()
})