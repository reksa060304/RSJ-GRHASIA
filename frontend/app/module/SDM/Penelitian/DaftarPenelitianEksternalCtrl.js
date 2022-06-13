define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict';
    var baseTransaksi = configuration.baseApiBackend;

    initialize.controller('DaftarPenelitianEksternalCtrl', ['$scope', '$state', 'DateHelper', 'CacheHelper', 'MedifirstService', 'ModelItem',
        function ($scope, $state, dateHelper, cacheHelper, medifirstService, ModelItem) {
            $scope.item = {};
            $scope.isRouteLoading = false;
            $scope.now = new Date();
            $scope.item.tglawal = new moment($scope.now).format('YYYY-MM-DD 00:00');
            $scope.item.tglakhir = new moment($scope.now).format('YYYY-MM-DD 23:59');
            var norec = "";
			var dataProduk = [];
            // LoadCombo();
            GetData()
            console.log(medifirstService.getPegawai());
            $scope.tambahmahasiswa = function (current) {
                if ($scope.current == undefined) {
                    toastr.error('Data Kegiatan Belum Dipilih', 'Info');
                    return;
                }
                var chacePeriode = {
                    0: $scope.current,
                    1: 'EditPenelitianEksternal',
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }

                cacheHelper.set('DaftarPenelitianEkstenalCtrl', chacePeriode);
                $state.go('TambahMahasiswa', {
                    norec: $scope.current,
                    noOrder: 'EditPenelitianEksternal'
                });
            }

            

            // function LoadCombo() {
            //     medifirstService.get("sdm/penelitian/get-data-combo-penelitian?", true).then(function (datas) {
            //         var dat = datas.data
            //         $scope.listDataInstitusiPendidikan = dat.institusi;
            //         $scope.listDataFakultas = dat.fakultas;
            //     });
            // }

            if (medifirstService.getKelompokUser() != 'diklit') {
                $scope.verif = false
                $scope.tagih = false
                $scope.columnPenelitian = {
                    toolbar: ["excel"],
                    excel: {
                        fileName: "Data Penelitian Eksternal" + moment($scope.now).format('DD/MMM/YYYY'),
                        allPages: true,
                    },
                    selectable: 'row',
                    pageable: true,
                    columns: [{
                            "field": "no",
                            "title": "No",
                            "width": "10%"
                        },
                        {
                            "field": "diklatkategori",
                            "title": "Jenis Diklat",
                            "width": "15%"
                        },
                        {
                            "field": "detailjenisproduk",
                            "title": "Kegiatan",
                            "width": "20%"
                        },
                        {
                            "field": "jumlahpeserta",
                            "title": "Peserta",
                            "width": "20%"
                        },
                        {
                            "title": "Tanggal",
                            "width": "20%",
                            "template": "<span class='style-center'>#: tanggalmulai # s/d #: tanggalselesai #</span>"
                        },
                    ]
                }
            } else {
                $scope.verif = true
                $scope.tagih = true
                $scope.columnPenelitian = {
                    toolbar: ["excel"],
                    excel: {
                        fileName: "Data Penelitian Eksternal" + moment($scope.now).format('DD/MMM/YYYY'),
                        allPages: true,
                    },
                    selectable: 'row',
                    pageable: true,
                    columns: [{
                            "field": "no",
                            "title": "No",
                            "width": "10px"
                        },
                        {
                            "field": "institusipendidikan",
                            "title": "Institusi Pendidikan",
                            "width": "50px"
                        },
                        {
                            "field": "diklatkategori",
                            "title": "Jenis Diklat",
                            "width": "50px"
                        },
                        {
                            "field": "detailjenisproduk",
                            "title": "Kegiatan",
                            "width": "50px"
                        },
                        {
                            "field": "jumlahpeserta",
                            "title": "Peserta",
                            "width": "20px"
                        },
                        {
                            "title": "Tanggal",
                            "width": "50px",
                            "template": "<span class='style-center'>#: tanggalmulai # s/d #: tanggalselesai #</span>"
                        },
                        {
                            "title": "Verif",
                            "width": "50px",
                            "template": "<span class='style-center'>#: noregistrasifk != null ? 'Sudah diverif': 'Belum diverif' #</span>"
                        },
                        {
                            "title": "Status Bayar",
                            "width": "50px",
                            "template": "<span class='style-center'>#: nosbmlastfk != null || nosbklastfk != null  ? 'Lunas': 'Belum Bayar' #</span>"
                        },
                        {
                            'command': [{
                                text: "nametag",
                                click: cetaknametag,
                            }],
                            "width": 100
                        },
                    ],
                }
            }

            function GetData() {
                $scope.isRouteLoading = true;
                var tglAwal = "&tglawal="+ moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = "&tglakhir="+ moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');
                var NamaPeneliti = "";
                // if ($scope.item.NamaPeneliti !== undefined) {
                //     NamaPeneliti = "&NamaPeneliti=" + $scope.item.NamaPeneliti
                // }
                // var Fakultas = "";
                // if ($scope.item.Fakultas !== undefined) {
                //     Fakultas = "&Fakultas=" + $scope.item.Fakultas.id;
                // }
                var InstitusiPendidikan = "";
                if ($scope.item.institusipendidikan !== undefined) {
                    InstitusiPendidikan = "&Fakultas=" + $scope.item.institusipendidikan;
                }
                var usr = ''
                console.log(medifirstService.getKelompokUser());
                if (medifirstService.getKelompokUser() != 'diklit') {
                    usr = "user=" + medifirstService.getUserLogin().kdUser;
                    // console.log(medifirstService.getUserLogin().kdUser);
                }



                // console.log(medifirstService.getPegawai());




                var modelid = "&modelid="+ModelItem.getPegawai().id;
                medifirstService.get("sdm/penelitian/get-daftar-penelitian-eksternal?"+ usr+tglAwal+tglAkhir+InstitusiPendidikan+modelid, true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        var datas = dat.data.datas;
                        for (var i = 0; i < datas.length; i++) {
                            datas[i].no = i + 1
                        }
                        $scope.idpegawai = dat.data.idpegawai[0].usereksternal;
                        
                    console.log($scope.idpegawai);
                        $scope.DataPenelitian = new kendo.data.DataSource({
                            data: datas,
                            total: datas.length,
                            schema: {
                                model: {
                                    fields: {
                                        institusipendidikan: {
                                            type: "string"
                                        },
                                    }
                                }
                            },
                            pageSize: 20,
                            serverPaging: true,
                            serverFiltering: true,
                            serverSorting: true
                        });

                        var chacePeriode = {
                            0: tglAwal,
                            1: tglAkhir,
                            2: '',
                            3: '',
                            4: '',
                            5: '',
                            6: ''
                        }
                        console.log(medifirstService.getKelompokUser());
                        cacheHelper.set('DaftarPenelitianEksternalCtrl', chacePeriode);
                
                });

               
                
            }

            $scope.SearchData = function (e) {
                GetData()
            }

            $scope.ClearData = function () {
                $scope.item = {};
            }

            $scope.kl = function (current) {
                console.log(current);
                toastr.info(current.norec + " Terpilih");
                $scope.current = current.norec;
                $scope.biayapenelitian = current.biayapenelitian;
                $scope.keteranganlainnya = current.detailjenisproduk;
                $scope.notelp = current.notelp;
                $scope.institusi = current.institusipendidikan;
                $scope.objectprodukfk = current.objectprodukfk
                $scope.jumlahpeserta = current.jumlahpeserta
                $scope.qty = current.qty
                $scope.hargasatuan = current.hargasatuan
                $scope.norec_sp = current.norec_sp
                $scope.statusBayar = current.nosbmlastfk
                $scope.nostruk = current.nostruk
                $scope.isverifikasi = current.isverifikasi
                $scope.count = current.count
                console.log(JSON.stringify($scope.current));
                if (medifirstService.getKelompokUser() == 'diklit') {
                    if (current.noregistrasifk != null) {
                        $scope.verif = false;
                        $scope.batalverif = true;
                    } else {
                        $scope.verif = true;
                        $scope.batalverif = false;
                    }

                    if (current.isverifikasi == 0) {
                        $scope.unveriftagih = false
                        $scope.tagih = true
                    } else if (current.isverifikasi == null && current.noregistrasifk != null) {
                        $scope.unveriftagih = true
                        $scope.tagih = false
                    } else {
                        $scope.tagih = true
                        $scope.verif = true
                        $scope.unveriftagih = false
                        $scope.batalverif = false;
                    }
                }
                
                
            }

            $scope.Ubah = function (current) {
                if ($scope.current == undefined) {
                    toastr.error('Data Kegiatan Belum Dipilih', 'Info');
                    return;
                }
                // if ($scope.statusBayar != null) {
                //     toastr.error("Informasi, Tagihan Sudah Lunas Tidak Bisa Diubah !")
                //     return;
                // }
                var chacePeriode = {
                    0: $scope.current,
                    1: 'EditPenelitianEksternal',
                    2: $scope.idpegawai,
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }

                cacheHelper.set('PenelitianEksternalCtrl', chacePeriode);
                $state.go('PenelitianEksternal', {
                    norec: $scope.current,
                    noOrder: 'EditPenelitianEksternal'
                });
            }
            

            $scope.Hapus = function () {
                $scope.isRouteLoading = true
                // console.log($scope.count);
                // console.log($scope.isverifikasi);
                if ($scope.count > 0) {
                $scope.isRouteLoading = false
                    toastr.error("Informasi, Sudah ada data mahasiswa record tidak bisa dihapus....!")
                    return;
                }

                if ($scope.isverifikasi != null) {
                    $scope.isRouteLoading = false
                    toastr.error("Informasi, Data Sudah Diverif Tidak Bisa Dihapus !")
                    return;
                }
                var objSave = {
                    norec: $scope.current
                }
                // console.log(objSave);

                medifirstService.post('sdm/penelitian/batal-kegiatan-penelitian-eksternal', objSave).then(function (e) {
                    GetData()
                })
            }
            // console.log(ModelItem.getPegawai());
            
            
            $scope.verifikasi = function(){
                $scope.isRouteLoading = true
                if ($scope.statusBayar != null) {
                    $scope.isRouteLoading = false
                    toastr.error("Informasi, Tagihan Sudah Lunas Tidak Bisa Verif Kembali !")
                    return;
                }
                
                dataProduk = [{
                    id: $scope.objectprodukfk,
                    harga: $scope.hargasatuan,
                    jumlah: $scope.jumlahpeserta,
                    qtyoranglast: $scope.qty,
                    keterangan: $scope.keteranganlainnya
                }]
                var objSave = {
                    norec: norec,
                    kelompoktransaksifk: 13,
                    keteranganlainnya: $scope.keteranganlainnya,
                    namapasien_klien: $scope.institusi,
                    notelp_klien: $scope.notelp,
                    tglstruk: moment($scope.now).format('YYYY-MM-DD hh:mm:ss'),
                    totalharusdibayar: parseFloat($scope.biayapenelitian), //parseFloat($scope.item.totalBilling),
                    isverifikasi: false,
                    details: dataProduk,
                }
                medifirstService.post('kasir/save-input-non-layanan', objSave).then(function (data) {
                    console.log(data.data.data.norec);
                    var data = {
                        "verif": 'true',
                        norec: $scope.current,
                        noregistrasifk: data.data.data.norec,
                    }
                    var objSave = {
                        data: data,

                    }
                    console.log(objSave);

                    medifirstService.post('sdm/penelitian/verif-kegiatan-penelitian-eksternal', objSave).then(function (e) {
                        console.log(e);
                        GetData();
                        $scope.isRouteLoading = false
                    })
                })
            }

            $scope.batalverifikasi = function(){
                $scope.isRouteLoading = true
                if ($scope.current == undefined || $scope.current == '') {
                    toastr.error('Data Kegiatan Belum Dipilih', 'Info');
                    return;

                }
                if($scope.isverifikasi == null){
                toastr.error('Sudah Verif Tagihan', 'Info');
                $scope.isRouteLoading = false
                return;
                }
                if ($scope.statusBayar != null) {
                    $scope.isRouteLoading = false
                    toastr.error("Informasi, Tagihan Sudah Lunas Tidak Bisa Unverifikasi !")
                    return;
                }

                var objSave = {
                    norec: $scope.norec_sp,
                    nostruk: $scope.nostruk,
                }

                medifirstService.post('kasir/hapus-transaksi-non-layanan', objSave).then(function (data) {
                    GetData();
                    var data = {
                        "verif": 'true',
                        norec: $scope.current,
                        noregistrasifk: null,
                    }
                    var objSave = {
                        data: data,

                    }
                    console.log(objSave);

                    medifirstService.post('sdm/penelitian/verif-kegiatan-penelitian-eksternal', objSave).then(function (e) {
                        console.log(e);
                        GetData();
                        $scope.isRouteLoading = false
                    })
                })
            }
            $scope.tagihan = function(){
                if ($scope.norec_sp == undefined || $scope.norec_sp == '') {
                    toastr.error('Verifikasi Dulu', 'Info');
                    return;
                }
                if ($scope.statusBayar != null) {
                    toastr.error("Informasi, Tagihan Sudah Lunas Tidak Bisa Diverif lagi !")
                    return;
                }
                $scope.isRouteLoading = true
                var data = {
                    norec: $scope.norec_sp,
                    isverifikasi: null
                }
                medifirstService.post('sdm/penelitian/verif-tagihan-kegiatan-penelitian-eksternal', data).then(function (e) {
                    GetData();
                    $scope.isRouteLoading = false
                })
            }
            $scope.unveriftagihan = function(){
                if ($scope.norec_sp == undefined || $scope.norec_sp == '') {
                    toastr.error('Data Kegiatan Belum Dipilih', 'Info');
                    return;
                }
                if ($scope.statusBayar != null) {
                    toastr.error("Informasi, Tagihan Sudah Lunas Tidak Bisa Unverif Tagihan !")
                    return;
                }
                $scope.isRouteLoading = true
                var data = {
                    norec: $scope.norec_sp,
                    isverifikasi: false
                }

                medifirstService.post('sdm/penelitian/verif-tagihan-kegiatan-penelitian-eksternal', data).then(function (e) {
                    GetData();
                    $scope.isRouteLoading = false
                })
            }
            function cetaknametag(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                var datasend = {
                    "norec": dataItem.norec
                }
                // return
                window.open(baseTransaksi + "report/diklat-nametag?norec="+ dataItem.norec);
               
            }
        }
    ]);
});