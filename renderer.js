const { REG_DOMAINS, DOMAINS } = require('./constants');
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

async function onLoad() {
  try {
    const domains = await regedit.list(REG_DOMAINS);
    // onCreateEntity('test1', 'prota', 'proto1', 'rter');
    console.log('Operation finished successfull');
  } catch (error) {
    console.error('Error settins into regestier', error);
  }
}

async function onCreateEntity(name, ...values) {
  const keys = [`${REG_DOMAINS}\\${name}`];
  const subkeys = values.length > 0 ? values.map((key) => `${REG_DOMAINS}\\${name}\\${key}`) : [];
  const regKeys = subkeys.length > 0 ? [...keys, ...subkeys] : keys;
  await regedit.createKey([...regKeys]);

  if (subkeys.length > 0) {
    for (key of subkeys) {
      const val = { [key]: { '*': { value: 2, type: 'REG_DWORD' } } };
      await regedit.putValue(val);
    }
  } else {
    const val = { [keys[0]]: { '*': { value: 2, type: 'REG_DWORD' } } };
    await regedit.putValue(val);
  }
}

btn.addEventListener('click', onLoad);
