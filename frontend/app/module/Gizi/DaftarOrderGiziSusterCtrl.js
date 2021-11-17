define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('DaftarOrderGiziSusterCtrl', ['$mdDialog', '$timeout', '$state', '$q', '$rootScope', '$scope', 'CacheHelper', 'DateHelper', 'MedifirstService',
		function ($mdDialog, $timeout, $state, $q, $rootScope, $scope, cacheHelper, dateHelper, medifirstService) {

			$scope.dataVOloaded = true;
			$scope.now = new Date();
			$scope.item = {};
			$scope.item.periodeAwal = new Date();
			$scope.item.periodeAkhir = new Date();
			$scope.item.tanggalPulang = new Date();
			// $scope.dataPasienSelected = {};
			$scope.item.jmlRows =50
			$scope.isRouteLoading = false;
			var dataMenuSiklus = [];
			var data2 = [];
			var addDataDetail = [];

			loadCombo();
			

			function loadCombo() {
				var chacePeriode = cacheHelper.get('cacheDaftarOrderGizi');
				if (chacePeriode != undefined) {

					var arrPeriode = chacePeriode.split('~');
					$scope.item.periodeAwal = new Date(arrPeriode[0]);
					$scope.item.periodeAkhir = new Date(arrPeriode[1]);
					$scope.item.tglpulang = new Date(arrPeriode[2]);
				} else {
					$scope.item.periodeAwal = new Date(moment($scope.now).format('YYYY-MM-DD 00:00:00'));
					$scope.item.periodeAkhir = new Date(moment($scope.now).format('YYYY-MM-DD 23:59:59'));
					$scope.item.tglpulang = $scope.now;
				}
				medifirstService.get('sysadmin/general/get-combo-pegawai',true,true,10).then(function(e){
					$scope.listPegawai = e.data
					for (let i = 0; i < e.data.length; i++) {
						const element = e.data[i];
						if(element.id == medifirstService.getPegawaiLogin().id){
							$scope.item.pengorder = element
							break
						}
					}
				})

				medifirstService.get("gizi/get-combo", false).then(function (data) {
					$scope.listKelas = data.data.kelas;
					$scope.listDepartemen = data.data.departemen;
					$scope.item.instalasi =data.data.departemen[20]
					$scope.listKelompokPasien = data.data.kelompokpasien;
					$scope.listJenisDiet = data.data.jenisdiet;
					$scope.optJenisDiet = {
                        placeholder: "Pilih Jenis Diet...",
                        dataTextField: "jenisdiet",
                        dataValueField: "id",
                        autoBind: false,
                    };
					$scope.listKategoriDiet = data.data.kategorydiet;
					$scope.listJenisWaktu = data.data.jeniswaktu;
					$scope.listMenu = data.data.produk;
					loadData();
				})
				
				// $scope.listStatus = manageKasir.getStatus();
			}
			// $scope.getIsiComboRuangan = function () {
			// 	$scope.listRuangan = $scope.item.instalasi.ruangan
			// }
			$scope.$watch('item.instalasi', function(newValue, oldValue) {
	            if (newValue != oldValue  ) {
	              $scope.listRuangan =newValue.ruangan
	            }
        });
			$scope.ClearSearch = function () {
				$scope.item = {};
				$scope.item.periodeAwal = $scope.now;
				$scope.item.periodeAkhir = $scope.now;

				$scope.SearchData();
			}

			$scope.formatTanggal = function (tanggal) {
				return moment(tanggal).format('DD-MMM-YYYY HH:mm');
			}
			$scope.formatTanggalNoTime = function (tanggal) {
				return moment(tanggal).format('DD-MMM-YYYY');
			}

			$scope.formatRupiah = function (value, currency) {
				return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
			}

			$scope.SearchData = function () {
				loadData()
			}
			function loadData() {
				dataMenuSiklus = [];
				$scope.isRouteLoading = true;
				var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm:ss');
				var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm:ss');

				var reg = ""
				if ($scope.item.noReg != undefined) {
					var reg = "&noreg=" + $scope.item.noReg
				}
				var rm = ""
				if ($scope.item.noRm != undefined) {
					var rm = "&norm=" + $scope.item.noRm
				}
				var nm = ""
				if ($scope.item.nama != undefined) {
					var nm = "&nama=" + $scope.item.nama
				}
				var ins = ""
				if ($scope.item.instalasi != undefined) {
					var ins = "&deptId=" + $scope.item.instalasi.id
				}
				var rg = ""
				if ($scope.item.ruangan != undefined) {
					var rg = "&ruangId=" + $scope.item.ruangan.id
				}
				var kp = ""
				if ($scope.item.kelompokpasien != undefined) {
					var kp = "&kelId=" + $scope.item.kelompokpasien.id
				}
				var dk = ""
				if ($scope.item.dokter != undefined) {
					var dk = "&dokId=" + $scope.item.dokter.id
				}
				var noorder = ""
				if ($scope.item.noOrder != undefined) {
					noorder = "&noorder=" + $scope.item.noOrder
				}
				var jenisDietId = ""
				if ($scope.item.jenisDiets != undefined) {
					jenisDietId = "&jenisDietId=" + $scope.item.jenisDiets.id
				}
				var jenisWaktuId = ""
				if ($scope.item.jenisWaktu != undefined) {
					jenisWaktuId = "&jenisWaktuId=" + $scope.item.jenisWaktu.id
				}
				var pengorder = ""
				if ($scope.item.pengorder != undefined) {
					pengorder = "&pengorderId=" + $scope.item.pengorder.id
				}
				var jmlRows = ""
				if ($scope.item.jmlRows != undefined) {
					jmlRows = "&jmlRows=" + $scope.item.jmlRows
				}


				medifirstService.get("gizi/get-daftar-order-detail?" +
					"tglAwal=" + tglAwal +
					"&tglAkhir=" + tglAkhir +
					reg + rm + nm + ins + rg + kp + dk + noorder + pengorder+jmlRows
					+ jenisDietId + jenisWaktuId)
					.then(function (data) {
						$scope.isRouteLoading = false;
						var result = data.data.data
						for (var i = 0; i < result.length; i++) {
						 	for (var j = 0; j < result[i].details.length; j++) {
						 		const det = result[i].details[j]
						 		det.jenisdiet =[]
						 		if(det.arrjenisdiet){
									var arr = det.arrjenisdiet.split(',') 
									if(arr.length > 0){
										for (var x = 0; x < arr.length; x++) {
											const jenis = arr[x]
											for (var z = 0; z < $scope.listJenisDiet.length; z++) {
												const diet = $scope.listJenisDiet[z]
												if( jenis == diet.id ){
													det.jenisdiet.push(diet) 
												}
											}
										}
									}
								}
						 	}
						}
						
			
			
						

						$scope.sourceGrid = new kendo.data.DataSource({
							data: result,
							pageSize: 10,
							total: data2.length,
							serverPaging: false,
							group: $scope.group

						});

						var chacePeriode = tglAwal + "~" + tglAkhir;
						cacheHelper.set('cacheDaftarOrderGizi', chacePeriode);
					});

			};
			// $scope.group = {
            //     field: "ruanganasal",
            //     aggregates: [{
            //         field: "ruanganasal",
            //         aggregate: "count"
            //     }]
            // };
			$scope.columnGrid = [
				// {
				// 	"template": "<input type='checkbox' class='checkbox' ng-click='onClick($event)' />",
				// 	"width": 30
				// },
				// {
				// 	"title": "<input type='checkbox' class='checkbox' ng-click='selectUnselectAllRow()' />",
				// 	template: "# if (statCheckbox) { #" +
				// 		"<input type='checkbox' class='checkbox' ng-click='selectRow(dataItem)' checked />" +
				// 		"# } else { #" +
				// 		"<input type='checkbox' class='checkbox' ng-click='selectRow(dataItem)' />" +
				// 		"# } #",
				// 	width: "30px"
				// 	},
				{
					"field": "tglorder",
					"title": "Tgl Order",
					"width": "80px",
					"template": "<span class='style-left'>{{formatTanggal('#: tglorder #')}}</span>"
				},
				{
					"field": "noorder",
					"title": "No Order",
					"width": "80px"
				},
				{
					"field": "tglmenu",
					"title": "Tgl Menu",
					"width": "80px",
					"template": "<span class='style-left'>{{formatTanggal('#: tglmenu #')}}</span>"
					// "template": "<span class='style-center'>{{formatTanggalNoTime('#: tglmenu #')}}</span>"
				},
				// {
				// 	"field": "noregistrasi",
				// 	"title": "No Reg",
				// 	"width": "80px",
				// },
				// {
				// 	"field": "nocm",
				// 	"title": "No RM",
				// 	"width": "70px",
				// },
				// {
				// 	"field": "namapasien",
				// 	"title": "Nama Pasien",
				// 	"width": "100px",
				// },
				// {
				// 	"field": "umurzz",
				// 	"title": "Umur",
				// 	"width": "80px",
				// },
				// {
				// 	"field": "tgllahir",
				// 	"title": "Tgl Lahir",
				// 	"width": "80px",
				// 	"template": "<span class='style-left'>{{formatTanggal('#: tgllahir #')}}</span>"
				// },
				// {
				// 	"field": "ruanganasal",
				// 	"title": "Ruangan Asal",
				// 	"width": "80px",
				// },
				// {
				// 	"field": "namakelas",
				// 	"title": "Kelas",
				// 	"width" : "50px",
				// },
				// {
				// 	"field": "jenisdiet",
				// 	"title": "Jenis Diet",
				// 	"width": "80px"
				// },
				// {
				// 	"field": "jeniswaktu",
				// 	"title": "Jenis Waktu",
				// 	"width":"60px"
				// },
				// {
				// 	"field": "pegawaiorder",
				// 	"title": "Pengorder",
				// 	"width":"100px",
				// 	"template": "<span class='style-left'>#: pegawaiorder #</span>"
				// },	
				{
					"field": "pengorder",
					"title": "Pengorder",
					"width": "80px"
				},
				// {
				// 	"field": "cc",
				// 	"title": "CC",
				// 	"width": "50px"
				// },
				// {
				// 	"field": "volume",
				// 	"title": "Frekuensi",
				// 	"width": "50px"
				// },
				{
					"field": "keteranganlainnya",
					"title": "Keterangan",
					"width": "120px"
				},
				// {
				// 	"field": "nokirim",
				// 	"title": "No Kirim",
				// 	"width": "80px",
				// 	"template": '# if( nokirim==null) {# - # } else {# #= nokirim # #} #'
				// },
			];
			$scope.selectedItem= [];
			$scope.onClickItem = function (e) {
				var element = $(e.currentTarget);

				var checked = element.is(':checked'),
					row = element.closest('tr'),
					grid = $("#kGridDetails").data("kendoGrid"),
					dataItem = grid.dataItem(row);
				if (checked) {
					var result = $.grep($scope.selectedItem, function (e) {
						return e.norec_op == dataItem.norec_op;
					});
					if (result.length == 0) {
						$scope.selectedItem.push(dataItem);
					} else {
						for (var i = 0; i < $scope.selectedItem.length; i++)
							if ($scope.selectedItem[i].norec_op === dataItem.norec_op) {
								$scope.selectedItem.splice(i, 1);
								break;
							}
						$scope.selectedItem.push(dataItem);
					}
					row.addClass("k-state-selected");
				} else {
					for (var i = 0; i < $scope.selectedItem.length; i++)
						if ($scope.selectedItem[i].norec_op === dataItem.norec_op) {
							$scope.selectedItem.splice(i, 1);
							break;
						}
					row.removeClass("k-state-selected");
				}
			}
			$scope.data2 = function (dataItem) {
				for (var i = 0; i < dataItem.details.length; i++) {
					dataItem.details[i].no = i + 1

				}
				return {
					dataSource: new kendo.data.DataSource({
						data: dataItem.details,

					}),

					selectable: true,
					columns: [
						{
							"template": "<input type='checkbox' class='checkbox' ng-click='onClickItem($event)' />",
							"width": 20
						},
						// {
						// 	"field": "tglmenu",
						// 	"title": "Tgl Menu",
						// 	"width": "50px",
						// 	"template": "<span class='style-center'>{{formatTanggalNoTime('#: tglmenu #')}}</span>"
						// },
						{
							"field": "ruangorder",
							"title": "Ruangan Asal",
							"width": "80px",
						},
						{
							"field": "jeniswaktu",
							"title": "Waktu",
							"width": "80px",
						},
						{
							"field": "kategorydiet",
							"title": "Kategori",
							"width": "80px",
						},
						{
							"field": "jenisdiet",
							"title": "Diet",
							"width": "100px",
							"template": "# for(var i=0; i < jenisdiet.length;i++){# <button class=\"k-button custom-button\" style=\"margin:0 0 5px\">#= jenisdiet[i].jenisdiet #</button> #}#",
                   
						},
						
						{
							"field": "noregistrasi",
							"title": "No Registrasi",
							"width": "50px",
						},
						{
							"field": "nocm",
							"title": "No RM",
							"width": "50px",
						},
						{
							"field": "namapasien",
							"title": "Nama Pasien",
							"width": "100px",
						},
					
						{
							"field": "namakelas",
							"title": "Kelas",
							"width": "50px",
						},
						{
							"field": "volume",
							"title": "Volume",
							"width": "50px",
						},
						{
							"field": "cc",
							"title": "CC",
							"width": "50px",
						},
						{
							"field": "cc",
							"title": "CC",
							"width": "50px",
						},
						{
							"field": "keteranganlainnya",
							"title": "Keterangan",
							"width": "120px",
						},
						{
							"field": "nokirim",
							"title": "No Kirim",
							"width": "80px",
							"template": '# if( nokirim==null) {# - # } else {# #= nokirim # #} #'
						},

						// {
						// 	"command": [{
						// 		text: "Hapus",
						// 		click: hapusOrder,
						// 		imageClass: "k-icon k-delete"
						// 	}
						// 		// ,{
						// 		// 	text: "Edit", 
						// 		// 	click: editOrder, 
						// 		// 	imageClass: "k-icon k-i-pencil"
						// 		// }
						// 	],
						// 	title: "",
						// 	width: "50px",
						// }


					]
				}
			};
			$scope.hapusPeritem = function(){
				if($scope.selectedItem.length == 0){
					toastr.error('Ceklis Peritem dulu')
					return
				}
				var data = {
					'orderpelayanan' : $scope.selectedItem
				}
				medifirstService.post('gizi/hapus-peritem-order',data).then(function(e){
					$scope.selectedItem =[]
					loadData()

				})
			}
			function hapusOrder(e) {
				e.preventDefault();
				var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

				if (!dataItem) {
					toastr.error("Data Tidak Ditemukan");
					return;
				}
				if (dataItem.nokirim != null) {
					toastr.error("Menu sudah dikirim tidak bisa dihapus");
					return;
				}
				var confirm = $mdDialog.confirm()
					.title('Peringatan')
					.textContent('Apakah anda yakin mau menghapus data ? ')
					.ariaLabel('Lucky day')
					.cancel('Tidak')
					.ok('Ya')
				$mdDialog.show(confirm).then(function () {

					var itemDelete = {
						"norec_op": dataItem.norec_op
					}
					medifirstService.post('gizi/delete-orderpelayanan-gizi',itemDelete).then(function (e) {
						if (e.status === 201) {
							loadData();

						}
					})

				})

			}

			$scope.klikGrid = function (dataPasienSelected) {
				$scope.dataPasienSelected = dataPasienSelected
			}
			$scope.pop ={}
			$scope.pop.jenisDiet =[]
			$scope.Edit = function () {
				if ($scope.dataPasienSelected == undefined) {
					toastr.error('Pilih data dulu')
					return
				}
				// for (var i = 0; i < $scope.dataPasienSelected.details.length; i++) {
				// 	if ($scope.dataPasienSelected.details[i].nokirim !== null){
				// 		var status = true
				// 		break
				// 	}
				// }

				// if (status){
				// if ($scope.dataPasienSelected.details[0].nokirim != '-') {
				// 	toastr.error('Menu sudah dikirim, tidak bisa diedit')
				// 	return
				// }
				var select = $scope.dataPasienSelected
				select.tglmenu = new Date(select.tglmenu)
				$scope.pop = select
				$scope.pop.jenisDiet =[]
				if( select.details[0].jenisdiet.length > 0){
					for (var i = 0; i < select.details[0].jenisdiet.length; i++) {
						const jen =	select.details[0].jenisdiet[i]
						$scope.pop.jenisDiet.push({id:jen.id,jenisdiet:jen.jenisdiet})
					}
				}
				$scope.pop.jenisWaktu = {id: select.details[0].objectjeniswaktufk,jeniswaktu: select.details[0].jeniswaktu}
				// $scope.pop.jenisDiet = {id: select.details[0].objectjenisdietfk,jenisdiet: select.details[0].jenisdiet}
				$scope.pop.kategoriDiet = {id: select.details[0].objectkategorydietfk,kategorydiet: select.details[0].kategorydiet}
				$scope.pop.keterangan =select.details[0].keteranganlainnya
			
				$scope.popUpOrder.center().open()
				// cacheHelper.set('cacheEditOrderGizi', cache);
				// $state.go('EditOrderGizi')

			}
			
			$scope.save = function(){
				if ($scope.pop.jenisDiet == undefined) {
					toastr.error('Jenis Diet belum di pilih !')
					return
				}
				if ($scope.pop.jenisDiet.length == 0) {
					toastr.error('Jenis Diet belum di pilih !')
					return
				}
				if ($scope.pop.kategoriDiet == undefined) {
					toastr.error('Kategori Diet belum di pilih !')
					return
				}
				if ($scope.pop.jenisWaktu == undefined) {
					toastr.error('Jenis Waktu belum di pilih')
					return
				}

				var ket = ''
				if ($scope.pop.keterangan != undefined) {
					ket = $scope.pop.keterangan
				}
				var jenisDiet = ""
            	if ($scope.pop.jenisDiet.length != 0) {
                    var a = ""
                    var b = ""
                    for (var i = $scope.pop.jenisDiet.length - 1; i >= 0; i--) {
                  		var c = $scope.pop.jenisDiet[i].id
                        b = "," + c
                        a = a + b
                    }
                    jenisDiet = a.slice(1, a.length)
                }
				$scope.tombolSimpanVis = true;
				var details  =[]
				for (var i = 0; i < $scope.dataPasienSelected.details.length; i++) {
					details.push({
						keterangan : ket,
						volume : null,
						cc : null,
						objectjenisdietfk : $scope.pop.jenisDiet.id,
						objectkategorydietfk : $scope.pop.kategoriDiet.id,
						nocmfk:$scope.dataPasienSelected.details[i].nocmfk ,
						norec_pd: $scope.dataPasienSelected.details[i].norec_pd,
						objectkelasfk :$scope.dataPasienSelected.details[i].objectkelasfk,
						objectruanganlastfk:$scope.dataPasienSelected.details[i].objectruanganfk
					})
				
				}
			
				var objSave = {
					'strukorder' : {
						"norec_so": $scope.pop.norec,
						"jenisorder": 1,
						"tglmenu" : moment($scope.pop.tglmenu).format('YYYY-MM-DD HH:mm'),
						"tglorder": $scope.pop.tglorder,
						"qtyproduk": details.length,
						"details": details,
						"jeniswaktufk": $scope.pop.jenisWaktu.id,
						"jenisdietfk":jenisDiet
					}
				}
	
			
				medifirstService.post('gizi/save-order-gizi', objSave).then(function (result) {
					$scope.tombolSimpanVis = false;
					$scope.pop ={}
					$scope.pop.jenisDiet=[]
					$scope.popUpOrder.close();
					loadData()
			
				},function (error){
					$scope.tombolSimpanVis = false;
				})
			}
			$scope.batalEdit = function(){
				$scope.pop ={}
				$scope.popUpOrder.close();
			}
			$scope.hapus = function(){
				if($scope.dataPasienSelected == undefined){
					toastr.error('Pilih data dulu')
					return
				}
				medifirstService.post('gizi/hapus-order-gizi',{norec:$scope.dataPasienSelected.norec}).then(function(e){
					loadData();
				})
			}
			
			/*END */


		}
	]);
});