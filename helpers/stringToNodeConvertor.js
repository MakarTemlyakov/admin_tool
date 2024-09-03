const stringToNodeConvertor = (htmlString, hasParent = true) => {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = htmlString;
  return hasParent ? wrapper.firstChild : wrapper.childNodes;
};

module.exports = { stringToNodeConvertor };
