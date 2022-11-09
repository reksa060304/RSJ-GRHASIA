define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('MasterPihakKetigaCtrl', ['$scope', 'DateHelper', '$http', '$state', 'MedifirstService',
        function ($scope, dateHelper, $http, $state, medifirstService) {
            //Inisial Variable   
            $scope.isRouteLoading = false;
            $scope.item = {};
            $scope.now = new Date();
            $scope.date = new Date();
            $scope.dataSelected = {};
            $scope.item.jmlRows = 50;
            $scope.item.tglawal = $scope.now;
            $scope.item.tglakhir = $scope.now;
            $scope.idrekanan = ''
            FormLoad();

            medifirstService.getPart('perencanaan/get-datacombo-part-rekanan', true, true, 20).then(function (data) {
                $scope.listPihakKetiga = data
            })

            $scope.showAndHide = function () {
                $('#contentPencarian').fadeToggle("fast", "linear");
            }

            function init() {
                $scope.isRouteLoading = true;

                var idya = ''
                if($scope.item.pihakKetigaSPJ != undefined){
                    idya = $scope.item.pihakKetigaSPJ.id
                }
                
                medifirstService.get("perencanaan/get-datacombo-part-rekanan-semua?id="+idya).then(function (e) {
                    console.log(e.data)
                        $scope.isRouteLoading = false;
                        
                        $scope.dataGrid = new kendo.data.DataSource({
                            data: e.data,
                            group: $scope.group,
                            pageSize: 10,
                            total: e.data.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                    }
                                }
                            },
                            aggregate: [
                            ]
                        });
                    });
            }


            $scope.TambahPihakKetiga = function(){
                $scope.idrekanan = ''
                $scope.item.namapihakketiga = ''
                $scope.PihakKetiga.center().open()
            }

            $scope.EditPihakKetiga = function(){
                $scope.idrekanan = $scope.dataSelected.id
                $scope.item.namapihakketiga = $scope.dataSelected.namarekanan
                $scope.item.npwp = $scope.dataSelected.npwp
                $scope.item.alamat = $scope.dataSelected.alamatlengkap
                $scope.PihakKetiga.center().open()
            }

            function FormLoad() {
                init()
            }

            $scope.SavePihakKetiga = function () {
                var objSave = {
                    "id": $scope.idrekanan,
                    "namarekanan": $scope.item.namapihakketiga,
                    "npwp": $scope.item.npwp,
                    "alamat": $scope.item.alamat,
                }
                console.log(objSave);
                // return
                medifirstService.post('perencanaan/save-pihak-ketiga', objSave).then(function (e) {
                    $scope.PihakKetiga.center().close()
                    init();
                })

            }

            $scope.HapusPihakKetiga = function () {
                var objSave = {
                    "id": $scope.dataSelected.id,
                }
                console.log(objSave);
                // return
                medifirstService.post('perencanaan/delete-pihak-ketiga', objSave).then(function (e) {
                    init();
                })

            }

            $scope.ClearData = function () {
                $scope.item.tglAwal = moment($scope.now).format('YYYY-MM-DD 00:00');
                $scope.item.tglAkhir = moment($scope.now).format('YYYY-MM-DD 23:59');
            }

            $scope.cariFilter = function () {
                init();
            }

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('YYYY-MM-DD');
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

            $scope.group = [
            ];
            

            $scope.columnGrid = {
                sortable: true,
                selectable: true,
                pageable: true,
                columns: [
                    {
                        
                        "field": "id",
                        "title": "Id",
                        "width": "100px",
                    },
                    {
                        
                        "field": "namarekanan",
                        "title": "Nama Pihak Ketiga",
                        "width": "100px",
                    },
                    {
                        
                        "field": "npwp",
                        "title": "NPWP",
                        "width": "100px",
                    },
                    {
                        
                        "field": "alamatlengkap",
                        "title": "Alamat Lengkap",
                        "width": "100px",
                    },
                ]
            };


            $scope.formatRupiah = function (value, currency) {
                return currency + " " + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            }
            //////////////////////////////////////////////////////////////          END             /////////////////////////////////////////////////////////////////////////////////////       
        }
    ]);
});