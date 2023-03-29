define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('UraianPendapatanCtrl', ['$scope', 'DateHelper', '$http', '$state', 'MedifirstService', '$mdDialog',
        function ($scope, dateHelper, $http, $state, medifirstService, $mdDialog) {
            //Inisial Variable   
            $scope.isRouteLoading = false;
            $scope.item = {};
            $scope.now = new Date();
            $scope.date = new Date();
            $scope.dataSelected = {};
            $scope.item.jmlRows = 50;
            $scope.norecjasgir = ''
            $scope.item.tahuncari = moment($scope.now).format('YYYY');
            FormLoad();

            $scope.yearUngkul = {
                start: "decade",
                depth: "decade"
            }

            $scope.showAndHide = function () {
                $('#contentPencarian').fadeToggle("fast", "linear");
            }

            function init() {
                $scope.isRouteLoading = true;
                var tahun = ''
                if($scope.item.tahuncari != undefined){
                    tahun = moment($scope.item.tahuncari).format('YYYY');
                }
                
                medifirstService.get("anggaran/load-combo-rincian-pendapatan?tahun="+tahun).then(function (e) {
                        $scope.isRouteLoading = false;

                        var datas = e.data.uraianpendapatan
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

            $scope.$watch('item.tahuncari', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    init()
                }
            })


            $scope.TambahJasgir = function(){
                $scope.norecjasgir = ''
                $scope.item.uraianpendapatan = ''
                $scope.item.nourut = 0
                $scope.item.tahun = ''
                $scope.item.nouraian = ''
                $scope.item.kdrekening = ''
                $scope.popupTambahJasgir.center().open()
            }

            $scope.EditJasgir = function(){
                $scope.norecjasgir = $scope.dataSelected.id
                $scope.item.uraianpendapatan = $scope.dataSelected.uraianpendapatan
                $scope.item.nourut = $scope.dataSelected.nourut
                $scope.item.tahun = $scope.dataSelected.tahun
                $scope.item.nouraian = $scope.dataSelected.nouraian
                $scope.item.kdrekening = $scope.dataSelected.kdrekening
                $scope.popupTambahJasgir.center().open()
            }

            function FormLoad() {
                init()
            }

            $scope.CopyPendapatan = function () {
                $scope.popupCopyUraian.center().open()
            }

            $scope.SaveCopyPendapatan = function () {
                var objSave = {
                    "tahundari": moment($scope.item.tahundari).format('YYYY'),
                    "tahunke": moment($scope.item.tahunke).format('YYYY'),
                }
                console.log(objSave);
                // return
                medifirstService.post('perencanaan/save-uraian-pendapatan-copy', objSave).then(function (e) {
                    $scope.popupCopyUraian.center().close()
                    init();
                })

            }

            $scope.SaveJasgir = function () {
                var objSave = {
                    "id": $scope.norecjasgir,
                    "uraianpendapatan": $scope.item.uraianpendapatan,
                    "nouraian": $scope.item.nouraian,
                    "kdrekening": $scope.item.kdrekening,
                    "nourut": $scope.item.nourut,
                    "tahun": moment($scope.item.tahun).format('YYYY'),
                }
                console.log(objSave);
                // return
                medifirstService.post('perencanaan/save-uraian-pendapatan', objSave).then(function (e) {
                    $scope.popupTambahJasgir.center().close()
                    init();
                })

            }

            $scope.HapusJasgir = function () {
                var confirm = $mdDialog.confirm()
                    .title('Informasi')
                    .htmlContent("Apakah anda ingin menghapus item ini?")
                    .ariaLabel('Lucky day')
                    .cancel('Batal')
                    .ok('Ok');

                $mdDialog.show(confirm).then(function () {
                    var objSave = {
                        "id": $scope.dataSelected.id,
                    }
                    console.log(objSave);
                    // return
                    medifirstService.post('perencanaan/delete-uraian-pendapatan', objSave).then(function (e) {
                        init();
                    })
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
                        "title": "Id",
                        "width": "100px",
                    },
                    {
                        
                        "field": "kdrekening",
                        "title": "Kode Rekening",
                        "width": "100px",
                    },
                    {
                        
                        "field": "nouraian",
                        "title": "Nomer",
                        "width": "100px",
                    },
                    {
                        
                        "field": "uraianpendapatan",
                        "title": "Uraian Pendapatan",
                        "width": "100px",
                    },
                    {
                        
                        "field": "nourut",
                        "title": "No Urut",
                        "width": "100px",
                    },
                    {
                        
                        "field": "tahun",
                        "title": "Tahun",
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