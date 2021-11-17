define(['initialize'], function(initialize) {
	'use strict';
	initialize.controller('GajiPegawaiCtrl', ['$q', '$scope', 'CacheHelper','DateHelper', 'MedifirstService','ModelItem',
		function($q, $scope, cacheHelper, dateHelper, medifirstService, ModelItem) {
			$scope.now = new Date();
			$scope.item = {};
			$scope.item.periodeAwal =  new Date();
			$scope.item.periodeAkhir = new Date();
			$scope.item.tahun = new Date();
			$scope.item.tanggalPulang= new Date();
			$scope.dataPasienSelected = {};			
			$scope.isRouteLoading=false;
			$scope.itemGaji = {};
			var dataDaftarPasienPulang = [];
			var data2 = [];
			$scope.item.totalgaji = 0;
			loadCombo();
			
			

			function loadCombo(){
				medifirstService.get("tatarekening/get-data-combo-daftarregpasien", false).then(function(data) {
					$scope.listDepartemen = data.data.departemen;
					$scope.listKelompokPasien = data.data.kelompokpasien;
					$scope.listDokter = data.data.dokter;
					$scope.listDokter2 = data.data.dokter;
					$scope.listBulan = data.data.bulan;
					var chacePeriode = cacheHelper.get('GajiBulan');
					if(chacePeriode != undefined){				
						$scope.item.periodeAwal = new Date(chacePeriode[2]);
						$scope.item.periodeAkhir = new Date(chacePeriode[3]);		
						$scope.item.bulan = $scope.listBulan[chacePeriode[1]-1];
						$scope.item.tahun = moment(new Date(chacePeriode[0])).format('YYYY');		
						$scope.item.norec = chacePeriode[4];

					}else{
						$scope.item.norec = '';
						var b = new Date().getMonth();
						$scope.item.bulan = $scope.listBulan[b];
						var bulan = ""
						if ($scope.item.bulan != undefined) {
							bulan = $scope.item.bulan.id
							if (bulan == 1){
								$scope.item.periodeAwal = new Date().getFullYear()-1 +'-' + $scope.item.bulan.periodeawal + ' 00:00';
								$scope.item.periodeAkhir = new Date().getFullYear() +'-'+ $scope.item.bulan.periodeakhir + ' 23:59';
							}else{
								$scope.item.periodeAwal = new Date().getFullYear() +'-' + $scope.item.bulan.periodeawal + ' 00:00';
								$scope.item.periodeAkhir = new Date().getFullYear() +'-'+ $scope.item.bulan.periodeakhir + ' 23:59';
							}
						}
					}
					loadData();
				});
				
			}
			

			$scope.getPeriodeGaji = function(){
				periodegaji();
			}

			$scope.formatTanggal = function(tanggal){
				return moment(tanggal).format('DD-MMM-YYYY HH:mm');
			}

			$scope.formatRupiah = function(value, currency) {
				if(value == null)return 0;
				return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
			}

			$scope.SearchData = function(){
				loadData()
			}

			function loadData(){
				$scope.isRouteLoading=true;
				var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm:ss');
				var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm:ss');

				var norec = ""
				if($scope.item.norec != undefined && $scope.item.norec != ''){
					norec = $scope.item.norec;
					var tahun = ""
					if($scope.item.tahun != undefined){
						tahun = moment($scope.item.tahun).format('YYYY');
						tahun = "&tahun=" + tahun;
					}
					
					var bulan = ""
					if ($scope.item.bulan != undefined) {
						bulan = "&bulan=" + $scope.item.bulan.id;
					}
				}else{
					var tahun = ""
					if($scope.item.tahun != undefined){
						tahun = moment($scope.item.tahun).format('YYYY');
						tahun = "&tahun=" + tahun;
					}

					var bulan = ""
					if ($scope.item.bulan != undefined) {
						bulan = $scope.item.bulan.id - 1;
						if(bulan == 0){
							bulan = 12;
						}
						bulan = "&bulan=" + bulan;
					}
				}
				var blnas= ''
				if($scope.item.bulan!= undefined){
					blnas =$scope.item.bulan.id 
					if(blnas<10){
						blnas =moment($scope.item.tahun).format('YYYY')+'-0'+blnas
					}else{
						
					blnas =moment($scope.item.tahun).format('YYYY')+ '-'+blnas
					}
				}
				
				
		
				

				$q.all([
					medifirstService.get("sdm/get-gaji-pegawai?"+ tahun + bulan + "&norec=" + norec
						+'&blntahun='+blnas ),
					]).then(function(data) {
						$scope.isRouteLoading=false;
						var tot = 0;
						var dat = data[0].data.data
						for(var i = 0; i < dat.length; i++){
							dat[i].no = i + 1;
							var det = dat[i].detail;
							if (det){
								for(var j = 0; j<det.length; j++){
									if(det[j].kdkomponen == '+'){
										tot = parseFloat(tot) + parseFloat(det[j].nilai);
									}else{
										tot = parseFloat(tot) - parseFloat(det[j].nilai);
									}
								}
								if(isNaN(tot)){
									tot =0
								}
								dat[i].total = tot;

								tot = 0;
							}
						}
						
						// $scope.dataDaftarPasienPulang = dat;
						$scope.dataDaftarPasienPulang = new kendo.data.DataSource({
							data: dat
						});
						var a = $scope.dataDaftarPasienPulang.options.data;
						for (var i = 0; i < a.length; i++){
							$scope.item.totalgaji = $scope.item.totalgaji + a[i].total;
						}
						// $scope.dataDaftarPasienPulang = new kendo.data.DataSource({
						// 	data: dat,
						// 	group: $scope.group,
						// 	pageSize: 10,
						// 	total: dat.length,
						// 	serverPaging: false,
						// 	schema: {
						// 		model: {
						// 			fields: {
						// 			}
						// 		}
						// 	}
						// });
					});

				};
				$scope.group = {
					field: "keterangan",
					aggregates: [
						// {
						//     field: "pasien",
						//     aggregate: "count"
						// }, 
						{
							field: "keterangan",
							aggregate: "count"
						}]
				};
				$scope.aggregate = [
					// {
					//     field: "pasien",
					//     aggregate: "count"
					// }, 
					{
						field: "keterangan",
						aggregate: "count"
					}]
				$scope.columnDaftarPasienPulang = [
				{
					"field": "no",
					"title": "No",
					"width":"10px",
					// "template": "<span class='style-center'>{{formatRupiah('#: totaldeposit #', 'Rp.')}}</span>"
				},
				{
					"field": "namalengkap",
					"title": "Nama Pegawai",
					"width":"130px",
					// "template": "<span class='style-center'>{{formatRupiah('#: totaldeposit #', 'Rp.')}}</span>"
				},
				{
					"field": "tgllahir",
					"title": "Tgl Lahir",
					"width":"80px",
					// "template": "<span class='style-center'>{{formatRupiah('#: totaldeposit #', 'Rp.')}}</span>"
				},
				{
					"field": "jenispegawai",
					"title": "Jabatan",
					"width":"80px",
					// "template": "<span class='style-center'>{{formatRupiah('#: totaldeposit #', 'Rp.')}}</span>"
				},
				{
					"field": "total",
					"title": "Total Gaji",
					"width":"80px",
					// "template": "<span class='style-center'>{{formatRupiah('#: totaldeposit #', 'Rp.')}}</span>"
				},
				];
				$scope.data2 = function(dataItem) {
					for (var i = 0; i < dataItem.detail.length; i++) {
						dataItem.detail[i].no = i+1

					}
					return {  
						dataSource: new kendo.data.DataSource({
							data: dataItem.detail,
							group: $scope.group,
							schema: {
								model: {
									id: "id",
									fields: {
										no: { editable: false },
										komponengaji: { editable: false},
										kdkomponen: { editable: false},
										nilai: { type: "number" }
									}
								}
							},
							// pageSize: 20,
							// change: function (e) {
							// 	console.log("change :" + e.action);
							// 	if (e.field && e.action === "itemchange") {
							// 		//debugger;
							// 		$scope.current.selisih = $scope.current.stokReal - $scope.current.qtyProduk;
							// 		// if ($scope.current.selisih<0)
							// 		//     $scope.current.selisih = $scope.current.selisih*=-1;
							// 		$scope.dataStokOpname.fetch();
							// 	}
							// }
						}),
						columns: [
						{
							"field": "no",
							"title": "No",
							"width" : "5px",
						},
						{
							"field": "komponengaji",
							"title": "Komponen Gaji",
							"width" : "50px",
							// "template": "<span class='style-center'>{{formatTanggal('#: tglpelayanan #')}}</span>"
						},
						{
							hidden: true,
							field: "keterangan",
							title: "Keterangan",
							aggregates: ["count"],
							groupHeaderTemplate: "#= value #"
						},
                        {
                        	"field": "nilai",
                        	"title": "Nilai",
                        	"width" : "50px",
                        	// "template": "<span class='style-center'>{{formatRupiah('#: hargasatuan #', 'Rp.')}}</span>"
                        },
						{
							"command": [
								{ text: "Edit", click: test, imageClass: "k-icon k-i-pencil" },
							],
							title: "",
							width: "50px",
						}
                        ]
                    }
                };  
			function test(e) {
				e.preventDefault();
				$scope.dataPasienSelected = this.dataItem($(e.currentTarget).closest("tr"));
				if ($scope.dataPasienSelected == undefined) {
					alert("Data Belum Dipilih!")
					return;
				};
				$scope.itemGaji.komponengaji = $scope.dataPasienSelected.komponengaji;
				$scope.itemGaji.nilai = $scope.dataPasienSelected.nilai;
				$scope.popUpGaji.center().open();
			}

			function struk(e) {

			}

			function bayar(e) {
				e.preventDefault();
				var dataBayar = this.dataItem($(e.currentTarget).closest("tr"));
				if (dataBayar == undefined) {
					alert("Data Belum Dipilih!")
					return;
				};
				if (dataBayar.total == 0 || isNaN(dataBayar.total)){
					alert("Total Belum Ada!")
					return;
				}
				var detailz = [];
				var data = [];
				for (var i = 0; i < dataBayar.detail.length; i++){
					data = {
						"komponengaji": dataBayar.detail[i].objectkomponengajifk,
						"kdkomponen": dataBayar.detail[i].kdkomponen,
						"nilai": dataBayar.detail[i].nilai
					}
					detailz.push(data)
				}

				var dataKabeh = {
					"tglsekarang": new Date(moment($scope.now).format('YYYY-MM-DD hh:mm:ss')),
					"total": dataBayar.total,
					"pegawai": dataBayar.id,
					"detail": detailz,
				}

				medifirstService.post('sdm/save-gaji', dataKabeh).then(function (e) {
					
				})
				
			}

			$scope.tambahNilaiGaji = function () {
				var listRawRequired = [
					"itemGaji.nilai|k-ng-model|Nilai Gaji",
				];
				// var test = $scope.dataPasienSelected;
				$scope.item.totalgaji = 0;
				var temp = 0;
				var total = 0;
				if ($scope.dataPasienSelected.total != undefined){
					total = $scope.dataPasienSelected.total;
				}
				var isValid = ModelItem.setValidation($scope, listRawRequired);
				if($scope.dataDaftarPasienPulang.length == undefined){
					$scope.dataDaftarPasienPulang = $scope.dataDaftarPasienPulang.options.data;
				}
				if (isValid.status) {
					for (var i = 0; i < $scope.dataDaftarPasienPulang.length; i++){
						var data = $scope.dataDaftarPasienPulang[i];
						if (data.id == $scope.dataPasienSelected.objectpegawaifk){
							for( var j = 0; j < data.detail.length; j++){
								if(data.detail[j].norec == $scope.dataPasienSelected.norec){
									data.detail[j].nilai = $scope.itemGaji.nilai;
								}
								if(data.detail[j].kdkomponen == '+'){
									temp = parseFloat(temp) + parseFloat(data.detail[j].nilai);
								}else{
									temp = parseFloat(temp) - parseFloat(data.detail[j].nilai);
								}
							}
						}else{
							for( var j = 0; j < data.detail.length; j++){
								if(data.detail[j].kdkomponen == '+'){
									temp = parseFloat(temp) + parseFloat(data.detail[j].nilai);
								}else{
									temp = parseFloat(temp) - parseFloat(data.detail[j].nilai);
								}
							}
						}
						total = parseFloat(total) + parseFloat(temp);
						$scope.item.totalgaji = parseFloat($scope.item.totalgaji) + parseFloat(total);
						
						$scope.dataDaftarPasienPulang[i].total = total;
						total = 0;
						temp = 0;
						
					}
				}
				var data = $scope.dataDaftarPasienPulang;
				$scope.dataDaftarPasienPulang = new kendo.data.DataSource({
					data: data
				});
				$scope.popUpGaji.center().close();
			}

			$scope.yearHungkul = {
                start: "decade",
                depth: "decade"
            }

			$scope.simpanGaji = function () {
				for (var x = $scope.dataDaftarPasienPulang.options.data.length - 1; x >= 0; x--) {
					const element =  $scope.dataDaftarPasienPulang.options.data[x];
					if(element.detail.length == 0){
						$scope.dataDaftarPasienPulang.options.data.splice(x,1)
					}
				}
				var kabeh = {
					"data": $scope.dataDaftarPasienPulang.options.data,
					"periodeawalgaji": $scope.item.periodeAwal,
					"periodeakhirgaji": $scope.item.periodeAkhir,
					"idbulan": $scope.item.bulan.id,
					"tahun": moment($scope.item.tahun).format('YYYY'),
					"total": $scope.item.totalgaji,
				}

				medifirstService.post('sdm/save-gaji', kabeh).then(function (e) {
					
				})

			}
			
	    }
	    ]);
});