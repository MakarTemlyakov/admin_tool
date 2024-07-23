const { REG_DOMAINS, DOMAINS, ACTIVE_X_OPTIONS, TRUSTED_SITES_ZONE } = require('./constants');
const regedit = require('regedit').promisified;

const btn = document.querySelector('.btn');
const portalsForm = document.querySelector('#portals');
const portalsFieldset = portalsForm.querySelector('.portal-list');

portalsForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const formValues = getFormPortalValues();
  const checkedDomains = DOMAINS.filter((domaind) => formValues.includes(domaind.id));

  checkedDomains.forEach((checkedPortal) => {
    checkedPortal.domains.forEach((portalDomain) => {
      const nameDomain = portalDomain.domain;
      onCreateEntity(nameDomain, ...portalDomain.values);
    });
  });
  disableAllActiveXRules();
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
      const regValue = {
        [trustedSitesKey]: {
          [activeValue]: { value: 0, type: 'REG_DWORD' },
        },
      };
      await regedit.putValue(regValue);
    }
  } catch (error) {
    console.error('Error settins into regestier', error);
  }
}
