/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
const config = {
  appId: "com.zhichat.app",
  productName: "ZhiChat",
  copyright: "Copyright © 2023",
  asar: true,
  directories: {
    output: "build",
    buildResources: "resources",
  },
  files: ["dist/**/*"],
  win: {
    target: [
      {
        target: "nsis",
        arch: ["x64"],
      },
    ],
    artifactName: "${productName}-Windows-${version}-Setup.${ext}",
  },
  mac: {
    target: ["dmg"],
    artifactName: "${productName}-Mac-${version}.${ext}",
  },
  linux: {
    target: ["AppImage"],
    artifactName: "${productName}-Linux-${version}.${ext}",
  },
  nsis: {
    oneClick: false,
    perMachine: false,
    allowToChangeInstallationDirectory: true,
    deleteAppDataOnUninstall: true,
  },
};

module.exports = config;
