define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('InformasiJadwalPelayananDokterCtrl', ['$rootScope', '$scope', 'ModelItem', 'DateHelper', 'MedifirstService',
		function ($rootScope, $scope, ModelItem, dateHelper, medifirstService) {
			$scope.item = {};
			$scope.now = new Date();
			$scope.item.periodeAwal = new Date();
			$scope.item.periodeAkhir = new Date();
			$scope.isRouteLoading = false;
			$scope.item.HariAwal = [];
			var IdJadwal = "";
			loadDataCombo();

			$scope.formatTanggal = function (tanggal) {
				return moment(tanggal).format('DD-MMM-YYYY HH:mm');
			}

			function loadDataCombo() {
				$scope.item.periodeAwal = moment($scope.now).format('YYYY-MM-DD 00:00')
				$scope.item.periodeAkhir = moment($scope.now).format('YYYY-MM-DD 23:59')

				medifirstService.getPart("humas/get-daftar-combo-pegawai", true, true, 20).then(function (data) {
					$scope.ListDokter = data;
				});

				medifirstService.get("humas/get-daftar-combo?", true).then(function (dat) {
					$scope.ListRuangan = dat.data.dataruangan;
					$scope.ListHari = dat.data.hari;
				});
				LoadData();
			}

			function LoadData() {
				$scope.isRouteLoading = true;
				var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm')
				var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm')
				var dokter = "";
				if ($scope.item.dokter != undefined) {
					dokter = $scope.item.dokter.id
				}
				var ruangan = "";
				if ($scope.item.ruangan != undefined) {
					ruangan = $scope.item.ruangan.id
				}
				medifirstService.get("humas/get-daftar-jadwal-dokter?"
					+ "&dokterId=" + dokter
					+ "&ruanganId=" + ruangan, true).then(function (dat) {
						var datas = dat.data.data;
						$scope.isRouteLoading = false;
						$scope.sourceJadwal = new kendo.data.DataSource({
							data: datas,
							group: [
								{ field: "namaruangan" }
							],
						});
					})
			}

			$scope.columndataMasterDataJadwal = {
				selectable: 'row',
				pageable: true,
				toolbar: [
					{
						name: "add", text: "Tambah",
						template: '<button ng-click="TambahInformasi()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah</button>'
					},

				],
				columns :[
				{
					"field": "namalengkap",
					"title": "Nama Dokter",
					"width": "220px"
				},
				{
					"field": "hari",
					"title": "Hari",
					"width": "220px"
				},
				// {
				// 	"field": "hariawal",
				// 	"title": "Hari Awal",
				// 	"width": "100px"
				// },
				// {
				// 	"field": "hariakhir",
				// 	"title": "Hari Akhir",
				// 	"width": "100px"
				// },
				{
					"field": "jammulai",
					"title": "Jam Mulai",
					"width": "100px"
				},
				{
					"field": "jamakhir",
					"title": "Jam Akhir",
					"width": "100px"
				},
				{
					"field": "quota",
					"title": "Kuota",
					"width": "100px"
				},
				{
					"field": "keterangan",
					"title": "Keterangan",
					"width": "200px"
				},
				{
					"command": [{
						text: "Edit",
						click: editData2,
						imageClass: "k-icon k-i-pencil"
					},
					{
						text: "Hapus",
						click: hapusData2,
						imageClass: "k-icon k-delete"
					}],
					title: "",
					width: "120px",
				}
			]};
			function hapusData2(e) {
				e.preventDefault();

				var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

				if (!dataItem) {
					toastr.error("Data Tidak Ditemukan");
					return;
				}
				var objSave = {
					idJadwal : dataItem.idjadwalpegawai,
					objectpegawaifk : dataItem.objectpegawaifk
				}
				$scope.isRouteLoading = true;	
				medifirstService.post('humas/delete-informasi-dokter', objSave).then(function (res) {
					$scope.isRouteLoading = false;				
					LoadData();
				});

			}
			function editData2(e) {
				e.preventDefault();
				var grid = this;
				var row = $(e.currentTarget).closest("tr");
				var tr = $(e.target).closest("tr");
				var dataItem = this.dataItem(tr);
				IdJadwal = dataItem.idjadwalpegawai
				$scope.item.ruanganInput = { id:dataItem.objectruanganfk, namaruangan: dataItem.namaruangan };
				// $scope.item.HariAwal = { id: $scope.dataSelected.objecthariawal, namahari: $scope.dataSelected.hariawal };
				// $scope.item.HariAkhir = { id: $scope.dataSelected.objecthariakhir, namahari: $scope.dataSelected.hariakhir };
				
				if (dataItem.hari) {
					$scope.item.HariAwal =[]
					let split = dataItem.hari.split(',')
					if(split.length>0){
						for (var i = 0; i < split.length; i++) {
							const elem =	split[i]
							for (var z = 0; z < $scope.ListHari.length; z++) {
								const elem2 = $scope.ListHari[z]
								if(elem.indexOf( elem2.namahari)> -1){
									$scope.item.HariAwal.push(elem2)
									break
								}
							}
						}
					}
				}
				if (dataItem.jammulai != undefined) {
					$scope.item.jamAwal = new Date(moment(new Date()).format('YYYY-MM-DD '+dataItem.jammulai));
				}
				if (dataItem.jamakhir != undefined) {
					$scope.item.jamAkhir = new Date(moment(new Date()).format('YYYY-MM-DD '+ dataItem.jamakhir));
				}
				$scope.ListDokter.add( { id: dataItem.objectpegawaifk, namalengkap: dataItem.namalengkap })
				$scope.item.dokterInput = { id: dataItem.objectpegawaifk, namalengkap: dataItem.namalengkap };
				$scope.item.KeteranganJadwal =dataItem.keterangan;
				if(dataItem.quota)
				$scope.item.quota =dataItem.quota;
				$scope.winJadwalPraktek.center().open()
			}
			$scope.kl = function (dataSelected) {
				if (dataSelected != undefined) {
					$scope.dataSelected = dataSelected;
				}
			}

			$scope.SearchData = function () {
				LoadData();
			}

			$scope.HapusInformasi = function(){
				$scope.isRouteLoading = true;
				if ($scope.dataSelected == undefined) {	
					toastr.error("Data Belum Dipilih !!!")
					return;
				}

				var objSave = {
					idJadwal : $scope.dataSelected.idjadwalpegawai,
					objectpegawaifk : $scope.dataSelected.objectpegawaifk
				}
				medifirstService.post('humas/delete-informasi-dokter', objSave).then(function (res) {
					$scope.isRouteLoading = false;				
					LoadData();
				});
			}

			$scope.TambahInformasi = function () {
				// if ($scope.dataSelected != undefined) {					
				
				// }else{
					$scope.dataSelected = undefined
					clear()
				// }
				$scope.winJadwalPraktek.center().open();

			}
			function clear (){
				IdJadwal = "";
				delete $scope.item.ruanganInput 
				$scope.item.HariAwal =[]
				delete $scope.item.jamAkhir 
				delete $scope.item.jamAwal 
				delete $scope.item.dokterInput 
				delete $scope.item.KeteranganJadwal
			}

			function BatalInputJadwal() {
				IdJadwal = "";
				$scope.item.ruanganInput = undefined;
				$scope.item.HariAwal = [];
				// $scope.item.HariAwal = undefined;
				// $scope.item.HariAkhir = undefined;
				$scope.item.jamAwal = undefined;
				$scope.item.jamAkhir = undefined;
				$scope.item.dokterInput = undefined;
				$scope.item.KeteranganJadwal = undefined;
				$scope.dataSelected = undefined
				
				$scope.winJadwalPraktek.close();
			}

			$scope.BatalInput = function () {
				BatalInputJadwal();
			}

			$scope.SimpanInput = function () {
				$scope.isRouteLoading = true;
				if ($scope.item.ruanganInput == undefined) {
					toastr.warning("Peringatan, Ruangan Harus Diisi!")
					return;
				}

				if ($scope.item.dokterInput == undefined) {
					toastr.warning("Peringatan, Dokter Harus Diisi!")
					return;
				}

				var listHari = '';
				if($scope.item.HariAwal.length != 0){
					var a = ""
                    var b = ""
                    for (var i = 0; i < $scope.item.HariAwal.length; i++){
                    	if (i == $scope.item.HariAwal.length - 1){
                    		listHari += $scope.item.HariAwal[i].namahari
                    	} else {
                    		listHari += $scope.item.HariAwal[i].namahari + ", "
                    	}
                    }
				}

				var objSave = {
					"idjadwal": IdJadwal,
					"objectpegawaifk": $scope.item.dokterInput != undefined ? $scope.item.dokterInput.id : null,
					"objectruanganfk": $scope.item.ruanganInput != undefined ? $scope.item.ruanganInput.id : null,
					"hari": listHari != undefined ? listHari : null,
					// "objecthariawal": $scope.item.HariAwal != undefined ? $scope.item.HariAwal.id : null,
					// "objecthariakhir": $scope.item.HariAkhir != undefined ? $scope.item.HariAkhir.id : null,
					"jammulai": $scope.item.jamAwal != undefined ? moment($scope.item.jamAwal).format('HH:mm') : null,
					"jamakhir": $scope.item.jamAkhir != undefined ? moment($scope.item.jamAkhir).format('HH:mm') : null,
					"keterangan": $scope.item.KeteranganJadwal != undefined ? $scope.item.KeteranganJadwal : "",
					"quota": $scope.item.quota ? $scope.item.quota :null,
				}
				$scope.isSave =true
				medifirstService.post('humas/save-informasi-dokter', objSave).then(function (res) {
					$scope.isRouteLoading = false;
					$scope.isSave =false
					BatalInputJadwal();
					LoadData();
				});

			}



			$scope.selectOptionsHari = {
                placeholder: "Pilih Hari...",
                dataTextField: "namahari",
                dataValueField: "id",
                // dataSource:{
                //     data: $scope.listRuangan
                // },
                autoBind: false,                       
            }; 
			//////////////////////////////////////////////////////////////////////		END		///////////////////////////////////////////////////////////////////////////////////////////
		}
	]);
});