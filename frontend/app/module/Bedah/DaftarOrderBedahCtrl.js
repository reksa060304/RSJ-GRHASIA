define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DaftarOrderBedahCtrl', ['$q', '$rootScope', '$scope', '$state', 'CacheHelper', 'DateHelper', '$window', 'MedifirstService',
        function ($q, $rootScope, $scope, $state, cacheHelper, dateHelper, $window, medifirstService) {
            $scope.item = {};
            $scope.dataVOloaded = true;
            $scope.isRouteLoading = false;
            $scope.now = new Date();
            $scope.item.tglAwal = $scope.now;
            $scope.pegawai = JSON.parse(window.localStorage.getItem('pegawai'));
            $scope.item.tglAkhir = $scope.now;
            $scope.btnSimpanVis = false;
            $scope.item.belumVerifikasi = true;
            var loginRadiologi = false
            if ($scope.item.belumVerifikasi)
                $scope.cekBelumVerifs = true;
            else
                $scope.cekBelumVerifs = false;

            $scope.cekbelumVerifikasi = function (data) {
                if (data === true) {
                    $scope.cekBelumVerifs = true;
                } else if (data === false || data === undefined) {
                    $scope.cekBelumVerifs = false;
                } else {
                    return;
                }
            }
            $scope.item.jmlRow = 100
            $scope.selected = function (data) {
                $scope.dataSelected = data;
                medifirstService.get("registrasi/daftar-registrasi/get-acc-number-radiologi?noOrder=" + $scope.dataSelected.noorder)
                    .then(function (e) {
                        $scope.dataRisOrder = e.data.data[0]
                    })
                medifirstService.get("registrasi/daftar-registrasi/get-apd?noregistrasi=" + $scope.dataSelected.noregistrasi
                    + "&noorder=" + $scope.dataSelected.noorder + "&idruangan=" + $scope.dataSelected.objectruangantujuanfk).then(function (e) {
                        $scope.norec_apd = $scope.norec_apd = e.data.ruangan[0].norec_apd
                    })
            }


            LoadCache();
            loadCombo();
            function LoadCache() {
                var chacePeriode = cacheHelper.get('DaftarPasienLaboratoriumCtrl');
                if (chacePeriode != undefined) {
                    //var arrPeriode = chacePeriode.split(':');
                    $scope.item.tglAwal = new Date(chacePeriode[0]);
                    $scope.item.tglAkhir = new Date(chacePeriode[1]);
                    $scope.item.namaPasien = chacePeriode[2];
                    $scope.item.noMr = chacePeriode[3];
                    $scope.item.noReg = chacePeriode[4];

                    init();
                }
                else {
                    $scope.item.tglAwal = $scope.now;
                    $scope.item.tglAkhir = $scope.now;
                    init();
                }
            }
            function loadCombo() {
                var datauserlogin = JSON.parse(window.localStorage.getItem("datauserlogin"));
                $scope.KelompokUser = medifirstService.getKelompokUser(); 
                if ($scope.KelompokUser == 'bedah')/* KEl USER ITI*/ {
                    loginRadiologi = true
                }
                // medifirstService.get("pegawai/get-kelompok-user?luId=" + datauserlogin.id, true).then(function (e) {
                //     if (e.data.data.kelompokuser.indexOf('bedah') > -1)/* KEl USER ITI*/ {
                //         loginRadiologi = true
                //     }

                // })
                medifirstService.get("radiologi/get-combo-regis", true).then(function (dat) {
                    $scope.listDepartemen = dat.data.departemen;
                    $scope.listKelompokPasien = dat.data.kelompokpasien;                    
                });
                medifirstService.getPart("sysadmin/general/get-combo-pegawai", true, true, 20).then(function (data) {
                    $scope.listDokter = data
                })
            }
            function init() {
                $scope.isRouteLoading = true;
                var ins = ""
                if ($scope.item.instalasi != undefined) {
                    var ins = "&deptId=" + $scope.item.instalasi.id
                }
                var rg = ""
                if ($scope.item.ruangan != undefined) {
                    var rg = "&ruangId=" + $scope.item.ruangan.id
                }
                var kp = ""
                if ($scope.item.kelompokPasien != undefined) {
                    var kp = "&kelId=" + $scope.item.kelompokPasien.id
                }
                var dok = ""
                if ($scope.item.dokter != undefined) {
                    var dok = "&pegId=" + $scope.item.dokter.id
                }

                var reg = ""
                if ($scope.item.noReg != undefined) {
                    var reg = "&noregistrasi=" + $scope.item.noReg
                }
                var rm = ""
                if ($scope.item.noMr != undefined) {
                    var rm = "&nocm=" + $scope.item.noMr
                }
                var nm = ""
                if ($scope.item.namaPasien != undefined) {
                    var nm = "&namapasien=" + $scope.item.namaPasien
                }
                var noOrderan = ""
                if ($scope.item.noOrderCari != undefined) {
                    var noOrderan = "&noOrders=" + $scope.item.noOrderCari
                }
                var isNotVerif = ""
                if ($scope.item.belumVerifikasi) {
                    var isNotVerif = "isNotVerif=" + true
                    var jmlRow = ""
                    if ($scope.item.jmlRow) {
                        jmlRow = "&jmlRow=" + $scope.item.jmlRow
                    }
                }
                var jmlRow = ""
                if ($scope.item.jmlRow) {
                    jmlRow = "&jmlRow=" + $scope.item.jmlRow
                }

                var tglAwal = ""
                var tglAkhir = ""
                if ($scope.cekBelumVerifs == false) {
                    tglAwal = "&tglAwalOperasi=" + moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                    tglAkhir = "&tglAkhirOperasi=" + moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                }
                medifirstService.get("radiologi/get-daftar-order?" +
                    isNotVerif + tglAwal + tglAkhir + reg + rm + nm +
                    ins + rg + kp + dok + noOrderan + jmlRow, true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        for (var i = 0; i < dat.data.data.length; i++) {
                            dat.data.data[i].no = i + 1
                            var tanggal = $scope.now;
                            var tanggalLahir = new Date(dat.data.data[i].tgllahir);
                            var umur = dateHelper.CountAge(tanggalLahir, tanggal);
                            dat.data.data[i].umur = umur.year + ' thn ' + umur.month + ' bln ' + umur.day + ' hari'
                        }
                        var data = dat.data.data
                        var Warnaku = [];
                        for (var i = 0; i < dat.data.data.length; i++) {
                            switch (data[i].status) {
                                case "MASUK":
                                    data[i].myStyle = { 'background-color': '#606572', 'color': '#F0FFFF' };
                                    break;
                                case "SELESAI DIPERIKSA":
                                    data[i].myStyle = { 'background-color': '#3CB27A', 'color': '#F0FFFF' };
                                    break;
                                case "DIPANGGIL_SUSTER":
                                    data[i].myStyle = { 'background-color': '#FF0000', 'color': '#F0FFFF' };
                                    break;
                            }
                        }
                        $scope.listDataPasien =
                            new kendo.data.DataSource({
                                data: data
                            });
                        $scope.listDataPasien.fetch(function (e) {
                            var temp = [];
                            for (var key in this._data) {
                                if (this._data.hasOwnProperty(key)) {
                                    var element = this._data[key];
                                    if (angular.isFunction(element) === false && key !== "_events" && key !== "length")
                                        temp.push(element);
                                }
                            }
                            $scope.listPasien = temp;
                            cacheHelper.set('listBedahSentral', temp);
                        });
                    });
            }

            $scope.getRuangan = function () {
                $scope.listRuangan = $scope.item.instalasi.ruangan;
            }

            $scope.cariFilter = function () {
                init();
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir,
                    2: $scope.item.namaPasien,
                    3: $scope.item.noMr,
                    4: $scope.item.noReg,
                    5: '',
                    6: ''
                }
                cacheHelper.set('DaftarPasienLaboratoriumCtrl', chacePeriode);
            }

            $scope.editOrder = function () {
                if ($scope.dataSelected.status == 'SELESAI DIPERIKSA') {
                    toastr.error('Data Sudah Di Verifikasi');
                    return
                }

                var arrStr = {
                    0: $scope.dataSelected.nocm,
                    1: $scope.dataSelected.namapasien,
                    2: $scope.dataSelected.jeniskelamin,
                    3: $scope.dataSelected.noregistrasi,
                    4: $scope.dataSelected.umur,
                    5: $scope.dataSelected.objectkelasfk,
                    6: $scope.dataSelected.namakelas,
                    7: $scope.dataSelected.tglregistrasi,
                    8: $scope.dataSelected.norec,
                    9: $scope.dataSelected.namaruangan,
                    10: $scope.dataSelected.objectruanganfk,
                    11: $scope.dataSelected.norec_pd,
                    12: $scope.dataSelected.norec_so,
                    13: $scope.dataSelected.kelompokpasien
                }
                cacheHelper.set('editOrderCache', arrStr);
                $state.go('TransaksiPelayananLabRad')
            }

            $scope.columnGrid = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "30px",
                },

                {
                    "field": "noorder",
                    "title": "No Order",
                    "width": "120px",
                },
                {
                    "field": "tglorder",
                    "title": "Tgl Order",
                    "width": "120px",
                    "template": "<span class='style-center'>{{formatTanggal('#: tglorder #')}}</span>"
                },
                {
                    "field": "noregistrasi",
                    "title": "No Registrasi",
                    "width": "100px",
                },
                {
                    "field": "nocm",
                    "title": "No MR",
                    "width": "70px",
                },
                {
                    "field": "namapasien",
                    "title": "Nama Pasien",
                    "width": "150px",
                },
                {
                    "field": "namaruangan",
                    "title": "Ruangan Order",
                    "width": "130px",
                },
                {
                    "field": "ruangantujuan",
                    "title": "Ruangan Tujuan",
                    "width": "130px",
                },
                {
                    "field": "dpjp",
                    "title": "Dokter Pengirim",
                    "width": "100px"
                },
                {
                    "field": "pegawaiorder",
                    "title": "Pengorder",
                    "width": "100px"
                },
                {
                    "field": "tglpelayananakhir",
                    "title": "Tgl Operasi",
                    "width": "100px",
                    "template": "<span class='style-center'>{{formatTanggal('#: tglpelayananakhir #')}}</span>"
                }
            ];
            $scope.data2 = function (dataItem) {
                for (var i = 0; i < dataItem.details.length; i++) {
                    dataItem.details[i].no = i + 1

                }
                return {
                    dataSource: new kendo.data.DataSource({
                        data: dataItem.details,

                    }),
                    columns: [
                        {
                            "field": "tglpelayanan",
                            "title": "Tgl Pelayanan",
                            "width": "50px",
                            "template": "<span class='style-center'>{{formatTanggal('#: tglpelayanan #')}}</span>"
                        },
                        {
                            "field": "namaproduk",
                            "title": "Layanan",
                            "width": "150px",

                        },
                        {
                            "field": "qtyproduk",
                            "title": "Jumlah",
                            "width": "50px",

                        }

                    ]
                }
            };

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }
            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MM-YYYY HH:mm');
            }

            function itungUsia(tgl) {
                var tanggal = $scope.now;
                var tglLahir = new Date(tgl);
                var selisih = Date.parse(tanggal.toGMTString()) - Date.parse(tglLahir.toGMTString());
                var thn = Math.round(selisih / (1000 * 60 * 60 * 24 * 365));
                return thn + ' thn '// + bln + ' bln'
            }


            $scope.LihatHasil = function (data) {
                if ($scope.dataSelected == undefined) {
                    toastr.error('Pilih data dulu');
                    return
                }
                if (loginRadiologi == true) {
                    if ($scope.dataRisOrder != undefined) {
                        $window.open("http://182.23.26.34:1111/URLCall.do?LID=dok&LPW=dok&LICD=003&PID=" + $scope.dataRisOrder.patient_id
                            + '&ACN=' + $scope.dataRisOrder.accession_num, "_blank");
                    } else {
                        toastr.info('Hasil Radiologi belum ada')
                    }
                } else {
                    if ($scope.norec_apd != undefined) {
                        var arrStr = {
                            0: $scope.dataSelected.nocm,
                            1: $scope.dataSelected.namapasien,
                            2: $scope.dataSelected.jeniskelamin,
                            3: $scope.dataSelected.noregistrasi,
                            4: $scope.dataSelected.umur,
                            5: $scope.dataSelected.kelompokpasien,
                            6: $scope.dataSelected.tglregistrasi,
                            7: $scope.norec_apd,
                            8: $scope.dataSelected.norec_pd,
                            9: $scope.dataSelected.objectkelasfk,
                            10: $scope.dataSelected.namakelas,
                            11: $scope.dataSelected.objectruanganfk,
                            12: $scope.dataSelected.namaruangan
                        }
                        cacheHelper.set('TransaksiPelayananLaboratoriumDokterRevCtrl', arrStr);
                        $state.go('HasilLaboratorium', {
                            norecPd: $scope.dataSelected.norec_pd,
                            noOrder: $scope.dataSelected.noorder,
                            norecApd: $scope.norec_apd
                        })
                    } else {
                        toastr.info('Hasil Lab belum ada')
                    }

                }

            }

            $scope.verifikasi = function () {
                // isCheckAll = false
                if ($scope.dataSelected == undefined) {
                    toastr.error('Pilih data dulu');
                    return
                }
                if ($scope.dataSelected.status == 'SELESAI DIPERIKSA') {
                    toastr.error('Data Sudah Di Verifikasi');
                    return
                }
                $scope.item.noOrder = $scope.dataSelected.noorder;
                $scope.item.namaPasiens = $scope.dataSelected.namapasien;
                $scope.item.dokterOrder = { id: $scope.dataSelected.objectpegawaiorderfk, namalengkap: $scope.dataSelected.pegawaiorder };
                $scope.item.tglOperasi = $scope.dataSelected.tglpelayananakhir;
                $scope.popUpVerif.center().open();
                loadDataVerif();

            }
            function loadDataVerif() {
                medifirstService.get("radiologi/get-order-pelayanan?norec_so=" + $scope.dataSelected.norec_so
                    + "&objectkelasfk=" + $scope.dataSelected.objectkelasfk, true).then(function (dat) {

                        var dataSource = dat.data.data;
                        for (var i = 0; i < dataSource.length; i++) {
                            dataSource[i].statCheckbox = false;
                            dataSource[i].no = i + 1
                        }

                        $scope.sourceVerif = new kendo.data.DataSource({
                            data: dataSource,
                            pageSize: 10,
                            total: dataSource.length,
                            serverPaging: false,

                        });

                    });
            }
            $scope.columnVerif = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "30px",
                },
                {
                    "field": "tglpelayanan",
                    "title": "Tgl Pelayanan",
                    "width": "90px",
                },
                {
                    "field": "namaproduk",
                    "title": "Layanan",
                    "width": "160px",
                },
                {
                    "field": "qtyproduk",
                    "title": "Jumlah",
                    "width": "40px",
                },
                {
                    "field": "ruangantujuan",
                    "title": "Ruangan Tujuan",
                    "width": "140px"
                },


            ];

            $scope.selectRow = function (dataItem) {

                var dataSelect = _.find($scope.sourceVerif._data, function (data) {
                    return data.prid == dataItem.prid;
                });

                if (dataSelect.statCheckbox) {
                    dataSelect.statCheckbox = false;
                }
                else {
                    dataSelect.statCheckbox = true;
                }

                $scope.tempCheckbox = dataSelect.statCheckbox;

                reloadDataGrid($scope.sourceVerif._data);

            }
            var isCheckAll = false
            $scope.selectUnselectAllRow = function () {
                var tempData = $scope.sourceVerif._data;

                if (isCheckAll) {
                    isCheckAll = false;
                    for (var i = 0; i < tempData.length; i++) {
                        tempData[i].statCheckbox = false;
                    }
                }
                else {
                    isCheckAll = true;
                    for (var i = 0; i < tempData.length; i++) {
                        tempData[i].statCheckbox = true;
                    }
                }

                reloadDataGrid(tempData);
            }

            function reloadDataGrid(ds) {
                var newDs = new kendo.data.DataSource({
                    data: ds,
                    pageSize: 10,
                    total: ds.length,
                    serverPaging: false,

                });
                var grid = $('#kGrids').data("kendoGrid");

                grid.setDataSource(newDs);
                grid.refresh();
            }

            $scope.batalVerif = function () {
                $scope.popUpVerif.close();
            }

            $scope.simpanVerifikasi = function () {
                if ($scope.item.dokterVerif == undefined) {
                    toastr.error('Dokter Verifikasi harus di isi')
                    return
                }
                var dataPost = [];
                for (var i = 0; i < $scope.sourceVerif._data.length; i++) {
                    // if($scope.sourceVerif._data[i].statCheckbox){
                    var datasys = {
                        "produkid": $scope.sourceVerif._data[i].prid,
                        "hargasatuan": $scope.sourceVerif._data[i].hargasatuan,
                        "qtyproduk": $scope.sourceVerif._data[i].qtyproduk,
                        "komponenharga": $scope.sourceVerif._data[i].details,
                    }
                    dataPost.push(datasys)
                    // }
                }
                var norec_pp = ''
                if ($scope.sourceVerif._data[0].norec_pp != null) {
                    norec_pp = $scope.sourceVerif._data[0].norec_pp
                }

                var itemsave = {
                    "bridging": dataPost,
                    "norec_pp": norec_pp,
                    "noorder": $scope.item.noOrder,
                    "norec_so": $scope.dataSelected.norec_so,
                    "objectkelasfk": $scope.dataSelected.objectkelasfk,
                    "norec_pd": $scope.dataSelected.norec_pd,
                    "objectruangantujuanfk": $scope.dataSelected.objectruangantujuanfk,
                    "objectpegawaiorderfk": $scope.dataSelected.objectpegawaiorderfk,
                    "iddokterverif": $scope.item.dokterVerif.id,
                    "namadokterverif": $scope.item.dokterVerif.namalengkap,
                    "iddokterorder": $scope.item.dokterOrder.id,
                    "namadokterorder": $scope.item.dokterOrder.namalengkap,
                    "tgloperasi": moment($scope.item.tglOperasi).format('YYYY-MM-DD HH:mm'),
                    "pegawaifk": $scope.item.dokterOperasi.id
                }

                if (dataPost.length > 0) {
                    $scope.btnSimpanVis = true;
                    var departemen = $scope.sourceVerif._data[0].objectdepartemenfk;
                    if (departemen == 3) {/*lab */
                        // manageServicePhp.saveBridingSysmex(itemsave)
                        //     .then(function (e) {
                        //     });                       
                    } else if (departemen == 27) {
                        // manageServicePhp.saveBrigdingZeta(itemsave)
                        //     .then(function (e) {
                        //     });
                    }

                    medifirstService.post('bedah/save-pelayanan-pasien-bedah',itemsave)
                        .then(function (e) {
                            $scope.btnSimpanVis = false;
                            $scope.popUpVerif.close();
                            init()

                        });
                }
                else {
                    toastr.error('Belum ada data yang dipilih');
                }
            }

            $scope.hapusTindakan = function () {
                if ($scope.dataSelectedVerif == undefined) {
                    toastr.error('Pilih data dahulu!');
                    return;
                }

                var objDelete = {
                    "norec_op": $scope.dataSelectedVerif.norec_op,
                    "norec_so": $scope.dataSelected.norec_so,
                };

                medifirstService.post('bedah/delete-verif-bedah',objDelete).then(function (e) {
                    $scope.popUpVerif.close();   
                    init()
                });

            }

            var HttpClient = function () {
                this.get = function (aUrl, aCallback) {
                    var anHttpRequest = new XMLHttpRequest();
                    anHttpRequest.onreadystatechange = function () {
                        if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                            aCallback(anHttpRequest.responseText);
                    }

                    anHttpRequest.open("GET", aUrl, true);
                    anHttpRequest.send(null);
                }
            }

            $scope.cetakBuktiLayanan = function () {
                if ($scope.dataSelected != undefined && $scope.norec_apd != null) {
                    if ($scope.dataSelected.status != 'SELESAI DIPERIKSA') {
                        toastr.error('Pilih pasien yang sudah di verifikasi')
                        return
                    }
                    var stt = 'false'
                    if (confirm('View Bukti Layanan? ')) {
                        // Save it!
                        stt = 'true';
                    } else {
                        // Do nothing!
                        stt = 'false'
                    }
                    var client = new HttpClient()
                    client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-buktilayanan-ruangan=1&norec=' +
                        $scope.dataSelected.noregistrasi + '&strIdPegawai=' + $scope.pegawai.id + '&strIdRuangan=' +
                        $scope.dataSelected.objectruanganfk + '&view=' + stt, function (response) {
                        });

                }
            }

            //********************************  $scope.cekBelumVerifs=true;***

        }
    ]);
});
