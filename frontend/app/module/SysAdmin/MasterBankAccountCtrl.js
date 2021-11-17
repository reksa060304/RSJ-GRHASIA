define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('MasterBankAccountCtrl', ['$q', '$scope', 'MedifirstService', '$timeout',
		function ($q, $scope, medifirstService, $timeout) {
			$scope.isRouteLoading = true;
			medifirstService.get('sysadmin/general/get-rekanan-all').then(function (e) {
				$scope.listRekanan = e.data
			})
			function rekananDropdownn(container, options) {
				$('<input style="width:240px" name="' + options.field + '"/>')
					.appendTo(container)
					.kendoDropDownList({
						dataTextField: "namarekanan",
						dataValueField: "id",
						dataSource: $scope.listRekanan,
						filter: "contains"
					});
			}
			$scope.daftarMasterOpt = {
				toolbar: [{
					name: "create", text: "Input Baru"
				}],
				pageable: true,
				scrollable: true,
				columns: [
					{ field: "bankaccountnama", title: "Nama Bank" },
					{ field: "bankaccountnomor", title: "Nomor Akun" },
					{ field: "keteranganlainnya", title: "Keterangan" },
					{
						field: "rekanan", title: "Rekanan",
						editor: rekananDropdownn,
						"template": "# if (rekanan.id != null) {# #= rekanan.namarekanan # #} else {# #= '-' # #}#"
					},
					// { field: "Status", title: "Status Enabled" },
					{ command: [{ name: "destroy", text: "Disable" }, { name: "edit", text: "Edit" }], title: "&nbsp;", width: 200 }
				],
				editable: "popup",
				save: function (e) {
					$scope.Save(e.model);
				},
				edit: function (e) {
					e.sender.columns.forEach(function (element, index /*, array */) {
						if (element.hideMe) {
							e.container.find(".k-edit-label:eq(" + index + "), "
								+ ".k-edit-field:eq( " + index + ")"
							).hide();
						}
					});
				}
			};
			init();

			function init() {
				$scope.item = {}; // set defined object
				$q.all([
					medifirstService.get("sysadmin/general/get-bank-account", true),
				]).then(function (res) {
					if (res[0].statResponse) {
						for (let z = 0; z < res[0].data.data.length; z++) {
							const dataz = res[0].data.data[z]
							dataz.rekanan = { id: dataz.kdrekananfk, namarekanan: dataz.namarekanan }
						}
						$scope.dataSource = new kendo.data.DataSource({
							data: res[0].data.data,
							sort: {
								field: "bankaccountnama",
								dir: "asc"
							},
							pageSize: 20,
							schema: {
								model: {
									id: "id",
									fields: {
										id: { editable: false },
										rekanan: { editable: true },
										bankaccountnama: {
											editable: true,
											validation: {
												validasikelompoktransaksi: function (input) {
													if (input.is("[name='bankaccountnama']") && input.val() === "") {
														return false;
													}
													return true;
												}
											}
										},
										bankaccountnomor: {
											editable: true,
											validation: {
												validasinomor: function (input) {
													if (input.is("[name='bankaccountnomor']") && input.val() === "") {
														return false;
													}
													return true;
												}
											}
										},

									}
								}
							},
							change: function (e) {

								// if (e.field == "jenisJabatanId" && e.action == "itemchange") {
								// 	e.items[0].jenisJabatanId = e.items[0].jenisJabatanId.id ? e.items[0].jenisJabatanId.id : e.items[0].jenisJabatanId;
								// }
								if (e.action === "remove") {
									var item = e.items[0];
									if (item.bankaccountnama !== "" && item.id !== "") {
										item.action = e.action;
										item.rekanan = item.rekanan != undefined ? item.rekanan.id : item.rekanan.id;

										$scope.Save(item);
									} else {
										$scope.dataSource.sync(); // call sync function to auto update row number w/o click on grid
									}
								}
							}
						});
					}

					$scope.isRouteLoading = false;
				}, (error) => {
					$scope.isRouteLoading = false;
					throw error;
				})
			};

			$scope.Save = function (data) {
		
				let idrekan = ''
				if(data.rekanan!=undefined) {
					if(data.rekanan.id !=undefined) {
						idrekan=data.rekanan.id
					}else{
						idrekan =data.rekanan
					}
					if(idrekan.hasOwnProperty('id')){
						idrekan = idrekan.id
					}
				}
				var item = {
					id: data.id,
					statusenabled: true,
					bankaccountnomor: data.bankaccountnomor,
					bankaccountnama: data.bankaccountnama,
					keteranganlainnya: data.keteranganlainnya,
					rekanan: idrekan
				}
				if (data.action && data.action === "remove") item.statusenabled = false
				medifirstService.post('sysadmin/general/save-bank-account', item).then(function (e) {
					// delete $scope.item;
					// $scope.item = {};
					init();
				});
			};

			var timeoutPromise;
			$scope.$watch('item.jenisTransaksi', function (newVal, oldVal) {
				$timeout.cancel(timeoutPromise);
				timeoutPromise = $timeout(function () {
					if (newVal != oldVal) {
						applyFilter("bankaccountnama", newVal)
					}
				}, 500)
			})
			function applyFilter(filterField, filterValue) {
				var dataGrid = $("#gridMaster").data("kendoGrid");
				var currFilterObject = dataGrid.dataSource.filter();
				var currentFilters = currFilterObject ? currFilterObject.filters : [];

				if (currentFilters && currentFilters.length > 0) {
					for (var i = 0; i < currentFilters.length; i++) {
						if (currentFilters[i].field == filterField) {
							currentFilters.splice(i, 1);
							break;
						}
					}
				}

				if (filterValue.id) {
					currentFilters.push({
						field: filterField,
						operator: "eq",
						value: filterValue.id
					});
				} else {
					currentFilters.push({
						field: filterField,
						operator: "contains",
						value: filterValue
					})
				}

				dataGrid.dataSource.filter({
					logic: "and",
					filters: currentFilters
				})
			}
			$scope.resetFilter = function () {
				var dataGrid = $("#gridMaster").data("kendoGrid");
				dataGrid.dataSource.filter({});
				$scope.item = {};
			}
			//** BATAS SUCI */
		}
	]);
});