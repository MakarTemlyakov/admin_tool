const { stringToNodeConvertor } = require('../../helpers/stringToNodeConvertor');

const buttonTemplate = ({ className, type, textContent, form, disabled }) => {
  const isDisabled = disabled ? 'disabled' : '';
  const htmlString = `<button type="${type}" class="${className}" form="${form}" ${isDisabled} >${textContent}</button>`;
  const nodeElement = stringToNodeConvertor(htmlString);
  return nodeElement;
};

module.exports = { buttonTemplate };
