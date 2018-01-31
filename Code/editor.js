const ipc = require('electron').ipcRenderer;
const {remote, dialog} = require('electron');
const fs = require("fs");

var currentOpenFilePathString = false;


// initialise the markdown editor
var editor = new tui.Editor({
    el: document.querySelector('#editSection'),
    initialEditType: 'wysiwyg',
    previewStyle: 'vertical',
    height: '100%'
});

ipc.on('open_file_at_path', function(event, message) {
    var pathString = message;
    console.log("Opening file from path: "+pathString);
    console.log("my object: %o", pathString);
    helper_file_open(pathString)
});

ipc.on('action', function(event, message) {
    console.log("UI incomming IPC: "+message);

    switch(message) {
        case "file.open":
            appmenu_file_open();
            break;
        
        case "file.save":
            appmenu_file_save();
            break;

        case "file.open.save_as":
            appmenu_file_save_as();
            break;

        default:
            break;
    }
});

ipc.on('window', function(event, message) {
    alert("window will be closed");
});

function helper_file_open(pathString) {
    currentOpenFilePathString = pathString;
    var data = fs.readFileSync(pathString);
    editor.setMarkdown(data.toString());
}

function appmenu_file_open() {
    ipc.send('open-file-dialog')

    ipc.on('selected-directory', function (event, path) {
        helper_file_open(`${path}`)
    })
}

function appmenu_helper_save_file_at(pathString) {
    console.log('Saving file at: '+pathString);
    currentOpenFilePathString = pathString;
    var data = editor.getMarkdown();
    fs.writeFileSync(pathString, data);
}

function appmenu_file_save_as() {
    ipc.send('save-dialog')

    ipc.on('saved-file', function (event, path) {
        if (path) {
            appmenu_helper_save_file_at(`${path}`)
        }
    })
}

function appmenu_file_save() {
    if (!currentOpenFilePathString) {
        appmenu_file_save_as();
    }
    else {
        appmenu_helper_save_file_at(currentOpenFilePathString);
    }
}

window.onbeforeunload = function(event) {
    event.preventDefault();

    if (editor.getMarkdown().toString().trim().length === 0) {
        // nothing to save - close window
        return undefined;
    }

    var options = {
        type: 'question',
        title: 'Save file', // not shown on macOS
        message: "Do you want to save this file?",
        detail: "Your changes to the file will be lost if you don't save them.",
        buttons: ['Yes', 'No']
    };

    var choice = remote.dialog.showMessageBox(remote.getCurrentWindow(), options);

    if (choice === 1) {
        return undefined; // return undefined to close the window return anything else to keep open
    }
    else {
        appmenu_file_save();
        return true; // return true to keep window open
    }
}
