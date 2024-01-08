define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('MasterJenisKelaminCtrl', ['$rootScope', '$scope', 'MedifirstService', '$window', '$timeout',
        function ($rootScope, $scope, medifirstService, $window, $timeout) {
            $scope.item = {};
			$scope.popUp = {}

            $scope.cariMasterKelamin = function () {
                loadData()
            }

            
            function loadData() {
                medifirstService.get('sysadmin/get-master-kelamin').then(function(kelamin){
                    var datas=kelamin.data.jeniskelamin //namafunction.data.data dari backend yang ada di controller

                    $scope.dataSourceKelamin = new kendo.data.DataSource({
                        data: datas,

                        schema: {
                            model: {
                                
                            },
                            
                        },
                        pageSize: 20,
                    });
                })
            }

            $scope.columnProduk = [ //array pake kotak dulu
				{
					"field": "id",
					"title": "<h3 align=center>ID<h3>",
					"width": "48px",
					// "filterable": false,
					// attributes: {
					// 	"class": "table-cell",
					// 	style: "text-align: center;"
					// }                        					
				},
				{
					"field": "jeniskelamin",
					"title": "<h3 align=center>Jenis Kelamin Produk<h3>",
					"width": "60px",
					// "filterable": false,
					// attributes: {
					// 	"class": "table-cell",
					// 	// style: "text-align: center;"
					// }   
				},
				{
					"command":
					[
						{
							text:"Edit",
							click:editMaster,
							imageClass:"k-icon k-i-pencil",
							className:"btn-enabled",
						},
						{
							text:"Hapus",
							click:hapusMaster,
							imageClass:"k-icon k-i-delete",
							className:"btn-disabled",
						},
						
					],
					title:"Command",
						width:"180px",

				}
				// {
				// 	"field": "statusenabled",
				// 	"title": "<h3 align=center>Status Enabled<h3>",
				// 	"width": "45px",
				// 	"filterable": false,
				// 	attributes: {
				// 		"class": "table-cell",
				// 		// style: "text-align: center;"
				// 	}					
				// },
				// {
				// 	"field": "namaproduk",
				// 	"title": "<h3 align=center>Nama Produk<h3>",
				// 	"width": "300px",
				// 	"filterable": false,
				// 	attributes: {
				// 		"class": "table-cell",
				// 		// style: "text-align: center;"
				// 	}					
				// },
				// {
				// 	"field": "kdproduk",
				// 	"title": "<h3 align=center>Kd Produk<h3>",
				// 	"width": "100px",
				// 	"filterable": false,
				// 	attributes: {
				// 		"class": "table-cell",
				// 		// style: "text-align: center;"
				// 	}					
				// },
				// {
				// 	"field": "kdbarcode",
				// 	"title": "<h3 align=center>kd Barcode<h3>",
				// 	"width": "100px",
				// 	"filterable": false,
				// 	attributes: {
				// 		"class": "table-cell",
				// 		// style: "text-align: center;"
				// 	}				
				// },
				// {
				// 	"field": "detailjenisproduk",
				// 	"title": "<h3 align=center>Detail Jenis<h3>",
				// 	"width": "150px",
				// 	"filterable": false,
				// 	attributes: {
				// 		"class": "table-cell",
				// 		// style: "text-align: center;"
				// 	},
				// 	filterable: { multi: true, search: true, required: true, dataSource: $scope.dataSource },					
				// },
				// {
				// 	"command": [
				// 		{ text: "Enable", click: enableData, imageClass: "k-icon k-i-pencil", className: "btn-enabled", },
				// 		{ text: "Disable", click: disableData, imageClass: "k-icon k-delete", className: "btn-disabled", },
				// 	],
				// 	title: "<h3 align=center>Command<h3>",
				// 	width: "180px",
				// }				
			];
			function editMaster(e){
				e.preventDefault()
				var dataItem= this.dataItem($(e.currentTarget).closest("tr"));				
				$scope.id_kelamin=dataItem.id
				$scope.popUp.kelamin=dataItem.jeniskelamin
				$scope.popUps.center().open()
			}
			
			function hapusMaster(){

			}



            $scope.columnMasterKelamin= {
				pageable: true,
				columns: $scope.columnProduk,
				editable: "popup",
				selectable: "row",
				scrollable: false,
				
				
				toolbar: [
                    "excel",
                    {
                        name: "add", text: "Tambah",
						template: '<button ng-click="Tambah()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah</button>'
					
                    }

                ],
                excel: {
                    fileName: "MasterProduk.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    
                    sheet.name = "Master Produk";

                    
                }				
			};
            $scope.Tambah= function(){
				$scope.id_kelamin=undefined
                $scope.popUps.center().open();
            }
            $scope.save = function () {
                var id = ''
				if($scope.id_kelamin !=undefined){
					id = $scope.id_kelamin
				}

				if($scope.popUp.kelamin == undefined){
					toastr.error('Nama Jenis Kelamin harus diisi')
					return
				}

                var data={
                    id:id,
                    jeniskelamin:$scope.popUp.kelamin
                }
				
            

				var objSave = {
					data:data
				}
				
				medifirstService.post('sysadmin/save-kelamin', objSave).then(function () {
					loadData()
				})

			}
                    }
        
             
        ]);
});

