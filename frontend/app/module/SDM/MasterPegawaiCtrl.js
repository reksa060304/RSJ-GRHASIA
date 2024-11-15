define(['initialize', 'Configuration'], function (initialize, configuration) {
	'use strict';
	var baseTransaksi = configuration.baseApiBackend; 
	initialize.controller('MasterPegawaiCtrl', ['$scope', '$state', 'ModelItem', '$mdDialog', 'MedifirstService', 'CacheHelper', 'DateHelper', 
		function ($scope, $state, ModelItem, $mdDialog, medifirstService, cacheHelper, dateHelper) {
			$scope.namapelatihan = false;
			$scope.namapelatihancbx = true;
			$scope.isRouteLoading = false;
			$scope.item = {};
			$scope.itemKeluarga = {};
			$scope.itemPendidikan = {};
			$scope.itemPelatihan = {};
			$scope.itemLogin = {};
			$scope.itemHukumanDisiplin = {};
			$scope.itemCuti = {};
			$scope.itemLogin.idlogin = undefined;
			$scope.itemLogin.pegawaiId = undefined;
			$scope.itemJabatan = {};
			$scope.itemPandG = {};
			$scope.itemGajiBerkala = {};
			$scope.itemSip = {};
			$scope.itemStr = {};
			$scope.itemTelp = [];
			$scope.item.no = undefined;
			$scope.item.idPegawai = undefined;
			$scope.item.PasswordDefault = undefined;
			$scope.item.masakerjatambahan = 0;
			$scope.item.masakerjatambahantahun = 0;
			$scope.item.masakerjatambahanbulan = 0;
			$scope.now = new Date();
			var dataKeluarga = [];
			var dataPegawai = [];
			var dataRiwayatPendidikan = [];
			var dataRiwayatJabatan = [];
			var dataKomponenGajiAdd = [];
			var dataHukumanDisiplin = [];
			var dataKomponenGajiAdds = [];
			var dataKomponenGajiDel = [];
			var dataKomponenGajiDels = [];
			var dataRiwayatPangkatGolongan = [];
			var dataRiwayatGajiBerkala = [];
			var dataSip = [];
			var dataStr = [];
			var dataNoTelp = [];
			var dataCuti = [];
			var dataCutiAwal = [];
			var objSave = [];
			var objUpload = [];
			var dataRiwayatPelatihan = [];
			var jenisCache = "";
			var pensiunCache = "";
			var penyelenggara = "";
			$scope.loginDisabled = false;
			FormLoad();

			$scope.yearUngkul = {
                start: "decade",
                depth: "decade"
            }
			// LoadCache();
			$scope.clickpenyelenggara = function () {
				if($scope.itemPelatihan.penyelenggara.id == 1){
					// console.log('internal');
					$scope.namapelatihan = false;
					$scope.namapelatihancbx = true;
					// penyelenggara = $scope.itemPelatihan.namaPelatihan2.namapelatihan
				}else{
					// console.log('eksternal');
					// penyelenggara = $scope.itemPelatihan.namaPelatihan
					$scope.namapelatihan = true;
					$scope.namapelatihancbx = false;
					$scope.itemPelatihan.namaPelatihan = undefined;
				}
			}
			console.log(medifirstService.getKelompokUser());
			if (medifirstService.getKelompokUser() == 'diklit') {
				// console.log('okray');
				$scope.nondiklat = true
			}
			
			$scope.ListPenyelenggara = [
				{
					"id": 1,
					"penyelenggara": "Internal"
				},
				{
					"id": 2,
					"penyelenggara": "Eksternal"
				},
			]
			function ClearAll() {
				$scope.item = {};
			};

			function ClearDataKeluarga() {
				$scope.itemKeluarga = {};
				// $scope.itemKeluarga.tglLahir=moment($scope.now).format("DD-MM-YYYY");				
			};
			function ClearCuti() {
				$scope.itemCuti = {};
				// $scope.itemKeluarga.tglLahir=moment($scope.now).format("DD-MM-YYYY");				
			};
			function ClearCutiAwal() {
				$scope.itemCutiAwal = {};
				// $scope.itemKeluarga.tglLahir=moment($scope.now).format("DD-MM-YYYY");				
			};
			function ClearDataRiwayatPendidikan() {
				$scope.itemPendidikan = {};
				// $scope.itemKeluarga.tglLahir=moment($scope.now).format("DD-MM-YYYY");			
			};

			function ClearDataRiwayatPelatihan() {
				$scope.itemPelatihan = {};
				// $scope.itemKeluarga.tglLahir=moment($scope.now).format("DD-MM-YYYY");			
			};

			function ClearDataRiwayatJabatan() {
				$scope.itemPendidikan = {};
				// $scope.itemKeluarga.tglLahir=moment($scope.now).format("DD-MM-YYYY");			
			};
			function ClearDataRiwayatPangkatGolongan() {
				$scope.itemPandG = {};
				// $scope.itemKeluarga.tglLahir=moment($scope.now).format("DD-MM-YYYY");			
			};
			function ClearDataRiwayatGajiBerkala() {
				$scope.itemGajiBerkala = {};
				// $scope.itemKeluarga.tglLahir=moment($scope.now).format("DD-MM-YYYY");			
			};

			function ClearDataRiwayatGajiBerkalaPangkat() {
				$scope.itemGajiBerkalaPangkat = {};
				// $scope.itemKeluarga.tglLahir=moment($scope.now).format("DD-MM-YYYY");			
			};

			function ClearDataKomponenAdd() {
				$scope.itemKomponenAdd = {};
				// $scope.itemKeluarga.tglLahir=moment($scope.now).format("DD-MM-YYYY");			
			};

			function ClearDataKomponenDel() {
				$scope.itemKomponenDel = {};
				// $scope.itemKeluarga.tglLahir=moment($scope.now).format("DD-MM-YYYY");			
			};

			function ClearDataUserLogin() {
				$scope.itemLogin = {};
				// $scope.itemKeluarga.tglLahir=moment($scope.now).format("DD-MM-YYYY");			
			};

			function ClearDataSip() {
				$scope.itemSip = {};
				// $scope.itemKeluarga.tglLahir=moment($scope.now).format("DD-MM-YYYY");			
			};

			function ClearDataStr() {
				$scope.itemStr = {};
				// $scope.itemKeluarga.tglLahir=moment($scope.now).format("DD-MM-YYYY");			
			};

			function ClearDataTelp() {
				dataNoTelp = [];
				// $scope.itemKeluarga.tglLahir=moment($scope.now).format("DD-MM-YYYY");			
			};

			function ClearDataHukumanDisiplin() {
				$scope.itemHukumanDisiplin = {};
				// $scope.itemKeluarga.tglLahir=moment($scope.now).format("DD-MM-YYYY");			
			};

			function ClearDataCuti() {
				$scope.itemCuti = {};
				// $scope.itemKeluarga.tglLahir=moment($scope.now).format("DD-MM-YYYY");			
			};
			function ClearDataCutiAwal() {
				$scope.itemCutiAwal = {};
				// $scope.itemKeluarga.tglLahir=moment($scope.now).format("DD-MM-YYYY");			
			};
			function FormLoad() {
				$scope.isRouteLoading = true;
				medifirstService.getPart("sysadmin/general/get-combo-pegawai", true, true, 20).then(function (data) {
                    $scope.listPgw = data;
                });
				medifirstService.get("sdm/get-data-combo-sdm?", true).then(function (dat) {
					var dataCombo = dat.data
					$scope.ListJenisKelamin = dataCombo.jeniskelamin;
					$scope.ListAgama = dataCombo.agama;
					$scope.ListStatusKawin = dataCombo.statuskawin;
					$scope.ListPendidikan = dataCombo.pendidikan;
					$scope.ListPendidikanPegawai = dataCombo.pendidikanpegawai;
					// $scope.UsiaPensiun =dataCombo.usiapensiun.nilaifield;
					$scope.ListKedudukanPegawai = dataCombo.kedudukan;
					$scope.ListKategoriPegawai = dataCombo.kategorypegawai;
					$scope.ListJabatanFungsional = dataCombo.jabatan;
					$scope.ListGolonganPegawai = dataCombo.golonganpegawai;
					$scope.ListDetilKelompokJabatan = dataCombo.kelompokjabatan;
					$scope.ListEselon = dataCombo.eselon;
					$scope.ListPolaKerja = dataCombo.shiftkerja;
					$scope.ListTanggungan = dataCombo.tanggungan;
					$scope.ListPekerjaan = dataCombo.pekerjaan;
					$scope.ListUnitPenginput = dataCombo.dataunitpenginput;
					$scope.ListNamaPelatihan = dataCombo.dataNamaPelatihan;
					$scope.ListJenisPelatihan = dataCombo.datajenispelatihan;
					$scope.ListSumberDana = dataCombo.sumberdana;
					$scope.ListHubunganKeluarga = dataCombo.hubungankeluarga;
					$scope.listJenisJabatan = dataCombo.datajabatan;
					$scope.listKelompokuser = dataCombo.kelompokuser;
					$scope.item.PasswordDefault = dataCombo.passwordawal.nilaifield;
					$scope.itemLogin.kataKunciPass = $scope.item.PasswordDefault;
					$scope.itemLogin.kataKunciConfirm = $scope.item.PasswordDefault;
					$scope.ListJenisMasaBerlaku = dataCombo.datamasaberlaku;
					$scope.ListUnitKerja = dataCombo.dataunitkerja;
					$scope.ListProvider = dataCombo.jenisprovider;
					$scope.ListJenisPegawai = dataCombo.jenispegawai;
					$scope.ListJenisHukuman = dataCombo.jenishukuman;
					$scope.ListKomponenDel = dataCombo.komponengajidel;
					$scope.ListSuratKeputusan = dataCombo.suratkeputusan;
					// $scope.ListSubUnitKerja = dataCombo.subunitkerja;
					$scope.ListAktif = [{ id: 0, aktif: "Tidak Aktif" }, { id: 1, aktif: "Aktif" }]
					LoadCache();
				});
			}

			function LoadCache() {
				var chacePeriode = cacheHelper.get('MasterPegawaiCtrl');
				if (chacePeriode != undefined) {
					$scope.item.idPegawai = chacePeriode[0];
					jenisCache = chacePeriode[1];
					pensiunCache = chacePeriode[2];
					$scope.itemLogin.kataKunciPass = undefined;
					$scope.itemLogin.kataKunciConfirm = undefined;
					$scope.item.PasswordDefault = undefined;
					init();
				} else {
					init();
				}
			}
			
			function init() {
				$scope.isRouteLoading = false;
				if (jenisCache != '') {
					if (jenisCache == 'EditPegawai') {
						var pensiun = ''
						if (pensiunCache!= ''){
							pensiun = "&ispensiun=" + true
						}
						medifirstService.get("sdm/get-data-detail-pegawai?idPegawai=" + $scope.item.idPegawai+pensiun, true).then(function (dat) {
							$scope.ShowLogin = false;
							var dataCache = dat.data;
							var dataCachePegawai = dataCache.datapegawai[0];
							var dataCacheKeluarga = dataCache.datakeluarga;
							var dataCachePendidikan = dataCache.datapendidikan;
							var dataCachePelatihan = dataCache.datapelatihan;
							var dataCacheJabatan = dataCache.datajabatan;
							var dataCacheSip = dataCache.datasip;
							var dataCacheStr = dataCache.datastr;
							var dataCacheTelp = dataCache.datatelp;
							var dataCacheGajiPlus = dataCache.datagajiplus;
							var dataCacheGajiMinus = dataCache.datagajiminus;
							var dataCacheHukumanDisiplin = dataCache.datahukumandisiplin;
							var dataCachePangkatGolongan = dataCache.datapangkatgolongan;
							var dataCacheCuti = dataCache.datacuti;
							var dataCacheGajiBerkala = dataCache.datagajiberkala;
							var dataCachegajiBerkala = dataCache.gajiBerkala
							// Data Pegawai
							
							if (dataCachePegawai.noskcpns != null) {
								$scope.item.noskcpns = dataCachePegawai.noskcpns
								$scope.item.tglskcpns = moment(dataCachePegawai.tglskcpns).format('YYYY-MM-DD');
								$scope.item.tmtskcpns = moment(dataCachePegawai.tmtskcpns).format('YYYY-MM-DD');
								var split = dataCachePegawai.masakerjacpns.split("-")
								$scope.item.tahuncpns = split[0]
								$scope.item.bulancpns = split[1]
								$scope.item.golongancpns = {
									id: dataCachePegawai.objectgolongancpnsfk,
									golongan: dataCachePegawai.golongancpns,
									level: dataCachePegawai.levelcpns
								}
								$scope.item.pendidikancpns = {
									id: dataCachePegawai.objectpendidikancpnsfk,
									namaexternal: dataCachePegawai.cpnspegawai
								}
								$scope.item.prodicpns = dataCachePegawai.prodicpns
								$scope.item.tglijazahcpns = moment(dataCachePegawai.tglijazahcpns).format('YYYY-MM-DD');
								$scope.item.noijazahcpns = dataCachePegawai.noijazahcpns;
								$scope.item.jabatancpns = dataCachePegawai.jabatancpns
								$scope.item.jabatan = dataCachePegawai.jabatan
								$scope.item.unitkerjacpns = dataCachePegawai.unitkerjacpns
								$scope.item.instansicpns = dataCachePegawai.instansicpns
								$scope.item.pejabatpenandatangancpns = dataCachePegawai.pejabatpenandatangancpns
								$scope.item.pejabatyangmenetapkancpns = dataCachePegawai.pejabatyangmenetapkancpns
							}
							
							
							$scope.item.nik = dataCachePegawai.noidentitas;
							$scope.item.idPegawai = dataCachePegawai.id;
							$scope.item.nipPns = dataCachePegawai.nippns;
							$scope.item.nokarpeg = dataCachePegawai.nokarpeg;
							$scope.item.nobpjs = dataCachePegawai.nobpjs
							$scope.item.aktakelahiran = dataCachePegawai.aktakelahiran
							$scope.item.taspen = dataCachePegawai.taspen
							$scope.item.email = dataCachePegawai.email
							$scope.item.namaLengkap = dataCachePegawai.namalengkap;
							$scope.item.gelarDepan = dataCachePegawai.gelardepan;
							$scope.item.gelarBelakang = dataCachePegawai.gelarbelakang;
							$scope.item.nama = dataCachePegawai.nama;
							$scope.item.tempatLahir = dataCachePegawai.tempatlahir;
							$scope.item.masakerjatambahan = dataCachePegawai.masakerjatambahan;
							$scope.item.noskmasakerjatambahan = dataCachePegawai.noskmasakerjatambahan;
							$scope.item.tglskmasakerjatambahan = dataCachePegawai.tglskmasakerjatambahan;
							if (dataCachePegawai.masakerjatambahan !=null){
								var masakerjatambahan = dataCachePegawai.masakerjatambahan.split("-")
								$scope.item.masakerjatambahantahun = masakerjatambahan[0]
								$scope.item.masakerjatambahanbulan = masakerjatambahan[1]
							}
							
							$scope.ListGolonganGajiBerkala = dataCachegajiBerkala
							$scope.gajiterakhir = dataCache.datapegawai[0].gajiakhir;
							if (dataCachePegawai.tgllahir)
								$scope.item.tglLahir = moment(dataCachePegawai.tgllahir).format('YYYY-MM-DD HH:mm');

								if (dataCachePegawai.unitkerja)
								$scope.item.unitKerja =  { id: dataCachePegawai.objectunitkerjapegawaifk, name: dataCachePegawai.unitkerja };
							$scope.item.jenisKelamin = { id: dataCachePegawai.objectjeniskelaminfk, jeniskelamin: dataCachePegawai.jeniskelamin };
							$scope.item.pendidikan = { id: dataCachePegawai.objectpendidikanterakhirfk, pendidikan: dataCachePegawai.pendidikan };
							$scope.item.pendidikanpegawai = { id: dataCachePegawai.objectpendidikanpegawaifk, pendidikanpegawai: dataCachePegawai.pendidikanpegawai };
							$scope.item.statusPerkawinanPegawai = { id: dataCachePegawai.objectstatusperkawinanpegawaifk, statusperkawinan: dataCachePegawai.statusperkawinan };
							$scope.item.npwp = dataCachePegawai.npwp
							$scope.item.agama = { id: dataCachePegawai.objectagamafk, agama: dataCachePegawai.agama };
							if (dataCachePegawai.tglmeninggal)
								$scope.item.tglMeninggal = moment(dataCachePegawai.tglmeninggal).format('YYYY-MM-DD HH:mm');
							// End Data Pegawai

							// Data Rekening
							$scope.item.bankRekeningNomor = dataCachePegawai.bankrekeningnomor;
							$scope.item.bankRekeningAtasNama = dataCachePegawai.bankrekeningatasnama;
							$scope.item.bankRekeningNama = dataCachePegawai.bankrekeningnama;
							$scope.item.bankRekeningNomor2 = dataCachePegawai.bankrekeningnomor2;
							$scope.item.bankRekeningAtasNama2 = dataCachePegawai.bankrekeningatasnama2;
							$scope.item.bankRekeningNama2 = dataCachePegawai.bankrekeningnama2;
							// End Data Rekening

							// Data Alamat
							$scope.item.alamat = dataCachePegawai.alamat;
							$scope.item.kodePos = dataCachePegawai.kodepos;
							// End Alamat

							// Data Status Kepegawaian\
							if (dataCachePegawai.tglmasuk)
								$scope.item.tglMasuk = moment(dataCachePegawai.tglmasuk).format('YYYY-MM-DD HH:mm');
							if (dataCachePegawai.tglkeluar)
								$scope.item.tglkeluar = moment(dataCachePegawai.tglkeluar).format('YYYY-MM-DD HH:mm');
							$scope.item.pensiun = parseInt(dataCachePegawai.pensiun);
							if (dataCachePegawai.tglpensiun)
								$scope.item.tglPensiun = moment(dataCachePegawai.tglpensiun).format('YYYY-MM-DD HH:mm');
							$scope.item.kategoryPegawai = { id: dataCachePegawai.kategorypegawai, kategorypegawai: dataCachePegawai.namakategorypegawai };
							$scope.item.kedudukan = { id: dataCachePegawai.kedudukanfk, name: dataCachePegawai.kedudukan };
							$scope.item.golonganPegawai = { id: dataCachePegawai.objectgolonganfk, name: dataCachePegawai.golongan };
							$scope.item.jabatanFungsional = { id: dataCachePegawai.objectjabatanfungsionalfk, namajabatan: dataCachePegawai.jbfungsional };
							$scope.item.jabatanhehe = { id: dataCachePegawai.objectjabataninternalfk, namajabatan: dataCachePegawai.namajabatan };
							if(dataCachePegawai.namajabatan != null && $scope.item.tglLahir != undefined){
								if (dataCachePegawai.namajabatan.match('Madya')) {
									$scope.item.pensiun = 60
									$scope.mm = parseFloat(moment($scope.item.tglLahir).format('MM')) + 1
									$scope.dd = 1
									$scope.yyyy = parseFloat(moment($scope.item.tglLahir).format('YYYY')) + $scope.item.pensiun
									$scope.ppppp = $scope.yyyy + '-' + $scope.mm + '-' + $scope.dd
									console.log($scope.ppppp);
									$scope.item.tglPensiun = new Date($scope.ppppp)
								} else if (dataCachePegawai.namajabatan.match('Utama')) {
									$scope.item.pensiun = 65
									$scope.mm = parseFloat(moment($scope.item.tglLahir).format('MM')) + 1
									$scope.dd = 1
									$scope.yyyy = parseFloat(moment($scope.item.tglLahir).format('YYYY')) + $scope.item.pensiun
									$scope.ppppp = $scope.yyyy + '-' + $scope.mm + '-' + $scope.dd
									$scope.item.tglPensiun = new Date($scope.ppppp)
								} else if (dataCachePegawai.namajabatan.match('Direktur')) {
									$scope.item.pensiun = 60
									$scope.mm = parseFloat(moment($scope.item.tglLahir).format('MM')) + 1
									$scope.dd = 1
									$scope.yyyy = parseFloat(moment($scope.item.tglLahir).format('YYYY')) + $scope.item.pensiun
									$scope.ppppp = $scope.yyyy + '-' + $scope.mm + '-' + $scope.dd
									$scope.item.tglPensiun = new Date($scope.ppppp)
								} else {
									$scope.item.pensiun = 58
									$scope.mm = parseFloat(moment($scope.item.tglLahir).format('MM')) + 1
									$scope.dd = '01'
									$scope.yyyy = parseFloat(moment($scope.item.tglLahir).format('YYYY')) + $scope.item.pensiun
									$scope.ppppp = $scope.yyyy + '-' + $scope.mm + '-' + $scope.dd
									$scope.item.tglPensiun = new Date($scope.ppppp)
									console.log($scope.ppppp);
								}
							}
							$scope.item.detailKelompokJabatan = { id: dataCachePegawai.objectkelompokjabatanfk, detailkelompokjabatan: dataCachePegawai.detailkelompokjabatan };
							if (dataCachePegawai.grade)
								$scope.item.grade = parseFloat(dataCachePegawai.grade);
							$scope.item.eselon = { id: dataCachePegawai.objecteselonfk, eselon: dataCachePegawai.eselon };
							$scope.item.idFinger = dataCachePegawai.idfinger;
							$scope.item.shiftKerja = { id: dataCachePegawai.objectshiftkerja, kelompokshiftkerja: dataCachePegawai.kelompokshiftkerja };
							$scope.item.JenisPegawai = { id: dataCachePegawai.objectjenispegawaifk, jenispegawai: dataCachePegawai.jenispegawai };
							if (dataCachePegawai.nilaijabatan)
								$scope.item.nilaiJabatan = parseFloat(dataCachePegawai.nilaijabatan);
							// End Data Status Kepegawaian
							console.log($scope.item.jabatanhehe);
							// Data Keluarga
							dataKeluarga = dataCacheKeluarga;
							var datasuamiistri = []
							var dataanak = []
							var dataortu = []
							var nopas = 0
							var noan = 0
							var noor = 0
							var tertanggung= 0
							var real = 0
							for (var i = 0; i < dataKeluarga.length; i++) {
								dataKeluarga[i].no = i + 1
								if(dataKeluarga[i].issuamiistri == true){
									dataKeluarga[i].nopasutri = nopas + 1
									datasuamiistri.push(dataKeluarga[i])
									nopas++
								}
								if(dataKeluarga[i].isanak == true){
									$scope.item.jumlahanakreal = real +1
									real++
									if (dataKeluarga[i].statustanggunganfk == 1){
										$scope.item.jumlahanaktertanggung = tertanggung+1
										tertanggung++
									}
									dataKeluarga[i].noanak = noan + 1
									dataanak.push(dataKeluarga[i])
									noan++
								}
								if (dataKeluarga[i].isorangtua == true) {
									dataKeluarga[i].noortu = noor + 1
									dataortu.push(dataKeluarga[i])
									noor++
								}
							}
							$scope.gridOrangTua = new kendo.data.DataSource({
								data: dataortu
							})
							$scope.gridAnak = new kendo.data.DataSource({
								data: dataanak
							})
							$scope.gridIstriSuami = new kendo.data.DataSource({
								data: datasuamiistri
							});
							$scope.gridKeluarga = new kendo.data.DataSource({
								data: dataKeluarga
							});
							// End Data Keluarga

							// Data Pendidikan
							dataRiwayatPendidikan = dataCachePendidikan;
							for (var i = 0; i < dataRiwayatPendidikan.length; i++) {
								dataRiwayatPendidikan[i].no = i + 1
							}
							$scope.gridRiwayatPendidikan = new kendo.data.DataSource({
								data: dataRiwayatPendidikan
							})
							// End Data Pendidikan   

							// Data Riwayat Jabatan
							dataRiwayatJabatan = dataCacheJabatan;
							var datajabatanPelaksana = []
							var datajabatanFungsional = []
							var datajabatanStruktual = []
							var pel = 0
							var fun = 0
							var struk = 0
							for (var i = 0; i < dataRiwayatJabatan.length; i++) {
								dataRiwayatJabatan[i].no = i + 1;
								if (dataRiwayatJabatan[i].objectjenisjabatanfk == 7) {
									dataRiwayatJabatan[i].nopelaksana = pel+1
									datajabatanPelaksana.push(dataRiwayatJabatan[i])
									pel++
								}
								if (dataRiwayatJabatan[i].objectjenisjabatanfk == 6) {
									dataRiwayatJabatan[i].nofungsional = fun +1
									datajabatanFungsional.push(dataRiwayatJabatan[i])
									fun++
								}
								if (dataRiwayatJabatan[i].objectjenisjabatanfk == 8) {
									dataRiwayatJabatan[i].nostruktural = struk+1
									datajabatanStruktual.push(dataRiwayatJabatan[i])
									struk++
								}
							}
							
							// console.log(datajabatanPelaksana);
							$scope.gridRiwayatJabatanFungsional = new kendo.data.DataSource({
								data: datajabatanFungsional
							})
							$scope.gridRiwayatJabatanStruktural = new kendo.data.DataSource({
								data: datajabatanStruktual
							})
							$scope.gridRiwayatJabatanPelaksana = new kendo.data.DataSource({
								data: datajabatanPelaksana
							})
							$scope.gridRiwayatJabatan = new kendo.data.DataSource({
								data: dataRiwayatJabatan
							})
							//end
							
							//data riwayat pangkatgolongan
							dataRiwayatPangkatGolongan = dataCachePangkatGolongan;
							var sum = 0
							// var umur = ""
							function CountAge(birthday, dataNow) {
								// debugger;
								if (birthday === undefined || birthday === '')
									birthday = new Date();
								else {
									if (birthday instanceof Date) {

									} else {
										var arr = birthday.split('-');
										if (arr[0].length === 4) {
											birthday = new Date(arr[0], arr[1], arr[2]);
										} else {
											birthday = new Date(arr[2], arr[1], arr[0]);
										}
									}

								}
								if (dataNow === undefined)
									dataNow = new Date();
								var ageDifMs = dataNow - birthday;
								var ageDate = new Date(ageDifMs); // miliseconds from epoch
								var year = ageDate.getFullYear() - 1970;
								if (year <= -1)
									year = 0;
								var day = ageDate.getDate() - 1;
								var date = new Date(year, ageDate.getMonth(), day);
								return {
									year: year,
									month: ageDate.getMonth(),
									day: day,
									date: date
								};
							}
							for (var i = 0; i < dataRiwayatPangkatGolongan.length; i++) {
								dataRiwayatPangkatGolongan[i].no = i + 1;
								// $scope.a = dataRiwayatPangkatGolongan[i].no
								var umur = dateHelper.CountAge(new Date(dataRiwayatPangkatGolongan[i].tglawal), new Date(dataRiwayatPangkatGolongan[i].tgltmt));
								var bln = umur.month,
									thn = umur.year
								// 	day = umur.day
								dataRiwayatPangkatGolongan[i].mkgt = thn + ' thn ' + bln + ' bln '
							}
							
							$scope.gridRiwayatPangkatGolongan = new kendo.data.DataSource({
								data: dataRiwayatPangkatGolongan
							})
							//end

							// data cuti
							dataCuti = dataCacheCuti;
							dataCutiAwal = dataCache.datacutiawal;
							for (let i = 0; i < dataCuti.length; i++) {
								dataCuti[i].no = i + 1;
								var umur = dateHelper.CountAge(new Date(dataCuti[i].tgldari), new Date(dataCuti[i].tglsampai));
								var bln = umur.month,
									thn = umur.year
								// $scope.blntrkhr = umur.month
								console.log(thn, bln);
							}

							// DATA GAJI BERKALA
							dataRiwayatGajiBerkala = dataCacheGajiBerkala;
							for (let i = 0; i < dataRiwayatGajiBerkala.length; i++) {
								dataCacheGajiBerkala[i].no = i + 1;
								
							}
							$scope.gridRiwayatGajiBerkala = new kendo.data.DataSource({
								data: dataRiwayatGajiBerkala
							});

							//buat penjumlahan mkgtotal - cutitotal 
							if (dataRiwayatPangkatGolongan.length > 0) {
								if (dataCuti.length > 0) {
									$scope.totalcutibln=0
									for (let i = 0; i < dataCuti.length; i++) {
										dataCuti[i].cutitotal = dateHelper.CountAge(new Date(dataCuti[i].tgldari), new Date(dataCuti[i].tglsampai))
										var cutitotalthn = dataCuti[i].cutitotal.year * 12
										var cutitotalbln = dataCuti[i].cutitotal.month
										$scope.totalcutibln += cutitotalbln + cutitotalthn
									}
									console.log($scope.totalcutibln);
									var golongan = dataRiwayatPangkatGolongan[0].masakerjagolongan.split(" ")
									var masakerjatambahantahun = parseInt($scope.item.masakerjatambahantahun)
									var masakerjatambahanbulan = parseInt($scope.item.masakerjatambahanbulan)
									var tahungol = parseInt(golongan[0])
									var bulangol = parseInt(golongan[2])
									var totaltahun = tahungol + masakerjatambahantahun
									var totalbulan = bulangol + masakerjatambahanbulan + $scope.totalcutibln
									if (totalbulan > 11) {
										var bulanbagi12 = totalbulan / 12
										var bulankurang12 = totalbulan - 12
										totaltahun += Math.round(bulanbagi12)
										totalbulan = bulankurang12
										console.log(totalbulan);
									}
									$scope.item.masakerjakeseluruhan = totaltahun + " Tahun " + totalbulan + " Bulan"
								}else{
									if ($scope.item.tmtskcpns != undefined) {
										// var mks = dateHelper.CountAge(new Date(), $scope.now)
										// console.log();
										var golongan = dataRiwayatPangkatGolongan[0].masakerjagolongan.split(" ")
										var masakerjatambahantahun = parseInt($scope.item.masakerjatambahantahun)
										var masakerjatambahanbulan = parseInt($scope.item.masakerjatambahanbulan)
										var tahungol = parseInt(golongan[0])
										var bulangol = parseInt(golongan[2])
										var totaltahun = tahungol + masakerjatambahantahun
										var totalbulan = bulangol + masakerjatambahanbulan
										if(totalbulan > 11){
											var bulanbagi12 = totalbulan / 12
											var bulankurang12 = totalbulan - 12
											totaltahun += Math.round(bulanbagi12)
											totalbulan = bulankurang12
										}
										$scope.item.masakerjakeseluruhan = totaltahun + " Tahun " + totalbulan + " Bulan"
									}
									
								}
								
							}
							$scope.gridCuti = new kendo.data.DataSource({
								data: dataCuti
							})
							for(var e =0; e<dataCutiAwal.length; e++){
								dataCutiAwal[e].no = e+1
							}
							$scope.gridCutiAwal = new kendo.data.DataSource({
								data: dataCutiAwal
							})
							//end

							dataSip = dataCacheSip;
							for (var i = 0; i < dataSip.length; i++) {
								dataSip[i].no = i + 1;
							}
							$scope.gridSip = new kendo.data.DataSource({
								data: dataSip
							})

							dataStr = dataCacheStr;
							for (var i = 0; i < dataStr.length; i++) {
								dataStr[i].no = i + 1;
							}
							$scope.gridStr = new kendo.data.DataSource({
								data: dataStr
							})

							// Data Pelatihan
							dataRiwayatPelatihan = dataCachePelatihan;
							for (var i = 0; i < dataRiwayatPelatihan.length; i++) {
								dataRiwayatPelatihan[i].no = i + 1
							}
							$scope.gridRiwayatPelatihan = new kendo.data.DataSource({
								data: dataRiwayatPelatihan
							})
							// End Data Pendidikan  

							// data hukuman disiplin
							dataHukumanDisiplin = dataCacheHukumanDisiplin;
							for (var i = 0; i < dataHukumanDisiplin.length; i++) {
								dataHukumanDisiplin[i].no = i + 1
							}
							$scope.gridHukumanDisiplin = new kendo.data.DataSource({
								data: dataHukumanDisiplin
							})
							// end data hukuman disiplin

							// Data Phone
							dataNoTelp = dataCacheTelp;
							if (dataNoTelp.length > 1) {
								$scope.item.nomor1 = dataNoTelp[0].nomor;
								$scope.item.norecTelp1 = dataNoTelp[0].norec;
								$scope.item.provider1 = { id: dataNoTelp[0].providerfk, namaprovider: dataNoTelp[0].namaprovider };
								$scope.item.nomor2 = dataNoTelp[1].nomor;
								$scope.item.norecTelp2 = dataNoTelp[1].norec;
								$scope.item.provider2 = { id: dataNoTelp[1].providerfk, namaprovider: dataNoTelp[1].namaprovider };
							} else if (dataNoTelp.length == 1) {
								$scope.item.nomor1 = dataNoTelp[0].nomor;
								$scope.item.norecTelp1 = dataNoTelp[0].norec;
								$scope.item.provider1 = { id: dataNoTelp[0].providerfk, namaprovider: dataNoTelp[0].namaprovider };
							}

							// End Phone
							
							dataKomponenGajiAdd = dataCacheGajiPlus;
							for (var i = 0; i < dataKomponenGajiAdd.length; i++) {
								dataKomponenGajiAdd[i].no = i + 1
								if(dataKomponenGajiAdd[i].isaktif = true){
									dataKomponenGajiAdd[i].isaktif = 1
									dataKomponenGajiAdd[i].aktif = 'Aktif'
								}else if(dataKomponenGajiAdd[i].isaktif = false){
									dataKomponenGajiAdd[i].isaktif = 0
									dataKomponenGajiAdd[i].aktif = 'Tidak Aktif'
								}
							}
							$scope.gridKomponenGajiAdd = new kendo.data.DataSource({
								data: dataKomponenGajiAdd
							})

							dataKomponenGajiDel = dataCacheGajiMinus;
							for (var i = 0; i < dataKomponenGajiDel.length; i++) {
								dataKomponenGajiDel[i].no = i + 1
								if(dataKomponenGajiDel[i].isaktif = true){
									dataKomponenGajiDel[i].isaktif = 1
									dataKomponenGajiDel[i].aktif = 'Aktif'
								}else if(dataKomponenGajiDel[i].isaktif = false){
									dataKomponenGajiDel[i].isaktif = 0
									dataKomponenGajiDel[i].aktif = 'Tidak Aktif'
								}
							}
							$scope.gridKomponenGajiDel = new kendo.data.DataSource({
								data: dataKomponenGajiDel
							})

							// End Data Riwayat Jabatan

							// Data Login User
							ClearDataUserLogin()
							// End Data Login User

							$scope.isRouteLoading = false;
						});
					}
				} else {
					$scope.isRouteLoading = false;
					$scope.ShowLogin = true;
				}
			}

			$scope.ubah = function () {
				// if ($scope.itemJabatan.jenisJabatan != undefined || $scope.itemJabatan.jenisJabatan != "") {
				// 	$scope.ListJabatan = $scope.itemJabatan.jenisJabatan.id;
				// }
				// console.log($scope.itemJabatan.jenisJabatan.id);
				// medifirstService.get("sdm/get-data-jabatan?jabatan=" + $scope.itemJabatan.jenisJabatan.id).then(function (dat) {
				// 	// $scope.ListJabatan = dat.data.jabatanbaru;
				// 	if ($scope.itemJabatan.jenisJabatan.id == 7) {
				// 		$scope.jabatanPelaksana = true
				// 		$scope.ListJabatanPelaksana = dat.data
				// 	}
				// })
				medifirstService.get("sdm/get-data-combo-sdm?jabatan=" + $scope.itemJabatan.jenisJabatan.id).then(function (dat) {
					$scope.ListJabatan = dat.data.jabatanbaru;
				})

			}

			$scope.$watch('itemJabatan.jenisJabatan', function (newValue, oldValue) {
				if (newValue != oldValue) {
					medifirstService.get("sdm/get-data-combo-sdm?jabatan=" + $scope.itemJabatan.jenisJabatan.id + "&idpegawai=" + $scope.item.idPegawai).then(function (dat) {
						
						// if($scope.itemJabatan.jenisJabatan.id == 7 && dat.data.validasi == null){
						// 	toastr.warning("Data Golongan Masih Kosong");
						// 	return;
						// } 
						// else if($scope.itemJabatan.jenisJabatan.id == 8){
						// 	toastr.warning("Data Eselon Masih Kosong");
						// 	return;
						// } 
						// else{
							$scope.ListTunjangan = dat.data.tunjanganbaru;
							//$scope.itemJabatan.nominaltunjangan = 185000
						// }
					})
				}
			});

			$scope.$watch('itemJabatan.tunjangan', function (newValue, oldValue) {
				if (newValue != oldValue) {
					var jenisjabatan = 'jenisjabatan=' + $scope.itemJabatan.jenisJabatan.id
					var jabatan = '&jabatan=' + $scope.itemJabatan.tunjangan.id
					medifirstService.get("sdm/get-nominal-tunjangan?" + jenisjabatan + jabatan).then(function (dat) {
						if(dat.data.data.length == 0){
							$scope.itemJabatan.nominaltunjangan = 0
						} else{
							$scope.itemJabatan.nominaltunjangan = dat.data.data[0].nominaltunjangan;
						}
						
					})
				}
			});
			$scope.$watch('itemSip.unitKerja', function (newValue, oldValue) {
				if (newValue != oldValue) {
					$scope.ListSubUnitKerja = newValue.subunit;
				}
			});
			$scope.$watch('itemStr.unitKerja', function (newValue, oldValue) {
				if (newValue != oldValue) {
					$scope.ListSubUnitKerja = newValue.subunit;
				}
			});

			$scope.getGradeJbtn = function (e) {
				// if (!e.id) return;
				// $scope.item.grade = e.grade;
			}

			$scope.formatTanggal = function (tanggal) {
				return moment(tanggal).format('DD-MMM-YYYY');
			}

			$scope.formatTahun = function (tanggal) {
				return moment(tanggal).format('YYYY');
			}

			$scope.formatTahun = function (tanggal) {
				return moment(tanggal).format('YYYY');
			}

			$scope.opsiGridKeluarga = {
				toolbar: [

					{
						name: "create", text: "Buat Data Keluarga",
						template: '<button ng-click="createNew()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Buat Data Keluarga</button>'
					}
				],
				sortable: false,
				reorderable: true,
				filterable: false,
				pageable: true,
				columnMenu: false,
				resizable: true,
				selectable: 'row',
				columns: [
					{
						"field": "no",
						"title": "No",
						"width": "5%"
					},
					{
						"field": "namalengkap",
						"title": "Nama",
						"width": "20%"
					},
					{
						"field": "hubungankeluarga",
						"title": "Hubungan Keluarga",
						"width": "20%"
					},
					{
						"field": "statustanggungan",
						"title": "Tertanggung",
						"width": "20%"
					},
					{
						"field": "tgllahir",
						"title": "Tanggal Lahir",
						"width": "20%",
						"template": "<span class='style-left'>{{formatTanggal('#: tgllahir #')}}</span>"
					},
					{
						"field": "pendidikan",
						"title": "Pendidikan Terakhir",
						"width": "20%"
					},
					{
						"field": "pekerjaan",
						"title": "Pekerjaan",
						"width": "20%"
					},
					{
						"command": [
							{ text: "Edit", click: Edit, imageClass: "k-icon k-i-pencil" },
							{ text: "Hapus", click: Hapus, imageClass: "k-icon k-i-delete" },
						],
						title: "",
						width: "185px",
					}
				]
			}

			$scope.opsiGridRiwayatPendidikan = {
				toolbar: [
					{
						name: "create", text: "Buat Riwayat Pendidikan",
						template: '<button ng-click="createPendNew()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Buat Riwayat Pendidikan</button>'
					}
				],
				sortable: false,
				reorderable: true,
				filterable: false,
				pageable: true,
				columnMenu: false,
				resizable: true,
				selectable: 'row',
				columns: [
					{
						"field": "no",
						"title": "No",
						"width": "5%"
					},
					{
						"field": "pendidikanpegawai",
						"title": "Pendidikan",
						"width": "20%"
					},
					{
						"field": "namatempatpendidikan",
						"title": "Institusi Pendidikan",
						"width": "20%"
					},
					{
						"field": "alamattempatpendidikan",
						"title": "Alamat",
						"width": "20%"
					},
					{
						"field": "tglmasuk",
						"title": "Tahun Masuk",
						"width": "20%",
						"template": "<span class='style-left'>{{formatTahun('#: tglmasuk #')}}</span>"
					},
					{
						"field": "tgllulus",
						"title": "Tahun Lulus",
						"width": "20%",
						"template": "<span class='style-left'>{{formatTahun('#: tgllulus #')}}</span>"
					},
					{
						"command": [
							{ text: "Edit", click: EditPendidikan, imageClass: "k-icon k-i-pencil" },
							{ text: "Hapus", click: HapusPendidikan, imageClass: "k-icon k-i-delete" },
						],
						title: "",
						width: "185px",
					}
				]
			}

			$scope.opsiGridRiwayatPelatihan = {
				toolbar: [
					{
						name: "create", text: "Buat Riwayat Pelatihan",
						template: '<button ng-click="createPelatihanNew()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Buat Riwayat Pelatihan</button>'
					}
				],
				sortable: false,
				reorderable: true,
				filterable: false,
				pageable: true,
				columnMenu: false,
				resizable: true,
				selectable: 'row',
				columns: [
					{
						"field": "no",
						"title": "No",
						"width": "7%"
					},
					{
						"field": "instansipenyelenggara",
						"title": "Penyelenggara",
						"width": "25%"
					},
					{
						"field": "lokasipelatihan",
						"title": "Lokasi",
						"width": "18%"
					},
					{
						"field": "namapelatihan",
						"title": "Nama Pelatihan",
						"width": "35%"
					},
					{
						"field": "tglmulai",
						"title": "Tgl Mulai",
						"width": "15%",
						"template": "<span class='style-left'>{{formatTanggal('#: tglmulai #')}}</span>"
					},
					{
						"field": "tglakhir",
						"title": "Tgl Selesai",
						"width": "15%",
						"template": "<span class='style-left'>{{formatTanggal('#: tglakhir #')}}</span>"
					},
					{
						"field": "durasi",
						"title": "Durasi(jam)",
						"width": "15%"
					},
					{
						"field": "nosertifikat",
						"title": "No Sertifikat",
						"width": "20%"
					},
					{
						"field": "keterangan",
						"title": "Ket",
						"width": "20%"
					},
					{
						"command": [
							{ text: "Edit", click: EditPelatihan, imageClass: "k-icon k-i-pencil" },
							{ text: "Hapus", click: HapusPelatihan, imageClass: "k-icon k-i-delete" },
						],
						title: "",
						width: "185px",
					}
				]
			}

			$scope.opsiGridRiwayatJabatan = {
				toolbar: [
					{
						name: "create", text: "Buat Riwayat Jabatan",
						template: '<button ng-click="createJabatanNew()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Buat Riwayat Jabatan</button>'
					}
				],
				sortable: false,
				reorderable: true,
				filterable: false,
				pageable: true,
				columnMenu: false,
				resizable: true,
				selectable: 'row',
				columns: [
					{
						"field": "no",
						"title": "No",
						"width": "5%"
					},
					{
						"field": "nosk",
						"title": "No SK",
						"width": "20%"
					},
					{
						"field": "tglsk",
						"title": "Tanggal SK",
						"width": "20%",
						"template": "<span class='style-left'>{{formatTanggal('#: tglsk #')}}</span>"
					},
					{
						"field": "jenisjabatan",
						"title": "Jenis Jabatan",
						"width": "20%"
					},
					{
						"field": "namajabatan",
						"title": "Jabatan",
						"width": "20%"
					},
					{
						// "field": "pegawaipenanggungjawab",
						"title": "Penanda Tangan SK",
						"width": "20%",
						"template": "#: ttdsk # / #: ttdjabatansk #"
					},
					{
						"command": [
							{ text: "Edit", click: EditJabatan, imageClass: "k-icon k-i-pencil" },
							{ text: "Hapus", click: HapusJabatan, imageClass: "k-icon k-i-delete" },
						],
						title: "",
						width: "185px",
					}
				]
			}
			$scope.opsiGridRiwayatPangkatGolongan = {
				toolbar: [{
					name: "create",
					text: "Buat Riwayat Pangkat dan Golongan",
					template: '<button ng-click="createPangkatGolongan()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Buat Riwayat Pangkat Dan Golongan</button>'
				}],
				sortable: false,
				reorderable: true,
				filterable: false,
				pageable: true,
				columnMenu: false,
				resizable: true,
				selectable: 'row',
				columns: [{
						"field": "no",
						"title": "No",
						"width": "20px"
					},
					{
						"field": "nosk",
						"title": "NO SK",
						"width": "70px",
						// "template": "<span class='style-left'>{{formatTanggal('#: tglsk #')}}</span>"
					},
					{
						"field": "tglsk",
						"title": "Tanggal SK",
						"width": "50px",
						"template": "<span class='style-left'>{{formatTanggal('#: tglsk #')}}</span>"
					},
					{
						"field": "golongan",
						"title": "Golongan",
						"width": "100px",
						// "template": "#:namaexternal #, #:name #"
					},
					
					{
						"field": "tgltmt",
						"title": "Tanggal TMT",
						"width": "70px",
						"template": "<span class='style-left'>{{formatTanggal('#: tgltmt #')}}</span>"

					},
					{
						"field": "masakerjagolongan",
						"title": "Masa Kerja Golongan",
						"width": "100px",
					},
					{
						"field": "nominal",
						"title": "Gaji Pokok",
						"width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: nominal #', '')}}</span>"
					},
					
					{
						"command": [{
								text: "Edit",
								click: EditPangkatGolongan,
								imageClass: "k-icon k-i-pencil"
							},
							{
								text: "Hapus",
								click: HapusPangkatGolongan,
								imageClass: "k-icon k-i-delete"
							},
						],
						title: "",
						width: "185px",
					}
				]
			}
$scope.formatRupiah = function (value, currency) {
	return currency + "Rp. " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
}
			$scope.opsiGridRiwayatGajiBerkala = {
				toolbar: [{
					name: "create",
					text: "Buat Riwayat Gaji Berkala",
					template: '<button ng-click="createGajiBerkala()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Buat Riwayat Gaji Berkala</button>'
				},
				{
					name: "create",
					text: "Buat Riwayat Kenaikan Pangkat",
					template: '<button ng-click="createGajiBerkalaPangkat()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Buat Riwayat Gaji Pangkat</button>'
				},
				],
				sortable: false,
				reorderable: true,
				filterable: false,
				pageable: true,
				columnMenu: false,
				resizable: true,
				selectable: 'row',
				columns: [{
						"field": "no",
						"title": "No",
						"width": "20px"
					},
					{
						"field": "nosk",
						"title": "NO SK",
						"width": "70px",
						// "template": "<span class='style-left'>{{formatTanggal('#: tglsk #')}}</span>"
					},
					{
						"field": "tglskbaru",
						"title": "Tanggal SK",
						"width": "50px",
						"template": "<span class='style-left'>{{formatTanggal('#: tglskbaru #')}}</span>"
					},
					{
						"field": "golongan",
						"title": "Golongan",
						"width": "50px",
					},
					{
						"field": "gajiawal",
						"title": "Gaji Pokok Lama",
						"width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: gajiawal #', '')}}</span>"

						// "template": "#:namaexternal #, #:name #"
					},
					{
						"field": "gajiakhir",
						"title": "Gaji Pokok Baru",
						"width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: gajiakhir #', '')}}</span>"

						// "template": "#:namaexternal #, #:name #"
					},
					
					{
						"field": "tgltmt",
						"title": "Tanggal TMT",
						"width": "70px",
						"template": "<span class='style-left'>{{formatTanggal('#: tgltmt #')}}</span>"

					},
					{
						"command": [{
								text: "Edit",
								click: EditGajiBerkala,
								imageClass: "k-icon k-i-pencil"
							},
							{
								text: "Hapus",
								click: HapusGajiBerkala,
								imageClass: "k-icon k-delete"
							},
							{
								text: "Cetak",
								click: cetakGajiBerkala,
								imageClass: "k-icon k-print"
							},
						],
						title: "",
						width: "185px",
					}
				]
			}

			$scope.opsiGridKomponenGajiAdd = {
				toolbar: [{
					name: "create",
					text: "Add Pendapatan",
					template: '<button ng-click="createKomponenAdd()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Add Pendapatan</button>'
				}],
				sortable: false,
				reorderable: true,
				filterable: false,
				pageable: true,
				columnMenu: false,
				resizable: true,
				selectable: 'row',
				columns: [{
						"field": "no",
						"title": "No",
						"width": "10%"
					},
					{
						"field": "komponengaji",
						"title": "Pendapatan",
						"width": "50%"
					},
					{
						"field": "aktif",
						"title": "Aktif",
						"width": "20%"
					},
					{
						"field": "tglaktif",
						"title": "Tgl Aktif",
						"width": "30%"
					},
					{
						"field": "nosk",
						"title": "No. SK",
						"width": "30%"
					},
					{
						"command": [{
								text: "Edit",
								click: EditKomponenAdd,
								imageClass: "k-icon k-i-pencil"
							},
							{
								text: "Hapus",
								click: HapusKomponenAdd,
								imageClass: "k-icon k-i-delete"
							},
						],
						title: "",
						width: "150px",
					}
				]
			}

			$scope.opsiGridHukumanDisiplin = {
				toolbar: [{
					name: "create",
					text: "Tambah Hukuman Disiplin",
					template: '<button ng-click="createHukumanDisiplin()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah Hukuman Disiplin</button>'
				}],
				sortable: false,
				reorderable: true,
				filterable: false,
				pageable: true,
				columnMenu: false,
				resizable: true,
				selectable: 'row',
				columns: [{
						"field": "no",
						"title": "No",
						"width": "20px"
					},
					{
						"field": "nosk",
						"title": "NO SK",
						"width": "50px"
					},
					 {
						"field": "tglsk",
						"title": "Tanggal SK",
						"width": "50px"
					},
					{
						"field": "jenishukuman",
						"title": "Jenis Hukuman",
						"width": "110px"
					},
					{
						// "field": "aktif",
						"title": "Masa Berlaku",
						// "width": "20%",
						columns: [{
							field: "tgldari",
							title: "Dari",
							"width": "50px",
						}, {
							field: "tglsampai",
							title: "Sampai",
							"width": "50px",
						}]
					},
					{
						"field": "pejabatmenetapkan",
						"title": "Pejabat Yang Menetapkan",
						"width": "70px"
					},
					{
						"command": [{
								text: "Edit",
								click: EditHukumanDisiplin,
								imageClass: "k-icon k-i-pencil"
							},
							{
								text: "Hapus",
								click: HapusHukumanDisiplin,
								imageClass: "k-icon k-i-delete"
							},
						],
						title: "Actions",
						width: "100px",
					}
				]
			}

			$scope.opsiGridCuti = {
				toolbar: [{
					name: "create",
					text: "Buat Cuti Diluar Tanggungan Negara",
					template: '<button ng-click="createCuti()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Buat Cuti Diluar Tanggungan Negara</button>'
				}],
				sortable: false,
				reorderable: true,
				filterable: false,
				pageable: true,
				columnMenu: false,
				resizable: true,
				selectable: 'row',
				columns: [{
						"field": "no",
						"title": "No",
						"width": "20px"
					},
					{
						"field": "nosk",
						"title": "NO SK",
						"width": "50px"
					},
					{
						"field": "tglsk",
						"title": "Tanggal SK",
						"width": "50px"
					},
					// {
					// 	"field": "jenishukuman",
					// 	"title": "Jenis Hukuman",
					// 	"width": "110px"
					// },
					{
						// "field": "aktif",
						"title": "Masa Berlaku",
						// "width": "20%",
						columns: [{
							field: "tgldari",
							title: "Dari",
							"width": "50px",
						}, {
							field: "tglsampai",
							title: "Sampai",
							"width": "50px",
						}]
					},
					{
						"field": "pejabatmenetapkan",
						"title": "Pejabat Yang Menetapkan",
						"width": "70px"
					},
					{
						"command": [{
								text: "Edit",
								click: EditCuti,
								imageClass: "k-icon k-i-pencil"
							},
							{
								text: "Hapus",
								click: HapusCuti,
								imageClass: "k-icon k-i-delete"
							},
						],
						title: "Actions",
						width: "100px",
					}
				]
			}

			$scope.opsiGridCutiAwal = {
				toolbar: [{
					name: "create",
					text: "Tambah Total Cuti",
					template: '<button ng-click="createCutiAwal()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah Total Cuti</button>'
				}],
				sortable: false,
				reorderable: true,
				filterable: false,
				pageable: true,
				columnMenu: false,
				resizable: true,
				selectable: 'row',
				columns: [{
						"field": "no",
						"title": "No",
						"width": "100px"
					},
					{
						"field": "tglpengajuan",
						"title": "Tahun",
						"template": "<span class='style-left'>{{formatTahun('#: tglpengajuan #')}}</span>"
					},
					{
						"field": "jumlahhari",
						"title": "Jumlah Cuti",
					},
					{
						"command": [{
								text: "Edit",
								click: EditCutiAwal,
								imageClass: "k-icon k-i-pencil"
							},
							{
								text: "Hapus",
								click: HapusCutiAwal,
								imageClass: "k-icon k-i-delete"
							},
						],
						title: "Actions",
						width: "100px",
					}
				]
			}

			$scope.opsiGridKomponenGajiDel = {
				toolbar: [
					{
						name: "create", text: "Add Pengurang",
						template: '<button ng-click="createKomponenDel()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Add Pengurang</button>'
					}
				],
				sortable: false,
				reorderable: true,
				filterable: false,
				pageable: true,
				columnMenu: false,
				resizable: true,
				selectable: 'row',
				columns: [
					{
						"field": "no",
						"title": "No",
						"width": "10%"
					},
					{
						"field": "komponengaji",
						"title": "Pengurang",
						"width": "50%"
					},
					{
						"field": "aktif",
						"title": "Aktif",
						"width": "20%"
					},
					{
						"field": "tglaktif",
						"title": "Tgl Aktif",
						"width": "30%"
					},
					{
						"field": "noSK",
						"title": "No. SK",
						"width": "30%"
					},
					{
						"command": [
							{ text: "Edit", click: EditKomponenDel, imageClass: "k-icon k-i-pencil" },
							{ text: "Hapus", click: HapusKomponenDel, imageClass: "k-icon k-i-delete" },
						],
						title: "",
						width: "150px",
					}
				]
			}

			$scope.opsiGridSip = {
				toolbar: [
					{
						name: "create", text: "Buat SIP",
						template: '<button ng-click="createSip()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Buat SIP</button>'
					}
				],
				sortable: false,
				reorderable: true,
				filterable: false,
				pageable: true,
				columnMenu: false,
				resizable: true,
				selectable: 'row',
				columns: [
					{
						"field": "no",
						"title": "No",
						"width": "5%"
					},
					//             {
					//                 "field": "namaLengkap",
					//                 "title": "Nama",
					//                 "width": "20%"
					//             },	                
					// {
					//     "field": "unitkerja",
					//     "title": "Unit Kerja",
					//     "width": "20%",

					// },
					// {
					// 	"field": "subunit",
					//     "title": "Sub-Unit Kerja",
					//     "width": "20%"
					// },
					{
						"field": "nomor",
						"title": "Nomor SIP",
						"width": "20%"
					},
					{
						"field": "tglberakhir",
						"title": "Tanggal Berakhir",
						"width": "20%",
						"template": "<span class='style-left'>{{formatTanggal('#: tglberakhir #')}}</span>"
					},
					{
						"field": "namafileupload",
						"title": "File SIP",
						"width": "30%"
					},
					{
						"command": [
							// { text: "Edit", click: EditSip, imageClass: "k-icon k-i-pencil" },
							{ text: "Hapus", click: HapusSipNew, imageClass: "k-icon k-i-delete" },
							{ text: "Download", click: downloadSipStr, imageClass: "k-icon k-delete" }
						],
						title: "",
						width: "22%",
					}
				]
			}

			$scope.opsiGridStr = {
				toolbar: [
					{
						name: "create", text: "Buat STR",
						template: '<button ng-click="createStr()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Buat STR</button>'
					}
				],
				sortable: false,
				reorderable: true,
				filterable: false,
				pageable: true,
				columnMenu: false,
				resizable: true,
				selectable: 'row',
				columns: [
					{
						"field": "no",
						"title": "No",
						"width": "5%"
					},
					//             {
					//                 "field": "namaLengkap",
					//                 "title": "Nama",
					//                 "width": "20%"
					//             },	                
					// {
					//     "field": "unitkerja",
					//     "title": "Unit Kerja",
					//     "width": "20%",
					// },
					// {
					// 	"field": "subunit",
					//     "title": "Sub-Unit Kerja",
					//     "width": "20%"
					// },
					{
						"field": "nomor",
						"title": "Nomor STR",
						"width": "20%"
					},
					{
						"field": "tglberakhir",
						"title": "Tanggal Berakhir",
						"width": "20%",
						"template": "<span class='style-left'>{{formatTanggal('#: tglberakhir #')}}</span>"
					},
					{
						"field": "namafileupload",
						"title": "File STR",
						"width": "30%"
					},
					{
						"command": [
							{ text: "Edit", click: EditStr, imageClass: "k-icon k-i-pencil" },
							{ text: "Hapus", click: HapusStrNew, imageClass: "k-icon k-i-delete" },
							{ text: "Download", click: downloadSipStr, imageClass: "k-icon k-delete" }
						],
						title: "",
						width: "22%",
					}
				]
			}


			$scope.$watch('item.gelarDepan', function (newValue, oldValue) {
				if (newValue != oldValue) {
					if ($scope.item.gelarDepan) {
						if ($scope.item.gelarDepan && $scope.item.gelarBelakang) {
							$scope.item.namaLengkap = $scope.item.gelarDepan + '. ' + $scope.item.nama + ', ' + $scope.item.gelarBelakang;
						} else if ($scope.item.gelarDepan && !$scope.item.gelarBelakang) {
							$scope.item.namaLengkap = $scope.item.gelarDepan + '. ' + $scope.item.nama;
						} else if (!$scope.item.gelarDepan && $scope.item.gelarBelakang) {
							$scope.item.namaLengkap = $scope.item.nama + ', ' + $scope.item.gelarBelakang;
						} else {
							$scope.item.namaLengkap = $scope.item.nama;
						}
					}
				}
			});

			$scope.$watch('item.nama', function (newValue, oldValue) {
				if (newValue != oldValue) {
					if ($scope.item.nama) {
						var user = $scope.item.nama.replace(" ", ".")
						$scope.itemLogin.namaUser = user.toLowerCase();
						if ($scope.item.gelarDepan && $scope.item.gelarBelakang) {
							$scope.item.namaLengkap = $scope.item.gelarDepan + '. ' + $scope.item.nama + ', ' + $scope.item.gelarBelakang;
						} else if ($scope.item.gelarDepan && !$scope.item.gelarBelakang) {
							$scope.item.namaLengkap = $scope.item.gelarDepan + '. ' + $scope.item.nama;
						} else if (!$scope.item.gelarDepan && $scope.item.gelarBelakang) {
							$scope.item.namaLengkap = $scope.item.nama + ', ' + $scope.item.gelarBelakang;
						} else {
							$scope.item.namaLengkap = $scope.item.nama;
						}
					}
				}
			});

			$scope.$watch('item.gelarBelakang', function (newValue, oldValue) {
				if (newValue != oldValue) {
					if ($scope.item.gelarBelakang) {
						if ($scope.item.gelarDepan && $scope.item.gelarBelakang) {
							$scope.item.namaLengkap = $scope.item.gelarDepan + '. ' + $scope.item.nama + ', ' + $scope.item.gelarBelakang;
						} else if ($scope.item.gelarDepan && !$scope.item.gelarBelakang) {
							$scope.item.namaLengkap = $scope.item.gelarDepan + '. ' + $scope.item.nama;
						} else if (!$scope.item.gelarDepan && $scope.item.gelarBelakang) {
							$scope.item.namaLengkap = $scope.item.nama + ', ' + $scope.item.gelarBelakang;
						} else {
							$scope.item.namaLengkap = $scope.item.nama;
						}
					}
				}
			});

			function Edit(e) {

				e.preventDefault();
				var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

				if (dataItem == undefined) {
					alert("Data Belum Dipilih!")
					return;
				};
				console.log(dataItem);
				$scope.item.id = dataItem.id;
				$scope.item.no = dataItem.no;
				$scope.itemKeluarga.namaAnggotaKeluarga = dataItem.namalengkap;
				$scope.itemKeluarga.hubunganKeluarga = { id: dataItem.objectkdhubunganfk, hubungankeluarga: dataItem.hubungankeluarga };
				$scope.itemKeluarga.tglLahir = moment(dataItem.tgllahir).format('YYYY-MM-DD');
				$scope.itemKeluarga.tglnikah = moment(dataItem.tglnikah).format('YYYY-MM-DD');
				$scope.itemKeluarga.jenisKelaminKl = { id: dataItem.objectjeniskelaminfk, jeniskelamin: dataItem.jeniskelamin };
				$scope.itemKeluarga.namaAyah = dataItem.namaayah;
				$scope.itemKeluarga.namaIbu = dataItem.namaibu;
				$scope.itemKeluarga.statusPerkawinanPegawaiKL = { id: dataItem.objectstatusperkawinanpegawaifk, statusperkawinan: dataItem.statusperkawinan };
				$scope.itemKeluarga.PekerjaanKL = { id: dataItem.objectpekerjaanfk, pekerjaan: dataItem.pekerjaan };
				$scope.itemKeluarga.nipIstriSuami = dataItem.nipistrisuami;
				$scope.itemKeluarga.statusTanggungan = { id: dataItem.statustanggunganfk, reportdisplay: dataItem.statustanggungan };
				$scope.itemKeluarga.noSuratKuliah = dataItem.nosuratkuliah;
				$scope.itemKeluarga.tglsuratKuliah = moment(dataItem.tglsuratkuliah).format('YYYY-MM-DD');
				$scope.itemKeluarga.alamat = dataItem.alamat;
				$scope.itemKeluarga.keterangan = dataItem.keterangan;
				$scope.itemKeluarga.pendidikan = { id: dataItem.objectpendidikanterakhirfk, pendidikan: dataItem.pendidikan };
				$scope.itemKeluarga.Tunjangan = dataItem.tunjangan
				$scope.itemKeluarga.kariskarsu = dataItem.kariskarsu
				if(dataItem.issuamiistri == true){
					$scope.popUpDataKeluargaSuamiIstri.center().open()
				}
				if (dataItem.isanak == true) {
					$scope.popUpDataKeluargaAnak.center().open()
				}
				if (dataItem.isorangtua == true) {
					$scope.popUpDataKeluargaOrangTua.center().open()
				}
			}

			function Hapus(e) {
				e.preventDefault();
				var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
				if (dataItem == undefined) {
					alert("Data Belum Dipilih!")
					return;
				};

				var grid = this;
				var row = $(e.currentTarget).closest("tr");
				var tr = $(e.target).closest("tr");
				for (var i = dataKeluarga.length - 1; i >= 0; i--) {
					if (dataKeluarga[i].no == dataItem.no) {
						dataKeluarga.splice(i, 1);
					}
				}
				var itemDelete = {
					"id": dataItem.id
				}

				medifirstService.post('sdm/delete-data-keluarga-pegawai', itemDelete).then(function (e) {
					if (e.status === 201) {
						grid.removeRow(row);
					}
					init()
				})
			}

			function EditPendidikan(e) {
				e.preventDefault();
				var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
				if (dataItem == undefined) {
					alert("Data Belum Dipilih!")
					return;
				};
				$scope.item.norecPend = dataItem.norec;
				$scope.item.nomor = dataItem.no;
				//$scope.itemPendidikan.pendidikan = { id: dataItem.objectpendidikanfk, pendidikan: dataItem.pendidikan };
				$scope.itemPendidikan.pendidikanpegawai = { id: dataItem.objectpendidikanpegawaifk, pendidikanpegawai: dataItem.pendidikanpegawai };
				$scope.itemPendidikan.NamaInstitusi = dataItem.namatempatpendidikan;
				$scope.itemPendidikan.alamat = dataItem.alamattempatpendidikan;
				$scope.itemPendidikan.jurusan = dataItem.jurusan;
				$scope.itemPendidikan.tglMasukPend = moment(dataItem.tglmasuk).format('YYYY-MM-DD');;
				$scope.itemPendidikan.tglLulus = moment(dataItem.tgllulus).format('YYYY-MM-DD');;
				$scope.itemPendidikan.ipk = parseFloat(dataItem.nilaiipk);
				$scope.itemPendidikan.noIjasah = dataItem.noijazah;
				$scope.itemPendidikan.tglIjasah = moment(dataItem.tglijazah).format('YYYY-MM-DD');
				$scope.popUpRiwayatPendidikan.center().open();

			}

			function HapusPendidikan(e) {
				e.preventDefault();
				var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
				if (dataItem == undefined) {
					alert("Data Belum Dipilih!")
					return;
				};

				var grid = this;
				var row = $(e.currentTarget).closest("tr");
				var tr = $(e.target).closest("tr");
				for (var i = dataRiwayatPendidikan.length - 1; i >= 0; i--) {
					if (dataRiwayatPendidikan[i].no == dataItem.no) {
						dataRiwayatPendidikan.splice(i, 1);
					}
				}
				grid.removeRow(row);
				var data = {
					'datahapus': 'ok',
					'objectpegawaifk': $scope.item.idPegawai,
					'norec': dataItem.norec
				}
				medifirstService.post('sdm/save-riwayat-pendidikan', data).then(function (data) {
					init();
				})

			}

			function EditPelatihan(e) {
				e.preventDefault();
				var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
				if (dataItem == undefined) {
					alert("Data Belum Dipilih!")
					return;
				};
				var idpenyelenggara = 1
				if(dataItem.penyelenggara != 'Internal'){
					idpenyelenggara = 2
					$scope.itemPelatihan.namaPelatihan = dataItem.namapelatihan;
					$scope.namapelatihan = true
					$scope.namapelatihancbx = false
				}
				$scope.item.norecPel = dataItem.norec;
				$scope.item.nomor = dataItem.no;
				// $scope.itemPelatihan.jenisPelatihan={id:dataItem.objectpelatihanfk,jenispelatihan:dataItem.jenispelatihan};
				$scope.itemPelatihan.namaInstitusi = dataItem.instansipenyelenggara;
				$scope.itemPelatihan.lokasi = dataItem.lokasipelatihan;
				$scope.itemPelatihan.namaPelatihan2 = {id:dataItem.id_np,namapelatihan:dataItem.namapelatihan};
				$scope.itemPelatihan.tglMulaiPel = moment(dataItem.tglmulai).format('YYYY-MM-DD');;
				$scope.itemPelatihan.tglSelesaiPel = moment(dataItem.tglakhir).format('YYYY-MM-DD');;
				$scope.itemPelatihan.durasi = parseInt(dataItem.durasi);
				$scope.itemPelatihan.noSertifikat = dataItem.nosertifikat;
				$scope.itemPelatihan.keterangan = dataItem.keterangan;
				$scope.itemPelatihan.unitpenginput = {id:dataItem.unitpenginputfk, unitpenginput:dataItem.unitpenginput};
				$scope.itemPelatihan.jenispelatihan = {id:dataItem.jenispelatihanfk, jenispelatihan:dataItem.jenispelatihan};
				$scope.itemPelatihan.penyelenggara = {id:idpenyelenggara,penyelenggara:dataItem.penyelenggara};
				$scope.itemPelatihan.biayadiklat = parseInt(dataItem.biayadiklat);
				$scope.itemPelatihan.biayasppd = parseInt(dataItem.biayasppd);
				$scope.itemPelatihan.sumberdana = {id:dataItem.sumberdanafk, sumberdana:dataItem.sumberdana};
				$scope.popUpRiwayatPelatihan.center().open();

			}

			function HapusPelatihan(e) {
				e.preventDefault();
				var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
				if (dataItem == undefined) {
					alert("Data Belum Dipilih!")
					return;
				};

				var grid = this;
				var row = $(e.currentTarget).closest("tr");
				var tr = $(e.target).closest("tr");
				for (var i = dataRiwayatPelatihan.length - 1; i >= 0; i--) {
					if (dataRiwayatPelatihan[i].no == dataItem.no) {
						dataRiwayatPelatihan.splice(i, 1);
					}
				}

				var itemDelete = {
					"norec": dataItem.norec,
				}

				medifirstService.post('sdm/pelatihan/delete-data-pelatihan', itemDelete).then(function (e) {
					if (e.status === 201) {
						grid.removeRow(row);
					}else{
						console.log(e.status);
					}
				})
			}

			function EditJabatan(e) {
				e.preventDefault();
				var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
				if (dataItem == undefined) {
					alert("Data Belum Dipilih!")
					return;
				};
				$scope.item.norecJab = dataItem.norec;
				$scope.item.nomorId = dataItem.no;
				$scope.itemJabatan.instansi = dataItem.instansi
				$scope.itemJabatan.jenisJabatan = { id: dataItem.objectjenisjabatanfk, jenisjabatan: dataItem.jenisjabatan };
				$scope.itemJabatan.jabatan = { id: dataItem.objectjabatanfk, namajabatan: dataItem.namajabatan };
				$scope.itemJabatan.noSK = dataItem.nosk;
				$scope.itemJabatan.tglSK = moment(dataItem.tglsk).format('DD-MM-YYYY');
				console.log($scope.itemJabatan.tglSK);
				$scope.itemJabatan.tmtjabatan = moment(dataItem.tmtjabatan).format('DD-MM-YYYY');
				$scope.itemJabatan.ttdSK = dataItem.ttdsk;
				$scope.itemJabatan.jabatanTtd = dataItem.ttdjabatansk;
				$scope.itemJabatan.nominaltunjangan = dataItem.tunjangan;
				if (dataItem.objectjenisjabatanfk == 8) {
					$scope.eselonshow = true
					$scope.itemJabatan.eselon = {
						id: dataItem.eselon,
						namajabatan: dataItem.namaeselon
					};
				} else{
					$scope.eselonshow = false
					$scope.itemJabatan.eselon = undefined
				}
				$scope.ubah()
				$scope.popUpRiwayatJabatan.center().open();
			}

			function EditKomponenAdd(e) {
				$scope.itemKomponenAdd = [];
				e.preventDefault();
				var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
				if (dataItem == undefined) {
					alert("Data Belum Dipilih!")
					return;
				};
				$scope.item.norecKomAdd = dataItem.norec;
				$scope.item.nomorId = dataItem.no;
				$scope.itemKomponenAdd.komponen = { id: dataItem.idkomponengaji, komponengaji: dataItem.komponengaji };
				$scope.itemKomponenAdd.isaktif = { id: dataItem.isaktif, aktif: dataItem.aktif };
				$scope.itemKomponenAdd.tglAktif = moment(dataItem.tglAktif).format('YYYY-MM-DD HH:mm');
				$scope.itemKomponenAdd.noSK = dataItem.noSK;
				$scope.popUpKomponenGajiAdd.center().open();
			}
			function EditKomponenAdd(e) {
				$scope.itemKomponenAdd = [];
				e.preventDefault();
				var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
				if (dataItem == undefined) {
					alert("Data Belum Dipilih!")
					return;
				};
				$scope.item.norecKomAdd = dataItem.norec;
				$scope.item.nomorId = dataItem.no;
				$scope.itemKomponenAdd.komponen = {
					id: dataItem.idkomponengaji,
					komponengaji: dataItem.komponengaji
				};
				$scope.itemKomponenAdd.isaktif = {
					id: dataItem.isaktif,
					aktif: dataItem.aktif
				};
				$scope.itemKomponenAdd.tglAktif = moment(dataItem.tglAktif).format('YYYY-MM-DD HH:mm');
				$scope.itemKomponenAdd.noSK = dataItem.noSK;
				$scope.popUpKomponenGajiAdd.center().open();
			}

			function EditHukumanDisiplin(e) {
				$scope.itemHukumanDisiplin = [];
				e.preventDefault();
				var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
				console.log(dataItem);
				if (dataItem == undefined) {
					alert("Data Belum Dipilih!")
					return;
				};
				$scope.item.nomorIdh = dataItem.no;
				$scope.item.norechudis = dataItem.norec;
				$scope.itemHukumanDisiplin.jenishukuman = {
					id: dataItem.objectjenishukumanfk,
					jenishukuman: dataItem.jenishukuman
				};
				$scope.itemHukumanDisiplin.tglsk = moment(dataItem.tglsk).format('YYYY-MM-DD HH:mm');
				$scope.itemHukumanDisiplin.tgldari = moment(dataItem.tgldari).format('YYYY-MM-DD HH:mm');
				$scope.itemHukumanDisiplin.tglsampai = moment(dataItem.tglsampai).format('YYYY-MM-DD HH:mm');
				$scope.itemHukumanDisiplin.pejabatmenetapkan = dataItem.pejabatmenetapkan;
				$scope.itemHukumanDisiplin.nosk = dataItem.nosk;
				$scope.popUpHukumanDisiplin.center().open();
			}
			function EditCuti(e) {
				$scope.itemCuti = [];
				e.preventDefault();
				var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
				console.log(dataItem);
				if (dataItem == undefined) {
					alert("Data Belum Dipilih!")
					return;
				};
				$scope.item.nomorIdcuti = dataItem.no;
				$scope.item.noreccuti = dataItem.norec;
				$scope.itemCuti.tglsk = moment(dataItem.tglsk).format('YYYY-MM-DD HH:mm');
				$scope.itemCuti.tgldari = moment(dataItem.tgldari).format('YYYY-MM-DD HH:mm');
				$scope.itemCuti.tglsampai = moment(dataItem.tglsampai).format('YYYY-MM-DD HH:mm');
				$scope.itemCuti.pejabatmenetapkan = dataItem.pejabatmenetapkan;
				$scope.itemCuti.nosk = dataItem.nosk;
				$scope.popUpCuti.center().open();
			}
			function EditCutiAwal(e) {
				$scope.itemCutiAwal = [];
				e.preventDefault();
				var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
				console.log(dataItem);
				if (dataItem == undefined) {
					alert("Data Belum Dipilih!")
					return;
				};
				$scope.item.nomorIdcutiAwal = dataItem.no;
				$scope.item.noreccutiAwal = dataItem.norec;
				$scope.itemCutiAwal.tahun = moment(dataItem.tglpengajuan).format('YYYY');
				$scope.itemCutiAwal.jumlahcuti = dataItem.jumlahhari;
				$scope.popUpCutiAwal.center().open();
			}
			function EditPangkatGolongan(e) {
				$scope.itemPandG = [];
				e.preventDefault();
				var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
				if (dataItem == undefined) {
					alert("Data Belum Dipilih!")
					return;
				};
				$scope.itemPandG.masakerjagolongan = dataItem.masakerjagolongan
				var split = $scope.itemPandG.masakerjagolongan.split(" ")
				$scope.itemPandG.tahunmasakerjagolongan = split[0]
				$scope.itemPandG.bulanmasakerjagolongan = split[2]
				$scope.item.nomorId = dataItem.no;
				$scope.item.norecPG = dataItem.norec;
				$scope.itemPandG.golongan = {
					id: dataItem.objectgolonganfk,
					golongan: dataItem.name,
					level: dataItem.level
				};
				console.log(dataItem);
				$scope.itemPandG.tanggaltmt = moment(dataItem.tgltmt).format('YYYY-MM-DD HH:mm');
				$scope.itemPandG.tanggalsk = moment(dataItem.tglsk).format('YYYY-MM-DD HH:mm');
				$scope.itemPandG.pejabatmenetapkan = dataItem.pejabatmenetapkan;
				$scope.itemPandG.nosk = dataItem.nosk;
				$scope.itemPandG.nominal = dataItem.nominal;
				$scope.itemPandG.pejabatpenandatangan = dataItem.pejabatpenandatangan
				$scope.popUpRiwayatPangkatGolongan.center().open();
				// $scope.panggoltmt()
			}

			function EditGajiBerkala(e) {
				$scope.itemGajiBerkala = [];
				e.preventDefault();
				var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
				if (dataItem == undefined) {
					alert("Data Belum Dipilih!")
					return;
				};
				$scope.item.IdGajiBerkala = dataItem.no;
				// console.log(dataItem);
				$scope.item.norecGajiBerkala = dataItem.norec;
				$scope.itemGajiBerkala.golongan = {
					id: dataItem.objectgolonganfk,
					golongan: dataItem.name,
					level: dataItem.level
				};
				$scope.itemGajiBerkala.noskcetak = dataItem.noskcetak
				$scope.itemGajiBerkala.jenissk = dataItem.jenissk
				$scope.itemGajiBerkala.suratkeputusanBaru = {
					id: dataItem.objectsuratkeputusanfk, nosk2: dataItem.nosk2
				}
				$scope.gajilamanya = dataItem.jenisskco
				// console.log(dataItem);
				$scope.itemGajiBerkala.tanggaltmt = moment(dataItem.tgltmt).format('YYYY-MM-DD HH:mm');
				$scope.itemGajiBerkala.tanggalsk = moment(dataItem.tglsk).format('YYYY-MM-DD HH:mm');
				$scope.itemGajiBerkala.pejabatmenetapkan = dataItem.pejabatmenetapkan;
				$scope.itemGajiBerkala.nosk = dataItem.nosk;
				$scope.itemGajiBerkala.nosurat = dataItem.nosurat
				$scope.itemGajiBerkala.gajiawal = dataItem.gajiawal;
				$scope.itemGajiBerkala.gajiakhir = dataItem.gajiakhir;
				$scope.itemGajiBerkala.masakerjagolongan = dataItem.masakerjagolongan;
				if (dataItem.masakerjagolongan != null){
					$scope.itemGajiBerkala.tahunmasakerjagolongan = dataItem.masakerjagolongan.split(" ")[0]
					$scope.itemGajiBerkala.bulanmasakerjagolongan = dataItem.masakerjagolongan.split(" ")[2]
				}

				$scope.itemGajiBerkala.tanggaltmtcetak = moment(dataItem.tgltmtcetak).format('YYYY-MM-DD HH:mm');
				$scope.itemGajiBerkala.tanggalskbaru = moment(dataItem.tglskbaru).format('YYYY-MM-DD HH:mm');

				$scope.popUpRiwayatGajiBerkala.center().open();
				$scope.getDataGolongan()
			}

			function EditKomponenDel(e) {
				$scope.itemKomponenDel = [];
				e.preventDefault();
				var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
				if (dataItem == undefined) {
					alert("Data Belum Dipilih!")
					return;
				};
				$scope.item.norecKomDel = dataItem.norec;
				$scope.item.nomorId = dataItem.no;
				$scope.itemKomponenDel.komponen = { id: dataItem.idkomponengaji, komponengaji: dataItem.komponengaji };
				$scope.itemKomponenDel.isaktif = { id: dataItem.isaktif, aktif: dataItem.aktif };
				$scope.itemKomponenDel.tglAktif = moment(dataItem.tglAktif).format('YYYY-MM-DD HH:mm');
				$scope.itemKomponenDel.noSK = dataItem.noSK;
				$scope.popUpKomponenGajiDel.center().open();
			}

			function HapusJabatan(e) {
				e.preventDefault();
				var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
				if (dataItem == undefined) {
					alert("Data Belum Dipilih!")
					return;
				};
				var grid = this;
				var row = $(e.currentTarget).closest("tr");
				var tr = $(e.target).closest("tr");
				for (var i = dataRiwayatJabatan.length - 1; i >= 0; i--) {
					if (dataRiwayatJabatan[i].no == dataItem.no) {
						dataRiwayatJabatan.splice(i, 1);
					}
				}
				var data = {
					'datahapus': 'ok',
					'objectpegawaifk': $scope.item.idPegawai,
					'norec': dataItem.norec
				}
				grid.removeRow(row);
				medifirstService.post('sdm/save-riwayat-jabatan', data).then(function (data) {
					init();
				})
			}

			function HapusKomponenAdd(e) {
				e.preventDefault();
				var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
				if (dataItem == undefined) {
					alert("Data Belum Dipilih!")
					return;
				};
				var grid = this;
				var row = $(e.currentTarget).closest("tr");
				var tr = $(e.target).closest("tr");
				for (var i = dataKomponenGajiAdd.length - 1; i >= 0; i--) {
					if (dataKomponenGajiAdd[i].no == dataItem.no) {
						dataKomponenGajiAdd.splice(i, 1);
					}
				}
				grid.removeRow(row);
			}
			function HapusHukumanDisiplin(e) {
				e.preventDefault();
				var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
				if (dataItem == undefined) {
					alert("Data Belum Dipilih!")
					return;
				};
				var grid = this;
				var row = $(e.currentTarget).closest("tr");
				var tr = $(e.target).closest("tr");
				for (var i = dataHukumanDisiplin.length - 1; i >= 0; i--) {
					if (dataHukumanDisiplin[i].no == dataItem.no) {
						dataHukumanDisiplin.splice(i, 1);
					}
				}
				var itemDelete = {
					"norec": dataItem.norec
				}
				console.log(itemDelete);
				// return
				grid.removeRow(row);
				medifirstService.post('sdm/delete-data-hukuman-disiplin', itemDelete).then(function (e) {
					if (e.status === 201) {
						grid.removeRow(row);
					}
				})

			}

			function HapusCuti(e) {
				e.preventDefault();
				var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
				if (dataItem == undefined) {
					alert("Data Belum Dipilih!")
					return;
				};
				var grid = this;
				var row = $(e.currentTarget).closest("tr");
				var tr = $(e.target).closest("tr");
				for (var i = dataCuti.length - 1; i >= 0; i--) {
					if (dataCuti[i].no == dataItem.no) {
						dataCuti.splice(i, 1);
					}
				}
				var itemDelete = {
					"norec": dataItem.norec
				}
				console.log(itemDelete);
				// return
				grid.removeRow(row);
				medifirstService.post('sdm/delete-data-cuti', itemDelete).then(function (e) {
					if (e.status === 201) {
						grid.removeRow(row);
					}
				})

			}

			function HapusCutiAwal(e) {
				e.preventDefault();
				var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
				if (dataItem == undefined) {
					alert("Data Belum Dipilih!")
					return;
				};
				var grid = this;
				var row = $(e.currentTarget).closest("tr");
				var tr = $(e.target).closest("tr");
				for (var i = dataCutiAwal.length - 1; i >= 0; i--) {
					if (dataCutiAwal[i].no == dataItem.no) {
						dataCutiAwal.splice(i, 1);
					}
				}
				var itemDelete = {
					"norec": dataItem.norec
				}
				console.log(itemDelete);
				// return
				grid.removeRow(row);
				medifirstService.post('sdm/delete-total-cuti', itemDelete).then(function (e) {
					if (e.status === 201) {
						grid.removeRow(row);
					}
				})

			}

			function HapusPangkatGolongan(e) {
				e.preventDefault();
				var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
				if (dataItem == undefined) {
					alert("Data Belum Dipilih!")
					return;
				};
				var grid = this;
				var row = $(e.currentTarget).closest("tr");
				var tr = $(e.target).closest("tr");
				for (var i = dataRiwayatPangkatGolongan.length - 1; i >= 0; i--) {
					if (dataRiwayatPangkatGolongan[i].no == dataItem.no) {
						dataRiwayatPangkatGolongan.splice(i, 1);
					}
				}
				var itemDelete = {
					"norec": dataItem.norec
				}
				// console.log(itemDelete);
				// return
				grid.removeRow(row);
				medifirstService.post('sdm/delete-data-pangkat-golongan', itemDelete).then(function (e) {
					if (e.status === 201) {
						grid.removeRow(row);
					}
				})

			}

			function HapusGajiBerkala(e) {
				e.preventDefault();
				var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
				if (dataItem == undefined) {
					alert("Data Belum Dipilih!")
					return;
				};
				var grid = this;
				var row = $(e.currentTarget).closest("tr");
				var tr = $(e.target).closest("tr");
				for (var i = dataRiwayatPangkatGolongan.length - 1; i >= 0; i--) {
					if (dataRiwayatPangkatGolongan[i].no == dataItem.no) {
						dataRiwayatPangkatGolongan.splice(i, 1);
					}
				}
				console.log(dataItem);
				var itemDelete = {
					"norec": dataItem.norec,
					"gajiawal": dataItem.gajiawal,
					"objectgolonganfk": dataItem.objectgolonganfk,
					"objectpegawaifk": $scope.item.idPegawai
				}
				// console.log(itemDelete);
				// return
				medifirstService.post('sdm/delete-data-gaji-berkala', itemDelete).then(function (e) {
					if (e.status === 201) {
						grid.removeRow(row);
					}
				})

			}

			function HapusKomponenDel(e) {
				e.preventDefault();
				var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
				if (dataItem == undefined) {
					alert("Data Belum Dipilih!")
					return;
				};
				var grid = this;
				var row = $(e.currentTarget).closest("tr");
				var tr = $(e.target).closest("tr");
				for (var i = dataKomponenGajiDel.length - 1; i >= 0; i--) {
					if (dataKomponenGajiDel[i].no == dataItem.no) {
						dataKomponenGajiDel.splice(i, 1);
					}
				}
				grid.removeRow(row);
			}

			function EditSip(e) {
				e.preventDefault();
				var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
				if (dataItem == undefined) {
					alert("Data Belum Dipilih!")
					return;
				};
				$scope.item.norecSip = dataItem.norec;
				$scope.item.noIdSip = dataItem.no;
				var unitKerja = []
				for (var i = 0; i < $scope.ListUnitKerja.length; i++) {
					if ($scope.ListUnitKerja[i].id == dataItem.unitkerjafk) {
						unitKerja = $scope.ListUnitKerja[i]
						break
					}

				}
				$scope.itemSip.unitKerja = unitKerja//{id:dataItem.unitkerjafk,name:dataItem.unitkerja};
				$scope.itemSip.subUnitKerja = { id: dataItem.subunitkerjafk, name: dataItem.subunit };
				$scope.itemSip.noSip = dataItem.nomor;
				$scope.itemSip.tglSipAkhir = moment(dataItem.tglberakhir).format('YYYY-MM-DD HH:mm');
				$scope.popUpSip.center().open();
			}

			function HapusSip(e) {
				e.preventDefault();
				var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
				if (dataItem == undefined) {
					alert("Data Belum Dipilih!")
					return;
				};
				var grid = this;
				var row = $(e.currentTarget).closest("tr");
				var tr = $(e.target).closest("tr");
				for (var i = dataSip.length - 1; i >= 0; i--) {
					if (dataSip[i].no == dataItem.no) {
						dataSip.splice(i, 1);
					}
				}

				var itemDelete = {
					"norec": dataItem.norec
				}

				medifirstService.post('sdm/delete-data-sipstr', itemDelete).then(function (e) {
					if (e.status === 201) {
						grid.removeRow(row);
					}
				})
			}

			function EditStr(e) {
				e.preventDefault();
				var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
				if (dataItem == undefined) {
					alert("Data Belum Dipilih!")
					return;
				};
				var unitKerja = []
				for (var i = 0; i < $scope.ListUnitKerja.length; i++) {
					if ($scope.ListUnitKerja[i].id == dataItem.unitkerjafk) {
						unitKerja = $scope.ListUnitKerja[i]
						break
					}
				}
				$scope.item.norecStr = dataItem.norec;
				$scope.item.noIdStr = dataItem.no;
				$scope.itemStr.unitKerja = unitKerja//{id:dataItem.unitkerjafk,name:dataItem.unitkerja};
				$scope.itemStr.subUnitKerja = { id: dataItem.subunitkerjafk, name: dataItem.subunit };
				$scope.itemStr.noStr = dataItem.nomor;
				$scope.itemStr.tglStrAkhir = moment(dataItem.tglberakhir).format('YYYY-MM-DD HH:mm');
				$scope.popUpStr.center().open();
			}

			function HapusStr(e) {
				e.preventDefault();
				var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
				if (dataItem == undefined) {
					alert("Data Belum Dipilih!")
					return;
				};
				var grid = this;
				var row = $(e.currentTarget).closest("tr");
				var tr = $(e.target).closest("tr");
				for (var i = dataStr.length - 1; i >= 0; i--) {
					if (dataStr[i].no == dataItem.no) {
						dataStr.splice(i, 1);
					}
				}

				var itemDelete = {
					"norec": dataItem.norec
				}

				// managePhp.postData2('sdm-pegawai/delete-data-sipstr', itemDelete).then(function (e) {
				medifirstService.post('sdm/delete-data-sipstr', itemDelete).then(function (e) {
					if (e.status === 201) {
						grid.removeRow(row);
					}
				})
			}

			$scope.createPendNew = function () {
				$scope.item.norecPend = "";
				$scope.item.nomor = undefined;
				$scope.popUpRiwayatPendidikan.center().open();
				var actions = $scope.popUpRiwayatPendidikan.options.actions;
				actions.splice(actions.indexOf("Close"), 1);
				$scope.popUpRiwayatPendidikan.setOptions({ actions: actions });
			}

			$scope.createPelatihanNew = function () {
				$scope.item.norecPel = "";
				$scope.item.nomor = undefined;
				$scope.popUpRiwayatPelatihan.center().open();
				var actions = $scope.popUpRiwayatPelatihan.options.actions;
				actions.splice(actions.indexOf("Close"), 1);
				$scope.popUpRiwayatPelatihan.setOptions({ actions: actions });
			}

			$scope.createNew = function () {
				$scope.item.id = "";
				$scope.item.no = undefined;
				$scope.popUpDataKeluarga.center().open();
				var actions = $scope.popUpDataKeluarga.options.actions;
				actions.splice(actions.indexOf("Close"), 1);
				$scope.popUpDataKeluarga.setOptions({ actions: actions });
			}

			$scope.createJabatanNew = function (data) {
				$scope.item.norecJab = "";
				$scope.item.nomorId = undefined;
				for (let i = 0; i < $scope.listJenisJabatan.length; i++) {
					console.log($scope.listJenisJabatan[i]);
					if (data == $scope.listJenisJabatan[i].id) {
						$scope.itemJabatan.jenisJabatan = {
							id: $scope.listJenisJabatan[i].id,
							jenisjabatan: $scope.listJenisJabatan[i].jenisjabatan,
						}
					}
					if(data == 8){
						$scope.eselonshow = true
					}else{
						$scope.eselonshow = false
					}
					
				}
				$scope.ubah()
				$scope.popUpRiwayatJabatan.center().open();
				var actions = $scope.popUpRiwayatJabatan.options.actions;
				actions.splice(actions.indexOf("Close"), 1);
				$scope.popUpRiwayatJabatan.setOptions({ actions: actions });
			}
			$scope.createPangkatGolongan = function () {
				if ($scope.item.kategoryPegawai != undefined && $scope.item.kategoryPegawai.id == 23){
					var data = []
					var listpangkatgolongan = ''
					// var 
					console.log($scope.ListGolonganPegawai);
					for (let i = 0; i < $scope.ListGolonganPegawai.length; i++) {
						if ($scope.ListGolonganPegawai[i].ispppk == true){
							data.push($scope.ListGolonganPegawai[i])
						}
					}
					$scope.ListGolonganPegawaiData = data
				} else{
					var data = []
					for (let i = 0; i < $scope.ListGolonganPegawai.length; i++) {
						if ($scope.ListGolonganPegawai[i].ispppk == null) {
							data.push($scope.ListGolonganPegawai[i])
						}
					}
					$scope.ListGolonganPegawaiData = data
				}

				$scope.item.norecPG = "";
				$scope.item.nomorId = undefined;
				$scope.popUpRiwayatPangkatGolongan.center().open();
				var actions = $scope.popUpRiwayatPangkatGolongan.options.actions;
				actions.splice(actions.indexOf("Close"), 1);
				$scope.popUpRiwayatPangkatGolongan.setOptions({
					actions: actions
				});
			}

			$scope.createKomponenAdd = function () {
				$scope.item.norecKomAdd = "";
				$scope.item.nomorId = undefined;
				$scope.popUpKomponenGajiAdd.center().open();
				var actions = $scope.popUpKomponenGajiAdd.options.actions;
				actions.splice(actions.indexOf("Close"), 1);
				$scope.popUpKomponenGajiAdd.setOptions({ actions: actions });
			}

			$scope.createGajiBerkala = function () {
				$scope.item.norecGajiBerkala = "";
				$scope.item.IdGajiBerkala = undefined;
				$scope.popUpRiwayatGajiBerkala.center().open();
				var actions = $scope.popUpRiwayatGajiBerkala.options.actions;
				actions.splice(actions.indexOf("Close"), 1);
				$scope.popUpRiwayatGajiBerkala.setOptions({ actions: actions });
			}

			$scope.createGajiBerkalaPangkat = function () {
				$scope.item.norecGajiBerkala = "";
				$scope.item.IdGajiBerkala = undefined;
				$scope.popUpRiwayatGajiBerkalaPangkat.center().open();
				var actions = $scope.popUpRiwayatGajiBerkalaPangkat.options.actions;
				actions.splice(actions.indexOf("Close"), 1);
				$scope.popUpRiwayatGajiBerkalaPangkat.setOptions({ actions: actions });
			}

			$scope.createHukumanDisiplin = function () {
				$scope.item.norechudis = "";
				$scope.item.nomorIdh = undefined;
				$scope.popUpHukumanDisiplin.center().open();
				var actions = $scope.popUpHukumanDisiplin.options.actions;
				actions.splice(actions.indexOf("Close"), 1);
				$scope.popUpHukumanDisiplin.setOptions({
					actions: actions
				});
			}

			$scope.createCuti = function () {
				$scope.item.noreccuti = "";
				$scope.item.nomorIdcuti = undefined;
				$scope.popUpCuti.center().open();
				var actions = $scope.popUpCuti.options.actions;
				actions.splice(actions.indexOf("Close"), 1);
				$scope.popUpCuti.setOptions({
					actions: actions
				});
			}

			$scope.createCutiAwal = function () {
				$scope.item.noreccutiAwal = "";
				$scope.item.nomorIdcutiAwal = undefined;
				$scope.popUpCutiAwal.center().open();
				var actions = $scope.popUpCutiAwal.options.actions;
				actions.splice(actions.indexOf("Close"), 1);
				$scope.popUpCutiAwal.setOptions({
					actions: actions
				});
			}

			$scope.createKomponenDel = function () {
				$scope.item.norecKomDel = "";
				$scope.item.nomorId = undefined;
				$scope.popUpKomponenGajiDel.center().open();
				var actions = $scope.popUpKomponenGajiDel.options.actions;
				actions.splice(actions.indexOf("Close"), 1);
				$scope.popUpKomponenGajiDel.setOptions({ actions: actions });
			}

			$scope.createSip = function () {
				$scope.item.norecSip = "";
				$scope.item.nomorId = undefined;
				$scope.popUpSip.center().open();
				var actions = $scope.popUpSip.options.actions;
				actions.splice(actions.indexOf("Close"), 1);
				$scope.popUpSip.setOptions({ actions: actions });
			}

			$scope.createStr = function () {
				$scope.item.norecStr = "";
				$scope.item.nomorId = undefined;
				$scope.popUpStr.center().open();
				var actions = $scope.popUpStr.options.actions;
				actions.splice(actions.indexOf("Close"), 1);
				$scope.popUpStr.setOptions({ actions: actions });
			}

			$scope.batalDataKeluarga = function (data) {
				ClearDataKeluarga();
				if(data == 'issuamiistri'){
					$scope.popUpDataKeluargaSuamiIstri.close()
				}
				if (data == 'isanak') {
					$scope.popUpDataKeluargaAnak.close()
				}
				if (data == 'isorangtua') {
					$scope.popUpDataKeluargaOrangTua.close()
				}
				// $scope.popUpDataKeluarga.close();
			}
			$scope.batalCuti = function () {
				ClearCuti();
				$scope.popUpCuti.close();
			}

			$scope.batalCutiAwal = function () {
				ClearCutiAwal();
				$scope.popUpCutiAwal.close();
			}

			$scope.batalRiwayatPendidikan = function () {
				ClearDataRiwayatPendidikan();
				$scope.popUpRiwayatPendidikan.close();
			}
			$scope.batalRiwayatGajiBerkala = function () {
				ClearDataRiwayatGajiBerkala();
				$scope.popUpRiwayatGajiBerkala.close();
			}

			$scope.batalRiwayatGajiBerkalaPangkat = function () {
				ClearDataRiwayatGajiBerkalaPangkat();
				$scope.popUpRiwayatGajiBerkalaPangkat.close();
			}

			$scope.batalRiwayatPelatihan = function () {
				ClearDataRiwayatPelatihan();
				$scope.popUpRiwayatPelatihan.close();
			}

			$scope.batalRiwayatJabatan = function () {
				$scope.itemJabatan = {};
				ClearDataRiwayatJabatan();
				$scope.popUpRiwayatJabatan.close();
			}
			$scope.batalRiwayatPangkatGolongan = function () {
				ClearDataRiwayatPangkatGolongan();
				$scope.popUpRiwayatPangkatGolongan.close();
			}
			

			$scope.batalKomponenAdd = function () {
				ClearDataKomponenAdd();
				$scope.popUpKomponenGajiAdd.close();
			}
			$scope.batalHukumanDisiplin = function () {
				ClearDataHukumanDisiplin();
				$scope.popUpHukumanDisiplin.close();
			}

			$scope.batalKomponenDel = function () {
				ClearDataKomponenDel();
				$scope.popUpKomponenGajiDel.close();
			}

			$scope.batalSip = function () {
				ClearDataSip();
				document.getElementById("coba").reset();
				$scope.popUpSip.close();
			}

			$scope.batalStr = function () {
				ClearDataStr();
				document.getElementById("coba2").reset();
				$scope.popUpStr.close();
			}

			$scope.tambahDataKeluarga = function (dataaaaa) {
				var listRawRequired = [
					// "itemKeluarga.namaAnggotaKeluarga|ng-model|Nama Anggota Keluarga",
					// "itemKeluarga.hubunganKeluarga|ng-model|Hubungan Keluarga",
					// "itemKeluarga.tglLahir|k-ng-model|Tgl Lahir Anggota Keluarga",
					// "itemKeluarga.jenisKelaminKl|k-ng-model|Jenis Kelamin Anggota Keluarga",
					// //"itemKeluarga.namaAyah|ng-model|Nama Ayah",
					// //"itemKeluarga.namaIbu|ng-model|Nama Ibu",
					// "itemKeluarga.statusPerkawinanPegawaiKL|k-ng-model|Status Perkawinan Anggota Keluarga",
					// "itemKeluarga.PekerjaanKL|k-ng-model|Pekerjaan Anggota Keluarga",
					// "itemKeluarga.nipIstriSuami|ng-model|Nip Istri / Suami",
					// "itemKeluarga.statusTanggungan|k-ng-model|Status Tanggungan",
					// "itemKeluarga.alamat|ng-model|Alamat Anggota Keluarga",
					// "itemKeluarga.pendidikan|k-ng-model|Pendidikan Terkahir",
				];

				var noSuratKuliah = "-";
				if ($scope.itemKeluarga.noSuratKuliah != undefined) {
					noSuratKuliah = $scope.itemKeluarga.noSuratKuliah
				}

				var tglsuratKuliah = null
				if ($scope.itemKeluarga.tglsuratKuliah != undefined) {
					tglsuratKuliah = $scope.itemKeluarga.tglsuratKuliah;
				}

				var keterangan = "-"
				if ($scope.itemKeluarga.keterangan != undefined) {
					keterangan = $scope.itemKeluarga.keterangan;
				}

				var nipsuamiistri = "-"
				if ($scope.itemKeluarga.nipIstriSuami != undefined) {
					nipsuamiistri = $scope.itemKeluarga.nipIstriSuami;
				}

				var isValid = ModelItem.setValidation($scope, listRawRequired);
				if (isValid.status) {
					var nomor = 0
					if ($scope.gridKeluarga == undefined) {
						nomor = 1
					} else {
						nomor = dataKeluarga.length + 1
					}
					var data = {};
					if ($scope.item.no != undefined) {
						for (var i = dataKeluarga.length - 1; i >= 0; i--) {
							if (dataKeluarga[i].no == $scope.item.no) {
								data.no = $scope.item.no
								data.namalengkap= $scope.itemKeluarga.namaAnggotaKeluarga != undefined ? $scope.itemKeluarga.namaAnggotaKeluarga : null,
								data.objectkdhubunganfk= $scope.itemKeluarga.hubunganKeluarga != undefined ? $scope.itemKeluarga.hubunganKeluarga.id : null,
								data.hubungankeluarga= $scope.itemKeluarga.hubunganKeluarga != undefined ? $scope.itemKeluarga.hubunganKeluarga.hubungankeluarga : null,
								data.tgllahir= $scope.itemKeluarga.tglLahir != undefined ? moment($scope.itemKeluarga.tglLahir).format('YYYY-MM-DD HH:mm') : null,
								data.objectjeniskelaminfk= $scope.itemKeluarga.jenisKelaminKl != undefined ? $scope.itemKeluarga.jenisKelaminKl.id : null,
								data.jeniskelamin= $scope.itemKeluarga.jenisKelaminKl != undefined ? $scope.itemKeluarga.jenisKelaminKl.jeniskelamin : null,
								data.namaayah= $scope.itemKeluarga.namaAyah != undefined ? $scope.itemKeluarga.namaAyah : null,
								data.namaibu= $scope.itemKeluarga.namaIbu != undefined ? $scope.itemKeluarga.namaIbu : null,
								data.objectstatusperkawinanpegawaifk= $scope.itemKeluarga.statusPerkawinanPegawaiKL != undefined ? $scope.itemKeluarga.statusPerkawinanPegawaiKL.id : null,
								data.statusperkawinan= $scope.itemKeluarga.statusPerkawinanPegawaiKL != undefined ? $scope.itemKeluarga.statusPerkawinanPegawaiKL.statusperkawinan : null,
								data.pekerjaan= $scope.itemKeluarga.PekerjaanKL != undefined ? $scope.itemKeluarga.PekerjaanKL.pekerjaan : null,
								data.objectpekerjaanfk= $scope.itemKeluarga.PekerjaanKL != undefined ? $scope.itemKeluarga.PekerjaanKL.id : null,
								data.nipistrisuami= nipsuamiistri,
								data.statustanggungan= $scope.itemKeluarga.statusTanggungan != undefined ? $scope.itemKeluarga.statusTanggungan.reportdisplay : null,
								data.statustanggunganfk= $scope.itemKeluarga.statusTanggungan != undefined ? $scope.itemKeluarga.statusTanggungan.id : null,
								data.nosuratkuliah= noSuratKuliah,
								data.tglsuratkuliah= tglsuratKuliah,
								data.keterangan= keterangan,
								data.id= $scope.item.id,
								data.alamat= $scope.itemKeluarga.alamat != undefined ? $scope.itemKeluarga.alamat : null,
								data.objectpendidikanterakhirfk= $scope.itemKeluarga.pendidikan != undefined ? $scope.itemKeluarga.pendidikan.id : null,
								data.pendidikan= $scope.itemKeluarga.pendidikan != undefined ? $scope.itemKeluarga.pendidikan.pendidikan : null,
								data.objectpegawaifk= $scope.item.idPegawai,
								data.tunjangan= $scope.itemKeluarga.Tunjangan != undefined ? $scope.itemKeluarga.Tunjangan : null,
								data.issuamiistri= dataaaaa == 'issuamiistri' ? true : null,
								data.isana= dataaaaa == 'isanak' ? true : null,
								data.isorangtua= dataaaaa == 'isorangtua' ? true : null,
								data.kariskarsu= $scope.itemKeluarga.kariskarsu != undefined ? $scope.itemKeluarga.kariskarsu : null,
								data.tglnikah= $scope.itemKeluarga.tglnikah != undefined ? moment($scope.itemKeluarga.tglnikah).format('YYYY-MM-DD HH:mm') : null
								
								dataKeluarga[i] = data;
								$scope.gridKeluarga = new kendo.data.DataSource({
									data: dataKeluarga
								});
							}
						}
						console.log(data);
						medifirstService.post('sdm/save-riwayat-datakeluarga', data).then(function (data) {
							init();
						})
					} else {

						data = {
							no: nomor,
							namalengkap: $scope.itemKeluarga.namaAnggotaKeluarga != undefined ? $scope.itemKeluarga.namaAnggotaKeluarga : null,
							objectkdhubunganfk: $scope.itemKeluarga.hubunganKeluarga != undefined ? $scope.itemKeluarga.hubunganKeluarga.id :null,
							hubungankeluarga: $scope.itemKeluarga.hubunganKeluarga != undefined ? $scope.itemKeluarga.hubunganKeluarga.hubungankeluarga:null,
							tgllahir: $scope.itemKeluarga.tglLahir != undefined ? moment($scope.itemKeluarga.tglLahir).format('YYYY-MM-DD HH:mm') : null,
							objectjeniskelaminfk: $scope.itemKeluarga.jenisKelaminKl != undefined ? $scope.itemKeluarga.jenisKelaminKl.id : null,
							jeniskelamin: $scope.itemKeluarga.jenisKelaminKl != undefined ? $scope.itemKeluarga.jenisKelaminKl.jeniskelamin:null,
							namaayah: $scope.itemKeluarga.namaAyah != undefined ? $scope.itemKeluarga.namaAyah:null,
							namaibu: $scope.itemKeluarga.namaIbu != undefined ? $scope.itemKeluarga.namaIbu:null,
							objectstatusperkawinanpegawaifk: $scope.itemKeluarga.statusPerkawinanPegawaiKL!= undefined ? $scope.itemKeluarga.statusPerkawinanPegawaiKL.id:null,
							statusperkawinan: $scope.itemKeluarga.statusPerkawinanPegawaiKL != undefined ? $scope.itemKeluarga.statusPerkawinanPegawaiKL.statusperkawinan:null,
							pekerjaan: $scope.itemKeluarga.PekerjaanKL != undefined? $scope.itemKeluarga.PekerjaanKL.pekerjaan:null,
							objectpekerjaanfk: $scope.itemKeluarga.PekerjaanKL != undefined ? $scope.itemKeluarga.PekerjaanKL.id:null,
							nipistrisuami: nipsuamiistri,
							statustanggungan: $scope.itemKeluarga.statusTanggungan!=undefined? $scope.itemKeluarga.statusTanggungan.reportdisplay:null,
							statustanggunganfk: $scope.itemKeluarga.statusTanggungan!= undefined? $scope.itemKeluarga.statusTanggungan.id:null,
							nosuratkuliah: noSuratKuliah,
							tglsuratkuliah: tglsuratKuliah,
							keterangan: keterangan,
							id: $scope.item.id,
							alamat: $scope.itemKeluarga.alamat != undefined ? $scope.itemKeluarga.alamat:null,
							objectpendidikanterakhirfk: $scope.itemKeluarga.pendidikan!= undefined ? $scope.itemKeluarga.pendidikan.id:null,
							pendidikan: $scope.itemKeluarga.pendidikan != undefined ? $scope.itemKeluarga.pendidikan.pendidikan:null,
							objectpegawaifk: $scope.item.idPegawai,
							tunjangan: $scope.itemKeluarga.Tunjangan != undefined ? $scope.itemKeluarga.Tunjangan: null,
							issuamiistri: dataaaaa == 'issuamiistri' ? true : null,
							isanak: dataaaaa == 'isanak' ? true : null,
							isorangtua: dataaaaa == 'isorangtua' ? true : null,
							kariskarsu: $scope.itemKeluarga.kariskarsu != undefined ? $scope.itemKeluarga.kariskarsu:null,
							tglnikah: $scope.itemKeluarga.tglnikah != undefined ? moment($scope.itemKeluarga.tglnikah).format('YYYY-MM-DD HH:mm') : null
						}
						dataKeluarga.push(data)
						
						$scope.gridKeluarga = new kendo.data.DataSource({
							data: dataKeluarga
						});
						console.log(data);
						medifirstService.post('sdm/save-riwayat-datakeluarga', data).then(function (data) {
							init();
						})
					}
					ClearDataKeluarga();
					if(dataaaaa == 'issuamiistri'){
						$scope.popUpDataKeluargaSuamiIstri.close();
					}
					if (dataaaaa == 'isanak') {
						$scope.popUpDataKeluargaAnak.close();
					}
					if (dataaaaa == 'isorangtua') {
						$scope.popUpDataKeluargaOrangTua.close();
					}
				} else {
					ModelItem.showMessages(isValid.messages);
				}
			}

			$scope.tambahRiwayatPendidikan = function () {
				var listRawRequired = [
					//"itemPendidikan.pendidikan|k-ng-model|Pendidikan",
					"itemPendidikan.pendidikanpegawai|k-ng-model|Pendidikan Pegawai",
					"itemPendidikan.NamaInstitusi|ng-model|Nama Institusi",
					"itemPendidikan.alamat|ng-model|Alamat Institusi",
					//"itemPendidikan.tglMasukPend|k-ng-model|Tgl Masuk",
					"itemPendidikan.tglLulus|k-ng-model|Tgl Lulus",
					// "itemPendidikan.ipk|ng-model|IPK Kelulusan",                                                      
				];

				var jurusan = "-";
				if ($scope.itemPendidikan.jurusan != undefined) {
					jurusan = $scope.itemPendidikan.jurusan
				}

				var noIjasah = "-";
				if ($scope.itemPendidikan.noIjasah != undefined) {
					noIjasah = $scope.itemPendidikan.noIjasah;
				}

				var tglIjasah = null;
				if ($scope.itemPendidikan.tglIjasah != undefined) {
					tglIjasah = moment($scope.itemPendidikan.tglIjasah).format('YYYY-MM-DD HH:mm');
				}

				var ipk = 0;
				if ($scope.itemPendidikan.ipk != undefined) {
					ipk = $scope.itemPendidikan.ipk;
				}

				var isValid = ModelItem.setValidation($scope, listRawRequired);
				if (isValid.status) {
					var nomor = 0
					if ($scope.gridRiwayatPendidikan == undefined) {
						nomor = 1
					} else {
						nomor = dataRiwayatPendidikan.length + 1
					}
					var data = {};
					if ($scope.item.nomor != undefined) {
						for (var i = dataRiwayatPendidikan.length - 1; i >= 0; i--) {
							if (dataRiwayatPendidikan[i].no == $scope.item.nomor) {
								data.no = $scope.item.nomor
								//data.objectpendidikanfk = $scope.itemPendidikan.pendidikan.id
								//data.pendidikan = $scope.itemPendidikan.pendidikan.pendidikan
								data.pendidikanpegawai = $scope.itemPendidikan.pendidikanpegawai.pendidikanpegawai
								data.objectpendidikanpegawaifk = $scope.itemPendidikan.pendidikanpegawai.id
								data.namatempatpendidikan = $scope.itemPendidikan.NamaInstitusi
								data.alamattempatpendidikan = $scope.itemPendidikan.alamat
								data.tglmasuk = moment($scope.itemPendidikan.tglMasukPend).format('YYYY-MM-DD HH:mm')
								data.tgllulus = moment($scope.itemPendidikan.tglLulus).format('YYYY-MM-DD HH:mm')
								data.nilaiipk = ipk
								data.jurusan = jurusan
								data.noijazah = noIjasah
								data.tglijazah = tglIjasah
								data.norec = $scope.item.norecPend
								data.objectpegawaifk = $scope.item.idPegawai
								dataRiwayatPendidikan[i] = data;
								$scope.gridRiwayatPendidikan = new kendo.data.DataSource({
									data: dataRiwayatPendidikan
								});
							}
							
						}
						medifirstService.post('sdm/save-riwayat-pendidikan', data).then(function (data) {
							init();

						})
					} else {

						data = {
							no: nomor,
							// objectpendidikanfk: $scope.itemPendidikan.pendidikan.id,
							// pendidikan: $scope.itemPendidikan.pendidikan.pendidikan,
							pendidikanpegawai: $scope.itemPendidikan.pendidikanpegawai.pendidikanpegawai,
							objectpendidikanpegawaifk: $scope.itemPendidikan.pendidikanpegawai.id,
							namatempatpendidikan: $scope.itemPendidikan.NamaInstitusi,
							alamattempatpendidikan: $scope.itemPendidikan.alamat,
							tglmasuk: moment($scope.itemPendidikan.tglMasukPend).format('YYYY-MM-DD HH:mm'),
							tgllulus: moment($scope.itemPendidikan.tglLulus).format('YYYY-MM-DD HH:mm'),
							nilaiipk: ipk,
							jurusan: jurusan,
							noijazah: noIjasah,
							tglijazah: tglIjasah,
							norec: $scope.item.norecPend,
							objectpegawaifk: $scope.item.idPegawai
						}

						dataRiwayatPendidikan.push(data)
						$scope.gridRiwayatPendidikan = new kendo.data.DataSource({
							data: dataRiwayatPendidikan
						});
						console.log(data);
						// return
						medifirstService.post('sdm/save-riwayat-pendidikan', data).then(function(data){
							init();

						})

					}
					ClearDataRiwayatPendidikan();
					$scope.popUpRiwayatPendidikan.close();
				} else {
					ModelItem.showMessages(isValid.messages);
				}
			}

			$scope.tambahRiwayatPelatihan = function () {
				var listRawRequired = [
					"itemPelatihan.namaInstitusi|ng-model|Nama Penyelenggara",
					// "itemPelatihan.namaPelatihan|k-ng-model|Nama Pelatihan",
					"itemPelatihan.lokasi|ng-model|Lokasi Pelatihan",
					"itemPelatihan.tglMulaiPel|k-ng-model|Tgl Masuk",
					"itemPelatihan.tglSelesaiPel|k-ng-model|Tgl Lulus",
					"itemPelatihan.durasi|ng-model|Durasi Pelatihan",
					"itemPelatihan.unitpenginput|k-ng-model|Unit Penginput",
					"itemPelatihan.jenispelatihan|k-ng-model|Jenis Pelatihan",
					"itemPelatihan.penyelenggara|k-ng-model|Penyelenggara",
					"itemPelatihan.biayadiklat|k-ng-model|Biaya Diklat",
					"itemPelatihan.biayasppd|k-ng-model|Biaya SPPD",
					"itemPelatihan.sumberdana|k-ng-model|Sumber Dana",
				];


				var noSertifikat = "-";
				if ($scope.itemPelatihan.noSertifikat != undefined) {
					noSertifikat = $scope.itemPelatihan.noSertifikat;
				}

				// var unitpenginput = "-";
				// if ($scope.item.unitpenginput != undefined) {
				// 	unitpenginput = $scope.itemPelatihan.unitpenginput;
				// }
				
				var keterangan = "-";
				if ($scope.itemPelatihan.keterangan != undefined) {
					keterangan = $scope.itemPelatihan.keterangan;
				}

				var isValid = ModelItem.setValidation($scope, listRawRequired);
				if (isValid.status) {
					var nomor = 0
					if ($scope.gridRiwayatPelatihan == undefined) {
						nomor = 1
					} else {
						nomor = dataRiwayatPelatihan.length + 1
					}
					var data = {};
					if ($scope.item.nomor != undefined) {
						if ($scope.itemPelatihan.penyelenggara.id == 1) {
							$scope.editpenyelenggara = $scope.itemPelatihan.namaPelatihan2.namapelatihan
						} else {
							$scope.editpenyelenggara = $scope.itemPelatihan.namaPelatihan
						}
						for (var i = dataRiwayatPelatihan.length - 1; i >= 0; i--) {
							if (dataRiwayatPelatihan[i].no == $scope.item.nomor) {
								data.no = $scope.item.nomor
								data.instansipenyelenggara = $scope.itemPelatihan.namaInstitusi
								data.namapelatihan = $scope.editpenyelenggara
								data.lokasipelatihan = $scope.itemPelatihan.lokasi
								data.tglmulai = moment($scope.itemPelatihan.tglMulaiPel).format('YYYY-MM-DD HH:mm')
								data.tglakhir = moment($scope.itemPelatihan.tglSelesaiPel).format('YYYY-MM-DD HH:mm')
								data.durasi = $scope.itemPelatihan.durasi
								data.nosertifikat = noSertifikat
								data.keterangan = keterangan
								data.norec = $scope.item.norecPel
								data.unitpenginputfk = $scope.itemPelatihan.unitpenginput.id
								data.jenispelatihanfk = $scope.itemPelatihan.jenispelatihan.id
								data.penyelenggara = $scope.itemPelatihan.penyelenggara.penyelenggara
								data.biayadiklat = $scope.itemPelatihan.biayadiklat
								data.biayasppd = $scope.itemPelatihan.biayasppd
								data.sumberdanafk = $scope.itemPelatihan.sumberdana.id
								dataRiwayatPelatihan[i] = data;
								data.objectpegawaifk = $scope.item.idPegawai
								$scope.gridRiwayatPelatihan = new kendo.data.DataSource({
									data: dataRiwayatPelatihan
								});
							}
						}
						medifirstService.post('sdm/save-riwayat-pelatihan', data).then(function (data) {
							init();
						})
					} else {
						var penyelenggara = "";
						if ($scope.itemPelatihan.penyelenggara.id == 1) {
							penyelenggara = $scope.itemPelatihan.namaPelatihan2.namapelatihan
						} else {
							penyelenggara = $scope.itemPelatihan.namaPelatihan
						}
						data = {
							no: nomor,
							instansipenyelenggara: $scope.itemPelatihan.namaInstitusi,
							namapelatihan: penyelenggara,
							lokasipelatihan: $scope.itemPelatihan.lokasi,
							tglmulai: moment($scope.itemPelatihan.tglMulaiPel).format('YYYY-MM-DD HH:mm'),
							tglakhir: moment($scope.itemPelatihan.tglSelesaiPel).format('YYYY-MM-DD HH:mm'),
							durasi: $scope.itemPelatihan.durasi,
							nosertifikat: noSertifikat,
							keterangan: keterangan,
							norec: $scope.item.norecPel,
							unitpenginputfk: $scope.itemPelatihan.unitpenginput.id,
							jenispelatihanfk: $scope.itemPelatihan.jenispelatihan.id,
							penyelenggara: $scope.itemPelatihan.penyelenggara.penyelenggara,
							biayadiklat: $scope.itemPelatihan.biayadiklat,
							biayasppd: $scope.itemPelatihan.biayasppd,
							sumberdanafk: $scope.itemPelatihan.sumberdana.id,
							objectpegawaifk: $scope.item.idPegawai
						}

						dataRiwayatPelatihan.push(data)
						$scope.gridRiwayatPelatihan = new kendo.data.DataSource({
							data: dataRiwayatPelatihan
						});
						medifirstService.post('sdm/save-riwayat-pelatihan', data).then(function (data) {
							init();
						})
					}
					ClearDataRiwayatPelatihan();
					$scope.popUpRiwayatPelatihan.close();
				} else {
					ModelItem.showMessages(isValid.messages);
				}
			}

			$scope.tambahRiwayatJabatan = function () {
				var listRawRequired = [
					"itemJabatan.jenisJabatan|k-ng-model|Jenis Jabatan",
					"itemJabatan.jabatan|k-ng-model|Nama Jabatan",
					"itemJabatan.noSK|ng-model|Nomor SK",
					"itemJabatan.tglSK|k-ng-model|Tgl SK",
					"itemJabatan.ttdSK|k-ng-model|Penandatangan SK",
					"itemJabatan.jabatanTtd|k-ng-model|Penandatangan Jabatan",
					"itemJabatan.nominaltunjangan|ng-model|Tunjangan",
				];

				var isValid = ModelItem.setValidation($scope, listRawRequired);
				if (isValid.status) {
					var nomorId = 0
					if ($scope.gridRiwayatJabatan == undefined) {
						nomorId = 1
					} else {
						nomorId = dataRiwayatPendidikan.length + 1
					}
					var data = {};
					if ($scope.item.nomorId != undefined) {
						for (var i = dataRiwayatJabatan.length - 1; i >= 0; i--) {
							if (dataRiwayatJabatan[i].no == $scope.item.nomorId) {

								data.no = $scope.item.nomorId
								data.objectjenisjabatanfk = $scope.itemJabatan.jenisJabatan.id
								data.jenisjabatan = $scope.itemJabatan.jenisJabatan.jenisjabatan
								data.objectjabatanfk = $scope.itemJabatan.jabatan.id
								data.namajabatan = $scope.itemJabatan.jabatan.namajabatan
								data.nosk = $scope.itemJabatan.noSK
								data.tglsk = moment($scope.itemJabatan.tglSK).format('DD-MM-YYYY')
								console.log(data.tglsk);
								// data.objectpegawaittdfk = $scope.itemJabatan.ttdSK.id
								// data.pegawaittd = $scope.itemJabatan.ttdSK.namalengkap
								// data.objectjabatanttdfk = $scope.itemJabatan.jabatanTtd.id
								data.namajabatanttd = $scope.itemJabatan.jabatanTtd.namajabatan
								data.pegawaipenanggungjawab = $scope.itemJabatan.ttdSK + " / " + $scope.itemJabatan.jabatanTtd
								data.norec = $scope.item.norecJab
								data.tunjangan = $scope.itemJabatan.nominaltunjangan
								data.ttdsk = $scope.itemJabatan.ttdSK
								data.ttdjabatansk = $scope.itemJabatan.jabatanTtd
								data.objectpegawaifk = $scope.item.idPegawai
								data.eselon = $scope.itemJabatan.tunjangan.id
								dataRiwayatJabatan[i] = data;
								$scope.gridRiwayatJabatan = new kendo.data.DataSource({
									data: dataRiwayatJabatan
								});
							}
						}
						medifirstService.post('sdm/save-riwayat-jabatan', data).then(function (data) {
							init();
							$scope.itemJabatan = {}
						})

					} else {

						data = {
							no: nomorId,
							objectjenisjabatanfk: $scope.itemJabatan.jenisJabatan.id,
							jenisjabatan: $scope.itemJabatan.jenisJabatan.jenisjabatan,
							objectjabatanfk: $scope.itemJabatan.jabatan.id,
							namajabatan: $scope.itemJabatan.jabatan.namajabatan,
							nosk: $scope.itemJabatan.noSK,
							tglsk: moment($scope.itemJabatan.tglSK).format('YYYY-MM-DD'),
							// objectpegawaittdfk: $scope.itemJabatan.ttdSK.id,
							// pegawaittd: $scope.itemJabatan.ttdSK.namalengkap,
							// objectjabatanttdfk: $scope.itemJabatan.jabatanTtd.id,
							namajabatanttd: $scope.itemJabatan.jabatanTtd.namajabatan,
							pegawaipenanggungjawab: $scope.itemJabatan.ttdSK + " / " + $scope.itemJabatan.jabatanTtd,
							norec: $scope.item.norecJab,
							ttdsk: $scope.itemJabatan.ttdSK,
							tunjangan: $scope.itemJabatan.nominaltunjangan,
							ttdjabatansk: $scope.itemJabatan.jabatanTtd,
							objectpegawaifk: $scope.item.idPegawai,
							eselon: $scope.itemJabatan.tunjangan.id,
							tmtjabatan: moment($scope.itemJabatan.tmtjabatan).format('YYYY-MM-DD'),
							instansi: $scope.itemJabatan.instansi
						}

						dataRiwayatJabatan.push(data)
						$scope.gridRiwayatJabatan = new kendo.data.DataSource({
							data: dataRiwayatJabatan
						});
						medifirstService.post('sdm/save-riwayat-jabatan', data).then(function (data) {
							init();
							$scope.itemJabatan = {}
						})
					}
					ClearDataRiwayatJabatan();
					$scope.popUpRiwayatJabatan.close();
				} else {
					ModelItem.showMessages(isValid.messages);
				}
			}
			// $scope.panggoltmt = function () {
			// 	var split = $scope.itemPandG.masakerjagolongan.split(" ")
			// 	var nominal = parseInt(split[0])
			// 	medifirstService.get('nominal/get-nominal?golongan=' + $scope.itemPandG.golongan.id + '&mkg=' + nominal).then(function (data) {
			// 		console.log(data);
			// 		$scope.itemPandG.nominal = data.data.gajigolongan[0].gajipokok
			// 	})
			// 	// if (dataRiwayatPangkatGolongan.length > 0) {
			// 	// 	console.log('bisa');
			// 	// 	var umur = dateHelper.CountAge(new Date(dataRiwayatPangkatGolongan[0].tgltmt), new Date($scope.itemPandG.tanggaltmt));
			// 	// 	var nominal = umur.year
			// 	// 	medifirstService.get('nominal/get-nominal?golongan=' + $scope.itemPandG.golongan.id+ '&mkg='+nominal).then(function (data) {
			// 	// 		console.log(data);
			// 	// 		$scope.itemPandG.nominal = data.data.gajigolongan[0].gajipokok
			// 	// 	})
			// 	// }else{
			// 	// 	var umur = dateHelper.CountAge(new Date($scope.itemPandG.tanggaltmt), new Date($scope.now));
			// 	// 	var nominal = umur.year
			// 	// 	console.log(nominal);
			// 	// 	medifirstService.get('nominal/get-nominal?golongan=' + $scope.itemPandG.golongan.id + '&mkg=' + 0).then(function (data) {
			// 	// 		console.log(data);
			// 	// 		$scope.itemPandG.nominal = data.data.gajigolongan[0].gajipokok
			// 	// 	})
			// 	// }
			// }

			
			
			$scope.tambahRiwayatPangkatGolongan = function () {
				
				var listRawRequired = [
					"itemPandG.golongan|k-ng-model|Golongan",
					"itemPandG.tanggalsk|k-ng-model|Tanggal SK",
					"itemPandG.nosk|ng-model|NO SK",
					"itemPandG.pejabatmenetapkan|ng-model|Pejabat Yang Menetapkan",
					"itemPandG.tanggaltmt|k-ng-model|Tanggal TMT",
					"itemPandG.nominal|ng-model|Nominal",
					// "itemPandG.masakerjagolongan|ng-model|Masa Kerja Golongan",
					// "itemPandG.jabatanTtd|k-ng-model|Penandatangan Jabatan",
				];

				var isValid = ModelItem.setValidation($scope, listRawRequired);
				console.log(isValid);
				if (isValid.status) {
					var nomorId = 0
					if ($scope.gridRiwayatPangkatGolongan == undefined) {
						nomorId = 1
					} else {
						nomorId = dataRiwayatPangkatGolongan.length + 1
					}
					var data = {};
					
					if ($scope.item.nomorId != undefined) {
						for (var i = dataRiwayatPangkatGolongan.length - 1; i >= 0; i--) {
							if (dataRiwayatPangkatGolongan[i].no == $scope.item.nomorId) {

								data.no = $scope.item.nomorId
								data.tglsk= moment($scope.itemPandG.tanggalsk).format('YYYY-MM-DD HH:mm');
								data.tgltmt= moment($scope.itemPandG.tanggaltmt).format('YYYY-MM-DD HH:mm');
								data.norec= $scope.item.norecPG;
								data.pejabatmenetapkan= $scope.itemPandG.pejabatmenetapkan;
								data.objectgolonganfk= $scope.itemPandG.golongan.id;
								data.golongan= $scope.itemPandG.golongan.golongan;
								data.nosk = $scope.itemPandG.nosk
								data.nominal = $scope.itemPandG.nominal
								data.objectpegawaifk = $scope.item.idPegawai;
								data.masakerjagolongan = $scope.itemPandG.tahunmasakerjagolongan + ' tahun ' + $scope.itemPandG.bulanmasakerjagolongan + ' bulan'
								data.pejabatpenandatangan = $scope.itemPandG.pejabatpenandatangan

								dataRiwayatPangkatGolongan[i] = data;
								console.log(data);
								$scope.gridRiwayatPangkatGolongan = new kendo.data.DataSource({
									data: dataRiwayatPangkatGolongan
								});
							}
						}
						medifirstService.post('sdm/save-riwayat-pangkat-golongan', data).then(function (data) {
							init();
						})
					} else {
						
						data = {
							no: nomorId,
							tglsk: moment($scope.itemPandG.tanggalsk).format('YYYY-MM-DD HH:mm'),
							tgltmt: moment($scope.itemPandG.tanggaltmt).format('YYYY-MM-DD HH:mm'),
							norec: $scope.item.norecPG,
							pejabatmenetapkan: $scope.itemPandG.pejabatmenetapkan,
							pejabatpenandatangan: $scope.itemPandG.pejabatpenandatangan,
							objectgolonganfk: $scope.itemPandG.golongan.id,
							golongan: $scope.itemPandG.golongan.golongan,
							nosk: $scope.itemPandG.nosk,
							nominal: $scope.itemPandG.nominal,
							objectpegawaifk: $scope.item.idPegawai,
							masakerjagolongan: $scope.itemPandG.tahunmasakerjagolongan + ' tahun ' + $scope.itemPandG.bulanmasakerjagolongan + ' bulan',
						}
						dataRiwayatPangkatGolongan.push(data)
						$scope.gridRiwayatPangkatGolongan = new kendo.data.DataSource({
							data: dataRiwayatPangkatGolongan
						});
						medifirstService.post('sdm/save-riwayat-pangkat-golongan', data).then(function (data) {
							init();
						})
						var update = false;
						console.log($scope.item.golonganPegawai);
						if ($scope.item.golonganPegawai.id == null) {
							var golongan = "";
							golongan = $scope.itemPandG.golongan.id
							var nominal = 0;
							nominal = $scope.itemPandG.nominal
							var confirm = $mdDialog.confirm()
								.title('Peringatan')
								.textContent('Apakah anda ingin menyimpan data sebagai golongan terakhir?')
								.ariaLabel('Lucky day')
								.cancel('Tidak')
								.ok('Ya')
							$mdDialog.show(confirm).then(function () {
								update = true;
								var datas = {
									update: update,
									objectpegawaifk: $scope.item.idPegawai,
									objectgolonganfk: golongan,
									gajiakhir: nominal,

								}
								medifirstService.post('sdm/update-pangkat-golongan-terakhir', datas).then(function (data) {
									init();
								})
							});
						}else{
							if ($scope.itemPandG.golongan.id < $scope.item.golonganPegawai.id) {
								var golongan = "";
								golongan = $scope.itemPandG.golongan.id
								var nominal = 0;
								nominal = $scope.itemPandG.nominal
								var confirm = $mdDialog.confirm()
									.title('Peringatan')
									.textContent('Apakah anda ingin menyimpan data sebagai golongan terakhir?')
									.ariaLabel('Lucky day')
									.cancel('Tidak')
									.ok('Ya')
								$mdDialog.show(confirm).then(function () {
									update = true;
									var datas = {
										update: update,
										objectpegawaifk: $scope.item.idPegawai,
										objectgolonganfk: golongan,
										gajiakhir: nominal,

									}
									medifirstService.post('sdm/update-pangkat-golongan-terakhir', datas).then(function (data) {
										init();
									})
								});
								ClearDataRiwayatPangkatGolongan();
							} else {
								ClearDataRiwayatPangkatGolongan();
							}
						}
						
					}
					$scope.popUpRiwayatPangkatGolongan.close();
				} else {
					ModelItem.showMessages(isValid.messages);
				}
			}

			$scope.tambahRiwayatGajiBerkala = function () {
				var listRawRequired = [
					"itemGajiBerkala.gajiawal|ng-model|gaji Pokok Lama",
					"itemGajiBerkala.gajiakhir|ng-model|gaji Pokok Baru",
					"itemGajiBerkala.tanggalsk|k-ng-model|Tanggal SK",
					"itemGajiBerkala.golongan|k-ng-model|Golongan",
					"itemGajiBerkala.nosk|ng-model|NO SK Baru",
					// "itemGajiBerkala.nosurat|ng-model|No Surat",
					"itemGajiBerkala.pejabatmenetapkan|ng-model|Pejabat Yang Menetapkan",
					"itemGajiBerkala.tanggaltmt|k-ng-model|Tanggal TMT",
					"itemGajiBerkala.tahunmasakerjagolongan|ng-model|Tahun Gaji Berkala",
					"itemGajiBerkala.bulanmasakerjagolongan|ng-model|Bulan Gaji Berkala",
					"itemGajiBerkala.noskcetak|ng-model|No SK Lama",
					"itemGajiBerkala.jenissk|ng-model|Jenis SK",
					"itemGajiBerkala.masakerjagolongan|ng-model|Masa Kerja Golongan",
					"itemGajiBerkala.suratkeputusanBaru|ng-model|Surat Keputusan",
					// "itemPandG.jabatanTtd|k-ng-model|Penandatangan Jabatan",
				];

				var isValid = ModelItem.setValidation($scope, listRawRequired);
				console.log(isValid);
				if (isValid.status) {
					var nomorId = 0
					// console.log($scope.gridRiwayatGajiBerkala);
					if ($scope.gridRiwayatGajiBerkala == undefined) {
						nomorId = 1
					} else {
						nomorId = dataRiwayatGajiBerkala.length + 1
					}
					var data = {};
					if ($scope.item.IdGajiBerkala != undefined) {
						for (var i = dataRiwayatGajiBerkala.length - 1; i >= 0; i--) {
							if (dataRiwayatGajiBerkala[i].no == $scope.item.IdGajiBerkala) {
								data.no = $scope.item.IdGajiBerkala
								data.tglsk = moment($scope.itemGajiBerkala.tanggalsk).format('YYYY-MM-DD HH:mm');
								data.tgltmt = moment($scope.itemGajiBerkala.tanggaltmt).format('YYYY-MM-DD HH:mm');
								data.norec = $scope.item.norecGajiBerkala;
								data.pejabatmenetapkan = $scope.itemGajiBerkala.pejabatmenetapkan;
								data.gajiawal = $scope.itemGajiBerkala.gajiawal;
								data.gajiakhir = $scope.itemGajiBerkala.gajiakhir;
								data.objectgolonganfk = $scope.itemGajiBerkala.golongan.id;
								data.golongan = $scope.itemGajiBerkala.golongan.golongan;
								data.nosk = $scope.itemGajiBerkala.nosk
								data.objectpegawaifk = $scope.item.idPegawai
								data.noskcetak= $scope.itemGajiBerkala.noskcetak,
								data.jenissk = $scope.itemGajiBerkala.jenissk
								data.jenisskco = $scope.gajilamanya
								data.masakerjagolongan = $scope.itemGajiBerkala.tahunmasakerjagolongan + " tahun " + $scope.itemGajiBerkala.bulanmasakerjagolongan + " bulan"
								data.tgltmtcetak = moment($scope.itemGajiBerkala.tanggaltmtcetak).format('YYYY-MM-DD HH:mm')
								data.tglskbaru = moment($scope.itemGajiBerkala.tanggalskbaru).format('YYYY-MM-DD HH:mm')
								data.suratkeputusan = $scope.itemGajiBerkala.suratkeputusanBaru
								dataRiwayatGajiBerkala[i] = data;

								$scope.gridRiwayatGajiBerkala = new kendo.data.DataSource({
									data: dataRiwayatGajiBerkala
								});
							}
						}
						medifirstService.post('sdm/save-riwayat-gaji-berkala', data).then(function (data) {
							init();
						})
					} else {
						data = {
							no: nomorId,
							tglsk: moment($scope.itemGajiBerkala.tanggalsk).format('YYYY-MM-DD HH:mm'),
							tgltmt: moment($scope.itemGajiBerkala.tanggaltmt).format('YYYY-MM-DD HH:mm'),
							norec: $scope.item.norecGajiBerkala,
							pejabatmenetapkan: $scope.itemGajiBerkala.pejabatmenetapkan,
							gajiawal: $scope.itemGajiBerkala.gajiawal,
							gajiakhir: $scope.itemGajiBerkala.gajiakhir,
							nosk: $scope.itemGajiBerkala.nosk,
							golongan: $scope.itemGajiBerkala.golongan.golongan,
							objectgolonganfk: $scope.itemGajiBerkala.golongan.id,
							objectpegawaifk: $scope.item.idPegawai,
							nosurat: $scope.itemGajiBerkala.nosurat,
							noskcetak: $scope.itemGajiBerkala.noskcetak,
							jenissk: $scope.itemGajiBerkala.jenissk,
							jenisskco: $scope.gajilamanya,
							masakerjagolongan: $scope.itemGajiBerkala.tahunmasakerjagolongan + " tahun " + $scope.itemGajiBerkala.bulanmasakerjagolongan + " bulan",
							tgltmtcetak: moment($scope.itemGajiBerkala.tanggaltmtcetak).format('YYYY-MM-DD HH:mm'),
							tglskbaru: moment($scope.itemGajiBerkala.tanggalskbaru).format('YYYY-MM-DD HH:mm'),
							objectsuratkeputusanfk: $scope.itemGajiBerkala.suratkeputusanBaru.id
						}
						dataRiwayatGajiBerkala.push(data)
						$scope.gridRiwayatGajiBerkala = new kendo.data.DataSource({
							data: dataRiwayatGajiBerkala
						});
						medifirstService.post('sdm/save-riwayat-gaji-berkala', data).then(function (data) {
							init();
						})
					}
					ClearDataRiwayatGajiBerkala();
					$scope.popUpRiwayatGajiBerkala.close();
					
				} else {
					ModelItem.showMessages(isValid.messages);
				}
			}


			$scope.tambahKomponenAdd = function () {
				var listRawRequired = [
					"itemKomponenAdd.komponen|k-ng-model|Komponen Gaji",
					"itemKomponenAdd.noSK|k-ng-model|Nomor SK",
					"itemKomponenAdd.isaktif|k-ng-model|Aktif",
					"itemKomponenAdd.tglAktif|k-ng-model|Tgl Aktif",
				];

				var isValid = ModelItem.setValidation($scope, listRawRequired);
				if (isValid.status) {
					var nomorId = 0
					if ($scope.gridKomponenGajiAdd == undefined) {
						nomorId = 1
					} else {
						nomorId = dataKomponenGajiAdd.length + 1
					}
					var data = {};
					if ($scope.item.nomorId != undefined) {
						for (var i = dataKomponenGajiAdd.length - 1; i >= 0; i--) {
							if (dataKomponenGajiAdd[i].no == $scope.item.nomorId) {
								data.norec = $scope.item.norecKomAdd
								data.no = nomorId,
								data.idkomponengaji = $scope.itemKomponenAdd.komponen.id,
								data.komponengaji = $scope.itemKomponenAdd.komponen.komponengaji,
								data.isaktif = $scope.itemKomponenAdd.isaktif.id,
								data.aktif = $scope.itemKomponenAdd.isaktif.aktif,
								data.tglaktif = moment($scope.itemKomponenAdd.tglAktif).format('YYYY-MM-DD HH:mm'),
								data.noSK = $scope.itemKomponenAdd.noSK,
								dataKomponenGajiAdd[i] = data;
								$scope.gridKomponenGajiAdd = new kendo.data.DataSource({
									data: dataKomponenGajiAdd
								});
							}
						}

					} else {

						data = {
							no: nomorId,
							idkomponengaji: $scope.itemKomponenAdd.komponen.id,
							komponengaji: $scope.itemKomponenAdd.komponen.komponengaji,
							isaktif: $scope.itemKomponenAdd.isaktif.id,
							aktif: $scope.itemKomponenAdd.isaktif.aktif,
							tglaktif: moment($scope.itemKomponenAdd.tglAktif).format('YYYY-MM-DD HH:mm'),
							norec: $scope.item.norecKomAdd,
							noSK: $scope.itemKomponenAdd.noSK
						}

						dataKomponenGajiAdd.push(data)
						$scope.gridKomponenGajiAdd = new kendo.data.DataSource({
							data: dataKomponenGajiAdd
						});
					}
					ClearDataKomponenAdd();
					$scope.popUpKomponenGajiAdd.close();
				} else {
					ModelItem.showMessages(isValid.messages);
				}
			}

			$scope.tambahhudis = function () {
				var listRawRequired = [
					"itemHukumanDisiplin.jenishukuman|k-ng-model|Jenis Hukuman",
					"itemHukumanDisiplin.nosk|ng-model|NO SK",
					"itemHukumanDisiplin.tgldari|k-ng-model|Masa Berlaku Dari",
					"itemHukumanDisiplin.tglsampai|k-ng-model|Tgl Sampai",
					"itemHukumanDisiplin.tglsk|k-ng-model|Tgl SK",
					"itemHukumanDisiplin.pejabatmenetapkan|ng-model|Pejabat Menetapkan",
				];

				var isValid = ModelItem.setValidation($scope, listRawRequired);
				if (isValid.status) {
					var nomorIdh = 0
					if ($scope.gridHukumanDisiplin == undefined) {
						nomorIdh = 1
					} else {
						nomorIdh = dataHukumanDisiplin.length + 1
					}
					var data = {};
					console.log($scope.item.nomorIdh);
					if ($scope.item.nomorIdh != undefined) {
						for (var i = dataHukumanDisiplin.length - 1; i >= 0; i--) {
							if (dataHukumanDisiplin[i].no == $scope.item.nomorIdh) {
								console.log(data);
								data.norec = $scope.item.norechudis
								data.no = nomorIdh,
									data.jenishukuman = $scope.itemHukumanDisiplin.jenishukuman.jenishukuman;
									data.objectjenishukumanfk = $scope.itemHukumanDisiplin.jenishukuman.id;
									data.tgldari = moment($scope.itemHukumanDisiplin.tgldari).format('YYYY-MM-DD HH:mm');
									data.tglsampai = moment($scope.itemHukumanDisiplin.tglsampai).format('YYYY-MM-DD HH:mm');
									data.pejabatmenetapkan = $scope.itemHukumanDisiplin.pejabatmenetapkan;
									data.nosk = $scope.itemHukumanDisiplin.nosk;
									data.tglsk = moment($scope.itemHukumanDisiplin.tglsk).format('YYYY-MM-DD HH:mm');
									data.objectpegawaifk= $scope.item.idPegawai;

									dataHukumanDisiplin[i] = data
								$scope.gridHukumanDisiplin = new kendo.data.DataSource({
									data: dataHukumanDisiplin
								});
							}
						}
						medifirstService.post('sdm/save-riwayat-hukuman-disiplin', data).then(function (data) {
							init();
						})
					} else {

						data = {
							no: nomorIdh,
							norec: $scope.item.norechudis,
							objectjenishukumanfk: $scope.itemHukumanDisiplin.jenishukuman.id,
							tgldari: moment($scope.itemHukumanDisiplin.tgldari).format('YYYY-MM-DD HH:mm'),
							tglsampai: moment($scope.itemHukumanDisiplin.tglsampai).format('YYYY-MM-DD HH:mm'),
							pejabatmenetapkan: $scope.itemHukumanDisiplin.pejabatmenetapkan,
							tglsk: moment($scope.itemHukumanDisiplin.tglsk).format('YYYY-MM-DD HH:mm'),
							jenishukuman: $scope.itemHukumanDisiplin.jenishukuman.jenishukuman,
							nosk: $scope.itemHukumanDisiplin.nosk,
							objectpegawaifk: $scope.item.idPegawai
						}

						dataHukumanDisiplin.push(data)

						$scope.gridHukumanDisiplin = new kendo.data.DataSource({
							data: dataHukumanDisiplin
						});
						medifirstService.post('sdm/save-riwayat-hukuman-disiplin', data).then(function (data) {
							init();
						})
					}
					ClearDataHukumanDisiplin();
					$scope.popUpHukumanDisiplin.close();
				} else {
					ModelItem.showMessages(isValid.messages);
				}
			}

			$scope.tambahCuti = function () {
				var listRawRequired = [
					// "itemCuti.jenishukuman|k-ng-model|Jenis Hukuman",
					"itemCuti.nosk|ng-model|NO SK",
					"itemCuti.tgldari|k-ng-model|Masa Berlaku Dari",
					"itemCuti.tglsampai|k-ng-model|Tgl Sampai",
					"itemCuti.tglsk|k-ng-model|Tgl SK",
					"itemCuti.pejabatmenetapkan|ng-model|Pejabat Menetapkan",
				];

				var isValid = ModelItem.setValidation($scope, listRawRequired);
				if (isValid.status) {
					var nomorIdh = 0
					if ($scope.gridCuti == undefined) {
						nomorIdh = 1
					} else {
						nomorIdh = dataCuti.length + 1
					}
					var data = {};
					if ($scope.item.nomorIdcuti != undefined) {
						for (var i = dataCuti.length - 1; i >= 0; i--) {
							if (dataCuti[i].no == $scope.item.nomorIdcuti) {
								console.log(data);
								data.norec = $scope.item.noreccuti
								data.no = nomorIdh,
								data.tgldari = moment($scope.itemCuti.tgldari).format('YYYY-MM-DD HH:mm');
								data.tglsampai = moment($scope.itemCuti.tglsampai).format('YYYY-MM-DD HH:mm');
								data.pejabatmenetapkan = $scope.itemCuti.pejabatmenetapkan;
								data.nosk = $scope.itemCuti.nosk;
								data.tglsk = moment($scope.itemCuti.tglsk).format('YYYY-MM-DD HH:mm');
								data.objectpegawaifk = $scope.item.idPegawai
								dataCuti[i] = data

								$scope.gridCuti = new kendo.data.DataSource({
									data: dataCuti
								});
							}
						}
						medifirstService.post('sdm/save-riwayat-cuti', data).then(function (data) {
							init();
						})
					} else {
						data = {
							no: nomorIdh,
							norec: $scope.item.noreccuti,
							tgldari: moment($scope.itemCuti.tgldari).format('YYYY-MM-DD HH:mm'),
							tglsampai: moment($scope.itemCuti.tglsampai).format('YYYY-MM-DD HH:mm'),
							pejabatmenetapkan: $scope.itemCuti.pejabatmenetapkan,
							tglsk: moment($scope.itemCuti.tglsk).format('YYYY-MM-DD HH:mm'),
							nosk: $scope.itemCuti.nosk,
							objectpegawaifk: $scope.item.idPegawai

						}

						$scope.gridCuti = new kendo.data.DataSource({
							data: dataCuti
						});
						medifirstService.post('sdm/save-riwayat-cuti', data).then(function (data) {
							init();
						})
					}
					ClearDataCuti();
					$scope.popUpCuti.close();
				} else {
					ModelItem.showMessages(isValid.messages);
				}
			}

			$scope.tambahCutiAwal = function () {
				var listRawRequired = [
					"itemCutiAwal.tahun|k-ng-model|Tahun",
					"itemCutiAwal.jumlahcuti|ng-model|Jumlah Cuti",
				];
				

				var isValid = ModelItem.setValidation($scope, listRawRequired);
				if (isValid.status) {
					var nomorIdcutiAwal = 0
					if ($scope.gridCutiAwal == undefined) {
						nomorIdcutiAwal = 1
					} else {
						nomorIdcutiAwal = dataCutiAwal.length + 1
					}
					var data = {};
					if ($scope.item.nomorIdcutiAwal != undefined) {
						for (var i = dataCutiAwal.length - 1; i >= 0; i--) {
							if (dataCutiAwal[i].no == $scope.item.nomorIdcutiAwal) {
								console.log(data);
								data.norec = $scope.item.noreccutiAwal
								data.no = nomorIdcutiAwal,
								data.tglpengajuan = moment($scope.itemCutiAwal.tahun).format('YYYY'),
								data.jumlahhari = $scope.itemCutiAwal.jumlahcuti,
								data.objectpegawaifk = $scope.item.idPegawai
								dataCutiAwal[i] = data

								$scope.gridCutiAwal = new kendo.data.DataSource({
									data: dataCutiAwal
								});
							}
						}
						medifirstService.post('sdm/save-total-cuti', data).then(function (data) {
							init();
						})
					} else {
						data = {
							no: nomorIdcutiAwal,
							norec: $scope.item.noreccutiAwal,
							tglpengajuan: moment($scope.itemCutiAwal.tahun).format('YYYY'),
							jumlahhari: $scope.itemCutiAwal.jumlahcuti,
							objectpegawaifk: $scope.item.idPegawai
						}

						$scope.gridCutiAwal = new kendo.data.DataSource({
							data: dataCutiAwal
						});
						medifirstService.post('sdm/save-total-cuti', data).then(function (data) {
							init();
						})
					}
					ClearDataCutiAwal();
					$scope.popUpCutiAwal.close();
				} else {
					ModelItem.showMessages(isValid.messages);
				}
			}

			$scope.tambahKomponenDel = function () {
				var listRawRequired = [
					"itemKomponenDel.komponen|k-ng-model|Komponen Gaji",
					"itemKomponenDel.noSK|k-ng-model|Nomor SK",
					"itemKomponenDel.isaktif|k-ng-model|Aktif",
					"itemKomponenDel.tglAktif|k-ng-model|Tgl Aktif",
				];

				var isValid = ModelItem.setValidation($scope, listRawRequired);
				if (isValid.status) {
					var nomorId = 0
					if ($scope.gridKomponenGajiDel == undefined) {
						nomorId = 1
					} else {
						nomorId = dataKomponenGajiDel.length + 1
					}
					var data = {};
					if ($scope.item.nomorId != undefined) {
						for (var i = dataKomponenGajiDel.length - 1; i >= 0; i--) {
							if (dataKomponenGajiDel[i].no == $scope.item.nomorId) {
								data.norec = $scope.item.norecKomDel
								data.no = nomorId,
								data.idkomponengaji = $scope.itemKomponenDel.komponen.id,
								data.komponengaji = $scope.itemKomponenDel.komponen.komponengaji,
								data.isaktif = $scope.itemKomponenDel.isaktif.id,
								data.aktif = $scope.itemKomponenDel.isaktif.aktif,
								data.tglaktif = moment($scope.itemKomponenDel.tglAktif).format('YYYY-MM-DD HH:mm'),
								data.noSK = $scope.itemKomponenDel.noSK,
								dataKomponenGajiDel[i] = data;
								$scope.gridKomponenGajiDel = new kendo.data.DataSource({
									data: dataKomponenGajiDel
								});
							}
						}

					} else {

						data = {
							no: nomorId,
							idkomponengaji: $scope.itemKomponenDel.komponen.id,
							komponengaji: $scope.itemKomponenDel.komponen.komponengaji,
							isaktif: $scope.itemKomponenDel.isaktif.id,
							aktif: $scope.itemKomponenDel.isaktif.aktif,
							tglaktif: moment($scope.itemKomponenDel.tglAktif).format('YYYY-MM-DD HH:mm'),
							norec: $scope.item.norecKomDel,
							noSK: $scope.itemKomponenDel.noSK
						}

						dataKomponenGajiDel.push(data)
						$scope.gridKomponenGajiDel = new kendo.data.DataSource({
							data: dataKomponenGajiDel
						});
					}
					ClearDataKomponenDel();
					$scope.popUpKomponenGajiDel.close();
				} else {
					ModelItem.showMessages(isValid.messages);
				}
			}

			$scope.tambahSip = function () {
				var listRawRequired = [
					// "itemSip.unitKerja|k-ng-model|Unit Kerja",
					// "itemSip.subUnitKerja|k-ng-model|Sub Unit Kerja",
					"itemSip.noSip|ng-model|Nomor SIP",
					"itemSip.tglSipAkhir|k-ng-model|Tanggal Berakhir",
				];

				var isValid = ModelItem.setValidation($scope, listRawRequired);
				if (isValid.status) {
					var noIdSip = 0
					if ($scope.gridSip == undefined) {
						noIdSip = 1
					} else {
						noIdSip = dataSip.length + 1
					}
					var data = {};
					if ($scope.item.noIdSip != undefined) {
						for (var i = gridSip.length - 1; i >= 0; i--) {
							if (gridSip[i].no == $scope.item.noIdSip) {

								data.no = $scope.item.noIdSip
								data.unitkerjafk = $scope.itemSip.unitKerja.id
								data.unitkerja = $scope.itemSip.unitKerja.name
								data.subunitkerjafk = $scope.itemSip.subUnitKerja.subunit.id
								data.subunit = $scope.itemSip.subUnitKerja.subunit.name
								data.nomor = $scope.itemSip.noSip
								data.tglberakhir = moment($scope.itemSip.tglSipAkhir).format('YYYY-MM-DD HH:mm')
								data.norec = $scope.item.norecSip
								jenismasaberlakufk = 1

								dataSip[i] = data;
								$scope.gridSip = new kendo.data.DataSource({
									data: dataSip
								});
							}
						}

					} else {

						data = {
							no: noIdSip,
							unitkerjafk: $scope.itemSip.unitKerja.id,
							unitkerja: $scope.itemSip.unitKerja.name,
							subunitkerjafk: $scope.itemSip.subUnitKerja.id,
							subunit: $scope.itemSip.subUnitKerja.name,
							nomor: $scope.itemSip.noSip,
							tglberakhir: moment($scope.itemSip.tglSipAkhir).format('YYYY-MM-DD HH:mm'),
							norec: $scope.item.norecSip,
							jenismasaberlakufk: 1,
						}

						dataSip.push(data)
						$scope.gridSip = new kendo.data.DataSource({
							data: dataSip
						});
					}
					ClearDataSip();
					$scope.popUpSip.close();
				} else {
					ModelItem.showMessages(isValid.messages);
				}
			}

			$scope.tambahStr = function () {
				var listRawRequired = [
					// "itemStr.unitKerja|k-ng-model|Unit Kerja",
					// "itemStr.subUnitKerja|k-ng-model|Sub Unit Kerja",
					"itemStr.noStr|ng-model|Nomor SIP",
					"itemStr.tglStrAkhir|k-ng-model|Tanggal Berakhir",
				];

				var isValid = ModelItem.setValidation($scope, listRawRequired);
				if (isValid.status) {
					var noIdStr = 0
					if ($scope.gridStr == undefined) {
						noIdStr = 1
					} else {
						noIdStr = dataStr.length + 1
					}
					var data = {};
					if ($scope.item.noIdStr != undefined) {
						for (var i = gridStr.length - 1; i >= 0; i--) {
							if (gridStr[i].no == $scope.item.noIdStr) {

								data.no = $scope.item.noIdStr
								data.unitkerjafk = $scope.itemStr.unitKerja.id
								data.unitkerja = $scope.itemStr.unitKerja.name
								data.subunitkerjafk = $scope.itemStr.subUnitKerja.subunit.id
								data.subunit = $scope.itemStr.subUnitKerja.subunit.name
								data.nomor = $scope.itemStr.noStr
								data.tglberakhir = moment($scope.itemStr.tglStrAkhir).format('YYYY-MM-DD HH:mm')
								data.norec = $scope.item.norecStr

								dataStr[i] = data;
								$scope.gridStr = new kendo.data.DataSource({
									data: dataStr
								});
							}
						}

					} else {

						data = {
							no: noIdStr,
							unitkerjafk: $scope.itemStr.unitKerja.id,
							unitkerja: $scope.itemStr.unitKerja.name,
							subunitkerjafk: $scope.itemStr.subUnitKerja.id,
							subunit: $scope.itemStr.subUnitKerja.name,
							nomor: $scope.itemStr.noStr,
							tglberakhir: moment($scope.itemStr.tglStrAkhir).format('YYYY-MM-DD HH:mm'),
							norec: $scope.item.norecStr,
						}

						dataStr.push(data)
						$scope.gridStr = new kendo.data.DataSource({
							data: dataStr
						});
					}
					ClearDataStr();
					$scope.popUpStr.close();
				} else {
					ModelItem.showMessag4es(isValid.messages);
				}
			}


			$scope.simpan = function () {
				var listRawRequired = [

					// Data Pegawai
					"item.nama|ng-model|Nama Pegawai",
					"item.tempatLahir|ng-model|Tempat Lahir",
					// "item.tglLahir|k-ng-model|Tgl Lahir Pegawai",
					"item.jenisKelamin|k-ng-model|Jenis Kelamin Pegawai",
					"item.pendidikan|k-ng-model|Pendidikan Terakhir",
					//"item.pendidikanpegawai|k-ng-model|Pendidikan Pegawai",
					"item.statusPerkawinanPegawai|k-ng-model|Status Perkawinan",
					"item.agama|k-ng-model|Agama",
					// Data Pegawai

					// Data Rekening Bank
						// "item.bankRekeningNomor|ng-model|Nomor Rekening Pegawai",
						// "item.bankRekeningAtasNama|ng-model|Nama Pemilik Rekening",
						// "item.bankRekeningNama|ng-model|Nama Bank Rekening",
					// Data Rekening Bank

					// Data Alamat
						// "item.alamat|ng-model|Alamat Pegawai",
						// "item.kodePos|ng-model|Kode Pos",
					// Data Alamat

					// Data Phone
						// "item.nomor1|ng-model|Nomor Telpon 1",
						// "item.provider1|k-ng-model|Provider Nomor Telpon 1",
						// "item.nomor2|ng-model|Nomor Telpon 2",
						// "item.provider2|k-ng-model|Provider Nomor Telpon 2",
					// Data Phone

					// Data Status Pegawai
					// "item.tglMasuk|k-ng-model|Tgl Masuk Pegawai",
					// "item.kategoryPegawai|k-ng-model|Status Pegawai",
					// "item.kedudukan|k-ng-model|Kedudukan Pegawai",
					// "item.golonganPegawai|k-ng-model|Golongan Pegawai",
					// "item.jabatanFungsional|k-ng-model|Jabatan Pegawai",
					// "item.detailKelompokJabatan|k-ng-model|Kelompok Jabatan Pegawai",
					// "item.eselon|k-ng-model|Eselon Pegawai",
					// "item.idFinger|ng-model|ID Finger Print",
					// "item.shiftKerja|k-ng-model|Shift Pegawai",
					"item.JenisPegawai|k-ng-model|Jenis Pegawai|"
					// Data Status Pegawai

					// Data Login Pegawai
					// "itemLogin.kelompokUser|k-ng-model|Kelompok User",  
					// Data Login Pegawai
				];

				var id = ""
				if ($scope.item.idPegawai != undefined) {
					id = $scope.item.idPegawai
				}
				var nik = ""
				if ($scope.item.nik != undefined) {
					nik = $scope.item.nik
				}
				var nokarpeg = ""
				if ($scope.item.nokarpeg != undefined) {
					nokarpeg = $scope.item.nokarpeg
				}

				var nobpjs = ""
				if ($scope.item.nobpjs != undefined) {
					nobpjs = $scope.item.nobpjs
				}

				var aktakelahiran = ""
				if ($scope.item.aktakelahiran != undefined) {
					aktakelahiran = $scope.item.aktakelahiran
				}

				var taspen = ""
				if ($scope.item.taspen != undefined) {
					taspen = $scope.item.taspen
				}
				var email = ""
				if ($scope.item.email != undefined) {
					email = $scope.item.email
				}

				var nipPns = "-";
				if ($scope.item.nipPns != undefined) {
					nipPns = $scope.item.nipPns
				}

				var gelarDepan = "";
				if ($scope.item.gelarDepan != undefined) {
					gelarDepan = $scope.item.gelarDepan;
				}

				var gelarBelakang = "";
				if ($scope.item.gelarBelakang != undefined) {
					gelarBelakang = $scope.item.gelarBelakang;
				}

				var Npwp = "-";
				if ($scope.item.npwp != undefined) {
					Npwp = $scope.item.npwp;
				}

				var tglKeluar = null;
				if ($scope.item.tglkeluar != undefined) {
					tglKeluar = moment($scope.item.tglkeluar).format('YYYY-MM-DD HH:mm');
				}

				var tglPensiun = null;
				if ($scope.item.tglPensiun != undefined) {
					tglPensiun = moment($scope.item.tglPensiun).format('YYYY-MM-DD HH:mm');
				}

				var NilaiJabatan = null
				if ($scope.item.nilaiJabatan != undefined) {
					NilaiJabatan = $scope.item.nilaiJabatan
				}

				var Grade = null
				var grade = parseFloat(Grade);
				if ($scope.item.grade != undefined) {
					Grade = parseFloat($scope.item.grade);
				}

				var bankRekeningNomor = "-"
				if ($scope.item.bankRekeningNomor != undefined) {
					bankRekeningNomor = $scope.item.bankRekeningNomor
				}

				var NamaRekening = "-"
				if ($scope.item.bankRekeningAtasNama != undefined) {
					NamaRekening = $scope.item.bankRekeningAtasNama
				}

				var NamaBank = "-"
				if ($scope.item.bankRekeningNama != undefined) {
					NamaBank = $scope.item.bankRekeningNama
				}
				var bankRekeningNomor2 = "-"
				if ($scope.item.bankRekeningNomor != undefined) {
					bankRekeningNomor2 = $scope.item.bankRekeningNomor2
				}

				var NamaRekening2 = "-"
				if ($scope.item.bankRekeningAtasNama2 != undefined) {
					NamaRekening2 = $scope.item.bankRekeningAtasNama2
				}

				var NamaBank2 = "-"
				if ($scope.item.bankRekeningNama2 != undefined) {
					NamaBank2 = $scope.item.bankRekeningNama2
				}

				

				var pensiun = null;
				if ($scope.item.pensiun != undefined) {
					var pensiun = $scope.item.pensiun
				}

				var tglMeninggal = null;
				if ($scope.item.tglMeninggal != undefined) {
					tglMeninggal = moment($scope.item.tglMeninggal).format('YYYY-MM-DD HH:mm');
				}

				var idFinger = null;
				if ($scope.item.idFinger != undefined) {
					idFinger = $scope.item.idFinger;
				}
				var jabatanhehe = null;
				if ($scope.item.jabatanhehe != undefined) {
					jabatanhehe = $scope.item.jabatanhehe.id;
				}
				$scope.item.masakerjatambahan = $scope.item.masakerjatambahantahun + "-" + $scope.item.masakerjatambahanbulan
				var isValid = ModelItem.setValidation($scope, listRawRequired);
				if (isValid.status) {

					// if ($scope.item.idPegawai == "" && $scope.itemLogin.kelompokUser == undefined) {
					// 	toastr.error('Kelompok User Tidak Boleh Kosong')
					// 	return;
					// }
					console.log($scope.item.kedudukan);
					dataPegawai = {
						// Data Pegawai
						id: id,
						nippns: nipPns,
						noidentitas: nik,
						nokarpeg: nokarpeg,
						taspen: taspen,
						nobpjs: nobpjs,
						email: email,
						aktakelahiran: aktakelahiran,
						jabatanhehe: jabatanhehe,
						namalengkap: $scope.item.namaLengkap,
						gelardepan: gelarDepan,
						gelarbelakang: gelarBelakang,
						nama: $scope.item.nama,
						tempatlahir: $scope.item.tempatLahir,
						tgllahir: $scope.item.tglLahir != undefined? moment($scope.item.tglLahir).format('YYYY-MM-DD 00:00:00'):null,
						jeniskelamin: $scope.item.jenisKelamin.id,
						pendidikan: $scope.item.pendidikan.id,
						//pendidikanpegawai: $scope.item.pendidikanpegawai.id,
						statusperkawinan: $scope.item.statusPerkawinanPegawai.id,
						noskmasakerjatambahan: $scope.item.noskmasakerjatambahan != undefined ?  $scope.item.noskmasakerjatambahan : null,
						tglskmasakerjatambahan: $scope.item.tglskmasakerjatambahan != undefined ? moment($scope.item.tglskmasakerjatambahan).format('YYYY-MM-DD HH:mm') : null,
						npwp: Npwp,
						agama: $scope.item.agama.id,
						tglmeninggal: tglMeninggal,
						unitkerjafk:$scope.item.unitKerja != undefined?$scope.item.unitKerja.id :null,
						// Data Pegawai

						// Data Rekening Bank
						nomorrekening: bankRekeningNomor,
						namarekening: NamaRekening,
						namabank: NamaBank,
						nomorrekening2: bankRekeningNomor2,
						namarekening2: NamaRekening2,
						namabank2: NamaBank2,
						// Data Rekening Bank

						// Data Alamat
						alamat: $scope.item.alamat != undefined ? $scope.item.alamat : '-',
						kodepos: $scope.item.kodePos,
						// Data Alamat



						// Data Status Pegawai
						tglmasuk: $scope.item.tglMasuk!= undefined? moment($scope.item.tglMasuk).format('YYYY-MM-DD 00:00:00'):null, //moment().format('YYYY-MM-DD 00:00'),
						tglkeluar: tglKeluar,
						pensiun: pensiun,
						tglpensiun: tglPensiun,
						statuspegawai: $scope.item.kategoryPegawai != undefined ? $scope.item.kategoryPegawai.id : null,
						kedudukan: $scope.item.kedudukan != undefined ? $scope.item.kedudukan.id : null,
						golongan: $scope.item.golonganPegawai != undefined ? $scope.item.golonganPegawai.id : null,
						jabatan: $scope.item.jabatanFungsional != undefined ? $scope.item.jabatanFungsional.id : null,
						kelompokjabatan: $scope.item.detailKelompokJabatan != undefined ? $scope.item.detailKelompokJabatan.id : null,
						eselon: $scope.item.eselon != undefined ? $scope.item.eselon.id : null,
						idfinger: idFinger,//$scope.item.idFinger,
						shiftkerja:  $scope.item.shiftKerja != undefined ? $scope.item.shiftKerja.id : null,
						nilaijabatan: NilaiJabatan,
						grade: Grade,
						jenispegawai: $scope.item.JenisPegawai.id,
						masakerjatambahan: $scope.item.masakerjatambahan != undefined ? $scope.item.masakerjatambahan : null
						// Data Status Pegawai
					}

					// var data ={};
					// $scope.itemTelp.push($scope.item.provider1);
					// $scope.itemTelp[0].nomor=$scope.item.nomor1;
					// $scope.itemTelp.push($scope.item.provider2);
					// $scope.itemTelp[1].nomor=$scope.item.nomor2;

					var dataTel1 = ''
					if ($scope.item.nomor1 != undefined && $scope.item.provider1 != undefined && $scope.item.norecTelp1 != undefined && $scope.item.norecTelp1 != "") {
						dataTel1 = {
							'norec': $scope.item.norecTelp1,
							'noTelp': $scope.item.nomor1 != undefined ? $scope.item.nomor1 : '', 
							'providerfk': null
						}
					} else {
						dataTel1 = {
							'norec': '',
							'noTelp': $scope.item.nomor1 != undefined ? $scope.item.nomor1 : '', 
							'providerfk': null
						}
					};

					var dataTel2 = ''
					if ($scope.item.nomor2 != undefined && $scope.item.provider2 != undefined && $scope.item.norecTelp2 != undefined && $scope.item.norecTelp2 != "") {
						dataTel2 = {
							'norec': $scope.item.norecTelp2,
							'noTelp': $scope.item.nomor2 != undefined ? $scope.item.nomor2 : '',//$scope.item.nomor2,
							'providerfk': null //$scope.item.provider2.id
						}
					} else {
						dataTel2 = {
							'norec': '',
							'noTelp': $scope.item.nomor2 != undefined ? $scope.item.nomor2 : '',
							'providerfk': null
						}
					};

					ClearDataTelp();
					if (dataTel1 != '')
						dataNoTelp.push(dataTel1)
					if (dataTel2 != '')
						dataNoTelp.push(dataTel2)

					//      	for (var i = 0; i < $scope.itemTelp.length; i++) {
					// 	data.nomor=$scope.itemTelp[i].nomor
					// 	data.providerfk=$scope.itemTelp[i].id

					// 	dataNoTelp[i]=data
					// }

					objSave = {
						datapegawai: dataPegawai,
						datakeluarga: dataKeluarga,
						riwayatpendidikan: dataRiwayatPendidikan,
						riwayatpelatihan: dataRiwayatPelatihan,
						riwayatjabatan: dataRiwayatJabatan,
						komponengajiadd: dataKomponenGajiAdd,
						komponengajidel: dataKomponenGajiDel,
						simpantelp: dataNoTelp,
						hukumandisiplin: dataHukumanDisiplin,
						pangkatgolongan: dataRiwayatPangkatGolongan,
						cuti: dataCuti,
						gajiberkala: dataRiwayatGajiBerkala,
					}

					// if (dataKeluarga.length == 0 || dataRiwayatPendidikan.length == 0 || dataRiwayatJabatan.length == 0 || dataSip.length == 0 || dataStr.length == 0 || dataRiwayatPelatihan.length == 0 || dataNoTelp.length==0) {
					if (dataKeluarga.length == 0 || dataRiwayatPendidikan.length == 0 || dataRiwayatJabatan.length == 0 || dataRiwayatPelatihan.length == 0 || dataNoTelp.length == 0) {
						if (dataKeluarga.length == 0) {
							var confirm = $mdDialog.confirm()
								.title('Peringatan')
								.textContent('Data Keluarga Kosong, Apakah Anda Yakin Tetap Menyimpan Data?')
								.ariaLabel('Lucky day')
								.cancel('Tidak')
								.ok('Ya')
							$mdDialog.show(confirm).then(function () {
								RealSave();
							});
						} else if (dataRiwayatPendidikan.length == 0) {
							var confirm = $mdDialog.confirm()
								.title('Peringatan')
								.textContent('Data Riwayat Pendidikan Kosong, Apakah Anda Yakin Tetap Menyimpan Data?')
								.ariaLabel('Lucky day')
								.cancel('Tidak')
								.ok('Ya')
							$mdDialog.show(confirm).then(function () {
								RealSave();
							});
						} else if (dataRiwayatPelatihan.length == 0) {
							var confirm = $mdDialog.confirm()
								.title('Peringatan')
								.textContent('Data Riwayat Pelatihan Kosong, Apakah Anda Yakin Tetap Menyimpan Data?')
								.ariaLabel('Lucky day')
								.cancel('Tidak')
								.ok('Ya')
							$mdDialog.show(confirm).then(function () {
								RealSave();
							});
						} else if (dataRiwayatJabatan.length == 0) {
							var confirm = $mdDialog.confirm()
								.title('Peringatan')
								.textContent('Data Riwayat Jabatan Kosong, Apakah Anda Yakin Tetap Menyimpan Data?')
								.ariaLabel('Lucky day')
								.cancel('Tidak')
								.ok('Ya')
							$mdDialog.show(confirm).then(function () {
								RealSave();
							});
							//    }else if (dataSip.length ==0) {
							//  			var confirm = $mdDialog.confirm()
							//         .title('Peringatan')
							//         .textContent('Data SIP Kosong, Apakah Anda Yakin Tetap Menyimpan Data?')
							//         .ariaLabel('Lucky day')
							//         .cancel('Tidak')
							//         .ok('Ya')
							//     $mdDialog.show(confirm).then(function () {
							//         RealSave();
							//     });	
							// }else if (dataStr.length ==0) {
							//  			var confirm = $mdDialog.confirm()
							//         .title('Peringatan')
							//         .textContent('Data STR Kosong, Apakah Anda Yakin Tetap Menyimpan Data?')
							//         .ariaLabel('Lucky day')
							//         .cancel('Tidak')
							//         .ok('Ya')
							//     $mdDialog.show(confirm).then(function () {
							//         RealSave();
							//     });	
						} else if (dataNoTelp.length == 0) {
							var confirm = $mdDialog.confirm()
								.title('Peringatan')
								.textContent('Data No Telpon Kosong, Apakah Anda Yakin Tetap Menyimpan Data?')
								.ariaLabel('Lucky day')
								.cancel('Tidak')
								.ok('Ya')
							$mdDialog.show(confirm).then(function () {
								RealSave();
							});
						}
					} else {
						var confirm = $mdDialog.confirm()
							.title('Peringatan')
							.textContent('Apakah Anda Yakin Menyimpan Data?')
							.ariaLabel('Lucky day')
							.cancel('Tidak')
							.ok('Ya')
						$mdDialog.show(confirm).then(function () {
							RealSave();
						});
					}
				} else {
					ModelItem.showMessages(isValid.messages);
				}
			}

			$scope.kembali = function () {
				$state.go('DataPegawai')
			}

			function saveLogin() {
				var waktuBerakhir = undefined;
				var idlogin = "";
				if ($scope.itemLogin.idlogin != undefined) {
					idlogin = $scope.itemLogin.idlogin;
				}

				var objSaveLogin = {
					'id': idlogin,
					'katasandi': $scope.itemLogin.kataKunciPass,
					'namauser': $scope.itemLogin.namaUser,
					'objectkelompokuserfk': $scope.itemLogin.kelompokUser.id,
					'objectpegawaifk': $scope.itemLogin.pegawaiId,
					'waktuberakhir': waktuBerakhir
				}

				medifirstService.post('sysadmin/menu/save-new-user', objSaveLogin).then(function (e) {

					ClearDataUserLogin();
					LoadCache();
					// FormLoad();

				}, function (error) {
					toastr.error(JSON.stringify(error.message), 'Error')
				});
			}

			function RealSave() {
				medifirstService.post('sdm/save-rekam-data-pegawai', objSave).then(function (e) {
					var dataHasilSave = e.data
					if ($scope.item.idPegawai == undefined || $scope.item.idPegawai == "") {
						$scope.itemLogin.pegawaiId = dataHasilSave.idpegawai;
						// saveLogin();
					}
					ClearAll();
					LoadCache();
					// FormLoad();
				});
			}

			$scope.batal = function () {
				$scope.showEdit = false;
				$scope.item = {};
			}

			$scope.simpanSipNew = function () {
				// if ($scope.item.idPegawai == "" || $scope.item.idPegawai == undefined) {
				// 	toastr.error('Id Tidak Boleh Kosong')
				// 	return;
				// }
				if ($scope.itemSip.noSip == "" || $scope.itemSip.noSip == undefined) {
					toastr.error('Nomor Sip Tidak Boleh Kosong')
					return;
				}
				if ($scope.itemSip.tglSipAkhir == "" || $scope.itemSip.tglSipAkhir == undefined) {
					toastr.error('Tanggal Berakhir SIP Tidak Boleh Kosong')
					return;
				}

				var nR = ""
				if ($scope.itemSip.norec != undefined) {
					nR = $scope.itemSip.norec
				}

				var tglSipAkhir = moment($scope.itemSip.tglSipAkhir).format('YYYY-MM-DD 00:00')

				var objSave = {
					"norec": nR,
					"idPegawai": $scope.item.idPegawai,
					"nomorSurat": $scope.itemSip.noSip,
					"tglBerakhir": tglSipAkhir,
					"jenismasaberlakufk": 1,
				}

				const url = baseTransaksi + 'sdm/upload-data-sipstr'
				const formData = new FormData()
				const file = document.querySelector(".mySip").files[0]
				if (file == "" || file == undefined) {
					toastr.error('Silahkan Upload File SIP')
					return;
				}
				if (file.size > 3145728 || file.type != "application/pdf") {
					toastr.error('Maksumum Ukuran File adalah 3 MB dalam Format PDF')
					return;
				}
				formData.append('file', file)
				formData.append('norec', objSave.norec)
				formData.append('idPegawai', objSave.idPegawai)
				formData.append('nomorSurat', objSave.nomorSurat)
				formData.append('tglBerakhir', objSave.tglBerakhir)
				formData.append('jenismasaberlakufk', objSave.jenismasaberlakufk)
				var arr = document.cookie.split(';')
                var authorization;
                for (var i = 0; i < arr.length; i++) {
                    var element = arr[i].split('=');
                    if (element[0].indexOf('authorization') > 0) {
                        authorization = element[1];
                    }
                }
                fetch(url, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-AUTH-TOKEN': authorization
                    }
				}).then(response => {
					toastr.info("Simpan Sip berhasil");
					$scope.loadDataSip();
					$scope.batalSip();
				})

			}

			$scope.simpanStrNew = function () {
				// if ($scope.item.idPegawai == "" || $scope.item.idPegawai == undefined) {
				// 	toastr.error('Id Tidak Boleh Kosong')
				// 	return;
				// }
				if ($scope.itemStr.noStr == "" || $scope.itemStr.noStr == undefined) {
					toastr.error('Nomor STR Tidak Boleh Kosong')
					return;
				}
				if ($scope.itemStr.tglStrAkhir == "" || $scope.itemStr.tglStrAkhir == undefined) {
					toastr.error('Tanggal Berakhir STR Tidak Boleh Kosong')
					return;
				}

				var nR = ""
				if ($scope.itemStr.norec != undefined) {
					nR = $scope.itemStr.norec
				}

				var tglStrAkhir = moment($scope.itemStr.tglStrAkhir).format('YYYY-MM-DD 00:00')

				var objSave = {
					"norec": nR,
					"idPegawai": $scope.item.idPegawai,
					"nomorSurat": $scope.itemStr.noStr,
					"tglBerakhir": tglStrAkhir,
					"jenismasaberlakufk": 2,
				}

				const url = baseTransaksi + 'sdm/upload-data-sipstr'
				const formData = new FormData()
				const file = document.querySelector(".myStr").files[0]
				if (file == "" || file == undefined) {
					toastr.error('Silahkan Upload File STR')
					return;
				}
				if (file.size > 3145728 || file.type != "application/pdf") {
					toastr.error('Maksumum Ukuran File adalah 3 MB dalam Format PDF')
					return;
				}
				formData.append('file', file)
				formData.append('norec', objSave.norec)
				formData.append('idPegawai', objSave.idPegawai)
				formData.append('nomorSurat', objSave.nomorSurat)
				formData.append('tglBerakhir', objSave.tglBerakhir)
				formData.append('jenismasaberlakufk', objSave.jenismasaberlakufk)
				var arr = document.cookie.split(';')
                var authorization;
                for (var i = 0; i < arr.length; i++) {
                    var element = arr[i].split('=');
                    if (element[0].indexOf('authorization') > 0) {
                        authorization = element[1];
                    }
                }
                fetch(url, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-AUTH-TOKEN': authorization
                    }
				}).then(response => {
					toastr.info("Simpan Str berhasil");
					$scope.loadDataStr();
					$scope.batalStr();
				})

			}

			$scope.loadDataSip = function () {
				medifirstService.get("sdm/get-data-sip").then(function (res) {
					var datas = res.data.data;
					for (var i = 0; i < datas.length; i++) {
						datas[i].no = i + 1;
					}
					$scope.gridSip = new kendo.data.DataSource({
						data: datas
					});
				}, (err) => {

				});
			}
			$scope.loadDataStr = function () {
				medifirstService.get("sdm/get-data-str").then(function (res) {
					var datas = res.data.data;
					for (var i = 0; i < datas.length; i++) {
						datas[i].no = i + 1;
					}
					$scope.gridStr = new kendo.data.DataSource({
						data: datas
					});
				}, (err) => {

				});
			}


			function HapusSipNew(e) {
				e.preventDefault();
				var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

				if (!dataItem) {
					toastr.error("Data Tidak Ditemukan");
					return;
				}

				var itemDelete = {
					"norec": dataItem.norec,
					"namafile": dataItem.namafileupload,
				}

				medifirstService.post('sdm/delete-data-sipstr', itemDelete).then(function (e) {
					if (e.status === 201) {
						$scope.loadDataSip();
					}
				})
			}

			function HapusStrNew(e) {
				e.preventDefault();
				var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

				if (!dataItem) {
					toastr.error("Data Tidak Ditemukan");
					return;
				}

				var itemDelete = {
					"norec": dataItem.norec,
					"namafile": dataItem.namafileupload,
				}

				medifirstService.post('sdm/delete-data-sipstr', itemDelete).then(function (e) {
					if (e.status === 201) {
						$scope.loadDataStr();
					}
				})
			}

			function downloadSipStr(e) {
				e.preventDefault();
				var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

				if (!dataItem) {
					toastr.error("Data Tidak Ditemukan");
					return;
				}

				medifirstService.get('sdm/download-data-sipstr?' + "namaFile=" + dataItem.namafileupload).then(function (data) {
					window.open(baseTransaksi + 'sdm/download-data-sipstr?' + "namaFile=" + dataItem.namafileupload);
					// var url=baseTransaksi+data;
					// downloadURI(url);
				})
			}

			$scope.$watch('item.tglMasuk', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    if ($scope.item.tglkeluar !=  undefined) {
						let masaKerja = dateHelper.CountAge(new Date($scope.item.tglMasuk), new Date($scope.item.tglkeluar));
						$scope.item.MasaKerja = masaKerja.year + ' th, ' + masaKerja.month + ' bln, ' + masaKerja.day + ' hr'
                    }else if ($scope.item.tglPensiun !=  undefined) {
						let masaKerja = dateHelper.CountAge(new Date($scope.item.tglMasuk), new Date($scope.item.tglPensiun));
						$scope.item.MasaKerja = masaKerja.year + ' th, ' + masaKerja.month + ' bln, ' + masaKerja.day + ' hr'
					}else{
						let masaKerja = dateHelper.CountAge(new Date($scope.item.tglMasuk), new Date());
						$scope.item.MasaKerja = masaKerja.year + ' th, ' + masaKerja.month + ' bln, ' + masaKerja.day + ' hr'
					}
                }
			});
			
			$scope.$watch('item.tglkeluar', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    if ($scope.item.tglkeluar !=  undefined) {
						let masaKerja = dateHelper.CountAge(new Date($scope.item.tglMasuk), new Date($scope.item.tglkeluar));
						$scope.item.MasaKerja = masaKerja.year + ' th, ' + masaKerja.month + ' bln, ' + masaKerja.day + ' hr'
                    }else if ($scope.item.tglPensiun !=  undefined) {
						let masaKerja = dateHelper.CountAge(new Date($scope.item.tglMasuk), new Date($scope.item.tglPensiun));
						$scope.item.MasaKerja = masaKerja.year + ' th, ' + masaKerja.month + ' bln, ' + masaKerja.day + ' hr'
					}else{
						let masaKerja = dateHelper.CountAge(new Date($scope.item.tglMasuk), new Date());
						$scope.item.MasaKerja = masaKerja.year + ' th, ' + masaKerja.month + ' bln, ' + masaKerja.day + ' hr'
					}
                }
			});
			
			$scope.$watch('item.tglPensiun', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    if ($scope.item.tglkeluar !=  undefined) {
						let masaKerja = dateHelper.CountAge(new Date($scope.item.tglMasuk), new Date($scope.item.tglkeluar));
						$scope.item.MasaKerja = masaKerja.year + ' th, ' + masaKerja.month + ' bln, ' + masaKerja.day + ' hr'
                    }else if ($scope.item.tglPensiun !=  undefined) {
						let masaKerja = dateHelper.CountAge(new Date($scope.item.tglMasuk), new Date($scope.item.tglPensiun));
						$scope.item.MasaKerja = masaKerja.year + ' th, ' + masaKerja.month + ' bln, ' + masaKerja.day + ' hr'
					}else{
						let masaKerja = dateHelper.CountAge(new Date($scope.item.tglMasuk), new Date());
						$scope.item.MasaKerja = masaKerja.year + ' th, ' + masaKerja.month + ' bln, ' + masaKerja.day + ' hr'
					}
                }
			});
			
			$scope.getDataGolongan = function () {
				var nominal = 0;
				var pindah = 0;
				var golongan = "";
				if($scope.itemGajiBerkala.tanggaltmt == undefined){
					return
				}
				medifirstService.get('sdm/get-thn-bln?tglcpns=' + moment($scope.item.tmtskcpns).format('YYYY-MM-DD') + '&tgltmt=' + moment($scope.itemGajiBerkala.tanggaltmt).format('YYYY-MM-DD')).then(function (data) {
					var thn = data.data[0].thn,
						bln = data.data[0].bln
					console.log(bln, thn);
					// console.log(umur);
					// dataRiwayatPangkatGolongan.length
					if ($scope.item.golongancpns != undefined) {
						if ($scope.item.golongancpns.level < $scope.itemGajiBerkala.golongan.level) {
							if ($scope.itemGajiBerkala.golongan.level == 2) {
								pindah += 6
							}
							if ($scope.itemGajiBerkala.golongan.level == 3) {
								pindah += 5
							}
						}
						nominal = thn - pindah;
						if($scope.itemGajiBerkala.suratkeputusanBaru == undefined){
							toastr.error('Pilih Surat Keputusan Terlebih Dahulu!')
							return
						}
						medifirstService.get('nominal/get-nominal?golongan=' + $scope.itemGajiBerkala.golongan.id + '&mkg=' + nominal + '&pegawai=' + $scope.item.idPegawai + '&sk='+ $scope.itemGajiBerkala.suratkeputusanBaru.id).then(function (data) {
							$scope.itemGajiBerkala.tahunmasakerjagolongan = nominal
							$scope.itemGajiBerkala.bulanmasakerjagolongan = bln
							$scope.itemGajiBerkala.masakerjagolongan = $scope.itemGajiBerkala.tahunmasakerjagolongan + " tahun " + $scope.itemGajiBerkala.bulanmasakerjagolongan + " bulan "
							$scope.itemGajiBerkala.gajiakhir = data.data.gajigolongan[0].gajipokok
							// $scope.itemGajiBerkala.gajiawal = data.data.gajiawal[0].nominal
							nominal = 0

							// console.log("Golongan ID:", $scope.itemGajiBerkala.golongan.id);
							// console.log("MKG (nominal):", nominal);
							// console.log("Pegawai ID:", $scope.item.idPegawai);
							// console.log("SK ID:", $scope.itemGajiBerkala.suratkeputusanBaru.id);

						})
					}
				})
				// var umur = dateHelper.CountAge(new Date($scope.item.tmtskcpns), new Date($scope.itemGajiBerkala.tanggaltmt));
				// var mkgnya = umur.year
				// if ($scope.item.golongancpns.level < $scope.itemPandG.golongan.level) {
				// 	if ($scope.itemPandG.golongan.level == 2) {
				// 		pindah += 6
				// 	}
				// 	if ($scope.itemPandG.golongan.level == 3 || $scope.itemPandG.golongan.level == 4) {
				// 		pindah += 5
				// 	}
				// }
				// medifirstService.get('nominal/get-nominal?golongan=' + $scope.itemGajiBerkala.golongan.id + '&mkg=' + mkgnya + '&pegawai='+ $scope.item.idPegawai).then(function (data) {
				// 	$scope.itemGajiBerkala.gajiakhir = data.data.gajigolongan[0].gajipokok
				// 	$scope.itemGajiBerkala.gajiawal = data.data.gajiawal[0].nominal
				// })
				
			}

			$scope.getDataGolonganKGB = function () {
				var nominal = 0;
				var golongan = "";
			
				
				if ($scope.itemGajiBerkala.masakerjagolongan == undefined) {
					toastr.error('Masukkan Masa Kerja Golongan Terlebih Dahulu!');
					return;
				}
			
				
				var masaKerja = $scope.itemGajiBerkala.masakerjagolongan.split(' ');
				var tahun = parseInt(masaKerja[0]);
				var bulan = parseInt(masaKerja[2]);
			
				
				if ($scope.itemGajiBerkala.suratkeputusanBaru == undefined) {
					toastr.error('Pilih Surat Keputusan Terlebih Dahulu!');
					return;
				}
			
				
				medifirstService.get('nominal/get-nominal?golongan=' + $scope.itemGajiBerkala.golongan.id + '&mkg=' + tahun + '&pegawai=' + $scope.item.idPegawai + '&sk=' + $scope.itemGajiBerkala.suratkeputusanBaru.id).then(function (data) {
					$scope.itemGajiBerkala.tahunmasakerjagolongan = tahun;
					$scope.itemGajiBerkala.bulanmasakerjagolongan = bulan;
					$scope.itemGajiBerkala.masakerjagolongan = $scope.itemGajiBerkala.tahunmasakerjagolongan + " tahun " + $scope.itemGajiBerkala.bulanmasakerjagolongan + " bulan ";
					$scope.itemGajiBerkala.gajiakhir = data.data.gajigolongan[0].gajipokok;
				});
			}

			let debounceTimeout;
			$scope.$watch('itemGajiBerkala.masakerjagolongan', function (newVal, oldVal) {
				if (newVal === oldVal) return;

				clearTimeout(debounceTimeout);

				debounceTimeout = setTimeout(() => {
					console.log("Watching masakerjagolongan - New Value:", newVal, "Old Value:", oldVal);

					if (!$scope.itemGajiBerkala.masakerjagolongan) {
						toastr.error('Masukkan Masa Kerja Golongan Terlebih Dahulu!');
						return;
					}

					if (!$scope.itemGajiBerkala.suratkeputusanBaru) {
						toastr.error('Pilih Surat Keputusan Terlebih Dahulu!');
						return;
					}

					const [tahun, , bulan] = $scope.itemGajiBerkala.masakerjagolongan.split(' ').map(Number);
					if (isNaN(tahun) || isNaN(bulan)) {
						toastr.error('Format Masa Kerja Golongan tidak valid!');
						return;
					}

					const { golongan, suratkeputusanBaru } = $scope.itemGajiBerkala;
					const { idPegawai } = $scope.item;

					medifirstService.get(`nominal/get-nominal?golongan=${golongan.id}&mkg=${tahun}&pegawai=${idPegawai}&sk=${suratkeputusanBaru.id}`)
						.then(function (response) {
							const gajiData = response.data.gajigolongan[0];
							if (!gajiData) {
								toastr.error('Data gaji tidak ditemukan!');
								$scope.itemGajiBerkala.gajiakhir = 0;	
								return;
							}

							$scope.itemGajiBerkala.tahunmasakerjagolongan = tahun;
							$scope.itemGajiBerkala.bulanmasakerjagolongan = bulan;
							$scope.itemGajiBerkala	.masakerjagolongan = `${tahun} tahun ${bulan} bulan`;
							$scope.itemGajiBerkala.gajiakhir = gajiData.gajipokok;
						})
						.catch(function (error) {
							toastr.error('Gagal mengambil data gaji.');
							console.error(error);
						});
				}, 900); 
			});

			function cetakGajiBerkala(e){
				
				e.preventDefault();
				var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
				if (dataItem == undefined) {
					toastr.error("Data Belum Dipilih!")
					return;
				}

				if ($scope.item.kategoryPegawai != undefined && $scope.item.kategoryPegawai.id == 1){
					window.open(configuration.baseApiBackend + 'report/get-cetak-suratkgb?norec=' + dataItem.norec+ '&rgb=oke', '_blank');
				}
				else if($scope.item.kategoryPegawai != undefined && $scope.item.kategoryPegawai.id == 14){
					window.open(configuration.baseApiBackend + 'report/get-cetak-suratkgb?norec=' + dataItem.norec+ '&rgb=oke', '_blank');
				}
				else if($scope.item.kategoryPegawai != undefined && $scope.item.kategoryPegawai.id == 23){
					window.open(configuration.baseApiBackend + 'report/get-cetak-suratkgbPPPK?norec=' + dataItem.norec+ '&rgb=oke', '_blank');
				}
				else {
					window.open(configuration.baseApiBackend + 'report/get-cetak-suratkgbLainnya?norec=' + dataItem.norec+ '&rgb=oke', '_blank');
				}
				// console.log($scope.dataSelected); report/get-cetak-suratkgb
				// window.open(configuration.baseApiBackend + dataItem.reportdisplay +'?norec=' + dataItem.norec+ '&rgb=oke', '_blank');
			}
			$scope.simpanCPNS = function(){
				var listRawRequired = [
					"item.noskcpns|ng-model|NO. SK CPNS",
				];
				var isValid = ModelItem.setValidation($scope, listRawRequired);
				if (isValid.status) {
					var data = {
						id: $scope.item.idPegawai,
						noskcpns: $scope.item.noskcpns != undefined ? $scope.item.noskcpns : null,
						tglskcpns: $scope.item.tglskcpns !=undefined ? moment($scope.item.tglskcpns).format('YYYY-MM-DD') : null,
						tmtskcpns: $scope.item.tmtskcpns != undefined ? moment($scope.item.tmtskcpns).format('YYYY-MM-DD') : null,
						objectgolongancpnsfk: $scope.item.golongancpns != undefined ? $scope.item.golongancpns.id : null,
						masakerjacpns: ($scope.item.tahuncpns != undefined ? $scope.item.tahuncpns : null) + '-' + ($scope.item.bulancpns != undefined ? $scope.item.bulancpns : null),
						pendidikancpns: $scope.item.pendidikancpns != undefined ? $scope.item.pendidikancpns.id : null,
						prodicpns: $scope.item.prodicpns != undefined ? $scope.item.prodicpns : null,
						tglijazahcpns: moment($scope.item.tglijazahcpns).format('YYYY-MM-DD'),
						noijazahcpns: $scope.item.noijazahcpns != undefined ? $scope.item.noijazahcpns : null,
						jabatancpns: $scope.item.jabatancpns != undefined ? $scope.item.jabatancpns : null,
						unitkerjacpns: $scope.item.unitkerjacpns != undefined ? $scope.item.unitkerjacpns : null,
						instansicpns: $scope.item.instansicpns != undefined ? $scope.item.instansicpns : null,
						pejabatpenandatangancpns: $scope.item.pejabatpenandatangancpns != undefined ? $scope.item.pejabatpenandatangancpns : null,
						pejabatyangmenetapkancpns: $scope.item.pejabatyangmenetapkancpns != undefined ? $scope.item.pejabatyangmenetapkancpns : null
					}
					console.log(data);
					var objSave = {
						data: data
					}
					medifirstService.post('sdm/save-data-cpns', objSave).then(function (data) {
						init();
					})
				} else {
					ModelItem.showMessages(isValid.messages);
				}
			}
			$scope.panggoltmt = function(){
				var nominal = 0;
				var pindah = 0;
				var golongan = "";
				// var umur = dateHelper.CountAge(new Date($scope.item.tmtskcpns), new Date($scope.itemPandG.tanggaltmt));
				// var bln = umur.month,
				// 	thn = umur.year
					medifirstService.get('sdm/get-thn-bln?tglcpns=' + moment($scope.item.tmtskcpns).format('YYYY-MM-DD') + '&tgltmt=' + moment($scope.itemPandG.tanggaltmt).format('YYYY-MM-DD')).then(function (data) {
						var thn = data.data[0].thn,
							bln = data.data[0].bln
							console.log(bln, thn);
							// console.log(umur);
							// dataRiwayatPangkatGolongan.length
							console.log($scope.item.golongancpns.level , $scope.itemPandG.golongan.level);
							if ($scope.item.golongancpns.level < $scope.itemPandG.golongan.level) {
								if ($scope.itemPandG.golongan.level == 2) {
									pindah += 6
								}
								if ($scope.itemPandG.golongan.level == 3 || $scope.itemPandG.golongan.level == 4) {
									pindah += 5
								}
							}
							nominal = thn - pindah;
							console.log(nominal);
							medifirstService.get('nominal/get-nominal?golongan=' + $scope.itemPandG.golongan.id + '&mkg=' + nominal).then(function (data) {
								$scope.itemPandG.tahunmasakerjagolongan = nominal
								$scope.itemPandG.bulanmasakerjagolongan = bln
								$scope.itemPandG.masakerjagolongan = $scope.itemPandG.tahunmasakerjagolongan + " tahun " + $scope.itemPandG.bulanmasakerjagolongan + " bulan "
								console.log($scope.itemPandG.masakerjagolongan);
								$scope.itemPandG.nominal = data.data.gajigolongan[0].gajipokok
								nominal = 0
							})
					})
					// if (dataRiwayatPangkatGolongan.length < 1){
					// 	nominal = thn - pindah;
					// 	medifirstService.get('nominal/get-nominal?golongan=' + $scope.itemPandG.golongan.id + '&mkg=' + nominal).then(function (data) {
					// 		$scope.itemPandG.tahunmasakerjagolongan = nominal
					// 		$scope.itemPandG.bulanmasakerjagolongan = bln
					// 		$scope.itemPandG.masakerjagolongan = $scope.itemPandG.tahunmasakerjagolongan + " tahun " + $scope.itemPandG.bulanmasakerjagolongan + " bulan "
					// 		$scope.itemPandG.nominal = data.data.gajigolongan[0].gajipokok
					// 		nominal = 0
					// 	})
					// } else{
					// 	nominal = thn - pindah;
					// 	medifirstService.get('nominal/get-nominal?golongan=' + $scope.itemPandG.golongan.id + '&mkg=' + nominal).then(function (data) {
					// 		$scope.itemPandG.tahunmasakerjagolongan = nominal
					// 		$scope.itemPandG.bulanmasakerjagolongan = bln
					// 		$scope.itemPandG.masakerjagolongan = $scope.itemPandG.tahunmasakerjagolongan + " tahun " + $scope.itemPandG.bulanmasakerjagolongan + " bulan "
					// 		$scope.itemPandG.nominal = data.data.gajigolongan[0].gajipokok
					// 		nominal = 0
					// 	})
					// 	console.log('> 0');
					// }
					
			}

			//jabatan pelaksanan
			$scope.opsiGridRiwayatJabatanPelaksana = {
				toolbar: [{
					name: "create",
					text: "Buat Jabatan Pelaksana",
					template: '<button ng-click="createJabatanNew(7)" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Buat Riwayat Jabatan</button>'
				}],
				sortable: false,
				reorderable: true,
				filterable: false,
				pageable: true,
				columnMenu: false,
				resizable: true,
				selectable: 'row',
				columns: [{
						"field": "nopelaksana",
						"title": "No",
						"width": "5%"
					},
					{
						"field": "namajabatan",
						"title": "Jabatan",
						"width": "20%"
					},
					{
						"field": "tmtjabatan",
						"title": "TMT Jabatan",
						"width": "20%",
						"template": "<span class='style-left'>{{formatTanggal('#: tmtjabatan #')}}</span>"
					},
					{
						"field": "nosk",
						"title": "Nomor SK",
						"width": "20%"
					},
					{
						"field": "instansi",
						"title": "Instansi",
						"width": "20%"
					},
					// {
					// 	// "field": "pegawaipenanggungjawab",
					// 	"title": "Penanda Tangan SK",
					// 	"width": "20%",
					// 	"template": "#: ttdsk # / #: ttdjabatansk #"
					// },
					{
						"command": [{
								text: "Edit",
								click: EditJabatan,
								imageClass: "k-icon k-i-pencil"
							},
							{
								text: "Hapus",
								click: HapusJabatan,
								imageClass: "k-icon k-i-delete"
							},
						],
						title: "",
						width: "185px",
					}
				]
			}
			//end jabatan pelaksana
			
			//jabatan fungsional
			$scope.opsiGridRiwayatJabatanFungsional = {
				toolbar: [{
					name: "create",
					text: "Buat Jabatan Pelaksana",
					template: '<button ng-click="createJabatanNew(6)" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Buat Riwayat Jabatan</button>'
				}],
				sortable: false,
				reorderable: true,
				filterable: false,
				pageable: true,
				columnMenu: false,
				resizable: true,
				selectable: 'row',
				columns: [{
						"field": "nofungsional",
						"title": "No",
						"width": "5%"
					},
					{
						"field": "namajabatan",
						"title": "Jabatan",
						"width": "20%"
					},
					{
						"field": "tmtjabatan",
						"title": "TMT Jabatan",
						"width": "20%",
						"template": "<span class='style-left'>{{formatTanggal('#: tmtjabatan #')}}</span>"
					},
					{
						"field": "nosk",
						"title": "Nomor SK",
						"width": "20%"
					},
					{
						"field": "instansi",
						"title": "Instansi",
						"width": "20%"
					},
					// {
					// 	// "field": "pegawaipenanggungjawab",
					// 	"title": "Penanda Tangan SK",
					// 	"width": "20%",
					// 	"template": "#: ttdsk # / #: ttdjabatansk #"
					// },
					{
						"command": [{
								text: "Edit",
								click: EditJabatan,
								imageClass: "k-icon k-i-pencil"
							},
							{
								text: "Hapus",
								click: HapusJabatan,
								imageClass: "k-icon k-i-delete"
							},
						],
						title: "",
						width: "185px",
					}
				]
			}
			//end jabatan fungsional

			//jabatan struktural
			$scope.opsiGridRiwayatJabatanStruktural = {
				toolbar: [{
					name: "create",
					text: "Buat Jabatan Struktural",
					template: '<button ng-click="createJabatanNew(8)" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Buat Riwayat Jabatan</button>'
				}],
				sortable: false,
				reorderable: true,
				filterable: false,
				pageable: true,
				columnMenu: false,
				resizable: true,
				selectable: 'row',
				columns: [{
						"field": "nostruktural",
						"title": "No",
						"width": "5%"
					},
					{
						"field": "namajabatan",
						"title": "Jabatan",
						"width": "20%"
					},
					{
						"field": "tmtjabatan",
						"title": "TMT Jabatan",
						"width": "20%",
						"template": "<span class='style-left'>{{formatTanggal('#: tmtjabatan #')}}</span>"
					},
					{
						"field": "nosk",
						"title": "Nomor SK",
						"width": "20%"
					},
					{
						"field": "namaeselon",
						"title": "Eselon",
						"width": "20%"
					},
					{
						"field": "instansi",
						"title": "Instansi",
						"width": "20%"
					},
					// {
					// 	// "field": "pegawaipenanggungjawab",
					// 	"title": "Penanda Tangan SK",
					// 	"width": "20%",
					// 	"template": "#: ttdsk # / #: ttdjabatansk #"
					// },
					{
						"command": [{
								text: "Edit",
								click: EditJabatan,
								imageClass: "k-icon k-i-pencil"
							},
							{
								text: "Hapus",
								click: HapusJabatan,
								imageClass: "k-icon k-i-delete"
							},
						],
						title: "",
						width: "185px",
					}
				]
			}
			//end jabatan struktural

			//data keluarga istri suami
			$scope.opsiGridIstriSuami = {
				toolbar: [
					{
						name: "create",
						text: "Buat Data Keluarga",
						template: '<button ng-click="createIstriSuamiNew()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Buat Data Keluarga</button>'
					}
				],
				sortable: false,
				reorderable: true,
				filterable: false,
				pageable: true,
				columnMenu: false,
				resizable: true,
				selectable: 'row',
				columns: [{
						"field": "nopasutri",
						"title": "No",
						"width": "5%"
					},
					{
						"field": "namalengkap",
						"title": "Nama Istri/Suami",
						"width": "20%"
					},
					{
						"field": "tgllahir",
						"title": "Tgl Lahir",
						"width": "20%",
						"template": "<span class='style-left'>{{formatTanggal('#: tgllahir #')}}</span>"

					},
					{
						"field": "tglnikah",
						"title": "Tgl Perkawinan",
						"width": "20%",
						"template": "<span class='style-left'>{{formatTanggal('#: tglnikah #')}}</span>"

					},
					{
						"field": "pekerjaan",
						"title": "Pekerjaan",
						"width": "20%",
						"template": "<span class='style-left'>{{formatTanggal('#: tgllahir #')}}</span>"
					},
					{
						"field": "hubungankeluarga",
						"title": "Status",
						"width": "20%"
					},
					{
						"field": "kariskarsu",
						"title": "Karis/Karsu",
						"width": "20%"
					},
					{
						"command": [{
								text: "Edit",
								click: Edit,
								imageClass: "k-icon k-i-pencil"
							},
							{
								text: "Hapus",
								click: Hapus,
								imageClass: "k-icon k-i-delete"
							},
						],
						title: "",
						width: "185px",
					}
				]
			}
			$scope.createIstriSuamiNew = function () {
				$scope.datakeluarga = 'issuamiistri'
				$scope.item.id = "";
				$scope.item.no = undefined;
				$scope.ListHubunganKeluarga = [
					{
						id: 2,
						hubungankeluarga: 'Istri'
					}, 
					{
						id: 5,
						hubungankeluarga: 'Suami'
					}
				]
				$scope.popUpDataKeluargaSuamiIstri.center().open()
				var actions = $scope.popUpDataKeluargaSuamiIstri.options.actions;
				actions.splice(actions.indexOf("Close"), 1);
				$scope.popUpDataKeluargaSuamiIstri.setOptions({ actions: actions });
			}
			//end suami istri
			//data keluarga anak
			$scope.opsiGridAnak = {
				toolbar: [

					{
						name: "create",
						text: "Buat Data Keluarga",
						template: '<button ng-click="createAnakNew()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Buat Data Keluarga</button>'
					}
				],
				sortable: false,
				reorderable: true,
				filterable: false,
				pageable: true,
				columnMenu: false,
				resizable: true,
				selectable: 'row',
				columns: [{
						"field": "noanak",
						"title": "No",
						"width": "5%"
					},
					{
						"field": "namalengkap",
						"title": "Nama Anak",
						"width": "20%"
					},
					{
						"field": "hubungankeluarga",
						"title": "Tgl Lahir",
						"width": "20%"
					},
					{
						"field": "hubungankeluarga",
						"title": "Status",
						"width": "20%"
					},
					{
						"field": "statustanggungan",
						"title": "Tertanggung",
						"width": "20%"
					},
					{
						"field": "tgllahir",
						"title": "Pekerjaan",
						"width": "20%",
						"template": "<span class='style-left'>{{formatTanggal('#: tgllahir #')}}</span>"
					},
					{
						"command": [{
								text: "Edit",
								click: Edit,
								imageClass: "k-icon k-i-pencil"
							},
							{
								text: "Hapus",
								click: Hapus,
								imageClass: "k-icon k-i-delete"
							},
						],
						title: "",
						width: "185px",
					}
				]
			}
			$scope.createAnakNew = function(){
				$scope.datakeluarga= 'isanak';
				$scope.item.id = "";
				$scope.item.no = undefined;
				$scope.ListHubunganKeluarga = [
					{
						id: 3,
						hubungankeluarga: 'Anak Kandung'
					},
					{
						id: 8,
						hubungankeluarga: 'Anak Tiri'
					},
					{
						id: 9,
						hubungankeluarga: 'Anak Angkat'
					}
				]
				$scope.popUpDataKeluargaAnak.center().open()
				var actions = $scope.popUpDataKeluargaAnak.options.actions;
				actions.splice(actions.indexOf("Close"), 1);
				$scope.popUpDataKeluargaAnak.setOptions({
					actions: actions
				});
			}
			//end data keluagra anak

			//orang tua
			$scope.opsiGridOrangTua = {
				toolbar: [
					{
						name: "create",
						text: "Buat Data Keluarga",
						template: '<button ng-click="createOrangTuaNew()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Buat Data Keluarga</button>'
					}
				],
				sortable: false,
				reorderable: true,
				filterable: false,
				pageable: true,
				columnMenu: false,
				resizable: true,
				selectable: 'row',
				columns: [{
						"field": "noortu",
						"title": "No",
						"width": "5%"
					},
					{
						"field": "namalengkap",
						"title": "Nama Bapak/Ibu",
						"width": "20%"
					},
					{
						"field": "hubungankeluarga",
						"title": "Tgl Lahir",
						"width": "20%"
					},
					{
						"field": "hubungankeluarga",
						"title": "Status",
						"width": "20%"
					},
					{
						"field": "tgllahir",
						"title": "Pekerjaan",
						"width": "20%",
						"template": "<span class='style-left'>{{formatTanggal('#: tgllahir #')}}</span>"
					},
					{
						"command": [{
								text: "Edit",
								click: Edit,
								imageClass: "k-icon k-i-pencil"
							},
							{
								text: "Hapus",
								click: Hapus,
								imageClass: "k-icon k-i-delete"
							},
						],
						title: "",
						width: "185px",
					}
				]
			}
			$scope.createOrangTuaNew = function () {
				$scope.item.id = "";
				$scope.item.no = undefined;
				$scope.ListHubunganKeluarga = [{
						id: 1,
						hubungankeluarga: 'Ayah'
					},
					{
						id: 6,
						hubungankeluarga: 'Ibu'
					}
				]
				$scope.popUpDataKeluargaOrangTua.center().open()
				var actions = $scope.popUpDataKeluargaOrangTua.options.actions;
				actions.splice(actions.indexOf("Close"), 1);
				$scope.popUpDataKeluargaOrangTua.setOptions({
					actions: actions
				});
			}
			//end orang tua
			$scope.$watch('gajilamanya', function (newValue, oldValue) {
				if (newValue != oldValue) {
					$scope.itemGajiBerkala = {}
					if ($scope.gajilamanya == undefined) {
						return;
					}
					medifirstService.get('sdm/get-gaji-pokok-lama?gaji=' + $scope.gajilamanya + '&idpegawai=' + $scope.item.idPegawai).then(function (data) {
						var datas = data.data.data[0]
						// $scope.itemGajiBerkala.jenissk = $scope.gajilamanya
						if ($scope.gajilamanya == 'KP') {
							$scope.itemGajiBerkala.gajiawal = datas.nominal;
							$scope.itemGajiBerkala.tanggalsk = new Date(moment(datas.tglsk).format('YYYY-MM-DD'));
							$scope.itemGajiBerkala.noskcetak = datas.nosk;
							$scope.itemGajiBerkala.tanggaltmtcetak = new Date(moment(datas.tgltmt).format('YYYY-MM-DD'));
							$scope.itemGajiBerkala.masakerjagolonganlama = datas.masakerjagolongan;
						} else {
							$scope.itemGajiBerkala.gajiawal = datas.gajiakhir;
							$scope.itemGajiBerkala.tanggalsk = new Date(moment(datas.tglskbaru).format('YYYY-MM-DD'));
							$scope.itemGajiBerkala.noskcetak = datas.nosk;
							$scope.itemGajiBerkala.tanggaltmtcetak = new Date(moment(datas.tgltmt).format('YYYY-MM-DD'));
							$scope.itemGajiBerkala.masakerjagolongan = datas.masakerjagolongan;
							$scope.itemGajiBerkala.masakerjagolonganlama = datas.masakerjagolongan;
						}
			
						
						if ($scope.itemGajiBerkala.tanggaltmtcetak  !== 'KP') {
							var tmtBaru = new Date($scope.itemGajiBerkala.tanggaltmtcetak);
							tmtBaru.setFullYear(tmtBaru.getFullYear() + 2);
							$scope.itemGajiBerkala.tanggaltmt = tmtBaru;
						} 			

						if ($scope.itemGajiBerkala.masakerjagolongan) {
							var masaKerja = $scope.itemGajiBerkala.masakerjagolongan.split(" ");
							var tahun = parseInt(masaKerja[0]); 
							var bulan = parseInt(masaKerja[2]) || 0;  
						
							if (!isNaN(tahun)) {
								tahun += 2;

								if (bulan >= 12) {
									tahun += Math.floor(bulan / 12); 
									bulan = bulan % 12; 
								}
								$scope.itemGajiBerkala.masakerjagolongan = tahun + " tahun " + bulan + " bulan";
							}
						}
					});
				}
			});
			
			$scope.$watch('tunjangan', function (newValue, oldValue) {
				var tunjangan = 0
				if($scope.datakeluarga == 'isanak'){
					tunjangan = (2/100)
				} 
				if ($scope.datakeluarga == 'issuamiistri'){
					tunjangan = (10 / 100)
				}
				if($scope.tunjangan == undefined){
					return
				}
				medifirstService.get('sdm/get-gaji-pokok-lama?gaji=' + $scope.tunjangan + '&idpegawai=' + $scope.item.idPegawai).then(function (data) {
					var datas = data.data.data[0]
					if ($scope.tunjangan == 'KP') {
						$scope.itemKeluarga.Tunjangan = datas.nominal * tunjangan
						$scope.pangkat = datas.nominal
					} else {
						$scope.itemKeluarga.Tunjangan = datas.gajiakhir * tunjangan
						$scope.berkala = datas.gajiakhir
					}

				})
			})
			
			//* BATAS SUCI *//			
		}
	]);
});