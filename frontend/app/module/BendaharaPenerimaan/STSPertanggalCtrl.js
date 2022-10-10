define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('STSPertanggalCtrl', ['$scope', 'DateHelper', '$http', '$state', 'MedifirstService',
        function ($scope, dateHelper, $http, $state, medifirstService) {
            //Inisial Variable   
            $scope.isRouteLoading = false;
            $scope.item = {};
            $scope.now = new Date();
            $scope.date = new Date();
            $scope.dataSelected = {};
            $scope.item.jmlRows = 50;
            FormLoad();

            $scope.showAndHide = function () {
                $('#contentPencarian').fadeToggle("fast", "linear");
            }

            $scope.monthUngkul = {
                start: "year",
                depth: "year"
            }
            $scope.yearUngkul = {
                start: "decade",
                depth: "decade"
            }

            $scope.listStatusBayar = [
                { id: 1, names: "Tunai" },
                { id: 2, names: "Transfer"},
                { id: 3, names: "Manual"},
                { id: 3, names: "Tunai & Transfer"},
            ];

            function init() {
                $scope.isRouteLoading = true;

                var bayar = "";
                if ($scope.item.statusBayar != undefined) {
                    bayar = $scope.item.statusBayar.id
                }

                var bulan = moment($scope.item.bulan).format('MM');
				var tahun = moment($scope.item.tahun).format('YYYY');
                let thun = tahun.toString();
                let bul=bulan.toString();
                var nosts = '';
                if($scope.item.nosts != undefined){
                    nosts = '&nosts=' + $scope.item.nosts
                }
                // var tgl = moment($scope.tanggal).format('DD/MM/YYYY');
                medifirstService.get('bendaharapenerimaan/get-sts-pertanggal?bulan='+ bul + "&tahun="+ thun
                + "&bayar="+ bayar + nosts
                    , true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        
                        $scope.dataGrid = new kendo.data.DataSource({
                            data: dat.data.detail,
                            group: $scope.group,
                            pageSize: 100,
                            total: dat.data.detail.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                        jumlahjiwa: { type: "number" },
                                    }
                                }
                            },
                            aggregate: [
                                { field: 'jumlahjiwa', aggregate: 'sum' },
                            ]
                        });
                    });
            }

            function FormLoad() {
            }

            $scope.ClearData = function () {
                $scope.item.tglAwal = moment($scope.now).format('YYYY-MM-DD 00:00');
                $scope.item.tglAkhir = moment($scope.now).format('YYYY-MM-DD 23:59');
                $scope.item.namaProduk = undefined;
            }

            $scope.cariFilter = function () {
                init();
            }

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('YYYY-MM-DD');
            }

            var HttpClient = function () {
                this.get = function (aUrl, aCallback) {
                    var anHttpRequest = new XMLHttpRequest();
                    anHttpRequest.onreadystatechange = function () {
                        if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                            aCallback(anHttpRequest.responseText);
                    }

                    anHttpRequest.open("GET", aUrl, true);
                    anHttpRequest.send(null);
                }
            }

            $scope.group = [
            ];
            

            $scope.columnGrid = {
                toolbar: [
                    "excel",                    
                ],
                excel: { fileName: "STSPertanggal.xlsx", allPages: true, },                
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    var bulan = moment($scope.item.bulan).format('MM');
				    var tahun = moment($scope.item.tahun).format('YYYY');
                    sheet.frozenRows = 0;
                    sheet.mergedCells = ["A1:AT1"];
                    sheet.name = "STSPertanggal";
                    var myHeaders = [{
                        value: "STS Pertanggal " + bulan + " "+tahun,
                        fontSize: 14,
                        textAlign: "center",
                        background: "#ffffff",
                    }];
                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 40 });

                },
                sortable: true,
                selectable: true,
                pageable: true,
                columns: [
                    {
                        
                        "field": "tanggal",
                        "title": "Tanggal",
                        "width": "100px",
                    },
                    {
                        
                        "field": "jumlahjiwa",
                        "title": "Periksa Dokter Jiwa",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahjiwa #', 'Rp.')}}</span>",
                        aggregates: ["sum"],
                        template: "#: jumlahjiwa  #",
                        groupFooterTemplate: "#: data.jumlahjiwa.sum  #",
                        footerTemplate: "#: data.jumlahjiwa.sum  #"
                    },
                    {
                        
                        "field": "jumlahnapza",
                        "title": "Periksa Dokter NAPZA",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahnapza #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahperiksadokterumum",
                        "title": "Periksa Dokter Umum",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahperiksadokterumum #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahperiksadoktergigi",
                        "title": "Periksa Dokter Gigi",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahperiksadoktergigi #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahperiksadokterpenydalam",
                        "title": "Periksa Dokter Penyakit Dalam",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahperiksadokterpenydalam #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahperiksadokteranak",
                        "title": "Periksa Dokter Anak",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahperiksadokteranak #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahperiksadoktersyaraf",
                        "title": "Periksa Dokter Syaraf",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahperiksadoktersyaraf #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahperiksadokterelektromedik",
                        "title": "Periksa Dokter Elektromedik",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahperiksadokterelektromedik #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahperiksadokterigd",
                        "title": "Periksa Dokter IGD",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahperiksadokterigd #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahdipam",
                        "title": "DIPAM",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahdipam #', 'Rp.')}}</span>",
                        "width": "100px",
                    },
                    {
                        
                        "field": "jumlahtmpoli",
                        "title": "TM Poli",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahtmpoli #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahtmigd",
                        "title": "TM IGD",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahtmigd #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahtmgigi",
                        "title": "TM Gigi",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahtmgigi #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahobatrajal",
                        "title": "Obat Rajal",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahobatrajal #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahkir",
                        "title": "KIR",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahkir #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahpsikolog",
                        "title": "Psikologi",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahpsikolog #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahlab",
                        "title": "Laboratorium",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahlab #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahtmelektromedik",
                        "title": "Elektromedik",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahtmelektromedik #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahfisio",
                        "title": "Fisiotherapy",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahfisio #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahradio",
                        "title": "Radiologi",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahradio #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahdiklat",
                        "title": "Diklat",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahdiklat #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahvip",
                        "title": "VIP",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahvip #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahkelas1",
                        "title": "Kelas I",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahkelas1 #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahkelasuppi",
                        "title": "UPPI",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahkelasuppi #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahkelas2",
                        "title": "Kelas II",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahkelas2 #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahkelas3",
                        "title": "Kelas III",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahkelas3 #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahobatranap",
                        "title": "Obat Ranap",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahobatranap #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahtmranap",
                        "title": "TM Ranap",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahtmranap #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahvisite",
                        "title": "Visite",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahvisite #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahrehabmental",
                        "title": "Rehab Mental",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahrehabmental #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahjenazah",
                        "title": "Perawatan Jenazah",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahjenazah #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahlegalisir",
                        "title": "Legalisir",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahlegalisir #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahgedungterapi",
                        "title": "Sewa Gedung Terapi",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahgedungterapi #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahsewalapangan",
                        "title": "Sewa Sewa Lapangan",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahsewalapangan #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahgedungdiklat",
                        "title": "Sewa Gedung Diklat",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahgedungdiklat #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahgrhasiainn",
                        "title": "Sewa Grhasia Inn",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahgrhasiainn #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahpertanian",
                        "title": "Sewa Lahan Pertanian",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahpertanian #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahkalandra",
                        "title": "Sewa Kalandra",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahkalandra #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahsewatempatfc",
                        "title": "Sewa Tempat Fotokopi",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahsewatempatfc #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahmanekin",
                        "title": "Sewa Manekin",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahmanekin #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahsewaambulan",
                        "title": "Sewa Ambulan",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahsewaambulan #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahketerampilan",
                        "title": "Work Therapy",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahketerampilan #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahparkir",
                        "title": "Parkir",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahparkir #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahlainlain",
                        "title": "Lain-Lain",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahlainlain #', 'Rp.')}}</span>",
                    },
                    {
                        
                        "field": "jumlahtotal",
                        "title": "Jumlah",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: jumlahtotal #', 'Rp.')}}</span>",
                    },
                ]
            };


            $scope.formatRupiah = function (value, currency) {
                return currency + " " + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            }
            //////////////////////////////////////////////////////////////          END             /////////////////////////////////////////////////////////////////////////////////////       
        }
    ]);
});