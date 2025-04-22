const fs = require("fs");
const path = require("path");

// 创建目标目录
const preloadDir = path.join(__dirname, "dist", "preload");
if (!fs.existsSync(preloadDir)) {
  fs.mkdirSync(preloadDir, { recursive: true });
}

// 复制预加载脚本
const sourcePath = path.join(__dirname, "dist", "preload", "preload.js");
const targetPath = path.join(preloadDir, "preload.js");

// 检查源文件是否存在
if (fs.existsSync(sourcePath)) {
  fs.copyFileSync(sourcePath, targetPath);
  console.log(`Copied preload script to ${targetPath}`);
} else {
  console.warn(
    `Source file ${sourcePath} does not exist. Skipping copy operation.`
  );
}
