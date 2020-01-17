
const showSaveDialog = (opt = {}) => new Promise((ok, bad) => {
	if (!window.astilectron) {
		return bad(new Error('Astilectron not found'));
	}
	window.astilectron.showSaveDialog(opt, filename => ok(filename))
});

const showOpenDialog = (opt = {}) => new Promise((ok, bad) => {
	if (!window.astilectron) {
		return bad(new Error('Astilectron not found'));
	}
	window.astilectron.showOpenDialog(opt, paths => ok(paths))
});


export {
	showSaveDialog,
	showOpenDialog
}
