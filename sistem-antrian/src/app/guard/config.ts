export class Config {
	static get() {
		if (window.location.hostname.indexOf('localhost') > -1 || window.location.hostname.indexOf('127.') > -1) {
			return lokal;
		} else if (window.location.hostname.indexOf('103.166.210.122') > -1) {
			return publics;
		} else if (window.location.hostname.indexOf('apps') > -1) {
			return hostinghttps;
		} else if (window.location.hostname.indexOf('10.20.30') > -1) {
			return lokalIP;
		} else {
			return lokalUing;
		}
	}
	static getProfile() {
		return {
			namaProfile: "RSJ Grhasia",
			logo: '',
		};
	}
}
var lokal = {
  
	apiBackend: "http://localhost:3433/",
	apiNotif: "http://127.0.0.1:3433/",
	socketIO: "http://127.0.0.1:2226",
};
var publics = {
	apiBackend: "http://103.166.210.122/",
	apiNotif: "http://103.166.210.122/",
	socketIO: "http://103.166.210.122",
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
var lokalUing = {
	apiBackend: "/",
	apiNotif: "/",
	socketIO: "",
};
