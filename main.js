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
const { PROGRAMM } = require('./constants');
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
  if (id === 0) {
    const { savePath, programm, url } = await showOpenDialog(id);
    const httpService = new HttpService(mainWindow);
    httpService.onLoadData(url, savePath, programm);
  } else {
    const { savePath, programm, url } = showOpenDialogSync(id);
    const torrentService = new TorrentService(mainWindow);
    torrentService.onLoadData(url, savePath, programm);
  }
});

async function showOpenDialog(id) {
  const programm = getProgrammById(id);
  const data = dialog.showOpenDialog({ properties: ['openDirectory'] });
  const filePath = (await data).filePaths[0];
  const url = 'https://nces.by/wp-content/uploads/gossuok/AvPKISetup(bel).zip';
  const localFileName = 'AvPKISetup(bel).zip';
  const outputPath = `${filePath}\\${localFileName}`;
  const writer = fs.createWriteStream(outputPath);
  if (data.canceled) {
    console.log('Directory selection was canceled');
    return;
  }
  return { programm: programm, savePath: writer, url: url };
}

function showOpenDialogSync(id) {
  const programm = getProgrammById(+id);
  const pathFiles = dialog.showOpenDialogSync({
    properties: ['createDirectory', 'openDirectory'],
    buttonLabel: 'Save Files',
  });
  if (pathFiles && pathFiles.length > 0) {
    return { programm: programm, savePath: pathFiles[0], url: programm.url };
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
