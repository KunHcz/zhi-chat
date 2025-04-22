export interface ElectronAPI {
  getAppVersion: () => Promise<string>;
  sendMessage: (message: string) => void;
  onMessageReceived: (callback: (message: any) => void) => () => void;
  login: (credentials: { username: string; password: string }) => Promise<any>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
