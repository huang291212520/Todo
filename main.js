const { app, Tray, BrowserWindow, Menu, nativeImage } = require('electron')
const path = require('path')
let tray
let win
const gotTheLock = app.requestSingleInstanceLock()

const createWindow = async () => {
    const { default: Store } = await import('electron-store')
    const store = new Store()
    const windowBounds = store.get('windowBounds') || { width: 800, height: 600, x: 100, y: 100 }

    win = new BrowserWindow({
        width: windowBounds.width,
        height: windowBounds.height,
        resizable: true,
        // autoHideMenuBar: true,
        // show: false, // 隐藏窗口
        frame: false,
        transparent: true,
        x: windowBounds.x,
        y: windowBounds.y,
        minWidth: 300,
        minHeight: 200,
        webPreferences: {
            enableRemoteModule: true,
            preload: path.join(__dirname, 'preload.js')
        }
    })
    // win.loadURL('http://localhost:8080')
    win.loadFile(path.join(__dirname, './dist/index.html'))

    // 监听窗口移动和调整大小事件
    win.on('move', () => {
        const bounds = win.getBounds()
        store.set('windowBounds', bounds)
    })

    win.on('resize', () => {
        const bounds = win.getBounds()
        store.set('windowBounds', bounds)
    })

    win.on('close', (event) => {
        win.hide()
        win.setSkipTaskbar(true)
        event.preventDefault()
    })

    // 设置开机自启
    app.setLoginItemSettings({
        openAtLogin: true
    })
}

function createTray() {
    const iconPath = nativeImage.createFromPath(path.join(path.dirname(app.getPath('exe')), './resources/app.ico'))
    tray = new Tray(iconPath)

    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Show App',
            click: () => {
                !win.isVisible() && win.show()
            }
        },
        {
            label: 'Quit',
            click: () => {
                app.quit()
            }
        }
    ])

    tray.setToolTip('TODO')
    tray.setContextMenu(contextMenu)

    tray.on('click', () => {
        !win.isVisible() && win.show()
    })
}

if (!gotTheLock) {
    app.quit()
} else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        // 当运行第二个实例时，这里会触发，你可以通知用户或者聚焦窗口
        // 例如，主窗口是 win
        if (win) {
            if (win.isMinimized()) win.restore()
            win.focus()
        }
    })
    app.whenReady().then(() => {
        createTray()
        createWindow()
        app.on('activate', () => {
            if (BrowserWindow.getAllWindows().length === 0) createWindow()
        })
    })

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') app.quit()
    })

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        } else {
            win.show()
        }
    })
}
