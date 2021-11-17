define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('CatatanPerinatologiCtrl', ['$q', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($q, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, medifirstService) {

            $scope.noCM = $state.params.noCM;
            $scope.tombolSimpanVis = true
            $scope.noRecPap = cacheHelper.get('noRecPap');
            $scope.totalSkor = 0
            $scope.totalSkor2 = 0
            $scope.cc = {}
            var nomorEMR = '-'
            $scope.cc.emrfk = 210224
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
                        { "id": 22035620, "nama": "h-1", "type": "datetime" },
                        { "id": 22035621, "nama": "h-2", "type": "datetime" },
                        { "id": 22035622, "nama": "h-3", "type": "datetime" },
                        { "id": 22035623, "nama": "h-4", "type": "datetime" },
                    ]
                },
                {
                    "id": 2, "nama": "Balance Cairan",
                    "detail": [
                        { "id": 22035627, "nama": "h-1", "type": "textbox" },
                        { "id": 22035628, "nama": "h-2", "type": "textbox" },
                        { "id": 22035629, "nama": "h-3", "type": "textbox" },
                        { "id": 22035630, "nama": "h-4", "type": "textbox" },
                    ]
                },
                {
                    "id": 3, "nama": "Bilirubin",
                    "detail": [
                        { "id": 22035634, "nama": "h-1", "type": "textbox" },
                        { "id": 22035635, "nama": "h-2", "type": "textbox" },
                        { "id": 22035636, "nama": "h-3", "type": "textbox" },
                        { "id": 22035637, "nama": "h-4", "type": "textbox" },
                    ]
                },
                {
                    "id": 4, "nama": "Minum",
                    "detail": [
                        { "id": 22035641, "nama": "h-1", "type": "textbox" },
                        { "id": 22035642, "nama": "h-2", "type": "textbox" },
                        { "id": 22035643, "nama": "h-3", "type": "textbox" },
                        { "id": 22035644, "nama": "h-4", "type": "textbox" },
                    ]
                },
                {
                    "id": 5, "nama": "Muntah",
                    "detail": [
                        { "id": 22035648, "nama": "h-1", "type": "textbox" },
                        { "id": 22035649, "nama": "h-2", "type": "textbox" },
                        { "id": 22035650, "nama": "h-3", "type": "textbox" },
                        { "id": 22035651, "nama": "h-4", "type": "textbox" },
                    ]
                },
                {
                    "id": 6, "nama": "Urine",
                    "detail": [
                        { "id": 22035655, "nama": "h-1", "type": "textbox" },
                        { "id": 22035656, "nama": "h-2", "type": "textbox" },
                        { "id": 22035657, "nama": "h-3", "type": "textbox" },
                        { "id": 22035658, "nama": "h-4", "type": "textbox" },
                    ]
                },
                {
                    "id": 7, "nama": "Defekasi",
                    "detail": [
                        { "id": 22035662, "nama": "h-1", "type": "textbox" },
                        { "id": 22035663, "nama": "h-2", "type": "textbox" },
                        { "id": 22035664, "nama": "h-3", "type": "textbox" },
                        { "id": 22035665, "nama": "h-4", "type": "textbox" },
                    ]
                },
                {
                    "id": 8, "nama": "Infus",
                    "detail": [
                        { "id": 22035669, "nama": "h-1", "type": "textbox" },
                        { "id": 22035670, "nama": "h-2", "type": "textbox" },
                        { "id": 22035671, "nama": "h-3", "type": "textbox" },
                        { "id": 22035672, "nama": "h-4", "type": "textbox" },
                    ]
                },
            ]
            $scope.listData = [
                {
                    "id": 1, "nama": "Pernafasan",
                    "detail": [
                        { "id": 22035676, "nama": "p-1", "type": "textbox" },
                        { "id": 22035677, "nama": "si-1", "type": "textbox" },
                        { "id": 22035678, "nama": "s-1", "type": "textbox" },
                        { "id": 22035679, "nama": "m-1", "type": "textbox" },
                        { "id": 22035680, "nama": "p-2", "type": "textbox" },
                        { "id": 22035681, "nama": "si-2", "type": "textbox" },
                        { "id": 22035682, "nama": "s-2", "type": "textbox" },
                        { "id": 22035683, "nama": "m-2", "type": "textbox" },
                        { "id": 22035684, "nama": "p-3", "type": "textbox" },
                        { "id": 22035685, "nama": "si-3", "type": "textbox" },
                        { "id": 22035686, "nama": "s-3", "type": "textbox" },
                        { "id": 22035687, "nama": "m-3", "type": "textbox" },
                        { "id": 22035688, "nama": "p-4", "type": "textbox" },
                        { "id": 22035689, "nama": "si-4", "type": "textbox" },
                        { "id": 22035690, "nama": "s-4", "type": "textbox" },
                        { "id": 22035691, "nama": "m-4", "type": "textbox" },
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
                        { "id": 22035704, "nama": "p-1", "type": "textbox" },
                        { "id": 22035705, "nama": "si-1", "type": "textbox" },
                        { "id": 22035706, "nama": "s-1", "type": "textbox" },
                        { "id": 22035707, "nama": "m-1", "type": "textbox" },
                        { "id": 22035708, "nama": "p-2", "type": "textbox" },
                        { "id": 22035709, "nama": "si-2", "type": "textbox" },
                        { "id": 22035710, "nama": "s-2", "type": "textbox" },
                        { "id": 22035711, "nama": "m-2", "type": "textbox" },
                        { "id": 22035712, "nama": "p-3", "type": "textbox" },
                        { "id": 22035713, "nama": "si-3", "type": "textbox" },
                        { "id": 22035714, "nama": "s-3", "type": "textbox" },
                        { "id": 22035715, "nama": "m-3", "type": "textbox" },
                        { "id": 22035716, "nama": "p-4", "type": "textbox" },
                        { "id": 22035717, "nama": "si-4", "type": "textbox" },
                        { "id": 22035718, "nama": "s-4", "type": "textbox" },
                        { "id": 22035719, "nama": "m-4", "type": "textbox" },
                    ]
                },
                {
                    "id": 4, "nama": "Nadi",
                    "detail": [
                        { "id": 22035732, "nama": "p-1", "type": "textbox" },
                        { "id": 22035733, "nama": "si-1", "type": "textbox" },
                        { "id": 22035734, "nama": "s-1", "type": "textbox" },
                        { "id": 22035735, "nama": "m-1", "type": "textbox" },
                        { "id": 22035736, "nama": "p-2", "type": "textbox" },
                        { "id": 22035737, "nama": "si-2", "type": "textbox" },
                        { "id": 22035738, "nama": "s-2", "type": "textbox" },
                        { "id": 22035739, "nama": "m-2", "type": "textbox" },
                        { "id": 22035740, "nama": "p-3", "type": "textbox" },
                        { "id": 22035741, "nama": "si-3", "type": "textbox" },
                        { "id": 22035742, "nama": "s-3", "type": "textbox" },
                        { "id": 22035743, "nama": "m-3", "type": "textbox" },
                        { "id": 22035744, "nama": "p-4", "type": "textbox" },
                        { "id": 22035745, "nama": "si-4", "type": "textbox" },
                        { "id": 22035746, "nama": "s-4", "type": "textbox" },
                        { "id": 22035747, "nama": "m-4", "type": "textbox" },
                    ]
                },
                {
                    "id": 4, "nama": "BB", "colspan": "4",
                    "detail": [
                        { "id": 22035760, "nama": "p-1", "type": "textbox", "satuan": "Gram" },
                        { "id": 22035761, "nama": "p-2", "type": "textbox", "satuan": "Gram" },
                        { "id": 22035762, "nama": "p-3", "type": "textbox", "satuan": "Gram" },
                        { "id": 22035763, "nama": "p-4", "type": "textbox", "satuan": "Gram" },
                    ]
                },
            ]
            $scope.listPerinatologi2 = [
                {
                    "id": 1, "nama": "Tgl / Bln", "style": "text-align: center;background-color: #dedfe2d3;",
                    "detail": [
                        { "id": 22035624, "nama": "h-5", "type": "datetime" },
                        { "id": 22035625, "nama": "h-6", "type": "datetime" },
                        { "id": 22035626, "nama": "h-7", "type": "datetime" },
                    ]
                },
                {
                    "id": 2, "nama": "Balance Cairan",
                    "detail": [
                        { "id": 22035631, "nama": "h-5", "type": "textbox" },
                        { "id": 22035632, "nama": "h-6", "type": "textbox" },
                        { "id": 22035633, "nama": "h-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 3, "nama": "Bilirubin",
                    "detail": [
                        { "id": 22035638, "nama": "h-5", "type": "textbox" },
                        { "id": 22035639, "nama": "h-6", "type": "textbox" },
                        { "id": 22035640, "nama": "h-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 4, "nama": "Minum",
                    "detail": [
                        { "id": 22035645, "nama": "h-5", "type": "textbox" },
                        { "id": 22035646, "nama": "h-6", "type": "textbox" },
                        { "id": 22035647, "nama": "h-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 5, "nama": "Muntah",
                    "detail": [
                        { "id": 22035652, "nama": "h-5", "type": "textbox" },
                        { "id": 22035653, "nama": "h-6", "type": "textbox" },
                        { "id": 22035654, "nama": "h-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 6, "nama": "Urine",
                    "detail": [
                        { "id": 22035659, "nama": "h-5", "type": "textbox" },
                        { "id": 22035660, "nama": "h-6", "type": "textbox" },
                        { "id": 22035661, "nama": "h-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 7, "nama": "Defekasi",
                    "detail": [
                        { "id": 22035666, "nama": "h-5", "type": "textbox" },
                        { "id": 22035667, "nama": "h-6", "type": "textbox" },
                        { "id": 22035668, "nama": "h-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 8, "nama": "Infus",
                    "detail": [
                        { "id": 22035673, "nama": "h-5", "type": "textbox" },
                        { "id": 22035674, "nama": "h-6", "type": "textbox" },
                        { "id": 22035675, "nama": "h-7", "type": "textbox" },
                    ]
                },
            ]
            $scope.listData2 = [
                {
                    "id": 1, "nama": "Pernafasan",
                    "detail": [
                        { "id": 22035692, "nama": "p-5", "type": "textbox" },
                        { "id": 22035693, "nama": "si-5", "type": "textbox" },
                        { "id": 22035694, "nama": "s-5", "type": "textbox" },
                        { "id": 22035695, "nama": "m-5", "type": "textbox" },
                        { "id": 22035696, "nama": "p-6", "type": "textbox" },
                        { "id": 22035697, "nama": "si-6", "type": "textbox" },
                        { "id": 22035698, "nama": "s-6", "type": "textbox" },
                        { "id": 22035699, "nama": "m-6", "type": "textbox" },
                        { "id": 22035700, "nama": "p-7", "type": "textbox" },
                        { "id": 22035701, "nama": "si-7", "type": "textbox" },
                        { "id": 22035702, "nama": "s-7", "type": "textbox" },
                        { "id": 22035703, "nama": "m-7", "type": "textbox" },
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
                        { "id": 22035720, "nama": "p-5", "type": "textbox" },
                        { "id": 22035721, "nama": "si-5", "type": "textbox" },
                        { "id": 22035722, "nama": "s-5", "type": "textbox" },
                        { "id": 22035723, "nama": "m-5", "type": "textbox" },
                        { "id": 22035724, "nama": "p-6", "type": "textbox" },
                        { "id": 22035725, "nama": "si-6", "type": "textbox" },
                        { "id": 22035726, "nama": "s-6", "type": "textbox" },
                        { "id": 22035727, "nama": "m-6", "type": "textbox" },
                        { "id": 22035728, "nama": "p-7", "type": "textbox" },
                        { "id": 22035729, "nama": "si-7", "type": "textbox" },
                        { "id": 22035730, "nama": "s-7", "type": "textbox" },
                        { "id": 22035731, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 4, "nama": "Nadi",
                    "detail": [
                        { "id": 22035748, "nama": "p-5", "type": "textbox" },
                        { "id": 22035749, "nama": "si-5", "type": "textbox" },
                        { "id": 22035750, "nama": "s-5", "type": "textbox" },
                        { "id": 22035751, "nama": "m-5", "type": "textbox" },
                        { "id": 22035752, "nama": "p-6", "type": "textbox" },
                        { "id": 22035753, "nama": "si-6", "type": "textbox" },
                        { "id": 22035754, "nama": "s-6", "type": "textbox" },
                        { "id": 22035755, "nama": "m-6", "type": "textbox" },
                        { "id": 22035756, "nama": "p-7", "type": "textbox" },
                        { "id": 22035757, "nama": "si-7", "type": "textbox" },
                        { "id": 22035758, "nama": "s-7", "type": "textbox" },
                        { "id": 22035759, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 4, "nama": "BB", "colspan": "4",
                    "detail": [
                        { "id": 22035764, "nama": "p-5", "type": "textbox", "satuan": "Gram" },
                        { "id": 22035765, "nama": "p-6", "type": "textbox", "satuan": "Gram" },
                        { "id": 22035766, "nama": "p-7", "type": "textbox", "satuan": "Gram" },
                    ]
                },
            ]
            $scope.listPengenal1 = [
                { "id": 22035767, "nama": "Tgl.Lahir", "type": "datetime", "satuan": "" },
                { "id": 22035768, "nama": "Jenis Kelamin", "type": "textbox", "satuan": "" },
                { "id": 22035769, "nama": "APGAR Score", "type": "textbox", "satuan": "" },
                { "id": 22035770, "nama": "BB Lahir", "type": "textbox", "satuan": "Gram" },
                { "id": 22035771, "nama": "Panjang", "type": "textbox", "satuan": "cm" },
                { "id": 22035772, "nama": "Lingkar Kepala", "type": "textbox", "satuan": "cm" },
                { "id": 22035773, "nama": "Suhu", "type": "textbox", "satuan": "C" },
            ]
            $scope.listPengenal2 = [
                { "id": 22035774, "nama": "Riwayat Persalinan : GPA", "type": "textbox", "satuan": "" },
                { "id": 22035775, "nama": "Kehamilan", "type": "textbox", "satuan": "" },
                { "id": 22035776, "nama": "Umur Ibu", "type": "textbox", "satuan": "" },
                { "id": 22035777, "nama": "HbsAg Ibu", "type": "textbox", "satuan": "" },
                { "id": 22035778, "nama": "Gol. Darah Ibu", "type": "textbox", "satuan": "" },
                { "id": 22035779, "nama": "Persalinan", "type": "textbox", "satuan": "" },
                { "id": 22035780, "nama": "Ketuban", "type": "textbox", "satuan": "" },
            ]
            $scope.listPengenal3 = [
                { "id": 22035781, "nama": "Resusitasi", "type": "textbox", "satuan": "" },
                { "id": 22035782, "nama": "Obat yang diberikan", "type": "textbox", "satuan": "" },
                { "id": 22035783, "nama": "Miksi", "type": "textbox", "satuan": "" },
                { "id": 22035784, "nama": "Meco", "type": "textbox", "satuan": "" },
                { "id": 22035785, "nama": "Anus", "type": "textbox", "satuan": "" },
                { "id": 22035786, "nama": "Mata", "type": "textbox", "satuan": "" },
                { "id": 22035787, "nama": "Hal-hal istimewa", "type": "textbox", "satuan": "" },
            ]
            $scope.listObat = [
                {
                    "id": 22035788, "nama": "Obat-1",
                    "detail": [
                        { "id": 22035789, "nama": "p-1", "type": "textbox" },
                        { "id": 22035790, "nama": "si-1", "type": "textbox" },
                        { "id": 22035791, "nama": "s-1", "type": "textbox" },
                        { "id": 22035792, "nama": "m-1", "type": "textbox" },
                        { "id": 22035793, "nama": "p-2", "type": "textbox" },
                        { "id": 22035794, "nama": "si-2", "type": "textbox" },
                        { "id": 22035795, "nama": "s-2", "type": "textbox" },
                        { "id": 22035796, "nama": "m-2", "type": "textbox" },
                        { "id": 22035797, "nama": "p-3", "type": "textbox" },
                        { "id": 22035798, "nama": "si-3", "type": "textbox" },
                        { "id": 22035799, "nama": "s-3", "type": "textbox" },
                        { "id": 22035800, "nama": "m-3", "type": "textbox" },
                        { "id": 22035801, "nama": "p-4", "type": "textbox" },
                        { "id": 22035802, "nama": "si-4", "type": "textbox" },
                        { "id": 22035803, "nama": "s-4", "type": "textbox" },
                        { "id": 22035804, "nama": "m-4", "type": "textbox" },
                        { "id": 22035805, "nama": "p-5", "type": "textbox" },
                        { "id": 22035806, "nama": "si-5", "type": "textbox" },
                        { "id": 22035807, "nama": "s-5", "type": "textbox" },
                        { "id": 22035808, "nama": "m-5", "type": "textbox" },
                        { "id": 22035809, "nama": "p-6", "type": "textbox" },
                        { "id": 22035810, "nama": "si-6", "type": "textbox" },
                        { "id": 22035811, "nama": "s-6", "type": "textbox" },
                        { "id": 22035812, "nama": "m-6", "type": "textbox" },
                        { "id": 22035813, "nama": "p-7", "type": "textbox" },
                        { "id": 22035814, "nama": "si-7", "type": "textbox" },
                        { "id": 22035815, "nama": "s-7", "type": "textbox" },
                        { "id": 22035816, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22035817, "nama": "Obat-2",
                    "detail": [
                        { "id": 22035818, "nama": "p-1", "type": "textbox" },
                        { "id": 22035819, "nama": "si-1", "type": "textbox" },
                        { "id": 22035820, "nama": "s-1", "type": "textbox" },
                        { "id": 22035821, "nama": "m-1", "type": "textbox" },
                        { "id": 22035822, "nama": "p-2", "type": "textbox" },
                        { "id": 22035823, "nama": "si-2", "type": "textbox" },
                        { "id": 22035824, "nama": "s-2", "type": "textbox" },
                        { "id": 22035825, "nama": "m-2", "type": "textbox" },
                        { "id": 22035826, "nama": "p-3", "type": "textbox" },
                        { "id": 22035827, "nama": "si-3", "type": "textbox" },
                        { "id": 22035828, "nama": "s-3", "type": "textbox" },
                        { "id": 22035829, "nama": "m-3", "type": "textbox" },
                        { "id": 22035830, "nama": "p-4", "type": "textbox" },
                        { "id": 22035831, "nama": "si-4", "type": "textbox" },
                        { "id": 22035832, "nama": "s-4", "type": "textbox" },
                        { "id": 22035833, "nama": "m-4", "type": "textbox" },
                        { "id": 22035834, "nama": "p-5", "type": "textbox" },
                        { "id": 22035835, "nama": "si-5", "type": "textbox" },
                        { "id": 22035836, "nama": "s-5", "type": "textbox" },
                        { "id": 22035837, "nama": "m-5", "type": "textbox" },
                        { "id": 22035838, "nama": "p-6", "type": "textbox" },
                        { "id": 22035839, "nama": "si-6", "type": "textbox" },
                        { "id": 22035840, "nama": "s-6", "type": "textbox" },
                        { "id": 22035841, "nama": "m-6", "type": "textbox" },
                        { "id": 22035842, "nama": "p-7", "type": "textbox" },
                        { "id": 22035843, "nama": "si-7", "type": "textbox" },
                        { "id": 22035844, "nama": "s-7", "type": "textbox" },
                        { "id": 22035845, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22035846, "nama": "Obat-3",
                    "detail": [
                        { "id": 22035847, "nama": "p-1", "type": "textbox" },
                        { "id": 22035848, "nama": "si-1", "type": "textbox" },
                        { "id": 22035849, "nama": "s-1", "type": "textbox" },
                        { "id": 22035850, "nama": "m-1", "type": "textbox" },
                        { "id": 22035851, "nama": "p-2", "type": "textbox" },
                        { "id": 22035852, "nama": "si-2", "type": "textbox" },
                        { "id": 22035853, "nama": "s-2", "type": "textbox" },
                        { "id": 22035854, "nama": "m-2", "type": "textbox" },
                        { "id": 22035855, "nama": "p-3", "type": "textbox" },
                        { "id": 22035856, "nama": "si-3", "type": "textbox" },
                        { "id": 22035857, "nama": "s-3", "type": "textbox" },
                        { "id": 22035858, "nama": "m-3", "type": "textbox" },
                        { "id": 22035859, "nama": "p-4", "type": "textbox" },
                        { "id": 22035860, "nama": "si-4", "type": "textbox" },
                        { "id": 22035861, "nama": "s-4", "type": "textbox" },
                        { "id": 22035862, "nama": "m-4", "type": "textbox" },
                        { "id": 22035863, "nama": "p-5", "type": "textbox" },
                        { "id": 22035864, "nama": "si-5", "type": "textbox" },
                        { "id": 22035865, "nama": "s-5", "type": "textbox" },
                        { "id": 22035866, "nama": "m-5", "type": "textbox" },
                        { "id": 22035867, "nama": "p-6", "type": "textbox" },
                        { "id": 22035868, "nama": "si-6", "type": "textbox" },
                        { "id": 22035869, "nama": "s-6", "type": "textbox" },
                        { "id": 22035870, "nama": "m-6", "type": "textbox" },
                        { "id": 22035871, "nama": "p-7", "type": "textbox" },
                        { "id": 22035872, "nama": "si-7", "type": "textbox" },
                        { "id": 22035873, "nama": "s-7", "type": "textbox" },
                        { "id": 22035874, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22035875, "nama": "Obat-4",
                    "detail": [
                        { "id": 22035876, "nama": "p-1", "type": "textbox" },
                        { "id": 22035877, "nama": "si-1", "type": "textbox" },
                        { "id": 22035878, "nama": "s-1", "type": "textbox" },
                        { "id": 22035879, "nama": "m-1", "type": "textbox" },
                        { "id": 22035880, "nama": "p-2", "type": "textbox" },
                        { "id": 22035881, "nama": "si-2", "type": "textbox" },
                        { "id": 22035882, "nama": "s-2", "type": "textbox" },
                        { "id": 22035883, "nama": "m-2", "type": "textbox" },
                        { "id": 22035884, "nama": "p-3", "type": "textbox" },
                        { "id": 22035885, "nama": "si-3", "type": "textbox" },
                        { "id": 22035886, "nama": "s-3", "type": "textbox" },
                        { "id": 22035887, "nama": "m-3", "type": "textbox" },
                        { "id": 22035888, "nama": "p-4", "type": "textbox" },
                        { "id": 22035889, "nama": "si-4", "type": "textbox" },
                        { "id": 22035890, "nama": "s-4", "type": "textbox" },
                        { "id": 22035891, "nama": "m-4", "type": "textbox" },
                        { "id": 22035892, "nama": "p-5", "type": "textbox" },
                        { "id": 22035893, "nama": "si-5", "type": "textbox" },
                        { "id": 22035894, "nama": "s-5", "type": "textbox" },
                        { "id": 22035895, "nama": "m-5", "type": "textbox" },
                        { "id": 22035896, "nama": "p-6", "type": "textbox" },
                        { "id": 22035897, "nama": "si-6", "type": "textbox" },
                        { "id": 22035898, "nama": "s-6", "type": "textbox" },
                        { "id": 22035899, "nama": "m-6", "type": "textbox" },
                        { "id": 22035900, "nama": "p-7", "type": "textbox" },
                        { "id": 22035901, "nama": "si-7", "type": "textbox" },
                        { "id": 22035902, "nama": "s-7", "type": "textbox" },
                        { "id": 22035903, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22035904, "nama": "Obat-5",
                    "detail": [
                        { "id": 22035905, "nama": "p-1", "type": "textbox" },
                        { "id": 22035906, "nama": "si-1", "type": "textbox" },
                        { "id": 22035907, "nama": "s-1", "type": "textbox" },
                        { "id": 22035908, "nama": "m-1", "type": "textbox" },
                        { "id": 22035909, "nama": "p-2", "type": "textbox" },
                        { "id": 22035910, "nama": "si-2", "type": "textbox" },
                        { "id": 22035911, "nama": "s-2", "type": "textbox" },
                        { "id": 22035912, "nama": "m-2", "type": "textbox" },
                        { "id": 22035913, "nama": "p-3", "type": "textbox" },
                        { "id": 22035914, "nama": "si-3", "type": "textbox" },
                        { "id": 22035915, "nama": "s-3", "type": "textbox" },
                        { "id": 22035916, "nama": "m-3", "type": "textbox" },
                        { "id": 22035917, "nama": "p-4", "type": "textbox" },
                        { "id": 22035918, "nama": "si-4", "type": "textbox" },
                        { "id": 22035919, "nama": "s-4", "type": "textbox" },
                        { "id": 22035920, "nama": "m-4", "type": "textbox" },
                        { "id": 22035921, "nama": "p-5", "type": "textbox" },
                        { "id": 22035922, "nama": "si-5", "type": "textbox" },
                        { "id": 22035923, "nama": "s-5", "type": "textbox" },
                        { "id": 22035924, "nama": "m-5", "type": "textbox" },
                        { "id": 22035925, "nama": "p-6", "type": "textbox" },
                        { "id": 22035926, "nama": "si-6", "type": "textbox" },
                        { "id": 22035927, "nama": "s-6", "type": "textbox" },
                        { "id": 22035928, "nama": "m-6", "type": "textbox" },
                        { "id": 22035929, "nama": "p-7", "type": "textbox" },
                        { "id": 22035930, "nama": "si-7", "type": "textbox" },
                        { "id": 22035931, "nama": "s-7", "type": "textbox" },
                        { "id": 22035932, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22035933, "nama": "Obat-6",
                    "detail": [
                        { "id": 22035934, "nama": "p-1", "type": "textbox" },
                        { "id": 22035935, "nama": "si-1", "type": "textbox" },
                        { "id": 22035936, "nama": "s-1", "type": "textbox" },
                        { "id": 22035937, "nama": "m-1", "type": "textbox" },
                        { "id": 22035938, "nama": "p-2", "type": "textbox" },
                        { "id": 22035939, "nama": "si-2", "type": "textbox" },
                        { "id": 22035940, "nama": "s-2", "type": "textbox" },
                        { "id": 22035941, "nama": "m-2", "type": "textbox" },
                        { "id": 22035942, "nama": "p-3", "type": "textbox" },
                        { "id": 22035943, "nama": "si-3", "type": "textbox" },
                        { "id": 22035944, "nama": "s-3", "type": "textbox" },
                        { "id": 22035945, "nama": "m-3", "type": "textbox" },
                        { "id": 22035946, "nama": "p-4", "type": "textbox" },
                        { "id": 22035947, "nama": "si-4", "type": "textbox" },
                        { "id": 22035948, "nama": "s-4", "type": "textbox" },
                        { "id": 22035949, "nama": "m-4", "type": "textbox" },
                        { "id": 22035950, "nama": "p-5", "type": "textbox" },
                        { "id": 22035951, "nama": "si-5", "type": "textbox" },
                        { "id": 22035952, "nama": "s-5", "type": "textbox" },
                        { "id": 22035953, "nama": "m-5", "type": "textbox" },
                        { "id": 22035954, "nama": "p-6", "type": "textbox" },
                        { "id": 22035955, "nama": "si-6", "type": "textbox" },
                        { "id": 22035956, "nama": "s-6", "type": "textbox" },
                        { "id": 22035957, "nama": "m-6", "type": "textbox" },
                        { "id": 22035958, "nama": "p-7", "type": "textbox" },
                        { "id": 22035959, "nama": "si-7", "type": "textbox" },
                        { "id": 22035960, "nama": "s-7", "type": "textbox" },
                        { "id": 22035961, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22035962, "nama": "Obat-7",
                    "detail": [
                        { "id": 22035963, "nama": "p-1", "type": "textbox" },
                        { "id": 22035964, "nama": "si-1", "type": "textbox" },
                        { "id": 22035965, "nama": "s-1", "type": "textbox" },
                        { "id": 22035966, "nama": "m-1", "type": "textbox" },
                        { "id": 22035967, "nama": "p-2", "type": "textbox" },
                        { "id": 22035968, "nama": "si-2", "type": "textbox" },
                        { "id": 22035969, "nama": "s-2", "type": "textbox" },
                        { "id": 22035970, "nama": "m-2", "type": "textbox" },
                        { "id": 22035971, "nama": "p-3", "type": "textbox" },
                        { "id": 22035972, "nama": "si-3", "type": "textbox" },
                        { "id": 22035973, "nama": "s-3", "type": "textbox" },
                        { "id": 22035974, "nama": "m-3", "type": "textbox" },
                        { "id": 22035975, "nama": "p-4", "type": "textbox" },
                        { "id": 22035976, "nama": "si-4", "type": "textbox" },
                        { "id": 22035977, "nama": "s-4", "type": "textbox" },
                        { "id": 22035978, "nama": "m-4", "type": "textbox" },
                        { "id": 22035979, "nama": "p-5", "type": "textbox" },
                        { "id": 22035980, "nama": "si-5", "type": "textbox" },
                        { "id": 22035981, "nama": "s-5", "type": "textbox" },
                        { "id": 22035982, "nama": "m-5", "type": "textbox" },
                        { "id": 22035983, "nama": "p-6", "type": "textbox" },
                        { "id": 22035984, "nama": "si-6", "type": "textbox" },
                        { "id": 22035985, "nama": "s-6", "type": "textbox" },
                        { "id": 22035986, "nama": "m-6", "type": "textbox" },
                        { "id": 22035987, "nama": "p-7", "type": "textbox" },
                        { "id": 22035988, "nama": "si-7", "type": "textbox" },
                        { "id": 22035989, "nama": "s-7", "type": "textbox" },
                        { "id": 22035990, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22035991, "nama": "Obat-8",
                    "detail": [
                        { "id": 22035992, "nama": "p-1", "type": "textbox" },
                        { "id": 22035993, "nama": "si-1", "type": "textbox" },
                        { "id": 22035994, "nama": "s-1", "type": "textbox" },
                        { "id": 22035995, "nama": "m-1", "type": "textbox" },
                        { "id": 22035996, "nama": "p-2", "type": "textbox" },
                        { "id": 22035997, "nama": "si-2", "type": "textbox" },
                        { "id": 22035998, "nama": "s-2", "type": "textbox" },
                        { "id": 22035999, "nama": "m-2", "type": "textbox" },
                        { "id": 22036000, "nama": "p-3", "type": "textbox" },
                        { "id": 22036001, "nama": "si-3", "type": "textbox" },
                        { "id": 22036002, "nama": "s-3", "type": "textbox" },
                        { "id": 22036003, "nama": "m-3", "type": "textbox" },
                        { "id": 22036004, "nama": "p-4", "type": "textbox" },
                        { "id": 22036005, "nama": "si-4", "type": "textbox" },
                        { "id": 22036006, "nama": "s-4", "type": "textbox" },
                        { "id": 22036007, "nama": "m-4", "type": "textbox" },
                        { "id": 22036008, "nama": "p-5", "type": "textbox" },
                        { "id": 22036009, "nama": "si-5", "type": "textbox" },
                        { "id": 22036010, "nama": "s-5", "type": "textbox" },
                        { "id": 22036011, "nama": "m-5", "type": "textbox" },
                        { "id": 22036012, "nama": "p-6", "type": "textbox" },
                        { "id": 22036013, "nama": "si-6", "type": "textbox" },
                        { "id": 22036014, "nama": "s-6", "type": "textbox" },
                        { "id": 22036015, "nama": "m-6", "type": "textbox" },
                        { "id": 22036016, "nama": "p-7", "type": "textbox" },
                        { "id": 22036017, "nama": "si-7", "type": "textbox" },
                        { "id": 22036018, "nama": "s-7", "type": "textbox" },
                        { "id": 22036019, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22036020, "nama": "Obat-9",
                    "detail": [
                        { "id": 22036021, "nama": "p-1", "type": "textbox" },
                        { "id": 22036022, "nama": "si-1", "type": "textbox" },
                        { "id": 22036023, "nama": "s-1", "type": "textbox" },
                        { "id": 22036024, "nama": "m-1", "type": "textbox" },
                        { "id": 22036025, "nama": "p-2", "type": "textbox" },
                        { "id": 22036026, "nama": "si-2", "type": "textbox" },
                        { "id": 22036027, "nama": "s-2", "type": "textbox" },
                        { "id": 22036028, "nama": "m-2", "type": "textbox" },
                        { "id": 22036029, "nama": "p-3", "type": "textbox" },
                        { "id": 22036030, "nama": "si-3", "type": "textbox" },
                        { "id": 22036031, "nama": "s-3", "type": "textbox" },
                        { "id": 22036032, "nama": "m-3", "type": "textbox" },
                        { "id": 22036033, "nama": "p-4", "type": "textbox" },
                        { "id": 22036034, "nama": "si-4", "type": "textbox" },
                        { "id": 22036035, "nama": "s-4", "type": "textbox" },
                        { "id": 22036036, "nama": "m-4", "type": "textbox" },
                        { "id": 22036037, "nama": "p-5", "type": "textbox" },
                        { "id": 22036038, "nama": "si-5", "type": "textbox" },
                        { "id": 22036039, "nama": "s-5", "type": "textbox" },
                        { "id": 22036040, "nama": "m-5", "type": "textbox" },
                        { "id": 22036041, "nama": "p-6", "type": "textbox" },
                        { "id": 22036042, "nama": "si-6", "type": "textbox" },
                        { "id": 22036043, "nama": "s-6", "type": "textbox" },
                        { "id": 22036044, "nama": "m-6", "type": "textbox" },
                        { "id": 22036045, "nama": "p-7", "type": "textbox" },
                        { "id": 22036046, "nama": "si-7", "type": "textbox" },
                        { "id": 22036047, "nama": "s-7", "type": "textbox" },
                        { "id": 22036048, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22036049, "nama": "Obat-10",
                    "detail": [
                        { "id": 22036050, "nama": "p-1", "type": "textbox" },
                        { "id": 22036051, "nama": "si-1", "type": "textbox" },
                        { "id": 22036052, "nama": "s-1", "type": "textbox" },
                        { "id": 22036053, "nama": "m-1", "type": "textbox" },
                        { "id": 22036054, "nama": "p-2", "type": "textbox" },
                        { "id": 22036055, "nama": "si-2", "type": "textbox" },
                        { "id": 22036056, "nama": "s-2", "type": "textbox" },
                        { "id": 22036057, "nama": "m-2", "type": "textbox" },
                        { "id": 22036058, "nama": "p-3", "type": "textbox" },
                        { "id": 22036059, "nama": "si-3", "type": "textbox" },
                        { "id": 22036060, "nama": "s-3", "type": "textbox" },
                        { "id": 22036061, "nama": "m-3", "type": "textbox" },
                        { "id": 22036062, "nama": "p-4", "type": "textbox" },
                        { "id": 22036063, "nama": "si-4", "type": "textbox" },
                        { "id": 22036064, "nama": "s-4", "type": "textbox" },
                        { "id": 22036065, "nama": "m-4", "type": "textbox" },
                        { "id": 22036066, "nama": "p-5", "type": "textbox" },
                        { "id": 22036067, "nama": "si-5", "type": "textbox" },
                        { "id": 22036068, "nama": "s-5", "type": "textbox" },
                        { "id": 22036069, "nama": "m-5", "type": "textbox" },
                        { "id": 22036070, "nama": "p-6", "type": "textbox" },
                        { "id": 22036071, "nama": "si-6", "type": "textbox" },
                        { "id": 22036072, "nama": "s-6", "type": "textbox" },
                        { "id": 22036073, "nama": "m-6", "type": "textbox" },
                        { "id": 22036074, "nama": "p-7", "type": "textbox" },
                        { "id": 22036075, "nama": "si-7", "type": "textbox" },
                        { "id": 22036076, "nama": "s-7", "type": "textbox" },
                        { "id": 22036077, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22036078, "nama": "Obat-11",
                    "detail": [
                        { "id": 22036079, "nama": "p-1", "type": "textbox" },
                        { "id": 22036080, "nama": "si-1", "type": "textbox" },
                        { "id": 22036081, "nama": "s-1", "type": "textbox" },
                        { "id": 22036082, "nama": "m-1", "type": "textbox" },
                        { "id": 22036083, "nama": "p-2", "type": "textbox" },
                        { "id": 22036084, "nama": "si-2", "type": "textbox" },
                        { "id": 22036085, "nama": "s-2", "type": "textbox" },
                        { "id": 22036086, "nama": "m-2", "type": "textbox" },
                        { "id": 22036087, "nama": "p-3", "type": "textbox" },
                        { "id": 22036088, "nama": "si-3", "type": "textbox" },
                        { "id": 22036089, "nama": "s-3", "type": "textbox" },
                        { "id": 22036090, "nama": "m-3", "type": "textbox" },
                        { "id": 22036091, "nama": "p-4", "type": "textbox" },
                        { "id": 22036092, "nama": "si-4", "type": "textbox" },
                        { "id": 22036093, "nama": "s-4", "type": "textbox" },
                        { "id": 22036094, "nama": "m-4", "type": "textbox" },
                        { "id": 22036095, "nama": "p-5", "type": "textbox" },
                        { "id": 22036096, "nama": "si-5", "type": "textbox" },
                        { "id": 22036097, "nama": "s-5", "type": "textbox" },
                        { "id": 22036098, "nama": "m-5", "type": "textbox" },
                        { "id": 22036099, "nama": "p-6", "type": "textbox" },
                        { "id": 22036100, "nama": "si-6", "type": "textbox" },
                        { "id": 22036101, "nama": "s-6", "type": "textbox" },
                        { "id": 22036102, "nama": "m-6", "type": "textbox" },
                        { "id": 22036103, "nama": "p-7", "type": "textbox" },
                        { "id": 22036104, "nama": "si-7", "type": "textbox" },
                        { "id": 22036105, "nama": "s-7", "type": "textbox" },
                        { "id": 22036106, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22036107, "nama": "Obat-12",
                    "detail": [
                        { "id": 22036108, "nama": "p-1", "type": "textbox" },
                        { "id": 22036109, "nama": "si-1", "type": "textbox" },
                        { "id": 22036110, "nama": "s-1", "type": "textbox" },
                        { "id": 22036111, "nama": "m-1", "type": "textbox" },
                        { "id": 22036112, "nama": "p-2", "type": "textbox" },
                        { "id": 22036113, "nama": "si-2", "type": "textbox" },
                        { "id": 22036114, "nama": "s-2", "type": "textbox" },
                        { "id": 22036115, "nama": "m-2", "type": "textbox" },
                        { "id": 22036116, "nama": "p-3", "type": "textbox" },
                        { "id": 22036117, "nama": "si-3", "type": "textbox" },
                        { "id": 22036118, "nama": "s-3", "type": "textbox" },
                        { "id": 22036119, "nama": "m-3", "type": "textbox" },
                        { "id": 22036120, "nama": "p-4", "type": "textbox" },
                        { "id": 22036121, "nama": "si-4", "type": "textbox" },
                        { "id": 22036122, "nama": "s-4", "type": "textbox" },
                        { "id": 22036123, "nama": "m-4", "type": "textbox" },
                        { "id": 22036124, "nama": "p-5", "type": "textbox" },
                        { "id": 22036125, "nama": "si-5", "type": "textbox" },
                        { "id": 22036126, "nama": "s-5", "type": "textbox" },
                        { "id": 22036127, "nama": "m-5", "type": "textbox" },
                        { "id": 22036128, "nama": "p-6", "type": "textbox" },
                        { "id": 22036129, "nama": "si-6", "type": "textbox" },
                        { "id": 22036130, "nama": "s-6", "type": "textbox" },
                        { "id": 22036131, "nama": "m-6", "type": "textbox" },
                        { "id": 22036132, "nama": "p-7", "type": "textbox" },
                        { "id": 22036133, "nama": "si-7", "type": "textbox" },
                        { "id": 22036134, "nama": "s-7", "type": "textbox" },
                        { "id": 22036135, "nama": "m-7", "type": "textbox" },
                    ]
                }
            ]
            $scope.listSuhu = [
                { "id": 22035704, "nama": "p-1", "type": "textbox" },
                { "id": 22035705, "nama": "si-1", "type": "textbox" },
                { "id": 22035706, "nama": "s-1", "type": "textbox" },
                { "id": 22035707, "nama": "m-1", "type": "textbox" },
                { "id": 22035708, "nama": "p-2", "type": "textbox" },
                { "id": 22035709, "nama": "si-2", "type": "textbox" },
                { "id": 22035710, "nama": "s-2", "type": "textbox" },
                { "id": 22035711, "nama": "m-2", "type": "textbox" },
                { "id": 22035712, "nama": "p-3", "type": "textbox" },
                { "id": 22035713, "nama": "si-3", "type": "textbox" },
                { "id": 22035714, "nama": "s-3", "type": "textbox" },
                { "id": 22035715, "nama": "m-3", "type": "textbox" },
                { "id": 22035716, "nama": "p-4", "type": "textbox" },
                { "id": 22035717, "nama": "si-4", "type": "textbox" },
                { "id": 22035718, "nama": "s-4", "type": "textbox" },
                { "id": 22035719, "nama": "m-4", "type": "textbox" },
                { "id": 22035720, "nama": "p-5", "type": "textbox" },
                { "id": 22035721, "nama": "si-5", "type": "textbox" },
                { "id": 22035722, "nama": "s-5", "type": "textbox" },
                { "id": 22035723, "nama": "m-5", "type": "textbox" },
                { "id": 22035724, "nama": "p-6", "type": "textbox" },
                { "id": 22035725, "nama": "si-6", "type": "textbox" },
                { "id": 22035726, "nama": "s-6", "type": "textbox" },
                { "id": 22035727, "nama": "m-6", "type": "textbox" },
                { "id": 22035728, "nama": "p-7", "type": "textbox" },
                { "id": 22035729, "nama": "si-7", "type": "textbox" },
                { "id": 22035730, "nama": "s-7", "type": "textbox" },
                { "id": 22035731, "nama": "m-7", "type": "textbox" },
            ]
            $scope.listNadi = [
                { "id": 22035732, "nama": "p-1", "type": "textbox" },
                { "id": 22035733, "nama": "si-1", "type": "textbox" },
                { "id": 22035734, "nama": "s-1", "type": "textbox" },
                { "id": 22035735, "nama": "m-1", "type": "textbox" },
                { "id": 22035736, "nama": "p-2", "type": "textbox" },
                { "id": 22035737, "nama": "si-2", "type": "textbox" },
                { "id": 22035738, "nama": "s-2", "type": "textbox" },
                { "id": 22035739, "nama": "m-2", "type": "textbox" },
                { "id": 22035740, "nama": "p-3", "type": "textbox" },
                { "id": 22035741, "nama": "si-3", "type": "textbox" },
                { "id": 22035742, "nama": "s-3", "type": "textbox" },
                { "id": 22035743, "nama": "m-3", "type": "textbox" },
                { "id": 22035744, "nama": "p-4", "type": "textbox" },
                { "id": 22035745, "nama": "si-4", "type": "textbox" },
                { "id": 22035746, "nama": "s-4", "type": "textbox" },
                { "id": 22035747, "nama": "m-4", "type": "textbox" },
                { "id": 22035748, "nama": "p-5", "type": "textbox" },
                { "id": 22035749, "nama": "si-5", "type": "textbox" },
                { "id": 22035750, "nama": "s-5", "type": "textbox" },
                { "id": 22035751, "nama": "m-5", "type": "textbox" },
                { "id": 22035752, "nama": "p-6", "type": "textbox" },
                { "id": 22035753, "nama": "si-6", "type": "textbox" },
                { "id": 22035754, "nama": "s-6", "type": "textbox" },
                { "id": 22035755, "nama": "m-6", "type": "textbox" },
                { "id": 22035756, "nama": "p-7", "type": "textbox" },
                { "id": 22035757, "nama": "si-7", "type": "textbox" },
                { "id": 22035758, "nama": "s-7", "type": "textbox" },
                { "id": 22035759, "nama": "m-7", "type": "textbox" },
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
                    'Catatan Perinatologi' + ' dengan No EMR - ' + e.data.data.noemr + ' pada No Registrasi '
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