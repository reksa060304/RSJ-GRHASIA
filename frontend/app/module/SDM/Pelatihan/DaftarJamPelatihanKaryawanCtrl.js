define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DaftarJamPelatihanKaryawanCtrl', ['CacheHelper', '$scope', 'MedifirstService', 'DateHelper',
        function (cacheHelper, $scope, medifirstService, DateHelper) {
            //Inisial Variable             
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};
            $scope.isRouteLoading = false;
            $scope.listDokterMulti = [];
            FormLoad();
            LoadData();
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

            $scope.Liststatus = [
                {
                    id: 1,
                    nama: "Lebih dari 20 Jam"
                },
                {
                    id: 0,
                    nama: "Kurang dari 20 Jam"
                }
            ]
            function FormLoad() {
                $scope.tglPelayanan = $scope.item.pelayanan;
                $scope.dokter = $scope.item.namaPegawai;
                $scope.date = new Date();
                $scope.item.tglAwal = new moment($scope.now).format('YYYY-MM-DD 00:00');
                $scope.item.tglAkhir = new moment($scope.now).format('YYYY-MM-DD 23:59');
                $scope.pegawai = medifirstService.getPegawai();
                medifirstService.get("sdm/get-data-combo-sdm?", true).then(function (dat) {
                    var dataCombo = dat.data
                    // var dataLogin = dat.datalogin[0];
                    $scope.listStatus = dataCombo.statuspegawai;
                    $scope.listJenisPegawai = dataCombo.jenispegawai;
                    $scope.listKategory = dataCombo.kategorypegawai;
                    $scope.listJenisPetPelaksana = dataCombo.jenispetugaspe;
                });
                medifirstService.getPart("sysadmin/general/get-combo-pegawai", true, true, 20).then(function (data) {
                    $scope.listDokters = data;
                    $scope.selectOptionsDokter = {
                        placeholder: "Pilih Petugas Pelaksana",
                        dataTextField: "namalengkap",
                        dataValueField: "id",
                        // dataSource:{
                        //     data: $scope.listRuangan
                        // },
                        autoBind: false,
                    };
                });
            }

            $scope.getIsiComboRuangan = function () {
                $scope.listRuangan = $scope.item.departement.ruangan
            }

            $scope.Search = function () {
                $scope.isLoadingData = true;
                LoadData();
            }

            function LoadData() {
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm');

                var jenisPetugasPe = "";
                if ($scope.item.JenisPetPelaksana != undefined) {
                    jenisPetugasPe = "jenisPetugasPe=" + $scope.item.JenisPetPelaksana.id;
                }

                var listDokterPemeriksa = ""
                if ($scope.listDokterMulti.length != 0) {
                    var a = ""
                    var b = ""
                    for (var i = $scope.listDokterMulti.length - 1; i >= 0; i--) {

                        var c = $scope.listDokterMulti[i].id
                        b = "," + c
                        a = a + b
                    }
                    listDokterPemeriksa = a.slice(1, a.length)
                }
                // variable buat count karywan
                $scope.januaric = 0;
                $scope.februaric = 0;
                $scope.maretc = 0;
                $scope.aprilc = 0;
                $scope.meic = 0;
                $scope.junic = 0;
                $scope.julic = 0;
                $scope.agustusc = 0;
                $scope.septemberc = 0;
                $scope.oktoberc = 0;
                $scope.novemberc = 0;
                $scope.desemberc = 0;

                // //variable buat sum durasi karyawan diklat
                $scope.januarid = 0;
                $scope.februarid = 0;
                $scope.maretd = 0;
                $scope.aprild = 0;
                $scope.meid = 0;
                $scope.junid = 0;
                $scope.julid = 0;
                $scope.agustusd = 0;
                $scope.septemberd = 0;
                $scope.oktoberd = 0;
                $scope.novemberd = 0;
                $scope.desemberd = 0;
                $scope.tahun = '';
                var tahun = 'tahun='+moment($scope.item.tahun).format('YYYY');

                var status = "";
                if ($scope.item.status != undefined) {
                    status = "&status=" + $scope.item.status.id;
                }
                    
                
                medifirstService.get("sdm/get-datajampelatihan-pegawai?"+ tahun+status).then(function (data) {
                    $scope.isRouteLoading = false;
                    var datas = data.data.data;
                    var datac = data.data.count;
                    var datad = data.data.sum;
                    console.log(datas);
                    for (let i = 0; i < datas.length; i++) {
                        const element = datas[i];
                        element.no = i + 1;
                        if (datas[i].januari > 0) {
                            element.jumlahjanuari = datas[i].januari;
                        }else{
                            element.jumlahjanuari = 0;
                        }

                        if (datas[i].februari > 0) {
                            element.jumlahfebruari = datas[i].februari;
                        } else {
                            element.jumlahfebruari = 0;
                        }

                        if (datas[i].maret > 0) {
                            element.jumlahmaret = datas[i].maret;
                        } else {
                            element.jumlahmaret = 0;
                        }

                        if (datas[i].april > 0) {
                            element.jumlahapril = datas[i].april;
                        } else {
                            element.jumlahapril = 0;
                        }

                        if (datas[i].mei > 0) {
                            element.jumlahmei = datas[i].mei;
                        } else {
                            element.jumlahmei = 0;
                        }
                        
                        if (datas[i].juni > 0) {
                            element.jumlahjuni = datas[i].juni;
                        } else {
                            element.jumlahjuni = 0;
                        }

                        if (datas[i].juli > 0) {
                            element.jumlahjuli = datas[i].juli;
                        } else {
                            element.jumlahjuli = 0;
                        }

                        if (datas[i].agustus > 0) {
                            element.jumlahagustus = datas[i].agustus;
                        } else {
                            element.jumlahagustus = 0;
                        }

                        if (datas[i].september > 0) {
                            element.jumlahseptember = datas[i].september;
                        } else {
                            element.jumlahseptember = 0;
                        }

                        if (datas[i].oktober > 0) {
                            element.jumlahoktober = datas[i].oktober;
                        } else {
                            element.jumlahoktober = 0;
                        }

                        if (datas[i].november > 0) {
                            element.jumlahnovember = datas[i].november;
                        } else {
                            element.jumlahnovember = 0;
                        }

                        if (datas[i].desember > 0) {
                            element.jumlahdesember = datas[i].desember;
                        } else {
                            element.jumlahdesember = 0;
                        }

                        if (datas[i].jumlah > 0) {
                            element.jumlahjumlah = datas[i].jumlah;
                        } else {
                            element.jumlahjumlah = 0;
                        }
                    }
                        //buat count karyawan perbulan
                        $scope.januaric =  datac[0].januaris;
                        $scope.februaric =datac[0].februaris;
                        $scope.maretc = datac[0].marets;
                        $scope.aprilc =datac[0].aprils;
                        $scope.meic = datac[0].meis;
                        $scope.junic =  datac[0].junis;
                        $scope.julic = datac[0].julis;
                        $scope.agustusc = datac[0].agustuss;
                        $scope.septemberc = datac[0].septembers;
                        $scope.oktoberc =  datac[0].oktobers;
                        $scope.novemberc =  datac[0].novembers;
                        $scope.desemberc =  datac[0].desembers;

                        //buat sum durasi karyawan perbulan
                        $scope.januarid =  datad[0].januari;
                        $scope.februarid = datad[0].februari;
                        $scope.maretd =  datad[0].maret;
                        $scope.aprild =  datad[0].april;
                        $scope.meid =  datad[0].mei;
                        $scope.junid =  datad[0].juni;
                        $scope.julid = datad[0].juli;
                        $scope.agustusd = datad[0].agustus;
                        $scope.septemberd =  datad[0].september;
                        $scope.oktoberd =  datad[0].oktober;
                        $scope.novemberd = datad[0].november;
                        $scope.desemberd = datad[0].desember;
                    $scope.dataGrid = new kendo.data.DataSource({
                        data: datas,
                        // group: $scope.group,
                        pageSize: 100,
                        total: datas.length,
                        serverPaging: false,
                        aggregate: [
                            {field: "januari",aggregate: "sum"},
                            {field: "februari",aggregate: "sum"},
                            {field: "maret",aggregate: "sum"},
                            {field: "april",aggregate: "sum"},
                            {field: "mei",aggregate: "sum"},
                            {field: "juni",aggregate: "sum"},
                            {field: "juli",aggregate: "sum"},
                            {field: "agustus",aggregate: "sum"},
                            {field: "september",aggregate: "sum"},
                            {field: "oktober",aggregate: "sum"},
                            {field: "november",aggregate: "sum"},
                            {field: "desember",aggregate: "sum"},
                            {field: "jumlah",aggregate: "sum"},
                            {field: "lebih20jam",aggregate: "sum"},
                            {field: "kurang20jam",aggregate: "sum"},
                        ],
                        schema: {
                            model: {}
                        }
                    });
                });
                $scope.columnGrid = {
                    toolbar: [
                        "excel",
                    ],
                    excel: {
                        fileName: "JamPelatihanKaryawan.xlsx",
                        allPages: true,
                    },
                    excelExport: function (e) {
                        var sheet = e.workbook.sheets[0];
                        sheet.frozenRows = 2;
                        sheet.mergedCells = ["A1:R1"];
                        sheet.name = "Orders";

                        var myHeaders = [{
                            value: "RATA - RATA JAM PELATIHAN KARYAWAN",
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
                        //if karyawan diklat dibulan itu
                        var jan = 0;
                        if ($scope.januaric != 0) {
                        jan = $scope.januaric * 20
                        }
                        var feb = 0;
                        if ($scope.februaric != 0) {
                        feb = $scope.februaric * 20
                        }
                        var mar = 0;
                        if ($scope.maretc != 0) {
                        mar = $scope.maretc * 20
                        }
                        var apr = 0;
                        if ($scope.aprilc != 0) {
                        apr = $scope.aprilc * 20
                        }
                        var may = 0;
                        if ($scope.meic != 0) {
                            may = $scope.meic * 20
                        }
                        var jun = 0;
                        if ($scope.junic != 0) {
                            jun = $scope.junic * 20
                        }
                        var jul = 0;
                        if ($scope.julic != 0) {
                            jul = $scope.julic * 20
                        }
                        var ags = 0;
                        if ($scope.agustusc != 0) {
                            ags = $scope.agustusc * 20
                        }
                        var sep = 0;
                        if ($scope.septemberc != 0) {
                            sep = $scope.septemberc * 20
                        }
                        var okt = 0;
                        if ($scope.oktoberc != 0) {
                            okt = $scope.oktoberc * 20
                        }
                        var nov = 0;
                        if ($scope.novemberc != 0) {
                            nov = $scope.novemberc * 20
                        }
                        var des = 0;
                        if ($scope.desemberc != 0) {
                            des = $scope.desemberc * 20
                        }

                        sheet.rows.splice(1000, 0, {
                            cells: [{value: "B"}, {
                                value: "Jumlah Karyawan x 20 jam"
                            }, {}, {
                                value: jan,
                            }, {
                                value: feb,
                            }, {
                                value: mar,
                            }, {
                                value: apr,
                            }, {
                                value: may,
                            }, {
                                value: jun,
                            }, {
                                value: jul,
                            }, {
                                value: ags,
                            }, {
                                value: sep,
                            }, {
                                value: okt,
                            }, {
                                value: nov,
                            }, {
                                value: des,
                            }
                        ],
                            type: "data",
                        });
                    //buat sum a/b * 20
                        var abjan = ($scope.januarid / $scope.januaric)
                        if (isNaN(abjan) == true) {
                            abjan = 0
                        }                        
                        var abfeb = ($scope.februarid / feb)
                        if (isNaN(abfeb) == true) {
                            abfeb = 0
                        }
                        console.log(abfeb);
                        var abmar = ($scope.maretd / mar)
                        if (isNaN(abmar) == true) {
                            abmar = 0
                        }
                        var abapr = ($scope.aprild / apr)
                        if (isNaN(abapr) == true) {
                            abapr = 0
                        }
                        var abmay = ($scope.meid / may)
                        console.log(abmay);
                        if (isNaN(abmay) == true) {
                            abmay = 0
                        }
                        var abjun = ($scope.junid / jun)
                        if (isNaN(abjun) == true) {
                            abjun = 0
                        }
                        var abjul = ($scope.julid / jul)
                        if (isNaN(abjul) == true) {
                            abjul = 0
                        }
                        var abags = ($scope.agustusd / ags)
                        if (isNaN(abags) == true) {
                            abags = 0
                        }

                        var absep = ($scope.septemberd / sep)
                        if (isNaN(absep) == true) {
                            absep = 0
                        }

                        var abokt = ($scope.oktoberd / okt)
                        if (isNaN(abokt) == true) {
                            abokt = 0
                        }
                        var abnov = ($scope.novemberd / nov)
                        if (isNaN(abnov) == true) {
                            abnov = 0
                        }
                        var abdes = ($scope.desemberd / des)
                        if (isNaN(abdes) == true) {
                            abdes = 0
                        }
                    //end

                        sheet.rows.splice(1001, 0, {
                            cells: [{}, {
                                value: "A/B x 100%"
                            }, {}, {
                                value: abjan,
                                // format: '#,0 \\\%'
                            }, {
                                value: abfeb
                            }, {
                                value: abmar,
                            }, {
                                value: abapr,
                            }, {
                                value: abmay,
                            }, {
                                value: abjun,
                            }, {
                                value: abjul,
                            }, {
                                value: abags,
                            }, {
                                value: absep,
                            }, {
                                value: abokt,
                            }, {
                                value: abnov,
                            }, {
                                value: abdes,
                            }],
                            type: "data",
                        });
                        var triwulan1 = abjan + abfeb + abmar
                        var triwulan2 = abapr + abmay + abjun
                        var triwulan3 = abjul + abags + absep
                        var triwulan4 = abokt + abnov + abdes

                        sheet.rows.splice(1002, 0, {
                            cells: [{}, {value:"Jumlah % Pertriwulan"}, {}, {
                                value: triwulan1,
                                colSpan: 3
                            }, {
                                value: triwulan2,
                                colSpan: 3
                            }, {
                                value: triwulan3,
                                colSpan: 3
                            }, {
                                value: triwulan4,
                                colSpan: 3
                            }],
                            type: "data",
                        });
                    },
                    selectable: 'row',
                    pageable: true,
                    columns: [{
                            "field": "no",
                            "title": "No",
                            "width": "45px",
                            "template": "<span class='style-left'>#: no #</span>",
                            "footerTemplate": "A"

                        },
                        {
                            "field": "namalengkap",
                            "title": "Nama Karyawan",
                            "width": "100px",
                            "footerTemplate": "Jumlah Jam Pelatihan"
                        },
                        {
                            "field": "nippns",
                            "title": "NIP PNS/PTT/BLUD/OS",
                            "width": "100px",
                        },
                        {
                            // "field": "nocm",
                            "title": "JAM PELATIHAN KARYAWAN",
                            "width": "100px",
                            "columns": [{
                                    "field": "jumlahjanuari",
                                    "title": "Jan",
                                    "width": "50px",
                                    aggregates: ["sum"],
                                    // template: "#: januari == null ? 0 : januari  #",
                                    footerTemplate: "#: data.januari.sum == null ? 0 : data.januari.sum #",
                                },
                                {
                                    "field": "jumlahfebruari",
                                    "title": "Feb",
                                    "width": "50px",
                                    aggregates: ["sum"],
                                    // template: "#: februari == null ? 0 : februari  #",
                                    footerTemplate: "#: data.februari.sum == null ? 0 : data.februari.sum #",
                                },
                                {
                                    "field": "jumlahmaret",
                                    "title": "Mar",
                                    "width": "50px",
                                    aggregates: ["sum"],
                                    // template: "#: maret == null ? 0 : maret  #",
                                    footerTemplate: "#: data.maret.sum == null ? 0 : data.maret.sum #",
                                },
                                {
                                    "field": "jumlahapril",
                                    "title": "Apr",
                                    "width": "50px",
                                    aggregates: ["sum"],
                                    // template: "#: april == null ? 0 : april  #",
                                    footerTemplate: "#: data.april.sum == null ? 0 : data.april.sum #",
                                },
                                {
                                    "field": "jumlahmei",
                                    "title": "Mei",
                                    "width": "50px",
                                    aggregates: ["sum"],
                                    // template: "#: mei == null ? 0 : mei  #",
                                    footerTemplate: "#: data.mei.sum == null ? 0 : data.mei.sum #",
                                },
                                {
                                    "field": "jumlahjuni",
                                    "title": "Jun",
                                    "width": "50px",
                                    aggregates: ["sum"],
                                    // template: "#: juni == null ? 0 : juni  #",
                                    footerTemplate: "#: data.juni.sum == null ? 0 : data.juni.sum #",
                                },
                                {
                                    "field": "jumlahjuli",
                                    "title": "Jul",
                                    "width": "50px",
                                    aggregates: ["sum"],
                                    // template: "#: juli == null ? 0 : juli  #",
                                    footerTemplate: "#: data.juli.sum == null ? 0 : data.juli.sum #",
                                },
                                {
                                    "field": "jumlahagustus",
                                    "title": "Agt",
                                    "width": "50px",
                                    aggregates: ["sum"],
                                    // template: "#: agustus == null ? 0 : agustus  #",
                                    footerTemplate: "#: data.agustus.sum == null ? 0 : data.agustus.sum #",
                                },
                                {
                                    "field": "jumlahseptember",
                                    "title": "Sep",
                                    "width": "50px",
                                    aggregates: ["sum"],
                                    // template: "#: september == null ? 0 : september  #",
                                    footerTemplate: "#: data.september.sum == null ? 0 : data.september.sum #",
                                },
                                {
                                    "field": "jumlahoktober",
                                    "title": "Okt",
                                    "width": "50px",
                                    aggregates: ["sum"],
                                    // template: "#: oktober == null ? 0 : oktober  #",
                                    footerTemplate: "#: data.oktober.sum == null ? 0 : data.oktober.sum #",

                                },
                                {
                                    "field": "jumlahnovember",
                                    "title": "Nov",
                                    "width": "50px",
                                    aggregates: ["sum"],
                                    // template: "#: november == null ? 0 : november  #",
                                    footerTemplate: "#: data.november.sum == null ? 0 : data.november.sum #",
                                },
                                {
                                    "field": "jumlahdesember",
                                    "title": "Des",
                                    "width": "50px",
                                    aggregates: ["sum"],
                                    // template: "#: desember == null ? 0 : desember  #",
                                    footerTemplate: "#: data.desember.sum == null ? 0 : data.desember.sum #",
                                },
                                {
                                    "field": "jumlahjumlah",
                                    "title": "Jml",
                                    "width": "50px",
                                    aggregates: ["sum"],
                                    // template: "#: jumlah == null ? 0 : jumlah  #",
                                    footerTemplate: "#: data.jumlah.sum == null ? 0 : data.jumlah.sum #",

                                },
                            ]
                        },
                        {
                            "field": "lebih20jam",
                            "title": "> / = 20 jam",
                            "width": "50px",
                            aggregates: ["sum"],
                            template: "#: lebih20jam == null ? 0 : lebih20jam  #",
                            footerTemplate: "#: data.lebih20jam.sum == null ? 0 : data.lebih20jam.sum #",
                        },

                    ]
                };
            }

            $scope.Perbaharui = function () {
                $scope.ClearSearch();
            }

            $scope.ClearSearch = function () {
                $scope.item = {};
                $scope.item.tglawal = $scope.now;
                $scope.item.tglakhir = $scope.now;
                $scope.Search();
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            $scope.formatJam = function (tanggal) {
                return moment(tanggal).format('HH:mm');
            }

            

            // $scope.data2 = function (dataItem) {
            //     for (var i = 0; i < dataItem.details.length; i++) {
            //         // dataItem.details[i].statCheckbox = false;
            //         dataItem.details[i].no = i + 1
            //     }
            //     return {
            //         dataSource: new kendo.data.DataSource({
            //             data: dataItem.details
            //         }),
            //         columns: [{
            //                 "field": "no",
            //                 "title": "No",
            //                 "width": "25px",
            //             },
            //             {
            //                 "field": "nippns",
            //                 "title": "Komponen Harga",
            //                 "width": "120px",
            //             },
            //             {
            //                 "field": "namalengkap",
            //                 "title": "Harga",
            //                 "width": "100px",
            //                 "template": "<span class='style-right'>#: hargasatuan #</span>"
            //             }
            //         ]
            //     }
            // };
            $scope.yearUngkul = {
                start: "decade",
                depth: "decade"
            }
            //** BATAS SUCI */
        }
    ]);
});