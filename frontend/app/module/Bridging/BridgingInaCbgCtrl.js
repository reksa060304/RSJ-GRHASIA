define(['initialize', 'Configuration'], function (initialize,configuration) {
	'use strict';
	    var baseTransaksi = configuration.baseApiBackend;
	initialize.controller('BridgingInaCbgCtrl', ['$mdDialog', '$timeout', '$state', '$q', '$rootScope', '$scope', 'CacheHelper', 'DateHelper', 'MedifirstService',
		function ($mdDialog, $timeout, $state, $q, $rootScope, $scope, cacheHelper, dateHelper, medifirstService) {

			$scope.dataVOloaded = true;
			$scope.now = new Date();
			$scope.item = {};
			$scope.item.periodeAwal = new Date();
			$scope.item.periodeAkhir = new Date();
			$scope.item.periodeAwalMasal = new Date();
			$scope.item.periodeAkhirMasal = new Date();
			$scope.item.tanggalPulang = new Date();
			$scope.dataPasienSelected = {};
			$scope.cboDokter = false;
			$scope.pasienPulang = false;
			$scope.cboUbahDokter = true;
			$scope.isRouteLoading = false;
			$scope.item.jmlRows = 50
			$scope.jmlRujukanMasuk = 0
			$scope.jmlRujukanKeluar = 0
			var responData = "";
			var data2 = []
			var dataSave = []
			var dataSEPCMG = []
			var dataRow = {}
			let coderNIK = ''
			$scope.show_btn = true
			$scope.listStatus = [
				{id:'new_claim',name:'Klaim'},
				{id:'grouper',name:'Grouping'},
				{id:'claim_final',name:'Final Klaim'}
			]
			$scope.dataLogin = JSON.parse(window.localStorage.getItem('pegawai'));
			loadCombo();
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
				// $scope.listStatus = manageKasir.getStatus();
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
					if ($(this).text() == '1') { $(this).text('Belum di Grouping') }
					if ($(this).text() == 'Belum di Grouping') { $(this).addClass('red') }
					if ($(this).text() == 'Klaim') { $(this).addClass('green') }
					if ($(this).text() == 'Grouping') { $(this).addClass('green') }
					if ($(this).text() == 'Final Klaim') { $(this).addClass('green') }
					if ($(this).text() == '-') { $(this).addClass('red') }
					//   if ($(this).text() == '') {$(this).addClass('red')}
				})
			}
			$scope.columnDaftarPasienPulang = {
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
						// {
						// 	"field": "namaruangan",
						// 	"title": "Nama Ruangan",
						// 	"width":"150px",
						// 	"template": "<span class='style-left'>#: namaruangan #</span>"
						// },
						{
							"field": "namadokter",
							"title": "Nama Dokter",
							"width": "15%",
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
							"width": "10%",
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
						// {
						// 	"field": "status",
						// 	"title": "Status Berkas",
						// 	"width": "10%"
						// },
						{
							"field": "statusklaim",
							"title": "Status ",
							"width": "10%"
						},
						{
							"field": "statuskelengkapandok",
							"title": "Status Kelengkapan Dokumen",
							"width": "10%",
							"template": '# if( statuskelengkapandok==true) {# Sudah Lengkap # } else {# - #} #'
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

						$scope.listTarifRS =[{namatarif:'Prosedur Non Bedah' ,tarif:data.tarif_rs.prosedur_non_bedah},
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
						reg + rm + nm + ins + rg + kp + dk
						+ '&jmlRows=' + jmlRows
						+'&status='+status),
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
						coderNIK = data2[i].codernik
						var jenis_rawat = data2[i].jenis_rawat //ranap
						// if (data2[i].deptid != 16) {
						// 	jenis_rawat = 2
						// }
						var upgrade_class_ind = 0
						var upgrade_class_class = ''
						var add_payment_pct = 0
						if (data2[i].nokelasdijamin > data2[i].nokelasdaftar && data2[i].deptid == 16 && data2[i].namakelasdaftar != 'Non Kelas') {
							upgrade_class_ind = 1
							upgrade_class_class = data2[i].namakelasdaftar
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
			$scope.PasienPulang = function () {
				debugger;
				if ($scope.dataPasienSelected.tglpulang != undefined) {
					window.messageContainer.error("Pasien Sudah Dipulangkan!!!");
					return;
				}
				if ($scope.dataPasienSelected == undefined) {
					toastr.error('Pilih Data Pasien dulu', 'Caution');
				} else {
					medifirstService.get('registrasi/get-norec-apd?noreg=' + $scope.dataPasienSelected.noregistrasi
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
								"jenis_rawat": dataSave[i].jenis_rawat,    //"1",    
								"kelas_rawat": dataSave[i].kelas_rawat,    //"1",    
								"adl_sub_acute": dataSave[i].adl_sub_acute,    //"15",    
								"adl_chronic": dataSave[i].adl_chronic,    //"12",    
								"icu_indikator": dataSave[i].icu_indikator,    //"1",    
								"icu_los": dataSave[i].icu_los,    //"2",    
								"ventilator_hour": dataSave[i].ventilator_hour,    //"5",    
								"upgrade_class_ind": dataSave[i].upgrade_class_ind,    //"1",    
								"upgrade_class_class": dataSave[i].upgrade_class_class,    //"vip",    
								"upgrade_class_los": dataSave[i].upgrade_class_los,    //"5",    
								"add_payment_pct": "75",//dataSave[i].add_payment_pct ,    //"35",    
								"birth_weight": dataSave[i].beratbadan == null? "0": dataSave[i].beratbadan ,//$scope.dataPasienSelected.beratbadan,//dataSave[i].birth_weight ,    //"0",    
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
					console.log(e)
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
									"jenis_rawat": dataSave[i].jenis_rawat,    //"1",    
									"kelas_rawat": dataSave[i].kelas_rawat,    //"1",    
									"adl_sub_acute": dataSave[i].adl_sub_acute,    //"15",    
									"adl_chronic": dataSave[i].adl_chronic,    //"12",    
									"icu_indikator": dataSave[i].icu_indikator,    //"1",    
									"icu_los": dataSave[i].icu_los,    //"2",    
									"ventilator_hour": dataSave[i].ventilator_hour,    //"5",    
									"upgrade_class_ind": dataSave[i].upgrade_class_ind,    //"1",    
									"upgrade_class_class": dataSave[i].upgrade_class_class,    //"vip",    
									"upgrade_class_los": dataSave[i].upgrade_class_los,    //"5",    
									"add_payment_pct": "75",//dataSave[i].add_payment_pct ,    //"35",    
									"birth_weight": $scope.dataPasienSelected.beratbadan,//dataSave[i].birth_weight ,    //"0",    
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
								"biayaNaikkelas": biayanaikkelas
							}
							medifirstService.post('bridging/inacbg/save-proposi-bridging-inacbg', dataproposi).then(function (e) {
								//ini untuk proposional kan utang per tindakan
							})
							loadData()
							if (responData[0].dataresponse.hasOwnProperty("special_cmg_option") == true && responData[0].dataresponse.special_cmg_option.length > 1) {
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
											"jenis_rawat": dataSave[i].jenis_rawat,    //"1",    
											"kelas_rawat": dataSave[i].kelas_rawat,    //"1",    
											"adl_sub_acute": dataSave[i].adl_sub_acute,    //"15",    
											"adl_chronic": dataSave[i].adl_chronic,    //"12",    
											"icu_indikator": resp.statusrawatintensiv,//dataSave[i].icu_indikator ,    //"1",    
											"icu_los": resp.lamarawatintensiv,//dataSave[i].icu_los ,    //"2",    
											"ventilator_hour": dataSave[i].ventilator_hour,    //"5",    
											"upgrade_class_ind": resp.statusnaikkelas,    //"1",    dataSave[i].upgrade_class_ind ,
											"upgrade_class_class": resp.kelastertinggi,//dataSave[i].upgrade_class_class ,    //"vip",    
											"upgrade_class_los": resp.lamarawatnaikkelas,//dataSave[i].upgrade_class_los ,    //"5",    
											"add_payment_pct": "75",//dataSave[i].add_payment_pct ,    //"35",    
											"birth_weight": $scope.dataPasienSelected.beratbadan,//dataSave[i].birth_weight ,    //"0",    
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
										"biayaNaikkelas": biayanaikkelas
									}
									medifirstService.post('bridging/inacbg/save-proposi-bridging-inacbg', dataproposi).then(function (e) {
										//ini untuk proposional kan utang per tindakan
									})
									loadData()
									if (responData[0].dataresponse.hasOwnProperty("special_cmg_option") == true && responData[0].dataresponse.special_cmg_option.length > 1) {
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
				if ($scope.item.specialprocedure != undefined) {
					if (cmg != "") {
						cmg = cmg + '#' + $scope.item.specialprocedure.code
					} else {
						cmg = $scope.item.specialprocedure.code
					}
				}
				if ($scope.item.specialprosthesis != undefined) {
					if (cmg != "") {
						cmg = cmg + '#' + $scope.item.specialprosthesis.code
					} else {
						cmg = $scope.item.specialprosthesis.code
					}
				}
				if ($scope.item.specialinvestigation != undefined) {
					if (cmg != "") {
						cmg = cmg + '#' + $scope.item.specialinvestigation.code
					} else {
						cmg = $scope.item.specialinvestigation.code
					}
				}
				if ($scope.item.specialdrug != undefined) {
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
				var cmglength = "";
				medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
					// simpan response ke database
					responData = e.data.dataresponse;
					toastr.info(responData[0].dataresponse.metadata.message, 'INACBG');
					toastr.info(responData[0].dataresponse.response.cbg.description, 'INACBG');
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
						"biayaNaikkelas": biayanaikkelas
					}
					manageTataRekening.saveproposibridginginacbg(dataproposi).then(function (e) {
						// ini untuk proposional kan utang penjamin per tindakan
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
			$scope.grouper_2 = function () {
				if (dataSEPCMG == $scope.dataPasienSelected.nosep) {
					$scope.item.specialprocedure = ""
					$scope.item.specialprosthesis = ""
					$scope.item.specialinvestigation = ""
					$scope.item.specialdrug = ""
					$scope.popupCMG.center().open();
				}
				else {
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
				debugger;
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
					console.log('rujukan masuk : ' + response.data.total)
				})
				medifirstService.get('sisrute/rujukan/get?tanggal=' + now + '&create=true').then(function (response) {
					$scope.jmlRujukanKeluar = response.data.total
					console.log('rujukan masuk : ' + response.data.total)
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
										console.log('Update Yankes Rujukan')
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

			// END ################

		}
	]);
});