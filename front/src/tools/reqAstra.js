const post = "POST";
// eslint-disable-next-line
const get  = "GET";
const typeMessage = 1;
// eslint-disable-next-line
const typeData = 2;

class Back {
	constructor({code, data, type}) {
		this._data = data;
		this._code = code;
		this._type = type || 0;
	}

	get data () {
		return this._data
	}

	get code () {
		return this._code
	}

	get isMessage () {
		return this._type === typeMessage
	}

	get isOk () {
		return this._code >= 200 && this._code < 300
	}

	get errorMessage () {
		return `Bad response code ${this.code}, message ${this.isMessage ? this._data : JSON.stringify(this._data)}`
	}
}

/**
 * Send to server.
 * @method send
 * @param  {string} url
 * @param  {*} data
 * @param  {*} method
 * @return {Promise<{Back}>}
 */
const send = (url, data = {}, method = post) => new Promise((resolve, reject) => {
	if (!window.astilectron) {
		console.log('You try send', url, data, method);
		return reject(new Error('This not astilectron'));
	}

	window.astilectron.sendMessage({url, data, method}, (data) => {
		const back = new Back(data);

		if (back.isOk) {
			return resolve(back);
		}

		reject(new Error(back.errorMessage));
	});
});


export {
	send
};
