const {
  REG_DOMAINS,
  DOMAINS,
  ACTIVE_X_OPTIONS,
  TRUSTED_SITES_ZONE,
  REG_IE_START_PAGE,
  REG_IE_POPUP_BLOCKER,
  REG_IE_INTRANET_COMPATIBILITY,
  REG_MSCOMPATIBILITY,
} = require('./constants');
const regedit = require('regedit').promisified;
const path = require('path');
const os = require('os');
const fs = require('fs');
const { electron, BrowserWindow, ipcRenderer } = require('electron');

const btn = document.querySelector('.btn');
const portalsForm = document.querySelector('#portals');
const portalsFieldset = portalsForm.querySelector('.portal-list');
const doawnloadBtn = document.querySelector('.doawnload-btn');

portalsForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const formValues = getFormPortalValues();
  const checkedDomains = DOMAINS.filter((domaind) => formValues.includes(domaind.id));

  checkedDomains.forEach((checkedPortal) => {
    checkedPortal.domains.forEach((portalDomain) => {
      const nameDomain = portalDomain.domain;
      onCreateEntity(nameDomain, ...portalDomain.values);
      addToFavorites(checkedPortal.name, checkedPortal.url);
    });
  });
  allowPopupWindows();
  disableAllActiveXRules();
  disableIntranetCompatibilityMode();
  disableIntranetMSCompatibilityMode();
});

doawnloadBtn.addEventListener('click', (e) => {
  ipcRenderer.send('open-new-window');
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

async function addSiteToStartPage(nameSite, siteUrl) {
  const ieMainKey = await regedit.list(REG_IE_START_PAGE);
  const sites1 = ieMainKey[REG_IE_START_PAGE].values['Start Page'];
  const ieStartPageKey = REG_IE_START_PAGE;
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
    [REG_IE_INTRANET_COMPATIBILITY]: {
      [msCompatibilityModeValue]: { value: 0, type: 'REG_DWORD' },
    },
  };

  await regedit.putValue(value);
}
