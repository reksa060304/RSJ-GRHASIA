define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('MapHasilLabCtrl', ['$q', '$rootScope', '$scope', '$state', 'CacheHelper', 'MedifirstService',
        function ($q, $rootScope, $scope, $state, cacheHelper, medifirstService) {
            $scope.item = {};
            $scope.item2 = {}
            $scope.item3 = {};
            $scope.item4 = {};
            let data2 = []
            $scope.isRouteLoading = false

            loadCombo()
            // loadDataJP()
            // loadDataSH()
            // loadDataNilai()
            // loadMap()
            // loadMasterProduk()

            $scope.onTabChanges = function (value) {
                if (value === 1) {
                   loadDataJP()
                } else if (value === 2) {
                     loadMap()
                }else if (value === 3) {
                      loadDataSH()       
                }else if (value === 4) {
                    loadDataNilai()
                }else if (value === 5) {  
                    loadMasterProduk()
                }
            };
            $scope.gridPelayanan = {

                selectable: 'row',
                pageable: true,
                columns: [
                    {
                        "field": "no",
                        "title": "No",
                        "width": 15,
                    },
                    {
                        "field": "namaproduk",
                        "title": "Nama Pelayanan",
                        "width": 110,
                    },
                    {
                        "field": "detailjenisproduk",
                        "title": "Jenis Pemeriksaan",
                        "width": 110,
                    },
                    {
                        "field": "jenisproduk",
                        "title": "Jenis Produk",
                        "width": 110,
                    },

                ],
            };
            $scope.gridJenisPemeriksaan = {

                selectable: 'row',
                pageable: true,
                columns: [
                    {
                        "field": "no",
                        "title": "No",
                        "width": 15,
                    },
                    {
                        "field": "detailjenisproduk",
                        "title": "Jenis Pemeriksaan",
                        "width": 110,
                    },
                    {
                        "field": "jenisproduk",
                        "title": "Jenis Produk",
                        "width": 110,
                    },
                    {
                        "field": "namadepartemen",
                        "title": "Departemen",
                        "width": 110,
                    },
                    {
                        "field": "kodeexternal",
                        "title": "Kode Ekternal",
                        "width": 80,
                    },
                    {
                        "field": "namaexternal",
                        "title": "Nama Eksternal",
                        "width": 80,
                    },
                    {
                        "field": "statusenabled",
                        "title": "Status Enabled",
                        "width": 60,
                    },
                ],
            };
            $scope.gridSH = {
                selectable: 'row',
                pageable: true,
                columns: [
                    {
                        "field": "no",
                        "title": "No",
                        "width": 15,
                    },
                    {
                        "field": "satuanstandar",
                        "title": "Jenis Pemeriksaan",
                        "width": 110,
                    },

                    {
                        "field": "statusenabled",
                        "title": "Status Enabled",
                        "width": 60,
                    },
                ],

            }
            $scope.gridNilai = {
                selectable: 'row',
                pageable: true,
                columns: [
                    {
                        "field": "no",
                        "title": "No",
                        "width": 15,
                    },
                    {
                        "field": "metode",
                        "title": "Metode Pemeriksaan",
                        "width": 110,
                    },
                    {
                        "field": "jeniskelamin",
                        "title": "Jenis Kelamin",
                        "width": 110,
                    },
                    {
                        "field": "kelompokumur",
                        "title": "Kelompok Umur",
                        "width": 110,
                    },
                    {
                        "field": "nilaimin",
                        "title": "Nilai Min",
                        "width": 90,
                    },
                    {
                        "field": "nilaimax",
                        "title": "Nilai Max",
                        "width": 90,
                    },
                    {
                        "field": "nilaitext",
                        "title": "Nilai Teks",
                        "width": 110,
                    },
                    {
                        "field": "statusenabled",
                        "title": "Status Enabled",
                        "width": 60,
                    },
                ],

            }
            $scope.gridDataMap = {
                selectable: 'row',
                pageable: true,
                columns: [

                    {
                        "field": "detailjenisproduk",
                        "title": "Jenis Pemeriksaan",
                        "width": 110,
                    },
                    {
                        "field": "namaproduk",
                        "title": "Nama Pelayanan",
                        "width": 110,
                    },
                    {
                        "field": "detailpemeriksaan",
                        "title": "Detail Pemeriksaan",
                        "width": 110,
                    },
                    {
                        "field": "nourutdetail",
                        "title": "No Urut Detail",
                        "width": 90,
                    },
                    {
                        "field": "satuanstandar",
                        "title": "Satuan Hasil",
                        "width": 110,
                    },
                    {
                        "field": "memohasil",
                        "title": "Memo Hasil Pemeriksa",
                        "width": 200,
                    },
                ],
            }

            $scope.columnMapNilai = [
                {
                    "field": "jeniskelamin",
                    "title": "JK",
                    "width": 60,
                },
                {
                    "field": "kelompokumur",
                    "title": "Kel. Umur",
                    "width": 110,
                },
                {
                    "field": "nilainormal",
                    "title": "Nilai Normal",
                    "width": 110,
                }
            ];
            $scope.cariJP = function () {
                loadDataJP()
            }
            $scope.cariSH = function () {
                loadDataSH()
            }
            $scope.cariNilai = function () {
                loadDataNilai()
            }

            function loadCombo() {
                medifirstService.get('laboratorium/get-combo-map-lab').then(function (e) {
                    $scope.listJenisProduk = e.data.jenisproduk
                    $scope.listJK = e.data.jeniskelamin
                    $scope.listKelompokUmur = e.data.kelompokumur
                    $scope.listProduk = e.data.produk
                    $scope.listSatuan = e.data.satuanstandar
                    $scope.listJenisPemeriksaan = e.data.detailjenisproduk
                })
            }

            function getNilaiNormal(){
                if ($scope.item2.kelompokumur == undefined) {
                    toastr.error("Kelompok Umur Masih Kosong !")
                }
                var idUmur = ''
                if ($scope.item2.kelompokumur != undefined) {
                    idUmur = $scope.item2.kelompokumur.id
                }
                medifirstService.get('laboratorium/get-data-nilai-normal?idUmur=' + nama).then(function (e) {
                    for (let i = 0; i < e.data.data.length; i++) {
                        const element = e.data.data[i];
                        element.no = i + 1
                    }
                    $scope.sourceNilai = e.data.data
                    // $scope.listNilaiNormal = e.data.data
                })
            }

            function loadDataJP() {
                var nama = ''
                if ($scope.item.cariJenisPemeriksaan != undefined) {
                    nama = $scope.item.cariJenisPemeriksaan
                }
                medifirstService.get('laboratorium/get-data-jenis-pemeriksaan?nama=' + nama).then(function (e) {
                    for (let i = 0; i < e.data.data.length; i++) {
                        const element = e.data.data[i];
                        element.no = i + 1
                    }
                    $scope.sourceJenisPemeriksaan = e.data.data
                    // $scope.listJenisPemeriksaan = e.data.data
                })
            }
            $scope.SaveJP = function () {
                if ($scope.item.detailjenisproduk == undefined) {
                    toastr.error('Jenis Pemeriksaan Belum di isi')
                    return
                }
                if ($scope.item.jenisproduk == undefined) {
                    toastr.error('Jenis Produk Belum di isi')
                    return
                }

                let json = {
                    'id': $scope.item.id != undefined ? $scope.item.id : '',
                    'detailjenisproduk': $scope.item.detailjenisproduk,
                    'objectjenisprodukfk': $scope.item.jenisproduk.id,
                    // 'statusenabled': $scope.item.statusenabled,
                    'kodeexternal': $scope.item.kodeexternal != undefined ? $scope.item.kodeexternal : null,
                    'namaexternal': $scope.item.namaexternal != undefined ? $scope.item.namaexternal : null,
                    'method': 'save'
                }
                medifirstService.post('laboratorium/save-detail-jenis', json).then(function (e) {
                    $scope.BatalJP()
                    loadDataJP()
                    loadCombo()
                })

            }
            $scope.BatalJP = function () {
                $scope.item.id = undefined
                $scope.item.detailjenisproduk = undefined
                $scope.item.jenisproduk = undefined
                $scope.item.kodeexternal = undefined
                $scope.item.namaexternal = undefined
            }
            $scope.HapusJP = function () {
                if ($scope.selectedJenisPemeriksaan == undefined) {
                    toastr.error('Pilih Jenis Pemeriksaan dulu')
                    return
                }
                let json = {
                    'id': $scope.selectedJenisPemeriksaan.id,
                    'method': 'delete'
                }
                medifirstService.post('laboratorium/save-detail-jenis', json).then(function (e) {
                    $scope.BatalJP()
                    loadDataJP()
                    loadCombo()
                })

            }
            $scope.klikJp = function (da) {
                $scope.item.id = da.id
                $scope.item.detailjenisproduk = da.detailjenisproduk
                $scope.item.jenisproduk = { id: da.jenisprodukfk, jenisproduk: da.jenisproduk }
                $scope.item.kodeexternal = da.kodeexternal
                $scope.item.namaexternal = da.namaexternal
                // $scope.item.statusenabled = da.statusenabled
            }
            // satuan standar
            function loadDataSH() {
                var nama = ''
                if ($scope.item3.cariSatuanHasil != undefined) {
                    nama = $scope.item3.cariSatuanHasil
                }
                medifirstService.get('laboratorium/get-data-satuan-hasil?nama=' + nama).then(function (e) {
                    for (let i = 0; i < e.data.data.length; i++) {
                        const element = e.data.data[i];
                        element.no = i + 1
                    }
                    $scope.sourceSH = e.data.data
                })
            }
            $scope.SaveSH = function () {
                if ($scope.item3.satuanstandar == undefined) {
                    toastr.error('Satuan Standar Belum di isi')
                    return
                }


                let json = {
                    'id': $scope.item3.id != undefined ? $scope.item3.id : '',
                    'satuanstandar': $scope.item3.satuanstandar,
                    // 'statusenabled': $scope.item3.statusenabled,
                    'method': 'save'
                }
                medifirstService.post('laboratorium/save-satuan', json).then(function (e) {
                    $scope.BatalSH()
                    loadDataSH()
                    loadCombo()
                })

            }
            $scope.BatalSH = function () {
                $scope.item3.id = undefined
                $scope.item3.satuanstandar = undefined
            }
            $scope.HapusSH = function () {
                if ($scope.selectedSH == undefined) {
                    toastr.error('Pilih Satuan Hasil dulu')
                    return
                }
                let json = {
                    'id': $scope.selectedSH.id,
                    'method': 'delete'
                }
                medifirstService.post('laboratorium/save-satuan', json).then(function (e) {
                    $scope.BatalSH()
                    loadDataSH()
                    loadCombo()
                })

            }
            $scope.klikSH = function (da) {
                $scope.item3.id = da.id
                $scope.item3.satuanstandar = da.satuanstandar
                $scope.item3.statusenabled = da.statusenabled
            }

            // nilai normal
            function loadDataNilai() {
                var nama = ''
                if ($scope.item4.cariNilaiNormal != undefined) {
                    nama = $scope.item4.cariNilaiNormal
                }
                medifirstService.get('laboratorium/get-data-nilai-normal?nama=' + nama).then(function (e) {
                    for (let i = 0; i < e.data.data.length; i++) {
                        const element = e.data.data[i];
                        element.no = i + 1
                    }
                    $scope.sourceNilai = e.data.data
                    // $scope.listNilaiNormal = e.data.data
                })
            }
            $scope.SaveNilai = function () {
                if ($scope.item4.metode == undefined) {
                    toastr.error('Metode Belum di isi')
                    return
                }
                if ($scope.item4.jeniskelamin == undefined) {
                    toastr.error('Jenis Kelamin Belum di isi')
                    return
                }
                if ($scope.item4.kelompokumur == undefined) {
                    toastr.error('Kelompok Umur Belum di isi')
                    return
                }
                if ($scope.item4.nilaimin == undefined) {
                    toastr.error('Nilai Min Belum di isi')
                    return
                }
                if ($scope.item4.nilaimax == undefined) {
                    toastr.error('Nilai Max Belum di isi')
                    return
                }
                if ($scope.item4.nilaitext == undefined) {
                    toastr.error('Nilai Teks Belum di isi')
                    return
                }


                let json = {
                    'id': $scope.item4.id != undefined ? $scope.item3.item4 : '',
                    'metode': $scope.item4.metode,
                    'objectjeniskelaminfk': $scope.item4.jeniskelamin.id,
                    'kelompokumurfk': $scope.item4.kelompokumur.id,
                    'nilaimin': $scope.item4.nilaimin,
                    'nilaimax': $scope.item4.nilaimax,
                    'nilaitext': $scope.item4.nilaitext,
                    // 'statusenabled': $scope.item4.statusenabled,
                    'method': 'save'
                }
                medifirstService.post('laboratorium/save-nilai-normal', json).then(function (e) {
                    $scope.BatalNilai()
                    loadDataNilai()
                    loadCombo()
                })

            }
            $scope.BatalNilai = function () {
                $scope.item4.id = undefined
                $scope.item4.metode = undefined
                $scope.item4.jeniskelamin = undefined
                $scope.item4.kelompokumur = undefined
                $scope.item4.nilaimin = undefined
                $scope.item4.nilaimax = undefined
                $scope.item4.nilaitext = undefined
            }
            $scope.HapusNilai = function () {
                if ($scope.selectedNilai == undefined) {
                    toastr.error('Pilih Satuan Hasil dulu')
                    return
                }
                let json = {
                    'id': $scope.selectedNilai.id,
                    'method': 'delete'
                }
                medifirstService.post('laboratorium/save-nilai-normal', json).then(function (e) {
                    $scope.BatalNilai()
                    loadDataNilai()
                    loadCombo()
                })

            }
            $scope.klikNilai = function (da) {
                $scope.item4.id = da.id
                $scope.item4.metode = da.metode
                $scope.item4.jeniskelamin = { id: da.objectjeniskelaminfk, jeniskelamin: da.jeniskelamin }
                $scope.item4.kelompokumur = { id: da.kelompokumurfk, kelompokumur: da.kelompokumur }
                $scope.item4.nilaimin =da.nilaimin
                $scope.item4.nilaimax =da.nilaimax
                $scope.item4.nilaitext = da.nilaitext
            }


            $scope.$watch('item2.jeniskelamin', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    getNilaiNormal(newValue.id, $scope.item2.kelompokumur != undefined && $scope.item2.kelompokumur.kelompokumur!='-' ? $scope.item2.kelompokumur.id : '-')
                }
            });
            $scope.$watch('item2.kelompokumur', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    getNilaiNormal($scope.item2.jeniskelamin != undefined && $scope.item2.kelompokumur.kelompokumur!='-' ? $scope.item2.jeniskelamin.id : '-', newValue.id)
                }
            });
            function getNilaiNormal(jenis, kelompok) {
                if (jenis != null && kelompok != null) {
                    medifirstService.get('laboratorium/get-data-nilai-normal?nama=&jeniskelaminfk=' + jenis + '&kelompokfk=' + kelompok).then(function (e) {
                        $scope.listNilaiNormal = e.data.data
                    })
                }

            }

            $scope.addNilai = function () {

                if ($scope.item2.jeniskelamin == undefined) {
                    toastr.error("Pilih Jenis Kelamin ");
                    return;
                }
                if ($scope.item2.kelompokumur == undefined) {
                    toastr.error("Pilih Kelompok Umur ");
                    return;
                }
                if ($scope.item2.nilainormal == undefined) {
                    toastr.error("Pilih Nilai Normal ");
                    return;
                }

                var nomor = 0
                if ($scope.gridMapNilai == undefined) {
                    nomor = 1
                } else {
                    nomor = data2.length + 1
                }
                var data = {};
                if ($scope.item2.no != undefined) {
                    for (var i = data2.length - 1; i >= 0; i--) {
                        if (data2[i].no == $scope.item2.no) {
                            data.no = $scope.item2.no

                            data.jeniskelaminfk = $scope.item2.jeniskelamin.id
                            data.kelompokumurfk = $scope.item2.kelompokumur.id
                            data.nilainormalfk = $scope.item2.nilainormal.id
                            data.nilainormal = $scope.item2.nilainormal.nilaitext
                            data.kelompokumur = $scope.item2.kelompokumur.kelompokumur
                            data.jeniskelamin = $scope.item2.jeniskelamin.jeniskelamin

                            data2[i] = data;
                            $scope.gridMapNilai = new kendo.data.DataSource({
                                data: data2
                            });
                        }
                    }

                } else {
                    data = {
                        no: nomor,
                        jeniskelaminfk: $scope.item2.jeniskelamin.id,
                        kelompokumurfk: $scope.item2.kelompokumur.id,
                        nilainormalfk: $scope.item2.nilainormal.id,
                        nilainormal: $scope.item2.nilainormal.nilaitext,
                        kelompokumur: $scope.item2.kelompokumur.kelompokumur,
                        jeniskelamin: $scope.item2.nilainormal.jeniskelamin,
                    }
                    data2.push(data)
                    // $scope.dataGrid.add($scope.dataSelected)
                    $scope.gridMapNilai = new kendo.data.DataSource({
                        data: data2
                    });
                }
                $scope.batal2();
            }
            $scope.batal2 = function () {
                $scope.item2.jeniskelamin = undefined
                $scope.item2.kelompokumur = undefined
                $scope.item2.nilainormal = undefined
                $scope.item2.no = undefined
            }
            $scope.klikMapNilai = function (dataSelected) {
                var dataProduk = [];
                //no:no,
                $scope.item2.no = dataSelected.no
                for (var i = $scope.listNilaiNormal.length - 1; i >= 0; i--) {
                    if ($scope.listNilaiNormal[i].id == dataSelected.nilainormalfk) {
                        dataProduk = $scope.listNilaiNormal[i]
                        break;
                    }
                }
                $scope.item2.jeniskelamin = { id: dataSelected.jeniskelaminfk, jeniskelamin: dataSelected.jeniskelamin };
                $scope.item2.kelompokumur = { id: dataSelected.jeniskelaminfk, jeniskelamin: dataSelected.jeniskelamin };
                $scope.item2.nilainormal = dataProduk
            }
            $scope.delNilai = function () {

                if ($scope.item2.nilainormal == undefined) {
                    toastr.error("Pilih Nilai Normal terlebih dahulu!!")
                    return;
                }
                var nomor = 0
                if ($scope.gridMapNilai == undefined) {
                    nomor = 1
                } else {
                    nomor = data2.length + 1
                }
                var data = {};
                if ($scope.item2.no != undefined) {
                    for (var i = data2.length - 1; i >= 0; i--) {
                        if (data2[i].no == $scope.item2.no) {
                            data2.splice(i, 1);
                            for (var i = data2.length - 1; i >= 0; i--) {
                                data2[i].no = i + 1
                            }
                            // data2[i] = data;
                            $scope.gridMapNilai = new kendo.data.DataSource({
                                data: data2
                            });
                        }
                    }

                }
                $scope.batal2();
            }
            // map hasil
            function loadMap() {
                var nama = ''
                if ($scope.item2.cariPelayanan != undefined) {
                    nama = $scope.item2.cariPelayanan
                }
                medifirstService.get('laboratorium/get-map-hasil-lab?nama=' + nama).then(function (e) {
                    for (let i = 0; i < e.data.data.length; i++) {
                        const element = e.data.data[i];
                        element.no = i + 1
                    }
                    $scope.sourceDataMap = e.data.data
                    // $scope.listNilaiNormal = e.data.data
                })
            }
            $scope.cariMap = function () {
                $scope.item2.id =undefined
                loadMap()
            }
            $scope.klikDataMap =function (selc) {
                  data2 =[]
                   $scope.item2.id= selc.id
                   $scope.item2.namaproduk ={id:selc.produkfk,namaproduk: selc.namaproduk}
                   $scope.item2.satuanstandar = {id:selc.satuanstandarfk,satuanstandar: selc.satuanstandar}
                   // $scope.item2.namaproduk = selc.details
                   for (var i = 0; i < selc.details.length; i++) {
                       const el = selc.details[i]
                       var data = {
                            no: i+1,
                            jeniskelaminfk: el.jeniskelaminfk,
                            kelompokumurfk:el.kelompokumurfk,
                            nilainormalfk:el.nilainormalfk,
                            nilainormal:el.nilaitext,
                            kelompokumur:el.kelompokumur,
                            jeniskelamin: el.jeniskelamin,
                        }
                        data2.push(data)
                   }
                   
                    // $scope.dataGrid.add($scope.dataSelected)
                    $scope.gridMapNilai = new kendo.data.DataSource({
                        data: data2
                    });
                    if(selc.detailpemeriksaan)
                   $scope.item2.detailpemeriksaan = selc.detailpemeriksaan
                if(selc.memohasil)
                   $scope.item2.memohasil = selc.memohasil
               if(selc.nourutdetail)
                   $scope.item2.nourutdetail = selc.nourutdetail
                // body...
            }
            $scope.saveMap = function () {
                if ($scope.item2.namaproduk == undefined) {
                    toastr.error("Pilih Pelayanan dahulu!!")
                    return;
                }
                if ($scope.item2.satuanstandar == undefined) {
                    toastr.error("Pilih Satuan Hasil dahulu!!")
                    return;
                }
                if (data2.length == 0) {
                    toastr.error("Nilai Normal Belum di isi!!")
                    return;
                }
                let json = {
                    id: $scope.item2.id !=undefined?$scope.item2.id : '',
                    produkfk: $scope.item2.namaproduk.id,
                    detailpemeriksaan: $scope.item2.detailpemeriksaan != undefined ? $scope.item2.detailpemeriksaan : null,
                    nourutdetail: $scope.item2.nourutdetail != undefined ? $scope.item2.nourutdetail : null,
                    satuanstandarfk: $scope.item2.satuanstandar.id,
                    memohasil: $scope.item2.memohasil != undefined ? $scope.item2.memohasil : null,
                    details: data2
                }
                medifirstService.post('laboratorium/save-map-hasil-lab', json).then(function (e) {
                    $scope.batal3()
                    loadMap()
                    loadCombo()
                })
            }
            $scope.batal3 = function () {
                $scope.item2.id =undefined
                $scope.item2.jeniskelamin = undefined
                $scope.item2.kelompokumur = undefined
                $scope.item2.nilainormal = undefined
                $scope.item2.no = undefined
                data2 = []
                $scope.gridMapNilai = new kendo.data.DataSource({
                    data: data2
                });
                $scope.item2.namaproduk = undefined
                $scope.item2.detailpemeriksaan = undefined
                $scope.item2.nourutdetail = undefined
                $scope.item2.satuanstandar = undefined
                $scope.item2.memohasil = undefined
            }
            $scope.hapusMap = function () {
                if ($scope.selectedDataMap == undefined) {
                    toastr.error("Pilih data dulu!")
                    return;
                }
                medifirstService.post('laboratorium/hapus-map-hasil-lab', { id: $scope.selectedDataMap.id }).then(function (e) {
                    $scope.selectedDataMap == undefined
                    loadMap()
                    loadCombo()
                })

            }
            $scope.batalMap = function () {
                $scope.batal3()
            }
            $scope.dataGridDetail = function (dataItem) {
                for (var i = 0; i < dataItem.details.length; i++) {
                    dataItem.details[i].no = i + 1

                }
                return {
                    dataSource: new kendo.data.DataSource({
                        data: dataItem.details,

                    }),
                    columns: [
                        {
                            "field": "no",
                            "title": "No",
                            "width": "5%",
                        },
                        {
                            "field": "jeniskelamin",
                            "title": "Jenis Kelamin",
                            "width": "25%",

                        },
                        {
                            "field": "kelompokumur",
                            "title": "Kel Umur",
                            "width": "25%",

                        },
                        {
                            "field": "nilaitext",
                            "title": "Nilai Normal",
                            "width": "25%",

                        }

                    ]
                }
            };
            // map hasil
            function loadMasterProduk() {
                var nama = ''
                if ($scope.item4.cariPelayanans != undefined) {
                    nama = $scope.item4.cariPelayanans
                }
                medifirstService.get('laboratorium/get-master-produk?nama=' + nama).then(function (e) {
                    for (let i = 0; i < e.data.data.length; i++) {
                        const element = e.data.data[i];
                        element.no = i + 1
                    }
                    $scope.sourcePelayanan = e.data.data
                    // $scope.listNilaiNormal = e.data.data
                })
            }
            $scope.cariPel = function () {
                loadMasterProduk()
            }
            $scope.klikPel = function (e) {
                $scope.item4.id = e.id
                $scope.item4.namaproduk = e.namaproduk
                // $scope.item4.jenisproduk = { id: e.objectjenisprodukfk, jenisproduk: e.jenisproduk }
                $scope.item4.detailjenisproduk = { id: e.objectdetailjenisprodukfk, detailjenisproduk: e.detailjenisproduk }
            }
            $scope.batalProduk = function () {
                $scope.item4.id = undefined
                $scope.item4.namaproduk = undefined
                // $scope.item4.jenisproduk = undefined
                $scope.item4.detailjenisproduk = undefined
            }
            $scope.saveProduk = function () {
                if ($scope.item4.id == undefined) {
                    toastr.error("Pilih data dulu!")
                    return;
                }
                let json = {
                    id: $scope.item4.id,
                    detailjenisprodukfk: $scope.item4.detailjenisproduk.id,
                    // jenisprodukfk: $scope.item4.jenisproduk.id,
                }
                medifirstService.post('laboratorium/update-produk', json).then(function (e) {
                    loadMasterProduk()
                    $scope.batalProduk()
                    loadCombo()
                })
            }
            //***********************************

        }
    ]);
});

// http://127.0.0.1:1237/printvb/farmasiApotik?cetak-label-etiket=1&norec=6a287c10-8cce-11e7-943b-2f7b4944&cetak=1