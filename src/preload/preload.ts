import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";
import type { ElectronAPI } from "./electron";

// 暴露安全的API到渲染进程
contextBridge.exposeInMainWorld("electronAPI", {
  // 获取应用版本
  getAppVersion: () => ipcRenderer.invoke("app-version"),

  // 这里可以添加更多的API，例如：
  // 发送消息
  sendMessage: (message: string) => ipcRenderer.send("send-message", message),

  // 接收消息
  onMessageReceived: (callback: (message: any) => void) => {
    const subscription = (_event: IpcRendererEvent, message: any) =>
      callback(message);
    ipcRenderer.on("message-received", subscription);
    return () => {
      ipcRenderer.removeAllListeners("message-received");
    };
  },

  // 用户认证
  login: (credentials: { username: string; password: string }) => {
    return ipcRenderer.invoke("user-login", credentials);
  },
} as ElectronAPI);
