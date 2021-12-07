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
	apiBackend: "http://localhost:8600/",
	apiNotif: "http://127.0.0.1:8600/",
	socketIO: "http://127.0.0.1:8881",
};
var publics = {
	apiBackend: "http://localhost:8000/",
	apiNotif: "http://127.0.0.1:8000/",
	socketIO: "http://127.0.0.1:8201",
};
var lokalIP = {
	apiBackend: "/",
	apiNotif: "/",
	socketIO: "",
};
var hostinghttps = {
	apiBackend: "https://apps.transmedic.co.id:8880/",
	apiNotif: "https://apps.transmedic.co.id:8880/",
	socketIO: "https://apps.transmedic.co.id:4444",
};