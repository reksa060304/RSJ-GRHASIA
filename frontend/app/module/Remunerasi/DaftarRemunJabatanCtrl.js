define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DaftarRemunJabatanCtrl', ['$state', '$q', '$scope', 'CacheHelper', 'MedifirstService','$mdDialog',
        function ($state, $q, $scope, cacheHelper, medifirstService,$mdDialog) {

            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.item = {};
            $scope.item.periodeAwal = new Date();
            $scope.item.periodeAkhir = new Date();
            $scope.item.tanggalPulang = new Date();
            $scope.dataPasienSelected = {};
            $scope.cboDokter = false;
            $scope.pasienPulang = false;
            $scope.cboUbahDokter = true;
            $scope.isRouteLoading = false;
            $scope.item.jmlRows = 50
            $scope.jmlRujukanMasuk = 0
            $scope.jmlRujukanKeluar = 0

            var dataSave = []
            var dataPegawaiAll = []
            var data3 = []
            loadCombo();
            // getSisrute()
            // postKunjunganYankes()
            // postRujukanYankes()
            function loadCombo() {
                var chacePeriode = cacheHelper.get('DaftarRemunJabatanCtrl');
                if (chacePeriode != undefined) {
                    //debugger;
                    var arrPeriode = chacePeriode.split('~');
                    $scope.item.periodeAwal = moment(new Date(arrPeriode[0])).format('YYYY-MM-DD 00:00');
                    $scope.item.periodeAkhir = moment(new Date(arrPeriode[1])).format('YYYY-MM-DD 23:59');
                    $scope.item.tglpulang = new Date(arrPeriode[2]);
                } else {
                    $scope.item.periodeAwal = moment($scope.now).format('YYYY-MM-DD 00:00');;
                    $scope.item.periodeAkhir = moment($scope.now).format('YYYY-MM-DD 23:59');;
                    $scope.item.tglpulang = $scope.now;
                }
                medifirstService.get("remunerasi/get-combo", false).then(function (data) {
                    $scope.listDepartemen = data.data.departemen;
                    $scope.listKelompokPasien = data.data.kelompokpasien;
                    $scope.listDokter = data.data.dokter;
                    $scope.listDokter2 = data.data.dokter;
                })
                // $scope.listStatus = manageKasir.getStatus();
            }
            $scope.getIsiComboRuangan = function () {
                $scope.listRuangan = $scope.item.instalasi.ruangan
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY HH:mm');
            }

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

           

            // $scope.Cari()=Function {
            $scope.Cari = function (data) {
                var strinFilter = ''
                var dtgrd = []
                if ($scope.item.namapegawai != '') {
                    for (var i = 0; i < dataPegawaiAll.length; i++) {
                        strinFilter = dataPegawaiAll[i].namalengkap
                        if (strinFilter.toLowerCase().indexOf($scope.item.namapegawai) !== -1) {
                            dtgrd.push(dataPegawaiAll[i])
                        }

                    }
                    $scope.dataHitung2 = new kendo.data.DataSource({
                        data: dtgrd,
                        pageSize: 10,
                        serverPaging: false
                    });
                } else {
                    $scope.dataHitung2 = new kendo.data.DataSource({
                        data: dataPegawaiAll,
                        pageSize: 10,
                        serverPaging: false
                    });
                }

            };
            $scope.dklikGriddataHitung1 = function (dataHitung1Selected) {
                var dataGrid2 = []
                for (var i = 0; i < dataSave.length; i++) {
                    if (dataSave[i].pegawaiid == dataHitung1Selected.pgid) {
                        dataGrid2.push(dataSave[i])
                    }
                }
                $scope.dataHitung1D = new kendo.data.DataSource({
                    data: dataGrid2,
                    pageSize: 10,
                    serverPaging: false
                });
            }
          

            $scope.columnData1 = {
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "Pagu Remunerasi.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:M1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Pagu Remunerasi",
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
                    // {
                    // "title": "<input type='checkbox' class='checkbox' ng-click='selectUnselectAllRow()' />",
                    // template: "# if (statCheckbox) { #" +
                    //     "<input type='checkbox' class='checkbox' ng-click='selectRow(dataItem)' checked />" +
                    //     "# } else { #" +
                    //     "<input type='checkbox' class='checkbox' ng-click='selectRow(dataItem)' />" +
                    //     "# } #",
                    // width: "30px"
                    // },
                     {
                        "field": "no",
                        "title": "No",
                        "width": "30px"
                    },
                    {
                        "field": "tglclosing",
                        "title": "Tgl Closing ",
                        "width": "100px",
                        "template": "<span class='style-left'>{{formatTanggal('#: tglclosing #')}}</span>",
                      
                    },
                    {
                        "field": "noclosing",
                        "title": "No Closing",
                        "width": "100px"
                    },
                    {
                        "field": "tglawal",
                        "title": "Tgl Awal",
                        "width": "100px",
                        "template": "<span class='style-left'>{{formatTanggal('#: tglawal #')}}</span>"
                    },  {
                        "field": "tglakhir",
                        "title": "Tgl Akhir",
                        "width": "100px",
                        "template": "<span class='style-left'>{{formatTanggal('#: tglakhir #')}}</span>"
                    },
                    {
                        "field": "jenispagu",
                        "title": "Jenis Pagu",
                        "width": "150px",
                       
                    },
                     {
                        "field": "detailjenispagu",
                        "title": "Detail Jenis Pagu",
                        "width": "200px",
                         footerTemplate: "Total"
                    },
                    {
                        "field": "jml",
                        "title": "Total",
                        "width": "150px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jml #', '')}}</span>",
                        headerAttributes: { style: "text-align : center" },
                        attributes: { style: "text-align:right;" },
                        aggregates: ["sum"],
                        footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jml.sum #', '')}}</span>",
                        footerAttributes: { style: "text-align: right;" }
                    },
                    
                ]
            };


            $scope.SearchData = function () {
                loadData()
            }
            function loadData() {
                $scope.selectedData =[]
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD 00:00:00');
                var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD 23:59:59');

                var reg = ""
                if ($scope.item.noclosing != undefined) {
                    var reg = "&noclosing=" + $scope.item.noclosing
                }
                var rm = ""
                if ($scope.item.detailjenis != undefined) {
                    var rm = "&detailjenis=" + $scope.item.detailjenis
                }
                var nm = ""
                if ($scope.item.nama != undefined) {
                    var nm = "&nama=" + $scope.item.nama
                }
                var ins = ""
                if ($scope.item.jenispagu != undefined) {
                    var ins = "&jenispagu=" + $scope.item.jenispagu
                }
                var rg = ""
                if ($scope.item.ruangan != undefined) {
                    var rg = "&ruangId=" + $scope.item.ruangan.id
                }
                var kp = ""
                if ($scope.item.kelompokpasien != undefined) {
                    var kp = "&kelId=" + $scope.item.kelompokpasien.id
                }
                var dk = ""
                if ($scope.item.dokter != undefined) {
                    var dk = "&dokId=" + $scope.item.dokter.id
                }

                var jmlRows = "";
                if ($scope.item.jmlRows != undefined) {
                    jmlRows = $scope.item.jmlRows
                }
                $q.all([
                    medifirstService.get("remunerasi/get-remun-detail-jenis-pagu?" +
                        "tglAwal=" + tglAwal +
                        "&tglAkhir=" + tglAkhir +
                        reg + rm + nm + ins + rg + kp + dk
                        + '&jmlRows=' + jmlRows),
                ]).then(function (data) {
                    $scope.isRouteLoading = false;
                    // data1 = data[0].data.data1
                    for (var i = 0; i < data[0].data.data.length; i++) {
                        const el = data[0].data.data[i]
                        el.no = i+1;
                    }
                    // data3 = data[0].data.datapersen
                    $scope.data1 = new kendo.data.DataSource({
                        data: data[0].data.data,
                        pageSize: 10,
                        // group: $scope.group,
                        // total:data1.data,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                    jml: { type: "number" },
                                  
                                }
                            }
                        },
                        aggregate: [
                            { field: 'jml', aggregate: 'sum' },
                           

                        ]
                    });
                    var chacePeriode = tglAwal + "~" + tglAkhir;
                    cacheHelper.set('DaftarRemunJabatanCtrl', chacePeriode);
                });

            };


            $scope.klikGrid1 = function (data1Selected) {
                if (data1Selected != undefined) {
                    // $scope.item.nostrukpagu = data1Selected.nostrukpagu
                }
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
           
           
          
            // END ################

        }
    ]);
});