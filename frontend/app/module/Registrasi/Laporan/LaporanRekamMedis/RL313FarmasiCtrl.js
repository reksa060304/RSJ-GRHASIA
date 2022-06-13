define(['initialize'], function (initialize) {
  'use strict';
  initialize.controller('RL313FarmasiCtrl', ['CacheHelper', '$q', '$rootScope', '$scope', 'MedifirstService', 'DateHelper',
    function (cacheHelper, $q, $rootScope, $scope, medifirstService, DateHelper) {
      //Inisial Variable 
      $scope.isRouteLoading = false;
      $scope.dataVOloaded = true;
      $scope.now = new Date();
      $scope.dataSelected = {};
      $scope.dataSelected1 = {};
      $scope.item = {};
      //LoadData()
      $scope.dataLogin = JSON.parse(window.localStorage.getItem('pegawai'));

      $scope.CariRegistrasiPasien = function () {
        // $scope.isRouteLoading = true;
        LoadData()
      }

      $scope.CariRegistrasiPasien1 = function () {
        $scope.isRouteLoading = true;
        LoadDatas()
      }

      function LoadData() {
        $scope.isRouteLoading = true;
        // var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
        // var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');

        // var chacePeriode = {
        //     0: tglAwal,
        //     1: tglAkhir,
        // }
        // cacheHelper.set('LaporanRl3_13Ctrl', chacePeriode);

        medifirstService.get("registrasi/laporan/get-laporan-rl313?"
          // + "tglAwal=" + tglAwal
          // + "&tglAkhir=" + tglAkhir
        ).then(function (data) {
          $scope.isRouteLoading = false;
          var data = data.data
          var totaljumlahrajalfix = 0
          var totaljumlahigdfix = 0
          var totaljumlahranapfix = 0
          for (var i = 0; i < data.data.length; i++) {
            data.data[i].no = i + 1
            data.data[i].kdprov = '24'
            data.data[i].kabkota = 'Kab. Sleman'
            data.data[i].koders = '3404022'
            data.data[i].namars = 'RSJ. Grhasia'
            data.data[i].tahun = moment($scope.now).format('YYYY');

            totaljumlahrajalfix += parseInt(data.data[i].jumlahitem)
            totaljumlahigdfix += parseInt(data.data[i].jumlahtersedia)
            totaljumlahranapfix += parseInt(data.data[i].jumlahtersediafor)
          }
          data.data[0].kategori = 'Obat Generik (Formularium+Non Formularium)'
          data.data[1].kategori = 'Obat Non Generik Formularium'
          data.data[2].kategori = 'Obat Non Generik Non Formularium'
          data.data[3].kategori = 'TOTAL'
          data.data[3].no = 99

          data.data[3].jumlahitem = totaljumlahrajalfix
          data.data[3].jumlahtersedia = totaljumlahigdfix
          data.data[3].jumlahtersediafor = totaljumlahranapfix

          $scope.ambildataexcel = data.data;
          $scope.panggil($scope.ambildataexcel);
          $scope.dataRL52 = new kendo.data.DataSource({
            data: data.data,
            pageSize: 10,
            total: data.length,
            serverPaging: false,
            schema: {
              model: {
                fields: {
                }
              }
            }
          });

        })

      }

      function LoadDatas() {
        var tglAwal1 = moment($scope.item.tglawal1).format('YYYY-MM-DD HH:mm');
        var tglAkhir1 = moment($scope.item.tglakhir1).format('YYYY-MM-DD HH:mm');
        var chacePeriode = {
          0: tglAwal1,
          1: tglAkhir1,
        }
        cacheHelper.set('LaporanRl3_13Ctrl', chacePeriode);

        medifirstService.get("registrasi/laporan/get-laporan-rl313-2?"
          + "tglAwal=" + tglAwal1
          + "&tglAkhir=" + tglAkhir1).then(function (data) {
            var data = data.data
            var totaljumlahrajal = 0
            var totaljumlahigd = 0
            var totaljumlahranap = 0
            $scope.isRouteLoading = false;
            for (var i = 0; i < data.data.length; i++) {
              data.data[i].no = i + 1
              data.data[i].kdprov = '24'
              data.data[i].kabkota = 'Kab. Sleman'
              data.data[i].koders = '3404022'
              data.data[i].namars = 'RSJ. Grhasia'
              data.data[i].tahun = moment($scope.item.tglakhir).format('YYYY');

              totaljumlahrajal += parseInt(data.data[i].jumlahrajal)
              totaljumlahigd += parseInt(data.data[i].jumlahigd)
              totaljumlahranap += parseInt(data.data[i].jumlahranap)

            }

            data.data[3].no = 99

            data.data[3].jumlahrajal = totaljumlahrajal
            data.data[3].jumlahigd = totaljumlahigd
            data.data[3].jumlahranap = totaljumlahranap

            data.data[0].kategori = 'Obat Generik (Formularium+Non Formularium)'
            data.data[1].kategori = 'Obat Non Generik Formularium'
            data.data[2].kategori = 'Obat Non Generik Non Formularium'
            data.data[3].kategori = 'TOTAL'

            $scope.getdataexcel = data.data;
            $scope.callExcel($scope.calldataexcel);
            $scope.dataRL3_13 = new kendo.data.DataSource({
              data: data.data,
              pageSize: 10,
              total: data.length,
              serverPaging: false,
              schema: {
                model: {
                  fields: {
                  }
                }
              }
            });


          })
      }

      $scope.panggil = function (cokot) {

        $("#kGrid").kendoGrid({
          toolbar: ["excel"],
          excel: {
            fileName: "Pengadaan Obat.xlsx",
            filterable: true,
            allPages: true
          },
          dataSource: $scope.ambildataexcel,
          // filterable: true,
          pageable: true,
          resizable: true,
          sortable: true,
          columns: [
                {
                  field: "kdprov",
                  title: "KODE PROPINSI",
                  width: "150px"
                },
                {
                    field: "kabkota",
                    title: "KAB / KOTA",
                    width: "150px"
                },
                {
                    field: "koders",
                    title: "KODE RS",
                    width: "150px"
                },
                {
                    field: "namars",
                    title: "NAMA RS",
                    width: "150px"
                },
                {
                    field: "tahun",
                    title: "TAHUN",
                    width: "150px"
                },
                {
                  field: "no",
                  title: "NO",
                  Template: "<span class='style-center'>#: no #</span>",
                  width: "150px"
                },
                {
                  field: "kategori",
                  title: "GOLONGAN OBAT",
                  width: "150px"
                },
                {
                  field: "jumlahitem",
                  title: "JUMLAH ITEM OBAT",
                  width: "150px"
                },
                {
                  field: "jumlahtersedia",
                  title: "JUMLAH ITEM OBAT YANG TERSEDIA DI RUMAH SAKIT",
                  width: "150px"
                },
                {
                  field: "jumlahtersediafor",
                  title: "JUMLAH ITEM OBAT FORMULATORIUM TERSEDIA DIRUMAH SAKIT",
                  width: "150px"
                }
          ]
        });
      }
      $scope.panggil();

      $scope.callExcel = function (ambil) {

        $("#kGrid1").kendoGrid({
          toolbar: ["excel"],
          excel: {
            fileName: "Pengadaan Obat.xlsx",
            filterable: true,
            allPages: true
          },
          dataSource: $scope.calldataexcel,
          // filterable: true,
          sortable: true,
          pageable: true,
          resizable: true,
          columns: [
            {
              field: "kdprov",
              title: "KODE PROPINSI",
              width: "150px"
            },
            {
                field: "kabkota",
                title: "KAB / KOTA",
                width: "150px"
            },
            {
                field: "koders",
                title: "KODE RS",
                width: "150px"
            },
            {
                field: "namars",
                title: "NAMA RS",
                width: "150px"
            },
            {
                field: "tahun",
                title: "TAHUN",
                width: "150px"
            },
            {
              field: "no",
              title: "NO",
              Template: "<span class='style-center'>#: no #</span>",
              width: "150px"
            },
            {
              field: "kategori",
              title: "GOLONGAN OBAT",
              width: "150px"
            },
            {
              field: "jumlahrajal",
              title: "RAWAT JALAN",
              width: "150px"
            },
            {
              field: "jumlahigd",
              title: "IGD",
              width: "150px"
            },
            {
              field: "jumlahranap",
              title: "RAWAT INAP",
              width: "150px"
            }
          ]
        });
      }
      $scope.callExcel();



      $scope.formatTanggal = function (tanggal) {
        return moment(tanggal).format('DD-MMM-YYYY HH:mm');
      }
      $scope.formatRupiah = function (value, currency) {
        return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
      }

      $scope.columnRL52 = [
        {
          field: "kdprov",
          title: "KODE PROPINSI",
          width: "150px"
        },
        {
            field: "kabkota",
            title: "KAB / KOTA",
            width: "150px"
        },
        {
            field: "koders",
            title: "KODE RS",
            width: "150px"
        },
        {
            field: "namars",
            title: "NAMA RS",
            width: "150px"
        },
        {
            field: "tahun",
            title: "TAHUN",
            width: "150px"
        },
        {
          field: "no",
          title: "NO",
          Template: "<span class='style-center'>#: no #</span>",
          width: "150px"
        },
        {
          field: "kategori",
          title: "GOLONGAN OBAT",
          width: "150px"
        },
        {
          field: "jumlahitem",
          title: "JUMLAH ITEM OBAT",
          width: "150px"
        },
        {
          field: "jumlahtersedia",
          title: "JUMLAH ITEM OBAT YANG TERSEDIA DI RUMAH SAKIT",
          width: "150px"
        },
        {
          field: "jumlahtersediafor",
          title: "JUMLAH ITEM OBAT FORMULATORIUM TERSEDIA DIRUMAH SAKIT",
          width: "150px"
        }
      ];

      $scope.columnRL3_13 = [
        {
            field: "kdprov",
            title: "KODE PROPINSI",
            width: "150px"
        },
        {
            field: "kabkota",
            title: "KAB / KOTA",
            width: "150px"
        },
        {
            field: "koders",
            title: "KODE RS",
            width: "150px"
        },
        {
            field: "namars",
            title: "NAMA RS",
            width: "150px"
        },
        {
            field: "tahun",
            title: "TAHUN",
            width: "150px"
        },
        {
          field: "no",
          title: "NO",
          Template: "<span class='style-center'>#: no #</span>",
          width: "150px"
        },
        {
          field: "kategori",
          title: "GOLONGAN OBAT",
          width: "150px"
        },
        {
          field: "jumlahrajal",
          title: "RAWAT JALAN",
          width: "150px"
        },
        {
          field: "jumlahigd",
          title: "IGD",
          width: "150px"
        },
        {
          field: "jumlahranap",
          title: "RAWAT INAP",
          width: "150px"
        }
      ];

      $scope.Perbaharui = function () {
        $scope.ClearSearch();
      }

      //fungsi clear kriteria search
      $scope.ClearSearch = function () {
        $scope.item = {};

        //     $scope.CariRegistrasiPasien();
      }

      $scope.ClearSearch1 = function () {
        $scope.item = {};
        $scope.item.tglawal = $scope.now;
        $scope.item.tglakhir = $scope.now;
        // $scope.CariRegistrasiPasien1();
      }



      $scope.date = new Date();
      var tanggals = DateHelper.getDateTimeFormatted3($scope.date);

      //Tanggal Default
      $scope.item.tglawal = tanggals + " 00:00";
      $scope.item.tglakhir = tanggals + " 23:59";
      $scope.item.tglawal1 = tanggals + " 00:00";
      $scope.item.tglakhir1 = tanggals + " 23:59";

      // Tanggal Inputan
      $scope.tglawal = $scope.item.tglawal;
      $scope.tglakhir = $scope.item.tglakhir;
      $scope.tglawal1 = $scope.item.tglawal;
      $scope.tglakhir1 = $scope.item.tglakhir;
      $scope.pegawai = medifirstService.getPegawai();



    }
  ]);
});