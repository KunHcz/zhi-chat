const { spawn } = require("child_process");
const http = require("http");

async function checkServer(url, retries = 30, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      await new Promise((resolve, reject) => {
        const req = http.get(url, (res) => {
          resolve(res);
        });
        req.on("error", reject);
        req.setTimeout(2000, () => req.destroy());
      });
      return true;
    } catch (error) {
      if (i === retries - 1) throw error;
      console.log(`等待服务器启动... (${i + 1}/${retries})`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  return false;
}

async function startElectron() {
  try {
    console.log("等待 Vite 开发服务器启动...");
    await checkServer("http://localhost:5173");

    console.log("Vite 服务器已就绪，启动 Electron 应用...");

    const electronProcess = spawn("npx", ["electron", "."], {
      stdio: "inherit",
      env: {
        ...process.env,
        NODE_ENV: "development",
      },
      shell: true,
    });

    electronProcess.on("error", (error) => {
      console.error("Electron 启动错误:", error);
    });

    electronProcess.on("close", (code) => {
      console.log(`Electron 进程退出，代码: ${code}`);
      process.exit(code);
    });
  } catch (error) {
    console.error("启动 Electron 失败:", error);
    console.log("尝试直接启动 Electron...");

    // 备用方案：直接启动 Electron
    setTimeout(() => {
      const electronProcess = spawn("npx", ["electron", "."], {
        stdio: "inherit",
        env: {
          ...process.env,
          NODE_ENV: "development",
        },
        shell: true,
      });

      electronProcess.on("close", (code) => {
        process.exit(code);
      });
    }, 3000);
  }
}

startElectron();
