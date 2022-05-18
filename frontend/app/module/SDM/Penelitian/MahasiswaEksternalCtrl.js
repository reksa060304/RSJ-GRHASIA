define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('MahasiswaEksternalCtrl', ['$scope', '$state', 'DateHelper', 'CacheHelper', 'MedifirstService', 'ModelItem',
        function ($scope, $state, dateHelper, cacheHelper, medifirstService, ModelItem) {
            $scope.dataVOloaded = true;
            $scope.isRouteLoading = false;
            $scope.now = new Date();
            $scope.item = {};
            $scope.currentKeterangan = [];
            $scope.item.namainstansi = medifirstService.getPegawaiLogin().namaLengkap;
            $scope.item.namauser = medifirstService.getUserLogin().kdUser;

            $scope.pemb = true;
            $scope.ru = true;
            var noOrder = '';
            var NorecKpe = '';
            var norec_kpe = '';
            var norecmhs = '';
            loadDataCombo();
            LoadCache();
            
            function LoadCache() {
                var chacePeriode = cacheHelper.get('PenelitianEksternalCtrl');
                if (chacePeriode != undefined) {
                    NorecKpe = chacePeriode[0]
                    noOrder = chacePeriode[1]
                    init()
                    var chacePeriode = {
                        0: '',
                        1: '',
                        2: '',
                        3: '',
                        4: '',
                        5: '',
                        6: ''
                    }
                    cacheHelper.set('PenelitianEksternalCtrl', chacePeriode);
                } else {
                    init()
                }
            }
            if (ModelItem.getPegawai().jenisPegawai.qjenispegawai != 0) {
                $scope.tgl = false;
                $scope.pemb = false;
                $scope.ru = false;
                $scope.tmbhruangan = true;
            }

            function loadDataCombo() {
            $scope.isRouteLoading = true;


                var noregistrasi = "noregistrasi=" + $state.params.norec;
                medifirstService.get("sdm/penelitian/get-data-combo-penelitian?" + noregistrasi, true).then(function (datas) {
                    $scope.isRouteLoading = false;
                    var dat = datas.data
                    $scope.ListInstitusiPendidikan = dat.institusi;
                    $scope.ListJenisDiklat = dat.jenisdiklat;
                    $scope.ListJenisLayanan = dat.detailjenisproduk;
                    $scope.ListJenisKelamin = dat.jeniskelamin;
                    $scope.ListPegawai = dat.pegawai;
                    $scope.ListRuangan = dat.dataruangan;
                    $scope.kendo = datas.data.me.length;
                    $scope.ListLevelPendidikan = dat.levelpendidikan;
                    if (dat.pegawaiuser != '') {
                        $scope.item.notelp = dat.pegawaiuser[0].nomor
                    }
                    console.log(datas.data.norec);
                    if (datas.data.norec != '') {
                        $scope.norec = datas.data.norec[0].jumlahpeserta
                        console.log($scope.norec);
                    }
                    for (var i = 0; i < datas.data.me.length; i++) {
                        datas.data.me[i].no = i + 1
                    }
                    if (dat.sp != '') {
                        if (dat.sp != undefined) {
                            $scope.peneliti = true
                            toastr.error("Informasi, Data Sudah Diverifikasi !")
                        }
                    }
                    $scope.dataSourceGridDiagnosapasien = new kendo.data.DataSource({
                        data: datas.data.me,
                        // group: $scope.group,
                        pageSize: 100,
                        total: datas.data.me.length,
                        serverPaging: false,
                        schema: {
                            model: {}
                        },
                    });
                });


            }

            $scope.columnGridDiagnosapasien = {
                toolbar: ["excel", ],
                excel: {
                    fileName: "Laporan .xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var departemenss = "";
                    if ($scope.item.departement != undefined) {
                        departemenss = $scope.item.departement.departemen;
                    }
                    if ($scope.item.departemen != undefined) {
                        departemenss = $scope.item.departemen.departemen;
                    }
                    if ($scope.item.departement == undefined && $scope.item.departemen == undefined) {
                        departemenss = "Rumah Sakit Jiwa Grhasia";
                    }
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 1;
                    sheet.mergedCells = ["A1:D1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Laporan Diagnosa Per-pasien " + departemenss,
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
                groupable: false,
                columns: [{
                        field: "no",
                        title: "No",
                        width: "30px",
                    },
                    {
                        field: "nama",
                        title: "Nama",
                        width: "100px",
                    },
                    {
                        field: "nim",
                        title: "NIM",
                        width: "100px",
                    },
                    {
                        field: "jeniskelamin",
                        title: "Gender",
                        width: "100px",
                    },
                    {
                        field: "namalengkap",
                        title: "Pembimbing",
                        width: "100px",
                    },
                    {
                        field: "namaruangan",
                        title: "Ruangan",
                        width: "100px",
                    },
                    {
                        field: "email",
                        title: "Email",
                        width: "50px",

                    },
                    {
                        field: "count",
                        title: "Image",
                        width: "50px",
                    },
                    
                ],
                // groupable: true,
                // filterable: true,
                columnMenu: true,
                reorderable: true,
                resizable: true,
                sortable: true,
                pageable: true,
            }
            $scope.klikGrid = function (dataSelected) {
                    $scope.isRouteLoading =true
                  var noregistrasi = "norec=" + dataSelected.norec_eks;

                medifirstService.get("sdm/pendidikan/get-detail-pdruangan?" + noregistrasi, true).then(function (datas) {
                    var dat = datas.data.nor
                    $scope.item.nim = dat[0].nim;
                    $scope.item.jeniskelamin = { id:dat[0].jeniskelaminfk,
                        jeniskelamin: dat[0].jeniskelamin
                    };
                    console.log(dataSelected);
                    $scope.item.namapeneliti = dat[0].nama;
                    $scope.item.telp = dat[0].nomorhp;
                    $scope.norec_maeks = dat[0].norec_eks;
                    $scope.item.email = dat[0].email;
                    $scope.isRouteLoading=false
                });

            }
            function init() {
                if (noOrder == 'EditPenelitianEksternal') {
                    $scope.isRouteLoading = true;
                    medifirstService.get("sdm/penelitian/get-detail-penelitian-eksternal?" +
                        "Norec=" + NorecKpe, true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        var datas = dat.data.datas[0];
                        norec_kpe = datas.norec;

                        $scope.item.namauser = datas.namauser;
                        $scope.item.namainstansi = datas.institusipendidikan
                        $scope.item.notelp = datas.notelp;
                        $scope.item.jenis = {
                            id: datas.idjenis,
                            diklatkategori: datas.diklatkategori
                        };
                        $scope.item.layanan = {
                            id: datas.idlayanan,
                            detailjenisproduk: datas.detailjenisproduk
                        };
                        $scope.item.levelpendidikan = {
                            id: datas.idlevelpendidikan,
                            namaproduk: datas.levelpendidikan
                        };
                        $scope.item.jumlahpeserta = datas.jumlahpeserta
                        $scope.item.qty = datas.qty
                        $scope.item.satuan = datas.satuan
                        $scope.item.biaya = datas.biayapenelitian
                        $scope.item.tanggalMulai = datas.tanggalmulai;
                        $scope.item.tanggalSelesai = datas.tanggalselesai;


                    })

                }
            }



            $scope.addListKeterangan = function (bool, data) {
                var index = $scope.currentKeterangan.indexOf(data);
                if (_.filter($scope.currentKeterangan, {
                        id: data.id
                    }).length === 0)
                    $scope.currentKeterangan.push(data);
                else {
                    $scope.currentKeterangan.splice(index, 1);
                }

            }

            $scope.Batal = function () {
                $scope.item = {};
            }

            
            
            $scope.tambahMhs = function () {
                $scope.isRouteLoading = true;
                //bikin if untuk ruangan dan pegawai
                var ruangan = null
                var pegawai = null
            
                
                var data = {
                    "norec": false,
                    "noregistrasifk": $state.params.norec,
                    "nama": $scope.item.namapeneliti,
                    "nim": $scope.item.nim,
                    "nomorhp": $scope.item.telp,
                    "jeniskelaminfk": $scope.item.jeniskelamin.id,
                    "objectruanganlastfk": ruangan,
                    "objectpegawailastfk": pegawai,
                    "email": $scope.item.email,
                };
                if ($scope.norec < $scope.kendo + 1) {
                    window.messageContainer.error("Data tidak berhasil disimpan Quota Peserta sudah Terpenuhi.");
                    $scope.isRouteLoading = false;
                    $scope.item = {};
                    return;
                }
                medifirstService.post('sdm/pendidikan/save-pesertadidik', data).then(function (e) {
                    $scope.item = {};
                    // $state.go('DaftarPenelitianEksternal')
                    $scope.isRouteLoading = false;
                    loadDataCombo();
                })

            }

            $scope.updated = function () {
                $scope.isRouteLoading = true;
                //bikin if untuk ruangan dan pegawai
                var ruangan = null
                var pegawai = null
                var NOREC = $scope.dataSelected.norec_eks
                var data = {
                    "norec": NOREC,
                    "noregistrasifk": $state.params.norec,
                    "nama": $scope.item.namapeneliti,
                    "nim": $scope.item.nim,
                    "nomorhp": $scope.item.telp,
                    "jeniskelaminfk": $scope.item.jeniskelamin.id,
                    "objectruanganlastfk": ruangan,
                    "objectpegawailastfk": pegawai,
                    "email": $scope.item.email
                }

                medifirstService.post('sdm/pendidikan/update-pesertadidik', data).then(function (e) {
                    $scope.item = {};
                    // $state.go('DaftarPenelitianEksternal')
                    $scope.isRouteLoading = false;
                    loadDataCombo();
                })

            }
            //tambah ruangan
            $scope.tambahRuangan = function () {
                if ($scope.dataSelected == undefined) {
                    messageContainer.error("Pilih data dulu!")
                    return
                }
                $scope.item.nimm = $scope.dataSelected.nim
                console.log($scope.dataSelected.nim);
                $scope.item.namaPasien = $scope.dataSelected.nama;
                $scope.item.jeniskelamin = $scope.dataSelected.jeniskelamin;
                // $scope.itemDd.noRM = $scope.dataPasienSelectedR.nocm;
                // $scope.itemDd.namaPasien = $scope.dataPasienSelectedR.namapasien;
                // $scope.itemDd.tglLahir = moment($scope.dataPasienSelectedR.tgllahir).format('DD-MM-YYYY');
                // $scope.itemDd.noRegistrasi = $scope.dataPasienSelectedR.noregistrasi;
                loadDetailRiwayat();
                $scope.popUpTambahRuangan.center().open();
                var actions = $scope.popUpTambahRuangan.options.actions;
                actions.splice(actions.indexOf("Close"), 1);
                $scope.popUpTambahRuangan.setOptions({
                    actions: actions
                });
                
            }

            $scope.TutupPopUps = function () {
                // $scope.itemDd.noRM = undefined;
                // $scope.itemDd.namaPasien = undefined;
                // $scope.itemDd.tglLahir = undefined;
                // $scope.itemDd.noRegistrasi = undefined;
                // $scope.itemDd.JumlahRawat = undefined;
                // $scope.dataDetailRegistrasi = new kendo.data.DataSource({
                //     data: []
                // });
                $scope.popUpTambahRuangan.close();
            }

            function loadDetailRiwayat() {
                $scope.isRouteLoading = true
                medifirstService.get("sdm/pendidikan/get-detail-pdruangan?noregistrasi=" + $scope.dataSelected.norec_eks).then(function (data) {
                    $scope.isRouteLoading = false;
                    var dataa = data.data.data;
                    for (var i = 0; i < dataa.length; i++) {
                        dataa[i].no = i + 1
                    }
                    console.log(dataa);
                    $scope.dataDetail = new kendo.data.DataSource({
                        data: dataa,
                        pageSize: 10,
                        total: dataa.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {}
                            }
                        }
                    });
                });
            }

            $scope.SearchEnterDetail = function () {
                loadDetailRiwayat();
            }
            $scope.columnDetail = {
                toolbar: ["excel", ],
                excel: {
                    fileName: "Laporan .xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    
                },
                groupable: false,
                columns: [{
                        field: "no",
                        title: "No",
                        width: "30px",
                    },
                    {
                        field: "tglmasuk",
                        title: "Tanggal Masuk",
                        width: "100px",
                    },
                    {
                        field: "ruanganlast",
                        title: "Ruangan",
                        width: "100px",
                    },
                    {
                        field: "namalengkap",
                        title: "Pembimbing",
                        width: "100px",
                    },
                ],
                // groupable: true,
                // filterable: true,
                columnMenu: true,
                reorderable: true,
                resizable: true,
                sortable: true,
                pageable: true,
            }
            $scope.saveruangan = function () {
            // $scope.isRouteLoading = true;
             //bikin if untuk ruangan dan pegawai
            
            var norec =''
            $scope.ruangan = null
            var data = {
                "norec": norec,
                "noregistrasifk": $scope.dataSelected.norec_eks,
                "tglmasuk": moment($scope.now).format('YYYY-MM-DD HH:mm'),
                "objectruanganasalfk": $scope.ruangan ? $scope.ruangan : null,
                "objectruanganlastfk": $scope.item.ruangan.id,
                "objectpegawaifk": $scope.item.pegawai.id,
                "norec_pdruangan": $scope.norec_maeks,
            };
            console.log(data);
            // return
            medifirstService.post('sdm/pendidikan/save-pdruangan', data).then(function (e) {
                // $scope.item = {};
                // $state.go('DaftarPenelitianEksternal')
                $scope.isRouteLoading = false;
                loadDataCombo();
                loadDetailRiwayat();
            })
            }

            $scope.klikGridDetail= function(dataPasienSelectedDetail){
                console.log(dataPasienSelectedDetail);
            }

            $scope.deletedRow = function() {
                    $scope.isRouteLoading = true;
                var datasend = {
                    "statusenabled": true,
                    "norec": $scope.dataSelected.norec_eks,
                };

                $scope.isRouteLoading = true;
                medifirstService.post("sdm/pendidikan/hapus-peserta-didik", datasend).then(function (e) {
                    $scope.isRouteLoading = false;
                    loadDataCombo();
                });
            }


        }
    ]);
});