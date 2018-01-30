const ipc = require('electron').ipcRenderer
const fs = require("fs");

var currentOpenFilePath = false;


// initialise the markdown editor
var editor = new tui.Editor({
    el: document.querySelector('#editSection'),
    initialEditType: 'wysiwyg',
    previewStyle: 'vertical',
    height: '100%'
});

require('electron').ipcRenderer.on('open_file_at_path', function(event, message) {
    var pathString = message;
    console.log("Opening file from path: "+pathString);
    console.log("my object: %o", pathString);
    helper_file_open(pathString)
});

require('electron').ipcRenderer.on('appmenu', function(event, message) {
    console.log("UI incomming IPC: "+message);

    switch(message) {
        case "appmenu.file.new.click":
            alert("User clicked new in the app menu");
            break;

        case "appmenu.file.open.click":
            appmenu_file_open();
            break;
        
        case "appmenu.file.open.save":
            appmenu_file_save();
            break;

        case "appmenu.file.open.save_as":
            appmenu_file_save_as();
            break;

        default:
            break;
    }
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

