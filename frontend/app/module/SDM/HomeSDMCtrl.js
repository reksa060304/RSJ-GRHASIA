define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('HomeSDMCtrl', ['CacheHelper', '$scope', 'MedifirstService', 'DateHelper', function (cacheHelper, $scope, medifirstService, DateHelper){
        // $scope.jumlahpns = 0;

        loadData()
        $scope.formatRupiah = function (value, currency) {
            return currency + "Rp. " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
        }
        $scope.formatTanggal = function (tanggal) {
            return moment(tanggal).format('DD-MMM-YYYY');
        }
        function loadData(){
            medifirstService.get('sdm/home-dashboard').then(function(data){
                var datas = data.data
                $scope.dataDetail = datas
                $scope.jumlahpns = datas.jumlahpns[0].jumlahpns
                $scope.jumlahpnslaki = datas.jumlahpnslaki[0].jumlahpns
                $scope.jumlahpnsperempuan = datas.jumlahpnsperempuan[0].jumlahpns

                $scope.jumlahp3k = datas.jumlahp3k[0].jumlahp3k
                $scope.jumlahp3klaki = datas.jumlahp3klaki[0].jumlahp3k
                $scope.jumlahp3kperempuan = datas.jumlahp3kperempuan[0].jumlahp3k

                $scope.jumlahnaban = datas.jumlahnaban[0].jumlahnaban
                $scope.jumlahnabanlaki = datas.jumlahnabanlaki[0].jumlahnaban
                $scope.jumlahnabanperempuan = datas.jumlahnabanperempuan[0].jumlahnaban

                $scope.jumlahblud = datas.jumlahblud[0].jumlahblud
                $scope.jumlahbludlaki = datas.jumlahbludlaki[0].jumlahblud
                $scope.jumlahbludperempuan = datas.jumlahbludperempuan[0].jumlahblud

                $scope.jumlahos = datas.jumlahos[0].jumlahos
                $scope.jumlahoslaki = datas.jumlahoslaki[0].jumlahos
                $scope.jumlahosperempuan = datas.jumlahosperempuan[0].jumlahos

                $scope.penjagaankgb = datas.penjagaankgb[0].count
                if ($scope.penjagaankgb > 0){
                    toastr.warning('Kenaikan Gaji Berkala ' + $scope.penjagaankgb)
                }
                for (let i = 0; i < datas.penjagaankgbd.length; i++) {
                    datas.penjagaankgbd[i].no = i + 1
                }
                $scope.sourceKGB = new kendo.data.DataSource({
                    data: datas.penjagaankgbd,
                    pageSize: 10,
                    total: datas.penjagaankgbd.length,
                    serverPaging: false,
                    schema: {
                        model: {
                            fields: {}
                        }
                    }
                });

                $scope.penjagaanstr = datas.penjagaanstrd.length
                if ($scope.penjagaanstr>0) {
                    toastr.warning('Surat Tanda Registrasi ' + $scope.penjagaanstr)
                }
                for (let i = 0; i < datas.penjagaanstrd.length; i++) {
                    datas.penjagaanstrd[i].no = i + 1
                }
                $scope.sourceSTR = new kendo.data.DataSource({
                    data: datas.penjagaanstrd,
                    pageSize: 10,
                    total: datas.penjagaanstrd.length,
                    serverPaging: false,
                    schema: {
                        model: {
                            fields: {}
                        }
                    }
                });

                $scope.penjagaanpensiun = datas.penjagaanpensiun.length
                if ($scope.penjagaanpensiun>0) {
                    toastr.warning('Pegawai Pensiun ' + $scope.penjagaanpensiun)
                }
                for (let i = 0; i < datas.penjagaanpensiun.length; i++) {
                    datas.penjagaanpensiun[i].no = i + 1
                }
                $scope.sourcePensiun = new kendo.data.DataSource({
                    data: datas.penjagaanpensiun,
                    pageSize: 10,
                    total: datas.penjagaanpensiun.length,
                    serverPaging: false,
                    schema: {
                        model: {
                            fields: {}
                        }
                    }
                });
            })
        }

        $scope.penjagaan = function(data){
            if(data =='KGB'){
                $scope.KGB = true
                $scope.STR = false
                $scope.Pensiun = false
            }
            if(data =='STR'){
                $scope.KGB = false
                $scope.STR = true
                $scope.Pensiun = false
            }
            if (data == 'Pensiun') {
                $scope.KGB = false
                $scope.STR = false
                $scope.Pensiun = true
            }
        }
        $scope.columnKGB = {

            // toolbar: ["excel"],
            // excel: {
            //     fileName: "InformasiJabatanStrukturalPegawai" + moment($scope.now).format('DD/MMM/YYYY'),
            //     allPages: true,
            // },
            selectable: 'row',
            pageable: true,
            columns: [{
                    "field": "no",
                    "title": "No",
                    "width": "30px",
                },
                {
                    "field": "nippns",
                    "title": "NIP",
                    "width": "120px"
                },
                {
                    "field": "namalengkap",
                    "title": "Nama",
                    "width": "100px"
                },
                {
                    "field": "tgllahir",
                    "title": "Tanggal Lahir",
                    "width": "87px",
                    "template": "<span class='style-left'>{{formatTanggal('#: tgllahir #')}}</span>"
                },
                {
                    "field": "golongan",
                    "title": "Pangkat & Golongan",
                    "width": "100px"
                },
                {
                    "field": "gajiakhir",
                    "title": "Gaji Berkala Terakhir",
                    "width": "100px",
                    "template": "<span class='style-right'>{{formatRupiah('#: gajiakhir #', '')}}</span>"
                },
                // {
                //     "field": "tmtberikutnya",
                //     "title": "TMT Kenaikan Pangkat Golongan Terakhir",
                //     "width": "100px"
                // },
                {
                    "field": "tgltmt",
                    "title": "TMT KGB Terakhir",
                    "width": "100px",
                    "template": "<span class='style-left'>{{formatTanggal('#: tgltmt #')}}</span>"
                },
                {
                    "field": "tmtberikutnya",
                    "title": "TMT KGB Berikutnya",
                    "width": "100px",
                    "template": "<span class='style-left'>{{formatTanggal('#: tmtberikutnya #')}}</span>"

                }
            ]
        };


        $scope.columnSTR = {

            // toolbar: ["excel"],
            // excel: {
            //     fileName: "InformasiJabatanStrukturalPegawai" + moment($scope.now).format('DD/MMM/YYYY'),
            //     allPages: true,
            // },
            selectable: 'row',
            pageable: true,
            columns: [{
                    "field": "no",
                    "title": "No",
                    "width": "30px",
                },
                {
                    "field": "nippns",
                    "title": "NIP",
                    "width": "120px"
                },
                {
                    "field": "namalengkap",
                    "title": "Nama",
                    "width": "100px"
                },
                {
                    "field": "tgllahir",
                    "title": "Tanggal Lahir",
                    "width": "87px",
                    "template": "<span class='style-left'>{{formatTanggal('#: tgllahir #')}}</span>"
                },
                {
                    "field": "golongan",
                    "title": "Pangkat & Golongan",
                    "width": "100px"
                },
                // {
                //     "field": "tmtberikutnya",
                //     "title": "TMT Kenaikan Pangkat Golongan Terakhir",
                //     "width": "100px"
                // },
                {
                    "field": "berakhirstr",
                    "title": "STR Berakhir",
                    "width": "100px",
                    "template": "<span class='style-left'>{{formatTanggal('#: berakhirstr #')}}</span>"
                },
                
            ]
        };

        $scope.columnPensiun = {

            // toolbar: ["excel"],
            // excel: {
            //     fileName: "InformasiJabatanStrukturalPegawai" + moment($scope.now).format('DD/MMM/YYYY'),
            //     allPages: true,
            // },
            selectable: 'row',
            pageable: true,
            columns: [{
                    "field": "no",
                    "title": "No",
                    "width": "30px",
                },
                {
                    "field": "nippns",
                    "title": "NIP",
                    "width": "120px"
                },
                {
                    "field": "namalengkap",
                    "title": "Nama",
                    "width": "100px"
                },
                {
                    "field": "golongan",
                    "title": "Pangkat & Golongan",
                    "width": "100px"
                },
                {
                    "field": "tgllahir",
                    "title": "Tanggal Lahir",
                    "width": "87px",
                    "template": "<span class='style-left'>{{formatTanggal('#: tgllahir #')}}</span>"
                },
                {
                    "field": "tglpensiun",
                    "title": "Tanggal Pensiun",
                    "width": "100px",
                    "template": "<span class='style-left'>{{formatTanggal('#: tglpensiun #')}}</span>"

                },
                

            ]
        };
        $scope.columnDetail = {

            // toolbar: ["excel"],
            // excel: {
            //     fileName: "InformasiJabatanStrukturalPegawai" + moment($scope.now).format('DD/MMM/YYYY'),
            //     allPages: true,
            // },
            selectable: 'row',
            pageable: true,
            columns: [{
                    "field": "no",
                    "title": "No",
                    "width": "30px",
                },
                {
                    "field": "nippns",
                    "title": "NIP",
                    "width": "120px"
                },
                {
                    "field": "namalengkap",
                    "title": "Nama",
                    "width": "100px"
                },
                {
                    "field": "jeniskelamin",
                    "title": "Jenis Kelamin",
                    "width": "80px"
                },
                {
                    "field": "golongan",
                    "title": "Pangkat & Golongan",
                    "width": "100px"
                },
                {
                    "field": "namajabatan",
                    "title": "Pangkat & Golongan",
                    "width": "100px"
                },
                


            ]
        };
        $scope.dataaaaaaa = false
        $scope.DataDetail = function (data) {
            $scope.dataaaaaaa = true
            if(data == 'pns'){
                $scope.sourceDetail = new kendo.data.DataSource({
                    data: $scope.dataDetail.dataPNS,
                    pageSize: 10,
                    total: $scope.dataDetail.dataPNS.length,
                    serverPaging: false,
                    schema: {
                        model: {
                            fields: {}
                        }
                    }
                });
            }
            if (data == 'p3k') {
                $scope.sourceDetail = new kendo.data.DataSource({
                    data: $scope.dataDetail.dataP3K,
                    pageSize: 10,
                    total: $scope.dataDetail.dataP3K.length,
                    serverPaging: false,
                    schema: {
                        model: {
                            fields: {}
                        }
                    }
                });
            }
            if (data == 'naban') {
                $scope.sourceDetail = new kendo.data.DataSource({
                    data: $scope.dataDetail.dataNABAN,
                    pageSize: 10,
                    total: $scope.dataDetail.dataNABAN.length,
                    serverPaging: false,
                    schema: {
                        model: {
                            fields: {}
                        }
                    }
                });
            }
            if (data == 'blud') {
                $scope.sourceDetail = new kendo.data.DataSource({
                    data: $scope.dataDetail.dataBLUD,
                    pageSize: 10,
                    total: $scope.dataDetail.dataBLUD.length,
                    serverPaging: false,
                    schema: {
                        model: {
                            fields: {}
                        }
                    }
                });
            }
            if (data == 'os') {
                $scope.sourceDetail = new kendo.data.DataSource({
                    data: $scope.dataDetail.dataOS,
                    pageSize: 10,
                    total: $scope.dataDetail.dataOS.length,
                    serverPaging: false,
                    schema: {
                        model: {
                            fields: {}
                        }
                    }
                });
            }
        }
    }])
});