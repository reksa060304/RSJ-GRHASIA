define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict';
    initialize.controller('LockAngkasCtrl', ['$scope', 'DateHelper', '$http', '$state', 'MedifirstService',
        function ($scope, dateHelper, $http, $state, medifirstService) {
            //Inisial Variable   
            $scope.isRouteLoading = false;
            $scope.item = {};
            $scope.now = new Date();
            $scope.date = new Date();
            $scope.dataSelected = {};
            $scope.item.jmlRows = 50;
            $scope.norecjasgir = ''
            $scope.selectedData2 = [];
            $scope.selectedData3 = [];
            $scope.item.searchtahap = null
            // format input tahun
            $scope.yearUngkul = {
                start: "decade",
                depth: "decade"
            }
            
            init();

            function init() {
                $scope.isRouteLoading = true;

                // load combo
                medifirstService.get("anggaran/get-combo-anggaran")
                    .then(function (e) {
                        $scope.listTahap = e.data.tahap

                        // ambil tahap yang ada pada setting rba
                        var idTahap = e.data.setting[0].objecttahapaktivfk

                        // ambil tahun yang ada pada setting rba
                        $scope.item.tahunlock = moment(e.data.setting[0].tahunanggaran).format('YYYY')

                        // cari di list tahap berdasarkan setting rba 
                        $scope.listTahap.map(function(item){
                            if(item.id == idTahap){
                                $scope.item.searchtahap = item
                            }
                        })

                        loadData()
                    });
                
                
            }

            function loadData() {
                $scope.isRouteLoading = true;

                // load data kegiatan
                medifirstService.get("anggaran/get-subsubkegiatan-lockangkas" 
                    + "?tahun="+ moment($scope.item.tahunlock).format('YYYY')
                    + "&tahap="+ $scope.item.searchtahap.id)
                    .then(function (e) {

                        $scope.isRouteLoading = false;

                        var datas = e.data
                        
                        // buat penomeran
                        for(var i = 0; i < datas.length; i++){
                            datas[i].no = i+1
                        }
                        
                        $scope.dataGrid = new kendo.data.DataSource({
                            data: datas,
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

            // cari fileter
            $scope.CariLock = function () {
                loadData()
            }

            $scope.onClickSatu = function (e, param) {

				var element = $(e.currentTarget);
				var checked = element.is(':checked')
				var row = element.closest('tr')
				var grid = $("#grid").data("kendoGrid")
				var dataItem = grid.dataItem(row);
                console.log(dataItem)

				if (checked) {
					var result = $.grep($scope.selectedData2, function (e) {
						return e.norec == dataItem.norec;
					});

                    dataItem.iscek = true
                    $scope.selectedData2.push(dataItem);

					row.addClass("k-state-selected");
                    
				} else {
					dataItem.iscek = false
                    $scope.selectedData2.push(dataItem);

					row.removeClass("k-state-selected");
				}

                console.log($scope.selectedData2);
			}

            $scope.checkboxSelectAll = function () {
                for(var j = 0; j < $scope.dataGrid.options.data.length; j++){
                    $scope.dataGrid.options.data[j].iscek = true
                    $scope.selectedData2.push($scope.dataGrid.options.data[j]);
                }
            }

            $scope.checkboxUnselectAll = function () {
                for(var j = 0; j < $scope.dataGrid.options.data.length; j++){
                    $scope.dataGrid.options.data[j].iscek = false
                    $scope.selectedData2.push($scope.dataGrid.options.data[j]);
                }
            }

            $scope.Simpan = function () {
                $scope.isRouteLoading = true;

                var objSave = {
                    "data": $scope.selectedData2,
                }
                // return
                medifirstService.post('anggaran/simpan-lock-angkas-subsubkegiatan', objSave).then(function (e) {
                    medifirstService.post('sysadmin/logging/save-log-lock-angkas', objSave).then(function (data) {
                        $scope.isRouteLoading = false;
                        
                        loadData();
                    })
                })

            }

            $scope.HapusJasgir = function () {
                var objSave = {
                    "id": $scope.dataSelected.id,
                }
                console.log(objSave);
                // return
                medifirstService.post('perencanaan/delete-sumber-pendapatan', objSave).then(function (e) {
                    loadData();
                })

            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('YYYY-MM-DD');
            }
            

            $scope.columnGrid = {
                sortable: true,
                selectable: true,
                pageable: true,
                columns: [
                    {
						"field": "islockrba",
                        "title": "Lock",
					    "template": "# if( islockangkas==true) {# <input type='checkbox' class='checkbox style-center' ng-checked='true' ng-click='onClickSatu($event,2)'/> # } else {# <input type='checkbox' class='checkbox style-center' ng-checked='false' ng-click='onClickSatu($event,2)'/> #} #",
						"width": "30px"
					},
                    {
                        
                        "field": "no",
                        "title": "Nomor",
                        "width": "100px",
                    },
                    {
                        
                        "field": "tahap",
                        "title": "Tahap",
                        "width": "100px",
                    },
                    {
                        
                        "field": "text",
                        "title": "Nama Sub Kegiatan",
                        "width": "100px",
                    },
                    {
                        
                        "field": "tahun",
                        "title": "Tahun",
                        "width": "100px",
                    },
                ]
            }

            //////////////////////////////////////////////////////////////          END             /////////////////////////////////////////////////////////////////////////////////////       
        }
    ]);
});