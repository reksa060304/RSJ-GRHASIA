define(['initialize'], function (initialize) {
  'use strict';
  initialize.controller('RL318FarmasiCtrl', ['CacheHelper', '$q', '$rootScope', '$scope', 'MedifirstService', 'DateHelper',
    function (cacheHelper, $q, $rootScope, $scope, medifirstService, DateHelper) {
      //Inisial Variable 
      $scope.isRouteLoading = false;
      $scope.dataVOloaded = true;
      $scope.now = new Date();
      $scope.dataSelected = {};
      $scope.item = {};
      
      $scope.dataLogin = JSON.parse(window.localStorage.getItem('pegawai'));

      $scope.CariData = function () {
        $scope.isRouteLoading = true;
        LoadData();
      }

      function LoadData() {
        var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
        var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');
        
        var chacePeriode = {
          0: tglAwal,
          1: tglAkhir,
        }
        cacheHelper.set('LaporanRl318Ctrl', chacePeriode);

        medifirstService.get("registrasi/laporan/get-laporan-rl318-v3?"
          + "tglAwal=" + tglAwal
          + "&tglAkhir=" + tglAkhir).then(function (data) {
            var data = data.data;
            $scope.isRouteLoading = false;
            
            for (var i = 0; i < data.data.length; i++) {
              data.data[i].no = i + 1;
            }

            $scope.getdataexcel = data.data;
            $scope.callExcel($scope.getdataexcel);
            
            $scope.dataRL318 = new kendo.data.DataSource({
              data: data.data,
              pageSize: 10,
              total: data.length,
              serverPaging: false,
              schema: {
                model: {
                  fields: {}
                }
              }
            });
          })
      }

      $scope.callExcel = function (ambil) {
        $("#kGrid").kendoGrid({
          toolbar: ["excel"],
          excel: {
            fileName: "RL3.18 Pelayanan Resep " + moment($scope.item.tglawal).format('DD/MMM/YYYY') + " - " + moment($scope.item.tglakhir).format('DD/MMM/YYYY') + ".xlsx",
            filterable: true,
            allPages: true
          },
          dataSource: $scope.getdataexcel,
          sortable: true,
          pageable: true,
          resizable: true,
          columns: [
            {
              title: "B.Penulisan dan Pelayanan Resep",
              Template: "<span class='style-left'>#: no #</span>",
              columns: [
                {
                  field: "no",
                  title: "No",
                  Template: "<span class='style-center'>#: no #</span>",
                  width: "50px"
                },
                {
                  field: "detailobat",
                  title: "Golongan Obat"
                },
                {
                  field: "Jmlrj",
                  title: "Rawat Jalan"
                },
                {
                  field: "JmlIGD",
                  title: "IGD"
                },
                {
                  field: "JmlRawatInap",
                  title: "Rawat Inap"
                }
              ]
            }
          ]
        });
      }
      $scope.callExcel();

      $scope.columnRL318 = [
        {
          title: "B.Penulisan dan Pelayanan Resep",
          Template: "<span class='style-left'>#: no #</span>",
          columns: [
            {
              field: "no",
              title: "No",
              Template: "<span class='style-center'>#: no #</span>",
              width: "50px"
            },
            {
              field: "detailobat",
              title: "Golongan Obat"
            },
            {
              field: "Jmlrj",
              title: "Rawat Jalan"
            },
            {
              field: "JmlIGD",
              title: "IGD"
            },
            {
              field: "JmlRawatInap",
              title: "Rawat Inap"
            }
          ]
        }
      ];

      $scope.ClearSearch = function () {
        $scope.item = {};
        var tanggals = DateHelper.getDateTimeFormatted3($scope.date);
        $scope.item.tglawal = tanggals + " 00:00";
        $scope.item.tglakhir = tanggals + " 23:59";
      }

      $scope.date = new Date();
      var tanggals = DateHelper.getDateTimeFormatted3($scope.date);

      //Tanggal Default
      $scope.item.tglawal = tanggals + " 00:00";
      $scope.item.tglakhir = tanggals + " 23:59";

      $scope.pegawai = medifirstService.getPegawai();
    }
  ]);
});