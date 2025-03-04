const { stringToNodeConvertor } = require('../../helpers/stringToNodeConvertor');

const progressBarTemplate = () => {
  const htmlString = `<div class="progress">
        <span class="progress__status">Loading:</span>
        <progress class="progress-bar" value="0" max="100"></progress>
  </div>`;
  const nodeElement = stringToNodeConvertor(htmlString);
  return nodeElement;
};

module.exports = { progressBarTemplate };
