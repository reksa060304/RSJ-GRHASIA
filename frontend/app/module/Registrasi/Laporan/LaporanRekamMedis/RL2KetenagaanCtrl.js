define(['initialize'], function (initialize) {
    'use strict'
    initialize.controller('RL2KetenagaanCtrl', ['CacheHelper', '$scope', 'MedifirstService', 'DateHelper',
        function (cacheHelper, $scope, medifirstService, DateHelper) {

            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};
            $scope.isRouteLoading = false;
            $scope.item.tglawal = $scope.now;
            LoadData()

            function LoadData() {
                $scope.isRouteLoading = true;
                

               medifirstService.get("registrasi/laporan/get-laporan-rl2"
                ).then(function (data) {
                    var data = data.data
                    var a = 0
                    var b = 0
                    var c = 0
                    var d = 0
                    var e = 0
                    var f = 0
                    var g = 0
                    var h = 0
                    var j = 0
                    var k = 0
                    var l = 0
                    var m = 0

                    var total1a = 0
                    var total1b = 0
                    var total1c = 0
                    var total1d = 0
                    var total1e = 0
                    var total1f = 0

                    var total2a = 0
                    var total2b = 0
                    var total2c = 0
                    var total2d = 0
                    var total2e = 0
                    var total2f = 0

                    var total3a = 0
                    var total3b = 0
                    var total3c = 0
                    var total3d = 0
                    var total3e = 0
                    var total3f = 0

                    var total4a = 0
                    var total4b = 0
                    var total4c = 0
                    var total4d = 0
                    var total4e = 0
                    var total4f = 0

                    var total5a = 0
                    var total5b = 0
                    var total5c = 0
                    var total5d = 0
                    var total5e = 0
                    var total5f = 0

                    var total6a = 0
                    var total6b = 0
                    var total6c = 0
                    var total6d = 0
                    var total6e = 0
                    var total6f = 0

                    var total7a = 0
                    var total7b = 0
                    var total7c = 0
                    var total7d = 0
                    var total7e = 0
                    var total7f = 0

                    var total8a = 0
                    var total8b = 0
                    var total8c = 0
                    var total8d = 0
                    var total8e = 0
                    var total8f = 0

                    var total9a = 0
                    var total9b = 0
                    var total9c = 0
                    var total9d = 0
                    var total9e = 0
                    var total9f = 0

                    var total10a = 0
                    var total10b = 0
                    var total10c = 0
                    var total10d = 0
                    var total10e = 0
                    var total10f = 0

                    var total11a = 0
                    var total11b = 0
                    var total11c = 0
                    var total11d = 0
                    var total11e = 0
                    var total11f = 0

                    var total12a = 0
                    var total12b = 0
                    var total12c = 0
                    var total12d = 0
                    var total12e = 0
                    var total12f = 0
                    data.data[1].no = '1'
                    data.data[36].no = '1 99'
                    data.data[37].no = '1 66'
                    data.data[38].no = '1 77'
                    data.data[39].no = '1 88'
                    data.data[40].no = '2'
                    data.data[53].no = '2 99'
                    data.data[54].no = '3'
                    data.data[65].no = '3 99'
                    data.data[66].no = '4'
                    data.data[80].no = '4 99'
                    data.data[81].no = '5'
                    data.data[89].no = '5 99'
                    data.data[90].no = '6'
                    data.data[98].no = '6 99'
                    data.data[99].no = '7'
                    data.data[123].no = '7 99'
                    data.data[125].no = '8'
                    data.data[137].no = '8 99'
                    data.data[138].no = '9'
                    data.data[151].no = '9 99'
                    data.data[152].no = '10'
                    data.data[164].no = '10 99'
                    data.data[165].no = '11'
                    data.data[177].no = '11 99'
                    data.data[178].no = '12'
                    data.data[187].no = '12 99'
                    console.log(data.data.length)
                    for(var i = 0; i < data.data.length; i++){
                        data.data[i].koders = '3404022';
                        data.data[i].kdprov = '24';
                        data.data[i].kabkota = 'Kab. Sleman';
                        data.data[i].tahun = moment($scope.now).format('YYYY');

                        if(i >= 2 && i <= 35){
                            a++
                            total1a += parseInt(data.data[i].keadaanl)
                            total1b += parseInt(data.data[i].keadaanp)
                            total1c += parseInt(data.data[i].kebutuhanl)
                            total1d += parseInt(data.data[i].kebutuhanp)
                            total1e += parseInt(data.data[i].kekuranganl)
                            total1f += parseInt(data.data[i].kekuranganp)
                            data.data[i].no = '1 ' + a
                        } else if(i >= 41 && i <= 52){
                            b++
                            total2a += parseInt(data.data[i].keadaanl)
                            total2b += parseInt(data.data[i].keadaanp)
                            total2c += parseInt(data.data[i].kebutuhanl)
                            total2d += parseInt(data.data[i].kebutuhanp)
                            total2e += parseInt(data.data[i].kekuranganl)
                            total2f += parseInt(data.data[i].kekuranganp)
                            if(i == 52){
                                data.data[i].no = '2 88'
                            } else{
                                data.data[i].no = '2 ' + b
                            }
                            
                        } else if(i >= 55 && i <= 64){
                            c++
                            total3a += parseInt(data.data[i].keadaanl)
                            total3b += parseInt(data.data[i].keadaanp)
                            total3c += parseInt(data.data[i].kebutuhanl)
                            total3d += parseInt(data.data[i].kebutuhanp)
                            total3e += parseInt(data.data[i].kekuranganl)
                            total3f += parseInt(data.data[i].kekuranganp)
                            if(i == 64){
                                data.data[i].no = '3 88'
                            } else{
                                data.data[i].no = '3 ' + c
                            }
                        } else if(i >= 67 && i <= 79){
                            d++
                            total4a += parseInt(data.data[i].keadaanl)
                            total4b += parseInt(data.data[i].keadaanp)
                            total4c += parseInt(data.data[i].kebutuhanl)
                            total4d += parseInt(data.data[i].kebutuhanp)
                            total4e += parseInt(data.data[i].kekuranganl)
                            total4f += parseInt(data.data[i].kekuranganp)
                            if(i == 79){
                                data.data[i].no = '4 88'
                            } else{
                                data.data[i].no = '4 ' + d
                            }
                        } else if(i >= 82 && i <= 88){
                            e++
                            total5a += parseInt(data.data[i].keadaanl)
                            total5b += parseInt(data.data[i].keadaanp)
                            total5c += parseInt(data.data[i].kebutuhanl)
                            total5d += parseInt(data.data[i].kebutuhanp)
                            total5e += parseInt(data.data[i].kekuranganl)
                            total5f += parseInt(data.data[i].kekuranganp)
                            if(i == 88){
                                data.data[i].no = '5 88'
                            } else{
                                data.data[i].no = '5 ' + e
                            }
                        } else if(i >= 91 && i <= 97){
                            f++
                            total6a += parseInt(data.data[i].keadaanl)
                            total6b += parseInt(data.data[i].keadaanp)
                            total6c += parseInt(data.data[i].kebutuhanl)
                            total6d += parseInt(data.data[i].kebutuhanp)
                            total6e += parseInt(data.data[i].kekuranganl)
                            total6f += parseInt(data.data[i].kekuranganp)
                            if(i == 97){
                                data.data[i].no = '6 88'
                            } else{
                                data.data[i].no = '6 ' + f
                            }
                        } else if(i >= 100 && i <= 122){
                            g++
                            total7a += parseInt(data.data[i].keadaanl)
                            total7b += parseInt(data.data[i].keadaanp)
                            total7c += parseInt(data.data[i].kebutuhanl)
                            total7d += parseInt(data.data[i].kebutuhanp)
                            total7e += parseInt(data.data[i].kekuranganl)
                            total7f += parseInt(data.data[i].kekuranganp)
                            if(i == 122){
                                data.data[i].no = '7 88'
                            } else{
                                data.data[i].no = '7 ' + g
                            }
                        } else if(i >= 126 && i <= 136){
                            h++
                            total8a += parseInt(data.data[i].keadaanl)
                            total8b += parseInt(data.data[i].keadaanp)
                            total8c += parseInt(data.data[i].kebutuhanl)
                            total8d += parseInt(data.data[i].kebutuhanp)
                            total8e += parseInt(data.data[i].kekuranganl)
                            total8f += parseInt(data.data[i].kekuranganp)
                            if(i == 136){
                                data.data[i].no = '8 88'
                            } else{
                                data.data[i].no = '8 ' + h
                            }
                        } else if(i >= 139 && i <= 150){
                            j++
                            total9a += parseInt(data.data[i].keadaanl)
                            total9b += parseInt(data.data[i].keadaanp)
                            total9c += parseInt(data.data[i].kebutuhanl)
                            total9d += parseInt(data.data[i].kebutuhanp)
                            total9e += parseInt(data.data[i].kekuranganl)
                            total9f += parseInt(data.data[i].kekuranganp)
                            if(i == 150){
                                data.data[i].no = '9 88'
                            } else{
                                data.data[i].no = '9 ' + j
                            }
                        } else if(i >= 153 && i <= 163){
                            k++
                            total10a += parseInt(data.data[i].keadaanl)
                            total10b += parseInt(data.data[i].keadaanp)
                            total10c += parseInt(data.data[i].kebutuhanl)
                            total10d += parseInt(data.data[i].kebutuhanp)
                            total10e += parseInt(data.data[i].kekuranganl)
                            total10f += parseInt(data.data[i].kekuranganp)
                            if(i == 163){
                                data.data[i].no = '10 88'
                            } else{
                                data.data[i].no = '10 ' + k
                            }
                        } else if(i >= 166 && i <= 176){
                            l++
                            total11a += parseInt(data.data[i].keadaanl)
                            total11b += parseInt(data.data[i].keadaanp)
                            total11c += parseInt(data.data[i].kebutuhanl)
                            total11d += parseInt(data.data[i].kebutuhanp)
                            total11e += parseInt(data.data[i].kekuranganl)
                            total11f += parseInt(data.data[i].kekuranganp)
                            if(i == 176){
                                data.data[i].no = '11 88'
                            } else{
                                data.data[i].no = '11 ' + l
                            }
                        } else if(i >= 178 && i <= 186){
                            m++
                            total12a += parseInt(data.data[i].keadaanl)
                            total12b += parseInt(data.data[i].keadaanp)
                            total12c += parseInt(data.data[i].kebutuhanl)
                            total12d += parseInt(data.data[i].kebutuhanp)
                            total12e += parseInt(data.data[i].kekuranganl)
                            total12f += parseInt(data.data[i].kekuranganp)
                            if(i == 186){
                                data.data[i].no = '12 88'
                            } else{
                                data.data[i].no = '12 ' + m
                            }
                        }
                    }

                    data.data[36].keadaanl = total1a
                    data.data[36].keadaanp = total1b
                    data.data[36].kebuthanl = total1c
                    data.data[36].kebuthanp = total1d
                    data.data[36].kekuranganl = total1e
                    data.data[36].kekuranganp = total1f

                    data.data[53].keadaanl = total2a
                    data.data[53].keadaanp = total2b
                    data.data[53].kebuthanl = total2c
                    data.data[53].kebuthanp = total2d
                    data.data[53].kekuranganl = total2e
                    data.data[53].kekuranganp = total2f

                    data.data[65].keadaanl = total3a
                    data.data[65].keadaanp = total3b
                    data.data[65].kebuthanl = total3c
                    data.data[65].kebuthanp = total3d
                    data.data[65].kekuranganl = total3e
                    data.data[65].kekuranganp = total3f

                    data.data[80].keadaanl = total4a
                    data.data[80].keadaanp = total4b
                    data.data[80].kebuthanl = total4c
                    data.data[80].kebuthanp = total4d
                    data.data[80].kekuranganl = total4e
                    data.data[80].kekuranganp = total4f

                    data.data[89].keadaanl = total5a
                    data.data[89].keadaanp = total5b
                    data.data[89].kebuthanl = total5c
                    data.data[89].kebuthanp = total5d
                    data.data[89].kekuranganl = total5e
                    data.data[89].kekuranganp = total5f

                    data.data[98].keadaanl = total6a
                    data.data[98].keadaanp = total6b
                    data.data[98].kebuthanl = total6c
                    data.data[98].kebuthanp = total6d
                    data.data[98].kekuranganl = total6e
                    data.data[98].kekuranganp = total6f

                    data.data[123].keadaanl = total7a
                    data.data[123].keadaanp = total7b
                    data.data[123].kebuthanl = total7c
                    data.data[123].kebuthanp = total7d
                    data.data[123].kekuranganl = total7e
                    data.data[123].kekuranganp = total7f

                    data.data[137].keadaanl = total8a
                    data.data[137].keadaanp = total8b
                    data.data[137].kebuthanl = total8c
                    data.data[137].kebuthanp = total8d
                    data.data[137].kekuranganl = total8e
                    data.data[137].kekuranganp = total8f

                    data.data[151].keadaanl = total9a
                    data.data[151].keadaanp = total9b
                    data.data[151].kebuthanl = total9c
                    data.data[151].kebuthanp = total9d
                    data.data[151].kekuranganl = total9e
                    data.data[151].kekuranganp = total9f

                    data.data[164].keadaanl = total10a
                    data.data[164].keadaanp = total10b
                    data.data[164].kebuthanl = total10c
                    data.data[164].kebuthanp = total10d
                    data.data[164].kekuranganl = total10e
                    data.data[164].kekuranganp = total10f

                    data.data[177].keadaanl = total11a
                    data.data[177].keadaanp = total11b
                    data.data[177].kebuthanl = total11c
                    data.data[177].kebuthanp = total11d
                    data.data[177].kekuranganl = total11e
                    data.data[177].kekuranganp = total11f

                    data.data[187].keadaanl = total12a
                    data.data[187].keadaanp = total12b
                    data.data[187].kebuthanl = total12c
                    data.data[187].kebuthanp = total12d
                    data.data[187].kekuranganl = total12e
                    data.data[187].kekuranganp = total12f
                    console.log(data.data);

                    $scope.isRouteLoading = false;
                    $scope.sourceLaporan = new kendo.data.DataSource({
                        data: data.data,
                        group: $scope.group,
                        pageSize: 188,
                        total: data.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {}
                            }
                        }
                    });
                    $scope.dataExcel = data.data;
                })
            }


            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY HH:mm');
            }
            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $("#kGrid").kendoGrid({
                toolbar: ["excel"],
                // , "pdf"],

                excel: {
                    fileName: "RL1.3_TempatTidur.xlsx",
                    allPages: true,

                },
                // pdf: {
                //     fileName: "LaporanPasienMasuk.pdf",
                //     allPages: true,
                // },

                dataSource: $scope.dataExcel,
                sortable: true,
                scrollable: false,
                // reorderable: true,
                // filterable: true,
                pageable: true,
                // groupable: true,
                // columnMenu: true,
                // resizable: true,
                excelExport: function (e) {
                    var columns = e.workbook.sheets[0].columns;
                    var sheet = e.workbook.sheets[0];
                    for(var i = 0; i < e.workbook.sheets[0].columns.length; i++){
                        delete columns[i].width;
                        columns[i].width = 200;
                    }

                    for (var i = 0; i < 1; i++) {
                        var $row = e.workbook.sheets[0].rows[i];
                        for (var j = 0; j < $row.cells.length; j++) {
                            var $cell = $row.cells[j];
                            $cell["borderTop"] = { color: "#000000", size: 2 };
                            $cell["borderRight"] = { color: "#000000", size: 2 };
                            $cell["borderBottom"] = { color: "#000000", size: 2 };
                            $cell["borderLeft"] = { color: "#000000", size: 2 };
                        }
                        console.log(e.workbook.sheets[0].rows.length);
                        console.log(e.workbook.sheets[0].rows[i].cells.length);
                    }

                    // sheet.rows[0].cells[0].background = '#6fde78';
                    // sheet.rows[0].cells[0].color = '#000000'; 
                    // sheet.rows[0].cells[1].background = '#6fde78'; 
                    // sheet.rows[0].cells[1].color = '#000000'; 
                    // sheet.rows[0].cells[2].background = '#6fde78'; 
                    // sheet.rows[0].cells[2].color = '#000000'; 
                    // sheet.rows[0].cells[3].background = '#6fde78'; 
                    // sheet.rows[0].cells[3].color = '#000000'; 
                    // sheet.rows[0].cells[4].background = '#6fde78'; 
                    // sheet.rows[0].cells[4].color = '#000000'; 
                    // sheet.rows[0].cells[5].background = '#6fde78'; 
                    // sheet.rows[0].cells[5].color = '#000000'; 
                    // sheet.rows[0].cells[6].background = '#6fde78'; 
                    // sheet.rows[0].cells[6].color = '#000000'; 
                    // sheet.rows[0].cells[7].background = '#6fde78'; 
                    // sheet.rows[0].cells[7].color = '#000000';
                    // sheet.rows[0].cells[8].background = '#6fde78'; 
                    // sheet.rows[0].cells[8].color = '#000000';
                    // sheet.rows[0].cells[9].background = '#6fde78'; 
                    // sheet.rows[0].cells[9].color = '#000000';
                    // sheet.rows[0].cells[10].background = '#6fde78'; 
                    // sheet.rows[0].cells[10].color = '#000000'; 
                    // sheet.rows[0].cells[11].background = '#6fde78'; 
                    // sheet.rows[0].cells[11].color = '#000000'; 
                },
                columns: [
                    // {
                    //     field: "no",
                    //     title: "NO",
                    //     Template: "<span class='style-center'>#: no #</span>",
                    //     width: "40px"
                    // },
                    {
                        field: "koders",
                        title: "Kode RS",
                        headerAttributes: {
                            style: "text-align : center"
                        },
                    },
                    {
                        field: "kdprov",
                        title: "Kode Propinsi",
                        headerAttributes: {
                            style: "text-align : center"
                        },
                    },
                    {
                        field: "kabkota",
                        title: "Kab / Kota",
                        headerAttributes: {
                            style: "text-align : center"
                        },
                    },
                    {
                        field: "tahun",
                        title: "Tahun",
                        headerAttributes: {
                            style: "text-align : center"
                        },
                        rows: [{
                            cells: [{
                                value: "Border",
                                borderTop: {
                                    color: "#ff0000",
                                    size: 3
                                }
                            }]
                        }]

                    },
                    {
                        field: "no",
                        title: "NO KODE",
                        headerAttributes: {
                            style: "text-align : center"
                        },
                    },
                    {
                        field: "pendidikanpegawai",
                        title: "KUALIFIKASI PENDIDIKAN",
                        headerAttributes: {
                            style: "text-align : center"
                        },
                    },
                    {
                        "title": "KEADAAN",
                        columns: [
                            {
                                field: "keadaanl",
                                title: "Laki-Laki",
                            },
                            {
                                field: "keadaanp",
                                title: "Perempuan",
                            },
                        ],
                    }, 
                    {
                        "title": "KEBUTUHAN",
                        columns: [
                            {
                                field: "kebutuhanl",
                                title: "Laki-Laki",
                            },
                            {
                                field: "kebutuhanp",
                                title: "Perempuan",
                            },
                        ],
                    }, 
                    {
                        "title": "KEKURANGAN",
                        columns: [
                            {
                                field: "kekuranganl",
                                title: "Laki-Laki",
                            },
                            {
                                field: "kekuranganp",
                                title: "Perempuan",
                            },
                        ],
                    }, 

                ]
            });
            $scope.Perbaharui = function () {
                $scope.ClearSearch();
            }
            $scope.ClearSearch = function () {
                $scope.item = {};
                $scope.item.tglawal = $scope.now;
                $scope.item.tglakhir = $scope.now;

            }

        }
    ]);
});