define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('RL12KetersediaanPelayananCtrl', ['CacheHelper', '$q', '$rootScope', '$scope', 'MedifirstService', 'ModelItem', 'DateHelper',
        function (cacheHelper, $q, $rootScope, $scope, medifirstService, ModelItem, DateHelper) {
            //Inisial Variable 
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};
            $scope.isRouteLoading = false;
            $scope.item.obj = [];

            LoadData()

            $scope.CariData = function () {
                LoadData()
            }
            function LoadData() {

                $scope.isRouteLoading = true;

                medifirstService.get("registrasi/laporan/get-laporan-rl12-junkis-new"
                ).then(function (data) {
                    var data = data.data

                    $scope.listData1 = [];
                    $scope.listData2 = [];
                    $scope.listData3 = [];
                    $scope.listData4 = [];
                    $scope.listData5 = [];
                    $scope.listData6 = [];
                    $scope.listData7 = [];
                    $scope.listData8 = [];
                    $scope.listData9 = [];
                    $scope.listData10 = [];
                    $scope.listData11 = [];
                    $scope.listData12 = [];
                    $scope.listData13 = [];
                    $scope.listData14 = [];
                    $scope.listData15 = [];
                    $scope.listData16 = [];
                    $scope.listData17 = [];
                    $scope.listData18 = [];
                    $scope.listData19 = [];
                    $scope.listData20 = [];
                    $scope.listData21 = [];
                    $scope.listData22 = [];
                    $scope.listData23 = [];
                    $scope.listData24 = [];
                    $scope.listData25 = [];
                    $scope.listData26 = [];
                    $scope.listData27 = [];
                    $scope.listData28 = [];
                    $scope.listData29 = [];
                    $scope.listData30 = [];
                    $scope.listData31 = [];
                    $scope.listData32 = [];
                    $scope.listData33 = [];
                    $scope.listData34 = [];
                    $scope.listData35 = [];
                    
                    for (var i = 0; i < data.data.length; i++) {
                        data.data[i].no = i + 1
                        data.data[i].jenis = `${data.data[i].jenisid}. ${data.data[i].jenis}`
                        data.data[i].typedetail = "checkbox"
                        if (data.data[i].status == true) {
                            data.data[i].statusck = "✔"
                        } else {
                            data.data[i].statusck = "✘"
                        }

                        if (data.data[i].jenisid == 1) {
                            $scope.listData1.push(data.data[i]);
                        } else if (data.data[i].jenisid == 2) {
                            $scope.listData2.push(data.data[i]);
                        } else if (data.data[i].jenisid == 3) {
                            $scope.listData3.push(data.data[i]);
                        } else if (data.data[i].jenisid == 4) {
                            $scope.listData4.push(data.data[i]);
                        } else if (data.data[i].jenisid == 5) {
                            $scope.listData5.push(data.data[i]);
                        } else if (data.data[i].jenisid == 6) {
                            $scope.listData6.push(data.data[i]);
                        } else if (data.data[i].jenisid == 7) {
                            $scope.listData7.push(data.data[i]);
                        } else if (data.data[i].jenisid == 8) {
                            $scope.listData8.push(data.data[i]);
                        } else if (data.data[i].jenisid == 9) {
                            $scope.listData9.push(data.data[i]);
                        } else if (data.data[i].jenisid == 10) {
                            $scope.listData10.push(data.data[i]);
                        } else if (data.data[i].jenisid == 11) {
                            $scope.listData11.push(data.data[i]);
                        } else if (data.data[i].jenisid == 12) {
                            $scope.listData12.push(data.data[i]);
                        } else if (data.data[i].jenisid == 13) {
                            $scope.listData13.push(data.data[i]);
                        } else if (data.data[i].jenisid == 14) {
                            $scope.listData14.push(data.data[i]);
                        } else if (data.data[i].jenisid == 15) {
                            $scope.listData15.push(data.data[i]);
                        } else if (data.data[i].jenisid == 16) {
                            $scope.listData16.push(data.data[i]);
                        } else if (data.data[i].jenisid == 17) {
                            $scope.listData17.push(data.data[i]);
                        } else if (data.data[i].jenisid == 18) {
                            $scope.listData18.push(data.data[i]);
                        } else if (data.data[i].jenisid == 19) {
                            $scope.listData19.push(data.data[i]);
                        } else if (data.data[i].jenisid == 20) {
                            $scope.listData20.push(data.data[i]);
                        } else if (data.data[i].jenisid == 21) {
                            $scope.listData21.push(data.data[i]);
                        } else if (data.data[i].jenisid == 22) {
                            $scope.listData22.push(data.data[i]);
                        } else if (data.data[i].jenisid == 23) {
                            $scope.listData23.push(data.data[i]);
                        } else if (data.data[i].jenisid == 24) {
                            $scope.listData24.push(data.data[i]);
                        } else if (data.data[i].jenisid == 25) {
                            $scope.listData25.push(data.data[i]);
                        } else if (data.data[i].jenisid == 26) {
                            $scope.listData26.push(data.data[i]);
                        } else if (data.data[i].jenisid == 27) {
                            $scope.listData27.push(data.data[i]);
                        } else if (data.data[i].jenisid == 28) {
                            $scope.listData28.push(data.data[i]);
                        } else if (data.data[i].jenisid == 29) {
                            $scope.listData29.push(data.data[i]);
                        } else if (data.data[i].jenisid == 30) {
                            $scope.listData30.push(data.data[i]);
                        } else if (data.data[i].jenisid == 31) {
                            $scope.listData31.push(data.data[i]);
                        } else if (data.data[i].jenisid == 32) {
                            $scope.listData32.push(data.data[i]);
                        } else if (data.data[i].jenisid == 33) {
                            $scope.listData33.push(data.data[i]);
                        } else if (data.data[i].jenisid == 34) {
                            $scope.listData34.push(data.data[i]);
                        } else if (data.data[i].jenisid == 35) {
                            $scope.listData35.push(data.data[i]);
                        }
                    }

                    $scope.isRouteLoading = false;

                    $scope.sourceLaporan = new kendo.data.DataSource({
                        data: data.data,
                        group: $scope.group,
                        // pageSize: 10,
                        total: data.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                }
                            }
                        }
                    });

                    $scope.dataExcel = data.data;
                })
            }

            $scope.click = function (dataPasienSelected) {
                var data = dataPasienSelected;

            };
            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY HH:mm');
            }
            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.group = {
                field: "jenis"
            };

            $("#kGrid").kendoGrid({
                toolbar: ["excel"],
                excel: {
                    fileName: "RL11.xlsx",
                    allPages: true,
                },

                dataSource: $scope.dataExcel,
                sortable: true,
                reorderable: true,
                filterable: true,
                pageable: true,
                groupable: true,
                columnMenu: true,
                resizable: true,
                excelExport: function (e) {
                    var rows = e.workbook.sheets[0].rows;
                    rows.unshift({
                        cells: [{ value: "Formulis RL 1.1", background: "#fffff" }]

                    });
                },
                columns: [
                    {
                        field: "no",
                        title: "NO",
                        Template: "<span class='style-center'>#: no #</span>",
                        width: "10%",

                    },
                    {
                        field: "deskripsi",
                        title: "Keterangan",
                        width: "60%",
                        template: "<span class='style-center'>#: deskripsi #</span>",
                    },
                    {
                        field: "statusck",
                        title: "Status",
                        width: "30%",
                        template: "<span class='style-center'>#: statusck #</span>"
                    }
                ]
            });

            $scope.simpan = function () {
                $scope.isRouteLoading = true;

                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    // if ($scope.item.obj[parseInt(arrobj[i])] instanceof Date)
                    //     $scope.item.obj[parseInt(arrobj[i])] = moment($scope.item.obj[parseInt(arrobj[i])]).format('YYYY-MM-DD HH:mm')
                    arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])] })
                }

                var jsonSave = {
                    data: arrSave,
                }

                medifirstService.post('registrasi/laporan/savedatarl12-junkis-new', jsonSave).then(function (e) {
                    if (e.data.status == 201) {
                        $scope.popupDetail.close()
                        LoadData()
                    }
                    $scope.isRouteLoading = false;
                });
            }

            $scope.ubahData = function () {
                $scope.popupDetail.center().open()
                var dataTable = $scope.sourceLaporan._pristineData;
                console.log('dfdfd', dataTable);
                
                if (dataTable.length > 0) {
                    for (let index = 0; index < dataTable.length; index++) {
                        const element = dataTable[index];
                        $scope.item.obj[element.id] = element.status
                    }
                }
            }

            $scope.tutup = function () {
                $scope.popupDetail.close()
            }

            // batas bawah
        }
    ]);
});