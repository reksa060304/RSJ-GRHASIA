define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('RL31KegiatanRawatInapCtrl', ['CacheHelper', '$q', '$rootScope', '$scope', 'MedifirstService', 'ModelItem', 'DateHelper',
        function (cacheHelper, $q, $rootScope, $scope, medifirstService, ModelItem, DateHelper) {
            //Inisial Variable 
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};
            $scope.isRouteLoading = false;
            $scope.item.tglawal = $scope.now;

            $scope.CariData = function () {
                LoadData()
            }
            function LoadData() {

                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglawal).format('YYYY');

                // var idDiagnosaAwal = "";
                // if ($scope.item.diagnosa1 != undefined) {
                //     idDiagnosaAwal = "&idDiagnosaAwal=" + $scope.item.diagnosa1.kddiagnosa;
                // }
                // var idDiagnosaAkhir = "";
                // if ($scope.item.diagnosa2 != undefined) {
                //     idDiagnosaAkhir = "&idDiagnosaAkhir=" + $scope.item.diagnosa2.kddiagnosa;
                // }


              medifirstService.get("registrasi/laporan/get-laporan-rl31?"
                    + "tglAwal=" + tglAwal

                ).then(function (dat) {
                    var datas = dat.data.data
                    var subtotaljumlahpasienawal = 0;
                    var subtotaljumlahpasienmasuk = 0;
                    var subtotaljumlahpasienhidup = 0;
                    var subtotaljumlahpasienkurang = 0;
                    var subtotaljumlahpasienlebih = 0;
                    var subtotaljumlahlamadirawat = 0;
                    var subtotaljumlahpasienakhir = 0;
                    var subtotaljumlahhariperawatan = 0;
                    var subtotaljumlahvvip = 0;
                    var subtotaljumlahvip = 0;
                    var subtotaljumlahsatu = 0;
                    var subtotaljumlahdua = 0;
                    var subtotaljumlahtiga = 0;
                    var subtotaljumlahkhusus = 0;

                    var totaljumlahpasienawal = 0;
                    var totaljumlahpasienmasuk = 0;
                    var totaljumlahpasienhidup = 0;
                    var totaljumlahpasienkurang = 0;
                    var totaljumlahpasienlebih = 0;
                    var totaljumlahlamadirawat = 0;
                    var totaljumlahpasienakhir = 0;
                    var totaljumlahhariperawatan = 0;
                    var totaljumlahvvip = 0;
                    var totaljumlahvip = 0;
                    var totaljumlahsatu = 0;
                    var totaljumlahdua = 0;
                    var totaljumlahtiga = 0;
                    var totaljumlahkhusus = 0;
                    
                    for (var i = 0; i < datas.length; i++) {
                        datas[i].no = i + 1;
                        datas[i].kdprov = '24';
                        datas[i].kode = '3404022';
                        datas[i].year = new Date(tglAwal).getFullYear();

                        if(i != 31){
                            subtotaljumlahpasienawal = datas[i].jumlahpasienawal;
                            subtotaljumlahpasienmasuk += datas[i].jumlahpasienmasuk ;
                            subtotaljumlahpasienhidup += datas[i].jumlahpasienhidup ;
                            subtotaljumlahpasienkurang += datas[i].jumlahpasienkurang ;
                            subtotaljumlahpasienlebih += datas[i].jumlahpasienlebih ;
                            subtotaljumlahlamadirawat += datas[i].jumlahlamadirawat ;
                            subtotaljumlahpasienakhir += datas[i].jumlahpasienakhir ;
                            subtotaljumlahhariperawatan += datas[i].jumlahhariperawatan ;
                            subtotaljumlahvvip += datas[i].jumlahvvip ;
                            subtotaljumlahvip += datas[i].jumlahvip ;
                            subtotaljumlahsatu += datas[i].jumlahsatu ;
                            subtotaljumlahdua += datas[i].jumlahdua ;
                            subtotaljumlahtiga += datas[i].jumlahtiga ;
                            subtotaljumlahkhusus += datas[i].jumlahkhusus ;
                        }

                            totaljumlahpasienawal = datas[i].jumlahpasienawal;
                            totaljumlahpasienmasuk += datas[i].jumlahpasienmasuk ;
                            totaljumlahpasienhidup += datas[i].jumlahpasienhidup ;
                            totaljumlahpasienkurang += datas[i].jumlahpasienkurang ;
                            totaljumlahpasienlebih += datas[i].jumlahpasienlebih ;
                            totaljumlahlamadirawat += datas[i].jumlahlamadirawat ;
                            totaljumlahpasienakhir += datas[i].jumlahpasienakhir ;
                            totaljumlahhariperawatan += datas[i].jumlahhariperawatan ;
                            totaljumlahvvip += datas[i].jumlahvvip ;
                            totaljumlahvip += datas[i].jumlahvip ;
                            totaljumlahsatu += datas[i].jumlahsatu ;
                            totaljumlahdua += datas[i].jumlahdua ;
                            totaljumlahtiga += datas[i].jumlahtiga ;
                            totaljumlahkhusus += datas[i].jumlahkhusus ;
                    }
                    console.log(datas);
                    $scope.isRouteLoading = false;

                    datas[30].jumlahpasienawal = subtotaljumlahpasienawal
                    datas[30].jumlahpasienmasuk = subtotaljumlahpasienmasuk
                    datas[30].jumlahpasienhidup = subtotaljumlahpasienhidup
                    datas[30].jumlahpasienkurang = subtotaljumlahpasienkurang
                    datas[30].jumlahpasienlebih = subtotaljumlahpasienlebih
                    datas[30].jumlahlamadirawat = subtotaljumlahlamadirawat
                    datas[30].jumlahpasienakhir = subtotaljumlahpasienakhir
                    datas[30].jumlahhariperawatan = subtotaljumlahhariperawatan
                    datas[30].jumlahvvip = subtotaljumlahvvip
                    datas[30].jumlahvip = subtotaljumlahvip
                    datas[30].jumlahsatu = subtotaljumlahsatu
                    datas[30].jumlahdua = subtotaljumlahdua
                    datas[30].jumlahtiga = subtotaljumlahtiga
                    datas[30].jumlahkhusus = subtotaljumlahkhusus

                    datas[32].jumlahpasienawal = totaljumlahpasienawal
                    datas[32].jumlahpasienmasuk = totaljumlahpasienmasuk
                    datas[32].jumlahpasienhidup = totaljumlahpasienhidup
                    datas[32].jumlahpasienkurang = totaljumlahpasienkurang
                    datas[32].jumlahpasienlebih = totaljumlahpasienlebih
                    datas[32].jumlahlamadirawat = totaljumlahlamadirawat
                    datas[32].jumlahpasienakhir = totaljumlahpasienakhir
                    datas[32].jumlahhariperawatan = totaljumlahhariperawatan
                    datas[32].jumlahvvip = totaljumlahvvip
                    datas[32].jumlahvip = totaljumlahvip
                    datas[32].jumlahsatu = totaljumlahsatu
                    datas[32].jumlahdua = totaljumlahdua
                    datas[32].jumlahtiga = totaljumlahtiga
                    datas[32].jumlahkhusus = totaljumlahkhusus

                    datas[30].no = 77;
                    datas[31].no = 88;
                    datas[32].no = 99;

                    $scope.sourceLaporan = new kendo.data.DataSource({

                        data: datas,
                        group: $scope.group,
                        pageSize: 10,
                        total: datas.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                }
                            }
                        }
                    });

                    $scope.dataExcel = datas;
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




            // $scope.group = {
            //     field: "pendudukdki",
            //     aggregates: [{
            //         field: "pendudukdki",
            //         aggregate: "count"
            //     }, {
            //         field: "pendudukdki",
            //         aggregate: "count"
            //     }]
            // };
            // $scope.aggregate = [{
            //     field: "pendudukdki",
            //     aggregate: "count"
            // }, {
            //     field: "pendudukdki",
            //     aggregate: "count"
            // }]
            // var record = 0;
            $("#kGrid").kendoGrid({
                toolbar: ["excel"],
                // , "pdf"],

                excel: {
                    fileName: "RL31RawatInap.xlsx",
                    allPages: true,

                },
                // pdf: {
                //     fileName: "LaporanPasienMasuk.pdf",
                //     allPages: true,
                // },

                dataSource: $scope.dataExcel,
                sortable: true,
                // reorderable: true,
                // filterable: true,
                pageable: true,
                // groupable: true,
                // columnMenu: true,
                // resizable: true,
                excelExport: function (e) {
                    var rows = e.workbook.sheets[0].rows;
                    var sheet = e.workbook.sheets[0];
                    // rows.unshift({
                    //     cells: [{ value: "DATA KEADAAN MORBIDITAS PASIEN RAWAT INAP", background: "#fffff" }]
                    // });
                    var columns = e.workbook.sheets[0].columns;
                    delete columns[0].width;
                    columns[0].width = 10;  //0 1 2 4 5 6 
                    delete columns[1].width;
                    columns[1].width = 15;
                    delete columns[2].width;
                    columns[2].width = 15;
                    delete columns[3].width;
                    columns[3].width = 15;
                    delete columns[4].width;
                    columns[4].width = 10;
                    delete columns[5].width;
                    columns[5].width = 5;

                    for(let i = 6; i <= 20; i++){
                        delete columns[i].width;
                        columns[i].width = 30;
                    }

                    // for(let i = 0; i < 1; i++){
                    //     for(let j = 0; j <= 17; j++){
                    //         sheet.rows[i].cells[j].background = '#ffffff';
                    //         sheet.rows[i].cells[j].color = '#000000';
                    //         sheet.rows[i].cells[j].textAlign = 'center';
                    //     }
                    //     sheet.rows[0].height = 50;
                    // }

                    sheet.rows[0].cells[0].background = '#6fde78';
                    sheet.rows[0].cells[0].color = '#000000'; 
                    sheet.rows[0].cells[1].background = '#6fde78'; 
                    sheet.rows[0].cells[1].color = '#000000'; 
                    sheet.rows[0].cells[2].background = '#6fde78'; 
                    sheet.rows[0].cells[2].color = '#000000'; 
                    sheet.rows[0].cells[3].background = '#6fde78'; 
                    sheet.rows[0].cells[3].color = '#000000'; 
                    sheet.rows[0].cells[4].background = '#6fde78'; 
                    sheet.rows[0].cells[4].color = '#000000'; 
                    sheet.rows[0].cells[5].background = '#6fde78'; 
                    sheet.rows[0].cells[5].color = '#000000'; 
                    sheet.rows[0].cells[6].background = '#6fde78'; 
                    sheet.rows[0].cells[6].color = '#000000'; 
                    sheet.rows[0].cells[7].background = '#6fde78'; 
                    sheet.rows[0].cells[7].color = '#000000';
                    sheet.rows[0].cells[8].background = '#6fde78'; 
                    sheet.rows[0].cells[8].color = '#000000';
                    sheet.rows[0].cells[9].background = '#6fde78'; 
                    sheet.rows[0].cells[9].color = '#000000';
                    sheet.rows[0].cells[10].background = '#6fde78'; 
                    sheet.rows[0].cells[10].color = '#000000'; 
                    sheet.rows[0].cells[11].background = '#6fde78'; 
                    sheet.rows[0].cells[11].color = '#000000'; 
                    sheet.rows[0].cells[12].background = '#6fde78'; 
                    sheet.rows[0].cells[12].color = '#000000';
                    sheet.rows[0].cells[13].background = '#6fde78'; 
                    sheet.rows[0].cells[13].color = '#000000'; 
                    sheet.rows[0].cells[14].background = '#6fde78'; 
                    sheet.rows[0].cells[14].color = '#000000';
                    
                    sheet.rows[1].cells[0].background = '#6fde78'; 
                    sheet.rows[1].cells[0].color = '#000000';
                    sheet.rows[1].cells[1].background = '#6fde78'; 
                    sheet.rows[1].cells[1].color = '#000000';
                    sheet.rows[1].cells[2].background = '#6fde78'; 
                    sheet.rows[1].cells[2].color = '#000000';
                    sheet.rows[1].cells[3].background = '#6fde78'; 
                    sheet.rows[1].cells[3].color = '#000000';
                    sheet.rows[1].cells[4].background = '#6fde78'; 
                    sheet.rows[1].cells[4].color = '#000000';
                    sheet.rows[1].cells[5].background = '#6fde78'; 
                    sheet.rows[1].cells[5].color = '#000000';
                    sheet.rows[1].cells[6].background = '#6fde78'; 
                    sheet.rows[1].cells[6].color = '#000000';
                    sheet.rows[1].cells[7].background = '#6fde78'; 
                    sheet.rows[1].cells[7].color = '#000000';
                    
                   
                },
                columns: [
                    {
                        field: "kode",
                        title: "KODE RS",
                    },
                    {
                        field: "kdprov",
                        title: "KODE PROPINSI",
                    },
                    {
                        field: "namakota",
                        title: "KAB / KOTA",
                    },
                    {
                        field: "namars",
                        title: "NAMA RS",
                    },
                    {
                        field: "year",
                        title: "TAHUN",
                    },
                    {
                        field: "no",
                        title: "NO",
                    },
                    {
                        field: "pelayanan",
                        title: "JENIS PELAYANAN",
                    },
                    {
                        field: "jumlahpasienawal",
                        title: "PASIEN AWAL TAHUN",
                    },
                    {
                        field: "jumlahpasienmasuk",
                        title: "PASIEN MASUK",
                    },
                    {
                        field: "jumlahpasienhidup",
                        title: "PASIEN KELUAR HIDUP",
                    },
                    {
                        "title": "PASIEN KELUAR MATI",
                        
                        columns: [
                            {
                                field: "jumlahpasienkurang",
                                title: "< 48 JAM",
                            },
                            {
                                field: "jumlahpasienlebih",
                                title: ">= 48 JAM",
                            },
                        ],
                    },
                    {
                        field: "jumlahlamadirawat",
                        title: "JUMLAH LAMA DIRAWAT",
                    },
                    {
                        field: "jumlahpasienakhir",
                        title: "PASIEN AKHIR TAHUN",
                    },
                    {
                        field: "jumlahhariperawatan",
                        title: "JUMLAH HARI PERAWATAN",
                    },
                    {
                        "title": "RINCIAN HARI PERAWATAN PER KELAS",
                        
                        columns: [
                            {
                                field: "jumlahvvip",
                                title: "VVIP",
                            },
                            {
                                field: "jumlahvip",
                                title: "VIP",
                            },
                            {
                                field: "jumlahsatu",
                                title: "I",
                            },
                            {
                                field: "jumlahdua",
                                title: "II",
                            },
                            {
                                field: "jumlahtiga",
                                title: "III",
                            },
                            {
                                field: "jumlahkhusus",
                                title: "KELAS KHUSUS",
                            }
                        ],
                    },
                    

                ]

            });
            $scope.Perbaharui = function () {
                $scope.ClearSearch();
            }



            // modelItemAkuntansi.getDataTableTransaksi("laporan/get-data-combo-rm", true,true,10).then(function (dat) {
            //      $scope.listDiagnosa = dat.diagnosa;
            //   $scope.item.diganosas = {id:$scope.listDiagnosa[0].id,kddiagnosa:$scope.listDiagnosa[0].kddiagnosa}
            //  });
            //fungsi clear kriteria search
            $scope.ClearSearch = function () {
                $scope.item = {};
                $scope.item.tglawal = $scope.now;
                $scope.item.tglakhir = $scope.now;

            }



        }
    ]);
});