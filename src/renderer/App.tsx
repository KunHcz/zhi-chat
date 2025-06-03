import { useEffect, useState } from "react";
import type { ElectronAPI } from "../preload/electron";

// 扩展Window接口，确保TypeScript能识别electronAPI
declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

interface ChatResponse {
  ai_response: string;
  session_id: string;
}

function App() {
  const [appVersion, setAppVersion] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "您好！我是AI助手，有什么可以帮助您的吗？",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");

  // 后端API地址
  const API_BASE_URL = "http://localhost:8000";

  useEffect(() => {
    // 使用预加载脚本中的API获取应用版本
    window.electronAPI.getAppVersion().then((version: string) => {
      setAppVersion(version);
    });

    // 生成会话ID
    setSessionId(crypto.randomUUID());
  }, []);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      content: inputMessage,
      role: "user",
      timestamp: new Date(),
    };

    // 添加用户消息到聊天记录
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // 调用后端API
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputMessage,
          session_id: sessionId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ChatResponse = await response.json();

      // 添加AI回复到聊天记录
      const aiMessage: Message = {
        id: crypto.randomUUID(),
        content: data.ai_response,
        role: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);

      // 更新session_id（如果后端返回了新的）
      if (data.session_id && data.session_id !== sessionId) {
        setSessionId(data.session_id);
      }
    } catch (error) {
      console.error("发送消息失败:", error);

      // 添加错误消息
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        content: "抱歉，消息发送失败。请检查网络连接或稍后重试。",
        role: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* 顶部导航栏 */}
      <header className="bg-blue-600 text-white shadow-md">
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
              <li className="p-2 rounded bg-blue-50 border-l-4 border-blue-500 cursor-pointer">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="font-medium">AI助手</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">在线</div>
              </li>
              <li className="p-2 rounded hover:bg-gray-100 cursor-pointer opacity-50">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                  <span>群聊功能</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">即将推出</div>
              </li>
            </ul>
          </nav>
        </aside>

        {/* 聊天区域 */}
        <section className="flex-1 flex flex-col bg-white border-l">
          {/* 聊天头部 */}
          <div className="border-b p-4 bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-medium">AI助手</h2>
                <p className="text-sm text-gray-500">
                  基于 Google Gemini 的智能对话助手
                </p>
              </div>
              <div className="text-xs text-gray-500">
                会话ID: {sessionId.slice(0, 8)}...
              </div>
            </div>
          </div>

          {/* 消息区域 */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            <div className="space-y-4 max-w-4xl mx-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex items-start max-w-[80%] ${
                      message.role === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                        message.role === "user"
                          ? "bg-blue-500 ml-2"
                          : "bg-green-500 mr-2"
                      }`}
                    >
                      {message.role === "user" ? "我" : "AI"}
                    </div>
                    <div
                      className={`rounded-lg p-3 ${
                        message.role === "user"
                          ? "bg-blue-500 text-white"
                          : "bg-white border shadow-sm"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      <div
                        className={`text-xs mt-2 ${
                          message.role === "user"
                            ? "text-blue-100"
                            : "text-gray-500"
                        }`}
                      >
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* 加载中提示 */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-medium mr-2">
                      AI
                    </div>
                    <div className="bg-white border shadow-sm rounded-lg p-3">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                        <span className="text-gray-500 text-sm ml-2">
                          AI正在思考...
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 消息输入区域 */}
          <div className="border-t p-4 bg-white">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-end space-x-2">
                <div className="flex-1">
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full border rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="输入消息... (Enter发送，Shift+Enter换行)"
                    rows={1}
                    disabled={isLoading}
                  />
                </div>
                <button
                  onClick={sendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  className="bg-blue-500 text-white rounded-lg px-6 py-3 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? "发送中..." : "发送"}
                </button>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                连接状态: <span className="text-green-600">已连接到服务器</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
