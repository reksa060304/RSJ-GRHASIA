define(['initialize', 'Configuration'], function (initialize, config) {
    'use strict';
    var baseTransaksi = config.baseApiBackend;
    initialize.controller('DaftarKlaimRajalCtrl', ['MedifirstService', 'CacheHelper', '$scope', '$mdDialog', 'DateHelper', '$state', 
        function (medifirstService, cacheHelper, $scope, $mdDialog, DateHelper, $state, ModelItem) {
            $scope.now = new Date();
            $scope.item = {};
            $scope.temp = {};
            $scope.isRouteLoading = false;
            $scope.myTabs = 0;
			$scope.kontrol = {};
            $scope.tabsForm = false;
            $scope.isFar = true;
			$scope.item.isPulang = false;
            $scope.isRi = false;
            $scope.israjal = true;
            $scope.isRad = true;
            $scope.isLab = true;
            $scope.isEmr = true;
			$scope.datafar = [];
			$scope.datarad = [];
			$scope.datalab = [];
			$scope.item.terpilih=0;
			$scope.disabledtombol = false
			$scope.idpegawai = medifirstService.getPegawaiLogin().id;
			$scope.sourceJenisDiagnosa = []
			$scope.sourceDiagnosis = []

			$scope.dataTransaksi = []
			var isianColor = "white"
			var kdColorKaries = "#B8B7B7"
			var kdColorTambalanLogam = "#F544ED"
			var kdColorTambalanNonLogam = "#82D9D9"
			var kdColorMahkotaLogam = "#014C0A"
			var kdColorMahkotaNonLogam = "#40F5F9"
			var typeIsian = ""
			var data2 = [];

			loadFirst()
			function loadFirst() {
				var chacePeriode = cacheHelper.get('KlaimPasienRajalCtrl');
				if (chacePeriode != undefined) {
					var arrPeriode = chacePeriode;
					$scope.item.periodeAwal = new Date(arrPeriode[0]);
					$scope.item.periodeAkhir = new Date(arrPeriode[1]);
				} else {
						$scope.item.periodeAwal = moment($scope.now).format('YYYY-MM-DD 00:00');
						$scope.item.periodeAkhir = moment($scope.now).format('YYYY-MM-DD 23:59');
				}

				medifirstService.get("bridging/inacbg/get-data-combo-ina", false).then(function (data) {
					$scope.listDepartemen = data.data.departemen;
					$scope.listjenispelayanan = [{ id: 1, name: 'RI' }, { id: 2, name: 'RJ' }];
				})
				medifirstService.get("registrasi/get-combo-riwayat-regis", false).then(function (data) {
					$scope.sourceJenisDiagnosa = data.data.jenisdiagnosa
				})
			}

			medifirstService.getPart("registrasi/daftar-registrasi/get-data-diagnosa-all", true, true, 10).then(function (data) {
				$scope.sourceDiagnosis = data;
			});

			$scope.getIsiComboRuangan = function () {
				$scope.listRuangan = $scope.item.instalasi.ruangan
			}

			$scope.cari = function () {
					loadData();
			}

			loadData();
			function loadData() {
				$scope.isRouteLoading = true;
				$scope.item.terpilih = 0;
				var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm');
				var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm');

				var noregistrasi = ""
				if ($scope.item.noregistrasi != undefined) {
						noregistrasi = "&noregistrasi=" + $scope.item.noregistrasi
				}
				var norm = ""
				if ($scope.item.norm != undefined) {
						norm = "&norm=" + $scope.item.norm
				}
				var namapasien = ""
				if ($scope.item.namapasien != undefined) {
						namapasien = "&namapasien=" + $scope.item.namapasien
				}
				var ruangan = ""
				if ($scope.item.ruangan != undefined) {
						ruangan = "&ruanganid=" + $scope.item.ruangan.id
				}
				var dep = ""
				if ($scope.item.instalasi != undefined) {
						dep = "&depid=" + $scope.item.instalasi.id
				}
				var nosep = ""
				if ($scope.item.nosep != undefined) {
						nosep = "&nosep=" + $scope.item.nosep
				}
				var jenisDiagnosa = ''
				if ($scope.item.jenisDiagnosa != undefined) {
					jenisDiagnosa = '&jenisdiagnosa=' + $scope.item.jenisDiagnosa.id
				}
				var diagnosa = ''
				if ($scope.item.diagnosis != undefined) {
					diagnosa = '&diagnosa=' + $scope.item.diagnosis.id
				}

				if (jenisDiagnosa != '' && diagnosa == '') {
					$scope.isRouteLoading = false
					toastr.warning('Diagnosa wajib diisi!')
					return
				}

				if (jenisDiagnosa == '' && diagnosa != '') {
					$scope.isRouteLoading = false
					toastr.warning('Jenis diagnosa wajib diisi!')
					return 
				}

				var isPulang = ""
				if ($scope.item.isPulang == true) {
					isPulang = "&ispulang=" + true;
				}

				var jenispelayanan = ""
				if ($scope.item.jenispel != undefined) {
						jenispelayanan = "&jenispel=" + $scope.item.jenispel.id
				}
				medifirstService.get("klaim/get-daftar-klaim?tglAwal=" + tglAwal + "&tglAkhir=" + tglAkhir + 
					noregistrasi + 
					norm + 
					namapasien + 
					ruangan + 
					dep +
					isPulang +
					nosep +
					jenispelayanan +
					jenisDiagnosa +
					diagnosa
					, true).then(function (e) {    
							console.log(e);     
					$scope.isRouteLoading = false;
					for(var i = 0;i<e.data.length; i++) {
						var status = '';
						if(e.data[i].statusklaim == "send_claim_individual") {
							status = "Terkirim";
						} 
					e.data[i].statCheckbox = false;
						// else if(e.data[i].statusklaim == "grouper") {
						//     status = "Grouping";
						// } else if(e.data[i].statusklaim == "claim_final") {
						//     status = "Final Klaim";
						// }
						e.data[i].statusklaim = status;
						e.data[i].ketKlaim = e.data[i].ketKlaim!=" "?e.data[i].ketKlaim:"-";
					}

					$scope.dataSourceGrid = new kendo.data.DataSource({
							data: e.data,
							pageSize: 100,
							total: e.data.length,
							serverPaging: false,
							schema: {
									model: {
											fields: {
											}
									}
							}
					});

					if (e.data.length < 1) {
						toastr.warning('Data tidak ditemukan)');
					}

				});

				var chacePeriode = {
						0 :	$scope.item.periodeAwal,
						1 : $scope.item.periodeAkhir,
				}
				cacheHelper.set('KlaimPasienRajalCtrl', chacePeriode);

			}

            var onDataBound = function () {
				$('td').each(function () {
					if ($(this).text() == 'Klaim') { $(this).addClass('green-200') }
					if ($(this).text() == 'Grouping') { $(this).addClass('green-400') }
					if ($(this).text() == 'Terkirim') { $(this).addClass('blue-200') }
                    if ($(this).text() == 'Belum Ada') { $(this).addClass('red-400') }
                    if ($(this).text() == 'Belum di Grouping') { $(this).addClass('red-400') }
					if ($(this).text() == 'Selesai') { $(this).addClass('green-200') }
					if ($(this).text() == '-') { $(this).addClass('red-400') }
				})
			}

            $scope.columnGrid = {
                toolbar: [
                    "excel",
                ],
                excel: {
                    fileName: "DaftarKlaimRawatBPJS.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.name = "Laporan";

                    var myHeaders = [{
                        value: "Daftar Klaim BPJS",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                selectable: 'row',
                pageable: true,
                dataBound: onDataBound,
                columns: [
					{
						"title": "<input type='checkbox' class='checkbox' ng-click='selectUnselectAllRow()' />",
						template: "# if (statCheckbox) { #" +
							"<input type='checkbox' class='checkbox' ng-click='selectRow(dataItem)' checked />" +
							"# } else { #" +
							"<input type='checkbox' class='checkbox' ng-click='selectRow(dataItem)' />" +
							"# } #",
						width: "40px"
					},
                    {
                        "field": "tglregistrasi",
                        "title": "Tgl Registrasi",
                        "width": "75px",
                    },
                    {
                        "field": "tglpulang",
                        "title": "Tgl Pulang",
                        "width": "75px",
                    },
                    {
                        "field": "noregistrasi",
                        "title": "No Registrasi",
                        "width": "100px",
                    },
                    {
                        "field": "nocm",
                        "title": "No RM",
                        "width": "100px",
                    },
                    {
                        "field": "namapasien",
                        "title": "Nama Pasien",
                        "width": "120px",
                    },
                    {
                        "field": "jeniskelamin",
                        "title": "Jenis Kelamin",
                        "width": "80px",
                    },
                    {
                        "field": "tgllahir",
                        "title": "Tgl Lahir",
                        "width": "100px",
                    },
                    // {
                    //     "field": "isresume",
                    //     "title": "Resume",
                    //     "width": "70px",
                    // },
                    {
                        "field": "nobpjs",
                        "title": "No BPJS",
                        "width": "100px",
                    },
                    {
                        "field": "nosep",
                        "title": "No SEP",
                        "width": "120px",
                    },
                    // {
                    //     "field": "ketKlaim",
                    //     "title": "Status Klaim",
                    //     "width": "100px",
                    // },
                    {
                        "field": "totalpiutangpenjamin",
                        "title": "Total Grouping",
                        "width": "70px"
                    },
                    {
                        "field": "namaruangan",
                        "title": "Poli / Unit",
                        "width": "100px",
                    },
                    {
                        "field": "dokter",
                        "title": "Dokter",
                        "width": "100px",
                    },
                    {
                        "field": "statusklaim",
                        "title": "Status",
                        "width": "75px",
                    },
                    {
                        "field": "listdokumen",
                        "title": "Berkas",
                        "width": "150px",
                    },
                    // {
                    //     "field": "ulasan",
                    //     "title": "Ulasan ",
                    //     "width": "70px"
                    // },
                    {
						"command": [
							   {
								   text: "Dokumen",
								   click: dokumen,
								   className: "small-button-edit"
							   },
						   ],
						   title: "Aksi",
						   width: "100px",
					   }
                ]
            };
            

            $scope.showListPemeriksaan = function () {
				$scope.temp = {};
                if($scope.dataPasienSelected==undefined) {
					toastr.warning('Pilih data terlebih dahulu');
                    return;
				}
                $scope.temp.norm = $scope.dataPasienSelected.nocm;
                $scope.temp.iddep = $scope.dataPasienSelected.id_dep;
                $scope.temp.namapasien = $scope.dataPasienSelected.namapasien;
                $scope.temp.noregistrasi = $scope.dataPasienSelected.noregistrasi;
                $scope.temp.tglregistrasi = $scope.dataPasienSelected.tglregistrasi;
                $scope.temp.namapasien = $scope.dataPasienSelected.namapasien;
                $scope.temp.tgllahir = $scope.dataPasienSelected.tgllahir;
                $scope.temp.jeniskelamin = $scope.dataPasienSelected.jeniskelamin;
                $scope.temp.namaruangan = $scope.dataPasienSelected.namaruangan;
                $scope.temp.kelompokpasien = $scope.dataPasienSelected.kelompokpasien;
                $scope.temp.umur = $scope.dataPasienSelected.umur+" thn";
                $scope.temp.namakelas = $scope.dataPasienSelected.namakelas;
                // $scope.temp.alamatrmh = $scope.dataPasienSelected.alamatrmh;
                $scope.temp.nobpjs = $scope.dataPasienSelected.nobpjs;
                $scope.temp.nosep = $scope.dataPasienSelected.nosep;
                $scope.temp.nik = $scope.dataPasienSelected.noidentitas;
                $scope.temp.dpjp = $scope.dataPasienSelected.dokter;
                $scope.temp.totalgrouping = "0";
                // $scope.kontrol.nokartu = $scope.dataPasienSelected.nobpjs;
                if ($scope.dataPasienSelected.id_dep == 16) {
                    $scope.isRi = true;
                } else {
                    $scope.isRi = false;
                }
                if($scope.dataPasienSelected.totalpiutangpenjamin!="1") {
                    $scope.temp.totalgrouping = conver_rupiah($scope.dataPasienSelected.totalpiutangpenjamin);
                }
				
				
                // $scope.temp.totalbilling = "0";
                // medifirstService.get("klaim/get-total-billing-klaim?noregistrasi="+$scope.temp.noregistrasi, true).then(function (e) {
                //     $scope.temp.totalbilling = conver_rupiah(e.data); 
                // })
				if ($scope.dataPasienSelected.id_dep != 16 && !([819, 811].includes($scope.dataPasienSelected.idruangan))) {
					$scope.israjal = true;
					document.getElementById("load-resume").style.display  = "block";
					document.getElementById("content-resume").style.display  = "none";
					medifirstService.get("bridging/inacbg/get-asesmen-rajal?noregistrasi="+$scope.temp.noregistrasi , true).then(function (e) {
						
							var dataResume = e.data.data;
							for (let i = 0; i <  dataResume.length ; i++) {
								if (dataResume[i].emrdfk == 318676) {
									$scope.temp.anamnesa = dataResume[i].value
									break;
								}
								
							}
							for (let i = 0; i < dataResume.length  ; i++) {
								if (dataResume[i].emrdfk == 318837) {
									$scope.temp.diagnosis = dataResume[i].value
									break;
								}
								
							}
							for (let i = 0; i < dataResume.length ; i++) {
								if (dataResume[i].emrdfk == 318703) {
									$scope.temp.nadi = dataResume[i].value
									break;
								}
								
							}
							for (let i = 0; i < dataResume.length ; i++) {
								if (dataResume[i].emrdfk == 318704) {
									$scope.temp.respirasi = dataResume[i].value
									break;
								}
								
							}
							for (let i = 0; i < dataResume.length  ; i++) {
								if (dataResume[i].emrdfk == 318705) {
									$scope.temp.tekanandarah = dataResume[i].value
									break;
								}
								
							}
							for (let i = 0; i < dataResume.length ; i++) {
								if (dataResume[i].emrdfk == 318706) {
									$scope.temp.suhu = dataResume[i].value
									break;
								}
								
							}
							for (let i = 0; i < dataResume.length ; i++) {
								if (dataResume[i].emrdfk == 318838) {
									$scope.temp.terapi = dataResume[i].value
									break;
								}
								
							}
							
							// $scope.temp.diagnosis   = "-";
							// $scope.temp.nadi   = "-";
							// $scope.temp.respirasi   = "-";
							// $scope.temp.tekanandarah   = "-";
							// $scope.temp.suhu   = "-";
							// // $scope.temp.tindakan    = dataResume.tindakanprosedur?dataResume.tindakanprosedur:"-";
							// // $scope.temp.terapi      = dataResume.terapi?dataResume.terapi:"-";
							$scope.temp.dokterdpjp  = $scope.dataPasienSelected.dokter;
							// $scope.temp.dokterkonsul= dataResume.dokterkonsul?dataResume.dokterkonsul:"-";
							// $scope.temp.ruangankonsul= dataResume.politujuan?dataResume.politujuan:"-";
							// $scope.temp.kondisikeluar= dataResume.kondisipasien?dataResume.kondisipasien:"-";
							$scope.temp.statuskeluar= 'Diketahui / Diizinkan Oleh Dokter';
							// if ($scope.dataPasienSelected.objectstatuspulangfk == 1 || $scope.dataPasienSelected.objectstatuspulangfk == 6) {
							// 	$scope.temp.statuskeluar= 'Atas persetujuan dokter';
							// } else if ($scope.dataPasienSelected.objectstatuspulangfk == 4 || $scope.dataPasienSelected.objectstatuspulangfk == 5 || $scope.dataPasienSelected.objectstatuspulangfk == 10 ||
							// 	$scope.dataPasienSelected.objectstatuspulangfk == 11) {
							// $scope.temp.statuskeluar = 'Dirujuk';
							// } else if ($scope.dataPasienSelected.objectstatuspulangfk == 2 || $scope.dataPasienSelected.objectstatuspulangfk == 8 || $scope.dataPasienSelected.objectstatuspulangfk == 3) {
							// $scope.temp.statuskeluar = 'Atas permintaan sendiri';
							// } else if ($scope.dataPasienSelected.objectstatuspulangfk == 9) {
							// $scope.temp.statuskeluar = 'Meninggal'
							// } else {
							// $scope.temp.statuskeluar = 'Lain-lain'
							// }
							
					
						document.getElementById("load-resume").style.display  = "none";
						document.getElementById("content-resume").style.display  = "block";
					})
				} else {
					$scope.israjal = false;
				}
               
                document.getElementById("load-radiologi").style.display  = "block";
                document.getElementById("content-radiologi").style.display  = "none";
                medifirstService.get("klaim/get-klaim-radiologi?noregistrasi="+$scope.temp.noregistrasi, true).then(function (e) {
                    $scope.datarad = e.data;
                    if(e.data.length<=0) {
                        $scope.isRad = true;
                    } else {
                        $scope.isRad = false;
                    }
                    document.getElementById("load-radiologi").style.display  = "none";
                    document.getElementById("content-radiologi").style.display  = "block";
                })

				// document.getElementById("load-farmasi").style.display  = "block";
                // document.getElementById("content-farmasi").style.display  = "none";
                // medifirstService.get("klaim/get-klaim-farmasi?noregistrasi="+$scope.temp.noregistrasi, true).then(function (e) {
                //     $scope.datafar = e.data.data;
                //     if(e.data.length<=0) {
                //         $scope.isFar = true;
                //     } else {
                //         $scope.isFar = false;
                //     }
                //     document.getElementById("load-farmasi").style.display  = "none";
                //     document.getElementById("content-farmasi").style.display  = "block";
                // })

                document.getElementById("load-berkas-emr").style.display  = "block";
                document.getElementById("content-berkas-emr").style.display  = "none";
                medifirstService.get("bridging/inacbg/get-daftar-emr-rev?noregistrasi="+$scope.temp.noregistrasi, true).then(function (e) {
                    if(e.data.data.length<=0) {
                        $scope.isEmr = true;
						// $scope.dataEmr = [];
                    } else {
                        $scope.tempberkasemr = e.data.data;
						
                        $scope.dataEmr = new kendo.data.DataSource({
                            data: e.data.data,
                            pageSize: 10,
                            serverPaging: false,
                            schema: {model: {fields: {}}}
                        });
						$scope.isEmr = false;
                    }
                    document.getElementById("load-berkas-emr").style.display  = "none";
                    document.getElementById("content-berkas-emr").style.display  = "block";
                })

                document.getElementById("load-laboratorium").style.display  = "block";
                document.getElementById("content-laboratorium").style.display  = "none";

                medifirstService.get("laboratorium/get-hasil-lis-noreg?noreg="+ $scope.temp.noregistrasi
                   , false).then(function (e) { 
                    $scope.datalab = e.data;
                    if(e.data.length<=0) {
                        $scope.isLab = true;
                    } else {
                        $scope.isLab = false;
                    }
                    document.getElementById("load-laboratorium").style.display  = "none";
                    document.getElementById("content-laboratorium").style.display  = "block";
                })

                // document.getElementById("load-dokumen").style.display  = "block";
                // document.getElementById("content-dokumen").style.display  = "none";
                // medifirstService.get("klaim/get-klaim-dokument?noregistrasi=" + $scope.temp.noregistrasi, true).then(function (e) {
                //     $scope.dataDocument = new kendo.data.DataSource({
                //         data: e.data,
                //         pageSize: 10,
                //         serverPaging: false,
                //         schema: {model: {fields: {}}}
                //     });
                //     document.getElementById("load-dokumen").style.display  = "none";
                //     document.getElementById("content-dokumen").style.display  = "block";
                // })

				// if($scope.dataPasienSelected.namaruangan == "Poliklinik Rehabilitasi Medik") {
				// 	document.getElementById("load-fisioterapi").style.display  = "block";
                // 	document.getElementById("content-fisioterapi").style.display  = "none";
				// 	medifirstService.get("formulir-rehabilitasi/getData?norm="+$scope.dataPasienSelected.nocm, true).then(function(resDataFormulir) {
				// 		console.log(resDataFormulir.data)
				// 		$scope.dataGridFormulirRehabilitasi = new kendo.data.DataSource({
				// 			data: resDataFormulir.data,
				// 			pageSize: 100,
				// 			schema: {
				// 				model: {fields: {}}
				// 			}
				// 		});
				// 		document.getElementById("load-fisioterapi").style.display  = "none";
                //     	document.getElementById("content-fisioterapi").style.display  = "block";
				// 		showLoad('loading-fisioterapi', 'none')
				// 	});
				// }

				// if($scope.dataPasienSelected.namaruangan == "Poliklinik Endodonsi" || $scope.dataPasienSelected.namaruangan == "Poliklinik Periodonti" || $scope.dataPasienSelected.namaruangan == "Poliklinik Pedodontis") {
				// 	document.getElementById("load-gigimulut").style.display  = "block";
                // 	document.getElementById("content-gigimulut").style.display  = "none";
				// 	medifirstService.get("emr/get-history-gigi-mulut?norm="+$scope.dataPasienSelected.nocm, false).then(function(data) {
				// 		$scope.sourceAsesmenGigiDanMulut = new kendo.data.DataSource({
				// 			data: data.data,
				// 			pageSize: 20,
				// 		});
						
				// 		document.getElementById("load-gigimulut").style.display  = "none";
                //     	document.getElementById("content-gigimulut").style.display  = "block";
				// 		showLoad('loading-asesmengigi', 'none')
				// 	});

					
				// 	var eel = [];
				// 	medifirstService.get('emr/get-data-odontogram?nocm=' + $scope.dataPasienSelected.nocm).then(function (e) {
				// 		$scope.dataTransaksi = e.data.data
				// 		for (var i = 0; i < $scope.dataTransaksi.length; i++) {
				// 			typeIsian = $scope.dataTransaksi[i].type
				// 			isianColor = $scope.dataTransaksi[i].color
				// 			eel = $scope.dataTransaksi[i]
				// 			isiColor(eel)
				// 		}
				// 	});

				// 	var elem = document.getElementById('myCanvas'),
				// 		elemLeft = elem.offsetLeft,
				// 		elemTop = elem.offsetTop,
				// 		elements = [];
						
				// 	var	context = elem.getContext('2d');
				// 	context.clearRect(0, 0, elem.width, elem.height);

				// 		elements.forEach(function (element) {
				// 			if (y > element.top + 165 && y < element.top + 165 + element.height && x > element.left && x < element.left + element.width) {
				// 				isiColor(element)
				// 			}
				// 		});

				// 		// elem.addEventListener('click', function (event) {
				// 		// 	var x = event.pageX - elemLeft,
				// 		// 		y = event.pageY - elemTop;
				// 		// 	console.log(x, y);
				// 		// elements.forEach(function (element) {
				// 		// 	if (y > element.top + 165 && y < element.top + 165 + element.height && x > element.left && x < element.left + element.width) {
				// 		// 		isiColor(element)
				// 		// 	}
				// 		// });
			
				// 		// }, false);

				// 		var listSrc = [
				// 			{ id: 1, no: '18' },
				// 			{ id: 2, no: '17' },
				// 			{ id: 3, no: '16' },
				// 			{ id: 4, no: '15' },
				// 			{ id: 5, no: '14' },
				// 			{ id: 6, no: '13' },
				// 			{ id: 7, no: '12' },
				// 			{ id: 8, no: '11' },
			
				// 			{ id: 9, no: '21' },
				// 			{ id: 10, no: '22' },
				// 			{ id: 11, no: '23' },
				// 			{ id: 12, no: '24' },
				// 			{ id: 13, no: '25' },
				// 			{ id: 14, no: '26' },
				// 			{ id: 15, no: '27' },
				// 			{ id: 16, no: '28' },
			
				// 			{ id: 17, no: '55' },
				// 			{ id: 18, no: '54' },
				// 			{ id: 19, no: '53' },
				// 			{ id: 20, no: '52' },
				// 			{ id: 21, no: '51' },
			
				// 			{ id: 22, no: '61' },
				// 			{ id: 23, no: '62' },
				// 			{ id: 24, no: '63' },
				// 			{ id: 25, no: '64' },
				// 			{ id: 26, no: '65' },
			
				// 			{ id: 27, no: '85' },
				// 			{ id: 28, no: '84' },
				// 			{ id: 29, no: '83' },
				// 			{ id: 30, no: '82' },
				// 			{ id: 31, no: '81' },
			
				// 			{ id: 32, no: '71' },
				// 			{ id: 33, no: '72' },
				// 			{ id: 34, no: '73' },
				// 			{ id: 35, no: '74' },
				// 			{ id: 36, no: '75' },
			
				// 			{ id: 37, no: '48' },
				// 			{ id: 38, no: '47' },
				// 			{ id: 39, no: '46' },
				// 			{ id: 40, no: '45' },
				// 			{ id: 41, no: '44' },
				// 			{ id: 42, no: '43' },
				// 			{ id: 43, no: '42' },
				// 			{ id: 44, no: '41' },
			
				// 			{ id: 45, no: '31' },
				// 			{ id: 46, no: '32' },
				// 			{ id: 47, no: '33' },
				// 			{ id: 48, no: '34' },
				// 			{ id: 49, no: '35' },
				// 			{ id: 50, no: '36' },
				// 			{ id: 51, no: '37' },
				// 			{ id: 52, no: '38' }
				// 		]
			
			
			
				// 		var nextKotak = 0
				// 		var besarKotak = 65
				// 		var spc = 0
				// 		var ididKlik = 0
				// 		var idSrc = 0
			
				// 		//sayur kol 1
				// 		for (var i = 0; i < 16; i++) {
				// 			if (i == 8) {
				// 				spc = 20
				// 			}
				// 			context.moveTo(40 + (i * besarKotak) + spc, 40);
				// 			context.lineTo(100 + (i * besarKotak) + spc, 40);
				// 			context.lineTo(100 + (i * besarKotak) + spc, 100);
				// 			context.lineTo(40 + (i * besarKotak) + spc, 100);
				// 			context.lineTo(40 + (i * besarKotak) + spc, 40);
			
				// 			context.lineTo(55 + (i * besarKotak) + spc, 55);
				// 			context.lineTo(55 + (i * besarKotak) + spc, 85);
				// 			context.lineTo(40 + (i * besarKotak) + spc, 100);
			
				// 			context.moveTo(55 + (i * besarKotak) + spc, 85);
				// 			context.lineTo(85 + (i * besarKotak) + spc, 85);
				// 			context.lineTo(100 + (i * besarKotak) + spc, 100);
			
				// 			context.moveTo(85 + (i * besarKotak) + spc, 85);
				// 			context.lineTo(85 + (i * besarKotak) + spc, 55);
				// 			context.lineTo(100 + (i * besarKotak) + spc, 40);
			
				// 			context.moveTo(85 + (i * besarKotak) + spc, 55);
				// 			context.lineTo(55 + (i * besarKotak) + spc, 55);
			
				// 			context.stroke();
			
			
				// 			context.font = "20px Tahoma";
				// 			context.fillStyle = "black";
				// 			context.fillText(listSrc[idSrc].no, 57 + (i * besarKotak) + spc, 120);
			
				// 			idSrc = idSrc + 1
			
				// 			elements.push(
				// 				//A1
				// 				{
				// 					colour: 'red',
				// 					width: 30, height: 15,
				// 					top: 40, left: 55 + (i * besarKotak) + spc,
				// 					id: ididKlik + 1,
				// 					brs: 1, kol: i + 1, seg: 1
				// 				},
				// 				{
				// 					colour: 'red',
				// 					width: 15, height: 30,
				// 					top: 55, left: 85 + (i * besarKotak) + spc,
				// 					id: ididKlik + 2,
				// 					brs: 1, kol: i + 1, seg: 2
				// 				},
				// 				{
				// 					colour: 'red',
				// 					width: 30, height: 15,
				// 					top: 85, left: 55 + (i * besarKotak) + spc,
				// 					id: ididKlik + 3,
				// 					brs: 1, kol: i + 1, seg: 3
				// 				},
				// 				{
				// 					colour: 'red',
				// 					width: 15, height: 30,
				// 					top: 55, left: 40 + (i * besarKotak) + spc,
				// 					id: ididKlik + 4,
				// 					brs: 1, kol: i + 1, seg: 4
				// 				},
				// 				{
				// 					colour: 'yellow',
				// 					width: 30, height: 30,
				// 					top: 55, left: 55 + (i * besarKotak) + spc,
				// 					id: ididKlik + 5,
				// 					brs: 1, kol: i + 1, seg: 5
				// 				}
				// 			);
				// 			ididKlik = ididKlik + 5
				// 		}
			
				// 		spc = 0
				// 		//sayur kol 2
				// 		for (var i = 0; i < 10; i++) {
				// 			if (i == 5) {
				// 				spc = 20
				// 			}
				// 			context.moveTo(235 + (i * besarKotak) + spc, 150);
				// 			context.lineTo(235 + (i * besarKotak) + spc, 210);
				// 			context.lineTo(295 + (i * besarKotak) + spc, 210);
				// 			context.lineTo(295 + (i * besarKotak) + spc, 150);
				// 			context.lineTo(235 + (i * besarKotak) + spc, 150);
			
				// 			context.moveTo(235 + (i * besarKotak) + spc, 150);
				// 			context.lineTo(250 + (i * besarKotak) + spc, 165);
				// 			context.lineTo(250 + (i * besarKotak) + spc, 195);
				// 			context.lineTo(235 + (i * besarKotak) + spc, 210);
			
				// 			context.moveTo(250 + (i * besarKotak) + spc, 195);
				// 			context.lineTo(280 + (i * besarKotak) + spc, 195);
				// 			context.lineTo(295 + (i * besarKotak) + spc, 210);
			
				// 			context.moveTo(280 + (i * besarKotak) + spc, 195);
				// 			context.lineTo(280 + (i * besarKotak) + spc, 165);
				// 			context.lineTo(295 + (i * besarKotak) + spc, 150);
			
				// 			context.moveTo(280 + (i * besarKotak) + spc, 165);
				// 			context.lineTo(250 + (i * besarKotak) + spc, 165);
			
				// 			context.stroke();
			
				// 			context.font = "20px Tahoma";
				// 			context.fillStyle = "black";
				// 			context.fillText(listSrc[idSrc].no, 252 + (i * besarKotak) + spc, 230);
			
				// 			idSrc = idSrc + 1
			
				// 			elements.push(
				// 				{
				// 					colour: 'red',
				// 					width: 30, height: 15,
				// 					top: 150, left: 250 + (i * besarKotak) + spc,
				// 					id: ididKlik + 1,
				// 					brs: 2, kol: i + 1, seg: 1
				// 				},
				// 				{
				// 					colour: 'red',
				// 					width: 15, height: 30,
				// 					top: 165, left: 280 + (i * besarKotak) + spc,
				// 					id: ididKlik + 2,
				// 					brs: 2, kol: i + 1, seg: 2
				// 				},
				// 				{
				// 					colour: 'red',
				// 					width: 30, height: 15,
				// 					top: 195, left: 250 + (i * besarKotak) + spc,
				// 					id: ididKlik + 3,
				// 					brs: 2, kol: i + 1, seg: 3
				// 				},
				// 				{
				// 					colour: 'red',
				// 					width: 15, height: 30,
				// 					top: 165, left: 235 + (i * besarKotak) + spc,
				// 					id: ididKlik + 4,
				// 					brs: 2, kol: i + 1, seg: 4
				// 				},
				// 				{
				// 					colour: 'yellow',
				// 					width: 30, height: 30,
				// 					top: 165, left: 250 + (i * besarKotak) + spc,
				// 					id: ididKlik + 5,
				// 					brs: 2, kol: i + 1, seg: 5
				// 				}
				// 			);
				// 			ididKlik = ididKlik + 5
				// 		}
			
				// 		spc = 0
				// 		//sayur kol 3
				// 		for (var i = 0; i < 10; i++) {
				// 			if (i == 5) {
				// 				spc = 20
				// 			}
				// 			context.moveTo(235 + (i * besarKotak) + spc, 260);
				// 			context.lineTo(235 + (i * besarKotak) + spc, 320);
				// 			context.lineTo(295 + (i * besarKotak) + spc, 320);
				// 			context.lineTo(295 + (i * besarKotak) + spc, 260);
				// 			context.lineTo(235 + (i * besarKotak) + spc, 260);
			
				// 			context.moveTo(235 + (i * besarKotak) + spc, 260);
				// 			context.lineTo(250 + (i * besarKotak) + spc, 275);
				// 			context.lineTo(250 + (i * besarKotak) + spc, 305);
				// 			context.lineTo(235 + (i * besarKotak) + spc, 320);
			
				// 			context.moveTo(250 + (i * besarKotak) + spc, 305);
				// 			context.lineTo(280 + (i * besarKotak) + spc, 305);
				// 			context.lineTo(295 + (i * besarKotak) + spc, 320);
			
				// 			context.moveTo(280 + (i * besarKotak) + spc, 305);
				// 			context.lineTo(280 + (i * besarKotak) + spc, 275);
				// 			context.lineTo(295 + (i * besarKotak) + spc, 260);
			
				// 			context.moveTo(280 + (i * besarKotak) + spc, 275);
				// 			context.lineTo(250 + (i * besarKotak) + spc, 275);
			
				// 			context.stroke();
			
				// 			context.font = "20px Tahoma";
				// 			context.fillStyle = "black";
				// 			context.fillText(listSrc[idSrc].no, 252 + (i * besarKotak) + spc, 340);
			
				// 			idSrc = idSrc + 1
			
			
				// 			elements.push(
				// 				{
				// 					colour: 'red',
				// 					width: 30, height: 15,
				// 					top: 260, left: 250 + (i * besarKotak) + spc,
				// 					id: ididKlik + 1,
				// 					brs: 3, kol: i + 1, seg: 1
				// 				},
				// 				{
				// 					colour: 'red',
				// 					width: 15, height: 30,
				// 					top: 275, left: 280 + (i * besarKotak) + spc,
				// 					id: ididKlik + 2,
				// 					brs: 3, kol: i + 1, seg: 2
				// 				},
				// 				{
				// 					colour: 'red',
				// 					width: 30, height: 15,
				// 					top: 305, left: 250 + (i * besarKotak) + spc,
				// 					id: ididKlik + 3,
				// 					brs: 3, kol: i + 1, seg: 3
				// 				},
				// 				{
				// 					colour: 'red',
				// 					width: 15, height: 30,
				// 					top: 275, left: 235 + (i * besarKotak) + spc,
				// 					id: ididKlik + 4,
				// 					brs: 3, kol: i + 1, seg: 4
				// 				},
				// 				{
				// 					colour: 'yellow',
				// 					width: 30, height: 30,
				// 					top: 275, left: 250 + (i * besarKotak) + spc,
				// 					id: ididKlik + 5,
				// 					brs: 3, kol: i + 1, seg: 5
				// 				}
				// 			);
				// 			ididKlik = ididKlik + 5
				// 		}
			
				// 		spc = 0
				// 		//sayur kol 4
				// 		for (var i = 0; i < 16; i++) {
				// 			if (i == 8) {
				// 				spc = 20
				// 			}
				// 			context.moveTo(40 + (i * besarKotak) + spc, 430);
				// 			context.lineTo(100 + (i * besarKotak) + spc, 430);
				// 			context.lineTo(100 + (i * besarKotak) + spc, 370);
				// 			context.lineTo(40 + (i * besarKotak) + spc, 370);
				// 			context.lineTo(40 + (i * besarKotak) + spc, 430);
			
				// 			context.moveTo(40 + (i * besarKotak) + spc, 370);
				// 			context.lineTo(55 + (i * besarKotak) + spc, 385);
				// 			context.lineTo(55 + (i * besarKotak) + spc, 415);
				// 			context.lineTo(40 + (i * besarKotak) + spc, 430);
			
				// 			context.moveTo(55 + (i * besarKotak) + spc, 415);
				// 			context.lineTo(85 + (i * besarKotak) + spc, 415);
				// 			context.lineTo(100 + (i * besarKotak) + spc, 430);
			
				// 			context.moveTo(85 + (i * besarKotak) + spc, 415);
				// 			context.lineTo(85 + (i * besarKotak) + spc, 385);
				// 			context.lineTo(100 + (i * besarKotak) + spc, 370);
			
				// 			context.moveTo(85 + (i * besarKotak) + spc, 385);
				// 			context.lineTo(55 + (i * besarKotak) + spc, 385);
			
				// 			context.stroke();
			
				// 			context.font = "20px Tahoma";
				// 			context.fillStyle = "black";
				// 			context.fillText(listSrc[idSrc].no, 57 + (i * besarKotak) + spc, 450);
			
				// 			idSrc = idSrc + 1
			
				// 			elements.push(
				// 				{
				// 					colour: 'red',
				// 					width: 30, height: 15,
				// 					top: 370, left: 55 + (i * besarKotak) + spc,
				// 					id: ididKlik + 1,
				// 					brs: 3, kol: i + 1, seg: 1
				// 				},
				// 				{
				// 					colour: 'red',
				// 					width: 15, height: 30,
				// 					top: 385, left: 85 + (i * besarKotak) + spc,
				// 					id: ididKlik + 2,
				// 					brs: 3, kol: i + 1, seg: 2
				// 				},
				// 				{
				// 					colour: 'red',
				// 					width: 30, height: 15,
				// 					top: 415, left: 55 + (i * besarKotak) + spc,
				// 					id: ididKlik + 3,
				// 					brs: 3, kol: i + 1, seg: 3
				// 				},
				// 				{
				// 					colour: 'red',
				// 					width: 15, height: 30,
				// 					top: 385, left: 40 + (i * besarKotak) + spc,
				// 					id: ididKlik + 4,
				// 					brs: 3, kol: i + 1, seg: 4
				// 				},
				// 				{
				// 					colour: 'yellow',
				// 					width: 30, height: 30,
				// 					top: 385, left: 55 + (i * besarKotak) + spc,
				// 					id: ididKlik + 5,
				// 					brs: 3, kol: i + 1, seg: 5
				// 				}
				// 			);
				// 			ididKlik = ididKlik + 5
			
				// 		}

				// 		function isiColor(element) {
				// 			if (typeIsian == "selai") {
				// 				if (element.seg == 1) {
				// 					context.beginPath();
				// 					context.moveTo(element.left - 15, element.top);
				// 					context.lineTo(element.left - 15 + 60, element.top);
				// 					context.lineTo(element.left - 15 + 60 - 15, element.top + 15);
				// 					context.lineTo(element.left - 15 + 60 - 15 - 30, element.top + 15);
				// 					context.lineTo(element.left - 15, element.top);
				// 					context.closePath();
				// 					context.lineWidth = "1";
				// 					context.strokeStyle = "black";
				// 					context.stroke();
				// 					context.fillStyle = isianColor;
				// 					context.fill();
				// 				}
				// 				if (element.seg == 2) {
				// 					context.beginPath();
				// 					context.moveTo(element.left + 15, element.top - 15);
				// 					context.lineTo(element.left + 15, element.top - 15 + 60);
				// 					context.lineTo(element.left + 15 - 15, element.top - 15 + 60 - 15);
				// 					context.lineTo(element.left + 15 - 15, element.top - 15 + 60 - 15 - 30);
				// 					context.lineTo(element.left + 15, element.top - 15);
				// 					context.closePath();
				// 					context.lineWidth = "1";
				// 					context.strokeStyle = "black";
				// 					context.stroke();
				// 					context.fillStyle = isianColor;
				// 					context.fill();
				// 				}
				// 				if (element.seg == 3) {
				// 					context.beginPath();
				// 					context.moveTo(element.left - 15, element.top + 15);
				// 					context.lineTo(element.left, element.top);
				// 					context.lineTo(element.left + 30, element.top);
				// 					context.lineTo(element.left + 30 + 15, element.top + 15);
				// 					context.lineTo(element.left - 15, element.top + 15);
				// 					context.closePath();
				// 					context.lineWidth = "1";
				// 					context.strokeStyle = "black";
				// 					context.stroke();
				// 					context.fillStyle = isianColor;
				// 					context.fill();
				// 				}
				// 				if (element.seg == 4) {
				// 					context.beginPath();
				// 					context.moveTo(element.left, element.top - 15);
				// 					context.lineTo(element.left + 15, element.top - 15 + 15);
				// 					context.lineTo(element.left + 15, element.top - 15 + 15 + 30);
				// 					context.lineTo(element.left + 15 - 15, element.top - 15 + 15 + 30 + 15);
				// 					context.lineTo(element.left, element.top - 15);
				// 					context.closePath();
				// 					context.lineWidth = "1";
				// 					context.strokeStyle = "black";
				// 					context.stroke();
				// 					context.fillStyle = isianColor;
				// 					context.fill();
				// 				}
				// 				if (element.seg == 5) {
				// 					context.beginPath();
				// 					context.moveTo(element.left, element.top);
				// 					context.lineTo(element.left + 30, element.top);
				// 					context.lineTo(element.left + 30, element.top + 30);
				// 					context.lineTo(element.left, element.top + 30);
				// 					context.lineTo(element.left, element.top);
				// 					context.closePath();
				// 					context.lineWidth = "1";
				// 					context.strokeStyle = "black";
				// 					context.stroke();
				// 					context.fillStyle = isianColor;
				// 					context.fill();
				// 				}
				// 				element.type = typeIsian
				// 				element.color = isianColor
				// 			}
				// 			if (element.seg == 5 && typeIsian != "selai") {
				// 				if (typeIsian == "UE") {
				// 					context.font = "20px Tahoma";
				// 					context.fillStyle = "black";
				// 					context.fillText("UE", element.left + 3, element.top + 24);
				// 				}
				// 				if (typeIsian == "PE") {
				// 					context.font = "20px Tahoma";
				// 					context.fillStyle = "black";
				// 					context.fillText("PE", element.left + 3, element.top + 24);
				// 				}
				// 				if (typeIsian == "A") {
				// 					context.font = "20px Tahoma";
				// 					context.fillStyle = "green";
				// 					context.fillText("A", element.left + 8, element.top + 24);
				// 				}
				// 				if (typeIsian == "/") {
				// 					context.font = "25px Tahoma";
				// 					context.fillStyle = "red";
				// 					context.fillText("/", element.left + 10, element.top + 24);
				// 				}
				// 				if (typeIsian == "SisaAkar") {
				// 					context.font = "25px Tahoma";
				// 					context.fillStyle = "blue";
				// 					context.fillText("√", element.left + 4, element.top + 27);
				// 				}
				// 				if (typeIsian == "gigiHilang") {
				// 					context.font = "35px Tahoma";
				// 					context.fillStyle = "Red";
				// 					context.fillText("X", element.left + 3, element.top + 28);
				// 				}
				// 				if (typeIsian == "Jembatan") {
				// 					context.beginPath();
				// 					context.lineWidth = "7";
				// 					context.strokeStyle = "green";
				// 					context.moveTo(element.left + 2, element.top + 20);
				// 					context.lineTo(element.left + 28, element.top + 20);
				// 					context.stroke();
				// 				}
				// 				if (typeIsian == "GigiTiruanLepas") {
				// 					context.beginPath();
				// 					context.lineWidth = "7";
				// 					context.strokeStyle = "#EED63F";
				// 					context.moveTo(element.left + 2, element.top + 20);
				// 					context.lineTo(element.left + 28, element.top + 20);
				// 					context.stroke();
				// 				}
				// 				element.type = typeIsian
				// 				element.color = "black"
				// 			}
				// 			if (element.type != '') {
				// 				if (element.type != 'white') {
				// 					data2.push(element)
				// 				}
				// 			}
			
				// 		}
				// }
               
                

                $scope.popUpListPemeriksaan.center().open();
				$scope.listFilter = [{ kode: 2, nama: 'Tgl Rencana Kontrol' }, { kode: 1, nama: 'Tgl Terbit Kontrol' }]
				$scope.kontrol = {
					bulan : new Date(),
					nokartu: $scope.temp.nobpjs,
					filter: { kode: 2, nama: 'Tgl Rencana Kontrol' }
				}
				loadGridKontrol();
				loadGridBerkas();
				
				$scope.cariRencana = function(){
					loadGridKontrol()
				}
            }

			function getToken() {
				var arr = document.cookie.split(';')
                var authorization;
                for (var i = 0; i < arr.length; i++) {
                    var element = arr[i].split('=');
                    if (element[0].indexOf('authorization') > 0) {
                        authorization = element[1];
                    }
                }
				return authorization;
			}

			function showLoad(classElm, status) {
				document.getElementById(classElm).style.display  = status;
			}

			$scope.printFormulirKunjungan = function(norec_fr) {
				showLoad('loading-fisioterapi', 'block')
				var authorization = getToken();
				var params = "?norec="+norec_fr;
				var url = baseTransaksi + 'cetak-pdf/formulir-rehabilitasi'+params;
				fetch(url, {
					method: 'GET',
					headers: {'X-AUTH-TOKEN': authorization}
				})
				.then((response) => response.blob())
				.then((blob) => {
					showLoad('loading-fisioterapi', 'none')
					var _url = window.URL.createObjectURL(blob);
					try {
						window.open(_url, "_blank").focus();
					} catch(err) {
						$scope.popUpListPemeriksaan.close();
						var confirm = $mdDialog.confirm()
							.title('Informasi')
							.textContent('waktu proses data habis!, silahkan tekan tombol lanjutkan')
							.ok('Lanjutkan')
							.cancel('Tidak')
						$mdDialog.show(confirm).then(() => {
							$scope.popUpListPemeriksaan.center().open();
							window.open(_url, "_blank");
						}).catch(() => {
							$scope.popUpListPemeriksaan.center().open();
						});
					}
				}).catch((err) => {
					console.log(err);
					showLoad('loading-fisioterapi', 'none')
					toastr.error('Terjadi Kesalahan')
					return
				});
            }

            $scope.printHasil = function(norec_fr, hasil) {
				if(hasil=="" || hasil==undefined) {
					toastr.error("Hasil Belum ada")
                    return;
				}
				showLoad('loading-fisioterapi', 'block')
				var authorization = getToken();
				var params = '?norec='+norec_fr+'&tglregistrasi='+$scope.dataPasienSelected.tglregistrasi;
				var url = baseTransaksi + 'cetak-pdf/formulir-rehabilitasi-uji-fungsi'+params;
				fetch(url, {
					method: 'GET',
					headers: {'X-AUTH-TOKEN': authorization}
				})
				.then((response) => response.blob())
				.then((blob) => {
					showLoad('loading-fisioterapi', 'none')
					var _url = window.URL.createObjectURL(blob);
					try {
						window.open(_url, "_blank").focus();
					} catch(err) {
						$scope.popUpListPemeriksaan.close();
						var confirm = $mdDialog.confirm()
							.title('Informasi')
							.textContent('waktu proses data habis!, silahkan tekan tombol lanjutkan')
							.ok('Lanjutkan')
							.cancel('Tidak')
						$mdDialog.show(confirm).then(() => {
							$scope.popUpListPemeriksaan.center().open();
							window.open(_url, "_blank");
						}).catch(() => {
							$scope.popUpListPemeriksaan.center().open();
						});
					}
				}).catch((err) => {
					console.log(err);
					showLoad('loading-fisioterapi', 'none')
					toastr.error('Terjadi Kesalahan')
					return
				});
			}

            $scope.printFormulir = function(norec_fr) {
				showLoad('loading-fisioterapi', 'block')
				var authorization = getToken();
				var params = "?norec="+norec_fr;
				var url = baseTransaksi + 'cetak-pdf/formulir-rehabilitasi-rj'+params;
				fetch(url, {
					method: 'GET',
					headers: {'X-AUTH-TOKEN': authorization}
				})
				.then((response) => response.blob())
				.then((blob) => {
					showLoad('loading-fisioterapi', 'none')
					var _url = window.URL.createObjectURL(blob);
					try {
						window.open(_url, "_blank").focus();
					} catch(err) {
						$scope.popUpListPemeriksaan.close();
						var confirm = $mdDialog.confirm()
							.title('Informasi')
							.textContent('waktu proses data habis!, silahkan tekan tombol lanjutkan')
							.ok('Lanjutkan')
							.cancel('Tidak')
						$mdDialog.show(confirm).then(() => {
							$scope.popUpListPemeriksaan.center().open();
							window.open(_url, "_blank");
						}).catch(() => {
							$scope.popUpListPemeriksaan.center().open();
						});
					}
				}).catch((err) => {
					console.log(err);
					showLoad('loading-fisioterapi', 'none')
					toastr.error('Terjadi Kesalahan')
					return
				});
            }

			$scope.printasesmenrjgigimulut = function() {
				showLoad('loading-asesmengigi', 'block')
				var authorization = getToken();
				var params = "?norm="+$scope.dataPasienSelected.nocm;
				var url = baseTransaksi + 'cetak-pdf/asesmen-medis-rj-gigi-mulut'+params;
				fetch(url, {
					method: 'GET',
					headers: {'X-AUTH-TOKEN': authorization}
				})
				.then((response) => response.blob())
				.then((blob) => {
					showLoad('loading-asesmengigi', 'none')
					var _url = window.URL.createObjectURL(blob);
					try {
						window.open(_url, "_blank").focus();
					} catch(err) {
						$scope.popUpListPemeriksaan.close();
						var confirm = $mdDialog.confirm()
							.title('Informasi')
							.textContent('waktu proses data habis!, silahkan tekan tombol lanjutkan')
							.ok('Lanjutkan')
							.cancel('Tidak')
						$mdDialog.show(confirm).then(() => {
							$scope.popUpListPemeriksaan.center().open();
							window.open(_url, "_blank");
						}).catch(() => {
							$scope.popUpListPemeriksaan.center().open();
						});
					}
				}).catch((err) => {
					console.log(err);
					showLoad('loading-asesmengigi', 'none')
					toastr.error('Terjadi Kesalahan')
					return
				});
            }

			$scope.asesmenGigiDanMulut = {
				toolbar: [{
					name: "create", text: " ",
					template: '<button ng-click="printasesmenrjgigimulut()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="fa fa-print"></span> &nbsp; Print</button>'
				},],
				pageable: true,
				scrollable: true,
				columns: [
					{ field: "tanggal", title: "Tanggal", width: 120 },
					{ field: "diagnosa", title: "Diagnosa", width: 250 },
					{ field: "tindakan", title: "Tindakan" },
					{ field: "dokter", title: "Dokter", width: 250 },
					// { command: [{ imageClass: "k-icon k-delete", text: "Hapus", click: hapus }], title: "&nbsp;", width: 100 }
				],
			};

			$scope.columnGridFormulirRehabilitasi = [
				{
					field: "norec_fr",
					title: " ",
					template: "<button class=\"btn-custom bg-btn-danger \" ng-click=\"printFormulir('#:norec_fr#')\"> <span class=\"fa fa-print\"></span> Formulir</button>",
					width: "120px"
				},
				{
					field: "norec_fr",
					title: " ",
					template: "<button class=\"btn-custom bg-btn-success \" ng-click=\"printFormulirKunjungan('#:norec_fr#')\"> <span class=\"fa fa-print\"></span> List Kunjungan</button>",
					width: "150px"
				},
				{
					field: "norec_fr",
					title: " ",
					template: "<button class=\"btn-custom bg-btn-amber \" ng-click=\"printHasil('#:norec_fr#', '#:hasil#')\"> <span class=\"fa fa-print\"></span> Hasil</button>",
					width: "100px"
				},
                {
                    "field": "noformulir",
                    "title": "No Formulir",
                    "width": "100px",
                },
                {
                    "field": "tanggal",
                    "title": "Tanggal",
                    "width": "100px",
                },
                {
                    "field": "permintaan",
                    "title": "Permintaan",
                    "width": "400px",
                },
                {
                    "field": "diagnosa",
                    "title": "Diagnosa",
                }
            ];

			$scope.detailGridProgram = function (dataItem) {
                return {
                    dataSource: new kendo.data.DataSource({
                        data: dataItem.details
                    }),
                    columns: [
                        {
                            field: "program",
                            title: "Program",
                        },
                        {
                            field: "tanggal",
                            title: "Tanggal",
                            width: "100px"
                        },
                        {
                            field: "terapi",
                            title: "Terapi",
                            width: "200px"
                        },
                        {
                            field: "dokter",
                            title: "Dokter",
                            width: "200px"
                        }
                    ]
                };
            };

            function conver_rupiah(nStr) {
                nStr += '';
                var x = nStr.split('.');
                var x1 = x[0];
                var x2 = x.length > 1 ? '.' + x[1] : '';
                var rgx = /(\d+)(\d{3})/;
                while (rgx.test(x1)) {
                    x1 = x1.replace(rgx, '$1' + '.' + '$2');
                }
                return x1 + x2;
            }
            

            $scope.columnEmr = {
                selectable: 'row',
                sortable: false,
                pageable: true,
                columns:
                    [ 
                        
                        {
                            "field": "tglemr",
                            "title": "Tgl EMR",
                            "width": "10%",
                            // "template": "<span class='style-left'>{{formatTanggal('#: tglemr #')}}</span>"
                        },
                        {
                            "field": "emrpasienfk",
                            "title": "No EMR",
                            "width": "25%",
                        },
                        {
                            "field": "namaform",
                            "title": "Nama EMR",
                            "width": "45%",
                        },
                        {
                            "command": [
                                { text: "Lihat", click: LihatEmr }
                                // { text: "Download", click: DownloadBerkas }
                            ],
                            title: "",
                            width: "15%",
                        }
                    ]
            }

            $scope.columnDocument = {
                selectable: 'row',
                sortable: false,
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
                                { text: "Lihat", click: LihatBerkas },
                                { text: "Download", click: DownloadBerkas }
                            ],
                            title: "",
                            width: "15%",
                        }
                    ]
            }

            function LihatBerkas(e) 
            {
                e.preventDefault();
				var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                var strBACKEND = baseTransaksi.replace('service/medifirst2000/', '')
                window.open(strBACKEND + "service/storage/berkaspasien?nocm="+ dataItem.nocm + "&filename=" + dataItem.namafile);
            }
            function DownloadBerkas(e) 
            {
                e.preventDefault();
				var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                var strBACKEND = baseTransaksi.replace('service/medifirst2000/', '')
                window.open(strBACKEND + "service/storage/berkaspasien/download?nocm="+ dataItem.nocm + "&filename=" + dataItem.namafile);
            }

            function LihatEmr(e)
            {
                e.preventDefault();
				var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                var local = JSON.parse(localStorage.getItem('profile'));
				var nama = medifirstService.getPegawaiLogin();
				if (dataItem.emrfk == 290006) {
					window.open(baseTransaksi + 'report/cetak-spri?nocm='
					+ dataItem.nocm 
					+ '&norec_apd=' + dataItem.norec_apd 
					+ '&emr=' + dataItem.norec 
					+ '&emrfk=' + dataItem.emrfk
					+ '&index=' + dataItem.index
					+ '&kodeprofile=' + local.id
                    + '&noregistrasi=' + $scope.temp.noregistrasi
					+ '&nama=' + nama, '_blank');
				}
				if (dataItem.emrfk == 291033) {
					window.open(baseTransaksi + 'report/cetak-triase-new?nocm='
					+ dataItem.nocm 
					+ '&norec_apd=' + dataItem.norec_apd 
					+ '&emr=' + dataItem.norec 
					+ '&emrfk=' + dataItem.emrfk
					+ '&index=' + dataItem.index
					+ '&kdprofile=' + local.id
					+ '&nama=' + nama, '_blank');
				}

				if (dataItem.emrfk == 291032) {
					window.open(baseTransaksi + 'report/cetak-triase-anak-new?nocm='
					+ dataItem.nocm 
					+ '&norec_apd=' + dataItem.norec_apd 
					+ '&emr=' + dataItem.norec 
					+ '&emrfk=' + dataItem.emrfk
					+ '&index=' + dataItem.index
					+ '&kdprofile=' + local.id
					+ '&nama=' + nama, '_blank');
				}
				
				if (dataItem.emrfk == 460006) {
					window.open(baseTransaksi + 'report/cetak-ringkasan-pulang-pasien?nocm='
					+ dataItem.nocm 
					+ '&norec_apd=' + dataItem.norec_apd 
					+ '&emr=' + dataItem.norec 
					+ '&emrfk=' + dataItem.emrfk
					+ '&index=' + dataItem.index
					+ '&kdprofile=' + local.id
					+ '&nama=' + nama, '_blank');
				}
				if (dataItem.emrfk == 291039) {
					window.open(baseTransaksi + 'report/cetak-laporan-operasi?nocm='
					+ dataItem.nocm 
					+ '&norec_apd=' + dataItem.norec_apd 
					+ '&emr=' + dataItem.norec 
					+ '&emrfk=' + dataItem.emrfk
					+ '&index=' + dataItem.index
					+ '&kdprofile=' + local.id
					+ '&nama=' + nama, '_blank');
				}

				if (dataItem.emrfk == 460008) {
					window.open(baseTransaksi + 'report/cetak-intake-output?nocm='
					+ dataItem.nocm 
					+ '&norec_apd=' + dataItem.norec_apd 
					+ '&emr=' + dataItem.norec 
					+ '&emrfk=' + dataItem.emrfk
					+ '&index=' + dataItem.index
					+ '&kdprofile=' + local.id
					+ '&nama=' + nama, '_blank');
				}
				if (dataItem.emrfk == 291064) {
					window.open(baseTransaksi + 'report/cetak-asesmen-fisio-bpjs?nocm='
					+ dataItem.nocm 
					+ '&norec_apd=' + dataItem.norec_apd 
					+ '&emr=' + dataItem.norec 
					+ '&emrfk=' + dataItem.emrfk
					+ '&index=' + dataItem.index
					+ '&kdprofile=' + local.id
					+ '&nama=' + nama, '_blank');
				}
				if (dataItem.emrfk == 291045) {
					window.open(baseTransaksi + 'report/cetak-asesmen-rajal?nocm='
					+ dataItem.nocm 
					+ '&norec_apd=' + dataItem.norec_apd 
					+ '&emr=' + dataItem.norec 
					+ '&emrfk=' + dataItem.emrfk
					+ '&index=' + dataItem.index
					+ '&kdprofile=' + local.id
					+ '&nama=' + nama, '_blank');
				}
				if (dataItem.emrfk == 291074) {
					window.open(baseTransaksi + 'report/cetak-asesmen-fisioterapi-anak?nocm='
					+ dataItem.nocm 
					+ '&norec_apd=' + dataItem.norec_apd 
					+ '&emr=' + dataItem.norec 
					+ '&emrfk=' + dataItem.emrfk
					+ '&index=' + dataItem.index
					+ '&kdprofile=' + local.id
					+ '&nama=' + nama, '_blank');
				}
				if (dataItem.emrfk == 291065) {
					window.open(baseTransaksi + 'report/cetak-asesmen-fisio-wicara?nocm='
					+ dataItem.nocm 
					+ '&norec_apd=' + dataItem.norec_apd 
					+ '&emr=' + dataItem.norec 
					+ '&emrfk=' + dataItem.emrfk
					+ '&index=' + dataItem.index
					+ '&kdprofile=' + local.id
					+ '&noregistrasi=' + dataItem.noregistrasi
					+ '&nama=' + nama, '_blank');
				}



            }

            $scope.cetakResume = function () {
				if($scope.dataPasienSelected==undefined) {
					toastr.warning('Pilih data yang ingin di print');
                    return;
				}
				// window.open(baseTransaksi+'cetak/resume-medis-rj?norec='+$scope.dataPasienSelected.norec_resume, '_blank');

				var btnElm = angular.element(document.getElementById("btnCetakResumeRJ"));
				var normalBottom = btnElm.html();
                var spinLoadPDF = angular.element('<span class="fa fa-spinner fa-spin"></span> &nbsp; <span>Sedang Mencari File</span>');
                
                btnElm.empty();
                btnElm.append(spinLoadPDF);
				btnElm.attr("disabled", "disabled");
				
				var authorization = getToken();
				var params = "?norec="+$scope.dataPasienSelected.norec_resume;
				var url = baseTransaksi + 'cetak-pdf/resume-medis-rj'+params;
				fetch(url, {
					method: 'GET',
                    headers: {'X-AUTH-TOKEN': authorization}
				})
                .then((response) => response.blob())
				.then((blob) => {
					btnElm.empty();
					btnElm.append(normalBottom);
					btnElm.removeAttr("disabled");
					var _url = window.URL.createObjectURL(blob);
					try {
						window.open(_url, "_blank").focus();
					} catch(err) {
						$scope.popUpListPemeriksaan.close();
						var confirm = $mdDialog.confirm()
							.title('Informasi')
							.textContent('waktu proses data habis!, silahkan tekan tombol lanjutkan')
							.ok('Lanjutkan')
							.cancel('Tidak')
						$mdDialog.show(confirm).then(() => {
							$scope.popUpListPemeriksaan.center().open();
							window.open(_url, "_blank");
						}).catch(() => {
							$scope.popUpListPemeriksaan.center().open();
						});
					}
				}).catch((err) => {
					console.log(err);
					btnElm.empty();
					btnElm.append(normalBottom);
					btnElm.removeAttr("disabled");
					toastr.error('Terjadi Kesalahan')
					return
				});
			}
				
            $scope.cetakBilling = function () {
				if($scope.dataPasienSelected==undefined) {
					toastr.warning('Pilih data yang ingin di print');
                    return;
				}
				// window.open(baseTransaksi+'klaim/print-billing?norec_pd='+$scope.dataPasienSelected.norec_pd
                //     +"&ruangan="+$scope.dataPasienSelected.namaruangan
                //     +"&dokter="+$scope.dataPasienSelected.dokter, '_blank');

				var btnCetakBilling = angular.element(document.getElementById("btnCetakBilling"));
				var normalBottom = btnCetakBilling.html();
				var spinLoadPDF = angular.element('<span class="fa fa-spinner fa-spin"></span> &nbsp; <span>Sedang Mencari File</span>');
				
				btnCetakBilling.empty();
				btnCetakBilling.append(spinLoadPDF);
				btnCetakBilling.attr("disabled", "disabled");
				
				var authorization = getToken();
				var params = '?noregistrasi='+$scope.dataPasienSelected.noregistrasi
                               + "&user=" + medifirstService.getPegawai().namaLengkap
                              + "&kdprofile="+ medifirstService.getProfile().id;

				var url = baseTransaksi + 'report/billingbpjs'+params;

            
				fetch(url, {
					method: 'GET',
					headers: {'X-AUTH-TOKEN': authorization}
				})
				.then((response) => response.blob())
				.then((blob) => {
					btnCetakBilling.empty();
					btnCetakBilling.append(normalBottom);
					btnCetakBilling.removeAttr("disabled");
					var _url = window.URL.createObjectURL(blob);
					try {
						window.open(_url, "_blank").focus();
					} catch(err) {
						$scope.popUpListPemeriksaan.close();
						var confirm = $mdDialog.confirm()
							.title('Informasi')
							.textContent('waktu proses data habis!, silahkan tekan tombol lanjutkan')
							.ok('Lanjutkan')
							.cancel('Tidak')
						$mdDialog.show(confirm).then(() => {
							$scope.popUpListPemeriksaan.center().open();
							window.open(_url, "_blank");
						}).catch(() => {
							$scope.popUpListPemeriksaan.center().open();
						});
					}
				}).catch((err) => {
					console.log(err);
					btnCetakBilling.empty();
					btnCetakBilling.append(normalBottom);
					btnCetakBilling.removeAttr("disabled");
					toastr.error('Terjadi Kesalahan')
					return
				});
			}

            // $scope.claim_print = function () {
            //     if($scope.dataPasienSelected.nosep==undefined) {
			// 		toastr.warning('Pilih data yang ingin di print');
            //         return;
			// 	}

			// 	var dt1 = {}
			// 	var dt2 = []
			// 	dt1 = {
			// 		"metadata": {"method": "claim_print"},
			// 		"data": {"nomor_sep": $scope.dataPasienSelected.nosep}
			// 	}
			// 	dt2.push(dt1)
			// 	var objData = {"data": dt2}
			// 	medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
			// 		var responData = e.data.dataresponse;
			// 		if (responData[0].dataresponse.metadata.code == 200) {
			// 			const linkSource = 'data:application/pdf;base64,' + responData[0].dataresponse.data;
			// 			const downloadLink = document.createElement("a");
			// 			var tglprint = moment($scope.now).format('YYYY-MM-DD');
			// 			var a = responData[0].datarequest.data.nomor_sep
			// 			var nama = a.substr(15);
			// 			const fileName = nama + ".pdf";
			// 			downloadLink.href = linkSource;
			// 			downloadLink.download = fileName;
			// 			downloadLink.click();
								

						
			// 		}
			// 		toastr.info(responData[0].dataresponse.metadata.message, 'INACBG');
			// 	})
			// }

			$scope.claim_print = function () {
				if ($scope.dataPasienSelected.nosep == undefined) {
					toastr.warning('Pilih data yang ingin di print');
					return;
				}
			
				var dt1 = {};
				var dt2 = [];
				dt1 = {
					"metadata": { "method": "claim_print" },
					"data": { "nomor_sep": $scope.dataPasienSelected.nosep }
				};
				dt2.push(dt1);
				var objData = { "data": dt2 };
			
				medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
					var responData = e.data.dataresponse;
					if (responData[0].dataresponse.metadata.code == 200) {
						var byteCharacters = atob(responData[0].dataresponse.data);
						var byteNumbers = new Array(byteCharacters.length);
						for (var i = 0; i < byteCharacters.length; i++) {
							byteNumbers[i] = byteCharacters.charCodeAt(i);
						}
						var byteArray = new Uint8Array(byteNumbers);
						var blob = new Blob([byteArray], { type: 'application/pdf' });
			
						var pdfUrl = URL.createObjectURL(blob);
			
						var printWindow = window.open(pdfUrl, '_blank');
						
						
					}
			
					toastr.info(responData[0].dataresponse.metadata.message, 'INACBG');
				});
			};
			
			

            $scope.printsep = function () {
                $("#qr_code").empty();
                var qrcode = new QRCode("qr_code", {
                    text: $scope.dataPasienSelected.nobpjs,
                    width: 128,
                    height: 128,
                    colorDark : "#000000",
                    colorLight : "#ffffff",
                    correctLevel : QRCode.CorrectLevel.H
                });
                if ($scope.dataPasienSelected.noregistrasi != undefined && $scope.dataPasienSelected.kelompokpasien !== "Umum/Pribadi") {
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
                }
            }

            let namappkRumahSakit =''
			medifirstService.get('sysadmin/settingdatafixed/get/namaPPKRujukan').then(function (dat) {
                namappkRumahSakit = dat.data
            })
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
                var klsrawat = response.peserta.hakKelas//response.kelasRawat
				if (response.jnsPelayanan == 'Rawat Inap') {
					var kelasrawat = response.kelasRawat
				} else {
					var kelasrawat = '-'
				}
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
				medifirstService.jspdfSEP(nosep + backdate, tglsep, nokartu, nmpst, tgllahir, jnskelamin, notelp, poli, faskesperujuk, dxawal, catatan, kelasrawat, jnspst, cob, jnsrawat, klsrawat,
                    prolanis, eksekutif, _kodejaminan, statuskll, katarak, potensiprb,cetakan, dokter, kunjungan, FLAGPROSEDUR, poliPerujuk, FLAGNAIKKELAS, klsrawat_naik,
					 isrujukanthalasemia_hemofilia, ispotensiHEMOFILIA_cetak,namappkRumahSakit);


            }

            function getUlasanKlaim() {
                medifirstService.get("klaim/get-ulasan-klaim?noregistrasifk="+$scope.dataPasienSelected.norec_pd+"&isbpjs=true", false).then(function (e) {
                    console.log(e.data);
                    $scope.dataulasan = e.data;
                    document.getElementById("load-history-ulasan").style.display  = "none";
                    document.getElementById("content-ulasan").style.display  = "block";
                })
            }
            
            $scope.btnUlasan = function () {
                if($scope.dataPasienSelected==undefined) {
                    toastr.error("pilih data terlebih dahulu!")
                    return;
                }
                document.getElementById("load-history-ulasan").style.display  = "block";
                document.getElementById("content-ulasan").style.display  = "none";
                getUlasanKlaim();
                $scope.popUpUlasan.center().open();
            }

			$scope.resep_print = function (dataresep, btnidresep) {
                if($scope.dataPasienSelected==undefined) {
                    toastr.error("pilih data terlebih dahulu!")
                    return;
                }
                window.open(
                    baseTransaksi+'report/cetak-resep-obat-biasa/?norec_so='+dataresep.norec_order
                    // +'&noorder='+dataresep.noorder
                    // +'&tglorder='+ moment(dataresep.tglorder).format('YYYY-MM-DD') 
                    // +'&norm='+$scope.dataPasienSelected.nocm
                    // +'&noregistrasi='+$scope.dataPasienSelected.noregistrasi    
                    // +'&namapasien='+$scope.dataPasienSelected.namapasien    
                    // +'&tgllahir='+ moment($scope.dataPasienSelected.tgllahir).format('YYYY-MM-DD')
                    // +'&alamatrmh='+$scope.dataPasienSelected.alamatrmh 
                    // +'&namaruangan='+dataresep.namaruanganrawat    
                    // +'&dokter='+dataresep.pengorder
                    // +'&namapengambilorder='+dataresep.namapengambilorder
                    // +'&nosep='+$scope.dataPasienSelected.nosep
                    // +'&kelompokpasien='+$scope.dataPasienSelected.kelompokpasien
                    ,'_blank',
                );

				var btnElm = angular.element(document.getElementById(btnidresep));
				var normalBottom = btnElm.html();
				var spinLoadPDF = angular.element('<span class="fa fa-spinner fa-spin"></span> &nbsp; <span>Proses</span>');
				
				btnElm.empty();
				btnElm.append(spinLoadPDF);
				btnElm.attr("disabled", "disabled");
				
				var authorization = getToken();
				var params = '?norec_so='+dataresep.norec_order
						+'&noorder='+dataresep.noorder
						+'&tglorder='+ moment(dataresep.tglorder).format('YYYY-MM-DD') 
						+'&norm='+$scope.dataPasienSelected.nocm
						+'&noregistrasi='+$scope.dataPasienSelected.noregistrasi    
						+'&namapasien='+$scope.dataPasienSelected.namapasien    
						+'&tgllahir='+ moment($scope.dataPasienSelected.tgllahir).format('YYYY-MM-DD')
						+'&alamatrmh='+$scope.dataPasienSelected.alamatrmh 
						+'&namaruangan='+dataresep.namaruanganrawat    
						+'&dokter='+dataresep.pengorder
						+'&namapengambilorder='+dataresep.namapengambilorder
						+'&nosep='+$scope.dataPasienSelected.nosep
						+'&kelompokpasien='+$scope.dataPasienSelected.kelompokpasien;

				var url = baseTransaksi + 'cetak-pdf/resep-farmasi'+params;
				fetch(url, {
					method: 'GET',
					headers: {'X-AUTH-TOKEN': authorization}
				})
				.then((response) => response.blob())
				.then((blob) => {
					btnElm.empty();
					btnElm.append(normalBottom);
					btnElm.removeAttr("disabled");
					var _url = window.URL.createObjectURL(blob);
					try {
						window.open(_url, "_blank").focus();
					} catch(err) {
						$scope.popUpListPemeriksaan.close();
						var confirm = $mdDialog.confirm()
							.title('Informasi')
							.textContent('waktu proses data habis!, silahkan tekan tombol lanjutkan')
							.ok('Lanjutkan')
							.cancel('Tidak')
						$mdDialog.show(confirm).then(() => {
							$scope.popUpListPemeriksaan.center().open();
							window.open(_url, "_blank");
						}).catch(() => {
							$scope.popUpListPemeriksaan.center().open();
						});
					}
				}).catch((err) => {
					console.log(err);
					btnElm.empty();
					btnElm.append(normalBottom);
					btnElm.removeAttr("disabled");
					toastr.error('Terjadi Kesalahan')
					return
				});
            }

            $scope.cetakResumeRI = function () {

				medifirstService.get("bridging/inacbg/get-resume-ri?noregistrasi="+$scope.temp.noregistrasi , true).then(function (e) {

					var dataLogin = medifirstService.getPegawaiLogin();
                var norec = e.data.data.norec
                window.open(baseTransaksi + 'report/cetak-ringkasan-pulang-pasien?'
					+ '&emr=' + norec
					+ '&emrfk=' + 460006
					+ '&kdprofile=' + 46
					+ '&user=' + dataLogin.id
					, '_blank');
				})
            }
            $scope.resumeHd = function () {

				medifirstService.get("bridging/inacbg/get-resume-hd?noregistrasi="+$scope.temp.noregistrasi , true).then(function (e) {

					var dataLogin = medifirstService.getPegawaiLogin();
                var norec = e.data.data.norec
                window.open(baseTransaksi + 'report/cetak-resume-hemodialisa?'
					+ '&emr=' + norec
					+ '&emrfk=' + 291088
					+ '&kdprofile=' + 46
					+ '&user=' + dataLogin.id
					, '_blank');
				})
            }

            $scope.cetakSKM = function () {

				medifirstService.get("bridging/inacbg/get-emr-pasien-skm?noregistrasi="+$scope.temp.noregistrasi , true).then(function (e) {

				if (e.data.data == null) {
						toastr.warning('Data tidak ditemukan');
						return;
				}
                var norec = e.data.data.norec
                window.open(baseTransaksi + 'report/cetak-skm-rajal?'
					+ '&emr=' + norec
					+ '&emrfk=' + 291045
					+ '&kdprofile=' + 46
					, '_blank');
				})
            }

            $scope.cetakSKMGigi = function () {
				medifirstService.get("bridging/inacbg/get-emr-pasien-skm-gigi?noregistrasi="+$scope.temp.noregistrasi , true).then(function (e) {

                var norec = e.data.data.norec
                window.open(baseTransaksi + 'report/cetak-skm-gigi?'
					+ '&emr=' + norec
					+ '&emrfk=' + 460011
					+ '&kdprofile=' + 46
					, '_blank');
				})
            }

            $scope.cetakSKMIGDanak = function () {
				medifirstService.get("bridging/inacbg/get-emr-pasien-skm-igd-anak?noregistrasi="+$scope.temp.noregistrasi , true).then(function (e) {
                var norec = e.data.data.norec
                window.open(baseTransaksi + 'report/cetak-skm-igd-anak?'
					+ '&emr=' + norec
					+ '&emrfk=' + 291032
					+ '&kdprofile=' + 46
					, '_blank');
				})
            }

            $scope.cetakSKMIGDdewasa = function () {
				medifirstService.get("bridging/inacbg/get-emr-pasien-skm-igd-dewasa?noregistrasi="+$scope.temp.noregistrasi , true).then(function (e) {

                var norec = e.data.data.norec
                window.open(baseTransaksi + 'report/cetak-skm-igd-dewasa?'
					+ '&emr=' + norec
					+ '&emrfk=' + 291033
					+ '&kdprofile=' + 46
					, '_blank');
				})
            }

            $scope.cetakSKMFisio = function () {
				medifirstService.get("bridging/inacbg/get-emr-pasien-skm-fisiobpjs?noregistrasi="+$scope.temp.noregistrasi , true).then(function (e) {
					if (e.data.data == null) {
						toastr.warning('Data tidak ditemukan');
						return;
					}
                var norec = e.data.data.norec
                var emrfk = e.data.data.emrfk
				if (emrfk == 291064) {					
					window.open(baseTransaksi + 'report/cetak-skm-fisiobpjs?'
						+ '&emr=' + norec
						+ '&emrfk=' + emrfk
						+ '&kdprofile=' + 46
						, '_blank');
					}
				if (emrfk == 291074) {					
					window.open(baseTransaksi + 'report/cetak-skm-fisioananak?'
						+ '&emr=' + norec
						+ '&emrfk=' + emrfk
						+ '&kdprofile=' + 46
						, '_blank');
					}
				if (emrfk == 291065) {
					window.open(baseTransaksi + 'report/cetak-skm-fisiobpjs?'
						+ '&emr=' + norec
						+ '&emrfk=' + emrfk
						+ '&kdprofile=' + 46
						, '_blank');
					}
				}
				)
            }

            $scope.simpanUlasan = function() {
                if($scope.item.ulasan==undefined) {
                    toastr.error("Ulasan masih kosong!")
                    return;
                }
                
                var dataLogin = medifirstService.getPegawaiLogin();
                var saveData = {
                    noregistrasifk: $scope.dataPasienSelected.norec_pd,
                    tglregistrasi: moment($scope.dataPasienSelected.tglregistrasi).format('YYYY-MM-DD HH:mm'),
                    tglpulang: moment($scope.dataPasienSelected.tglpulang).format('YYYY-MM-DD HH:mm'),
                    ulasan: $scope.item.ulasan,
                    namapetugas: dataLogin.namaLengkap,
                    isbpjs: true,
                }
                document.getElementById("load-history-ulasan").style.display  = "block";
                document.getElementById("content-ulasan").style.display  = "none";
                medifirstService.post('klaim/ulasan-klaim/save', saveData).then(function (e) {
                    getUlasanKlaim();
                })
            }

			// $scope.cetakSuratKeteranganKematian = function () {
			// 	var user = medifirstService.getPegawaiLogin().namaLengkap
			// 	if ($scope.dataPasienSelected == undefined) {
			// 	  toastr.error('Pilih data dulu!')
			// 	  return
			// 	}
			// 	if ($scope.dataPasienSelected.tglmeninggal == undefined) {
			// 		toastr.warning('Pilih Pasien Dengan Status Meninggal!', 'Warning');
			// 		return
			// 	}

			// 	var btnElm = angular.element(document.getElementById("btnCetakSuratKeteranganKematian"));
			// 	var normalBottom = btnElm.html();
			// 	var spinLoadPDF = angular.element('<span class="fa fa-spinner fa-spin"></span> &nbsp; <span>Mohon Tunggu</span>');
				
			// 	var authorization = getToken();
			// 	btnElm.empty();
			// 	btnElm.append(spinLoadPDF);
			// 	btnElm.attr("disabled", "disabled");
				
			// 	var params = '?noreg='+$scope.dataPasienSelected.noregistrasi+'&nocm='+$scope.dataPasienSelected.nocm;
			// 	var url = baseTransaksi + 'cetak-pdf/surat-kematian'+params;
			// 	fetch(url, {
			// 		method: 'GET',
			// 		headers: {'X-AUTH-TOKEN': authorization}
			// 	})
			// 	.then((response) => response.blob())
			// 	.then((blob) => {
			// 		btnElm.empty();
			// 		btnElm.append(normalBottom);
			// 		btnElm.removeAttr("disabled");
			// 		var _url = window.URL.createObjectURL(blob);
			// 		try {
			// 			window.open(_url, "_blank", "directories=no, titlebar=no, toolbar=no, location=no, status=yes, menubar=no, scrollbars=no, resizable=no, addressbar=no, top=10, left=100,width=800,height=500").focus();
			// 		} catch(err) {
			// 			$scope.popUpListPemeriksaan.close();
			// 			var confirm = $mdDialog.confirm()
			// 				.title('Informasi')
			// 				.textContent('waktu proses data habis!, silahkan tekan tombol lanjutkan')
			// 				.ok('Lanjutkan')
			// 				.cancel('Tidak')
			// 			$mdDialog.show(confirm).then(() => {
			// 				$scope.popUpListPemeriksaan.center().open();
			// 				window.open(_url, "_blank", "directories=no, titlebar=no, toolbar=no, location=no, status=yes, menubar=no, scrollbars=no, resizable=no, addressbar=no, top=10, left=100,width=800,height=500").focus();
			// 			}).catch(() => {
			// 				$scope.popUpListPemeriksaan.center().open();
			// 			});
			// 		}
			// 	}).catch((err) => {
			// 		console.log(err);
			// 		btnElm.empty();
			// 		btnElm.append(normalBottom);
			// 		btnElm.removeAttr("disabled");
			// 		toastr.error('Terjadi Kesalahan')
			// 		return
			// 	});
			// }
			// $scope.cetakSuratPengangkutanJenazah = function () {
			// 	if ($scope.dataPasienSelected == undefined) {
			// 	  toastr.warning('Pilih Data Pasien dulu', 'Warning');
			// 	  return
			// 	}
		
			// 	if ($scope.dataPasienSelected.tglmeninggal == undefined) {
			// 	  toastr.warning('Pilih Pasien Dengan Status Meninggal!', 'Warning');
			// 	  return
			// 	}

			// 	// window.open(
			// 	// 	baseTransaksi+'cetak/surat-izin-pengangkutan-jenazah?noreg='+$scope.dataPasienSelected.noregistrasi+'&nocm='+$scope.dataPasienSelected.nocm,
			// 	// 	'_blank',
			// 	// 	'directories=no, titlebar=no, toolbar=no, location=no, status=yes, menubar=no, scrollbars=no, resizable=no, addressbar=no, top=10, left=100,width=800,height=500'
			// 	// );

			// 	var btnElm = angular.element(document.getElementById("btnCetakSuratPengangkutanJenazah"));
			// 	var normalBottom = btnElm.html();
			// 	var spinLoadPDF = angular.element('<span class="fa fa-spinner fa-spin"></span> &nbsp; <span>Mohon Tunggu</span>');
				
			// 	var authorization = getToken();

			// 	btnElm.empty();
			// 	btnElm.append(spinLoadPDF);
			// 	btnElm.attr("disabled", "disabled");
				
			// 	var params = '?noreg='+$scope.dataPasienSelected.noregistrasi+'&nocm='+$scope.dataPasienSelected.nocm;
			// 	var url = baseTransaksi + 'cetak-pdf/surat-izin-pengangkutan-jenazah'+params;
			// 	fetch(url, {
			// 		method: 'GET',
			// 		headers: {'X-AUTH-TOKEN': authorization}
			// 	})
			// 	.then((response) => response.blob())
			// 	.then((blob) => {
			// 		btnElm.empty();
			// 		btnElm.append(normalBottom);
			// 		btnElm.removeAttr("disabled");
			// 		var _url = window.URL.createObjectURL(blob);
			// 		try {
			// 			window.open(_url, "_blank", "directories=no, titlebar=no, toolbar=no, location=no, status=yes, menubar=no, scrollbars=no, resizable=no, addressbar=no, top=10, left=100,width=800,height=500").focus();
			// 		} catch(err) {
			// 			$scope.popUpListPemeriksaan.close();
			// 			var confirm = $mdDialog.confirm()
			// 				.title('Informasi')
			// 				.textContent('waktu proses data habis!, silahkan tekan tombol lanjutkan')
			// 				.ok('Lanjutkan')
			// 				.cancel('Tidak')
			// 			$mdDialog.show(confirm).then(() => {
			// 				$scope.popUpListPemeriksaan.center().open();
			// 				window.open(_url, "_blank", "directories=no, titlebar=no, toolbar=no, location=no, status=yes, menubar=no, scrollbars=no, resizable=no, addressbar=no, top=10, left=100,width=800,height=500");
			// 			}).catch(() => {
			// 				$scope.popUpListPemeriksaan.center().open();
			// 			});
			// 		}
			// 	}).catch((err) => {
			// 		console.log(err);
			// 		btnElm.empty();
			// 		btnElm.append(normalBottom);
			// 		btnElm.removeAttr("disabled");
			// 		toastr.error('Terjadi Kesalahan')
			// 		return
			// 	});
			// }


			$scope.bundledokumen = function() {
				var noregistrasi = $scope.temp.noregistrasi;
                var strBACKEND = baseTransaksi.replace('service/medifirst2000/', '')
                window.open(strBACKEND + "service/storage/bundledokumenklaim?noregistrasi="+ noregistrasi);
			}


			function loadGridKontrol(){
                var tahun = moment($scope.kontrol.bulan).format('YYYY'); 
                var bulan = moment($scope.kontrol.bulan).format('MM');
                var noka = $scope.kontrol.nokartu;
                var filter = $scope.kontrol.filter.kode;
                if(!$scope.kontrol.nokartu) {
                    $scope.isRouteLoading = false
                    toastr.info("Nomor kartu belum diisi !");
                    return
                }

                var json = {
                    "url": `RencanaKontrol/ListRencanaKontrol/Bulan/${bulan}/Tahun/${tahun}/Nokartu/${noka}/filter/${filter}`,
                    "method": "GET",
                    "data": null
                }
                // $scope.isRouteLoading = true;
                medifirstService.postNonMessage("bridging/bpjs/tools", json).then(function (e) {
                    $scope.isRouteLoading = false;
                    var result = e.data;
                    var dataGrid = [];
                    if(result.metaData.code == "200") {
                        for (let i = 0; i < e.data.response.list.length; i++) {
                            e.data.response.list[i].no = i + 1;
                        }
                        dataGrid = result.response.list;
                    }
                    // toastr.info(result.metaData.message);
                    $scope.dataSourceSPRI = new kendo.data.DataSource({
                        data: dataGrid,
                        pageSize: 10,
                        serverPaging: false,
                    });
                })
            }

			$scope.columnGridSPRI = {
                selectable: 'row',
				dataBound: onDataBound,
				pageable: true,
                columns: [
                {
                    "command": [
                        {
                            text: " Cetak",
                            click: cetakSurkon,
                        },
                        // {
                        //     text: " Hapus",
                        //     click: hapusSurkon,
                        // }
                    ],
                    title: "",
                    width: "100px",
                },
                {
                    "field": "no",
                    "title": "No",
                    "width": "40px",
                    "attributes": { align: "center" }

                },
                {
                    "field": "noKartu",
                    "title": "No Kartu",
                    "width": "150px",
                },
                {
                    "field": "nama",
                    "title": "Nama",
                    "width": "200px",
                },
                {
                    "field": "noSuratKontrol",
                    "title": "No Surat",
                    "width": "200px",
                },
                {
                    "field": "namaJnsKontrol",
                    "title": "Jenis",
                    "width": "150px",
                },
                {
                    "field": "terbitSEP",
                    "title": "Terbit SEP",
                    "width": "100px",
                },
                {
                    "field": "tglRencanaKontrol",
                    "title": "Tgl Rencana Kontrol",
                    "width": "100px",
                }, 
                {

                    "field": "tglTerbitKontrol",
                    "title": "Tgl Terbit Kontrol ",
                    "width": "100px",
                },
                {

                    "field": "noSepAsalKontrol",
                    "title": "No SEP Asal",
                    "width": "200px",
                },
                {
                    "field": "tglSEP",
                    "title": "Tgl SEP ",
                    "width": "100px",
                },
                {

                    "field": "namaPoliAsal",
                    "title": "Poli Asal",
                    "width": "100px",
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
            }

			function cetakSurkon (e) {
                e.preventDefault()
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                let nosuratkontrol = dataItem.noSuratKontrol 
                let tglrencanakontrol = dataItem.tglRencanaKontrol
                let txttglentrirencanakontrol = dataItem.tglTerbitKontrol
                let noka = dataItem.noKartu
                let nama =  $scope.temp.namapasien
                let tgllahir = moment(new Date($scope.temp.tgllahir)).format('YYYY-MM-DD')
                let namaPoliTujuan = dataItem.namaPoliTujuan
                let jeniskelamin = $scope.temp.jeniskelamin
                let jnsKontrol = dataItem.jnsKontrol
                let namaDokter =  dataItem.namaDokter
                let nmdpjpsepasal =  $scope.temp.dpjp  ? $scope.temp.dpjp  :'-'
                let dxawal = '-'
                $scope.isRouteLoading = true;
                if(dataItem.noSepAsalKontrol!=null){
                    let json = {
                        "url": "sep/"+dataItem.noSepAsalKontrol,
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
                                $scope.isRouteLoading = false;
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
                            $scope.isRouteLoading = false;
                            toastr.error(e.data.metaData.message);
                        }
                    })
                }else{
                    $scope.isRouteLoading = false;
                    dxawal = '-'
                    jspdfctk(nosuratkontrol, tglrencanakontrol, txttglentrirencanakontrol, noka,
                        nama,tgllahir,namappkRumahSakit, namaPoliTujuan, jeniskelamin,dxawal, '-',
                        jnsKontrol, '', tglrencanakontrol, namaDokter,nmdpjpsepasal);
                }

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
                        nama = 'November';
                        break
                    case '12':
                        nama = 'Desember';
                        break
                }
                return nama;
            }

			function AddZero(num) {
                return (num >= 0 && num < 10) ? "0" + num : num + "";
            }

			$scope.cetakSurketHemo = function () {
				medifirstService.get("bridging/inacbg/get-surket-hemo?noreg="+$scope.temp.noregistrasi , true).then(function (e) { 
					var dataLogin = medifirstService.getPegawaiLogin();
					if (e.data.data == null) {
						toastr.warning('Data tidak ditemukan');
						return;
					}
					var norec = e.data.data.norec
					window.open(baseTransaksi + 'report/cetak-surket-hemodialisa-rajal?'
						+ '&emr=' + norec
						+ '&emrfk=' + 460034
						+ '&kdprofile=' + 46
						+ '&user=' + dataLogin.id
						, '_blank');

				})
			}

			function loadGridBerkas() {
				// $scope.isRouteLoading = true
				document.getElementById("load-berkaslain").style.display  = "block";
                medifirstService.get("emr/get-berkas-pasien?nocm=" + $scope.temp.norm, true).then(function (dat) {
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

			$scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY HH:mm');
            }

			function dokumen(e) {
				e.preventDefault();
				var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

				var noregistrasi = dataItem.noregistrasi;
				var strBACKEND = baseTransaksi.replace('service/medifirst2000/', '')
				window.open(strBACKEND + "service/storage/bundledokumenklaim?noregistrasi="+ noregistrasi);
			}

			$scope.selectRow = function (dataItem) {
				var dataSelect = _.find($scope.dataSourceGrid._data, function (data) {
					return data.norec_pd == dataItem.norec_pd;
				});

				if (dataSelect.statCheckbox) {
					dataSelect.statCheckbox = false;
				}
				else {
					if (dataSelect.listdokumen == 'Tidak Ada') {
						toastr.warning('Berkas tidak ada!, Tidak bisa dipilih!')
						dataSelect.statCheckbox = false;
					} else {
						dataSelect.statCheckbox = true;
					}
				}

				var tempData = $scope.dataSourceGrid._data;
				var ceklisterpilih = 0;
                for (var i = 0; i < tempData.length; i++) {
                    if (tempData[i].statCheckbox === true && tempData[i].listdokumen != 'Tidak Ada') {
                       ceklisterpilih += 1;
                    }
                }
                $scope.item.terpilih = ceklisterpilih;
				
				
			}

            var isCheckAll = false
            $scope.selectUnselectAllRow = function () {
				var tempData = $scope.dataSourceGrid._data;

				if (isCheckAll) {
					isCheckAll = false;
					for (var i = 0; i < tempData.length; i++) {
						tempData[i].statCheckbox = false;
					}
				}
				else {
					isCheckAll = true;
					for (var i = 0; i < tempData.length; i++) {
						if (tempData[i].listdokumen != 'Tidak Ada') {
							tempData[i].statCheckbox = true;
						}
						
					}
				}

				var ceklisterpilih = 0;
                for (var i = 0; i < tempData.length; i++) {
                    if (tempData[i].statCheckbox === true && tempData[i].listdokumen != 'Tidak Ada') {
                       ceklisterpilih += 1;
                    }
                }
                $scope.item.terpilih = ceklisterpilih;

				reloadDataGrid(tempData);
			}

            function reloadDataGrid(dsv) {
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

                var grid = $('#kGrid').data("kendoGrid");

                grid.setDataSource(newDsv);
                grid.refresh();

            }

			// $scope.unduhBerkas = async function () {
			// 	$scope.disabledtombol = true
			// 	var gridDokumen = $scope.dataSourceGrid._data
			// 	var hasChecked = $scope.dataSourceGrid._data.some(function(item) {
			// 		return item.statCheckbox === true && item.listdokumen != 'Tidak Ada';
			// 	});
				
			// 	var authorization = getToken();
			// 	if (hasChecked) {
			// 		for (let i = 0; i < gridDokumen.length; i++) {
			// 			const element = gridDokumen[i];
			// 			if (element.statCheckbox == true) {
				
			// 				var strBACKEND = baseTransaksi.replace('service/medifirst2000/', '');
			// 				var downloadUrl = strBACKEND + "service/storage/bundledokumenklaim?noregistrasi=" + element.noregistrasi + "&nosep=" + element.nosep;
			// 				$scope.disabledtombol = true
			// 				$scope.isRouteLoading = true;
			// 				await fetch(downloadUrl, {
			// 					method: 'GET',
			// 					headers: {
			// 						'X-AUTH-TOKEN': authorization
			// 					}
			// 				})
			// 				.then(response => response.blob())
			// 				.then(blob => {
			// 					$scope.$apply(() => {
			// 						$scope.isRouteLoading = false;
			// 						$scope.disabledtombol = false;
			// 					});
			// 					const link = document.createElement('a');
			// 					link.href = URL.createObjectURL(blob); 
			// 					link.download = element.nosep + '.pdf';
			// 					link.click();
			// 				})
			// 				.catch((error) => {
			// 					$scope.$apply(() => {
			// 						$scope.isRouteLoading = false;
			// 						$scope.disabledtombol = false;
			// 					});
			// 					toastr.error("Download Berkas gagal.");
			// 				});
			// 			}
						
			// 		}
			// 	}else {
			// 		toastr.warning('Harap ceklis setidaknya satu data!')
			// 		$scope.disabledtombol = false;
            //         return;
			// 	}
			// }

			$scope.unduhBerkas = async function () {
				$scope.disabledtombol = true;
				let gridDokumen = $scope.dataSourceGrid._data;
				
				let hasChecked = gridDokumen.some(item => 
					item.statCheckbox === true && item.listdokumen !== 'Tidak Ada'
				);
			
				let authorization = getToken();
				if (hasChecked) {
					$scope.isRouteLoading = true;
			
					let itemsToDownload = gridDokumen.filter(item => item.statCheckbox === true);
					let batchSize = 2; 
					let currentIndex = 0;
			
					while (currentIndex < itemsToDownload.length) {
	
						let batch = itemsToDownload.slice(currentIndex, currentIndex + batchSize);
			
						let downloadPromises = batch.map(element => {
							let strBACKEND = baseTransaksi.replace('service/medifirst2000/', '');
							let downloadUrl = strBACKEND + "service/storage/bundledokumenklaim?noregistrasi=" + element.noregistrasi + "&nosep=" + element.nosep;
			
							return fetch(downloadUrl, {
								method: 'GET',
								headers: {
									'X-AUTH-TOKEN': authorization
								}
							})
							.then(response => response.blob())
							.then(blob => {
								const link = document.createElement('a');
								link.href = URL.createObjectURL(blob);
								link.download = element.nosep + '.pdf';
								link.click();
							})
							.catch(error => {
								toastr.error(`Download gagal untuk ${element.nosep}`);
							});
						});
						await Promise.all(downloadPromises);
						currentIndex += batchSize;
					}
			
					$scope.$apply(() => {
						$scope.isRouteLoading = false;
						$scope.disabledtombol = false;
					});
				} else {
					toastr.warning('Harap ceklis setidaknya satu data!');
					$scope.disabledtombol = false;
				}
			};
			
			

			function getToken() {
				var arr = document.cookie.split(';')
                var authorization;
                for (var i = 0; i < arr.length; i++) {
                    var element = arr[i].split('=');
                    if (element[0].indexOf('authorization') > 0) {
                        authorization = element[1];
                    }
                }
				return authorization;
			}

			$scope.uploadLip = async function () {
				$scope.disabledtombol = true
				var gridDokumen = $scope.dataSourceGrid._data
				var hasChecked = $scope.dataSourceGrid._data.some(function(item) {
					return item.statCheckbox === true && item.listdokumen != 'Tidak Ada';
				});
				
				if (hasChecked) {
					for (let i = 0; i < gridDokumen.length; i++) {
						const element = gridDokumen[i];
						if (element.statCheckbox == true) {

							await simpanDokumen2(element)
							
						}
						
					}
				}else {
					toastr.warning('Harap ceklis setidaknya satu data!')
					$scope.disabledtombol = false;
                    return;
				}
			}

			async function simpanDokumen2(data) {
					var dt1 = {};
					var dt2 = [];
					dt1 = {
						"metadata": { "method": "claim_print" },
						"data": { "nomor_sep": data.nosep }
					};
					dt2.push(dt1);
					var objData = { "data": dt2 };
					var dokid = 68
					if (data.id_dep == 16) {
						dokid = 49
					}
					$scope.disabledtombol = false;
					await medifirstService.postNonMessage('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
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
							formData.append("iddok",  dokid);
							
							fetch(url, {
								method: 'POST',
								body: formData
							})
							.then(response => response.json())
							.then(data => {
								toastr.success( data.message);
								$scope.disabledtombol = false;
							})
							.catch(error => {
								toastr.error(error.message);
							});


						} else {
							toastr.info('LIP belum bisa di posting!, ' + responData[0].dataresponse.metadata.message)
						}
					});

            }

        }

	

    ]);     
});
