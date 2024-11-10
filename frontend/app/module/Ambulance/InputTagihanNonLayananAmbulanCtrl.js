define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('InputTagihanNonLayananAmbulanCtrl', ['$state', '$q', '$rootScope', '$scope', 'CacheHelper', 'DateHelper', 'MedifirstService', '$parse',
		function ($state, $q, $rootScope, $scope, cacheHelper, dateHelper, medifirstService, $parse) {
			$scope.item = {};
			$scope.now = new Date();
			$scope.item.tglStruk = new Date();
			$scope.item.jumlah = 1
			$scope.item.QtyPerOrang = 1
			$scope.item.keterangan = '-'
			var noRegistrasi2 = ''
			$scope.abisSimpanKauPulanglah = true;
			$scope.checkQtyOrg = '';
			$scope.checkQtyOrg = true
			$scope.QtyOrang = true;
			$scope.noPolAmbulan = true;
			$scope.hargabahanbakar = true;
			// $scope.listJenisPelaksana = [];
			$scope.show = true;
			$scope.pelaksanaAmbulan1 = true;
			$scope.pelaksanaAmbulan2 = false;
			$scope.pelaksanaAmbulan3 = false;
			var data2 = [];
			var dataProduk = [];
			var norec = '';
			var NoStruk = '';
			var Kegiatan = '';
            $scope.pegawai = JSON.parse(window.localStorage.getItem('pegawai'));
			console.log('pegawai',$scope.pegawai)

			// var data = cacheHelper.get('InputTagihanNonLayananAmbulanCtrl');
			//          if (data !== undefined) {
			//              var splitResultData = data.split("#");
			//              var noRegistrasi2 = splitResultData[0]
			//              var cmdBayar = splitResultData[1]
			//              var dariSini = splitResultData[2]
			//              // $scope.item.periodeAwal = new Date(splitResultData[0]);
			//              // $scope.item.periodeAkhir = new Date(splitResultData[1]);
			//          }

			loadCombo();

			function loadCombo() {
                // var datauserlogin = JSON.parse(window.localStorage.getItem("datauserlogin"));
				// console.log(datauserlogin)
				// $scope.KelompokUser = medifirstService.getKelompokUser();
				// medifirstService.get("kasir/get-data-combo-kasir").then(function (data) {
				// 	$scope.listKelompokTransaksi = data.data.kelnon;
				// 	$scope.KelompokUserDiklit = data.data.diklit;
				// 	console.log('diklit',$scope.KelompokUserDiklit)
				// 	$scope.listAmbulan = data.data.nopol;
				// 	$scope.listJenisKegiatanAmbulan = data.data.jeniskegiatanambulan;
				// 	LoadCache();
				// })

				$q.all([
                    medifirstService.get("kasir/get-data-combo-kasir"),
                    medifirstService.get("registrasi/get-combo-address"),
                ]).then(function (result) {
					if (result[0].statResponse) {
						$scope.KelompokUser = medifirstService.getKelompokUser();
						$scope.listKelompokTransaksi = result[0].data.kelnon;
						$scope.KelompokUserDiklit = result[0].data.diklit;
						console.log('diklit',$scope.KelompokUserDiklit)
						$scope.listAmbulan = result[0].data.nopol;
						$scope.listJenisKegiatanAmbulan = result[0].data.jeniskegiatanambulan;
						LoadCache();
					}

					if (result[1].statResponse) {
						$scope.listDataKecamatan = result[1].data.kecamatan
                        $scope.listDataKotaKabupaten = result[1].data.kotakabupaten
                        $scope.listDataPropinsi = result[1].data.propinsi
                        $scope.listKebangsaan = result[1].data.kebangsaan
                        $scope.listNegara = result[1].data.negara
                        $scope.item.kebangsaan = $scope.listKebangsaan[0]
					}

				})
			}

			function LoadCache() {
				var chacePeriode = cacheHelper.get('InputTagihanNonLayananAmbulanCtrl');
				if (chacePeriode != undefined) {
					norec = chacePeriode[0];
					Kegiatan = chacePeriode[1];
					NoStruk = chacePeriode[2];
					init()
					var chacePeriode = {
						0: '',
						1: '',
						2: '',
						3: '',
						4: '',
						5: '',
						6: ''
					}
					cacheHelper.set('InputTagihanNonLayananAmbulanCtrl', chacePeriode);
				} else {
					init()
				}
			}

			function init() {
				if (Kegiatan != '') {
					$scope.isRouteLoading = true;
					if (Kegiatan == 'EditTagihan') {
						medifirstService.get("kasir/detail-tagihan-non-layanan?noRec=" + norec, true).then(function (data) {
							$scope.isRouteLoading = false;
							var data_ih = data.data;
							debugger;
							$scope.item.tglStruk = new Date(moment(data_ih.tglTransaksi).format('YYYY-MM-DD HH:mm'));
							$scope.item.namaPasien_klien = data_ih.namaPasien_klien;
							$scope.item.noTelp_klien = data_ih.notelepon;
							$scope.item.kelompokTransaksi = { id: data_ih.kdkelompokTransaksi, kelompoktransaksi: data_ih.kelompokTransaksi };
							$scope.item.keterangan = data_ih.keterangan;
							dataProduk = data_ih.detailTagihan;
							var subTotal = 0;
							// var total = 0;
							for (var i = dataProduk.length - 1; i >= 0; i--) {
								dataProduk[i].no = i + 1
								subTotal = subTotal + parseFloat(dataProduk[i].totalK)
							}
							$scope.item.totalBilling = parseFloat(subTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
							$scope.dataDaftarTagihan = new kendo.data.DataSource({
								data: dataProduk,
								group: $scope.group,
								pageSize: 100,
								total: dataProduk.length,
								serverPaging: false,
								schema: {
									model: {
									}
								}
							});
						});
					}
				}
			}

			// $q.all([k
			// 	modelItemAkuntansi.getDataTableTransaksi("kasir/detail-tagihan-non-layanan/"+ noRegistrasi2 )
			// 	])
			// .then(function(data) {

			// 	if (data[0].statResponse){
			// 		$scope.item = data[0];
			// 		// $scope.item.totalTagihan = $scope.item.jumlahBayar;
			// 		// $scope.item.jumlahBayarFix = $scope.item.jumlahBayar - $scope.item.totalDeposit;
			// 		$scope.dataDaftarTagihan = new kendo.data.DataSource({
			// 			data: data[0].detailTagihan
			// 		});
			// 	}

			// });

			function showButton() {
				//$scope.showBtnCetak = true;
				// debugger;
				// $scope.showBtnBack = true;
				// if (cmdBayar == "0"){
				// 	$scope.showBtnBayar = true;
				// }
				// if (cmdBayar == "1"){
				// 	$scope.showBtnBayar = false;
				// }

				//$scope.showBtnTutup = true;
			}

			showButton();

			$scope.Back = function () {
				window.history.back();
				//$state.go(dariSini)
			};

			$scope.dataVOloaded = true;
			$scope.now = new Date();


			// $scope.dataDaftarTagihan = new kendo.data.DataSource({
			// 	data: []
			// });

			$scope.getChecked = function () {
				if ($scope.checkQtyOrg == true) {
					$scope.QtyOrang = true;
				} else {
					$scope.QtyOrang = false;
				}
			}

			// tanda1
			// $scope.columnDaftarTagihan = [
			// 	{
			// 		"field": "no",
			// 		"title": "No",
			// 		"width": "45px"
			// 	},
			// 	{
			// 		"field": "namaproduk",
			// 		"title": "Tagihan",
			// 		"width": "300px"
			// 	},
			// 	{
			// 		"field": "keterangan",
			// 		"title": "Keterangan",
			// 		"width": "200px"
			// 	},
			// 	{
			// 		"field": "jumlah",
			// 		"title": "Qty",
			// 		"width": "90px"
			// 	},
			// 	{
			// 		"field": "qtyoranglast",
			// 		"title": "Qty Per Org/Per Km",
			// 		"width": "155px"
			// 	},
			// 	{
			// 		"field": "harga",
			// 		"title": "Harga",
			// 		"width": "110px"
			// 	},
			// 	{
			// 		"field": "totalK",
			// 		"title": "Total",
			// 		"width": "110px"
			// 	}
			// ];
			// tanda1
			$scope.gridPetugasPelaksana = new kendo.data.DataSource({
				data: []
			})
			var onChange = function (e) {
				var grid = $(this).data("mainGridOptions");
			}
			var onDataBound = function (e) {
				var columns = e.sender.columns;
				var rows = e.sender.tbody.children();

				for (var j = 0; j < rows.length; j++) {
					// sisa sekarang
					var row = $(rows[j]);
					var dataItem = e.sender.dataItem(row);

					var istarifdetault = dataItem.get("istarifdetault");
					var cell = row.children().eq(3);
					if (istarifdetault == true) {
						cell.removeClass('koneng');
					} else {
						cell.addClass('koneng');
					}
				}
			}
			$scope.mainGridOptions = {
				dataBound: onDataBound,
				sortable: true,
				autoSync: true,
				change: onChange,
				batch: true,
				selectable: 'row',
				pageable: {
					refresh: true,
					pageSizes: true,
					buttonCount: 5
				},
				columns: [
					{ "field": "no", "title": "No", "width": "45px" },
					{ "field": "namaproduk", "title": "Tagihan", "width": "300px" },
					{ "field": "nopolisi", "title": "No Polisi", "width": "70px" },
					{ "field": "jeniskegiatan", "title": "Jenis Kegiatan", "width": "200px" },
					{ "field": "keterangan", "title": "Keterangan", "width": "200px" },
					{ "field": "jumlah", "title": "Qty", "width": "90px" },
					{ "field": "qtyoranglast", "title": "Qty Per Org/Per Km", "width": "155px" },
					{ "field": "harga", "title": "Harga", "width": "110px" },
					{ "field": "totalK", "title": "Total", "width": "110px" },
					// {
					// 	command: {
					// 		text: "Hapus",
					// 		width: "70px",
					// 		align: "center",
					// 		attributes: { align: "center" },
					// 		click: removeRowTindakan,
					// 		imageClass: "k-icon k-delete"
					// 	},
					// 	title: "",
					// 	width: "100px",
					// }
				],
			};

			$scope.columnDaftarProduk = [
				{
					"field": "namaproduk",
					"title": "Nama Layanan",
					"width": "300px"
				}
			];

			$scope.CariProduk = function () {
				medifirstService.get("kasir/get-data-produk?namaproduk=" + $scope.item.namaproduk + "&take=50", false).then(function (data) {
					$scope.dataDaftarProduk = data.data.data;
				})
			}

			$scope.bayar2 = function () {
				if (dataProduk.length == 0) {
					alert("Pilih produk terlebih dahulu !")
					return;
				}
				if ($scope.item.kelompokTransaksi == undefined) {
					alert("Pilih kelompok transaksi terlebih dahulu !")
					return;
				}
				if ($scope.item.namaPasien_klien == undefined) {
					alert("Isi Nama Pelanggan terlebih dahulu !")
					return;
				}
				var subTotal = 0;
				for (var i = dataProduk.length - 1; i >= 0; i--) {
					subTotal = subTotal + parseFloat(dataProduk[i].totalK)
				}
				if (subTotal == undefined || subTotal == 0) {
					alert("Total tidak Boleh Kosong !")
					return;
				}

				var petugasLayanan = [];
				if ($scope.gridPetugasPelaksana && $scope.gridPetugasPelaksana._data.length > 0) {
					$scope.gridPetugasPelaksana._data.forEach(function (a) {
						petugasLayanan.push({
							"objectjenispetugaspefk": a.jenisPetugas.id,
							"listpegawai": a.listPetugas
						});
					});
				} else {
					console.log("Tidak ada data petugas layanan");
				}
				
				// console.log(petugasLayanan); 
				var objSave = {
					norec: norec || '',
					kelompoktransaksifk: $scope.item.kelompokTransaksi.id,
					keteranganlainnya: $scope.item.keterangan,
					namapasien_klien: $scope.item.namaPasien_klien,
					notelp_klien: $scope.item.noTelp_klien,
					tglstruk: moment($scope.item.tglStruk).format('YYYY-MM-DD hh:mm:ss'),
					totalharusdibayar: parseFloat(subTotal),//parseFloat($scope.item.totalBilling),
					details: dataProduk,
					nopolisi: $scope.item.noPolisi.norec,
					jeniskegiatan: $scope.item.jenisKegiatan.id,
					petugaspelayananambulan: petugasLayanan,
				}
				
				const alamat = {
					alamatLengkap: $scope.item.alamatLengkap,
					desaKelurahan: $scope.item.desaKelurahan != undefined ? $scope.item.desaKelurahan.id : null,
					kecamatan: $scope.item.kecamatan != undefined ? $scope.item.kecamatan.id : null,
					kotaKabupaten: $scope.item.kotaKabupaten != undefined ? $scope.item.kotaKabupaten.id : null,
					provinsi: $scope.item.propinsi != undefined ? $scope.item.propinsi.id : null,
					rtRw: $scope.item.rtrw != undefined ? $scope.item.rtrw : null
				}

				const datas = {objSave,alamat}

				console.log('data yg dikirim',datas)

				medifirstService.post('kasir/save-input-non-layanan', datas).then(function (data) {
					console.log("Data berhasil disimpan:", data);
				}).catch(function (error) {
					console.error("Terjadi kesalahan saat menyimpan data:", error);
				});		
			}

			$scope.bayar = function () {
				if (dataProduk.length == 0) {
					alert("Pilih produk terlebih dahulu !")
					return;
				}
				if ($scope.item.kelompokTransaksi == undefined) {
					alert("Pilih kelompok transaksi terlebih dahulu !")
					return;
				}
				if ($scope.item.namaPasien_klien == undefined) {
					alert("Isi Nama Pelanggan terlebih dahulu !")
					return;
				}
				var subTotal = 0;
				for (var i = dataProduk.length - 1; i >= 0; i--) {
					subTotal = subTotal + parseFloat(dataProduk[i].totalK)
				}
				if (subTotal == undefined || subTotal == 0) {
					alert("Total tidak Boleh Kosong !")
					return;
				}

				var petugasLayanan = [];
				if ($scope.gridPetugasPelaksana && $scope.gridPetugasPelaksana._data.length > 0) {
					$scope.gridPetugasPelaksana._data.forEach(function (a) {
						petugasLayanan.push({
							"objectjenispetugaspefk": a.jenisPetugas.id,
							"listpegawai": a.listPetugas
						});
					});
				} else {
					console.log("Tidak ada data petugas layanan");
				}
				
				// console.log(petugasLayanan); 
				var objSave = {
					norec: norec || '',
					kelompoktransaksifk: $scope.item.kelompokTransaksi.id,
					keteranganlainnya: $scope.item.keterangan,
					namapasien_klien: $scope.item.namaPasien_klien,
					notelp_klien: $scope.item.noTelp_klien,
					tglstruk: moment($scope.item.tglStruk).format('YYYY-MM-DD hh:mm:ss'),
					totalharusdibayar: parseFloat(subTotal),//parseFloat($scope.item.totalBilling),
					details: dataProduk,
					nopolisi: $scope.item.noPolisi.norec,
					jeniskegiatan: $scope.item.jenisKegiatan.id,
					petugaspelayananambulan: petugasLayanan,

					alamatLengkap: $scope.item.alamatLengkap,
					desaKelurahan: $scope.item.desaKelurahan != undefined ? $scope.item.desaKelurahan.id : null,
					kecamatan: $scope.item.kecamatan != undefined ? $scope.item.kecamatan.id : null,
					kotaKabupaten: $scope.item.kotaKabupaten != undefined ? $scope.item.kotaKabupaten.id : null,
					provinsi: $scope.item.propinsi != undefined ? $scope.item.propinsi.id : null,
					rtRw: $scope.item.rtrw != undefined ? $scope.item.rtrw : null
				}
				
				// const alamat = {
				// 	alamatLengkap: $scope.item.alamatLengkap,
				// 	desaKelurahan: $scope.item.desaKelurahan != undefined ? $scope.item.desaKelurahan.id : null,
				// 	kecamatan: $scope.item.kecamatan != undefined ? $scope.item.kecamatan.id : null,
				// 	kotaKabupaten: $scope.item.kotaKabupaten != undefined ? $scope.item.kotaKabupaten.id : null,
				// 	provinsi: $scope.item.propinsi != undefined ? $scope.item.propinsi.id : null,
				// 	rtRw: $scope.item.rtrw != undefined ? $scope.item.rtrw : null
				// }

				// const payload = {
				// 	objSave: objSave,
				// 	alamat: alamat
				// };

				// console.log('data yg dikirim',payload)

				medifirstService.post('kasir/save-input-non-layanan', objSave).then(function (data) {
					console.log("Data berhasil disimpan:", data);
				}).catch(function (error) {
					console.error("Terjadi kesalahan saat menyimpan data:", error);
				});		
			}

			$scope.$watch('item.jumlah', function (newValue, oldValue) {
				if (newValue != oldValue) {
					if ($scope.item.jumlah > 0) {
						$scope.item.Total = ((parseFloat($scope.item.Harga) * parseFloat($scope.item.QtyPerOrang)) * parseFloat($scope.item.jumlah))
					}
				}
			});

			$scope.$watch('item.QtyPerOrang', function (newValue, oldValue) {
				if (newValue != oldValue) {
					if ($scope.item.jumlah > 0) {
						$scope.item.Total = ((parseFloat($scope.item.Harga) * parseFloat($scope.item.QtyPerOrang)) * parseFloat($scope.item.jumlah))
					}
				}
			});

			$scope.$watch('item.Harga', function (newValue, oldValue) {
				if (newValue != oldValue) {
					if ($scope.item.jumlah > 0) {
						$scope.item.Total = ((parseFloat($scope.item.Harga) * parseFloat($scope.item.QtyPerOrang)) * parseFloat($scope.item.jumlah))
					}
				}
			});

			$scope.changePage = function (stateName) {
				var obj = {
					pageFrom: "InputTagihanNonLayanan",
					noRegistrasi: noRegistrasi2
				}

				$state.go(stateName, {
					dataPasien: JSON.stringify(obj)
				});
			}

			$scope.Tutup = function () {

			}

			$scope.klikGrid = function (dataSelectedProduk) {
				if (dataSelectedProduk == undefined) {
					messageContainer.error("Layanan Belum Dipilih")
					return
				}
				$scope.dataSelectedProduk = dataSelectedProduk;
				$scope.item.namaprodukInput = $scope.dataSelectedProduk.namaproduk;
				if ($scope.dataSelectedProduk.harga != "0") {
					$scope.item.KeteranganProduk = "-";
					$scope.disHarga = true;
				} else {
					$scope.disHarga = false;
				}
				$scope.item.Harga = $scope.dataSelectedProduk.harga;
				$scope.item.idProduk = $scope.dataSelectedProduk.id;
				$scope.item.jumlah = 1;
			}

			$scope.klikGridPro = function (dataSelected) {
				if (dataSelected == undefined) {
					messageContainer.error("Layanan Belum Dipilih")
					return
				}
				$scope.dataSelected = dataSelected;
				$scope.item.no = $scope.dataSelected.no;
				$scope.item.namaprodukInput = $scope.dataSelected.namaproduk;
				$scope.item.KeteranganProduk = $scope.dataSelected.keterangan;
				$scope.item.Harga = $scope.dataSelected.harga;
				$scope.item.idProduk = $scope.dataSelected.id;
				$scope.item.jumlah = $scope.dataSelected.jumlah;
			}

			$scope.tambah = function () {
				if ($scope.item.namaprodukInput == undefined) {
					alert("pilih produk terlebih dahulu !!")
					return;
				}

				if ($scope.item.namaprodukInput == "Pelayanan Lainnya" && $scope.item.KeteranganProduk == undefined) {
					alert("Keterangan Pelayanan Harus Diisi !!")
					return;
				}

				if ($scope.item.namaprodukInput == "Pelayanan Lainnya" && $scope.item.Harga == 0 || $scope.item.Harga == 0.0) {
					alert("Harga Tidak Boleh Nol !!")
					return;
				}

				var no = 0
				if (dataProduk.length == 0) {
					no = 1
				} else {
					no = dataProduk.length + 1
				}

				if ($scope.item.no != undefined) {
					no = $scope.item.no
				}
				var data = {};
				if ($scope.item.no != undefined) {//LAMA
					for (var i = dataProduk.length - 1; i >= 0; i--) {
						if (dataProduk[i].no == $scope.item.no) {
							data.no = $scope.item.no

							data.id = $scope.item.idProduk
							data.namaproduk = $scope.item.namaprodukInput
							data.jumlah = parseFloat($scope.item.jumlah)
							data.qtyoranglast = parseFloat($scope.item.QtyPerOrang)
							data.harga = parseFloat($scope.item.Harga)
							data.totalK = $scope.item.Total //parseFloat($scope.item.jumlah) * parseFloat($scope.item.Harga)
							data.keterangan = $scope.item.KeteranganProduk
							data.nopolisi = $scope.item.noPolisi.nopolisi
							data.jeniskegiatan = $scope.item.jenisKegiatan.namajeniskegiatan
							dataProduk[i] = data;
							$scope.dataDaftarTagihan = new kendo.data.DataSource({
								data: dataProduk
							});
							var subTotal = 0;
							for (var i = dataProduk.length - 1; i >= 0; i--) {
								subTotal = subTotal + parseFloat(dataProduk[i].totalK)
							}
							$scope.item.totalBilling = parseFloat(subTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
							ClearIsian();

						}
						// break;
					}
					if ($scope.item.jenisPelaksana && $scope.selectedPegawai) {
						var pushData = {
							"idParent": data.rowNumber,
							"jenisPetugas": {
								"id": $scope.item.jenisPelaksana.id,
								"jenisPelaksana": $scope.item.jenisPelaksana.jenispetugaspe
							},
							"listPetugas": $scope.selectedPegawai
						}
						$scope.gridPetugasPelaksana.add(pushData);
					}
					if ($scope.item.jenisPelaksana2 && $scope.selectedPegawai2) {
						var pushData = {
							"idParent": data.rowNumber,
							"jenisPetugas": {
								"id": $scope.item.jenisPelaksana2.id,
								"jenisPelaksana": $scope.item.jenisPelaksana2.jenispetugaspe
							},
							"listPetugas": $scope.selectedPegawai2
						}
						$scope.gridPetugasPelaksana.add(pushData);
						$scope.showJenisPelaksana2 = false;
						delete $scope.item.jenisPelaksana2;
					}
					if ($scope.item.jenisPelaksana3 && $scope.selectedPegawai3) {
						var pushData = {
							"idParent": data.rowNumber,
							"jenisPetugas": {
								"id": $scope.item.jenisPelaksana3.id,
								"jenisPelaksana": $scope.item.jenisPelaksana3.jenispetugaspe
							},
							"listPetugas": $scope.selectedPegawai3
						}
						$scope.gridPetugasPelaksana.add(pushData);
						$scope.showJenisPelaksana3 = false;
						delete $scope.item.jenisPelaksana3;
					}
				} else {//BARU
					data = {
						no: no,
						id: $scope.item.idProduk,
						namaproduk: $scope.item.namaprodukInput,
						jumlah: parseFloat($scope.item.jumlah),
						qtyoranglast: parseFloat($scope.item.QtyPerOrang),
						harga: parseFloat($scope.item.Harga),
						keterangan: $scope.item.KeteranganProduk,
						nopolisi: $scope.item.noPolisi.nopolisi,
						jeniskegiatan: $scope.item.jenisKegiatan.namajeniskegiatan,
						totalK: $scope.item.Total //parseFloat($scope.item.jumlah) * parseFloat($scope.item.Harga)
					}
					dataProduk.push(data)
					// $scope.dataGrid.add($scope.dataSelectedProduk)
					$scope.dataDaftarTagihan = new kendo.data.DataSource({
						data: dataProduk
					});
					var subTotal = 0;
					for (var i = dataProduk.length - 1; i >= 0; i--) {
						subTotal = subTotal + parseFloat(dataProduk[i].totalK)
					}
					$scope.item.totalBilling = parseFloat(subTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")

					if ($scope.item.jenisPelaksana && $scope.selectedPegawai) {
						var pushData = {
							"idParent": data.rowNumber,
							"jenisPetugas": {
								"id": $scope.item.jenisPelaksana.id,
								"jenisPelaksana": $scope.item.jenisPelaksana.jenispetugaspe
							},
							"listPetugas": $scope.selectedPegawai
						}
						$scope.gridPetugasPelaksana.add(pushData);
					}
					if ($scope.item.jenisPelaksana2 && $scope.selectedPegawai2) {
						var pushData = {
							"idParent": data.rowNumber,
							"jenisPetugas": {
								"id": $scope.item.jenisPelaksana2.id,
								"jenisPelaksana": $scope.item.jenisPelaksana2.jenispetugaspe
							},
							"listPetugas": $scope.selectedPegawai2
						}
						$scope.gridPetugasPelaksana.add(pushData);
						$scope.showJenisPelaksana2 = false;
						delete $scope.item.jenisPelaksana2;
					}
					if ($scope.item.jenisPelaksana3 && $scope.selectedPegawai3) {
						var pushData = {
							"idParent": data.rowNumber,
							"jenisPetugas": {
								"id": $scope.item.jenisPelaksana3.id,
								"jenisPelaksana": $scope.item.jenisPelaksana3.jenispetugaspe
							},
							"listPetugas": $scope.selectedPegawai3
						}
						$scope.gridPetugasPelaksana.add(pushData);
						$scope.showJenisPelaksana3 = false;
						delete $scope.item.jenisPelaksana3;
					}

					ClearIsian();
				}
			}

			function ClearIsian() {
				$scope.item.no = undefined;
				$scope.item.namaprodukInput = undefined;
				$scope.item.KeteranganProduk = undefined;
				$scope.item.Harga = undefined;
				$scope.item.idProduk = undefined;
				$scope.item.jumlah = 1;
				$scope.item.Total = undefined;
				$scope.item.QtyPerOrang = 1;
			}

			$scope.hapus = function () {
				if ($scope.item.namaprodukInput == undefined) {
					messageContainer.error("Layanan Belum Dipilih")
					return
				}
				var data = {};
				if ($scope.item.no != undefined) {
					for (var i = dataProduk.length - 1; i >= 0; i--) {
						if (dataProduk[i].no == $scope.item.no) {
							dataProduk.splice(i, 1);
							var subTotal = 0;
							for (var i = dataProduk.length - 1; i >= 0; i--) {
								subTotal = subTotal + parseFloat(data2[i].total)
								dataProduk[i].no = i + 1
							}
							$scope.dataDaftarTagihan = new kendo.data.DataSource({
								data: dataProduk
							});
							$scope.item.totalBilling = parseFloat(subTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
						}
					}
				}
				ClearIsian();
			}

			$scope.batal = function () {
				ClearIsian();
			}

			$scope.kelompokTransaksiSelected = function (kelTransaksi) {
				if (kelTransaksi.id == 9 || kelTransaksi == 'PELAYANAN AMBULAN') {
					$scope.noPolAmbulan = false;
					$scope.hargabahanbakar = false;
					$scope.pelaksanaAmbulan1 = false;
				} else {
					$scope.noPolAmbulan = true;
					$scope.hargabahanbakar = true;
					$scope.pelaksanaAmbulan1 = true;
					$scope.item.noPolAmbulan = undefined;
				}
			}

			$scope.selectOptions = {
				placeholder: "Pilih Pegawai...",
				dataTextField: "namaLengkap",
				dataValueField: "id",
				filter: "contains"
			};

			$scope.tambah1 = function () {
				$scope.pelaksanaAmbulan2 = true;
				$scope.show = false;
				$scope.show2 = true;
			};

			$scope.show = true;
			$scope.tambah2 = function () {
				$scope.pelaksanaAmbulan3 = true;
				$scope.show = false;
				$scope.show2 = false;
				$scope.show3 = true;
			};
			$scope.hapusPelaksanaAmbulan2 = function () {
				$scope.show = true;
				$scope.show2 = false;
				$scope.pelaksanaAmbulan2 = false;
				$scope.item.jenisPelaksana2 = "";
				$scope.selectedPegawai2 = [];
			};
			$scope.hapusPelaksanaAmbulan3 = function () {
				$scope.show = false;
				$scope.show2 = true;
				$scope.pelaksanaAmbulan3 = false;
				$scope.item.jenisPelaksana3 = "";
				$scope.selectedPegawai3 = [];
			};

			$scope.isInArray = function (value, array) {
				return array.indexOf(value) > -1;
			}

			$scope.listIdPetugas = [13827, 176873]
			$scope.selectedPegawai = [];
			$scope.init1 = function () {
				var id = $scope.item.jenisPelaksana.id;
				var model = 'dataSource';
				var listArray = 'selectedPegawai';
				var isInList = $scope.isInArray(id, $scope.listIdPetugas);
				if (isInList) {
					getGenericPegawai(model, listArray);
				} else {
					getPegawaiById(id, model, listArray);
				}
			};
			$scope.selectedPegawai2 = [];
			$scope.init2 = function () {
				var id = $scope.item.jenisPelaksana2.id;
				var model = 'dataSource2';
				var listArray = 'selectedPegawai2';
				var isInList = $scope.isInArray(id, $scope.listIdPetugas);
				if (isInList) {
					getGenericPegawai(model, listArray);
				} else {
					getPegawaiById(id, model, listArray);
				}
			};
			$scope.selectedPegawai3 = [];
			$scope.init3 = function () {
				var id = $scope.item.jenisPelaksana3.id;
				var model = 'dataSource3';
				var listArray = 'selectedPegawai3';
				var isInList = $scope.isInArray(id, $scope.listIdPetugas);
				if (isInList) {
					getGenericPegawai(model, listArray);
				} else {
					getPegawaiById(id, model, listArray);
				}
			};

			medifirstService.get("tatarekening/tindakan/get-combo")
				.then(function (da) {
					$scope.listJenisPelaksana = da.data.jenispelaksana;
					$scope.item.nilaiStatusCito = parseFloat(da.data.tarifcito.nilaifield);
					// $scope.pegawaiLogin = medifirstService.getPegawaiLogin();
					if ($scope.pegawaiLogin.jenisPetugas != undefined) {
						if ($scope.pegawaiLogin.jenisPetugas.length > 0) {
							$scope.item.jenisPelaksana = { id: $scope.pegawaiLogin.jenisPetugas[0].id, jenispetugaspe: $scope.pegawaiLogin.jenisPetugas[0].jenispetugaspe };
							var id = $scope.pegawaiLogin.jenisPetugas[0].id;
							var model = 'dataSource';
							var listArray = 'selectedPegawai';
							var isInList = $scope.isInArray(id, $scope.listIdPetugas);
							if (isInList) {
								getGenericPegawai(model, listArray);
							} else {
								getPegawaiById(id, model, listArray);
							}
						}
					} else {
						// medifirstService.get("tatarekening/tindakan/get-jenispetugasbypegawai?idPegawai=" + $scope.pegawaiLogin.id, true).then(function (dat) {
						// 	//var id = $scope.item.jenisPelaksana.id;dat.data.jenispelaksana
						// 	$scope.item.jenisPelaksana = { id: dat.data.jenispelaksana[0].id, jenispetugaspe: dat.data.jenispelaksana[0].jenispetugaspe };
						// 	var id = dat.data.jenispelaksana[0].id;
						// 	var model = 'dataSource';
						// 	var listArray = 'selectedPegawai';
						// 	var isInList = $scope.isInArray(id, $scope.listIdPetugas);
						// 	if (isInList) {
						// 		getGenericPegawai(model, listArray);
						// 	} else {
						// 		getPegawaiById(id, model, listArray);
						// 	}
						// });

					}

				})

			function getPegawaiById(id, input, output) {
				//console.log($scope.selectedPegawai);
				var selectedData = $parse(output);
				selectedData.assign($scope, []);
				var model = $parse(input);
				medifirstService.get("tatarekening/tindakan/get-pegawaibyjenispetugas?idJenisPetugas=" + id, true).then(function (dat) {
					$scope.listPegawai = new kendo.data.DataSource({
						data: dat.data.jenispelaksana
					});
					// $scope.pegawaiLogin = medifirstService.getPegawaiLogin();
					model.assign($scope, $scope.listPegawai);

					var cookie = document.cookie.split(';');
					cookie = cookie[0].split('=');
					// if (cookie[1] == 'dokter')
					// $scope.selectedPegawai = [({ id: $scope.pegawaiLogin.id, namalengkap: $scope.pegawaiLogin.namaLengkap })]
					console.log($scope.pegawaiLogin)
					if (($scope.item.pasien.kdinternal == "JIW") && ($scope.pegawaiLogin.jenisPegawai.jenispegawai == "DOKTER" || $scope.pegawaiLogin.jenisPegawai.jenispegawai == "Dokter")) {
						let params = $scope.item.pasien.noregistrasi;
						if ($scope.item.pasien.noreservasi != undefined && $scope.item.pasien.noreservasi != '' && $scope.item.pasien.noreservasi != 'Kios-K') {
							params = $scope.item.pasien.noreservasi;
						}
					}

					if ($scope.ruanganfk == 768 && ($scope.pegawaiLogin.jenisPegawai.jenispegawai == "DOKTER" || $scope.pegawaiLogin.jenisPegawai.jenispegawai == "Dokter")) {
						let params = $scope.item.pasien.noregistrasi;
						if ($scope.item.pasien.noreservasi != undefined && $scope.item.pasien.noreservasi != '' && $scope.item.pasien.noreservasi != 'Kios-K') {
							params = $scope.item.pasien.noreservasi;
						}
					}

					if ($scope.ruanganfk == 770 && ($scope.pegawaiLogin.jenisPegawai.jenispegawai == "DOKTER" || $scope.pegawaiLogin.jenisPegawai.jenispegawai == "Dokter")) {
						let params = $scope.item.pasien.noregistrasi;
						if ($scope.item.pasien.noreservasi != undefined && $scope.item.pasien.noreservasi != '' && $scope.item.pasien.noreservasi != 'Kios-K') {
							params = $scope.item.pasien.noreservasi;
						}
					}

					// medifirstService.get("emr/get-kode-eksternal-pegawai?id=" + $scope.pegawaiLogin.id, true).then(function (e) {
					// 	console.log($scope.departemenfk)
					// 	console.log(e.data.data[0].kodeexternal)
					// 	if ($scope.departemenfk == 16 && ($scope.pegawaiLogin.jenisPegawai.jenispegawai == "DOKTER" || $scope.pegawaiLogin.jenisPegawai.jenispegawai == "Dokter") && e.data.data[0].kodeexternal == "JIWA") {
					// 		let params = $scope.item.pasien.noregistrasi;
					// 		if ($scope.item.pasien.noreservasi != undefined && $scope.item.pasien.noreservasi != '' && $scope.item.pasien.noreservasi != 'Kios-K') {
					// 			params = $scope.item.pasien.noreservasi;
					// 		}
					// 	}
					// })
				});
			}

			$scope.detailGridOptions = function (dataItem) {
				return {
					dataSource: {
						data: $scope.gridPetugasPelaksana._data,
						filter: { field: "idParent", operator: "eq", value: dataItem.rowNumber }
					},
					columns: [
						{
							field: "jenisPetugas.jenisPelaksana",
							title: "Jenis Pelaksana",
							width: "100px",
							template: "#= jenisPetugas.jenisPelaksana #"
						},
						{
							field: "listPetugas[0].namalengkap",
							title: "Nama Pegawai",
							width: "200px",
							template: multiSelectArrayToString
						}
					]
				};
			};
			function multiSelectArrayToString(item) {
				if (item.listPetugas !== "") {
					return item.listPetugas.map(function (elem) {
						return elem.namalengkap
					}).join(", ");
				}
			};

			function removeRowTindakan(e) {
				e.preventDefault();

				var grid = this;
				var tr = $(e.target).closest("tr");
				var dataItem = this.dataItem(tr);

				if (!dataItem) return;

				// Menghapus row dari dataDaftarTagihan
				$scope.dataDaftarTagihan.remove(dataItem);

				// Menghapus dari array data2 (asumsi ini adalah array yang menyimpan data tagihan)
				for (var i = data2.length - 1; i >= 0; i--) {
					if (data2[i].rowNumber == dataItem.rowNumber) {
						data2.splice(i, 1);
					}
				}

				// Mengurangi totalBilling berdasarkan nilai totalK yang dihapus
				var totalK = parseFloat(dataItem.totalK) || 0;
				$scope.item.totalBilling = ($scope.item.totalBilling || 0) - totalK;

				// Format ulang totalBilling jika diperlukan
				$scope.item.totalBilling = $scope.formatRupiah($scope.item.totalBilling, 'Rp.');

				// Menghapus juga di gridPetugasPelaksana jika ada relasi
				var gridPetugas = $scope.gridPetugasPelaksana._data;
				if (gridPetugas.length != 0) {
					for (var i = gridPetugas.length - 1; i >= 0; i--) {
						if (gridPetugas[i].idParent == dataItem.rowNumber) {
							gridPetugas.splice(i, 1);
							$scope.gridPetugasPelaksana.add(gridPetugas);
						}
					}
				}

				// Perbarui tampilan agar perubahan totalBilling terlihat
				$scope.$apply();
			}

			$scope.formatRupiah = function (value, currency) {
				return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
			}

			// alamat
			medifirstService.getPart("registrasi/get-desa-kelurahan-paging", true, true, 10).then(function (e) {
                $scope.listDataKelurahan = e;
            });

			$scope.findAddress = function (desa) {
                if (desa.objectkecamatanfk)
                    $scope.alamat.kecamatan = { id: desa.objectkecamatanfk, namakecamatan: desa.namakecamatan }
                if (desa.objectkotakabupatenfk)
                    $scope.alamat.kotaKabupaten = { id: desa.objectkotakabupatenfk, namakotakabupaten: desa.namakotakabupaten }
                if (desa.objectpropinsifk)
                    $scope.alamat.propinsi = { id: desa.objectpropinsifk, namapropinsi: desa.namapropinsi }
                if (desa.kodepos)
                    $scope.alamat.kodePos = desa.kodepos
            }

			$scope.$watch('item.desaKelurahan', function (newValue, oldValue) {
                if (newValue == oldValue) return;
                if (newValue.objectkecamatanfk)
                    $scope.item.kecamatan = { id: newValue.objectkecamatanfk, namakecamatan: newValue.namakecamatan }
                if (newValue.objectkotakabupatenfk)
                    $scope.item.kotaKabupaten = { id: newValue.objectkotakabupatenfk, namakotakabupaten: newValue.namakotakabupaten }
                if (newValue.objectpropinsifk)
                    $scope.item.propinsi = { id: newValue.objectpropinsifk, namapropinsi: newValue.namapropinsi }
                if (newValue.kodepos)
                    $scope.item.kodePos = newValue.kodepos
            });

			$scope.$watch('item.alamatLengkap', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    var nama = $scope.item.alamatLengkap.toUpperCase()
                    $scope.item.alamatLengkap = nama;
                }
            });

            $scope.$watch('item.alamatLengkap', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    var nama = $scope.item.alamatLengkap.toUpperCase()
                    $scope.item.alamatLengkap = nama;
                }
            });

			// $scope.salinAlamat = function (data) {
            //     if (data == true) {
            //         if ($scope.item.alamatLengkap != undefined) {
            //             $scope.item.alamatDomisili = $scope.item.alamatLengkap
            //         } else {
            //             toastr.info('Alamat lengkap belum diisi', 'Info')
            //         }

            //         if ($scope.item.rtrw != undefined) {
            //             $scope.item.rtrwDomisili = $scope.item.rtrw
            //         } else {
            //             toastr.info('RT / RW belum diisi', 'Info')
            //         }

            //         if ($scope.item.desaKelurahan != undefined) {
            //             $scope.item.desaKelurahanDomisili = $scope.item.desaKelurahan
            //         } else {
            //             toastr.info('Desa/Kelurahan belum diisi', 'Info')
            //         }

            //         if ($scope.item.kecamatan != undefined) {
            //             $scope.item.kecamatanDomisili = $scope.item.kecamatan
            //         } else {
            //             toastr.info('Kecamatan belum diisi', 'Info')
            //         }

            //         if ($scope.item.kotaKabupaten != undefined) {
            //             $scope.item.kotaKabupatenDomisili = $scope.item.kotaKabupaten
            //         } else {
            //             toastr.info('Kota/kabupaten belum diisi', 'info')
            //         }

            //         if ($scope.item.propinsi != undefined) {
            //             $scope.item.propinsiDomisili = $scope.item.propinsi
            //         } else {
            //             toastr.info('Propinsi belum diisi', 'info')
            //         }
            //     } else {
            //         $scope.item.alamatDomisili = undefined
            //         $scope.item.rtrwDomisili = undefined
            //         $scope.item.desaKelurahanDomisili = undefined
            //         $scope.item.kecamatanDomisili = undefined
            //         $scope.item.kotaKabupatenDomisili = undefined
            //         $scope.item.propinsiDomisili = undefined
            //         $scope.item.negaraDomisili = undefined
            //     }
            // }
			// BATAS //
		}
	]);
});