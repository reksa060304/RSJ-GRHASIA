define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict';
    initialize.controller('EPPSpsikologiCtrl', ['$scope', '$state', 'ModelItem', '$mdDialog', 'MedifirstService', 'CacheHelper', 'DateHelper',
        function ($scope, $state, ModelItem, $mdDialog, medifirstService, cacheHelper, dateHelper) {
            $scope.item = {}
            $scope.item.idNormaPsikologi = null;
            $scope.now = new Date();
            $scope.item.tglTes = moment($scope.now).format("YYYY-MM-DD HH:mm:ss")
            $scope.listEPPS1Fix = {}
            var chacePeriode = cacheHelper.get('EPPSpsikologiCtrl');
            $scope.listEPPS1Perempuan = {}
            $scope.listEPPS1LakiLaki = {}
            $scope.norec=''
            loadCombo()

            function loadCombo(){
                console.log(chacePeriode)
                $scope.item.no = 1;
                    $scope.listJenisKelamin = [{
                        id: 1,
                        jeniskelamin: "Laki-Laki"
                    }, {
                        id: 2,
                        jeniskelamin: "Perempuan"
                    }];

                    if(chacePeriode[3] == 2){
                        $scope.item.jeniskelamin = {id: 2, jeniskelamin: "Perempuan"}
                    } else if(chacePeriode[3] == 1){
                        $scope.item.jeniskelamin = {id: 1, jeniskelamin: "Laki-Laki"}
                    }
                    
                    $scope.item.namapasien = chacePeriode[4]
                    $scope.item.umur =  chacePeriode[6]+"thn"

                    

                    $scope.listEPPS1Perempuan = {
                        jawaban0: [
                            {
                                no: 1, 
                                jawaban: "",
                                konsistensi: true,
                                diagonal: true
                            },
                            {
                                no: 2,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            }, {
                                no: 3,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            },{
                                no: 4,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            },{
                                no: 5,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            }
                        ],
                        jawaban1: [
                            {
                                no: 6, 
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            },
                            {
                                no: 7,
                                jawaban: "",
                                konsistensi: true,
                                diagonal: true
                            }, {
                                no: 8,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            },{
                                no: 9,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            },{
                                no: 10,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            }
                        ],
                        jawaban2: [
                            {
                                no: 11, 
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            },
                            {
                                no: 12,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            }, {
                                no: 13,
                                jawaban: "",
                                konsistensi: true,
                                diagonal: true
                            },{
                                no: 14,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            },{
                                no: 15,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            }
                        ],
                        jawaban3: [
                            {
                                no: 16, 
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            },
                            {
                                no: 17,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            }, {
                                no: 18,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            },{
                                no: 19,
                                jawaban: "",
                                konsistensi: true,
                                diagonal: true
                            },{
                                no: 20,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            }
                        ],
                        jawaban4: [
                            {
                                no: 21, 
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            },
                            {
                                no: 22,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            }, {
                                no: 23,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            },{
                                no: 24,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            },{
                                no: 25,
                                jawaban: "",
                                konsistensi: true,
                                diagonal: true
                            }
                        ],



        
        
        
                        jawaban5: [
                            {
                                no: 26, 
                                jawaban: "",
                                konsistensi: false
                            },
                            {
                                no: 27,
                                jawaban: "",
                                konsistensi: false
                            }, {
                                no: 28,
                                jawaban: "",
                                konsistensi: false
                            },{
                                no: 29,
                                jawaban: "",
                                konsistensi: false
                            },{
                                no: 30,
                                jawaban: "",
                                konsistensi: false
                            }
                        ],
                        jawaban6: [
                            {
                                no: 31, 
                                jawaban: "",
                                konsistensi: false
                            },
                            {
                                no: 32,
                                jawaban: "",
                                konsistensi: false
                            }, {
                                no: 33,
                                jawaban: "",
                                konsistensi: false
                            },{
                                no: 34,
                                jawaban: "",
                                konsistensi: false
                            },{
                                no: 35,
                                jawaban: "",
                                konsistensi: false
                            }
                        ],
                        jawaban7: [
                            {
                                no: 36, 
                                jawaban: "",
                                konsistensi: false
                            },
                            {
                                no: 37,
                                jawaban: "",
                                konsistensi: false
                            }, {
                                no: 38,
                                jawaban: "",
                                konsistensi: true
                            },{
                                no: 39,
                                jawaban: "",
                                konsistensi: false
                            },{
                                no: 40,
                                jawaban: "",
                                konsistensi: false
                            }
                        ],
                        jawaban8: [
                            {
                                no: 41, 
                                jawaban: "",
                                konsistensi: false
                            },
                            {
                                no: 42,
                                jawaban: "",
                                konsistensi: false
                            }, {
                                no: 43,
                                jawaban: "",
                                konsistensi: false
                            },{
                                no: 44,
                                jawaban: "",
                                konsistensi: true
                            },{
                                no: 45,
                                jawaban: "",
                                konsistensi: false
                            }
                        ],
                        jawaban9: [
                            {
                                no: 46, 
                                jawaban: "",
                                konsistensi: false
                            },
                            {
                                no: 47,
                                jawaban: "",
                                konsistensi: false
                            }, {
                                no: 48,
                                jawaban: "",
                                konsistensi: false
                            },{
                                no: 49,
                                jawaban: "",
                                konsistensi: false
                            },{
                                no: 50,
                                jawaban: "",
                                konsistensi: false
                            }
                        ],





                        jawaban10: [
                            {
                                no: 51, 
                                jawaban: "",
                                konsistensi: true
                            },
                            {
                                no: 52,
                                jawaban: "",
                                konsistensi: false
                            }, {
                                no: 53,
                                jawaban: "",
                                konsistensi: false
                            },{
                                no: 54,
                                jawaban: "",
                                konsistensi: false
                            },{
                                no: 55,
                                jawaban: "",
                                konsistensi: false
                            }
                        ],
                        jawaban11: [
                            {
                                no: 56, 
                                jawaban: "",
                                konsistensi: false
                            },
                            {
                                no: 57,
                                jawaban: "",
                                konsistensi: false
                            }, {
                                no: 58,
                                jawaban: "",
                                konsistensi: false
                            },{
                                no: 59,
                                jawaban: "",
                                konsistensi: false
                            },{
                                no: 60,
                                jawaban: "",
                                konsistensi: false
                            }
                        ],
                        jawaban12: [
                            {
                                no: 61, 
                                jawaban: "",
                                konsistensi: false
                            },
                            {
                                no: 62,
                                jawaban: "",
                                konsistensi: false
                            }, {
                                no: 63,
                                jawaban: "",
                                konsistensi: true
                            },{
                                no: 64,
                                jawaban: "",
                                konsistensi: false
                            },{
                                no: 65,
                                jawaban: "",
                                konsistensi: false
                            }
                        ],
                        jawaban13: [
                            {
                                no: 66, 
                                jawaban: "",
                                konsistensi: false
                            },
                            {
                                no: 67,
                                jawaban: "",
                                konsistensi: false
                            }, {
                                no: 68,
                                jawaban: "",
                                konsistensi: false
                            },{
                                no: 69,
                                jawaban: "",
                                konsistensi: true
                            },{
                                no: 70,
                                jawaban: "",
                                konsistensi: false
                            }
                        ],
                        jawaban14: [
                            {
                                no: 71, 
                                jawaban: "",
                                konsistensi: false
                            },
                            {
                                no: 72,
                                jawaban: "",
                                konsistensi: false
                            }, {
                                no: 73,
                                jawaban: "",
                                konsistensi: false
                            },{
                                no: 74,
                                jawaban: "",
                                konsistensi: false
                            },{
                                no: 75,
                                jawaban: "",
                                konsistensi: false
                            }
                        ],





                        jawaban15: [
                            {
                                no: 76, 
                                jawaban: ""
                            },
                            {
                                no: 77,
                                jawaban: ""
                            }, {
                                no: 78,
                                jawaban: ""
                            },{
                                no: 79,
                                jawaban: ""
                            },{
                                no: 80,
                                jawaban: ""
                            }
                        ],
                        jawaban16: [
                            {
                                no: 81, 
                                jawaban: ""
                            },
                            {
                                no: 82,
                                jawaban: ""
                            }, {
                                no: 83,
                                jawaban: ""
                            },{
                                no: 84,
                                jawaban: ""
                            },{
                                no: 85,
                                jawaban: ""
                            }
                        ],
                        jawaban17: [
                            {
                                no: 86, 
                                jawaban: ""
                            },
                            {
                                no: 87,
                                jawaban: ""
                            }, {
                                no: 88,
                                jawaban: ""
                            },{
                                no: 89,
                                jawaban: ""
                            },{
                                no: 90,
                                jawaban: ""
                            }
                        ],
                        jawaban18: [
                            {
                                no: 91, 
                                jawaban: ""
                            },
                            {
                                no: 92,
                                jawaban: ""
                            }, {
                                no: 93,
                                jawaban: ""
                            },{
                                no: 94,
                                jawaban: ""
                            },{
                                no: 95,
                                jawaban: ""
                            }
                        ],
                        jawaban19: [
                            {
                                no: 96, 
                                jawaban: ""
                            },
                            {
                                no: 97,
                                jawaban: ""
                            }, {
                                no: 98,
                                jawaban: ""
                            },{
                                no: 99,
                                jawaban: ""
                            },{
                                no: 100,
                                jawaban: ""
                            }
                        ],






                        jawaban20: [
                            {
                                no: 101, 
                                jawaban: "",
                                konsistensi: false,
                                diagonal: true
                            },
                            {
                                no: 102,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            }, {
                                no: 103,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            },{
                                no: 104,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            },{
                                no: 105,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            }
                        ],
                        jawaban21: [
                            {
                                no: 106, 
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            },
                            {
                                no: 107,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: true
                            }, {
                                no: 108,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            },{
                                no: 109,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            },{
                                no: 110,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            }
                        ],
                        jawaban22: [
                            {
                                no: 111, 
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            },
                            {
                                no: 112,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            }, {
                                no: 113,
                                jawaban: "",
                                konsistensi: true,
                                diagonal: true
                            },{
                                no: 114,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            },{
                                no: 115,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            }
                        ],
                        jawaban23: [
                            {
                                no: 116, 
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            },
                            {
                                no: 117,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            }, {
                                no: 118,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            },{
                                no: 119,
                                jawaban: "",
                                konsistensi: true,
                                diagonal: true
                            },{
                                no: 120,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            }
                        ],
                        jawaban24: [
                            {
                                no: 121, 
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            },
                            {
                                no: 122,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            }, {
                                no: 123,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            },{
                                no: 124,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            },{
                                no: 125,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: true
                            }
                        ],




                        jawaban25: [
                            {
                                no: 126, 
                                jawaban: ""
                            },
                            {
                                no: 127,
                                jawaban: ""
                            }, {
                                no: 128,
                                jawaban: ""
                            },{
                                no: 129,
                                jawaban: ""
                            },{
                                no: 130,
                                jawaban: ""
                            }
                        ],
                        jawaban26: [
                            {
                                no: 131, 
                                jawaban: ""
                            },
                            {
                                no: 132,
                                jawaban: ""
                            }, {
                                no: 133,
                                jawaban: ""
                            },{
                                no: 134,
                                jawaban: ""
                            },{
                                no: 135,
                                jawaban: ""
                            }
                        ],
                        jawaban27: [
                            {
                                no: 136, 
                                jawaban: ""
                            },
                            {
                                no: 137,
                                jawaban: ""
                            }, {
                                no: 138,
                                jawaban: ""
                            },{
                                no: 139,
                                jawaban: ""
                            },{
                                no: 140,
                                jawaban: ""
                            }
                        ],
                        jawaban28: [
                            {
                                no: 141, 
                                jawaban: ""
                            },
                            {
                                no: 142,
                                jawaban: ""
                            }, {
                                no: 143,
                                jawaban: ""
                            },{
                                no: 144,
                                jawaban: ""
                            },{
                                no: 145,
                                jawaban: ""
                            }
                        ],
                        jawaban29: [
                            {
                                no: 146, 
                                jawaban: ""
                            },
                            {
                                no: 147,
                                jawaban: ""
                            }, {
                                no: 148,
                                jawaban: ""
                            },{
                                no: 149,
                                jawaban: ""
                            },{
                                no: 150,
                                jawaban: ""
                            }
                        ],





                        jawaban30: [
                            {
                                no: 151, 
                                jawaban: "",
                                konsistensi: true
                            },
                            {
                                no: 152,
                                jawaban: "",
                                konsistensi: false
                            }, {
                                no: 153,
                                jawaban: "",
                                konsistensi: false
                            },{
                                no: 154,
                                jawaban: "",
                                konsistensi: false
                            },{
                                no: 155,
                                jawaban: "",
                                konsistensi: false
                            }
                        ],
                        jawaban31: [
                            {
                                no: 156, 
                                jawaban: "",
                                konsistensi: false
                            },
                            {
                                no: 157,
                                jawaban: "",
                                konsistensi: true
                            }, {
                                no: 158,
                                jawaban: "",
                                konsistensi: false
                            },{
                                no: 159,
                                jawaban: "",
                                konsistensi: false
                            },{
                                no: 160,
                                jawaban: "",
                                konsistensi: false
                            }
                        ],
                        jawaban32: [
                            {
                                no: 161, 
                                jawaban: "",
                                konsistensi: false
                            },
                            {
                                no: 162,
                                jawaban: "",
                                konsistensi: false
                            }, {
                                no: 163,
                                jawaban: "",
                                konsistensi: true
                            },{
                                no: 164,
                                jawaban: "",
                                konsistensi: false
                            },{
                                no: 165,
                                jawaban: "",
                                konsistensi: false
                            }
                        ],
                        jawaban33: [
                            {
                                no: 166, 
                                jawaban: "",
                                konsistensi: false
                            },
                            {
                                no: 167,
                                jawaban: "",
                                konsistensi: false
                            }, {
                                no: 168,
                                jawaban: "",
                                konsistensi: false
                            },{
                                no: 169,
                                jawaban: "",
                                konsistensi: true
                            },{
                                no: 170,
                                jawaban: "",
                                konsistensi: false
                            }
                        ],
                        jawaban34: [
                            {
                                no: 171, 
                                jawaban: "",
                                konsistensi: false
                            },
                            {
                                no: 172,
                                jawaban: "",
                                konsistensi: false
                            }, {
                                no: 173,
                                jawaban: "",
                                konsistensi: false
                            },{
                                no: 174,
                                jawaban: "",
                                konsistensi: false
                            },{
                                no: 175,
                                jawaban: "",
                                konsistensi: true
                            }
                        ],




                        jawaban35: [
                            {
                                no: 176, 
                                jawaban: ""
                            },
                            {
                                no: 177,
                                jawaban: ""
                            }, {
                                no: 178,
                                jawaban: ""
                            },{
                                no: 179,
                                jawaban: ""
                            },{
                                no: 180,
                                jawaban: ""
                            }
                        ],
                        jawaban36: [
                            {
                                no: 181, 
                                jawaban: ""
                            },
                            {
                                no: 182,
                                jawaban: ""
                            }, {
                                no: 183,
                                jawaban: ""
                            },{
                                no: 184,
                                jawaban: ""
                            },{
                                no: 185,
                                jawaban: ""
                            }
                        ],
                        jawaban37: [
                            {
                                no: 186, 
                                jawaban: ""
                            },
                            {
                                no: 187,
                                jawaban: ""
                            }, {
                                no: 188,
                                jawaban: ""
                            },{
                                no: 189,
                                jawaban: ""
                            },{
                                no: 190,
                                jawaban: ""
                            }
                        ],
                        jawaban38: [
                            {
                                no: 191, 
                                jawaban: ""
                            },
                            {
                                no: 192,
                                jawaban: ""
                            }, {
                                no: 193,
                                jawaban: ""
                            },{
                                no: 194,
                                jawaban: ""
                            },{
                                no: 195,
                                jawaban: ""
                            }
                        ],
                        jawaban39: [
                            {
                                no: 196, 
                                jawaban: ""
                            },
                            {
                                no: 197,
                                jawaban: ""
                            }, {
                                no: 198,
                                jawaban: ""
                            },{
                                no: 199,
                                jawaban: ""
                            },{
                                no: 200,
                                jawaban: ""
                            }
                        ],





                        jawaban40: [
                            {
                                no: 201, 
                                jawaban: "",
                                konsistensi: true,
                                diagonal: true
                            },
                            {
                                no: 202,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            }, {
                                no: 203,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            },{
                                no: 204,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            },{
                                no: 205,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            }
                        ],
                        jawaban41: [
                            {
                                no: 206, 
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            },
                            {
                                no: 207,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: true
                            }, {
                                no: 208,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            },{
                                no: 209,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            },{
                                no: 210,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            }
                        ],
                        jawaban42: [
                            {
                                no: 211, 
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            },
                            {
                                no: 212,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            }, {
                                no: 213,
                                jawaban: "",
                                konsistensi: true,
                                diagonal: true
                            },{
                                no: 214,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            },{
                                no: 215,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            }
                        ],
                        jawaban43: [
                            {
                                no: 216, 
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            },
                            {
                                no: 217,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            }, {
                                no: 218,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            },{
                                no: 219,
                                jawaban: "",
                                konsistensi: true,
                                diagonal: true
                            },{
                                no: 220,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            }
                        ],
                        jawaban44: [
                            {
                                no: 221, 
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            },
                            {
                                no: 222,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            }, {
                                no: 223,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            },{
                                no: 224,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            },{
                                no: 225,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: true
                            }
                        ],
                    };


                    $scope.listEPPS1LakiLaki = {
                        jawaban0: [
                            {
                                no: 1, 
                                jawaban: "",
                                konsistensi: true,
                                diagonal: true
                            },
                            {
                                no: 2,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            }, {
                                no: 3,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            },{
                                no: 4,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            },{
                                no: 5,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            }
                        ],
                        jawaban1: [
                            {
                                no: 6, 
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            },
                            {
                                no: 7,
                                jawaban: "",
                                konsistensi: true,
                                diagonal: true
                            }, {
                                no: 8,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            },{
                                no: 9,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            },{
                                no: 10,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            }
                        ],
                        jawaban2: [
                            {
                                no: 11, 
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            },
                            {
                                no: 12,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            }, {
                                no: 13,
                                jawaban: "",
                                konsistensi: true,
                                diagonal: true
                            },{
                                no: 14,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            },{
                                no: 15,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            }
                        ],
                        jawaban3: [
                            {
                                no: 16, 
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            },
                            {
                                no: 17,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            }, {
                                no: 18,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            },{
                                no: 19,
                                jawaban: "",
                                konsistensi: true,
                                diagonal: true
                            },{
                                no: 20,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            }
                        ],
                        jawaban4: [
                            {
                                no: 21, 
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            },
                            {
                                no: 22,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            }, {
                                no: 23,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            },{
                                no: 24,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            },{
                                no: 25,
                                jawaban: "",
                                konsistensi: true,
                                diagonal: true
                            }
                        ],



        
        
        
                        jawaban5: [
                            {
                                no: 26, 
                                jawaban: "",
                                konsistensi: true
                            },
                            {
                                no: 27,
                                jawaban: "",
                                konsistensi: false
                            }, {
                                no: 28,
                                jawaban: "",
                                konsistensi: false
                            },{
                                no: 29,
                                jawaban: "",
                                konsistensi: false
                            },{
                                no: 30,
                                jawaban: "",
                                konsistensi: false
                            }
                        ],
                        jawaban6: [
                            {
                                no: 31, 
                                jawaban: "",
                                konsistensi: false
                            },
                            {
                                no: 32,
                                jawaban: "",
                                konsistensi: true
                            }, {
                                no: 33,
                                jawaban: "",
                                konsistensi: false
                            },{
                                no: 34,
                                jawaban: "",
                                konsistensi: false
                            },{
                                no: 35,
                                jawaban: "",
                                konsistensi: false
                            }
                        ],
                        jawaban7: [
                            {
                                no: 36, 
                                jawaban: "",
                                konsistensi: false
                            },
                            {
                                no: 37,
                                jawaban: "",
                                konsistensi: false
                            }, {
                                no: 38,
                                jawaban: "",
                                konsistensi: true
                            },{
                                no: 39,
                                jawaban: "",
                                konsistensi: false
                            },{
                                no: 40,
                                jawaban: "",
                                konsistensi: false
                            }
                        ],
                        jawaban8: [
                            {
                                no: 41, 
                                jawaban: "",
                                konsistensi: false
                            },
                            {
                                no: 42,
                                jawaban: "",
                                konsistensi: false
                            }, {
                                no: 43,
                                jawaban: "",
                                konsistensi: false
                            },{
                                no: 44,
                                jawaban: "",
                                konsistensi: true
                            },{
                                no: 45,
                                jawaban: "",
                                konsistensi: false
                            }
                        ],
                        jawaban9: [
                            {
                                no: 46, 
                                jawaban: "",
                                konsistensi: false
                            },
                            {
                                no: 47,
                                jawaban: "",
                                konsistensi: false
                            }, {
                                no: 48,
                                jawaban: "",
                                konsistensi: false
                            },{
                                no: 49,
                                jawaban: "",
                                konsistensi: false
                            },{
                                no: 50,
                                jawaban: "",
                                konsistensi: false
                            }
                        ],





                        jawaban10: [
                            {
                                no: 51, 
                                jawaban: "",
                                konsistensi: true
                            },
                            {
                                no: 52,
                                jawaban: "",
                                konsistensi: false
                            }, {
                                no: 53,
                                jawaban: "",
                                konsistensi: false
                            },{
                                no: 54,
                                jawaban: "",
                                konsistensi: false
                            },{
                                no: 55,
                                jawaban: "",
                                konsistensi: false
                            }
                        ],
                        jawaban11: [
                            {
                                no: 56, 
                                jawaban: "",
                                konsistensi: false
                            },
                            {
                                no: 57,
                                jawaban: "",
                                konsistensi: true
                            }, {
                                no: 58,
                                jawaban: "",
                                konsistensi: false
                            },{
                                no: 59,
                                jawaban: "",
                                konsistensi: false
                            },{
                                no: 60,
                                jawaban: "",
                                konsistensi: false
                            }
                        ],
                        jawaban12: [
                            {
                                no: 61, 
                                jawaban: "",
                                konsistensi: false
                            },
                            {
                                no: 62,
                                jawaban: "",
                                konsistensi: false
                            }, {
                                no: 63,
                                jawaban: "",
                                konsistensi: true
                            },{
                                no: 64,
                                jawaban: "",
                                konsistensi: false
                            },{
                                no: 65,
                                jawaban: "",
                                konsistensi: false
                            }
                        ],
                        jawaban13: [
                            {
                                no: 66, 
                                jawaban: "",
                                konsistensi: false
                            },
                            {
                                no: 67,
                                jawaban: "",
                                konsistensi: false
                            }, {
                                no: 68,
                                jawaban: "",
                                konsistensi: false
                            },{
                                no: 69,
                                jawaban: "",
                                konsistensi: true
                            },{
                                no: 70,
                                jawaban: "",
                                konsistensi: false
                            }
                        ],
                        jawaban14: [
                            {
                                no: 71, 
                                jawaban: "",
                                konsistensi: false
                            },
                            {
                                no: 72,
                                jawaban: "",
                                konsistensi: false
                            }, {
                                no: 73,
                                jawaban: "",
                                konsistensi: false
                            },{
                                no: 74,
                                jawaban: "",
                                konsistensi: false
                            },{
                                no: 75,
                                jawaban: "",
                                konsistensi: true
                            }
                        ],





                        jawaban15: [
                            {
                                no: 76, 
                                jawaban: ""
                            },
                            {
                                no: 77,
                                jawaban: ""
                            }, {
                                no: 78,
                                jawaban: ""
                            },{
                                no: 79,
                                jawaban: ""
                            },{
                                no: 80,
                                jawaban: ""
                            }
                        ],
                        jawaban16: [
                            {
                                no: 81, 
                                jawaban: ""
                            },
                            {
                                no: 82,
                                jawaban: ""
                            }, {
                                no: 83,
                                jawaban: ""
                            },{
                                no: 84,
                                jawaban: ""
                            },{
                                no: 85,
                                jawaban: ""
                            }
                        ],
                        jawaban17: [
                            {
                                no: 86, 
                                jawaban: ""
                            },
                            {
                                no: 87,
                                jawaban: ""
                            }, {
                                no: 88,
                                jawaban: ""
                            },{
                                no: 89,
                                jawaban: ""
                            },{
                                no: 90,
                                jawaban: ""
                            }
                        ],
                        jawaban18: [
                            {
                                no: 91, 
                                jawaban: ""
                            },
                            {
                                no: 92,
                                jawaban: ""
                            }, {
                                no: 93,
                                jawaban: ""
                            },{
                                no: 94,
                                jawaban: ""
                            },{
                                no: 95,
                                jawaban: ""
                            }
                        ],
                        jawaban19: [
                            {
                                no: 96, 
                                jawaban: ""
                            },
                            {
                                no: 97,
                                jawaban: ""
                            }, {
                                no: 98,
                                jawaban: ""
                            },{
                                no: 99,
                                jawaban: ""
                            },{
                                no: 100,
                                jawaban: ""
                            }
                        ],






                        jawaban20: [
                            {
                                no: 101, 
                                jawaban: "",
                                konsistensi: true,
                                diagonal: true
                            },
                            {
                                no: 102,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            }, {
                                no: 103,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            },{
                                no: 104,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            },{
                                no: 105,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            }
                        ],
                        jawaban21: [
                            {
                                no: 106, 
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            },
                            {
                                no: 107,
                                jawaban: "",
                                konsistensi: true,
                                diagonal: true
                            }, {
                                no: 108,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            },{
                                no: 109,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            },{
                                no: 110,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            }
                        ],
                        jawaban22: [
                            {
                                no: 111, 
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            },
                            {
                                no: 112,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            }, {
                                no: 113,
                                jawaban: "",
                                konsistensi: true,
                                diagonal: true
                            },{
                                no: 114,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            },{
                                no: 115,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            }
                        ],
                        jawaban23: [
                            {
                                no: 116, 
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            },
                            {
                                no: 117,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            }, {
                                no: 118,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            },{
                                no: 119,
                                jawaban: "",
                                konsistensi: true,
                                diagonal: true
                            },{
                                no: 120,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            }
                        ],
                        jawaban24: [
                            {
                                no: 121, 
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            },
                            {
                                no: 122,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            }, {
                                no: 123,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            },{
                                no: 124,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            },{
                                no: 125,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: true
                            }
                        ],




                        jawaban25: [
                            {
                                no: 126, 
                                jawaban: ""
                            },
                            {
                                no: 127,
                                jawaban: ""
                            }, {
                                no: 128,
                                jawaban: ""
                            },{
                                no: 129,
                                jawaban: ""
                            },{
                                no: 130,
                                jawaban: ""
                            }
                        ],
                        jawaban26: [
                            {
                                no: 131, 
                                jawaban: ""
                            },
                            {
                                no: 132,
                                jawaban: ""
                            }, {
                                no: 133,
                                jawaban: ""
                            },{
                                no: 134,
                                jawaban: ""
                            },{
                                no: 135,
                                jawaban: ""
                            }
                        ],
                        jawaban27: [
                            {
                                no: 136, 
                                jawaban: ""
                            },
                            {
                                no: 137,
                                jawaban: ""
                            }, {
                                no: 138,
                                jawaban: ""
                            },{
                                no: 139,
                                jawaban: ""
                            },{
                                no: 140,
                                jawaban: ""
                            }
                        ],
                        jawaban28: [
                            {
                                no: 141, 
                                jawaban: ""
                            },
                            {
                                no: 142,
                                jawaban: ""
                            }, {
                                no: 143,
                                jawaban: ""
                            },{
                                no: 144,
                                jawaban: ""
                            },{
                                no: 145,
                                jawaban: ""
                            }
                        ],
                        jawaban29: [
                            {
                                no: 146, 
                                jawaban: ""
                            },
                            {
                                no: 147,
                                jawaban: ""
                            }, {
                                no: 148,
                                jawaban: ""
                            },{
                                no: 149,
                                jawaban: ""
                            },{
                                no: 150,
                                jawaban: ""
                            }
                        ],





                        jawaban30: [
                            {
                                no: 151, 
                                jawaban: "",
                                konsistensi: true
                            },
                            {
                                no: 152,
                                jawaban: "",
                                konsistensi: false
                            }, {
                                no: 153,
                                jawaban: "",
                                konsistensi: false
                            },{
                                no: 154,
                                jawaban: "",
                                konsistensi: false
                            },{
                                no: 155,
                                jawaban: "",
                                konsistensi: false
                            }
                        ],
                        jawaban31: [
                            {
                                no: 156, 
                                jawaban: "",
                                konsistensi: false
                            },
                            {
                                no: 157,
                                jawaban: "",
                                konsistensi: true
                            }, {
                                no: 158,
                                jawaban: "",
                                konsistensi: false
                            },{
                                no: 159,
                                jawaban: "",
                                konsistensi: false
                            },{
                                no: 160,
                                jawaban: "",
                                konsistensi: false
                            }
                        ],
                        jawaban32: [
                            {
                                no: 161, 
                                jawaban: "",
                                konsistensi: false
                            },
                            {
                                no: 162,
                                jawaban: "",
                                konsistensi: false
                            }, {
                                no: 163,
                                jawaban: "",
                                konsistensi: true
                            },{
                                no: 164,
                                jawaban: "",
                                konsistensi: false
                            },{
                                no: 165,
                                jawaban: "",
                                konsistensi: false
                            }
                        ],
                        jawaban33: [
                            {
                                no: 166, 
                                jawaban: "",
                                konsistensi: false
                            },
                            {
                                no: 167,
                                jawaban: "",
                                konsistensi: false
                            }, {
                                no: 168,
                                jawaban: "",
                                konsistensi: false
                            },{
                                no: 169,
                                jawaban: "",
                                konsistensi: true
                            },{
                                no: 170,
                                jawaban: "",
                                konsistensi: false
                            }
                        ],
                        jawaban34: [
                            {
                                no: 171, 
                                jawaban: "",
                                konsistensi: false
                            },
                            {
                                no: 172,
                                jawaban: "",
                                konsistensi: false
                            }, {
                                no: 173,
                                jawaban: "",
                                konsistensi: false
                            },{
                                no: 174,
                                jawaban: "",
                                konsistensi: false
                            },{
                                no: 175,
                                jawaban: "",
                                konsistensi: true
                            }
                        ],




                        jawaban35: [
                            {
                                no: 176, 
                                jawaban: ""
                            },
                            {
                                no: 177,
                                jawaban: ""
                            }, {
                                no: 178,
                                jawaban: ""
                            },{
                                no: 179,
                                jawaban: ""
                            },{
                                no: 180,
                                jawaban: ""
                            }
                        ],
                        jawaban36: [
                            {
                                no: 181, 
                                jawaban: ""
                            },
                            {
                                no: 182,
                                jawaban: ""
                            }, {
                                no: 183,
                                jawaban: ""
                            },{
                                no: 184,
                                jawaban: ""
                            },{
                                no: 185,
                                jawaban: ""
                            }
                        ],
                        jawaban37: [
                            {
                                no: 186, 
                                jawaban: ""
                            },
                            {
                                no: 187,
                                jawaban: ""
                            }, {
                                no: 188,
                                jawaban: ""
                            },{
                                no: 189,
                                jawaban: ""
                            },{
                                no: 190,
                                jawaban: ""
                            }
                        ],
                        jawaban38: [
                            {
                                no: 191, 
                                jawaban: ""
                            },
                            {
                                no: 192,
                                jawaban: ""
                            }, {
                                no: 193,
                                jawaban: ""
                            },{
                                no: 194,
                                jawaban: ""
                            },{
                                no: 195,
                                jawaban: ""
                            }
                        ],
                        jawaban39: [
                            {
                                no: 196, 
                                jawaban: ""
                            },
                            {
                                no: 197,
                                jawaban: ""
                            }, {
                                no: 198,
                                jawaban: ""
                            },{
                                no: 199,
                                jawaban: ""
                            },{
                                no: 200,
                                jawaban: ""
                            }
                        ],





                        jawaban40: [
                            {
                                no: 201, 
                                jawaban: "",
                                konsistensi: true,
                                diagonal: true
                            },
                            {
                                no: 202,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            }, {
                                no: 203,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            },{
                                no: 204,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            },{
                                no: 205,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            }
                        ],
                        jawaban41: [
                            {
                                no: 206, 
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            },
                            {
                                no: 207,
                                jawaban: "",
                                konsistensi: true,
                                diagonal: true
                            }, {
                                no: 208,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            },{
                                no: 209,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            },{
                                no: 210,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            }
                        ],
                        jawaban42: [
                            {
                                no: 211, 
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            },
                            {
                                no: 212,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            }, {
                                no: 213,
                                jawaban: "",
                                konsistensi: true,
                                diagonal: true
                            },{
                                no: 214,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            },{
                                no: 215,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            }
                        ],
                        jawaban43: [
                            {
                                no: 216, 
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            },
                            {
                                no: 217,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            }, {
                                no: 218,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            },{
                                no: 219,
                                jawaban: "",
                                konsistensi: true,
                                diagonal: true
                            },{
                                no: 220,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            }
                        ],
                        jawaban44: [
                            {
                                no: 221, 
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            },
                            {
                                no: 222,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            }, {
                                no: 223,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            },{
                                no: 224,
                                jawaban: "",
                                konsistensi: false,
                                diagonal: false
                            },{
                                no: 225,
                                jawaban: "",
                                konsistensi: true,
                                diagonal: true
                            }
                        ],
                    };

                    if($scope.item.jeniskelamin.id == 2){
                        $scope.listEPPS1Fix = $scope.listEPPS1Perempuan
                    } else if($scope.item.jeniskelamin.id == 1){
                        $scope.listEPPS1Fix = $scope.listEPPS1LakiLaki
                    }

                    medifirstService.get('epps/get-eppps-by-apd?apd='+chacePeriode[2]).then(function (data) {
                        console.log(data.data.data)
                        if(data.data.data.length != 0){
                            $scope.norec = data.data.data[0].norec
                        }
                        for(var i = 0; i < data.data.data.length; i++){
                            for(var y = 0; y<5; y++){
                                if(data.data.data[i].nourut == $scope.listEPPS1Fix.jawaban0[y].no){
                                    $scope.listEPPS1Fix.jawaban0[y].jawaban = data.data.data[i].jawaban
                                }
                            }

                            for(var y = 0; y<5; y++){
                                if(data.data.data[i].nourut == $scope.listEPPS1Fix.jawaban1[y].no){
                                    $scope.listEPPS1Fix.jawaban1[y].jawaban = data.data.data[i].jawaban
                                }
                            }

                            for(var y = 0; y<5; y++){
                                if(data.data.data[i].nourut == $scope.listEPPS1Fix.jawaban2[y].no){
                                    $scope.listEPPS1Fix.jawaban2[y].jawaban = data.data.data[i].jawaban
                                }
                            }

                            for(var y = 0; y<5; y++){
                                if(data.data.data[i].nourut == $scope.listEPPS1Fix.jawaban3[y].no){
                                    $scope.listEPPS1Fix.jawaban3[y].jawaban = data.data.data[i].jawaban
                                }
                            }

                            for(var y = 0; y<5; y++){
                                if(data.data.data[i].nourut == $scope.listEPPS1Fix.jawaban4[y].no){
                                    $scope.listEPPS1Fix.jawaban4[y].jawaban = data.data.data[i].jawaban
                                }
                            }

                            for(var y = 0; y<5; y++){
                                if(data.data.data[i].nourut == $scope.listEPPS1Fix.jawaban5[y].no){
                                    $scope.listEPPS1Fix.jawaban5[y].jawaban = data.data.data[i].jawaban
                                }
                            }

                            for(var y = 0; y<5; y++){
                                if(data.data.data[i].nourut == $scope.listEPPS1Fix.jawaban6[y].no){
                                    $scope.listEPPS1Fix.jawaban6[y].jawaban = data.data.data[i].jawaban
                                }
                            }

                            for(var y = 0; y<5; y++){
                                if(data.data.data[i].nourut == $scope.listEPPS1Fix.jawaban7[y].no){
                                    $scope.listEPPS1Fix.jawaban7[y].jawaban = data.data.data[i].jawaban
                                }
                            }

                            for(var y = 0; y<5; y++){
                                if(data.data.data[i].nourut == $scope.listEPPS1Fix.jawaban8[y].no){
                                    $scope.listEPPS1Fix.jawaban8[y].jawaban = data.data.data[i].jawaban
                                }
                            }

                            for(var y = 0; y<5; y++){
                                if(data.data.data[i].nourut == $scope.listEPPS1Fix.jawaban9[y].no){
                                    $scope.listEPPS1Fix.jawaban9[y].jawaban = data.data.data[i].jawaban
                                }
                            }

                            for(var y = 0; y<5; y++){
                                if(data.data.data[i].nourut == $scope.listEPPS1Fix.jawaban10[y].no){
                                    $scope.listEPPS1Fix.jawaban10[y].jawaban = data.data.data[i].jawaban
                                }
                            }

                            for(var y = 0; y<5; y++){
                                if(data.data.data[i].nourut == $scope.listEPPS1Fix.jawaban11[y].no){
                                    $scope.listEPPS1Fix.jawaban11[y].jawaban = data.data.data[i].jawaban
                                }
                            }

                            for(var y = 0; y<5; y++){
                                if(data.data.data[i].nourut == $scope.listEPPS1Fix.jawaban12[y].no){
                                    $scope.listEPPS1Fix.jawaban12[y].jawaban = data.data.data[i].jawaban
                                }
                            }

                            for(var y = 0; y<5; y++){
                                if(data.data.data[i].nourut == $scope.listEPPS1Fix.jawaban13[y].no){
                                    $scope.listEPPS1Fix.jawaban13[y].jawaban = data.data.data[i].jawaban
                                }
                            }

                            for(var y = 0; y<5; y++){
                                if(data.data.data[i].nourut == $scope.listEPPS1Fix.jawaban14[y].no){
                                    $scope.listEPPS1Fix.jawaban14[y].jawaban = data.data.data[i].jawaban
                                }
                            }

                            for(var y = 0; y<5; y++){
                                if(data.data.data[i].nourut == $scope.listEPPS1Fix.jawaban15[y].no){
                                    $scope.listEPPS1Fix.jawaban15[y].jawaban = data.data.data[i].jawaban
                                }
                            }

                            for(var y = 0; y<5; y++){
                                if(data.data.data[i].nourut == $scope.listEPPS1Fix.jawaban16[y].no){
                                    $scope.listEPPS1Fix.jawaban16[y].jawaban = data.data.data[i].jawaban
                                }
                            }

                            for(var y = 0; y<5; y++){
                                if(data.data.data[i].nourut == $scope.listEPPS1Fix.jawaban17[y].no){
                                    $scope.listEPPS1Fix.jawaban17[y].jawaban = data.data.data[i].jawaban
                                }
                            }

                            for(var y = 0; y<5; y++){
                                if(data.data.data[i].nourut == $scope.listEPPS1Fix.jawaban18[y].no){
                                    $scope.listEPPS1Fix.jawaban18[y].jawaban = data.data.data[i].jawaban
                                }
                            }

                            for(var y = 0; y<5; y++){
                                if(data.data.data[i].nourut == $scope.listEPPS1Fix.jawaban19[y].no){
                                    $scope.listEPPS1Fix.jawaban19[y].jawaban = data.data.data[i].jawaban
                                }
                            }

                            for(var y = 0; y<5; y++){
                                if(data.data.data[i].nourut == $scope.listEPPS1Fix.jawaban20[y].no){
                                    $scope.listEPPS1Fix.jawaban20[y].jawaban = data.data.data[i].jawaban
                                }
                            }

                            for(var y = 0; y<5; y++){
                                if(data.data.data[i].nourut == $scope.listEPPS1Fix.jawaban21[y].no){
                                    $scope.listEPPS1Fix.jawaban21[y].jawaban = data.data.data[i].jawaban
                                }
                            }
                            for(var y = 0; y<5; y++){
                                if(data.data.data[i].nourut == $scope.listEPPS1Fix.jawaban22[y].no){
                                    $scope.listEPPS1Fix.jawaban22[y].jawaban = data.data.data[i].jawaban
                                }
                            }
                            for(var y = 0; y<5; y++){
                                if(data.data.data[i].nourut == $scope.listEPPS1Fix.jawaban23[y].no){
                                    $scope.listEPPS1Fix.jawaban23[y].jawaban = data.data.data[i].jawaban
                                }
                            }
                            for(var y = 0; y<5; y++){
                                if(data.data.data[i].nourut == $scope.listEPPS1Fix.jawaban24[y].no){
                                    $scope.listEPPS1Fix.jawaban24[y].jawaban = data.data.data[i].jawaban
                                }
                            }
                            for(var y = 0; y<5; y++){
                                if(data.data.data[i].nourut == $scope.listEPPS1Fix.jawaban25[y].no){
                                    $scope.listEPPS1Fix.jawaban25[y].jawaban = data.data.data[i].jawaban
                                }
                            }
                            for(var y = 0; y<5; y++){
                                if(data.data.data[i].nourut == $scope.listEPPS1Fix.jawaban26[y].no){
                                    $scope.listEPPS1Fix.jawaban26[y].jawaban = data.data.data[i].jawaban
                                }
                            }
                            for(var y = 0; y<5; y++){
                                if(data.data.data[i].nourut == $scope.listEPPS1Fix.jawaban27[y].no){
                                    $scope.listEPPS1Fix.jawaban27[y].jawaban = data.data.data[i].jawaban
                                }
                            }for(var y = 0; y<5; y++){
                                if(data.data.data[i].nourut == $scope.listEPPS1Fix.jawaban28[y].no){
                                    $scope.listEPPS1Fix.jawaban28[y].jawaban = data.data.data[i].jawaban
                                }
                            }
                            for(var y = 0; y<5; y++){
                                if(data.data.data[i].nourut == $scope.listEPPS1Fix.jawaban29[y].no){
                                    $scope.listEPPS1Fix.jawaban29[y].jawaban = data.data.data[i].jawaban
                                }
                            }
                            for(var y = 0; y<5; y++){
                                if(data.data.data[i].nourut == $scope.listEPPS1Fix.jawaban30[y].no){
                                    $scope.listEPPS1Fix.jawaban30[y].jawaban = data.data.data[i].jawaban
                                }
                            }

                            for(var y = 0; y<5; y++){
                                if(data.data.data[i].nourut == $scope.listEPPS1Fix.jawaban31[y].no){
                                    $scope.listEPPS1Fix.jawaban31[y].jawaban = data.data.data[i].jawaban
                                }
                            }

                            for(var y = 0; y<5; y++){
                                if(data.data.data[i].nourut == $scope.listEPPS1Fix.jawaban32[y].no){
                                    $scope.listEPPS1Fix.jawaban32[y].jawaban = data.data.data[i].jawaban
                                }
                            }
                            for(var y = 0; y<5; y++){
                                if(data.data.data[i].nourut == $scope.listEPPS1Fix.jawaban33[y].no){
                                    $scope.listEPPS1Fix.jawaban33[y].jawaban = data.data.data[i].jawaban
                                }
                            }
                            for(var y = 0; y<5; y++){
                                if(data.data.data[i].nourut == $scope.listEPPS1Fix.jawaban34[y].no){
                                    $scope.listEPPS1Fix.jawaban34[y].jawaban = data.data.data[i].jawaban
                                }
                            }
                            for(var y = 0; y<5; y++){
                                if(data.data.data[i].nourut == $scope.listEPPS1Fix.jawaban35[y].no){
                                    $scope.listEPPS1Fix.jawaban35[y].jawaban = data.data.data[i].jawaban
                                }
                            }
                            for(var y = 0; y<5; y++){
                                if(data.data.data[i].nourut == $scope.listEPPS1Fix.jawaban36[y].no){
                                    $scope.listEPPS1Fix.jawaban36[y].jawaban = data.data.data[i].jawaban
                                }
                            }
                            for(var y = 0; y<5; y++){
                                if(data.data.data[i].nourut == $scope.listEPPS1Fix.jawaban37[y].no){
                                    $scope.listEPPS1Fix.jawaban37[y].jawaban = data.data.data[i].jawaban
                                }
                            }
                            for(var y = 0; y<5; y++){
                                if(data.data.data[i].nourut == $scope.listEPPS1Fix.jawaban38[y].no){
                                    $scope.listEPPS1Fix.jawaban38[y].jawaban = data.data.data[i].jawaban
                                }
                            }
                            for(var y = 0; y<5; y++){
                                if(data.data.data[i].nourut == $scope.listEPPS1Fix.jawaban39[y].no){
                                    $scope.listEPPS1Fix.jawaban39[y].jawaban = data.data.data[i].jawaban
                                }
                            }
                            for(var y = 0; y<5; y++){
                                if(data.data.data[i].nourut == $scope.listEPPS1Fix.jawaban40[y].no){
                                    $scope.listEPPS1Fix.jawaban40[y].jawaban = data.data.data[i].jawaban
                                }
                            }
                            for(var y = 0; y<5; y++){
                                if(data.data.data[i].nourut == $scope.listEPPS1Fix.jawaban41[y].no){
                                    $scope.listEPPS1Fix.jawaban41[y].jawaban = data.data.data[i].jawaban
                                }
                            }
                            for(var y = 0; y<5; y++){
                                if(data.data.data[i].nourut == $scope.listEPPS1Fix.jawaban42[y].no){
                                    $scope.listEPPS1Fix.jawaban42[y].jawaban = data.data.data[i].jawaban
                                }
                            }
                            for(var y = 0; y<5; y++){
                                if(data.data.data[i].nourut == $scope.listEPPS1Fix.jawaban43[y].no){
                                    $scope.listEPPS1Fix.jawaban43[y].jawaban = data.data.data[i].jawaban
                                }
                            }
                            for(var y = 0; y<5; y++){
                                if(data.data.data[i].nourut == $scope.listEPPS1Fix.jawaban44[y].no){
                                    $scope.listEPPS1Fix.jawaban44[y].jawaban = data.data.data[i].jawaban
                                }
                            }

                            
                        }

                        $scope.item.poinkonsistensi = data.data.data[0].konsistensi
                            $scope.item.skolom1 = data.data.data[0].ach
                            $scope.item.skolom2 = data.data.data[0].def
                            $scope.item.skolom3 = data.data.data[0].ord
                            $scope.item.skolom4 = data.data.data[0].exh
                            $scope.item.skolom5 = data.data.data[0].aut
                            $scope.item.skolom6 = data.data.data[0].aff
                            $scope.item.skolom7 = data.data.data[0].int
                            $scope.item.skolom8 = data.data.data[0].suc
                            $scope.item.skolom9 = data.data.data[0].dom
                            $scope.item.skolom10 = data.data.data[0].aba
                            $scope.item.skolom11 = data.data.data[0].nur
                            $scope.item.skolom12 = data.data.data[0].chg
                            $scope.item.skolom13 = data.data.data[0].end
                            $scope.item.skolom14 = data.data.data[0].het
                            $scope.item.skolom15 = data.data.data[0].agg

                            $scope.item.rkolom1 = data.data.data[0].r1
                            $scope.item.rkolom2 = data.data.data[0].r2
                            $scope.item.rkolom3 = data.data.data[0].r3
                            $scope.item.rkolom4 = data.data.data[0].r4
                            $scope.item.rkolom5 = data.data.data[0].r5
                            $scope.item.rkolom6 = data.data.data[0].r6
                            $scope.item.rkolom7 = data.data.data[0].r7
                            $scope.item.rkolom8 = data.data.data[0].r8
                            $scope.item.rkolom9 = data.data.data[0].r9
                            $scope.item.rkolom10 = data.data.data[0].r10
                            $scope.item.rkolom11 = data.data.data[0].r11
                            $scope.item.rkolom12 = data.data.data[0].r12
                            $scope.item.rkolom13 = data.data.data[0].r13
                            $scope.item.rkolom14 = data.data.data[0].r14
                            $scope.item.rkolom15 = data.data.data[0].r15


                            $scope.item.ckolom1 = data.data.data[0].c1
                            $scope.item.ckolom2 = data.data.data[0].c2
                            $scope.item.ckolom3 = data.data.data[0].c3
                            $scope.item.ckolom4 = data.data.data[0].c4
                            $scope.item.ckolom5 = data.data.data[0].c5
                            $scope.item.ckolom6 = data.data.data[0].c6
                            $scope.item.ckolom7 = data.data.data[0].c7
                            $scope.item.ckolom8 = data.data.data[0].c8
                            $scope.item.ckolom9 = data.data.data[0].c9
                            $scope.item.ckolom10 = data.data.data[0].c10
                            $scope.item.ckolom11 = data.data.data[0].c11
                            $scope.item.ckolom12 = data.data.data[0].c12
                            $scope.item.ckolom13 = data.data.data[0].c13
                            $scope.item.ckolom14 = data.data.data[0].c14
                            $scope.item.ckolom15 = data.data.data[0].c15

                            $scope.item.totalscore = parseInt($scope.item.skolom1) + parseInt($scope.item.skolom2) + parseInt($scope.item.skolom3) + parseInt($scope.item.skolom4) + parseInt($scope.item.skolom5) + parseInt($scope.item.skolom6)
                            + parseInt($scope.item.skolom7) + parseInt($scope.item.skolom8) + parseInt($scope.item.skolom9) + parseInt($scope.item.skolom10) + parseInt($scope.item.skolom11) + parseInt($scope.item.skolom12) + parseInt($scope.item.skolom13)
                            + parseInt($scope.item.skolom14) + parseInt($scope.item.skolom15)


                        console.log($scope.listEPPS1Fix)
                    })
            }

            $scope.TambahData = function () {
                
				    var jawabanke = Math.floor($scope.item.no/5)
                    var mod = 0
                    var cek = 0
                    
                    
                    if($scope.item.no <=4){
                        mod = $scope.item.no - 1
                    } else if($scope.item.no ==5){
                        mod = $scope.item.no - 1
                        jawabanke = jawabanke - 1
                    } else{
                        cek = $scope.item.no % 5
                        if(cek >= 1 && cek <= 4){
                            mod = cek-1
                        } else if(cek == 0){
                            mod = 4
                            jawabanke = jawabanke - 1
                        }
                    }
                    console.log(jawabanke)
                    console.log(mod)
                    if(jawabanke == 0){
                        $scope.listEPPS1Fix.jawaban0[mod].jawaban = $scope.item.jawaban
                    } else if(jawabanke == 1){
                        $scope.listEPPS1Fix.jawaban1[mod].jawaban = $scope.item.jawaban
                    } else if(jawabanke == 2){
                        $scope.listEPPS1Fix.jawaban2[mod].jawaban = $scope.item.jawaban
                    } else if(jawabanke == 3){
                        $scope.listEPPS1Fix.jawaban3[mod].jawaban = $scope.item.jawaban
                    } else if(jawabanke == 4){
                        $scope.listEPPS1Fix.jawaban4[mod].jawaban = $scope.item.jawaban
                    }else if(jawabanke == 5){
                        $scope.listEPPS1Fix.jawaban5[mod].jawaban = $scope.item.jawaban
                    }else if(jawabanke == 6){
                        $scope.listEPPS1Fix.jawaban6[mod].jawaban = $scope.item.jawaban
                    }else if(jawabanke == 7){
                        $scope.listEPPS1Fix.jawaban7[mod].jawaban = $scope.item.jawaban
                    }else if(jawabanke == 8){
                        $scope.listEPPS1Fix.jawaban8[mod].jawaban = $scope.item.jawaban
                    }else if(jawabanke == 9){
                        $scope.listEPPS1Fix.jawaban9[mod].jawaban = $scope.item.jawaban
                    }else if(jawabanke == 10){
                        $scope.listEPPS1Fix.jawaban10[mod].jawaban = $scope.item.jawaban
                    }else if(jawabanke == 11){
                        $scope.listEPPS1Fix.jawaban11[mod].jawaban = $scope.item.jawaban
                    }else if(jawabanke == 12){
                        $scope.listEPPS1Fix.jawaban12[mod].jawaban = $scope.item.jawaban
                    }else if(jawabanke == 13){
                        $scope.listEPPS1Fix.jawaban13[mod].jawaban = $scope.item.jawaban
                    }else if(jawabanke == 14){
                        $scope.listEPPS1Fix.jawaban14[mod].jawaban = $scope.item.jawaban
                    }else if(jawabanke == 15){
                        $scope.listEPPS1Fix.jawaban15[mod].jawaban = $scope.item.jawaban
                    }else if(jawabanke == 16){
                        $scope.listEPPS1Fix.jawaban16[mod].jawaban = $scope.item.jawaban
                    }else if(jawabanke == 17){
                        $scope.listEPPS1Fix.jawaban17[mod].jawaban = $scope.item.jawaban
                    }else if(jawabanke == 18){
                        $scope.listEPPS1Fix.jawaban18[mod].jawaban = $scope.item.jawaban
                    }else if(jawabanke == 19){
                        $scope.listEPPS1Fix.jawaban19[mod].jawaban = $scope.item.jawaban
                    }else if(jawabanke == 20){
                        $scope.listEPPS1Fix.jawaban20[mod].jawaban = $scope.item.jawaban
                    }else if(jawabanke == 21){
                        $scope.listEPPS1Fix.jawaban21[mod].jawaban = $scope.item.jawaban
                    }else if(jawabanke == 22){
                        $scope.listEPPS1Fix.jawaban22[mod].jawaban = $scope.item.jawaban
                    }else if(jawabanke == 23){
                        $scope.listEPPS1Fix.jawaban23[mod].jawaban = $scope.item.jawaban
                    }else if(jawabanke == 24){
                        $scope.listEPPS1Fix.jawaban24[mod].jawaban = $scope.item.jawaban
                    }else if(jawabanke == 25){
                        $scope.listEPPS1Fix.jawaban25[mod].jawaban = $scope.item.jawaban
                    }else if(jawabanke == 26){
                        $scope.listEPPS1Fix.jawaban26[mod].jawaban = $scope.item.jawaban
                    }else if(jawabanke == 27){
                        $scope.listEPPS1Fix.jawaban27[mod].jawaban = $scope.item.jawaban
                    }else if(jawabanke == 28){
                        $scope.listEPPS1Fix.jawaban28[mod].jawaban = $scope.item.jawaban
                    }else if(jawabanke == 29){
                        $scope.listEPPS1Fix.jawaban29[mod].jawaban = $scope.item.jawaban
                    }else if(jawabanke == 30){
                        $scope.listEPPS1Fix.jawaban30[mod].jawaban = $scope.item.jawaban
                    }else if(jawabanke == 31){
                        $scope.listEPPS1Fix.jawaban31[mod].jawaban = $scope.item.jawaban
                    }else if(jawabanke == 32){
                        $scope.listEPPS1Fix.jawaban32[mod].jawaban = $scope.item.jawaban
                    }else if(jawabanke == 33){
                        $scope.listEPPS1Fix.jawaban33[mod].jawaban = $scope.item.jawaban
                    }else if(jawabanke == 34){
                        $scope.listEPPS1Fix.jawaban34[mod].jawaban = $scope.item.jawaban
                    }else if(jawabanke == 35){
                        $scope.listEPPS1Fix.jawaban35[mod].jawaban = $scope.item.jawaban
                    }else if(jawabanke == 36){
                        $scope.listEPPS1Fix.jawaban36[mod].jawaban = $scope.item.jawaban
                    }else if(jawabanke == 37){
                        $scope.listEPPS1Fix.jawaban37[mod].jawaban = $scope.item.jawaban
                    }else if(jawabanke == 38){
                        $scope.listEPPS1Fix.jawaban38[mod].jawaban = $scope.item.jawaban
                    }else if(jawabanke == 39){
                        $scope.listEPPS1Fix.jawaban39[mod].jawaban = $scope.item.jawaban
                    }else if(jawabanke == 40){
                        $scope.listEPPS1Fix.jawaban40[mod].jawaban = $scope.item.jawaban
                    }else if(jawabanke == 41){
                        $scope.listEPPS1Fix.jawaban41[mod].jawaban = $scope.item.jawaban
                    }else if(jawabanke == 42){
                        $scope.listEPPS1Fix.jawaban42[mod].jawaban = $scope.item.jawaban
                    }else if(jawabanke == 43){
                        $scope.listEPPS1Fix.jawaban43[mod].jawaban = $scope.item.jawaban
                    }else if(jawabanke == 44){
                        $scope.listEPPS1Fix.jawaban44[mod].jawaban = $scope.item.jawaban
                    }

                    $scope.item.no++



                    //konsistensi

                    
			}


            $scope.hitung = function () {

                console.log($scope.listEPPS1Fix)
                var poinkonsistensi= 0
                var rKolom1= 0
                var rKolom2= 0
                var rKolom3= 0
                var rKolom4= 0
                var rKolom5= 0
                var rKolom6= 0
                var rKolom7= 0
                var rKolom8= 0
                var rKolom9= 0
                var rKolom10= 0
                var rKolom11= 0
                var rKolom12= 0
                var rKolom13= 0
                var rKolom14= 0
                var rKolom15= 0


                var cKolom1= 0
                var cKolom2= 0
                var cKolom3= 0
                var cKolom4= 0
                var cKolom5= 0
                var cKolom6= 0
                var cKolom7= 0
                var cKolom8= 0
                var cKolom9= 0
                var cKolom10= 0
                var cKolom11= 0
                var cKolom12= 0
                var cKolom13= 0
                var cKolom14= 0
                var cKolom15= 0

                if($scope.listEPPS1Fix.jawaban0[0].jawaban == $scope.listEPPS1Fix.jawaban30[0].jawaban && $scope.listEPPS1Fix.jawaban0[0].jawaban != '' && $scope.listEPPS1Fix.jawaban30[0].jawaban != ''){
                    poinkonsistensi ++
                } 
                if($scope.listEPPS1Fix.jawaban1[1].jawaban == $scope.listEPPS1Fix.jawaban31[1].jawaban && $scope.listEPPS1Fix.jawaban1[1].jawaban != '' && $scope.listEPPS1Fix.jawaban31[1].jawaban != ''){
                    poinkonsistensi ++
                } 
                if($scope.listEPPS1Fix.jawaban2[2].jawaban == $scope.listEPPS1Fix.jawaban32[2].jawaban && $scope.listEPPS1Fix.jawaban2[2].jawaban != '' && $scope.listEPPS1Fix.jawaban32[2].jawaban != ''){
                    poinkonsistensi ++
                }
                if($scope.listEPPS1Fix.jawaban3[3].jawaban == $scope.listEPPS1Fix.jawaban33[3].jawaban && $scope.listEPPS1Fix.jawaban3[3].jawaban != '' && $scope.listEPPS1Fix.jawaban33[3].jawaban != ''){
                    poinkonsistensi ++
                }
                if($scope.listEPPS1Fix.jawaban4[4].jawaban == $scope.listEPPS1Fix.jawaban34[4].jawaban && $scope.listEPPS1Fix.jawaban4[4].jawaban != '' && $scope.listEPPS1Fix.jawaban34[4].jawaban != ''){
                    poinkonsistensi ++
                }
                if($scope.listEPPS1Fix.jawaban7[2].jawaban == $scope.listEPPS1Fix.jawaban22[2].jawaban && $scope.listEPPS1Fix.jawaban7[2].jawaban != '' && $scope.listEPPS1Fix.jawaban22[2].jawaban != ''){
                    poinkonsistensi ++
                }
                if($scope.listEPPS1Fix.jawaban8[3].jawaban == $scope.listEPPS1Fix.jawaban23[3].jawaban && $scope.listEPPS1Fix.jawaban8[3].jawaban != '' && $scope.listEPPS1Fix.jawaban23[3].jawaban != ''){
                    poinkonsistensi ++
                }
                if($scope.listEPPS1Fix.jawaban10[0].jawaban == $scope.listEPPS1Fix.jawaban40[0].jawaban && $scope.listEPPS1Fix.jawaban10[0].jawaban != '' && $scope.listEPPS1Fix.jawaban40[0].jawaban != ''){
                    poinkonsistensi ++
                }
                if($scope.listEPPS1Fix.jawaban12[2].jawaban == $scope.listEPPS1Fix.jawaban42[2].jawaban && $scope.listEPPS1Fix.jawaban12[2].jawaban != '' && $scope.listEPPS1Fix.jawaban42[2].jawaban != ''){
                    poinkonsistensi ++
                }
                if($scope.listEPPS1Fix.jawaban13[3].jawaban == $scope.listEPPS1Fix.jawaban43[3].jawaban && $scope.listEPPS1Fix.jawaban13[3].jawaban != '' && $scope.listEPPS1Fix.jawaban43[3].jawaban != ''){
                    poinkonsistensi ++
                }


                if($scope.item.jeniskelamin.id == 1){
                    if($scope.listEPPS1Fix.jawaban5[0].jawaban == $scope.listEPPS1Fix.jawaban20[0].jawaban && $scope.listEPPS1Fix.jawaban5[0].jawaban != '' && $scope.listEPPS1Fix.jawaban20[0].jawaban != ''){
                        poinkonsistensi ++
                    }
                    if($scope.listEPPS1Fix.jawaban6[1].jawaban == $scope.listEPPS1Fix.jawaban21[1].jawaban && $scope.listEPPS1Fix.jawaban6[1].jawaban != '' && $scope.listEPPS1Fix.jawaban21[1].jawaban != ''){
                        poinkonsistensi ++
                    }
                    if($scope.listEPPS1Fix.jawaban11[1].jawaban == $scope.listEPPS1Fix.jawaban41[1].jawaban && $scope.listEPPS1Fix.jawaban11[1].jawaban != '' && $scope.listEPPS1Fix.jawaban41[1].jawaban != ''){
                        poinkonsistensi ++
                    }
                    if($scope.listEPPS1Fix.jawaban14[4].jawaban == $scope.listEPPS1Fix.jawaban44[4].jawaban && $scope.listEPPS1Fix.jawaban14[4].jawaban != '' && $scope.listEPPS1Fix.jawaban44[4].jawaban != ''){
                        poinkonsistensi ++
                    }
                }


                
                if($scope.listEPPS1Fix.jawaban1[0].jawaban == 'A'){
                    rKolom1++
                }
                if($scope.listEPPS1Fix.jawaban2[0].jawaban == 'A'){
                    rKolom1++
                }
                if($scope.listEPPS1Fix.jawaban3[0].jawaban == 'A'){
                    rKolom1++
                }
                if($scope.listEPPS1Fix.jawaban4[0].jawaban == 'A'){
                    rKolom1++
                }
                if($scope.listEPPS1Fix.jawaban5[0].jawaban == 'A'){
                    rKolom1++
                }
                if($scope.listEPPS1Fix.jawaban6[0].jawaban == 'A'){
                    rKolom1++
                }
                if($scope.listEPPS1Fix.jawaban7[0].jawaban == 'A'){
                    rKolom1++
                }
                if($scope.listEPPS1Fix.jawaban8[0].jawaban == 'A'){
                    rKolom1++
                }
                if($scope.listEPPS1Fix.jawaban9[0].jawaban == 'A'){
                    rKolom1++
                }
                if($scope.listEPPS1Fix.jawaban10[0].jawaban == 'A'){
                    rKolom1++
                }
                if($scope.listEPPS1Fix.jawaban11[0].jawaban == 'A'){
                    rKolom1++
                }
                if($scope.listEPPS1Fix.jawaban12[0].jawaban == 'A'){
                    rKolom1++
                }
                if($scope.listEPPS1Fix.jawaban13[0].jawaban == 'A'){
                    rKolom1++
                }
                if($scope.listEPPS1Fix.jawaban14[0].jawaban == 'A'){
                    rKolom1++
                }



                if($scope.listEPPS1Fix.jawaban0[1].jawaban == 'A'){
                    rKolom2++
                }
                if($scope.listEPPS1Fix.jawaban2[1].jawaban == 'A'){
                    rKolom2++
                }
                if($scope.listEPPS1Fix.jawaban3[1].jawaban == 'A'){
                    rKolom2++
                }
                if($scope.listEPPS1Fix.jawaban4[1].jawaban == 'A'){
                    rKolom2++
                }
                if($scope.listEPPS1Fix.jawaban5[1].jawaban == 'A'){
                    rKolom2++
                }
                if($scope.listEPPS1Fix.jawaban6[1].jawaban == 'A'){
                    rKolom2++
                }
                if($scope.listEPPS1Fix.jawaban7[1].jawaban == 'A'){
                    rKolom2++
                }
                if($scope.listEPPS1Fix.jawaban8[1].jawaban == 'A'){
                    rKolom2++
                }
                if($scope.listEPPS1Fix.jawaban9[1].jawaban == 'A'){
                    rKolom2++
                }
                if($scope.listEPPS1Fix.jawaban10[1].jawaban == 'A'){
                    rKolom2++
                }
                if($scope.listEPPS1Fix.jawaban11[1].jawaban == 'A'){
                    rKolom2++
                }
                if($scope.listEPPS1Fix.jawaban12[1].jawaban == 'A'){
                    rKolom2++
                }
                if($scope.listEPPS1Fix.jawaban13[1].jawaban == 'A'){
                    rKolom2++
                }
                if($scope.listEPPS1Fix.jawaban14[1].jawaban == 'A'){
                    rKolom2++
                }



                if($scope.listEPPS1Fix.jawaban0[2].jawaban == 'A'){
                    rKolom3++
                }
                if($scope.listEPPS1Fix.jawaban1[2].jawaban == 'A'){
                    rKolom3++
                }
                if($scope.listEPPS1Fix.jawaban3[2].jawaban == 'A'){
                    rKolom3++
                }
                if($scope.listEPPS1Fix.jawaban4[2].jawaban == 'A'){
                    rKolom3++
                }
                if($scope.listEPPS1Fix.jawaban5[2].jawaban == 'A'){
                    rKolom3++
                }
                if($scope.listEPPS1Fix.jawaban6[2].jawaban == 'A'){
                    rKolom3++
                }
                if($scope.listEPPS1Fix.jawaban7[2].jawaban == 'A'){
                    rKolom3++
                }
                if($scope.listEPPS1Fix.jawaban8[2].jawaban == 'A'){
                    rKolom3++
                }
                if($scope.listEPPS1Fix.jawaban9[2].jawaban == 'A'){
                    rKolom3++
                }
                if($scope.listEPPS1Fix.jawaban10[2].jawaban == 'A'){
                    rKolom3++
                }
                if($scope.listEPPS1Fix.jawaban11[2].jawaban == 'A'){
                    rKolom3++
                }
                if($scope.listEPPS1Fix.jawaban12[2].jawaban == 'A'){
                    rKolom3++
                }
                if($scope.listEPPS1Fix.jawaban13[2].jawaban == 'A'){
                    rKolom3++
                }
                if($scope.listEPPS1Fix.jawaban14[2].jawaban == 'A'){
                    rKolom3++
                }



                if($scope.listEPPS1Fix.jawaban0[3].jawaban == 'A'){
                    rKolom4++
                }
                if($scope.listEPPS1Fix.jawaban1[3].jawaban == 'A'){
                    rKolom4++
                }
                if($scope.listEPPS1Fix.jawaban2[3].jawaban == 'A'){
                    rKolom4++
                }
                if($scope.listEPPS1Fix.jawaban4[3].jawaban == 'A'){
                    rKolom4++
                }
                if($scope.listEPPS1Fix.jawaban5[3].jawaban == 'A'){
                    rKolom4++
                }
                if($scope.listEPPS1Fix.jawaban6[3].jawaban == 'A'){
                    rKolom4++
                }
                if($scope.listEPPS1Fix.jawaban7[3].jawaban == 'A'){
                    rKolom4++
                }
                if($scope.listEPPS1Fix.jawaban8[3].jawaban == 'A'){
                    rKolom4++
                }
                if($scope.listEPPS1Fix.jawaban9[3].jawaban == 'A'){
                    rKolom4++
                }
                if($scope.listEPPS1Fix.jawaban10[3].jawaban == 'A'){
                    rKolom4++
                }
                if($scope.listEPPS1Fix.jawaban11[3].jawaban == 'A'){
                    rKolom4++
                }
                if($scope.listEPPS1Fix.jawaban12[3].jawaban == 'A'){
                    rKolom4++
                }
                if($scope.listEPPS1Fix.jawaban13[3].jawaban == 'A'){
                    rKolom4++
                }
                if($scope.listEPPS1Fix.jawaban14[3].jawaban == 'A'){
                    rKolom4++
                }



                if($scope.listEPPS1Fix.jawaban0[4].jawaban == 'A'){
                    rKolom5++
                }
                if($scope.listEPPS1Fix.jawaban1[4].jawaban == 'A'){
                    rKolom5++
                }
                if($scope.listEPPS1Fix.jawaban2[4].jawaban == 'A'){
                    rKolom5++
                }
                if($scope.listEPPS1Fix.jawaban3[4].jawaban == 'A'){
                    rKolom5++
                }
                if($scope.listEPPS1Fix.jawaban5[4].jawaban == 'A'){
                    rKolom5++
                }
                if($scope.listEPPS1Fix.jawaban6[4].jawaban == 'A'){
                    rKolom5++
                }
                if($scope.listEPPS1Fix.jawaban7[4].jawaban == 'A'){
                    rKolom5++
                }
                if($scope.listEPPS1Fix.jawaban8[4].jawaban == 'A'){
                    rKolom5++
                }
                if($scope.listEPPS1Fix.jawaban9[4].jawaban == 'A'){
                    rKolom5++
                }
                if($scope.listEPPS1Fix.jawaban10[4].jawaban == 'A'){
                    rKolom5++
                }
                if($scope.listEPPS1Fix.jawaban11[4].jawaban == 'A'){
                    rKolom5++
                }
                if($scope.listEPPS1Fix.jawaban12[4].jawaban == 'A'){
                    rKolom5++
                }
                if($scope.listEPPS1Fix.jawaban13[4].jawaban == 'A'){
                    rKolom5++
                }
                if($scope.listEPPS1Fix.jawaban14[4].jawaban == 'A'){
                    rKolom5++
                }


                if($scope.listEPPS1Fix.jawaban15[0].jawaban == 'A'){
                    rKolom6++
                }
                if($scope.listEPPS1Fix.jawaban16[0].jawaban == 'A'){
                    rKolom6++
                }
                if($scope.listEPPS1Fix.jawaban17[0].jawaban == 'A'){
                    rKolom6++
                }
                if($scope.listEPPS1Fix.jawaban18[0].jawaban == 'A'){
                    rKolom6++
                }
                if($scope.listEPPS1Fix.jawaban19[0].jawaban == 'A'){
                    rKolom6++
                }
                if($scope.listEPPS1Fix.jawaban21[0].jawaban == 'A'){
                    rKolom6++
                }
                if($scope.listEPPS1Fix.jawaban22[0].jawaban == 'A'){
                    rKolom6++
                }
                if($scope.listEPPS1Fix.jawaban23[0].jawaban == 'A'){
                    rKolom6++
                }
                if($scope.listEPPS1Fix.jawaban24[0].jawaban == 'A'){
                    rKolom6++
                }
                if($scope.listEPPS1Fix.jawaban25[0].jawaban == 'A'){
                    rKolom6++
                }
                if($scope.listEPPS1Fix.jawaban26[0].jawaban == 'A'){
                    rKolom6++
                }
                if($scope.listEPPS1Fix.jawaban27[0].jawaban == 'A'){
                    rKolom6++
                }
                if($scope.listEPPS1Fix.jawaban28[0].jawaban == 'A'){
                    rKolom6++
                }
                if($scope.listEPPS1Fix.jawaban29[0].jawaban == 'A'){
                    rKolom6++
                }

                if($scope.listEPPS1Fix.jawaban15[1].jawaban == 'A'){
                    rKolom7++
                }
                if($scope.listEPPS1Fix.jawaban16[1].jawaban == 'A'){
                    rKolom7++
                }
                if($scope.listEPPS1Fix.jawaban17[1].jawaban == 'A'){
                    rKolom7++
                }
                if($scope.listEPPS1Fix.jawaban18[1].jawaban == 'A'){
                    rKolom7++
                }
                if($scope.listEPPS1Fix.jawaban19[1].jawaban == 'A'){
                    rKolom7++
                }
                if($scope.listEPPS1Fix.jawaban20[1].jawaban == 'A'){
                    rKolom7++
                }
                if($scope.listEPPS1Fix.jawaban22[1].jawaban == 'A'){
                    rKolom7++
                }
                if($scope.listEPPS1Fix.jawaban23[1].jawaban == 'A'){
                    rKolom7++
                }
                if($scope.listEPPS1Fix.jawaban24[1].jawaban == 'A'){
                    rKolom7++
                }
                if($scope.listEPPS1Fix.jawaban25[1].jawaban == 'A'){
                    rKolom7++
                }
                if($scope.listEPPS1Fix.jawaban26[1].jawaban == 'A'){
                    rKolom7++
                }
                if($scope.listEPPS1Fix.jawaban27[1].jawaban == 'A'){
                    rKolom7++
                }
                if($scope.listEPPS1Fix.jawaban28[1].jawaban == 'A'){
                    rKolom7++
                }
                if($scope.listEPPS1Fix.jawaban29[1].jawaban == 'A'){
                    rKolom7++
                }



                if($scope.listEPPS1Fix.jawaban15[2].jawaban == 'A'){
                    rKolom8++
                }
                if($scope.listEPPS1Fix.jawaban16[2].jawaban == 'A'){
                    rKolom8++
                }
                if($scope.listEPPS1Fix.jawaban17[2].jawaban == 'A'){
                    rKolom8++
                }
                if($scope.listEPPS1Fix.jawaban18[2].jawaban == 'A'){
                    rKolom8++
                }
                if($scope.listEPPS1Fix.jawaban19[2].jawaban == 'A'){
                    rKolom8++
                }
                if($scope.listEPPS1Fix.jawaban20[2].jawaban == 'A'){
                    rKolom8++
                }
                if($scope.listEPPS1Fix.jawaban21[2].jawaban == 'A'){
                    rKolom8++
                }
                if($scope.listEPPS1Fix.jawaban23[2].jawaban == 'A'){
                    rKolom8++
                }
                if($scope.listEPPS1Fix.jawaban24[2].jawaban == 'A'){
                    rKolom8++
                }
                if($scope.listEPPS1Fix.jawaban25[2].jawaban == 'A'){
                    rKolom8++
                }
                if($scope.listEPPS1Fix.jawaban26[2].jawaban == 'A'){
                    rKolom8++
                }
                if($scope.listEPPS1Fix.jawaban27[2].jawaban == 'A'){
                    rKolom8++
                }
                if($scope.listEPPS1Fix.jawaban28[2].jawaban == 'A'){
                    rKolom8++
                }
                if($scope.listEPPS1Fix.jawaban29[2].jawaban == 'A'){
                    rKolom8++
                }



                if($scope.listEPPS1Fix.jawaban15[3].jawaban == 'A'){
                    rKolom9++
                }
                if($scope.listEPPS1Fix.jawaban16[3].jawaban == 'A'){
                    rKolom9++
                }
                if($scope.listEPPS1Fix.jawaban17[3].jawaban == 'A'){
                    rKolom9++
                }
                if($scope.listEPPS1Fix.jawaban18[3].jawaban == 'A'){
                    rKolom9++
                }
                if($scope.listEPPS1Fix.jawaban19[3].jawaban == 'A'){
                    rKolom9++
                }
                if($scope.listEPPS1Fix.jawaban20[3].jawaban == 'A'){
                    rKolom9++
                }
                if($scope.listEPPS1Fix.jawaban21[3].jawaban == 'A'){
                    rKolom9++
                }
                if($scope.listEPPS1Fix.jawaban22[3].jawaban == 'A'){
                    rKolom9++
                }
                if($scope.listEPPS1Fix.jawaban24[3].jawaban == 'A'){
                    rKolom9++
                }
                if($scope.listEPPS1Fix.jawaban25[3].jawaban == 'A'){
                    rKolom9++
                }
                if($scope.listEPPS1Fix.jawaban26[3].jawaban == 'A'){
                    rKolom9++
                }
                if($scope.listEPPS1Fix.jawaban27[3].jawaban == 'A'){
                    rKolom9++
                }
                if($scope.listEPPS1Fix.jawaban28[3].jawaban == 'A'){
                    rKolom9++
                }
                if($scope.listEPPS1Fix.jawaban29[3].jawaban == 'A'){
                    rKolom9++
                }



                if($scope.listEPPS1Fix.jawaban15[4].jawaban == 'A'){
                    rKolom10++
                }
                if($scope.listEPPS1Fix.jawaban16[4].jawaban == 'A'){
                    rKolom10++
                }
                if($scope.listEPPS1Fix.jawaban17[4].jawaban == 'A'){
                    rKolom10++
                }
                if($scope.listEPPS1Fix.jawaban18[4].jawaban == 'A'){
                    rKolom10++
                }
                if($scope.listEPPS1Fix.jawaban19[4].jawaban == 'A'){
                    rKolom10++
                }
                if($scope.listEPPS1Fix.jawaban20[4].jawaban == 'A'){
                    rKolom10++
                }
                if($scope.listEPPS1Fix.jawaban21[4].jawaban == 'A'){
                    rKolom10++
                }
                if($scope.listEPPS1Fix.jawaban22[4].jawaban == 'A'){
                    rKolom10++
                }
                if($scope.listEPPS1Fix.jawaban23[4].jawaban == 'A'){
                    rKolom10++
                }
                if($scope.listEPPS1Fix.jawaban25[4].jawaban == 'A'){
                    rKolom10++
                }
                if($scope.listEPPS1Fix.jawaban26[4].jawaban == 'A'){
                    rKolom10++
                }
                if($scope.listEPPS1Fix.jawaban27[4].jawaban == 'A'){
                    rKolom10++
                }
                if($scope.listEPPS1Fix.jawaban28[4].jawaban == 'A'){
                    rKolom10++
                }
                if($scope.listEPPS1Fix.jawaban29[4].jawaban == 'A'){
                    rKolom10++
                }


                if($scope.listEPPS1Fix.jawaban30[0].jawaban == 'A'){
                    rKolom11++
                }
                if($scope.listEPPS1Fix.jawaban31[0].jawaban == 'A'){
                    rKolom11++
                }
                if($scope.listEPPS1Fix.jawaban32[0].jawaban == 'A'){
                    rKolom11++
                }
                if($scope.listEPPS1Fix.jawaban33[0].jawaban == 'A'){
                    rKolom11++
                }
                if($scope.listEPPS1Fix.jawaban34[0].jawaban == 'A'){
                    rKolom11++
                }
                if($scope.listEPPS1Fix.jawaban35[0].jawaban == 'A'){
                    rKolom11++
                }
                if($scope.listEPPS1Fix.jawaban36[0].jawaban == 'A'){
                    rKolom11++
                }
                if($scope.listEPPS1Fix.jawaban37[0].jawaban == 'A'){
                    rKolom11++
                }
                if($scope.listEPPS1Fix.jawaban38[0].jawaban == 'A'){
                    rKolom11++
                }
                if($scope.listEPPS1Fix.jawaban39[0].jawaban == 'A'){
                    rKolom11++
                }
                if($scope.listEPPS1Fix.jawaban41[0].jawaban == 'A'){
                    rKolom11++
                }
                if($scope.listEPPS1Fix.jawaban42[0].jawaban == 'A'){
                    rKolom11++
                }
                if($scope.listEPPS1Fix.jawaban43[0].jawaban == 'A'){
                    rKolom11++
                }
                if($scope.listEPPS1Fix.jawaban44[0].jawaban == 'A'){
                    rKolom11++
                }


                if($scope.listEPPS1Fix.jawaban30[1].jawaban == 'A'){
                    rKolom12++
                }
                if($scope.listEPPS1Fix.jawaban31[1].jawaban == 'A'){
                    rKolom12++
                }
                if($scope.listEPPS1Fix.jawaban32[1].jawaban == 'A'){
                    rKolom12++
                }
                if($scope.listEPPS1Fix.jawaban33[1].jawaban == 'A'){
                    rKolom12++
                }
                if($scope.listEPPS1Fix.jawaban34[1].jawaban == 'A'){
                    rKolom12++
                }
                if($scope.listEPPS1Fix.jawaban35[1].jawaban == 'A'){
                    rKolom12++
                }
                if($scope.listEPPS1Fix.jawaban36[1].jawaban == 'A'){
                    rKolom12++
                }
                if($scope.listEPPS1Fix.jawaban37[1].jawaban == 'A'){
                    rKolom12++
                }
                if($scope.listEPPS1Fix.jawaban38[1].jawaban == 'A'){
                    rKolom12++
                }
                if($scope.listEPPS1Fix.jawaban39[1].jawaban == 'A'){
                    rKolom12++
                }
                if($scope.listEPPS1Fix.jawaban40[1].jawaban == 'A'){
                    rKolom12++
                }
                if($scope.listEPPS1Fix.jawaban42[1].jawaban == 'A'){
                    rKolom12++
                }
                if($scope.listEPPS1Fix.jawaban43[1].jawaban == 'A'){
                    rKolom12++
                }
                if($scope.listEPPS1Fix.jawaban44[1].jawaban == 'A'){
                    rKolom12++
                }



                if($scope.listEPPS1Fix.jawaban30[2].jawaban == 'A'){
                    rKolom13++
                }
                if($scope.listEPPS1Fix.jawaban31[2].jawaban == 'A'){
                    rKolom13++
                }
                if($scope.listEPPS1Fix.jawaban32[2].jawaban == 'A'){
                    rKolom13++
                }
                if($scope.listEPPS1Fix.jawaban33[2].jawaban == 'A'){
                    rKolom13++
                }
                if($scope.listEPPS1Fix.jawaban34[2].jawaban == 'A'){
                    rKolom13++
                }
                if($scope.listEPPS1Fix.jawaban35[2].jawaban == 'A'){
                    rKolom13++
                }
                if($scope.listEPPS1Fix.jawaban36[2].jawaban == 'A'){
                    rKolom13++
                }
                if($scope.listEPPS1Fix.jawaban37[2].jawaban == 'A'){
                    rKolom13++
                }
                if($scope.listEPPS1Fix.jawaban38[2].jawaban == 'A'){
                    rKolom13++
                }
                if($scope.listEPPS1Fix.jawaban39[2].jawaban == 'A'){
                    rKolom13++
                }
                if($scope.listEPPS1Fix.jawaban40[2].jawaban == 'A'){
                    rKolom13++
                }
                if($scope.listEPPS1Fix.jawaban41[2].jawaban == 'A'){
                    rKolom13++
                }
                if($scope.listEPPS1Fix.jawaban43[2].jawaban == 'A'){
                    rKolom13++
                }
                if($scope.listEPPS1Fix.jawaban44[2].jawaban == 'A'){
                    rKolom13++
                }



                if($scope.listEPPS1Fix.jawaban30[3].jawaban == 'A'){
                    rKolom14++
                }
                if($scope.listEPPS1Fix.jawaban31[3].jawaban == 'A'){
                    rKolom14++
                }
                if($scope.listEPPS1Fix.jawaban32[3].jawaban == 'A'){
                    rKolom14++
                }
                if($scope.listEPPS1Fix.jawaban33[3].jawaban == 'A'){
                    rKolom14++
                }
                if($scope.listEPPS1Fix.jawaban34[3].jawaban == 'A'){
                    rKolom14++
                }
                if($scope.listEPPS1Fix.jawaban35[3].jawaban == 'A'){
                    rKolom14++
                }
                if($scope.listEPPS1Fix.jawaban36[3].jawaban == 'A'){
                    rKolom14++
                }
                if($scope.listEPPS1Fix.jawaban37[3].jawaban == 'A'){
                    rKolom14++
                }
                if($scope.listEPPS1Fix.jawaban38[3].jawaban == 'A'){
                    rKolom14++
                }
                if($scope.listEPPS1Fix.jawaban39[3].jawaban == 'A'){
                    rKolom14++
                }
                if($scope.listEPPS1Fix.jawaban40[3].jawaban == 'A'){
                    rKolom14++
                }
                if($scope.listEPPS1Fix.jawaban41[3].jawaban == 'A'){
                    rKolom14++
                }
                if($scope.listEPPS1Fix.jawaban42[3].jawaban == 'A'){
                    rKolom14++
                }
                if($scope.listEPPS1Fix.jawaban44[3].jawaban == 'A'){
                    rKolom14++
                }



                if($scope.listEPPS1Fix.jawaban30[4].jawaban == 'A'){
                    rKolom15++
                }
                if($scope.listEPPS1Fix.jawaban31[4].jawaban == 'A'){
                    rKolom15++
                }
                if($scope.listEPPS1Fix.jawaban32[4].jawaban == 'A'){
                    rKolom15++
                }
                if($scope.listEPPS1Fix.jawaban33[4].jawaban == 'A'){
                    rKolom15++
                }
                if($scope.listEPPS1Fix.jawaban34[4].jawaban == 'A'){
                    rKolom15++
                }
                if($scope.listEPPS1Fix.jawaban35[4].jawaban == 'A'){
                    rKolom15++
                }
                if($scope.listEPPS1Fix.jawaban36[4].jawaban == 'A'){
                    rKolom15++
                }
                if($scope.listEPPS1Fix.jawaban37[4].jawaban == 'A'){
                    rKolom15++
                }
                if($scope.listEPPS1Fix.jawaban38[4].jawaban == 'A'){
                    rKolom15++
                }
                if($scope.listEPPS1Fix.jawaban39[4].jawaban == 'A'){
                    rKolom15++
                }
                if($scope.listEPPS1Fix.jawaban40[4].jawaban == 'A'){
                    rKolom15++
                }
                if($scope.listEPPS1Fix.jawaban41[4].jawaban == 'A'){
                    rKolom15++
                }
                if($scope.listEPPS1Fix.jawaban42[4].jawaban == 'A'){
                    rKolom15++
                }
                if($scope.listEPPS1Fix.jawaban43[4].jawaban == 'A'){
                    rKolom15++
                }



                if($scope.listEPPS1Fix.jawaban0[1].jawaban == 'B'){
                    cKolom1++
                }
                if($scope.listEPPS1Fix.jawaban0[2].jawaban == 'B'){
                    cKolom1++
                }
                if($scope.listEPPS1Fix.jawaban0[3].jawaban == 'B'){
                    cKolom1++
                }
                if($scope.listEPPS1Fix.jawaban0[4].jawaban == 'B'){
                    cKolom1++
                }
                if($scope.listEPPS1Fix.jawaban15[0].jawaban == 'B'){
                    cKolom1++
                }
                if($scope.listEPPS1Fix.jawaban15[1].jawaban == 'B'){
                    cKolom1++
                }
                if($scope.listEPPS1Fix.jawaban15[2].jawaban == 'B'){
                    cKolom1++
                }
                if($scope.listEPPS1Fix.jawaban15[3].jawaban == 'B'){
                    cKolom1++
                }
                if($scope.listEPPS1Fix.jawaban15[4].jawaban == 'B'){
                    cKolom1++
                }
                if($scope.listEPPS1Fix.jawaban30[0].jawaban == 'B'){
                    cKolom1++
                }
                if($scope.listEPPS1Fix.jawaban30[1].jawaban == 'B'){
                    cKolom1++
                }
                if($scope.listEPPS1Fix.jawaban30[2].jawaban == 'B'){
                    cKolom1++
                }
                if($scope.listEPPS1Fix.jawaban30[3].jawaban == 'B'){
                    cKolom1++
                }
                if($scope.listEPPS1Fix.jawaban30[4].jawaban == 'B'){
                    cKolom1++
                }



                if($scope.listEPPS1Fix.jawaban1[2].jawaban == 'B'){
                    cKolom2++
                }
                if($scope.listEPPS1Fix.jawaban1[0].jawaban == 'B'){
                    cKolom2++
                }
                if($scope.listEPPS1Fix.jawaban1[3].jawaban == 'B'){
                    cKolom2++
                }
                if($scope.listEPPS1Fix.jawaban1[4].jawaban == 'B'){
                    cKolom2++
                }
                if($scope.listEPPS1Fix.jawaban16[0].jawaban == 'B'){
                    cKolom2++
                }
                if($scope.listEPPS1Fix.jawaban16[1].jawaban == 'B'){
                    cKolom2++
                }
                if($scope.listEPPS1Fix.jawaban16[2].jawaban == 'B'){
                    cKolom2++
                }
                if($scope.listEPPS1Fix.jawaban16[3].jawaban == 'B'){
                    cKolom2++
                }
                if($scope.listEPPS1Fix.jawaban16[4].jawaban == 'B'){
                    cKolom2++
                }
                if($scope.listEPPS1Fix.jawaban31[0].jawaban == 'B'){
                    cKolom2++
                }
                if($scope.listEPPS1Fix.jawaban31[1].jawaban == 'B'){
                    cKolom2++
                }
                if($scope.listEPPS1Fix.jawaban31[2].jawaban == 'B'){
                    cKolom2++
                }
                if($scope.listEPPS1Fix.jawaban31[3].jawaban == 'B'){
                    cKolom2++
                }
                if($scope.listEPPS1Fix.jawaban31[4].jawaban == 'B'){
                    cKolom2++
                }



                if($scope.listEPPS1Fix.jawaban2[1].jawaban == 'B'){
                    cKolom3++
                }
                if($scope.listEPPS1Fix.jawaban2[0].jawaban == 'B'){
                    cKolom3++
                }
                if($scope.listEPPS1Fix.jawaban2[3].jawaban == 'B'){
                    cKolom3++
                }
                if($scope.listEPPS1Fix.jawaban2[4].jawaban == 'B'){
                    cKolom3++
                }
                if($scope.listEPPS1Fix.jawaban17[0].jawaban == 'B'){
                    cKolom3++
                }
                if($scope.listEPPS1Fix.jawaban17[1].jawaban == 'B'){
                    cKolom3++
                }
                if($scope.listEPPS1Fix.jawaban17[2].jawaban == 'B'){
                    cKolom3++
                }
                if($scope.listEPPS1Fix.jawaban17[3].jawaban == 'B'){
                    cKolom3++
                }
                if($scope.listEPPS1Fix.jawaban17[4].jawaban == 'B'){
                    cKolom3++
                }
                if($scope.listEPPS1Fix.jawaban32[0].jawaban == 'B'){
                    cKolom3++
                }
                if($scope.listEPPS1Fix.jawaban32[1].jawaban == 'B'){
                    cKolom3++
                }
                if($scope.listEPPS1Fix.jawaban32[2].jawaban == 'B'){
                    cKolom3++
                }
                if($scope.listEPPS1Fix.jawaban32[3].jawaban == 'B'){
                    cKolom3++
                }
                if($scope.listEPPS1Fix.jawaban32[4].jawaban == 'B'){
                    cKolom3++
                }



                if($scope.listEPPS1Fix.jawaban3[1].jawaban == 'B'){
                    cKolom4++
                }
                if($scope.listEPPS1Fix.jawaban3[0].jawaban == 'B'){
                    cKolom4++
                }
                if($scope.listEPPS1Fix.jawaban3[2].jawaban == 'B'){
                    cKolom4++
                }
                if($scope.listEPPS1Fix.jawaban3[4].jawaban == 'B'){
                    cKolom4++
                }
                if($scope.listEPPS1Fix.jawaban18[0].jawaban == 'B'){
                    cKolom4++
                }
                if($scope.listEPPS1Fix.jawaban18[1].jawaban == 'B'){
                    cKolom4++
                }
                if($scope.listEPPS1Fix.jawaban18[2].jawaban == 'B'){
                    cKolom4++
                }
                if($scope.listEPPS1Fix.jawaban18[3].jawaban == 'B'){
                    cKolom4++
                }
                if($scope.listEPPS1Fix.jawaban18[4].jawaban == 'B'){
                    cKolom4++
                }
                if($scope.listEPPS1Fix.jawaban33[0].jawaban == 'B'){
                    cKolom4++
                }
                if($scope.listEPPS1Fix.jawaban33[1].jawaban == 'B'){
                    cKolom4++
                }
                if($scope.listEPPS1Fix.jawaban33[2].jawaban == 'B'){
                    cKolom4++
                }
                if($scope.listEPPS1Fix.jawaban33[3].jawaban == 'B'){
                    cKolom4++
                }
                if($scope.listEPPS1Fix.jawaban33[4].jawaban == 'B'){
                    cKolom4++
                }



                if($scope.listEPPS1Fix.jawaban4[1].jawaban == 'B'){
                    cKolom5++
                }
                if($scope.listEPPS1Fix.jawaban4[0].jawaban == 'B'){
                    cKolom5++
                }
                if($scope.listEPPS1Fix.jawaban4[2].jawaban == 'B'){
                    cKolom5++
                }
                if($scope.listEPPS1Fix.jawaban4[3].jawaban == 'B'){
                    cKolom5++
                }
                if($scope.listEPPS1Fix.jawaban19[0].jawaban == 'B'){
                    cKolom5++
                }
                if($scope.listEPPS1Fix.jawaban19[1].jawaban == 'B'){
                    cKolom5++
                }
                if($scope.listEPPS1Fix.jawaban19[2].jawaban == 'B'){
                    cKolom5++
                }
                if($scope.listEPPS1Fix.jawaban19[3].jawaban == 'B'){
                    cKolom5++
                }
                if($scope.listEPPS1Fix.jawaban19[4].jawaban == 'B'){
                    cKolom5++
                }
                if($scope.listEPPS1Fix.jawaban34[0].jawaban == 'B'){
                    cKolom5++
                }
                if($scope.listEPPS1Fix.jawaban34[1].jawaban == 'B'){
                    cKolom5++
                }
                if($scope.listEPPS1Fix.jawaban34[2].jawaban == 'B'){
                    cKolom5++
                }
                if($scope.listEPPS1Fix.jawaban34[3].jawaban == 'B'){
                    cKolom5++
                }
                if($scope.listEPPS1Fix.jawaban34[4].jawaban == 'B'){
                    cKolom5++
                }



                if($scope.listEPPS1Fix.jawaban5[1].jawaban == 'B'){
                    cKolom6++
                }
                if($scope.listEPPS1Fix.jawaban5[0].jawaban == 'B'){
                    cKolom6++
                }
                if($scope.listEPPS1Fix.jawaban5[2].jawaban == 'B'){
                    cKolom6++
                }
                if($scope.listEPPS1Fix.jawaban5[3].jawaban == 'B'){
                    cKolom6++
                }
                if($scope.listEPPS1Fix.jawaban5[4].jawaban == 'B'){
                    cKolom6++
                }
                if($scope.listEPPS1Fix.jawaban20[1].jawaban == 'B'){
                    cKolom6++
                }
                if($scope.listEPPS1Fix.jawaban20[2].jawaban == 'B'){
                    cKolom6++
                }
                if($scope.listEPPS1Fix.jawaban20[3].jawaban == 'B'){
                    cKolom6++
                }
                if($scope.listEPPS1Fix.jawaban20[4].jawaban == 'B'){
                    cKolom6++
                }
                if($scope.listEPPS1Fix.jawaban35[0].jawaban == 'B'){
                    cKolom6++
                }
                if($scope.listEPPS1Fix.jawaban35[1].jawaban == 'B'){
                    cKolom6++
                }
                if($scope.listEPPS1Fix.jawaban35[2].jawaban == 'B'){
                    cKolom6++
                }
                if($scope.listEPPS1Fix.jawaban35[3].jawaban == 'B'){
                    cKolom6++
                }
                if($scope.listEPPS1Fix.jawaban35[4].jawaban == 'B'){
                    cKolom6++
                }



                if($scope.listEPPS1Fix.jawaban6[1].jawaban == 'B'){
                    cKolom7++
                }
                if($scope.listEPPS1Fix.jawaban6[0].jawaban == 'B'){
                    cKolom7++
                }
                if($scope.listEPPS1Fix.jawaban6[2].jawaban == 'B'){
                    cKolom7++
                }
                if($scope.listEPPS1Fix.jawaban6[3].jawaban == 'B'){
                    cKolom7++
                }
                if($scope.listEPPS1Fix.jawaban6[4].jawaban == 'B'){
                    cKolom7++
                }
                if($scope.listEPPS1Fix.jawaban21[0].jawaban == 'B'){
                    cKolom7++
                }
                if($scope.listEPPS1Fix.jawaban21[2].jawaban == 'B'){
                    cKolom7++
                }
                if($scope.listEPPS1Fix.jawaban21[3].jawaban == 'B'){
                    cKolom7++
                }
                if($scope.listEPPS1Fix.jawaban21[4].jawaban == 'B'){
                    cKolom7++
                }
                if($scope.listEPPS1Fix.jawaban36[0].jawaban == 'B'){
                    cKolom7++
                }
                if($scope.listEPPS1Fix.jawaban36[1].jawaban == 'B'){
                    cKolom7++
                }
                if($scope.listEPPS1Fix.jawaban36[2].jawaban == 'B'){
                    cKolom7++
                }
                if($scope.listEPPS1Fix.jawaban36[3].jawaban == 'B'){
                    cKolom7++
                }
                if($scope.listEPPS1Fix.jawaban36[4].jawaban == 'B'){
                    cKolom7++
                }



                if($scope.listEPPS1Fix.jawaban7[1].jawaban == 'B'){
                    cKolom8++
                }
                if($scope.listEPPS1Fix.jawaban7[0].jawaban == 'B'){
                    cKolom8++
                }
                if($scope.listEPPS1Fix.jawaban7[2].jawaban == 'B'){
                    cKolom8++
                }
                if($scope.listEPPS1Fix.jawaban7[3].jawaban == 'B'){
                    cKolom8++
                }
                if($scope.listEPPS1Fix.jawaban7[4].jawaban == 'B'){
                    cKolom8++
                }
                if($scope.listEPPS1Fix.jawaban22[0].jawaban == 'B'){
                    cKolom8++
                }
                if($scope.listEPPS1Fix.jawaban22[1].jawaban == 'B'){
                    cKolom8++
                }
                if($scope.listEPPS1Fix.jawaban22[3].jawaban == 'B'){
                    cKolom8++
                }
                if($scope.listEPPS1Fix.jawaban22[4].jawaban == 'B'){
                    cKolom8++
                }
                if($scope.listEPPS1Fix.jawaban37[0].jawaban == 'B'){
                    cKolom8++
                }
                if($scope.listEPPS1Fix.jawaban37[1].jawaban == 'B'){
                    cKolom8++
                }
                if($scope.listEPPS1Fix.jawaban37[2].jawaban == 'B'){
                    cKolom8++
                }
                if($scope.listEPPS1Fix.jawaban37[3].jawaban == 'B'){
                    cKolom8++
                }
                if($scope.listEPPS1Fix.jawaban37[4].jawaban == 'B'){
                    cKolom8++
                }




                if($scope.listEPPS1Fix.jawaban8[1].jawaban == 'B'){
                    cKolom9++
                }
                if($scope.listEPPS1Fix.jawaban8[0].jawaban == 'B'){
                    cKolom9++
                }
                if($scope.listEPPS1Fix.jawaban8[2].jawaban == 'B'){
                    cKolom9++
                }
                if($scope.listEPPS1Fix.jawaban8[3].jawaban == 'B'){
                    cKolom9++
                }
                if($scope.listEPPS1Fix.jawaban8[4].jawaban == 'B'){
                    cKolom9++
                }
                if($scope.listEPPS1Fix.jawaban23[0].jawaban == 'B'){
                    cKolom9++
                }
                if($scope.listEPPS1Fix.jawaban23[1].jawaban == 'B'){
                    cKolom9++
                }
                if($scope.listEPPS1Fix.jawaban23[2].jawaban == 'B'){
                    cKolom9++
                }
                if($scope.listEPPS1Fix.jawaban23[4].jawaban == 'B'){
                    cKolom9++
                }
                if($scope.listEPPS1Fix.jawaban38[0].jawaban == 'B'){
                    cKolom9++
                }
                if($scope.listEPPS1Fix.jawaban38[1].jawaban == 'B'){
                    cKolom9++
                }
                if($scope.listEPPS1Fix.jawaban38[2].jawaban == 'B'){
                    cKolom9++
                }
                if($scope.listEPPS1Fix.jawaban38[3].jawaban == 'B'){
                    cKolom9++
                }
                if($scope.listEPPS1Fix.jawaban38[4].jawaban == 'B'){
                    cKolom9++
                }



                if($scope.listEPPS1Fix.jawaban9[1].jawaban == 'B'){
                    cKolom10++
                }
                if($scope.listEPPS1Fix.jawaban9[0].jawaban == 'B'){
                    cKolom10++
                }
                if($scope.listEPPS1Fix.jawaban9[2].jawaban == 'B'){
                    cKolom10++
                }
                if($scope.listEPPS1Fix.jawaban9[3].jawaban == 'B'){
                    cKolom10++
                }
                if($scope.listEPPS1Fix.jawaban9[4].jawaban == 'B'){
                    cKolom10++
                }
                if($scope.listEPPS1Fix.jawaban24[0].jawaban == 'B'){
                    cKolom10++
                }
                if($scope.listEPPS1Fix.jawaban24[1].jawaban == 'B'){
                    cKolom10++
                }
                if($scope.listEPPS1Fix.jawaban24[2].jawaban == 'B'){
                    cKolom10++
                }
                if($scope.listEPPS1Fix.jawaban24[3].jawaban == 'B'){
                    cKolom10++
                }
                if($scope.listEPPS1Fix.jawaban39[0].jawaban == 'B'){
                    cKolom10++
                }
                if($scope.listEPPS1Fix.jawaban39[1].jawaban == 'B'){
                    cKolom10++
                }
                if($scope.listEPPS1Fix.jawaban39[2].jawaban == 'B'){
                    cKolom10++
                }
                if($scope.listEPPS1Fix.jawaban39[3].jawaban == 'B'){
                    cKolom10++
                }
                if($scope.listEPPS1Fix.jawaban39[4].jawaban == 'B'){
                    cKolom10++
                }



                if($scope.listEPPS1Fix.jawaban10[1].jawaban == 'B'){
                    cKolom11++
                }
                if($scope.listEPPS1Fix.jawaban10[0].jawaban == 'B'){
                    cKolom11++
                }
                if($scope.listEPPS1Fix.jawaban10[2].jawaban == 'B'){
                    cKolom11++
                }
                if($scope.listEPPS1Fix.jawaban10[3].jawaban == 'B'){
                    cKolom11++
                }
                if($scope.listEPPS1Fix.jawaban10[4].jawaban == 'B'){
                    cKolom11++
                }
                if($scope.listEPPS1Fix.jawaban25[0].jawaban == 'B'){
                    cKolom11++
                }
                if($scope.listEPPS1Fix.jawaban25[1].jawaban == 'B'){
                    cKolom11++
                }
                if($scope.listEPPS1Fix.jawaban25[2].jawaban == 'B'){
                    cKolom11++
                }
                if($scope.listEPPS1Fix.jawaban25[3].jawaban == 'B'){
                    cKolom11++
                }
                if($scope.listEPPS1Fix.jawaban25[4].jawaban == 'B'){
                    cKolom11++
                }
                if($scope.listEPPS1Fix.jawaban40[1].jawaban == 'B'){
                    cKolom11++
                }
                if($scope.listEPPS1Fix.jawaban40[2].jawaban == 'B'){
                    cKolom11++
                }
                if($scope.listEPPS1Fix.jawaban40[3].jawaban == 'B'){
                    cKolom11++
                }
                if($scope.listEPPS1Fix.jawaban40[4].jawaban == 'B'){
                    cKolom11++
                }



                if($scope.listEPPS1Fix.jawaban11[1].jawaban == 'B'){
                    cKolom12++
                }
                if($scope.listEPPS1Fix.jawaban11[0].jawaban == 'B'){
                    cKolom12++
                }
                if($scope.listEPPS1Fix.jawaban11[2].jawaban == 'B'){
                    cKolom12++
                }
                if($scope.listEPPS1Fix.jawaban11[3].jawaban == 'B'){
                    cKolom12++
                }
                if($scope.listEPPS1Fix.jawaban11[4].jawaban == 'B'){
                    cKolom12++
                }
                if($scope.listEPPS1Fix.jawaban26[0].jawaban == 'B'){
                    cKolom12++
                }
                if($scope.listEPPS1Fix.jawaban26[1].jawaban == 'B'){
                    cKolom12++
                }
                if($scope.listEPPS1Fix.jawaban26[2].jawaban == 'B'){
                    cKolom12++
                }
                if($scope.listEPPS1Fix.jawaban26[3].jawaban == 'B'){
                    cKolom12++
                }
                if($scope.listEPPS1Fix.jawaban26[4].jawaban == 'B'){
                    cKolom12++
                }
                if($scope.listEPPS1Fix.jawaban41[0].jawaban == 'B'){
                    cKolom12++
                }
                if($scope.listEPPS1Fix.jawaban41[2].jawaban == 'B'){
                    cKolom12++
                }
                if($scope.listEPPS1Fix.jawaban41[3].jawaban == 'B'){
                    cKolom12++
                }
                if($scope.listEPPS1Fix.jawaban41[4].jawaban == 'B'){
                    cKolom12++
                }



                if($scope.listEPPS1Fix.jawaban12[1].jawaban == 'B'){
                    cKolom13++
                }
                if($scope.listEPPS1Fix.jawaban12[0].jawaban == 'B'){
                    cKolom13++
                }
                if($scope.listEPPS1Fix.jawaban12[2].jawaban == 'B'){
                    cKolom13++
                }
                if($scope.listEPPS1Fix.jawaban12[3].jawaban == 'B'){
                    cKolom13++
                }
                if($scope.listEPPS1Fix.jawaban12[4].jawaban == 'B'){
                    cKolom13++
                }
                if($scope.listEPPS1Fix.jawaban27[0].jawaban == 'B'){
                    cKolom13++
                }
                if($scope.listEPPS1Fix.jawaban27[1].jawaban == 'B'){
                    cKolom13++
                }
                if($scope.listEPPS1Fix.jawaban27[2].jawaban == 'B'){
                    cKolom13++
                }
                if($scope.listEPPS1Fix.jawaban27[3].jawaban == 'B'){
                    cKolom13++
                }
                if($scope.listEPPS1Fix.jawaban27[4].jawaban == 'B'){
                    cKolom13++
                }
                if($scope.listEPPS1Fix.jawaban42[0].jawaban == 'B'){
                    cKolom13++
                }
                if($scope.listEPPS1Fix.jawaban42[1].jawaban == 'B'){
                    cKolom13++
                }
                if($scope.listEPPS1Fix.jawaban42[3].jawaban == 'B'){
                    cKolom13++
                }
                if($scope.listEPPS1Fix.jawaban42[4].jawaban == 'B'){
                    cKolom13++
                }




                if($scope.listEPPS1Fix.jawaban13[1].jawaban == 'B'){
                    cKolom13++
                }
                if($scope.listEPPS1Fix.jawaban13[0].jawaban == 'B'){
                    cKolom14++
                }
                if($scope.listEPPS1Fix.jawaban13[2].jawaban == 'B'){
                    cKolom14++
                }
                if($scope.listEPPS1Fix.jawaban13[3].jawaban == 'B'){
                    cKolom14++
                }
                if($scope.listEPPS1Fix.jawaban13[4].jawaban == 'B'){
                    cKolom14++
                }
                if($scope.listEPPS1Fix.jawaban28[0].jawaban == 'B'){
                    cKolom14++
                }
                if($scope.listEPPS1Fix.jawaban28[1].jawaban == 'B'){
                    cKolom14++
                }
                if($scope.listEPPS1Fix.jawaban28[2].jawaban == 'B'){
                    cKolom14++
                }
                if($scope.listEPPS1Fix.jawaban28[3].jawaban == 'B'){
                    cKolom14++
                }
                if($scope.listEPPS1Fix.jawaban28[4].jawaban == 'B'){
                    cKolom14++
                }
                if($scope.listEPPS1Fix.jawaban43[0].jawaban == 'B'){
                    cKolom14++
                }
                if($scope.listEPPS1Fix.jawaban43[1].jawaban == 'B'){
                    cKolom14++
                }
                if($scope.listEPPS1Fix.jawaban43[2].jawaban == 'B'){
                    cKolom14++
                }
                if($scope.listEPPS1Fix.jawaban43[4].jawaban == 'B'){
                    cKolom14++
                }




                if($scope.listEPPS1Fix.jawaban14[1].jawaban == 'B'){
                    cKolom15++
                }
                if($scope.listEPPS1Fix.jawaban14[0].jawaban == 'B'){
                    cKolom15++
                }
                if($scope.listEPPS1Fix.jawaban14[2].jawaban == 'B'){
                    cKolom15++
                }
                if($scope.listEPPS1Fix.jawaban14[3].jawaban == 'B'){
                    cKolom15++
                }
                if($scope.listEPPS1Fix.jawaban14[4].jawaban == 'B'){
                    cKolom15++
                }
                if($scope.listEPPS1Fix.jawaban29[0].jawaban == 'B'){
                    cKolom15++
                }
                if($scope.listEPPS1Fix.jawaban29[1].jawaban == 'B'){
                    cKolom15++
                }
                if($scope.listEPPS1Fix.jawaban29[2].jawaban == 'B'){
                    cKolom15++
                }
                if($scope.listEPPS1Fix.jawaban29[3].jawaban == 'B'){
                    cKolom15++
                }
                if($scope.listEPPS1Fix.jawaban29[4].jawaban == 'B'){
                    cKolom15++
                }
                if($scope.listEPPS1Fix.jawaban44[0].jawaban == 'B'){
                    cKolom15++
                }
                if($scope.listEPPS1Fix.jawaban44[1].jawaban == 'B'){
                    cKolom15++
                }
                if($scope.listEPPS1Fix.jawaban44[2].jawaban == 'B'){
                    cKolom15++
                }
                if($scope.listEPPS1Fix.jawaban44[3].jawaban == 'B'){
                    cKolom15++
                }




                $scope.item.rkolom1 = rKolom1
                $scope.item.rkolom2 = rKolom2
                $scope.item.rkolom3 = rKolom3
                $scope.item.rkolom4 = rKolom4
                $scope.item.rkolom5 = rKolom5
                $scope.item.rkolom6 = rKolom6
                $scope.item.rkolom7 = rKolom7
                $scope.item.rkolom8 = rKolom8
                $scope.item.rkolom9 = rKolom9
                $scope.item.rkolom10 = rKolom10
                $scope.item.rkolom11 = rKolom11
                $scope.item.rkolom12 = rKolom12
                $scope.item.rkolom13 = rKolom13
                $scope.item.rkolom14 = rKolom14
                $scope.item.rkolom15 = rKolom15


                $scope.item.ckolom1 = cKolom1
                $scope.item.ckolom2 = cKolom2
                $scope.item.ckolom3 = cKolom3
                $scope.item.ckolom4 = cKolom4
                $scope.item.ckolom5 = cKolom5
                $scope.item.ckolom6 = cKolom6
                $scope.item.ckolom7 = cKolom7
                $scope.item.ckolom8 = cKolom8
                $scope.item.ckolom9 = cKolom9
                $scope.item.ckolom10 = cKolom10
                $scope.item.ckolom11 = cKolom11
                $scope.item.ckolom12 = cKolom12
                $scope.item.ckolom13 = cKolom13
                $scope.item.ckolom14 = cKolom14
                $scope.item.ckolom15 = cKolom15


                $scope.item.skolom1 = rKolom1 + cKolom1
                $scope.item.skolom2 = rKolom2 + cKolom2
                $scope.item.skolom3 = rKolom3 + cKolom3
                $scope.item.skolom4 = rKolom4 + cKolom4
                $scope.item.skolom5 = rKolom5 + cKolom5
                $scope.item.skolom6 = rKolom6 + cKolom6
                $scope.item.skolom7 = rKolom7 + cKolom7
                $scope.item.skolom8 = rKolom8 + cKolom8
                $scope.item.skolom9 = rKolom9 + cKolom9
                $scope.item.skolom10 = rKolom10 + cKolom10
                $scope.item.skolom11 = rKolom11 + cKolom11
                $scope.item.skolom12 = rKolom12 + cKolom12
                $scope.item.skolom13 = rKolom13 + cKolom13
                $scope.item.skolom14 = rKolom14 + cKolom14
                $scope.item.skolom15 = rKolom15 + cKolom15
                $scope.item.totalscore = $scope.item.skolom1 + $scope.item.skolom2 + $scope.item.skolom3 + $scope.item.skolom4 + $scope.item.skolom5 + $scope.item.skolom6
                + $scope.item.skolom7 + $scope.item.skolom8 + $scope.item.skolom9 + $scope.item.skolom10 + $scope.item.skolom11 + $scope.item.skolom12 + $scope.item.skolom13
                + $scope.item.skolom14 + $scope.item.skolom15
                $scope.item.poinkonsistensi = poinkonsistensi
            }


            $scope.simpan = function () {
                
                var objSave = {
                    'norec': $scope.norec,
                    'norec_apd': chacePeriode[2],
                    'tgltes': $scope.item.tglTes,
                    'konsistensi': $scope.item.poinkonsistensi,
                    'skolom1': $scope.item.skolom1,
                    'skolom2': $scope.item.skolom2,
                    'skolom3': $scope.item.skolom3,
                    'skolom4': $scope.item.skolom4,
                    'skolom5': $scope.item.skolom5,
                    'skolom6': $scope.item.skolom6,
                    'skolom7': $scope.item.skolom7,
                    'skolom8': $scope.item.skolom8,
                    'skolom9': $scope.item.skolom9,
                    'skolom10': $scope.item.skolom10,
                    'skolom11': $scope.item.skolom11,
                    'skolom12': $scope.item.skolom12,
                    'skolom13': $scope.item.skolom13,
                    'skolom14': $scope.item.skolom14,
                    'skolom15': $scope.item.skolom15,
                    'rkolom1': $scope.item.rkolom1,
                    'rkolom2': $scope.item.rkolom2,
                    'rkolom3': $scope.item.rkolom3,
                    'rkolom4': $scope.item.rkolom4,
                    'rkolom5': $scope.item.rkolom5,
                    'rkolom6': $scope.item.rkolom6,
                    'rkolom7': $scope.item.rkolom7,
                    'rkolom8': $scope.item.rkolom8,
                    'rkolom9': $scope.item.rkolom9,
                    'rkolom10': $scope.item.rkolom10,
                    'rkolom11': $scope.item.rkolom11,
                    'rkolom12': $scope.item.rkolom12,
                    'rkolom13': $scope.item.rkolom13,
                    'rkolom14': $scope.item.rkolom14,
                    'rkolom15': $scope.item.rkolom15,
                    'ckolom1': $scope.item.ckolom1,
                    'ckolom2': $scope.item.ckolom2,
                    'ckolom3': $scope.item.ckolom3,
                    'ckolom4': $scope.item.ckolom4,
                    'ckolom5': $scope.item.ckolom5,
                    'ckolom6': $scope.item.ckolom6,
                    'ckolom7': $scope.item.ckolom7,
                    'ckolom8': $scope.item.ckolom8,
                    'ckolom9': $scope.item.ckolom9,
                    'ckolom10': $scope.item.ckolom10,
                    'ckolom11': $scope.item.ckolom11,
                    'ckolom12': $scope.item.ckolom12,
                    'ckolom13': $scope.item.ckolom13,
                    'ckolom14': $scope.item.ckolom14,
                    'ckolom15': $scope.item.ckolom15,
                    'array': $scope.listEPPS1Fix

                }
                console.log(objSave);

                medifirstService.post('epps/save-epps', objSave).then(function (data) {
                    getLoadData()
                    $scope.item = {}
                    $scope.item.idNormaPsikologi = null;
                    $scope.popUpDataNormaPsikologi.close()
                })
            }

            $scope.createMasterNormaPsikologi = function () {
                $scope.popUpDataNormaPsikologi.center().open();
            }
            $scope.klikGrid = function (dataNormaPsikologi) {
                console.log(dataNormaPsikologi);
            }
        }
    ])
});