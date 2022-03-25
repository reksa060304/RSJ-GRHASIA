define(['initialize', 'Configuration'], function (initialize, config) {
	'use strict';
	initialize.controller('DaftarRegistrasiPasienOperatorCtrl', ['$mdDialog', '$state', '$q', '$scope', 'CacheHelper', 'DateHelper', 'ModelItem', 'CetakHelper', 'MedifirstService',
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

			$scope.EditPasien = function () {
				cacheHelper.set('cacheStatusPasien', 'LAMA');
				if ($scope.nocm != undefined) {

					cacheHelper.set('CacheRegisBayi', undefined);
					$state.go('RegistrasiPasienBaru', {
						noRec: 0,
						idPasien: $scope.idPasien
					})


				} else {
					messageContainer.error("Pilih data dulu!")
				}
			}

			$scope.selectImage = function () {
                console.log($scope.itemimg.gambar.keterangan)
                $scope.itemimg.keterangan = $scope.itemimg.gambar.keterangan
                var temp = $scope.itemimg.gambar.filename.slice(0, $scope.itemimg.gambar.filename.indexOf('.'))
                $scope.itemimg.img = "http://10.122.250.11/service/medifirst2000/radiologi/images/pacs/" + temp + "/jpg"
            }

			function loadCombo() {
				var chacePeriode = cacheHelper.get('DaftarRegistrasiPasienOperatorCtrl');
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
					$scope.listJenislabel = [{ id: 1, jenislabel: "Label Besar" }, { id: 2, jenislabel: "Label Kecil" }];
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
						fileName: "DaftarRegistrasiPasien.xlsx",
						allPages: true,
					},
					excelExport: function(e){
						var sheet = e.workbook.sheets[0];
						sheet.frozenRows = 2;
						sheet.mergedCells = ["A1:K1"];
						sheet.name = "Orders";

						var myHeaders = [{
							value:"Daftar Registrasi Pasien",
							fontSize: 20,
							textAlign: "center",
							background:"#ffffff",
	                     // color:"#ffffff"
	                 }];

	                 sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70});
	             },
				selectable: 'row',
				dataBound: onDataBound,
				pageable: true,
	            columns:[
				{
					"field": "no",
					"title": "No",
					"width":"30px",
				},
				{
					"field": "tglregistrasi",
					"title": "Tgl Registrasi",
					"width":"80px",
					"template": "<span class='style-left'>{{formatTanggal('#: tglregistrasi #')}}</span>"
				},
				{
					"field": "noregistrasi",
					"title": "NoReg",
					"width":"90px"
				},
				{
					"field": "nocm",
					"title": "NoRM",
					"width":"70px",
					"template": "<span class='style-center'>#: nocm #</span>"
				},
				{
					"field": "namapasien",
					"title": "Nama Pasien",
					"width":"150px",
					"template": "<span class='style-left'>#: namapasien #</span>"
				},
				{
					"field": "namaruangan",
					"title": "Nama Ruangan",
					"width":"150px",
					"template": "<span class='style-left'>#: namaruangan #</span>"
				},
					{
					"field": "namakelas",
					"title": "Kelas ",
					"width":"80px",
					// "template": '# if( kelasditanggung==null) {# - # } else {# #= kelasditanggung # #} #'
				},
				{
					"field": "namadokter",
					"title": "Nama Dokter",
					"width":"150px",
					"template": '# if( namadokter==null) {# - # } else {# #= namadokter # #} #'
				},
				{
					"field": "kelompokpasien",
					"title": "Kelompok Pasien",
					"width":"100px",
					"template": "<span class='style-left'>#: kelompokpasien #</span>"
				},
				{
					"field": "namarekanan",
					"title": "Penjamin",
					"width":"100px",
					"template": '# if( namarekanan==null) {# - # } else {# #= namarekanan # #} #'
				},
				{
					"field": "tglpulang",
					"title": "Tgl Pulang",
					"width":"80px",
					"template": "<span class='style-left'>{{formatTanggal('#: tglpulang #')}}</span>"
				},
				{
					"field": "jenispelayanan",
					"title": "Jenis Pelayanan",
					"width":"80px",
					// "template": "<span class='style-left'>{{formatTanggal('#: tglpulang #')}}</span>"
				},
				{
					"field": "kelasditanggung",
					"title": "Kelas Ditanggung",
					"width":"80px",
					"template": '# if( kelasditanggung==null) {# - # } else {# #= kelasditanggung # #} #'
				},
				{
					"field": "nosep",
					"title": "No SEP",
					"width":"150px",
					"template": '# if( nosep==null || nosep=="") {# - # } else {# #= nosep # #} #'
				},
				{
					"field": "isdiagnosis",
					"title": "Diagnosis",
					"width":"60px",
					"template": '# if( isdiagnosis==true) {# ✔ # } else {# - #} #'
				},
				{
					hidden: true,
					"field": "ppkrujukan",
					"title": "PPK",
					"width":"150px",
				},
				{
					hidden: true,
					"field": "deptid",
					"title": "DeptId",
					"width":"150px",
				},
				
				// {
				// 	"field": "statuspasien",
				// 	"title": "Status Pasien",
				// 	"width":"100px",
				// }				
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
					medifirstService.get("registrasi/daftar-registrasi/get-daftar-registrasi-pasien?" +
						"tglAwal=" + tglAwal +
						"&tglAkhir=" + tglAkhir +
						reg + rm + nm + ins + rg + kp + dk
						+ '&jmlRows=' + jmlRows +
						isBlmInputSep + isSepTdkSesuai+blmInputDiag
						+'&jenisPel='+jenisPel),
				]).then(function (data) {
					$scope.isRouteLoading = false;
					for (var i = 0; i < data[0].data.length; i++) {
						data[0].data[i].no = i + 1
						var umur = dateHelper.CountAge(new Date(data[0].data[i].tgllahir), new Date(data[0].data[i].tglregistrasi));
						data[0].data[i].umur = umur.year + ' th, ' + umur.month + ' bln, ' + umur.day + ' hr'
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
					cacheHelper.set('DaftarRegistrasiPasienOperatorCtrl', chacePeriode);
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
					client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-gelangpasien=1&norec=' + $scope.dataPasienSelected.nocmfk + '&view=false' + '&qty=1', function (response) {
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
					$scope.nocm = dataPasienSelected.nocm;
					$scope.idPasien = dataPasienSelected.nocmfk;
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

			// $scope.pilihQty = function (data) {
			// 	var listRawRequired = [
			// 		"dats.qty|k-ng-model|kuantiti"
			// 	];
			// 	var isValid = ModelItem.setValidation($scope, listRawRequired);

			// 	if (isValid.status) {
			// 		var qty = data.qty;
			// 		var qtyhasil = data.qty * 2;
			// 		if (qty !== undefined) {
			// 			// var fixUrlLaporan = cetakHelper.open("reporting/labelPasien?noCm=" + $scope.item.pasienDaftar.noRegistrasi + "&qty=" + qty);
			// 			// window.open(fixUrlLaporan, '', 'width=800,height=600')
			// 			//cetakan langsung service VB6 by grh

			// 			//##save identifikasi label pasien
			// 			medifirstService.get("registrasi/identifikasi-label?norec_pd="
			// 				+ $scope.dataPasienSelected.norec + '&islabel=' + qtyhasil
			// 			).then(function (data) {
			// 				var datas = data.data;
			// 			})
			// 			//##end

			// 			var client = new HttpClient();
			// 			client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-labelpasien-satu=1&norec=' + $scope.dataPasienSelected.noregistrasi + '&view=false&qty=' + qty, function (response) {
			// 				// do something with response
			// 			});

			// 		}
			// 		$scope.dialogCetakLabel.close();
			// 	} else {
			// 		ModelItem.showMessages(isValid.messages);
			// 	}
			// };
			$scope.pilihQty = function (data) {
				if ($scope.item.jenislabel == undefined) {
					toastr.warning("Jenis Label Belum Dipilih");
					return;
				}
				var listRawRequired = [
					"dats.qty|k-ng-model|kuantiti"
				];
				var isValid = ModelItem.setValidation($scope, listRawRequired);

				if (isValid.status) {
					if ($scope.item.jenislabel.id == 2) {
						var qty = data.qty;
						var qtyhasil = data.qty * 1;
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
					}else if ($scope.item.jenislabel.id == 1) {
						var qty = data.qty;
						var qtyhasil = data.qty * 1;
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
							client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-labelpasienbayi-satu=1&norec=' + $scope.dataPasienSelected.noregistrasi + '&view=false&qty=' + qty, function (response) {
								// do something with response
							});

						}
						$scope.dialogCetakLabel.close();
					}
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
					$scope.isRouteLoading = true;
					medifirstService.get("registrasi/identifikasi-tracer?norec_pd="
						+ $scope.dataPasienSelected.norec
					).then(function (data) {
						var datas = data.data;
						$scope.isRouteLoading = false;
						var client = new HttpClient();
						client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-tracer=1&norec=' + $scope.dataPasienSelected.noregistrasi + '&noCm=' + $scope.dataPasienSelected.nocm +  '&view=false' , function (response) {
							// do something with response
						});
					})
					//##end

					//cetakan langsung service VB6 by grh    
					
					// client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-tracer=1&norec=' + $scope.dataPasienSelected.noregistrasi + '&noCm=' + $scope.dataPasienSelected.nocm +  '&view=false' , function (response) {
					// 	// do something with response
					// });					
				}
			}

			var statusBridgingTemporary ='false'
         
            medifirstService.get('sysadmin/settingdatafixed/get/statusBridgingTemporary').then(function (dat) {
                statusBridgingTemporary = dat.data
            })
			$scope.CetakSEP = function () {
				if ($scope.dataPasienSelected.noregistrasi != undefined && $scope.dataPasienSelected.kelompokpasien !== "Umum/Pribadi") {
				
					if ($scope.dataPasienSelected.nosep === "" || $scope.dataPasienSelected.nosep === undefined) {
						window.messageContainer.error("No SEP Tidak Ada");
						return;
					}
					if(statusBridgingTemporary =='false'){
						// medifirstService.get("bridging/bpjs/cek-sep?nosep=" + $scope.dataPasienSelected.nosep).then(function (e) {
	                    //         if (e.data.metaData.code === "200" || e.data.metaData.code === "404") {
	                    //             var client = new HttpClient();
	                    //             client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-sep-new=1&norec=' + $scope.dataPasienSelected.noregistrasi + '&view=false', function (response) {
	                    //                 // do something with response
	                    //             });
	                    //         } else {
	                    //             window.messageContainer.error('SEP tidak ada atau tidak sesuai dengan Vclaim mohon dicek kembali !');
	                    //          }
	                    //     });
						let json = {
							"url": "SEP/" + $scope.dataPasienSelected.nosep ,
							"method": "GET",
							"data": null
						}
						medifirstService.postNonMessage("bridging/bpjs/tools", json).then(function (e) {
							if (e.data.metaData.code == 200) {
								cetakSEP(e.data.response)
							}
							else toastr.info(e.data.metaData.message, 'Info')
						})
					}else{
						 var client = new HttpClient();
                         client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-sep-new=1&norec=' + $scope.dataPasienSelected.noregistrasi + '&view=false', function (response) {
                            // do something with response
                         });
					
					}
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
						if( $scope.dataPasienSelected.nosep == null ||  $scope.dataPasienSelected.nosep==''){return}
							medifirstService.deleteNonMessage("bridging/bpjs/delete-sep?nosep=" + $scope.dataPasienSelected.nosep).then(function (e) {
								if (e.data.metaData.code === "200") {
									var msgLogging = 'DELETE No SEP '+ $scope.model.noSep +' di No Registrasi ' + $scope.item.pasien.noregistrasi
									medifirstService.postLogging('Pemakaian Asuransi', 'nosep pemakaianasuransi_t', $scope.model.noSep, msgLogging).then(function (res) {})
									var arrStatus = {
										noSep: $scope.model.noSep
									}
									medifirstService.postNonMessage('registrasi/hapus-sep', arrStatus).then(function (e) {})
									window.messageContainer.log("Success Delete SEP");
									$scope.model.generateNoSEP = false;
									$scope.disableSEP = false;
									$scope.model.noSep = '';
								}
								else {
									window.messageContainer.error(e.data.metaData.message);
								}
							})
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
				if ($scope.dataPasienSelected == undefined) {
					toastr.error("Data Belum Dipilih!");
				}
				// if ($scope.item != undefined) {
					//cetakan langsung service VB6 by grh
					medifirstService.get("registrasi/get-apd?noregistrasi="
						+ $scope.dataPasienSelected.noregistrasi
						+ "&objectruanganlastfk=" + $scope.dataPasienSelected.objectruanganlastfk
					).then(function (e) {						
						var norecApd = e.data.data[0].norec_apd
						var pegawai = medifirstService.getPegawai();
						var stt = 'false'
	                    if (confirm('View Bukti Layanan? ')) {
	                        // Save it!
	                        stt = 'true';
	                    } else {
	                        // Do nothing!
	                        stt = 'false'
	                    }                      
	                    var client = new HttpClient();                 
	                    client.get('http://127.0.0.1:1237/printvb/kasir?cetak-nota-layanan=1&norec=' + norecApd + '&strIdPegawai=' + pegawai.id + '&view=' + stt, function (response) {
	                        // do something with response
	                    });
					})
					// var client = new HttpClient();
					// client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-buktilayanan=1&norec='
					// 	+ $scope.dataPasienSelected.noregistrasi + '&strIdPegawai='
					// 	+ $scope.pegawai.id
					// 	+ '&view=false', function (response) {

					// 	});

					//##save identifikasibuktiLayanan
					medifirstService.get("registrasi/identifikasi-buktiLayanan?norec_pd="
						+ $scope.dataPasienSelected.norec
					).then(function (data) {
						var datas = data.data;
					})
					//##end 
				// }
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
						hapusSep()
						// loadData()
					})
				})

			}
			function hapusSep() {
         
                medifirstService.deleteNonMessage("bridging/bpjs/delete-sep?nosep=" + $scope.dataPasienSelected.nosep).then(function (e) {
                    if (e.data.metaData.code === "200") {
                        window.messageContainer.log("Success Delete SEP");

						var msgLogging = 'Hapus Pemakaian Asuransi di No Registrasi ' + $scope.dataPasienSelected.noregistrasi
                        medifirstService.postLogging('Pemakaian Asuransi', 'Norec pasiendaftar_t', $scope.dataPasienSelected.noregistrasi, msgLogging).then(function (res) {})
						medifirstService.post('registrasi/hapus-pemakaian-asuransi',{norec: $scope.dataPasienSelected.norec_pa}).then(function(e){
							loadData()
						})
                    }
                    else {
                        window.messageContainer.error(e.data.metaData.message);
                    }
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
			$scope.kontrol = {
				tglAwal :new Date(),
				tglAkhir:new Date()
			}
			$scope.listJenis = [
                { id: 1, name: 'SPRI' }, { id: 2, name: 'Rencana Kontrol' }
            ];
			// $scope.kontrol.jenisPelayanan = $scope.listJenis[1]
			$scope.kontrol.tglRencanaKontrol = new Date()
			$scope.listFilter = [{ kode: 2, nama: 'Tgl Rencana Kontrol' }, { kode: 1, nama: 'Tgl Entri' }]
            $scope.kontrol.filter = $scope.listFilter[0]
            $scope.showSep = false
			$scope.showPopRencana = function(){
				if($scope.dataPasienSelected ==  undefined){
					toastr.error('Pilih data dulu')
					return 
				}
				delete $scope.kontrol.sep
				delete $scope.kontrol.noKartu
				$scope.kontrol.noKartu  = $scope.dataPasienSelected.nobpjs
				$scope.kontrol.sep  = $scope.dataPasienSelected.nosep
				$scope.dataSourceSPRI = new kendo.data.DataSource({
                        data: [],
                        pageSize: 10,
                        serverPaging: false,
                });
				loadGridKontrol()
				$scope.popUpSPRI.center().open()
			}
			$scope.batalSPRI = function(){
				$scope.popUpSPRI.close()
			}
			$scope.columnGridSPRI = [{
                "field": "no",
                "title": "No",
                "width": "40px",
                "attributes": { align: "center" }

            },
            {
                "field": "noSuratKontrol",
                "title": "No Surat",
                "width": "230px"
            },
            {
                "field": "namaJnsKontrol",
                "title": "Jenis",
                "width": "100px"
            },
            {
                "field": "tglRencanaKontrol",
                "title": "Tgl Rencana Kontrol",
                "width": "100px"
            }, {

                "field": "tglTerbitKontrol",
                "title": "Tgl Entri ",
                "width": "100px"
            },
            {

                "field": "noSepAsalKontrol",
                "title": "No SEP Asal",
                "width": "100px"
            },
            {

                "field": "namaPoliAsal",
                "title": "Poli Asal",
                "width": "100px"
            },
            {

                "field": "namaPoliTujuan",
                "title": "Poli Tujuan",
                "width": "150px"
            },
            {

                "field": "namaDokter",
                "title": "DPJP",
                "width": "200px"
            }]

			$scope.cariNoka = function () {
                $scope.enabledDetail = false
                if ($scope.kontrol.noKartu == null) {
					toastr.error('No Kartu harus di isi')
					return 
				}
                let json = {

                    "url": "Peserta/nokartu/" + $scope.kontrol.noKartu  + "/tglSEP/" + moment(new Date()).format('YYYY-MM-DD'),
                    "method": "GET",
                    "data": null
                }
                medifirstService.postNonMessage("bridging/bpjs/tools", json).then(function (e) {

                    if (e.data.metaData.code === "200") {
                        $scope.enabledDetail = true;
                        $scope.kontrol.peserta = e.data.response.peserta

                    } else {
                        toastr.error(e.data.metaData.message)
                    }
                })
            }
			
            $scope.cariSep = function () {
                $scope.enabledDetail = false
				if ($scope.kontrol.sep == null) {
					toastr.error('No SEP harus di isi')
					return 
				}
          
                let json = {
                    "url": "RencanaKontrol/nosep/" + $scope.kontrol.sep,
                    "method": "GET",
                    "data": null
                }
                medifirstService.postNonMessage("bridging/bpjs/tools", json).then(function (e) {
                 
                    if (e.data.metaData.code === "200") {
                        $scope.enabledDetail = true;
                        $scope.kontrol.noSep = e.data.response.noSep
                        $scope.kontrol.jnsPelayanan = e.data.response.jnsPelayanan
                        $scope.kontrol.tglSep = e.data.response.tglSep
                        $scope.kontrol.poli = e.data.response.poli
                        $scope.kontrol.diagnosa = e.data.response.diagnosa
                        $scope.kontrol.noKartu = e.data.response.peserta.noKartu

                    } else {
                        toastr.error(e.data.metaData.code)
                    }
                })
            }
			$scope.$watch('kontrol.jenisPelayanan', function (e) {
                if (!e) return;
                if (e.id == 1) {
                    $scope.showSep = false
					$scope.cariNoka()
                } else {
                    $scope.showSep = true
					$scope.cariSep()
                }
            })
			medifirstService.get("bridging/bpjs/get-ruangan-rj").then(function (data) {
                $scope.ruangans = data.data.data;
            })
			$scope.$watch('kontrol.poliKontrol', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    if (newValue.kdinternal == null) {
                        newValue.kdinternal = ""
                    }
					/* grhasia ga bisa pake fitur dibawah jadi diganti pakai ws bpjs antrian */
                    // let json = {
                    //     "url": "RencanaKontrol/JadwalPraktekDokter/JnsKontrol/" + $scope.kontrol.jenisPelayanan.id
                    //         + "/KdPoli/" + newValue.kdinternal + "/TglRencanaKontrol/" + moment($scope.kontrol.tglRencanaKontrol).format('YYYY-MM-DD'),
                    //     "method": "GET",
                    //     "data": null
                    // }
					
                    // medifirstService.postNonMessage("bridging/bpjs/tools", json).then(function (e) {
                    //     if (e.data.metaData.code == 200) {
                    //         for (let x = 0; x < e.data.response.list.length; x++) {
                    //             const element = e.data.response.list[x];
                    //             element.kode = element.kodeDokter
                    //             element.nama = element.namaDokter
                    //         }
                    //         $scope.listDPJP = e.data.response.list;
                    //     }
                    //     else {
                    //         toastr.info('Dokter DPJP tidak ada', 'Info')
                    //     }

                    // })
					medifirstService.get("bridging/bpjs/antrean/v2/get-jadwal-dokter?kodepoli=" + newValue.kdinternal + "&tanggal=" + moment($scope.kontrol.tglRencanaKontrol).format('YYYY-MM-DD'), false).then(
						function (data) {
							if (data.data.metaData.code == 200) {
								for (let x = 0; x < data.data.response.length; x++) {
									const element = data.data.response[x]
									element.kode = element.kodedokter
									element.nama = element.namadokter
								}
								$scope.listDPJP = data.data.response
							}
							else {
								toastr.info('Dokter DPJP tidak ada', 'Info')
							}

						}
					).then(function () {
                        toastr.info('Dokter DPJP tidak ada', 'Info')
                        //$scope.isRouteLoading = false;
                    });

                }
            })
			$scope.saveSPRI = function () {
				$scope.isSaves =true
                if ($scope.kontrol.jenisPelayanan.id == 1) {
                    if ($scope.kontrol.noSuratKontrol == undefined) {
                        // insert

                        let json = {
                            "url": "RencanaKontrol/InsertSPRI",
                            "method": "POST",
                            "data": {
                                "request": {
                                    "noKartu": $scope.kontrol.noKartu,
                                    "kodeDokter": $scope.kontrol.kodeDokter.kode,
                                    "poliKontrol": $scope.kontrol.poliKontrol.kdinternal,
                                    "tglRencanaKontrol": moment($scope.kontrol.tglRencanaKontrol).format('YYYY-MM-DD'),
                                    "user": "Ramdanegie"
                                }
                            }
                        }

                        medifirstService.postNonMessage('bridging/bpjs/tools', json).then(function (e) {
                            if (e.data.metaData.code == '200') {
								$scope.kontrol.resNoSurat = e.data.response.noSPRI
								saveSPRILokal('insert')
								
                                toastr.success(e.data.response.noSPRI, e.data.metaData.message);
                            } else {
								$scope.isSaves =false
                                toastr.error(e.data.metaData.message, 'Info');
                            }
                        })
                    } else {
                        // update
                        let json = {
                            "url": "RencanaKontrol/UpdateSPRI",
                            "method": "PUT",
                            "data": {
                                "request": {
                                    "noSPRI": $scope.kontrol.noSuratKontrol,
                                    "kodeDokter": $scope.kontrol.kodeDokter.kode,
                                    "poliKontrol": $scope.kontrol.poliKontrol.kdinternal,
                                    "tglRencanaKontrol": moment($scope.kontrol.tglRencanaKontrol).format('YYYY-MM-DD'),
                                    "user": "Ramdanegie"
                                }
                            }
                        }


                        medifirstService.postNonMessage('bridging/bpjs/tools', json).then(function (e) {
                            if (e.data.metaData.code == '200') {
								$scope.kontrol.resNoSurat = e.data.response.noSPRI
								saveSPRILokal('update')
								
                                toastr.success(e.data.response.noSPRI, e.data.metaData.message);
                            } else {
								$scope.isSaves =false
                                toastr.error(e.data.metaData.message, 'Info');
                            }
                        })
                    }
                } else {
                    if ($scope.kontrol.noSuratKontrol == undefined) {
                        // insert
                        let json = {
                            "url": "RencanaKontrol/insert",
                            "method": "POST",
                            "data": {
                                "request": {
                                    "noSEP": $scope.kontrol.noSep,
                                    "kodeDokter": $scope.kontrol.kodeDokter.kode,
                                    "poliKontrol": $scope.kontrol.poliKontrol.kdinternal,
                                    "tglRencanaKontrol": moment($scope.kontrol.tglRencanaKontrol).format('YYYY-MM-DD'),
                                    "user": "Ramdanegie"
                                }
                            }
                        }

                        medifirstService.postNonMessage('bridging/bpjs/tools', json).then(function (e) {
                            if (e.data.metaData.code == '200') {
								$scope.kontrol.resNoSurat = e.data.response.noSuratKontrol
								saveSPRILokal('insert')
								
                                toastr.success(e.data.response.noSuratKontrol, e.data.metaData.message);
                            } else {
								$scope.isSaves =false
                                toastr.error(e.data.metaData.message, 'Info');
                            }
                        })
                    } else {
                        // update
                        let json = {
                            "url": "RencanaKontrol/Update",
                            "method": "PUT",
                            "data": {
                                "request": {
                                    "noSuratKontrol": $scope.kontrol.noSuratKontrol,
                                    "noSEP": $scope.kontrol.noSep,
                                    "kodeDokter": $scope.kontrol.kodeDokter.kode,
                                    "poliKontrol": $scope.kontrol.poliKontrol.kdinternal,
                                    "tglRencanaKontrol": moment($scope.kontrol.tglRencanaKontrol).format('YYYY-MM-DD'),
                                    "user": "Ramdanegie"
                                }
                            }
                        }

                        medifirstService.postNonMessage('bridging/bpjs/tools', json).then(function (e) {
                            if (e.data.metaData.code == '200') {
								$scope.kontrol.resNoSurat = e.data.response.noSuratKontrol
								saveSPRILokal('update')
                                toastr.success(e.data.response.noSuratKontrol, e.data.metaData.message);
                            } else {
								$scope.isSaves =false
                                toastr.error(e.data.metaData.message, 'Info');
                            }
                        })
                    }

                }
            }
			function saveSPRILokal(tipe) {
				loadGridKontrol()
				$scope.isSaves =false
				var data = {
					'tipe':tipe,
					'nosuratkontrol': $scope.kontrol.resNoSurat ,
					'jnspelayanan':   $scope.kontrol.jenisPelayanan.id == 1?'Rawat Inap':'Rawat Jalan',
					'jnskontrol':  $scope.kontrol.jenisPelayanan.id,
					'namajnskontrol':  $scope.kontrol.jenisPelayanan.id == 1?'SPRI':'Surat Kontrol',
					'tglrencanakontrol':moment($scope.kontrol.tglRencanaKontrol).format('YYYY-MM-DD'),
					'tglterbitkontrol': moment(new Date()).format('YYYY-MM-DD') ,
					'nosepasalkontrol':$scope.kontrol.noSep?$scope.kontrol.noSep :null ,
					'poliasal':  $scope.dataPasienSelected.namaruangan,
					'politujuan':  $scope.kontrol.poliKontrol ?$scope.kontrol.poliKontrol.kdinternal :null,
					'namapolitujuan':  $scope.kontrol.poliKontrol ?$scope.kontrol.poliKontrol.namaruangan :null,
					'tglsep': $scope.kontrol.tglSep ?$scope.kontrol.tglSep :null,
					'kodedokter': $scope.kontrol.kodeDokter.kode ,
					'namadokter': $scope.kontrol.kodeDokter.nama ,
					'nokartu':$scope.kontrol.noKartu,
					'nama':$scope.dataPasienSelected.namapasien ,
					'norec_pd': $scope.dataPasienSelected.norec ,
				};
				medifirstService.post("bridging/bpjs/save-rencana-kontrol", data).then(function (z) {

				})

			}
			$scope.hapusSPRI = function () {
				if ($scope.dataSelected2 ==  undefined) {
					toastr.error('Pilih data dulu')
					return 
				}
				
				let json = {
                    "url": "RencanaKontrol/Delete",
                    "method": "DELETE",
                    "data":   {
						"request": {
							"t_suratkontrol":{
							"noSuratKontrol": $scope.dataSelected2.noSuratKontrol,
							"user": "xxx"
							}
						}
					}
                }
                medifirstService.postNonMessage("bridging/bpjs/tools", json).then(function (e) {

                    if (e.data.metaData.code === "200") {
						var data = {
							'tipe':'delete',
							'nosuratkontrol': $scope.dataSelected2.noSuratKontrol ,
						};
						medifirstService.post("bridging/bpjs/save-rencana-kontrol", data).then(function (z) {
							loadGridKontrol()
						})
						toastr.info(e.data.metaData.message)
                    } else {
                        toastr.error(e.data.metaData.message)
                    }
                })
			}
			function loadGridKontrol(){
				$scope.isRouteLoading = true;
				$scope.dataSelected2 = undefined
                var tglAwal = moment($scope.kontrol.tglAwal).format('YYYY-MM-DD')
                var tglAkhir = moment($scope.kontrol.tglAkhir).format('YYYY-MM-DD')

                let json = {
                    "url": "RencanaKontrol/ListRencanaKontrol/tglAwal/" + tglAwal + "/tglAkhir/" + tglAkhir + "/filter/" + $scope.kontrol.filter.kode,
                    "method": "GET",
                    "data": null
                }
                medifirstService.postNonMessage("bridging/bpjs/tools", json).then(function (e) {
                    $scope.isRouteLoading = false;
                    if (e.data.metaData.code == '200') {
						
						
						for (var i = e.data.response.list.length - 1; i >= 0; i--) {
							const element = e.data.response.list[i]
							if($scope.dataPasienSelected.nobpjs != element.noKartu){
								e.data.response.list.splice(i, 1);
							}
                            // element.no = i+1
                        }
						for (var i = e.data.response.list.length - 1; i >= 0; i--) {
							const element = e.data.response.list[i]
							element.no = i+1
						}
                        $scope.dataSourceSPRI = new kendo.data.DataSource({
                            data: e.data.response.list,
                            pageSize: 10,
                            serverPaging: false,
                        });

                    } else {
                        $scope.dataSourceSPRI = new kendo.data.DataSource({
                            data: [],
                            pageSize: 10,
                            serverPaging: false,
                        });

                        toastr.error(e.data.metaData.message, 'Info');
                    }

                })
			}
			$scope.editSPRI = function () {
                if ($scope.dataSelected2 == undefined) {
                    toastr.info('Pilih data dulu')
                    return
                }
                $scope.kontrol.sep = $scope.dataSelected2.noSepAsalKontrol
                $scope.kontrol.noKartu = $scope.dataSelected2.noKartu
                $scope.kontrol.tglRencanaKontrol = new Date($scope.dataSelected2.tglRencanaKontrol)
                if ($scope.dataSelected2.jnsKontrol == '2') {
                    $scope.cariSep()
                    $scope.kontrol.jenisPelayanan = $scope.listJenis[1]
                } else {
                    $scope.cariNoka()
                    $scope.kontrol.jenisPelayanan = $scope.listJenis[0]
                }
                $scope.kontrol.noSuratKontrol = $scope.dataSelected2.noSuratKontrol
                var ruang = {}
                for (let i = 0; i < $scope.ruangans.length; i++) {
                    const element = $scope.ruangans[i];
                    if (element.kdinternal == $scope.dataSelected2.poliTujuan) {
                        ruang = element
                        break
                    }
                }
                $scope.kontrol.poliKontrol = ruang
                // let json = {
                //     "url": "RencanaKontrol/JadwalPraktekDokter/JnsKontrol/" + $scope.kontrol.jenisPelayanan.id
                //         + "/KdPoli/" + ruang.kdinternal + "/TglRencanaKontrol/" + moment($scope.kontrol.tglRencanaKontrol).format('YYYY-MM-DD'),
                //     "method": "GET",
                //     "data": null
                // }
                $scope.myVar = 1
                // medifirstService.postNonMessage("bridging/bpjs/tools", json).then(function (e) {
                //     if (e.data.metaData.code == 200) {
                //         for (let x = 0; x < e.data.response.list.length; x++) {
                //             const element = e.data.response.list[x];
                //             element.kode = element.kodeDokter
                //             element.nama = element.namaDokter
                //         }
                //         $scope.kontrol.kodeDokter = { kode: $scope.dataSelected2.kodeDokter, nama: $scope.dataSelected2.namaDokter }
                   
                //         $scope.listDPJP = e.data.response.list;
                //     }
                //     else {
                //         toastr.info('Dokter DPJP tidak ada', 'Info')
                //     }

                // })

				medifirstService.get("bridging/bpjs/antrean/v2/get-jadwal-dokter?kodepoli=" + ruang.kdinternal + "&tanggal=" + moment($scope.kontrol.tglRencanaKontrol).format('YYYY-MM-DD'), false).then(
					function (data) {
						if (data.data.metaData.code == 200) {
							for (let x = 0; x < data.data.response.length; x++) {
								const element = data.data.response[x]
								element.kode = element.kodedokter
								element.nama = element.namadokter
							}
							$scope.kontrol.kodeDokter = { kode: $scope.dataSelected2.kodeDokter, nama: $scope.dataSelected2.namaDokter }
							$scope.listDPJP = data.data.response
						}
						else {
							toastr.info('Dokter DPJP tidak ada', 'Info')
						}

					}
				).then(function () {
                    toastr.info('Dokter DPJP tidak ada', 'Info')
                    //$scope.isRouteLoading = false;
                });
            
            }
			let namappkRumahSakit =''
			medifirstService.get('sysadmin/settingdatafixed/get/namaPPKRujukan').then(function (dat) {
                namappkRumahSakit = dat.data
            })
			$scope.cetakSPRI = function(){
				if ($scope.dataSelected2 == undefined) {
                    toastr.info('Pilih data dulu')
                    return
                }
				let nosuratkontrol = $scope.dataSelected2.noSuratKontrol 
				let tglrencanakontrol = $scope.dataSelected2.tglRencanaKontrol
				let txttglentrirencanakontrol = $scope.dataSelected2.tglTerbitKontrol
				let noka = $scope.dataSelected2.noKartu
				let nama = $scope.dataPasienSelected.namapasien
				let tgllahir = moment(new Date($scope.dataPasienSelected.tgllahir)).format('YYYY-MM-DD')
				let namaPoliTujuan = $scope.dataSelected2.namaPoliTujuan
				let jeniskelamin = $scope.dataPasienSelected.jeniskelamin
				let jnsKontrol = $scope.dataSelected2.jnsKontrol
				let namaDokter =  $scope.dataSelected2.namaDokter
				let nmdpjpsepasal =  $scope.dataPasienSelected.namadokter ? $scope.dataPasienSelected.namadokter:'-'
				let dxawal = '-'
				if($scope.dataSelected2.noSepAsalKontrol!=null){
					let json = {
						"url": "sep/"+$scope.dataSelected2.noSepAsalKontrol,
						"method": "GET",
						"data": null
					}
					medifirstService.postNonMessage("bridging/bpjs/tools", json).then(function (e) {
						if (e.data.metaData.code === "200") {
							var diagsss= encodeURI(e.data.response.diagnosa)
							let json = {
								"url": "referensi/diagnosa/"+diagsss,
								"method": "GET",
								"data": null
							}
							medifirstService.postNonMessage("bridging/bpjs/tools", json).then(function (x) {
								if (x.data.metaData.code === "200") {
									dxawal = x.data.response.diagnosa[0].nama
									jspdfctk(nosuratkontrol, tglrencanakontrol, txttglentrirencanakontrol, noka,
										nama,tgllahir,namappkRumahSakit, namaPoliTujuan, jeniskelamin,dxawal, '-',
										jnsKontrol, '', tglrencanakontrol, namaDokter,nmdpjpsepasal);
								}else{
									dxawal = e.data.response.diagnosa
									jspdfctk(nosuratkontrol, tglrencanakontrol, txttglentrirencanakontrol, noka,
										nama,tgllahir,namappkRumahSakit, namaPoliTujuan, jeniskelamin,dxawal, '-',
										jnsKontrol, '', tglrencanakontrol, namaDokter,nmdpjpsepasal);
								}
							})
							
						}else{
							toastr.error(e.data.metaData.message);
						}
					})
				}else{
					dxawal = '-'
					jspdfctk(nosuratkontrol, tglrencanakontrol, txttglentrirencanakontrol, noka,
						nama,tgllahir,namappkRumahSakit, namaPoliTujuan, jeniskelamin,dxawal, '-',
						jnsKontrol, '', tglrencanakontrol, namaDokter,nmdpjpsepasal);
				}
				

			}
			$scope.cariRencana = function(){
				loadGridKontrol()
			}
			function jspdfctk(norujukan, tglrencanakontrol, tglterbitrencanakontrol, nokartu, nmpst, tgllahir, ppkperujuk, polirencanarujuk,
				jnskelamin, dxawal, catatan, jnspelayanan, kddx, tglrcnrujukan, nmdpjprencanarujuk, nmdpjpsepasal) {
		
				// var jnspelayanan = Math.abs($('#cbpelayanan').val()); 
				var imgData = "data:image/jpeg;base64,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"
				var doc = new jsPDF('l', 'mm', [95, 210]);
				doc.addImage(imgData, 'PNG', 10, 6, 45, 10);
		
				doc.setProperties({
					title: 'Cetak Rencana Kontrol/Inap',
					subject: 'Rencana Kunjungan Kontrol/Inap'
				});
		
				doc.setFontSize(11);
				jnspelayanan == 2 ? doc.text(58, 10, 'SURAT RENCANA KONTROL') : doc.text(58, 10, 'SURAT RENCANA INAP');
				doc.text(58, 15, ppkperujuk);
		
				doc.setFontSize(12);
				doc.text(140, 10, 'No.  ' + norujukan);
				doc.setFontSize(10);
				var _tglberlakurjk = new Date(tglrencanakontrol);
				_tglberlakurjk.setDate(_tglberlakurjk.getDate());
		
				var _ddrujuk = _tglberlakurjk.getDate();
				var _mmrujuk = _tglberlakurjk.getMonth() + 1;
				var _mmmrujuk = strbulan((('' + _mmrujuk).length < 2 ? '0' : '') + _mmrujuk);
				var _yrujuk = _tglberlakurjk.getFullYear();
				var _tglrencanakontrol = [_ddrujuk, _mmmrujuk, _yrujuk].join(' ');
			
		
				doc.setFontSize(10);
				jnspelayanan == 2 ? doc.text(10, 25, 'Kepada Yth') : doc.text(10, 25, '');
				
				doc.text(10, 35, 'Mohon Pemeriksaan dan Penanganan Lebih Lanjut :');
				doc.text(10, 40, 'No.Kartu');
				doc.text(10, 45, 'Nama Peserta');
				doc.text(10, 50, 'Tgl.Lahir');
				doc.text(10, 55, 'Diagnosa');
				jnspelayanan == 2 ? doc.text(10, 60, 'Rencana Kontrol') : doc.text(10, 60, 'Rencana Inap');
		
				if (jnspelayanan == 2) {
					doc.text(40, 25, nmdpjprencanarujuk);
					doc.text(40, 30, 'Sp./Sub. ' + polirencanarujuk);
				}
				doc.text(40, 40, ': ' + nokartu);
				doc.text(40, 45, ': ' + nmpst + ' (' + jnskelamin + ')');
		
				var _tgllahir = new Date(tgllahir);
				_tgllahir.setDate(_tgllahir.getDate());
		
				var _ddlahir = _tgllahir.getDate();
				var _mmlahir = _tgllahir.getMonth() + 1;
				var _mmmlahir = strbulan((('' + _mmlahir).length < 2 ? '0' : '') + _mmlahir);
				var _ylahir = _tgllahir.getFullYear();
				var _tgllahir = [_ddlahir, _mmmlahir, _ylahir].join(' ');
				
				var _tglentrirencanakontrol = new Date();
				var _dd2 = _tglentrirencanakontrol.getDate();
				var _mm2 = _tglentrirencanakontrol.getMonth() + 1;
				var _mmm2 = strbulan((('' + _mm2).length < 2 ? '0' : '') + _mm2);
				var _y2 = _tglentrirencanakontrol.getFullYear();
				var tglentrirencanakontrol = [_dd2, _mmm2, _y2].join(' ');
		
		
				doc.text(40, 50, ': ' + _tgllahir);
				//diagnosa
				// var dx = dxHIV(kddx) == true ? kddx : dxawal;
				var dx =  dxawal;
				doc.text(40, 55, ': ' + dx);
				doc.text(40, 60, ': ' + _tglrencanakontrol);
		
				doc.text(10, 67, 'Demikian atas bantuannya,diucapkan banyak terima kasih.');
		
				doc.setFontSize(8);
				
				//tanggal+time
				var d = new Date();
				var strDateTime = [[AddZero(d.getDate()),
					AddZero(d.getMonth() + 1),
					d.getFullYear()].join("-"),
					[AddZero(d.getHours()),
					AddZero(d.getMinutes())].join(":"),
					d.getHours() >= 12 ? "PM" : "AM"].join(" ");
		
				doc.setFontSize(6);
				doc.text(10, 87, 'Tgl.Entri: ' + tglterbitrencanakontrol + ' | Tgl.Cetak: ' + strDateTime);
		
				//tanggal        
				var month = d.getMonth() + 1;
				var day = d.getDate();
				var tgl = (('' + day).length < 2 ? '0' : '') + day + ' ' +
						  strbulan((('' + month).length < 2 ? '0' : '') + month) + ' ' +
						  d.getFullYear();
		
				doc.setFontSize(10);
				//doc.text(135, 70, tgl);
				doc.text(150, 72, 'Mengetahui DPJP,');
				if(nmdpjpsepasal==null)nmdpjpsepasal
				doc.text(150, 87, jnspelayanan == 2 ? nmdpjpsepasal : nmdpjprencanarujuk);
		
				
				var string = doc.output('datauristring');
				var iframe = "<iframe width='100%' height='100%' src='" + string + "'></iframe>"
				var x = window.open('', '_blank', 'width=1024,height=600,directories=0,status=0,titlebar=0,scrollbars=0,menubar=0,toolbar=0,location=0,resizable=1');
				x.focus();
				x.document.write(iframe);
				x.document.close();
               
			}
			    
			function strbulan(id) {
				var nama;
				switch (id) {
					case '01':
						nama = 'Januari';
						break
					case '02':
						nama = 'Februari';
						break
					case '03':
						nama = 'Maret';
						break
					case '04':
						nama = 'April';
						break
					case '05':
						nama = 'Mei';
						break
					case '06':
						nama = 'Juni';
						break
					case '07':
						nama = 'Juli';
						break
					case '08':
						nama = 'Agustus';
						break
					case '09':
						nama = 'September';
						break
					case '10':
						nama = 'Oktober';
						break
					case '11':
						nama = 'Nopember';
						break
					case '12':
						nama = 'Desember';
						break
				}
				return nama;
			}
			function dxHIV(kode) {
				var str = "B20,B20.0,B20.1,B20.2,B20.3,B20.4,B20.5,B20.6,B20.7,B20.8,B20.9,B21,B21.0,B21.1,B21.2,B21.3,B21.7,B21.8,B21.9,B22,B22.0,B22.1,B22.2,B22.7,B23,B23.0,B23.1,B23.2,B23.8,B24";
				var ret = str.includes(kode);
				return ret;
			}
			function AddZero(num) {
				return (num >= 0 && num < 10) ? "0" + num : num + "";
			}
			$scope.cariRencana = function () {
                loadGridKontrol()
            }
			$scope.listPenjaminLaka = [
                { "id": 12, "name": "Jasa Raharja PT", "value": 1 },
                { "id": 13, "name": "BPJS Ketenagakerjaan", "value": 2 },
                { "id": 14, "name": "TASPEN PT", "value": 3 },
                { "id": 15, "name": "ASABRI PT", "value": 4 }
            ];
			$scope.currentListPenjaminLaka =[]
			function cetakSEP(response) {
           
                var nosep = response.noSep
                var nmperujuk = $scope.dataPasienSelected.nmprovider

                var tglsep = response.tglSep
                var nokartu =response.peserta.noKartu + '  ( MR. ' + response.peserta.noMr + ' )';
                var nmpst =response.peserta.nama
                var tgllahir = response.peserta.tglLahir
                var jnskelamin =response.peserta.kelamin== 'L' ? '  Kelamin : Laki-Laki' : '  Kelamin :Perempuan';
                var poli = response.jnsPelayanan== 'Rawat Inap' ? '-' : $scope.dataPasienSelected.namaruangan;
                var faskesperujuk = response.jnsPelayanan== 'Rawat Inap' ? namappkRumahSakit : nmperujuk;
                var notelp = $scope.dataPasienSelected.nohp
                var dxawal = response.diagnosa.substring(0, 45);
                var catatan = response.catatan
                var jnspst = response.peserta.jnsPeserta
                var FLAGCOB = response.cob
                var cob = '-';
                if (FLAGCOB) {
                    cob = response.cob ? response.cob : null
                }

                //cob non aktif
                var FLAGNAIKKELAS = response.klsRawat.klsRawatNaik != null &&  response.klsRawat.klsRawatNaik != '' ? '1' : '0'
                var klsrawat_naik = response.klsRawat.klsRawatNaik != null &&  response.klsRawat.klsRawatNaik != '' ?response.klsRawat.klsRawatNaik:''

                var jnsrawat = response.jnsPelayanan == 'Rawat Inap'  ? 'R.Inap' : 'R.Jalan';
                var klsrawat = response.kelasRawat
                var prolanis =  ""
                var eksekutif = response.jnsPelayanan == 'Rawat Inap'  ? '' : response.poliEksekutif== 1 ? ' (Poli Eksekutif)' : '';
                //var penjaminJR = $('#chkjaminan_JR').is(":checked") == true ? 'Jasa Raharja PT' : '';
                //var penjaminTK = $('#chkjaminan_BPJSTK').is(":checked") == true ? 'BPJS Ketenagakerjaan' : '';
                //var penjaminTP = $('#chkjaminan_TASPEN').is(":checked") == true ? 'PT TASPEN' : '';
                //var penjaminAS = $('#chkjaminan_ASABRI').is(":checked") == true ? 'ASABRI' : '';
                var katarak = response.katarak ;
                var potensiprb = ""
                var statuskll = response.kdStatusKecelakaan
                var _kodejaminan = '-';
                if (response.kdStatusKecelakaan !='' && response.kdStatusKecelakaan!='0') {
					var pen =  response.penjamin.split(', ')
                    var a = ""
                    var b = ""
					for (let x = 0; x < 	$scope.listPenjaminLaka.length; x++) {
						const element = 	$scope.listPenjaminLaka[x];
						for (let z = 0; z < pen.length; z++) {
							const element2 = pen[z];
							if(element2 == element.name){
								$scope.currentListPenjaminLaka.push({value:element.value})
							}
						}
					}
                    for (var i = $scope.currentListPenjaminLaka.length - 1; i >= 0; i--) {
                        var c = $scope.currentListPenjaminLaka[i].value
                        b = ";" + c
                        a = a + b
                    }
                    _kodejaminan = a.slice(1, a.length)
                }
                var dokter = (response.jnsPelayanan == 'Rawat Inap') ? (response.kontrol.nmDokter ) : response.dpjp.nmDPJP ;
				if(dokter==null)$scope.dataPasienSelected.namadokter
                var FLAGPROSEDUR = $scope.dataPasienSelected.flagprocedure

                var kunjungan = 0;
                if (response.jnsPelayanan == 'Rawat Inap') {
                    kunjungan = 3
                } else if ($scope.dataPasienSelected.statuskunjungan) {
                    kunjungan = $scope.dataPasienSelected.statuskunjungan
                } else {
                    kunjungan = 1
                }

                var isrujukanthalasemia_hemofilia = 0

                if ( $scope.dataPasienSelected.namaruangan.indexOf('IGD') >-1) {
                    nmperujuk = '';
                    kunjungan = 0;
                    FLAGPROSEDUR = null;
                }
                var poliPerujuk = '-'
                if ($scope.dataPasienSelected.poliasalkode) {
                    poliPerujuk = $scope.dataPasienSelected.poliasalkode
                }

                //var sepdate = new Date(tglsep);
                //var currDate = new Date(dataSEP.sep.sep.FDATE);
                //var backdate = sepdate < new Date(currDate.getFullYear(), currDate.getMonth(), currDate.getDate()) ? " (BACKDATE)" : "";

                var backdate = medifirstService.cekBackdate(tglsep, $scope.dataPasienSelected.tglcreate ? $scope.dataPasienSelected.tglcreate : tglsep);
                var ispotensiHEMOFILIA_cetak = 0
				var cetakan = 1;
				medifirstService.jspdfSEP(nosep + backdate, tglsep, nokartu, nmpst, tgllahir, jnskelamin, notelp, poli, faskesperujuk, dxawal, catatan, jnspst, cob, jnsrawat, klsrawat,
                    prolanis, eksekutif, _kodejaminan, statuskll, katarak, potensiprb,cetakan, dokter, kunjungan, FLAGPROSEDUR, poliPerujuk, FLAGNAIKKELAS, klsrawat_naik,
					 isrujukanthalasemia_hemofilia, ispotensiHEMOFILIA_cetak,namappkRumahSakit);


            }
			
        
		//** BATAS */
		}
	]);
});