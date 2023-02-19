const {app,BrowserWindow} = require('electron');
 
const remote = require('@electron/remote/main')
const path = require('path');
const url = require('url');
const config = require('./config/browser-window-option.json')
remote.initialize()
 
function createWindow() {
    const startUrl = process.env.ELECTRON_START_URL || url.format({
        pathname: path.join(__dirname, 'build','/index.html'),
        protocol: 'file:',
        slashes: true,
    });
    

    const win = new BrowserWindow(config.Kiosk)
    win.loadURL(startUrl)
    remote.enable(win.webContents);
}
 
app.on('ready', createWindow)
 
app.on('window-all-closed', function() {
    if(process.platform !== 'darwin') {
        app.quit()
    }
})
 
app.on('activate', function() {
    if(BrowserWindow.getAllWindows().length === 0) createWindow()
})