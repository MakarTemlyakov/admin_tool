const { stringToNodeConvertor } = require('../../helpers/stringToNodeConvertor');

const checkBoxTemplate = ({ id, name, className, label, value, checked, srcImg }) => {
  const htmlString = `<div class="group-checkbox"><input class="${className}" type="checkbox" id="${id}" value="${value}" name="${name} checked="${checked}">
    <img src="./icons/logoMNS.png" alt="портал" width="64" height="64"></img>
    <label for="${id}">${label}</label>
    <div class="label-wrap"></div></div>`;
  const node = stringToNodeConvertor(htmlString);

  return node;
};

module.exports = { checkBoxTemplate };
