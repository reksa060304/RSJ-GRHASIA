define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('DataProfileCtrl', ['$scope', '$state', 'ModelItem', '$mdDialog', 'MedifirstService', '$q', 'CacheHelper',
		function ($scope, $state, ModelItem, $mdDialog, medifirstService, $q, cacheHelper) {
			$scope.isRouteLoading = false;
			$scope.item = {};
			$scope.ShowEdit = true;
			$scope.ShowSimpan = false;
			$scope.isDisable = true;
			var idProfile = '';
			var JenisOrder = '';
			$scope.imagePath = '../app/images/svg/washedout.png'
			FormLoad();
			LoadCache();

			function FormLoad() {
				$scope.listStatusEnabled = [
					{ "id": 1, "status": "t", "statusenabled": "Aktif" },
					{ "id": 0, "status": "f", "statusenabled": "Tidak Aktif" }
				];
				$q.all([
					medifirstService.get("sysadmin/get-list-combo"),
					medifirstService.get("sysadmin/general/get-combo-address"),
				]).then(function (result) {
					$scope.isRouteLoading = false;
					var dataComboMaster = result[0].data;
					var dataComboAlamat = result[1].data;

					$scope.listJenisProfile = dataComboMaster.jenisprofile
					$scope.listDataKecamatan = dataComboAlamat.kecamatan
					$scope.listDataKecamatan = dataComboAlamat.kecamatan
					$scope.listDataKotaKabupaten = dataComboAlamat.kotakabupaten
					$scope.listDataPropinsi = dataComboAlamat.propinsi
				})
			}

			function LoadCache() {
				var chacePeriode = cacheHelper.get('DataProfileCtrl');
				if (chacePeriode != undefined) {
					idProfile = chacePeriode[0];
					JenisOrder = chacePeriode[1];					
					var chacePeriode = {
						0: '',
						1: '',
						2: '',
						3: '',
						4: '',
						5: '',
						6: ''
					}
					cacheHelper.set('DataProfileCtrl', chacePeriode);
					load();
				} else {
					load();					
				}
			}

			function load() {
				if (JenisOrder == '') {
					$scope.isDisable = true;
					$scope.isRouteLoading = true;
					medifirstService.get('sysadmin/get-data-profile?statusProfile=true', true).then(function (data) {						
						var datas = data.data.profile[0];
						$scope.isRouteLoading = false;
						if (datas.statusenabled = "1") {
							$scope.item.StatusEnabled = { id: 1, status: "t", statusenabled: "Aktif" }				
						}else{
							$scope.item.StatusEnabled = { id: 2, status: "f", statusenabled: "Tidak Aktif" }
						}
						$scope.item.kdProfile = datas.idprofile;
						$scope.item.TglRegistrasi = new Date(moment(datas.tglregistrasi).format('YYYY-MM-DD HH:mm'));
						$scope.item.namaProfile = datas.namaprofile;
						$scope.item.jenisProfile = {id:datas.objectjenisprofilefk , jenisprofile:datas.jenisprofile};

						$scope.item.alamatLengkap = datas.alamatlengkap;
						$scope.item.kodePos = datas.kodepos;

						$scope.item.Faksimile = datas.faksimile;
						$scope.item.Telepon = datas.fixedphone;
						$scope.item.Email = datas.alamatemail;
						$scope.item.Website = datas.website;
						$scope.item.Dinas = datas.namapemerintahan;
						$scope.item.image = datas.login;

						getDataByKodePos($scope.item.kodePos);
					})
				}else if (JenisOrder == 'InputProfile') {
					$scope.isKode = true;
					$scope.isDisable = false;
					$scope.isRouteLoading = true;
					$scope.isRouteLoading = false;
					$scope.ShowEdit = false;
					$scope.ShowSimpan = true;	
					$scope.item.TglRegistrasi = moment(new Date()).format('YYYY-MM-DD HH:mm');
				}else if (JenisOrder == 'EditProfile') {
					$scope.isRouteLoading = true;
					$scope.ShowEdit = false;
					$scope.ShowSimpan = true;				
					medifirstService.get('sysadmin/get-data-profile?idProfile=' + idProfile, true).then(function (data) {	
						$scope.isDisable = false;					
						var datas = data.data.profile[0];
						$scope.isRouteLoading = false;
						if (datas.statusenabled = "1") {
							$scope.item.StatusEnabled = { id: 1, status: "t", statusenabled: "Aktif" }				
						}else{
							$scope.item.StatusEnabled = { id: 2, status: "f", statusenabled: "Tidak Aktif" }
						}
						$scope.item.kdProfile = datas.idprofile;
						$scope.item.TglRegistrasi = new Date(moment(datas.tglregistrasi).format('YYYY-MM-DD HH:mm'));
						$scope.item.namaProfile = datas.namaprofile;
						$scope.item.jenisProfile = {id:datas.objectjenisprofilefk , jenisprofile:datas.jenisprofile};

						$scope.item.alamatLengkap = datas.alamatlengkap;
						$scope.item.kodePos = datas.kodepos;

						$scope.item.Faksimile = datas.faksimile;
						$scope.item.Telepon = datas.fixedphone;
						$scope.item.Email = datas.alamatemail;
						$scope.item.Website = datas.website;
						$scope.item.Dinas = datas.namapemerintahan;
						$scope.item.image = datas.login;

						getDataByKodePos($scope.item.kodePos);
					})
				}
			}

			function getDataByKodePos(kdPos){
				if (!kdPos) return;
				$scope.isBusy = true;
				medifirstService.get('sysadmin/general/get-alamat-bykodepos?kodePos=' + kdPos).then(function (res) {
					if (res.data.data.length > 0) {
						var data = {
							id: res.data.data[0].objectdesakelurahanfk,
							namadesakelurahan: res.data.data[0].namadesakelurahan,
							kodepos: res.data.data[0].kodepos,
							namakecamatan: res.data.data[0].namakecamatan,
							namakotakabupaten: res.data.data[0].namakotakabupaten,
							namapropinsi: res.data.data[0].namapropinsi,
							objectkecamatanfk: res.data.data[0].objectkecamatanfk,
							objectkotakabupatenfk: res.data.data[0].objectkotakabupatenfk,
							objectpropinsifk: res.data.data[0].objectpropinsifk,
							desa: res.data.data[0].namadesakelurahan,
						}
						// $scope.listDataKelurahan.push(data)
						$scope.listDataKelurahan = data;
						$scope.item.desaKelurahan = data;
						$scope.item.kecamatan = { id: data.objectkecamatanfk, namakecamatan: data.namakecamatan }
						$scope.item.kotaKabupaten = { id: data.objectkotakabupatenfk, namakotakabupaten: data.namakotakabupaten }
						$scope.item.propinsi = { id: data.objectpropinsifk, namapropinsi: data.namapropinsi }
					}
					$scope.isBusy = false;
				}, function (error) {
					$scope.isBusy = false;
				})
			}

			$scope.findKodePos = function (kdPos) {
				if (!kdPos) return;
				$scope.isBusy = true;
				medifirstService.get('sysadmin/general/get-alamat-bykodepos?kodePos=' + kdPos).then(function (res) {
					if (res.data.data.length > 0) {
						var data = {
							id: res.data.data[0].objectdesakelurahanfk,
							namadesakelurahan: res.data.data[0].namadesakelurahan,
							kodepos: res.data.data[0].kodepos,
							namakecamatan: res.data.data[0].namakecamatan,
							namakotakabupaten: res.data.data[0].namakotakabupaten,
							namapropinsi: res.data.data[0].namapropinsi,
							objectkecamatanfk: res.data.data[0].objectkecamatanfk,
							objectkotakabupatenfk: res.data.data[0].objectkotakabupatenfk,
							objectpropinsifk: res.data.data[0].objectpropinsifk,
							desa: res.data.data[0].namadesakelurahan,
						}
						// $scope.listDataKelurahan.push(data)
						$scope.listDataKelurahan = data;
						$scope.item.desaKelurahan = data;
						$scope.item.kecamatan = { id: data.objectkecamatanfk, namakecamatan: data.namakecamatan }
						$scope.item.kotaKabupaten = { id: data.objectkotakabupatenfk, namakotakabupaten: data.namakotakabupaten }
						$scope.item.propinsi = { id: data.objectpropinsifk, namapropinsi: data.namapropinsi }
					}
					$scope.isBusy = false;
				}, function (error) {
					$scope.isBusy = false;
				})
			}

			$scope.findAddress = function (desa) {
				if (desa.objectkecamatanfk)
					$scope.item.kecamatan = { id: desa.objectkecamatanfk, namakecamatan: desa.namakecamatan }
				if (desa.objectkotakabupatenfk)
					$scope.item.kotaKabupaten = { id: desa.objectkotakabupatenfk, namakotakabupaten: desa.namakotakabupaten }
				if (desa.objectpropinsifk)
					$scope.item.propinsi = { id: desa.objectpropinsifk, namapropinsi: desa.namapropinsi }
				if (desa.kodepos)
					$scope.item.kodePos = desa.kodepos
			}

			$scope.Edit = function(){
				$scope.ShowEdit = false;
				$scope.ShowSimpan = true;
				$scope.isDisable = false
			}

			$scope.batal = function(){
				$scope.ShowEdit = true;
				$scope.ShowSimpan = false;
				$scope.isDisable = true;
				$scope.item = {};
				FormLoad();
				load();
			}

			$scope.showPopUp = function () {
				$scope.popUpUpload.center().open()
			}

			$scope.UploadPhoto = function () {
				if ($scope.urlImage != undefined) {
					// saveImageToDirsaveImageToDir($scope.urlImage,'0182781')
					$scope.item.image = $scope.urlImage
					$scope.popUpUpload.close()
				} else {
					toastr.info('Gambar belum di pilih')
					return
				}
			}
			$scope.TutupPopUp = function () {
				if ($scope.urlImage != undefined)
					$scope.item.image = "../app/images/svg/no-image.svg"
				$scope.urlImage = undefined
				$scope.popUpUpload.close()
			}

			$scope.add = function () {
				$scope.item = {}
				$scope.item.image = "../app/images/svg/no-image.svg"
				$scope.myVar = 1
			}

			$scope.Batal = function () {
				$scope.item = {}
				$scope.item.image = "../app/images/svg/no-image.svg"
				$scope.myVar = 0
				load()
			}

			$scope.item.image = '../app/images/svg/no-image.svg'
			$("#photo").kendoUpload({
				localization: {
					"select": "Pilih Photo..."
				},
				async: {
					saveUrl: "save",
					removeUrl: "remove",
					autoUpload: false
				},
				multiple: false,
				select: function (e) {
					var ALLOWED_EXTENSIONS = [".jpeg", ".jpg", ".png"];
					var extension = e.files[0].extension.toLowerCase();
					if (ALLOWED_EXTENSIONS.indexOf(extension) == -1) {
						toastr.error('Mohon Pilih File Gambar (.jpg, .jpeg, .png)')
						e.preventDefault();
						// return
					}

					var fileInfo = e.files[0];
					var wrapper = this.wrapper;
					// debugger
					$scope.ImageUrlData = wrapper.context.value;
					setTimeout(function () {
						addPreview(fileInfo, wrapper);
						compress(e);
					});					
				}
			});

			function addPreview(file, wrapper) {
				var raw = file.rawFile;
				var reader = new FileReader();

				if (raw) {

					reader.onloadend = function () {
						var preview = $("<img class='img-responsive'>").attr("src", this.result);

						wrapper.find(".k-file[data-uid='" + file.uid + "'] .k-file-extension-wrapper")
							.replaceWith(preview);						
					};

					reader.readAsDataURL(raw);
					// const img = new Image();
				}
			}

			function compress(e) {
				var width = 312;
				var height = 285;
				var fileName = e.files[0].name;
				var reader = new FileReader();
				var raw = e.files[0].rawFile;
				reader.readAsDataURL(raw);
				reader.onload = event => {
					var img = new Image();
					img.src = event.target.result;
					img.onload = () => {
						var elem = document.createElement('canvas');

						elem.width = width;
						elem.height = height;

						var ctx = elem.getContext('2d');						
						ctx.drawImage(img, 0, 0, width, height);						
						$scope.urlImage = ctx.canvas.toDataURL('image/jpeg', 1);						
					},
						reader.onerror = error => console.log(error);
				};
			}

			$scope.Simpan= function(){
				if ($scope.item.StatusEnabled == undefined) {
					toastr.error('Status Harus di isi', 'Error')
                    return
				}

				if ($scope.item.namaProfile == undefined) {
					toastr.error('Nama Profile di isi', 'Error')
                    return
				}

				if ($scope.item.jenisProfile == undefined) {
					toastr.error('Jenis Profile di isi', 'Error')
                    return
				}

				var kdProfile = null;
				if ($scope.item.kdProfile != undefined) {
					kdProfile = $scope.item.kdProfile;
				}
				var TglRegis = moment(new Date()).format('YYYY-MM-DD HH:mm');
				if ($scope.item.TglRegistrasi != undefined) {
					TglRegis = moment($scope.item.TglRegistrasi).format('YYYY-MM-DD HH:mm');
				}				
				var objSave = {
					kdprofile: kdProfile,
					tglregistrasi: TglRegis,
					statusenabled: $scope.item.StatusEnabled.id,
					namalengkap: $scope.item.namaProfile,
					jenisprofilefk: $scope.item.jenisProfile.id,
					alamatlengkap: $scope.item.alamatLengkap != undefined ? $scope.item.alamatLengkap : '',
					kodepos : $scope.item.kodePos != undefined ? $scope.item.kodePos : null,
					desakelurahan : $scope.item.desaKelurahan != undefined ? $scope.item.desaKelurahan.id : null,
					kecamatan : $scope.item.kecamatan != undefined ? $scope.item.kecamatan.id : null,
					kabupaten : $scope.item.kotaKabupaten != undefined ? $scope.item.kotaKabupaten.id : null,
					provinsi : $scope.item.propinsi != undefined ? $scope.item.propinsi.id : null,
					faksimile : $scope.item.Faksimile != undefined ? $scope.item.Faksimile : null,
					phone : $scope.item.Telepon != undefined ? $scope.item.Telepon : null,
					website : $scope.item.Website != undefined ? $scope.item.Website : null,
					email : $scope.item.Email != undefined ? $scope.item.Email : null,
					dinas : $scope.item.Dinas != undefined ? $scope.item.Dinas : null,					
					login : $scope.item.image != undefined && $scope.item.image != "../app/images/svg/no-image.svg" ? $scope.item.image : null					
				}

				medifirstService.post('sysadmin/save-data-profile', objSave).then(function (e) {
					window.history.back();
                },function (error) {
                    // toastr.error(JSON.stringify(error.message),'Error')
                })
			}
			//** BATAS SUCI */
		}
	]);
});