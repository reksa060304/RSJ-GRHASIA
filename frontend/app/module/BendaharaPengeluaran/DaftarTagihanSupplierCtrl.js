define(['initialize'], function (initialize) {
  'use strict';
  initialize.controller('DaftarTagihanSupplierCtrl', ['CacheHelper', '$scope', '$state', 'MedifirstService','$mdMenu',
    function (cacheHelper, $scope, $state, medifirstService, $mdMenu) {
      $scope.now = new Date();
      // $scope.dataSelected = {};
      $scope.item = {};
      $scope.fund = {}
      $scope.bri = {}
      let prof = JSON.parse(localStorage.getItem('profile'))
      $scope.ocbc = {
        senderName: prof.namalengkap,
        from: new Date(),
        to: new Date(),
        page: 1
      }
      LoadCombo()
      loadDataBRI()
      var chacePeriode = cacheHelper.get('DaftarTagihanSupplierCtrl');

      function LoadCache() {
        var chacePeriode = cacheHelper.get('DaftarTagihanSupplierCtrl');
        if (chacePeriode != undefined) {
          $scope.item.periodeAwal = new Date(chacePeriode[0]);
          $scope.item.periodeAkhir = new Date(chacePeriode[1]);
          init();
        } else {
          $scope.item.periodeAkhir = $scope.now;
          $scope.item.periodeAkhir = $scope.now;
          init();
        }
      }
      $scope.openMenu = function ($mdOpenMenu, e) {
        $mdOpenMenu(e);
      }
      function init() {
        $scope.isRouteLoading = true;
        var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD 00:00');
        var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD 23:59');
        var noFaktur = "";
        if ($scope.item.noFaktur != undefined) {
          noFaktur = "&NoFaktur=" + $scope.item.noFaktur;
        }

        var NamaSupplier = "";
        if ($scope.item.NamaSupplier != undefined) {
          NamaSupplier = "&Supplier=" + $scope.item.NamaSupplier;
        }

        var noTerima = "";
        if ($scope.item.noTerima != undefined) {
          noTerima = "&NoStruk=" + $scope.item.noTerima;
        }

        var tempStatus = "";
        if ($scope.item.status != undefined) {
          tempStatus = "&status=" + $scope.item.status.namaExternal;
          if ($scope.item.status.namaExternal == "SEMUA") {
            tempStatus = "";
          }
        }

        medifirstService.get("bendaharapengeluaran/get-data-tagihan-suplier?"
          + "tglAwal=" + tglAwal +
          "&tglAkhir=" + tglAkhir
          + tempStatus + noFaktur + NamaSupplier + noTerima, true).then(function (dat) {
            $scope.isRouteLoading = false;
            var datas = dat.data.daftar;
            for (var i = 0; i < datas.length; i++) {
              datas[i].no = i + 1
            }
            $scope.dataGrid = new kendo.data.DataSource({
              data: datas,
              total: datas.length,
              serverPaging: false,
              schema: {
                model: {
                  fields: {
                  }
                }
              }
            });
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
        cacheHelper.set('DaftarTagihanSupplierCtrl', chacePeriode);

      }

      function LoadCombo() {
        //List Status
        $scope.item.periodeAwal = moment($scope.now).format('YYYY-MM-DD');
        $scope.item.periodeAkhir = moment($scope.now).format('YYYY-MM-DD');
        // var tglJatuhTempo = moment($scope.dataSelected.tglJatuhTempo).format('YYYY-MM-DD');
        // var tglTerima = moment($scope.dataSelected.tglTerima).format('YYYY-MM-DD');
        // var tglfaktur = moment($scope.dataSelected.tglfaktur).format('YYYY-MM-DD')
        $scope.listStatus = [
          { id: 3, namaExternal: "SEMUA" },
          { id: 1, namaExternal: "LUNAS" },
          { id: 2, namaExternal: "BELUM LUNAS" }
        ];
        $scope.item.status = $scope.listStatus[0];
      }

      $scope.columnGrid = [
        {
          "field": "no",
          "title": "No",
          "width": "35px",
        },
        {
          "field": "nostruk",
          "title": "NoTerima",
          "width": "100px",
        },
        {
          "field": "tglstruk",
          "title": "Tgl Terima",
          "width": "110px",
          "template": "<span class='style-right'>{{formatTanggal('#: tglstruk #', '')}}</span>"
        },
        {
          "field": "namarekanan",
          "title": "Nama Rekanan",
          "width": "120px",
        },
        {
          "field": "nodokumen",
          "title": "No Dokumen",
          "width": "100px",
        },
        {
          "field": "tgljatuhtempo",
          "title": "Tgl Jatuh Tempo",
          "width": "110px",
          "template": "<span class='style-right'>{{formatTanggal('#: tgljatuhtempo #', '')}}</span>"
        },
        {
          "field": "total",
          "title": "Total",
          "template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>",
          "width": "100px",
        },
        {
          "field": "totalppn",
          "title": "Total PPN",
          "template": "<span class='style-right'>{{formatRupiah('#: totalppn #', '')}}</span>",
          "width": "100px",
        },
        {
          "field": "totaldiskon",
          "title": "Total Diskon",
          "template": "<span class='style-right'>{{formatRupiah('#: totaldiskon #', '')}}</span>",
          "width": "100px",
        },
        {
          "field": "subtotal",
          "title": "Sub Total",
          "template": "<span class='style-right'>{{formatRupiah('#: subtotal #', '')}}</span>",
          "width": "100px",
        },
        {
          "field": "sisautang",
          "title": "Sisa Hutang",
          "template": "<span class='style-right'>{{formatRupiah('#: sisautang #', '')}}</span>",
          "width": "100px",
        },
        {
          "field": "status",
          "title": "Status",
          "width": "100px",
        },
        {
          "field": "nomorreferencebri",
          "title": "No SCF BRI",
          "width": "100px",
        },
        {
          "field": "noreferral_fund",
          "title": "No Fund Transfer BRI",
          "width": "100px",
        }
      ];

      $scope.formatRupiah = function (value, currency) {
        if (value == null) {
          return 0
        }
        if (value == undefined) {
          return 0
        }
        return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
      };

      $scope.formatTanggal = function (tanggal) {
        return moment(tanggal).format('DD/MM/YYYY');
      }

      $scope.Cetak = function () {
        var xxx = $scope.dataPasienSelected.detail;
        var yyy = "aasas";
      }

      //Pindah Halaman ke Detail tagihan Rekanan/Suplier   
      $scope.Detail = function () {
        if ($scope.dataSelected.nostruk == undefined) {
          alert("Silahkan Pilih Tagihan Rekanan");
          return;
        }
        var tglJatuhTempo = moment($scope.dataSelected.tgljatuhtempo).format('YYYY-MM-DD');
        var tglTerima = moment($scope.dataSelected.tglstruk).format('YYYY-MM-DD');
        var tglfaktur = moment($scope.dataSelected.tgldokumen).format('YYYY-MM-DD')
        // $state.go("RekamDataPegawai",{idPegawai: $scope.idPegawai});
        var tempData = tglTerima + "#" +
          $scope.dataSelected.namarekanan + "#" +
          $scope.dataSelected.nodokumen + "#" +
          tglJatuhTempo + "#" +
          tglfaktur + "#" +
          $scope.dataSelected.norec
          + "#DaftarTagihanSupplier#"
          + $scope.dataSelected.nostruk;
        //setting caching
        cacheHelper.set('DetailTagihanRekanan', tempData);
        $state.go('DetailTagihanRekanan', { noTerima: '0308' })
      }

      //Pencarian data
      $scope.SearchData = function () {
        init()
      }
      //end SearchData

      $scope.Bayar = function () {
        if ($scope.dataSelected.nostruk == undefined) {
          alert("Silahkan Pilih Tagihan Rekanan");
          return;
        }
        var judul = "PembayaranTagihanSuplier";
        var tglJatuhTempo = moment($scope.dataSelected.tgljatuhtempo).format('YYYY-MM-DD');
        var tglTerima = moment($scope.dataSelected.tglstruk).format('YYYY-MM-DD');
        var tglfaktur = moment($scope.dataSelected.tgldokumen).format('YYYY-MM-DD')
        // $state.go("RekamDataPegawai",{idPegawai: $scope.idPegawai});
        var tempData = tglTerima
          + "#Pembayaran Suplier a/n " + $scope.dataSelected.namarekanan
          + "#" + $scope.dataSelected.nodokumen
          + "#" + tglJatuhTempo
          + "#" + tglfaktur
          + "#" + $scope.dataSelected.norec
          + "#" + $scope.dataSelected.sisautang
          + "#" + judul
          + "#DaftarTagihanSupplier"
        //setting caching
        cacheHelper.set('PembayaranTagihan', tempData);
        $state.go('PembayaranTagihan')
      }
      // $scope.bri = {}
      // $scope.scfBRI = function () {
      //   if ($scope.dataSelected.nostruk == undefined) {
      //     toastr.error('Pilih data dulu');
      //     return
      //   }
      //   $scope.isInquiry = false
      //   $scope.popUp.center().open()
      // }
      // $scope.batal = function () {
      //   init()
      //   $scope.popUp.close()
      // }
      // $scope.inquiryInvoice = function () {
      //   if ($scope.bri.ReferenceNumber == undefined) {
      //     toastr.error('Masukan Reference Number');
      //     return
      //   }
      //   $scope.isInquiry = false
      //   $scope.isRouteLoading = true
      //   medifirstService.get('bri/cbm/inquiry-single-invoice/' + $scope.bri.ReferenceNumber).then(function (e) {
      //     $scope.isRouteLoading = false
      //     if (e.data.responseCode == '00') {

      //       $scope.bri.InvoiceType = e.data.responseData.InvoiceType
      //       $scope.bri.InvoiceNumber = e.data.responseData.InvoiceNumber
      //       $scope.bri.InvoiceDate = e.data.responseData.CreateDate
      //       $scope.bri.InvoiceFrom = e.data.responseData.InvoiceFrom
      //       $scope.bri.InvoiceTo = e.data.responseData.InvoiceTo
      //       $scope.bri.Amount = e.data.responseData.Amount + ' ' + e.data.responseData.Currency
      //       $scope.bri.AmountNumber = parseFloat(e.data.responseData.Amount)
      //       $scope.bri.DisbursementCompleteDate = e.data.responseData.DisbursementCompleteDate
      //       $scope.bri.SettlementCompleteDate = e.data.responseData.SettlementCompleteDate
      //       $scope.bri.CreateDate = e.data.responseData.CreateDate
      //       $scope.bri.StatusDesc = e.data.responseData.StatusDesc
      //       $scope.bri.DisbursementDate = e.data.responseData.DisbursementDate
      //       $scope.bri.Description = e.data.responseData.Description
      //       $scope.isInquiry = true
      //       toastr.success(e.data.responseDesc, 'Info')
      //     } else {
      //       $scope.isInquiry = false
      //       toastr.error(e.data.responseDesc, 'Info')
      //     }

      //   })

      // }

      // $scope.paymenBRI = function () {
      //   $scope.isSave = true
      //   // medifirstService.postNonMessage('bri/cbm/payment-invoice', {
      //   //   "ReferenceNumber": $scope.bri.ReferenceNumber,
      //   //   "InvoiceNumber": $scope.bri.InvoiceNumber
      //   // }).then(function (response) {
      //   //   if (response.data.responseCode == '00') {
      //   saveToLocal()
      //   //     toastr.success(response.data.responseDesc, 'Info')
      //   //   } else {
      //   //     toastr.error(response.data.responseDesc, 'Info')
      //   //   }
      //   // })
      // }
      // function saveToLocal() {
      //   let json = {
      //     "sbk":
      //     {
      //       "nosbk": "",
      //       "carabayar": 7,//SCF BRI
      //       "kelompoktransaksi": 107,
      //       "keteranganlainnya": "Pembayaran Suplier a/n " + $scope.dataSelected.namarekanan,
      //       "tagihan": parseFloat($scope.dataSelected.total),
      //       "totalbayar": parseFloat($scope.bri.AmountNumber),
      //       "tglsbk": moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      //       "bankrekanan": "BANK RAKYAT INDONESIA",
      //       "rekeningrekanan": $scope.bri.ReferenceNumber,
      //       "pemilikrekanan": "",
      //       "bank": "BANK RAKYAT INDONESIA",
      //       "rekening": $scope.bri.ReferenceNumber,
      //       "pemilik": "",
      //       "sisautang": parseFloat($scope.dataSelected.total),
      //       "nostruk": $scope.dataSelected.norec,
      //       "keterangan": "Pembayaran SCF BRI " + $scope.bri.ReferenceNumber + " ke Suplier a/n " + $scope.dataSelected.namarekanan,
      //     }
      //   }

      //   medifirstService.post('bendaharapengeluaran/save-pembayaran-tagihan-suplier', json).then(function (e) {
      //     $scope.batal()
      //     $scope.isSave = false
      //   })
      // }
      let sourceAkunBRI = ''
      function loadDataBRI() {
        medifirstService.get('piutang/get-setting-bri').then(function (e) {
          // $scope.bri.PartnerCode = e.data.PartnerCode
          $scope.bri.AnchorCode = e.data.AnchorCode
          $scope.listBank = e.data.bankaccount
          sourceAkunBRI = e.data.sourceAccount
          // $scope.bri.InvoiceType = 'AR'
          // $scope.bri.InvoiceTypeName = 'Account Receivable'
          $scope.bri.Currency = 'IDR'
          medifirstService.get('bri/cbm/inquiry-facilities?anchorCode=' + $scope.bri.AnchorCode).then(function (z) {
            $scope.listFacilities = z.data.responseData
            $scope.bri.InvoiceTypeName = $scope.listFacilities[0]
          })
          medifirstService.get('bri/cbm/inquiry-list-partner?anchorCode=' + $scope.bri.AnchorCode).then(function (x) {
            $scope.listPartner = x.data.responseData
          })
        })
      }
      $scope.batal = function () {
        $scope.popUp2.close()
      }
      $scope.scfBRI = function () {
        if ($scope.dataSelected == undefined) {
          toastr.error('Pilih data dulu');
          return
        }
        $scope.invoiceBRI()
        $scope.myVar2 = 0
        $scope.popUp2.center().open()
      }

      $scope.onTabChanges = function (value) {
        if (value === 1) {
          $scope.invoiceBRI()
        } else if (value === 2) {
          if ($scope.dataSelected.nomorreferencebri == null) {
            toastr.warning('Invoice belum ada');
            return
          }
          $scope.inquiryBRI()
        } else if (value == 3) {
          loadICF()
        } else if (value == 4) {
          // loadDetailPartner()
        }
      };
      $scope.invoiceBRI = function () {
        // if ($scope.dataSelected == undefined) {
        // 	toastr.error('Pilih data dulu');
        // 	return
        // }
        if ($scope.dataSelected == undefined) { return }
        if ($scope.dataSelected.nomorreferencebri != null) {
          $scope.bri.ReferenceNumber = $scope.dataSelected.nomorreferencebri
          // 	toastr.warning('Invoice Sudah dibuat silahkan Cek Status',$scope.dataSelected.nomorreferencebri);
          // 	return
        }
        let bulanHareup = new Date(new Date().setMonth(new Date().getMonth() + 1));
        let bln = new Date(new Date().setMonth(new Date().getMonth() + 1));
        let bulanHareup1 = new Date(bln.setDate(bln.getDate() + 1));
        if ($scope.listPartner != undefined) {
          for (let i = 0; i < $scope.listPartner.length; i++) {
            const element = $scope.listPartner[i];
            if (element.InitialCode == $scope.dataSelected.partnercode) {
              $scope.bri.partner = element
              break
            }
          }
        }
        $scope.bri.InvoiceDate = new Date()
        $scope.bri.DisbursementDate = bulanHareup
        $scope.bri.SettlementDate = bulanHareup1
        $scope.bri.Description = "Tagihan Supplier " + $scope.dataSelected.namarekanan
        $scope.bri.Amount = parseInt($scope.dataSelected.sisautang)
        $scope.bri.AmountName = $scope.formatRupiah(parseInt($scope.dataSelected.sisautang), 'Rp. ')
        $scope.bri.InvoiceNumber = $scope.dataSelected.nostruk
        // $scope.bri.partner = $scope.dataSelected.namarekanan
        // $scope.popUp.center().open()
      }
      $scope.saveBRI = function () {
        if ($scope.dataSelected.status != 'BELUM LUNAS') {
          toastr.warning('Status Sudah Lunas Sudah');
          return
        }
        if ($scope.dataSelected.nomorreferencebri != null) {
          toastr.warning('Invoice Sudah dibuat silahkan Inquiry Invoice', $scope.dataSelected.nomorreferencebri);
          return
        }
        $scope.isSave = true
        let json = {
          "AnchorCode": $scope.bri.AnchorCode,
          "PartnerCode": $scope.bri.partner.InitialCode,
          "InvoiceType": $scope.bri.InvoiceTypeName.facilityCode,
          "InvoiceDate": moment($scope.bri.InvoiceDate).format('YYYY-MM-DD'),
          "InvoiceNumber": $scope.bri.InvoiceNumber,
          "Currency": $scope.bri.Currency,
          "Amount": $scope.bri.Amount,
          "DisbursementDate": moment($scope.bri.DisbursementDate).format('YYYY-MM-DD'),
          "SettlementDate": moment($scope.bri.SettlementDate).format('YYYY-MM-DD'),
          "SharingDate": "",
          "Description": $scope.bri.Description,
          "PaymentMethod": $scope.bri.InvoiceTypeName.facilityCode
        }
        $scope.isRouteLoading = true
        medifirstService.postNonMessage('bri/cbm/create-invoice', json).then(function (e) {
          if (e.data.responseCode == '00') {
            $scope.bri.ReferenceNumber = e.data.responseData.ReferenceNumber
            toastr.success(e.data.responseData.Message, 'Info')
            saveIntern($scope.bri.ReferenceNumber, $scope.bri.InvoiceNumber)
            $scope.popUp2.close()
          } else {
            toastr.error(e.data.responseDesc, 'Info')
          }

          $scope.isSave = false
          $scope.isRouteLoading = false
        }, function (error) {
          $scope.isRouteLoading = false
          $scope.isSave = false
        })
      }
      function saveIntern(briNumber, noPosting) {
        medifirstService.post('bendaharapengeluaran/save-nomor-bri-reference',
          { briNumber: briNumber, noPosting: noPosting }
        ).then(function (e) {
          init()
        })
      }
      $scope.inquiryBRI = function () {
        // if ($scope.dataSelected == undefined) {
        // 	toastr.error('Pilih data dulu');
        // 	return
        // }
        // if ($scope.dataSelected.nomorreferencebri ==null) {
        // 	toastr.warning('Invoice belum ada');
        // 	return
        // }
        $scope.isRouteLoading = true
        medifirstService.get('bri/cbm/inquiry-single-invoice/' + $scope.dataSelected.nomorreferencebri).then(function (e) {
          $scope.isRouteLoading = false
          if (e.data.responseCode == '00') {

            $scope.RefrenceNumber = e.data.responseData.RefrenceNumber
            $scope.InvoiceType = e.data.responseData.InvoiceType
            $scope.InvoiceNumber = e.data.responseData.InvoiceNumber
            $scope.Amount = e.data.responseData.Amount + ' ' + e.data.responseData.Currency
            $scope.DisbursementCompleteDate = e.data.responseData.DisbursementCompleteDate
            $scope.SettlementCompleteDate = e.data.responseData.SettlementCompleteDate
            $scope.CreateDate = e.data.responseData.CreateDate
            $scope.StatusDesc = e.data.responseData.StatusDesc
            // $scope.popUpDetail.center().open()
          } else {
            toastr.error(e.data.responseDesc, 'Info')
          }

        })

      }
      $scope.cancelInvoiceBRI = function () {
        if ($scope.dataSelected == undefined) {
          toastr.error('Pilih data dulu');
          return
        }
        if ($scope.dataSelected.nomorreferencebri == null) {
          toastr.warning('Invoice belum ada');
          return
        }
        let json = {
          "ReferenceNumber": $scope.dataSelected.nomorreferencebri,
          "InvoiceNumber": $scope.dataSelected.noPosting
        }

        $scope.isRouteLoading = true
        medifirstService.postNonMessage('bri/cbm/cancel-invoice', json).then(function (e) {
          if (e.data.responseCode == '00') {
            $scope.bri.ReferenceNumber = e.data.responseData.ReferenceNumber
            toastr.success(e.data.responseData.Message, 'Info')
            saveIntern(null, $scope.dataSelected.noPosting)
          } else {
            toastr.error(e.data.responseDesc, 'Info')
          }

          $scope.isRouteLoading = false
        }, function (error) {
          $scope.isRouteLoading = false
        })
      }

      $scope.columnCF = [
        {
          "field": "facilityCode",
          "title": "Facility Code"
        },
        {
          "field": "facilityCodeDesc",
          "title": "facility Description"
        },
        {
          "field": "facilityAccount",
          "title": "Facility Account "
        },

      ];
      $scope.columnDP = [
        {
          "field": "PartnerCode",
          "title": "Partner Code"
        },
        {
          "field": "PartnerName",
          "title": "Partner Name "
        },
        {
          "field": "PaymentMethod",
          "title": "Payment Method  "
        },
        {
          "field": "PaymentMethodDesc",
          "title": "Payment Method Desc  "
        },
      ];
      $scope.columnStatement = [
        {
          "field": "reference_no",
          "title": "Referrence No"
        },
        {
          "field": "acct_no",
          "title": "Account No"
        },
        {
          "field": "acct_ccy",
          "title": "Currency "
        },
        {
          "field": "trx_date",
          "title": "Date Trx "
        },
        {
          "field": "debit",
          "template": "<span class='style-right'>{{formatRupiah('#: debit #', '')}}</span>",
          "title": "Debit  "
        },
        {
          "field": "kredit",
          "title": "Kredit  ",
          "template": "<span class='style-right'>{{formatRupiah('#: kredit #', '')}}</span>",
        },
        {
          "field": "balance",
          "title": "Balance  ",
          "template": "<span class='style-right'>{{formatRupiah('#: balance #', '')}}</span>",
        },
        {
          "field": "description",
          "title": "Desc  "
        },
      ];
      function loadICF() {
        $scope.isRouteLoading = true
        medifirstService.get('bri/cbm/inquiry-facilities?anchorCode=' + $scope.bri.AnchorCode).then(function (e) {
          $scope.isRouteLoading = false
          if (e.data.responseCode == '00') {
            let data = e.data.responseData
            $scope.dsCF = new kendo.data.DataSource({
              data: data,
              pageSize: 10,
              total: data,
              serverPaging: false,
            });

          } else {
            toastr.error(e.data.responseDesc, 'Info')
          }
        })
      }
      $scope.facility = {}
      $scope.partner = {}


      $scope.facilityBalance = function () {
        $scope.isRouteLoading = true
        $scope.showBalance = false
        medifirstService.get('bri/cbm/inquiry-facility-balance?anchorCode=' + $scope.bri.AnchorCode
          + '&facility_code=' + $scope.bri.cekFacility.facilityCode
          + '&facility_account=' + $scope.bri.cekFacility.facilityAccount
          + '&partner_code=' + $scope.bri.cekPartner.InitialCode
        ).then(function (e) {
          $scope.isRouteLoading = false
          if (e.data.responseCode == '00') {
            $scope.showBalance = true
            $scope.facility = e.data.responseData

          } else {
            toastr.error(e.data.responseDesc, 'Info')
          }
        })
      }
      $scope.findFacility = function () {
        $scope.isRouteLoading = true
        $scope.showBalance2 = false
        medifirstService.get('bri/cbm/inquiry-partner-facility?anchorCode=' + $scope.bri.AnchorCode
          + '&facility_code=' + $scope.bri.cekFacility.facilityCode
          + '&partner_code=' + $scope.bri.cekPartner.InitialCode
        ).then(function (e) {
          $scope.isRouteLoading = false
          if (e.data.responseCode == '00') {
            $scope.showBalance2 = true
            $scope.partner = e.data.responseData

          } else {
            toastr.error(e.data.responseDesc, 'Info')
          }
        })
      }
      $scope.findDP = function () {
        $scope.isRouteLoading = true
        medifirstService.get('bri/cbm/inquiry-detail-partner?anchorCode=' + $scope.bri.AnchorCode
          + '&partner_code=' + $scope.bri.cekPartner.InitialCode).then(function (e) {
            $scope.isRouteLoading = false
            if (e.data.responseCode == '00') {
              let data = e.data.responseData
              $scope.dsDP = new kendo.data.DataSource({
                data: data,
                pageSize: 10,
                total: data,
                serverPaging: false,
              });

            } else {
              toastr.error(e.data.responseDesc, 'Info')
            }
          })
      }
      $scope.bayarLokal = function () {
        if ($scope.SettlementCompleteDate != undefined && $scope.SettlementCompleteDate != null) {
          $scope.isRouteLoading = true
          $scope.isSave = true
          let json = {
            "sbk":
            {
              "nosbk": "",
              "carabayar": 7,//SCF BRI
              "kelompoktransaksi": 107,
              "keteranganlainnya": "Pembayaran Suplier a/n " + $scope.dataSelected.namarekanan,
              "tagihan": parseFloat($scope.dataSelected.total),
              "totalbayar": parseFloat($scope.Amount),
              "tglsbk": moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
              "bankrekanan": "BANK RAKYAT INDONESIA",
              "rekeningrekanan": $scope.ReferenceNumber,
              "pemilikrekanan": "",
              "bank": "BANK RAKYAT INDONESIA",
              "rekening": $scope.ReferenceNumber,
              "pemilik": "",
              "sisautang": parseFloat($scope.dataSelected.total),
              "nostruk": $scope.dataSelected.norec,
              "keterangan": "Pembayaran SCF BRI " + $scope.ReferenceNumber + " ke Suplier a/n " + $scope.dataSelected.namarekanan,
            }
          }

          medifirstService.post('bendaharapengeluaran/save-pembayaran-tagihan-suplier', json).then(function (e) {
            $scope.popUp2.close()
            init()
          })
          // medifirstService.get('piutang/get-norec-sp-by-posting?noPosting=' + $scope.dataSelected.noPosting).then(function (res) {

          // 	let response = res.data
          // 	var ttlKlaimPasien = 0;
          // 	var ttlKlaim = 0;
          // 	var persen = 0;
          // 	var ttlKlaimPerPasien = 0;
          // 	var detailSPP = [];
          // 	var pembulatan = 0

          // 	for (var i = 0; i < response.length; i++) {
          // 		ttlKlaim = ttlKlaim + parseFloat(response[i].totalppenjamin);
          // 	}
          // 	persen = parseFloat(($scope.Amount * 100) / ttlKlaim);

          // 	for (var i = 0; i < response.length; i++) {
          // 		ttlKlaimPasien = parseFloat(response[i].totalppenjamin);
          // 		ttlKlaimPerPasien = parseFloat(response[i].totalppenjamin * persen) / 100;
          // 		pembulatan = Math.round(ttlKlaimPerPasien, -1);
          // 		var obj = {
          // 			noRecSPP: response[i].norec_spp,
          // 			klaim: ttlKlaimPasien,
          // 			bayarKlaim: pembulatan
          // 		}
          // 		detailSPP.push(obj)
          // 	}
          // 	let json = {
          // 		"parameterTambahan":
          // 		{
          // 			"noRecStrukPelayanan": response[0].norec_sp,
          // 			"tipePembayaran": "cicilanPasienCollect",
          // 			"jumlahBayar": parseFloat($scope.Amount)
          // 		},
          // 		"jumlahBayar": parseFloat($scope.Amount),
          // 		"biayaAdministrasi": 0,
          // 		"diskon": 0,
          // 		"detailSPP": detailSPP,
          // 		"pembayaran": [
          // 			{
          // 				"nominal": parseFloat($scope.Amount),
          // 				"caraBayar": { "id": 7 }//SCF BRI
          // 			}
          // 		]
          // 	}
          // 	medifirstService.post('kasir/simpan-data-pembayaran', json).then(function (e) {
          // 		$scope.isRouteLoading = false
          // 		$scope.popUp2.close()
          //     init()

          // 	})
          // })

        } else {
          toastr.error($scope.StatusDesc, 'Info')
        }
      }
      $scope.FundBRI = function () {
        if ($scope.dataSelected == undefined) {
          toastr.error('Pilih data dulu');
          return
        }

        initPopFund()
        $scope.fund.remark = 'Transfer ke Supplier ' + $scope.dataSelected.namarekanan
        $scope.fund.amount = parseFloat($scope.dataSelected.subtotal)
        $scope.fund.NoReferral = $scope.dataSelected.nostruk
        $scope.fund.sourceAccount = sourceAkunBRI
        $scope.fund.beneficiaryAccount = $scope.dataSelected.bankrekeningnomor
        $scope.popUp3.center().open()
      }
      function initPopFund() {
        $scope.fund = {}
        $scope.fund.transactionDateTime = new Date()
        $scope.fund.FeeType = 'OUR'
        if ($scope.dataSelected.date_fund != null)
          $scope.fund.transactionDateCari = new Date($scope.dataSelected.date_fund)
        if ($scope.dataSelected.sourceaccount != null)
          $scope.fund.sourceAccount = $scope.dataSelected.sourceaccount
        if ($scope.dataSelected.beneficiaryaccount != null)
          $scope.fund.beneficiaryAccount = $scope.dataSelected.beneficiaryaccount
        if ($scope.dataSelected.noreferral_fund != null)
          $scope.fund.noReferral = $scope.dataSelected.noreferral_fund

      }
      $scope.batalFund = function () {
        initPopFund()
        $scope.popUp3.close()
      }
      $scope.saveTransferFund = function () {
        if ($scope.dataSelected.status == 'LUNAS') {
          toastr.error('Tagihan ini sudah lunas')
          return
        }
        $scope.isSave = true
        let json = {
          "noReferral": $scope.fund.NoReferral,
          "sourceAccount": $scope.fund.sourceAccount,
          "beneficiaryAccount": $scope.fund.beneficiaryAccount,
          "amount": $scope.fund.amount,
          "feeType": $scope.fund.FeeType,
          "transactionDateTime": moment($scope.fund.transactionDateTime).format('DD-MM-YYYY HH:mm:ss'),
          "remark": $scope.fund.remark,
        }
        $scope.isRouteLoading = true
        medifirstService.postNonMessage('bri/fund/transfer', json).then(function (e) {
          if (e.data.responseCode == '0200') {
            toastr.success(e.data.responseDescription, 'Info')

            $scope.bayarFundLokal(json)
            // $scope.popUp3.close()
          } else {
            toastr.error((e.data.errorDescription != '' && e.data.errorDescription != '-') ? e.data.errorDescription : e.data.responseDescription, 'Info')
          }

          $scope.isSave = false
          $scope.isRouteLoading = false
        }, function (error) {
          $scope.isRouteLoading = false
          $scope.isSave = false
        })
      }
      $scope.bayarFundLokal = function (data) {
        // if($scope.fund.NoReferral !=$scope.dataSelected.nostruk )return
        data.date = moment($scope.fund.transactionDateTime).format('YYYY-MM-DD HH:mm:ss')
        data.bank = 'BRI'
        data.norec = $scope.dataSelected.norec
        data.table = 'strukpelayanan_t'

        $scope.isRouteLoading = true
        $scope.isSave = true
        medifirstService.post('bri/save-fund-internal', data).then(function (e) {
          let json = {
            "sbk":
            {
              "nosbk": "",
              "carabayar": 8,//SCF BRI
              "kelompoktransaksi": 107,
              "keteranganlainnya": "Pembayaran Suplier a/n " + $scope.dataSelected.namarekanan,
              "tagihan": parseFloat($scope.dataSelected.total),
              "totalbayar": parseFloat($scope.fund.amount),
              "tglsbk": moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
              "bankrekanan": "BANK RAKYAT INDONESIA",
              "rekeningrekanan": $scope.fund.beneficiaryAccount,
              "pemilikrekanan": $scope.fund.NoReferral,
              "bank": "BANK RAKYAT INDONESIA",
              "rekening": $scope.fund.sourceAccount,
              "nosbk_intern": $scope.fund.NoReferral,
              "kdbankaccounttujuanfk": 1,
              "pemilik": "",
              "sisautang": parseFloat($scope.dataSelected.total),
              "nostruk": $scope.dataSelected.norec,
              "keterangan": $scope.fund.remark//"Pembayaran Fund Transfer BRI " + $scope.fund.NoReferral + " ke Suplier a/n " + $scope.dataSelected.namarekanan,
            }
          }

          medifirstService.post('bendaharapengeluaran/save-pembayaran-tagihan-suplier', json).then(function (e) {
            $scope.popUp2.close()
            init()
          })
        })

      }
      $scope.transferStatusFund = function () {
        $scope.isRouteLoading = true
        $scope.showStatusFund = false
        medifirstService.postNonMessage('bri/fund/check-transfer-status',
          {
            "noReferral": $scope.fund.noReferral,
            "transactionDate": moment($scope.fund.transactionDateCari).format('DD-MM-YYYY')
          }
        ).then(function (e) {
          $scope.isRouteLoading = false

          if (e.data.responseCode == '0300') {
            $scope.showStatusFund = true
            $scope.fund.data = e.data.data
            toastr.info(e.data.responseDescription, 'Info')
          } else {
            $scope.showStatusFund = false
            toastr.error((e.data.errorDescription != '' && e.data.errorDescription != undefined) ? e.data.errorDescription : e.data.responseDescription, 'Info')
          }
        })
      }
      $scope.validasiAccount = function () {
        $scope.isRouteLoading = true
        $scope.showValidasi = false
        medifirstService.postNonMessage('bri/fund/validasi-account',
          {
            "sourceAccount": $scope.fund.sourceAccount,
            "beneficiaryAccount": $scope.fund.beneficiaryAccount
          }
        ).then(function (e) {
          $scope.isRouteLoading = false

          if (e.data.responseCode == '0100') {
            $scope.showValidasi = true
            $scope.fund.Data = e.data.data
            toastr.info(e.data.responseDescription, 'Info')
          } else {
            $scope.showValidasi = false
            toastr.error((e.data.errorDescription != '' && e.data.errorDescription != undefined) ? e.data.errorDescription : e.data.responseDescription, 'Info')
          }
        })
      }
      $scope.listProductOCBC =
        [
          { id: 'IFT', name: 'Transfer Dana ke OCBC NISP', url: 'ocbc/corporate/v2/transfers/overbooking' },
          { id: 'OAT', name: 'Transfer Dana ke Rekening dalam satu Organisasi', url: 'ocbc/corporate/v2/transfers/overbooking' },
          { id: 'OLT', name: 'Transfer Online', url: 'ocbc/corporate/v2/transfers/online/inquiry' },
          { id: 'LLG', name: 'Pembayaran LLG/SKN', url: 'ocbc/corporate/v2/transfers/llg' },
          { id: 'RTGS', name: 'Pembayaran RTGS ', url: 'ocbc/corporate/v2/transfers/rtgs' },
          { id: 'BPM', name: 'Pembayaran dan Pembelian', url: 'ocbc/corporate/v2/transfers/overbooking' },
          { id: 'ETAX', name: 'Pembayaran Pajak ' },
          { id: 'STMT', name: 'Balance Info dan Mutasi ' },
        ]
      $scope.listResidence = [{ id: 'Y', name: 'Ya' }, { id: 'N', name: 'Tidak' }]
      $scope.listBene = [
        { id: '0', name: 'A0-INDIVIDUAL' },
        { id: 'B0', name: 'B0-GOVERNMENT ' },
        { id: 'C0', name: 'C0-CENTRAL BANK ' },
        { id: 'C1', name: 'C1-REPORTING BANK IN DOMESTIC ' },
        { id: 'C2', name: 'C2-REPORTING BANK ABROAD (OVERSEAS) ' },
        { id: 'C9', name: 'C9-OTHER BANK ' },
        { id: 'D0', name: 'D0-NON BANK FINANCIAL INSTITUTION ' },
        { id: 'E0', name: 'E0-COMPANY ' },
        { id: 'F1', name: 'F1-INTERNATIONAL INSTITUTION/ORGANIZATION (IN A FORM AS A BANK) ' },
        { id: 'F2', name: 'F2-INTERNATIONAL INSTITUTION/ORGANIZATION (NON BANK) ' },
        { id: 'I0', name: 'I0-IDENTIC ' },

      ]
      $scope.ocbc.productCode = $scope.listProductOCBC[0]

      $scope.FundOCBC = function () {
        $scope.showIFT = true
        for (let i = 0; i < $scope.listBank.length; i++) {
          const element = $scope.listBank[i];
          if (element.nama.toLowerCase().indexOf('ocbc') > -1) {
            $scope.ocbc.accountNumber = element
            break
          }
        }
        $scope.ocbc.currencyCode = 'IDR'
        $scope.ocbc.languageCode = 'ID'
        // $scope.ocbc.productCode = 'IFT'
        $scope.listBankRekanan = $scope.listBank
        if ($scope.dataSelected != undefined) {
          $scope.listBankRekanan = []
          for (let i = 0; i < $scope.listBank.length; i++) {
            const element = $scope.listBank[i];
            if (element.kdrekananfk == $scope.dataSelected.objectrekananfk) {
              $scope.listBankRekanan.push(element)
            }
          }
          if ($scope.dataSelected != undefined) {
            $scope.ocbc.bankReferenceNo = $scope.dataSelected.noreferral_fund
          }

          $scope.ocbc.transferRemarks = 'Transfer ke Supplier ' + $scope.dataSelected.namarekanan
          $scope.ocbc.beneficiaryName = $scope.dataSelected.namarekanan
          $scope.ocbc.transferAmount = parseFloat($scope.dataSelected.subtotal)
          let nomor = $scope.dataSelected.nostruk
          nomor = nomor.replace('/', '');
          nomor = nomor.replace('-', '');
          $scope.ocbc.clientRefNumber = nomor
          for (let i = 0; i < $scope.listBank.length; i++) {
            const element = $scope.listBank[i];
            if (element.bankaccountnomor == $scope.dataSelected.bankrekeningnomor) {
              $scope.ocbc.beneAccountNo = element
              break
            }
          }
        }
        $scope.popUp4.center().open()
      }
      $scope.showIFT = true
      $scope.$watch('ocbc.productCode', function (newValue, oldValue) {
        if (newValue != oldValue) {
          if (newValue != undefined && newValue.id != 'IFT') {
            $scope.showIFT = false
          }
        }
      })
      $scope.$watch('ocbc.beneAccountNo', function (newValue, oldValue) {
        if (newValue != oldValue) {
          $scope.ocbc.beneBankName = newValue.bankaccountnama
        }
      })

      $scope.tranferOCBC = function () {
        $scope.isRouteLoading = true
        $scope.isSave = true
        if ($scope.ocbc.productCode == undefined) {
          toastr.error('Pilih Product')
          return
        }
        if ($scope.ocbc.productCode.id == 'IFT' || $scope.ocbc.productCode.id == 'OAT') {
          saveAntarRekeningIFT()
        }
        if ($scope.ocbc.productCode.id == 'BPM') {
          saveOLT()
        }
        if ($scope.ocbc.productCode.id == 'OLT') {
          saveOLT()
        }
        if ($scope.ocbc.productCode.id == 'LLG') {
          saveLLG()
        }
        if ($scope.ocbc.productCode.id == 'RTGS') {
          saveLLG()
        }
      }

      function saveAntarRekeningIFT() {
        let jsonIFT = {
          "clientRefNumber": $scope.ocbc.clientRefNumber ? $scope.ocbc.clientRefNumber : '',
          "fromAccountDetail": {
            "accountNumber": $scope.ocbc.accountNumber ? $scope.ocbc.accountNumber.bankaccountnomor : '',
            "currencyCode": $scope.ocbc.currencyCode,
          },
          "toAccountDetail": {
            "accountNumber": $scope.ocbc.beneAccountNo.bankaccountnomor,
            "currencyCode": $scope.ocbc.currencyCode,
          },
          "fundsTransferDetail": {
            "transferCurrency": $scope.ocbc.currencyCode,
            "transferAmount": $scope.ocbc.transferAmount,
            "beneficiaryName": $scope.ocbc.beneficiaryName,
            "productCode": $scope.ocbc.productCode.id
          }
        }
        $scope.isSave = true
        medifirstService.postNonMessage($scope.ocbc.productCode.url, jsonIFT).then(function (e) {
          $scope.isRouteLoading = false
          if (e.data.statusCode == '012') {
            toastr.info(e.data.statusReason, 'Info')
            let dataTF = {
              "sourceaccount": jsonIFT.fromAccountDetail.accountNumber,
              "beneficiaryaccount": jsonIFT.toAccountDetail.accountNumber,
              "amount": jsonIFT.fundsTransferDetail.transferAmount,
              "tipe": $scope.ocbc.productCode.name,
              "idbank": $scope.ocbc.accountNumber.id
            }
            $scope.bayarOCBCLokal(e.data, dataTF)
          } else {
            toastr.error(JSON.stringify(e.data), 'Info')
          }
          $scope.isSave = false
        })
      }
      function saveOLT() {
        let json = {

          "clientRefNumber": $scope.ocbc.clientRefNumber ? $scope.ocbc.clientRefNumber : '',
          "senderDetail": {
            "accountNumber": $scope.ocbc.accountNumber.bankaccountnomor,
            "currencyCode": $scope.ocbc.currencyCode,
            "senderName": $scope.ocbc.senderName,
          },
          "beneficiaryDetail": {
            "beneBankCode": $scope.ocbc.beneAccountNo.kdbankaccount,
            "beneAccountNo": $scope.ocbc.beneAccountNo.bankaccountnomor,
            "currencyCode": $scope.ocbc.currencyCode,
          },
          "fundsTransferDetail": {
            "transferCurrency": $scope.ocbc.currencyCode,
            "transferAmount": $scope.ocbc.transferAmount,
            "transferRemarks": $scope.ocbc.transferRemarks,
            "languageCode": "ID"
          }
        }
        medifirstService.postNonMessage($scope.ocbc.productCode.url, json).then(function (e) {
          $scope.isRouteLoading = false
          if (e.data.statusCode == '012') {
            let json2 = {
              "bankReferenceNo": e.data.bankReferenceNo,
              "clientRefNumber": json.clientRefNumber,
              "transactionUUID": e.data.transactionUUID,
            }
            medifirstService.postNonMessage('ocbc/corporate/v2/transfers/online/submit', json2).then(function (z) {
              $scope.isRouteLoading = false
              if (e.data.statusCode == '012') {
                let dataTF = {
                  "sourceaccount": json.senderDetail.accountNumber,
                  "beneficiaryaccount": json.beneficiaryDetail.accountNumber,
                  "amount": json.fundsTransferDetail.transferAmount,
                  "tipe": $scope.ocbc.productCode.name,
                  "idbank": $scope.ocbc.accountNumber.id
                }
                $scope.bayarOCBCLokal(e.data, dataTF)
                toastr.info(e.data.statusReason, 'Info')
              } else {

              }
            })
            toastr.info(e.data.statusReason, 'Info')
          } else {

          }
          $scope.isSave = false
        })
      }
      function saveLLG() {

        let json = {
          "clientRefNumber": $scope.ocbc.clientRefNumber ? $scope.ocbc.clientRefNumber : '',
          "senderDetail": {
            "accountNumber": $scope.ocbc.accountNumber.bankaccountnomor,
            "currencyCode": $scope.ocbc.currencyCode,
            "senderName": $scope.ocbc.senderName,
          },
          "beneficiaryDetail": {
            "beneAccountNo": $scope.ocbc.beneAccountNo.bankaccountnomor,
            "currencyCode": $scope.ocbc.currencyCode,
            "beneName": $scope.ocbc.beneficiaryName,
            "beneAddr1": $scope.ocbc.beneAddr1,
            "beneAddr2": $scope.ocbc.beneAddr2,
            "beneAddr3": $scope.ocbc.beneAddr3,
          },
          "beneBankDetail": {
            "beneBankCode": $scope.ocbc.beneAccountNo.kdbankaccount,
            "beneBankName": $scope.ocbc.beneBankName,
            "beneBankAddress1": $scope.ocbc.beneBankAddress1,
            "beneBankBranch": $scope.ocbc.beneBankBranch,
            "beneBankClearingCode": $scope.ocbc.beneBankClearingCode,
            "beneBankCityCode": $scope.ocbc.beneBankCityCode,
          },
          "fundsTransferDetail": {
            "transferCurrency": $scope.ocbc.currencyCode,
            "transferAmount": $scope.ocbc.transferAmount,
            "paymentDetail": $scope.ocbc.paymentDetail,
          },
          "regulatoryInfo": {
            "residentStatus": $scope.ocbc.residentStatus ? $scope.ocbc.residentStatus.id : "",
            "beneCategory": $scope.ocbc.beneCategory ? $scope.ocbc.beneCategory.id : "",
            "remitterCategory": $scope.ocbc.remitterCategory ? $scope.ocbc.remitterCategory.id : "",
          },
          "userInfo": {
            "userID": ""
          }
        }
        $scope.isSave = true
        medifirstService.postNonMessage($scope.ocbc.productCode.url, json).then(function (e) {
          $scope.isRouteLoading = false
          if (e.data.statusCode == '012') {
            let dataTF = {
              "sourceaccount": json.senderDetail.accountNumber,
              "beneficiaryaccount": json.beneficiaryDetail.accountNumber,
              "amount": json.fundsTransferDetail.transferAmount,
              "tipe": $scope.ocbc.productCode.name,
              "idbank": $scope.ocbc.accountNumber.id
            }
            $scope.bayarOCBCLokal(e.data, dataTF)
            toastr.info(e.data.statusReason, 'Info')
          } else {
            toastr.error(e.data.statusReason, 'Info')
          }
          $scope.isSave = false
        })
      }
      $scope.isRouteLoading = false
      $scope.fundtransfer_data = {};
      $scope.inqBalance = {};
      $scope.inqBalance = function () {
        $scope.isRouteLoading = true
        let json = [{
          'accountNumber': $scope.ocbc.accountNumber.bankaccountnomor,
          'currencyCode': 'IDR'
        }]
        $scope.inqBalance = {};
        medifirstService.postNonMessage('ocbc/corporate/v1/casa/balance', json).then(function (e) {
          $scope.isRouteLoading = false
          if (e.data.length > 0) {
            $scope.inqBalance = e.data[0];
            toastr.error("Success", 'Info')
          }
          else{
            toastr.error(e.data.error, 'Info')

          }
        })
      }
      $scope.transferStatusOCBC = function () {
        $scope.isRouteLoading = true
        $scope.showSttOCBC = false
        medifirstService.postNonMessage('ocbc/corporate/v2/transfers/status', {
          'bankReferenceNo': $scope.ocbc.bankReferenceNo
        }).then(function (e) {
          $scope.isRouteLoading = false
          if (e.data.response_code == '00000') {
            $scope.showSttOCBC = true
            $scope.fundtransfer_data = e.data.data.fundtransfer_data
          } else {
            toastr.error(e.data.response_desc_id, 'Info')
          }
        })
      }
      $scope.batalOCBC = function () {
        $scope.popUp4.close()
      }
      $scope.bayarOCBCLokal = function (res, jos) {
        $scope.isRouteLoading = true
        $scope.isSave = true

        let data = {
          noReferral: res.bankReferenceNo,
          sourceAccount: jos.sourceaccount,
          beneficiaryAccount: jos.beneficiaryaccount,
          amount: jos.amount,
          feeType: null,
          transactiondate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
          remark: null,
          bank: 'OCBC NISP',
          norec: $scope.dataSelected.norec,
          table: 'strukpelayanan_t',
        }
        medifirstService.post('bri/save-fund-internal', data).then(function (e) {
          let json = {
            "sbk":
            {
              "nosbk": "",
              "carabayar": 8,//SCF BRI
              "kelompoktransaksi": 107,
              "keteranganlainnya": "Pembayaran Suplier a/n " + $scope.dataSelected.namarekanan,
              "tagihan": parseFloat($scope.dataSelected.total),
              "totalbayar": parseFloat(data.amount),
              "tglsbk": moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
              "bankrekanan": "BANK OCBC NISP",
              "rekeningrekanan": data.beneficiaryAccount,
              "pemilikrekanan": $scope.ocbc.clientRefNumber,
              "bank": "BANK OCBC NISP",
              "rekening": data.sourceAccount,
              "nosbk_intern": $scope.ocbc.clientRefNumber,
              "kdbankaccounttujuanfk": data.idbank,
              "pemilik": "",
              "sisautang": parseFloat($scope.dataSelected.total) - parseFloat(data.amount) < 0 ? 0 : parseFloat($scope.dataSelected.total) - parseFloat(data.amount),
              "nostruk": $scope.dataSelected.norec,
              "keterangan": 'Pembayaran Tagihan Supplier OCBC NISP ' + data.tipe
            }
          }

          medifirstService.post('bendaharapengeluaran/save-pembayaran-tagihan-suplier', json).then(function (e) {
            $scope.popUp4.close()
            init()
          })
        })
      }

      $scope.findOCState = function () {
        $scope.isRouteLoading = true
        let json = {
          "accountNumber": $scope.ocbc.accountNumber.bankaccountnomor,
          "currencyCode": "IDR",
          "dateFrom": $scope.ocbc.from,
          "dateTo": $scope.ocbc.to,
          "pageNo": $scope.ocbc.page,
        }

        medifirstService.postNonMessage('ocbc/corporate/v1/casa/stmt/history', json).then(function (e) {
          $scope.isRouteLoading = false
          if (e.data.statementData != undefined) {
            let data = e.data.statementData
            for (let i = 0; i < data.length; i++) {
              const element = data[i];
              if (element.debit_credit_ind == 'D') {
                element.debit = element.amount
                element.kredit = 0
              }
              if (element.debit_credit_ind == 'C') {
                element.kredit = element.amount
                element.debit = 0
              }
            }
            $scope.dsStatement = new kendo.data.DataSource({
              data: data,
              pageSize: 10,
              total: data,
              serverPaging: false,
            });

          } else {
            toastr.error('Not Found', 'Info')
          }
        })
      }
      $scope.openMenu = function ($mdOpenMenu,e){
          $mdOpenMenu(e);
      }
    }
  ]);
});