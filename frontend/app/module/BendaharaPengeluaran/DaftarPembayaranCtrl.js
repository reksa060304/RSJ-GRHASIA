define(['initialize'], function (initialize) {
  'use strict';
  initialize.controller('DaftarPembayaranCtrl', ['$state', '$mdDialog', '$scope', 'CacheHelper','DateHelper', 'MedifirstService',
    function ($state, $mdDialog, $scope, cacheHelper, dateHelper, medifirstService) {
      $scope.isRouteLoading = false;
      $scope.now = new Date();
      $scope.item = {};
      $scope.dataSbnSelected = {};
      $scope.item.tglawal = new moment($scope.now).format('YYYY-MM-DD 00:00');
      $scope.item.tglakhir = new moment($scope.now).format('YYYY-MM-DD 23:59');
      var pegawaiUser = [];
      LoadCache();

      function LoadCache() {
        var chacePeriode = cacheHelper.get('DaftarPembayaranCtrl');
        if (chacePeriode != undefined) {
          $scope.item.tglawal = new Date(chacePeriode[0]);
          $scope.item.tglakhir = new Date(chacePeriode[1]);
          loadCombo()
          loadData();
        } else {
          $scope.item.tglawal = moment($scope.now).format('YYYY-MM-DD 00:00');
          $scope.item.tglakhir = moment($scope.now).format('YYYY-MM-DD 23:59');
          loadCombo()
          loadData();
        }
      }

      function loadCombo() {
        medifirstService.getPart("sysadmin/general/get-combo-pegawai", true, true, 20).then(function (data) {
          $scope.listKasir = data;
        });        

        medifirstService.get('bendaharapengeluaran/get-data-combo').then(function (dat) {         
          $scope.listCaraBayar = dat.data.carabayar;
          $scope.listBankAcc= dat.data.listbankaccount
          pegawaiUser = medifirstService.getUserLogin();
          if (pegawaiUser.namalengkap == 'Administrator') {
            $scope.item.Kasir = undefined;
          } else {
            $scope.item.Kasir = { id: pegawaiUser.id, namalengkap: pegawaiUser.namalengkap };
          }
        });
      }




      function loadData() {
        $scope.isRouteLoading = true;
        var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
        var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');
        var chacePeriode = tglAwal + "~" + tglAkhir
        cacheHelper.set('DaftarPembayaranCtrl', chacePeriode);

        var Skasir = "";
        if ($scope.item.kasir != undefined) {
          Skasir = $scope.item.kasir.id;
        }
        var bank = "";
        if ($scope.item.bank != undefined) {
          bank = $scope.item.bank.id;
        }
        
        var ScaraBayar = "";
        if ($scope.item.CaraBayar != undefined) {
          ScaraBayar = $scope.item.CaraBayar.id;
        }

        var nomorAccount = "";
        if ($scope.item.nomorAccount == undefined) {
          nomorAccount = $scope.item.nomorAccount;
        }
        var noSbk = "";
        if ($scope.item.noSBK == undefined) {
          noSbk = $scope.item.noSBK;
        }

        medifirstService.get("bendaharapengeluaran/get-daftar-pembayaran?" +
          "tglAwal=" + tglAwal +
          "&tglAkhir=" + tglAkhir +
          "&Skasir=" + Skasir +
          "&ScaraBayar=" + ScaraBayar +
              "&bank=" + bank +
                 "&noaccount=" + nomorAccount +
          "&noSbk=" + noSbk, true).then(function (dat) {
            $scope.isRouteLoading = false;
            var SubTotal = 0;
            for (var i = 0; i < dat.data.daftar.length; i++) {
              dat.data.daftar[i].no = i + 1
              if(  dat.data.daftar[i].bankaccountnomor == null){
                dat.data.daftar[i].bankaccountnomor = '-'
              }
              if (dat.data.daftar[i].statusrekon ==true) {
                 dat.data.daftar[i].isrekon = "✔";
               } else {
                 dat.data.daftar[i].isrekon = "✘";
               }
              SubTotal = SubTotal + parseInt(dat.data.daftar[i].totaldibayar)
            }

            // $scope.dataDaftarPenerimaan = dat.data.daftar;
            $scope.dataDaftarPenerimaan = new kendo.data.DataSource({
              data: dat.data.daftar,
              // group: $scope.group,
              // pageSize: 50,
              total: dat.data.daftar.length,
              serverPaging: false,
              schema: {
                model: {
                  fields: {
                    totaldibayar: { type: "number" }
                  }
                }
              },
              aggregate: [
                { field: 'totaldibayar', aggregate: 'sum' },
              ]
            });
            pegawaiUser = dat.data.datalogin
            // $scope.totalPenerimaan = 'Rp. ' + parseFloat(SubTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");

          });

        var chacePeriode = {
          0: tglAwal,
          1: tglAkhir,
          2: '',
          3: '',
          4: '',
          5: '',
          6: ''
        }
        cacheHelper.set('DaftarPembayaranCtrl', chacePeriode);
      }
    
         var onDataBound = function () {
                $('td').each(function () {
                    if ($(this).text() == '') { $(this).addClass('red') }
                    if ($(this).text() == '✔') { $(this).addClass('green') }
                    if ($(this).text() == 'Di Panggil Dokter') { $(this).addClass('blue') }
                    if ($(this).text() == 'Online') { $(this).addClass('koneng') }

                })
            }
     $scope.columnDaftarPenerimaan = {
        sortable: true,
        pageable: true,
        selectable: "row",
          dataBound: onDataBound,
        columns:  [
        {
          "field": "nosbk",
          "title": "No SBK",
          "template": "<span class='style-center'>#: nosbk #</span>",
          "width": "120px"
        },
        {
          "field": "tglsbk",
          "title": "Tanggal",
          "template": "<span class='style-right'>{{formatTanggal('#: tglsbk #', '')}}</span>",
          "width": "120px",
           
        },
   
        {
          "field": "namalengkap",
          "title": "Kasir",
          "template": "<span class='style-center'>#: namalengkap #</span>",
          "width": "200px"
        },
        {
          "field": "carabayar",
          "title": "Cara Bayar",
          "template": "<span class='style-center'>#: carabayar #</span>",
          "width": "200px"
        },
        {
          "field": "bankaccountnomor",
          "title": "Account Number",
          "template": "<span class='style-center'>#: bankaccountnomor #</span>",
          "width": "100px",
           groupFooterTemplate: "Jumlah",
            footerTemplate: "Total "
        },
        
        
        {
          "field": "totaldibayar",
          "title": "Total Dibayar",
          "template": "<span class='style-right'>{{formatRupiah('#: totaldibayar #', 'Rp.')}}</span>",
          "width": "200px",
              aggregates: ["sum"],
            footerTemplate: "#: data.totaldibayar.sum #",
            footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.totaldibayar.sum #', 'Rp.')}}</span>",
            footerAttributes: { style: "text-align: right;" }

        },
        {
          "field": "keterangan",
          "title": "Keterangan",
          "template": "<span class='style-center'>#: keterangan #</span>",
          "width": "200px"
        },
         {
          "field": "isrekon",
          "title": "Status Rekon",
          "template": "<span class='style-center'>#: isrekon #</span>",
          "width": "100px"
        },
        
      ]};

      $scope.Cetak = function () {
        if ($scope.dataSbnSelected.noSbm == undefined) {

          var alertDialog = modelItemAkuntansi.showAlertDialog("Informasi",
            "transaksi belum dipilih", "Ok");

          $mdDialog.show(alertDialog).then(function () {

          });
        } else {
          var obj = {
            noRegistrasi: [$scope.dataSbnSelected.noSbm],
            backPage: "DaftarPenerimaanKasir"
          }

          $state.go("CetakDokumenKasir", {
            dataPasien: JSON.stringify(obj)
          });
        }
      }

      $scope.formatRupiah = function (value, currency) {
        return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
      }

      $scope.SearchData = function () {
        loadData();
      }

      $scope.formatTanggal = function (tanggal) {
        return moment(tanggal).format('DD/MM/YYYY HH:mm');
      }
      $scope.isBank = true
      var listCB =[2,3,4,7,8,9]
       $scope.$watch('item.CaraBayar', function (newValue, oldValue) {
                $scope.isBank = false
                if (newValue != oldValue) {
                    if(listCB.includes(parseInt(newValue.id)) == true){
                       $scope.isBank = true
                     }
                }
        });
       $scope.$watch('item.bank', function (newValue, oldValue) {
              if (newValue != oldValue) {
                  $scope.item.nomorAccount = newValue.bankaccountnomor
              }
        });
       var listRekon = [
        {
            "transactionTime": "2021-09-29 05:56:07",
            "debitAmount": "1000.00",
            "creditAmount": "0.00",
            "typeAmount": "Debit",
            "remark": "Pembayaran Fund Transfer BRI 99999999999999999918 ke Suplier a/n RS Sido Waras",
             "startBalance": "11567861.40",
            "endBalance": "11566861.40"
        },
        {
            "transactionTime": "2020-12-03 05:56:07",
            "debitAmount": "300000.00",
            "creditAmount": "0.00",
            "typeAmount": "Debit",
            "remark": "BRIVA88099085868580099IBNKOVO HI****T WI                                                                                                                                                             ",
            "startBalance": "11566861.40",
            "endBalance": "11266861.40"
        }]
       $scope.Rekons = function(){
         if($scope.item.nomorAccount ==  undefined){
           toastr.error('Pilih cara Bayar & Account number Bank')
           return 
         }
         $scope.isRouteLoading = true
         $scope.isSave = true
         var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD');
         var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD');
         let json ={
            "accountNumber": $scope.item.nomorAccount,
            "startDate": tglAwal,
            "endDate": tglAkhir
         }
          medifirstService.postNonMessage('bri/riwayat-transaksi', json).then(function (e) {
            if (e.data.responseCode == '0000') {
              let  response = e.data.data //listRekon//
              let dataSave =[]
              for (var i = 0; i < response.length; i++) {
                const  element = response[i]
                let transactionTime =  moment(new Date(element.transactionTime)).format('YYYY-MM-DD')
                 for (var x = 0; x <  $scope.dataDaftarPenerimaan._data.length; x++) {
                   const element2 = $scope.dataDaftarPenerimaan._data[x]
                   let tgl =  moment(new Date(element2.tglsbk)).format('YYYY-MM-DD')
                   if(element2.keterangan == element.remark && tgl == transactionTime){
                     dataSave.push({
                       'norec': element2.norec_sbk
                     })
                   }
                 }
              }
              if(dataSave.length> 0){
                saveRekon(dataSave)
              }
              toastr.success(e.data.responseDescription, 'Info')
            
            } else {
              toastr.error(e.data.responseDescription, 'Info')
            }

            $scope.isSave = false
            $scope.isRouteLoading = false
          }, function (error) {
            $scope.isRouteLoading = false
            $scope.isSave = false
          })
   
       }
       function saveRekon(dataSave){
          $scope.isRouteLoading = true
             medifirstService.post('bri/save-rekon-transaksi', {'data':dataSave}).then(function (e) {
               loadData()
                $scope.isRouteLoading = false
             })
       }
       
      ////////////////////////////////////////////////////////    END       /////////////////////////////////////////////////////////////////
    }
  ]);
});