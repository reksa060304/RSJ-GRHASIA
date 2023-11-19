define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('TerapiHarianPasienRanaprevCtrl', ['$q', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
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
            $scope.cc.emrfk = 3002052
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
            $scope.listData10 = []
            $scope.listData11 = []
            $scope.listData12 = []
            $scope.listData13 = []
            $scope.listData14 = []
            $scope.listData15 = []
            $scope.listData16 = []
            $scope.listDataObatTopikal1 = []
            $scope.listDataObatTopikal2 = []
            $scope.ListDataOI1 = []
            $scope.ListDataOI2 = []
            $scope.ListDataOI3 = []
            $scope.ListDataOI4 = []
            $scope.ListDataOI5 = []
            $scope.ListDataOI6 = []
            $scope.listDataInhalasi1 = []
            $scope.listDataInhalasi2 = []
            $scope.listDataInhalasi3 = []
            $scope.listDataInhalasi4 = []
            // $scope.listSkor = []
            $scope.loading = true
            if(medifirstService.getKelompokUser() == 'mahasiswadiklat'){
                $scope.tombolSimpanVis = false
            }
            medifirstService.getPart('emr/get-datacombo-part-pegawai', true, true, 20).then(function (data) {
                $scope.listPegawai = data
            })
            medifirstService.getPart('emr/get-datacombo-part-ruangan', true, true, 20).then(function (data) {
                $scope.listRuangan = data
            })
            medifirstService.getPart('emr/get-datacombo-part-diagnosa', true, true, 20).then(function (data) {
                $scope.listDiagnosa = data
            })
            medifirstService.get("emr/get-rekam-medis-dynamic?emrid=" + 3002052).then(function (e) {
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
                var arrayListData10 = []
                var arrayListData11 = []
                var arrayListData12 = []
                var arrayListData13 = []
                var arrayListData14 = []
                var arrayListData15 = []
                var arrayListData16= []
                var arrayListDataObatTopikal1 = []
                var arrayListDataObatTopikal2 = []
                var arrayListDataOI1 = []
                var arrayListDataOI2 = []
                var arrayListDataOI3 = []
                var arrayListDataOI4 = []
                var arrayListDataOI5 = []
                var arrayListDataOI6 = []
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
                    if (element.kodeexternal == 'listdata10') {
                        for (let i = 0; i < arrayListData10.length; i++) {
                            const element2 = arrayListData10[i];
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
                            arrayListData10.push(datax)
                        }
                    }
                    if (element.kodeexternal == 'listdata11') {
                        for (let i = 0; i < arrayListData11.length; i++) {
                            const element2 = arrayListData11[i];
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
                            arrayListData11.push(datax)
                        }
                    }
                    if (element.kodeexternal == 'listdata12') {
                        for (let i = 0; i < arrayListData12.length; i++) {
                            const element2 = arrayListData12[i];
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
                            arrayListData12.push(datax)
                        }
                    }
                    if (element.kodeexternal == 'listdata13') {
                        for (let i = 0; i < arrayListData13.length; i++) {
                            const element2 = arrayListData13[i];
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
                            arrayListData13.push(datax)
                        }
                    }
                    if (element.kodeexternal == 'listdata14') {
                        for (let i = 0; i < arrayListData14.length; i++) {
                            const element2 = arrayListData14[i];
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
                            arrayListData14.push(datax)
                        }
                    }
                    if (element.kodeexternal == 'listdata15') {
                        for (let i = 0; i < arrayListData15.length; i++) {
                            const element2 = arrayListData15[i];
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
                            arrayListData15.push(datax)
                        }
                    }
                    if (element.kodeexternal == 'listdata16') {
                        for (let i = 0; i < arrayListData16.length; i++) {
                            const element2 = arrayListData16[i];
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
                            arrayListData16.push(datax)
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
                    if (element.kodeexternal == 'listdataoi5') {
                        for (let i = 0; i < arrayListDataOI5.length; i++) {
                            const element2 = arrayListDataOI5[i];
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
                            arrayListDataOI5.push(datax)
                        }
                    }
                    if (element.kodeexternal == 'listdataoi6') {
                        for (let i = 0; i < arrayListDataOI6.length; i++) {
                            const element2 = arrayListDataOI6[i];
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
                            arrayListDataOI6.push(datax)
                        }
                    }
                    if (element.kodeexternal == 'listdatainh1') {
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
                    if (element.kodeexternal == 'listdatainh2') {
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
                    if (element.kodeexternal == 'listdatainh3') {
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
                    if (element.kodeexternal == 'listdatainh4') {
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
                $scope.listData10 = arrayListData10

                 // ARRAY listdata10
                 var listData10KosongKeun = []
                 for (let k = 0; k < arrayListData10.length; k++) {
                     const element = arrayListData10[k];
                     for (let l = 0; l < datas.length; l++) {
                         const element2 = datas[l];
                         if (element2.namaexternal == element.namaexternal && element2.kodeexternal == element.kodeexternal) {
                             listData10KosongKeun.push(element2)
                             element.details = listData10KosongKeun
                         } else {
                             listData10KosongKeun = []
                         }
                     }
                 }
                 $scope.listData10 = arrayListData10

                   // ARRAY listdata11
                   var listData11KosongKeun = []
                   for (let k = 0; k < arrayListData11.length; k++) {
                       const element = arrayListData11[k];
                       for (let l = 0; l < datas.length; l++) {
                           const element2 = datas[l];
                           if (element2.namaexternal == element.namaexternal && element2.kodeexternal == element.kodeexternal) {
                               listData11KosongKeun.push(element2)
                               element.details = listData11KosongKeun
                           } else {
                               listData11KosongKeun = []
                           }
                       }
                   }
                   $scope.listData11 = arrayListData11

                     // ARRAY listdata12
                     var listData12KosongKeun = []
                     for (let k = 0; k < arrayListData12.length; k++) {
                         const element = arrayListData12[k];
                         for (let l = 0; l < datas.length; l++) {
                             const element2 = datas[l];
                             if (element2.namaexternal == element.namaexternal && element2.kodeexternal == element.kodeexternal) {
                                 listData12KosongKeun.push(element2)
                                 element.details = listData12KosongKeun
                             } else {
                                 listData12KosongKeun = []
                             }
                         }
                     }
                     $scope.listData12 = arrayListData12

                     // ARRAY listdata13
                     var listData13KosongKeun = []
                     for (let k = 0; k < arrayListData13.length; k++) {
                         const element = arrayListData13[k];
                         for (let l = 0; l < datas.length; l++) {
                             const element2 = datas[l];
                             if (element2.namaexternal == element.namaexternal && element2.kodeexternal == element.kodeexternal) {
                                 listData13KosongKeun.push(element2)
                                 element.details = listData13KosongKeun
                             } else {
                                 listData13KosongKeun = []
                             }
                         }
                     }
                     $scope.listData13 = arrayListData13


                      // ARRAY listdata14
                      var listData14KosongKeun = []
                      for (let k = 0; k < arrayListData14.length; k++) {
                          const element = arrayListData14[k];
                          for (let l = 0; l < datas.length; l++) {
                              const element2 = datas[l];
                              if (element2.namaexternal == element.namaexternal && element2.kodeexternal == element.kodeexternal) {
                                  listData14KosongKeun.push(element2)
                                  element.details = listData14KosongKeun
                              } else {
                                  listData14KosongKeun = []
                              }
                          }
                      }
                      $scope.listData14 = arrayListData14

                          // ARRAY listdata15
                      var listData15KosongKeun = []
                      for (let k = 0; k < arrayListData15.length; k++) {
                          const element = arrayListData15[k];
                          for (let l = 0; l < datas.length; l++) {
                              const element2 = datas[l];
                              if (element2.namaexternal == element.namaexternal && element2.kodeexternal == element.kodeexternal) {
                                  listData15KosongKeun.push(element2)
                                  element.details = listData15KosongKeun
                              } else {
                                  listData15KosongKeun = []
                              }
                          }
                      }
                      $scope.listData15 = arrayListData15

                      // ARRAY listdata16
                      var listData16KosongKeun = []
                      for (let k = 0; k < arrayListData16.length; k++) {
                          const element = arrayListData16[k];
                          for (let l = 0; l < datas.length; l++) {
                              const element2 = datas[l];
                              if (element2.namaexternal == element.namaexternal && element2.kodeexternal == element.kodeexternal) {
                                  listData16KosongKeun.push(element2)
                                  element.details = listData16KosongKeun
                              } else {
                                  listData16KosongKeun = []
                              }
                          }
                      }
                      $scope.listData16= arrayListData16
                   
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

                var listDataOI5KosongKeun = []
                for (let k = 0; k < arrayListDataOI5.length; k++) {
                    const element = arrayListDataOI5[k];
                    for (let l = 0; l < datas.length; l++) {
                        const element2 = datas[l];
                        if (element2.namaexternal == element.namaexternal && element2.kodeexternal == element.kodeexternal) {
                            listDataOI5KosongKeun.push(element2)
                            element.details = listDataOI5KosongKeun
                        } else {
                            listDataOI5KosongKeun = []
                        }
                    }
                }
                $scope.listDataOI5 = arrayListDataOI5

                var listDataOI6KosongKeun = []
                for (let k = 0; k < arrayListDataOI6.length; k++) {
                    const element = arrayListDataOI6[k];
                    for (let l = 0; l < datas.length; l++) {
                        const element2 = datas[l];
                        if (element2.namaexternal == element.namaexternal && element2.kodeexternal == element.kodeexternal) {
                            listDataOI6KosongKeun.push(element2)
                            element.details = listDataOI6KosongKeun
                        } else {
                            listDataOI6KosongKeun = []
                        }
                    }
                }
                $scope.listDataOI6 = arrayListDataOI6

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
                            if (dataLoad[i].type == "textarea") {
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
                            if (dataLoad[i].type == "textarea2") {
                                $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
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
                        'TerapiHarianPasienRanaprevCtrl ' + ' dengan No EMR - ' + e.data.data.noemr + ' pada No Registrasi ' +
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