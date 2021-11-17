define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('InputPaketCtrl', ['$scope', '$state', 'ModelItem', '$mdDialog', 'MedifirstService',
		function ($scope, $state, ModelItem, $mdDialog, medifirstService) {
			$scope.item = {};
			$scope.isRouteLoading = false;
			$scope.dataVOloaded = true;
			$scope.now = new Date();
			var dataLoad = {}
			$scope.kembali = function () { $state.go('MasterPaket') }
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
					medifirstService.get("sysadmin/master/get-paketbyid?idProduk=" + $scope.item.id, true).then(function (e) {
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
						$scope.item.kdProduk = e.data[0].id;
						$scope.item.kdProdukIntern = e.data[0].kdproduk_intern;
						$scope.item.kdBarcode = e.data[0].kdbarcode;
						$scope.item.kodeBmn = e.data[0].kodebmn;
						$scope.item.kodeExternal = e.data[0].kodeexternal;
						$scope.item.namaProduk = e.data[0].namapaket;
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
				if ($scope.item.namaProduk == undefined) {
					alert("Nama Paket Kosong!!!")
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
				if ($scope.item.namaProduk == undefined) {
					alert("Nama Paket Kosong!!!")
					return
				}
				var idProduk = null
				if ($scope.item.id != undefined) {
					idProduk = $scope.item.id
				}

				var namaPaket = null
				if ($scope.item.namaProduk != undefined){
					namaPaket = $scope.item.namaProduk
				}

				// if($scope.item.id !=undefined){
				var objSave = {
					"id": idProduk,
					"kdprofile": 21,
					"statusenabled": $scope.item.StatusEnabledT.id,//true,
					// "statusenabled": $scope.item.StatusEnabledT.status
					"namapaket": namaPaket,//$scope.item.kdProduk,
				}
				if ($scope.item.id != undefined) {
					medifirstService.post('sysadmin/master/save-data-paket', objSave).then(function (e) {
						console.log(JSON.stringify(e.data));
						$scope.item = {};
						$state.go("MasterPaket")
					});
				} else if ($scope.item.id == undefined) {
					medifirstService.post('sysadmin/master/save-data-paket', objSave).then(function (e) {
						console.log(JSON.stringify(e.data));
						$scope.item = {};
						var confirm = $mdDialog.confirm()
							.title('Caution')
							.textContent('Apakah Anda Akan Menambah Data Lagi?')
							.ariaLabel('Lucky day')
							.cancel('Ya')
							.ok('Tidak')
						$mdDialog.show(confirm).then(function () {
							$state.go("MasterPaket");
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
