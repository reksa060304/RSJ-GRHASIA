define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('RemunerasiPegawaiCtrl', ['$scope', '$state', 'CacheHelper', '$mdDialog', 'MedifirstService','$timeout',
		function ($scope, $state, cacheHelper, $mdDialog, medifirstService, $timeout) {
			$scope.item = {};
			$scope.iteminput = {};
			$scope.now = new Date();
			
			// var tgl = dateHelper.getDaysofMonth()
			// console.log(tgl);
			 $scope.monthUngkul = {
			 	start: "year",
			 	depth: "year"
			 }
			 $scope.yearUngkul = {
			 	start: "decade",
			 	depth: "decade"
			 }
			$scope.item.jumlahRows = 50;

            $scope.dataRemun = [];
			var norec = "";
			loadData()

			$scope.SearchData = function () {
				loadData()
			}
			function loadData(){
				var bulan = moment($scope.item.bulan).format('MM');
				var tahun = moment($scope.item.tahun).format('YYYY');
				console.log(bulan);
				console.log(tahun);
				medifirstService.get('tatarekening/get-daftar-remun-pegawai-fix?bulan='+ bulan + "&tahun="+ tahun).then(function (e) {
					console.log(e.data.data);
					$scope.dataSource = new kendo.data.DataSource({
						data: e.data.data,
						pageSize: 10,
						total: e.data.data.length,
						serverPaging: false,
						schema: {
							model: {
								fields: {
								
								}
							}
						}
					});
				})
			}

			$scope.klik = function (current) {
				console.log(current);
				norec=current.norec
			}
			$scope.columnProduk = [
				{
					"field": "namalengkap",
					"title": "Nama Pegawai",
                    "width": '200px',			
				},
				{
					"field": "uangp1",
					"title": "Uang P1",
                    "width": '200px',
                    "template": "<span class='style-right'>{{formatRupiah('#: uangp1 #', 'Rp.')}}</span>",
				},
				{
					"field": "uangiki",
					"title": "Uang IKI",
                    "width": '150px',
                    "template": "<span class='style-right'>{{formatRupiah('#: uangiki #', 'Rp.')}}</span>",
				},
				{
					"field": "uangiku",
					"title": "Uang IKU",
                    "width": '150px',
                    "template": "<span class='style-right'>{{formatRupiah('#: uangiku #', 'Rp.')}}</span>",
				},
				{
					"field": "uangtt",
					"title": "Uang TT",
                    "width": '150px',
                    "template": "<span class='style-right'>{{formatRupiah('#: uangtt #', 'Rp.')}}</span>",
				},
				{
					"field": "uangjtl",
					"title": "Uang JTL",
                    "width": '150px',
                    "template": "<span class='style-right'>{{formatRupiah('#: uangjtl #', 'Rp.')}}</span>",
				},
				{
					"field": "uangstruk",
					"title": "Uang Struk",
                    "width": '150px',
                    "template": "<span class='style-right'>{{formatRupiah('#: uangstruk #', 'Rp.')}}</span>",
				},
                {
					"field": "noposting",
					"title": "No Posting",
                    "width": '150px',
				},
			];
			$scope.mainGridOptions = {
				pageable: true,
				columns: $scope.columnProduk,
				editable: "popup",
				selectable: "row",
				scrollable: false,
				filterable: true,
				// filterMenuInit: function (e){
				// var grid = e.sender;
				// e.container.data("kendoPopup").bind("open", function() {

				// 	$scope.dataSource.sort({field: e.field, dir: "asc"});


				// 	var filter = e.sender.dataSource.filter();

				// 	var query = new kendo.data.Query(grid.dataSource.data());
				// 	var data = query.filter(filter).data;

				// 	var uniqueDsResult = removeDuplicates(data, e.field);


				// 	$scope.dataSource.data(uniqueDsResult);


				// })
				// },
				toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "MasterProduk.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    // sheet.frozenRows = 2;
                    //sheet.mergedCells = ["A1:H1"];
                    sheet.name = "Master Produk";

                    // var myHeaders = [{
                    //     value: "Master Produk",
                    //     fontSize: 20,
                    //     textAlign: "center",
                    //     background: "#ffffff",
                    //     // color:"#ffffff"
                    // }];

                    // sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                }				
			};

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }
		}
	]);
});
