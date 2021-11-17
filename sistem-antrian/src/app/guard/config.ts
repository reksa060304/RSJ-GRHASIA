export class Config {
	static get() {
		if (window.location.hostname.indexOf('localhost') > -1 || window.location.hostname.indexOf('127.') > -1) {
			return lokal;
		} else if (window.location.hostname.indexOf('203.210') > -1) {
			return publics;
		} else if (window.location.hostname.indexOf('apps') > -1) {
			return hostinghttps;
		} else {
			return lokalIP;
		}
	}
}
var lokal = {
	apiBackend: "http://localhost:8700/",
	apiNotif: "http://127.0.0.1:8700/",
	socketIO: "http://127.0.0.1:8201",
};
var publics = {
	apiBackend: "http://localhost:8000/",
	apiNotif: "http://127.0.0.1:8000/",
	socketIO: "http://127.0.0.1:8201",
};
var lokalIP = {
	apiBackend: "http://172.20.1.6:8700/",
	apiNotif: "http://172.20.1.6:8700/",
	socketIO: "http://172.20.1.6:8201",
};
var hostinghttps = {
	apiBackend: "https://apps.transmedic.co.id:8000/",
	apiNotif: "https://apps.transmedic.co.id:8000/",
	socketIO: "https://apps.transmedic.co.id:8201",
};