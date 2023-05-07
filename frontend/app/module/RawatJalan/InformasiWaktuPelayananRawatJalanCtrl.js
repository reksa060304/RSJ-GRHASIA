define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('InformasiWaktuPelayananRawatJalanCtrl', ['$mdDialog', '$timeout', '$state', '$q', '$rootScope', '$scope', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($mdDialog, $timeout, $state, $q, $rootScope, $scope, cacheHelper, dateHelper, medifirstService) {

            $scope.isRouteLoading = false;
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.item = {};
            $scope.log = {};
            $scope.item.periodeAwal = moment($scope.now).format('YYYY-MM-DD 00:00');
            $scope.item.periodeAkhir = moment($scope.now).format('YYYY-MM-DD 23:59');

            $scope.totalAntrean = 0
            $scope.totalLengkap = 0
            $scope.totalQuality = 0
            $scope.totalRata = 0
            $scope.totalBelum = 0
            loadCombo()
            loadData()

            function loadCombo() {
                medifirstService.get("rawatjalan/get-antril-combo", false).then(function (data) {
                    $scope.listRuangan = data.data.ruanganRajal;
                    $scope.listKelompokPasien = data.data.kelompokpasien;
                });
            }

            function loadData() {
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm:ss');
                var kdBooking = ""
                if ($scope.item.kdBooking != undefined) {
                    var kdBooking = "&kdBooking=" + $scope.item.kdBooking
                }
                var rm = ""
                if ($scope.item.noRm != undefined) {
                    var rm = "&norm=" + $scope.item.noRm
                }
                var nm = ""
                if ($scope.item.nama != undefined) {
                    var nm = "&nama=" + $scope.item.nama
                }
                var rg = ""
                if ($scope.item.ruangan != undefined) {
                    var rg = "&ruangId=" + $scope.item.ruangan.id
                }

                var kelompok = ""
                if ($scope.item.kelompokpasien != undefined) {
                        kelompok = "&kelId=" + $scope.item.kelompokpasien.id
                }

                medifirstService.get("rawatjalan/get-informasi-monitoring-taskid?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    kdBooking + rm + nm + rg +kelompok
                ).then(function (data) {
                    $scope.totalAntrean = 0
                    $scope.totalLengkap = 0
                    $scope.totalQuality = 0
                    $scope.totalRata = 0
                    $scope.totalBelum = 0
                    $scope.isRouteLoading = false;
                    var rata1 = 0;
                    var rata2 = 0;
                    var rata3 = 0;
                    var rata4 = 0;
                    var rata5 = 0;
                    var rata6 = 0;
                    var rata7 = 0;
                    var rata1_ = 0;
                    var rata2_ = 0;
                    var rata3_ = 0;
                    var rata4_ = 0;
                    var rata5_ = 0;
                    var rata6_ = 0;
                    var rata7_ = 0;
                    for (let i = 0; i < data.data.length; i++) {
                        data.data[i].no = i + 1;
                        const element = data.data[i]
                        element.jumlahdetik = 0
                        if(element.status_1 == true || element.status_3 == true){
                            $scope.totalAntrean = $scope.totalAntrean + 1
                        }
                        // else if(element.status_1 == false || element.status_1 == null){
                        // 	$scope.totalBelum = $scope.totalBelum +1
                        // }
                        if((element.status_1 == true && element.status_2 == true && element.status_3 == true
                            && element.status_4 == true && element.status_5 == true) ||
                            ( element.status_3 == true
                                && element.status_4 == true && element.status_5 == true)
                            ){
                            $scope.totalLengkap = $scope.totalLengkap + 1
                        }else{
                            $scope.totalBelum = $scope.totalBelum +1
                        }
                        // if(element.taksid_1 != '-'){
                        // 	element.jumlahdetik =   Math.abs((new Date(element.taksid_1).getTime()/1000));
                        // 	rata1 = rata1 + (new Date(element.taksid_1).getTime()/1000);
                    
                        // }
                        
                        // if(element.taksid_2 != '-'){
                        // 	element.jumlahdetik =   Math.abs((new Date(element.taksid_2).getTime()/1000));
                        // 	rata2 = rata2 + (new Date(element.taksid_2).getTime()/1000);
                            
                        // }
                    
                        // if(element.taksid_3 != '-'){
                        // 	element.jumlahdetik =   Math.abs((new Date(element.taksid_3).getTime()/1000));
                        // 	rata3 = rata3 + (new Date(element.taksid_3).getTime()/1000);
                        // }
                        
                        // if(element.taksid_4 != '-'){
                        // 	element.jumlahdetik =   Math.abs((new Date(element.taksid_4).getTime()/1000));
                        // 	rata4 = rata4 + (new Date(element.taksid_4).getTime()/1000);
                        // }
                        
                        // if(element.taksid_5 != '-'){
                        // 	element.jumlahdetik =   Math.abs((new Date(element.taksid_5).getTime()/1000));
                        // 	rata5 = rata5 + (new Date(element.taksid_5).getTime()/1000);
                        // }
                        
                        // if(element.taksid_6 != '-'){
                        // 	element.jumlahdetik =   Math.abs((new Date(element.taksid_6).getTime()/1000));
                        // 	rata6 = rata6 + (new Date(element.taksid_6).getTime()/1000);
                        // }
                        
                        // if(element.taksid_7 != '-'){
                        // 	element.jumlahdetik =   Math.abs((new Date(element.taksid_7).getTime()/1000));
                        // 	rata7 = rata7 + (new Date(element.taksid_7).getTime()/1000);
                        // }
                        // element.waktu = element.jumlahdetik 
                        // rata1_ = rata1_ + element.waktu 
                        
                    }
                    $scope.totalQuality = $scope.totalLengkap / $scope.totalAntrean * 100
                    $scope.totalQuality = $scope.totalQuality.toFixed(2)

                    // // if ($scope.totalAntrean > 0) {
                    // 	// if(rata1> 0)
                    // 	// rata1 = rata1 /  $scope.totalAntrean;
                    // 	// if(rata2> 0)
                    // 	// rata2 = rata2 /  $scope.totalAntrean;
                    // 	// if(rata3> 0)
                    // 	// rata3 = rata3 /  $scope.totalAntrean;
                    // 	// if(rata3> 0)
                    // 	// rata4 = rata4 /  $scope.totalAntrean;
                    // 	// if(rata5> 0)
                    // 	// rata5 = rata5 /  $scope.totalAntrean;
                    // 	// if(rata6> 0)
                    // 	// rata6 = rata6 /  $scope.totalAntrean;
                    // 	// if(rata7> 0)
                    // 	// rata7 = rata7 /  $scope.totalAntrean;
                    // 	// $scope.totalRata = (rata1+rata2+rata3+rata4+rata5+rata6+rata7)/7 ;
                    // 	$scope.totalRata = rata1_/totalLengkap
                    // 	$scope.totalRata = secondsToHms($scope.totalRata); 
                    // // }
                
                    $scope.dataDaftarPasien = new kendo.data.DataSource({
                        data: data.data,
                        pageSize: 15,
                        total: data.data.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {}
                            }
                        }
                    });
                })

            }
            function secondsToHms(d) {
                d = Number(d);
                var h = Math.floor(d / 3600);
                var m = Math.floor(d % 3600 / 60);
                var s = Math.floor(d % 3600 % 60);
            
                var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
                var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
                var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
                return hDisplay + mDisplay + sDisplay;
                }
            function millisToMinutesAndSeconds(totalSeconds) {

                // 👇️ get number of full minutes
                var minutes = Math.floor(totalSeconds / 60);

                // 👇️ get remainder of seconds
                var seconds = totalSeconds % 60;

                function padTo2Digits(num) {
                    return num.toString().padStart(2, '0');
                }

                // ✅ format as MM:SS
                seconds = Math.floor(seconds)
                const result = `${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`;
                //   console.log(result); // 👉️ "09:25"
                // var minutes = Math.floor(millis / 60000);
                // var seconds = ((millis % 60000) / 1000).toFixed(0);
                return result;//minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
            }

            $scope.formatTanggal = function (tanggal) {
                if (tanggal == 'null')
                    return '-'
                else
                    return moment(tanggal).format('DD-MMM-YYYY HH:mm');
            }

            $scope.SearchData = function () {
                loadData()
            }

            $scope.columnDaftarPasien = {
                toolbar: [
                    "excel",
                ],
                excel: {
                    fileName: "InformasiWaktuPelayananRawatJalan.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:T1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Informasi Waktu Pelayanan Rawat Jalan",
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
                        "width": "50px",
                        "template": "<span class='style-center'>#: no #</span>"
                    },
                    {
                        "field": "tglregistrasi",
                        "title": "Tgl Registrasi",
                        "width": "150px",
                        "template": "<span class='style-left'>{{formatTanggal('#: tglregistrasi #')}}</span>"
                    },
                    {
                        "field": "noregistrasi",
                        "title": "Kode Booking",
                        "width": "150px",
                        "template": "<span class='style-center'>#: noregistrasi #</span>"
                    },
                    {
                        "field": "norm",
                        "title": "No RM",
                        "width": "100px",
                        "template": "<span class='style-center'>#: norm #</span>"
                    },
                    {
                        "field": "namapasien",
                        "title": "Nama Pasien",
                        "width": "200px",
                        "template": "<span class='style-left'>#: namapasien #</span>"
                    },
                    {
                        "field": "namaruangan",
                        "title": "Nama Ruangan",
                        "width": "250px",
                    },
                    {
                        "title": "Waktu Tunggu Admisi",
                        headerAttributes: {
                            style: "text-align : center"
                        },
                        "columns": [{
                                "field": "taksid_1",
                                "title": "Waktu",
                                "width": "150px",
                                "template": "<span class='style-center'>#: taksid_1 #</span>"
                            },
                            {
                                "field": "status_1",
                                "title": "Kirim Antrol",
                                "width": "100px",
                                "template": "<span class='style-center'># if( status_1==true) {# ✔ # } else {# ✘ #} #</span>"
                            }
                        ]
                    },
                    {
                        "field": "taksid_2",
                        "title": "Waktu Layanan Admisi",
                        headerAttributes: {
                            style: "text-align : center"
                        },
                        "columns": [{
                                "field": "taksid_2",
                                "title": "Waktu",
                                "width": "150px",
                                "template": "<span class='style-center'>#: taksid_2 #</span>"
                            },
                            {
                                "field": "status_2",
                                "title": "Kirim Antrol",
                                "width": "100px",
                                "template": "<span class='style-center'># if( status_2==true) {# ✔ # } else {# ✘ #} #</span>"
                            }
                        ]
                    },
                    {
                        "field": "taksid_3",
                        "title": "Waktu Tunggu Poli",
                        headerAttributes: {
                            style: "text-align : center"
                        },
                        "columns": [{
                                "field": "taksid_3",
                                "title": "Waktu",
                                "width": "150px",
                                "template": "<span class='style-center'>#: taksid_3 #</span>"
                            },
                            {
                                "field": "status_3",
                                "title": "Kirim Antrol",
                                "width": "100px",
                                "template": "<span class='style-center'># if( status_3==true) {# ✔ # } else {# ✘ #} #</span>"
                            }
                        ]
                    },
                    {
                        "field": "taksid_4",
                        "title": "Waktu Layan Poli",
                        headerAttributes: {
                            style: "text-align : center"
                        },
                        "columns": [{
                                "field": "taksid_4",
                                "title": "Waktu",
                                "width": "150px",
                                "template": "<span class='style-center'>#: taksid_4 #</span>"
                            },
                            {
                                "field": "status_4",
                                "title": "Kirim Antrol",
                                "width": "100px",
                                "template": "<span class='style-center'># if( status_4==true) {# ✔ # } else {# ✘ #} #</span>"
                            }
                        ]
                    },
                    {
                        "field": "taksid_5",
                        "title": "Waktu Tunggu Farmasi/Selesai Layan Poli",
                        headerAttributes: {
                            style: "text-align : center"
                        },
                        "columns": [{
                                "field": "taksid_5",
                                "title": "Waktu",
                                "width": "150px",
                                "template": "<span class='style-center'>#: taksid_5 #</span>"
                            },
                            {
                                "field": "status_5",
                                "title": "Kirim Antrol",
                                "width": "100px",
                                "template": "<span class='style-center'># if( status_5==true) {# ✔ # } else {# ✘ #} #</span>"
                            }
                        ]
                    },
                    {
                        "field": "taksid_6",
                        "title": "Waktu Layan Farmasi",
                        headerAttributes: {
                            style: "text-align : center"
                        },
                        "columns": [{
                                "field": "taksid_6",
                                "title": "Waktu",
                                "width": "150px",
                                "template": "<span class='style-center'>#: taksid_6 #</span>"
                            },
                            {
                                "field": "status_6",
                                "title": "Kirim Antrol",
                                "width": "100px",
                                "template": "<span class='style-center'># if( status_6==true) {# ✔ # } else {# ✘ #} #</span>"
                            }
                        ]
                    },
                    {
                        "field": "taksid_7",
                        "title": "Waktu Obat Selesai",
                        headerAttributes: {
                            style: "text-align : center"
                        },
                        "columns": [{
                                "field": "taksid_7",
                                "title": "Waktu",
                                "width": "150px",
                                "template": "<span class='style-center'>#: taksid_7 #</span>"
                            },
                            {
                                "field": "status_7",
                                "title": "Kirim Antrol",
                                "width": "100px",
                                "template": "<span class='style-center'># if( status_7==true) {# ✔ # } else {# ✘ #} #</span>"
                            }
                        ]
                    },
                    {
                        "field": "",
                        "title": "Log Antrol",
                        "width": "100px",
                        "template": "<span style='color:black;font-size:1.2em;cursor: pointer;' class='fa fa-file-text-o style-center' ng-click='ShowCatatan(\"#= noregistrasi #\")'></span>",
                    },
                ]
            };

            $scope.ShowCatatan = function (e) {
                $scope.log.kirimantrean = "";
                $scope.isRouteLoading = true;
                medifirstService.get("sysadmin/logging/get-log-antrean?noreff=" + e).then(function (e) {
                    $scope.isRouteLoading = false;
                    var data = e.data.data;
                    for (let i = 0; i < data.length; i++) {
                        const element = data[i].keterangan.split("|");
                        if (element[0].includes("Tambah Antrean Kode")) {
                            $scope.log.kirimantrean = $scope.log.kirimantrean + "* " + element[2] + "\r\n";
                        }
                    }
                    $scope.modalLogAntrol.open().center();
                });
            }

            $scope.syncData = function () {
                if ($scope.dataDaftarPasien._data.length == 0) return

                let pass = prompt("Masukan password", "");
                if (pass != null) {
                    if (pass == 'antrol') {
                        sendANTROL($scope.dataDaftarPasien._data)
                    } else {
                        toastr.error('Password Salah')
                    }
                }

            }
            async function sendANTROL(dataSource) {

                $scope.isRouteLoading = true
                for (let x = 0; x < dataSource.length; x++) {
                    const element = dataSource[x];
                    await repeatSendTaskId(element.noregistrasifk, 7)
                }
                $scope.isRouteLoading = false
            }
            async function repeatSendTaskId(norec_pd, taskid) {
                await medifirstService.get('registrasi/get-data-antrean?norec_pd=' + norec_pd).then(async function (e) {
                    // VALIDASI BARU
                    e.data.nohp = e.data.nohp.substring(0,12)
                    let ASALRUJUKAN = 1
                    let jenisKunjungan = 1 // {1 (Rujukan FKTP), 2 (Rujukan Internal), 3 (Kontrol), 4 (Rujukan Antar RS)}
                    if(e.data.jenispasien == 'JKN'){
                        var jsonRujukan = {
                            "url": `Rujukan/Peserta/${e.data.nomorkartu}`,
                            "method": "GET",
                            "data": null
                        }
                        let resRujukan = await medifirstService.postNonMessage('bridging/bpjs/tools', jsonRujukan)
                        if(resRujukan.data.metaData.code == 200){
                            ASALRUJUKAN = 1
                            e.data.nomorreferensi = resRujukan.data.response.rujukan.noKunjungan
                        }else{
                            var jsonRujukan = {
                                "url": `Rujukan/RS/Peserta/${e.data.nomorkartu}`,
                                "method": "GET",
                                "data": null
                            }
                            let resRujukan = await medifirstService.postNonMessage('bridging/bpjs/tools', jsonRujukan)
                            if(resRujukan.data.metaData.code == 200){
                                ASALRUJUKAN = 2
                                e.data.nomorreferensi = resRujukan.data.response.rujukan.noKunjungan
                            }
                        }
                    }
                    //cek jml sep rujukan

                    var jsonJML = {
                        "url":`Rujukan/JumlahSEP/${ASALRUJUKAN}/${e.data.nomorreferensi}`,
                        "method": "GET",
                        "data": null
                    }
                    let resJML = await medifirstService.postNonMessage('bridging/bpjs/tools', jsonJML)
                    if(resJML.data.metaData.code == 200){
                        if(resJML.data.response.jumlahSEP > 0){
                        var jsonSURKON = {
                            "url": `RencanaKontrol/ListRencanaKontrol/Bulan/${moment(new Date()).format("MM")}/Tahun/${new Date().getFullYear()}/Nokartu/${e.data.nomorkartu}/filter/2`,
                            "method": "GET",
                            "data": null
                        }
                        let resSURKON = await medifirstService.postNonMessage('bridging/bpjs/tools', jsonSURKON)
                        if(resSURKON.data.metaData.code == 200){
                            e.data.nomorreferensi = resSURKON.data.response.list[0].noSuratKontrol
                            jenisKunjungan = 3
                            if(resSURKON.data.response.list[0].terbitSEP =='Sudah'){
                                let NGASAL =  resSURKON.data.response.list[0].noSuratKontrol.replace('K','Z')
                                e.data.nomorreferensi = NGASAL
                            }
                        }else{
                            jenisKunjungan = 2
                            // e.data.nomorreferensi = e.data.kodebooking // pake no internal aja
                        }
                        }
                    }
                    e.data.jeniskunjungan = jenisKunjungan
                    var data = {
                        "url": "antrean/add",
                        "jenis": "antrean",
                        "method": "POST",
                        "data": e.data
                    }
                    medifirstService.postNonMessage('bridging/bpjs/tools', data).then(function (x) {
                        // simpan log
                        if (x.data.metaData.code != 208) {
                            medifirstService.postLogging('Antrol Task ID', 'norec Pasien Daftar',
                                e.data.kodebooking, 'Tambah Antrean Kode ' + e.data.kodebooking + ' | ' +
                                JSON.stringify(data) + ' | ' + JSON.stringify(x.data))
                        }
                        // mengabil data catatan task id dari 1 - 4
                        medifirstService.get('rawatjalan/get-monitoring-taskid?taskid=' + taskid + '&norec_pd=' + norec_pd).then(function (res) {
                            if (res.data.length == (taskid - 1)) {
                                updateWaktuId(res, e.data.kodebooking, norec_pd)
                            } else if (res.data.length == 7) {
                                updateWaktuId(res, e.data.kodebooking, norec_pd)
                            } else {
                                checkTaksId(e.data.kodebooking, norec_pd,e.data.estimasidilayani)
                            }
                        })
                    })
                })
            }
            async function updateWaktuId(res, kodebooking, norec_pd) {
                for (let i = 0; i < res.data.length; i++) {
                    const element = res.data[i];
                    if (kodebooking.length < 10) {
                        if (element.taskid >= 3) {
                            var data = {
                                "url": "antrean/updatewaktu",
                                "jenis": "antrean",
                                "method": "POST",
                                "data": {
                                    "kodebooking": kodebooking,
                                    "taskid": element.taskid,
                                    "waktu": parseInt(element.waktu)
                                }
                            }
                            await medifirstService.postNonMessage('bridging/bpjs/tools', data).then(async function (e) {
                                if (e.data.metaData.code == 200) {
                                    await saveMonitoringTaksId(kodebooking, norec_pd, element.taskid, parseInt(element.waktu), true);
                                }
                            })
                        }
                    } else {
                        var data = {
                            "url": "antrean/updatewaktu",
                            "jenis": "antrean",
                            "method": "POST",
                            "data": {
                                "kodebooking": kodebooking,
                                "taskid": element.taskid,
                                "waktu": parseInt(element.waktu)
                            }
                        }
                        await medifirstService.postNonMessage('bridging/bpjs/tools', data).then(async function (e) {
                            if (e.data.metaData.code == 200) {
                                await saveMonitoringTaksId(kodebooking, norec_pd, element.taskid, parseInt(element.waktu), true);
                            }
                        })
                    }

                }
            }

            async function saveMonitoringTaksId(kodebooking, noregistrasifk, taskid, waktu, statuskirim) {
                if (statuskirim == true) {
                    // 071e25a
                    var jsontask = {
                        "url": "antrean/getlisttask",
                        "jenis": "antrean",
                        "method": "POST",
                        "data": {
                            "kodebooking": kodebooking
                        }
                    }
                    // debugger
                    var response = await medifirstService.postNonMessage('bridging/bpjs/tools', jsontask)
                    if (response.data.metaData.code == 200) {
                        for (let xx = 0; xx < response.data.response.length; xx++) {
                            const element = response.data.response[xx];
                            if (element.taskid == taskid) {
                                if (element.wakturs != moment(new Date(waktu)).format('DD-MM-YYYY HH:mm:ss') + ' WIB') {
                                    let wak = moment(element.wakturs.replace(' WIB', ''), "DD/MM/YYYY HH:mm")._d
                                    console.log('waktu BPJS : ' + wak)
                                    console.log('waktu RS : ' + new Date(waktu))
                                    console.log('waktu TASK : ' + taskid)
                                    waktu = wak.getTime()
                                    break
                                }
                            }
                        }
                    }
                }

                var json = {
                    "noregistrasifk": noregistrasifk,
                    "taskid": taskid,
                    "waktu": waktu,
                    "statuskirim": statuskirim
                }
                await medifirstService.postNonMessage('rawatjalan/save-monitoring-taskid', json).then(async function (e) {
                    await loadData()
                })
            }
            const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;
            async function checkTaksId(param,norec_pd,tgl) {
                var taksId = [
                    { Id: 1, waktu: random(7500000, 9300000) }, // 1 ke 2 range waktu 60 - 90 menit 
                    { Id: 2, waktu: random(3600000, 3900000) }, // 2 ke 3 range waktu 5 - 10 menit 
                    { Id: 3, waktu: random(3000000, 3300000) }, // 3 ke 4 range waktu 15 - 20 menit 
                    { Id: 4, waktu: random(1320000, 2100000) }, // 4 ke 5 range waktu 7 - 20 menit
                    { Id: 5, waktu: random(600000, 900000) },  // 5 ke 6 range waktu 10 - 15 menit
                    { Id: 6, waktu: random(300000, 500000) }, // 
                    { Id: 7, waktu: random(0, 0) }, // 
                ]
                for (let i = 0; i < taksId.length; i++) {
                    var element = taksId[i]
                    var waktuS = tgl - element.waktu // new Date(tgl).getTime() - element.waktu
                    if (param.length < 10) {
                        if (element.Id >= 3) {
                            var json = {
                                "url": "antrean/updatewaktu",
                                "jenis": "antrean",
                                "method": "POST",
                                "data": {
                                    "kodebooking": param,
                                    "taskid": element.Id,
                                    "waktu": waktuS
                                }
                            }

                            await medifirstService.postNonMessage('bridging/bpjs/tools', json).then(async function (e) {
                                if (e.data.metaData.code == 200) {
                                    await saveMonitoringTaksId(param, norec_pd, element.Id, waktuS, true)
                                }
                                if (e.data.metaData.code == 208) {
                                    if (e.data.metaData.message == "TaskId=" + element.Id + " sudah ada") {
                                        await saveMonitoringTaksId(param, norec_pd, element.Id, waktuS, true)
                                    }
                                }
                            })
                        }
                    } else {
                        var json = {
                            "url": "antrean/updatewaktu",
                            "jenis": "antrean",
                            "method": "POST",
                            "data": {
                                "kodebooking": param,
                                "taskid": element.Id,
                                "waktu": waktuS
                            }
                        }

                        await medifirstService.postNonMessage('bridging/bpjs/tools', json).then(async function (e) {
                            if (e.data.metaData.code == 200) {
                                await saveMonitoringTaksId(param, norec_pd, element.Id, waktuS, true)
                            }
                            if (e.data.metaData.code == 208) {
                                if (e.data.metaData.message == "TaskId=" + element.Id + " sudah ada") {
                                    await saveMonitoringTaksId(param, norec_pd, element.Id, waktuS, true)
                                }
                            }
                        })
                    }
                }
            }
            $scope.validasiData = function () {
                cekValidDataDiBPJS($scope.dataDaftarPasien._data)

            }
            // async function cekValidDataDiBPJS(dataSource){
                
            // 	$scope.isRouteLoading = true
            // 	for (let x = 0; x < dataSource.length; x++) {
            // 		const element = dataSource[x];
            // 		var jsontask={
            // 			"url":"antrean/getlisttask",
            // 			"jenis":"antrean",
            // 			"method":"POST",
            // 			"data":{
            // 				"kodebooking":element.noregistrasi
            // 			}
            // 		}
            // 		var response =  await medifirstService.postNonMessage('bridging/bpjs/tools', jsontask)
            // 		if(response.data.metaData.code == 200){
            // 			for (let xx = 0; xx < response.data.response.length; xx++) {
            // 				const element2 = response.data.response[xx];
            // 				var wakturs =  element2.wakturs.substr(0,16) +' '+element2.wakturs.substr(20,3)
            // 				var taskid = element2.taskid
            // 				if(element2.taskid ==  1  ){
            // 					var waktu =	element.taksid_1
            // 					if(wakturs!= moment(new Date(waktu )).format('DD-MM-YYYY HH:mm' ) + ' WIB'){
            // 						let wak = moment(element2.wakturs.replace(' WIB',''), "DD/MM/YYYY HH:mm")._d
            // 						console.log('waktu BPJS : ' + wak)
            // 						console.log('waktu RS : ' + new Date(waktu ))
            // 						console.log('waktu TASK : ' +element2.taskid)
            // 						waktu = wak.getTime()
                            
            // 					}

            // 					var json = {
            // 						"noregistrasifk":element.noregistrasifk,
            // 						"taskid": taskid,
            // 						"waktu": waktu,
            // 						"statuskirim": true
            // 					}
            // 					await medifirstService.postNonMessage('rawatjalan/save-monitoring-taskid', json)
            // 				}
            // 				if(element2.taskid ==  2  ){
            // 					var waktu =	element.taksid_2
            // 					if(wakturs!= moment(new Date(waktu )).format('DD-MM-YYYY HH:mm' ) + ' WIB'){
            // 						let wak = moment(element2.wakturs.replace(' WIB',''), "DD/MM/YYYY HH:mm")._d
            // 						console.log('waktu BPJS : ' + wak)
            // 						console.log('waktu RS : ' + new Date(waktu ))
            // 						console.log('waktu TASK : ' +element2.taskid)
            // 						waktu = wak.getTime()
            // 					}
            // 					var json = {
            // 						"noregistrasifk": element.noregistrasifk,
            // 						"taskid": taskid,
            // 						"waktu": waktu,
            // 						"statuskirim": true
            // 					}
            // 					await medifirstService.postNonMessage('rawatjalan/save-monitoring-taskid', json)
            // 				}
            // 				if(element2.taskid ==  3 ){
            // 					var waktu =	element.taksid_3
            // 					if(wakturs!= moment(new Date(waktu )).format('DD-MM-YYYY HH:mm' ) + ' WIB'){
            // 						let wak = moment(element2.wakturs.replace(' WIB',''), "DD/MM/YYYY HH:mm")._d
            // 						console.log('waktu BPJS : ' + wak)
            // 						console.log('waktu RS : ' + new Date(waktu ))
            // 						console.log('waktu TASK : ' +element2.taskid)
            // 						waktu = wak.getTime()
                                    
            // 					}
            // 					var json = {
            // 						"noregistrasifk": element.noregistrasifk,
            // 						"taskid": taskid,
            // 						"waktu": waktu,
            // 						"statuskirim": true
            // 					}
            // 					await medifirstService.postNonMessage('rawatjalan/save-monitoring-taskid', json)
                                
            // 				}
            // 				if(element2.taskid ==  4 ){
            // 					var waktu =	element.taksid_4
            // 					if(wakturs!= moment(new Date(waktu )).format('DD-MM-YYYY HH:mm' ) + ' WIB'){
            // 						let wak = moment(element2.wakturs.replace(' WIB',''), "DD/MM/YYYY HH:mm")._d
            // 						console.log('waktu BPJS : ' + wak)
            // 						console.log('waktu RS : ' + new Date(waktu ))
            // 						console.log('waktu TASK : ' +element2.taskid)
            // 						waktu = wak.getTime()
            // 					}
            // 					var json = {
            // 						"noregistrasifk": element.noregistrasifk,
            // 						"taskid": taskid,
            // 						"waktu": waktu,
            // 						"statuskirim": true
            // 					}
            // 					await medifirstService.postNonMessage('rawatjalan/save-monitoring-taskid', json)
            // 				}
            // 				if(element2.taskid ==  5 ){
            // 					var waktu =	element.taksid_5
            // 					if(wakturs!= moment(new Date(waktu )).format('DD-MM-YYYY HH:mm' ) + ' WIB'){
            // 						let wak = moment(element2.wakturs.replace(' WIB',''), "DD/MM/YYYY HH:mm")._d
            // 						console.log('waktu BPJS : ' + wak)
            // 						console.log('waktu RS : ' + new Date(waktu ))
            // 						console.log('waktu TASK : ' +element2.taskid)
            // 						waktu = wak.getTime()
            // 					}
            // 					var json = {
            // 						"noregistrasifk": element.noregistrasifk,
            // 						"taskid": taskid,
            // 						"waktu": waktu,
            // 						"statuskirim": true
            // 					}
            // 					await medifirstService.postNonMessage('rawatjalan/save-monitoring-taskid', json)

                            
            // 				}
            // 				if(element2.taskid ==  6  && waktu !='-'){
            // 					var waktu =	element.taksid_6
            // 					if(wakturs!= moment(new Date(waktu )).format('DD-MM-YYYY HH:mm' ) + ' WIB'){
            // 						let wak = moment(element2.wakturs.replace(' WIB',''), "DD/MM/YYYY HH:mm")._d
            // 						console.log('waktu BPJS : ' + wak)
            // 						console.log('waktu RS : ' + new Date(waktu ))
            // 						console.log('waktu TASK : ' +element2.taskid)
            // 						waktu = wak.getTime()
            // 					}
            // 					var json = {
            // 						"noregistrasifk": element.noregistrasifk,
            // 						"taskid": taskid,
            // 						"waktu": waktu,
            // 						"statuskirim": true
            // 					}
            // 					await medifirstService.postNonMessage('rawatjalan/save-monitoring-taskid', json)
            // 				}
            // 				if(element2.taskid ==  7  && waktu !='-'){
            // 					var waktu =	element.taksid_7
            // 					if(wakturs!= moment(new Date(waktu )).format('DD-MM-YYYY HH:mm' ) + ' WIB'){
            // 						let wak = moment(element2.wakturs.replace(' WIB',''), "DD/MM/YYYY HH:mm")._d
            // 						console.log('waktu BPJS : ' + wak)
            // 						console.log('waktu RS : ' + new Date(waktu ))
            // 						console.log('waktu TASK : ' +element2.taskid)
            // 						waktu = wak.getTime()
            // 					}
            // 					var json = {
            // 						"noregistrasifk": element.noregistrasifk,
            // 						"taskid": taskid,
            // 						"waktu": waktu,
            // 						"statuskirim": true
            // 					}
            // 					await medifirstService.postNonMessage('rawatjalan/save-monitoring-taskid', json)
            // 				}
            // 			}
            // 		}
            // 	}
            // 	await loadData()
            // 	$scope.isRouteLoading = false
            // }
        
            // $scope.validasiData = function(){
            // 	cekValidDataDiBPJS($scope.dataDaftarPasien._data )
                
            // }
            async function cekValidDataDiBPJS(dataSource){
                var listWaktu = [
                    { Id: 1, waktu: random(7500000, 9300000) }, // 1 ke 2 range waktu 60 - 90 menit 
                    { Id: 2, waktu: random(3600000, 3900000) }, // 2 ke 3 range waktu 5 - 10 menit 
                    { Id: 3, waktu: random(3000000, 3300000) }, // 3 ke 4 range waktu 15 - 20 menit 
                    { Id: 4, waktu: random(1320000, 2100000) }, // 4 ke 5 range waktu 7 - 20 menit
                    { Id: 5, waktu: random(600000, 900000) },  // 5 ke 6 range waktu 10 - 15 menit
                    { Id: 6, waktu: random(300000, 500000) }, // 
                    { Id: 7, waktu: random(0, 0) }, // 
                ]
                $scope.isRouteLoading = true
                for (let x = 0; x < dataSource.length; x++) {
                    const element = dataSource[x];
                    var jsontask={
                        "url":"antrean/getlisttask",
                        "jenis":"antrean",
                        "method":"POST",
                        "data":{
                            "kodebooking":element.noregistrasi
                        }
                    }
                    var response =  await medifirstService.postNonMessage('bridging/bpjs/tools', jsontask)
                    if(response.data.metaData.code == 200){
                        var satu = false,dua =false ,tiga=false,empat = false,lima=false,enam=false,tujuh=false
                        for (let xx = 0; xx < response.data.response.length; xx++) {
                            const element2 = response.data.response[xx];
                            var wakturs =  element2.wakturs.substr(0,16) +' '+element2.wakturs.substr(20,3)
                            var taskid = element2.taskid
                            if(element2.taskid ==  1  ){
                                satu = true
                                var waktu =	element.taksid_1
                                if(wakturs!= moment(new Date(waktu )).format('DD-MM-YYYY HH:mm' ) + ' WIB'){
                                    let wak = moment(element2.wakturs.replace(' WIB',''), "DD/MM/YYYY HH:mm")._d
                                    console.log('waktu BPJS : ' + wak)
                                    console.log('waktu RS : ' + new Date(waktu ))
                                    console.log('waktu TASK : ' +element2.taskid)
                                    waktu = wak.getTime()
                            
                                }

                                var json = {
                                    "noregistrasifk":element.noregistrasifk,
                                    "taskid": taskid,
                                    "waktu": (typeof waktu === 'string' || waktu instanceof String)? new Date(waktu).getTime() : waktu,
                                    "statuskirim": true
                                }
                                await medifirstService.postNonMessage('rawatjalan/save-monitoring-taskid', json)
                            }
                            if(element2.taskid ==  2  ){
                                dua = true
                                var waktu =	element.taksid_2
                                if(wakturs!= moment(new Date(waktu )).format('DD-MM-YYYY HH:mm' ) + ' WIB'){
                                    let wak = moment(element2.wakturs.replace(' WIB',''), "DD/MM/YYYY HH:mm")._d
                                    console.log('waktu BPJS : ' + wak)
                                    console.log('waktu RS : ' + new Date(waktu ))
                                    console.log('waktu TASK : ' +element2.taskid)
                                    waktu = wak.getTime()
                                }
                                var json = {
                                    "noregistrasifk": element.noregistrasifk,
                                    "taskid": taskid,
                                    "waktu": (typeof waktu === 'string' || waktu instanceof String)? new Date(waktu).getTime() : waktu,
                                    "statuskirim": true
                                }
                                await medifirstService.postNonMessage('rawatjalan/save-monitoring-taskid', json)
                            }
                            if(element2.taskid ==  3 ){
                                tiga = true
                                var waktu =	element.taksid_3
                                if(wakturs!= moment(new Date(waktu )).format('DD-MM-YYYY HH:mm' ) + ' WIB'){
                                    let wak = moment(element2.wakturs.replace(' WIB',''), "DD/MM/YYYY HH:mm")._d
                                    console.log('waktu BPJS : ' + wak)
                                    console.log('waktu RS : ' + new Date(waktu ))
                                    console.log('waktu TASK : ' +element2.taskid)
                                    waktu = wak.getTime()
                                    
                                }
                                var json = {
                                    "noregistrasifk": element.noregistrasifk,
                                    "taskid": taskid,
                                    "waktu": (typeof waktu === 'string' || waktu instanceof String)? new Date(waktu).getTime() : waktu,
                                    "statuskirim": true
                                }
                                await medifirstService.postNonMessage('rawatjalan/save-monitoring-taskid', json)
                                
                            }
                            if(element2.taskid ==  4 ){
                                empat = true
                                var waktu =	element.taksid_4
                                if(wakturs!= moment(new Date(waktu )).format('DD-MM-YYYY HH:mm' ) + ' WIB'){
                                    let wak = moment(element2.wakturs.replace(' WIB',''), "DD/MM/YYYY HH:mm")._d
                                    console.log('waktu BPJS : ' + wak)
                                    console.log('waktu RS : ' + new Date(waktu ))
                                    console.log('waktu TASK : ' +element2.taskid)
                                    waktu = wak.getTime()
                                }
                                var json = {
                                    "noregistrasifk": element.noregistrasifk,
                                    "taskid": taskid,
                                    "waktu": (typeof waktu === 'string' || waktu instanceof String)? new Date(waktu).getTime() : waktu,
                                    "statuskirim": true
                                }
                                await medifirstService.postNonMessage('rawatjalan/save-monitoring-taskid', json)
                            }
                            if(element2.taskid ==  5 ){
                                lima = true
                                var waktu =	element.taksid_5
                                if(wakturs!= moment(new Date(waktu )).format('DD-MM-YYYY HH:mm' ) + ' WIB'){
                                    let wak = moment(element2.wakturs.replace(' WIB',''), "DD/MM/YYYY HH:mm")._d
                                    console.log('waktu BPJS : ' + wak)
                                    console.log('waktu RS : ' + new Date(waktu ))
                                    console.log('waktu TASK : ' +element2.taskid)
                                    waktu = wak.getTime()
                                }
                                var json = {
                                    "noregistrasifk": element.noregistrasifk,
                                    "taskid": taskid,
                                    "waktu": (typeof waktu === 'string' || waktu instanceof String)? new Date(waktu).getTime() : waktu,
                                    "statuskirim": true
                                }
                                await medifirstService.postNonMessage('rawatjalan/save-monitoring-taskid', json)


                            }
                            if(element2.taskid ==  6  && waktu !='-'){
                                enam = true
                                var waktu =	element.taksid_6
                                if(wakturs!= moment(new Date(waktu )).format('DD-MM-YYYY HH:mm' ) + ' WIB'){
                                    let wak = moment(element2.wakturs.replace(' WIB',''), "DD/MM/YYYY HH:mm")._d
                                    console.log('waktu BPJS : ' + wak)
                                    console.log('waktu RS : ' + new Date(waktu ))
                                    console.log('waktu TASK : ' +element2.taskid)
                                    waktu = wak.getTime()
                                }
                                var json = {
                                    "noregistrasifk": element.noregistrasifk,
                                    "taskid": taskid,
                                    "waktu": (typeof waktu === 'string' || waktu instanceof String)? new Date(waktu).getTime() : waktu,
                                    "statuskirim": true
                                }
                                await medifirstService.postNonMessage('rawatjalan/save-monitoring-taskid', json)
                            }
                            if(element2.taskid ==  7  && waktu !='-'){
                                tujuh = true
                                var waktu =	element.taksid_7
                                if(wakturs!= moment(new Date(waktu )).format('DD-MM-YYYY HH:mm' ) + ' WIB'){
                                    let wak = moment(element2.wakturs.replace(' WIB',''), "DD/MM/YYYY HH:mm")._d
                                    console.log('waktu BPJS : ' + wak)
                                    console.log('waktu RS : ' + new Date(waktu ))
                                    console.log('waktu TASK : ' +element2.taskid)
                                    waktu = wak.getTime()
                                }
                                var json = {
                                    "noregistrasifk": element.noregistrasifk,
                                    "taskid": taskid,
                                    "waktu": (typeof waktu === 'string' || waktu instanceof String)? new Date(waktu).getTime() : waktu,
                                    "statuskirim": true
                                }
                                await medifirstService.postNonMessage('rawatjalan/save-monitoring-taskid', json)
                            }
                        }
                        
                        if(satu == false){await kirimTaskUlang(element.noregistrasi,1,element.noregistrasifk,(element.taksid_1!='-'?new Date(element.taksid_1).getTime(): new Date().getTime()))}
                        if(dua == false){await kirimTaskUlang(element.noregistrasi,2,element.noregistrasifk,(element.taksid_2!='-'?new Date(element.taksid_2).getTime():
                        
                        new Date(element.taksid_1).setTime(new Date(element.taksid_1).getTime() + 1080000)//3mnt
                        ))}
                        if(tiga == false){await kirimTaskUlang(element.noregistrasi,3,element.noregistrasifk,(element.taksid_3!='-'?new Date(element.taksid_3).getTime()
                        :new Date(element.taksid_2).setTime(new Date(element.taksid_2).getTime() + 1080000)//3mnt
                        ))}
                        if(empat == false){
                            await kirimTaskUlang(element.noregistrasi,4,element.noregistrasifk,(element.taksid_4!='-'?new Date(element.taksid_4).getTime():
                            new Date(element.taksid_3).setTime(new Date(element.taksid_3).getTime() + 1080000)//3mnt
                            ))}
                        if(lima == false){await kirimTaskUlang(element.noregistrasi,5,element.noregistrasifk,(element.taksid_5!='-'?new Date(element.taksid_5).getTime():
                            new Date(element.taksid_4).setTime(new Date(element.taksid_4).getTime() + 1080000)//3mnt
                        ))}
                        if(enam == false){await kirimTaskUlang(element.noregistrasi,6,element.noregistrasifk,(element.taksid_6!='-'?new Date(element.taksid_6).getTime():
                            new Date(element.taksid_5).setTime(new Date(element.taksid_5).getTime() + 1080000)//3mnt
                        ))}
                        if(tujuh == false){await kirimTaskUlang(element.noregistrasi,7,element.noregistrasifk,(element.taksid_7!='-'?new Date(element.taksid_7).getTime():
                        new Date(element.taksid_6).setTime(new Date(element.taksid_6).getTime() + 1080000)//3mnt
                        ))}
                    
                    }else{

                        var jsonz = {
                            "noregistrasifk":element.noregistrasifk,
                        }
                        // await medifirstService.postNonMessage('rawatjalan/disabled-monitoring-taskid', jsonz)
                    }
                }
                await loadData()
                $scope.isRouteLoading = false
            }
            async function kirimTaskUlang(param, taskid, noregistrasifk, waktu) {
                var jsons = {
                    "url": "antrean/updatewaktu",
                    "jenis": "antrean",
                    "method": "POST",
                    "data": {
                        "kodebooking": param,
                        "taskid": taskid,
                        "waktu": waktu
                    }
                }

                await medifirstService.postNonMessage('bridging/bpjs/tools', jsons).then(async function (e) {
                    if (e.data.metaData.code == 200) {
                        var json = {
                            "noregistrasifk": noregistrasifk,
                            "taskid": taskid,
                            "waktu": waktu,
                            "statuskirim": true
                        }
                        await medifirstService.postNonMessage('rawatjalan/save-monitoring-taskid', json)
                    }
                    if (e.data.metaData.code == 208) {
                        if (e.data.metaData.message == "TaskId=" + taskid + " sudah ada") {
                            var json = {
                                "noregistrasifk": noregistrasifk,
                                "taskid": taskid,
                                "waktu": waktu,
                                "statuskirim": true
                            }
                            await medifirstService.postNonMessage('rawatjalan/save-monitoring-taskid', json)
                        }
                    }
                })
            }

            // END ################
        }
    ]);
});