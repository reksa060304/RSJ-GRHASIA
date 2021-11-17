define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('InputProdukCtrl', ['$scope', '$state', 'ModelItem', '$mdDialog', 'MedifirstService',
		function ($scope, $state, ModelItem, $mdDialog, medifirstService) {
			$scope.item = {};
			$scope.isRouteLoading = false;
			$scope.dataVOloaded = true;
			$scope.now = new Date();
			var dataLoad = {}
			$scope.kembali = function () { $state.go('MasterProduk') }
			load();

			function load() {
				$scope.listverifikasiAnggaran = [
					{ "id": 1, "namaExternal": "t", "namaAlias": "True" },
					{ "id": 2, "namaExternal": "f", "namaAlias": "False" }
				];

				$scope.listStatusEnabled = [
					{ "id": 1, "status": "t", "statusenabled": "True" },
					{ "id": 0, "status": "f", "statusenabled": "False" }					
				];
				
				if ($state.params.idx != "") {
					$scope.isRouteLoading = true;
					$scope.item.id = $state.params.idx;
					medifirstService.get("sysadmin/master/get-produkbyid?idProduk=" + $scope.item.id, true).then(function (e) {
						var datax = e.data;
						dataLoad = e.data
						$scope.isRouteLoading = false;
						$scope.item.getKelompok = { id: e.data[0].objectkelompokprodukfk, kelompokproduk: e.data[0].kelompokproduk };
						medifirstService.get("sysadmin/master/get-jenis-produk?kelompokProdukfk=" + e.data[0].objectkelompokprodukfk, true).then(function (dat) {
							$scope.listJenisProduk = dat.data;
							$scope.item.jenisProduk = { id: dataLoad[0].objectjenisprodukfk, jenisproduk: dataLoad[0].jenisproduk };
						})
						$scope.getJP = { id: e.data[0].objectjenisprodukfk, jenisproduk: e.data[0].jenisproduk };
						$scope.item.id = e.data[0].id;
						$scope.item.kdprofile = e.data[0].kdprofile;
						// $scope.item.statusenabled = e.data[0].statusenabled;
						$scope.item.idx = e.data[0].id;
						$scope.item.norec = e.data[0].norec;
						$scope.item.kdProduk = e.data[0].kdproduk;
						$scope.item.kdProdukIntern = e.data[0].kdproduk_intern;
						$scope.item.kdBarcode = e.data[0].kdbarcode;
						$scope.item.kodeBmn = e.data[0].kodebmn;
						$scope.item.kodeExternal = e.data[0].kodeexternal;
						$scope.item.namaProduk = e.data[0].namaproduk;
						$scope.item.deskripsiProduk = e.data[0].deskripsiproduk;
						$scope.item.keterangan = e.data[0].keterangan;
						$scope.item.namaExternal = e.data[0].namaexternal;
						$scope.item.reportDisplay = e.data[0].reportdisplay;
						$scope.item.detailJenisProduk = { id: e.data[0].objectdetailjenisprodukfk, detailjenisproduk: e.data[0].detailjenisproduk };
						$scope.item.kategoryProduk = { id: e.data[0].objectkategoryprodukfk, kategoryproduk: "" };
						$scope.item.generik = { id: e.data[0].objectgenerikfk, name: "" }
						$scope.item.gProduk = { id: e.data[0].objectgprodukfk, namagproduk: "" }
						$scope.item.levelProduk = { id: e.data[0].objectlevelprodukfk, levelproduk: "" }
						$scope.item.isProdukIntern = e.data[0].isprodukintern;
						$scope.item.departemen = {
							id: e.data[0].objectdepartemenfk,
							namadepartemen: ""
						}
						$scope.item.fungsiProduk = { id: e.data[0].objectfungsiprodukfk, fungsiproduk: "" };
						$scope.item.bentukProduk = { id: e.data[0].objectbentukprodukfk, namabentukproduk: "" };
						$scope.item.bahanProduk = { id: e.data[0].objectbahanprodukfk, namabahanproduk: "" };
						$scope.item.typeProduk = { id: e.data[0].objecttypeprodukfk, typeproduk: "" };
						$scope.item.warnaProduk = { id: e.data[0].objectwarnaprodukfk, warnaproduk: "" };
						$scope.item.kekuatan = e.data[0].kekuatan;
						$scope.item.merkProduk = { id: e.data[0].objectmerkprodukfk, merkproduk: "" };
						$scope.item.detailObat = { id: e.data[0].objectdetailobatfk, name: "" };
						$scope.item.spesifikasi = e.data[0].spesifikasi
						$scope.item.golonganProduk = { id: e.data[0].objectgolonganprodukfk, golonganproduk: "" };
						$scope.item.detailGolonganProduk = { id: e.data[0].objectdetailgolonganprodukfk, detailgolonganproduk: "" };
						$scope.item.satuanStandar = { id: e.data[0].objectsatuanstandarfk, satuanstandar: e.data[0].objectsatuanstandar };
						$scope.item.satuanBesar = { id: e.data[0].objectsatuanbesarfk, satuanbesar: "" };
						$scope.item.satuanKecil = { id: e.data[0].objectsatuankecilfk, satuankecil: "" };
						$scope.item.qtyKalori = e.data[0].qtykalori;
						$scope.item.qtyKarbohidrat = e.data[0].qtykarbohidrat;
						$scope.item.qtyLemak = e.data[0].qtylemak;
						$scope.item.qtyPorsi = e.data[0].qtyporsi;
						$scope.item.qtyProtein = e.data[0].qtyprotein;
						$scope.item.jenisperiksa = { id: e.data[0].objectjenisperiksafk, jenisperiksa: "" };
						$scope.item.jenisPeriksaPenunjang = { id: e.data[0].objectjenisperiksapenunjangfk, jenisperiksa: "" };
						$scope.item.nilaiNormal = e.data[0].nilainormal;
						$scope.item.bahanSample = { id: e.data[0].bahansamplefk, namabahansample: "" };
						$scope.item.golonganDarah = { id: e.data[0].golongandarahfk, golongandarah: "" };
						$scope.item.rhesus = { id: e.data[0].rhesusfk, rhesus: "" }
						$scope.item.account = { id: e.data[0].objectaccountfk, namaaccount: "" };
						$scope.item.verifikasiAnggaran = { id: e.data[0].verifikasianggaran, namaExternal: "" };
						$scope.item.statusProduk = { id: e.data[0].objectstatusprodukfk, statusproduk: "" };
						$scope.item.IsARVDonasi = { id: e.data[0].isarvdonasi, namaExternal: "" };
						$scope.item.IsNarkotika = { id: e.data[0].isnarkotika, namaExternal: "" };
						$scope.item.IsPsikotropika = { id: e.data[0].ispsikotropika, namaExternal: "" };
						$scope.item.IsOnkologi = { id: e.data[0].isonkologi, namaExternal: "" };
						$scope.item.Oot = { id: e.data[0].isoot, namaExternal: "" };
						$scope.item.IsPrekusor = { id: e.data[0].isprekusor, namaExternal: "" };
						$scope.item.IsVaksinDonasi = { id: e.data[0].isvaksindonasi, namaExternal: "" };
						$scope.item.produsenProduk = { id: e.data[0].objectprodusenprodukfk, namaprodusenproduk: "" };
						$scope.item.rekanan = { id: e.data[0].objectrekananfk, namarekanan: "" };
						$scope.item.sediaan = { id: e.data[0].objectsediaanfk, namasediaan: "" };
						if(e.data[0].statusenabled == true || e.data[0].statusenabled == 't'){
							$scope.item.StatusEnabledT = { id: 1, status: "t", statusenabled: "True" }
						}else{
							$scope.item.StatusEnabledT = { id: 0, status: "f", statusenabled: "False" }
						}
						LoadCombo()
					})
				} else {
					LoadCombo()
					$scope.item.StatusEnabledT = { id: 1, status: "t", statusenabled: "True" }
				}
			}			

			$scope.KelompokToJenis = function (kelompok) {
				medifirstService.get("sysadmin/master/get-jenis-produk?kelompokProdukfk=" + kelompok.id, true).then(function (dat) {
					$scope.listJenisProduk = dat.data;
				})
			}

			$scope.JenisToDetail = function (jenisProduk) {
				var jenis = $scope.item.jenisProduk.id				
				medifirstService.get("sysadmin/master/get-detail-jenis-produk?jenisProdukId=" + jenis, true).then(function (dat) {
					$scope.listdetailjenis = dat.data;
				})
			}

			function LoadCombo() {
				//Menu Kategori get Combo
				if (dataLoad.length == undefined) {
					var kelompokId = ''
					var jenisID = ''
				} else {
					var kelompokId = dataLoad[0].objectkelompokprodukfk
					var jenisID = dataLoad[0].objectjenisprodukfk
				}

				medifirstService.getPart("sysadmin/master/get-data-combo-rekanan", true, true, 20).then(function (data) {
					$scope.listrekanan = data.rekanan;				
				})

				medifirstService.get("sysadmin/master/get-data-combo-master?kelompokProdukfk=" + kelompokId
					+ "&objectjenisprodukfk=" + jenisID, true).then(function (dat) {
						var dataCombo = dat.data;
						$scope.listdetailjenis = dataCombo.kategori.detailjenis;
						$scope.listgenerik = dataCombo.kategori.generik;
						$scope.listgproduk = dataCombo.kategori.gproduk;
						$scope.listkategory = dataCombo.kategori.kategori;
						$scope.listlevel = dataCombo.kategori.level;
						$scope.listKelompok = dataCombo.kelompokproduk;
						$scope.listJenisProduk = dataCombo.jenisproduk;
						$scope.listdetailjenis = dataCombo.data;
						$scope.listfungsiProduk = dataCombo.spesifikasi.fungsiproduk;
						$scope.listbentukProduk = dataCombo.spesifikasi.bentukproduk;
						$scope.listbahanproduk = dataCombo.spesifikasi.bahanproduk;
						$scope.listtypeProduk = dataCombo.spesifikasi.typeproduk;
						$scope.listwarnaProduk = dataCombo.spesifikasi.warnaproduk;
						$scope.listmerkProduk = dataCombo.spesifikasi.merkproduk;
						$scope.listdetailObat = dataCombo.spesifikasi.detailobat;
						$scope.listGolonganProduk = dataCombo.spesifikasi.golonganproduk;
						$scope.listdetailgolonganproduk = dataCombo.spesifikasi.detailgolonganproduk;
						$scope.listsatuanbesar = dataCombo.satuan.besar;
						$scope.listsatuankecil = dataCombo.satuan.kecil;
						$scope.listsatuanStandar = dataCombo.satuan.standar;
						$scope.listbahansample = dataCombo.penunjang.bahansample;
						$scope.listJenisPeriksa = dataCombo.penunjang.jenisperiksa;
						$scope.listJenisPeriksaPenunjang = dataCombo.penunjang.jenisperiksapenunjang;
						$scope.listgolongandarah = dataCombo.labdarah.golongandarah;
						$scope.listrhesus = dataCombo.labdarah.rhesus;
						$scope.listdepartemen = dataCombo.departemen;
						$scope.listprodusenProduk = dataCombo.produsenproduk;	
						$scope.liststatusProduk = dataCombo.statusproduk;
						$scope.listaccount = dataCombo.chartofaccount;		 

						if (dataLoad.length != undefined) {
							$scope.item.kategoryProduk = { id: dataLoad[0].objectkategoryprodukfk, kategoryproduk: dataLoad[0].kategoryproduk };
							$scope.item.generik = { id: dataLoad[0].objectgenerikfk, name: dataLoad[0].rm_generikname };
							$scope.item.gProduk = { id: dataLoad[0].objectgprodukfk, namagproduk: dataLoad[0].namagproduk };
							$scope.item.levelProduk = { id: dataLoad[0].objectlevelprodukfk, levelproduk: dataLoad[0].levelproduk };
							$scope.item.kelompok = { id: dataLoad[0].objectkelompokprodukfk, kelompokproduk: dataLoad[0].kelompokproduk };
							$scope.item.jenisProduk = { id: dataLoad[0].objectjenisprodukfk, jenisproduk: dataLoad[0].jenisproduk };
							$scope.item.detailJenisProduk = { id: dataLoad[0].objectdetailjenisprodukfk, detailjenisproduk: dataLoad[0].detailjenisproduk };
							$scope.item.satuanStandar = { id: dataLoad[0].objectsatuanstandarfk, satuanstandar: dataLoad[0].satuanstandar };
							$scope.item.fungsiProduk = { id: dataLoad[0].objectfungsiprodukfk, fungsiproduk: dataLoad[0].fungsiproduk };
							$scope.item.bentukProduk = { id: dataLoad[0].objectbentukprodukfk, namabentukproduk: dataLoad[0].namabentukproduk };
							$scope.item.bahanProduk = { id: dataLoad[0].objectbahanprodukfk, namabahanproduk: dataLoad[0].namabahanproduk };
							$scope.item.typeProduk = { id: dataLoad[0].objecttypeprodukfk, typeproduk: dataLoad[0].typeproduk };
							$scope.item.warnaProduk = { id: dataLoad[0].objectwarnaprodukfk, warnaproduk: dataLoad[0].warnaproduk };
							$scope.item.merkProduk = { id: dataLoad[0].objectmerkprodukfk, merkproduk: dataLoad[0].merkproduk };
							$scope.item.detailObat = { id: dataLoad[0].objectdetailobatfk, name: dataLoad[0].detailobat };
							$scope.item.golonganProduk = { id: dataLoad[0].objectgolonganprodukfk, golonganproduk: dataLoad[0].golonganproduk };
							$scope.item.detailGolonganProduk = { id: dataLoad[0].objectdetailgolonganprodukfk, detailgolonganproduk: dataLoad[0].detailgolonganproduk };
							$scope.item.departemen = { id: dataLoad[0].objectdepartemenfk, namadepartemen: dataLoad[0].namadepartemen };
							if(dataLoad[0].statusenabled == true || dataLoad[0].statusenabled == 't'){
								$scope.item.StatusEnabledT = { id: 1, status: "t", statusenabled: "True" }
							}else{
								$scope.item.StatusEnabledT = { id: 0, status: "f", statusenabled: "False" }
							}
						}else{
							$scope.item.StatusEnabledT = { id: 1, status: "t", statusenabled: "True" }
						}
					})				

				
			}


			$scope.Save = function () {
				if ($scope.item.kelompok == undefined) {
					alert("Kelompok Produk Kosong!!!")
					return
				}

				if ($scope.item.jenisProduk == undefined) {
					alert("Jenis Produk Kosong!!!")
					return
				}

				if ($scope.item.detailJenisProduk == undefined) {
					alert("Detail Jenis Produk Kosong!!!")
					return
				}

				if ($scope.item.satuanStandar == undefined) {
					alert("Satuan Standar Kosong!!!")
					return
				}

				var confirm = $mdDialog.confirm()
					.title('Peringatan!')
					.textContent('Apakah anda yakin akan menyimpan data ini?')
					.ariaLabel('Lucky day')
					.ok('Ya')
					.cancel('Tidak')

				$mdDialog.show(confirm).then(function () {
					$scope.Simpan();
				})
			};

			$scope.simpan = function () {
				if ($scope.item.kelompok == undefined) {
					alert("Kelompok Produk Kosong!!!")
					return
				}

				if ($scope.item.jenisProduk == undefined) {
					alert("Jenis Produk Kosong!!!")
					return
				}

				if ($scope.item.detailJenisProduk == undefined) {
					alert("Detail Jenis Produk Kosong!!!")
					return
				}

				if ($scope.item.satuanStandar == undefined) {
					alert("Satuan Standar Kosong!!!")
					return
				}

				if ($scope.item.StatusEnabledT == undefined) {
					alert("Status Enabled Kosong!!!")
					return
				}
				var kdproduk = ''
				if ($scope.item.kdProduk != undefined) {
					kdproduk = $scope.item.kdProduk
				}
				var kdproduk_intern = ''
				if ($scope.item.kdProdukIntern != undefined) {
					kdproduk_intern = $scope.item.kdProdukIntern
				}
				var kdbarcode = ''
				if ($scope.item.kdBarcode != undefined) {
					kdbarcode = $scope.item.kdBarcode
				}
				var kodebmn = ''
				if ($scope.item.kodeBmn != undefined) {
					kodebmn = $scope.item.kodeBmn
				}
				var kodeexternal = ''
				if ($scope.item.kodeExternal != undefined) {
					kodeexternal = $scope.item.kodeExternal
				}
				var namaproduk = ''
				if ($scope.item.namaProduk != undefined) {
					namaproduk = $scope.item.namaProduk
				}
				var deskripsiproduk = ''
				if ($scope.item.deskripsiProduk != undefined) {
					deskripsiproduk = $scope.item.deskripsiProduk
				}
				var keterangan = ''
				if ($scope.item.keterangan != undefined) {
					keterangan = $scope.item.keterangan
				}
				var namaexternal = ''
				if ($scope.item.namaExternal != undefined) {
					namaexternal = $scope.item.namaExternal
				}
				var reportdisplay = ''
				if ($scope.item.reportDisplay != undefined) {
					reportdisplay = $scope.item.reportDisplay
				}
				// objectdetailjenisprodukfk = $scope.item.jenisProduk.id,
				var objectdetailjenisprodukfk = null
				if ($scope.item.detailJenisProduk != undefined) {
					objectdetailjenisprodukfk = $scope.item.detailJenisProduk.id
				}
				var objectkategoryprodukfk = null
				if ($scope.item.kategoryProduk != undefined) {
					objectkategoryprodukfk = $scope.item.kategoryProduk.id
				}
				var objectgenerikfk = null
				if ($scope.item.generik != undefined) {
					objectgenerikfk = $scope.item.generik.id
				}
				var objectgprodukfk = null
				if ($scope.item.gProduk != undefined) {
					objectgprodukfk = $scope.item.gProduk.id
				}
				var objectlevelprodukfk = null
				if ($scope.item.levelProduk != undefined) {
					objectlevelprodukfk = $scope.item.levelProduk.id
				}
				var isprodukintern = 0
				if ($scope.item.isProdukIntern != undefined) {
					isprodukintern = $scope.item.isProdukIntern
				}
				var objectdepartemenfk = null
				if ($scope.item.departemen != undefined) {
					objectdepartemenfk = $scope.item.departemen.id
				}
				var objectfungsiprodukfk = null
				if ($scope.item.fungsiProduk != undefined) {
					objectfungsiprodukfk = $scope.item.fungsiProduk.id
				}
				var objectbentukprodukfk = null
				if ($scope.item.bentukProduk != undefined) {
					objectbentukprodukfk = $scope.item.bentukProduk.id
				}
				var objectbahanprodukfk = null
				if ($scope.item.bahanProduk != undefined) {
					objectbahanprodukfk = $scope.item.bahanProduk.id
				}
				var objecttypeprodukfk = null
				if ($scope.item.typeProduk != undefined) {
					objecttypeprodukfk = $scope.item.typeProduk.id
				}
				var objectwarnaprodukfk = null
				if ($scope.item.warnaProduk != undefined) {
					objectwarnaprodukfk = $scope.item.warnaProduk.id
				}
				var kekuatan = ''
				if ($scope.item.kekuatan != undefined) {
					kekuatan = $scope.item.kekuatan
				}
				var objectmerkprodukfk = null
				if ($scope.item.merkProduk != undefined) {
					objectmerkprodukfk = $scope.item.merkProduk.id
				}
				var objectdetailobatfk = null
				if ($scope.item.detailObat != undefined) {
					objectdetailobatfk = $scope.item.detailObat.id
				}
				var spesifikasi = ''
				if ($scope.item.spesifikasi != undefined) {
					spesifikasi = $scope.item.spesifikasi
				}
				var objectgolonganprodukfk = null
				if ($scope.item.golonganProduk != undefined) {
					objectgolonganprodukfk = $scope.item.golonganProduk.id
				}
				var objectdetailgolonganprodukfk = null
				if ($scope.item.detailGolonganProduk != undefined) {
					objectdetailgolonganprodukfk = $scope.item.detailGolonganProduk.id
				}
				var objectsatuanstandarfk = null
				if ($scope.item.satuanStandar != undefined) {
					objectsatuanstandarfk = $scope.item.satuanStandar.id
				}
				var objectsatuanbesarfk = null
				if ($scope.item.satuanBesar != undefined) {
					objectsatuanbesarfk = $scope.item.satuanBesar.id
				}
				var objectsatuankecilfk = null
				if ($scope.item.satuanKecil != undefined) {
					objectsatuankecilfk = $scope.item.satuanKecil.id
				}
				var qtykalori = 0
				if ($scope.item.qtyKalori != undefined) {
					qtykalori = $scope.item.qtyKalori
				}
				var qtykarbohidrat = 0
				if ($scope.item.qtyKarbohidrat != undefined) {
					qtykarbohidrat = $scope.item.qtyKarbohidrat
				}
				var qtylemak = 0
				if ($scope.item.qtyLemak != undefined) {
					qtylemak = $scope.item.qtyLemak
				}
				var qtyporsi = 0
				if ($scope.item.qtyPorsi != undefined) {
					qtyporsi = $scope.item.qtyPorsi
				}
				var qtyprotein = 0
				if ($scope.item.qtyProtein != undefined) {
					qtyprotein = $scope.item.qtyProtein
				}
				var objectjenisperiksafk = null
				if ($scope.item.jenisperiksa != undefined) {
					objectjenisperiksafk = $scope.item.jenisperiksa.id
				}
				var objectjenisperiksapenunjangfk = null
				if ($scope.item.jenisPeriksaPenunjang != undefined) {
					objectjenisperiksapenunjangfk = $scope.item.jenisPeriksaPenunjang.id
				}
				var nilainormal = 0
				if ($scope.item.nilaiNormal != undefined) {
					nilainormal = $scope.item.nilaiNormal
				}
				var bahansamplefk = null
				if ($scope.item.bahanSample != undefined) {
					bahansamplefk = $scope.item.bahanSample.id
				}
				var golongandarahfk = null
				if ($scope.item.golonganDarah != undefined) {
					golongandarahfk = $scope.item.golonganDarah.id
				}
				var rhesusfk = null
				if ($scope.item.rhesus != undefined) {
					rhesusfk = $scope.item.rhesus.id
				}
				var objectaccountfk = null
				if ($scope.item.account != undefined) {
					objectaccountfk = $scope.item.account.id
				}
				var verifikasianggaran = null
				if ($scope.item.verifikasiAnggaran != undefined) {
					verifikasianggaran = $scope.item.verifikasiAnggaran.id
				}
				var objectstatusprodukfk = null
				if ($scope.item.statusProduk != undefined) {
					objectstatusprodukfk = $scope.item.statusProduk.id
				}
				var isarvdonasi = null
				if ($scope.item.IsARVDonasi != undefined) {
					isarvdonasi = $scope.item.IsARVDonasi.namaExternal
				}
				var isnarkotika = null
				if ($scope.item.IsNarkotika != undefined) {
					isnarkotika = $scope.item.IsNarkotika.namaExternal
				}
				var ispsikotropika = null
				if ($scope.item.IsPsikotropika != undefined) {
					ispsikotropika = $scope.item.IsPsikotropika.namaExternal
				}
				var isonkologi = null
				if ($scope.item.IsOnkologi != undefined) {
					isonkologi = $scope.item.IsOnkologi.namaExternal
				}
				var isoot = null
				if ($scope.item.Oot != undefined) {
					isoot = $scope.item.Oot.namaExternal
				}
				var isprekusor = null
				if ($scope.item.IsPrekusor != undefined) {
					isprekusor = $scope.item.IsPrekusor.namaExternal
				}
				var isvaksindonasi = null
				if ($scope.item.IsVaksinDonasi != undefined) {
					isvaksindonasi = $scope.item.IsVaksinDonasi.namaExternal
				}
				var objectprodusenprodukfk = null
				if ($scope.item.produsenProduk != undefined) {
					objectprodusenprodukfk = $scope.item.produsenProduk.id
				}
				var objectrekananfk = null
				if ($scope.item.rekanan != undefined) {
					objectrekananfk = $scope.item.rekanan.id
				}
				var objectsediaanfk = null
				if ($scope.item.sediaan != undefined) {
					objectsediaanfk = $scope.item.sediaan.id
				}
				var idProduk = null
				if ($scope.item.id != undefined) {
					idProduk = $scope.item.id
				}
				// if($scope.item.id !=undefined){
				var objSave = {
					"id": idProduk,
					"kdprofile": 0,
					"statusenabled": $scope.item.StatusEnabledT.id,//true,
					// "statusenabled": $scope.item.StatusEnabledT.status
					"kdproduk": kdproduk,//$scope.item.kdProduk,
					"kdproduk_intern": kdproduk_intern,//$scope.item.kdProdukIntern,
					"kdbarcode": kdbarcode,//$scope.item.kdBarcode,
					"kodebmn": kodebmn,//$scope.item.kodeBmn,
					"kodeexternal": kodeexternal,//$scope.item.kodeExternal,
					"namaproduk": namaproduk,//$scope.item.namaProduk,
					"deskripsiproduk": deskripsiproduk,//$scope.item.deskripsiProduk,
					"keterangan": keterangan,//$scope.item.keterangan,
					"namaexternal": namaexternal,//$scope.item.namaExternal,
					"reportdisplay": reportdisplay,//$scope.item.reportDisplay,
					// "objectdetailjenisprodukfk" : $scope.item.jenisProduk.id,
					"objectdetailjenisprodukfk": objectdetailjenisprodukfk,//$scope.item.detailJenisProduk.id,
					"objectkategoryprodukfk": objectkategoryprodukfk,//$scope.item.kategoryProduk.id,
					"objectgenerikfk": objectgenerikfk,//$scope.item.jenisProduk.id,
					"objectgprodukfk": objectgprodukfk,//$scope.item.gProduk.id,
					"objectlevelprodukfk": objectlevelprodukfk,//$scope.item.levelProduk.id,
					"isprodukintern": isprodukintern,//$scope.item.isProdukIntern,
					"objectdepartemenfk": objectdepartemenfk,//1,
					"objectfungsiprodukfk": objectfungsiprodukfk,//$scope.item.fungsiProduk.id,
					"objectbentukprodukfk": objectbentukprodukfk,//$scope.item.bentukProduk.id,
					"objectbahanprodukfk": objectbahanprodukfk,//$scope.item.bahanProduk.id,
					"objecttypeprodukfk": objecttypeprodukfk,//$scope.item.typeProduk.id,
					"objectwarnaprodukfk": objectwarnaprodukfk,//$scope.item.warnaProduk.id,
					"kekuatan": kekuatan,//$scope.item.kekuatan,
					"objectmerkprodukfk": objectmerkprodukfk,//$scope.item.merkProduk.id,
					"objectdetailobatfk": objectdetailobatfk,//$scope.item.detailObat.id,
					"spesifikasi": spesifikasi,//$scope.item.spesifikasi,
					"objectgolonganprodukfk": objectgolonganprodukfk,//$scope.item.golonganProduk.id,
					"objectdetailgolonganprodukfk": objectdetailgolonganprodukfk,//$scope.item.detailGolonganProduk.id,
					"objectsatuanstandarfk": objectsatuanstandarfk,//$scope.item.satuanStandar.id,
					"objectsatuanbesarfk": objectsatuanbesarfk,//$scope.item.satuanBesar.id,
					"objectsatuankecilfk": objectsatuankecilfk,//$scope.item.satuanKecil.id,
					"qtykalori": qtykalori,//$scope.item.qtyKalori,
					"qtykarbohidrat": qtykarbohidrat,//$scope.item.qtyKarbohidrat,
					"qtylemak": qtylemak,//$scope.item.qtyLemak,
					"qtyporsi": qtyporsi,//$scope.item.qtyPorsi,
					"qtyprotein": qtyprotein,//$scope.item.qtyProtein,
					"objectjenisperiksafk": objectjenisperiksafk,//$scope.item.jenisperiksa.id,
					"objectjenisperiksapenunjangfk": objectjenisperiksapenunjangfk,//$scope.item.jenisPeriksaPenunjang.id,
					"nilainormal": nilainormal,//$scope.item.nilaiNormal,
					"bahansamplefk": bahansamplefk,//$scope.item.bahanSample.id,
					"golongandarahfk": golongandarahfk,//$scope.item.golonganDarah.id,
					"rhesusfk": rhesusfk,//$scope.item.rhesus.id,
					"objectaccountfk": objectaccountfk,//$scope.item.account.id,
					"verifikasianggaran": verifikasianggaran,//$scope.item.verifikasiAnggaran.id,
					"objectstatusprodukfk": objectstatusprodukfk,//$scope.item.statusProduk.id,
					"isarvdonasi": isarvdonasi,//$scope.item.IsVaksinDonasi.namaExternal,
					"isnarkotika": isnarkotika,//$scope.item.IsNarkotika.namaExternal,
					"ispsikotropika": ispsikotropika,//$scope.item.IsPsikotropika.namaExternal,
					"isonkologi": isonkologi,//$scope.item.IsOnkologi.namaExternal,
					"isoot": isoot,//$scope.item.Oot.namaExternal,
					"isprekusor": isprekusor,//$scope.item.IsPrekusor.namaExternal,
					"isvaksindonasi": isvaksindonasi,//$scope.item.IsVaksinDonasi.namaExternal,
					"objectprodusenprodukfk": objectprodusenprodukfk,//1,
					"objectrekananfk": objectrekananfk,//$scope.item.rekanan.id,
					"objectunitlaporanfk": 1,
					"qproduk": null,
					"qtyjualterkecil": null,
					"qtysatukemasan": null,
					"qtyterkecil": null,
					"kdprodukintern": null,
					"objectsediaanfk": objectsediaanfk,
					"objectstatusbarangfk": 1,
					"tglproduksi": "2017-07-12",
					"status": null,
					"objectjenisgenerikfk": null,
					"poinmedis": null
				}
				if ($scope.item.id != undefined) {
					medifirstService.post('sysadmin/master/save-data-produk', objSave).then(function (e) {
						console.log(JSON.stringify(e.data));
						$scope.item = {};
						$state.go("MasterProduk")
					});
				} else if ($scope.item.id == undefined) {
					medifirstService.post('sysadmin/master/save-data-produk', objSave).then(function (e) {
						console.log(JSON.stringify(e.data));
						$scope.item = {};
						var confirm = $mdDialog.confirm()
							.title('Caution')
							.textContent('Apakah Anda Akan Menambah Data Lagi?')
							.ariaLabel('Lucky day')
							.cancel('Ya')
							.ok('Tidak')
						$mdDialog.show(confirm).then(function () {
							$state.go("MasterProduk");
						})
					});
				}
			}

			$scope.batal = function () {
				$scope.showEdit = false;
				$scope.item = {};
			}
			///////////////////////////////////////////////////////////////////		END			//////////////////////////////////////////////////////////////			
		}
	]);
});
