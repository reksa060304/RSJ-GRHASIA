define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('UpdateAntrolOtomatisCtrl', ['$mdDialog', '$timeout', '$state', '$q', '$rootScope', '$scope', 'CacheHelper', 'DateHelper', 'MedifirstService',
		function ($mdDialog, $timeout, $state, $q, $rootScope, $scope, cacheHelper, dateHelper, medifirstService) {

			$scope.isRouteLoading = false;
			$scope.dataVOloaded = true;
			$scope.now = new Date();
			$scope.item = {};
			$scope.log = {};
			$scope.item.tanggal = moment($scope.now).format('YYYY-MM-DD');
			$scope.totalAntrean = 0
			$scope.totalLengkap = 0
			$scope.totalQuality = 0
			$scope.totalRata = 0
			$scope.totalBelum = 0
			$scope.totalSepTerbitByBridging = 0
			$scope.totalSepTerbitByMJKN = 0
			$scope.capaianAntrol = 0;
			$scope.capaianMJKN = 0;
			$scope.totalJkn = 0;
			$scope.totalNonJKN = 0;
			$scope.jmlAntreanJKN = 0;
			$scope.jmlAntreanNonJKN = 0;
			$scope.jmlAntreanBySumber = 0;
			$scope.jmlAntreanByMJKN = 0;
			$scope.jmlAntreanJKN = 0;
			$scope.totalLengkapByBridging = 0
			$scope.totalLengkapByMJKN = 0

			var data2 = [];
			$scope.tombolSimpanVis = true;
			loadCombo()
			loadData()
			function loadCombo() {
				$scope.listKelompokPasien = [
					{
						id: 1,
						value: "JKN"
					}, {
						id: 2,
						value: "NON JKN"
					}
				]
			}

			async function loadData() {
				$scope.isRouteLoading = true;
				var tanggal = moment($scope.item.tanggal).format("YYYY-MM-DD");

				var kdBooking = ""
				if ($scope.item.kdBooking != undefined) {
					var kdBooking = "&kdBooking=" + $scope.item.kdBooking
				}

				var kelompok = ""
				if ($scope.item.kelompokpasien != undefined) {
					kelompok = "&kelId=" + $scope.item.kelompokpasien.id
				}


				$scope.totalLengkapByBridging = 0;
				$scope.totalLengkapByMJKN = 0;
				$scope.totalSepTerbitByBridging = 0;
				$scope.totalSepTerbitByMJKN = 0;
				$scope.capaianAntrol = 0;
				$scope.capaianMJKN = 0;
				$scope.totalJkn = 0;
				$scope.jmlAntreanJKN = 0;
				$scope.jmlAntreanNonJKN = 0;
				$scope.jmlAntreanBySumber = 0;
				$scope.jmlAntreanByMJKN = 0;
				$scope.jmlAntreanJKN = 0;
				$scope.dataDaftarPasien = null;
				$scope.dataMonitoring = null;




				var dt_sep = {
					url: "Monitoring/Kunjungan/Tanggal/" + tanggal + "/JnsPelayanan/2",
					method: "GET",
					data: null,
				};

				await medifirstService.postNonMessage('bridging/bpjs/tools', dt_sep).then(function (x0) {
					if (x0.data.metaData.code == 200) {
						var res0 = [];
						res0 = x0.data.response.sep;
						res0.forEach(elm0 => {
							if (elm0.poli != 'IGD') {
								$scope.totalSepTerbitByBridging += 1;
							}

						})
					}
				});



				var dtreg = [];
				await medifirstService.get("rawatjalan/get-informasi-monitoring-taskid?" +
					"tglAwal=" + moment(tanggal).format('YYYY-MM-DD 00:00:00') +
					"&tglAkhir=" + moment(tanggal).format('YYYY-MM-DD 23:59:59')
				).then(function (x1) {
					if (x1.data.length > 0) {
						dtreg = x1.data;
					}
				});

				var data = {
					"url": "antrean/pendaftaran/tanggal/" + tanggal,
					"method": "GET",
					"data": null,
					"jenis": "antrean"
				}
				await medifirstService.postNonMessage('bridging/bpjs/tools', data).then(function (x) {
					if (x.data.metaData.code == 200) {

						// console.log(x.data.response)
						var res = [];

						res = x.data.response;

						var dtapop = [];
						var no = 1;

						res.forEach(elm => {
							var jeniskunjungan = "";
							switch (elm.jeniskunjungan) {
								case 1:
									jeniskunjungan = "Rujukan"
									break;
								case 2:
									jeniskunjungan = "Rujukan Internal"
									break;
								case 3:
									jeniskunjungan = "Kontrol"
									break;
								case 4:
									jeniskunjungan = "Rujukan Antar RS"
									break;
								default:
									break;
							}






							// let dtregfilter = filterByValue(dtreg, elm.kodebooking);
							// console.log(dtregfilter)
							var kodebooking = elm.kodebooking;
							if (elm.sumberdata == "Bridging Antrean") {
								// kodebooking = elm.kodebooking.replace('B', '');
							}

							let dtregfilter = dtreg.filter(function (flt) {
								return flt.noregistrasi == kodebooking;
							})

							if (elm.status != 'Batal') {

								var nm_pasien = "-";
								var nm_ruangan = "-";
								var nm_rekanan = "-";
								var no_registrasifk = "";
								if (dtregfilter.length > 0) {
									nm_pasien = dtregfilter[0].namapasien;
									nm_ruangan = dtregfilter[0].namaruangan;
									nm_rekanan = dtregfilter[0].namarekanan;
									no_registrasifk = dtregfilter[0].noregistrasifk

									//get jml antrean JKN
									if (elm.ispeserta == true &&
										elm.status != 'Batal'
									) {
										$scope.jmlAntreanJKN += 1;
									}
									//get jml antrean Non JKN
									if (elm.ispeserta == false &&
										elm.status != 'Batal'
									) {
										$scope.jmlAntreanNonJKN += 1;
									}
									//get jml antrean by sumber mjkn
									if (elm.ispeserta == true &&
										elm.kodepoli != "IGD" &&
										elm.status != 'Batal' &&
										elm.sumberdata == 'Mobile JKN'
									) {
										$scope.jmlAntreanByMJKN += 1;
									}
									//get jml antrean by sumber bridging antrean
									if (elm.ispeserta == true &&
										elm.kodepoli != "IGD" &&
										elm.status != 'Batal' &&
										elm.sumberdata == 'Bridging Antrean'
									) {
										$scope.jmlAntreanBySumber += 1;
									}
									//get jml antrean lengkap by sumber bridging antrean
									if (elm.ispeserta == true &&
										elm.status == "Selesai dilayani" &&
										elm.kodepoli != "IGD" &&
										elm.status != 'Batal' &&
										elm.sumberdata == "Bridging Antrean"
									) {
										$scope.totalLengkapByBridging += 1;
									}
									//get jml antrean lengkap by sumber MJKN
									if (elm.ispeserta == true &&
										elm.status == "Selesai dilayani" &&
										elm.kodepoli != "IGD" &&
										elm.status != 'Batal' &&
										elm.sumberdata == "Mobile JKN"
									) {
										$scope.totalLengkapByMJKN += 1;
									}


									dtapop.push({
										"no": no++,
										"tanggal": elm.tanggal,
										"kodebooking": elm.kodebooking,
										"jeniskunjungan": jeniskunjungan,
										"kodepoli": elm.kodepoli,
										"kodedokter": elm.kodedokter,
										"noreferensi": elm.nomorreferensi == "" ? "-" : elm.nomorreferensi,
										"norm": elm.norekammedis,
										"nik": elm.nik,
										"nokartupeserta": elm.nokapst,
										"sumberdata": elm.sumberdata,
										"kelompok": elm.ispeserta == true ? "JKN" : "NON JKN",
										"status": elm.status,
										"namapasien": nm_pasien,
										"namaruangan": nm_ruangan,
										"namarekanan": nm_rekanan,
										"noregistrasifk": no_registrasifk
									})
								}

							}

						});

						$scope.capaianAntrol = Math.round((($scope.totalLengkapByBridging + $scope.totalLengkapByMJKN) / $scope.totalSepTerbitByBridging) * 100)
						$scope.capaianMJKN = Math.round(($scope.totalLengkapByMJKN / $scope.totalSepTerbitByBridging) * 100)

						$scope.dataDaftarPasien = new kendo.data.DataSource({
							data: dtapop,
							pageSize: 10,
							total: dtapop.length,
							serverPaging: false,
							schema: {
								model: {
									fields: {
									}
								}
							}
						});


						var dtamon = [
							{
								'jmlantreanjkn': $scope.jmlAntreanJKN,
								'jmlantreannonjkn': $scope.jmlAntreanNonJKN,
								'jmlantreanbysumberbridging': $scope.jmlAntreanBySumber,
								'jmlantreanbysumbermjkn': $scope.jmlAntreanByMJKN,
								'totalsepterbit': $scope.totalSepTerbitByBridging,
								'jmlantreanlengkapbybridging': $scope.totalLengkapByBridging,
								'jmlantreanlengkapbymjkn': $scope.totalLengkapByMJKN,
								'capaianantrol': $scope.capaianAntrol,
								'capaianmjkn': $scope.capaianMJKN
							}
						];
						$scope.dataMonitoring = new kendo.data.DataSource({
							data: dtamon,
							pageSize: 10,
							total: dtamon.length,
							serverPaging: false,
							schema: {
								model: {
									fields: {
									}
								}
							}
						});
					}
					$scope.isRouteLoading = false;
				})



			}


			function filterByValue(array, string) {
				return array.filter(o =>
					Object.keys(o).some(k => o[k].toLowerCase().includes(string.toLowerCase())));
			}
			function secondsToHms(d) {
				d = Number(d);
				var h = Math.floor(d / 3600);
				var m = Math.floor(d % 3600 / 60);
				var s = Math.floor(d % 3600 % 60);

				var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
				var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
				var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
				return hDisplay + mDisplay + sDisplay;
			}
			function millisToMinutesAndSeconds(totalSeconds) {

				// 👇️ get number of full minutes
				var minutes = Math.floor(totalSeconds / 60);

				// 👇️ get remainder of seconds
				var seconds = totalSeconds % 60;

				function padTo2Digits(num) {
					return num.toString().padStart(2, '0');
				}

				// ✅ format as MM:SS
				seconds = Math.floor(seconds)
				const result = `${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`;
				//   console.log(result); // 👉️ "09:25"
				// var minutes = Math.floor(millis / 60000);
				// var seconds = ((millis % 60000) / 1000).toFixed(0);
				return result;//minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
			}

			$scope.formatTanggal = function (tanggal) {
				if (tanggal == 'null')
					return '-'
				else
					return moment(tanggal).format('DD-MMM-YYYY');
			}

			$scope.SearchData = function () {
				loadData()
			}

			$scope.columnDaftarPasien = {
				// toolbar: [
				// 	"excel",
				// ],
				// excel: {
				// 	fileName: "InformasiWaktuPelayananRawatJalan.xlsx",
				// 	allPages: true,
				// },
				// excelExport: function (e) {
				// 	var sheet = e.workbook.sheets[0];
				// 	sheet.frozenRows = 2;
				// 	sheet.mergedCells = ["A1:T1"];
				// 	sheet.name = "Orders";

				// 	var myHeaders = [{
				// 		value: "Informasi Waktu Pelayanan Rawat Jalan",
				// 		fontSize: 20,
				// 		textAlign: "center",
				// 		background: "#ffffff",
				// 		// color:"#ffffff"
				// 	}];

				// 	sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
				// },
				selectable: 'row',
				pageable: true,
				columns:
					[
						{
							"field": "no",
							"title": "No",
							"width": "50px",
							"template": "<span class='style-center'>#: no #</span>"
						},
						{
							"field": "tanggal",
							"title": "Tgl Registrasi",
							"width": "100px",
							"template": "<span class='style-left'>{{formatTanggal('#: tanggal #')}}</span>"
						},
						{
							"field": "kodebooking",
							"title": "Kode Booking",
							"width": "130px",
							"template": "<span class='style-center'>#: kodebooking #</span>"
						},
						{
							"field": "jeniskunjungan",
							"title": "Jenis Kunjungan",
							"width": "130px",
							"template": "<span class='style-center'>#: jeniskunjungan #</span>"
						},
						{
							"field": "kodepoli",
							"title": "Kode Poli",
							"width": "100px",
							"template": "<span class='style-center'>#: kodepoli #</span>"
						},
						{
							"field": "kodedokter",
							"title": "Kode Dokter",
							"width": "100px",
							"template": "<span class='style-center'>#: kodedokter #</span>"
						},
						{
							"field": "noreferensi",
							"title": "No. Referensi",
							"width": "150px",
							"template": "<span class='style-center'>#: noreferensi #</span>"
						},
						{
							"field": "norm",
							"title": "No RM",
							"width": "100px",
							"template": "<span class='style-center'>#: norm #</span>"
						},
						{
							"field": "namapasien",
							"title": "Nama Pasien",
							"width": "150px",
							"template": "<span class='style-center'>#: namapasien #</span>"
						},
						{
							"field": "nik",
							"title": "NIK",
							"width": "150px",
							"template": "<span class='style-center'>#: nik #</span>"
						},
						{
							"field": "nokartupeserta",
							"title": "No Kartu Peserta",
							"width": "150px",
							"template": "<span class='style-center'>#: nokartupeserta #</span>"
						},
						{
							"field": "sumberdata",
							"title": "Sumber Data",
							"width": "150px",
							"template": "<span class='style-center'>#: sumberdata #</span>"
						},
						{
							"field": "kelompok",
							"title": "Kelompok",
							"width": "100px",
							"template": "<span class='style-center'>#: kelompok #</span>"
						},
						{
							"field": "status",
							"title": "Status",
							"width": "150px",
							"template": "<span class='style-center'>#: status #</span>"
						},


					]
			};

			$scope.columnMonitoring = {
				selectable: 'row',
				pageable: true,
				columns:
					[
						{
							"field": "jmlantreanjkn",
							"title": "JML Antrean JKN",
							"width": "150px",
							"template": "<span class='style-center-font-20'>#: jmlantreanjkn #</span>"
						},
						{
							"field": "jmlantreannonjkn",
							"title": "JML Antrean Non JKN",
							"width": "150px",
							"template": "<span class='style-center-font-20'>#: jmlantreannonjkn #</span>"
						},
						{
							"field": "jmlantreanbysumberbridging",
							"title": "JML Antrean By Sumber (Bridging)",
							"width": "150px",
							"template": "<span class='style-center-font-20'>#: jmlantreanbysumberbridging #</span>"
						},
						{
							"field": "jmlantreanbysumbermjkn",
							"title": "JML Antrean By Sumber (MJKN)",
							"width": "150px",
							"template": "<span class='style-center-font-20'>#: jmlantreanbysumbermjkn #</span>"
						},
						{
							"field": "totalsepterbit",
							"title": "Total SEP Terbit",
							"width": "150px",
							"template": "<span class='style-center-font-20'>#: totalsepterbit #</span>"
						},
						{
							"field": "jmlantreanlengkapbybridging",
							"title": "JML Antrean Lengkap By Sumber (Bridging)",
							"width": "150px",
							"template": "<span class='style-center-font-20'>#: jmlantreanlengkapbybridging #</span>"
						},
						{
							"field": "jmlantreanlengkapbymjkn",
							"title": "JML Antrean Lengkap By Sumber (MJKN)",
							"width": "150px",
							"template": "<span class='style-center-font-20'>#: jmlantreanlengkapbymjkn #</span>"
						},
						{
							"field": "capaianantrol",
							"title": "Capaian Antrol",
							"width": "150px",
							"template": "<span class='style-center-font-20'>#: capaianantrol #%</span>"
						},
						{
							"field": "capaianmjkn",
							"title": "Capaian MJKN",
							"width": "150px",
							"template": "<span class='style-center-font-20'>#: capaianmjkn #%</span>"
						},
					]
			};

			$scope.ShowCatatan = function (e) {
				$scope.log.kirimantrean = "";
				$scope.isRouteLoading = true;
				medifirstService.get("sysadmin/logging/get-log-antrean?noreff=" + e).then(function (e) {
					$scope.isRouteLoading = false;
					var data = e.data.data;
					for (let i = 0; i < data.length; i++) {
						const element = data[i].keterangan.split("|");
						if (element[0].includes("Tambah Antrean Kode")) {
							$scope.log.kirimantrean = $scope.log.kirimantrean + "* " + element[2] + "\r\n";
						}
					}
					$scope.modalLogAntrol.open().center();
				});
			}

			$scope.syncData = function () {
				if ($scope.dataDaftarPasien._data.length == 0) return

				let pass = prompt("Masukan password", "");
				if (pass != null) {
					if (pass == 'antrol') {
						sendANTROL($scope.dataDaftarPasien._data)
					} else {
						toastr.error('Password Salah')
					}
				}

			}
			async function sendANTROL(dataSource) {

				for (let x = 0; x < dataSource.length; x++) {
					const element = dataSource[x];
					if (element.status != 'Selesai dilayani') {
						await repeatSendTaskIdNew(element.kodebooking, element.tanggal, element.noregistrasifk);
					}

				}
			}

			async function repeatSendTaskIdNew(kodebooking, dt_tanggal = null, norec_pd = null) {
				var obj = {
					"url": "antrean/getlisttask",
					"data": {
						"kodebooking": kodebooking
					},
					"method": "POST",
					"jenis": "antrean"
				}
				$scope.isRouteLoading = true;
				await medifirstService.postNonMessage('bridging/bpjs/tools', obj).then(async function (e) {
					var resdata = 1;
					var waktu = dt_tanggal;
					if (e.data.metaData.code == 200) {
						resdata = e.data.response.length;
						waktu = moment(e.data.response[resdata - 1].wakturs.replace(' WIB', ''), "DD/MM/YYYY HH:mm")._d
					} else {
						waktu = new Date(dt_tanggal).getTime();
					}


					$scope.isRouteLoading = false;
					for (let index = resdata; index < 8; index++) {
						waktu = moment(waktu).add(10, 'minutes')
						var obj2 = {
							"url": "antrean/updatewaktu",
							"jenis": "antrean",
							"method": "POST",
							"data":
							{
								"kodebooking": kodebooking,
								"taskid": index,
								"waktu": new Date(waktu).getTime()
							}
						}

						$scope.isRouteLoading = true;
						await medifirstService.postNonMessage('bridging/bpjs/tools', obj2).then(async function (ela) {
							if (ela.data.metaData.code == 200) {
								if (norec_pd != null) {
									await saveMonitoringTaksId(kodebooking, norec_pd, index, parseInt(new Date(waktu).getTime()), true);
								}
							}
							$scope.isRouteLoading = false;
						})

					}
				});
			}

			async function repeatSendTaskId(norec_pd, taskid) {
				await medifirstService.get('registrasi/get-data-antrean?norec_pd=' + norec_pd).then(async function (e) {
					// VALIDASI BARU
					e.data.nohp = e.data.nohp.substring(0, 12)
					let ASALRUJUKAN = 1
					let jenisKunjungan = 1 // {1 (Rujukan FKTP), 2 (Rujukan Internal), 3 (Kontrol), 4 (Rujukan Antar RS)}
					if (e.data.jenispasien == 'JKN') {
						var jsonRujukan = {
							"url": `Rujukan/Peserta/${e.data.nomorkartu}`,
							"method": "GET",
							"data": null
						}
						let resRujukan = await medifirstService.postNonMessage('bridging/bpjs/tools', jsonRujukan)
						if (resRujukan.data.metaData.code == 200) {
							ASALRUJUKAN = 1
							e.data.nomorreferensi = resRujukan.data.response.rujukan.noKunjungan
						} else {
							var jsonRujukan = {
								"url": `Rujukan/RS/Peserta/${e.data.nomorkartu}`,
								"method": "GET",
								"data": null
							}
							let resRujukan = await medifirstService.postNonMessage('bridging/bpjs/tools', jsonRujukan)
							if (resRujukan.data.metaData.code == 200) {
								ASALRUJUKAN = 2
								e.data.nomorreferensi = resRujukan.data.response.rujukan.noKunjungan
							}
						}
					}
					//cek jml sep rujukan

					var jsonJML = {
						"url": `Rujukan/JumlahSEP/${ASALRUJUKAN}/${e.data.nomorreferensi}`,
						"method": "GET",
						"data": null
					}
					let resJML = await medifirstService.postNonMessage('bridging/bpjs/tools', jsonJML)
					if (resJML.data.metaData.code == 200) {
						if (resJML.data.response.jumlahSEP > 0) {
							var jsonSURKON = {
								"url": `RencanaKontrol/ListRencanaKontrol/Bulan/${moment(new Date()).format("MM")}/Tahun/${new Date().getFullYear()}/Nokartu/${e.data.nomorkartu}/filter/2`,
								"method": "GET",
								"data": null
							}
							let resSURKON = await medifirstService.postNonMessage('bridging/bpjs/tools', jsonSURKON)
							if (resSURKON.data.metaData.code == 200) {
								e.data.nomorreferensi = resSURKON.data.response.list[0].noSuratKontrol
								jenisKunjungan = 3
								if (resSURKON.data.response.list[0].terbitSEP == 'Sudah') {
									let NGASAL = resSURKON.data.response.list[0].noSuratKontrol.replace('K', 'Z')
									e.data.nomorreferensi = NGASAL
								}
							} else {
								jenisKunjungan = 2
								// e.data.nomorreferensi = e.data.kodebooking // pake no internal aja
							}
						}
					}
					e.data.jeniskunjungan = jenisKunjungan
					var data = {
						"url": "antrean/add",
						"jenis": "antrean",
						"method": "POST",
						"data": e.data
					}
					medifirstService.postNonMessage('bridging/bpjs/tools', data).then(function (x) {
						// simpan log
						if (x.data.metaData.code != 208) {
							medifirstService.postLogging('Antrol Task ID', 'norec Pasien Daftar',
								e.data.kodebooking, 'Tambah Antrean Kode ' + e.data.kodebooking + ' | ' +
								JSON.stringify(data) + ' | ' + JSON.stringify(x.data))
						}
						// mengabil data catatan task id dari 1 - 4
						medifirstService.get('rawatjalan/get-monitoring-taskid?taskid=' + taskid + '&norec_pd=' + norec_pd).then(function (res) {
							if (res.data.length == (taskid - 1)) {
								updateWaktuId(res, e.data.kodebooking, norec_pd)
							} else if (res.data.length == 7) {
								updateWaktuId(res, e.data.kodebooking, norec_pd)
							} else {
								checkTaksId(e.data.kodebooking, norec_pd, e.data.estimasidilayani)
							}
						})
					})
				})
			}
			async function updateWaktuId(res, kodebooking, norec_pd) {
				for (let i = 0; i < res.data.length; i++) {
					const element = res.data[i];
					if (kodebooking.length < 10) {
						if (element.taskid >= 3) {
							var data = {
								"url": "antrean/updatewaktu",
								"jenis": "antrean",
								"method": "POST",
								"data":
								{
									"kodebooking": kodebooking,
									"taskid": element.taskid,
									"waktu": parseInt(element.waktu)
								}
							}
							await medifirstService.postNonMessage('bridging/bpjs/tools', data).then(async function (e) {
								if (e.data.metaData.code == 200) {
									await saveMonitoringTaksId(kodebooking, norec_pd, element.taskid, parseInt(element.waktu), true);
								}
							})
						}
					} else {
						var data = {
							"url": "antrean/updatewaktu",
							"jenis": "antrean",
							"method": "POST",
							"data":
							{
								"kodebooking": kodebooking,
								"taskid": element.taskid,
								"waktu": parseInt(element.waktu)
							}
						}
						await medifirstService.postNonMessage('bridging/bpjs/tools', data).then(async function (e) {
							if (e.data.metaData.code == 200) {
								await saveMonitoringTaksId(kodebooking, norec_pd, element.taskid, parseInt(element.waktu), true);
							}
						})
					}

				}
			}

			async function saveMonitoringTaksId(kodebooking, noregistrasifk, taskid, waktu, statuskirim) {
				if (statuskirim == true) {
					// 071e25a
					// var jsontask = {
					// 	"url": "antrean/getlisttask",
					// 	"jenis": "antrean",
					// 	"method": "POST",
					// 	"data": { "kodebooking": kodebooking }
					// }
					// // debugger
					// var response = await medifirstService.postNonMessage('bridging/bpjs/tools', jsontask)
					// if (response.data.metaData.code == 200) {
					// 	for (let xx = 0; xx < response.data.response.length; xx++) {
					// 		const element = response.data.response[xx];
					// 		if (element.taskid == taskid) {
					// 			if (element.wakturs != moment(new Date(waktu)).format('DD-MM-YYYY HH:mm:ss') + ' WIB') {
					// 				let wak = moment(element.wakturs.replace(' WIB', ''), "DD/MM/YYYY HH:mm")._d
					// 				console.log('waktu BPJS : ' + wak)
					// 				console.log('waktu RS : ' + new Date(waktu))
					// 				console.log('waktu TASK : ' + taskid)
					// 				waktu = wak.getTime()
					// 				break
					// 			}
					// 		}
					// 	}
					// }
				}

				var json = {
					"noregistrasifk": noregistrasifk,
					"taskid": taskid,
					"waktu": waktu,
					"statuskirim": statuskirim
				}
				await medifirstService.postNonMessage('rawatjalan/save-monitoring-taskid', json).then(async function (e) {
					// await loadData()
				})
			}
			const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;
			async function checkTaksId(param, norec_pd, tgl) {
				var taksId = [
					{ Id: 1, waktu: random(7500000, 9300000) }, // 1 ke 2 range waktu 60 - 90 menit 
					{ Id: 2, waktu: random(3600000, 3900000) }, // 2 ke 3 range waktu 5 - 10 menit 
					{ Id: 3, waktu: random(3000000, 3300000) }, // 3 ke 4 range waktu 15 - 20 menit 
					{ Id: 4, waktu: random(1320000, 2100000) }, // 4 ke 5 range waktu 7 - 20 menit
					{ Id: 5, waktu: random(600000, 900000) },  // 5 ke 6 range waktu 10 - 15 menit
					{ Id: 6, waktu: random(300000, 500000) }, // 
					{ Id: 7, waktu: random(0, 0) }, // 
				]
				for (let i = 0; i < taksId.length; i++) {
					var element = taksId[i]
					var waktuS = tgl - element.waktu // new Date(tgl).getTime() - element.waktu
					if (param.length < 10) {
						if (element.Id >= 3) {
							var json = {
								"url": "antrean/updatewaktu",
								"jenis": "antrean",
								"method": "POST",
								"data": {
									"kodebooking": param,
									"taskid": element.Id,
									"waktu": waktuS
								}
							}

							await medifirstService.postNonMessage('bridging/bpjs/tools', json).then(async function (e) {
								if (e.data.metaData.code == 200) {
									await saveMonitoringTaksId(param, norec_pd, element.Id, waktuS, true)
								}
								if (e.data.metaData.code == 208) {
									if (e.data.metaData.message == "TaskId=" + element.Id + " sudah ada") {
										await saveMonitoringTaksId(param, norec_pd, element.Id, waktuS, true)
									}
								}
							})
						}
					} else {
						var json = {
							"url": "antrean/updatewaktu",
							"jenis": "antrean",
							"method": "POST",
							"data": {
								"kodebooking": param,
								"taskid": element.Id,
								"waktu": waktuS
							}
						}

						await medifirstService.postNonMessage('bridging/bpjs/tools', json).then(async function (e) {
							if (e.data.metaData.code == 200) {
								await saveMonitoringTaksId(param, norec_pd, element.Id, waktuS, true)
							}
							if (e.data.metaData.code == 208) {
								if (e.data.metaData.message == "TaskId=" + element.Id + " sudah ada") {
									await saveMonitoringTaksId(param, norec_pd, element.Id, waktuS, true)
								}
							}
						})
					}
				}
			}
			$scope.validasiData = function () {
				cekValidDataDiBPJS($scope.dataDaftarPasien._data)

			}
			async function cekValidDataDiBPJS(dataSource) {
				var listWaktu = [
					{ Id: 1, waktu: random(7500000, 9300000) }, // 1 ke 2 range waktu 60 - 90 menit 
					{ Id: 2, waktu: random(3600000, 3900000) }, // 2 ke 3 range waktu 5 - 10 menit 
					{ Id: 3, waktu: random(3000000, 3300000) }, // 3 ke 4 range waktu 15 - 20 menit 
					{ Id: 4, waktu: random(1320000, 2100000) }, // 4 ke 5 range waktu 7 - 20 menit
					{ Id: 5, waktu: random(600000, 900000) },  // 5 ke 6 range waktu 10 - 15 menit
					{ Id: 6, waktu: random(300000, 500000) }, // 
					{ Id: 7, waktu: random(0, 0) }, // 
				]
				$scope.isRouteLoading = true
				for (let x = 0; x < dataSource.length; x++) {
					const element = dataSource[x];
					var jsontask = {
						"url": "antrean/getlisttask",
						"jenis": "antrean",
						"method": "POST",
						"data": {
							"kodebooking": element.noregistrasi
						}
					}
					var response = await medifirstService.postNonMessage('bridging/bpjs/tools', jsontask)
					if (response.data.metaData.code == 200) {
						var satu = false, dua = false, tiga = false, empat = false, lima = false, enam = false, tujuh = false
						for (let xx = 0; xx < response.data.response.length; xx++) {
							const element2 = response.data.response[xx];
							var wakturs = element2.wakturs.substr(0, 16) + ' ' + element2.wakturs.substr(20, 3)
							var taskid = element2.taskid
							if (element2.taskid == 1) {
								satu = true
								var waktu = element.taksid_1
								if (wakturs != moment(new Date(waktu)).format('DD-MM-YYYY HH:mm') + ' WIB') {
									let wak = moment(element2.wakturs.replace(' WIB', ''), "DD/MM/YYYY HH:mm")._d
									console.log('waktu BPJS : ' + wak)
									console.log('waktu RS : ' + new Date(waktu))
									console.log('waktu TASK : ' + element2.taskid)
									waktu = wak.getTime()

								}

								var json = {
									"noregistrasifk": element.noregistrasifk,
									"taskid": taskid,
									"waktu": (typeof waktu === 'string' || waktu instanceof String) ? new Date(waktu).getTime() : waktu,
									"statuskirim": true
								}
								await medifirstService.postNonMessage('rawatjalan/save-monitoring-taskid', json)
							}
							if (element2.taskid == 2) {
								dua = true
								var waktu = element.taksid_2
								if (wakturs != moment(new Date(waktu)).format('DD-MM-YYYY HH:mm') + ' WIB') {
									let wak = moment(element2.wakturs.replace(' WIB', ''), "DD/MM/YYYY HH:mm")._d
									console.log('waktu BPJS : ' + wak)
									console.log('waktu RS : ' + new Date(waktu))
									console.log('waktu TASK : ' + element2.taskid)
									waktu = wak.getTime()
								}
								var json = {
									"noregistrasifk": element.noregistrasifk,
									"taskid": taskid,
									"waktu": (typeof waktu === 'string' || waktu instanceof String) ? new Date(waktu).getTime() : waktu,
									"statuskirim": true
								}
								await medifirstService.postNonMessage('rawatjalan/save-monitoring-taskid', json)
							}
							if (element2.taskid == 3) {
								tiga = true
								var waktu = element.taksid_3
								if (wakturs != moment(new Date(waktu)).format('DD-MM-YYYY HH:mm') + ' WIB') {
									let wak = moment(element2.wakturs.replace(' WIB', ''), "DD/MM/YYYY HH:mm")._d
									console.log('waktu BPJS : ' + wak)
									console.log('waktu RS : ' + new Date(waktu))
									console.log('waktu TASK : ' + element2.taskid)
									waktu = wak.getTime()

								}
								var json = {
									"noregistrasifk": element.noregistrasifk,
									"taskid": taskid,
									"waktu": (typeof waktu === 'string' || waktu instanceof String) ? new Date(waktu).getTime() : waktu,
									"statuskirim": true
								}
								await medifirstService.postNonMessage('rawatjalan/save-monitoring-taskid', json)

							}
							if (element2.taskid == 4) {
								empat = true
								var waktu = element.taksid_4
								if (wakturs != moment(new Date(waktu)).format('DD-MM-YYYY HH:mm') + ' WIB') {
									let wak = moment(element2.wakturs.replace(' WIB', ''), "DD/MM/YYYY HH:mm")._d
									console.log('waktu BPJS : ' + wak)
									console.log('waktu RS : ' + new Date(waktu))
									console.log('waktu TASK : ' + element2.taskid)
									waktu = wak.getTime()
								}
								var json = {
									"noregistrasifk": element.noregistrasifk,
									"taskid": taskid,
									"waktu": (typeof waktu === 'string' || waktu instanceof String) ? new Date(waktu).getTime() : waktu,
									"statuskirim": true
								}
								await medifirstService.postNonMessage('rawatjalan/save-monitoring-taskid', json)
							}
							if (element2.taskid == 5) {
								lima = true
								var waktu = element.taksid_5
								if (wakturs != moment(new Date(waktu)).format('DD-MM-YYYY HH:mm') + ' WIB') {
									let wak = moment(element2.wakturs.replace(' WIB', ''), "DD/MM/YYYY HH:mm")._d
									console.log('waktu BPJS : ' + wak)
									console.log('waktu RS : ' + new Date(waktu))
									console.log('waktu TASK : ' + element2.taskid)
									waktu = wak.getTime()
								}
								var json = {
									"noregistrasifk": element.noregistrasifk,
									"taskid": taskid,
									"waktu": (typeof waktu === 'string' || waktu instanceof String) ? new Date(waktu).getTime() : waktu,
									"statuskirim": true
								}
								await medifirstService.postNonMessage('rawatjalan/save-monitoring-taskid', json)


							}
							if (element2.taskid == 6 && waktu != '-') {
								enam = true
								var waktu = element.taksid_6
								if (wakturs != moment(new Date(waktu)).format('DD-MM-YYYY HH:mm') + ' WIB') {
									let wak = moment(element2.wakturs.replace(' WIB', ''), "DD/MM/YYYY HH:mm")._d
									console.log('waktu BPJS : ' + wak)
									console.log('waktu RS : ' + new Date(waktu))
									console.log('waktu TASK : ' + element2.taskid)
									waktu = wak.getTime()
								}
								var json = {
									"noregistrasifk": element.noregistrasifk,
									"taskid": taskid,
									"waktu": (typeof waktu === 'string' || waktu instanceof String) ? new Date(waktu).getTime() : waktu,
									"statuskirim": true
								}
								await medifirstService.postNonMessage('rawatjalan/save-monitoring-taskid', json)
							}
							if (element2.taskid == 7 && waktu != '-') {
								tujuh = true
								var waktu = element.taksid_7
								if (wakturs != moment(new Date(waktu)).format('DD-MM-YYYY HH:mm') + ' WIB') {
									let wak = moment(element2.wakturs.replace(' WIB', ''), "DD/MM/YYYY HH:mm")._d
									console.log('waktu BPJS : ' + wak)
									console.log('waktu RS : ' + new Date(waktu))
									console.log('waktu TASK : ' + element2.taskid)
									waktu = wak.getTime()
								}
								var json = {
									"noregistrasifk": element.noregistrasifk,
									"taskid": taskid,
									"waktu": (typeof waktu === 'string' || waktu instanceof String) ? new Date(waktu).getTime() : waktu,
									"statuskirim": true
								}
								await medifirstService.postNonMessage('rawatjalan/save-monitoring-taskid', json)
							}
						}

						if (satu == false) { await kirimTaskUlang(element.noregistrasi, 1, element.noregistrasifk, (element.taksid_1 != '-' ? new Date(element.taksid_1).getTime() : new Date().getTime())) }
						if (dua == false) {
							await kirimTaskUlang(element.noregistrasi, 2, element.noregistrasifk, (element.taksid_2 != '-' ? new Date(element.taksid_2).getTime() :

								new Date(element.taksid_1).setTime(new Date(element.taksid_1).getTime() + 1080000)//3mnt
							))
						}
						if (tiga == false) {
							await kirimTaskUlang(element.noregistrasi, 3, element.noregistrasifk, (element.taksid_3 != '-' ? new Date(element.taksid_3).getTime()
								: new Date(element.taksid_2).setTime(new Date(element.taksid_2).getTime() + 1080000)//3mnt
							))
						}
						if (empat == false) {
							await kirimTaskUlang(element.noregistrasi, 4, element.noregistrasifk, (element.taksid_4 != '-' ? new Date(element.taksid_4).getTime() :
								new Date(element.taksid_3).setTime(new Date(element.taksid_3).getTime() + 1080000)//3mnt
							))
						}
						if (lima == false) {
							await kirimTaskUlang(element.noregistrasi, 5, element.noregistrasifk, (element.taksid_5 != '-' ? new Date(element.taksid_5).getTime() :
								new Date(element.taksid_4).setTime(new Date(element.taksid_4).getTime() + 1080000)//3mnt
							))
						}
						if (enam == false) {
							await kirimTaskUlang(element.noregistrasi, 6, element.noregistrasifk, (element.taksid_6 != '-' ? new Date(element.taksid_6).getTime() :
								new Date(element.taksid_5).setTime(new Date(element.taksid_5).getTime() + 1080000)//3mnt
							))
						}
						if (tujuh == false) {
							await kirimTaskUlang(element.noregistrasi, 7, element.noregistrasifk, (element.taksid_7 != '-' ? new Date(element.taksid_7).getTime() :
								new Date(element.taksid_6).setTime(new Date(element.taksid_6).getTime() + 1080000)//3mnt
							))
						}

					} else {

						var jsonz = {
							"noregistrasifk": element.noregistrasifk,
						}
						// await medifirstService.postNonMessage('rawatjalan/disabled-monitoring-taskid', jsonz)
					}
				}
				await loadData()
				$scope.isRouteLoading = false
			}
			async function kirimTaskUlang(param, taskid, noregistrasifk, waktu) {
				var jsons = {
					"url": "antrean/updatewaktu",
					"jenis": "antrean",
					"method": "POST",
					"data": {
						"kodebooking": param,
						"taskid": taskid,
						"waktu": waktu
					}
				}

				await medifirstService.postNonMessage('bridging/bpjs/tools', jsons).then(async function (e) {
					if (e.data.metaData.code == 200) {
						var json = {
							"noregistrasifk": noregistrasifk,
							"taskid": taskid,
							"waktu": waktu,
							"statuskirim": true
						}
						await medifirstService.postNonMessage('rawatjalan/save-monitoring-taskid', json)
					}
					if (e.data.metaData.code == 208) {
						if (e.data.metaData.message == "TaskId=" + taskid + " sudah ada") {
							var json = {
								"noregistrasifk": noregistrasifk,
								"taskid": taskid,
								"waktu": waktu,
								"statuskirim": true
							}
							await medifirstService.postNonMessage('rawatjalan/save-monitoring-taskid', json)
						}
					}
				})
			}

			$scope.closingData = function () {
				if (data2.length == 0) {
					toastr.error("Info, Data Tidak Ditemukan!");
				}
				var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm:ss');
				var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm:ss');
				const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;
				var taksId = [
					{ Id: 1, waktu: random(120000, 300000) }, // 1 ke 2 range waktu 2 - 5 menit 
					{ Id: 2, waktu: random(600000, 900000) }, // 2 ke 3 range waktu 10 - 15 menit 
					{ Id: 3, waktu: random(2400000, 3600000) }, // 3 ke 4 range waktu 15 - 20 menit 
					{ Id: 4, waktu: random(1320000, 2100000) }, // 4 ke 5 range waktu 7 - 20 menit
					{ Id: 5, waktu: random(600000, 900000) },  // 5 ke 6 range waktu 10 - 15 menit
					{ Id: 6, waktu: random(300000, 500000) }, // 
					{ Id: 7, waktu: random(300000, 600000) },
				]

				for (let i = 0; i < data2.length; i++) {
					const element = data2[i];
					if (element.taksid_1 == '-') {
						element.taksid_1 = moment(new Date(new Date(element.tglregistrasi).getTime() - taksId[0].waktu)).format("YYYY-MM-DD HH:mm");
					}

					if (element.taksid_2 == '-') {
						element.taksid_2 = moment(element.tglregistrasi).format("YYYY-MM-DD HH:mm");
					}

					if (element.taksid_3 == '-') {
						element.taksid_3 = moment(new Date(new Date(element.taksid_2).getTime() + taksId[1].waktu)).format("YYYY-MM-DD HH:mm");
					}

					if (element.taksid_4 == '-') {
						element.taksid_4 = moment(new Date(new Date(element.taksid_3).getTime() - taksId[2].waktu)).format("YYYY-MM-DD HH:mm");
					}

					if (element.taksid_5 == '-') {
						element.taksid_5 = moment(new Date(new Date(element.taksid_4).getTime() + taksId[3].waktu)).format("YYYY-MM-DD HH:mm");
					}

					if (element.taksid_6 == '-') {
						element.taksid_6 = moment(new Date(new Date(element.taksid_5).getTime() + taksId[4].waktu)).format("YYYY-MM-DD HH:mm");
					}

					if (element.taksid_7 == '-') {
						element.taksid_7 = moment(new Date(new Date(element.taksid_6).getTime() + taksId[5].waktu)).format("YYYY-MM-DD HH:mm");
					}

					element.taksid_8 = moment(new Date(new Date(element.taksid_7).getTime() + taksId[6].waktu)).format("YYYY-MM-DD HH:mm");
				}

				var objSave = {
					tglawal: tglAwal,
					tglakhir: tglAkhir,
					data: data2
				}
				$scope.isRouteLoading = true;
				$scope.tombolSimpanVis = false;
				// console.log(objSave);
				medifirstService.post('registrasi/save-closing-lap-wtrj', objSave).then(function (e) {
					$scope.isRouteLoading = false;
					$scope.tombolSimpanVis = true;
					loadData();
				}, function (error) {
					$scope.isRouteLoading = false;
					$scope.tombolSimpanVis = true;
				})
			}

			// END ################
		}
	]);
});