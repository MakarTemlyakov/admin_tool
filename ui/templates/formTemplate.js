const { stringToNodeConvertor } = require('../../helpers/stringToNodeConvertor');

const formTemplate = ({ id }) => {
  const stringHtml = `<form id="${id}"></form>`;
  const node = stringToNodeConvertor(stringHtml);
  return node;
};

module.exports = { formTemplate };
