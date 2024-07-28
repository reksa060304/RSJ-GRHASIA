define(['initialize', 'Configuration'], function (initialize,configuration) {
	'use strict';
	    var baseTransaksi = configuration.baseApiBackend;
	initialize.controller('HistoriEMRCtrl', ['$mdDialog', '$timeout', '$state', '$q', '$rootScope', '$scope', 'CacheHelper', 'DateHelper', 'MedifirstService',
		function ($mdDialog, $timeout, $state, $q, $rootScope, $scope, cacheHelper, dateHelper, medifirstService) {

			$scope.dataVOloaded = true;
			$scope.now = new Date();
			$scope.item = {};
			$scope.itemPopUp={};
			$scope.dataSelected = {};
            $scope.dataSelected1 = {};
			$scope.dataExpRad = {};
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
			$scope.importIcd9 = {};
			$scope.grupingtab = false;
			$scope.itemres ={};
			$scope.ventilator = false
			$scope.inap = false
			$scope.pasientb = false
			$scope.pasienapgar = false			
			$scope.isInu = true			
			var responData = "";
			var data2 = []
			var dataSave = []
			var dataSEPCMG = []
			var dataRow = {}
			let coderNIK = ''
			$scope.show_btn = true
			$scope.showBeratLhair = false
			$scope.listStatus = [
				{id:'new_claim',name:'Klaim'},
				{id:'grouper',name:'Grouping'},
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
					
					$scope.sourceJenisDiagnosisPrimer1 = [
						{id:'8',jenisDiagnosa:'Primary / utama INAcbg'},
						{id:'9',jenisDiagnosa:'Secondary INAcbg'},
					];
					$scope.sourceJenisDiagnosisPrimer2 = [
						{id:'10',jenisDiagnosa:'Primary / utama INA Grouper'},
						{id:'11',jenisDiagnosa:'Secondary INA Grouper'},
					];
					$scope.item.jenisDiagnosis = {id: 8, jenisDiagnosa: "Primary / utama INAcbg"}
					// $scope.sourceJenisDiagnosisPrimer1 = data.data.jenisdiagnosa;
				})
				medifirstService.getPart("registrasi/daftar-registrasi/get-data-diagnosa", true, true, 10).then(function (data) {
					$scope.sourceDiagnosisPrimer = data;
				});
				medifirstService.getPart("registrasi/get-icd-9", true, true, 10).then(function (data) {
					$scope.sourceDiagnosisPrimer1 = data;
				});
				// $scope.listStatus = manageKasir.getStatus();
			}

			$scope.saveLogging = function (jenis, referensi, noreff, ket) {
				medifirstService.get("sysadmin/logging/save-log-all?jenislog=" + jenis
					+ "&referensi=" + referensi
					+ "&noreff=" + noreff
					+ "&keterangan=" + ket
				).then(function (data) {

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
				$('td').each(function () {

					if ($(this).text() == 'unverifikasi') { $(this).addClass('tomat') }
					if ($(this).text() == 'false') { $(this).text('Belum di Coder') }
					if ($(this).text() == 'Belum di Coder') { $(this).addClass('coder') }
					if ($(this).text() == '-1') { $(this).text('Belum di Grouping') }
					if ($(this).text() == 'Belum di Grouping') { $(this).addClass('red') }
					if ($(this).text() == 'Klaim') { $(this).addClass('green') }
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
							"width": "50px",
							"template": "<span class='style-left'>{{formatTanggal('#: tglregistrasi #')}}</span>"
						},
						{
							"field": "noregistrasi",
							"title": "NoReg",
							"width": "50px"
						},
						{
							"field": "nocm",
							"title": "NoRM",
							"width": "50px",
							"template": "<span class='style-center'>#: nocm #</span>"
						},
						{
							"field": "namapasien",
							"title": "Nama Pasien",
							"width": "50px",
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
							"width": "50px",
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
							"width": "50px",
							"template": "<span class='style-left'>{{formatTanggal('#: tglpulang #')}}</span>"
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
						// {
						// 	"field": "nosep",
						// 	"title": "No SEP",
						// 	"width": "50px",
						// 	"template": '# if( nosep==null) {# - # } else {# #= nosep # #} #'
						// },

						// {
						// 	"field": "namakelas",
						// 	"title": "Kelas Dijamin",
						// 	"width": "50px",
						// 	"template": '# if( namakelas==null) {# - # } else {# #= namakelas # #} #'
						// }
						// ,
						// {
						// 	"field": "totalpiutangpenjamin",
						// 	"title": "Total Grouping",
						// 	"width": "50px"
						// },
						// {
						// 	"field": "totalbiayars",
						// 	"title": "Tarif Rs",
						// 	"width": "50px",
						// 	"template": "<span class='style-right'>{{formatRupiah('#: totalbiayars #', 'Rp.')}}</span>",
						// },
						// {
						// 	"field": "biayanaikkelas",
						// 	"title": "Biaya Naik Kelas",
						// 	"width": "50px"
						// },
						// {
						// 	"field": "namakelasdaftar",
						// 	"title": "Kelas Terakhir",
						// 	"width": "50px"
						// },
						{
							"field": "icd10",
							"title": "Diagnosa Utama dan Sekunder",
							"width": "50px"
						},
						// {
						// 	"field": "status",
						// 	"title": "Status Berkas",
						// 	"width": "50px"
						// },
						// {
						// 	"field": "statusklaim",
						// 	"title": "Status ",
						// 	"width": "50px"
						// },
						{
							"field": "hitungdok",
							"title": "Dokumen",
							"width": "50px"
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
						// {
						// 	"field": "pegawaifinalklaim",
						// 	"title": "Pegawai Klaim",
						// 	"width": "50px"
						// 	// "template": '# if( statuskelengkapandok==true) {# Sudah Lengkap # } else {# - #} #'
						// },
						// {
						// 	"field": "tglklaim",
						// 	"title": "Tgl Klaim",
						// 	"width": "50px",
						// 	"template": "<span class='style-left'>{{formatTanggal('#: tglklaim #')}}</span>"
						// },
						// {
						// 	"field": "pegeditklaim",
						// 	"title": "Pegawai Edit",
						// 	"width": "50px"
						// 	// "template": '# if( statuskelengkapandok==true) {# Sudah Lengkap # } else {# - #} #'
						// },
						// {
						// 	"field": "tgledit",
						// 	"title": "Tgl Edit",
						// 	"width": "50px",
						// 	"template": "<span class='style-left'>{{formatTanggal('#: tgledit #')}}</span>"
						// },
						
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
					// 'tarif_rs = ' + data.tarif_rs + '\n' +
					'episodes = ' + data.loscovid + '\n' + 
					'tarif_poli_eks = ' + 0 + "\n" +
					'nama_dokter = ' + data.namadokter + "\n" +
					'kode_tarif = ' + 'BP' + "\n" +
					'payor_id = ' + '3' + "\n" +
					'payor_cd = ' + 'JKN' + "\n" +
					'cob_cd = ' + '#' + "\n" +
					'coder_nik = ' + data.codernik

						// $scope.listTarifRS =[
						// 	{namatarif:'Prosedur Non Bedah' ,tarif:data.tarif_rs.prosedur_non_bedah},
						// 	{namatarif:'Tenaga Ahli' ,tarif:data.tarif_rs.tenaga_ahli},
						// 	{namatarif:'Radiologi' ,tarif:data.tarif_rs.radiologi},
						// 	{namatarif:'Rehabilitasi' ,tarif:data.tarif_rs.rehabilitasi},
						// 	{namatarif:'Obat' ,tarif:data.tarif_rs.obat},
						// 	{namatarif:'Alkes' ,tarif:data.tarif_rs.alkes},
						// 	{namatarif:'Prosedur Bedah' ,tarif:data.tarif_rs.prosedur_bedah},
						// 	{namatarif:'Keperawatan' ,tarif:data.tarif_rs.keperawatan},
						// 	{namatarif:'Laboratorium' ,tarif:data.tarif_rs.laboratorium},
						// 	{namatarif:'Kamar/Akomodasi' ,tarif:data.tarif_rs.kamar},
						// 	{namatarif:'Obat Kronis' ,tarif:data.tarif_rs.obat_kronis},
						// 	{namatarif:'BMHP' ,tarif:data.tarif_rs.bmhp},
						// 	{namatarif:'Konsultasi' ,tarif:data.tarif_rs.konsultasi},
						// 	{namatarif:'Penunjang' ,tarif:data.tarif_rs.penunjang},					//
						// 	{namatarif:'Pelayanan Darah' ,tarif:data.tarif_rs.pelayanan_darah},
						// 	{namatarif:'Rawat Intensif' ,tarif:data.tarif_rs.rawat_intensif},
						// 	{namatarif:'Obat Kemoterapi' ,tarif:data.tarif_rs.obat_kemoterapi},
						// 	{namatarif:'Sewa Alat' ,tarif:data.tarif_rs.sewa_alat}
						// ]
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
							// "tarif_rs": {
							// 	"prosedur_non_bedah": data2[i].tarif_rs.prosedur_non_bedah,    //"300000",      
							// 	"prosedur_bedah": data2[i].tarif_rs.prosedur_bedah,    //"20000000",      
							// 	"konsultasi": data2[i].tarif_rs.konsultasi,    //"300000",      
							// 	"tenaga_ahli": data2[i].tarif_rs.tenaga_ahli,    //"200000",      
							// 	"keperawatan": data2[i].tarif_rs.keperawatan,    // "80000",      
							// 	"penunjang": data2[i].tarif_rs.penunjang,    //"1000000",      
							// 	"radiologi": data2[i].tarif_rs.radiologi,    //"500000",      
							// 	"laboratorium": data2[i].tarif_rs.laboratorium,    //"600000",      
							// 	"pelayanan_darah": data2[i].tarif_rs.pelayanan_darah,    //"150000",      
							// 	"rehabilitasi": data2[i].tarif_rs.rehabilitasi,    //"100000",      
							// 	"kamar": data2[i].tarif_rs.kamar,    //"6000000",      
							// 	"rawat_intensif": data2[i].tarif_rs.rawat_intensif,    //"2500000",      
							// 	"obat": data2[i].tarif_rs.obat,    //"2000000",      
							// 	"obat_kronis": data2[i].tarif_rs.obat_kronis,    //"2000000",      
							// 	"obat_kemoterapi": data2[i].tarif_rs.obat_kemoterapi,    //"2000000",      
							// 	"alkes": data2[i].tarif_rs.alkes,    //"500000",      
							// 	"bmhp": data2[i].tarif_rs.bmhp,    //"400000",      
							// 	"sewa_alat": data2[i].tarif_rs.sewa_alat,    //"210000"    
							// },
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
							// "tarif_rs": {
							// 	"prosedur_non_bedah": data2[i].tarif_rs.prosedur_non_bedah,    //"300000",      
							// 	"prosedur_bedah": data2[i].tarif_rs.prosedur_bedah,    //"20000000",      
							// 	"konsultasi": data2[i].tarif_rs.konsultasi,    //"300000",      
							// 	"tenaga_ahli": data2[i].tarif_rs.tenaga_ahli,    //"200000",      
							// 	"keperawatan": data2[i].tarif_rs.keperawatan,    // "80000",      
							// 	"penunjang": data2[i].tarif_rs.penunjang,    //"1000000",      
							// 	"radiologi": data2[i].tarif_rs.radiologi,    //"500000",      
							// 	"laboratorium": data2[i].tarif_rs.laboratorium,    //"600000",      
							// 	"pelayanan_darah": data2[i].tarif_rs.pelayanan_darah,    //"150000",      
							// 	"rehabilitasi": data2[i].tarif_rs.rehabilitasi,    //"100000",      
							// 	"kamar": data2[i].tarif_rs.kamar,    //"6000000",      
							// 	"rawat_intensif": data2[i].tarif_rs.rawat_intensif,    //"2500000",      
							// 	"obat": data2[i].tarif_rs.obat,    //"2000000",      
							// 	"obat_kronis": data2[i].tarif_rs.obat_kronis,    //"2000000",      
							// 	"obat_kemoterapi": data2[i].tarif_rs.obat_kemoterapi,    //"2000000",      
							// 	"alkes": data2[i].tarif_rs.alkes,    //"500000",      
							// 	"bmhp": data2[i].tarif_rs.bmhp,    //"400000",      
							// 	"sewa_alat": data2[i].tarif_rs.sewa_alat,    //"210000"    
							// },
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
			function loadData() {
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
					medifirstService.get("registrasi/get-histori-emr?" +
						"tglAwal=" + tglAwal +
						"&tglAkhir=" + tglAkhir +
						reg + rm + sep + nm + ins + rg + kp + dk + isPulang
						+ '&jmlRows=' + jmlRows
						+'&status='+status +'&param=1'),
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
							// "tarif_rs": {
							// 	"prosedur_non_bedah": data2[i].tarif_rs.prosedur_non_bedah,    //"300000",      
							// 	"prosedur_bedah": data2[i].tarif_rs.prosedur_bedah,    //"20000000",      
							// 	"konsultasi": data2[i].tarif_rs.konsultasi,    //"300000",      
							// 	"tenaga_ahli": data2[i].tarif_rs.tenaga_ahli,    //"200000",      
							// 	"keperawatan": data2[i].tarif_rs.keperawatan,    // "80000",      
							// 	"penunjang": data2[i].tarif_rs.penunjang,    //"1000000",      
							// 	"radiologi": data2[i].tarif_rs.radiologi,    //"500000",      
							// 	"laboratorium": data2[i].tarif_rs.laboratorium,    //"600000",      
							// 	"pelayanan_darah": data2[i].tarif_rs.pelayanan_darah,    //"150000",      
							// 	"rehabilitasi": data2[i].tarif_rs.rehabilitasi,    //"100000",      
							// 	"kamar": data2[i].tarif_rs.kamar,    //"6000000",      
							// 	"rawat_intensif": data2[i].tarif_rs.rawat_intensif,    //"2500000",      
							// 	"obat": data2[i].tarif_rs.obat,    //"2000000",      
							// 	"obat_kronis": data2[i].tarif_rs.obat_kronis,    //"2000000",      
							// 	"obat_kemoterapi": data2[i].tarif_rs.obat_kemoterapi,    //"2000000",      
							// 	"alkes": data2[i].tarif_rs.alkes,    //"500000",      
							// 	"bmhp": data2[i].tarif_rs.bmhp,    //"400000",      
							// 	"sewa_alat": data2[i].tarif_rs.sewa_alat,    //"210000"    
							// },
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
										'shk_spesimen_ambil': 'tidak',
										'shk_alasan': 'tidak-dapat',
										'shk_lokasi': '',
										'shk_spesimen_dttm': '',
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
					medifirstService.get("registrasi/get-histori-emr?" +
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
							// "tarif_rs": {
							// 	"prosedur_non_bedah": data2[i].tarif_rs.prosedur_non_bedah,    //"300000",      
							// 	"prosedur_bedah": data2[i].tarif_rs.prosedur_bedah,    //"20000000",      
							// 	"konsultasi": data2[i].tarif_rs.konsultasi,    //"300000",      
							// 	"tenaga_ahli": data2[i].tarif_rs.tenaga_ahli,    //"200000",      
							// 	"keperawatan": data2[i].tarif_rs.keperawatan,    // "80000",      
							// 	"penunjang": data2[i].tarif_rs.penunjang,    //"1000000",      
							// 	"radiologi": data2[i].tarif_rs.radiologi,    //"500000",      
							// 	"laboratorium": data2[i].tarif_rs.laboratorium,    //"600000",      
							// 	"pelayanan_darah": data2[i].tarif_rs.pelayanan_darah,    //"150000",      
							// 	"rehabilitasi": data2[i].tarif_rs.rehabilitasi,    //"100000",      
							// 	"kamar": data2[i].tarif_rs.kamar,    //"6000000",      
							// 	"rawat_intensif": data2[i].tarif_rs.rawat_intensif,    //"2500000",      
							// 	"obat": data2[i].tarif_rs.obat,    //"2000000",      
							// 	"obat_kronis": data2[i].tarif_rs.obat_kronis,    //"2000000",      
							// 	"obat_kemoterapi": data2[i].tarif_rs.obat_kemoterapi,    //"2000000",      
							// 	"alkes": data2[i].tarif_rs.alkes,    //"500000",      
							// 	"bmhp": data2[i].tarif_rs.bmhp,    //"400000",      
							// 	"sewa_alat": data2[i].tarif_rs.sewa_alat,    //"210000"    
							// },
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
										'shk_spesimen_ambil': 'tidak',
										'shk_alasan': 'tidak-dapat',
										'shk_lokasi': '',
										'shk_spesimen_dttm': '',
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
								// "tarif_rs": {
								// 	"prosedur_non_bedah": dataSave[i].tarif_rs.prosedur_non_bedah,    //"300000",      
								// 	"prosedur_bedah": dataSave[i].tarif_rs.prosedur_bedah,    //"20000000",      
								// 	"konsultasi": dataSave[i].tarif_rs.konsultasi,    //"300000",      
								// 	"tenaga_ahli": dataSave[i].tarif_rs.tenaga_ahli,    //"200000",      
								// 	"keperawatan": dataSave[i].tarif_rs.keperawatan,    // "80000",      
								// 	"penunjang": dataSave[i].tarif_rs.penunjang,    //"1000000",      
								// 	"radiologi": dataSave[i].tarif_rs.radiologi,    //"500000",      
								// 	"laboratorium": dataSave[i].tarif_rs.laboratorium,    //"600000",      
								// 	"pelayanan_darah": dataSave[i].tarif_rs.pelayanan_darah,    //"150000",      
								// 	"rehabilitasi": dataSave[i].tarif_rs.rehabilitasi,    //"100000",      
								// 	"kamar": dataSave[i].tarif_rs.kamar,    //"6000000",      
								// 	"rawat_intensif": dataSave[i].tarif_rs.rawat_intensif,    //"2500000",      
								// 	"obat": dataSave[i].tarif_rs.obat,    //"2000000",  
								// 	"obat_kronis": "0",
								// 	"obat_kemoterapi": "0",
								// 	"alkes": dataSave[i].tarif_rs.alkes,    //"500000",      
								// 	"bmhp": dataSave[i].tarif_rs.bmhp,    //"400000",      
								// 	"sewa_alat": dataSave[i].tarif_rs.sewa_alat,    //"210000"    
								// },
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
			$scope.grouping2 = function () {
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
					$scope.lanjutgrouping2();
				}
			}
			$scope.lanjutgrouping2 = function () {
				$scope.isRouteLoading = true;
				$scope.grupingtab = true
				if ($scope.dataPasienSelected.deptid != 16) {
					var dt1 = {}
					var dt2 = []
					

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
						medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
							// simpan response ke database
							// savelogging
							$scope.saveLogging('Grouping Klaim', 'No SEP Pasien', e.data.dataresponse[0].datarequest.data.nomor_sep,
							'Grouping Klaim ' + ' No Registrasi / No RM / No SEP : ' + $scope.dataPasienSelected.noregistrasi
								+ '/ ' +  $scope.dataPasienSelected.nocm + ' / '+  e.data.dataresponse[0].datarequest.data.nomor_sep +' Metadata : ' +  e.data.dataresponse[0].datarequest.metadata.method)

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

								medifirstService.post('bridging/inacbg/save-status', {'data':arrStatus}).then(function (z) {
									
								})
								var dataSave = {
									'namapegawai': $scope.user.namaLengkap,
									'param': 'grouper',
									'norec': $scope.dataPasienSelected.norec
								}
								medifirstService.post('bridging/inacbg/save-pegawai', dataSave).then(function (e) {
								})
							}
							//end status
							
							if (responData[0].dataresponse.response.cbg.description == "ERROR: MALE WITH GROUPING CRITERIA NOT MET") {
								toastr.info('JENIS KELAMIN SALAH ATAU DIAGNOSA TIDAK SESUAI JENIS KELAMIN', 'INACBG');
							}
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
								"biayaNaikkelas": biayanaikkelas,
								"response": responData[0].dataresponse,
							}
							medifirstService.post('bridging/inacbg/save-proposi-bridging-inacbg', dataproposi).then(function (e) {
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
					var	datass =[{ noreg:  $scope.dataPasienSelected.norec,
								   namakelas:  $scope.dataPasienSelected.namakelas, 
								   nosep:  $scope.dataPasienSelected.nosep,
								   deptid:  $scope.dataPasienSelected.deptid }]
					medifirstService.postNonMessage('bridging/inacbg/get-daftar-pasien-statusnaikkelas?noreg=' + $scope.dataPasienSelected.norec
						+ '&namakelas=' + $scope.dataPasienSelected.namakelas,{'data':datass}).then(function (e) {
							var resp = e.data[0];
							var dt1 = {}
							var dt2 = []

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
								var top_up_jenazah = "";
								medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
									// simpan response ke database
									$scope.saveLogging('Grouping Klaim', 'No SEP Pasien', e.data.dataresponse[0].datarequest.data.nomor_sep,
								'Grouping Klaim ' + ' No Registrasi / No RM / No SEP : ' + $scope.dataPasienSelected.noregistrasi
								+ '/ ' +  $scope.dataPasienSelected.nocm + ' / '+  e.data.dataresponse[0].datarequest.data.nomor_sep +' Metadata : ' +  e.data.dataresponse[0].datarequest.metadata.method)
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

										medifirstService.post('bridging/inacbg/save-status', {'data':arrStatus}).then(function (z) {
											
										})
										var dataSave = {
											'namapegawai': $scope.user.namaLengkap,
											'param': 'grouper',
											'norec': $scope.dataPasienSelected.norec
										}
										medifirstService.post('bridging/inacbg/save-pegawai', dataSave).then(function (e) {
										})
									}

									// if(dataSave[0].jenis_rawat==2){
									if ($scope.dataPasienSelected.deptid == 16) {
										totaldijamin = responData[0].dataresponse.tarif_alt[2].tarif_inacbg
									} else if ($scope.dataPasienSelected.statuscovid === true) {
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
										"noregistrasifk": $scope.dataPasienSelected.norec,
										"totalDijamin": totaldijamin,
										"biayaNaikkelas": biayanaikkelas,
										"response": responData[0].dataresponse,
									}
									medifirstService.post('bridging/inacbg/save-proposi-bridging-inacbg', dataproposi).then(function (e) {
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
			$scope.new_claim3 = function () {

				$scope.isRouteLoading = true;
				var dt1 = {}
				var dt2 = []
					if($scope.dataPasienSelected.statusklaim== '-'){


					// if (dataSave[i].nomor_sep == $scope.dataPasienSelected.nosep) {
						dt1 = {
							"metadata": {
								"method": "new_claim"
							},
							"data": {
								"nomor_kartu": $scope.itemPopUp.nomor_kartu,
								"nomor_sep": $scope.dataPasienSelected.nosep,
								"nomor_rm": $scope.dataPasienSelected.nocm,
								"nama_pasien": $scope.dataPasienSelected.namapasien,
								"tgl_lahir": $scope.dataPasienSelected.tgllahir,
								"gender": $scope.dataPasienSelected.objectjeniskelaminfk
							}
						}
						dt2.push(dt1)
					
					// }
				}

				var objData = {
					"data": dt2
				}
				
				medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
					// LoadData();	
					// console.log(e)
					$scope.saveLogging('New Klaim', 'No SEP Pasien', $scope.itemPopUp.nomor_sep,
					'New Klaim ' + ' No Registrasi / No RM / No SEP : ' + $scope.dataPasienSelected.noregistrasi
					+ '/ ' +  $scope.dataPasienSelected.nocm + ' / '+ $scope.itemPopUp.nomor_sep +' Metadata : new_claim')
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
						})
						var dataSave = {
							'namapegawai': $scope.user.namaLengkap,
							'param': 'kirim',
							'norec': $scope.dataPasienSelected.norec
						}
						medifirstService.post('bridging/inacbg/save-pegawai', dataSave).then(function (e) {
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
			$scope.setdataklaim = function () {
				// console.log('popup sep', $scope.itemPopUp.nomor_sep);
				// debugger
				if($scope.itemPopUp.ventilator){
					$scope.itemPopUp.use_ind = "1"
					var hours = Math.abs($scope.itemPopUp.stop_dttm - $scope.itemPopUp.start_dttm) / 36e5;
					$scope.itemPopUp.ventilator_hour = hours
				} else {
					$scope.itemPopUp.use_ind = "0"
					$scope.itemPopUp.start_dttm = ""
					$scope.itemPopUp.stop_dttm = ""
					$scope.itemPopUp.ventilator_hour = ""
				}

				if($scope.itemPopUp.intensif) {
					$scope.itemPopUp.icu_indikator = "1"
				} else {
					$scope.itemPopUp.icu_indikator = "0"
				}

				$scope.isRouteLoading = true;
				var dt1 = {}
				var dt2 = []
				var jenis_rawat = 1 //ranap
						if ($scope.dataPasienSelected.deptid != 16) {
							jenis_rawat = 2
						}
						var upgrade_class_ind = 0
						var upgrade_class_class = ''
						var add_payment_pct = 0

						if ($scope.dataPasienSelected.nokelasdijamin > $scope.dataPasienSelected.nokelasdaftar && $scope.dataPasienSelected.deptid == 16) {
							upgrade_class_ind = 1
							upgrade_class_class = $scope.dataPasienSelected.namakelasdaftar
							add_payment_pct = 0
						}
				var discharge_status = 0
						if ($scope.dataPasienSelected.objectstatuspulangfk == 1 || $scope.dataPasienSelected.objectstatuspulangfk == 6) {
							discharge_status = 1
						} else if ($scope.dataPasienSelected.objectstatuspulangfk == 4 || $scope.dataPasienSelected.objectstatuspulangfk == 5 || $scope.dataPasienSelected.objectstatuspulangfk == 10 ||
							$scope.dataPasienSelected.objectstatuspulangfk == 11) {
							discharge_status = 2
						} else if ($scope.dataPasienSelected.objectstatuspulangfk == 2 || $scope.dataPasienSelected.objectstatuspulangfk == 8 || $scope.dataPasienSelected.objectstatuspulangfk == 3) {
							discharge_status = 3
						} else if ($scope.dataPasienSelected.objectstatuspulangfk == 9) {
							discharge_status = 4
						} else {
							discharge_status = 5
						}
						if (jenis_rawat == 2) {
							$scope.dataPasienSelected.nokelasdijamin = ''
						}
						var payor_id = '3'
						var payor_cd = 'JKN'
						if ($scope.dataPasienSelected.idrekanan == '2552') {
							payor_id = '3'
							payor_cd = 'JKN'
						} else if ($scope.dataPasienSelected.idrekanan == '581164') {
							payor_id = '5'
							payor_cd = 'JAMKESDA'
							$scope.dataPasienSelected.nosep = $scope.dataPasienSelected.nokepesertaan
						}
				// manageTataRekening.savebridginginacbg(objData).then(function(e){

						// diagnosis
						// ina icd 10
						let dataDiagnosaInaXArray = []
						let dataDiagnosaInaXString = "#"
						if ($scope.listGridDiagnosaUnu.options.data.length > 0) {
							let dataDiagnosaIna = $scope.listGridDiagnosaUnu.options.data
							for (let i = 0; i < dataDiagnosaIna.length; i++) {
								const element = dataDiagnosaIna[i];
								dataDiagnosaInaXArray.push(element.kddiagnosa)
							}
							dataDiagnosaInaXString = dataDiagnosaInaXArray.join("#")
						}

						// ina icd 9
						let dataDiagnosaInaIXArray = []
						let dataDiagnosaInaIXString = "#"
						if ($scope.listGridDiagnosa1Unu.options.data.length > 0) {
							let dataDiagnosaIna = $scope.listGridDiagnosa1Unu.options.data
							for (let i = 0; i < dataDiagnosaIna.length; i++) {
								const element = dataDiagnosaIna[i];
								dataDiagnosaInaIXArray.push(element.kddiagnosatindakan)
							}
							dataDiagnosaInaIXString = dataDiagnosaInaIXArray.join("#")
						}

						// unu icd 10
						let dataDiagnosaUnuXArray = []
						let dataDiagnosaUnuXString = "#"
						if ($scope.listGridDiagnosa.options.data.length > 0) {
							let dataDiagnosaIna = $scope.listGridDiagnosa.options.data
							for (let i = 0; i < dataDiagnosaIna.length; i++) {
								const element = dataDiagnosaIna[i];
								dataDiagnosaUnuXArray.push(element.kddiagnosa)
							}
							dataDiagnosaUnuXString = dataDiagnosaUnuXArray.join("#")
						}

						// unu icd 9
						let dataDiagnosaUnuIXArray = []
						let dataDiagnosaUnuIXString = "#"
						if ($scope.listGridDiagnosa1.options.data.length > 0) {
							let dataDiagnosaIna = $scope.listGridDiagnosa1.options.data
							for (let i = 0; i < dataDiagnosaIna.length; i++) {
								const element = dataDiagnosaIna[i];
								dataDiagnosaUnuIXArray.push(element.kddiagnosatindakan)
							}
							dataDiagnosaUnuIXString = dataDiagnosaUnuIXArray.join("#")
						}
						// end diagnosis
			
						if($scope.dataPasienSelected.nosep != '-'){
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
								"kelas_rawat": $scope.itemPopUp.kelas_rawat,    //"1",    
								"adl_sub_acute": $scope.dataPasienSelected.adl_sub_acute,    //"15",    
								"adl_chronic": $scope.dataPasienSelected.adl_chronic,    //"12",    
								"icu_indikator": $scope.itemPopUp.icu_indikator,    //"1",    
								"icu_los": $scope.itemPopUp.los,    //"2",    
								"ventilator_hour": $scope.itemPopUp.ventilator_hour ,    //"5",    
								"ventilator": {
									"use_ind": $scope.itemPopUp.use_ind,
									"start_dttm": moment($scope.itemPopUp.start_dttm).format('YYYY-MM-DD HH:mm:ss'),
									"stop_dttm":moment( $scope.itemPopUp.stop_dttm).format('YYYY-MM-DD HH:mm:ss'),
								},
								"upgrade_class_ind": $scope.dataPasienSelected.upgrade_class_ind,    //"1",    
								"upgrade_class_class": $scope.dataPasienSelected.upgrade_class_class,    //"vip",    
								"upgrade_class_los": $scope.dataPasienSelected.upgrade_class_los,    //"5",    
								"upgrade_class_payor": $scope.dataPasienSelected.upgrade_class_payor,
								"add_payment_pct": "75",//$scope.dataPasienSelected.add_payment_pct ,    //"35",    
								"birth_weight": $scope.itemPopUp.birth_weight == null? "0": $scope.itemPopUp.birth_weight ,//$scope.dataPasienSelected.beratbadan,//$scope.dataPasienSelected.birth_weight ,    //"0",    
								"sistole": $scope.dataPasienSelected.sistole,
								"diastole": $scope.dataPasienSelected.diastole, 
								"discharge_status": $scope.itemPopUp.discharge_status.id,    //"1",    
								"diagnosa": dataDiagnosaUnuXString,//$scope.itemPopUp.icd10 == null ? '#' : $scope.itemPopUp.icd10,    //"S71.0#A00.1",    
								"procedure": dataDiagnosaUnuIXString, // $scope.itemPopUp.icd9 == null ? '#' : $scope.itemPopUp.icd9,    //"81.52#88.38",    
								"diagnosa_inagrouper": dataDiagnosaInaXString, //$scope.itemPopUp.diagnosa_inagrouper == null ? '#' : $scope.itemPopUp.diagnosa_inagrouper,
								"procedure_inagrouper": dataDiagnosaInaIXString, //$scope.itemPopUp.procedure_inagrouper == null ? '#' : $scope.itemPopUp.procedure_inagrouper,
								// "tarif_rs": {
								// 	"prosedur_non_bedah": $scope.dataPasienSelected.tarif_rs.prosedur_non_bedah,    //"300000",      
								// 	"prosedur_bedah": $scope.dataPasienSelected.tarif_rs.prosedur_bedah,    //"20000000",      
								// 	"konsultasi": $scope.dataPasienSelected.tarif_rs.konsultasi,    //"300000",      
								// 	"tenaga_ahli": $scope.dataPasienSelected.tarif_rs.tenaga_ahli,    //"200000",      
								// 	"keperawatan": $scope.dataPasienSelected.tarif_rs.keperawatan,    // "80000",      
								// 	"penunjang": $scope.dataPasienSelected.tarif_rs.penunjang,    //"1000000",      
								// 	"radiologi": $scope.dataPasienSelected.tarif_rs.radiologi,    //"500000",      
								// 	"laboratorium": $scope.dataPasienSelected.tarif_rs.laboratorium,    //"600000",      
								// 	"pelayanan_darah": $scope.dataPasienSelected.tarif_rs.pelayanan_darah,    //"150000",      
								// 	"rehabilitasi": $scope.dataPasienSelected.tarif_rs.rehabilitasi,    //"100000",      
								// 	"kamar": $scope.dataPasienSelected.tarif_rs.kamar,    //"6000000",      
								// 	"rawat_intensif": $scope.dataPasienSelected.tarif_rs.rawat_intensif,    //"2500000",      
								// 	"obat": $scope.dataPasienSelected.tarif_rs.obat,    //"2000000",  
								// 	"obat_kronis": $scope.dataPasienSelected.tarif_rs.obat_kronis,
								// 	"obat_kemoterapi": $scope.dataPasienSelected.tarif_rs.obat_kemoterapi,
								// 	"alkes": $scope.dataPasienSelected.tarif_rs.alkes,    //"500000",      
								// 	"bmhp": $scope.dataPasienSelected.tarif_rs.bmhp,    //"400000",      
								// 	"sewa_alat": $scope.dataPasienSelected.tarif_rs.sewa_alat,    //"210000"    
								// },
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
								"dializer_single_use": $scope.itemPopUp.dializer_single_use,
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
									"onset_kontraksi": $scope.itemPopUp.onset_kontraksi,// $scope.dataPasienSelected.persalinan.onset_kontraksi,
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
											'shk_spesimen_ambil' : 'tidak',
											'shk_alasan' : 'tidak-dapat',
											'shk_lokasi' : '',
											'shk_spesimen_dttm' : '',

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
								"coder_nik": $scope.dataPasienSelected.codernik    //"123123123123"  
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
				medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
					// LoadData();	
					// console.log(e)
					// save logging simpan klaim
					$scope.saveLogging('Simpan Klaim', 'No SEP Pasien', e.data.dataresponse[0].datarequest.metadata.nomor_sep,
					'Simpan Klaim ' + ' No Registrasi / No RM / No SEP : ' + $scope.dataPasienSelected.noregistrasi
					+ '/ ' +  $scope.dataPasienSelected.nocm+ ' / '+  e.data.dataresponse[0].datarequest.metadata.nomor_sep +' Metadata : ' +  e.data.dataresponse[0].datarequest.metadata.method)
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
						})
						
					}
					if ($scope.itemPopUp.nomor_sep != $scope.dataPasienSelected.nosep) {
						$scope.simpanSep(); //ubah no sep pasien
					}
					var dataSave = {
						'namapegawai': $scope.user.namaLengkap,
						'param': 'simpan',
						'norec': $scope.dataPasienSelected.norec,
						'isventilator': $scope.itemPopUp.ventilator ? $scope.itemPopUp.ventilator : null,
						'losintensif': $scope.itemPopUp.los,
						'start_dttm': moment($scope.itemPopUp.start_dttm).format('YYYY-MM-DD HH:mm:ss'),
						'stop_dttm': moment($scope.itemPopUp.stop_dttm).format('YYYY-MM-DD HH:mm:ss'),
					}
					medifirstService.post('bridging/inacbg/save-pegawai', dataSave).then(function (e) {
						// LoadData();	
						var dataupdateRegistrasi = {
							'noregistrasi' : $scope.dataPasienSelected.noregistrasi,
							'tglregistrasi': moment($scope.itemPopUp.tgl_masuk).format('YYYY-MM-DD HH:mm:ss'),
							'tglkeluar': moment($scope.itemPopUp.tgl_pulang).format('YYYY-MM-DD HH:mm:ss'),
						}
						medifirstService.post('bridging/inacbg/update-tanggal-registrasi', dataupdateRegistrasi).then(function (e) {
							loadData()	
						})
						
					})

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
								// "tarif_rs": {
								// 	"prosedur_non_bedah": dataSave[i].tarif_rs.prosedur_non_bedah,    //"300000",      
								// 	"prosedur_bedah": dataSave[i].tarif_rs.prosedur_bedah,    //"20000000",      
								// 	"konsultasi": dataSave[i].tarif_rs.konsultasi,    //"300000",      
								// 	"tenaga_ahli": dataSave[i].tarif_rs.tenaga_ahli,    //"200000",      
								// 	"keperawatan": dataSave[i].tarif_rs.keperawatan,    // "80000",      
								// 	"penunjang": dataSave[i].tarif_rs.penunjang,    //"1000000",      
								// 	"radiologi": dataSave[i].tarif_rs.radiologi,    //"500000",      
								// 	"laboratorium": dataSave[i].tarif_rs.laboratorium,    //"600000",      
								// 	"pelayanan_darah": dataSave[i].tarif_rs.pelayanan_darah,    //"150000",      
								// 	"rehabilitasi": dataSave[i].tarif_rs.rehabilitasi,    //"100000",      
								// 	"kamar": dataSave[i].tarif_rs.kamar,    //"6000000",      
								// 	"rawat_intensif": dataSave[i].tarif_rs.rawat_intensif,    //"2500000",      
								// 	"obat": dataSave[i].tarif_rs.obat,    //"2000000",  
								// 	"obat_kronis": dataSave[i].tarif_rs.obat_kronis,
								// 	"obat_kemoterapi": dataSave[i].tarif_rs.obat_kemoterapi,
								// 	"alkes": dataSave[i].tarif_rs.alkes,    //"500000",      
								// 	"bmhp": dataSave[i].tarif_rs.bmhp,    //"400000",      
								// 	"sewa_alat": dataSave[i].tarif_rs.sewa_alat,    //"210000"    
								// },
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
											"use_vacuum": dataSave[i].persalinan.delivery.use_vacuum,
											'shk_spesimen_ambil': 'tidak',
											'shk_alasan': 'tidak-dapat',
											'shk_lokasi': '',
											'shk_spesimen_dttm': '',

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
				for (var i = dataSave.length - 1; i >= 0; i--) {
					dt1 = {
						"metadata": {
							"method": "reedit_claim"
						},
						"data": {
							"nomor_sep": dataSave[i].nomor_sep,
						}
					}
					dt2.push(dt1)
				}

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
				if ($scope.dataPasienSelected.deptid != 16) {
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
									"birth_weight": $scope.dataPasienSelected.beratbadan,//dataSave[i].birth_weight ,    //"0",    
									"sistole": dataSave[i].sistole,
									"diastole": dataSave[i].diastole, 
									"discharge_status": dataSave[i].discharge_status,    //"1",    
									"diagnosa": dataSave[i].diagnosa,    //"S71.0#A00.1",    
									"procedure": dataSave[i].procedure,    //"81.52#88.38",    
									"diagnosa_inagrouper": dataSave[i].diagnosa_inagrouper,
									"procedure_inagrouper": dataSave[i].procedure_inagrouper,
									// "tarif_rs": {
									// 	"prosedur_non_bedah": dataSave[i].tarif_rs.prosedur_non_bedah,    //"300000",      
									// 	"prosedur_bedah": dataSave[i].tarif_rs.prosedur_bedah,    //"20000000",      
									// 	"konsultasi": dataSave[i].tarif_rs.konsultasi,    //"300000",      
									// 	"tenaga_ahli": dataSave[i].tarif_rs.tenaga_ahli,    //"200000",      
									// 	"keperawatan": dataSave[i].tarif_rs.keperawatan,    // "80000",      
									// 	"penunjang": dataSave[i].tarif_rs.penunjang,    //"1000000",      
									// 	"radiologi": dataSave[i].tarif_rs.radiologi,    //"500000",      
									// 	"laboratorium": dataSave[i].tarif_rs.laboratorium,    //"600000",      
									// 	"pelayanan_darah": dataSave[i].tarif_rs.pelayanan_darah,    //"150000",      
									// 	"rehabilitasi": dataSave[i].tarif_rs.rehabilitasi,    //"100000",      
									// 	"kamar": dataSave[i].tarif_rs.kamar,    //"6000000",      
									// 	"rawat_intensif": dataSave[i].tarif_rs.rawat_intensif,    //"2500000",      
									// 	"obat": dataSave[i].tarif_rs.obat,    //"2000000",  
									// 	"obat_kronis": dataSave[i].tarif_rs.obat_kronis,
									// 	"obat_kemoterapi": dataSave[i].tarif_rs.obat_kemoterapi,
									// 	"alkes": dataSave[i].tarif_rs.alkes,    //"500000",      
									// 	"bmhp": dataSave[i].tarif_rs.bmhp,    //"400000",      
									// 	"sewa_alat": dataSave[i].tarif_rs.sewa_alat,    //"210000"    
									// },
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
												"use_vacuum": dataSave[i].persalinan.delivery.use_vacuum,
												'shk_spesimen_ambil': 'tidak',
												'shk_alasan': 'tidak-dapat',
												'shk_lokasi': '',
												'shk_spesimen_dttm': '',
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
					var	datass =[{ noreg:  $scope.dataPasienSelected.norec,
								   namakelas:  $scope.dataPasienSelected.namakelas, 
								   nosep:  $scope.dataPasienSelected.nosep,
								   deptid:  $scope.dataPasienSelected.deptid }]
					medifirstService.postNonMessage('bridging/inacbg/get-daftar-pasien-statusnaikkelas?noreg=' + $scope.dataPasienSelected.norec
						+ '&namakelas=' + $scope.dataPasienSelected.namakelas,{'data':datass}).then(function (e) {
							var resp = e.data[0];
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
											"birth_weight": $scope.dataPasienSelected.beratbadan,//dataSave[i].birth_weight ,    //"0",    
											"sistole": dataSave[i].sistole,
											"diastole": dataSave[i].diastole, 
											"discharge_status": dataSave[i].discharge_status,    //"1",    
											"diagnosa": dataSave[i].diagnosa,    //"S71.0#A00.1",    
											"procedure": dataSave[i].procedure,    //"81.52#88.38",  
											"diagnosa_inagrouper": dataSave[i].diagnosa_inagrouper,
											"procedure_inagrouper": dataSave[i].procedure_inagrouper,  
											// "tarif_rs": {
											// 	"prosedur_non_bedah": dataSave[i].tarif_rs.prosedur_non_bedah,    //"300000",      
											// 	"prosedur_bedah": dataSave[i].tarif_rs.prosedur_bedah,    //"20000000",      
											// 	"konsultasi": dataSave[i].tarif_rs.konsultasi,    //"300000",      
											// 	"tenaga_ahli": dataSave[i].tarif_rs.tenaga_ahli,    //"200000",      
											// 	"keperawatan": dataSave[i].tarif_rs.keperawatan,    // "80000",      
											// 	"penunjang": dataSave[i].tarif_rs.penunjang,    //"1000000",      
											// 	"radiologi": dataSave[i].tarif_rs.radiologi,    //"500000",      
											// 	"laboratorium": dataSave[i].tarif_rs.laboratorium,    //"600000",      
											// 	"pelayanan_darah": dataSave[i].tarif_rs.pelayanan_darah,    //"150000",      
											// 	"rehabilitasi": dataSave[i].tarif_rs.rehabilitasi,    //"100000",      
											// 	"kamar": dataSave[i].tarif_rs.kamar,    //"6000000",      
											// 	"rawat_intensif": dataSave[i].tarif_rs.rawat_intensif,    //"2500000",      
											// 	"obat": dataSave[i].tarif_rs.obat,    //"2000000",  
											// 	"obat_kronis": dataSave[i].tarif_rs.obat_kronis,
											// 	"obat_kemoterapi": dataSave[i].tarif_rs.obat_kemoterapi,
											// 	"alkes": dataSave[i].tarif_rs.alkes,    //"500000",      
											// 	"bmhp": dataSave[i].tarif_rs.bmhp,    //"400000",      
											// 	"sewa_alat": dataSave[i].tarif_rs.sewa_alat,    //"210000"    
											// },
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
														"use_vacuum": dataSave[i].persalinan.delivery.use_vacuum,
														'shk_spesimen_ambil': 'tidak',
														'shk_alasan': 'tidak-dapat',
														'shk_lokasi': '',
														'shk_spesimen_dttm': '',
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
									if ($scope.dataPasienSelected.deptid != 16) {
										totaldijamin = responData[0].dataresponse.tarif_alt[2].tarif_inacbg
									} else if ($scope.dataPasienSelected.statuscovid === true) {
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
										"noregistrasifk": $scope.dataPasienSelected.norec,
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
								// "tarif_rs": {
								// 	"prosedur_non_bedah": dataSave[i].tarif_rs.prosedur_non_bedah,    //"300000",      
								// 	"prosedur_bedah": dataSave[i].tarif_rs.prosedur_bedah,    //"20000000",      
								// 	"konsultasi": dataSave[i].tarif_rs.konsultasi,    //"300000",      
								// 	"tenaga_ahli": dataSave[i].tarif_rs.tenaga_ahli,    //"200000",      
								// 	"keperawatan": dataSave[i].tarif_rs.keperawatan,    // "80000",      
								// 	"penunjang": dataSave[i].tarif_rs.penunjang,    //"1000000",      
								// 	"radiologi": dataSave[i].tarif_rs.radiologi,    //"500000",      
								// 	"laboratorium": dataSave[i].tarif_rs.laboratorium,    //"600000",      
								// 	"pelayanan_darah": dataSave[i].tarif_rs.pelayanan_darah,    //"150000",      
								// 	"rehabilitasi": dataSave[i].tarif_rs.rehabilitasi,    //"100000",      
								// 	"kamar": dataSave[i].tarif_rs.kamar,    //"6000000",      
								// 	"rawat_intensif": dataSave[i].tarif_rs.rawat_intensif,    //"2500000",      
								// 	"obat": dataSave[i].tarif_rs.obat,    //"2000000",  
								// 	"obat_kronis": "0",
								// 	"obat_kemoterapi": "0",
								// 	"alkes": dataSave[i].tarif_rs.alkes,    //"500000",      
								// 	"bmhp": dataSave[i].tarif_rs.bmhp,    //"400000",      
								// 	"sewa_alat": dataSave[i].tarif_rs.sewa_alat,    //"210000"    
								// },
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
						"nomor_sep": $scope.dataPasienSelected.nosep,
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
					if ($scope.dataPasienSelected.deptid != 16) {
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

						biayanaikkelas = Number($scope.dataPasienSelected.biayanaikkelas)
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
						"noregistrasifk": $scope.dataPasienSelected.norec,
						"totalDijamin": totaldijamin,
						"biayaNaikkelas": biayanaikkelas,
						"response": responData[0].dataresponse,
						"special_cmg": cmg
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


			$scope.claim_final2 = function () {
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
				medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
					// response oke saja
					responData = e.data.dataresponse;
					let response = e.data.dataresponse
					// save logging
					$scope.saveLogging('Final Klaim', 'No SEP Pasien', e.data.dataresponse[0].datarequest.data.nomor_sep,
							'Final Klaim ' + ' No Registrasi / No RM / No SEP : ' + $scope.dataPasienSelected.noregistrasi
								+ '/ ' +  $scope.dataPasienSelected.nocm + ' / '+  e.data.dataresponse[0].datarequest.data.nomor_sep +' Metadata : ' +  e.data.dataresponse[0].datarequest.metadata.method)
					
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
						})
						var dataSave = {
							'namapegawai': $scope.user.namaLengkap,
							'param': 'final',
							'norec': $scope.dataPasienSelected.norec
						}
						medifirstService.post('bridging/inacbg/save-pegawai', dataSave).then(function (e) {
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

			$scope.send_claim_individual2 = function () {
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
				medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
					// responData = e.data.dataresponse;
					
					// save logging
					$scope.saveLogging('Kirim Online', 'No SEP Pasien', e.data.dataresponse[0].datarequest.data.nomor_sep,
					'Kirim Online ' + ' No Registrasi / No RM / No SEP : ' + $scope.dataPasienSelected.noregistrasi
					+ '/ ' +  $scope.dataPasienSelected.nocm + ' / '+  e.data.dataresponse[0].datarequest.data.nomor_sep +' Metadata : ' +  e.data.dataresponse[0].datarequest.metadata.method)
					// response simpan ke database	
					responData = e.data.dataresponse;
					var datasend = {
						"noregistrasifk": $scope.dataPasienSelected.norec
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

						medifirstService.post('bridging/inacbg/save-status', {'data':arrStatus}).then(function (z) {
							loadData();	
						})

						var dataSave = {
							'namapegawai': $scope.user.namaLengkap,
							'param': 'kironline',
							'norec': $scope.dataPasienSelected.norec
						}
						medifirstService.post('bridging/inacbg/save-pegawai', dataSave).then(function (e) {
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

						const linkSource = 'data:application/pdf;base64,' + responData[0].dataresponse.data;
						const downloadLink = document.createElement("a");
						var tglprint = moment($scope.now).format('YYYY-MM-DD');
						// const fileName = "claim_print_" + responData[0].datarequest.data.nomor_sep + "_" + tglprint + ".pdf";
						var a = responData[0].datarequest.data.nomor_sep
						var nama = a.substr(15);
						const fileName = nama + ".pdf";

						downloadLink.href = linkSource;
						downloadLink.download = fileName;
						downloadLink.click();
					}
					// window.open('data:application/pdf;base64,' + responData[0].dataresponse.data);
					toastr.info(responData[0].dataresponse.metadata.message, 'INACBG');
				})
			}

			$scope.delete_claim = function () {
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
					medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
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
				for (var i = dataSave.length - 1; i >= 0; i--) {
					dt1 = {
						"metadata": {
							"method": "search_diagnosis"
						},
						"data": {
							"keyword": ""
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
			$scope.search_procedures = function () {
				var dt1 = {}
				var dt2 = []
				for (var i = dataSave.length - 1; i >= 0; i--) {
					dt1 = {
						"metadata": {
							"method": "search_procedures"
						},
						"data": {
							"keyword": ""
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
					"nokepesertaan": $scope.dataPasienSelected.nokepesertaan,
					"nosep": $scope.itemPopUp.nomor_sep,
					"norec_pa": norec_pa,
					"nocm": $scope.dataPasienSelected.nocm,
				}

				// manageTataRekening.postSaveSepTarek(updateSep).then(function (e) {
				// 	loadData();
				// 	$scope.saveLogInputSep()
				// })

				medifirstService.post('registrasi/daftar-registrasi/update-nosep', updateSep).then(function (e) {
					$scope.saveLogInputSep()
				})

				// $scope.cboSep = false
				// $scope.cboUbahSEP = true
				// $scope.cboDokter = false
				// $scope.cboUbahDokter = true
			}
			$scope.saveLogInputSep = function () {
				var jenisLog = 'Input SEP'
				var referensi = 'Norec Pemakaian Asuransi'
				medifirstService.get("sysadmin/logging/save-log-all?jenislog="
					+ jenisLog + "&referensi=" + referensi
					+ "&noreff=" + $scope.dataPasienSelected.norec_pa
					+ "&keterangan=" + $scope.itemPopUp.nomor_sep
				).then(function (data) {
					// $scope.item.noPeserta = "";
					// $scope.item.noSep = "";
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
				var emrfk = [291039,291033,460006,290006] // emrfk 

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
				if ($scope.dataPasienSelected == undefined) {
					window.messageContainer.error("Pilih Dahulu Pasien!");
					return;
				}
				medifirstService.get("registrasi/daftar-registrasi/get-apd?noregistrasi="
					+ $scope.dataPasienSelected.noregistrasi
					+ "&objectruanganlastfk=" + $scope.dataPasienSelected.objectruanganlastfk
				).then(function (data) {
					var arrStr = {
						0: $scope.dataPasienSelected.nocm,
						1: $scope.dataPasienSelected.namapasien,
						2: $scope.dataPasienSelected.jeniskelamin,
						3: $scope.dataPasienSelected.noregistrasi,
						4: $scope.dataPasienSelected.umur,
						5: $scope.dataPasienSelected.kelompokpasien,
						6: $scope.dataPasienSelected.tglregistrasi,
						7: data.data.ruangan[0].norec_apd,
						8: $scope.dataPasienSelected.norec,
						9: $scope.dataPasienSelected.objectkelasfk,
						10: $scope.dataPasienSelected.namakelas,
						11: $scope.dataPasienSelected.objectruanganlastfk,
						12: $scope.dataPasienSelected.namaruangan + '`'
					};
					cacheHelper.set('cacheRMelektronik', arrStr);
					
					// Open a new tab with the specified URL
					var newTab = window.open('#/RekamMedis/' + data.data.ruangan[0].norec_apd + '/VitalSign' , '_blank');
					if (newTab) {
						newTab.focus(); // Focus on the new tab if it was successfully opened
					} else {
						alert('A new tab was blocked by the browser. Please allow pop-ups for this site.');
					}
				});
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

				delete $scope.item.specialprocedure
				delete $scope.item.specialprosthesis
				delete $scope.item.specialinvestigation
				delete $scope.item.specialdrug
                $scope.grupingtab = false;
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
                if ($scope.dataPasienSelected.noregistrasi != undefined) {
                    norReg = "noReg=" + $scope.dataPasienSelected.noregistrasi;
                }
			
                medifirstService.get("registrasi/get-diagnosa-10-by-noreg?"
                    + norReg + '&inacbg=true'
                ).then(function (data) {
					if (data.data.inacbg.length > 0) {
                        $scope.item.jenisDiagnosis = {id: 9, jenisDiagnosa: "Secondary INAcbg"}
						$scope.itemPopUp.icd10 = data.data.icd10;
						// console.log($scope.itemPopUp.icd10);
                    } else {
						$scope.item.jenisDiagnosis = {id: 8, jenisDiagnosa: "Primary / utama INAcbg"}
					}
					var a = data.data.dataunu.length;
					// for (var i = 0; i < data.data.inacbg.length; i++) {
					// 	if (data.data.datas[i].jd_id == 7 || data.data.datas[i].jd_id == 8) {
					// 		a = a + 1;	
					// 	}
					// }
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
					loadicdInu()
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
					
				if (data.data.dataunu.length > 0) {  
					$scope.item.jenisDiagnosisUnu = {id: 11, jenisDiagnosa: "Secondary UNU"}
					$scope.itemPopUp.diagnosa_inagrouper = data.data.icd10unu;
				} else {
					$scope.item.jenisDiagnosisUnu = {id: 10, jenisDiagnosa: "Primary / utama UNU"}
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
						if (data.data.inacbg.length > 0) {
						
							$scope.itemPopUp.icd9 = data.data.icd9;
							// console.log($scope.itemPopUp.icd9)
						} 
						else{
							$scope.itemPopUp.icd9 = null
						}
						// var a = 0 ;
						// for (var i = 0; i < data.data.inacbg.length; i++) {
						// 	if (data.data.datas[i].ketdiagnosa == 'INAcbg' ) {
						// 		a = a + 1;
						// 	}
						// }
						$scope.item.countIcd9Inacbg= data.data.dataunu.length;
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
					});
					// debugger
					loadicdixIna()
			}
			function loadRiwayatVentilator() {
				var nomor = ""
                if ($scope.dataPasienSelected.noregistrasi != undefined) {
                    nomor = "nocm=" + $scope.dataPasienSelected.noregistrasi;
                }
				medifirstService.get("bridging/inacbg/get-daftar-pasien-ventilator?"
                    + nomor
                     ).then(function (data) {
                    $scope.itemres = data.data
                });
			}
			$scope.InputDiagnosa = function () {
				// console.log('ieumah selected', $scope.dataPasienSelected);
                if ($scope.dataPasienSelected.noregistrasi == undefined) {
					toastr.error("Harap pilih data terlebih dahulu !");
					return
                }
                $scope.grupingtab = false;

                // if ($scope.dataPasienSelected.statusklaim == 'Grouping') {
				// 	$scope.grupingtab = true;
				// }

				$scope.dataPasienSelected.umur == "0 Tahun " ? $scope.showBeratLhair = true : $scope.showBeratLhair = false
				
                loadpopup();
				$scope.popUpInputDiagnosa.open().maximize()
				$scope.dataPasienSelected.tglregistrasi = new Date($scope.dataPasienSelected.tglregistrasi);
				loadRiwayat();
				loadicd();
				loadicdInu();
				loadicdix();
				loadicdixIna();
				
				
				
            }
			$scope.tutupInputDiagnosa = function () {
				$scope.popUpInputDiagnosa.close()
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
                    noregistrasifk: $scope.dataPasienSelected.norec_apd,
                    tglregistrasi: $scope.dataPasienSelected.tglregistrasi,
                    objectdiagnosafk: $scope.item.diagnosisPrimer.id,
                    objectjenisdiagnosafk: $scope.item.jenisDiagnosis.id,
                    tglinputdiagnosa: moment($scope.now).format('YYYY-MM-DD hh:mm:ss'),
                    keterangan: keterangan
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
					ket + ' Diagnosis ICD 10 ( ' + $scope.item.diagnosisPrimer.kodeNama + ' )' + ' No Registrasi / No RM ' + $scope.dataPasienSelected.noregistrasi
					+ '/ ' +  $scope.dataPasienSelected.nocm);

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
                    noregistrasifk: $scope.dataPasienSelected.norec_apd,
                    tglregistrasi: $scope.dataPasienSelected.tglregistrasi,
                    objectdiagnosafk: $scope.item.diagnosisPrimerUnu.id,
                    objectjenisdiagnosafk: $scope.item.jenisDiagnosisUnu.id,
                    tglinputdiagnosa: moment($scope.now).format('YYYY-MM-DD hh:mm:ss'),
                    keterangan: keterangan
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
					ket + ' Diagnosis ICD 10 ( ' + $scope.item.diagnosisPrimerUnu.kodeNama + ' )' + ' No Registrasi / No RM ' + $scope.dataPasienSelected.noregistrasi
					+ '/ ' +  $scope.dataPasienSelected.nocm);

                    delete $scope.item.jenisDiagnosisUnu;
                    delete $scope.item.diagnosisPrimerUnu;
                    delete $scope.item.keterangan;
                    delete $scope.item.norec_diagnosapasienUnu;
					delete $scope.item.norec_diagnosadetailpasienUnu;
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
                    objectpasienfk: $scope.dataPasienSelected.norec_apd,
                    tglpendaftaran: $scope.dataPasienSelected.tglregistrasi,
                    objectdiagnosatindakanfk: $scope.item.diagnosisPrimer1.id,
                    keterangantindakan: keteranganTindakan,
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
					ket + ' Diagnosis ICD 9 ( ' +  $scope.item.diagnosisPrimer1.kdNama + ' )' + ' No Registrasi / No RM ' + $scope.dataPasienSelected.noregistrasi
					+ '/ ' +  $scope.dataPasienSelected.nocm)

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
                    objectpasienfk: $scope.dataPasienSelected.norec_apd,
                    tglpendaftaran: $scope.dataPasienSelected.tglregistrasi,
                    objectdiagnosatindakanfk: $scope.item.diagnosisPrimer1Unu.id,
                    keterangantindakan: keteranganTindakan,
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
					ket + ' Diagnosis ICD 9 ( ' +  $scope.item.diagnosisPrimer1Unu.kdNama + ' )' + ' No Registrasi / No RM ' + $scope.dataPasienSelected.noregistrasi
					+ '/ ' +  $scope.dataPasienSelected.nocm)

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
					'Hapus Diagnosis ICD 10 ( ' + $scope.item.diagnosisPrimerUnu.kodeNama + ' )' + ' No Registrasi / No RM ' + $scope.dataPasienSelected.noregistrasi
					+ '/ ' +  $scope.dataPasienSelected.nocm);

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
                    diagnosa: diagnosa,
                }
                medifirstService.post('registrasi/daftar-antrian-pasien/delete-diagnosa-pasien', objDelete).then(function (e) {
					$scope.saveLogging('Diagnosis', 'Norec DiagnosaPasien_T','',
					'Hapus Diagnosis ICD 10 ( ' + $scope.item.diagnosisPrimer.kodeNama + ' )' + ' No Registrasi / No RM ' + $scope.dataPasienSelected.noregistrasi
					+ '/ ' +  $scope.dataPasienSelected.nocm);

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
					'Hapus Diagnosis ICD 9 ( ' +  $scope.item.diagnosisPrimer1.kdNama + ' )' + ' No Registrasi / No RM ' + $scope.dataPasienSelected.noregistrasi
					+ '/ ' +  $scope.dataPasienSelected.nocm)
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
					'Hapus Diagnosis ICD 9 ( ' +  $scope.item.diagnosisPrimer1Unu.kdNama + ' )' + ' No Registrasi / No RM ' + $scope.dataPasienSelected.noregistrasi
					+ '/ ' +  $scope.dataPasienSelected.nocm)
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
                    // $scope.sourceDiagnosisPrimer.add({
                    //     id: dataSelectedUnu.objectdiagnosafk,
                    //     kdDiagnosa: dataSelectedUnu.kddiagnosa,
                    //     namaDiagnosa: dataSelectedUnu.namadiagnosa,
                    //     noregistrasi: dataSelectedUnu.noregistrasi,
                    //     tglregistrasi: dataSelectedUnu.tglregistrasi,
                    //     objectruanganfk: dataSelectedUnu.objectruanganfk,
                    //     namaruangan: dataSelectedUnu.namaruangan,
                    //     norec_apd: dataSelectedUnu.norec_apd,
                    //     objectdiagnosafk: dataSelectedUnu.objectdiagnosafk,
                    //     objectjenisdiagnosafk: dataSelectedUnu.objectjenisdiagnosafk,
                    //     jenisdiagnosa: dataSelectedUnu.jenisdiagnosa,
                    //     norec_diagnosapasien: dataSelectedUnu.norec_diagnosapasien,
                    //     norec_detaildpasien: dataSelectedUnu.norec_detaildpasien,
                    //     id: dataSelectedUnu.id,
                    //     kdprofile: dataSelectedUnu.kdprofile,
                    //     statusenabled: dataSelectedUnu.statusenabled,
                    //     kodeexternal: dataSelectedUnu.kodeexternal,
                    //     namaexternal: dataSelectedUnu.namaexternal,
                    //     norec: dataSelectedUnu.norec,
                    //     reportdisplay: dataSelectedUnu.reportdisplay,
                    //     objectjeniskelaminfk: dataSelectedUnu.objectjeniskelaminfk,
                    //     objectkategorydiagnosafk: dataSelectedUnu.objectkategorydiagnosafk,
                    //     qdiagnosa: dataSelectedUnu.qdiagnosa,
                    //     keteranganTindakan: dataSelectedUnu.keterangantindakan
                    // })
                    $scope.item.jenisDiagnosisUnu = { id: dataSelectedUnu.objectjenisdiagnosafk, jenisDiagnosa: dataSelectedUnu.jenisdiagnosa }
                    $scope.item.diagnosisPrimerUnu = {
                        id: dataSelectedUnu.objectdiagnosafk,
                        kdDiagnosa: dataSelectedUnu.kddiagnosa,
                        namaDiagnosa: dataSelectedUnu.namadiagnosa,
                        kodeNama: dataSelectedUnu.kddiagnosa + ' - ' +dataSelectedUnu.namadiagnosa,
                        noregistrasi: dataSelectedUnu.noregistrasi,
                        tglregistrasi: dataSelectedUnu.tglregistrasi,
                        objectruanganfk: dataSelectedUnu.objectruanganfk,
                        namaruangan: dataSelectedUnu.namaruangan,
                        norec_apd: dataSelectedUnu.norec_apd,
                        objectdiagnosafk: dataSelectedUnu.objectdiagnosafk,
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
                        keterangan: dataSelectedUnu.keterangan
                    }//  { id: dataSelectedUnu.objectruanganfk, namaruangan: dataSelectedUnu.namaruangan }
                    $scope.item.keterangan = dataSelectedUnu.keterangan
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
                    //     keterangantindakan: dataSelected1.keterangantindakan
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
                        // keterangantindakan: dataSelected1.keterangantindakan
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
                    $scope.item.keteranganTindakan = dataSelected1.keterangantindakan
                }

            }
            $scope.klikGrid1Unu = function (dataSelected1Unu) {
                if (dataSelected1Unu.kddiagnosatindakan != undefined) {
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
                    //     keterangantindakan: dataSelected1.keterangantindakan
                    // })

                    $scope.item.jenisDiagnosis1Unu = { id: dataSelected1Unu.objectjenisdiagnosafk, jenisDiagnosa: dataSelected1Unu.jenisdiagnosa }
                    $scope.item.diagnosisPrimer1Unu = {
                        id: dataSelected1Unu.objectdiagnosafk,
                        kdDiagnosaTindakan: dataSelected1Unu.kddiagnosatindakan,
                        namaDiagnosaTindakan: dataSelected1Unu.namadiagnosatindakan,
                        kdNama: dataSelected1Unu.kddiagnosatindakan + ' - ' + dataSelected1Unu.namadiagnosatindakan,
                        noregistrasi: dataSelected1Unu.noregistrasi,
                        tglregistrasi: dataSelected1Unu.tglregistrasi,
                        objectruanganfk: dataSelected1Unu.objectruanganfk,
                        namaruangan: dataSelected1Unu.namaruangan,
                        norec_apd: dataSelected1Unu.norec_apd,
                        objectdiagnosafk: dataSelected1Unu.objectdiagnosafk,
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
                        keterangantindakan: dataSelected1Unu.keterangantindakan
                    }

                    $scope.item.diagnosisPrimer2 = { id: dataSelected1Unu.objectdiagnosafk, namaDiagnosaTindakan: dataSelected1Unu.namaDiagnosaTindakan }
					$scope.item.norec_diagnosapasien_tindakanUnu = dataSelected1Unu.norec_diagnosapasien,
                    $scope.item.namaRuangan1 = ''
                    $scope.item.namaRuangan1 = {
                        noregistrasi: dataSelected1Unu.noregistrasi,
                        objectruanganfk: dataSelected1Unu.objectruanganfk,
                        namaruangan: dataSelected1Unu.namaruangan,
                        norec_apd: dataSelected1Unu.norec_apd
                    }//  { id: dataSelected.objectruanganfk, namaruangan: dataSelected.namaruangan }
                    $scope.item.keteranganTindakan = dataSelected1Unu.keterangantindakan
                }

            }

			$scope.gridDiagnosa =
			[
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

			];

			$scope.gridDiagnosa1 =
			[
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
			];

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
                if ($scope.dataPasienSelected.noregistrasi != undefined) {
                    nocm = "nocm=" + $scope.dataPasienSelected.nocm;
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
				var nomor = ""
                if ($scope.dataPasienSelected.noregistrasi != undefined) {
                    nomor = "nocm=" + $scope.dataPasienSelected.noregistrasi;
                }
				medifirstService.get("bridging/inacbg/get-daftar-pasien-ventilator?"
                    + nomor
	                     ).then(function (data) {
							// console.log(data.data)
							// debugger
						if (data.data.length > 0) {
							$scope.itemres = data.data
							if ($scope.itemres[0].use_ind == '1') {
								$scope.itemPopUp.intensif = true
								$scope.itemPopUp.icu_indikator = 1
								$scope.itemPopUp.ventilator_hour = $scope.itemres[0].ventilator_hour
								$scope.itemPopUp.start_dttm = $scope.itemres[0].start_dttm
								$scope.itemPopUp.stop_dttm = $scope.itemres[0].stop_dttm
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
	                   
	                });
					
				}

			function loadRawatIntensif(){
				var noregistrasifk = ""
				if ($scope.dataPasienSelected.noregistrasi != undefined) {
                    noregistrasifk = "noregistrasifk=" + $scope.dataPasienSelected.norec;
                }
				medifirstService.get("bridging/inacbg/get-daftar-pasien-intensif?"
                    + noregistrasifk
	                     ).then(function (data) {
							$scope.itemPopUp.los_icu = data.data.data;
	                });
			}	
			$scope.listpulang = [
				{namalengkap:'Atas persetujuan dokter' ,id:1},
				{namalengkap:'Dirujuk' ,id:2},
				{namalengkap:'Atas permintaan sendiri' ,id:3},
				{namalengkap:'Meninggal' ,id:4},
				{namalengkap:'Lain-lain' ,id:5},
			]
			$scope.listmasuk =[
				{namalengkap:'Rujukan FKTP' ,id:'gp'},
				{namalengkap:'Rujukan FKRTL' ,id:'hosp-trans'},
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

			function loadpopup() {
				// loadRiwayatVentilator();
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

				if ($scope.dataPasienSelected.idrekanan == 2552) {
					$scope.itemPopUp.carabayar = 'JKN'
				} else if ($scope.dataPasienSelected.idrekanan == 581164) {
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
					$scope.itemPopUp.tgl_pulang = moment($scope.dataPasienSelected.tglpulang).format('YYYY-MM-DD HH:mm:ss')
				// }
				
				$scope.itemPopUp.umur =  $scope.dataPasienSelected.umur
				
				if ($scope.dataPasienSelected.caramasuk_inacbg == 'gp') {
					$scope.itemPopUp.cara_masuk = {namalengkap:'Rujukan FKTP' ,id:'gp'}
					$scope.itemPopUp.cara_masukkd = 'gp'
				} if ($scope.dataPasienSelected.caramasuk_inacbg == 'hosp-trans') {
					$scope.itemPopUp.cara_masuk = {namalengkap:'Rujukan FKRTL' ,id:'hosp-trans'}
					$scope.itemPopUp.cara_masukkd = 'hosp-trans'
					
				} if ($scope.dataPasienSelected.caramasuk_inacbg == 'other') {
					$scope.itemPopUp.cara_masuk = {namalengkap:'Lain-lain' ,id:'other'}
					$scope.itemPopUp.cara_masukkd = 'other'

				} if ($scope.dataPasienSelected.caramasuk_inacbg == 'inp') {
					$scope.itemPopUp.cara_masuk = {namalengkap:'Dari Rawat Inap' ,id:'inp'}
					$scope.itemPopUp.cara_masukkd = 'inp'

				} if ($scope.dataPasienSelected.caramasuk_inacbg == 'outp') {
					$scope.itemPopUp.cara_masuk = {namalengkap:'Dari Rawat Jalan' ,id:'outp'}
					$scope.itemPopUp.cara_masukkd = 'outp'

				} if ($scope.dataPasienSelected.caramasuk_inacbg == 'emd') {
					$scope.itemPopUp.cara_masuk = {namalengkap:'Dari Rawat Darurat' ,id:'emd'}
					$scope.itemPopUp.cara_masukkd = 'emd'

				} if ($scope.dataPasienSelected.caramasuk_inacbg == 'born') {
					$scope.itemPopUp.cara_masuk = {namalengkap:'Lahir di RS' ,id:'born'}
					$scope.itemPopUp.cara_masukkd = 'born'

				} if ($scope.dataPasienSelected.caramasuk_inacbg == 'nursing') {
					$scope.itemPopUp.cara_masuk = {namalengkap:'Rujukan Panti Jompo' ,id:'nursing'}
					$scope.itemPopUp.cara_masukkd = 'nursing'

				} if ($scope.dataPasienSelected.caramasuk_inacbg == 'psych') {
					$scope.itemPopUp.cara_masuk = {namalengkap:'Rujukan dari RS Jiwa' ,id:'psych'}
					$scope.itemPopUp.cara_masukkd = 'psych'

				} if ($scope.dataPasienSelected.caramasuk_inacbg == 'rehab') {
					$scope.itemPopUp.cara_masuk = {namalengkap:'Rujukan Fasilitas Rehab' ,id:'rehab'}
					$scope.itemPopUp.cara_masukkd = 'rehab'

				} if ($scope.dataPasienSelected.caramasuk_inacbg == 'mp') {
					$scope.itemPopUp.cara_masuk = {namalengkap:'Rujukan Spesialis' ,id:'mp'}
					$scope.itemPopUp.cara_masukkd = 'mp'

				}
				$scope.itemPopUp.intensif = $scope.dataPasienSelected.isventilator
				$scope.itemPopUp.start_dttm = $scope.dataPasienSelected.tglintubasi
				$scope.itemPopUp.stop_dttm = $scope.dataPasienSelected.tglekstubasi
				$scope.itemPopUp.ventilator = $scope.dataPasienSelected.isventilator
				$scope.itemPopUp.los = $scope.dataPasienSelected.lamarawatintensif
				$scope.itemPopUp.jam = $scope.dataPasienSelected.jam
				$scope.itemPopUp.birth_weight = $scope.dataPasienSelected.birth_weight
				if ($scope.dataPasienSelected.kodeexternal == 1) {
					$scope.itemPopUp.discharge_status = {namalengkap:'Atas persetujuan dokter' ,id:1}
					// $scope.itemPopUp.discharge_statusid = 1
				} else if ($scope.dataPasienSelected.kodeexternal == 2) {
					$scope.itemPopUp.discharge_status = {namalengkap:'Dirujuk' ,id:2}
					// $scope.itemPopUp.discharge_statusid = 2
				} else if ($scope.dataPasienSelected.kodeexternal == 3 ) {
					// $scope.itemPopUp.discharge_statusid = 3
					$scope.itemPopUp.discharge_status = {namalengkap:'Atas permintaan sendiri' ,id:3}
				} else if ($scope.dataPasienSelected.kodeexternal == 4) {
					$scope.itemPopUp.discharge_status = {namalengkap:'Meninggal' ,id:4}
					// $scope.itemPopUp.discharge_statusid = 4
				} else {
					$scope.itemPopUp.discharge_status = {namalengkap:'Lain-lain' ,id:5}
					// $scope.itemPopUp.discharge_statusid = 5
				}
				$scope.itemPopUp.dpjp = {id:$scope.dataPasienSelected.id, namalengkap:$scope.dataPasienSelected.namadokter}
				$scope.itemPopUp.jenis_tarif = 'TARIF RS KELAS B PEMERINTAH'
				$scope.itemPopUp.kode_tarif = $scope.dataPasienSelected.kodetarif
				// $scope.listTarifRS = [
				// 	{namatarif:'Prosedur Non Bedah' ,tarif:$scope.dataPasienSelected.tarif_rs.prosedur_non_bedah},
				// 	{namatarif:'Tenaga Ahli' ,tarif:$scope.dataPasienSelected.tarif_rs.tenaga_ahli},
				// 	{namatarif:'Radiologi' ,tarif:$scope.dataPasienSelected.tarif_rs.radiologi},
				// 	{namatarif:'Rehabilitasi' ,tarif:$scope.dataPasienSelected.tarif_rs.rehabilitasi},
				// 	{namatarif:'Obat' ,tarif:$scope.dataPasienSelected.tarif_rs.obat},
				// 	{namatarif:'Alkes' ,tarif:$scope.dataPasienSelected.tarif_rs.alkes},
				// ]
												 
				// $scope.listTarifRS2 = [				
				// 	{namatarif:'Prosedur Bedah' ,tarif:$scope.dataPasienSelected.tarif_rs.prosedur_bedah},
				// 	{namatarif:'Keperawatan' ,tarif:$scope.dataPasienSelected.tarif_rs.keperawatan},
				// 	{namatarif:'Laboratorium' ,tarif:$scope.dataPasienSelected.tarif_rs.laboratorium},
				// 	{namatarif:'Kamar/Akomodasi' ,tarif:$scope.dataPasienSelected.tarif_rs.kamar},
				// 	{namatarif:'Obat Kronis' ,tarif:$scope.dataPasienSelected.tarif_rs.obat_kronis},
				// 	{namatarif:'BMHP' ,tarif:$scope.dataPasienSelected.tarif_rs.bmhp},
				// ]
				// $scope.listTarifRS3 =[			
				// 	{namatarif:'Konsultasi' ,tarif:$scope.dataPasienSelected.tarif_rs.konsultasi},
				// 	{namatarif:'Penunjang' ,tarif:$scope.dataPasienSelected.tarif_rs.penunjang},					//
				// 	{namatarif:'Pelayanan Darah' ,tarif:$scope.dataPasienSelected.tarif_rs.pelayanan_darah},
				// 	{namatarif:'Rawat Intensif' ,tarif:$scope.dataPasienSelected.tarif_rs.rawat_intensif},
				// 	{namatarif:'Obat Kemoterapi' ,tarif:$scope.dataPasienSelected.tarif_rs.obat_kemoterapi},
				// 	{namatarif:'Sewa Alat' ,tarif:$scope.dataPasienSelected.tarif_rs.sewa_alat}
				// ]
				
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
				if ($scope.dataPasienSelected.noregistrasi == undefined ) {
					toastr.error('Pilih data dulu')
					return
				}
				var dpid = $scope.dataPasienSelected.objectdepartemenfk
				if(dpid != 16) {
					dpid = 18
				}
				$scope.listBerkasMonitoring =[]
				$scope.isRouteLoading = true
				medifirstService.get('registrasi/get-list-berkas-monitoring?dpid=' + dpid + '&noregistrasifk='+$scope.dataPasienSelected.norec ).then(function(e){
					$scope.isRouteLoading = false
					$scope.listBerkasMonitoring = e.data.data
					$scope.listUploadMonitoring = e.data.upload

					const fileMap = {};
					for (const upload of $scope.listUploadMonitoring) {
						if (!fileMap[upload.documentklaimfk]) {
							fileMap[upload.documentklaimfk] = [];
						}
						fileMap[upload.documentklaimfk].push(upload.filename);
					}
					for (var i = 0; i < $scope.listBerkasMonitoring.length; i++) {
						$scope.listBerkasMonitoring[i].no = i + 1
						$scope.listBerkasMonitoring[i].norec = $scope.dataPasienSelected.norec
						$scope.listBerkasMonitoring[i].noregistrasi = $scope.dataPasienSelected.noregistrasi
						$scope.listBerkasMonitoring[i].kodeexternal = null

						const elem = $scope.listBerkasMonitoring[i]
						for (var x = 0; x < $scope.listUploadMonitoring .length; x++) {
							const elem2 = $scope.listUploadMonitoring [x]
							if(elem2.documentklaimfk == elem.id){
								if (fileMap[elem.id]) {
									$scope.listBerkasMonitoring[i].kodeexternal = fileMap[elem.id].join(',');
									$scope.listBerkasMonitoring[i].documentklaimfk = elem2.documentklaimfk
								} else {
									$scope.listBerkasMonitoring[i].kodeexternal = null;
								}
								// $scope.listBerkasMonitoring[i].kodeexternal = elem2.filename
								// $scope.listBerkasMonitoring[i].documentklaimfk = elem2.documentklaimfk
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
					"width":"30px",
					"template": "<span class='style-center'>\
					# if(data.kodeexternal == null) {#\
						<div class=\"upload-btn-wrapper\">\
							<button class=\"btnupload\">Upload</button>\
							<input type=\"file\" id=\"filePasien\" accept=\"application/pdf\" multiple data-id=\"#: data.id #\" data-namafile=\"#: data.namaberkas #\" data-norec=\"#: data.norec #\" />\
						</div>\
						<div class=\"upload-btn-wrapper\">\
							<button class=\"btnupload\" id=\"cariDokumen\" data-id=\"#: data.id #\" data-noreg=\"#: data.noregistrasi #\">Cari Dokumen</button>\
						</div>\
					# } else {#\
						<div id=\"listDokumenKlaim\" data-id=\"#: data.id #\" data-noreg=\"#: data.noregistrasi #\">\
							# var files = data.kodeexternal.split(','); #\
							# for (var i = 0; i < files.length; i++) { #\
								<a href=\"javascript:void(0);\" class=\"lihatDokumen\" data-noreg=\"#: data.noregistrasi #\" data-documentklaimfk=\"#: data.documentklaimfk #\" data-namafile=\"#= files[i] #\"><i class=\"fa fa-file-pdf-o hitam\" aria-hidden=\"true\"></i>#= files[i] #</a><br>\
							# } #\
						</div>\
					# } #\
					</span>",
				},			
			]};

			// $('body ').on('change','#filePasien',function(e){
            //     var id = $(this).data("id");
            //     var norec = $(this).data("norec");
            //     var namafile = $(this).data("namafile");

            //     if (e.target.files[0]) {
            //         $scope.isRouteLoading = true;
            //         const url = baseTransaksi + 'bridging/inacbg/post-dokumen-klaim'
            //         const formData = new FormData()
			// 	    const file = e.target.files[0];
            //         if(file.type != "application/pdf") {
            //             toastr.error('File yang diizinkan dalam bentuk format PDF.')
            //             return;
            //         }

            //         formData.append('fileBerkas', file)
            //         formData.append('noregistrasifk', norec)
            //         formData.append('documentklaimfk', id)
            //         formData.append('namafile', namafile)
            //         var arr = document.cookie.split(';')
            //         var authorization;
            //         for (var i = 0; i < arr.length; i++) {
            //             var element = arr[i].split('=');
            //             if (element[0].indexOf('authorization') > 0) {
            //                 authorization = element[1];
            //             }
            //         }
            //         fetch(url, {
            //             method: 'POST',
            //             body: formData,
            //             headers: {
            //                 'X-AUTH-TOKEN': authorization
            //             }
            //         })
            //         .then(response => response.json())
            //         .then(result => {
            //             $scope.isRouteLoading = false;
            //             medifirstService.postLogging('Dokumen Klaim', 'Norec dokklaim_t', result.dokumen.norec, 
            //             'Upload Dokumen Klaim '+ namafile +' pada norec pasiendaftar_t ' + norec).then(function (res) {})
            //             toastr.success(" Berkas berhasil.");
            //             $scope.uploadKelengkapanNew();
            //         })
            //         .catch((error) => {
            //             $scope.isRouteLoading = false;
            //             toastr.error("Simpan Berkas gagal.");
            //         });
            //     }
            // });

			$('body ').on('click','.lihatDokumen',function(e){
                var noregistrasi = $(this).data("noreg");
                var namafile = $(this).data("namafile");
                var documentklaimfk = $(this).data("documentklaimfk");

                var confirm = $mdDialog.confirm()
                    .title('Peringatan')
                    .textContent('Harap pilih aksi yang diinginkan !')
                    .ariaLabel('Lucky day')
                    .cancel('Hapus Dok.')
                    .ok('Lihat Dok.')
                $mdDialog.show(confirm).then(function () {
                    var strBACKEND = baseTransaksi.replace('service/medifirst2000/', '')
                    window.open(strBACKEND + "service/storage/dokumenklaim?noregistrasi="+ noregistrasi + "&filename=" + namafile);
                }, function() {
                    var jsondel = {
                        "noregistrasi": noregistrasi,
                        "documentklaimfk": documentklaimfk,
                        "filename": namafile,
                    }
                    $scope.isRouteLoading = true;
                    medifirstService.post('bridging/inacbg/delete-dokumen-klaim', jsondel).then(function (data) {
                        $scope.isRouteLoading = false;
                        medifirstService.postLogging('Dokumen Klaim', 'noregistrasi pasiendaftar', noregistrasi, 
                        'Hapus Dokumen Klaim  pada No Registrasi ' + noregistrasi + ' dengan id dokumen klaim ' + documentklaimfk).then(function (res) {
                        })
                        $scope.uploadKelengkapanNew();
                    })
                })
            })

			$('body ').on('click','#cariDokumen',function(e){
                var id = $(this).data("id");
                var noregistrasi = $(this).data("noreg");
                $scope.isRouteLoading = true
				medifirstService.get(`bridging/inacbg/get-parameter?id=${id}&noregistrasi=${noregistrasi}&user=${$scope.user.namaLengkap}`).then(function (e) {
					$scope.isRouteLoading = false
                    for (let i = 0; i < e.data.data.length; i++) {
                        e.data.data[i].no = i + 1;
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


			$('body').on('change', '#filePasien', function(e){
				var id = $(this).data("id");
				var norec = $(this).data("norec");
				var namafile = $(this).data("namafile");
			
				if (e.target.files.length > 0) {
					$scope.isRouteLoading = true;
					const url = baseTransaksi + 'bridging/inacbg/post-dokumen-klaim';
					
					Array.from(e.target.files).forEach((file, index) => {
						if(file.type != "application/pdf") {
							toastr.error('File yang diizinkan dalam bentuk format PDF.');
							$scope.isRouteLoading = false;
							return;
						}
			
						const formData = new FormData();
						formData.append('fileBerkas', file);
						formData.append('noregistrasifk', norec);
						formData.append('documentklaimfk', id);
						formData.append('namafile', namafile + '_' + index);
			
						var arr = document.cookie.split(';');
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
							if (result.status === 201) {
								toastr.success("Berkas berhasil diupload: " + file.name);
							} else {
								toastr.error("Simpan Berkas gagal: " + file.name);
							}
							if (index === e.target.files.length - 1) {
								$scope.isRouteLoading = false;
								medifirstService.postLogging('Dokumen Klaim', 'Norec dokklaim_t', result.dokumen.norec, 
								'Upload Dokumen Klaim '+ namafile +' pada norec pasiendaftar_t ' + norec).then(function (res) {})
								toastr.success(" Berkas berhasil.");
								$scope.uploadKelengkapanNew();
							}
						})
						.catch((error) => {
							toastr.error("Simpan Berkas gagal: " + file.name);
							if (index === e.target.files.length - 1) {
								$scope.isRouteLoading = false;
							}
						});
					});
				}
			});

            $scope.columnCariDaftarDokumen = {
				selectable: 'row',
				pageable: true,
	            columns:[
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
                window.open(baseTransaksi 
                + dataItem.url 
                + dataItem.param + "&issimpanberkas=true&iddok="+dataItem.id+"&isberkasnoreg="+dataItem.noregistrasi+"&namafile=" + dataItem.namafile, 
                '_blank');
				// $scope.tutupdokumen();
            }

            $scope.tutupdokumen = function() {
                $scope.uploadKelengkapanNew();
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

				if(!($scope.importIcd.length) || $scope.importIcd.length == 0) {
					toastr.error('Tidak ada data ICD 10');
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
					.textContent('Diagnosa INAcbg sudah ada, apakah ingin tetap melakukan import?')
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
							loadicdInu()
							loadData()							
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
						loadicdInu()
						loadData()
					})
				}
				$scope.import1();
			}


			$scope.import1 = function() {
				if(!($scope.importIcd9.length) || $scope.importIcd9.length == 0) {
					toastr.error('Tidak ada data ICD 9');
					return;
				}
				$scope.now = new Date();
                var detaildiagnosatindakanpasien = {
                    objectpasienfk: $scope.dataPasienSelected.norec_apd,
                    tglpendaftaran: $scope.dataPasienSelected.tglregistrasi,
                    data: $scope.importIcd9,
					ketdiagnosa: 'unugrouper',
                }
                var objSave =
                {
                    detaildiagnosatindakanpasien: detaildiagnosatindakanpasien
                }

				if ($scope.item.countIcd9Inacbg > 0) {
					var confirm = $mdDialog.confirm()
					.title('Informasi')
					.textContent('Diagnosa ICD 9 INAcbg sudah ada, apakah ingin tetap melakukan import?')
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
							loadicdixIna()
							loadData()
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
						loadicdixIna()
						loadData()	
					})
				}
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
                       var data2 = {
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
                        sourceGrid.push(data2)
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

				$scope.isRouteLoading = true;
				var nama = medifirstService.getPegawaiLogin().namaLengkap;
				var ruangan = medifirstService.getPegawaiLogin().ruangan.namaruangan;
				medifirstService.get("tatarekening/detail-tagihan-bpjs/" + $scope.dataPasienSelected.noregistrasi + '?jenisdata=bill').then(function (dat) {
					$scope.isRouteLoading = false;
					window.open(baseTransaksi + "report/billing-detail?noregistrasi=" + $scope.dataPasienSelected.noregistrasi +'&nama='+nama+'&ruangan='+ruangan,  '_blank');
				});
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

			$scope.popupKonsul = function () {
				if ($scope.itemPopUp.nomor_register_sitb == undefined || $scope.itemPopUp.nomor_register_sitb == "") {
					toastr.error('Harap isi No SITB', 'Peringatan');
					return;
				}

				if ($scope.dataPasienSelected.objectjeniskelaminfk != undefined) {
					$scope.dataPasienSelected.objectjeniskelaminfk == 1 ? $scope.dataPasienSelected.jenisKelamin = 'LAKI-LAKI' : $scope.dataPasienSelected.jenisKelamin = 'PEREMPUAN';
				}
				$scope.popUpKonfirmasiValidasi.center().open();
			}

			$scope.batalKonfir = function () {
				$scope.popUpKonfirmasiValidasi.close()
			}

			// END ################

		}
	]);
});