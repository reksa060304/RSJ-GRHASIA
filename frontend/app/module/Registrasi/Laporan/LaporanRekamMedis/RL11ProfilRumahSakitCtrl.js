define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('RL11ProfilRumahSakitCtrl', ['CacheHelper', '$q', '$rootScope', '$scope', 'MedifirstService', 'ModelItem', 'DateHelper',
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

                medifirstService.get("registrasi/laporan/get-laporan-rl11"
                ).then(function (data) {
                    var data = data.data

                    $scope.listData1 = [];
                    $scope.listData2 = [];
                    $scope.listData3 = [];
                    $scope.listData4 = [];
                    $scope.listData5 = [];
                    $scope.listData6 = [];
                    
                    for (var i = 0; i < data.data.length; i++) {
                        data.data[i].no = i + 1
                        data.data[i].image != null ? data.data[i].value = data.data[i].image : data.data[i].value = data.data[i].value;
                        data.data[i].value != null ? data.data[i].value = data.data[i].value : data.data[i].value = '-';

                        // load data image

                        if (i == 47) {
                            $scope.fileUpload = data.data[i].value
                        }
                        if (i == 48) {
                            $scope.fileUpload2 = data.data[i].value
                        }
                        if (i == 49) {
                            $scope.fileUpload3 = data.data[i].value
                        }
                        if (i == 50) {
                            $scope.fileUpload4 = data.data[i].value
                        }
                        if (i == 51) {
                            $scope.fileUpload5 = data.data[i].value
                        }

                        // masukkan ke array untuk tampil di html
                        if (i < 16) { //dipatok berdasarkan data per jenis
                            $scope.listData1.push(data.data[i]);
                        } else if (i > 15 && i < 35){
                            $scope.listData2.push(data.data[i]);
                        } else if (i > 34 && i < 47){
                            $scope.listData3.push(data.data[i]);
                        } else if (i > 46 && i < 52){
                            $scope.listData4.push(data.data[i]);
                        } else if (i > 51 && i < 58){
                            $scope.listData5.push(data.data[i]);
                        } else if (i > 57 && i < data.data.length){
                            $scope.listData6.push(data.data[i]);
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
                        width: "30%",
                        template: "<span class='style-center'>#: deskripsi #</span>",
                    },
                    {
                        field: "value",
                        title: "Isi",
                        width: "60%",
                        template: function(dataItem) {
                            if (dataItem.value.includes("data:image")) {
                                return `<img class='style-center' style='width:300px;height:300px;' src='${dataItem.value}'></img>`;
                            } else {
                                return `<span class='style-center'>${dataItem.value}</span>`;
                            }
                        }
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

                medifirstService.post('registrasi/laporan/savedatarl11', jsonSave).then(function (e) {
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
                if (dataTable.length > 0) {
                    for (let index = 0; index < dataTable.length; index++) {
                        const element = dataTable[index];
                        $scope.item.obj[element.detailid] = element.value
                    }
                }
            }

            $scope.tutup = function () {
                $scope.popupDetail.close()
            }

            $scope.onSelect1 = function (e) {
                $("#preview1").empty();
                for (var i = 0; i < e.files.length; i++) {
                    var file = e.files[i].rawFile;

                    if (file) {
                        var reader = new FileReader();
                        reader.onload = function (readerEvt) {
                       //     debugger;
                            var binaryString = readerEvt.target.result;
                    
                            $scope.fileUpload = binaryString;
                            $scope.item.obj[48] = binaryString;
                        }
                        reader.onloadend = function () {
                            $("<img img class=\"gambarAset \">").attr("src", this.result).appendTo($("#preview1"));
                        };

                        reader.readAsDataURL(file);
                    }
                }
            }

            $scope.onSelect2 = function (e) {
                $("#preview2").empty();
                for (var i = 0; i < e.files.length; i++) {
                    var file = e.files[i].rawFile;

                    if (file) {
                        var reader = new FileReader();
                        reader.onload = function (readerEvt) {
                       //     debugger;
                            var binaryString = readerEvt.target.result;
                    
                            $scope.fileUpload2 = binaryString;
                            $scope.item.obj[49] = binaryString;
                        }
                        reader.onloadend = function () {
                            $("<img img class=\"gambarAset \">").attr("src", this.result).appendTo($("#preview2"));
                        };

                        reader.readAsDataURL(file);
                    }
                }
            }

            $scope.onSelect3 = function (e) {
                $("#preview3").empty();
                for (var i = 0; i < e.files.length; i++) {
                    var file = e.files[i].rawFile;

                    if (file) {
                        var reader = new FileReader();
                        reader.onload = function (readerEvt) {
                       //     debugger;
                            var binaryString = readerEvt.target.result;
                    
                            $scope.fileUpload3 = binaryString;
                            $scope.item.obj[50] = binaryString;
                        }
                        reader.onloadend = function () {
                            $("<img img class=\"gambarAset \">").attr("src", this.result).appendTo($("#preview3"));
                        };

                        reader.readAsDataURL(file);
                    }
                }
            }

            $scope.onSelect4 = function (e) {
                $("#preview4").empty();
                for (var i = 0; i < e.files.length; i++) {
                    var file = e.files[i].rawFile;

                    if (file) {
                        var reader = new FileReader();
                        reader.onload = function (readerEvt) {
                       //     debugger;
                            var binaryString = readerEvt.target.result;
                    
                            $scope.fileUploa4 = binaryString;
                            $scope.item.obj[51] = binaryString;
                        }
                        reader.onloadend = function () {
                            $("<img img class=\"gambarAset \">").attr("src", this.result).appendTo($("#preview4"));
                        };

                        reader.readAsDataURL(file);
                    }
                }
            }

            $scope.onSelect5 = function (e) {
                $("#preview5").empty();
                for (var i = 0; i < e.files.length; i++) {
                    var file = e.files[i].rawFile;

                    if (file) {
                        var reader = new FileReader();
                        reader.onload = function (readerEvt) {
                       //     debugger;
                            var binaryString = readerEvt.target.result;
                    
                            $scope.fileUpload5 = binaryString;
                            $scope.item.obj[52] = binaryString;
                        }
                        reader.onloadend = function () {
                            $("<img img class=\"gambarAset \">").attr("src", this.result).appendTo($("#preview5"));
                        };

                        reader.readAsDataURL(file);
                    }
                }
            }

            // batas bawah
        }
    ]);
});