const { stringToNodeConvertor } = require('../../helpers/stringToNodeConvertor');

const checkBoxTemplate = ({ id, name, className, label, value, checked, srcImg }) => {
  const htmlString = `<div class="group-checkbox">
  <input class="${className}" type="checkbox" id="${id}" value="${value}" name="${name} checked="${checked}">
    <label class="checkBox_label" for="${id}">
     <img src="${srcImg}" alt="портал" width="64" height="64"></img>
      <span class="label__text">${label}</span>
    </label>
  <div class="label-wrap"></div></div>`;
  const node = stringToNodeConvertor(htmlString);
  return node;
};

module.exports = { checkBoxTemplate };
