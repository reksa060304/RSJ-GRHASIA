define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('MasterUnitPenginputCtrl', ['$q', '$rootScope', '$scope', '$state', '$timeout', 'ModelItem', 'MedifirstService',
        function ($q, $rootScope, $scope, $state, $timeout, modelItem, medifirstService) {
          
            $scope.unitpenginput = {
                dataSource: {
                    data: []
                },
                
                pageable: true,
                columns: [{
                        "field": "unitpenginput",
                        "title": "Unit Penginput",
                        
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
                editable: "popup",
                save: function (e) {
                    $scope.Save(e.model);
                }
            };

            
            $q.all([
                medifirstService.get('sdm/get-combo-jadwal')
            ]).then(function (res) {
                $scope.listKelompokShift = res[0].data.shiftkerja;
                $scope.refresh();
            });
            $scope.refresh = function () {
                $scope.item = undefined;
                $scope.items = {};
                var grid = $("#unitpenginput").data("kendoGrid"),
                    listData = [];
                medifirstService.get("sdm/get-nama-pelatihan", true).then(function (dat) {
                    //var filteredData = _.filter(dat.data.data, function(o) { 
                    //    return o.statusEnabled == true; 
                    //});
                    for (var i = 0; i < dat.data.unitpenginput.length; i++) {
                        listData.push({
                            "id": dat.data.unitpenginput[i].id,
                            "unitpenginput": dat.data.unitpenginput[i].unitpenginput,
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

            $scope.save = function (data) {
                var data = {
                    "id": "xyz",
                    "namaexternal": $scope.item.unitpenginput,
                    "reportdisplay": $scope.item.unitpenginput,
                    "unitpenginput": $scope.item.unitpenginput,

                }
                // return 
                medifirstService.post("sdm/save-up-pelatihan", data).then(function (e) {
                    $scope.refresh();
                });
            }
            $scope.Save = function (data) {
                var data = {
                    "id": data.id ? data.id : "xyz",
                    "namaexternal": data.unitpenginput,
                    "reportdisplay": data.unitpenginput,
                    "unitpenginput": data.unitpenginput,
                    
                }
                // return 
                medifirstService.post("sdm/save-up-pelatihan", data).then(function (e) {
                    $scope.refresh();
                });
            }
            $scope.Batal = function () {
                $scope.item = undefined;
            }

       
            $scope.resetFilters = function () {
                var gridData = $("#unitpenginput").data("kendoGrid");
                gridData.dataSource.filter({});
                $scope.items = {};
            }

            function deleteRow(e) {
                e.preventDefault();

                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                var datasend = {
                    "a": 'okee',
                    "idd": dataItem.id
                };
                console.log(datasend.statusenabled);
                medifirstService.post("sdm/save-up-pelatihan", datasend).then(function (e) {
                    $scope.refresh();
                });
            }
        }
    ])
});
