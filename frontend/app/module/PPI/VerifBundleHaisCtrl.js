define(['initialize', 'Configuration'], function (initialize, config) {

    'use strict';

    initialize.controller('VerifBundleHaisCtrl', ['$state', 'MedifirstService', '$rootScope', '$scope', 'DateHelper', '$timeout', '$mdDialog',
        function ($state, medifirstService, $rootScope, $scope, dateHelper, $timeout, $mdDialog) {

            $scope.isRouteLoading = false;
            $scope.now = new Date();
            $scope.item = {};
            $scope.arrDokter = [];
            $scope.selectedData = [];
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
                $scope.isRouteLoading = true

                medifirstService.getPart('sysadmin/general/get-ruangan-part', true, true, 10).then(function (e) {
                    $scope.listRuangan = e;
                });
            
                medifirstService.get("verif-hais/get-combo-verif-hais", true).then(async function (dat) {
                    $scope.isRouteLoading = false;
                    var data = dat.data
                    
                    renderColumn(data);
                })
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
                medifirstService.get("verif-hais/get-bundlehais?" 
                    + "bulan=" + moment($scope.item.bulan).format("MM-YYYY")
                    + "&objectruanganfk=" + $scope.item.ruangan.id)
                    .then(function(res){
                        $scope.isRouteLoading = false;

                        verifikator = res.data.verifikator
                        
                        if(verifikator.includes(pegawai.id.toString()) && $scope.columndinamis[0].command.length == 0){
                            $scope.columndinamis[0].command.push({ text: "verifikasi", click: verifikasi })
                        }

                        for (let i = 0; i < res.data.dataHais.length; i++) {
                            const element = res.data.dataHais[i];
                            element.no = i+1
                            element.tglformat = $scope.formatTanggal(element.tglpemeriksaan);
                        }

                        dataLoad = res.data.dataHais;
                        creategrid()

                    })
            }

            function renderColumn(data) {
                setColumnDefault();
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    var header = $scope.columndinamis.map(function(e) { return e.title; }).indexOf(element.jenisbundle);
                    // console.log(header)
                    if(header > -1) {
                        var item = 
                        {
                            field: `w${element.id}`, 
                            title: element.namabundle, 
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
                            title: element.jenisbundle,
                            // width: 100,
                            headerAttributes: { style: "text-align : center" },
                            columns: [
                                {
                                    field: `w${element.id}`, 
                                    title: element.namabundle, 
                                    width: 150,
                                    template: `# if(w${element.id}==true) {# ✔ # } else {# - #} #`,
                                    headerAttributes: { style: "text-align : center" },
                                }
                            ]
                        }
                        $scope.columndinamis.push(item);
                    }
                }
               
                creategrid();
            }

            function setColumnDefault() {
                $scope.columndinamis = [
                    {
                        "command": [
                            
                        ],
                        title: "",
                        width: 100,
                        locked: true,
                    },
                    {
                        field: 'tglformat',
                        title: "TANGGAL",
                        width: 200,
                        locked: true,
                    },
                    {
                        field: 'no',
                        title: "NO",
                        width: 100,
                        locked: true,
                    },
                    {
                        field: 'namapasien',
                        title: "NAMA PASIEN",
                        width: 150,
                        locked: true,
                    },
                    {
                        field: "jeniskelamin",
                        title: "JENIS KELAMIN",
                        locked: true,
                    },
                    {
                        field: "suhu",
                        title: "SUHU",
                        locked: true
                    },
                    {
                        field: "umur",
                        title: "UMUR",
                        locked: true,
                    },
                    {
                        field: "diagnosa",
                        title: "DIAGNOSA MEDIS",
                        locked: true,
                    }
                ]
            }

            function creategrid () {
                $("#grid").empty();
                $("#grid").kendoGrid({
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
                if (!$scope.item.ruangan) {
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

            $scope.cari = function () {
                searchData();
            }

            $scope.onlyone = function (data,item) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    if($scope.item[element.field]) {
                        $scope.item[element.field] = false
                    }
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

                return medifirstService.post('verif-hais/verif-bundle-hais', {
                    norec: dataItem.norec,
                })
                .then(function(e){
                    searchData()
                })
            }

            $scope.laporanBundleHais = function(){

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
                    + 'verif-hais/laporan-bundle-hais?'
                    + 'bulan=' + moment($scope.item.bulan).format("MM-YYYY")
                    + '&objectruanganfk=' + $scope.item.ruangan.id
                    + '&kdprofile=' + profile.id)

            }

        }
    ])
})