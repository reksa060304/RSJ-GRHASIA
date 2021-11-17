define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('DaftarCollectingPiutangCtrl', ['CacheHelper', '$scope', 'MedifirstService', '$state', 'DateHelper',
		function (cacheHelper, $scope, medifirstService, $state, dateHelper) {
			$scope.now = new Date();
			$scope.item = {};
			$scope.isRouteLoading = false;
			$scope.listStatus = [{ "id": 1, "namaStatus": "Collecting" }, { "id": 2, "namaStatus": "Selesai" }]

			$scope.bri = {}
			loadDataBRI()
			//ON LOAD with Params
			var chacePeriode = cacheHelper.get('filterDataParams');
			if (chacePeriode != undefined) {
				var arrPeriode = chacePeriode.split('~');
				$scope.item.tanggalAwal = new Date(arrPeriode[0]);
				$scope.item.tanggalAkhir = new Date(arrPeriode[1]);

				if (arrPeriode[2] != "undefined") {
					$scope.item.namaCollector = arrPeriode[2];
				};
				if (arrPeriode[3] != "undefined") {
					$scope.item.status = { "namaStatus": arrPeriode[3] };
				}
				if (arrPeriode[4] != "undefined") {
					$scope.item.noCollect = arrPeriode[4];
				};

				var tglAwal1 = dateHelper.formatDate($scope.item.tanggalAwal, "YYYY-MM-DD");
				var tglAkhir1 = dateHelper.formatDate($scope.item.tanggalAkhir, "YYYY-MM-DD");
				var np = "&namaPasien=" + $scope.item.namaCollector;
				if ($scope.item.namaCollector == undefined) {
					var np = "";
				};
				var nps = "&noposting=" + $scope.item.noCollect;
				if ($scope.item.noCollect == undefined) {
					var nps = "";
				};
				var stt = ""
				if ($scope.item.status != undefined) {
					var stt = "&status=" + $scope.item.status.namaStatus;
				};
				$scope.isRouteLoading = true;
				medifirstService.get("piutang/daftar-collected-piutang-layanan?tglAwal=" + tglAwal1 + "&tglAkhir=" + tglAkhir1 + np + nps + stt).then(function (data) {
					$scope.isRouteLoading = false;
					for (var i = 0; i < data.length; i++) {
						data[i].sisa = parseFloat(data[i].totalKlaim) - parseFloat(data[i].totalSudahDibayar);
					}
					$scope.dataSource2 = data;
				});

			}
			else {
				$scope.item.tanggalAwal = $scope.now;
				$scope.item.tanggalAkhir = $scope.now;
			};
			///END/// ON LOAD with Params


			$scope.Ubah = function () {
				var chacePeriode = '' + ":" + $scope.dataSelected.noPosting + ":" + '' + ":" + '' + ":" + '' + ":"
					+ '' + ":" + ''
					+ ":" + '' + ":" + '' + ":" + 'as@epic'
				cacheHelper.set('periodeTransaksiPencatatanPiutangDaftarLayanan', chacePeriode);

				var obj = {
					splitString: "a s @ e p i c "
				}

				$state.go('CollectingPiutang', {
					dataFilter: JSON.stringify(obj)
				});
			}

			$scope.cariData = function () {
				//SIMPAN CAHCE
				$scope.isRouteLoading = true;
				$scope.dataSelected = undefined;
				var tglAwal1 = dateHelper.formatDate($scope.item.tanggalAwal, "YYYY-MM-DD");
				var tglAkhir1 = dateHelper.formatDate($scope.item.tanggalAkhir, "YYYY-MM-DD");
				if ($scope.item.namaCollector != undefined) {
					var npp = $scope.item.namaCollector;
				};
				if ($scope.item.status != undefined) {
					var sttt = $scope.item.status.namaStatus;
				};
				if ($scope.item.noCollect != undefined) {
					var npps = $scope.item.noCollect;
				};
				var chacePeriode = tglAwal1 + "~" + tglAkhir1 + "~" + npp + "~" + sttt + "~" + npps;
				cacheHelper.set('filterDataParams', chacePeriode);
				/////END

				///FILTER DATA
				var np = "&namaPasien=" + $scope.item.namaCollector;
				if ($scope.item.namaCollector == undefined) {
					var np = "";
				};
				var nps = "&noposting=" + $scope.item.noCollect;
				if ($scope.item.noCollect == undefined) {
					var nps = "";
				};
				var stt = ""
				if ($scope.item.status != undefined) {
					var stt = "&status=" + $scope.item.status.namaStatus;
				};

				medifirstService.get("piutang/daftar-collected-piutang-layanan?tglAwal=" + tglAwal1 + "&tglAkhir=" + tglAkhir1 + np + nps + stt).then(function (data) {
					$scope.isRouteLoading = false;
					for (var i = 0; i < data.length; i++) {
						data[i].sisa = parseFloat(data[i].totalKlaim) - parseFloat(data[i].totalSudahDibayar);
					}
					$scope.dataSource2 = data;

				});
				/////END
			};
			///END/// //ON CLICK tombol CARI

			$scope.formatRupiah = function (value, currency) {
				return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1.");
			}

			$scope.columnPencatatanPiutang = [
				{
					"field": "noPosting",
					"title": "No Collecting"
				},
				{
					"field": "tglTransaksi",
					"title": "Tanggal"
				},
				{
					"field": "collector",
					"title": "Nama Collector"
				},
				{
					"field": "kelompokpasien",
					"title": "Kelompok Pasien"
				},
				{
					"field": "namarekanan",
					"title": "Penjamin"
				},
				{
					"field": "jlhPasien",
					"title": "Total Pasien"
				},
				{
					"field": "totalKlaim",
					"title": "Total Klaim",
					"template": "<span class='style-right'>{{formatRupiah('#: totalKlaim #', 'Rp.')}}</span>"
				},
				{
					"field": "totalSudahDibayar",
					"title": "Total Sudah Dibayar",
					"template": "<span class='style-right'>{{formatRupiah('#: totalSudahDibayar #', 'Rp.')}}</span>"
				},
				{
					"field": "status",
					"title": "Status"
				},
				{
					"field": "nomorreferencebri",
					"title": "Nomor Invoice BRI"
				}
			];

			$scope.klikGrid = function (dataSelected) {
				if (dataSelected != undefined) {
					$scope.dataSelected = dataSelected;
				}
			}

			$scope.detail = function () {
				// $scope.changePage("DetailCollectingPiutang");
				Pindah("DetailCollectingPiutang");
			};

			function Pindah(stateName) {
				if (stateName == "DetailCollectingPiutang") {
					if ($scope.dataSelected.noPosting != undefined) {
						var obj = {
							dataCollect: $scope.dataSelected.noPosting + "~..:."
						}

						$state.go(stateName, {
							dataCollect: JSON.stringify(obj)
						});
					}
					else {
						alert("Silahkan pilih data Collector terlebih dahulu");
					}
				} else if (stateName == "PembayaranPiutangKasir") {
					var noPostingC = $scope.dataSelected.noPosting
					var obj = {
						noPosting: noPostingC
					}

					$state.go(stateName, {
						dataPasien: JSON.stringify(obj)
					});
				}

			}

			$scope.changePage = function (stateName) {
				if ($scope.dataSelected.noPosting != undefined) {
					var obj = {
						splitString: $scope.dataSelected.noPosting + "~..:."
					}

					$state.go(stateName, {
						dataCollect: JSON.stringify(obj)
					});
				}
				else {
					alert("Silahkan pilih data Collector terlebih dahulu");
				}
			};

			$scope.kps = function () {
				if ($scope.dataSelected.noPosting != undefined) {
					$state.go('DaftarKartuPiutangPerusahaan', {
						id: $scope.dataSelected.idrekanan,
					});
				} else {
					alert("Silahkan pilih data Collector terlebih dahulu");
				}
			}

			$scope.bayar = function () {
				Pindah("PembayaranPiutangKasir");
				// $scope.changePage("PembayaranPiutangKasir");				
			}

			$scope.changePage = function (stateName) {
				var noPostingC = $scope.dataSelected.noPosting
				var obj = {
					noPosting: noPostingC
				}

				$state.go(stateName, {
					data: JSON.stringify(obj)
				});
			}
			$scope.$watch('bri.InvoiceTypeName', function (newValue, oldValue) {
				if (newValue != oldValue) {
					$scope.bri.PaymentMethod = newValue.facilityCode
				}
			})
			function loadDataBRI() {
				medifirstService.get('piutang/get-setting-bri').then(function (e) {
					// $scope.bri.PartnerCode = e.data.PartnerCode
					$scope.bri.AnchorCode = e.data.AnchorCode
					$scope.bri.AnchorName = e.data.AnchorName

					// $scope.bri.InvoiceType = 'AR'
					// $scope.bri.InvoiceTypeName = 'Account Receivable'
					$scope.bri.Currency = 'IDR'
					$scope.bri.InvoiceTypeName = { facilityCode: 'AR' }
					$scope.bri.PaymentMethod = 'AR'
					medifirstService.get('bri/cbm/inquiry-facilities?anchorCode=' + $scope.bri.AnchorCode).then(function (z) {
						if (z.data.responseCode == '00') {
							$scope.listFacilities = z.data.responseData
							$scope.bri.InvoiceTypeName = $scope.listFacilities[1]
							$scope.bri.PaymentMethod = $scope.bri.InvoiceTypeName.facilityCode
						} else {
							toastr.error(z.data.responseDesc, 'inquiry-facilities')
						}

					})
					medifirstService.get('bri/cbm/inquiry-list-partner?anchorCode=' + $scope.bri.AnchorCode).then(function (x) {
						if (x.data.responseCode == '00') {
							$scope.listPartner = x.data.responseData
						} else {
							toastr.error(x.data.responseDesc, 'inquiry-list-partner')
						}
					})
				})
			}
			$scope.batal = function () {
				$scope.popUp.close()
			}
			$scope.scfBRI = function () {
				// if ($scope.dataSelected == undefined) {
				// 	toastr.error('Pilih data dulu');
				// 	return
				// }
				$scope.invoiceBRI()
				$scope.myVar2 = 0
				$scope.popUp.center().open()
			}

			$scope.onTabChanges = function (value) {
				if (value === 1) {
					$scope.invoiceBRI()
				} else if (value === 2) {
					if ($scope.dataSelected.nomorreferencebri == null) {
						toastr.warning('Invoice belum ada');
						return
					}
					$scope.inquiryBRI()
				} else if (value == 3) {
					loadICF()
				} else if (value == 4) {
					// loadDetailPartner()
				}
			};
			function clearss() {
				delete $scope.RefrenceNumber
				delete $scope.InvoiceType
				delete $scope.InvoiceNumber
				delete $scope.Amount
				delete $scope.DisbursementCompleteDate
				delete $scope.SettlementCompleteDate
				delete $scope.CreateDate
				delete $scope.StatusDesc
				delete $scope.bri.ReferenceNumber
				delete $scope.bri.partner
				delete $scope.bri.Description
				delete $scope.bri.InvoiceDate
				delete $scope.bri.DisbursementDate
				delete $scope.bri.SettlementDate
				delete $scope.bri.Amount
				delete $scope.bri.AmountName
				delete $scope.bri.InvoiceNumber
				delete $scope.bri.cariInvoice
			}
			$scope.invoiceBRI = function () {
				// if ($scope.dataSelected == undefined) {
				// 	toastr.error('Pilih data dulu');
				// 	return
				// }

				clearss()
				if ($scope.dataSelected != undefined && $scope.dataSelected.nomorreferencebri != null) {
					$scope.bri.ReferenceNumber = $scope.dataSelected.nomorreferencebri
					// 	toastr.warning('Invoice Sudah dibuat silahkan Cek Status',$scope.dataSelected.nomorreferencebri);
					// 	return
				}


				var rekanan = ''
				var totalKlaim = 0
				var noPosting = ''
				if ($scope.dataSelected != undefined) {
					rekanan = $scope.dataSelected.namarekanan
					totalKlaim = $scope.dataSelected.totalKlaim
					noPosting = $scope.dataSelected.noPosting
					let bulanHareup = new Date(new Date().setMonth(new Date().getMonth() + 1));
					let bln = new Date(new Date().setMonth(new Date().getMonth() + 1));
					let bulanHareup1 = new Date(bln.setDate(bln.getDate() + 1));
					if ($scope.listPartner != undefined) {
						for (let i = 0; i < $scope.listPartner.length; i++) {
							const element = $scope.listPartner[i];
							if (element.InitialCode == $scope.dataSelected.partnercode) {
								$scope.bri.partner = element
								break
							}
						}
					}
				}



				$scope.bri.InvoiceDate = new Date()
				$scope.bri.DisbursementDate = new Date()// bulanHareup
				$scope.bri.SettlementDate = new Date(new Date().setDate(new Date().getDate() + 1))//bulanHareup1
				$scope.bri.Description = "Piutang SCF " + rekanan
				$scope.bri.Amount =parseInt(totalKlaim)
				$scope.bri.AmountName = $scope.formatRupiah(parseInt(totalKlaim), 'Rp. ')
				$scope.bri.InvoiceNumber = noPosting
				// $scope.bri.partner = $scope.dataSelected.namarekanan
				// $scope.popUp.center().open()
			}
			$scope.saveBRI = function () {
				if ($scope.dataSelected != undefined && $scope.dataSelected.nomorreferencebri != null) {
					toastr.warning('Invoice Sudah dibuat silahkan Inquiry Invoice', $scope.dataSelected.nomorreferencebri);
					return
				}
				$scope.isSave = true
				let json = {
					"AnchorCode": $scope.bri.AnchorCode,
					"PartnerCode": $scope.bri.partner != undefined ? $scope.bri.partner.InitialCode : null,
					"InvoiceType": $scope.bri.InvoiceTypeName != undefined ? $scope.bri.InvoiceTypeName.facilityCode : null,
					"InvoiceDate": $scope.bri.InvoiceDate ? moment($scope.bri.InvoiceDate).format('YYYY-MM-DD') : null,
					"InvoiceNumber": $scope.bri.InvoiceNumber ? $scope.bri.InvoiceNumber : null,
					"Currency": $scope.bri.Currency ? $scope.bri.Currency : null,
					"Amount": $scope.bri.Amount ? $scope.bri.Amount : null,
					"DisbursementDate": $scope.bri.DisbursementDate ? moment($scope.bri.DisbursementDate).format('YYYY-MM-DD') : null,
					"SettlementDate": $scope.bri.SettlementDate ? moment($scope.bri.SettlementDate).format('YYYY-MM-DD') : null,
					"SharingDate": $scope.bri.SharingDate ? moment($scope.bri.SharingDate).format('YYYY-MM-DD') : "",
					"Description": $scope.bri.Description ? $scope.bri.Description : null,
					"PaymentMethod": $scope.bri.PaymentMethod ? $scope.bri.PaymentMethod : null
				}
				$scope.isRouteLoading = true
				medifirstService.postNonMessage('bri/cbm/create-invoice', json).then(function (e) {
					$scope.isSave = false
					$scope.isRouteLoading = false
					let consoles = {
						request: json,
						result: e.data
					}
					console.log(consoles)
					if (e.data.responseCode != undefined) {
						if (e.data.responseCode == '00') {
							$scope.bri.ReferenceNumber = e.data.responseData.ReferenceNumber
							toastr.success(e.data.responseData.Message, 'BRI')
							if ($scope.dataSelected != undefined) {
								saveIntern($scope.bri.ReferenceNumber, $scope.bri.InvoiceNumber)
							}
							$scope.popUp.close()
						} else {
							toastr.error(e.data.responseDesc, 'BRI')
						}
					} else {
						toastr.error(e.data.status != undefined ? e.data.status.desc : e.data.fault.faultstring, 'BRI')
					}


				}, function (error) {
					$scope.isRouteLoading = false
					$scope.isSave = false
				})
			}
			function saveIntern(briNumber, noPosting) {
				medifirstService.post('piutang/save-nomor-bri-reference',
					{ briNumber: briNumber, noPosting: noPosting }
				).then(function (e) {
					$scope.cariData()
				})
			}

			function inquirySingleInvo(referenceNum) {
				if (referenceNum == undefined) return
				$scope.isRouteLoading = true
				medifirstService.get('bri/cbm/inquiry-single-invoice/' + referenceNum).then(function (e) {
					$scope.isRouteLoading = false
					if (e.data.responseCode == '00') {

						$scope.RefrenceNumber = e.data.responseData.RefrenceNumber
						$scope.InvoiceType = e.data.responseData.InvoiceType
						$scope.InvoiceNumber = e.data.responseData.InvoiceNumber
						$scope.Amount = e.data.responseData.Amount + ' ' + e.data.responseData.Currency
						$scope.DisbursementCompleteDate = e.data.responseData.DisbursementCompleteDate
						$scope.SettlementCompleteDate = e.data.responseData.SettlementCompleteDate
						$scope.CreateDate = e.data.responseData.CreateDate
						$scope.StatusDesc = e.data.responseData.StatusDesc
						// $scope.popUpDetail.center().open()
					} else {
						clearss()
						toastr.error(e.data.responseDesc, 'BRI')
					}

				})
			}
			$scope.findInq = function () {
				inquirySingleInvo($scope.bri.cariInvoice)
			}
			$scope.inquiryBRI = function () {
				// if ($scope.dataSelected == undefined) {
				// 	toastr.error('Pilih data dulu');
				// 	return
				// }
				// if ($scope.dataSelected.nomorreferencebri ==null) {
				// 	toastr.warning('Invoice belum ada');
				// 	return
				// }

				if ($scope.dataSelected != undefined) {
					$scope.bri.cariInvoice = $scope.dataSelected.nomorreferencebri
					inquirySingleInvo($scope.bri.cariInvoicei)
				}

			}
			$scope.cancelInvoiceBRI = function () {
				if ($scope.dataSelected == undefined) {
					toastr.error('Pilih data dulu');
					return
				}
				if ($scope.dataSelected.nomorreferencebri == null) {
					toastr.warning('Invoice belum ada');
					return
				}
				let json = {
					"ReferenceNumber": $scope.dataSelected.nomorreferencebri,
					"InvoiceNumber": $scope.dataSelected.noPosting
				}

				$scope.isRouteLoading = true
				medifirstService.postNonMessage('bri/cbm/cancel-invoice', json).then(function (e) {
					if (e.data.responseCode == '00') {
						$scope.bri.ReferenceNumber = e.data.responseData.ReferenceNumber
						toastr.success(e.data.responseData.Message, 'BRI')
						saveIntern(null, $scope.dataSelected.noPosting)
					} else {
						toastr.error(e.data.responseDesc, 'BRI')
					}

					$scope.isRouteLoading = false
				}, function (error) {
					$scope.isRouteLoading = false
				})
			}

			$scope.columnCF = [
				{
					"field": "facilityCode",
					"title": "Facility Code"
				},
				{
					"field": "facilityCodeDesc",
					"title": "facility Description"
				},
				{
					"field": "facilityAccount",
					"title": "Facility Account "
				},

			];
			$scope.columnDP = [
				{
					"field": "PartnerCode",
					"title": "Partner Code"
				},
				{
					"field": "PartnerName",
					"title": "Partner Name "
				},
				{
					"field": "PaymentMethod",
					"title": "Payment Method  "
				},
				{
					"field": "PaymentMethodDesc",
					"title": "Payment Method Desc  "
				},
			];
			function loadICF() {
				$scope.isRouteLoading = true
				medifirstService.get('bri/cbm/inquiry-facilities?anchorCode=' + $scope.bri.AnchorCode).then(function (e) {
					$scope.isRouteLoading = false
					if (e.data.responseCode == '00') {
						let data = e.data.responseData
						$scope.dsCF = new kendo.data.DataSource({
							data: data,
							pageSize: 10,
							total: data,
							serverPaging: false,
						});

					} else {
						toastr.error(e.data.responseDesc, 'BRI')
					}
				})
			}
			$scope.facility = {}
			$scope.partner = {}
			$scope.$watch('bri.cekFacility', function (newValue, oldValue) {
				if (newValue != oldValue) {
					$scope.bri.cekFacilityAccount = newValue.facilityAccount
				}
			})
			$scope.facilityBalance = function () {
				$scope.isRouteLoading = true
				$scope.showBalance = false
				let facilityCode = ''
				let facilityAccount = ''
				let InitialCode = ''
				if ($scope.bri.cekFacility) {
					facilityCode = $scope.bri.cekFacility.facilityCode
				
				}
				if ($scope.bri.cekFacilityAccount) {
					facilityAccount = $scope.bri.cekFacilityAccount
				}
			
				if ($scope.bri.cekPartner) {
					InitialCode = $scope.bri.cekPartner.InitialCode
				}
				medifirstService.get('bri/cbm/inquiry-facility-balance?anchorCode=' + $scope.bri.AnchorCode
					+ '&facility_code=' + facilityCode
					+ '&facility_account=' + facilityAccount
					+ '&partner_code=' + InitialCode
				).then(function (e) {
					$scope.isRouteLoading = false
					if (e.data.responseCode == '00') {
						$scope.showBalance = true
						$scope.facility = e.data.responseData

					} else {
						toastr.error(e.data.responseDesc, 'BRI')
					}
				})
			}
			$scope.findFacility = function () {
				$scope.isRouteLoading = true
				$scope.showBalance2 = false
				let facilityCode = ''
				let facilityAccount = ''
				let InitialCode = ''
				if ($scope.bri.cekFacility) {
					facilityCode = $scope.bri.cekFacility.facilityCode
					// facilityAccount = $scope.bri.cekFacility.facilityAccount
				}
				if ($scope.bri.cekFacilityAccount) {
					facilityAccount = $scope.bri.cekFacilityAccount
				}
				if ($scope.bri.cekPartner) {
					InitialCode = $scope.bri.cekPartner.InitialCode
				}
				medifirstService.get('bri/cbm/inquiry-partner-facility?anchorCode=' + $scope.bri.AnchorCode
					+ '&facility_code=' + facilityCode
					+ '&partner_code=' + InitialCode
				).then(function (e) {
					$scope.isRouteLoading = false
					if (e.data.responseCode == '00') {
						$scope.showBalance2 = true
						$scope.partner = e.data.responseData

					} else {
						$scope.showBalance2 = false
						$scope.partner = {}
						toastr.error(e.data.responseDesc, 'BRI')
					}
				})
			}
			$scope.findDP = function () {
				$scope.isRouteLoading = true
				let facilityCode = ''
				let facilityAccount = ''
				let InitialCode = ''

				if ($scope.bri.cekPartner) {
					InitialCode = $scope.bri.cekPartner.InitialCode
				}
				medifirstService.get('bri/cbm/inquiry-detail-partner?anchorCode=' + $scope.bri.AnchorCode
					+ '&partner_code=' + InitialCode).then(function (e) {
						$scope.isRouteLoading = false
						if (e.data.responseCode == '00') {
							let data = e.data.responseData
							$scope.dsDP = new kendo.data.DataSource({
								data: data,
								pageSize: 10,
								total: data,
								serverPaging: false,
							});

						} else {
							$scope.dsDP = new kendo.data.DataSource({
								data: [],
								
							});

							toastr.error(e.data.responseDesc, 'BRI')
						}
					})
			}
			$scope.bayarLokal = function () {
				if ($scope.SettlementCompleteDate != undefined && $scope.SettlementCompleteDate != null) {
					$scope.isRouteLoading = true
					medifirstService.get('piutang/get-norec-sp-by-posting?noPosting=' + $scope.dataSelected.noPosting).then(function (res) {

						let response = res.data
						var ttlKlaimPasien = 0;
						var ttlKlaim = 0;
						var persen = 0;
						var ttlKlaimPerPasien = 0;
						var detailSPP = [];
						var pembulatan = 0

						for (var i = 0; i < response.length; i++) {
							ttlKlaim = ttlKlaim + parseFloat(response[i].totalppenjamin);
						}
						persen = parseFloat(($scope.Amount * 100) / ttlKlaim);

						for (var i = 0; i < response.length; i++) {
							ttlKlaimPasien = parseFloat(response[i].totalppenjamin);
							ttlKlaimPerPasien = parseFloat(response[i].totalppenjamin * persen) / 100;
							pembulatan = Math.round(ttlKlaimPerPasien, -1);
							var obj = {
								noRecSPP: response[i].norec_spp,
								klaim: ttlKlaimPasien,
								bayarKlaim: pembulatan
							}
							detailSPP.push(obj)
						}
						let json = {
							"parameterTambahan":
							{
								"noRecStrukPelayanan": response[0].norec_sp,
								"tipePembayaran": "cicilanPasienCollect",
								"jumlahBayar": parseFloat($scope.Amount)
							},
							"jumlahBayar": parseFloat($scope.Amount),
							"biayaAdministrasi": 0,
							"diskon": 0,
							"detailSPP": detailSPP,
							"pembayaran": [
								{
									"nominal": parseFloat($scope.Amount),
									"caraBayar": { "id": 7 }//SCF BRI
								}
							]
						}
						medifirstService.post('kasir/simpan-data-pembayaran', json).then(function (e) {
							$scope.isRouteLoading = false
							$scope.popUp.close()
							$scope.cariData()

						})
					})

				} else {
					toastr.error($scope.StatusDesc, 'BRI')
				}
			}
			////////////////////////////////////////////////////////////
		}
	]);
});