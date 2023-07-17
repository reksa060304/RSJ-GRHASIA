define(['initialize','Configuration'], function (initialize, configuration){
    'use strict';
    initialize.controller('CopyResepCtrl', ['CacheHelper', '$q', '$rootScope', '$scope', 'DateHelper', '$http', '$state', 'MedifirstService', 
    function (cacheHelper, $q, $rootScope, $scope, DateHelper, $http, $state, medifirstService){
        $scope.item = {}
        $scope.tombolSimpanVis = true
        $scope.now = new Date()
        let pegawai = JSON.parse(localStorage.getItem("pegawai"));
        var norec_resep = ''
        $scope.listItemREV = [{
            norec: null,
            rke: null,
            dosis: null,
            produk: null,
            aturanpakai: null,
            ispagi: null,
            issiang: null,
            issore: null,
            ismalam: null,
            qtyproduk: null,
            entry: null,
            iter1: null,
            iter2: null,
            iter3: null,
            mfla: null,
            jumlahobat: null,
            sediaan: null,
            strukorderfk: $state.params.norec_order
        }]
        loadData()
        async function loadData() {
            let cek = await medifirstService.get('farmasi/cek-copyresep?norec_order=' + $state.params.norec_order)
            console.log(cek.data[0].iscopyresep);
            if (cek.data[0].iscopyresep == true) {
                await medifirstService.get('get/get-copy-resepnya?norec_order='+$state.params.norec_order).then(function(data){
                    var datas = data.data.data
                    $scope.item.namapasien = datas[0].namapasien
                    $scope.item.namadokter = datas[0].dokter
                    $scope.item.tglno = moment(datas[0].tglresep).format('DD-MM-YYYY HH:mm') + " / " + datas[0].noresep
                    $scope.item.iterasi1 = datas[0].cpiter1
                    $scope.item.iterasi2 = datas[0].cpiter2
                    $scope.item.iterasi3 = datas[0].cpiter3
                    $scope.item.noresep = datas[0].noresep
                    $scope.item.tglresep = moment(datas[0].tanggal).format('DD-MM-YYYY HH:mm')
                    $scope.listItemREV = [];
                    norec_resep = datas[0].norec_cr
                    $scope.copyresep = {
                        norec: norec_resep,
                        noresep: datas[0].noresep,
                        namapasien: $scope.item.namapasien,
                        dokter: $scope.item.namadokter,
                        tanggal: datas[0].tanggal,
                        strukorderfk: $state.params.norec_order,
                        iter1: $scope.item.iterasi1,
                        iter2: $scope.item.iterasi2,
                        iter3: $scope.item.iterasi3,
                        tglcopy: moment(datas[0].tglcopy).format('YYYY-MM-DD'),
                        objectpegawaifk: pegawai.id,
                        norec_order: $state.params.norec_order
                    }
                    var rke = 0
                    var index = 0
                    $scope.entryan = []
                    $scope.entryanmfla = []
                    $scope.entryansediaan = []
                    for (let i = 0; i < datas.length; i++) {
                        index = i + 1
                        if (datas[i].entry != null) {
                            $scope.entryan[index] = true
                            $scope.entryanmfla[index] = true
                        }
                        if(datas[i].sediaan != null){
                            $scope.entryansediaan[index] = true
                        }
                        if (datas[i].mfla != null) {
                            $scope.entryanmfla[index] = true
                        }
                        var data = {
                            index: i+1,
                            norec: datas[i].norec_crd,
                            rke: datas[i].rke ? datas[i].rke : null,
                            dosis: datas[i].dosis ? datas[i].dosis : null,
                            produk: datas[i].produk ? datas[i].produk : null,
                            aturanpakai: datas[i].aturanpakai ? datas[i].aturanpakai : null,
                            ispagi: datas[i].ispagi != null ? true : null,
                            issiang: datas[i].issiang != null ? true : null,
                            issore: datas[i].issore != null ? true : null,
                            ismalam: datas[i].ismalam != null ? true : null,
                            jumlah: datas[i].jumlah ? datas[i].jumlah : null,
                            entry: datas[i].entry != null ? datas[i].entry : null,
                            iter1: datas[i].iterobat1 != null ? true : null,
                            iter2: datas[i].iterobat2 != null ? true : null,
                            iter3: datas[i].iterobat3 != null ? true : null,
                            mfla: datas[i].mfla,
                            sediaan: datas[i].sediaan,
                            jeniskemasanfk: datas[i].jeniskemasanfk
                        }
                        $scope.listItemREV.push(data)
                    }
                })
            }else{
                await medifirstService.get('get/load-copy-resep?norec_order=' + $state.params.norec_order).then(function (data) {
                    var datas = data.data.data
                    $scope.item.namapasien = data.data.datapasien[0].namapasien
                    $scope.item.namadokter = data.data.datapasien[0].namalengkap
                    $scope.item.noresep = data.data.datapasien[0].noresep
                    $scope.item.tglresep = moment(data.data.datapasien[0].tglresep).format('DD-MM-YYYY HH:mm')
                    $scope.item.tglno = moment(data.data.datapasien[0].tglresep).format('DD-MM-YYYY HH:mm') + " / " + data.data.datapasien[0].noresep
                    $scope.listItemREV = [];
                    $scope.copyresep = {
                        norec: norec_resep,
                        noresep: data.data.datapasien[0].noresep,
                        namapasien: $scope.item.namapasien,
                        dokter: $scope.item.namadokter,
                        tanggal: data.data.datapasien[0].tglresep,
                        strukorderfk: $state.params.norec_order,
                        iter1: $scope.item.iterasi1 != null ? true : null,
                        iter2: $scope.item.iterasi2 != null ? true : null,
                        iter3: $scope.item.iterasi3 != null ? true : null,
                        tglcopy: moment($scope.now).format('YYYY-MM-DD'),
                        objectpegawaifk: pegawai.id,
                        norec_order: $state.params.norec_order,
                    }
                    var rke = 0
                    var index = 0
                    $scope.entryan = []
                    $scope.entryanmfla = []
                    $scope.entryansediaan = []
                    for (let i = 0; i < datas.length; i++) {
                        index = i+1
                        if (datas[i].nomor == 1 && datas[i].jeniskemasanfk == 1){
                            $scope.entryanmfla[index] = true
                            $scope.entryan[index] = true
                            $scope.entryansediaan[index] = true
                        }
                        else if (datas[i].nomor == 1 && datas[i].jeniskemasanfk == 2) {
                            $scope.entryan[index] = true
                            $scope.entryansediaan[index] = true
                        }
                        var data = {
                            index: index,
                            norec: '',
                            rke: datas[i].rke ? datas[i].rke : null,
                            dosis: datas[i].dosis + " " + datas[i].satuandosis,
                            produk: datas[i].namaproduk,
                            aturanpakai: datas[i].aturanpakai,
                            ispagi: datas[i].ispagi == true ? true : null,
                            issiang: datas[i].issiang == true ? true : null,
                            issore: datas[i].issore == true ? true : null,
                            ismalam: datas[i].ismalam == true ? true : null,
                            jumlah: datas[i].jumlah ? datas[i].jumlah : null,
                            jumlahobat: datas[i].jumlahobat ? datas[i].jumlahobat : null,
                            entry: null,
                            iter1: datas[i].iterobat1 == true ? true : null,
                            iter2: datas[i].iterobat2 == true ? true : null,
                            iter3: datas[i].iterobat3 == true ? true : null,
                            mfla: null,
                            sediaan: datas[i].jenisracikan
                        }
                        $scope.listItemREV.push(data)
                        rke = datas[i].rke

                    }


                })
            }
            

        }
        
        $scope.addNewItem = function () {
            let pegawai = JSON.parse(localStorage.getItem("pegawai"));
            if (
                $scope.listPegawai == undefined
                // ||
                // $scope.listPegawai._data.length == 0
            ) {
                $scope.listPegawai = [{
                    value: pegawai.id,
                    text: pegawai.namaLengkap,
                }];
            }
            $scope.entryan[$scope.listItemREV.length + 1] = true
            $scope.listItemREV.push({
                index: $scope.listItemREV.length + 1,
                norec: null,
                rke: null,
                dosis: null,
                produk: null,
                aturanpakai: null,
                ispagi: null,
                issiang: null,
                issore: null,
                ismalam: null,
                qtyproduk: null,
                entry: null,
                iter1: null,
                iter2: null,
                iter3: null,
                mfla: null,
                sediaan: null,
            });
            // $scope.listItemREV[ $scope.listItemREV.length + 1].tenagamedis = { value: pegawai.id, text: pegawai.namaLengkap }
            // $scope.listItemREV[ $scope.listItemREV.length + 1].tgljam = $scope.now
        };
        $scope.removeItem = function (index) {
            $scope.listItemREV.splice(index, 1);
        };
        $scope.simpan = function(){
            console.log($scope.listItemREV);
            $scope.copyresep = {
                norec: norec_resep,
                noresep: $scope.item.noresep,
                namapasien: $scope.item.namapasien,
                dokter: $scope.item.namadokter,
                tanggal: $scope.item.tglresep,
                strukorderfk: $state.params.norec_order,
                iter1: $scope.item.iterasi1 != null ? true : null,
                iter2: $scope.item.iterasi2 != null ? true : null,
                iter3: $scope.item.iterasi3 != null ? true : null,
                tglcopy: moment($scope.now).format('YYYY-MM-DD'),
                objectpegawaifk: pegawai.id,
                norec_order: $state.params.norec_order
            }
            var objSave = {
                copyresep: $scope.copyresep,
                copyresepd: $scope.listItemREV
            }
            medifirstService.post('farmasi/save-copy-resep', objSave).then(function(){
                loadData()
            })
        }
        $scope.cetakcopyresep = function(){
            window.open(configuration.baseApiBackend+ 'farmasi/cetak-copyresep?norec_order='+ $state.params.norec_order,'_BLANK')
        }
    }
    
])
})