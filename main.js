const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const fs = require('fs');
const axios = require('axios');
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: 'preload.js',
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

ipcMain.on('open-new-window', async () => {
  let totalBytes = 0;
  let receivedBytes = 0;
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
  axios({
    method: 'get',
    url: url,
    responseType: 'stream',
  })
    .then((response) => {
      const totalBytes = parseInt(response.headers['content-length'], 10);
      let receivedBytes = 0;
      console.log({ data: response.data });
      response.data.on('data', (chunk) => {
        receivedBytes += chunk.length;
        const progress = (receivedBytes / totalBytes) * 100;
        mainWindow.webContents.send('progress', progress.toFixed(2));
      });

      response.data.pipe(writer);

      writer.on('finish', () => {
        mainWindow.webContents.send('progress', 100, 'File loaded');
      });

      writer.on('error', (err) => {
        console.error('Error writing file:', err);
      });
    })
    .catch((error) => {
      console.error('Error occurred:', error);
    });
});
