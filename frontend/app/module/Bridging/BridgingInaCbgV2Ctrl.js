define(['initialize', 'Configuration'], function (initialize,configuration) {
	'use strict';
	    var baseTransaksi = configuration.baseApiBackend;
	initialize.controller('BridgingInaCbgV2Ctrl', ['$mdDialog', '$timeout', '$state', '$q', '$rootScope', '$scope', 'CacheHelper', 'DateHelper', 'MedifirstService',
		function ($mdDialog, $timeout, $state, $q, $rootScope, $scope, cacheHelper, dateHelper, medifirstService) {

			$scope.dataVOloaded = true;
			$scope.now = new Date();
			$scope.item = {};
			$scope.itemPopUp={};
			$scope.dataSelected = {};
			$scope.popUpDokumen = {};
            $scope.dataSelected1 = {};
			$scope.dataExpRad = {};
			$scope.tarif_rs16 = {};
			
			$scope.item.periodeAwal = new Date();
			$scope.item.periodeAkhir = new Date();
			$scope.item.periodeAwalMasal = new Date();
			$scope.item.periodeAkhirMasal = new Date();
			$scope.item.tanggalPulang = new Date();
			$scope.dataPasienSelected = {};
			$scope.item.isPulang = false;
			$scope.cboDokter = false;
			$scope.showdiv = false;
			$scope.pasienPulang = false;
			$scope.cboUbahDokter = true;
			$scope.isRouteLoading = false;
			$scope.item.jmlRows = 50
			$scope.jmlRujukanMasuk = 0
			$scope.jmlRujukanKeluar = 0
			$scope.itemgrop = {};
			$scope.importIcd = {};
			$scope.grupingtab = false;
			$scope.itemres ={};
			$scope.ventilator = false
			$scope.inap = false
			$scope.pasientb = false
			$scope.pasienapgar = false			
			$scope.isInu = true	
			$scope.disabledTombol = false
			$scope.isLoadingNav = false
			$scope.popUpTm = {};		
			$scope.popUpTp = {};
			$scope.grouper_idrg = false
			$scope.isimportidrg = false
			$scope.batalKlaim = {}
			$scope.istopup = false;
			$scope.isRanap = false;
			var responData = "";
			var data2 = []
			var dataSave = []
			var dataSEPCMG = []
			var dataRow = {}
			let coderNIK = ''
			$scope.show_btn = true
			$scope.listStatus = [
				{id:'new_claim',name:'Klaim'},
				{id:'reedit_claim',name:'Klaim Edit'},
				{id:'grouper',name:'Grouping'},
				{id:'grouper_idrg',name:'Grouping iDRG'},
				{id:'idrg_grouper_final',name:'Grouping iDRG Final'},
				{id:'idrg_grouper_reedit',name:'Grouping iDRG Reedit'},
				{id:'inacbg_grouper_reedit',name:'Grouping INACBG Reedit'},
				{id:'inacbg_grouper_final',name:'Grouping INACBG Final'},
				{id:'claim_final',name:'Final Klaim'},
				{id:'send_claim_individual',name:'Terkirim'}
			]
			$scope.dataLogin = JSON.parse(window.localStorage.getItem('pegawai'));
			$scope.user = medifirstService.getPegawaiLogin();
			loadCombo();
			
			$scope.clickInu = function () {
				$scope.isInu = !$scope.isInu
			}

			$scope.formatJam24 = {
                value: new Date(),			//set default value
                format: "dd-MM-yyyy 23:59",	//set date format
                timeFormat: "HH:mm",		//set drop down time format to 24 hours
            }

			// loadData();
			// getSisrute()
			// postKunjunganYankes()
			
			function loadCombo() {
				var chacePeriode = cacheHelper.get('DaftarRegistrasiPasienCtrl');
				if (chacePeriode != undefined) {
					//debugger;
					var arrPeriode = chacePeriode.split('~');
					$scope.item.periodeAwal = new Date(arrPeriode[0]);
					$scope.item.periodeAkhir = new Date(arrPeriode[1]);
					$scope.item.tglpulang = new Date(arrPeriode[2]);
				} else {
					$scope.item.periodeAwal = moment($scope.now).format('YYYY-MM-DD 00:00');
					$scope.item.periodeAkhir = moment($scope.now).format('YYYY-MM-DD 23:59');
					$scope.item.tglpulang = $scope.now;
				}
				medifirstService.get("bridging/inacbg/get-data-combo-ina", false).then(function (data) {
					$scope.listDepartemen = data.data.departemen;
					$scope.listKelompokPasien = data.data.kelompokpasien;
					$scope.selectOptionsKelompok = {
                        placeholder: "Pilih Kelompok...",
                        dataTextField: "kelompokpasien",
                        dataValueField: "id",
                        // dataSource:{
                        //     data: $scope.listRuangan
                        // },
                        autoBind: false,
                       
					};
					var kelompok =[]
					for (let i = 0; i < $scope.listKelompokPasien.length; i++) {
						const element = $scope.listKelompokPasien[i];
						if(element.kelompokpasien.indexOf('BPJS')> -1 || element.kelompokpasien.toUpperCase().indexOf('KEMENKES')> -1)
						kelompok.push(element)
					}
					$scope.item.kelompokpasien = kelompok
					// $scope.item.kelompokpasien = {
					// 	id: 2,
					// 	kelompokpasien: "BPJS"
					// }
					$scope.listDokter = data.data.dokter;
					$scope.listDokter2 = data.data.dokter;


				})

				medifirstService.get("registrasi/get-combo-riwayat-regis", false).then(function (data) {
					$scope.sourceJenisDiagnosisPrimer = data.data.jenisdiagnosa;
					$scope.sourceJenisDiagnosisPrimerIdrg = $scope.sourceJenisDiagnosisPrimer.filter(function(item) {
						return [15,16].includes(item.id);
					});
					
					$scope.sourceJenisDiagnosisPrimer1 = [
						{id:'17',jenisDiagnosa:'Primary / utama UNU Grouper'},
						{id:'18',jenisDiagnosa:'Secondary UNU Grouper'},
					];
					$scope.sourceJenisDiagnosisPrimer2 = [
						{id:'19',jenisDiagnosa:'Primary / utama INA Grouper'},
						{id:'20',jenisDiagnosa:'Secondary INA Grouper'},
					];
					$scope.item.jenisDiagnosis = {id: 7, jenisDiagnosa: "Primary / utama UNU Grouper"}
					// $scope.sourceJenisDiagnosisPrimer1 = data.data.jenisdiagnosa;
				})
				medifirstService.getPart("registrasi/daftar-registrasi/get-data-diagnosa", true, true, 10).then(function (data) {
					$scope.sourceDiagnosisPrimer = data;
				});
				medifirstService.getPart("registrasi/daftar-registrasi/get-data-diagnosa-all", true, true, 10).then(function (data) {
					$scope.sourceDiagnosisPrimerIdrg = data;
				});
				medifirstService.getPart("registrasi/get-icd-9-all", true, true, 10).then(function (data) {
					$scope.sourceDiagnosisIdrgTd = data;
				});
				medifirstService.getPart("registrasi/get-icd-9", true, true, 10).then(function (data) {
					$scope.sourceDiagnosisPrimer1 = data;
				});

				medifirstService.getPart("registrasi/get-icd-9-inagrouper", true, true, 10).then(function (data) {
					$scope.sourceIcd9Inagrouper = data;
				});

				medifirstService.getPart("registrasi/daftar-registrasi/get-icd-10-inagrouper", true, true, 10).then(function (data) {
					$scope.sourceIcd10Inagrouper = data;
				});
				// $scope.listStatus = manageKasir.getStatus();
			}

			$scope.saveLogging = async function (jenis, referensi, noreff, ket) {
			await	medifirstService.get("sysadmin/logging/save-log-all?jenislog=" + jenis
					+ "&referensi=" + referensi
					+ "&noreff=" + noreff
					+ "&keterangan=" + ket
				).then(async function (data) {

				})
			}

			$scope.popupMerge = function () {
				$scope.item.noRegTujuan = undefined
				$scope.item.noRegSalah = undefined
				// $scope.item.catatanMerge= undefined
				$scope.popupMergePendaftaran.center().open();
			}
			$scope.mergePendafataran = function () {
				debugger;
				if ($scope.item.noRegTujuan == undefined || $scope.item.noRegTujuan == "") {
					toastr.error('NoRegistrasi Tujuan Belum di ISI', 'Caution');
					return;
				}
				if ($scope.item.noRegSalah == undefined || $scope.item.noRegSalah == "") {
					toastr.error('NoRegistrasi Salah Belum di ISI', 'Caution');
					return;
				}
				var stt = 'false'
				if (confirm('Merge NoPendaftaran? Pastikan Data Merge Sudah Benar..!')) {
					stt = 'true';
					var objSave =
					{
						noRegTujuan: $scope.item.noRegTujuan,
						noRegSalah: $scope.item.noRegSalah
						// catatanMerge:$scope.item.catatanMerge
					}

					manageTataRekening.postMerge(objSave).then(function (e) {
						var a = e
					})
				} else {
					stt = 'false';
				}
			}
			$scope.getIsiComboRuangan = function () {
				$scope.listRuangan = $scope.item.instalasi.ruangan
			}

			$scope.formatTanggal = function (tanggal) {
				return moment(tanggal).format('DD-MMM-YYYY HH:mm');
			}

			$scope.formatRupiah = function (value, currency) {
				return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
			}
			var onDataBound = function () {
				$('#kGridDaftarPasien td').each(function () {

					if ($(this).text() == 'unverifikasi') { $(this).addClass('tomat') }
					if ($(this).text() == 'false') { $(this).text('Belum di Coder') }
					if ($(this).text() == 'Belum di Coder') { $(this).addClass('coder') }
					if ($(this).text() == '-1') { $(this).text('Belum di Grouping') }
					if ($(this).text() == 'Belum di Grouping') { $(this).addClass('red') }
					if ($(this).text() == 'Klaim') { $(this).addClass('green') }
					if ($(this).text() == 'Klaim Edit') { $(this).addClass('green') }
					if ($(this).text() == 'Grouping') { $(this).addClass('green') }
					if ($(this).text() == 'Final Klaim') { $(this).addClass('green') }
					if ($(this).text() == 'Terkirim') { $(this).addClass('green') }
					if ($(this).text() == '-') { $(this).addClass('red') }
					//   if ($(this).text() == '') {$(this).addClass('red')}
				})
			}
			$scope.columnDaftarPasienPulang = {
				excel: {
					fileName: "DaftarKlaimInacbg.xlsx",
					allPages: true,
				},
				excelExport: function (e) {
					var sheet = e.workbook.sheets[0];
					sheet.frozenRows = 2;
					sheet.mergedCells = ["A1:S1"];
					sheet.name = "Orders";

					var myHeaders = [{
						value: "Daftar Klaim Pasien",
						fontSize: 20,
						textAlign: "center",
						background: "#ffffff",
						// color:"#ffffff"
					}];

					sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
				},
				selectable: 'row',
				pageable: true,
				scrollable: true,
				dataBound: onDataBound,
				toolbar:[
					"excel",
                    {
                        name: "src", 
                        text: "src",
                        template:  '<div class="grid_4" style="margin-top: -8px; float: right;" ><div class="grid_1" style="margin-top: 10px; float: right;"><label c-label item="item" c-label-text="Search"></label></div><div class="grid_11"><input c-text-box type="input" class="k-textbox" ng-model="item.searchMata" /></div></div>'
                    }
                ],
				columns:
					[
						{
							"field": "tglregistrasi",
							"title": "Tgl Registrasi",
							"width": "70px",
							"template": "<span class='style-left'>{{formatTanggal('#: tglregistrasi #')}}</span>"
						},
						{
							"field": "noregistrasi",
							"title": "NoReg",
							"width": "90px"
						},
						{
							"field": "nocm",
							"title": "NoRM",
							"width": "65px",
							"template": "<span class='style-center'>#: nocm #</span>"
						},
						{
							"field": "namapasien",
							"title": "Nama Pasien",
							"width": "120px",
							"template": "<span class='style-left'>#: namapasien #</span>"
						},
						// {
						// 	"field": "namaruangan",
						// 	"title": "Nama Ruangan",
						// 	"width":"50px",
						// 	"template": "<span class='style-left'>#: namaruangan #</span>"
						// },
						{
							"field": "namadokter",
							"title": "Nama Dokter",
							"width": "100px",
							"template": '# if( namadokter==null) {# - # } else {# #= namadokter # #} #'
						},
						// {
						// 	"field": "kelompokpasien",
						// 	"title": "Kelompok Pasien",
						// 	"width":"100px",
						// 	"template": "<span class='style-left'>#: kelompokpasien #</span>"
						// },
						{
							"field": "tglpulang",
							"title": "Tgl Pulang",
							"width": "70px",
							"template": "<span class='style-left'>{{formatTanggal('#: tglpulang #')}}</span>"
						},
						{
							"field": "nobed",
							"title": "No Bed",
							"width": "70px",
						},
						{
							"field": "namaruangan",
							"title": "Nama Ruangan",
							"width": "120px",
						},
						// {
						// 	"field": "statuspasien",
						// 	"title": "Status",
						// 	"width":"80px",
						// 	"template": "<span class='style-center'>#: statuspasien #</span>"
						// },
						// {
						// 	"field": "nostruk",
						// 	"title": "NoStrukVerif",
						// 	"width":"100px",
						// 	"template": '# if( nostruk==null) {# - # } else {# #= nostruk # #} #'
						// },
						// {
						// 	"field": "nosbm",
						// 	"title": "NoSBM",
						// 	"width":"100px",
						// 	"template": '# if( nosbm==null) {# - # } else {# #= nosbm # #} #'
						// },
						// {
						// 	"field": "kasir",
						// 	"title": "Kasir",
						// 	"width":"100px",
						// 	"template": '# if( kasir==null) {# - # } else {# #= kasir # #} #'
						// },
						{
							"field": "nosep",
							"title": "No SEP",
							"width": "150px",
							"template": '# if( nosep==null) {# - # } else {# #= nosep # #} #'
						},

						{
							"field": "namakelas",
							"title": "Kelas Dijamin",
							"width": "70px",
							"template": '# if( namakelas==null) {# - # } else {# #= namakelas # #} #'
						}
						,
						{
							"field": "totalpiutangpenjamin",
							"title": "Total Grouping",
							"width": "70px"
						},
						{
							"field": "totalbiayars",
							"title": "Tarif Rs",
							"width": "70px"
						},
						{
							"field": "deposit",
							"title": "Deposit",
							"width": "70px"
						},
						{
							"field": "pegverif",
							"title": "Petugas Verif",
							"width": "85px"
						},
						{
							"field": "statusverif",
							"title": "Status Verif",
							"width": "85px"
						},
						// {
						// 	"field": "pebilling",
						// 	"title": "Petugas Billing",
						// 	"width": "85px"
						// },
						// {
						// 	"field": "biayanaikkelas",
						// 	"title": "Biaya Naik Kelas",
						// 	"width": "50px"
						// },
						{
							"field": "namakelasdaftar",
							"title": "Kelas Terakhir",
							"width": "70px"
						},
						{
							"field": "icd10",
							"title": "Diagnosa Utama dan Sekunder",
							"width": "80px"
						},
						// {
						// 	"field": "status",
						// 	"title": "Status Berkas",
						// 	"width": "50px"
						// },
						{
							"field": "statusklaim",
							"title": "Status ",
							"width": "75px"
						},
						{
							"field": "hitungdok",
							"title": "Dokumen",
							"width": "75px"
							// "template": '# if( statuskelengkapandok==true) {# Sudah Lengkap # } else {# - #} #'
						},
						// {
						// 	"field": "pegawaikirim",
						// 	"title": "P Kirim",
						// 	"width": "10%"
						// 	// "template": '# if( statuskelengkapandok==true) {# Sudah Lengkap # } else {# - #} #'
						// },
						// {
						// 	"field": "pegawaisimpan",
						// 	"title": "P Simpan",
						// 	"width": "10%"
						// 	// "template": '# if( statuskelengkapandok==true) {# Sudah Lengkap # } else {# - #} #'
						// },
						// {
						// 	"field": "pegawaigrouper",
						// 	"title": "P Grouping",
						// 	"width": "10%"
						// 	// "template": '# if( statuskelengkapandok==true) {# Sudah Lengkap # } else {# - #} #'
						// },
						{
							"field": "pegawaifinalklaim",
							"title": "Pegawai Klaim",
							"width": "80px"
							// "template": '# if( statuskelengkapandok==true) {# Sudah Lengkap # } else {# - #} #'
						},
						{
							"field": "tglklaim",
							"title": "Tgl Klaim",
							"width": "70px",
							"template": "<span class='style-left'>{{formatTanggal('#: tglklaim #')}}</span>"
						},
						{
							"field": "pegeditklaim",
							"title": "Pegawai Edit",
							"width": "70px"
							// "template": '# if( statuskelengkapandok==true) {# Sudah Lengkap # } else {# - #} #'
						},
						{
							"field": "tgledit",
							"title": "Tgl Edit",
							"width": "70px",
							"template": "<span class='style-left'>{{formatTanggal('#: tgledit #')}}</span>"
						},
						{
							"field": "catatanklaim",
							"title": "Catatan Klaim",
							"width": "170px",
						},
						{
							"field": "batalklaim",
							"title": "Batal Klaim",
							"width": "170px",
						},
						
					]
			};
			$scope.dbklik = function (data) {
				$scope.popupDetail.center().open();
				var jenis_rawat = 1 //ranap
				if (data.deptid != 16) {
					jenis_rawat = 2
				}
				var upgrade_class_ind = 0
				var upgrade_class_class = ''
				var add_payment_pct = 0
				if (data.nokelasdijamin > data.nokelasdaftar && data.deptid == 16) {
					upgrade_class_ind = 1
					upgrade_class_class = data.namakelas
					add_payment_pct = 0
				}
				var discharge_status = 0
				if (data.objectstatuspulangfk == 1 || data.objectstatuspulangfk == 6) {
					discharge_status = 1
				} else if (data.objectstatuspulangfk == 4 || data.objectstatuspulangfk == 5 || data.objectstatuspulangfk == 10 ||
					data.objectstatuspulangfk == 11) {
					discharge_status = 2
				} else if (data.objectstatuspulangfk == 2 || data.objectstatuspulangfk == 8 || data.objectstatuspulangfk == 3) {
					discharge_status = 3
				} else if (data.objectstatuspulangfk == 9) {
					discharge_status = 4
				} else {
					discharge_status = 5
				}


				$scope.item.detail =
					'nomor_sep = ' + data.nosep + '\n' +
					'nomor_kartu = ' + data.nokepesertaan + '\n' +
					'tgl_masuk = ' + data.tglregistrasi + '\n' +
					'tgl_pulang = ' + data.tglpulang + '\n' +
					'jenis_rawat = ' + jenis_rawat + '\n' +
					'kelas_rawat = ' + data.nokelasdaftar + '\n' +
					'adl_sub_acute = null \n' +
					'adl_chronic = null \n' +
					'icu_indikator = null \n' +
					'icu_los = null \n' +
					'ventilator_hour = null \n' +
					'upgrade_class_ind = ' + upgrade_class_ind + '\n' +
					'upgrade_class_class = ' + upgrade_class_class + '\n' +
					'upgrade_class_los = ' + null + '\n' +
					'add_payment_pct = ' + add_payment_pct + '\n' +
					'birth_weight = ' + 0 + '\n' +
					'discharge_status = ' + discharge_status + '\n' +
					'diagnosa = ' + data.icd10 + '\n' +
					'procedure = ' + data.icd9 + '\n' +
					'tarif_rs = ' + data.tarif_rs + '\n' +
					'episodes = ' + data.loscovid + '\n' + 
					'tarif_poli_eks = ' + 0 + "\n" +
					'nama_dokter = ' + data.namadokter + "\n" +
					'kode_tarif = ' + 'BP' + "\n" +
					'payor_id = ' + '3' + "\n" +
					'payor_cd = ' + 'JKN' + "\n" +
					'cob_cd = ' + '#' + "\n" +
					'coder_nik = ' + data.codernik

						$scope.listTarifRS =[
												{namatarif:'Prosedur Non Bedah' ,tarif:data.tarif_rs.prosedur_non_bedah},
												{namatarif:'Tenaga Ahli' ,tarif:data.tarif_rs.tenaga_ahli},
												{namatarif:'Radiologi' ,tarif:data.tarif_rs.radiologi},
												{namatarif:'Rehabilitasi' ,tarif:data.tarif_rs.rehabilitasi},
												{namatarif:'Obat' ,tarif:data.tarif_rs.obat},
												{namatarif:'Alkes' ,tarif:data.tarif_rs.alkes},
												 {namatarif:'Prosedur Bedah' ,tarif:data.tarif_rs.prosedur_bedah},
												 {namatarif:'Keperawatan' ,tarif:data.tarif_rs.keperawatan},
												 {namatarif:'Laboratorium' ,tarif:data.tarif_rs.laboratorium},
												 {namatarif:'Kamar/Akomodasi' ,tarif:data.tarif_rs.kamar},
												 {namatarif:'Obat Kronis' ,tarif:data.tarif_rs.obat_kronis},
												 {namatarif:'BMHP' ,tarif:data.tarif_rs.bmhp},
												 {namatarif:'Konsultasi' ,tarif:data.tarif_rs.konsultasi},
												 {namatarif:'Penunjang' ,tarif:data.tarif_rs.penunjang},					//
												 {namatarif:'Pelayanan Darah' ,tarif:data.tarif_rs.pelayanan_darah},
												{namatarif:'Rawat Intensif' ,tarif:data.tarif_rs.rawat_intensif},
												{namatarif:'Obat Kemoterapi' ,tarif:data.tarif_rs.obat_kemoterapi},
												{namatarif:'Sewa Alat' ,tarif:data.tarif_rs.sewa_alat}
											]
				$scope.totalTarifRS =0
				for (var i = 0; i < $scope.listTarifRS.length; i++) {
					$scope.totalTarifRS = parseFloat($scope.listTarifRS[i].tarif )+ $scope.totalTarifRS
				}
				$scope.totalTarifRS =$scope.formatRupiah ($scope.totalTarifRS,'Rp. ')
			}
			$scope.tutup = function () {
				$scope.popupDetail.center().close();
			}

			$scope.SearchDataObat = function () {
				loadDataObat()
			}

			$scope.SearchData = function () {
				loadData()
			}
			$scope.SearchDataMasal = function () {
				loadDataMasal()
			}
			function loadDataMasal() {
				$scope.isRouteLoading = true;
				var tglAwal = moment($scope.item.periodeAwalMasal).format('YYYY-MM-DD');
				var tglAkhir = moment($scope.item.periodeAkhirMasal).format('YYYY-MM-DD');



				var jmlRows = "";
				if ($scope.item.jmlRows != undefined) {
					jmlRows = $scope.item.jmlRows
				}
				$q.all([
					medifirstService.get("inacbg/get-daftar-pasien-inacbg-masal?" +
						"tglAwal=" + tglAwal +
						"&tglAkhir=" + tglAkhir +
						'&jmlRows=' + jmlRows),
				]).then(function (data) {
					$scope.isRouteLoading = false;
					data2 = data[0].data;

					dataSave = []
					for (var i = data2.length - 1; i >= 0; i--) {
						coderNIK = data2[i].codernik
						var jenis_rawat = 1 //ranap
						if (data2[i].deptid != 16) {
							jenis_rawat = 2
						}
						var upgrade_class_ind = 0
						var upgrade_class_class = ''
						var add_payment_pct = 0

						if (data2[i].nokelasdijamin > data2[i].nokelasdaftar && data2[i].deptid == 16) {
							upgrade_class_ind = 1
							upgrade_class_class = data2[i].namakelasdaftar
							add_payment_pct = 0
						}
						// if(data2[i].statusnaikkelas==1){
						// 	upgrade_class_ind = 1
						// 	upgrade_class_class = data2[i].kelastertinggi
						// 	add_payment_pct = 0
						// 	upgrade_class_los = data2[i].lamarawatnaikkelas
						// }
						var discharge_status = 0
						if (data2[i].objectstatuspulangfk == 1 || data2[i].objectstatuspulangfk == 6) {
							discharge_status = 1
						} else if (data2[i].objectstatuspulangfk == 4 || data2[i].objectstatuspulangfk == 5 || data2[i].objectstatuspulangfk == 10 ||
							data2[i].objectstatuspulangfk == 11) {
							discharge_status = 2
						} else if (data2[i].objectstatuspulangfk == 2 || data2[i].objectstatuspulangfk == 8 || data2[i].objectstatuspulangfk == 3) {
							discharge_status = 3
						} else if (data2[i].objectstatuspulangfk == 9) {
							discharge_status = 4
						} else {
							discharge_status = 5
						}
						if (jenis_rawat == 2) {
							data2[i].nokelasdijamin = ''
						}
						var payor_id = '3'
						var payor_cd = 'JKN'
						if (data2[i].idrekanan == '2552') {
							payor_id = '3'
							payor_cd = 'JKN'
						} else if (data2[i].idrekanan == '581164') {
							payor_id = '5'
							payor_cd = 'JAMKESDA'
							data2[i].nosep = data2[i].nokepesertaan
						}
						dataRow = {
							"nomor_sep": data2[i].nosep,    //"0901R001TEST0001",    
							"nomor_kartu": data2[i].nokepesertaan,    //"233333",    
							"tgl_masuk": data2[i].tglregistrasi,    //"2017-11-20 12:55:00",    
							"tgl_pulang": data2[i].tglpulang,    //"2017-12-01 09:55:00",    
							"jenis_rawat": jenis_rawat,    //"1",    
							"kelas_rawat": data2[i].nokelasdijamin,    //"1",    
							"adl_sub_acute": '',    //"15",    
							"adl_chronic": '',    //"12",    
							"icu_indikator": '',    //"1",    
							"icu_los": '',    //"2",    
							"ventilator_hour": '',    //"5",    
							"upgrade_class_ind": upgrade_class_ind,    //"1",    
							"upgrade_class_class": upgrade_class_class,    //"vip",    
							"upgrade_class_los": '',    //"5",    
							"add_payment_pct": '',    //"35",    
							"birth_weight": '',    //"0",    
							"discharge_status": discharge_status,    //"1",    
							"diagnosa": data2[i].icd10,    //"S71.0#A00.1",    
							"procedure": data2[i].icd9,    //"81.52#88.38",    
							"tarif_rs": {
								"prosedur_non_bedah": data2[i].tarif_rs.prosedur_non_bedah,    //"300000",      
								"prosedur_bedah": data2[i].tarif_rs.prosedur_bedah,    //"20000000",      
								"konsultasi": data2[i].tarif_rs.konsultasi,    //"300000",      
								"tenaga_ahli": data2[i].tarif_rs.tenaga_ahli,    //"200000",      
								"keperawatan": data2[i].tarif_rs.keperawatan,    // "80000",      
								"penunjang": data2[i].tarif_rs.penunjang,    //"1000000",      
								"radiologi": data2[i].tarif_rs.radiologi,    //"500000",      
								"laboratorium": data2[i].tarif_rs.laboratorium,    //"600000",      
								"pelayanan_darah": data2[i].tarif_rs.pelayanan_darah,    //"150000",      
								"rehabilitasi": data2[i].tarif_rs.rehabilitasi,    //"100000",      
								"kamar": data2[i].tarif_rs.kamar,    //"6000000",      
								"rawat_intensif": data2[i].tarif_rs.rawat_intensif,    //"2500000",      
								"obat": data2[i].tarif_rs.obat,    //"2000000",      
								"obat_kronis": data2[i].tarif_rs.obat_kronis,    //"2000000",      
								"obat_kemoterapi": data2[i].tarif_rs.obat_kemoterapi,    //"2000000",      
								"alkes": data2[i].tarif_rs.alkes,    //"500000",      
								"bmhp": data2[i].tarif_rs.bmhp,    //"400000",      
								"sewa_alat": data2[i].tarif_rs.sewa_alat,    //"210000"    
							},
							"tarif_poli_eks": 0,    //"100000",    
							"nama_dokter": data2[i].namadokter,    //"RUDY, DR",    
							"kode_tarif": data2[i].kodetarif,    //'RSAB',    //"AP",    
							"payor_id": payor_id,//'3',    //"3",    
							"payor_cd": payor_cd,//'JKN',    //"JKN",    
							"cob_cd": '#',    //"0001",    
							"coder_nik": data2[i].codernik,    //"123123123123"  
							"nomor_rm": data2[i].nocm,    //"123-45-28",
							"nama_pasien": data2[i].namapasien,    //"Efan Andrian",
							"tgl_lahir": data2[i].tgllahir,    //"1985-01-01 02:00:00",
							"gender": data2[i].objectjeniskelaminfk    //"2"
						}
						dataSave.push(dataRow)
					}
					$scope.show_btn = true
					for (var i = dataSave.length - 1; i >= 0; i--) {
						if (dataSave[i].nosep == '') {
							$scope.show_btn = false
							break;
						}
					}


					//check data klaim
					// {
					// 	var dt1 ={}
					// 	var dt2 =[]
					// 	for (var i = dataSave.length - 1; i >= 0; i--) {
					// 		dt1 = {   
					// 			"metadata": {      
					// 				"method":"get_claim_data"   
					// 			},   
					// 			"data": {      
					// 				"nomor_sep": dataSave[i].nomor_sep
					// 			} 
					// 		} 
					// 		dt2.push(dt1)
					// 	}

					// 	var objData = {
					// 		  "data": dt2
					// 		}
					// 	manageTataRekening.savebridginginacbg(objData).then(function(e){
					// 		for (var i = 0; i < data2.length; i++) {
					// 			for (var i = 0; i < e.data.dataresponse.length; i++) {
					// 				if (e.data.dataresponse[i].datarequest.data.nomor_sep == data2[i].nosep) {
					// 					if (e.data.dataresponse[i].dataresponse.metadata.code == 200) {
					// 						data2[i].status = 'Send Claim'
					// 					}else{
					// 						data2[i].status = ''
					// 					}

					// 				}
					// 			}


					// 		}
					$scope.dataDaftarPasienPulangMasal = new kendo.data.DataSource({
						data: data[0].data,
						pageSize: 10,
						total: data[0].data,
						serverPaging: false,
						schema: {
							model: {
								fields: {
								}
							}
						}
					});
					// }) 
					// }
					//end //check data klaim


					//end Transpose

				});

			};

			function loadDataObat() {
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

				var jmlRows = "";
				if ($scope.item.jmlRows != undefined) {
					jmlRows = $scope.item.jmlRows
				}
				$q.all([
					medifirstService.get("inacbg/get-daftar-pasien-inacbg-masal?" +
						"tglAwal=" + tglAwal +
						"&tglAkhir=" + tglAkhir +
						reg + rm + nm + ins + rg + kp + dk
						+ '&jmlRows=' + jmlRows),
				]).then(function (data) {
					$scope.isRouteLoading = false;
					data2 = data[0].data;
					
					// $scope.dataDaftarPasienPulang = new kendo.data.DataSource({
					//                    data: data[0].data,
					//                    pageSize: 10,
					//                    total:data[0].data,
					//                    serverPaging: false,
					//                    schema: {
					//                        model: {
					//                            fields: {
					//                            }
					//                        }
					//                    }
					//                });


					//Transpose
					dataSave = []
					for (var i = data2.length - 1; i >= 0; i--) {

						var jenis_rawat = 1 //ranap
						if (data2[i].deptid != 16) {
							jenis_rawat = 2
						}
						var upgrade_class_ind = 0
						var upgrade_class_class = ''
						var add_payment_pct = 0
						if (data2[i].nokelasdijamin > data2[i].nokelasdaftar && data2[i].deptid == 16) {
							upgrade_class_ind = 1
							upgrade_class_class = data2[i].namakelasdaftar
							add_payment_pct = 0
						}
						// if(data2[i].statusnaikkelas==1){
						// 	upgrade_class_ind = 1
						// 	upgrade_class_class = data2[i].kelastertinggi
						// 	add_payment_pct = 0
						// 	upgrade_class_los = data2[i].lamarawatnaikkelas
						// }
						var discharge_status = 0
						if (data2[i].objectstatuspulangfk == 1 || data2[i].objectstatuspulangfk == 6) {
							discharge_status = 1
						} else if (data2[i].objectstatuspulangfk == 4 || data2[i].objectstatuspulangfk == 5 || data2[i].objectstatuspulangfk == 10 ||
							data2[i].objectstatuspulangfk == 11) {
							discharge_status = 2
						} else if (data2[i].objectstatuspulangfk == 2 || data2[i].objectstatuspulangfk == 8 || data2[i].objectstatuspulangfk == 3) {
							discharge_status = 3
						} else if (data2[i].objectstatuspulangfk == 9) {
							discharge_status = 4
						} else {
							discharge_status = 5
						}
						if (jenis_rawat == 2) {
							data2[i].nokelasdijamin = ''
						}
						var payor_id = '3'
						var payor_cd = 'JKN'
						if (data2[i].idrekanan == '2552') {
							payor_id = '3'
							payor_cd = 'JKN'
						} else if (data2[i].idrekanan == '581164') {
							payor_id = '5'
							payor_cd = 'JAMKESDA'
							data2[i].nosep = data2[i].nokepesertaan
						}
						dataRow = {
							"nomor_sep": data2[i].nosep,    //"0901R001TEST0001",    
							"nomor_kartu": data2[i].nokepesertaan,    //"233333",    
							"tgl_masuk": data2[i].tglregistrasi,    //"2017-11-20 12:55:00",    
							"tgl_pulang": data2[i].tglpulang,    //"2017-12-01 09:55:00",    
							"jenis_rawat": jenis_rawat,    //"1",    
							"kelas_rawat": data2[i].nokelasdijamin,    //"1",    
							"adl_sub_acute": '',    //"15",    
							"adl_chronic": '',    //"12",    
							"icu_indikator": '',    //"1",    
							"icu_los": '',    //"2",    
							"ventilator_hour": '',    //"5",    
							"upgrade_class_ind": upgrade_class_ind,    //"1",    
							"upgrade_class_class": upgrade_class_class,    //"vip",    
							"upgrade_class_los": '',    //"5",    
							"add_payment_pct": '',    //"35",    
							"birth_weight": '',    //"0",    
							"discharge_status": discharge_status,    //"1",    
							"diagnosa": data2[i].icd10,    //"S71.0#A00.1",    
							"procedure": data2[i].icd9,    //"81.52#88.38",    
							"tarif_rs": {
								"prosedur_non_bedah": data2[i].tarif_rs.prosedur_non_bedah,    //"300000",      
								"prosedur_bedah": data2[i].tarif_rs.prosedur_bedah,    //"20000000",      
								"konsultasi": data2[i].tarif_rs.konsultasi,    //"300000",      
								"tenaga_ahli": data2[i].tarif_rs.tenaga_ahli,    //"200000",      
								"keperawatan": data2[i].tarif_rs.keperawatan,    // "80000",      
								"penunjang": data2[i].tarif_rs.penunjang,    //"1000000",      
								"radiologi": data2[i].tarif_rs.radiologi,    //"500000",      
								"laboratorium": data2[i].tarif_rs.laboratorium,    //"600000",      
								"pelayanan_darah": data2[i].tarif_rs.pelayanan_darah,    //"150000",      
								"rehabilitasi": data2[i].tarif_rs.rehabilitasi,    //"100000",      
								"kamar": data2[i].tarif_rs.kamar,    //"6000000",      
								"rawat_intensif": data2[i].tarif_rs.rawat_intensif,    //"2500000",      
								"obat": data2[i].tarif_rs.obat,    //"2000000",      
								"obat_kronis": data2[i].tarif_rs.obat_kronis,    //"2000000",      
								"obat_kemoterapi": data2[i].tarif_rs.obat_kemoterapi,    //"2000000",      
								"alkes": data2[i].tarif_rs.alkes,    //"500000",      
								"bmhp": data2[i].tarif_rs.bmhp,    //"400000",      
								"sewa_alat": data2[i].tarif_rs.sewa_alat,    //"210000"    
							},
							"tarif_poli_eks": 0,    //"100000",    
							"nama_dokter": data2[i].namadokter,    //"RUDY, DR",    
							"kode_tarif": data2[i].kodetarif,    //'RSAB',    //"AP",    
							"payor_id": payor_id,//'3',    //"3",    
							"payor_cd": payor_cd,//'JKN',    //"JKN",    
							"cob_cd": '#',    //"0001",    
							"coder_nik": data2[i].codernik,    //"123123123123"  
							"nomor_rm": data2[i].nocm,    //"123-45-28",
							"nama_pasien": data2[i].namapasien,    //"Efan Andrian",
							"tgl_lahir": data2[i].tgllahir,    //"1985-01-01 02:00:00",
							"gender": data2[i].objectjeniskelaminfk    //"2"
						}
						dataSave.push(dataRow)
					}
					$scope.show_btn = true
					for (var i = dataSave.length - 1; i >= 0; i--) {
						if (dataSave[i].nosep == '') {
							$scope.show_btn = false
							break;
						}
					}


					//check data klaim
					// {
					// 	var dt1 ={}
					// 	var dt2 =[]
					// 	for (var i = dataSave.length - 1; i >= 0; i--) {
					// 		dt1 = {   
					// 			"metadata": {      
					// 				"method":"get_claim_data"   
					// 			},   
					// 			"data": {      
					// 				"nomor_sep": dataSave[i].nomor_sep
					// 			} 
					// 		} 
					// 		dt2.push(dt1)
					// 	}

					// 	var objData = {
					// 		  "data": dt2
					// 		}
					// 	manageTataRekening.savebridginginacbg(objData).then(function(e){
					// 		for (var i = 0; i < data2.length; i++) {
					// 			for (var i = 0; i < e.data.dataresponse.length; i++) {
					// 				if (e.data.dataresponse[i].datarequest.data.nomor_sep == data2[i].nosep) {
					// 					if (e.data.dataresponse[i].dataresponse.metadata.code == 200) {
					// 						data2[i].status = 'Send Claim'
					// 					}else{
					// 						data2[i].status = ''
					// 					}

					// 				}
					// 			}


					// 		}
					$scope.dataDaftarPasienPulang = new kendo.data.DataSource({
						data: data[0].data,
						pageSize: 10,
						total: data[0].data,
						serverPaging: false,
						schema: {
							model: {
								fields: {
								}
							}
						}
					});
					// }) 
					// }
					//end //check data klaim


					//end Transpose
					var chacePeriode = tglAwal + "~" + tglAkhir;
					cacheHelper.set('DaftarRegistrasiPasienCtrl', chacePeriode);
				});

			};
			
			async function loadData() {
				$scope.isRouteLoading = true;
				$scope.dataPasienSelected = {};
				var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm:ss');
				var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm:ss');


				if ($scope.item.kelompokpasien == undefined) {
					toastr.error('Kelompok harus di pilih',"info")
					return
				}
				var reg = ""
				if ($scope.item.noReg != undefined) {
					var reg = "&noreg=" + $scope.item.noReg
				}
				var dokter = ""
				if ($scope.item.dokter != undefined) {
					 dokter = "&dokterid=" + $scope.item.dokter.id
				}
				var sep = ""
				if ($scope.item.sep != undefined) {
					var sep = "&nosep=" + $scope.item.sep
				}
				var pklaim = ""
				if ($scope.item.pegawaiklaim != undefined) {
					var pklaim = "&pegklaim=" + $scope.item.pegawaiklaim
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
				var isPulang = ""
				if ($scope.item.isPulang == true) {
					isPulang = "&ispulang=" + true;
				}
				// var kp = ""
				// if ($scope.item.kelompokpasien != undefined) {
				// 	var kp = "&kelId=" + $scope.item.kelompokpasien.id
				// }
				var kp = ""
            
                if ($scope.item.kelompokpasien != undefined && $scope.item.kelompokpasien.length != 0) {
                    var a = ""
                    var b = ""
                    for (var i = $scope.item.kelompokpasien.length - 1; i >= 0; i--) {               
                        var c = $scope.item.kelompokpasien[i].id
                        b = "," + c
                        a = a + b
                    }
                    kp = a.slice(1, a.length)
				}
				if(kp != ""){
					kp = "&kelId=" + kp
				}
				var dk = ""
				if ($scope.item.dokter != undefined) {
					var dk = "&dokId=" + $scope.item.dokter.id
				}

				var jmlRows = "";
				if ($scope.item.jmlRows != undefined) {
					jmlRows = $scope.item.jmlRows
				}
				var status = "";
				if ($scope.item.status != undefined) {
					status = $scope.item.status.id
				}
				$q.all
				$q.all([
				await	medifirstService.get("bridging/inacbg/get-daftar-pasien-inacbg-rev-2?" +
						"tglAwal=" + tglAwal +
						"&tglAkhir=" + tglAkhir + pklaim +
						reg + rm + sep + nm + ins + rg + kp + dk + isPulang + dokter
						+ '&jmlRows=' + jmlRows
						+'&status='+status +'&param=1'),
				]).then(async function (data) {
					$scope.isRouteLoading = false;
					data2 = data[0].data;
					// $scope.dataDaftarPasienPulang = new kendo.data.DataSource({
					//                    data: data[0].data,
					//                    pageSize: 10,
					//                    total:data[0].data,
					//                    serverPaging: false,
					//                    schema: {
					//                        model: {
					//                            fields: {
					//                            }
					//                        }
					//                    }
					//                });


					//Transpose
					dataSave = []
					for (var i = data2.length - 1; i >= 0; i--) {
						if(data2[i].statusklaim != null){
							for (var x = $scope.listStatus.length - 1; x >= 0; x--) {
								const elem =$scope.listStatus[x]
								if(elem.id == data2[i].statusklaim ){
									data2[i].statusklaim = elem.name
								}
							}
						}else{
							data2[i].statusklaim ='-'
						}

					// 	// if (data2[i].deptid == 16) {
					// 	// 	data2[i].tglpulang = data2[i].tglpulangresume
					// 	// }
						coderNIK = data2[i].codernik
					// 	var caramasuk_inacbg = data2[i].caramasuk_inacbg == null ? "other" : data2[i].caramasuk_inacbg;
					// 	var menit1_appear = data2[i].menit1_appear == null ? "" : data2[i].menit1_appear;
					// 	var menit1_pulse = data2[i].menit1_pulse == null ? "" : data2[i].menit1_pulse;
					// 	var menit1_grimace = data2[i].menit1_grimace == null ? "" : data2[i].menit1_grimace;
					// 	var menit1_activity = data2[i].menit1_activity == null ? "" : data2[i].menit1_activity;
					// 	var menit1_resp = data2[i].menit1_resp == null ? "" : data2[i].menit1_resp;
					// 	var menit5_appear = data2[i].menit5_appear == null ? "" : data2[i].menit5_appear;
					// 	var menit5_pulse = data2[i].menit5_pulse == null ? "" : data2[i].menit5_pulse;
					// 	var menit5_grimace = data2[i].menit5_grimace == null ? "" : data2[i].menit5_grimace;
					// 	var menit5_activity = data2[i].menit5_activity == null ? "" : data2[i].menit5_activity;
					// 	var menit5_resp = data2[i].menit5_resp == null ? "" : data2[i].menit5_resp;
					// 	var jenis_rawat = data2[i].jenis_rawat //ranap
					// 	// if (data2[i].deptid != 16) {
					// 	// 	jenis_rawat = 2
					// 	// }
					// 	var upgrade_class_ind = 0
					// 	var upgrade_class_class = ''
					// 	var upgrade_class_payor = ''
					// 	var add_payment_pct = 0
					// 	if (data2[i].nokelasdijamin > data2[i].nokelasdaftar && data2[i].deptid == 16 && data2[i].namakelasdaftar != 'Non Kelas') {
					// 		upgrade_class_ind = 1
					// 		upgrade_class_class = data2[i].namakelasdaftar
					// 		upgrade_class_payor = "peserta"
					// 		add_payment_pct = 0
					// 	}
					// 	if (data2[i].namaruangan == 'NHCU' || data2[i].namaruangan == 'ICU' || data2[i].namaruangan == 'ICCU') {
					// 		upgrade_class_ind = 0
					// 	}
					// 	if (data2[i].statustitipan == 1) {
					// 		upgrade_class_ind = 0
					// 		upgrade_class_class = ''
					// 		add_payment_pct = 0
					// 	}
					// 	// if(data2[i].statusnaikkelas==1){
					// 	// 	upgrade_class_ind = 1
					// 	// 	upgrade_class_class = data2[i].kelastertinggi
					// 	// 	add_payment_pct = 0
					// 	// 	upgrade_class_los = data2[i].lamarawatnaikkelas
					// 	// }
					// 	var discharge_status = 0
					// 	var pemulasaraan_covid = 0
					// 	if (data2[i].objectstatuspulangfk == 1 || data2[i].objectstatuspulangfk == 6) {
					// 		discharge_status = 1
					// 	} else if (data2[i].objectstatuspulangfk == 4 || data2[i].objectstatuspulangfk == 5 || data2[i].objectstatuspulangfk == 10 ||
					// 		data2[i].objectstatuspulangfk == 11) {
					// 		discharge_status = 2
					// 	} else if (data2[i].objectstatuspulangfk == 2 || data2[i].objectstatuspulangfk == 8 || data2[i].objectstatuspulangfk == 3) {
					// 		discharge_status = 3
					// 	} else if (data2[i].objectstatuspulangfk == 9) {
					// 		discharge_status = 4
					// 		pemulasaraan_covid = 1
					// 	} else {
					// 		discharge_status = 5
					// 	}
					// 	if (jenis_rawat == 2) {
					// 		data2[i].nokelasdijamin = ''
					// 	}
					// 	var payor_id = '3'
					// 	var payor_cd = 'JKN'
					// 	var nomor_kartu = data2[i].nokepesertaan
					// 	var nomor_kartu_t = data2[i].noidentitas
					// 	if (data2[i].statuscovid === true) {
					// 		payor_id = '71'
					// 		payor_cd = 'COVID-19'
					// 		nomor_kartu = data2[i].noidentitas
					// 		nomor_kartu_t = 'nik'
					// 	} else if (data2[i].idrekanan == '2552') {
					// 		payor_id = '3'
					// 		payor_cd = 'JKN'
					// 	} else if (data2[i].idrekanan == '581164') {
					// 		payor_id = '5'
					// 		payor_cd = 'JAMKESDA'
					// 		data2[i].nosep = data2[i].nokepesertaan
					// 	}
					// 	dataRow = {
					// 		"nomor_sep": data2[i].nosep,    //"0901R001TEST0001",    
					// 		"nomor_kartu": nomor_kartu,//data2[i].nokepesertaan,    //"233333",    
					// 		"tgl_masuk": data2[i].tglregistrasi,    //"2017-11-20 12:55:00",    
					// 		"tgl_pulang": data2[i].tglpulang,    //"2017-12-01 09:55:00",    
					// 		"cara_masuk": caramasuk_inacbg,   
					// 		"jenis_rawat": jenis_rawat,    //"1",    
					// 		"kelas_rawat": data2[i].nokelasdijamin,    //"1",    
					// 		"adl_sub_acute": '',    //"15",    
					// 		"adl_chronic": '',    //"12",    
					// 		"icu_indikator": '',    //"1",    
					// 		"icu_los": '',    //"2",    
					// 		"ventilator_hour": '',    //"5",    
					// 		"ventilator": {
					// 			"use_ind": '', // parameter baru
					// 			"start_dttm": '', // parameter baru
					// 			"stop_dttm": '' // parameter baru
					// 		},
					// 		"upgrade_class_ind": upgrade_class_ind,    //"1",    
					// 		"upgrade_class_class": upgrade_class_class,    //"vip",    
					// 		"upgrade_class_los": '',    //"5",    
					// 		"upgrade_class_payor": upgrade_class_payor,
					// 		"add_payment_pct": '',    //"35",    
					// 		"birth_weight": '',    //"0",    
					// 		"sistole": data2[i].sistole,
 					// 		"diastole":data2[i].diastole,
					// 		"discharge_status": discharge_status,    //"1",    
					// 		"diagnosa": data2[i].icd10,    //"S71.0#A00.1",    
					// 		"procedure": data2[i].icd9 === false ? '' : data2[i].icd9,    //"81.52#88.38",    
					// 		"diagnosa_inagrouper": data2[i].icd10,
					// 		"procedure_inagrouper": data2[i].icd9 === false ? '' : data2[i].icd9,
					// 		"tarif_rs": {
					// 			"prosedur_non_bedah": data2[i].tarif_rs.prosedur_non_bedah,    //"300000",      
					// 			"prosedur_bedah": data2[i].tarif_rs.prosedur_bedah,    //"20000000",      
					// 			"konsultasi": data2[i].tarif_rs.konsultasi,    //"300000",      
					// 			"tenaga_ahli": data2[i].tarif_rs.tenaga_ahli,    //"200000",      
					// 			"keperawatan": data2[i].tarif_rs.keperawatan,    // "80000",      
					// 			"penunjang": data2[i].tarif_rs.penunjang,    //"1000000",      
					// 			"radiologi": data2[i].tarif_rs.radiologi,    //"500000",      
					// 			"laboratorium": data2[i].tarif_rs.laboratorium,    //"600000",      
					// 			"pelayanan_darah": data2[i].tarif_rs.pelayanan_darah,    //"150000",      
					// 			"rehabilitasi": data2[i].tarif_rs.rehabilitasi,    //"100000",      
					// 			"kamar": data2[i].tarif_rs.kamar,    //"6000000",      
					// 			"rawat_intensif": data2[i].tarif_rs.rawat_intensif,    //"2500000",      
					// 			"obat": data2[i].tarif_rs.obat,    //"2000000",      
					// 			"obat_kronis": data2[i].tarif_rs.obat_kronis,    //"2000000",      
					// 			"obat_kemoterapi": data2[i].tarif_rs.obat_kemoterapi,    //"2000000",      
					// 			"alkes": data2[i].tarif_rs.alkes,    //"500000",      
					// 			"bmhp": data2[i].tarif_rs.bmhp,    //"400000",      
					// 			"sewa_alat": data2[i].tarif_rs.sewa_alat,    //"210000"    
					// 		},
					// 		"pemulasaraan_jenazah": pemulasaraan_covid,
					// 		"kantong_jenazah": pemulasaraan_covid,
					// 		"peti_jenazah": pemulasaraan_covid,
					// 		"plastik_erat": pemulasaraan_covid,
					// 		"desinfektan_jenazah": pemulasaraan_covid,
					// 		"mobil_jenazah": pemulasaraan_covid,
					// 		"desinfektan_mobil_jenazah": pemulasaraan_covid,
					// 		"covid19_status_cd": data2[i].covid19_status_cd,
					// 		"nomor_kartu_t": nomor_kartu_t,//data2[i].noidentitas,
					// 		"episodes": data2[i].loscovid,//"1;12#2;3#6;5",
					// 		"covid19_cc_ind": data2[i].covid19_cc_ind,
					// 		"covid19_rs_darurat_ind": '',
					// 		"covid19_co_insidense_ind": '',
					// 		"covid19_penunjang_pengurang": {
					// 			"lab_asam_laktat": '',
					// 			"lab_procalcitonin": '',
					// 			"lab_crp": '',
					// 			"lab_kultur": '',
					// 			"lab_d_dimer": '',
					// 			"lab_pt": '',
					// 			"lab_aptt": '',
					// 			"lab_waktu_pendarahan": '',
					// 			"lab_anti_hiv": '',
					// 			"lab_analisa_gas": '',
					// 			"lab_albumin": '',
					// 			"rad_thorax_ap_pa": ''
					// 		},
					// 		"terapi_konvalesen": '',
					// 		"akses_naat": '',
					// 		"isoman_ind": '',
					// 		"bayi_lahir_status_cd": '',
					// 		"dializer_single_use": '', // parameter baru
					// 		"kantong_darah": '', // parameter baru
					// 		"apgar": {
					// 			"menit_1": {
					// 				"appearance": menit1_appear, // parameter baru
					// 				"pulse": menit1_pulse, // parameter baru
					// 				"grimace": menit1_grimace, // parameter baru
					// 				"activity": menit1_activity, // parameter baru
					// 				"respiration": menit1_resp // parameter baru
					// 			},
					// 			"menit_5": {
					// 				"appearance": menit5_appear, // parameter baru
					// 				"pulse": menit5_pulse, // parameter baru
					// 				"grimace": menit5_grimace, // parameter baru
					// 				"activity": menit5_activity, // parameter baru
					// 				"respiration": menit5_resp // parameter baru
					// 			}
					// 		},
					// 		"persalinan": {
					// 			"usia_kehamilan": '', // parameter baru
					// 			"gravida": '', // parameter baru
					// 			"partus": '', // parameter baru
					// 			"abortus": '', // parameter baru
					// 			"onset_kontraksi": '', // parameter baru
					// 			"delivery": [
					// 				{
					// 					"delivery_sequence": '', // parameter baru
					// 					"delivery_method": '', // parameter baru
					// 					"delivery_dttm": '', // parameter baru
					// 					"letak_janin": '', // parameter baru
					// 					"kondisi": '', // parameter baru
					// 					"use_manual": '', // parameter baru
					// 					"use_forcep": '', // parameter baru
					// 					"use_vacuum": '', // parameter baru
					// 				},
					// 				// {
					// 				// 	"delivery_sequence": "2",  // parameter baru jika lahir lebih dari satu bayi
					// 				// 	"delivery_method": "vaginal", // parameter baru jika lahir lebih dari satu bayi
					// 				// 	"delivery_dttm": "2023-01-21 17:03:49", // parameter baru jika lahir lebih dari satu bayi
					// 				// 	"letak_janin": "lintang", // parameter baru jika lahir lebih dari satu bayi
					// 				// 	"kondisi": "livebirth", // parameter baru jika lahir lebih dari satu bayi
					// 				// 	"use_manual": "1", // parameter baru jika lahir lebih dari satu bayi
					// 				// 	"use_forcep": "0", // parameter baru jika lahir lebih dari satu bayi
					// 				// 	"use_vacuum": "0" // parameter baru jika lahir lebih dari satu bayi
					// 				// }
					// 			]
					// 		},
					// 		"tarif_poli_eks": 0,    //"100000",    
					// 		"nama_dokter": data2[i].namadokter,    //"RUDY, DR",    
					// 		"kode_tarif": data2[i].kodetarif,    //'RSAB',    //"AP",    
					// 		"payor_id": payor_id,//'3',    //"3",    
					// 		"payor_cd": payor_cd,//'JKN',    //"JKN",    
					// 		"cob_cd": '#',    //"0001",    
					// 		"coder_nik": data2[i].codernik,    //"123123123123"  
					// 		"nomor_rm": data2[i].nocm,    //"123-45-28",
					// 		"nama_pasien": data2[i].namapasien,    //"Efan Andrian",
					// 		"tgl_lahir": data2[i].tgllahir,    //"1985-01-01 02:00:00",
					// 		"gender": data2[i].objectjeniskelaminfk ,   //"2",
					// 		"statusklaim": data2[i].statusklaim    //"2"
					// 	}
					// 	// dataRow = {
					// 	// 	"nomor_sep": data2[i].nosep,    //"0901R001TEST0001",    
					// 	// 	"nomor_kartu": data2[i].nokepesertaan,    //"233333",    
					// 	// 	"tgl_masuk": data2[i].tglregistrasi,    //"2017-11-20 12:55:00",    
					// 	// 	"tgl_pulang": data2[i].tglpulang,    //"2017-12-01 09:55:00",    
					// 	// 	"jenis_rawat": jenis_rawat,    //"1",    
					// 	// 	"kelas_rawat": data2[i].nokelasdijamin,    //"1",    
					// 	// 	"adl_sub_acute": '',    //"15",    
					// 	// 	"adl_chronic": '',    //"12",    
					// 	// 	"icu_indikator": '',    //"1",    
					// 	// 	"icu_los": '',    //"2",    
					// 	// 	"ventilator_hour": '',    //"5",    
					// 	// 	"upgrade_class_ind": upgrade_class_ind,    //"1",    
					// 	// 	"upgrade_class_class": upgrade_class_class,    //"vip",    
					// 	// 	"upgrade_class_los": '',    //"5",    
					// 	// 	"add_payment_pct": '',    //"35",    
					// 	// 	"birth_weight": '',    //"0",    
					// 	// 	"discharge_status": discharge_status,    //"1",    
					// 	// 	"diagnosa": data2[i].icd10,    //"S71.0#A00.1",    
					// 	// 	"procedure": data2[i].icd9,    //"81.52#88.38",    
					// 	// 	"tarif_rs": {
					// 	// 		"prosedur_non_bedah": data2[i].tarif_rs.prosedur_non_bedah,    //"300000",      
					// 	// 		"prosedur_bedah": data2[i].tarif_rs.prosedur_bedah,    //"20000000",      
					// 	// 		"konsultasi": data2[i].tarif_rs.konsultasi,    //"300000",      
					// 	// 		"tenaga_ahli": data2[i].tarif_rs.tenaga_ahli,    //"200000",      
					// 	// 		"keperawatan": data2[i].tarif_rs.keperawatan,    // "80000",      
					// 	// 		"penunjang": data2[i].tarif_rs.penunjang,    //"1000000",      
					// 	// 		"radiologi": data2[i].tarif_rs.radiologi,    //"500000",      
					// 	// 		"laboratorium": data2[i].tarif_rs.laboratorium,    //"600000",      
					// 	// 		"pelayanan_darah": data2[i].tarif_rs.pelayanan_darah,    //"150000",      
					// 	// 		"rehabilitasi": data2[i].tarif_rs.rehabilitasi,    //"100000",      
					// 	// 		"kamar": data2[i].tarif_rs.kamar,    //"6000000",      
					// 	// 		"rawat_intensif": data2[i].tarif_rs.rawat_intensif,    //"2500000",      
					// 	// 		"obat": data2[i].tarif_rs.obat,    //"2000000",      
					// 	// 		"obat_kronis": data2[i].tarif_rs.obat_kronis,    //"2000000",      
					// 	// 		"obat_kemoterapi": data2[i].tarif_rs.obat_kemoterapi,    //"2000000",      
					// 	// 		"alkes": data2[i].tarif_rs.alkes,    //"500000",      
					// 	// 		"bmhp": data2[i].tarif_rs.bmhp,    //"400000",      
					// 	// 		"sewa_alat": data2[i].tarif_rs.sewa_alat,    //"210000"    
					// 	// 	},
					// 	// 	"pemulasaraan_jenazah": pemulasaraan_covid,
					// 	// 	"kantong_jenazah": pemulasaraan_covid,
					// 	// 	"peti_jenazah": pemulasaraan_covid,
					// 	// 	"plastik_erat": pemulasaraan_covid,
					// 	// 	"desinfektan_jenazah": pemulasaraan_covid,
					// 	// 	"mobil_jenazah": pemulasaraan_covid,
					// 	// 	"desinfektan_mobil_jenazah": pemulasaraan_covid,
					// 	// 	"covid19_status_cd": data2[i].covid19_status_cd,
					// 	// 	"nomor_kartu_t": data2[i].noidentitas,
					// 	// 	"episodes": data2[i].loscovid,//"1;12#2;3#6;5",
					// 	// 	"covid19_cc_ind": data2[i].covid19_cc_ind,
					// 	// 	"tarif_poli_eks": 0,    //"100000",    
					// 	// 	"nama_dokter": data2[i].namadokter,    //"RUDY, DR",    
					// 	// 	"kode_tarif": data2[i].kodetarif,    //'RSAB',    //"AP",    
					// 	// 	"payor_id": payor_id,//'3',    //"3",    
					// 	// 	"payor_cd": payor_cd,//'JKN',    //"JKN",    
					// 	// 	"cob_cd": '#',    //"0001",    
					// 	// 	"coder_nik": data2[i].codernik,    //"123123123123"  
					// 	// 	"nomor_rm": data2[i].nocm,    //"123-45-28",
					// 	// 	"nama_pasien": data2[i].namapasien,    //"Efan Andrian",
					// 	// 	"tgl_lahir": data2[i].tgllahir,    //"1985-01-01 02:00:00",
					// 	// 	"gender": data2[i].objectjeniskelaminfk ,   //"2",
					// 	// 	"statusklaim": data2[i].statusklaim    //"2"
					// 	// }
					// 	dataSave.push(dataRow)
					// }
					// $scope.show_btn = true
					// for (var i = dataSave.length - 1; i >= 0; i--) {
					// 	if (dataSave[i].nosep == '') {
					// 		$scope.show_btn = false
					// 		break;
					// 	}
					// }


					//check data klaim
					// {
					// 	var dt1 ={}
					// 	var dt2 =[]
					// 	for (var i = dataSave.length - 1; i >= 0; i--) {
					// 		dt1 = {   
					// 			"metadata": {      
					// 				"method":"get_claim_data"   
					// 			},   
					// 			"data": {      
					// 				"nomor_sep": dataSave[i].nomor_sep
					// 			} 
					// 		} 
					// 		dt2.push(dt1)
					// 	}

					// 	var objData = {
					// 		  "data": dt2
					// 		}
					// 	manageTataRekening.savebridginginacbg(objData).then(function(e){
					// 		for (var i = 0; i < data2.length; i++) {
					// 			for (var i = 0; i < e.data.dataresponse.length; i++) {
					// 				if (e.data.dataresponse[i].datarequest.data.nomor_sep == data2[i].nosep) {
					// 					if (e.data.dataresponse[i].dataresponse.metadata.code == 200) {
					// 						data2[i].status = 'Send Claim'
					// 					}else{
					// 						data2[i].status = ''
					// 					}

					// 				}
					// 			}


							}
					$scope.dataDaftarPasienPulang = new kendo.data.DataSource({
						data: data[0].data,
						pageSize: 10,
						total: data[0].data,
						serverPaging: false,
						schema: {
							model: {
								fields: {
								}
							}
						}
					});
					// }) 
					// }
					//end //check data klaim


					//end Transpose
					var chacePeriode = tglAwal + "~" + tglAkhir;
					cacheHelper.set('DaftarRegistrasiPasienCtrl', chacePeriode);
				});

			};
			function loadData2() {
				$scope.isRouteLoading = true;
				var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm:ss');
				var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm:ss');


				if ($scope.item.kelompokpasien == undefined) {
					toastr.error('Kelompok harus di pilih',"info")
					return
				}
				var reg = ""
				if ($scope.item.noReg != undefined) {
					var reg = "&noreg=" + $scope.item.noReg
				}
				var sep = ""
				if ($scope.item.sep != undefined) {
					var sep = "&nosep=" + $scope.item.sep
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
				// var kp = ""
				// if ($scope.item.kelompokpasien != undefined) {
				// 	var kp = "&kelId=" + $scope.item.kelompokpasien.id
				// }
				var kp = ""
            
                if ($scope.item.kelompokpasien != undefined && $scope.item.kelompokpasien.length != 0) {
                    var a = ""
                    var b = ""
                    for (var i = $scope.item.kelompokpasien.length - 1; i >= 0; i--) {               
                        var c = $scope.item.kelompokpasien[i].id
                        b = "," + c
                        a = a + b
                    }
                    kp = a.slice(1, a.length)
				}
				if(kp != ""){
					kp = "&kelId=" + kp
				}
				var dk = ""
				if ($scope.item.dokter != undefined) {
					var dk = "&dokId=" + $scope.item.dokter.id
				}

				var jmlRows = "";
				if ($scope.item.jmlRows != undefined) {
					jmlRows = $scope.item.jmlRows
				}
				var status = "";
				if ($scope.item.status != undefined) {
					status = $scope.item.status.id
				}
				$q.all
				$q.all([
					medifirstService.get("bridging/inacbg/get-daftar-pasien-inacbg-rev-2?" +
						"tglAwal=" + tglAwal +
						"&tglAkhir=" + tglAkhir +
						reg + rm + sep + nm + ins + rg + kp + dk
						+ '&jmlRows=' + jmlRows
						+'&status='+status +'&param=2'),
				]).then(function (data) {
					$scope.isRouteLoading = false;
					data2 = data[0].data;
					// $scope.dataDaftarPasienPulang = new kendo.data.DataSource({
					//                    data: data[0].data,
					//                    pageSize: 10,
					//                    total:data[0].data,
					//                    serverPaging: false,
					//                    schema: {
					//                        model: {
					//                            fields: {
					//                            }
					//                        }
					//                    }
					//                });


					//Transpose
					dataSave = []
					for (var i = data2.length - 1; i >= 0; i--) {
						if(data2[i].statusklaim != null){
							for (var x = $scope.listStatus.length - 1; x >= 0; x--) {
								const elem =$scope.listStatus[x]
								if(elem.id == data2[i].statusklaim ){
									data2[i].statusklaim = elem.name
								}
							}
						}else{
							data2[i].statusklaim ='-'
						}

						// if (data2[i].deptid == 16) {
						// 	data2[i].tglpulang = data2[i].tglpulangresume
						// }
						coderNIK = data2[i].codernik
						var caramasuk_inacbg = data2[i].caramasuk_inacbg == null ? "other" : data2[i].caramasuk_inacbg;
						var menit1_appear = data2[i].menit1_appear == null ? "" : data2[i].menit1_appear;
						var menit1_pulse = data2[i].menit1_pulse == null ? "" : data2[i].menit1_pulse;
						var menit1_grimace = data2[i].menit1_grimace == null ? "" : data2[i].menit1_grimace;
						var menit1_activity = data2[i].menit1_activity == null ? "" : data2[i].menit1_activity;
						var menit1_resp = data2[i].menit1_resp == null ? "" : data2[i].menit1_resp;
						var menit5_appear = data2[i].menit5_appear == null ? "" : data2[i].menit5_appear;
						var menit5_pulse = data2[i].menit5_pulse == null ? "" : data2[i].menit5_pulse;
						var menit5_grimace = data2[i].menit5_grimace == null ? "" : data2[i].menit5_grimace;
						var menit5_activity = data2[i].menit5_activity == null ? "" : data2[i].menit5_activity;
						var menit5_resp = data2[i].menit5_resp == null ? "" : data2[i].menit5_resp;
						var jenis_rawat = data2[i].jenis_rawat //ranap
						// if (data2[i].deptid != 16) {
						// 	jenis_rawat = 2
						// }
						var upgrade_class_ind = 0
						var upgrade_class_class = ''
						var upgrade_class_payor = ''
						var add_payment_pct = 0
						if (data2[i].nokelasdijamin > data2[i].nokelasdaftar && data2[i].deptid == 16 && data2[i].namakelasdaftar != 'Non Kelas') {
							upgrade_class_ind = 1
							upgrade_class_class = data2[i].namakelasdaftar
							upgrade_class_payor = "peserta"
							add_payment_pct = 0
						}
						if (data2[i].namaruangan == 'NHCU' || data2[i].namaruangan == 'ICU' || data2[i].namaruangan == 'ICCU') {
							upgrade_class_ind = 0
						}
						if (data2[i].statustitipan == 1) {
							upgrade_class_ind = 0
							upgrade_class_class = ''
							add_payment_pct = 0
						}
						// if(data2[i].statusnaikkelas==1){
						// 	upgrade_class_ind = 1
						// 	upgrade_class_class = data2[i].kelastertinggi
						// 	add_payment_pct = 0
						// 	upgrade_class_los = data2[i].lamarawatnaikkelas
						// }
						var discharge_status = 0
						var pemulasaraan_covid = 0
						if (data2[i].objectstatuspulangfk == 1 || data2[i].objectstatuspulangfk == 6) {
							discharge_status = 1
						} else if (data2[i].objectstatuspulangfk == 4 || data2[i].objectstatuspulangfk == 5 || data2[i].objectstatuspulangfk == 10 ||
							data2[i].objectstatuspulangfk == 11) {
							discharge_status = 2
						} else if (data2[i].objectstatuspulangfk == 2 || data2[i].objectstatuspulangfk == 8 || data2[i].objectstatuspulangfk == 3) {
							discharge_status = 3
						} else if (data2[i].objectstatuspulangfk == 9) {
							discharge_status = 4
							pemulasaraan_covid = 1
						} else {
							discharge_status = 5
						}
						if (jenis_rawat == 2) {
							data2[i].nokelasdijamin = ''
						}
						var payor_id = '3'
						var payor_cd = 'JKN'
						var nomor_kartu = data2[i].nokepesertaan
						var nomor_kartu_t = data2[i].noidentitas
						if (data2[i].statuscovid === true) {
							payor_id = '71'
							payor_cd = 'COVID-19'
							nomor_kartu = data2[i].noidentitas
							nomor_kartu_t = 'nik'
						} else if (data2[i].idrekanan == '2552') {
							payor_id = '3'
							payor_cd = 'JKN'
						} else if (data2[i].idrekanan == '581164') {
							payor_id = '5'
							payor_cd = 'JAMKESDA'
							data2[i].nosep = data2[i].nokepesertaan
						}
						dataRow = {
							"nomor_sep": data2[i].nosep,    //"0901R001TEST0001",    
							"nomor_kartu": nomor_kartu,//data2[i].nokepesertaan,    //"233333",    
							"tgl_masuk": data2[i].tglregistrasi,    //"2017-11-20 12:55:00",    
							"tgl_pulang": data2[i].tglpulang,    //"2017-12-01 09:55:00",    
							"cara_masuk": caramasuk_inacbg,   
							"jenis_rawat": jenis_rawat,    //"1",    
							"kelas_rawat": data2[i].nokelasdijamin,    //"1",    
							"adl_sub_acute": '',    //"15",    
							"adl_chronic": '',    //"12",    
							"icu_indikator": '',    //"1",    
							"icu_los": '',    //"2",    
							"ventilator_hour": '',    //"5",    
							"ventilator": {
								"use_ind": '', // parameter baru
								"start_dttm": '', // parameter baru
								"stop_dttm": '' // parameter baru
							},
							"upgrade_class_ind": upgrade_class_ind,    //"1",    
							"upgrade_class_class": upgrade_class_class,    //"vip",    
							"upgrade_class_los": '',    //"5",    
							"upgrade_class_payor": upgrade_class_payor,
							"add_payment_pct": '',    //"35",    
							"birth_weight": '',    //"0",    
							"sistole": data2[i].sistole,
 							"diastole":data2[i].diastole,
							"discharge_status": discharge_status,    //"1",    
							"diagnosa": data2[i].icd10,    //"S71.0#A00.1",    
							"procedure": data2[i].icd9 === false ? '' : data2[i].icd9,    //"81.52#88.38",    
							"diagnosa_inagrouper": data2[i].icd10,
							"procedure_inagrouper": data2[i].icd9 === false ? '' : data2[i].icd9,
							"tarif_rs": {
								"prosedur_non_bedah": data2[i].tarif_rs.prosedur_non_bedah,    //"300000",      
								"prosedur_bedah": data2[i].tarif_rs.prosedur_bedah,    //"20000000",      
								"konsultasi": data2[i].tarif_rs.konsultasi,    //"300000",      
								"tenaga_ahli": data2[i].tarif_rs.tenaga_ahli,    //"200000",      
								"keperawatan": data2[i].tarif_rs.keperawatan,    // "80000",      
								"penunjang": data2[i].tarif_rs.penunjang,    //"1000000",      
								"radiologi": data2[i].tarif_rs.radiologi,    //"500000",      
								"laboratorium": data2[i].tarif_rs.laboratorium,    //"600000",      
								"pelayanan_darah": data2[i].tarif_rs.pelayanan_darah,    //"150000",      
								"rehabilitasi": data2[i].tarif_rs.rehabilitasi,    //"100000",      
								"kamar": data2[i].tarif_rs.kamar,    //"6000000",      
								"rawat_intensif": data2[i].tarif_rs.rawat_intensif,    //"2500000",      
								"obat": data2[i].tarif_rs.obat,    //"2000000",      
								"obat_kronis": data2[i].tarif_rs.obat_kronis,    //"2000000",      
								"obat_kemoterapi": data2[i].tarif_rs.obat_kemoterapi,    //"2000000",      
								"alkes": data2[i].tarif_rs.alkes,    //"500000",      
								"bmhp": data2[i].tarif_rs.bmhp,    //"400000",      
								"sewa_alat": data2[i].tarif_rs.sewa_alat,    //"210000"    
							},
							"pemulasaraan_jenazah": pemulasaraan_covid,
							"kantong_jenazah": pemulasaraan_covid,
							"peti_jenazah": pemulasaraan_covid,
							"plastik_erat": pemulasaraan_covid,
							"desinfektan_jenazah": pemulasaraan_covid,
							"mobil_jenazah": pemulasaraan_covid,
							"desinfektan_mobil_jenazah": pemulasaraan_covid,
							"covid19_status_cd": data2[i].covid19_status_cd,
							"nomor_kartu_t": nomor_kartu_t,//data2[i].noidentitas,
							"episodes": data2[i].loscovid,//"1;12#2;3#6;5",
							"covid19_cc_ind": data2[i].covid19_cc_ind,
							"covid19_rs_darurat_ind": '',
							"covid19_co_insidense_ind": '',
							"covid19_penunjang_pengurang": {
								"lab_asam_laktat": '',
								"lab_procalcitonin": '',
								"lab_crp": '',
								"lab_kultur": '',
								"lab_d_dimer": '',
								"lab_pt": '',
								"lab_aptt": '',
								"lab_waktu_pendarahan": '',
								"lab_anti_hiv": '',
								"lab_analisa_gas": '',
								"lab_albumin": '',
								"rad_thorax_ap_pa": ''
							},
							"terapi_konvalesen": '',
							"akses_naat": '',
							"isoman_ind": '',
							"bayi_lahir_status_cd": '',
							"dializer_single_use": '', // parameter baru
							"kantong_darah": '', // parameter baru
							"apgar": {
								"menit_1": {
									"appearance": menit1_appear, // parameter baru
									"pulse": menit1_pulse, // parameter baru
									"grimace": menit1_grimace, // parameter baru
									"activity": menit1_activity, // parameter baru
									"respiration": menit1_resp // parameter baru
								},
								"menit_5": {
									"appearance": menit5_appear, // parameter baru
									"pulse": menit5_pulse, // parameter baru
									"grimace": menit5_grimace, // parameter baru
									"activity": menit5_activity, // parameter baru
									"respiration": menit5_resp // parameter baru
								}
							},
							"persalinan": {
								"usia_kehamilan": '', // parameter baru
								"gravida": '', // parameter baru
								"partus": '', // parameter baru
								"abortus": '', // parameter baru
								"onset_kontraksi": '', // parameter baru
								"delivery": [
									{
										"delivery_sequence": '', // parameter baru
										"delivery_method": '', // parameter baru
										"delivery_dttm": '', // parameter baru
										"letak_janin": '', // parameter baru
										"kondisi": '', // parameter baru
										"use_manual": '', // parameter baru
										"use_forcep": '', // parameter baru
										"use_vacuum": '', // parameter baru
									},
									// {
									// 	"delivery_sequence": "2",  // parameter baru jika lahir lebih dari satu bayi
									// 	"delivery_method": "vaginal", // parameter baru jika lahir lebih dari satu bayi
									// 	"delivery_dttm": "2023-01-21 17:03:49", // parameter baru jika lahir lebih dari satu bayi
									// 	"letak_janin": "lintang", // parameter baru jika lahir lebih dari satu bayi
									// 	"kondisi": "livebirth", // parameter baru jika lahir lebih dari satu bayi
									// 	"use_manual": "1", // parameter baru jika lahir lebih dari satu bayi
									// 	"use_forcep": "0", // parameter baru jika lahir lebih dari satu bayi
									// 	"use_vacuum": "0" // parameter baru jika lahir lebih dari satu bayi
									// }
								]
							},
							"tarif_poli_eks": 0,    //"100000",    
							"nama_dokter": data2[i].namadokter,    //"RUDY, DR",    
							"kode_tarif": data2[i].kodetarif,    //'RSAB',    //"AP",    
							"payor_id": payor_id,//'3',    //"3",    
							"payor_cd": payor_cd,//'JKN',    //"JKN",    
							"cob_cd": '#',    //"0001",    
							"coder_nik": data2[i].codernik,    //"123123123123"  
							"nomor_rm": data2[i].nocm,    //"123-45-28",
							"nama_pasien": data2[i].namapasien,    //"Efan Andrian",
							"tgl_lahir": data2[i].tgllahir,    //"1985-01-01 02:00:00",
							"gender": data2[i].objectjeniskelaminfk ,   //"2",
							"statusklaim": data2[i].statusklaim    //"2"
						}
						// dataRow = {
						// 	"nomor_sep": data2[i].nosep,    //"0901R001TEST0001",    
						// 	"nomor_kartu": data2[i].nokepesertaan,    //"233333",    
						// 	"tgl_masuk": data2[i].tglregistrasi,    //"2017-11-20 12:55:00",    
						// 	"tgl_pulang": data2[i].tglpulang,    //"2017-12-01 09:55:00",    
						// 	"jenis_rawat": jenis_rawat,    //"1",    
						// 	"kelas_rawat": data2[i].nokelasdijamin,    //"1",    
						// 	"adl_sub_acute": '',    //"15",    
						// 	"adl_chronic": '',    //"12",    
						// 	"icu_indikator": '',    //"1",    
						// 	"icu_los": '',    //"2",    
						// 	"ventilator_hour": '',    //"5",    
						// 	"upgrade_class_ind": upgrade_class_ind,    //"1",    
						// 	"upgrade_class_class": upgrade_class_class,    //"vip",    
						// 	"upgrade_class_los": '',    //"5",    
						// 	"add_payment_pct": '',    //"35",    
						// 	"birth_weight": '',    //"0",    
						// 	"discharge_status": discharge_status,    //"1",    
						// 	"diagnosa": data2[i].icd10,    //"S71.0#A00.1",    
						// 	"procedure": data2[i].icd9,    //"81.52#88.38",    
						// 	"tarif_rs": {
						// 		"prosedur_non_bedah": data2[i].tarif_rs.prosedur_non_bedah,    //"300000",      
						// 		"prosedur_bedah": data2[i].tarif_rs.prosedur_bedah,    //"20000000",      
						// 		"konsultasi": data2[i].tarif_rs.konsultasi,    //"300000",      
						// 		"tenaga_ahli": data2[i].tarif_rs.tenaga_ahli,    //"200000",      
						// 		"keperawatan": data2[i].tarif_rs.keperawatan,    // "80000",      
						// 		"penunjang": data2[i].tarif_rs.penunjang,    //"1000000",      
						// 		"radiologi": data2[i].tarif_rs.radiologi,    //"500000",      
						// 		"laboratorium": data2[i].tarif_rs.laboratorium,    //"600000",      
						// 		"pelayanan_darah": data2[i].tarif_rs.pelayanan_darah,    //"150000",      
						// 		"rehabilitasi": data2[i].tarif_rs.rehabilitasi,    //"100000",      
						// 		"kamar": data2[i].tarif_rs.kamar,    //"6000000",      
						// 		"rawat_intensif": data2[i].tarif_rs.rawat_intensif,    //"2500000",      
						// 		"obat": data2[i].tarif_rs.obat,    //"2000000",      
						// 		"obat_kronis": data2[i].tarif_rs.obat_kronis,    //"2000000",      
						// 		"obat_kemoterapi": data2[i].tarif_rs.obat_kemoterapi,    //"2000000",      
						// 		"alkes": data2[i].tarif_rs.alkes,    //"500000",      
						// 		"bmhp": data2[i].tarif_rs.bmhp,    //"400000",      
						// 		"sewa_alat": data2[i].tarif_rs.sewa_alat,    //"210000"    
						// 	},
						// 	"pemulasaraan_jenazah": pemulasaraan_covid,
						// 	"kantong_jenazah": pemulasaraan_covid,
						// 	"peti_jenazah": pemulasaraan_covid,
						// 	"plastik_erat": pemulasaraan_covid,
						// 	"desinfektan_jenazah": pemulasaraan_covid,
						// 	"mobil_jenazah": pemulasaraan_covid,
						// 	"desinfektan_mobil_jenazah": pemulasaraan_covid,
						// 	"covid19_status_cd": data2[i].covid19_status_cd,
						// 	"nomor_kartu_t": data2[i].noidentitas,
						// 	"episodes": data2[i].loscovid,//"1;12#2;3#6;5",
						// 	"covid19_cc_ind": data2[i].covid19_cc_ind,
						// 	"tarif_poli_eks": 0,    //"100000",    
						// 	"nama_dokter": data2[i].namadokter,    //"RUDY, DR",    
						// 	"kode_tarif": data2[i].kodetarif,    //'RSAB',    //"AP",    
						// 	"payor_id": payor_id,//'3',    //"3",    
						// 	"payor_cd": payor_cd,//'JKN',    //"JKN",    
						// 	"cob_cd": '#',    //"0001",    
						// 	"coder_nik": data2[i].codernik,    //"123123123123"  
						// 	"nomor_rm": data2[i].nocm,    //"123-45-28",
						// 	"nama_pasien": data2[i].namapasien,    //"Efan Andrian",
						// 	"tgl_lahir": data2[i].tgllahir,    //"1985-01-01 02:00:00",
						// 	"gender": data2[i].objectjeniskelaminfk ,   //"2",
						// 	"statusklaim": data2[i].statusklaim    //"2"
						// }
						dataSave.push(dataRow)
					}
					$scope.show_btn = true
					for (var i = dataSave.length - 1; i >= 0; i--) {
						if (dataSave[i].nosep == '') {
							$scope.show_btn = false
							break;
						}
					}


					//check data klaim
					// {
					// 	var dt1 ={}
					// 	var dt2 =[]
					// 	for (var i = dataSave.length - 1; i >= 0; i--) {
					// 		dt1 = {   
					// 			"metadata": {      
					// 				"method":"get_claim_data"   
					// 			},   
					// 			"data": {      
					// 				"nomor_sep": dataSave[i].nomor_sep
					// 			} 
					// 		} 
					// 		dt2.push(dt1)
					// 	}

					// 	var objData = {
					// 		  "data": dt2
					// 		}
					// 	manageTataRekening.savebridginginacbg(objData).then(function(e){
					// 		for (var i = 0; i < data2.length; i++) {
					// 			for (var i = 0; i < e.data.dataresponse.length; i++) {
					// 				if (e.data.dataresponse[i].datarequest.data.nomor_sep == data2[i].nosep) {
					// 					if (e.data.dataresponse[i].dataresponse.metadata.code == 200) {
					// 						data2[i].status = 'Send Claim'
					// 					}else{
					// 						data2[i].status = ''
					// 					}

					// 				}
					// 			}


					// 		}
					// }) 
					// }
					//end //check data klaim


					//end Transpose
					var chacePeriode = tglAwal + "~" + tglAkhir;
					cacheHelper.set('DaftarRegistrasiPasienCtrl', chacePeriode);
				});

			};
			$scope.UbahDokter = function () {
				$scope.cboDokter = true
				$scope.cboUbahDokter = false
			}
			$scope.batal = function () {
				$scope.cboDokter = false
				$scope.cboUbahDokter = true
			}
			$scope.popupMasal = function () {
				$scope.sourceHasilRad = new kendo.data.DataSource({
					data: [],
					pageSize: 10
				});
				$scope.popUpMasal.center().open();
			}
			$scope.columnDaftarPasienPulangMasal = {
				toolbar: [
					"excel",

				],
				excel: {
					fileName: "DaftarRegistrasiPasien.xlsx",
					allPages: true,
				},
				excelExport: function (e) {
					var sheet = e.workbook.sheets[0];
					sheet.frozenRows = 2;
					sheet.mergedCells = ["A1:M1"];
					sheet.name = "Orders";

					var myHeaders = [{
						value: "Daftar Registrasi Pasien",
						fontSize: 20,
						textAlign: "center",
						background: "#ffffff",
						// color:"#ffffff"
					}];

					sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
				},
				selectable: 'row',
				pageable: true,
				dataBound: onDataBound,
				columns:
					[
						{
							"field": "tglregistrasi",
							"title": "Tgl Registrasi",
							"width": "7%",
							"template": "<span class='style-left'>{{formatTanggal('#: tglregistrasi #')}}</span>"
						},
						{
							"field": "noregistrasi",
							"title": "NoReg",
							"width": "7%"
						},
						{
							"field": "nocm",
							"title": "NoRM",
							"width": "7%",
							"template": "<span class='style-center'>#: nocm #</span>"
						},
						{
							"field": "namapasien",
							"title": "Nama Pasien",
							"width": "20%",
							"template": "<span class='style-left'>#: namapasien #</span>"
						},
						{
							"field": "namadokter",
							"title": "Nama Dokter",
							"width": "15%",
							"template": '# if( namadokter==null) {# - # } else {# #= namadokter # #} #'
						},
						{
							"field": "tglpulang",
							"title": "Tgl Pulang",
							"width": "10%",
							"template": "<span class='style-left'>{{formatTanggal('#: tglpulang #')}}</span>"
						},
						{
							"field": "nosep",
							"title": "No SEP",
							"width": "10%",
							"template": '# if( nosep==null) {# - # } else {# #= nosep # #} #'
						},
						{
							"field": "namakelas",
							"title": "Kelas Dijamin",
							"width": "9%",
							"template": '# if( namakelas==null) {# - # } else {# #= namakelas # #} #'
						}
						,
						{
							"field": "totalpiutangpenjamin",
							"title": "Total Grouping",
							"width": "10%"
						},
						{
							"field": "biayanaikkelas",
							"title": "Biaya Naik Kelas",
							"width": "10%"
						},
						{
							"field": "namakelasdaftar",
							"title": "Kelas Terakhir",
							"width": "10%"
						},
						{
							"field": "icd10",
							"title": "Diagnosa Utama dan Sekunder",
							"width": "10%"
						},
						{
							"field": "status",
							"title": "Status Berkas",
							"width": "10%"
						},
						{
							"field": "statusgrouping",
							"title": "Status Grouping",
							"width": "10%"
						}
					]
			};
			$scope.SearchEnter = function () {
				// if($scope.item.noRM.length==1){
				//     $scope.item.noRM="000000"+$scope.item.noRM
				// }else if($scope.item.noRM.length==2){
				//     $scope.item.noRM="00000"+$scope.item.noRM
				// }else if($scope.item.noRM.length==3){
				//     $scope.item.noRM="0000"+$scope.item.noRM
				// }else if($scope.item.noRM.length==4){
				//     $scope.item.noRM="000"+$scope.item.noRM
				// }else if($scope.item.noRM.length==5){
				//     $scope.item.noRM="00"+$scope.item.noRM
				// }else if($scope.item.noRM.length==6){
				//     $scope.item.noRM="0"+$scope.item.noRM
				// }
				loadData()
			}
			 $scope.$watch('item.searchMata', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    
                    var datad = []
                    for (let index = 0; index < data2.length; index++) {
                        let element = data2[index];
                        if (element.nosep.toLowerCase().match(newValue.toLowerCase())) {
                            datad.push(element)
                        }else if (element.namapasien.toLowerCase().match(newValue.toLowerCase())) {
                            datad.push(element)
                        }
                    }
                    $scope.dataDaftarPasienPulang = new kendo.data.DataSource({
						data: datad
                    });
                }
            });
			$scope.PasienPulang = function () {
				// debugger;
				if ($scope.dataPasienSelected.tglpulang != undefined) {
					window.messageContainer.error("Pasien Sudah Dipulangkan!!!");
					return;
				}
				if ($scope.dataPasienSelected == undefined) {
					toastr.error('Pilih Data Pasien dulu', 'Caution');
				} else {
					medifirstService.get('registrasi/get-norec-apd?noreg=' + $scope.dataPasienSelected.noRegistrasi
						+ '&ruangId=' + $scope.dataPasienSelected.ruanganid).then(function (e) {
							if (e.data.length > 0) {
								$state.go('PindahPulangPasien', {
									norecPD: $scope.dataPasienSelected.norec,
									norecAPD: e.data[0].norec_apd
								});
								var CachePindah = $scope.dataPasienSelected.ruanganid
								cacheHelper.set('CachePindah', CachePindah);
							}

						})

				}
				// var tglpulang = moment($scope.item.tanggalPulang).format('YYYY-MM-DD HH:mm:ss');
				// $scope.cbopasienpulang = true
				// $scope.cboUbahDokter=false
				// if ($scope.dataPasienSelected.tglpulang != null){
				// 	$scope.item.tanggalPulang=$scope.dataPasienSelected.tglpulang
				// }else{
				// 	$scope.item.tanggalPulang=tglpulang
				// }				
			}

			$scope.batalsimpantglpulang = function () {
				$scope.cbopasienpulang = false
				$scope.cboUbahDokter = true
			}

			$scope.groupingMasal = function () {
				var dt1 = {}
				var dt2 = []
				for (var i = dataSave.length - 1; i >= 0; i--) {
					dt1 = {
						"metadata": {
							"method": "new_claim"
						},
						"data": {
							"nomor_kartu": dataSave[i].nomor_kartu,
							"nomor_sep": dataSave[i].nomor_sep,
							"nomor_rm": dataSave[i].nomor_rm,
							"nama_pasien": dataSave[i].nama_pasien,
							"tgl_lahir": dataSave[i].tgl_lahir,
							"gender": dataSave[i].gender
						}
					}
					dt2.push(dt1)
				}

				var objData = {
					"data": dt2
				}
				medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
					// LoadData();
					var dt1 = {}
					var dt2 = []
					for (var i = dataSave.length - 1; i >= 0; i--) {

						dt1 = {
							"metadata": {
								"method": "set_claim_data",
								"nomor_sep": dataSave[i].nomor_sep
							},
							"data": {
								"nomor_sep": dataSave[i].nomor_sep,    //"0901R001TEST0001",    
								"nomor_kartu": dataSave[i].nomor_kartu,    //"233333",    
								"tgl_masuk": dataSave[i].tgl_masuk,    //"2017-11-20 12:55:00",    
								"tgl_pulang": dataSave[i].tgl_pulang,    //"2017-12-01 09:55:00",    
								"jenis_rawat": dataSave[i].jenis_rawat,    //"1",    
								"kelas_rawat": dataSave[i].kelas_rawat,    //ini adalah kelas tanggungan BPJS   
								"adl_sub_acute": dataSave[i].adl_sub_acute,    //"15",    
								"adl_chronic": dataSave[i].adl_chronic,    //"12",    
								"icu_indikator": dataSave[i].icu_indikator,    //"1",    
								"icu_los": dataSave[i].icu_los,    //"2",    
								"ventilator_hour": dataSave[i].ventilator_hour,    //"5",    
								"upgrade_class_ind": dataSave[i].upgrade_class_ind,    //"1",    
								"upgrade_class_class": dataSave[i].upgrade_class_class,    //"vip",    
								"upgrade_class_los": dataSave[i].upgrade_class_los,    //"5",    
								"add_payment_pct": dataSave[i].add_payment_pct,    //"35",    
								"birth_weight": dataSave[i].birth_weight,    //"0",    
								"discharge_status": dataSave[i].discharge_status,    //"1",    
								"diagnosa": dataSave[i].diagnosa,    //"S71.0#A00.1",    
								"procedure": dataSave[i].procedure,    //"81.52#88.38",    
								"tarif_rs": {
									"prosedur_non_bedah": dataSave[i].tarif_rs.prosedur_non_bedah,    //"300000",      
									"prosedur_bedah": dataSave[i].tarif_rs.prosedur_bedah,    //"20000000",      
									"konsultasi": dataSave[i].tarif_rs.konsultasi,    //"300000",      
									"tenaga_ahli": dataSave[i].tarif_rs.tenaga_ahli,    //"200000",      
									"keperawatan": dataSave[i].tarif_rs.keperawatan,    // "80000",      
									"penunjang": dataSave[i].tarif_rs.penunjang,    //"1000000",      
									"radiologi": dataSave[i].tarif_rs.radiologi,    //"500000",      
									"laboratorium": dataSave[i].tarif_rs.laboratorium,    //"600000",      
									"pelayanan_darah": dataSave[i].tarif_rs.pelayanan_darah,    //"150000",      
									"rehabilitasi": dataSave[i].tarif_rs.rehabilitasi,    //"100000",      
									"kamar": dataSave[i].tarif_rs.kamar,    //"6000000",      
									"rawat_intensif": dataSave[i].tarif_rs.rawat_intensif,    //"2500000",      
									"obat": dataSave[i].tarif_rs.obat,    //"2000000",  
									"obat_kronis": "0",
									"obat_kemoterapi": "0",
									"alkes": dataSave[i].tarif_rs.alkes,    //"500000",      
									"bmhp": dataSave[i].tarif_rs.bmhp,    //"400000",      
									"sewa_alat": dataSave[i].tarif_rs.sewa_alat,    //"210000"    
								},
								"tarif_poli_eks": dataSave[i].tarif_poli_eks,    //"100000",    
								"nama_dokter": dataSave[i].nama_dokter,    //"RUDY, DR",    
								"kode_tarif": dataSave[i].kode_tarif,    //"AP",    
								"payor_id": dataSave[i].payor_id,    //"3",    
								"payor_cd": dataSave[i].payor_cd,    //"JKN",    
								"cob_cd": dataSave[i].cob_cd,    //"0001",    
								"coder_nik": dataSave[i].coder_nik    //"123123123123"  
							}
						}
						dt2.push(dt1)

					}

					var objData = {
						"data": dt2
					}
					medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
						// LoadData();	
						var dt1 = {}
						var dt2 = []

						for (var i = dataSave.length - 1; i >= 0; i--) {
							dt1 = {
								"metadata": {
									"method": "grouper",
									"stage": "1"
								},
								"data": {
									"nomor_sep": dataSave[i].nomor_sep
								}
							}
							dt2.push(dt1)
						}



						var objData = {
							"data": dt2
						}
						medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
							var dt1 = {}
							var dt2 = []
							for (var i = dataSave.length - 1; i >= 0; i--) {
								dt1 = {
									"metadata": {
										"method": "claim_final"
									},
									"data": {
										"nomor_sep": dataSave[i].nomor_sep,
										"coder_nik": coderNIK,
									}
								}
								dt2.push(dt1)
							}

							var objData = {
								"data": dt2
							}
							medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {

							})
						})
					})

				})

			}

			$scope.new_claim = function () {
				var dt1 = {}
				var dt2 = []
				for (var i = dataSave.length - 1; i >= 0; i--) {
					dt1 = {
						"metadata": {
							"method": "new_claim"
						},
						"data": {
							"nomor_kartu": dataSave[i].nomor_kartu,
							"nomor_sep": dataSave[i].nomor_sep,
							"nomor_rm": dataSave[i].nomor_rm,
							"nama_pasien": dataSave[i].nama_pasien,
							"tgl_lahir": dataSave[i].tgl_lahir,
							"gender": dataSave[i].gender
						}
					}
					dt2.push(dt1)
				}

				var objData = {
					"data": dt2
				}
				medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
					// LoadData();				
				})
			}
			$scope.grouping2 = async function () {
				if ($scope.itemPopUp.status == 'unverifikasi') {
					toastr.info('Status Bilingan belum di Verifikasi!!!')
					return;
				}
				// var stt = 'false'
				// var covid19_status_cd = ''
				// var covid19_cc_ind = '0'
				// var covid19_rs_darurat_ind = '0'
				// var covid19_co_insidense_ind = '0'
				$scope.item.faktorpengurang = []
				if ($scope.itemPopUp.statuscovid === true) {
					if ($scope.itemPopUp.noidentitas == "") {
						toastr.info('NO IDENTITAS KOSONG!!!')
						return;
					}
					$scope.item.comorbid = "0"
					$scope.item.naat = "C"
					$scope.item.isman = "0"
					$scope.item.rsdarurat = "0"
					$scope.item.coinsiden = "0"
					
					$scope.popupPasienCovid.center().open();
					// if(confirm('Probabel Covid-19 ? ')) {
					// 	// Save it!
					// 	stt = 'true';
					// 	covid19_status_cd = 5
					// } else {
					// 	// Do nothing!
					// 	stt = 'false'
					// 	if(confirm('Suspek Covid-19 ? ')) {
					// 		// Save it!
					// 		stt = 'true';
					// 		covid19_status_cd = 4
					// 	} else {
					// 		// Do nothing!
					// 		stt = 'false'
					// 		if (confirm('Positif Covid-19 ? ')) {
					// 			// Save it!
					// 			stt = 'true';
					// 			covid19_status_cd = 3
					// 		} else {
					// 			// Do nothing!
					// 			stt = 'false'
					// 			if (confirm('PDP Covid-19 ? ')) {
					// 				// Save it!
					// 				stt = 'true';
					// 				covid19_status_cd = 2
					// 			} else {
					// 				// Do nothing!
					// 				stt = 'false'
					// 				if (confirm('ODP Covid-19 ? ')) {
					// 					// Save it!
					// 					stt = 'true';
					// 					covid19_status_cd = 1
					// 				} else {
					// 					// Do nothing!
					// 					stt = 'false'
					// 				}
					// 			}
					// 		}
					// 	}
					// }
					
					// if (covid19_status_cd == 0) {
					// 	toastr.error('JENIS PASIEN COVID BELUM DITENTUKAN', 'COVID-19');
					// 	return;
					// }

					// if (confirm('comorbidity/complexity ? ')) {
					// 	stt = 'true';
					// 	covid19_cc_ind = '1'
					// } else {
					// 	stt = 'false';
					// }

				} else {
					$scope.lanjutgrouping2();
				}
			}
			$scope.lanjutgrouping2 = async function () {
				// $scope.isRouteLoading = true;
				$scope.grupingtab = true
				if ($scope.itemPopUp.deptid != 16) {
					var dt1 = {}
					var dt2 = []
					

					var objData = {
						"data": dt2
					}
				await medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(async function (e) {
						var dt1 = {}
						var dt2 = []
						
						// for (var i = dataSave.length - 1; i >= 0; i--) {
						dt1 = {
							"metadata": {
								"method": "grouper",
								"stage": "1"
							},
							"data": {
								// "nomor_sep": dataSave[i].nomor_sep 
								"nomor_sep": $scope.itemPopUp.nomor_sep
							}
						}
						dt2.push(dt1)
						// }


						var objData = {
							"data": dt2
						}
						var totaldijamin = "";
						var hakkelas = "";
						var biayanaikkelas = "0";
					await	medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(async function (e) {
						$scope.isRouteLoading = false;
							// simpan response ke database
							// savelogging
							$scope.saveLogging('Grouping Klaim', 'No SEP Pasien', e.data.dataresponse[0].datarequest.data.nomor_sep,
							'Grouping Klaim ' + ' No Registrasi / No RM / No SEP : ' + $scope.itemPopUp.noregistrasi
								+ '/ ' +  $scope.itemPopUp.nocm + ' / '+  e.data.dataresponse[0].datarequest.data.nomor_sep +' Metadata : ' +  e.data.dataresponse[0].datarequest.metadata.method)

							responData = e.data.dataresponse;
							toastr.info(responData[0].dataresponse.metadata.message, 'INACBG');
							toastr.info(responData[0].dataresponse.response.cbg.description, 'INACBG');
							
							$scope.itemgrop= responData[0].dataresponse	
							// loadData()
							// var responOptions = responData[0].dataresponse.special_cmg_option
							// 		var spesialDrug = []
							// 		var specialProcedure = []
							// 		var specialProsthesis = []
							// 		var specialInvestigation = []
							// 		for (let i = 0; i < responOptions.length; i++) {
							// 			const element = responOptions[i];
							// 			if (element.type == 'Special Drug') {
							// 				spesialDrug.push(element)
							// 			}
							// 			if (element.type == 'Special Procedure') {
							// 				specialProcedure.push(element)
							// 			}
							// 			if (element.type == 'Special Prosthesis') {
							// 				specialProsthesis.push(element)
							// 			}
							// 			if (element.type == 'Special Investigation') {
							// 				specialInvestigation.push(element)
							// 			}
							// 		}
							// 		$scope.listspecialdrug = spesialDrug
							// 		$scope.listspecialprocedure = specialProcedure
							// 		$scope.listspecialprosthesis = specialProsthesis
							// 		$scope.listspecialinvestigation = specialInvestigation
									

									// dd($scope.itemgrop);
							//save status


							let response = e.data.dataresponse
							let arrStatus =[]
							for (var i = 0; i < response.length; i++) {
								const element = response[i]
								if(element.datarequest.metadata.method == 'grouper'
									 && element.dataresponse.metadata.code == 200  ){
									arrStatus.push(
										{
											nosep:element.datarequest.data.nomor_sep,
											statusklaim: element.datarequest.metadata.method 
										})
								}
							}
							if(arrStatus.length>0){

								for (var i = 0; i < data2.length; i++) {
									const elem = data2[i]
									for (var ii = 0; ii < arrStatus.length; ii++) {
										const elem2 = arrStatus[ii]
										if(elem.nosep == elem2.nosep){
											elem2.norec = elem.norec
										}
									}
								}

							await	medifirstService.post('bridging/inacbg/save-status', {'data':arrStatus}).then(async function (z) {
								$scope.isRouteLoading = false;
									
								})
								var dataSave = {
									'namapegawai': $scope.user.namaLengkap,
									'param': 'grouper',
									'norec': $scope.itemPopUp.norec
								}
							await	medifirstService.post('bridging/inacbg/save-pegawai', dataSave).then(async function (e) {
								})
							}
							//end status
							
							if (responData[0].dataresponse.response.cbg.description == "ERROR: MALE WITH GROUPING CRITERIA NOT MET") {
								toastr.info('JENIS KELAMIN SALAH ATAU DIAGNOSA TIDAK SESUAI JENIS KELAMIN', 'INACBG');
							}
							// if(dataSave[0].jenis_rawat==2){
							if ($scope.itemPopUp.deptid != 16) {
								totaldijamin = responData[0].dataresponse.response.cbg.tariff
							} else {
								hakkelas = responData[0].dataresponse.response.kelas
								if (hakkelas == "kelas_1") {
									totaldijamin = responData[0].dataresponse.tarif_alt[0].tarif_inacbg
								} else if (hakkelas == "kelas_2") {
									totaldijamin = responData[0].dataresponse.tarif_alt[1].tarif_inacbg
								} else if (hakkelas == "kelas_3") {
									totaldijamin = responData[0].dataresponse.tarif_alt[2].tarif_inacbg
								}
								if ($scope.itemPopUp.namakelas != $scope.itemPopUp.namakelasdaftar) {
									biayanaikkelas = responData[0].dataresponse.response.add_payment_amt
									if (biayanaikkelas < 0) {
										biayanaikkelas = 0
									}
								}
							}
							
							var dataproposi = {
								"noregistrasifk": $scope.itemPopUp.norec,
								"totalDijamin": totaldijamin,
								"biayaNaikkelas": biayanaikkelas,
								"response": responData[0].dataresponse,
							}
							await medifirstService.post('bridging/inacbg/save-proposi-bridging-inacbg', dataproposi).then(async function (e) {
								//ini untuk proposional kan utang per tindakan
							})
							loadData()
							if (responData[0].dataresponse.hasOwnProperty("special_cmg_option") == true && responData[0].dataresponse.special_cmg_option.length > 0) {
								toastr.info('Terdeteksi Top-up CMG Options')
								dataSEPCMG = responData[0].datarequest.data.nomor_sep
								var responOptions = responData[0].dataresponse.special_cmg_option
								var spesialDrug = []
								var specialProcedure = []
								var specialProsthesis = []
								var specialInvestigation = []
								for (let i = 0; i < responOptions.length; i++) {
									const element = responOptions[i];
									if (element.type == 'Special Drug') {
										spesialDrug.push(element)
									}
									if (element.type == 'Special Procedure') {
										specialProcedure.push(element)
									}
									if (element.type == 'Special Prosthesis') {
										specialProsthesis.push(element)
									}
									if (element.type == 'Special Investigation') {
										specialInvestigation.push(element)
									}
								}
								$scope.listspecialdrug = spesialDrug
								$scope.listspecialprocedure = specialProcedure
								$scope.listspecialprosthesis = specialProsthesis
								$scope.listspecialinvestigation = specialInvestigation
								$scope.itemgrop= responData[0].dataresponse
							}
						})

						$scope.isRouteLoading = false;
					})
				} else {
					var	datass =[{ noreg:  $scope.itemPopUp.norec,
								   namakelas:  $scope.itemPopUp.namakelas, 
								   nosep:  $scope.itemPopUp.nosep,
								   deptid:  $scope.itemPopUp.deptid }]
					await medifirstService.postNonMessage('bridging/inacbg/get-daftar-pasien-statusnaikkelas?noreg=' + $scope.itemPopUp.norec
						+ '&namakelas=' + $scope.itemPopUp.namakelas,{'data':datass}).then(async function (e) {
							var resp = e.data[0];
							var dt1 = {}
							var dt2 = []

							var objData = {
								"data": dt2
							}
							await medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(async function (e) {
								var dt1 = {}
								var dt2 = []
								
								// for (var i = dataSave.length - 1; i >= 0; i--) {
								dt1 = {
									"metadata": {
										"method": "grouper",
										"stage": "1"
									},
									"data": {
										// "nomor_sep": dataSave[i].nomor_sep 
										"nomor_sep": $scope.itemPopUp.nosep
									}
								}
								dt2.push(dt1)
								// }


								var objData = {
									"data": dt2
								}
								var totaldijamin = "";
								var hakkelas = "";
								var biayanaikkelas = "0";
								var top_up_jenazah = "";
							await	medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(async function (e) {
									// simpan response ke database
									$scope.saveLogging('Grouping Klaim', 'No SEP Pasien', e.data.dataresponse[0].datarequest.data.nomor_sep,
								'Grouping Klaim ' + ' No Registrasi / No RM / No SEP : ' + $scope.itemPopUp.noregistrasi
								+ '/ ' +  $scope.itemPopUp.nocm + ' / '+  e.data.dataresponse[0].datarequest.data.nomor_sep +' Metadata : ' +  e.data.dataresponse[0].datarequest.metadata.method)
									responData = e.data.dataresponse;
									toastr.info(responData[0].dataresponse.metadata.message, 'INACBG');
									toastr.info(responData[0].dataresponse.response.cbg.description, 'INACBG');
									$scope.itemgrop= responData[0].dataresponse	
									if (responData[0].dataresponse.hasOwnProperty("special_cmg_option") == true && responData[0].dataresponse.special_cmg_option.length > 0) {
									var responOptions = responData[0].dataresponse.special_cmg_option
									var spesialDrug = []
									var specialProcedure = []
									var specialProsthesis = []
									var specialInvestigation = []
									for (let i = 0; i < responOptions.length; i++) {
										const element = responOptions[i];
										if (element.type == 'Special Drug') {
											spesialDrug.push(element)
										}
										if (element.type == 'Special Procedure') {
											specialProcedure.push(element)
										}
										if (element.type == 'Special Prosthesis') {
											specialProsthesis.push(element)
										}
										if (element.type == 'Special Investigation') {
											specialInvestigation.push(element)
										}
									}
									$scope.listspecialdrug = spesialDrug
									$scope.listspecialprocedure = specialProcedure
									$scope.listspecialprosthesis = specialProsthesis
									$scope.listspecialinvestigation = specialInvestigation
									$scope.itemgrop= responData[0].dataresponse
									}
									// dd($scope.itemgrop);
									if (responData[0].dataresponse.response.cbg.description == "ERROR: MALE WITH GROUPING CRITERIA NOT MET") {
										toastr.info('JENIS KELAMIN SALAH ATAU DIAGNOSA TIDAK SESUAI JENIS KELAMIN', 'INACBG');
									}

									//save status
									let response = e.data.dataresponse
									let arrStatus =[]
									for (var i = 0; i < response.length; i++) {
										const element = response[i]
										if(element.datarequest.metadata.method == 'grouper'
											&& element.dataresponse.metadata.code == 200  ){
											arrStatus.push(
												{
													nosep:element.datarequest.data.nomor_sep,
													statusklaim: element.datarequest.metadata.method 
												})
										}
									}
									if(arrStatus.length>0){

										for (var i = 0; i < data2.length; i++) {
											const elem = data2[i]
											for (var ii = 0; ii < arrStatus.length; ii++) {
												const elem2 = arrStatus[ii]
												if(elem.nosep == elem2.nosep){
													elem2.norec = elem.norec
												}
											}
										}

									await	medifirstService.post('bridging/inacbg/save-status', {'data':arrStatus}).then(async function (z) {
											
										})
										var dataSave = {
											'namapegawai': $scope.user.namaLengkap,
											'param': 'grouper',
											'norec': $scope.itemPopUp.norec
										}
									await	medifirstService.post('bridging/inacbg/save-pegawai', dataSave).then(async function (e) {
										})
									}

									// if(dataSave[0].jenis_rawat==2){
									if ($scope.itemPopUp.deptid =! 16) {
										totaldijamin = responData[0].dataresponse.tarif_alt[2].tarif_inacbg
									} else if ($scope.itemPopUp.statuscovid === true) {
										if (responData[0].dataresponse.response.covid19_data.top_up_jenazah != 0) {
											top_up_jenazah = "";
										}
										// totaldijamin = top_up_jenazah + responData[0].dataresponse.response.covid19_data.top_up_rawat + responData[0].dataresponse.response.covid19_data.top_up_rawat_factor + responData[0].dataresponse.response.covid19_data.top_up_rawat_gross
										totaldijamin = responData[0].dataresponse.response.covid19_data.nilai_klaim
									} else {
										hakkelas = responData[0].dataresponse.response.kelas
										if (hakkelas == "kelas_1") {
											totaldijamin = responData[0].dataresponse.tarif_alt[0].tarif_inacbg
										} else if (hakkelas == "kelas_2") {
											totaldijamin = responData[0].dataresponse.tarif_alt[1].tarif_inacbg
										} else if (hakkelas == "kelas_3") {
											totaldijamin = responData[0].dataresponse.tarif_alt[2].tarif_inacbg
										}
										// if($scope.dataPasienSelected.namakelas!=$scope.dataPasienSelected.namakelasdaftar){
										if (resp.statusnaikkelas != '0') {
											biayanaikkelas = responData[0].dataresponse.response.add_payment_amt
											if (biayanaikkelas < 0) {
												biayanaikkelas = 0
											}
										}
									}
									var dataproposi = {
										"noregistrasifk": $scope.itemPopUp.norec,
										"totalDijamin": totaldijamin,
										"biayaNaikkelas": biayanaikkelas,
										"response": responData[0].dataresponse,
									}
									await medifirstService.post('bridging/inacbg/save-proposi-bridging-inacbg', dataproposi).then(async function (e) {
										//ini untuk proposional kan utang per tindakan
									})
									// if (responData[0].dataresponse.hasOwnProperty("special_cmg_option") == true && responData[0].dataresponse.special_cmg_option.length > 0) {
									// 	toastr.info('Terdeteksi Top-up CMG Options')
									// 	dataSEPCMG = responData[0].datarequest.data.nomor_sep
									// 	var responOptions = responData[0].dataresponse.special_cmg_option
									// 	var spesialDrug = []
									// 	var specialProcedure = []
									// 	var specialProsthesis = []
									// 	var specialInvestigation = []
									// 	for (let i = 0; i < responOptions.length; i++) {
									// 		const element = responOptions[i];
									// 		if (element.type == 'Special Drug') {
									// 			spesialDrug.push(element)
									// 		}
									// 		if (element.type == 'Special Procedure') {
									// 			specialProcedure.push(element)
									// 		}
									// 		if (element.type == 'Special Prosthesis') {
									// 			specialProsthesis.push(element)
									// 		}
									// 		if (element.type == 'Special Investigation') {
									// 			specialInvestigation.push(element)
									// 		}
									// 	}
									// 	$scope.listspecialdrug = spesialDrug
									// 	$scope.listspecialprocedure = specialProcedure
									// 	$scope.listspecialprosthesis = specialProsthesis
									// 	$scope.listspecialinvestigation = specialInvestigation
									// }
								})

								$scope.isRouteLoading = false;
							})

						})
				}


			}
			$scope.new_claim3 = async function () {

				$scope.isRouteLoading = true;
				var dt1 = {}
				var dt2 = []
					if($scope.itemPopUp.statusklaim== '-'){


					// if (dataSave[i].nomor_sep == $scope.dataPasienSelected.nosep) {
						dt1 = {
							"metadata": {
								"method": "new_claim"
							},
							"data": {
								"nomor_kartu": $scope.itemPopUp.nomor_kartu,
								"nomor_sep": $scope.itemPopUp.nomor_sep,
								"nomor_rm": $scope.itemPopUp.nocm,
								"nama_pasien": $scope.itemPopUp.namapasien,
								"tgl_lahir": $scope.itemPopUp.tgllahir,
								"gender": $scope.itemPopUp.objectjeniskelaminfk
							}
						}
						dt2.push(dt1)
					
					// }
				}

				var objData = {
					"data": dt2
				}
				
				await medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then( async function (e) {
					// LoadData();	
					// console.log(e)
					$scope.saveLogging('New Klaim', 'No SEP Pasien', $scope.itemPopUp.nomor_sep,
					'New Klaim ' + ' No Registrasi / No RM / No SEP : ' + $scope.itemPopUp.noregistrasi
					+ '/ ' +  $scope.itemPopUp.nocm + ' / '+ $scope.itemPopUp.nomor_sep +' Metadata : new_claim')
					let response = e.data.dataresponse
					let arrStatus =[]
					for (var i = 0; i < response.length; i++) {
						const element = response[i]
						if(element.datarequest.metadata.method == 'new_claim'
							 && element.dataresponse.metadata.code == 200  ){
							arrStatus.push(
								{
									nosep:element.datarequest.data.nomor_sep,
									statusklaim: element.datarequest.metadata.method 
								})
						} else {
							toastr.error(element.dataresponse.metadata.message)
						}
					}
					if(arrStatus.length>0){

						for (var i = 0; i < data2.length; i++) {
							const elem = data2[i]
							for (var ii = 0; ii < arrStatus.length; ii++) {
								const elem2 = arrStatus[ii]
								if(elem.nosep == elem2.nosep){
									elem2.norec = elem.norec
								}
							}
						}

						await medifirstService.post('bridging/inacbg/save-status', {'data':arrStatus}).then(  async function (z) {
							if (z.data.status == 201) {
								for (var x = $scope.listStatus.length - 1; x >= 0; x--) {
									const elem =$scope.listStatus[x]
									if(elem.id == z.data.data ){
										$scope.itemPopUp.statusklaim = elem.name
										$scope.updateDataByNorec($scope.itemPopUp.norec, "statusklaim", elem.name);
									}
								}
							}
						})
						var dataSave = {
							'namapegawai': $scope.user.namaLengkap,
							'param': 'kirim',
							'norec': $scope.itemPopUp.norec
						}
						await medifirstService.post('bridging/inacbg/save-pegawai', dataSave).then(async function (e) {
						})
					}
					await $scope.setdataklaim()
					// LoadData();	
					
					
					$scope.isRouteLoading = false;
				},function(error){

					$scope.isRouteLoading = false;
				},function(error){
					$scope.isRouteLoading = false;
				})
				// })
			}
			$scope.setdataklaim = async function () {
				if ($scope.itemPopUp.totalbiayars != $scope.totaltarif_rs16) {
					toastr.warning("Data Tarif yang akan dikirim belum sesuai dengan total tarif rs !");
					return;
				}
				// $scope.isRouteLoading = true;
				var dt1 = {}
				var dt2 = []
				var jenis_rawat = 1 //ranap
						if ($scope.itemPopUp.deptid != 16) {
							jenis_rawat = 2
						}
						var upgrade_class_ind = 0
						var upgrade_class_class = ''
						var add_payment_pct = 0

						if ($scope.itemPopUp.nokelasdijamin > $scope.itemPopUp.nokelasdaftar && $scope.itemPopUp.deptid == 16) {
							upgrade_class_ind = 1
							upgrade_class_class = $scope.itemPopUp.namakelasdaftar
							add_payment_pct = 0
						}
				var discharge_status = 0
						if ($scope.itemPopUp.objectstatuspulangfk == 1 || $scope.itemPopUp.objectstatuspulangfk == 6) {
							discharge_status = 1
						} else if ($scope.itemPopUp.objectstatuspulangfk == 4 || $scope.itemPopUp.objectstatuspulangfk == 5 || $scope.itemPopUp.objectstatuspulangfk == 10 ||
							$scope.itemPopUp.objectstatuspulangfk == 11) {
							discharge_status = 2
						} else if ($scope.itemPopUp.objectstatuspulangfk == 2 || $scope.itemPopUp.objectstatuspulangfk == 8 || $scope.itemPopUp.objectstatuspulangfk == 3) {
							discharge_status = 3
						} else if ($scope.itemPopUp.objectstatuspulangfk == 9) {
							discharge_status = 4
						} else {
							discharge_status = 5
						}
						if (jenis_rawat == 2) {
							$scope.itemPopUp.nokelasdijamin = ''
						}
						var payor_id = '3'
						var payor_cd = 'JKN'
						if ($scope.itemPopUp.idrekanan == '2552') {
							payor_id = '3'
							payor_cd = 'JKN'
						} else if ($scope.itemPopUp.idrekanan == '581164') {
							payor_id = '5'
							payor_cd = 'JAMKESDA'
							$scope.itemPopUp.nosep = $scope.itemPopUp.nokepesertaan
						}
				// manageTataRekening.savebridginginacbg(objData).then(function(e){
			
						if($scope.itemPopUp.nosep != '-'){
						dt1 = {
							"metadata": {
								"method": "set_claim_data",
								"nomor_sep": $scope.itemPopUp.nomor_sep
							},
							"data": {
								"nomor_sep": $scope.itemPopUp.nomor_sep,    //"0901R001TEST0001",    
								"nomor_kartu": $scope.itemPopUp.nomor_kartu,    //"233333",    
								"tgl_masuk": $scope.itemPopUp.tgl_masuk,    //"2017-11-20 12:55:00",    
								"tgl_pulang": $scope.itemPopUp.tgl_pulang,    //"2017-12-01 09:55:00",    
								"cara_masuk": $scope.itemPopUp.cara_masuk.id,   
								"jenis_rawat": $scope.itemPopUp.jenis_rawat,    //"1",    
								"kelas_rawat": $scope.itemPopUp.kelas_rawat == null || $scope.itemPopUp.kelas_rawat == '' ? $scope.itemPopUp.nokelasdijamin : $scope.itemPopUp.kelas_rawat ,    //"1",    
								"adl_sub_acute": $scope.itemPopUp.adl_sub_acute,    //"15",    
								"adl_chronic": $scope.itemPopUp.adl_chronic,    //"12",    
								"icu_indikator": $scope.itemPopUp.icu_indikator,    //"1",    
								"icu_los": $scope.itemPopUp.los,    //"2",    
								"ventilator_hour": $scope.itemPopUp.ventilator_hour ,    //"5",    
								"ventilator": {
									"use_ind": $scope.itemPopUp.use_ind,
									"start_dttm": moment($scope.itemPopUp.start_dttm).format('YYYY-MM-DD HH:mm:ss'),
									"stop_dttm":moment( $scope.itemPopUp.stop_dttm).format('YYYY-MM-DD HH:mm:ss'),
								},
								"upgrade_class_ind": $scope.itemPopUp.upgrade_class_ind,    //"1",    
								"upgrade_class_class": $scope.itemPopUp.upgrade_class_class,    //"vip",    
								"upgrade_class_los": $scope.itemPopUp.upgrade_class_los,    //"5",    
								"upgrade_class_payor": $scope.itemPopUp.upgrade_class_payor,
								"add_payment_pct": "75",//$scope.itemPopUp.add_payment_pct ,    //"35",    
								"birth_weight": $scope.itemPopUp.birth_weight == null? "0": $scope.itemPopUp.birth_weight ,//$scope.itemPopUp.beratbadan,//$scope.itemPopUp.birth_weight ,    //"0",    
								"sistole": $scope.itemPopUp.sistole,
								"diastole": $scope.itemPopUp.diastole, 
								"discharge_status": $scope.itemPopUp.discharge_status.id,    //"1",    
								// "diagnosa": $scope.itemPopUp.icd10 == null ? '#' : $scope.itemPopUp.icd10,    //"S71.0#A00.1",    
								// "procedure": $scope.itemPopUp.icd9 == null ? '#' : $scope.itemPopUp.icd9,    //"81.52#88.38",    
								// "diagnosa_inagrouper": $scope.itemPopUp.diagnosa_inagrouper == null ? '#' : $scope.itemPopUp.diagnosa_inagrouper,
								// "procedure_inagrouper": $scope.itemPopUp.procedure_inagrouper == null ? '#' : $scope.itemPopUp.procedure_inagrouper,
								"tarif_rs": {
									"prosedur_non_bedah": $scope.tarif_rs16.prosedur_non_bedah,    //"300000",      
									"prosedur_bedah": $scope.tarif_rs16.prosedur_bedah,    //"20000000",      
									"konsultasi": $scope.tarif_rs16.konsultasi,    //"300000",      
									"tenaga_ahli": $scope.tarif_rs16.tenaga_ahli,    //"200000",      
									"keperawatan": $scope.tarif_rs16.keperawatan,    // "80000",      
									"penunjang": $scope.tarif_rs16.penunjang,    //"1000000",      
									"radiologi": $scope.tarif_rs16.radiologi,    //"500000",      
									"laboratorium": $scope.tarif_rs16.laboratorium,    //"600000",      
									"pelayanan_darah": $scope.tarif_rs16.pelayanan_darah,    //"150000",      
									"rehabilitasi": $scope.tarif_rs16.rehabilitasi,    //"100000",      
									"kamar": $scope.tarif_rs16.kamar,    //"6000000",      
									"rawat_intensif": $scope.tarif_rs16.rawat_intensif,    //"2500000",      
									"obat": $scope.tarif_rs16.obat,    //"2000000",  
									"obat_kronis": $scope.tarif_rs16.obat_kronis,
									"obat_kemoterapi": $scope.tarif_rs16.obat_kemoterapi,
									"alkes": $scope.tarif_rs16.alkes,    //"500000",      
									"bmhp": $scope.tarif_rs16.bmhp,    //"400000",      
									"sewa_alat": $scope.tarif_rs16.sewa_alat,    //"210000"    
								},
								"pemulasaraan_jenazah": $scope.itemPopUp.pemulasaraan_jenazah,
								"kantong_jenazah": $scope.itemPopUp.kantong_jenazah,
								"peti_jenazah": $scope.itemPopUp.peti_jenazah,
								"plastik_erat": $scope.itemPopUp.plastik_erat,
								"desinfektan_jenazah": $scope.itemPopUp.desinfektan_jenazah,
								"mobil_jenazah":  $scope.itemPopUp.mobil_jenazah,
								"desinfektan_mobil_jenazah":  $scope.itemPopUp.desinfektan_mobil_jenazah,
								"covid19_status_cd": $scope.itemPopUp.covid19_status_cd,
								"nomor_kartu_t": $scope.itemPopUp.nomor_kartu_t,
								"episodes": $scope.itemPopUp.episodes,
								"covid19_cc_ind": $scope.itemPopUp.covid19_cc_ind,
								"covid19_rs_darurat_ind": $scope.itemPopUp.covid19_rs_darurat_ind,
								"covid19_co_insidense_ind": $scope.itemPopUp.covid19_co_insidense_ind,
								"covid19_penunjang_pengurang": {
									"lab_asam_laktat":$scope.itemPopUp.lab_asam_laktat,// $scope.itemPopUp.covid19_penunjang_pengurang.lab_asam_laktat,
									"lab_procalcitonin":$scope.itemPopUp.lab_procalcitonin,// $scope.itemPopUp.covid19_penunjang_pengurang.lab_procalcitonin,
									"lab_crp": $scope.itemPopUp.lab_crp,//$scope.dataPasienSelected.covid19_penunjang_pengurang.lab_crp,
									"lab_kultur": $scope.itemPopUp.lab_kultur,//$scope.dataPasienSelected.covid19_penunjang_pengurang.lab_kultur,
									"lab_d_dimer":$scope.itemPopUp.lab_d_dimer,// $scope.dataPasienSelected.covid19_penunjang_pengurang.lab_d_dimer,
									"lab_pt": $scope.itemPopUp.lab_pt,//$scope.dataPasienSelected.covid19_penunjang_pengurang.lab_pt,
									"lab_aptt": $scope.itemPopUp.lab_aptt,//$scope.dataPasienSelected.covid19_penunjang_pengurang.lab_aptt,
									"lab_waktu_pendarahan": $scope.itemPopUp.lab_waktu_pendarahan,//$scope.dataPasienSelected.covid19_penunjang_pengurang.lab_waktu_pendarahan,
									"lab_anti_hiv":$scope.itemPopUp.lab_anti_hiv,// $scope.dataPasienSelected.covid19_penunjang_pengurang.lab_anti_hiv,
									"lab_analisa_gas": $scope.itemPopUp.lab_analisa_gas,//$scope.dataPasienSelected.covid19_penunjang_pengurang.lab_analisa_gas,
									"lab_albumin": $scope.itemPopUp.lab_albumin,//$scope.dataPasienSelected.covid19_penunjang_pengurang.lab_albumin,
									"rad_thorax_ap_pa":$scope.itemPopUp.rad_thorax_ap_pa,// $scope.dataPasienSelected.covid19_penunjang_pengurang.rad_thorax_ap_pa
								},
								"terapi_konvalesen": $scope.itemPopUp.terapi_konvalesen,
								"akses_naat": $scope.itemPopUp.akses_naat,
								"isoman_ind": $scope.itemPopUp.isoman_ind,
								"bayi_lahir_status_cd": $scope.itemPopUp.bayi_lahir_status_cd,
								"dializer_single_use": $scope.itemPopUp.dializer_use,
								"kantong_darah": $scope.itemPopUp.kantong_darah,
								"apgar": {
									"menit_1": {
										"appearance":$scope.itemPopUp.apgar1mappear,//  $scope.dataPasienSelected.apgar.menit_1.appearance,
										"pulse": $scope.itemPopUp.apgar1mpulse,// $scope.dataPasienSelected.apgar.menit_1.pulse,
										"grimace":$scope.itemPopUp.apgar1mgrimace,// $scope.dataPasienSelected.apgar.menit_1.grimace,
										"activity": $scope.itemPopUp.apgar1mactivity,// $scope.dataPasienSelected.apgar.menit_1.activity,
										"respiration":$scope.itemPopUp.apgar1mresp,// $scope.dataPasienSelected.apgar.menit_1.respiration
									},
									"menit_5": {
										"appearance":$scope.itemPopUp.apgar5mappear,//  $scope.dataPasienSelected.apgar.menit_5.appearance,
										"pulse": $scope.itemPopUp.apgar5mpulse,// $scope.dataPasienSelected.apgar.menit_5.pulse,
										"grimace":$scope.itemPopUp.apgar5mgrimace,// $scope.dataPasienSelected.apgar.menit_5.grimace,
										"activity": $scope.itemPopUp.apgar5mactivity,// $scope.dataPasienSelected.apgar.menit_5.activity,
										"respiration":$scope.itemPopUp.apgar5mresp,// $scope.dataPasienSelected.apgar.menit_5.respiration
									}
								},
								"persalinan": {
									"usia_kehamilan":$scope.itemPopUp.usia_kehamilan,//  $scope.dataPasienSelected.persalinan.usia_kehamilan,
									"gravida": $scope.itemPopUp.gravida,// $scope.dataPasienSelected.persalinan.gravida,
									"partus": $scope.itemPopUp.partus,// $scope.dataPasienSelected.persalinan.partus,
									"abortus": $scope.itemPopUp.abortus,// $scope.dataPasienSelected.persalinan.abortus,
									"onset_kontraksi": $scope.itemPopUp.onset_kontraksi ==  undefined ? '': $scope.itemPopUp.onset_kontraksi.id,// $scope.dataPasienSelected.persalinan.onset_kontraksi,
									"delivery": [
										{
											"delivery_sequence": $scope.itemPopUp.delivery_sequence,// $scope.dataPasienSelected.persalinan.delivery.delivery_sequence,
											"delivery_method": $scope.itemPopUp.delivery_method,// $scope.dataPasienSelected.persalinan.delivery.delivery_method,
											"delivery_dttm": $scope.itemPopUp.delivery_dtm,//  $scope.dataPasienSelected.persalinan.delivery.delivery_dttm,
											"letak_janin": $scope.itemPopUp.letak_janin,//  $scope.dataPasienSelected.persalinan.delivery.letak_janin,
											"kondisi": $scope.itemPopUp.kondisi,// $scope.dataPasienSelected.persalinan.delivery.kondisi,
											"use_manual":$scope.itemPopUp.use_manual,//  $scope.dataPasienSelected.persalinan.delivery.use_manual,
											"use_forcep":$scope.itemPopUp.use_forcep,//  $scope.dataPasienSelected.persalinan.delivery.use_forcep,
											"use_vacuum": $scope.itemPopUp.use_vacuum,// $scope.dataPasienSelected.persalinan.delivery.use_vacuum
											"shk_spesimen_ambil": 0,// 
											"shk_lokasi": 0,// 
											"shk_spesimen_dttm": '2023-12-27 00:00:00'
										},
										// {
										// 	"delivery_sequence": "2",  // parameter baru jika lahir lebih dari satu bayi
										// 	"delivery_method": "vaginal", // parameter baru jika lahir lebih dari satu bayi
										// 	"delivery_dttm": "2023-01-21 17:03:49", // parameter baru jika lahir lebih dari satu bayi
										// 	"letak_janin": "lintang", // parameter baru jika lahir lebih dari satu bayi
										// 	"kondisi": "livebirth", // parameter baru jika lahir lebih dari satu bayi
										// 	"use_manual": "1", // parameter baru jika lahir lebih dari satu bayi
										// 	"use_forcep": "0", // parameter baru jika lahir lebih dari satu bayi
										// 	"use_vacuum": "0" // parameter baru jika lahir lebih dari satu bayi
										// }
									]
								},
								"tarif_poli_eks": 0,//$scope.dataPasienSelected.tarif_poli_eks,    //"100000",    
								"nama_dokter": $scope.itemPopUp.dpjp.namalengkap,    //"RUDY, DR",    
								"kode_tarif": $scope.itemPopUp.kode_tarif,    //"AP",    
								"payor_id": payor_id,    //"3",    
								"payor_cd": payor_cd,    //"JKN",    
								"cob_cd":'#',// $scope.dataPasienSelected.cob_cd,    //"0001",    
								"coder_nik": $scope.itemPopUp.codernik    //"123123123123"  
							}
							// "data": {
							// 	"nomor_sep": dataSave[i].nomor_sep,    //"0901R001TEST0001",    
							// 	"nomor_kartu": dataSave[i].nomor_kartu,    //"233333",    
							// 	"tgl_masuk": dataSave[i].tgl_masuk,    //"2017-11-20 12:55:00",    
							// 	"tgl_pulang": dataSave[i].tgl_pulang,    //"2017-12-01 09:55:00",    
							// 	"jenis_rawat": dataSave[i].jenis_rawat,    //"1",    
							// 	"kelas_rawat": dataSave[i].kelas_rawat,    //"1",    
							// 	"adl_sub_acute": dataSave[i].adl_sub_acute,    //"15",    
							// 	"adl_chronic": dataSave[i].adl_chronic,    //"12",    
							// 	"icu_indikator": dataSave[i].icu_indikator,    //"1",    
							// 	"icu_los": dataSave[i].icu_los,    //"2",    
							// 	"ventilator_hour": dataSave[i].ventilator_hour,    //"5",    
							// 	"upgrade_class_ind": dataSave[i].upgrade_class_ind,    //"1",    
							// 	"upgrade_class_class": dataSave[i].upgrade_class_class,    //"vip",    
							// 	"upgrade_class_los": dataSave[i].upgrade_class_los,    //"5",    
							// 	"add_payment_pct": "75",//dataSave[i].add_payment_pct ,    //"35",    
							// 	"birth_weight": dataSave[i].beratbadan == null? "0": dataSave[i].beratbadan ,//$scope.dataPasienSelected.beratbadan,//dataSave[i].birth_weight ,    //"0",    
							// 	"discharge_status": dataSave[i].discharge_status,    //"1",    
							// 	"diagnosa": dataSave[i].diagnosa,    //"S71.0#A00.1",    
							// 	"procedure": dataSave[i].procedure,    //"81.52#88.38",    
							// 	"tarif_rs": {
							// 		"prosedur_non_bedah": dataSave[i].tarif_rs.prosedur_non_bedah,    //"300000",      
							// 		"prosedur_bedah": dataSave[i].tarif_rs.prosedur_bedah,    //"20000000",      
							// 		"konsultasi": dataSave[i].tarif_rs.konsultasi,    //"300000",      
							// 		"tenaga_ahli": dataSave[i].tarif_rs.tenaga_ahli,    //"200000",      
							// 		"keperawatan": dataSave[i].tarif_rs.keperawatan,    // "80000",      
							// 		"penunjang": dataSave[i].tarif_rs.penunjang,    //"1000000",      
							// 		"radiologi": dataSave[i].tarif_rs.radiologi,    //"500000",      
							// 		"laboratorium": dataSave[i].tarif_rs.laboratorium,    //"600000",      
							// 		"pelayanan_darah": dataSave[i].tarif_rs.pelayanan_darah,    //"150000",      
							// 		"rehabilitasi": dataSave[i].tarif_rs.rehabilitasi,    //"100000",      
							// 		"kamar": dataSave[i].tarif_rs.kamar,    //"6000000",      
							// 		"rawat_intensif": dataSave[i].tarif_rs.rawat_intensif,    //"2500000",      
							// 		"obat": dataSave[i].tarif_rs.obat,    //"2000000",  
							// 		"obat_kronis": dataSave[i].tarif_rs.obat_kronis,
							// 		"obat_kemoterapi": dataSave[i].tarif_rs.obat_kemoterapi,
							// 		"alkes": dataSave[i].tarif_rs.alkes,    //"500000",      
							// 		"bmhp": dataSave[i].tarif_rs.bmhp,    //"400000",      
							// 		"sewa_alat": dataSave[i].tarif_rs.sewa_alat,    //"210000"    
							// 	},
							// 	"tarif_poli_eks": dataSave[i].tarif_poli_eks,    //"100000",    
							// 	"nama_dokter": dataSave[i].nama_dokter,    //"RUDY, DR",    
							// 	"kode_tarif": dataSave[i].kode_tarif,    //"AP",    
							// 	"payor_id": dataSave[i].payor_id,    //"3",    
							// 	"payor_cd": dataSave[i].payor_cd,    //"JKN",    
							// 	"cob_cd": dataSave[i].cob_cd,    //"0001",    
							// 	"coder_nik": dataSave[i].coder_nik    //"123123123123"  
							// }
						}
						dt2.push(dt1)
						// debugger
					// }
					}
				

				var objData = {
					"data": dt2
				}
				// debugger
				await medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(async function (e) {
					// LoadData();	
					// console.log(e)
					// save logging simpan klaim
					$scope.saveLogging('Simpan Klaim', 'No SEP Pasien', e.data.dataresponse[0].datarequest.metadata.nomor_sep,
					'Simpan Klaim ' + ' No Registrasi / No RM / No SEP : ' + $scope.itemPopUp.noregistrasi
					+ '/ ' +  $scope.itemPopUp.nocm+ ' / '+  e.data.dataresponse[0].datarequest.metadata.nomor_sep +' Metadata : ' +  e.data.dataresponse[0].datarequest.metadata.method)
					let response = e.data.dataresponse
					let arrStatus =[]
					for (var i = 0; i < response.length; i++) {
						const element = response[i]
						if(element.datarequest.metadata.method == 'new_claim'
							 && element.dataresponse.metadata.code == 200  ){
							arrStatus.push(
								{
									nosep:element.datarequest.data.nomor_sep,
									statusklaim: element.datarequest.metadata.method 
								})
						}
						if ( element.dataresponse.metadata.code == 400) {
							toastr.error( element.dataresponse.metadata.message)
						}
					}
					if(arrStatus.length>0){

						for (var i = 0; i < data2.length; i++) {
							const elem = data2[i]
							for (var ii = 0; ii < arrStatus.length; ii++) {
								const elem2 = arrStatus[ii]
								if(elem.nosep == elem2.nosep){
									elem2.norec = elem.norec
								}
							}
						}

						await medifirstService.post('bridging/inacbg/save-status', {'data':arrStatus}).then(async function (z) {
							if (z.data.status == 201) {
								for (var x = $scope.listStatus.length - 1; x >= 0; x--) {
									const elem =$scope.listStatus[x]
									if(elem.id == z.data.data ){
										$scope.itemPopUp.statusklaim = elem.name
										$scope.updateDataByNorec($scope.itemPopUp.norec, "statusklaim", elem.name);
									}
								}
							}	
						})
						
					}
					var dataSave = {
						'namapegawai': $scope.user.namaLengkap,
						'param': 'simpan',
						'norec': $scope.itemPopUp.norec,
						'dializer_use' : $scope.itemPopUp.dializer_use != undefined ? $scope.itemPopUp.dializer_use : null
					}
					await medifirstService.post('bridging/inacbg/save-pegawai', dataSave).then(async function (e) {
					})
					// LoadData();	
					
					
					$scope.isRouteLoading = false;
				},function(error){

					$scope.isRouteLoading = false;
				},function(error){
					$scope.isRouteLoading = false;
				})
				// })
			}
			$scope.new_claim2 = function () {

				$scope.isRouteLoading = true;
				var dt1 = {}
				var dt2 = []
				for (var i = dataSave.length - 1; i >= 0; i--) {
					if(dataSave[i].statusklaim== '-'){


					// if (dataSave[i].nomor_sep == $scope.dataPasienSelected.nosep) {
						dt1 = {
							"metadata": {
								"method": "new_claim"
							},
							"data": {
								"nomor_kartu": dataSave[i].nomor_kartu,
								"nomor_sep": dataSave[i].nomor_sep,
								"nomor_rm": dataSave[i].nomor_rm,
								"nama_pasien": dataSave[i].nama_pasien,
								"tgl_lahir": dataSave[i].tgl_lahir,
								"gender": dataSave[i].gender
							}
						}
						dt2.push(dt1)
					}
					// }
				}

				var objData = {
					"data": dt2
				}
				// manageTataRekening.savebridginginacbg(objData).then(function(e){
				for (var i = dataSave.length - 1; i >= 0; i--) {
					// if (dataSave[i].nomor_sep == $scope.dataPasienSelected.nosep) {
						if(dataSave[i].statusklaim == '-'){
						dt1 = {
							"metadata": {
								"method": "set_claim_data",
								"nomor_sep": dataSave[i].nomor_sep
							},
							"data": {
								"nomor_sep": dataSave[i].nomor_sep,    //"0901R001TEST0001",    
								"nomor_kartu": dataSave[i].nomor_kartu,    //"233333",    
								"tgl_masuk": dataSave[i].tgl_masuk,    //"2017-11-20 12:55:00",    
								"tgl_pulang": dataSave[i].tgl_pulang,    //"2017-12-01 09:55:00",    
								"cara_masuk": dataSave[i].cara_masuk,   
								"jenis_rawat": dataSave[i].jenis_rawat,    //"1",    
								"kelas_rawat": dataSave[i].kelas_rawat,    //"1",    
								"adl_sub_acute": dataSave[i].adl_sub_acute,    //"15",    
								"adl_chronic": dataSave[i].adl_chronic,    //"12",    
								"icu_indikator": dataSave[i].icu_indikator,    //"1",    
								"icu_los": dataSave[i].icu_los,    //"2",    
								"ventilator_hour": dataSave[i].ventilator_hour,    //"5",    
								"ventilator": {
									"use_ind": dataSave[i].ventilator.use_ind,
									"start_dttm": dataSave[i].ventilator.start_dttm,
									"stop_dttm": dataSave[i].ventilator.stop_dttm
								},
								"upgrade_class_ind": dataSave[i].upgrade_class_ind,    //"1",    
								"upgrade_class_class": dataSave[i].upgrade_class_class,    //"vip",    
								"upgrade_class_los": dataSave[i].upgrade_class_los,    //"5",    
								"upgrade_class_payor": dataSave[i].upgrade_class_payor,
								"add_payment_pct": "75",//dataSave[i].add_payment_pct ,    //"35",    
								"birth_weight": dataSave[i].beratbadan == null? "0": dataSave[i].beratbadan ,//$scope.dataPasienSelected.beratbadan,//dataSave[i].birth_weight ,    //"0",    
								"sistole": dataSave[i].sistole,
								"diastole": dataSave[i].diastole, 
								"discharge_status": dataSave[i].discharge_status,    //"1",    
								"diagnosa": dataSave[i].diagnosa,    //"S71.0#A00.1",    
								"procedure": dataSave[i].procedure,    //"81.52#88.38",    
								"diagnosa_inagrouper": dataSave[i].diagnosa_inagrouper,
								"procedure_inagrouper": dataSave[i].procedure_inagrouper,
								"tarif_rs": {
									"prosedur_non_bedah": dataSave[i].tarif_rs.prosedur_non_bedah,    //"300000",      
									"prosedur_bedah": dataSave[i].tarif_rs.prosedur_bedah,    //"20000000",      
									"konsultasi": dataSave[i].tarif_rs.konsultasi,    //"300000",      
									"tenaga_ahli": dataSave[i].tarif_rs.tenaga_ahli,    //"200000",      
									"keperawatan": dataSave[i].tarif_rs.keperawatan,    // "80000",      
									"penunjang": dataSave[i].tarif_rs.penunjang,    //"1000000",      
									"radiologi": dataSave[i].tarif_rs.radiologi,    //"500000",      
									"laboratorium": dataSave[i].tarif_rs.laboratorium,    //"600000",      
									"pelayanan_darah": dataSave[i].tarif_rs.pelayanan_darah,    //"150000",      
									"rehabilitasi": dataSave[i].tarif_rs.rehabilitasi,    //"100000",      
									"kamar": dataSave[i].tarif_rs.kamar,    //"6000000",      
									"rawat_intensif": dataSave[i].tarif_rs.rawat_intensif,    //"2500000",      
									"obat": dataSave[i].tarif_rs.obat,    //"2000000",  
									"obat_kronis": dataSave[i].tarif_rs.obat_kronis,
									"obat_kemoterapi": dataSave[i].tarif_rs.obat_kemoterapi,
									"alkes": dataSave[i].tarif_rs.alkes,    //"500000",      
									"bmhp": dataSave[i].tarif_rs.bmhp,    //"400000",      
									"sewa_alat": dataSave[i].tarif_rs.sewa_alat,    //"210000"    
								},
								"pemulasaraan_jenazah": dataSave[i].pemulasaraan_jenazah,
								"kantong_jenazah": dataSave[i].kantong_jenazah,
								"peti_jenazah": dataSave[i].peti_jenazah,
								"plastik_erat": dataSave[i].plastik_erat,
								"desinfektan_jenazah": dataSave[i].desinfektan_jenazah,
								"mobil_jenazah":  dataSave[i].mobil_jenazah,
								"desinfektan_mobil_jenazah":  dataSave[i].desinfektan_mobil_jenazah,
								"covid19_status_cd": dataSave[i].covid19_status_cd,
								"nomor_kartu_t": dataSave[i].nomor_kartu_t,
								"episodes": dataSave[i].episodes,
								"covid19_cc_ind": dataSave[i].covid19_cc_ind,
								"covid19_rs_darurat_ind": dataSave[i].covid19_rs_darurat_ind,
								"covid19_co_insidense_ind": dataSave[i].covid19_co_insidense_ind,
								"covid19_penunjang_pengurang": {
									"lab_asam_laktat": dataSave[i].covid19_penunjang_pengurang.lab_asam_laktat,
									"lab_procalcitonin": dataSave[i].covid19_penunjang_pengurang.lab_procalcitonin,
									"lab_crp": dataSave[i].covid19_penunjang_pengurang.lab_crp,
									"lab_kultur": dataSave[i].covid19_penunjang_pengurang.lab_kultur,
									"lab_d_dimer": dataSave[i].covid19_penunjang_pengurang.lab_d_dimer,
									"lab_pt": dataSave[i].covid19_penunjang_pengurang.lab_pt,
									"lab_aptt": dataSave[i].covid19_penunjang_pengurang.lab_aptt,
									"lab_waktu_pendarahan": dataSave[i].covid19_penunjang_pengurang.lab_waktu_pendarahan,
									"lab_anti_hiv": dataSave[i].covid19_penunjang_pengurang.lab_anti_hiv,
									"lab_analisa_gas": dataSave[i].covid19_penunjang_pengurang.lab_analisa_gas,
									"lab_albumin": dataSave[i].covid19_penunjang_pengurang.lab_albumin,
									"rad_thorax_ap_pa": dataSave[i].covid19_penunjang_pengurang.rad_thorax_ap_pa
								},
								"terapi_konvalesen": dataSave[i].terapi_konvalesen,
								"akses_naat": dataSave[i].akses_naat,
								"isoman_ind": dataSave[i].isoman_ind,
								"bayi_lahir_status_cd": dataSave[i].bayi_lahir_status_cd,
								"dializer_single_use": dataSave[i].dializer_single_use,
								"kantong_darah": dataSave[i].kantong_darah,
								"apgar": {
									"menit_1": {
										"appearance": dataSave[i].apgar.menit_1.appearance,
										"pulse": dataSave[i].apgar.menit_1.pulse,
										"grimace": dataSave[i].apgar.menit_1.grimace,
										"activity": dataSave[i].apgar.menit_1.activity,
										"respiration": dataSave[i].apgar.menit_1.respiration
									},
									"menit_5": {
										"appearance": dataSave[i].apgar.menit_5.appearance,
										"pulse": dataSave[i].apgar.menit_5.pulse,
										"grimace": dataSave[i].apgar.menit_5.grimace,
										"activity": dataSave[i].apgar.menit_5.activity,
										"respiration": dataSave[i].apgar.menit_5.respiration
									}
								},
								"persalinan": {
									"usia_kehamilan": dataSave[i].persalinan.usia_kehamilan,
									"gravida": dataSave[i].persalinan.gravida,
									"partus": dataSave[i].persalinan.partus,
									"abortus": dataSave[i].persalinan.abortus,
									"onset_kontraksi": dataSave[i].persalinan.onset_kontraksi,
									"delivery": [
										{
											"delivery_sequence": dataSave[i].persalinan.delivery.delivery_sequence,
											"delivery_method": dataSave[i].persalinan.delivery.delivery_method,
											"delivery_dttm": dataSave[i].persalinan.delivery.delivery_dttm,
											"letak_janin": dataSave[i].persalinan.delivery.letak_janin,
											"kondisi": dataSave[i].persalinan.delivery.kondisi,
											"use_manual": dataSave[i].persalinan.delivery.use_manual,
											"use_forcep": dataSave[i].persalinan.delivery.use_forcep,
											"use_vacuum": dataSave[i].persalinan.delivery.use_vacuum
										},
										// {
										// 	"delivery_sequence": "2",  // parameter baru jika lahir lebih dari satu bayi
										// 	"delivery_method": "vaginal", // parameter baru jika lahir lebih dari satu bayi
										// 	"delivery_dttm": "2023-01-21 17:03:49", // parameter baru jika lahir lebih dari satu bayi
										// 	"letak_janin": "lintang", // parameter baru jika lahir lebih dari satu bayi
										// 	"kondisi": "livebirth", // parameter baru jika lahir lebih dari satu bayi
										// 	"use_manual": "1", // parameter baru jika lahir lebih dari satu bayi
										// 	"use_forcep": "0", // parameter baru jika lahir lebih dari satu bayi
										// 	"use_vacuum": "0" // parameter baru jika lahir lebih dari satu bayi
										// }
									]
								},
								"tarif_poli_eks": dataSave[i].tarif_poli_eks,    //"100000",    
								"nama_dokter": dataSave[i].nama_dokter,    //"RUDY, DR",    
								"kode_tarif": dataSave[i].kode_tarif,    //"AP",    
								"payor_id": dataSave[i].payor_id,    //"3",    
								"payor_cd": dataSave[i].payor_cd,    //"JKN",    
								"cob_cd": dataSave[i].cob_cd,    //"0001",    
								"coder_nik": dataSave[i].coder_nik    //"123123123123"  
							}
							// "data": {
							// 	"nomor_sep": dataSave[i].nomor_sep,    //"0901R001TEST0001",    
							// 	"nomor_kartu": dataSave[i].nomor_kartu,    //"233333",    
							// 	"tgl_masuk": dataSave[i].tgl_masuk,    //"2017-11-20 12:55:00",    
							// 	"tgl_pulang": dataSave[i].tgl_pulang,    //"2017-12-01 09:55:00",    
							// 	"jenis_rawat": dataSave[i].jenis_rawat,    //"1",    
							// 	"kelas_rawat": dataSave[i].kelas_rawat,    //"1",    
							// 	"adl_sub_acute": dataSave[i].adl_sub_acute,    //"15",    
							// 	"adl_chronic": dataSave[i].adl_chronic,    //"12",    
							// 	"icu_indikator": dataSave[i].icu_indikator,    //"1",    
							// 	"icu_los": dataSave[i].icu_los,    //"2",    
							// 	"ventilator_hour": dataSave[i].ventilator_hour,    //"5",    
							// 	"upgrade_class_ind": dataSave[i].upgrade_class_ind,    //"1",    
							// 	"upgrade_class_class": dataSave[i].upgrade_class_class,    //"vip",    
							// 	"upgrade_class_los": dataSave[i].upgrade_class_los,    //"5",    
							// 	"add_payment_pct": "75",//dataSave[i].add_payment_pct ,    //"35",    
							// 	"birth_weight": dataSave[i].beratbadan == null? "0": dataSave[i].beratbadan ,//$scope.dataPasienSelected.beratbadan,//dataSave[i].birth_weight ,    //"0",    
							// 	"discharge_status": dataSave[i].discharge_status,    //"1",    
							// 	"diagnosa": dataSave[i].diagnosa,    //"S71.0#A00.1",    
							// 	"procedure": dataSave[i].procedure,    //"81.52#88.38",    
							// 	"tarif_rs": {
							// 		"prosedur_non_bedah": dataSave[i].tarif_rs.prosedur_non_bedah,    //"300000",      
							// 		"prosedur_bedah": dataSave[i].tarif_rs.prosedur_bedah,    //"20000000",      
							// 		"konsultasi": dataSave[i].tarif_rs.konsultasi,    //"300000",      
							// 		"tenaga_ahli": dataSave[i].tarif_rs.tenaga_ahli,    //"200000",      
							// 		"keperawatan": dataSave[i].tarif_rs.keperawatan,    // "80000",      
							// 		"penunjang": dataSave[i].tarif_rs.penunjang,    //"1000000",      
							// 		"radiologi": dataSave[i].tarif_rs.radiologi,    //"500000",      
							// 		"laboratorium": dataSave[i].tarif_rs.laboratorium,    //"600000",      
							// 		"pelayanan_darah": dataSave[i].tarif_rs.pelayanan_darah,    //"150000",      
							// 		"rehabilitasi": dataSave[i].tarif_rs.rehabilitasi,    //"100000",      
							// 		"kamar": dataSave[i].tarif_rs.kamar,    //"6000000",      
							// 		"rawat_intensif": dataSave[i].tarif_rs.rawat_intensif,    //"2500000",      
							// 		"obat": dataSave[i].tarif_rs.obat,    //"2000000",  
							// 		"obat_kronis": dataSave[i].tarif_rs.obat_kronis,
							// 		"obat_kemoterapi": dataSave[i].tarif_rs.obat_kemoterapi,
							// 		"alkes": dataSave[i].tarif_rs.alkes,    //"500000",      
							// 		"bmhp": dataSave[i].tarif_rs.bmhp,    //"400000",      
							// 		"sewa_alat": dataSave[i].tarif_rs.sewa_alat,    //"210000"    
							// 	},
							// 	"tarif_poli_eks": dataSave[i].tarif_poli_eks,    //"100000",    
							// 	"nama_dokter": dataSave[i].nama_dokter,    //"RUDY, DR",    
							// 	"kode_tarif": dataSave[i].kode_tarif,    //"AP",    
							// 	"payor_id": dataSave[i].payor_id,    //"3",    
							// 	"payor_cd": dataSave[i].payor_cd,    //"JKN",    
							// 	"cob_cd": dataSave[i].cob_cd,    //"0001",    
							// 	"coder_nik": dataSave[i].coder_nik    //"123123123123"  
							// }
						}
						dt2.push(dt1)
					// }
					}
				}

				var objData = {
					"data": dt2
				}
				medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
					// LoadData();	
					// console.log(e)
					let response = e.data.dataresponse
					let arrStatus =[]
					for (var i = 0; i < response.length; i++) {
						const element = response[i]
						if(element.datarequest.metadata.method == 'new_claim'
							 && element.dataresponse.metadata.code == 200  ){
							arrStatus.push(
								{
									nosep:element.datarequest.data.nomor_sep,
									statusklaim: element.datarequest.metadata.method 
								})
						}
					}
					if(arrStatus.length>0){

						for (var i = 0; i < data2.length; i++) {
							const elem = data2[i]
							for (var ii = 0; ii < arrStatus.length; ii++) {
								const elem2 = arrStatus[ii]
								if(elem.nosep == elem2.nosep){
									elem2.norec = elem.norec
								}
							}
						}

						medifirstService.post('bridging/inacbg/save-status', {'data':arrStatus}).then(function (z) {
							loadData()
						})
					}
					// LoadData();	
					
					
					$scope.isRouteLoading = false;
				},function(error){

					$scope.isRouteLoading = false;
				},function(error){
					$scope.isRouteLoading = false;
				})
				// })
			}
			$scope.finalprintklaim = function () {
				var dt1 = {}
				var dt2 = []
				// for (var i = dataSave.length - 1; i >= 0; i--) {
				dt1 = {
					"metadata": {
						"method": "claim_final"
					},
					"data": {
						"nomor_sep": $scope.dataPasienSelected.nosep,//dataSave[i].nomor_sep,      
						"coder_nik": coderNIK,
					}
				}
				dt2.push(dt1)
				// }

				var objData = {
					"data": dt2
				}
				medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
					var dt1 = {}
					var dt2 = []
					// for (var i = dataSave.length - 1; i >= 0; i--) {
					dt1 = {
						"metadata": {
							"method": "send_claim_individual"
						},
						"data": {
							"nomor_sep": $scope.dataPasienSelected.nosep
						}
					}
					dt2.push(dt1)
					// }

					var objData = {
						"data": dt2
					}
					medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
						// response simpan ke database	
						responData = e.data.dataresponse;
						toastr.info(responData[0].dataresponse.metadata.message, 'INACBG');
					})

					// response oke saja
					var dt1 = {}
					var dt2 = []
					// for (var i = dataSave.length - 1; i >= 0; i--) {
					dt1 = {
						"metadata": {
							"method": "claim_print"
						},
						"data": {
							"nomor_sep": $scope.dataPasienSelected.nosep
						}
					}
					dt2.push(dt1)
					// }

					var objData = {
						"data": dt2
					}
					medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
						// response simpan ke database	
						responData = e.data.dataresponse;
						if (responData[0].dataresponse.metadata.code == 200) {

							const linkSource = 'data:application/pdf;base64,' + responData[0].dataresponse.data;
							const downloadLink = document.createElement("a");
							var tglprint = moment($scope.now).format('YYYY-MM-DD');
							const fileName = "claim_print_" + responData[0].datarequest.data.nomor_sep + "_" + tglprint + ".pdf";

							downloadLink.href = linkSource;
							downloadLink.download = fileName;
							downloadLink.click();
						}

						manageTataRekening.saveVerifikasiTagihanInacbg($scope.dataPasienSelected)
							.then(function (e) {


							});
						// window.open('data:application/pdf;base64,' + responData[0].dataresponse.data);
						toastr.info(responData[0].dataresponse.metadata.message, 'INACBG');
					})
				})
			}
			$scope.editKlaimm = function () {
				var dt1 = {}
				var dt2 = []
				// for (var i = dataSave.length - 1; i >= 0; i--) {
					dt1 = {
						"metadata": {
							"method": "reedit_claim"
						},
						"data": {
							"nomor_sep": $scope.dataPasienSelected.nosep,
						}
					}
					dt2.push(dt1)
				// }

				var objData = {
					"data": dt2
				}
				medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
					// response oke saja
					responData = e.data.dataresponse;
					toastr.info(responData[0].dataresponse.metadata.message, 'INACBG');
					
				})

				
				
			}
			$scope.listStatusCovid19 = [{ id: 1, name: 'ODP Covid-19' }
				, { id: 2, name: 'PDP Covid-19' }
				, { id: 3, name: 'Positif Covid-19' }
				, { id: 4, name: 'Suspek Covid-19' }
				, { id: 5, name: 'Probabel Covid-19' }]
			$scope.listComorbid = [{ id: 1, name: 'Ada' }
				, { id: 0, name: 'Tidak Ada' }]
			$scope.listnaat = [{ id: "A", name: 'Kriteria A ' }
				, { id: "B", name: 'Kriteria B' }
				, { id: "C", name: 'Kriteria C' }]
			$scope.listisman = [{ id: 1, name: 'Ya' }
				, { id: 0, name: 'Tidak' }]
			$scope.listRsDarurat = [{ id: 1, name: 'Ya' }
				, { id: 0, name: 'Tidak' }]
			$scope.listCoinsiden = [{ id: 1, name: 'Ya' }
				, { id: 0, name: 'Tidak' }]
			$scope.listFaktorPengurang = [{ id: 1, name: 'Asam Laktat' }
				, { id: 2, name: 'Procalcitonin' }
				, { id: 3, name: 'CRP' }
				, { id: 4, name: 'Kultur MO (aerob) dengan resistansi' }
				, { id: 5, name: 'D Dimer' }
				, { id: 6, name: 'PT' }
				, { id: 7, name: 'APTT' }
				, { id: 8, name: 'Waktu Pendarahan' }
				, { id: 9, name: 'Anti HIV' }
				, { id: 10, name: 'Analisa Gas' }
				, { id: 11, name: 'Albumin' }
				, { id: 12, name: 'Thorax AP / PA' }]

			var covid19_status_cd = ''
			var covid19_cc_ind = '0'
			var covid19_rs_darurat_ind = '0'
			var covid19_co_insidense_ind = '0'
			var isoman_ind = '0'
			var akses_naat = 'C'
			var faktorpengurang = []
			$scope.simpanfaktorpengurang = function () {
				if ($scope.item.statuscovid19 == undefined) {
					toastr.error('JENIS PASIEN COVID BELUM DITENTUKAN', 'COVID-19');
					return;
				}
				covid19_status_cd = $scope.item.statuscovid19
				covid19_cc_ind = $scope.item.comorbid
				covid19_rs_darurat_ind = $scope.item.rsdarurat
				covid19_co_insidense_ind = $scope.item.coinsiden
				isoman_ind = $scope.item.isman
				akses_naat = $scope.item.naat
				for (let i = 0; i < $scope.listFaktorPengurang.length; i++) {
					if($scope.item.faktorpengurang[i + 1]) {
						faktorpengurang.push({ id: $scope.listFaktorPengurang[i].id, name: $scope.listFaktorPengurang[i].name, value: "1" })
					} else {
						faktorpengurang.push({ id: $scope.listFaktorPengurang[i].id, name: $scope.listFaktorPengurang[i].name, value: "0" })
					}
				}
				$scope.lanjutgrouping();
				$scope.popupPasienCovid.close();
			}

			$scope.grouping = function () {
				if ($scope.dataPasienSelected.status == 'unverifikasi') {
					toastr.info('Status Bilingan belum di Verifikasi!!!')
					return;
				}
				// var stt = 'false'
				// var covid19_status_cd = ''
				// var covid19_cc_ind = '0'
				// var covid19_rs_darurat_ind = '0'
				// var covid19_co_insidense_ind = '0'
				$scope.item.faktorpengurang = []
				if ($scope.dataPasienSelected.statuscovid === true) {
					if ($scope.dataPasienSelected.noidentitas == "") {
						toastr.info('NO IDENTITAS KOSONG!!!')
						return;
					}
					$scope.item.comorbid = "0"
					$scope.item.naat = "C"
					$scope.item.isman = "0"
					$scope.item.rsdarurat = "0"
					$scope.item.coinsiden = "0"
					
					$scope.popupPasienCovid.center().open();
					// if(confirm('Probabel Covid-19 ? ')) {
					// 	// Save it!
					// 	stt = 'true';
					// 	covid19_status_cd = 5
					// } else {
					// 	// Do nothing!
					// 	stt = 'false'
					// 	if(confirm('Suspek Covid-19 ? ')) {
					// 		// Save it!
					// 		stt = 'true';
					// 		covid19_status_cd = 4
					// 	} else {
					// 		// Do nothing!
					// 		stt = 'false'
					// 		if (confirm('Positif Covid-19 ? ')) {
					// 			// Save it!
					// 			stt = 'true';
					// 			covid19_status_cd = 3
					// 		} else {
					// 			// Do nothing!
					// 			stt = 'false'
					// 			if (confirm('PDP Covid-19 ? ')) {
					// 				// Save it!
					// 				stt = 'true';
					// 				covid19_status_cd = 2
					// 			} else {
					// 				// Do nothing!
					// 				stt = 'false'
					// 				if (confirm('ODP Covid-19 ? ')) {
					// 					// Save it!
					// 					stt = 'true';
					// 					covid19_status_cd = 1
					// 				} else {
					// 					// Do nothing!
					// 					stt = 'false'
					// 				}
					// 			}
					// 		}
					// 	}
					// }
					
					// if (covid19_status_cd == 0) {
					// 	toastr.error('JENIS PASIEN COVID BELUM DITENTUKAN', 'COVID-19');
					// 	return;
					// }

					// if (confirm('comorbidity/complexity ? ')) {
					// 	stt = 'true';
					// 	covid19_cc_ind = '1'
					// } else {
					// 	stt = 'false';
					// }

				} else {
					$scope.lanjutgrouping();
				}
			}
			$scope.lanjutgrouping = function () {
				$scope.isRouteLoading = true;
				if ($scope.itemPopUp.deptid != 16) {
					var dt1 = {}
					var dt2 = []
					// for (var i = dataSave.length - 1; i >= 0; i--) {
					// 	if (dataSave[i].nomor_sep == $scope.dataPasienSelected.nosep) {
					// 		dt1 = {
					// 			"metadata": {
					// 				"method": "new_claim"
					// 			},
					// 			"data": {
					// 				"nomor_kartu": dataSave[i].nomor_kartu,
					// 				"nomor_sep": dataSave[i].nomor_sep,
					// 				"nomor_rm": dataSave[i].nomor_rm,
					// 				"nama_pasien": dataSave[i].nama_pasien,
					// 				"tgl_lahir": dataSave[i].tgl_lahir,
					// 				"gender": dataSave[i].gender
					// 			}
					// 		}
					// 		dt2.push(dt1)
					// 	}
					// }

					// var objData = {
					// 	"data": dt2
					// }
					// manageTataRekening.savebridginginacbg(objData).then(function(e){
					for (var i = dataSave.length - 1; i >= 0; i--) {
						if (dataSave[i].nomor_sep == $scope.itemPopUp.nosep) {
							dt1 = {
								"metadata": {
									"method": "set_claim_data",
									"nomor_sep": dataSave[i].nomor_sep
								},
								"data": {
									"nomor_sep": dataSave[i].nomor_sep,    //"0901R001TEST0001",    
									"nomor_kartu": dataSave[i].nomor_kartu,    //"233333",    
									"tgl_masuk": dataSave[i].tgl_masuk,    //"2017-11-20 12:55:00",    
									"tgl_pulang": dataSave[i].tgl_pulang,    //"2017-12-01 09:55:00",    
									"cara_masuk": dataSave[i].cara_masuk,   
									"jenis_rawat": dataSave[i].jenis_rawat,    //"1",    
									"kelas_rawat": dataSave[i].kelas_rawat,    //"1",    
									"adl_sub_acute": dataSave[i].adl_sub_acute,    //"15",    
									"adl_chronic": dataSave[i].adl_chronic,    //"12",    
									"icu_indikator": dataSave[i].icu_indikator,    //"1",    
									"icu_los": dataSave[i].icu_los,    //"2",    
									"ventilator_hour": dataSave[i].ventilator_hour,    //"5",    
									"ventilator": {
										"use_ind": dataSave[i].ventilator.use_ind,
										"start_dttm": dataSave[i].ventilator.start_dttm,
										"stop_dttm": dataSave[i].ventilator.stop_dttm
									},
									"upgrade_class_ind": dataSave[i].upgrade_class_ind,    //"1",    
									"upgrade_class_class": dataSave[i].upgrade_class_class,    //"vip",    
									"upgrade_class_los": dataSave[i].upgrade_class_los,    //"5",    
									"upgrade_class_payor": dataSave[i].upgrade_class_payor,    //"5",    
									"add_payment_pct": "75",//dataSave[i].add_payment_pct ,    //"35",    
									"birth_weight": $scope.itemPopUp.beratbadan,//dataSave[i].birth_weight ,    //"0",    
									"sistole": dataSave[i].sistole,
									"diastole": dataSave[i].diastole, 
									"discharge_status": dataSave[i].discharge_status,    //"1",    
									"diagnosa": dataSave[i].diagnosa,    //"S71.0#A00.1",    
									"procedure": dataSave[i].procedure,    //"81.52#88.38",    
									"diagnosa_inagrouper": dataSave[i].diagnosa_inagrouper,
									"procedure_inagrouper": dataSave[i].procedure_inagrouper,
									"tarif_rs": {
										"prosedur_non_bedah": dataSave[i].tarif_rs.prosedur_non_bedah,    //"300000",      
										"prosedur_bedah": dataSave[i].tarif_rs.prosedur_bedah,    //"20000000",      
										"konsultasi": dataSave[i].tarif_rs.konsultasi,    //"300000",      
										"tenaga_ahli": dataSave[i].tarif_rs.tenaga_ahli,    //"200000",      
										"keperawatan": dataSave[i].tarif_rs.keperawatan,    // "80000",      
										"penunjang": dataSave[i].tarif_rs.penunjang,    //"1000000",      
										"radiologi": dataSave[i].tarif_rs.radiologi,    //"500000",      
										"laboratorium": dataSave[i].tarif_rs.laboratorium,    //"600000",      
										"pelayanan_darah": dataSave[i].tarif_rs.pelayanan_darah,    //"150000",      
										"rehabilitasi": dataSave[i].tarif_rs.rehabilitasi,    //"100000",      
										"kamar": dataSave[i].tarif_rs.kamar,    //"6000000",      
										"rawat_intensif": dataSave[i].tarif_rs.rawat_intensif,    //"2500000",      
										"obat": dataSave[i].tarif_rs.obat,    //"2000000",  
										"obat_kronis": dataSave[i].tarif_rs.obat_kronis,
										"obat_kemoterapi": dataSave[i].tarif_rs.obat_kemoterapi,
										"alkes": dataSave[i].tarif_rs.alkes,    //"500000",      
										"bmhp": dataSave[i].tarif_rs.bmhp,    //"400000",      
										"sewa_alat": dataSave[i].tarif_rs.sewa_alat,    //"210000"    
									},
									"pemulasaraan_jenazah": dataSave[i].pemulasaraan_jenazah,//dataSave[i].pemulasaraan_jenazah,
									"kantong_jenazah": dataSave[i].kantong_jenazah,//dataSave[i].kantong_jenazah,
									"peti_jenazah": dataSave[i].peti_jenazah,//dataSave[i].peti_jenazah,
									"plastik_erat": dataSave[i].plastik_erat,//dataSave[i].plastik_erat,
									"desinfektan_jenazah": dataSave[i].desinfektan_jenazah,//dataSave[i].desinfektan_jenazah,
									"mobil_jenazah": dataSave[i].mobil_jenazah,//dataSave[i].mobil_jenazah,
									"desinfektan_mobil_jenazah": dataSave[i].desinfektan_mobil_jenazah,//dataSave[i].desinfektan_mobil_jenazah,
									"covid19_status_cd": covid19_status_cd,//dataSave[i].covid19_status_cd,
									"nomor_kartu_t": dataSave[i].nomor_kartu_t,//dataSave[i].nomor_kartu_t,
									"episodes": dataSave[i].episodes,//dataSave[i].episodes,//"1;12#2;3#6;5",
									"covid19_cc_ind": covid19_cc_ind,//dataSave[i].covid19_cc_ind,
									"covid19_rs_darurat_ind": covid19_rs_darurat_ind,
									"covid19_co_insidense_ind": covid19_co_insidense_ind,
									"covid19_penunjang_pengurang": {
										"lab_asam_laktat": faktorpengurang[0] === undefined ? dataSave[i].covid19_penunjang_pengurang.lab_asam_laktat : faktorpengurang[0].value,
										"lab_procalcitonin": faktorpengurang[1] === undefined ? dataSave[i].covid19_penunjang_pengurang.lab_procalcitonin : faktorpengurang[1].value,
										"lab_crp": faktorpengurang[2] === undefined ? dataSave[i].covid19_penunjang_pengurang.lab_crp : faktorpengurang[2].value,
										"lab_kultur": faktorpengurang[3] === undefined ? dataSave[i].covid19_penunjang_pengurang.lab_kultur : faktorpengurang[3].value,
										"lab_d_dimer": faktorpengurang[4] === undefined ? dataSave[i].covid19_penunjang_pengurang.lab_d_dimer : faktorpengurang[4].value,
										"lab_pt": faktorpengurang[5] === undefined ? dataSave[i].covid19_penunjang_pengurang.lab_pt : faktorpengurang[5].value,
										"lab_aptt": faktorpengurang[6] === undefined ? dataSave[i].covid19_penunjang_pengurang.lab_aptt : faktorpengurang[6].value,
										"lab_waktu_pendarahan": faktorpengurang[7] === undefined ? dataSave[i].covid19_penunjang_pengurang.lab_waktu_pendarahan : faktorpengurang[7].value,
										"lab_anti_hiv": faktorpengurang[8] === undefined ? dataSave[i].covid19_penunjang_pengurang.lab_anti_hiv : faktorpengurang[8].value,
										"lab_analisa_gas": faktorpengurang[9] === undefined ? dataSave[i].covid19_penunjang_pengurang.lab_analisa_gas : faktorpengurang[9].value,
										"lab_albumin": faktorpengurang[10] === undefined ? dataSave[i].covid19_penunjang_pengurang.lab_albumin : faktorpengurang[10].value,
										"rad_thorax_ap_pa": faktorpengurang[11] === undefined ? dataSave[i].covid19_penunjang_pengurang.rad_thorax_ap_pa : faktorpengurang[11].value
									},
									"terapi_konvalesen": dataSave[i].terapi_konvalesen,
									"akses_naat": akses_naat,
									"isoman_ind": isoman_ind,
									"bayi_lahir_status_cd": dataSave[i].bayi_lahir_status_cd,
									"dializer_single_use": dataSave[i].dializer_single_use,
									"kantong_darah": dataSave[i].kantong_darah,
									"apgar": {
										"menit_1": {
											"appearance": dataSave[i].apgar.menit_1.appearance,
											"pulse": dataSave[i].apgar.menit_1.pulse,
											"grimace": dataSave[i].apgar.menit_1.grimace,
											"activity": dataSave[i].apgar.menit_1.activity,
											"respiration": dataSave[i].apgar.menit_1.respiration
										},
										"menit_5": {
											"appearance": dataSave[i].apgar.menit_5.appearance,
											"pulse": dataSave[i].apgar.menit_5.pulse,
											"grimace": dataSave[i].apgar.menit_5.grimace,
											"activity": dataSave[i].apgar.menit_5.activity,
											"respiration": dataSave[i].apgar.menit_5.respiration
										}
									},
									"persalinan": {
										"usia_kehamilan": dataSave[i].persalinan.usia_kehamilan,
										"gravida": dataSave[i].persalinan.gravida,
										"partus": dataSave[i].persalinan.partus,
										"abortus": dataSave[i].persalinan.abortus,
										"onset_kontraksi": dataSave[i].persalinan.onset_kontraksi,
										"delivery": [
											{
												"delivery_sequence": dataSave[i].persalinan.delivery.delivery_sequence,
												"delivery_method": dataSave[i].persalinan.delivery.delivery_method,
												"delivery_dttm": dataSave[i].persalinan.delivery.delivery_dttm,
												"letak_janin": dataSave[i].persalinan.delivery.letak_janin,
												"kondisi": dataSave[i].persalinan.delivery.kondisi,
												"use_manual": dataSave[i].persalinan.delivery.use_manual,
												"use_forcep": dataSave[i].persalinan.delivery.use_forcep,
												"use_vacuum": dataSave[i].persalinan.delivery.use_vacuum
											},
											// {
											// 	"delivery_sequence": "2",  // parameter baru jika lahir lebih dari satu bayi
											// 	"delivery_method": "vaginal", // parameter baru jika lahir lebih dari satu bayi
											// 	"delivery_dttm": "2023-01-21 17:03:49", // parameter baru jika lahir lebih dari satu bayi
											// 	"letak_janin": "lintang", // parameter baru jika lahir lebih dari satu bayi
											// 	"kondisi": "livebirth", // parameter baru jika lahir lebih dari satu bayi
											// 	"use_manual": "1", // parameter baru jika lahir lebih dari satu bayi
											// 	"use_forcep": "0", // parameter baru jika lahir lebih dari satu bayi
											// 	"use_vacuum": "0" // parameter baru jika lahir lebih dari satu bayi
											// }
										]
									},
									"tarif_poli_eks": dataSave[i].tarif_poli_eks,    //"100000",    
									"nama_dokter": dataSave[i].nama_dokter,    //"RUDY, DR",    
									"kode_tarif": dataSave[i].kode_tarif,    //"AP",    
									"payor_id": dataSave[i].payor_id,    //"3",    
									"payor_cd": dataSave[i].payor_cd,    //"JKN",    
									"cob_cd": dataSave[i].cob_cd,    //"0001",    
									"coder_nik": dataSave[i].coder_nik    //"123123123123"  
								}
								// "data": {
								// 	"nomor_sep": dataSave[i].nomor_sep,    //"0901R001TEST0001",    
								// 	"nomor_kartu": dataSave[i].nomor_kartu,    //"233333",    
								// 	"tgl_masuk": dataSave[i].tgl_masuk,    //"2017-11-20 12:55:00",    
								// 	"tgl_pulang": dataSave[i].tgl_pulang,    //"2017-12-01 09:55:00",    
								// 	"jenis_rawat": dataSave[i].jenis_rawat,    //$scope.item.faktorpengurang[0],    
								// 	"kelas_rawat": dataSave[i].kelas_rawat,    //"1",    
								// 	"adl_sub_acute": dataSave[i].adl_sub_acute,    //"15",    
								// 	"adl_chronic": dataSave[i].adl_chronic,    //"12",    
								// 	"icu_indikator": dataSave[i].icu_indikator,    //"1",    
								// 	"icu_los": dataSave[i].icu_los,    //"2",    
								// 	"ventilator_hour": dataSave[i].ventilator_hour,    //"5",    
								// 	"upgrade_class_ind": dataSave[i].upgrade_class_ind,    //"1",    
								// 	"upgrade_class_class": dataSave[i].upgrade_class_class,    //"vip",    
								// 	"upgrade_class_los": dataSave[i].upgrade_class_los,    //"5",    
								// 	"add_payment_pct": "75",//dataSave[i].add_payment_pct ,    //"35",    
								// 	"birth_weight": $scope.dataPasienSelected.beratbadan,//dataSave[i].birth_weight ,    //"0",    
								// 	"discharge_status": dataSave[i].discharge_status,    //"1",    
								// 	"diagnosa": dataSave[i].diagnosa,    //"S71.0#A00.1",    
								// 	"procedure": dataSave[i].procedure,    //"81.52#88.38",    
								// 	"tarif_rs": {
								// 		"prosedur_non_bedah": dataSave[i].tarif_rs.prosedur_non_bedah,    //"300000",      
								// 		"prosedur_bedah": dataSave[i].tarif_rs.prosedur_bedah,    //"20000000",      
								// 		"konsultasi": dataSave[i].tarif_rs.konsultasi,    //"300000",      
								// 		"tenaga_ahli": dataSave[i].tarif_rs.tenaga_ahli,    //"200000",      
								// 		"keperawatan": dataSave[i].tarif_rs.keperawatan,    // "80000",      
								// 		"penunjang": dataSave[i].tarif_rs.penunjang,    //"1000000",      
								// 		"radiologi": dataSave[i].tarif_rs.radiologi,    //"500000",      
								// 		"laboratorium": dataSave[i].tarif_rs.laboratorium,    //"600000",      
								// 		"pelayanan_darah": dataSave[i].tarif_rs.pelayanan_darah,    //"150000",      
								// 		"rehabilitasi": dataSave[i].tarif_rs.rehabilitasi,    //"100000",      
								// 		"kamar": dataSave[i].tarif_rs.kamar,    //"6000000",      
								// 		"rawat_intensif": dataSave[i].tarif_rs.rawat_intensif,    //"2500000",      
								// 		"obat": dataSave[i].tarif_rs.obat,    //"2000000",  
								// 		"obat_kronis": dataSave[i].tarif_rs.obat_kronis,
								// 		"obat_kemoterapi": dataSave[i].tarif_rs.obat_kemoterapi,
								// 		"alkes": dataSave[i].tarif_rs.alkes,    //"500000",      
								// 		"bmhp": dataSave[i].tarif_rs.bmhp,    //"400000",      
								// 		"sewa_alat": dataSave[i].tarif_rs.sewa_alat,    //"210000"    
								// 	},
								// 	"pemulasaraan_jenazah": dataSave[i].pemulasaraan_jenazah,//dataSave[i].pemulasaraan_jenazah,
								// 	"kantong_jenazah": dataSave[i].kantong_jenazah,//dataSave[i].kantong_jenazah,
								// 	"peti_jenazah": dataSave[i].peti_jenazah,//dataSave[i].peti_jenazah,
								// 	"plastik_erat": dataSave[i].plastik_erat,//dataSave[i].plastik_erat,
								// 	"desinfektan_jenazah": dataSave[i].desinfektan_jenazah,//dataSave[i].desinfektan_jenazah,
								// 	"mobil_jenazah": dataSave[i].mobil_jenazah,//dataSave[i].mobil_jenazah,
								// 	"desinfektan_mobil_jenazah": dataSave[i].desinfektan_mobil_jenazah,//dataSave[i].desinfektan_mobil_jenazah,
								// 	"covid19_status_cd": covid19_status_cd,//dataSave[i].covid19_status_cd,
								// 	"nomor_kartu_t": dataSave[i].nomor_kartu_t,//dataSave[i].nomor_kartu_t,
								// 	"episodes": dataSave[i].episodes,//dataSave[i].episodes,//"1;12#2;3#6;5",
								// 	"covid19_cc_ind": covid19_cc_ind,//dataSave[i].covid19_cc_ind,
								// 	"tarif_poli_eks": dataSave[i].tarif_poli_eks,    //"100000",    
								// 	"nama_dokter": dataSave[i].nama_dokter,    //"RUDY, DR",    
								// 	"kode_tarif": dataSave[i].kode_tarif,    //"AP",    
								// 	"payor_id": dataSave[i].payor_id,    //"3",    
								// 	"payor_cd": dataSave[i].payor_cd,    //"JKN",    
								// 	"cob_cd": dataSave[i].cob_cd,    //"0001",    
								// 	"coder_nik": dataSave[i].coder_nik    //"123123123123"  
								// }
							}
							dt2.push(dt1)
						}
					}

					var objData = {
						"data": dt2
					}
					medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
						var dt1 = {}
						var dt2 = []

						// for (var i = dataSave.length - 1; i >= 0; i--) {
						dt1 = {
							"metadata": {
								"method": "grouper",
								"stage": "1"
							},
							"data": {
								// "nomor_sep": dataSave[i].nomor_sep 
								"nomor_sep": $scope.itemPopUp.nosep
							}
						}
						dt2.push(dt1)
						// }


						var objData = {
							"data": dt2
						}
						var totaldijamin = "";
						var hakkelas = "";
						var biayanaikkelas = "0";
						medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
							// simpan response ke database
							responData = e.data.dataresponse;
							toastr.info(responData[0].dataresponse.metadata.message, 'INACBG');
							toastr.info(responData[0].dataresponse.response.cbg.description, 'INACBG');

							//save status


							let response = e.data.dataresponse
							let arrStatus =[]
							for (var i = 0; i < response.length; i++) {
								const element = response[i]
								if(element.datarequest.metadata.method == 'grouper'
									 && element.dataresponse.metadata.code == 200  ){
									arrStatus.push(
										{
											nosep:element.datarequest.data.nomor_sep,
											statusklaim: element.datarequest.metadata.method 
										})
								}
							}
							if(arrStatus.length>0){

								for (var i = 0; i < data2.length; i++) {
									const elem = data2[i]
									for (var ii = 0; ii < arrStatus.length; ii++) {
										const elem2 = arrStatus[ii]
										if(elem.nosep == elem2.nosep){
											elem2.norec = elem.norec
										}
									}
								}

								medifirstService.post('bridging/inacbg/save-status', {'data':arrStatus}).then(function (z) {
									
								})
							}
							//end status
							if (responData[0].dataresponse.response.cbg.description == "ERROR: MALE WITH GROUPING CRITERIA NOT MET") {
								toastr.info('JENIS KELAMIN SALAH ATAU DIAGNOSA TIDAK SESUAI JENIS KELAMIN', 'INACBG');
							}
							// if(dataSave[0].jenis_rawat==2){
							if ($scope.itemPopUp.deptid != 16) {
								totaldijamin = responData[0].dataresponse.tarif_alt[2].tarif_inacbg
							} else {
								hakkelas = responData[0].dataresponse.response.kelas
								if (hakkelas == "kelas_1") {
									totaldijamin = responData[0].dataresponse.tarif_alt[0].tarif_inacbg
								} else if (hakkelas == "kelas_2") {
									totaldijamin = responData[0].dataresponse.tarif_alt[1].tarif_inacbg
								} else if (hakkelas == "kelas_3") {
									totaldijamin = responData[0].dataresponse.tarif_alt[2].tarif_inacbg
								}
								if ($scope.itemPopUp.namakelas != $scope.itemPopUp.namakelasdaftar) {
									biayanaikkelas = responData[0].dataresponse.response.add_payment_amt
									if (biayanaikkelas < 0) {
										biayanaikkelas = 0
									}
								}
							}
							var dataproposi = {
								"noregistrasifk": $scope.itemPopUp.norec,
								"totalDijamin": totaldijamin,
								"biayaNaikkelas": biayanaikkelas,
								"response": responData[0].dataresponse,
							}
							medifirstService.post('bridging/inacbg/save-proposi-bridging-inacbg', dataproposi).then(function (e) {
								//ini untuk proposional kan utang per tindakan
							})
							loadData()
							// if (responData[0].dataresponse.hasOwnProperty("special_cmg_option") == true && responData[0].dataresponse.special_cmg_option.length > 0) {
							// 	toastr.info('Terdeteksi Top-up CMG Options')
							// 	dataSEPCMG = responData[0].datarequest.data.nomor_sep
							// 	var responOptions = responData[0].dataresponse.special_cmg_option
							// 	var spesialDrug = []
							// 	var specialProcedure = []
							// 	var specialProsthesis = []
							// 	var specialInvestigation = []
							// 	for (let i = 0; i < responOptions.length; i++) {
							// 		const element = responOptions[i];
							// 		if (element.type == 'Special Drug') {
							// 			spesialDrug.push(element)
							// 		}
							// 		if (element.type == 'Special Procedure') {
							// 			specialProcedure.push(element)
							// 		}
							// 		if (element.type == 'Special Prosthesis') {
							// 			specialProsthesis.push(element)
							// 		}
							// 		if (element.type == 'Special Investigation') {
							// 			specialInvestigation.push(element)
							// 		}
							// 	}
							// 	$scope.listspecialdrug = spesialDrug
							// 	$scope.listspecialprocedure = specialProcedure
							// 	$scope.listspecialprosthesis = specialProsthesis
							// 	$scope.listspecialinvestigation = specialInvestigation
							// }
						})

						$scope.isRouteLoading = false;
					})
				} else {
					var	datass =[{ noreg:  $scope.itemPopUp.norec,
								   namakelas:  $scope.itemPopUp.namakelas, 
								   nosep:  $scope.itemPopUp.nosep,
								   deptid:  $scope.itemPopUp.deptid }]
					medifirstService.postNonMessage('bridging/inacbg/get-daftar-pasien-statusnaikkelas?noreg=' + $scope.itemPopUp.norec
						+ '&namakelas=' + $scope.itemPopUp.namakelas,{'data':datass}).then(function (e) {
							var resp = e.data[0];
							var dt1 = {}
							var dt2 = []
							// for (var i = dataSave.length - 1; i >= 0; i--) {
							// 	if (dataSave[i].nomor_sep == $scope.itemPopUp.nosep) {
							// 		dt1 = {
							// 			"metadata": {
							// 				"method": "new_claim"
							// 			},
							// 			"data": {
							// 				"nomor_kartu": dataSave[i].nomor_kartu,
							// 				"nomor_sep": dataSave[i].nomor_sep,
							// 				"nomor_rm": dataSave[i].nomor_rm,
							// 				"nama_pasien": dataSave[i].nama_pasien,
							// 				"tgl_lahir": dataSave[i].tgl_lahir,
							// 				"gender": dataSave[i].gender
							// 			}
							// 		}
							// 		dt2.push(dt1)
							// 	}
							// }

							// var objData = {
							// 	"data": dt2
							// }
							// manageTataRekening.savebridginginacbg(objData).then(function(e){
							for (var i = dataSave.length - 1; i >= 0; i--) {
								if (dataSave[i].nomor_sep == $scope.itemPopUp.nosep) {
									dt1 = {
										"metadata": {
											"method": "set_claim_data",
											"nomor_sep": dataSave[i].nomor_sep
										},
										"data": {
											"nomor_sep": dataSave[i].nomor_sep,    //"0901R001TEST0001",    
											"nomor_kartu": dataSave[i].nomor_kartu,    //"233333",    
											"tgl_masuk": dataSave[i].tgl_masuk,    //"2017-11-20 12:55:00",    
											"tgl_pulang": dataSave[i].tgl_pulang,    //"2017-12-01 09:55:00",    
											"cara_masuk": dataSave[i].cara_masuk,   
											"jenis_rawat": dataSave[i].jenis_rawat,    //"1",    
											"kelas_rawat": dataSave[i].kelas_rawat,    //"1",    
											"adl_sub_acute": dataSave[i].adl_sub_acute,    //"15",    
											"adl_chronic": dataSave[i].adl_chronic,    //"12",    
											"icu_indikator": resp.statusrawatintensiv,//dataSave[i].icu_indikator ,    //"1",    
											"icu_los": resp.lamarawatintensiv,//dataSave[i].icu_los ,    //"2",    
											"ventilator_hour": dataSave[i].ventilator_hour,    //"5",    
											"ventilator": {
												"use_ind": dataSave[i].ventilator.use_ind,
												"start_dttm": dataSave[i].ventilator.start_dttm,
												"stop_dttm": dataSave[i].ventilator.stop_dttm
											},
											"upgrade_class_ind": resp.statusnaikkelas,    //"1",    dataSave[i].upgrade_class_ind ,
											"upgrade_class_class": resp.kelastertinggi,//dataSave[i].upgrade_class_class ,    //"vip",    
											"upgrade_class_los": resp.lamarawatnaikkelas,//dataSave[i].upgrade_class_los ,    //"5",    
											"upgrade_class_payor": resp.pembayar,    //"5",    
											"add_payment_pct": "75",//dataSave[i].add_payment_pct ,    //"35",    
											"birth_weight": $scope.itemPopUp.beratbadan,//dataSave[i].birth_weight ,    //"0",    
											"sistole": dataSave[i].sistole,
											"diastole": dataSave[i].diastole, 
											"discharge_status": dataSave[i].discharge_status,    //"1",    
											"diagnosa": dataSave[i].diagnosa,    //"S71.0#A00.1",    
											"procedure": dataSave[i].procedure,    //"81.52#88.38",  
											"diagnosa_inagrouper": dataSave[i].diagnosa_inagrouper,
											"procedure_inagrouper": dataSave[i].procedure_inagrouper,  
											"tarif_rs": {
												"prosedur_non_bedah": dataSave[i].tarif_rs.prosedur_non_bedah,    //"300000",      
												"prosedur_bedah": dataSave[i].tarif_rs.prosedur_bedah,    //"20000000",      
												"konsultasi": dataSave[i].tarif_rs.konsultasi,    //"300000",      
												"tenaga_ahli": dataSave[i].tarif_rs.tenaga_ahli,    //"200000",      
												"keperawatan": dataSave[i].tarif_rs.keperawatan,    // "80000",      
												"penunjang": dataSave[i].tarif_rs.penunjang,    //"1000000",      
												"radiologi": dataSave[i].tarif_rs.radiologi,    //"500000",      
												"laboratorium": dataSave[i].tarif_rs.laboratorium,    //"600000",      
												"pelayanan_darah": dataSave[i].tarif_rs.pelayanan_darah,    //"150000",      
												"rehabilitasi": dataSave[i].tarif_rs.rehabilitasi,    //"100000",      
												"kamar": dataSave[i].tarif_rs.kamar,    //"6000000",      
												"rawat_intensif": dataSave[i].tarif_rs.rawat_intensif,    //"2500000",      
												"obat": dataSave[i].tarif_rs.obat,    //"2000000",  
												"obat_kronis": dataSave[i].tarif_rs.obat_kronis,
												"obat_kemoterapi": dataSave[i].tarif_rs.obat_kemoterapi,
												"alkes": dataSave[i].tarif_rs.alkes,    //"500000",      
												"bmhp": dataSave[i].tarif_rs.bmhp,    //"400000",      
												"sewa_alat": dataSave[i].tarif_rs.sewa_alat,    //"210000"    
											},
											"pemulasaraan_jenazah": dataSave[i].pemulasaraan_jenazah,//dataSave[i].pemulasaraan_jenazah,
											"kantong_jenazah": dataSave[i].kantong_jenazah,//dataSave[i].kantong_jenazah,
											"peti_jenazah": dataSave[i].peti_jenazah,//dataSave[i].peti_jenazah,
											"plastik_erat": dataSave[i].plastik_erat,//dataSave[i].plastik_erat,
											"desinfektan_jenazah": dataSave[i].desinfektan_jenazah,//dataSave[i].desinfektan_jenazah,
											"mobil_jenazah": dataSave[i].mobil_jenazah,//dataSave[i].mobil_jenazah,
											"desinfektan_mobil_jenazah": dataSave[i].desinfektan_mobil_jenazah,//dataSave[i].desinfektan_mobil_jenazah,
											"covid19_status_cd": covid19_status_cd,//dataSave[i].covid19_status_cd,
											"nomor_kartu_t": dataSave[i].nomor_kartu_t,//dataSave[i].nomor_kartu_t,
											"episodes": dataSave[i].episodes,//dataSave[i].episodes,//"1;12#2;3#6;5",
											"covid19_cc_ind": covid19_cc_ind,//dataSave[i].covid19_cc_ind,
											"covid19_rs_darurat_ind": covid19_rs_darurat_ind,
											"covid19_co_insidense_ind": covid19_co_insidense_ind,
											"covid19_penunjang_pengurang": {
												"lab_asam_laktat": faktorpengurang[0] === undefined ? dataSave[i].covid19_penunjang_pengurang.lab_asam_laktat : faktorpengurang[0].value,
												"lab_procalcitonin": faktorpengurang[1] === undefined ? dataSave[i].covid19_penunjang_pengurang.lab_procalcitonin : faktorpengurang[1].value,
												"lab_crp": faktorpengurang[2] === undefined ? dataSave[i].covid19_penunjang_pengurang.lab_crp : faktorpengurang[2].value,
												"lab_kultur": faktorpengurang[3] === undefined ? dataSave[i].covid19_penunjang_pengurang.lab_kultur : faktorpengurang[3].value,
												"lab_d_dimer": faktorpengurang[4] === undefined ? dataSave[i].covid19_penunjang_pengurang.lab_d_dimer : faktorpengurang[4].value,
												"lab_pt": faktorpengurang[5] === undefined ? dataSave[i].covid19_penunjang_pengurang.lab_pt : faktorpengurang[5].value,
												"lab_aptt": faktorpengurang[6] === undefined ? dataSave[i].covid19_penunjang_pengurang.lab_aptt : faktorpengurang[6].value,
												"lab_waktu_pendarahan": faktorpengurang[7] === undefined ? dataSave[i].covid19_penunjang_pengurang.lab_waktu_pendarahan : faktorpengurang[7].value,
												"lab_anti_hiv": faktorpengurang[8] === undefined ? dataSave[i].covid19_penunjang_pengurang.lab_anti_hiv : faktorpengurang[8].value,
												"lab_analisa_gas": faktorpengurang[9] === undefined ? dataSave[i].covid19_penunjang_pengurang.lab_analisa_gas : faktorpengurang[9].value,
												"lab_albumin": faktorpengurang[10] === undefined ? dataSave[i].covid19_penunjang_pengurang.lab_albumin : faktorpengurang[10].value,
												"rad_thorax_ap_pa": faktorpengurang[11] === undefined ? dataSave[i].covid19_penunjang_pengurang.rad_thorax_ap_pa : faktorpengurang[11].value
											},
											"terapi_konvalesen": dataSave[i].terapi_konvalesen,
											"akses_naat": akses_naat,//"C",
											"isoman_ind": isoman_ind,//"0",
											"bayi_lahir_status_cd":  dataSave[i].bayi_lahir_status_cd,//1,
											"dializer_single_use": dataSave[i].dializer_single_use,
											"kantong_darah": dataSave[i].kantong_darah,
											"apgar": {
												"menit_1": {
													"appearance": dataSave[i].apgar.menit_1.appearance,
													"pulse": dataSave[i].apgar.menit_1.pulse,
													"grimace": dataSave[i].apgar.menit_1.grimace,
													"activity": dataSave[i].apgar.menit_1.activity,
													"respiration": dataSave[i].apgar.menit_1.respiration
												},
												"menit_5": {
													"appearance": dataSave[i].apgar.menit_5.appearance,
													"pulse": dataSave[i].apgar.menit_5.pulse,
													"grimace": dataSave[i].apgar.menit_5.grimace,
													"activity": dataSave[i].apgar.menit_5.activity,
													"respiration": dataSave[i].apgar.menit_5.respiration
												}
											},
											"persalinan": {
												"usia_kehamilan": dataSave[i].persalinan.usia_kehamilan,
												"gravida": dataSave[i].persalinan.gravida,
												"partus": dataSave[i].persalinan.partus,
												"abortus": dataSave[i].persalinan.abortus,
												"onset_kontraksi": dataSave[i].persalinan.onset_kontraksi,
												"delivery": [
													{
														"delivery_sequence": dataSave[i].persalinan.delivery.delivery_sequence,
														"delivery_method": dataSave[i].persalinan.delivery.delivery_method,
														"delivery_dttm": dataSave[i].persalinan.delivery.delivery_dttm,
														"letak_janin": dataSave[i].persalinan.delivery.letak_janin,
														"kondisi": dataSave[i].persalinan.delivery.kondisi,
														"use_manual": dataSave[i].persalinan.delivery.use_manual,
														"use_forcep": dataSave[i].persalinan.delivery.use_forcep,
														"use_vacuum": dataSave[i].persalinan.delivery.use_vacuum
													},
													// {
													// 	"delivery_sequence": "2",  // parameter baru jika lahir lebih dari satu bayi
													// 	"delivery_method": "vaginal", // parameter baru jika lahir lebih dari satu bayi
													// 	"delivery_dttm": "2023-01-21 17:03:49", // parameter baru jika lahir lebih dari satu bayi
													// 	"letak_janin": "lintang", // parameter baru jika lahir lebih dari satu bayi
													// 	"kondisi": "livebirth", // parameter baru jika lahir lebih dari satu bayi
													// 	"use_manual": "1", // parameter baru jika lahir lebih dari satu bayi
													// 	"use_forcep": "0", // parameter baru jika lahir lebih dari satu bayi
													// 	"use_vacuum": "0" // parameter baru jika lahir lebih dari satu bayi
													// }
												]
											},
											"tarif_poli_eks": dataSave[i].tarif_poli_eks,    //"100000",    
											"nama_dokter": dataSave[i].nama_dokter,    //"RUDY, DR",    
											"kode_tarif": dataSave[i].kode_tarif,    //"AP",    
											"payor_id": dataSave[i].payor_id,    //"3",    
											"payor_cd": dataSave[i].payor_cd,    //"JKN",    
											"cob_cd": dataSave[i].cob_cd,    //"0001",    
											"coder_nik": dataSave[i].coder_nik    //"123123123123"  
										}
										// "data": {
										// 	"nomor_sep": dataSave[i].nomor_sep,    //"0901R001TEST0001",    
										// 	"nomor_kartu": dataSave[i].nomor_kartu,    //"233333",    
										// 	"tgl_masuk": dataSave[i].tgl_masuk,    //"2017-11-20 12:55:00",    
										// 	"tgl_pulang": dataSave[i].tgl_pulang,    //"2017-12-01 09:55:00",    
										// 	"jenis_rawat": dataSave[i].jenis_rawat,    //"1",    
										// 	"kelas_rawat": dataSave[i].kelas_rawat,    //"1",    
										// 	"adl_sub_acute": dataSave[i].adl_sub_acute,    //"15",    
										// 	"adl_chronic": dataSave[i].adl_chronic,    //"12",    
										// 	"icu_indikator": resp.statusrawatintensiv,//dataSave[i].icu_indikator ,    //"1",    
										// 	"icu_los": resp.lamarawatintensiv,//dataSave[i].icu_los ,    //"2",    
										// 	"ventilator_hour": dataSave[i].ventilator_hour,    //"5",    
										// 	"upgrade_class_ind": resp.statusnaikkelas,    //"1",    dataSave[i].upgrade_class_ind ,
										// 	"upgrade_class_class": resp.kelastertinggi,//dataSave[i].upgrade_class_class ,    //"vip",    
										// 	"upgrade_class_los": resp.lamarawatnaikkelas,//dataSave[i].upgrade_class_los ,    //"5",    
										// 	"add_payment_pct": "75",//dataSave[i].add_payment_pct ,    //"35",    
										// 	"birth_weight": $scope.dataPasienSelected.beratbadan,//dataSave[i].birth_weight ,    //"0",    
										// 	"discharge_status": dataSave[i].discharge_status,    //"1",    
										// 	"diagnosa": dataSave[i].diagnosa,    //"S71.0#A00.1",    
										// 	"procedure": dataSave[i].procedure,    //"81.52#88.38",    
										// 	"tarif_rs": {
										// 		"prosedur_non_bedah": dataSave[i].tarif_rs.prosedur_non_bedah,    //"300000",      
										// 		"prosedur_bedah": dataSave[i].tarif_rs.prosedur_bedah,    //"20000000",      
										// 		"konsultasi": dataSave[i].tarif_rs.konsultasi,    //"300000",      
										// 		"tenaga_ahli": dataSave[i].tarif_rs.tenaga_ahli,    //"200000",      
										// 		"keperawatan": dataSave[i].tarif_rs.keperawatan,    // "80000",      
										// 		"penunjang": dataSave[i].tarif_rs.penunjang,    //"1000000",      
										// 		"radiologi": dataSave[i].tarif_rs.radiologi,    //"500000",      
										// 		"laboratorium": dataSave[i].tarif_rs.laboratorium,    //"600000",      
										// 		"pelayanan_darah": dataSave[i].tarif_rs.pelayanan_darah,    //"150000",      
										// 		"rehabilitasi": dataSave[i].tarif_rs.rehabilitasi,    //"100000",      
										// 		"kamar": dataSave[i].tarif_rs.kamar,    //"6000000",      
										// 		"rawat_intensif": dataSave[i].tarif_rs.rawat_intensif,    //"2500000",      
										// 		"obat": dataSave[i].tarif_rs.obat,    //"2000000",  
										// 		"obat_kronis": dataSave[i].tarif_rs.obat_kronis,
										// 		"obat_kemoterapi": dataSave[i].tarif_rs.obat_kemoterapi,
										// 		"alkes": dataSave[i].tarif_rs.alkes,    //"500000",      
										// 		"bmhp": dataSave[i].tarif_rs.bmhp,    //"400000",      
										// 		"sewa_alat": dataSave[i].tarif_rs.sewa_alat,    //"210000"    
										// 	},
										// 	"pemulasaraan_jenazah": dataSave[i].pemulasaraan_jenazah,//dataSave[i].pemulasaraan_jenazah,
										// 	"kantong_jenazah": dataSave[i].kantong_jenazah,//dataSave[i].kantong_jenazah,
										// 	"peti_jenazah": dataSave[i].peti_jenazah,//dataSave[i].peti_jenazah,
										// 	"plastik_erat": dataSave[i].plastik_erat,//dataSave[i].plastik_erat,
										// 	"desinfektan_jenazah": dataSave[i].desinfektan_jenazah,//dataSave[i].desinfektan_jenazah,
										// 	"mobil_jenazah": dataSave[i].mobil_jenazah,//dataSave[i].mobil_jenazah,
										// 	"desinfektan_mobil_jenazah": dataSave[i].desinfektan_mobil_jenazah,//dataSave[i].desinfektan_mobil_jenazah,
										// 	"covid19_status_cd": covid19_status_cd,//dataSave[i].covid19_status_cd,
										// 	"nomor_kartu_t": dataSave[i].nomor_kartu_t,//dataSave[i].nomor_kartu_t,
										// 	"episodes": dataSave[i].episodes,//dataSave[i].episodes,//"1;12#2;3#6;5",
										// 	"covid19_cc_ind": covid19_cc_ind,//dataSave[i].covid19_cc_ind,
										// 	"tarif_poli_eks": dataSave[i].tarif_poli_eks,    //"100000",    
										// 	"nama_dokter": dataSave[i].nama_dokter,    //"RUDY, DR",    
										// 	"kode_tarif": dataSave[i].kode_tarif,    //"AP",    
										// 	"payor_id": dataSave[i].payor_id,    //"3",    
										// 	"payor_cd": dataSave[i].payor_cd,    //"JKN",    
										// 	"cob_cd": dataSave[i].cob_cd,    //"0001",    
										// 	"coder_nik": dataSave[i].coder_nik    //"123123123123"  
										// }
									}
									dt2.push(dt1)
								}
							}

							var objData = {
								"data": dt2
							}
							medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
								var dt1 = {}
								var dt2 = []

								// for (var i = dataSave.length - 1; i >= 0; i--) {
								dt1 = {
									"metadata": {
										"method": "grouper",
										"stage": "1"
									},
									"data": {
										// "nomor_sep": dataSave[i].nomor_sep 
										"nomor_sep": $scope.itemPopUp.nosep
									}
								}
								dt2.push(dt1)
								// }


								var objData = {
									"data": dt2
								}
								var totaldijamin = "";
								var hakkelas = "";
								var biayanaikkelas = "0";
								var top_up_jenazah = "";
								medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
									// simpan response ke database
									responData = e.data.dataresponse;
									toastr.info(responData[0].dataresponse.metadata.message, 'INACBG');
									toastr.info(responData[0].dataresponse.response.cbg.description, 'INACBG');
									if (responData[0].dataresponse.response.cbg.description == "ERROR: MALE WITH GROUPING CRITERIA NOT MET") {
										toastr.info('JENIS KELAMIN SALAH ATAU DIAGNOSA TIDAK SESUAI JENIS KELAMIN', 'INACBG');
									}

									//save status
									let response = e.data.dataresponse
									let arrStatus =[]
									for (var i = 0; i < response.length; i++) {
										const element = response[i]
										if(element.datarequest.metadata.method == 'grouper'
											&& element.dataresponse.metadata.code == 200  ){
											arrStatus.push(
												{
													nosep:element.datarequest.data.nomor_sep,
													statusklaim: element.datarequest.metadata.method 
												})
										}
									}
									if(arrStatus.length>0){

										for (var i = 0; i < data2.length; i++) {
											const elem = data2[i]
											for (var ii = 0; ii < arrStatus.length; ii++) {
												const elem2 = arrStatus[ii]
												if(elem.nosep == elem2.nosep){
													elem2.norec = elem.norec
												}
											}
										}

										medifirstService.post('bridging/inacbg/save-status', {'data':arrStatus}).then(function (z) {
											
										})
									}

									// if(dataSave[0].jenis_rawat==2){
									if ($scope.itemPopUp.deptid != 16) {
										totaldijamin = responData[0].dataresponse.tarif_alt[2].tarif_inacbg
									} else if ($scope.itemPopUp.statuscovid === true) {
										if (responData[0].dataresponse.response.covid19_data.top_up_jenazah != 0) {
											top_up_jenazah = "";
										}
										// totaldijamin = top_up_jenazah + responData[0].dataresponse.response.covid19_data.top_up_rawat + responData[0].dataresponse.response.covid19_data.top_up_rawat_factor + responData[0].dataresponse.response.covid19_data.top_up_rawat_gross
										totaldijamin = responData[0].dataresponse.response.covid19_data.nilai_klaim
									} else {
										hakkelas = responData[0].dataresponse.response.kelas
										if (hakkelas == "kelas_1") {
											totaldijamin = responData[0].dataresponse.tarif_alt[0].tarif_inacbg
										} else if (hakkelas == "kelas_2") {
											totaldijamin = responData[0].dataresponse.tarif_alt[1].tarif_inacbg
										} else if (hakkelas == "kelas_3") {
											totaldijamin = responData[0].dataresponse.tarif_alt[2].tarif_inacbg
										}
										// if($scope.itemPopUp.namakelas!=$scope.itemPopUp.namakelasdaftar){
										if (resp.statusnaikkelas != '0') {
											biayanaikkelas = responData[0].dataresponse.response.add_payment_amt
											if (biayanaikkelas < 0) {
												biayanaikkelas = 0
											}
										}
									}
									var dataproposi = {
										"noregistrasifk": $scope.itemPopUp.norec,
										"totalDijamin": totaldijamin,
										"biayaNaikkelas": biayanaikkelas,
										"response": responData[0].dataresponse,
									}
									medifirstService.post('bridging/inacbg/save-proposi-bridging-inacbg', dataproposi).then(function (e) {
										//ini untuk proposional kan utang per tindakan
									})
									loadData()
									// if (responData[0].dataresponse.hasOwnProperty("special_cmg_option") == true && responData[0].dataresponse.special_cmg_option.length > 0) {
									// 	toastr.info('Terdeteksi Top-up CMG Options')
									// 	dataSEPCMG = responData[0].datarequest.data.nomor_sep
									// 	var responOptions = responData[0].dataresponse.special_cmg_option
									// 	var spesialDrug = []
									// 	var specialProcedure = []
									// 	var specialProsthesis = []
									// 	var specialInvestigation = []
									// 	for (let i = 0; i < responOptions.length; i++) {
									// 		const element = responOptions[i];
									// 		if (element.type == 'Special Drug') {
									// 			spesialDrug.push(element)
									// 		}
									// 		if (element.type == 'Special Procedure') {
									// 			specialProcedure.push(element)
									// 		}
									// 		if (element.type == 'Special Prosthesis') {
									// 			specialProsthesis.push(element)
									// 		}
									// 		if (element.type == 'Special Investigation') {
									// 			specialInvestigation.push(element)
									// 		}
									// 	}
									// 	$scope.listspecialdrug = spesialDrug
									// 	$scope.listspecialprocedure = specialProcedure
									// 	$scope.listspecialprosthesis = specialProsthesis
									// 	$scope.listspecialinvestigation = specialInvestigation
									// }
								})

								$scope.isRouteLoading = false;
							})

						})
				}


			}
			$scope.update_patient = function () {
				var dt1 = {}
				var dt2 = []
				for (var i = dataSave.length - 1; i >= 0; i--) {
					if (dataSave[i].nomor_sep == $scope.dataPasienSelected.nosep) {
						dt1 = {
							"metadata": {
								"method": "update_patient",
								"nomor_rm": dataSave[i].nomor_rm
							},
							"data": {
								"nomor_kartu": dataSave[i].nomor_kartu,
								"nomor_rm": dataSave[i].nomor_rm,
								"nama_pasien": dataSave[i].nama_pasien,
								"tgl_lahir": dataSave[i].tgl_lahir,
								"gender": dataSave[i].gender
							}
						}
						dt2.push(dt1)
					}
				}

				var objData = {
					"data": dt2
				}
				medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
					// LoadData();				
				})
			}
			$scope.set_claim_data = function () {
				var dt1 = {}
				var dt2 = []
				for (var i = dataSave.length - 1; i >= 0; i--) {
					if (dataSave[i].nomor_sep == $scope.dataPasienSelected.nosep) {
						dt1 = {
							"metadata": {
								"method": "set_claim_data",
								"nomor_sep": dataSave[i].nomor_sep
							},
							"data": {
								"nomor_sep": dataSave[i].nomor_sep,    //"0901R001TEST0001",    
								"nomor_kartu": dataSave[i].nomor_kartu,    //"233333",    
								"tgl_masuk": dataSave[i].tgl_masuk,    //"2017-11-20 12:55:00",    
								"tgl_pulang": dataSave[i].tgl_pulang,    //"2017-12-01 09:55:00",    
								"jenis_rawat": dataSave[i].jenis_rawat,    //"1",    
								"kelas_rawat": dataSave[i].kelas_rawat,    //ini adalah kelas tanggungan BPJS   
								"adl_sub_acute": dataSave[i].adl_sub_acute,    //"15",    
								"adl_chronic": dataSave[i].adl_chronic,    //"12",    
								"icu_indikator": dataSave[i].icu_indikator,    //"1",    
								"icu_los": dataSave[i].icu_los,    //"2",    
								"ventilator_hour": dataSave[i].ventilator_hour,    //"5",    
								"upgrade_class_ind": dataSave[i].upgrade_class_ind,    //"1",    
								"upgrade_class_class": dataSave[i].upgrade_class_class,    //"vip",    
								"upgrade_class_los": dataSave[i].upgrade_class_los,    //"5",    
								"add_payment_pct": dataSave[i].add_payment_pct,    //"35",    
								"birth_weight": dataSave[i].birth_weight,    //"0",    
								"discharge_status": dataSave[i].discharge_status,    //"1",    
								"diagnosa": dataSave[i].diagnosa,    //"S71.0#A00.1",    
								"procedure": dataSave[i].procedure,    //"81.52#88.38",    
								"tarif_rs": {
									"prosedur_non_bedah": dataSave[i].tarif_rs.prosedur_non_bedah,    //"300000",      
									"prosedur_bedah": dataSave[i].tarif_rs.prosedur_bedah,    //"20000000",      
									"konsultasi": dataSave[i].tarif_rs.konsultasi,    //"300000",      
									"tenaga_ahli": dataSave[i].tarif_rs.tenaga_ahli,    //"200000",      
									"keperawatan": dataSave[i].tarif_rs.keperawatan,    // "80000",      
									"penunjang": dataSave[i].tarif_rs.penunjang,    //"1000000",      
									"radiologi": dataSave[i].tarif_rs.radiologi,    //"500000",      
									"laboratorium": dataSave[i].tarif_rs.laboratorium,    //"600000",      
									"pelayanan_darah": dataSave[i].tarif_rs.pelayanan_darah,    //"150000",      
									"rehabilitasi": dataSave[i].tarif_rs.rehabilitasi,    //"100000",      
									"kamar": dataSave[i].tarif_rs.kamar,    //"6000000",      
									"rawat_intensif": dataSave[i].tarif_rs.rawat_intensif,    //"2500000",      
									"obat": dataSave[i].tarif_rs.obat,    //"2000000",  
									"obat_kronis": "0",
									"obat_kemoterapi": "0",
									"alkes": dataSave[i].tarif_rs.alkes,    //"500000",      
									"bmhp": dataSave[i].tarif_rs.bmhp,    //"400000",      
									"sewa_alat": dataSave[i].tarif_rs.sewa_alat,    //"210000"    
								},
								"pemulasaraan_jenazah": dataSave[i].pemulasaraan_jenazah,//dataSave[i].pemulasaraan_jenazah,
								"kantong_jenazah": dataSave[i].kantong_jenazah,//dataSave[i].kantong_jenazah,
								"peti_jenazah": dataSave[i].peti_jenazah,//dataSave[i].peti_jenazah,
								"plastik_erat": dataSave[i].plastik_erat,//dataSave[i].plastik_erat,
								"desinfektan_jenazah": dataSave[i].desinfektan_jenazah,//dataSave[i].desinfektan_jenazah,
								"mobil_jenazah": dataSave[i].mobil_jenazah,//dataSave[i].mobil_jenazah,
								"desinfektan_mobil_jenazah": dataSave[i].desinfektan_mobil_jenazah,//dataSave[i].desinfektan_mobil_jenazah,
								"covid19_status_cd": covid19_status_cd,//dataSave[i].covid19_status_cd,
								"nomor_kartu_t": dataSave[i].nomor_kartu_t,//dataSave[i].nomor_kartu_t,
								"episodes": dataSave[i].episodes,//dataSave[i].episodes,//"1;12#2;3#6;5",
								"covid19_cc_ind": covid19_cc_ind,//dataSave[i].covid19_cc_ind,
								"covid19_rs_darurat_ind": "1",
								"covid19_co_insidense_ind": "1",
								"covid19_penunjang_pengurang": {
									"lab_asam_laktat": "1",
									"lab_procalcitonin": "1",
									"lab_crp": "1",
									"lab_kultur": "1",
									"lab_d_dimer": "1",
									"lab_pt": "1",
									"lab_aptt": "1",
									"lab_waktu_pendarahan": "1",
									"lab_anti_hiv": "1",
									"lab_analisa_gas": "1",
									"lab_albumin": "1",
									"rad_thorax_ap_pa": "0"
								},
								"terapi_konvalesen": "1000000",
								"akses_naat": "C",
								"isoman_ind": "0",
								"bayi_lahir_status_cd": 1,
								"tarif_poli_eks": dataSave[i].tarif_poli_eks,    //"100000",    
								"nama_dokter": dataSave[i].nama_dokter,    //"RUDY, DR",    
								"kode_tarif": dataSave[i].kode_tarif,    //"AP",    
								"payor_id": dataSave[i].payor_id,    //"3",    
								"payor_cd": dataSave[i].payor_cd,    //"JKN",    
								"cob_cd": dataSave[i].cob_cd,    //"0001",    
								"coder_nik": dataSave[i].coder_nik    //"123123123123"  
							}
							// "data": {
							// 	"nomor_sep": dataSave[i].nomor_sep,    //"0901R001TEST0001",    
							// 	"nomor_kartu": dataSave[i].nomor_kartu,    //"233333",    
							// 	"tgl_masuk": dataSave[i].tgl_masuk,    //"2017-11-20 12:55:00",    
							// 	"tgl_pulang": dataSave[i].tgl_pulang,    //"2017-12-01 09:55:00",    
							// 	"jenis_rawat": dataSave[i].jenis_rawat,    //"1",    
							// 	"kelas_rawat": dataSave[i].kelas_rawat,    //ini adalah kelas tanggungan BPJS   
							// 	"adl_sub_acute": dataSave[i].adl_sub_acute,    //"15",    
							// 	"adl_chronic": dataSave[i].adl_chronic,    //"12",    
							// 	"icu_indikator": dataSave[i].icu_indikator,    //"1",    
							// 	"icu_los": dataSave[i].icu_los,    //"2",    
							// 	"ventilator_hour": dataSave[i].ventilator_hour,    //"5",    
							// 	"upgrade_class_ind": dataSave[i].upgrade_class_ind,    //"1",    
							// 	"upgrade_class_class": dataSave[i].upgrade_class_class,    //"vip",    
							// 	"upgrade_class_los": dataSave[i].upgrade_class_los,    //"5",    
							// 	"add_payment_pct": dataSave[i].add_payment_pct,    //"35",    
							// 	"birth_weight": dataSave[i].birth_weight,    //"0",    
							// 	"discharge_status": dataSave[i].discharge_status,    //"1",    
							// 	"diagnosa": dataSave[i].diagnosa,    //"S71.0#A00.1",    
							// 	"procedure": dataSave[i].procedure,    //"81.52#88.38",    
							// 	"tarif_rs": {
							// 		"prosedur_non_bedah": dataSave[i].tarif_rs.prosedur_non_bedah,    //"300000",      
							// 		"prosedur_bedah": dataSave[i].tarif_rs.prosedur_bedah,    //"20000000",      
							// 		"konsultasi": dataSave[i].tarif_rs.konsultasi,    //"300000",      
							// 		"tenaga_ahli": dataSave[i].tarif_rs.tenaga_ahli,    //"200000",      
							// 		"keperawatan": dataSave[i].tarif_rs.keperawatan,    // "80000",      
							// 		"penunjang": dataSave[i].tarif_rs.penunjang,    //"1000000",      
							// 		"radiologi": dataSave[i].tarif_rs.radiologi,    //"500000",      
							// 		"laboratorium": dataSave[i].tarif_rs.laboratorium,    //"600000",      
							// 		"pelayanan_darah": dataSave[i].tarif_rs.pelayanan_darah,    //"150000",      
							// 		"rehabilitasi": dataSave[i].tarif_rs.rehabilitasi,    //"100000",      
							// 		"kamar": dataSave[i].tarif_rs.kamar,    //"6000000",      
							// 		"rawat_intensif": dataSave[i].tarif_rs.rawat_intensif,    //"2500000",      
							// 		"obat": dataSave[i].tarif_rs.obat,    //"2000000",  
							// 		"obat_kronis": "0",
							// 		"obat_kemoterapi": "0",
							// 		"alkes": dataSave[i].tarif_rs.alkes,    //"500000",      
							// 		"bmhp": dataSave[i].tarif_rs.bmhp,    //"400000",      
							// 		"sewa_alat": dataSave[i].tarif_rs.sewa_alat,    //"210000"    
							// 	},
							// 	"tarif_poli_eks": dataSave[i].tarif_poli_eks,    //"100000",    
							// 	"nama_dokter": dataSave[i].nama_dokter,    //"RUDY, DR",    
							// 	"kode_tarif": dataSave[i].kode_tarif,    //"AP",    
							// 	"payor_id": dataSave[i].payor_id,    //"3",    
							// 	"payor_cd": dataSave[i].payor_cd,    //"JKN",    
							// 	"cob_cd": dataSave[i].cob_cd,    //"0001",    
							// 	"coder_nik": dataSave[i].coder_nik    //"123123123123"  
							// }
						}
						dt2.push(dt1)
					}
				}

				var objData = {
					"data": dt2
				}
				medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
					// LoadData();				
				})
			}

			$scope.grouper_1 = function () {
				if ($scope.dataPasienSelected.noregistrasi == undefined) {
					toastr.error('Pilih Pasien Terlebih dahulu!!!')
					return;
				}

				var dt1 = {}
				var dt2 = []

				// for (var i = dataSave.length - 1; i >= 0; i--) {
				dt1 = {
					"metadata": {
						"method": "grouper",
						"stage": "1"
					},
					"data": {
						// "nomor_sep": dataSave[i].nomor_sep 
						"nomor_sep": $scope.dataPasienSelected.nosep
					}
				}
				dt2.push(dt1)
				// }


				var objData = {
					"data": dt2
				}
				var totaldijamin = "";
				var hakkelas = "";
				var biayanaikkelas = "0";
				medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
					// simpan response ke database
					responData = e.data.dataresponse;
					toastr.info(responData[0].dataresponse.metadata.message, 'INACBG');
					toastr.info(responData[0].dataresponse.response.cbg.description, 'INACBG');
					// if(dataSave[0].jenis_rawat==2){
					if ($scope.dataPasienSelected.deptid != 16) {
						totaldijamin = responData[0].dataresponse.tarif_alt[2].tarif_inacbg
					} else {
						hakkelas = responData[0].dataresponse.response.kelas
						if (hakkelas == "kelas_1") {
							totaldijamin = responData[0].dataresponse.tarif_alt[0].tarif_inacbg
						} else if (hakkelas == "kelas_2") {
							totaldijamin = responData[0].dataresponse.tarif_alt[1].tarif_inacbg
						} else if (hakkelas == "kelas_3") {
							totaldijamin = responData[0].dataresponse.tarif_alt[2].tarif_inacbg
						}
						if ($scope.dataPasienSelected.namakelas != $scope.dataPasienSelected.namakelasdaftar) {
							biayanaikkelas = responData[0].dataresponse.response.add_payment_amt
							if (biayanaikkelas < 0) {
								biayanaikkelas = 0
							}
						}
					}
					var dataproposi = {
						"noregistrasifk": $scope.dataPasienSelected.norec,
						"totalDijamin": totaldijamin,
						"biayaNaikkelas": biayanaikkelas
					}
					manageTataRekening.saveproposibridginginacbg(dataproposi).then(function (e) {
						//ini untuk proposional kan utang per tindakan
					})
					loadData()
					if (responData[0].dataresponse.special_cmg_option.length > 1) {
						toastr.info('Terdeteksi Top-up CMG Options')
						dataSEPCMG = responData[0].datarequest.data.nomor_sep
						var responOptions = responData[0].dataresponse.special_cmg_option
						var spesialDrug = []
						var specialProcedure = []
						var specialProsthesis = []
						var specialInvestigation = []
						for (let i = 0; i < responOptions.length; i++) {
							const element = responOptions[i];
							if (element.type == 'Special Drug') {
								spesialDrug.push(element)
							}
							if (element.type == 'Special Procedure') {
								specialProcedure.push(element)
							}
							if (element.type == 'Special Prosthesis') {
								specialProsthesis.push(element)
							}
							if (element.type == 'Special Investigation') {
								specialInvestigation.push(element)
							}
						}
						$scope.listspecialdrug = spesialDrug
						$scope.listspecialprocedure = specialProcedure
						$scope.listspecialprosthesis = specialProsthesis
						$scope.listspecialinvestigation = specialInvestigation
					}
				})
			}
			$scope.simpangrouper2 = function () {
				var cmg = "";
				if ($scope.item.specialprocedure) {
					if (cmg != "") {
						cmg = cmg + '#' + $scope.item.specialprocedure.code
					} else {
						cmg = $scope.item.specialprocedure.code
					}
				}
				if ($scope.item.specialprosthesis) {
					if (cmg != "") {
						cmg = cmg + '#' + $scope.item.specialprosthesis.code
					} else {
						cmg = $scope.item.specialprosthesis.code
					}
				}
				if ($scope.item.specialinvestigation) {
					if (cmg != "") {
						cmg = cmg + '#' + $scope.item.specialinvestigation.code
					} else {
						cmg = $scope.item.specialinvestigation.code
					}
				}
				if ($scope.item.specialdrug) {
					if (cmg != "") {
						cmg = cmg + '#' + $scope.item.specialdrug.code
					} else {
						cmg = $scope.item.specialdrug.code
					}
				}
				var dt1 = {}
				var dt2 = []

				dt1 = {
					"metadata": {
						"method": "grouper",
						"stage": "2"
					},
					"data": {
						"nomor_sep": $scope.itemPopUp.nosep,
						"special_cmg": cmg//"ambil dari table hasil grouper 1"   
					}
				}
				dt2.push(dt1)




				var objData = {
					"data": dt2
				}
				var totaldijamin = "";
				var totaldijamina = "";
				var biayanaikkelas = "0";
				var hakkelas = "";
				var cmglength = [];
				$scope.isRouteLoading = true;
				medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
					$scope.isRouteLoading = false;
					// simpan response ke database
					responData = e.data.dataresponse;
					toastr.info(responData[0].dataresponse.metadata.message, 'INACBG');
					toastr.info(responData[0].dataresponse.response.cbg.description, 'INACBG');
					if(responData[0].dataresponse.response.special_cmg)
						cmglength = responData[0].dataresponse.response.special_cmg
					// if(dataSave[0].jenis_rawat==2){
					if ($scope.itemPopUp.deptid != 16) {
						totaldijamin = parseFloat(responData[0].dataresponse.tarif_alt[2].tarif_inacbg)
						for (let i = 0; i < cmglength.length; i++) {
							const element = cmglength[i];
							if (element.type == 'Special Drug') {
								if (totaldijamina != "") {
									totaldijamina = totaldijamina + element.tariff
								} else {
									totaldijamina = element.tariff
								}
							}
							if (element.type == 'Special Procedure') {
								if (totaldijamina != "") {
									totaldijamina = totaldijamina + element.tariff
								} else {
									totaldijamina = element.tariff
								}
							}
							if (element.type == 'Special Prosthesis') {
								if (totaldijamina != "") {
									totaldijamina = totaldijamina + element.tariff
								} else {
									totaldijamina = element.tariff
								}
							}
							if (element.type == 'Special Investigation') {
								if (totaldijamina != "") {
									totaldijamina = totaldijamina + element.tariff
								} else {
									totaldijamina = element.tariff
								}
							}
						}
						totaldijamina = responData[0].dataresponse.tarif_alt[2].tarif_sd
						totaldijamin = totaldijamin + totaldijamina
					} else {
						hakkelas = responData[0].dataresponse.response.kelas
						// if($scope.dataPasienSelected.namakelas!=$scope.dataPasienSelected.namakelasdaftar){
						// 	biayanaikkelas=responData[0].dataresponse.response.add_payment_amt
						// }

						biayanaikkelas = Number($scope.itemPopUp.biayanaikkelas)
						// biayanaikkelas=biayanaikkelas.toFixed(0);
						if (hakkelas == "kelas_1") {
							for (let i = 0; i < cmglength.length; i++) {
								const element = cmglength[i];
								if (element.type == 'Special Drug') {
									if (totaldijamina != "") {
										totaldijamina = totaldijamina + element.tariff
									} else {
										totaldijamina = element.tariff
									}
								}
								if (element.type == 'Special Procedure') {
									if (totaldijamina != "") {
										totaldijamina = totaldijamina + element.tariff
									} else {
										totaldijamina = element.tariff
									}
								}
								if (element.type == 'Special Prosthesis') {
									if (totaldijamina != "") {
										totaldijamina = totaldijamina + element.tariff
									} else {
										totaldijamina = element.tariff
									}
								}
								if (element.type == 'Special Investigation') {
									if (totaldijamina != "") {
										totaldijamina = totaldijamina + element.tariff
									} else {
										totaldijamina = element.tariff
									}
								}
							}
							totaldijamin = parseFloat(responData[0].dataresponse.tarif_alt[0].tarif_inacbg)
							totaldijamin = totaldijamin + totaldijamina
						} else if (hakkelas == "kelas_2") {
							for (let i = 0; i < cmglength.length; i++) {
								const element = cmglength[i];
								if (element.type == 'Special Drug') {
									if (totaldijamina != "") {
										totaldijamina = totaldijamina + element.tariff
									} else {
										totaldijamina = element.tariff
									}
								}
								if (element.type == 'Special Procedure') {
									if (totaldijamina != "") {
										totaldijamina = totaldijamina + element.tariff
									} else {
										totaldijamina = element.tariff
									}
								}
								if (element.type == 'Special Prosthesis') {
									if (totaldijamina != "") {
										totaldijamina = totaldijamina + element.tariff
									} else {
										totaldijamina = element.tariff
									}
								}
								if (element.type == 'Special Investigation') {
									if (totaldijamina != "") {
										totaldijamina = totaldijamina + element.tariff
									} else {
										totaldijamina = element.tariff
									}
								}
							}
							totaldijamin = parseFloat(responData[0].dataresponse.tarif_alt[1].tarif_inacbg)
							totaldijamin = totaldijamin + totaldijamina
						} else if (hakkelas == "kelas_3") {
							for (let i = 0; i < cmglength.length; i++) {
								const element = cmglength[i];
								if (element.type == 'Special Drug') {
									if (totaldijamina != "") {
										totaldijamina = totaldijamina + element.tariff
									} else {
										totaldijamina = element.tariff
									}
								}
								if (element.type == 'Special Procedure') {
									if (totaldijamina != "") {
										totaldijamina = totaldijamina + element.tariff
									} else {
										totaldijamina = element.tariff
									}
								}
								if (element.type == 'Special Prosthesis') {
									if (totaldijamina != "") {
										totaldijamina = totaldijamina + element.tariff
									} else {
										totaldijamina = element.tariff
									}
								}
								if (element.type == 'Special Investigation') {
									if (totaldijamina != "") {
										totaldijamina = totaldijamina + element.tariff
									} else {
										totaldijamina = element.tariff
									}
								}
							}
							totaldijamin = parseFloat(responData[0].dataresponse.tarif_alt[2].tarif_inacbg)
							totaldijamin = totaldijamin + totaldijamina
						}
					}
					var dataproposi = {
						"noregistrasifk": $scope.itemPopUp.norec,
						"totalDijamin": $scope.itemPopUp.response.response.cbg.tariff,
						"biayaNaikkelas": biayanaikkelas,
						"response": responData[0].dataresponse,
						"special_cmg": cmg,
					}
					$scope.isRouteLoading = true;
					medifirstService.post('bridging/inacbg/save-proposi-bridging-inacbg', dataproposi).then(function (e) {
						$scope.isRouteLoading = false;
						$scope.popupCMG.close();
						//ini untuk proposional kan utang per tindakan
					})
					loadData()
				})
			}

			$scope.CatatanKlaim = function () {
				medifirstService.get('registrasi/get-catatan-klaim-bpjs?noregistrasifk='
					+ $scope.dataPasienSelected.norec).then(function (e) {
					$scope.item.catatanklaim = (e.data.catatanklaim == null || e.data.catatanklaim == undefined) ? '' : e.data.catatanklaim.replace(/~/g, "\n")
					$scope.item.pegawaicatatanklaim = e.data.namalengkap
					$scope.item.tglcatatanklaim = e.data.tglcatatanklaim == undefined ? undefined : moment(e.data.tglcatatanklaim).format('DD-MM-YYYY HH:mm:ss')
					});
                $scope.popUpCatatanKlaim.open().center();
        	};

			$scope.simpanCatatanKlaim = function () {
                var norec_pd = '';
                if ($scope.item.norec_pd != undefined) {
                    norec_pd = $scope.item.norec_pd;
                }
                var objSave = {
                    norecpd : $scope.dataPasienSelected.norec,
                    catatanklaim : ($scope.item.catatanklaim == null) ? ' ' : $scope.item.catatanklaim.replace(/\n/ig, '~'),
                }

				medifirstService.post('registrasi/save-catatan-klaim-bpjs', objSave).then( function (e) {
                    $scope.popUpCatatanKlaim.close();
                })
            }

            $scope.batalCatatan = function () {
                $scope.popUpCatatanKlaim.close();
            }

			$scope.popupHapus = function () {
				$scope.dataLogin = JSON.parse(window.localStorage.getItem('pegawai'));
				// if(coderNIK!=320263){
				// 	window.messageContainer.error("Anda tidak punya akses Hapus klaim!!!");
				//      	return;
				// }
				if ($scope.dataPasienSelected.norec == undefined) {
					toastr.error('Pilih Data Pasien dulu', 'Caution');
					return;
				}
				$scope.popupHapusKlaim.center().open();
			}
			$scope.popupEdit = function () {
				$scope.dataLogin = JSON.parse(window.localStorage.getItem('pegawai'));
				// if(coderNIK!=320263){
				// 	window.messageContainer.error("Anda tidak punya akses edit klaim!!!");
				//      	return;
				// }
				if ($scope.dataPasienSelected.norec == undefined) {
					toastr.error('Pilih Data Pasien dulu', 'Caution');
					return;
				}
				$scope.popupEditKlaim.center().open();
			}
			function setItemCMG(data) {
				var dataSpecialCMG = ($scope.dataPasienSelected.special_cmg) ? $scope.dataPasienSelected.special_cmg.split("#") : [];
				for (let i = 0; i < dataSpecialCMG.length; i++) {
					const element = dataSpecialCMG[i];
					if(element == data.code) {
						return {
							code: data.code,
							description: data.description,
						}
					}
				}
			}
			$scope.grouper_2 = function () {
				if(!$scope.dataPasienSelected) {
					toastr.error("Pilih pasien terlebih dahulu !");
					return
				}

				if($scope.dataPasienSelected.statusklaim == 'Final Klaim') {
					toastr.info("Klaim sudah final");
					return
				}

				// if (responData[0].dataresponse.hasOwnProperty("special_cmg_option") == true && responData[0].dataresponse.special_cmg_option.length > 0)

				if($scope.dataPasienSelected.response != null && $scope.dataPasienSelected.response.hasOwnProperty("special_cmg_option") == true && $scope.dataPasienSelected.response.special_cmg_option.length > 0) {
					var spesialDrug = []
					var specialProcedure = []
					var specialProsthesis = []
					var specialInvestigation = []
					for (let i = 0; i < $scope.dataPasienSelected.response.special_cmg_option.length; i++) {
						const element = $scope.dataPasienSelected.response.special_cmg_option[i];
						if (element.type == 'Special Drug') {
							spesialDrug.push(element)
							$scope.item.specialdrug = setItemCMG(element)
						}
						if (element.type == 'Special Procedure') {
							specialProcedure.push(element)
							$scope.item.specialprocedure = setItemCMG(element)
						}
						if (element.type == 'Special Prosthesis') {
							specialProsthesis.push(element)
							$scope.item.specialprosthesis = setItemCMG(element)
						}
						if (element.type == 'Special Investigation') {
							specialInvestigation.push(element)
							$scope.item.specialinvestigation = setItemCMG(element)
						}
					}
					$scope.listspecialdrug = spesialDrug
					$scope.listspecialprocedure = specialProcedure
					$scope.listspecialprosthesis = specialProsthesis
					$scope.listspecialinvestigation = specialInvestigation

					// Get current actions
					var actions = $scope.popupCMG.options.actions;
					// Remove "Close" button
					actions.splice(actions.indexOf("Close"), 1);
					// Set the new options
					$scope.popupCMG.setOptions({ actions : actions });
					$scope.popupCMG.center().open();
				} else {
					toastr.error('Pasien ini Bukan Top-up CMG Options!')
				}
				// var dt1 ={}
				// var dt2 =[]
				// for (var i = dataSave.length - 1; i >= 0; i--) {
				// 	dt1 = {   
				// 		"metadata": {      
				// 			"method":"grouper",      
				// 			"stage":"2"   
				// 		},   
				// 		"data": {      
				// 			"nomor_sep":dataSave[i].nomor_sep ,      
				// 			"special_cmg": "ambil dari table hasil grouper 1"   
				// 		} 
				// 	} 
				// 	dt2.push(dt1)
				// }

				// var objData = {
				// 	  "data": dt2
				// 	}
				// manageTataRekening.savebridginginacbg(objData).then(function(e){
				// 	// simpan response ke database	
				// })
			}

			$scope.cetakCPPT = function () {

				medifirstService.get("bridging/inacbg/get-emr-pasien-cppt?noregistrasi="+ $scope.dataPasienSelected.noregistrasi , true).then(function (e) { 
				
					if (e.data.data == null) {
						toastr.warning('Data tidak ditemukan');
						return;
					}
					var dataItem = e.data.data
	
					var local = JSON.parse(localStorage.getItem('profile'));
					var nama = medifirstService.getPegawaiLogin();

					window.open(baseTransaksi + 'report/cetak-cppt-ranap-rev2?'
					// + $scope.dataSelectedEMR.nocm 
					// + '&norec_apd=' + dataItem.norec_apd 
					+ '&emr=' + dataItem.norec 
					+ '&emrfk=' + dataItem.noemr
					// + '&index=' + $scope.dataSelectedEMR.index
					+ '&kdprofile=' + local.id
					, '_blank');
				})
			}

			$scope.cetakSKMBaru = function () {
                medifirstService.get("bridging/inacbg/get-emr-pasien-skm-all?noregistrasi="+ $scope.dataPasienSelected.noregistrasi , true).then(function (e) { 

            	if (e.data.data == null) {
					toastr.warning('Data tidak ditemukan');
					return;
				}
                var dataItem = e.data.data
                    var local = JSON.parse(localStorage.getItem('profile'));
				var nama = medifirstService.getPegawaiLogin();

				if (dataItem.id == 460011) {
					window.open(baseTransaksi + 'report/cetak-skm-gigi?'
					// + $scope.dataSelectedEMR.nocm 
					// + '&norec_apd=' + dataItem.norec_apd 
					+ '&emr=' + dataItem.norec 
					+ '&emrfk=' + dataItem.id
					// + '&index=' + $scope.dataSelectedEMR.index
					+ '&kdprofile=' + local.id
					+ '&nama=' + nama, '_blank');
				}

				if (dataItem.id == 291032) {
					window.open(baseTransaksi + 'report/cetak-skm-igd-anak?'
					// + $scope.dataSelectedEMR.nocm 
					// + '&norec_apd=' + dataItem.norec_apd 
					+ '&emr=' + dataItem.norec 
					+ '&emrfk=' + dataItem.id
					// + '&index=' + $scope.dataSelectedEMR.index
					+ '&kdprofile=' + local.id
					+ '&nama=' + nama, '_blank');
				}

				if (dataItem.id == 291033) {
					window.open(baseTransaksi + 'report/cetak-skm-igd-dewasa?'
					// + $scope.dataSelectedEMR.nocm 
					// + '&norec_apd=' + dataItem.noreFc_apd 
					+ '&emr=' + dataItem.norec 
					+ '&emrfk=' + dataItem.id
					// + '&index=' + $scope.dataSelectedEMR.index
					+ '&kdprofile=' + local.id
					+ '&nama=' + nama, '_blank');
				}

				if (dataItem.id == 291088) {
					window.open(baseTransaksi + 'report/cetak-resume-hemodialisa?'
					// + $scope.dataSelectedEMR.nocm 
					// + '&norec_apd=' + dataItem.norec_apd 
					+ '&emr=' + dataItem.norec 
					+ '&emrfk=' + dataItem.id
					// + '&index=' + $scope.dataSelectedEMR.index
					+ '&kdprofile=' + local.id
					+ '&nama=' + nama, '_blank');
				}
				
				if (dataItem.id == 291045) {
					window.open(baseTransaksi + 'report/cetak-skm-rajal?'
					// + $scope.dataSelectedEMR.nocm 
					// + '&norec_apd=' + dataItem.norec_apd 
					+ '&emr=' + dataItem.norec 
					+ '&emrfk=' + dataItem.id
					// + '&index=' + $scope.dataSelectedEMR.index
					+ '&kdprofile=' + local.id
					// + '&noregistrasi=' + $scope.dataPasienSelected.noregistrasi
					+ '&nama=' + nama, '_blank');
				}

				if (dataItem.id == 291064) {
					window.open(baseTransaksi + 'report/cetak-skm-fisiobpjs?'
					// + $scope.dataSelectedEMR.nocm 
					// + '&norec_apd=' + dataItem.norec_apd 
					+ '&emr=' + dataItem.norec 
					+ '&emrfk=' + dataItem.id
					// + '&index=' + $scope.dataSelectedEMR.index
					+ '&kdprofile=' + local.id
					// + '&noregistrasi=' + $scope.dataPasienSelected.noregistrasi
					+ '&nama=' + nama, '_blank');
				}

				if (dataItem.id == 291065) {
					window.open(baseTransaksi + 'report/cetak-skm-fisiobpjs?'
					// + $scope.dataSelectedEMR.nocm 
					// + '&norec_apd=' + dataItem.norec_apd 
					+ '&emr=' + dataItem.norec 
					+ '&emrfk=' + dataItem.id
					// + '&index=' + $scope.dataSelectedEMR.index
					+ '&kdprofile=' + local.id
					// + '&noregistrasi=' + $scope.dataPasienSelected.noregistrasi
					+ '&nama=' + nama, '_blank');
				}

				if (dataItem.id == 291074) {
					window.open(baseTransaksi + 'report/cetak-skm-fisioananak?'
					// + $scope.dataSelectedEMR.nocm 
					// + '&norec_apd=' + dataItem.norec_apd 
					+ '&emr=' + dataItem.norec 
					+ '&emrfk=' + dataItem.id
					// + '&index=' + $scope.dataSelectedEMR.index
					+ '&kdprofile=' + local.id
					// + '&noregistrasi=' + $scope.dataPasienSelected.noregistrasi
					+ '&nama=' + nama, '_blank');
				}
				if (dataItem.id == 460195) {
					window.open(baseTransaksi + 'report/cetak-skm-tumbuhkembang?'
					// + $scope.dataSelectedEMR.nocm 
					// + '&norec_apd=' + dataItem.norec_apd 
					+ '&emr=' + dataItem.norec 
					+ '&emrfk=' + dataItem.id
					// + '&index=' + $scope.dataSelectedEMR.index
					+ '&kdprofile=' + local.id
					// + '&noregistrasi=' + $scope.dataPasienSelected.noregistrasi
					+ '&nama=' + nama, '_blank');
				}
				if (dataItem.id == 460196) {
					window.open(baseTransaksi + 'report/cetak-skm-reasstumbuhkembang?'
					// + $scope.dataSelectedEMR.nocm 
					// + '&norec_apd=' + dataItem.norec_apd 
					+ '&emr=' + dataItem.norec 
					+ '&emrfk=' + dataItem.id
					// + '&index=' + $scope.dataSelectedEMR.index
					+ '&kdprofile=' + local.id
					// + '&noregistrasi=' + $scope.dataPasienSelected.noregistrasi
					+ '&nama=' + nama, '_blank');
				}
				if (dataItem.id == 460197) {
					window.open(baseTransaksi + 'report/cetak-skm-fisioananaktk?'
					// + $scope.dataSelectedEMR.nocm 
					// + '&norec_apd=' + dataItem.norec_apd 
					+ '&emr=' + dataItem.norec 
					+ '&emrfk=' + dataItem.id
					// + '&index=' + $scope.dataSelectedEMR.index
					+ '&kdprofile=' + local.id
					// + '&noregistrasi=' + $scope.dataPasienSelected.noregistrasi
					+ '&nama=' + nama, '_blank');
				}

				if ( ([838,870,873,862,850].includes($scope.dataPasienSelected.ruanganid ))) { 
					if (dataItem.id == 291085) {
						window.open(baseTransaksi + 'report/cetak-skm-gigi?'
						// + $scope.dataSelectedEMR.nocm 
						// + '&norec_apd=' + dataItem.norec_apd 
						+ '&emr=' + dataItem.norec 
						+ '&emrfk=' + dataItem.id
						// + '&index=' + $scope.dataSelectedEMR.index
						+ '&kdprofile=' + local.id
						+ '&nama=' + nama, '_blank');
					}
				} else {
					if (dataItem.id == 291085) {
						window.open(baseTransaksi + 'report/cetak-skm-rajal?'
						// + $scope.dataSelectedEMR.nocm 
						// + '&norec_apd=' + dataItem.norec_apd 
						+ '&emr=' + dataItem.norec 
						+ '&emrfk=' + dataItem.id
						// + '&index=' + $scope.dataSelectedEMR.index
						+ '&kdprofile=' + local.id
						// + '&noregistrasi=' + $scope.dataPasienSelected.noregistrasi
						+ '&nama=' + nama, '_blank');
					}
				}

                })
            }
			
			$scope.claim_final = function () {
				var dt1 = {}
				var dt2 = []
				// for (var i = dataSave.length - 1; i >= 0; i--) {
				dt1 = {
					"metadata": {
						"method": "claim_final"
					},
					"data": {
						"nomor_sep": $scope.dataPasienSelected.nosep,//dataSave[i].nomor_sep,      
						"coder_nik": coderNIK,
					}
				}
				dt2.push(dt1)
				// }

				var objData = {
					"data": dt2
				}
				medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
					// response oke saja
					responData = e.data.dataresponse;
					let response = e.data.dataresponse
					let arrStatus =[]
					for (var i = 0; i < response.length; i++) {
						const element = response[i]
						if(element.datarequest.metadata.method == 'claim_final'
							 && element.dataresponse.metadata.code == 200  ){
							arrStatus.push(
								{
									nosep:element.datarequest.data.nomor_sep,
									statusklaim: element.datarequest.metadata.method 
								})
						}
					}
					if(arrStatus.length>0){

						for (var i = 0; i < data2.length; i++) {
							const elem = data2[i]
							for (var ii = 0; ii < arrStatus.length; ii++) {
								const elem2 = arrStatus[ii]
								if(elem.nosep == elem2.nosep){
									elem2.norec = elem.norec
								}
							}
						}

						medifirstService.post('bridging/inacbg/save-status', {'data':arrStatus}).then(function (z) {
							loadData();	
						})
					}
					// medifirstService.post("tatarekening/simpan-verifikasi-tagihan-inacbg/"+$scope.dataPasienSelected.noregistrasi ,$scope.dataPasienSelected)
					// 	.then(function (e) {
					// 		loadData();

					// 	});
					toastr.info(responData[0].dataresponse.metadata.message, 'INACBG');
				})
			}


			$scope.claim_final2 = async function () {
				var dt1 = {}
				var dt2 = []
				// for (var i = dataSave.length - 1; i >= 0; i--) {
				dt1 = {
					"metadata": {
						"method": "claim_final"
					},
					"data": {
						"nomor_sep": $scope.itemPopUp.nomor_sep,//dataSave[i].nomor_sep,      
						"coder_nik": coderNIK,
					}
				}
				dt2.push(dt1)
				// }

				var objData = {
					"data": dt2
				}
				await medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(async function (e) {
					// response oke saja
					responData = e.data.dataresponse;
					let response = e.data.dataresponse
					// save logging
					$scope.saveLogging('Final Klaim', 'No SEP Pasien', e.data.dataresponse[0].datarequest.data.nomor_sep,
							'Final Klaim ' + ' No Registrasi / No RM / No SEP : ' + $scope.itemPopUp.noregistrasi
								+ '/ ' +  $scope.itemPopUp.nocm + ' / '+  e.data.dataresponse[0].datarequest.data.nomor_sep +' Metadata : ' +  e.data.dataresponse[0].datarequest.metadata.method)
					
					let arrStatus =[]
					for (var i = 0; i < response.length; i++) {
						const element = response[i]
						if(element.datarequest.metadata.method == 'claim_final'
							 && element.dataresponse.metadata.code == 200  ){
							arrStatus.push(
								{
									nosep:element.datarequest.data.nomor_sep,
									statusklaim: element.datarequest.metadata.method 
								})
						}
					}
					if(arrStatus.length>0){

						for (var i = 0; i < data2.length; i++) {
							const elem = data2[i]
							for (var ii = 0; ii < arrStatus.length; ii++) {
								const elem2 = arrStatus[ii]
								if(elem.nosep == elem2.nosep){
									elem2.norec = elem.norec
								}
							}
						}

					await	medifirstService.post('bridging/inacbg/save-status', {'data':arrStatus}).then(async function (z) {
						if (z.data.status == 201) {
								for (var x = $scope.listStatus.length - 1; x >= 0; x--) {
									const elem =$scope.listStatus[x]
									if(elem.id == z.data.data ){
										$scope.itemPopUp.statusklaim = elem.name
										$scope.updateDataByNorec($scope.itemPopUp.norec, "statusklaim", elem.name);
									}
								}
							}	
					})
						var dataSave = {
							'namapegawai': $scope.user.namaLengkap,
							'param': 'final',
							'norec': $scope.itemPopUp.norec
						}
					await	medifirstService.post('bridging/inacbg/save-pegawai', dataSave).then(async function (e) {
						})
					}
					// medifirstService.post("tatarekening/simpan-verifikasi-tagihan-inacbg/"+$scope.dataPasienSelected.noregistrasi ,$scope.dataPasienSelected)
					// 	.then(function (e) {
					// 		loadData();

					// 	});
					toastr.info(responData[0].dataresponse.metadata.message, 'INACBG');
				})
			}

			$scope.edit_claim = function () {
				// var push = {
				// 	"noregistrasifk": $scope.dataPasienSelected.norec,
				// 	"id": coderNIK,
				// 	"catatan": $scope.item.catatan,
				// 	"tgleditklaim": moment($scope.now).format('YYYY-MM-DD HH:mm:ss'),
				// 	"status": 'Edit Klaim'
				// }
				// medifirstService.editklaim(push).then(function (e) {
					var dt1 = {}
					var dt2 = []
					// for (var i = dataSave.length - 1; i >= 0; i--) {
					dt1 = {
						"metadata": {
							"method": "reedit_claim"
						},
						"data": {
							"nomor_sep": $scope.dataPasienSelected.nosep,//dataSave[i].nomor_sep,      
						}
					}
					dt2.push(dt1)
					// }

					var objData = {
						"data": dt2
					}
					medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
						// response oke saja
						responData = e.data.dataresponse;
						toastr.info(responData[0].dataresponse.metadata.message, 'INACBG');
						let response = e.data.dataresponse
						let arrStatus =[]
					for (var i = 0; i < response.length; i++) {
						const element = response[i]
						if(element.datarequest.metadata.method == 'reedit_claim'
							 && element.dataresponse.metadata.code == 200  ){
							arrStatus.push(
								{
									nosep:element.datarequest.data.nomor_sep,
									statusklaim: element.datarequest.metadata.method 
								})
						}
					}
					if(arrStatus.length>0){

						for (var i = 0; i < data2.length; i++) {
							const elem = data2[i]
							for (var ii = 0; ii < arrStatus.length; ii++) {
								const elem2 = arrStatus[ii]
								if(elem.nosep == elem2.nosep){
									elem2.norec = elem.norec
								}
							}
						}
	
						medifirstService.post('bridging/inacbg/save-status', {'data':arrStatus}).then(function (z) {
							loadData();
						})
	
					}
					})
				// })
			}

			$scope.send_claim = function () {
				var dt1 = {}
				var dt2 = []
				for (var i = dataSave.length - 1; i >= 0; i--) {
					dt1 = {
						"metadata": {
							"method": "send_claim"
						},
						"data": {
							"start_dt": "",//"2016-01-07",      
							"stop_dt": "",//"2016-01-07",      
							"jenis_rawat": "",//"1",      
							"date_type": "",//"2"   
						}
					}
					dt2.push(dt1)
				}

				var objData = {
					"data": dt2
				}
				medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
					// response simpan ke database		

				})
			}
			$scope.send_claim_individual = function () {
				var dt1 = {}
				var dt2 = []
				// for (var i = dataSave.length - 1; i >= 0; i--) {
				dt1 = {
					"metadata": {
						"method": "send_claim_individual"
					},
					"data": {
						"nomor_sep": $scope.dataPasienSelected.nosep
					}
				}
				dt2.push(dt1)
				// }

				var objData = {
					"data": dt2
				}
				medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
					// response simpan ke database	
					responData = e.data.dataresponse;
					var datasend = {
						"noregistrasifk": $scope.dataPasienSelected.norec
					}
					if (responData[0].dataresponse.metadata.code == "200") {
						manageTataRekening.updatestatusbridginginacbg(datasend).then(function (e) {
							//ini untuk proposional kan utang per tindakan
							loadData();
						})
					}
					toastr.info(responData[0].dataresponse.metadata.message, 'INACBG');
				})
			}

			$scope.send_claim_individual2 = async function () {
				var dt1 = {}
				var dt2 = []
				// for (var i = dataSave.length - 1; i >= 0; i--) {
				dt1 = {
					"metadata": {
						"method": "send_claim_individual"
					},
					"data": {
						"nomor_sep": $scope.itemPopUp.nomor_sep
					}
				}
				dt2.push(dt1)
				// }

				var objData = {
					"data": dt2
				}
				await medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(async function (e) {
					// responData = e.data.dataresponse;
					
					// save logging
					$scope.saveLogging('Kirim Online', 'No SEP Pasien', e.data.dataresponse[0].datarequest.data.nomor_sep,
					'Kirim Online ' + ' No Registrasi / No RM / No SEP : ' + $scope.itemPopUp.noregistrasi
					+ '/ ' +  $scope.itemPopUp.nocm + ' / '+  e.data.dataresponse[0].datarequest.data.nomor_sep +' Metadata : ' +  e.data.dataresponse[0].datarequest.metadata.method)
					// response simpan ke database	
					responData = e.data.dataresponse;
					var datasend = {
						"noregistrasifk": $scope.itemPopUp.norec
					}
					// if (responData[0].dataresponse.metadata.code == "200") {
					// 	manageTataRekening.updatestatusbridginginacbg(datasend).then(function (e) {
					// 		//ini untuk proposional kan utang per tindakan
					// 		loadData();
					// 	})
					// }
					toastr.info(responData[0].dataresponse.metadata.message, 'INACBG');

					let response = e.data.dataresponse
					let arrStatus =[]
					for (var i = 0; i < response.length; i++) {
						const element = response[i]
						if(element.datarequest.metadata.method == 'send_claim_individual'
							 && element.dataresponse.metadata.code == 200  ){
							arrStatus.push(
								{
									nosep:element.datarequest.data.nomor_sep,
									statusklaim: element.datarequest.metadata.method 
								})
						}
					}
					if(arrStatus.length>0){

						for (var i = 0; i < data2.length; i++) {
							const elem = data2[i]
							for (var ii = 0; ii < arrStatus.length; ii++) {
								const elem2 = arrStatus[ii]
								if(elem.nosep == elem2.nosep){
									elem2.norec = elem.norec
								}
							}
						}

						await medifirstService.post('bridging/inacbg/save-status', {'data':arrStatus}).then(async function (z) {
							// loadData();	
							if (z.data.status == 201) {
								for (var x = $scope.listStatus.length - 1; x >= 0; x--) {
									const elem =$scope.listStatus[x]
									if(elem.id == z.data.data ){
										$scope.itemPopUp.statusklaim = elem.name
										$scope.updateDataByNorec($scope.itemPopUp.norec, "statusklaim", elem.name);
									}
								}
							}
						})

						var dataSave = {
							'namapegawai': $scope.user.namaLengkap,
							'param': 'kironline',
							'norec': $scope.itemPopUp.norec
						}
						await medifirstService.post('bridging/inacbg/save-pegawai', dataSave).then(async function (e) {
						})
					}
				})
			}

			$scope.claim_print = function () {
				var dt1 = {}
				var dt2 = []
				// for (var i = dataSave.length - 1; i >= 0; i--) {
				dt1 = {
					"metadata": {
						"method": "claim_print"
					},
					"data": {
						"nomor_sep": $scope.dataPasienSelected.nosep
					}
				}
				dt2.push(dt1)
				// }

				var objData = {
					"data": dt2
				}
				medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
					// response simpan ke database	
					responData = e.data.dataresponse;
					if (responData[0].dataresponse.metadata.code == 200) {

						// const linkSource = 'data:application/pdf;base64,' + responData[0].dataresponse.data;
						// const downloadLink = document.createElement("a");
						// var tglprint = moment($scope.now).format('YYYY-MM-DD');
						// // const fileName = "claim_print_" + responData[0].datarequest.data.nomor_sep + "_" + tglprint + ".pdf";
						// var a = responData[0].datarequest.data.nomor_sep
						// var nama = a.substr(15);
						// const fileName = nama + ".pdf";

						// downloadLink.href = linkSource;
						// downloadLink.download = fileName;
						// downloadLink.click();
						const base64Data = responData[0].dataresponse.data

						const byteCharacters = atob(base64Data)
						const byteNumbers = new Array(byteCharacters.length)
						for (let i = 0; i < byteCharacters.length; i++) {
							byteNumbers[i] = byteCharacters.charCodeAt(i)
						}
						const byteArray = new Uint8Array(byteNumbers)
						const blob = new Blob([byteArray], { type: 'application/pdf' })

						// buat URL dan buka di tab baru
						const fileURL = URL.createObjectURL(blob)
						window.open(fileURL, '_blank')
					}
					// window.open('data:application/pdf;base64,' + responData[0].dataresponse.data);
					toastr.info(responData[0].dataresponse.metadata.message, 'INACBG');
				})
			}

			$scope.delete_claim = async function () {
				// var push = {
				// 	"noregistrasifk": $scope.dataPasienSelected.norec,
				// 	"id": coderNIK,
				// 	"catatan": $scope.item.catatanHapus,
				// 	"tgleditklaim": moment($scope.now).format('YYYY-MM-DD HH:mm:ss'),
				// 	"status": 'Hapus Klaim'
				// }
				// manageTataRekening.editklaim(push).then(function (e) {
					var dt1 = {}
					var dt2 = []
					// for (var i = dataSave.length - 1; i >= 0; i--) {
					dt1 = {
						"metadata": {
							"method": "delete_claim"
						},
						"data": {
							"nomor_sep": $scope.dataPasienSelected.nosep,
							"coder_nik": coderNIK,//dataSave[i].coder_nik   
						}
					}
					dt2.push(dt1)
					// }

					var objData = {
						"data": dt2
					}
					await medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(async function (e) {
						//
						responData = e.data.dataresponse;
						let response = e.data.dataresponse
						let arrStatus =[]
						for (var i = 0; i < response.length; i++) {
							const element = response[i]
							if(element.datarequest.metadata.method == 'delete_claim'
								 && element.dataresponse.metadata.code == 200  ){
								arrStatus.push(
									{
										nosep:element.datarequest.data.nomor_sep,
										statusklaim: null
									})

									var objDelete = {
										norec_pd : $scope.dataPasienSelected.norec
									}	

								await medifirstService.postNonMessage('bridging/inacbg/delete-grouping-idrg', objDelete).then( async function (e) {
									
								})

							}
						}
						if(arrStatus.length>0){

							for (var i = 0; i < data2.length; i++) {
								const elem = data2[i]
								for (var ii = 0; ii < arrStatus.length; ii++) {
									const elem2 = arrStatus[ii]
									if(elem.nosep == elem2.nosep){
										elem2.norec = elem.norec
									}
								}
							}

							medifirstService.post('bridging/inacbg/save-status', {'data':arrStatus}).then(function (z) {
								loadData()
							})
					}
						toastr.info(responData[0].dataresponse.metadata.message, 'INACBG');
					})
				// })

			}
			$scope.delete_patient = function () {
				var dt1 = {}
				var dt2 = []
				// for (var i = dataSave.length - 1; i >= 0; i--) {

				dt1 = {
					"metadata": {
						"method": "delete_patient"
					},
					"data": {
						"nomor_rm": $scope.dataPasienSelected.noRm,
						"coder_nik": coderNIK//dataSave[i].coder_nik   
					}
				}
				dt2.push(dt1)
				// }

				var objData = {
					"data": dt2
				}
				medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
					// 			
				})
			}
			$scope.get_claim_status = function () {
				var dt1 = {}
				var dt2 = []
				for (var i = dataSave.length - 1; i >= 0; i--) {
					dt1 = {
						"metadata": {
							"method": "get_claim_status"
						},
						"data": {
							"nomor_sep": dataSave[i].nomor_sep
						}
					}
					dt2.push(dt1)
				}

				var objData = {
					"data": dt2
				}
				medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
					// 			
				})
			}
			$scope.get_claim_data = function () {
				var dt1 = {}
				var dt2 = []
				for (var i = dataSave.length - 1; i >= 0; i--) {
					dt1 = {
						"metadata": {
							"method": "get_claim_data"
						},
						"data": {
							"nomor_sep": dataSave[i].nomor_sep
						}
					}
					dt2.push(dt1)
				}

				var objData = {
					"data": dt2
				}
				medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
					// 			
				})
			}
			$scope.pull_claim2 = function () {
				var dt1 = {}
				var dt2 = []
				var jnspelayanan = "";
				if ($scope.item.jenispelayanan == 1) {
					jnspelayanan = 1
				}
				else if ($scope.item.jenispelayanan == 2) {
					jnspelayanan = 2
				}
				// for (var i = dataSave.length - 1; i >= 0; i--) {
				dt1 = {
					"metadata": {
						"method": "pull_claim"
					},
					"data": {
						"start_dt": moment($scope.item.periodeAwalPull).format('YYYY-MM-DD'),//"2016-01-07",      
						"stop_dt": moment($scope.item.periodeAkhirPull).format('YYYY-MM-DD'),//"2016-01-07",      
						"jenis_rawat": jnspelayanan//"1"   
					}
				}
				dt2.push(dt1)
				// }

				var objData = {
					"data": dt2
				}
				medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
					responData = e.data.dataresponse;
					if (responData[0].dataresponse.metadata.code == 200) {
						const linkSource = 'data:application/pdf;base64,' + responData[0].dataresponse.data;
						const downloadLink = document.createElement("a");
						var tglprint = moment($scope.now).format('YYYY-MM-DD');
						const fileName = "pull_claim" + "_" + tglprint + ".txt";

						downloadLink.href = linkSource;
						downloadLink.download = fileName;
						downloadLink.click();
					}
					toastr.info(responData[0].dataresponse.metadata.message, 'INACBG');
				})
			}
			$scope.pull_claim = function () {
				$scope.popupPull_Claim.center().open();
				// var dt1 ={}
				// var dt2 =[]
				// for (var i = dataSave.length - 1; i >= 0; i--) {
				// 	dt1 = {   
				// 		"metadata": {      
				// 			"method":"pull_claim"   
				// 		},   
				// 		"data": {      
				// 			"start_dt":"",//"2016-01-07",      
				// 			"stop_dt":"",//"2016-01-07",      
				// 			"jenis_rawat":""//"1"   
				// 		} 
				// 	} 
				// 	dt2.push(dt1)
				// }

				// var objData = {
				// 	  "data": dt2
				// 	}
				// manageTataRekening.savebridginginacbg(objData).then(function(e){
				// 	// 			
				// })
			}
			$scope.search_diagnosis = function () {
				var dt1 = {}
				var dt2 = []
				// for (var i = dataSave.length - 1; i >= 0; i--) {
					dt1 = {
						"metadata": {
							"method": "search_diagnosis_inagrouper"
						},
						"data": {
							"keyword": "(IM)"
						}
					}
					dt2.push(dt1)
				// }

				var objData = {
					"data": dt2
				}
				medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
					// 			
				})
			}
			$scope.search_procedures = function () {
				var dt1 = {}
				var dt2 = []
				// for (var i = dataSave.length - 1; i >= 0; i--) {
					dt1 = {
						"metadata": {
							"method": "search_procedures_inagrouper"
						},
						"data": {
							"keyword": "(IM)"
						}
					}
					dt2.push(dt1)
				// }

				var objData = {
					"data": dt2
				}
				medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
					// 			
				})
			}
			//debugger
			// $scope.simpantglpulang = function(){
			// 	//debugger
			// 	var tglpulang = moment($scope.item.tanggalPulang).format('YYYY-MM-DD HH:mm:ss');
			// 	var updateTanggal = {
			// 		"noregistrasi": $scope.dataPasienSelected.noregistrasi,
			// 		"tglpulang": tglpulang
			// 	}
			// 	manageTataRekening.saveupdatetglpulang(updateTanggal).then(function(e){
			// 		LoadData();				
			// 	})	
			// 		$scope.cbopasienpulang=false;
			// 		$scope.cboUbahDokter=true;
			// }

			// $scope.klikGrid = function(dataPasienSelected){
			// 	if (dataPasienSelected != undefined) {
			// 		$scope.item.namaDokter = {id:dataPasienSelected.pgid,namalengkap:dataPasienSelected.namadokter}
			// 	}
			// }
			$scope.simpan = function () {
				// debugger;
				var objSave =
				{
					norec: $scope.dataPasienSelected.norec,
					objectpegawaifk: $scope.item.namaDokter.id
				}

				manageTataRekening.postSaveDokter(objSave).then(function (e) {
					loadData();
					$scope.cboDokter = false
					$scope.cboUbahDokter = true
				})

				manageTataRekening.saveUpdateDokter(objSave).then(function (e) {
					loadData();
					$scope.cboDokter = false
					$scope.cboUbahDokter = true
				})

				/* update dokter pelayanan pasien yang kosong dokternya */
				var objPost =
				{
					"noregistrasi": $scope.dataPasienSelected.noregistrasi,
					"objectpegawaifk": $scope.item.namaDokter.id
				}
				manageTataRekening.updateDokterPelPasien(objPost).then(function (e) {

				})
				manageTataRekening.updateDokterPelPasienNew(objPost).then(function (e) {

				})



			}
			$scope.Detail = function () {
				if ($scope.dataPasienSelected.noregistrasi != undefined) {
					var objSave = {
						noregistrasi: $scope.dataPasienSelected.noregistrasi
					}
					// manageTataRekening.postJurnalAkuntansi(objSave).then(function (data) {

					// });
					var obj = {
						noRegistrasi: $scope.dataPasienSelected.noregistrasi
					}

					$state.go('RincianTagihan', {
						dataPasien: JSON.stringify(obj)
					});
				}
			}
			$scope.DaftarRuangan = function () {
				if ($scope.dataPasienSelected.noregistrasi != undefined) {
					var obj = {
						noRegistrasi: $scope.dataPasienSelected.noregistrasi
					}


					cacheHelper.set('AntrianPasienDiperiksaNOREG', $scope.dataPasienSelected.noregistrasi);
					// cacheHelper.set('AntrianPasienDiperiksaNOREG', '');
					$state.go('AntrianPasienDiperiksa', {
						dataPasien: JSON.stringify(obj)
					});
				}
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
			$scope.cetakKartu = function () {
				$scope.dataLogin = JSON.parse(window.localStorage.getItem('pegawai'));
				if ($scope.dataPasienSelected.tglpulang == undefined) {
					window.messageContainer.error("Pasien Belum Dipulangkan!!!");
					return;
				}
				if ($scope.dataPasienSelected.noregistrasi == undefined)
					var noReg = "";
				else
					var noReg = $scope.dataPasienSelected.noregistrasi;
				var stt = 'false'
				if (confirm('View Kartu Pulang? ')) {
					// Save it!
					stt = 'true';
				} else {
					// Do nothing!
					stt = 'false'
				}
				var client = new HttpClient();
				client.get('http://127.0.0.1:1237/printvb/kasir?cetak-kip-pasien=1&noregistrasi=' + noReg + '&strIdPegawai=' + $scope.dataLogin.namaLengkap + '&view=' + stt, function (response) {
					// do something with response
				});
			}
			$scope.SuratKontrol = function () {
				if ($scope.dataPasienSelected.noregistrasi != undefined) {
					var obj = {
						noRegistrasi: $scope.dataPasienSelected.noregistrasi
					}

					$state.go('RincianTagihanTataRekening', {
						dataPasien: JSON.stringify(obj)
					});
				}

				$scope.dataLogin = JSON.parse(window.localStorage.getItem('pegawai'));
				if ($scope.dataPasienSelected.noregistrasi == undefined)
					var noregistrasi = "";
				else

					var obj = {
						noRegistrasi: $scope.dataPasienSelected.noregistrasi
					}

				$state.go('PerjanjianPasien', {
					dataPasien: JSON.stringify(obj)
				});
				// var stt = 'false'
				// if (confirm('View Surat Kontrol? ')){
				//     // Save it!
				//     stt='true';
				// }else {
				//     // Do nothing!
				//     stt='false'
				// }
				// var client = new HttpClient();        
				// client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-suratPerjanjianbynocm=1&nocm='+nocm+'&strIdPegawai='+$scope.dataLogin.namaLengkap+'&view='+ stt, function(response) {
				//     // do something with response
				// });
			}
			$scope.EditSEP = function () {
				$scope.item.noPeserta = "";
				$scope.item.noSep = "";

				if ($scope.dataPasienSelected.norec == null) {
					messageContainer.error("Pasien Belum Dipilih!!")
					return;
				}
				if ($scope.dataPasienSelected.kelompokpasien != "BPJS") {
					messageContainer.error("Input SEP hanya untuk pasien BPJS")
					return;
				}
				// if($scope.dataPasienSelected.norec_pa ==null){
				// 	messageContainer.error("Pemakaian Asuransi tidak ada")
				// 	return;
				// }

				if ($scope.dataPasienSelected.nokepesertaan != undefined) {
					$scope.item.noPeserta = $scope.dataPasienSelected.nokepesertaan;
				}

				if ($scope.dataPasienSelected.nokepesertaan != undefined) {
					$scope.item.noSep = $scope.dataPasienSelected.nosep;
				}


				$scope.cboSep = true
				$scope.cboUbahSEP = false
				$scope.cboDokter = false
				$scope.cboUbahDokter = false
			}
			$scope.simpanSep = function () {
				var norec_pa = ""
				if ($scope.dataPasienSelected.norec_pa != undefined)
					norec_pa = $scope.dataPasienSelected.norec_pa
				var updateSep = {
					"norec": $scope.dataPasienSelected.norec,
					"nokepesertaan": $scope.item.noPeserta,
					"nosep": $scope.item.noSep,
					"norec_pa": norec_pa,
					"nocm": $scope.dataPasienSelected.nocm,
				}

				manageTataRekening.postSaveSepTarek(updateSep).then(function (e) {
					loadData();
					$scope.saveLogInputSep()
				})

				$scope.cboSep = false
				$scope.cboUbahSEP = true
				$scope.cboDokter = false
				$scope.cboUbahDokter = true
			}
			$scope.saveLogInputSep = function () {
				var jenisLog = 'Input SEP'
				var referensi = 'Norec Pemakaian Asuransi'
				medifirstService.get("logging/save-log-all?jenislog="
					+ jenisLog + "&referensi=" + referensi
					+ "&noreff=" + $scope.dataPasienSelected.norec_pa
					+ "&keterangan=" + $scope.item.noSep
				).then(function (data) {
					$scope.item.noPeserta = "";
					$scope.item.noSep = "";
				})
			}
			//end log
			$scope.batalSep = function () {
				$scope.item.noPeserta = "";
				$scope.item.noSep = "";
				$scope.cboSep = false
				$scope.cboUbahSEP = true
				$scope.cboDokter = false
				$scope.cboUbahDokter = true
			}

			$scope.push_pengajuan = function () {
				var stt = 'false'
				if (confirm('Generete Pengajuan Klaim Pasien Covid-19? ')) {
					// Save it!
					stt = 'true';
					var dt1 = {}
					var dt2 = []
					// for (var i = dataSave.length - 1; i >= 0; i--) {

					dt1 = {
						"metadata": {
							"method": "generate_claim_number"
						},
						"data": {
							"payor_id": "71"
						}
					}
					dt2.push(dt1)
					// }

					var objData = {
						"data": dt2
					}
					var Los = "";
					medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
						responData = e.data.dataresponse[0].dataresponse.response.claim_number;
						toastr.info(responData, 'Claim Number');
						if ($scope.item.icusatu != undefined) {
							Los = '7;' + $scope.item.icusatu
						}
						if ($scope.item.icudua != undefined) {
							if (Los != "") {
								Los = Los + '#8;' + $scope.item.icudua
							} else {
								Los = '8;' + $scope.item.icudua
							}
						}
						if ($scope.item.icutiga != undefined) {
							if (Los != "") {
								Los = Los + '#9;' + $scope.item.icutiga
							} else {
								Los = '9;' + $scope.item.icutiga
							}
						}
						if ($scope.item.icuempat != undefined) {
							if (Los != "") {
								Los = Los + '#10;' + $scope.item.icuempat
							} else {
								Los = '10;' + $scope.item.icuempat
							}
						}
						if ($scope.item.isosatu != undefined) {
							if (Los != "") {
								Los = Los + '#11;' + $scope.item.isosatu
							} else {
								Los = '11;' + $scope.item.isosatu
							}
						}
						if ($scope.item.isodua != undefined) {
							if (Los != "") {
								Los = Los + '#12;' + $scope.item.isodua
							} else {
								Los = '12;' + $scope.item.isodua
							}
						}
						var postData = {
							"norec_pa": $scope.dataPasienSelected.norec_pa,
							"claim_number": responData,
							"loscovid": Los
						}
						medifirstService.post('bridging/inacbg/save-pengajuan-klaim', postData).then(function (e) {
							$scope.popupPengajuanKlaim.center().close();
							loadData();
						})
						// manageTataRekening.savepengajuanklaim(postData).then(function (e) {
						// 	$scope.popupPengajuanKlaim.center().close();
						// 	loadData();
						// })
					})
				} else {
					// Do nothing!
					stt = 'false'
				}
			}

			$scope.genPengajuan = function () {
				if ($scope.dataPasienSelected.nosep == undefined) {
					toastr.error('Pilih data dulu')
					return
				}
				$scope.item.icusatu = undefined
				$scope.item.icudua = undefined
				$scope.item.isosatu = undefined
				$scope.item.isodua = undefined
				$scope.item.isotiga = undefined
				$scope.item.isoempat = undefined
				$scope.popupPengajuanKlaim.center().open();
			}

			$scope.listFaskes = [{ id: 1, name: 'resume_medis' }
				, { id: 2, name: 'ruang_rawat' }
				, { id: 3, name: 'laboratorium' }
				, { id: 4, name: 'radiologi' }
				, { id: 5, name: 'penunjang_lain' }
				, { id: 6, name: 'resep_obat' }
				, { id: 7, name: 'tagihan' }
				, { id: 8, name: 'kartu_identitas' }
				, { id: 9, name: 'lain_lain' }]

			$scope.uploadcovid19 = function () {
				var a = document.getElementById("base64textarea").value
				var b = document.getElementById("base64textarea").name
				var dt1 = {}
				var dt2 = []
				// for (var i = dataSave.length - 1; i >= 0; i--) {

				dt1 = {
					"metadata": {
						"method": "file_upload",
						"nomor_sep": $scope.dataPasienSelected.nosep,
						"file_class": $scope.item.jenisfaskes,
						"file_name": b,
					},
					"data": a
				}
				dt2.push(dt1)
				// }

				var objData = {
					"data": dt2
				}
				medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
					responData = e.data.dataresponse[0].dataresponse.metadata.message;
					toastr.info(responData, 'file_upload');
					document.getElementById("base64textarea").value = responData
				})
			}

			var handleFileSelect = function (evt) {
				
				var files = evt.target.files;
				var file = files[0];
				var a = evt.target.files[0].name;

				if (files && file) {
					var reader = new FileReader();

					reader.onload = function (readerEvt) {
						var binaryString = readerEvt.target.result;
						document.getElementById("base64textarea").value = btoa(binaryString);
						document.getElementById("base64textarea").name = a;
					};

					reader.readAsBinaryString(file);
				}
			};

			if (window.File && window.FileReader && window.FileList && window.Blob) {
				document.getElementById('filePicker').addEventListener('change', handleFileSelect, false);
			} else {
				alert('The File APIs are not fully supported in this browser.');
			}

			$scope.uploadFile = function () {
				if ($scope.dataPasienSelected.nosep == undefined) {
					toastr.error('Pilih data dulu')
					return
				}
				$scope.popupUploadFile.center().open();
				$scope.item.jenisfaskes = "resume_medis"
			}
			$scope.uploadKelengkapan = function () {
				if ($scope.dataPasienSelected == undefined) {
					toastr.error('Pilih data dulu')
					return
				}
				$scope.listBerkas =[]
				medifirstService.get('bridging/inacbg/get-list-berkas?kpid=' + $scope.dataPasienSelected.kpid + '&noregistrasifk='+$scope.dataPasienSelected.norec ).then(function(e){
					$scope.listBerkas = e.data.data
					$scope.listUpload = e.data.upload
					$scope.item.berkas = $scope.listBerkas[0].id
					for (var i = 0; i < $scope.listBerkas.length; i++) {
						$scope.listBerkas[i].no =  i+1
						const elem = $scope.listBerkas[i]
						for (var x = 0; x < $scope.listUpload .length; x++) {
							const elem2 =$scope.listUpload [x]
							if(elem2.dokasuransifk == elem.id){
								elem.isupload =true
							}
						}
					}
					$scope.popupUpload.center().open();
				})
			}
			$scope.upload = function () {
				    const form = document.querySelector('form')
	                const formData = new FormData()

	                const fileSIP = document.querySelectorAll('.myStr')[0].files[0]
					if (fileSIP != "" && fileSIP != undefined) {
	                    if (fileSIP.size > 3145728 || fileSIP.type != "application/pdf") { //dalam bytes
	                        toastr.error('Maksimum Ukuran File SIP adalah 3 MB dalam Format PDF')
	                        return;
	                    }
	                }
		              
	                formData.append('file', fileSIP)
	                formData.append('norec', '')
	                formData.append('noregistrasifk', $scope.dataPasienSelected.norec)
	                formData.append('dokasuransifk', $scope.item.berkas)
	                const url = baseTransaksi + 'bridging/inacbg/save-berkas'
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
	                    // console.log(response)
	                    if (response.status == 201){
							for (var i = 0; i < $scope.listBerkas.length; i++) {
								const elem = $scope.listBerkas[i]
								if(elem.id == $scope.item.berkas){
									elem.isupload =true
								}
							}
	                        toastr.success('Sukses');
	                        loadData()
	                        document.getElementById("files").value = null;
	                        $scope.popupUpload.close();
	                    }
	                    else
	                        toastr.error('Simpan Gagal');
	                    // $scope.loadDataSip();
	                    // $scope.batalSip();
	                })
	    //             medifirstService.post('bridging/inacbg/save-berkas' ,formData).then(function(e){
					
					// })
	              

			}
			$scope.preview = function () {
			
                var dataItem = $scope.dataPasienSelected
                var strBACKEND = baseTransaksi.replace('service/medifirst2000/', '')
                var str1 = strBACKEND + 'public/berkas/inacbg?noregistrasifk=' + dataItem.norec +'&dokasuransifk='+$scope.item.berkas
                window.open(str1, '_blank');
                
            
			}
			// $("#fileBerkas").kendoUpload({
   //              localization: {
   //                  "select": "Pilih File PDF..."
   //              },

   //              select: function (e) {
   //                  var ALLOWED_EXTENSIONS = [".pdf"];
   //                  var extension = e.files[0].extension.toLowerCase();
   //                  if (ALLOWED_EXTENSIONS.indexOf(extension) == -1) {
   //                      toastr.error('Mohon Pilih File PDF (.pdf)')
   //                      e.preventDefault();
   //                      // return
   //                  }
                   
   //                  var file = e.files[0];
   //                  var stringFile = e.files[0].name
			// 		 const reader = new FileReader();
			// 		    reader.onloadend = () => {
			// 		      // log to console
			// 		      // logs data:<type>;base64,wL2dvYWwgbW9yZ...
			// 		      base64 = reader.result.replace(/^[^,]*,/, '')
			// 		      console.log(base64);
			// 		    };
			// 		    reader.readAsDataURL(file);
   //                  // for (var i = 0; i < e.files.length; i++) {
   //                  //     var file = e.files[i].rawFile;

   //                  //     if (file) {
   //                  //         var reader = new FileReader();
   //                  //         reader.onload = function (e) {
   //                  //             var data = e.target.result;
   //                  //         	$scope.rawFile =data

   //                  //         };

   //                  //         reader.onerror = function (ex) {
   //                  //             console.log(ex);
   //                  //         };

   //                  //         reader.readAsBinaryString(file);
   //                  //     }
   //                  // }
   //              },

   //          })
  			
			$scope.resumeMedis = function () {
				if ($scope.dataPasienSelected == undefined) {
					toastr.error('Pilih data dulu')
					return
				}
				var arrrStr = {
					0: $scope.dataPasienSelected.nocm,
					1: $scope.dataPasienSelected.namapasien,
					2: $scope.dataPasienSelected.jeniskelamin,
					3: $scope.dataPasienSelected.noregistrasi,
					// 4: $scope.dataPasienSelected.umur,
					5: $scope.dataPasienSelected.kelompokpasien,
					6: $scope.dataPasienSelected.tglregistrasi,
					// 7: $scope.dataPasienSelected.norec,
					8: $scope.dataPasienSelected.norec,
					// 9: $scope.dataPasienSelected.objectkelasfk,
					// 10: $scope.dataPasienSelected.namakelas,
					11: $scope.dataPasienSelected.ruanganid,
					12: $scope.dataPasienSelected.namaruangan
				}
				cacheHelper.set('cacheRekamMedis', arrrStr);
				$state.go('ResumeMedisRI')
			}
			function postKunjunganYankes() {
				let status = false
				var tanggal = moment(new Date()).format('YYYY-MM-DD')
				medifirstService.get('yankes/get-kunjungan?tgl=' + tanggal)
					.then(function (a) {
						var result = a
						if (result.data.list != undefined && result.data.list.length > 0) {
							for (var i = 0; i < result.data.list.length; i++) {
								if (moment(new Date()).format('YYYY-MM-DD') == result.data.list[i].tanggal) {
									status = true
									medifirstService.get('yankes/count-kunjungan-pasien')
										.then(function (d) {
											let datt = d.data
											var jsonSave = {
												"data": {
													"kode_kirim": result.data.list[i].kode,
													"tanggal": moment(new Date()).format('YYYY-MM-DD'),
													"kunjungan_rj": datt.data.rawat_jalan,
													"kunjungan_igd": datt.data.igd,
													"pasien_ri": datt.masihDirawat// result.data.rawat_inap,
												}
											}

											manageTataRekening.postData('yankes/update-kunjungan', jsonSave)
												.then(function (c) {
													var resp = c.data
													if (resp.kode == 200) {
														toastr.success('Post Bridging Yankes')
													}

												}, error => {
													toastr.error('Post Bridging Yankes Gagal')
												});
										})
									break
								}
							}
						}
						if (status == false) {
							medifirstService.get('yankes/count-kunjungan-pasien')
								.then(function (b) {
									let result = b.data
									var jsonSave = {
										"data": {
											"kode_kirim": null,
											"tanggal": moment(new Date()).format('YYYY-MM-DD'),
											"kunjungan_rj": result.data.rawat_jalan,
											"kunjungan_igd": result.data.igd,
											"pasien_ri": result.masihDirawat// result.data.rawat_inap,
										}
									}

									manageTataRekening.postData('yankes/insert-kunjungan', jsonSave)
										.then(function (c) {
											var resp = c.data
											if (resp.kode == 200) {
												toastr.success('Post Bridging Yankes')
											}

										}, error => {
											toastr.error('Post Bridging Yankes Gagal')
										});
								})
						}
					})

			}
			function getSisrute() {
				debugger
				var now = moment(new Date()).format('YYYY-MM-DD')
				medifirstService.get('sisrute/rujukan/get?tanggal=' + now).then(function (response) {
					$scope.jmlRujukanMasuk = response.data.total
					// console.log('rujukan masuk : ' + response.data.total)
				})
				medifirstService.get('sisrute/rujukan/get?tanggal=' + now + '&create=true').then(function (response) {
					$scope.jmlRujukanKeluar = response.data.total
					// console.log('rujukan masuk : ' + response.data.total)
				})
			}
			// postRujukanYankes()
			function postRujukanYankes() {
				debugger
				let status = false
				medifirstService.get('yankes/get-rujukan?tgl=' + moment(new Date()).format('YYYY-MM-DD')).then(function (res) {
					var resultData = res.data.list
					if (resultData != undefined && resultData.length > 0) {
						for (var i = 0; i < resultData.length; i++) {
							if (moment(new Date()).format('YYYY-MM-DD') == resultData[i].tanggal) {
								status = true
								var jsonSave = {
									"data": {
										"kode_kirim": resultData[i].kode,
										"tanggal": resultData[i].tanggal,
										"jumlah_rujukan": $scope.jmlRujukanMasuk,
										"jumlah_rujuk_balik": $scope.jmlRujukanKeluar,
									}
								}
								manageTataRekening.postData('yankes/update-rujukan', jsonSave)
									.then(function (response) {
										// console.log('Update Yankes Rujukan')
									}, error => {
									});
								break
							}
						}
					}

					if (status == false) {
						var da = {
							"data": {
								"kode_kirim": null,
								"tanggal": moment(new Date()).format('YYYY-MM-DD'),
								"jumlah_rujukan": $scope.jmlRujukanMasuk,
								"jumlah_rujuk_balik": $scope.jmlRujukanKeluar,

							}
						}

						manageTataRekening.postData('yankes/insert-rujukan', da)
							.then(function (response) {
								console.log('Insert Yankes Rujukan')
							}, error => {
							});
					}
				})

			}

			$scope.emr = function(){
				if ($scope.dataPasienSelected.noregistrasi == undefined) {
					toastr.error('Pilih Pasien Terlebih dahulu!!!')
						return;
				}
				var emrfk = [291039,291033,460006,290006,291045,291064,291065,291074, 460008,460000,460067,460068,291059,291049,291076,291042] // emrfk 

				medifirstService.get("bridging/inacbg/get-daftar-emr-rev?noregistrasi=" + $scope.dataPasienSelected.noregistrasi + '&emrfk=' + emrfk
					// medifirstService.get("lab-radiologi/get-rincian-pelayanan?objectdepartemenfk=" + departemenfk + "&noregistrasi=" +   $scope.item.noregistrasi
					, true).then(function (dat) {
						$scope.dataDaftarEMR = {
							data: dat.data.data,
							_data: dat.data.data,
							// pageSize: 10,
							selectable: true,
							refresh: true,
							total: dat.data.data.length,
							serverPaging: false,
							aggregate: [
								{ field: 'total', aggregate: 'sum' },
							]
						};
					}, function (error) {
						$scope.isLoading = false;
						});
				$scope.popUpDaftarEMR.center().open();
			}	

			$scope.columnDaftarEMR = {
				columns: [
					{
						"field": "tglemr",
						"title": "Tgl EMR",
						"width": "90px",
					},                   
					{
						"field": "emrpasienfk",
						"title": "No EMR",
						"width": "160px"
					},
					{
						"field": "namaform",
						"title": "Nama EMR",
						"width": "160px"
					},
				],
				sortable: {
					mode: "single",
					allowUnsort: false,
				}
			}

			$scope.cetakEMR = function () {
				if ($scope.dataSelectedEMR == undefined) {
					toastr.error('Data belum dipilih!!!')
						return;
				}

				var local = JSON.parse(localStorage.getItem('profile'));
				var nama = medifirstService.getPegawaiLogin();
				if ($scope.dataSelectedEMR.emrfk == 291039) {
					window.open(baseTransaksi + 'report/cetak-laporan-operasi?nocm='
					+ $scope.dataSelectedEMR.nocm 
					+ '&norec_apd=' + $scope.dataSelectedEMR.norec_apd 
					+ '&emr=' + $scope.dataSelectedEMR.norec 
					+ '&emrfk=' + $scope.dataSelectedEMR.emrfk
					+ '&index=' + $scope.dataSelectedEMR.index
					+ '&kdprofile=' + local.id
					+ '&nama=' + nama, '_blank');
				}

				if ($scope.dataSelectedEMR.emrfk == 291033) {
					window.open(baseTransaksi + 'report/cetak-triase-new?nocm='
					+ $scope.dataSelectedEMR.nocm 
					+ '&norec_apd=' + $scope.dataSelectedEMR.norec_apd 
					+ '&emr=' + $scope.dataSelectedEMR.norec 
					+ '&emrfk=' + $scope.dataSelectedEMR.emrfk
					+ '&index=' + $scope.dataSelectedEMR.index
					+ '&kdprofile=' + local.id
					+ '&nama=' + nama, '_blank');
				}

				if ($scope.dataSelectedEMR.emrfk == 460006) {
					window.open(baseTransaksi + 'report/cetak-ringkasan-pulang-pasien?nocm='
					+ $scope.dataSelectedEMR.nocm 
					+ '&norec_apd=' + $scope.dataSelectedEMR.norec_apd 
					+ '&emr=' + $scope.dataSelectedEMR.norec 
					+ '&emrfk=' + $scope.dataSelectedEMR.emrfk
					+ '&index=' + $scope.dataSelectedEMR.index
					+ '&kdprofile=' + local.id
					+ '&nama=' + nama, '_blank');
				}
				
				if ($scope.dataSelectedEMR.emrfk == 290006) {
					window.open(baseTransaksi + 'report/cetak-spri?nocm='
					+ $scope.dataSelectedEMR.nocm 
					+ '&norec_apd=' + $scope.dataSelectedEMR.norec_apd 
					+ '&emr=' + $scope.dataSelectedEMR.norec 
					+ '&emrfk=' + $scope.dataSelectedEMR.emrfk
					+ '&index=' + $scope.dataSelectedEMR.index
					+ '&kodeprofile=' + local.id
					+ '&noregistrasi=' + $scope.dataPasienSelected.noregistrasi
					+ '&nama=' + nama, '_blank');
				}

				if ($scope.dataSelectedEMR.emrfk == 291064) {
					window.open(baseTransaksi + 'report/cetak-asesmen-fisio-bpjs?nocm='
					+ $scope.dataSelectedEMR.nocm 
					+ '&norec_apd=' + $scope.dataSelectedEMR.norec_apd 
					+ '&emr=' + $scope.dataSelectedEMR.norec 
					+ '&emrfk=' + $scope.dataSelectedEMR.emrfk
					+ '&index=' + $scope.dataSelectedEMR.index
					+ '&kdprofile=' + local.id
					+ '&noregistrasi=' + $scope.dataPasienSelected.noregistrasi
					+ '&nama=' + nama, '_blank');
				}
				if ($scope.dataSelectedEMR.emrfk == 291065) {
					window.open(baseTransaksi + 'report/cetak-asesmen-fisio-wicara?nocm='
					+ $scope.dataSelectedEMR.nocm 
					+ '&norec_apd=' + $scope.dataSelectedEMR.norec_apd 
					+ '&emr=' + $scope.dataSelectedEMR.norec 
					+ '&emrfk=' + $scope.dataSelectedEMR.emrfk
					+ '&index=' + $scope.dataSelectedEMR.index
					+ '&kdprofile=' + local.id
					+ '&noregistrasi=' + $scope.dataPasienSelected.noregistrasi
					+ '&nama=' + nama, '_blank');
				}
				if ($scope.dataSelectedEMR.emrfk == 291074) {
					window.open(baseTransaksi + 'report/cetak-asesmen-fisioterapi-anak?nocm='
					+ $scope.dataSelectedEMR.nocm 
					+ '&norec_apd=' + $scope.dataSelectedEMR.norec_apd 
					+ '&emr=' + $scope.dataSelectedEMR.norec 
					+ '&emrfk=' + $scope.dataSelectedEMR.emrfk
					+ '&index=' + $scope.dataSelectedEMR.index
					+ '&kdprofile=' + local.id
					+ '&noregistrasi=' + $scope.dataPasienSelected.noregistrasi
					+ '&nama=' + nama, '_blank');
				}
				//io
				if ($scope.dataSelectedEMR.emrfk == 460008) {
					window.open(baseTransaksi + 'report/cetak-intake-output?nocm='
					+ $scope.dataSelectedEMR.nocm 
					+ '&norec_apd=' + $scope.dataSelectedEMR.norec_apd 
					+ '&emr=' + $scope.dataSelectedEMR.norec 
					+ '&emrfk=' + $scope.dataSelectedEMR.emrfk
					+ '&index=' + $scope.dataSelectedEMR.index
					+ '&kdprofile=' + local.id
					+ '&noregistrasi=' + $scope.dataPasienSelected.noregistrasi
					+ '&nama=' + nama, '_blank');
				}
				//rimedis
				if ($scope.dataSelectedEMR.emrfk == 460000) {
					window.open(baseTransaksi + 'report/cetak-asesmen-ranap-medis?nocm='
					+ $scope.dataSelectedEMR.nocm 
					+ '&norec_apd=' + $scope.dataSelectedEMR.norec_apd 
					+ '&emr=' + $scope.dataSelectedEMR.norec 
					+ '&emrfk=' + $scope.dataSelectedEMR.emrfk
					+ '&index=' + $scope.dataSelectedEMR.index
					+ '&kdprofile=' + local.id
					+ '&noregistrasi=' + $scope.dataPasienSelected.noregistrasi
					+ '&nama=' + nama, '_blank');
				}
				if ($scope.dataSelectedEMR.emrfk == 460067) {
					window.open(baseTransaksi + 'report/cetak-asesmen-ranap--medis-obstetri?nocm='
					+ $scope.dataSelectedEMR.nocm 
					+ '&norec_apd=' + $scope.dataSelectedEMR.norec_apd 
					+ '&emr=' + $scope.dataSelectedEMR.norec 
					+ '&emrfk=' + $scope.dataSelectedEMR.emrfk
					+ '&index=' + $scope.dataSelectedEMR.index
					+ '&kdprofile=' + local.id
					+ '&noregistrasi=' + $scope.dataPasienSelected.noregistrasi
					+ '&nama=' + nama, '_blank');
				}
				if ($scope.dataSelectedEMR.emrfk == 460068) {
					window.open(baseTransaksi + 'report/cetak-asesmen-ranap--medis-ginekologi?nocm='
					+ $scope.dataSelectedEMR.nocm 
					+ '&norec_apd=' + $scope.dataSelectedEMR.norec_apd 
					+ '&emr=' + $scope.dataSelectedEMR.norec 
					+ '&emrfk=' + $scope.dataSelectedEMR.emrfk
					+ '&index=' + $scope.dataSelectedEMR.index
					+ '&kdprofile=' + local.id
					+ '&noregistrasi=' + $scope.dataPasienSelected.noregistrasi
					+ '&nama=' + nama, '_blank');
				}
				if ($scope.dataSelectedEMR.emrfk == 291059) {
					window.open(baseTransaksi + 'report/cetak-asesmen-neonatus-medis?nocm='
					+ $scope.dataSelectedEMR.nocm 
					+ '&norec_apd=' + $scope.dataSelectedEMR.norec_apd 
					+ '&emr=' + $scope.dataSelectedEMR.norec 
					+ '&emrfk=' + $scope.dataSelectedEMR.emrfk
					+ '&index=' + $scope.dataSelectedEMR.index
					+ '&kdprofile=' + local.id
					+ '&noregistrasi=' + $scope.dataPasienSelected.noregistrasi
					+ '&nama=' + nama, '_blank');
				}
				//informed
				if ($scope.dataSelectedEMR.emrfk == 291049) {
					window.open(baseTransaksi + 'report/cetak-informed-consent1?nocm='
					+ $scope.dataSelectedEMR.nocm 
					+ '&norec_apd=' + $scope.dataSelectedEMR.norec_apd 
					+ '&emr=' + $scope.dataSelectedEMR.norec 
					+ '&emrfk=' + $scope.dataSelectedEMR.emrfk
					+ '&index=' + '1'
					+ '&kdprofile=' + local.id
					+ '&noregistrasi=' + $scope.dataPasienSelected.noregistrasi
					+ '&nama=' + nama, '_blank');
				}
				//tranfusi
				if ($scope.dataSelectedEMR.emrfk == 291076) {
					window.open(baseTransaksi + 'report/cetak-tranfusi-darah-new?nocm='
					+ $scope.dataSelectedEMR.nocm 
					+ '&norec_apd=' + $scope.dataSelectedEMR.norec_apd 
					+ '&emr=' + $scope.dataSelectedEMR.norec 
					+ '&emrfk=' + $scope.dataSelectedEMR.emrfk
					+ '&index=' + $scope.dataSelectedEMR.index
					+ '&kdprofile=' + local.id
					+ '&noregistrasi=' + $scope.dataPasienSelected.noregistrasi
					+ '&nama=' + nama, '_blank');
				}
				//peltilator
				if ($scope.dataSelectedEMR.emrfk == 291042) {
					window.open(baseTransaksi + 'report/cetak-penggunaan-ventilator?nocm='
					+ $scope.dataSelectedEMR.nocm 
					+ '&norec_apd=' + $scope.dataSelectedEMR.norec_apd 
					+ '&emr=' + $scope.dataSelectedEMR.norec 
					+ '&emrfk=' + $scope.dataSelectedEMR.emrfk
					+ '&index=' + $scope.dataSelectedEMR.index
					+ '&kdprofile=' + local.id
					+ '&noregistrasi=' + $scope.dataPasienSelected.noregistrasi
					+ '&nama=' + nama, '_blank');
				}
				
			}

			$scope.cetakSKM = function () {

				if ($scope.dataSelectedEMR == undefined) {
					toastr.error('Data belum dipilih!!!')
						return;
				}


                window.open(baseTransaksi + 'report/cetak-skm-rajal?'
					+ '&emr=' + $scope.dataSelectedEMR.norec 
					+ '&emrfk=' + 291045
					+ '&kdprofile=' + 46
					, '_blank');
            }

			$scope.openBerkas = function () {
				loadGridBerkas();
                $scope.popUpBerkasLainnya.open().center();
        	};


			function loadGridBerkas() {
				// $scope.isRouteLoading = true
				document.getElementById("load-berkaslain").style.display  = "block";
				medifirstService.get("emr/get-berkas-pasien-asesmen?" + 'nocm=' + $scope.dataPasienSelected.nocm, true).then(function (dat) {
					$scope.isRouteLoading = false
					$scope.dataDaftar = new kendo.data.DataSource({
						data: dat.data.data,
						pageSize: 10,
						serverPaging: false,
						schema: {
							model: {
								fields: {
								}
							}
						}
					});
					document.getElementById("load-berkaslain").style.display  = "none";
				});		
			}

			$scope.columnDaftarBrksLain = {
                selectable: 'row',
                pageable: true,
                columns:
                    [ 
                        {
                            "field": "noregistrasi",
                            "title": "No Registrasi",
                            "width": "10%",
                        },
                        {
                            "field": "tglemr",
                            "title": "Tgl Upload",
                            "width": "10%",
                            "template": "<span class='style-left'>{{formatTanggal('#: tglemr #')}}</span>"
                        },
                        {
                            "field": "namafile",
                            "title": "Nama File",
                            "width": "25%",
                        },
                        {
                            "field": "deskripsi",
                            "title": "Deskripsi",
                            "width": "45%",
                        },
                        {
                            "command": [
                                { text: "Lihat", click: LihatBerkasNew },
                                { text: "Download", click: DownloadBerkasNew }
                            ],
                            title: "",
                            width: "15%",
                        }
                    ]
            }


			function LihatBerkasNew(e) 
            {
                e.preventDefault();
				var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                var strBACKEND = baseTransaksi.replace('service/medifirst2000/', '')
                window.open(strBACKEND + "service/storage/berkaspasien?nocm="+ dataItem.nocm + "&filename=" + dataItem.namafile);
            }
            function DownloadBerkasNew(e) 
            {
                e.preventDefault();
				var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                var strBACKEND = baseTransaksi.replace('service/medifirst2000/', '')
                window.open(strBACKEND + "service/storage/berkaspasien/download?nocm="+ dataItem.nocm + "&filename=" + dataItem.namafile);
            }

			// 	$scope.pengkajian = function () {


            //     if ($scope.dataPasienSelected == undefined) {
            //         window.messageContainer.error("Pilih Dahulu Pasien!")
            //         return
            //     }
            //     medifirstService.get("registrasi/daftar-registrasi/get-apd?noregistrasi="
			// 			+ $scope.dataPasienSelected.noregistrasi
			// 			+ "&objectruanganlastfk=" + $scope.dataPasienSelected.objectruanganlastfk
			// 			).then(function (data) {
						
					
						
					
            //     // debugger;
            //     var arrStr = {
            //         0: $scope.dataPasienSelected.nocm,
            //         1: $scope.dataPasienSelected.namapasien,
            //         2: $scope.dataPasienSelected.jeniskelamin,
            //         3: $scope.dataPasienSelected.noregistrasi,
            //         4: $scope.dataPasienSelected.umur,
            //         5: $scope.dataPasienSelected.kelompokpasien,
            //         6: $scope.dataPasienSelected.tglregistrasi,
            //         7: data.data.ruangan[0].norec_apd,
            //         8: $scope.dataPasienSelected.norec,
            //         9: $scope.dataPasienSelected.objectkelasfk,
            //         10: $scope.dataPasienSelected.namakelas,
            //         11: $scope.dataPasienSelected.objectruanganlastfk,
            //         12: $scope.dataPasienSelected.namaruangan + '`'
            //     }
            //     cacheHelper.set('cacheRMelektronik', arrStr);
            //     $state.go('RekamMedis.VitalSign', {
            //         noRec: data.data.ruangan[0].norec_apd
            //     })

				
			// })
			// }

			$scope.pengkajian = function () {
				if ($scope.dataPasienSelected.noregistrasi == undefined) {
					window.messageContainer.error("Pilih Dahulu Pasien!");
					return;
				}
				// medifirstService.get("registrasi/daftar-registrasi/get-apd?noregistrasi="
				// 	+ $scope.dataPasienSelected.noregistrasi
				// 	+ "&objectruanganlastfk=" + $scope.dataPasienSelected.objectruanganlastfk
				// ).then(function (data) {
					var arrStr = {
						0: $scope.dataPasienSelected.nocm,
						1: $scope.dataPasienSelected.namapasien,
						2: $scope.dataPasienSelected.jeniskelamin,
						3: $scope.dataPasienSelected.noregistrasi,
						4: $scope.dataPasienSelected.umur,
						5: $scope.dataPasienSelected.kelompokpasien,
						6: $scope.dataPasienSelected.tglregistrasi,
						7: $scope.dataPasienSelected.norec_apd,
						8: $scope.dataPasienSelected.norec,
						9: $scope.dataPasienSelected.objectkelasfk,
						10: $scope.dataPasienSelected.namakelas,
						11: $scope.dataPasienSelected.ruanganid,
						12: $scope.dataPasienSelected.namaruangan + '`'
					};
					cacheHelper.set('cacheRMelektronik', arrStr);
					
					// Open a new tab with the specified URL
					var newTab = window.open('#/RekamMedis/' + $scope.dataPasienSelected.norec_apd +'/AsesmenMedis' , '_blank');
					if (newTab) {
						newTab.focus(); // Focus on the new tab if it was successfully opened
					} else {
						alert('A new tab was blocked by the browser. Please allow pop-ups for this site.');
					}
				// });
			}
			$scope.hitungSpecialCMG2 = function(e) {
				var cmg = "";
				if ($scope.item.specialprocedure) {
					if (cmg != "") {
						cmg = cmg + '#' + $scope.item.specialprocedure.code
					} else {
						cmg = $scope.item.specialprocedure.code
					}
				}
				if ($scope.item.specialprosthesis) {
					if (cmg != "") {
						cmg = cmg + '#' + $scope.item.specialprosthesis.code
					} else {
						cmg = $scope.item.specialprosthesis.code
					}
				}
				if ($scope.item.specialinvestigation) {
					if (cmg != "") {
						cmg = cmg + '#' + $scope.item.specialinvestigation.code
					} else {
						cmg = $scope.item.specialinvestigation.code
					}
				}
				if ($scope.item.specialdrug) {
					if (cmg != "") {
						cmg = cmg + '#' + $scope.item.specialdrug.code
					} else {
						cmg = $scope.item.specialdrug.code
					}
				}
				if (cmg != '') {
					var dt1 = {}
					var dt2 = []
					dt1 = {
						"metadata": {
							"method": "grouper",
							"stage": "2",
							"grouper": "inacbg"
						},
						"data": {
							"nomor_sep": $scope.itemPopUp.nosep,
							"special_cmg": cmg//"ambil dari table hasil grouper 1"   
						}
					}
					dt2.push(dt1)
					var objData = {
						"data": dt2
					}
					$scope.isRouteLoading = true;
					medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
						$scope.isRouteLoading = false;
						$scope.itemPopUp.response = e.data.dataresponse[0].dataresponse
					})
				}

				
			}
			$scope.hitungSpecialCMG = function(e) {
				var cmg = "";
				if ($scope.item.specialprocedure) {
					if (cmg != "") {
						cmg = cmg + '#' + $scope.item.specialprocedure.code
					} else {
						cmg = $scope.item.specialprocedure.code
					}
				}
				if ($scope.item.specialprosthesis) {
					if (cmg != "") {
						cmg = cmg + '#' + $scope.item.specialprosthesis.code
					} else {
						cmg = $scope.item.specialprosthesis.code
					}
				}
				if ($scope.item.specialinvestigation) {
					if (cmg != "") {
						cmg = cmg + '#' + $scope.item.specialinvestigation.code
					} else {
						cmg = $scope.item.specialinvestigation.code
					}
				}
				if ($scope.item.specialdrug) {
					if (cmg != "") {
						cmg = cmg + '#' + $scope.item.specialdrug.code
					} else {
						cmg = $scope.item.specialdrug.code
					}
				}

				var dt1 = {}
				var dt2 = []
				dt1 = {
					"metadata": {
						"method": "grouper",
						"stage": "2"
					},
					"data": {
						"nomor_sep": $scope.dataPasienSelected.nosep,
						"special_cmg": cmg//"ambil dari table hasil grouper 1"   
					}
				}
				dt2.push(dt1)
				var objData = {
					"data": dt2
				}
				$scope.isRouteLoading = true;
				medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
					$scope.isRouteLoading = false;
					$scope.dataPasienSelected.response = e.data.dataresponse[0].dataresponse
				})
			}

			$scope.getSpecialCMG = function(data, type, ambil) {
				if(data) {
					for (let i = 0; i < data.length; i++) {
						const element = data[i];
						if(element.type == type) {
							if(ambil == "code") { return element.code }
							if(ambil == "tarif") { return element.tariff }
						}
					}
					if(ambil == "code") { return "" }
					if(ambil == "tarif") { return 0 }
				}
			}

			$scope.batalgrouper2 = function() {
				$scope.lanjutgrouping();
				$scope.popupCMG.close();
			}

			$scope.popupApgar = function () {
				if(!$scope.dataPasienSelected) {
					toastr.error("Pilih pasien terlebih dahulu !");
					return
				}

				if($scope.dataPasienSelected.statusklaim == 'Final Klaim') {
					toastr.info("Klaim sudah final");
					return
				}

				$scope.itemPopUp.apgar1mappear = parseFloat($scope.dataPasienSelected.menit1_appear)
				$scope.itemPopUp.apgar1mpulse = parseFloat($scope.dataPasienSelected.menit1_pulse)
				$scope.itemPopUp.apgar1mgrimace = parseFloat($scope.dataPasienSelected.menit1_grimace)
				$scope.itemPopUp.apgar1mactivity = parseFloat($scope.dataPasienSelected.menit1_activity)
				$scope.itemPopUp.apgar1mresp = parseFloat($scope.dataPasienSelected.menit1_resp)
				$scope.itemPopUp.apgar5mappear = parseFloat($scope.dataPasienSelected.menit5_appear)
				$scope.itemPopUp.apgar5mpulse = parseFloat($scope.dataPasienSelected.menit5_pulse)
				$scope.itemPopUp.apgar5mgrimace = parseFloat($scope.dataPasienSelected.menit5_grimace)
				$scope.itemPopUp.apgar5mactivity = parseFloat($scope.dataPasienSelected.menit5_activity)
				$scope.itemPopUp.apgar5mresp = parseFloat($scope.dataPasienSelected.menit5_resp)

				// Get current actions
				var actions = $scope.popupApgarScore.options.actions;
				// Remove "Close" button
				actions.splice(actions.indexOf("Close"), 1);
				// Set the new options
				$scope.popupApgarScore.setOptions({ actions : actions });
				$scope.popupApgarScore.center().open();
			}

			$scope.simpanapgar = function () { 
				var jsonSave = {
					"noregistrasifk": $scope.dataPasienSelected.norec,
					"1menit_appear": ($scope.itemPopUp.apgar1mappear) ? $scope.itemPopUp.apgar1mappear : 0,
					"1menit_pulse": ($scope.itemPopUp.apgar1mpulse) ? $scope.itemPopUp.apgar1mpulse : 0,
					"1menit_grimace": ($scope.itemPopUp.apgar1mgrimace) ? $scope.itemPopUp.apgar1mgrimace : 0,
					"1menit_activity": ($scope.itemPopUp.apgar1mactivity) ? $scope.itemPopUp.apgar1mactivity : 0,
					"1menit_resp": ($scope.itemPopUp.apgar1mresp) ? $scope.itemPopUp.apgar1mresp : 0,
					"5menit_appear": ($scope.itemPopUp.apgar5mappear) ? $scope.itemPopUp.apgar5mappear : 0,
					"5menit_pulse": ($scope.itemPopUp.apgar5mpulse) ? $scope.itemPopUp.apgar5mpulse : 0,
					"5menit_grimace": ($scope.itemPopUp.apgar5mgrimace) ? $scope.itemPopUp.apgar5mgrimace : 0,
					"5menit_activity": ($scope.itemPopUp.apgar5mactivity) ? $scope.itemPopUp.apgar5mactivity : 0,
					"5menit_resp": ($scope.itemPopUp.apgar5mresp) ? $scope.itemPopUp.apgar5mresp : 0,
				}
				$scope.isRouteLoading = true
				medifirstService.post('bridging/inacbg/save-apgar-score', jsonSave).then(function (e) {
					$scope.isRouteLoading = false
					loadData();
					$scope.batalapgar();
				})
			}

			$scope.batalapgar = function () {
				delete $scope.itemPopUp.apgar1mappear
				delete $scope.itemPopUp.apgar1mpulse
				delete $scope.itemPopUp.apgar1mgrimace
				delete $scope.itemPopUp.apgar1mactivity
				delete $scope.itemPopUp.apgar1mresp
				delete $scope.itemPopUp.apgar5mappear
				delete $scope.itemPopUp.apgar5mpulse
				delete $scope.itemPopUp.apgar5mgrimace
				delete $scope.itemPopUp.apgar5mactivity
				delete $scope.itemPopUp.apgar5mresp
				$scope.popupApgarScore.close();
			}

			function loadicd() {
                var norReg = ""
                if ($scope.itemPopUp.noregistrasi != undefined) {
                    norReg = "noReg=" + $scope.itemPopUp.noregistrasi;
                }
			
                medifirstService.get("registrasi/get-diagnosa-10-by-noreg?"
                    + norReg + '&inacbg=true'
                ).then(function (data) {
					$scope.isRouteLoading = false;
					if (data.data.inacbg.length > 0) {
                        $scope.item.jenisDiagnosis = {id: 18, jenisDiagnosa: "Secondary UNU Grouper"}
						$scope.itemPopUp.icd10 = data.data.icd10;
						// console.log($scope.itemPopUp.icd10);
                    } else {
						$scope.itemPopUp.icd10 = "#"
						$scope.item.jenisDiagnosis = {id: 17, jenisDiagnosa: "Primary / utama UNU Grouper"}
					}

					if (['Grouping iDRG Final','Grouping INACBG Reedit','Grouping'].includes($scope.itemPopUp.statusklaim) && $scope.isimportidrg == false) {
						$scope.setInacbgIcd10()
						// $scope.isimportidrg = false
					}

					var a = data.data.inacbg.length;
					// for (var i = 0; i < data.data.inacbg.length; i++) {
					// 	if (data.data.datas[i].jd_id == 7 || data.data.datas[i].jd_id == 8) {
					// 		a = a + 1;	
					// 	}
					// }
					for (let i = 0; i < data.data.inacbg.length; i++) {
						const element = data.data.inacbg[i];
						if (element.is_im == true) {
							element.namadiagnosa = element.namadiagnosa + ' (IM tidak berlaku)'
						}
						
					}
					$scope.item.countIcdInacbg= a;
					$scope.importIcd = data.data.d;
					// console.log($scope.itemPopUp.icd10);
                    $scope.listGridDiagnosa = new kendo.data.DataSource({
                        data: data.data.inacbg,
                        pageSize: 10,
                        total: data.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                }
                            }
                        }
                    });
					// $scope.dataPasienSelected.totalbiayars =  "Rp. " + parseFloat($scope.dataPasienSelected.totalbiayars).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
    				// $scope.popUpInputDiagnosa.center().open()
					medifirstService.getPart("registrasi/daftar-registrasi/get-data-diagnosa", true, true, 10).then(function (data) {
						$scope.sourceDiagnosisPrimer = data;
					});
					// loadicdInu()
                });

				

				// Get current actions
				var actions = $scope.popupApgarScore.options.actions;
				// Remove "Close" button
				actions.splice(actions.indexOf("Close"), 1);
				// Set the new options
				$scope.popupApgarScore.setOptions({ actions : actions });
            }

			function loadicdInu() {
				// get diagnosa icd ten unu
				var norReg = ""
                if ($scope.dataPasienSelected.noregistrasi != undefined) {
                    norReg = "noReg=" + $scope.dataPasienSelected.noregistrasi;
                }
				
				medifirstService.get("registrasi/get-diagnosa-10-by-noreg?"
					+ norReg + "&unu=true"
				).then(function (data) {
					$scope.isRouteLoading = false;
				if (data.data.dataunu.length > 0) {  
					$scope.item.jenisDiagnosisUnu = {id: 20, jenisDiagnosa: "Secondary INA Grouper"}
					$scope.itemPopUp.diagnosa_inagrouper = data.data.icd10unu;
				} else {
					$scope.item.jenisDiagnosisUnu = {id: 19, jenisDiagnosa: "Primary / utama INA Grouper"}
					$scope.itemPopUp.diagnosa_inagrouper = $scope.itemPopUp.icd10;
					// console.log($scope.itemPopUp.diagnosa_inagrouper)
				}
				
					$scope.listGridDiagnosaUnu = new kendo.data.DataSource({
						data: data.data.dataunu,
						pageSize: 10,
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

				function loadicdixIna() {
					var norReg = ""
					if ($scope.dataPasienSelected.noregistrasi != undefined) {
						norReg = "noReg=" + $scope.dataPasienSelected.noregistrasi;
					}
					
					var ketdg = ""
					ketdg = "&ketdiagnosa=0";
					medifirstService.get("registrasi/get-diagnosa-9-by-noreg?"
						+ norReg + "&unu=true" + ketdg

					
					).then(function (data) {
						$scope.isRouteLoading = false;
						if (data.data.dataunu.length > 0) {
							$scope.itemPopUp.procedure_inagrouper = data.data.icd9unu;
						} else {
							$scope.itemPopUp.procedure_inagrouper = $scope.itemPopUp.icd9;
							// console.log($scope.itemPopUp.procedure_inagrouper)
						}
						$scope.listGridDiagnosa1Unu = new kendo.data.DataSource({
							data: data.data.dataunu,
							pageSize: 10,
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
			function loadicdix() {
					var norReg = ""
					if ($scope.dataPasienSelected.noregistrasi != undefined) {
						norReg = "noReg=" + $scope.dataPasienSelected.noregistrasi;
					}
					// var ketdg = ""
					// ketdg = "&ketdiagnosa=0";
					medifirstService.get("registrasi/get-diagnosa-9-by-noreg?"
						+ norReg + '&inacbg=true'
					).then(function (data) {
						$scope.isRouteLoading = false;
						if (data.data.inacbg.length > 0) {
						
							$scope.itemPopUp.icd9 = data.data.icd9;
							// console.log($scope.itemPopUp.icd9)
						} 
						else{
							$scope.itemPopUp.icd9 = null
						}

						if (['Grouping iDRG Final','Grouping INACBG Reedit','Grouping'].includes($scope.itemPopUp.statusklaim) && $scope.isimportidrg == false) {
							$scope.setInacbgIcd9()
						}
						// var a = 0 ;
						// for (var i = 0; i < data.data.inacbg.length; i++) {
						// 	if (data.data.datas[i].ketdiagnosa == 'INAcbg' ) {
						// 		a = a + 1;
						// 	}
						// }
						for (let i = 0; i < data.data.inacbg.length; i++) {
							const element = data.data.inacbg[i];
							if (element.is_im == true) {
								element.namadiagnosatindakan = element.namadiagnosatindakan + ' (IM tidak berlaku)'
							}
							
						}
						$scope.item.countIcd9Inacbg= data.data.inacbg.length;
						$scope.importIcd9 = data.data.d;
						$scope.listGridDiagnosa1 = new kendo.data.DataSource({
							data: data.data.inacbg,
							pageSize: 10,
							total: data.length,
							serverPaging: false,
							schema: {
								model: {
									fields: {
									}
								}
							}
						});

						
						$scope.popUpInputDiagnosa.center().open()
						$scope.isimportidrg = false
					});
					// debugger
					// loadicdixIna()
			}
			// function loadRiwayatVentilator() {
			// 	$scope.tarif_rs16 = {};
			// 	var nomor = ""
            //     if ($scope.dataPasienSelected.noregistrasi != undefined) {
            //         nomor = "nocm=" + $scope.dataPasienSelected.noregistrasi;
            //     }
			// 	medifirstService.get("bridging/inacbg/get-daftar-pasien-ventilator?"
            //         + nomor
            //          ).then(function (data) {
            //         $scope.itemres = data.data.data2
            //         $scope.tarif_rs16 = data.data.data1
            //     });
			// }
			$scope.InputDiagnosa = function () {
                if ($scope.dataPasienSelected.noregistrasi == undefined) {
					toastr.error("Harap pilih data terlebih dahulu !");
					return
                }
                $scope.grupingtab = false;
				$scope.grouper_idrg = false;
				$scope.itemgrop = {}
				$scope.listspecialdrug = []
				$scope.listspecialprocedure = []
				$scope.listspecialprosthesis = []
				$scope.listspecialinvestigation = []
				$scope.item.specialprocedure = {}
				$scope.item.specialdrug = {}
				$scope.item.specialinvestigation = {}
				$scope.item.specialprosthesis = {}

                // if ($scope.dataPasienSelected.statusklaim == 'Grouping') {
				// 	$scope.grupingtab = true;
				// }
				$scope.itemPopUp.procedure_inagrouper = null
				$scope.itemPopUp.icd9 = null
				$scope.itemPopUp.icd10 = null
				$scope.itemPopUp.diagnosa_inagrouper = null

				$scope.itemPopUp = $scope.dataPasienSelected
				if ($scope.itemPopUp.objectdepartemenfk == 16) {
					$scope.isRanap = true
				} else {
					$scope.isRanap = false
				}
				
				if ($scope.itemPopUp.response != null) {
					if ($scope.itemPopUp.response.metadata.code == 200) {
						$scope.grupingtab = true;
						$scope.itemgrop = $scope.itemPopUp.response
						if ($scope.itemgrop.hasOwnProperty("special_cmg_option") == true && $scope.itemgrop.special_cmg_option.length > 0) {
							$scope.istopup = true
							var responOptions = $scope.itemgrop.special_cmg_option
							var spesialDrug = []
							var specialProcedure = []
							var specialProsthesis = []
							var specialInvestigation = []
							for (let i = 0; i < responOptions.length; i++) {
								const element = responOptions[i];
								if (element.type == 'Special Drug') {
									spesialDrug.push(element)
								}
								if (element.type == 'Special Procedure') {
									specialProcedure.push(element)
								}
								if (element.type == 'Special Prosthesis') {
									specialProsthesis.push(element)
								}
								if (element.type == 'Special Investigation') {
									specialInvestigation.push(element)
								}
							}
							$scope.listspecialdrug = spesialDrug
							$scope.listspecialprocedure = specialProcedure
							$scope.listspecialprosthesis = specialProsthesis
							$scope.listspecialinvestigation = specialInvestigation
							if($scope.itemPopUp.special_cmg != null){
								var arrSpecialCmg = $scope.itemPopUp.special_cmg.split('#');

								$scope.item.specialprocedure = $scope.listspecialprocedure.find(x => arrSpecialCmg.includes(x.code));
								$scope.item.specialdrug = $scope.listspecialdrug.find(x => arrSpecialCmg.includes(x.code));
								$scope.item.specialinvestigation = $scope.listspecialinvestigation.find(x => arrSpecialCmg.includes(x.code));
								$scope.item.specialprosthesis = $scope.listspecialprosthesis.find(x => arrSpecialCmg.includes(x.code));
							}

						}
					}
					
				}
				$scope.listGridDiagnosaIdrg = new kendo.data.DataSource({
						data: [],
				});
				$scope.listGridRiwayat = new kendo.data.DataSource({
                    data: [],
                });
				$scope.listGridDiagnosaIdrgTd = new kendo.data.DataSource({
                    data: [],
                });
				$scope.listGridDiagnosa = new kendo.data.DataSource({
                    data: [],
                });
				$scope.listGridDiagnosa1 = new kendo.data.DataSource({
						data: [],
				});
                $scope.popUpInputDiagnosa.center().open()
				$scope.dataPasienSelected.tglregistrasi = new Date($scope.dataPasienSelected.tglregistrasi);
                loadpopup();
				loadRiwayat();
				loadIdrg()
				loadIdrgTd()
				loadGroupingIdrg()
				loadicd();
				// loadicdInu();
				loadicdix();
				// loadicdixIna();
				
				
				
            }
			$scope.simpanDiagnosa = function () {
				
                if ($scope.item.jenisDiagnosis == undefined) {
                    alert("Pilih Jenis Diagnosa terlebih dahulu!!")
                    return
                }
                if ($scope.item.diagnosisPrimer == undefined) {
                    alert("Pilih Kode Diagnosa dan Nama Diagnosa terlebih dahulu!!")
                    return
                }
                var norecDiagnosaPasien = "";
                if ($scope.item.norec_diagnosapasien != undefined) {
                    norecDiagnosaPasien = $scope.item.norec_diagnosapasien
                }
                var norecDiagnosaDetailPasien = "";
                if ($scope.item.norec_diagnosadetailpasien != undefined) {
                    norecDiagnosaDetailPasien = $scope.item.norec_diagnosadetailpasien
                }

                var keterangan = "";
                if ($scope.item.keterangan == undefined) {
                    keterangan = "-"
                }
                else {
                    keterangan = $scope.item.keterangan
                }

                $scope.now = new Date();
                var detaildiagnosapasien = {
                    norec_dp: norecDiagnosaPasien,
                    norec_ddp:  norecDiagnosaDetailPasien,
                    noregistrasifk: $scope.itemPopUp.norec_apd,
                    tglregistrasi: moment($scope.itemPopUp.tglregistrasi).format('YYYY-MM-DD HH:mm:ss'),
                    objectdiagnosafk: $scope.item.diagnosisPrimer.id,
                    objectjenisdiagnosafk: $scope.item.jenisDiagnosis.id,
                    tglinputdiagnosa: moment($scope.now).format('YYYY-MM-DD HH:mm:ss'),
                    keterangan: '-'
                }
                var objSave =
                {
                    detaildiagnosapasien: detaildiagnosapasien,
                }

                medifirstService.post('registrasi/save-diagnosa-pasiendua', objSave).then(function (e) {
					var ket = ''
					if (norecDiagnosaPasien == '') {
						ket = 'Input'
					} else {
						ket = 'Ubah'
					}
					$scope.saveLogging('Diagnosis', 'Norec DiagnosaPasien_T', e.data.data.norec,
					ket + ' Diagnosis ICD 10 ( ' + $scope.item.diagnosisPrimer.kodeNama + ' )' + ' No Registrasi / No RM ' + $scope.itemPopUp.noregistrasi
					+ '/ ' +  $scope.itemPopUp.nocm);

                    delete $scope.item.jenisDiagnosis;
                    delete $scope.item.diagnosisPrimer;
                    delete $scope.item.keterangan;
                    delete $scope.item.norec_diagnosapasien;
                    delete $scope.item.norec_diagnosadetailpasien;
                    $scope.dataSelected = {};
                    loadicd()
					
                })

            }

			// seharusnya ina tapi kagok sudah unu
			$scope.simpanDiagnosaUnu = function () {
				
                if ($scope.item.jenisDiagnosisUnu == undefined) {
                    alert("Pilih Jenis Diagnosa terlebih dahulu!!")
                    return
                }
                if ($scope.item.diagnosisPrimerUnu == undefined) {
                    alert("Pilih Kode Diagnosa dan Nama Diagnosa terlebih dahulu!!")
                    return
                }
                var norecDiagnosaPasienUnu = "";
                if ($scope.item.norec_diagnosapasienUnu != undefined) {
                    norecDiagnosaPasienUnu = $scope.item.norec_diagnosapasienUnu
                }
				var norecDiagnosaDetailPasienUnu = "";
                if ($scope.item.norec_diagnosadetailpasienUnu != undefined) {
                    norecDiagnosaDetailPasienUnu = $scope.item.norec_diagnosadetailpasienUnu
                }

                var keterangan = "";
                if ($scope.item.keterangan == undefined) {
                    keterangan = "-"
                }
                else {
                    keterangan = $scope.item.keterangan
                }

                $scope.now = new Date();
                var detaildiagnosapasien = {
                    norec_dp: norecDiagnosaPasienUnu,
                    norec_ddp:  norecDiagnosaDetailPasienUnu,
                    noregistrasifk: $scope.itemPopUp.norec_apd,
                    tglregistrasi: moment($scope.itemPopUp.tglregistrasi).format('YYYY-MM-DD HH:mm:ss'),
                    objectdiagnosafk: $scope.item.diagnosisPrimerUnu.id,
                    objectjenisdiagnosafk: $scope.item.jenisDiagnosisUnu.id,
                    tglinputdiagnosa: moment($scope.now).format('YYYY-MM-DD HH:mm:ss'),
                    keterangan: '-'
                }
                var objSave =
                {
                    detaildiagnosapasien: detaildiagnosapasien,
                }

                medifirstService.post('registrasi/save-diagnosa-pasiendua', objSave).then(function (e) {
					var ket = ''
					if (norecDiagnosaPasienUnu == '') {
						ket = 'Input'
					} else {
						ket = 'Ubah'
					}
					$scope.saveLogging('Diagnosis', 'Norec DiagnosaPasien_T', e.data.data.norec,
					ket + ' Diagnosis ICD 10 ( ' + $scope.item.diagnosisPrimerUnu.kodeNama + ' )' + ' No Registrasi / No RM ' + $scope.itemPopUp.noregistrasi
					+ '/ ' +  $scope.itemPopUp.nocm);

                    delete $scope.item.jenisDiagnosisUnu;
                    delete $scope.item.diagnosisPrimerUnu;
                    delete $scope.item.keterangan;
                    delete $scope.item.norec_diagnosapasienUnu;
                    $scope.dataSelectedUnu = {};
                    loadicdInu()
					
                })

            }

			$scope.simpanDiagnosa1 = function () {
                if ($scope.item.diagnosisPrimer1 == undefined) {
                    alert("Pilih Kode Diagnosa dan Nama Diagnosa terlebih dahulu!!")
                    return
                }
                var norecDiagnosaTindakanPasien = "";
				if ($scope.item.norec_diagnosapasien_tindakan != undefined) {
                    norecDiagnosaTindakanPasien = $scope.item.norec_diagnosapasien_tindakan
                }
                var keteranganTindakan = "-";
                if ($scope.item.keteranganTindakan != undefined) {
                    keteranganTindakan = $scope.item.keteranganTindakan
                }

                $scope.now = new Date();
                var detaildiagnosatindakanpasien = {
                    norec_dp: norecDiagnosaTindakanPasien,
                    objectpasienfk: $scope.itemPopUp.norec_apd,
                    tglpendaftaran: $scope.itemPopUp.tglregistrasi,
                    objectdiagnosatindakanfk: $scope.item.diagnosisPrimer1.id,
                    keterangantindakan: "-",
					ketdiagnosa: 'INAcbg',
                }
                var objSave =
                {
                    detaildiagnosatindakanpasien: detaildiagnosatindakanpasien,
                }

                medifirstService.post('registrasi/save-diagnosa-tindakan-pasien', objSave).then(function (e) {
					var ket = ''
					if (norecDiagnosaTindakanPasien == '') {
						ket = 'Input'
					} else {
						ket = 'Ubah'
					}
					$scope.saveLogging('Diagnosis', 'Norec DiagnosaTindakanPasien_T', e.data.data.norec,
					ket + ' Diagnosis ICD 9 ( ' +  $scope.item.diagnosisPrimer1.kdNama + ' )' + ' No Registrasi / No RM ' + $scope.itemPopUp.noregistrasi
					+ '/ ' +  $scope.itemPopUp.nocm)

                    delete $scope.item.diagnosisPrimer1;
                    delete $scope.item.keteranganTindakan;
                    delete $scope.item.norec_diagnosapasien_tindakan;
                    $scope.dataSelected1 = {};
                    loadicdix()

					
                })
            }
			$scope.simpanDiagnosa1Unu = function () {
                if ($scope.item.diagnosisPrimer1Unu == undefined) {
                    alert("Pilih Kode Diagnosa dan Nama Diagnosa terlebih dahulu!!")
                    return
                }
                var norecDiagnosaTindakanPasienUnu = "";
				if ($scope.item.norec_diagnosapasien_tindakanUnu != undefined) {
                    norecDiagnosaTindakanPasienUnu = $scope.item.norec_diagnosapasien_tindakanUnu
                }
                var keteranganTindakan = "-";
                if ($scope.item.keteranganTindakan != undefined) {
                    keteranganTindakan = $scope.item.keteranganTindakan
                }

                $scope.now = new Date();
                var detaildiagnosatindakanpasien = {
                    norec_dp: norecDiagnosaTindakanPasienUnu,
                    objectpasienfk: $scope.itemPopUp.norec_apd,
                    tglpendaftaran: $scope.itemPopUp.tglregistrasi,
                    objectdiagnosatindakanfk: $scope.item.diagnosisPrimer1Unu.id,
                    keterangantindakan: "-",
                    ketdiagnosa: 'unugrouper',
                }
                var objSave =
                {
                    detaildiagnosatindakanpasien: detaildiagnosatindakanpasien,
                }

                medifirstService.post('registrasi/save-diagnosa-tindakan-pasien', objSave).then(function (e) {
					var ket = ''
					if (norecDiagnosaTindakanPasienUnu == '') {
						ket = 'Input'
					} else {
						ket = 'Ubah'
					}
					$scope.saveLogging('Diagnosis', 'Norec DiagnosaTindakanPasien_T', e.data.data.norec,
					ket + ' Diagnosis ICD 9 ( ' +  $scope.item.diagnosisPrimer1Unu.kdNama + ' )' + ' No Registrasi / No RM ' + $scope.itemPopUp.noregistrasi
					+ '/ ' +  $scope.itemPopUp.nocm)

                    delete $scope.item.diagnosisPrimer1Unu;
                    delete $scope.item.keteranganTindakan;
                    delete $scope.item.norec_diagnosapasien_tindakanUnu;
                    $scope.dataSelected1Unu = {};
                    loadicdixIna()

					
                })
            }

			$scope.hapusDiagnosaUnu = function () {

                if ($scope.item.diagnosisPrimerUnu == undefined) {
                    alert("Pilih data yang mau di hapus!!")
                    return
                }
                var diagnosa = {
                    // norec_dp: $scope.item.diagnosisPrimerUnu.norec_diagnosapasien
					norec_ddp: $scope.item.norec_diagnosadetailpasienUnu
                }
                var objDelete =
                {
                    diagnosa: diagnosa,
                }
                medifirstService.post('registrasi/daftar-antrian-pasien/delete-diagnosa-pasien', objDelete).then(function (e) {
					$scope.saveLogging('Diagnosis', 'Norec DiagnosaPasien_T','',
					'Hapus Diagnosis ICD 10 ( ' + $scope.item.diagnosisPrimerUnu.kodeNama + ' )' + ' No Registrasi / No RM ' + $scope.itemPopUp.noregistrasi
					+ '/ ' +  $scope.itemPopUp.nocm);

                    delete $scope.item.jenisDiagnosisUnu;
                    delete $scope.item.diagnosisPrimerUnu;
                    delete $scope.item.keterangan;
                    delete $scope.item.namaRuangan;
					delete $scope.item.norec_diagnosapasienUnu;
					delete $scope.item.norec_diagnosadetailpasienUnu;
                    $scope.dataSelected = {};
                    loadicdInu()
                })
            }
			$scope.hapusDiagnosa = function () {

                if ($scope.item.diagnosisPrimer == undefined) {
                    alert("Pilih data yang mau di hapus!!")
                    return
                }
                var diagnosa = {
					
					// norec_dp : $scope.item.norec_diagnosapasien,
                    norec_ddp: $scope.item.norec_diagnosadetailpasien
                }
                var objDelete =
                {
					noreg: $scope.itemPopUp.noregistrasi,
					eklaim: true,
					inacbg: true,
                    diagnosa: diagnosa,
                }
                medifirstService.post('registrasi/daftar-antrian-pasien/delete-diagnosa-pasien', objDelete).then(function (e) {
					$scope.saveLogging('Diagnosis', 'Norec DiagnosaPasien_T','',
					'Hapus Diagnosis ICD 10 ( ' + $scope.item.diagnosisPrimer.kodeNama + ' )' + ' No Registrasi / No RM ' + $scope.itemPopUp.noregistrasi
					+ '/ ' +  $scope.itemPopUp.nocm);

                    delete $scope.item.jenisDiagnosis;
                    delete $scope.item.diagnosisPrimer;
                    delete $scope.item.keterangan;
                    delete $scope.item.namaRuangan;
					delete $scope.item.norec_diagnosapasien;
					delete $scope.item.norec_diagnosadetailpasien;
                    $scope.dataSelected = {};
                    loadicd()
                })
            }

			$scope.hapusDiagnosa1 = function () {

                if ($scope.item.diagnosisPrimer1 == undefined) {
                    alert("Pilih data yang mau di hapus!!")
                    return
                }
                var diagnosa = {
                    norec_dp: $scope.item.diagnosisPrimer1.norec_diagnosapasien
                }
                var objDelete =
                {
                    diagnosa: diagnosa,
                }
                medifirstService.post('registrasi/delete-diagnosa-tindakan-pasien', objDelete).then(function (e) {
					$scope.saveLogging('Diagnosis', 'Norec DiagnosaTindakanPasien_T','',
					'Hapus Diagnosis ICD 9 ( ' +  $scope.item.diagnosisPrimer1.kdNama + ' )' + ' No Registrasi / No RM ' + $scope.itemPopUp.noregistrasi
					+ '/ ' +  $scope.itemPopUp.nocm)
                    delete $scope.item.diagnosisPrimer1;
                    delete $scope.item.keteranganTindakan;
					delete $scope.item.norec_diagnosapasien_tindakan;

                    $scope.dataSelected1 = {};
                    loadicdix()
                })
            }
			$scope.hapusDiagnosa1Unu = function () {

                if ($scope.item.diagnosisPrimer1Unu == undefined) {
                    alert("Pilih data yang mau di hapus!!")
                    return
                }
                var diagnosa = {
                    norec_dp: $scope.item.diagnosisPrimer1Unu.norec_diagnosapasien
                }
                var objDelete =
                {
                    diagnosa: diagnosa,
                }
                medifirstService.post('registrasi/delete-diagnosa-tindakan-pasien', objDelete).then(function (e) {
					$scope.saveLogging('Diagnosis', 'Norec DiagnosaTindakanPasien_T','',
					'Hapus Diagnosis ICD 9 ( ' +  $scope.item.diagnosisPrimer1Unu.kdNama + ' )' + ' No Registrasi / No RM ' + $scope.itemPopUp.noregistrasi
					+ '/ ' +  $scope.itemPopUp.nocm)
                    delete $scope.item.diagnosisPrimer1Unu;
                    delete $scope.item.keteranganTindakan;
					delete $scope.item.norec_diagnosapasien_tindakanUnu;

                    $scope.dataSelected1Unu = {};
                    loadicdixIna()
                })
            }

			$scope.batal = function () {
                delete $scope.item.jenisDiagnosis;
                delete $scope.item.diagnosisPrimer;
                delete $scope.item.keterangan;
                delete $scope.item.norec_diagnosapasien;
			}
			$scope.batalUnu = function () {
                delete $scope.item.jenisDiagnosisUnu;
                delete $scope.item.diagnosisPrimerUnu;
                delete $scope.item.keterangan;
                delete $scope.item.norec_diagnosapasienUnu;
            }
			$scope.batal1 = function () {
                delete $scope.item.diagnosisPrimer1;
                delete $scope.item.keteranganTindakan;
                delete $scope.item.norec_diagnosapasien_tindakan;

            }
			$scope.batal1Unu = function () {
                delete $scope.item.diagnosisPrimer1Unu;
                delete $scope.item.keteranganTindakan;
                delete $scope.item.norec_diagnosapasien_tindakanUnu;

            }
			$scope.klikGrid = function (dataSelected) {
                if (dataSelected.kddiagnosa!= undefined) {
                    // $scope.sourceDiagnosisPrimer.add({
                    //     id: dataSelected.objectdiagnosafk,
                    //     kdDiagnosa: dataSelected.kddiagnosa,
                    //     namaDiagnosa: dataSelected.namadiagnosa,
                    //     noregistrasi: dataSelected.noregistrasi,
                    //     tglregistrasi: dataSelected.tglregistrasi,
                    //     objectruanganfk: dataSelected.objectruanganfk,
                    //     namaruangan: dataSelected.namaruangan,
                    //     norec_apd: dataSelected.norec_apd,
                    //     objectdiagnosafk: dataSelected.objectdiagnosafk,
                    //     objectjenisdiagnosafk: dataSelected.objectjenisdiagnosafk,
                    //     jenisdiagnosa: dataSelected.jenisdiagnosa,
                    //     norec_diagnosapasien: dataSelected.norec_diagnosapasien,
                    //     norec_detaildpasien: dataSelected.norec_detaildpasien,
                    //     id: dataSelected.id,
                    //     kdprofile: dataSelected.kdprofile,
                    //     statusenabled: dataSelected.statusenabled,
                    //     kodeexternal: dataSelected.kodeexternal,
                    //     namaexternal: dataSelected.namaexternal,
                    //     norec: dataSelected.norec,
                    //     reportdisplay: dataSelected.reportdisplay,
                    //     objectjeniskelaminfk: dataSelected.objectjeniskelaminfk,
                    //     objectkategorydiagnosafk: dataSelected.objectkategorydiagnosafk,
                    //     qdiagnosa: dataSelected.qdiagnosa,
                    //     keteranganTindakan: dataSelected.keterangantindakan
                    // })
                    $scope.item.jenisDiagnosis = { id: dataSelected.objectjenisdiagnosafk, jenisDiagnosa: dataSelected.jenisdiagnosa }
                    $scope.item.diagnosisPrimer = {
                        id: dataSelected.objectdiagnosafk,
                        kdDiagnosa: dataSelected.kddiagnosa,
                        namaDiagnosa: dataSelected.namadiagnosa,
                        kodeNama: dataSelected.kddiagnosa + ' - ' +dataSelected.namadiagnosa,
                        // noregistrasi: dataSelected.noregistrasi,
                        // tglregistrasi: dataSelected.tglregistrasi,
                        // objectruanganfk: dataSelected.objectruanganfk,
                        // namaruangan: dataSelected.namaruangan,
                        // norec_apd: dataSelected.norec_apd,
                        // objectdiagnosafk: dataSelected.objectdiagnosafk,
                        // objectjenisdiagnosafk: dataSelected.objectjenisdiagnosafk,
                        // jenisdiagnosa: dataSelected.jenisdiagnosa,
                        norec_diagnosapasien: dataSelected.norec_diagnosapasien,
                        norec_detaildpasien: dataSelected.norec_detaildpasien,
                        // id: dataSelected.id,
                        // kdprofile: dataSelected.kdprofile,
                        // statusenabled: dataSelected.statusenabled,
                        // kodeexternal: dataSelected.kodeexternal,
                        // namaexternal: dataSelected.namaexternal,
                        // norec: dataSelected.norec,
                        // reportdisplay: dataSelected.reportdisplay,
                        // objectjeniskelaminfk: dataSelected.objectjeniskelaminfk,
                        // objectkategorydiagnosafk: dataSelected.objectkategorydiagnosafk,
                        // qdiagnosa: dataSelected.qdiagnosa
                    }
                    $scope.item.diagnosisPrimer2 = { id: dataSelected.objectdiagnosafk, namaDiagnosa: dataSelected.namadiagnosa }
					$scope.item.norec_diagnosapasien = dataSelected.norec_diagnosapasien
					$scope.item.norec_diagnosadetailpasien = dataSelected.norec_detaildpasien
                    $scope.item.namaRuangan = ''
                    $scope.item.namaRuangan = {
                        noregistrasi: dataSelected.noregistrasi,
                        objectruanganfk: dataSelected.objectruanganfk,
                        namaruangan: dataSelected.namaruangan,
                        norec_apd: dataSelected.norec_apd,
                        keterangan: dataSelected.keterangan
                    }//  { id: dataSelected.objectruanganfk, namaruangan: dataSelected.namaruangan }
                    $scope.item.keterangan = dataSelected.keterangan
                }

            }
			$scope.klikGridUnu = function (dataSelectedUnu) {
                if (dataSelectedUnu.kddiagnosa!= undefined) {
                    $scope.sourceIcd10Inagrouper._data.push({
                        id: dataSelectedUnu.id,
                        kdDiagnosa: dataSelectedUnu.kddiagnosa,
                        namaDiagnosa: dataSelectedUnu.namadiagnosa,
						kodeNama: dataSelectedUnu.kddiagnosa + ' - ' + dataSelectedUnu.namadiagnosa,
                    })
                    $scope.item.jenisDiagnosisUnu = { id: dataSelectedUnu.objectjenisdiagnosafk, jenisDiagnosa: dataSelectedUnu.jenisdiagnosa }
                    $scope.item.diagnosisPrimerUnu = {
                        id: dataSelectedUnu.id,
                        kdDiagnosa: dataSelectedUnu.kddiagnosa,
                        namaDiagnosa: dataSelectedUnu.namadiagnosa,
                        kodeNama: dataSelectedUnu.kddiagnosa + ' - ' +dataSelectedUnu.namadiagnosa,
                        noregistrasi: dataSelectedUnu.noregistrasi,
                        tglregistrasi: dataSelectedUnu.tglregistrasi,
                        objectruanganfk: dataSelectedUnu.objectruanganfk,
                        namaruangan: dataSelectedUnu.namaruangan,
                        norec_apd: dataSelectedUnu.norec_apd,
                        objectdiagnosafk: dataSelectedUnu.id,
                        objectjenisdiagnosafk: dataSelectedUnu.objectjenisdiagnosafk,
                        jenisdiagnosa: dataSelectedUnu.jenisdiagnosa,
                        norec_diagnosapasien: dataSelectedUnu.norec_diagnosapasien,
                        norec_detaildpasien: dataSelectedUnu.norec_detaildpasien,
                        id: dataSelectedUnu.id,
                        kdprofile: dataSelectedUnu.kdprofile,
                        statusenabled: dataSelectedUnu.statusenabled,
                        kodeexternal: dataSelectedUnu.kodeexternal,
                        namaexternal: dataSelectedUnu.namaexternal,
                        norec: dataSelectedUnu.norec,
                        reportdisplay: dataSelectedUnu.reportdisplay,
                        objectjeniskelaminfk: dataSelectedUnu.objectjeniskelaminfk,
                        objectkategorydiagnosafk: dataSelectedUnu.objectkategorydiagnosafk,
                        qdiagnosa: dataSelectedUnu.qdiagnosa
                    }
                    $scope.item.diagnosisPrimer2 = { id: dataSelectedUnu.objectdiagnosafk, namaDiagnosa: dataSelectedUnu.namadiagnosa }
					$scope.item.norec_diagnosapasienUnu = dataSelectedUnu.norec_diagnosapasien
					$scope.item.norec_diagnosadetailpasienUnu = dataSelectedUnu.norec_detaildpasien
                    $scope.item.namaRuangan = ''
                    $scope.item.namaRuangan = {
                        noregistrasi: dataSelectedUnu.noregistrasi,
                        objectruanganfk: dataSelectedUnu.objectruanganfk,
                        namaruangan: dataSelectedUnu.namaruangan,
                        norec_apd: dataSelectedUnu.norec_apd,
                        keterangan: "-"
                    }//  { id: dataSelectedUnu.objectruanganfk, namaruangan: dataSelectedUnu.namaruangan }
                    $scope.item.keterangan = "-"
                }

            }

            $scope.klikGrid1 = function (dataSelected1) {
                if (dataSelected1.kddiagnosatindakan != undefined) {
                    // $scope.sourceDiagnosisPrimer1.add({
                    //     id: dataSelected1.objectdiagnosafk,
                    //     kdDiagnosaTindakan: dataSelected1.kddiagnosatindakan,
                    //     namaDiagnosaTindakan: dataSelected1.namadiagnosatindakan,
                    //     kdNama: dataSelected1.kddiagnosatindakan + ' - ' + dataSelected1.namadiagnosatindakan,
                    //     noregistrasi: dataSelected1.noregistrasi,
                    //     tglregistrasi: dataSelected1.tglregistrasi,
                    //     objectruanganfk: dataSelected1.objectruanganfk,
                    //     namaruangan: dataSelected1.namaruangan,
                    //     norec_apd: dataSelected1.norec_apd,
                    //     objectdiagnosafk: dataSelected1.objectdiagnosafk,
                    //     objectjenisdiagnosafk: dataSelected1.objectjenisdiagnosafk,
                    //     jenisdiagnosa: dataSelected1.jenisdiagnosa,
                    //     norec_diagnosapasien: dataSelected1.norec_diagnosapasien,
                    //     norec_detaildpasien: dataSelected1.norec_detaildpasien,
                    //     id: dataSelected1.id,
                    //     kdprofile: dataSelected1.kdprofile,
                    //     statusenabled: dataSelected1.statusenabled,
                    //     kodeexternal: dataSelected1.kodeexternal,
                    //     namaexternal: dataSelected1.namaexternal,
                    //     norec: dataSelected1.norec,
                    //     reportdisplay: dataSelected1.reportdisplay,
                    //     objectjeniskelaminfk: dataSelected1.objectjeniskelaminfk,
                    //     objectkategorydiagnosafk: dataSelected1.objectkategorydiagnosafk,
                    //     qdiagnosa: dataSelected1.qdiagnosa,
                    //     keterangantindakan: "-"
                    // })

                    $scope.item.jenisDiagnosis1 = { id: dataSelected1.objectjenisdiagnosafk, jenisDiagnosa: dataSelected1.jenisdiagnosa }
                    $scope.item.diagnosisPrimer1 = {
                        id: dataSelected1.objectdiagnosafk,
                        kdDiagnosaTindakan: dataSelected1.kddiagnosatindakan,
                        namaDiagnosaTindakan: dataSelected1.namadiagnosatindakan,
                        kdNama: dataSelected1.kddiagnosatindakan + ' - ' + dataSelected1.namadiagnosatindakan,
                        // noregistrasi: dataSelected1.noregistrasi,
                        // tglregistrasi: dataSelected1.tglregistrasi,
                        // objectruanganfk: dataSelected1.objectruanganfk,
                        // namaruangan: dataSelected1.namaruangan,
                        // norec_apd: dataSelected1.norec_apd,
                        // objectdiagnosafk: dataSelected1.objectdiagnosafk,
                        // objectjenisdiagnosafk: dataSelected1.objectjenisdiagnosafk,
                        // jenisdiagnosa: dataSelected1.jenisdiagnosa,
                        norec_diagnosapasien: dataSelected1.norec_diagnosapasien,
                        // norec_detaildpasien: dataSelected1.norec_detaildpasien,
                        // id: dataSelected1.id,
                        // kdprofile: dataSelected1.kdprofile,
                        // statusenabled: dataSelected1.statusenabled,
                        // kodeexternal: dataSelected1.kodeexternal,
                        // namaexternal: dataSelected1.namaexternal,
                        // norec: dataSelected1.norec,
                        // reportdisplay: dataSelected1.reportdisplay,
                        // objectjeniskelaminfk: dataSelected1.objectjeniskelaminfk,
                        // objectkategorydiagnosafk: dataSelected1.objectkategorydiagnosafk,
                        // qdiagnosa: dataSelected1.qdiagnosa,
                        // keterangantindakan: "-"
                    }

                    $scope.item.diagnosisPrimer2 = { id: dataSelected1.objectdiagnosafk, namaDiagnosaTindakan: dataSelected1.namaDiagnosaTindakan }
					$scope.item.norec_diagnosapasien_tindakan = dataSelected1.norec_diagnosapasien,
                    $scope.item.namaRuangan1 = ''
                    $scope.item.namaRuangan1 = {
                        noregistrasi: dataSelected1.noregistrasi,
                        objectruanganfk: dataSelected1.objectruanganfk,
                        namaruangan: dataSelected1.namaruangan,
                        norec_apd: dataSelected1.norec_apd
                    }//  { id: dataSelected.objectruanganfk, namaruangan: dataSelected.namaruangan }
                    $scope.item.keteranganTindakan = "-"
                }

            }
            $scope.klikGrid1Unu = function (dataSelected1Unu) {
                if (dataSelected1Unu.kddiagnosatindakan != undefined) {
                    $scope.sourceIcd9Inagrouper._data.push({
                        id: dataSelected1Unu.id,
                        kdDiagnosaTindakan: dataSelected1Unu.kddiagnosatindakan,
                        namaDiagnosaTindakan: dataSelected1Unu.namadiagnosatindakan,
                        kdNama: dataSelected1Unu.kddiagnosatindakan + ' - ' + dataSelected1Unu.namadiagnosatindakan,
                    })

                    $scope.item.jenisDiagnosis1Unu = { id: dataSelected1Unu.objectjenisdiagnosafk, jenisDiagnosa: dataSelected1Unu.jenisdiagnosa }
                    $scope.item.diagnosisPrimer1Unu = {
                        id: dataSelected1Unu.id,
                        kdDiagnosaTindakan: dataSelected1Unu.kddiagnosatindakan,
                        namaDiagnosaTindakan: dataSelected1Unu.namadiagnosatindakan,
                        kdNama: dataSelected1Unu.kddiagnosatindakan + ' - ' + dataSelected1Unu.namadiagnosatindakan,
                        noregistrasi: dataSelected1Unu.noregistrasi,
                        tglregistrasi: dataSelected1Unu.tglregistrasi,
                        objectruanganfk: dataSelected1Unu.objectruanganfk,
                        namaruangan: dataSelected1Unu.namaruangan,
                        norec_apd: dataSelected1Unu.norec_apd,
                        objectdiagnosafk: dataSelected1Unu.id,
                        objectjenisdiagnosafk: dataSelected1Unu.objectjenisdiagnosafk,
                        jenisdiagnosa: dataSelected1Unu.jenisdiagnosa,
                        norec_diagnosapasien: dataSelected1Unu.norec_diagnosapasien,
                        norec_detaildpasien: dataSelected1Unu.norec_detaildpasien,
                        id: dataSelected1Unu.id,
                        kdprofile: dataSelected1Unu.kdprofile,
                        statusenabled: dataSelected1Unu.statusenabled,
                        kodeexternal: dataSelected1Unu.kodeexternal,
                        namaexternal: dataSelected1Unu.namaexternal,
                        norec: dataSelected1Unu.norec,
                        reportdisplay: dataSelected1Unu.reportdisplay,
                        objectjeniskelaminfk: dataSelected1Unu.objectjeniskelaminfk,
                        objectkategorydiagnosafk: dataSelected1Unu.objectkategorydiagnosafk,
                        qdiagnosa: dataSelected1Unu.qdiagnosa,
                        keterangantindakan: "-"
                    }

                    $scope.item.diagnosisPrimer2 = { id: dataSelected1Unu.id, namaDiagnosaTindakan: dataSelected1Unu.namaDiagnosaTindakan }
					$scope.item.norec_diagnosapasien_tindakanUnu = dataSelected1Unu.norec_diagnosapasien,
                    $scope.item.namaRuangan1 = ''
                    $scope.item.namaRuangan1 = {
                        noregistrasi: dataSelected1Unu.noregistrasi,
                        objectruanganfk: dataSelected1Unu.objectruanganfk,
                        namaruangan: dataSelected1Unu.namaruangan,
                        norec_apd: dataSelected1Unu.norec_apd
                    }//  { id: dataSelected.objectruanganfk, namaruangan: dataSelected.namaruangan }
                    $scope.item.keteranganTindakan = "-"
                }

            }

			var dataBoundDiagnosa = function () {
				$('td').each(function () {

					
					if ($(this).text().toLowerCase().includes('im tidak berlaku')) {
						$(this).addClass('row-merah');
					}
					//   if ($(this).text() == '') {$(this).addClass('red')}
				})
			}

			$scope.gridDiagnosa = {
				dataBound: dataBoundDiagnosa,
				columns : [
					{
						"title": "#",
						"template": "{{listGridDiagnosa.indexOf(dataItem) + 1}}",
						"width": 35
					},
					{
						"field": "jenisdiagnosa",
						"title": "Jenis Diagnosis",
						"width": 150
					}, {
						"field": "kddiagnosa",
						"title": "Kode Diagnosa",
						"width": 150
					}, {
						"field": "namadiagnosa",
						"title": "Nama Diagnosa"
					},
					// {
					// 	"field": "keterangan",
					// 	"title": "Keterangan",
					// 	"width": 150
					// },
					// {
					// 	"field": "namalengkap",
					// 	"title": "Petugas",
					// 	"width": 150,
					// }

				]
			}
			

			$scope.gridDiagnosa1 = {
				dataBound: dataBoundDiagnosa,
				columns : [
					{
						"title": "#",
						"template": "{{listGridDiagnosa1.indexOf(dataItem) + 1}}",
						"width": 35
					},
					// {
					// 	"field": "tglinputdiagnosa",
					// 	"title": "Tgl. Input",
					// 	"width": "85px",
					// },
					{
						"field": "kddiagnosatindakan",
						"title": "Kode Diagnosa",
						"width": 150
					}, {
						"field": "namadiagnosatindakan",
						"title": "Nama Diagnosa"
					},
					{
						"field": "ketdiagnosa",
						"title": "Keterangan diagnosa",
						"width": "100px",
					},
					// {
					// 	"field": "namalengkap",
					// 	"title": "Petugas",
					// 	"width": "150px",
					// }
				]
			}
			

			$scope.gridDiagnosa1Unu =
			[
				{
					"title": "#",
					"template": "{{listGridDiagnosa1Unu.indexOf(dataItem) + 1}}",
					"width": 35
				},
				// {
				// 	"field": "tglinputdiagnosa",
				// 	"title": "Tgl. Input",
				// 	"width": "85px",
				// },
				{
					"field": "kddiagnosatindakan",
					"title": "Kode Diagnosa",
					"width": 150
				}, {
					"field": "namadiagnosatindakan",
					"title": "Nama Diagnosa"
				},
				// {
				// 	"field": "keterangantindakan",
				// 	"title": "Keterangan",
				// 	"width": "100px",
				// },
				// {
				// 	"field": "namalengkap",
				// 	"title": "Petugas",
				// 	"width": "150px",
				// }
			];
			$scope.lihatriwayat = function () {
				$scope.showriwayat = true
				loadRiwayat()
			}

			function loadRiwayat() {
				var nocm = ""
                if ($scope.itemPopUp.noregistrasi != undefined) {
                    nocm = "nocm=" + $scope.itemPopUp.nocm;
                }
				medifirstService.get("registrasi/daftar-riwayat-registrasi-2?"
                    + nocm
                ).then(function (data) {
                    $scope.listGridRiwayat = new kendo.data.DataSource({
                        data: data.data.data,
                        pageSize: 5,
						resizable: true,
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


			$scope.gridRiwayat =
			[
				{
					"title": "#",
					"template": "0{{listGridRiwayat.indexOf(dataItem) + 1}}",
					"width": "3%",

				},
				{
					"field": "tglregistrasi",
					"title": "Tgl. registrasi",
					"width": "8%"
				},
				{
					"field": "noregistrasi",
					"title": "No Registrasi",
					"width": "8%"
				}, {
					"field": "namaruangan",
					"title": "Ruangan Layanan",
					"width": "15%"
				},
				{
					"field": "kelompokpasien",
					"title": "Kelompok Pasien",
					"width": "9%",
				},
				{
					"field": "namadokter",
					"title": "Nama Dokter",
					"width": "20%",
				},
				{
					"field": "diagnosa",
					"title": "Diagnosa",
					"width": "37%",
				}
			];

			$scope.gridDiagnosaUnu =
			[
				{
					"title": "#",
					"template": "{{listGridDiagnosaUnu.indexOf(dataItem) + 1}}",
					"width": 35
				},
				{
					"field": "jenisdiagnosa",
					"title": "Jenis Diagnosis",
					"width": 150
				}, {
					"field": "kddiagnosa",
					"title": "Kode Diagnosa",
					"width": 150
				}, {
					"field": "namadiagnosa",
					"title": "Nama Diagnosa"
				},
				// {
				// 	"field": "keterangan",
				// 	"title": "Keterangan",
				// 	"width": 150
				// },
				// {
				// 	"field": "namalengkap",
				// 	"title": "Petugas",
				// 	"width": 150,
				// }

			];
			function loadRiwayatVentilator() {
				$scope.tarif_rs16 = {};
				var nomor = ""
                if ($scope.itemPopUp.noregistrasi != undefined) {
                    nomor = "nocm=" + $scope.itemPopUp.noregistrasi;
                }
				medifirstService.get("bridging/inacbg/get-daftar-pasien-ventilator?"
                    + nomor
	                     ).then(function (data) {
							// console.log(data.data)
							// debugger
						if (data.data.data2.length > 0) {
							$scope.itemres = data.data.data2
							if ($scope.itemres[0].use_ind == '1') {
								$scope.itemPopUp.intensif = true
								$scope.itemPopUp.icu_indikator = 1
								$scope.itemPopUp.ventilator_hour = $scope.itemres[0].ventilator_hour
								$scope.itemPopUp.start_dttm = $scope.itemres[0].dttm_start
								$scope.itemPopUp.stop_dttm = $scope.itemres[0].dttm_stop
								$scope.itemPopUp.use_ind = $scope.itemres[0].use_ind
							}
							if ($scope.itemres[0].use_ind == '1') {
								$scope.itemPopUp.ventilator = true
								$scope.ventilator = true
								
							}
						} else {
							$scope.itemPopUp.ventilator_hour =""
							$scope.itemPopUp.start_dttm = ""
							$scope.itemPopUp.stop_dttm = ""
							$scope.itemPopUp.use_ind = ""
						}
						// medifirstService.get("bridging/inacbg/get-daftar-pasien-ventilator?noregistrasi=" + $scope.dataPasienSelected.noregistrasi).then(function(data){

						// })
						$scope.totaltarif_rs16 = data.data.data3
						$scope.tarif_rs16 = data.data.data1
							$scope.listTarifRS =[
												{namatarif:'Prosedur Non Bedah' ,tarif:$scope.tarif_rs16.prosedur_non_bedah},
												{namatarif:'Tenaga Ahli' ,tarif:$scope.tarif_rs16.tenaga_ahli},
												{namatarif:'Radiologi' ,tarif:$scope.tarif_rs16.radiologi},
												{namatarif:'Rehabilitasi' ,tarif:$scope.tarif_rs16.rehabilitasi},
												{namatarif:'Obat' ,tarif:$scope.tarif_rs16.obat},
												{namatarif:'Alkes' ,tarif:$scope.tarif_rs16.alkes},
												]
												 
							$scope.listTarifRS2 =[
															
															{namatarif:'Prosedur Bedah' ,tarif:$scope.tarif_rs16.prosedur_bedah},
															{namatarif:'Keperawatan' ,tarif:$scope.tarif_rs16.keperawatan},
															{namatarif:'Laboratorium' ,tarif:$scope.tarif_rs16.laboratorium},
															{namatarif:'Kamar/Akomodasi' ,tarif:$scope.tarif_rs16.kamar},
															{namatarif:'Obat Kronis' ,tarif:$scope.tarif_rs16.obat_kronis},
															{namatarif:'BMHP' ,tarif:$scope.tarif_rs16.bmhp},
															
														]
							$scope.listTarifRS3 =[
															
															{namatarif:'Konsultasi' ,tarif:$scope.tarif_rs16.konsultasi},
															{namatarif:'Penunjang' ,tarif:$scope.tarif_rs16.penunjang},					//
															{namatarif:'Pelayanan Darah' ,tarif:$scope.tarif_rs16.pelayanan_darah},
															{namatarif:'Rawat Intensif' ,tarif:$scope.tarif_rs16.rawat_intensif},
															{namatarif:'Obat Kemoterapi' ,tarif:$scope.tarif_rs16.obat_kemoterapi},
															{namatarif:'Sewa Alat' ,tarif:$scope.tarif_rs16.sewa_alat}
														]
								});
					
				}

			function loadRawatIntensif(){
				var noregistrasifk = ""
				if ($scope.itemPopUp.noregistrasi != undefined) {
                    noregistrasifk = "noregistrasifk=" + $scope.itemPopUp.norec;
                }
				medifirstService.get("bridging/inacbg/get-daftar-pasien-intensif?"
                    + noregistrasifk
	                     ).then(function (data) {
							$scope.itemPopUp.los_icu = data.data.data;
	                });

			}	
			$scope.listpulang =[
												{namalengkap:'Atas persetujuan dokter' ,id:1},
												{namalengkap:'Dirujuk' ,id:2},
												{namalengkap:'Atas permintaan sendiri' ,id:3},
												{namalengkap:'Meninggal' ,id:4},
												{namalengkap:'Lain-lain' ,id:5},
												]
			$scope.listmasuk =[
												{namalengkap:'Rujukan FKTP' ,id:'gp'},
												{namalengkap:'Rujukan FKRTL' ,id:'hosp'},
												{namalengkap:'Lain-lain' ,id:'other'},
												{namalengkap:'Dari Rawat Inap' ,id:'inp'},
												{namalengkap:'Dari Rawat Jalan' ,id:'outp'},
												{namalengkap:'Dari Rawat Darurat' ,id:'emd'},
												{namalengkap:'Lahir di RS' ,id:'born'},
												{namalengkap:'Rujukan Panti Jompo' ,id:'nursing'},
												{namalengkap:'Rujukan dari RS Jiwa' ,id:'psych'},
												{namalengkap:'Rujukan Fasilitas Rehab' ,id:'rehab'},
												{namalengkap:'Rujukan Spesialis' ,id:'mp'},
												]
			$scope.listOnset = [
				{id:'spontan', text: 'Timbul Spontan'},
				{id:'induksi', text: 'Dengan Induksi'},
				{id:'non_spontan_non_induksi', text: 'SC Tanpa Kontraksi/Induksi'}
			]
			

			function loadpopup() {
				$scope.pasienapgar = false
				loadRiwayatVentilator();
				loadRawatIntensif();
				if ($scope.itemPopUp.apgar1mappear = $scope.dataPasienSelected.menit1_appear!= undefined) {
					$scope.itemPopUp.apgar1mappear = parseFloat($scope.dataPasienSelected.menit1_appear)
				$scope.itemPopUp.apgar1mpulse = parseFloat($scope.dataPasienSelected.menit1_pulse)
				$scope.itemPopUp.apgar1mgrimace = parseFloat($scope.dataPasienSelected.menit1_grimace)
				$scope.itemPopUp.apgar1mactivity = parseFloat($scope.dataPasienSelected.menit1_activity)
				$scope.itemPopUp.apgar1mresp = parseFloat($scope.dataPasienSelected.menit1_resp)
				$scope.itemPopUp.apgar5mappear = parseFloat($scope.dataPasienSelected.menit5_appear)
				$scope.itemPopUp.apgar5mpulse = parseFloat($scope.dataPasienSelected.menit5_pulse)
				$scope.itemPopUp.apgar5mgrimace = parseFloat($scope.dataPasienSelected.menit5_grimace)
				$scope.itemPopUp.apgar5mactivity = parseFloat($scope.dataPasienSelected.menit5_activity)
				$scope.itemPopUp.apgar5mresp = parseFloat($scope.dataPasienSelected.menit5_resp)
				$scope.pasienapgar = true
			}

				
				if ($scope.itemPopUp.idrekanan == 2552) {
					$scope.itemPopUp.carabayar = 'JKN'
				} else if ($scope.itemPopUp.idrekanan == 581164) {
					$scope.itemPopUp.carabayar = 'JAMKESDA'
				}
				
				
				
				
				$scope.itemPopUp.jenis_rawat = $scope.dataPasienSelected.jenis_rawat
				$scope.itemPopUp.kelas_rawat = $scope.dataPasienSelected.nokelasdijamin
				
				$scope.itemPopUp.nomor_kartu = $scope.dataPasienSelected.nokepesertaan
				$scope.itemPopUp.nomor_sep = $scope.dataPasienSelected.nosep
				// $scope.itemPopUp.cob = $scope.dataPasienSelected.nosep
				$scope.itemPopUp.tgl_masuk = moment($scope.dataPasienSelected.tglregistrasi).format('YYYY-MM-DD HH:mm:ss')
				// if ($scope.dataPasienSelected.deptid == 16) {
				// 	$scope.itemPopUp.tgl_pulang = $scope.dataPasienSelected.tglpulangresume + ':00'
				// } else {
					$scope.itemPopUp.tgl_pulang = moment($scope.dataPasienSelected.tglpulang == null ? new Date() : $scope.dataPasienSelected.tglpulang).format ('YYYY-MM-DD HH:mm:ss')
				// }
				$scope.itemPopUp.umur =  $scope.dataPasienSelected.umur
				
				if ($scope.itemPopUp.caramasuk_inacbg == 'gp') {
					$scope.itemPopUp.cara_masuk = {namalengkap:'Rujukan FKTP' ,id:'gp'}
					$scope.itemPopUp.cara_masukkd = 'gp'
				} if ($scope.itemPopUp.caramasuk_inacbg == 'hosp-trans') {
					$scope.itemPopUp.cara_masuk = {namalengkap:'Rujukan FKRTL' ,id:'hosp'}
					$scope.itemPopUp.cara_masukkd = 'hosp-trans'
					
				} if ($scope.itemPopUp.caramasuk_inacbg == 'other') {
					$scope.itemPopUp.cara_masuk = {namalengkap:'Lain-lain' ,id:'other'}
					$scope.itemPopUp.cara_masukkd = 'other'

				} if ($scope.itemPopUp.caramasuk_inacbg == 'inp') {
					$scope.itemPopUp.cara_masuk = {namalengkap:'Dari Rawat Inap' ,id:'inp'}
					$scope.itemPopUp.cara_masukkd = 'inp'

				} if ($scope.itemPopUp.caramasuk_inacbg == 'outp') {
					$scope.itemPopUp.cara_masuk = {namalengkap:'Dari Rawat Jalan' ,id:'outp'}
					$scope.itemPopUp.cara_masukkd = 'outp'

				} if ($scope.itemPopUp.caramasuk_inacbg == 'emd') {
					$scope.itemPopUp.cara_masuk = {namalengkap:'Dari Rawat Darurat' ,id:'emd'}
					$scope.itemPopUp.cara_masukkd = 'emd'

				} if ($scope.itemPopUp.caramasuk_inacbg == 'born') {
					$scope.itemPopUp.cara_masuk = {namalengkap:'Lahir di RS' ,id:'born'}
					$scope.itemPopUp.cara_masukkd = 'born'

				} if ($scope.itemPopUp.caramasuk_inacbg == 'nursing') {
					$scope.itemPopUp.cara_masuk = {namalengkap:'Rujukan Panti Jompo' ,id:'nursing'}
					$scope.itemPopUp.cara_masukkd = 'nursing'

				} if ($scope.itemPopUp.caramasuk_inacbg == 'psych') {
					$scope.itemPopUp.cara_masuk = {namalengkap:'Rujukan dari RS Jiwa' ,id:'psych'}
					$scope.itemPopUp.cara_masukkd = 'psych'

				} if ($scope.itemPopUp.caramasuk_inacbg == 'rehab') {
					$scope.itemPopUp.cara_masuk = {namalengkap:'Rujukan Fasilitas Rehab' ,id:'rehab'}
					$scope.itemPopUp.cara_masukkd = 'rehab'

				} if ($scope.itemPopUp.caramasuk_inacbg == 'mp') {
					$scope.itemPopUp.cara_masuk = {namalengkap:'Rujukan Spesialis' ,id:'mp'}
					$scope.itemPopUp.cara_masukkd = 'mp'

				}
				$scope.itemPopUp.los = $scope.dataPasienSelected.los
				$scope.itemPopUp.jam = $scope.dataPasienSelected.jam
				$scope.itemPopUp.birth_weight = $scope.dataPasienSelected.birth_weight
				if ($scope.itemPopUp.kodeexternal == 1) {
					$scope.itemPopUp.discharge_status = {namalengkap:'Atas persetujuan dokter' ,id:1}
					// $scope.itemPopUp.discharge_statusid = 1
				} else if ($scope.itemPopUp.kodeexternal == 2) {
					$scope.itemPopUp.discharge_status = {namalengkap:'Dirujuk' ,id:2}
					// $scope.itemPopUp.discharge_statusid = 2
				} else if ($scope.itemPopUp.kodeexternal == 3 ) {
					// $scope.itemPopUp.discharge_statusid = 3
					$scope.itemPopUp.discharge_status = {namalengkap:'Atas permintaan sendiri' ,id:3}
				} else if ($scope.itemPopUp.kodeexternal == 4) {
					$scope.itemPopUp.discharge_status = {namalengkap:'Meninggal' ,id:4}
					// $scope.itemPopUp.discharge_statusid = 4
				} else {
					$scope.itemPopUp.discharge_status = {namalengkap:'Lain-lain' ,id:5}
					// $scope.itemPopUp.discharge_statusid = 5
				}
				$scope.itemPopUp.dpjp = {id:$scope.dataPasienSelected.id, namalengkap:$scope.dataPasienSelected.namadokter}
				$scope.itemPopUp.jenis_tarif = 'TARIF RS KELAS A PEMERINTAH'
				$scope.itemPopUp.kode_tarif = $scope.dataPasienSelected.kodetarif
				// $scope.listTarifRS =[
				// 								{namatarif:'Prosedur Non Bedah' ,tarif:$scope.tarif_rs16.prosedur_non_bedah},
				// 								{namatarif:'Tenaga Ahli' ,tarif:$scope.tarif_rs16.tenaga_ahli},
				// 								{namatarif:'Radiologi' ,tarif:$scope.tarif_rs16.radiologi},
				// 								{namatarif:'Rehabilitasi' ,tarif:$scope.tarif_rs16.rehabilitasi},
				// 								{namatarif:'Obat' ,tarif:$scope.tarif_rs16.obat},
				// 								{namatarif:'Alkes' ,tarif:$scope.tarif_rs16.alkes},
				// 								]
												 
				// $scope.listTarifRS2 =[
												
				// 								 {namatarif:'Prosedur Bedah' ,tarif:$scope.tarif_rs16.prosedur_bedah},
				// 								 {namatarif:'Keperawatan' ,tarif:$scope.tarif_rs16.keperawatan},
				// 								 {namatarif:'Laboratorium' ,tarif:$scope.tarif_rs16.laboratorium},
				// 								 {namatarif:'Kamar/Akomodasi' ,tarif:$scope.tarif_rs16.kamar},
				// 								 {namatarif:'Obat Kronis' ,tarif:$scope.tarif_rs16.obat_kronis},
				// 								 {namatarif:'BMHP' ,tarif:$scope.tarif_rs16.bmhp},
												 
				// 							]
				// $scope.listTarifRS3 =[
												
				// 								 {namatarif:'Konsultasi' ,tarif:$scope.tarif_rs16.konsultasi},
				// 								 {namatarif:'Penunjang' ,tarif:$scope.tarif_rs16.penunjang},					//
				// 								 {namatarif:'Pelayanan Darah' ,tarif:$scope.tarif_rs16.pelayanan_darah},
				// 								{namatarif:'Rawat Intensif' ,tarif:$scope.tarif_rs16.rawat_intensif},
				// 								{namatarif:'Obat Kemoterapi' ,tarif:$scope.tarif_rs16.obat_kemoterapi},
				// 								{namatarif:'Sewa Alat' ,tarif:$scope.tarif_rs16.sewa_alat}
				// 							]
				$scope.itemPopUp.usia_kehamilan = $scope.dataPasienSelected.usiakehamilan
				$scope.itemPopUp.gravida = $scope.dataPasienSelected.gravida
				$scope.itemPopUp.partus = $scope.dataPasienSelected.partus
				$scope.itemPopUp.abortus = $scope.dataPasienSelected.abortus
				if ($scope.itemPopUp.usia_kehamilan != null) {
					$scope.itemPopUp.persalinan = true;
				} else {
					$scope.itemPopUp.persalinan = false;
				}
				
			}
			$scope.pasientbinsert = function () {
				var dt1 = {}
				var dt2 = []
				// for (var i = dataSave.length - 1; i >= 0; i--) {
				dt1 = {
					"metadata": {
						"method": "sitb_validate"
					},
					"data": {
						"nomor_sep": $scope.itemPopUp.nomor_sep,//dataSave[i].nomor_sep,      
						"nomor_register_sitb": $scope.itemPopUp.nomor_register_sitb,
					}
				}
				dt2.push(dt1)
				// }

				var objData = {
					"data": dt2
				}
				medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
					// response oke saja
					responData = e.data.dataresponse;
					let response = e.data.dataresponse
					let arrStatus =[]
					for (var i = 0; i < response.length; i++) {
						const element = response[i]
						if(element.datarequest.metadata.method == 'sitb_validate'
							 && element.dataresponse.metadata.code == 200  ){
							arrStatus.push(
								{
									nosep:element.datarequest.data.nomor_sep,
									statusklaim: element.datarequest.metadata.method 
								})
						}
					}
					if(arrStatus.length>0){

						for (var i = 0; i < data2.length; i++) {
							const elem = data2[i]
							for (var ii = 0; ii < arrStatus.length; ii++) {
								const elem2 = arrStatus[ii]
								if(elem.nosep == elem2.nosep){
									elem2.norec = elem.norec
								}
							}
						}

						medifirstService.post('bridging/inacbg/save-status', {'data':arrStatus}).then(function (z) {
							loadData();	
						})
					}
					// medifirstService.post("tatarekening/simpan-verifikasi-tagihan-inacbg/"+$scope.dataPasienSelected.noregistrasi ,$scope.dataPasienSelected)
					// 	.then(function (e) {
					// 		loadData();

					// 	});
					toastr.info(responData[0].dataresponse.response.detail, 'INACBG');
				})
			}
			$scope.pasientbdell = function () {
				var dt1 = {}
				var dt2 = []
				// for (var i = dataSave.length - 1; i >= 0; i--) {
				dt1 = {
					"metadata": {
						"method": "sitb_invalidate"
					},
					"data": {
						"nomor_sep": $scope.itemPopUp.nomor_sep,//dataSave[i].nomor_sep, 
					}
				}
				dt2.push(dt1)
				// }

				var objData = {
					"data": dt2
				}
				medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
					// response oke saja
					responData = e.data.dataresponse;
					let response = e.data.dataresponse
					let arrStatus =[]
					for (var i = 0; i < response.length; i++) {
						const element = response[i]
						if(element.datarequest.metadata.method == 'sitb_validate'
							 && element.dataresponse.metadata.code == 200  ){
							arrStatus.push(
								{
									nosep:element.datarequest.data.nomor_sep,
									statusklaim: element.datarequest.metadata.method 
								})
						}
					}
					if(arrStatus.length>0){

						for (var i = 0; i < data2.length; i++) {
							const elem = data2[i]
							for (var ii = 0; ii < arrStatus.length; ii++) {
								const elem2 = arrStatus[ii]
								if(elem.nosep == elem2.nosep){
									elem2.norec = elem.norec
								}
							}
						}

						medifirstService.post('bridging/inacbg/save-status', {'data':arrStatus}).then(function (z) {
							loadData();	
						})
					}
					// medifirstService.post("tatarekening/simpan-verifikasi-tagihan-inacbg/"+$scope.dataPasienSelected.noregistrasi ,$scope.dataPasienSelected)
					// 	.then(function (e) {
					// 		loadData();

					// 	});
					toastr.info(responData[0].dataresponse.metadata.message, 'INACBG');
				})
			}

			$scope.previewV2 = function (id) {
				$scope.isRouteLoading = true
				medifirstService.get(`report/dokasuransi?id=${id}&noregistrasi=${$scope.dataPasienSelected.noregistrasi}&user=${$scope.user.namaLengkap}`).then(function (e) {
					$scope.isRouteLoading = false
					if(e.data.parameter == "?q=q") {
						toastr.info("Info", "Data tidak ada !")
						return
					}
					window.open(baseTransaksi 
					+ e.data.url 
					+ e.data.parameter, 
					'_blank');
				})
			}

			$scope.uploadKelengkapanNew = function () {
				isCheckAll2 = false;
				isCheckAll = false
				$scope.popUpDokumen = [];
				if ($scope.dataPasienSelected.noregistrasi == undefined ) {
					toastr.error('Pilih data dulu')
					return
				}
				var dpid = $scope.dataPasienSelected.objectdepartemenfk
				// if(dpid != 16) {
				// 	dpid = 18
				// }
				$scope.popUpDokumen = $scope.dataPasienSelected
				$scope.listBerkasMonitoring =[]
				$scope.isRouteLoading = true
				medifirstService.get('bridging/inacbg/get-list-berkas-monitoring?dpid=' + dpid + '&noregistrasifk='+$scope.dataPasienSelected.norec ).then(function(e){
					$scope.isRouteLoading = false
					$scope.listBerkasMonitoring = e.data.data
					$scope.listUploadMonitoring = e.data.upload
					for (var i = 0; i < $scope.listBerkasMonitoring.length; i++) {
						$scope.listBerkasMonitoring[i].no = i + 1
						$scope.listBerkasMonitoring[i].norec = $scope.dataPasienSelected.norec
						$scope.listBerkasMonitoring[i].noregistrasi = $scope.dataPasienSelected.noregistrasi
						$scope.listBerkasMonitoring[i].kodeexternal = null
						$scope.listBerkasMonitoring[i].statCheckbox = false

						const elem = $scope.listBerkasMonitoring[i]
						for (var x = 0; x < $scope.listUploadMonitoring .length; x++) {
							const elem2 = $scope.listUploadMonitoring [x]
							if(elem2.documentklaimfk == elem.id){
								$scope.listBerkasMonitoring[i].kodeexternal = elem2.filename
							}
						}
					}
					$scope.dataDaftarDokumen = new kendo.data.DataSource({
						data: $scope.listBerkasMonitoring,
						pageSize: 10,
						total: $scope.listBerkasMonitoring.length,
						serverPaging: false,
						schema: {
							model: {
								fields: {
								}
							}
						}
					});
					$scope.popupUploadNew.center().open();
				})
			}

			$scope.columnDaftarDokumen = {
				selectable: 'row',
				pageable: true,
	            columns:[
					{
						"title": "<input type='checkbox' class='checkbox' ng-click='selectUnselectAllRow()' />",
						template: "# if (statCheckbox) { #" +
							"<input type='checkbox' class='checkbox' ng-click='selectRow(dataItem)' checked />" +
							"# } else { #" +
							"<input type='checkbox' class='checkbox' ng-click='selectRow(dataItem)' />" +
							"# } #",
						width: "5px"
					},
				{
					"field": "no",
					"title": "No",
					"width":"10px",
					"template": "<span class='style-center'>#: no #</span>"
				},
				{
					"field": "namaberkas",
					"title": "Nama File",
					"width":"80px",
				},
				{
					"title": "Action",
					"width":"45px",
					"template": "<span class='style-center'>\
					# if(data.kodeexternal == null) {#\
						<div class=\"upload-btn-wrapper\">\
							<button class=\"btnupload\">Upload</button>\
							<input type=\"file\" id=\"filePasien\" accept=\"application/pdf\" data-id=\"#: data.id #\" data-namafile=\"#: data.namaberkas #\" data-norec=\"#: data.norec #\" />\
						</div>\
						<div class=\"upload-btn-wrapper\" ng-if=\"[29,30,31].includes(#: data.id #)\" >\
							<button class=\"btnupload\" id=\"cariDokumen\" data-id=\"#: data.id #\" data-noreg=\"#: data.noregistrasi #\">Cari Dokumen</button>\
						</div>\
						<div class=\"upload-btn-wrapper\" ng-hide=\"hideSimpan\">\
							<button class=\"btnupload\" id=\"simpanDok\" data-id=\"#: data.id #\" data-noreg=\"#: data.noregistrasi #\">Simpan</button>\
						</div>\
					# } else {#\
						<a href=\"javascript:void(0);\" id=\"LihatDokumenKlaim\" data-noreg=\"#: data.noregistrasi #\" data-namafile=\"#: data.kodeexternal #\" data-documentklaimfk=\"#: data.id #\"><i class=\"fa fa-file-pdf-o hitam\" aria-hidden=\"true\"></i></a>\
					# } #\
					</span>",
				},			
			]};

			$scope.selectRow = function (dataItem) {
				var dataSelect = _.find($scope.dataDaftarDokumen._data, function (data) {
					return data.id == dataItem.id;
				});

				if (dataSelect.statCheckbox) {
					dataSelect.statCheckbox = false;
				}
				else {
					dataSelect.statCheckbox = true;
				}
				
			}

            var isCheckAll = false
            $scope.selectUnselectAllRow = function () {
				var tempData = $scope.dataDaftarDokumen._data;

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

				reloadDataGridOrder(tempData);
			}

            function reloadDataGridOrder(dsv) {
                var newDsv = new kendo.data.DataSource({
                    data: dsv,
                    _data: dsv,
                    pageSize: 10,
                    total: dsv.length,
                    serverPaging: false,
                    // aggregate: [
                    //     { field: 'total', aggregate: 'sum' },
                    // ]
					schema: {
						model: {
							fields: {
							}
						}
					}

                });

                var grid = $('#kGridDokumen').data("kendoGrid");

                grid.setDataSource(newDsv);
                grid.refresh();

            }

			$scope.selectRow2 = function (dataItem) {
				var dataSelect = _.find($scope.dataCariDaftarDokumen._data, function (data) {
					return data.namafile == dataItem.namafile;
				});

				if (dataSelect.statCheckbox) {
					dataSelect.statCheckbox = false;
				}
				else {
					dataSelect.statCheckbox = true;
				}
				
			}

            var isCheckAll2 = false
            $scope.selectUnselectAllRow2 = function () {
				var tempData = $scope.dataCariDaftarDokumen._data;

				if (isCheckAll2) {
					isCheckAll2 = false;
					for (var i = 0; i < tempData.length; i++) {
						tempData[i].statCheckbox = false;
					}
				}
				else {
					isCheckAll2 = true;
					for (var i = 0; i < tempData.length; i++) {
						tempData[i].statCheckbox = true;
					}
				}

				reloadDataGridOrder2(tempData);
			}

            function reloadDataGridOrder2(dsv) {
                var newDsv = new kendo.data.DataSource({
                    data: dsv,
                    _data: dsv,
                    pageSize: 10,
                    total: dsv.length,
                    serverPaging: false,
                    // aggregate: [
                    //     { field: 'total', aggregate: 'sum' },
                    // ]
					schema: {
						model: {
							fields: {
							}
						}
					}

                });

                var grid = $('#kGrid2').data("kendoGrid");

                grid.setDataSource(newDsv);
                grid.refresh();

            }

			$('body ').on('change','#filePasien',function(e){
                var id = $(this).data("id");
                var norec = $(this).data("norec");
                var namafile = $(this).data("namafile");

                if (e.target.files[0]) {
                    $scope.isRouteLoading = true;
                    const url = baseTransaksi + 'bridging/inacbg/post-dokumen-klaim'
                    const formData = new FormData()
				    const file = e.target.files[0];
                    if(file.type != "application/pdf") {
                        toastr.error('File yang diizinkan dalam bentuk format PDF.')
                        return;
                    }

                    formData.append('fileBerkas', file)
                    formData.append('noregistrasifk', norec)
                    formData.append('documentklaimfk', id)
                    formData.append('namafile', namafile)
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
                    })
                    .then(response => response.json())
                    .then(result => {
                        $scope.isRouteLoading = false;
                        medifirstService.postLogging('Dokumen Klaim', 'Norec dokklaim_t', result.dokumen.norec, 
                        'Upload Dokumen Klaim '+ namafile +' pada norec pasiendaftar_t ' + norec).then(function (res) {})
                        toastr.success(" Berkas berhasil.");
                        loadDataDokumen()
                    })
                    .catch((error) => {
                        $scope.isRouteLoading = false;
                        toastr.error("Simpan Berkas gagal.");
                    });
                }
            });

			var rowDokumen = {}
			$('body ').on('click','#LihatDokumenKlaim',function(e){
                // var noregistrasi = $(this).data("noreg");
                // var namafile = $(this).data("namafile");
                // var documentklaimfk = $(this).data("documentklaimfk");
				rowDokumen[0] = $(this).data("noreg");
				rowDokumen[1] = $(this).data("namafile");
				rowDokumen[2] = $(this).data("documentklaimfk");
				// console.log(rowDokumen)
				$scope.popUpConfirmDok.open().center()
                // var confirm = $mdDialog.confirm()
                //     .title('Peringatan')
                //     .textContent('Harap pilih aksi yang diinginkan !')
                //     .ariaLabel('Lucky day')
                //     .cancel('Hapus Dok.')
                //     .ok('Lihat Dok.')
                // $mdDialog.show(confirm).then(function () {
                //     var strBACKEND = baseTransaksi.replace('service/medifirst2000/', '')
                //     window.open(strBACKEND + "service/storage/dokumenklaim?noregistrasi="+ noregistrasi + "&filename=" + namafile);
                // }, function() {
                //     var jsondel = {
                //         "noregistrasi": noregistrasi,
                //         "documentklaimfk": documentklaimfk,
                //     }
                //     $scope.isRouteLoading = true;
                //     medifirstService.post('bridging/inacbg/delete-dokumen-klaim', jsondel).then(function (data) {
                //         $scope.isRouteLoading = false;
                //         medifirstService.postLogging('Dokumen Klaim', 'noregistrasi pasiendaftar', noregistrasi, 
                //         'Hapus Dokumen Klaim  pada No Registrasi ' + noregistrasi + ' dengan id dokumen klaim ' + documentklaimfk).then(function (res) {
                //         })
                //         loadDataDokumen()
                //     })
                // })

				
            })

			$scope.lihatDok = function () {
				var strBACKEND = baseTransaksi.replace('service/medifirst2000/', '')
                    window.open(strBACKEND + "service/storage/dokumenklaim?noregistrasi="+ rowDokumen[0] + "&filename=" + rowDokumen[1]);
			}

			$scope.hapusDok = function () {
				var jsondel = {
					        "noregistrasi": rowDokumen[0],
					        "documentklaimfk": rowDokumen[2],
					    }
					    $scope.isRouteLoading = true;
					    medifirstService.post('bridging/inacbg/delete-dokumen-klaim', jsondel).then(function (data) {
					        $scope.isRouteLoading = false;
					        medifirstService.postLogging('Dokumen Klaim', 'noregistrasi pasiendaftar', rowDokumen[0], 
					        'Hapus Dokumen Klaim  pada No Registrasi ' + rowDokumen[0] + ' dengan id dokumen klaim ' + rowDokumen[2]).then(function (res) {
					        })
					        loadDataDokumen()
							$scope.popUpConfirmDok.close()
							rowDokumen= [];
					    })
			}

			$('body ').on('click','#cariDokumen',function(e){
                var id = $(this).data("id");
                var noregistrasi = $(this).data("noreg");
                $scope.isRouteLoading = true
				medifirstService.get(`bridging/inacbg/get-parameter?id=${id}&noregistrasi=${noregistrasi}&user=${$scope.user.namaLengkap}`).then(function (e) {
					$scope.isRouteLoading = false
                    for (let i = 0; i < e.data.data.length; i++) {
                        e.data.data[i].no = i + 1;
						const query = e.data.data[i].param;
						const params = new URLSearchParams(query);
						if ([29,7].includes(e.data.data[i].id)) {
							const noorder = params.get('noorder');
							e.data.data[i].namafile = e.data.data[i].namafile + '_' + noorder
						}

						if ([31,9].includes(e.data.data[i].id)) {
							const noorder = params.get('noorder');
							const namaproduk = params.get('namaproduk');
							e.data.data[i].namafile = e.data.data[i].namafile + '_' + noorder +'_'+namaproduk
						}
						
						e.data.data[i].statCheckbox = false;
						
                    }
                    $scope.dataCariDaftarDokumen = new kendo.data.DataSource({
						data: e.data.data,
						pageSize: 10,
						total: e.data.data.length,
						serverPaging: false,
						schema: {
							model: {
								fields: {
								}
							}
						}
					});


                    // Get current actions
                    var actions = $scope.popUpData.options.actions;
                    // Remove "Close" button
                    actions.splice(actions.indexOf("Close"), 1);
                    // Set the new options
                    $scope.popUpData.setOptions({ actions : actions });
                    $scope.popUpData.center().open();

					// if(e.data.parameter == "?q=q") {
                    //     toastr.info("Infor", "Data tidak ditemukan");
                    //     return
                    // }
                    // window.open(baseTransaksi 
					// + e.data.url 
					// + e.data.parameter, 
					// '_blank');
				})
            })
			$scope.hideSimpan = false

			$('body ').on('click','#simpanDok',function(e){
                var id = $(this).data("id");
                var noregistrasi = $(this).data("noreg");
                var namafile = $(this).data("namafile");
                $scope.isRouteLoading = true
				$scope.hideSimpan = true
				medifirstService.get(`bridging/inacbg/get-parameter?id=${id}&noregistrasi=${noregistrasi}&user=${$scope.user.namaLengkap}`).then(function (e) {
					$scope.hideSimpan = false
					$scope.isRouteLoading = false
					
					if (e.data.data.length == 0 && ![4,11,15].includes(id)) {
						toastr.info("Info", "Data tidak ditemukan");
						    return
					} else {
						if ([4,11,15].includes(id)) {
							var a = {id:id, noregistrasi: noregistrasi, nosep:$scope.popUpDokumen.nosep,length:0, namafile : namafile}
							simpanDokumen2(a)
						} else {
							simpanDokumen2(e.data.data)
						}
						
					}
				})
            })

            $scope.columnCariDaftarDokumen = {
				selectable: 'row',
				pageable: true,
	            columns:[
					{
						"title": "<input type='checkbox' class='checkbox' ng-click='selectUnselectAllRow2()' />",
						template: "# if (statCheckbox) { #" +
							"<input type='checkbox' class='checkbox' ng-click='selectRow2(dataItem)' checked />" +
							"# } else { #" +
							"<input type='checkbox' class='checkbox' ng-click='selectRow2(dataItem)' />" +
							"# } #",
						width: "5px"
					},
				{
					"field": "no",
					"title": "No",
					"width":"10px",
				},
				{
					"field": "namafile",
					"title": "Nama File",
					"width":"80px",
				},
                {
                    "command": [
                        {
                            text: "Lihat",
                            click: lihatDokumen,
                        },
                        {
                            text: "Simpan",
                            click: simpanDokumen,
                        },
                    ],
                    title: "Action",
                    width: "40px",
                },
			]};

            function lihatDokumen(e) {
				e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                if(dataItem.param == "?q=q") {
                    toastr.info("Infor", "Data tidak ditemukan");
                    return
                }
                window.open(baseTransaksi 
                + dataItem.url 
                + dataItem.param, 
                '_blank');
            }
            function simpanDokumen(e) {
				e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                if(dataItem.param == "?q=q") {
                    toastr.info("Infor", "Data tidak ditemukan");
                    return
                }
						medifirstService.get(dataItem.url + dataItem.param + "&issimpanberkas=true&iddok=" + dataItem.id 
							+ "&isberkasnoreg=" + dataItem.noregistrasi 
							+ "&namafile=" + dataItem.namafile).then(function (data) {
							toastr.success( data.data.message);
							$scope.tutupdokumen()
							loadDataDokumen()
						}).catch(error => {
							toastr.error("File gagal disimpan: " + error.message);
						});
				// $scope.tutupdokumen();
            }

			function simpanDokumen2(data) {
				if (data.length == 0 && [4,11,15].includes(data.id)) {
					var dt1 = {};
					var dt2 = [];
					dt1 = {
						"metadata": { "method": "claim_print" },
						"data": { "nomor_sep": data.nosep }
					};
					dt2.push(dt1);
					var objData = { "data": dt2 };
				
					medifirstService.postNonMessage('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
						var responData = e.data.dataresponse;
						if (responData[0].dataresponse.metadata.code == 200) {
							var byteCharacters = atob(responData[0].dataresponse.data);
							var byteNumbers = new Array(byteCharacters.length);
							for (var i = 0; i < byteCharacters.length; i++) {
								byteNumbers[i] = byteCharacters.charCodeAt(i);
							}
							var byteArray = new Uint8Array(byteNumbers);
							var blob = new Blob([byteArray], { type: 'application/pdf' });
						
							var formData = new FormData();

							const url = baseTransaksi + 'report/save-file-lip'
							
							formData.append("fileLip", blob,"document.pdf");
							formData.append("isberkasnoreg", data.noregistrasi);
							formData.append("namafile", 'lip' );
							formData.append("iddok",  data.id);
							
							fetch(url, {
								method: 'POST',
								body: formData
							})
							.then(response => response.json())
							.then(data => {
								toastr.success( data.message);
								loadDataDokumen()
							})
							.catch(error => {
								toastr.error(error.message);
							});


						} else {
							toastr.info('LIP belum bisa di posting!, ' + responData[0].dataresponse.metadata.message)
						}
					});
				} else{
					for (let i = 0; i < data.length; i++) {
						const element = data[i];
						const query =  element.param;
						const params = new URLSearchParams(query);
						if ([29,7].includes(element.id)) {
							const noorder = params.get('noorder');
								element.namafile = element.namafile + '_' + noorder
							
						}
						if ([31,9].includes(element.id)) {
							const noorder = params.get('noorder');
							const namaproduk = params.get('namaproduk');
							element.namafile = element.namafile + '_' + noorder +'_'+namaproduk
						}
						var paramindex = '';
						if ([37,82].includes(element.id)) {
							const index = params.get('index');
							element.namafile = element.namafile + '_' + index
							paramindex = "&index=" + index
						}
						if ([6,38,72,73,74,75,76,77,78,79,80,81,83,84,85,86].includes(element.id)) {
							const filename = params.get('filename');
							element.namafile = filename.substring(0, filename.lastIndexOf("."));
						}
						medifirstService.get(element.url + element.param + "&issimpanberkas=true&iddok=" + element.id 
							+ "&isberkasnoreg=" + element.noregistrasi 
							+ "&namafile=" + element.namafile + paramindex).then(function (data) {
							toastr.success( data.data.message);
							loadDataDokumen()
						}).catch(error => {
							toastr.error("File gagal disimpan: " + error.message);
						});
					}
				}
					
				// $scope.tutupdokumen();
            }

            $scope.tutupdokumen = function() {
                loadDataDokumen()
                $scope.popUpData.close();
            }

			$scope.bunldedokumen = function() {
				var noregistrasi = $scope.dataPasienSelected.noregistrasi;
                var strBACKEND = baseTransaksi.replace('service/medifirst2000/', '')
                window.open(strBACKEND + "service/storage/bundledokumenklaim?noregistrasi="+ noregistrasi);
			}
			
		

			$scope.import = function() {
				if ($scope.dataPasienSelected.noregistrasi == undefined) {
					toastr.error('Data pasien belum dipilih');
					return;
				}
				$scope.now = new Date();
				
				
				
                var detaildiagnosapasien = {
					import: 1,
                    noregistrasifk: $scope.dataPasienSelected.norec_apd,
                    tglregistrasi: $scope.dataPasienSelected.tglregistrasi,
                  	data : $scope.importIcd,
                    tglinputdiagnosa: moment($scope.now).format('YYYY-MM-DD hh:mm:ss'),
                }
                var objSave =
                {
                    detaildiagnosapasien: detaildiagnosapasien,
                }

				if ($scope.item.countIcdInacbg > 0) {
					var confirm = $mdDialog.confirm()
					.title('Informasi')
					.textContent('Diagnosa UNU Grouper sudah ada, apakah ingin tetap melakukan import?')
					.cancel('Tidak')
					.ok('Ya')
          			$mdDialog.show(confirm).then(function () {
					
						medifirstService.post('registrasi/save-diagnosa-pasien-import', objSave).then(function (e) {
							for (var i = 0; i < $scope.importIcd.length; i++) {
								$scope.saveLogging('Diagnosis', 'Norec DiagnosaPasien_T', e.data.data.norec,
							'Input Diagnosis ICD 10 ( ' + $scope.importIcd[i].kdNama + ' )' + ' No Registrasi / No RM ' + $scope.dataPasienSelected.noregistrasi
							+ '/ ' +  $scope.dataPasienSelected.nocm);
							}
							delete $scope.importIcd;

							loadicd()
							// loadData()
							
						})
          			})
					  
				} else {
					medifirstService.post('registrasi/save-diagnosa-pasien-import', objSave).then(function (e) {
						for (var i = 0; i < $scope.importIcd.length; i++) {
							$scope.saveLogging('Diagnosis', 'Norec DiagnosaPasien_T', e.data.data.norec,
						'Input Diagnosis ICD 10 ( ' + $scope.importIcd[i].kdNama + ' )' + ' No Registrasi / No RM ' + $scope.dataPasienSelected.noregistrasi
						+ '/ ' +  $scope.dataPasienSelected.nocm);
						}
						
						delete $scope.importIcd;
						loadicd()
						// loadData()
					})
				}
				$scope.import1();
			}


			$scope.import1 = function() {
				$scope.now = new Date();
                var detaildiagnosatindakanpasien = {
                    objectpasienfk: $scope.dataPasienSelected.norec_apd,
                    tglpendaftaran: $scope.dataPasienSelected.tglregistrasi,
                    data: $scope.importIcd9,
					ketdiagnosa: 'INAcbg',
                }
                var objSave =
                {
                    detaildiagnosatindakanpasien: detaildiagnosatindakanpasien
                }

				if ($scope.item.countIcd9Inacbg > 0) {
					var confirm = $mdDialog.confirm()
					.title('Informasi')
					.textContent('Diagnosa ICD 9 UNU sudah ada, apakah ingin tetap melakukan import?')
					.cancel('Tidak')
					.ok('Ya')
          			$mdDialog.show(confirm).then(function () {
						medifirstService.post('registrasi/save-diagnosa-tindakan-pasien-import', objSave).then(function (e) {
							for (var i = 0; i < $scope.importIcd9.length; i++) {
								$scope.saveLogging('Diagnosis', 'Norec DiagnosaTindakanPasien_T', e.data.data.norec,
								'Input Diagnosis ICD 9 ( ' +  $scope.importIcd9[i].kdNama + ' )' + ' No Registrasi / No RM ' + $scope.dataPasienSelected.noregistrasi
								+ '/ ' +  $scope.dataPasienSelected.nocm)
							}
						
					
							delete $scope.importIcd9;
							loadicdix()
							// loadData()
						})
          			})
					  
				} else {
					medifirstService.post('registrasi/save-diagnosa-tindakan-pasien-import', objSave).then(function (e) {
						
						for (var i = 0; i < $scope.importIcd9.length; i++) {
							$scope.saveLogging('Diagnosis', 'Norec DiagnosaTindakanPasien_T', e.data.data.norec,
							'Input Diagnosis ICD 9 ( ' +  $scope.importIcd9[i].kdNama + ' )' + ' No Registrasi / No RM ' + $scope.dataPasienSelected.noregistrasi
							+ '/ ' +  $scope.dataPasienSelected.nocm)
						}
					
						delete $scope.importIcd9;
						loadicdix()
						// loadData()
					})
				}
			}

			$scope.importIna = function() {
				if ($scope.dataPasienSelected.noregistrasi == undefined) {
					toastr.error('Data pasien belum dipilih');
					return;
				}
				$scope.now = new Date();
				
                var objSave = {
                    noregistrasifk: $scope.dataPasienSelected.norec_apd,
                    tglregistrasi: moment($scope.dataPasienSelected.tglregistrasi).format('YYYY-MM-DD HH:mm:ss'),
					noregistrasi: $scope.dataPasienSelected.noregistrasi,
                }
			
				$scope.disabledTombol = true
				$scope.isLoadingNav = true
				medifirstService.post('registrasi/save-diagnosa-ina-grouper-import', objSave).then(function (e) {
					$scope.disabledTombol = false
					$scope.isLoadingNav = false
					loadicdInu()
					loadicdixIna()
					
					
				},function (params) {
					$scope.disabledTombol = false
					$scope.isLoadingNav = false
				})
          			
					  
				
			}
			
			$scope.hasilLab = function () {
				if ($scope.dataPasienSelected.noregistrasi == undefined ) {
					toastr.error('Pilih data dulu')
					return
				}
                medifirstService.get("laboratorium/get-hasil-lisnoregis-rev?noreg=" + $scope.dataPasienSelected.noregistrasi).then(function (data) {
                var sourceGrid = []
                var resBrid = data.data.resBridging
                var produk =  data.data.produk
               
                if(resBrid == null){
                    toastr.info("Data tidak ada", 'Info')
                    $scope.isRouteLoading =false
                    return;
                }

                if(resBrid.status ==200){
                    for (var i = 0; i < resBrid.data.length; i++) {
                       const elem = resBrid.data[i]
                    //    let flag = 'T'
                    //    if(elem.flag  != 'H' &&elem.flag  != 'L'&&elem.flag  != '**' ){
                    //        flag = 'N'
                    //    }
                    if(elem.flag == 'N'){
                        elem.classFlag = 'green'
                    }
                    if(elem.flag == 'H'){
                        elem.classFlag = 'yellow'
                    }
                    if(elem.flag == 'L'){
                        elem.classFlag = 'yellow'
                    }
                    if(elem.flag == 'HH'){
                        elem.result_value = '**'+elem.result_value
                        elem.classFlag = 'red'
                    }
                    if(elem.flag == 'LL'){
                        elem.result_value = '**'+elem.result_value
                        elem.classFlag = 'red'
                    }
                    if(elem.flag == 'Y'){
                        elem.result_value = elem.result_value
                        elem.classFlag = 'yellow'
                    }
                       var dataHasilLab = {
                            'flag' :elem.flag,
                            'nama_pemeriksaan' :elem.examination_name,
                            'analis' : elem.analis,
                            'hasil': elem.result_value,
                            'satuan' : elem.unit,
                            'nilainormal' : elem.normal_value,
                            'tanggal_validasi' : moment(new Date(elem.visit_date)).format('YYYY-MM-DD HH:mm'),
                            'resourceType' :elem.metode,
                            'unit':elem.treatment_name,
                            'classFlag':elem.classFlag
                        }
                        sourceGrid.push(dataHasilLab)
                    }


                } else
                    toastr.info(resBrid.message, 'Info')

                $scope.isRouteLoading = false
                $scope.resultGrids = new kendo.data.DataSource({
                    data: sourceGrid,
                     schema: {
                            model: {
                                // id: "id",
                                fields: {
                                    nama_pemeriksaan: { editable: false ,type: "string"},
                                
                                }
                            }
                        },
                    selectable: true,
                    refresh: true,
                    group: [
                    {field: "tanggal_validasi"},
                    {field: "unit"},    
                    ]
                     
                   
                    
                    // sort: { field: "no_urut", dir: "asc" }
                });
            });     
                
                $scope.popUp.center().open()
            }
			$scope.ColumnResult = {
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "HasilLab.xlsx",
                    allPages: true,
                },

                excelExport: function (e) {

                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:G1"];
                    sheet.name = "Hasil";

                    var myHeaders = [

                        {
                            value: "Hasil Laboratorium",
                            fontSize: 15,
                            textAlign: "center",
                            background: "#c1d2d2",
                            // color:"#ffffff"
                        }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 50 });
                },
                columns: [{
                    field: "nama_pemeriksaan",
                    title: "Nama Pemeriksaan",
                    width: "20%"
                }, {
                    field: "hasil",
                    title: "Hasil Pemeriksaan",
                    width: "15%",
                    attributes: {
                        class: "#= classFlag #"
                   },
                }, {
                    field: "nilainormal",
                    title: "Nilai Normal",
                    width: "15%"
                }, 
                {
                    field: "satuan",
                    title: "Satuan",
                    width: "8%"
                }, 
                // {
                //     field: "keterangan",
                //     title: "Keterangan",
                //     width: "15%"
                // }, 
                {
                    field: "analis",
                    title: "Analis",
                    width: "20%"
                }, 
                {
                    field: "tanggal_validasi",
                    title: "Tgl Hasil",
                    width: "20%"
                },
                // {
                //     title: "Status",
                //     field: "flag",
                //     width: "7%"
                // },
                //     {
                //     field: "nama_alat",
                //     title: "Alat",
                //     width: "15%"
                // },
                {
                    field: "unit",
                    title: "Jenis",
                    width: "15%"
                },
                 {
                    hidden: true,
                    field: "unit",
                    title: "Jenis"
                },
         
                //  {
                //     hidden: true,
                //     field: "no_urut"

                // }
                ],
                sortable: {
                    mode: "single",
                    allowUnsort: false,
                }
                ,
                pageable: {
                    messages: {
                        display: "Menampilkan {2} data"
                    }
                },
            };

			$scope.Cetakbpjs = function () {
				if ($scope.dataPasienSelected.noregistrasi == undefined ) {
					toastr.error('Pilih data dulu')
					return
				}
				window.open(configuration.baseApiBackend  + "report/billingbpjs?noregistrasi=" + $scope.dataPasienSelected.noregistrasi
						+ "&user=" + medifirstService.getPegawai().namaLengkap+ "&kdprofile="+ medifirstService.getProfile().id);
			}

			$scope.HasilExpertise = function(){             
               
                $scope.sourceExpRad = new kendo.data.DataSource({
                    data: [],
                    pageSize: 10
                });
                
                
                $scope.popupExp = $scope.dataPasienSelected             
                medifirstService.get('registrasi/daftar-registrasi/get-daftar-expertise-rad?noregistrasi='
                    + $scope.dataPasienSelected.noregistrasi).then(function (e) {
                        for (var i = e.data.daftar.length - 1; i >= 0; i--) {
                            e.data.daftar[i].no = i + 1
                        }
                        $scope.isRouteLoading = false
                        $scope.sourceExpRad = new kendo.data.DataSource({
                            data: e.data.daftar,
                            pageSize: 10
                        });
                    });             
                $scope.popUpExpRad.center().open();
            }
            $scope.columnExpRad = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "20px",
                },
                {
                    "field": "tanggal",
                    "title": "Tgl Order",
                    "width": "50px",
                },
                {
                    "field": "noorder",
                    "title": "No Order",
                    "width": "60px",
                },
                {
                    "field": "namaproduk",
                    "title": "Layanan",
                    "width": "120px",
                },
                {
                    "field": "namalengkap",
                    "title": "Dokter",
                    "width": "100px"
                },
                {
                    "field": "namaruangan",
                    "title": "Ruangan",
                    "width": "100px",
                }
            ];
            $scope.lihatHasilExpertasi = function(){
                if ($scope.dataExpRad == undefined) {
                    window.messageContainer.error("Pilih Data Dulu!");
                    return;
                }
                $scope.norecHasilRadiologi = ''
                $scope.item.namaPelayanan = $scope.dataExpRad.namaproduk
                $scope.item.dokters = $scope.dataExpRad.namalengkap
                medifirstService.get('radiologi/get-hasil-radiologi?norec_pp=' + $scope.dataExpRad.norec_pp + '&idproduk=' + $scope.dataExpRad.produkfk).then(function (e) {
                    if (e.data.length > 0) {
                        $scope.norecHasilRadiologi = e.data[0].norec
                        $scope.item.nofoto=e.data[0].nofoto
                        $scope.item.tglInput = new Date(e.data[0].tanggal)
                        $scope.item.dokter = e.data[0].namalengkap 
                        $scope.item.keterangan = e.data[0].keterangan.replace(/~/g, "\n")
                    }

                })
            }

			$scope.cetakEks = function () {

                if ($scope.norecHasilRadiologi != '') {
                    var local = JSON.parse(localStorage.getItem('profile'))
                    var nama = medifirstService.getPegawaiLogin().namaLengkap
                    if (local != null) {
                        var profile = local.id;
                        window.open(configuration.baseApiBackend + "report/cetak-ekspertise?norec=" + $scope.norecHasilRadiologi + '&kdprofile=' + profile
                            + '&nama=' + nama, '_blank');
                    }
                }
            }

			$scope.ubahTglPulang =  function () {
				if ($scope.dataPasienSelected == undefined) {
				  toastr.error('Pilih data dulu!')
				  return
				}
				$scope.popUpTp.tanggal = $scope.dataPasienSelected.tglpulang
				$scope.popUpTglPulang.open().center()
			  }
			  $scope.batalTGL =  function () {
				$scope.popUpTglPulang.close()
			  }
	
			  $scope.simpanTGL = function () {
				 var item = {
							depid : $scope.dataPasienSelected.deptid,
							noreg : $scope.dataPasienSelected.noregistrasi,
							tanggal : moment($scope.popUpTp.tanggal).format('YYYY-MM-DD HH:mm:ss')
						}
				  medifirstService.post('tatarekening/update-tanggal-pulang', item).then(function (e) {
					loadData();
							$scope.popUpTglPulang.close()
						})
			  }

			  $scope.ubahTglMasuk =  function () {
				if ($scope.dataPasienSelected == undefined) {
				  toastr.error('Pilih data dulu!')
				  return
				}
				$scope.popUpTm.tanggal = $scope.dataPasienSelected.tglregistrasi
				$scope.popUpTglMasuk.open().center()
			  }
			  $scope.batalTGLMasuk =  function () {
				$scope.popUpTglMasuk.close()
			  }
	
			  $scope.simpanTGLMasuk = function () {
				 var item = {
							depid : $scope.dataPasienSelected.deptid,
							noreg : $scope.dataPasienSelected.noregistrasi,
							tanggal : moment($scope.popUpTm.tanggal).format('YYYY-MM-DD HH:mm:ss')
						}
				  medifirstService.post('tatarekening/update-tanggal-masuk', item).then(function (e) {
					loadData();
							$scope.popUpTglMasuk.close()
						})
			  }

			  $scope.tombolSemua = async function () {
					// $scope.new_claim3()
					// $scope.setdataklaim()
					// $scope.grouping2()
					// $scope.claim_final2(
					// $scope.send_claim_individual2()
					// try {
					// 	await $scope.new_claim3();
					// 	await $scope.setdataklaim();
					// 	await $scope.grouping2();
					// 	await $scope.claim_final2();
					// 	await $scope.send_claim_individual2();
					// } catch (error) {
					// 	
					// 	console.error(error);
					// }

					$scope.isRouteLoading = true;
				var dt1 = {}
				var dt2 = []
					if($scope.itemPopUp.statusklaim== '-'){


					// if (dataSave[i].nomor_sep == $scope.itemPopUp.nosep) {
						dt1 = {
							"metadata": {
								"method": "new_claim"
							},
							"data": {
								"nomor_kartu": $scope.itemPopUp.nomor_kartu,
								"nomor_sep": $scope.itemPopUp.nosep,
								"nomor_rm": $scope.itemPopUp.nocm,
								"nama_pasien": $scope.itemPopUp.namapasien,
								"tgl_lahir": $scope.itemPopUp.tgllahir,
								"gender": $scope.itemPopUp.objectjeniskelaminfk
							}
						}
						dt2.push(dt1)
					
					// }
				}

				var objData = {
					"data": dt2
				}
				
				await medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then( async function (e) {
					// LoadData();	
					// console.log(e)
					$scope.saveLogging('New Klaim', 'No SEP Pasien', $scope.itemPopUp.nomor_sep,
					'New Klaim ' + ' No Registrasi / No RM / No SEP : ' + $scope.itemPopUp.noregistrasi
					+ '/ ' +  $scope.itemPopUp.nocm + ' / '+ $scope.itemPopUp.nomor_sep +' Metadata : new_claim')
					let response = e.data.dataresponse
					let arrStatus =[]
					for (var i = 0; i < response.length; i++) {
						const element = response[i]
						if(element.datarequest.metadata.method == 'new_claim'
							 && element.dataresponse.metadata.code == 200  ){
							arrStatus.push(
								{
									nosep:element.datarequest.data.nomor_sep,
									statusklaim: element.datarequest.metadata.method 
								})
						}
					}
					if(arrStatus.length>0){

						for (var i = 0; i < data2.length; i++) {
							const elem = data2[i]
							for (var ii = 0; ii < arrStatus.length; ii++) {
								const elem2 = arrStatus[ii]
								if(elem.nosep == elem2.nosep){
									elem2.norec = elem.norec
								}
							}
						}

						await medifirstService.post('bridging/inacbg/save-status', {'data':arrStatus}).then(  async function (z) {
							$scope.isRouteLoading = false;
							if (z.data.status == 201) {
								for (var x = $scope.listStatus.length - 1; x >= 0; x--) {
									const elem =$scope.listStatus[x]
									if(elem.id == z.data.data ){
										$scope.itemPopUp.statusklaim = elem.name
									}
								}
							}
						})
						var dataSave = {
							'namapegawai': $scope.user.namaLengkap,
							'param': 'kirim',
							'norec': $scope.itemPopUp.norec
						}
						await medifirstService.post('bridging/inacbg/save-pegawai', dataSave).then(async function (e) {
						})
					}
					// LoadData();	
					
					
					$scope.isRouteLoading = false;
				},function(error){

					$scope.isRouteLoading = false;
				},function(error){
					$scope.isRouteLoading = false;
				})
				// })

				if ($scope.itemPopUp.totalbiayars != $scope.totaltarif_rs16) {
					toastr.warning("Data Tarif yang akan dikirim belum sesuai dengan total tarif rs !");
					return;
				}
				var dt1 = {}
				var dt2 = []
				var jenis_rawat = 1 //ranap
						if ($scope.itemPopUp.deptid != 16) {
							jenis_rawat = 2
						}
						var upgrade_class_ind = 0
						var upgrade_class_class = ''
						var add_payment_pct = 0

						if ($scope.itemPopUp.nokelasdijamin > $scope.itemPopUp.nokelasdaftar && $scope.itemPopUp.deptid == 16) {
							upgrade_class_ind = 1
							upgrade_class_class = $scope.itemPopUp.namakelasdaftar
							add_payment_pct = 0
						}
				var discharge_status = 0
						if ($scope.itemPopUp.objectstatuspulangfk == 1 || $scope.itemPopUp.objectstatuspulangfk == 6) {
							discharge_status = 1
						} else if ($scope.itemPopUp.objectstatuspulangfk == 4 || $scope.itemPopUp.objectstatuspulangfk == 5 || $scope.itemPopUp.objectstatuspulangfk == 10 ||
							$scope.itemPopUp.objectstatuspulangfk == 11) {
							discharge_status = 2
						} else if ($scope.itemPopUp.objectstatuspulangfk == 2 || $scope.itemPopUp.objectstatuspulangfk == 8 || $scope.itemPopUp.objectstatuspulangfk == 3) {
							discharge_status = 3
						} else if ($scope.itemPopUp.objectstatuspulangfk == 9) {
							discharge_status = 4
						} else {
							discharge_status = 5
						}
						if (jenis_rawat == 2) {
							$scope.itemPopUp.nokelasdijamin = ''
						}
						var payor_id = '3'
						var payor_cd = 'JKN'
						if ($scope.itemPopUp.idrekanan == '2552') {
							payor_id = '3'
							payor_cd = 'JKN'
						} else if ($scope.itemPopUp.idrekanan == '581164') {
							payor_id = '5'
							payor_cd = 'JAMKESDA'
							$scope.itemPopUp.nosep = $scope.itemPopUp.nokepesertaan
						}
				// manageTataRekening.savebridginginacbg(objData).then(function(e){
			
						if($scope.itemPopUp.nosep != '-'){
						dt1 = {
							"metadata": {
								"method": "set_claim_data",
								"nomor_sep": $scope.itemPopUp.nomor_sep
							},
							"data": {
								"nomor_sep": $scope.itemPopUp.nomor_sep,    //"0901R001TEST0001",    
								"nomor_kartu": $scope.itemPopUp.nomor_kartu,    //"233333",    
								"tgl_masuk": $scope.itemPopUp.tgl_masuk,    //"2017-11-20 12:55:00",    
								"tgl_pulang": $scope.itemPopUp.tgl_pulang,    //"2017-12-01 09:55:00",    
								"cara_masuk": $scope.itemPopUp.cara_masuk.id,   
								"jenis_rawat": $scope.itemPopUp.jenis_rawat,    //"1",    
								"kelas_rawat": $scope.itemPopUp.kelas_rawat == null || $scope.itemPopUp.kelas_rawat == '' ? $scope.itemPopUp.nokelasdijamin : $scope.itemPopUp.kelas_rawat ,    //"1",    
								"adl_sub_acute": $scope.itemPopUp.adl_sub_acute,    //"15",    
								"adl_chronic": $scope.itemPopUp.adl_chronic,    //"12",    
								"icu_indikator": $scope.itemPopUp.icu_indikator,    //"1",    
								"icu_los": $scope.itemPopUp.los,    //"2",    
								"ventilator_hour": $scope.itemPopUp.ventilator_hour ,    //"5",    
								"ventilator": {
									"use_ind": $scope.itemPopUp.use_ind,
									"start_dttm": moment($scope.itemPopUp.start_dttm).format('YYYY-MM-DD HH:mm:ss'),
									"stop_dttm":moment( $scope.itemPopUp.stop_dttm).format('YYYY-MM-DD HH:mm:ss'),
								},
								"upgrade_class_ind": $scope.itemPopUp.upgrade_class_ind,    //"1",    
								"upgrade_class_class": $scope.itemPopUp.upgrade_class_class,    //"vip",    
								"upgrade_class_los": $scope.itemPopUp.upgrade_class_los,    //"5",    
								"upgrade_class_payor": $scope.itemPopUp.upgrade_class_payor,
								"add_payment_pct": "75",//$scope.itemPopUp.add_payment_pct ,    //"35",    
								"birth_weight": $scope.itemPopUp.birth_weight == null? "0": $scope.itemPopUp.birth_weight ,//$scope.itemPopUp.beratbadan,//$scope.itemPopUp.birth_weight ,    //"0",    
								"sistole": $scope.itemPopUp.sistole,
								"diastole": $scope.itemPopUp.diastole, 
								"discharge_status": $scope.itemPopUp.discharge_status.id,    //"1",    
								"diagnosa": $scope.itemPopUp.icd10 == null ? '#' : $scope.itemPopUp.icd10,    //"S71.0#A00.1",    
								"procedure": $scope.itemPopUp.icd9 == null ? '#' : $scope.itemPopUp.icd9,    //"81.52#88.38",    
								"diagnosa_inagrouper": $scope.itemPopUp.diagnosa_inagrouper == null ? '#' : $scope.itemPopUp.diagnosa_inagrouper,
								"procedure_inagrouper": $scope.itemPopUp.procedure_inagrouper == null ? '#' : $scope.itemPopUp.procedure_inagrouper,
								"tarif_rs": {
									"prosedur_non_bedah": $scope.tarif_rs16.prosedur_non_bedah,    //"300000",      
									"prosedur_bedah": $scope.tarif_rs16.prosedur_bedah,    //"20000000",      
									"konsultasi": $scope.tarif_rs16.konsultasi,    //"300000",      
									"tenaga_ahli": $scope.tarif_rs16.tenaga_ahli,    //"200000",      
									"keperawatan": $scope.tarif_rs16.keperawatan,    // "80000",      
									"penunjang": $scope.tarif_rs16.penunjang,    //"1000000",      
									"radiologi": $scope.tarif_rs16.radiologi,    //"500000",      
									"laboratorium": $scope.tarif_rs16.laboratorium,    //"600000",      
									"pelayanan_darah": $scope.tarif_rs16.pelayanan_darah,    //"150000",      
									"rehabilitasi": $scope.tarif_rs16.rehabilitasi,    //"100000",      
									"kamar": $scope.tarif_rs16.kamar,    //"6000000",      
									"rawat_intensif": $scope.tarif_rs16.rawat_intensif,    //"2500000",      
									"obat": $scope.tarif_rs16.obat,    //"2000000",  
									"obat_kronis": $scope.tarif_rs16.obat_kronis,
									"obat_kemoterapi": $scope.tarif_rs16.obat_kemoterapi,
									"alkes": $scope.tarif_rs16.alkes,    //"500000",      
									"bmhp": $scope.tarif_rs16.bmhp,    //"400000",      
									"sewa_alat": $scope.tarif_rs16.sewa_alat,    //"210000"    
								},
								"pemulasaraan_jenazah": $scope.itemPopUp.pemulasaraan_jenazah,
								"kantong_jenazah": $scope.itemPopUp.kantong_jenazah,
								"peti_jenazah": $scope.itemPopUp.peti_jenazah,
								"plastik_erat": $scope.itemPopUp.plastik_erat,
								"desinfektan_jenazah": $scope.itemPopUp.desinfektan_jenazah,
								"mobil_jenazah":  $scope.itemPopUp.mobil_jenazah,
								"desinfektan_mobil_jenazah":  $scope.itemPopUp.desinfektan_mobil_jenazah,
								"covid19_status_cd": $scope.itemPopUp.covid19_status_cd,
								"nomor_kartu_t": $scope.itemPopUp.nomor_kartu_t,
								"episodes": $scope.itemPopUp.episodes,
								"covid19_cc_ind": $scope.itemPopUp.covid19_cc_ind,
								"covid19_rs_darurat_ind": $scope.itemPopUp.covid19_rs_darurat_ind,
								"covid19_co_insidense_ind": $scope.itemPopUp.covid19_co_insidense_ind,
								"covid19_penunjang_pengurang": {
									"lab_asam_laktat":$scope.itemPopUp.lab_asam_laktat,// $scope.itemPopUp.covid19_penunjang_pengurang.lab_asam_laktat,
									"lab_procalcitonin":$scope.itemPopUp.lab_procalcitonin,// $scope.dataPasienSelected.covid19_penunjang_pengurang.lab_procalcitonin,
									"lab_crp": $scope.itemPopUp.lab_crp,//$scope.dataPasienSelected.covid19_penunjang_pengurang.lab_crp,
									"lab_kultur": $scope.itemPopUp.lab_kultur,//$scope.dataPasienSelected.covid19_penunjang_pengurang.lab_kultur,
									"lab_d_dimer":$scope.itemPopUp.lab_d_dimer,// $scope.dataPasienSelected.covid19_penunjang_pengurang.lab_d_dimer,
									"lab_pt": $scope.itemPopUp.lab_pt,//$scope.dataPasienSelected.covid19_penunjang_pengurang.lab_pt,
									"lab_aptt": $scope.itemPopUp.lab_aptt,//$scope.dataPasienSelected.covid19_penunjang_pengurang.lab_aptt,
									"lab_waktu_pendarahan": $scope.itemPopUp.lab_waktu_pendarahan,//$scope.dataPasienSelected.covid19_penunjang_pengurang.lab_waktu_pendarahan,
									"lab_anti_hiv":$scope.itemPopUp.lab_anti_hiv,// $scope.dataPasienSelected.covid19_penunjang_pengurang.lab_anti_hiv,
									"lab_analisa_gas": $scope.itemPopUp.lab_analisa_gas,//$scope.dataPasienSelected.covid19_penunjang_pengurang.lab_analisa_gas,
									"lab_albumin": $scope.itemPopUp.lab_albumin,//$scope.dataPasienSelected.covid19_penunjang_pengurang.lab_albumin,
									"rad_thorax_ap_pa":$scope.itemPopUp.rad_thorax_ap_pa,// $scope.dataPasienSelected.covid19_penunjang_pengurang.rad_thorax_ap_pa
								},
								"terapi_konvalesen": $scope.itemPopUp.terapi_konvalesen,
								"akses_naat": $scope.itemPopUp.akses_naat,
								"isoman_ind": $scope.itemPopUp.isoman_ind,
								"bayi_lahir_status_cd": $scope.itemPopUp.bayi_lahir_status_cd,
								"dializer_single_use": $scope.itemPopUp.dializer_use,
								"kantong_darah": $scope.itemPopUp.kantong_darah,
								"apgar": {
									"menit_1": {
										"appearance":$scope.itemPopUp.apgar1mappear,//  $scope.dataPasienSelected.apgar.menit_1.appearance,
										"pulse": $scope.itemPopUp.apgar1mpulse,// $scope.dataPasienSelected.apgar.menit_1.pulse,
										"grimace":$scope.itemPopUp.apgar1mgrimace,// $scope.dataPasienSelected.apgar.menit_1.grimace,
										"activity": $scope.itemPopUp.apgar1mactivity,// $scope.dataPasienSelected.apgar.menit_1.activity,
										"respiration":$scope.itemPopUp.apgar1mresp,// $scope.dataPasienSelected.apgar.menit_1.respiration
									},
									"menit_5": {
										"appearance":$scope.itemPopUp.apgar5mappear,//  $scope.dataPasienSelected.apgar.menit_5.appearance,
										"pulse": $scope.itemPopUp.apgar5mpulse,// $scope.dataPasienSelected.apgar.menit_5.pulse,
										"grimace":$scope.itemPopUp.apgar5mgrimace,// $scope.dataPasienSelected.apgar.menit_5.grimace,
										"activity": $scope.itemPopUp.apgar5mactivity,// $scope.dataPasienSelected.apgar.menit_5.activity,
										"respiration":$scope.itemPopUp.apgar5mresp,// $scope.dataPasienSelected.apgar.menit_5.respiration
									}
								},
								"persalinan": {
									"usia_kehamilan":$scope.itemPopUp.usia_kehamilan,//  $scope.dataPasienSelected.persalinan.usia_kehamilan,
									"gravida": $scope.itemPopUp.gravida,// $scope.dataPasienSelected.persalinan.gravida,
									"partus": $scope.itemPopUp.partus,// $scope.dataPasienSelected.persalinan.partus,
									"abortus": $scope.itemPopUp.abortus,// $scope.dataPasienSelected.persalinan.abortus,
									"onset_kontraksi": $scope.itemPopUp.onset_kontraksi ==  undefined ? '': $scope.itemPopUp.onset_kontraksi.id,// $scope.dataPasienSelected.persalinan.onset_kontraksi,
									"delivery": [
										{
											"delivery_sequence": $scope.itemPopUp.delivery_sequence,// $scope.dataPasienSelected.persalinan.delivery.delivery_sequence,
											"delivery_method": $scope.itemPopUp.delivery_method,// $scope.dataPasienSelected.persalinan.delivery.delivery_method,
											"delivery_dttm": $scope.itemPopUp.delivery_dtm,//  $scope.dataPasienSelected.persalinan.delivery.delivery_dttm,
											"letak_janin": $scope.itemPopUp.letak_janin,//  $scope.dataPasienSelected.persalinan.delivery.letak_janin,
											"kondisi": $scope.itemPopUp.kondisi,// $scope.dataPasienSelected.persalinan.delivery.kondisi,
											"use_manual":$scope.itemPopUp.use_manual,//  $scope.dataPasienSelected.persalinan.delivery.use_manual,
											"use_forcep":$scope.itemPopUp.use_forcep,//  $scope.dataPasienSelected.persalinan.delivery.use_forcep,
											"use_vacuum": $scope.itemPopUp.use_vacuum,// $scope.dataPasienSelected.persalinan.delivery.use_vacuum
											"shk_spesimen_ambil": 0,// 
											"shk_lokasi": 0,// 
											"shk_spesimen_dttm": '2023-12-27 00:00:00'
										},
										// {
										// 	"delivery_sequence": "2",  // parameter baru jika lahir lebih dari satu bayi
										// 	"delivery_method": "vaginal", // parameter baru jika lahir lebih dari satu bayi
										// 	"delivery_dttm": "2023-01-21 17:03:49", // parameter baru jika lahir lebih dari satu bayi
										// 	"letak_janin": "lintang", // parameter baru jika lahir lebih dari satu bayi
										// 	"kondisi": "livebirth", // parameter baru jika lahir lebih dari satu bayi
										// 	"use_manual": "1", // parameter baru jika lahir lebih dari satu bayi
										// 	"use_forcep": "0", // parameter baru jika lahir lebih dari satu bayi
										// 	"use_vacuum": "0" // parameter baru jika lahir lebih dari satu bayi
										// }
									]
								},
								"tarif_poli_eks": 0,//$scope.dataPasienSelected.tarif_poli_eks,    //"100000",    
								"nama_dokter": $scope.itemPopUp.dpjp.namalengkap,    //"RUDY, DR",    
								"kode_tarif": $scope.itemPopUp.kode_tarif,    //"AP",    
								"payor_id": payor_id,    //"3",    
								"payor_cd": payor_cd,    //"JKN",    
								"cob_cd":'#',// $scope.dataPasienSelected.cob_cd,    //"0001",    
								"coder_nik": $scope.itemPopUp.codernik    //"123123123123"  
							}
							// "data": {
							// 	"nomor_sep": dataSave[i].nomor_sep,    //"0901R001TEST0001",    
							// 	"nomor_kartu": dataSave[i].nomor_kartu,    //"233333",    
							// 	"tgl_masuk": dataSave[i].tgl_masuk,    //"2017-11-20 12:55:00",    
							// 	"tgl_pulang": dataSave[i].tgl_pulang,    //"2017-12-01 09:55:00",    
							// 	"jenis_rawat": dataSave[i].jenis_rawat,    //"1",    
							// 	"kelas_rawat": dataSave[i].kelas_rawat,    //"1",    
							// 	"adl_sub_acute": dataSave[i].adl_sub_acute,    //"15",    
							// 	"adl_chronic": dataSave[i].adl_chronic,    //"12",    
							// 	"icu_indikator": dataSave[i].icu_indikator,    //"1",    
							// 	"icu_los": dataSave[i].icu_los,    //"2",    
							// 	"ventilator_hour": dataSave[i].ventilator_hour,    //"5",    
							// 	"upgrade_class_ind": dataSave[i].upgrade_class_ind,    //"1",    
							// 	"upgrade_class_class": dataSave[i].upgrade_class_class,    //"vip",    
							// 	"upgrade_class_los": dataSave[i].upgrade_class_los,    //"5",    
							// 	"add_payment_pct": "75",//dataSave[i].add_payment_pct ,    //"35",    
							// 	"birth_weight": dataSave[i].beratbadan == null? "0": dataSave[i].beratbadan ,//$scope.dataPasienSelected.beratbadan,//dataSave[i].birth_weight ,    //"0",    
							// 	"discharge_status": dataSave[i].discharge_status,    //"1",    
							// 	"diagnosa": dataSave[i].diagnosa,    //"S71.0#A00.1",    
							// 	"procedure": dataSave[i].procedure,    //"81.52#88.38",    
							// 	"tarif_rs": {
							// 		"prosedur_non_bedah": dataSave[i].tarif_rs.prosedur_non_bedah,    //"300000",      
							// 		"prosedur_bedah": dataSave[i].tarif_rs.prosedur_bedah,    //"20000000",      
							// 		"konsultasi": dataSave[i].tarif_rs.konsultasi,    //"300000",      
							// 		"tenaga_ahli": dataSave[i].tarif_rs.tenaga_ahli,    //"200000",      
							// 		"keperawatan": dataSave[i].tarif_rs.keperawatan,    // "80000",      
							// 		"penunjang": dataSave[i].tarif_rs.penunjang,    //"1000000",      
							// 		"radiologi": dataSave[i].tarif_rs.radiologi,    //"500000",      
							// 		"laboratorium": dataSave[i].tarif_rs.laboratorium,    //"600000",      
							// 		"pelayanan_darah": dataSave[i].tarif_rs.pelayanan_darah,    //"150000",      
							// 		"rehabilitasi": dataSave[i].tarif_rs.rehabilitasi,    //"100000",      
							// 		"kamar": dataSave[i].tarif_rs.kamar,    //"6000000",      
							// 		"rawat_intensif": dataSave[i].tarif_rs.rawat_intensif,    //"2500000",      
							// 		"obat": dataSave[i].tarif_rs.obat,    //"2000000",  
							// 		"obat_kronis": dataSave[i].tarif_rs.obat_kronis,
							// 		"obat_kemoterapi": dataSave[i].tarif_rs.obat_kemoterapi,
							// 		"alkes": dataSave[i].tarif_rs.alkes,    //"500000",      
							// 		"bmhp": dataSave[i].tarif_rs.bmhp,    //"400000",      
							// 		"sewa_alat": dataSave[i].tarif_rs.sewa_alat,    //"210000"    
							// 	},
							// 	"tarif_poli_eks": dataSave[i].tarif_poli_eks,    //"100000",    
							// 	"nama_dokter": dataSave[i].nama_dokter,    //"RUDY, DR",    
							// 	"kode_tarif": dataSave[i].kode_tarif,    //"AP",    
							// 	"payor_id": dataSave[i].payor_id,    //"3",    
							// 	"payor_cd": dataSave[i].payor_cd,    //"JKN",    
							// 	"cob_cd": dataSave[i].cob_cd,    //"0001",    
							// 	"coder_nik": dataSave[i].coder_nik    //"123123123123"  
							// }
						}
						dt2.push(dt1)
						// debugger
					// }
					}
				

				var objData = {
					"data": dt2
				}
				// debugger
				await medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(async function (e) {
					// LoadData();	
					// console.log(e)
					// save logging simpan klaim
					$scope.saveLogging('Simpan Klaim', 'No SEP Pasien', e.data.dataresponse[0].datarequest.metadata.nomor_sep,
					'Simpan Klaim ' + ' No Registrasi / No RM / No SEP : ' + $scope.itemPopUp.noregistrasi
					+ '/ ' +  $scope.itemPopUp.nocm+ ' / '+  e.data.dataresponse[0].datarequest.metadata.nomor_sep +' Metadata : ' +  e.data.dataresponse[0].datarequest.metadata.method)
					let response = e.data.dataresponse
					let arrStatus =[]
					for (var i = 0; i < response.length; i++) {
						const element = response[i]
						if(element.datarequest.metadata.method == 'new_claim'
							 && element.dataresponse.metadata.code == 200  ){
							arrStatus.push(
								{
									nosep:element.datarequest.data.nomor_sep,
									statusklaim: element.datarequest.metadata.method 
								})
						}
					}
					if(arrStatus.length>0){

						for (var i = 0; i < data2.length; i++) {
							const elem = data2[i]
							for (var ii = 0; ii < arrStatus.length; ii++) {
								const elem2 = arrStatus[ii]
								if(elem.nosep == elem2.nosep){
									elem2.norec = elem.norec
								}
							}
						}

						await medifirstService.post('bridging/inacbg/save-status', {'data':arrStatus}).then(async function (z) {
							$scope.isRouteLoading = false;
							if (z.data.status == 201) {
								for (var x = $scope.listStatus.length - 1; x >= 0; x--) {
									const elem =$scope.listStatus[x]
									if(elem.id == z.data.data ){
										$scope.itemPopUp.statusklaim = elem.name
									}
								}
							}
						})
						
					}
					var dataSave = {
						'namapegawai': $scope.user.namaLengkap,
						'param': 'simpan',
						'norec': $scope.itemPopUp.norec,
						'dializer_use' : $scope.itemPopUp.dializer_use != undefined ? $scope.itemPopUp.dializer_use : null
					}
					await medifirstService.post('bridging/inacbg/save-pegawai', dataSave).then(async function (e) {
					})
					// LoadData();	
					
					
					$scope.isRouteLoading = false;
				},function(error){

					$scope.isRouteLoading = false;
				},function(error){
					$scope.isRouteLoading = false;
				})

				if ($scope.itemPopUp.status == 'unverifikasi') {
					toastr.info('Status Bilingan belum di Verifikasi!!!')
					return;
				}
				// var stt = 'false'
				// var covid19_status_cd = ''
				// var covid19_cc_ind = '0'
				// var covid19_rs_darurat_ind = '0'
				// var covid19_co_insidense_ind = '0'
				$scope.item.faktorpengurang = []
				if ($scope.itemPopUp.statuscovid === true) {
					if ($scope.itemPopUp.noidentitas == "") {
						toastr.info('NO IDENTITAS KOSONG!!!')
						return;
					}
					$scope.item.comorbid = "0"
					$scope.item.naat = "C"
					$scope.item.isman = "0"
					$scope.item.rsdarurat = "0"
					$scope.item.coinsiden = "0"
					
					$scope.popupPasienCovid.center().open();
					// if(confirm('Probabel Covid-19 ? ')) {
					// 	// Save it!
					// 	stt = 'true';
					// 	covid19_status_cd = 5
					// } else {
					// 	// Do nothing!
					// 	stt = 'false'
					// 	if(confirm('Suspek Covid-19 ? ')) {
					// 		// Save it!
					// 		stt = 'true';
					// 		covid19_status_cd = 4
					// 	} else {
					// 		// Do nothing!
					// 		stt = 'false'
					// 		if (confirm('Positif Covid-19 ? ')) {
					// 			// Save it!
					// 			stt = 'true';
					// 			covid19_status_cd = 3
					// 		} else {
					// 			// Do nothing!
					// 			stt = 'false'
					// 			if (confirm('PDP Covid-19 ? ')) {
					// 				// Save it!
					// 				stt = 'true';
					// 				covid19_status_cd = 2
					// 			} else {
					// 				// Do nothing!
					// 				stt = 'false'
					// 				if (confirm('ODP Covid-19 ? ')) {
					// 					// Save it!
					// 					stt = 'true';
					// 					covid19_status_cd = 1
					// 				} else {
					// 					// Do nothing!
					// 					stt = 'false'
					// 				}
					// 			}
					// 		}
					// 	}
					// }
					
					// if (covid19_status_cd == 0) {
					// 	toastr.error('JENIS PASIEN COVID BELUM DITENTUKAN', 'COVID-19');
					// 	return;
					// }

					// if (confirm('comorbidity/complexity ? ')) {
					// 	stt = 'true';
					// 	covid19_cc_ind = '1'
					// } else {
					// 	stt = 'false';
					// }

				} else {
					$scope.isRouteLoading = true;
					$scope.grupingtab = true
					if ($scope.itemPopUp.deptid != 16) {
						var dt1 = {}
						var dt2 = []
						
	
						var objData = {
							"data": dt2
						}
					await medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(async function (e) {
						$scope.isRouteLoading = false;
							
						var dt1 = {}
							var dt2 = []
							
							// for (var i = dataSave.length - 1; i >= 0; i--) {
							dt1 = {
								"metadata": {
									"method": "grouper",
									"stage": "1"
								},
								"data": {
									// "nomor_sep": dataSave[i].nomor_sep 
									"nomor_sep": $scope.itemPopUp.nomor_sep
								}
							}
							dt2.push(dt1)
							// }
	
	
							var objData = {
								"data": dt2
							}
							var totaldijamin = "";
							var hakkelas = "";
							var biayanaikkelas = "0";
						await	medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(async function (e) {
							$scope.isRouteLoading = false;
								
							// simpan response ke database
								// savelogging
								$scope.saveLogging('Grouping Klaim', 'No SEP Pasien', e.data.dataresponse[0].datarequest.data.nomor_sep,
								'Grouping Klaim ' + ' No Registrasi / No RM / No SEP : ' + $scope.itemPopUp.noregistrasi
									+ '/ ' +  $scope.itemPopUp.nocm + ' / '+  e.data.dataresponse[0].datarequest.data.nomor_sep +' Metadata : ' +  e.data.dataresponse[0].datarequest.metadata.method)
	
								responData = e.data.dataresponse;
								toastr.info(responData[0].dataresponse.metadata.message, 'INACBG');
								toastr.info(responData[0].dataresponse.response.cbg.description, 'INACBG');
								
								$scope.itemgrop= responData[0].dataresponse	
								// loadData()
								// var responOptions = responData[0].dataresponse.special_cmg_option
								// 		var spesialDrug = []
								// 		var specialProcedure = []
								// 		var specialProsthesis = []
								// 		var specialInvestigation = []
								// 		for (let i = 0; i < responOptions.length; i++) {
								// 			const element = responOptions[i];
								// 			if (element.type == 'Special Drug') {
								// 				spesialDrug.push(element)
								// 			}
								// 			if (element.type == 'Special Procedure') {
								// 				specialProcedure.push(element)
								// 			}
								// 			if (element.type == 'Special Prosthesis') {
								// 				specialProsthesis.push(element)
								// 			}
								// 			if (element.type == 'Special Investigation') {
								// 				specialInvestigation.push(element)
								// 			}
								// 		}
								// 		$scope.listspecialdrug = spesialDrug
								// 		$scope.listspecialprocedure = specialProcedure
								// 		$scope.listspecialprosthesis = specialProsthesis
								// 		$scope.listspecialinvestigation = specialInvestigation
										
	
										// dd($scope.itemgrop);
								//save status
	
	
								let response = e.data.dataresponse
								let arrStatus =[]
								for (var i = 0; i < response.length; i++) {
									const element = response[i]
									if(element.datarequest.metadata.method == 'grouper'
										 && element.dataresponse.metadata.code == 200  ){
										arrStatus.push(
											{
												nosep:element.datarequest.data.nomor_sep,
												statusklaim: element.datarequest.metadata.method 
											})
									}
								}
								if(arrStatus.length>0){
	
									for (var i = 0; i < data2.length; i++) {
										const elem = data2[i]
										for (var ii = 0; ii < arrStatus.length; ii++) {
											const elem2 = arrStatus[ii]
											if(elem.nosep == elem2.nosep){
												elem2.norec = elem.norec
											}
										}
									}
	
								await	medifirstService.post('bridging/inacbg/save-status', {'data':arrStatus}).then(async function (z) {
									$scope.isRouteLoading = false;
									if (z.data.status == 201) {
										for (var x = $scope.listStatus.length - 1; x >= 0; x--) {
											const elem =$scope.listStatus[x]
											if(elem.id == z.data.data ){
												$scope.itemPopUp.statusklaim = elem.name
											}
										}
									}
									})
									var dataSave = {
										'namapegawai': $scope.user.namaLengkap,
										'param': 'grouper',
										'norec': $scope.itemPopUp.norec
									}
								await	medifirstService.post('bridging/inacbg/save-pegawai', dataSave).then(async function (e) {
									})
								}
								//end status
								
								if (responData[0].dataresponse.response.cbg.description == "ERROR: MALE WITH GROUPING CRITERIA NOT MET") {
									toastr.info('JENIS KELAMIN SALAH ATAU DIAGNOSA TIDAK SESUAI JENIS KELAMIN', 'INACBG');
								}
								// if(dataSave[0].jenis_rawat==2){
								if ($scope.itemPopUp.deptid != 16) {
									totaldijamin = responData[0].dataresponse.response.cbg.tariff
								} else {
									hakkelas = responData[0].dataresponse.response.kelas
									if (hakkelas == "kelas_1") {
										totaldijamin = responData[0].dataresponse.tarif_alt[0].tarif_inacbg
									} else if (hakkelas == "kelas_2") {
										totaldijamin = responData[0].dataresponse.tarif_alt[1].tarif_inacbg
									} else if (hakkelas == "kelas_3") {
										totaldijamin = responData[0].dataresponse.tarif_alt[2].tarif_inacbg
									}
									if ($scope.itemPopUp.namakelas != $scope.itemPopUp.namakelasdaftar) {
										biayanaikkelas = responData[0].dataresponse.response.add_payment_amt
										if (biayanaikkelas < 0) {
											biayanaikkelas = 0
										}
									}
								}
								
								var dataproposi = {
									"noregistrasifk": $scope.itemPopUp.norec,
									"totalDijamin": totaldijamin,
									"biayaNaikkelas": biayanaikkelas,
									"response": responData[0].dataresponse,
								}
								await medifirstService.post('bridging/inacbg/save-proposi-bridging-inacbg', dataproposi).then(async function (e) {
									//ini untuk proposional kan utang per tindakan
									$scope.isRouteLoading = false;

								})
								// loadData()
								if (responData[0].dataresponse.hasOwnProperty("special_cmg_option") == true && responData[0].dataresponse.special_cmg_option.length > 0) {
									toastr.info('Terdeteksi Top-up CMG Options')
									dataSEPCMG = responData[0].datarequest.data.nomor_sep
									var responOptions = responData[0].dataresponse.special_cmg_option
									var spesialDrug = []
									var specialProcedure = []
									var specialProsthesis = []
									var specialInvestigation = []
									for (let i = 0; i < responOptions.length; i++) {
										const element = responOptions[i];
										if (element.type == 'Special Drug') {
											spesialDrug.push(element)
										}
										if (element.type == 'Special Procedure') {
											specialProcedure.push(element)
										}
										if (element.type == 'Special Prosthesis') {
											specialProsthesis.push(element)
										}
										if (element.type == 'Special Investigation') {
											specialInvestigation.push(element)
										}
									}
									$scope.listspecialdrug = spesialDrug
									$scope.listspecialprocedure = specialProcedure
									$scope.listspecialprosthesis = specialProsthesis
									$scope.listspecialinvestigation = specialInvestigation
									$scope.itemgrop= responData[0].dataresponse
								}
							})
	
						})
					} else {
						var	datass =[{ noreg:  $scope.itemPopUp.norec,
									   namakelas:  $scope.itemPopUp.namakelas, 
									   nosep:  $scope.itemPopUp.nosep,
									   deptid:  $scope.itemPopUp.deptid }]
						await medifirstService.postNonMessage('bridging/inacbg/get-daftar-pasien-statusnaikkelas?noreg=' + $scope.itemPopUp.norec
						
							+ '&namakelas=' + $scope.itemPopUp.namakelas,{'data':datass}).then(async function (e) {
								$scope.isRouteLoading = false;
								
								var resp = e.data[0];
								var dt1 = {}
								var dt2 = []
	
								var objData = {
									"data": dt2
								}
								await medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(async function (e) {
									$scope.isRouteLoading = false;

									var dt1 = {}
									var dt2 = []
									
									// for (var i = dataSave.length - 1; i >= 0; i--) {
									dt1 = {
										"metadata": {
											"method": "grouper",
											"stage": "1"
										},
										"data": {
											// "nomor_sep": dataSave[i].nomor_sep 
											"nomor_sep": $scope.itemPopUp.nosep
										}
									}
									dt2.push(dt1)
									// }
	
	
									var objData = {
										"data": dt2
									}
									var totaldijamin = "";
									var hakkelas = "";
									var biayanaikkelas = "0";
									var top_up_jenazah = "";
								await	medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(async function (e) {
										// simpan response ke database
									$scope.isRouteLoading = false;

										$scope.saveLogging('Grouping Klaim', 'No SEP Pasien', e.data.dataresponse[0].datarequest.data.nomor_sep,
									'Grouping Klaim ' + ' No Registrasi / No RM / No SEP : ' + $scope.itemPopUp.noregistrasi
									+ '/ ' +  $scope.itemPopUp.nocm + ' / '+  e.data.dataresponse[0].datarequest.data.nomor_sep +' Metadata : ' +  e.data.dataresponse[0].datarequest.metadata.method)
										responData = e.data.dataresponse;
										toastr.info(responData[0].dataresponse.metadata.message, 'INACBG');
										toastr.info(responData[0].dataresponse.response.cbg.description, 'INACBG');
										$scope.itemgrop= responData[0].dataresponse	
										if (responData[0].dataresponse.hasOwnProperty("special_cmg_option") == true && responData[0].dataresponse.special_cmg_option.length > 0) {
										var responOptions = responData[0].dataresponse.special_cmg_option
										var spesialDrug = []
										var specialProcedure = []
										var specialProsthesis = []
										var specialInvestigation = []
										for (let i = 0; i < responOptions.length; i++) {
											const element = responOptions[i];
											if (element.type == 'Special Drug') {
												spesialDrug.push(element)
											}
											if (element.type == 'Special Procedure') {
												specialProcedure.push(element)
											}
											if (element.type == 'Special Prosthesis') {
												specialProsthesis.push(element)
											}
											if (element.type == 'Special Investigation') {
												specialInvestigation.push(element)
											}
										}
										$scope.listspecialdrug = spesialDrug
										$scope.listspecialprocedure = specialProcedure
										$scope.listspecialprosthesis = specialProsthesis
										$scope.listspecialinvestigation = specialInvestigation
										$scope.itemgrop= responData[0].dataresponse
										}
										// dd($scope.itemgrop);
										if (responData[0].dataresponse.response.cbg.description == "ERROR: MALE WITH GROUPING CRITERIA NOT MET") {
											toastr.info('JENIS KELAMIN SALAH ATAU DIAGNOSA TIDAK SESUAI JENIS KELAMIN', 'INACBG');
										}
	
										//save status
										let response = e.data.dataresponse
										let arrStatus =[]
										for (var i = 0; i < response.length; i++) {
											const element = response[i]
											if(element.datarequest.metadata.method == 'grouper'
												&& element.dataresponse.metadata.code == 200  ){
												arrStatus.push(
													{
														nosep:element.datarequest.data.nomor_sep,
														statusklaim: element.datarequest.metadata.method 
													})
											}
										}
										if(arrStatus.length>0){
	
											for (var i = 0; i < data2.length; i++) {
												const elem = data2[i]
												for (var ii = 0; ii < arrStatus.length; ii++) {
													const elem2 = arrStatus[ii]
													if(elem.nosep == elem2.nosep){
														elem2.norec = elem.norec
													}
												}
											}
	
										await	medifirstService.post('bridging/inacbg/save-status', {'data':arrStatus}).then(async function (z) {
											$scope.isRouteLoading = false;
											if (z.data.status == 201) {
												for (var x = $scope.listStatus.length - 1; x >= 0; x--) {
													const elem =$scope.listStatus[x]
													if(elem.id == z.data.data ){
														$scope.itemPopUp.statusklaim = elem.name
													}
												}
											}

											})
											var dataSave = {
												'namapegawai': $scope.user.namaLengkap,
												'param': 'grouper',
												'norec': $scope.itemPopUp.norec
											}
										await	medifirstService.post('bridging/inacbg/save-pegawai', dataSave).then(async function (e) {
											})
										}
	
										// if(dataSave[0].jenis_rawat==2){
										if ($scope.itemPopUp.deptid =! 16) {
											totaldijamin = responData[0].dataresponse.tarif_alt[2].tarif_inacbg
										} else if ($scope.itemPopUp.statuscovid === true) {
											if (responData[0].dataresponse.response.covid19_data.top_up_jenazah != 0) {
												top_up_jenazah = "";
											}
											// totaldijamin = top_up_jenazah + responData[0].dataresponse.response.covid19_data.top_up_rawat + responData[0].dataresponse.response.covid19_data.top_up_rawat_factor + responData[0].dataresponse.response.covid19_data.top_up_rawat_gross
											totaldijamin = responData[0].dataresponse.response.covid19_data.nilai_klaim
										} else {
											hakkelas = responData[0].dataresponse.response.kelas
											if (hakkelas == "kelas_1") {
												totaldijamin = responData[0].dataresponse.tarif_alt[0].tarif_inacbg
											} else if (hakkelas == "kelas_2") {
												totaldijamin = responData[0].dataresponse.tarif_alt[1].tarif_inacbg
											} else if (hakkelas == "kelas_3") {
												totaldijamin = responData[0].dataresponse.tarif_alt[2].tarif_inacbg
											}
											// if($scope.itemPopUp.namakelas!=$scope.itemPopUp.namakelasdaftar){
											if (resp.statusnaikkelas != '0') {
												biayanaikkelas = responData[0].dataresponse.response.add_payment_amt
												if (biayanaikkelas < 0) {
													biayanaikkelas = 0
												}
											}
										}
										var dataproposi = {
											"noregistrasifk": $scope.itemPopUp.norec,
											"totalDijamin": totaldijamin,
											"biayaNaikkelas": biayanaikkelas,
											"response": responData[0].dataresponse,
										}
										await medifirstService.post('bridging/inacbg/save-proposi-bridging-inacbg', dataproposi).then(async function (e) {
											//ini untuk proposional kan utang per tindakan
										})
										// if (responData[0].dataresponse.hasOwnProperty("special_cmg_option") == true && responData[0].dataresponse.special_cmg_option.length > 0) {
										// 	toastr.info('Terdeteksi Top-up CMG Options')
										// 	dataSEPCMG = responData[0].datarequest.data.nomor_sep
										// 	var responOptions = responData[0].dataresponse.special_cmg_option
										// 	var spesialDrug = []
										// 	var specialProcedure = []
										// 	var specialProsthesis = []
										// 	var specialInvestigation = []
										// 	for (let i = 0; i < responOptions.length; i++) {
										// 		const element = responOptions[i];
										// 		if (element.type == 'Special Drug') {
										// 			spesialDrug.push(element)
										// 		}
										// 		if (element.type == 'Special Procedure') {
										// 			specialProcedure.push(element)
										// 		}
										// 		if (element.type == 'Special Prosthesis') {
										// 			specialProsthesis.push(element)
										// 		}
										// 		if (element.type == 'Special Investigation') {
										// 			specialInvestigation.push(element)
										// 		}
										// 	}
										// 	$scope.listspecialdrug = spesialDrug
										// 	$scope.listspecialprocedure = specialProcedure
										// 	$scope.listspecialprosthesis = specialProsthesis
										// 	$scope.listspecialinvestigation = specialInvestigation
										// }
									})
	
								})
	
							})
					}
				}

				// $scope.isRouteLoading= true;
				var dt1 = {}
				var dt2 = []
				// for (var i = dataSave.length - 1; i >= 0; i--) {
				dt1 = {
					"metadata": {
						"method": "claim_final"
					},
					"data": {
						"nomor_sep": $scope.itemPopUp.nomor_sep,//dataSave[i].nomor_sep,      
						"coder_nik": coderNIK,
					}
				}
				dt2.push(dt1)
				// }

				var objData = {
					"data": dt2
				}
				await medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(async function (e) {
					// response oke saja
					responData = e.data.dataresponse;
					let response = e.data.dataresponse
					// save logging
					$scope.saveLogging('Final Klaim', 'No SEP Pasien', e.data.dataresponse[0].datarequest.data.nomor_sep,
							'Final Klaim ' + ' No Registrasi / No RM / No SEP : ' + $scope.itemPopUp.noregistrasi
								+ '/ ' +  $scope.itemPopUp.nocm + ' / '+  e.data.dataresponse[0].datarequest.data.nomor_sep +' Metadata : ' +  e.data.dataresponse[0].datarequest.metadata.method)
					
					let arrStatus =[]
					for (var i = 0; i < response.length; i++) {
						const element = response[i]
						if(element.datarequest.metadata.method == 'claim_final'
							 && element.dataresponse.metadata.code == 200  ){
							arrStatus.push(
								{
									nosep:element.datarequest.data.nomor_sep,
									statusklaim: element.datarequest.metadata.method 
								})
						}
					}
					if(arrStatus.length>0){

						for (var i = 0; i < data2.length; i++) {
							const elem = data2[i]
							for (var ii = 0; ii < arrStatus.length; ii++) {
								const elem2 = arrStatus[ii]
								if(elem.nosep == elem2.nosep){
									elem2.norec = elem.norec
								}
							}
						}

					await	medifirstService.post('bridging/inacbg/save-status', {'data':arrStatus}).then(async function (z) {
						if (z.data.status == 201) {
							for (var x = $scope.listStatus.length - 1; x >= 0; x--) {
								const elem =$scope.listStatus[x]
								if(elem.id == z.data.data ){
									$scope.itemPopUp.statusklaim = elem.name
								}
							}
						}
						})
						var dataSave = {
							'namapegawai': $scope.user.namaLengkap,
							'param': 'final',
							'norec': $scope.itemPopUp.norec
						}
					await	medifirstService.postNonMessage('bridging/inacbg/save-pegawai', dataSave).then(async function (e) {
						})
					}
					// medifirstService.post("tatarekening/simpan-verifikasi-tagihan-inacbg/"+$scope.dataPasienSelected.noregistrasi ,$scope.dataPasienSelected)
					// 	.then(function (e) {
					// 		loadData();

					// 	});
					toastr.info(responData[0].dataresponse.metadata.message, 'INACBG');
				})


				var dt1 = {}
				var dt2 = []
				// for (var i = dataSave.length - 1; i >= 0; i--) {
				dt1 = {
					"metadata": {
						"method": "send_claim_individual"
					},
					"data": {
						"nomor_sep": $scope.itemPopUp.nomor_sep
					}
				}
				dt2.push(dt1)
				// }

				var objData = {
					"data": dt2
				}
				await medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(async function (e) {
					// responData = e.data.dataresponse;
					
					// save logging
					$scope.saveLogging('Kirim Online', 'No SEP Pasien', e.data.dataresponse[0].datarequest.data.nomor_sep,
					'Kirim Online ' + ' No Registrasi / No RM / No SEP : ' + $scope.itemPopUp.noregistrasi
					+ '/ ' +  $scope.itemPopUp.nocm + ' / '+  e.data.dataresponse[0].datarequest.data.nomor_sep +' Metadata : ' +  e.data.dataresponse[0].datarequest.metadata.method)
					// response simpan ke database	
					responData = e.data.dataresponse;
					var datasend = {
						"noregistrasifk": $scope.itemPopUp.norec
					}
					// if (responData[0].dataresponse.metadata.code == "200") {
					// 	manageTataRekening.updatestatusbridginginacbg(datasend).then(function (e) {
					// 		//ini untuk proposional kan utang per tindakan
					// 		loadData();
					// 	})
					// }
					toastr.info(responData[0].dataresponse.metadata.message, 'INACBG');

					let response = e.data.dataresponse
					let arrStatus =[]
					for (var i = 0; i < response.length; i++) {
						const element = response[i]
						if(element.datarequest.metadata.method == 'send_claim_individual'
							 && element.dataresponse.metadata.code == 200  ){
							arrStatus.push(
								{
									nosep:element.datarequest.data.nomor_sep,
									statusklaim: element.datarequest.metadata.method 
								})
						}
					}
					if(arrStatus.length>0){

						for (var i = 0; i < data2.length; i++) {
							const elem = data2[i]
							for (var ii = 0; ii < arrStatus.length; ii++) {
								const elem2 = arrStatus[ii]
								if(elem.nosep == elem2.nosep){
									elem2.norec = elem.norec
								}
							}
						}

						await medifirstService.post('bridging/inacbg/save-status', {'data':arrStatus}).then(async function (z) {
							loadData();	
							if (z.data.status == 201) {
								for (var x = $scope.listStatus.length - 1; x >= 0; x--) {
									const elem =$scope.listStatus[x]
									if(elem.id == z.data.data ){
										$scope.itemPopUp.statusklaim = elem.name
									}
								}
							}
						})

						var dataSave = {
							'namapegawai': $scope.user.namaLengkap,
							'param': 'kironline',
							'norec': $scope.itemPopUp.norec
						}
						await medifirstService.postNonMessage('bridging/inacbg/save-pegawai', dataSave).then(async function (e) {
						})
					}
				})
				
					
					
				
			  }

			  $scope.simpansemua = function () {
				var gridDokumen = $scope.dataDaftarDokumen._data
				var hasChecked = $scope.dataDaftarDokumen._data.some(function(item) {
					return item.statCheckbox === true;
				});
				
				if (hasChecked) {
					for (let i = 0; i < gridDokumen.length; i++) {
						const element = gridDokumen[i];
						if (element.statCheckbox == true) {
							$scope.isRouteLoading = true
							medifirstService.get(`bridging/inacbg/get-parameter?id=${element.id}&noregistrasi=${element.noregistrasi}&user=${$scope.user.namaLengkap}`).then(function (e) {
								$scope.isRouteLoading = false
								
								if (e.data.data.length == 0 && ![4,11,15].includes(element.id)) {
									toastr.info("Info", "Data tidak ditemukan");
										return
								} else {
									if ([4,11,15].includes(element.id)) {
										var a = {id:element.id, noregistrasi: element.noregistrasi, nosep:$scope.popUpDokumen.nosep,length:0}
										simpanDokumen2(a)
									} else {
										simpanDokumen2(e.data.data)
									}
								}
							})
						}
						
						
					}
				} else {
					toastr.warning('Harap ceklis setidaknya satu data!')
                    return;
				}
				

			  }

			  $scope.simpanCariFile = function (params) {
				var gridDokumen = $scope.dataCariDaftarDokumen._data
				var hasChecked = $scope.dataCariDaftarDokumen._data.some(function(item) {
					return item.statCheckbox === true;
				});
				
				if (hasChecked) {
					for (let i = 0; i < gridDokumen.length; i++) {
						const element = gridDokumen[i];
						if (element.statCheckbox == true) {
							// $scope.isRouteLoading = true
							simpanDokumen3(element)
						}
						
						
					}
				} else {
					toastr.warning('Harap ceklis setidaknya satu data!')
                    return;
				}
			  }
			  
			  function simpanDokumen3(e) {
                var dataItem = e;
                if(dataItem.param == "?q=q") {
                    toastr.info("Infor", "Data tidak ditemukan");
                    return
                }
				

						medifirstService.get(dataItem.url + dataItem.param + "&issimpanberkas=true&iddok=" + dataItem.id 
							+ "&isberkasnoreg=" + dataItem.noregistrasi 
							+ "&namafile=" + dataItem.namafile).then(function (data) {
							toastr.success( data.data.message);
							$scope.tutupdokumen()
							loadDataDokumen()
							$scope.isRouteLoading = false
						}).catch(error => {
							toastr.error("File gagal disimpan: " + error.message);
						});
				// $scope.tutupdokumen();
            }

			$scope.tutupDokumenUpload = function (params) {
				$scope.popUpDokumen = {};
			}

			function loadDataDokumen(params) {
				if ($scope.popUpDokumen.noregistrasi == undefined ) {
					toastr.error('Pilih data dulu')
					return
				}
				var dpid = $scope.popUpDokumen.objectdepartemenfk
				// if(dpid != 16) {
				// 	dpid = 18
				// }
				$scope.listBerkasMonitoring =[]
				medifirstService.get('bridging/inacbg/get-list-berkas-monitoring?dpid=' + dpid + '&noregistrasifk='+$scope.popUpDokumen.norec ).then(function(e){
					$scope.isRouteLoading = false
					
					$scope.listBerkasMonitoring = e.data.data
					$scope.listUploadMonitoring = e.data.upload
					for (var i = 0; i < $scope.listBerkasMonitoring.length; i++) {
						$scope.listBerkasMonitoring[i].no = i + 1
						$scope.listBerkasMonitoring[i].norec = $scope.popUpDokumen.norec
						$scope.listBerkasMonitoring[i].noregistrasi = $scope.popUpDokumen.noregistrasi
						$scope.listBerkasMonitoring[i].kodeexternal = null
						$scope.listBerkasMonitoring[i].statCheckbox = false

						const elem = $scope.listBerkasMonitoring[i]
						for (var x = 0; x < $scope.listUploadMonitoring .length; x++) {
							const elem2 = $scope.listUploadMonitoring [x]
							if(elem2.documentklaimfk == elem.id){
								$scope.listBerkasMonitoring[i].kodeexternal = elem2.filename
							}
						}
					}
					$scope.dataDaftarDokumen = new kendo.data.DataSource({
						data: $scope.listBerkasMonitoring,
						pageSize: 10,
						total: $scope.listBerkasMonitoring.length,
						serverPaging: false,
						schema: {
							model: {
								fields: {
								}
							}
						}
					});
					$scope.popupUploadNew.center().open();
				})
			}

			$scope.batalKlaim = function () {
				$scope.batalKlaim.norec_pd = $scope.dataPasienSelected.norec
				medifirstService.get('registrasi/get-batal-klaim?norec='
					+ $scope.batalKlaim.norec_pd).then(function (e) {
					if (e.data) {
						$scope.batalKlaim.pegawaibatalklaim = e.data.namalengkap
						$scope.batalKlaim.batalklaim = e.data.batalklaim
						$scope.batalKlaim.tglbatalklaim = e.data.tglbatalklaim == null ? null : moment(e.data.tglbatalklaim).format('DD-MM-YYYY HH:mm:ss')
					}
					
					$scope.popUpBatalKlaim.open().center()

				});
				
			}

			$scope.tutupBatalKlaim = function () {
				$scope.batalKlaim.batalklaim = '';
				$scope.popUpBatalKlaim.close()
			}

			$scope.simpanBatalKlaim = function () {
				if (!$scope.batalKlaim || !$scope.batalKlaim.batalklaim || $scope.batalKlaim.batalklaim.trim() === "") {
					toastr.warning("Alasan batal klaim tidak boleh kosong!");
					return;
				}
        
                var objSave = {
                    norecpd : $scope.batalKlaim.norec_pd,
                    batalklaim : ($scope.batalKlaim.batalklaim == null || $scope.batalKlaim == undefined) ? null : $scope.batalKlaim.batalklaim,
                }

				$scope.isRouteLoading = true
				medifirstService.post('registrasi/save-batal-klaim', objSave).then( function (e) {
					$scope.isRouteLoading= false
					$scope.tutupBatalKlaim()
					loadData()
                }, function (params) {
					$scope.isRouteLoading= false
				})
            }

			$scope.dataSelectedIdrg = {};
			function loadIdrg(params) {
				var norReg = ""
                if ($scope.itemPopUp.noregistrasi != undefined) {
                    norReg = "noReg=" + $scope.itemPopUp.noregistrasi;
                }

				 medifirstService.get("registrasi/get-diagnosa-10-idrg?"
                    + norReg 
                ).then(function (data) {
					$scope.isRouteLoading = false;
					if (data.data.idrg.length > 0) {
                        $scope.item.jenisDiagnosisIdrg = $scope.sourceJenisDiagnosisPrimer.find(function(item) {
							return item.id == 16;
						});
						$scope.itemPopUp.icd10idrg = data.data.icd10idrg;
						// console.log($scope.itemPopUp.icd10);
                    } else {
						$scope.itemPopUp.icd10idrg = '#'
						$scope.item.jenisDiagnosisIdrg = $scope.sourceJenisDiagnosisPrimer.find(function(item) {
							return item.id == 15;
						});
					}
						if(!['Grouping iDRG Final','Grouping INACBG Reedit','Grouping','Grouping INACBG Final','Final Klaim','Terkirim','Klaim Edit'].includes($scope.itemPopUp.statusklaim)){
							$scope.setIdrgIcd10()
						}
					var a = data.data.idrg.length;
					// for (var i = 0; i < data.data.inacbg.length; i++) {
					// 	if (data.data.datas[i].jd_id == 7 || data.data.datas[i].jd_id == 8) {
					// 		a = a + 1;	
					// 	}
					// }

					// console.log($scope.itemPopUp.icd10);
                    $scope.listGridDiagnosaIdrg = new kendo.data.DataSource({
                        data: data.data.idrg,
                        pageSize: 10,
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

			$scope.setIdrgIcd10 = async function (params) {
				$scope.isRouteLoading = true;
				var dt1 = {}
				var dt2 = []
					// if(!['Grouping iDRG Final','Grouping INACBG Reedit','Grouping','Grouping INACBG Final','Final Klaim','Terkirim'].includes($scope.itemPopUp.statusklaim)){

						dt1 = {
						"metadata": {
							"method": "idrg_diagnosa_set",
							"nomor_sep": $scope.itemPopUp.nomor_sep
						},
						"data": {
								"diagnosa": $scope.itemPopUp.icd10idrg
						}
					}
					dt2.push(dt1)
					
				// }

				var objData = {
					"data": dt2
				}
				
				await medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then( async function (e) {
					// LoadData();	
					// console.log(e)
					// $scope.saveLogging('Set Diagnosa iDRG', 'No SEP Pasien', $scope.itemPopUp.nomor_sep,
					// 'idrg_diagnosa_set ' + ' No Registrasi / No RM / No SEP : ' + $scope.itemPopUp.noregistrasi
					// + '/ ' +  $scope.itemPopUp.nocm + ' / '+ $scope.itemPopUp.nomor_sep +' Metadata : idrg_diagnosa_set')
					let response = e.data.dataresponse
					let arrStatus =[]
					for (var i = 0; i < response.length; i++) {
						const element = response[i]
						if(element.datarequest.metadata.method == 'idrg_diagnosa_set' && element.dataresponse.metadata.code == 200  ){
							arrStatus.push(
								{
									nosep:element.datarequest.data.nomor_sep,
									statusklaim: element.datarequest.metadata.method 
								})
						} else {
							toastr.error(element.dataresponse.metadata.message)
						}
					}
					// if(arrStatus.length>0){

					// 	for (var i = 0; i < data2.length; i++) {
					// 		const elem = data2[i]
					// 		for (var ii = 0; ii < arrStatus.length; ii++) {
					// 			const elem2 = arrStatus[ii]
					// 			if(elem.nosep == elem2.nosep){
					// 				elem2.norec = elem.norec
					// 			}
					// 		}
					// 	}

					// 	await medifirstService.post('bridging/inacbg/save-status', {'data':arrStatus}).then(  async function (z) {
					// 		if (z.data.status == 201) {
					// 			for (var x = $scope.listStatus.length - 1; x >= 0; x--) {
					// 				const elem =$scope.listStatus[x]
					// 				if(elem.id == z.data.data ){
					// 					$scope.itemPopUp.statusklaim = elem.name
					// 				}
					// 			}
					// 		}
					// 	})
					// }
					// LoadData();	
					
					
					$scope.isRouteLoading = false;
				},function(error){

					$scope.isRouteLoading = false;
				},function(error){
					$scope.isRouteLoading = false;
				})
			}

			


			$scope.dataSelectedIdrgTd = {}
			function loadIdrgTd(params) {
				var norReg = ""
                if ($scope.itemPopUp.noregistrasi != undefined) {
                    norReg = "noReg=" + $scope.itemPopUp.noregistrasi;
                }

				 medifirstService.get("registrasi/get-diagnosa-9-idrg?"
                    + norReg 
                ).then(function (data) {
					$scope.isRouteLoading = false;
					if (data.data.idrg.length > 0) {
							$scope.itemPopUp.icd9idrg = data.data.icd9idrg;
							// console.log($scope.itemPopUp.icd9)
						} else{
							$scope.itemPopUp.icd9idrg = '#'
						}

						if(!['Grouping iDRG Final','Grouping INACBG Reedit','Grouping','Grouping INACBG Final','Final Klaim','Terkirim','Klaim Edit'].includes($scope.itemPopUp.statusklaim)){
							$scope.setIdrgIcd9()
						}
					
                    $scope.listGridDiagnosaIdrgTd = new kendo.data.DataSource({
                        data: data.data.idrg,
                        pageSize: 10,
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

			$scope.setIdrgIcd9 = async function (params) {
				$scope.isRouteLoading = true;
				var dt1 = {}
				var dt2 = []
					// if(!['Grouping iDRG Final','Grouping INACBG Reedit','Grouping','Grouping INACBG Final','Final Klaim','Terkirim'].includes($scope.itemPopUp.statusklaim)){

						dt1 = {
						"metadata": {
							"method": "idrg_procedure_set",
							"nomor_sep": $scope.itemPopUp.nomor_sep
						},
						"data": {
								"procedure": $scope.itemPopUp.icd9idrg
						}
					}
					dt2.push(dt1)
					
				// }

				var objData = {
					"data": dt2
				}
				
				await medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then( async function (e) {
					// LoadData();	
					// console.log(e)
					// $scope.saveLogging('Set Prosedur iDRG', 'No SEP Pasien', $scope.itemPopUp.nomor_sep,
					// 'idrg_procedure_set ' + ' No Registrasi / No RM / No SEP : ' + $scope.itemPopUp.noregistrasi
					// + '/ ' +  $scope.itemPopUp.nocm + ' / '+ $scope.itemPopUp.nomor_sep +' Metadata : idrg_procedure_set')
					let response = e.data.dataresponse
					let arrStatus =[]
					for (var i = 0; i < response.length; i++) {
						const element = response[i]
						if(element.datarequest.metadata.method == 'idrg_procedure_set'
							 && element.dataresponse.metadata.code == 200  ){
							arrStatus.push(
								{
									nosep:element.datarequest.data.nomor_sep,
									statusklaim: element.datarequest.metadata.method 
								})
						}
					}
					// if(arrStatus.length>0){

					// 	for (var i = 0; i < data2.length; i++) {
					// 		const elem = data2[i]
					// 		for (var ii = 0; ii < arrStatus.length; ii++) {
					// 			const elem2 = arrStatus[ii]
					// 			if(elem.nosep == elem2.nosep){
					// 				elem2.norec = elem.norec
					// 			}
					// 		}
					// 	}

					// 	await medifirstService.post('bridging/inacbg/save-status', {'data':arrStatus}).then(  async function (z) {
					// 		if (z.data.status == 201) {
					// 			for (var x = $scope.listStatus.length - 1; x >= 0; x--) {
					// 				const elem =$scope.listStatus[x]
					// 				if(elem.id == z.data.data ){
					// 					$scope.itemPopUp.statusklaim = elem.name
					// 				}
					// 			}
					// 		}
					// 	})
					// }
					// LoadData();	
					
					
					$scope.isRouteLoading = false;
				},function(error){

					$scope.isRouteLoading = false;
				},function(error){
					$scope.isRouteLoading = false;
				})
			}


			$scope.gridDiagnosaIdrg =
			[
				{
					"title": "#",
					"template": "{{listGridDiagnosaIdrg.indexOf(dataItem) + 1}}",
					"width": 35
				},
				{
					"field": "jenisdiagnosa",
					"title": "Jenis Diagnosis",
					"width": 150
				}, {
					"field": "kddiagnosa",
					"title": "Kode Diagnosa",
					"width": 150
				}, {
					"field": "namadiagnosa",
					"title": "Nama Diagnosa"
				},
				// {
				// 	"field": "keterangan",
				// 	"title": "Keterangan",
				// 	"width": 150
				// },
				// {
				// 	"field": "namalengkap",
				// 	"title": "Petugas",
				// 	"width": 150,
				// }

			];
			  

			$scope.klikGridIdrg = function (dataSelectedIdrg) {
				if (dataSelectedIdrg.kddiagnosa!= undefined) {
						$scope.item.jenisDiagnosisIdrg = { id: dataSelectedIdrg.objectjenisdiagnosafk, jenisDiagnosa: dataSelectedIdrg.jenisdiagnosa }
						$scope.sourceDiagnosisPrimerIdrg._data.push({
							id: dataSelectedIdrg.objectdiagnosafk,
							kdDiagnosa: dataSelectedIdrg.kddiagnosa,
							namaDiagnosa: dataSelectedIdrg.namadiagnosa,
							kodeNama: dataSelectedIdrg.kddiagnosa + ' - ' +dataSelectedIdrg.namadiagnosa
						})
						$scope.item.diagnosisPrimerIdrg = {
							id: dataSelectedIdrg.objectdiagnosafk,
							kdDiagnosa: dataSelectedIdrg.kddiagnosa,
							namaDiagnosa: dataSelectedIdrg.namadiagnosa,
							kodeNama: dataSelectedIdrg.kddiagnosa + ' - ' +dataSelectedIdrg.namadiagnosa,
							norec_diagnosapasien: dataSelectedIdrg.norec_diagnosapasien,
							norec_detaildpasien: dataSelectedIdrg.norec_detaildpasien,
						}
						$scope.item.norec_diagnosaidrg = dataSelectedIdrg.norec_diagnosapasien
						$scope.item.norec_diagnosadetailidrg = dataSelectedIdrg.norec_detaildpasien
					}
				}

			$scope.klikGridIdrgTd = function (dataSelectedIdrgTd) {
				if (dataSelectedIdrgTd.kddiagnosatindakan != undefined) {

					$scope.sourceDiagnosisIdrgTd._data.push({
						id: dataSelectedIdrgTd.id,
						kdDiagnosaTindakan: dataSelectedIdrgTd.kddiagnosatindakan,
						namaDiagnosaTindakan: dataSelectedIdrgTd.namadiagnosatindakan,
						kdNama: dataSelectedIdrgTd.kddiagnosatindakan + ' - ' + dataSelectedIdrgTd.namadiagnosatindakan
					})

					$scope.item.diagnosisIdrgTd = {
							id: dataSelectedIdrgTd.id,
							kdDiagnosaTindakan: dataSelectedIdrgTd.kddiagnosatindakan,
							namaDiagnosaTindakan: dataSelectedIdrgTd.namadiagnosatindakan,
							kdNama: dataSelectedIdrgTd.kddiagnosatindakan + ' - ' + dataSelectedIdrgTd.namadiagnosatindakan,
							norec_diagnosapasien: dataSelectedIdrgTd.norec_diagnosapasien,
					}

					$scope.item.norec_diagnosaidrgTd = dataSelectedIdrgTd.norec_diagnosapasien,
					$scope.item.jumlahprocedureidrg = dataSelectedIdrgTd.jumlah,
					$scope.item.keteranganTindakan = "-"
				}
			}

			$scope.simpanDiagnosaIdrg = function () {
				
                if ($scope.item.jenisDiagnosisIdrg == undefined) {
                    alert("Pilih Jenis Diagnosa terlebih dahulu!!")
                    return
                }
                if ($scope.item.diagnosisPrimerIdrg == undefined) {
                    alert("Pilih Kode Diagnosa dan Nama Diagnosa terlebih dahulu!!")
                    return
                }
                var norecDiagnosaPasien = "";
                if ($scope.item.norec_diagnosapasien != undefined) {
                    norecDiagnosaPasien = $scope.item.norec_diagnosaidrg
                }
                var norecDiagnosaDetailPasien = "";
                if ($scope.item.norec_diagnosadetailidrg != undefined) {
                    norecDiagnosaDetailPasien = $scope.item.norec_diagnosadetailidrg
                }


                $scope.now = new Date();
                var detaildiagnosapasien = {
                    norec_dp: norecDiagnosaPasien,
                    norec_ddp:  norecDiagnosaDetailPasien,
                    noregistrasifk: $scope.itemPopUp.norec_apd,
                    tglregistrasi: moment($scope.itemPopUp.tglregistrasi).format('YYYY-MM-DD HH:mm:ss'),
                    objectdiagnosafk: $scope.item.diagnosisPrimerIdrg.id,
                    objectjenisdiagnosafk: $scope.item.jenisDiagnosisIdrg.id,
                    tglinputdiagnosa: moment($scope.now).format('YYYY-MM-DD HH:mm:ss'),
                    keterangan: '-'
                }
                var objSave =
                {
                    detaildiagnosapasien: detaildiagnosapasien,
                }

                medifirstService.post('registrasi/save-diagnosa-pasiendua', objSave).then(function (e) {
					var ket = ''
					if (norecDiagnosaPasien == '') {
						ket = 'Input'
					} else {
						ket = 'Ubah'
					}
					$scope.saveLogging('Diagnosis', 'Norec DiagnosaPasien_T', e.data.data.norec,
					ket + ' Diagnosis ICD 10 iDRG ( ' + $scope.item.diagnosisPrimerIdrg.kodeNama + ' )' + ' No Registrasi / No RM ' + $scope.itemPopUp.noregistrasi
					+ '/ ' +  $scope.itemPopUp.nocm);

                    delete $scope.item.jenisDiagnosisIdrg;
                    delete $scope.item.diagnosisPrimerIdrg;
                    delete $scope.item.norec_diagnosaidrg;
                    delete $scope.item.norec_diagnosadetailidrg;
                    $scope.dataSelectedIdrg = {};
                    loadIdrg()
					
                })

            }

			$scope.simpanDiagnosaIdrgTd = function () {
                if ($scope.item.diagnosisIdrgTd == undefined) {
                    alert("Pilih Kode Diagnosa dan Nama Diagnosa terlebih dahulu!!")
                    return
                }
                var norecDiagnosaTindakanPasien = "";
				if ($scope.item.norec_diagnosaidrgTd != undefined) {
                    norecDiagnosaTindakanPasien = $scope.item.norec_diagnosaidrgTd
                }
               

                $scope.now = new Date();
                var detaildiagnosatindakanpasien = {
                    norec_dp: norecDiagnosaTindakanPasien,
                    objectpasienfk: $scope.itemPopUp.norec_apd,
                    tglpendaftaran: $scope.itemPopUp.tglregistrasi,
                    objectdiagnosatindakanfk: $scope.item.diagnosisIdrgTd.id,
                    jumlah: $scope.item.jumlahprocedureidrg,
                    keterangantindakan: "-",
					ketdiagnosa: 'iDRG',
                }
                var objSave =
                {
                    detaildiagnosatindakanpasien: detaildiagnosatindakanpasien,
                }

                medifirstService.post('registrasi/save-diagnosa-tindakan-pasien', objSave).then(function (e) {
					var ket = ''
					if (norecDiagnosaTindakanPasien == '') {
						ket = 'Input'
					} else {
						ket = 'Ubah'
					}
					$scope.saveLogging('Diagnosis', 'Norec DiagnosaTindakanPasien_T', e.data.data.norec,
					ket + ' Diagnosis ICD 9 iDRG( ' +  $scope.item.diagnosisIdrgTd.kdNama + ' )' + ' No Registrasi / No RM ' + $scope.itemPopUp.noregistrasi
					+ '/ ' +  $scope.itemPopUp.nocm)

                    delete $scope.item.diagnosisIdrgTd;
                    delete $scope.item.norec_diagnosaidrgTd;
                    delete $scope.item.jumlahprocedureidrg;
                    $scope.dataSelectedIdrgTd = {};
                    loadIdrgTd()

					
                })
            }

			$scope.hapusDiagnosaIdrg = function () {

                if ($scope.item.norec_diagnosadetailidrg == undefined) {
                    alert("Pilih data yang mau di hapus!!")
                    return
                }
                var diagnosa = {
					
					// norec_dp : $scope.item.norec_diagnosapasien,
                    norec_ddp: $scope.item.norec_diagnosadetailidrg
                }
                var objDelete =
                {
					noreg: $scope.itemPopUp.noregistrasi,
					eklaim: true,
					idrg: true,
                    diagnosa: diagnosa,
                }
                medifirstService.post('registrasi/daftar-antrian-pasien/delete-diagnosa-pasien', objDelete).then(function (e) {
					$scope.saveLogging('Diagnosis', 'Norec DiagnosaPasien_T','',
					'Hapus Diagnosis ICD 10 iDRG( ' + $scope.item.diagnosisPrimerIdrg.kodeNama + ' )' + ' No Registrasi / No RM ' + $scope.itemPopUp.noregistrasi
					+ '/ ' +  $scope.itemPopUp.nocm);

                    delete $scope.item.jenisDiagnosisIdrg;
                    delete $scope.item.diagnosisPrimerIdrg;
					delete $scope.item.norec_diagnosaidrg;
                    delete $scope.item.norec_diagnosadetailidrg;
                    $scope.dataSelectedIdrg = {};
                    loadIdrg()
                })
            }

			$scope.hapusDiagnosaIdrgTd = function () {

                if ($scope.item.diagnosisIdrgTd == undefined) {
                    alert("Pilih data yang mau di hapus!!")
                    return
                }
                var diagnosa = {
                    norec_dp: $scope.item.diagnosisIdrgTd.norec_diagnosapasien
                }
                var objDelete =
                {
                    diagnosa: diagnosa,
                }
                medifirstService.post('registrasi/delete-diagnosa-tindakan-pasien', objDelete).then(function (e) {
					$scope.saveLogging('Diagnosis', 'Norec DiagnosaTindakanPasien_T','',
					'Hapus Diagnosis ICD 9 ( ' +  $scope.item.diagnosisIdrgTd.kdNama + ' )' + ' No Registrasi / No RM ' + $scope.itemPopUp.noregistrasi
					+ '/ ' +  $scope.itemPopUp.nocm)
                    delete $scope.item.diagnosisIdrgTd;
					delete $scope.item.norec_diagnosaidrgTd;
					delete $scope.item.jumlahprocedureidrg;

                    $scope.dataSelectedIdrgTd = {};
                    loadIdrgTd()
                })
            }

			$scope.batalDiagnosaIdrg = function () {
                delete $scope.item.jenisDiagnosisIdrg;
                delete $scope.item.diagnosisPrimerIdrg;
				delete $scope.item.norec_diagnosaidrg;
                delete $scope.item.norec_diagnosadetailidrg;

				if ($scope.listGridDiagnosaIdrg._data.length > 0) {
					 $scope.item.jenisDiagnosisIdrg = $scope.sourceJenisDiagnosisPrimer.find(function(item) {
							return item.id == 16;
						});

					
				} else {
					 $scope.item.jenisDiagnosisIdrg = $scope.sourceJenisDiagnosisPrimer.find(function(item) {
							return item.id == 15;
						});
				}
			}

			$scope.batalDiagnosaIdrgTd = function () {
               	delete $scope.item.diagnosisIdrgTd;
				delete $scope.item.norec_diagnosaidrgTd;
				delete $scope.item.jumlahprocedureidrg;
                $scope.dataSelectedIdrgTd = {};

			}

			$scope.gridDiagnosaIdrgTd =
			[
				{
					"title": "#",
					"template": "{{listGridDiagnosaIdrgTd.indexOf(dataItem) + 1}}",
					"width": 35
				},
				// {
				// 	"field": "tglinputdiagnosa",
				// 	"title": "Tgl. Input",
				// 	"width": "85px",
				// },
				{
					"field": "kddiagnosatindakan",
					"title": "Kode Diagnosa",
					"width": 150
				}, {
					"field": "namadiagnosatindakan",
					"title": "Nama Diagnosa"
				},
				{
					"field": "ketdiagnosa",
					"title": "Keterangan diagnosa",
					"width": "100px",
				},
				{
					"field": "jumlah",
					"title": "jml",
					"width": "50px",
				},
				// {
				// 	"field": "namalengkap",
				// 	"title": "Petugas",
				// 	"width": "150px",
				// }
			];

			$scope.simpangrouperidrg = async function () {
				$scope.isRouteLoading = true;
				await $scope.setIdrgIcd10()
				await $scope.setIdrgIcd9()
				var dt1 = {}
				var dt2 = []
					if($scope.itemPopUp.statusklaim!= 'Grouping iDRG Final'){

						dt1 = {
						"metadata": {
							"method": "grouper",
							"stage": "1",
        					"grouper": "idrg"
						},
						"data": {
								"nomor_sep": $scope.itemPopUp.nomor_sep
						}
					}
					dt2.push(dt1)
					
				}

				var objData = {
					"data": dt2
				}
				
				await medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then( async function (e) {
					$scope.isRouteLoading = false;
					// LoadData();	
					// console.log(e)
					$scope.saveLogging('Grouper iDRG', 'No SEP Pasien', $scope.itemPopUp.nomor_sep,
					'grouper_idrg ' + ' No Registrasi / No RM / No SEP : ' + $scope.itemPopUp.noregistrasi
					+ '/ ' +  $scope.itemPopUp.nocm + ' / '+ $scope.itemPopUp.nomor_sep +' Metadata : grouper_idrg')
					let response = e.data.dataresponse
					let arrStatus =[]
					for (var i = 0; i < response.length; i++) {
						const element = response[i]
						if(element.datarequest.metadata.method == 'grouper' && element.datarequest.metadata.grouper == 'idrg'
							 && element.dataresponse.metadata.code == 200  ){
							arrStatus.push(
								{
									nosep:element.datarequest.data.nomor_sep,
									statusklaim: element.datarequest.metadata.method + '_idrg'
								})
							
							var responseIdrg = {
										"noregistrasifk": $scope.itemPopUp.norec,
										"drg_code": element.dataresponse.response_idrg.drg_code,
										"drg_description": element.dataresponse.response_idrg.drg_description,
										"logic_version": element.dataresponse.response_idrg.logic_version,
										"mdc_description": element.dataresponse.response_idrg.mdc_description,
										"mdc_number": element.dataresponse.response_idrg.mdc_number,
										"script_version": element.dataresponse.response_idrg.script_version,
									}

							await medifirstService.post('bridging/inacbg/save-hasil-grouping-idrg', responseIdrg).then( async function (hasilidrg) {
								if (hasilidrg.data.status == 201) {
									$scope.grouper_idrg = true;
									$scope.itemPopUp.data_idrg = hasilidrg.data.data_idrg
									$scope.itemPopUp.data_idrg.tglgrouping = moment(hasilidrg.data.data_idrg.tglgrouping).format('D MMM YYYY HH:mm');
								}
							})

						}
					}
					if(arrStatus.length>0){

						for (var i = 0; i < data2.length; i++) {
							const elem = data2[i]
							for (var ii = 0; ii < arrStatus.length; ii++) {
								const elem2 = arrStatus[ii]
								if(elem.nosep == elem2.nosep){
									elem2.norec = elem.norec
								}
							}
						}

						await medifirstService.post('bridging/inacbg/save-status', {'data':arrStatus}).then(  async function (z) {
							if (z.data.status == 201) {
								for (var x = $scope.listStatus.length - 1; x >= 0; x--) {
									const elem =$scope.listStatus[x]
									if(elem.id == z.data.data ){
										$scope.itemPopUp.statusklaim = elem.name
										$scope.updateDataByNorec($scope.itemPopUp.norec, "statusklaim", elem.name);
									}
								}
							}
						})
					}
					// LoadData();	
					
					
					
				},function(error){

					$scope.isRouteLoading = false;
				},function(error){
					$scope.isRouteLoading = false;
				})
			
			}

			$scope.updateDataByNorec = function(norec, fieldName, newValue) {
				var data = $scope.dataDaftarPasienPulang.data(); 
				var item = data.find(function(d) {
					return d.norec === norec; // cari berdasarkan norec
				});

				if (item) {
					item.set(fieldName, newValue); 
					$scope.dataDaftarPasienPulang.sync();
				} else {
					console.warn("Data dengan norec " + norec + " tidak ditemukan.");
				}
			};

			function loadGroupingIdrg() {
				medifirstService.get("bridging/inacbg/get-grouping-idrg?noregistrasifk="+ $scope.itemPopUp.norec).then(function (hasilidrg) {
					if (hasilidrg.data && Object.keys(hasilidrg.data).length > 0) {
						$scope.grouper_idrg = true;
						$scope.itemPopUp.data_idrg = hasilidrg.data
						$scope.itemPopUp.data_idrg.tglgrouping = moment(hasilidrg.data.tglgrouping).format('D MMM YYYY HH:mm');
					}
				})
			}

			$scope.finalIdrg = async function () {
				var dt1 = {}
				var dt2 = []
					if($scope.itemPopUp.statusklaim !='Grouping iDRG Final'){

						dt1 = {
							"metadata": {
								"method": "idrg_grouper_final"
							},
							"data": {
								"nomor_sep": $scope.itemPopUp.nomor_sep
							}
						}
					dt2.push(dt1)
					
				}

				var objData = {
					"data": dt2
				}
				
				await medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then( async function (e) {
					$scope.isRouteLoading = false;
					// LoadData();	
					// console.log(e)
					$scope.saveLogging('Grouper iDRG Final', 'No SEP Pasien', $scope.itemPopUp.nomor_sep,
					'idrg_grouper_final ' + ' No Registrasi / No RM / No SEP : ' + $scope.itemPopUp.noregistrasi
					+ '/ ' +  $scope.itemPopUp.nocm + ' / '+ $scope.itemPopUp.nomor_sep +' Metadata : idrg_grouper_final')
					let response = e.data.dataresponse
					let arrStatus =[]
					for (var i = 0; i < response.length; i++) {
						const element = response[i]
						if(element.datarequest.metadata.method == 'idrg_grouper_final' && element.dataresponse.metadata.code == 200  ){
							arrStatus.push(
								{
									nosep:element.datarequest.data.nomor_sep,
									statusklaim: element.datarequest.metadata.method
								})

						}
					}
					if(arrStatus.length>0){

						for (var i = 0; i < data2.length; i++) {
							const elem = data2[i]
							for (var ii = 0; ii < arrStatus.length; ii++) {
								const elem2 = arrStatus[ii]
								if(elem.nosep == elem2.nosep){
									elem2.norec = elem.norec
								}
							}
						}

						await medifirstService.post('bridging/inacbg/save-status', {'data':arrStatus}).then(  async function (z) {
							if (z.data.status == 201) {
								for (var x = $scope.listStatus.length - 1; x >= 0; x--) {
									const elem =$scope.listStatus[x]
									if(elem.id == z.data.data ){
										$scope.itemPopUp.statusklaim = elem.name
										$scope.updateDataByNorec($scope.itemPopUp.norec, "statusklaim", elem.name);
									}
								}
							}
						})
					}
					// LoadData();	
					
					
					
				},function(error){

					$scope.isRouteLoading = false;
				},function(error){
					$scope.isRouteLoading = false;
				})
			}

			$scope.editUlangIdrg = async function () {
				var dt1 = {}
				var dt2 = []
					// if(['Grouping iDRG Final','Grouping','Grouping INACBG Reedit','Grouping INACBG Final','Klaim Edit'].includes($scope.itemPopUp.statusklaim)){

						dt1 = {
							"metadata": {
								"method": "idrg_grouper_reedit"
							},
							"data": {
								"nomor_sep": $scope.itemPopUp.nomor_sep
							}
						}
					dt2.push(dt1)
					
				// }

				var objData = {
					"data": dt2
				}
				$scope.listspecialdrug = []
				$scope.listspecialprocedure = []
				$scope.listspecialprosthesis = []
				$scope.listspecialinvestigation = []
				$scope.item.specialprocedure = {}
				$scope.item.specialdrug = {}
				$scope.item.specialinvestigation = {}
				$scope.item.specialprosthesis = {}
				
				await medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then( async function (e) {
					$scope.isRouteLoading = false;
					// LoadData();	
					// console.log(e)
					$scope.saveLogging('Grouper iDRG Final', 'No SEP Pasien', $scope.itemPopUp.nomor_sep,
					'idrg_grouper_reedit ' + ' No Registrasi / No RM / No SEP : ' + $scope.itemPopUp.noregistrasi
					+ '/ ' +  $scope.itemPopUp.nocm + ' / '+ $scope.itemPopUp.nomor_sep +' Metadata : idrg_grouper_reedit')
					let response = e.data.dataresponse
					let arrStatus =[]
					for (var i = 0; i < response.length; i++) {
						const element = response[i]
						if(element.datarequest.metadata.method == 'idrg_grouper_reedit' && element.dataresponse.metadata.code == 200  ){
							arrStatus.push(
								{
									nosep:element.datarequest.data.nomor_sep,
									statusklaim: element.datarequest.metadata.method
								})

							var objDelete = {
								norec_pd : $scope.itemPopUp.norec
							}	
							await medifirstService.postNonMessage('bridging/inacbg/delete-grouping-inacbg', objDelete).then( async function (e) {
								$scope.itemgrop = {}
								$scope.itemPopUp.response = {}
								$scope.updateDataByNorec($scope.itemPopUp.norec, "response", null);
								$scope.updateDataByNorec($scope.itemPopUp.norec, "totalpiutangpenjamin", null);
								$scope.updateDataByNorec($scope.itemPopUp.norec, "special_cmg", null);
								$scope.grupingtab = false
							})
						}
					}
					if(arrStatus.length>0){

						for (var i = 0; i < data2.length; i++) {
							const elem = data2[i]
							for (var ii = 0; ii < arrStatus.length; ii++) {
								const elem2 = arrStatus[ii]
								if(elem.nosep == elem2.nosep){
									elem2.norec = elem.norec
								}
							}
						}

						await medifirstService.post('bridging/inacbg/save-status', {'data':arrStatus}).then(  async function (z) {
							if (z.data.status == 201) {
								for (var x = $scope.listStatus.length - 1; x >= 0; x--) {
									const elem =$scope.listStatus[x]
									if(elem.id == z.data.data ){
										$scope.itemPopUp.statusklaim = elem.name
										$scope.updateDataByNorec($scope.itemPopUp.norec, "statusklaim", elem.name);
									}
								}
							}
						})
					}
					// LoadData();	
					
					
					
				},function(error){

					$scope.isRouteLoading = false;
				},function(error){
					$scope.isRouteLoading = false;
				})
			}

			$scope.importIdrg = async function() {
				$scope.isimportidrg = true
				if ($scope.itemPopUp.noregistrasi == undefined) {
					toastr.error('Data pasien belum dipilih');
					return;
				}
				
				var dt1 = {}
				var dt2 = []
					// if($scope.itemPopUp.statusklaim =='Grouping iDRG Final'){

						dt1 = {
							"metadata": {
								"method": "idrg_to_inacbg_import"
							},
							"data": {
								"nomor_sep": $scope.itemPopUp.nomor_sep
							}
						}
					dt2.push(dt1)
					
				// }

				var objData = {
					"data": dt2
				}
				
				await medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then( async function (e) {
					$scope.isRouteLoading = false;
					// LoadData();	
					// console.log(e)
					// $scope.saveLogging('Grouper iDRG Final', 'No SEP Pasien', $scope.itemPopUp.nomor_sep,
					// 'idrg_to_inacbg_import ' + ' No Registrasi / No RM / No SEP : ' + $scope.itemPopUp.noregistrasi
					// + '/ ' +  $scope.itemPopUp.nocm + ' / '+ $scope.itemPopUp.nomor_sep +' Metadata : idrg_to_inacbg_import')
					let response = e.data.dataresponse
					// let arrStatus =[]
					for (var i = 0; i < response.length; i++) {
						const element = response[i]
						if(element.datarequest.metadata.method == 'idrg_to_inacbg_import' && element.dataresponse.metadata.code == 200  ){
							// arrStatus.push(
							// 	{
							// 		nosep:element.datarequest.data.nomor_sep,
							// 		statusklaim: element.datarequest.metadata.method
							// 	})

							var objSave = {
								noregistrasifk: $scope.itemPopUp.norec_apd,
								tglregistrasi: moment($scope.itemPopUp.tglregistrasi).format('YYYY-MM-DD HH:mm:ss'),
								norec_pd: $scope.itemPopUp.norec,
								noregistrasi: $scope.itemPopUp.noregistrasi
							}
						
							$scope.disabledTombol = true
							$scope.isLoadingNav = true
							medifirstService.post('registrasi/save-import-diagnosa-idrg', objSave).then(function (e) {
								$scope.disabledTombol = false
								$scope.isLoadingNav = false
								loadicd()
								loadicdix()
								
								
							},function (params) {
								$scope.disabledTombol = false
								$scope.isLoadingNav = false
							})
						}
					}
				})
			}

				$scope.setInacbgIcd10 = async function (params) {
					$scope.isRouteLoading = true;
					var dt1 = {}
					var dt2 = []
						// if(['Grouping iDRG Final','Grouping INACBG Reedit'].includes($scope.itemPopUp.statusklaim) ){

							dt1 = {
							"metadata": {
								"method": "inacbg_diagnosa_set",
								"nomor_sep": $scope.itemPopUp.nomor_sep
							},
							"data": {
									"diagnosa": $scope.itemPopUp.icd10
							}
						}
						dt2.push(dt1)
						
					// }

					var objData = {
						"data": dt2
					}
					
					await medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then( async function (e) {
						$scope.isRouteLoading = false;
					},function(error){

						$scope.isRouteLoading = false;
					},function(error){
						$scope.isRouteLoading = false;
					})
				}

				$scope.setInacbgIcd9 = async function (params) {
					$scope.isRouteLoading = true;
					var dt1 = {}
					var dt2 = []
						// if(['Grouping iDRG Final','Grouping INACBG Reedit'].includes($scope.itemPopUp.statusklaim) ){

							dt1 = {
							"metadata": {
								"method": "inacbg_procedure_set",
								"nomor_sep": $scope.itemPopUp.nomor_sep
							},
							"data": {
									"procedure": $scope.itemPopUp.icd9
							}
						}
						dt2.push(dt1)
						
					// }

					var objData = {
						"data": dt2
					}
					
					await medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then( async function (e) {
						
						$scope.isRouteLoading = false;
					},function(error){

						$scope.isRouteLoading = false;
					},function(error){
						$scope.isRouteLoading = false;
					})
				}

				$scope.grouperInacbgStage1 = async function(params) {
					$scope.isRouteLoading = true;
					await $scope.setInacbgIcd10()
					await $scope.setInacbgIcd9()
					$scope.listspecialdrug = []
					$scope.listspecialprocedure = []
					$scope.listspecialprosthesis = []
					$scope.listspecialinvestigation = []
					$scope.item.specialprocedure = {}
					$scope.item.specialdrug = {}
					$scope.item.specialinvestigation = {}
					$scope.item.specialprosthesis = {}
					// if ($scope.itemPopUp.deptid != 16) {
							var dt1 = {}
							var dt2 = []
							
							// for (var i = dataSave.length - 1; i >= 0; i--) {
							dt1 = {
								"metadata": {
									"method": "grouper",
									"stage": "1",
									"grouper": "inacbg"
								},
								"data": {
									// "nomor_sep": dataSave[i].nomor_sep 
									"nomor_sep": $scope.itemPopUp.nomor_sep
								}
							}
							dt2.push(dt1)
							// }


							var objData = {
								"data": dt2
							}
							var totaldijamin = "";
							var hakkelas = "";
							var biayanaikkelas = "0";
						await	medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(async function (e) {
							$scope.isRouteLoading = false;
								// simpan response ke database
								// savelogging
								$scope.saveLogging('Grouping Klaim', 'No SEP Pasien', e.data.dataresponse[0].datarequest.data.nomor_sep,
								'Grouping Klaim ' + ' No Registrasi / No RM / No SEP : ' + $scope.itemPopUp.noregistrasi
									+ '/ ' +  $scope.itemPopUp.nocm + ' / '+  e.data.dataresponse[0].datarequest.data.nomor_sep +' Metadata : ' +  e.data.dataresponse[0].datarequest.metadata.method)

								responData = e.data.dataresponse;
								toastr.info(responData[0].dataresponse.metadata.message, 'INACBG');
								toastr.info(responData[0].dataresponse.response_inacbg.cbg.description, 'INACBG');
								
								$scope.itemgrop= responData[0].dataresponse	
								$scope.itemPopUp.response = responData[0].dataresponse	

								let response = e.data.dataresponse
								let arrStatus =[]
								for (var i = 0; i < response.length; i++) {
									const element = response[i]
									if(element.datarequest.metadata.method == 'grouper'
										&& element.dataresponse.metadata.code == 200 && responData[0].dataresponse.response_inacbg.cbg.description != 'GAGAL: KODE DIAGNOSA TIDAK BERLAKU'  ){
										arrStatus.push(
											{
												nosep:element.datarequest.data.nomor_sep,
												statusklaim: element.datarequest.metadata.method 
											})
									}
								}
								if(arrStatus.length>0){

									for (var i = 0; i < data2.length; i++) {
										const elem = data2[i]
										for (var ii = 0; ii < arrStatus.length; ii++) {
											const elem2 = arrStatus[ii]
											if(elem.nosep == elem2.nosep){
												elem2.norec = elem.norec
											}
										}
									}

									await	medifirstService.post('bridging/inacbg/save-status', {'data':arrStatus}).then(async function (z) {
											$scope.isRouteLoading = false;
											if (z.data.status == 201) {
												for (var x = $scope.listStatus.length - 1; x >= 0; x--) {
													const elem =$scope.listStatus[x]
													if(elem.id == z.data.data ){
														$scope.itemPopUp.statusklaim = elem.name
														$scope.updateDataByNorec($scope.itemPopUp.norec, "statusklaim", elem.name);
														$scope.grupingtab = true
													}
												}
											}
										
										})

									var dataSave = {
										'namapegawai': $scope.user.namaLengkap,
										'param': 'grouper',
										'norec': $scope.itemPopUp.norec
									}
									await	medifirstService.post('bridging/inacbg/save-pegawai', dataSave).then(async function (e) {
									})
								}
								//end status
								
								if (responData[0].dataresponse.response_inacbg.cbg.description == "ERROR: MALE WITH GROUPING CRITERIA NOT MET") {
									toastr.info('JENIS KELAMIN SALAH ATAU DIAGNOSA TIDAK SESUAI JENIS KELAMIN', 'INACBG');
								}
								// if(dataSave[0].jenis_rawat==2){
								
									totaldijamin = responData[0].dataresponse.response_inacbg.tariff
								
									if (arrStatus.length>0) {
										var dataproposi = {
											"noregistrasifk": $scope.itemPopUp.norec,
											"totalDijamin": totaldijamin,
											"biayaNaikkelas": biayanaikkelas,
											"response": responData[0].dataresponse,
										}
										await medifirstService.post('bridging/inacbg/save-proposi-bridging-inacbg', dataproposi).then(async function (e) {
											//ini untuk proposional kan utang per tindakan
											$scope.updateDataByNorec($scope.itemPopUp.norec, "totalpiutangpenjamin", $scope.itemPopUp.response.response_inacbg.tariff);
											$scope.updateDataByNorec($scope.itemPopUp.norec, "response", $scope.itemPopUp.response);
										})
									}
								
								
								// loadData()
								if (responData[0].dataresponse.hasOwnProperty("special_cmg_option") == true && responData[0].dataresponse.special_cmg_option.length > 0) {
									toastr.info('Terdeteksi Top-up CMG Options')
									$scope.istopup = true
									dataSEPCMG = responData[0].datarequest.data.nomor_sep
									var responOptions = responData[0].dataresponse.special_cmg_option
									var spesialDrug = []
									var specialProcedure = []
									var specialProsthesis = []
									var specialInvestigation = []
									for (let i = 0; i < responOptions.length; i++) {
										const element = responOptions[i];
										if (element.type == 'Special Drug') {
											spesialDrug.push(element)
										}
										if (element.type == 'Special Procedure') {
											specialProcedure.push(element)
										}
										if (element.type == 'Special Prosthesis') {
											specialProsthesis.push(element)
										}
										if (element.type == 'Special Investigation') {
											specialInvestigation.push(element)
										}
									}
									$scope.listspecialdrug = spesialDrug
									$scope.listspecialprocedure = specialProcedure
									$scope.listspecialprosthesis = specialProsthesis
									$scope.listspecialinvestigation = specialInvestigation
									$scope.itemgrop= responData[0].dataresponse
									$scope.itemPopUp.response = responData[0].dataresponse
								}
							})

						$scope.isRouteLoading = false;
						
					
					// } 
					// else {
					// 	var	datass =[{ noreg:  $scope.itemPopUp.norec,
					// 			   namakelas:  $scope.itemPopUp.namakelas, 
					// 			   nosep:  $scope.itemPopUp.nosep,
					// 			   deptid:  $scope.itemPopUp.deptid }]
					// 		await medifirstService.postNonMessage('bridging/inacbg/get-daftar-pasien-statusnaikkelas?noreg=' + $scope.itemPopUp.norec
					// 			+ '&namakelas=' + $scope.itemPopUp.namakelas,{'data':datass}).then(async function (e) {
					// 				var resp = e.data[0];
					// 					var dt1 = {}
					// 					var dt2 = []
										
					// 					// for (var i = dataSave.length - 1; i >= 0; i--) {
					// 					dt1 = {
					// 						"metadata": {
					// 							"method": "grouper",
					// 							"stage": "1",
					// 							"grouper": "inacbg"
					// 						},
					// 						"data": {
					// 							// "nomor_sep": dataSave[i].nomor_sep 
					// 							"nomor_sep": $scope.itemPopUp.nosep
					// 						}
					// 					}
					// 					dt2.push(dt1)
					// 					// }


					// 					var objData = {
					// 						"data": dt2
					// 					}
					// 					var totaldijamin = "";
					// 					var hakkelas = "";
					// 					var biayanaikkelas = "0";
					// 					var top_up_jenazah = "";
					// 				await	medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(async function (e) {
					// 						// simpan response ke database
					// 						$scope.saveLogging('Grouping Klaim', 'No SEP Pasien', e.data.dataresponse[0].datarequest.data.nomor_sep,
					// 					'Grouping Klaim ' + ' No Registrasi / No RM / No SEP : ' + $scope.itemPopUp.noregistrasi
					// 					+ '/ ' +  $scope.itemPopUp.nocm + ' / '+  e.data.dataresponse[0].datarequest.data.nomor_sep +' Metadata : ' +  e.data.dataresponse[0].datarequest.metadata.method)
					// 						responData = e.data.dataresponse;
					// 						toastr.info(responData[0].dataresponse.metadata.message, 'INACBG');
					// 						toastr.info(responData[0].dataresponse.response_inacbg.cbg.description, 'INACBG');
					// 						$scope.itemgrop= responData[0].dataresponse	
					// 						$scope.itemPopUp.response= responData[0].dataresponse	
					// 						if (responData[0].dataresponse.hasOwnProperty("special_cmg_option") == true && responData[0].dataresponse.special_cmg_option.length > 0) {
					// 							$scope.istopup = true
					// 							var responOptions = responData[0].dataresponse.special_cmg_option
					// 							var spesialDrug = []
					// 							var specialProcedure = []
					// 							var specialProsthesis = []
					// 							var specialInvestigation = []
					// 							for (let i = 0; i < responOptions.length; i++) {
					// 								const element = responOptions[i];
					// 								if (element.type == 'Special Drug') {
					// 									spesialDrug.push(element)
					// 								}
					// 								if (element.type == 'Special Procedure') {
					// 									specialProcedure.push(element)
					// 								}
					// 								if (element.type == 'Special Prosthesis') {
					// 									specialProsthesis.push(element)
					// 								}
					// 								if (element.type == 'Special Investigation') {
					// 									specialInvestigation.push(element)
					// 								}
					// 						}
					// 							$scope.listspecialdrug = spesialDrug
					// 							$scope.listspecialprocedure = specialProcedure
					// 							$scope.listspecialprosthesis = specialProsthesis
					// 							$scope.listspecialinvestigation = specialInvestigation
					// 						// $scope.itemgrop= responData[0].dataresponse
					// 						}
					// 						// dd($scope.itemgrop);
					// 						if (responData[0].dataresponse.response_inacbg.cbg.description == "ERROR: MALE WITH GROUPING CRITERIA NOT MET") {
					// 							toastr.info('JENIS KELAMIN SALAH ATAU DIAGNOSA TIDAK SESUAI JENIS KELAMIN', 'INACBG');
					// 						}

					// 						//save status
					// 						let response = e.data.dataresponse
					// 						let arrStatus =[]
					// 						for (var i = 0; i < response.length; i++) {
					// 							const element = response[i]
					// 							if(element.datarequest.metadata.method == 'grouper'
					// 								&& element.dataresponse.metadata.code == 200  ){
					// 								arrStatus.push(
					// 									{
					// 										nosep:element.datarequest.data.nomor_sep,
					// 										statusklaim: element.datarequest.metadata.method 
					// 									})
					// 							}
					// 						}
					// 						if(arrStatus.length>0){

					// 							for (var i = 0; i < data2.length; i++) {
					// 								const elem = data2[i]
					// 								for (var ii = 0; ii < arrStatus.length; ii++) {
					// 									const elem2 = arrStatus[ii]
					// 									if(elem.nosep == elem2.nosep){
					// 										elem2.norec = elem.norec
					// 									}
					// 								}
					// 							}

					// 						await	medifirstService.post('bridging/inacbg/save-status', {'data':arrStatus}).then(async function (z) {
					// 								if (z.data.status == 201) {
					// 									for (var x = $scope.listStatus.length - 1; x >= 0; x--) {
					// 										const elem =$scope.listStatus[x]
					// 										if(elem.id == z.data.data ){
					// 											$scope.itemPopUp.statusklaim = elem.name
					// 											$scope.updateDataByNorec($scope.itemPopUp.norec, "statusklaim", elem.name);
					// 										}
					// 									}
					// 								}
					// 							})
					// 							var dataSave = {
					// 								'namapegawai': $scope.user.namaLengkap,
					// 								'param': 'grouper',
					// 								'norec': $scope.itemPopUp.norec
					// 							}
					// 						await	medifirstService.post('bridging/inacbg/save-pegawai', dataSave).then(async function (e) {
					// 							})
					// 						}

					// 						// if(dataSave[0].jenis_rawat==2){
					// 						if ($scope.itemPopUp.statuscovid === true) {
					// 							if (responData[0].dataresponse.response_inacbg.covid19_data.top_up_jenazah != 0) {
					// 								top_up_jenazah = "";
					// 							}
					// 							// totaldijamin = top_up_jenazah + responData[0].dataresponse.response_inacbg.covid19_data.top_up_rawat + responData[0].dataresponse.response_inacbg.covid19_data.top_up_rawat_factor + responData[0].dataresponse.response_inacbg.covid19_data.top_up_rawat_gross
					// 							totaldijamin = responData[0].dataresponse.response_inacbg.covid19_data.nilai_klaim
					// 						} else {
					// 							hakkelas = responData[0].dataresponse.response_inacbg.kelas
					// 							if (hakkelas == "kelas_1") {
					// 								totaldijamin = responData[0].dataresponse.tarif_alt[0].tarif_inacbg
					// 							} else if (hakkelas == "kelas_2") {
					// 								totaldijamin = responData[0].dataresponse.tarif_alt[1].tarif_inacbg
					// 							} else if (hakkelas == "kelas_3") {
					// 								totaldijamin = responData[0].dataresponse.tarif_alt[2].tarif_inacbg
					// 							}
					// 							// if($scope.dataPasienSelected.namakelas!=$scope.dataPasienSelected.namakelasdaftar){
					// 							if (resp.statusnaikkelas != '0') {
					// 								biayanaikkelas = responData[0].dataresponse.response_inacbg.add_payment_amt
					// 								if (biayanaikkelas < 0) {
					// 									biayanaikkelas = 0
					// 								}
					// 							}
					// 						}
					// 						var dataproposi = {
					// 							"noregistrasifk": $scope.itemPopUp.norec,
					// 							"totalDijamin": totaldijamin,
					// 							"biayaNaikkelas": biayanaikkelas,
					// 							"response": responData[0].dataresponse,
					// 						}
					// 						await medifirstService.post('bridging/inacbg/save-proposi-bridging-inacbg', dataproposi).then(async function (e) {
					// 							//ini untuk proposional kan utang per tindakan
					// 						})
					// 					})

					// 					$scope.isRouteLoading = false;
									

					// 			})
					// }
				}

				$scope.finalInacbg = async function (params) {
					var dt1 = {}
					var dt2 = []
						// if($scope.itemPopUp.statusklaim !='Grouping iDRG Final'){

							dt1 = {
								"metadata": {
									"method": "inacbg_grouper_final"
								},
								"data": {
									"nomor_sep": $scope.itemPopUp.nomor_sep
								}
							}
						dt2.push(dt1)
						
					// }

					var objData = {
						"data": dt2
					}
					
					await medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then( async function (e) {
						$scope.isRouteLoading = false;
						// LoadData();	
						// console.log(e)
						$scope.saveLogging('Grouper iDRG Final', 'No SEP Pasien', $scope.itemPopUp.nomor_sep,
						'inacbg_grouper_final ' + ' No Registrasi / No RM / No SEP : ' + $scope.itemPopUp.noregistrasi
						+ '/ ' +  $scope.itemPopUp.nocm + ' / '+ $scope.itemPopUp.nomor_sep +' Metadata : inacbg_grouper_final')
						let response = e.data.dataresponse
						let arrStatus =[]
						for (var i = 0; i < response.length; i++) {
							const element = response[i]
							if(element.datarequest.metadata.method == 'inacbg_grouper_final' && element.dataresponse.metadata.code == 200  ){
								arrStatus.push(
									{
										nosep:element.datarequest.data.nomor_sep,
										statusklaim: element.datarequest.metadata.method
									})

							}
						}
						if(arrStatus.length>0){

							for (var i = 0; i < data2.length; i++) {
								const elem = data2[i]
								for (var ii = 0; ii < arrStatus.length; ii++) {
									const elem2 = arrStatus[ii]
									if(elem.nosep == elem2.nosep){
										elem2.norec = elem.norec
									}
								}
							}

							await medifirstService.post('bridging/inacbg/save-status', {'data':arrStatus}).then(  async function (z) {
								if (z.data.status == 201) {
									for (var x = $scope.listStatus.length - 1; x >= 0; x--) {
										const elem =$scope.listStatus[x]
										if(elem.id == z.data.data ){
											$scope.itemPopUp.statusklaim = elem.name
											$scope.updateDataByNorec($scope.itemPopUp.norec, "statusklaim", elem.name);
										}
									}
								}
							})
						}
						// LoadData();	
						
						
						
					},function(error){

						$scope.isRouteLoading = false;
					},function(error){
						$scope.isRouteLoading = false;
					})
				}

			$scope.editUlangInacbg = async function () {
					var dt1 = {}
					var dt2 = []
						if(['Grouping INACBG Final','Klaim Edit'].includes($scope.itemPopUp.statusklaim)){

							dt1 = {
								"metadata": {
									"method": "inacbg_grouper_reedit"
								},
								"data": {
									"nomor_sep": $scope.itemPopUp.nomor_sep
								}
							}
						dt2.push(dt1)
						
					}

					var objData = {
						"data": dt2
					}
					
					await medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then( async function (e) {
						$scope.isRouteLoading = false;
						// LoadData();	
						// console.log(e)
						$scope.saveLogging('Grouper INACBG Final', 'No SEP Pasien', $scope.itemPopUp.nomor_sep,
						'inacbg_grouper_reedit ' + ' No Registrasi / No RM / No SEP : ' + $scope.itemPopUp.noregistrasi
						+ '/ ' +  $scope.itemPopUp.nocm + ' / '+ $scope.itemPopUp.nomor_sep +' Metadata : inacbg_grouper_reedit')
						let response = e.data.dataresponse
						let arrStatus =[]
						for (var i = 0; i < response.length; i++) {
							const element = response[i]
							if(element.datarequest.metadata.method == 'inacbg_grouper_reedit' && element.dataresponse.metadata.code == 200  ){
								arrStatus.push(
									{
										nosep:element.datarequest.data.nomor_sep,
										statusklaim: element.datarequest.metadata.method
									})

							}
						}
						if(arrStatus.length>0){

							for (var i = 0; i < data2.length; i++) {
								const elem = data2[i]
								for (var ii = 0; ii < arrStatus.length; ii++) {
									const elem2 = arrStatus[ii]
									if(elem.nosep == elem2.nosep){
										elem2.norec = elem.norec
									}
								}
							}

							await medifirstService.post('bridging/inacbg/save-status', {'data':arrStatus}).then(  async function (z) {
								if (z.data.status == 201) {
									for (var x = $scope.listStatus.length - 1; x >= 0; x--) {
										const elem =$scope.listStatus[x]
										if(elem.id == z.data.data ){
											$scope.itemPopUp.statusklaim = elem.name
											$scope.updateDataByNorec($scope.itemPopUp.norec, "statusklaim", elem.name);
										}
									}
								}
							})
						}
						// LoadData();	
						
						
						
					},function(error){

						$scope.isRouteLoading = false;
					},function(error){
						$scope.isRouteLoading = false;
					})
			}

			$scope.edit_claim2 = async function () {
					var dt1 = {}
					var dt2 = []
						// if(['Grouping INACBG Final','Klaim Edit'].includes($scope.itemPopUp.statusklaim)){

							dt1 = {
								"metadata": {
									"method": "reedit_claim"
								},
								"data": {
									"nomor_sep": $scope.itemPopUp.nomor_sep
								}
							}
						dt2.push(dt1)
						
					// }

					var objData = {
						"data": dt2
					}
					
					await medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then( async function (e) {
						$scope.isRouteLoading = false;
						// LoadData();	
						// console.log(e)
						$scope.saveLogging('Grouper INACBG Final', 'No SEP Pasien', $scope.itemPopUp.nomor_sep,
						'reedit_claim ' + ' No Registrasi / No RM / No SEP : ' + $scope.itemPopUp.noregistrasi
						+ '/ ' +  $scope.itemPopUp.nocm + ' / '+ $scope.itemPopUp.nomor_sep +' Metadata : reedit_claim')
						let response = e.data.dataresponse
						let arrStatus =[]
						for (var i = 0; i < response.length; i++) {
							const element = response[i]
							if(element.datarequest.metadata.method == 'reedit_claim' && element.dataresponse.metadata.code == 200  ){
								arrStatus.push(
									{
										nosep:element.datarequest.data.nomor_sep,
										statusklaim: element.datarequest.metadata.method
									})

							}
						}
						if(arrStatus.length>0){

							for (var i = 0; i < data2.length; i++) {
								const elem = data2[i]
								for (var ii = 0; ii < arrStatus.length; ii++) {
									const elem2 = arrStatus[ii]
									if(elem.nosep == elem2.nosep){
										elem2.norec = elem.norec
									}
								}
							}

							await medifirstService.post('bridging/inacbg/save-status', {'data':arrStatus}).then(  async function (z) {
								if (z.data.status == 201) {
									for (var x = $scope.listStatus.length - 1; x >= 0; x--) {
										const elem =$scope.listStatus[x]
										if(elem.id == z.data.data ){
											$scope.itemPopUp.statusklaim = elem.name
											$scope.updateDataByNorec($scope.itemPopUp.norec, "statusklaim", elem.name);
										}
									}
								}
							})
						}
						// LoadData();	
						
						
						
					},function(error){

						$scope.isRouteLoading = false;
					},function(error){
						$scope.isRouteLoading = false;
					})
			}

			$scope.simpanTopUp = async function (params) {
				var cmg = "";
				if ($scope.item.specialprocedure) {
					if (cmg != "") {
						cmg = cmg + '#' + $scope.item.specialprocedure.code
					} else {
						cmg = $scope.item.specialprocedure.code
					}
				}
				if ($scope.item.specialprosthesis) {
					if (cmg != "") {
						cmg = cmg + '#' + $scope.item.specialprosthesis.code
					} else {
						cmg = $scope.item.specialprosthesis.code
					}
				}
				if ($scope.item.specialinvestigation) {
					if (cmg != "") {
						cmg = cmg + '#' + $scope.item.specialinvestigation.code
					} else {
						cmg = $scope.item.specialinvestigation.code
					}
				}
				if ($scope.item.specialdrug) {
					if (cmg != "") {
						cmg = cmg + '#' + $scope.item.specialdrug.code
					} else {
						cmg = $scope.item.specialdrug.code
					}
				}
				var dt1 = {}
				var dt2 = []

				dt1 = {
					"metadata": {
						"method": "grouper",
						"stage": "2",
						"grouper": "inacbg"
					},
					"data": {
						"nomor_sep": $scope.itemPopUp.nosep,
						"special_cmg": cmg//"ambil dari table hasil grouper 1"   
					}
				}
				dt2.push(dt1)

				if (cmg == '') {
					return
				}



				var objData = {
					"data": dt2
				}
				var totaldijamin = "";
				var totaldijamina = "";
				var biayanaikkelas = "0";
				var hakkelas = "";
				var cmglength = [];
				$scope.isRouteLoading = true;
				medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
					$scope.isRouteLoading = false;
					// simpan response ke database
					responData = e.data.dataresponse;
					$scope.itemPopUp.response = e.data.dataresponse[0].dataresponse
					toastr.info(responData[0].dataresponse.metadata.message, 'INACBG');
					toastr.info(responData[0].dataresponse.response_inacbg.cbg.description, 'INACBG');
					if(responData[0].dataresponse.response_inacbg.special_cmg)
						cmglength = responData[0].dataresponse.response_inacbg.special_cmg
					// if(dataSave[0].jenis_rawat==2){
					if ($scope.itemPopUp.deptid != 16) {
						// totaldijamin = parseFloat(responData[0].dataresponse.special_cmg.tarif_inacbg)
						for (let i = 0; i < cmglength.length; i++) {
							const element = cmglength[i];
							if (element.type == 'Special Drug') {
								if (totaldijamina != "") {
									totaldijamina = totaldijamina + element.tariff
								} else {
									totaldijamina = element.tariff
								}
							}
							if (element.type == 'Special Procedure') {
								if (totaldijamina != "") {
									totaldijamina = totaldijamina + element.tariff
								} else {
									totaldijamina = element.tariff
								}
							}
							if (element.type == 'Special Prosthesis') {
								if (totaldijamina != "") {
									totaldijamina = totaldijamina + element.tariff
								} else {
									totaldijamina = element.tariff
								}
							}
							if (element.type == 'Special Investigation') {
								if (totaldijamina != "") {
									totaldijamina = totaldijamina + element.tariff
								} else {
									totaldijamina = element.tariff
								}
							}
						}
						// totaldijamina = responData[0].dataresponse.special_cmg.tarif_sd
						// totaldijamin = totaldijamin + totaldijamina
					} else {
						hakkelas = responData[0].dataresponse.response_inacbg.kelas
						// if($scope.dataPasienSelected.namakelas!=$scope.dataPasienSelected.namakelasdaftar){
						// 	biayanaikkelas=responData[0].dataresponse.response_inacbg.add_payment_amt
						// }

						biayanaikkelas = Number($scope.itemPopUp.biayanaikkelas)
						// biayanaikkelas=biayanaikkelas.toFixed(0);
						if (hakkelas == "kelas_1") {
							for (let i = 0; i < cmglength.length; i++) {
								const element = cmglength[i];
								if (element.type == 'Special Drug') {
									if (totaldijamina != "") {
										totaldijamina = totaldijamina + element.tariff
									} else {
										totaldijamina = element.tariff
									}
								}
								if (element.type == 'Special Procedure') {
									if (totaldijamina != "") {
										totaldijamina = totaldijamina + element.tariff
									} else {
										totaldijamina = element.tariff
									}
								}
								if (element.type == 'Special Prosthesis') {
									if (totaldijamina != "") {
										totaldijamina = totaldijamina + element.tariff
									} else {
										totaldijamina = element.tariff
									}
								}
								if (element.type == 'Special Investigation') {
									if (totaldijamina != "") {
										totaldijamina = totaldijamina + element.tariff
									} else {
										totaldijamina = element.tariff
									}
								}
							}
							// totaldijamin = parseFloat(responData[0].dataresponse.tarif_alt[0].tarif_inacbg)
							// totaldijamin = totaldijamin + totaldijamina
						} else if (hakkelas == "kelas_2") {
							for (let i = 0; i < cmglength.length; i++) {
								const element = cmglength[i];
								if (element.type == 'Special Drug') {
									if (totaldijamina != "") {
										totaldijamina = totaldijamina + element.tariff
									} else {
										totaldijamina = element.tariff
									}
								}
								if (element.type == 'Special Procedure') {
									if (totaldijamina != "") {
										totaldijamina = totaldijamina + element.tariff
									} else {
										totaldijamina = element.tariff
									}
								}
								if (element.type == 'Special Prosthesis') {
									if (totaldijamina != "") {
										totaldijamina = totaldijamina + element.tariff
									} else {
										totaldijamina = element.tariff
									}
								}
								if (element.type == 'Special Investigation') {
									if (totaldijamina != "") {
										totaldijamina = totaldijamina + element.tariff
									} else {
										totaldijamina = element.tariff
									}
								}
							}
							// totaldijamin = parseFloat(responData[0].dataresponse.tarif_alt[1].tarif_inacbg)
							// totaldijamin = totaldijamin + totaldijamina
						} else if (hakkelas == "kelas_3") {
							for (let i = 0; i < cmglength.length; i++) {
								const element = cmglength[i];
								if (element.type == 'Special Drug') {
									if (totaldijamina != "") {
										totaldijamina = totaldijamina + element.tariff
									} else {
										totaldijamina = element.tariff
									}
								}
								if (element.type == 'Special Procedure') {
									if (totaldijamina != "") {
										totaldijamina = totaldijamina + element.tariff
									} else {
										totaldijamina = element.tariff
									}
								}
								if (element.type == 'Special Prosthesis') {
									if (totaldijamina != "") {
										totaldijamina = totaldijamina + element.tariff
									} else {
										totaldijamina = element.tariff
									}
								}
								if (element.type == 'Special Investigation') {
									if (totaldijamina != "") {
										totaldijamina = totaldijamina + element.tariff
									} else {
										totaldijamina = element.tariff
									}
								}
							}
							// totaldijamin = parseFloat(responData[0].dataresponse.special_cmg.tarif_inacbg)
							// totaldijamin = totaldijamin + totaldijamina
						}
					}
					var dataproposi = {
						"noregistrasifk": $scope.itemPopUp.norec,
						"totalDijamin": $scope.itemPopUp.response.response_inacbg.tariff,
						"biayaNaikkelas": biayanaikkelas,
						"response": responData[0].dataresponse,
						"special_cmg": cmg,
					}
					$scope.isRouteLoading = true;
					medifirstService.post('bridging/inacbg/save-proposi-bridging-inacbg', dataproposi).then(function (e) {
						$scope.isRouteLoading = false;
						$scope.updateDataByNorec($scope.itemPopUp.norec, "totalpiutangpenjamin", $scope.itemPopUp.response.response_inacbg.tariff);
						$scope.updateDataByNorec($scope.itemPopUp.norec, "response", $scope.itemPopUp.response);
						$scope.updateDataByNorec($scope.itemPopUp.norec, "special_cmg", cmg);
						
					})
					
				})
			}

			$scope.checkDiagnosaIm = function(e) {
				if (!$scope.item.jenisDiagnosisIdrg) {
					toastr.error('Jenis diagonsa belum diisi!', 'PERINGATAN')
					return
				}

				if ($scope.item.jenisDiagnosisIdrg.id == 15) {
					$scope.isRouteLoading = true
					medifirstService.get(`registrasi/daftar-registrasi/get-diagnosa-10-im-by-kode?kddiagnosa=${e.kdDiagnosa}`)
						.then(function (resp) {
							$scope.isRouteLoading = false
							let data = resp.data.diagnosa
							if (data !== null) {
								if (data.validcode === false) {
									toastr.warning(`Diagnosa ${data.kddiagnosa} - ${data.namadiagnosa} tidak bisa dijadikan primary`, 'Peringatan')
									delete $scope.item.diagnosisPrimerIdrg
									return
								}

								if (data.accpdx === 'N') {
									toastr.warning(`Diagnosa ${data.kddiagnosa} - ${data.namadiagnosa} tidak bisa dijadikan primary`, 'Peringatan')
									delete $scope.item.diagnosisPrimerIdrg
									return
								}
							} 
						})
						.catch((error) => {
								$scope.isRouteLoading = false
						});
				}
			}

			$scope.checkDiagnosaTindakanIm = function(e) {
				if ($scope.listGridDiagnosaIdrgTd._data.length === 0) {
					$scope.isRouteLoading = true
					medifirstService.get(`registrasi/daftar-registrasi/get-diagnosa-9-im-by-kode?kddiagnosatindakan=${e.kdDiagnosaTindakan}`)
						.then(function (resp) {
							$scope.isRouteLoading = false
							let data = resp.data.diagnosatindakan
							if (data !== null) {
								if (data.validcode === false) {
									toastr.warning(`Diagnosa ${data.kddiagnosatindakan} - ${data.namadiagnosatindakan} tidak bisa dijadikan primary`, 'Peringatan')
									delete $scope.item.diagnosisPrimerIdrg
									return
								}
	
								if (data.accpdx === 'N') {
									toastr.warning(`Diagnosa ${data.kddiagnosatindakan} - ${data.namadiagnosatindakan} tidak bisa dijadikan primary`, 'Peringatan')
									delete $scope.item.diagnosisPrimerIdrg
									return
								}
							} 
						})
						.catch((error) => {
								$scope.isRouteLoading = false
						});
				}
			}

			$scope.ringkasanRajal = function(){
				if ($scope.dataPasienSelected == undefined) {
					toastr.error('Pilih data dulu!')
					return
				}
				if ($scope.dataPasienSelected.deptid == 16){
					toastr.error('Pasien dari Ranap')
					return
				}
				// if ($scope.item.obj[3003998] != undefined) {
				//     $scope.listPegawai.add($scope.item.obj[3003998])
				//     $scope.item.pegawai = $scope.item.obj[3003998]
				// }
				// if (pegawai == undefined) {
				//     return
				// }
				var local = JSON.parse(localStorage.getItem('profile'))
				var nama = medifirstService.getPegawaiLogin().namaLengkap

				window.open(configuration.baseApiBackend + 'report/cetak-monitoringjamkes?nocm=' + $scope.dataPasienSelected.nocm +
					'&norec_pd=' + $scope.dataPasienSelected.norec +
					// '&emr=' + norecEMR +
					// '&emrfk=' + $scope.cc.emrfk +
					'&kdprofile=' + local.id +
					'&nama=' + nama +
					// '&isttd=true' +
					// '&pegawaittd=' + pegawai.value +
					'&noregistrasi=' + $scope.dataPasienSelected.noregistrasi, '_blank');
			}

			$scope.ringkasanRajalPerawat = function(){
				if ($scope.dataPasienSelected == undefined) {
					toastr.error('Pilih data dulu!')
					return
				}
				if ($scope.dataPasienSelected.deptid == 16){
					toastr.error('Pasien dari Ranap')
					return
				}
				// if ($scope.item.obj[3003998] != undefined) {
				//     $scope.listPegawai.add($scope.item.obj[3003998])
				//     $scope.item.pegawai = $scope.item.obj[3003998]
				// }
				// if (pegawai == undefined) {
				//     return
				// }
				var local = JSON.parse(localStorage.getItem('profile'))
				var nama = medifirstService.getPegawaiLogin().namaLengkap

				window.open(configuration.baseApiBackend + 'report/cetak-monitoringjamkes-perawat?nocm=' + $scope.dataPasienSelected.nocm +
					'&norec_pd=' + $scope.dataPasienSelected.norec +
					// '&emr=' + norecEMR +
					// '&emrfk=' + $scope.cc.emrfk +
					'&kdprofile=' + local.id +
					'&nama=' + nama +
					// '&isttd=true' +
					// '&pegawaittd=' + pegawai.value +
					'&noregistrasi=' + $scope.dataPasienSelected.noregistrasi, '_blank');
			}

			// END ################

		}
	]);
});