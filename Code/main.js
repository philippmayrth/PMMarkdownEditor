/* javascript-obfuscator:disable */
const {app, Menu} = require('electron')
const path = require('path')
const url = require('url')
const WindowManager = require('./WindowManager');

var sharedWindowManager = new WindowManager();

let appIsReady = false;
let openFileAtPathWhenReady = null;

function createStartupWindow() {
  sharedWindowManager.createWindow();
}

app.on('open-file', function(event, path) {
  event.preventDefault();
  console.log(path);

  if (appIsReady) {
    sharedWindowManager.createWindow(path);
  }
  else {
    // app not yet ready
    openFileAtPathWhenReady = path;
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function() {
  appIsReady = true;

  if (openFileAtPathWhenReady == null) {
    // open default startup window
    createStartupWindow();
  }
  else {
    // open a window with the file the user wants to open
    sharedWindowManager.createWindow(openFileAtPathWhenReady);
  }
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  
  /* 
    Temporarily quit the app if no windows are open.
    This is done because the application menu would have to be updated to not show items like File->Save 
    if no window is shown but the app itself has focus (is displayd in the app menu next to the apple icon)
    If this should be changed back to normal be shure to update the app menu in such a case.
  */
  //if (process.platform !== 'darwin') {
    app.quit()
  //}
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (sharedWindowManager.countOpenWindows() == 0) {
    sharedWindowManager.createWindow();
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

const ipc = require('electron').ipcMain
const dialog = require('electron').dialog

var fileDialogFilters = [
    { name: 'Markdown', extensions: ['md', 'markdown', 'mdown', 'mkdn', 'mkd', 'mdwn', 'mkd', 'pmmd', 'txt', 'text'] },
  ];

ipc.on('open-file-dialog', function (event) {
  dialog.showOpenDialog({
    filters: fileDialogFilters,
    properties: ['openFile']
  }, function (files) {
    if (files) event.sender.send('selected-directory', files)
  })
})

ipc.on('save-dialog', function (event) {
  const options = {
    defaultPath: "Unnamed.md",
    filters: fileDialogFilters
  }
  dialog.showSaveDialog(options, function (filename) {
    event.sender.send('saved-file', filename)
  })
})

ipc.on('action.file.open.inNewWindow', function(event, message) {
  var path = message;
  sharedWindowManager.createWindow(path);
});

ipc.on('close-window-with-confirm', function(event, message) {
  var widnowId = message;
  console.log("The editor in the window with id: "+widnowId+" would like the user to CONFIRM before its closed");
  sharedWindowManager.closeWindowWithIdAndAskUserToConfirm(widnowId);
});

ipc.on('close-window-without-confirm', function(event, message) {
  var widnowId = message;
  console.log("The editor in the window with id: "+widnowId+" asked the window to close");
  sharedWindowManager.closeWindowWithId(widnowId);
});
