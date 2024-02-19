define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('BukuKasUmumCtrl', ['$scope', 'DateHelper', '$http', '$state', 'MedifirstService',
        function ($scope, dateHelper, $http, $state, medifirstService) {
            //Inisial Variable   
            $scope.isRouteLoading = false;
            $scope.item = {};
            $scope.now = new Date();
            $scope.date = new Date();
            $scope.dataSelected = {};
            $scope.item.jmlRows = 50;
            $scope.item.tglawal = moment($scope.now).format('YYYY-01-01');
            $scope.item.tglakhir = $scope.now;
            $scope.hidepanjar =true
            $scope.hidepengembalianpanjar =true
            $scope.hidespm =true
            $scope.hidejasgir =true
            $scope.hidepajak =true
            $scope.hidespj =true
            $scope.hidests =true
            $scope.hidepengembalian =true
            $scope.selectedData2 = []; 
            $scope.norecbku = ''
            $scope.hiderekanan = false
            FormLoad();

            $scope.showAndHide = function () {
                $('#contentPencarian').fadeToggle("fast", "linear");
            }

            $scope.listAsalProduk = [
                { id: 15, asalproduk: "APBD" },
                { id: 18, asalproduk: "Jasa Layanan"}
            ];

            medifirstService.getPart('perencanaan/get-datacombo-part-rekanan', true, true, 20).then(function (data) {
                $scope.listPihakKetiga = data
            })

            medifirstService.get("perencanaan/get-data-combo").then(function (e) {
                $scope.listAsalProduk = e.data.asalproduk
            });

            function init() {
                $scope.isRouteLoading = true;

                var awal = moment($scope.item.tglawal).format('YYYY-MM-DD');
				var akhir = moment($scope.item.tglakhir).format('YYYY-MM-DD');

                var rekanan = ''
                if($scope.item.namarekanan != undefined){
                    rekanan = $scope.item.namarekanan.id
                }

                var asalproduk = ''
                if($scope.item.asalprodukbku != undefined){
                    asalproduk = $scope.item.asalprodukbku.id
                }

                // var saldo = 0
                medifirstService.get("perencanaan/get-bku?awal="+awal+"&akhir="+akhir+"&rekanan="+rekanan+"&asalproduk="+asalproduk).then(function (e) {
                        $scope.isRouteLoading = false;

                        // for(var i = 0; i < e.data.data.length; i++){
                        //     saldo += parseInt(e.data.data[i].penerimaan)
                        //     saldo -= parseInt(e.data.data[i].pengeluaran)
                        //     e.data.data[i].saldo = saldo 
                        // }
                        
                        $scope.dataGrid = new kendo.data.DataSource({
                            data: e.data.data,
                            group: $scope.group,
                            pageSize: 100,
                            total: e.data.data.length,
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


            $scope.TambahBKU = function(){
                $scope.item.tglbku = moment($scope.now).format('YYYY-MM-DD');
                $scope.item.uraianBKU = ''
                $scope.item.itemJenisBukti = undefined
                $scope.dataGridPanjar = []
                $scope.dataGridPengembalianPanjar = []
                $scope.dataGridSPM = []
                $scope.dataGridJasaGiro = []
                $scope.hidepanjar =true
                $scope.hidespm =true
                $scope.hidejasgir =true
                $scope.hidests =true
                $scope.hidepajak =true
                $scope.hidepengembalianpanjar = true
                medifirstService.get("perencanaan/get-jenis-bukti-bku").then(function (e) {
                    $scope.listJenisBukti = e.data.data
                });
                $scope.popupTambahBKU.center().open()
            }

            function FormLoad() {
                init()
            }
            
            $scope.$watch('item.caridatabku', function (newValue, oldValue) {
                if (newValue != oldValue) {
                var awal = moment($scope.item.tglawal).format('YYYY-MM-DD');
				var akhir = moment($scope.item.tglakhir).format('YYYY-MM-DD');

                var rekanan = ''
                if($scope.item.namarekanan != undefined){
                    rekanan = $scope.item.namarekanan.id
                }

                // var saldo = 0
                medifirstService.get("perencanaan/get-bku?awal="+awal+"&akhir="+akhir+"&rekanan="+rekanan+"&key="+$scope.item.caridatabku).then(function (e) {
                    $scope.isRouteLoading = false;

                    // for(var i = 0; i < e.data.data.length; i++){
                    //     saldo += parseInt(e.data.data[i].penerimaan)
                    //     saldo -= parseInt(e.data.data[i].pengeluaran)
                    //     e.data.data[i].saldo = saldo 
                    // }
                        
                    $scope.dataGrid = new kendo.data.DataSource({
                        data: e.data.data,
                        group: $scope.group,
                        pageSize: 100,
                        total: e.data.data.length,
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
            });

            $scope.$watch('item.itemJenisBukti', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    // console.log($scope.item.itemJenisBukti.id)
                    if($scope.item.itemJenisBukti.id == 3){
                        $scope.hidepanjar = false
                        $scope.hidepengembalianpanjar = true
                        $scope.hidespm =true
                        $scope.hidejasgir =true
                        $scope.hidepajak =true
                        $scope.hidespj =true
                        $scope.hidests =true
                        $scope.hiderekanan = false
                        medifirstService.get("perencanaan/get-panjar-bku").then(function (e) {
                        
                            $scope.dataGridPanjar = new kendo.data.DataSource({
                                data:  e.data.data,
                                pageSize: 10,
                                total: e.data.data.length,
                                group: $scope.group,
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
                    }else if($scope.item.itemJenisBukti.id == 7){
                        $scope.hidepengembalianpanjar = false
                        $scope.hidepanjar = true
                        $scope.hidespm =true
                        $scope.hidejasgir =true
                        $scope.hidepajak =true
                        $scope.hidespj =true
                        $scope.hidests =true
                        $scope.hiderekanan = false
                        medifirstService.get("perencanaan/get-datapengembalian-panjar-bku").then(function (e) {
                        
                            $scope.dataGridPengembalianPanjar = new kendo.data.DataSource({
                                data:  e.data.data,
                                pageSize: 10,
                                total: e.data.data.length,
                                group: $scope.group,
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
                    } else if($scope.item.itemJenisBukti.id == 1){
                        $scope.hidespm = false
                        $scope.hidepengembalianpanjar = true
                        $scope.hidepanjar =true
                        $scope.hidejasgir =true
                        $scope.hidepajak =true
                        $scope.hidespj =true
                        $scope.hidests =true
                        $scope.hiderekanan = true
                        medifirstService.get("perencanaan/get-spm-bku").then(function (e) {
                        
                            $scope.dataGridSPM = new kendo.data.DataSource({
                                data:  e.data.data,
                                pageSize: 10,
                                total: e.data.data.length,
                                group: $scope.group,
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
                    } else if($scope.item.itemJenisBukti.id == 5){
                        $scope.hidejasgir = false
                        $scope.hidepengembalianpanjar = true
                        $scope.hidepanjar =true
                        $scope.hidespm =true
                        $scope.hidepajak =true
                        $scope.hidespj =true
                        $scope.hidests =true
                        $scope.hiderekanan = true
                        medifirstService.get("perencanaan/get-jasgir-bku").then(function (e) {
                        
                            $scope.dataGridJasaGiro = new kendo.data.DataSource({
                                data:  e.data.data,
                                pageSize: 10,
                                total: e.data.data.length,
                                group: $scope.group,
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
                    } else if($scope.item.itemJenisBukti.id == 4){
                        $scope.hidepajak = false
                        $scope.hidepengembalianpanjar = true
                        $scope.hidepanjar =true
                        $scope.hidespm =true
                        $scope.hidejasgir =true
                        $scope.hidespj =true
                        $scope.hidests =true
                        $scope.hiderekanan = false
                        medifirstService.get("perencanaan/get-pajak-bku").then(function (e) {
                        
                            $scope.dataGridPajak = new kendo.data.DataSource({
                                data:  e.data.data,
                                pageSize: 10,
                                total: e.data.data.length,
                                group: $scope.group,
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
                    } else if($scope.item.itemJenisBukti.id == 6){
                        $scope.hidejasgir = true
                        $scope.hidepengembalianpanjar = true
                        $scope.hidepanjar =true
                        $scope.hidespm =true
                        $scope.hidepajak =true
                        $scope.hidespj =true
                        $scope.hidests =false
                        $scope.hiderekanan = false
                        medifirstService.get("perencanaan/get-sts-keuangan?key=bku").then(function (e) {
                        
                            $scope.dataGridSTS = new kendo.data.DataSource({
                                data:  e.data.data,
                                pageSize: 10,
                                total: e.data.data.length,
                                group: $scope.group,
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
                    } else if($scope.item.itemJenisBukti.id == 2){
                        $scope.hidespm = true
                        $scope.hidepengembalianpanjar = true
                        $scope.hidepanjar =true
                        $scope.hidejasgir =true
                        $scope.hidepajak =true
                        $scope.hidests =true
                        $scope.hidespj =false
                        $scope.hiderekanan = false
                        medifirstService.get("perencanaan/get-spj-bku").then(function (e) {
                        
                            $scope.dataGridSPJ = new kendo.data.DataSource({
                                data:  e.data.data,
                                pageSize: 10,
                                total: e.data.data.length,
                                group: $scope.group,
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
                }
            });

            

            $scope.SaveBKU = function () {

                var rekanan = null
                if($scope.item.pihakKetiga != undefined){
                    rekanan = $scope.item.pihakKetiga.id
                }

                var objSave = {
                    "bku": $scope.selectedData2,
                    "tglbku": moment($scope.item.tglbku).format('YYYY-MM-DD'),
                    "jenisbukti": $scope.item.itemJenisBukti.id,
                    "asalproduk": $scope.item.sumberDana.id,
                    "uraian": $scope.item.uraianBKU,
                    "rekananfk": rekanan,
                }
                console.log(objSave);
                // return

                
                for(var a=0; a<$scope.selectedData2.length; a++){
                    if(a!=0){
                        if($scope.selectedData2[a].objectspjfk != $scope.selectedData2[a-1].objectspjfk){
                            toastr.error('Tidak Bisa Memilih Pajak Dengan SPJ Berbeda', 'Informasi');
                            return
                        }
                    }
                }

                for(var b=0; b<$scope.selectedData2.length; b++){
                    if(b!=0){
                        if($scope.selectedData2[b].kodemataanggaran != $scope.selectedData2[b-1].kodemataanggaran){
                            toastr.error('Tidak Bisa Memilih Panjar Dengan Mata Anggaran Berbeda', 'Informasi');
                            return
                        }
                    }
                }
                medifirstService.post('perencanaan/save-bku', objSave).then(function (e) {
                    $scope.popupTambahBKU.center().close()
                    init();
                })

            }

            $scope.SaveBKUDetail = function () {
                var objSave = {
                    "norec": $scope.norecbku,
                    "tglbku": moment($scope.item.tglbkudetail).format('YYYY-MM-DD'),
                    "nobku": $scope.item.nobkudetail,
                    "asalproduk": $scope.item.jenisbku,
                }
                console.log(objSave);
                
                medifirstService.post('perencanaan/save-bku-detail', objSave).then(function (e) {
                    $scope.popupDetailBKU.center().close()
                    init();
                })

            }

            $scope.ClearData = function () {
                $scope.item.tglAwal = moment($scope.now).format('YYYY-MM-DD');
                $scope.item.tglAkhir = moment($scope.now).format('YYYY-MM-DD');
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

            $scope.selectedData2 = []; 
            
            $scope.onClickSatuSPM = function (e, param) {

				var element = $(e.currentTarget);
				var checked = element.is(':checked')
				var row = element.closest('tr')
				var grid = $("#grid").data("kendoGrid")
				var dataItem = grid.dataItem(row);
                $scope.item.uraianBKU = ''

				if (checked) {


					var result = $.grep($scope.selectedData2, function (e) {
						return e.nospm == dataItem.nospm;
					});
					if (result.length == 0) {
						$scope.selectedData2.push(dataItem);
					} else {
						for (var i = 0; i < $scope.selectedData2.length; i++)
							if ($scope.selectedData2[i].nospm === dataItem.nospm) {
								$scope.selectedData2.splice(i, 1);
								break;
							}
						$scope.selectedData2.push(dataItem);
					}
					row.addClass("k-state-selected");
                    
				} else {
					for (var i = 0; i < $scope.selectedData2.length; i++)
						if ($scope.selectedData2[i].nospm === dataItem.nospm) {
							$scope.selectedData2.splice(i, 1);
							break;
						}
					row.removeClass("k-state-selected");
				}

                $scope.item.sumberDana = {id: dataItem.idasalproduk, asalproduk: dataItem.asalproduk}

                for (var i = 0; i < $scope.selectedData2.length; i++){
                    if(i != $scope.selectedData2.length-1){
                        $scope.item.uraianBKU += $scope.selectedData2[i].untukpengeluaran + ', '
                    } else{
                        $scope.item.uraianBKU += $scope.selectedData2[i].untukpengeluaran
                    }
                }
                console.log($scope.selectedData2)
			}

            $scope.onClickSatuSPJ = function (e, param) {

				var element = $(e.currentTarget);
				var checked = element.is(':checked')
				var row = element.closest('tr')
				var grid = $("#gridk").data("kendoGrid")
				var dataItem = grid.dataItem(row);
                $scope.item.uraianBKU = ''

				if (checked) {
					var result = $.grep($scope.selectedData2, function (e) {
						return e.norealisasi == dataItem.norealisasi;
					});
					if (result.length == 0) {
						$scope.selectedData2.push(dataItem);
					} else {
						for (var i = 0; i < $scope.selectedData2.length; i++)
							if ($scope.selectedData2[i].norealisasi === dataItem.norealisasi) {
								$scope.selectedData2.splice(i, 1);
								break;
							}
						$scope.selectedData2.push(dataItem);
					}

                    $scope.item.pihakKetiga = {id: dataItem.idrekanan, namarekanan: dataItem.namarekanan}
					row.addClass("k-state-selected");
                    
				} else {
					for (var i = 0; i < $scope.selectedData2.length; i++)
						if ($scope.selectedData2[i].norealisasi === dataItem.norealisasi) {
							$scope.selectedData2.splice(i, 1);
							break;
						}
                    $scope.item.pihakKetiga = undefined
					row.removeClass("k-state-selected");
				}

                $scope.item.sumberDana = {id: dataItem.idasalproduk, asalproduk: dataItem.asalproduk}

                for (var i = 0; i < $scope.selectedData2.length; i++){
                    if(i != $scope.selectedData2.length-1){
                        $scope.item.uraianBKU += $scope.selectedData2[i].uraian + " \n " +
                        $scope.selectedData2[i].kodemataanggaran + " \n " +
                        $scope.item.pihakKetiga.namarekanan + ', '
                    } else{
                        $scope.item.uraianBKU += $scope.selectedData2[i].uraian + " \n " +
                        $scope.selectedData2[i].kodemataanggaran + " \n " +
                        $scope.item.pihakKetiga.namarekanan
                    }
                }
                console.log($scope.selectedData2)
			}

            $scope.onClickSatuJasaGiro = function (e, param) {

				var element = $(e.currentTarget);
				var checked = element.is(':checked')
				var row = element.closest('tr')
				var grid = $("#gridj").data("kendoGrid")
				var dataItem = grid.dataItem(row);
                $scope.item.uraianBKU = ''

				if (checked) {
					var result = $.grep($scope.selectedData2, function (e) {
						return e.nojasagiro == dataItem.nojasagiro;
					});
					if (result.length == 0) {
						$scope.selectedData2.push(dataItem);
					} else {
						for (var i = 0; i < $scope.selectedData2.length; i++)
							if ($scope.selectedData2[i].nojasagiro === dataItem.nojasagiro) {
								$scope.selectedData2.splice(i, 1);
								break;
							}
						$scope.selectedData2.push(dataItem);
					}
					row.addClass("k-state-selected");
                    
				} else {
					for (var i = 0; i < $scope.selectedData2.length; i++)
						if ($scope.selectedData2[i].nojasagiro === dataItem.nojasagiro) {
							$scope.selectedData2.splice(i, 1);
							break;
						}
					row.removeClass("k-state-selected");
				}

                $scope.item.sumberDana = {id: 18, asalproduk: 'Jasa Layanan'}

                for (var i = 0; i < $scope.selectedData2.length; i++){
                    if(i != $scope.selectedData2.length-1){
                        $scope.item.uraianBKU += $scope.selectedData2[i].uraianjasagiro + ', '
                    } else{
                        $scope.item.uraianBKU += $scope.selectedData2[i].uraianjasagiro
                    }
                }
                console.log($scope.selectedData2)
			}

            $scope.onClickSatuSTS = function (e, param) {

				var element = $(e.currentTarget);
				var checked = element.is(':checked')
				var row = element.closest('tr')
				var grid = $("#gridsts").data("kendoGrid")
				var dataItem = grid.dataItem(row);
                $scope.item.uraianBKU = ''

				if (checked) {
					var result = $.grep($scope.selectedData2, function (e) {
						return e.norec == dataItem.norec;
					});
					if (result.length == 0) {
						$scope.selectedData2.push(dataItem);
					} else {
						for (var i = 0; i < $scope.selectedData2.length; i++)
							if ($scope.selectedData2[i].norec === dataItem.norec) {
								$scope.selectedData2.splice(i, 1);
								break;
							}
						$scope.selectedData2.push(dataItem);
					}
					row.addClass("k-state-selected");
                    
				} else {
					for (var i = 0; i < $scope.selectedData2.length; i++)
						if ($scope.selectedData2[i].norec === dataItem.norec) {
							$scope.selectedData2.splice(i, 1);
							break;
						}
					row.removeClass("k-state-selected");
				}

                console.log($scope.selectedData2);

                $scope.item.sumberDana = {id: dataItem.idsumberdana, asalproduk: dataItem.asalproduk}

                for (var i = 0; i < $scope.selectedData2.length; i++){
                    if(i != $scope.selectedData2.length-1){
                        $scope.item.uraianBKU += $scope.selectedData2[i].uraiansts + ', '
                    } else{
                        $scope.item.uraianBKU += $scope.selectedData2[i].uraiansts
                    }
                }
                
			}

            $scope.onClickSatuPajak = function (e, param) {

				var element = $(e.currentTarget);
				var checked = element.is(':checked')
				var row = element.closest('tr')
				var grid = $("#gridp").data("kendoGrid")
				var dataItem = grid.dataItem(row);
                $scope.item.uraianBKU = ''

				if (checked) {
					var result = $.grep($scope.selectedData2, function (e) {
						return e.nopajak == dataItem.nopajak;
					});
					if (result.length == 0) {
						$scope.selectedData2.push(dataItem);
					} else {
						for (var i = 0; i < $scope.selectedData2.length; i++)
							if ($scope.selectedData2[i].nopajak === dataItem.nopajak) {
								$scope.selectedData2.splice(i, 1);
								break;
							}
						$scope.selectedData2.push(dataItem);
					}
					row.addClass("k-state-selected");
                    
				} else {
					for (var i = 0; i < $scope.selectedData2.length; i++)
						if ($scope.selectedData2[i].nopajak === dataItem.nopajak) {
							$scope.selectedData2.splice(i, 1);
							break;
						}
					row.removeClass("k-state-selected");
				}

                $scope.item.sumberDana = {id: dataItem.idasalproduk, asalproduk: dataItem.asalproduk}
                $scope.item.uraianBKU += $scope.selectedData2[$scope.selectedData2.length - 1].uraianpajak
                    
                console.log($scope.selectedData2)
			}

            $scope.onClickSatuPanjar = function (e, param) {

				var element = $(e.currentTarget);
				var checked = element.is(':checked')
				var row = element.closest('tr')
				var grid = $("#grids").data("kendoGrid")
				var dataItem = grid.dataItem(row);
                $scope.item.uraianBKU = ''

				if (checked) {
					var result = $.grep($scope.selectedData2, function (e) {
						return e.nospm == dataItem.nopanjar;
					});
					if (result.length == 0) {
						$scope.selectedData2.push(dataItem);
					} else {
						for (var i = 0; i < $scope.selectedData2.length; i++)
							if ($scope.selectedData2[i].nopanjar === dataItem.nopanjar) {
								$scope.selectedData2.splice(i, 1);
								break;
							}
						$scope.selectedData2.push(dataItem);
					}
					row.addClass("k-state-selected");
                    
				} else {
					for (var i = 0; i < $scope.selectedData2.length; i++)
						if ($scope.selectedData2[i].nopanjar === dataItem.nopanjar) {
							$scope.selectedData2.splice(i, 1);
							break;
						}
					row.removeClass("k-state-selected");
				}

                for (var i = 0; i < $scope.selectedData2.length; i++){
                    if(i != $scope.selectedData2.length-1){
                        $scope.item.uraianBKU += $scope.selectedData2[i].uraian + ', '
                    } else{
                        $scope.item.uraianBKU += $scope.selectedData2[i].uraian
                    }
                }
                console.log($scope.selectedData2)
			}
            $scope.onClickSatuPengembalianPanjar = function (e, param) {

				var element = $(e.currentTarget);
				var checked = element.is(':checked')
				var row = element.closest('tr')
				var grid = $("#gridpengembalianpanjar").data("kendoGrid")
				var dataItem = grid.dataItem(row);
                $scope.item.uraianBKU = ''

				if (checked) {
					var result = $.grep($scope.selectedData2, function (e) {
						return e.nospm == dataItem.nopanjar;
					});
					if (result.length == 0) {
						$scope.selectedData2.push(dataItem);
					} else {
						for (var i = 0; i < $scope.selectedData2.length; i++)
							if ($scope.selectedData2[i].nopanjar === dataItem.nopanjar) {
								$scope.selectedData2.splice(i, 1);
								break;
							}
						$scope.selectedData2.push(dataItem);
					}
					row.addClass("k-state-selected");
                    
				} else {
					for (var i = 0; i < $scope.selectedData2.length; i++)
						if ($scope.selectedData2[i].nopanjar === dataItem.nopanjar) {
							$scope.selectedData2.splice(i, 1);
							break;
						}
					row.removeClass("k-state-selected");
				}

                for (var i = 0; i < $scope.selectedData2.length; i++){
                    if(i != $scope.selectedData2.length-1){
                        $scope.item.uraianBKU += $scope.selectedData2[i].uraian + ', '
                    } else{
                        $scope.item.uraianBKU += $scope.selectedData2[i].uraian
                    }
                }
                console.log($scope.selectedData2)
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

            function DeleteBKU(e) {
                e.preventDefault();
                
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                var objSave = {
                    "norec": dataItem.norecbku,
                }
                
                medifirstService.post('perencanaan/delete-bku', objSave).then(function (e) {
                    init();
                })
            }

            function PilihBKU(e) {
                e.preventDefault();
                
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                console.log(dataItem)
                if(dataItem.id == 3){
                    if(dataItem.penerimaan == 0){
                        $scope.hidepanjar = false
                        $scope.hidepengembalianpanjar = true
                        $scope.hidespm =true
                        $scope.hidejasgir =true
                        $scope.hidepajak =true
                        $scope.hidespj =true
                        $scope.hidepengembalian =true
                        $scope.hidests =true
                        $scope.item.nobkudetail = dataItem.nobku
                        $scope.item.tglbkudetail = dataItem.tglbku
                        $scope.item.jenisbku = dataItem.asalproduk
                        $scope.norecbku = dataItem.norecbku
                        medifirstService.get("perencanaan/get-panjar-bku?norec="+dataItem.norecbku).then(function (e) {
                    
                            $scope.dataGridPanjar = new kendo.data.DataSource({
                                data:  e.data.data,
                                pageSize: 10,
                                total: e.data.data.length,
                                group: $scope.group,
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
                    } else if(dataItem.penerimaan != 0){
                        $scope.hidepanjar = true
                        $scope.hidepengembalianpanjar = true
                        $scope.hidespm =true
                        $scope.hidejasgir =true
                        $scope.hidepajak =true
                        $scope.hidespj =true
                        $scope.hidepengembalian =false
                        $scope.hidests =true
                        $scope.item.nobkudetail = dataItem.nobku
                        $scope.item.tglbkudetail = dataItem.tglbku
                        $scope.item.jenisbku = dataItem.asalproduk
                        $scope.norecbku = dataItem.norecbku
                        medifirstService.get("perencanaan/get-pengembalian-bku?norec="+dataItem.norecbku).then(function (e) {
                    
                            $scope.dataGridPengembalian = new kendo.data.DataSource({
                                data:  e.data.data,
                                pageSize: 10,
                                total: e.data.data.length,
                                group: $scope.group,
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
                    
                } else if(dataItem.id == 1){
                    $scope.hidespm = false
                    $scope.hidepanjar =true
                    $scope.hidepengembalianpanjar = true
                    $scope.hidejasgir =true
                    $scope.hidepajak =true
                    $scope.hidespj =true
                    $scope.hidepengembalian =true
                    $scope.hidests =true
                    $scope.item.nobkudetail = dataItem.nobku
                    $scope.item.tglbkudetail = dataItem.tglbku
                    $scope.item.jenisbku = dataItem.asalproduk
                    $scope.norecbku = dataItem.norecbku
                    medifirstService.get("perencanaan/get-spm-bku?norec="+dataItem.norecbku).then(function (e) {
                    
                        $scope.dataGridSPM = new kendo.data.DataSource({
                            data:  e.data.data,
                            pageSize: 10,
                            total: e.data.data.length,
                            group: $scope.group,
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
                } else if(dataItem.id == 5){
                    $scope.hidejasgir = false
                    $scope.hidepanjar =true
                    $scope.hidepengembalianpanjar = true
                    $scope.hidespm =true
                    $scope.hidepajak =true
                    $scope.hidespj =true
                    $scope.hidepengembalian =true
                    $scope.hidests =true
                    $scope.item.nobkudetail = dataItem.nobku
                    $scope.item.tglbkudetail = dataItem.tglbku
                    $scope.item.jenisbku = dataItem.asalproduk
                    $scope.norecbku = dataItem.norecbku
                    medifirstService.get("perencanaan/get-jasgir-bku?norec="+dataItem.norecbku).then(function (e) {
                    
                        $scope.dataGridJasaGiro = new kendo.data.DataSource({
                            data:  e.data.data,
                            pageSize: 10,
                            total: e.data.data.length,
                            group: $scope.group,
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
                } else if(dataItem.id == 6){
                    $scope.hidejasgir = true
                    $scope.hidepanjar =true
                    $scope.hidepengembalianpanjar = true
                    $scope.hidespm =true
                    $scope.hidepajak =true
                    $scope.hidespj =true
                    $scope.hidepengembalian =true
                    $scope.hidests =false
                    $scope.item.nobkudetail = dataItem.nobku
                    $scope.item.tglbkudetail = dataItem.tglbku
                    $scope.item.jenisbku = dataItem.asalproduk
                    $scope.norecbku = dataItem.norecbku
                    console.log(dataItem)

                    medifirstService.get("perencanaan/get-sts-keuangan?norec="+dataItem.norecbku).then(function (e) {
                        $scope.dataGridSTS = new kendo.data.DataSource({
                            data:  e.data.data,
                            pageSize: 10,
                            total: e.data.data.length,
                            group: $scope.group,
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
                } else if(dataItem.id == 4){
                    $scope.hidepajak = false
                    $scope.hidepanjar =true
                    $scope.hidepengembalianpanjar = true
                    $scope.hidespm =true
                    $scope.hidejasgir =true
                    $scope.hidespj =true
                    $scope.hidepengembalian =true
                    $scope.hidests =true
                    $scope.item.nobkudetail = dataItem.nobku
                    $scope.item.tglbkudetail = dataItem.tglbku
                    $scope.item.jenisbku = dataItem.asalproduk
                    $scope.norecbku = dataItem.norecbku
                    medifirstService.get("perencanaan/get-pajak-bku?norec="+dataItem.norecbku).then(function (e) {
                    
                        $scope.dataGridPajak = new kendo.data.DataSource({
                            data:  e.data.data,
                            pageSize: 10,
                            total: e.data.data.length,
                            group: $scope.group,
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
                } else if(dataItem.id == 2){
                    console.log(dataItem)
                    $scope.hidespm = true
                    $scope.hidepanjar =true
                    $scope.hidepengembalianpanjar = true
                    $scope.hidejasgir =true
                    $scope.hidepajak =true
                    $scope.hidespj =false
                    $scope.hidepengembalian =true
                    $scope.hidests =true
                    $scope.item.nobkudetail = dataItem.nobku
                    $scope.item.tglbkudetail = dataItem.tglbku
                    $scope.item.jenisbku = dataItem.asalproduk
                    $scope.norecbku = dataItem.norecbku
                    medifirstService.get("perencanaan/get-spj-bku?norec="+dataItem.norecbku).then(function (e) {
                    
                        $scope.dataGridSPJ = new kendo.data.DataSource({
                            data:  e.data.data,
                            pageSize: 10,
                            total: e.data.data.length,
                            group: $scope.group,
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

                $scope.popupDetailBKU.center().open()
            }
            

            $scope.columnGrid = {
                sortable: true,
                selectable: true,
                pageable: true,
                columns: [
                    {
                        "command": [
                              {
                                 text: "Detail",
                                 click: PilihBKU,
                                 imageClass: "clinic fa",
                                 visible: function(dataItem) { return dataItem.nospp }
                              },
                          ],
                             title: "",
                             width: "60px",
                             
                    },
                    {
                        
                        "field": "nobku",
                        "title": "Nomor BKU",
                        "width": "100px",
                    },
                    {
                        
                        "field": "jenisbukti",
                        "title": "Jenis Bukti",
                        "width": "100px",
                    },
                    {
                        
                        "field": "asalproduk",
                        "title": "Sumber Dana",
                        "width": "100px",
                    },
                    {
                        
                        "field": "tglbku",
                        "title": "Tanggal",
                        "width": "100px",
                    },
                    {
                        
                        "field": "uraianbku",
                        "title": "Uraian",
                        "width": "100px",
                    },
                    {
                        
                        "field": "namarekanan",
                        "title": "Rekanan",
                        "width": "100px",
                    },
                    {
                        
                        "field": "kodemataanggaran",
                        "title": "Kode Rek",
                        "width": "100px",
                    },
                    {
                        
                        "field": "penerimaan",
                        "title": "Penerimaan",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: penerimaan #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "pengeluaran",
                        "title": "Pengeluaran",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: pengeluaran #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "saldo",
                        "title": "Saldo",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: saldo #', 'Rp.')}}</span>",
                    },
                    {
                        "command": [
                              {
                                 text: "Delete",
                                 click: DeleteBKU,
                                 imageClass: "clinic fa",
                                 visible: function(dataItem) { return dataItem.nospp }
                              },
                          ],
                             title: "",
                             width: "60px",
                             
                    }
                ]
            };

            $scope.columnGridSTS = {
                sortable: true,
                selectable: true,
                pageable: true,
                columns: [
                    {
						"template": "<input type='checkbox' class='checkbox style-center' ng-click='onClickSatuSTS($event,2)' />",
						"width": "30px"
					},
                    {
                        
                        "field": "tglsts",
                        "title": "Tanggal",
                        "width": "100px",
                    },
                    {
                        
                        "field": "uraiansts",
                        "title": "Uraian",
                        "width": "100px",
                    },
                    {
                        
                        "field": "subkegiatan",
                        "title": "Sub Kegiatan",
                        "width": "100px",
                    },
                    {
                        
                        "field": "subsubkegiatan",
                        "title": "Sub Sub Kegiatan",
                        "width": "100px",
                    },
                    {
                        
                        "field": "mataanggaran",
                        "title": "Rekening",
                        "width": "100px",
                    },
                    {
                        
                        "field": "asalproduk",
                        "title": "Sumber Dana",
                        "width": "100px",
                    },
                    {
                        
                        "field": "nilaists",
                        "title": "Nilai STS",
                        "width": "100px",
                    },
                ]
            };

            $scope.columnGridPanjar = {
                sortable: true,
                selectable: "multiple",
                pageable: true,
                columns: [
                    {
						"template": "<input type='checkbox' class='checkbox style-center' ng-click='onClickSatuPanjar($event,2)' />",
						"width": "30px"
					},
                    {
                        
                        "field": "nopanjar",
                        "title": "Nomor Panjar",
                        "width": "100px",
                    },
                    {
                        
                        "field": "tglpanjar",
                        "title": "Tgl Panjar",
                        "width": "100px",
                    },
                    {
                        
                        "field": "uraian",
                        "title": "Uraian",
                        "width": "100px",
                    },
                    {
                        
                        "field": "jumlah",
                        "title": "Jumlah",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlah #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "kodemataanggaran",
                        "title": "Kode Rek.",
                        "width": "100px",
                    },
                    {
                        
                        "field": "subkegiatan",
                        "title": "Sub Kegiatan",
                        "width": "100px",
                    },
                    {
                        
                        "field": "subsubkegiatan",
                        "title": "Sub Sub Kegiatan",
                        "width": "100px",
                    },
                    {
                        
                        "field": "jenispanjar",
                        "title": "Jenis Panjar",
                        "width": "100px",
                    },
                    // {
                        
                    //     "field": "jumlahpengembalian",
                    //     "title": "Pengembalian",
                    //     "width": "100px",
                    //     "template": "<span class='style-right'>{{formatRupiah('#: jumlahpengembalian #', 'Rp.')}}</span>",
                    // }
                ]
            };

            $scope.columnGridPengembalianPanjar = {
                sortable: true,
                selectable: "multiple",
                pageable: true,
                columns: [
                    {
						"template": "<input type='checkbox' class='checkbox style-center' ng-click='onClickSatuPengembalianPanjar($event,2)' />",
						"width": "30px"
					},
                    {
                        
                        "field": "nopanjar",
                        "title": "Nomor Panjar",
                        "width": "100px",
                    },
                    {
                        
                        "field": "tglpanjar",
                        "title": "Tgl Panjar",
                        "width": "100px",
                    },
                    {
                        
                        "field": "uraian",
                        "title": "Uraian",
                        "width": "100px",
                    },
                    {
                        
                        "field": "jumlah",
                        "title": "Jumlah",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlah #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "kodemataanggaran",
                        "title": "Kode Rek.",
                        "width": "100px",
                    },
                    {
                        
                        "field": "subkegiatan",
                        "title": "Sub Kegiatan",
                        "width": "100px",
                    },
                    {
                        
                        "field": "subsubkegiatan",
                        "title": "Sub Sub Kegiatan",
                        "width": "100px",
                    },
                    {
                        
                        "field": "jenispanjar",
                        "title": "Jenis Panjar",
                        "width": "100px",
                    },
                    {
                        
                        "field": "jumlahpengembalian",
                        "title": "Pengembalian",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahpengembalian #', 'Rp.')}}</span>",
                    }
                ]
            };

            $scope.columnGridPengembalian = {
                columns:[
                {
                    "field": "tglpengembalian",
                    "title": "Tgl Pengembalian",
                },
                {
                    "field": "keterangan",
                    "title": "Keterangan",
                },
                {
                    "field": "subkegiatan",
                    "title": "Sub Kegiatan",
                },
                {
                    "field": "subsubkegiatan",
                    "title": "Sub Sub Kegiatan",
                },
                {
                    "field": "kodemataanggaran",
                    "title": "Kode Mata Anggaran",
                },
                {
                    "field": "jumlahpengembalian",
                    "title": "Jml Pengembalian",
                }
            ]};

            $scope.columnGridSPM = {
                sortable: true,
                selectable: "multiple",
                pageable: true,
                columns: [
                    {
						"template": "<input type='checkbox' class='checkbox style-center' ng-click='onClickSatuSPM($event,2)' />",
						"width": "30px"
					},
                    {
                        
                        "field": "tglspm",
                        "title": "Tanggal SPM",
                        "width": "100px",
                    },
                    {
                        
                        "field": "nospm",
                        "title": "No SPM",
                        "width": "100px",
                    },
                    {
                        
                        "field": "untukpengeluaran",
                        "title": "Uraian",
                        "width": "100px",
                    },
                    {
                        
                        "field": "asalproduk",
                        "title": "Sumber Dana",
                        "width": "100px",
                    },
                    {
                        
                        "field": "jenisbukti",
                        "title": "Jenis Bukti",
                        "width": "100px",
                    },
                    {
                        
                        "field": "status",
                        "title": "Status",
                        "width": "100px",
                    },
                    {
                        
                        "field": "tglsah",
                        "title": "Tanggal Sah",
                        "width": "100px",
                    },
                    {
                        
                        "field": "nilaispm",
                        "title": "Nilai",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: nilaispm #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "noreg",
                        "title": "Noreg",
                        "width": "100px",
                    },
                    {
                        
                        "field": "norec",
                        "title": "Norec",
                        "width": "100px",
                        "hidden": true
                    }

                ]
            };

            $scope.columnGridJasaGiro = {
                sortable: true,
                selectable: "multiple",
                pageable: true,
                columns: [
                    {
						"template": "<input type='checkbox' class='checkbox style-center' ng-click='onClickSatuJasaGiro($event,2)' />",
						"width": "30px"
					},
                    {
                        
                        "field": "nojasagiro",
                        "title": "No Jasa Giro",
                        "width": "100px",
                    },
                    {
                        
                        "field": "uraianjasagiro",
                        "title": "Uraian Jasa Giro",
                        "width": "100px",
                    },
                    {
                        
                        "field": "tglpemasukan",
                        "title": "Tgl Pemasukan",
                        "width": "100px",
                    },
                    {
                        
                        "field": "jumlahpemasukan",
                        "title": "Jumlah Masuk",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahpemasukan #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "tglpengeluaran",
                        "title": "Tgl Pengeluaran",
                        "width": "100px",
                    },
                    {
                        
                        "field": "jumlahpengeluaran",
                        "title": "Jumlah Keluar",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahpengeluaran #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "norec",
                        "title": "Norec",
                        "width": "100px",
                        "hidden": true
                    }

                ]
            };

            $scope.columnGridPajak = {
                sortable: true,
                selectable: "multiple",
                pageable: true,
                columns: [
                    {
						"template": "<input type='checkbox' class='checkbox style-center' ng-click='onClickSatuPajak($event,2)' />",
						"width": "30px"
					},
                    {
                        
                        "field": "nopajak",
                        "title": "Nomor Bukti",
                        "width": "100px",
                    },
                    {
                        
                        "field": "asalproduk",
                        "title": "Sumber Dana",
                        "width": "100px",
                    },
                    {
                        
                        "field": "tanggal",
                        "title": "Tanggal",
                        "width": "100px",
                    },
                    {
                        
                        "field": "koderek",
                        "title": "Kode Rek",
                        "width": "100px",
                    },
                    {
                        
                        "field": "jumlahpenerimaan",
                        "title": "Jml Penerimaan",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahpenerimaan #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahpengeluaran",
                        "title": "Jml Pengeluaran",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahpengeluaran #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "norec",
                        "title": "Norec",
                        "width": "100px",
                        "hidden": true
                    },
                    {
                        
                        "field": "uraianpajak",
                        "title": "Uraian",
                        "width": "100px",
                    }
                ]
            };

            $scope.columnGridSPJ = {
                sortable: true,
                selectable: "multiple",
                pageable: true,
                columns: [
                    {
						"template": "<input type='checkbox' class='checkbox style-center' ng-click='onClickSatuSPJ($event,2)' />",
						"width": "30px"
					},
                    {
                        
                        "field": "norealisasi",
                        "title": "Nomor SPJ",
                        "width": "100px",
                    },
                    {
                        
                        "field": "namarekanan",
                        "title": "Rekanan",
                        "width": "100px",
                    },
                    {
                        
                        "field": "asalproduk",
                        "title": "Sumber Dana",
                        "width": "100px",
                    },
                    {
                        
                        "field": "uraian",
                        "title": "Uraian",
                        "width": "100px",
                    },
                    {
                        
                        "field": "carabayar",
                        "title": "Cara Bayar",
                        "width": "100px",
                    },
                    {
                        
                        "field": "jumlahpanjar",
                        "title": "Total",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahpanjar #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "kodemataanggaran",
                        "title": "Rekening",
                        "width": "100px",
                    },
                    {
                        
                        "field": "tglverif",
                        "title": "Tgl Verif",
                        "width": "100px",
                    },
                    {
                        
                        "field": "jumlahdibayarverif",
                        "title": "Total",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahdibayarverif #', 'Rp.')}}</span>",
                    }
                ]
            };


            $scope.formatRupiah = function (value, currency) {
                return currency + " " + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            }
            //////////////////////////////////////////////////////////////          END             /////////////////////////////////////////////////////////////////////////////////////       
        }
    ]);
});