define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('InputABKCtrl', ['$scope', 'MedifirstService', 'DateHelper', 
        function ($scope, medifirstService, dateHelper) {
            //Inisial Variable             
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};
            $scope.isRouteLoading = false;
            LoadData(); 

            function LoadData() {       

                $scope.isRouteLoading = true;    
                
                medifirstService.get("sdm/get-data-abk").then(function (data) {
                    $scope.isLoadingData = false;
                    // debugger;       
                    var datas = data.data; 
                    $("#grid").data("kendoGrid").setOptions({ editable: true });
                    $scope.sourceLaporan = new kendo.data.DataSource({
                        data: datas,
                        pageSize: 10,
                        total: data.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                pendidikanpegawai: "pendidikanpegawai",
                                fields: {
                                    pendidikanpegawai: { editable: false},
                                    kategorifk: { editable: false},
                                    subkategorifk: { editable: false},
                                    kekuranganl: { editable: true},
                                    kebutuhanl: { editable: true},
                                    kekuranganp: { editable: true},
                                    kebutuhanp: { editable: true},
                                }
                            }
                        },
                        
                        pageSize: 162,
                        change: function (e) {
                            console.log("change :" + e.action);
                            if (e.field && e.action === "itemchange") {
                                //debugger;
                                $scope.current.kebutuhanl = $scope.current.kebutuhanl;
                                $scope.current.kekuranganl = $scope.current.kekuranganl;
                                $scope.current.kebutuhanp = $scope.current.kebutuhanp;
                                $scope.current.kekuranganp = $scope.current.kekuranganp;
                                // if ($scope.current.selisih<0)
                                //     $scope.current.selisih = $scope.current.selisih*=-1;
                                $scope.sourceLaporan.fetch();
                                // console.log($scope.current);
                                // console.log($scope.sourceLaporan);
                            }
                        }
                    });
                })
            }     
            
            $scope.kl = function (current) {
                $scope.current = current;
                console.log(current);
            };

            $scope.Perbaharui = function () {
                $scope.ClearSearch();
            }
          
            $scope.ClearSearch = function () {
                $scope.item = {};
                $scope.item.tglawal = $scope.now;
                $scope.item.tglakhir = $scope.now;
                $scope.Search();
            }

            $scope.formatTanggal = function(tanggal){
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            $scope.formatJam = function(tanggal){
                return moment(tanggal).format('HH:mm');
            }

            $scope.columnLaporan = {

                toolbar:["excel"],
                excel: {
                    fileName:"DataABK",
                    allPages: true,
                },
                selectable: 'row',
                pageable: true,
                scrollable: false,
                columns: [
                    {
                        "field": "kategorifk",
                        "title": "Kategori",
                        "width": 250,
                    },                    
                    {
                        "field": "subkategorifk",
                        "title": "Sub Kategori",
                        "width": 300,
                    },
                    {
                        "field": "pendidikanpegawai",
                        "title": "Pendidikan",
                        "width": 400,
                    },       
                    {
                        "title": "Kebutuhan",
                        
                        columns: [
                            {
                                field: "kebutuhanl",
                                title: "Laki-Laki",
                            },
                            {
                                field: "kebutuhanp",
                                title: "Perempuan",
                            },
                        ],
                    }, 
                    {
                        "title": "Kekurangan",
                        
                        columns: [
                            {
                                field: "kekuranganl",
                                title: "Laki-Laki",
                            },
                            {
                                field: "kekuranganp",
                                title: "Perempuan",
                            },
                        ],
                    }, 
                ]
            }; 

            $scope.saveABK = function () {
                
                $scope.isRouteLoading = true;
                var dataArray = [];
                for (var i = $scope.sourceLaporan._data.length - 1; i >= 0; i--) {
                    if ($scope.sourceLaporan._data[i].kebutuhanl != undefined && $scope.sourceLaporan._data[i].kekuranganl != undefined && $scope.sourceLaporan._data[i].kebutuhanp != undefined && $scope.sourceLaporan._data[i].kekuranganp != undefined)
                        dataArray.push({
                            "id": $scope.sourceLaporan._data[i].id,
                            "kebutuhanl": $scope.sourceLaporan._data[i].kebutuhanl,
                            "kekuranganl": $scope.sourceLaporan._data[i].kekuranganl,
                            "kebutuhanp": $scope.sourceLaporan._data[i].kebutuhanp,
                            "kekuranganp": $scope.sourceLaporan._data[i].kekuranganp,
                        });
                }

                if (dataArray.length !== 0) {
                    var objSave = {
                        "stokProduk": dataArray
                    }
                    //console.log(objSave);
                    medifirstService.post('sdm/save-data-abk', objSave).then(function (e) {
                        // $scope.item.resep = e.data.noresep.noorder
                        $scope.isRouteLoading = false;
                        var datas = e.data.data
                        
                        $("#grid").data("kendoGrid").setOptions({ editable: true });
                    $scope.sourceLaporan = new kendo.data.DataSource({
                        data: datas,
                        pageSize: 10,
                        total: data.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                pendidikanpegawai: "pendidikanpegawai",
                                fields: {
                                    pendidikanpegawai: { editable: false},
                                    kategorifk: { editable: false},
                                    subkategorifk: { editable: false},
                                }
                            }
                        },
                        
                        pageSize: 162,
                        change: function (e) {
                            console.log("change :" + e.action);
                            if (e.field && e.action === "itemchange") {
                                //debugger;
                                $scope.current.kebutuhanl = $scope.current.kebutuhanl;
                                $scope.current.kekuranganl = $scope.current.kekuranganl;
                                $scope.current.kebutuhanp = $scope.current.kebutuhanp;
                                $scope.current.kekuranganp = $scope.current.kekuranganp;
                                // if ($scope.current.selisih<0)
                                //     $scope.current.selisih = $scope.current.selisih*=-1;
                                $scope.sourceLaporan.fetch();
                            }
                        }
                    });                     
                    }, function (error) {
                        $scope.isRouteLoading = false;
                        $scope.tombolSimpanVis = true;
                    })
                } else {
                    window.messageContainer.error('Tidak ada data yang diubah');
                }
            }
            

        //* BATAS SUCI *//
        }
    ]);
});