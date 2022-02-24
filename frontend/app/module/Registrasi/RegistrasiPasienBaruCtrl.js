define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict';
    initialize.controller('RegistrasiPasienBaruCtrl', ['$q', '$scope', '$state', 'CacheHelper', 'MedifirstService', 'DateHelper', 'ModelItem',
        function ($q, $scope, $state, cacheHelper, medifirstService, dateHelper, ModelItem) {
            $scope.title = 'Pendaftaran Pasien';
            $scope.item = {};
            $scope.now = new Date();
            $scope.isBayi = false;
            $scope.isEditPasien = false;
            $scope.isPenunjang = false;
            $scope.isRouteLoading = false
            $scope.reservasi = {}
            $scope.item.image = "../app/images/avatar.jpg"
            loadCombo()
            init()
            function init() {

                cacheHelper.set('cacheStatusPasien', undefined);
                $scope.noCmIbu = cacheHelper.get('CacheRegisBayi');
                $scope.nocmIgd = cacheHelper.get('CacheRegisTriage')
                if ($state.params.noRec != undefined && $state.params.noRec != 0 && $state.params.noRec != "") {
                    getPasienOnline();
                }
                else if ($scope.noCmIbu != undefined) {
                    $scope.isBayi = true;
                    $scope.title = 'Pendaftaran Pasien Bayi';
                    $scope.item.tglLahir = $scope.now
                    getPasienBayi();
                    cacheHelper.set('CacheRegisBayi', undefined)
                }
                else if ($state.params.idPasien != undefined && $state.params.idPasien != 0 && $state.params.idPasien != "") {
                    $scope.idPasien = parseInt($state.params.idPasien)
                    $scope.title = 'Edit Data Pasien';
                    editPasien();
                } else if ($state.params.departemen != undefined && $state.params.departemen != 0) {
                    $scope.isPenunjang = true
                    // var namaField = '';
                    // if ($state.params.departemen == 'Radiologi') {
                    //     namaField = 'KdDepartemenInstalasiRadiologi'
                    // }
                    // if ($state.params.departemen == 'Lab') {
                    //     namaField = 'KdDepartemenInstalasiLaboratorium'
                    // }
                    // var kelompokUserLogin = ModelItem.getStatusUser()
                    // medifirstService.get("settingdatafixed/get/" + kelompokUserLogin).then(function (e) {
                    //     $state.params.idDepartemen = e.data
                    // })
                }

                if ($scope.nocmIgd != undefined) {
                    $scope.isRouteLoading = true
                    var chacePeriode = cacheHelper.get('CacheRegisTriage');
                    if (chacePeriode != undefined) {                        
                        $scope.item.namaPasien = chacePeriode.namaPasien;
                        $scope.item.alamatLengkap = chacePeriode.alamatlengkap;
                        $scope.item.tglLahir = moment(chacePeriode.tgllahir).format('YYYY-MM-DD HH:mm');//moment($scope.item.tglLahir).format('YYYY-MM-DD HH:mm');//;
                        $scope.item.jenisKelamin = { id: chacePeriode.jkid, jeniskelamin: chacePeriode.jk };
                        $scope.item.noHp = chacePeriode.notelepon;
                        $scope.item.noemr = chacePeriode.noemr;
                        $scope.Triage = 'CacheRegisTriage';
                        $scope.isRouteLoading = false;
                    }
                }
            }
            $scope.$watch('item.noBpjs', function (e) { 
                
                debugger;
                    if ($scope.item.noBpjs == undefined){
                        return;
                    }
                    if ($scope.item.noBpjs.length != 13){
                        return;
                    }
                    medifirstService.get("registrasi/cek-nobpjs?nobpjs=" + $scope.item.noBpjs)
                        .then(function (data) {
                            $scope.ceks = data.data;
                            if ($scope.ceks.data.length >= 1) {
                                checkKepesertan()
                                var nocm = $scope.ceks.data[0].nocm;
                                var nama = $scope.ceks.data[0].namapasien;
                                toastr.error("NO BPJS ini sudah di pakai oleh pasien RM : " + nocm + " (" + nama + ") !", "Peringatan")
                                // ceknobpjsdouble = true
                                $state.params.idPasien = $scope.ceks.data[0].id;
                                editPasien();
                                // return;
                               
                            } else {
                                checkKepesertan()
                            }
                        })
            
            
        });
        function checkKepesertan() {
               
            if ($scope.item.noBpjs != '' || $scope.item.noBpjs != undefined)
            {
                $scope.isLoadingNoKartu = true;
                medifirstService.get("bridging/bpjs/get-no-peserta?nokartu=" + $scope.item.noBpjs + "&tglsep=" + new moment(new Date).format('YYYY-MM-DD')).then(function (e) {
                    if (e.data.metaData.code === "200") {
                        var tglLahir = new Date(e.data.response.peserta.tglLahir);
                        // $scope.model.noKepesertaan = $scope.noKartu = e.data.response.peserta.noKartu;
                        $scope.item.namaPasien = e.data.response.peserta.nama;
                        $scope.item.tglLahir = tglLahir;
                        $scope.item.noIdentitas = e.data.response.peserta.nik;
                       if(e.data.response.peserta.sex == 'L' )
                       {
                        // item.jenisKelamin
                        $scope.item.jenisKelamin = { id: '1', jeniskelamin: 'LAKI-LAKI' };
                       }else
                       {
                        $scope.item.jenisKelamin = { id: '2', jeniskelamin: 'PEREMPUAN' }; 
                       }
                        toastr.info(e.data.response.peserta.statusPeserta.keterangan, 'Status Peserta');
                       
                    } else {
                        window.messageContainer.error(e.data.metaData.message);
                    }
                    $scope.isLoadingNoKartu = false;
                }, function (err) {
                    $scope.isLoadingNoKartu = false;
                });
            }
            
        
    }
    function checkKepesertanBynik() {
       
        if ($scope.item.noIdentitas != '' || $scope.item.noIdentitas != undefined)
        {
            $scope.isLoadingNoKartu = true;
            medifirstService.get("bridging/bpjs/get-nik?nik=" + $scope.item.noIdentitas + "&tglsep=" + new moment(new Date).format('YYYY-MM-DD')).then(function (e) {
                if (e.data.metaData.code === "200") {
                    var tglLahir = new Date(e.data.response.peserta.tglLahir);
                    // $scope.model.noKepesertaan = $scope.noKartu = e.data.response.peserta.noKartu;
                    $scope.item.namaPasien = e.data.response.peserta.nama;
                    $scope.item.tglLahir = tglLahir;
                    $scope.item.noBpjs = e.data.response.peserta.noKartu;
                    $scope.item.noIdentitas = e.data.response.peserta.nik;
                   if(e.data.response.peserta.sex == 'L' )
                   {
                    // item.jenisKelamin
                    $scope.item.jenisKelamin = { id: '1', jeniskelamin: 'LAKI-LAKI' };
                   }else
                   {
                    $scope.item.jenisKelamin = { id: '2', jeniskelamin: 'PEREMPUAN' }; 
                   }
                    toastr.info(e.data.response.peserta.statusPeserta.keterangan, 'Status Peserta');
                   
                } else {
                    window.messageContainer.error(e.data.metaData.message);
                }
                $scope.isLoadingNoKartu = false;
            }, function (err) {
                $scope.isLoadingNoKartu = false;
            });
        }
        
    
}
            function loadRujukanTransdata(result) {
                $scope.item.namaPasien = result.namapasien
                $scope.item.tempatLahir = result.tempatlahir
                $scope.item.tglLahir = new Date(result.tgllahir)
                if (result.notelepon)
                    $scope.item.noTelepon = result.notelepon;
                if (result.nohp)
                    $scope.item.noHp = result.nohp;
                if (result.nik)
                    $scope.item.noIdentitas = result.nik;
                if (result.nobpjs)
                    $scope.item.noBpjs = result.nobpjs;
                if (result.agama) {
                    for (let i = 0; i < $scope.listDataAgama.length; i++) {
                        const element = $scope.listDataAgama[i];
                        if (element.agama.toLowerCase().indexOf(result.agama.toLowerCase()) > -1) {
                            $scope.item.agama = element
                            break
                        }
                    }
                }
                if (result.jeniskelamin) {
                    for (let i = 0; i < $scope.listDataJenisKelamin.length; i++) {
                        const element = $scope.listDataJenisKelamin[i];
                        if (element.jeniskelamin.toLowerCase().indexOf(result.jeniskelamin.toLowerCase()) > -1) {
                            $scope.item.jenisKelamin = element
                            break
                        }
                    }
                }
                if (result.pekerjaan) {
                    for (let i = 0; i < $scope.listDataPekerjaan.length; i++) {
                        const element = $scope.listDataPekerjaan[i];
                        if (element.pekerjaan.toLowerCase().indexOf(result.pekerjaan.toLowerCase()) > -1) {
                            $scope.item.pekerjaan = element
                            break
                        }
                    }
                }
                if (result.statusperkawinan) {
                    for (let i = 0; i < $scope.listDataStatusPerkawinan.length; i++) {
                        const element = $scope.listDataStatusPerkawinan[i];
                        if (element.statusperkawinan == result.statusperkawinan) {
                            $scope.item.statusPerkawinan = element
                            break
                        }
                    }
                }
                if (result.pendidikan) {
                    for (let i = 0; i < $scope.listDataPendidikan.length; i++) {
                        const element = $scope.listDataPendidikan[i];
                        if (element.pendidikan.toLowerCase().indexOf(result.pendidikan.toLowerCase()) > -1) {
                            $scope.item.pendidikan = element
                            break
                        }
                    }
                }
                if (result.golongandarah) {
                    for (let i = 0; i < $scope.listGolonganDarah.length; i++) {
                        const element = $scope.listGolonganDarah[i];
                        if (element.golongandarah.toLowerCase().indexOf(result.golongandarah.toLowerCase()) > -1) {
                            $scope.item.golonganDarah = element
                            break
                        }
                    }
                }
            }

            function getPasienBayi() {
                $scope.isRouteLoading = true
                medifirstService.get("registrasi/get-bynocm?noCm=" + $scope.noCmIbu).then(function (e) {
                    $scope.isRouteLoading = false
                    var result = e.data.data
                    if (result.foto)
                        $scope.item.image = result.foto
                    $scope.item.noCmIbu = result.nocm;
                    $scope.item.noCmPasien = result.nocm;
                    $scope.item.namaIbu = result.namapasien
                    $scope.item.namaPasien = result.namapasien + " By Ny";
                    $scope.item.alamatLengkap = result.alamatlengkap
                    $scope.item.tempatLahir = result.tempatlahir;
                    $scope.item.jenisKelamin = { id: result.objectjeniskelaminfk, jeniskelamin: result.jeniskelamin }
                    if (result.objectagamafk)
                        $scope.item.agama = { id: result.objectagamafk, agama: result.agama }
                    // $scope.item.kebangsaan = { id: $scope.listKebangsaan._data[1].id, name: $scope.listKebangsaan._data[1].name }
                    if (result.kodepos)
                        $scope.item.kodePos = result.kodepos;
                    $scope.idIbu = result.nocmfk;
                    if (result.namasuamiistri)
                        $scope.item.namaAyah = result.namasuamiistri;
                    if (result.namasuamiistri)
                        $scope.item.namaKeluarga = result.namasuamiistri;
                    if (result.notelepon)
                        $scope.item.noTelepon = result.notelepon;
                    if (result.nohp)
                        $scope.item.noHp = result.nohp;

                    if (result.objectdesakelurahanfk) {
                        medifirstService.get("registrasi/get-desa-kelurahan-paging?iddesakelurahan=" + result.objectdesakelurahanfk).then(function (re) {
                            if (re.data[0] != undefined) {
                                var data = {
                                    id: re.data[0].id,
                                    namadesakelurahan: re.data[0].namadesakelurahan,
                                    kodepos: re.data[0].kodepos,
                                    namakecamatan: re.data[0].namakecamatan,
                                    namakotakabupaten: re.data[0].namakotakabupaten,
                                    namapropinsi: re.data[0].namapropinsi,
                                    objectkecamatanfk: re.data[0].objectkecamatanfk,
                                    objectkotakabupatenfk: re.data[0].objectkotakabupatenfk,
                                    objectpropinsifk: re.data[0].objectpropinsifk,
                                    desa: re.data[0].namadesakelurahan,
                                }
                                $scope.listDataKelurahan.add(data)
                                $scope.item.desaKelurahan = data
                            }
                        });
                    }
                    if (result.objectkecamatanfk)
                        $scope.item.kecamatan = { id: result.objectkecamatanfk, namakecamatan: result.namakecamatan }
                    if (result.objectkotakabupatenfk)
                        $scope.item.kotaKabupaten = { id: result.objectkotakabupatenfk, namakotakabupaten: result.namakotakabupaten, }
                    if (result.objectpropinsifk)
                        $scope.item.propinsi = { id: result.objectpropinsifk, namapropinsi: result.namapropinsi }

                    if ($scope.item.kodePos != undefined && $scope.item.kodePos != null) {
                        $scope.findKodePos();
                    } else {

                    }

                }, function (error) {
                    $scope.isRouteLoading = false
                })
            }


            function getPasienOnline() {
                $scope.isRouteLoading = true
                medifirstService.get('registrasi/get-pasienonline-bynorec/' + $state.params.noRec)
                    .then(function (e) {
                        $scope.isRouteLoading = false
                        var result = e.data.data
                        if (result.namaibu)
                            $scope.item.namaIbu = result.namaibu;
                        if (result.namaayah)
                            $scope.item.namaAyah = result.namaayah;
                        $scope.item.namaPasien = result.namapasien;
                        // $scope.item.pasien.namaPasien = result.namapasien
                        if (result.tgllahir != null) {
                            $scope.item.tglLahir = new Date(result.tgllahir)
                            $scope.item.jamLahir = new Date(result.tgllahir)
                        }
                        if (result.tempatlahir)
                            $scope.item.tempatLahir = result.tempatlahir;
                        if (result.objectjeniskelaminfk)
                            $scope.item.jenisKelamin = { id: result.objectjeniskelaminfk, jeniskelamin: result.jeniskelamin };
                        if (result.objectagamafk)
                            $scope.item.agama = { id: result.objectagamafk, agama: result.agama };
                        if (result.objectstatusperkawinanfk)
                            $scope.item.statusPerkawinan = { id: result.objectstatusperkawinanfk, statusperkawinan: result.statusperkawinan };
                        if (result.objectpendidikanfk)
                            $scope.item.pendidikan = { id: result.objectpendidikanfk, pendidikan: result.pendidikan };
                        if (result.objectpekerjaanfk)
                            $scope.item.pekerjaan = { id: result.objectpekerjaanfk, pekerjaan: result.pekerjaan };
                        if (result.noidentitas)
                            $scope.item.noIdentitas = result.noidentitas;
                        if (result.nobpjs)
                            $scope.item.noBpjs = result.nobpjs;
                        if (result.namasuamiistri)
                            $scope.item.namaSuamiIstri = result.namasuamiistri;
                        if (result.alamatlengkap)
                            $scope.item.alamatLengkap = result.alamatlengkap;
                        if (result.notelepon)
                            $scope.item.noTelepon = result.notelepon;
                        if (result.nohp)
                            $scope.item.noHp = result.noaditional;
                        $scope.reservasi = result
                        $scope.item.noRecReservasi = result.norec
                        $scope.item.noReservasi = result.noreservasi
                        if ($scope.item.kodePos != undefined) {
                            $scope.findKodePos();

                        }
                    }, function (error) {
                        $scope.isRouteLoading = false
                    })
            }

            function editPasien() {
                $scope.isEditPasien = true;
                $scope.isRouteLoading = true;
                medifirstService.get("registrasi/get-bynocm?idPasien=" + $state.params.idPasien).then(function (e) {
                    $scope.isRouteLoading = false
                    var result = e.data.data                    
                    if (result.foto)// && result.foto != 'data:image/jpeg;base64,')
                        $scope.item.image = result.foto
                    $scope.item.noCmIbu = result.nocm;
                    $scope.item.noCmPasien = result.nocm;
                    $scope.item.namaPasien = result.namapasien;
                    $scope.item.alamatLengkap = result.alamatlengkap
                    $scope.item.tempatLahir = result.tempatlahir;
                    $scope.item.tglLahir = new Date(result.tgllahir)
                    $scope.item.jenisKelamin = { id: result.objectjeniskelaminfk, jeniskelamin: result.jeniskelamin }
                    $scope.item.agama = { id: result.objectagamafk, agama: result.agama }
                    $scope.item.PenanggungJawab = result.penanggungjawab;
                    $scope.item.Nik1 = result.nik1;
                    $scope.item.Nik2 = result.nik2;
                    if (result.penanggungjawab)
                        $scope.item.cekPenanggungJawab = true
                    else
                        $scope.item.cekPenanggungJawab = false
                    $scope.item.Hubungan = result.hubungankeluargapj;
                    $scope.item.Ktp = result.ktppenanggungjawab;
                    $scope.item.alamatRumah = result.alamatrmh;
                    $scope.item.alamatKantor = result.alamatktr;

                    $scope.item.Bahasa = result.bahasa;
                    $scope.item.TeleponP = result.teleponpenanggungjawab;
                    $scope.item.UmurP = result.umurpenanggungjawab;
                    $scope.item.DokterPengirim = result.dokterpengirim;
                    $scope.item.alamatDokterPengirim = result.alamatdokterpengirim;

                    if (result.pekerjaanpenangggungjawab) {
                        $scope.item.pekerjaanP = { id: result.idpek, pekerjaan: result.pekerjaanpenangggungjawab };
                    }
                    if (result.jeniskelaminpenanggungjawab) {
                        $scope.item.jenisKelaminP = { id: result.jkidpenanggungjawab, jeniskelamin: result.jeniskelaminpenanggungjawab };
                    }
                    // $scope.item.kebangsaan = { id: $scope.listKebangsaan._data[1].id, name: $scope.listKebangsaan._data[1].name }
                    if (result.kodepos)
                        $scope.item.kodePos = result.kodepos;
                    // $scope.idIbu = result.nocmfk;
                    if (result.namaibu)
                        $scope.item.namaIbu = result.namaibu
                    if (result.namasuamiistri)
                        $scope.item.namaSuamiIstri = result.namasuamiistri
                    if (result.noidentitas)
                        $scope.item.noIdentitas = result.noidentitas
                    if (result.nobpjs)
                        $scope.item.noBpjs = result.nobpjs
                    if (result.noasuransilain)
                        $scope.item.noAsuransiLain = result.noasuransilain
                    if (result.namaayah)
                        $scope.item.namaAyah = result.namaayah;
                    if (result.namakeluarga)
                        $scope.item.namaKeluarga = result.namakeluarga;
                    if (result.notelepon)
                        $scope.item.noTelepon = result.notelepon;
                    if (result.nohp)
                        $scope.item.noHp = result.nohp;
                    if (result.objectstatusperkawinanfk)
                        $scope.item.statusPerkawinan = { id: result.objectstatusperkawinanfk, statusperkawinan: result.statusperkawinan }
                    if (result.objectpendidikanfk)
                        $scope.item.pendidikan = { id: result.objectpendidikanfk, pendidikan: result.pendidikan }
                    if (result.objectpekerjaanfk)
                        $scope.item.pekerjaan = { id: result.objectpekerjaanfk, pekerjaan: result.pekerjaan }
                    if (result.objectsukufk)
                        $scope.item.suku = { id: result.objectsukufk, suku: result.suku }
                    if (result.objectgolongandarahfk)
                        $scope.item.golonganDarah = { id: result.objectgolongandarahfk, golongandarah: result.golongandarah }
                    if (result.objectdesakelurahanfk) {
                        medifirstService.get("registrasi/get-desa-kelurahan-paging?iddesakelurahan=" + result.objectdesakelurahanfk).then(function (re) {
                            if (re.data[0] != undefined) {
                                var data = {
                                    id: re.data[0].id,
                                    namadesakelurahan: re.data[0].namadesakelurahan,
                                    kodepos: re.data[0].kodepos,
                                    namakecamatan: re.data[0].namakecamatan,
                                    namakotakabupaten: re.data[0].namakotakabupaten,
                                    namapropinsi: re.data[0].namapropinsi,
                                    objectkecamatanfk: re.data[0].objectkecamatanfk,
                                    objectkotakabupatenfk: re.data[0].objectkotakabupatenfk,
                                    objectpropinsifk: re.data[0].objectpropinsifk,
                                    desa: re.data[0].namadesakelurahan,
                                }
                                $scope.listDataKelurahan.add(data)
                                $scope.item.desaKelurahan = data
                            }
                        });
                    }
                    if (result.objectkecamatanfk)
                        $scope.item.kecamatan = { id: result.objectkecamatanfk, namakecamatan: result.namakecamatan }
                    if (result.objectkotakabupatenfk)
                        $scope.item.kotaKabupaten = { id: result.objectkotakabupatenfk, namakotakabupaten: result.namakotakabupaten, }
                    if (result.objectpropinsifk)
                        $scope.item.propinsi = { id: result.objectpropinsifk, namapropinsi: result.namapropinsi }
                    if (result.bahasafk)
                        $scope.item.bahasaP = { id: result.bahasafk, bahasa: result.bahasa }
                    if (result.hambatankomunikasifk)
                        $scope.item.hambatan = { id: result.hambatankomunikasifk, hambatankomunikasi: result.hambatankomunikasi }


                     if (result.penanggungjawab2)
                        $scope.item.PenanggungJawab2 = result.penanggungjawab2
                     if (result.hubungankeluargapj2)
                        $scope.item.Hubungan2 = result.hubungankeluargapj2
                     if (result.teleponpenanggungjawab2)
                        $scope.item.TeleponP2 = result.teleponpenanggungjawab2
                     if (result.bahasa2)
                        $scope.item.Bahasa2 = result.bahasa2
                     if (result.jeniskelaminpenanggungjawab2){
                        $scope.item.jenisKelaminP = { id: result.idjk2, jeniskelamin: result.jeniskelaminpenanggungjawab2 };
                     }
                       
                    if (result.umurpenanggungjawab2)
                        $scope.item.UmurP2 = result.umurpenanggungjawab2
                    if (result.alamatrmh2)
                        $scope.item.alamatRumah2 = result.alamatrmh2
                    if (result.pekerjaanpenangggungjawab2){
                       $scope.item.pekerjaanP2 = { id: result.idpek2, pekerjaan: result.pekerjaanpenangggungjawab2 };
                 
                    }
                    $scope.item.isAlamat = false
                    if (result.alamatd.length>0){
                    $scope.item.isAlamat = true
                    data2 = []
                    for (var i = 0; i < result.alamatd.length; i++) {
                        result.alamatd[i].no = i +1
                        const el =  result.alamatd[i]
                        var alamatLeng = ''
                        if(el.namadesakelurahan){alamatLeng = alamatLeng +' ' + el.namadesakelurahan}
                        if(el.namakecamatan){alamatLeng = alamatLeng +' ' + el.namakecamatan}
                        if(el.namakotakabupaten){alamatLeng = alamatLeng +' ' + el.namakotakabupaten}
                        if(el.propinsi){alamatLeng = alamatLeng +' ' + el.propinsi}    

                        el.alamatdetail  =alamatLeng   
                        data2.push(el)
                    }
                    $scope.listAlamat = new kendo.data.DataSource({
                        data: data2
                    });

                  }

                    if ($scope.item.kodePos != undefined && $scope.item.kodePos != null) {
                        $scope.findKodePos();
                    } else {

                    }

                }, function (error) {
                    $scope.isRouteLoading = false
                })
            }

            function loadCombo() {
                $scope.isRouteLoading = true;
                $scope.listJenislabel = [{ id: 1, jenislabel: "Label Besar" }, { id: 2, jenislabel: "Label Kecil" }];
                $q.all([
                    medifirstService.get("registrasi/get-combo-registrasi"),
                    medifirstService.get("registrasi/get-combo-address"),
                ]).then(function (result) {
                    if (result[0].statResponse) {
                        $scope.listDataJenisKelamin = result[0].data.jeniskelamin
                        $scope.listDataPekerjaan = result[0].data.pekerjaan
                        $scope.listDataAgama = result[0].data.agama
                        $scope.listDataPendidikan = result[0].data.pendidikan
                        $scope.listDataStatusPerkawinan = result[0].data.statusperkawinan
                        $scope.listGolonganDarah = result[0].data.golongandarah
                        $scope.listSuku = result[0].data.suku
                        $scope.listBahasa = result[0].data.bahasa
                        $scope.listHamKom = result[0].data.hambatan
                        $scope.listJenis = result[0].data.jenis
                        var cacheTransdataRujuk = cacheHelper.get('cacheRujukanTransdata')
                        if (cacheTransdataRujuk != undefined) {
                            loadRujukanTransdata(cacheTransdataRujuk)
                        }

                    }
                    if (result[1].statResponse) {
                        $scope.listDataKecamatan = result[1].data.kecamatan
                        $scope.listDataKotaKabupaten = result[1].data.kotakabupaten
                        $scope.listDataPropinsi = result[1].data.propinsi
                        $scope.listKebangsaan = result[1].data.kebangsaan
                        $scope.listNegara = result[1].data.negara
                        $scope.item.kebangsaan = $scope.listKebangsaan[0]

                    }
                    $scope.isRouteLoading = false;
                })
            }

            medifirstService.getPart("registrasi/get-desa-kelurahan-paging", true, true, 10).then(function (e) {
                $scope.listDataKelurahan = e;
            });

            $scope.findAddress = function (desa) {
                if (desa.objectkecamatanfk)
                    $scope.alamat.kecamatan = { id: desa.objectkecamatanfk, namakecamatan: desa.namakecamatan }
                if (desa.objectkotakabupatenfk)
                    $scope.alamat.kotaKabupaten = { id: desa.objectkotakabupatenfk, namakotakabupaten: desa.namakotakabupaten }
                if (desa.objectpropinsifk)
                    $scope.alamat.propinsi = { id: desa.objectpropinsifk, namapropinsi: desa.namapropinsi }
                if (desa.kodepos)
                    $scope.alamat.kodePos = desa.kodepos
            }



            $scope.$watch('item.kebangsaan', function (e) {
                if (e === undefined) return;
                if (e.name === 'WNI')
                    $scope.item.negara = { id: 0 };
                if (e.name === 'WNA')
                    $scope.item.negara = $scope.item.kebangsaan;
            });
            $scope.$watch('item.desaKelurahan', function (newValue, oldValue) {
                if (newValue == oldValue) return;
                if (newValue.objectkecamatanfk)
                    $scope.item.kecamatan = { id: newValue.objectkecamatanfk, namakecamatan: newValue.namakecamatan }
                if (newValue.objectkotakabupatenfk)
                    $scope.item.kotaKabupaten = { id: newValue.objectkotakabupatenfk, namakotakabupaten: newValue.namakotakabupaten }
                if (newValue.objectpropinsifk)
                    $scope.item.propinsi = { id: newValue.objectpropinsifk, namapropinsi: newValue.namapropinsi }
                if (newValue.kodepos)
                    $scope.item.kodePos = newValue.kodepos
            });


            $scope.findKodePos = function (kdPos) {
                if (!kdPos) return;
                $scope.isBusy = true;
                medifirstService.get('registrasi/get-alamat-bykodepos?kodePos=' + kdPos).then(function (res) {
                    if (res.data.data.length > 0) {
                        var data = {
                            id: res.data.data[0].objectdesakelurahanfk,
                            namadesakelurahan: res.data.data[0].namadesakelurahan,
                            kodepos: res.data.data[0].kodepos,
                            namakecamatan: res.data.data[0].namakecamatan,
                            namakotakabupaten: res.data.data[0].namakotakabupaten,
                            namapropinsi: res.data.data[0].namapropinsi,
                            objectkecamatanfk: res.data.data[0].objectkecamatanfk,
                            objectkotakabupatenfk: res.data.data[0].objectkotakabupatenfk,
                            objectpropinsifk: res.data.data[0].objectpropinsifk,
                            desa: res.data.data[0].namadesakelurahan,
                        }
                        $scope.listDataKelurahan.add(data)
                        $scope.item.desaKelurahan = data
                        $scope.item.kecamatan = { id: data.objectkecamatanfk, namakecamatan: data.namakecamatan }
                        $scope.item.kotaKabupaten = { id: data.objectkotakabupatenfk, namakotakabupaten: data.namakotakabupaten }
                        $scope.item.propinsi = { id: data.objectpropinsifk, namapropinsi: data.namapropinsi }


                    }
                    $scope.isBusy = false;
                }, function (error) {
                    $scope.isBusy = false;
                })
            }

            var tempId = 0;
            // $scope.cetak = function () {

            //     var url = configuration.urlPrinting + "registrasi-pelayanan/kartuPasien?id=" + tempId + "&X-AUTH-TOKEN=" + ModelItem.getAuthorize();
            //     window.open(url);
            // }
            $scope.formatNum = {
				format: "#.#",
				decimals: 0
			}
            $scope.pjke="";
            $scope.cetakPJ = function (pjke){
                $scope.pjke=pjke;
                $scope.dats = {
					qty: 0
				}
                $scope.dialogCetakLabel.center().open();

            };
            $scope.pilihQty = function (data) {				
				var listRawRequired = [
					"dats.qty|k-ng-model|kuantiti"
				];
				var isValid = ModelItem.setValidation($scope, listRawRequired);

				if (isValid.status) {					
						var qty = data.qty;
						var qtyhasil = data.qty * 1;
						if (qty !== undefined) {
							// var fixUrlLaporan = cetakHelper.open("reporting/labelPasien?noCm=" + $scope.item.pasienDaftar.noRegistrasi + "&qty=" + qty);
							// window.open(fixUrlLaporan, '', 'width=800,height=600')
							//cetakan langsung service VB6 by grh

							//##save identifikasi label pasien
							// medifirstService.get("registrasi/identifikasi-label?norec_pd="
							// 	+ $scope.dataPasienSelected.norec + '&islabel=' + qtyhasil 
							// ).then(function (data) {
							// 	var datas = data.data;
							// })
							//##end

							var client = new HttpClient();
							client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-labelpasienbayi-satu-pj=1&idpasien=' + $state.params.idPasien + '&view=false&qty=' + qty + '&pjke=' + $scope.pjke, function (response) {
								// do something with response
							});

						}
						$scope.dialogCetakLabel.close();
					
				} else {					
					ModelItem.showMessages(isValid.messages);
				}
			};

            $scope.Save = function () {
                var pekerjaanPj = null
                if ($scope.item.pekerjaanP != undefined) {
                    pekerjaanPj = $scope.item.pekerjaanP.pekerjaan;
                }
                var jeniskelaminP = null
                if ($scope.item.jenisKelaminP != undefined) {
                    jeniskelaminP = $scope.item.jenisKelaminP.jeniskelamin;
                }

                var listRawRequired = [
                    "item.namaPasien|ng-model|Nama Pasien",
                    "item.tempatLahir|ng-model|Tempat Lahir",
                    "item.tglLahir|k-ng-model|Tgl Lahir",
                    "item.jenisKelamin|k-ng-model|Jenis Kelamin",
                    "item.alamatLengkap|ng-model|Alamat",
                    // "item.desaKelurahan|k-ng-model|Kelurahan",
                    "item.noHp|ng-model|No. HP / Ponsel",
                ];
                var isValid = ModelItem.setValidation($scope, listRawRequired);
                if (isValid.status) {

                    var postJson = {
                        'isbayi': $scope.isBayi,
                        'isEditPasien': $scope.isEditPasien,
                        'istriageigd': $scope.isTriage,
                        'isPenunjang': $scope.isPenunjang,
                        'idpasien': $scope.idPasien != undefined ? $scope.idPasien : '',
                        'pasien': {
                            'namaPasien': $scope.item.namaPasien,
                            'noIdentitas': $scope.item.noIdentitas != undefined ? $scope.item.noIdentitas : null,
                            'namaSuamiIstri': $scope.item.namaSuamiIstri != undefined ? $scope.item.namaSuamiIstri : null,
                            'noAsuransiLain': $scope.item.noAsuransiLain != undefined ? $scope.item.noAsuransiLain : null,
                            'noBpjs': $scope.item.noBpjs != undefined ? $scope.item.noBpjs : null,
                            'noHp': $scope.item.noHp != undefined ? $scope.item.noHp : null,
                            'tempatLahir': $scope.item.tempatLahir,
                            'namaKeluarga': $scope.item.namaKeluarga != undefined ? $scope.item.namaKeluarga : null,
                            'tglLahir': moment($scope.item.tglLahir).format('YYYY-MM-DD HH:mm'),
                            'image': $scope.item.image != undefined && $scope.item.image != "../app/images/avatar.jpg" ? $scope.item.image : null
                        },
                        'agama': {
                            'id': $scope.item.agama != undefined ? $scope.item.agama.id : null,
                        },
                        'jenisKelamin': {
                            'id': $scope.item.jenisKelamin != undefined ? $scope.item.jenisKelamin.id : null,
                        },
                        'pekerjaan': {
                            'id': $scope.item.pekerjaan != undefined ? $scope.item.pekerjaan.id : null,
                        },
                        'pendidikan': {
                            'id': $scope.item.pendidikan != undefined ? $scope.item.pendidikan.id : null,
                        },
                        'statusPerkawinan': {
                            'id': $scope.item.statusPerkawinan != undefined ? $scope.item.statusPerkawinan.id : 0,
                        },
                        'golonganDarah': {
                            'id': $scope.item.golonganDarah != undefined ? $scope.item.golonganDarah.id : null,
                        },
                        'suku': {
                            'id': $scope.item.suku != undefined ? $scope.item.suku.id : null,
                        },

                        'namaIbu': $scope.item.namaIbu != undefined ? $scope.item.namaIbu : null,
                        'noTelepon': $scope.item.noTelepon != undefined ? $scope.item.noTelepon : null,
                        'noAditional': $scope.item.noAditional != undefined ? $scope.item.noAditional : null,
                        'kebangsaan': {
                            'id': $scope.item.kebangsaan != undefined ? $scope.item.kebangsaan.id : null,
                        },
                        'negara': {
                            'id': $scope.item.negara != undefined ? $scope.item.negara.id : null,
                        },
                        'namaAyah': $scope.item.namaAyah != undefined ? $scope.item.namaAyah : null,
                        'alamatLengkap': $scope.item.alamatLengkap,
                        'desaKelurahan': {
                            'id': $scope.item.desaKelurahan != undefined ? $scope.item.desaKelurahan.id : null,
                            'namaDesaKelurahan': $scope.item.desaKelurahan != undefined ? $scope.item.desaKelurahan.namadesakelurahan : null,
                        },
                        'kecamatan': {
                            'id': $scope.item.kecamatan != undefined ? $scope.item.kecamatan.id : null,
                            'namaKecamatan': $scope.item.kecamatan != undefined ? $scope.item.kecamatan.namakecamatan : null,
                        },
                        'kotaKabupaten': {
                            'id': $scope.item.kotaKabupaten != undefined ? $scope.item.kotaKabupaten.id : null,
                            'namaKotaKabupaten': $scope.item.kotaKabupaten != undefined ? $scope.item.kotaKabupaten.namakotakabupaten : null,
                        },
                        'propinsi': {
                            'id': $scope.item.propinsi != undefined ? $scope.item.propinsi.id : null,
                        },
                        'kodePos': $scope.item.kodePos != undefined ? $scope.item.kodePos : null,
                        'penanggungjawab': $scope.item.PenanggungJawab != undefined ? $scope.item.PenanggungJawab : null,
                        'hubungankeluargapj': $scope.item.Hubungan != undefined ? $scope.item.Hubungan : null,
                        'pekerjaanpenangggungjawab': pekerjaanPj,
                        'ktppenanggungjawab': $scope.item.Ktp != undefined ? $scope.item.Ktp : null,
                        'alamatrmh': $scope.item.alamatRumah != undefined ? $scope.item.alamatRumah : null,
                        'alamatktr': $scope.item.alamatKantor != undefined ? $scope.item.alamatKantor : null,
                        'teleponpenanggungjawab': $scope.item.TeleponP != undefined ? $scope.item.TeleponP : null,
                        'bahasa': $scope.item.Bahasa != undefined ? $scope.item.Bahasa : null,
                        'jeniskelaminpenanggungjawab': $scope.item.jenisKelaminP != undefined ? $scope.item.jenisKelaminP.jeniskelamin : null,
                        'umurpenanggungjawab': $scope.item.UmurP != undefined ? $scope.item.UmurP : null,
                        'dokterpengirim': $scope.item.DokterPengirim != undefined ? $scope.item.DokterPengirim : null,
                        'alamatdokter': $scope.item.alamatDokterPengirim != undefined ? $scope.item.alamatDokterPengirim : null,
                        'hambatan': $scope.item.hambatan != undefined ? $scope.item.hambatan.id : null,
                        'bahasaP': $scope.item.bahasaP != undefined ? $scope.item.bahasaP.id : null,
                        'nik1': $scope.item.Nik1 != undefined ? $scope.item.Nik1 : null,

                        'penanggungjawab2': $scope.item.PenanggungJawab2 != undefined ? $scope.item.PenanggungJawab2 : null,
                        'hubungankeluargapj2': $scope.item.Hubungan2 != undefined ? $scope.item.Hubungan2 : null,
                        'pekerjaanpenangggungjawab2':  $scope.item.pekerjaanP2 != undefined ? $scope.item.pekerjaanP2.pekerjaan : null,
                        'alamatrmh2': $scope.item.alamatRumah2 != undefined ? $scope.item.alamatRumah2 : null,
                        'teleponpenanggungjawab2': $scope.item.TeleponP2 != undefined ? $scope.item.TeleponP2 : null,
                        'bahasa2': $scope.item.Bahasa2 != undefined ? $scope.item.Bahasa2 : null,
                        'jeniskelaminpenanggungjawab2': $scope.item.jenisKelaminP2 != undefined ? $scope.item.jenisKelaminP2.jeniskelamin : null,
                        'umurpenanggungjawab2': $scope.item.UmurP2 != undefined ? $scope.item.UmurP2 : null,
                        'detailalamat': data2,
                        'nik2': $scope.item.Nik2 != undefined ? $scope.item.Nik2 : null,
                    }
                    medifirstService.post('registrasi/save-pasien-fix', postJson)
                        .then(
                            function (res) {
                                // if ($scope.item.image != undefined && $scope.item.image != "../app/images/avatar.jpg") {
                                //     saveImageToDir($scope.item.image,res.data.data.nocm )
                                // }
                                tempId = res.data.data.id;
                                if ($scope.item.noRecReservasi != undefined) {
                                    var jsonss = {
                                        "norec": $scope.item.noRecReservasi,
                                        "nocmfk": res.data.data.kodeexternal
                                    }

                                    medifirstService.post('reservasi/update-nocmfk-antrian-registrasi', jsonss).then(function (e) {
                                    })
                                }

                                $scope.isNext = true;
                                $scope.idPasienNa = res.data.data.id;
                                $scope.noCm = res.data.data.nocm;
                                $scope.noRec = res.data.data.id;
                                $scope.namaPasien = res.data.data.namapasien;
                                $scope.ALamat = res.data.alamat;
                                $scope.Jk = $scope.item.jenisKelamin.jeniskelamin
                                $scope.tglLahirs = res.data.data.tgllahir;
                                $scope.NoTelepon = res.data.data.notelepon;
                                var umur = dateHelper.CountAge(new Date($scope.tglLahirs), $scope.now);
                                var bln = umur.month,
                                    thn = umur.year,
                                    day = umur.day
                                var usia = (umur.year * 12) + umur.month
                                var umur = thn + ' thn ' + bln + ' bln ' + day + ' hr '
                                $scope.UmurTea = umur;


                                if ($scope.Triage != "" && $scope.Triage != undefined) {
                                    InputTriage();
                                }
                                // toastr.info($scope.noCm, 'No RM Pasien')
                                cacheHelper.set('CacheRegisBayi', undefined);
                                // if ($scope.idPasien == undefined) {
                                //     $scope.Next()
                                // }
                                if ($scope.title == 'Pendaftaran Pasien') {
                                    $scope.Next()
                                }

                            },
                            function (err) { })

                } else {
                    showMessages(isValid.messages);
                }

            }

            function InputTriage() {

                var objSave = {
                    noemr: $scope.item.noemr,
                    nocm: $scope.noCm
                }
                medifirstService.post('registrasi/update-data-emrpasien', objSave).then(function (e) {
                });
            }
            function saveImageToDir(imagedata, nocm) {
                // var fs = require('fs');
                var fso = new ActiveXObject("Scripting.FileSystemObject");
                // var imagedata // get imagedata from POST request
                fso.writeFile("/images/" + nocm + ".jpg", imagedata, 'binary', function (err) {
                    console.log("The file was saved!");

                });
            }
            function showMessages(messages) {
                var arrMsgError = messages.split("|");
                for (var i = 0; i < arrMsgError.length - 1; i++) {
                    toastr.error(arrMsgError[i], 'Peringatan');
                }
            }

            $scope.Next = function () {
                var param = $scope.idPasienNa;
                var noEmr = $scope.item.noemr;
                var cacheSet = undefined;
                var cacheSetss = undefined;
                cacheHelper.set('CacheRegisOnlineBaru', undefined);
                var noreservas = ''
                if ($scope.item.noReservasi != undefined) {
                    noreservas = $scope.item.noReservasi
                    var cache = {
                        0: 'Online',
                        1: noreservas,
                        2: $scope.reservasi,
                        3: '',
                        4: '',
                        5: '',
                        6: ''
                    };
                    cacheHelper.set('CacheRegisOnlineBaru', cache);
                }
                cacheHelper.set('CacheRegisOnline', cacheSetss);

                cacheHelper.set('CacheRegistrasiPasien', cacheSet);
                if( $scope.idPasien!=undefined){
                    cacheHelper.set('cacheStatusPasien', 'LAMA'); 
                    
                }else{
                    cacheHelper.set('cacheStatusPasien', 'BARU');
                }
               

                if ($scope.isPenunjang != undefined && $scope.isPenunjang == true) {
                    // cacheHelper.set('CacheRegisTriage', noEmr);
                    cacheHelper.set('isPenunjang', true);
                    $state.go('UmVnaXN0cmFzaVJ1YW5nYW4=', {
                        noCm: param
                    });
                } else {
                    cacheHelper.set('isPenunjang', undefined);
                    // cacheHelper.set('CacheRegisTriage', noEmr);
                    $state.go('UmVnaXN0cmFzaVJ1YW5nYW4=', {
                        noCm: param,
                    });
                }


            }
            // $(document).ready(function() {
            // $("#comboBoxMulti").kendoMultiColumnComboBox({
            //     noDataTemplate: $("#noDataTemplate").html(),
            //     dataTextField: "ContactName",
            //     dataValueField: "CustomerID",
            //     filter: "contains",
            //     dataSource: {
            //         transport: {
            //             read: {
            //                 dataType: "jsonp",
            //                 url: "https://demos.telerik.com/kendo-ui/service/Customers"
            //             }
            //         }
            //     }
            // });
            // });

            $scope.getNik = function (bool) {
                if (bool) {
                    if ($scope.item.noIdentitas === '' || $scope.item.noIdentitas === undefined) return;
                    $scope.isLoadingNik = true;
                    // var json = {
                    //     'nik': $scope.item.noIdentitas,
                    // }

                    // medifirstService.get('bridging/dukcapil/get-identitas-by-nik/' + $scope.item.noIdentitas).then(function (e) {
                    medifirstService.get('bridging/dukcapil/get-nik/' + $scope.item.noIdentitas).then(function (e) {
                        if (e.data.content == undefined) {
                            $scope.isLoadingNik = false;
                            if (e.data.messages != undefined) {
                                toastr.error(e.data.messages, 'Error')
                            }
                            return
                        }
                        // if (e.data.messages) {
                        //     toastr.error(e.data.messages, 'Error')
                        //     $scope.isLoadingNik = false;
                        //     return
                        // }
                        // e.data.content
                        if (e.status == '200' && e.data.content) {
                            if (e.data.content[0] != "" && e.data.content[0] != undefined) {
                                var result = e.data.content[0]
                                toastr.success('Nama Lengkap : ' + result.NAMA_LGKP, 'Sukses')
                                $scope.item.namaPasien = result.NAMA_LGKP
                                $scope.item.alamatLengkap = result.ALAMAT.trim() + ' KEL. ' + result.NAMA_KEL
                                    + ' RT' + result.NO_RT + '/RW' + result.NO_RW + ' KEC. ' + result.NAMA_KEC

                                if (result.NAMA_KAB != undefined)
                                    $scope.item.alamatLengkap = $scope.item.alamatLengkap + ' KAB/KOTA ' + result.NAMA_KAB + ' PROP. ' + result.NAMA_PROP
                                if (result.NAMA_PROP != undefined)
                                    $scope.item.alamatLengkap = $scope.item.alamatLengkap + ' PROP. ' + result.NAMA_PROP
                                $scope.item.tempatLahir = result.TMPT_LHR
                                $scope.item.namaIbu = result.NAMA_LGKP_IBU.trim()
                                $scope.item.namaAyah = result.NAMA_LGKP_AYAH.trim()
                                $scope.item.tglLahir = new Date(result.TGL_LHR)
                                for (let i = 0; i < $scope.listDataAgama.length; i++) {
                                    const element = $scope.listDataAgama[i];
                                    if (element.agama.toLowerCase().indexOf(result.AGAMA.toLowerCase()) > -1) {
                                        $scope.item.agama = element
                                        break
                                    }
                                }

                                for (let i = 0; i < $scope.listDataJenisKelamin.length; i++) {
                                    const element = $scope.listDataJenisKelamin[i];
                                    if (element.jeniskelamin.toLowerCase().indexOf(result.JENIS_KLMIN.toLowerCase()) > -1) {
                                        $scope.item.jenisKelamin = element
                                        break
                                    }
                                }

                                for (let i = 0; i < $scope.listDataPekerjaan.length; i++) {
                                    const element = $scope.listDataPekerjaan[i];
                                    if (element.namadukcapil.toLowerCase().indexOf(result.JENIS_PKRJN.toLowerCase()) > -1) {
                                        $scope.item.pekerjaan = element
                                        break
                                    }
                                }
                                for (let i = 0; i < $scope.listDataStatusPerkawinan.length; i++) {
                                    const element = $scope.listDataStatusPerkawinan[i];
                                    if (element.namadukcapil == result.STAT_KWN) {
                                        $scope.item.statusPerkawinan = element
                                        break
                                    }
                                }
                                for (let i = 0; i < $scope.listDataPendidikan.length; i++) {
                                    const element = $scope.listDataPendidikan[i];
                                    if (element.namadukcapil.toLowerCase().indexOf(result.PDDK_AKH.toLowerCase()) > -1) {
                                        $scope.item.pendidikan = element
                                        break
                                    }
                                }
                                for (let i = 0; i < $scope.listGolonganDarah.length; i++) {
                                    const element = $scope.listGolonganDarah[i];
                                    if (element.namadukcapil.toLowerCase().indexOf(result.GOL_DRH.toLowerCase()) > -1) {
                                        $scope.item.golonganDarah = element
                                        break
                                    }
                                }

                                if (result.NAMA_KEL) {
                                    medifirstService.get("registrasi/get-desa-kelurahan-paging?namadesakelurahan=" + result.NAMA_KEL
                                        + "&namakecamatan=" + result.NAMA_KEC).then(function (re) {
                                            for (let i = 0; i < re.data.length; i++) {
                                                const element = re.data[i];
                                                if (element.namadesakelurahan.toLowerCase() == result.NAMA_KEL.toLowerCase()
                                                    && element.namakecamatan.toLowerCase() == result.NAMA_KEC.toLowerCase()) {
                                                    var data = {
                                                        id: element.id,
                                                        namadesakelurahan: element.namadesakelurahan,
                                                        kodepos: element.kodepos,
                                                        namakecamatan: element.namakecamatan,
                                                        namakotakabupaten: element.namakotakabupaten,
                                                        namapropinsi: element.namapropinsi,
                                                        objectkecamatanfk: element.objectkecamatanfk,
                                                        objectkotakabupatenfk: element.objectkotakabupatenfk,
                                                        objectpropinsifk: element.objectpropinsifk,
                                                        desa: element.namadesakelurahan,
                                                    }
                                                    $scope.listDataKelurahan.add(data)
                                                    $scope.item.desaKelurahan = data
                                                    break
                                                }
                                            }

                                        });
                                }
                            } else {
                                toastr.error(e.data.content.RESPON, 'Info')
                            }

                        } else {
                            toastr.error(e.data.content[1].RESPON, 'Error')
                        }
                        $scope.isLoadingNik = false;
                    }, function (err) {
                        $scope.isLoadingNik = false;
                    });
                }


                // {
                //     "content": [
                //         {
                //             "NO_KK": 6103111003055361,
                //             "NIK": 6103111003690002,
                //             "NAMA_LGKP": "ASAU",
                //             "KAB_NAME": "SANGGAU",
                //             "AGAMA": "KATHOLIK",
                //             "NAMA_LGKP_AYAH": "MEH",
                //             "NO_RW": 6,
                //             "KEC_NAME": "TAYAN HILIR",
                //             "JENIS_PKRJN": "PETANI/PEKEBUN",
                //             "NO_RT": 6,
                //             "ALAMAT": "DUSUN RIYAM",
                //             "TMPT_LHR": "KATOK",
                //             "PDDK_AKH": "TAMAT SD/SEDERAJAT",
                //             "STATUS_KAWIN": "KAWIN",
                //             "NAMA_LGKP_IBU": "CEMBET",
                //             "PROP_NAME": "KALIMANTAN BARAT",
                //             "GOL_DARAH": "TIDAK TAHU",
                //             "KEL_NAME": "TANJUNG BUNUT",
                //             "JENIS_KLMIN": "LAKI-LAKI",
                //             "TGL_LHR": "1969-03-10"
                //         }
                //     ],
                //     "lastPage": true,
                //     "numberOfElements": 1,
                //     "sort": null,
                //     "totalElements": 1,
                //     "firstPage": true,
                //     "number": 0,
                //     "size": 1
                // }
                checkKepesertanBynik();

            }

            /*Capitalize*/
            $scope.$watch('item.namaPasien', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    var nama = $scope.item.namaPasien.toUpperCase()
                    $scope.item.namaPasien = nama;
                }
            });

            $scope.$watch('item.tempatLahir', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    var nama = $scope.item.tempatLahir.toUpperCase()
                    $scope.item.tempatLahir = nama;
                }
            });

            $scope.$watch('item.noIdentitas', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    var nama = $scope.item.noIdentitas.toUpperCase()
                    $scope.item.noIdentitas = nama;
                }
            });

            $scope.$watch('item.alamatLengkap', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    var nama = $scope.item.alamatLengkap.toUpperCase()
                    $scope.item.alamatLengkap = nama;
                }
            });

            $scope.$watch('item.alamatLengkap', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    var nama = $scope.item.alamatLengkap.toUpperCase()
                    $scope.item.alamatLengkap = nama;
                }
            });

            $scope.$watch('item.namaAyah', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    var nama = $scope.item.namaAyah.toUpperCase()
                    $scope.item.namaAyah = nama;
                }
            });

            $scope.$watch('item.namaIbu', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    var nama = $scope.item.namaIbu.toUpperCase()
                    $scope.item.namaIbu = nama;
                }
            });

            $scope.$watch('item.namaKeluarga', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    var nama = $scope.item.namaKeluarga.toUpperCase()
                    $scope.item.namaKeluarga = nama;
                }
            });

            $scope.$watch('item.namaSuamiIstri', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    var nama = $scope.item.namaSuamiIstri.toUpperCase()
                    $scope.item.namaSuamiIstri = nama;
                }
            });

            $scope.$watch('item.PenanggungJawab', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    var nama = $scope.item.PenanggungJawab.toUpperCase()
                    $scope.item.PenanggungJawab = nama;
                }
            });

            $scope.$watch('item.Hubungan', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    var nama = $scope.item.Hubungan.toUpperCase()
                    $scope.item.Hubungan = nama;
                }
            });

            $scope.$watch('item.alamatRumah', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    var nama = $scope.item.alamatRumah.toUpperCase()
                    $scope.item.alamatRumah = nama;
                }
            });

            $scope.$watch('item.alamatKantor', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    var nama = $scope.item.alamatKantor.toUpperCase()
                    $scope.item.alamatKantor = nama;
                }
            });


            $scope.$watch('item.Bahasa', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    var nama = $scope.item.Bahasa.toUpperCase()
                    $scope.item.Bahasa = nama;
                }
            });

            $scope.$watch('item.DokterPengirim', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    var nama = $scope.item.DokterPengirim.toUpperCase()
                    $scope.item.DokterPengirim = nama;
                }
            });

            $scope.$watch('item.alamatDokterPengirim', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    var nama = $scope.item.alamatDokterPengirim.toUpperCase()
                    $scope.item.alamatDokterPengirim = nama;
                }
            });

            $("#photo").kendoUpload({
                localization: {
                    "select": "Pilih Photo..."
                },
                async: {
                    saveUrl: "save",
                    removeUrl: "remove",
                    autoUpload: false
                },
                multiple: false,
                select: function (e) {
                    var ALLOWED_EXTENSIONS = [".jpeg", ".jpg", ".png"];
                    var extension = e.files[0].extension.toLowerCase();
                    if (ALLOWED_EXTENSIONS.indexOf(extension) == -1) {
                        toastr.error('Mohon Pilih File Gambar (.jpg, .jpeg, .png)')
                        e.preventDefault();
                        // return
                    }



                    var fileInfo = e.files[0];
                    var wrapper = this.wrapper;
                    // debugger
                    $scope.ImageUrlData = wrapper.context.value;
                    setTimeout(function () {
                        addPreview(fileInfo, wrapper);
                        compress(e);

                    });
                    // $scope.previewImage = compress(e);
                    // imageToDataUri(e.files[0].rawFile,220,220)
                    // console.log(resultPhotoKami)

                }
            });

            function addPreview(file, wrapper) {
                var raw = file.rawFile;
                var reader = new FileReader();

                if (raw) {

                    reader.onloadend = function () {
                        var preview = $("<img class='img-responsive'>").attr("src", this.result);

                        wrapper.find(".k-file[data-uid='" + file.uid + "'] .k-file-extension-wrapper")
                            .replaceWith(preview);
                        // $scope.item.image = this.result
                        // $scope.previewImage = this.result

                    };

                    reader.readAsDataURL(raw);
                    // const img = new Image();
                }
            }


            function compress(e) {
                var width = 354;
                var height = 472;
                var fileName = e.files[0].name;
                var reader = new FileReader();
                var raw = e.files[0].rawFile;
                reader.readAsDataURL(raw);
                reader.onload = event => {
                    var img = new Image();
                    img.src = event.target.result;
                    img.onload = () => {
                        var elem = document.createElement('canvas');

                        elem.width = width;
                        elem.height = height;

                        var ctx = elem.getContext('2d');
                        // img.width and img.height will contain the original dimensions
                        ctx.drawImage(img, 0, 0, width, height);
                        // console.log(ctx.canvas.toDataURL('image/jpeg',1))
                        $scope.urlImage = ctx.canvas.toDataURL('image/jpeg', 1);
                        // var res = $scope.urlImage.replace("data:image/jpeg;base64,", "");
                        // $scope.urlImage= base64toHEX(res)
                        // $scope.resultDecode = Convert(res)
                        // $scope.urlImage = 'data:image/jpeg;base64,' + $scope.resultDecode
                        // ctx.canvas.toBlob((blob) => {
                        //     // link.href = URL.createObjectURL(blob);
                        //     console.log(blob);
                        //     // console.log(link.href); // this lin
                        //     var file = new File([blob], fileName, {
                        //         type: 'image/jpeg',
                        //         lastModified: Date.now()
                        //     });

                        // }, 'image/jpeg', 1);
                    },
                        reader.onerror = error => console.log(error);
                };
            }
            function base64toHEX(base64) {

                var raw = atob(base64);

                var HEX = '';

                for (var i = 0; i < raw.length; i++) {

                    var _hex = raw.charCodeAt(i).toString(16)

                    HEX += (_hex.length == 2 ? _hex : '0' + _hex);

                }
                return HEX.toUpperCase();

            }

            //   console.log(base64toHEX("oAAABTUAAg=="));
            // medifirstService.get('registrasi/get-image').then(function (e) {
            //     $scope.item.image = e.data[0].image
            // })
            $scope.UploadPhoto = function () {
                if ($scope.urlImage != undefined) {
                    // saveImageToDirsaveImageToDir($scope.urlImage,'0182781')
                    $scope.item.image = $scope.urlImage
                    $scope.popUpUpload.close()
                } else {
                    toastr.info('Gambar belum di pilih')
                    return
                }
            }

            $scope.showPopUp = function () {
                $scope.popUpUpload.center().open()
                // if ($scope.urlImage != undefined) {
                // debugger;
                // var client = new HttpClient();
                // if ($scope.idPasien == undefined) {
                //     medifirstService.postNonMessage('registrasi/save-pasien-before-foto').then(function (z) {
                //         $scope.idPasien = z.data.data;
                //         client.get('http://127.0.0.1:1237/printvb/Pendaftaran?simpan-foto-pasien=1&nocm=' + $scope.idPasien + '&a=a' + '&view=false', function (response) {
                //             // do something with response
                //             // editPasien()

                //             medifirstService.get("registrasi/get-bynocm?idPasien=" + $scope.idPasien).then(function (e) {
                //                 // $scope.isRouteLoading = false
                //                 var result = e.data.data
                //                 if (result.foto)// && result.foto != 'data:image/jpeg;base64,')
                //                     $scope.item.image = result.foto
                //             })
                //         });
                //     })
                // } else {
                //     client.get('http://127.0.0.1:1237/printvb/Pendaftaran?simpan-foto-pasien=1&nocm=' + $scope.idPasien + '&a=a' + '&view=false', function (response) {
                //         // do something with response
                //         // editPasien()

                //         medifirstService.get("registrasi/get-bynocm?idPasien=" + $scope.idPasien).then(function (e) {
                //             // $scope.isRouteLoading = false
                //             var result = e.data.data
                //             if (result.foto)// && result.foto != 'data:image/jpeg;base64,')
                //                 $scope.item.image = result.foto
                //         })
                //     });
                // }

                // var rahu = "https://1.bp.blogspot.com/-TBlsrlalCKg/VVPBnPxLZuI/AAAAAAAADTo/wtDexv6kTFs/s320/Contoh%2BPas%2BFoto%2BSbmptn.png"

                // }
            }

            $scope.TutupPopUp = function () {
                if ($scope.urlImage != undefined)
                    $scope.item.image = "../app/images/avatar.jpg"
                $scope.urlImage = undefined
                $scope.popUpUpload.close()
            }
            $scope.Back = function () {
                window.history.back()
            }
            /*Capitalize*/

            var HttpClient = function () {
                this.get = function (aUrl, aCallback) {
                    var anHttpRequest = new XMLHttpRequest();
                    anHttpRequest.onreadystatechange = function () {
                        if (anHttpRequest.readyState == 4)
                            aCallback(anHttpRequest.responseText);
                    }

                    anHttpRequest.open("GET", aUrl, true);
                    anHttpRequest.send(null);
                    anHttpRequest.response
                }
            }
            var base64_chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
            function clean_hex(input) {
                input = input.toUpperCase();
                input = input.replace(/0x/gi, "");
                input = input.replace(/[^A-Fa-f0-9]/g, "");
                return input;
            }

            function binary_to_base64(input) {
                var ret = new Array();
                var i = 0;
                var j = 0;
                var char_array_3 = new Array(3);
                var char_array_4 = new Array(4);
                var in_len = input.length;
                var pos = 0;

                while (in_len--) {
                    char_array_3[i++] = input[pos++];
                    if (i == 3) {
                        char_array_4[0] = (char_array_3[0] & 0xfc) >> 2;
                        char_array_4[1] = ((char_array_3[0] & 0x03) << 4) + ((char_array_3[1] & 0xf0) >> 4);
                        char_array_4[2] = ((char_array_3[1] & 0x0f) << 2) + ((char_array_3[2] & 0xc0) >> 6);
                        char_array_4[3] = char_array_3[2] & 0x3f;

                        for (i = 0; (i < 4); i++)
                            ret += base64_chars.charAt(char_array_4[i]);
                        i = 0;
                    }
                }

                if (i) {
                    for (j = i; j < 3; j++)
                        char_array_3[j] = 0;

                    char_array_4[0] = (char_array_3[0] & 0xfc) >> 2;
                    char_array_4[1] = ((char_array_3[0] & 0x03) << 4) + ((char_array_3[1] & 0xf0) >> 4);
                    char_array_4[2] = ((char_array_3[1] & 0x0f) << 2) + ((char_array_3[2] & 0xc0) >> 6);
                    char_array_4[3] = char_array_3[2] & 0x3f;

                    for (j = 0; (j < i + 1); j++)
                        ret += base64_chars.charAt(char_array_4[j]);

                    while ((i++ < 3))
                        ret += '=';

                }

                return ret;
            }
            //    document.getElementById("myImage").src=='data:image/jpeg;'+Convert(();
            function Convert(binaryString) {
                var cleaned_hex = clean_hex(binaryString);
                if (cleaned_hex.length % 2) {
                    alert("Error: cleaned hex string length is odd.");
                    return "";
                }
                var binary = new Array();
                for (var i = 0; i < cleaned_hex.length / 2; i++) {
                    var h = cleaned_hex.substr(i * 2, 2);
                    binary[i] = parseInt(h, 16);
                }
                return binary_to_base64(binary);
            }
             let data2 =[]
             $scope.alamat = {}
             $scope.gridAlamat = {
                toolbar: [{
                    name: "create", text: "Input Baru",
                    template: '<button ng-click="addPop()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah </button>'
                },],
                pageable: true,
                scrollable: true,
                columns: [
                   
                    {
                        "field": "jenisalamat",
                        "title": "Jenis Alamat",
                    },
                    {
                        "field": "alamatlengkap",
                        "title": "Alamat",
                    },
                     {
                        "field": "alamatdetail",
                        "title": "Detail",
                    },
                    {
                        command:[ {
                            text: "Edit",
                            align: "center",
                            attributes: { align: "center" },
                            click: ediData
                        },{
                            text: "Hapus",
                            align: "center",
                            attributes: { align: "center" },
                            click: removeData
                        }],
                        title: "#",
                    }
                ]
            };

           
             function ediData(e) {
                e.preventDefault();
                var grid = this;
                var row = $(e.currentTarget).closest("tr");
                var tr = $(e.target).closest("tr");
                var dataItem = this.dataItem(tr);

                $scope.alamat.no = dataItem.no
                $scope.alamat.alamatLengkap = dataItem.alamatlengkap
                $scope.alamat.jenisAlamat = {id:dataItem.objectjenisalamatfk, jenisalamat:dataItem.jenisalamat}
                if(dataItem.objectdesakelurahanfk){
                  medifirstService.get("registrasi/get-desa-kelurahan-paging?iddesakelurahan=" + dataItem.objectdesakelurahanfk).then(function (re) {
                    if (re.data[0] != undefined) {
                        var data = {
                            id: re.data[0].id,
                            namadesakelurahan: re.data[0].namadesakelurahan,
                            kodepos: re.data[0].kodepos,
                            namakecamatan: re.data[0].namakecamatan,
                            namakotakabupaten: re.data[0].namakotakabupaten,
                            namapropinsi: re.data[0].namapropinsi,
                            objectkecamatanfk: re.data[0].objectkecamatanfk,
                            objectkotakabupatenfk: re.data[0].objectkotakabupatenfk,
                            objectpropinsifk: re.data[0].objectpropinsifk,
                            desa: re.data[0].namadesakelurahan,
                        }
                        $scope.listDataKelurahan.add(data)
                        $scope.alamat.desaKelurahan= data
                    }
                });  
                }
                
                // for (var i = 0; i < $scope.listDataKelurahan.length; i++) {
                //     const element = $scope.listDataKelurahan[i]
                //     if(dataItem.desafk == element.id){
                //        $scope.alamat.desaKelurahan = element
                //     }
                // }
                for (var i = 0; i < $scope.listDataKecamatan.length; i++) {
                    const element = $scope.listDataKecamatan[i]
                    if(dataItem.objectkecamatanfk == element.id){
                       $scope.alamat.kecamatan = element
                    }
                }
                for (var i = 0; i < $scope.listDataKotaKabupaten.length; i++) {
                    const element = $scope.listDataKotaKabupaten[i]
                    if(dataItem.objectkotakabupatenfk == element.id){
                       $scope.alamat.kotaKabupaten = element
                    }
                }
                for (var i = 0; i < $scope.listDataPropinsi.length; i++) {
                    const element = $scope.listDataPropinsi[i]
                    if(dataItem.objectpropinsifk == element.id){
                       $scope.alamat.propinsi = element
                    }
                }
                $scope.popUpAlamat.center().open();
                

            }
             function removeData(e) {
                e.preventDefault();
                var grid = this;
                var row = $(e.currentTarget).closest("tr");
                var tr = $(e.target).closest("tr");
                var dataItem = this.dataItem(tr);
                grid.removeRow(row);

                if (dataItem != undefined) {
                    for (var i = data2.length - 1; i >= 0; i--) {
                        if (data2[i].no == dataItem.no) {
                            data2.splice(i, 1);
                            $scope.listAlamat = new kendo.data.DataSource({
                                data: data2
                            });
                        }
                    }
                }
                if(data2.length == 0 ){
                   $scope.listAlamat = undefined;
                }
                $scope.alamat.no = undefined
            }

            $scope.addPop = function () {
                $scope.alamat = {};
                $scope.alamat.no = undefined
              
                $scope.popUpAlamat.center().open();
            }
            $scope.tutupAlamat = function () {
                $scope.alamat = {};
                $scope.alamat.no = undefined
                $scope.popUpAlamat.close();
            }

            $scope.saveAlamat = function () {
                if($scope.alamat.alamatLengkap == undefined){
                    messageContainer.error("Alamat Lengkap Harus Di isi")
                    return
                }
                if($scope.alamat.jenisAlamat == undefined){
                    messageContainer.error("Jenis Alamat Harus Di isi")
                    return
                }
                var nomor = 0
                if ($scope.listAlamat == undefined) {
                    nomor = 1
                } else {
                    nomor = data2.length + 1
                }
                var data = {};
                var alamatLeng = ''
                if($scope.alamat.desaKelurahan){alamatLeng = alamatLeng +' ' + $scope.alamat.desaKelurahan.namadesakelurahan}
                if($scope.alamat.kecamatan){alamatLeng = alamatLeng +' ' + $scope.alamat.kecamatan.namakecamatan}
                if($scope.alamat.kotaKabupaten){alamatLeng = alamatLeng +' ' + $scope.alamat.kotaKabupaten.namakotakabupaten}
                if($scope.alamat.propinsi){alamatLeng = alamatLeng +' ' + $scope.alamat.propinsi.namapropinsi}    

                if ($scope.alamat.no != undefined) {
                     for (var i = data2.length - 1; i >= 0; i--) {
                        if (data2[i].no == $scope.alamat.no) {
                            data.no = $scope.alamat.no
                            data.alamatlengkap = $scope.alamat.alamatLengkap
                            data.objectdesakelurahanfk = $scope.alamat.desaKelurahan?$scope.alamat.desaKelurahan.id:null
                            data.namadesakelurahan = $scope.alamat.desaKelurahan?$scope.alamat.desaKelurahan.namadesakelurahan:null
                            data.objectkecamatanfk =  $scope.alamat.kecamatan?$scope.alamat.kecamatan.id:null
                            data.namakecamatan =  $scope.alamat.kecamatan?$scope.alamat.kecamatan.namakecamatan:null
                            data.objectkotakabupatenfk =  $scope.alamat.kotaKabupaten?$scope.alamat.kotaKabupaten.id:null
                            data.namakotakabupaten =  $scope.alamat.kotaKabupaten?$scope.alamat.kotaKabupaten.namakotakabupaten:null
                            data.objectpropinsifk =  $scope.alamat.propinsi?$scope.alamat.propinsi.id:null
                            data.propinsi =  $scope.alamat.propinsi?$scope.alamat.propinsi.namapropinsi:null
                            data.jenisalamat = $scope.alamat.jenisAlamat.jenisalamat
                            data.objectjenisalamatfk = $scope.alamat.jenisAlamat.id
                            data.alamatdetail = alamatLeng
                            data2[i] = data;
                            $scope.listAlamat = new kendo.data.DataSource({
                                data: data2
                            });
                        
                        }
                }
             } else {
                    data = {
                        no: nomor,
                        alamatlengkap:$scope.alamat.alamatLengkap,
                        objectdesakelurahanfk: $scope.alamat.desaKelurahan?$scope.alamat.desaKelurahan.id:null,
                        namadesakelurahan: $scope.alamat.desaKelurahan?$scope.alamat.desaKelurahan.namadesakelurahan:null,
                        objectkecamatanfk: $scope.alamat.kecamatan?$scope.alamat.kecamatan.id:null,
                        namakecamatan: $scope.alamat.kecamatan?$scope.alamat.kecamatan.namakecamatan:null,
                        objectkotakabupatenfk:  $scope.alamat.kotaKabupaten?$scope.alamat.kotaKabupaten.id:null,
                        namakotakabupaten: $scope.alamat.kotaKabupaten?$scope.alamat.kotaKabupaten.namakotakabupaten:null,
                        objectpropinsifk: $scope.alamat.propinsi?$scope.alamat.propinsi.id:null,
                        propinsi: $scope.alamat.propinsi?$scope.alamat.propinsi.namapropinsi:null,
                        alamatdetail: alamatLeng,
                        jenisalamat: $scope.alamat.jenisAlamat.jenisalamat,
                        objectjenisalamatfk :$scope.alamat.jenisAlamat.id
                    }
                    data2.push(data)
                  
                    $scope.listAlamat = new kendo.data.DataSource({
                        data: data2
                    });
                
                }
              

               $scope.alamat = {};
               $scope.alamat.no = undefined
               $scope.popUpAlamat.close();
            }
        }
    ]);
});