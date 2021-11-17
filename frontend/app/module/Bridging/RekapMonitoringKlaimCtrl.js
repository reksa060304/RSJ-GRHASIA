define(['initialize', 'Configuration'], function (initialize, config) {
	'use strict';
	initialize.controller('RekapMonitoringKlaimCtrl', ['$mdDialog', '$state', '$q', '$scope', 'CacheHelper', 'DateHelper', 'ModelItem', 'CetakHelper', 'MedifirstService',
		function ($mdDialog, $state, $q, $scope, cacheHelper, dateHelper, ModelItem, cetakHelper, medifirstService) {

			$scope.dataVOloaded = true;
			$scope.now = new Date();
			$scope.item = {};
			$scope.popupExp = {};
			$scope.item.periodeAwal = $scope.now
			$scope.item.periodeAkhir = new Date();
			$scope.item.tanggalPulang = new Date();
			$scope.dataPasienSelected = {};
			$scope.cboDokter = false;
			$scope.pasienPulang = false;
			$scope.cboUbahDokter = true;
			$scope.isRouteLoading = false;
			$scope.cboUbahSEP = true;
			$scope.cboSep = false;
			$scope.item.jmlRows = 50
			loadCombo();
			loadData();
			// postIKTvisite()

			$scope.selectImage = function () {
                console.log($scope.itemimg.gambar.keterangan)
                $scope.itemimg.keterangan = $scope.itemimg.gambar.keterangan
                var temp = $scope.itemimg.gambar.filename.slice(0, $scope.itemimg.gambar.filename.indexOf('.'))
                $scope.itemimg.img = "http://10.122.250.11/service/medifirst2000/radiologi/images/pacs/" + temp + "/jpg"
            }

			function loadCombo() {
				var chacePeriode = cacheHelper.get('RekapMonitoringKlaimCtrl');
				if (chacePeriode != undefined) {
					//debugger;
					var arrPeriode = chacePeriode//.split('~');
					$scope.item.periodeAwal = new Date(arrPeriode[0]);
					$scope.item.periodeAkhir = new Date(arrPeriode[1]);
					if(arrPeriode[2]!= "")
						$scope.item.noReg = arrPeriode[2];	
					if(arrPeriode[3]!= "")	
						$scope.item.noRm = arrPeriode[3];	
					if(arrPeriode[4]!= "")
						$scope.item.nama = arrPeriode[4];	
					if(arrPeriode[5] !="")
						$scope.item.instalasi = arrPeriode[5];			
				} else {
					$scope.item.periodeAwal = new Date(moment($scope.now).format('YYYY-MM-DD 00:00'));
					$scope.item.periodeAkhir = new Date(moment($scope.now).format('YYYY-MM-DD 23:59'));//$scope.now;
					// $scope.item.tglpulang = $scope.now;					
				}
				medifirstService.get("registrasi/daftar-registrasi/get-data-combo-operator", false).then(function (data) {
					$scope.listDepartemen = data.data.departemen;
					$scope.listKelompokPasien = data.data.kelompokpasien;
					$scope.listDokter = data.data.dokter;
					$scope.listDokter2 = data.data.dokter;
					$scope.listRuanganBatal = data.data.ruanganall;
					$scope.item.PegawaiLogin = data.data.pegawaiLogin;
					// $scope.listRuanganApd = data.data.ruanganall;
					$scope.listPembatalan = data.data.pembatalan;
					$scope.sourceJenisDiagnosisPrimer = data.data.jenisdiagnosa;
					$scope.item.jenisDiagnosis = { id: data.data.jenisdiagnosa[1].id, jenisdiagnosa: data.data.jenisdiagnosa[1].jenisdiagnosa };
					$scope.listJenisPel = data.data.jenispelayanan;
				});
				medifirstService.getPart("registrasi/daftar-registrasi/get-data-diagnosa", true, true, 10).then(function (data) {
					//  debugger;
					$scope.sourceDiagnosisPrimer = data;
				});
				medifirstService.getPart('registrasi/get-daftar-combo-pegawai-all', true, 10).then(function (e) {
					$scope.listDataPegawai = e;
				})
				$scope.listJenis = [{ "id": 1, "name": "Hapus Semua" }, { "id": 2, "name": "Batal Rawat Inap" }]
			}
			$scope.getIsiComboRuangan = function () {
				$scope.listRuangan = $scope.item.instalasi.ruangan
			}

			$scope.formatTanggal = function (tanggal) {
				if (tanggal == 'null')
					return ''
				else
					return moment(tanggal).format('DD-MMM-YYYY HH:mm');
			}

			$scope.formatRupiah = function (value, currency) {
				return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
			}


			// function getNotifSEP(unitBpjs,unitSep,unitDept,unitPpk){
   //              if (unitBpjs == "BPJS" && (unitSep==null || unitSep==undefined || unitSep=="")) {
   //                  return "red";
   //              }else if(unitBpjs=="BPJS" && unitDept=="16" && unitPpk !="0240R008"){
   //                  return "koneng";
   //              }
   //          }

			var onDataBound = function (e) {
                var columns = e.sender.columns;
                var rows = e.sender.tbody.children();
                
                for (var j = 0; j < rows.length; j++) {
                  // sisa sekarang
                  var row = $(rows[j]);
                  var dataItem = e.sender.dataItem(row);

                  var unitBpjs = dataItem.get("kelompokpasien");
                  var unitDept = dataItem.get("deptid");
                  var unitPpk = dataItem.get("ppkrujukan");
                  var unitSep = dataItem.get("nosep");

                  var cellSEP= row.children().eq(13);       
                  cellSEP.addClass(getNotifSEP(unitBpjs,unitSep,unitDept,unitPpk));

  				  var isdiag = dataItem.get("isdiagnosis");
                  var cellDiag= row.children().eq(14);
                  cellDiag.addClass(getNotifDiag(isdiag));
    
                }
              }
			$scope.columnDaftarPasienPulang = {
				toolbar: [
					"excel",
					
					],
					excel: {
						fileName: "RekapMonitorintKlaim.xlsx",
						allPages: true,
					},
					excelExport: function(e){
						var sheet = e.workbook.sheets[0];
						sheet.frozenRows = 2;
						sheet.mergedCells = ["A1:K1"];
						sheet.name = "Orders";

						var myHeaders = [{
							value:"Rekapitulasi Monitoring Klaim",
							fontSize: 20,
							textAlign: "center",
							background:"#ffffff",
	                     // color:"#ffffff"
	                 }];

	                 sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70});
	             },
				selectable: 'row',
				pageable: true,
	            columns:[
				{
					"field": "no",
					"title": "No",
					"width":"30px",
				},
				{
					"field": "blnthn",
					"title": "Penagihan",
					"width":"80px"
				},
				{
					"field": "bulan_tagihan",
					"title": "Bulan Tagihan",
					"width":"90px"
				},
				{
					"field": "jml_ri",
					"title": "jml_ri",
					"width":"70px",
                    "template": "<span class='style-right'>{{formatRupiah('#: jml_ri #', '')}}</span>"
				}	,
				{
					"field": "jml_rj",
					"title": "jml_rj",
					"width":"70px",
                    "template": "<span class='style-right'>{{formatRupiah('#: jml_rj #', '')}}</span>"
				}	,
				{
					"field": "tarifrs_ri",
					"title": "tarifrs_ri",
					"width":"70px",
                    "template": "<span class='style-right'>{{formatRupiah('#: tarifrs_ri #', '')}}</span>"
				},
				{
					"field": "tarifrs_rj",
					"title": "tarifrs_rj",
					"width":"70px",
                    "template": "<span class='style-right'>{{formatRupiah('#: tarifrs_rj #', '')}}</span>"
				},
				{
					"field": "tarifina_ri",
					"title": "tarifina_ri",
					"width":"70px",
                    "template": "<span class='style-right'>{{formatRupiah('#: tarifina_ri #', '')}}</span>"
				},
				{
					"field": "tarifina_rj",
					"title": "tarifina_rj",
					"width":"70px",
                    "template": "<span class='style-right'>{{formatRupiah('#: tarifina_rj #', '')}}</span>"
				},
				{
					"field": "jmlklaim_ri",
					"title": "jmlklaim_ri",
					"width":"70px",
                    "template": "<span class='style-right'>{{formatRupiah('#: jmlklaim_ri #', '')}}</span>"
				},
				{
					"field": "jmlklaim_rj",
					"title": "jmlklaim_rj",
					"width":"70px",
                    "template": "<span class='style-right'>{{formatRupiah('#: jmlklaim_rj #', '')}}</span>"
				}	,
				{
					"field": "klaim_ri",
					"title": "klaim_ri",
					"width":"70px",
                    "template": "<span class='style-right'>{{formatRupiah('#: klaim_ri #', '')}}</span>"
				},
				{
					"field": "klaim_rj",
					"title": "klaim_rj",
					"width":"70px",
                    "template": "<span class='style-right'>{{formatRupiah('#: klaim_rj #', '')}}</span>"
				},
				{
					"field": "jmlpending_ri",
					"title": "jmlpending_ri",
					"width":"70px",
                    "template": "<span class='style-right'>{{formatRupiah('#: jmlpending_ri #', '')}}</span>"
				},
				{
					"field": "jmlpending_rj",
					"title": "jmlpending_rj",
					"width":"70px",
                    "template": "<span class='style-right'>{{formatRupiah('#: jmlpending_rj #', '')}}</span>"
				},
				{
					"field": "pending_ri",
					"title": "pending_ri",
					"width":"70px",
                    "template": "<span class='style-right'>{{formatRupiah('#: pending_ri #', '')}}</span>"
				},
				{
					"field": "pending_rj",
					"title": "pending_rj",
					"width":"70px",
                    "template": "<span class='style-right'>{{formatRupiah('#: pending_rj #', '')}}</span>"
				}	
			]};




			$scope.SearchData = function () {
				loadData()
			}
			function loadData() {
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
				var cacheIns =""
				var ins = ""
				if ($scope.item.instalasi != undefined) {
					var ins = "&deptId=" + $scope.item.instalasi.id
					cacheIns = {id:$scope.item.instalasi.id,departemen:$scope.item.instalasi.departemen}
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
				var cacheNoreg = ""
				if ($scope.item.noReg != undefined) {
					cacheNoreg = $scope.item.noReg
				}
				var cacheNoRm = ""
				if ($scope.item.noRm != undefined) {
					cacheNoRm = $scope.item.noRm
				}
				var cacheNama = ""
				if ($scope.item.nama != undefined) {
					cacheNama = $scope.item.nama
				}
				var jmlRows = "";
				if ($scope.item.jmlRows != undefined) {
					jmlRows = $scope.item.jmlRows
				}
				var isBlmInputSep = ""
                if ($scope.item.blmInputSep != undefined) {
                    var isBlmInputSep = "&isBlmInputSep=" + $scope.item.blmInputSep
                }
                var isSepTdkSesuai = ""
                if ($scope.item.sepTdkSesuai != undefined) {
                    var isSepTdkSesuai = "&isSepTdkSesuai=" + $scope.item.sepTdkSesuai
                }
                 var blmInputDiag = ""
                if ($scope.item.blmInputDiag != undefined) {
                    var blmInputDiag = "&isnotdiagnosis=" + $scope.item.blmInputDiag
                }
                var jenisPel = ""
                if ($scope.item.jenispel != undefined) {
                    jenisPel =  $scope.item.jenispel.id
                }


				$q.all([
					medifirstService.get("bridging/bpjs/get-rekap-monitoring-klaim?" +
						"tglawal=" + tglAwal +
						"&tglakhir=" + tglAkhir +
						reg + rm + nm + ins + rg + kp + dk
						+ '&jmlRows=' + jmlRows +
						isBlmInputSep + isSepTdkSesuai+blmInputDiag
						+'&jenisPel='+jenisPel),
				]).then(function (data) {
					$scope.isRouteLoading = false;
					for (var i = 0; i < data[0].data.data.length; i++) {
						data[0].data.data[i].no = i + 1
						// var umur = dateHelper.CountAge(new Date(data[0].data[i].tgllahir), new Date(data[0].data[i].tglregistrasi));
						// data[0].data[i].umur = umur.year + ' th, ' + umur.month + ' bln, ' + umur.day + ' hr'
					}
					$scope.dataDaftarPasienPulang = new kendo.data.DataSource({
						data: data[0].data.data,
						pageSize: 10,
						total: data[0].data.data,
						serverPaging: false,
						schema: {
							model: {
								fields: {
								}
							}
						}
					});


					var chacePeriode = {
						0 :	tglAwal ,
						1 : tglAkhir,
						2 : cacheNoreg,
						3 : cacheNoRm,
						4 : cacheNama,
						5 : cacheIns,
					}
					// + "~" +$scope.item.ruangan + "~" +$scope.item.kelompokpasien 
					// + "~" +$scope.item.dokter;
					cacheHelper.set('RekapMonitoringKlaimCtrl', chacePeriode);
				});

			};
			 $scope.rekamMedisElektronik = function () {


                if ($scope.dataPasienSelected == undefined) {
                    window.messageContainer.error("Pilih Dahulu Pasien!")
                    return
                }
                medifirstService.get("registrasi/daftar-registrasi/get-apd?noregistrasi="
						+ $scope.dataPasienSelected.noregistrasi
						+ "&objectruanganlastfk=" + $scope.dataPasienSelected.objectruanganlastfk
					).then(function (data) {
						
						
						
					
                // debugger;
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
                }
                cacheHelper.set('cacheRMelektronik', arrStr);
                $state.go('RekamMedis.VitalSign', {
                    noRec: data.data.ruangan[0].norec_apd
                })
			})
			}
			function getNotifSEP(unitBpjs,unitSep,unitDept,unitPpk){
                if (unitBpjs.indexOf("BPJS") > -1 && (unitSep==null || unitSep==undefined || unitSep=="")) {
                    return "red";
                }else if(unitBpjs.indexOf("BPJS") > -1 && unitDept=="16" && unitPpk !="1004R002"){
                    return "koneng";
				}
				// else if(unitBpjs.indexOf("BPJS") > -1 &&  (unitSep!=null && unitSep!=undefined && unitSep!="") ){
				// 	return "hejo";
				// }
            }
            function getNotifDiag(isdiag){
                if (isdiag == false) {
                    return "red";
                }			
            }

			// var onDataBound = function (e) {
   //              var columns = e.sender.columns;
   //              var rows = e.sender.tbody.children();
                
   //              for (var j = 0; j < rows.length; j++) {
   //                // sisa sekarang
   //                var row = $(rows[j]);
   //                var dataItem = e.sender.dataItem(row);

   //                var unitBpjs = dataItem.get("kelompokpasien");
   //                var unitDept = dataItem.get("deptid");
   //                var unitPpk = dataItem.get("ppkrujukan");
   //                var unitSep = dataItem.get("nosep");
   //                var cellSEP= row.children().eq(12);       
   //                cellSEP.addClass(getNotifSEP(unitBpjs,unitSep,unitDept,unitPpk));

   //              }
   //            }
			$scope.UbahDokter = function () {
				if ($scope.dataPasienSelected.noregistrasi == undefined) {
					toastr.error('Pilih Pasien dulu', 'Info');

					return
				}
				$scope.popupDokter.center().open();
				// $scope.cboDokter = true
				// $scope.cboUbahDokter=false
				// $scope.cboUbahSEP=false
			}
			$scope.EditSEP = function () {
				$scope.item.noPeserta = "";
				$scope.item.noSep = "";

				if ($scope.dataPasienSelected.norec == null) {
					messageContainer.error("Pasien Belum Dipilih!!")
					return;
				}
				if ($scope.dataPasienSelected.kelompokpasien == "Umum/Pribadi") {
					messageContainer.error("Tipe Pasien Umum!!")
					return;
				}
				if ($scope.dataPasienSelected.norec_pa == null) {
					messageContainer.error("Pemakaian Asuransi tidak ada")
					return;
				}

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
			$scope.batal = function () {
				$scope.cboDokter = false
				$scope.cboSep = false
				$scope.cboUbahDokter = true
				$scope.cboUbahSEP = true
			}
			$scope.PasienPulang = function () {
				var tglpulang = moment($scope.item.tanggalPulang).format('YYYY-MM-DD HH:mm:ss');
				$scope.cbopasienpulang = true
				$scope.cboUbahDokter = false
				if ($scope.dataPasienSelected.tglpulang != null) {
					$scope.item.tanggalPulang = $scope.dataPasienSelected.tglpulang
				} else {
					$scope.item.tanggalPulang = tglpulang
				}
			}
			$scope.batalsimpantglpulang = function () {
				$scope.cbopasienpulang = false
				$scope.cboUbahDokter = true
			}
			//debugger
			$scope.simpantglpulang = function () {
				//debugger
				var tglpulang = moment($scope.item.tanggalPulang).format('YYYY-MM-DD HH:mm:ss');
				var updateTanggal = {
					"noregistrasi": $scope.dataPasienSelected.noregistrasi,
					"tglpulang": tglpulang
				}
				medifirstService.post('registrasi/daftar-registrasi/update-tgl-pulang', updateTanggal).then(function (e) {
					loadData();
				})
				$scope.cbopasienpulang = false;
				$scope.cboUbahDokter = true;
			}
			$scope.kartupasien = function () {

				if ($scope.dataPasienSelected != undefined) {

					//##save identifikasi kartu pasien
					medifirstService.get("registrasi/identifikasi-kartu-pasien?norec_pd="
						+ $scope.dataPasienSelected.norec
					).then(function (data) {
						var datas = data.data;
					})
					//##end 

					// var fixUrlLaporan = cetakHelper.open("registrasi-pelayanan/kartuPasien?id=" + $scope.item.pasien.id);
					// window.open(fixUrlLaporan, '', 'width=800,height=600')

					//cetakan langsung service VB 6 by grh   
					var client = new HttpClient();
					client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-kartupasien=1&norec=' + $scope.dataPasienSelected.nocmfk + '&view=false', function (response) {
						// do something with response
					});
				}
			}
			$scope.simpanSep = function () {
				if ($scope.dataPasienSelected.kelompokpasien == "BPJS") {
					var updateSep = {
						"norec": $scope.dataPasienSelected.norec,
						"nokepesertaan": $scope.item.noPeserta,
						"nosep": $scope.item.noSep
					}
				} else {
					var updateSep = {
						"norec": $scope.dataPasienSelected.norec,
						"nokepesertaan": $scope.item.noPeserta,
						"nosep": null
					}
				}

				medifirstService.post('registrasi/daftar-registrasi/update-nosep', updateSep).then(function (e) {
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
				var keterangan = 'Input Sep - ' + $scope.item.noSep + ' No Registrasi ' + $scope.dataPasienSelected.noregistrasi
				medifirstService.get("sysadmin/logging/save-log-all?jenislog="
					+ jenisLog + "&referensi=" + referensi
					+ "&noreff=" + $scope.dataPasienSelected.norec_pa
					+ "&keterangan=" + keterangan
				).then(function (data) {
					$scope.item.noPeserta = "";
					$scope.item.noSep = "";
				})
			}
			$scope.batalSep = function () {
				$scope.item.noPeserta = "";
				$scope.item.noSep = "";
				$scope.cboSep = false
				$scope.cboUbahSEP = true
				$scope.cboDokter = false
				$scope.cboUbahDokter = true
			}

			$scope.klikGrid = function (dataPasienSelected) {
				if (dataPasienSelected != undefined) {
					$scope.item.namaDokter = { id: dataPasienSelected.pgid, namalengkap: dataPasienSelected.namadokter }
					// $scope.item.ruanganAntrian = {id:dataPasienSelected.objectruanganlastfk,namaruangan:dataPasienSelected.namaruangan}
				}
			}
			$scope.simpan = function () {
				var objSave =
				{
					norec: $scope.dataPasienSelected.norec,
					objectpegawaifk: $scope.item.namaDokter.id,
					objectruanganlastfk: $scope.dataPasienSelected.objectruanganlastfk
				}
				medifirstService.post('registrasi/daftar-registrasi/update-dokter', objSave).then(function (e) {
					$scope.popupDokter.close();
					loadData();

					$scope.cboDokter = false
					$scope.cboSep = false
					$scope.cboUbahDokter = true
					$scope.cboUbahSEP = true
				})
			}
			$scope.Detail = function () {
				if ($scope.dataPasienSelected.norec_br == "Pasien Batal") {
					// window.messageContainer.error('Pasien Sudah Batal');
					alert("Pasien Sudah Batal!!!")
					return;
				}

				if ($scope.dataPasienSelected.noregistrasi != undefined) {
					// var objSave = {
					// 	noregistrasi: $scope.dataPasienSelected.noregistrasi
					// }
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
			$scope.rekapTagihan = function () {

				if ($scope.dataPasienSelected.noregistrasi != undefined) {

					var obj = {
						noRegistrasi: $scope.dataPasienSelected.noregistrasi
					}

					$state.go('RekapTagihan', {
						dataPasien: JSON.stringify(obj)
					});
				}
			}
			$scope.DaftarRuangan = function () {
				if ($scope.dataPasienSelected.norec_br == "Pasien Batal") {
					// window.messageContainer.error('Pasien Sudah Batal');
					alert("Pasien Sudah Batal!!!")
					return;
				}

				if ($scope.dataPasienSelected.noregistrasi != undefined) {
					var obj = {
						noRegistrasi: $scope.dataPasienSelected.noregistrasi
					}


					cacheHelper.set('AntrianPasienDiperiksaNOREG', $scope.dataPasienSelected.noregistrasi);
					// cacheHelper.set('AntrianPasienDiperiksaNOREG', '');
					$state.go('DetailRegistrasi', {
						dataPasien: JSON.stringify(obj)
					});
				}
			}

			var HttpClient = function () {
				this.get = function (aUrl, aCallback) {
					var anHttpRequest = new XMLHttpRequest();
					anHttpRequest.onreadystatechange = function () {
						if (anHttpRequest.readyState == 4 && anHttpRequest.status < 400)
							aCallback(anHttpRequest.responseText);
					}

					anHttpRequest.open("GET", aUrl, true);
					anHttpRequest.send(null);
				}
			}
			$scope.cetakKartu = function () {
				$scope.dataLogin = JSON.parse(localStorage.getItem('pegawai'));
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

			$scope.formatNum = {
				format: "#.#",
				decimals: 0
			}
			$scope.labelpasien = function () {
				// if($scope.item != undefined){
				//     var fixUrlLaporan = cetakHelper.open("reporting/labelPasien?noCm=" + $scope.item.pasien.noCm);
				//     window.open(fixUrlLaporan, '', 'width=800,height=600')
				// }
				$scope.dats = {
					qty: 0
				}
				$scope.dialogCetakLabel.center().open();
			}

			$scope.pilihQty = function (data) {
				var listRawRequired = [
					"dats.qty|k-ng-model|kuantiti"
				];
				var isValid = ModelItem.setValidation($scope, listRawRequired);

				if (isValid.status) {
					var qty = data.qty;
					var qtyhasil = data.qty * 2;
					if (qty !== undefined) {
						// var fixUrlLaporan = cetakHelper.open("reporting/labelPasien?noCm=" + $scope.item.pasienDaftar.noRegistrasi + "&qty=" + qty);
						// window.open(fixUrlLaporan, '', 'width=800,height=600')
						//cetakan langsung service VB6 by grh

						//##save identifikasi label pasien
						medifirstService.get("registrasi/identifikasi-label?norec_pd="
							+ $scope.dataPasienSelected.norec + '&islabel=' + qtyhasil
						).then(function (data) {
							var datas = data.data;
						})
						//##end

						var client = new HttpClient();
						client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-labelpasien-satu=1&norec=' + $scope.dataPasienSelected.noregistrasi + '&view=false&qty=' + qty, function (response) {
							// do something with response
						});

					}
					$scope.dialogCetakLabel.close();
				} else {
					ModelItem.showMessages(isValid.messages);
				}
			};

			$scope.SummaryList = function () {
				if ($scope.dataPasienSelected.nocm != undefined) {
					// var fixUrlLaporan = cetakHelper.open("reporting/lapResume?noCm=" + $scope.item.pasien.noCm + "&tglRegistrasi=" + new moment($scope.item.pasienDaftar.tglRegistrasi).format('DD-MM-YYYY'));
					// window.open(fixUrlLaporan, '', 'width=800,height=600')

					//##save identifikasi summary list
					medifirstService.get("registrasi/identifikasi-sum-list?norec_pd="
						+ $scope.dataPasienSelected.norec
					).then(function (data) {
						var datas = data.data;
					})

					//cetakan langsung service VB6 by grh    
					var client = new HttpClient();
					client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-summarylist=1&norec=' + $scope.dataPasienSelected.nocm + '&view=false', function (response) {
						// do something with response
					});


				}
			}

			$scope.GelangPasien = function () {
				 var stt = 'false'
                if (confirm('View Lembar Gelang Pasien? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
				var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-gelangpasien=1&norec=' + $scope.dataPasienSelected.noregistrasi + '&view='+ stt +'&qty=' + 1, function (response) {
                    // do something with response
                });
			}

			$scope.Tracer = function () {
				if ($scope.dataPasienSelected.noregistrasi != undefined) {
					// var fixUrlLaporan = cetakHelper.open("reporting/lapTracer?noRegistrasi=" + $scope.item.pasienDaftar.noRegistrasi);
					// window.open(fixUrlLaporan, '', 'width=800,height=600')

					//##save identifikasi tracer
					medifirstService.get("registrasi/identifikasi-tracer?norec_pd="
						+ $scope.dataPasienSelected.norec
					).then(function (data) {
						var datas = data.data;
					})
					//##end

					//cetakan langsung service VB6 by grh    
					var client = new HttpClient();
					client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-tracer=1&norec=' + $scope.dataPasienSelected.noregistrasi + '&noCm=' + $scope.dataPasienSelected.nocm +  '&view=false' , function (response) {
						// do something with response
					});


				}
			}

			$scope.CetakSEP = function () {
				if ($scope.dataPasienSelected.noregistrasi != undefined && $scope.dataPasienSelected.kelompokpasien !== "Umum/Pribadi") {
					// var noSep = e.data.data === null ? "2423432" : e.data.data;
					// var fixUrlLaporan = cetakHelper.open("asuransi/asuransiBPJS?noSep=" + $scope.model.noSep);
					// window.open(fixUrlLaporan, '', 'width=800,height=600')


					//##save identifikasi sep
					medifirstService.get("registrasi/identifikasi-sep?norec_pd="
						+ $scope.dataPasienSelected.norec
					).then(function (data) {
						var datas = data.data;
					})
					//##end

					//http://127.0.0.1:1237/printvb/Pendaftaran?cetak-sep=1&norec=1708000087&view=true   
					//cetakan langsung service VB6 by grh    
					var client = new HttpClient();
					client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-sep-new=1&norec=' + $scope.dataPasienSelected.noregistrasi + '&view=false', function (response) {
						// do something with response
					});
				}
			}

			//operator/get-data-pasien-mau-batal
			$scope.RMK = function () {
				var norReg = ""
				if ($scope.dataPasienSelected.noregistrasi != undefined) {
					norReg = "noReg=" + $scope.dataPasienSelected.noregistrasi;
				}
				delete  $scope.item.diagnosisPrimer
				delete  $scope.item.keteranganDiagnosis
				if ($scope.dataPasienSelected.noregistrasi != undefined) {
					if($scope.dataPasienSelected.kelompokpasien == 'BPJS'  ||
						$scope.dataPasienSelected.kelompokpasien == 'Bpjs Rencana Rawat' ){
						if($scope.dataPasienSelected.iddiagnosabpjs){
							medifirstService.get("registrasi/get-diagnosa-saeutik?id=" 
								+$scope.dataPasienSelected.iddiagnosabpjs, true, true, 10)
	                        .then(function (xx) {
	        //                 	   $scope.sourceJenisDiagnosisPrimer.add({
									// 	id: 5,
									// 	jenisdiagnosa:'Diagnosa Awal',
									// 	// kddiagnosa: datas.kddiagnosa,
									// 	// ketdiagnosis: datas.ketdiagnosis,
									// 	// keterangan: datas.keterangan,
									// 	// namadiagnosa: datas.namadiagnosa,
									// 	// norec_apd: datas.norec_apd,
									// 	// norec_detaildpasien: datas.norec_detaildpasien,
									// 	// norec_diagnosapasien: datas.norec_diagnosapasien,
									// 	// noregistrasi: datas.noregistrasi
									// })
	                        	
	                        	
	                              $scope.sourceDiagnosisPrimer.add(xx.data[0])
	                              $scope.item.diagnosisPrimer =xx.data[0]

	                              // $scope.item.norec_apd = datas.norec_apd;
								  $scope.item.keteranganDiagnosis = '-';
								  $scope.icd10.center().open();
								 //  $scope.item.diagnosisPrimer = {
									// id: datas.id,
									// kddiagnosa: datas.kddiagnosa,
									// namadiagnosa: datas.namadiagnosa
								 //  }
	                        })
						}else{
							getDiagnosaRMK(norReg)
						}
                		

					}else{
						getDiagnosaRMK(norReg)
					}
					
					//     findPasien.getDiagnosaNyNoRec($scope.item.noRec).then(function(e){
					//         if (e.data.data.DiagnosaPasien.length > 0) {
					//             $scope.cetakBro();
					//         } else {
					//             $scope.item.jenisDiagnosis = $scope.sourceJenisDiagnosisPrimer[4];
					//             ModelItem.getDataDummyGeneric("Diagnosa", true, true, 10).then(function(data) {
					//                 $scope.sourceDiagnosisPrimer = data;
					//             });
					//             $scope.icd10.center().open();
					// 
					//         }
					//     })
					// }
				}
			}
			function getDiagnosaRMK(norReg){
				medifirstService.get("registrasi/daftar-registrasi/get-data-diagnosa-pasien?"
						+ norReg
						).then(function (data) {

							var datas = data.data.datas[0];
							if (datas != undefined && datas != null) {
								if (datas.jenisdiagnosa != null) {
									$scope.sourceDiagnosisPrimer.add({
										id: datas.id,
										jenisdiagnosa: datas.jenisdiagnosa,
										kddiagnosa: datas.kddiagnosa,
										ketdiagnosis: datas.ketdiagnosis,
										keterangan: datas.keterangan,
										namadiagnosa: datas.namadiagnosa,
										norec_apd: datas.norec_apd,
										norec_detaildpasien: datas.norec_detaildpasien,
										norec_diagnosapasien: datas.norec_diagnosapasien,
										noregistrasi: datas.noregistrasi
									})
								}

								$scope.item.norec_apd = datas.norec_apd;
								$scope.item.keteranganDiagnosis = datas.keterangan;
								$scope.item.diagnosisPrimer = {
									id: datas.id,
									kddiagnosa: datas.kddiagnosa,
									namadiagnosa: datas.namadiagnosa
								}
							}

							$scope.icd10.center().open();
						});

			}

			$scope.cetakRMK = function () {
				var norReg = ""
				if ($scope.dataPasienSelected.noregistrasi != undefined) {
					norReg = "noReg=" + $scope.dataPasienSelected.noregistrasi;
				}
				medifirstService.get("registrasi/daftar-registrasi/get-data-diagnosa-pasien?"
					+ norReg
				).then(function (data) {
					var dataDiagnosa = data.data.datas[0]

					if ($scope.item.jenisDiagnosis == undefined) {
						alert("Pilih Jenis Diagnosa terlebih dahulu!!")
						return
					}
					if ($scope.item.diagnosisPrimer == undefined) {
						alert("Pilih Kode Diagnosa dan Nama Diagnosa terlebih dahulu!!")
						return
					}

					var norecDiagnosaPasien = "";
					if (dataDiagnosa != undefined) {
						norecDiagnosaPasien = dataDiagnosa.norec_diagnosapasien;
					}

					var keterangan = "";
					if ($scope.item.keteranganDiagnosis == undefined) {
						keterangan = "-"
					}
					else {
						keterangan = $scope.item.keteranganDiagnosis;
					}


					$scope.now = new Date();
					var detaildiagnosapasien = {
						norec_dp: norecDiagnosaPasien,
						noregistrasifk: dataDiagnosa.norec_apd,
						objectdiagnosafk: $scope.item.diagnosisPrimer.id,
						objectjenisdiagnosafk: $scope.item.jenisDiagnosis.id,
						tglpendaftaran: moment($scope.dataPasienSelected.tglregistrasi).format('YYYY-MM-DD hh:mm:ss'),
						tglinputdiagnosa: moment($scope.now).format('YYYY-MM-DD hh:mm:ss'),
						keterangan: keterangan
					}
					medifirstService.post('registrasi/daftar-registrasi/save-diagnosa-rmk', detaildiagnosapasien).then(function (e) {
						$scope.item.keteranganDiagnosis = "";
						$scope.item.diagnosisPrimer = "";
						loadData()
						$scope.icd10.close();

						//##save identifikasi rmk
						medifirstService.get("registrasi/identifikasi-rmk?norec_pd="
							+ $scope.dataPasienSelected.norec 
						).then(function (data) {
							var datas = data.data;
						})
						//##end 

						var client = new HttpClient();
						client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-lembarmasukkeluar-byNorec=1&norec=' + dataDiagnosa.norec_apd + '&umur=' + $scope.dataPasienSelected.umur + '&view=false', function (response) {
						});
						// $scope.cetakBro();
					})
				});


				// var listRawRequired = [
				//     "item.diagnosisPrimer|k-ng-model|Diagnosa awal"
				// ]
				// var isValid = ModelItem.setValidation($scope, listRawRequired);

				// if(isValid.status){
				//     if($scope.item != undefined){
				//         var saveData = {
				//             pasien: {
				//                 id: $scope.item.pasien.id
				//             },
				//             tanggalPendaftaran: $scope.item.pasienDaftar.tglRegistrasi,
				//             diagnosis: [{
				//                 diagnosa: {
				//                     id: $scope.item.diagnosisPrimer.id
				//                 },
				//                 jenisDiagnosa: $scope.item.jenisDiagnosis,
				//                 keterangan: $scope.item.keteranganDiagnosis
				//             }],
				//             noRecPasienDaftar: $scope.item.noRec
				//         }
				//         managePasien.postSaveDiagnosaRMK(saveData).then(function(e){
				//             $scope.item.keteranganDiagnosis="";
				// $scope.item.diagnosisPrimer="";
				//             $scope.icd10.close();
				//             $scope.cetakBro();
				//         })
				//     }
				// } else {
				//     ModelItem.showMessages(isValid.messages);
				// }

			}
			$scope.batalCetakRMK = function () {
				$scope.item.keteranganDiagnosis = "";
				$scope.item.diagnosisPrimer = "";
				$scope.icd10.close();
			}


			$scope.cetakBro = function () {

			}

			$scope.BatalPeriksa = function () {
				var norReg = ""
				if ($scope.dataPasienSelected.noregistrasi != undefined) {
					norReg = "noReg=" + $scope.dataPasienSelected.noregistrasi;
				}
				medifirstService.get("registrasi/daftar-registrasi/get-data-pasien-mau-batal?"
					+ norReg
				).then(function (data) {
					var datas = data.data
					if (datas.length > 0)
						window.messageContainer.error('Pasien sudah Mendapatkan Pelayanan');
					else {
						$scope.item.ruanganBatal = { id: $scope.dataPasienSelected.objectruanganlastfk, namaruangan: $scope.dataPasienSelected.namaruangan }
						$scope.item.tglbatal = $scope.now;
						$scope.winDialog.center().open();
					}
				});
			}

			$scope.lanjutBatal = function () {
				var norReg = ""
				if ($scope.dataPasienSelected.noregistrasi != undefined) {
					norReg = "noReg=" + $scope.dataPasienSelected.noregistrasi;
				}
				medifirstService.get("registrasi/daftar-registrasi/get-data-pasien-mau-batal?"
					+ norReg
				).then(function (data) {
					var BatalPeriksa = {
						"norec": $scope.dataPasienSelected.norec,
						"tanggalpembatalan": moment($scope.item.tglbatal).format('YYYY-MM-DD hh:mm:ss'),
						"pembatalanfk": $scope.item.pembatalan.id,
						"alasanpembatalan": $scope.item.alasanBatal != undefined ? $scope.item.alasanBatal : '',

					}
					medifirstService.post('registrasi/daftar-registrasi/save-batal-registrasi', BatalPeriksa).then(function (e) {
						loadData();
						$scope.item.pembatalan = "";
						$scope.item.alasanBatal = "";
						$scope.item.ruanganBatal = "";

					})
				});
				$scope.winDialog.close();
			}

			$scope.batalBatal = function () {
				$scope.item.pembatalan = "";
				$scope.item.alasanBatal = "";
				$scope.item.ruanganBatal = "";
				$scope.winDialog.close();
			}

			$scope.InputDiagnosa = function () {
				$state.go('RiwayatRegistrasi', {
					nocm: $scope.dataPasienSelected.nocm,
					noregistrasi: $scope.dataPasienSelected.noregistrasi
				});
			}

			$scope.formatJam24 = {
				value: new Date(),			//set default value
				format: "dd-MM-yyyy HH:mm",	//set date format
				timeFormat: "HH:mm",		//set drop down time format to 24 hours
			}

			$scope.SuratKontrol = function () {
				if ($scope.dataPasienSelected.noregistrasi != undefined) {
					var obj = {
						noRegistrasi: $scope.dataPasienSelected.noregistrasi
					}

					$state.go('RincianTagihan', {
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
			}

			$scope.EditRegistrasi = function () {
				if ($scope.dataPasienSelected == undefined) {
					messageContainer.error("Pilih data dulu")
					return
				}
				else {
					var ruangan = "";
					medifirstService.get("registrasi/get-apd?noregistrasi="
						+ $scope.dataPasienSelected.noregistrasi
						+ "&objectruanganlastfk=" + $scope.dataPasienSelected.objectruanganlastfk
					).then(function (data) {
						var dataAntrian = data.data.data[0];

						$state.go('UmVnaXN0cmFzaVJ1YW5nYW4=', {
							noCm: $scope.dataPasienSelected.nocmfk
						});
						var cacheSet = $scope.dataPasienSelected.norec
							+ "~" + $scope.dataPasienSelected.noregistrasi
							+ "~" + dataAntrian.norec_apd;
						cacheHelper.set('CacheRegistrasiPasien', cacheSet);
					})
				}
			}
			$scope.EditPemakaianAsuransi = function () {
				if ($scope.dataPasienSelected == undefined) {
					messageContainer.error("Pilih data dulu")
					return
				}
				else {

					medifirstService.get("registrasi/get-apd?noregistrasi="
						+ $scope.dataPasienSelected.noregistrasi
						+ "&objectruanganlastfk=" + $scope.dataPasienSelected.objectruanganlastfk
					).then(function (data) {
						var dataAntrian = data.data.data[0];
						if (dataAntrian != undefined) {
							$state.go('UGVtYWthaWFuQXN1cmFuc2k=', {
								// $state.go('PemakaianAsuransi',{
								norecPD: $scope.dataPasienSelected.norec,
								norecAPD: dataAntrian.norec_apd,
							});

							var cacheSet = $scope.dataPasienSelected.objectasuransipasienfk
								+ "~" + $scope.dataPasienSelected.norec_pa
								+ "~" + $scope.dataPasienSelected.noregistrasi;

							cacheHelper.set('CachePemakaianAsuransi', cacheSet);
						}
					})
				}
			}

			$scope.popUpBL = function () {

				if ($scope.item != undefined) {
					//cetakan langsung service VB6 by grh
					var client = new HttpClient();
					client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-buktilayanan=1&norec='
						+ $scope.dataPasienSelected.noregistrasi + '&strIdPegawai='
						+ $scope.pegawai.id
						+ '&view=false', function (response) {

						});

					//##save identifikasibuktiLayanan
					medifirstService.get("registrasi/identifikasi-buktiLayanan?norec_pd="
						+ $scope.dataPasienSelected.norec
					).then(function (data) {
						var datas = data.data;
					})
					//##end 

				}

			}
			var status = '';
			$scope.popUpInputTindakan = function () {
				if ($scope.dataPasienSelected.noregistrasi == undefined) {
					toastr.error('Pilih Pasien dulu', 'Info');
					return
				}

				medifirstService.get("registrasi/get-status-close?noregistrasi=" + $scope.dataPasienSelected.noregistrasi, false).then(function (rese) {
					if (rese.data.status == true) {
						toastr.error('Pemeriksaan sudah ditutup tanggal ' + moment(new Date(rese.data.tglclosing)).format('DD-MMM-YYYY HH:mm'), 'Peringatan!')
						return;

					}
					var ruangan = "";
					medifirstService.get("registrasi/daftar-registrasi/get-apd?noregistrasi="
						+ $scope.dataPasienSelected.noregistrasi
						+ "&objectruanganlastfk=" + ruangan
					).then(function (data) {
						$scope.listRuanganApd = data.data.ruangan;
						$scope.item.ruanganAntrian = {
							id: $scope.listRuanganApd[0].id,
							namaruangan: $scope.listRuanganApd[0].namaruangan,
							norec_apd: $scope.listRuanganApd[0].norec_apd
						}
					})
					$scope.popupAntrians.center().open();
					$scope.showInputTindakan = true;
					$scope.showBuktiLayanan = false;
				});


			}

			$scope.inputTindakan = function () {

				$state.go('InputTindakan', {
					norecPD: $scope.dataPasienSelected.norec,
					norecAPD: $scope.item.ruanganAntrian.norec_apd,

				});
			}
			$scope.pegawai = ModelItem.getPegawai();
			$scope.buktiLayanan = function () {
				if ($scope.item != undefined) {
					//cetakan langsung service VB6 by grh
					var client = new HttpClient();
					client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-buktilayanan=1&norec='
						+ $scope.dataPasienSelected.noregistrasi + '&strIdPegawai='
						+ $scope.pegawai.id
						+ '&view=false', function (response) {

						});

				}
			}
			$scope.cetakNoAntrian = function () {
				if ($scope.item != undefined) {
					//cetakan langsung service VB 6 by grh   
					var client = new HttpClient();

					client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-buktipendaftaran=1&norec='
						+ $scope.dataPasienSelected.noregistrasi + '&petugas=' + $scope.item.PegawaiLogin + '&view=false', function (response) {
							// do something with response
						});


				}
			}
			$scope.batalRawat = function () {
				if ($scope.dataPasienSelected == undefined) {
					toastr.error('Pilih data dulu')
					return
				}
				$scope.item.ruanganBatal = { id: $scope.dataPasienSelected.objectruanganlastfk, namaruangan: $scope.dataPasienSelected.namaruangan }
				$scope.item.tglbatal = $scope.now;
				$scope.popUpHapusRegis.center().open();
			}

			$scope.saveHapusRegis = function () {
				if ($scope.item.pembatalan == undefined) {
					toastr.error('Pembatalan belum dipilih!')
					return
				}
				if ($scope.item.alasanBatal == undefined) {
					toastr.error('Alasan harus diisi!')
					return
				}
				if ($scope.item.jenis == undefined) {
					toastr.error('Jenis belum dipilih!')
					return
				}
				$scope.popUpHapusRegis.close();
				var confirm = $mdDialog.confirm()
					.title('Peringatan')
					.textContent('Semua PELAYANAN akan dihapus! Lanjut Simpan? ')
					.ariaLabel('Lucky day')
					.cancel('Tidak')
					.ok('Ya')
				$mdDialog.show(confirm).then(function () {
					$scope.masukanPassword();
				})

			}
			$scope.password = '|';
			$scope.masukanPassword = function () {
				$scope.popUpPassword.center().open()
				//var person = prompt("Masukan tgl libur", "");
			}
			$scope.nextSave = function () {
				if ($scope.item.password != undefined && $scope.item.password == $scope.password) {
					var BatalPeriksa = {
						"norec": $scope.dataPasienSelected.norec,
						"tanggalpembatalan": moment($scope.item.tglbatal).format('YYYY-MM-DD HH:mm:ss'),
						"pembatalanfk": $scope.item.pembatalan.id,
						"alasanpembatalan": $scope.item.alasanBatal,
						"jenishapus": $scope.item.jenis.id == 1 ? "hapusregis" : "batalranap",
					}
					managePhp.postData2('registrasipasien/batal-periksa-delete', BatalPeriksa).then(function (e) {
						clearHapusRegis()
						$scope.popUpPassword.close()
						loadData();
					})
				} else {
					toastr.error('Password Salah!', 'Error')
				}
			}
			$scope.batalHapusRegis = function () {
				$scope.popUpHapusRegis.close();
				clearHapusRegis()
			}
			function clearHapusRegis() {
				delete $scope.item.pembatalan
				delete $scope.item.alasanBatal
				delete $scope.item.ruanganBatal
				delete $scope.item.password
				delete $scope.item.jenis
			}

			$scope.resumeMedis = function () {
				if ($scope.dataPasienSelected == undefined) {
					toastr.error('Pilih data dulu')
					return
				}
				medifirstService.get('registrasi/get-apd?noregistrasi=' + $scope.dataPasienSelected.noregistrasi
					+ '&objectruanganlastfk=' + $scope.dataPasienSelected.objectruanganlastfk).then(function (e) {
						if (e.data.data.length > 0) {

							var arrrStr = {
								0: $scope.dataPasienSelected.nocm,
								1: $scope.dataPasienSelected.namapasien,
								2: $scope.dataPasienSelected.jeniskelamin,
								3: $scope.dataPasienSelected.noregistrasi,
								// 4: $scope.dataPasienSelected.umur,
								5: $scope.dataPasienSelected.kelompokpasien,
								6: $scope.dataPasienSelected.tglregistrasi,
								7: e.data.data[0].norec_apd,
								8: $scope.dataPasienSelected.norec,
								// 9: $scope.dataPasienSelected.objectkelasfk,
								// 10: $scope.dataPasienSelected.namakelas,
								11: $scope.dataPasienSelected.ruanganid,
								12: $scope.dataPasienSelected.namaruangan
							}
							cacheHelper.set('cacheRekamMedis', arrrStr);
							if ($scope.dataPasienSelected.objectdepartemenfk == 16 || $scope.dataPasienSelected.objectdepartemenfk == 25) {
								$state.go('RekamMedis.ResumeRI', {
									noRec: e.data.data[0].norec_apd
								})
							} else {
								$state.go('RekamMedis.ResumeRJ', {
									noRec: e.data.data[0].norec_apd
								})
							}						
						}
					})

			}
			// hasil hasil
			$scope.hasil = function (criteria) {
				if ($scope.dataPasienSelected == undefined) {
					toastr.error('Pilih data dulu')
					return
				}
				// $scope.isRouteLoading = true
				$scope.sourceHasilRad = new kendo.data.DataSource({
					data: [],
					pageSize: 10
				});
				if (criteria == 1) {
					$scope.showRadiologi = false
					$scope.ruanganMana = 'lab'
				} else {
					$scope.ruanganMana = 'rad'
					$scope.showRadiologi = true
				}


				var tanggal = $scope.now;
				var tanggalLahir = new Date($scope.dataPasienSelected.tgllahir);
				var umur = dateHelper.CountAge(tanggalLahir, tanggal);
				$scope.dataPasienSelected.umur = umur.year + ' thn ' + umur.month + ' bln ' + umur.day + ' hari';
				$scope.popupRad = $scope.dataPasienSelected
				//  managePhp.getData('laporan/get-order-' + $scope.ruanganMana + '?noregistrasi='
				medifirstService.get('registrasi/daftar-registrasi/get-daftar-order-hasil-' + $scope.ruanganMana + '?noregistrasi='
					+ $scope.dataPasienSelected.noregistrasi).then(function (e) {
						for (var i = e.data.daftar.length - 1; i >= 0; i--) {
							e.data.daftar[i].no = i + 1
						}
					if(criteria==2){			
			            for (var i = 0;  i < e.data.daftar.length; i++) {
			              let details = e.data.daftar[i].details;
			              let risorder = e.data.daftar[i].risorder;
			              for (let yy=0; yy < details.length; yy++) {
			                for (let zz=0; zz < risorder.length; zz++) {
			                  if (details[yy].norecopfk === risorder[zz].norec_op_fk) {
			                    e.data.daftar[i].details[yy].radiologiId = risorder[zz].patient_id + '-' + risorder[zz].order_cnt
			                  }
			                }
			              }
			            }
			        }

						$scope.isRouteLoading = false
						$scope.sourceHasilRad = new kendo.data.DataSource({
							data: e.data.daftar,
							pageSize: 10
						});
					});
				$scope.popUpHasilRad.center().open()
			}
			$scope.columnHasilRad = [
				{
					"field": "no",
					"title": "No",
					"width": "20px",
				},
				{
					"field": "tglorder",
					"title": "Tgl Order",
					"width": "50px",
				},
				{
					"field": "noorder",
					"title": "No Order",
					"width": "60px",
				},
				{
					"field": "dokter",
					"title": "Dokter",
					"width": "100px"
				},
				{
					"field": "namaruangantujuan",
					"title": "Ruangan",
					"width": "100px",
				},
				{
					"field": "statusorder",
					"title": "Keterangan",
					"width": "80px",
				}
			];
			$scope.detailHasilRad = function (dataItem) {
				return {
					dataSource: new kendo.data.DataSource({
						data: dataItem.details
					}),
					columns: [
						{
							field: "namaproduk",
							title: "Deskripsi",
							width: "300px"
						},
						{
							field: "qtyproduk",
							title: "Qty",
							width: "100px"
						},{
			              "command": [{
			                text: "Lihat Hasil",
			                click: hasilRadDetil,
			                imageClass: "k-icon k-i-download"
			              }],
			              hidden: !$scope.showRadiologi,
			          }]
				};
			};

			$scope.klikHasilRad = function (data, ruang) {
				if (data != undefined) {
					if (ruang == 'rad') {
						$scope.noOrder = data.noorder;

						medifirstService.get("registrasi/daftar-registrasi/get-acc-number-radiologi?noOrder=" + $scope.noOrder)
							.then(function (e) {
								$scope.dataRisOrder = e.data.data[0]
							})
					}
					if (ruang == 'lab') {

						medifirstService.get("registrasi/get-apd-detail?noregistrasi="
							+ $scope.dataPasienSelected.noregistrasi
							+ "&ruanganlast=" + $scope.dataPasienSelected.objectruanganlastfk)
							.then(function (e) {
								$scope.resDataAPD = e.data.data								
							})
					}

				}
			}

      var hasilRadDetil = function(e) {
        e.preventDefault();
        var tr = $(e.target).closest("tr");
        var dataItem = this.dataItem(tr);
        if (dataItem.radiologiId === undefined || dataItem.radiologiId === null || dataItem.radiologiId === '') {
          toastr.warning('Hasil belum ada', 'Peringatan')
        } else {
            // syamsu
            var datauserlogin = JSON.parse(localStorage.getItem('datauserlogin'));

            var patienIdMr = dataItem.radiologiId.replace('null','1')
            var client = new HttpClient();
  
            let viewer = null
  
            var errorFunc = function() {
                  toastr.error('Ada kesalahan pada jaringan ke server', 'Kesalahan')
            }
  
            let awal = true

            var noMrFunc = function (response) {
              if (response === undefined || response === null || response == '') {
                if (awal)  {
                  awal = false
                  client.get(config.urlPACSEngine + '/dcm4chee-arc/aets/TRANSMEDIC/rs/' + 
                  'studies?limit=1&includefield=all&offset=0&PatientID=' + patienIdMr.split('-')[0], 
                  noMrFunc, errorFunc)
                }  else {
                  toastr.warning('Hasil foto belum dikirim ke PACS', 'Peringatan')
                }
              } else {
                let data = JSON.parse(response)
                viewer = data[0]["0020000D"].Value[0]
                window.open(config.urlPACSViewer + "/viewer/" + datauserlogin.id + "/" + dataItem.norecopfk + "/" + dataItem.noorder + "/" + viewer, "pacs");
              }
            }
  
            client.get(config.urlPACSEngine + '/dcm4chee-arc/aets/TRANSMEDIC/rs/' + 
              'studies?limit=1&includefield=all&offset=0&PatientID=' + patienIdMr, 
              noMrFunc, errorFunc)
              // syamsu
        } 
      }

			$scope.lihatHasilRad = function () { // syamsu
				// if ($scope.dataHasilRad == undefined) {
				// 	toastr.error('Pilih data dulu', 'Info')
				// }

				// if ($scope.dataRisOrder != undefined) {
        //   // syamsu
        //   var datauserlogin = JSON.parse(localStorage.getItem('datauserlogin'));

        //   var patienIdMr = $scope.dataRisOrder.patient_id
        //   var client = new HttpClient();

        //   let viewer = null

        //   var errorFunc = function() {
        //         toastr.error('Ada kesalahan jaringan')
        //   }

        //   var noMrFunc = function (response) {
        //     if (response === undefined || response === null || response == '') {
        //       // Cari pakai no reg
        //       toastr.error('Hasil foto belum dikirim ke PACS')
        //     } else {
        //       let data = JSON.parse(response)
        //       viewer = data[0]["0020000D"].Value[0]
        //       window.open(config.urlPACSViewer + "/viewer/" + datauserlogin.id + "/" + $scope.dataHasilRad.norec + "/" + $scope.dataHasilRad.noorder + "/" + viewer, "pacs");
        //     }
        //   }

        //   client.get(config.urlPACSEngine + '/dcm4chee-arc/aets/TRANSMEDIC/rs/' + 
        //     'studies?limit=1&includefield=all&offset=0&PatientID=' + patienIdMr, 
        //     noMrFunc, errorFunc)
        //     // syamsu

				// } else {
				// 	toastr.info('Hasil belum ada', 'Info')

				// }

			}			

			$scope.tutup = function () {
				$scope.popUpHasilRad.close()
			}

			$scope.lihatHasilLab = function () {
				if ($scope.dataHasilRad == undefined) {
					toastr.error('Pilih data dulu');
					return
				}
				var arrStr = {
					0: $scope.dataPasienSelected.nocm,
					1: $scope.dataPasienSelected.namapasien,
					2: $scope.resDataAPD.jeniskelamin,
					3: $scope.dataPasienSelected.noregistrasi,
					4: $scope.dataPasienSelected.umur,
					5: $scope.dataPasienSelected.kelompokpasien,
					6: $scope.dataPasienSelected.tglregistrasi,
					7: $scope.resDataAPD.norec_apd,
					8: $scope.dataPasienSelected.norec_pd,
					9: $scope.resDataAPD.idkelas,
					10: $scope.resDataAPD.namakelas,
					11: $scope.resDataAPD.objectruanganfk,
					12: $scope.resDataAPD.namaruangan + '`',
					 13: '' ,
                    14: null ,
                    15: [] ,
				}

				cacheHelper.set('chaceHasilLab2', arrStr);
				$state.go('HasilLaboratorium', {
					// norecPd: $scope.dataHasilRad.norecpd,
					noOrder: $scope.dataHasilRad.noorder,
					// norecApd: $scope.resDataAPD.norec_apd,
				})

			}

			$scope.cetakIdentifikasiPasien = function () {
				if ($scope.dataPasienSelected == undefined) {
					toastr.error('Pilih data dulu')
					return
				}
				// $scope.popUpIdentitas.center().open();
				CetakWeh();
			}

			$scope.BatalCetak = function () {
				// HapusPenanggungJawab();
				$scope.popUpIdentitas.close();
			}
			var datas = [];
			$scope.CetakAh = function () {
				$scope.NocmTea = null;
				medifirstService.get("registrasi/get-data-detail-pasien?nocm="
					+ $scope.dataPasienSelected.nocm)
					.then(function (dat) {
						datas = dat.data.data;
						var umur = dateHelper.CountAge(new Date(datas.tgllahir), $scope.now);
						var bln = umur.month,
							thn = umur.year,
							day = umur.day
						var usia = (umur.year * 12) + umur.month;
						$scope.umur = thn + ' thn ' + bln + ' bln ' + day + ' hr '
						$scope.NocmTea = datas.nocm;
						if ($scope.dataItem != undefined && datas != undefined) {
							CetakWeh();
						} else {
							toastr.warning("Tidak Ada Data Yang Bisa Dicetak!");
							return;
						}

					})
			}

			function CetakWeh() {
				var user = medifirstService.getPegawaiLogin();
				var NomorRm = ""
				if ($scope.dataPasienSelected.nocm != undefined || $scope.dataPasienSelected.nocm != "") {
					NomorRm = $scope.dataPasienSelected.nocm;
				}
				var kelompokPasien = ""
                if ($scope.dataPasienSelected.kelompokpasien!= undefined || $scope.dataPasienSelected.kelompokpasien != "") {
                    kelompokPasien = $scope.dataPasienSelected.kelompokpasien ;
                }
				var stt = 'false'
				if (confirm('View Lembar Identitas Pasien? ')) {
					// Save it!
					stt = 'true';
				} else {
					// Do nothing! $scope.dataItem.pegawai.namalengkap
					stt = 'false'
				}

				var client = new HttpClient();
				client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-lembar-identitas=1&noCm=' + NomorRm + '&noregis=' +  $scope.dataPasienSelected.noregistrasi + '&caraBayar=' + kelompokPasien + '&Umur=' + $scope.umur + '&petugas='+ user.namaLengkap + '&view=' + stt, function (response) {
                    //aadc=response; 
                });
				$scope.NocmTea = null;
				$scope.dataItem = {}
				$scope.popUpIdentitas.close();
				// if ($scope.dataItem != undefined && datas != undefined) {                       
				//         CetakIdentitas()
				// }else{
				//     toastr.warning("Tidak Ada Data Yang Bisa Dicetak!");
				//     return;
				// }
			}		
			$scope.dataItem = {}
			$scope.cetakBlangkoBpjs = function () {
                if ($scope.dataPasienSelected != undefined && $scope.dataPasienSelected.kelompokpasien !== "Umum/Pribadi") {                    
                    // var PegawaiLogin = medifirstService.getPegawaiLogin();
					//##save identifikasi sep
					medifirstService.get('registrasi/get-daftar-combo-pegawai-all?pgid=2025', true, 10).then(function (e) {
                        $scope.listDataPegawai.add(e.data[0])
                        $scope.dataItem.pegawaiBlanko = e.data[0]
                        
                        $scope.popUpBlanko.center().open()              
                    })
                   
                } else {
                    toastr.warning("Pasien Selain Bpjs Tidak Bisa Cetak Blangko!");
                    return;
                }
			}		
			$scope.cetakBlanko = function(){
                if($scope.dataItem.pegawaiBlanko!=undefined){
                    var client = new HttpClient();
                    client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-blangko-bpjs=1&norec=' + $scope.dataPasienSelected.noregistrasi + '&Petugas=' + $scope.dataItem.pegawaiBlanko.id + '&view=false', function (response) {
                        // do something with response
                    });
                    $scope.popUpBlanko.close()
                }
               
            }
            $scope.batalBlanko =function(){
                // delete $scope.dataItem.pegawaiBlanko
                $scope.popUpBlanko.close()    
			}
			
			$scope.cetakLembarRanap = function () {
                $scope.popUpDua.center().open();
            }

            $scope.BatalCetakDua = function () {
                $scope.dataItem.pegawaiDua = {};
                $scope.popUpDua.close();
            }

            $scope.CetakRanap = function () {
                var NomorRm = ""
                if ($scope.dataPasienSelected.nocm != undefined || $scope.dataPasienSelected.nocm != "") {
                    NomorRm = $scope.dataPasienSelected.nocm ;
                }
                var kelompokPasien = ""
                if ($scope.dataPasienSelected.kelompokpasien!= undefined || $scope.dataPasienSelected.kelompokpasien != "") {
                    kelompokPasien = $scope.dataPasienSelected.kelompokpasien ;
                }
                var stt = 'false'
                if (confirm('View Lembar Rawat Inap? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }

                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-lembar-ranap=1&noCm=' + NomorRm + '&caraBayar=' + kelompokPasien + '&Umur=' + $scope.dataPasienSelected.umur + '&petugas=' + $scope.dataItem.pegawaiDua.namalengkap + '&noRegis=' + $scope.dataPasienSelected.noregistrasi + '&view=' + stt, function (response) {
                    //aadc=response; 
                });
                $scope.NocmTea = null;
                $scope.dataItem.pegawaiDua = undefined;
                $scope.popUpDua.close();
			}
			$scope.hapusPemakaianAsuransi = function(){
				if($scope.dataPasienSelected == undefined)return;
				var confirm = $mdDialog.confirm()
				.title('Peringatan')
				.textContent('Yakin mau menghapus data ?')
				.ariaLabel('Lucky day')
				.cancel('Tidak')
				.ok('Ya')
				$mdDialog.show(confirm).then(function () {
					medifirstService.post('registrasi/hapus-pemakaian-asuransi',{norec: $scope.dataPasienSelected.norec_pa}).then(function(e){
						loadData()
					})
				})

			}
			$scope.showPopUpEMR = function(){
				if($scope.dataPasienSelected == undefined){
					toastr.error('Pilih data dulu')
					return
				}
				var nocm = $scope.dataPasienSelected.nocm
				$scope.listCetakan =[
					{id : 1,nama:'Barang Milik Pasien',url: 'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-barang-milik-pasien&id='+nocm+'&view=true'},
					{id : 2,nama:'Pemberian Informasi',url: 'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-pemberian-informasi&id='+nocm+'&view=true'},
					{id : 3,nama:'Surat Pernyatakan Penolakan',url: 'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-surat-pernyataan-penolakan&id='+nocm+'&view=true'},
					{id : 4,nama:'Tindakan ECT',url: 'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-tindakan-ECT&id='+nocm+'&view=true'},
					{id : 5,nama:'Tindakan Injeksi',url: 'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-tindakan-injeksi&id='+nocm+'&view=true'},
					{id : 6,nama:'Tindakan Fiksasi Mekanik',url: 'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-tindakan-fiksasi-mekanik&id='+nocm+'&view=true'},
					{id : 7,nama:'Tindakan Anastesi Umum',url: 'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-tindakan-anastersi-Umum&id='+nocm+'&view=true'},
					{id : 8,nama:'Kebutuhan Rencana Pulang',url: 'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-kebutuhan-rencana-pulang&id='+nocm+'&view=true'},
					{id : 9,nama:'Tindakan Infus',url: 'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-tindakan-infus&id='+nocm+'&view=true'},
					{id : 10,nama:'Tindakan Kateter',url: 'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-tindakan-kateter&id='+nocm+'&view=true'},
				]
				$scope.popUpCetakanEMR.center().open()
			}
			$scope.cetakEMR = function(params){
				if(!params)return
				var client = new HttpClient();
				client.get(params.url, function (response) {
                    //aadc=response; 
                });
			}

			$scope.InsidenInternal = function () {
                if ($scope.dataPasienSelected.norec == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                }
                var chacePeriode = {
                    0: $scope.dataPasienSelected.norec,
                    1: 'InputInsidenInternal',
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }

                cacheHelper.set('InsidenInternalCtrl', chacePeriode);
                $state.go('InsidenInternal', {
                    kpid: $scope.dataPasienSelected.norec,
                    noOrder: 'InputInsidenInternal'
                });
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

			$scope.klikExpRad = function(dataExpRad){
				if (dataExpRad != undefined) {
					$scope.dataExpRad = dataExpRad;
				}
			}

			function HapusExp(){
				$scope.popupExp = {}
				$scope.sourceExpRad = new kendo.data.DataSource({
					data: [],
					pageSize: 10
				});
				$scope.popUpExpRad.close();
			}

			$scope.tutupExp = function(){
				HapusExp();
			}
			
			$scope.HasilExpertise = function(){				
				if ($scope.dataPasienSelected == undefined) {
					toastr.error('Pilih data dulu')
					return
				}

				$scope.sourceExpRad = new kendo.data.DataSource({
					data: [],
					pageSize: 10
				});
				
				var tanggal = $scope.now;
				var tanggalLahir = new Date($scope.dataPasienSelected.tgllahir);
				var umur = dateHelper.CountAge(tanggalLahir, tanggal);
				$scope.dataPasienSelected.umur = umur.year + ' thn ' + umur.month + ' bln ' + umur.day + ' hari';
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
                        $scope.item.dokter = { id: e.data[0].pegawaifk, namalengkap: e.data[0].namalengkap }
                        $scope.item.keterangan = e.data[0].keterangan.replace(/~/g, "\n")
                    }
                    $scope.popUpEkpertise.center().open();
                })

                medifirstService.get('radiologi/get-ekspertise?norec_pp=' + $scope.dataExpRad.norec_pp).then(function (e) {
                    if (e.data.status) {
                        if (e.data.data.list.length > 0) {
                            $scope.cekhasilrad = false;
                            $scope.listNamaGambar = e.data.data.list;
                            $scope.itemimg.gambar = { norec: e.data.data.list[0].norec, filename: e.data.data.list[0].filename }
                            $scope.itemimg.keterangan = e.data.data.list[0].keterangan
                            var temp = e.data.data.list[0].filename.slice(0, e.data.data.list[0].filename.indexOf('.'))
                            $scope.itemimg.img = config.urlPACSJpeg + "/service/medifirst2000/radiologi/images/pacs/" + temp + "/jpg"
                        }
                    } else {
                        $scope.cekhasilrad = true;
                        $scope.itemimg.img = "./images/noimage.png"
                        window.messageContainer.error("Belum ada Ekspertise");
                    }
                }).error(function (err) {
                    $scope.item.img = "./images/noimage.png"
                });
			}

			$scope.cetakEks = function(){
				if ($scope.norecHasilRadiologi != '') {
                    var local = JSON.parse(localStorage.getItem('profile'))
                    var nama = medifirstService.getPegawaiLogin().namaLengkap
                    if (local != null) {
                        var profile = local.id;
                        window.open(config.baseApiBackend + "report/cetak-ekspertise?norec=" + $scope.norecHasilRadiologi + '&kdprofile=' + profile
                            + '&nama=' + nama, '_blank');
                    }
				}
				HapusExp();
				$scope.popUpEkpertise.close();
			}			

			$scope.CheckImage = function () {                
                var ket = $scope.itemimg.keterangan == null ? '' : $scope.itemimg.keterangan
                var html = "<style>" + 
                "body{background-color: black; margin: 0px}"+ 
                ".frame-left{width: 70%;height: 73vh;float: left; text-align: center; border: 1px solid #ffffff}" + 
                ".frame-right{margin-left: 70%;height: 73vh;background: black; border: 1px solid #ffffff}" +
                "p{color: white; padding: 10px; margin: auto; font-family: 'Comfortaa', cursive;}" +
                "h3{color: white; padding: 30px 0px 0px 10px; margin: auto; font-family: 'Comfortaa', cursive;}" +
                ".container{margin: auto; padding: 10px; height: 85vh;width: 95%;}" +
                "img{max-width: 90%; max-height: 90%; margin-top: 15px; padding: 20px}" +
                "#header{background-color: #2a2d33;padding: 10px;}" +
                ".title-top{font-family: 'Comfortaa', cursive;}" +
                "</style>" + 
                "<head>" +
                    "<link href='https://fonts.googleapis.com/css2?family=Comfortaa&display=swap' rel='stylesheet'>" +
                    "<title>PACS Viewer</title>" +
                "</head>" +
                "<div id='header'>" +
                    "<div style='margin-top: 9px'><span style='color:#ffffff; margin-left: 35px; font-size: 20pt !important; font-weight: bold; margin-top: 9px'>" +
                        "<span class='title-top'>Medifirst</span>" +
                        "<span class='title-top' style='font-weight: bold; color:#10c4b2;'>2000</span>" +
                    "</span>" +
                    "<br>" +
                    "<span class='title-top' style='color:#ffffff; font-size: 10pt; font-style: italic; margin-left: 40px; margin-top: 2px;'>" +
                        "E-Healthcare | RSUD CIBINONG" +
                    "</span></div>" +
                "</div>" +
                "<div class='container'>" +
                    "<div class='frame-left'><img src=" + $scope.itemimg.img + "></></div>" +
                    "<div class='frame-right'><h3>Keterangan Gambar : </h3><p style='font-size: 13px;'>" + ket.replace(/\/n/g, '<br>') + "</p></div>" +
                "</div>"

                var tab = window.open('http://localhost:2222', '_blank');
                tab.document.write(html);
            }

		//** BATAS */
		}
	]);
});