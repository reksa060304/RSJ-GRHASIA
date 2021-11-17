define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('CatatanPerinatologi2Ctrl', ['$q', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($q, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, medifirstService) {

            $scope.noCM = $state.params.noCM;
            $scope.tombolSimpanVis = true
            $scope.noRecPap = cacheHelper.get('noRecPap');
            $scope.totalSkor = 0
            $scope.totalSkor2 = 0
            $scope.cc = {}
            var nomorEMR = '-'
            $scope.cc.emrfk = 210225
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
                        { "id": 22036136, "nama": "h-1", "type": "datetime" },
                        { "id": 22036137, "nama": "h-2", "type": "datetime" },
                        { "id": 22036138, "nama": "h-3", "type": "datetime" },
                        { "id": 22036139, "nama": "h-4", "type": "datetime" },
                    ]
                },
                {
                    "id": 2, "nama": "Balance Cairan",
                    "detail": [
                        { "id": 22036143, "nama": "h-1", "type": "textbox" },
                        { "id": 22036144, "nama": "h-2", "type": "textbox" },
                        { "id": 22036145, "nama": "h-3", "type": "textbox" },
                        { "id": 22036146, "nama": "h-4", "type": "textbox" },
                    ]
                },
                {
                    "id": 3, "nama": "Bilirubin",
                    "detail": [
                        { "id": 22036150, "nama": "h-1", "type": "textbox" },
                        { "id": 22036151, "nama": "h-2", "type": "textbox" },
                        { "id": 22036152, "nama": "h-3", "type": "textbox" },
                        { "id": 22036153, "nama": "h-4", "type": "textbox" },
                    ]
                },
                {
                    "id": 4, "nama": "Minum",
                    "detail": [
                        { "id": 22036157, "nama": "h-1", "type": "textbox" },
                        { "id": 22036158, "nama": "h-2", "type": "textbox" },
                        { "id": 22036159, "nama": "h-3", "type": "textbox" },
                        { "id": 22036160, "nama": "h-4", "type": "textbox" },
                    ]
                },
                {
                    "id": 5, "nama": "Muntah",
                    "detail": [
                        { "id": 22036164, "nama": "h-1", "type": "textbox" },
                        { "id": 22036165, "nama": "h-2", "type": "textbox" },
                        { "id": 22036166, "nama": "h-3", "type": "textbox" },
                        { "id": 22036167, "nama": "h-4", "type": "textbox" },
                    ]
                },
                {
                    "id": 6, "nama": "Urine",
                    "detail": [
                        { "id": 22036171, "nama": "h-1", "type": "textbox" },
                        { "id": 22036172, "nama": "h-2", "type": "textbox" },
                        { "id": 22036173, "nama": "h-3", "type": "textbox" },
                        { "id": 22036174, "nama": "h-4", "type": "textbox" },
                    ]
                },
                {
                    "id": 7, "nama": "Defekasi",
                    "detail": [
                        { "id": 22036178, "nama": "h-1", "type": "textbox" },
                        { "id": 22036179, "nama": "h-2", "type": "textbox" },
                        { "id": 22036180, "nama": "h-3", "type": "textbox" },
                        { "id": 22036181, "nama": "h-4", "type": "textbox" },
                    ]
                },
                {
                    "id": 8, "nama": "Infus",
                    "detail": [
                        { "id": 22036185, "nama": "h-1", "type": "textbox" },
                        { "id": 22036186, "nama": "h-2", "type": "textbox" },
                        { "id": 22036187, "nama": "h-3", "type": "textbox" },
                        { "id": 22036188, "nama": "h-4", "type": "textbox" },
                    ]
                },
            ]
            $scope.listData = [
                {
                    "id": 1, "nama": "Pernafasan",
                    "detail": [
                        { "id": 22036192, "nama": "p-1", "type": "textbox" },
                        { "id": 22036193, "nama": "si-1", "type": "textbox" },
                        { "id": 22036194, "nama": "s-1", "type": "textbox" },
                        { "id": 22036195, "nama": "m-1", "type": "textbox" },
                        { "id": 22036196, "nama": "p-2", "type": "textbox" },
                        { "id": 22036197, "nama": "si-2", "type": "textbox" },
                        { "id": 22036198, "nama": "s-2", "type": "textbox" },
                        { "id": 22036199, "nama": "m-2", "type": "textbox" },
                        { "id": 22036200, "nama": "p-3", "type": "textbox" },
                        { "id": 22036201, "nama": "si-3", "type": "textbox" },
                        { "id": 22036202, "nama": "s-3", "type": "textbox" },
                        { "id": 22036203, "nama": "m-3", "type": "textbox" },
                        { "id": 22036204, "nama": "p-4", "type": "textbox" },
                        { "id": 22036205, "nama": "si-4", "type": "textbox" },
                        { "id": 22036206, "nama": "s-4", "type": "textbox" },
                        { "id": 22036207, "nama": "m-4", "type": "textbox" },
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
                        { "id": 22036220, "nama": "p-1", "type": "textbox" },
                        { "id": 22036221, "nama": "si-1", "type": "textbox" },
                        { "id": 22036222, "nama": "s-1", "type": "textbox" },
                        { "id": 22036223, "nama": "m-1", "type": "textbox" },
                        { "id": 22036224, "nama": "p-2", "type": "textbox" },
                        { "id": 22036225, "nama": "si-2", "type": "textbox" },
                        { "id": 22036226, "nama": "s-2", "type": "textbox" },
                        { "id": 22036227, "nama": "m-2", "type": "textbox" },
                        { "id": 22036228, "nama": "p-3", "type": "textbox" },
                        { "id": 22036229, "nama": "si-3", "type": "textbox" },
                        { "id": 22036230, "nama": "s-3", "type": "textbox" },
                        { "id": 22036231, "nama": "m-3", "type": "textbox" },
                        { "id": 22036232, "nama": "p-4", "type": "textbox" },
                        { "id": 22036233, "nama": "si-4", "type": "textbox" },
                        { "id": 22036234, "nama": "s-4", "type": "textbox" },
                        { "id": 22036235, "nama": "m-4", "type": "textbox" },
                    ]
                },
                {
                    "id": 4, "nama": "Nadi",
                    "detail": [
                        { "id": 22036248, "nama": "p-1", "type": "textbox" },
                        { "id": 22036249, "nama": "si-1", "type": "textbox" },
                        { "id": 22036250, "nama": "s-1", "type": "textbox" },
                        { "id": 22036251, "nama": "m-1", "type": "textbox" },
                        { "id": 22036252, "nama": "p-2", "type": "textbox" },
                        { "id": 22036253, "nama": "si-2", "type": "textbox" },
                        { "id": 22036254, "nama": "s-2", "type": "textbox" },
                        { "id": 22036255, "nama": "m-2", "type": "textbox" },
                        { "id": 22036256, "nama": "p-3", "type": "textbox" },
                        { "id": 22036257, "nama": "si-3", "type": "textbox" },
                        { "id": 22036258, "nama": "s-3", "type": "textbox" },
                        { "id": 22036259, "nama": "m-3", "type": "textbox" },
                        { "id": 22036260, "nama": "p-4", "type": "textbox" },
                        { "id": 22036261, "nama": "si-4", "type": "textbox" },
                        { "id": 22036262, "nama": "s-4", "type": "textbox" },
                        { "id": 22036263, "nama": "m-4", "type": "textbox" },
                    ]
                },
                {
                    "id": 4, "nama": "BB", "colspan": "4",
                    "detail": [
                        { "id": 22036276, "nama": "p-1", "type": "textbox", "satuan": "Gram" },
                        { "id": 22036277, "nama": "p-2", "type": "textbox", "satuan": "Gram" },
                        { "id": 22036278, "nama": "p-3", "type": "textbox", "satuan": "Gram" },
                        { "id": 22036279, "nama": "p-4", "type": "textbox", "satuan": "Gram" },
                    ]
                },
            ]
            $scope.listPerinatologi2 = [
                {
                    "id": 1, "nama": "Tgl / Bln", "style": "text-align: center;background-color: #dedfe2d3;",
                    "detail": [
                        { "id": 22036140, "nama": "h-5", "type": "datetime" },
                        { "id": 22036141, "nama": "h-6", "type": "datetime" },
                        { "id": 22036142, "nama": "h-7", "type": "datetime" },
                    ]
                },
                {
                    "id": 2, "nama": "Balance Cairan",
                    "detail": [
                        { "id": 22036147, "nama": "h-5", "type": "textbox" },
                        { "id": 22036148, "nama": "h-6", "type": "textbox" },
                        { "id": 22036149, "nama": "h-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 3, "nama": "Bilirubin",
                    "detail": [
                        { "id": 22036154, "nama": "h-5", "type": "textbox" },
                        { "id": 22036155, "nama": "h-6", "type": "textbox" },
                        { "id": 22036156, "nama": "h-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 4, "nama": "Minum",
                    "detail": [
                        { "id": 22036161, "nama": "h-5", "type": "textbox" },
                        { "id": 22036162, "nama": "h-6", "type": "textbox" },
                        { "id": 22036163, "nama": "h-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 5, "nama": "Muntah",
                    "detail": [
                        { "id": 22036168, "nama": "h-5", "type": "textbox" },
                        { "id": 22036169, "nama": "h-6", "type": "textbox" },
                        { "id": 22036170, "nama": "h-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 6, "nama": "Urine",
                    "detail": [
                        { "id": 22036175, "nama": "h-5", "type": "textbox" },
                        { "id": 22036176, "nama": "h-6", "type": "textbox" },
                        { "id": 22036177, "nama": "h-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 7, "nama": "Defekasi",
                    "detail": [
                        { "id": 22036182, "nama": "h-5", "type": "textbox" },
                        { "id": 22036183, "nama": "h-6", "type": "textbox" },
                        { "id": 22036184, "nama": "h-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 8, "nama": "Infus",
                    "detail": [
                        { "id": 22036189, "nama": "h-5", "type": "textbox" },
                        { "id": 22036190, "nama": "h-6", "type": "textbox" },
                        { "id": 22036191, "nama": "h-7", "type": "textbox" },
                    ]
                },
            ]
            $scope.listData2 = [
                {
                    "id": 1, "nama": "Pernafasan",
                    "detail": [
                        { "id": 22036208, "nama": "p-5", "type": "textbox" },
                        { "id": 22036209, "nama": "si-5", "type": "textbox" },
                        { "id": 22036210, "nama": "s-5", "type": "textbox" },
                        { "id": 22036211, "nama": "m-5", "type": "textbox" },
                        { "id": 22036212, "nama": "p-6", "type": "textbox" },
                        { "id": 22036213, "nama": "si-6", "type": "textbox" },
                        { "id": 22036214, "nama": "s-6", "type": "textbox" },
                        { "id": 22036215, "nama": "m-6", "type": "textbox" },
                        { "id": 22036216, "nama": "p-7", "type": "textbox" },
                        { "id": 22036217, "nama": "si-7", "type": "textbox" },
                        { "id": 22036218, "nama": "s-7", "type": "textbox" },
                        { "id": 22036219, "nama": "m-7", "type": "textbox" },
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
                        { "id": 22036236, "nama": "p-5", "type": "textbox" },
                        { "id": 22036237, "nama": "si-5", "type": "textbox" },
                        { "id": 22036238, "nama": "s-5", "type": "textbox" },
                        { "id": 22036239, "nama": "m-5", "type": "textbox" },
                        { "id": 22036240, "nama": "p-6", "type": "textbox" },
                        { "id": 22036241, "nama": "si-6", "type": "textbox" },
                        { "id": 22036242, "nama": "s-6", "type": "textbox" },
                        { "id": 22036243, "nama": "m-6", "type": "textbox" },
                        { "id": 22036244, "nama": "p-7", "type": "textbox" },
                        { "id": 22036245, "nama": "si-7", "type": "textbox" },
                        { "id": 22036246, "nama": "s-7", "type": "textbox" },
                        { "id": 22036247, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 4, "nama": "Nadi",
                    "detail": [
                        { "id": 22036264, "nama": "p-5", "type": "textbox" },
                        { "id": 22036265, "nama": "si-5", "type": "textbox" },
                        { "id": 22036266, "nama": "s-5", "type": "textbox" },
                        { "id": 22036267, "nama": "m-5", "type": "textbox" },
                        { "id": 22036268, "nama": "p-6", "type": "textbox" },
                        { "id": 22036269, "nama": "si-6", "type": "textbox" },
                        { "id": 22036270, "nama": "s-6", "type": "textbox" },
                        { "id": 22036271, "nama": "m-6", "type": "textbox" },
                        { "id": 22036272, "nama": "p-7", "type": "textbox" },
                        { "id": 22036273, "nama": "si-7", "type": "textbox" },
                        { "id": 22036274, "nama": "s-7", "type": "textbox" },
                        { "id": 22036275, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 4, "nama": "BB", "colspan": "4",
                    "detail": [
                        { "id": 22036280, "nama": "p-5", "type": "textbox", "satuan": "Gram" },
                        { "id": 22036281, "nama": "p-6", "type": "textbox", "satuan": "Gram" },
                        { "id": 22036282, "nama": "p-7", "type": "textbox", "satuan": "Gram" },
                    ]
                },
            ]
            $scope.listPengenal1 = [
                { "id": 22036283, "nama": "Tgl.Lahir", "type": "datetime", "satuan": "" },
                { "id": 22036284, "nama": "Jenis Kelamin", "type": "textbox", "satuan": "" },
                { "id": 22036285, "nama": "APGAR Score", "type": "textbox", "satuan": "" },
                { "id": 22036286, "nama": "BB Lahir", "type": "textbox", "satuan": "Gram" },
                { "id": 22036287, "nama": "Panjang", "type": "textbox", "satuan": "cm" },
                { "id": 22036288, "nama": "Lingkar Kepala", "type": "textbox", "satuan": "cm" },
                { "id": 22036289, "nama": "Suhu", "type": "textbox", "satuan": "C" },
            ]
            $scope.listPengenal2 = [
                { "id": 22036290, "nama": "Riwayat Persalinan : GPA", "type": "textbox", "satuan": "" },
                { "id": 22036291, "nama": "Kehamilan", "type": "textbox", "satuan": "" },
                { "id": 22036292, "nama": "Umur Ibu", "type": "textbox", "satuan": "" },
                { "id": 22036293, "nama": "HbsAg Ibu", "type": "textbox", "satuan": "" },
                { "id": 22036294, "nama": "Gol. Darah Ibu", "type": "textbox", "satuan": "" },
                { "id": 22036295, "nama": "Persalinan", "type": "textbox", "satuan": "" },
                { "id": 22036296, "nama": "Ketuban", "type": "textbox", "satuan": "" },
            ]
            $scope.listPengenal3 = [
                { "id": 22036297, "nama": "Resusitasi", "type": "textbox", "satuan": "" },
                { "id": 22036298, "nama": "Obat yang diberikan", "type": "textbox", "satuan": "" },
                { "id": 22036299, "nama": "Miksi", "type": "textbox", "satuan": "" },
                { "id": 22036300, "nama": "Meco", "type": "textbox", "satuan": "" },
                { "id": 22036301, "nama": "Anus", "type": "textbox", "satuan": "" },
                { "id": 22036302, "nama": "Mata", "type": "textbox", "satuan": "" },
                { "id": 22036303, "nama": "Hal-hal istimewa", "type": "textbox", "satuan": "" },
            ]
            $scope.listObat = [
                {
                    "id": 22036304, "nama": "Obat-1",
                    "detail": [
                        { "id": 22036305, "nama": "p-1", "type": "textbox" },
                        { "id": 22036306, "nama": "si-1", "type": "textbox" },
                        { "id": 22036307, "nama": "s-1", "type": "textbox" },
                        { "id": 22036308, "nama": "m-1", "type": "textbox" },
                        { "id": 22036309, "nama": "p-2", "type": "textbox" },
                        { "id": 22036310, "nama": "si-2", "type": "textbox" },
                        { "id": 22036311, "nama": "s-2", "type": "textbox" },
                        { "id": 22036312, "nama": "m-2", "type": "textbox" },
                        { "id": 22036313, "nama": "p-3", "type": "textbox" },
                        { "id": 22036314, "nama": "si-3", "type": "textbox" },
                        { "id": 22036315, "nama": "s-3", "type": "textbox" },
                        { "id": 22036316, "nama": "m-3", "type": "textbox" },
                        { "id": 22036317, "nama": "p-4", "type": "textbox" },
                        { "id": 22036318, "nama": "si-4", "type": "textbox" },
                        { "id": 22036319, "nama": "s-4", "type": "textbox" },
                        { "id": 22036320, "nama": "m-4", "type": "textbox" },
                        { "id": 22036321, "nama": "p-5", "type": "textbox" },
                        { "id": 22036322, "nama": "si-5", "type": "textbox" },
                        { "id": 22036323, "nama": "s-5", "type": "textbox" },
                        { "id": 22036324, "nama": "m-5", "type": "textbox" },
                        { "id": 22036325, "nama": "p-6", "type": "textbox" },
                        { "id": 22036326, "nama": "si-6", "type": "textbox" },
                        { "id": 22036327, "nama": "s-6", "type": "textbox" },
                        { "id": 22036328, "nama": "m-6", "type": "textbox" },
                        { "id": 22036329, "nama": "p-7", "type": "textbox" },
                        { "id": 22036330, "nama": "si-7", "type": "textbox" },
                        { "id": 22036331, "nama": "s-7", "type": "textbox" },
                        { "id": 22036332, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22036333, "nama": "Obat-2",
                    "detail": [
                        { "id": 22036334, "nama": "p-1", "type": "textbox" },
                        { "id": 22036335, "nama": "si-1", "type": "textbox" },
                        { "id": 22036336, "nama": "s-1", "type": "textbox" },
                        { "id": 22036337, "nama": "m-1", "type": "textbox" },
                        { "id": 22036338, "nama": "p-2", "type": "textbox" },
                        { "id": 22036339, "nama": "si-2", "type": "textbox" },
                        { "id": 22036340, "nama": "s-2", "type": "textbox" },
                        { "id": 22036341, "nama": "m-2", "type": "textbox" },
                        { "id": 22036342, "nama": "p-3", "type": "textbox" },
                        { "id": 22036343, "nama": "si-3", "type": "textbox" },
                        { "id": 22036344, "nama": "s-3", "type": "textbox" },
                        { "id": 22036345, "nama": "m-3", "type": "textbox" },
                        { "id": 22036346, "nama": "p-4", "type": "textbox" },
                        { "id": 22036347, "nama": "si-4", "type": "textbox" },
                        { "id": 22036348, "nama": "s-4", "type": "textbox" },
                        { "id": 22036349, "nama": "m-4", "type": "textbox" },
                        { "id": 22036350, "nama": "p-5", "type": "textbox" },
                        { "id": 22036351, "nama": "si-5", "type": "textbox" },
                        { "id": 22036352, "nama": "s-5", "type": "textbox" },
                        { "id": 22036353, "nama": "m-5", "type": "textbox" },
                        { "id": 22036354, "nama": "p-6", "type": "textbox" },
                        { "id": 22036355, "nama": "si-6", "type": "textbox" },
                        { "id": 22036356, "nama": "s-6", "type": "textbox" },
                        { "id": 22036357, "nama": "m-6", "type": "textbox" },
                        { "id": 22036358, "nama": "p-7", "type": "textbox" },
                        { "id": 22036359, "nama": "si-7", "type": "textbox" },
                        { "id": 22036360, "nama": "s-7", "type": "textbox" },
                        { "id": 22036361, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22036362, "nama": "Obat-3",
                    "detail": [
                        { "id": 22036363, "nama": "p-1", "type": "textbox" },
                        { "id": 22036364, "nama": "si-1", "type": "textbox" },
                        { "id": 22036365, "nama": "s-1", "type": "textbox" },
                        { "id": 22036366, "nama": "m-1", "type": "textbox" },
                        { "id": 22036367, "nama": "p-2", "type": "textbox" },
                        { "id": 22036368, "nama": "si-2", "type": "textbox" },
                        { "id": 22036369, "nama": "s-2", "type": "textbox" },
                        { "id": 22036370, "nama": "m-2", "type": "textbox" },
                        { "id": 22036371, "nama": "p-3", "type": "textbox" },
                        { "id": 22036372, "nama": "si-3", "type": "textbox" },
                        { "id": 22036373, "nama": "s-3", "type": "textbox" },
                        { "id": 22036374, "nama": "m-3", "type": "textbox" },
                        { "id": 22036375, "nama": "p-4", "type": "textbox" },
                        { "id": 22036376, "nama": "si-4", "type": "textbox" },
                        { "id": 22036377, "nama": "s-4", "type": "textbox" },
                        { "id": 22036378, "nama": "m-4", "type": "textbox" },
                        { "id": 22036379, "nama": "p-5", "type": "textbox" },
                        { "id": 22036380, "nama": "si-5", "type": "textbox" },
                        { "id": 22036381, "nama": "s-5", "type": "textbox" },
                        { "id": 22036382, "nama": "m-5", "type": "textbox" },
                        { "id": 22036383, "nama": "p-6", "type": "textbox" },
                        { "id": 22036384, "nama": "si-6", "type": "textbox" },
                        { "id": 22036385, "nama": "s-6", "type": "textbox" },
                        { "id": 22036386, "nama": "m-6", "type": "textbox" },
                        { "id": 22036387, "nama": "p-7", "type": "textbox" },
                        { "id": 22036388, "nama": "si-7", "type": "textbox" },
                        { "id": 22036389, "nama": "s-7", "type": "textbox" },
                        { "id": 22036390, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22036391, "nama": "Obat-4",
                    "detail": [
                        { "id": 22036392, "nama": "p-1", "type": "textbox" },
                        { "id": 22036393, "nama": "si-1", "type": "textbox" },
                        { "id": 22036394, "nama": "s-1", "type": "textbox" },
                        { "id": 22036395, "nama": "m-1", "type": "textbox" },
                        { "id": 22036396, "nama": "p-2", "type": "textbox" },
                        { "id": 22036397, "nama": "si-2", "type": "textbox" },
                        { "id": 22036398, "nama": "s-2", "type": "textbox" },
                        { "id": 22036399, "nama": "m-2", "type": "textbox" },
                        { "id": 22036400, "nama": "p-3", "type": "textbox" },
                        { "id": 22036401, "nama": "si-3", "type": "textbox" },
                        { "id": 22036402, "nama": "s-3", "type": "textbox" },
                        { "id": 22036403, "nama": "m-3", "type": "textbox" },
                        { "id": 22036404, "nama": "p-4", "type": "textbox" },
                        { "id": 22036405, "nama": "si-4", "type": "textbox" },
                        { "id": 22036406, "nama": "s-4", "type": "textbox" },
                        { "id": 22036407, "nama": "m-4", "type": "textbox" },
                        { "id": 22036408, "nama": "p-5", "type": "textbox" },
                        { "id": 22036409, "nama": "si-5", "type": "textbox" },
                        { "id": 22036410, "nama": "s-5", "type": "textbox" },
                        { "id": 22036411, "nama": "m-5", "type": "textbox" },
                        { "id": 22036412, "nama": "p-6", "type": "textbox" },
                        { "id": 22036413, "nama": "si-6", "type": "textbox" },
                        { "id": 22036414, "nama": "s-6", "type": "textbox" },
                        { "id": 22036415, "nama": "m-6", "type": "textbox" },
                        { "id": 22036416, "nama": "p-7", "type": "textbox" },
                        { "id": 22036417, "nama": "si-7", "type": "textbox" },
                        { "id": 22036418, "nama": "s-7", "type": "textbox" },
                        { "id": 22036419, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22036420, "nama": "Obat-5",
                    "detail": [
                        { "id": 22036421, "nama": "p-1", "type": "textbox" },
                        { "id": 22036422, "nama": "si-1", "type": "textbox" },
                        { "id": 22036423, "nama": "s-1", "type": "textbox" },
                        { "id": 22036424, "nama": "m-1", "type": "textbox" },
                        { "id": 22036425, "nama": "p-2", "type": "textbox" },
                        { "id": 22036426, "nama": "si-2", "type": "textbox" },
                        { "id": 22036427, "nama": "s-2", "type": "textbox" },
                        { "id": 22036428, "nama": "m-2", "type": "textbox" },
                        { "id": 22036429, "nama": "p-3", "type": "textbox" },
                        { "id": 22036430, "nama": "si-3", "type": "textbox" },
                        { "id": 22036431, "nama": "s-3", "type": "textbox" },
                        { "id": 22036432, "nama": "m-3", "type": "textbox" },
                        { "id": 22036433, "nama": "p-4", "type": "textbox" },
                        { "id": 22036434, "nama": "si-4", "type": "textbox" },
                        { "id": 22036435, "nama": "s-4", "type": "textbox" },
                        { "id": 22036436, "nama": "m-4", "type": "textbox" },
                        { "id": 22036437, "nama": "p-5", "type": "textbox" },
                        { "id": 22036438, "nama": "si-5", "type": "textbox" },
                        { "id": 22036439, "nama": "s-5", "type": "textbox" },
                        { "id": 22036440, "nama": "m-5", "type": "textbox" },
                        { "id": 22036441, "nama": "p-6", "type": "textbox" },
                        { "id": 22036442, "nama": "si-6", "type": "textbox" },
                        { "id": 22036443, "nama": "s-6", "type": "textbox" },
                        { "id": 22036444, "nama": "m-6", "type": "textbox" },
                        { "id": 22036445, "nama": "p-7", "type": "textbox" },
                        { "id": 22036446, "nama": "si-7", "type": "textbox" },
                        { "id": 22036447, "nama": "s-7", "type": "textbox" },
                        { "id": 22036448, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22036449, "nama": "Obat-6",
                    "detail": [
                        { "id": 22036450, "nama": "p-1", "type": "textbox" },
                        { "id": 22036451, "nama": "si-1", "type": "textbox" },
                        { "id": 22036452, "nama": "s-1", "type": "textbox" },
                        { "id": 22036453, "nama": "m-1", "type": "textbox" },
                        { "id": 22036454, "nama": "p-2", "type": "textbox" },
                        { "id": 22036455, "nama": "si-2", "type": "textbox" },
                        { "id": 22036456, "nama": "s-2", "type": "textbox" },
                        { "id": 22036457, "nama": "m-2", "type": "textbox" },
                        { "id": 22036458, "nama": "p-3", "type": "textbox" },
                        { "id": 22036459, "nama": "si-3", "type": "textbox" },
                        { "id": 22036460, "nama": "s-3", "type": "textbox" },
                        { "id": 22036461, "nama": "m-3", "type": "textbox" },
                        { "id": 22036462, "nama": "p-4", "type": "textbox" },
                        { "id": 22036463, "nama": "si-4", "type": "textbox" },
                        { "id": 22036464, "nama": "s-4", "type": "textbox" },
                        { "id": 22036465, "nama": "m-4", "type": "textbox" },
                        { "id": 22036466, "nama": "p-5", "type": "textbox" },
                        { "id": 22036467, "nama": "si-5", "type": "textbox" },
                        { "id": 22036468, "nama": "s-5", "type": "textbox" },
                        { "id": 22036469, "nama": "m-5", "type": "textbox" },
                        { "id": 22036470, "nama": "p-6", "type": "textbox" },
                        { "id": 22036471, "nama": "si-6", "type": "textbox" },
                        { "id": 22036472, "nama": "s-6", "type": "textbox" },
                        { "id": 22036473, "nama": "m-6", "type": "textbox" },
                        { "id": 22036474, "nama": "p-7", "type": "textbox" },
                        { "id": 22036475, "nama": "si-7", "type": "textbox" },
                        { "id": 22036476, "nama": "s-7", "type": "textbox" },
                        { "id": 22036477, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22036478, "nama": "Obat-7",
                    "detail": [
                        { "id": 22036479, "nama": "p-1", "type": "textbox" },
                        { "id": 22036480, "nama": "si-1", "type": "textbox" },
                        { "id": 22036481, "nama": "s-1", "type": "textbox" },
                        { "id": 22036482, "nama": "m-1", "type": "textbox" },
                        { "id": 22036483, "nama": "p-2", "type": "textbox" },
                        { "id": 22036484, "nama": "si-2", "type": "textbox" },
                        { "id": 22036485, "nama": "s-2", "type": "textbox" },
                        { "id": 22036486, "nama": "m-2", "type": "textbox" },
                        { "id": 22036487, "nama": "p-3", "type": "textbox" },
                        { "id": 22036488, "nama": "si-3", "type": "textbox" },
                        { "id": 22036489, "nama": "s-3", "type": "textbox" },
                        { "id": 22036490, "nama": "m-3", "type": "textbox" },
                        { "id": 22036491, "nama": "p-4", "type": "textbox" },
                        { "id": 22036492, "nama": "si-4", "type": "textbox" },
                        { "id": 22036493, "nama": "s-4", "type": "textbox" },
                        { "id": 22036494, "nama": "m-4", "type": "textbox" },
                        { "id": 22036495, "nama": "p-5", "type": "textbox" },
                        { "id": 22036496, "nama": "si-5", "type": "textbox" },
                        { "id": 22036497, "nama": "s-5", "type": "textbox" },
                        { "id": 22036498, "nama": "m-5", "type": "textbox" },
                        { "id": 22036499, "nama": "p-6", "type": "textbox" },
                        { "id": 22036500, "nama": "si-6", "type": "textbox" },
                        { "id": 22036501, "nama": "s-6", "type": "textbox" },
                        { "id": 22036502, "nama": "m-6", "type": "textbox" },
                        { "id": 22036503, "nama": "p-7", "type": "textbox" },
                        { "id": 22036504, "nama": "si-7", "type": "textbox" },
                        { "id": 22036505, "nama": "s-7", "type": "textbox" },
                        { "id": 22036506, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22036507, "nama": "Obat-8",
                    "detail": [
                        { "id": 22036508, "nama": "p-1", "type": "textbox" },
                        { "id": 22036509, "nama": "si-1", "type": "textbox" },
                        { "id": 22036510, "nama": "s-1", "type": "textbox" },
                        { "id": 22036511, "nama": "m-1", "type": "textbox" },
                        { "id": 22036512, "nama": "p-2", "type": "textbox" },
                        { "id": 22036513, "nama": "si-2", "type": "textbox" },
                        { "id": 22036514, "nama": "s-2", "type": "textbox" },
                        { "id": 22036515, "nama": "m-2", "type": "textbox" },
                        { "id": 22036516, "nama": "p-3", "type": "textbox" },
                        { "id": 22036517, "nama": "si-3", "type": "textbox" },
                        { "id": 22036518, "nama": "s-3", "type": "textbox" },
                        { "id": 22036519, "nama": "m-3", "type": "textbox" },
                        { "id": 22036520, "nama": "p-4", "type": "textbox" },
                        { "id": 22036521, "nama": "si-4", "type": "textbox" },
                        { "id": 22036522, "nama": "s-4", "type": "textbox" },
                        { "id": 22036523, "nama": "m-4", "type": "textbox" },
                        { "id": 22036524, "nama": "p-5", "type": "textbox" },
                        { "id": 22036525, "nama": "si-5", "type": "textbox" },
                        { "id": 22036526, "nama": "s-5", "type": "textbox" },
                        { "id": 22036527, "nama": "m-5", "type": "textbox" },
                        { "id": 22036528, "nama": "p-6", "type": "textbox" },
                        { "id": 22036529, "nama": "si-6", "type": "textbox" },
                        { "id": 22036530, "nama": "s-6", "type": "textbox" },
                        { "id": 22036531, "nama": "m-6", "type": "textbox" },
                        { "id": 22036532, "nama": "p-7", "type": "textbox" },
                        { "id": 22036533, "nama": "si-7", "type": "textbox" },
                        { "id": 22036534, "nama": "s-7", "type": "textbox" },
                        { "id": 22036535, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22036536, "nama": "Obat-9",
                    "detail": [
                        { "id": 22036537, "nama": "p-1", "type": "textbox" },
                        { "id": 22036538, "nama": "si-1", "type": "textbox" },
                        { "id": 22036539, "nama": "s-1", "type": "textbox" },
                        { "id": 22036540, "nama": "m-1", "type": "textbox" },
                        { "id": 22036541, "nama": "p-2", "type": "textbox" },
                        { "id": 22036542, "nama": "si-2", "type": "textbox" },
                        { "id": 22036543, "nama": "s-2", "type": "textbox" },
                        { "id": 22036544, "nama": "m-2", "type": "textbox" },
                        { "id": 22036545, "nama": "p-3", "type": "textbox" },
                        { "id": 22036546, "nama": "si-3", "type": "textbox" },
                        { "id": 22036547, "nama": "s-3", "type": "textbox" },
                        { "id": 22036548, "nama": "m-3", "type": "textbox" },
                        { "id": 22036549, "nama": "p-4", "type": "textbox" },
                        { "id": 22036550, "nama": "si-4", "type": "textbox" },
                        { "id": 22036551, "nama": "s-4", "type": "textbox" },
                        { "id": 22036552, "nama": "m-4", "type": "textbox" },
                        { "id": 22036553, "nama": "p-5", "type": "textbox" },
                        { "id": 22036554, "nama": "si-5", "type": "textbox" },
                        { "id": 22036555, "nama": "s-5", "type": "textbox" },
                        { "id": 22036556, "nama": "m-5", "type": "textbox" },
                        { "id": 22036557, "nama": "p-6", "type": "textbox" },
                        { "id": 22036558, "nama": "si-6", "type": "textbox" },
                        { "id": 22036559, "nama": "s-6", "type": "textbox" },
                        { "id": 22036560, "nama": "m-6", "type": "textbox" },
                        { "id": 22036561, "nama": "p-7", "type": "textbox" },
                        { "id": 22036562, "nama": "si-7", "type": "textbox" },
                        { "id": 22036563, "nama": "s-7", "type": "textbox" },
                        { "id": 22036564, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22036565, "nama": "Obat-10",
                    "detail": [
                        { "id": 22036566, "nama": "p-1", "type": "textbox" },
                        { "id": 22036567, "nama": "si-1", "type": "textbox" },
                        { "id": 22036568, "nama": "s-1", "type": "textbox" },
                        { "id": 22036569, "nama": "m-1", "type": "textbox" },
                        { "id": 22036570, "nama": "p-2", "type": "textbox" },
                        { "id": 22036571, "nama": "si-2", "type": "textbox" },
                        { "id": 22036572, "nama": "s-2", "type": "textbox" },
                        { "id": 22036573, "nama": "m-2", "type": "textbox" },
                        { "id": 22036574, "nama": "p-3", "type": "textbox" },
                        { "id": 22036575, "nama": "si-3", "type": "textbox" },
                        { "id": 22036576, "nama": "s-3", "type": "textbox" },
                        { "id": 22036577, "nama": "m-3", "type": "textbox" },
                        { "id": 22036578, "nama": "p-4", "type": "textbox" },
                        { "id": 22036579, "nama": "si-4", "type": "textbox" },
                        { "id": 22036580, "nama": "s-4", "type": "textbox" },
                        { "id": 22036581, "nama": "m-4", "type": "textbox" },
                        { "id": 22036582, "nama": "p-5", "type": "textbox" },
                        { "id": 22036583, "nama": "si-5", "type": "textbox" },
                        { "id": 22036584, "nama": "s-5", "type": "textbox" },
                        { "id": 22036585, "nama": "m-5", "type": "textbox" },
                        { "id": 22036586, "nama": "p-6", "type": "textbox" },
                        { "id": 22036587, "nama": "si-6", "type": "textbox" },
                        { "id": 22036588, "nama": "s-6", "type": "textbox" },
                        { "id": 22036589, "nama": "m-6", "type": "textbox" },
                        { "id": 22036590, "nama": "p-7", "type": "textbox" },
                        { "id": 22036591, "nama": "si-7", "type": "textbox" },
                        { "id": 22036592, "nama": "s-7", "type": "textbox" },
                        { "id": 22036593, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22036594, "nama": "Obat-11",
                    "detail": [
                        { "id": 22036595, "nama": "p-1", "type": "textbox" },
                        { "id": 22036596, "nama": "si-1", "type": "textbox" },
                        { "id": 22036597, "nama": "s-1", "type": "textbox" },
                        { "id": 22036598, "nama": "m-1", "type": "textbox" },
                        { "id": 22036599, "nama": "p-2", "type": "textbox" },
                        { "id": 22036600, "nama": "si-2", "type": "textbox" },
                        { "id": 22036601, "nama": "s-2", "type": "textbox" },
                        { "id": 22036602, "nama": "m-2", "type": "textbox" },
                        { "id": 22036603, "nama": "p-3", "type": "textbox" },
                        { "id": 22036604, "nama": "si-3", "type": "textbox" },
                        { "id": 22036605, "nama": "s-3", "type": "textbox" },
                        { "id": 22036606, "nama": "m-3", "type": "textbox" },
                        { "id": 22036607, "nama": "p-4", "type": "textbox" },
                        { "id": 22036608, "nama": "si-4", "type": "textbox" },
                        { "id": 22036609, "nama": "s-4", "type": "textbox" },
                        { "id": 22036610, "nama": "m-4", "type": "textbox" },
                        { "id": 22036611, "nama": "p-5", "type": "textbox" },
                        { "id": 22036612, "nama": "si-5", "type": "textbox" },
                        { "id": 22036613, "nama": "s-5", "type": "textbox" },
                        { "id": 22036614, "nama": "m-5", "type": "textbox" },
                        { "id": 22036615, "nama": "p-6", "type": "textbox" },
                        { "id": 22036616, "nama": "si-6", "type": "textbox" },
                        { "id": 22036617, "nama": "s-6", "type": "textbox" },
                        { "id": 22036618, "nama": "m-6", "type": "textbox" },
                        { "id": 22036619, "nama": "p-7", "type": "textbox" },
                        { "id": 22036620, "nama": "si-7", "type": "textbox" },
                        { "id": 22036621, "nama": "s-7", "type": "textbox" },
                        { "id": 22036622, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22036623, "nama": "Obat-12",
                    "detail": [
                        { "id": 22036624, "nama": "p-1", "type": "textbox" },
                        { "id": 22036625, "nama": "si-1", "type": "textbox" },
                        { "id": 22036626, "nama": "s-1", "type": "textbox" },
                        { "id": 22036627, "nama": "m-1", "type": "textbox" },
                        { "id": 22036628, "nama": "p-2", "type": "textbox" },
                        { "id": 22036629, "nama": "si-2", "type": "textbox" },
                        { "id": 22036630, "nama": "s-2", "type": "textbox" },
                        { "id": 22036631, "nama": "m-2", "type": "textbox" },
                        { "id": 22036632, "nama": "p-3", "type": "textbox" },
                        { "id": 22036633, "nama": "si-3", "type": "textbox" },
                        { "id": 22036634, "nama": "s-3", "type": "textbox" },
                        { "id": 22036635, "nama": "m-3", "type": "textbox" },
                        { "id": 22036636, "nama": "p-4", "type": "textbox" },
                        { "id": 22036637, "nama": "si-4", "type": "textbox" },
                        { "id": 22036638, "nama": "s-4", "type": "textbox" },
                        { "id": 22036639, "nama": "m-4", "type": "textbox" },
                        { "id": 22036640, "nama": "p-5", "type": "textbox" },
                        { "id": 22036641, "nama": "si-5", "type": "textbox" },
                        { "id": 22036642, "nama": "s-5", "type": "textbox" },
                        { "id": 22036643, "nama": "m-5", "type": "textbox" },
                        { "id": 22036644, "nama": "p-6", "type": "textbox" },
                        { "id": 22036645, "nama": "si-6", "type": "textbox" },
                        { "id": 22036646, "nama": "s-6", "type": "textbox" },
                        { "id": 22036647, "nama": "m-6", "type": "textbox" },
                        { "id": 22036648, "nama": "p-7", "type": "textbox" },
                        { "id": 22036649, "nama": "si-7", "type": "textbox" },
                        { "id": 22036650, "nama": "s-7", "type": "textbox" },
                        { "id": 22036651, "nama": "m-7", "type": "textbox" },
                    ]
                }
            ]
            $scope.listSuhu = [
                { "id": 22036220, "nama": "p-1", "type": "textbox" },
                { "id": 22036221, "nama": "si-1", "type": "textbox" },
                { "id": 22036222, "nama": "s-1", "type": "textbox" },
                { "id": 22036223, "nama": "m-1", "type": "textbox" },
                { "id": 22036224, "nama": "p-2", "type": "textbox" },
                { "id": 22036225, "nama": "si-2", "type": "textbox" },
                { "id": 22036226, "nama": "s-2", "type": "textbox" },
                { "id": 22036227, "nama": "m-2", "type": "textbox" },
                { "id": 22036228, "nama": "p-3", "type": "textbox" },
                { "id": 22036229, "nama": "si-3", "type": "textbox" },
                { "id": 22036230, "nama": "s-3", "type": "textbox" },
                { "id": 22036231, "nama": "m-3", "type": "textbox" },
                { "id": 22036232, "nama": "p-4", "type": "textbox" },
                { "id": 22036233, "nama": "si-4", "type": "textbox" },
                { "id": 22036234, "nama": "s-4", "type": "textbox" },
                { "id": 22036235, "nama": "m-4", "type": "textbox" },
                { "id": 22036236, "nama": "p-5", "type": "textbox" },
                { "id": 22036237, "nama": "si-5", "type": "textbox" },
                { "id": 22036238, "nama": "s-5", "type": "textbox" },
                { "id": 22036239, "nama": "m-5", "type": "textbox" },
                { "id": 22036240, "nama": "p-6", "type": "textbox" },
                { "id": 22036241, "nama": "si-6", "type": "textbox" },
                { "id": 22036242, "nama": "s-6", "type": "textbox" },
                { "id": 22036243, "nama": "m-6", "type": "textbox" },
                { "id": 22036244, "nama": "p-7", "type": "textbox" },
                { "id": 22036245, "nama": "si-7", "type": "textbox" },
                { "id": 22036246, "nama": "s-7", "type": "textbox" },
                { "id": 22036247, "nama": "m-7", "type": "textbox" },
            ]
            $scope.listNadi = [
                { "id": 22036248, "nama": "p-1", "type": "textbox" },
                { "id": 22036249, "nama": "si-1", "type": "textbox" },
                { "id": 22036250, "nama": "s-1", "type": "textbox" },
                { "id": 22036251, "nama": "m-1", "type": "textbox" },
                { "id": 22036252, "nama": "p-2", "type": "textbox" },
                { "id": 22036253, "nama": "si-2", "type": "textbox" },
                { "id": 22036254, "nama": "s-2", "type": "textbox" },
                { "id": 22036255, "nama": "m-2", "type": "textbox" },
                { "id": 22036256, "nama": "p-3", "type": "textbox" },
                { "id": 22036257, "nama": "si-3", "type": "textbox" },
                { "id": 22036258, "nama": "s-3", "type": "textbox" },
                { "id": 22036259, "nama": "m-3", "type": "textbox" },
                { "id": 22036260, "nama": "p-4", "type": "textbox" },
                { "id": 22036261, "nama": "si-4", "type": "textbox" },
                { "id": 22036262, "nama": "s-4", "type": "textbox" },
                { "id": 22036263, "nama": "m-4", "type": "textbox" },
                { "id": 22036264, "nama": "p-5", "type": "textbox" },
                { "id": 22036265, "nama": "si-5", "type": "textbox" },
                { "id": 22036266, "nama": "s-5", "type": "textbox" },
                { "id": 22036267, "nama": "m-5", "type": "textbox" },
                { "id": 22036268, "nama": "p-6", "type": "textbox" },
                { "id": 22036269, "nama": "si-6", "type": "textbox" },
                { "id": 22036270, "nama": "s-6", "type": "textbox" },
                { "id": 22036271, "nama": "m-6", "type": "textbox" },
                { "id": 22036272, "nama": "p-7", "type": "textbox" },
                { "id": 22036273, "nama": "si-7", "type": "textbox" },
                { "id": 22036274, "nama": "s-7", "type": "textbox" },
                { "id": 22036275, "nama": "m-7", "type": "textbox" },
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
                    'Catatan Perinatologi 2 ' + ' dengan No EMR - ' +e.data.data.noemr +  ' pada No Registrasi ' 
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