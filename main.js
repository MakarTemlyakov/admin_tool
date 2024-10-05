const {
  app,
  BrowserWindow,
  dialog,
  getCurrentWindow,
  ipcMain,
  Menu,
  MenuItem,
} = require('electron');
const fs = require('fs');
const axios = require('axios');
const { PROGRAMM, DownloadType } = require('./constants');
const HttpService = require('./services/HttpService');
const TorrentService = require('./services/TorrentService');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile('index.html');
  mainWindow.webContents.openDevTools();

  return mainWindow;
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on('on-download', async (e, id) => {
  let savePath = '';
  const programm = getProgrammById(id);
  const doawnloadService = getServiceDownloadByType(programm.type);
  if (programm.id === 0) {
    savePath = await showOpenDialog();
  } else {
    savePath = showOpenDialogSync();
  }
  doawnloadService.onLoadData(savePath, programm);
});

async function showOpenDialog() {
  const data = dialog.showOpenDialog({ properties: ['openDirectory'] });
  const filePath = (await data).filePaths[0];
  const localFileName = 'AvPKISetup(bel).zip';
  const outputPath = `${filePath}\\${localFileName}`;
  const path = fs.createWriteStream(outputPath);
  if (data.canceled) {
    console.log('Directory selection was canceled');
    return;
  }
  return path;
}

function showOpenDialogSync() {
  const pathFiles = dialog.showOpenDialogSync({
    properties: ['createDirectory', 'openDirectory'],
    buttonLabel: 'Save Files',
  });
  if (pathFiles && pathFiles.length > 0) {
    return pathFiles[0];
  }
  return;
}

function getProgrammById(id) {
  switch (id) {
    case 0:
      return PROGRAMM.avest;
    case 1:
      return PROGRAMM.office;
    case 2:
      return PROGRAMM.acrobat;
    default:
      return null;
  }
}

function getServiceDownloadByType(programmType) {
  switch (programmType) {
    case DownloadType.TORRENT:
      return new TorrentService(mainWindow);
    case DownloadType.HTTP:
      return new HttpService(mainWindow);
    default:
      return;
  }
}
