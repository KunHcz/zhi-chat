# 知聊 ZhiChat

基于 Electron 的即时通讯桌面应用程序，集成 AI 智能功能

## 功能特点

- 基础即时通讯功能：私聊、群聊、好友管理、消息推送
- AI 智能功能：智能回复、内容推荐、聊天助手、智能翻译
- 多平台支持：Windows、macOS、Linux

## 技术栈

- Electron：跨平台桌面应用框架
- React：用户界面库
- TypeScript：类型安全的 JavaScript 超集
- Tailwind CSS：实用优先的 CSS 框架
- Vite：前端构建工具

## 开发指南

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run electron:dev
```

### 构建应用

```bash
npm run electron:build
```

## 项目结构

```
zhi-chat/
├── dist/                 # 构建输出目录
├── src/
│   ├── assets/           # 静态资源
│   ├── main/             # Electron主进程
│   ├── preload/          # 预加载脚本
│   ├── renderer/         # 渲染进程(React)
│   └── shared/           # 共享代码和类型
├── index.html            # HTML入口文件
├── package.json          # 项目配置
├── tsconfig.json         # TypeScript配置
└── vite.config.ts        # Vite配置
```
