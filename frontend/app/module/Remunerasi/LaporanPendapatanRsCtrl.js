define(['initialize'], function(initialize) {
  'use strict';
  initialize.controller('LaporanPendapatanRsCtrl', ['CacheHelper','$q', '$rootScope', '$scope','DateHelper','$http','$state', 'MedifirstService',
    function(cacheHelper,$q, $rootScope, $scope,DateHelper,$http,$state, medifirstService) {
    		//Inisial Variable 
        $scope.dataVOloaded = true;
        $scope.now = new Date();
        $scope.dataSelected={};
        $scope.item={};
        $scope.itemPasien={};
        $scope.dataLogin = JSON.parse(window.localStorage.getItem('pegawai'));
        // debugger;
        $scope.date = new Date();
        var tanggals = DateHelper.getDateTimeFormatted3($scope.date);
        
        //Tanggal Default
        $scope.item.tglawal = tanggals+" 00:00";
        $scope.item.tglakhir= tanggals+" 23:59";
        $scope.itemPasien.tglawal = tanggals+" 00:00";
        $scope.itemPasien.tglakhir= tanggals+" 23:59";
       
        // Tanggal Inputan
        $scope.tglawal = $scope.item.tglawal;
        $scope.tglakhir = $scope.item.tglakhir;
        $scope.item.kelompok =[]
        medifirstService.get("remunerasi/get-combo-lap", true).then(function (dat) {

           $scope.listKelompokPasien = dat.data.kelompokpasien;
                    $scope.selectKel = {
                        placeholder: "Kelompok Pasien...",
                        dataTextField: "kelompokpasien",
                        dataValueField: "id",
                        // dataSource:{
                        //     data: $scope.listRuangan
                        // },
                        autoBind: false,
                       
                    };
        });
       
        $scope.isRouteLoading = false;
        $scope.formatTanggal = function(tanggal){
            return moment(tanggal).format('DD-MMM-YYYY HH:mm');
        }
        $scope.formatRupiah = function(value, currency) {
            return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
        }
        $scope.CariRegistrasiPasien = function () {
              $scope.isRouteLoading = true;
              LoadData()
          }

          function LoadData() {  
              var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
              var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');
              var tempRuanganId = "";
              if ($scope.item.ruangan != undefined) {
                  tempRuanganId = "&idRuangan=" + $scope.item.ruangan.id;
              }
              var tempDepartemen = "";
              if ($scope.item.departemen2 != undefined) {
                  tempDepartemen = "&idDept=" + $scope.item.departemen2.id;
              }
              // var tempKelPasienId = "";
              // if ($scope.item.kelompokPasien != undefined) {
              // if ($scope.item.kelompokPasien.kelompokpasien == 'Non BPJS') {
              //   tempKelPasienId = "&kelompokPasien=153"
              // } else {
              //   tempKelPasienId = "&kelompokPasien=" + $scope.item.kelompokPasien.id;
              // }
              // }

              var kelompokPasien = ""
           
              if ($scope.item.kelompok.length != 0) {
                  var a = ""
                  var b = ""
                  for (var i = $scope.item.kelompok.length - 1; i >= 0; i--) {
                
                      var c = $scope.item.kelompok[i].id
                      b = "," + c
                      a = a + b
                  }
                  kelompokPasien = a.slice(1, a.length)
              }
              var chacePeriode = {
                  0: tglAwal,
                  1: tglAkhir
              }
              cacheHelper.set('LaporanLaboratoriumCtrl', chacePeriode);

              medifirstService.get("remunerasi/get-laporan-pagu?"
                  + "tglAwal=" + tglAwal
                  + "&tglAkhir=" + tglAkhir
                  + '&kpId='+kelompokPasien
                  + tempRuanganId
                  + tempDepartemen
                    ).then(function (data) {
                      var datas=data.data;
                      $scope.isRouteLoading = false;
                      for (var i =datas.data1.length - 1; i >= 0; i--) {
                       datas.data1[i].hargakomponen = parseFloat(datas.data1[i].jasapelayanan) - parseFloat(datas.data1[i].jasa)
                        if (datas.data1[i].isparamedis == "1") {
                           datas.data1[i].statusparamedis = "✔"
                        } else {
                           datas.data1[i].statusparamedis = ""
                        }
                    }

                    // for (var i =datas.data2.length - 1; i >= 0; i--) {
                    //     if (datas.data2[i].isparamedis == "1") {
                    //        datas.data2[i].statusparamedis = "✔"
                    //     } else {
                    //        datas.data2[i].statusparamedis = ""
                    //     }
                    // }
                    $scope.dataLaporanLabHarian = new kendo.data.DataSource({
                        data: datas.data1,
                        pageSize: 10,
                        // group: $scope.group,
                        // total:data1.data,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                    total: { type: "number" },
                                    // jasa: { type: "number" },
                                    // hargakomponen: { type: "number" },
                                    // hargasatuan: { type: "number" },
                                    
                                }
                            }
                        },
                        aggregate: [
                            { field: 'total', aggregate: 'sum' },
                            // { field: 'jasa', aggregate: 'sum' },
                            // { field: 'hargakomponen', aggregate: 'sum' },
                            // { field: 'hargasatuan', aggregate: 'sum' }
                            

                        ]
                    });
                    

                  })
          }
       
        $scope.columnLaporanLabHarian = {
                toolbar: [
                    "excel",
                    
                    ],
                    excel: {
                        fileName: "LaporanPendapatanNonBpjs.xlsx",
                        allPages: true,
                    },
                    excelExport: function(e){
                        var sheet = e.workbook.sheets[0];
                        sheet.frozenRows = 2;
                        sheet.mergedCells = ["A1:F1"];
                        sheet.name = "Non BPJS";

                        var myHeaders = [{
                            value:"Laporan Pendapatan Non BPJS",
                            fontSize: 20,
                            textAlign: "center",
                            background:"#ffffff",
                         // color:"#ffffff"
                     }];

                     sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70});
                 },
                selectable: 'row',
                pageable: true,
                columns:
                [
                // {
                //     "field": "no",
                //     "title": "No",
                //     "width": "30px",
                //     "attributes": {style: "text-align: right;"},
                // },
                {
                    "field": "noregistrasi",
                    "title": "NoReg",
                    "width":"80px"
                },
                {
                    "field": "nocm",
                    "title": "NoRM",
                    "width":"60px",
                    "template": "<span class='style-center'>#: nocm #</span>"
                },
                {
                    "field": "namapasien",
                    "title": "Nama Pasien",
                    "width":"120px",
                    "template": "<span class='style-left'>#: namapasien #</span>"
                },
                {
                    "field": "kelompokpasien",
                    "title": "Jenis",
                    "width":"60px",
                    "template": "<span class='style-left'>#: kelompokpasien #</span>"
                },
                {
                    "field": "total",
                    "title": "Total",
                    "width":"100px",
                    "template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>",
                    "attributes": {style: "text-align: right;"},
                    "aggregates": ["sum"],
                    "footerTemplate":'#=data.total? kendo.toString(data.total.sum,"n") :0 #',
                    "footerAttributes": {style: "text-align: right;"},
                    groupFooterTemplate : "#=kendo.toString(sum,'n')#"
                }
               
                
            ]
        };



        $scope.ClearSearch = function () {
              // $scope.item = {};
              // $scope.item.tglawal = $scope.now;
              // $scope.item.tglakhir = $scope.now;
              delete $scope.item.departemen2
              delete $scope.item.ruangan
              delete $scope.item.kelompokPasien
              // $scope.CariRegistrasiPasien();
        }

        $scope.CariRegistrasiPasien2 = function () {
              $scope.isRouteLoading = true;
              LoadDataJmlPasien()
          }

          function LoadDataJmlPasien() {  
              var tglAwal = moment($scope.itemPasien.tglawal).format('YYYY-MM-DD HH:mm');
              var tglAkhir = moment($scope.itemPasien.tglakhir).format('YYYY-MM-DD HH:mm');
              var tempRuanganId = "";
              if ($scope.itemPasien.ruangan != undefined) {
                  tempRuanganId = "&idRuangan=" + $scope.itemPasien.ruangan.id;
              }
              var tempDepartemen = "";
              if ($scope.itemPasien.departemen2 != undefined) {
                  tempDepartemen = "&idDept=" + $scope.itemPasien.departemen2.id;
              }
              var tempKelPasienId = "";
              if ($scope.itemPasien.kelompokPasien != undefined) {
              if ($scope.itemPasien.kelompokPasien.kelompokpasien == 'Non BPJS') {
                tempKelPasienId = "&kelompokPasien=153"
              } else {
                tempKelPasienId = "&kelompokPasien=" + $scope.itemPasien.kelompokPasien.id;
              }
              }
              var chacePeriode = {
                  0: tglAwal,
                  1: tglAkhir
              }
              cacheHelper.set('LaporanLaboratoriumCtrl', chacePeriode);

              medifirstService.get("laporan/get-laporan-pendapatan-rs-iurbpjs?"
                  + "tglAwal=" + tglAwal
                  + "&tglAkhir=" + tglAkhir
                  + tempRuanganId
                  + tempDepartemen
                  + tempKelPasienId).then(function (data) {
                      var datas=data.data;
                      $scope.isRouteLoading = false;

                      // for (var i = 0; i < datas.length; i++) {
                      //   datas[i].no = i + 1;
                      //   if (datas[i].ruanganasal ==null){
                      //     datas[i].ruanganasal = datas[i].namaruangan;
                      //     datas[i].deptasal = datas[i].namadepartemen;
                      //   }
                      // }
                      $scope.dataJumlahPasienLab = new kendo.data.DataSource({
                          data: datas,
                          pageSize: 50,
                          total: datas.length,
                          serverPaging: false,
                          schema: {
                              model: {
                                  fields: {
                                    totalharusdibayar: { type: "number" },
                                  }
                              }
                          },
                          aggregate: [
                              { field: 'totalharusdibayar', aggregate: "sum" },
                          ]
                      });
                    

                  })
          }
       
        $scope.columnJumlahPasienLab = {
                toolbar: [
                    "excel",
                    
                    ],
                    excel: {
                        fileName: "LaporanPendapatanIurBpjs.xlsx",
                        allPages: true,
                    },
                    excelExport: function(e){
                        var sheet = e.workbook.sheets[0];
                        sheet.frozenRows = 2;
                        sheet.mergedCells = ["A1:M1"];
                        sheet.name = "Orders";

                        var myHeaders = [{
                            value:"Laporan Laboratorium Harian",
                            fontSize: 20,
                            textAlign: "center",
                            background:"#ffffff",
                         // color:"#ffffff"
                     }];

                     sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70});
                 },
                selectable: 'row',
                pageable: true,
                columns:
                [
                  // {
                  //     "field": "no",
                  //     "title": "No",
                  //     "width": "30px",
                  //     "attributes": {style: "text-align: right;"},
                  // },
                  {
                      "field": "noregistrasi",
                      "title": "NoReg",
                      "width":"80px"
                  },
                  {
                      "field": "nocm",
                      "title": "NoRM",
                      "width":"60px",
                      "template": "<span class='style-center'>#: nocm #</span>"
                  },
                  {
                      "field": "namapasien",
                      "title": "Nama Pasien",
                      "width":"120px",
                      "template": "<span class='style-left'>#: namapasien #</span>"
                  },
                  {
                      "field": "kelompokpasien",
                      "title": "Jenis",
                      "width":"60px",
                      "template": "<span class='style-left'>#: kelompokpasien #</span>"
                  },
                  {
                      "field": "totalharusdibayar",
                      "title": "Total",
                      "width":"100px",
                      "template": "<span class='style-right'>{{formatRupiah('#: totalharusdibayar #', '')}}</span>",
                      "attributes": {style: "text-align: right;"},
                      "aggregates": ["sum"],
                      "footerTemplate":'#=data.totalharusdibayar? kendo.toString(data.totalharusdibayar.sum,"n") :0 #',
                      "footerAttributes": {style: "text-align: right;"},
                      groupFooterTemplate : "#=kendo.toString(sum,'n')#"
                  }
                
                ]
        };

        $scope.ClearSearch2 = function () {
              // $scope.item = {};
              // $scope.item.tglawal = $scope.now;
              // $scope.item.tglakhir = $scope.now;
              delete $scope.itemPasien.departemen2
              delete $scope.itemPasien.ruangan
              delete $scope.itemPasien.kelompokPasien
              // $scope.CariRegistrasiPasien();
        }
        // $scope.klikGrid = function(data){
        //   var obj = {
        //       noRegistrasi : data.noregistrasi
        //   }
        //   var url = $state.href('RekapTagihanPasien', {dataPasien: JSON.stringify(obj)});
        //   window.open(url,'_blank');
        // }
               
        }
    ]);
});