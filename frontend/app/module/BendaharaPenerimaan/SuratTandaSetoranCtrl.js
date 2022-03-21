define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('SuratTandaSetoranCtrl', ['$scope', 'DateHelper', '$http', '$state', 'MedifirstService',
        function ($scope, dateHelper, $http, $state, medifirstService) {
            //Inisial Variable   
            $scope.isRouteLoading = false;
            $scope.item = {};
            $scope.now = new Date();
            $scope.date = new Date();
            $scope.item.tglAwal = moment($scope.now).format('YYYY-MM-DD 00:00');
            $scope.item.tglAkhir = moment($scope.now).format('YYYY-MM-DD 23:59');
            $scope.dataSelected = {};
            $scope.item.jmlRows = 50;
            FormLoad();

            $scope.showAndHide = function () {
                $('#contentPencarian').fadeToggle("fast", "linear");
            }

            medifirstService.get("kasir/get-data-combo-kasir").then(function (dat) {
                $scope.listCaraBayar = dat.data.dataCB;
                $scope.listStatusSTS = [
                    { id: 1, names: "Sudah STS" },
                    { id: 2, names: "Belum STS"}
                ];
            });

            function init() {
                $scope.isRouteLoading = true;
                
                var ScaraBayar = "";
				if ($scope.item.caraBayar != undefined) {
					ScaraBayar = $scope.item.caraBayar.id;
				}

                var jmlRows = "";
                if ($scope.item.jmlRows != undefined) {
                    jmlRows = $scope.item.jmlRows
                }

                var status = "";
                if ($scope.item.statusSTS != undefined) {
                    status = $scope.item.statusSTS.id
                }

                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                // var tgl = moment($scope.tanggal).format('DD/MM/YYYY');
                medifirstService.get("bendaharapenerimaan/get-sts?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir+
                    "&status=" + status +
                    "&idCaraBayar=" + ScaraBayar
                    , true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        for (var i = 0; i < dat.data.detail.length; i++) {
                            dat.data.detail[i].no = i + 1;
                        }
                        
                        $scope.dataGrid = new kendo.data.DataSource({
                            data: dat.data.detail,
                            group: $scope.group,
                            pageSize: 100,
                            total: dat.data.detail.length,
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

            function FormLoad() {
                $scope.item.tglAwal = moment($scope.now).format('YYYY-MM-DD 00:00');
                $scope.item.tglAkhir = moment($scope.now).format('YYYY-MM-DD 23:59');
            }

            $scope.ClearData = function () {
                $scope.item.tglAwal = moment($scope.now).format('YYYY-MM-DD 00:00');
                $scope.item.tglAkhir = moment($scope.now).format('YYYY-MM-DD 23:59');
                $scope.item.namaProduk = undefined;
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

            $scope.selectedData2 = [];
			$scope.onClickSatu = function (e, param) {
				var tol = 0;

				var element = $(e.currentTarget);
				var checked = element.is(':checked')
				var row = element.closest('tr')
				var grid = $("#grid").data("kendoGrid")
				var dataItem = grid.dataItem(row);

				if (checked) {
					var result = $.grep($scope.selectedData2, function (e) {
						return e.nopenerimaan == dataItem.nopenerimaan;
					});
					if (result.length == 0) {
						$scope.selectedData2.push(dataItem);
					} else {
						for (var i = 0; i < $scope.selectedData2.length; i++)
							if ($scope.selectedData2[i].nopenerimaan === dataItem.nopenerimaan) {
								$scope.selectedData2.splice(i, 1);
								break;
							}
						$scope.selectedData2.push(dataItem);
					}
					row.addClass("k-state-selected");
				} else {
					for (var i = 0; i < $scope.selectedData2.length; i++)
						if ($scope.selectedData2[i].nopenerimaan === dataItem.nopenerimaan) {
							$scope.selectedData2.splice(i, 1);
							break;
						}
					row.removeClass("k-state-selected");
				}

				if ($scope.selectedData2.length != 0) {
					for (var i = 0; i < $scope.selectedData2.length; i++) {
						tol += parseFloat($scope.selectedData2[i].totalpenerimaan);
					}
                    console.log($scope.selectedData2);
                    $scope.item.totalSetor = tol;
				} else{
                    $scope.item.totalSetor = tol;
                }
				
			}

            

            var objSave =
            {
                setoran: $scope.selectedData2
            }

            console.log(objSave.setoran.length);

            $scope.simpan = function () {
                medifirstService.post('bendaharapenerimaan/save-sts', objSave).then(function (e) {
                })
            }

            

            $scope.columnGrid = {
                toolbar: [
                    "excel",
                ],
                excel: {
                    fileName: "SuratTandaSetoran.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 3;
                    sheet.mergedCells = ["A1:F1", "A2:F2", "A3:F3"];
                    sheet.name = "Report";
                    var awal = moment($scope.item.tglAwal).format('YYYY-MM-DD');
                    var akhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD');

                    var myHeaders = [{
                        value: "SURAT TANDA SETORAN",
                        fontSize: 12,
                        fontWeight: 900,
                        textAlign: "center",
                        backgroundUrl: "#fffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 30 });

                    var myHeaders = [{
                        value: "Periode " + awal + " sampai dengan "+akhir,
                        fontSize: 12,
                        fontWeight: 900,
                        textAlign: "center",
                        backgroundUrl: "#fffff"
                    }];

                    sheet.rows.splice(1, 0, { cells: myHeaders, type: "header", height: 30 });

                    var myHeaders = [{
                        value: "",
                        fontSize: 12,
                        fontWeight: 900,
                        textAlign: "center",
                        backgroundUrl: "#fffff"
                    }];

                    sheet.rows.splice(2, 0, { cells: myHeaders, type: "header", height: 20 });
                    
                },
                selectable: "multiple",
                pageable: true,
                columns: [
                    {
						"template": "<input type='checkbox' class='checkbox style-center' ng-click='onClickSatu($event,2)' />",
						"width": "30px"
					},
                    {
                        "field": "no",
                        "title": "No",
                        "width": "50px"
                    },
                    {
                        
                        "field": "nopenerimaan",
                        "title": "No Penerimaan",
                        "width": "100px",
                    },
                    {
                        
                        "field": "tglpenerimaan",
                        "title": "Tanggal Penerimaan",
                        "width": "100px",
                    },
                    {
                        
                        "field": "totalpenerimaan",
                        "title": "Total Penerimaan",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: totalpenerimaan #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "nosts",
                        "title": "No STS (Surat Tanda Setoran)",
                        "width": "100px",
                    }
                ]
            };

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }
            //////////////////////////////////////////////////////////////          END             /////////////////////////////////////////////////////////////////////////////////////       
        }
    ]);
});