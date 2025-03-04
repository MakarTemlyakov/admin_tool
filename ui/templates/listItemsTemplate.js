const { stringToNodeConvertor } = require('../../helpers/stringToNodeConvertor');

const listItemsTemplate = ({
  listClassName,
  itemClassName,
  countListItems,
  removeParentNode,
  insertItems,
}) => {
  const listItems = `<ul class="${listClassName}"></ul>`;
  const node = stringToNodeConvertor(listItems);
  if (insertItems.length > 0) {
    for (let i = 0; i < insertItems.length; i++) {
      const listItem = document.createElement('li');
      listItem.classList.add(itemClassName);
      if (removeParentNode) {
        const childrenNodes = insertItems[i].children;
        listItem.append(...childrenNodes);
      } else {
        listItem.append(insertItems[i]);
      }
      node.appendChild(listItem);
    }
  } else {
    for (let i = 0; i <= countListItems; i++) {
      const listItem = document.createElement('li');
      listItem.classList.add(itemClassName);
      node.appendChild(listItem);
    }
  }

  return node;
};

module.exports = { listItemsTemplate };
