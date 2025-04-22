import { useEffect, useState } from "react";
import type { ElectronAPI } from "../preload/electron";

// 扩展Window接口，确保TypeScript能识别electronAPI
declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

function App() {
  const [appVersion, setAppVersion] = useState<string>("");

  useEffect(() => {
    // 使用预加载脚本中的API获取应用版本
    window.electronAPI.getAppVersion().then((version: string) => {
      setAppVersion(version);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* 顶部导航栏 */}
      <header className="bg-primary-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold">知聊 ZhiChat</h1>
          <div className="text-sm">v{appVersion}</div>
        </div>
      </header>

      {/* 主内容区域 */}
      <main className="flex-1 flex">
        {/* 侧边栏 */}
        <aside className="w-64 bg-white shadow-md">
          <nav className="p-4">
            <h2 className="text-lg font-medium mb-4">聊天列表</h2>
            <ul className="space-y-2">
              <li className="p-2 rounded hover:bg-gray-100 cursor-pointer">
                AI助手
              </li>
              <li className="p-2 rounded hover:bg-gray-100 cursor-pointer">
                张三
              </li>
              <li className="p-2 rounded hover:bg-gray-100 cursor-pointer">
                研发群
              </li>
            </ul>
          </nav>
        </aside>

        {/* 聊天区域 */}
        <section className="flex-1 flex flex-col bg-white border-l">
          {/* 聊天头部 */}
          <div className="border-b p-4">
            <h2 className="font-medium">AI助手</h2>
          </div>

          {/* 消息区域 */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="mr-2 flex-shrink-0 w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white">
                  AI
                </div>
                <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                  <p>您好！我是AI助手，有什么可以帮助您的吗？</p>
                </div>
              </div>
            </div>
          </div>

          {/* 消息输入区域 */}
          <div className="border-t p-4">
            <div className="flex items-center">
              <input
                type="text"
                className="flex-1 border rounded-lg p-2"
                placeholder="输入消息..."
              />
              <button className="ml-2 bg-primary-500 text-white rounded-lg px-4 py-2">
                发送
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
