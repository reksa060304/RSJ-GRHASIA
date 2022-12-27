define(['initialize'], function(initialize) {
'use strict';
    initialize.controller('SensusHarianRawatJalanCtrl', ['$scope', 'DateHelper','$http','$state', 'MedifirstService',
        function($scope, dateHelper, $http, $state, medifirstService) {    	
            //Inisial Variable   
            $scope.isRouteLoading = false;
            $scope.item = {};                       
            $scope.now = new Date();
            $scope.date = new Date();
            $scope.item.tglAwal =  moment($scope.now).format('YYYY-MM-DD 00:00');
            $scope.item.tglAkhir = moment($scope.now).format('YYYY-MM-DD 23:59');   
            $scope.dataSelected = {};
            $scope.item.jmlRows = 50;                     
            FormLoad();             

            $scope.showAndHide = function () {
                $('#contentPencarian').fadeToggle("fast", "linear");
            }

            function LoadCombo(){
                medifirstService.get("registrasi/get-datacombo-sensus?", true).then(function (dat) {                                                   
                    $scope.listRuangan = dat.data.ruanganfarmasi;
                    $scope.listDataDokter = dat.data.dokter; 
                    $scope.listKelompokPasien = dat.data.kelompokpasien;                    
                    $scope.namaLengkap = medifirstService.getPegawaiLogin();
                });
            }
            $scope.cekOrderHariIniRanap = function (data) {
                if (data === true) {
                    //$scope.cekBelumVerifs = false;
                    $scope.item.ranap = true;
                } else if (data === false) {
                    //$scope.cekBelumVerifs = true;
                    $scope.item.ranap = undefined;
                } else {
                    return;
                }
            }
            $scope.cekOrderHariIni = function (data) {
                if (data === true) {
                    //$scope.cekBelumVerifs = false;
                    $scope.item.rajal = true;
                } else if (data === false) {
                    //$scope.cekBelumVerifs = true;
                    $scope.item.rajal = undefined;
                } else {
                    return;
                }
            }
            function init() {
                console.log($scope.item.rajal);
                var rajal = "";
                if ($scope.item.rajal != undefined ) {
                    rajal = "&rajal="+$scope.item.rajal;
                }
                var ranap = "";
                if ($scope.item.ranap != undefined) {
                    ranap = "&ranap=" + $scope.item.ranap;
                }
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                
                medifirstService.get("registrasi/laporan/get-data-sensus-harian?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir + rajal+ranap
                    , true).then(function (dat) {
                        var totalpasien = 0;
                        var totaljk = 0;
                        var totalumur = 0;
                        var totalagama = 0;
                        var totalpendidikan = 0;
                        var totalpekerjaan = 0;
                        var totalalamat = 0;

                        $scope.isRouteLoading = false;
                        for (var i = 0; i < dat.data.detail.length; i++) {
                            dat.data.detail[i].no = i + 1;
                            totalpasien = totalpasien + dat.data.detail[i].totalpasien;
                            totaljk = totaljk + dat.data.detail[i].totaljk;
                            totalumur = totalumur + dat.data.detail[i].totalumur;
                            totalagama = totalagama + dat.data.detail[i].totalagama;
                            totalpendidikan = totalpendidikan + dat.data.detail[i].totalpendidikan;
                            totalpekerjaan = totalpekerjaan + dat.data.detail[i].totalpekerjaan;
                            totalalamat = totalalamat + dat.data.detail[i].totalalamat;
                        }
                        $scope.ttlpasien = totalpasien;
                        $scope.ttljk = totaljk;
                        $scope.ttlumur = totalumur;
                        $scope.ttlagama = totalagama;
                        $scope.ttlpendidikan = totalpendidikan;
                        $scope.ttlpekerjaan = totalpekerjaan;
                        $scope.ttlalamat = totalalamat;

                        $scope.dataGrid = new kendo.data.DataSource({
                            data: dat.data.detail,
                            schema: {
                                model: {
                                    fields: {


                                    }
                                }
                            },
                            pageSize: 200,
                            serverPaging: false,
                                aggregate: [
                                    { field: "jmlpasienlama", aggregate: "sum" },
                                    { field: "jmlpasienbaru", aggregate: "sum" },
                                    { field: "jmlpasienlk", aggregate: "sum" },
                                    { field: "jmlpasienpr", aggregate: "sum" },
                                    { field: "jmlpasien0sampai4", aggregate: "sum" },
                                    { field: "jmlpasien5sampai14", aggregate: "sum" },
                                    { field: "jmlpasien15sampai24", aggregate: "sum" },
                                    { field: "jmlpasien25sampai44", aggregate: "sum" },
                                    { field: "jmlpasien45sampai64", aggregate: "sum" },
                                    { field: "jmlpasienlebih64", aggregate: "sum" },
                                    { field: "jmlislam", aggregate: "sum" },
                                    { field: "jmlkristen", aggregate: "sum" },
                                    { field: "jmlhindu", aggregate: "sum" },
                                    { field: "jmlbudha", aggregate: "sum" },
                                    { field: "jmlkatholik", aggregate: "sum" },
                                    { field: "jmllainnya", aggregate: "sum" },
                                    { field: "jmlyogyakarta", aggregate: "sum" },
                                    { field: "jmlbantul", aggregate: "sum" },
                                    { field: "jmlsleman", aggregate: "sum" },
                                    { field: "jmlkulonprogo", aggregate: "sum" },
                                    { field: "jmlgunungkidul", aggregate: "sum" },
                                    { field: "jmlluardiy", aggregate: "sum" },
                                    { field: "jmltstk", aggregate: "sum" },
                                    { field: "jmlsd", aggregate: "sum" },
                                    { field: "jmlsltp", aggregate: "sum" },
                                    { field: "jmlslta", aggregate: "sum" },
                                    { field: "jmld1sds3", aggregate: "sum" },
                                    { field: "jmltani", aggregate: "sum" },
                                    { field: "jmlburuh", aggregate: "sum" },
                                    { field: "jmlpns", aggregate: "sum" },
                                    { field: "jmlswasta", aggregate: "sum" },
                                    { field: "jmlabripolri", aggregate: "sum" },
                                    { field: "jmlpelajarmahasiswa", aggregate: "sum" },
                                    { field: "jmltakbekerja", aggregate: "sum" },
                                    // { field: "totalpasien", aggregate: "sum" },
                                    // { field: "totaljk", aggregate: "sum" },
                                    // { field: "totalumur", aggregate: "sum" },
                                    // { field: "totalpendidikan", aggregate: "sum" },
                                    // { field: "totalpekerjaan", aggregate: "sum" },
                                    // { field: "totalagama", aggregate: "sum" },
                                    // { field: "totalalamat", aggregate: "sum" },
                                ]
                        });                        
                    });

// var json = {
//     'nama': 'yogs',
//     'slsms':sdsds
// }
// medifirstService.poat('fsfs',jdon).then(function(e){
//     $scope.listRuangan = e.data.dstsr
// })
                


            }

            function FormLoad(){                
               $scope.item.tglAwal =  moment($scope.now).format('YYYY-MM-DD 00:00');
               $scope.item.tglAkhir = moment($scope.now).format('YYYY-MM-DD 23:59');               
               LoadCombo();
            }                               

            $scope.ClearData = function () {
               $scope.item.tglAwal =  moment($scope.now).format('YYYY-MM-DD 00:00');
               $scope.item.tglAkhir = moment($scope.now).format('YYYY-MM-DD 23:59');
            }

            $scope.cariFilter = function () {

                init();
            }


            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MM-YYYY');
            }

            var HttpClient = function() {
                this.get = function(aUrl, aCallback) {
                    var anHttpRequest = new XMLHttpRequest();
                    anHttpRequest.onreadystatechange = function() { 
                        if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                            aCallback(anHttpRequest.responseText);
                    }

                    anHttpRequest.open( "GET", aUrl, true );            
                    anHttpRequest.send( null );
                }
            }

            $scope.columnGrid = {
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "RekapDataKunjunganRawatJalan.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                   sheet.mergedCells = ["A1:AI1"];
                    sheet.frozenRows = 3;
                    sheet.name = "Report";
                    var myHeaders = [{
                        value: "Rekap Data Kunjungan Rawat Jalan",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                    }];
                    var total = {
                        value: "Total", 
                        
                    };
                    var ttlpasien = {
                        value: $scope.ttlpasien,
                        textAlign: "center",
                       colSpan: 2,
                        
                    };

                    var ttljk = {
                        value: $scope.ttljk,
                        textAlign: "center",
                        colSpan: 2,

                    };
                    var ttlumur = {
                        value: $scope.ttlumur,
                        textAlign: "center",
                        colSpan: 6,
                    };
                    var ttlagama = {
                        value: $scope.ttlagama,
                        textAlign: "center",
                        colSpan: 6,
                    };
                    var ttlamat = {
                        value: $scope.ttlalamat,
                        textAlign: "center",
                        colSpan: 6,
                    };
                    var ttlpendidikan = {
                        value: $scope.ttlpendidikan,
                        textAlign: "center",
                        colSpan: 5,
                    };
                    var ttlpekerjaan = {
                        value: $scope.ttlpekerjaan,
                        textAlign: "center",
                        colSpan: 7,
                    };

                    var ketagama = {
                        value: "1. Islam \n2. Kristen \n3. Katholik \n4. Hindu \n5. Budha \n6. Lainnya",
                        wrap : true,
                        colSpan:3,
                        verticalAlign: "top"
                    };

                    var ketalamat = {
                        value: "1. Yogyakarta  \n2. Bantul  \n3. Kulon Progo \n4. Gunung Kidul \n5. Sleman \n6. Luar DIY",
                        wrap : true,
                        colSpan: 3,
                        verticalAlign: "top"
                    };
                    var ketpendidikan = {
                        value: "1. TS / TK \n 2. SD \n 3. SLTP \n 4. SLTA \n 5. D1 - S3 ",
                        wrap : true,
                        colSpan: 3,
                        verticalAlign: "top"
                    };
                    var ketpekerjaan = {
                        value: "1. Tani \n2. Buruh  \n3. Pegawai Negri Sipil  \n4. ABRI / POLRI  \n5. Karyawan Swasta \n 6. Tak kerja \n 7. Pelajar / Mahasiswa ",
                        wrap : true,
                        colSpan: 5,
                        verticalAlign: "top"
                    };
                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 60 });
                    sheet.rows.splice(100, 0, {
                        cells: [total, ttlpasien, ttljk,ttlumur,ttlagama,ttlamat,ttlpendidikan,ttlpekerjaan],
                        type: "data",
                    });
                    sheet.rows.splice(106, 0, {
                        cells: [{value:" "},{value:"Keterangan : ", colSpan: 2, verticalAlign:"top", },{value:"Agama :",colSpan: 2, verticalAlign:"top", },ketagama,{value: "Alamat : ",colSpan: 2, verticalAlign:"top", },ketalamat,{value:"Pendidikan :",colSpan: 2, verticalAlign:"top", },ketpendidikan,{value:"Pekerjaan",colSpan: 2, verticalAlign:"top"},ketpekerjaan],
                        type: "data",
                        height: 150,
                        
                    });
                    //sheet.rows.splice(30, 0, { cells: ttlpasiens, type: "data", height: 40 });
                    
                },
                selectable: 'row',
                pageable: true,
                columns:[
                    // {
                    //     "field": "no",
                    //     "title": "No",
                    //     "width": "15px",
                    // },
                    {
                        "field": "ruangan",
                        "title": "POLIKLINIK",
                        "width": "100px",
                        footerTemplate: "Sub Total",
                    },
                    {
                        "title": "Pasien",
                        "width": "80px",
                        columns: [{
                                "field": 'jmlpasienbaru',
                                "title": "Baru",
                                "width": "40px",
                                aggregates: ["sum"],
                                template: "#: jmlpasienbaru  #",
                                footerTemplate: "#: data.jmlpasienbaru.sum #",
                            },
                            {
                                "field": 'jmlpasienlama',
                                "title": "Lama",
                                "width": "40px",
                                aggregates: ["sum"],
                                template: "#: jmlpasienlama  #",
                                footerTemplate: "#: data.jmlpasienlama.sum #",

                            }
                        ],

                    },
                    {
                        "title": "Jenis Kelamin",
                        "width": "80px",
                        columns: [
                            {
                                "field": 'jmlpasienlk',
                                "title": "LK",
                                "width": "40px",
                                aggregates: ["sum"],
                                template: "#: jmlpasienlk  #",
                                footerTemplate: "#: data.jmlpasienlk.sum #",
                            },
                            {
                                "field": 'jmlpasienpr',
                                "title": "PR",
                                "width": "40px",
                                aggregates: ["sum"],
                                template: "#: jmlpasienpr  #",
                                footerTemplate: "#: data.jmlpasienpr.sum #",

                            }
                        ]
                    },
                    {
                        "title": "Umur",
                        "width": "80px",
                        columns: [
                            {
                                "field": 'jmlpasien0sampai4',
                                "title": "0-4",
                                "width": "40px",
                                aggregates: ["sum"],
                                template: "#: jmlpasien0sampai4  #",
                                footerTemplate: "#: data.jmlpasien0sampai4.sum #",
                            },
                            {
                                "field": 'jmlpasien5sampai14',
                                "title": "5-14",
                                "width": "40px",
                                aggregates: ["sum"],
                                template: "#: jmlpasien5sampai14  #",
                                footerTemplate: "#: data.jmlpasien5sampai14.sum #",

                            },
                            {
                                "field": 'jmlpasien15sampai24',
                                "title": "15-24",
                                "width": "40px",
                                aggregates: ["sum"],
                                template: "#: jmlpasien15sampai24  #",
                                footerTemplate: "#: data.jmlpasien15sampai24.sum #",

                            },
                            {
                                "field": 'jmlpasien25sampai44',
                                "title": "25-44",
                                "width": "40px",
                                aggregates: ["sum"],
                                template: "#: jmlpasien25sampai44  #",
                                footerTemplate: "#: data.jmlpasien25sampai44.sum #",
                            },
                            {
                                "field": 'jmlpasien45sampai64',
                                "title": "45-64",
                                "width": "40px",
                                aggregates: ["sum"],
                                template: "#: jmlpasien45sampai64  #",
                                footerTemplate: "#: data.jmlpasien45sampai64.sum #",
                            },
                            {
                                "field": 'jmlpasienlebih64',
                                "title": ">64",
                                "width": "40px",
                                aggregates: ["sum"],
                                template: "#: jmlpasienlebih64  #",
                                footerTemplate: "#: data.jmlpasienlebih64.sum #",
                            }
                        ]
                    },
                    {
                        "title": "Agama",
                        "width": "80px",
                        columns: [
                            {
                                "field": 'jmlislam',
                                "title": "1",
                                "width": "40px",
                                aggregates: ["sum"],
                                template: "#: jmlislam  #",
                                footerTemplate: "#: data.jmlislam.sum #",
                            },
                            {
                                "field": 'jmlkristen',
                                "title": "2",
                                "width": "40px",
                                aggregates: ["sum"],
                                template: "#: jmlkristen  #",
                                footerTemplate: "#: data.jmlkristen.sum #",
                            },
                            {
                                "field": 'jmlkatholik',
                                "title": "3",
                                "width": "40px",
                                aggregates: ["sum"],
                                template: "#: jmlkatholik  #",
                                footerTemplate: "#: data.jmlkatholik.sum #",

                            },
                            {
                                "field": 'jmlhindu',
                                "title": "4",
                                "width": "40px",
                                aggregates: ["sum"],
                                template: "#: jmlhindu  #",
                                footerTemplate: "#: data.jmlhindu.sum #",
                                
                            },
                            {
                                "field": 'jmlbudha',
                                "title": "5",
                                "width": "40px",
                                aggregates: ["sum"],
                                template: "#: jmlbudha  #",
                                footerTemplate: "#: data.jmlbudha.sum #",
                            },
                            {
                                "field": 'jmllainnya',
                                "title": "6",
                                "width": "40px",
                                aggregates: ["sum"],
                                template: "#: jmllainnya  #",
                                footerTemplate: "#: data.jmllainnya.sum #",
                            }

                        ]

                    },
                    {
                        "title": "Alamat",
                        "width": "80px",
                        columns: [
                            {
                                "field": 'jmlyogyakarta',
                                "title": "1",
                                "width": "40px",
                                aggregates: ["sum"],
                                template: "#: jmlyogyakarta  #",
                                footerTemplate: "#: data.jmlyogyakarta.sum #",
                            },
                            {
                                "field": 'jmlbantul',
                                "title": "2",
                                "width": "40px",
                                aggregates: ["sum"],
                                template: "#: jmlbantul  #",
                                footerTemplate: "#: data.jmlbantul.sum #",
                            },
                            {
                                "field": 'jmlkulonprogo',
                                "title": "3",
                                "width": "40px",
                                aggregates: ["sum"],
                                template: "#: jmlkulonprogo  #",
                                footerTemplate: "#: data.jmlkulonprogo.sum #",
                            },
                            {
                                "field": 'jmlgunungkidul',
                                "title": "4",
                                "width": "40px",
                                aggregates: ["sum"],
                                template: "#: jmlgunungkidul  #",
                                footerTemplate: "#: data.jmlgunungkidul.sum #",
                            },
                            {
                                "field": 'jmlsleman',
                                "title": "5",
                                "width": "40px",
                                aggregates: ["sum"],
                                template: "#: jmlsleman  #",
                                footerTemplate: "#: data.jmlsleman.sum #",
                            },
                            {
                                "field": 'jmlluardiy',
                                "title": "6",
                                "width": "40px",
                                aggregates: ["sum"],
                                template: "#: jmlluardiy  #",
                                footerTemplate: "#: data.jmlluardiy.sum #",
                            },
                        ]
                    },
                    {
                        "title": "Pendidikan",
                        "width": "80px",
                        columns: [
                            {
                                "field": 'jmltstk',
                                "title": "1",
                                "width": "40px",
                                aggregates: ["sum"],
                                template: "#: jmltstk  #",
                                footerTemplate: "#: data.jmltstk.sum #",
                            },
                            {
                                "field": 'jmlsd',
                                "title": "2",
                                "width": "40px",
                                aggregates: ["sum"],
                                template: "#: jmlsd  #",
                                footerTemplate: "#: data.jmlsd.sum #",
                            },
                            {
                                "field": 'jmlsltp',
                                "title": "3",
                                "width": "40px",
                                aggregates: ["sum"],
                                template: "#: jmlsltp  #",
                                footerTemplate: "#: data.jmlsltp.sum #",
                            },
                            {
                                "field": 'jmlslta',
                                "title": "4",
                                "width": "40px",
                                aggregates: ["sum"],
                                template: "#: jmlslta  #",
                                footerTemplate: "#: data.jmlslta.sum #",
                            },
                            {
                                "field": 'jmld1sds3',
                                "title": "5",
                                "width": "40px",
                                aggregates: ["sum"],
                                template: "#: jmld1sds3  #",
                                footerTemplate: "#: data.jmld1sds3.sum #",
                            },
                        ]
                    },
                    {
                        "title": "Pekerjaan",
                        "width": "80px",
                        columns: [
                            {
                                "field": 'jmltani',
                                "title": "1",
                                "width": "40px",
                                aggregates: ["sum"],
                                template: "#: jmltani  #",
                                footerTemplate: "#: data.jmltani.sum #",
                            },
                            {
                                "field": 'jmlburuh',
                                "title": "2",
                                "width": "40px",
                                aggregates: ["sum"],
                                template: "#: jmlburuh  #",
                                footerTemplate: "#: data.jmlburuh.sum #",
                            },
                            {
                                "field": 'jmlpns',
                                "title": "3",
                                "width": "40px",
                                aggregates: ["sum"],
                                template: "#: jmlpns  #",
                                footerTemplate: "#: data.jmlpns.sum #",
                            },
                            {
                                "field": 'jmlabripolri',
                                "title": "4",
                                "width": "40px",    
                                aggregates: ["sum"],
                                template: "#: jmlabripolri  #",
                                footerTemplate: "#: data.jmlabripolri.sum #",
                            },
                            {
                                "field": 'jmlswasta',
                                "title": "5",
                                "width": "40px",
                                aggregates: ["sum"],
                                template: "#: jmlswasta  #",
                                footerTemplate: "#: data.jmlswasta.sum #",
                            },
                            {
                                "field": 'jmltakbekerja',
                                "title": "6",
                                "width": "40px",
                                aggregates: ["sum"],
                                template: "#: jmltakbekerja  #",
                                footerTemplate: "#: data.jmltakbekerja.sum #",
                            },
                            {
                                "field": 'jmlpelajarmahasiswa',
                                "title": "7",
                                "width": "40px",
                                aggregates: ["sum"],
                                template: "#: jmlpelajarmahasiswa  #",
                                footerTemplate: "#: data.jmlpelajarmahasiswa.sum #",
                            },
                        ]
                    },



                    // {
                    //     "title": "Umur",
                    //     "width": "80px",
                    //     columns: [
                    //         {
                    //             "field": 'u1',
                    //             "title": "0-4",
                    //             "width": "40px",
                    //             aggregates: ["sum"],
                    //             template: "#: u1  #",
                    //             groupFooterTemplate: "#: data.u1.sum  #",
                    //             footerTemplate: "#: data.u1.sum  #",
                    //         },
                    //         {
                    //             "field": 'u2',
                    //             "title": "5-14",
                    //             "width": "40px",
                    //             aggregates: ["sum"],
                    //             template: "#: u2  #",
                    //             groupFooterTemplate: "#: data.u2.sum  #",
                    //             footerTemplate: "#: data.u2.sum  #",
                    //         },
                    //         {
                    //             "field": 'u3',
                    //             "title": "15-24",
                    //             "width": "40px",
                    //             aggregates: ["sum"],
                    //             template: "#: u3  #",
                    //             groupFooterTemplate: "#: data.u3.sum  #",
                    //             footerTemplate: "#: data.u3.sum  #",
                    //         },
                    //         {
                    //             "field": 'u4',
                    //             "title": "25-44",
                    //             "width": "40px",
                    //             aggregates: ["sum"],
                    //             template: "#: u4  #",
                    //             groupFooterTemplate: "#: data.u4.sum  #",
                    //             footerTemplate: "#: data.u4.sum  #",
                    //         },
                    //         {
                    //             "field": 'u5',
                    //             "title": "45-64",
                    //             "width": "40px",
                    //             aggregates: ["sum"],
                    //             template: "#: u5  #",
                    //             groupFooterTemplate: "#: data.u5.sum  #",
                    //             footerTemplate: "#: data.u5.sum  #",
                    //         },
                    //         {
                    //             "field": 'u6',
                    //             "title": ">64th",
                    //             "width": "40px",
                    //             aggregates: ["sum"],
                    //             template: "#: u6  #",
                    //             groupFooterTemplate: "#: data.u6.sum  #",
                    //             footerTemplate: "#: data.u6.sum  #",
                    //         }
                    //     ]
                    // },
                    // {
                    //     "title": "Agama",
                    //     "width": "80px",
                    //     columns: [{
                    //             "field": 'islam',
                    //             "title": "1",
                    //             "width": "40px",
                    //             aggregates: ["sum"],
                    //             template: "#: islam  #",
                    //             groupFooterTemplate: "#: data.islam.sum  #",
                    //             footerTemplate: "#: data.islam.sum  #",
                    //         },
                    //         {
                    //             "field": 'kristen',
                    //             "title": "2",
                    //             "width": "40px",
                    //             aggregates: ["sum"],
                    //             template: "#: kristen  #",
                    //             groupFooterTemplate: "#: data.kristen.sum  #",
                    //             footerTemplate: "#: data.kristen.sum  #",
                    //         },
                    //         {
                    //             "field": 'katholik',
                    //             "title": "3",
                    //             "width": "40px",
                    //             aggregates: ["sum"],
                    //             template: "#: katholik  #",
                    //             groupFooterTemplate: "#: data.katholik.sum  #",
                    //             footerTemplate: "#: data.katholik.sum  #",
                    //         },
                    //         {
                    //             "field": 'hindu',
                    //             "title": "4",
                    //             "width": "40px",
                    //             aggregates: ["sum"],
                    //             template: "#: hindu  #",
                    //             groupFooterTemplate: "#: data.hindu.sum  #",
                    //             footerTemplate: "#: data.hindu.sum  #",
                    //         },
                    //         {
                    //             "field": 'budha',
                    //             "title": "5",
                    //             "width": "40px",
                    //             aggregates: ["sum"],
                    //             template: "#: budha  #",
                    //             groupFooterTemplate: "#: data.budha.sum  #",
                    //             footerTemplate: "#: data.budha.sum  #",
                    //         },
                    //         {
                    //             "field": 'lainnya',
                    //             "title": "6",
                    //             "width": "40px",
                    //             aggregates: ["sum"],
                    //             template: "#: lainnya  #",
                    //             groupFooterTemplate: "#: data.lainnya.sum  #",
                    //             footerTemplate: "#: data.lainnya.sum  #",
                    //         }
                    //     ]
                    // },
                    // {
                    //     "title": "Alamat",
                    //     "width": "80px",
                    //     columns: [{
                    //             "field": 'yogyakarta',
                    //             "title": "1",
                    //             "width": "40px",
                    //             aggregates: ["sum"],
                    //             template: "#: yogyakarta  #",
                    //             groupFooterTemplate: "#: data.yogyakarta.sum  #",
                    //             footerTemplate: "#: data.yogyakarta.sum  #",
                    //         },
                    //         {
                    //             "field": 'bantul',
                    //             "title": "2",
                    //             "width": "40px",
                    //             aggregates: ["sum"],
                    //             template: "#: bantul  #",
                    //             groupFooterTemplate: "#: data.bantul.sum  #",
                    //             footerTemplate: "#: data.bantul.sum  #",
                    //         },
                    //         {
                    //             "field": 'kulonprogo',
                    //             "title": "3",
                    //             "width": "40px",
                    //             aggregates: ["sum"],
                    //             template: "#: kulonprogo  #",
                    //             groupFooterTemplate: "#: data.kulonprogo.sum  #",
                    //             footerTemplate: "#: data.kulonprogo.sum  #",
                    //         },
                    //         {
                    //             "field": 'gunungkidul',
                    //             "title": "4",
                    //             "width": "40px",
                    //             aggregates: ["sum"],
                    //             template: "#: gunungkidul  #",
                    //             groupFooterTemplate: "#: data.gunungkidul.sum  #",
                    //             footerTemplate: "#: data.gunungkidul.sum  #",
                    //         },
                    //         {
                    //             "field": 'sleman',
                    //             "title": "5",
                    //             "width": "40px",
                    //             aggregates: ["sum"],
                    //             template: "#: sleman  #",
                    //             groupFooterTemplate: "#: data.sleman.sum  #",
                    //             footerTemplate: "#: data.sleman.sum  #",
                    //         },
                    //         {
                    //             "field": 'luardiy',
                    //             "title": "6",
                    //             "width": "40px",
                    //             aggregates: ["sum"],
                    //             template: "#: luardiy  #",
                    //             groupFooterTemplate: "#: data.luardiy.sum  #",
                    //             footerTemplate: "#: data.luardiy.sum  #",
                    //         }
                    //     ]
                    // },
                    // {
                    //     "title": "Pendidikan",
                    //     "width": "80px",
                    //     columns: [{
                    //             "field": 'tstk',
                    //             "title": "1",
                    //             "width": "40px",
                    //             aggregates: ["sum"],
                    //             template: "#: tstk  #",
                    //             groupFooterTemplate: "#: data.tstk.sum  #",
                    //             footerTemplate: "#: data.tstk.sum  #",
                    //         },
                    //         {
                    //             "field": 'sd',
                    //             "title": "2",
                    //             "width": "40px",
                    //             aggregates: ["sum"],
                    //             template: "#: sd  #",
                    //             groupFooterTemplate: "#: data.sd.sum  #",
                    //             footerTemplate: "#: data.sd.sum  #",
                    //         },
                    //         {
                    //             "field": 'sltp',
                    //             "title": "3",
                    //             "width": "40px",
                    //             aggregates: ["sum"],
                    //             template: "#: sltp  #",
                    //             groupFooterTemplate: "#: data.sltp.sum  #",
                    //             footerTemplate: "#: data.sltp.sum  #",
                    //         },
                    //         {
                    //             "field": 'slta',
                    //             "title": "4",
                    //             "width": "40px",
                    //             aggregates: ["sum"],
                    //             template: "#: slta  #",
                    //             groupFooterTemplate: "#: data.slta.sum  #",
                    //             footerTemplate: "#: data.slta.sum  #",
                    //         },
                    //         {
                    //             "field": 'd1sds3',
                    //             "title": "5",
                    //             "width": "40px",
                    //             aggregates: ["sum"],
                    //             template: "#: d1sds3  #",
                    //             groupFooterTemplate: "#: data.d1sds3.sum  #",
                    //             footerTemplate: "#: data.d1sds3.sum  #",
                    //         },
                    //         {
                    //             "field": 'pdlainnya',
                    //             "title": "6",
                    //             "width": "40px",
                    //             aggregates: ["sum"],
                    //             template: "#: pdlainnya  #",
                    //             groupFooterTemplate: "#: data.pdlainnya.sum  #",
                    //             footerTemplate: "#: data.pdlainnya.sum  #",
                    //         }
                    //     ]
                    // },
                    // {
                    //     "title": "Pekerjaan",
                    //     "width": "80px",
                    //     columns: [{
                    //             "field": 'tani',
                    //             "title": "1",
                    //             "width": "40px",
                    //             aggregates: ["sum"],
                    //             template: "#: tani  #",
                    //             groupFooterTemplate: "#: data.tani.sum  #",
                    //             footerTemplate: "#: data.tani.sum  #",
                    //         },
                    //         {
                    //             "field": 'buruh',
                    //             "title": "2",
                    //             "width": "40px",
                    //             aggregates: ["sum"],
                    //             template: "#: buruh  #",
                    //             groupFooterTemplate: "#: data.buruh.sum  #",
                    //             footerTemplate: "#: data.buruh.sum  #",
                    //         },
                    //         {
                    //             "field": 'pns',
                    //             "title": "3",
                    //             "width": "40px",
                    //             aggregates: ["sum"],
                    //             template: "#: pns  #",
                    //             groupFooterTemplate: "#: data.pns.sum  #",
                    //             footerTemplate: "#: data.pns.sum  #",
                    //         },
                    //         {
                    //             "field": 'abripolri',
                    //             "title": "4",
                    //             "width": "40px",
                    //             aggregates: ["sum"],
                    //             template: "#: abripolri  #",
                    //             groupFooterTemplate: "#: data.abripolri.sum  #",
                    //             footerTemplate: "#: data.abripolri.sum  #",
                    //         },
                    //         {
                    //             "field": 'swasta',
                    //             "title": "5",
                    //             "width": "40px",
                    //             aggregates: ["sum"],
                    //             template: "#: swasta  #",
                    //             groupFooterTemplate: "#: data.swasta.sum  #",
                    //             footerTemplate: "#: data.swasta.sum  #",
                    //         },
                    //         {
                    //             "field": 'takbekerja',
                    //             "title": "6",
                    //             "width": "40px",
                    //             aggregates: ["sum"],
                    //             template: "#: takbekerja  #",
                    //             groupFooterTemplate: "#: data.takbekerja.sum  #",
                    //             footerTemplate: "#: data.takbekerja.sum  #",
                    //         },
                    //         {
                    //             "field": 'pelajarmahasiswa',
                    //             "title": "7",
                    //             "width": "40px",
                    //             aggregates: ["sum"],
                    //             template: "#: pelajarmahasiswa  #",
                    //             groupFooterTemplate: "#: data.pelajarmahasiswa.sum  #",
                    //             footerTemplate: "#: data.pelajarmahasiswa.sum  #",
                    //         },
                    //         {
                    //             "field": 'pklainnya',
                    //             "title": "8",
                    //             "width": "40px",
                    //             aggregates: ["sum"],
                    //             template: "#: pklainnya  #",
                    //             groupFooterTemplate: "#: data.pklainnya.sum  #",
                    //             footerTemplate: "#: data.pklainnya.sum  #",
                    //         }
                    //     ]
                    // },
                    // {
                    //     hidden: true,
                    //     field: "ruangan",
                    //     title: "Kelompok Pasien",
                    //     aggregates: ["count"],
                    //     groupHeaderTemplate: " #= value # "
                    // }
                ]                   
            };
//////////////////////////////////////////////////////////////          END             /////////////////////////////////////////////////////////////////////////////////////       
        }
    ]);
});