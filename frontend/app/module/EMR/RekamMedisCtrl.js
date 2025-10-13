define(['initialize', 'Configuration'], function (initialize, config) {
    'use strict';
    initialize.controller('RekamMedisCtrl', ['$rootScope', '$scope', '$state', 'DateHelper', 'MedifirstService', 'CacheHelper',
        function ($rootScope, $scope, $state, dateHelper, medifirstService, cacheHelper) {
            $scope.now = new Date();
            $scope.item = {};
            $scope.header = {};
            $scope.item = $scope.item || {}

            var ALERGI_DEF = [
                { id: 1, label: 'Makanan', ketKey: 'alergiMakanan', katKey: 'kategoriAlergiMakanan' },
                { id: 2, label: 'Obat', ketKey: 'alergiObat', katKey: 'kategoriAlergiObat' },
                { id: 3, label: 'Lingkungan', ketKey: 'alergiLingkungan', katKey: 'kategoriAlergiLingkungan' },
                { id: 4, label: 'Biologis', ketKey: 'alergiBiologis', katKey: 'kategoriAlergiBiologis' }
            
            ]

            function pickByIdOrName(list, id, name){
            if (!Array.isArray(list) || !list.length) return null
            var found = list.find(function(v){ return v.id === id })
            if (found) return found
            if (name){
                var low = String(name).toLowerCase()
                return list.find(function(v){ return String(v.namaalergi||'').toLowerCase() === low }) || null
            }
            return null
            }

            function ensureAlergiDefaults(){
            if (!$scope.listKategoriAlergi || !$scope.listKategoriAlergi.length) return
            ALERGI_DEF.forEach(function(d){
                if (!$scope.item[d.katKey]) {
                var pre = pickByIdOrName($scope.listKategoriAlergi, d.id, d.label)
                if (pre) $scope.item[d.katKey] = pre
                }
            })
            }

            function collectAlergi(){
            var out = []
            ALERGI_DEF.forEach(function(d){
                var ket = ($scope.item[d.ketKey] || '').trim()
                if (!ket) return
                var katSel = $scope.item[d.katKey]
                var kategori = katSel && katSel.id ? katSel.id : d.id
                out.push({ kategori: kategori, keterangan: ket, label: d.label })
            })
            return out
            }

            // $scope.buildKetalergi = function(){
            //     var list = collectAlergi()
            //     $scope.header.ketalergi = list.map(function(x){ return x.label + ': ' + x.keterangan }).join(' | ')
            // }

            $scope.buildKetalergi = () => {
                const parts = []

                if ($scope.item.alergiObat) parts.push('Alergi Obat: ' + $scope.item.alergiObat)
                if ($scope.item.alergiLingkungan) parts.push('Alergi Lingkungan: ' + $scope.item.alergiLingkungan)
                if ($scope.item.alergiBiologis) parts.push('Alergi Biologis: ' + $scope.item.alergiBiologis)
                if ($scope.item.alergiMakanan) parts.push('Alergi Makanan: ' + $scope.item.alergiMakanan)

                $scope.header.ketalergi = parts.join('\n')
            }

            var usrDokter = medifirstService.getPegawaiLogin().jenisPegawai.id;
            $scope.checkNoregis = true;
            // $scope.checkNoregis = (usrDokter == 1) ? false : true;
            var usia = ''
            var departemen = ''
            $scope.isLoadingNav = false
            $scope.scrollmarker = false

            if (medifirstService.getKelompokUser() == 'mahasiswadiklat') {
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
            } else {
                $scope.rekammedis = true

            }
            $scope.showNav = function () {
                $rootScope.isShowNavEMR = !$rootScope.isShowNavEMR
            }

            var userlogin = medifirstService.getPegawaiLogin();
            $scope.diaDokter = false;
            if (userlogin.jenisPegawai.id == '1') {
                $scope.diaDokter = true;
            }

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            function hitungBilling(noregistrasi) {
                medifirstService.get('emr/get-total-billing?noregistrasi=' + noregistrasi).then(function (e) {
                    $scope.header.totalBilling = $scope.formatRupiah(e.data.billing, 'Rp. ')
                    $scope.header.totalBillingNominal = parseFloat(e.data.billing)
                    // $scope.header.plafonBPJS = $scope.formatRupiah(e.data.plafon, 'Rp. ')
                    // $scope.header.plafonBPJSNominal = parseFloat(e.data.plafon)
                })
            }

            // norec Antrian Etateh
            medifirstService.get('emr/get-antrian-pasien-norec/' + $state.params.noRec).then(function (e) {
                hitungBilling(e.data.result.noregistrasi)
                var result = e.data.result
                var data_sebelumnya = e.data.data_sebelumnya
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
                if(data_sebelumnya){
                    data_sebelumnya.umur = dateHelper.CountAge(new Date(data_sebelumnya.tgllahir), new Date(data_sebelumnya.tglregistrasi));
                    var bln = data_sebelumnya.umur.month,
                        thn = data_sebelumnya.umur.year,
                        day = data_sebelumnya.umur.day
                    usia = (data_sebelumnya.umur.year * 12) + data_sebelumnya.umur.month;
                    departemen = data_sebelumnya.objectdepartemenfk
                    data_sebelumnya.umur = thn + ' thn ' + bln + ' bln ' + day + ' hr '
                    $scope.data_sebelumnya = data_sebelumnya
                }
                if ($scope.header.inacbgtotalgrouper !== null) {
                    $scope.header.plafonBPJS = $scope.formatRupiah($scope.header.inacbgtotalgrouper, 'Rp. ')
                    $scope.header.inacbgtotalgrouperBPJSNominal = parseFloat($scope.header.inacbgtotalgrouper)
                } else {
                    $scope.header.plafonBPJS = $scope.formatRupiah(0, 'Rp. ')
                    $scope.header.inacbgtotalgrouperBPJSNominal = parseFloat(0)
                }
                $scope.header.tgllahirs = moment($scope.header.tgllahir).format('DD-MM-YYYY')
                $scope.item.catatanPasien = $scope.header.catatan ?? ''
                syncItemFromHeader() 
                $scope.buildKetalergi()

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
                    40: $scope.header.ketalergi,
                    41: $scope.header.pekerjaanlain,
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
                if (medifirstService.getKelompokUser() == 'mahasiswadiklat') {
                    mahasiswadiklat = '&mahasiswadiklat=true'
                }
                medifirstService.get("emr/get-menu-rekam-medis-dynamic?namaemr=navigasi" + mapemr + mahasiswadiklat).then(function (e) {
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
                    $scope.showNavigasiTree = true

                }, function (error) {
                    $scope.isLoadingNav = false
                })

                // medifirstService.get("emr/get-kategori-alergi").then(function (dat) {
                //     $scope.listKategoriAlergi = dat.data.kategorialergi
                // })
                medifirstService.get("emr/get-kategori-alergi").then(function (dat) {
                    $scope.listKategoriAlergi = dat.data.kategorialergi || []
                    ensureAlergiDefaults()

                    $scope.$watchGroup([
                    'item.alergiObat',
                    'item.alergiLingkungan',
                    'item.alergiBiologis',
                    'item.alergiMakanan',
                    'item.kategoriAlergiObat.id',
                    'item.kategoriAlergiLingkungan.id',
                    'item.kategoriAlergiBiologis.id',
                    'item.kategoriAlergiMakanan.id'
                    ], function(){ $scope.buildKetalergi() })
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
                    cacheHelper.set('cacheSelectedMenuId', idTree);
                    $rootScope.$broadcast('onMenuNavSelected', { id: idTree });
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
            $scope.searchnoreg = function () {
                // if ($scope.dataPasienSelected == undefined) {
                //     window.messageContainer.error("Pilih Dahulu Pasien!")
                //     return
                // }
                medifirstService.get('registrasi/get-pd?noregistrasi=' + $scope.header.noregistrasi).then(function (e) {
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

            $scope.iCare = function () {
                if ($scope.header.nobpjs == undefined) {
                    toastr.warning("Pasien tidak tidak memiliki No. BPJS", "Peringatan")
                    return
                }
                if ($scope.header.nosep == undefined) {
                    toastr.warning("Pasien tidak tidak memiliki SEP", "Peringatan")
                    return
                }
                $scope.isRouteLoading = false;
                var json = {
                    "url": `SEP/${$scope.header.nosep}`,
                    "method": "GET",
                    "data": null
                }
                medifirstService.postNonMessage("bridging/bpjs/tools", json).then(function (e) {
                    $scope.isRouteLoading = false;
                    if (e.data.metaData.code === "200") {
                        $scope.dataSep = e.data.response;
                        $scope.item.dpjpSurkon = $scope.dataSep.dpjp.nmDPJP;
                        $scope.item.kodedpjpSurkon = $scope.dataSep.dpjp.kdDPJP;
                    } else {
                        window.messageContainer.error("Sep tidak ditemukan !");
                        return
                    }

                    var dpjpLayan = $scope.item.kodedpjpSurkon
                    let Send = {
                        "url": "api/rs/validate",
                        "method": "POST",
                        "jenis": "i-care",
                        "data": {
                            "param": $scope.header.nobpjs,
                            "kodedokter": dpjpLayan ? parseInt(dpjpLayan) : null
                        }
                    }
                    medifirstService.postNonMessage("bridging/bpjs/tools", Send).then(function (e) {
                        if (e.data.metaData.code == "200") {
                            window.open(e.data.response.url, "_blank")
                        } else {
                            window.messageContainer.error(e.data.metaData.message);
                        }
                    })
                })
            }
            // window.addEventListener("scroll", function() {
            //     var scrollMarker = document.querySelector(".scroll-marker");
            //     var scrollTop = window.scrollY;
            //     scrollMarker.style.top = scrollTop + "px";
            // });

            function syncItemFromHeader() {
                $scope.item.alergiObat        = $scope.header.ketalergi || ''
                $scope.item.alergiLingkungan  = $scope.header.ketalergilingkungan || ''
                $scope.item.alergiBiologis    = $scope.header.ketalergibiologis || ''
                $scope.item.alergiMakanan     = $scope.header.ketalergimakanan || ''
            }

            $scope.alergi = function () {
                // $scope.item.alergi = $scope.header.ketalergi
                // syncItemFromHeader()
                $scope.popUpAlergi.open().center()
                $scope.buildKetalergi()
            }

            // $scope.simpanAlergi = function () {
            //     var objSave = {
            //         norec_pd: $scope.header.norec_pd,
            //         keterangan: $scope.item.alergi,
            //         objectalergifk: $scope.item.kategoriAlergi.id
            //     }
            //     medifirstService.post('emr/post-riwayatalergi-v2', objSave).then(function (e) {
            //         $scope.header.ketalergi = e.data.data.ketalergi
            //         $scope.popUpAlergi.close();
            //     });
            // }

            $scope.simpanAlergi = function () {
                const payload = {
                    norec_pd: $scope.header.norec_pd,

                    ketalergi: $scope.item.alergiObat || null,
                    objectalergifk: $scope.item.kategoriAlergiObat?.id || null,

                    ketalergilingkungan: $scope.item.alergiLingkungan || null,
                    objectalergilingkunganfk: $scope.item.kategoriAlergiLingkungan?.id || null,

                    ketalergibiologis: $scope.item.alergiBiologis || null,
                    objectalergibiologisfk: $scope.item.kategoriAlergiBiologis?.id || null,
                    
                    ketalergimakanan: $scope.item.alergiMakanan || null,
                    objectalergimakananfk: $scope.item.kategoriAlergiMakanan?.id || null,
                }

                medifirstService.post('emr/post-riwayatalergi-v2', payload).then(function (res) {
                    $scope.header.ketalergi = payload.ketalergi
                    $scope.buildKetalergi()
                    $scope.popUpAlergi.close()
                })
            }

            $scope.tutupAlergi = function () {
                $scope.popUpAlergi.close();
            }

            $scope.riwayatKunjungan = function () {
                $scope.popUpRiwayatKunjungan.open().center();
                $scope.loadDataSOAP();
                loadRiwayatLab('noregistrasi=' + $scope.data_sebelumnya.noregistrasi);
                loadRiwayatRad('noregistrasi=' + $scope.data_sebelumnya.noregistrasi);
                loadOrderObat('noreg=' + $scope.data_sebelumnya.noregistrasi)
            }

            $scope.formatTanggal = function (tanggal) {
                if (!tanggal) return '-';
                return moment(tanggal).format('DD-MMM-YYYY HH:mm');
            }

            //start soap

            $scope.isDetailSOAP = false;
            $scope.listDetailSOAP = [];
            
            $scope.columnSOAP = {
                selectable: 'row',
                pageable: true,
                columns: [
                    { field: "tglemr", title: "Tgl EMR", width: "120px", template: "<span class='style-left'>{{formatTanggal('#: tglemr #')}}</span>" },
                    { field: "noemr", title: "No EMR", width: "100px" },
                    { field: "namalengkap", title: "Pegawai", width: "150px" },
                    { field: "namaruangan", title: "Ruangan", width: "150px" },
                    { field: "tglregistrasi", title: "Tgl Registrasi", width: "120px", template: "<span class='style-left'>{{formatTanggal('#: tglregistrasi #')}}</span>" },
                    { field: "noregistrasifk", title: "No Registrasi", width: "100px" }
                ]
            };

            $scope.loadDataSOAP = function () {
                var Noregistrasi_Sebelumnya = $scope.data_sebelumnya.noregistrasi || "";
                $scope.isRouteLoading = true;
                medifirstService.get("emr/get-emr-transaksi?noregistrasi=" + Noregistrasi_Sebelumnya + "&jenisEmr=cppt", true).then(function (dat) {
                    $scope.isRouteLoading = false;
                    $scope.dataSourceSOAP = new kendo.data.DataSource({
                        data: dat.data.data,
                        pageSize: 10,
                        serverPaging: false
                    });
                }, function(err) {
                    $scope.isRouteLoading = false;
                });
            }

            $scope.show = { obj: [] };
            $scope.showbtnadd = [];
            $scope.showbtnremove = [];
            $scope.listPegawai = [];
            $scope.listJenisPegawai = [];

            medifirstService.getPart('emr/get-datacombo-part-pegawai', true, true, 20).then(function (data) {
                $scope.listPegawai = data;
            });

            medifirstService.getPart("sysadmin/general/get-datacombo-jenispegawai-cppt", true, true, 20).then(function (data) {
                $scope.listJenisPegawai = data;
            });

            $scope.addobj = function(idAwal, idAkhir) {
                $scope.show.obj[idAkhir] = true;
                $scope.showbtnadd[idAwal] = false;
                $scope.showbtnadd[idAkhir] = true;
                $scope.showbtnremove[idAkhir] = true;
                $scope.showbtnremove[idAwal] = false;
            }

            $scope.removeobj = function(idAwal, idAkhir) {
                $scope.show.obj[idAwal] = false;
                $scope.showbtnadd[idAkhir] = true;
                $scope.showbtnremove[idAkhir] = false;
                $scope.showbtnremove[idAwal] = true;
            }

            $scope.listDataCppt = [
                {
                    "id": 22034963, "nama": "Baris satu",
                    "detail": [
                        { "id": 22034961, "nama": "tgl/jam", "type": "tgl/jam" },
                        { "id": 22034962, "nama": "ppa", "type": "ppa" },
                        { "id": 22034963, "id2": 22034964, "nama": "soap", "type": "soap" },
                        { "id": 22034965, "nama": "intruksi", "type": "intruksi" },
                        { "id": 22034966, "id2": 22034967, "id3": 22034968, "nama": "review", "type": "review" },
                    ]
                },
                {
                    "id": 22034971, "nama": "Baris satu",
                    "detail": [
                        { "id": 22034969, "nama": "tgl/jam", "type": "tgl/jam" },
                        { "id": 22034970, "nama": "ppa", "type": "ppa" },
                        { "id": 22034971, "id2": 22034972, "nama": "soap", "type": "soap" },
                        { "id": 22034973, "nama": "intruksi", "type": "intruksi" },
                        { "id": 22034974, "id2": 22034975, "id3": 22034976, "nama": "review", "type": "review" },
                    ]
                },
                {
                    "id": 22034979, "nama": "Baris satu",
                    "detail": [
                        { "id": 22034977, "nama": "tgl/jam", "type": "tgl/jam" },
                        { "id": 22034978, "nama": "ppa", "type": "ppa" },
                        { "id": 22034979, "id2": 22034980, "nama": "soap", "type": "soap" },
                        { "id": 22034981, "nama": "intruksi", "type": "intruksi" },
                        { "id": 22034982, "id2": 22034983, "id3": 22034984, "nama": "review", "type": "review" },
                    ]
                },
                {
                    "id": 22034987, "nama": "Baris satu",
                    "detail": [
                        { "id": 22034985, "nama": "tgl/jam", "type": "tgl/jam" },
                        { "id": 22034986, "nama": "ppa", "type": "ppa" },
                        { "id": 22034987, "id2": 22034988, "nama": "soap", "type": "soap" },
                        { "id": 22034989, "nama": "intruksi", "type": "intruksi" },
                        { "id": 22034990, "id2": 22034991, "id3": 22034992, "nama": "review", "type": "review" },
                    ]
                },
                {
                    "id": 22034995, "nama": "Baris satu",
                    "detail": [
                        { "id": 22034993, "nama": "tgl/jam", "type": "tgl/jam" },
                        { "id": 22034994, "nama": "ppa", "type": "ppa" },
                        { "id": 22034995, "id2": 22034996, "nama": "soap", "type": "soap" },
                        { "id": 22034997, "nama": "intruksi", "type": "intruksi" },
                        { "id": 22034998, "id2": 22034999, "id3": 22035000, "nama": "review", "type": "review" },
                    ]
                },
                {
                    "id": 22035003, "nama": "Baris satu",
                    "detail": [
                        { "id": 22035001, "nama": "tgl/jam", "type": "tgl/jam" },
                        { "id": 22035002, "nama": "ppa", "type": "ppa" },
                        { "id": 22035003, "id2": 22035004, "nama": "soap", "type": "soap" },
                        { "id": 22035005, "nama": "intruksi", "type": "intruksi" },
                        { "id": 22035006, "id2": 22035007, "id3": 22035008, "nama": "review", "type": "review" },
                    ]
                }
            ];

            $scope.lihatDetailSOAP = function () {
                if (!$scope.dataSelectedSOAP) {
                    toastr.warning("Pilih data CPPT terlebih dahulu");
                    return;
                }
                var noemr = $scope.dataSelectedSOAP.noemr;
                var emrfk = $scope.dataSelectedSOAP.emrfk;
                
                $scope.isRouteLoading = true;
                medifirstService.get("emr/get-emr-transaksi-detail?noemr=" + noemr + "&emrfk=" + emrfk, true).then(function (dat) {
                    $scope.isRouteLoading = false;
                    $scope.item.obj = [];
                    var dataLoad = dat.data.data;
                    for (var i = 0; i <= dataLoad.length - 1; i++) {
                        if (parseFloat(emrfk) == dataLoad[i].emrfk) {
                            if (dataLoad[i].type == "textbox") {
                                $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value;
                            }
                            if (dataLoad[i].type == "datetime" || dataLoad[i].type == "datetime2" || dataLoad[i].type == "time" || dataLoad[i].type == "date") {
                                $scope.item.obj[dataLoad[i].emrdfk] = new Date(dataLoad[i].value);
                            }
                            if (dataLoad[i].type == "textarea") {
                                $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value;
                            }
                            if (dataLoad[i].type == "combobox2" || dataLoad[i].type == "combobox" || dataLoad[i].type == "combobox3") {
                                var str = dataLoad[i].value;
                                if(str != undefined){
                                    var res = str.split("~");
                                    $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: res[1] };
                                }   
                            }
                        }
                    }

                    for(let x=0; x < $scope.listDataCppt.length; x++) {
                        let row = $scope.listDataCppt[x];
                        let hasData = false;
                        for(let y=0; y < row.detail.length; y++) {
                            let field = row.detail[y];
                            if ($scope.item.obj[field.id] || $scope.item.obj[field.id2] || $scope.item.obj[field.id3]) {
                                hasData = true; break;
                            }
                        }
                        if(hasData) {
                            $scope.show.obj[row.id] = true;
                            $scope.showbtnadd[row.id] = true;
                            $scope.showbtnremove[row.id] = true;
                        } else {
                            $scope.show.obj[row.id] = false;
                        }
                    }
                    if(!$scope.show.obj[22034963]) {
                        $scope.show.obj[22034963] = true;
                        $scope.showbtnadd[22034963] = true;
                        $scope.showbtnremove[22034963] = false;
                    }

                    $scope.isDetailSOAP = true;
                }, function(err){
                    $scope.isRouteLoading = false;
                });
            }

            $scope.kembaliSOAP = function () {
                $scope.isDetailSOAP = false;
            }

            //end soap

            //start lab

            $scope.columnGridRiwayatLab = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "20px",
                },
                {
                    "field": "noregistrasi",
                    "title": "No Registrasi",
                    "width": "70px",
                },
                {
                    "field": "tglorder",
                    "title": "Tgl Order",
                    "width": "50px",
                },
                {
                    "field": "noorder",
                    "title": "No Order",
                    "width": "60px",
                },
                {
                    "field": "dokter",
                    "title": "Dokter",
                    "width": "100px"
                },
                {
                    "field": "namaruanganasal",
                    "title": "Ruangan Asal",
                    "width": "100px",
                },
                {
                    "field": "namaruangantujuan",
                    "title": "Ruangan",
                    "width": "100px",
                },
                {
                    "field": "keteranganlainnya",
                    "title": "Keterangan",
                    "width": "100px",
                },

                {
                    "field": "statusorder",
                    "title": "Status",
                    "width": "70px",
                },
                {
                    "field": "cito",
                    "title": "Cito",
                    "template": '# if( cito==true) {# ✔ # } else {# ✘ #} #',
                    "width": "70px",
                }
            ];

            $scope.detailGridOptionsLab = function (dataItem) {
                return {
                    dataSource: new kendo.data.DataSource({
                        data: dataItem.details
                    }),
                    columns: [
                        {
                            field: "namaproduk",
                            title: "Deskripsi",
                            width: "300px"
                        },
                        {
                            field: "qtyproduk",
                            title: "Qty",
                            width: "100px"
                        }]
                };
            };

            function loadRiwayatLab(params) {
                medifirstService.get('emr/get-riwayat-lab?' + params).then(function(response){
                    let data = response.data.map((item, index) => ({no: index+1, ...item}))
                    $scope.dataGridRiwayatLab = new kendo.data.DataSource({
                        data: data,
                        pageSize: 10
                    });

                })
            }

           $scope.LihatHasilLab = function (data) {
                if ($scope.dataSelectedRiwayatLab == undefined) {
                    toastr.error('Pilih data dulu');
                    return
                }
                cacheHelper.set('hideHasilLab', undefined);
                var daftarCetak = [];
                console.log($scope.dataSelectedRiwayatLab);
                    if ($scope.dataSelectedRiwayatLab.details != undefined) {
                        for (let j = 0; j < $scope.dataSelectedRiwayatLab.details.length; j++) {
                            console.log($scope.dataSelectedRiwayatLab.details[j].norec_pp);
                            daftarCetak.push({
                                "norec_pp": $scope.dataSelectedRiwayatLab.details[j].norec_pp,
                            })
                        }
                    }

                var dataCetakFix = '';
                var result = ''
                for (let i = 0; i < daftarCetak.length; i++) {
                    const element = daftarCetak[i];
                    if (daftarCetak.length == 1) {
                        dataCetakFix = "'" + element.norec_pp + "'"
                    } else if (daftarCetak.length == i + 1) {
                        dataCetakFix = dataCetakFix + "" + "'" + element.norec_pp + "'" + ""
                    } else {
                        dataCetakFix = dataCetakFix + "" + "'" + element.norec_pp + "'" + ","
                    }

                }
                if (daftarCetak.length == 0) {
                    toastr.warning('Data Tidak Ada', 'Peringatan')
                    return
                }
                if ($scope.data_sebelumnya.norec != null) {
                    var arrStr = {
                        0: $scope.data_sebelumnya.nocm,
                        1: $scope.data_sebelumnya.namapasien,
                        2: $scope.data_sebelumnya.jeniskelamin,
                        3: $scope.data_sebelumnya.noregistrasi,
                        4: $scope.data_sebelumnya.umur,
                        5: $scope.data_sebelumnya.kelompokpasien,
                        6: $scope.data_sebelumnya.tglregistrasi,
                        7: $scope.data_sebelumnya.norec,
                        8: $scope.data_sebelumnya.norec_pd,
                        9: $scope.data_sebelumnya.objectkelasfk,
                        10: $scope.data_sebelumnya.namakelas,
                        11: $scope.data_sebelumnya.objectruanganfk,
                        12: $scope.data_sebelumnya.namaruangan,
                        13: $scope.data_sebelumnya.tgllahir,
                        14: $scope.data_sebelumnya.objectjeniskelaminfk,
                        15: dataCetakFix,
                        16: $scope.dataSelectedRiwayatLab.norec,
                    }
                    console.log(dataCetakFix);
                    cacheHelper.set('hideHasilLab', true);
                    cacheHelper.set('chaceHasilLab2', arrStr);

                    window.open("/app/#/SGFzaWxMYWJvcmF0b3JpdW1SZXY=/" + $scope.data_sebelumnya.norec_pd + "/" + $scope.dataSelectedRiwayatLab.norec_apdlab)
                }

            }

            //end lab

            //start rad

            $scope.columnGridRiwayatRad = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "20px",
                },
                {
                    "field": "noregistrasi",
                    "title": "No Registrasi",
                    "width": "70px",
                },
                {
                    "field": "tglorder",
                    "title": "Tgl Order",
                    "width": "50px",
                },
                {
                    "field": "noorder",
                    "title": "No Order",
                    "width": "60px",
                },
                {
                    "field": "dokter",
                    "title": "Dokter",
                    "width": "100px"
                },
                {
                    "field": "namaruangantujuan",
                    "title": "Ruangan",
                    "width": "100px",
                },
                {
                    "field": "keteranganlainnya",
                    "title": "Keterangan",
                    "width": "100px",
                },
                {
                    "field": "statusorder",
                    "title": "Status",
                    "width": "70px",
                },
                {
                    "field": "cito",
                    "title": "Cito",
                    "template": '# if( cito==true) {# ✔ # } else {# ✘ #} #',
                    "width": "70px",
                },
                {
                    "field": "keterangantolak",
                    "title": "Keterangan Tolak Order",
                    "width": "70px",
                }
            ];
            $scope.detailGridOptionsRad = function (dataItem) {
                for (var i = 0; i < dataItem.details.length; i++) {
                    dataItem.details[i].no = i + 1
                    if (dataItem.details[i].norec_hr != undefined && dataItem.details[i].norec_hr != '') {
                        dataItem.details[i].expertise = "✔";
                        // ✅
                        // ✔ expertise
                    } else {
                        dataItem.details[i].expertise = "✘";
                        // ✘
                        // ❎
                    }

                }
                return {
                    dataSource: new kendo.data.DataSource({
                        data: dataItem.details
                    }),
                    columns: [
                        // {
                        //       field: "no",
                        //       title: "No",
                        //       width: "30px"
                        //   },
                        {
                            field: "namaproduk",
                            title: "Deskripsi",
                            width: "200px"
                        },
                        {
                            field: "expertise",
                            title: "Expertise",
                            width: "100px"
                        },
                        {
                            field: "qtyproduk",
                            title: "Qty",
                            width: "100px"
                        },
                        {
                            "command": [{
                                text: "Expertise",
                                click: experTise,
                                imageClass: "k-icon k-i-pencil"
                            },
                            {
                                text: "Lihat Hasil",
                                click: hasilRadDetil,
                                imageClass: "k-icon k-i-download"
                            }
                            ],
                            title: "",
                            width: "150px",
                        }]
                };
            };

            $scope.click = function (dataSelectedRiwayatRad) {
                if (dataSelectedRiwayatRad != undefined) {
                    $scope.noOrder = dataSelectedRiwayatRad.noorder;
                    medifirstService.get("sysadmin/general/get-acc-number-radiologi?noOrder=" + $scope.noOrder)
                        .then(function (e) {
                            $scope.dataRisOrder = e.data.data[0]

                        })
                }
            }

            $scope.klikGrid = function (dataSelected) {
                var dataProduk = [];
                //no:no,
                $scope.item.no = dataSelected.no
                for (var i = $scope.listLayanan.length - 1; i >= 0; i--) {
                    if ($scope.listLayanan[i].id == dataSelected.produkfk) {
                        dataProduk = $scope.listLayanan[i]
                        break;
                    }
                }
                $scope.item.layanan = dataProduk;//{id:dataSelected.produkfk,namaproduk:dataSelected.namaproduk}
                // $scope.item.stok = dataSelected.jmlstok //* $scope.item.nilaiKonversi 

                $scope.item.qty = dataSelected.qtyproduk
            }

            function loadRiwayatRad(params) {
                medifirstService.get('emr/get-riwayat-order-radiologi?' + params).then(function (e) {
                    for (var i = e.data.daftar.length - 1; i >= 0; i--) {
                        e.data.daftar[i].no = i + 1
                    }

                    for (var i = 0; i < e.data.daftar.length; i++) {
                        let details = e.data.daftar[i].details;
                        let risorder = e.data.daftar[i].risorder;
                        for (let yy = 0; yy < details.length; yy++) {
                            for (let zz = 0; zz < risorder.length; zz++) {
                                if (details[yy].norecopfk === risorder[zz].norec_op_fk) {
                                    e.data.daftar[i].details[yy].radiologiId = risorder[zz].patient_id + '-' + risorder[zz].order_cnt
                                }
                            }
                        }
                    }

                    $scope.dataGridRiwayatRad = new kendo.data.DataSource({
                        data: e.data.daftar,
                        pageSize: 10
                    });

                });
            }

            function experTise(e) {
                e.preventDefault();

                var tr = $(e.target).closest("tr");
                var dataItem = this.dataItem(tr);
                $scope.norecHasilRadiologi = ''
                $scope.dataSelectedDetail = {}
                $scope.dataSelectedDetail = dataItem
                medifirstService.get('radiologi/get-pelayananpasien-radiologi?norec=' + dataItem.norec_pp + '&produkfk=' + dataItem.id).then(function (re) {
                    if (re.data.data == undefined || re.data.data == '' || re.data.data == null) {
                        toastr.error("Belum ada Expertise!");
                        return;
                    }
                    $scope.norecHasilRadiologi = re.data.data.norec;
                    $scope.item.nofoto = re.data.data.nofoto;
                    $scope.item.namalengkap = re.data.data.namalengkap;
                    $scope.item.tglInput = re.data.data.tanggal;
                    $scope.item.keterangan = re.data.data.keterangan.replace(/~/ig, '\n');
                    $scope.popUpEkpertise.center().open();
                })

                medifirstService.get('radiologi/get-ekspertise?norec_pp=' + dataItem.norec_pp).then(function (e) {
                    if (e.data.status) {
                        if (e.data.data.list.length > 0) {
                            $scope.cekhasilrad = false;
                            $scope.listNamaGambar = e.data.data.list;
                            $scope.itemimg.gambar = { norec: e.data.data.list[0].norec, filename: e.data.data.list[0].filename }
                            $scope.itemimg.keterangan = e.data.data.list[0].keterangan
                            var temp = e.data.data.list[0].filename.slice(0, e.data.data.list[0].filename.indexOf('.'))
                            $scope.itemimg.img = config.urlPACSJpeg + "/service/medifirst2000/radiologi/images/pacs/" + temp + "/jpg"
                        }
                    } else {
                        $scope.cekhasilrad = true;
                        $scope.itemimg.img = "./images/noimage.png"
                        window.messageContainer.error("Belum Ada Ekspertise.");
                    }
                }).error(function (err) {
                    $scope.item.img = "./images/noimage.png"
                });
            }

            var hasilRadDetil = function (e) {
                e.preventDefault();
                var tr = $(e.target).closest("tr");
                var dataItem = this.dataItem(tr);
                if (dataItem.radiologiId === undefined || dataItem.radiologiId === null || dataItem.radiologiId === '') {
                    toastr.warning('Hasil belum ada', 'Peringatan')
                } else {
                    // syamsu
                    var datauserlogin = JSON.parse(localStorage.getItem('datauserlogin'));

                    var patienIdMr = dataItem.radiologiId.replace('null', '1')
                    var client = new HttpClient();

                    let viewer = null

                    var errorFunc = function () {
                        toastr.error('Ada kesalahan pada jaringan ke server', 'Kesalahan')
                    }

                    let awal = true

                    var noMrFunc = function (response) {
                        if (response === undefined || response === null || response == '') {
                            if (awal) {
                                awal = false
                                client.get(config.urlPACSEngine + '/dcm4chee-arc/aets/TRANSMEDIC/rs/' +
                                    'studies?limit=1&includefield=all&offset=0&PatientID=' + patienIdMr.split('-')[0],
                                    noMrFunc, errorFunc)
                            } else {
                                toastr.warning('Hasil foto belum dikirim ke PACS', 'Peringatan')
                            }
                        } else {
                            let data = JSON.parse(response)
                            viewer = data[0]["0020000D"].Value[0]
                            window.open(config.urlPACSViewer + "/viewer/" + datauserlogin.id + "/" + dataItem.norec_pp + "/" + dataItem.noorder + "/" + viewer, "pacs");
                        }
                    }

                    client.get(config.urlPACSEngine + '/dcm4chee-arc/aets/TRANSMEDIC/rs/' +
                        'studies?limit=1&includefield=all&offset=0&PatientID=' + patienIdMr,
                        noMrFunc, errorFunc)
                    // syamsu
                }
            };

            $scope.selectImage = function () {
                console.log($scope.itemimg.gambar.keterangan)
                $scope.itemimg.keterangan = $scope.itemimg.gambar.keterangan
                var temp = $scope.itemimg.gambar.filename.slice(0, $scope.itemimg.gambar.filename.indexOf('.'))
                $scope.itemimg.img = config.urlPACSJpeg + "/service/medifirst2000/radiologi/images/pacs/" + temp + "/jpg"
            }

            $scope.CheckImage = function () {
                // console.log($scope.itemimg.img)
                // console.log($scope.itemimg)
                // console.log($scope.itemimg.keterangan)
                var ket = $scope.itemimg.keterangan == null ? '' : $scope.itemimg.keterangan
                var html = "<style>"
                    + "body{background-color: black; margin: 0px}"
                    + ".frame-left{width: 100%; height: 86vh;  text-align: center; border: 1px solid #ffffff}"
                    + ".frame-right{width: 350px; margin-left: 5px; padding-left: 5px; padding-right: 5px; height: 86vh; background: black; border: 1px solid #ffffff}"
                    + "p{color: white; padding: 5px; margin: auto; font-family: 'Comfortaa', cursive;}"
                    + "h3{color: white; padding: 5px 0px 0px 0px; margin: auto; font-family: 'Comfortaa', cursive;}"
                    + ".container{margin: auto; padding-top: 5px; width: 100%; display: flex;}"
                    + "img{max-width: 90%; max-height: 90%; margin-top: 15px; padding: 20px}"
                    + "#header{background-color: #2a2d33;padding: 10px;}"
                    + ".title-top{font-family: 'Comfortaa', cursive;}"
                    + "</style>"
                    + "<head>"
                    + "<link href='https://fonts.googleapis.com/css2?family=Comfortaa&display=swap' rel='stylesheet'>"
                    + "<title>E-Healthcare | RSUD CIBINONG  :: Transmedic - PACS Viewer</title>"
                    + "</head>"
                    + "<div id='header'>"
                    + "<div style='margin-top: 9px'><span style='color:#ffffff; margin-left: 35px; font-size: 20pt !important; font-weight: bold; margin-top: 9px'>"
                    + "<span class='title-top'>Transmedic </span>"
                    + "<span class='title-top' style='font-weight: bold; color:#10c4b2;'>PACS Viewer</span>"
                    + "</span>"
                    + "<br>"
                    + "<span class='title-top' style='color:#ffffff; font-size: 10pt; font-style: italic; margin-left: 40px; margin-top: 2px;'>"
                    + "E-Healthcare | RSUD CIBINONG"
                    + "</span></div>"
                    + "</div>"
                    + "<div class='container'>"
                    + "<div class='frame-left'><img src='" + $scope.itemimg.img
                    + "'></></div>"
                    + "<div class='frame-right'><h3>Informasi dari Gambar: </h3><p style='font-size: 13px;'> "
                    + ket.replace(/\/n/g, '<br>')
                    + "</p></div>"
                    + "</div>"

                var tab = window.open('http://localhost', '_BLANK');
                tab.document.write(html);
            }

            $scope.cetakEks = function(){
				if ($scope.norecHasilRadiologi != '') {
                    var local = JSON.parse(localStorage.getItem('profile'))
                    var nama = medifirstService.getPegawaiLogin().namaLengkap
                    if (local != null) {
                        var profile = local.id;
                        window.open(config.baseApiBackend + "report/cetak-ekspertise?norec=" + $scope.norecHasilRadiologi + '&kdprofile=' + profile
                            + '&nama=' + nama, '_blank');
                    }
				}
				$scope.popUpEkpertise.close();
			}

            //end rad

            //start obat

            $scope.columnGridRiwayatObat = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "20px",
                },
                {
                    "field": "tglorder",
                    "title": "Tgl Order",
                    "width": "50px",
                },
                {
                    "field": "noorder",
                    "title": "No Order",
                    "width": "60px",
                },
                {
                    "field": "namalengkap",
                    "title": "Dokter",
                    "width": "100px"
                },
                {
                    "field": "namaruangan",
                    "title": "Apotik",
                    "width": "70px",
                },
                {
                    "field": "statusorder",
                    "title": "Status",
                    "width": "70px",
                },
                {
                    "field": "cekreseppulang",
                    "title": "Resep Pulang",
                    "width": "50px",
                },
                {
                    "field": "cito",
                    "title": "Cito",
                    "width": "50px",
                },
                 {
                    "field": "isambilobat",
                    "title": "Resep Di Ambil Di RS",
                    "width": "50px",
                }
            ];
            $scope.detailGridOptionsObat = function (dataItem) {
                return {
                    dataSource: new kendo.data.DataSource({
                        data: dataItem.details,
                        group: $scope.group
                    }),
                    columns: [
                        {
                            field: "rke",
                            title: "Rke",
                            width: "30px",
                            groupFooterTemplate: " "
                        },
                        {
                            field: "jeniskemasan",
                            title: "Jenis Layanan Resep",
                            width: "100px",
                        },
                        {
                            field: "namaproduk",
                            title: "Nama Obat / Alkes",
                            width: "200px"
                        },
                        {
                            field: "satuanstandar",
                            title: "Sediaan",
                            width: "100px"
                        },
                        {
                            field: "dosis",
                            title: "Dosis",
                            width: "100px"
                        },
                        
                        {
                            field: "jumlah",
                            title: "Jumlah",
                            width: "100px"
                        },
                        {
                            field: "aturanpakai",
                            title: "Signa",
                            width: "100px"
                        },
                        {
                            field: "keterangan",
                            title: "Keterangan",
                            width: "100px"
                        },
                        {
                            "field": "tglkadaluarsa",
                            "title": "Tgl Exp",
                            "width": "90px",                   
                        }
                    ]
                };
            };

            function loadOrderObat(params){
                medifirstService.get("emr/get-daftar-detail-order?" + params, true).then(function (e) {
                    for (var i = e.data.length - 1; i >= 0; i--) {
                        e.data[i].no = i + 1                        
                        if (e.data[i].reseppulang == 1) {
                            e.data[i].cekreseppulang = "✔"                            
                        }else{
                            e.data[i].cekreseppulang = "-"
                        }
                         if (e.data[i].isambilobat == true) {
                            e.data[i].isambilobat = "✔"                            
                        }else{
                            e.data[i].isambilobat = "✘"
                        }

                        if (e.data[i].cito == true) {
                            e.data[i].cito = "✔"                            
                        }else{
                            e.data[i].cito = "✘"
                        }
                    }
                    $scope.dataGridRiwayatObat = new kendo.data.DataSource({
                        data: e.data,
                        pageSize: 10
                    });


                });
            }

            //end obat

            function cekCloseEmr() {
                medifirstService.get('registrasi/cek-close-emr?norec_pd='
                        + $scope.header.norec_pd).then(function (e) {
                        if (e.data.akses == false) {
                            toastr.warning('Akses Simpan EMR sudah ditutup, harap hubungi Rekam Medis untuk membuka akses!')
                            $scope.tombolSimpanVis = false
                    }
                })
            }
        }
    ]);
});