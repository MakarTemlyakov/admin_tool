const axios = require('axios');
const BaseService = require('./BaseService');

class HttpService extends BaseService {
  constructor(mainWindow) {
    super();
    this.mainWindow = mainWindow;
  }
  onLoadData(savePath, programm) {
    let progress = 0;
    axios({
      method: 'get',
      url: programm.url,
      responseType: 'stream',
    })
      .then((response) => {
        const totalBytes = parseInt(response.headers['content-length'], 10);
        let receivedBytes = 0;
        response.data.on('data', (chunk) => {
          receivedBytes += chunk.length;
          progress = (receivedBytes / totalBytes) * 100;
          this.mainWindow.webContents.send('on-download', Math.round(progress), false, programm);
        });

        response.data.pipe(savePath);

        savePath.on('finish', () => {
          this.mainWindow.webContents.send('on-download', Math.round(progress), true, programm);
        });

        savePath.on('error', (err) => {
          console.error('Error writing file:', err);
        });
      })
      .catch((error) => {
        console.error('Error occurred:', error);
      });
  }
}

module.exports = HttpService;
