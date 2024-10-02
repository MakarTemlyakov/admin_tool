const WebTorrent = require('webtorrent-hybrid');
const BaseService = require('./BaseService');

class TorrentService extends BaseService {
  constructor(mainWindow) {
    super();
    this.client = new WebTorrent();
    this.mainWindow = mainWindow;
  }

  onLoadData(url, savePath, programm) {
    let progress = 0;
    this.client.add(url, { path: savePath }, (torrent) => {
      const totalBytes = parseInt(torrent.length, 10);
      torrent.on('download', (bytes) => {
        progress = (torrent.downloaded / totalBytes) * 100;
        this.mainWindow.webContents.send('on-download', Math.round(progress), false, programm);
      });
      torrent.on('ready', () => {
        console.log('Torrent files ready to doawnloading...');
      });

      torrent.on('done', () => {
        this.mainWindow.webContents.send('on-download', Math.round(progress), true, programm);
        torrent.destroy();
      });
    });
  }
}

module.exports = TorrentService;
