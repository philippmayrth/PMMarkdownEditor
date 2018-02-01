const ipc = require('electron').ipcRenderer;
const {remote, dialog} = require('electron');
const fs = require("fs");

var currentWindowIdentifier = null; // the window id of the widnow this renderer is shown in
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

        case "file.save_as":
            appmenu_file_save_as();
            break;

        case "app-window-about-to-close":
            handle_window_about_to_close();
            break;

        case "user-confirmed-save-before-close":
            handle_user_confirmed_save_before_close();
            break;

        default:
            break;
    }
});

ipc.on('apply_window_id_for_ipc', function(event, message) {
    console.log("apply_window_id_for_ipc: "+message);
    currentWindowIdentifier = message;
});

function send_to_main_close_window_with_confirm() {
    ipc.send("close-window-with-confirm", currentWindowIdentifier);
}

function send_to_main_close_window_without_confirm() {
    ipc.send("close-window-without-confirm", currentWindowIdentifier);
}

function handle_window_about_to_close() {
    if (should_show_close_confirmation()) { // check if there is stuff to save
        send_to_main_close_window_with_confirm();
    }
    else {
        send_to_main_close_window_without_confirm();
    }
}

function handle_user_confirmed_save_before_close() {
    var success = appmenu_file_save();

    if (success) { // check for success - user might have canceled the saving dialog which wuld result in a 'failure' namely the file not beeing saved
        send_to_main_close_window_without_confirm();
    }
}

function should_show_close_confirmation() {
    if (editor.getMarkdown().toString().trim().length === 0) {
        // nothing to save - close window
        return false;
    }
    return true;
}

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
    return true; // for now jsut always return success
}

function appmenu_file_save_as() {
    ipc.send('save-dialog')

    ipc.on('saved-file', function (event, path) {
        if (path) {
            return appmenu_helper_save_file_at(`${path}`)
        }
        else {
            // user canceled the saving dialog
            return false;
        }
    })
}

function appmenu_file_save() {
    if (!currentOpenFilePathString) {
        return appmenu_file_save_as();
    }
    else {
        return appmenu_helper_save_file_at(currentOpenFilePathString);
    }
}
