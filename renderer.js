const {
  REG_DOMAINS,
  DOMAINS,
  ACTIVE_X_OPTIONS,
  TRUSTED_SITES_ZONE,
  REG_IE_START_PAGE,
  REG_IE_POPUP_BLOCKER,
  REG_IE_INTRANET_COMPATIBILITY,
  REG_IE_MSCOMPATIBILITY,
  REG_SECURE_PROTOCOLS,
  TORRENT_URL_OFFICE,
  PROGRAMM,
  AVEST_URL,
} = require('./constants');
const { ipcRenderer } = require('electron');
const regedit = require('regedit').promisified;
const path = require('path');
const os = require('os');
const fs = require('fs');

const WebTorrent = require('webtorrent');

const btn = document.querySelector('.btn');
const portalsForm = document.querySelector('#portals');
const portalsFieldset = portalsForm.querySelector('.portal-list');
const doawnloadBtn = document.querySelector('.doawnload-btn');
const doawnloadOffice = document.querySelector('.doawnload-office');
const progressBox = document.querySelector('.progress');
const progressStatus = progressBox.querySelector('.progress__status');
const progressBar = progressBox.querySelector('.progress-bar');

portalsForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formValues = getFormPortalValues();

  const checkedDomains = DOMAINS.filter((domaind) => formValues.includes(domaind.id));
  for (checkedPortal of checkedDomains) {
    await addSiteToStartPage(checkedPortal.url);
    for (portalDomain of checkedPortal.domains) {
      const nameDomain = portalDomain.domain;
      await onCreateEntity(nameDomain, ...portalDomain.values);
      await addToFavorites(checkedPortal.name, checkedPortal.url);
    }
  }

  await disableAllActiveXRules();
  await disableIntranetCompatibilityMode();
  await disableIntranetMSCompatibilityMode();
  await allowPopupWindows();
  await disableCheckServerHttp();
  await setupSecurityProtocols();
});

document.addEventListener('DOMContentLoaded', () => {
  doawnloadBtn.addEventListener('click', (e) => {
    ipcRenderer.send('open-new-window');
  });
  doawnloadOffice.addEventListener('click', (e) => {
    ipcRenderer.send('load-office');
  });
  ipcRenderer.on('progress', (event, progress, message) => getProgressDownlaod(progress, message));
  ipcRenderer.on('load-office', (event, savePath) => downloadTorrent(savePath, PROGRAMM.office));
});

const getFormPortalValues = () => {
  let formValues = [];
  const checkBoxValues = portalsFieldset.querySelectorAll('input[type=checkbox]:checked');
  checkBoxValues.forEach((checkBoxVal) => {
    formValues = [...formValues, checkBoxVal.value];
  });
  return formValues.map(Number);
};

const portals = DOMAINS.map((domain) => {
  const checkBox = document.createElement('input');
  const label = document.createElement('label');
  const groupBox = document.createElement('div');
  checkBox.setAttribute('type', 'checkbox');
  checkBox.name = domain.name;
  checkBox.id = domain.name;
  checkBox.value = domain.id;
  label.setAttribute('for', checkBox.name);
  label.textContent = domain.name;
  groupBox.append(label, checkBox);
  return groupBox;
});

portalsFieldset.append(...portals);

async function onCreateEntity(name, ...values) {
  try {
    const keys = [`${REG_DOMAINS}\\${name}`];
    const subkeys = values.length > 0 ? values.map((key) => `${REG_DOMAINS}\\${name}\\${key}`) : [];
    const regKeys = subkeys.length > 0 ? [...keys, ...subkeys] : keys;
    const regInsertedKeys = subkeys.length > 0 ? subkeys : keys;
    await regedit.createKey([...regKeys]);

    for (insertedKey of regInsertedKeys) {
      const val = { [insertedKey]: { '*': { value: 2, type: 'REG_DWORD' } } };
      await regedit.putValue(val);
    }
    console.log('Operation finished successfull');
  } catch (error) {
    console.error('Error settins into regestier', error);
  }
}

async function disableAllActiveXRules() {
  try {
    const trustedSitesKey = TRUSTED_SITES_ZONE;
    const activeValues = Object.keys(ACTIVE_X_OPTIONS);
    for (activeValue of activeValues) {
      let value = activeValue === '2702' || activeValue === '120B' ? 3 : 0;
      const regValue = {
        [trustedSitesKey]: {
          [activeValue]: { value: value, type: 'REG_DWORD' },
        },
      };
      await regedit.putValue(regValue);
    }
  } catch (error) {
    console.error('Error settins into regestier', error);
  }
}

async function addSiteToStartPage(siteUrl) {
  try {
    const ieMainKey = await regedit.list(REG_IE_START_PAGE);
    const keyValue = `Secondary Start Pages`;
    const sites1 = ieMainKey[REG_IE_START_PAGE].values['Secondary Start Pages'];
    const value = {
      [REG_IE_START_PAGE]: {
        [keyValue]: { value: [...sites1.value, siteUrl], type: 'REG_MULTI_SZ' },
      },
    };

    await regedit.putValue(value);
  } catch (err) {
    console.log('error', err);
  }
  console.log('sited add to start page succsessfull');
}

async function addToFavorites(nameSite, siteUrl) {
  const favoritesPath = path.join(os.homedir(), 'Favorites', `${nameSite}.url`);
  const favoritesBarPath = path.join(os.homedir(), 'Favorites', 'Links', `${nameSite}.url`);
  try {
    const urlFileContent = `[InternetShortcut]\r\nURL=${siteUrl}\r\nIconFile=https://www.google.com/favicon.ico\r\nIconIndex=0\r\n`;
    fs.writeFileSync(favoritesPath, urlFileContent);
    fs.writeFileSync(favoritesBarPath, urlFileContent);
    console.log('site success addedd');
  } catch (err) {
    console.error('err', err);
  }
}

async function allowPopupWindows() {
  const popBlockerValue = 'PopupMgr';
  const value = {
    [REG_IE_POPUP_BLOCKER]: {
      [popBlockerValue]: { value: 0, type: 'REG_DWORD' },
    },
  };
  await regedit.putValue(value);
}

async function disableIntranetCompatibilityMode() {
  const compatibilityModeValue = 'IntranetCompatibilityMode';
  const value = {
    [REG_IE_INTRANET_COMPATIBILITY]: {
      [compatibilityModeValue]: { value: 0, type: 'REG_DWORD' },
    },
  };

  await regedit.putValue(value);
}

async function disableIntranetMSCompatibilityMode() {
  const msCompatibilityModeValue = 'MSCompatibilityMode';
  const value = {
    [REG_IE_MSCOMPATIBILITY]: {
      [msCompatibilityModeValue]: { value: 0, type: 'REG_DWORD' },
    },
  };

  await regedit.putValue(value);
}

async function disableCheckServerHttp() {
  try {
    const REG_VALUE_FLAGS = 'Flags';
    const value = {
      [TRUSTED_SITES_ZONE]: {
        [REG_VALUE_FLAGS]: {
          value: 67,
          type: 'REG_DWORD',
        },
      },
    };
    await regedit.putValue(value);
    console.log('disabled https check success');
  } catch (error) {
    console.log('http flags doesnt disable', error);
  }
}

async function setupSecurityProtocols() {
  try {
    const SECURE_PROTOCOLS_VALUE = 'SecureProtocols';
    const value = {
      [REG_SECURE_PROTOCOLS]: {
        [SECURE_PROTOCOLS_VALUE]: {
          value: 9864,
          type: 'REG_DWORD',
        },
      },
    };
    await regedit.putValue(value);
    console.log('security protocols setup successfull');
  } catch (err) {
    console.error('securyity protocols isnt setup');
  }
}

function getProgressDownlaod(progress, message) {
  doawnloadBtn.setAttribute('disabled', true);
  if (message) {
    doawnloadBtn.removeAttribute('disabled');
    progressStatus.innerHTML = message;
  } else {
    progressStatus.innerHTML = `Loading: ${progress}%`;
  }
  progressBar.value = progress;
}

function downloadTorrent(savePath, program) {
  const programmNode = programList[program.id];
  const progressBar = programmNode.querySelector('.progress-bar');
  const progressStatus = programmNode.querySelector('.progress__status');
  const magnetUrl = program.url;

  const client = new WebTorrent();
  client.add(magnetUrl, { path: savePath }, (torrent) => {
    const totalBytes = parseInt(torrent.length, 10);
    torrent.on('download', (bytes) => {
      const progress = (torrent.downloaded / totalBytes) * 100;
      officeProgressBar.value = Math.round(progress);
      officeProgressStatus.textContent = `${Math.round(progress)}%`;
    });
    torrent.on('done', () => {
      officeProgressStatus.textContent = `Download completed!`;
    });
  });
  client.console.log({ WebTorrent: savePath });
}
