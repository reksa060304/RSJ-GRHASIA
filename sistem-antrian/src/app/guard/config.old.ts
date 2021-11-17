export class Config {
	static get() {
		if (window.location.hostname.indexOf('.143') > -1){
			if (window.location.protocol == 'https:') {
				return v143Secure
			} else {
				return v143;
			}
		} else if (window.location.hostname.indexOf('localhost') > -1 || window.location.hostname.indexOf('127.') > -1){
			
			return lokal;
		} else if (window.location.hostname.indexOf('.33') > -1) {
			return v33;
		} else if (window.location.hostname.indexOf('.22') > -1) {
			return v22;
		} else if (window.location.hostname.indexOf('.1.177') > -1) {
			return v1010;
		} else if (window.location.hostname.indexOf('0.177') > -1) {
			return v177;
		} else if (window.location.hostname.indexOf('.165') > -1) {
			return v165;
		} else {
			return cloud;
		}
	}

	static getKdProfile(){
        if (window.location.hostname.indexOf('.bottis.id') > -1){
            let str = window.location.hostname;
            var kdProfile = str.replace("sime-dev-backoffice-", "");
            kdProfile = kdProfile.replace("sime-backoffice-", "");
            kdProfile = kdProfile.replace(".bottis.id", "");
            return kdProfile;
        } 
        return 4;
    }
}
var v143 = {
	apiBackend: "http://192.168.0.143:8001/",
	page:0,
	rows:10,
	en: {
		firstDayOfWeek: 0,
		dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
		dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
		dayNamesMin: ["Su","Mo","Tu","We","Th","Fr","Sa"],
		monthNames: [ "January","February","March","April","May","June","July","August","September","October","November","December" ],
		monthNamesShort: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ],
		today: 'Today',
		clear: 'Clear',
		dateFormat: 'mm/dd/yy'
	},
	id: {
		firstDayOfWeek: 1,
		dayNames: ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"],
		dayNamesShort: ["Ming", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"],
		dayNamesMin: ["Mi","Se","Sa","Ra","Ka","Ju","Su"],
		monthNames: [ "Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember" ],
		monthNamesShort: [ "Jan", "Feb", "Mar", "Apr", "Mei", "Jun","Jul", "Agu", "Sep", "Okt", "Nov", "Des" ],
		today: 'Hari ini',
		clear: 'Kosongkan',
		dateFormat: 'dd/mm/yy'
	}
};
var v143Secure = {
	apiBackend: "https://192.168.0.143:8000/",
	page:0,
	rows:10,
	en: {
		firstDayOfWeek: 0,
		dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
		dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
		dayNamesMin: ["Su","Mo","Tu","We","Th","Fr","Sa"],
		monthNames: [ "January","February","March","April","May","June","July","August","September","October","November","December" ],
		monthNamesShort: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ],
		today: 'Today',
		clear: 'Clear',
		dateFormat: 'mm/dd/yy'
	},
	id: {
		firstDayOfWeek: 1,
		dayNames: ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"],
		dayNamesShort: ["Ming", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"],
		dayNamesMin: ["Mi","Se","Sa","Ra","Ka","Ju","Su"],
		monthNames: [ "Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember" ],
		monthNamesShort: [ "Jan", "Feb", "Mar", "Apr", "Mei", "Jun","Jul", "Agu", "Sep", "Okt", "Nov", "Des" ],
		today: 'Hari ini',
		clear: 'Kosongkan',
		dateFormat: 'dd/mm/yy'
	}
};
var v33 = {
	apiBackend: "http://192.168.0.33:8000/",
	page:0,
	rows:10,
	en: {
		firstDayOfWeek: 0,
		dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
		dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
		dayNamesMin: ["Su","Mo","Tu","We","Th","Fr","Sa"],
		monthNames: [ "January","February","March","April","May","June","July","August","September","October","November","December" ],
		monthNamesShort: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ],
		today: 'Today',
		clear: 'Clear',
		dateFormat: 'mm/dd/yy'
	},
	id: {
		firstDayOfWeek: 1,
		dayNames: ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"],
		dayNamesShort: ["Ming", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"],
		dayNamesMin: ["Mi","Se","Sa","Ra","Ka","Ju","Su"],
		monthNames: [ "Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember" ],
		monthNamesShort: [ "Jan", "Feb", "Mar", "Apr", "Mei", "Jun","Jul", "Agu", "Sep", "Okt", "Nov", "Des" ],
		today: 'Hari ini',
		clear: 'Kosongkan',
		dateFormat: 'dd/mm/yy'
	}
};
var v22 = {
	apiBackend: "http://192.168.0.22:8000/",
	page:0,
	rows:10,
	en: {
		firstDayOfWeek: 0,
		dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
		dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
		dayNamesMin: ["Su","Mo","Tu","We","Th","Fr","Sa"],
		monthNames: [ "January","February","March","April","May","June","July","August","September","October","November","December" ],
		monthNamesShort: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ],
		today: 'Today',
		clear: 'Clear',
		dateFormat: 'mm/dd/yy'
	},
	id: {
		firstDayOfWeek: 1,
		dayNames: ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"],
		dayNamesShort: ["Ming", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"],
		dayNamesMin: ["Mi","Se","Sa","Ra","Ka","Ju","Su"],
		monthNames: [ "Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember" ],
		monthNamesShort: [ "Jan", "Feb", "Mar", "Apr", "Mei", "Jun","Jul", "Agu", "Sep", "Okt", "Nov", "Des" ],
		today: 'Hari ini',
		clear: 'Kosongkan',
		dateFormat: 'dd/mm/yy'
	}
};
var v177 = {
	apiBackend: "http://192.168.0.177:8000/",
	page:0,
	rows:10,
	en: {
		firstDayOfWeek: 0,
		dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
		dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
		dayNamesMin: ["Su","Mo","Tu","We","Th","Fr","Sa"],
		monthNames: [ "January","February","March","April","May","June","July","August","September","October","November","December" ],
		monthNamesShort: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ],
		today: 'Today',
		clear: 'Clear',
		dateFormat: 'mm/dd/yy'
	},
	id: {
		firstDayOfWeek: 1,
		dayNames: ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"],
		dayNamesShort: ["Ming", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"],
		dayNamesMin: ["Mi","Se","Sa","Ra","Ka","Ju","Su"],
		monthNames: [ "Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember" ],
		monthNamesShort: [ "Jan", "Feb", "Mar", "Apr", "Mei", "Jun","Jul", "Agu", "Sep", "Okt", "Nov", "Des" ],
		today: 'Hari ini',
		clear: 'Kosongkan',
		dateFormat: 'dd/mm/yy'
	}
};
var cloud = {
	apiBackend: "https://"+window.location.hostname+"/backend-wps/index.php/",
	page:0,
	rows:10,
	en: {
		firstDayOfWeek: 0,
		dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
		dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
		dayNamesMin: ["Su","Mo","Tu","We","Th","Fr","Sa"],
		monthNames: [ "January","February","March","April","May","June","July","August","September","October","November","December" ],
		monthNamesShort: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ],
		today: 'Today',
		clear: 'Clear',
		dateFormat: 'mm/dd/yy'
	},
	id: {
		firstDayOfWeek: 1,
		dayNames: ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"],
		dayNamesShort: ["Ming", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"],
		dayNamesMin: ["Mi","Se","Sa","Ra","Ka","Ju","Su"],
		monthNames: [ "Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember" ],
		monthNamesShort: [ "Jan", "Feb", "Mar", "Apr", "Mei", "Jun","Jul", "Agu", "Sep", "Okt", "Nov", "Des" ],
		today: 'Hari ini',
		clear: 'Kosongkan',
		dateFormat: 'dd/mm/yy'
	}
};
var lokal = {
	apiBackend: "http://localhost:8000/",
	page:0,
	rows:10,
	en: {
		firstDayOfWeek: 0,
		dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
		dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
		dayNamesMin: ["Su","Mo","Tu","We","Th","Fr","Sa"],
		monthNames: [ "January","February","March","April","May","June","July","August","September","October","November","December" ],
		monthNamesShort: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ],
		today: 'Today',
		clear: 'Clear',
		dateFormat: 'mm/dd/yy'
	},
	id: {
		firstDayOfWeek: 1,
		dayNames: ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"],
		dayNamesShort: ["Ming", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"],
		dayNamesMin: ["Mi","Se","Sa","Ra","Ka","Ju","Su"],
		monthNames: [ "Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember" ],
		monthNamesShort: [ "Jan", "Feb", "Mar", "Apr", "Mei", "Jun","Jul", "Agu", "Sep", "Okt", "Nov", "Des" ],
		today: 'Hari ini',
		clear: 'Kosongkan',
		dateFormat: 'dd/mm/yy'
	}
};

var v1010 = {
	apiBackend: "http://10.10.1.177:8000/",
	page:0,
	rows:10,
	en: {
		firstDayOfWeek: 0,
		dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
		dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
		dayNamesMin: ["Su","Mo","Tu","We","Th","Fr","Sa"],
		monthNames: [ "January","February","March","April","May","June","July","August","September","October","November","December" ],
		monthNamesShort: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ],
		today: 'Today',
		clear: 'Clear',
		dateFormat: 'mm/dd/yy'
	},
	id: {
		firstDayOfWeek: 1,
		dayNames: ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"],
		dayNamesShort: ["Ming", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"],
		dayNamesMin: ["Mi","Se","Sa","Ra","Ka","Ju","Su"],
		monthNames: [ "Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember" ],
		monthNamesShort: [ "Jan", "Feb", "Mar", "Apr", "Mei", "Jun","Jul", "Agu", "Sep", "Okt", "Nov", "Des" ],
		today: 'Hari ini',
		clear: 'Kosongkan',
		dateFormat: 'dd/mm/yy'
	}
};

var v165 = {
	apiBackend: "http://103.148.192.165:8000/",
	page:0,
	rows:10,
	en: {
		firstDayOfWeek: 0,
		dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
		dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
		dayNamesMin: ["Su","Mo","Tu","We","Th","Fr","Sa"],
		monthNames: [ "January","February","March","April","May","June","July","August","September","October","November","December" ],
		monthNamesShort: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ],
		today: 'Today',
		clear: 'Clear',
		dateFormat: 'mm/dd/yy'
	},
	id: {
		firstDayOfWeek: 1,
		dayNames: ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"],
		dayNamesShort: ["Ming", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"],
		dayNamesMin: ["Mi","Se","Sa","Ra","Ka","Ju","Su"],
		monthNames: [ "Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember" ],
		monthNamesShort: [ "Jan", "Feb", "Mar", "Apr", "Mei", "Jun","Jul", "Agu", "Sep", "Okt", "Nov", "Des" ],
		today: 'Hari ini',
		clear: 'Kosongkan',
		dateFormat: 'dd/mm/yy'
	}
};
