const {app, Menu} = require('electron')
const ipc = require('electron').ipcMain
const WindowManager = require('./WindowManager');

var sharedWndowManager = new WindowManager();

const template = [
    {
    label: 'File',
    submenu: [
      {
          label: 'New',
          accelerator: "CmdOrCtrl+N",
          click (item, focusedWindow) { 
            sharedWndowManager.createWindow();
          }
        },
      {
          label: 'Open',
          //accelerator: "CmdOrCtrl+O",
          click (item, focusedWindow) {
            focusedWindow.webContents.send('action', 'file.open');
          }
        },
      {
          label: 'Save',
          //accelerator: "CmdOrCtrl+S",
          click (item, focusedWindow) { 
            focusedWindow.webContents.send('action', 'file.save');
          }
        },
      {
          label: 'Save As',
          //accelerator: "CmdOrCtrl+Shift+S",
          click (item, focusedWindow) { 
            focusedWindow.webContents.send('action', 'file.save_as');
          }
        },
    ]
  },
  {
    label: 'Edit',
    submenu: [
      {type: 'separator'},
      //{role: 'undo'},
      //{role: 'redo'},
      {type: 'separator'},
      {role: 'cut'},
      {role: 'copy'},
      {role: 'paste'},
      {role: 'delete'},
      {role: 'selectall'}
    ]
  },
  {
    label: 'View',
    submenu: [
      {role: 'reload'},
      {role: 'forcereload'},
      {role: 'toggledevtools'},
      {type: 'separator'},
      {role: 'resetzoom'},
      {role: 'zoomin'},
      {role: 'zoomout'},
      {type: 'separator'},
      {role: 'togglefullscreen'}
    ]
  },
  {
    role: 'window',
    submenu: [
      {role: 'minimize'},
      {role: 'close'}
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'App Website',
        click () { require('electron').shell.openExternal('https://www.philipp-mayr.de/apps/markdown-editor/') }
      }
    ]
  }
]

if (process.platform === 'darwin') {
  template.unshift({
    label: app.getName(),
    submenu: [
      {role: 'about'},
      {
        label: 'opensource projects used',
        click () { require('electron').shell.openExternal('https://www.philipp-mayr.de/apps/markdown-editor/opensource') }
      },
      {type: 'separator'},
      {role: 'services', submenu: []},
      {type: 'separator'},
      {role: 'hide'},
      {role: 'hideothers'},
      {role: 'unhide'},
      {type: 'separator'},
      {role: 'quit'}
    ]
  })

  // Edit menu
  template[2].submenu.push(
    {type: 'separator'},
    {
      label: 'Speech',
      submenu: [
        {role: 'startspeaking'},
        {role: 'stopspeaking'}
      ]
    }
  )

  // Window menu
  template[3].submenu = [
    {role: 'close'},
    {role: 'minimize'},
    {role: 'zoom'},
    {type: 'separator'},
    {role: 'front'}
  ]
}

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)