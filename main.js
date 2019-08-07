const electron = require('electron');
const url = require('url');
const path = require('path');

const { app, BrowserWindow, Menu, ipcMain } = electron;

// Set ENV to production to not to ship developer tools
process.env.NODE_ENV = 'production';

let mainWindow;
let addWindow;

app.on('ready', function () {
  // Create a new window
  mainWindow = new BrowserWindow({});

  // Load html into the window
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'mainWindow.html'),
    protocol: 'file:',
    slashes: true // it creates the url like file://dirname/<file_name>
  }));

  // Quit app when closed, all the windows in the app
  mainWindow.on('closed', function () {
    app.quit();
  });

  // Build menu from template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

  Menu.setApplicationMenu(mainMenu);
});

// Create add window
const createAddWindow = function () {
  // Create a add window
  addWindow = new BrowserWindow({
    width: 400,
    height: 300,
    title: 'Add Shoping List item'
  });

  // Load html into the window
  addWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'addWindow.html'),
    protocol: 'file:',
    slashes: true // it creates the url like file://dirname/<file_name>
  }));

  // Garbage collection handle
  addWindow.on('close', function () {
    addWindow = null;
  });
}

// Get the value from the addWindow
ipcMain.on('item:add', function (event, payload) {
  mainWindow.webContents.send('item:add', payload);
  addWindow.close();
});

// Create a menu template
let mainMenuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Add Item',
        accelerator: process.platform == 'darwin' ? 'Command+L' : 'Ctrl+L', // Short cuts
        click() {
          createAddWindow();
        }
      },
      {
        label: 'Clear Items',
        click() {
          mainWindow.webContents.send('item:clear');
        }
      },
      {
        label: 'Quit',
        accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q', // Short cuts
        click() {
          app.quit();
        }
      },
    ]
  }
];

// If on mac, add empty object to menu, otherwise it shows electron instead of File menu in the app
if (process.platform == 'darwin') {
  mainMenuTemplate.unshift({});
}

// Add developer tools while developing for debugging purpose, remove this in prduction.
if (process.env.NODE_ENV !== 'production') {
  mainMenuTemplate = [
    ...mainMenuTemplate,
    {
      label: 'Developer Tools',
      submenu: [
        {
          label: 'Toggle DevTools',
          accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
          click(item, focusedWindow) {
            focusedWindow.toggleDevTools();
          }
        },
        {
          role: 'reload'
        }
      ]
    }
  ]
}

// Use electron packager to publish the app
