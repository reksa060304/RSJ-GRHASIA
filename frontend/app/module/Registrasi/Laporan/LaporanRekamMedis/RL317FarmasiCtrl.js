define(['initialize'], function (initialize) {
  'use strict';
  initialize.controller('RL317FarmasiCtrl', ['CacheHelper', '$q', '$rootScope', '$scope', 'MedifirstService', 'DateHelper',
    function (cacheHelper, $q, $rootScope, $scope, medifirstService, DateHelper) {
      //Inisial Variable 
      $scope.isRouteLoading = false;
      $scope.dataVOloaded = true;
      $scope.now = new Date();
      $scope.dataPasienSelected = {};
      $scope.item = {};
      
      $scope.dataLogin = JSON.parse(window.localStorage.getItem('pegawai'));

      $scope.CariRegistrasiPasien = function () {
        $scope.isRouteLoading = true;
        LoadData();
      }

      function LoadData() {
        $scope.isRouteLoading = true;

        medifirstService.get("registrasi/laporan/get-laporan-rl317-v3?").then(function (data) {
          $scope.isRouteLoading = false;
          var data = data.data;
          
          for (var i = 0; i < data.data.length; i++) {
            data.data[i].no = i + 1;
          }

          $scope.ambildataexcel = data.data;
          $scope.panggil($scope.ambildataexcel);
          
          $scope.dataRL52 = new kendo.data.DataSource({
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

      $scope.panggil = function (cokot) {
        $("#kGrid").kendoGrid({
          toolbar: ["excel"],
          excel: {
            fileName: "RL3.17 Pengadaan Obat " + moment($scope.item.tglawal).format('DD/MMM/YYYY') + " - " + moment($scope.item.tglakhir).format('DD/MMM/YYYY') + ".xlsx",
            filterable: true,
            allPages: true
          },
          dataSource: $scope.ambildataexcel,
          pageable: true,
          resizable: true,
          sortable: true,
          columns: [
            {
              title: "A.Pengadaan Obat",
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
                  field: "jumlah",
                  title: "Jumlah Item Obat"
                },
                {
                  field: "jumlahtersedia",
                  title: "Jumlah Item Obat Yang Tersedia Di Rumah Sakit"
                }
              ]
            }
          ]
        });
      }
      $scope.panggil();

      $scope.formatTanggal = function (tanggal) {
        return moment(tanggal).format('DD-MMM-YYYY HH:mm');
      }
      
      $scope.formatRupiah = function (value, currency) {
        return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
      }

      $scope.columnRL52 = [
        {
          title: "A.Pengadaan Obat",
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
              field: "jumlah",
              title: "Jumlah Item Obat"
            },
            {
              field: "jumlahtersedia",
              title: "Jumlah Item Obat Yang Tersedia Di Rumah Sakit"
            }
          ]
        }
      ];

      $scope.Perbaharui = function () {
        $scope.ClearSearch();
      }

      //fungsi clear kriteria search
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

      // Tanggal Inputan
      $scope.tglawal = $scope.item.tglawal;
      $scope.tglakhir = $scope.item.tglakhir;
      
      $scope.pegawai = medifirstService.getPegawai();
    }
  ]);
});