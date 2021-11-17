define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DTOOrangCtrl', ['$rootScope', '$scope', 'ModelItem', '$state', 'DateHelper', 'MedifirstService',
        function ($rootScope, $scope, ModelItem, $state, DateHelper, medifirstService) {
            $scope.isRouteLoading = true;
            $scope.clear = function () {
                $scope.item = {};
                $scope.item.identitas = $scope.dataCheckbox[0];
                $scope.isRouteLoading = false;
            };
            $scope.isShowPotensi = true;
            $scope.isShowApproval = false;
            $scope.isShowTglPulang = false;
            $scope.isShowIntegrasi = false;
            $scope.isPassport = false;
            $scope.isNotFound = false;
            $scope.isFound = false;
            $scope.isSave = true;
            $scope.formitem = {}

            var tampungdata = []

            medifirstService.get("bridging/newallrecord/list-negara/500/1").then(function (e) {
                $scope.listNegara = e.data
            })
            medifirstService.get("bridging/newallrecord/list-lokasi/1000/1").then(function (e) {
                $scope.listlokasiktp = e.data
                $scope.listlokasidomisili = e.data
            })

            $scope.showPembuatanSep = function () {
                $scope.isShowPembuatanSep = !$scope.isShowPembuatanSep;
            }
            $scope.showPotensi = function () {
                $scope.isShowPotensi = !$scope.isShowPotensi;
            }

            $scope.dataCheckbox = [{
                "id": 1, "name": "NIK"
            }, {
                "id": 2, "name": "Passport"
            }];
            $scope.listjeniskelamin = [{
                "id": "L", "jeniskelamin": "Laki - laki"
            }, {
                "id": "P", "jeniskelamin": "Perempuan"
            }];
            $scope.clear();
            $scope.findData = function (data) {
                if (!data) return;
                if (!$scope.item.identitas) {
                    messageContainer.error('Pilih Pencarian Berdasarkan NIK/Passport Terlebih Dahulu');
                    return;
                } else {
                    tampungdata = []
                    if ($scope.item.identitas.id === 1) {
                        $scope.cekNik(data);
                    } else {
                        $scope.cekPassport(data);
                    }
                }
            }
            $scope.cekNik = function (nik) {
                $scope.isRouteLoading = true;
                var objSend = {
                    "data" : {
                        "nik": nik
                    }
                }
                medifirstService.post("bridging/newallrecord/get-orang-nik", objSend).then(function (e) {
                    document.getElementById("json").innerHTML = JSON.stringify(e.data, undefined, 4);
                    $scope.isRouteLoading = false;
                    if(e.data.data == null){
                        $scope.isNotFound = true;
                        $scope.isFound = false;
                    } else {
                        $scope.isNotFound = false;
                        $scope.isFound = true;
                        tampungdata.push(e.data.data);
                    }
                });
            }
            $scope.cekPassport = function (noKartu) {
                if (!$scope.item.negara) {
                    messageContainer.error('Pilih Negara Terlebih Dahulu');
                    return;
                }
                $scope.isRouteLoading = true;
                var objSend = {
                    "data" : {
                        "negara_id": $scope.item.negara.id,
                        "passport": noKartu
                    }
                }
                medifirstService.post("bridging/newallrecord/get-orang-passport",objSend).then(function (e) {
                    document.getElementById("json").innerHTML = JSON.stringify(e.data, undefined, 4);
                    $scope.isRouteLoading = false;
                    if(e.data.data == null){
                        $scope.isNotFound = true;
                        $scope.isFound = false;
                    } else {
                        $scope.isNotFound = false;
                        $scope.isFound = true;
                        tampungdata.push(e.data.data);
                    }
                });
            }

            $scope.$watch('item.identitas', function (e) {
                if (e === undefined) return;
                switch(e.id) {
                    case 1:
                        $scope.isPassport = false;
                        break;
                    case 2:
                        $scope.isPassport = true;
                        break;
                }
            })

            $scope.tambahpasien = function () {
                $scope.isSave = true;
                if ($scope.item.identitas.id === 1) {
                    $scope.isNik = true;
                } else {
                    $scope.isNik = false;
                }
                $scope.formitem = {};
                $scope.formitem.nik = $scope.item.data;
                $scope.formitem.tgllahir = "";
                $scope.popUpTambahPasien.center().open()
            }
            $scope.updatepasien = function() {
                $scope.isSave = false;
                if ($scope.item.identitas.id === 1) {
                    $scope.isNik = true;
                    $scope.formitem.nik = tampungdata[0].nik;
                } else {
                    $scope.isNik = false;
                    $scope.formitem.nik = parseInt(tampungdata[0].passport);
                }
                var textjeniskelamin = ""
                var textlokasiktp = ""
                var textlokasidomisili = ""

                for (let i = 0; i < $scope.listjeniskelamin.length; i++) {
                    if($scope.listjeniskelamin[i].id == tampungdata[0].jenis_kelamin) {
                        textjeniskelamin = $scope.listjeniskelamin[i].jeniskelamin
                        break;
                    }
                }
                for (let i = 0; i < $scope.listlokasiktp.length; i++) {
                    if($scope.listlokasiktp[i].kode == tampungdata[0].ktp_lokasi_kode) {
                        textlokasiktp = $scope.listlokasiktp[i].nama
                        break;
                    }
                }
                for (let i = 0; i < $scope.listlokasidomisili.length; i++) {
                    if($scope.listlokasidomisili[i].kode == tampungdata[0].domisili_lokasi_kode) {
                        textlokasidomisili = $scope.listlokasidomisili[i].nama
                        break;
                    }
                }
                $scope.formitem.orang_id = tampungdata[0].id;
                $scope.formitem.nama = tampungdata[0].nama
                $scope.formitem.tgllahir = tampungdata[0].tgl_lahir
                $scope.formitem.jeniskelamin = { id: tampungdata[0].jenis_kelamin, jeniskelamin: textjeniskelamin }
                $scope.formitem.telepon = tampungdata[0].telepon
                $scope.formitem.alamatktp = tampungdata[0].ktp_alamat
                $scope.formitem.rwktp = tampungdata[0].ktp_rw
                $scope.formitem.rtktp = tampungdata[0].ktp_rt
                $scope.formitem.lokasiktp = { kode: tampungdata[0].ktp_lokasi_kode, nama: textlokasiktp }
                $scope.formitem.alamatdomisili = tampungdata[0].domisili_alamat
                $scope.formitem.rwdomisili = tampungdata[0].domisili_rw
                $scope.formitem.rtdomisili = tampungdata[0].domisili_rt
                $scope.formitem.lokasidomisili = { kode: tampungdata[0].domisili_lokasi_kode, nama: textlokasidomisili }
                $scope.popUpTambahPasien.center().open()
            }
            $scope.batal = function () {
                $scope.formitem = {};
                $scope.popUpTambahPasien.close();
            };
            $scope.save = function () {
                if ($scope.formitem.nik == undefined) {
                    toastr.error("NIK/Passport harus diisi")
                    return;
                }
                if($scope.formitem.nama == undefined){
                    toastr.error("Nama harus diisi")
                    return;
                }
                if($scope.formitem.tgllahir == undefined){
                    toastr.error("Tanggal Lahir harus diisi")
                    return;
                }
                if($scope.formitem.jeniskelamin == undefined){
                    toastr.error("Jenis Kelamin harus diisi")
                    return;
                }
                if($scope.formitem.alamatdomisili == undefined){
                    toastr.error("Alamat Domisili harus diisi")
                    return;
                }
                if($scope.formitem.rwdomisili == undefined){
                    toastr.error("RW Domisili harus diisi")
                    return;
                }
                if($scope.formitem.rtdomisili == undefined){
                    toastr.error("RT Domisili harus diisi")
                    return;
                }
                if($scope.formitem.lokasidomisili == undefined){
                    toastr.error("Lokasi Domisili harus diisi")
                    return;
                }
                if ($scope.item.identitas.id === 1) {

                    if($scope.formitem.alamatktp == undefined){
                        toastr.error("Alamat harus diisi")
                        return;
                    }
                    if($scope.formitem.rwktp == undefined){
                        toastr.error("RW KTP harus diisi")
                        return;
                    }
                    if($scope.formitem.rtktp == undefined){
                        toastr.error("RT KTP harus diisi")
                        return;
                    }
                    if($scope.formitem.lokasiktp == undefined){
                        toastr.error("Lokasi KTP harus diisi")
                        return;
                    }

                    var UrlSave = "bridging/newallrecord/add-orang-nik";
                    var objSave = {
                        "data": {
                            "nik": $scope.formitem.nik,
                            "nama": $scope.formitem.nama,
                            "tgl_lahir": new moment($scope.formitem.tgllahir).format('YYYY-MM-DD'),
                            "jenis_kelamin": $scope.formitem.jeniskelamin.id,
                            "ktp_alamat": $scope.formitem.alamatktp,
                            "ktp_rw": $scope.formitem.rwktp,
                            "ktp_rt": $scope.formitem.rtktp,
                            "ktp_lokasi_kode": $scope.formitem.lokasiktp.kode,
                            "domisili_alamat": $scope.formitem.alamatdomisili,
                            "domisili_rw": $scope.formitem.rwdomisili,
                            "domisili_rt": $scope.formitem.rtdomisili,
                            "domisili_lokasi_kode": $scope.formitem.lokasidomisili.kode,
                            "telepon": $scope.formitem.telepon
                        }
                    }
                } else {
                    var UrlSave = "bridging/newallrecord/add-orang-passport";
                    var objSave = {
                        "data": {
                            "negara_id": $scope.item.negara.id,
                            "passport": $scope.formitem.nik,
                            "nama": $scope.formitem.nama,
                            "tgl_lahir": new moment($scope.formitem.tgllahir).format('YYYY-MM-DD'),
                            "jenis_kelamin": $scope.formitem.jeniskelamin.id,
                            "domisili_alamat": $scope.formitem.alamatdomisili,
                            "domisili_rw": $scope.formitem.rwdomisili,
                            "domisili_rt": $scope.formitem.rtdomisili,
                            "domisili_lokasi_kode": $scope.formitem.lokasidomisili.kode,
                            "telepon": $scope.formitem.telepon
                        }
                    }
                }
                
                medifirstService.postNonMessage(UrlSave, objSave).then(function (e) {
                    toastr.success(e.data.status);
                    $scope.findData($scope.formitem.nik);
                    $scope.batal();
                })
            }
            $scope.update = function () {
                if ($scope.formitem.nik == undefined) {
                    toastr.error("NIK/Passport harus diisi")
                    return;
                }
                if($scope.formitem.nama == undefined){
                    toastr.error("Nama harus diisi")
                    return;
                }
                if($scope.formitem.tgllahir == undefined){
                    toastr.error("Tanggal Lahir harus diisi")
                    return;
                }
                if($scope.formitem.jeniskelamin == undefined){
                    toastr.error("Jenis Kelamin harus diisi")
                    return;
                }
                if($scope.formitem.alamatdomisili == undefined){
                    toastr.error("Alamat Domisili harus diisi")
                    return;
                }
                if($scope.formitem.rwdomisili == undefined){
                    toastr.error("RW Domisili harus diisi")
                    return;
                }
                if($scope.formitem.rtdomisili == undefined){
                    toastr.error("RT Domisili harus diisi")
                    return;
                }
                if($scope.formitem.lokasidomisili == undefined){
                    toastr.error("Lokasi Domisili harus diisi")
                    return;
                }
                if ($scope.item.identitas.id === 1) {
                    
                    if($scope.formitem.alamatktp == undefined){
                        toastr.error("Alamat harus diisi")
                        return;
                    }
                    if($scope.formitem.rwktp == undefined){
                        toastr.error("RW KTP harus diisi")
                        return;
                    }
                    if($scope.formitem.rtktp == undefined){
                        toastr.error("RT KTP harus diisi")
                        return;
                    }
                    if($scope.formitem.lokasiktp == undefined){
                        toastr.error("Lokasi KTP harus diisi")
                        return;
                    }

                    var UrlSave = "bridging/newallrecord/update-orang-nik";
                    var objSave = {
                        "data": {
                            "orang_id": $scope.formitem.orang_id,
                            "nik": $scope.formitem.nik,
                            "nama": $scope.formitem.nama,
                            "tgl_lahir": new moment($scope.formitem.tgllahir).format('YYYY-MM-DD'),
                            "jenis_kelamin": $scope.formitem.jeniskelamin.id,
                            "ktp_alamat": $scope.formitem.alamatktp,
                            "ktp_rw": $scope.formitem.rwktp,
                            "ktp_rt": $scope.formitem.rtktp,
                            "ktp_lokasi_kode": $scope.formitem.lokasiktp.kode,
                            "domisili_alamat": $scope.formitem.alamatdomisili,
                            "domisili_rw": $scope.formitem.rwdomisili,
                            "domisili_rt": $scope.formitem.rtdomisili,
                            "domisili_lokasi_kode": $scope.formitem.lokasidomisili.kode,
                            "telepon": $scope.formitem.telepon
                        }
                    }
                } else {
                    var UrlSave = "bridging/newallrecord/update-orang-passport";
                    var objSave = {
                        "data": {
                            "orang_id": $scope.formitem.orang_id,
                            "negara_id": $scope.item.negara.id,
                            "passport": $scope.formitem.nik,
                            "nama": $scope.formitem.nama,
                            "tgl_lahir": new moment($scope.formitem.tgllahir).format('YYYY-MM-DD'),
                            "jenis_kelamin": $scope.formitem.jeniskelamin.id,
                            "domisili_alamat": $scope.formitem.alamatdomisili,
                            "domisili_rw": $scope.formitem.rwdomisili,
                            "domisili_rt": $scope.formitem.rtdomisili,
                            "domisili_lokasi_kode": $scope.formitem.lokasidomisili.kode,
                            "telepon": $scope.formitem.telepon
                        }
                    }
                }
                
                medifirstService.postNonMessage(UrlSave, objSave).then(function (e) {
                    toastr.success(e.data.status);
                    $scope.findData($scope.formitem.nik);
                    $scope.batal();
                })
            }
        }
    ]);
});