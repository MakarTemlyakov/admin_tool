const { stringToNodeConvertor } = require('../../helpers/stringToNodeConvertor');

const checkBoxTemplate = ({ id, name, className, label, value, checked }) => {
  const htmlString = `<div class="group-checkbox"><input class="${className}" type="checkbox" id="${id}" value="${value}" name="${name} checked="${checked}">
    <label for="${id}">${label}</label>
    <div class="label-wrap"></div></div>`;
  const node = stringToNodeConvertor(htmlString);

  return node;
};

module.exports = { checkBoxTemplate };
