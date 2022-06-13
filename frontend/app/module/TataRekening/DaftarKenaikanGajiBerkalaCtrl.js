define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DaftarKenaikanGajiBerkalaCtrl', ['MedifirstService', 'CacheHelper', '$scope', 'DateHelper', '$state', 'ModelItem',
        function (medifirstService, cacheHelper, $scope, DateHelper, $state, ModelItem) {
            //Inisial Variable 
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};
            $scope.itemD = {};
            $scope.item.listKasirMulti = [];
            $scope.item.listKasirMultis = [];
            $scope.isRouteLoading = false;

            $scope.tglMeninggal = '';
            $scope.Page = {
                refresh: true,
                pageSizes: true,
                buttonCount: 5
            }
            var koneng = [];
            loadCombo()
            var datagaji = []
            function loadCombo() {
                $scope.isRouteLoading = true
                $scope.getIsiComboRuangan = function () {
                    $scope.listRuangans = $scope.item.departemen.ruangan
                }
                
                medifirstService.get("sdm/daftar-kenaikan-gaji-berkala").then(function (data) {
                    $scope.isRouteLoading = false
                    // $scope.listKelompokPasien = data.data.kelompokpasien;
                    var datas = data.data.detail
                    for (let i = 0; i < datas.length; i++) {
                        datas[i].no = i + 1;
                        // console.log('bisa');
                        // var umur = DateHelper.CountAge(new Date(data.data.data[i].tgltmt), new Date($scope.now));
                        // var nominal = umur.year

                        // medifirstService.get('nominal/get-nominal?golongan=' + datas[i].idg + '&mkg=' + nominal).then(function (data) {
                        //     datas[i].gj = data.data.gajigolongan[0].gajipokok
                        //     console.log(datas[i].gj);
                        // })
                        
                    }
                    $scope.dataSourceGrid = new kendo.data.DataSource({
                        data: datas,
                        pageSize: 50,
                        total: datas.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {}
                            }
                        }
                    });
                    
                });
                // medifirstService.get("registrasi/laporan/get-combo-box-laporan-pengunjung")
                //     .then(function (data) {
                //         $scope.listRuangans = data.data.ruangan
                //         $scope.listDokter = data.data.dokter
                //     })
                // 
                medifirstService.get("sysadmin/general/get-combo-address")
                    .then(function (data) {
                        $scope.listKotaKabupaten = data.data.kotakabupaten
                    })
            }
            var onDataBound = function (e) {
                
                var kendoGrid = $("#kGrid").data("kendoGrid"); // get the grid widget
                var rows = e.sender.element.find("tbody tr"); // get all rows
                var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
                var dateNow = new Date();
                // iterate over the rows and if the undelying dataitem's Status field is PPT add class to the cell
                for (var i = 0; i < rows.length; i++) {
                    
                    var row = rows[i];
                    var tgltmt = kendoGrid.dataItem(row).tgltmt;
                    var umur = DateHelper.CountAge(new Date(tgltmt), new Date($scope.now));
                    var thn = umur.year,
                        bln = umur.month
                    var blnskrg = moment($scope.now).format("M");
                    var blntmt = moment(tgltmt).format("M");
                    var kuning = (thn * 12) + bln
                    // console.log(koneng);
                    // var berakhirstr = kendoGrid.dataItem(row).berakhirstr;
                    if (tgltmt != null) {
                        // console.log(tgltmt);
                        if (kuning >= 21) {
                            
                            if (blntmt < blnskrg+1) {
                                $(row.cells[0]).addClass("red");
                                $(row.cells[1]).addClass("red");
                                $(row.cells[2]).addClass("red");
                                $(row.cells[3]).addClass("red");
                                $(row.cells[4]).addClass("red");
                                $(row.cells[5]).addClass("red");
                                $(row.cells[6]).addClass("red");
                                $(row.cells[7]).addClass("red");
                            }else{
                                $(row.cells[0]).addClass("koneng");
                                $(row.cells[1]).addClass("koneng");
                                $(row.cells[2]).addClass("koneng");
                                $(row.cells[3]).addClass("koneng");
                                $(row.cells[4]).addClass("koneng");
                                $(row.cells[5]).addClass("koneng");
                                $(row.cells[6]).addClass("koneng");
                                $(row.cells[7]).addClass("koneng");
                            }
                        } 
                    }
                }
            }
            $scope.SearchData = function(){
                loadCombo()
            }
            $scope.columnGrid = {
                dataBound: onDataBound,
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "Laporan Pengunjung Pemeriksaan.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;

                    sheet.mergedCells = ["A1:I1"];

                    var myHeaders = [{
                        value: "Laporan Rekap Data Kunjungan Rawat Jalan",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];
                    sheet.rows.splice(0, 0, {
                        cells: myHeaders,
                        type: "header",
                        height: 70
                    });
                },
                selectable: "row",
                pageable: true,
                columns: [{
                        "field": "no",
                        "title": "NO",
                        "width": "30px",
                    },
                    {
                        "field": "namalengkap",
                        "title": "Nama",
                        "width": "100px",
                    },
                    {
                        "field": "nippns",
                        "title": "NIP",
                        "width": "50px",
                    },
                    {
                        "field": "tgltmt",
                        "title": "Tanggal TMT",
                        "width": "50px",
                        template: "<span class='style-left'>{{formatTanggal('#: tgltmt #')}}</span>"
                    },
                    {
                        "field": "pangkat",
                        "title": "Pangkat",
                        "width": "100px",
                    },
                    {
                        "field": "golongan",
                        "title": "Golongan",
                        "width": "70px",
                    },
                    {
                        "field": "gajiakhir",
                        "title": "Gaji Pokok Terakhir",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: gajiakhir #', '')}}</span>"

                    },
                    {
                        "field": "gajibaru",
                        "title": "Gaji Pokok Berikutnya",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: gajibaru #', '')}}</span>"

                    }
                ]
            }
            $scope.formatRupiah = function (value, currency) {
                return currency + "Rp. " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }
            $scope.klikGrid = function (dataPasienSelected) {
                if (dataPasienSelected != undefined) {
                    $scope.nocm = dataPasienSelected.nocm;
                    $scope.idPasien = dataPasienSelected.nocmfk;
                    $scope.tglMeninggal = dataPasienSelected.tglmeninggal;
                    $scope.dataPasienSelected = dataPasienSelected;
                }
            }

            var HttpClient = function () {
                this.get = function (aUrl, aCallback) {
                    var anHttpRequest = new XMLHttpRequest();
                    anHttpRequest.onreadystatechange = function () {
                        if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                            aCallback(anHttpRequest.responseText);
                    }

                    anHttpRequest.open("GET", aUrl, true);
                    anHttpRequest.send(null);
                }
            }

            $scope.klikdua = function (dataPasienSelected) {
                if (dataPasienSelected.foto != null) {
                    $scope.item.image = dataPasienSelected.foto
                    $scope.popUpPhoto.center().open()

                }

            }

            $scope.tutupPhoto = function () {
                $scope.item.image = "../app/images/avatar.jpg"
                $scope.popUpPhoto.close()
            }

            $scope.formatJam = function (tanggal) {
                if (tanggal == 'null')
                    return ''
                else
                    return moment(tanggal).format('HH:mm');
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            $scope.$on("kendoWidgetCreated", function (event, widget) {
                if (widget === $scope.grid) {
                    $scope.grid.element.on('dblclick', function (e) {
                        if ($scope.nocm != undefined) {
                            $state.go("UmVnaXN0cmFzaVJ1YW5nYW4=", {
                                noCm: $scope.nocm
                            })
                            var cacheSet = undefined;
                            cacheHelper.set('CacheRegistrasiPasien', cacheSet);

                        }
                    })

                }

            })

            $scope.RegistrasiPasien = function () {
                if ($scope.nocm == undefined) {
                    toastr.warning('Pilih data dulu!')
                    return
                }

                if ($scope.tglMeninggal != undefined) {
                    toastr.warning('Pasien Sudah Meninggal Tidak Bisa Didaftarkan, Peringatan !')
                    return
                }


                if (!$scope.isPenunjang) {
                    cacheHelper.set('isPenunjang', undefined);
                    $state.go("UmVnaXN0cmFzaVJ1YW5nYW4=", {
                        noCm: $scope.nocm
                    })
                    var cacheSet = undefined;
                    cacheHelper.set('CacheRegistrasiPasien', cacheSet);
                    var cacheSetss = undefined;
                    cacheHelper.set('CacheRegisOnline', cacheSetss);

                } else {
                    cacheHelper.set('isPenunjang', true);
                    $state.go("UmVnaXN0cmFzaVJ1YW5nYW4=", {
                        noCm: $scope.nocm
                    })
                    var cacheSet = undefined;
                    cacheHelper.set('CacheRegistrasiPasien', cacheSet);
                    var cacheSetss = undefined;
                    cacheHelper.set('CacheRegisOnline', cacheSetss);
                }
            }

            $scope.EditPasien = function () {
                if ($scope.nocm != undefined) {

                    cacheHelper.set('CacheRegisBayi', undefined);
                    $state.go('RegistrasiPasienBaru', {
                        noRec: 0,
                        idPasien: $scope.idPasien
                    })


                } else {
                    messageContainer.error("Pilih data dulu!")
                }
            }

            $scope.HapusPasien = function () {
                if ($scope.idPasien != undefined) {
                    var item = {
                        idpasien: $scope.idPasien
                    }

                    medifirstService.post('registrasi/update-false-pasien', item).then(function (e) {
                        loadData();
                    })

                } else {
                    messageContainer.error("Pilih data dulu!")
                }
            }

            $scope.pasienBaru = function () {
                // body...
                $state.go("RegistrasiPasienBaru", {
                    noRec: 0,
                    idPasien: 0
                })
            }


            $scope.columnRiwayatRegistrasi = {
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "DaftarRiwayatRegistrasi.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:K1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Daftar Registrasi Pasien",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, {
                        cells: myHeaders,
                        type: "header",
                        height: 70
                    });
                },
                selectable: 'row',
                pageable: true,
                columns: [{
                        "field": "no",
                        "title": "No",
                        "width": "30px",
                    },
                    {
                        "field": "tglregistrasi",
                        "title": "Tgl Registrasi",
                        "width": "80px",
                        "template": "<span class='style-left'>{{formatTanggal('#: tglregistrasi #')}}</span>"
                    },
                    {
                        "field": "noregistrasi",
                        "title": "No Registrasi",
                        "width": "90px"
                    },
                    {
                        "field": "namaruangan",
                        "title": "Ruanganan Layanan",
                        "width": "150px",
                        "template": "<span class='style-left'>#: namaruangan #</span>"
                    },
                    {
                        "field": "namadokter",
                        "title": "Nama Dokter",
                        "width": "150px",
                        "template": "<span class='style-left'>#: namadokter #</span>"
                    },
                    {
                        "field": "tglpulang",
                        "title": "Tgl Pulang",
                        "width": "80px",
                        "template": "<span class='style-left'>{{formatTanggal('#: tglpulang #')}}</span>"
                    },
                    {
                        "field": "lamarawat",
                        "title": "Lama Dirawat",
                        "width": "80px"
                        // "template": "<span class='style-left'>{{formatTanggal('#: tglpulang #')}}</span>"
                    }
                ]
            };

            $scope.RiwayatRegistrasi = function () {
                if ($scope.dataPasienSelected == undefined) {
                    messageContainer.error("Pilih data dulu!")
                }
                $scope.itemD.noRM = $scope.dataPasienSelected.nocm;
                $scope.itemD.namaPasien = $scope.dataPasienSelected.namapasien;
                $scope.itemD.tglLahir = moment($scope.dataPasienSelected.tgllahir).format('DD-MM-YYYY');
                loadDataRiwayat();
                $scope.popUpRiwayatRegistrasi.center().open();
                var actions = $scope.popUpRiwayatRegistrasi.options.actions;
                actions.splice(actions.indexOf("Close"), 1);
                $scope.popUpRiwayatRegistrasi.setOptions({
                    actions: actions
                });
            }

            $scope.TutupPopUp = function () {
                $scope.itemD.noRM = undefined;
                $scope.itemD.namaPasien = undefined;
                $scope.itemD.tglLahir = undefined;
                $scope.itemD.noRegistrasi = undefined;
                $scope.itemD.JumlahRawat = undefined;
                $scope.dataRiwayatRegistrasi = new kendo.data.DataSource({
                    data: []
                });
                $scope.popUpRiwayatRegistrasi.close();
            }

            function loadDataRiwayat() {
                $scope.isRouteLoading = true;
                var rm = ""
                if ($scope.itemD.noRM != undefined) {
                    rm = "&norm=" + $scope.itemD.noRM
                }

                var pasien = ""
                if ($scope.itemD.namaPasien != undefined) {
                    pasien = "&namaPasien=" + $scope.itemD.namaPasien
                }

                var tglLahirs = ""
                if ($scope.itemD.tglLahir != undefined) {
                    tglLahirs = "tglLahir=" + moment($scope.itemD.tglLahir).format('YYYY-MM-DD HH:mm:ss');
                }

                var noReg = ""
                if ($scope.itemD.noRegistrasi != undefined) {
                    noReg = "&noReg=" + $scope.itemD.noRegistrasi;
                }

                medifirstService.get("registrasi/daftar-riwayat-registrasi?" +
                        tglLahirs + rm + noReg + pasien)
                    .then(function (data) {
                        $scope.isRouteLoading = false;
                        var jumlahRawat = 0;
                        var dRiwayatReg = data.data.daftar;
                        for (var i = 0; i < dRiwayatReg.length; i++) {
                            dRiwayatReg[i].no = i + 1
                            if (dRiwayatReg[i].statusinap == 1) {
                                jumlahRawat = jumlahRawat + 1;
                                if (dRiwayatReg[i].tglpulang != undefined) {
                                    var umur = DateHelper.CountAge(new Date(dRiwayatReg[i].tglregistrasi), new Date(dRiwayatReg[i].tglpulang));
                                    var bln = umur.month,
                                        thn = umur.year,
                                        day = umur.day
                                    dRiwayatReg[i].lamarawat = day + " Hari";
                                } else {
                                    var umur = DateHelper.CountAge(new Date(dRiwayatReg[i].tglregistrasi), new Date($scope.now));
                                    var bln = umur.month,
                                        thn = umur.year,
                                        day = umur.day
                                    dRiwayatReg[i].lamarawat = day + " Hari";
                                }
                            }
                        }
                        $scope.itemD.JumlahRawat = jumlahRawat;
                        $scope.dataRiwayatRegistrasi = new kendo.data.DataSource({
                            data: dRiwayatReg,
                            pageSize: 10,
                            total: dRiwayatReg.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {}
                                }
                            }
                        });
                    });
            }

            $scope.SearchEnterDetail = function () {
                loadDataRiwayat();
            }

            function saveBase64AsFile(base64, fileName) {

                var link = document.createElement("a");

                link.setAttribute("href", base64);
                link.setAttribute("download", fileName);
                link.click();
            }
            $scope.saveImage = function () {
                saveBase64AsFile($scope.item.image, 'asa.jpg')
                // var img = document.getElementById('embedImage');
                // img.src = $scope.item.image
                // window.location.href = img.src.replace('image/png', 'image/octet-stream');
            }
            window.addEventListener('DOMContentLoaded', () => {

                var img = document.getElementById('embedImage');
                img.src = $scope.item.image

                img.addEventListener('load', () => button.removeAttribute('disabled'));

                const button = document.getElementById('saveImage');
                button.addEventListener('click', () => {
                    window.location.href = img.src.replace('image/jpg', 'image/octet-stream');
                });
            });

            $scope.CetakView = function () {
                var user = medifirstService.getPegawaiLogin();
                var tglAwal = moment($scope.item.periodeAwal).format('DD-MMM-YYYY HH:mm');
                var tglAkhir = moment($scope.item.periodeAkhir).format('DD-MMM-YYYY HH:mm');

                var ruanganId = ""
                if ($scope.item.ruangan != undefined) {
                    ruanganId = $scope.item.ruangan.id
                }

                var dokter = ""
                if ($scope.item.dokter != undefined) {
                    dokter = $scope.item.dokter.id
                }

                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/laporanPelayanan?cetak-laporan-kunjungan=' + user.namaLengkap + '&tglAwal=' + tglAwal + '&tglAkhir=' + tglAkhir +
                    '&dokter=' + dokter + '&ruanganId=' + ruanganId + '&view=true',
                    function (response) {});
            }

            //** BATAS */
        }
    ]);
});