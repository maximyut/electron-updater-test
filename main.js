const { app, BrowserWindow, ipcMain } = require("electron/main");
const path = require("node:path");
const { autoUpdater } = require("electron-updater");
const log = require("electron-log");
log.initialize();

autoUpdater.logger = log;

autoUpdater.logger.transports.file.level = "info";

log.warn("App starting...");
let win;
const createWindow = () => {
	win = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
			nodeIntegration: true,
		},
	});

	win.loadFile("index.html");
};

function sendStatusToWindow(text) {
	log.info(text);
	ipcMain.handle("message", () => text);
}

app.whenReady().then(() => {
	createWindow();
	ipcMain.handle("ping", () => app.getVersion());

	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow();
		}
	});
	sendStatusToWindow("ok");
});
app.on("ready", function () {
	autoUpdater.checkForUpdatesAndNotify();
});

autoUpdater.on("checking-for-update", () => {
	sendStatusToWindow("Checking for update...");
});
autoUpdater.on("update-available", (info) => {
	sendStatusToWindow("Update available.");
});
autoUpdater.on("update-not-available", (info) => {
	sendStatusToWindow("Update not available.");
});
autoUpdater.on("error", (err) => {
	sendStatusToWindow("Error in auto-updater. " + err);
});
autoUpdater.on("download-progress", (progressObj) => {
	let log_message = "Download speed: " + progressObj.bytesPerSecond;
	log_message = log_message + " - Downloaded " + progressObj.percent + "%";
	log_message = log_message + " (" + progressObj.transferred + "/" + progressObj.total + ")";
	sendStatusToWindow(log_message);
});
autoUpdater.on("update-downloaded", (info) => {
	sendStatusToWindow("Update downloaded");
	autoUpdater.quitAndInstall();
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});
