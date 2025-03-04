const { createSvgHelper } = require('../../helpers/createSvgHelper');

const navigationTemplate = ({ items }) => {
  const nav = document.createElement('nav');
  const navMenuList = document.createElement('ul');
  console.log({ items });
  nav.classList.add('navigation');
  navMenuList.classList.add('nav-menu');

  for (let i = 0; i < items.length; i++) {
    const itemInput = document.createElement('input');
    const label = document.createElement('label');
    const img = document.createElement('img');
    const span = document.createElement('span');
    const navMenuListItem = document.createElement('li');
    const svgIcon = createSvgHelper({
      width: 32,
      height: 32,
      svgContent: items[i].svg,
      svgId: items[i].id,
    });

    navMenuListItem.classList.add('menu-item');
    itemInput.type = 'radio';
    itemInput.classList.add('menu-item__radio');
    itemInput.id = items[i].id;
    itemInput.name = items[i].id;
    itemInput.value = items[i].id;
    itemInput.checked = items[i].isChecked;
    label.setAttribute('for', items[i].id);
    span.textContent = items[i].label;
    label.append(span);
    label.prepend(svgIcon);
    label.classList.add('nav__portal-label');
    navMenuListItem.append(itemInput, label);
    navMenuList.append(navMenuListItem);
  }

  nav.append(navMenuList);
  return nav;
};

module.exports = { navigationTemplate };
