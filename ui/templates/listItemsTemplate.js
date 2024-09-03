const { stringToNodeConvertor } = require('../../helpers/stringToNodeConvertor');

const listItemsTemplate = ({ listClassName, itemClassName, countListItems, insertItems }) => {
  const listItems = `<ul class="${listClassName}"></ul>`;
  const node = stringToNodeConvertor(listItems);
  console.log({ insertItems });
  if (insertItems.length > 0) {
    for (let i = 0; i < insertItems.length; i++) {
      const listItem = document.createElement('li');
      listItem.classList.add(itemClassName);
      listItem.append(insertItems[i]);
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
