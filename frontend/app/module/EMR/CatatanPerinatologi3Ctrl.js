define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('CatatanPerinatologi3Ctrl', ['$q', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($q, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, medifirstService) {

            $scope.noCM = $state.params.noCM;
            $scope.tombolSimpanVis = true
            $scope.noRecPap = cacheHelper.get('noRecPap');
            $scope.totalSkor = 0
            $scope.totalSkor2 = 0
            $scope.cc = {}
            var nomorEMR = '-'
            $scope.cc.emrfk = 210226
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
                        { "id": 22036652, "nama": "h-1", "type": "datetime" },
                        { "id": 22036653, "nama": "h-2", "type": "datetime" },
                        { "id": 22036654, "nama": "h-3", "type": "datetime" },
                        { "id": 22036655, "nama": "h-4", "type": "datetime" },
                    ]
                },
                {
                    "id": 2, "nama": "Balance Cairan",
                    "detail": [
                        { "id": 22036659, "nama": "h-1", "type": "textbox" },
                        { "id": 22036660, "nama": "h-2", "type": "textbox" },
                        { "id": 22036661, "nama": "h-3", "type": "textbox" },
                        { "id": 22036662, "nama": "h-4", "type": "textbox" },
                    ]
                },
                {
                    "id": 3, "nama": "Bilirubin",
                    "detail": [
                        { "id": 22036666, "nama": "h-1", "type": "textbox" },
                        { "id": 22036667, "nama": "h-2", "type": "textbox" },
                        { "id": 22036668, "nama": "h-3", "type": "textbox" },
                        { "id": 22036669, "nama": "h-4", "type": "textbox" },
                    ]
                },
                {
                    "id": 4, "nama": "Minum",
                    "detail": [
                        { "id": 22036673, "nama": "h-1", "type": "textbox" },
                        { "id": 22036674, "nama": "h-2", "type": "textbox" },
                        { "id": 22036675, "nama": "h-3", "type": "textbox" },
                        { "id": 22036676, "nama": "h-4", "type": "textbox" },
                    ]
                },
                {
                    "id": 5, "nama": "Muntah",
                    "detail": [
                        { "id": 22036680, "nama": "h-1", "type": "textbox" },
                        { "id": 22036681, "nama": "h-2", "type": "textbox" },
                        { "id": 22036682, "nama": "h-3", "type": "textbox" },
                        { "id": 22036683, "nama": "h-4", "type": "textbox" },
                    ]
                },
                {
                    "id": 6, "nama": "Urine",
                    "detail": [
                        { "id": 22036687, "nama": "h-1", "type": "textbox" },
                        { "id": 22036688, "nama": "h-2", "type": "textbox" },
                        { "id": 22036689, "nama": "h-3", "type": "textbox" },
                        { "id": 22036690, "nama": "h-4", "type": "textbox" },
                    ]
                },
                {
                    "id": 7, "nama": "Defekasi",
                    "detail": [
                        { "id": 22036694, "nama": "h-1", "type": "textbox" },
                        { "id": 22036695, "nama": "h-2", "type": "textbox" },
                        { "id": 22036696, "nama": "h-3", "type": "textbox" },
                        { "id": 22036697, "nama": "h-4", "type": "textbox" },
                    ]
                },
                {
                    "id": 8, "nama": "Infus",
                    "detail": [
                        { "id": 22036701, "nama": "h-1", "type": "textbox" },
                        { "id": 22036702, "nama": "h-2", "type": "textbox" },
                        { "id": 22036703, "nama": "h-3", "type": "textbox" },
                        { "id": 22036704, "nama": "h-4", "type": "textbox" },
                    ]
                },
            ]
            $scope.listData = [
                {
                    "id": 1, "nama": "Pernafasan",
                    "detail": [
                        { "id": 22036708, "nama": "p-1", "type": "textbox" },
                        { "id": 22036709, "nama": "si-1", "type": "textbox" },
                        { "id": 22036710, "nama": "s-1", "type": "textbox" },
                        { "id": 22036711, "nama": "m-1", "type": "textbox" },
                        { "id": 22036712, "nama": "p-2", "type": "textbox" },
                        { "id": 22036713, "nama": "si-2", "type": "textbox" },
                        { "id": 22036714, "nama": "s-2", "type": "textbox" },
                        { "id": 22036715, "nama": "m-2", "type": "textbox" },
                        { "id": 22036716, "nama": "p-3", "type": "textbox" },
                        { "id": 22036717, "nama": "si-3", "type": "textbox" },
                        { "id": 22036718, "nama": "s-3", "type": "textbox" },
                        { "id": 22036719, "nama": "m-3", "type": "textbox" },
                        { "id": 22036720, "nama": "p-4", "type": "textbox" },
                        { "id": 22036721, "nama": "si-4", "type": "textbox" },
                        { "id": 22036722, "nama": "s-4", "type": "textbox" },
                        { "id": 22036723, "nama": "m-4", "type": "textbox" },
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
                        { "id": 22036736, "nama": "p-1", "type": "textbox" },
                        { "id": 22036737, "nama": "si-1", "type": "textbox" },
                        { "id": 22036738, "nama": "s-1", "type": "textbox" },
                        { "id": 22036739, "nama": "m-1", "type": "textbox" },
                        { "id": 22036740, "nama": "p-2", "type": "textbox" },
                        { "id": 22036741, "nama": "si-2", "type": "textbox" },
                        { "id": 22036742, "nama": "s-2", "type": "textbox" },
                        { "id": 22036743, "nama": "m-2", "type": "textbox" },
                        { "id": 22036744, "nama": "p-3", "type": "textbox" },
                        { "id": 22036745, "nama": "si-3", "type": "textbox" },
                        { "id": 22036746, "nama": "s-3", "type": "textbox" },
                        { "id": 22036747, "nama": "m-3", "type": "textbox" },
                        { "id": 22036748, "nama": "p-4", "type": "textbox" },
                        { "id": 22036749, "nama": "si-4", "type": "textbox" },
                        { "id": 22036750, "nama": "s-4", "type": "textbox" },
                        { "id": 22036751, "nama": "m-4", "type": "textbox" },
                    ]
                },
                {
                    "id": 4, "nama": "Nadi",
                    "detail": [
                        { "id": 22036764, "nama": "p-1", "type": "textbox" },
                        { "id": 22036765, "nama": "si-1", "type": "textbox" },
                        { "id": 22036766, "nama": "s-1", "type": "textbox" },
                        { "id": 22036767, "nama": "m-1", "type": "textbox" },
                        { "id": 22036768, "nama": "p-2", "type": "textbox" },
                        { "id": 22036769, "nama": "si-2", "type": "textbox" },
                        { "id": 22036770, "nama": "s-2", "type": "textbox" },
                        { "id": 22036771, "nama": "m-2", "type": "textbox" },
                        { "id": 22036772, "nama": "p-3", "type": "textbox" },
                        { "id": 22036773, "nama": "si-3", "type": "textbox" },
                        { "id": 22036774, "nama": "s-3", "type": "textbox" },
                        { "id": 22036775, "nama": "m-3", "type": "textbox" },
                        { "id": 22036776, "nama": "p-4", "type": "textbox" },
                        { "id": 22036777, "nama": "si-4", "type": "textbox" },
                        { "id": 22036778, "nama": "s-4", "type": "textbox" },
                        { "id": 22036779, "nama": "m-4", "type": "textbox" },
                    ]
                },
                {
                    "id": 4, "nama": "BB", "colspan": "4",
                    "detail": [
                        { "id": 22036792, "nama": "p-1", "type": "textbox", "satuan": "Gram" },
                        { "id": 22036793, "nama": "p-2", "type": "textbox", "satuan": "Gram" },
                        { "id": 22036794, "nama": "p-3", "type": "textbox", "satuan": "Gram" },
                        { "id": 22036795, "nama": "p-4", "type": "textbox", "satuan": "Gram" },
                    ]
                },
            ]
            $scope.listPerinatologi2 = [
                {
                    "id": 1, "nama": "Tgl / Bln", "style": "text-align: center;background-color: #dedfe2d3;",
                    "detail": [
                        { "id": 22036656, "nama": "h-5", "type": "datetime" },
                        { "id": 22036657, "nama": "h-6", "type": "datetime" },
                        { "id": 22036658, "nama": "h-7", "type": "datetime" },
                    ]
                },
                {
                    "id": 2, "nama": "Balance Cairan",
                    "detail": [
                        { "id": 22036663, "nama": "h-5", "type": "textbox" },
                        { "id": 22036664, "nama": "h-6", "type": "textbox" },
                        { "id": 22036665, "nama": "h-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 3, "nama": "Bilirubin",
                    "detail": [
                        { "id": 22036670, "nama": "h-5", "type": "textbox" },
                        { "id": 22036671, "nama": "h-6", "type": "textbox" },
                        { "id": 22036672, "nama": "h-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 4, "nama": "Minum",
                    "detail": [
                        { "id": 22036677, "nama": "h-5", "type": "textbox" },
                        { "id": 22036678, "nama": "h-6", "type": "textbox" },
                        { "id": 22036679, "nama": "h-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 5, "nama": "Muntah",
                    "detail": [
                        { "id": 22036684, "nama": "h-5", "type": "textbox" },
                        { "id": 22036685, "nama": "h-6", "type": "textbox" },
                        { "id": 22036686, "nama": "h-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 6, "nama": "Urine",
                    "detail": [
                        { "id": 22036691, "nama": "h-5", "type": "textbox" },
                        { "id": 22036692, "nama": "h-6", "type": "textbox" },
                        { "id": 22036693, "nama": "h-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 7, "nama": "Defekasi",
                    "detail": [
                        { "id": 22036698, "nama": "h-5", "type": "textbox" },
                        { "id": 22036699, "nama": "h-6", "type": "textbox" },
                        { "id": 22036700, "nama": "h-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 8, "nama": "Infus",
                    "detail": [
                        { "id": 22036705, "nama": "h-5", "type": "textbox" },
                        { "id": 22036706, "nama": "h-6", "type": "textbox" },
                        { "id": 22036707, "nama": "h-7", "type": "textbox" },
                    ]
                },
            ]
            $scope.listData2 = [
                {
                    "id": 1, "nama": "Pernafasan",
                    "detail": [
                        { "id": 22036724, "nama": "p-5", "type": "textbox" },
                        { "id": 22036725, "nama": "si-5", "type": "textbox" },
                        { "id": 22036726, "nama": "s-5", "type": "textbox" },
                        { "id": 22036727, "nama": "m-5", "type": "textbox" },
                        { "id": 22036728, "nama": "p-6", "type": "textbox" },
                        { "id": 22036729, "nama": "si-6", "type": "textbox" },
                        { "id": 22036730, "nama": "s-6", "type": "textbox" },
                        { "id": 22036731, "nama": "m-6", "type": "textbox" },
                        { "id": 22036732, "nama": "p-7", "type": "textbox" },
                        { "id": 22036733, "nama": "si-7", "type": "textbox" },
                        { "id": 22036734, "nama": "s-7", "type": "textbox" },
                        { "id": 22036735, "nama": "m-7", "type": "textbox" },
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
                        { "id": 22036752, "nama": "p-5", "type": "textbox" },
                        { "id": 22036753, "nama": "si-5", "type": "textbox" },
                        { "id": 22036754, "nama": "s-5", "type": "textbox" },
                        { "id": 22036755, "nama": "m-5", "type": "textbox" },
                        { "id": 22036756, "nama": "p-6", "type": "textbox" },
                        { "id": 22036757, "nama": "si-6", "type": "textbox" },
                        { "id": 22036758, "nama": "s-6", "type": "textbox" },
                        { "id": 22036759, "nama": "m-6", "type": "textbox" },
                        { "id": 22036760, "nama": "p-7", "type": "textbox" },
                        { "id": 22036761, "nama": "si-7", "type": "textbox" },
                        { "id": 22036762, "nama": "s-7", "type": "textbox" },
                        { "id": 22036763, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 4, "nama": "Nadi",
                    "detail": [
                        { "id": 22036780, "nama": "p-5", "type": "textbox" },
                        { "id": 22036781, "nama": "si-5", "type": "textbox" },
                        { "id": 22036782, "nama": "s-5", "type": "textbox" },
                        { "id": 22036783, "nama": "m-5", "type": "textbox" },
                        { "id": 22036784, "nama": "p-6", "type": "textbox" },
                        { "id": 22036785, "nama": "si-6", "type": "textbox" },
                        { "id": 22036786, "nama": "s-6", "type": "textbox" },
                        { "id": 22036787, "nama": "m-6", "type": "textbox" },
                        { "id": 22036788, "nama": "p-7", "type": "textbox" },
                        { "id": 22036789, "nama": "si-7", "type": "textbox" },
                        { "id": 22036790, "nama": "s-7", "type": "textbox" },
                        { "id": 22036791, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 4, "nama": "BB", "colspan": "4",
                    "detail": [
                        { "id": 22036796, "nama": "p-5", "type": "textbox", "satuan": "Gram" },
                        { "id": 22036797, "nama": "p-6", "type": "textbox", "satuan": "Gram" },
                        { "id": 22036798, "nama": "p-7", "type": "textbox", "satuan": "Gram" },
                    ]
                },
            ]
            $scope.listPengenal1 = [
                { "id": 22036799, "nama": "Tgl.Lahir", "type": "datetime", "satuan": "" },
                { "id": 22036800, "nama": "Jenis Kelamin", "type": "textbox", "satuan": "" },
                { "id": 22036801, "nama": "APGAR Score", "type": "textbox", "satuan": "" },
                { "id": 22036802, "nama": "BB Lahir", "type": "textbox", "satuan": "Gram" },
                { "id": 22036803, "nama": "Panjang", "type": "textbox", "satuan": "cm" },
                { "id": 22036804, "nama": "Lingkar Kepala", "type": "textbox", "satuan": "cm" },
                { "id": 22036805, "nama": "Suhu", "type": "textbox", "satuan": "C" },
            ]
            $scope.listPengenal2 = [
                { "id": 22036806, "nama": "Riwayat Persalinan : GPA", "type": "textbox", "satuan": "" },
                { "id": 22036807, "nama": "Kehamilan", "type": "textbox", "satuan": "" },
                { "id": 22036808, "nama": "Umur Ibu", "type": "textbox", "satuan": "" },
                { "id": 22036809, "nama": "HbsAg Ibu", "type": "textbox", "satuan": "" },
                { "id": 22036810, "nama": "Gol. Darah Ibu", "type": "textbox", "satuan": "" },
                { "id": 22036811, "nama": "Persalinan", "type": "textbox", "satuan": "" },
                { "id": 22036812, "nama": "Ketuban", "type": "textbox", "satuan": "" },
            ]
            $scope.listPengenal3 = [
                { "id": 22036813, "nama": "Resusitasi", "type": "textbox", "satuan": "" },
                { "id": 22036814, "nama": "Obat yang diberikan", "type": "textbox", "satuan": "" },
                { "id": 22036815, "nama": "Miksi", "type": "textbox", "satuan": "" },
                { "id": 22036816, "nama": "Meco", "type": "textbox", "satuan": "" },
                { "id": 22036817, "nama": "Anus", "type": "textbox", "satuan": "" },
                { "id": 22036818, "nama": "Mata", "type": "textbox", "satuan": "" },
                { "id": 22036819, "nama": "Hal-hal istimewa", "type": "textbox", "satuan": "" },
            ]
            $scope.listObat = [
                {
                    "id": 22036820, "nama": "Obat-1",
                    "detail": [
                        { "id": 22036821, "nama": "p-1", "type": "textbox" },
                        { "id": 22036822, "nama": "si-1", "type": "textbox" },
                        { "id": 22036823, "nama": "s-1", "type": "textbox" },
                        { "id": 22036824, "nama": "m-1", "type": "textbox" },
                        { "id": 22036825, "nama": "p-2", "type": "textbox" },
                        { "id": 22036826, "nama": "si-2", "type": "textbox" },
                        { "id": 22036827, "nama": "s-2", "type": "textbox" },
                        { "id": 22036828, "nama": "m-2", "type": "textbox" },
                        { "id": 22036829, "nama": "p-3", "type": "textbox" },
                        { "id": 22036830, "nama": "si-3", "type": "textbox" },
                        { "id": 22036831, "nama": "s-3", "type": "textbox" },
                        { "id": 22036832, "nama": "m-3", "type": "textbox" },
                        { "id": 22036833, "nama": "p-4", "type": "textbox" },
                        { "id": 22036834, "nama": "si-4", "type": "textbox" },
                        { "id": 22036835, "nama": "s-4", "type": "textbox" },
                        { "id": 22036836, "nama": "m-4", "type": "textbox" },
                        { "id": 22036837, "nama": "p-5", "type": "textbox" },
                        { "id": 22036838, "nama": "si-5", "type": "textbox" },
                        { "id": 22036839, "nama": "s-5", "type": "textbox" },
                        { "id": 22036840, "nama": "m-5", "type": "textbox" },
                        { "id": 22036841, "nama": "p-6", "type": "textbox" },
                        { "id": 22036842, "nama": "si-6", "type": "textbox" },
                        { "id": 22036843, "nama": "s-6", "type": "textbox" },
                        { "id": 22036844, "nama": "m-6", "type": "textbox" },
                        { "id": 22036845, "nama": "p-7", "type": "textbox" },
                        { "id": 22036846, "nama": "si-7", "type": "textbox" },
                        { "id": 22036847, "nama": "s-7", "type": "textbox" },
                        { "id": 22036848, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22036849, "nama": "Obat-2",
                    "detail": [
                        { "id": 22036850, "nama": "p-1", "type": "textbox" },
                        { "id": 22036851, "nama": "si-1", "type": "textbox" },
                        { "id": 22036852, "nama": "s-1", "type": "textbox" },
                        { "id": 22036853, "nama": "m-1", "type": "textbox" },
                        { "id": 22036854, "nama": "p-2", "type": "textbox" },
                        { "id": 22036855, "nama": "si-2", "type": "textbox" },
                        { "id": 22036856, "nama": "s-2", "type": "textbox" },
                        { "id": 22036857, "nama": "m-2", "type": "textbox" },
                        { "id": 22036858, "nama": "p-3", "type": "textbox" },
                        { "id": 22036859, "nama": "si-3", "type": "textbox" },
                        { "id": 22036860, "nama": "s-3", "type": "textbox" },
                        { "id": 22036861, "nama": "m-3", "type": "textbox" },
                        { "id": 22036862, "nama": "p-4", "type": "textbox" },
                        { "id": 22036863, "nama": "si-4", "type": "textbox" },
                        { "id": 22036864, "nama": "s-4", "type": "textbox" },
                        { "id": 22036865, "nama": "m-4", "type": "textbox" },
                        { "id": 22036866, "nama": "p-5", "type": "textbox" },
                        { "id": 22036867, "nama": "si-5", "type": "textbox" },
                        { "id": 22036868, "nama": "s-5", "type": "textbox" },
                        { "id": 22036869, "nama": "m-5", "type": "textbox" },
                        { "id": 22036870, "nama": "p-6", "type": "textbox" },
                        { "id": 22036871, "nama": "si-6", "type": "textbox" },
                        { "id": 22036872, "nama": "s-6", "type": "textbox" },
                        { "id": 22036873, "nama": "m-6", "type": "textbox" },
                        { "id": 22036874, "nama": "p-7", "type": "textbox" },
                        { "id": 22036875, "nama": "si-7", "type": "textbox" },
                        { "id": 22036876, "nama": "s-7", "type": "textbox" },
                        { "id": 22036877, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22036878, "nama": "Obat-3",
                    "detail": [
                        { "id": 22036879, "nama": "p-1", "type": "textbox" },
                        { "id": 22036880, "nama": "si-1", "type": "textbox" },
                        { "id": 22036881, "nama": "s-1", "type": "textbox" },
                        { "id": 22036882, "nama": "m-1", "type": "textbox" },
                        { "id": 22036883, "nama": "p-2", "type": "textbox" },
                        { "id": 22036884, "nama": "si-2", "type": "textbox" },
                        { "id": 22036885, "nama": "s-2", "type": "textbox" },
                        { "id": 22036886, "nama": "m-2", "type": "textbox" },
                        { "id": 22036887, "nama": "p-3", "type": "textbox" },
                        { "id": 22036888, "nama": "si-3", "type": "textbox" },
                        { "id": 22036889, "nama": "s-3", "type": "textbox" },
                        { "id": 22036890, "nama": "m-3", "type": "textbox" },
                        { "id": 22036891, "nama": "p-4", "type": "textbox" },
                        { "id": 22036892, "nama": "si-4", "type": "textbox" },
                        { "id": 22036893, "nama": "s-4", "type": "textbox" },
                        { "id": 22036894, "nama": "m-4", "type": "textbox" },
                        { "id": 22036895, "nama": "p-5", "type": "textbox" },
                        { "id": 22036896, "nama": "si-5", "type": "textbox" },
                        { "id": 22036897, "nama": "s-5", "type": "textbox" },
                        { "id": 22036898, "nama": "m-5", "type": "textbox" },
                        { "id": 22036899, "nama": "p-6", "type": "textbox" },
                        { "id": 22036900, "nama": "si-6", "type": "textbox" },
                        { "id": 22036901, "nama": "s-6", "type": "textbox" },
                        { "id": 22036902, "nama": "m-6", "type": "textbox" },
                        { "id": 22036903, "nama": "p-7", "type": "textbox" },
                        { "id": 22036904, "nama": "si-7", "type": "textbox" },
                        { "id": 22036905, "nama": "s-7", "type": "textbox" },
                        { "id": 22036906, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22036907, "nama": "Obat-4",
                    "detail": [
                        { "id": 22036908, "nama": "p-1", "type": "textbox" },
                        { "id": 22036909, "nama": "si-1", "type": "textbox" },
                        { "id": 22036910, "nama": "s-1", "type": "textbox" },
                        { "id": 22036911, "nama": "m-1", "type": "textbox" },
                        { "id": 22036912, "nama": "p-2", "type": "textbox" },
                        { "id": 22036913, "nama": "si-2", "type": "textbox" },
                        { "id": 22036914, "nama": "s-2", "type": "textbox" },
                        { "id": 22036915, "nama": "m-2", "type": "textbox" },
                        { "id": 22036916, "nama": "p-3", "type": "textbox" },
                        { "id": 22036917, "nama": "si-3", "type": "textbox" },
                        { "id": 22036918, "nama": "s-3", "type": "textbox" },
                        { "id": 22036919, "nama": "m-3", "type": "textbox" },
                        { "id": 22036920, "nama": "p-4", "type": "textbox" },
                        { "id": 22036921, "nama": "si-4", "type": "textbox" },
                        { "id": 22036922, "nama": "s-4", "type": "textbox" },
                        { "id": 22036923, "nama": "m-4", "type": "textbox" },
                        { "id": 22036924, "nama": "p-5", "type": "textbox" },
                        { "id": 22036925, "nama": "si-5", "type": "textbox" },
                        { "id": 22036926, "nama": "s-5", "type": "textbox" },
                        { "id": 22036927, "nama": "m-5", "type": "textbox" },
                        { "id": 22036928, "nama": "p-6", "type": "textbox" },
                        { "id": 22036929, "nama": "si-6", "type": "textbox" },
                        { "id": 22036930, "nama": "s-6", "type": "textbox" },
                        { "id": 22036931, "nama": "m-6", "type": "textbox" },
                        { "id": 22036932, "nama": "p-7", "type": "textbox" },
                        { "id": 22036933, "nama": "si-7", "type": "textbox" },
                        { "id": 22036934, "nama": "s-7", "type": "textbox" },
                        { "id": 22036935, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22036936, "nama": "Obat-5",
                    "detail": [
                        { "id": 22036937, "nama": "p-1", "type": "textbox" },
                        { "id": 22036938, "nama": "si-1", "type": "textbox" },
                        { "id": 22036939, "nama": "s-1", "type": "textbox" },
                        { "id": 22036940, "nama": "m-1", "type": "textbox" },
                        { "id": 22036941, "nama": "p-2", "type": "textbox" },
                        { "id": 22036942, "nama": "si-2", "type": "textbox" },
                        { "id": 22036943, "nama": "s-2", "type": "textbox" },
                        { "id": 22036944, "nama": "m-2", "type": "textbox" },
                        { "id": 22036945, "nama": "p-3", "type": "textbox" },
                        { "id": 22036946, "nama": "si-3", "type": "textbox" },
                        { "id": 22036947, "nama": "s-3", "type": "textbox" },
                        { "id": 22036948, "nama": "m-3", "type": "textbox" },
                        { "id": 22036949, "nama": "p-4", "type": "textbox" },
                        { "id": 22036950, "nama": "si-4", "type": "textbox" },
                        { "id": 22036951, "nama": "s-4", "type": "textbox" },
                        { "id": 22036952, "nama": "m-4", "type": "textbox" },
                        { "id": 22036953, "nama": "p-5", "type": "textbox" },
                        { "id": 22036954, "nama": "si-5", "type": "textbox" },
                        { "id": 22036955, "nama": "s-5", "type": "textbox" },
                        { "id": 22036956, "nama": "m-5", "type": "textbox" },
                        { "id": 22036957, "nama": "p-6", "type": "textbox" },
                        { "id": 22036958, "nama": "si-6", "type": "textbox" },
                        { "id": 22036959, "nama": "s-6", "type": "textbox" },
                        { "id": 22036960, "nama": "m-6", "type": "textbox" },
                        { "id": 22036961, "nama": "p-7", "type": "textbox" },
                        { "id": 22036962, "nama": "si-7", "type": "textbox" },
                        { "id": 22036963, "nama": "s-7", "type": "textbox" },
                        { "id": 22036964, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22036965, "nama": "Obat-6",
                    "detail": [
                        { "id": 22036966, "nama": "p-1", "type": "textbox" },
                        { "id": 22036967, "nama": "si-1", "type": "textbox" },
                        { "id": 22036968, "nama": "s-1", "type": "textbox" },
                        { "id": 22036969, "nama": "m-1", "type": "textbox" },
                        { "id": 22036970, "nama": "p-2", "type": "textbox" },
                        { "id": 22036971, "nama": "si-2", "type": "textbox" },
                        { "id": 22036972, "nama": "s-2", "type": "textbox" },
                        { "id": 22036973, "nama": "m-2", "type": "textbox" },
                        { "id": 22036974, "nama": "p-3", "type": "textbox" },
                        { "id": 22036975, "nama": "si-3", "type": "textbox" },
                        { "id": 22036976, "nama": "s-3", "type": "textbox" },
                        { "id": 22036977, "nama": "m-3", "type": "textbox" },
                        { "id": 22036978, "nama": "p-4", "type": "textbox" },
                        { "id": 22036979, "nama": "si-4", "type": "textbox" },
                        { "id": 22036980, "nama": "s-4", "type": "textbox" },
                        { "id": 22036981, "nama": "m-4", "type": "textbox" },
                        { "id": 22036982, "nama": "p-5", "type": "textbox" },
                        { "id": 22036983, "nama": "si-5", "type": "textbox" },
                        { "id": 22036984, "nama": "s-5", "type": "textbox" },
                        { "id": 22036985, "nama": "m-5", "type": "textbox" },
                        { "id": 22036986, "nama": "p-6", "type": "textbox" },
                        { "id": 22036987, "nama": "si-6", "type": "textbox" },
                        { "id": 22036988, "nama": "s-6", "type": "textbox" },
                        { "id": 22036989, "nama": "m-6", "type": "textbox" },
                        { "id": 22036990, "nama": "p-7", "type": "textbox" },
                        { "id": 22036991, "nama": "si-7", "type": "textbox" },
                        { "id": 22036992, "nama": "s-7", "type": "textbox" },
                        { "id": 22036993, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22036994, "nama": "Obat-7",
                    "detail": [
                        { "id": 22036995, "nama": "p-1", "type": "textbox" },
                        { "id": 22036996, "nama": "si-1", "type": "textbox" },
                        { "id": 22036997, "nama": "s-1", "type": "textbox" },
                        { "id": 22036998, "nama": "m-1", "type": "textbox" },
                        { "id": 22036999, "nama": "p-2", "type": "textbox" },
                        { "id": 22037000, "nama": "si-2", "type": "textbox" },
                        { "id": 22037001, "nama": "s-2", "type": "textbox" },
                        { "id": 22037002, "nama": "m-2", "type": "textbox" },
                        { "id": 22037003, "nama": "p-3", "type": "textbox" },
                        { "id": 22037004, "nama": "si-3", "type": "textbox" },
                        { "id": 22037005, "nama": "s-3", "type": "textbox" },
                        { "id": 22037006, "nama": "m-3", "type": "textbox" },
                        { "id": 22037007, "nama": "p-4", "type": "textbox" },
                        { "id": 22037008, "nama": "si-4", "type": "textbox" },
                        { "id": 22037009, "nama": "s-4", "type": "textbox" },
                        { "id": 22037010, "nama": "m-4", "type": "textbox" },
                        { "id": 22037011, "nama": "p-5", "type": "textbox" },
                        { "id": 22037012, "nama": "si-5", "type": "textbox" },
                        { "id": 22037013, "nama": "s-5", "type": "textbox" },
                        { "id": 22037014, "nama": "m-5", "type": "textbox" },
                        { "id": 22037015, "nama": "p-6", "type": "textbox" },
                        { "id": 22037016, "nama": "si-6", "type": "textbox" },
                        { "id": 22037017, "nama": "s-6", "type": "textbox" },
                        { "id": 22037018, "nama": "m-6", "type": "textbox" },
                        { "id": 22037019, "nama": "p-7", "type": "textbox" },
                        { "id": 22037020, "nama": "si-7", "type": "textbox" },
                        { "id": 22037021, "nama": "s-7", "type": "textbox" },
                        { "id": 22037022, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22037023, "nama": "Obat-8",
                    "detail": [
                        { "id": 22037024, "nama": "p-1", "type": "textbox" },
                        { "id": 22037025, "nama": "si-1", "type": "textbox" },
                        { "id": 22037026, "nama": "s-1", "type": "textbox" },
                        { "id": 22037027, "nama": "m-1", "type": "textbox" },
                        { "id": 22037028, "nama": "p-2", "type": "textbox" },
                        { "id": 22037029, "nama": "si-2", "type": "textbox" },
                        { "id": 22037030, "nama": "s-2", "type": "textbox" },
                        { "id": 22037031, "nama": "m-2", "type": "textbox" },
                        { "id": 22037032, "nama": "p-3", "type": "textbox" },
                        { "id": 22037033, "nama": "si-3", "type": "textbox" },
                        { "id": 22037034, "nama": "s-3", "type": "textbox" },
                        { "id": 22037035, "nama": "m-3", "type": "textbox" },
                        { "id": 22037036, "nama": "p-4", "type": "textbox" },
                        { "id": 22037037, "nama": "si-4", "type": "textbox" },
                        { "id": 22037038, "nama": "s-4", "type": "textbox" },
                        { "id": 22037039, "nama": "m-4", "type": "textbox" },
                        { "id": 22037040, "nama": "p-5", "type": "textbox" },
                        { "id": 22037041, "nama": "si-5", "type": "textbox" },
                        { "id": 22037042, "nama": "s-5", "type": "textbox" },
                        { "id": 22037043, "nama": "m-5", "type": "textbox" },
                        { "id": 22037044, "nama": "p-6", "type": "textbox" },
                        { "id": 22037045, "nama": "si-6", "type": "textbox" },
                        { "id": 22037046, "nama": "s-6", "type": "textbox" },
                        { "id": 22037047, "nama": "m-6", "type": "textbox" },
                        { "id": 22037048, "nama": "p-7", "type": "textbox" },
                        { "id": 22037049, "nama": "si-7", "type": "textbox" },
                        { "id": 22037050, "nama": "s-7", "type": "textbox" },
                        { "id": 22037051, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22037052, "nama": "Obat-9",
                    "detail": [
                        { "id": 22037053, "nama": "p-1", "type": "textbox" },
                        { "id": 22037054, "nama": "si-1", "type": "textbox" },
                        { "id": 22037055, "nama": "s-1", "type": "textbox" },
                        { "id": 22037056, "nama": "m-1", "type": "textbox" },
                        { "id": 22037057, "nama": "p-2", "type": "textbox" },
                        { "id": 22037058, "nama": "si-2", "type": "textbox" },
                        { "id": 22037059, "nama": "s-2", "type": "textbox" },
                        { "id": 22037060, "nama": "m-2", "type": "textbox" },
                        { "id": 22037061, "nama": "p-3", "type": "textbox" },
                        { "id": 22037062, "nama": "si-3", "type": "textbox" },
                        { "id": 22037063, "nama": "s-3", "type": "textbox" },
                        { "id": 22037064, "nama": "m-3", "type": "textbox" },
                        { "id": 22037065, "nama": "p-4", "type": "textbox" },
                        { "id": 22037066, "nama": "si-4", "type": "textbox" },
                        { "id": 22037067, "nama": "s-4", "type": "textbox" },
                        { "id": 22037068, "nama": "m-4", "type": "textbox" },
                        { "id": 22037069, "nama": "p-5", "type": "textbox" },
                        { "id": 22037070, "nama": "si-5", "type": "textbox" },
                        { "id": 22037071, "nama": "s-5", "type": "textbox" },
                        { "id": 22037072, "nama": "m-5", "type": "textbox" },
                        { "id": 22037073, "nama": "p-6", "type": "textbox" },
                        { "id": 22037074, "nama": "si-6", "type": "textbox" },
                        { "id": 22037075, "nama": "s-6", "type": "textbox" },
                        { "id": 22037076, "nama": "m-6", "type": "textbox" },
                        { "id": 22037077, "nama": "p-7", "type": "textbox" },
                        { "id": 22037078, "nama": "si-7", "type": "textbox" },
                        { "id": 22037079, "nama": "s-7", "type": "textbox" },
                        { "id": 22037080, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22037081, "nama": "Obat-10",
                    "detail": [
                        { "id": 22037082, "nama": "p-1", "type": "textbox" },
                        { "id": 22037083, "nama": "si-1", "type": "textbox" },
                        { "id": 22037084, "nama": "s-1", "type": "textbox" },
                        { "id": 22037085, "nama": "m-1", "type": "textbox" },
                        { "id": 22037086, "nama": "p-2", "type": "textbox" },
                        { "id": 22037087, "nama": "si-2", "type": "textbox" },
                        { "id": 22037088, "nama": "s-2", "type": "textbox" },
                        { "id": 22037089, "nama": "m-2", "type": "textbox" },
                        { "id": 22037090, "nama": "p-3", "type": "textbox" },
                        { "id": 22037091, "nama": "si-3", "type": "textbox" },
                        { "id": 22037092, "nama": "s-3", "type": "textbox" },
                        { "id": 22037093, "nama": "m-3", "type": "textbox" },
                        { "id": 22037094, "nama": "p-4", "type": "textbox" },
                        { "id": 22037095, "nama": "si-4", "type": "textbox" },
                        { "id": 22037096, "nama": "s-4", "type": "textbox" },
                        { "id": 22037097, "nama": "m-4", "type": "textbox" },
                        { "id": 22037098, "nama": "p-5", "type": "textbox" },
                        { "id": 22037099, "nama": "si-5", "type": "textbox" },
                        { "id": 22037100, "nama": "s-5", "type": "textbox" },
                        { "id": 22037101, "nama": "m-5", "type": "textbox" },
                        { "id": 22037102, "nama": "p-6", "type": "textbox" },
                        { "id": 22037103, "nama": "si-6", "type": "textbox" },
                        { "id": 22037104, "nama": "s-6", "type": "textbox" },
                        { "id": 22037105, "nama": "m-6", "type": "textbox" },
                        { "id": 22037106, "nama": "p-7", "type": "textbox" },
                        { "id": 22037107, "nama": "si-7", "type": "textbox" },
                        { "id": 22037108, "nama": "s-7", "type": "textbox" },
                        { "id": 22037109, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22037110, "nama": "Obat-11",
                    "detail": [
                        { "id": 22037111, "nama": "p-1", "type": "textbox" },
                        { "id": 22037112, "nama": "si-1", "type": "textbox" },
                        { "id": 22037113, "nama": "s-1", "type": "textbox" },
                        { "id": 22037114, "nama": "m-1", "type": "textbox" },
                        { "id": 22037115, "nama": "p-2", "type": "textbox" },
                        { "id": 22037116, "nama": "si-2", "type": "textbox" },
                        { "id": 22037117, "nama": "s-2", "type": "textbox" },
                        { "id": 22037118, "nama": "m-2", "type": "textbox" },
                        { "id": 22037119, "nama": "p-3", "type": "textbox" },
                        { "id": 22037120, "nama": "si-3", "type": "textbox" },
                        { "id": 22037121, "nama": "s-3", "type": "textbox" },
                        { "id": 22037122, "nama": "m-3", "type": "textbox" },
                        { "id": 22037123, "nama": "p-4", "type": "textbox" },
                        { "id": 22037124, "nama": "si-4", "type": "textbox" },
                        { "id": 22037125, "nama": "s-4", "type": "textbox" },
                        { "id": 22037126, "nama": "m-4", "type": "textbox" },
                        { "id": 22037127, "nama": "p-5", "type": "textbox" },
                        { "id": 22037128, "nama": "si-5", "type": "textbox" },
                        { "id": 22037129, "nama": "s-5", "type": "textbox" },
                        { "id": 22037130, "nama": "m-5", "type": "textbox" },
                        { "id": 22037131, "nama": "p-6", "type": "textbox" },
                        { "id": 22037132, "nama": "si-6", "type": "textbox" },
                        { "id": 22037133, "nama": "s-6", "type": "textbox" },
                        { "id": 22037134, "nama": "m-6", "type": "textbox" },
                        { "id": 22037135, "nama": "p-7", "type": "textbox" },
                        { "id": 22037136, "nama": "si-7", "type": "textbox" },
                        { "id": 22037137, "nama": "s-7", "type": "textbox" },
                        { "id": 22037138, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22037139, "nama": "Obat-12",
                    "detail": [
                        { "id": 22037140, "nama": "p-1", "type": "textbox" },
                        { "id": 22037141, "nama": "si-1", "type": "textbox" },
                        { "id": 22037142, "nama": "s-1", "type": "textbox" },
                        { "id": 22037143, "nama": "m-1", "type": "textbox" },
                        { "id": 22037144, "nama": "p-2", "type": "textbox" },
                        { "id": 22037145, "nama": "si-2", "type": "textbox" },
                        { "id": 22037146, "nama": "s-2", "type": "textbox" },
                        { "id": 22037147, "nama": "m-2", "type": "textbox" },
                        { "id": 22037148, "nama": "p-3", "type": "textbox" },
                        { "id": 22037149, "nama": "si-3", "type": "textbox" },
                        { "id": 22037150, "nama": "s-3", "type": "textbox" },
                        { "id": 22037151, "nama": "m-3", "type": "textbox" },
                        { "id": 22037152, "nama": "p-4", "type": "textbox" },
                        { "id": 22037153, "nama": "si-4", "type": "textbox" },
                        { "id": 22037154, "nama": "s-4", "type": "textbox" },
                        { "id": 22037155, "nama": "m-4", "type": "textbox" },
                        { "id": 22037156, "nama": "p-5", "type": "textbox" },
                        { "id": 22037157, "nama": "si-5", "type": "textbox" },
                        { "id": 22037158, "nama": "s-5", "type": "textbox" },
                        { "id": 22037159, "nama": "m-5", "type": "textbox" },
                        { "id": 22037160, "nama": "p-6", "type": "textbox" },
                        { "id": 22037161, "nama": "si-6", "type": "textbox" },
                        { "id": 22037162, "nama": "s-6", "type": "textbox" },
                        { "id": 22037163, "nama": "m-6", "type": "textbox" },
                        { "id": 22037164, "nama": "p-7", "type": "textbox" },
                        { "id": 22037165, "nama": "si-7", "type": "textbox" },
                        { "id": 22037166, "nama": "s-7", "type": "textbox" },
                        { "id": 22037167, "nama": "m-7", "type": "textbox" },
                    ]
                }
            ]
            $scope.listSuhu = [
                { "id": 22036736, "nama": "p-1", "type": "textbox" },
                { "id": 22036737, "nama": "si-1", "type": "textbox" },
                { "id": 22036738, "nama": "s-1", "type": "textbox" },
                { "id": 22036739, "nama": "m-1", "type": "textbox" },
                { "id": 22036740, "nama": "p-2", "type": "textbox" },
                { "id": 22036741, "nama": "si-2", "type": "textbox" },
                { "id": 22036742, "nama": "s-2", "type": "textbox" },
                { "id": 22036743, "nama": "m-2", "type": "textbox" },
                { "id": 22036744, "nama": "p-3", "type": "textbox" },
                { "id": 22036745, "nama": "si-3", "type": "textbox" },
                { "id": 22036746, "nama": "s-3", "type": "textbox" },
                { "id": 22036747, "nama": "m-3", "type": "textbox" },
                { "id": 22036748, "nama": "p-4", "type": "textbox" },
                { "id": 22036749, "nama": "si-4", "type": "textbox" },
                { "id": 22036750, "nama": "s-4", "type": "textbox" },
                { "id": 22036751, "nama": "m-4", "type": "textbox" },
                { "id": 22036752, "nama": "p-5", "type": "textbox" },
                { "id": 22036753, "nama": "si-5", "type": "textbox" },
                { "id": 22036754, "nama": "s-5", "type": "textbox" },
                { "id": 22036755, "nama": "m-5", "type": "textbox" },
                { "id": 22036756, "nama": "p-6", "type": "textbox" },
                { "id": 22036757, "nama": "si-6", "type": "textbox" },
                { "id": 22036758, "nama": "s-6", "type": "textbox" },
                { "id": 22036759, "nama": "m-6", "type": "textbox" },
                { "id": 22036760, "nama": "p-7", "type": "textbox" },
                { "id": 22036761, "nama": "si-7", "type": "textbox" },
                { "id": 22036762, "nama": "s-7", "type": "textbox" },
                { "id": 22036763, "nama": "m-7", "type": "textbox" },
            ]
            $scope.listNadi = [
                { "id": 22036764, "nama": "p-1", "type": "textbox" },
                { "id": 22036765, "nama": "si-1", "type": "textbox" },
                { "id": 22036766, "nama": "s-1", "type": "textbox" },
                { "id": 22036767, "nama": "m-1", "type": "textbox" },
                { "id": 22036768, "nama": "p-2", "type": "textbox" },
                { "id": 22036769, "nama": "si-2", "type": "textbox" },
                { "id": 22036770, "nama": "s-2", "type": "textbox" },
                { "id": 22036771, "nama": "m-2", "type": "textbox" },
                { "id": 22036772, "nama": "p-3", "type": "textbox" },
                { "id": 22036773, "nama": "si-3", "type": "textbox" },
                { "id": 22036774, "nama": "s-3", "type": "textbox" },
                { "id": 22036775, "nama": "m-3", "type": "textbox" },
                { "id": 22036776, "nama": "p-4", "type": "textbox" },
                { "id": 22036777, "nama": "si-4", "type": "textbox" },
                { "id": 22036778, "nama": "s-4", "type": "textbox" },
                { "id": 22036779, "nama": "m-4", "type": "textbox" },
                { "id": 22036780, "nama": "p-5", "type": "textbox" },
                { "id": 22036781, "nama": "si-5", "type": "textbox" },
                { "id": 22036782, "nama": "s-5", "type": "textbox" },
                { "id": 22036783, "nama": "m-5", "type": "textbox" },
                { "id": 22036784, "nama": "p-6", "type": "textbox" },
                { "id": 22036785, "nama": "si-6", "type": "textbox" },
                { "id": 22036786, "nama": "s-6", "type": "textbox" },
                { "id": 22036787, "nama": "m-6", "type": "textbox" },
                { "id": 22036788, "nama": "p-7", "type": "textbox" },
                { "id": 22036789, "nama": "si-7", "type": "textbox" },
                { "id": 22036790, "nama": "s-7", "type": "textbox" },
                { "id": 22036791, "nama": "m-7", "type": "textbox" },
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
                    'Catatan Perinatologi 3' + ' dengan No EMR - ' + e.data.data.noemr + ' pada No Registrasi '
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