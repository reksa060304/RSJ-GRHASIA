
define(['initialize', 'Configuration'], function (initialize, config) {

    'use strict';
    initialize.controller('InputCheklisApdNewCtrl', ['$state', 'MedifirstService', '$rootScope', '$scope', 'DateHelper', '$timeout', '$mdDialog',
        function ($state, medifirstService, $rootScope, $scope, dateHelper, $timeout, $mdDialog) {
            $scope.titleButton = 'Input APD'
            $scope.isRouteLoading = false;
            $scope.now = new Date();
            $scope.item = {};
            $scope.arrDokter = [];
            $scope.selectedData = [];
            var dataARR = []
            var dataLoad = []
            
            let verifikator = []
            let pegawai = JSON.parse(window.localStorage.getItem('pegawai'))
            
            FormLoad();

            function FormLoad() {
                $scope.item.bulan = $scope.now;
                $scope.monthOnly = {
                    start: "year",
                    depth: "year",
                    format: "MMMM yyyy",
                };
                LoadCombo();
            }

            $("#calendar").kendoCalendar();

            function LoadCombo() {
                medifirstService.getPart('sysadmin/general/get-ruangan-part', true, true, 10).then(function (e) {
                    $scope.listRuangan = e;
                });

                medifirstService.get('sysadmin/general/get-combo-pegawai').then(function (e) {
                    $scope.listPegawai = e.data
                });

                medifirstService.get('sysadmin/general/get-datacombo-jenispegawai-cppt').then(function (e) {
                    $scope.listJenisPegawai = e.data
                });

            
                $scope.isRouteLoading = true;
                medifirstService.get("rawatinap/get-master-audit-apd", true).then(async function (dat) {
                    $scope.isRouteLoading = false;
                    var data = dat.data
                    // olah data in here
                    // changeFormatdata(data);
                    // await searchData();
                    // crate grid in here
                    // console.log(data)
                    renderColumn(data);
                })
            }

            $scope.search = function () {
                if($scope.item.ruangan) {
                    medifirstService.get('sysadmin/general/get-tindakan?idRuangan='+ $scope.item.ruangan.id, true, true, 10).then(function (e) {
                        $scope.listTindakan = e;
                    });
                }
            }

            function searchData() {
                if(!$scope.item.bulan) {
                    toastr.error("Harap pilih bulan terlebih dahulu !");
                    return
                }

                if(!$scope.item.ruangan) {
                    toastr.error("Harap pilih ruangan terlebih dahulu !");
                    return
                }

                $scope.isRouteLoading = true;
                medifirstService.get(`rawatinap/get-audit-apd?bulan=${moment($scope.item.bulan).format("MM-YYYY")}&objectruanganfk=${$scope.item.ruangan.id}`).then(function (dat) {
                    $scope.isRouteLoading = false;
                    
                    verifikator = dat.data.verifikator
                    
                    if(verifikator.includes(pegawai.id.toString()) && $scope.columndinamis[0].command.length == 2){
                        $scope.columndinamis[0].command.push({ text: "verifikasi", click: verifikasi })
                    }

                    for (let i = 0; i < dat.data.auditapd.length; i++) {
                        const element = dat.data.auditapd[i];
                        element.tanggalformat = $scope.formatTanggal(element.tanggal);
                    }
                    dataLoad = dat.data.auditapd;
                    creategrid()
                })
            }


            function renderColumn(data) {
                setColumnDefault();
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    var header = $scope.columndinamis.map(function(e) { return e.title; }).indexOf(element.header);
                    if(header > -1) {
                        var item = 
                        {
                            field: `w${element.id}`, 
                            title: element.description, 
                            width: 150,
                            template: `# if(w${element.id}==true) {# ✔ # } else {# - #} #`,
                            headerAttributes: { style: "text-align : center" },
                        }
                        // console.log(item);
                        $scope.columndinamis[header].columns.push(item);
                    } else {
                        var item = 
                        { 
                            field: '', 
                            title: element.header,
                            // width: 100,
                            headerAttributes: { style: "text-align : center" },
                            columns: [
                                {
                                    field: `w${element.id}`, 
                                    title: element.description, 
                                    width: 150,
                                    template: `# if(w${element.id}==true) {# ✔ # } else {# - #} #`,
                                    headerAttributes: { style: "text-align : center" },
                                }
                            ]
                        }
                        $scope.columndinamis.push(item);
                    }
                }
               
                // console.log($scope.columndinamis);
                creategrid();
            }

            function setColumnDefault() {
                $scope.columndinamis = [
                    {
                        "command": [
                            { text: "Edit", click: editData },
                            { text: "Hapus", click: hapusData }
                        ],
                        title: "",
                        width: 100,
                        locked: true,
                    },
                    {
                        field: 'observer',
                        title: "OBSERVER",
                        width: 200,
                        locked: true,
                    },
                    {
                        field: 'tanggalformat',
                        title: "TANGGAL",
                        width: 100,
                        locked: true,
                    },
                    {
                        field: 'profesi',
                        title: "PROFESI \nYANG DIAUDIT",
                        width: 150,
                        locked: true,
                    },
                    {
                        field: 'namaproduk',
                        title: "JENIS AKTIFITAS",
                        width: 250,
                        locked: true,
                    },
                ]
            }

            function creategrid () {
                $("#grid").empty();
                $("#grid").kendoGrid({
                    toolbar:
                    [
                        {
                            name: "tambah",
                            text: "Tambah",
                            template: '<button class="k-button k-button-icontext addData">Tambah Data</button>'
                        },
                    ],
                    dataSource: {
                        data: dataLoad,
                        pageSize: 10
                    },
                    pageable: true,
                    scrollable: true,
                    // editable: true,
                    selectable: "single",
                    change: onDataBound,
                    columns: $scope.columndinamis
                }).data("kendoGrid");
            }

            $('body').on('click','.addData',function(e){
                // $("#grid").data("kendoGrid").addRow();
                if ($scope.item.ruangan == undefined) {
                    toastr.error('Harap pilih Ruangan terlebih dahulu !')
                    return
                }

                $scope.popUpIndex.center().open();
            });

            $scope.formatTanggal = function (tanggal) {
                if (tanggal != "null")
                    return moment(tanggal).format('DD-MMM-YYYY');
                else
                    return '-'
            }
            
            $scope.bulanSelected = moment($scope.item.bulan).format("MMMM YYYY")

            $scope.getBulan = function () {
                $scope.bulanString = moment($scope.item.bulan).format("MMMM YYYY")
                return "<center>" + $scope.bulanString + "</center>";
            }

            function onDataBound (e) {
                var grid = $("#grid").data("kendoGrid");
                if (grid.select().length > 0) {
                    var selectedItem = grid.dataItem(grid.select());
                    if (selectedItem != null) {
                        $scope.dataSelected = selectedItem;
                    }
                }
            }

            $scope.batal = function () {
                $scope.popUpIndex.close();
                clear()
            }

            function clear() {
                delete $scope.item.observer
                delete $scope.item.tanggal
                delete $scope.item.profesi
                delete $scope.item.aktifitas
                for (let i = 0; i < $scope.columndinamis.length; i++) {
                    const element = $scope.columndinamis[i];
                    if(element.field == '') {

                        for (let j = 0; j < element.columns.length; j++) {
                            const element2 = element.columns[j];
                            delete $scope.item[element2.field]
                        }
                    }
                }
            }

            function editData(e) 
            {
                e.preventDefault();
                var grid = $("#grid").data("kendoGrid");
				var dataItem = grid.dataItem($(e.currentTarget).closest("tr"));

                if ($scope.item.ruangan == undefined) {
                    toastr.error('Harap pilih Ruangan terlebih dahulu !')
                    return
                }

                if(dataItem.isverifikasi == true && (verifikator.includes(pegawai.id.toString()) == false)){
                    toastr.error('Data Sudah Diverifikasi !')
                    return
                }

                $scope.item.norecaudit = dataItem.norec
                $scope.item.observer = { id: dataItem.objectpegawaifk, namalengkap: dataItem.observer, }
                $scope.item.tanggal = dataItem.tanggal
                $scope.item.profesi = { value: dataItem.objectjenispegawaifk, text: dataItem.profesi, }
                $scope.item.aktifitas = { id: dataItem.jenisaktifitas, namaproduk: dataItem.namaproduk, }

                for (let i = 0; i < $scope.columndinamis.length; i++) {
                    const element = $scope.columndinamis[i];
                    if(element.field == '') {
                        for (let j = 0; j < element.columns.length; j++) {
                            const element2 = element.columns[j];
                            $scope.item[element2.field] = dataItem[element2.field]
                        }
                    }
                    
                }
                $scope.popUpIndex.center().open();
            }

            function hapusData(e) 
            {
                e.preventDefault();
                var grid = $("#grid").data("kendoGrid");
				var dataItem = grid.dataItem($(e.currentTarget).closest("tr"));

                var confirm = $mdDialog.confirm()
                    .title('Peringatan')
                    .textContent('Yakin mau menghapus data?')
                    .ariaLabel('Lucky day')
                    .cancel('Tidak')
                    .ok('Ya')
                $mdDialog.show(confirm).then(function () {
                    medifirstService.post('rawatinap/delete-audit-apd',{norec:dataItem.norec}).then(function(e){
                        searchData()
                    })
                })
            }

            $scope.SaveRow = function () {

                if(!$scope.item.ruangan){
                    toastr.error("Harap pilih Ruangan terlebih dahulu.")
                    return
                }
                if(!$scope.item.observer){
                    toastr.error("Harap pilih Observer terlebih dahulu.")
                    return
                }
                if(!$scope.item.tanggal){
                    toastr.error("Harap pilih Tanggal terlebih dahulu.")
                    return
                }
                if(!$scope.item.profesi){
                    toastr.error("Harap pilih Profesi terlebih dahulu.")
                    return
                }
                if(!$scope.item.aktifitas){
                    toastr.error("Harap isi Jenis Aktifitas terlebih dahulu.")
                    return
                }


                var jsontemp = {}
                for (let i = 0; i < $scope.columndinamis.length; i++) {
                    const element = $scope.columndinamis[i];
                    if(element.field == '') {

                        for (let j = 0; j < element.columns.length; j++) {
                            const element2 = element.columns[j];
                            jsontemp[element2.field] = $scope.item[element2.field]
                        }
                    }
                    
                }
                var json = {
                    "norec": $scope.item.norecaudit == undefined ? '' : $scope.item.norecaudit,
                    "objectpegawaifk": $scope.item.observer.id,
                    "tanggal": moment($scope.item.tanggal).format("YYYY-MM-DD"),
                    "objectjenispegawaifk": $scope.item.profesi.value,
                    "jenisaktifitas": $scope.item.aktifitas.id,
                    "objectruanganfk": $scope.item.ruangan.id,
                }
                const jsonsave = { ...json, "detail": jsontemp, }

                $scope.isRouteLoading = true;
                medifirstService.post("rawatinap/save-audit-apd", jsonsave).then(function (dat) {
                    $scope.isRouteLoading = false;

                    // toastr.info(`Data ${$scope.item.aktifitas} berhasil ditambahkan`);
                    $scope.popUpIndex.close();
                    clear()
                    searchData()
                })
            }

            $scope.save = function () {
                if ($scope.item.ruangan == undefined) {
                    toastr.error('Ruangan Tidak Boleh Kosong')
                    return
                }
            }

            $scope.cari = function () {
                searchData();
            }

            $scope.onlyone = function (item) {

                if(item == "w9" || item == "w10") {
                    $scope.item["w9"] = false;
                    $scope.item["w10"] = false;
                }

                if(item == "w11" || item == "w12") {
                    $scope.item["w11"] = false;
                    $scope.item["w12"] = false;
                }
                $scope.item[item] = true;
            }

            function verifikasi(e){
                e.preventDefault()

				let dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                if(dataItem.isverifikasi == true){
                    toastr.error("Data Telah diverifikasi")
                    return
                }

                return medifirstService.post('rawatinap/verifikasi-audit-apd', {
                    norec: dataItem.norec,
                })
                .then(function(e){
                    searchData()
                })
            }

            $scope.laporanAPD = function(){
                if(!$scope.item.bulan) {
                    toastr.error("Harap pilih bulan terlebih dahulu !");
                    return
                }

                if(!$scope.item.ruangan) {
                    toastr.error("Harap pilih ruangan terlebih dahulu !");
                    return
                }

                var profile = JSON.parse(localStorage.getItem('profile'));

                window.open(config.baseApiBackend
                    + 'report/cetak-apd-bulanan?'
                    + 'bulan=' + moment($scope.item.bulan).format("MM-YYYY")
                    + '&objectruanganfk=' + $scope.item.ruangan.id
                    + '&kdprofile=' + profile.id)
                    .then(function(res){
                        // console.log(res.data)
                    })
                

            }

            $scope.laporanJumlahAPD = function(){
                if(!$scope.item.bulan) {
                    toastr.error("Harap pilih bulan terlebih dahulu !");
                    return
                }

                if(!$scope.item.ruangan) {
                    toastr.error("Harap pilih ruangan terlebih dahulu !");
                    return
                }

                var profile = JSON.parse(localStorage.getItem('profile'));

                window.open(config.baseApiBackend
                    + 'report/cetak-jumlah-apd?'
                    + 'bulan=' + moment($scope.item.bulan).format("MM-YYYY")
                    + '&objectruanganfk=' + $scope.item.ruangan.id
                    + '&kdprofile=' + profile.id)
                    .then(function(res){
                        // console.log(res.data)
                    })
            }

            /////////////////////////////// // ///////
        }
    ]);

});