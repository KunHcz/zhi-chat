import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "path";

// 防止出现多个实例
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  let mainWindow: BrowserWindow | null = null;

  function createWindow() {
    // 创建浏览器窗口
    mainWindow = new BrowserWindow({
      width: 1280,
      height: 768,
      minWidth: 800,
      minHeight: 600,
      webPreferences: {
        preload: path.join(__dirname, "../preload/preload.js"),
        contextIsolation: true,
        nodeIntegration: false,
      },
    });

    // 加载应用
    if (process.env.NODE_ENV === "development") {
      // 开发环境下加载本地服务器
      console.log("Running in development mode");
      mainWindow.loadURL("http://localhost:5173");
      // 打开开发工具
      mainWindow.webContents.openDevTools();
    } else {
      // 生产环境下加载打包后的静态文件
      console.log("Running in production mode");
      const indexPath = path.join(__dirname, "../../renderer/index.html");
      console.log("Loading index from:", indexPath);
      mainWindow.loadFile(indexPath).catch((err) => {
        console.error("Failed to load index file:", err);
      });
    }

    // 当窗口关闭时触发
    mainWindow.on("closed", () => {
      mainWindow = null;
    });
  }

  // 当 Electron 初始化完成后创建窗口
  app.whenReady().then(() => {
    createWindow();

    app.on("activate", function () {
      // 在macOS上，当dock图标被点击且没有其他窗口打开时，
      // 通常在应用程序中重新创建一个窗口。
      if (mainWindow === null) createWindow();
    });
  });

  // 当所有窗口都被关闭时退出
  app.on("window-all-closed", () => {
    // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
    // 否则绝大部分应用及其菜单栏会保持激活。
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  // 处理第二个实例启动
  app.on("second-instance", () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  // 在这里处理主进程与渲染进程的通信
  ipcMain.handle("app-version", () => {
    return app.getVersion();
  });
}
