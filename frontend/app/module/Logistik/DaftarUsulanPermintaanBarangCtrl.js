define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict';
    initialize.controller('DaftarUsulanPermintaanBarangCtrl', ['$scope', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($scope, $state, cacheHelper, dateHelper, medifirstService) {
            $scope.item = {};
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.isRouteLoading = false;
            var pegawaiUser = {}
            var idpegawai;
            $scope.item.tglAwal = moment($scope.now).format('YYYY-MM-DD 00:00');
            $scope.item.tglAkhir = moment($scope.now).format('YYYY-MM-DD 23:59');
            var baseTransaksi = configuration.baseApiBackend;
            var profile = JSON.parse(localStorage.getItem('profile'))
            LoadCache();
            loadCombo();
            let detailExportPromises = [];
            function LoadCache() {
                var chacePeriode = cacheHelper.get('DaftarPermintaanBarangCtrl');
                if (chacePeriode != undefined) {
                    $scope.item.tglAwal = new Date(chacePeriode[0]);
                    $scope.item.tglAkhir = new Date(chacePeriode[1]);
                    init();
                } else {
                    $scope.item.tglAwal = moment($scope.now).format('YYYY-MM-DD 00:00');
                    $scope.item.tglAkhir = moment($scope.now).format('YYYY-MM-DD 23:59');
                    init();
                }
            }
            function loadCombo() {
                medifirstService.getPart("logistik/get-combo-barang-logistik", true, true, 20).then(function (data) {
                    $scope.listNamaBarang = data;
                });
                medifirstService.get("logistik/get-combo-logistik", true).then(function (dat) {
                    pegawaiUser = parseFloat(dat.data.detaillogin[0].objectkelompokuserfk);
                    idpegawai = dat.data.detaillogin[0].id;
                    $scope.listrekanan=dat.data.rekanan;
                    // if (pegawaiUser == 25) {
                    //     $scope.tombol1 = true;
                    //     $scope.tombol = false;
                    //     $scope.tombol2 = false;
                    // } else if (pegawaiUser == 34) {
                    //     $scope.tombol1 = false;
                    //     $scope.tombol = false;
                    //     $scope.tombol2 = true;
                    // }
                    // else {
                    //     $scope.tombol1 = false;
                    //     $scope.tombol = true;
                    //     $scope.tombol2 = false;
                    // }
                });
            }
            $scope.Tambah = function () {
                $state.go('UsulanPermintaanBarangJasaRuangan')
            }
            function init() {
                $scope.isRouteLoading = true;
                var ins = ""
                if ($scope.item.instalasi != undefined) {
                    var ins = "&dpid=" + $scope.item.instalasi.id
                }
                var rg = ""
                if ($scope.item.ruangan != undefined) {
                    var rg = "&ruid=" + $scope.item.ruangan.id
                }
                var produkfk = ""
                if ($scope.item.namaBarang != undefined) {
                    var produkfk = "&produkfk=" + $scope.item.namaBarang.id
                }

                var rekanan = ""
                if ($scope.item.namasuplier != undefined) {
                    var rekanan = "&namarekanan=" + $scope.item.namasuplier.namarekanan
                }

                var noorder = ""
                if ($scope.item.nousulan != undefined) {
                    var noorder = "&noorder=" + $scope.item.nousulan
                }
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                medifirstService.get("logistik/get-daftar-usulan-permintaan-barang-ruangan?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    "&nostruk=" + $scope.item.struk +
                    "&nofaktur=" + $scope.item.nofaktur 
                    + noorder
                    + rekanan
                    + produkfk
                    , true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        var data = dat.data.daftar;
                        for (var i = 0; i < dat.data.daftar.length; i++) {
                            dat.data.daftar[i].no = i + 1
                        }
                        $scope.dataGrid = dat.data.daftar;
                        pegawaiUser = dat.data.datalogin
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
                cacheHelper.set('DaftarPermintaanBarangCtrl', chacePeriode);
            }
            $scope.getRuangan = function () {
                $scope.listRuangan = $scope.item.instalasi.ruangan;
            }
            $scope.cariFilter = function () {

                init();
            }

            $scope.newUPK = function () {
                var chacePeriode = {
                    0: $scope.dataSelected.norec,
                    1: 'EditTerima',
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }
                cacheHelper.set('UsulanPelaksanaanKegiatanCtrl', chacePeriode);
                $state.go('UsulanPelaksanaanKegiatan')
            }

            $scope.BatalUsulan = function () {
                if ($scope.dataSelected == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                }

                if ($scope.dataSelected.status != 0) {
                    alert("Po Sudah di terima. \n Tidak bisa dibatalkan!!");
                    return;
                } 

                if ($scope.dataSelected.noverifikasi != undefined || $scope.dataSelected.nokonfirmasi != undefined || $scope.dataSelected.nokonfirmasidk != undefined) {
                    alert("Data Sudah Diverifikasi!")
                    return;
                }

                var data =
                {
                    nousulan: $scope.dataSelected.nousulan,
                    norec: $scope.dataSelected.norec,
                    tglbatal: moment($scope.now).format('YYYY-MM-DD HH:mm:ss')
                }

                var objSave = {
                    data: data,
                }

                medifirstService.post('logistik/delete-data-usulan-ruangan',objSave).then(function (e) {
                      //##save Logging user
                      medifirstService.get("sysadmin/logging/save-log-hapus-usulan?norec_order="
                      + $scope.dataSelected.norec

                  ).then(function (data) {
                  })
                  //##end 
                    init()
                })
            }            

            $scope.CetakRincian = function () {
                var stt = 'false'
                if (confirm('View resep? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/logistik?cetak-rincian-penerimaan=1&nores=' + $scope.dataSelected.norec + '&view=' + stt + '&user=' + pegawaiUser.userData.namauser, function (response) {
                    //aadc=response;
                });
            }
            $scope.CetakBuktiLayanan = function () {
                var stt = 'false'
                if (confirm('View Bukti Penerimaan? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/logistik?cetak-usulanpelaksanaankegiatan=1&nores=' + $scope.dataSelected.norec + '&view=' + stt, function (response) {
                    //aadc=response;
                });
            }
            $scope.Cetak = function () {
                // var stt = 'false'
                // if (confirm('View Bukti Usulan? ')) {
                //     // Save it!
                //     stt = 'true';
                // } else {
                //     // Do nothing!
                //     stt = 'false'
                // }
                // var client = new HttpClient();
                // client.get('http://127.0.0.1:1237/printvb/logistik?cetak-usulanpermintaanbarang=1&nores=' + $scope.dataSelected.norec + '&view=' + stt, function (response) {
                //     //aadc=response;
                // });
                window.open(baseTransaksi + "report/cetak-bukti-usulan-barang?norec=" + $scope.dataSelected.norec + "&kdprofile=" + profile.id);
            }

            $scope.Closing = function(){
                if ($scope.dataSelected.status != 2) {
					var stt = 'true';
					if (confirm('Yakin PO akan ditutup ? ')) {
						stt = 'true';
					} else {
						// Do nothing!
						stt = 'false'
					}
					if (stt == 'true') {
						
                        var objSave = {
                            nousulan: $scope.dataSelected.nousulan,
                            norec: $scope.dataSelected.norec,
                           
                        }
        
                        medifirstService.post('logistik/Closing-data-usulan-ruangan',objSave).then(function (e) {
                              //##save Logging user
                        //       medifirstService.get("sysadmin/logging/save-log-hapus-usulan?norec_order="
                        //       + $scope.dataSelected.norec
        
                        //   ).then(function (data) {
                        //   })
                          //##end 
                            init()
                        })
					}
				} else {
					alert('PO Sudah di Tutup!')
				}
            }  
            
            $scope.EditTerima = function () {
                if ($scope.dataSelected.status == 2) {
                    alert("Po Sudah di Closing. \n Tidak bisa diubah!!");
                    return;
                } 
                if ($scope.dataSelected.noverifikasi) {
                    alert("Data Sudah Diverifikasi!!")
                    return;
                }

             
                var chacePeriode = {
                    0: $scope.dataSelected.norec,
                    1: 'EditTerima',
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }
                cacheHelper.set('UsulanPermintaanBarangJasaRuanganCtrl', chacePeriode);
                $state.go('UsulanPermintaanBarangJasaRuangan')
            }
            

            // $scope.tambah = function(){
            //  $state.go('Produk')
            // }
            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }


            $scope.columnGrid = {
                toolbar: [
					"excel",					
				  ],
				excel: {
					fileName: "Daftar Purchase Order.xlsx",
					allPages: true,
				},
				excelExport: function (e) {
                    e.preventDefault();

                    var workbook = e.workbook;
              
                    detailExportPromises = [];
              
                    var masterData = e.data;
              
                    for (var rowIndex = 0; rowIndex < masterData.length; rowIndex++) {
                      exportChildData(masterData[rowIndex].norec, rowIndex);
                    }
              
                    $.when.apply(null, detailExportPromises)
                    .then(function() {
                      // Get the export results.
                      var detailExports = $.makeArray(arguments);
              
                      // Sort by masterRowIndex.
                      detailExports.sort(function(a, b) {
                        return a.masterRowIndex - b.masterRowIndex;
                      });
              
                      // Add an empty column.
                      workbook.sheets[0].columns.unshift({
                        width: 30
                      });
              
                      // Prepend an empty cell to each row.
                      for (var i = 0; i < workbook.sheets[0].rows.length; i++) {
                        workbook.sheets[0].rows[i].cells.unshift({});
                      }
              
                      // Merge the detail export sheet rows with the master sheet rows.
                      // Loop backwards so the masterRowIndex does not need to be updated.
                      for (var i = detailExports.length - 1; i >= 0; i--) {
                        var masterRowIndex = detailExports[i].masterRowIndex + 1; // compensate for the header row
              
                        var sheet = detailExports[i].sheet;
              
                        // Prepend an empty cell to each row.
                        for (var ci = 0; ci < sheet.rows.length; ci++) {
                          if (sheet.rows[ci].cells[0].value) {
                            sheet.rows[ci].cells.unshift({});
                          }
                        }
              
                        // Insert the detail sheet rows after the master row.
                        [].splice.apply(workbook.sheets[0].rows, [masterRowIndex + 1, 0].concat(sheet.rows));
                      }
              
                      // Save the workbook.
                      kendo.saveAs({
                        dataURI: new kendo.ooxml.Workbook(workbook).toDataURL(),
                        fileName: "Daftar Purchase Order.xlsx"
                      });
              
              
                    });


				  },
				sortable: true,
				pageable: true,
				selectable: "row",
                columns: [		
                {
                    "field": "no",
                    "title": "No",
                    "width": "40px",
                },
                {
                    "field": "tglorder",
                    "title": "Tgl PO",
                    "width": "100px",
                    "template": "<span class='style-right'>{{formatTanggal('#: tglorder #', '')}}</span>"
                },
                {
                    "field": "tglkebutuhan",
                    "title": "Tgl Kebutuhan",
                    "width": "100px",
                    "template": "<span class='style-right'>{{formatTanggal('#: tglkebutuhan #', '')}}</span>"
                },
                {
                    "field": "noorder",
                    "title": "No PO",
                    "width": "100px",
                },
                // {
                //     "field": "keterangan",
                //     "title": "Jenis Usulan",
                //     "width": "100px",
                // },
                {
                    "field": "koordinator",
                    "title": "Koordinator Barang",
                    "width": "120px",
                },
                {
                    "field": "supplier",
                    "title": "Supplier",
                    "width": "140px",
                },
                {
                    "field": "ruangan",
                    "title": "Unit Pengorder",
                    "width": "150px",
                },
                {
                    "field": "ruangantujuan",
                    "title": "Unit Tujuan",
                    "width": "150px",
                },
                {
                    "field": "penanggungjawab",
                    "title": "Penanggung Jawab",
                    "width": "100px",
                },
                {
                    "field": "mengetahui",
                    "title": "Mengetahui",
                    "width": "100px",
                },
                {
                    "field": "keterangan",
                    "title": "Keterangan",
                    "width": "180px",
                },
                {
                    "field": "statusket",
                    "title": "Status PO",
                    "width": "100px",
                },
                // {
                //     "field": "mengetahui",
                //     "title": "Mengetahui",
                //     "width": "100px",
                // }
                // ,
                // {
                //     "field": "noverifikasi",
                //     "title": "No UPK",
                //     "width": "100px",
                // }
                // {
                //     "field": "tglverifikasi",
                //     "title": "Tgl Verifikasi",
                //     "width" : "100px",
                //     "template": "<span class='style-right'>{{formatTanggal('#: tglverifikasi #', '')}}</span>"
                // },
                // {
                //     "field": "nokonfirmasi",
                //     "title": "No Verif Anggaran",
                //     "width" : "100px",
                // },
                // {
                //     "field": "tglkonfirmasi",
                //     "title": "Tgl Verifikasi Anggaran",
                //     "width" : "100px",
                //     "template": "<span class='style-right'>{{formatTanggal('#: tglkonfirmasi #', '')}}</span>"
                // },
                // {
                //     "field": "nokonfirmasidk",
                //     "title": "No Verif Dk",
                //     "width" : "100px",
                // },
                // {
                //     "field": "tglkonfirmasidk",
                //     "title": "Tgl Verifikasi Dk",
                //     "width" : "100px",
                //     "template": "<span class='style-right'>{{formatTanggal('#: tglkonfirmasidk #', '')}}</span>"
                // }
                ]
            };
            $scope.data2 = function (dataItem) {
                return {
                    dataSource: new kendo.data.DataSource({
                        data: dataItem.details
                    }),
                    columns: [
                        {
                            "field": "tglkebutuhan",
                            "title": "Tgl Kebutuhan",
                            "width": "50px",
                            "template": "<span class='style-right'>{{formatTanggal('#: tglkebutuhan #', '')}}</span>"
                        },
                        {
                            "field": "prid",
                            "title": "Kode Produk",
                            "width": "40px",
                        },
                        {
                            "field": "namaproduk",
                            "title": "Nama Produk",
                            "width": "90px",
                        },
                        {
                            "field": "spesifikasi",
                            "title": "Spesifikasi",
                            "width": "120px",
                        },
                        {
                            "field": "satuanstandar",
                            "title": "Satuan",
                            "width": "80px",
                        },
                        {
                            "field": "qtyproduk",
                            "title": "Qty",
                            "width": "20px",
                        },
                        {
                            "field": "hargasatuan",
                            "title": "Harga Satuan",
                            "width": "40px",
                            "template": "<span class='style-right'>{{formatRupiah('#: hargasatuan #', '')}}</span>"
                        },
                        {
                            "field": "persendiskon",
                            "title": "Discount",
                            "width": "40px",
                            "template": "<span class='style-right'>#: persendiskon # %</span>"
                        },
                        {
                            "field": "hargappn",
                            "title": "PPn",
                            "width": "40px",
                            "template": "<span class='style-right'>{{formatRupiah('#: hargappn #', '')}}</span>"
                        },
                        {
                            "field": "total",
                            "title": "Total",
                            "width": "50px",
                            "template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>"
                        },
                        {
                            "field": "statusterima",
                            "title": "Status",
                            "width": "80px",
                        },
                    ]
                }
            };
            // $scope.mainGridOptions = { 
            //     pageable: true,
            //     columns: $scope.columnProduk,
            //     editable: "popup",
            //     selectable: "row",
            //     scrollable: false
            // };

            function exportChildData(norec, rowIndex) {
                var deferred = $.Deferred();
            
                detailExportPromises.push(deferred);
            
                var rows = [{
                  cells: [
                    // First cell.
                    { value: "tglkebutuhan" },
                    // Second cell.
                    { value: "prid" },
                    // Third cell.
                    { value: "namaproduk" },
                    // Fourth cell.
                    { value: "spesifikasi" },
                    // Fifth cell.
                    { value: "satuanstandar" },
                    { value: "qtyproduk" },
                    { value: "hargasatuan" },
                    { value: "persendiskon" },
                    { value: "total" }
                  ]
                }];
            
               // dataSource.filter({ field: "EmployeeID", operator: "eq", value: EmployeeID});
                let dataS = $scope.dataGrid.filter(function(el){
                    return el.norec == norec
                });
            //    dataS.filter()
            
                var exporter = new kendo.ExcelExporter({
                  columns: [{
                    field: "tglkebutuhan"
                  }, {
                    field: "prid"
                  }, {
                    field: "namaproduk"
                  }, {
                    field: "spesifikasi"
                  }, {
                    field: "satuanstandar"
                  }, {
                    field: "qtyproduk"
                  }, {
                    field: "hargasatuan"
                  },{
                    field: "persendiskon"
                  }, {
                    field: "total"
                  }
                
                ],
                  dataSource:  dataS[0].details
                });
            
                exporter.workbook().then(function(book, data) {
                  deferred.resolve({
                    masterRowIndex: rowIndex,
                    sheet: book.sheets[0]
                  });
                });
              }

            $scope.VerifikasiAnggaran = function () {
                debugger;
                if ($scope.dataSelected == undefined) {
                    alert("Pilih yg akan di dahulus!!")
                    return;
                }

                // if ($scope.dataSelected.noverifikasi != undefined) {
                //     alert("Data Belum DiVerifikasi Pengendali!!")
                //     return;
                // }

                var strukverifikasi = {
                    tglconfirm: moment($scope.now).format('YYYY-MM-DD HH:mm:ss'),
                    objectpegawaipjawabfk: idpegawai,
                    // objectruanganfk:$scope.item.ruanganTujuan.id,
                    norec: $scope.dataSelected.norec,
                    norecrealisasi: $scope.dataSelected.norecrealisasi
                }

                var objSave =
                {
                    strukverifikasi: strukverifikasi,
                }
                medifirstService.post('logistik/save-data-verifikasi',objSave).then(function (e) {
                    $scope.item.noKirim = e.data.nokirim
                });
            }

            // $scope.VerifikasiDK = function () {            
            //     if ($scope.dataSelected == undefined) {
            //         alert("Pilih yg akan di hapus!!")
            //         return;
            //     }

            //     if ($scope.dataSelected.nokonfirmasi == undefined) {
            //         alert("Data Belum DiVerifikasi anggaran!!")
            //         return;
            //     }

            //     if ($scope.dataSelected.noverifikasi == undefined) {
            //         alert("Data Belum Dibuat UPK!!")
            //         return;
            //     }

            //     var strukverifikasi = {
            //         tglconfirm: moment($scope.now).format('YYYY-MM-DD HH:mm:ss'),
            //         objectpegawaipjawabfk: idpegawai,
            //         // objectruanganfk:$scope.item.ruanganTujuan.id,
            //         norec: $scope.dataSelected.norec,
            //         norecrealisasi: $scope.dataSelected.norecrealisasi
            //     }

            //     var objSave =
            //     {
            //         strukverifikasi: strukverifikasi,
            //     }
            //     manageLogistikPhp.saveverifdk(objSave).then(function (e) {
            //         $scope.item.noKirim = e.data.nokirim
            //     });
            // }

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }
            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD/MM/YYYY');
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

            $scope.Penerimaan = function() {
                if ($scope.dataSelected.status == 2) {
                    alert("Po Sudah di Tutup!!");
                    return;
                } 
               var chacePeriode = {
                    0: '',
                    1: 'PO',
                    2: $scope.dataSelected.norec,
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }
                cacheHelper.set('PenerimaanBarangSuplierCtrl', chacePeriode);
                $state.go('PenerimaanBarangSuplier', {
                    norec: $scope.dataSelected.norec,
                    noOrder: 'PO'
                });
            }
            $scope.kirimLink = function(){
                if($scope.dataSelected==undefined){
                    toastr.error('Pilih data dulu')
                    return
                }
                var authorization = ""
                var arr = document.cookie.split(';')
                for (var i = 0; i < arr.length; i++) {
                    var element = arr[i].split('=');
                    if (element[0].indexOf('authorization') > -1) {
                        authorization = element[1];
                    }
                }
                authorization = authorization.split('.')
                let profile = medifirstService.getProfile().id
                var key =  window.btoa(profile.namalengkap+'transmedic' ); // returns "bXktbmFtZS0x
                let linkQR = window.location.origin+'/ext-app/#/purchase-order/'+$scope.dataSelected.norec
                
                +'?key='+key
                +'&kdprofile='+profile
                $scope.link =linkQR

                // +'&token='+authorization[0]
                 let qrcodeContainer = document.getElementById("qrcode");
                 qrcodeContainer.innerHTML = "";
                // console.log(linkQR)
                $scope.popUpQR.center().open()
                 new QRCode(qrcodeContainer, {
                    text: linkQR ,
                    width: 180,
                    height: 180,
                    colorDark : "#000000",
                    colorLight : "#ffffff",
                    correctLevel : QRCode.CorrectLevel.H
                });
            }
            $scope.openLink = function(){
               window.open( $scope.link);
            }
            $scope.copyQR = function () {
                var imageURL = document.querySelector('#qrcode img').getAttribute("src");
                $('#qrcode img').addClass('image-class');
                var imageElem = document.querySelector('.image-class');
                var range = document.createRange();
                range.selectNode(imageElem);
                window.getSelection().addRange(range);

                try {
                    // Now that we've selected the anchor text, execute the copy command  
                    var successful = document.execCommand('copy');
                    var msg = successful ? 'Sukses' : 'Gagal';
                    toastr.info('Copy QRcode ' + msg);
                } catch (err) {
                    toastr.error('Oops, unable to copy');
                }

                // Remove the selections - NOTE: Should use
                // removeRange(range) when it is supported  
                window.getSelection().removeAllRanges();

            }

            //***********************************
        }
    ]);
});
