define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict';
    initialize.controller('RekamMedisCtrl', ['$rootScope', '$scope', '$state', 'DateHelper', 'MedifirstService', 'CacheHelper',
        function ($rootScope, $scope, $state, dateHelper, medifirstService, cacheHelper) {
            $scope.now = new Date();

            $scope.header = {};
            var usrDokter = medifirstService.getPegawaiLogin().jenisPegawai.id;
            $scope.checkNoregis =true;
            // $scope.checkNoregis = (usrDokter == 1) ? false : true;
            var usia = ''
            var departemen = ''
            $scope.isLoadingNav = false
            $scope.scrollmarker = false

            if(medifirstService.getKelompokUser() == 'mahasiswadiklat'){
                $scope.textUser = medifirstService.getUserLogin().kdUser
                $scope.textNamaLengkap = medifirstService.getPegawaiLogin().namaLengkap
                $scope.scrollmarker = true
            }
            // cacheHelper.set('cacheRekamMedis', undefined);
            $scope.getRekamMedisCheck = function (checkNoregis) {
                $rootScope.getRekamMedisCheck(checkNoregis);
            }
                $scope.rekammedis = true
            if (medifirstService.getKelompokUser() == 'operator') {
                $scope.rekammedis = false
            }else{
                $scope.rekammedis = true

            }
            $scope.showNav = function () {
                $rootScope.isShowNavEMR = !$rootScope.isShowNavEMR
            }

            // norec Antrian Etateh
            medifirstService.get('emr/get-antrian-pasien-norec/' + $state.params.noRec).then(function (e) {
                var result = e.data.result
                result.umur = dateHelper.CountAge(new Date(result.tgllahir), new Date(result.tglregistrasi));
                var bln = result.umur.month,
                    thn = result.umur.year,
                    day = result.umur.day
                usia = (result.umur.year * 12) + result.umur.month;
                departemen = result.objectdepartemenfk
                result.umur = thn + ' thn ' + bln + ' bln ' + day + ' hr '
                var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
                var firstDate = new Date(result.tgllahir);
                var secondDate = new Date(result.tglregistrasi);
                var countDay = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));

                var setUsiaPengkajian = {
                    'hari': countDay,
                    'umur': thn
                }
                $scope.header.generate = true;
                $scope.header = result
                $scope.header.tgllahirs = moment($scope.header.tgllahir).format('DD-MM-YYYY')

                if (result.foto == null)
                    $scope.header.image = "../app/images/avatar.jpg"
                else
                    $scope.header.image = result.foto
                localStorage.setItem('usiaPengkajian', JSON.stringify(setUsiaPengkajian));
                localStorage.setItem('departemenPengkajian', departemen);
                $scope.hideShowForm(setUsiaPengkajian, departemen)
                setCache()
           
           
            })
            function setCache() {
                cacheHelper.set('CacheInputDiagnosaDokter', undefined);
                cacheHelper.set('InputResepApotikOrderRevCtrl', undefined);
                cacheHelper.set('InputResepApotikOrderV2Ctrl', undefined);
                cacheHelper.set('TransaksiPelayananLaboratoriumDokterRevCtrl', undefined);
                cacheHelper.set('InputTindakanPelayananDokterRevCtrl', undefined);
                cacheHelper.set('TransaksiPelayananRadiologiDokterRevCtrl', undefined);
                cacheHelper.set('cacheRMelektronik', undefined);
                cacheHelper.set('cacheCPPT', undefined);
                cacheHelper.set('cachePengkajianPasien', undefined);
                cacheHelper.set('OdontoGramDokterCtrl', undefined);
                cacheHelper.set('PengkajianSurveilansRevCtrl', undefined);
                cacheHelper.set('OrderElektromedikCtrl', undefined);
                cacheHelper.set('InputFormulirPendelegasianObatCtrl', undefined);

                var arrStr = {
                    0: $scope.header.nocm,
                    1: $scope.header.namapasien,
                    2: $scope.header.jeniskelamin,
                    3: $scope.header.noregistrasi,
                    4: $scope.header.umur,
                    5: $scope.header.kelompokpasien,
                    6: $scope.header.tglregistrasi,
                    7: $scope.header.norec,
                    8: $scope.header.norec_pd,
                    9: $scope.header.objectkelasfk,
                    10: $scope.header.namakelas,
                    11: $scope.header.objectruanganfk,
                    12: $scope.header.namaruangan,
                    13: $scope.checkNoregis,
                    14: moment($scope.header.tgllahir).format('DD-MM-YYYY'),
                    15: $scope.header.alamatlengkap,
                    16: $scope.header.dokterdpjp,
                    17: $scope.header.iddpjp,
                    18: $scope.header.tgllahir,
                    19: $scope.header.objectdepartemenfk,
                    20: $scope.header.jenispelayanan,
                    21: $scope.header.objectkelompokpasienlastfk,
                    22: $scope.header.objectjeniskelaminfk,
                    30: $scope.header.noreservasi,
                    31: $scope.header.pekerjaan,
                    32: $scope.header.tempatlahir,
                    33: $scope.header.statuspasien,
                    34: $scope.header.skoriq,
                    35: $scope.header.nik,
                    36: $scope.header.suku,
                    37: $scope.header.pendidikan,
                    38: $scope.header.agama,
                    39: $scope.header.nohp,
                }
                cacheHelper.set('CacheInputDiagnosaDokter', arrStr);
                cacheHelper.set('InputResepApotikOrderRevCtrl', arrStr);
                cacheHelper.set('InputResepApotikOrderV2Ctrl', arrStr);
                cacheHelper.set('TransaksiPelayananLaboratoriumDokterRevCtrl', arrStr);
                cacheHelper.set('InputTindakanPelayananDokterRevCtrl', arrStr);
                cacheHelper.set('TransaksiPelayananRadiologiDokterRevCtrl', arrStr);
                cacheHelper.set('cacheRMelektronik', arrStr);
                cacheHelper.set('cacheCPPT', arrStr);
                cacheHelper.set('cachePengkajianPasien', arrStr);
                cacheHelper.set('OdontoGramDokterCtrl', arrStr);
                cacheHelper.set('PengkajianSurveilansRevCtrl', arrStr);
                cacheHelper.set('cacheRekamMedis', arrStr);
                cacheHelper.set('InputFormulirPendelegasianObatCtrl', arrStr);
                cacheHelper.set('OrderElektromedikCtrl', arrStr);
                loadTreeView()
            }
            function loadTreeView() {
                var mapemr = "&departemen=" + $scope.header.objectdepartemenfk
                // if($scope.header.objectdepartemenfk == 18 && $scope.header.objectdepartemenfk == 16)
                    mapemr += "&ruangan=" + $scope.header.objectruanganfk
                $scope.isLoadingNav = true
                $scope.treeSourceMenu = [];
                $scope.dataMenu = []
                var mahasiswadiklat = ''
                if(medifirstService.getKelompokUser() == 'mahasiswadiklat'){
                    mahasiswadiklat = '&mahasiswadiklat=true'
                }
                medifirstService.get("emr/get-menu-rekam-medis-dynamic?namaemr=navigasi" + mapemr+mahasiswadiklat).then(function (e) {
                    $scope.isLoadingNav = false
                    // if(medifirstService.getKelompokUser() == 'mahasiswadiklat'){
                    //     e.data.data = [
                    //         {
                    //           "id": 112,
                    //           "kdprofile": 30,
                    //           "statusenabled": true,
                    //           "kodeexternal": null,
                    //           "namaexternal": null,
                    //           "reportdisplay": "RekamMedis.AsesmenMedis",
                    //           "namaemr": "navigasi",
                    //           "caption": "EMR",
                    //           "headfk": null,
                    //           "nourut": 1
                    //         },
                    //         {
                    //           "id": 210222,
                    //           "kdprofile": 30,
                    //           "statusenabled": true,
                    //           "kodeexternal": null,
                    //           "namaexternal": null,
                    //           "reportdisplay": "RekamMedis.CpptDinamis",
                    //           "namaemr": "navigasi",
                    //           "caption": "CPPT Rawat Jalan",
                    //           "headfk": null,
                    //           "nourut": 5
                    //         },
                    //       ]
                    // var inlineDefault = new kendo.data.HierarchicalDataSource({
                    //     data: e.data.data,
                    //     schema: {
                    //         model: {
                    //             children: "child",
                    //             expanded: false
                    //         }
                    //     }
                    // });
                    // }else{
                    //     var inlineDefault = new kendo.data.HierarchicalDataSource({
                    //         data: e.data.data,
                    //         schema: {
                    //             model: {
                    //                 children: "child",
                    //                 expanded: false
                    //             }
                    //         }
                    //     });
                    // }
                    var inlineDefault = new kendo.data.HierarchicalDataSource({
                        data: e.data.data,
                        schema: {
                            model: {
                                children: "child",
                                expanded: false
                            }
                        }
                    });
                    $scope.treeSourceMenu = inlineDefault
                    $scope.mainTreeViewMenuOption = {
                        dataBound: function (e) {
                            $('span.k-in').each(function () {
                                if ($(this).text() == 'CPPT Rawat Jalan') { $(this).addClass('gemblung') }
                                if ($(this).text() == 'Vital Sign') { $(this).addClass('gemblung') }
                                if ($(this).text() == 'Resep Elektronik') { $(this).addClass('gemblung') }

                            })
                            // var text = "CPPT Vital Sign";
                            // e.sender.element.find("span.k-in:contains(" + text + ")").addClass('kuntul');
                        },
                        dataTextField: ["caption"],
                        datakKeyField: ["id"],
                        select: onSelect,
                        dragAndDrop: false,
                        checkboxes: false
                    }
                    // var treeview = $("#treeview").data("kendoTreeView");
                    // .expandPath([2, 5])
                    $scope.showNavigasiTree =true   

                }, function (error) {
                    $scope.isLoadingNav = false
                })

            }
            function onSelect(e) {
                var data3 = e.sender.dataSource._data

                var uid_select = e.node.dataset.uid
                var idTree = '';
                var urlTrue = null;
                $scope.listBreadCumb = []

                for (var i = data3.length - 1; i >= 0; i--) {
                    if (uid_select == data3[i].uid) {
                        idTree = data3[i].id
                        urlTrue = data3[i].reportdisplay
                        break;
                    }
                    if (data3[i].child != undefined) {
                        for (var ii = data3[i].child.length - 1; ii >= 0; ii--) {
                            if (uid_select == data3[i].child[ii].uid) {
                                idTree = data3[i].child[ii].id
                                urlTrue = data3[i].child[ii].reportdisplay
                                break;
                            }
                            if (data3[i].child[ii].child != undefined) {
                                for (var iii = data3[i].child[ii].child.length - 1; iii >= 0; iii--) {
                                    if (uid_select == data3[i].child[ii].child[iii].uid) {
                                        idTree = data3[i].child[ii].child[iii].id
                                        urlTrue = data3[i].child[ii].child[iii].reportdisplay
                                        break;
                                    }
                                }
                            }

                        }
                    }

                }
                // for (let x = 0; x < data3.length; x++) {
                //   if(idTree ==data3[x].headfk){
                //     $scope.listBreadCumb.push({name:data3[x].caption}) 
                //   }                    
                // }

                var noemr = '-'
                if ($scope.dataSelected != undefined) {
                    noemr = $scope.dataSelected.noemr
                }
                if (urlTrue == null) {
                    $state.go("RekamMedis.OrderJadwalBedah.ProsedurKeselamatan", {
                        namaEMR: idTree,
                        nomorEMR: noemr
                    });
                } else {
                    $state.go(urlTrue);
                }
            }

            $scope.nav = function (state) {
                $scope.currentState = state;
                var arrStr = {
                    0: $scope.header.nocm,
                    1: $scope.header.namapasien,
                    2: $scope.header.jeniskelamin,
                    3: $scope.header.noregistrasi,
                    4: $scope.header.umur,
                    5: $scope.header.kelompokpasien,
                    6: $scope.header.tglregistrasi,
                    7: $scope.header.norec,
                    8: $scope.header.norec_pd,
                    9: $scope.header.objectkelasfk,
                    10: $scope.header.namakelas,
                    11: $scope.header.objectruanganfk,
                    12: $scope.header.namaruangan,
                    13: $scope.checkNoregis,
                    14: moment($scope.header.tgllahir).format('DD-MM-YYYY'),
                    15: $scope.header.alamatlengkap
                }
                cacheHelper.set('CacheInputDiagnosaDokter', arrStr);
                cacheHelper.set('InputResepApotikOrderRevCtrl', arrStr);
                cacheHelper.set('InputResepApotikOrderV2Ctrl', arrStr);
                cacheHelper.set('TransaksiPelayananLaboratoriumDokterRevCtrl', arrStr);
                cacheHelper.set('InputTindakanPelayananDokterRevCtrl', arrStr);
                cacheHelper.set('TransaksiPelayananRadiologiDokterRevCtrl', arrStr);
                cacheHelper.set('cacheRMelektronik', arrStr);
                cacheHelper.set('cacheCPPT', arrStr);
                cacheHelper.set('cachePengkajianPasien', arrStr);
                cacheHelper.set('OdontoGramDokterCtrl', arrStr);
                cacheHelper.set('PengkajianSurveilansRevCtrl', arrStr);
                cacheHelper.set('cacheRekamMedis', arrStr);
                cacheHelper.set('InputFormulirPendelegasianObatCtrl', arrStr);
                cacheHelper.set('OrderElektromedikCtrl', arrStr);
                
                $state.go(state, $state.params);
                // console.log($scope.currentState);

            }


            $scope.Generate = function (data) {

                if (data === true) {
                    $scope.checkNoregis = true;
                } else {
                    $scope.checkNoregis = false;
                }
            };

            $scope.hideShowForm = function (usiaPengkajian, departemen) {

                if (usiaPengkajian.hari >= 1 && usiaPengkajian.hari <= 31) { $scope.isNeonatal = true }
                if (usiaPengkajian.hari > 31 && usiaPengkajian.umur <= 17) { $scope.isAnak = true }
                if (usiaPengkajian.umur >= 18 && usiaPengkajian.umur <= 49) { $scope.isDewasa = true }
                if (usiaPengkajian.umur > 50) { $scope.isGeriatri = true }
                if (departemen == 18 || departemen == 28 || departemen == 24) { $scope.isRawatJalan = true }
                if (departemen == 16 || departemen == 35) { $scope.isRawatInap = true }

            }
            $scope.searchnoreg = function(){
                // if ($scope.dataPasienSelected == undefined) {
                //     window.messageContainer.error("Pilih Dahulu Pasien!")
                //     return
                // }
                medifirstService.get('registrasi/get-pd?noregistrasi=' + $scope.header.noregistrasi).then(function(e){
                    medifirstService.get("registrasi/daftar-registrasi/get-apd?noregistrasi=" +
                        $scope.header.noregistrasi +
                        "&objectruanganlastfk=" + e.data.objectruanganlastfk
                    ).then(function (data) {




                        // debugger;
                        // var arrStr = {
                        //     0: $scope.dataPasienSelected.nocm,
                        //     1: $scope.dataPasienSelected.namapasien,
                        //     2: $scope.dataPasienSelected.jeniskelamin,
                        //     3: $scope.dataPasienSelected.noregistrasi,
                        //     4: $scope.dataPasienSelected.umur,
                        //     5: $scope.dataPasienSelected.kelompokpasien,
                        //     6: $scope.dataPasienSelected.tglregistrasi,
                        //     7: data.data.ruangan[0].norec_apd,
                        //     8: $scope.dataPasienSelected.norec,
                        //     9: $scope.dataPasienSelected.objectkelasfk,
                        //     10: $scope.dataPasienSelected.namakelas,
                        //     11: $scope.dataPasienSelected.objectruanganlastfk,
                        //     12: $scope.dataPasienSelected.namaruangan + '`'
                        // }
                        var arrStr = {
                            0: $scope.header.nocm,
                            1: $scope.header.namapasien,
                            2: $scope.header.jeniskelamin,
                            3: $scope.header.noregistrasi,
                            4: $scope.header.umur,
                            5: $scope.header.kelompokpasien,
                            6: $scope.header.tglregistrasi,
                            7: $scope.header.norec,
                            8: $scope.header.norec_pd,
                            9: $scope.header.objectkelasfk,
                            10: $scope.header.namakelas,
                            11: $scope.header.objectruanganfk,
                            12: $scope.header.namaruangan,
                            13: $scope.checkNoregis,
                            14: moment($scope.header.tgllahir).format('DD-MM-YYYY'),
                            15: $scope.header.alamatlengkap
                        }
                        cacheHelper.set('cacheRMelektronik', arrStr);
                        $state.go('RekamMedis.VitalSign', {
                            noRec: data.data.ruangan[0].norec_apd
                        })
                    })
                })
                
            }
            // window.addEventListener("scroll", function() {
            //     var scrollMarker = document.querySelector(".scroll-marker");
            //     var scrollTop = window.scrollY;
            //     scrollMarker.style.top = scrollTop + "px";
            // });

        }
    ]);
});