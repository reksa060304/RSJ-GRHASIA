define(['initialize','Configuration'], function (initialize, configuration) {
    'use strict';
    initialize.controller('DaftarOrderBarangVerifikasiCtrl', ['$scope', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($scope, $state, cacheHelper, dateHelper, medifirstService) {
            $scope.item = {};
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.isRouteLoading = false;
            $scope.isanalis = false
            $scope.isverif = false
            $scope.selectedData3 = []
            var pegawaiUser = {}
            loadCombo();
            LoadCache();

            function LoadCache() {
                var chacePeriode = cacheHelper.get('DaftarOrderBarangCtrl');
                if (chacePeriode != undefined) {
                    $scope.item.tglAwal = new Date(chacePeriode[0]);
                    $scope.item.tglAkhir = new Date(chacePeriode[1]);
                    init();
                }
                else {
                    $scope.item.tglAwal = new moment($scope.now).format('YYYY-MM-DD 00:00');
                    $scope.item.tglAkhir = new moment($scope.now).format('YYYY-MM-DD 23:59');
                    init();
                }
            }
           
            function loadCombo() {
                $scope.dataLogin = medifirstService.getPegawaiLogin();
                medifirstService.getPart("logistik/get-combo-barang-logistik", true, true, 20).then(function (data) {
                    $scope.listNamaBarang = data;
                });  
                
                medifirstService.get("logistik/get-combo-logistik", true).then(function (dat) {
                    var dataCombo = dat.data;
                    $scope.listDataJabatan = dataCombo.jabatan;
                    if(dataCombo.detaillogin[0].isanalis == true){
                        $scope.isanalis = true
                        $scope.isverif = false

                    }
                    if (dataCombo.detaillogin[0].isverif == true) {
                        $scope.isverif = true
                        $scope.isanalis = false

                    }
                });

                medifirstService.getPart("logistik/get-combo-pegawai-logistik", true, true, 20).then(function (data) {
                    $scope.ListDataPegawai = data;
                });
            }

            $scope.newOrder = function () {
                $state.go('OrderBarangLogistik')
            }

            $scope.BatalCetak = function () {
                $scope.popUp.close();            
            }

            $scope.deleteOrder = function () {
                if ($scope.dataSelected == undefined) {
                    alert("Pilih yg akan di hapus!!")
                    return;
                }
                if ($scope.dataSelected.statusorder != '') {
                    alert("Sudah di kirim tidak dapat di hapus!!")
                    return;
                }
                var stt = 'false'
                if (confirm('Hapus Order? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    return;
                }
                var objSave =
                {
                    norecorder: $scope.dataSelected.norec
                }

                medifirstService.post('logistik/delete-order-barang-ruangan',objSave).then(function (e) {
                    init()
                })
            }

            function init() {
                $scope.isRouteLoading = true;
                // var ins =""
                // if ($scope.item.instalasi != undefined){
                //     var ins ="&dpid=" +$scope.item.instalasi.id
                // }
                var rg = ""
                if ($scope.item.namaruangantujuan != undefined) {
                    var rg = "&ruangantujuanfk=" + $scope.item.namaruangantujuan
                }
                var produkfk = ""
                if ($scope.item.namaBarang != undefined) {
                    var produkfk = "&produkfk=" + $scope.item.namaBarang.id
                }
                var isverif = ''
                
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                medifirstService.get("logistik/get-data-order-barang-ruangan-baru?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    "&noorder=" + $scope.item.struk + rg + produkfk + isverif
                    , true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        // for (var i = 0; i < dat.data.daftar.length; i++) {
                        //     dat.data.daftar[i].no = i + 1                           
                        // }
                        var data2 = dat.data.daftar;  
                        $scope.data2 = data2
                        for (var i = 0; i < data2.length; i++) {
                            data2[i].no = i + 1
                            data2[i].statCheckbox2 = false
                            for (let e = 0; e < data2[i].details.length; e++) {
                                data2[i].details[e].no = e + 1;                            
                            }
                        }
                        $scope.group = [
                            {
                                field: 'noorder',
                            }
                        ]
                        $scope.dataGrid = new kendo.data.DataSource({
                            data: data2,
                            group: $scope.group,
                            pageSize: 100,
                            total: data2.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                        no:{ editable: false, type: "string"},
                                        namaproduk:{ editable: false, type: "string"},
                                        kdbhp:{ editable: false, type: "string"},
                                        jumlahstokgudang:{ editable: false, type: "string"},
                                        jumlahstokruangan:{ editable: false, type: "string"},
                                        qtyproduk:{ editable: false, type: "string"},
                                        qtyberi:{ editable: true, type: "number"},
                                        isveriforder:{ editable: false, type: "string"},
                                        namaruanganasal:{ editable: false, type: "string"},

                                    }
                                }
                            }
                        });
                        // $scope.dataGrid = dat.data.daftar;
                        pegawaiUser = dat.data.datalogin
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
                cacheHelper.set('DaftarOrderBarangCtrl', chacePeriode);
            }

            $scope.getRuangan = function () {
                $scope.listRuangan = $scope.item.instalasi.ruangan;
            }

            $scope.cariFilter = function () {
                init();
            }            

            $scope.CetakBuktiLayanan = function () {
                var stt = 'false'
                if (confirm('View resep? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/farmasiApotik?cetak-strukresep=1&nores=NonLayanan' + $scope.dataSelected.norec + '&view=' + stt + '&user=' + pegawaiUser.userData.namauser, function (response) {
                    //aadc=response;
                });
            }

            $scope.EditOrder = function () {
                if ($scope.dataSelected.status == 'Terima Order Barang') {
                    alert('Tidak bisa mengubah order ini!')
                    return;
                }
                if ($scope.dataSelected.statusorder == 'Sudah Kirim') {
                    alert('Sudah Di Kirim!')
                    return;
                }
                var chacePeriode = {
                    0: $scope.dataSelected.norec,
                    1: 'EditOrder',
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }
                cacheHelper.set('OrderBarangLogistikCtrl', chacePeriode);
                $state.go('OrderBarangLogistik')
            }

            $scope.KirimBarang = function () {
                if ($scope.dataSelected.status != 'Terima Order Barang') {
                    alert('Tidak bisa mengirim ke ruangan Sendiri!')
                    return;
                }
                if ($scope.dataSelected.statusorder == 'Sudah Kirim') {
                    alert('Sudah Di Kirim!')
                    return;
                }
                if ($scope.dataSelected.isveriforder != '✔') {
                    alert('Barang belum diverifikasi, tidak bisa diambil!')
                    return;
                }
                var chacePeriode = {
                    0: '',
                    1: $scope.dataSelected.norec,
                    2: 'KirimBarangBaru',
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }
                cacheHelper.set('KirimBarangLogistikBaruCtrl', chacePeriode);
                $state.go('KirimBarangLogistikBaru')
            }           
           
            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }
            $scope.selectRow2 = function (e) {
                var element = $(e.currentTarget);
                var checked = element.is(':checked'),
                    row = element.closest('tr'),
                    grid = $("#kGrid").data("kendoGrid"),
                    // grid = $("#grid").data("kendoGrid"),
                    dataItem = grid.dataItem(row);
                if (checked) {
                    dataItem.statCheckbox2 = true;
                    $scope.selectedData3.push(dataItem);
                    row.addClass("k-state-selected");
                } else {
                    dataItem.statCheckbox2 = false;
                    for (var i = 0; i < $scope.selectedData3.length; i++)
                        if ($scope.selectedData3[i].norec == dataItem.norec) {
                            $scope.selectedData3.splice(i, 1);
                            break;
                        }
                    row.removeClass("k-state-selected");
                }
                console.log($scope.selectedData3);
            }
            $scope.mainGridOptions = {
                toolbar: [
                    "excel",
                ],
                excel: {
                    fileName: "DaftarOrderBarang.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:K1"];
                    sheet.name = "Sheet";

                    var myHeaders = [{
                        value: "Daftar Order Barang",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                editable: true,
                scrollable: true,
                columns: [
                    {
                        "title": "#",
                        template: "# if (statCheckbox2) { #" +
                            "<input type='checkbox' class='checkbox' ng-click='selectRow2($event)' checked />" +
                            "# } else { #" +
                            "<input type='checkbox' class='checkbox' ng-click='selectRow2($event)' />" +
                            "# } #",
                        width: "30px"
                    },
                    {
                        "field": "no",
                        "title": "No",
                        "width": "15px",
                    },
                    {
                        "field": 'namaruanganasal',
                        "title": 'Ruangan',
                        "width": "80px",

                    },
                    {
                        "title": "Jenis Barang",
                        "width": "70px",
                        "columns": [{
                                "field": "namaproduk",
                                "title": "Nama Produk",
                                "width": "80px",
                            },
                            {
                                "field": "kdbhp",
                                "title": "Kode Produk",
                                "width": "50px",
                            },
                        ]
                    },
                    {
                        "title": "Saldo",
                        "width": "70px",
                        "columns": [{
                                "field": "jumlahstokgudang",
                                "title": "Gudang",
                                "width": "30px",
                            },
                            {
                                "field": "jumlahstokruangan",
                                "title": "Ruangan",
                                "width": "30px",
                            },
                        ]
                    },
                    {
                        "title": "Jumlah",
                        "width": "70px",
                        "columns": [{
                                "field": "qtyproduk",
                                "title": "Permintaan",
                                "width": "30px",
                            },
                            {
                                "field": "qtyberi",
                                "title": "Diberikan",
                                "width": "30px",
                            },
                        ]
                    },
                    {
                        "field": "isveriforder",
                        "title": "Verif",
                        "width": "20px",
                    },
                    {
                        "field": "noorder",
                        "title": "SPB",
                        "hidden": true
                    },
                ]
        }

            $scope.data2 = function (dataItem) {
                return {
                    dataSource: new kendo.data.DataSource({
                        data: dataItem.details,
                        schema: {
                                model: {
                                    fields: {
                                        no:{ editable: false, type: "string"},
                                        namaproduk:{ editable: false, type: "string"},
                                        kdbhp:{ editable: false, type: "string"},
                                        jumlahstokgudang:{ editable: false, type: "string"},
                                        jumlahstokruangan:{ editable: false, type: "string"},
                                        qtyproduk:{ editable: false, type: "string"},
                                        qtyberi:{ editable: true, type: "number"},
                                        isveriforder:{ editable: false, type: "string"},
                                    }
                                }
                            }
                    }),
                    editable: true,
                    columns: [
                        {
                            "field": "no",
                            "title": "No",
                            "width": "35px",
                        },
                        {
                            "title": "Jenis Barang",
                            "width": "70px",
                            "columns": [
                                {
                                    "field": "namaproduk",
                                    "title": "Nama Produk",
                                    "width": "80px",
                                },
                                {
                                    "field": "kdbhp",
                                    "title": "Kode Produk",
                                    "width": "50px",
                                },
                            ]
                        },
                        {
                            "title": "Saldo",
                            "width": "70px",
                            "columns": [{
                                    "field": "jumlahstokgudang",
                                    "title": "Gudang",
                                    "width": "50px",
                                },
                                {
                                    "field": "jumlahstokruangan",
                                    "title": "Ruangan",
                                    "width": "50px",
                                },
                            ]
                        },
                        {
                            "title": "Jumlah",
                            "width": "70px",
                            "columns": [{
                                    "field": "qtyproduk",
                                    "title": "Permintaan",
                                    "width": "50px",
                                },
                                {
                                    "field": "qtyberi",
                                    "title": "Diberikan",
                                    "width": "50px",
                                },
                            ]
                        },
                        {
                            "field": "isveriforder",
                            "title": "Verif",
                            "width": "40px",
                        },
                    ]
                }
            };
           
            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD/MM/YYYY');
            }
                   
            $scope.cetak = function () {               
                $scope.popUp.center().open();
            }

            $scope.CetakAh = function () {

                var jabatan1 = ''
                if ($scope.item.DataJabatan2 != undefined) {
                    jabatan1 = $scope.item.DataJabatan2.namajabatan;
                }

                var pegawai1 = ''
                if ($scope.item.DataPegawai2 != undefined) {
                    pegawai1 = $scope.item.DataPegawai2.id;
                }

                var jabatan2 = ''
                if ($scope.item.DataJabatan != undefined) {
                    jabatan2 = $scope.item.DataJabatan.namajabatan;
                }

                var pegawai2 = ''
                if ($scope.item.DataPegawai != undefined) {
                    pegawai2 = $scope.item.DataPegawai.id;
                }

                var stt = 'false'
                if (confirm('View Bukti Order? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/logistik?cetak-bukti-order=1&nores=' + $scope.dataSelected.norec + '&pegawaiMegetahui=' + pegawai1 + '&pegawaiMeminta=' + pegawai2
                    + '&jabatanMengetahui=' + jabatan1 + '&jabatanMeminta=' + jabatan2 + '&view=' + stt + '&user=' + pegawaiUser[0].namalengkap, function (response) {
                        //aadc=response; 

                    });                
                $scope.popUp.close();
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
            $scope.simpanAnalis = function(){
                // if ($scope.selectedData3 == undefined) {
                //     toastr.error('Pilih data dahulu!!!')
                //     return
                // }
                for (let i = 0; i < $scope.selectedData3.length; i++) {
                    if ($scope.selectedData3[i].isveriforder == '✔') {
                        toastr.error('Sudah diverifikasi!!!')
                        return
                    }
                }
                console.log($scope.selectedData3);
                // return
                var objSave = {
                    data: $scope.selectedData3
                }
                medifirstService.post('logistik/update-op', objSave).then(function(){
                    init()
                })
            }
            $scope.simpanVerif = function(data){
                for (let i = 0; i < $scope.selectedData3.length; i++) {
                    if ($scope.selectedData3[i].isveriforder == '✔') {
                        toastr.error('Sudah diverifikasi!!!')
                        return
                    }
                }
                $scope.verif.center().open()
                // $scope.dataverif = data
            }
            $scope.simpanVeriff = function () {
                // console.log(dataverif);
                
                var objSave = {
                    'tglverif': moment($scope.item.tglverif).format('YYYY-MM-DD HH:mm:ss'),
                    'data': $scope.selectedData3
                }
                medifirstService.post('bhp/simpan-verif-order', objSave).then(function () {
                    // $scope.item.tglverif = undefined
                    init()
                })
                $scope.verif.close()
            }
            $scope.cetaksppb = function(){
                if($scope.dataSelected == undefined){
                    toastr.error('Pilih data dulu')
                    return
                }

                window.open(configuration.baseApiBackend+'bhp/cetak-sppb?noorder='+$scope.dataSelected.noorder+"&kdprofile="+ 30, '_blank')
            }
            $scope.cetakspb = function () {
                if ($scope.dataSelected == undefined) {
                    toastr.error('Pilih data dulu')
                    return
                }

                window.open(configuration.baseApiBackend + 'bhp/cetak-spb?noorder=' + $scope.dataSelected.noorder + "&kdprofile=" + 30, '_blank')
            }
            //***********************************
        }
    ]);
});
