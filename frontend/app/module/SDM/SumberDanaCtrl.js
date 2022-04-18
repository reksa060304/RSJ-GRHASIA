define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('SumberDanaCtrl', ['$q', '$rootScope', '$scope', '$state', '$timeout', 'ModelItem', 'MedifirstService',
        function ($q, $rootScope, $scope, $state, $timeout, modelItem, medifirstService) {
            $scope.item = {};
            $scope.dataVOloaded = true;
            $scope.mainGridOptions = {
                dataSource: {
                    data: []
                },
                toolbar: [{
                    name: "create",
                    text: "Tambah"
                }],
                pageable: true,
                columns: [{
                        "field": "sumberdana",
                        "title": "Sumber Dana"
                    },

                    {
                        "command": [{
                            name: "edit",
                            text: "Edit"

                        }, {
                            text: "Hapus",
                            click: deleteRow
                        }],
                        width: 160
                    }
                ],
                selectable: "row",
                editable: "popup",
                save: function (e) {
                    $scope.Save(e.model);
                }
            };
            $q.all([
                medifirstService.get('sdm/get-combo-jadwal')
            ]).then(function (res) {
                $scope.refresh();
            });
            $scope.refresh = function () {
                $scope.items = {};
                var grid = $("#gridDaftarShift").data("kendoGrid"),
                    listData = [];
                medifirstService.get("sdm/get-nama-pelatihan", true).then(function (dat) {
                    //var filteredData = _.filter(dat.data.data, function(o) { 
                    //    return o.statusEnabled == true; 
                    //});
                    for (var i = 0; i < dat.data.sumberdana.length; i++) {
                        listData.push({
                            "id": dat.data.sumberdana[i].id,
                            "sumberdana": dat.data.sumberdana[i].sumberdana,
                        })
                    }

                    var dataSource = new kendo.data.DataSource({
                        pageSize: 20,
                        data: listData,
                        schema: {
                            model: {

                            }
                        }
                    });

                    // reload and bind to grid dataSource
                    grid.setDataSource(dataSource);
                    grid.dataSource.read();
                });

            }
            $scope.addZeroBefore = function (n) {
                return (n < 10 ? '0' : '') + n;
            };

            function dropDownKelompokShift(container, options) {
                $('<input required name="' + options.field + '"/>')
                    .appendTo(container)
                    .kendoDropDownList({
                        dataTextField: "kelompokshiftkerja",
                        dataValueField: "id",
                        dataSource: $scope.listKelompokShift
                    });
            }
            $scope.Save = function (data) {
                console.log(data.id);
                var data = {
                    "id": data.id ? data.id : "xyz",
                    "namaexternal": data.sumberdana,
                    "reportdisplay": data.sumberdana,
                    "sumberdana": data.sumberdana,
                }
                console.log(data.id)
                // return 
                medifirstService.post("sdm/save-sd-pelatihan", data).then(function (e) {
                    $scope.refresh();
                });
            }
            $scope.Batal = function () {
                $scope.item = undefined;
            }
            var timeoutPromise;
            $scope.$watch('items.namaShift', function (newVal, oldVal) {
                $timeout.cancel(timeoutPromise);
                timeoutPromise = $timeout(function () {
                    if (newVal && newVal !== oldVal) {
                        applyFilter('namashift', newVal)
                    }
                }, 800)
            });
            $scope.$watch('items.kodeShift', function (newVal, oldVal) {
                $timeout.cancel(timeoutPromise);
                timeoutPromise = $timeout(function () {
                    if (newVal && newVal !== oldVal) {
                        applyFilter('kodeexternal', newVal)
                    }
                }, 800)
            });

            $scope.$watch('items.kelompokShift', function (newVal, oldVal) {
                $timeout.cancel(timeoutPromise);
                timeoutPromise = $timeout(function () {
                    if (newVal && newVal !== oldVal) {
                        applyFilter('idkelompokshift', newVal)
                    }
                })
            });

            function applyFilter(filterField, filterValue) {
                var gridData = $("#gridDaftarShift").data("kendoGrid");
                var currFilterObj = gridData.dataSource.filter();
                var currentFilters = currFilterObj ? currFilterObj.filters : [];

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
                    });
                }

                gridData.dataSource.filter({
                    logic: "and",
                    filters: currentFilters
                })
            }
            $scope.resetFilters = function () {
                var gridData = $("#gridDaftarShift").data("kendoGrid");
                gridData.dataSource.filter({});
                $scope.items = {};
            }

            function deleteRow(e) {
                e.preventDefault();

                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                var datasend = {
                    "a": 'okee',
                    "id": dataItem.id
                };
                medifirstService.post("sdm/save-sd-pelatihan", datasend).then(function (e) {
                    $scope.refresh();
                });
            }
        }
    ])
});
