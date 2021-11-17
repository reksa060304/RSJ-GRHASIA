define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('CatatanPerinatologi5Ctrl', ['$q', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($q, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, medifirstService) {

            $scope.noCM = $state.params.noCM;
            $scope.tombolSimpanVis = true
            $scope.noRecPap = cacheHelper.get('noRecPap');
            $scope.totalSkor = 0
            $scope.totalSkor2 = 0
            $scope.cc = {}
            var nomorEMR = '-'
            $scope.cc.emrfk = 210228
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
                        { "id": 22037684, "nama": "h-1", "type": "datetime" },
                        { "id": 22037685, "nama": "h-2", "type": "datetime" },
                        { "id": 22037686, "nama": "h-3", "type": "datetime" },
                        { "id": 22037687, "nama": "h-4", "type": "datetime" },
                    ]
                },
                {
                    "id": 2, "nama": "Balance Cairan",
                    "detail": [
                        { "id": 22037691, "nama": "h-1", "type": "textbox" },
                        { "id": 22037692, "nama": "h-2", "type": "textbox" },
                        { "id": 22037693, "nama": "h-3", "type": "textbox" },
                        { "id": 22037694, "nama": "h-4", "type": "textbox" },
                    ]
                },
                {
                    "id": 3, "nama": "Bilirubin",
                    "detail": [
                        { "id": 22037698, "nama": "h-1", "type": "textbox" },
                        { "id": 22037699, "nama": "h-2", "type": "textbox" },
                        { "id": 22037700, "nama": "h-3", "type": "textbox" },
                        { "id": 22037701, "nama": "h-4", "type": "textbox" },
                    ]
                },
                {
                    "id": 4, "nama": "Minum",
                    "detail": [
                        { "id": 22037705, "nama": "h-1", "type": "textbox" },
                        { "id": 22037706, "nama": "h-2", "type": "textbox" },
                        { "id": 22037707, "nama": "h-3", "type": "textbox" },
                        { "id": 22037708, "nama": "h-4", "type": "textbox" },
                    ]
                },
                {
                    "id": 5, "nama": "Muntah",
                    "detail": [
                        { "id": 22037712, "nama": "h-1", "type": "textbox" },
                        { "id": 22037713, "nama": "h-2", "type": "textbox" },
                        { "id": 22037714, "nama": "h-3", "type": "textbox" },
                        { "id": 22037715, "nama": "h-4", "type": "textbox" },
                    ]
                },
                {
                    "id": 6, "nama": "Urine",
                    "detail": [
                        { "id": 22037719, "nama": "h-1", "type": "textbox" },
                        { "id": 22037720, "nama": "h-2", "type": "textbox" },
                        { "id": 22037721, "nama": "h-3", "type": "textbox" },
                        { "id": 22037722, "nama": "h-4", "type": "textbox" },
                    ]
                },
                {
                    "id": 7, "nama": "Defekasi",
                    "detail": [
                        { "id": 22037726, "nama": "h-1", "type": "textbox" },
                        { "id": 22037727, "nama": "h-2", "type": "textbox" },
                        { "id": 22037728, "nama": "h-3", "type": "textbox" },
                        { "id": 22037729, "nama": "h-4", "type": "textbox" },
                    ]
                },
                {
                    "id": 8, "nama": "Infus",
                    "detail": [
                        { "id": 22037733, "nama": "h-1", "type": "textbox" },
                        { "id": 22037734, "nama": "h-2", "type": "textbox" },
                        { "id": 22037735, "nama": "h-3", "type": "textbox" },
                        { "id": 22037736, "nama": "h-4", "type": "textbox" },
                    ]
                },
            ]
            $scope.listData = [
                {
                    "id": 1, "nama": "Pernafasan",
                    "detail": [
                        { "id": 22037740, "nama": "p-1", "type": "textbox" },
                        { "id": 22037741, "nama": "si-1", "type": "textbox" },
                        { "id": 22037742, "nama": "s-1", "type": "textbox" },
                        { "id": 22037743, "nama": "m-1", "type": "textbox" },
                        { "id": 22037744, "nama": "p-2", "type": "textbox" },
                        { "id": 22037745, "nama": "si-2", "type": "textbox" },
                        { "id": 22037746, "nama": "s-2", "type": "textbox" },
                        { "id": 22037747, "nama": "m-2", "type": "textbox" },
                        { "id": 22037748, "nama": "p-3", "type": "textbox" },
                        { "id": 22037749, "nama": "si-3", "type": "textbox" },
                        { "id": 22037750, "nama": "s-3", "type": "textbox" },
                        { "id": 22037751, "nama": "m-3", "type": "textbox" },
                        { "id": 22037752, "nama": "p-4", "type": "textbox" },
                        { "id": 22037753, "nama": "si-4", "type": "textbox" },
                        { "id": 22037754, "nama": "s-4", "type": "textbox" },
                        { "id": 22037755, "nama": "m-4", "type": "textbox" },
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
                        { "id": 22037768, "nama": "p-1", "type": "textbox" },
                        { "id": 22037769, "nama": "si-1", "type": "textbox" },
                        { "id": 22037770, "nama": "s-1", "type": "textbox" },
                        { "id": 22037771, "nama": "m-1", "type": "textbox" },
                        { "id": 22037772, "nama": "p-2", "type": "textbox" },
                        { "id": 22037773, "nama": "si-2", "type": "textbox" },
                        { "id": 22037774, "nama": "s-2", "type": "textbox" },
                        { "id": 22037775, "nama": "m-2", "type": "textbox" },
                        { "id": 22037776, "nama": "p-3", "type": "textbox" },
                        { "id": 22037777, "nama": "si-3", "type": "textbox" },
                        { "id": 22037778, "nama": "s-3", "type": "textbox" },
                        { "id": 22037779, "nama": "m-3", "type": "textbox" },
                        { "id": 22037780, "nama": "p-4", "type": "textbox" },
                        { "id": 22037781, "nama": "si-4", "type": "textbox" },
                        { "id": 22037782, "nama": "s-4", "type": "textbox" },
                        { "id": 22037783, "nama": "m-4", "type": "textbox" },
                    ]
                },
                {
                    "id": 4, "nama": "Nadi",
                    "detail": [
                        { "id": 22037796, "nama": "p-1", "type": "textbox" },
                        { "id": 22037797, "nama": "si-1", "type": "textbox" },
                        { "id": 22037798, "nama": "s-1", "type": "textbox" },
                        { "id": 22037799, "nama": "m-1", "type": "textbox" },
                        { "id": 22037800, "nama": "p-2", "type": "textbox" },
                        { "id": 22037801, "nama": "si-2", "type": "textbox" },
                        { "id": 22037802, "nama": "s-2", "type": "textbox" },
                        { "id": 22037803, "nama": "m-2", "type": "textbox" },
                        { "id": 22037804, "nama": "p-3", "type": "textbox" },
                        { "id": 22037805, "nama": "si-3", "type": "textbox" },
                        { "id": 22037806, "nama": "s-3", "type": "textbox" },
                        { "id": 22037807, "nama": "m-3", "type": "textbox" },
                        { "id": 22037808, "nama": "p-4", "type": "textbox" },
                        { "id": 22037809, "nama": "si-4", "type": "textbox" },
                        { "id": 22037810, "nama": "s-4", "type": "textbox" },
                        { "id": 22037811, "nama": "m-4", "type": "textbox" },
                    ]
                },
                {
                    "id": 4, "nama": "BB", "colspan": "4",
                    "detail": [
                        { "id": 22037824, "nama": "p-1", "type": "textbox", "satuan": "Gram" },
                        { "id": 22037825, "nama": "p-2", "type": "textbox", "satuan": "Gram" },
                        { "id": 22037826, "nama": "p-3", "type": "textbox", "satuan": "Gram" },
                        { "id": 22037827, "nama": "p-4", "type": "textbox", "satuan": "Gram" },
                    ]
                },
            ]
            $scope.listPerinatologi2 = [
                {
                    "id": 1, "nama": "Tgl / Bln", "style": "text-align: center;background-color: #dedfe2d3;",
                    "detail": [
                        { "id": 22037688, "nama": "h-5", "type": "datetime" },
                        { "id": 22037689, "nama": "h-6", "type": "datetime" },
                        { "id": 22037690, "nama": "h-7", "type": "datetime" },
                    ]
                },
                {
                    "id": 2, "nama": "Balance Cairan",
                    "detail": [
                        { "id": 22037695, "nama": "h-5", "type": "textbox" },
                        { "id": 22037696, "nama": "h-6", "type": "textbox" },
                        { "id": 22037697, "nama": "h-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 3, "nama": "Bilirubin",
                    "detail": [
                        { "id": 22037702, "nama": "h-5", "type": "textbox" },
                        { "id": 22037703, "nama": "h-6", "type": "textbox" },
                        { "id": 22037704, "nama": "h-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 4, "nama": "Minum",
                    "detail": [
                        { "id": 22037709, "nama": "h-5", "type": "textbox" },
                        { "id": 22037710, "nama": "h-6", "type": "textbox" },
                        { "id": 22037711, "nama": "h-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 5, "nama": "Muntah",
                    "detail": [
                        { "id": 22037716, "nama": "h-5", "type": "textbox" },
                        { "id": 22037717, "nama": "h-6", "type": "textbox" },
                        { "id": 22037718, "nama": "h-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 6, "nama": "Urine",
                    "detail": [
                        { "id": 22037723, "nama": "h-5", "type": "textbox" },
                        { "id": 22037724, "nama": "h-6", "type": "textbox" },
                        { "id": 22037725, "nama": "h-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 7, "nama": "Defekasi",
                    "detail": [
                        { "id": 22037730, "nama": "h-5", "type": "textbox" },
                        { "id": 22037731, "nama": "h-6", "type": "textbox" },
                        { "id": 22037732, "nama": "h-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 8, "nama": "Infus",
                    "detail": [
                        { "id": 22037737, "nama": "h-5", "type": "textbox" },
                        { "id": 22037738, "nama": "h-6", "type": "textbox" },
                        { "id": 22037739, "nama": "h-7", "type": "textbox" },
                    ]
                },
            ]
            $scope.listData2 = [
                {
                    "id": 1, "nama": "Pernafasan",
                    "detail": [
                        { "id": 22037756, "nama": "p-5", "type": "textbox" },
                        { "id": 22037757, "nama": "si-5", "type": "textbox" },
                        { "id": 22037758, "nama": "s-5", "type": "textbox" },
                        { "id": 22037759, "nama": "m-5", "type": "textbox" },
                        { "id": 22037760, "nama": "p-6", "type": "textbox" },
                        { "id": 22037761, "nama": "si-6", "type": "textbox" },
                        { "id": 22037762, "nama": "s-6", "type": "textbox" },
                        { "id": 22037763, "nama": "m-6", "type": "textbox" },
                        { "id": 22037764, "nama": "p-7", "type": "textbox" },
                        { "id": 22037765, "nama": "si-7", "type": "textbox" },
                        { "id": 22037766, "nama": "s-7", "type": "textbox" },
                        { "id": 22037767, "nama": "m-7", "type": "textbox" },
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
                        { "id": 22037784, "nama": "p-5", "type": "textbox" },
                        { "id": 22037785, "nama": "si-5", "type": "textbox" },
                        { "id": 22037786, "nama": "s-5", "type": "textbox" },
                        { "id": 22037787, "nama": "m-5", "type": "textbox" },
                        { "id": 22037788, "nama": "p-6", "type": "textbox" },
                        { "id": 22037789, "nama": "si-6", "type": "textbox" },
                        { "id": 22037790, "nama": "s-6", "type": "textbox" },
                        { "id": 22037791, "nama": "m-6", "type": "textbox" },
                        { "id": 22037792, "nama": "p-7", "type": "textbox" },
                        { "id": 22037793, "nama": "si-7", "type": "textbox" },
                        { "id": 22037794, "nama": "s-7", "type": "textbox" },
                        { "id": 22037795, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 4, "nama": "Nadi",
                    "detail": [
                        { "id": 22037812, "nama": "p-5", "type": "textbox" },
                        { "id": 22037813, "nama": "si-5", "type": "textbox" },
                        { "id": 22037814, "nama": "s-5", "type": "textbox" },
                        { "id": 22037815, "nama": "m-5", "type": "textbox" },
                        { "id": 22037816, "nama": "p-6", "type": "textbox" },
                        { "id": 22037817, "nama": "si-6", "type": "textbox" },
                        { "id": 22037818, "nama": "s-6", "type": "textbox" },
                        { "id": 22037819, "nama": "m-6", "type": "textbox" },
                        { "id": 22037820, "nama": "p-7", "type": "textbox" },
                        { "id": 22037821, "nama": "si-7", "type": "textbox" },
                        { "id": 22037822, "nama": "s-7", "type": "textbox" },
                        { "id": 22037823, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 4, "nama": "BB", "colspan": "4",
                    "detail": [
                        { "id": 22037828, "nama": "p-5", "type": "textbox", "satuan": "Gram" },
                        { "id": 22037829, "nama": "p-6", "type": "textbox", "satuan": "Gram" },
                        { "id": 22037830, "nama": "p-7", "type": "textbox", "satuan": "Gram" },
                    ]
                },
            ]
            $scope.listPengenal1 = [
                { "id": 22037831, "nama": "Tgl.Lahir", "type": "datetime", "satuan": "" },
                { "id": 22037832, "nama": "Jenis Kelamin", "type": "textbox", "satuan": "" },
                { "id": 22037833, "nama": "APGAR Score", "type": "textbox", "satuan": "" },
                { "id": 22037834, "nama": "BB Lahir", "type": "textbox", "satuan": "Gram" },
                { "id": 22037835, "nama": "Panjang", "type": "textbox", "satuan": "cm" },
                { "id": 22037836, "nama": "Lingkar Kepala", "type": "textbox", "satuan": "cm" },
                { "id": 22037837, "nama": "Suhu", "type": "textbox", "satuan": "C" },
            ]
            $scope.listPengenal2 = [
                { "id": 22037838, "nama": "Riwayat Persalinan : GPA", "type": "textbox", "satuan": "" },
                { "id": 22037839, "nama": "Kehamilan", "type": "textbox", "satuan": "" },
                { "id": 22037840, "nama": "Umur Ibu", "type": "textbox", "satuan": "" },
                { "id": 22037841, "nama": "HbsAg Ibu", "type": "textbox", "satuan": "" },
                { "id": 22037842, "nama": "Gol. Darah Ibu", "type": "textbox", "satuan": "" },
                { "id": 22037843, "nama": "Persalinan", "type": "textbox", "satuan": "" },
                { "id": 22037844, "nama": "Ketuban", "type": "textbox", "satuan": "" },
            ]
            $scope.listPengenal3 = [
                { "id": 22037845, "nama": "Resusitasi", "type": "textbox", "satuan": "" },
                { "id": 22037846, "nama": "Obat yang diberikan", "type": "textbox", "satuan": "" },
                { "id": 22037847, "nama": "Miksi", "type": "textbox", "satuan": "" },
                { "id": 22037848, "nama": "Meco", "type": "textbox", "satuan": "" },
                { "id": 22037849, "nama": "Anus", "type": "textbox", "satuan": "" },
                { "id": 22037850, "nama": "Mata", "type": "textbox", "satuan": "" },
                { "id": 22037851, "nama": "Hal-hal istimewa", "type": "textbox", "satuan": "" },
            ]
            $scope.listObat = [
                {
                    "id": 22037852, "nama": "Obat-1",
                    "detail": [
                        { "id": 22037853, "nama": "p-1", "type": "textbox" },
                        { "id": 22037854, "nama": "si-1", "type": "textbox" },
                        { "id": 22037855, "nama": "s-1", "type": "textbox" },
                        { "id": 22037856, "nama": "m-1", "type": "textbox" },
                        { "id": 22037857, "nama": "p-2", "type": "textbox" },
                        { "id": 22037858, "nama": "si-2", "type": "textbox" },
                        { "id": 22037859, "nama": "s-2", "type": "textbox" },
                        { "id": 22037860, "nama": "m-2", "type": "textbox" },
                        { "id": 22037861, "nama": "p-3", "type": "textbox" },
                        { "id": 22037862, "nama": "si-3", "type": "textbox" },
                        { "id": 22037863, "nama": "s-3", "type": "textbox" },
                        { "id": 22037864, "nama": "m-3", "type": "textbox" },
                        { "id": 22037865, "nama": "p-4", "type": "textbox" },
                        { "id": 22037866, "nama": "si-4", "type": "textbox" },
                        { "id": 22037867, "nama": "s-4", "type": "textbox" },
                        { "id": 22037868, "nama": "m-4", "type": "textbox" },
                        { "id": 22037869, "nama": "p-5", "type": "textbox" },
                        { "id": 22037870, "nama": "si-5", "type": "textbox" },
                        { "id": 22037871, "nama": "s-5", "type": "textbox" },
                        { "id": 22037872, "nama": "m-5", "type": "textbox" },
                        { "id": 22037873, "nama": "p-6", "type": "textbox" },
                        { "id": 22037874, "nama": "si-6", "type": "textbox" },
                        { "id": 22037875, "nama": "s-6", "type": "textbox" },
                        { "id": 22037876, "nama": "m-6", "type": "textbox" },
                        { "id": 22037877, "nama": "p-7", "type": "textbox" },
                        { "id": 22037878, "nama": "si-7", "type": "textbox" },
                        { "id": 22037879, "nama": "s-7", "type": "textbox" },
                        { "id": 22037880, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22037881, "nama": "Obat-2",
                    "detail": [
                        { "id": 22037882, "nama": "p-1", "type": "textbox" },
                        { "id": 22037883, "nama": "si-1", "type": "textbox" },
                        { "id": 22037884, "nama": "s-1", "type": "textbox" },
                        { "id": 22037885, "nama": "m-1", "type": "textbox" },
                        { "id": 22037886, "nama": "p-2", "type": "textbox" },
                        { "id": 22037887, "nama": "si-2", "type": "textbox" },
                        { "id": 22037888, "nama": "s-2", "type": "textbox" },
                        { "id": 22037889, "nama": "m-2", "type": "textbox" },
                        { "id": 22037890, "nama": "p-3", "type": "textbox" },
                        { "id": 22037891, "nama": "si-3", "type": "textbox" },
                        { "id": 22037892, "nama": "s-3", "type": "textbox" },
                        { "id": 22037893, "nama": "m-3", "type": "textbox" },
                        { "id": 22037894, "nama": "p-4", "type": "textbox" },
                        { "id": 22037895, "nama": "si-4", "type": "textbox" },
                        { "id": 22037896, "nama": "s-4", "type": "textbox" },
                        { "id": 22037897, "nama": "m-4", "type": "textbox" },
                        { "id": 22037898, "nama": "p-5", "type": "textbox" },
                        { "id": 22037899, "nama": "si-5", "type": "textbox" },
                        { "id": 22037900, "nama": "s-5", "type": "textbox" },
                        { "id": 22037901, "nama": "m-5", "type": "textbox" },
                        { "id": 22037902, "nama": "p-6", "type": "textbox" },
                        { "id": 22037903, "nama": "si-6", "type": "textbox" },
                        { "id": 22037904, "nama": "s-6", "type": "textbox" },
                        { "id": 22037905, "nama": "m-6", "type": "textbox" },
                        { "id": 22037906, "nama": "p-7", "type": "textbox" },
                        { "id": 22037907, "nama": "si-7", "type": "textbox" },
                        { "id": 22037908, "nama": "s-7", "type": "textbox" },
                        { "id": 22037909, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22037910, "nama": "Obat-3",
                    "detail": [
                        { "id": 22037911, "nama": "p-1", "type": "textbox" },
                        { "id": 22037912, "nama": "si-1", "type": "textbox" },
                        { "id": 22037913, "nama": "s-1", "type": "textbox" },
                        { "id": 22037914, "nama": "m-1", "type": "textbox" },
                        { "id": 22037915, "nama": "p-2", "type": "textbox" },
                        { "id": 22037916, "nama": "si-2", "type": "textbox" },
                        { "id": 22037917, "nama": "s-2", "type": "textbox" },
                        { "id": 22037918, "nama": "m-2", "type": "textbox" },
                        { "id": 22037919, "nama": "p-3", "type": "textbox" },
                        { "id": 22037920, "nama": "si-3", "type": "textbox" },
                        { "id": 22037921, "nama": "s-3", "type": "textbox" },
                        { "id": 22037922, "nama": "m-3", "type": "textbox" },
                        { "id": 22037923, "nama": "p-4", "type": "textbox" },
                        { "id": 22037924, "nama": "si-4", "type": "textbox" },
                        { "id": 22037925, "nama": "s-4", "type": "textbox" },
                        { "id": 22037926, "nama": "m-4", "type": "textbox" },
                        { "id": 22037927, "nama": "p-5", "type": "textbox" },
                        { "id": 22037928, "nama": "si-5", "type": "textbox" },
                        { "id": 22037929, "nama": "s-5", "type": "textbox" },
                        { "id": 22037930, "nama": "m-5", "type": "textbox" },
                        { "id": 22037931, "nama": "p-6", "type": "textbox" },
                        { "id": 22037932, "nama": "si-6", "type": "textbox" },
                        { "id": 22037933, "nama": "s-6", "type": "textbox" },
                        { "id": 22037934, "nama": "m-6", "type": "textbox" },
                        { "id": 22037935, "nama": "p-7", "type": "textbox" },
                        { "id": 22037936, "nama": "si-7", "type": "textbox" },
                        { "id": 22037937, "nama": "s-7", "type": "textbox" },
                        { "id": 22037938, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22037939, "nama": "Obat-4",
                    "detail": [
                        { "id": 22037940, "nama": "p-1", "type": "textbox" },
                        { "id": 22037941, "nama": "si-1", "type": "textbox" },
                        { "id": 22037942, "nama": "s-1", "type": "textbox" },
                        { "id": 22037943, "nama": "m-1", "type": "textbox" },
                        { "id": 22037944, "nama": "p-2", "type": "textbox" },
                        { "id": 22037945, "nama": "si-2", "type": "textbox" },
                        { "id": 22037946, "nama": "s-2", "type": "textbox" },
                        { "id": 22037947, "nama": "m-2", "type": "textbox" },
                        { "id": 22037948, "nama": "p-3", "type": "textbox" },
                        { "id": 22037949, "nama": "si-3", "type": "textbox" },
                        { "id": 22037950, "nama": "s-3", "type": "textbox" },
                        { "id": 22037951, "nama": "m-3", "type": "textbox" },
                        { "id": 22037952, "nama": "p-4", "type": "textbox" },
                        { "id": 22037953, "nama": "si-4", "type": "textbox" },
                        { "id": 22037954, "nama": "s-4", "type": "textbox" },
                        { "id": 22037955, "nama": "m-4", "type": "textbox" },
                        { "id": 22037956, "nama": "p-5", "type": "textbox" },
                        { "id": 22037957, "nama": "si-5", "type": "textbox" },
                        { "id": 22037958, "nama": "s-5", "type": "textbox" },
                        { "id": 22037959, "nama": "m-5", "type": "textbox" },
                        { "id": 22037960, "nama": "p-6", "type": "textbox" },
                        { "id": 22037961, "nama": "si-6", "type": "textbox" },
                        { "id": 22037962, "nama": "s-6", "type": "textbox" },
                        { "id": 22037963, "nama": "m-6", "type": "textbox" },
                        { "id": 22037964, "nama": "p-7", "type": "textbox" },
                        { "id": 22037965, "nama": "si-7", "type": "textbox" },
                        { "id": 22037966, "nama": "s-7", "type": "textbox" },
                        { "id": 22037967, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22037968, "nama": "Obat-5",
                    "detail": [
                        { "id": 22037969, "nama": "p-1", "type": "textbox" },
                        { "id": 22037970, "nama": "si-1", "type": "textbox" },
                        { "id": 22037971, "nama": "s-1", "type": "textbox" },
                        { "id": 22037972, "nama": "m-1", "type": "textbox" },
                        { "id": 22037973, "nama": "p-2", "type": "textbox" },
                        { "id": 22037974, "nama": "si-2", "type": "textbox" },
                        { "id": 22037975, "nama": "s-2", "type": "textbox" },
                        { "id": 22037976, "nama": "m-2", "type": "textbox" },
                        { "id": 22037977, "nama": "p-3", "type": "textbox" },
                        { "id": 22037978, "nama": "si-3", "type": "textbox" },
                        { "id": 22037979, "nama": "s-3", "type": "textbox" },
                        { "id": 22037980, "nama": "m-3", "type": "textbox" },
                        { "id": 22037981, "nama": "p-4", "type": "textbox" },
                        { "id": 22037982, "nama": "si-4", "type": "textbox" },
                        { "id": 22037983, "nama": "s-4", "type": "textbox" },
                        { "id": 22037984, "nama": "m-4", "type": "textbox" },
                        { "id": 22037985, "nama": "p-5", "type": "textbox" },
                        { "id": 22037986, "nama": "si-5", "type": "textbox" },
                        { "id": 22037987, "nama": "s-5", "type": "textbox" },
                        { "id": 22037988, "nama": "m-5", "type": "textbox" },
                        { "id": 22037989, "nama": "p-6", "type": "textbox" },
                        { "id": 22037990, "nama": "si-6", "type": "textbox" },
                        { "id": 22037991, "nama": "s-6", "type": "textbox" },
                        { "id": 22037992, "nama": "m-6", "type": "textbox" },
                        { "id": 22037993, "nama": "p-7", "type": "textbox" },
                        { "id": 22037994, "nama": "si-7", "type": "textbox" },
                        { "id": 22037995, "nama": "s-7", "type": "textbox" },
                        { "id": 22037996, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22037997, "nama": "Obat-6",
                    "detail": [
                        { "id": 22037998, "nama": "p-1", "type": "textbox" },
                        { "id": 22037999, "nama": "si-1", "type": "textbox" },
                        { "id": 22038000, "nama": "s-1", "type": "textbox" },
                        { "id": 22038001, "nama": "m-1", "type": "textbox" },
                        { "id": 22038002, "nama": "p-2", "type": "textbox" },
                        { "id": 22038003, "nama": "si-2", "type": "textbox" },
                        { "id": 22038004, "nama": "s-2", "type": "textbox" },
                        { "id": 22038005, "nama": "m-2", "type": "textbox" },
                        { "id": 22038006, "nama": "p-3", "type": "textbox" },
                        { "id": 22038007, "nama": "si-3", "type": "textbox" },
                        { "id": 22038008, "nama": "s-3", "type": "textbox" },
                        { "id": 22038009, "nama": "m-3", "type": "textbox" },
                        { "id": 22038010, "nama": "p-4", "type": "textbox" },
                        { "id": 22038011, "nama": "si-4", "type": "textbox" },
                        { "id": 22038012, "nama": "s-4", "type": "textbox" },
                        { "id": 22038013, "nama": "m-4", "type": "textbox" },
                        { "id": 22038014, "nama": "p-5", "type": "textbox" },
                        { "id": 22038015, "nama": "si-5", "type": "textbox" },
                        { "id": 22038016, "nama": "s-5", "type": "textbox" },
                        { "id": 22038017, "nama": "m-5", "type": "textbox" },
                        { "id": 22038018, "nama": "p-6", "type": "textbox" },
                        { "id": 22038019, "nama": "si-6", "type": "textbox" },
                        { "id": 22038020, "nama": "s-6", "type": "textbox" },
                        { "id": 22038021, "nama": "m-6", "type": "textbox" },
                        { "id": 22038022, "nama": "p-7", "type": "textbox" },
                        { "id": 22038023, "nama": "si-7", "type": "textbox" },
                        { "id": 22038024, "nama": "s-7", "type": "textbox" },
                        { "id": 22038025, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22038026, "nama": "Obat-7",
                    "detail": [
                        { "id": 22038027, "nama": "p-1", "type": "textbox" },
                        { "id": 22038028, "nama": "si-1", "type": "textbox" },
                        { "id": 22038029, "nama": "s-1", "type": "textbox" },
                        { "id": 22038030, "nama": "m-1", "type": "textbox" },
                        { "id": 22038031, "nama": "p-2", "type": "textbox" },
                        { "id": 22038032, "nama": "si-2", "type": "textbox" },
                        { "id": 22038033, "nama": "s-2", "type": "textbox" },
                        { "id": 22038034, "nama": "m-2", "type": "textbox" },
                        { "id": 22038035, "nama": "p-3", "type": "textbox" },
                        { "id": 22038036, "nama": "si-3", "type": "textbox" },
                        { "id": 22038037, "nama": "s-3", "type": "textbox" },
                        { "id": 22038038, "nama": "m-3", "type": "textbox" },
                        { "id": 22038039, "nama": "p-4", "type": "textbox" },
                        { "id": 22038040, "nama": "si-4", "type": "textbox" },
                        { "id": 22038041, "nama": "s-4", "type": "textbox" },
                        { "id": 22038042, "nama": "m-4", "type": "textbox" },
                        { "id": 22038043, "nama": "p-5", "type": "textbox" },
                        { "id": 22038044, "nama": "si-5", "type": "textbox" },
                        { "id": 22038045, "nama": "s-5", "type": "textbox" },
                        { "id": 22038046, "nama": "m-5", "type": "textbox" },
                        { "id": 22038047, "nama": "p-6", "type": "textbox" },
                        { "id": 22038048, "nama": "si-6", "type": "textbox" },
                        { "id": 22038049, "nama": "s-6", "type": "textbox" },
                        { "id": 22038050, "nama": "m-6", "type": "textbox" },
                        { "id": 22038051, "nama": "p-7", "type": "textbox" },
                        { "id": 22038052, "nama": "si-7", "type": "textbox" },
                        { "id": 22038053, "nama": "s-7", "type": "textbox" },
                        { "id": 22038054, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22038055, "nama": "Obat-8",
                    "detail": [
                        { "id": 22038056, "nama": "p-1", "type": "textbox" },
                        { "id": 22038057, "nama": "si-1", "type": "textbox" },
                        { "id": 22038058, "nama": "s-1", "type": "textbox" },
                        { "id": 22038059, "nama": "m-1", "type": "textbox" },
                        { "id": 22038060, "nama": "p-2", "type": "textbox" },
                        { "id": 22038061, "nama": "si-2", "type": "textbox" },
                        { "id": 22038062, "nama": "s-2", "type": "textbox" },
                        { "id": 22038063, "nama": "m-2", "type": "textbox" },
                        { "id": 22038064, "nama": "p-3", "type": "textbox" },
                        { "id": 22038065, "nama": "si-3", "type": "textbox" },
                        { "id": 22038066, "nama": "s-3", "type": "textbox" },
                        { "id": 22038067, "nama": "m-3", "type": "textbox" },
                        { "id": 22038068, "nama": "p-4", "type": "textbox" },
                        { "id": 22038069, "nama": "si-4", "type": "textbox" },
                        { "id": 22038070, "nama": "s-4", "type": "textbox" },
                        { "id": 22038071, "nama": "m-4", "type": "textbox" },
                        { "id": 22038072, "nama": "p-5", "type": "textbox" },
                        { "id": 22038073, "nama": "si-5", "type": "textbox" },
                        { "id": 22038074, "nama": "s-5", "type": "textbox" },
                        { "id": 22038075, "nama": "m-5", "type": "textbox" },
                        { "id": 22038076, "nama": "p-6", "type": "textbox" },
                        { "id": 22038077, "nama": "si-6", "type": "textbox" },
                        { "id": 22038078, "nama": "s-6", "type": "textbox" },
                        { "id": 22038079, "nama": "m-6", "type": "textbox" },
                        { "id": 22038080, "nama": "p-7", "type": "textbox" },
                        { "id": 22038081, "nama": "si-7", "type": "textbox" },
                        { "id": 22038082, "nama": "s-7", "type": "textbox" },
                        { "id": 22038083, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22038084, "nama": "Obat-9",
                    "detail": [
                        { "id": 22038085, "nama": "p-1", "type": "textbox" },
                        { "id": 22038086, "nama": "si-1", "type": "textbox" },
                        { "id": 22038087, "nama": "s-1", "type": "textbox" },
                        { "id": 22038088, "nama": "m-1", "type": "textbox" },
                        { "id": 22038089, "nama": "p-2", "type": "textbox" },
                        { "id": 22038090, "nama": "si-2", "type": "textbox" },
                        { "id": 22038091, "nama": "s-2", "type": "textbox" },
                        { "id": 22038092, "nama": "m-2", "type": "textbox" },
                        { "id": 22038093, "nama": "p-3", "type": "textbox" },
                        { "id": 22038094, "nama": "si-3", "type": "textbox" },
                        { "id": 22038095, "nama": "s-3", "type": "textbox" },
                        { "id": 22038096, "nama": "m-3", "type": "textbox" },
                        { "id": 22038097, "nama": "p-4", "type": "textbox" },
                        { "id": 22038098, "nama": "si-4", "type": "textbox" },
                        { "id": 22038099, "nama": "s-4", "type": "textbox" },
                        { "id": 22038100, "nama": "m-4", "type": "textbox" },
                        { "id": 22038101, "nama": "p-5", "type": "textbox" },
                        { "id": 22038102, "nama": "si-5", "type": "textbox" },
                        { "id": 22038103, "nama": "s-5", "type": "textbox" },
                        { "id": 22038104, "nama": "m-5", "type": "textbox" },
                        { "id": 22038105, "nama": "p-6", "type": "textbox" },
                        { "id": 22038106, "nama": "si-6", "type": "textbox" },
                        { "id": 22038107, "nama": "s-6", "type": "textbox" },
                        { "id": 22038108, "nama": "m-6", "type": "textbox" },
                        { "id": 22038109, "nama": "p-7", "type": "textbox" },
                        { "id": 22038110, "nama": "si-7", "type": "textbox" },
                        { "id": 22038111, "nama": "s-7", "type": "textbox" },
                        { "id": 22038112, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22038113, "nama": "Obat-10",
                    "detail": [
                        { "id": 22038114, "nama": "p-1", "type": "textbox" },
                        { "id": 22038115, "nama": "si-1", "type": "textbox" },
                        { "id": 22038116, "nama": "s-1", "type": "textbox" },
                        { "id": 22038117, "nama": "m-1", "type": "textbox" },
                        { "id": 22038118, "nama": "p-2", "type": "textbox" },
                        { "id": 22038119, "nama": "si-2", "type": "textbox" },
                        { "id": 22038120, "nama": "s-2", "type": "textbox" },
                        { "id": 22038121, "nama": "m-2", "type": "textbox" },
                        { "id": 22038122, "nama": "p-3", "type": "textbox" },
                        { "id": 22038123, "nama": "si-3", "type": "textbox" },
                        { "id": 22038124, "nama": "s-3", "type": "textbox" },
                        { "id": 22038125, "nama": "m-3", "type": "textbox" },
                        { "id": 22038126, "nama": "p-4", "type": "textbox" },
                        { "id": 22038127, "nama": "si-4", "type": "textbox" },
                        { "id": 22038128, "nama": "s-4", "type": "textbox" },
                        { "id": 22038129, "nama": "m-4", "type": "textbox" },
                        { "id": 22038130, "nama": "p-5", "type": "textbox" },
                        { "id": 22038131, "nama": "si-5", "type": "textbox" },
                        { "id": 22038132, "nama": "s-5", "type": "textbox" },
                        { "id": 22038133, "nama": "m-5", "type": "textbox" },
                        { "id": 22038134, "nama": "p-6", "type": "textbox" },
                        { "id": 22038135, "nama": "si-6", "type": "textbox" },
                        { "id": 22038136, "nama": "s-6", "type": "textbox" },
                        { "id": 22038137, "nama": "m-6", "type": "textbox" },
                        { "id": 22038138, "nama": "p-7", "type": "textbox" },
                        { "id": 22038139, "nama": "si-7", "type": "textbox" },
                        { "id": 22038140, "nama": "s-7", "type": "textbox" },
                        { "id": 22038141, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22038142, "nama": "Obat-11",
                    "detail": [
                        { "id": 22038143, "nama": "p-1", "type": "textbox" },
                        { "id": 22038144, "nama": "si-1", "type": "textbox" },
                        { "id": 22038145, "nama": "s-1", "type": "textbox" },
                        { "id": 22038146, "nama": "m-1", "type": "textbox" },
                        { "id": 22038147, "nama": "p-2", "type": "textbox" },
                        { "id": 22038148, "nama": "si-2", "type": "textbox" },
                        { "id": 22038149, "nama": "s-2", "type": "textbox" },
                        { "id": 22038150, "nama": "m-2", "type": "textbox" },
                        { "id": 22038151, "nama": "p-3", "type": "textbox" },
                        { "id": 22038152, "nama": "si-3", "type": "textbox" },
                        { "id": 22038153, "nama": "s-3", "type": "textbox" },
                        { "id": 22038154, "nama": "m-3", "type": "textbox" },
                        { "id": 22038155, "nama": "p-4", "type": "textbox" },
                        { "id": 22038156, "nama": "si-4", "type": "textbox" },
                        { "id": 22038157, "nama": "s-4", "type": "textbox" },
                        { "id": 22038158, "nama": "m-4", "type": "textbox" },
                        { "id": 22038159, "nama": "p-5", "type": "textbox" },
                        { "id": 22038160, "nama": "si-5", "type": "textbox" },
                        { "id": 22038161, "nama": "s-5", "type": "textbox" },
                        { "id": 22038162, "nama": "m-5", "type": "textbox" },
                        { "id": 22038163, "nama": "p-6", "type": "textbox" },
                        { "id": 22038164, "nama": "si-6", "type": "textbox" },
                        { "id": 22038165, "nama": "s-6", "type": "textbox" },
                        { "id": 22038166, "nama": "m-6", "type": "textbox" },
                        { "id": 22038167, "nama": "p-7", "type": "textbox" },
                        { "id": 22038168, "nama": "si-7", "type": "textbox" },
                        { "id": 22038169, "nama": "s-7", "type": "textbox" },
                        { "id": 22038170, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22038171, "nama": "Obat-12",
                    "detail": [
                        { "id": 22038172, "nama": "p-1", "type": "textbox" },
                        { "id": 22038173, "nama": "si-1", "type": "textbox" },
                        { "id": 22038174, "nama": "s-1", "type": "textbox" },
                        { "id": 22038175, "nama": "m-1", "type": "textbox" },
                        { "id": 22038176, "nama": "p-2", "type": "textbox" },
                        { "id": 22038177, "nama": "si-2", "type": "textbox" },
                        { "id": 22038178, "nama": "s-2", "type": "textbox" },
                        { "id": 22038179, "nama": "m-2", "type": "textbox" },
                        { "id": 22038180, "nama": "p-3", "type": "textbox" },
                        { "id": 22038181, "nama": "si-3", "type": "textbox" },
                        { "id": 22038182, "nama": "s-3", "type": "textbox" },
                        { "id": 22038183, "nama": "m-3", "type": "textbox" },
                        { "id": 22038184, "nama": "p-4", "type": "textbox" },
                        { "id": 22038185, "nama": "si-4", "type": "textbox" },
                        { "id": 22038186, "nama": "s-4", "type": "textbox" },
                        { "id": 22038187, "nama": "m-4", "type": "textbox" },
                        { "id": 22038188, "nama": "p-5", "type": "textbox" },
                        { "id": 22038189, "nama": "si-5", "type": "textbox" },
                        { "id": 22038190, "nama": "s-5", "type": "textbox" },
                        { "id": 22038191, "nama": "m-5", "type": "textbox" },
                        { "id": 22038192, "nama": "p-6", "type": "textbox" },
                        { "id": 22038193, "nama": "si-6", "type": "textbox" },
                        { "id": 22038194, "nama": "s-6", "type": "textbox" },
                        { "id": 22038195, "nama": "m-6", "type": "textbox" },
                        { "id": 22038196, "nama": "p-7", "type": "textbox" },
                        { "id": 22038197, "nama": "si-7", "type": "textbox" },
                        { "id": 22038198, "nama": "s-7", "type": "textbox" },
                        { "id": 22038199, "nama": "m-7", "type": "textbox" },
                    ]
                }
            ]
            $scope.listSuhu = [
                { "id": 22037768, "nama": "p-1", "type": "textbox" },
                { "id": 22037769, "nama": "si-1", "type": "textbox" },
                { "id": 22037770, "nama": "s-1", "type": "textbox" },
                { "id": 22037771, "nama": "m-1", "type": "textbox" },
                { "id": 22037772, "nama": "p-2", "type": "textbox" },
                { "id": 22037773, "nama": "si-2", "type": "textbox" },
                { "id": 22037774, "nama": "s-2", "type": "textbox" },
                { "id": 22037775, "nama": "m-2", "type": "textbox" },
                { "id": 22037776, "nama": "p-3", "type": "textbox" },
                { "id": 22037777, "nama": "si-3", "type": "textbox" },
                { "id": 22037778, "nama": "s-3", "type": "textbox" },
                { "id": 22037779, "nama": "m-3", "type": "textbox" },
                { "id": 22037780, "nama": "p-4", "type": "textbox" },
                { "id": 22037781, "nama": "si-4", "type": "textbox" },
                { "id": 22037782, "nama": "s-4", "type": "textbox" },
                { "id": 22037783, "nama": "m-4", "type": "textbox" },
                { "id": 22037784, "nama": "p-5", "type": "textbox" },
                { "id": 22037785, "nama": "si-5", "type": "textbox" },
                { "id": 22037786, "nama": "s-5", "type": "textbox" },
                { "id": 22037787, "nama": "m-5", "type": "textbox" },
                { "id": 22037788, "nama": "p-6", "type": "textbox" },
                { "id": 22037789, "nama": "si-6", "type": "textbox" },
                { "id": 22037790, "nama": "s-6", "type": "textbox" },
                { "id": 22037791, "nama": "m-6", "type": "textbox" },
                { "id": 22037792, "nama": "p-7", "type": "textbox" },
                { "id": 22037793, "nama": "si-7", "type": "textbox" },
                { "id": 22037794, "nama": "s-7", "type": "textbox" },
                { "id": 22037795, "nama": "m-7", "type": "textbox" },
            ]
            $scope.listNadi = [
                { "id": 22037796, "nama": "p-1", "type": "textbox" },
                { "id": 22037797, "nama": "si-1", "type": "textbox" },
                { "id": 22037798, "nama": "s-1", "type": "textbox" },
                { "id": 22037799, "nama": "m-1", "type": "textbox" },
                { "id": 22037800, "nama": "p-2", "type": "textbox" },
                { "id": 22037801, "nama": "si-2", "type": "textbox" },
                { "id": 22037802, "nama": "s-2", "type": "textbox" },
                { "id": 22037803, "nama": "m-2", "type": "textbox" },
                { "id": 22037804, "nama": "p-3", "type": "textbox" },
                { "id": 22037805, "nama": "si-3", "type": "textbox" },
                { "id": 22037806, "nama": "s-3", "type": "textbox" },
                { "id": 22037807, "nama": "m-3", "type": "textbox" },
                { "id": 22037808, "nama": "p-4", "type": "textbox" },
                { "id": 22037809, "nama": "si-4", "type": "textbox" },
                { "id": 22037810, "nama": "s-4", "type": "textbox" },
                { "id": 22037811, "nama": "m-4", "type": "textbox" },
                { "id": 22037812, "nama": "p-5", "type": "textbox" },
                { "id": 22037813, "nama": "si-5", "type": "textbox" },
                { "id": 22037814, "nama": "s-5", "type": "textbox" },
                { "id": 22037815, "nama": "m-5", "type": "textbox" },
                { "id": 22037816, "nama": "p-6", "type": "textbox" },
                { "id": 22037817, "nama": "si-6", "type": "textbox" },
                { "id": 22037818, "nama": "s-6", "type": "textbox" },
                { "id": 22037819, "nama": "m-6", "type": "textbox" },
                { "id": 22037820, "nama": "p-7", "type": "textbox" },
                { "id": 22037821, "nama": "si-7", "type": "textbox" },
                { "id": 22037822, "nama": "s-7", "type": "textbox" },
                { "id": 22037823, "nama": "m-7", "type": "textbox" },
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
                    'Catatan Perinatologi 5' + ' dengan No EMR - ' + e.data.data.noemr + ' pada No Registrasi '
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