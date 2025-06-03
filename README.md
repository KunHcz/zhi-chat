# 知聊 ZhiChat

基于 Electron 的 AI 智能对话桌面应用程序，集成 Google Gemini AI 功能。

## 功能特点

- 🤖 AI 智能对话：基于 Google Gemini API 的智能聊天助手
- 💬 对话管理：会话历史记录和管理
- 🖥️ 桌面应用：跨平台桌面客户端
- 🎨 现代界面：基于 Tailwind CSS 的美观 UI
- ⚡ 高性能：使用 Vite 构建的快速应用

## 技术栈

- **前端框架**: Electron + React + TypeScript
- **UI 样式**: Tailwind CSS
- **构建工具**: Vite
- **后端服务**: FastAPI + SQLite
- **AI 服务**: Google Gemini API

## 快速开始

### 1. 前端应用

```bash
# 安装依赖
npm install

# 开发模式
npm run electron:dev

# 构建应用
npm run electron:build
```

### 2. 后端服务

```bash
# 进入后端目录
cd zhi-chat-backend

# 安装Python依赖
pip install -r requirements.txt

# 配置环境变量（创建.env文件）
GEMINI_API_KEY=your_gemini_api_key_here
DATABASE_URL=sqlite:///./zhichat.db
PORT=8000
HOST=0.0.0.0

# 启动后端服务
python start.py
# 或者
python main.py
```

## 项目结构

```
zhi-chat/
├── src/
│   ├── main/             # Electron主进程
│   ├── preload/          # 预加载脚本
│   └── renderer/         # React渲染进程
├── zhi-chat-backend/     # 后端API服务
│   ├── main.py           # FastAPI应用
│   ├── ai_service.py     # AI服务封装
│   ├── models.py         # 数据库模型
│   └── start.py          # 启动脚本
├── package.json          # 前端依赖配置
└── README.md             # 项目说明
```

## 开发说明

### API 配置

前端默认连接本地 API 服务 `http://localhost:8000`，如需修改请编辑：

```typescript
// src/renderer/App.tsx
const API_BASE_URL = "http://localhost:8000";
```

### 后端 API

- **对话接口**: `POST /chat`
- **API 文档**: http://localhost:8000/docs
- **健康检查**: http://localhost:8000/health

## 注意事项

1. **API 密钥**: 需要配置有效的 Google Gemini API 密钥
2. **端口占用**: 确保 8000 端口未被其他服务占用
3. **网络连接**: 确保网络可以访问 Google API 服务

## 许可证

MIT License
