define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('SumberPendapatanCtrl', ['$scope', 'DateHelper', '$http', '$state', 'MedifirstService',
        function ($scope, dateHelper, $http, $state, medifirstService) {
            //Inisial Variable   
            $scope.isRouteLoading = false;
            $scope.item = {};
            $scope.now = new Date();
            $scope.date = new Date();
            $scope.dataSelected = {};
            $scope.item.jmlRows = 50;
            $scope.norecjasgir = ''
            FormLoad();

            $scope.showAndHide = function () {
                $('#contentPencarian').fadeToggle("fast", "linear");
            }

            function init() {
                $scope.isRouteLoading = true;
                // var tgl = moment($scope.tanggal).format('DD/MM/YYYY');
                medifirstService.get("anggaran/load-combo-rincian-pendapatan").then(function (e) {
                        $scope.isRouteLoading = false;

                        var datas = e.data.sumberpendapatan
                        for(var i = 0; i < datas.length; i++){
                            datas[i].no = i+1
                        }
                        
                        $scope.dataGrid = new kendo.data.DataSource({
                            data: datas,
                            group: $scope.group,
                            pageSize: 100,
                            total: datas.length,
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


            $scope.TambahJasgir = function(){
                $scope.norecjasgir = ''
                $scope.item.asalproduk = ''
                $scope.popupTambahJasgir.center().open()
            }

            $scope.EditJasgir = function(){
                $scope.norecjasgir = $scope.dataSelected.id
                $scope.item.asalproduk = $scope.dataSelected.asalproduk
                $scope.popupTambahJasgir.center().open()
            }

            function FormLoad() {
                init()
            }

            $scope.SaveJasgir = function () {
                var objSave = {
                    "id": $scope.norecjasgir,
                    "asalproduk": $scope.item.asalproduk,
                }
                console.log(objSave);
                // return
                medifirstService.post('perencanaan/save-sumber-pendapatan', objSave).then(function (e) {
                    $scope.popupTambahJasgir.center().close()
                    init();
                })

            }

            $scope.HapusJasgir = function () {
                var objSave = {
                    "id": $scope.dataSelected.id,
                }
                console.log(objSave);
                // return
                medifirstService.post('perencanaan/delete-sumber-pendapatan', objSave).then(function (e) {
                    init();
                })

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
                        
                        "field": "no",
                        "title": "Nomor",
                        "width": "100px",
                    },
                    {
                        
                        "field": "asalproduk",
                        "title": "Sumber Pendapatan",
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