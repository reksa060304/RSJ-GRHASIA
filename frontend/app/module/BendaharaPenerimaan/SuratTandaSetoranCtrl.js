define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict';
    var baseTransaksi = configuration.baseApiBackend;
    initialize.controller('SuratTandaSetoranCtrl', ['$scope', 'DateHelper', '$http', '$state', 'MedifirstService',
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

                var noclosing="";
                if ($scope.item.Noclosing != undefined) {
					noclosing = "&noclosing=" + $scope.item.Noclosing;
                }

                var nosts="";
                if ($scope.item.Nosts != undefined) {
					nosts = "&nosts=" + $scope.item.Nosts;
                }

                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                // var tgl = moment($scope.tanggal).format('DD/MM/YYYY');
                medifirstService.get("bendaharapenerimaan/get-sts?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir+
                    "&status=" + status +
                    "&idCaraBayar=" + ScaraBayar + noclosing + nosts
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
                $scope.selectedData2 = [];
                $scope.dataSelected = {};
                $scope.selected = [];
                $scope.item.totalSetor = "";
                $scope.item.dipilih = "";
                $scope.item.terbilang = "";
                if ($scope.grid && $scope.grid.clearSelection) {
                    $scope.grid.clearSelection(); 
                }
                $scope.selectedData2 = [];
                $scope.dataSelected = {};
                $scope.selected = [];
                $scope.item.totalSetor = "";
                $scope.item.dipilih = "";
                $scope.item.terbilang = "";
                if ($scope.grid && $scope.grid.clearSelection) {
                    $scope.grid.clearSelection(); // FIXED: reset highlight di grid
                }
                init();
            }

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MM-YYYY');
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
                    // console.log($scope.selectedData2);
                    $scope.item.totalSetor = tol;
				} else{
                    $scope.item.totalSetor = tol;
                }

                medifirstService.get("sysadmin/general/get-terbilang/" + tol).then(
					function (dat) {
						$scope.item.terbilang = dat.data.terbilang;
					}
                );

                // if ($scope.selectedData2.length == 1) {
                //     if ($scope.selectedData2[0].nosts !== null) {
                //         
				// 	}
                // }

                $scope.item.dipilih = $scope.selectedData2.length;
				
			}

            
            //console.log($scope.selectedData2);

            

            // console.log(objSave.setoran.length);

            $scope.detailpenerimaan = function () {

                if($scope.selectedData2.length > 1){
                    toastr.error('Pilih Salah 1 Data');
                } else{
                    var noclosing = $scope.selectedData2[0].nopenerimaan;
                    medifirstService.get("bendaharapenerimaan/get-sts-popup?" +
                        "noclosing=" + noclosing
                        , true).then(function (dat) {
                            $scope.isRouteLoading = false;
                            for (var i = 0; i < dat.data.detail.length; i++) {
                                dat.data.detail[i].no = i + 1;
                            }
                            
                            $scope.dataPenerimaan = new kendo.data.DataSource({
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

                    $scope.popUpDaftarPenerimaan.center().open();
                    var actions = $scope.popUpDaftarPenerimaan.options.actions;
                    actions.splice(actions.indexOf("Close"), 1);
                    $scope.popUpDaftarPenerimaan.setOptions({ actions: actions });
                }
            }

            $scope.cetakpdf = function(){
                // console.log($scope.selectedData2)
                window.open(baseTransaksi + "report/get-cetak-sts-pdf?nosts="+$scope.selectedData2[0].nosts, '_blank');
            }

            $scope.tutupPhoto = function () {
                $scope.popUpDaftarPenerimaan.close()
            }

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

            $scope.simpan = function () {

                var objSave =
                {
                    setoran: $scope.selectedData2,
                }

                $scope.isRouteLoading = true;

                $scope.selectedData2[0].terbilang =  $scope.item.terbilang;
                $scope.selectedData2[0].tanggalSTS =  moment($scope.item.tanggalSTS).format('YYYY-MM-DD HH:mm:ss');
                var cektunai = 789;
                var cektransfer = 456;
                var ceksudahsts = 1213;
				for (let i = 0; i < $scope.selectedData2.length; i++) {
					if($scope.selectedData2[i].carabayar == 'TUNAI'){
						cektunai = 111;
					}
                    if($scope.selectedData2[i].carabayar == 'TRANSFER BANK'){
						cektransfer = 123;
					}
                    if($scope.selectedData2[i].nosts != null){
						ceksudahsts = 1214;
					}
				}

                if(cektunai == 111 && cektransfer == 123){
                    toastr.error('Cara Bayar Transfer dan Tunai Tercampur');
                }
                else if(ceksudahsts == 1214) {
                    toastr.error('Data sudah ada yang di STS');
                }                
                else{
                    medifirstService.post('bendaharapenerimaan/save-sts', objSave).then(function (dat) {
                        $scope.isRouteLoading = false;
                        for (var i = 0; i < dat.data.data.length; i++) {
                            dat.data.data[i].no = i + 1;
                            if(dat.data.data[i].kolom1 != null){
                                dat.data.data[i].rpkolom1 = 'Rp';
                            }

                            if(dat.data.data[i].kolom2 != null){
                                dat.data.data[i].rpkolom2 = 'Rp';
                            }

                            if(i == dat.data.data.length-1){
                                $scope.item.terbilangsts = dat.data.data[i].terbilang;
                                $scope.item.totalsts = dat.data.data[i].kolom2;
                                $scope.item.nosts = dat.data.data[i].nosts;
                                $scope.item.tglpenerimaansts = dat.data.data[i].tglpenerimaan;
                                $scope.item.carabayarsts = dat.data.data[i].carabayarfk;
                                $scope.item.namasts = dat.data.data[i].namapasien;
                            }
                        }
                        
                        $scope.dataSTS = new kendo.data.DataSource({
                            data: dat.data.data,
                            group: $scope.group,
                            pageSize: 100,
                            total: dat.data.data.length,
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



            $scope.detail = function () {
                var nostsdetail = $scope.selectedData2[0].nosts;
                    if($scope.selectedData2.length > 1){
                        toastr.error('Pilih 1 Data STS Saja');
                    }
                    else
                    {
						medifirstService.get("bendaharapenerimaan/detail-sts?" + "nostsdetail=" + nostsdetail).then(
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
                                        $scope.item.carabayarsts = dat.data.detail[i].carabayarfk;
                                        if(dat.data.detail[i].namapasien != null && dat.data.detail[i].namapasien_klien == null){
                                            $scope.item.namasts = dat.data.detail[i].namapasien;
                                        }
                                        if(dat.data.detail[i].namapasien_klien != null && dat.data.detail[i].namapasien == null){
                                            $scope.item.namasts = dat.data.detail[i].namapasien_klien;
                                        }
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
                var objSave =
                {
                    setoran: $scope.selectedData2
                }

                medifirstService.post('sysadmin/logging/save-log-batal-sts', objSave).then(function (data) {
                  init()
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
                        
                        "field": "nopenerimaan",
                        "title": "No Penerimaan",
                        "width": "100px",
                    },
                    {
                        
                        "field": "tglpenerimaan",
                        "title": "Tanggal Penerimaan",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatTanggal('#: tglpenerimaan #', '')}}</span>",
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
                    },
                    {
                        
                        "field": "carabayar",
                        "title": "Cara Bayar",
                        "width": "100px",
                    }
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
                    // sheet.rows[0].cells[5]["borderTop"] = { color: "#000000", size: 1 }; 
                    
                    // sheet.rows[0].cells[5][0].background = '#ffffff'; 
                    // sheet.rows[0].cells[5][0].color = '#000000'; 
                    // sheet.rows[0].cells[5][1].background = '#ffffff'; 
                    // sheet.rows[0].cells[5][1].color = '#000000'; 
                    // sheet.rows[0].cells[5][2].background = '#ffffff'; 
                    // sheet.rows[0].cells[5][2].color = '#000000'; 
                    // sheet.rows[0].cells[5][3].background = '#ffffff'; 
                    // sheet.rows[0].cells[5][3].color = '#000000'; 

                    for (var i = 0; i < e.workbook.sheets[0].rows.length; i++) {
                        var $row = e.workbook.sheets[0].rows[i];
                        for (var j = 0; j < $row.cells.length; j++) {
                            var $cell = $row.cells[j];
                            $cell["borderTop"] = { color: "#000000", size: 1 };
                            $cell["borderRight"] = { color: "#000000", size: 1 };
                            $cell["borderBottom"] = { color: "#000000", size: 1 };
                            $cell["borderLeft"] = { color: "#000000", size: 1 };
                        }
                        // console.log(e.workbook.sheets[0].rows.length);
                        // console.log(e.workbook.sheets[0].rows[i].cells.length);
                    }

                    

                    // for (var i = 0; i < e.workbook.sheets[0].rows.length; i++) {
                    //     var $row = e.workbook.sheets[0].rows[i];
                    //         var $cell = $row.cells[3];
                    //         $cell["borderTop"] = { color: "#ffffff", size: 1 };
                    //         $cell["borderRight"] = { color: "#ffffff", size: 1 };
                    //         $cell["borderBottom"] = { color: "#ffffff", size: 1 };
                    //         $cell["borderLeft"] = { color: "#ffffff", size: 1 };
                    // }

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

                    // var sheetbor = spreadsheet.activeSheet();
                    // sheetbor.range("A10:H70").border = "black";

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

                    if(carabayar == 1){
                        var myHeaders = [{
                            value: "Yaitu: Pendapatan Usaha BLUD Penerimaan Tanggal " + tglpenerimaan,
                            fontSize: 11,
                            fontWeight: 500,
                            textAlign: "left",
                            backgroundUrl: "#fffff"
                        }];

                        sheet.rows.splice(5, 0, { cells: myHeaders, type: "header", height: 25, width: 10 });
                    } else{
                        var myHeaders = [{
                            value: "Yaitu: Pendapatan Usaha BLUD TF an " + nama,
                            fontSize: 11,
                            fontWeight: 500,
                            textAlign: "left",
                            backgroundUrl: "#fffff"
                        }];

                        sheet.rows.splice(5, 0, { cells: myHeaders, type: "header", height: 25, width: 10 });
                    }

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

                    sheet.rows.splice(71, 0, { cells: myHeaders, type: "header", height: 50 });

                    sheet.rows.splice(75, 0, {
                        cells: [{value:"MENGETAHUI:", colSpan: 2},{value:"", colSpan: 1},{value:"TELAH DIPERIKSA",colSpan: 2},{value:"", colSpan: 1},{value:"", colSpan: 2}],
                        type: "data",
                        height: 20,
                    });

                    sheet.rows.splice(76, 0, {
                        cells: [{value:"Pimpinan BLUD", colSpan: 2},{value:"", colSpan: 1},{value:"Verifikator",colSpan: 2},{value:"", colSpan: 1},{value:"Bendahara Penerima Pembantu", colSpan: 2}],
                        type: "data",
                        height: 20,
                    });

                    sheet.rows.splice(77, 0, {
                        cells: [{value:"", colSpan: 2},{value:"", colSpan: 1},{value:"",colSpan: 2},{value:"", colSpan: 1},{value:"", colSpan: 2}],
                        type: "data",
                        height: 100,
                    });


                    sheet.rows.splice(78, 0, {
                        cells: [{value:"dr. Akhmad Akhadi S, MPH", colSpan: 2},{value:"", colSpan: 1},{value:"Reny Astuti, SE",colSpan: 2},{value:"", colSpan: 1},{value:"Suri Herlina Pratiwi, S.KM, M.PH", colSpan: 2}],
                        type: "data",
                        height: 20,
                    });

                    sheet.rows.splice(79, 0, {
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

            $scope.cetakpdfV2 = function(){
                // console.log($scope.selectedData2)
                window.open(baseTransaksi + "report/cetak-stsv2?nosts="+$scope.selectedData2[0].nosts, '_blank');
            }

            $scope.popupSimpan = function(){
                
                // validasi
                if($scope.selectedData2.length < 1){
                    toastr.error('Pilih Data Dulu')
                    return
                }

                if($scope.selectedData2[0].nosts !== null){
                    toastr.error('Data sudah di STS')
                    return
                }

                $scope.isRouteLoading = true;

                $scope.detailSTSV2 = []
                $scope.listRekeningSTS = []

                medifirstService.get('bendaharapenerimaan/get-konfirmasi-rekening-sts' 
                    + '?noclosing=' + $scope.selectedData2[0].nopenerimaan)
                    .then(function(response) {
                        $scope.isRouteLoading = false;

                        $scope.listRekeningSTS = response.data.rekening

                        response.data.data.map(item => $scope.detailSTSV2.push(item))

                        $scope.totaldibayar = 0;

                        response.data.data.map(item => $scope.totaldibayar += parseFloat(item.totaldibayarclosing))


                        // jika ada dua rekening berbeda maka akan menyimpan dua sts
                        $scope.dataSTS = []
                        
                        $scope.listRekeningSTS.map((rek) => {
                            
                            let totalSetoran = 0;
                            let uraianSTS = '';
                            let detailSTS = []

                            $scope.detailSTSV2.map((detail) => {
                                if(rek.id == detail.idlevel6){
                                    totalSetoran += parseFloat(detail.totaldibayarclosing)
                                    detailSTS.push(detail)
                                }

                                if(detail.namapasien !== null){
                                    uraianSTS = 'TF an ' + detail.namapasien
                                }

                                if(detail.namapasien == null){
                                    uraianSTS = 'Penerimaan Tanggal ' + moment(new Date).format('DD-MM-YYYY')
                                }
                            })

                            let obj = {
                                tanggalSTS: moment($scope.item.tanggalSTS).format('YYYY-MM-DD HH:mm:ss'),
                                uraian: uraianSTS,
                                totalSetoran: totalSetoran,
                                // idrekening: rek.id,
                                // rekening: rek.koderekening + ' - ' + rek.namarekening,
                                rekening: rek, 
                                detailSTS: detailSTS
                            }

                            $scope.dataSTS.push(obj)
                        })

                        $scope.popupSimpanSTS.center().open()
                    })
            }

            // batal popup
            $scope.batalSTS = function(){

                $scope.listRekeningSTS = []
                $scope.detailSTSV2 = []
                $scope.dataSTS = []

                $scope.popupSimpanSTS.close()
            }

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }


            $scope.simpanV2 = function() {

                let valid = false;

                // validasi
                $scope.dataSTS.map((item) => {
                    
                    if(item.rekening == null){
                        toastr.error('Pilih Rekening Dulu')
                        valid = false
                        return
                    }else if(item.uraian == null || item.uraian == ''){
                        toastr.error('Masukkan uraian dulu')
                        valid = false
                        return
                    }else if(item.totalSetoran == null){
                        toastr.error('Masukkan total setoran dulu')
                        valid = false
                        return
                    }else{
                        valid = true
                    }

                })

                if(valid == true){
                    // data yang dikirim
                    $scope.dataSTS.map((item) => {
                        item.terbilang = terbilang(item.totalSetoran)
                        item.scfk = $scope.selectedData2[0].scfk
                        item.sckfk =  $scope.selectedData2[0].sckfk

                        return item
                    })

                    let objSimpanSTSV2 = {
                        sts: $scope.dataSTS
                    }
                    
                    $scope.isRouteLoading = true;
                    var cektunai = 789;
                    var cektransfer = 456;
                    var ceksudahsts = 1213;
                    for (let i = 0; i < $scope.selectedData2.length; i++) {
                        if($scope.selectedData2[i].carabayar == 'TUNAI'){
                            cektunai = 111;
                        }
                        if($scope.selectedData2[i].carabayar == 'TRANSFER BANK'){
                            cektransfer = 123;
                        }
                        if($scope.selectedData2[i].nosts != null){
                            ceksudahsts = 1214;
                        }
                    }

                    if(cektunai == 111 && cektransfer == 123){
                        toastr.error('Cara Bayar Transfer dan Tunai Tercampur');
                        return
                    }
                    else if(ceksudahsts == 1214) {
                        toastr.error('Data sudah ada yang di STS');
                        return
                    }                
                    else{
                        medifirstService.post('bendaharapenerimaan/simpan-stsv2', objSimpanSTSV2).then(function (dat) {
                            $scope.isRouteLoading = false;

                            // refresh
                            init();
                            $scope.selectedData2 = []
                            $scope.popupSimpanSTS.close()
                                                           
                        });
                    }
                }

            }

            function terbilang(nilai) {
                // deklarasi variabel nilai sebagai angka matemarika
                // Objek Math bertujuan agar kita bisa melakukan tugas matemarika dengan javascript
                nilai = Math.floor(Math.abs(nilai));
                
                // deklarasi nama angka dalam bahasa indonesia
                var huruf = [
                  '',
                  'satu',
                  'dua',
                  'tiga',
                  'empat',
                  'lima',
                  'enam',
                  'tujuh',
                  'delapan',
                  'sembilan',
                  'sepuluh',
                  'sebelas',
                ];
                
                // menyimpan nilai default untuk pembagian
                var bagi = 0;
                // deklarasi variabel penyimpanan untuk menyimpan proses rumus terbilang
                var penyimpanan = '';
                
                // rumus terbilang
                if (nilai < 12) {
                  penyimpanan = ' ' + huruf[nilai];
                } else if (nilai < 20) {
                  penyimpanan = terbilang(Math.floor(nilai - 10)) + ' selas';
                } else if (nilai < 100) {
                  bagi = Math.floor(nilai / 10);
                  penyimpanan = terbilang(bagi) + ' puluh' + terbilang(nilai % 10);
                } else if (nilai < 200) {
                  penyimpanan = ' seratus' + terbilang(nilai - 100);
                } else if (nilai < 1000) {
                  bagi = Math.floor(nilai / 100);
                  penyimpanan = terbilang(bagi) + ' ratus' + terbilang(nilai % 100);
                } else if (nilai < 2000) {
                  penyimpanan = ' seribu' + terbilang(nilai - 1000);
                } else if (nilai < 1000000) {
                  bagi = Math.floor(nilai / 1000);
                  penyimpanan = terbilang(bagi) + ' ribu' + terbilang(nilai % 1000);
                } else if (nilai < 1000000000) {
                  bagi = Math.floor(nilai / 1000000);
                  penyimpanan = terbilang(bagi) + ' juta' + terbilang(nilai % 1000000);
                } else if (nilai < 1000000000000) {
                  bagi = Math.floor(nilai / 1000000000);
                  penyimpanan = terbilang(bagi) + ' miliar' + terbilang(nilai % 1000000000);
                } else if (nilai < 1000000000000000) {
                  bagi = Math.floor(nilai / 1000000000000);
                  penyimpanan = terbilang(nilai / 1000000000000) + ' triliun' + terbilang(nilai % 1000000000000);
                }
               
                // mengambalikan nilai yang ada dalam variabel penyimpanan
                return penyimpanan;
            }

            //////////////////////////////////////////////////////////////          END             /////////////////////////////////////////////////////////////////////////////////////       
        }
    ]);
});