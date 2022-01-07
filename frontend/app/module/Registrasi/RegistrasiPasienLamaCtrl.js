define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('RegistrasiPasienLamaCtrl', ['MedifirstService', 'CacheHelper', '$scope', 'DateHelper', '$state', 'ModelItem', '$mdDialog',
        function (medifirstService, cacheHelper, $scope, DateHelper, $state, ModelItem, $mdDialog) {
            //Inisial Variable 
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};
            $scope.itemD = {};
            $scope.itemDd = {};
            $scope.isRouteLoading = false;
            $scope.item.tglawal = $scope.now;
            $scope.item.tglakhir = $scope.now;
            $scope.tglMeninggal = '';
            $scope.item.Rows = 50;
            $scope.Page = {
                refresh: true,
                pageSizes: true,
                buttonCount: 5
            }
            var kelompokUserLogin = ModelItem.getStatusUser()
            var mapLogin = medifirstService.getMapLoginUserToRuangan()
            if (kelompokUserLogin == 'radiologi' || kelompokUserLogin == 'laborat') {
                $scope.isPenunjang = true
            }
            if (mapLogin && mapLogin.length > 0) {
                for (var i = 0; i < mapLogin.length; i++) {
                    const map = mapLogin[i]
                    if (map.namaruangan.toLowerCase().indexOf('laborat') > -1
                        || map.namaruangan.toLowerCase().indexOf('radiologi') > -1) {
                        $scope.isPenunjang = true;
                        break;
                    }
                }
            }
            loadFirst()
            function loadFirst() {
                cacheHelper.set('cacheStatusPasien', undefined);
                var chacePeriode = cacheHelper.get('RegistrasiPasienLamaRevCtrl');
                if (chacePeriode != undefined) {
                    var arrPeriode = chacePeriode.split('~');
                    $scope.item.periodeAwal = new Date(arrPeriode[0]);
                    $scope.item.periodeAkhir = new Date(arrPeriode[1]);

                } else {
                    $scope.item.periodeAwal = $scope.now;
                    $scope.item.periodeAkhir = $scope.now;
                }
            }
            loadData()
            $scope.SearchData = function () {
                loadData()
            }
            $scope.SearchEnter = function () {
                loadData()
            }
            $scope.SearchNoRm = function () {
                loadData()
            }
            $scope.SearchTglLahir = function () {
                loadData()
            }
            function loadData() {

                $scope.isRouteLoading = true;

                var Rows = ''
                if ($scope.item.Rows != undefined) {
                    Rows = "&Rows=" + $scope.item.Rows
                }
                var rm = ""
                if ($scope.item.noRM != undefined) {
                    rm = "&norm=" + $scope.item.noRM
                }

                var pasien = ""
                if ($scope.item.namaPasien != undefined) {
                    pasien = "&namaPasien=" + $scope.item.namaPasien
                }
                var ayah = ""
                if ($scope.item.namaAyah != undefined) {
                    ayah = "&namaAyah=" + $scope.item.namaAyah
                }
                var almat = ""
                if ($scope.item.alamat != undefined) {
                    almat = "&alamat=" + $scope.item.alamat
                }
                var nik = ""
                // if ($scope.item.nik != undefined) {
                nik = "nik=" + $scope.item.nik
                // }
                var bpjs = ""
                if ($scope.item.noBPJS != undefined) {
                    bpjs = "&bpjs=" + $scope.item.noBPJS
                }

                if ($scope.item.namaAyah != undefined) {
                    ayah = "&namaAyah=" + $scope.item.namaAyah
                } var tglLahirs = ""
                if ($scope.item.tglLahir != undefined) {
                    tglLahirs = "tglLahir=" + DateHelper.formatDate($scope.item.tglLahir, 'YYYY-MM-DD');
                }

                medifirstService.get("registrasi/get-pasien?" +
                    nik +
                    tglLahirs +
                    rm +
                    pasien +
                    ayah +
                    almat + bpjs +
                    Rows)
                    .then(function (data) {
                        $scope.isRouteLoading = false;

                        $scope.dataSourceGrid = new kendo.data.DataSource({
                            data: data.data.daftar,
                            pageSize: 10,
                            total: data.data.daftar.length,

                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                    }
                                }
                            }

                        });
                    });

            };



            $scope.columnGrid = {
                pageable: true,
                columns: [
                    {
                        "field": "nocm",
                        "title": "No Rekam Medis",
                        "width": "80px",
                        // "template": "<span class='style-center'>#: nocm #</span>"
                    },
                    {
                        "field": "noidentitas",
                        "title": "NIK",
                        "width": "80px",
                        // "template": "<span class='style-center'>#: nocm #</span>"
                    },
                    {
                        "field": "nobpjs",
                        "title": "No BPJS",
                        "width": "80px",
                        // "template": "<span class='style-center'>#: nocm #</span>"
                    },
                    {
                        "field": "namapasien",
                        "title": "Nama Pasien",
                        "width": "150px",
                        // "template": "<span class='style-center'>#: namapasien #</span>"
                    },
                    {
                        "field": "jeniskelamin",
                        "title": "Jenis Kelamin",
                        "width": "80px",
                        // "template": "<span class='style-center'>#: jeniskelamin #</span>"
                    },

                    {
                        "field": "namaayah",
                        "title": "Nama Ayah Kandung",
                        "width": "100px",
                        "template": '# if( namaayah==null) {# - # } else {# #= namaayah # #} #'
                        // "template": "<span class='style-center'>#: namaayah #</span>"
                    },
                    {
                        "field": "tgllahir",
                        "title": "Tanggal Lahir",
                        "width": "80px",
                        "template": "<span class='style-left'>{{formatTanggal('#: tgllahir #')}}</span>"
                    },
                    // {
                    //     "field": "umurzz",
                    //     "title": "Umur",
                    //     "width":240

                    // },
                    {
                        "field": "alamatlengkap",
                        "title": "Alamat",
                        "width": "200px",

                    },
                    {
                        "field": "notelepon",
                        "title": "No Telepon",
                        "width": "80px",
                        "template": '# if( notelepon==null) {# - # } else {# #= notelepon # #} #'
                    },
                    {
                        "field": "nohp",
                        "title": "No HP",
                        "width": "80px",
                        "template": '# if( nohp==null) {# - # } else {# #= nohp # #} #'
                    },
                    {
                        "field": "tglmeninggal",
                        "title": "Status Pasien",
                        "width": "80px",
                        "template": '# if( tglmeninggal==null) {# <span class="label label-primary text-center">Hidup</span> # } else {# <span class="label label-danger text-center">Meninggal</span> #} #'
                    },
                    {
                        "field": "photo",
                        "title": "Photo",
                        "width": "40px",
                        "template": '# if( photo!=null ) {# ✔ # } else {# - #} #'
                        // "template": "# if (photo) { #" +
                        //     "<i class='fa fa-user' style='color:grey' />" +
                        //     "# } else { # - # } #",
                        // "template": "<div class='photo-pasien'"+
                        // "style='background:url(#:data.photo#);'></div>"
                    },
                    {
                        "field": "iskompleks",
                        "title": "Kompleks",
                        "width": "50px",
                        "template": '# if( iskompleks==1 ) {# ✔ # } else {#  #} #'

                    },
                ]
            };

            $scope.klikGrid = function (dataPasienSelected) {
                if (dataPasienSelected != undefined) {
                    $scope.nocm = dataPasienSelected.nocm;
                    $scope.idPasien = dataPasienSelected.nocmfk;
                    $scope.tglMeninggal = dataPasienSelected.tglmeninggal;
                    $scope.dataPasienSelected = dataPasienSelected;
                }
            }

            $scope.klikdua = function (dataPasienSelected) {
                if (dataPasienSelected.foto != null) {
                    $scope.item.image = dataPasienSelected.foto
                    $scope.popUpPhoto.center().open()

                }

            }

            $scope.tutupPhoto = function () {
                $scope.item.image = "../app/images/avatar.jpg"
                $scope.popUpPhoto.close()
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            $scope.$on("kendoWidgetCreated", function (event, widget) {
                if (widget === $scope.grid) {
                    $scope.grid.element.on('dblclick', function (e) {
                        if ($scope.nocm != undefined) {
                            $state.go("UmVnaXN0cmFzaVJ1YW5nYW4=", {
                                noCm: $scope.nocm
                            })
                            var cacheSet = undefined;
                            cacheHelper.set('CacheRegistrasiPasien', cacheSet);

                        }
                    })

                }

            })


            $scope.RegistrasiPasien = function () {

                if ($scope.nocm == undefined) {
                    toastr.warning('Pilih data dulu!')
                    return
                }

                if ($scope.tglMeninggal != undefined) {
                    toastr.warning('Pasien Sudah Meninggal Tidak Bisa Didaftarkan, Peringatan !')
                    return
                }

                cacheHelper.set('cacheStatusPasien', 'LAMA');
                if (!$scope.isPenunjang) {
                    cacheHelper.set('isPenunjang', undefined);
                    $state.go("UmVnaXN0cmFzaVJ1YW5nYW4=", {
                        noCm: $scope.dataPasienSelected.nocmfk
                    })
                    var cacheSet = undefined;
                    cacheHelper.set('CacheRegistrasiPasien', cacheSet);
                    var cacheSetss = undefined;
                    cacheHelper.set('CacheRegisOnline', cacheSetss);

                } else {
                    cacheHelper.set('isPenunjang', true);
                    $state.go("UmVnaXN0cmFzaVJ1YW5nYW4=", {
                        noCm: $scope.dataPasienSelected.nocmfk
                    })
                    var cacheSet = undefined;
                    cacheHelper.set('CacheRegistrasiPasien', cacheSet);
                    var cacheSetss = undefined;
                    cacheHelper.set('CacheRegisOnline', cacheSetss);
                }
            }
            $scope.EditPasien = function () {
                cacheHelper.set('cacheStatusPasien', 'LAMA');
                if ($scope.nocm != undefined) {

                    cacheHelper.set('CacheRegisBayi', undefined);
                    $state.go('RegistrasiPasienBaru', {
                        noRec: 0,
                        idPasien: $scope.idPasien
                    })


                } else {
                    messageContainer.error("Pilih data dulu!")
                }
            }
            $scope.HapusPasien = function () {
                if ($scope.idPasien != undefined) {
                    var item = {
                        idpasien: $scope.idPasien
                    }

                    medifirstService.post('registrasi/update-false-pasien', item).then(function (e) {
                        loadData();
                    })

                } else {
                    messageContainer.error("Pilih data dulu!")
                }
            }

            $scope.pasienBaru = function () {
                // body...
                cacheHelper.set('CacheRegisBayi', undefined);
                $state.go("RegistrasiPasienBaru", {
                    noRec: 0,
                    idPasien: 0
                })
            }

            $scope.columnRiwayatRegistrasi = {
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "DaftarRiwayatRegistrasi.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:K1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Daftar Registrasi Pasien",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                selectable: 'row',
                pageable: true,
                columns: [
                    {
                        "field": "no",
                        "title": "No",
                        "width": "30px",
                    },
                    {
                        "field": "tglregistrasi",
                        "title": "Tgl Registrasi",
                        "width": "80px",
                        "template": "<span class='style-left'>{{formatTanggal('#: tglregistrasi #')}}</span>"
                    },
                    {
                        "field": "noregistrasi",
                        "title": "No Registrasi",
                        "width": "90px"
                    },
                    {
                        "field": "namaruangan",
                        "title": "Ruanganan Layanan",
                        "width": "150px",
                        "template": "<span class='style-left'>#: namaruangan #</span>"
                    },
                    {
                        "field": "kelompokpasien",
                        "title": "Kelompok Pasien",
                        "width": "150px",
                        "template": "<span class='style-left'>#: kelompokpasien #</span>"
                    },
                    {
                        "field": "namadokter",
                        "title": "Nama Dokter",
                        "width": "150px",
                        "template": "<span class='style-left'>#: namadokter #</span>"
                    },
                    {
                        "field": "tglpulang",
                        "title": "Tgl Pulang",
                        "width": "80px",
                        "template": "<span class='style-left'>{{formatTanggal('#: tglpulang #')}}</span>"
                    },
                    {
                        "field": "lamarawat",
                        "title": "Lama Dirawat",
                        "width": "80px"
                        // "template": "<span class='style-left'>{{formatTanggal('#: tglpulang #')}}</span>"
                    }
                ]
            };

            $scope.RiwayatRegistrasi = function () {
                if ($scope.dataPasienSelected == undefined) {
                    messageContainer.error("Pilih data dulu!")
                }
                $scope.itemD.noRM = $scope.dataPasienSelected.nocm;
                $scope.itemD.namaPasien = $scope.dataPasienSelected.namapasien;
                $scope.itemD.tglLahir = moment($scope.dataPasienSelected.tgllahir).format('DD-MM-YYYY');
                loadDataRiwayat();
                $scope.popUpRiwayatRegistrasi.center().open();
                var actions = $scope.popUpRiwayatRegistrasi.options.actions;
                actions.splice(actions.indexOf("Close"), 1);
                $scope.popUpRiwayatRegistrasi.setOptions({ actions: actions });
            }

            $scope.TutupPopUp = function () {
                $scope.itemD.noRM = undefined;
                $scope.itemD.namaPasien = undefined;
                $scope.itemD.tglLahir = undefined;
                $scope.itemD.noRegistrasi = undefined;
                $scope.itemD.JumlahRawat = undefined;
                $scope.dataRiwayatRegistrasi = new kendo.data.DataSource({
                    data: []
                });
                $scope.popUpRiwayatRegistrasi.close();
            }
            $scope.saveDataNFC = function(){
                 if ($scope.dataPasienSelected == undefined) {
                    messageContainer.error("Pilih data dulu!")
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/Pendaftaran?save-nfc=1' +
                    '&nik=' + $scope.dataPasienSelected.noidentitas +
                    '&nocm=' + $scope.dataPasienSelected.nocm  , function (response) {
                        const obj = JSON.parse(response);
                    toastr.success(obj.msg)
                });
                // client.get('http://127.0.0.1:1237/printvb/Pendaftaran?save-nfc=1' +
                //     '&nocm=' + $scope.dataPasienSelected.nocm +
                //     '&nama=' + $scope.dataPasienSelected.namapasien +
                //     '&tl=' + moment($scope.dataPasienSelected.tgllahir).format('DD-MM-YYYY') , function (response) {
                //     // do something with response
                // });
            }
            $scope.getDataNFC = function(){
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/Pendaftaran?get-nfc=1&nocm=000000&view=false'  , function (response) {
                        const obj = JSON.parse(response);
                    $scope.item.noRM = obj.nocm
                    loadData()
                });
            }
            var HttpClient = function () {
                this.get = function (aUrl, aCallback) {
                    var anHttpRequest = new XMLHttpRequest();
                    anHttpRequest.onreadystatechange = function () {
                        if (anHttpRequest.readyState == 4 )
                            aCallback(anHttpRequest.responseText);
                    }

                    anHttpRequest.open("GET", aUrl, true);
                    anHttpRequest.send(null);
                }
            }

            function loadDataRiwayat() {
                $scope.isRouteLoading = true;
                var rm = ""
                if ($scope.itemD.noRM != undefined) {
                    rm = "&norm=" + $scope.itemD.noRM
                }

                var pasien = ""
                if ($scope.itemD.namaPasien != undefined) {
                    pasien = "&namaPasien=" + $scope.itemD.namaPasien
                }

                var tglLahirs = ""
                if ($scope.itemD.tglLahir != undefined) {
                    tglLahirs = "tglLahir=" + moment($scope.itemD.tglLahir).format('YYYY-MM-DD HH:mm:ss');
                }

                var noReg = ""
                if ($scope.itemD.noRegistrasi != undefined) {
                    noReg = "&noReg=" + $scope.itemD.noRegistrasi;
                }

                medifirstService.get("registrasi/daftar-riwayat-registrasi?" +
                    tglLahirs + rm + noReg + pasien)
                    .then(function (data) {
                        $scope.isRouteLoading = false;
                        var jumlahRawat = 0;
                        var dRiwayatReg = data.data.daftar;
                        for (var i = 0; i < dRiwayatReg.length; i++) {
                            dRiwayatReg[i].no = i + 1
                            if (dRiwayatReg[i].statusinap == 1) {
                                jumlahRawat = jumlahRawat + 1;
                                if (dRiwayatReg[i].tglpulang != undefined) {
                                    var umur = DateHelper.CountAge(new Date(dRiwayatReg[i].tglregistrasi), new Date(dRiwayatReg[i].tglpulang));
                                    var bln = umur.month,
                                        thn = umur.year,
                                        day = umur.day
                                    dRiwayatReg[i].lamarawat = day + " Hari";
                                } else {
                                    var umur = DateHelper.CountAge(new Date(dRiwayatReg[i].tglregistrasi), new Date($scope.now));
                                    var bln = umur.month,
                                        thn = umur.year,
                                        day = umur.day
                                    dRiwayatReg[i].lamarawat = day + " Hari";
                                }
                            }
                        }
                        $scope.itemD.JumlahRawat = jumlahRawat;
                        $scope.dataRiwayatRegistrasi = new kendo.data.DataSource({
                            data: dRiwayatReg,
                            pageSize: 10,
                            total: dRiwayatReg.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                    }
                                }
                            }
                        });
                    });
            }

            $scope.SearchEnterDetail = function () {
                loadDataRiwayat();
            }

            $scope.klikGridR = function (dataPasienSelectedR) {
                if (dataPasienSelectedR != undefined) {
                    $scope.dataPasienSelectedR = dataPasienSelectedR;                   
                }
            }

            function saveBase64AsFile(base64, fileName) {

                var link = document.createElement("a");

                link.setAttribute("href", base64);
                link.setAttribute("download", fileName);
                link.click();
            }

            $scope.saveImage = function () {
                saveBase64AsFile($scope.item.image, 'asa.jpg')
                // var img = document.getElementById('embedImage');
                // img.src = $scope.item.image
                // window.location.href = img.src.replace('image/png', 'image/octet-stream');
            }

            window.addEventListener('DOMContentLoaded', () => {

                var img = document.getElementById('embedImage');
                img.src = $scope.item.image

                img.addEventListener('load', () => button.removeAttribute('disabled'));

                const button = document.getElementById('saveImage');
                button.addEventListener('click', () => {
                    window.location.href = img.src.replace('image/jpg', 'image/octet-stream');
                });
            });

            $scope.gabungkanNoRM = function () {
                if ($scope.dataPasienSelected == undefined) {
                    toastr.error("Pilih data dulu!")
                }
                $scope.item.idRmAsal = $scope.dataPasienSelected.nocmfk
                $scope.item.rmAsal = $scope.dataPasienSelected.nocm
                $scope.item.namaPasienAsal = $scope.dataPasienSelected.namapasien
                $scope.popUpGabungkan.center().open()
            }

            $scope.saveGabungkan = function () {
                if ($scope.item.rmTujukan == undefined) return;
                if ($scope.item.idRmAsal == undefined) return;
                var confirm = $mdDialog.confirm()
                    .title('Peringatan')
                    .textContent('Apakah Anda yakin menggabungkan No RM ' + $scope.item.rmAsal + ' Ke ' + $scope.item.rmTujukan + ' ?!')
                    .ariaLabel('Lucky day')
                    .cancel('Tidak')
                    .ok('Ya')
                $mdDialog.show(confirm).then(function () {
                    var data = {
                        idasal: $scope.item.idRmAsal,
                        nocmtujuan: $scope.item.rmTujukan.trim(),
                    }
                    medifirstService.post('registrasi/merge-nomor-rm', data).then(function (e) {
                        $scope.popUpGabungkan.close()
                        $scope.item.idRmAsal = undefined
                        loadData()

                    })
                })
            }

            $scope.DetailRegistrasi = function(){                
                if ($scope.dataPasienSelectedR == undefined) {
                    messageContainer.error("Pilih data dulu!")
                }
                $scope.itemDd.noRM = $scope.dataPasienSelectedR.nocm;
                $scope.itemDd.namaPasien = $scope.dataPasienSelectedR.namapasien;
                $scope.itemDd.tglLahir = moment($scope.dataPasienSelectedR.tgllahir).format('DD-MM-YYYY');
                $scope.itemDd.noRegistrasi = $scope.dataPasienSelectedR.noregistrasi; 
                loadDetailRiwayat();
                $scope.popUpDetailRegistrasi.center().open();
                var actions = $scope.popUpDetailRegistrasi.options.actions;
                actions.splice(actions.indexOf("Close"), 1);
                $scope.popUpDetailRegistrasi.setOptions({ actions: actions });
            }

            $scope.TutupPopUps = function () {
                $scope.itemDd.noRM = undefined;
                $scope.itemDd.namaPasien = undefined;
                $scope.itemDd.tglLahir = undefined;
                $scope.itemDd.noRegistrasi = undefined;
                $scope.itemDd.JumlahRawat = undefined;
                $scope.dataDetailRegistrasi = new kendo.data.DataSource({
                    data: []
                });
                $scope.popUpDetailRegistrasi.close();
            }

            function loadDetailRiwayat() {                
                if ($scope.dataPasienSelectedR == undefined) {
                    messageContainer.error("Pilih data dulu!")
                    return;
                }
                var noReg = ''
                noReg = $scope.dataPasienSelectedR.noregistrasi                            
                medifirstService.get("registrasi/get-detail-registrasi-pasien?noregistrasi=" + $scope.dataPasienSelectedR.noregistrasi ).then(function (data) {
                        $scope.isRouteLoading = false;
                        var jumlahRawat = 0;
                        var dRiwayatReg = data.data;
                        for (var i = 0; i < dRiwayatReg.length; i++) {
                            dRiwayatReg[i].no = i + 1                           
                        } 
                        $scope.dataDetailRegistrasi = new kendo.data.DataSource({
                            data: dRiwayatReg,
                            pageSize: 10,
                            total: dRiwayatReg.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                    }
                                }
                            }
                        });
                    });
            }

            $scope.SearchEnterDetail = function () {
                loadDetailRiwayat();
            }

            $scope.columnDetailRegistrasi = {
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "DaftarDetailRegistrasi.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:K1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Daftar Detail Registrasi Pasien",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                selectable: 'row',
                pageable: true,
                columns: [
                    {
                        "field": "no",
                        "title": "No",
                        "width": "30px",
                    },
                    {
                        "field": "tglregistrasi",
                        "title": "Tgl Registrasi",
                        "width": "80px",
                        "template": "<span class='style-left'>{{formatTanggal('#: tglregistrasi #')}}</span>"
                    },                   
                    {
                        "field": "namaruangan",
                        "title": "Ruanganan Layanan",
                        "width": "150px",
                        "template": "<span class='style-left'>#: namaruangan #</span>"
                    },                   
                    {
                        "field": "namadokter",
                        "title": "Nama Dokter",
                        "width": "150px",
                        "template": "<span class='style-left'>#: namadokter #</span>"
                    },
                    {
                        "field": "namakelas",
                        "title": "Kelas",
                        "width": "80px",
                        "template": "<span class='style-left'>#: namakelas #</span>"
                    },
                    {
                        "field": "namakamar",
                        "title": "Kamar",
                        "width": "100px",
                        "template": "<span class='style-left'>#: namakamar #</span>"
                    },
                    {
                        "field": "Bed",
                        "title": "nobed",
                        "width": "80px",
                        "template": "<span class='style-left'>#: nobed #</span>"
                    },
                    {
                        "field": "tglmasuk",
                        "title": "Tgl Masuk",
                        "width": "110px",
                        "template": "<span class='style-left'>{{formatTanggal('#: tglmasuk #')}}</span>"
                    },
                    {
                        "field": "tglkeluar",
                        "title": "Tgl Keluar",
                        "width": "110px",
                        "template": "<span class='style-left'>{{formatTanggal('#: tglkeluar #')}}</span>"
                    } ,
                    {
                        "field": "kddiagnosa",
                        "title": "diagnosa",
                        "width": "80px",
                        "template": "# for(var i=0; i < kddiagnosa.length;i++){# <span class=\"label label-primary text-center\"> #= kendo.toString(kddiagnosa[i]) #</span> #}#",
                    },
                    {
                        "field": "reportdisplay",
                        "title": "Status Pulang",
                        "width": "80px",
                        "template": "<span class='style-left'>#: reportdisplay #</span>"
                    },                 
                ]
            };

            //** BATAS */
        }
    ]);
});