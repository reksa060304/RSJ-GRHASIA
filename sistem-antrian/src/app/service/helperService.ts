import { Injectable } from '@angular/core';
import * as moment from 'moment'
@Injectable()
export class HelperService {
     dayNumber = [
        "00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10",
        "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
        "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"
    ];
     monthNames = [
        "Januari", "Februari", "Maret",
        "April", "Mei", "Juni", "Juli",
        "Agustus", "September", "Oktober",
        "November", "Desember"
    ];
     monthNumber = [
        "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"
    ];
     dates = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
     dateShorts = ["S", "Se", "Ra", "K", "J", "Sa", "M"];
    constructor() { }

    // format currency view grid
    public formatCurrency(data) {
        data = data.replace(/.{3}$/, "").replace(/\d{1,3}(?=(\d{3})+(?!\d))/g, "$&.");
        if (data != null && data != "") {
            return data;
        } else {
            return '-';
        }

    }
    public formatRupiah(value, currency) {
        return currency + "" + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
    }
    public currencyRp(value, currency) {
        return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
    }
    public countAge(birthday, dataNow) {
        // debugger;
        if (birthday === undefined || birthday === '')
            birthday = Date.now();
        else {
            if (birthday instanceof Date) {

            } else {
                var arr = birthday.split('-');
                if (arr[0].length === 4) {
                    birthday = new Date(arr[0], arr[1], arr[2]);
                } else {
                    birthday = new Date(arr[2], arr[1], arr[0]);
                }
            }

        }
        if (dataNow === undefined)
            dataNow = Date.now();
        var ageDifMs = dataNow - birthday;
        var ageDate = new Date(ageDifMs); // miliseconds from epoch
        var year = ageDate.getFullYear() - 1970;
        if (year <= -1)
            year = 0;
        var day = ageDate.getDate() - 1;
        var date = new Date(year, ageDate.getMonth(), day);
        return {
            year: year,
            month: ageDate.getMonth(),
            day: day,
            date: date
        };
    }
    public getHariIndo(dateStr) {
        let seminggu = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"]
        let hari = new Date(dateStr).getDay();
        return seminggu[hari];
    }
    public getBulanIndo(dateStr) {
        let bulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]
        let hari = new Date(dateStr).getMonth();
        return bulan[hari];
    }
   
    public toMonth (i) { return this.monthNames[i] }
    public toDate (date) {
        var arr = date.split('T')[0].split('/');
        if (arr.length >= 3)
            return new Date(arr[2], arr[1] - 1, arr[0]);
        arr = date.split('T')[0].split('-');
        if (arr[2].length === 4)
            return new Date(arr[2], arr[1] - 1, arr[0]);

        if (arr[0].length === 4) {
            var arrDetail = [];
            if (arr[2].indexOf(':') > 0)
                arrDetail = arr[2].split(' ')[1].split(':');
            if (arrDetail.length > 0)
                return new Date(arr[0], arr[1] - 1, arr[2].split(' ')[0], arrDetail[0], arrDetail[1], arrDetail[2]);
            else return new Date(arr[0], arr[1] - 1, arr[2]);
        }
        return new Date(arr[0], arr[1] - 1, arr[2]);

    }
    public formatDate (date, format) {
        if (date == undefined)
            return "";
        return moment(date).format(format);
    }
    public DescDay (date, flag) {
        var day = date.getDay() - 1;
        if (day === -1)
            day = 6;
        if (date === undefined)
            return "";
        if (date.getDay === undefined)
            return "";
        if (flag !== undefined) {
            return this.dateShorts[day];
        }
        return this.dates[day];
    }
    public  CountAge (birthday, dataNow) {
 
        if (birthday === undefined || birthday === '')
            birthday = Date.now();
        else {
            if (birthday instanceof Date) {

            } else {
                var arr = birthday.split('-');
                if (arr[0].length === 4) {
                    birthday = new Date(arr[0], arr[1], arr[2]);
                } else {
                    birthday = new Date(arr[2], arr[1], arr[0]);
                }
            }

        }
        if (dataNow === undefined)
            dataNow = Date.now();
        var ageDifMs = dataNow - birthday;
        var ageDate = new Date(ageDifMs); // miliseconds from epoch
        var year = ageDate.getFullYear() - 1970;
        if (year <= -1)
            year = 0;
        var day = ageDate.getDate() - 1;
        var date = new Date(year, ageDate.getMonth(), day);
        return {
            year: year,
            month: ageDate.getMonth(),
            day: day,
            date: date
        };
    }

   public CountDifferenceDayHourMinute (dateTimeFirst, dateTimeOld) {
        if (dateTimeFirst == undefined || dateTimeFirst == "") {
            dateTimeFirst = Date.now();
        }
        if (dateTimeOld == undefined || dateTimeOld == "") {
            dateTimeOld = Date.now();
        }
        var today :any= new Date(dateTimeFirst);
        var Christmas :any = new Date(dateTimeOld);
        var diffMs = (Christmas - today);
        var diffDays = Math.floor(diffMs / 86400000); // hari
        var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // jam
        var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // menit
        var Totalwaktu = (diffDays + " Hari, " + diffHrs + " Jam, " + diffMins + " Menit ");
        return Totalwaktu;
    }

    public CountDifferenceHourMinute (FirstHour, LastHour) {
        if (FirstHour == undefined || FirstHour == "") {
            FirstHour = new Date();
        }
        if (LastHour == undefined || LastHour == "") {
            LastHour = new Date();
        }
        var HourNow:any = new Date(FirstHour);
        var HourLast :any= new Date(LastHour);
        var diffMs = (HourLast - HourNow);
        var diffHrs = Math.floor((diffMs % 86400000) / 3600000); //Jam
        var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);//Menit
        var TotalJamMenit = (diffHrs + " Jam, " + diffMins + " Menit ");
        return TotalJamMenit;
    }

    public BuildAge (year, month, day) {
        var dataNow = new Date();
        dataNow.setFullYear(dataNow.getFullYear() - year);
        dataNow.setMonth(dataNow.getMonth() - month);
        dataNow.setDate(dataNow.getDate() - day);
        return dataNow;
    }
    public getTanggalFormatted (inputTanggal) {
        var date = inputTanggal;
        var day = date.getDate();
        var monthIndex = date.getMonth();
        var year = date.getFullYear();

        var tanggalFormatted = day + ' ' + this.monthNames[monthIndex] + ' ' + year;

        return tanggalFormatted;

    }
    public getPeriodFormat (inputTanggal) {
        var date = inputTanggal;
        var day = date.getDate();
        var monthIndex = date.getMonth();
        var year = date.getFullYear();

        var tanggalFormatted = this.monthNames[monthIndex] + '-' + year;

        return tanggalFormatted;

    }
  
    public getBulanFormatted (inputTanggal) {
        var monthNames = [
            "Januari", "Februari", "Maret",
            "April", "Mei", "Juni", "Juli",
            "Agustus", "September", "Oktober",
            "November", "Desember"
        ]
        var date = inputTanggal;
        var monthIndex = date.getMonth();
     
        var year = date.getFullYear();
        var BulanFormatted = monthNames[monthIndex] + ' ' + year;

        return BulanFormatted;
    }
    public getTanggalFormattedNew (inputTanggal) {

        var date = inputTanggal;
        var day = date.getDate();
        var month = date.getMonth();
        var year = date.getFullYear();

        var tanggalFormattedNew = year + '-' + this.monthNumber[month] + '-' + day;

        return tanggalFormattedNew;

    }

    public getTanggalFormattedBaru (inputTanggal) {

        var date = inputTanggal;
        var day = date.getDate();
        var monthIndex = date.getMonth() - 1;
        var year = date.getFullYear();

        var tanggalFormattedBaru = year + '-' + monthIndex;
      
        return tanggalFormattedBaru;

    }

    public  getTanggalFormattedOk (inputTanggal) {

        var date = inputTanggal;
        var day = date.getDate();
        var monthIndex = date.getMonth();
        var year = date.getFullYear();

        var tanggalFormattedBaru = year + '-' + monthIndex;
        debugger;
        return tanggalFormattedBaru;

    }



    public getTahunFormatted (inputTanggal) {

        var date = inputTanggal;
        var day = date.getDate();
        var monthIndex = date.getMonth();
        var year = date.getFullYear();

        var tahunFormatted = year;

        return tahunFormatted;

    }
    public getPeriodeFormatted (date) {
        return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    }
    public getJamFormatted (hour) {
        var HH = hour.getHours();
        var mm = hour.getMinutes();
        if (HH < 10) HH = "0" + HH;
        if (mm < 10) mm = "0" + mm;
        return HH + ":" + mm;
    }
    public getJamMenitDetikFormatted (hour) {
        var HH = hour.getHours();
        var mm = hour.getMinutes();
        var ss = hour.getSeconds();
        if (HH < 10) HH = "0" + HH;
        if (mm < 10) mm = "0" + mm;
        if (ss < 10) ss = "0" + ss;
        return HH + ":" + mm + ":" + ss;
    }
    public  getTanggalJamFormatted (inputTanggal) {
        var monthNames = [
            "Januari", "Februari", "Maret",
            "April", "Mei", "Juni", "Juli",
            "Agustus", "September", "Oktober",
            "November", "Desember"
        ];

        var date = inputTanggal;
        var day = date.getDate();
        var monthIndex = date.getMonth();
        var year = date.getFullYear();
        var HH = date.getHours();
        var mm = date.getMinutes();
        if (HH < 10) HH = "0" + HH;
        if (mm < 10) mm = "0" + mm;
        var tanggalFormatted = day + ' ' + monthNames[monthIndex] + ' ' + year + ' ' + HH + ':' + mm;

        return tanggalFormatted;

    }
    public getDateTimeFormatted (inputTanggal) {

        var date = inputTanggal;
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        var HH = date.getHours();
        var mm = date.getMinutes();

        var DateTimeFormatted = year + '-' + month + '-' + day + ' ' + HH + ':' + mm;

        return DateTimeFormatted;

    }

    public   getDateTimeFormatted2 (inputTanggal) {

        var date = inputTanggal;
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        var HH = date.getHours();
        var mm = date.getMinutes();
        var dayNumber = [
            "00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10",
            "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
            "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"
        ];

        var HourNumber = [
            "00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10",
            "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
            "21", "22", "23", "24"
        ];

        var MinuteNumber = [
            "00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10",
            "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
            "21", "22", "23", "24", "25", "26", "27", "28", "29", "30",
            "31", "32", "33", "34", "35", "36", "37", "38", "39", "40",
            "41", "42", "43", "44", "45", "46", "47", "48", "49", "50",
            "51", "52", "53", "54", "55", "56", "57", "58", "59", "60"
        ];
        var Bulan = [
            "00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10",
            "11", "12"
        ];

        var DateTimeFormatted = year + '-' + Bulan[month] + '-' + dayNumber[day] + ' ' + HourNumber[HH] + ':' + MinuteNumber[mm];

        return DateTimeFormatted;

    }

    public  getDateTimeFormatted3 (inputTanggal) {

        var date = inputTanggal;
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        var HH = date.getHours();
        var mm = date.getMinutes();
        var dayNumber = [
            "00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10",
            "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
            "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"
        ];

        var HourNumber = [
            "00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10",
            "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
            "21", "22", "23", "24"
        ];

        var MinuteNumber = [
            "00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10",
            "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
            "21", "22", "23", "24", "25", "26", "27", "28", "29", "30",
            "31", "32", "33", "34", "35", "36", "37", "38", "39", "40",
            "41", "42", "43", "44", "45", "46", "47", "48", "49", "50",
            "51", "52", "53", "54", "55", "56", "57", "58", "59", "60"
        ];
        var Bulan = [
            "00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10",
            "11", "12"
        ];

        var DateTimeFormatted = year + '-' + Bulan[month] + '-' + dayNumber[day];

        return DateTimeFormatted;

    }

    public getMasaGaransi (inputTanggal, masaGaransi) {
     
        var date = inputTanggal;
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear() + parseInt(masaGaransi);
        var HH = date.getHours();
        var mm = date.getMinutes();
        var dayNumber = [
            "00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10",
            "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
            "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"
        ];

        var HourNumber = [
            "00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10",
            "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
            "21", "22", "23", "24"
        ];

        var MinuteNumber = [
            "00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10",
            "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
            "21", "22", "23", "24", "25", "26", "27", "28", "29", "30",
            "31", "32", "33", "34", "35", "36", "37", "38", "39", "40",
            "41", "42", "43", "44", "45", "46", "47", "48", "49", "50",
            "51", "52", "53", "54", "55", "56", "57", "58", "59", "60"
        ];
        var Bulan = [
            "00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10",
            "11", "12"
        ];

        var DateTimeFormatted = year + '-' + Bulan[month] + '-' + dayNumber[day];
        return DateTimeFormatted;
    }

    public  getTriwulan (inputTanggal) {
        var date:any = inputTanggal;
        var day = date.getDate();
        if (date.getMonth() == 0) {
            var month:any = date.getMonth() + 12 - 2;
            var year:any  = date.getFullYear() - 1;
        } else if (date.getMonth() == 1) {
            var month:any = date.getMonth() + 11;
            var year:any  = date.getFullYear() - 1;
        } else {
            var month:any = date.getMonth() - 2;
            var year:any = date.getFullYear();
        }
        var HH = date.getHours();
        var mm = date.getMinutes();
        var dayNumber = [
            "00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10",
            "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
            "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"
        ];

        var HourNumber = [
            "00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10",
            "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
            "21", "22", "23", "24"
        ];

        var MinuteNumber = [
            "00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10",
            "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
            "21", "22", "23", "24", "25", "26", "27", "28", "29", "30",
            "31", "32", "33", "34", "35", "36", "37", "38", "39", "40",
            "41", "42", "43", "44", "45", "46", "47", "48", "49", "50",
            "51", "52", "53", "54", "55", "56", "57", "58", "59", "60"
        ];
        var Bulan = [
            "00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10",
            "11", "12"
        ];

        var DateTimeFormatted = year + '-' + (Bulan[month]) + '-' + dayNumber[day];

        return DateTimeFormatted;

    }
    public  getDateTimeFormattedNew (inputTanggal) {
        var dayNumber = [
            "00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10",
            "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
            "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"
        ];
        var HourNumber = [
            "00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10",
            "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
            "21", "22", "23", "24"
        ];
        var MinuteNumber = [
            "00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10",
            "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
            "21", "22", "23", "24", "25", "26", "27", "28", "29", "30",
            "31", "32", "33", "34", "35", "36", "37", "38", "39", "40",
            "41", "42", "43", "44", "45", "46", "47", "48", "49", "50",
            "51", "52", "53", "54", "55", "56", "57", "58", "59", "60"
        ];
        var date = inputTanggal;
        var day = date.getDate();
        var month = date.getMonth();
        var year = date.getFullYear();
        var HH = date.getHours();
        var mm = date.getMinutes();

        var DateTimeFormatted = year + '-' + this.monthNumber[month] + '-' + dayNumber[day] + ' ' + HourNumber[HH] + ':' + MinuteNumber[mm] + ":00";

        return DateTimeFormatted;

    }
    //davis was here
    public  setJamAwal (tgl) {
        tgl.setHours(0);
        tgl.setMinutes(0);
        tgl.setSeconds(0);

        return tgl;
    }
    public    setJamAkhir (tgl) {
        tgl.setHours(23);
        tgl.setMinutes(59);
        tgl.setSeconds(59);

        return tgl;
    }
    public  stringToDateTime (dateString) {
        var year = dateString.substring(0, 4);
        var month = dateString.substring(4, 6);
        var day = dateString.substring(6, 8);
        var hour = dateString.substring(8, 10);
        var minutes = dateString.substring(10, 12);
        var seconds = dateString.substring(12, 14);

        var DateTimeFormatted = day + '-' + month + '-' + year + ' ' + hour + ':' + minutes + ':' + seconds;

        return DateTimeFormatted;
    }
    public   newStringToDateTime (dateString) {
        var day = dateString.substring(0, 2);
        var month = dateString.substring(3, 5);
        var year = dateString.substring(6, 10);
        if (month.indexOf("0") == 0) {
            month = month.substring(1, 2);
        }
        var DateTimeFormatted = year + '-' + month + '-' + day;

        return DateTimeFormatted;
    }
    public getFormatMonthPicker (date) {
        var mount = date.getMonth() + 1;
        if (mount < 10) {
            mount = "0" + mount;
        }
        return date.getFullYear() + "-" + mount;
    }
    public  getDaysofMonth (date) {
        var ds = new Date(date);

        var firstDay = new Date(ds.getFullYear(), ds.getMonth(), 1);
        var lastDay = new Date(ds.getFullYear(), ds.getMonth() + 1, 0);
        var formattedFirstDayWithSlashes = firstDay.getFullYear() + '/' + this.monthNumber[(firstDay.getMonth())] + '/' + this.dayNumber[(firstDay.getDate())],
            formattedLastDayWithSlashes = lastDay.getFullYear() + '/' + this.monthNumber[(firstDay.getMonth())] + '/' + this.dayNumber[(lastDay.getDate())];

        return [formattedFirstDayWithSlashes, formattedLastDayWithSlashes];
    }
}