define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LockEntrySPJCtrl', ['$scope', 'DateHelper', '$http', '$state', 'MedifirstService',
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
            FormLoad();

            $scope.showAndHide = function () {
                $('#contentPencarian').fadeToggle("fast", "linear");
            }

            $scope.yearUngkul = {
                start: "decade",
                depth: "decade"
            }

            medifirstService.get("anggaran/get-combo-anggaran").then(function (e) {
                $scope.listTahap = e.data.tahap
                $scope.item.tahunlock = e.data.setting[0].tahunanggaran
            });

            function init() {
                $scope.isRouteLoading = true;
                // var tgl = moment($scope.tanggal).format('DD/MM/YYYY');
                medifirstService.get("anggaran/get-subsubkegiatan-lockspj?tahun="+moment($scope.item.tahunlock).format('YYYY')).then(function (e) {
                        $scope.isRouteLoading = false;

                        var datas = e.data.data
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

            $scope.onClickSatuRekening = function (e, param) {

				var element = $(e.currentTarget);
				var checked = element.is(':checked')
				var row = element.closest('tr')
				var grid = $("#gridr").data("kendoGrid")
				var dataItem = grid.dataItem(row);
                console.log(dataItem)

				if (checked) {
					var result = $.grep($scope.selectedData3, function (e) {
						return e.id == dataItem.id;
					});

                    dataItem.iscek = true
                    $scope.selectedData3.push(dataItem);

					row.addClass("k-state-selected");
                    
				} else {
					dataItem.iscek = false
                    $scope.selectedData3.push(dataItem);

					row.removeClass("k-state-selected");
				}

                console.log($scope.selectedData3);
			}

            $scope.checkboxClicked = function () {
                for(var j = 0; j < $scope.dataGrid.options.data.length; j++){
                    $scope.dataGrid.options.data[j].iscek = true
                    $scope.selectedData2.push($scope.dataGrid.options.data[j]);
                }

                console.log($scope.selectedData2)
            }

            $scope.checkboxClickedUnlock = function () {
                for(var j = 0; j < $scope.dataGrid.options.data.length; j++){
                    $scope.dataGrid.options.data[j].iscek = false
                    $scope.selectedData2.push($scope.dataGrid.options.data[j]);
                }

                console.log($scope.selectedData2)
            }

            $scope.TambahPerRekening = function(){

                console.log($scope.dataSelected);
                $scope.subkegiatan = $scope.dataSelected.keterangansubkegiatan
                $scope.subsubkegiatan = $scope.dataSelected.keterangansubsubkegiatan
                console.log($scope.subkegiatan)
                medifirstService.get("perencanaan/get-lock-entry-spj-perrekening?subsubkegiatan="+$scope.dataSelected.idsubsubkegiatan).then(function (e) {
                    $scope.isRouteLoading = false;

                    var datas = e.data.data
                    for(var i = 0; i < datas.length; i++){
                        datas[i].no = i+1
                    }
                    
                    $scope.dataGridRekening = new kendo.data.DataSource({
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
                $scope.popupSaveRekening.center().open()
            }

            function FormLoad() {
                init()
            }

            $scope.CariLock = function () {
                init()
            }

            $scope.Simpan = function () {
                var objSave = {
                    "data": $scope.selectedData2,
                }
                console.log(objSave);
                // return
                medifirstService.post('anggaran/simpan-lock-spj-subsubkegiatan', objSave).then(function (e) {
                    medifirstService.post('sysadmin/logging/save-log-lock', objSave).then(function (data) {
                        init();
                    })
                })

            }

            $scope.SaveRekening = function () {
                var objSave = {
                    "data": $scope.selectedData3,
                }
                console.log(objSave);
                // return
                medifirstService.post('perencanaan/save-lock-entry-spj-rekening', objSave).then(function (e) {
                    medifirstService.post('sysadmin/logging/save-log-lock-rekening', objSave).then(function (data) {
                        init();
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
						"field": "islock",
                        "title": "Lock",
					    "template": "# if( islock==true) {# <input type='checkbox' class='checkbox style-center' ng-checked='true' ng-click='onClickSatu($event,2)'/> # } else {# <input type='checkbox' class='checkbox style-center' ng-checked='false' ng-click='onClickSatu($event,2)'/> #} #",
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
            };

            $scope.columnGridRekening = {
                sortable: true,
                selectable: true,
                pageable: true,
                columns: [
                    {
						"field": "islock",
                        "title": "Lock",
					    "template": "# if( islock==true) {# <input type='checkbox' class='checkbox style-center' ng-checked='true' ng-click='onClickSatuRekening($event,2)'/> # } else {# <input type='checkbox' class='checkbox style-center' ng-checked='false' ng-click='onClickSatuRekening($event,2)'/> #} #",
						"width": "30px"
					},
                    {
                        
                        "field": "idmataanggaran",
                        "title": "Id",
                        "width": "100px",
                        "hidden" : true,
                    },
                    {
                        
                        "field": "no",
                        "title": "Nomor",
                        "width": "100px",
                    },
                    {
                        
                        "field": "kodemataanggaran",
                        "title": "Kode",
                        "width": "100px",
                    },
                    {
                        
                        "field": "namamataanggaran",
                        "title": "Mata Anggaran",
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