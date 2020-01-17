/**
 * Send to server.
 * @method send
 * @param  {string} url
 * @param  {*} data
 * @param  {*} method
 * @param  {*} headers
 * @param  {*} async
 * @return {Promise}
 */
const send = (url, data, method, headers = {}, async = true) => new Promise((resolve, reject) => {
	let xhr = new XMLHttpRequest();

	xhr.open(method, url, async);
	xhr.onload = r => {

		try {

			let data = JSON.parse(r.target.responseText);
			data.statusCode = r.target.status;

			resolve(data)

		} catch (e) {
			// eslint-disable-next-line
			console.error('Parse response bad', e);
			reject(e);
		}

	};

	xhr.onerror = reject;

	const header = {
		'Content-Type' : 'application/json',
		...headers
	};

	for (const [name, value] of Object.entries(header)) {
		xhr.setRequestHeader(name, value);
	}

	if (process.env.NODE_ENV === 'development') {
		// eslint-disable-next-line
		console.log(method, url + ' send ', data);
	}

	xhr.send(data);
});


export {send};
