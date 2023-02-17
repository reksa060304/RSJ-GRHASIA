define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('DaftarPiutangBPJSCtrl', ['$state', '$q', '$scope', 'CacheHelper', '$mdDialog', 'MedifirstService',
		function ($state, $q, $scope, cacheHelper, $mdDialog, medifirstService) {
			$scope.now = new Date();
			$scope.item = {};
			$scope.isRouteLoading = false;
			$scope.dataPasienSelected = {};
			$scope.listStatus = [
				{ id: 1, namaExternal: "Klaim" },
				{ id: 2, namaExternal: "Tidak Klaim" }
			];

			$scope.listJenisPelayanan = [
				{ id: 1, nama: "Rawat Jalan" },
				{ id: 2, nama: "Rawat Inap" }
			];
			$scope.item.status = $scope.listStatus[0];
			$scope.item.awalPeriode = $scope.now;
			$scope.item.akhirPeriode = $scope.now;
			$scope.cboDefault = true;
			$scope.cboRekanan = false;
			$scope.dataLogin = medifirstService.getUserLogin();
			$scope.pegawaiLogin = medifirstService.getPegawaiLogin();
			$scope.item.totalklaim=0
			var DataTotalMataAnggaran = [];
			loadCombo();
			loadData();

			var dataformat = [
				{noregistrasi: 2209002265, noklaim: '1202R0030922V001056', totalklaim: 333333, tglbayar: '2022-02-02 00:00', isobat: 'TRUE'},
				{noregistrasi: 2210000149, noklaim: '1202R0031122V000021', totalklaim: 444444, tglbayar: '2022-02-02 00:00', isobat: 'TRUE'}
			]

			$scope.dataFormat = new kendo.data.DataSource({
				data: dataformat,
				pageSize: 10,
				total: dataformat.length,
				serverPaging: false,
				schema: {
					model: {
						fields: {
						}
					}
				}
			});

			$scope.UbahRekanan = function () {
				$scope.cboDefault = false;
				$scope.cboRekanan = true;
			}

			$scope.simpanRekanan = function () {
				if ($scope.dataPasienSelected.norec_pd != undefined) {
					var length = $scope.dataPasienPiutang._data.length + 1;
					var updateDokter = {
						"norec_pd": $scope.dataPasienSelected.norec_pd,
						"objectrekananfk": $scope.item.namaRekanan.id,
						"objectkelompokpasienlastfk": $scope.item.kelompokPasien.id
					}
					medifirstService.post('tatarekening/save-update-rekanan_pd', updateDokter).then(function (e) {
						$scope.isRouteLoading = false;
						$scope.SearchData();
						$scope.batalRekanan();
					})
				} else {
					messageContainer.error('Data belum dipilih')
				}
			}

			$scope.batalRekanan = function () {
				$scope.cboRekanan = false
				$scope.cboDefault = true
			}

			$scope.TambahObat = function(){
				$scope.popupTanggalBayarObat.center().open()
			};

			$scope.tagihan = function () {
				if ($scope.dataPasienSelected.noRegistrasi != undefined) {
					var obj = {
						noRegistrasi: $scope.dataPasienSelected.noRegistrasi
					}

					$state.go('RincianTagihan', {
						dataPasien: JSON.stringify(obj)
					});
				}
			}

			function loadCombo() {
				var chacePeriode = cacheHelper.get('chachePiutang');
				if (chacePeriode != undefined) {
					$scope.item.awalPeriode = new Date(chacePeriode[0]);;
					$scope.item.akhirPeriode = new Date(chacePeriode[1]);
				} else {
					$scope.item.awalPeriode = $scope.now
					$scope.item.akhirPeriode = $scope.now
				}

				medifirstService.get("tatarekening/get-data-combo-daftarregpasien", false).then(function (dat) {
					$scope.listDepartemen = dat.data.departemen;
					$scope.listKelompokPasien = dat.data.kelompokpasien;
				})

				medifirstService.getPart("sysadmin/general/get-datacombo-rekanan", true, true, 20).then(function (data) {
					$scope.listRekanan = data;
				});
			}

			$scope.SimpanPopUpTanggalObat = function(){

                var objSave =
                    {
                        tglbayar: moment($scope.item.tglBayarobat).format('YYYY-MM-DD HH:mm:ss'),
                        noregistrasi: $scope.item.noregistrasiobat,
                        totalklaim: $scope.item.totalobat,
                        noklaim: $scope.item.noklaimobat,
                    }

                    medifirstService.get("tatarekening/daftar-piutang-bpjs-manual?noregistrasi="+$scope.item.noregistrasiobat, false).then(function (dat) {
                        if(dat.data.data.length != 0 && dat.data.data[0].objectkelompokpasienlastfk != 4){
                            var confirm = $mdDialog.confirm()
                            .title('Peringatan')
                            .textContent('Data tersebut sudah diinput, yakin ingin input ulang?')
                            .ariaLabel('Lucky day')
                            .cancel('Tidak')
                            .ok('OK')
                            $mdDialog.show(confirm).then(function () {
                                medifirstService.post('tatarekening/save-piutang-bpjs-manual-obat', objSave).then(function (e) {
                                    $scope.isRouteLoading = false;
									loadData();
                                    $scope.popupTanggalBayar.center().close()
                                }, function (error) {
                        
                                })
                            })
                        } else{
                            medifirstService.post('tatarekening/save-piutang-bpjs-manual-obat', objSave).then(function (e) {
                                $scope.isRouteLoading = false;
								loadData();
                                $scope.popupTanggalBayar.center().close()
                            }, function (error) {
                    
                            })
                        }
                        
                    });
                
            }

			$("#upload").kendoUpload({
                localization: {
                    "select": "Import"
                },

                select: function (e) {
                    var ALLOWED_EXTENSIONS = [".xlsx"];
                    var extension = e.files[0].extension.toLowerCase();
                    if (ALLOWED_EXTENSIONS.indexOf(extension) == -1) {
                        toastr.error('Mohon Pilih File Excel (.xls)')
                        e.preventDefault();
                        // return
                    }
                    var file = e.files[0];
                    var stringFile = e.files[0].name
                    var strFile = stringFile.split('.')
                    var nmFileArr = strFile[0].split('_')

                    for (var i = 0; i < e.files.length; i++) {
                        var file = e.files[i].rawFile;

                        if (file) {
                            var reader = new FileReader();
                            reader.onload = function (e) {
                                var data = e.target.result;
                                var workbook = XLSX.read(data, {
                                    type: 'binary'
                                });

                                workbook.SheetNames.forEach(function (sheetName) {
									
                                    var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                                    var json_object = JSON.stringify(XL_row_object);
                                    console.log(XL_row_object);
                                    var objSave =
                                    {
                                        data: XL_row_object,
										pegawai: $scope.pegawaiLogin.namaLengkap,
										userloginfk: $scope.dataLogin.id,
                                    }

									medifirstService.post('tatarekening/save-piutang-bpjs', objSave).then(function (data) {
										loadData()
									})
                                })

                            };

                            reader.onerror = function (ex) {
                                console.log(ex);
                            };

                            reader.readAsBinaryString(file);
                        }
                    }
                },

            });

			$scope.getIsiComboRuangan = function () {
				$scope.listRuangan = $scope.item.instalasi.ruangan
			}


			$scope.formatTanggal = function (tanggal) {
				return moment(tanggal).format('DD-MMM-YYYY');
			}

			$scope.formatRupiah = function (value, currency) {
				return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
			}

			$scope.columnDataPasienPiutang = {
                toolbar: [
                    "excel",
                ],
                excel: {
                    fileName: "DaftarPiutangBPJS.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:M1"];
                    sheet.name = "Report";

                    var myHeaders = [{
                        value: "Daftar Piutang BPJS",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                selectable: 'row',
                pageable: true,
                columns: [
					{
						"field": "iscek",
						"title": " ",
						"template": "# if( iscek==true) {# <input type='checkbox' class='checkbox style-center' ng-checked='true' ng-click='onClickSatu($event,2)'/> # } else {# <input type='checkbox' class='checkbox style-center' ng-checked='false' ng-click='onClickSatu($event,2)'/> #} #",
						"width": "30px"
					},
					{
						"field": "nosep",
						"title": "No. SEP/No. Klaim",
						"width": "150px",
					},
					{
						"field": "tglsep",
						"title": "Tanggal SEP",
						"width": "100px",
					},
					{
						"field": "tglpulang",
						"title": "Tanggal Pulang",
						"width": "100px",
					},
					{
						"field": "tglbayar",
						"title": "Tanggal Bayar",
						"width": "100px",
					},
					{
						"field": "noregistrasi",
						"title": "No. Registrasi",
						"width": "150px",

					},
					{
						"field": "namapasien",
						"title": "Nama",
						"width": "200px",
					},
					{
						"field": "nocm",
						"title": "No. RM",
						"width": "100px",
					},
					{
						"field": "jeniskelamin",
						"title": "Jenis Kelamin",
						"width": "100px",
					},
					{
						"field": "kelompokpasien",
						"title": "Jenis Pasien",
						"width": "120px",
					},
					{
						"field": "namaruangan",
						"title": "Ruangan",
						"width": "120px",
					},
					{
						"field": "lamahari",
						"title": "LOS",
						"width": "120px",
					},
					{
						"field": "namarekanan",
						"title": "Penjamin",
						"width": "170px"
					},
					{
						"field": "totalbilling",
						"title": "Total Billing",
						"width": "120px",
						"template": "<span class='style-right'>{{formatRupiah('#: totalbilling #', '')}}</span>",
						attributes: { style: "text-align:right;" },
					},
					{
						"field": "totalbayar",
						"title": "Total Bayar",
						"width": "120px",
						"template": "<span class='style-right'>{{formatRupiah('#: totalbayar #', '')}}</span>",
						attributes: { style: "text-align:right;" },
					},
					{
						"field": "totalklaim",
						"title": "Total Klaim",
						"width": "120px",
						"template": "<span class='style-right'>{{formatRupiah('#: totalklaim #', '')}}</span>",
						attributes: { style: "text-align:right;" },
					},
					{
						"field": "totalklaimobat",
						"title": "Total Klaim Obat",
						"width": "120px",
						"template": "<span class='style-right'>{{formatRupiah('#: totalklaimobat #', '')}}</span>",
						attributes: { style: "text-align:right;" },
					},
					{
						"field": "selisih",
						"title": "Selisih Klaim",
						"width": "120px",
						"template": "<span class='style-right'>{{formatRupiah('#: selisih #', '')}}</span>",
						attributes: { style: "text-align:right;" },

					}
				]
			};

			$scope.columnFormat = {
                toolbar: [
                    "excel",
                ],
                excel: {
                    fileName: "FormatImportKlaimObatBPJS.xlsx",
                    allPages: true,
                },
                columns: [
					{
						"field": "noregistrasi",
						"title": "noregistrasi",
						"width": "30px",
					},
					{
						"field": "noklaim",
						"title": "noklaim",
						"width": "150px",
					},
					{
						"field": "totalklaim",
						"title": "totalklaim",
						"width": "100px",
					},
					{
						"field": "tglbayar",
						"title": "tglbayar",
						"width": "100px",
					},
					{
						"field": "isobat",
						"title": "isobat",
						"width": "100px",
					}
				]
			};

			function generateFlagTemplate(field){
				if (field== true)
					return "<input type='checkbox' class='checkbox style-center' ng-checked='true' />";
				else
					return "<input type='checkbox' class='checkbox style-center' ng-checked='false' />";
			}

			$scope.data2 = function (dataItem) {
				for (var i = 0; i < dataItem.details.length; i++) {
					dataItem.details[i].no = i + 1

				}
				return {
					dataSource: new kendo.data.DataSource({
						data: dataItem.details,

					}),
					columns: [
						{
							"field": "no",
							"title": "No",
							"width": "3%",
						},
						{
							"field": "kelompokpasien",
							"title": "Jenis",
							"width": "25%",
							// "template": "<span class='style-center'>{{formatTanggal('#: tglpelayanan #')}}</span>"
						},

						{
							"field": "namarekanan",
							"title": "Penjamin",
							"width": "40%",
							// "template": "<span class='style-center'>{{formatRupiah('#: hargasatuan #', 'Rp.')}}</span>"
						},
						{
							"field": "totalppenjamin",
							"title": "Total Klaim",
							"width": "25%",
							"template": "<span class='style-right'>{{formatRupiah('#: totalppenjamin #', '')}}</span>",
							attributes: { style: "text-align:right;" },
						},

					]
				}
			};
			$scope.Cetak = function () {

			}

			$scope.Verifikasi = function () {

				var dataPost = [];
				for (var i = 0; i < $scope.dataPasienPiutang._data.length; i++) {
					if ($scope.dataPasienPiutang._data[i].statCheckbox) {
						dataPost.push($scope.dataPasienPiutang._data[i].noRec)
					}
				}
				
				if (dataPost.length > 0) {
					var objSave = {
						"dataPiutang" : dataPost
					}
					medifirstService.post('tatarekening/verify-piutang-pasien', objSave)
						.then(function (e) {
							loadData()
							// $scope.loadNewData();
						}, function () {

						});
				}
				else {
					alert("Belum ada data yang dipilih");
				}
			}

			$scope.BatalVerifikasi = function () {
				var dataPost = [];
				for (var i = 0; i < $scope.dataPasienPiutang._data.length; i++) {
					if ($scope.dataPasienPiutang._data[i].statCheckbox) {
						if ($scope.dataPasienPiutang._data[i].noposting != null) {
							alert('Sudah collecting Instalasi Piutang, Tidak bisa di UnVerifikasi!!')
							return
						}
						dataPost.push($scope.dataPasienPiutang._data[i].noRec)
					}
				}

				if (dataPost.length > 0) {
					var objSave = {
						"dataPiutang" : dataPost
					}
					medifirstService.post('tatarekening/cancel-verify-piutang-pasien', objSave)
						.then(function (e) {
							loadData()
						}, function () { });
				}
				else {
					alert("Belum ada data yang dipilih");
				}
			}

			$scope.loadNewData = function () {
				medifirstService.get("tatarekening/daftar-piutang-bpjs?nameOrNoReg=" + $scope.item.namaOrReg + "&status=" + $scope.item.status.id + "&tglAwal=" 
				+ $scope.item.awalPeriode + "&tglAkhir=" + $scope.item.akhirPeriode)
					.then(function (dat) {
						var dataPasien = dat.data.data;
						for (var i = 0; i < dataPasien.length; i++) {
							dataPasien[i].no = i+1;
						}

						DataTotalMataAnggaran = dataPasien

						$scope.dataPasienPiutang = new kendo.data.DataSource({
							data: dataPasien,
							pageSize: 10,
							total: dataPasien.length,
							serverPaging: false,
							schema: {
								model: {
									fields: {
										tglTransaksi: { type: "date" }
									}
								}
							}
						});

						var grid = $('#kGrid').data("kendoGrid");

						grid.setDataSource($scope.dataPasienPiutang);
						grid.refresh();

					}, function () {

					});
			}

			$scope.Perbaharui = function () {
				$scope.ClearSearch();
			}

			$scope.changePage = function (stateName) {
				if ($scope.dataPasienSelected.id != undefined) {
					$state.go(stateName, {
						dataPasien: JSON.stringify($scope.dataPasienSelected)
					});
				}
				else {
					alert("Silahkan pilih data pasien terlebih dahulu");
				}
			}

			//fungsi clear kriteria search
			$scope.ClearSearch = function () {
				$scope.item = {};
				$scope.item.awalPeriode = $scope.now;
				$scope.item.akhirPeriode = $scope.now;
				$scope.SearchData();
			}
			//PENGECEKAN UNTUK DATA/PARAMETER KOSONG
			function undefinedChecker(data) {
				var temp = "";

				if (!_.isUndefined(data)) {
					temp = data;
				}
				return temp;
			}
			function undefinedCheckerObject(data) {
				var temp = "";

				if (!_.isUndefined(data)) {
					temp = data.id;
				}
				return temp;
			}
			//fungsi search data
			$scope.SearchData = function () {
				loadData();
			}
			function loadData() {
				/*//kriteria pencarian
				var nameOrReg = checkValue($scope.item, ["namaOrReg"]);
				var tanggalAwal = checkValue($scope.item, ["awalPeriode"]);
				var tanggalAkhir = checkValue($scope.item, ["akhirPeriode"]);
				var status = checkValue($scope.item, ["status", "namaExternal"]);
			    
				tanggalAwal = (moment(tanggalAwal, "DD-MM-YYYY").subtract('days', 1))._d;
				tanggalAkhir = (moment(tanggalAkhir, "DD-MM-YYYY").add('days', 1))._d;
  
  
				if(tanggalAwal != ""){
					  //tanggalAwal = moment(tanggalAwal).format('DD-MM-YYYY')
				}
  
				if(tanggalAkhir != ""){
					  //tanggalAkhir = moment(tanggalAkhir).format('DD-MM-YYYY')
				}
  
				var kriteriaFilter = [
				{ text:"noRegistrasi", operator:"contains",value:nameOrReg },
				{ text:"nama", operator:"contains", value:nameOrReg },
				{ text:"statusVerifikasi", operator:"eq", value:status },
				{ text:"tglTransaksi", operator:"gte", value:tanggalAwal },
				{ text:"tglTransaksi", operator:"lte", value:tanggalAkhir }
				];
			  	
				prosesSearch(kriteriaFilter);*/
				//debugger;
				$scope.isRouteLoading = true;
				var tglAkhir = moment($scope.item.akhirPeriode).format('YYYY-MM-DD');
				var tglAwal = moment($scope.item.awalPeriode).format('YYYY-MM-DD');
				var instalasiId = undefinedCheckerObject($scope.item.instalasi);
				var ruanganId = undefinedCheckerObject($scope.item.ruangan);
				var kelompokPasienId = undefinedCheckerObject($scope.item.kelompokPasien);
				var $status = "";
				if ($scope.item.status != undefined) {
					$status = "=" + $scope.item.status.id
				}
				var $jpelayanan = "";
				if ($scope.item.jenispelayanan != undefined) {
					$jpelayanan = "=" + $scope.item.jenispelayanan.id
				}
				var skey = "";
				if ($scope.item.caridata != undefined) {
					skey = $scope.item.item.caridata
				}
				$q.all([
					medifirstService.get("tatarekening/daftar-piutang-bpjs?"
						+ "noReg=" + undefinedChecker($scope.item.noReg)
						+ "&namaPasien=" + undefinedChecker($scope.item.namaPasien)
						+ "&status" + $status
						+ "&jpelayanan" + $jpelayanan
						+ "&tglAwal=" + tglAwal
						+ "&tglAkhir=" + tglAkhir
						+ "&ruanganId=" + ruanganId
						+ "&instalasiId=" + instalasiId
						+ "&kelompokpasienlastfk=" + kelompokPasienId
						+ "&key=" + skey),
					//modelItemAkuntansi.getDataGeneric("ruangan"), //Ambil data ruangan
					//modelItemAkuntansi.getDataGeneric("departemen"), //Ambil data departemen
				]).then(function (e) {
					$scope.isRouteLoading = false;
					var dataPasien = e[0].data.data;
					console.log(e[0].data.data)
						for (var i = 0; i < dataPasien.length; i++) {
							dataPasien[i].no = i+1;
						}
						DataTotalMataAnggaran = dataPasien
						// $scope.dataPasienPiutang = dataPasien
						$scope.dataPasienPiutang = new kendo.data.DataSource({
							data: dataPasien,
							pageSize: 10,
							total: dataPasien.length,
							serverPaging: false,
							schema: {
								model: {
									fields: {
										tglTransaksi: { type: "date" }
									}
								}
							}
						});
						var chacePeriode = {
							0: tglAwal,
							1: tglAkhir,

						}
				});
			}

			$scope.$watch('item.caridata', function (newValue, oldValue) {
                if (newValue != oldValue) {
					var data = []
                    for (let index = 0; index < DataTotalMataAnggaran.length; index++) {
                        let element = DataTotalMataAnggaran[index];
						console.log(element)
						if(element.noregistrasi != null){
							let namasearch = element.noregistrasi.toLowerCase()
							let nocm = element.nocm.toLowerCase()
							let nosep = element.nosep.toLowerCase()
							if (namasearch.match(newValue.toLowerCase())) {
								data.push(element)
							} else if (nocm.match(newValue.toLowerCase())) {
								data.push(element)
							} else if (nosep.match(newValue.toLowerCase())) {
								data.push(element)
							}
						}
                    }
                    $scope.dataPasienPiutang = new kendo.data.DataSource({
                        data: data,
						pageSize: 10,
							total: data.length,
							serverPaging: false,
							schema: {
								model: {
									fields: {
										tglTransaksi: { type: "date" }
									}
								}
							}
                    });
					console.log(data)
					
				}
			});

			$scope.selectedData2 = [];
			$scope.onClickSatu = function (e, param) {
				$scope.item.totalklaim = 0

				var element = $(e.currentTarget);
				var checked = element.is(':checked')
				var row = element.closest('tr')
				var grid = $("#grid").data("kendoGrid")
				var dataItem = grid.dataItem(row);

				if(dataItem.tglbayar != null){
					var confirm = $mdDialog.confirm()
					.title('Peringatan')
					.textContent('Data dengan nosep '+dataItem.nosep+' sudah memiliki tanggal bayar pada tanggal '+ dataItem.tglbayar+' klik ok untuk melanjutkan, atau klik tidak kemudian unchecked data untuk membatalkan')
					.ariaLabel('Lucky day')
					.cancel('Tidak')
					.ok('OK')
					$mdDialog.show(confirm).then(function () {
						console.log(checked)
						if (checked) {
							var result = $.grep($scope.selectedData2, function (e) {
								return e.noregistrasi == dataItem.noregistrasi;
							});
		
							if (result.length == 0) {
								for (let index = 0; index < DataTotalMataAnggaran.length; index++) {
									let element = DataTotalMataAnggaran[index];
									if(element.noregistrasi == dataItem.noregistrasi){
										element.iscek = true
									}
								}
								for (let index = 0; index < $scope.dataPasienPiutang.length; index++) {
								
									let el = $scope.dataPasienPiutang.options.data[index]
									if(el.noregistrasi == dataItem.noregistrasi){
										el.iscek = true
									}
								}
		
								dataItem.iscek = true
								$scope.selectedData2.push(dataItem);
							} else {
								for (var i = 0; i < $scope.selectedData2.length; i++)
									if ($scope.selectedData2[i].noregistrasi === dataItem.noregistrasi) {
										$scope.selectedData2.splice(i, 1);
										break;
									}
		
								for (let index = 0; index < DataTotalMataAnggaran.length; index++) {
									let element = DataTotalMataAnggaran[index];
									if(element.noregistrasi == dataItem.noregistrasi){
										element.iscek = false
									}
								}
		
								for (let index = 0; index < $scope.dataPasienPiutang.length; index++) {
								
									let el = $scope.dataPasienPiutang.options.data[index]
									if(el.noregistrasi == dataItem.noregistrasi){
										el.iscek = false
									}
								}
								
								dataItem.iscek = false
								$scope.selectedData2.push(dataItem);
							}
							row.addClass("k-state-selected");
						} else {
							for (var i = 0; i < $scope.selectedData2.length; i++)
								if ($scope.selectedData2[i].noregistrasi === dataItem.noregistrasi) {
									$scope.selectedData2.splice(i, 1);
									break;
								}
		
							for (let index = 0; index < DataTotalMataAnggaran.length; index++) {
								let element = DataTotalMataAnggaran[index];
								if(element.noregistrasi == dataItem.noregistrasi){
									element.iscek = false
								}
							}
		
							for (let index = 0; index < $scope.dataPasienPiutang.length; index++) {
								
								let el = $scope.dataPasienPiutang.options.data[index]
								if(el.noregistrasi == dataItem.noregistrasi){
									el.iscek = false
								}
							}
							
							dataItem.iscek = false
							row.removeClass("k-state-selected");
						}
					});
				} else{
					if (checked) {
						var result = $.grep($scope.selectedData2, function (e) {
							return e.noregistrasi == dataItem.noregistrasi;
						});
	
						if (result.length == 0) {
							for (let index = 0; index < DataTotalMataAnggaran.length; index++) {
								let element = DataTotalMataAnggaran[index];
								if(element.noregistrasi == dataItem.noregistrasi){
									element.iscek = true
								}
							}
							for (let index = 0; index < $scope.dataPasienPiutang.length; index++) {
							
								let el = $scope.dataPasienPiutang.options.data[index]
								if(el.noregistrasi == dataItem.noregistrasi){
									el.iscek = true
								}
							}
	
							dataItem.iscek = true
							$scope.selectedData2.push(dataItem);
						} else {
							for (var i = 0; i < $scope.selectedData2.length; i++)
								if ($scope.selectedData2[i].noregistrasi === dataItem.noregistrasi) {
									$scope.selectedData2.splice(i, 1);
									break;
								}
	
							for (let index = 0; index < DataTotalMataAnggaran.length; index++) {
								let element = DataTotalMataAnggaran[index];
								if(element.noregistrasi == dataItem.noregistrasi){
									element.iscek = false
								}
							}
	
							for (let index = 0; index < $scope.dataPasienPiutang.length; index++) {
							
								let el = $scope.dataPasienPiutang.options.data[index]
								if(el.noregistrasi == dataItem.noregistrasi){
									el.iscek = false
								}
							}
							
							dataItem.iscek = false
							$scope.selectedData2.push(dataItem);
						}
						row.addClass("k-state-selected");
					} else {
						for (var i = 0; i < $scope.selectedData2.length; i++)
							if ($scope.selectedData2[i].noregistrasi === dataItem.noregistrasi) {
								$scope.selectedData2.splice(i, 1);
								break;
							}
	
						for (let index = 0; index < DataTotalMataAnggaran.length; index++) {
							let element = DataTotalMataAnggaran[index];
							if(element.noregistrasi == dataItem.noregistrasi){
								element.iscek = false
							}
						}
	
						for (let index = 0; index < $scope.dataPasienPiutang.length; index++) {
							
							let el = $scope.dataPasienPiutang.options.data[index]
							if(el.noregistrasi == dataItem.noregistrasi){
								el.iscek = false
							}
						}
						
						dataItem.iscek = false
						row.removeClass("k-state-selected");
					}
				}

				console.log($scope.selectedData2)

				for (var i = 0; i < $scope.selectedData2.length; i++){
					$scope.item.totalklaim += parseFloat($scope.selectedData2[i].totalklaim)
				}
				
                $scope.item.datadipilih = $scope.selectedData2.length;
				
			}

			$scope.checkboxClicked = function () {
				$scope.item.totalklaim = 0
				console.log($scope.item.kasusbaru)

				if($scope.item.kasusbaru == true){
					for(var j = 0; j < $scope.dataPasienPiutang.options.data.length; j++){
						$scope.dataPasienPiutang.options.data[j].iscek = true
					}
	
					$scope.dataPasienPiutang = new kendo.data.DataSource({
						data: $scope.dataPasienPiutang.options.data,
						pageSize: 10,
						total: $scope.dataPasienPiutang.options.data.length,
						serverPaging: false,
						schema: {
							model: {
								fields: {
								}
							}
						}
					});
	
					$scope.selectedData2 = $scope.dataPasienPiutang.options.data
	
					for (var i = 0; i < $scope.selectedData2.length; i++){
						$scope.item.totalklaim += parseFloat($scope.selectedData2[i].totalklaim)
					}
					
					$scope.item.datadipilih = $scope.selectedData2.length;
				} 
				else if($scope.item.kasusbaru == false){
					for(var j = 0; j < $scope.dataPasienPiutang.options.data.length; j++){
						$scope.dataPasienPiutang.options.data[j].iscek = false
					}
	
					$scope.dataPasienPiutang = new kendo.data.DataSource({
						data: $scope.dataPasienPiutang.options.data,
						pageSize: 10,
						total: $scope.dataPasienPiutang.options.data.length,
						serverPaging: false,
						schema: {
							model: {
								fields: {
								}
							}
						}
					});
	
					$scope.selectedData2 = []
					$scope.item.totalklaim = 0 
					$scope.item.datadipilih = $scope.selectedData2.length;
				}

                console.log($scope.selectedData2)
            }

			$scope.TambahTanggalBayar = function(){
				$scope.popupTanggalBayar.center().open()
			};

			$scope.SimpanPopUpTanggal = function(){

				for (var i = 0; i < $scope.selectedData2.length; i++){
					if ($scope.selectedData2[i].nosep == "-" || $scope.selectedData2[i].nosep == " " || $scope.selectedData2[i].nosep == null || $scope.selectedData2[i].nosep == undefined) {
						toastr.error('Data yang belum terklaim tidak bisa disimpan')
                    	return
					}
				}
							
					

                var objSave =
                    {
                        klaim: $scope.selectedData2,
                        tglbayar: moment($scope.item.tglBayar).format('YYYY-MM-DD HH:mm:ss'),
                    }
                    medifirstService.post('tatarekening/save-rekap-klaim', objSave).then(function (e) {
                        $scope.isRouteLoading = false;
						loadData();
                    }, function (error) {
            
                    })
                
            }

			$("#upload").kendoUpload({
                localization: {
                    "select": "Import"
                },

                select: function (e) {
                    var ALLOWED_EXTENSIONS = [".xlsx"];
                    var extension = e.files[0].extension.toLowerCase();
                    if (ALLOWED_EXTENSIONS.indexOf(extension) == -1) {
                        toastr.error('Mohon Pilih File Excel (.xls)')
                        e.preventDefault();
                        // return
                    }
                    var file = e.files[0];
                    var stringFile = e.files[0].name
                    var strFile = stringFile.split('.')
                    var nmFileArr = strFile[0].split('_')

                    for (var i = 0; i < e.files.length; i++) {
                        var file = e.files[i].rawFile;

                        if (file) {
                            var reader = new FileReader();
                            reader.onload = function (e) {
                                var data = e.target.result;
                                var workbook = XLSX.read(data, {
                                    type: 'binary'
                                });

                                workbook.SheetNames.forEach(function (sheetName) {
									
                                    var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                                    var json_object = JSON.stringify(XL_row_object);
                                    console.log(XL_row_object);
                                    var objSave =
                                    {
                                        data: XL_row_object,
										pegawai: $scope.pegawaiLogin.namaLengkap,
										userloginfk: $scope.dataLogin.id,
                                    }

                                    console.log(XL_row_object)

                                    medifirstService.post('tatarekening/save-piutang-bpjs', objSave).then(function (data) {
                                        loadData()
                                    })
                                })

                            };

                            reader.onerror = function (ex) {
                                console.log(ex);
                            };

                            reader.readAsBinaryString(file);
                        }
                    }
                },

            });

			$scope.selectRow = function (dataItem) {
				var dataSelect = _.find($scope.dataPasienPiutang._data, function (data) {
					return data.noRec == dataItem.noRec;
				});

				if (dataSelect.statCheckbox) {
					dataSelect.statCheckbox = false;
				}
				else {
					dataSelect.statCheckbox = true;
				}


				// reloadDataGrid($scope.dataPasienPiutang._data);
			}

			var isCheckAll = false
			$scope.selectUnselectAllRow = function () {
				var tempData = $scope.dataPasienPiutang._data;

				if (isCheckAll) {
					isCheckAll = false;
					for (var i = 0; i < tempData.length; i++) {
						tempData[i].statCheckbox = false;
					}
				}
				else {
					isCheckAll = true;
					for (var i = 0; i < tempData.length; i++) {
						tempData[i].statCheckbox = true;
					}
				}

				// reloadDataGrid(tempData);

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

			$scope.CetakSurat = function () {				
				if ($scope.dataPasienSelected.noRegistrasi == undefined) {
					alert("data belum di pilih !!!")
				} else if ($scope.dataPasienSelected.jenisPasisen == "BPJS") {
					alert("Piih jenis pasien asuransi lain atau perusahaan")
				} else {
					var noreg = $scope.dataPasienSelected.noRegistrasi
					var stt = 'false'
					if (confirm('View Surat? ')) {
						// Save it!
						stt = 'true';
					} else {
						// Do nothing!
						stt = 'false'
					}
					var client = new HttpClient();
					client.get('http://127.0.0.1:1237/printvb/Piutang?cetak-LaporanTagihanSuratPasien=1&norec=' + noreg + '&view=' + stt, function (response) {
						// do something with response
					});
				}

			}
			$scope.CetakKwitansi = function () {				
				if ($scope.dataPasienSelected.noRegistrasi == undefined) {
					alert("data belum di pilih !!!")
				} else if ($scope.dataPasienSelected.jenisPasisen == "BPJS") {
					alert("Piih jenis pasien asuransi lain atau perusahaan")
				} else {
					var noreg = $scope.dataPasienSelected.noRegistrasi
					var stt = 'false'
					if (confirm('View Kwitansi? ')) {
						// Save it!
						stt = 'true';
					} else {
						// Do nothing!
						stt = 'false'
					}
					var client = new HttpClient();
					client.get('http://127.0.0.1:1237/printvb/Piutang?cetak-kwitansiPiutangPasien=1&norec=' + noreg + '&view=' + stt, function (response) {
						// do something with response
					});
				}

			}

		}
	]);
});