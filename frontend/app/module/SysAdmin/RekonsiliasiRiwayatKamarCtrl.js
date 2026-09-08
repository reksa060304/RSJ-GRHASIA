define(['initialize'], function(initialize){
	'use strict';
	initialize.controller('RekonsiliasiRiwayatKamarCtrl', ['$rootScope', '$scope', 'MedifirstService',
		function($rootScope, $scope, medifirstService){

		$scope.isRouteLoading = false;
		$scope.statusSinkron = null;
		$scope.totalRiwayatAktif = 0;
		$scope.totalBedAktual = 0;
		$scope.dataKamarTanpaRiwayat = [];
		$scope.dataRiwayatKamarNonAktif = [];

		loadData();

		function loadData(){
			$scope.isRouteLoading = true;
			medifirstService.get("sysadmin/master/get-rekonsiliasi-riwayat-kamar").then(function(data){
				var d = data.data;
				$scope.totalRiwayatAktif = d.total_riwayat_aktif;
				$scope.totalBedAktual = d.total_bed_aktual;
				$scope.statusSinkron = d.status_sinkron;
				$scope.dataKamarTanpaRiwayat = d.kamar_tanpa_riwayat;
				$scope.dataRiwayatKamarNonAktif = d.riwayat_kamar_non_aktif;

				$scope.gridSourceKamarTanpaRiwayat = new kendo.data.DataSource({
					data: d.kamar_tanpa_riwayat,
					schema: { model: {} }
				});
				$scope.gridSourceRiwayatKamarNonAktif = new kendo.data.DataSource({
					data: d.riwayat_kamar_non_aktif,
					schema: { model: {} }
				});

				$scope.isRouteLoading = false;
			}, function(){
				$scope.isRouteLoading = false;
			});
		}

		$scope.refreshData = function(){
			loadData();
		}

		$scope.tutupSatu = function(dataItem){
			if (!confirm('Tutup riwayat kamar "' + dataItem.namaruangan + ' - ' + dataItem.namakamar + '" per hari ini? Aksi ini akan menghentikan riwayat SK tersebut dari perhitungan Sensus mulai sekarang.')) {
				return;
			}
			$scope.isRouteLoading = true;
			medifirstService.post("sysadmin/master/post-tutup-riwayat-kamar-non-aktif", {id: dataItem.idriwayat}).then(function(res){
				$scope.isRouteLoading = false;
				alert(res.message || 'Berhasil ditutup');
				loadData();
			}, function(){
				$scope.isRouteLoading = false;
				alert('Gagal menutup riwayat, coba lagi.');
			});
		}

		$scope.tutupSemua = function(){
			if ($scope.dataRiwayatKamarNonAktif.length === 0) {
				alert('Tidak ada riwayat kamar nonaktif yang perlu ditutup.');
				return;
			}
			if (!confirm('Tutup SEMUA (' + $scope.dataRiwayatKamarNonAktif.length + ') riwayat kamar nonaktif sekaligus per hari ini? Pastikan Anda sudah mengecek daftarnya terlebih dahulu.')) {
				return;
			}
			$scope.isRouteLoading = true;
			medifirstService.post("sysadmin/master/post-tutup-semua-riwayat-kamar-non-aktif", {}).then(function(res){
				$scope.isRouteLoading = false;
				alert(res.message || 'Berhasil ditutup');
				loadData();
			}, function(){
				$scope.isRouteLoading = false;
				alert('Gagal menutup riwayat, coba lagi.');
			});
		}

		$scope.columnKamarTanpaRiwayat = [
			{ "field": "namaruangan", "title": "Nama Ruangan", "width": "200px" },
			{ "field": "namakamar", "title": "Nama Kamar", "width": "200px" },
			{ "field": "idkamar", "title": "ID Kamar", "width": "100px" }
		];

		$scope.columnRiwayatKamarNonAktif = [
			{ "field": "namaruangan", "title": "Nama Ruangan", "width": "150px" },
			{ "field": "namakamar", "title": "Nama Kamar", "width": "150px" },
			{ "field": "jumlah_tt", "title": "Jumlah TT", "width": "80px" },
			{ "field": "tanggalawal", "title": "Tanggal Mulai", "width": "120px", "format": "{0:dd/MM/yyyy}" },
			{ "field": "tanggalakhir", "title": "Tanggal Akhir", "width": "120px", "format": "{0:dd/MM/yyyy}" },
			{ "field": "nosk", "title": "No. SK", "width": "150px" },
			{ "field": "ruangan_aktif", "title": "Ruangan Aktif?", "width": "100px", "template": "#= ruangan_aktif ? 'Ya' : 'TIDAK' #" },
			{ "field": "kamar_aktif", "title": "Kamar Aktif?", "width": "100px", "template": "#= kamar_aktif ? 'Ya' : 'TIDAK' #" },
			{
				"title": "Aksi", "width": "100px",
				"template": "<button class='c-button' ng-click=\"tutupSatu(dataItem)\">Tutup</button>"
			}
		];

	}])
})
