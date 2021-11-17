define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict';
    initialize.controller('MenuPRBCtrl', ['$rootScope', '$scope', '$state', 'ModelItem', 'DateHelper', 'MedifirstService',
        function ($rootScope, $scope, $state, ModelItem, DateHelper, medifirstService) {
            $scope.now = new Date();
            $scope.nav = function (state) {
                // debugger;
                $scope.currentState = state;
                $state.go(state, $state.params);
                console.log($scope.currentState);
            }
            var ppkRumahSakit = ""
            var namappkRumahSakit = ""
            var dataobatgen = []

            $scope.isInsert = true;
            $scope.isPencarian = true;
            $scope.isRouteLoading = false;
            $scope.isShowPembuatanPRB = true;
            $scope.showPembuatanPRB = function () {
                $scope.isShowPembuatanPRB = !$scope.isShowPembuatanPRB;
            }

            $scope.search = {};
            $scope.item = {};
            $scope.obat = {};
            $scope.delete = {};
            $scope.jenisPencarian = [{
                "id": 1, "nama": "Nomor SRB"
            }, {
                "id": 2, "nama": "Tanggal SRB"
            }];
            $scope.listPost = [{
                "id": 1, "name": "INSERT"
            }, {
                "id": 2, "name": "UPDATE"
            }];
            $scope.search.prb = 1;
            $scope.item.tipe = 1;
            $scope.chageSearch = function(){
                $scope.isPencarian = !$scope.isPencarian;
            }
            $scope.changeMetode = function (id) {
                $scope.isInsert = !$scope.isInsert;
                $scope.item = {};
                $scope.item.tipe = id;
            }

            medifirstService.get('sysadmin/settingdatafixed/get/kodePPKRujukan').then(function (dat) {
                ppkRumahSakit = dat.data
            })
            medifirstService.get('sysadmin/settingdatafixed/get/namaPPKRujukan').then(function (dat) {
                namappkRumahSakit = dat.data
            })
            function getDPJP(kdSpesialis, jenisPel, tipe) {
                let now = moment(new Date()).format('YYYY-MM-DD')
                let json = {
                    "url": "referensi/dokter/pelayanan/" + jenisPel + "/tglPelayanan/" + now + "/Spesialis/" + kdSpesialis,
                    "method": "GET",
                    "data": null
                }
                medifirstService.postNonMessage("bridging/bpjs/tools", json).then(function (e) {
                    if (e.data.metaData.code == 200) {
                        $scope.listDPJP = e.data.response.list;

                    }
                    else toastr.info('Dokter DPJP tidak ada', 'Info')
                })
            }
            getDPJP('IGD', 1, '1')

            function getProgramPRB() {
                let json = {
                    "url": "/referensi/diagnosaprb",
                    "method": "GET",
                    "data": null
                }
                medifirstService.postNonMessage("bridging/bpjs/tools", json).then(function (e) {
                    if (e.data.metaData.code == 200) {
                        for (let x = 0; x < e.data.response.list.length; x++) {
                            const element = e.data.response.list[x];
                            element.kode = element.kode.trim()
                        }
                        $scope.listProgramPRB = e.data.response.list;

                    }
                    else toastr.info('Diagnosa program PRB tidak ada', 'Info')
                })
            }
            getProgramPRB()
            
            $scope.comboBoxOptions = {
                placeholder:"ketik nama obat generik",
                dataTextField:"nama",
                autoBind: "false",
                minLength:1,
                dataValuetField:"id",
                filter: "contains",
                filtering:function(e){
                    getObat($scope.combobox.text());            
                }
              }

            function getObat(nama) {
                let json = {
                    "url": "/referensi/obatprb/" + nama,
                    "method": "GET",
                    "data": null
                }
                medifirstService.postNonMessage("bridging/bpjs/tools", json).then(function (e) {
                    if (e.data.metaData.code == 200) {
                        var data = e.data.response.list
                        for (let i = 0; i < data.length; i++) {
                            const element = data[i];
                            data[i].nama = data[i].kode + " - " + data[i].nama
                        }
                        $scope.listObat = data;

                    }
                    else toastr.info('Data obat generik PRB tidak ada', 'Info')
                })
            }

            $scope.findDataPRB = function() {
                $scope.isRouteLoading = true;
                var data;
                if ($scope.search.prb == 1) {
                    if($scope.search.nosrb == undefined) {
                        toastr.error('Nomor Surat Rujukan Balik harap diisi !');
                        return
                    }
                    const nosrb = $scope.search.nosrb
                    const nosep = $scope.search.nosep
                    data = {
                        "url": `prb/${nosrb}/nosep/${nosep}`,
                        "method": "GET",
                        "data": null
                    }
                } else {
                    if($scope.search.tglawal == undefined) {
                        toastr.error('Tanggal mulai harap diisi !');
                        return
                    }
                    if($scope.search.tglakhir == undefined) {
                        toastr.error('Tanggal Akhir harap diisi !');
                        return
                    }
                    const tglawal = new moment($scope.search.tglawal).format('YYYY-MM-DD')
                    const tglakhir = new moment($scope.search.tglakhir).format('YYYY-MM-DD')
                    data = {
                        "url": `prb/tglMulai/${tglawal}/tglAkhir/${tglakhir}`,
                        "method": "GET",
                        "data": null
                    }
                }
                
                medifirstService.postNonMessage("bridging/bpjs/tools", data).then(function (e) {
                    document.getElementById("jsonCekSRB").innerHTML = JSON.stringify(e.data, undefined, 4);
                    $scope.isRouteLoading = false;
                })
            }
            $scope.checkKepesertaanByNoSrb = function(nosrb, nosep) {
                if (!$scope.item.cekNomorSrb) return;
                if ($scope.item.noSrb === '' || $scope.item.noSrb === undefined) return;
                if ($scope.item.noSep === '' || $scope.item.noSep === undefined) return;
                $scope.isRouteLoading = true;
                var data = {
                    "url": `prb/${nosrb}/nosep/${nosep}`,
                    "method": "GET",
                    "data": null
                }
                medifirstService.postNonMessage("bridging/bpjs/tools", data).then(function (e) {
                    $scope.isRouteLoading = false;
                    if (e.data.metaData.code == 200) {
                        var data = e.data.response.prb;

                        $scope.listDPJP = data.DPJP;
                        $scope.item.alamat = data.peserta.alamat
                        $scope.item.email = data.peserta.email
                        $scope.item.kodeDPJP = { kode: data.DPJP.kode, nama: data.DPJP.nama }
                        $scope.item.keterangan = data.keterangan
                        $scope.item.saran = data.saran
                        dataobatgen = data.obat.obat
                        $scope.listGridObat = new kendo.data.DataSource({
                            data: data.obat.obat
                        });

                    }
                    else toastr.info('Data PRB tidak ada', 'Info')
                })
            }

            $scope.clear = function () {
                $scope.search = {};
            }
            $scope.addObat = function () {
                $scope.obat = {};
                $scope.listObat = null;
                $scope.popUpObat.center().open();
            }

            $scope.gridObat = [
                {
                    "field": "kdObat",
                    "title": "Kode Obat",
                },
                {
                    "field": "signa1",
                    "title": "Signa 1",
                },
                {
                    "field": "signa2",
                    "title": "Signa 2",
                },
                {
                    "field": "jmlObat",
                    "title": "Jumlah Obat",
                },
                {
                    command: {
                        text: "Hapus",
                        align: "center",
                        attributes: { align: "center" },
                        click: removeData
                    },
                    title: "#",
                }
            ];
            function removeData(e) {
                e.preventDefault();
                var grid = this;
                var row = $(e.currentTarget).closest("tr");
                var tr = $(e.target).closest("tr");
                var dataItem = this.dataItem(tr);
                grid.removeRow(row);

                if (dataItem != undefined) {
                    for (var i = dataobatgen.length - 1; i >= 0; i--) {
                        if (dataobatgen[i].kdObat == dataItem.kdObat) {
                            dataobatgen.splice(i, 1);
                            $scope.listGridObat = new kendo.data.DataSource({
                                data: dataobatgen
                            });
                        }
                    }
                }
            }

            $scope.tutupObat = function () {
                $scope.obat = {};
                $scope.listObat = null;
                $scope.popUpObat.close();
            }

            $scope.saveObat = function () {
                if($scope.obat.obat == undefined){
                    messageContainer.error("Obat Harus Di isi")
                    return
                }
                if($scope.obat.signa1 == undefined){
                    messageContainer.error("Signa 1 Harus Di isi")
                    return
                }
                if($scope.obat.signa2 == undefined){
                    messageContainer.error("Signa 2 Harus Di isi")
                    return
                }
                if($scope.obat.jmlobat == undefined){
                    messageContainer.error("Jumlah Obat Harus Di isi")
                    return
                }

                var dataObat = {};
                dataObat = {
                    kdObat: $scope.obat.obat.kode,
                    signa1: $scope.obat.signa1,
                    signa2: $scope.obat.signa2,
                    jmlObat: $scope.obat.jmlobat
                }
                dataobatgen.push(dataObat)
                $scope.listGridObat = new kendo.data.DataSource({
                    data: dataobatgen
                });

                $scope.obat = {};
                $scope.listObat = null;
            }

            $scope.Save = function () {
                if (!$scope.item.tipe) {
                    messageContainer.error('Pilih Tipe Post');
                    return;
                } else {
                    if ($scope.item.tipe === 1) {
                        $scope.status = 'Insert';
                        $scope.SaveData();
                    } else {
                        $scope.status = 'Update';
                        $scope.SaveData();
                    }
                }
            }

            $scope.SaveData = function () {
                var url = "";
                var method = "";
                var dataSend = {};
                if($scope.item.noSep == undefined){
                    messageContainer.error("No SEP Harus Di isi")
                    return
                }

                if($scope.item.alamat == undefined){
                    messageContainer.error("Alamat Harus Di isi")
                    return
                }
                if($scope.item.email == undefined){
                    messageContainer.error("Email Harus Di isi")
                    return
                }
                if($scope.item.kodeDPJP == undefined){
                    messageContainer.error("DPJP Harus Di isi")
                    return
                }
                if($scope.item.keterangan == undefined){
                    messageContainer.error("Keterangan Harus Di isi")
                    return
                }
                if($scope.item.saran == undefined){
                    messageContainer.error("Saran Harus Di isi")
                    return
                }
                
                if ($scope.listGridObat == undefined){
                    messageContainer.error("Obat Harus Di isi")
                    return
                }

                if($scope.status == 'Insert') 
                {
                    if($scope.item.noKartu == undefined){
                        messageContainer.error("No Kartu Harus Di isi")
                        return
                    }
                    if($scope.item.programprb == undefined){
                        messageContainer.error("Program PRB Harus Di isi")
                        return
                    }

                    url = "PRB/insert";
                    method = "POST";
                    dataSend = {
                        "noSep": $scope.item.noSep,
                        "noKartu": $scope.item.noKartu,
                        "alamat": $scope.item.alamat,
                        "email": $scope.item.email,
                        "programPRB": $scope.item.programprb.kode,
                        "kodeDPJP": $scope.item.kodeDPJP.kode,
                        "keterangan": $scope.item.keterangan,
                        "saran": $scope.item.saran,
                        "user": medifirstService.getPegawaiLogin().id,
                        "obat": dataobatgen
                    }
                }

                if($scope.status == 'Update') 
                {
                    if($scope.item.noSrb == undefined){
                        messageContainer.error("No SRB Harus Di isi")
                        return
                    }
                    url = "PRB/Update";
                    method = "PUT";
                    dataSend = {
                        "noSrb": $scope.item.noSrb,
                        "noSep": $scope.item.noSep,
                        "alamat": $scope.item.alamat,
                        "email": $scope.item.email,
                        "kodeDPJP": $scope.item.kodeDPJP.kode,
                        "keterangan": $scope.item.keterangan,
                        "saran": $scope.item.saran,
                        "user": medifirstService.getPegawaiLogin().id,
                        "obat": dataobatgen
                    }
                }

                var data = {
                    "url": url,
                    "method": method,
                    "data": {
                        "request": {
                            "t_prb": dataSend
                        }
                    }
                }
                $scope.isRouteLoading = true;
                medifirstService.postNonMessage("bridging/bpjs/tools", data).then(function (e) {
                    document.getElementById("jsonCreatePRB").innerHTML = JSON.stringify(e.data, undefined, 4);
                    $scope.isRouteLoading = false;
                    if(e.data.metaData.code == "200"){
                        $scope.ClearForm();
                    }
                
                    $scope.item.tipe = 1;
                    $scope.isPencarian = true;
                })
               
            }

            $scope.ClearForm = function() {
                $scope.item = {};
                dataobatgen = []
                $scope.listGridObat = new kendo.data.DataSource({
                    data: dataobatgen
                });
            }

            $scope.deleteDataPRB = function () {
                if($scope.delete.nosrb == undefined){
                    messageContainer.error("No SRB Harus Di isi")
                    return
                }
                if($scope.delete.nosep == undefined){
                    messageContainer.error("No SEP Harus Di isi")
                    return
                }
                var data = {
                    "url": "PRB/Delete",
                    "method": "DELETE",
                    "data": {
                        "request": {
                            "t_prb": {
                                "noSrb": $scope.delete.nosrb,
                                "noSep": $scope.delete.nosep,
                                "user": medifirstService.getPegawaiLogin().id
                            }
                        }
                    }
                }
                $scope.isRouteLoading = true;
                medifirstService.postNonMessage("bridging/bpjs/tools", data).then(function (e) {
                    document.getElementById("jsonDeleteSRB").innerHTML = JSON.stringify(e.data, undefined, 4);
                    $scope.isRouteLoading = false;
                    $scope.clearDelete();
                })
            }

            $scope.clearDelete = function () {
                $scope.delete = {}
            }
        }
    ]);
});