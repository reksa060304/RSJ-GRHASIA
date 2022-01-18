define(['initialize'], function(initialize) {
	'use strict';
    initialize.controller('SasaranMutuCtrl', ['SaveToWindow', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper','DateHelper',  '$mdDialog', 'CetakHelper', 'MedifirstService','$q', 
        function (saveToWindow,$rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, $mdDialog, cetakHelper, medifirstService, $q) {
            
    
	// initialize.controller('SasaranMutuCtrl', ['$rootScope', '$scope', 'ModelItem', 'DateHelper','medifirstService','CacheHelper',
	// 	function($rootScope, $scope, ModelItem, DateHelper,medifirstService,cacheHelper) {
			$scope.title = "Sasaran Mutu";
            $scope.dataVOloaded = true;
			$scope.item = {};
			$scope.now = new Date();

		LoadCache();
		function LoadCache(){
			medifirstService.get("farmasi/get-combo-sasaranmutu", false).then(function(data) {
				$scope.listUnitLayanan = data.data.ruangan;
				// $scope.listDokter = data.data.dokter;
			})
          	var chacePeriode = cacheHelper.get('SasaranMutuCtrl');
          	if(chacePeriode != undefined){
           //var arrPeriode = chacePeriode.split(':');
            	$scope.item.periodeAwal = new Date(chacePeriode[0]);
            	$scope.item.periodeAkhir = new Date(chacePeriode[1]);
           
            	LoadData()
        	}else{
           		$scope.item.periodeAwal = $scope.now;
           		$scope.item.periodeAkhir = $scope.now;
           		LoadData()
         	}
       	}
       	function LoadData(){
       		var ru =''
       		if ($scope.item.unitLayanan != undefined) {
       			ru = $scope.item.unitLayanan.id
       		}
       		var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD');
			var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD');;
			medifirstService.get("farmasi/get-data-grid-sasaran-mutu?tglAwal="+tglAwal+'&tglAkhir='+tglAkhir+'&ruanganfk='+ru, false).then(function(data) {
				$scope.dataGrid = data.data.data;
			})
			var chacePeriode ={ 0 : tglAwal ,
              1 : tglAkhir,
            }
			cacheHelper.set('SasaranMutuCtrl', chacePeriode);
       		
       	}
			
			$scope.columnGrid = {
				toolbar: [
					"excel",

				],
				excel: {
					fileName: "SasaranMutu.xlsx",
					allPages: true,
				},
				excelExport: function (e) {
					var sheet = e.workbook.sheets[0];
					sheet.frozenRows = 2;
					sheet.mergedCells = ["A1:E1"];
					sheet.name = "SasaranMutu";

					var myHeaders = [{
						value: "SasaranMutu",
						fontSize: 20,
						textAlign: "center",
						background: "#ffffff",
						// color:"#ffffff"
					}];

					sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
				},
				selectable: 'row',
				pageable: true,
				columns:[
				{
					"field": "noresep",
					"title": "Nomor Resep"
				}, {
					"field": "jenisantrian",
					"title": "Jenis Antrian"
				}, {
					"field": "tglresep",
					"title": "Tanggal masuk"
				}, {
					"field": "tglselesai",
					"title": "Tgl Selesai"
				}, {
					"field": "waktulayanan",
					"title": "Waktu Layanan"
				}, {
					"field": "keterangan",
					"title": "Keterangan"
				}
			]};

			$scope.Cari = function(){
				LoadData()
			}
/////////////////////////////////////////////////////////////
		}
	]);
});