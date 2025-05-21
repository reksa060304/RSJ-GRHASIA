define(['initialize', 'Configuration'], function (initialize, config) {
    'use strict';
    initialize.controller('DaftarOrderAmbulanTelemedicineCtrl', ['$scope', '$state', 'CacheHelper', '$parse', 'DateHelper', '$window', 'MedifirstService',
        function ($scope, $state, cacheHelper, $parse, dateHelper, $window, medifirstService) {
            $scope.item = {};
            $scope.isRouteLoading = false;
            $scope.now = new Date();
            $scope.item.jumlah = 1
            $scope.item.QtyPerOrang = 1
            $scope.item.tglAwal = $scope.now;
            $scope.pegawai = JSON.parse(window.localStorage.getItem('pegawai'));
            $scope.item.tglAkhir = $scope.now;
            $scope.btnSimpanVis = false;
            $scope.headerVerif = {}
            var dataProduk = [];

            let dataOrder = []
            let data2 = []

            $scope.item.belumVerifikasi = true;
            if ($scope.item.belumVerifikasi)
                $scope.cekBelumVerifs = true;
            else
                $scope.cekBelumVerifs = false;

            $scope.cekbelumVerifikasi = function (data) {
                if (data === true) {
                    $scope.cekBelumVerifs = true;
                    init();
                } else if (data === false || data === undefined) {
                    $scope.cekBelumVerifs = false;
                    init();
                } else {
                    return;
                }
            }

            $scope.item.jmlRow = 100
            $scope.selected = function (data) {
                toastr.info('No Order : ' + data.nostruk + ' dipilih ', 'Info')
                $scope.dataSelected = data;
                
            }

            LoadCache();
            loadCombo();
            function LoadCache() {
                var chacePeriode = cacheHelper.get('DaftarPasienLaboratoriumCtrl');
                if (chacePeriode != undefined) {
                    $scope.item.tglAwal = new Date(chacePeriode[0]);
                    $scope.item.tglAkhir = new Date(chacePeriode[1]);
                    $scope.item.namaPasien = chacePeriode[2];
                    $scope.item.noMr = chacePeriode[3];
                    init();
                }
                else {
                    $scope.item.tglAwal = new Date(moment($scope.now).format('YYYY-MM-DD 00:00'));
                    $scope.item.tglAkhir = new Date(moment($scope.now).format('YYYY-MM-DD 23:59'));
                    init();
                }
            }
            function loadCombo() {
                var datauserlogin = JSON.parse(window.localStorage.getItem("datauserlogin"));
                medifirstService.get("ambulance/get-data-for-combo", true).then(function (dat) {
                    $scope.listDepartemen = dat.data.departemen;
                    $scope.listKelompokPasien = dat.data.kelompokpasien;
                    $scope.listJenisPetugasPe = dat.data.jenispetugaspe;
                    $scope.listRuangan = dat.data.ruanganpelayanan
                });

                medifirstService.getPart("sysadmin/general/get-combo-pegawai", true, true, 20).then(function (data) {
                    $scope.listPegawai = data;
                });

                medifirstService.get("ambulance/data/get-combo-telemedicine")
                    .then(function (da) {
    
                        $scope.listJenisKegiatan = new kendo.data.DataSource({
                            data: da.data.jeniskegiatan.map(function(item) {
                                return {
                                    id: item.id,
                                    namajeniskegiatan: item.namajeniskegiatan || item.namajeniskegiatan 
                                };
                            })
                        });
                        $scope.listDokter = da.data.dokter;
                        $scope.listPerawat = da.data.perawat;
                        $scope.listSupir = da.data.pegawai;
                        $scope.listAmbulan = da.data.nopol;
                        $scope.listVerifikasi = [
                            {id: 1, jenis: "Diterima"},
                            {id: 2, jenis: "Ditolak"}
                        ]
                    })
            }
            function init() {
                $scope.isRouteLoading = true;
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
                    tglAwal = "&tglAwal=" + moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                    tglAkhir = "&tglAkhir=" + moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                }

                medifirstService.get("ambulance/get-data-order-ambulan-dari-telemedicine?" +
                    isNotVerif +
                    tglAwal +
                    tglAkhir +
                    rm +
                    nm
                    + noOrderan
                    + jmlRow
                    , true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        
                        for (var i = 0; i < dat.data.data.length; i++) {
                            dat.data.data[i].no = i + 1
                        }

                        var data = dat.data.data
                        for (var i = 0; i < dat.data.data.length; i++) {
                            switch (data[i].status) {
                                case "MENUNGGU":
                                    data[i].myStyle = { 'background-color': '#606572', 'color': '#F0FFFF' };
                                    break;
                                case "DITERIMA":
                                    data[i].myStyle = { 'background-color': '#3CB27A', 'color': '#F0FFFF' };
                                    break;
                            }
                        }

                        $scope.listDataPasien = new kendo.data.DataSource({
                            data: data,
                            // group: $scope.group,
                            pageSize: 20,
                            total: data.length,
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
                cacheHelper.set('DaftarOrderAmbulanTelemedicineCtrl', chacePeriode);
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
                // {
                //     "field": "jeniskelamin",
                //     "title": "Jenis Kelamin",
                //     "width" : "70px",
                // },
                {
                    "field": "umur",
                    "title": "Umur",
                    "width": "100px"
                },
                {
                    "field": "pegawaiorder",
                    "title": "Pengorder",
                    "width": "100px"
                },
                // {
                //     "field": "kelompokpasien",
                //     "title": "Kelompok Pasien",
                //     "width" : "100px",
                // },

                // {
                //     "field": "namakelas",
                //     "title": "Nama Kelas",
                //     "width" : "80px",
                // },
                {
                    "field": "tglregistrasi",
                    "title": "Tgl Registrasi",
                    "width": "100px",
                    "template": "<span class='style-center'>{{formatTanggal('#: tglregistrasi #')}}</span>"
                },
                {
                    "field": "tglpulang",
                    "title": "Tgl Pulang",
                    "width": "100px",
                    "template": "<span class='style-center'>{{formatTanggal('#: tglpulang #')}}</span>"
                },
                // {
                //     "field": "",
                //     "title": "No Verifikasi",
                //     "width" : "120px",
                // },
            ];

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }
            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MM-YYYY HH:mm');
            }

            $scope.verifikasi = function () {
                if ($scope.dataSelected.status == "DITERIMA") {
                    toastr.error("Data Sudah diverifikasi tidak bisa di verifikasi kembali");
                    return;
                }

                if ($scope.dataSelected == undefined) {
                    toastr.error('Pilih data dulu');
                    return
                }
                
                $scope.btnSimpanVis = false
                $scope.headerVerif = $scope.dataSelected;
                $scope.item.noOrder = $scope.dataSelected.nostruk
                $scope.item.namaPasiens = $scope.dataSelected.namapasien

                $scope.popUpVerif.center().open();
                loadDataVerif();
            }
            function loadDataVerif() {
                $scope.isRouteLoading = true;
                data2 = []
                if (!$scope.popUp) {
                    $scope.popUp = {};
                }

                if (!$scope.popUp.kegiatan) {
                    $scope.popUp.kegiatan = $scope.listJenisKegiatan.data()[0] || {
                        id: 1,
                        namajeniskegiatan: "Menjemput Pasien"
                    };
                }

                $scope.$watch('popUp.kegiatan', function(newVal, oldVal) {
                    if (newVal !== oldVal) {
                        $scope.popUp.kegiatan = newVal;
                    }
                });

                medifirstService.get("ambulance/get-data-detail-order-ambulan-dari-telemedicine?norec=" + $scope.dataSelected.norec, true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        var dataSource = dat.data.data;
                        
                        for (var i = 0; i < dataSource.length; i++) {
                            dataSource[i].no = i + 1
                            data2.push(dataSource[i])
                        }

                        $scope.sourceVerif = new kendo.data.DataSource({
                            data: data2,
                            pageSize: 10,
                            total: data2.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                        hargatotal: { type: "number" }
                                    }
                                }
                            }, aggregate: [
                                { field: 'hargatotal', aggregate: 'sum' },
                            ]
                        });

                    });
            }

            // masukan data ke tabel verif
            $scope.columnVerif = {
                pageable: true,
                scrollable: true,
                columns : [
                    {
                        "field": "no",
                        "title": "No",
                        "width": "30px",
                    },
                    {
                        "field": "namaproduk",
                        "title": "Layanan",
                        "width": "200px",
                    },
                    {
                        "field": "qtyproduk",
                        "title": "Jumlah",
                        "width": "70px",
                    },
                    {
                        "field": "hargasatuan",
                        "title": "Harga",
                        "width": "140px"
                    },
                    {
                        "field": "hargatotal",
                        "title": "Total",
                        "width": "90px"
                    },
                ]
            }

            $scope.batalVerif = function () {
                $scope.popUpVerif.close();
                ClearIsian();
            }

            $scope.simpanVerifikasi = function () {
                if ($scope.popUp == undefined || $scope.popUp == '' || $scope.popUp == null) {
                    toastr.error('Isi data terlebih dahulu !!')
                    return
                }

                if ($scope.popUp.noPolisi == undefined || $scope.popUp.noPolisi == '' || $scope.popUp.noPolisi == null) {
                    toastr.error('Kendaraan Harus Di isi')
                    return
                }

                if ($scope.popUp.driver == undefined || $scope.popUp.driver == '' || $scope.popUp.driver == null) {
                    toastr.error('Driver Harus Di isi')
                    return
                }

                if (!$scope.popUp.kegiatan || !$scope.popUp.kegiatan.id) {
                    toastr.error('Jenis Kegiatan harus dipilih');
                    return;
                }



                if ($scope.popUp.verifikasiOrder == undefined || $scope.popUp.verifikasiOrder == '' || $scope.popUp.verifikasiOrder == null) {
                    toastr.error('Harus Diverifikasi')
                    return
                }

                var dataPost = $scope.sourceVerif._data;

                var itemsave = {
                    "bridging_data": dataPost,
                    "nomor_order": $scope.dataSelected.nostruk,
                    "nocm": $scope.headerVerif.nocm,
                    "norec_sp": $scope.dataSelected.norec,
                    "kendaraan": $scope.popUp.noPolisi.norec,
                    "kendaraan_nopolisi": $scope.popUp.noPolisi.nopolisi,
                    "kendaraan_uuid_telemedicine": $scope.popUp.noPolisi.uuid_telemedicine,
                    "driver_id": $scope.popUp.driver.id,
                    "driver_nama_lengkap": $scope.popUp.driver.namalengkap,
                    "driver_uuid_telemedicine": $scope.popUp.driver.uuid_telemedicine,
                    "dokter_id": $scope.popUp.dokter.id,
                    "dokter_nama_lengkap": $scope.popUp.dokter.namalengkap,
                    "perawat_id": $scope.popUp.perawat.id,
                    "kegiatan_id": $scope.popUp.kegiatan.id,
                    "kegiatan_nama": $scope.popUp.kegiatan.namajeniskegiatan,
                    "perawat_nama_lengkap": $scope.popUp.perawat.namalengkap,
                    "verifikasi": $scope.popUp.verifikasiOrder.jenis
                }

                $scope.btnSimpanVis = true;
                    medifirstService.post('ambulance/simpan-data-pelayanan-ambulan-dari-telemedicine', itemsave)
                        .then(function (e) {
                            $scope.popUpVerif.close();
                            init()
                            ClearIsian()
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
            var onDataBound = function (e) {
                var kendoGrid = $("#kGrid").data("kendoGrid"); // get the grid widget
                var rows = e.sender.element.find("tbody tr"); // get all rows

                // iterate over the rows and if the undelying dataitem's Status field is PPT add class to the cell
                for (var i = 0; i < rows.length; i++) {
                    var row = rows[i];
                    var status = kendoGrid.dataItem(row).status;
                    switch (status) {
                        case "MENUNGGU":
                            $(row.cells).addClass("grey");
                            break;
                        case "DITERIMA":
                            $(row.cells).addClass("green");
                            break;
                    }
                }
            }
            // tanda1
            $scope.mainGridOptions = {
                pageable: true,
                scrollable: true,
                dataBound: onDataBound,
                selectable: 'row',
                columns: [
                    {
                        "field": "no",
                        "title": "No",
                        "width": "40px",
                    },
                    {
                        "field": "nostruk",
                        "title": "No Order",
                        "width": "100px"
                    },
                    {
                        "field": "tglstruk",
                        "title": "Tgl Order",
                        "template": "#= new moment(new Date(tglstruk)).format('DD-MM-YYYY HH:mm') #",
                        "width": "100px"
                    },
                    {
                        "field": "nocm",
                        "title": "No. Rekam Medis",
                        "width": "70px"
                    },
                    {
                        "field": "namapasien",
                        "title": "Nama Pasien",
                        "width": "150px"
                    },
                    {
                        "field": "totalharusdibayar",
                        "title": "Total",
                        "width": "150px",
                        "template": "<span class='style-right'>{{formatRupiah('#: totalharusdibayar #', 'Rp.')}}</span>",
                    },
                    {
                        "field": "status",
                        "title": "Status",
                        "width": "150px"
                    },
                ]
            }

            // tanda1
            function ClearIsian() {
                $scope.dataSelected = undefined
                $scope.sourceVerif = undefined
                $scope.popUp = undefined
                $scope.headerVerif = undefined;
                $scope.item.noOrder = undefined
                $scope.item.namaPasiens = undefined
            }
            //********************************  $scope.cekBelumVerifs=true;***

            $scope.cetakSuratTugasAmbulan = function () {
                var local = JSON.parse(localStorage.getItem('profile'));
                var profile = local.id;
                if ($scope.dataSelected == null) {
                    toastr.error("Pilih data yang ingin di cetak");
                    return;
                }
                
                if ($scope.dataSelected.status !== "DITERIMA") {
                    toastr.error("Data harus diverifikasi terlebih dahulu");
                    return;
                }
                
                window.open(config.baseApiBackend + 
                    "report/get-cetak-surat-tugas-ambulan?norec=" + $scope.dataSelected.norec + 
                    "&kdprofile=" + profile,'_blank');
            }

        }
    ]);
});
