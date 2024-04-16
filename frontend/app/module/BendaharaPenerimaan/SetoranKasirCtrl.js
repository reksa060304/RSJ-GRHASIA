//Owari Start here....
//“Good programmer write code for machine, great programmer write code for other programmer”, laravel
define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('SetoranKasirCtrl', ['$q', '$scope', 'DateHelper', 'CacheHelper', 'MedifirstService',
		function ($q, $scope, dateHelper, cacheHelper, medifirstService) {
			$scope.isRouteLoading = false;
			$scope.now = new Date();
			$scope.item = {};
			$scope.total = {};
			$scope.dataLogin = medifirstService.getPegawai();
			var addDataDetail = [];
			$scope.item.listKasirMulti =[]
			$scope.item.tanggalAwal = $scope.now
			$scope.item.tanggalAkhir = $scope.now
			$scope.item.tglsetor = $scope.now
			var status = ""
			var ttlSsetor = 0;
			var objKasir = {}
			var result =[];
			loadCombo();
			//loadData();

			function loadCombo() {
				$scope.listKetSetoran = [{ id: 1, status: 'Belum Setor' }, { id: 2, status: 'Setor' }]
				$scope.listNamabankAccount = [{ "id": "1", "namaExternal": "BRI 001" }, { "id": "2", "namaExternal": "BRI 002" }, { "id": "3", "namaExternal": "BRI 003" }]
				var chacePeriode = cacheHelper.get('SetoranKasirCtrl');
				if (chacePeriode != undefined) {
					var arrPeriode = chacePeriode.split('~');
					$scope.item.tanggalAwal = new Date(arrPeriode[0]);
					$scope.item.tanggalAkhir = new Date(arrPeriode[1]);
					$scope.item.tanggalAwal2 = new Date(arrPeriode[2]);
					$scope.item.tanggalAkhir2 = new Date(arrPeriode[3]);
					$scope.item.tanggalAwal3 = new Date(arrPeriode[4]);
					$scope.item.tanggalAkhir3 = new Date(arrPeriode[5]);
				} else {
					$scope.item.tanggalAwal = new Date(moment($scope.now).format('YYYY-MM-DD 00:00:00'));
					$scope.item.tanggalAkhir = new Date(moment($scope.now).format('YYYY-MM-DD 23:59:59'));
				}

				medifirstService.get("bendaharapenerimaan/get-data-combo").then(function (e) {
					$scope.listCaraSetor = e.data.carasetor;
					// $scope.listNamaKasir = e.data.datakasir;
					$scope.listKasir = e.data.datakasir;
					$scope.selectOptionsKasir = {
                        placeholder: "Pilih Kasir...",
                        dataTextField: "namalengkap",
                        dataValueField: "id",
                        // dataSource:{
                        //     data: $scope.listRuangan
                        // },
                        autoBind: false,
                       
                    };
					$scope.listStatusSTS = [
						{ id: 1, names: "Sudah STS" },
						{ id: 2, names: "Belum STS"}
					];
					$scope.listBayar = [
						{ id: 1, carabayar: "TUNAI" },
						{ id: 3, carabayar: "TRANSFER BANK"}
					];
				});				
				$scope.listStatus = [{ "id": "1", "namaExternal": "Semua" }, { "id": "2", "namaExternal": "Verifikasi" }, { "id": "3", "namaExternal": "Closing" }]
			}

			$scope.SearchData1 = function () {
				// if ($scope.item.namaKasir == undefined) {
				// 	toastr.error("Kasir belum dipilih");
				// } else {
					status = "-"
					loadData();
					addDataDetail = [];
				// }
			}

			function loadData() {
				$scope.isRouteLoading = true;
				var tglAwal = moment($scope.item.tanggalAwal).format('YYYY-MM-DD HH:mm');
				var tglAkhir = moment($scope.item.tanggalAkhir).format('YYYY-MM-DD HH:mm');

				var chacePeriode = tglAwal + "~" + tglAkhir + "~";
				cacheHelper.set('SetoranKasirCtrl', chacePeriode);
				var Skasir = "";
				if ($scope.item.namaKasir != undefined) {
					Skasir = "&idPegawai=" + $scope.item.namaKasir.id;
				}
				var Setor = ""
				if ($scope.item.KetSetor != undefined) {
					Setor = "&KetSetor=" + $scope.item.KetSetor.id
				}
				var carabayar = ""
				if ($scope.item.Bayar != undefined) {
					carabayar = "&idCaraBayar=" + $scope.item.Bayar.id
				}

				var listKasir = ""        
                if ($scope.item.listKasirMulti.length != 0) {
                    var a = ""
                    var b = ""
                    for (var i = $scope.item.listKasirMulti.length - 1; i >= 0; i--) {
                  
                        var c = $scope.item.listKasirMulti[i].id
                        b = "," + c
                        a = a + b
                    }
                    listKasir = a.slice(1, a.length)
                }
				
				var namaPasien="";
                if ($scope.item.namaPasien != undefined) {
					namaPasien = "&nama=" + $scope.item.namaPasien;
                }

				var nocm="";
                if ($scope.item.Norm != undefined) {
					nocm = "&nocm=" + $scope.item.Norm;
                }

				var noclosing="";
                if ($scope.item.Noclosing != undefined) {
					noclosing = "&noclosing=" + $scope.item.Noclosing;
                }

				var noregistrasi="";
                if ($scope.item.Noregistrasi != undefined) {
					noregistrasi = "&noregistrasi=" + $scope.item.Noregistrasi;
                }

				$q.all([
					medifirstService.get("bendaharapenerimaan/get-daftar-sbm?"
						+ "dateStartTglSbm=" + tglAwal
						+ "&dateEndTglSbm=" + tglAkhir
						+ "" + Skasir + Setor + carabayar + namaPasien + nocm + noclosing + noregistrasi
						+ "&KasirArr="+listKasir)
				]).then(function (data) {
					if (data[0].statResponse) {
						$scope.isRouteLoading = false;
						result = data[0].data.data;
						var ttlPasien = 0;
						var ttlKlaim = 0;
						for (var x = 0; x < result.length; x++) {
							var element = result[x];
							element.tglSbm = moment(result[x].tglSbm).format('DD-MM-YYYY HH:mm');
							if (element.nocm == null) {
								element.nocm = '-'
							}
							if (element.namapasien == null) {
								element.namapasien = '-'
							}
							if (element.namapasien_klien == null) {
								element.namapasien_klien = '-'
							}
							element.namapasien = element.nocm + ' - ' + element.namapasien
							if (element.namaruangan == null) {
								element.namaruangan = "-"
							}
							if (element.noClosing != null) {
								element.status = 'Setor';

							} else {
								element.status = 'Belum Setor';
								element.noClosing = '-';
							}
							ttlPasien = ttlPasien + 1;
							ttlKlaim = ttlKlaim + parseInt(result[x].totalPenerimaan);
						}

						if (status == "-") {
							$scope.dataSetoranKasir = {
								data: result,
								selectable: true,
								refresh: true,
								pageSize: 10,
								schema: {
									model: {
										fields: {
											totalPenerimaan: {
												type: "number"
											},
										}
									}
								},
								aggregate: [
									{ field: 'totalPenerimaan', aggregate: 'sum' },
								]
							};

							$scope.item.totalSubTotal2 = "Rp. " + parseFloat(ttlKlaim).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
						}
					};
					$scope.item.caraBayar = $scope.item.Bayar.carabayar;
				});
			}

			$scope.datachecklist = []
			$scope.checkboxClicked = function (dat) {
				let jml723 = 0
				if (dat) {

					for (var i = 0; i < result.length; i++) {
						$scope.datachecklist[i] = result[i];
					}

					for (var i = 0; i < $scope.datachecklist.length; i++) {
						jml723 += (parseFloat($scope.datachecklist[i].totalPenerimaan));
					}
					$scope.item.totalSetor = jml723;
				} else {
					$scope.datachecklist = []
					$scope.item.totalSetor = 0
				}

				$scope.item.dataDipilih = $scope.datachecklist.length;
			}

			//console.log($scope.datachecklist);

			$scope.selectedData2 = [];
			$scope.onClickSatu = function (e, param) {

				var tol = 0;
				var element = $(e.currentTarget);
				var checked = element.is(':checked')
				var row = element.closest('tr')
				var grid = $("#grid").data("kendoGrid")
				var dataItem = grid.dataItem(row);

				if (checked) {
					var result = $.grep($scope.selectedData2, function (e) {
						return e.noSbm == dataItem.noSbm;
					});
					if (result.length == 0) {
						$scope.selectedData2.push(dataItem);
					} else {
						for (var i = 0; i < $scope.selectedData2.length; i++)
							if ($scope.selectedData2[i].noSbm === dataItem.noSbm) {
								$scope.selectedData2.splice(i, 1);
								break;
							}
						$scope.selectedData2.push(dataItem);
					}
					row.addClass("k-state-selected");
				} else {
					for (var i = 0; i < $scope.selectedData2.length; i++)
						if ($scope.selectedData2[i].noSbm === dataItem.noSbm) {
							$scope.selectedData2.splice(i, 1);
							break;
						}
					row.removeClass("k-state-selected");
				}

				if ($scope.selectedData2.length != 0) {
					for (var i = 0; i < $scope.selectedData2.length; i++) {
						tol += parseFloat($scope.selectedData2[i].totalPenerimaan);
					}
                    $scope.item.totalSetor = tol;
				} else{
                    $scope.item.totalSetor = tol;
                }

				$scope.item.dataDipilih = $scope.selectedData2.length;
				
			}

			
			//console.log($scope.selectedData2);

			$scope.Simpan = function () {
				$scope.objData = [];
				$scope.objStr = {};
				$scope.objSave = [];
				$scope.objSBM =[];

				$scope.objStr = {
					"kdCaraBayar": $scope.item.Bayar.id,
					"totalPenerimaan": $scope.item.totalSetor,
					// "kdAccountBank": $scope.selectedData2[i][j].idBankAccount,
					"idCaraSetor": $scope.item.caraSetor.id,
						
				}

				$scope.objData.push($scope.objStr);
				//console.log($scope.objData);

				if($scope.datachecklist.length == 0){
					for (let i = 0; i < $scope.selectedData2.length; i++) {
						$scope.objSBM.push({'norec_sbm' :$scope.selectedData2[i].noRec})
						
						
					}
				}

				

				//console.log($scope.selectedData2);

				//console.log($scope.datachecklist[0].noRec);
				if($scope.selectedData2.length == 0){
					for (let i = 0; i < $scope.datachecklist.length; i++) {
						$scope.objSBM.push({'norec_sbm' :$scope.datachecklist[i].noRec});
						console.log($scope.datachecklist[0].noRec);
					}
				}

				//console.log($scope.datachecklist[0].noRec);
				

				//console.log($scope.objSBM);

				var tgl = moment($scope.item.tanggalAwal).format('YYYY-MM-DD')
				var tglAwal = moment($scope.item.tanggalAwal).format('YYYY-MM-DD HH:mm')
				var tglAkhir = moment($scope.item.tanggalAkhir).format('YYYY-MM-DD HH:mm')
				var tglSetor = moment($scope.item.tglsetor).format('YYYY-MM-DD HH:mm')
				$scope.objSave = {
					"tglPenerimaan": tgl,
					"tglAwal": tglAwal,
					"tglAkhir": tglAkhir,
					"tglsetor": tglSetor,
					"kdPegawai": $scope.item.namaKasir != undefined ? $scope.item.namaKasir.id : $scope.dataLogin.id,
					"kdPegawaiLu": $scope.item.namaKasir != undefined ? $scope.item.namaKasir.luid : $scope.dataLogin.id,
					"totalSetoran": $scope.item.totalSetor,
					"detailSetoran": $scope.objData,
					"detailSBM" : $scope.objSBM
				}

				//console.log($scope.objSave);

				var cek = 789;
				for (let i = 0; i < $scope.selectedData2.length; i++) {
					if($scope.selectedData2[i].status == 'Setor'){
						cek = 8910;
					}
				}

				for (let i = 0; i < $scope.datachecklist.length; i++) {
					if($scope.datachecklist[i].status == 'Setor'){
						cek = 8910;
					}
				}
				
				if(cek == 789){
					medifirstService.post('bendaharapenerimaan/setoran-kasir',$scope.objSave).then(function () {
						var data = {
							'tglAwal': tglAwal,
							'tglAkhir': tglAkhir,
							'idKasir': $scope.item.namaKasir? $scope.item.namaKasir.id : $scope.dataLogin.id,
						}
						// medifirstService.post('sysadmin/general/save-jurnal-setorankasir', data).then(function (e) {})
						$scope.datachecklist = [];	
						$scope.selectedData2 = [];
						loadData();
					})
				}

				if(cek == 8910){
					toastr.error('Data sudah ada yang di closing');
				}			
			};

			$scope.columnSetoranKasir = {
				toolabar: ['excel'],
				columns: [
					{
						"template": "<input type='checkbox' class='checkbox style-center' ng-click='onClickSatu($event,2)' />",
						"width": "30px"
					},
					{
						"field": "noSbm",
						"title": "NoSbm",
						"template": "<span class='style-center'>#: noSbm #</span>",
						"width": "60px"
					},
					{
						"field": "namaruangan",
						"title": "Nama Ruangan",
						"template": "<span class='style-left'>#: namaruangan #</span>",
						"width": "100px"
					},
					{
						"field": "kelompokpasien",
						"title": "Kelompok Pasien",
						"template": "<span class='style-left'>#: kelompokpasien #</span>",
						"width": "100px"
					},
					{
						"field": "tglSbm",
						"title": "Tanggal",
						"template": "<span class='style-center'>#: tglSbm #</span>",
						"width": "50px"
					},
					{
						"field": "namapasien",
						"title": "Nama",
						"template": "<span class='style-left'>#: namapasien #</span>",
						"width": "80px"
					},
					{
						"field": "noregistrasi",
						"title": "No Registrasi",
						"template": "<span class='style-left'> #: noregistrasi != null ? noregistrasi : '-' # </span>",
						"width": "80px"
					},
					{
						"field": "namapasien_klien",
						"title": "Deskripsi",
						"template": "<span class='style-left'>#: namapasien_klien #</span>",
						"width": "70px"
					},
					{
						"field": "keterangan",
						"title": "Keterangan",
						"template": "<span class='style-left'>#: keterangan #</span>",
						"width": "80px"
					},
					{
						"field": "caraBayar",
						"title": "Cara Bayar",
						"template": "<span class='style-center'>#: caraBayar #</span>",
						"width": "70px",
						// footerTemplate:"<span>Sub Total :</span>",
					},
					{
						"field": "totalPenerimaan",
						"title": "Total Penerimaan",
						"template": "<span class='style-right'>{{formatRupiah('#: totalPenerimaan #', 'Rp.')}}</span>",
						"width": "100px",
						aggregates: ["sum"],
						footerTemplate:"<span>Rp. {{formatRupiah('#:totalPenerimaan.sum  #', '')}}</span>",

					},
					{
						"field": "namaPenerima",
						"title": "Kasir",
						"template": "<span class='style-center'>#: namaPenerima #</span>",
						"width": "80px"
					},
					{
						"field": "status",
						"title": "Status",
						"template": "<span class='style-center'>#: status #</span>",
						"width": "50px"
					},
					{
						"field": "noClosing",
						"title": "No Closing",
						"template": "<span class='style-center'>#: noClosing #</span>",
						"width": "50px"
					},
					// {
					// 	"field": "noClosing",
					// 	"title": "No Closing",
					// 	"template": "<span class='style-center'>#: noClosing #</span>",
					// 	"width":"50px"
					// }
				],
				sortable: {
					mode: "single",
					allowUnsort: false,
				}
				,
				pageable: {
					messages: {
						// display: "Menampilkan {2} data"
						display: "Menampilkan {0} - {1} data dari {2} data"
					}
				},
			};

			$scope.columnCaraBayar = [
				{
					"field": "caraBayar",
					"title": "Cara Bayar"
				},
				{
					"field": "totalPenerimaan",
					"title": "Total Penerimaan",
					"template": "<span class='style-right'>{{formatRupiah('#: totalPenerimaan #', 'Rp.')}}</span>",

				},
				{
					"field": "totalSetor",
					"title": "Total Setor",
					"template": "<span class='style-right'>{{formatRupiah('#: totalSetor #', 'Rp.')}}</span>",
				},
				{
					"field": "sisa",
					"title": "Sisa",
					"template": "<span class='style-right'>{{formatRupiah('#: sisa #', 'Rp.')}}</span>",
				}

			];

			$scope.formatRupiah = function (value, currency) {
				if (value == "null")
					value = 0
				return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
			}

			$scope.dataCaraBayar2 = function (dataItem) {
				return {
					dataSource: new kendo.data.DataSource({
						data: dataItem.detail
					}),
					columns: [
						{
							"field": "no",
							"title": "No",
							"width": "15px",
							"hidden": true
						},
						{
							"field": "caraBayar",
							"title": "Cara Bayar",
							"width": "100px"
						},
						{
							"field": "caraSetor",
							"title": "Cara Setor",
							"width": "100px"
							//,"template": "<input kendo-combo-box k-ng-model='dataModelGrid[#: id #].NamabankAccount' k-data-text-field=\"'namaExternal'\" k-data-value-field=\"'id'\" k-filter=\"'contains'\" k-auto-bind='false' k-data-source='listNamabankAccount' />"
						},
						{
							"field": "jumlah",
							"title": "Total Setor",
							"width": "100px",
							"template": "<span class='style-right'>{{formatRupiah('#: jumlah #', 'Rp.')}}</span>",

							//,"template": "<input c-text-box type='input' ng-model='dataModelGrid[#: id #].total' filter='numeric' class='k-textbox'  style='text-align: right;'/>"
						},
						{
							"field": "pegawaipenerima",
							"title": "Penerima",
							"width": "100px"
						}
					]
				}
			};

			$scope.formatRupiah = function (value, currency) {
				return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
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


			$scope.Cetak = function () {
				$scope.pegawai = JSON.parse(window.localStorage.getItem('pegawai'));
				var Skasir = "";
				if ($scope.item.namaKasir != undefined) {
					Skasir = $scope.item.namaKasir.id;
					var tglAwal = moment($scope.item.tanggalAwal).format('YYYY-MM-DD HH:mm');
					var tglAkhir = moment($scope.item.tanggalAkhir).format('YYYY-MM-DD HH:mm');
					//cetakan langsung service VB6 by grh
					var client = new HttpClient();
					client.get('http://127.0.0.1:1237/printvb/kasir?cetak-setoranKasir=1&tglAwal=' + tglAwal
						+ '&tglAkhir=' + tglAkhir + '&kasirId=' + Skasir + '&strIdPegawai=' + $scope.pegawai.namaLengkap + '&view=true', function (response) {
						})
				}
			}

			$scope.BatalSetor = function () {
				var tgl = moment($scope.item.tanggalAwal).format('YYYY-MM-DD')
				var tglAwal = moment($scope.item.tanggalAwal).format('YYYY-MM-DD HH:mm')
				var tglAkhir = moment($scope.item.tanggalAkhir).format('YYYY-MM-DD HH:mm')
				// var objSave = {
				// 	"tglAwal": tglAwal,
				// 	"tglAkhir": tglAkhir,
				// 	"kdPegawai": $scope.item.namaKasir.id,
				// 	"kdPegawaiLu": $scope.item.namaKasir.luid,
				// }
				var total =0
				var objSbm = []
				var noclosing = ''
				if(  $scope.selectedData2== undefined){
					toastr.error('Belum ada data yang di pilih')
					return
				}
				for (let i = 0; i <  $scope.selectedData2.length; i++) {
					const element = $scope.selectedData2[i];
					if(element.status =='Setor'){
						total =total + parseFloat(element.totalPenerimaan)
						objSbm.push({
							'norec_sbm': element.noRec,
							'noclosing' :element.noClosing
						})
						noclosing = element.noClosing
					}
				}
				if(objSbm.length == 0){
					toastr.error('Belum ada data yang di setor')
					return
				}
				total = "Rp. " + parseFloat(total).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
				var objSaveNew = {
					"details" : objSbm
				}
				var stt = '';
                if (confirm('Yakin Mau Batal Setor Sejumlah : ' + total + ' ?')) {
                    stt = 'true';
                } else {
                    return;
                }
				// console.log(objSaveNew)
				// console.log($scope.dataSetoranKasir)
				// console.log($scope.selectedData2)
				
				medifirstService.get('bendaharapenerimaan/get-penjagaan-batal-setor?noclosing='+noclosing).then(function (e) {
					console.log(e.data.detail)
					console.log(e.data.detail.length)
					if(e.data.detail.length == 0){
						medifirstService.post('bendaharapenerimaan/batal-setoran-kasir',
							objSaveNew
						// objSave
						).then(function () {
							var data = $scope.dataSetoranKasir.data
							var listNoClos = ""
							if (data.length != 0) {
								var a = ""
								var b = ""
								for (var i = data.length - 1; i >= 0; i--) {
									var c = data[i].noClosing
									b = "," + c
									a = a + b
								}
								listNoClos = a.slice(1, a.length)
							}
							var objBatal = {
								'noclosing': listNoClos
							}
							medifirstService.get('sysadmin/general/hapus-jurnal-setorankasir', objBatal).then(function () {})
							loadData();
						})
					} else{
						toastr.error('Batal STS Terlebih Dahulu')
						return
					}
				})
				
			}

			$scope.CetakLaporanPenerimaanHarian = function () {		
				var Sins = ''		
				var dokter = ''
				if ($scope.item.namaPegawai != undefined) {
					dokter = $scope.item.namaPegawai.id
				}
				var ruanganId = ''
				if ($scope.item.ruangan != undefined) {
					ruanganId = $scope.item.ruangan.id
				}
				var idPegawai = ''
				if ($scope.item.namaKasir != undefined) {
					idPegawai = $scope.item.namaKasir.id
				}
				var tglAwal = moment($scope.item.tanggalAwal).format('YYYY-MM-DD HH:mm:ss');
				var tglAkhir = moment($scope.item.tanggalAkhir).format('YYYY-MM-DD HH:mm:ss');
				var client = new HttpClient();
				client.get('http://127.0.0.1:1237/printvb/kasir?cetak-laporan-penerimaan-kasir-lama=' + $scope.dataLogin.namaLengkap + '&tglAwal=' + tglAwal + '&tglAkhir=' + tglAkhir + '&idPegawai=' + idPegawai + '&idDept=' + Sins + '&idRuangan=' + ruanganId + '&idDokter=' + dokter + '&view=true', function (response) {
				});				
				// client.get('http://127.0.0.1:1237/printvb/kasir?cetak-laporan-penerimaan-kasir-lama=' + $scope.dataLogin.namaLengkap + '&tglAwal=' + tglAwal + '&tglAkhir=' + tglAkhir + '&idPegawai=' + idPegawai + '&idRuangan=' + ruanganId + '&idDokter=' + dokter + '&view=true', function (response) {
				// });
			}

			$scope.CetaklapPenerimaanPertransaksi = function () {
				var dokter = ''
				if ($scope.item.namaPegawai != undefined) {
					dokter = $scope.item.namaPegawai.id
				}
				var ruanganId = ''
				if ($scope.item.ruangan != undefined) {
					ruanganId = $scope.item.ruangan.id
				}

				var kasirId = ''
				if ($scope.item.namaKasir != undefined) {
					kasirId = $scope.item.namaKasir.id
				}
				var tglAwal = moment($scope.item.tanggalAwal).format('YYYY-MM-DD HH:mm:ss');
				var tglAkhir = moment($scope.item.tanggalAkhir).format('YYYY-MM-DD HH:mm:ss');;
				var client = new HttpClient();
				client.get('http://127.0.0.1:1237/printvb/kasir?cetak-laporan-penerimaan-pertransaksi=' + kasirId +
					'&tglAwal=' + tglAwal + '&tglAkhir=' + tglAkhir + '&idRuangan=' + ruanganId + '&idDokter=' + dokter + '&strIdPegawai=' + $scope.dataLogin.namaLengkap + '&view=true', function (response) {

					});
			}
			///////////////////////////// -TAMAT- ///////////////////////////
		}
	]);
});