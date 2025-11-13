define(['initialize', 'Configuration'], function (initialize, config) {
    'use strict';
    var baseTransaksi = config.baseApiBackend;
    initialize.controller('DaftarKlaimRanapCtrl', ['MedifirstService', '$mdDialog', 'CacheHelper', '$scope', 'DateHelper', '$state', 'ModelItem', 
        function (medifirstService, $mdDialog, cacheHelper, $scope, DateHelper, $state, ModelItem) {
			$scope.now = new Date();
			$scope.item = {};
			$scope.listRuangan = [];
			$scope.isRouteLoading = false;
			$scope.temp = {}
			$scope.temppasien  = {}
			$scope.tempresumeRI  = {}
			$scope.tempfarmasi = [];
			$scope.tempberkasemr = [];
			$scope.templaboratorium = [];
			$scope.tempradiologi = [];

			$scope.heightPopUpListPemeriksaan = window.innerHeight>700 ? window.innerHeight - 100 : 700;
			getSizePopListPemeriksaan()
			function getSizePopListPemeriksaan() {
				var headerListPemeriksaan = document.getElementById("headerListPemeriksaan");
				var heightContentTabListPemeriksaan = $scope.heightPopUpListPemeriksaan - (headerListPemeriksaan.offsetHeight + 120);
				var content = document.getElementsByClassName("content-tab-custom");
				for(var i=0; i < content.length; i++) { 
					content[i].style.maxHeight = heightContentTabListPemeriksaan+'px';
				}
			}

			
			loadFirst()
            function loadFirst() {
                var chacePeriode = cacheHelper.get('KlaimPasienRanapCtrl');
				if (chacePeriode != undefined) {
                    var arrPeriode = chacePeriode;
					$scope.item.periodeAwal = new Date(arrPeriode[0]);
					$scope.item.periodeAkhir = new Date(arrPeriode[1]);
                } else {
                    $scope.item.periodeAwal = moment($scope.now).format('YYYY-MM-DD 00:00');
                    $scope.item.periodeAkhir = moment($scope.now).format('YYYY-MM-DD 23:59');
                }

                medifirstService.get("rawatinap/get-data-combo-dokter", false).then(function (data) {
                    $scope.listRuangan = data.data.ruanganRanap;
                });

            }

			$scope.cari = function () {
                loadData();
            }

            loadData();
            function loadData() {
                $scope.isRouteLoading = true;
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
                var nosep = ""
                if ($scope.item.nosep != undefined) {
                    nosep = "&nosep=" + $scope.item.nosep
                }

                medifirstService.get("klaim/get-daftar-klaim-ranap?tglAwal=" + tglAwal + "&tglAkhir=" + tglAkhir + 
                        noregistrasi + 
                        norm + 
                        namapasien + 
                        ruangan + 
                        nosep 
                    , true).then(function (e) {    
                        // console.log(e);     
                    $scope.isRouteLoading = false;
                    for(var i = 0;i<e.data.length; i++) {
                        var status = '';
                        if(e.data[i].statusklaim == "send_claim_individual") {
                            status = "Terkirim";
                        } 
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

                });

                var chacePeriode = {
                    0 :	$scope.item.periodeAwal,
                    1 : $scope.item.periodeAkhir,
                }
                cacheHelper.set('KlaimPasienRanapCtrl', chacePeriode);
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
                    fileName: "DaftarKlaimRawatInap.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.name = "Laporan";

                    var myHeaders = [{
                        value: "Daftar Klaim Rawat Inap",
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
                        "field": "tglregistrasi",
                        "title": "Tgl Registrasi",
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
                        "width": "100px",
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
                        "width": "100px",
                    },
                    // {
                    //     "field": "ketKlaim",
                    //     "title": "Status Klaim",
                    //     "width": "100px",
                    // },
                    {
                        "field": "totalpiutangpenjamin",
                        "title": "Total Grouping",
                        "width": "10%"
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
                    // {
                    //     "field": "ulasan",
                    //     "title": "Ulasan ",
                    //     "width": "10%"
                    // },
                ]
            };
            

			$scope.showListPemeriksaan = function () {
				$scope.temp = {}
				$scope.temppasien  = {}
				$scope.tempresumeRI  = {}
				$scope.tempfarmasi = [];
				$scope.tempberkasemr = [];
				$scope.templaboratorium = [];
				$scope.tempradiologi = [];

				if($scope.dataPasienSelected==undefined) {
					toastr.warning('Pilih data terlebih dahulu');
                    return;
				}
				$scope.temp.norm = $scope.dataPasienSelected.nocm;
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
                $scope.temp.alamatrmh = $scope.dataPasienSelected.alamatrmh;
                $scope.temp.nosep = $scope.dataPasienSelected.nosep;
                $scope.temp.totalgrouping = "0";
                if($scope.dataPasienSelected.totalpiutangpenjamin!="1") {
                    $scope.temp.totalgrouping = conver_rupiah($scope.dataPasienSelected.totalpiutangpenjamin);
                }
				// var loading_mini = document.getElementById("loading-mini").innerHTML;

				// document.getElementById("load-popup-resumeri").style.display  = "block";
                // medifirstService.get('klaim/get-data-pasien?noregistrasi=' + $scope.dataPasienSelected.noregistrasi, false).then(function (e) {
				// 	console.log(e)
					// $scope.temppasien = e.data
					// $scope.temppasien.totalgrouping = conver_rupiah($scope.dataPasienSelected.totalpiutangpenjamin);
				// 	document.getElementById("load-popup-resumeri").style.display  = "none";
					
				// 	document.getElementById("content-resumeri").style.display = "none";
				// 	document.getElementById("load-resumeri").innerHTML = loading_mini
				// 	medifirstService.get('klaim/get-berkas-ri-koding?noregistrasi=' + $scope.temppasien.noregistrasi, false).then(function (e) {
				// 		if(e.data.resume!=undefined) {
				// 			$scope.tempresumeRI = e.data.resume
				// 			$scope.tempresumeRI.resumelistDiagnosaSecondar = e.data.diagnosasecondar
				// 			$scope.tempresumeRI.resumelistTindakan = e.data.tindakan
				// 			document.getElementById("content-resumeri").style.display = "block";
				// 			document.getElementById("content-resumeri-notfound").innerHTML = ''
				// 		} else {
				// 			document.getElementById("content-resumeri").style.display = "none";
				// 			document.getElementById("content-resumeri-notfound").innerHTML = "<div class='notfound'>Data Resume tidak ada!</div>"
				// 		}
				// 		document.getElementById("load-resumeri").innerHTML = ''
						
					// })

				// 	document.getElementById("content-farmasi").style.display = "none";
				// 	document.getElementById("content-farmasi-notfound").innerHTML = ''
				// 	document.getElementById("load-farmasi").innerHTML = loading_mini
				// 	medifirstService.get("klaim/get-klaim-farmasi?noregistrasi="+$scope.temppasien.noregistrasi, false).then(function (e) {
				// 		if(Object.keys(e.data.data).length>0) {
				// 			$scope.tempfarmasi = e.data.data;
				// 			document.getElementById("content-farmasi").style.display = "block";
				// 			document.getElementById("content-farmasi-notfound").innerHTML = ''
				// 		} else {
				// 			document.getElementById("content-farmasi").style.display = "none";
				// 			document.getElementById("content-farmasi-notfound").innerHTML = "<div class='notfound'>Data Farmasi tidak ada!</div>"
				// 		}
				// 		document.getElementById("load-farmasi").innerHTML = ''
				// 	})
				// 	document.getElementById("content-radiologi").style.display = "none";
				// 	document.getElementById("content-radiologi-notfound").innerHTML = ''
				// 	document.getElementById("load-radiologi").innerHTML = loading_mini
				// 	medifirstService.get("klaim/get-klaim-radiologi?noregistrasi="+$scope.temppasien.noregistrasi, false).then(function (e) {
				// 		if(Object.keys(e.data).length>0) {
				// 			$scope.tempradiologi = e.data;
				// 			document.getElementById("content-radiologi").style.display = "block";
				// 			document.getElementById("content-radiologi-notfound").innerHTML = ''
				// 		} else {
				// 			document.getElementById("content-radiologi").style.display = "none";
				// 			document.getElementById("content-radiologi-notfound").innerHTML = "<div class='notfound'>Data Radiologi tidak ada!</div>"
				// 		}
				// 		document.getElementById("load-radiologi").innerHTML = ''
						
				// 	})
				// 	document.getElementById("content-laboratorium").style.display = "none";
				// 	document.getElementById("content-laboratorium-notfound").innerHTML = ''
				// 	document.getElementById("load-laboratorium").innerHTML = loading_mini
				// 	medifirstService.get("klaim/get-klaim-laboratorium?noregistrasi="+ $scope.temppasien.noregistrasi+
				// 		"&umur="+$scope.temppasien.umurThn+
				// 		"&objectjeniskelaminfk="+$scope.temppasien.objectjeniskelaminfk, false).then(function (e) { 
				// 			if(Object.keys(e.data).length>0) {
				// 				$scope.templaboratorium = e.data;
				// 				document.getElementById("content-laboratorium").style.display = "block";
				// 				document.getElementById("content-laboratorium-notfound").innerHTML = ''
				// 			} else {
				// 				document.getElementById("content-laboratorium").style.display = "none";
				// 				document.getElementById("content-laboratorium-notfound").innerHTML = "<div class='notfound'>Data Laboratorium tidak ada!</div>"
				// 			}

				// 			document.getElementById("load-laboratorium").innerHTML = ''
				// 	})

				// 	document.getElementById("content-berkas-emr").style.display = "none";
				// 	document.getElementById("content-berkas-emr-notfound").innerHTML = ''
				// 	document.getElementById("load-berkas-emr").innerHTML = loading_mini
				// 	medifirstService.get("klaim/get-berkas-emr?noregistrasi="+$scope.temppasien.noregistrasi, false).then(function (e) {
				// 		if(Object.keys(e.data).length>0) {
				// 			$scope.tempberkasemr = e.data;
				// 			document.getElementById("content-berkas-emr").style.display = "block";
				// 			document.getElementById("content-berkas-emr-notfound").innerHTML = ''
				// 		} else {
				// 			document.getElementById("content-berkas-emr").style.display = "none";
				// 			document.getElementById("content-berkas-emr-notfound").innerHTML = "<div class='notfound'>Data berkas EMR tidak ada!</div>"
				// 		}
				// 		document.getElementById("load-berkas-emr").innerHTML = ''
				// 	})

				// 	document.getElementById("content-dokument").style.display = "none";
				// 	document.getElementById("load-dokument").innerHTML = loading_mini
				// 	medifirstService.get("klaim/get-klaim-dokument?noregistrasi=" + $scope.temppasien.noregistrasi, true).then(function (e) {
				// 		$scope.dataDocument = new kendo.data.DataSource({
				// 			data: e.data,
				// 			pageSize: 10,
				// 			serverPaging: false,
				// 			schema: {model: {fields: {}}}
				// 		});
				// 		document.getElementById("content-dokument").style.display = "block";
				// 		document.getElementById("load-dokument").innerHTML = ''
				// 	})

				// 	$scope.temppasien.namadokter = $scope.dataPasienSelected.dokter;
				// }) 

				$scope.popUpListPemeriksaan.center().open();
				getSizePopListPemeriksaan()
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

			$scope.cetakResumeRI = function () {
				if($scope.dataPasienSelected==undefined) {
					toastr.warning('Pilih data terlebih dahulu');
                    return;
				}
				if($scope.tempresumeRI.norecresume==undefined) {
					toastr.error('Resume tidak ditemukan');
                    return;
				}
				// window.open(config.baseApiBackend+'cetak/resume-medis-ri?norec='+$scope.tempresumeRI.norecresume, '_blank');

				var btnElm = angular.element(document.getElementById('btnCetakResumeRI'));
				var normalBottom = btnElm.html();
				var spinLoadPDF = angular.element('<span class="fa fa-spinner fa-spin"></span> &nbsp; <span>Sedang Mencari File</span>');
				
				btnElm.empty();
				btnElm.append(spinLoadPDF);
				btnElm.attr("disabled", "disabled");
				
				var authorization = getToken();
				var params = '?norec='+$scope.tempresumeRI.norecresume;
				var url = baseTransaksi + 'cetak-pdf/resume-medis-ri'+params;
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

			$scope.cetakRingkasanMasukKeluarRI = function () {
				if($scope.dataPasienSelected==undefined) {
					toastr.warning('Pilih data terlebih dahulu');
                    return;
				}
				if($scope.tempresumeRI.norecresume==undefined) {
					toastr.error('Resume tidak ditemukan');
                    return;
				}
				// window.open(config.baseApiBackend+'cetak/ringkasan-masuk-dan-keluar?norec='+$scope.tempresumeRI.norecresume, '_blank');

				var btnElm = angular.element(document.getElementById('btnCetakRingkasanMasukKeluarRI'));
				var normalBottom = btnElm.html();
				var spinLoadPDF = angular.element('<span class="fa fa-spinner fa-spin"></span> &nbsp; <span>Sedang Mencari File</span>');
				
				btnElm.empty();
				btnElm.append(spinLoadPDF);
				btnElm.attr("disabled", "disabled");
				
				var authorization = getToken();
				var params = '?norec='+$scope.tempresumeRI.norecresume;
				var url = baseTransaksi + 'cetak-pdf/ringkasan-masuk-dan-keluar'+params;
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

			$scope.cetakFormulirPindahRS = function () {
				if($scope.dataPasienSelected==undefined) {
					toastr.warning('Pilih data terlebih dahulu');
                    return;
				}
				if($scope.tempresumeRI.norecresume==undefined) {
					toastr.error('Resume tidak ditemukan');
                    return;
				}

				if($scope.tempresumeRI.objectstatuspulangfk!=4) {
					toastr.warning('Pasien tidak dirujuk / pindah ke rumah sakit lain');
                    return;
				}
				// window.open(config.baseApiBackend+'cetak/formulir-pindah-rs?norec='+$scope.tempresumeRI.norecresume, '_blank');
				var btnElm = angular.element(document.getElementById('btnCetakFormulirPindahRS'));
				var normalBottom = btnElm.html();
				var spinLoadPDF = angular.element('<span class="fa fa-spinner fa-spin"></span> &nbsp; <span>Sedang Mencari File</span>');
				
				btnElm.empty();
				btnElm.append(spinLoadPDF);
				btnElm.attr("disabled", "disabled");
				
				var authorization = getToken();
				var params = '?norec='+$scope.tempresumeRI.norecresume;
				var url = baseTransaksi + 'cetak-pdf/formulir-pindah-rs'+params;
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
					toastr.warning('Pilih data terlebih dahulu');
                    return;
				}
				// window.open(config.baseApiBackend+'klaim/print-billing?norec_pd='+$scope.temppasien.norecpd
                //     +"&ruangan="+$scope.temppasien.namaruangan
                //     +"&dokter="+$scope.temppasien.namadokter, '_blank');

				var btnElm = angular.element(document.getElementById('btnCetakBilling'));
				var normalBottom = btnElm.html();
				var spinLoadPDF = angular.element('<span class="fa fa-spinner fa-spin"></span> &nbsp; <span>Sedang Mencari File</span>');
				
				btnElm.empty();
				btnElm.append(spinLoadPDF);
				btnElm.attr("disabled", "disabled");
				
				var authorization = getToken();
				var params = '?norec_pd='+$scope.temppasien.norecpd
						+"&ruangan="+$scope.temppasien.namaruangan
						+"&dokter="+$scope.temppasien.namadokter;

				var url = baseTransaksi + 'cetak-pdf/billing'+params;
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

			$scope.cetakSuratPenunjang  = function (ket) {
				var iket = ''
				if(ket=='ket-igd') {
					iket = 'Surat Keterangan Gawat Darurat';
				} else if(ket=='ket-opname') {
					iket = 'Surat Keterangan Opname';
				}
				document.getElementById("load-popup-resumeri").style.display  = "block";
				medifirstService.get('surat-keterangan-penunjang/get-surat-keterangan?noregistrasifk='+$scope.temppasien.norecpd+'&ket='+iket).then(function (e) {
					document.getElementById("load-popup-resumeri").style.display  = "none";
					if(e.data.norec == undefined) {
						toastr.error(iket+' Tidak Ditemukan');
                    	return;
					}
					// window.open(config.baseApiBackend + "cetak/surat-keterangan-penunjang/"+ket+"?norec=" + e.data.norec,  '_blank');

					var authorization = getToken();
					var params = "?norec=" + e.data.norec

					document.getElementById("load-popup-resumeri").style.display  = "block";
					var url = baseTransaksi + 'cetak-pdf/surat-keterangan-penunjang/'+ket+params;
					fetch(url, {
						method: 'GET',
						headers: {'X-AUTH-TOKEN': authorization}
					})
					.then((response) => response.blob())
					.then((blob) => {
						document.getElementById("load-popup-resumeri").style.display  = "none";
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
						document.getElementById("load-popup-resumeri").style.display  = "none";
						toastr.error('Terjadi Kesalahan')
						return
					});
				})
			}

			$scope.resep_print = function (dataresep, btnidresep) {
                if($scope.dataPasienSelected==undefined) {
                    toastr.error("pilih data terlebih dahulu!")
                    return;
                }
                // window.open(
                //     baseTransaksi+'cetak/cetak-resep-farmasi/?norec_so='+dataresep.norec_order
                //     +'&noorder='+dataresep.noorder
                //     +'&tglorder='+ moment(dataresep.tglorder).format('YYYY-MM-DD') 
                //     +'&norm='+$scope.dataPasienSelected.nocm
                //     +'&noregistrasi='+$scope.dataPasienSelected.noregistrasi    
                //     +'&namapasien='+$scope.dataPasienSelected.namapasien    
                //     +'&tgllahir='+ moment($scope.dataPasienSelected.tgllahir).format('YYYY-MM-DD')
                //     +'&alamatrmh='+$scope.dataPasienSelected.alamatrmh 
                //     +'&namaruangan='+dataresep.namaruanganrawat    
                //     +'&dokter='+dataresep.pengorder
                //     +'&namapengambilorder='+dataresep.namapengambilorder
                //     +'&nosep='+$scope.dataPasienSelected.nosep
                //     +'&kelompokpasien='+$scope.dataPasienSelected.kelompokpasien
                //     ,'_blank',
                // );

				var btnElm = angular.element(document.getElementById(btnidresep));
				var normalBottom = btnElm.html();
				var spinLoadPDF = angular.element('<span class="fa fa-spinner fa-spin"></span> &nbsp; <span>Proses</span>');
				
				btnElm.empty();
				btnElm.append(spinLoadPDF);
				btnElm.attr("disabled", "disabled");
				
				var authorization = getToken();
				var params = '?norec_so='+dataresep.norec_order
						+'&noorder='+dataresep.noorder
						+'&tglorder='+ moment(dataresep.tglorder).format('YYYY-MM-DD HH:mm') 
						+'&norm='+$scope.dataPasienSelected.nocm
						+'&noregistrasi='+$scope.dataPasienSelected.noregistrasi    
						+'&namapasien='+$scope.dataPasienSelected.namapasien    
						+'&tgllahir='+ moment($scope.dataPasienSelected.tgllahir).format('YYYY-MM-DD')
						+'&alamatrmh='+$scope.dataPasienSelected.alamatlengkap 
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

			$scope.cetakSuratKematian = function () {
				if($scope.dataPasienSelected==undefined) {
					toastr.warning('Pilih data terlebih dahulu');
                    return;
				}

				if($scope.temppasien.objectstatuspulangfk!=9) {
					toastr.warning('Hanya pasien meninggal yang bisa di cetakkan surat keterangan meninggal');
                    return;
				}
				
				// window.open(
				// 	config.baseApiBackend+'cetak/surat-kematian?noreg='+$scope.temppasien.noregistrasi+'&nocm='+$scope.temppasien.nocm,
				// 	'_blank',
				// 	'directories=no, titlebar=no, toolbar=no, location=no, status=yes, menubar=no, scrollbars=no, resizable=no, addressbar=no, top=10, left=100,width=800,height=500'
				// );

				var authorization = getToken();
				var params = '?noreg='+$scope.temppasien.noregistrasi+'&nocm='+$scope.temppasien.nocm
				document.getElementById("load-popup-resumeri").style.display  = "block";
				var url = baseTransaksi + 'cetak-pdf/surat-kematian/'+ket+params;
				fetch(url, {
					method: 'GET',
					headers: {'X-AUTH-TOKEN': authorization}
				})
				.then((response) => response.blob())
				.then((blob) => {
					document.getElementById("load-popup-resumeri").style.display  = "none";
					var _url = window.URL.createObjectURL(blob);
					try {
						window.open(_url, "_blank", "directories=no, titlebar=no, toolbar=no, location=no, status=yes, menubar=no, scrollbars=no, resizable=no, addressbar=no, top=10, left=100,width=800,height=500").focus();
					} catch(err) {
						$scope.popUpListPemeriksaan.close();
						var confirm = $mdDialog.confirm()
							.title('Informasi')
							.textContent('waktu proses data habis!, silahkan tekan tombol lanjutkan')
							.ok('Lanjutkan')
							.cancel('Tidak')
						$mdDialog.show(confirm).then(() => {
							$scope.popUpListPemeriksaan.center().open();
							window.open(_url, "_blank", "directories=no, titlebar=no, toolbar=no, location=no, status=yes, menubar=no, scrollbars=no, resizable=no, addressbar=no, top=10, left=100,width=800,height=500");
						}).catch(() => {
							$scope.popUpListPemeriksaan.center().open();
						});
					}
				}).catch((err) => {
					console.log(err);
					document.getElementById("load-popup-resumeri").style.display  = "none";
					toastr.error('Terjadi Kesalahan')
					return
				});
			}

			$scope.cetakBerkasEMR = function (item, btnLembarEmr) {
				if($scope.dataPasienSelected==undefined) {
					toastr.warning('Pilih data terlebih dahulu');
                    return;
				}
				// window.open(config.baseApiBackend+'cetak/lembaran-emr?emrfk='+item.id+'&noemr='+item.noemr+'&norm='+$scope.temppasien.nocm, '_blank');
				
				var btnElm = angular.element(document.getElementById(btnLembarEmr));
				var normalBottom = btnElm.html();
				var spinLoadPDF = angular.element('<span class="fa fa-spinner fa-spin"></span> &nbsp; <span>Proses</span>');
				
				btnElm.empty();
				btnElm.append(spinLoadPDF);
				btnElm.attr("disabled", "disabled");
				
				var authorization = getToken();
				var params = '?emrfk='+item.id+'&noemr='+item.noemr+'&norm='+$scope.temppasien.nocm;
				var url = baseTransaksi + 'cetak-pdf/lembar-emr'+params;
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

                var strBACKEND = config.baseApiBackend.replace('service/medifirst2000/', '')
                window.open(strBACKEND + "service/storage/berkaspasien?nocm="+ dataItem.nocm + "&filename=" + dataItem.namafile);
            }
            function DownloadBerkas(e) 
            {
                e.preventDefault();
				var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                var strBACKEND = config.baseApiBackend.replace('service/medifirst2000/', '')
                window.open(strBACKEND + "service/storage/berkaspasien/download?nocm="+ dataItem.nocm + "&filename=" + dataItem.namafile);
            }

			$scope.claim_print = function () {
                if($scope.dataPasienSelected.nosep==undefined) {
					toastr.warning('Pilih data yang ingin di print');
                    return;
				}

				var dt1 = {}
				var dt2 = []
				dt1 = {
					"metadata": {"method": "claim_print"},
					"data": {"nomor_sep": $scope.dataPasienSelected.nosep}
				}
				dt2.push(dt1)
				var objData = {"data": dt2}
				medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
					var responData = e.data.dataresponse;
					if (responData[0].dataresponse.metadata.code == 200) {
						const linkSource = 'data:application/pdf;base64,' + responData[0].dataresponse.data;
						const downloadLink = document.createElement("a");
						var tglprint = moment($scope.now).format('YYYY-MM-DD');
						var a = responData[0].datarequest.data.nomor_sep
						var nama = a.substr(15);
						const fileName = nama + ".pdf";
						downloadLink.href = linkSource;
						downloadLink.download = fileName;
						downloadLink.click();
					}
					toastr.info(responData[0].dataresponse.metadata.message, 'INACBG');
				})
			}

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
                medifirstService.jspdfSEP(nosep + backdate, tglsep, nokartu, nmpst, tgllahir, jnskelamin, notelp, poli, faskesperujuk, dxawal, catatan, jnspst, cob, jnsrawat, klsrawat,
                    prolanis, eksekutif, _kodejaminan, statuskll, katarak, potensiprb,cetakan, dokter, kunjungan, FLAGPROSEDUR, poliPerujuk, FLAGNAIKKELAS, klsrawat_naik,
                     isrujukanthalasemia_hemofilia, ispotensiHEMOFILIA_cetak,namappkRumahSakit);
            }

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


		}
	])
})