define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('Rekapan10MasalahKeperawatanCtrl', ['MedifirstService', 'CacheHelper', '$scope', 'DateHelper', '$state', 'ModelItem',
        function (medifirstService, cacheHelper, $scope, DateHelper, $state, ModelItem) {
            //Inisial Variable 
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};
            $scope.itemD = {};
            $scope.isRouteLoading = false;

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }
            $scope.formatJam = function (tanggal) {
                return moment(tanggal).format('HH:mm');
            }

            $scope.tglMeninggal = '';
            $scope.Page = {
                refresh: true,
                pageSizes: true,
                buttonCount: 5
            }
            $scope.listInstalasi = [
                {text:'Rawat Jalan', 'value': '1'},
                {text:'Rawat Inap', 'value': '2'},
                {text:'IGD', 'value': '3'},
            ]
            var kelompokUserLogin = ModelItem.getStatusUser()
            if (kelompokUserLogin == 'radiologi' || kelompokUserLogin == 'laborat') {
                $scope.isPenunjang = true
            }
            loadCombo()

            function loadCombo() {
                medifirstService.get("registrasi/laporan/get-combo-box-laporan-pengunjung")
                    .then(function (data) {
                        $scope.listRuangans = data.data.ruangan
                        $scope.listDokter = data.data.dokter
                    })

                medifirstService.get("sysadmin/general/get-combo-address")
                    .then(function (data) {
                        $scope.listKotaKabupaten = data.data.kotakabupaten
                    })

            }
            loadFirst()

            function loadFirst() {
                var chacePeriode = cacheHelper.get('RegistrasiPasienLamaRevCtrl');
                if (chacePeriode != undefined) {
                    var arrPeriode = chacePeriode.split('~');
                    $scope.item.periodeAwal = new Date(arrPeriode[0]);
                    $scope.item.periodeAkhir = new Date(arrPeriode[1]);

                } else {
                    $scope.item.periodeAwal = moment($scope.now).format('YYYY-MM-DD 00:00');
                    $scope.item.periodeAkhir = moment($scope.now).format('YYYY-MM-DD 23:59');
                }
            }
            // loadData()
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
            // loadData()

            function loadData() {

                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.periodeAwal).format('DD-MMM-YYYY HH:mm');
                var tglAkhir = moment($scope.item.periodeAkhir).format('DD-MMM-YYYY HH:mm');
                var instalasi = $scope.item.instalasi.value

                var rm = ""
                if ($scope.item.noRM != undefined) {
                    rm = "&nocm=" + $scope.item.noRM
                }

                var pasien = ""
                if ($scope.item.namaPasien != undefined) {
                    pasien = "&nama=" + $scope.item.namaPasien
                }

                var namaruangan = ""
                if ($scope.item.ruangan != undefined) {
                    namaruangan = "&ruanganId=" + $scope.item.ruangan.id
                }

                var dokter = ""
                if ($scope.item.dokter != undefined) {
                    dokter = "&dokter=" + $scope.item.dokter.id
                }

                var kotaKab = ""
                if ($scope.item.kabupaten != undefined) {
                    kotaKab = "&kotaKab=" + $scope.item.kabupaten.id
                }

                medifirstService.get("registrasi/laporan/get-data-masalah-Perawat?" +
                        "tglAwal=" + tglAwal +
                        "&tglAkhir=" + tglAkhir +
                        "&instalasi=" + instalasi)
                    .then(function (data) {
                        $scope.isRouteLoading = false;
                        for (var i = 0; i < data.data.data.length; i++) {
                            data.data.data[i].no = i + 1
                        }
                        $scope.dataSourceGrid = new kendo.data.DataSource({
                            data: data.data.data,
                            pageSize: 50,
                            total: data.data.data.length,

                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {}
                                }
                            }

                        });
                    });

            };



            $("#kGrid").kendoGrid({
                toolbar: ["excel"],
                // , "pdf"],

                excel: {
                    fileName: "LaporanPasienDaftar.xlsx",
                    allPages: true,

                },
                // pdf: {
                //     fileName: "LaporanPasienMasuk.pdf",
                //     allPages: true,
                // },

                dataSource: $scope.dataExcel,
                sortable: true,
                // reorderable: true,
                // filterable: true,
                pageable: true,
                // groupable: true,
                // columnMenu: true,
                // resizable: true,
                excelExport: function (e) {
                    var rows = e.workbook.sheets[0].rows;
                    rows.unshift({
                        cells: [{
                            value: "Laporan Keperawatan",
                            background: "#fffff"
                        }]
                    });
                },
                columns: [{
                        "field": "no",
                        "title": "No",
                        "width": "30px",
                    },
                    {
                        "field": "masalahkeperawatan",
                        "title": "Masalah Keperawatan",
                        "width": "100px",
                        // "template": "<span class='style-center'>#: nocm #</span>"
                    },
                    {
                        "field": "jumlah",
                        "title": "Jumlah",
                        "width": "50px",
                        // "template": "<span class='style-left'>{{formatTanggal('#: tglregistrasi #')}}</span>"
                    },
                    
                ]
            });

            $scope.klikGrid = function (dataPasienSelected) {
                if (dataPasienSelected != undefined) {
                    $scope.nocm = dataPasienSelected.nocm;
                    $scope.idPasien = dataPasienSelected.nocmfk;
                    $scope.tglMeninggal = dataPasienSelected.tglmeninggal;
                    $scope.dataPasienSelected = dataPasienSelected;
                }
            }
            $scope.klikdua = function (dataPasienSelected) {
                if (dataPasienSelected.foto != null) {
                    $scope.item.image = dataPasienSelected.foto
                    $scope.popUpPhoto.center().open()

                }

            }
            $scope.tutupPhoto = function () {
                $scope.item.image = "../app/images/avatar.jpg"
                $scope.popUpPhoto.close()
            }
            $scope.formatJam = function (tanggal) {
                if (tanggal == 'null')
                    return ''
                else
                    return moment(tanggal).format('HH:mm');
            }

            


            
            


          

           
            ///////////////////////////////////////////////////////////////////////////////////////////
        }
    ]);
});