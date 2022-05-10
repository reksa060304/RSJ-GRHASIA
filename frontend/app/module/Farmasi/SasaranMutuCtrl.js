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
		function timestrToSec(timestr) {
			var parts = timestr.split(":");
			return (parts[0] * 3600) +
					(parts[1] * 60) +
					(+parts[2]);
		}
		
		function pad(num) {
			if(num < 10) {
				return "0" + num;
			} else {
				return "" + num;
			}
		}
		
		function formatTime(seconds) {
			return [pad(Math.floor(seconds/3600)),
					pad(Math.floor(seconds/60)%60),
					pad(seconds%60),
					].join(":");
		}

       	function LoadData(){
       		var ru =''
       		if ($scope.item.unitLayanan != undefined) {
       			ru = $scope.item.unitLayanan.id
       		}
			
			$scope.listRacikan=[
				{nama:"Standar Waktu Tunggu",nilai:"01:00:00",satuan:"jam"},
				{nama:"Jumlah resep",nilai:0,satuan:"Resep"},
				{nama:"Masuk Waktu Tunggu",nilai:0,satuan:"Resep"},
				{nama:"Melebihi Waktu Tunggu",nilai:0,satuan:"Resep"},
				{nama:"Persentase Jumlah ≤ 60",nilai:0,satuan:"%"},
				{nama:"Rata-rata waktu tunggu",nilai:"00:00:00",satuan:"menit"},
				{nama:"Persentase Jumlah ≥ 60",nilai:0,satuan:"%"}
			];
			$scope.listNonRacikan=[
				{nama:"Standar Waktu Tunggu",nilai:"00:30:00",satuan:"menit"},
				{nama:"Jumlah resep",nilai:0,satuan:"Resep"},
				{nama:"Masuk Waktu Tunggu",nilai:0,satuan:"Resep"},
				{nama:"Melebihi Waktu Tunggu",nilai:0,satuan:"Resep"},
				{nama:"Persentase Jumlah ≤ 30",nilai:0,satuan:"%"},
				{nama:"Rata-rata waktu tunggu",nilai:"00:00:00",satuan:"menit"},
				{nama:"Persentase Jumlah ≥ 30",nilai:0,satuan:"%"}
			];
			
			
       		var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD');
			var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD');;
			medifirstService.get("farmasi/get-data-grid-sasaran-mutu?tglAwal="+tglAwal+'&tglAkhir='+tglAkhir+'&ruanganfk='+ru, false).then(function(data) {
				$scope.dataGrid = data.data.data;
				var 
				listSasaranMutu = data.data.data,
				jmlResepR=0,
				jmlResepMasukR=0,
				jmlResepLebihR=0,
				persentaseJumlahDibawahR=0,
				persentaseJumlahDiatasR=0,
				detikWaktuR=0,
				avgWaktuTungguR="00:00:00",
				jmlResepNR=0,
				jmlResepMasukNR=0,
				jmlResepLebihNR=0,
				persentaseJumlahDibawahNR=0,
				persentaseJumlahDiatasNR=0,
				detikWaktuNR=0,
				avgWaktuTungguNR="00:00:00"				
				;
				
				for (var i = 0; i < listSasaranMutu.length; i++) {
					if(listSasaranMutu[i].jenisantrian == 'Racikan'){
						
						if(listSasaranMutu[i].waktulayanan == undefined || listSasaranMutu[i].waktulayanan == ""){
							//jmlResepLebihR++;
						}else{
							jmlResepR++;
							detikWaktuR+=timestrToSec(listSasaranMutu[i].waktulayanan);
							if(listSasaranMutu[i].waktulayanan <= "1:00:00"){
								jmlResepMasukR++;
							}else{
								jmlResepLebihR++;
							}
						}

					}else{
						
						if(listSasaranMutu[i].waktulayanan == undefined || listSasaranMutu[i].waktulayanan == ""){
							//jmlResepLebihNR++;
						}else{
							jmlResepNR++;
							detikWaktuNR+=timestrToSec(listSasaranMutu[i].waktulayanan);
							if(listSasaranMutu[i].waktulayanan <= "0:30:00"){
								jmlResepMasukNR++;
							}else{
								jmlResepLebihNR++;
							}
						}
					}
				}

				persentaseJumlahDibawahR = Math.round((jmlResepMasukR / jmlResepR)*10000)/100;
				persentaseJumlahDiatasR = Math.round((jmlResepLebihR / jmlResepR)*10000)/100;
				avgWaktuTungguR = formatTime(Math.round(detikWaktuR / jmlResepR));

				persentaseJumlahDibawahNR = Math.round((jmlResepMasukNR / jmlResepNR)*10000)/100;
				persentaseJumlahDiatasNR = Math.round((jmlResepLebihNR / jmlResepNR)*10000)/100;
				avgWaktuTungguNR = formatTime(Math.round(detikWaktuNR / jmlResepNR));
				

				$scope.listNonRacikan=[
					{nama:"Standar Waktu Tunggu",nilai:"00:30:00",satuan:"menit"},
					{nama:"Jumlah resep",nilai:jmlResepNR,satuan:"Resep"},
					{nama:"Masuk Waktu Tunggu",nilai:jmlResepMasukNR,satuan:"Resep"},
					{nama:"Melebihi Waktu Tunggu",nilai:jmlResepLebihNR,satuan:"Resep"},
					{nama:"Persentase Jumlah ≤ 30",nilai:persentaseJumlahDibawahNR,satuan:"%"},
					{nama:"Rata-rata waktu tunggu",nilai:avgWaktuTungguNR,satuan:"menit"},
					{nama:"Persentase Jumlah ≥ 30",nilai:persentaseJumlahDiatasNR,satuan:"%"}
				];
				$scope.listRacikan=[
					{nama:"Standar Waktu Tunggu",nilai:"01:00:00",satuan:"jam"},
					{nama:"Jumlah resep",nilai:jmlResepR,satuan:"Resep"},
					{nama:"Masuk Waktu Tunggu",nilai:jmlResepMasukR,satuan:"Resep"},
					{nama:"Melebihi Waktu Tunggu",nilai:jmlResepLebihR,satuan:"Resep"},
					{nama:"Persentase Jumlah ≤ 60",nilai:persentaseJumlahDibawahR,satuan:"%"},
					{nama:"Rata-rata waktu tunggu",nilai:avgWaktuTungguR,satuan:"menit"},
					{nama:"Persentase Jumlah ≥ 60",nilai:persentaseJumlahDiatasR,satuan:"%"}
				];
				/*
					"field": "tglresep",
					"title": "Tanggal masuk"
				}, {
					"field": "tglselesai",
					"title": "Tgl Selesai"
				
				*/
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