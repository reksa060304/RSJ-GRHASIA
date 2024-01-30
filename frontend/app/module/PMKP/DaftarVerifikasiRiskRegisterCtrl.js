define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DaftarVerifikasiRiskRegisterCtrl', ['MedifirstService', 'CacheHelper', '$scope', 'DateHelper', '$state', 'ModelItem',
        function (medifirstService, cacheHelper, $scope, DateHelper, $state, ModelItem) {
            //Inisial Variable 
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};
            $scope.itemD = {};
            $scope.isRouteLoading = false;
            $scope.tglMeninggal = '';
            var norecInsiden = '';
            $scope.selectedOnCheck = [];
            $scope.Page = {
                refresh: true,
                pageSizes: true,
                buttonCount: 5
            }            
            loadCombo();
            loadFirst();
            loadData();

            function loadCombo() {   
                var dataDept = medifirstService.getMapLoginUserToRuangan();
                $scope.listDepartemen = dataDept;            
            }
            
            function loadFirst() {
                var chacePeriode = cacheHelper.get('DaftarVerifikasiRiskRegisterCtrl');
                if (chacePeriode != undefined) {
                    var arrPeriode = chacePeriode.split('~');
                    $scope.item.periodeAwal = new Date(arrPeriode[0]);
                    $scope.item.periodeAkhir = new Date(arrPeriode[1]);

                } else {
                    $scope.item.periodeAwal = moment($scope.now).format('YYYY-MM-DD 00:00');
                    $scope.item.periodeAkhir = moment($scope.now).format('YYYY-MM-DD 23:59');
                }
            }                        
            
            function loadData() {
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm');
				var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm');                   
                var idDept = ''
                if ($scope.item.UnitKerja != undefined) {
                    idDept = "&idDept=" + $scope.item.UnitKerja.id
                }
                medifirstService.get("pmkp/get-data-risk-register?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    idDept).then(function (data) {
                        $scope.isRouteLoading = false;
                        var doto = data.data.data;
                        for (var i = 0; i < doto.length; i++) {
                            doto[i].no = i+1       
							doto[i].statCheckbox = false
                        }                       
                        $scope.dataSourceGrid = new kendo.data.DataSource({
							data: doto,
							// group: $scope.group,
							pageSize: 50,
							total: doto.length,
							serverPaging: false,
							schema: {
								model: {
									fields: {
										// jumlah: { type: "number" }
									}
								}
							},
							aggregate: [
								// { field: 'jumlah', aggregate: 'sum' },
							]
						})                        
                    });
                
                var chacePeriode = $scope.item.periodeAwal + "~" +$scope.item.periodeAkhir
                cacheHelper.set('DaftarVerifikasiRiskRegisterCtrl', chacePeriode);
            };

            $scope.SearchData = function(){
                loadData();
            }
            
            $scope.columnGrid = {
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "DaftarIdentifikasiRisiko.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:M1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Daftar Laporan Identifikasi Risiko",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];
                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                selectable: 'row',
                pageable: true,
                columns: [   
                    {
                        "title": "<input type='checkbox' class='checkbox' ng-click='selectUnselectAllRow()' />",
                        template: "# if (statCheckbox) { #" +
                            "<input type='checkbox' class='checkbox' ng-click='selectRow(dataItem)' checked />" +
                            "# } else { #" +
                            "<input type='checkbox' class='checkbox' ng-click='selectRow(dataItem)' />" +
                            "# } #",
                        width: "30px"
                    },
                    {
                        "field": "no",
                        "title": "No",
                        "width": "60px",
                    },
                    {
                        "field": "tanggal",
                        "title": "Tanggal",
                        "width": "95px",
                        "template": "<span class='style-left'>{{formatTanggal('#: tanggal #')}}</span>"
                    },
                    {
                        "field": "kategoryrisiko",
                        "title": "Kategory Risiko",
                        "width": "220px",
                    },
                    {
                        "field": "jenisrisiko",
                        "title": "Jenis Risiko",
                        "width": "220px",
                    },                            
                    {
                        "field": "deskripsirisiko",
                        "title": "Deskripsi Risiko",
                        "width": "120px",
                    },
                    {
                        "field": "kemungkinan",
                        "title": "Kemungkinan",
                        "width": "120px",
                    },
                    {
                        "field": "penyebab",
                        "title": "Penyebab",
                        "width": "120px",
                    },
                    {
                        "field": "statusverif",
                        "title": "Verifikasi",
                        "width":"60px",
                        "template": '# if( statusverif==true) {# ✔ # } else {# - #} #'
                    }
                ]
            };

            $scope.selectRow = function (dataItem) {
				var dataSelect = _.find($scope.dataSourceGrid._data, function (data) {
					return data.norec == dataItem.norec;
				});
				if (dataSelect.statCheckbox) {
					dataSelect.statCheckbox = false;
					for (let i = 0; i < $scope.selectedOnCheck.length; i++) {
						if (dataSelect.norec == $scope.selectedOnCheck[i].norec) {
							$scope.selectedOnCheck.splice([i], 1)
							break
						}
					}
				}
				else {
					dataSelect.statCheckbox = true;
					$scope.selectedOnCheck.push(dataSelect)
				}
			}
            var isCheckAll = false
			$scope.selectUnselectAllRow = function () {
				var tempData = $scope.dataSourceGrid._data;
				if (isCheckAll) {
					isCheckAll = false;
					for (var i = 0; i < tempData.length; i++) {
						tempData[i].statCheckbox = false;
						$scope.selectedOnCheck = []
					}
				}
				else {
					isCheckAll = true;
					for (var i = 0; i < tempData.length; i++) {
						tempData[i].statCheckbox = true;
						$scope.selectedOnCheck.push(tempData[i])
					}
				}
				reloaddataSourceGrid(tempData);
			}

			function reloaddataSourceGrid(ds) {
				var newDs = new kendo.data.DataSource({
					data: ds,
					pageSize: 50,
					total: ds.length,
					serverPaging: true,
				});
				var grid = $('#kGrid').data("kendoGrid");
				grid.setDataSource(newDs);
				grid.refresh();
			}

            $scope.klikGrid = function (dataPasienSelected) {
                if (dataPasienSelected != undefined) {
                  $scope.dataPasienSelected = dataPasienSelected;
                }
            }            

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }
            
            $scope.editData = function(){
                if ($scope.dataPasienSelected == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                }

                var chacePeriode = {
                    0: $scope.dataPasienSelected.norec,
                    1: 'EditRisk',
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }

                cacheHelper.set('RiskRegisterCtrl', chacePeriode);
                $state.go('RiskRegister', {
                    kpid: $scope.dataPasienSelected.norec,
                    noOrder: 'EditRisk'
                });
            }

            $scope.hapusData = function () {                
                if ($scope.dataPasienSelected.lk_norec != undefined) {
                    messageContainer.error("Insiden Telah Ditindaklanjuti Tidak Bisa Dihapus!")
                    return
                }

                if ($scope.dataPasienSelected != undefined) {
                    var item = {
                        norec: $scope.dataPasienSelected.norec
                    }

                    medifirstService.post('pmkp/hapus-data-risk-register', item).then(function (e) {
                        loadData();
                    })

                } else {
                    messageContainer.error("Pilih data dulu!")
                }
            }

            $scope.Lanjut = function(){
                if ($scope.dataPasienSelected == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                }

                var chacePeriode = {
                    0: $scope.dataPasienSelected.norec,
                    1: 'TindakLanjut',
                    2: $scope.dataPasienSelected.norec,
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }

                cacheHelper.set('RiskRegisterCtrl', chacePeriode);
                $state.go('RiskRegister', {
                    kpid: $scope.dataPasienSelected.norec,
                    noOrder: 'TindakLanjut'
                });
            }

            $scope.tambahData = function(){
                $state.go('IdentifikasiRisiko', {});
            }

            $scope.verifikasiData = function () {
                if($scope.selectedOnCheck.length == 0) {
                    alert("Harap pilih data yang akan diverifikasi!")
                    return;
                }
                
                var json = {
                    data: $scope.selectedOnCheck
                }
                $scope.isRouteLoading = true;
                medifirstService.post('pmkp/verifikasi-data-risk-register/true', json).then(function (e) {
                    $scope.isRouteLoading = false;
                    $scope.selectedOnCheck = []
                    loadData();
                })
            }
            //** BATAS SUCI */                    
        }
    ]);
});