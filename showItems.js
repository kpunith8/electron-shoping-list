const electron = require('electron');
const { ipcRenderer } = electron;

const ul = document.querySelector('#item-list');

ipcRenderer.on('item:add', function (event, payload) {
  ul.className = 'collection';

  const li = document.createElement('li');
  li.className = 'collection-item';
  const itemText = document.createTextNode(payload);
  li.appendChild(itemText);
  ul.appendChild(li);
});

ipcRenderer.on('item:clear', function () {
  ul.innerHTML = '';
  ul.className = '';
});

// Remove item on doube click
ul.addEventListener('dblclick', removeItem);

function removeItem(event) {
  event.target.remove();

  if (ul.children.length === 0) {
    ul.className = '';
  }
}