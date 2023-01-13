import { app, BrowserWindow, nativeTheme, screen, Tray, Menu, ipcMain } from "electron";
import { initialize, enable } from '@electron/remote/main'
import path from "path";
import os from "os";
import { autoUpdater } from 'electron-updater'
import log from 'electron-log'

// needed in case process is undefined under Linux
const platform = process.platform || os.platform();
export let tray = null;

/**
 *  блокируем попытки запуска другого экземпляра приложения
 */
const singleInstance = app.requestSingleInstanceLock()
if (!singleInstance) app.quit()

try {
  if (platform === "win32" && nativeTheme.shouldUseDarkColors === true) {
    require("fs").unlinkSync(
      path.join(app.getPath("userData"), "DevTools Extensions")
    );
  }
} catch (_) {}

let mainWindow;

function createWindow() {
  const display = screen.getPrimaryDisplay();
  const windowWidth = 600
  const windowheight = 320
  // const windowWidth = 1366  // <- закомментировать на проде
  // const windowheight = 768 // <- закомментировать на проде

  initialize()
  mainWindow = new BrowserWindow({
    icon: path.resolve(__dirname, "icons/icon.png"), // tray icon
    width: windowWidth,
    height: windowheight,
    x: display.workArea.width - windowWidth,
    y: display.workArea.height - windowheight,
    maximizable: false,
    minimizable: false,
    // resizable: false, // <- раскомментировать на проде
    alwaysOnTop: true,
    movable: false,
    frame: false,
    skipTaskbar: true,
    // show: false, // <- раскомментировать на проде
    useContentSize: true,
    webPreferences: {
      // webSecurity: true,
      contextIsolation: true,
      nodeIntegration: false,
      enableRemoteModule: true,
      preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD),
    },
  });
  mainWindow.setAlwaysOnTop(true, 'floating');



// app.commandLine.appendSwitch('disable-site-isolation-trials')



  enable(mainWindow.webContents)

  mainWindow.loadURL(process.env.APP_URL);
  // mainWindow.on("close", (e) => {
  //   e.preventDefault();
  //   mainWindow.hide();
  // });
  mainWindow.webContents.openDevTools(); // <- закомментировать на проде
  if (process.env.DEBUGGING) {
    // if on DEV or Production with debug enabled
    mainWindow.webContents.openDevTools();//////////////
  // } else {
  //   // we're on production; no access to devtools pls
    // mainWindow.webContents.on("devtools-opened", () => {
    //   mainWindow.webContents.closeDevTools();
    // });
  }

  mainWindow.on('minimize', () => {
    mainWindow.hide()
  })
  mainWindow.on('show', () => {
    mainWindow.setAlwaysOnTop(true)
  })

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

function createTray() {
  tray = new Tray(path.resolve(__dirname, "icons/icon.png"));
  const contextMenu = Menu.buildFromTemplate([
    { role: "unhide", label: "Открыть", click: () => mainWindow.show() },
    { type: "separator" },
    { role: "quit", label: "Выход", click: () => app.exit() },
  ]);

  tray.setContextMenu(contextMenu);
  tray.setToolTip('ЕИС: Клиент уведомлений')
  tray.on('click', () => mainWindow.show())

  // tray.setImage(path.resolve(__dirname, "icons/icon_alert.png"))
}
function createAutoupdater() {
  autoUpdater.logger = log;
  autoUpdater.logger.transports.file.level = true;
  autoUpdater.logger.transports.console.level = 'debug'; ///////////////
  autoUpdater.autoInstallOnAppQuit = false
  // autoUpdater.on('checking-for-update', () => log.info('!!! checking for update'))
  autoUpdater.on('update-downloaded', () => autoUpdater.quitAndInstall())
  autoUpdater.checkForUpdates()
}

app.whenReady().then(() => {
  ipcMain.handle('logEvent', (e, a) => {
    let icon
    if (a) icon = path.resolve(__dirname, "icons/icon.png")
    else icon = path.resolve(__dirname, "icons/icon_alert.png")

    tray.setImage(icon)
    // tray.setImage(path.resolve(__dirname, "icons/icon_alert.png"))
  })
  ipcMain.handle('showWindow', (e, a) => {
    if (a) mainWindow.show()
    else mainWindow.hide()
  })

  createWindow();
  createTray()
  // createAutoupdater()

  setInterval(() => {
    autoUpdater.checkForUpdates()
  }, 1000 * 60 * 10) // проверка обновлений каждые 10 минут
});

// app.on("window-all-closed", (e) => e.preventDefault());
app.on("window-all-closed", () => {
  if (platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
