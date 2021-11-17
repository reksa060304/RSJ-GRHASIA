define(['initialize'], function (initialize) {
  'use strict';
  initialize.controller('DaftarPasienPulangRanapCtrl', ['CacheHelper', '$mdDialog', '$state', '$scope', 'MedifirstService',
    function (cacheHelper, $mdDialog, $state, $scope, medifirstService) {
      $scope.dataVOloaded = true;
      $scope.now = new Date();
      $scope.item = {};
      $scope.isRouteLoading = false;
      $scope.showBtnBayar = false
      $scope.dataPasienSelected = undefined;
      $scope.norecSpLast = ''
      $scope.isSelesaiPeriksa = false
      var dataLogin = {};
      $scope.item.jmlRows = 10
      $scope.noSuratKeteranganKematian = '';
      $scope.norecPelimpahan = '';
      LoadCombo();
      showButton();



      function showButton() {
        $scope.showBtnDetail = true;
        $scope.showBtnCetak = false;
        $scope.showBtnVerifikasi = true;
        $scope.showBtnUbahJenis = true;
        $scope.showBtnUnVerifikasi = true;
        $scope.showBtnBatalPulang = true;
        $scope.showBtnRekap = true

      }

      LoadCache();
      $scope.BtalPulang = function () {
        medifirstService.get("tatarekening/get-status-verif-piutang?noReg=" + $scope.dataPasienSelected.noRegistrasi, false).then(function (res) {
          // debugger;
          if ($scope.dataPasienSelected.deptid != '16') {
            window.messageContainer.error("Fitur Ini Khusus Pasien Rawat Inap!!!");
            return;
          }
          if ($scope.dataPasienSelected.status == 'Verifikasi'
            || res.data.noverif != undefined
            || $scope.dataPasienSelected.status == '-') {
            window.messageContainer.error("Data Pasien Sudah di Verifikasi!!!");
            return;
          }
          var objsave = {
            noregistrasi: $scope.dataPasienSelected.noRegistrasi,
            tglpulang: null
          }
          medifirstService.post('kasir/save-batal-pulang', objsave).then(function (data) {
            LoadData();
          })
        })
      }
      // var chacePeriode = tglAwal + ":" + tglAkhir + ":" + tempStatus + ":" + tempNamaOrReg 
      //               + ":" + tempNoReg + ":" + tempRuanganId  + ":" + tempInstalasiId;
      function LoadCache() {
        var chacePeriode = cacheHelper.get('DaftarPasienPulangCtrl');
        if (chacePeriode != undefined) {
          //var arrPeriode = chacePeriode.split(':');
          $scope.item.tanggalRegistrasiAwal = new Date(chacePeriode[0]);
          $scope.item.tanggalRegistrasiAkhir = new Date(chacePeriode[1]);
          $scope.item.status = chacePeriode[2]
          $scope.item.namaOrReg = chacePeriode[3]

          if (chacePeriode[6] != undefined) {
            // LoadData()
            $scope.listDepartemen = [chacePeriode[6]]
            $scope.item.instalasi = chacePeriode[6]
          }
          if (chacePeriode[5] != undefined) {
            $scope.listRuangan = [chacePeriode[5]]
            $scope.item.ruangan = chacePeriode[5]
          }



          if (chacePeriode[4] != undefined) {
            // LoadData()
            $scope.item.noReg = chacePeriode[4]
          }
          if (chacePeriode[7] != undefined) {
            // LoadData()
            $scope.item.noRm = chacePeriode[7]
          }
          if (chacePeriode[8] != undefined) {
            // LoadData()
            $scope.item.jmlRows = chacePeriode[8]
          }

          // LoadData()
        }
        else {
          $scope.item.tanggalRegistrasiAwal = new Date(moment($scope.now).format('YYYY-MM-DD 00:00'))
          $scope.item.tanggalRegistrasiAkhir = new Date(moment($scope.now).format('YYYY-MM-DD 23:59'))
          LoadData()
        }
      }

      $scope.getIsiComboRuangan = function () {
        //debugger;
        $scope.listRuangan = $scope.item.instalasi.ruangan
      }

      function LoadCombo() {       
        medifirstService.get("tatarekening/get-combo-detail-regis", false).then(function (dat) {
          $scope.listDepartemen = dat.data.departemen;
          $scope.listKelompokPasien = dat.data.kelompokpasien;
          $scope.listDataJabatan = dat.data.jabatan;
          $scope.listJenisKelamin = dat.data.jeniskelamin;
          $scope.listHubunganKel = dat.data.hubungankeluarga;
          $scope.item.NomorSurat = dat.data.nosurat;
          $scope.noSuratKeteranganKematian = dat.data.nosurat;
          dataLogin = medifirstService.getUserLogin();
        })
        $scope.listStatus = [{ "id": "1", "namaExternal": "Semua" }, { "id": "2", "namaExternal": "Belum Verifikasi" }, { "id": "3", "namaExternal": "Verifikasi" }, { "id": "4", "namaExternal": "Lunas" }]
        medifirstService.getPart('sysadmin/general/get-combo-pegawai', true, 10).then(function (e) {
          $scope.listDataPegawai = e;
          $scope.listDataPegawais = e;
        })
      };

      $scope.formatTanggal = function (tanggal) {
        return moment(tanggal).format('DD-MMM-YYYY');
      }

      $scope.formatTanggalJam = function (tanggal) {
        return moment(tanggal).format('DD-MMM-YYYY HH:mm');
      }

      $scope.click = function (dataPasienSelected) {
        var data = dataPasienSelected;
        if (dataPasienSelected != undefined) {
          $scope.dataPasienSelected = dataPasienSelected
          medifirstService.get("tatarekening/get-struk-pelayanan/" + dataPasienSelected.noRegistrasi, false).then(function (res) {
            if (res.data.data.length > 0) {
              $scope.showBtnBayar = true
              $scope.listBelumBayar = res.data.data
              $scope.norecSpLast = res.data.data[0].norec_sp
            } else {
              $scope.showBtnBayar = false
              $scope.listBelumBayar = undefined
              $scope.norecSpLast = ''
            }
          })
          if (dataPasienSelected.tglclosing == null)
            $scope.isSelesaiPeriksa = false
          else
            $scope.isSelesaiPeriksa = true
        }
      };

      $scope.columnPasienPulang = [
        {
          "field": "tanggalMasuk",
          "title": "Tanggal Masuk",
          "width": "80px",
          "template": "<span class='style-left'>{{formatTanggalJam('#: tanggalMasuk #')}}</span>"
        },
        {
          "field": "noCm",
          "title": "No.RM",
          "width": "50px",
          "template": "<span class='style-center'>#: noCm #</span>"
        },
        {
          "field": "noRegistrasi",
          "title": "No. Registrasi",
          "width": "60px",
          "template": "<span class='style-center'>#: noRegistrasi #</span>"
        },
        {
          "field": "namaPasien",
          "title": "Nama",
          "width": "120px"
        },
        {
          "field": "jenisAsuransi",
          "title": "Jenis Pasien",
          "width": "100px",
          "template": "<span class='style-center'>#: jenisAsuransi #</span>"
        },
        {
          "field": "namaRuangan",
          "title": "Ruangan",
          "width": "120px"
        },
        {
          "field": "tanggalPulang",
          "title": "Tanggal Pulang",
          "width": "80px",
          "template": "<span class='style-left'>{{formatTanggalJam('#: tanggalPulang #')}}</span>"
        },
        {
          "field": "tglmeninggal",
          "title": "Status Pasien",
          "width": "40px",
          "template": '# if( tglmeninggal==null) {# <span class="label label-primary text-center">Hidup</span> # } else {# <span class="label label-danger text-center">Meninggal</span> #} #'
        },
        // {
        //   "field": "tglmeninggal",
        //   "title": "Tanggal Meninggal",
        //   "width": "80px",
        //   "template": "<span class='style-left'>{{formatTanggalJam('#: tglmeninggal #')}}</span>"
        // },
        // {
        //   "field": "tanggalPulang",
        //   "title": "Tanggal Pulang",
        //   "width": "80px",
        //   "template": "<span class='style-left'>{{formatTanggalJam('#: tanggalPulang #')}}</span>"
        // },
        {
          "field": "status",
          "title": "Status",
          "width": "120px",
          "template": "<span class='style-center'>#: status #</span>"
        },
        // {
        //   "field": "noverif",
        //   "title": "Verif Piutang",
        //   "width":"70px",
        //   "template": "<span class='style-center'>#: noverif #</span>"
        // }
      ];


      $scope.Cetak = function () {
        //if(!$scope.dataPasienSelected.isPaid){
        if ($scope.dataPasienSelected.status == 'Belum Verifikasi') {
          var alertDialog = modelItemAkuntansi.showAlertDialog("Informasi",
            "Pasien belum melakukan pembayaran", "Ok");

          $mdDialog.show(alertDialog).then(function () { });
        }
        else {
          ////debugger;
          if ($scope.dataPasienSelected.noRegistrasi != undefined) {
            var stt = 'false'
            if (confirm('View ? ')) {
              // Save it!
              stt = 'true';
            } else {
              // Do nothing!
              stt = 'false'
            }
            var client = new HttpClient();
            client.get('http://127.0.0.1:1237/printvb/kasir?cetak-kip=1&noregistrasi=' + $scope.dataPasienSelected.noRegistrasi + '&strIdPegawai=' + dataLogin.namauser + '&STD=&view=' + stt, function (response) {
              // aadc=response;
            });
            // var obj = {
            //   noRegistrasi : $scope.dataPasienSelected.noRegistrasi
            // }

            // $state.go("CetakDokumenTataRekening", {
            //   dataPasien: JSON.stringify(obj)
            // });
          }
          else {
            alert("Silahkan pilih data pasien terlebih dahulu");
          }
        }
      }

      $scope.Verifikasi = function () {
        medifirstService.get("tatarekening/get-status-verif-piutang?noReg=" + $scope.dataPasienSelected.noRegistrasi, false).then(function (res) {

          if (res.data.noverif != undefined) {
            alert("Sudah dalam penagihan piutang, tidak bisa di Verifikasi!")
            return;
          }
          //POSTING JURNAL
          var tglAwal = moment($scope.item.tanggalRegistrasiAwal).format('YYYY-MM-DD HH:mm');
          var tglAkhir = moment($scope.item.tanggalRegistrasiAkhir).format('YYYY-MM-DD HH:mm');;
          $scope.changePage("VerifikasiTagihan");
        })
      }

      $scope.KelengkapanDokumen = function () {
        $scope.changePage("KelengkapanDokumenTataRekening");
      }

      $scope.UbahJenisPasien = function () {
        if ($scope.dataPasienSelected.status == "Verifikasi" || $scope.dataPasienSelected.status == "-") {
          $scope.changePage("FormUbahJenisPasien");
        }
        else {
          var alertDialog = medifirstService.showAlertDialog("Status Harus Verfikasi", "", "Ok", "");
          $mdDialog.show(alertDialog).then(function () {
          });
        }
      }

      $scope.Perbaharui = function () {
        $scope.ClearSearch();
      }

      $scope.Detail = function () {

        var tglAwal = moment($scope.item.tanggalRegistrasiAwal).format('YYYY-MM-DD HH:mm');
        var tglAkhir = moment($scope.item.tanggalRegistrasiAkhir).format('YYYY-MM-DD HH:mm');;
        //POSTING JURNAL
        var objSave = {
          tglAwal: tglAwal,
          tglAkhir: tglAkhir
        }
        medifirstService.post('sysadmin/general/save-jurnal-verifikasi_tarek', objSave).then(function (e) { })
        var objSave = {
          noregistrasi: $scope.dataPasienSelected.noRegistrasi
        }
        medifirstService.post('sysadmin/general/save-jurnal-pelayananpasien_t', objSave).then(function (e) { })
        $scope.changePage("RincianTagihan");
      }

      $scope.changePage = function (stateName) {

        if ($scope.dataPasienSelected.noRegistrasi != undefined) {

          var obj = {
            noRegistrasi: $scope.dataPasienSelected.noRegistrasi
          }

          $state.go(stateName, {
            dataPasien: JSON.stringify(obj)
          });
        }
        else {
          alert("Silahkan pilih data pasien terlebih dahulu");
        }
      }

      function checkValue(obj, param) {
        var res = "";
        var data = undefined;

        if (param.length > 1) {
          if (obj[param[0]] != undefined)
            data = obj[param[0]][param[1]];
        }
        else {
          data = obj[param[0]];
        }

        if (data != undefined)
          var res = data;

        return res;
      }

      function isInt(value) {
        var er = /^-?[0-9]+$/;

        return er.test(value);
      }

      LoadData()
      $scope.ClearSearch = function () {
        $scope.item = {};
        $scope.item.ruangan = {};
        $scope.item.tanggalRegistrasiAwal = new Date(moment($scope.now).format('YYYY-MM-DD 00:00'));
        $scope.item.tanggalRegistrasiAkhir = new Date(moment($scope.now).format('YYYY-MM-DD 23:59'))
        $scope.SearchData();
      }

      $scope.SearchData = function () {
        LoadData()
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

      function LoadData() {
        $scope.isRouteLoading = true;
        var tglAwal = moment($scope.item.tanggalRegistrasiAwal).format('YYYY-MM-DD HH:mm');
        var tglAkhir = moment($scope.item.tanggalRegistrasiAkhir).format('YYYY-MM-DD HH:mm');;
        //debugger;

        var tempNamaOrReg = "";
        if ($scope.item.namaOrReg != undefined) {
          tempNamaOrReg = $scope.item.namaOrReg;
        }

        var tempNoReg = "";
        if ($scope.item.noReg != undefined) {
          tempNoReg = $scope.item.noReg;
        }

        var tempRuanganId = "";
        var tempRuanganIdArr = {};
        if ($scope.item.ruangan != undefined) {
          tempRuanganId = $scope.item.ruangan.id;
          tempRuanganIdArr = { id: $scope.item.ruangan.id, ruangan: $scope.item.ruangan.ruangan }
        }

        var tempStatus = "";
        var tempStatusArr = {};
        if ($scope.item.status != undefined) {
          tempStatus = $scope.item.status.namaExternal;
          tempStatusArr = { id: $scope.item.status.id, namaExternal: $scope.item.status.namaExternal }
        }

        var tempInstalasiId = "";
        var tempInstalasiIdArr = {};
        if ($scope.item.instalasi != undefined) {
          tempInstalasiId = $scope.item.instalasi.id;
          tempInstalasiIdArr = { id: $scope.item.instalasi.id, departemen: $scope.item.instalasi.departemen }
        }
        var tempNoRm = "";
        if ($scope.item.noRm != undefined) {
          tempNoRm = $scope.item.noRm;
        }
        var jmlRow = ""
        if ($scope.item.jmlRows != undefined) {
          jmlRow = $scope.item.jmlRows
        }
        var kelompokPasienId = ""
        if ($scope.item.kelompokpasien != undefined) {
          kelompokPasienId = $scope.item.kelompokpasien.id
        }

        // var chacePeriode = tglAwal + ":" + tglAkhir + ":" + tempStatus + ":" + tempNamaOrReg 
        //                    + ":" + tempNoReg + ":" + tempRuanganId  + ":" + tempInstalasiId;
        var chacePeriode = {
          0: tglAwal,
          1: tglAkhir,
          2: tempStatusArr,
          3: tempNamaOrReg,
          4: tempNoReg,
          5: tempRuanganIdArr,
          6: tempInstalasiIdArr,
          7: tempNoRm,
          8: jmlRow
        }
        cacheHelper.set('DaftarPasienPulangCtrl', chacePeriode);


        medifirstService.get("tatarekening/daftar-pasien-pulang?"
          + "namaPasien=" + tempNamaOrReg
          + "&ruanganId=" + tempRuanganId
          + "&status=" + tempStatus
          + "&tglAwal=" + tglAwal
          + "&tglAkhir=" + tglAkhir
          + "&noReg=" + tempNoReg
          + "&instalasiId=" + tempInstalasiId
          + "&noRm=" + tempNoRm
          + "&jmlRows=" + jmlRow
          + "&kelompokPasienId=" + kelompokPasienId)
          .then(function (data) {
            $scope.showBtnBayar = false
            $scope.isRouteLoading = false;
            var data = data.data
            $scope.dataPasienPulang = new kendo.data.DataSource({
              data: data,
              pageSize: 200,
              total: data.length,
              serverPaging: false,
              schema: {
                model: {
                  fields: {
                  }
                }
              }
            });
          });

        //POSTING JURNAL
        var tglAwal = moment($scope.item.tanggalRegistrasiAwal).format('YYYY-MM-DD HH:mm');
        var tglAkhir = moment($scope.item.tanggalRegistrasiAkhir).format('YYYY-MM-DD HH:mm');;
        // var objSave ={
        //   tglAwal:tglAwal,
        //   tglAkhir:tglAkhir
        // }
        // manageTataRekening.postJurnalAkuntansi(objSave).then(function(data){
        // })

      };
      $scope.BayarTagihan = function () {

        var obj = {
          noRegistrasi: $scope.norecSpLast
        }

        $state.go("PembayaranTagihanLayananKasir", {
          dataPasien: JSON.stringify(obj)
        });
      }
      $scope.closingTagihan = function () {
        if ($scope.dataPasienSelected == undefined) {
          toastr.error('Pilih data dulu')
          return
        }
        if ($scope.dataPasienSelected.status == 'Belum Verifikasi') {
          toastr.error('Pasien belum diverifikasi')
          return
        }
        if ($scope.listBelumBayar != undefined) {
          toastr.error('Pasien harus melunasi tagihan terlebih dahulu ')
          return
        }


        var confirm = $mdDialog.confirm()
          .title('Informasi')
          .textContent('Selesai Periksa akan menutup / closing Pemeriksaan pasien, Lanjut simpan ?')
          .cancel('Tidak')
          .ok('Ya')
        $mdDialog.show(confirm).then(function () {
          var json = {
            'noregistrasi': $scope.dataPasienSelected.noRegistrasi,
            'close': true
          }
          medifirstService.post('tatarekening/save-selesai-transaksi', json).then(function (e) { })
        })
      }
      $scope.batalClosing = function () {
        if ($scope.dataPasienSelected == undefined) {
          toastr.error('Pilih data dulu')
          return
        }
        var json = {
          'noregistrasi': $scope.dataPasienSelected.noRegistrasi,
          'close': false
        }
        medifirstService.post('tatarekening/save-selesai-transaksi', json).then(function (e) { })
      }

      $scope.rekapTagihan = function () {
        if ($scope.dataPasienSelected == undefined) {
          toastr.error('Pilih data dulu')
          return
        }
        var obj = {
          noRegistrasi: $scope.dataPasienSelected.noRegistrasi
        }

        $state.go('RekapTagihan', {
          dataPasien: JSON.stringify(obj)
        });
      }

      $scope.formatRupiah = function (value, currency) {
        return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
      }

      $scope.columnGrid = [
        {
          "field": "no",
          "title": "No",
          "width": "45px",
        },
        {
          "field": "tglstruk",
          "title": "Tgl Struk",
          "width": "80px",
          "template": "<span class='style-right'>{{formatTanggal('#: tglstruk #', '')}}</span>"
        },
        {
          "field": "nostruk",
          "title": "No Verifikasi",
          "width": "80px"
        },
        {
          "field": "petugasverif",
          "title": "Petugas Verifikasi",
          "width": "120px"
        },
        {
          "field": "totalharusdibayar",
          "title": "Total Harus Bayar",
          "width": "110px",
          "template": "<span class='style-right'>{{formatRupiah('#: totalharusdibayar #', 'Rp.')}}</span>",
        },
        {
          "field": "status",
          "title": "Status Bayar",
          "width": "100px",
        }
      ];

      $scope.data2 = function (dataItem) {
        for (var i = 0; i < dataItem.details.length; i++) {
          dataItem.details[i].no = i + 1
        }
        return {
          dataSource: new kendo.data.DataSource({
            data: dataItem.details
          }),
          columns: [
            {
              "field": "no",
              "title": "No",
              "width": "45px",
            },
            {
              "field": "tglsbm",
              "title": "Tgl Bayar",
              "width": "80px",
              "template": "<span class='style-right'>{{formatTanggal('#: tglsbm #', '')}}</span>"
            },
            {
              "field": "nosbm",
              "title": "No Bukti Pembayaran",
              "width": "120px",
            },
            {
              "field": "carabayar",
              "title": "Cara Bayar",
              "width": "100px",
            },
            {
              "field": "totaldibayar",
              "title": "Total Bayar",
              "width": "100px",
              "template": "<span class='style-right'>{{formatRupiah('#: totaldibayar #', 'Rp.')}}</span>",
            },
            {
              "field": "kasir",
              "title": "Petugas Kasir",
              "width": "120px"
            }
          ]
        }
      };

      function LoadDataDetailVerif() {
        var NoReg = ''
        if ($scope.NoregDetail != undefined) {
          NoReg = $scope.NoregDetail
        }
        medifirstService.get("tatarekening/get-data-detail-verifikasi?noRegistrasi=" + NoReg).then(function (data) {
          $scope.isRouteLoading = false;
          var data = data.data.data
          for (let i = 0; i < data.length; i++) {
            const element = data[i];
            element.no = i + 1;
          }
          $scope.dataGrid = new kendo.data.DataSource({
            data: data,
            pageSize: 200,
            total: data.length,
            serverPaging: false,
            schema: {
              model: {
                fields: {
                }
              }
            }
          });

        });
      }

      $scope.DetailVerif = function () {
        if ($scope.dataPasienSelected == undefined) {
          toastr.error('Pilih data dulu')
          return
        }
        $scope.NoregDetail = $scope.dataPasienSelected.noRegistrasi;
        $scope.dataGrid = new kendo.data.DataSource({
          data: [],
        });
        LoadDataDetailVerif();
        $scope.detailVerifikasi.center().open();
      }

      $scope.klikGrid = function (dataSelected) {
        if (dataSelected != undefined) {
          $scope.dataSelected = dataSelected
        }
      }

      $scope.Batal = function () {
        $scope.dataGrid = new kendo.data.DataSource({
          data: [],
        });
        $scope.detailVerifikasi.close();
      }


      $scope.unVerifikasi = function () {
        if ($scope.dataSelected == undefined) {
          toastr.error('Pilih data dulu')
          return
        }

        if ($scope.dataSelected.noverifikasi != undefined) {
          toastr.error('Sudah dalam penagihan piutang, tidak bisa di Unverifikasi!')
          return
        }

        if ($scope.dataSelected.nosbmlastfk != undefined) {
          toastr.error('Data Sudah Dibayar, tidak bisa di Unverifikasi!')
          return
        }

        var objSave = {
          'noregistrasi': $scope.dataSelected.noregistrasi,
          'norec_sp': $scope.dataSelected.norec
        }

        medifirstService.post('tatarekening/batal-verifikasi-tagihan', objSave).then(function (data) {
          var datas = data.data.data[0];
          $scope.NoregDetail = datas.noregistrasi;
          medifirstService.postLogging('Unverifikasi TataRekening', 'norec strukpelayanan_t', datas.norec,
            'Unverifikasi TataRekening Pada Pasien Dengan Noregistrasi : ' + datas.noregistrasi + ' dengan No Verifikasi : ' + datas.nostruk).then(function (res) {
              LoadDataDetailVerif();
            })
        })
      }

      $scope.saveLogUnverif = function () {
        var objSave = {
          "noregistrasi": $scope.dataPasienSelected.noRegistrasi
        }
        medifirstService.post('tatarekening/save-log-unverifikasi-tarek', objSave).then(function (e) { })
      }


      $scope.mainGroupOptionsDaftarPasienPulang = {
        toolbar: [
          "excel"
        ],
        excel: {
          fileName: "Daftar Pasien Pulang.xlsx",
          allPages: true,
        },
        excelExport: function (e) {
          var sheet = e.workbook.sheets[0];
          sheet.name = "Orders";
          sheet.mergedCells = ["A1:H1"];

          var myHeaders = [{
            value: "Daftar Pasien Pulang",
            fontSize: 20,
            textAlign: "center",
            background: "#ffffff",
            // color:"#ffffff"
          }];

          sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
        },
        pageable: {
          // pageSize: 5,
          // previousNext: false,
          messages: {
            display: "Showing {0} - {1} from {2} data items",
          },
        },
        columns: $scope.columnPasienPulang,
        // dataSource:$scope.dataSourceLaporanLayanan,            
        selectable: true,
        refresh: true,
        scrollable: false,
        // dataSource: $scope.dataSourceLaporanLayanan2,
        sortable: {
          mode: "single",
          allowUnsort: false,
          showIndexes: true,
        },
      };

      $scope.SuratKeteranganKematian = function () {
        $scope.hideExper = false;
        var user = medifirstService.getPegawaiLogin().namaLengkap
        if ($scope.dataPasienSelected == undefined) {
          toastr.error('Pilih data dulu!')
          return
        }

        if ($scope.dataPasienSelected.tglmeninggal == undefined) {
          toastr.error('Pilih Pasien Dengan Status Meninggal!')
          return
        }
        medifirstService.get("tatarekening/get-nosuratketerangakematian-pasien?norec_pd="
          + $scope.dataPasienSelected.noRegistrasi).then(function (data) {
            var datas = data.data.data[0].nosuratkematian;
            if (datas != undefined) {
              $scope.item.NomorSurat = datas;
            }
            
            $scope.popupSuratKeteranganKematian.center().open();
          });
      }

      $scope.batalNoSurat = function () {
        $scope.item.NomorSurat = $scope.noSuratKeteranganKematian;
        $scope.popupSuratKeteranganKematian.close();
      }

      $scope.saveNoSurat = function () {
        if ($scope.dataPasienSelected == undefined) {
          toastr.error('Pilih data dulu!')
          return
        }

        if ($scope.item.NomorSurat == $scope.noSuratKeteranganKematian) {
          toastr.error("Tanda (_) Pada No Surat Belum Diisi!!!")
          return;
        }

        var objSave = {
          'nosurat': $scope.item.NomorSurat,
          'noregistrasi': $scope.dataPasienSelected.noRegistrasi
        }

        $scope.hideExper = true
        medifirstService.post('tatarekening/save-nosuratketerangakematian-pasien', objSave).then(function (e) {
          loadData();
        }, function (error) {
          $scope.hideExper = false
        })
      }

      $scope.hapusSurat = function () {
        if ($scope.dataPasienSelected == undefined) {
          toastr.error('Pilih data dulu!')
          return
        }

        if ($scope.item.NoSuratKematian == $scope.noSuratKeteranganKematian) {
          toastr.error("Tanda (_) Pada No Surat Belum Diisi!!!")
          return;
        }

        var objSave = {
          'nosurat': $scope.item.NomorSurat,
          'noregistrasi': $scope.dataPasienSelected.noRegistrasi
        }

        medifirstService.post('tatarekening/delete-nosuratketerangakematian-pasien', objSave).then(function (e) {
          $scope.item.NomorSurat = $scope.noSuratKeteranganKematian;
          $scope.popupSuratKeteranganKematian.close();
          LoadData();
        });
      }

      $scope.cetakSuratKeteranganKematian = function () {
        var user = medifirstService.getPegawaiLogin().namaLengkap
        if ($scope.dataPasienSelected == undefined) {
          toastr.error('Pilih data dulu!')
          return
        }

        if ($scope.item.NomorSurat == $scope.noSuratKeteranganKematian) {
          toastr.error("Tanda (_) Pada No Surat Belum Diisi!!!")
          return;
        }
        var stt = 'false'
        if (confirm('View Surat Keterangan Meninggal? ')) {
          // Save it!
          stt = 'true';
        } else {
          // Do nothing!
          stt = 'false'
        }
        var client = new HttpClient();
        client.get('http://127.0.0.1:1237/printvb/jenazah?cetak-surat-keterangan-meninggal=1&noregistrasi=' + $scope.dataPasienSelected.noRegistrasi + '&strIdPegawai=' + user + '&STD=&view=' + stt, function (response) {
          // aadc=response;
        });
      }

      $scope.SuratPelimpahan = function () {
        $scope.hideExpers = false;
        if ($scope.dataPasienSelected == undefined) {
          toastr.error('Pilih data dulu!')
          return
        }
        medifirstService.get("tatarekening/get-datasuratpelimpahanjenazah?norec_pd="
          + $scope.dataPasienSelected.norec_pd).then(function (data) {
            var datas = data.data.data[0]           
            if (datas != undefined) {
              $scope.norecPelimpahan = datas.norec;
              $scope.item.pegawaiSatu = {id:datas.petugasruanganfk,namalengkap:datas.namapetugas};
              $scope.item.Umur = datas.umur;
              $scope.item.Jabatan = {id:datas.jabatanfk,namajabatan:datas.namajabatan};
              $scope.item.pegawaiDua = {id:datas.petugasjenazahfk,namalengkap:datas.namapetugasjenazah};
              $scope.item.penanggungJawab = datas.penanggungjawab;
              $scope.item.NoIdentitas = datas.noidentitas;
              $scope.item.jenisKelamin = {id:datas.objectjeniskelaminfk,jeniskelamin:datas.jeniskelamin};;
              $scope.item.hubunganKeluarga = {id:datas.objecthubungankeluargafk,hubungankeluarga:datas.hubungankeluarga};

            }
            
            $scope.popupPelimpahan.center().open();
          });
        
      }

      function batalPelimpahan() {
        $scope.item.pegawaiSatu = undefined;
        $scope.item.Umur = undefined;
        $scope.item.Jabatan = undefined;
        $scope.item.pegawaiDua = undefined;
        $scope.item.penanggungJawab = undefined;
        $scope.item.NoIdentitas = undefined;
        $scope.item.jenisKelamin = undefined;
        $scope.item.hubunganKeluarga = undefined;
        $scope.popupPelimpahan.close();
      }

      $scope.batalNoSuratPelimpahan = function () {
        batalPelimpahan();
      }

      $scope.saveSuratPelimpahan = function () {
        if ($scope.dataPasienSelected == undefined) {
          toastr.error('Pilih data dulu!')
          return
        }

        if ($scope.dataPasienSelected.nosuratkematian == undefined) {
          toastr.error('Pasien Belum Memiliki Nomor Surat Keterangan Kematian!')
          return
        }
        var objSave = {
          'norec': $scope.norecPelimpahan,
          'nosurat': $scope.dataPasienSelected.nosuratkematian,
          'pasiendaftarfk': $scope.dataPasienSelected.norec_pd,
          'noregistrasi' : $scope.dataPasienSelected.noRegistrasi,
          'petugasruanganfk': $scope.item.pegawaiSatu != undefined ? $scope.item.pegawaiSatu.id : null,
          'jabatanfk': $scope.item.Jabatan != undefined ? $scope.item.Jabatan.id : null,
          'umur': $scope.item.Umur != undefined ? $scope.item.Umur : null,
          'petugasjenazahfk': $scope.item.pegawaiDua != undefined ? $scope.item.pegawaiDua.id : null,
          'penanggungjawab': $scope.item.penanggungJawab != undefined ? $scope.item.penanggungJawab : null,
          'objectjeniskelaminfk': $scope.item.jenisKelamin != undefined ? $scope.item.jenisKelamin.id : null,
          'objecthubungankeluargafk': $scope.item.hubunganKeluarga != undefined ? $scope.item.hubunganKeluarga.id : null,
          'noidentitas': $scope.item.NoIdentitas != undefined ? $scope.item.NoIdentitas : null
        }

        $scope.hideExper = true
        medifirstService.post('tatarekening/save-suratpelimpahanjenazah-pasien', objSave).then(function (e) {
          loadData();
        }, function (error) {
          $scope.hideExper = false
        })

      }

      $scope.hapusSuratPelimpahan = function () {
        if ($scope.dataPasienSelected == undefined) {
          toastr.error('Pilih data dulu!')
          return
        }

        if ($scope.norecPelimpahan == '') {
          toastr.error('Data Tidak Ditemukan!')
          return
        }
        var objSave = {
          'norec': $scope.norecPelimpahan,
          'pasiendaftarfk': $scope.dataPasienSelected.norec_pd,
        }
        medifirstService.post('tatarekening/delete-suratpelimpahanjenazah-pasien', objSave).then(function (e) {
            batalPelimpahan();
            LoadData();
        });
      }

      $scope.cetakSuratPelimpahan = function () {
        var user = medifirstService.getPegawaiLogin().namaLengkap
        if ($scope.dataPasienSelected == undefined) {
          toastr.error('Pilih data dulu!')
          return
        }       
        var stt = 'false'
        if (confirm('View Surat Pelimpahan Ke Ruangan Jenazah? ')) {
          // Save it!
          stt = 'true';
        } else {
          // Do nothing!
          stt = 'false'
        }
        var client = new HttpClient();
        client.get('http://127.0.0.1:1237/printvb/jenazah?cetak-surat-serah-terima-jenazah=1&noregistrasi=' + $scope.dataPasienSelected.noRegistrasi + '&strIdPegawai=' + user + '&STD=&view=' + stt, function (response) {
          // aadc=response;
        });
      }

      //** BATAS SUCI */
    }
  ]);
});