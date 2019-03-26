const {BrowserWindow, dialog} = require('electron');
const path = require('path')
const url = require('url')

function WindowManager() {
    // Return the existing object if it has been created already
    if (typeof WindowManager._instance === 'object') {
        console.log("WM: Old instance reused");
        return WindowManager._instance;
    }
    console.log("WM: New instance will be created");

    // Keep a global reference of the window object, if you don't, the window will
    // be closed automatically when the JavaScript object is garbage collected.
    this.windows = {};

    WindowManager._instance = this;
    return this;
}

WindowManager.prototype.createWindow = function(openFileAtPath=null) {
    // Create the browser window.
    var win = new BrowserWindow({width: 800, height: 600})
        
    // Retain window for garbage collector
    var currentWindowIdentifier = ""+Math.random();
    this.windows[currentWindowIdentifier] = win;
    
    //console.log("my object: %o", this.windows);
    
    // and load the index.html of the app.
    win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
    }))
    
    // Open the DevTools.
    //win.webContents.openDevTools()
 
    win.on('close', (event) => {
        event.preventDefault();
        win.webContents.send("action", "app-window-about-to-close");
    });
     
    // Emitted when the window is closed.
    win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    delete this.windows[currentWindowIdentifier];
    //console.log("my object: %o", this.windows);
    })
        
    win.webContents.on('did-finish-load', function() {
    win.webContents.send('apply_window_id_for_ipc', currentWindowIdentifier);
    if (openFileAtPath) {
        win.webContents.send('open_file_at_path', openFileAtPath);
    }
    });
    
    require('./mainmenu') // create main menu
}


WindowManager.prototype.countOpenWindows = function() {
    return Object.keys(this.windows).length;
}

WindowManager.prototype.closeWindowWithId = function(windowId) {
    this.windows[windowId].destroy(); // Note: win.close() does not work that would throw an exception (there is a bug issue on github)
}

WindowManager.prototype.closeWindowWithIdAndAskUserToConfirm = function(windowId) {
    var win = this.windows[windowId];
    var _this = this;

    var options = {
        type: 'warning',
        title: 'Save file', // not shown on macOS
        message: "Do you want to save this file?",
        detail: "Your changes to the file will be lost if you don't save them.",
        //defaultId: 2,
        buttons: ['Save', 'Cancel', 'Delete']
    };

    var callback = function(choice) {
        var buttonSAVE = 0;
        var buttonCANCEL = 1;
        var buttonDELETE = 2;
       
        switch (choice) {
            case buttonDELETE:
                _this.closeWindowWithId(windowId);
                break;

            case buttonSAVE:
                win.webContents.send("action", "user-confirmed-save-before-close");
                break;

            default:
                // defaulting to cancel
                break;
        }
    }
    dialog.showMessageBox(win, options, callback);
}

module.exports = WindowManager;
