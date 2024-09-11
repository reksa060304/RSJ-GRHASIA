define(['initialize'], function(initialize) {
    'use strict';
        initialize.controller('LaporanRekapKunjunganRSCtrl', ['$scope', 'DateHelper','$http','$state', 'MedifirstService',
            function($scope, dateHelper, $http, $state, medifirstService) {    	
                //Inisial Variable   
                $scope.isRouteLoading = false;
                $scope.item = {};                       
                $scope.now = new Date();
                $scope.item.tglAwal =  moment($scope.now).startOf('month').format('YYYY-MM-DD 00:00');
                $scope.item.tglAkhir = moment($scope.now).format('YYYY-MM-DD 23:59');   
                $scope.dataSelected = {};
                                   
                
                setTimeout(() => {
                    init();             
                }, 3000)

                function init() {
                    
                    // $scope.isRouteLoading = true;
                    var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                    var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                    
                    medifirstService.get("registrasi/laporan/get-rekap-kunjunganrs" 
                        + "?tglAwal=" + tglAwal 
                        + "&tglAkhir=" + tglAkhir)
                        .then(function (response) {
                            // $scope.isRouteLoading = false
                            
                            // console.log(dat.data)
                            $scope.dataGrid = new kendo.data.DataSource({
                                data: response.data,
                                length: response.data.length,
                                pageSize: 10
                            })
    
                                                   
                        });
                    
                }
    
                function FormLoad(){                
                    $scope.item.tglAwal =  moment($scope.now).startOf('month').format('YYYY-MM-DD 00:00');
                    $scope.item.tglAkhir = moment($scope.now).format('YYYY-MM-DD 23:59');
                    setTimeout(() => {
                       init();
                
                    }, 500)               
                }                               
    
                $scope.ClearData = function () {
                    $scope.item.tglAwal =  moment($scope.now).format('YYYY-MM-DD 00:00');
                    $scope.item.tglAkhir = moment($scope.now).format('YYYY-MM-DD 23:59');
                }
    
                $scope.cariFilter = function () {
                    init();
                }

                $scope.ruanganya =""
                $scope.columnGrid = {
                    toolbar: [
                        "excel",
    
                    ],                    
                    selectable: 'row',
                    pageable: true,
                    columns:[
                        
                        {
                            "title": "Pasien",
                            "width": "80px",
                            columns: [{
                                    "field": 'pasienbaru',
                                    "title": "Baru",
                                    "width": "40px",
                                },
                                {
                                    "field": 'pasienlama',
                                    "title": "Lama",
                                    "width": "40px",
    
                                }
                            ],
    
                        },
                        {
                            "title": "Jenis Kelamin",
                            "width": "80px",
                            columns: [
                                {
                                    "field": 'lakilaki',
                                    "title": "LK",
                                    "width": "40px",
                                },
                                {
                                    "field": 'perempuan',
                                    "title": "PR",
                                    "width": "40px",
    
                                }
                            ]
                        },
                        {
                            "title": "Umur",
                            "width": "80px",
                            columns: [
                                {
                                    "field": 'umr0sd4',
                                    "title": "0 - 4",
                                    "width": "40px",
                                },
                                {
                                    "field": 'umr5sd14',
                                    "title": "5 - 14",
                                    "width": "40px",
                                },
                                {
                                    "field": 'umr15sd24',
                                    "title": "15 - 24",
                                    "width": "40px",
                                },
                                {
                                    "field": 'umr25sd44',
                                    "title": "25 - 44",
                                    "width": "40px",
                                },
                                {
                                    "field": 'umr45sd64',
                                    "title": "45 - 64",
                                    "width": "40px",
                                },
                                {
                                    "field": 'umr65',
                                    "title": "> 64",
                                    "width": "40px",
                                }
                            ]
                        },
                        {
                            "title": "Agama",
                            "width": "80px",
                            columns: [
                                {
                                    "field": 'islam',
                                    "title": "Islam",
                                    "width": "40px",
                                },
                                {
                                    "field": 'protestan',
                                    "title": "Protestan",
                                    "width": "40px",
                                },
                                {
                                    "field": 'katholik',
                                    "title": "Khatolik",
                                    "width": "40px",
    
                                },
                                {
                                    "field": 'hindu',
                                    "title": "Hindu",
                                    "width": "40px",
                                    
                                },
                                {
                                    "field": 'budha',
                                    "title": "Budha",
                                    "width": "40px"
                                },
                                {
                                    "field": 'aglainnya',
                                    "title": "Lainnya",
                                    "width": "40px",
                                }
    
                            ]
    
                        },
                        {
                            "title": "Pendidikan",
                            "width": "80px",
                            columns: [
                                {
                                    "field": 'tstk',
                                    "title": "Tidak sekolah",
                                    "width": "40px"
                                },
                                {
                                    "field": 'sd',
                                    "title": "Lulus SD",
                                    "width": "40px",
                                },
                                {
                                    "field": 'sltp',
                                    "title": "Lulus SMP",
                                    "width": "40px",
                                },
                                {
                                    "field": 'slta',
                                    "title": "Lulus SLTA",
                                    "width": "40px",
                                },
                                {
                                    "field": 'pedlainnya',
                                    "title": "Lainnya",
                                    "width": "40px",
                                },
                            ]
                        },
                        {
                            "title": "Pekerjaan",
                            "width": "80px",
                            columns: [
                                {
                                    "field": 'tani',
                                    "title": "Tani",
                                    "width": "40px",
                                },
                                {
                                    "field": 'buruh',
                                    "title": "Buruh",
                                    "width": "40px",
                                },
                                {
                                    "field": 'pns',
                                    "title": "PNS",
                                    "width": "40px",
                                },
                                {
                                    "field": 'tnipolri',
                                    "title": "Polri",
                                    "width": "40px",
                                },
                                {
                                    "field": 'swasta',
                                    "title": "Swasta",
                                    "width": "40px",
                                },
                                {
                                    "field": 'tdkbekerja',
                                    "title": "Tidak Bekerja",
                                    "width": "40px",
                                },
                                {
                                    "field": 'pelajar',
                                    "title": "Pelajar",
                                    "width": "40px",
                                },
                            ]
                        },
                    ]                   
                };
                //////////////////////////////////////////////////////////////          END             /////////////////////////////////////////////////////////////////////////////////////       
            }
        ]);
    });