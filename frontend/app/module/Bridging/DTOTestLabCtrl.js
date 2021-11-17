define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DTOTestLabCtrl', ['$rootScope', '$scope', 'ModelItem', '$state', 'DateHelper', 'MedifirstService', '$mdDialog',
        function ($rootScope, $scope, ModelItem, $state, DateHelper, medifirstService, $mdDialog) {
            $scope.now = new Date();
            $scope.isSave = true;
            $scope.itemsave = {}
            $scope.item = {}
            $scope.item.start = 1
            $scope.item.limit = 10
            $scope.item.startdate = new moment($scope.now).format('YYYY-MM-DD 00:00');
            $scope.item.enddate = new moment($scope.now).format('YYYY-MM-DD 23:59');

            $scope.isRouteLoading = false;
            $scope.isShowPotensi = true;
            $scope.showPotensi = function () {
                $scope.isShowPotensi = !$scope.isShowPotensi;
            }
            medifirstService.get(`bridging/newallrecord/list-faskes/100/1`).then(function (e) {
               $scope.listfaskes = e.data.data
            })

            medifirstService.get(`bridging/newallrecord/list-lab/100/1`).then(function (e) {
               $scope.listlab = e.data.data
            })
            $scope.listjenistest = [
                { "id": 1, "nama": "PCR" },
                { "id": 2, "nama": "Rapid Test" },
                { "id": 3, "nama": "TCM" },
            ];
            $scope.getIsiJenisPemeriksaan = function (e) {
                if (!e) return;
                switch(e.id){
                    case 1:
                        $scope.listjenispemeriksaan = [
                            { "id": 1, "nama": "Swab Nasofaring", "refid":1 },
                            { "id": 2, "nama": "Swab Orofaring", "refid":1 },
                            { "id": 3, "nama": "Sputum", "refid":1 },
                            { "id": 4, "nama": "Bal Fluid", "refid":1 },
                            { "id": 5, "nama": "Cairan Spirasi Trakhea", "refid":1 },
                            { "id": 6, "nama": "Serum", "refid":1 },
                            { "id": 7, "nama": "Lainnya", "refid":1 },
                            { "id": 8, "nama": "Swab Naso-Orofaring", "refid":1 },
                        ]
                        break;
                    case 2:
                        $scope.listjenispemeriksaan = [
                            { "id": 9, "nama": "Antigen", "refid":2 },
                            { "id": 10, "nama": "Genose", "refid":2 },
                        ]
                        break;
                    case 3:
                        $scope.listjenispemeriksaan = [
                            { "id": 11, "nama": "TCM", "refid":3 },
                        ]
                        break;
                }
            }
            $scope.listtujuanpemeriksaan = [
                { "id": 1, "nama": "Diagnosis Suspek" },
                { "id": 2, "nama": "Diagnosis Kontak Erat" },
                { "id": 3, "nama": "Skrining Pelaku Perjalanan" },
                { "id": 4, "nama": "Skrining Alasan Medis" },
                { "id": 5, "nama": "Skrining Alasan Lainnya" },
                { "id": 6, "nama": "Follow Up" },
            ];
            $scope.listhasil = [
                { "id": "P", "nama": "Positive" },
                { "id": "N", "nama": "Negative" },
                { "id": "I", "nama": "Inconclusive" },
                { "id": "F", "nama": "Invalid" },
            ];
            loadTesLab();

            $scope.cari = function () {
                loadTesLab()
            }

            function loadTesLab() {
                var start = 1
                if ($scope.item.start != undefined) {
                    start = $scope.item.start
                }
                var limit = 10
                if ($scope.item.limit != undefined) {
                    limit = $scope.item.limit
                }
                var startdate = moment($scope.item.startdate).format('YYYY-MM-DD 00:00');
                var enddate = moment($scope.item.enddate).format('YYYY-MM-DD 23:59');

                $scope.isRouteLoading = true
                medifirstService.get(`bridging/newallrecord/list-test-lab/${startdate}/${enddate}/${limit}/${start}`).then(function (e) {
                    $scope.isRouteLoading = false;
                    if (e.data.data != undefined && e.data.data != null) {
                        for (var i = 0; i < e.data.data.length; i++) {
                            e.data.data[i].no = i + 1
                            switch(e.data.data[i].jenis_test_id){
                                case 1:
                                    e.data.data[i].jenis_test = "PCR"
                                    break;
                                case 2:
                                    e.data.data[i].jenis_test = "Rapid Test"
                                    break;
                                case 3:
                                    e.data.data[i].jenis_test = "TCM"
                                    break;
                            }
                        }
                        $scope.dataSourceBrid = new kendo.data.DataSource({
                            data: e.data.data,
                            pageSize: 10,
                            serverPaging: false,
                        });
                    } else {
                        toastr.info("Gagal memuat data.", 'Info')
                    }
                })
            }
            $scope.formatTanggal = function (tanggal) {
                return moment(new Date(tanggal)).format("DD MMM YYYY HH:mm")
            }
            $scope.columnGridBrid = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "20px",
                    "attributes": { align: "center" }

                },
                {
                    "field": "nik",
                    "title": "NIK",
                    "width": "80px",
                },
                {
                    "field": "nama",
                    "title": "Nama",
                    "width": "100px",
                },
                {

                    "field": "no_pemeriksaan",
                    "title": "No Pemeriksaan",
                    "width": "50px",
                },
                {
                    "field": "jenis_test",
                    "title": "Jenis Test",
                    "width": "50px",
                },
                {
                    "field": "tgl_hasil",
                    "title": "Tgl Hasil",
                    "width": "75px",
                    "template": "<span class='style-left'>{{formatTanggal('#: tgl_hasil #')}}</span>"
                },
                {
                    "field": "tgl_pengambilan",
                    "title": "Tgl Pengambilan",
                    "width": "75px",
                    "template": "<span class='style-left'>{{formatTanggal('#: tgl_pengambilan #')}}</span>"
                },
                {
                    "command": [
                        { text: "Detail", click: DetailSpesimen },
                    ],
                    title: "#",
                    width: "10%",
                }
            ]
            function DetailSpesimen(e) 
            {
                $scope.isRouteLoading = true;
                e.preventDefault();
				var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                medifirstService.get(`bridging/newallrecord/detail-test-lab/${dataItem.testcovid_id}`).then(function (e) {
                    $scope.listDataDetails = e.data.data;
                    // medifirstService.get(`bridging/newallrecord/detail-faskes/${$scope.listDataDetails.faskes_id}`).then(function (e) {
                    //     console.log('faskes', e.data.data)
                    // })
    
                    // medifirstService.get(`bridging/newallrecord/detail-lab/${$scope.listDataDetails.lab_id}`).then(function (e) {
                    //     console.log('lab', e.data.data)
                    // })
                    for (let i = 0; i < $scope.listDataDetails.length; i++) {
                        const element = $scope.listDataDetails[i];
                        switch(element.jenis_test_id){
                            case 1:
                                $scope.listDataDetails[i].jenis_test_id = "PCR"
                                break;
                            case 2:
                                $scope.listDataDetails[i].jenis_test_id = "Rapid Test"
                                break;
                            case 3:
                                $scope.listDataDetails[i].jenis_test_id = "TCM"
                                break;
                        }
                        switch(element.jenis_pemeriksaan){
                            case 1:
                                $scope.listDataDetails[i].jenis_pemeriksaan = "Swab Nasofaring"
                                break;
                            case 2:
                                $scope.listDataDetails[i].jenis_pemeriksaan = "Swab Orofaring"
                                break;
                            case 3:
                                $scope.listDataDetails[i].jenis_pemeriksaan = "Sputum"
                                break;
                            case 4:
                                $scope.listDataDetails[i].jenis_pemeriksaan = "Bal Fluid"
                                break;
                            case 5:
                                $scope.listDataDetails[i].jenis_pemeriksaan = "Cairan Spirasi Trakhea"
                                break;
                            case 6:
                                $scope.listDataDetails[i].jenis_pemeriksaan = "Serum"
                                break;
                            case 7:
                                $scope.listDataDetails[i].jenis_pemeriksaan = "Lainnya"
                                break;
                            case 8:
                                $scope.listDataDetails[i].jenis_pemeriksaan = "Swab Naso-Orofaring"
                                break;
                            case 9:
                                $scope.listDataDetails[i].jenis_pemeriksaan = "Antigen"
                                break;
                            case 10:
                                $scope.listDataDetails[i].jenis_pemeriksaan = "Genose"
                                break;
                            case 11:
                                $scope.listDataDetails[i].jenis_pemeriksaan = "TCM"
                                break;
                        }
                        switch(element.tujuan_pemeriksaan){
                            case 1:
                                $scope.listDataDetails[i].tujuan_pemeriksaan = "Diagnosis Suspek"
                                break;
                            case 2:
                                $scope.listDataDetails[i].tujuan_pemeriksaan = "Diagnosis Kontak Erat"
                                break;
                            case 3:
                                $scope.listDataDetails[i].tujuan_pemeriksaan = "Skrining Pelaku Perjalanan"
                                break;
                            case 4:
                                $scope.listDataDetails[i].tujuan_pemeriksaan = "Skrining Alasan Medis"
                                break;
                            case 5:
                                $scope.listDataDetails[i].tujuan_pemeriksaan = "Skrining Alasan Lainnya"
                                break;
                            case 6:
                                $scope.listDataDetails[i].tujuan_pemeriksaan = "Follow Up"
                                break;
                        }
                        switch(element.hasil){
                            case "P":
                                $scope.listDataDetails[i].hasil = "Positive"
                                break;
                            case "N":
                                $scope.listDataDetails[i].hasil = "Negative"
                                break;
                            case "I":
                                $scope.listDataDetails[i].hasil = "Inconclusive"
                                break;
                            case "F":
                                $scope.listDataDetails[i].hasil = "Invalid"
                                break;
                        }
                    }
                    $scope.isRouteLoading = false;
                    $scope.listDataDetail = $scope.listDataDetails[0]
                    $scope.popupDetail.center().open()
                })
            }
            $scope.findOrang = function(nik){
                $scope.isRouteLoading = true;
                var objSend = {
                    "data" : {
                        "nik": nik
                    }
                }
                medifirstService.postNonMessage("bridging/newallrecord/get-orang-nik", objSend).then(function (e) {
                    $scope.isRouteLoading = false;
                    if(e.data.data == null){
                        $scope.itemsave.nama = null
                        toastr.error('Data tidak ditemukan')
                    } else {
                        $scope.itemsave.nama = e.data.data.nama
                        $scope.itemsave.orang_id = e.data.data.id
                    }
                });
            }
            $scope.tutup = function () {
                $scope.popupDetail.close()

            }
            $scope.klikGrid = function(dataSelected){
                $scope.dataSelected = dataSelected;
            }
            $scope.tambah = function (){
                $scope.itemsave = {};
                $scope.isSave = true;
                $scope.popUpTambah.center().open()
            }
            $scope.ubah = function (){
                if ($scope.dataSelected == undefined) {
                    toastr.error('Pilih data yang mau diubah')
                    return
                }
                $scope.isRouteLoading = true;
                medifirstService.get(`bridging/newallrecord/detail-test-lab/${$scope.dataSelected.testcovid_id}`).then(function (e) {
                    var data = e.data.data[0];
                    var jenistest = {id: data.jenis_test_id}
                    $scope.getIsiJenisPemeriksaan(jenistest);
                    for (let i = 0; i < $scope.listhasil.length; i++) {
                        const element = $scope.listhasil[i];
                        if(element.id == data.hasil){
                            $scope.itemsave.hasil = {id : data.hasil, nama: element.nama }
                            break;
                        }
                    }
                    for (let i = 0; i < $scope.listjenispemeriksaan.length; i++) {
                        const element = $scope.listjenispemeriksaan[i];
                        if(element.id == data.jenis_pemeriksaan){
                            $scope.itemsave.jenispemeriksaan = {id : data.jenis_pemeriksaan, nama: element.nama }
                            break;
                        }
                    }
                    $scope.itemsave.testcovid_id = data.id
                    $scope.itemsave.nik = data.nik
                    $scope.itemsave.nama = data.nama
                    $scope.itemsave.nopemeriksaan = data.no_pemeriksaan
                    $scope.itemsave.tujuanpemeriksaan = {id : data.tujuan_pemeriksaan, nama: $scope.listtujuanpemeriksaan[data.tujuan_pemeriksaan - 1].nama }
                    $scope.itemsave.tglpengambilan = data.tgl_pengambilan
                    $scope.itemsave.tglterima = data.tgl_terima
                    $scope.itemsave.tglperiksa = data.tgl_periksa
                    $scope.itemsave.tglhasil = data.tgl_hasil

                    $scope.isSave = false;
                    $scope.isRouteLoading = false;
                    $scope.popUpTambah.center().open()
                })
            }
            $scope.hapus = function (){
                if ($scope.dataSelected == undefined) {
                    toastr.error('Pilih data yang mau dihapus')
                    return
                }
                var confirm = $mdDialog.confirm()
                    .title('Peringatan')
                    .textContent(`Yakin mau menghapus data no pemeriksaan ${$scope.dataSelected.no_pemeriksaan} ?`)
                    .ariaLabel('Lucky day')
                    .cancel('Tidak')
                    .ok('Ya')
                $mdDialog.show(confirm).then(function () {
                    var objDelete = {
                        "data": {
                            "testcovid_id":$scope.dataSelected.testcovid_id
                        }
                    }
                    $scope.isRouteLoading = true;
                    medifirstService.postNonMessage("bridging/newallrecord/delete-test-lab", objDelete).then(function (e) {
                        toastr.success(e.data.status);
                        loadTesLab()
                        $scope.batal();
                    })
                })
            }
            $scope.save = function () {
                if ($scope.itemsave.nama == undefined) {
                    toastr.error('Pasien harus diisi')
                    return
                }
                if ($scope.itemsave.jenistest == undefined) {
                    toastr.error('Jenis test harus diisi')
                    return
                }
                if ($scope.itemsave.faskes == undefined) {
                    toastr.error('Faskes harus diisi')
                    return
                }
                if ($scope.itemsave.lab == undefined) {
                    toastr.error('Lab harus diisi')
                    return
                }
                if ($scope.itemsave.nopemeriksaan == undefined) {
                    toastr.error('No pemeriksaan harus diisi')
                    return
                }
                if ($scope.itemsave.jenispemeriksaan == undefined) {
                    toastr.error('Jenis pemeriksaan harus diisi')
                    return
                }
                if ($scope.itemsave.tujuanpemeriksaan == undefined) {
                    toastr.error('Tujuan pemeriksaan harus diisi')
                    return
                }
                if ($scope.itemsave.tglpengambilan == undefined) {
                    toastr.error('Tanggal Pengambilan harus diisi')
                    return
                }
                if ($scope.itemsave.tglterima == undefined) {
                    toastr.error('Tanggal terima harus diisi')
                    return
                }
                if ($scope.itemsave.tglperiksa == undefined) {
                    toastr.error('Tanggal periksa harus diisi')
                    return
                }
                if ($scope.itemsave.tglhasil == undefined) {
                    toastr.error('Tanggl hasil harus diisi')
                    return
                }
                if ($scope.itemsave.hasil == undefined) {
                    toastr.error('Hasil harus diisi')
                    return
                }

                var objSave = {
                    "data": {
                        "jenis_test_id": $scope.itemsave.jenistest.id,
                        "faskes_id": $scope.itemsave.faskes.id,
                        "lab_id": $scope.itemsave.lab.id,
                        "no_pemeriksaan": $scope.itemsave.nopemeriksaan,
                        "jenis_pemeriksaan": $scope.itemsave.jenispemeriksaan.id,
                        "tujuan_pemeriksaan": $scope.itemsave.tujuanpemeriksaan.id,
                        "orang_id": $scope.itemsave.orang_id,
                        "tgl_pengambilan": moment($scope.itemsave.tglpengambilan).format('YYYY-MM-DD HH:mm:ss'),
                        "tgl_terima": moment($scope.itemsave.tglterima).format('YYYY-MM-DD HH:mm:ss'),
                        "tgl_periksa": moment($scope.itemsave.tglperiksa).format('YYYY-MM-DD HH:mm:ss'),
                        "tgl_hasil": moment($scope.itemsave.tglhasil).format('YYYY-MM-DD HH:mm:ss'),
                        "hasil": $scope.itemsave.hasil.id,
                    }
                }
                $scope.isRouteLoading = true;
                medifirstService.postNonMessage("bridging/newallrecord/add-test-lab", objSave).then(function (e) {
                    toastr.success(e.data.status);
                    loadTesLab()
                    $scope.batal();
                })
            }
            $scope.update = function () {
                if ($scope.itemsave.nopemeriksaan == undefined) {
                    toastr.error('No pemeriksaan harus diisi')
                    return
                }
                if ($scope.itemsave.jenispemeriksaan == undefined) {
                    toastr.error('Jenis pemeriksaan harus diisi')
                    return
                }
                if ($scope.itemsave.tujuanpemeriksaan == undefined) {
                    toastr.error('Tujuan pemeriksaan harus diisi')
                    return
                }
                if ($scope.itemsave.tglpengambilan == undefined) {
                    toastr.error('Tanggal Pengambilan harus diisi')
                    return
                }
                if ($scope.itemsave.tglterima == undefined) {
                    toastr.error('Tanggal terima harus diisi')
                    return
                }
                if ($scope.itemsave.tglperiksa == undefined) {
                    toastr.error('Tanggal periksa harus diisi')
                    return
                }
                if ($scope.itemsave.tglhasil == undefined) {
                    toastr.error('Tanggl hasil harus diisi')
                    return
                }
                if ($scope.itemsave.hasil == undefined) {
                    toastr.error('Hasil harus diisi')
                    return
                }

                var objSave = {
                    "data": {
                        "testcovid_id": $scope.itemsave.testcovid_id,
                        "no_pemeriksaan": $scope.itemsave.nopemeriksaan,
                        "jenis_pemeriksaan": $scope.itemsave.jenispemeriksaan.id,
                        "tujuan_pemeriksaan": $scope.itemsave.tujuanpemeriksaan.id,
                        "tgl_pengambilan": moment($scope.itemsave.tglpengambilan).format('YYYY-MM-DD HH:mm:ss'),
                        "tgl_terima": moment($scope.itemsave.tglterima).format('YYYY-MM-DD HH:mm:ss'),
                        "tgl_periksa": moment($scope.itemsave.tglperiksa).format('YYYY-MM-DD HH:mm:ss'),
                        "tgl_hasil": moment($scope.itemsave.tglhasil).format('YYYY-MM-DD HH:mm:ss'),
                        "hasil": $scope.itemsave.hasil.id,
                    }
                }
                $scope.isRouteLoading = true;
                medifirstService.postNonMessage("bridging/newallrecord/update-test-lab", objSave).then(function (e) {
                    toastr.success(e.data.status);
                    loadTesLab()
                    $scope.batal();
                })
            }
            $scope.batal = function () {
                $scope.isRouteLoading = false;
                $scope.itemsave = {};
                $scope.popUpTambah.close();
            }
        }
    ]);
});