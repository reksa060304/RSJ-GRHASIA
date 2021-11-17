define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('CatatanPerinatologi7Ctrl', ['$q', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($q, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, medifirstService) {

            $scope.noCM = $state.params.noCM;
            $scope.tombolSimpanVis = true
            $scope.noRecPap = cacheHelper.get('noRecPap');
            $scope.totalSkor = 0
            $scope.totalSkor2 = 0
            $scope.cc = {}
            var nomorEMR = '-'
            $scope.cc.emrfk = 210230
            var dataLoad = []
            var norecEMR = ''
            var cacheNomorEMR = cacheHelper.get('cacheNomorEMR');
            var cacheNoREC = cacheHelper.get('cacheNOREC_EMR');
            if(cacheNoREC!= undefined){
                norecEMR = cacheNomorEMR[1]
            }
            if (cacheNomorEMR != undefined) {
                nomorEMR = cacheNomorEMR[0]
                norecEMR = cacheNomorEMR[1]
                $scope.cc.norec_emr = nomorEMR
            }
            medifirstService.getPart('emr/get-datacombo-part-pegawai', true, true, 20).then(function (data) {
                $scope.listPegawai = data
            })
            medifirstService.getPart('emr/get-datacombo-part-kelas', true, true, 20).then(function (data) {
                $scope.listKelas = data

            })
            medifirstService.getPart('emr/get-datacombo-part-ruangan-pelayanan', true, true, 20).then(function (data) {
                $scope.listRuang = data

            })
            var sesiesSuhu = []
            var seriesNadi = []
            loadChart()
            function loadChart() {
                $("#chartNadi").kendoChart({
                    title: {
                        text: "Grafik Nadi"
                    },
                    legend: {
                        position: "top"
                    },
                    series: [
                        {
                            type: "line",
                            data: seriesNadi,
                            name: "Nadi",
                            color: "#fc0303",

                        }],
                    valueAxes: [{
                        title: { text: "N" },
                        min: 40,
                        max: 180,
                        majorUnit: 20
                    },
                    ],
                    categoryAxis: {
                        categories: ['P','Si','S','M', 'P','Si','S','M', 'P','Si','S','M', 'P','Si','S','M', 'P','Si','S','M', 'P','Si','S','M', 'P','Si','S','M'],
                        axisCrossingValues: [0, 35]
                    }
                });

                $("#chartSuhu").kendoChart({
                    title: {
                        text: "Grafik Suhu"
                    },
                    legend: {
                        position: "top"
                    },
                    series: [{
                        type: "line",
                        data: sesiesSuhu,
                        name: "Suhu",
                        color: "#0328fc",

                    }
                    ],
                    valueAxes: [
                        {
                            name: "S",
                            title: { text: "S" },
                            min: 32,
                            max: 42,

                        }
                    ],
                    categoryAxis: {
                        categories: ['P','Si','S','M', 'P','Si','S','M', 'P','Si','S','M', 'P','Si','S','M', 'P','Si','S','M', 'P','Si','S','M', 'P','Si','S','M'],
                        axisCrossingValues: [0, 35]
                    }
                });
            }
            $scope.listPerinatologi = [
                {
                    "id": 1, "nama": "Tgl / Bln", "style": "text-align: center;background-color: #dedfe2d3;",
                    "detail": [
                        { "id": 22038716, "nama": "h-1", "type": "datetime" },
                        { "id": 22038717, "nama": "h-2", "type": "datetime" },
                        { "id": 22038718, "nama": "h-3", "type": "datetime" },
                        { "id": 22038719, "nama": "h-4", "type": "datetime" },
                    ]
                },
                {
                    "id": 2, "nama": "Balance Cairan",
                    "detail": [
                        { "id": 22038723, "nama": "h-1", "type": "textbox" },
                        { "id": 22038724, "nama": "h-2", "type": "textbox" },
                        { "id": 22038725, "nama": "h-3", "type": "textbox" },
                        { "id": 22038726, "nama": "h-4", "type": "textbox" },
                    ]
                },
                {
                    "id": 3, "nama": "Bilirubin",
                    "detail": [
                        { "id": 22038730, "nama": "h-1", "type": "textbox" },
                        { "id": 22038731, "nama": "h-2", "type": "textbox" },
                        { "id": 22038732, "nama": "h-3", "type": "textbox" },
                        { "id": 22038733, "nama": "h-4", "type": "textbox" },
                    ]
                },
                {
                    "id": 4, "nama": "Minum",
                    "detail": [
                        { "id": 22038737, "nama": "h-1", "type": "textbox" },
                        { "id": 22038738, "nama": "h-2", "type": "textbox" },
                        { "id": 22038739, "nama": "h-3", "type": "textbox" },
                        { "id": 22038740, "nama": "h-4", "type": "textbox" },
                    ]
                },
                {
                    "id": 5, "nama": "Muntah",
                    "detail": [
                        { "id": 22038744, "nama": "h-1", "type": "textbox" },
                        { "id": 22038745, "nama": "h-2", "type": "textbox" },
                        { "id": 22038746, "nama": "h-3", "type": "textbox" },
                        { "id": 22038747, "nama": "h-4", "type": "textbox" },
                    ]
                },
                {
                    "id": 6, "nama": "Urine",
                    "detail": [
                        { "id": 22038751, "nama": "h-1", "type": "textbox" },
                        { "id": 22038752, "nama": "h-2", "type": "textbox" },
                        { "id": 22038753, "nama": "h-3", "type": "textbox" },
                        { "id": 22038754, "nama": "h-4", "type": "textbox" },
                    ]
                },
                {
                    "id": 7, "nama": "Defekasi",
                    "detail": [
                        { "id": 22038758, "nama": "h-1", "type": "textbox" },
                        { "id": 22038759, "nama": "h-2", "type": "textbox" },
                        { "id": 22038760, "nama": "h-3", "type": "textbox" },
                        { "id": 22038761, "nama": "h-4", "type": "textbox" },
                    ]
                },
                {
                    "id": 8, "nama": "Infus",
                    "detail": [
                        { "id": 22038765, "nama": "h-1", "type": "textbox" },
                        { "id": 22038766, "nama": "h-2", "type": "textbox" },
                        { "id": 22038767, "nama": "h-3", "type": "textbox" },
                        { "id": 22038768, "nama": "h-4", "type": "textbox" },
                    ]
                },
            ]
            $scope.listData = [
                {
                    "id": 1, "nama": "Pernafasan",
                    "detail": [
                        { "id": 22038772, "nama": "p-1", "type": "textbox" },
                        { "id": 22038773, "nama": "si-1", "type": "textbox" },
                        { "id": 22038774, "nama": "s-1", "type": "textbox" },
                        { "id": 22038775, "nama": "m-1", "type": "textbox" },
                        { "id": 22038776, "nama": "p-2", "type": "textbox" },
                        { "id": 22038777, "nama": "si-2", "type": "textbox" },
                        { "id": 22038778, "nama": "s-2", "type": "textbox" },
                        { "id": 22038779, "nama": "m-2", "type": "textbox" },
                        { "id": 22038780, "nama": "p-3", "type": "textbox" },
                        { "id": 22038781, "nama": "si-3", "type": "textbox" },
                        { "id": 22038782, "nama": "s-3", "type": "textbox" },
                        { "id": 22038783, "nama": "m-3", "type": "textbox" },
                        { "id": 22038784, "nama": "p-4", "type": "textbox" },
                        { "id": 22038785, "nama": "si-4", "type": "textbox" },
                        { "id": 22038786, "nama": "s-4", "type": "textbox" },
                        { "id": 22038787, "nama": "m-4", "type": "textbox" },
                    ]
                },
                {
                    "id": 2, "nama": "",
                    "detail": [
                        { "nama": "P", "type": "label" },
                        { "nama": "Si", "type": "label" },
                        { "nama": "S", "type": "label" },
                        { "nama": "M", "type": "label" },
                        { "nama": "P", "type": "label" },
                        { "nama": "Si", "type": "label" },
                        { "nama": "S", "type": "label" },
                        { "nama": "M", "type": "label" },
                        { "nama": "P", "type": "label" },
                        { "nama": "Si", "type": "label" },
                        { "nama": "S", "type": "label" },
                        { "nama": "M", "type": "label" },
                        { "nama": "P", "type": "label" },
                        { "nama": "Si", "type": "label" },
                        { "nama": "S", "type": "label" },
                        { "nama": "M", "type": "label" },
                    ]
                },
                {
                    "id": 3, "nama": "Suhu",
                    "detail": [
                        { "id": 22038800, "nama": "p-1", "type": "textbox" },
                        { "id": 22038801, "nama": "si-1", "type": "textbox" },
                        { "id": 22038802, "nama": "s-1", "type": "textbox" },
                        { "id": 22038803, "nama": "m-1", "type": "textbox" },
                        { "id": 22038804, "nama": "p-2", "type": "textbox" },
                        { "id": 22038805, "nama": "si-2", "type": "textbox" },
                        { "id": 22038806, "nama": "s-2", "type": "textbox" },
                        { "id": 22038807, "nama": "m-2", "type": "textbox" },
                        { "id": 22038808, "nama": "p-3", "type": "textbox" },
                        { "id": 22038809, "nama": "si-3", "type": "textbox" },
                        { "id": 22038810, "nama": "s-3", "type": "textbox" },
                        { "id": 22038811, "nama": "m-3", "type": "textbox" },
                        { "id": 22038812, "nama": "p-4", "type": "textbox" },
                        { "id": 22038813, "nama": "si-4", "type": "textbox" },
                        { "id": 22038814, "nama": "s-4", "type": "textbox" },
                        { "id": 22038815, "nama": "m-4", "type": "textbox" },
                    ]
                },
                {
                    "id": 4, "nama": "Nadi",
                    "detail": [
                        { "id": 22038828, "nama": "p-1", "type": "textbox" },
                        { "id": 22038829, "nama": "si-1", "type": "textbox" },
                        { "id": 22038830, "nama": "s-1", "type": "textbox" },
                        { "id": 22038831, "nama": "m-1", "type": "textbox" },
                        { "id": 22038832, "nama": "p-2", "type": "textbox" },
                        { "id": 22038833, "nama": "si-2", "type": "textbox" },
                        { "id": 22038834, "nama": "s-2", "type": "textbox" },
                        { "id": 22038835, "nama": "m-2", "type": "textbox" },
                        { "id": 22038836, "nama": "p-3", "type": "textbox" },
                        { "id": 22038837, "nama": "si-3", "type": "textbox" },
                        { "id": 22038838, "nama": "s-3", "type": "textbox" },
                        { "id": 22038839, "nama": "m-3", "type": "textbox" },
                        { "id": 22038840, "nama": "p-4", "type": "textbox" },
                        { "id": 22038841, "nama": "si-4", "type": "textbox" },
                        { "id": 22038842, "nama": "s-4", "type": "textbox" },
                        { "id": 22038843, "nama": "m-4", "type": "textbox" },
                    ]
                },
                {
                    "id": 4, "nama": "BB", "colspan": "4",
                    "detail": [
                        { "id": 22038856, "nama": "p-1", "type": "textbox", "satuan": "Gram" },
                        { "id": 22038857, "nama": "p-2", "type": "textbox", "satuan": "Gram" },
                        { "id": 22038858, "nama": "p-3", "type": "textbox", "satuan": "Gram" },
                        { "id": 22038859, "nama": "p-4", "type": "textbox", "satuan": "Gram" },
                    ]
                },
            ]
            $scope.listPerinatologi2 = [
                {
                    "id": 1, "nama": "Tgl / Bln", "style": "text-align: center;background-color: #dedfe2d3;",
                    "detail": [
                        { "id": 22038720, "nama": "h-5", "type": "datetime" },
                        { "id": 22038721, "nama": "h-6", "type": "datetime" },
                        { "id": 22038722, "nama": "h-7", "type": "datetime" },
                    ]
                },
                {
                    "id": 2, "nama": "Balance Cairan",
                    "detail": [
                        { "id": 22038727, "nama": "h-5", "type": "textbox" },
                        { "id": 22038728, "nama": "h-6", "type": "textbox" },
                        { "id": 22038729, "nama": "h-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 3, "nama": "Bilirubin",
                    "detail": [
                        { "id": 22038734, "nama": "h-5", "type": "textbox" },
                        { "id": 22038735, "nama": "h-6", "type": "textbox" },
                        { "id": 22038736, "nama": "h-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 4, "nama": "Minum",
                    "detail": [
                        { "id": 22038741, "nama": "h-5", "type": "textbox" },
                        { "id": 22038742, "nama": "h-6", "type": "textbox" },
                        { "id": 22038743, "nama": "h-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 5, "nama": "Muntah",
                    "detail": [
                        { "id": 22038748, "nama": "h-5", "type": "textbox" },
                        { "id": 22038749, "nama": "h-6", "type": "textbox" },
                        { "id": 22038750, "nama": "h-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 6, "nama": "Urine",
                    "detail": [
                        { "id": 22038755, "nama": "h-5", "type": "textbox" },
                        { "id": 22038756, "nama": "h-6", "type": "textbox" },
                        { "id": 22038757, "nama": "h-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 7, "nama": "Defekasi",
                    "detail": [
                        { "id": 22038762, "nama": "h-5", "type": "textbox" },
                        { "id": 22038763, "nama": "h-6", "type": "textbox" },
                        { "id": 22038764, "nama": "h-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 8, "nama": "Infus",
                    "detail": [
                        { "id": 22038769, "nama": "h-5", "type": "textbox" },
                        { "id": 22038770, "nama": "h-6", "type": "textbox" },
                        { "id": 22038771, "nama": "h-7", "type": "textbox" },
                    ]
                },
            ]
            $scope.listData2 = [
                {
                    "id": 1, "nama": "Pernafasan",
                    "detail": [
                        { "id": 22038788, "nama": "p-5", "type": "textbox" },
                        { "id": 22038789, "nama": "si-5", "type": "textbox" },
                        { "id": 22038790, "nama": "s-5", "type": "textbox" },
                        { "id": 22038791, "nama": "m-5", "type": "textbox" },
                        { "id": 22038792, "nama": "p-6", "type": "textbox" },
                        { "id": 22038793, "nama": "si-6", "type": "textbox" },
                        { "id": 22038794, "nama": "s-6", "type": "textbox" },
                        { "id": 22038795, "nama": "m-6", "type": "textbox" },
                        { "id": 22038796, "nama": "p-7", "type": "textbox" },
                        { "id": 22038797, "nama": "si-7", "type": "textbox" },
                        { "id": 22038798, "nama": "s-7", "type": "textbox" },
                        { "id": 22038799, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 2, "nama": "",
                    "detail": [
                        { "nama": "P", "type": "label" },
                        { "nama": "Si", "type": "label" },
                        { "nama": "S", "type": "label" },
                        { "nama": "M", "type": "label" },
                        { "nama": "P", "type": "label" },
                        { "nama": "Si", "type": "label" },
                        { "nama": "S", "type": "label" },
                        { "nama": "M", "type": "label" },
                        { "nama": "P", "type": "label" },
                        { "nama": "Si", "type": "label" },
                        { "nama": "S", "type": "label" },
                        { "nama": "M", "type": "label" },
                    ]
                },
                {
                    "id": 3, "nama": "Suhu",
                    "detail": [
                        { "id": 22038816, "nama": "p-5", "type": "textbox" },
                        { "id": 22038817, "nama": "si-5", "type": "textbox" },
                        { "id": 22038818, "nama": "s-5", "type": "textbox" },
                        { "id": 22038819, "nama": "m-5", "type": "textbox" },
                        { "id": 22038820, "nama": "p-6", "type": "textbox" },
                        { "id": 22038821, "nama": "si-6", "type": "textbox" },
                        { "id": 22038822, "nama": "s-6", "type": "textbox" },
                        { "id": 22038823, "nama": "m-6", "type": "textbox" },
                        { "id": 22038824, "nama": "p-7", "type": "textbox" },
                        { "id": 22038825, "nama": "si-7", "type": "textbox" },
                        { "id": 22038826, "nama": "s-7", "type": "textbox" },
                        { "id": 22038827, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 4, "nama": "Nadi",
                    "detail": [
                        { "id": 22038844, "nama": "p-5", "type": "textbox" },
                        { "id": 22038845, "nama": "si-5", "type": "textbox" },
                        { "id": 22038846, "nama": "s-5", "type": "textbox" },
                        { "id": 22038847, "nama": "m-5", "type": "textbox" },
                        { "id": 22038848, "nama": "p-6", "type": "textbox" },
                        { "id": 22038849, "nama": "si-6", "type": "textbox" },
                        { "id": 22038850, "nama": "s-6", "type": "textbox" },
                        { "id": 22038851, "nama": "m-6", "type": "textbox" },
                        { "id": 22038852, "nama": "p-7", "type": "textbox" },
                        { "id": 22038853, "nama": "si-7", "type": "textbox" },
                        { "id": 22038854, "nama": "s-7", "type": "textbox" },
                        { "id": 22038855, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 4, "nama": "BB", "colspan": "4",
                    "detail": [
                        { "id": 22038860, "nama": "p-5", "type": "textbox", "satuan": "Gram" },
                        { "id": 22038861, "nama": "p-6", "type": "textbox", "satuan": "Gram" },
                        { "id": 22038862, "nama": "p-7", "type": "textbox", "satuan": "Gram" },
                    ]
                },
            ]
            $scope.listPengenal1 = [
                { "id": 22038863, "nama": "Tgl.Lahir", "type": "datetime", "satuan": "" },
                { "id": 22038864, "nama": "Jenis Kelamin", "type": "textbox", "satuan": "" },
                { "id": 22038865, "nama": "APGAR Score", "type": "textbox", "satuan": "" },
                { "id": 22038866, "nama": "BB Lahir", "type": "textbox", "satuan": "Gram" },
                { "id": 22038867, "nama": "Panjang", "type": "textbox", "satuan": "cm" },
                { "id": 22038868, "nama": "Lingkar Kepala", "type": "textbox", "satuan": "cm" },
                { "id": 22038869, "nama": "Suhu", "type": "textbox", "satuan": "C" },
            ]
            $scope.listPengenal2 = [
                { "id": 22038870, "nama": "Riwayat Persalinan : GPA", "type": "textbox", "satuan": "" },
                { "id": 22038871, "nama": "Kehamilan", "type": "textbox", "satuan": "" },
                { "id": 22038872, "nama": "Umur Ibu", "type": "textbox", "satuan": "" },
                { "id": 22038873, "nama": "HbsAg Ibu", "type": "textbox", "satuan": "" },
                { "id": 22038874, "nama": "Gol. Darah Ibu", "type": "textbox", "satuan": "" },
                { "id": 22038875, "nama": "Persalinan", "type": "textbox", "satuan": "" },
                { "id": 22038876, "nama": "Ketuban", "type": "textbox", "satuan": "" },
            ]
            $scope.listPengenal3 = [
                { "id": 22038877, "nama": "Resusitasi", "type": "textbox", "satuan": "" },
                { "id": 22038878, "nama": "Obat yang diberikan", "type": "textbox", "satuan": "" },
                { "id": 22038879, "nama": "Miksi", "type": "textbox", "satuan": "" },
                { "id": 22038880, "nama": "Meco", "type": "textbox", "satuan": "" },
                { "id": 22038881, "nama": "Anus", "type": "textbox", "satuan": "" },
                { "id": 22038882, "nama": "Mata", "type": "textbox", "satuan": "" },
                { "id": 22038883, "nama": "Hal-hal istimewa", "type": "textbox", "satuan": "" },
            ]
            $scope.listObat = [
                {
                    "id": 22038884, "nama": "Obat-1",
                    "detail": [
                        { "id": 22038885, "nama": "p-1", "type": "textbox" },
                        { "id": 22038886, "nama": "si-1", "type": "textbox" },
                        { "id": 22038887, "nama": "s-1", "type": "textbox" },
                        { "id": 22038888, "nama": "m-1", "type": "textbox" },
                        { "id": 22038889, "nama": "p-2", "type": "textbox" },
                        { "id": 22038890, "nama": "si-2", "type": "textbox" },
                        { "id": 22038891, "nama": "s-2", "type": "textbox" },
                        { "id": 22038892, "nama": "m-2", "type": "textbox" },
                        { "id": 22038893, "nama": "p-3", "type": "textbox" },
                        { "id": 22038894, "nama": "si-3", "type": "textbox" },
                        { "id": 22038895, "nama": "s-3", "type": "textbox" },
                        { "id": 22038896, "nama": "m-3", "type": "textbox" },
                        { "id": 22038897, "nama": "p-4", "type": "textbox" },
                        { "id": 22038898, "nama": "si-4", "type": "textbox" },
                        { "id": 22038899, "nama": "s-4", "type": "textbox" },
                        { "id": 22038900, "nama": "m-4", "type": "textbox" },
                        { "id": 22038901, "nama": "p-5", "type": "textbox" },
                        { "id": 22038902, "nama": "si-5", "type": "textbox" },
                        { "id": 22038903, "nama": "s-5", "type": "textbox" },
                        { "id": 22038904, "nama": "m-5", "type": "textbox" },
                        { "id": 22038905, "nama": "p-6", "type": "textbox" },
                        { "id": 22038906, "nama": "si-6", "type": "textbox" },
                        { "id": 22038907, "nama": "s-6", "type": "textbox" },
                        { "id": 22038908, "nama": "m-6", "type": "textbox" },
                        { "id": 22038909, "nama": "p-7", "type": "textbox" },
                        { "id": 22038910, "nama": "si-7", "type": "textbox" },
                        { "id": 22038911, "nama": "s-7", "type": "textbox" },
                        { "id": 22038912, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22038913, "nama": "Obat-2",
                    "detail": [
                        { "id": 22038914, "nama": "p-1", "type": "textbox" },
                        { "id": 22038915, "nama": "si-1", "type": "textbox" },
                        { "id": 22038916, "nama": "s-1", "type": "textbox" },
                        { "id": 22038917, "nama": "m-1", "type": "textbox" },
                        { "id": 22038918, "nama": "p-2", "type": "textbox" },
                        { "id": 22038919, "nama": "si-2", "type": "textbox" },
                        { "id": 22038920, "nama": "s-2", "type": "textbox" },
                        { "id": 22038921, "nama": "m-2", "type": "textbox" },
                        { "id": 22038922, "nama": "p-3", "type": "textbox" },
                        { "id": 22038923, "nama": "si-3", "type": "textbox" },
                        { "id": 22038924, "nama": "s-3", "type": "textbox" },
                        { "id": 22038925, "nama": "m-3", "type": "textbox" },
                        { "id": 22038926, "nama": "p-4", "type": "textbox" },
                        { "id": 22038927, "nama": "si-4", "type": "textbox" },
                        { "id": 22038928, "nama": "s-4", "type": "textbox" },
                        { "id": 22038929, "nama": "m-4", "type": "textbox" },
                        { "id": 22038930, "nama": "p-5", "type": "textbox" },
                        { "id": 22038931, "nama": "si-5", "type": "textbox" },
                        { "id": 22038932, "nama": "s-5", "type": "textbox" },
                        { "id": 22038933, "nama": "m-5", "type": "textbox" },
                        { "id": 22038934, "nama": "p-6", "type": "textbox" },
                        { "id": 22038935, "nama": "si-6", "type": "textbox" },
                        { "id": 22038936, "nama": "s-6", "type": "textbox" },
                        { "id": 22038937, "nama": "m-6", "type": "textbox" },
                        { "id": 22038938, "nama": "p-7", "type": "textbox" },
                        { "id": 22038939, "nama": "si-7", "type": "textbox" },
                        { "id": 22038940, "nama": "s-7", "type": "textbox" },
                        { "id": 22038941, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22038942, "nama": "Obat-3",
                    "detail": [
                        { "id": 22038943, "nama": "p-1", "type": "textbox" },
                        { "id": 22038944, "nama": "si-1", "type": "textbox" },
                        { "id": 22038945, "nama": "s-1", "type": "textbox" },
                        { "id": 22038946, "nama": "m-1", "type": "textbox" },
                        { "id": 22038947, "nama": "p-2", "type": "textbox" },
                        { "id": 22038948, "nama": "si-2", "type": "textbox" },
                        { "id": 22038949, "nama": "s-2", "type": "textbox" },
                        { "id": 22038950, "nama": "m-2", "type": "textbox" },
                        { "id": 22038951, "nama": "p-3", "type": "textbox" },
                        { "id": 22038952, "nama": "si-3", "type": "textbox" },
                        { "id": 22038953, "nama": "s-3", "type": "textbox" },
                        { "id": 22038954, "nama": "m-3", "type": "textbox" },
                        { "id": 22038955, "nama": "p-4", "type": "textbox" },
                        { "id": 22038956, "nama": "si-4", "type": "textbox" },
                        { "id": 22038957, "nama": "s-4", "type": "textbox" },
                        { "id": 22038958, "nama": "m-4", "type": "textbox" },
                        { "id": 22038959, "nama": "p-5", "type": "textbox" },
                        { "id": 22038960, "nama": "si-5", "type": "textbox" },
                        { "id": 22038961, "nama": "s-5", "type": "textbox" },
                        { "id": 22038962, "nama": "m-5", "type": "textbox" },
                        { "id": 22038963, "nama": "p-6", "type": "textbox" },
                        { "id": 22038964, "nama": "si-6", "type": "textbox" },
                        { "id": 22038965, "nama": "s-6", "type": "textbox" },
                        { "id": 22038966, "nama": "m-6", "type": "textbox" },
                        { "id": 22038967, "nama": "p-7", "type": "textbox" },
                        { "id": 22038968, "nama": "si-7", "type": "textbox" },
                        { "id": 22038969, "nama": "s-7", "type": "textbox" },
                        { "id": 22038970, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22038971, "nama": "Obat-4",
                    "detail": [
                        { "id": 22038972, "nama": "p-1", "type": "textbox" },
                        { "id": 22038973, "nama": "si-1", "type": "textbox" },
                        { "id": 22038974, "nama": "s-1", "type": "textbox" },
                        { "id": 22038975, "nama": "m-1", "type": "textbox" },
                        { "id": 22038976, "nama": "p-2", "type": "textbox" },
                        { "id": 22038977, "nama": "si-2", "type": "textbox" },
                        { "id": 22038978, "nama": "s-2", "type": "textbox" },
                        { "id": 22038979, "nama": "m-2", "type": "textbox" },
                        { "id": 22038980, "nama": "p-3", "type": "textbox" },
                        { "id": 22038981, "nama": "si-3", "type": "textbox" },
                        { "id": 22038982, "nama": "s-3", "type": "textbox" },
                        { "id": 22038983, "nama": "m-3", "type": "textbox" },
                        { "id": 22038984, "nama": "p-4", "type": "textbox" },
                        { "id": 22038985, "nama": "si-4", "type": "textbox" },
                        { "id": 22038986, "nama": "s-4", "type": "textbox" },
                        { "id": 22038987, "nama": "m-4", "type": "textbox" },
                        { "id": 22038988, "nama": "p-5", "type": "textbox" },
                        { "id": 22038989, "nama": "si-5", "type": "textbox" },
                        { "id": 22038990, "nama": "s-5", "type": "textbox" },
                        { "id": 22038991, "nama": "m-5", "type": "textbox" },
                        { "id": 22038992, "nama": "p-6", "type": "textbox" },
                        { "id": 22038993, "nama": "si-6", "type": "textbox" },
                        { "id": 22038994, "nama": "s-6", "type": "textbox" },
                        { "id": 22038995, "nama": "m-6", "type": "textbox" },
                        { "id": 22038996, "nama": "p-7", "type": "textbox" },
                        { "id": 22038997, "nama": "si-7", "type": "textbox" },
                        { "id": 22038998, "nama": "s-7", "type": "textbox" },
                        { "id": 22038999, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22039000, "nama": "Obat-5",
                    "detail": [
                        { "id": 22039001, "nama": "p-1", "type": "textbox" },
                        { "id": 22039002, "nama": "si-1", "type": "textbox" },
                        { "id": 22039003, "nama": "s-1", "type": "textbox" },
                        { "id": 22039004, "nama": "m-1", "type": "textbox" },
                        { "id": 22039005, "nama": "p-2", "type": "textbox" },
                        { "id": 22039006, "nama": "si-2", "type": "textbox" },
                        { "id": 22039007, "nama": "s-2", "type": "textbox" },
                        { "id": 22039008, "nama": "m-2", "type": "textbox" },
                        { "id": 22039009, "nama": "p-3", "type": "textbox" },
                        { "id": 22039010, "nama": "si-3", "type": "textbox" },
                        { "id": 22039011, "nama": "s-3", "type": "textbox" },
                        { "id": 22039012, "nama": "m-3", "type": "textbox" },
                        { "id": 22039013, "nama": "p-4", "type": "textbox" },
                        { "id": 22039014, "nama": "si-4", "type": "textbox" },
                        { "id": 22039015, "nama": "s-4", "type": "textbox" },
                        { "id": 22039016, "nama": "m-4", "type": "textbox" },
                        { "id": 22039017, "nama": "p-5", "type": "textbox" },
                        { "id": 22039018, "nama": "si-5", "type": "textbox" },
                        { "id": 22039019, "nama": "s-5", "type": "textbox" },
                        { "id": 22039020, "nama": "m-5", "type": "textbox" },
                        { "id": 22039021, "nama": "p-6", "type": "textbox" },
                        { "id": 22039022, "nama": "si-6", "type": "textbox" },
                        { "id": 22039023, "nama": "s-6", "type": "textbox" },
                        { "id": 22039024, "nama": "m-6", "type": "textbox" },
                        { "id": 22039025, "nama": "p-7", "type": "textbox" },
                        { "id": 22039026, "nama": "si-7", "type": "textbox" },
                        { "id": 22039027, "nama": "s-7", "type": "textbox" },
                        { "id": 22039028, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22039029, "nama": "Obat-6",
                    "detail": [
                        { "id": 22039030, "nama": "p-1", "type": "textbox" },
                        { "id": 22039031, "nama": "si-1", "type": "textbox" },
                        { "id": 22039032, "nama": "s-1", "type": "textbox" },
                        { "id": 22039033, "nama": "m-1", "type": "textbox" },
                        { "id": 22039034, "nama": "p-2", "type": "textbox" },
                        { "id": 22039035, "nama": "si-2", "type": "textbox" },
                        { "id": 22039036, "nama": "s-2", "type": "textbox" },
                        { "id": 22039037, "nama": "m-2", "type": "textbox" },
                        { "id": 22039038, "nama": "p-3", "type": "textbox" },
                        { "id": 22039039, "nama": "si-3", "type": "textbox" },
                        { "id": 22039040, "nama": "s-3", "type": "textbox" },
                        { "id": 22039041, "nama": "m-3", "type": "textbox" },
                        { "id": 22039042, "nama": "p-4", "type": "textbox" },
                        { "id": 22039043, "nama": "si-4", "type": "textbox" },
                        { "id": 22039044, "nama": "s-4", "type": "textbox" },
                        { "id": 22039045, "nama": "m-4", "type": "textbox" },
                        { "id": 22039046, "nama": "p-5", "type": "textbox" },
                        { "id": 22039047, "nama": "si-5", "type": "textbox" },
                        { "id": 22039048, "nama": "s-5", "type": "textbox" },
                        { "id": 22039049, "nama": "m-5", "type": "textbox" },
                        { "id": 22039050, "nama": "p-6", "type": "textbox" },
                        { "id": 22039051, "nama": "si-6", "type": "textbox" },
                        { "id": 22039052, "nama": "s-6", "type": "textbox" },
                        { "id": 22039053, "nama": "m-6", "type": "textbox" },
                        { "id": 22039054, "nama": "p-7", "type": "textbox" },
                        { "id": 22039055, "nama": "si-7", "type": "textbox" },
                        { "id": 22039056, "nama": "s-7", "type": "textbox" },
                        { "id": 22039057, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22039058, "nama": "Obat-7",
                    "detail": [
                        { "id": 22039059, "nama": "p-1", "type": "textbox" },
                        { "id": 22039060, "nama": "si-1", "type": "textbox" },
                        { "id": 22039061, "nama": "s-1", "type": "textbox" },
                        { "id": 22039062, "nama": "m-1", "type": "textbox" },
                        { "id": 22039063, "nama": "p-2", "type": "textbox" },
                        { "id": 22039064, "nama": "si-2", "type": "textbox" },
                        { "id": 22039065, "nama": "s-2", "type": "textbox" },
                        { "id": 22039066, "nama": "m-2", "type": "textbox" },
                        { "id": 22039067, "nama": "p-3", "type": "textbox" },
                        { "id": 22039068, "nama": "si-3", "type": "textbox" },
                        { "id": 22039069, "nama": "s-3", "type": "textbox" },
                        { "id": 22039070, "nama": "m-3", "type": "textbox" },
                        { "id": 22039071, "nama": "p-4", "type": "textbox" },
                        { "id": 22039072, "nama": "si-4", "type": "textbox" },
                        { "id": 22039073, "nama": "s-4", "type": "textbox" },
                        { "id": 22039074, "nama": "m-4", "type": "textbox" },
                        { "id": 22039075, "nama": "p-5", "type": "textbox" },
                        { "id": 22039076, "nama": "si-5", "type": "textbox" },
                        { "id": 22039077, "nama": "s-5", "type": "textbox" },
                        { "id": 22039078, "nama": "m-5", "type": "textbox" },
                        { "id": 22039079, "nama": "p-6", "type": "textbox" },
                        { "id": 22039080, "nama": "si-6", "type": "textbox" },
                        { "id": 22039081, "nama": "s-6", "type": "textbox" },
                        { "id": 22039082, "nama": "m-6", "type": "textbox" },
                        { "id": 22039083, "nama": "p-7", "type": "textbox" },
                        { "id": 22039084, "nama": "si-7", "type": "textbox" },
                        { "id": 22039085, "nama": "s-7", "type": "textbox" },
                        { "id": 22039086, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22039087, "nama": "Obat-8",
                    "detail": [
                        { "id": 22039088, "nama": "p-1", "type": "textbox" },
                        { "id": 22039089, "nama": "si-1", "type": "textbox" },
                        { "id": 22039090, "nama": "s-1", "type": "textbox" },
                        { "id": 22039091, "nama": "m-1", "type": "textbox" },
                        { "id": 22039092, "nama": "p-2", "type": "textbox" },
                        { "id": 22039093, "nama": "si-2", "type": "textbox" },
                        { "id": 22039094, "nama": "s-2", "type": "textbox" },
                        { "id": 22039095, "nama": "m-2", "type": "textbox" },
                        { "id": 22039096, "nama": "p-3", "type": "textbox" },
                        { "id": 22039097, "nama": "si-3", "type": "textbox" },
                        { "id": 22039098, "nama": "s-3", "type": "textbox" },
                        { "id": 22039099, "nama": "m-3", "type": "textbox" },
                        { "id": 22039100, "nama": "p-4", "type": "textbox" },
                        { "id": 22039101, "nama": "si-4", "type": "textbox" },
                        { "id": 22039102, "nama": "s-4", "type": "textbox" },
                        { "id": 22039103, "nama": "m-4", "type": "textbox" },
                        { "id": 22039104, "nama": "p-5", "type": "textbox" },
                        { "id": 22039105, "nama": "si-5", "type": "textbox" },
                        { "id": 22039106, "nama": "s-5", "type": "textbox" },
                        { "id": 22039107, "nama": "m-5", "type": "textbox" },
                        { "id": 22039108, "nama": "p-6", "type": "textbox" },
                        { "id": 22039109, "nama": "si-6", "type": "textbox" },
                        { "id": 22039110, "nama": "s-6", "type": "textbox" },
                        { "id": 22039111, "nama": "m-6", "type": "textbox" },
                        { "id": 22039112, "nama": "p-7", "type": "textbox" },
                        { "id": 22039113, "nama": "si-7", "type": "textbox" },
                        { "id": 22039114, "nama": "s-7", "type": "textbox" },
                        { "id": 22039115, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22039116, "nama": "Obat-9",
                    "detail": [
                        { "id": 22039117, "nama": "p-1", "type": "textbox" },
                        { "id": 22039118, "nama": "si-1", "type": "textbox" },
                        { "id": 22039119, "nama": "s-1", "type": "textbox" },
                        { "id": 22039120, "nama": "m-1", "type": "textbox" },
                        { "id": 22039121, "nama": "p-2", "type": "textbox" },
                        { "id": 22039122, "nama": "si-2", "type": "textbox" },
                        { "id": 22039123, "nama": "s-2", "type": "textbox" },
                        { "id": 22039124, "nama": "m-2", "type": "textbox" },
                        { "id": 22039125, "nama": "p-3", "type": "textbox" },
                        { "id": 22039126, "nama": "si-3", "type": "textbox" },
                        { "id": 22039127, "nama": "s-3", "type": "textbox" },
                        { "id": 22039128, "nama": "m-3", "type": "textbox" },
                        { "id": 22039129, "nama": "p-4", "type": "textbox" },
                        { "id": 22039130, "nama": "si-4", "type": "textbox" },
                        { "id": 22039131, "nama": "s-4", "type": "textbox" },
                        { "id": 22039132, "nama": "m-4", "type": "textbox" },
                        { "id": 22039133, "nama": "p-5", "type": "textbox" },
                        { "id": 22039134, "nama": "si-5", "type": "textbox" },
                        { "id": 22039135, "nama": "s-5", "type": "textbox" },
                        { "id": 22039136, "nama": "m-5", "type": "textbox" },
                        { "id": 22039137, "nama": "p-6", "type": "textbox" },
                        { "id": 22039138, "nama": "si-6", "type": "textbox" },
                        { "id": 22039139, "nama": "s-6", "type": "textbox" },
                        { "id": 22039140, "nama": "m-6", "type": "textbox" },
                        { "id": 22039141, "nama": "p-7", "type": "textbox" },
                        { "id": 22039142, "nama": "si-7", "type": "textbox" },
                        { "id": 22039143, "nama": "s-7", "type": "textbox" },
                        { "id": 22039144, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22039145, "nama": "Obat-10",
                    "detail": [
                        { "id": 22039146, "nama": "p-1", "type": "textbox" },
                        { "id": 22039147, "nama": "si-1", "type": "textbox" },
                        { "id": 22039148, "nama": "s-1", "type": "textbox" },
                        { "id": 22039149, "nama": "m-1", "type": "textbox" },
                        { "id": 22039150, "nama": "p-2", "type": "textbox" },
                        { "id": 22039151, "nama": "si-2", "type": "textbox" },
                        { "id": 22039152, "nama": "s-2", "type": "textbox" },
                        { "id": 22039153, "nama": "m-2", "type": "textbox" },
                        { "id": 22039154, "nama": "p-3", "type": "textbox" },
                        { "id": 22039155, "nama": "si-3", "type": "textbox" },
                        { "id": 22039156, "nama": "s-3", "type": "textbox" },
                        { "id": 22039157, "nama": "m-3", "type": "textbox" },
                        { "id": 22039158, "nama": "p-4", "type": "textbox" },
                        { "id": 22039159, "nama": "si-4", "type": "textbox" },
                        { "id": 22039160, "nama": "s-4", "type": "textbox" },
                        { "id": 22039161, "nama": "m-4", "type": "textbox" },
                        { "id": 22039162, "nama": "p-5", "type": "textbox" },
                        { "id": 22039163, "nama": "si-5", "type": "textbox" },
                        { "id": 22039164, "nama": "s-5", "type": "textbox" },
                        { "id": 22039165, "nama": "m-5", "type": "textbox" },
                        { "id": 22039166, "nama": "p-6", "type": "textbox" },
                        { "id": 22039167, "nama": "si-6", "type": "textbox" },
                        { "id": 22039168, "nama": "s-6", "type": "textbox" },
                        { "id": 22039169, "nama": "m-6", "type": "textbox" },
                        { "id": 22039170, "nama": "p-7", "type": "textbox" },
                        { "id": 22039171, "nama": "si-7", "type": "textbox" },
                        { "id": 22039172, "nama": "s-7", "type": "textbox" },
                        { "id": 22039173, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22039174, "nama": "Obat-11",
                    "detail": [
                        { "id": 22039175, "nama": "p-1", "type": "textbox" },
                        { "id": 22039176, "nama": "si-1", "type": "textbox" },
                        { "id": 22039177, "nama": "s-1", "type": "textbox" },
                        { "id": 22039178, "nama": "m-1", "type": "textbox" },
                        { "id": 22039179, "nama": "p-2", "type": "textbox" },
                        { "id": 22039180, "nama": "si-2", "type": "textbox" },
                        { "id": 22039181, "nama": "s-2", "type": "textbox" },
                        { "id": 22039182, "nama": "m-2", "type": "textbox" },
                        { "id": 22039183, "nama": "p-3", "type": "textbox" },
                        { "id": 22039184, "nama": "si-3", "type": "textbox" },
                        { "id": 22039185, "nama": "s-3", "type": "textbox" },
                        { "id": 22039186, "nama": "m-3", "type": "textbox" },
                        { "id": 22039187, "nama": "p-4", "type": "textbox" },
                        { "id": 22039188, "nama": "si-4", "type": "textbox" },
                        { "id": 22039189, "nama": "s-4", "type": "textbox" },
                        { "id": 22039190, "nama": "m-4", "type": "textbox" },
                        { "id": 22039191, "nama": "p-5", "type": "textbox" },
                        { "id": 22039192, "nama": "si-5", "type": "textbox" },
                        { "id": 22039193, "nama": "s-5", "type": "textbox" },
                        { "id": 22039194, "nama": "m-5", "type": "textbox" },
                        { "id": 22039195, "nama": "p-6", "type": "textbox" },
                        { "id": 22039196, "nama": "si-6", "type": "textbox" },
                        { "id": 22039197, "nama": "s-6", "type": "textbox" },
                        { "id": 22039198, "nama": "m-6", "type": "textbox" },
                        { "id": 22039199, "nama": "p-7", "type": "textbox" },
                        { "id": 22039200, "nama": "si-7", "type": "textbox" },
                        { "id": 22039201, "nama": "s-7", "type": "textbox" },
                        { "id": 22039202, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22039203, "nama": "Obat-12",
                    "detail": [
                        { "id": 22039204, "nama": "p-1", "type": "textbox" },
                        { "id": 22039205, "nama": "si-1", "type": "textbox" },
                        { "id": 22039206, "nama": "s-1", "type": "textbox" },
                        { "id": 22039207, "nama": "m-1", "type": "textbox" },
                        { "id": 22039208, "nama": "p-2", "type": "textbox" },
                        { "id": 22039209, "nama": "si-2", "type": "textbox" },
                        { "id": 22039210, "nama": "s-2", "type": "textbox" },
                        { "id": 22039211, "nama": "m-2", "type": "textbox" },
                        { "id": 22039212, "nama": "p-3", "type": "textbox" },
                        { "id": 22039213, "nama": "si-3", "type": "textbox" },
                        { "id": 22039214, "nama": "s-3", "type": "textbox" },
                        { "id": 22039215, "nama": "m-3", "type": "textbox" },
                        { "id": 22039216, "nama": "p-4", "type": "textbox" },
                        { "id": 22039217, "nama": "si-4", "type": "textbox" },
                        { "id": 22039218, "nama": "s-4", "type": "textbox" },
                        { "id": 22039219, "nama": "m-4", "type": "textbox" },
                        { "id": 22039220, "nama": "p-5", "type": "textbox" },
                        { "id": 22039221, "nama": "si-5", "type": "textbox" },
                        { "id": 22039222, "nama": "s-5", "type": "textbox" },
                        { "id": 22039223, "nama": "m-5", "type": "textbox" },
                        { "id": 22039224, "nama": "p-6", "type": "textbox" },
                        { "id": 22039225, "nama": "si-6", "type": "textbox" },
                        { "id": 22039226, "nama": "s-6", "type": "textbox" },
                        { "id": 22039227, "nama": "m-6", "type": "textbox" },
                        { "id": 22039228, "nama": "p-7", "type": "textbox" },
                        { "id": 22039229, "nama": "si-7", "type": "textbox" },
                        { "id": 22039230, "nama": "s-7", "type": "textbox" },
                        { "id": 22039231, "nama": "m-7", "type": "textbox" },
                    ]
                }
            ]
            $scope.listSuhu = [
                { "id": 22038800, "nama": "p-1", "type": "textbox" },
                { "id": 22038801, "nama": "si-1", "type": "textbox" },
                { "id": 22038802, "nama": "s-1", "type": "textbox" },
                { "id": 22038803, "nama": "m-1", "type": "textbox" },
                { "id": 22038804, "nama": "p-2", "type": "textbox" },
                { "id": 22038805, "nama": "si-2", "type": "textbox" },
                { "id": 22038806, "nama": "s-2", "type": "textbox" },
                { "id": 22038807, "nama": "m-2", "type": "textbox" },
                { "id": 22038808, "nama": "p-3", "type": "textbox" },
                { "id": 22038809, "nama": "si-3", "type": "textbox" },
                { "id": 22038810, "nama": "s-3", "type": "textbox" },
                { "id": 22038811, "nama": "m-3", "type": "textbox" },
                { "id": 22038812, "nama": "p-4", "type": "textbox" },
                { "id": 22038813, "nama": "si-4", "type": "textbox" },
                { "id": 22038814, "nama": "s-4", "type": "textbox" },
                { "id": 22038815, "nama": "m-4", "type": "textbox" },
                { "id": 22038816, "nama": "p-5", "type": "textbox" },
                { "id": 22038817, "nama": "si-5", "type": "textbox" },
                { "id": 22038818, "nama": "s-5", "type": "textbox" },
                { "id": 22038819, "nama": "m-5", "type": "textbox" },
                { "id": 22038820, "nama": "p-6", "type": "textbox" },
                { "id": 22038821, "nama": "si-6", "type": "textbox" },
                { "id": 22038822, "nama": "s-6", "type": "textbox" },
                { "id": 22038823, "nama": "m-6", "type": "textbox" },
                { "id": 22038824, "nama": "p-7", "type": "textbox" },
                { "id": 22038825, "nama": "si-7", "type": "textbox" },
                { "id": 22038826, "nama": "s-7", "type": "textbox" },
                { "id": 22038827, "nama": "m-7", "type": "textbox" },
            ]
            $scope.listNadi = [
                { "id": 22038828, "nama": "p-1", "type": "textbox" },
                { "id": 22038829, "nama": "si-1", "type": "textbox" },
                { "id": 22038830, "nama": "s-1", "type": "textbox" },
                { "id": 22038831, "nama": "m-1", "type": "textbox" },
                { "id": 22038832, "nama": "p-2", "type": "textbox" },
                { "id": 22038833, "nama": "si-2", "type": "textbox" },
                { "id": 22038834, "nama": "s-2", "type": "textbox" },
                { "id": 22038835, "nama": "m-2", "type": "textbox" },
                { "id": 22038836, "nama": "p-3", "type": "textbox" },
                { "id": 22038837, "nama": "si-3", "type": "textbox" },
                { "id": 22038838, "nama": "s-3", "type": "textbox" },
                { "id": 22038839, "nama": "m-3", "type": "textbox" },
                { "id": 22038840, "nama": "p-4", "type": "textbox" },
                { "id": 22038841, "nama": "si-4", "type": "textbox" },
                { "id": 22038842, "nama": "s-4", "type": "textbox" },
                { "id": 22038843, "nama": "m-4", "type": "textbox" },
                { "id": 22038844, "nama": "p-5", "type": "textbox" },
                { "id": 22038845, "nama": "si-5", "type": "textbox" },
                { "id": 22038846, "nama": "s-5", "type": "textbox" },
                { "id": 22038847, "nama": "m-5", "type": "textbox" },
                { "id": 22038848, "nama": "p-6", "type": "textbox" },
                { "id": 22038849, "nama": "si-6", "type": "textbox" },
                { "id": 22038850, "nama": "s-6", "type": "textbox" },
                { "id": 22038851, "nama": "m-6", "type": "textbox" },
                { "id": 22038852, "nama": "p-7", "type": "textbox" },
                { "id": 22038853, "nama": "si-7", "type": "textbox" },
                { "id": 22038854, "nama": "s-7", "type": "textbox" },
                { "id": 22038855, "nama": "m-7", "type": "textbox" },
            ]
            // onloadchart()

            var chacePeriode = cacheHelper.get('cacheRekamMedis');
            if (chacePeriode != undefined) {
                $scope.cc.nocm = chacePeriode[0]
                $scope.cc.namapasien = chacePeriode[1]
                $scope.cc.jeniskelamin = chacePeriode[2]
                $scope.cc.noregistrasi = chacePeriode[3]
                $scope.cc.umur = chacePeriode[4]
                $scope.cc.kelompokpasien = chacePeriode[5]
                $scope.cc.tglregistrasi = chacePeriode[6]
                $scope.cc.norec = chacePeriode[7]
                $scope.cc.norec_pd = chacePeriode[8]
                $scope.cc.objectkelasfk = chacePeriode[9]
                $scope.cc.namakelas = chacePeriode[10]
                $scope.cc.objectruanganfk = chacePeriode[11]
                $scope.cc.namaruangan = chacePeriode[12]
                $scope.cc.DataNoregis = chacePeriode[12]
                if (nomorEMR == '-') {
                    $scope.cc.norec_emr = '-'
                } else {
                    $scope.cc.norec_emr = nomorEMR
                }
            }
            var chekedd = false

            medifirstService.get("emr/get-emr-transaksi-detail?noemr=" + nomorEMR + "&emrfk=" + $scope.cc.emrfk, true).then(function (dat) {
                $scope.item.obj = []
                $scope.item.obj2 = []
                dataLoad = dat.data.data
                for (var i = 0; i <= dataLoad.length - 1; i++) {
                    if (parseFloat($scope.cc.emrfk) == dataLoad[i].emrfk) {

                        if (dataLoad[i].type == "textbox") {
                            $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                        }
                        if (dataLoad[i].type == "checkbox") {
                            chekedd = false
                            if (dataLoad[i].value == '1') {
                                chekedd = true
                            }
                            $scope.item.obj[dataLoad[i].emrdfk] = chekedd
                        }

                        if (dataLoad[i].type == "datetime") {
                            $scope.item.obj[dataLoad[i].emrdfk] = new Date(dataLoad[i].value)
                        }
                        if (dataLoad[i].type == "time") {
                            $scope.item.obj[dataLoad[i].emrdfk] = new Date(dataLoad[i].value)
                        }
                        if (dataLoad[i].type == "date") {
                            $scope.item.obj[dataLoad[i].emrdfk] = new Date(dataLoad[i].value)
                        }

                        if (dataLoad[i].type == "checkboxtextbox") {
                            $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                            $scope.item.obj2[dataLoad[i].emrdfk] = true
                        }
                        if (dataLoad[i].type == "textarea") {
                            $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                        }
                        if (dataLoad[i].type == "combobox") {
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                            $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: res[1] }

                        }


                    }

                }
                onloadchart()
            })
            function onloadchart(){
                // var arrobj = Object.keys($scope.item.obj)

                // for (var i = arrobj.length - 1; i >= 0; i--) {
                    for (let z = 0; z < 28; z++) {
                        // if (arrobj[i] == 25000 + z)
                        //     sesiesSuhu[z] = $scope.item.obj[parseFloat(arrobj[i])]
                        var item = $scope.listSuhu[z]['id'];
                        sesiesSuhu[z] = $scope.item.obj[parseFloat(item)]
                    }

                // }
                // for (var i = arrobj.length - 1; i >= 0; i--) {
                    for (let y = 0; y < 28; y++) {
                        // if (arrobj[i] == 25028 + y)
                        //     seriesNadi[y] = $scope.item.obj[parseFloat(arrobj[i])]
                        var item = $scope.listNadi[y]['id'];
                        seriesNadi[y] = $scope.item.obj[parseFloat(item)]
                    }

                // }

                for (let x = 0; x < sesiesSuhu.length; x++) {

                    if (!isNaN(parseFloat(sesiesSuhu[x])))
                        sesiesSuhu[x] = parseFloat(sesiesSuhu[x])
                    else
                        sesiesSuhu[x] = null
                }
                for (let x = 0; x < seriesNadi.length; x++) {
                    if (!isNaN(parseInt(seriesNadi[x])))
                        seriesNadi[x] = parseInt(seriesNadi[x])
                    else
                        seriesNadi[x] = null
                }
                loadChart()
                console.log(seriesNadi)
                console.log(sesiesSuhu)
            }

            $scope.Batal = function () {
                $scope.item.obj = []
            }
            $scope.kembali = function () {
                $rootScope.showRiwayat()
            }

            $scope.Save = function () {

                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])] })
                }
                $scope.cc.jenisemr = 'asesmen'
                var jsonSave = {
                    head: $scope.cc,
                    data: arrSave
                }
                medifirstService.post('emr/save-emr-dinamis', jsonSave).then(function (e) {

                    medifirstService.postLogging('EMR', 'norec emrpasien_t', e.data.data.norec,
                    'Catatan Perinatologi 7' + ' dengan No EMR - ' + e.data.data.noemr + ' pada No Registrasi '
                    + $scope.cc.noregistrasi).then(function (res) {
                    })
                    var arrobj = Object.keys($scope.item.obj)

                    // for (var i = arrobj.length - 1; i >= 0; i--) {
                        for (let z = 0; z < 28; z++) {
                            // if (arrobj[i] == 25000 + z)
                            //     sesiesSuhu[z] = $scope.item.obj[parseFloat(arrobj[i])]
                            var item = $scope.listSuhu[z]['id'];
                            sesiesSuhu[z] = $scope.item.obj[parseFloat(item)]
                        }
                        for (let z = 0; z < 28; z++) {
                            // if (arrobj[i] == 25028 + z)
                            //     seriesNadi[z] = $scope.item.obj[parseFloat(arrobj[i])]
                            var item = $scope.listNadi[z]['id'];
                            seriesNadi[z] = $scope.item.obj[parseFloat(item)]
                        }
                    // }
                    for (let x = 0; x < sesiesSuhu.length; x++) {
                        if (!isNaN(parseFloat(sesiesSuhu[x])))
                            sesiesSuhu[x] = parseFloat(sesiesSuhu[x])
                        else
                            sesiesSuhu[x] = null
                    }
                    for (let x = 0; x < seriesNadi.length; x++) {
                        if (!isNaN(parseInt(seriesNadi[x])))
                            seriesNadi[x] = parseInt(seriesNadi[x])
                        else    
                            seriesNadi[x] = null
                    }
                    loadChart()
                    $rootScope.loadRiwayat()
                    var arrStr = {
                        0: e.data.data.noemr
                    }
                    cacheHelper.set('cacheNomorEMR', arrStr);
                });
            }

        }
    ]);
});