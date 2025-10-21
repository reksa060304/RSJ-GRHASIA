define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('TerapiHarianPasienRawatInapCtrl', ['$q', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($q, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, medifirstService) {
            var paramsIndex = $state.params.index ? parseInt($state.params.index) : null;
            console.log($state.params.index);
            var isNotClick = true;

            $scope.myVar = true
            $scope.noCM = $state.params.noCM;
            $scope.tombolSimpanVis = true
            $scope.noRecPap = cacheHelper.get('noRecPap');
            $scope.totalSkor = 0
            $scope.totalSkor2 = 0
            $scope.cc = {}
            var nomorEMR = '-'
            $scope.cc.emrfk = 3000443
            $scope.now = new Date()
            var dataLoad = []
            $scope.listTanggal = []
            $scope.listTanggal2 = []
            $scope.listData1 = []
            $scope.listData2 = []
            $scope.listData3 = []
            $scope.listData4 = []
            $scope.listData5 = []
            $scope.listData6 = []
            $scope.listData7 = []
            $scope.listData8 = []
            $scope.listData9 = []
            $scope.listDataObatTopikal1 = []
            $scope.listDataObatTopikal2 = []
            $scope.listDataInhalasi1 = []
            $scope.listDataInhalasi2 = []
            $scope.listDataInhalasi3 = []
            $scope.listDataInhalasi4 = []
            var chacePeriode = cacheHelper.get('cacheRekamMedis');
            
            $scope.norec_pd = chacePeriode[8]
            // $scope.listSkor = []
            $scope.loading = true
            if(medifirstService.getKelompokUser() == 'mahasiswadiklat'){
                $scope.tombolSimpanVis = false
            }
            medifirstService.get('emr/get-riwayat-obat-pasien?norec_pd=' + $scope.norec_pd).then(function (data) {
                $scope.listObat = data
            })
            medifirstService.getPart('emr/get-datacombo-part-pegawai', true, true, 20).then(function (data) {
                $scope.listPegawai = data
            })
            medifirstService.getPart('emr/get-datacombo-part-ruangan', true, true, 20).then(function (data) {
                $scope.listRuangan = data
            })
            medifirstService.getPart('emr/get-datacombo-part-diagnosa', true, true, 20).then(function (data) {
                $scope.listDiagnosa = data
            })
            medifirstService.get("emr/get-rekam-medis-dynamic?emrid=" + 3000443).then(function (e) {

                e.data = 
                    {
                        "kolom1": [],
                        "kolom2": [],
                        "kolom3": [],
                        "kolom4": [
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "tanggal",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "datetime",
                                "nourut": 1,
                                "satuan": null,
                                "id": 1300002,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "tanggal",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "datetime",
                                "nourut": 2,
                                "satuan": null,
                                "id": 1300003,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "tanggal",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "datetime",
                                "nourut": 3,
                                "satuan": null,
                                "id": 1300004,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "tanggal",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "datetime",
                                "nourut": 4,
                                "satuan": null,
                                "id": 1300005,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata1",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "combobox",
                                "nourut": 5,
                                "satuan": null,
                                "id": 1300006,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata1",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 6,
                                "satuan": null,
                                "id": 1300007,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata1",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 7,
                                "satuan": "H",
                                "id": 1300008,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata1",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 8,
                                "satuan": null,
                                "id": 1300009,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata1",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 9,
                                "satuan": null,
                                "id": 1300010,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata1",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 10,
                                "satuan": null,
                                "id": 1300011,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata1",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 11,
                                "satuan": null,
                                "id": 1300012,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata1",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 12,
                                "satuan": null,
                                "id": 1300013,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata1",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 13,
                                "satuan": null,
                                "id": 1300014,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata1",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 14,
                                "satuan": null,
                                "id": 1300015,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata1",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 15,
                                "satuan": null,
                                "id": 1300016,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata1",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 16,
                                "satuan": null,
                                "id": 1300017,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata1",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 17,
                                "satuan": null,
                                "id": 1300018,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata1",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 18,
                                "satuan": null,
                                "id": 1300019,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata1",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 19,
                                "satuan": null,
                                "id": 1300020,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata1",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 20,
                                "satuan": null,
                                "id": 1300021,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata1",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 21,
                                "satuan": null,
                                "id": 1300022,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata1",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 22,
                                "satuan": null,
                                "id": 1300023,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata1",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 22,
                                "satuan": null,
                                "id": 1300501,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata1",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 24,
                                "satuan": null,
                                "id": 1300502,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata2",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "combobox",
                                "nourut": 23,
                                "satuan": null,
                                "id": 1300024,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata2",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 24,
                                "satuan": null,
                                "id": 1300025,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata2",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 25,
                                "satuan": "H",
                                "id": 1300026,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata2",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 26,
                                "satuan": null,
                                "id": 1300027,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata2",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 27,
                                "satuan": null,
                                "id": 1300028,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata2",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 28,
                                "satuan": null,
                                "id": 1300029,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata2",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 29,
                                "satuan": null,
                                "id": 1300030,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata2",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 30,
                                "satuan": null,
                                "id": 1300031,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata2",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 31,
                                "satuan": null,
                                "id": 1300032,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata2",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 32,
                                "satuan": null,
                                "id": 1300033,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata2",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 33,
                                "satuan": null,
                                "id": 1300034,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata2",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 34,
                                "satuan": null,
                                "id": 1300035,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata2",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 35,
                                "satuan": null,
                                "id": 1300036,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata2",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 36,
                                "satuan": null,
                                "id": 1300037,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata2",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 37,
                                "satuan": null,
                                "id": 1300038,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata2",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 38,
                                "satuan": null,
                                "id": 1300039,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata2",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 39,
                                "satuan": null,
                                "id": 1300040,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata2",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 40,
                                "satuan": null,
                                "id": 1300041,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata2",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 22,
                                "satuan": null,
                                "id": 1300503,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata2",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 24,
                                "satuan": null,
                                "id": 1300504,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata3",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "combobox",
                                "nourut": 41,
                                "satuan": null,
                                "id": 1300042,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata3",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 42,
                                "satuan": null,
                                "id": 1300043,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata3",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 43,
                                "satuan": "H",
                                "id": 1300044,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata3",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 44,
                                "satuan": null,
                                "id": 1300045,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata3",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 45,
                                "satuan": null,
                                "id": 1300046,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata3",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 46,
                                "satuan": null,
                                "id": 1300047,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata3",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 47,
                                "satuan": null,
                                "id": 1300048,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata3",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 48,
                                "satuan": null,
                                "id": 1300049,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata3",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 49,
                                "satuan": null,
                                "id": 1300050,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata3",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 50,
                                "satuan": null,
                                "id": 1300051,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata3",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 51,
                                "satuan": null,
                                "id": 1300052,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata3",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 52,
                                "satuan": null,
                                "id": 1300053,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata3",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 53,
                                "satuan": null,
                                "id": 1300054,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata3",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 54,
                                "satuan": null,
                                "id": 1300055,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata3",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 55,
                                "satuan": null,
                                "id": 1300056,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata3",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 56,
                                "satuan": null,
                                "id": 1300057,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata3",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 57,
                                "satuan": null,
                                "id": 1300058,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata3",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 58,
                                "satuan": null,
                                "id": 1300059,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata3",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 22,
                                "satuan": null,
                                "id": 1300505,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata3",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 24,
                                "satuan": null,
                                "id": 1300506,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata4",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "combobox",
                                "nourut": 59,
                                "satuan": null,
                                "id": 1300060,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata4",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 60,
                                "satuan": null,
                                "id": 1300061,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata4",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 61,
                                "satuan": "H",
                                "id": 1300062,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata4",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 62,
                                "satuan": null,
                                "id": 1300063,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata4",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 63,
                                "satuan": null,
                                "id": 1300064,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata4",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 64,
                                "satuan": null,
                                "id": 1300065,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata4",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 65,
                                "satuan": null,
                                "id": 1300066,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata4",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 66,
                                "satuan": null,
                                "id": 1300067,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata4",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 67,
                                "satuan": null,
                                "id": 1300068,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata4",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 68,
                                "satuan": null,
                                "id": 1300069,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata4",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 69,
                                "satuan": null,
                                "id": 1300070,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata4",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 70,
                                "satuan": null,
                                "id": 1300071,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata4",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 71,
                                "satuan": null,
                                "id": 1300072,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata4",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 72,
                                "satuan": null,
                                "id": 1300073,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata4",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 73,
                                "satuan": null,
                                "id": 1300074,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata4",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 74,
                                "satuan": null,
                                "id": 1300075,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata4",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 75,
                                "satuan": null,
                                "id": 1300076,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata4",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 76,
                                "satuan": null,
                                "id": 1300077,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata4",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 22,
                                "satuan": null,
                                "id": 1300507,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata4",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 24,
                                "satuan": null,
                                "id": 1300508,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata5",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "combobox",
                                "nourut": 77,
                                "satuan": null,
                                "id": 1300078,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata5",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 78,
                                "satuan": null,
                                "id": 1300079,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata5",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 79,
                                "satuan": "H",
                                "id": 1300080,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata5",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 80,
                                "satuan": null,
                                "id": 1300081,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata5",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 81,
                                "satuan": null,
                                "id": 1300082,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata5",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 82,
                                "satuan": null,
                                "id": 1300083,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata5",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 83,
                                "satuan": null,
                                "id": 1300084,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata5",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 84,
                                "satuan": null,
                                "id": 1300085,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata5",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 85,
                                "satuan": null,
                                "id": 1300086,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata5",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 86,
                                "satuan": null,
                                "id": 1300087,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata5",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 87,
                                "satuan": null,
                                "id": 1300088,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata5",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 88,
                                "satuan": null,
                                "id": 1300089,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata5",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 89,
                                "satuan": null,
                                "id": 1300090,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata5",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 90,
                                "satuan": null,
                                "id": 1300091,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata5",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 91,
                                "satuan": null,
                                "id": 1300092,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata5",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 92,
                                "satuan": null,
                                "id": 1300093,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata5",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 93,
                                "satuan": null,
                                "id": 1300094,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata5",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 94,
                                "satuan": null,
                                "id": 1300095,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata5",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 22,
                                "satuan": null,
                                "id": 1300509,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata5",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 24,
                                "satuan": null,
                                "id": 1300510,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata6",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "combobox",
                                "nourut": 95,
                                "satuan": null,
                                "id": 1300096,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata6",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 96,
                                "satuan": null,
                                "id": 1300097,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata6",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 97,
                                "satuan": "H",
                                "id": 1300098,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata6",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 98,
                                "satuan": null,
                                "id": 1300099,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata6",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 99,
                                "satuan": null,
                                "id": 1300100,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata6",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 100,
                                "satuan": null,
                                "id": 1300101,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata6",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 101,
                                "satuan": null,
                                "id": 1300102,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata6",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 102,
                                "satuan": null,
                                "id": 1300103,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata6",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 103,
                                "satuan": null,
                                "id": 1300104,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata6",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 104,
                                "satuan": null,
                                "id": 1300105,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata6",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 105,
                                "satuan": null,
                                "id": 1300106,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata6",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 106,
                                "satuan": null,
                                "id": 1300107,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata6",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 107,
                                "satuan": null,
                                "id": 1300108,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata6",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 108,
                                "satuan": null,
                                "id": 1300109,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata6",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 109,
                                "satuan": null,
                                "id": 1300110,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata6",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 110,
                                "satuan": null,
                                "id": 1300111,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata6",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 111,
                                "satuan": null,
                                "id": 1300112,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata6",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 112,
                                "satuan": null,
                                "id": 1300113,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata6",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 22,
                                "satuan": null,
                                "id": 1300511,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata6",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 24,
                                "satuan": null,
                                "id": 1300512,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata7",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "combobox",
                                "nourut": 113,
                                "satuan": null,
                                "id": 1300114,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata7",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 114,
                                "satuan": null,
                                "id": 1300115,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata7",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 115,
                                "satuan": "H",
                                "id": 1300116,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata7",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 116,
                                "satuan": null,
                                "id": 1300117,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata7",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 117,
                                "satuan": null,
                                "id": 1300118,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata7",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 118,
                                "satuan": null,
                                "id": 1300119,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata7",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 119,
                                "satuan": null,
                                "id": 1300120,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata7",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 120,
                                "satuan": null,
                                "id": 1300121,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata7",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 121,
                                "satuan": null,
                                "id": 1300122,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata7",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 122,
                                "satuan": null,
                                "id": 1300123,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata7",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 123,
                                "satuan": null,
                                "id": 1300124,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata7",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 124,
                                "satuan": null,
                                "id": 1300125,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata7",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 125,
                                "satuan": null,
                                "id": 1300126,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata7",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 126,
                                "satuan": null,
                                "id": 1300127,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata7",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 127,
                                "satuan": null,
                                "id": 1300128,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata7",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 128,
                                "satuan": null,
                                "id": 1300129,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata7",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 129,
                                "satuan": null,
                                "id": 1300130,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata7",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 130,
                                "satuan": null,
                                "id": 1300131,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata7",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 22,
                                "satuan": null,
                                "id": 1300513,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata7",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 24,
                                "satuan": null,
                                "id": 1300514,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata8",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "combobox",
                                "nourut": 131,
                                "satuan": null,
                                "id": 1300132,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata8",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 132,
                                "satuan": null,
                                "id": 1300133,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata8",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 133,
                                "satuan": "H",
                                "id": 1300134,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata8",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 134,
                                "satuan": null,
                                "id": 1300135,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata8",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 135,
                                "satuan": null,
                                "id": 1300136,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata8",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 136,
                                "satuan": null,
                                "id": 1300137,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata8",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 137,
                                "satuan": null,
                                "id": 1300138,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata8",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 138,
                                "satuan": null,
                                "id": 1300139,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata8",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 139,
                                "satuan": null,
                                "id": 1300140,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata8",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 140,
                                "satuan": null,
                                "id": 1300141,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata8",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 141,
                                "satuan": null,
                                "id": 1300142,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata8",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 142,
                                "satuan": null,
                                "id": 1300143,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata8",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 143,
                                "satuan": null,
                                "id": 1300144,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata8",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 144,
                                "satuan": null,
                                "id": 1300145,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata8",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 145,
                                "satuan": null,
                                "id": 1300146,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata8",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 146,
                                "satuan": null,
                                "id": 1300147,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata8",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 147,
                                "satuan": null,
                                "id": 1300148,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata8",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 148,
                                "satuan": null,
                                "id": 1300149,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata8",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 22,
                                "satuan": null,
                                "id": 1300515,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata8",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 24,
                                "satuan": null,
                                "id": 1300516,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata9",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 149,
                                "satuan": null,
                                "id": 1300150,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata9",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 150,
                                "satuan": null,
                                "id": 1300151,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata9",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 151,
                                "satuan": null,
                                "id": 1300152,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata9",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 152,
                                "satuan": null,
                                "id": 1300153,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata9",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 153,
                                "satuan": null,
                                "id": 1300154,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata9",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 154,
                                "satuan": null,
                                "id": 1300155,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata9",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 155,
                                "satuan": null,
                                "id": 1300156,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata9",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 156,
                                "satuan": null,
                                "id": 1300157,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata9",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 157,
                                "satuan": null,
                                "id": 1300158,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata9",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 158,
                                "satuan": null,
                                "id": 1300159,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata9",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 159,
                                "satuan": null,
                                "id": 1300160,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata9",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 160,
                                "satuan": null,
                                "id": 1300161,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata9",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 161,
                                "satuan": null,
                                "id": 1300162,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata9",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 162,
                                "satuan": null,
                                "id": 1300163,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata9",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 163,
                                "satuan": null,
                                "id": 1300164,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata9",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 164,
                                "satuan": null,
                                "id": 1309965,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata9",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 164,
                                "satuan": null,
                                "id": 1309966,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdata9",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 164,
                                "satuan": null,
                                "id": 1300165,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataobattopikal1",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "combobox",
                                "nourut": 165,
                                "satuan": null,
                                "id": 1300166,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataobattopikal1",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 166,
                                "satuan": null,
                                "id": 1300167,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataobattopikal1",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 167,
                                "satuan": "H",
                                "id": 1300168,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataobattopikal1",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 168,
                                "satuan": null,
                                "id": 1300169,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataobattopikal1",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 169,
                                "satuan": null,
                                "id": 1300170,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataobattopikal1",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 170,
                                "satuan": null,
                                "id": 1300171,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataobattopikal1",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 171,
                                "satuan": null,
                                "id": 1300172,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataobattopikal1",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 172,
                                "satuan": null,
                                "id": 1300173,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataobattopikal1",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 173,
                                "satuan": null,
                                "id": 1300174,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataobattopikal1",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 174,
                                "satuan": null,
                                "id": 1300175,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataobattopikal1",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 175,
                                "satuan": null,
                                "id": 1300176,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataobattopikal1",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 176,
                                "satuan": null,
                                "id": 1300177,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataobattopikal1",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 177,
                                "satuan": null,
                                "id": 1300178,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataobattopikal1",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 178,
                                "satuan": null,
                                "id": 1300179,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataobattopikal1",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 179,
                                "satuan": null,
                                "id": 1300180,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataobattopikal1",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 180,
                                "satuan": null,
                                "id": 1300181,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataobattopikal1",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 181,
                                "satuan": null,
                                "id": 1300182,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataobattopikal1",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 182,
                                "satuan": null,
                                "id": 1300183,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataobattopikal1",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 22,
                                "satuan": null,
                                "id": 13006001,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataobattopikal1",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 24,
                                "satuan": null,
                                "id": 13006002,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataobattopikal2",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 183,
                                "satuan": null,
                                "id": 1300184,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataobattopikal2",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 184,
                                "satuan": null,
                                "id": 1300185,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataobattopikal2",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 185,
                                "satuan": null,
                                "id": 1300186,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataobattopikal2",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 186,
                                "satuan": null,
                                "id": 1300187,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataobattopikal2",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 187,
                                "satuan": null,
                                "id": 1300188,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataobattopikal2",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 188,
                                "satuan": null,
                                "id": 1300189,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataobattopikal2",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 189,
                                "satuan": null,
                                "id": 1300190,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataobattopikal2",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 190,
                                "satuan": null,
                                "id": 1300191,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataobattopikal2",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 191,
                                "satuan": null,
                                "id": 1300192,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataobattopikal2",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 192,
                                "satuan": null,
                                "id": 1300193,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataobattopikal2",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 193,
                                "satuan": null,
                                "id": 1300194,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataobattopikal2",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 194,
                                "satuan": null,
                                "id": 1300195,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataobattopikal2",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 195,
                                "satuan": null,
                                "id": 1300196,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataobattopikal2",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 196,
                                "satuan": null,
                                "id": 1300197,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataobattopikal2",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 197,
                                "satuan": null,
                                "id": 1300198,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataobattopikal2",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 198,
                                "satuan": null,
                                "id": 1301101,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataobattopikal2",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 198,
                                "satuan": null,
                                "id": 1300102,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataobattopikal2",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 198,
                                "satuan": null,
                                "id": 1300199,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "tanggal2",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "datetime",
                                "nourut": 199,
                                "satuan": null,
                                "id": 1300200,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "tanggal2",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "datetime",
                                "nourut": 200,
                                "satuan": null,
                                "id": 1300201,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "tanggal2",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "datetime",
                                "nourut": 201,
                                "satuan": null,
                                "id": 1300202,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "tanggal2",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "datetime",
                                "nourut": 202,
                                "satuan": null,
                                "id": 1300203,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataoi1",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "combobox",
                                "nourut": 203,
                                "satuan": null,
                                "id": 1300204,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataoi1",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 204,
                                "satuan": null,
                                "id": 1300205,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataoi1",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 205,
                                "satuan": "H",
                                "id": 1300206,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataoi1",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 206,
                                "satuan": null,
                                "id": 1300207,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataoi1",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 207,
                                "satuan": null,
                                "id": 1300208,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataoi1",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 208,
                                "satuan": null,
                                "id": 1300209,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataoi1",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 209,
                                "satuan": null,
                                "id": 1300210,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataoi1",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 210,
                                "satuan": null,
                                "id": 1300211,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataoi1",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 211,
                                "satuan": null,
                                "id": 1300212,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataoi1",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 212,
                                "satuan": null,
                                "id": 1300213,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataoi1",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 213,
                                "satuan": null,
                                "id": 1300214,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataoi1",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 214,
                                "satuan": null,
                                "id": 1300215,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataoi1",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 215,
                                "satuan": null,
                                "id": 1300216,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataoi1",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 216,
                                "satuan": null,
                                "id": 1300217,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataoi1",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 217,
                                "satuan": null,
                                "id": 1300218,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataoi1",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 218,
                                "satuan": null,
                                "id": 1300219,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataoi1",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 219,
                                "satuan": null,
                                "id": 1300220,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataoi1",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 220,
                                "satuan": null,
                                "id": 1300221,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataoi1",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 220,
                                "satuan": null,
                                "id": 1307701,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataoi1",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 220,
                                "satuan": null,
                                "id": 1307702,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataoi2",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "combobox",
                                "nourut": 221,
                                "satuan": null,
                                "id": 1300222,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataoi2",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 222,
                                "satuan": null,
                                "id": 1300223,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataoi2",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 223,
                                "satuan": "H",
                                "id": 1300224,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataoi2",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 224,
                                "satuan": null,
                                "id": 1300225,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataoi2",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 225,
                                "satuan": null,
                                "id": 1300226,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataoi2",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 226,
                                "satuan": null,
                                "id": 1300227,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataoi2",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 227,
                                "satuan": null,
                                "id": 1300228,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataoi2",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 228,
                                "satuan": null,
                                "id": 1300229,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataoi2",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 229,
                                "satuan": null,
                                "id": 1300230,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataoi2",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 230,
                                "satuan": null,
                                "id": 1300231,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataoi2",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 231,
                                "satuan": null,
                                "id": 1300232,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataoi2",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 232,
                                "satuan": null,
                                "id": 1300233,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataoi2",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 233,
                                "satuan": null,
                                "id": 1300234,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataoi2",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 234,
                                "satuan": null,
                                "id": 1300235,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataoi2",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 235,
                                "satuan": null,
                                "id": 1300236,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataoi2",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 236,
                                "satuan": null,
                                "id": 1300237,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataoi2",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 237,
                                "satuan": null,
                                "id": 1300238,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataoi2",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 238,
                                "satuan": null,
                                "id": 1300239,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataoi2",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 220,
                                "satuan": null,
                                "id": 1307703,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataoi2",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 220,
                                "satuan": null,
                                "id": 1307704,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataoi3",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "combobox",
                                "nourut": 239,
                                "satuan": null,
                                "id": 1300240,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataoi3",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 240,
                                "satuan": null,
                                "id": 1300241,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataoi3",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 241,
                                "satuan": "H",
                                "id": 1300242,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataoi3",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 242,
                                "satuan": null,
                                "id": 1300243,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataoi3",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 243,
                                "satuan": null,
                                "id": 1300244,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataoi3",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 244,
                                "satuan": null,
                                "id": 1300245,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataoi3",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 245,
                                "satuan": null,
                                "id": 1300246,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataoi3",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 246,
                                "satuan": null,
                                "id": 1300247,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataoi3",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 247,
                                "satuan": null,
                                "id": 1300248,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataoi3",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 248,
                                "satuan": null,
                                "id": 1300249,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataoi3",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 249,
                                "satuan": null,
                                "id": 1300250,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataoi3",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 250,
                                "satuan": null,
                                "id": 1300251,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataoi3",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 251,
                                "satuan": null,
                                "id": 1300252,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataoi3",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 252,
                                "satuan": null,
                                "id": 1300253,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataoi3",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 253,
                                "satuan": null,
                                "id": 1300254,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataoi3",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 254,
                                "satuan": null,
                                "id": 1300255,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataoi3",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 255,
                                "satuan": null,
                                "id": 1300256,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataoi3",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 256,
                                "satuan": null,
                                "id": 1300257,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataoi3",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 220,
                                "satuan": null,
                                "id": 1307705,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataoi3",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 220,
                                "satuan": null,
                                "id": 1307706,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataoi4",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 257,
                                "satuan": null,
                                "id": 1300258,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataoi4",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 258,
                                "satuan": null,
                                "id": 1300259,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataoi4",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 259,
                                "satuan": null,
                                "id": 1300260,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataoi4",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 260,
                                "satuan": null,
                                "id": 1300261,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataoi4",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 261,
                                "satuan": null,
                                "id": 1300262,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataoi4",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 262,
                                "satuan": null,
                                "id": 1300263,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataoi4",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 263,
                                "satuan": null,
                                "id": 1300264,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataoi4",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 264,
                                "satuan": null,
                                "id": 1300265,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataoi4",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 265,
                                "satuan": null,
                                "id": 1300266,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataoi4",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 266,
                                "satuan": null,
                                "id": 1300267,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataoi4",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 267,
                                "satuan": null,
                                "id": 1300268,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataoi4",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 268,
                                "satuan": null,
                                "id": 1300269,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataoi4",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 269,
                                "satuan": null,
                                "id": 1300270,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataoi4",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 270,
                                "satuan": null,
                                "id": 1300271,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataoi4",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 271,
                                "satuan": null,
                                "id": 1300272,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataoi4",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 272,
                                "satuan": null,
                                "id": 1300273,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataoi4",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000444,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 272,
                                "satuan": null,
                                "id": 1300273,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdataoi4",
                                "namaexternal": "",
                                "reportdisplay": "",
                                "emrfk": 3000445,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 272,
                                "satuan": null,
                                "id": 1300273,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": null,
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "datetime",
                                "nourut": 273,
                                "satuan": null,
                                "id": 1300274,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": null,
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "combobox",
                                "nourut": 274,
                                "satuan": null,
                                "id": 1300275,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdatainhalasi1",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "combobox",
                                "nourut": 275,
                                "satuan": null,
                                "id": 1300276,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdatainhalasi1",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 276,
                                "satuan": null,
                                "id": 1300277,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdatainhalasi1",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 277,
                                "satuan": "H",
                                "id": 1300278,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdatainhalasi1",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 278,
                                "satuan": null,
                                "id": 1300279,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdatainhalasi1",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 279,
                                "satuan": null,
                                "id": 1300280,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdatainhalasi1",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 280,
                                "satuan": null,
                                "id": 1300281,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdatainhalasi1",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 281,
                                "satuan": null,
                                "id": 1300282,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdatainhalasi1",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 282,
                                "satuan": null,
                                "id": 1300283,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdatainhalasi1",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 283,
                                "satuan": null,
                                "id": 1300284,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdatainhalasi1",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 284,
                                "satuan": null,
                                "id": 1300285,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdatainhalasi1",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 285,
                                "satuan": null,
                                "id": 1300286,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdatainhalasi1",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 286,
                                "satuan": null,
                                "id": 1300287,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdatainhalasi1",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 287,
                                "satuan": null,
                                "id": 1300288,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdatainhalasi1",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 288,
                                "satuan": null,
                                "id": 1300289,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdatainhalasi1",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 289,
                                "satuan": null,
                                "id": 1300290,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdatainhalasi1",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 290,
                                "satuan": null,
                                "id": 1300291,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdatainhalasi1",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 291,
                                "satuan": null,
                                "id": 1300292,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdatainhalasi1",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 292,
                                "satuan": null,
                                "id": 1300293,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdatainhalasi1",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 220,
                                "satuan": null,
                                "id": 1307751,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdatainhalasi1",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 220,
                                "satuan": null,
                                "id": 1307752,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdatainhalasi2",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "combobox",
                                "nourut": 293,
                                "satuan": null,
                                "id": 1300294,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdatainhalasi2",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 294,
                                "satuan": null,
                                "id": 1300295,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdatainhalasi2",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 295,
                                "satuan": "H",
                                "id": 1300296,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdatainhalasi2",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 296,
                                "satuan": null,
                                "id": 1300297,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdatainhalasi2",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 297,
                                "satuan": null,
                                "id": 1300298,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdatainhalasi2",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 298,
                                "satuan": null,
                                "id": 1300299,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdatainhalasi2",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 299,
                                "satuan": null,
                                "id": 1300300,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdatainhalasi2",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 300,
                                "satuan": null,
                                "id": 1300301,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdatainhalasi2",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 301,
                                "satuan": null,
                                "id": 1300302,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdatainhalasi2",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 302,
                                "satuan": null,
                                "id": 1300303,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdatainhalasi2",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 303,
                                "satuan": null,
                                "id": 1300304,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdatainhalasi2",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 304,
                                "satuan": null,
                                "id": 1300305,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdatainhalasi2",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 305,
                                "satuan": null,
                                "id": 1300306,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdatainhalasi2",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 306,
                                "satuan": null,
                                "id": 1300307,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdatainhalasi2",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 307,
                                "satuan": null,
                                "id": 1300308,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdatainhalasi2",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 308,
                                "satuan": null,
                                "id": 1300309,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdatainhalasi2",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 309,
                                "satuan": null,
                                "id": 1300310,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdatainhalasi2",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 310,
                                "satuan": null,
                                "id": 1300311,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdatainhalasi2",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 310,
                                "satuan": null,
                                "id": 1307753,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdatainhalasi2",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 310,
                                "satuan": null,
                                "id": 1307754,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdatainhalasi3",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "combobox",
                                "nourut": 311,
                                "satuan": null,
                                "id": 1300312,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdatainhalasi3",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 312,
                                "satuan": null,
                                "id": 1300313,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdatainhalasi3",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 313,
                                "satuan": "H",
                                "id": 1300314,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdatainhalasi3",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 314,
                                "satuan": null,
                                "id": 1300315,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdatainhalasi3",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 315,
                                "satuan": null,
                                "id": 1300316,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdatainhalasi3",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 316,
                                "satuan": null,
                                "id": 1300317,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdatainhalasi3",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 317,
                                "satuan": null,
                                "id": 1300318,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdatainhalasi3",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 318,
                                "satuan": null,
                                "id": 1300319,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdatainhalasi3",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 319,
                                "satuan": null,
                                "id": 1300320,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdatainhalasi3",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 320,
                                "satuan": null,
                                "id": 1300321,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdatainhalasi3",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 321,
                                "satuan": null,
                                "id": 1300322,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdatainhalasi3",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 322,
                                "satuan": null,
                                "id": 1300323,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdatainhalasi3",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 323,
                                "satuan": null,
                                "id": 1300324,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdatainhalasi3",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 324,
                                "satuan": null,
                                "id": 1300325,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdatainhalasi3",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 325,
                                "satuan": null,
                                "id": 1300326,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdatainhalasi3",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 326,
                                "satuan": null,
                                "id": 1300327,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdatainhalasi3",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 327,
                                "satuan": null,
                                "id": 1300328,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdatainhalasi3",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 328,
                                "satuan": null,
                                "id": 1300329,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdatainhalasi3",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "checkbox",
                                "nourut": 220,
                                "satuan": null,
                                "id": 1307755,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdatainhalasi3",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 220,
                                "satuan": null,
                                "id": 1307756,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdatain4",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 329,
                                "satuan": null,
                                "id": 1300330,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdatain4",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 330,
                                "satuan": null,
                                "id": 1300331,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdatain4",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 331,
                                "satuan": null,
                                "id": 1300332,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdatain4",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 332,
                                "satuan": null,
                                "id": 1300333,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdatain4",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 333,
                                "satuan": null,
                                "id": 1300334,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdatain4",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 334,
                                "satuan": null,
                                "id": 1300335,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdatain4",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 335,
                                "satuan": null,
                                "id": 1300336,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdatain4",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 336,
                                "satuan": null,
                                "id": 1300337,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdatain4",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 337,
                                "satuan": null,
                                "id": 1300338,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdatain4",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 338,
                                "satuan": null,
                                "id": 1300339,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdatain4",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 339,
                                "satuan": null,
                                "id": 1300340,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdatain4",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 340,
                                "satuan": null,
                                "id": 1300341,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdatain4",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 341,
                                "satuan": null,
                                "id": 1300342,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdatain4",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 342,
                                "satuan": null,
                                "id": 1300343,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdatain4",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 343,
                                "satuan": null,
                                "id": 1300344,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdatain4",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 344,
                                "satuan": null,
                                "id": 1300345,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdatain4",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 344,
                                "satuan": null,
                                "id": 1300741,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": "listdatain4",
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "textbox",
                                "nourut": 344,
                                "satuan": null,
                                "id": 1300742,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": null,
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "datetime",
                                "nourut": null,
                                "satuan": null,
                                "id": 1300000,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            },
                            {
                                "kdprofile": 30,
                                "statusenabled": true,
                                "kodeexternal": null,
                                "namaexternal": null,
                                "reportdisplay": null,
                                "emrfk": 3000443,
                                "caption": "",
                                "type": "datetime",
                                "nourut": null,
                                "satuan": null,
                                "id": 1300001,
                                "headfk": null,
                                "namaemr": "asesmen",
                                "style": null,
                                "cbotable": null,
                                "child": []
                            }
                        ],
                        "title": "RM.46.01.Rev01 Terapi Harian Pasien Rawat Inap",
                        "classgrid": "grid_12",
                        "namaemr": "asesmen",
                        "message": "as@epic"
                    }
                var datas = e.data.kolom4
                var detail = []
                var arrayTanggal = []
                var arrayTanggal2 = []
                var arrayListData1 = []
                var arrayListData2 = []
                var arrayListData3 = []
                var arrayListData4 = []
                var arrayListData5 = []
                var arrayListData6 = []
                var arrayListData7 = []
                var arrayListData8 = []
                var arrayListData9 = []
                var arrayListDataObatTopikal1 = []
                var arrayListDataObatTopikal2 = []
                var arrayListDataOI1 = []
                var arrayListDataOI2 = []
                var arrayListDataOI3 = []
                var arrayListDataOI4 = []
                var arrayListDataInhalasi1 = []
                var arrayListDataInhalasi2 = []
                var arrayListDataInhalasi3 = []
                var arrayListDataInhalasi4 = []
                var sama = false


                for (let i = 0; i < datas.length; i++) {
                    const element = datas[i];
                    sama = false

                    if (element.kodeexternal == 'tanggal') {
                        for (let i = 0; i < arrayTanggal.length; i++) {
                            const element2 = arrayTanggal[i];
                            if (element2.namaexternal == element.namaexternal && element2.kodeexternal == element.kodeexternal) {
                                detail.push(element)
                                element2.details = detail
                                sama = true
                            }
                            
                        }
                        if (sama == false) {
                            var datax = {
                                caption: element.caption,
                                cbotable: element.cbotable,
                                child: [],
                                emrfk: element.emrfk,
                                headfk: element.headfk,
                                id: element.id,
                                kdprofile: element.kdprofile,
                                kodeexternal: element.kodeexternal,
                                namaemr: element.namaemr,
                                namaexternal: element.namaexternal,
                                nourut: element.nourut,
                                reportdisplay: element.reportdisplay,
                                satuan: element.satuan,
                                statusenabled: element.statusenabled,
                                style: element.style,
                                type: element.type,

                            }
                            arrayTanggal.push(datax)
                        }
                    }

                    if (element.kodeexternal == 'listdata1') {
                        for (let i = 0; i < arrayListData1.length; i++) {
                            const element2 = arrayListData1[i];
                            if (element2.namaexternal == element.namaexternal && element2.kodeexternal == element.kodeexternal) {
                                detail.push(element)
                                element2.details = detail
                                sama = true
                            }

                        }
                        if (sama == false) {
                            var datax = {
                                caption: element.caption,
                                cbotable: element.cbotable,
                                child: [],
                                emrfk: element.emrfk,
                                headfk: element.headfk,
                                id: element.id,
                                kdprofile: element.kdprofile,
                                kodeexternal: element.kodeexternal,
                                namaemr: element.namaemr,
                                namaexternal: element.namaexternal,
                                nourut: element.nourut,
                                reportdisplay: element.reportdisplay,
                                satuan: element.satuan,
                                statusenabled: element.statusenabled,
                                style: element.style,
                                type: element.type,

                            }
                            arrayListData1.push(datax)
                        }
                    }
                    if (element.kodeexternal == 'listdata2') {
                        for (let i = 0; i < arrayListData2.length; i++) {
                            const element2 = arrayListData2[i];
                            if (element2.namaexternal == element.namaexternal && element2.kodeexternal == element.kodeexternal) {
                                detail.push(element)
                                element2.details = detail
                                sama = true
                            }

                        }
                        if (sama == false) {
                            var datax = {
                                caption: element.caption,
                                cbotable: element.cbotable,
                                child: [],
                                emrfk: element.emrfk,
                                headfk: element.headfk,
                                id: element.id,
                                kdprofile: element.kdprofile,
                                kodeexternal: element.kodeexternal,
                                namaemr: element.namaemr,
                                namaexternal: element.namaexternal,
                                nourut: element.nourut,
                                reportdisplay: element.reportdisplay,
                                satuan: element.satuan,
                                statusenabled: element.statusenabled,
                                style: element.style,
                                type: element.type,

                            }
                            arrayListData2.push(datax)
                        }
                    }
                    if (element.kodeexternal == 'listdata3') {
                        for (let i = 0; i < arrayListData3.length; i++) {
                            const element2 = arrayListData3[i];
                            if (element2.namaexternal == element.namaexternal && element2.kodeexternal == element.kodeexternal) {
                                detail.push(element)
                                element2.details = detail
                                sama = true
                            }

                        }
                        if (sama == false) {
                            var datax = {
                                caption: element.caption,
                                cbotable: element.cbotable,
                                child: [],
                                emrfk: element.emrfk,
                                headfk: element.headfk,
                                id: element.id,
                                kdprofile: element.kdprofile,
                                kodeexternal: element.kodeexternal,
                                namaemr: element.namaemr,
                                namaexternal: element.namaexternal,
                                nourut: element.nourut,
                                reportdisplay: element.reportdisplay,
                                satuan: element.satuan,
                                statusenabled: element.statusenabled,
                                style: element.style,
                                type: element.type,

                            }
                            arrayListData3.push(datax)
                        }
                    }

                    if (element.kodeexternal == 'listdata4') {
                        for (let i = 0; i < arrayListData4.length; i++) {
                            const element2 = arrayListData4[i];
                            if (element2.namaexternal == element.namaexternal && element2.kodeexternal == element.kodeexternal) {
                                detail.push(element)
                                element2.details = detail
                                sama = true
                            }

                        }
                        if (sama == false) {
                            var datax = {
                                caption: element.caption,
                                cbotable: element.cbotable,
                                child: [],
                                emrfk: element.emrfk,
                                headfk: element.headfk,
                                id: element.id,
                                kdprofile: element.kdprofile,
                                kodeexternal: element.kodeexternal,
                                namaemr: element.namaemr,
                                namaexternal: element.namaexternal,
                                nourut: element.nourut,
                                reportdisplay: element.reportdisplay,
                                satuan: element.satuan,
                                statusenabled: element.statusenabled,
                                style: element.style,
                                type: element.type,

                            }
                            arrayListData4.push(datax)
                        }
                    }
                    if (element.kodeexternal == 'listdata5') {
                        for (let i = 0; i < arrayListData5.length; i++) {
                            const element2 = arrayListData5[i];
                            if (element2.namaexternal == element.namaexternal && element2.kodeexternal == element.kodeexternal) {
                                detail.push(element)
                                element2.details = detail
                                sama = true
                            }

                        }
                        if (sama == false) {
                            var datax = {
                                caption: element.caption,
                                cbotable: element.cbotable,
                                child: [],
                                emrfk: element.emrfk,
                                headfk: element.headfk,
                                id: element.id,
                                kdprofile: element.kdprofile,
                                kodeexternal: element.kodeexternal,
                                namaemr: element.namaemr,
                                namaexternal: element.namaexternal,
                                nourut: element.nourut,
                                reportdisplay: element.reportdisplay,
                                satuan: element.satuan,
                                statusenabled: element.statusenabled,
                                style: element.style,
                                type: element.type,

                            }
                            arrayListData5.push(datax)
                        }
                    }
                    if (element.kodeexternal == 'listdata6') {
                        for (let i = 0; i < arrayListData6.length; i++) {
                            const element2 = arrayListData6[i];
                            if (element2.namaexternal == element.namaexternal && element2.kodeexternal == element.kodeexternal) {
                                detail.push(element)
                                element2.details = detail
                                sama = true
                            }

                        }
                        if (sama == false) {
                            var datax = {
                                caption: element.caption,
                                cbotable: element.cbotable,
                                child: [],
                                emrfk: element.emrfk,
                                headfk: element.headfk,
                                id: element.id,
                                kdprofile: element.kdprofile,
                                kodeexternal: element.kodeexternal,
                                namaemr: element.namaemr,
                                namaexternal: element.namaexternal,
                                nourut: element.nourut,
                                reportdisplay: element.reportdisplay,
                                satuan: element.satuan,
                                statusenabled: element.statusenabled,
                                style: element.style,
                                type: element.type,

                            }
                            arrayListData6.push(datax)
                        }
                    }
                    if (element.kodeexternal == 'listdata7') {
                        for (let i = 0; i < arrayListData7.length; i++) {
                            const element2 = arrayListData7[i];
                            if (element2.namaexternal == element.namaexternal && element2.kodeexternal == element.kodeexternal) {
                                detail.push(element)
                                element2.details = detail
                                sama = true
                            }

                        }
                        if (sama == false) {
                            var datax = {
                                caption: element.caption,
                                cbotable: element.cbotable,
                                child: [],
                                emrfk: element.emrfk,
                                headfk: element.headfk,
                                id: element.id,
                                kdprofile: element.kdprofile,
                                kodeexternal: element.kodeexternal,
                                namaemr: element.namaemr,
                                namaexternal: element.namaexternal,
                                nourut: element.nourut,
                                reportdisplay: element.reportdisplay,
                                satuan: element.satuan,
                                statusenabled: element.statusenabled,
                                style: element.style,
                                type: element.type,

                            }
                            arrayListData7.push(datax)
                        }
                    }
                    if (element.kodeexternal == 'listdata8') {
                        for (let i = 0; i < arrayListData8.length; i++) {
                            const element2 = arrayListData8[i];
                            if (element2.namaexternal == element.namaexternal && element2.kodeexternal == element.kodeexternal) {
                                detail.push(element)
                                element2.details = detail
                                sama = true
                            }

                        }
                        if (sama == false) {
                            var datax = {
                                caption: element.caption,
                                cbotable: element.cbotable,
                                child: [],
                                emrfk: element.emrfk,
                                headfk: element.headfk,
                                id: element.id,
                                kdprofile: element.kdprofile,
                                kodeexternal: element.kodeexternal,
                                namaemr: element.namaemr,
                                namaexternal: element.namaexternal,
                                nourut: element.nourut,
                                reportdisplay: element.reportdisplay,
                                satuan: element.satuan,
                                statusenabled: element.statusenabled,
                                style: element.style,
                                type: element.type,

                            }
                            arrayListData8.push(datax)
                        }
                    }
                    if (element.kodeexternal == 'listdata9') {
                        for (let i = 0; i < arrayListData9.length; i++) {
                            const element2 = arrayListData9[i];
                            if (element2.namaexternal == element.namaexternal && element2.kodeexternal == element.kodeexternal) {
                                detail.push(element)
                                element2.details = detail
                                sama = true
                            }

                        }
                        if (sama == false) {
                            var datax = {
                                caption: element.caption,
                                cbotable: element.cbotable,
                                child: [],
                                emrfk: element.emrfk,
                                headfk: element.headfk,
                                id: element.id,
                                kdprofile: element.kdprofile,
                                kodeexternal: element.kodeexternal,
                                namaemr: element.namaemr,
                                namaexternal: element.namaexternal,
                                nourut: element.nourut,
                                reportdisplay: element.reportdisplay,
                                satuan: element.satuan,
                                statusenabled: element.statusenabled,
                                style: element.style,
                                type: element.type,

                            }
                            arrayListData9.push(datax)
                        }
                    }
                    if (element.kodeexternal == 'listdataobattopikal1') {
                        for (let i = 0; i < arrayListDataObatTopikal1.length; i++) {
                            const element2 = arrayListDataObatTopikal1[i];
                            if (element2.namaexternal == element.namaexternal && element2.kodeexternal == element.kodeexternal) {
                                detail.push(element)
                                element2.details = detail
                                sama = true
                            }

                        }
                        if (sama == false) {
                            var datax = {
                                caption: element.caption,
                                cbotable: element.cbotable,
                                child: [],
                                emrfk: element.emrfk,
                                headfk: element.headfk,
                                id: element.id,
                                kdprofile: element.kdprofile,
                                kodeexternal: element.kodeexternal,
                                namaemr: element.namaemr,
                                namaexternal: element.namaexternal,
                                nourut: element.nourut,
                                reportdisplay: element.reportdisplay,
                                satuan: element.satuan,
                                statusenabled: element.statusenabled,
                                style: element.style,
                                type: element.type,

                            }
                            arrayListDataObatTopikal1.push(datax)
                        }
                    }

                    if (element.kodeexternal == 'tanggal2') {
                        for (let i = 0; i < arrayTanggal2.length; i++) {
                            const element2 = arrayTanggal2[i];
                            if (element2.namaexternal == element.namaexternal && element2.kodeexternal == element.kodeexternal) {
                                detail.push(element)
                                element2.details = detail
                                sama = true
                            }

                        }
                        if (sama == false) {
                            var datax = {
                                caption: element.caption,
                                cbotable: element.cbotable,
                                child: [],
                                emrfk: element.emrfk,
                                headfk: element.headfk,
                                id: element.id,
                                kdprofile: element.kdprofile,
                                kodeexternal: element.kodeexternal,
                                namaemr: element.namaemr,
                                namaexternal: element.namaexternal,
                                nourut: element.nourut,
                                reportdisplay: element.reportdisplay,
                                satuan: element.satuan,
                                statusenabled: element.statusenabled,
                                style: element.style,
                                type: element.type,

                            }
                            arrayTanggal2.push(datax)
                        }
                    }

                    if (element.kodeexternal == 'listdataobattopikal2') {
                        for (let i = 0; i < arrayListDataObatTopikal2.length; i++) {
                            const element2 = arrayListDataObatTopikal2[i];
                            if (element2.namaexternal == element.namaexternal && element2.kodeexternal == element.kodeexternal) {
                                detail.push(element)
                                element2.details = detail
                                sama = true
                            }

                        }
                        if (sama == false) {
                            var datax = {
                                caption: element.caption,
                                cbotable: element.cbotable,
                                child: [],
                                emrfk: element.emrfk,
                                headfk: element.headfk,
                                id: element.id,
                                kdprofile: element.kdprofile,
                                kodeexternal: element.kodeexternal,
                                namaemr: element.namaemr,
                                namaexternal: element.namaexternal,
                                nourut: element.nourut,
                                reportdisplay: element.reportdisplay,
                                satuan: element.satuan,
                                statusenabled: element.statusenabled,
                                style: element.style,
                                type: element.type,

                            }
                            arrayListDataObatTopikal2.push(datax)
                        }
                    }

                    if (element.kodeexternal == 'listdataoi1') {
                        for (let i = 0; i < arrayListDataOI1.length; i++) {
                            const element2 = arrayListDataOI1[i];
                            if (element2.namaexternal == element.namaexternal && element2.kodeexternal == element.kodeexternal) {
                                detail.push(element)
                                element2.details = detail
                                sama = true
                            }

                        }
                        if (sama == false) {
                            var datax = {
                                caption: element.caption,
                                cbotable: element.cbotable,
                                child: [],
                                emrfk: element.emrfk,
                                headfk: element.headfk,
                                id: element.id,
                                kdprofile: element.kdprofile,
                                kodeexternal: element.kodeexternal,
                                namaemr: element.namaemr,
                                namaexternal: element.namaexternal,
                                nourut: element.nourut,
                                reportdisplay: element.reportdisplay,
                                satuan: element.satuan,
                                statusenabled: element.statusenabled,
                                style: element.style,
                                type: element.type,

                            }
                            arrayListDataOI1.push(datax)
                        }
                    }
                    if (element.kodeexternal == 'listdataoi2') {
                        for (let i = 0; i < arrayListDataOI2.length; i++) {
                            const element2 = arrayListDataOI2[i];
                            if (element2.namaexternal == element.namaexternal && element2.kodeexternal == element.kodeexternal) {
                                detail.push(element)
                                element2.details = detail
                                sama = true
                            }

                        }
                        if (sama == false) {
                            var datax = {
                                caption: element.caption,
                                cbotable: element.cbotable,
                                child: [],
                                emrfk: element.emrfk,
                                headfk: element.headfk,
                                id: element.id,
                                kdprofile: element.kdprofile,
                                kodeexternal: element.kodeexternal,
                                namaemr: element.namaemr,
                                namaexternal: element.namaexternal,
                                nourut: element.nourut,
                                reportdisplay: element.reportdisplay,
                                satuan: element.satuan,
                                statusenabled: element.statusenabled,
                                style: element.style,
                                type: element.type,

                            }
                            arrayListDataOI2.push(datax)
                        }
                    }
                    if (element.kodeexternal == 'listdataoi3') {
                        for (let i = 0; i < arrayListDataOI3.length; i++) {
                            const element2 = arrayListDataOI3[i];
                            if (element2.namaexternal == element.namaexternal && element2.kodeexternal == element.kodeexternal) {
                                detail.push(element)
                                element2.details = detail
                                sama = true
                            }

                        }
                        if (sama == false) {
                            var datax = {
                                caption: element.caption,
                                cbotable: element.cbotable,
                                child: [],
                                emrfk: element.emrfk,
                                headfk: element.headfk,
                                id: element.id,
                                kdprofile: element.kdprofile,
                                kodeexternal: element.kodeexternal,
                                namaemr: element.namaemr,
                                namaexternal: element.namaexternal,
                                nourut: element.nourut,
                                reportdisplay: element.reportdisplay,
                                satuan: element.satuan,
                                statusenabled: element.statusenabled,
                                style: element.style,
                                type: element.type,

                            }
                            arrayListDataOI3.push(datax)
                        }
                    }
                    if (element.kodeexternal == 'listdataoi4') {
                        for (let i = 0; i < arrayListDataOI4.length; i++) {
                            const element2 = arrayListDataOI4[i];
                            if (element2.namaexternal == element.namaexternal && element2.kodeexternal == element.kodeexternal) {
                                detail.push(element)
                                element2.details = detail
                                sama = true
                            }

                        }
                        if (sama == false) {
                            var datax = {
                                caption: element.caption,
                                cbotable: element.cbotable,
                                child: [],
                                emrfk: element.emrfk,
                                headfk: element.headfk,
                                id: element.id,
                                kdprofile: element.kdprofile,
                                kodeexternal: element.kodeexternal,
                                namaemr: element.namaemr,
                                namaexternal: element.namaexternal,
                                nourut: element.nourut,
                                reportdisplay: element.reportdisplay,
                                satuan: element.satuan,
                                statusenabled: element.statusenabled,
                                style: element.style,
                                type: element.type,

                            }
                            arrayListDataOI4.push(datax)
                        }
                    }
                    if (element.kodeexternal == 'listdatainhalasi1') {
                        for (let i = 0; i < arrayListDataInhalasi1.length; i++) {
                            const element2 = arrayListDataInhalasi1[i];
                            if (element2.namaexternal == element.namaexternal && element2.kodeexternal == element.kodeexternal) {
                                detail.push(element)
                                element2.details = detail
                                sama = true
                            }

                        }
                        if (sama == false) {
                            var datax = {
                                caption: element.caption,
                                cbotable: element.cbotable,
                                child: [],
                                emrfk: element.emrfk,
                                headfk: element.headfk,
                                id: element.id,
                                kdprofile: element.kdprofile,
                                kodeexternal: element.kodeexternal,
                                namaemr: element.namaemr,
                                namaexternal: element.namaexternal,
                                nourut: element.nourut,
                                reportdisplay: element.reportdisplay,
                                satuan: element.satuan,
                                statusenabled: element.statusenabled,
                                style: element.style,
                                type: element.type,

                            }
                            arrayListDataInhalasi1.push(datax)
                        }
                    }
                    if (element.kodeexternal == 'listdatainhalasi2') {
                        for (let i = 0; i < arrayListDataInhalasi2.length; i++) {
                            const element2 = arrayListDataInhalasi2[i];
                            if (element2.namaexternal == element.namaexternal && element2.kodeexternal == element.kodeexternal) {
                                detail.push(element)
                                element2.details = detail
                                sama = true
                            }

                        }
                        if (sama == false) {
                            var datax = {
                                caption: element.caption,
                                cbotable: element.cbotable,
                                child: [],
                                emrfk: element.emrfk,
                                headfk: element.headfk,
                                id: element.id,
                                kdprofile: element.kdprofile,
                                kodeexternal: element.kodeexternal,
                                namaemr: element.namaemr,
                                namaexternal: element.namaexternal,
                                nourut: element.nourut,
                                reportdisplay: element.reportdisplay,
                                satuan: element.satuan,
                                statusenabled: element.statusenabled,
                                style: element.style,
                                type: element.type,

                            }
                            arrayListDataInhalasi2.push(datax)
                        }
                    }
                    if (element.kodeexternal == 'listdatainhalasi3') {
                        for (let i = 0; i < arrayListDataInhalasi3.length; i++) {
                            const element2 = arrayListDataInhalasi3[i];
                            if (element2.namaexternal == element.namaexternal && element2.kodeexternal == element.kodeexternal) {
                                detail.push(element)
                                element2.details = detail
                                sama = true
                            }

                        }
                        if (sama == false) {
                            var datax = {
                                caption: element.caption,
                                cbotable: element.cbotable,
                                child: [],
                                emrfk: element.emrfk,
                                headfk: element.headfk,
                                id: element.id,
                                kdprofile: element.kdprofile,
                                kodeexternal: element.kodeexternal,
                                namaemr: element.namaemr,
                                namaexternal: element.namaexternal,
                                nourut: element.nourut,
                                reportdisplay: element.reportdisplay,
                                satuan: element.satuan,
                                statusenabled: element.statusenabled,
                                style: element.style,
                                type: element.type,

                            }
                            arrayListDataInhalasi3.push(datax)
                        }
                    }
                    if (element.kodeexternal == 'listdatain4') {
                        for (let i = 0; i < arrayListDataInhalasi4.length; i++) {
                            const element2 = arrayListDataInhalasi4[i];
                            if (element2.namaexternal == element.namaexternal && element2.kodeexternal == element.kodeexternal) {
                                detail.push(element)
                                element2.details = detail
                                sama = true
                            }

                        }
                        if (sama == false) {
                            var datax = {
                                caption: element.caption,
                                cbotable: element.cbotable,
                                child: [],
                                emrfk: element.emrfk,
                                headfk: element.headfk,
                                id: element.id,
                                kdprofile: element.kdprofile,
                                kodeexternal: element.kodeexternal,
                                namaemr: element.namaemr,
                                namaexternal: element.namaexternal,
                                nourut: element.nourut,
                                reportdisplay: element.reportdisplay,
                                satuan: element.satuan,
                                statusenabled: element.statusenabled,
                                style: element.style,
                                type: element.type,

                            }
                            arrayListDataInhalasi4.push(datax)
                        }
                    }


                }

                // ARRAY tanggal
                var gejalaKosongKeun = []
                for (let k = 0; k < arrayTanggal.length; k++) {
                    const element = arrayTanggal[k];
                    for (let l = 0; l < datas.length; l++) {
                        const element2 = datas[l];
                        if (element2.namaexternal == element.namaexternal && element2.kodeexternal == element.kodeexternal) {
                            gejalaKosongKeun.push(element2)
                            element.details = gejalaKosongKeun
                        } else {
                            gejalaKosongKeun = []
                        }
                    }
                }
                $scope.listTanggal = arrayTanggal

                // ARRAY listdata1
                var listData1KosongKeun = []
                for (let k = 0; k < arrayListData1.length; k++) {
                    const element = arrayListData1[k];
                    for (let l = 0; l < datas.length; l++) {
                        const element2 = datas[l];
                        if (element2.namaexternal == element.namaexternal && element2.kodeexternal == element.kodeexternal) {
                            listData1KosongKeun.push(element2)
                            element.details = listData1KosongKeun
                        } else {
                            listData1KosongKeun = []
                        }
                    }
                }
                $scope.listData1 = arrayListData1

                // ARRAY listdata2
                var listData2KosongKeun = []
                for (let k = 0; k < arrayListData2.length; k++) {
                    const element = arrayListData2[k];
                    for (let l = 0; l < datas.length; l++) {
                        const element2 = datas[l];
                        if (element2.namaexternal == element.namaexternal && element2.kodeexternal == element.kodeexternal) {
                            listData2KosongKeun.push(element2)
                            element.details = listData2KosongKeun
                        } else {
                            listData2KosongKeun = []
                        }
                    }
                }
                $scope.listData2 = arrayListData2

                // ARRAY listdata3
                var listData3KosongKeun = []
                for (let k = 0; k < arrayListData3.length; k++) {
                    const element = arrayListData3[k];
                    for (let l = 0; l < datas.length; l++) {
                        const element2 = datas[l];
                        if (element2.namaexternal == element.namaexternal && element2.kodeexternal == element.kodeexternal) {
                            listData3KosongKeun.push(element2)
                            element.details = listData3KosongKeun
                        } else {
                            listData3KosongKeun = []
                        }
                    }
                }
                $scope.listData3 = arrayListData3

                 // ARRAY listdata4
                var listData4KosongKeun = []
                for (let k = 0; k < arrayListData4.length; k++) {
                    const element = arrayListData4[k];
                    for (let l = 0; l < datas.length; l++) {
                        const element2 = datas[l];
                        if (element2.namaexternal == element.namaexternal && element2.kodeexternal == element.kodeexternal) {
                            listData4KosongKeun.push(element2)
                            element.details = listData4KosongKeun
                        } else {
                            listData4KosongKeun = []
                        }
                    }
                }
                $scope.listData4 = arrayListData4

                 // ARRAY listdata5
                var listData5KosongKeun = []
                for (let k = 0; k < arrayListData5.length; k++) {
                    const element = arrayListData5[k];
                    for (let l = 0; l < datas.length; l++) {
                        const element2 = datas[l];
                        if (element2.namaexternal == element.namaexternal && element2.kodeexternal == element.kodeexternal) {
                            listData5KosongKeun.push(element2)
                            element.details = listData5KosongKeun
                        } else {
                            listData5KosongKeun = []
                        }
                    }
                }
                $scope.listData5 = arrayListData5

                 // ARRAY listdata6
                var listData6KosongKeun = []
                for (let k = 0; k < arrayListData6.length; k++) {
                    const element = arrayListData6[k];
                    for (let l = 0; l < datas.length; l++) {
                        const element2 = datas[l];
                        if (element2.namaexternal == element.namaexternal && element2.kodeexternal == element.kodeexternal) {
                            listData6KosongKeun.push(element2)
                            element.details = listData6KosongKeun
                        } else {
                            listData6KosongKeun = []
                        }
                    }
                }
                $scope.listData6 = arrayListData6

                    // ARRAY listdata7
                var listData7KosongKeun = []
                for (let k = 0; k < arrayListData7.length; k++) {
                    const element = arrayListData7[k];
                    for (let l = 0; l < datas.length; l++) {
                        const element2 = datas[l];
                        if (element2.namaexternal == element.namaexternal && element2.kodeexternal == element.kodeexternal) {
                            listData7KosongKeun.push(element2)
                            element.details = listData7KosongKeun
                        } else {
                            listData7KosongKeun = []
                        }
                    }
                }
                $scope.listData7 = arrayListData7

                    // ARRAY listdata8
                var listData8KosongKeun = []
                for (let k = 0; k < arrayListData8.length; k++) {
                    const element = arrayListData8[k];
                    for (let l = 0; l < datas.length; l++) {
                        const element2 = datas[l];
                        if (element2.namaexternal == element.namaexternal && element2.kodeexternal == element.kodeexternal) {
                            listData8KosongKeun.push(element2)
                            element.details = listData8KosongKeun
                        } else {
                            listData8KosongKeun = []
                        }
                    }
                }
                $scope.listData8 = arrayListData8
                    
                // ARRAY listdata9
                var listData9KosongKeun = []
                for (let k = 0; k < arrayListData9.length; k++) {
                    const element = arrayListData9[k];
                    for (let l = 0; l < datas.length; l++) {
                        const element2 = datas[l];
                        if (element2.namaexternal == element.namaexternal && element2.kodeexternal == element.kodeexternal) {
                            listData9KosongKeun.push(element2)
                            element.details = listData9KosongKeun
                        } else {
                            listData9KosongKeun = []
                        }
                    }
                }
                $scope.listData9 = arrayListData9

                // ARRAY listDataObatTopikal1
                var listDataObatTopikal1KosongKeun = []
                for (let k = 0; k < arrayListDataObatTopikal1.length; k++) {
                    const element = arrayListDataObatTopikal1[k];
                    for (let l = 0; l < datas.length; l++) {
                        const element2 = datas[l];
                        if (element2.namaexternal == element.namaexternal && element2.kodeexternal == element.kodeexternal) {
                            listDataObatTopikal1KosongKeun.push(element2)
                            element.details = listDataObatTopikal1KosongKeun
                        } else {
                            listDataObatTopikal1KosongKeun = []
                        }
                    }
                }
                $scope.listDataObatTopikal1 = arrayListDataObatTopikal1

                // ARRAY listDataObatTopikal2
                var listDataObatTopikal2KosongKeun = []
                for (let k = 0; k < arrayListDataObatTopikal2.length; k++) {
                    const element = arrayListDataObatTopikal2[k];
                    for (let l = 0; l < datas.length; l++) {
                        const element2 = datas[l];
                        if (element2.namaexternal == element.namaexternal && element2.kodeexternal == element.kodeexternal) {
                            listDataObatTopikal2KosongKeun.push(element2)
                            element.details = listDataObatTopikal2KosongKeun
                        } else {
                            listDataObatTopikal2KosongKeun = []
                        }
                    }
                }
                $scope.listDataObatTopikal2 = arrayListDataObatTopikal2

                // ARRAY tanggal2
                var gejalaKosongKeun = []
                for (let k = 0; k < arrayTanggal2.length; k++) {
                    const element = arrayTanggal2[k];
                    for (let l = 0; l < datas.length; l++) {
                        const element2 = datas[l];
                        if (element2.namaexternal == element.namaexternal && element2.kodeexternal == element.kodeexternal) {
                            gejalaKosongKeun.push(element2)
                            element.details = gejalaKosongKeun
                        } else {
                            gejalaKosongKeun = []
                        }
                    }
                }
                $scope.listTanggal2 = arrayTanggal2

                // ARRAY listdataOI1
                var listDataOI1KosongKeun = []
                for (let k = 0; k < arrayListDataOI1.length; k++) {
                    const element = arrayListDataOI1[k];
                    for (let l = 0; l < datas.length; l++) {
                        const element2 = datas[l];
                        if (element2.namaexternal == element.namaexternal && element2.kodeexternal == element.kodeexternal) {
                            listDataOI1KosongKeun.push(element2)
                            element.details = listDataOI1KosongKeun
                        } else {
                            listDataOI1KosongKeun = []
                        }
                    }
                }
                $scope.listDataOI1 = arrayListDataOI1

                // ARRAY listdataOI2
                var listDataOI2KosongKeun = []
                for (let k = 0; k < arrayListDataOI2.length; k++) {
                    const element = arrayListDataOI2[k];
                    for (let l = 0; l < datas.length; l++) {
                        const element2 = datas[l];
                        if (element2.namaexternal == element.namaexternal && element2.kodeexternal == element.kodeexternal) {
                            listDataOI2KosongKeun.push(element2)
                            element.details = listDataOI2KosongKeun
                        } else {
                            listDataOI2KosongKeun = []
                        }
                    }
                }
                $scope.listDataOI2 = arrayListDataOI2

                // ARRAY listdataOI3
                var listDataOI3KosongKeun = []
                for (let k = 0; k < arrayListDataOI3.length; k++) {
                    const element = arrayListDataOI3[k];
                    for (let l = 0; l < datas.length; l++) {
                        const element2 = datas[l];
                        if (element2.namaexternal == element.namaexternal && element2.kodeexternal == element.kodeexternal) {
                            listDataOI3KosongKeun.push(element2)
                            element.details = listDataOI3KosongKeun
                        } else {
                            listDataOI3KosongKeun = []
                        }
                    }
                }
                $scope.listDataOI3 = arrayListDataOI3

                 // ARRAY listdataOI4
                var listDataOI4KosongKeun = []
                for (let k = 0; k < arrayListDataOI4.length; k++) {
                    const element = arrayListDataOI4[k];
                    for (let l = 0; l < datas.length; l++) {
                        const element2 = datas[l];
                        if (element2.namaexternal == element.namaexternal && element2.kodeexternal == element.kodeexternal) {
                            listDataOI4KosongKeun.push(element2)
                            element.details = listDataOI4KosongKeun
                        } else {
                            listDataOI4KosongKeun = []
                        }
                    }
                }
                $scope.listDataOI4 = arrayListDataOI4

                // ARRAY listdatainhalasi1
                var listDataInhalasi1KosongKeun = []
                for (let k = 0; k < arrayListDataInhalasi1.length; k++) {
                    const element = arrayListDataInhalasi1[k];
                    for (let l = 0; l < datas.length; l++) {
                        const element2 = datas[l];
                        if (element2.namaexternal == element.namaexternal && element2.kodeexternal == element.kodeexternal) {
                            listDataInhalasi1KosongKeun.push(element2)
                            element.details = listDataInhalasi1KosongKeun
                        } else {
                            listDataInhalasi1KosongKeun = []
                        }
                    }
                }
                $scope.listDataInhalasi1 = arrayListDataInhalasi1

                 // ARRAY listdatainhalasi2
                 var listDataInhalasi2KosongKeun = []
                 for (let k = 0; k < arrayListDataInhalasi2.length; k++) {
                     const element = arrayListDataInhalasi2[k];
                     for (let l = 0; l < datas.length; l++) {
                         const element2 = datas[l];
                         if (element2.namaexternal == element.namaexternal && element2.kodeexternal == element.kodeexternal) {
                             listDataInhalasi2KosongKeun.push(element2)
                             element.details = listDataInhalasi2KosongKeun
                         } else {
                             listDataInhalasi2KosongKeun = []
                         }
                     }
                 }
                 $scope.listDataInhalasi2 = arrayListDataInhalasi2
 
                 
                 // ARRAY listdatainhalasi3
                 var listDataInhalasi3KosongKeun = []
                 for (let k = 0; k < arrayListDataInhalasi3.length; k++) {
                     const element = arrayListDataInhalasi3[k];
                     for (let l = 0; l < datas.length; l++) {
                         const element2 = datas[l];
                         if (element2.namaexternal == element.namaexternal && element2.kodeexternal == element.kodeexternal) {
                             listDataInhalasi3KosongKeun.push(element2)
                             element.details = listDataInhalasi3KosongKeun
                         } else {
                             listDataInhalasi3KosongKeun = []
                         }
                     }
                 }
                 $scope.listDataInhalasi3 = arrayListDataInhalasi3

                 // ARRAY listdatainhalasi4
                 var listDataInhalasi4KosongKeun = []
                 for (let k = 0; k < arrayListDataInhalasi4.length; k++) {
                     const element = arrayListDataInhalasi4[k];
                     for (let l = 0; l < datas.length; l++) {
                         const element2 = datas[l];
                         if (element2.namaexternal == element.namaexternal && element2.kodeexternal == element.kodeexternal) {
                             listDataInhalasi4KosongKeun.push(element2)
                             element.details = listDataInhalasi4KosongKeun
                         } else {
                             listDataInhalasi4KosongKeun = []
                         }
                     }
                 }
                 $scope.listDataInhalasi4 = arrayListDataInhalasi4


            })





            var chekedd = false
            var chacePeriode = cacheHelper.get('cacheNomorEMR');
            if (chacePeriode != undefined) {
                nomorEMR = chacePeriode[0]
                $scope.cc.norec_emr = nomorEMR


                medifirstService.get("emr/get-emr-transaksi-detail?noemr=" + nomorEMR + "&emrfk=" + $scope.cc.emrfk, true).then(function (dat) {
                    $scope.item.obj = []
                    $scope.item.obj2 = []
                    $scope.item.obj[206476] = {
                        value: $scope.cc.iddpjp,
                        text: $scope.cc.dokterdpjp
                    }
                    $scope.item.obj[206478] = {
                        text: $scope.cc.namaruangan,
                        value: $scope.cc.objectruanganfk
                    }
                    dataLoad = dat.data.data
                    for (var i = 0; i <= dataLoad.length - 1; i++) {
                        if (parseFloat($scope.cc.emrfk) == dataLoad[i].emrfk && paramsIndex == dataLoad[i].index) {
                            if (dataLoad[i].type == "textbox") {
                                $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                            }
                            if (dataLoad[i].type == "checkbox") {
                                chekedd = false
                                if (dataLoad[i].value == '1') {
                                    chekedd = true
                                }
                                $scope.item.obj[dataLoad[i].emrdfk] = chekedd
                                // if (dataLoad[i].emrdfk >= 3122 && dataLoad[i].emrdfk <= 3148) {
                                //     var datass = { id: dataLoad[i].emrdfk, descNilai: dataLoad[i].reportdisplay }
                                //     $scope.getSkor2(datass)
                                // }
                                if (dataLoad[i].reportdisplay != null) {
                                    var datass = {
                                        id: dataLoad[i].emrdfk,
                                        skor: dataLoad[i].reportdisplay
                                    }
                                    $scope.getSkor(datass)
                                }


                            }

                            if (dataLoad[i].type == "datetime") {
                                $scope.item.obj[dataLoad[i].emrdfk] = new Date(dataLoad[i].value)
                            }
                            if (dataLoad[i].type == "combobox") {
                                var str = dataLoad[i].value
                                if (str != undefined) {
                                    var res = str.split("~");
                                    $scope.item.obj[dataLoad[i].emrdfk] = {
                                        value: res[0],
                                        text: res[1]
                                    }
                                }


                            }

                            // if(dataLoad[i].type == "checkboxtextbox") {
                            //     $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                            //     $scope.item.obj2[dataLoad[i].emrdfk] = true
                            // }
                            // if(dataLoad[i].type == "textarea") {
                            //     $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                            // }

                        }

                    }
                })
            }

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
                $scope.cc.dokterdpjp = chacePeriode[16]
                $scope.cc.iddpjp = chacePeriode[17]
                if (nomorEMR == '-') {
                    $scope.cc.norec_emr = '-'
                } else {
                    $scope.cc.norec_emr = nomorEMR
                }
            }
            // medifirstService.get('emr/get-data-dg-primary/' + $scope.cc.noregistrasi, true, true, 20).then(function (data) {                
            //     var datas = data.data[0]
            //     $scope.item.obj[206477] = {id:datas.id, text:datas.namadiagnosa}
            // })  

            $scope.skor1 = 0
            $scope.skor2 = 0
            $scope.skor3 = 0
            $scope.skor4 = 0
            $scope.skor5 = 0
            $scope.skor6 = 0
            $scope.skor7 = 0
            $scope.skor8 = 0
            $scope.skor9 = 0
            $scope.skor10 = 0
            $scope.skor11 = 0
            $scope.skor12 = 0
            $scope.skor13 = 0
            $scope.getSkor = function (stat) {

                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    if (arrobj[i] == stat.id) {
                        // if ($scope.item.obj[parseFloat(arrobj[i])] == true) {
                        if (stat.reportdisplay == null)
                            break
                        if (stat.satuan == 1)
                            $scope.skor1 = $scope.skor1 + parseFloat(stat.reportdisplay)
                        if (stat.satuan == 2)
                            $scope.skor2 = $scope.skor2 + parseFloat(stat.reportdisplay)
                        if (stat.satuan == 3)
                            $scope.skor3 = $scope.skor3 + parseFloat(stat.reportdisplay)
                        if (stat.satuan == 4)
                            $scope.skor4 = $scope.skor4 + parseFloat(stat.reportdisplay)
                        if (stat.satuan == 5)
                            $scope.skor5 = $scope.skor5 + parseFloat(stat.reportdisplay)
                        if (stat.satuan == 6)
                            $scope.skor6 = $scope.skor6 + parseFloat(stat.reportdisplay)
                        if (stat.satuan == 7)
                            $scope.skor7 = $scope.skor7 + parseFloat(stat.reportdisplay)
                        if (stat.satuan == 8)
                            $scope.skor8 = $scope.skor8 + parseFloat(stat.reportdisplay)
                        if (stat.satuan == 9)
                            $scope.skor9 = $scope.skor9 + parseFloat(stat.reportdisplay)
                        if (stat.satuan == 10)
                            $scope.skor10 = $scope.skor10 + parseFloat(stat.reportdisplay)
                        if (stat.satuan == 11)
                            $scope.skor11 = $scope.skor11 + parseFloat(stat.reportdisplay)
                        if (stat.satuan == 12)
                            $scope.skor12 = $scope.skor12 + parseFloat(stat.reportdisplay)
                        if (stat.satuan == 13)
                            $scope.skor13 = $scope.skor13 + parseFloat(stat.reportdisplay)
                        break
                    }

                    //     else {
                    //         if (stat.reportdisplay == null)
                    //             break
                    //         if (stat.satuan == 1)
                    //             $scope.skor1 = $scope.skor1 - parseFloat(stat.reportdisplay)
                    //         if (stat.satuan == 2)
                    //             $scope.skor2 = $scope.skor2 - parseFloat(stat.reportdisplay)
                    //         if (stat.satuan == 3)
                    //             $scope.skor3 = $scope.skor3 - parseFloat(stat.reportdisplay)
                    //         if (stat.satuan == 4)
                    //             $scope.skor4 = $scope.skor4 - parseFloat(stat.reportdisplay)
                    //         if (stat.satuan == 5)
                    //             $scope.skor5 = $scope.skor5 - parseFloat(stat.reportdisplay)
                    //         if (stat.satuan == 6)
                    //             $scope.skor6 = $scope.skor6 - parseFloat(stat.reportdisplay)
                    //         if (stat.satuan == 7)
                    //             $scope.skor7 = $scope.skor7 - parseFloat(stat.reportdisplay)
                    //         if (stat.satuan == 8)
                    //             $scope.skor8 = $scope.skor8 - parseFloat(stat.reportdisplay)
                    //         if (stat.satuan == 9)
                    //             $scope.skor9 = $scope.skor9 - parseFloat(stat.reportdisplay)
                    //         if (stat.satuan == 10)
                    //             $scope.skor10 = $scope.skor10 - parseFloat(stat.reportdisplay)
                    //         if (stat.satuan == 11)
                    //             $scope.skor11 = $scope.skor11 - parseFloat(stat.reportdisplay)
                    //         if (stat.satuan == 12)
                    //             $scope.skor12 = $scope.skor12 - parseFloat(stat.reportdisplay)
                    //         if (stat.satuan == 13)
                    //             $scope.skor13 = $scope.skor13 - parseFloat(stat.reportdisplay)
                    //     }
                    // }
                }
                // if $scope.skor1=0 

                // if($scope.skor1  != 0){
                //      $scope.item.obj[206437] = $scope.skor1
                // }
                // if($scope.skor2  != 0){
                //      $scope.item.obj[206438] = $scope.skor2
                // }

                $scope.item.obj[22026298] = $scope.skor1
                $scope.item.obj[22026299] = $scope.skor2
                $scope.item.obj[22026300] = $scope.skor3
                $scope.item.obj[22026301] = $scope.skor4
                $scope.item.obj[22026302] = $scope.skor5
                $scope.item.obj[22026303] = $scope.skor6
                $scope.item.obj[22026304] = $scope.skor7
                $scope.item.obj[22026305] = $scope.skor8
                $scope.item.obj[22026306] = $scope.skor9
                $scope.item.obj[22026307] = $scope.skor10
                $scope.item.obj[22026308] = $scope.skor11
                $scope.item.obj[22026309] = $scope.skor12
                $scope.item.obj[22026310] = $scope.skor13
            }
            $scope.getSkor2 = function (stat) {

                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    if (arrobj[i] == stat.id) {
                        if ($scope.item.obj[parseFloat(arrobj[i])] == true) {
                            $scope.totalSkor2 = $scope.totalSkor2 + parseFloat(stat.descNilai)
                            break
                        } else {
                            $scope.totalSkor2 = $scope.totalSkor2 - parseFloat(stat.descNilai)
                            break
                        }


                    } else {

                    }
                }
                $scope.item.obj[3152] = $scope.totalSkor + $scope.totalSkor2
                setSkorAkhir($scope.item.obj[3152])
            }

            function setSkorAkhir(total) {

                if (total < 7) {
                    $scope.item.obj[3149] = true
                    $scope.item.obj[3150] = false
                    $scope.item.obj[3151] = false
                }

                if (total >= 7 && total <= 14) {
                    $scope.item.obj[3149] = false
                    $scope.item.obj[3150] = true
                    $scope.item.obj[3151] = false
                }

                if (total > 14) {
                    $scope.item.obj[3149] = false
                    $scope.item.obj[3150] = false
                    $scope.item.obj[3151] = true
                }



            }
            $scope.kembali = function () {
                $rootScope.showRiwayat()
            }

            $scope.Save = function () {

                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    arrSave.push({
                        id: arrobj[i],
                        values: $scope.item.obj[parseInt(arrobj[i])]
                    })
                }
                $scope.cc.jenisemr = 'asesmen'
                $scope.cc.index = $state.params.index
                var jsonSave = {
                    head: $scope.cc,
                    data: arrSave
                }
                medifirstService.post('emr/save-emr-dinamis', jsonSave).then(function (e) {
                    // $state.go("RekamMedis.OrderJadwalBedah.ProsedurKeselamatan", {
                    //     namaEMR : $scope.cc.emrfk,
                    //     nomorEMR : e.data.data.noemr 
                    // });
                    medifirstService.postLogging('EMR', 'norec emrpasien_t', e.data.data.norec,
                        'Terapi Harian Pasien Rawat Inap ' + ' dengan No EMR - ' + e.data.data.noemr + ' pada No Registrasi ' +
                        $scope.cc.noregistrasi).then(function (res) {})

                    var arrStr = {
                        0: e.data.data.noemr
                    }
                    cacheHelper.set('cacheNomorEMR', arrStr);
                });
            }

        }
    ]);
});