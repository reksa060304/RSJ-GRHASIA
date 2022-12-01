define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict';
    var baseTransaksi = configuration.baseApiBackend;
    initialize.controller('STSManualCtrl', ['$scope', 'DateHelper', '$http', '$state', 'MedifirstService',
        function ($scope, dateHelper, $http, $state, medifirstService) {
            //Inisial Variable   
            $scope.isRouteLoading = false;
            $scope.item = {};
            $scope.now = new Date();
            $scope.date = new Date();
            $scope.item.tglAwal = moment($scope.now).format('YYYY-MM-DD 00:00');
            $scope.item.tglAkhir = moment($scope.now).format('YYYY-MM-DD 23:59');
            $scope.item.tanggalSTS = moment($scope.now).format('YYYY-MM-DD HH:mm:ss');
            $scope.dataSelected = {};
            $scope.item.jmlRows = 50;
            $scope.item.jumlahlain = 0
            $scope.item.jumlahranap = 0
            $scope.item.kendaraan = 0 
            $scope.item.akreditasi = 0 
            $scope.item.dendabpjs = 0
            $scope.item.jasabank = 0 
            $scope.item.lainlain = 0 
            $scope.item.liquidgas = 0 
            $scope.item.saldoslipa = 0 
            $scope.item.klaimbpjs = 0 
            $scope.item.girobtn = 0 
            $scope.item.saldosutera = 0
            $scope.item.klaimcovid = 0
            $scope.item.voljumlahlain = 0
            $scope.item.voljumlahranap = 0
            $scope.item.volkendaraan = 0 
            $scope.item.volakreditasi = 0 
            $scope.item.voldendabpjs = 0
            $scope.item.voljasabank = 0 
            $scope.item.vollainlain = 0 
            $scope.item.volliquidgas = 0 
            $scope.item.volsaldoslipa = 0 
            $scope.item.volklaimbpjs = 0 
            $scope.item.volgirobtn = 0 
            $scope.item.volsaldosutera = 0
            $scope.item.volklaimcovid = 0
            $scope.item.voljumlahpenunjang = 0
            $scope.item.jumlahpenunjang = 0
            $scope.item.diklat = 0
            $scope.item.voldiklat = 0
            $scope.item.terbilang = ''

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

                var nosts="";
                if ($scope.item.Nosts != undefined) {
					nosts = "&nosts=" + $scope.item.Nosts;
                }

                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                // var tgl = moment($scope.tanggal).format('DD/MM/YYYY');
                medifirstService.get("bendaharapenerimaan/get-sts-manual?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir+ nosts
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
                $scope.item.tanggalSTS = moment($scope.now).format('YYYY-MM-DD HH:mm');
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
						return e.nosts == dataItem.nosts;
					});
					if (result.length == 0) {
						$scope.selectedData2.push(dataItem);
					} else {
						for (var i = 0; i < $scope.selectedData2.length; i++)
							if ($scope.selectedData2[i].nosts === dataItem.nosts) {
								$scope.selectedData2.splice(i, 1);
								break;
							}
						$scope.selectedData2.push(dataItem);
					}
					row.addClass("k-state-selected");
				} else {
					for (var i = 0; i < $scope.selectedData2.length; i++)
						if ($scope.selectedData2[i].nosts === dataItem.nosts) {
							$scope.selectedData2.splice(i, 1);
							break;
						}
					row.removeClass("k-state-selected");
				}

                $scope.item.dipilih = $scope.selectedData2.length;
				
			}

            var objSave =
            {
                setoran: $scope.selectedData2
            }

            console.log(objSave.setoran.length);

            $scope.tambahsts = function () {
                $scope.popUpTambahSTS.center().open()
            }

            $scope.cetakpdf = function(){
                console.log($scope.selectedData2)
                window.open(baseTransaksi + "report/get-cetak-sts-manual-pdf?nosts="+$scope.selectedData2[0].nosts, '_blank');
            }

            $scope.simpanSTS = function () {

                var toltal = parseFloat($scope.item.jumlahlain) + parseFloat($scope.item.jumlahranap) 
                medifirstService.get("sysadmin/general/get-terbilang-tidak-bulat/" + toltal).then(
					function (dat) {
						$scope.item.terbilang = dat.data.terbilang;

                        var objSave =
                        {
                            tglsts: moment($scope.item.tglstsmanual).format('YYYY-MM-DD'),
                            uraian: $scope.item.uraiansts,
                            terbilang: $scope.item.terbilang,
                            jumlahlain: $scope.item.jumlahlain,
                            jumlahranap: $scope.item.jumlahranap,
                            jumlahpenunjang: $scope.item.jumlahpenunjang,
                            kendaraan: $scope.item.kendaraan,
                            akreditasi: $scope.item.akreditasi,
                            dendabpjs: $scope.item.dendabpjs,
                            jasabank: $scope.item.jasabank,
                            lainlain: $scope.item.lainlain,
                            liquidgas: $scope.item.liquidgas,
                            saldoslipa: $scope.item.saldoslipa,
                            klaimbpjs: $scope.item.klaimbpjs,
                            girobtn: $scope.item.girobtn,
                            saldosutera: $scope.item.saldosutera,
                            klaimcovid: $scope.item.klaimcovid,
                            diklat: $scope.item.diklat,
                            voljumlahlain: $scope.item.voljumlahlain,
                            voljumlahranap: $scope.item.voljumlahranap,
                            voljumlahpenunjang: $scope.item.voljumlahpenunjang,
                            volkendaraan: $scope.item.volkendaraan,
                            volakreditasi: $scope.item.volakreditasi,
                            voldendabpjs: $scope.item.voldendabpjs,
                            voljasabank: $scope.item.voljasabank,
                            vollainlain: $scope.item.vollainlain,
                            volliquidgas: $scope.item.volliquidgas,
                            volsaldoslipa: $scope.item.volsaldoslipa,
                            volklaimbpjs: $scope.item.volklaimbpjs,
                            volgirobtn: $scope.item.volgirobtn,
                            volsaldosutera: $scope.item.volsaldosutera,
                            volklaimcovid: $scope.item.volklaimcovid,
                            voldiklat: $scope.item.voldiklat,
                        }

                        medifirstService.post('bendaharapenerimaan/save-sts-manual', objSave).then(function (dat) {});
                    }
                );
            }

            $scope.$watch('item.kendaraan', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    $scope.item.jumlahlain = parseFloat($scope.item.kendaraan) + parseFloat($scope.item.akreditasi) + parseFloat($scope.item.dendabpjs) +
                    parseFloat($scope.item.jasabank) + parseFloat($scope.item.lainlain) + parseFloat($scope.item.liquidgas) + parseFloat($scope.item.saldoslipa) + parseFloat($scope.item.klaimbpjs) + 
                    parseFloat($scope.item.girobtn) + parseFloat($scope.item.saldosutera)
                }
            });

            $scope.$watch('item.akreditasi', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    $scope.item.jumlahlain = parseFloat($scope.item.kendaraan) + parseFloat($scope.item.akreditasi) + parseFloat($scope.item.dendabpjs) +
                    parseFloat($scope.item.jasabank) + parseFloat($scope.item.lainlain) + parseFloat($scope.item.liquidgas) + parseFloat($scope.item.saldoslipa) + parseFloat($scope.item.klaimbpjs) + 
                    parseFloat($scope.item.girobtn) + parseFloat($scope.item.saldosutera)
                }
            });

            $scope.$watch('item.dendabpjs', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    $scope.item.jumlahlain = parseFloat($scope.item.kendaraan) + parseFloat($scope.item.akreditasi) + parseFloat($scope.item.dendabpjs) +
                    parseFloat($scope.item.jasabank) + parseFloat($scope.item.lainlain) + parseFloat($scope.item.liquidgas) + parseFloat($scope.item.saldoslipa) + parseFloat($scope.item.klaimbpjs) + 
                    parseFloat($scope.item.girobtn) + parseFloat($scope.item.saldosutera)
                }
            });

            $scope.$watch('item.jasabank', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    $scope.item.jumlahlain = parseFloat($scope.item.kendaraan) + parseFloat($scope.item.akreditasi) + parseFloat($scope.item.dendabpjs) +
                    parseFloat($scope.item.jasabank) + parseFloat($scope.item.lainlain) + parseFloat($scope.item.liquidgas) + parseFloat($scope.item.saldoslipa) + parseFloat($scope.item.klaimbpjs) + 
                    parseFloat($scope.item.girobtn) + parseFloat($scope.item.saldosutera)
                }
            });

            $scope.$watch('item.lainlain', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    $scope.item.jumlahlain = parseFloat($scope.item.kendaraan) + parseFloat($scope.item.akreditasi) + parseFloat($scope.item.dendabpjs) +
                    parseFloat($scope.item.jasabank) + parseFloat($scope.item.lainlain) + parseFloat($scope.item.liquidgas) + parseFloat($scope.item.saldoslipa) + parseFloat($scope.item.klaimbpjs) + 
                    parseFloat($scope.item.girobtn) + parseFloat($scope.item.saldosutera)
                }
            });

            $scope.$watch('item.liquidgas', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    $scope.item.jumlahlain = parseFloat($scope.item.kendaraan) + parseFloat($scope.item.akreditasi) + parseFloat($scope.item.dendabpjs) +
                    parseFloat($scope.item.jasabank) + parseFloat($scope.item.lainlain) + parseFloat($scope.item.liquidgas) + parseFloat($scope.item.saldoslipa) + parseFloat($scope.item.klaimbpjs) + 
                    parseFloat($scope.item.girobtn) + parseFloat($scope.item.saldosutera)
                }
            });

            $scope.$watch('item.saldoslipa', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    $scope.item.jumlahlain = parseFloat($scope.item.kendaraan) + parseFloat($scope.item.akreditasi) + parseFloat($scope.item.dendabpjs) +
                    parseFloat($scope.item.jasabank) + parseFloat($scope.item.lainlain) + parseFloat($scope.item.liquidgas) + parseFloat($scope.item.saldoslipa) + parseFloat($scope.item.klaimbpjs) + 
                    parseFloat($scope.item.girobtn) + parseFloat($scope.item.saldosutera)
                }
            });

            $scope.$watch('item.klaimbpjs', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    $scope.item.jumlahlain = parseFloat($scope.item.kendaraan) + parseFloat($scope.item.akreditasi) + parseFloat($scope.item.dendabpjs) +
                    parseFloat($scope.item.jasabank) + parseFloat($scope.item.lainlain) + parseFloat($scope.item.liquidgas) + parseFloat($scope.item.saldoslipa) + parseFloat($scope.item.klaimbpjs) + 
                    parseFloat($scope.item.girobtn) + parseFloat($scope.item.saldosutera)
                }
            });

            $scope.$watch('item.girobtn', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    $scope.item.jumlahlain = parseFloat($scope.item.kendaraan) + parseFloat($scope.item.akreditasi) + parseFloat($scope.item.dendabpjs) +
                    parseFloat($scope.item.jasabank) + parseFloat($scope.item.lainlain) + parseFloat($scope.item.liquidgas) + parseFloat($scope.item.saldoslipa) + parseFloat($scope.item.klaimbpjs) + 
                    parseFloat($scope.item.girobtn) + parseFloat($scope.item.saldosutera)
                }
            });

            $scope.$watch('item.saldosutera', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    $scope.item.jumlahlain = parseFloat($scope.item.kendaraan) + parseFloat($scope.item.akreditasi) + parseFloat($scope.item.dendabpjs) +
                    parseFloat($scope.item.jasabank) + parseFloat($scope.item.lainlain) + parseFloat($scope.item.liquidgas) + parseFloat($scope.item.saldoslipa) + parseFloat($scope.item.klaimbpjs) + 
                    parseFloat($scope.item.girobtn) + parseFloat($scope.item.saldosutera)
                }
            });

            $scope.$watch('item.klaimcovid', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    $scope.item.jumlahranap = parseFloat($scope.item.klaimcovid)
                }
            });

            $scope.$watch('item.diklat', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    $scope.item.jumlahpenunjang = parseFloat($scope.item.diklat)
                }
            });

            $scope.$watch('item.voldiklat', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    $scope.item.voljumlahpenunjang = parseFloat($scope.item.voldiklat)
                }
            });

            $scope.$watch('item.volkendaraan', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    $scope.item.voljumlahlain = parseFloat($scope.item.volkendaraan) + parseFloat($scope.item.volakreditasi) + parseFloat($scope.item.voldendabpjs) +
                    parseFloat($scope.item.voljasabank) + parseFloat($scope.item.vollainlain) + parseFloat($scope.item.volliquidgas) + parseFloat($scope.item.volsaldoslipa) + parseFloat($scope.item.volklaimbpjs) + 
                    parseFloat($scope.item.volgirobtn) + parseFloat($scope.item.volsaldosutera)
                }
            });

            $scope.$watch('item.volakreditasi', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    $scope.item.voljumlahlain = parseFloat($scope.item.volkendaraan) + parseFloat($scope.item.volakreditasi) + parseFloat($scope.item.voldendabpjs) +
                    parseFloat($scope.item.voljasabank) + parseFloat($scope.item.vollainlain) + parseFloat($scope.item.volliquidgas) + parseFloat($scope.item.volsaldoslipa) + parseFloat($scope.item.volklaimbpjs) + 
                    parseFloat($scope.item.volgirobtn) + parseFloat($scope.item.volsaldosutera)
                }
            });

            $scope.$watch('item.voldendabpjs', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    $scope.item.voljumlahlain = parseFloat($scope.item.volkendaraan) + parseFloat($scope.item.volakreditasi) + parseFloat($scope.item.voldendabpjs) +
                    parseFloat($scope.item.voljasabank) + parseFloat($scope.item.vollainlain) + parseFloat($scope.item.volliquidgas) + parseFloat($scope.item.volsaldoslipa) + parseFloat($scope.item.volklaimbpjs) + 
                    parseFloat($scope.item.volgirobtn) + parseFloat($scope.item.volsaldosutera)
                }
            });

            $scope.$watch('item.voljasabank', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    $scope.item.voljumlahlain = parseFloat($scope.item.volkendaraan) + parseFloat($scope.item.volakreditasi) + parseFloat($scope.item.voldendabpjs) +
                    parseFloat($scope.item.voljasabank) + parseFloat($scope.item.vollainlain) + parseFloat($scope.item.volliquidgas) + parseFloat($scope.item.volsaldoslipa) + parseFloat($scope.item.volklaimbpjs) + 
                    parseFloat($scope.item.volgirobtn) + parseFloat($scope.item.volsaldosutera)
                }
            });

            $scope.$watch('item.vollainlain', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    $scope.item.voljumlahlain = parseFloat($scope.item.volkendaraan) + parseFloat($scope.item.volakreditasi) + parseFloat($scope.item.voldendabpjs) +
                    parseFloat($scope.item.voljasabank) + parseFloat($scope.item.vollainlain) + parseFloat($scope.item.volliquidgas) + parseFloat($scope.item.volsaldoslipa) + parseFloat($scope.item.volklaimbpjs) + 
                    parseFloat($scope.item.volgirobtn) + parseFloat($scope.item.volsaldosutera)
                }
            });

            $scope.$watch('item.volliquidgas', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    $scope.item.voljumlahlain = parseFloat($scope.item.volkendaraan) + parseFloat($scope.item.volakreditasi) + parseFloat($scope.item.voldendabpjs) +
                    parseFloat($scope.item.voljasabank) + parseFloat($scope.item.vollainlain) + parseFloat($scope.item.volliquidgas) + parseFloat($scope.item.volsaldoslipa) + parseFloat($scope.item.volklaimbpjs) + 
                    parseFloat($scope.item.volgirobtn) + parseFloat($scope.item.volsaldosutera)
                }
            });

            $scope.$watch('item.volsaldoslipa', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    $scope.item.voljumlahlain = parseFloat($scope.item.volkendaraan) + parseFloat($scope.item.volakreditasi) + parseFloat($scope.item.voldendabpjs) +
                    parseFloat($scope.item.voljasabank) + parseFloat($scope.item.vollainlain) + parseFloat($scope.item.volliquidgas) + parseFloat($scope.item.volsaldoslipa) + parseFloat($scope.item.volklaimbpjs) + 
                    parseFloat($scope.item.volgirobtn) + parseFloat($scope.item.volsaldosutera)
                }
            });

            $scope.$watch('item.volklaimbpjs', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    $scope.item.voljumlahlain = parseFloat($scope.item.volkendaraan) + parseFloat($scope.item.volakreditasi) + parseFloat($scope.item.voldendabpjs) +
                    parseFloat($scope.item.voljasabank) + parseFloat($scope.item.vollainlain) + parseFloat($scope.item.volliquidgas) + parseFloat($scope.item.volsaldoslipa) + parseFloat($scope.item.volklaimbpjs) + 
                    parseFloat($scope.item.volgirobtn) + parseFloat($scope.item.volsaldosutera)
                }
            });

            $scope.$watch('item.volgirobtn', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    $scope.item.voljumlahlain = parseFloat($scope.item.volkendaraan) + parseFloat($scope.item.volakreditasi) + parseFloat($scope.item.voldendabpjs) +
                    parseFloat($scope.item.voljasabank) + parseFloat($scope.item.vollainlain) + parseFloat($scope.item.volliquidgas) + parseFloat($scope.item.volsaldoslipa) + parseFloat($scope.item.volklaimbpjs) + 
                    parseFloat($scope.item.volgirobtn) + parseFloat($scope.item.volsaldosutera)
                }
            });

            $scope.$watch('item.volsaldosutera', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    $scope.item.voljumlahlain = parseFloat($scope.item.volkendaraan) + parseFloat($scope.item.volakreditasi) + parseFloat($scope.item.voldendabpjs) +
                    parseFloat($scope.item.voljasabank) + parseFloat($scope.item.vollainlain) + parseFloat($scope.item.volliquidgas) + parseFloat($scope.item.volsaldoslipa) + parseFloat($scope.item.volklaimbpjs) + 
                    parseFloat($scope.item.volgirobtn) + parseFloat($scope.item.volsaldosutera)
                }
            });

            $scope.$watch('item.volklaimcovid', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    $scope.item.voljumlahranap = parseFloat($scope.item.volklaimcovid)
                }
            });

            $scope.columnPenerimaan = {
                selectable: true,
                pageable: true,
                columns: [
                    {
                        "field": "no",
                        "title": "No",
                        "width": "50px"
                    },
                    {
                        
                        "field": "nosbm",
                        "title": "No SBM",
                        "width": "100px",
                    },
                    {
                        
                        "field": "namapasien",
                        "title": "Nama Pasien",
                        "width": "100px",
                    },
                    {
                        
                        "field": "nocm",
                        "title": "No RM",
                        "width": "100px",
                    },
                    {
                        
                        "field": "noreg",
                        "title": "No Registrasi",
                        "width": "100px",
                    },
                    {
                        
                        "field": "totalpenerimaan",
                        "title": "Total Penerimaan",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: totalpenerimaan #', 'Rp.')}}</span>",
                    }
                ]
            };

            $scope.detail = function () {
                var nostsdetail = $scope.selectedData2[0].nosts;
                    if($scope.selectedData2.length > 1){
                        toastr.error('Pilih 1 Data STS Saja');
                    }
                    else
                    {
						medifirstService.get("bendaharapenerimaan/detail-sts-manual?" + "nostsdetail=" + nostsdetail).then(
                            function (dat) {
                                $scope.isRouteLoading = false;
                                for (var i = 0; i < dat.data.detail.length; i++) {
                                    dat.data.detail[i].no = i + 1;
                                    if(dat.data.detail[i].kolom1 != null){
                                        dat.data.detail[i].rpkolom1 = 'Rp';
                                    }

                                    if(dat.data.detail[i].kolom2 != null){
                                        dat.data.detail[i].rpkolom2 = 'Rp';
                                    }

                                    if(i == dat.data.detail.length-1){
                                        $scope.item.terbilangsts = dat.data.detail[i].terbilang;
                                        $scope.item.totalsts = dat.data.detail[i].kolom2;
                                        $scope.item.nosts = dat.data.detail[i].nosts;
                                        $scope.item.tglpenerimaansts = dat.data.detail[i].tglpenerimaan;
                                        $scope.item.namasts = dat.data.detail[i].keterangan;
                                    }
                                }
                                $scope.dataSTS = new kendo.data.DataSource({
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
                            }
                        );
                    }
                
            }

            $scope.batal = function () {
                console.log(objSave)
                medifirstService.post('sysadmin/logging/save-log-batal-sts-manual', objSave).then(function (data) {
                })
            }

            $scope.columnGrid = {
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
                        
                        "field": "tglpenerimaan",
                        "title": "Tanggal STS",
                        "width": "100px",
                    },
                    {
                        
                        "field": "totalsetoran",
                        "title": "Total STS",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: totalsetoran #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "nosts",
                        "title": "No STS (Surat Tanda Setoran)",
                        "width": "100px",
                    },
                ]
            };
            

            $scope.columnSTS = {
                toolbar: [
                    "excel",
                ],
                excel: {
                    fileName: "SuratTandaSetoran.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];

                    sheet.mergedCells = ["A1:H1", "A2:H2", "A5:H5", "A6:H6", "E9:H10"];
                    sheet.name = "Report";
                    var awal = moment($scope.item.tglAwal).format('YYYY-MM-DD');
                    var akhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD');
                    var terbilang = $scope.item.terbilangsts;
                    var nosts = $scope.item.nosts;
                    var total = $scope.item.totalsts;
                    var tglpenerimaan = moment($scope.item.tglpenerimaansts).format('DD-MM-YYYY');
                    var carabayar = $scope.item.carabayarsts;
                    var nama = $scope.item.namasts;

                    sheet.rows[0].cells[0].background = '#ffffff'; 
                    sheet.rows[0].cells[0].color = '#000000';
                    sheet.rows[0].cells[0].textAlign = 'center';
                    sheet.rows[0].cells[1].background = '#ffffff'; 
                    sheet.rows[0].cells[1].color = '#000000';
                    sheet.rows[0].cells[1].textAlign = 'center'; 
                    sheet.rows[0].cells[2].background = '#ffffff'; 
                    sheet.rows[0].cells[2].color = '#000000';
                    sheet.rows[0].cells[2].textAlign = 'center'; 
                    sheet.rows[0].cells[3].background = '#ffffff'; 
                    sheet.rows[0].cells[3].color = '#000000';
                    sheet.rows[0].cells[3].textAlign = 'center'; 
                    sheet.rows[0].cells[4].background = '#ffffff'; 
                    sheet.rows[0].cells[4].color = '#000000';
                    sheet.rows[0].cells[4].textAlign = 'center';
                    sheet.rows[0].cells[4].colspan = 4;
                    sheet.rows[0].cells[4].rowspan = 2;

                    for (var i = 0; i < e.workbook.sheets[0].rows.length; i++) {
                        var $row = e.workbook.sheets[0].rows[i];
                        for (var j = 0; j < $row.cells.length; j++) {
                            var $cell = $row.cells[j];
                            $cell["borderTop"] = { color: "#000000", size: 1 };
                            $cell["borderRight"] = { color: "#000000", size: 1 };
                            $cell["borderBottom"] = { color: "#000000", size: 1 };
                            $cell["borderLeft"] = { color: "#000000", size: 1 };
                        }
                        console.log(e.workbook.sheets[0].rows.length);
                        console.log(e.workbook.sheets[0].rows[i].cells.length);
                    }

                    var columns = e.workbook.sheets[0].columns;
                    delete columns[0].width;
                    columns[0].width = 160;
                    delete columns[2].width;
                    columns[2].width = 300;
                    delete columns[3].width;
                    columns[3].width = 145;
                    delete columns[4].width;
                    columns[4].width = 35;
                    delete columns[5].width;
                    columns[5].width = 100;
                    delete columns[6].width;
                    columns[6].width = 35;
                    delete columns[7].width;
                    columns[7].width = 175;

                    var myHeaders = [{
                        value: "SURAT TANDA SETORAN",
                        fontSize: 14,
                        fontWeight: 500,
                        textAlign: "center",
                        backgroundUrl: "#fffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 30 });

                    var myHeaders = [{
                        value: "(STS)",
                        fontSize: 14,
                        fontWeight: 500,
                        textAlign: "center",
                        backgroundUrl: "#fffff"
                    }];

                    sheet.rows.splice(1, 0, { cells: myHeaders, type: "header", height: 30 });

                    var myHeaders = [{
                        value: "No. STS: " + nosts,
                        fontSize: 11,
                        fontWeight: 500,
                        backgroundUrl: "#fffff",
                        textAlign : "right"
                    }];

                    sheet.rows.splice(2, 0, {
                        cells: [{value:"No. STS: " + nosts, colSpan: 4},{value:"No. Giro: 041-111-000043",colSpan: 4}],
                        type: "header",
                        height: 20,
                    });

                    sheet.rows.splice(3, 0, {
                        cells: [{value:"Harap menerima uang sebesar: ", colSpan: 4},{value:"Rp.   " + total,colSpan: 4}],
                        type: "header",
                        height: 20,
                    });

                    var myHeaders = [{
                        value: "Terbilang: " + terbilang,
                        fontSize: 11,
                        fontWeight: 500,
                        textAlign: "left",
                        backgroundUrl: "#fffff"
                    }];

                    sheet.rows.splice(4, 0, { cells: myHeaders, type: "header", height: 25 });

                    
                        var myHeaders = [{
                            value: "Yaitu: " + nama,
                            fontSize: 11,
                            fontWeight: 500,
                            textAlign: "left",
                            backgroundUrl: "#fffff"
                        }];

                        sheet.rows.splice(5, 0, { cells: myHeaders, type: "header", height: 25, width: 10 });
                    

                    sheet.rows.splice(6, 0, {
                        cells: [{value:" ", colSpan: 1},{value:": Tgl " + tglpenerimaan,colSpan: 7}],
                        type: "header",
                        height: 20,
                    });

                    var myHeaders = [{
                        value: "",
                        fontSize: 10,
                        fontWeight: 500,
                        textAlign: "left",
                        backgroundUrl: "#fffff"
                    }];

                    sheet.rows.splice(7, 0, { cells: myHeaders, type: "header", height: 30 });

                    var myHeaders = [{
                        value: "",
                        fontSize: 10,
                        fontWeight: 500,
                        textAlign: "left",
                        backgroundUrl: "#fffff"
                    }];

                    sheet.rows.splice(79, 0, { cells: myHeaders, type: "header", height: 50 });

                    sheet.rows.splice(80, 0, {
                        cells: [{value:"MENGETAHUI:", colSpan: 2},{value:"", colSpan: 1},{value:"TELAH DIPERIKSA",colSpan: 2},{value:"", colSpan: 1},{value:"", colSpan: 2}],
                        type: "data",
                        height: 20,
                    });

                    sheet.rows.splice(81, 0, {
                        cells: [{value:"Pimpinan BLUD", colSpan: 2},{value:"", colSpan: 1},{value:"Verifikator",colSpan: 2},{value:"", colSpan: 1},{value:"Bendahara Penerima Pembantu", colSpan: 2}],
                        type: "data",
                        height: 20,
                    });

                    sheet.rows.splice(82, 0, {
                        cells: [{value:"", colSpan: 2},{value:"", colSpan: 1},{value:"",colSpan: 2},{value:"", colSpan: 1},{value:"", colSpan: 2}],
                        type: "data",
                        height: 100,
                    });


                    sheet.rows.splice(83, 0, {
                        cells: [{value:"dr. Akhmad Akhadi S, MPH", colSpan: 2},{value:"", colSpan: 1},{value:"Gamal Iskandar, SKM",colSpan: 2},{value:"", colSpan: 1},{value:"Suri Herlina Pratiwi, S.KM, M.PH", colSpan: 2}],
                        type: "data",
                        height: 20,
                    });

                    sheet.rows.splice(84, 0, {
                        cells: [{value:"NIP. 19680714 200012 1 002", colSpan: 2},{value:"", colSpan: 1},{value:"NIP. 19700404 199303 2005",colSpan: 2},{value:"", colSpan: 1},{value:"NIP. 19860422 201101 2 013", colSpan: 2}],
                        type: "data",
                        height: 20,
                    });
                    
                },
                selectable: true,
                pageable: true,
                columns: [
                    {
                        "field": "kdrekening",
                        "title": "Kode Rekening",
                        "width": "80px"
                    },
                    {
                        
                        "field": "nomer",
                        "title": "No",
                        "width": "30px",
                    },
                    {
                        
                        "field": "uraian",
                        "title": "Uraian Rincian Obyek",
                        "width": "200px",
                    },
                    {
                        
                        "field": "vol",
                        "title": "Vol",
                        "width": "70px",
                    },
                    {
                        "title": "Jumlah (Rp)",
                        "width": "200px",
                        
                        columns: [
                            {
                                "field": 'rpkolom1',
                                "title": " ",
                                "width": "15px",
                            },
                            {
                                "field": 'kolom1',
                                "title": " ",
                                "width": "85px",
                                template: $("#status-template").html(),
                            },
                            {
                                "field": 'rpkolom2',
                                "title": " ",
                                "width": "15px",
                            },
                            {
                                "field": 'kolom2',
                                "title": " ",
                                "width": "85px",
                                template: $("#kolom-template").html(),
                            }
                        ],

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