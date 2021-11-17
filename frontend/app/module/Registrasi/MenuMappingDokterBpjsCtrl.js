define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict';
    initialize.controller('MenuMappingDokterBpjsCtrl', ['$rootScope', '$scope', '$state', 'MedifirstService',
        function ($rootScope, $scope, $state, medifirstService) {
            $scope.now = new Date();
            $scope.nav = function (state) {
                // debugger;
                $scope.currentState = state;
                $state.go(state, $state.params);
                console.log($scope.currentState);
            }
            $scope.item = {};
            $scope.item.start = 1
            $scope.item.limit = 10
            $scope.isShowPembuatanSep = false;
            $scope.isShowPotensi = true;
            $scope.isShowApproval = false;
            $scope.isShowTglPulang = false;
            $scope.isShowIntegrasi = false;
            $scope.isRouteLoading = false;
            $scope.listDokterBpjs = "";
            loadCombo();

            function loadCombo() {
                $scope.isRouteLoading = true;
                $scope.item.rawatInap = true;
                if ($scope.item.rawatInap)
                    var inap = "1"
                else
                    var inap = "2"
                medifirstService.get("bridging/bpjs/get-ref-dokter-dpjp?jenisPelayanan=" + inap
                    + "&tglPelayanan=" + new moment($scope.now).format('YYYY-MM-DD') + "&kodeSpesialis=" + 10
                ).then(function (e) {
                    if (e.data.metaData.code == 200) {
                        $scope.listDPJP = e.data.response.list;
                        $scope.listDokterBpjs = ""
                        if ($scope.listDPJP.length != 0) {
                            var a = ""
                            var b = ""
                            for (var i = $scope.listDPJP.length - 1; i >= 0; i--) {

                                var c = $scope.listDPJP[i].kode
                                b = "," + c
                                a = a + b
                            }
                            $scope.listDokterBpjs = a.slice(1, a.length)
                            console.log($scope.listDokterBpjs)
                            LoadData();
                        }
                    }
                })

                medifirstService.getPart("sysadmin/general/get-combo-pegawai-dokter", true, true, 20).then(function (data) {
                    $scope.listDokterRs = data;
                    $scope.isRouteLoading = false;
                });
            }

            $scope.columnGrid = {
                selectable: 'row',
                pageable: true,
                columns: [
                    {
                        "field": "no",
                        "title": "No",
                        "width": "45px",                        
                    },
                    {
                        "field": "kddokterbpjs",
                        "title": "Kode Dokter Bpjs",
                        "width": "100px",                        
                    },
                    {
                        "field": "id",
                        "title": "Kode Dokter Rs",
                        "width": "100px",                        
                    },
                    {
                        "field": "namalengkap",
                        "title": "Nama Dokter",
                        "width": "220px",                        
                    },
                    {
                        command: [
                            { name: "edit", text: "Edit", click: editMapping },
                            { text: "Hapus", click: hapusMapping, imageClass: "k-icon k-delete" }
                        ], title: "&nbsp;", width: "50px",
                    }
                ],
            };

            function editMapping(e) {
                e.preventDefault();
                var grid = this;
                var row = $(e.currentTarget).closest("tr");
                var tr = $(e.target).closest("tr");
                var dataItem = this.dataItem(tr);
                $scope.isEdit = true
                $scope.item.rawatInap = true;
                if ($scope.item.rawatInap)
                    var inap = "1"
                else
                    var inap = "2"
                medifirstService.get("bridging/bpjs/get-ref-dokter-dpjp?jenisPelayanan=" + inap
                    + "&tglPelayanan=" + new moment($scope.now).format('YYYY-MM-DD') + "&kodeSpesialis=" + 10
                ).then(function (e) {
                    if (e.data.metaData.code == 200) {
                        var data = e.data.response.list;
                        var dokter = [];
                        for (let i = 0; i < data.length; i++) {
                            const element = data[i];
                            if (element.kode == dataItem.kddokterbpjs) {
                                dokter = element
                                break;
                            }
                        }
                        $scope.item.dokterDPJP = dokter;
                        $scope.listDokterRs = [{
                            id: dataItem.id,
                            namalengkap: dataItem.namalengkap
                        }];
                        $scope.item.dokterRs = $scope.listDokterRs[0];
                    }
                })
            }

            function hapusMapping(e) {
                e.preventDefault();
                var grid = this;
                var row = $(e.currentTarget).closest("tr");
                var tr = $(e.target).closest("tr");
                var dataItem = this.dataItem(tr);
                $scope.isEdit = true
                var objSave = {
                    id : dataItem.id,
                    namalengkap : dataItem.namalengkap
                }
                medifirstService.post('bridging/bpjs/hapus-data-mappingdkoterbpjs', objSave).then(function (e) {
                    $scope.isRouteLoading = false;
                    loadCombo();
                })                
            }

            function LoadData() {
                $scope.isRouteLoading = true;
                var idpegagawai = "";
                if ($scope.item.dokterRs != undefined) {
                    idpegagawai = "&idPegawai=" + $scope.item.dokterRs.id;
                }
                var kodeDokterBpjs = "";
                if ($scope.item.dokterDPJP != undefined) {
                    kodeDokterBpjs = "&kodeDokterBpjs=" + $scope.item.dokterDPJP.kode;
                }
                medifirstService.get("bridging/bpjs/get-data-mappingdkoterbpjs?"
                    + idpegagawai
                    + kodeDokterBpjs
                    + "&dokterbpjsArr=" + $scope.listDokterBpjs
                ).then(function (data) {
                    var datas = data.data;
                    $scope.isRouteLoading = false;
                    for (let i = 0; i < datas.length; i++) {
                        const element = datas[i];
                        element.no = i + 1;
                    }
                    $scope.dataSource = new kendo.data.DataSource({
                        data: datas,
                        pageSize: 50,
                        total: datas.length,
                        serverPaging: false,
                        schema: {
                            model: {
                            }
                        }
                    });
                })
            }

            $scope.SearchData = function () {
                LoadData();
            }

            $scope.tambahMapping = function () {
                $scope.isRouteLoading = true;
                if ($scope.item.dokterDPJP == undefined) {
                    toastr.error("Ïnfo, Dokter Bpjs Belum Dipilih!")
                    return
                }

                if ($scope.item.dokterRs == undefined) {
                    toastr.error("Ïnfo, Dokter Rs Belum Dipilih!")
                    return
                }

                var objSave = {
                    "kodedokterbpjs": $scope.item.dokterDPJP.kode,
                    "idpegawai": $scope.item.dokterRs.id,
                    "namalengkap": $scope.item.dokterRs.namalengkap,
                }

                medifirstService.post('bridging/bpjs/save-data-mappingdkoterbpjs', objSave).then(function (e) {
                    $scope.isRouteLoading = false;
                    kosongkeun();
                })
            }

            function kosongkeun() {
                $scope.item.dokterDPJP = undefined;
                $scope.item.dokterRs = undefined;
                loadCombo();
            }

            $scope.Cancel = function () {
                kosongkeun();
            }
            //** BATAS */
        }
    ]);
});