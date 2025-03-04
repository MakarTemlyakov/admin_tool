const createSvgHelper = ({ width, height, svgContent, svgId }) => {
  const svgNamespace = 'http://www.w3.org/2000/svg';
  const svg = window.document.createElementNS(svgNamespace, 'svg');
  svg.setAttribute('width', 32);
  svg.setAttribute('height', 32);
  svg.setAttribute('id', svgId);
  svg.innerHTML = svgContent;
  return svg;
};

module.exports = { createSvgHelper };
