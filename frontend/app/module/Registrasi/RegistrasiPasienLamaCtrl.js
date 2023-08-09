define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('RegistrasiPasienLamaCtrl', ['MedifirstService', 'CacheHelper', '$scope', 'DateHelper', '$state', 'ModelItem', '$mdDialog','$rootScope',
        function (medifirstService, cacheHelper, $scope, DateHelper, $state, ModelItem, $mdDialog, $rootScope) {
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
            $scope.item.Rows = 100;
            $scope.Page = {
                refresh: true,
                pageSizes: true,
                buttonCount: 5
            }
            var dRiwayatReg = []
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

                //batal registrasi otomatis jika dalam 24 jam tidak ada pelayanan

                // medifirstService.get("registrasi/get-pasien-batal-registrasi").then(function (data) {
                //     for(var i =0; i < data.data.data.length; i++){
                //         var item = {
                //             pasiendaftarfk: data.data.data[i].norec,
                //         }
                //         console.log(item)
                //         medifirstService.post('registrasi/posting-batal-registrasi', item).then(function (e) {
                //             loadData();
                //         })
                //     }
                // });
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
                    tglLahirs = "&tglLahir=" + DateHelper.formatDate($scope.item.tglLahir, 'YYYY-MM-DD');
                }
                var inaktif = ""
                if ($scope.item.inaktif == true) {
                    inaktif = "&inaktif=" + $scope.item.inaktif;
                }
                var rmhilang = ""
                if ($scope.item.rmhilang == true) {
                    rmhilang = "&rmhilang=" + $scope.item.rmhilang;
                }
                medifirstService.get("registrasi/get-pasien?" +
                    nik +
                    tglLahirs +
                    rm +
                    pasien +
                    ayah +
                    almat + bpjs +
                    Rows+inaktif+rmhilang)
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
                toolbar: [
                        "excel",

                    ],
                    excel: {
                        fileName: "DaftarRegistrasi.xlsx",
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

                        sheet.rows.splice(0, 0, {
                            cells: myHeaders,
                            type: "header",
                            height: 70
                        });
                    },
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
                    // {
                    //     "field": "photo",
                    //     "title": "Photo",
                    //     "width": "40px",
                    //     "template": '# if( photo!=null ) {# ✔ # } else {# - #} #'
                    //     // "template": "# if (photo) { #" +
                    //     //     "<i class='fa fa-user' style='color:grey' />" +
                    //     //     "# } else { # - # } #",
                    //     // "template": "<div class='photo-pasien'"+
                    //     // "style='background:url(#:data.photo#);'></div>"
                    // },
                    {
                        "field": "ihs_number",
                        "title": "SATUSEHAT Number",
                        "width": "80px",
                        "template": '# if( ihs_number==null) {# - # } else {# #= ihs_number # #} #'

                    },
                    {
                        "field": "iskompleks",
                        "title": "Kompleks",
                        "width": "50px",
                        "template": '# if( iskompleks==1 ) {# ✔ # } else {#  #} #'

                    },
                    {
                        "field": "sidik_jari",
                        "title": "Sidik Jari",
                        "width": "50px",
                       // "template": '# if( iskompleks==1 ) {# ✔ # } else {#  #} #'

                    },
                    {
                        "field": "isinaktif",
                        "title": "Inaktif",
                        "width": "50px",
                        "template": '# if( isinaktif==true ) {# ✔ # } else {#  #} #'
                    },
                    {
                        "field": "isrmhilang",
                        "title": "Inaktif",
                        "width": "50px",
                        "template": '# if( isrmhilang==true ) {# ✔ # } else {#  #} #'

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
                // if (dataPasienSelected.foto != null) {
                //     $scope.item.image = dataPasienSelected.foto
                //     $scope.popUpPhoto.center().open()

                // }
                $scope.isRouteLoading = true;
                let data = {
                    "url": "Patient?identifier=https://fhir.kemkes.go.id/id/nik|" + dataPasienSelected.noidentitas,
                    "method": "GET",
                    "data": null
                }
                medifirstService.postNonMessage("bridging/ihs/tools", data).then(function (e) {
                    $scope.isRouteLoading = false;
                    if(e.data.total> 0 && ( dataPasienSelected.ihs_number == '' ||  dataPasienSelected.ihs_number == null)){
                        let jsonSend = {
                            'id':dataPasienSelected.nocmfk,
                            'ihs_number':e.data.entry[0].resource.id
                        }
                        medifirstService.postNonMessage('bridging/ihs/update-ihs-pasien',jsonSend).then(function (z) {
                            loadData()
                        })
                    }
                }).then(function () {
                    $scope.isRouteLoading = false;
                });

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
            $scope.tglhariini = moment($scope.now).format('YYYY-MM-DD');

            $scope.RegistrasiPasien = function () {
                if($scope.dataPasienSelected.isinaktif == true){
                    toastr.error('Pasien Inaktif!')
                    return
                }
                var rm = "";
                if ($scope.nocm != undefined) {
                    rm = "norm=" + $scope.nocm;
                }
                var tglhariini = "";
                if ($scope.tglhariini != undefined) {
                    tglhariini = "&tglhariini=" + $scope.tglhariini;
                }
                
                medifirstService.get('registrasi/daftar-riwayat-registrasi1?' + rm + tglhariini)
                    .then(function (e) {
                        if ($scope.nocm == undefined) {
                            toastr.warning('Pilih data dulu!')
                            return
                        }

                        if ($scope.tglMeninggal != undefined) {
                            toastr.warning('Pasien Sudah Meninggal Tidak Bisa Didaftarkan, Peringatan !')
                            return
                        }
                        var strnotif = "";
                        for (let i = 0; i < e.data.daftar.length; i++) {
                            strnotif = strnotif + " Waktu Kunjungan: " + e.data.daftar[i].tglregistrasi + " & tujuan kunjungan: " + e.data.daftar[i].namaruangan + "<br>"
                        }


                        if (strnotif != "") {
                            var confirm = $mdDialog.confirm()
                                .title('Informasi')
                                .htmlContent("Pasien Sudah registrasi hari ini : <br> " + strnotif + "Apakah mau melanjutkan registrasi?")
                                .ariaLabel('Lucky day')
                                .cancel('Batal')
                                .ok('Ok');
                            $mdDialog.show(confirm).then(function () {
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
                            })
                        } else {
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
                    })

                // cacheHelper.set('cacheStatusPasien', 'LAMA');
                // if (!$scope.isPenunjang) {
                //     cacheHelper.set('isPenunjang', undefined);
                //     $state.go("UmVnaXN0cmFzaVJ1YW5nYW4=", {
                //         noCm: $scope.dataPasienSelected.nocmfk
                //     })
                //     var cacheSet = undefined;
                //     cacheHelper.set('CacheRegistrasiPasien', cacheSet);
                //     var cacheSetss = undefined;
                //     cacheHelper.set('CacheRegisOnline', cacheSetss);

                // } else {
                //     cacheHelper.set('isPenunjang', true);
                //     $state.go("UmVnaXN0cmFzaVJ1YW5nYW4=", {
                //         noCm: $scope.dataPasienSelected.nocmfk
                //     })
                //     var cacheSet = undefined;
                //     cacheHelper.set('CacheRegistrasiPasien', cacheSet);
                //     var cacheSetss = undefined;
                //     cacheHelper.set('CacheRegisOnline', cacheSetss);
                // }
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
                    var confirm = $mdDialog.confirm()
                        .title('Peringatan')
                        .htmlContent('Apakah Anda yakin ingin menghapus pasien tersebut')
                        .ariaLabel('Lucky day')
                        .cancel('Tidak')
                        .ok('Ya')
                    $mdDialog.show(confirm).then(function () {
                        var item = {
                            idpasien: $scope.idPasien
                        }
                        medifirstService.post('registrasi/update-false-pasien', item).then(function (e) {
                            loadData();
                        })
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
                groupable: true,
                columns: [
                    {
                        "command": [
                            {
                                text: "Condition",
                                click: ihsCondition,
                                imageClass: " fa fa-check"
                            },
                        ],
                        title: "",
                        width: "100px",
                    },
                    // {
                    //     "field": "no",
                    //     "title": "No",
                    //     "width": "40px",
                    // },
                    {
                        "field": "namaprofile",
                        "title": "Location",
                        "width": "150px"
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
                        "width": "100px"
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
                    },
                    {
                        "field": "ihs_encounter",
                        "title": "IHS Encounter",
                        "width": "200px"
                        // "template": "<span class='style-left'>{{formatTanggal('#: tglpulang #')}}</span>"
                    },
                ]
            };

            $scope.RiwayatRegistrasi = function () {
                if ($scope.dataPasienSelected == undefined) {
                    messageContainer.error("Pilih data dulu!")
                }
                $scope.itemD.IHS_PROFILE = $scope.dataPasienSelected.ihs_profile;
                $scope.itemD.noRM = $scope.dataPasienSelected.nocm;
                $scope.itemD.namaPasien = $scope.dataPasienSelected.namapasien;
                $scope.itemD.tglLahir = moment($scope.dataPasienSelected.tgllahir).format('DD-MM-YYYY');
                loadDataRiwayat();
                $scope.popUpRiwayatRegistrasi.center().open().maximize();
                // var actions = $scope.popUpRiwayatRegistrasi.options.actions;
                // actions.splice(actions.indexOf("Close"), 1);
                // $scope.popUpRiwayatRegistrasi.setOptions({ actions: actions });
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
                
                dRiwayatReg = []
                medifirstService.get("registrasi/daftar-riwayat-registrasi?" +
                    tglLahirs + rm + noReg + pasien)
                    .then(function (data) {
                        $scope.isRouteLoading = false;
                        var jumlahRawat = 0;
                        dRiwayatReg = data.data.daftar;
                        for (var i = 0; i < dRiwayatReg.length; i++) {
                            dRiwayatReg[i].no = i + 1
                            dRiwayatReg[i].ihs_encounter=  "Encounter/" +  dRiwayatReg[i].ihs_encounter 
                            if (dRiwayatReg[i].statusinap == 1) {
                                jumlahRawat = jumlahRawat + 1;
                                if (dRiwayatReg[i].tglpulang != undefined) {
                                    dRiwayatReg[i].lamarawat = dRiwayatReg[i].lamarawat + " Hari";
                                    console.log(dRiwayatReg[i].lamarawat);
                                } else {
                                    var umur = DateHelper.CountAge(new Date(dRiwayatReg[i].tglregistrasi), new Date($scope.now));
                                    var bln = umur.month,
                                        thn = umur.year,
                                        day = umur.day
                                    dRiwayatReg[i].lamarawat = day + " Hari";
                                }
                            } else{
                                dRiwayatReg[i].lamarawat = ''
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
                    $scope.isRouteLoading = true
                    asyncIHS()
                    $scope.isRouteLoading = false
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
                    .htmlContent('Apakah Anda yakin menggabungkan No RM ' + $scope.item.rmAsal + ' Ke ' + $scope.item.rmTujukan + ' ?!')
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
            $scope.ihsTools = function(dataItem){
                let data = {
                    "url":dataItem.ihs_encounter,
                    "method": "GET",
                    "data": null
                }
                $scope.isRouteLoading = true;
                medifirstService.postNonMessage("bridging/ihs/tools", data).then(function (e) {
                    document.getElementById("jsonIHS").innerHTML = JSON.stringify(e.data, undefined, 4);
                    $scope.isRouteLoading = false;
                    $scope.popUpJson.center().open().maximize();
                }).then(function () {
                    $scope.isRouteLoading = false;
                });
            }
            function sendIHS(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                let data = {
                    "url":dataItem.ihs_encounter,
                    "method": "GET",
                    "data": null
                }
                $scope.isRouteLoading = true;
                medifirstService.postNonMessage("bridging/ihs/tools", data).then(function (e) {
                    document.getElementById("jsonIHS").innerHTML = JSON.stringify(e.data, undefined, 4);
                    $scope.isRouteLoading = false;
                    $scope.popUpJson.center().open().maximize();
                }).then(function () {
                    $scope.isRouteLoading = false;
                });
            }
            function ihsCondition(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                let data = {
                    "url": "Condition?encounter=" + dataItem.ihs_encounter,
                    "method": "GET",
                    "data": null
                }
                $scope.isRouteLoading = true;
                $scope.sourceCondition = new kendo.data.DataSource({
                    data: [],
                })
                medifirstService.postNonMessage("bridging/ihs/tools", data).then(function (e) {
                    if(e.data.total == 0){
                        toastr.info('Data Not Found')
                        return
                    }
                    for (let x = 0; x < e.data.entry.length; x++) {
                        const element = e.data.entry[x];
                        element.no = x + 1
                    }
                    $scope.sourceCondition = new kendo.data.DataSource({
                        data: e.data.entry,
                        pageSize: 10,
                        total: e.data.entry.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                }
                            }
                        }
                    });
                    $scope.isRouteLoading = false;
                    $scope.popCondition.center().open()
                }).then(function () {
                    $scope.isRouteLoading = false;
                });
            }
            $scope.tutupCond = function(){
                $scope.popCondition.close()
            }
            $scope.columnCond = {
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "List.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:K1"];
                    sheet.name = "List";

                    var myHeaders = [{
                        value: "Condition",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",

                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                pageable: true,
                sortable: true,
                resizable: true,
                columns: [{
                    "field": "no",
                    "title": "No",
                    "width": "23px",
                    "attributes": { align: "center" }

                },

                // {
                //     "field": "resourceType",
                //     "title": "Resource Type",
                //     "width": "100px"
                // },
                {
                    "field": "resource.id",
                    "title": "ID",
                    "width": "100px"
                },
                {
                    "field": "resource.subject.display",
                    "title": "Subject Display",
                    "width": "200px"
                },
                {
                    "field": "resource.subject.reference",
                    "title": "Subject Reff",
                    "width": "150px"
                },
                {
                    "field": "resource.encounter.reference",
                    "title": "Encounter",
                    "width": "100px"
                },

                {
                    "field": "resource.code.coding[0].code",
                    "title": "Condition Code",
                    "width": "80px"
                },
                {
                    "field": "resource.code.coding[0].display",
                    "title": "Condition Display",
                    "width": "80px"
                },
                {
                    "field": "resource.category[0].coding[0].display",
                    "title": "Category",
                    "width": "80px"
                },

                {
                    "command": [
                        {
                            text: "IHS",
                            click: sendIHS2,
                            imageClass: " fa fa-check"
                        }],
                    title: "",
                    width: "80px",
                }

                ]
            };
            function sendIHS2(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                let data = {
                    "url": "Condition/" + dataItem.resource.id,
                    "method": "GET",
                    "data": null
                }
                $scope.isRouteLoading = true;
                medifirstService.postNonMessage("bridging/ihs/tools", data).then(function (e) {
                    document.getElementById("jsonIHS").innerHTML = JSON.stringify(e.data, undefined, 4);
                    $scope.isRouteLoading = false;
                    $scope.popUpJson.center().open().maximize();
                }).then(function () {
                    $scope.isRouteLoading = false;
                });
            }
            // function asyncIHS (){
                const asyncIHS = async () => {
                    $scope.isRouteLoading =true
                    let json = {
                        "url": "Encounter?subject=Patient/" + $scope.dataPasienSelected.ihs_number,
                        "method": "GET",
                        "data": null
                    }
                    const xx = {
                        data : {}
                    }
                    
                    var response = await  medifirstService.postNonMessage("bridging/ihs/tools", json)
                    xx.data = response.data
                    // .then(async function (response) {
                    //     xx.data =  response.data
                    // })
                    // const response = await fetch(configuration.baseApiBackend + 'bridging/ihs/tools',{
                    //         method: 'POST',
                    //         headers: {
                    //         'Content-Type': 'application/json'
                    //         },
                    //         body: JSON.stringify(json)
                    //     }
                    // )
              
                    var datas = [];
                    var zzz= 0
                    for (var i = xx.data.total - 1; i >= 0; i--) {
                        var dot = xx.data.entry[i]
                        if(zzz<=10){
                                datas.push(dot)
                        }
                        // if (new Date(dot.resource.period.start) >= new Date(moment(new Date()).format('YYYY-MM-DD 00:00')) 
                        // &&  new Date(dot.resource.period.start)  <= new Date(moment(new Date()).format('YYYY-MM-DD 23:59'))  ) {
                        
                        // }
                        zzz =zzz+1
                    }
                    // medifirstService.postNonMessage("bridging/ihs/tools", json).then(function (xx) {
                    if(datas.length > 0){
                        for (let z = 0; z <datas.length; z++) {
                            const elementxx = datas[z];
                            var element =  elementxx.resource
                            let org_ID = []
                            if(element.serviceProvider!=undefined){
                                org_ID =  element.serviceProvider.reference.split('/')
                            }
                        
                            if(org_ID.length > 0 && $scope.itemD.IHS_PROFILE != org_ID[1]){
                                element.ihs_encounter =  "Encounter/" + element.id 
                                element.practice = ''
                                if (element.participant != undefined && element.participant.length>0 && element.participant[0].individual!= undefined && element.participant[0].individual.reference) {
                                    element.practice = element.participant[0].individual.reference
                                }
                                var tglpulang = ''
                                var tglregis = ''
                                if(element.statusHistory !=undefined){


                                for (let u = 0; u <  element.statusHistory.length; u++) {
                                    const element2 =  element.statusHistory[u];
                                        if(element2.status == 'finished'){
                                            tglpulang = element2.period.end
                                        
                                        }
                                        if(element2.status == 'arrived'){
                                            tglregis = element2.period.start
                                        }
                                    }
                                }
                                if(tglregis == ''){
                                    if(element.period.start!=undefined){
                                        tglregis = element.period.start
                                    }
                                }
                                if(tglpulang == ''){
                                    if(element.period.end!=undefined){
                                        tglpulang =  element.period.end
                                    }
                                }
                                let jsonAPI = {
                                    "url": "Organization/"+ org_ID[1],
                                    "method": "GET",
                                    "data": null
                                }
                                let responsex =  await medifirstService.postNonMessage("bridging/ihs/tools", jsonAPI)
                                const   dataRes  =  responsex.data
                             
                          
                                // const responsex = await fetch(configuration.baseApiBackend + 'bridging/ihs/tools',{
                                //     method: 'POST',
                                //     headers: {
                                //     'Content-Type': 'application/json'
                                //     },
                                //     body: JSON.stringify(jsonAPI)
                                // })
                                // const dataRes = await responsex.json()

                                let dokter = '';
                                if(element.practice !=undefined && element.practice !=''){
                                    let jsonAPI = {
                                        "url": element.practice,
                                        "method": "GET",
                                        "data": null
                                    }
                                    let responseDOKTER =  await medifirstService.postNonMessage("bridging/ihs/tools", jsonAPI)
                                    const resDok  =  responseDOKTER.data
                                
                              
                                    // const responseDOKTER = await fetch(configuration.baseApiBackend + 'bridging/ihs/tools',{
                                    //     method: 'POST',
                                    //     headers: {
                                    //     'Content-Type': 'application/json'
                                    //     },
                                    //     body: JSON.stringify(jsonAPI)
                                    // })
                                    // const resDok = await responseDOKTER.json()
                            
                                    if(resDok.resourceType == 'Practitioner'){
                                        if(resDok.name!=undefined &&  resDok.name.length >0 
                                        && resDok.name[0].text!=undefined){
                                            dokter = resDok.name[0].text
                                        }
                                    }
                                }
                                dRiwayatReg.push({
                                    no: dRiwayatReg.length +1 ,
                                    kelompokpasien: "",
                                    namadokter:dokter,
                                    namapasien:element.subject.display,
                                    namaruangan: element.location[0].location.display,
                                    nocm: '',
                                    ihs_id:  element.subject.reference,
                                    norec: "-",
                                    noregistrasi: element.id,
                                    objectdepartemenfk: '',
                                    objectpegawaifk: '',
                                    objectruanganlastfk: '',
                                    statusinap: element.class.code == 'AMB'? 0:1,
                                    tglpulang: tglpulang,
                                    tglregistrasi: tglregis,
                                    ihs_encounter: "Encounter/" + element.id,
                                    namaprofile: dataRes.name,
                                })
                                // });
                            }
                        }
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
                        var grid = $('#kGriddataRiwayatRegistrasi').data("kendoGrid");

                        // grid.setDataSource($scope.dataRiwayatRegistrasi);
                        grid.refresh();
                      
                    }
                    $scope.isRouteLoading =false
                    // })
                }
                $scope.klikIHSEncounter = function(e){
                    if(e.encounter_id == undefined)return
                    $scope.isRouteLoading = true;
                    let data = {
                        "url": e.encounter_id,
                        "method": "GET",
                        "data": null
                    }
                    medifirstService.postNonMessage("bridging/ihs/tools", data).then(function (e) {
                        document.getElementById("jsonIHS").innerHTML = JSON.stringify(e.data, undefined, 4);
                        $scope.isRouteLoading = false;
                        $scope.popUpJson.center().open().maximize();
                    }).then(function () {
                        $scope.isRouteLoading = false;
                    });
                }

           $scope.riwayatSatusehat = function(){
                if($scope.dataPasienSelected == undefined)return 
                if($scope.dataPasienSelected.ihs_number == null){
                    toastr.error('Ihs id belum ada')
                    return
                } 
                $state.go('HistorySatuSehat', {
                    ihs_number: $scope.dataPasienSelected.ihs_number ,
                })

           } 
           $scope.ubahNoRM = function () {
               if ($scope.dataPasienSelected == undefined) {
                   toastr.error("Pilih data dulu!")
               }
               medifirstService.get('registrasi/get-nocm-terakhir').then(function (e) {
                   $scope.item.rmBaru = e.data.nocm
                   $scope.item.nocmrunning = e.data.nocmrunning

                   $scope.popUpRM.center().open()
               })

           }
           $scope.saveRM = function () {

               var confirm = $mdDialog.confirm()
                   .title('Info')
                   .textContent('Yakin mau mengubah NO RM?')
                   .ariaLabel('Lucky day')
                   .cancel('Tidak')
                   .ok('Ya')
               $mdDialog.show(confirm).then(function () {

                   let json = {
                       'id': $scope.dataPasienSelected.nocmfk,
                       'nocm': $scope.dataPasienSelected.nocm,
                       'nocmbaru': $scope.item.rmBaru,
                       'nocmrunning': $scope.item.nocmrunning

                   }
                   $scope.isSaves = true
                   medifirstService.post('registrasi/update-nocm', json).then(function (e) {
                       medifirstService.get('api/trigger-telemedicine?nocm=' + $scope.item.rmBaru).then(function (res) {})

                       // loadData()
                       $scope.isSaves = false
                       $scope.dataPasienSelected.nocm = e.data.nocm
                       delete $scope.item.rmBaru
                       delete $scope.item.nocmrunning
                       $scope.popUpRM.close()
                   }, function (error) {
                       $scope.isSaves = false
                   })
               })

           }
            $scope.sudah = function (data) {
                if ($scope.dataPasienSelected == undefined) {
                    toastr.error('Pilih data dulu!')
                    return
                }
                var objSave = {
                    method: data,
                    nocm: $scope.dataPasienSelected.nocm
                }
                medifirstService.post('emr/save-sudah-sudahh', objSave).then(function () {
                    loadData()
                })
            }
            $scope.rmhilang = function () {
                if ($scope.dataPasienSelected == undefined) {
                    toastr.error('Pilih data dulu!')
                    return
                }
                var objSave = {
                    nocm: $scope.dataPasienSelected.nocm
                }
                medifirstService.post('emr/save-rmhilang', objSave).then(function () {
                    loadData()
                })
            }
            //** BATAS */
        }
        
    ]);
});