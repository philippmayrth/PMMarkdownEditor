const {BrowserWindow} = require('electron');
const path = require('path')
const url = require('url')

function WindowManager() {
    // Return the existing object if if it has been created already
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
    var winId = ""+Math.random();
    this.windows[winId] = win;
    
    //console.log("my object: %o", this.windows);
    
    // and load the index.html of the app.
    win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
    }))
    
    // Open the DevTools.
    win.webContents.openDevTools()
    
    // Emitted when the window is closed.
    win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    delete this.windows[winId];
    //console.log("my object: %o", this.windows);
    })
        
    win.webContents.on('did-finish-load', function() {
    if (openFileAtPath) {
        win.webContents.send('open_file_at_path', openFileAtPath);
    }
    });
    
    require('./mainmenu') // create main menu
}

WindowManager.prototype.countOpenWindows = function() {
    return Object.keys(this.windows).length;
}

module.exports = WindowManager;
