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
const WebTorrent = require('webtorrent-hybrid');
const { ICONS } = require('./icons');
const { checkBoxTemplate } = require('./ui/templates/checkboxTemplate');
const { listItemsTemplate } = require('./ui/templates/listItemsTemplate');
const { buttonTemplate } = require('./ui/templates/buttonTemplate');
const { formTemplate } = require('./ui/templates/formTemplate');
const PortalRepository = require('./repositories/PortalRepository');
const PortalService = require('./services/PortalService');
const portalRepository = new PortalRepository(DOMAINS);
const portalService = new PortalService(portalRepository);
const main = document.querySelector('.main');
const checkedNavRadio = document.querySelector('.menu-item__radio:checked');
const navRadios = document.querySelectorAll('.menu-item__radio');
let prevNavRadio = checkedNavRadio.value;

function isDisabled() {
  const form = document.querySelector('form');
  const btn = document.querySelector('.btn');
  const hasCheckedPortals = DOMAINS.some((portal) => portal.isChecked);
  if (hasCheckedPortals) {
    btn.removeAttribute('disabled');
  } else {
    btn.setAttribute('disabled', true);
  }
}

const portals = DOMAINS.map((domain) => {
  const checkBox = checkBoxTemplate({
    name: domain.name,
    id: domain.id,
    value: domain.id,
    className: 'portal-checkbox',
    label: domain.name,
    checked: domain.isChecked,
  });

  const wrapLabel = checkBox.querySelector('.label-wrap');
  const label = checkBox.querySelector('label');
  wrapLabel.addEventListener('click', (e) => {
    if (wrapLabel.classList.contains('hover') && !checkBox.checked) {
      checkBox.checked = true;
      wrapLabel.classList.add('checked');
      wrapLabel.classList.remove('hover');
      wrapLabel.innerHTML = ICONS.addIcon;
      domain.isChecked = true;
      isDisabled();
    } else {
      checkBox.checked = false;
      wrapLabel.classList.remove('checked');
      wrapLabel.classList.add('hover');
      wrapLabel.innerHTML = ICONS.plusIcon;
      domain.isChecked = false;
      isDisabled();
    }
  });
  label.addEventListener('mouseenter', (e) => {
    if (!checkBox.checked) {
      wrapLabel.classList.add('hover');
      wrapLabel.innerHTML = ICONS.plusIcon;
    }
  });
  wrapLabel.addEventListener('mouseleave', (e) => {
    wrapLabel.classList.remove('hover');
  });
  console.log({ checkBox });
  return checkBox;
});

function initPortalsContent() {
  const form = formTemplate({ id: 'portals' });
  const checkboxList = listItemsTemplate({
    listClassName: 'checkbox-list',
    itemClassName: 'checkbox__item',
    countListItems: DOMAINS.length,
    insertItems: portals,
  });
  const button = buttonTemplate({
    className: 'btn',
    id: 'portals',
    type: 'submit',
    textContent: 'Настроить',
    disabled: true,
    form: 'portals',
  });

  form.appendChild(checkboxList);
  main.append(form);
  main.append(button);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formValues = await portalService.getCheckedPortals();
    await portalService.applySettings(formValues);
    await disableAllActiveXRules();
    await disableIntranetCompatibilityMode();
    await disableIntranetMSCompatibilityMode();
    await allowPopupWindows();
    await disableCheckServerHttp();
    await setupSecurityProtocols();
    alert('Настройка завершена успешно!');
  });

  button.addEventListener('click', () => {
    form.dispatchEvent(new Event('submit')); // Вызываем событие submit на форме
  });
}

function initContentByNav(checkedValue) {
  if (prevNavRadio === checkedValue) {
    return;
  }
  main.innerHTML = '';
  switch (checkedValue) {
    case 'portals':
      initPortalsContent();
      break;
    case 'programms':
      initProgrammsContent();
      break;
    default:
      return null;
  }
  prevNavRadio = checkedValue;
}

document.addEventListener('DOMContentLoaded', () => {
  initPortalsContent();
  navRadios.forEach((navRadio) => {
    navRadio.addEventListener('change', (e) => {
      initContentByNav(e.target.value);
    });
  });

  ipcRenderer.on('progress', (event, progress, message) => getProgressDownlaod(progress, message));
  ipcRenderer.on('load-office', (event, savePath, programm) => downloadTorrent(savePath, programm));
});

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
  const doawnloadBtn = document.querySelector('.doawnload-btn');
  const progressBox = document.querySelector('.progress');
  const progressStatus = progressBox.querySelector('.progress__status');
  const progressBar = progressBox.querySelector('.progress-bar');
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
  const magnetUrl = program.url;
  const programList = document.querySelectorAll('.programs > li');
  const programmNode = programList[program.id];
  const progressBar = programmNode.querySelector('.progress-bar');
  const downloadBtn = programmNode.querySelector('.doawnload-torrent');
  console.log({ downloadBtn });
  const progressStatus = programmNode.querySelector('.progress__status');
  const client = new WebTorrent();
  client.add(magnetUrl, { path: savePath }, (torrent) => {
    const totalBytes = parseInt(torrent.length, 10);
    torrent.on('download', (bytes) => {
      downloadBtn.setAttribute('disabled', true);
      const progress = (torrent.downloaded / totalBytes) * 100;
      progressBar.value = Math.round(progress);
      progressStatus.textContent = `${Math.round(progress)}%`;
    });
    torrent.on('done', () => {
      downloadBtn.removeAttribute('disabled');
      progressStatus.textContent = `Download completed!`;
    });
    torrent.on('ready');
  });
}

function initProgrammsContent() {
  main.innerHTML = `
        <ul class="programs">
            <li class="programs-item">
                <button class="doawnload-btn">Скачать авест</button>
                <div class="progress">
                    <span class="progress__status">Loading:</span>
                    <progress class="progress-bar" value="0" max="100"></progress>
                </div>
            </li>
            <li class="programs-item">
                <button class="doawnload-torrent">Скачать office</button>
                <div class="progress">
                    <span class="progress__status">Loading:</span>
                    <progress class="progress-bar" value="0" max="100"></progress>
                </div>
            </li>
            <li class="programs-item">
                <button class="doawnload-torrent">Скачать Acrobat Reader</button>
                <div class="progress">
                    <span class="progress__status">Loading:</span>
                    <progress class="progress-bar" value="0" max="100"></progress>
                </div>
            </li>
        </ul>`;
  const progressBox = document.querySelector('.progress');
  const progressStatus = progressBox.querySelector('.progress__status');
  const progressBar = progressBox.querySelector('.progress-bar');
  const doawnloadBtn = document.querySelector('.doawnload-btn');
  const doawnloadsButtons = document.querySelectorAll('.doawnload-torrent');
  doawnloadsButtons.forEach((downloadBtn, key) => {
    downloadBtn.addEventListener('click', (e) => {
      ipcRenderer.send('load-office', key);
    });
  });
  doawnloadBtn.addEventListener('click', (e) => {
    ipcRenderer.send('open-new-window');
  });
}
