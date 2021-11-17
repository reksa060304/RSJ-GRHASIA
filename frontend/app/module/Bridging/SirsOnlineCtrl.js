define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('SirsOnlineCtrl', ['$q', '$rootScope', '$scope', '$state', 'CacheHelper', 'MedifirstService', '$timeout',
        function ($q, $rootScope, $scope, $state, cacheHelper, medifirstService, $timeout) {
            $scope.item = {};
            $scope.item2 = {}
            $scope.item3 = {};
            $scope.item4 = {};
            $scope.item5 = {}
            $scope.item6 = {}
            let data2 = []
            $scope.isRouteLoading = false

            // loadCombo()
            // loadDataJP()
            // loadDataSH()
            // loadDataNilai()
            // loadMap()
            // loadMasterProduk()

            $scope.onTabChanges = function (value) {
                if (value === 1) {
                    loadDataJP()
                } else if (value === 2) {
                    loadMap()
                } else if (value === 3) {
                    loadDataSH()
                } else if (value === 4) {
                    loadDataNilai()
                } else if (value === 5) {
                    loadTT()
                }
                else if (value === 6) {
                    loadSDM()
                }
            };
            $scope.cari1 = function(){
                loadDataJP()
            }
            $scope.cari2 = function(){
                  loadMap()
            }
             $scope.cari3 = function(){
                loadDataSH()
            }
             $scope.cari4 = function(){
                     loadDataNilai()
            }
             $scope.cari5 = function(){
               loadTT()
            }
             $scope.cari6 = function(){
               loadSDM()
            }
            $scope.gridPelayanan = {

                selectable: 'row',
                pageable: true,
                columns: [
                    // {
                    //     "field": "no",
                    //     "title": "No",
                    //     "width": 15,
                    // },
                    {
                        "field": "namaproduk",
                        "title": "Nama Pelayanan",
                        "width": 110,
                    },
                    {
                        "field": "detailjenisproduk",
                        "title": "Jenis Pemeriksaan",
                        "width": 110,
                    },
                    {
                        "field": "jenisproduk",
                        "title": "Jenis Produk",
                        "width": 110,
                    },

                ],
            };
           $scope.gridJenisPemeriksaan = {

                selectable: 'row',
                pageable: true,
                columns: [
                    // {
                    //     "field": "no",
                    //     "title": "No",
                    //     "width": 15,
                    // },
                    {
                        "field": "tanggal",
                        "title": "Tanggal",
                        "width": 110,
                    },
                   
                    {
                        "field": "rj",
                        "title": "Rawat Jalan",
                        "width": 110,
                        headerAttributes: { style: "text-align : center" },
                        "columns":[
                            {
                                "field" : "Suspect",
                                "title" : "Suspect",
                                "width": "75px",
                                headerAttributes: { style: "text-align : center" },
                                "columns":[
                                    {
                                        "field" : "rj_suspect_l",
                                        "title" : "L",
                                        "width": "75px",
                                        
                                    }, 
                                    {
                                        "field" : "rj_suspect_p",
                                        "title" : "P",
                                        "width": "75px",
                                    }
                                ]
                            }, 
                            {
                                "field" : "Confirm",
                                "title" : "Confirm",
                                "width": "75px",
                                headerAttributes: { style: "text-align : center" },
                                "columns":[
                                    {
                                        "field" : "rj_confirm_l",
                                        "title" : "L",
                                        "width": "75px",
                                        
                                    }, 
                                    {
                                        "field" : "rj_confirm_p",
                                        "title" : "P",
                                        "width": "75px",
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "field": "",
                        "title": "Non Covid RI",
                        "width": 110,
                    },
                    {
                        "field": "ri",
                        "title": "Rawat Inap",
                        "width": 110,
                        headerAttributes: { style: "text-align : center" },
                        "columns":[
                            {
                                "field" : "Suspect",
                                "title" : "Suspect",
                                "width": "75px",
                                headerAttributes: { style: "text-align : center" },
                                "columns":[
                                    {
                                        "field" : "ri_suspect_l",
                                        "title" : "L",
                                        "width": "75px",
                                        
                                    }, 
                                    {
                                        "field" : "ri_suspect_p",
                                        "title" : "P",
                                        "width": "75px",
                                    }
                                ]
                            }, 
                            {
                                "field" : "Confirm",
                                "title" : "Confirm",
                                "width": "75px",
                                headerAttributes: { style: "text-align : center" },
                                "columns":[
                                    {
                                        "field" : "ri_confirm_l",
                                        "title" : "L",
                                        "width": "75px",
                                        
                                    }, 
                                    {
                                        "field" : "ri_confirm_p",
                                        "title" : "P",
                                        "width": "75px",
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "field": "tgl_lapor",
                        "title": "Tgl Lapor",
                        "width": 80,
                    },

                ],
            };
            $scope.gridKomorbid = {

                selectable: 'row',
                pageable: true,
                columns: [
                    // {
                    //     "field": "no",
                    //     "title": "No",
                    //     "width": 15,
                    // },
                    {
                        "field": "tanggal",
                        "title": "Tanggal",
                        "width": 110,
                    },
                    {
                        "field": "jmlnicucovid",
                        "title": "jml Nicu Khusus Covid",
                        "width": 110,
                        "template": "{{ #= parseFloat(nicu_khusus_covid_suspect_l) + parseFloat(nicu_khusus_covid_suspect_p) + parseFloat(nicu_khusus_covid_confirm_l) + parseFloat(nicu_khusus_covid_confirm_p) # }}",
                    },
                    {
                        // isolasi_tanpa_tekanan_negatif_confirm_l
                        "field": "",
                        "title": "Nicu Khusus Covid",
                        "width": 110,
                        headerAttributes: { style: "text-align : center" },
                        "columns":[
                            {
                                "field" : "Suspect",
                                "title" : "Suspect",
                                "width": "75px",
                                headerAttributes: { style: "text-align : center" },
                                "columns":[
                                    {
                                        "field" : "nicu_khusus_covid_suspect_l",
                                        "title" : "L",
                                        "width": "75px",
                                        
                                    }, 
                                    {
                                        "field" : "nicu_khusus_covid_suspect_p",
                                        "title" : "P",
                                        "width": "75px",
                                    }
                                ]
                            }, 
                            {
                                "field" : "Confirm",
                                "title" : "Confirm",
                                "width": "75px",
                                headerAttributes: { style: "text-align : center" },
                                "columns":[
                                    {
                                        "field" : "nicu_khusus_covid_confirm_l",
                                        "title" : "L",
                                        "width": "75px",
                                        
                                    }, 
                                    {
                                        "field" : "nicu_khusus_covid_confirm_p",
                                        "title" : "P",
                                        "width": "75px",
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "field": "jmlpicucovid",
                        "title": "jml PICU Khusus Covid",
                        "width": 110,
                        "template": "{{ #= parseFloat(picu_khusus_covid_suspect_l) + parseFloat(picu_khusus_covid_suspect_p) + parseFloat(picu_khusus_covid_confirm_l) + parseFloat(nicu_khusus_covid_confirm_p) # }}",
                    },
                    {
                        "field": "",
                        "title": "PICU Khusus Covid",
                        "width": 110,
                        headerAttributes: { style: "text-align : center" },
                        "columns":[
                            {
                                "field" : "Suspect",
                                "title" : "Suspect",
                                "width": "75px",
                                headerAttributes: { style: "text-align : center" },
                                "columns":[
                                    {
                                        "field" : "picu_khusus_covid_suspect_l",
                                        "title" : "L",
                                        "width": "75px",
                                        
                                    }, 
                                    {
                                        "field" : "picu_khusus_covid_suspect_p",
                                        "title" : "P",
                                        "width": "75px",
                                    }
                                ]
                            }, 
                            {
                                "field" : "Confirm",
                                "title" : "Confirm",
                                "width": "75px",
                                headerAttributes: { style: "text-align : center" },
                                "columns":[
                                    {
                                        "field" : "picu_khusus_covid_confirm_l",
                                        "title" : "L",
                                        "width": "75px",
                                        
                                    }, 
                                    {
                                        "field" : "picu_khusus_covid_confirm_p",
                                        "title" : "P",
                                        "width": "75px",
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "field": "",
                        "title": "jml ICU Tekanan Negatif dengan Ventilator",
                        "width": 110,
                        "template": "{{ #= parseFloat(icu_tekanan_negatif_dengan_ventilator_suspect_l) + parseFloat(icu_tekanan_negatif_dengan_ventilator_suspect_p) + parseFloat(icu_tekanan_negatif_dengan_ventilator_confirm_l) + parseFloat(icu_tekanan_negatif_dengan_ventilator_confirm_p) # }}",
                    },
                    {
                        "field": "",
                        "title": "ICU Tekanan Negatif dengan Ventilator",
                        "width": 110,
                        headerAttributes: { style: "text-align : center" },
                        "columns":[
                            {
                                "field" : "Suspect",
                                "title" : "Suspect",
                                "width": "75px",
                                headerAttributes: { style: "text-align : center" },
                                "columns":[
                                    {
                                        "field" : "icu_tekanan_negatif_dengan_ventilator_suspect_l",
                                        "title" : "L",
                                        "width": "75px",
                                        
                                    }, 
                                    {
                                        "field" : "icu_tekanan_negatif_dengan_ventilator_suspect_p",
                                        "title" : "P",
                                        "width": "75px",
                                    }
                                ]
                            }, 
                            {
                                "field" : "Confirm",
                                "title" : "Confirm",
                                "width": "75px",
                                headerAttributes: { style: "text-align : center" },
                                "columns":[
                                    {
                                        "field" : "icu_tekanan_negatif_dengan_ventilator_confirm_l",
                                        "title" : "L",
                                        "width": "75px",
                                        
                                    }, 
                                    {
                                        "field" : "icu_tekanan_negatif_dengan_ventilator_confirm_p",
                                        "title" : "P",
                                        "width": "75px",
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "field": "",
                        "title": "jml ICU Tekanan Negatif Tanpa Ventilator",
                        "width": 110,
                        "template": "{{ #= parseFloat(icu_tekanan_negatif_tanpa_ventilator_suspect_l) + parseFloat(icu_tekanan_negatif_tanpa_ventilator_suspect_p) + parseFloat(icu_tekanan_negatif_tanpa_ventilator_confirm_l) + parseFloat(icu_tekanan_negatif_tanpa_ventilator_confirm_p) # }}",
                    },
                    {
                        "field": "",
                        "title": "ICU Tekanan Negatif Tanpa Ventilator",
                        "width": 110,
                        headerAttributes: { style: "text-align : center" },
                        "columns":[
                            {
                                "field" : "Suspect",
                                "title" : "Suspect",
                                "width": "75px",
                                headerAttributes: { style: "text-align : center" },
                                "columns":[
                                    {
                                        "field" : "icu_tekanan_negatif_tanpa_ventilator_suspect_l",
                                        "title" : "L",
                                        "width": "75px",
                                        
                                    }, 
                                    {
                                        "field" : "icu_tekanan_negatif_tanpa_ventilator_suspect_p",
                                        "title" : "P",
                                        "width": "75px",
                                    }
                                ]
                            }, 
                            {
                                "field" : "Confirm",
                                "title" : "Confirm",
                                "width": "75px",
                                headerAttributes: { style: "text-align : center" },
                                "columns":[
                                    {
                                        "field" : "icu_tekanan_negatif_tanpa_ventilator_confirm_l",
                                        "title" : "L",
                                        "width": "75px",
                                        
                                    }, 
                                    {
                                        "field" : "icu_tekanan_negatif_tanpa_ventilator_confirm_p",
                                        "title" : "P",
                                        "width": "75px",
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "field": "",
                        "title": "jml ICU Tanpa Tekanan Negatif Tanpa Ventilator",
                        "width": 110,
                        // "template": "{{ #= icu_tanap_tekanan_negatif_tanpa_ventilator_suspect_l + icu_tanap_tekanan_negatif_tanpa_ventilator_suspect_p + icu_tanpa_tekanan_negatif_tanpa_ventilator_confirm_l + icu_tanpa_tekanan_negatif_tanpa_ventilator_confirm_p # }}",
                    },
                    {
                        "field": "isolasi_tekanan_negatif_confirm_l",
                        "title": "ICU Tanpa Tekanan Negatif Tanpa Ventilator",
                        "width": 110,
                        headerAttributes: { style: "text-align : center" },
                        "columns":[
                            {
                                "field" : "Suspect",
                                "title" : "Suspect",
                                "width": "75px",
                                headerAttributes: { style: "text-align : center" },
                                "columns":[
                                    {
                                        "field" : "icu_tanap_tekanan_negatif_tanpa_ventilator_suspect_l",
                                        "title" : "L",
                                        "width": "75px",
                                        
                                    }, 
                                    {
                                        "field" : "icu_tanap_tekanan_negatif_tanpa_ventilator_suspect_p",
                                        "title" : "P",
                                        "width": "75px",
                                    }
                                ]
                            }, 
                            {
                                "field" : "Confirm",
                                "title" : "Confirm",
                                "width": "75px",
                                headerAttributes: { style: "text-align : center" },
                                "columns":[
                                    {
                                        "field" : "icu_tanpa_tekanan_negatif_tanpa_ventilator_confirm_l",
                                        "title" : "L",
                                        "width": "75px",
                                        
                                    }, 
                                    {
                                        "field" : "icu_tanpa_tekanan_negatif_tanpa_ventilator_confirm_p",
                                        "title" : "P",
                                        "width": "75px",
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "field": "",
                        "title": "jml Isolasi Tekanan Negatif",
                        "width": 110,
                        "template": "{{ #= parseFloat(isolasi_tekanan_negatif_suspect_l) + parseFloat(isolasi_tekanan_negatif_suspect_p) + parseFloat(isolasi_tekanan_negatif_confirm_l) + parseFloat(isolasi_tekanan_negatif_confirm_p) # }}",
                    },
                    {
                        "field": "",
                        "title": "Isolasi Tekanan Negatif",
                        "width": 110,
                        headerAttributes: { style: "text-align : center" },
                        "columns":[
                            {
                                "field" : "Suspect",
                                "title" : "Suspect",
                                "width": "75px",
                                headerAttributes: { style: "text-align : center" },
                                "columns":[
                                    {
                                        "field" : "isolasi_tekanan_negatif_suspect_l",
                                        "title" : "L",
                                        "width": "75px",
                                        
                                    }, 
                                    {
                                        "field" : "isolasi_tekanan_negatif_suspect_p",
                                        "title" : "P",
                                        "width": "75px",
                                    }
                                ]
                            }, 
                            {
                                "field" : "Confirm",
                                "title" : "Confirm",
                                "width": "75px",
                                headerAttributes: { style: "text-align : center" },
                                "columns":[
                                    {
                                        "field" : "isolasi_tekanan_negatif_confirm_l",
                                        "title" : "L",
                                        "width": "75px",
                                        
                                    }, 
                                    {
                                        "field" : "isolasi_tekanan_negatif_confirm_p",
                                        "title" : "P",
                                        "width": "75px",
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "field": "",
                        "title": "jml Isolasi Tanpa Tekanan Negatif",
                        "width": 110,
                        "template": "{{ #= parseFloat(isolasi_tanpa_tekanan_negatif_suspect_l) + parseFloat(isolasi_tanpa_tekanan_negatif_suspect_p) + parseFloat(isolasi_tanpa_tekanan_negatif_confirm_l) + parseFloat(isolasi_tanpa_tekanan_negatif_confirm_p) # }}",
                    },
                    {
                        "field": "",
                        "title": "Isolasi Tanpa Tekanan Negatif",
                        "width": 110,
                        headerAttributes: { style: "text-align : center" },
                        "columns":[
                            {
                                "field" : "Suspect",
                                "title" : "Suspect",
                                "width": "75px",
                                headerAttributes: { style: "text-align : center" },
                                "columns":[
                                    {
                                        "field" : "isolasi_tanpa_tekanan_negatif_suspect_l",
                                        "title" : "L",
                                        "width": "75px",
                                        
                                    }, 
                                    {
                                        "field" : "isolasi_tanpa_tekanan_negatif_suspect_p",
                                        "title" : "P",
                                        "width": "75px",
                                    }
                                ]
                            }, 
                            {
                                "field" : "Confirm",
                                "title" : "Confirm",
                                "width": "75px",
                                headerAttributes: { style: "text-align : center" },
                                "columns":[
                                    {
                                        "field" : "isolasi_tanpa_tekanan_negatif_confirm_l",
                                        "title" : "L",
                                        "width": "75px",
                                        
                                    }, 
                                    {
                                        "field" : "isolasi_tanpa_tekanan_negatif_confirm_p",
                                        "title" : "P",
                                        "width": "75px",
                                    }
                                ]
                            }
                        ]
                    },

                    {
                        "field": "tgl_lapor",
                        "title": "Tgl Lapor",
                        "width": 80,
                    },

                ],
            };
            $scope.gridNonKomorbid = {

                selectable: 'row',
                pageable: true,
                columns: [
                    // {
                    //     "field": "no",
                    //     "title": "No",
                    //     "width": 15,
                    // },
                    {
                        "field": "tanggal",
                        "title": "Tanggal",
                        "width": 110,
                    },
                    {
                        "field": "",
                        "title": "jml Nicu Khusus Covid",
                        "width": 110,
                        "template": "{{ #= parseFloat(nicu_khusus_covid_suspect_l) + parseFloat(nicu_khusus_covid_suspect_p) + parseFloat(nicu_khusus_covid_confirm_l) + parseFloat(nicu_khusus_covid_confirm_p) # }}",
                    },
                    {
                        // isolasi_tanpa_tekanan_negatif_confirm_l
                        "field": "",
                        "title": "Nicu Khusus Covid",
                        "width": 110,
                        headerAttributes: { style: "text-align : center" },
                        "columns":[
                            {
                                "field" : "Suspect",
                                "title" : "Suspect",
                                "width": "75px",
                                headerAttributes: { style: "text-align : center" },
                                "columns":[
                                    {
                                        "field" : "nicu_khusus_covid_suspect_l",
                                        "title" : "L",
                                        "width": "75px",
                                        
                                    }, 
                                    {
                                        "field" : "nicu_khusus_covid_suspect_p",
                                        "title" : "P",
                                        "width": "75px",
                                    }
                                ]
                            }, 
                            {
                                "field" : "Confirm",
                                "title" : "Confirm",
                                "width": "75px",
                                headerAttributes: { style: "text-align : center" },
                                "columns":[
                                    {
                                        "field" : "nicu_khusus_covid_confirm_l",
                                        "title" : "L",
                                        "width": "75px",
                                        
                                    }, 
                                    {
                                        "field" : "nicu_khusus_covid_confirm_p",
                                        "title" : "P",
                                        "width": "75px",
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "field": "jmlpicucovid",
                        "title": "jml PICU Khusus Covid",
                        "width": 110,
                        "template": "{{ #= parseFloat(picu_khusus_covid_suspect_l) + parseFloat(picu_khusus_covid_suspect_p) + parseFloat(picu_khusus_covid_confirm_l) + parseFloat(nicu_khusus_covid_confirm_p) # }}",
                    },
                    {
                        "field": "",
                        "title": "PICU Khusus Covid",
                        "width": 110,
                        headerAttributes: { style: "text-align : center" },
                        "columns":[
                            {
                                "field" : "Suspect",
                                "title" : "Suspect",
                                "width": "75px",
                                headerAttributes: { style: "text-align : center" },
                                "columns":[
                                    {
                                        "field" : "picu_khusus_covid_suspect_l",
                                        "title" : "L",
                                        "width": "75px",
                                        
                                    }, 
                                    {
                                        "field" : "picu_khusus_covid_suspect_p",
                                        "title" : "P",
                                        "width": "75px",
                                    }
                                ]
                            }, 
                            {
                                "field" : "Confirm",
                                "title" : "Confirm",
                                "width": "75px",
                                headerAttributes: { style: "text-align : center" },
                                "columns":[
                                    {
                                        "field" : "picu_khusus_covid_confirm_l",
                                        "title" : "L",
                                        "width": "75px",
                                        
                                    }, 
                                    {
                                        "field" : "picu_khusus_covid_confirm_p",
                                        "title" : "P",
                                        "width": "75px",
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "field": "",
                        "title": "jml ICU Tekanan Negatif dengan Ventilator",
                        "width": 110,
                        "template": "{{ #= parseFloat(icu_tekanan_negatif_dengan_ventilator_suspect_l) + parseFloat(icu_tekanan_negatif_dengan_ventilator_suspect_p) + parseFloat(icu_tekanan_negatif_dengan_ventilator_confirm_l) + parseFloat(icu_tekanan_negatif_dengan_ventilator_confirm_p) # }}",
                    },
                    {
                        "field": "",
                        "title": "ICU Tekanan Negatif dengan Ventilator",
                        "width": 110,
                        headerAttributes: { style: "text-align : center" },
                        "columns":[
                            {
                                "field" : "Suspect",
                                "title" : "Suspect",
                                "width": "75px",
                                headerAttributes: { style: "text-align : center" },
                                "columns":[
                                    {
                                        "field" : "icu_tekanan_negatif_dengan_ventilator_suspect_l",
                                        "title" : "L",
                                        "width": "75px",
                                        
                                    }, 
                                    {
                                        "field" : "icu_tekanan_negatif_dengan_ventilator_suspect_p",
                                        "title" : "P",
                                        "width": "75px",
                                    }
                                ]
                            }, 
                            {
                                "field" : "Confirm",
                                "title" : "Confirm",
                                "width": "75px",
                                headerAttributes: { style: "text-align : center" },
                                "columns":[
                                    {
                                        "field" : "icu_tekanan_negatif_dengan_ventilator_confirm_l",
                                        "title" : "L",
                                        "width": "75px",
                                        
                                    }, 
                                    {
                                        "field" : "icu_tekanan_negatif_dengan_ventilator_confirm_p",
                                        "title" : "P",
                                        "width": "75px",
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "field": "",
                        "title": "jml ICU Tekanan Negatif Tanpa Ventilator",
                        "width": 110,
                        "template": "{{ #= parseFloat(icu_tekanan_negatif_tanpa_ventilator_suspect_l) + parseFloat(icu_tekanan_negatif_tanpa_ventilator_suspect_p) + parseFloat(icu_tekanan_negatif_tanpa_ventilator_confirm_l) + parseFloat(icu_tekanan_negatif_tanpa_ventilator_confirm_p) # }}",
                    },
                    {
                        "field": "",
                        "title": "ICU Tekanan Negatif Tanpa Ventilator",
                        "width": 110,
                        headerAttributes: { style: "text-align : center" },
                        "columns":[
                            {
                                "field" : "Suspect",
                                "title" : "Suspect",
                                "width": "75px",
                                headerAttributes: { style: "text-align : center" },
                                "columns":[
                                    {
                                        "field" : "icu_tekanan_negatif_tanpa_ventilator_suspect_l",
                                        "title" : "L",
                                        "width": "75px",
                                        
                                    }, 
                                    {
                                        "field" : "icu_tekanan_negatif_tanpa_ventilator_suspect_p",
                                        "title" : "P",
                                        "width": "75px",
                                    }
                                ]
                            }, 
                            {
                                "field" : "Confirm",
                                "title" : "Confirm",
                                "width": "75px",
                                headerAttributes: { style: "text-align : center" },
                                "columns":[
                                    {
                                        "field" : "icu_tekanan_negatif_tanpa_ventilator_confirm_l",
                                        "title" : "L",
                                        "width": "75px",
                                        
                                    }, 
                                    {
                                        "field" : "icu_tekanan_negatif_tanpa_ventilator_confirm_p",
                                        "title" : "P",
                                        "width": "75px",
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "field": "",
                        "title": "jml ICU Tanpa Tekanan Negatif Tanpa Ventilator",
                        "width": 110,
                    },
                    {
                        "field": "isolasi_tekanan_negatif_confirm_l",
                        "title": "ICU Tanpa Tekanan Negatif Tanpa Ventilator",
                        "width": 110,
                        headerAttributes: { style: "text-align : center" },
                        "columns":[
                            {
                                "field" : "Suspect",
                                "title" : "Suspect",
                                "width": "75px",
                                headerAttributes: { style: "text-align : center" },
                                "columns":[
                                    {
                                        "field" : "icu_tanap_tekanan_negatif_tanpa_ventilator_suspect_l",
                                        "title" : "L",
                                        "width": "75px",
                                        
                                    }, 
                                    {
                                        "field" : "icu_tanap_tekanan_negatif_tanpa_ventilator_suspect_p",
                                        "title" : "P",
                                        "width": "75px",
                                    }
                                ]
                            }, 
                            {
                                "field" : "Confirm",
                                "title" : "Confirm",
                                "width": "75px",
                                headerAttributes: { style: "text-align : center" },
                                "columns":[
                                    {
                                        "field" : "icu_tanpa_tekanan_negatif_tanpa_ventilator_confirm_l",
                                        "title" : "L",
                                        "width": "75px",
                                        
                                    }, 
                                    {
                                        "field" : "icu_tanpa_tekanan_negatif_tanpa_ventilator_confirm_p",
                                        "title" : "P",
                                        "width": "75px",
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "field": "",
                        "title": "jml Isolasi Tekanan Negatif",
                        "width": 110,
                        "template": "{{ #= parseFloat(isolasi_tekanan_negatif_suspect_l) + parseFloat(isolasi_tekanan_negatif_suspect_p) + parseFloat(isolasi_tekanan_negatif_confirm_l) + parseFloat(isolasi_tekanan_negatif_confirm_p) # }}",
                    },
                    {
                        "field": "",
                        "title": "Isolasi Tekanan Negatif",
                        "width": 110,
                        headerAttributes: { style: "text-align : center" },
                        "columns":[
                            {
                                "field" : "Suspect",
                                "title" : "Suspect",
                                "width": "75px",
                                headerAttributes: { style: "text-align : center" },
                                "columns":[
                                    {
                                        "field" : "isolasi_tekanan_negatif_suspect_l",
                                        "title" : "L",
                                        "width": "75px",
                                        
                                    }, 
                                    {
                                        "field" : "isolasi_tekanan_negatif_suspect_p",
                                        "title" : "P",
                                        "width": "75px",
                                    }
                                ]
                            }, 
                            {
                                "field" : "Confirm",
                                "title" : "Confirm",
                                "width": "75px",
                                headerAttributes: { style: "text-align : center" },
                                "columns":[
                                    {
                                        "field" : "isolasi_tekanan_negatif_confirm_l",
                                        "title" : "L",
                                        "width": "75px",
                                        
                                    }, 
                                    {
                                        "field" : "isolasi_tekanan_negatif_confirm_p",
                                        "title" : "P",
                                        "width": "75px",
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "field": "",
                        "title": "jml Isolasi Tanpa Tekanan Negatif",
                        "width": 110,
                        "template": "{{ #= parseFloat(isolasi_tanpa_tekanan_negatif_suspect_l) + parseFloat(isolasi_tanpa_tekanan_negatif_suspect_p) + parseFloat(isolasi_tanpa_tekanan_negatif_confirm_l) + parseFloat(isolasi_tanpa_tekanan_negatif_confirm_p) # }}",
                    },
                    {
                        "field": "",
                        "title": "Isolasi Tanpa Tekanan Negatif",
                        "width": 110,
                        headerAttributes: { style: "text-align : center" },
                        "columns":[
                            {
                                "field" : "Suspect",
                                "title" : "Suspect",
                                "width": "75px",
                                headerAttributes: { style: "text-align : center" },
                                "columns":[
                                    {
                                        "field" : "isolasi_tanpa_tekanan_negatif_suspect_l",
                                        "title" : "L",
                                        "width": "75px",
                                        
                                    }, 
                                    {
                                        "field" : "isolasi_tanpa_tekanan_negatif_suspect_p",
                                        "title" : "P",
                                        "width": "75px",
                                    }
                                ]
                            }, 
                            {
                                "field" : "Confirm",
                                "title" : "Confirm",
                                "width": "75px",
                                headerAttributes: { style: "text-align : center" },
                                "columns":[
                                    {
                                        "field" : "isolasi_tanpa_tekanan_negatif_confirm_l",
                                        "title" : "L",
                                        "width": "75px",
                                        
                                    }, 
                                    {
                                        "field" : "isolasi_tanpa_tekanan_negatif_confirm_p",
                                        "title" : "P",
                                        "width": "75px",
                                    }
                                ]
                            }
                        ]
                    },

                    {
                        "field": "tgl_lapor",
                        "title": "Tgl Lapor",
                        "width": 80,
                    },

                ],
            };
            $scope.gridPasienKeluar = {

                selectable: 'row',
                pageable: true,
                columns: [
                    // {
                    //     "field": "no",
                    //     "title": "No",
                    //     "width": 15,
                    // },
                    {
                        "field": "tanggal",
                        "title": "Tanggal",
                        "width": 110,
                    },
                    {
                        "field": "sembuh",
                        "title": "Sembuh / APD (Atas Persetujuan Dokter)",
                        "width": 110,
                    },
                    {
                        "field": "discarded",
                        "title": "Discarded",
                        "width": 110,
                    },
                    {
                        "field": "",
                        "title": "Meninggal",
                        "width": 110,
                        headerAttributes: { style: "text-align : center" },
                        "columns":[
                            {
                                "field" : "meninggal_komorbid",
                                "title" : "Confirm dengan Komorbid",
                                "width": "75px",
                                
                            }, 
                            {
                                "field" : "meninggal_tanpa_komorbid",
                                "title" : "Confirm tanpa Komorbid",
                                "width": "75px",
                            }, 
                            {
                                "field" : "",
                                "title" : "Probable dengan Komorbid",
                                "width": "75px",
                                headerAttributes: { style: "text-align : center" },
                                "columns":[
                                    {
                                        "field" : "meninggal_prob_pre_komorbid",
                                        "title" : "Usia 0 - 6 hari",
                                        "width": "75px",
                                        
                                    }, 
                                    {
                                        "field" : "meninggal_prob_neo_komorbid",
                                        "title" : "Usia 7 - 28 hari",
                                        "width": "75px",
                                    },
                                    {
                                        "field" : "meninggal_prob_bayi_komorbid",
                                        "title" : "Usia 29 hari - < 1 tahun",
                                        "width": "75px",
                                        
                                    }, 
                                    {
                                        "field" : "meninggal_prob_balita_komorbid",
                                        "title" : "Usia 1 - 4 tahun",
                                        "width": "75px",
                                    },
                                    {
                                        "field" : "meninggal_prob_anak_komorbid",
                                        "title" : "Usia 5 - 18 tahun",
                                        "width": "75px",
                                        
                                    }, 
                                    {
                                        "field" : "meninggal_prob_remaja_komorbid",
                                        "title" : "Usia 19 - 40 tahun",
                                        "width": "75px",
                                    },
                                    {
                                        "field" : "meninggal_prob_dws_komorbid",
                                        "title" : "Usia 41 - 60 tahun",
                                        "width": "75px",
                                        
                                    }, 
                                    {
                                        "field" : "meninggal_prob_lansia_komorbid",
                                        "title" : "Usia > 60 tahun",
                                        "width": "75px",
                                    }
                                ]
                            },
                            {
                                "field" : "",
                                "title" : "Probable tanpa Komorbid",
                                "width": "75px",
                                headerAttributes: { style: "text-align : center" },
                                "columns":[
                                    {
                                        "field" : "meninggal_prob_pre_tanpa_komorbid",
                                        "title" : "Usia 0 - 6 hari",
                                        "width": "75px",
                                        
                                    }, 
                                    {
                                        "field" : "meninggal_prob_neo_tanpa_komorbid",
                                        "title" : "Usia 7 - 28 hari",
                                        "width": "75px",
                                    },
                                    {
                                        "field" : "meninggal_prob_bayi_tanpa_komorbid",
                                        "title" : "Usia 29 hari - < 1 tahun",
                                        "width": "75px",
                                        
                                    }, 
                                    {
                                        "field" : "meninggal_prob_balita_tanpa_komorbid",
                                        "title" : "Usia 1 - 4 tahun",
                                        "width": "75px",
                                    },
                                    {
                                        "field" : "meninggal_prob_anak_tanpa_komorbid",
                                        "title" : "Usia 5 - 18 tahun",
                                        "width": "75px",
                                        
                                    }, 
                                    {
                                        "field" : "meninggal_prob_remaja_tanpa_komorbid",
                                        "title" : "Usia 19 - 40 tahun",
                                        "width": "75px",
                                    },
                                    {
                                        "field" : "meninggal_prob_dws_tanpa_komorbid",
                                        "title" : "Usia 41 - 60 tahun",
                                        "width": "75px",
                                        
                                    }, 
                                    {
                                        "field" : "meninggal_prob_lansia_tanpa_komorbid",
                                        "title" : "Usia > 60 tahun",
                                        "width": "75px",
                                    }
                                ]
                                
                            }, 
                            {
                                "field" : "meninggal_discarded_komorbid",
                                "title" : "Discarded dengan Komorbid",
                                "width": "75px",
                            }, 
                            {
                                "field" : "meninggal_discarded_tanpa_komorbid",
                                "title" : "Discarded tanpa Komorbid",
                                "width": "75px",
                            }
                        ]
                    },
                    {
                        "field": "dirujuk",
                        "title": "Di Rujuk",
                        "width": 110,
                    },
                    {
                        "field": "isman",
                        "title": "Isolasi Mandiri",
                        "width": 110,
                    },
                    {
                        "field": "aps",
                        "title": "APS / Atas Permintaan Sendiri / Kabur",
                        "width": 110,
                    },

                    {
                        "field": "tgl_lapor",
                        "title": "Tgl Lapor",
                        "width": 80,
                    },

                ],
            };
            $scope.gridTT = {

                selectable: 'row',
                pageable: true,
                columns: [
                    {
                        "field": "id_tt",
                        "title": "ID",
                        "width": 30,
                    },
                    {
                        "field": "ruang",
                        "title": "Ruangan",
                        "width": 110,
                    },
                     {
                        "field": "tt",
                        "title": "Tempat Tidur",
                        "width": 110,
                    },
                    {
                        "field": "jumlah_ruang",
                        "title": "Jumlah Ruangan",
                        "width": 110,
                    },
                    {
                        "field": "jumlah",
                        "title": "Kapasitas TT",
                        "width": 110,
                    },
                    {
                        "field": "terpakai",
                        "title": "Terpakai",
                        "width": 110,
                    },
                    {
                        "field": "kosong",
                        "title": "Kosong",
                        "width": 110,
                    },

                ],
            };
            $scope.gridSDM = {

                selectable: 'row',
                pageable: true,
                columns: [
                    {
                        "field": "id_kebutuhan",
                        "title": "ID",
                        "width": 30,
                    },
                    {
                        "field": "kebutuhan",
                        "title": "Jenis SDM",
                        "width": 110,
                    },
                    {
                        "field": "",
                        "title": "Eksisting",
                        "width": 110,
                        headerAttributes: { style: "text-align : center" },
                        "columns":[
                            {
                                "field" : "jumlah_eksisting",
                                "title" : "SDM RS",
                                "width": "75px",
                                
                            }, 
                            {
                                "field" : "",
                                "title" : "Relawan",
                                "width": "75px",
                            }
                        ]
                    },
                    {
                        "field": "jumlah",
                        "title": "Kebutuhan",
                        "width": 110,
                    },
                    // {
                    //     "field": "jumlah_diterima",
                    //     "title": "Jumlah Diterima",
                    //     "width": 110,
                    // },
                    {
                        "field": "tglupdate",
                        "title": "Tgl update",
                        "width": 110,
                    },

                ],
            };


            function loadCombo() {
                // medifirstService.get('laboratorium/get-combo-map-lab').then(function (e) {
                //     $scope.listJenisProduk = e.data.jenisproduk
                //     $scope.listJK = e.data.jeniskelamin
                //     $scope.listKelompokUmur = e.data.kelompokumur
                //     $scope.listProduk = e.data.produk
                //     $scope.listSatuan = e.data.satuanstandar
                //     $scope.listJenisPemeriksaan = e.data.detailjenisproduk
                // })
            }

            function loadDataJP() {
                var nama = ''
                if ($scope.item.cariJenisPemeriksaan != undefined) {
                    nama = $scope.item.cariJenisPemeriksaan
                }
                $scope.isRouteLoading =true
                medifirstService.postNonMessage('LapV2/PasienMasuk/get', {}).then(function (e) {
                    if (e.data.RekapPasienMasuk.length == undefined) {
                        $scope.sourceJenisPemeriksaan = []
                        return
                    }
                    for (let i = 0; i < e.data.RekapPasienMasuk.length; i++) {
                        const element = e.data.RekapPasienMasuk[i];
                        element.no = i + 1
                    }
                    e.data.RekapPasienMasuk.sort(function (a, b) {
                        if (a.tanggal > b.tanggal) { return -1; }
                        if (a.tanggal < b.tanggal) { return 1; }
                        return 0;
                    })
                    $scope.isRouteLoading =false
                    $scope.sourceJenisPemeriksaan = e.data.RekapPasienMasuk
                    // $scope.listJenisPemeriksaan = e.data.data
                })
            }
            var timeoutPromise
            $scope.$watch('item.tanggal', function (newVal, oldVal) {
                $timeout.cancel(timeoutPromise);
                timeoutPromise = $timeout(function () {
                    if (newVal && newVal !== oldVal) {
                        applyFilter("tanggal", newVal)
                    }
                }, 500)
            })
            function applyFilter(filterField, filterValue) {
                var dataGrid = $("#grid1").data("kendoGrid");
                var currFilterObject = dataGrid.dataSource.filter();
                var currentFilters = currFilterObject ? currFilterObject.filters : [];

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
                    })
                }

                dataGrid.dataSource.filter({
                    logic: "and",
                    filters: currentFilters
                })
            }
            $scope.resetFilter1 = function () {
                var dataGrid = $("#grid1").data("kendoGrid");
                dataGrid.dataSource.filter({});
                $scope.item = {};
            }
            $scope.SaveJP = function () {
                if ($scope.item.tglsave1 == undefined) {
                    toastr.error('Pilih tanggal dulu')
                    return
                }
                var tgl = moment($scope.item.tglsave1).format('YYYY-MM-DD')
                medifirstService.postNonMessage('LapV2/PasienMasuk/post', { 'tgl': tgl }).then(function (e) {
                    toastr.success(e.data.RekapPasienMasuk[0].message)
                    $scope.BatalJP()
                    loadDataJP()
                    // loadCombo()
                })

            }
            $scope.BatalJP = function () {
                $scope.item = {}
            }
            $scope.HapusJP = function () {
                if ($scope.selectedJenisPemeriksaan == undefined) {
                    toastr.error('Pilih data dulu')
                    return
                }
                medifirstService.postNonMessage('LapV2/PasienMasuk/delete', { 'tgl': $scope.selectedJenisPemeriksaan.tanggal }).then(function (e) {
                    toastr.success(e.data.RekapPasienMasuk[0].message)
                    $scope.BatalJP()
                    loadDataJP()
                    // loadCombo()
                })
            }
            function loadMap() {
                $scope.isRouteLoading =true
                medifirstService.postNonMessage('LapV2/PasienDirawatKomorbid/get', {}).then(function (e) {
                    if (e.data.RekapPasienDirawatKomorbid.length == undefined) {
                        $scope.sourceKomorbid = []
                        return
                    }
                    for (let i = 0; i < e.data.RekapPasienDirawatKomorbid.length; i++) {
                        const element = e.data.RekapPasienDirawatKomorbid[i];
                        element.no = i + 1
                    }
                    e.data.RekapPasienDirawatKomorbid.sort(function (a, b) {
                        if (a.tanggal < b.tanggal) { return -1; }
                        if (a.tanggal > b.tanggal) { return 1; }
                        return 0;
                    })
                    $scope.isRouteLoading =false
                    $scope.sourceKomorbid = e.data.RekapPasienDirawatKomorbid
                    // $scope.listJenisPemeriksaan = e.data.data
                })
            }
            var timeoutPromise
            $scope.$watch('item2.tanggal', function (newVal, oldVal) {
                $timeout.cancel(timeoutPromise);
                timeoutPromise = $timeout(function () {
                    if (newVal && newVal !== oldVal) {
                        applyFilter2("tanggal", newVal)
                    }
                }, 500)
            })
            function applyFilter2(filterField, filterValue) {
                var dataGrid = $("#grid2").data("kendoGrid");
                var currFilterObject = dataGrid.dataSource.filter();
                var currentFilters = currFilterObject ? currFilterObject.filters : [];

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
                    })
                }

                dataGrid.dataSource.filter({
                    logic: "and",
                    filters: currentFilters
                })
            }
            $scope.resetFilter2 = function () {
                var dataGrid = $("#grid2").data("kendoGrid");
                dataGrid.dataSource.filter({});
                $scope.item2 = {};
            }

            $scope.SaveKom = function () {
                if ($scope.item2.tglsave1 == undefined) {
                    toastr.error('Pilih tanggal dulu')
                    return
                }
                var tgl = moment($scope.item2.tglsave1).format('YYYY-MM-DD')
                medifirstService.postNonMessage('LapV2/PasienDirawatKomorbid/post', { 'tgl': tgl }).then(function (e) {
                    toastr.success(e.data.RekapPasienDirawatKomorbid[0].message)
                    $scope.BatalKom()
                    loadMap()
                })

            }
            $scope.BatalKom = function () {
                $scope.item2 = {}
                $scope.selectedKomorbid = undefined
            }
            $scope.HapusKom = function () {
                if ($scope.selectedKomorbid == undefined) {
                    toastr.error('Pilih data dulu')
                    return
                }
                medifirstService.postNonMessage('LapV2/PasienDirawatKomorbid/delete', { 'tgl': $scope.selectedKomorbid.tanggal }).then(function (e) {
                    toastr.success(e.data.RekapPasienDirawatKomorbid[0].message)
                    $scope.BatalKom()
                    loadMap()
                })
            }



            // --------------
            function loadDataSH() {
                $scope.isRouteLoading =true
                medifirstService.postNonMessage('LapV2/PasienDirawatTanpaKomorbid/get', {}).then(function (e) {
                    if (e.data.RekapPasienDirawatTanpaKomorbid.length == undefined) {
                        $scope.sourceNonKomorbid = []
                        return
                    }
                    for (let i = 0; i < e.data.RekapPasienDirawatTanpaKomorbid.length; i++) {
                        const element = e.data.RekapPasienDirawatTanpaKomorbid[i];
                        element.no = i + 1
                    }
                    e.data.RekapPasienDirawatTanpaKomorbid.sort(function (a, b) {
                        if (a.tanggal < b.tanggal) { return -1; }
                        if (a.tanggal > b.tanggal) { return 1; }
                        return 0;
                    })
                    $scope.isRouteLoading =false
                    $scope.sourceNonKomorbid = e.data.RekapPasienDirawatTanpaKomorbid
                })
            }
            var timeoutPromise
            $scope.$watch('item3.tanggal', function (newVal, oldVal) {
                $timeout.cancel(timeoutPromise);
                timeoutPromise = $timeout(function () {
                    if (newVal && newVal !== oldVal) {
                        applyFilter3("tanggal", newVal)
                    }
                }, 500)
            })
            function applyFilter3(filterField, filterValue) {
                var dataGrid = $("#grid3").data("kendoGrid");
                var currFilterObject = dataGrid.dataSource.filter();
                var currentFilters = currFilterObject ? currFilterObject.filters : [];

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
                    })
                }

                dataGrid.dataSource.filter({
                    logic: "and",
                    filters: currentFilters
                })
            }
            $scope.resetFilter3 = function () {
                var dataGrid = $("#grid3").data("kendoGrid");
                dataGrid.dataSource.filter({});
                $scope.item3 = {};
            }

            $scope.SaveNonKom = function () {
                if ($scope.item3.tglsave1 == undefined) {
                    toastr.error('Pilih tanggal dulu')
                    return
                }
                var tgl = moment($scope.item3.tglsave1).format('YYYY-MM-DD')
                medifirstService.postNonMessage('LapV2/PasienDirawatTanpaKomorbid/post', { 'tgl': tgl }).then(function (e) {
                    toastr.success(e.data.RekapPasienDirawatTanpaKomorbid[0].message)
                    $scope.BatalNonKom()
                    loadDataSH()
                })

            }
            $scope.BatalNonKom = function () {
                $scope.item3 = {}
                $scope.selectedNonKomorbid = undefined
            }
            $scope.HapusNonKom = function () {
                if ($scope.selectedNonKomorbid == undefined) {
                    toastr.error('Pilih data dulu')
                    return
                }
                medifirstService.postNonMessage('LapV2/PasienDirawatTanpaKomorbid/delete', { 'tgl': $scope.selectedNonKomorbid.tanggal }).then(function (e) {
                    toastr.success(e.data.RekapPasienDirawatTanpaKomorbid[0].message)
                    $scope.BatalNonKom()
                    loadDataSH()
                })
            }
            // ------------

            // --------------
            function loadDataNilai() {
                $scope.isRouteLoading =true
                medifirstService.postNonMessage('LapV2/PasienKeluar/get', {}).then(function (e) {
                    if (e.data.RekapPasienKeluar.length == undefined) {
                        $scope.sourcePasienKeluar = []
                        return
                    }
                    for (let i = 0; i < e.data.RekapPasienKeluar.length; i++) {
                        const element = e.data.RekapPasienKeluar[i];
                        element.no = i + 1
                    }
                    e.data.RekapPasienKeluar.sort(function (a, b) {
                        if (a.tanggal < b.tanggal) { return -1; }
                        if (a.tanggal > b.tanggal) { return 1; }
                        return 0;
                    })
                    $scope.isRouteLoading =false
                    $scope.sourcePasienKeluar = e.data.RekapPasienKeluar
                })
            }
            var timeoutPromise
            $scope.$watch('item3.tanggal', function (newVal, oldVal) {
                $timeout.cancel(timeoutPromise);
                timeoutPromise = $timeout(function () {
                    if (newVal && newVal !== oldVal) {
                        applyFilter3("tanggal", newVal)
                    }
                }, 500)
            })
            function applyFilter3(filterField, filterValue) {
                var dataGrid = $("#grid4").data("kendoGrid");
                var currFilterObject = dataGrid.dataSource.filter();
                var currentFilters = currFilterObject ? currFilterObject.filters : [];

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
                    })
                }

                dataGrid.dataSource.filter({
                    logic: "and",
                    filters: currentFilters
                })
            }
            $scope.resetFilter4 = function () {
                var dataGrid = $("#grid4").data("kendoGrid");
                dataGrid.dataSource.filter({});
                $scope.item4 = {};
            }

            $scope.SaveKeluar = function () {
                if ($scope.item4.tglsave1 == undefined) {
                    toastr.error('Pilih tanggal dulu')
                    return
                }
                var tgl = moment($scope.item4.tglsave1).format('YYYY-MM-DD')
                medifirstService.postNonMessage('LapV2/PasienKeluar/post', { 'tgl': tgl }).then(function (e) {
                    toastr.success(e.data.RekapPasienKeluar[0].message)
                    $scope.BatalKeluar()
                    loadDataNilai()
                })

            }
            $scope.BatalKeluar = function () {
                $scope.item4 = {}
                $scope.selectedPasienKeluar = undefined
            }
            $scope.HapusKeluar = function () {
                if ($scope.selectedPasienKeluar == undefined) {
                    toastr.error('Pilih data dulu')
                    return
                }
                medifirstService.postNonMessage('LapV2/PasienKeluar/delete', { 'tgl': $scope.selectedPasienKeluar.tanggal }).then(function (e) {
                    toastr.success(e.data.RekapPasienKeluar[0].message)
                    $scope.BatalKeluar()
                    loadDataNilai()
                })
            }
            // ------------

            // --------------
            function loadTT() {
                $scope.isRouteLoading =true
                let datatt= []
                medifirstService.postNonMessage('Fasyankes/get', {}).then(function (e) {
                    datatt =[]
                    if (e.data.fasyankes.length == undefined) {
                        $scope.sourceTT = []
                        return
                    }
                    for (let i = 0; i < e.data.fasyankes.length; i++) {
                        const element = e.data.fasyankes[i];
                        element.no = i + 1
                        if(element.ruang !=null){
                            datatt.push(element)
                        }
                    }
                    // e.data.RekapPasienKeluar.sort(function (a, b) {
                    //     if (a.tanggal < b.tanggal) { return -1; }
                    //     if (a.tanggal > b.tanggal) { return 1; }
                    //     return 0;
                    // })
                    $scope.isRouteLoading =false
                    $scope.sourceTT = datatt
                })
            }
            var timeoutPromise
            $scope.$watch('item5.tanggal', function (newVal, oldVal) {
                $timeout.cancel(timeoutPromise);
                timeoutPromise = $timeout(function () {
                    if (newVal && newVal !== oldVal) {
                        applyFilter5("tt", newVal)
                    }
                }, 500)
            })
            function applyFilter5(filterField, filterValue) {
                var dataGrid = $("#grid5").data("kendoGrid");
                var currFilterObject = dataGrid.dataSource.filter();
                var currentFilters = currFilterObject ? currFilterObject.filters : [];

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
                    })
                }

                dataGrid.dataSource.filter({
                    logic: "and",
                    filters: currentFilters
                })
            }
            $scope.resetFilter5 = function () {
                var dataGrid = $("#grid5").data("kendoGrid");
                dataGrid.dataSource.filter({});
                $scope.item5 = {};
            }

            $scope.saveTT = function () {
                // if ($scope.item5.tglsave1 == undefined) {
                //     toastr.error('Pilih tanggal dulu')
                //     return
                // }
                // var tgl = moment($scope.item4.tglsave1).format('YYYY-MM-DD')
                medifirstService.postNonMessage('Fasyankes/post', {}).then(function (e) {
                    toastr.success(e.data.fasyankes[0].message)
                    // $scope.BatalKeluar()
                    loadTT()
                })

            }
            // $scope.BatalKeluar = function () {
            //     $scope.item4 = {}
            //     $scope.selectedPasienKeluar = undefined
            // }
            $scope.hapusTT = function () {
                if ($scope.selectedTT == undefined) {
                    toastr.error('Pilih data dulu')
                    return
                }
                medifirstService.postNonMessage('Fasyankes/delete', { 'id_t_tt': $scope.selectedTT.id_t_tt }).then(function (e) {
                    toastr.success(e.data.fasyankes[0].message)
                    // $scope.BatalKeluar()
                    loadTT()
                })
            }
            $scope.hapusTTSemua = function(){
               for (let i = 0; i < $scope.sourceTT.length; i++) {
                    const element = $scope.sourceTT[i];
                     medifirstService.postNonMessage('Fasyankes/delete', { 'id_t_tt': element.id_t_tt }).then(function (e) {
                          toastr.success(e.data.fasyankes[0].message)
                     
                    })
                }
            }
            // ------------

             // --------------
             function loadSDM() {
                 $scope.isRouteLoading =true
                medifirstService.postNonMessage('Fasyankes/sdm/get', {}).then(function (e) {
                    if (e.data.sdm.length == undefined) {
                        $scope.sourceSDM = []
                        return
                    }
                    for (let i = 0; i < e.data.sdm.length; i++) {
                        const element = e.data.sdm[i];
                        element.no = i + 1
                    }
                    // e.data.RekapPasienKeluar.sort(function (a, b) {
                    //     if (a.tanggal < b.tanggal) { return -1; }
                    //     if (a.tanggal > b.tanggal) { return 1; }
                    //     return 0;
                    // })
                    $scope.isRouteLoading =false
                    $scope.sourceSDM = e.data.sdm
                })
            }
            var timeoutPromise
            $scope.$watch('item6.tanggal', function (newVal, oldVal) {
                $timeout.cancel(timeoutPromise);
                timeoutPromise = $timeout(function () {
                    if (newVal && newVal !== oldVal) {
                        applyFilter6("kebutuhan", newVal)
                    }
                }, 500)
            })
            function applyFilter6(filterField, filterValue) {
                var dataGrid = $("#grid6").data("kendoGrid");
                var currFilterObject = dataGrid.dataSource.filter();
                var currentFilters = currFilterObject ? currFilterObject.filters : [];

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
                    })
                }

                dataGrid.dataSource.filter({
                    logic: "and",
                    filters: currentFilters
                })
            }
            $scope.resetFilter6 = function () {
                var dataGrid = $("#grid6").data("kendoGrid");
                dataGrid.dataSource.filter({});
                $scope.item6 = {};
            }

            $scope.saveSDM = function () {
                // if ($scope.item5.tglsave1 == undefined) {
                //     toastr.error('Pilih tanggal dulu')
                //     return
                // }
                // var tgl = moment($scope.item4.tglsave1).format('YYYY-MM-DD')
                medifirstService.postNonMessage('Fasyankes/sdm/post', {}).then(function (e) {
                    toastr.success(e.data.sdm[0].message)
                    // $scope.BatalKeluar()
                    loadSDM()
                })

            }
            // $scope.BatalKeluar = function () {
            //     $scope.item4 = {}
            //     $scope.selectedPasienKeluar = undefined
            // }
            $scope.hapusSDM = function () {
                if ($scope.selectedSDM == undefined) {
                    toastr.error('Pilih data dulu')
                    return
                }
                medifirstService.postNonMessage('Fasyankes/sdm/delete', { 'id_kebutuhan': $scope.selectedSDM.id_kebutuhan }).then(function (e) {
                    toastr.success(e.data.sdm[0].message)
                    // $scope.BatalKeluar()
                    loadSDM()
                })
            }
            // ------------
            //***********************************

        }
    ]);
});

// http://127.0.0.1:1237/printvb/farmasiApotik?cetak-label-etiket=1&norec=6a287c10-8cce-11e7-943b-2f7b4944&cetak=1