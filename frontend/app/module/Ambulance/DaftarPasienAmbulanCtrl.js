define(['initialize'], function(initialize) {	
	'use strict';
	initialize.controller('DaftarPasienAmbulanCtrl', ['$q', '$rootScope', '$scope', 'CacheHelper', '$state', 'DateHelper', 'MedifirstService',
	function($q, $rootScope, $scope, cacheHelper, $state, DateHelper, medifirstService) {			
			$scope.item = {};
			// DaftarPasienAmbulanCtrl
			$scope.dataVOloaded = true;
			$scope.now = new Date();
			$scope.item.caritglawal=moment(new Date()).format('YYYY-MM-DD 00:00');
			$scope.item.caritglakhir=moment(new Date()).format('YYYY-MM-DD 23:59');		 			
			FormLoad();	
			

			function FormLoad(){
				medifirstService.get("ambulance/get-data-for-combo",true).then(function(dat){
                    $scope.listRuangan = dat.data.ruanganambulan;
                    $scope.item.caridatajenazahbyruangan ={id:dat.data.ruanganambulan[0].id,namaruangan:dat.data.ruanganambulan[0].namaruangan}
                    LoadCache();                    
                })
			}

			function LoadCache(){
                var chacePeriode = cacheHelper.get('DaftarPasienAmbulanCache');
                if(chacePeriode != undefined){
                    $scope.item.caridatajenazahbynocm  = chacePeriode[0]
                    $scope.item.caridatajenazahbyNoRegis  = chacePeriode[1]
                    $scope.item.caridatajenazahbynama  = chacePeriode[2]
                    $scope.item.caritglawal=chacePeriode[3];
					$scope.item.caritglakhir=chacePeriode[4];	
                    loadData()
                }
                else{
                   loadData()
                }
           }

			function loadData(){
				var noCm = "";
				var nama="";
			    var noRegis="";
			    var idRuangan="";

				if ($scope.item.caridatajenazahbynocm != undefined) {
					noCm = "&noCm=" + $scope.item.caridatajenazahbynocm;
				}

				if ($scope.item.caridatajenazahbyNoRegis != undefined) {
					noRegis = "&noRegis=" + $scope.item.caridatajenazahbyNoRegis;
				}

				if ($scope.item.caridatajenazahbynama != undefined) {
					nama = "&namaPasien=" + $scope.item.caridatajenazahbynama;
				}

				if ($scope.item.caridatajenazahbyruangan != undefined) {
					idRuangan = "&idRuangan=" + $scope.item.caridatajenazahbyruangan.id;
				}

				var tglAwal = "";
				if ($scope.item.caritglawal != undefined) {
					tglAwal = moment($scope.item.caritglawal).format('YYYY-MM-DD HH:mm:ss');
				}

				var tglAkhir = "";
				if ($scope.item.caritglawal != undefined) {
					tglAkhir = moment($scope.item.caritglakhir).format('YYYY-MM-DD HH:mm:ss');
				}

				var chacePeriode ={ 
                    0 : $scope.item.caridatajenazahbynocm,
                    1 : $scope.item.caridatajenazahbyNoRegis,
                    2 : $scope.item.caridatajenazahbynama,
                    3 : tglAwal,
                    4 : tglAkhir,
                     
                    }
                cacheHelper.set('DaftarPasienAmbulanCache', chacePeriode);
								
				var i=0;
				medifirstService.get("ambulance/get-data-pasien-ambulan?"+ noCm + noRegis + nama 
					+ idRuangan +"&tglAwal=" + tglAwal + "&tglAkhir=" + tglAkhir).then(function(dat){
						$scope.listDataJenazah = dat.data.data;	
					    if ($scope.listDataJenazah!=undefined){					    	
					    	for(i=0;i<$scope.listDataJenazah.length;i++){
								$scope.listDataJenazah[i].no=i+1;
								var tanggal = $scope.now;
		                        var tanggalLahir = new Date($scope.listDataJenazah[i].tgllahir);
		                        var umur = DateHelper.CountAge(tanggalLahir, tanggal);
		                        $scope.listDataJenazah[i].umur =umur.year + ' thn ' + umur.month + ' bln ' + umur.day + ' hari'
							}
							$scope.dataSource = new kendo.data.DataSource({
								pageSize: 10,
								data: $scope.listDataJenazah,
								autoSync: true
							});
					    }
				});
			}

			$scope.formatTanggal = function(tanggal){
				return moment(tanggal).format('DD-MMM-YYYY HH:mm');
			}

			$scope.columnDataJenazah = [				
				{
					"field": "tglregistrasi",
					"title": "Tgl Registrasi",
					"width":"130px",
					"template": "<span class='style-left'>{{formatTanggal('#: tglregistrasi #')}}</span>"
				},
				// {
				// 	"field": "tglorder",
				// 	"title": "Tgl Order",
				// 	"width":"130px",
				// 	"template": "<span class='style-left'>{{formatTanggal('#: tglorder #')}}</span>"
				// },
				// {
				// 	"field": "tglmasuk",
				// 	"title": "Tgl Layanan",
				// 	"width":"130px",
				// 	"template": "<span class='style-left'>{{formatTanggal('#: tglmasuk #')}}</span>"
				// },
				{
					"field": "tglpelayanan",
					"title": "Tgl Layanan",
					"width":"130px",
					"template": "<span class='style-left'>{{formatTanggal('#: tglpelayanan #')}}</span>"
				},				
				{
					"field": "nocm",
					"title": "No RM",
					"width":"80px",
					"template": "<span class='style-center'>#: nocm #</span>"
				},
				{
					"field": "noregistrasi",
					"title": "No Registrasi",
					"width":"100px",
					"template": "<span class='style-center'>#: noregistrasi #</span>"
				},
				{
					"field": "namapasien",
					"title": "Nama Pasien",
					"width":"200px",
					"template": "<span class='style-left'>#: namapasien #</span>"
				},
				{
					"field": "umur",
					"title": "Umur",
					"width":"150px",
					"template": "<span class='style-left'>#: umur #</span>"
				},
				{
					"field": "namadokter",
					"title": "Dokter",
					"width":"150px",
					// "template": "<span class='style-left'>#: namadokter #</span>"
					  "template": '# if( namadokter==null) {# - # } else {# #= namadokter # #} #'
				},
				{
					"field": "jeniskelamin",
					"title": "JK",
					"width":"80px",
					"template": "<span class='style-left'>#: jeniskelamin #</span>"
				},
				{
					"field": "namaruangan",
					"title": "Ruangan",
					"width":"150px",
					"template": "<span class='style-left'>#: namaruangan #</span>"
				},
				{
					"field": "namakelas",
					"title": "Kelas",
					"width":"80px",
					"template": "<span class='style-left'>#:  namakelas #</span>"
				},
				{
					"field": "kelompokpasien",
					"title": "Tipe Pembayaran",
					"width":"150px",
					"template": "<span class='style-center'>#: kelompokpasien #</span>"
				}				
			];

			$scope.mainGridOptions = { 
				 pageable: true,
				 columns: $scope.columnDataJenazah,
				 editable: "popup",
				 selectable: "row",
				 scrollable: false
			 };
		
			$scope.klik = function(current){				
				$scope.current = current;				
				$scope.item.norec = current.norec;
				$scope.item.objectpasiendaftarfk = current.objectpasiendaftarfk;
				$scope.item.objectantrianpasiendiperiksafk = current.objectantrianpasiendiperiksafk;
				$scope.item.noregistrasi = current.noregistrasi;
			};		

			$scope.cari = function () {
				loadData()
			}  			

			$scope.inputTindakan = function () {		
	            if ($scope.current != undefined) {
	                $state.go('InputTindakan', {
	                    norecPD: $scope.current.norec_pd,
	                    norecAPD: $scope.current.norec_apd
	                });
	            } else {
	                messageContainer.error('Pasien belum di pilih')
	            }
	        }

	        $scope.DetailTagihan = function () {
		        if($scope.current != undefined){
				   	var obj = {
				    	noRegistrasi : $scope.current.noregistrasi
				  	}

				  	$state.go('RincianTagihan', {
				    	dataPasien: JSON.stringify(obj)
				  	});
				}
			}

			var HttpClient = function() {
			    this.get = function(aUrl, aCallback) {
			        var anHttpRequest = new XMLHttpRequest();
			        anHttpRequest.onreadystatechange = function() { 
			            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
			                aCallback(anHttpRequest.responseText);
			        }

			        anHttpRequest.open( "GET", aUrl, true );            
			        anHttpRequest.send( null );
			    }
			}	
		//** BATAS SUCI */

		}
	]);
});