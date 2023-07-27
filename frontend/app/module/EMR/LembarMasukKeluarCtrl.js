define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LembarMasukKeluarCtrl', ['$q', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService','$mdDialog',
        function ($q, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, medifirstService, $mdDialog) {


            $scope.myVar = true
            $scope.noCM = $state.params.noCM;
            $scope.tombolSimpanVis = true
            $scope.isCetak = false
            $scope.noRecPap = cacheHelper.get('noRecPap');
            $scope.totalSkor = 0
            $scope.skorNutrisi = 0
            $scope.SkorSkalaFlacc = [];
            $scope.totalSkor2 = 0
            $scope.totalSkor4 = 0
            $scope.cc = {}
            var nomorEMR = '-'
            $scope.cc.emrfk = 3000434
            var dataLoad = []
            var pegawaiInputDetail= ''
            $scope.item.kasusbaru = true
            $scope.item.kasuslama = false

            medifirstService.getPart('emr/get-datacombo-part-pegawai', true, true, 20).then(function (data) {
                $scope.listPegawai = data
            })
            // medifirstService.getPart("emr/get-combo-icd10", true, true, 10).then(function (data) {
            //     $scope.listDiagnosa = data;
            // });

            medifirstService.getPart('emr/get-datacombo-part-diagnosa', true, true, 20).then(function (data) {
                $scope.listDiagnosa = data
             })

            medifirstService.get("emr/get-rekam-medis-dynamic?emrid=" + 3000434).then(function (e) {

                var datas = e.data.kolom4

                var detail = []
                var arrayShiftJaga= []
                var arrayShiftJaga2 = []
                var arrayShiftJaga3= []
                var sama = false
                for (let i = 0; i < datas.length; i++) {
                    const element = datas[i];
                    sama = false

                    // ARRAY GEJALA
                    if (element.kodeexternal == 'nyeri') {
                        for (let z = 0; z < arrayShiftJaga.length; z++) {
                            const element2 = arrayShiftJaga[z];
                            if (element2.namaexternal == element.namaexternal) {
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
                            arrayShiftJaga.push(datax)
                        }
                    }
                    //END ARRAY GEJALA
                    // ARRAY GEJALA
                    if (element.kodeexternal == 'nyeri2') {
                        for (let z = 0; z < arrayShiftJaga2.length; z++) {
                            const element2 = arrayShiftJaga2[z];
                            if (element2.namaexternal == element.namaexternal) {
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
                            arrayShiftJaga2.push(datax)
                        }
                    }
                    //END ARRAY GEJALA
                }
                // ARRAY GEJALA
                var gejalaKosongKeun = []
                for (let k = 0; k < arrayShiftJaga.length; k++) {
                    const element = arrayShiftJaga[k];
                    for (let l = 0; l < datas.length; l++) {
                        const element2 = datas[l];
                        if (element2.namaexternal == element.namaexternal) {
                            gejalaKosongKeun.push(element2)
                            element.details = gejalaKosongKeun
                        } else {
                            gejalaKosongKeun = []
                        }
                    }
                }
                $scope.listData1 = arrayShiftJaga
                var gejalaKosongKeun = []
                for (let k = 0; k < arrayShiftJaga2.length; k++) {
                    const element = arrayShiftJaga2[k];
                    for (let l = 0; l < datas.length; l++) {
                        const element2 = datas[l];
                        if (element2.namaexternal == element.namaexternal) {
                            gejalaKosongKeun.push(element2)
                            element.details = gejalaKosongKeun
                        } else {
                            gejalaKosongKeun = []
                        }
                    }
                }
                $scope.listData2 = arrayShiftJaga2
            })

            var cacheNomorEMR = cacheHelper.get('cacheNomorEMR');
            if (cacheNomorEMR != undefined) {
                nomorEMR = cacheNomorEMR[0]
                $scope.cc.norec_emr = nomorEMR
                $scope.cc.tanggalEmrl = cacheNomorEMR[2]
            }

            
            $scope.listKategoriUmur = [
                {
                    "id": 1, "nama": "Kategori Umur",
                    "detail": [
                        { "id": 3004500, "nama": "1. Anak", "satuan": "", "type": "checkbox" },
                        { "id": 3004501, "nama": "2. Dewasa", "satuan": "", "type": "checkbox" },
                        { "id": 3004502, "nama": "3. Usia Lanjut", "satuan": "", "type": "checkbox" },
                       
                    ]
                }
            ]
            $scope.listStatusMarital = [
                {
                    "id": 1, "nama": "Status Marital",
                    "detail": [
                        { "id": 3004503, "nama": "1. Nikah", "satuan": "", "type": "checkbox" },
                        { "id": 3004504, "nama": "2. Belum Nikah", "satuan": "", "type": "checkbox" },
                        { "id": 3004505, "nama": "3. Duda", "satuan": "", "type": "checkbox" },
                        { "id": 3004506, "nama": "4. Janda", "satuan": "", "type": "checkbox" },
                       
                    ]
                }
            ]
            $scope.listAgama = [
                {
                    "id": 1, "nama": "Agama",
                    "detail": [
                        { "id": 3004507, "nama": "1. Islam", "satuan": "", "type": "checkbox" },
                        { "id": 3004508, "nama": "2. Kristen", "satuan": "", "type": "checkbox" },
                        { "id": 3004509, "nama": "3. Khatolik", "satuan": "", "type": "checkbox" },
                        { "id": 3004510, "nama": "4. Hindu", "satuan": "", "type": "checkbox" },
                        { "id": 3004511, "nama": "5. Budha", "satuan": "", "type": "checkbox" },
                        { "id": 3004512, "nama": "Lain-lain, Sebutkan", "satuan": "", "type": "textbox2", "idd":  "3004513"},
                    ]
                }
            ] 
            $scope.listPendidikan = [
                {
                    "id": 1, "nama": "Pendidikan",
                    "detail": [
                        { "id": 3004514, "nama": "1. Tidak Sekolah", "satuan": "", "type": "checkbox" },
                        { "id": 3004515, "nama": "2. SD", "satuan": "", "type": "checkbox" },
                        { "id": 3004480, "nama": "3. SLB", "satuan": "", "type": "checkbox" },
                        { "id": 3004516, "nama": "4. SLTP", "satuan": "", "type": "checkbox" },
                        { "id": 3004481, "nama": "5. MTs", "satuan": "", "type": "checkbox" },
                        { "id": 3004517, "nama": "6. SLTA", "satuan": "", "type": "checkbox" },
                        { "id": 3004482, "nama": "7. SMK", "satuan": "", "type": "checkbox" },
                        { "id": 3004518, "nama": "8. DI ", "satuan": "", "type": "checkbox" },
                        { "id": 3004600, "nama": "9. DII", "satuan": "", "type": "checkbox" },
                        { "id": 3004601, "nama": "10. DIII", "satuan": "", "type": "checkbox" },
                        { "id": 3004602, "nama": "11. DIV", "satuan": "", "type": "checkbox" },
                        { "id": 3004519, "nama": "12. S1", "satuan": "", "type": "checkbox" },
                        { "id": 3004483, "nama": "13. S2", "satuan": "", "type": "checkbox" },
                        { "id": 3004484, "nama": "14. S3", "satuan": "", "type": "checkbox" },
                    ]
                }
            ] 
           
            $scope.listPekerjaan = [
                {
                    "id": 1, "nama": "Pekerjaan",
                    "detail": [
                        { "id": 3004520, "nama": "1. TNI", "satuan": "", "type": "checkbox" },
                        { "id": 3004485, "nama": "2. POLRI", "satuan": "", "type": "checkbox" },
                        { "id": 3004521, "nama": "3. Wiraswasta", "satuan": "", "type": "checkbox" },
                        { "id": 3004486, "nama": "4. Swasta", "satuan": "", "type": "checkbox" },
                        { "id": 3004522, "nama": "5. Buruh", "satuan": "", "type": "checkbox" },
                        { "id": 3004487, "nama": "6. Tani", "satuan": "", "type": "checkbox" },
                        { "id": 3004523, "nama": "7. PNS", "satuan": "", "type": "checkbox" },
                        { "id": 3004488, "nama": "8. Pensiunan", "satuan": "", "type": "checkbox" },
                        { "id": 3004524, "nama": "9. Pelajar", "satuan": "", "type": "checkbox" },
                        { "id": 3004489, "nama": "10.  Mahasiswa", "satuan": "", "type": "checkbox" },
                        { "id": 3004525, "nama": "11. Tak Kerja", "satuan": "", "type": "checkbox" },
                        { "id": 3004526, "nama": "12. Lain-lain, Sebutkan", "satuan": "", "type": "textbox2", "idd":  "3004527"},
                    ]
                }
            ] 
            

            $scope.listDikirimOleh = [
                {
                    "id": 1, "nama": "Dikirim Oleh ",
                    "detail": [
                        { "id": 3004528, "nama": "1. Keluarga", "type": "checkbox" },
                        { "id": 3004529, "nama": "2. RSU", "type": "checkbox" },
                        { "id": 3004530, "nama": "3. RSJ Lain", "type": "checkbox" },
                        { "id": 3004531, "nama": "4. Puskesmas", "type": "checkbox" },
                        { "id": 3004532, "nama": "5. Dokter Swasta", "type": "checkbox" },
                        { "id": 3004533, "nama": "6. Dinas Sosial", "type": "checkbox" },
                        { "id": 3004534, "nama": "7. Kejaksaan", "type": "checkbox" },
                        { "id": 3004534, "nama": "8. Polisi", "type": "checkbox" },
                        { "id": 3004535, "nama": "9. Lain-lain, Sebutkan", "satuan": "", "type": "textbox2", "idd":  "3004536"},
                    ]
                },
            ]

            
            $scope.listCaraBayar = [
                {
                    "id": 1, "nama": "Cara bayar",
                    "detail": [
                        { "id": 3004537, "nama": "1. Umum", "type": "checkbox" },
                        { "id": 3004538, "nama": "2. Jamkesos", "type": "checkbox" },
                        { "id": 3004539, "nama": "3. JKD Bantul", "type": "checkbox" },
                        { "id": 3004491, "nama": "4. JKD KP", "type": "checkbox" },
                        { "id": 3004492, "nama": "5. JKD Kodya", "type": "checkbox" },
                        { "id": 3004540, "nama": "6. JKN I ", "type": "checkbox" },
                        { "id": 3004603, "nama": "7. JKN II", "type": "checkbox" },
                        { "id": 3004604, "nama": "8. JKN III PBI", "type": "checkbox" },
                        { "id": 3004605, "nama": "9. JKN III Non PBI", "type": "checkbox" },
                        { "id": 3004541, "nama": "10. IPWL", "type": "checkbox" },
                        { "id": 3004542, "nama": "11. Proses", "satuan": "", "type": "textbox2", "idd":  "3004543"},
                    ]
                },
            ]
            $scope.listDirawat = [
                {
                    "id": 1, "nama": "Dirawat di RSJ Grhasia yang ke",
                    "detail": [
                        { "id": 3004544, "nama": "I", "type": "checkbox" },
                        { "id": 3004545, "nama": "II", "type": "checkbox" },
                        { "id": 3004546, "nama": "III", "type": "checkbox" },
                        { "id": 3004547, "nama": "IV", "type": "checkbox" },
                        { "id": 3004548, "nama": "V", "type": "checkbox" },
                        { "id": 3004549, "nama": "VI", "type": "checkbox" },
                        { "id": 3004550, "nama": "VII", "type": "checkbox" },
                        { "id": 3004551, "nama": "VIII", "type": "checkbox"},
                        { "id": 3004552, "nama": "IX", "type": "checkbox" },
                        { "id": 3004553, "nama": "Sebutkan", "satuan": "", "type": "textbox2", "idd":  "3004554"},
                    ]
                },
            ]
            $scope.listKelasPerawatan = [
                {
                    "id": 1, "nama": "Kelas Perawatan",
                    "detail": [
                        { "id": 3004561, "nama": "VIP", "satuan": "", "type": "checkbox" },
                        { "id": 3004562, "nama": "I", "satuan": "", "type": "checkbox" },
                        { "id": 3004563, "nama": "II", "satuan": "", "type": "checkbox" },
                        { "id": 3004564, "nama": "III", "satuan": "", "type": "checkbox" },
                    ]
                }
            ]
            $scope.listKasusPolisi = [
                {
                    "id": 1, "nama": "Kasus Polisi",
                    "detail": [
                        { "id": 3004567, "nama": "Ya", "satuan": "", "type": "checkbox" },
                        { "id": 3004568, "nama": "Tidak", "satuan": "", "type": "checkbox" },
                       
                    ]
                }
            ]
            $scope.listMelalui = [
                {
                    "id": 1, "nama": "Melalui",
                    "detail": [
                        { "id": 3004570, "nama": "IGD", "satuan": "", "type": "checkbox" },
                        { "id": 3004571, "nama": "Klinik, Sebutkan", "satuan": "", "type": "textbox2", "idd":  "3004572"},
                       
                    ]
                }
            ]

            $scope.listCaraKeluar = [
                {
                    "id": 1, "nama": "Cara Keluar",
                    "detail": [
                        { "id": 3004587, "nama": "1. Atas Persetujuan Dokter", "type": "checkbox" },
                        { "id": 3004588, "nama": "2. Atas Permintaann Sendiri", "type": "checkbox" },
                        { "id": 3004589, "nama": "3. Rujuk ke Rumah Sakit lain", "type": "checkbox" },
                        { "id": 3004590, "nama": "4. Lari", "type": "checkbox" },
                        { "id": 3004591, "nama": "5. Dropping", "type": "checkbox" },
                        { "id": 3004592, "nama": "6. Sebutkan", "satuan": "", "type": "textbox2", "idd":  "3004593"},
                    ]
                },
            ]
            
            $scope.listKeadaanKeluar = [
                {
                    "id": 1, "nama": "Keadaan Keluar",
                    "detail": [
                        { "id": 3004594, "nama": "1. Sembuh", "type": "checkbox" },
                        { "id": 3004595, "nama": "2. Belum Sembuh", "type": "checkbox" },
                        { "id": 3004596, "nama": "3. Perbaikan", "type": "checkbox" },
                        { "id": 3004597, "nama": "4. Sebutkan", "satuan": "", "type": "textbox2", "idd":  "3004598"},
                    ]
                },
            ]

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
                $scope.cc.alamat = chacePeriode[15]
                $scope.cc.tglLahir = chacePeriode[18]
                if (nomorEMR == '-') {
                    $scope.cc.norec_emr = '-'
                } else {
                    $scope.cc.norec_emr = nomorEMR
                }
            }
            var chekedd = false;

            medifirstService.get("emr/get-emr-transaksi-detail?noemr=" + nomorEMR + "&emrfk=" + $scope.cc.emrfk, true).then(function (dat) {
                $scope.item.obj = []
                $scope.item.obj2 = []
                medifirstService.get("emr/get-emr-to-emr?noemr="+ nomorEMR + "&emrfk=777").then(function (dat) {
                    
                   
                     var datas = dat.data.data
                    // var a = ""
                    // var b = ""
                    // for (var i = datas.length - 1; i >= 0; i--) {
            
                    //     var c = datas[i].caption
                    //     b = ", " + c
                    //     a = a + b
                    // }
                    // $scope.item.obj[3017315] = a.slice(1, a.length)
                    // console.log($scope.bro);
                    // $scope.isRouteLoading = false

                    for (let i = 0; i < datas.length; i++) {
                        if(datas[i].type == 'textbox'){
                            $scope.item.obj[datas[i].idtujuan]= datas[i].value   
                        }    
                        if (datas[i].type == "checkbox") {
                            if (datas[i].value == "1") {
                                $scope.item.obj[datas[i].idtujuan] = datas[i].value 
                                console.log(datas[i].type);
                            }
                        }       
                        if (datas[i].type == "textarea") {
                            $scope.item.obj[datas[i].idtujuan] = datas[i].value
                        }    
                                           
                    }
                    
                    
    
                })
                medifirstService.get("emr/get-data-lembar-masuk-keluar?noregistrasi=" + $scope.cc.noregistrasi).then(function (dat) {  
                    var datas=dat.data.data
                    if (dat.data.data[0].umur <= 18) {
                        $scope.item.obj[3004500] = true
                    }
                    else if (dat.data.data[0].umur >= 19  &&  dat.data.data[0].umur <=59){
                        $scope.item.obj[3004501] = true
                    }
                    else if (dat.data.data[0].umur >= 60){
                        $scope.item.obj[3004502] = true
                    }
                    
                    if (dat.data.data[0].statusperkawinan == "KAWIN"){
                        $scope.item.obj[3004503] = true
                    }
                    else if (dat.data.data[0].statusperkawinan == "BELUM KAWIN"){
                        $scope.item.obj[3004504] = true
                    }
                    else if (dat.data.data[0].statusperkawinan == "JANDA"){
                        $scope.item.obj[3004506] = true
                    }
                    else if (dat.data.data[0].statusperkawinan == "DUDA"){
                        $scope.item.obj[3004505] = true
                    }
                    if (dat.data.data[0].agama == "ISLAM"){
                        $scope.item.obj[3004507] = true

                    }
                    else if (dat.data.data[0].agama == "KRISTEN" || dat.data.data[0].agama == "KRISTEN KATHOLIK" ){
                        $scope.item.obj[3004508] = true

                    }
                    else if (dat.data.data[0].agama == "KRISTEN KATHOLIK"){
                        $scope.item.obj[3004509] = true

                    }
                    else if (dat.data.data[0].agama == "HINDU"){
                        $scope.item.obj[3004510] = true

                    }
                    else if (dat.data.data[0].agama == "BUDHA"){
                        $scope.item.obj[3004511] = true

                    }
                    else {
                        $scope.item.obj[3004512] = true
                        $scope.item.obj[3004513] = dat.data.data[0].agama

                    }

                    if (dat.data.data[0].pendidikan == "TIDAK SEKOLAH"){
                        $scope.item.obj[3004514] = true

                    }
                    else if (dat.data.data[0].pendidikan == "SD"){
                        $scope.item.obj[3004515] = true

                    }
                    else if (dat.data.data[0].pendidikan == "SLB"){
                        $scope.item.obj[3004480] = true

                    }
                    else if (dat.data.data[0].pendidikan == "SLTP"){
                        $scope.item.obj[3004516] = true

                    }
                    else if (dat.data.data[0].pendidikan == "MTS"){
                        $scope.item.obj[3004481] = true

                    }
                    else if (dat.data.data[0].pendidikan == "SLTA"){
                        $scope.item.obj[3004517] = true

                    }
                    else if (dat.data.data[0].pendidikan == "SMK"){
                        $scope.item.obj[3004482] = true

                    }
                    else if (dat.data.data[0].pendidikan == "DIPLOMA I"){
                        $scope.item.obj[3004518] = true

                    }
                    else if (dat.data.data[0].pendidikan == "DIPLOMA II"){
                        $scope.item.obj[3004600] = true

                    }
                    else if (dat.data.data[0].pendidikan == "DIPLOMA III"){
                        $scope.item.obj[3004601] = true

                    }
                    else if (dat.data.data[0].pendidikan == "DIPLOMA IV"){
                        $scope.item.obj[3004602] = true

                    }
                    else if (dat.data.data[0].pendidikan == "S1"){
                        $scope.item.obj[3004519] = true

                    }
                    else if (dat.data.data[0].pendidikan == "S2"){
                        $scope.item.obj[3004483] = true

                    }
                    else if (dat.data.data[0].pendidikan == "S3"){
                        $scope.item.obj[3004484] = true

                    }
                    if (dat.data.data[0].pekerjaan == "TNI"){
                        $scope.item.obj[3004520] = true

                    }
                    else if (dat.data.data[0].pekerjaan == "POLRI" || dat.data.data[0].pekerjaan == "PNS ( POLRI)" ){
                        $scope.item.obj[3004485] = true

                    }
                    else if (dat.data.data[0].pekerjaan == "WIRASWASTA" || dat.data.data[0].pekerjaan == "WIRASWASTA/ PENGUSAHA"){
                        $scope.item.obj[3004521] = true

                    }
                    else if (dat.data.data[0].pekerjaan == "SWASTA" || dat.data.data[0].pekerjaan == "PEGAWAI SWASTA"){
                        $scope.item.obj[3004486] = true

                    }
                    else if (dat.data.data[0].pekerjaan == "BURUH"){
                        $scope.item.obj[3004522] = true

                    }
                    else if (dat.data.data[0].pekerjaan == "PETANI"){
                        $scope.item.obj[3004487] = true

                    }
                    else if (dat.data.data[0].pekerjaan == "PNS"){
                        $scope.item.obj[3004523] = true

                    }
                    else if (dat.data.data[0].pekerjaan == "PENSIUNAN"){
                        $scope.item.obj[3004488] = true

                    }
                    else if (dat.data.data[0].pekerjaan == "PELAJAR" || dat.data.data[0].pekerjaan == "PELAJAR/MAHASISWA"){
                        $scope.item.obj[3004524] = true

                    }
                    else if (dat.data.data[0].pekerjaan == "MAHASISWA" || dat.data.data[0].pekerjaan == "PELAJAR/MAHASISWA"){
                        $scope.item.obj[3004489] = true

                    }
                    else if (dat.data.data[0].pekerjaan == "TIDAK BEKERJA" || dat.data.data[0].pekerjaan == "BELUM BEKERJA" ){
                        $scope.item.obj[3004525] = true

                    }
                    else {
                        $scope.item.obj[3004526] = true
                        $scope.item.obj[3004527] = dat.data.data[0].pekerjaan

                    }
                    $scope.item.obj[3004556] = dat.data.data[0].penanggungjawab
                    $scope.item.obj[3004557] = dat.data.data[0].hubungankeluargapj
                    $scope.item.obj[3004558] = dat.data.data[0].alamatrmh
                    $scope.item.obj[3004559] = dat.data.data[0].teleponpenanggungjawab

                  
                    //$scope.item.obj[3017315] 
                    // console.log($scope.bro);
    
                    for (let i = 0; i < datas.length; i++) {
                        if(datas[i].type == 'textbox'){
                            $scope.item.obj[datas[i].idtujuan]= datas[i].value   
                        }    
                        if (datas[i].type == "checkbox") {
                            if (datas[i].value == "1") {
                                $scope.item.obj[datas[i].idtujuan] = datas[i].value 
                                console.log(datas[i].type);
                            }
                        }       
                        if (datas[i].type == "textarea") {
                            $scope.item.obj[datas[i].idtujuan] = datas[i].value
                        }                         
                    }
                    
                    
    
                })


                $scope.item.obj[116062]=$scope.now
                $scope.item.obj[116068]={text:$scope.cc.namaruangan,value: $scope.cc.objectruanganfk}

                $scope.item.obj[116201] = true
                $scope.item.obj[116204] = true
                $scope.item.obj[116207] = true
                $scope.item.obj[116210] = true
                $scope.item.obj[116213] = true
                $scope.item.obj[116216] = true
                $scope.item.obj[116219] = true
                $scope.item.obj[116222] = true

                // $scope.item.obj[111056]=$scope.now
                // $scope.item.obj[14563]={ value: $scope.cc.iddpjp, text: $scope.cc.dokterdpjp }
                dataLoad = dat.data.data
                // medifirstService.get("emr/get-vital-sign?noregistrasi=" + $scope.cc.noregistrasi + "&objectidawal=4241&objectidakhir=4246&idemr=147", true).then(function (datas) {
                //     if (datas.data.data.length>0){
                //         if ($scope.item.obj[111061]== undefined) {
                //             $scope.item.obj[111061]=datas.data.data[0].value
                //         }
                //         if ($scope.item.obj[111062]== undefined) {
                //             $scope.item.obj[111062]=datas.data.data[3].value
                //         }
                //         if ($scope.item.obj[111063]==undefined) {
                //             $scope.item.obj[111063]=datas.data.data[4].value
                //         }
                //         if ($scope.item.obj[111064]==undefined) {
                //             $scope.item.obj[111064]=datas.data.data[5].value
                //         }

                //     }
                // })
                for (var i = 0; i <= dataLoad.length - 1; i++) {
                    if (parseFloat($scope.cc.emrfk) == dataLoad[i].emrfk) {

                        if (dataLoad[i].type == "textbox") {
                            $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                            if(dataLoad[i].emrdfk == 115952)
                                $scope.totalSkor4 = parseFloat(dataLoad[i].value)
                              if(dataLoad[i].emrdfk == 3152)
                                $scope.totalSkor = parseFloat(dataLoad[i].value)
                              if(dataLoad[i].emrdfk == 115928)
                                $scope.skorGizi = parseFloat(dataLoad[i].value)
                               
                        }
                        if (dataLoad[i].type == "checkbox") {
                            chekedd = false
                            if (dataLoad[i].value == '1') {
                                chekedd = true
                            }
                            $scope.item.obj[dataLoad[i].emrdfk] = chekedd
                            // if (dataLoad[i].emrdfk >= 14464 && dataLoad[i].emrdfk <= 14469 && chekedd) {
                            //     $scope.getSkalaNyeri(1, { descNilai: dataLoad[i].reportdisplay })
                            // }
                            // if (dataLoad[i].emrdfk >= 5053 && dataLoad[i].emrdfk <= 5084 && dataLoad[i].reportdisplay != null) {
                            //     var datass = { id: dataLoad[i].emrdfk, descNilai: dataLoad[i].reportdisplay }
                            //     $scope.getSkor2(datass)
                            // }
                            // if (dataLoad[i].emrdfk >= 14424 && dataLoad[i].emrdfk <= 14431 && dataLoad[i].reportdisplay != null) {
                            //     var datass = { id: dataLoad[i].emrdfk, descNilai: dataLoad[i].reportdisplay }
                            //     $scope.getSkorGizi(datass)
                            // }


                        }

                        if (dataLoad[i].type == "datetime") {
                            $scope.item.obj[dataLoad[i].emrdfk] = new Date(dataLoad[i].value)
                        }
                        if (dataLoad[i].type == "time") {
                            $scope.item.obj[dataLoad[i].emrdfk] = new Date(dataLoad[i].value)
                        }
                        if (dataLoad[i].type == "date") {
                            $scope.item.obj[dataLoad[i].emrdfk] = new Date(dataLoad[i].value)
                        }

                        if (dataLoad[i].type == "checkboxtextbox") {
                            $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                            $scope.item.obj2[dataLoad[i].emrdfk] = true
                        }
                        if (dataLoad[i].type == "textarea") {
                            $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                        }
                        if (dataLoad[i].type == "combobox") {
                            var str = dataLoad[i].value
                            if(str != undefined){
                                var res = str.split("~");
                                // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                                $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: res[1] }        
                            }

                        }
                        // pegawaiInputDetail = dataLoad[i].pegawaifk
                    }

                }
                // if( $scope.cc.norec_emr !='-' && pegawaiInputDetail !='' && pegawaiInputDetail !=null){
                //     if(pegawaiInputDetail != medifirstService.getPegawaiLogin().id){
                //         $scope.allDisabled =true
                //         // toastr.warning('Hanya Bisa melihat data','Peringatan')
                //         // return
                //     }
                // }

            })
            $scope.$watch('item.obj[116131]', function (nilai) {

                if (nilai == undefined) return
                nilai = parseInt(nilai)


                if (nilai == 0) {
                    $scope.item.obj[116121] = true
                    $scope.item.obj[116122] = false
                    $scope.item.obj[116123] = false
                    $scope.item.obj[116124] = false
                }
               if (nilai >= 1 && nilai <= 3) {
                    $scope.item.obj[116121] = false
                    $scope.item.obj[116122] = true   
                    $scope.item.obj[116123] = false
                    $scope.item.obj[116124] = false
                }
                if (nilai >= 4 && nilai <= 6) {
                    $scope.item.obj[116121] = false
                    $scope.item.obj[116122] = false
                    $scope.item.obj[116123] = true
                    $scope.item.obj[116124] = false
                }
                if (nilai >= 7 && nilai <= 10) {
                    $scope.item.obj[116121] = false
                    $scope.item.obj[116122] = false
                    $scope.item.obj[116123] = false
                    $scope.item.obj[116124] = true
                }
            });
            $scope.$watch('item.obj[116103]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[116103] ==true && $scope.item.obj[116108]== true){
                          $scope.item.obj[116107] = true
                          $scope.item.obj[116106]= false
                      }else if ($scope.item.obj[116103] ==true || $scope.item.obj[116108] ==true  ) {
                        $scope.item.obj[116106]= true
                        $scope.item.obj[116107]= false
                        $scope.item.obj[116105]= false
                      }
                       
                    }

                })
            $scope.$watch('item.obj[116108]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[116103] ==true && $scope.item.obj[116108]== true){
                          $scope.item.obj[116107] = true
                          $scope.item.obj[116106]= false
                          $scope.item.obj[116105]= false
                      }else if ($scope.item.obj[116103] ==true || $scope.item.obj[116108] ==true  ) {
                        $scope.item.obj[116106]= true
                        $scope.item.obj[116107]= false
                        $scope.item.obj[116105]= false
                      }
                       
                    }

                })
            $scope.$watch('item.obj[116104]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[116104] ==true && $scope.item.obj[116109]== true){
                          $scope.item.obj[116105] = true
                          $scope.item.obj[116107]= false
                          $scope.item.obj[116106]= false
                      }
                       
                    }

                })
            $scope.$watch('item.obj[116109]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[116104] ==true && $scope.item.obj[116109]== true){
                          $scope.item.obj[116105] = true
                          $scope.item.obj[116107]= false
                          $scope.item.obj[116106]= false
                      }
                       
                    }

                })
            $scope.$watch('item.obj[116103]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[116103] ==true){
                          $scope.item.obj[116104] = false
                      }
                       
                    }

                })
            $scope.$watch('item.obj[116104]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[116104] ==true){
                          $scope.item.obj[116103] = false
                      }
                       
                    }

                })
            $scope.$watch('item.obj[116108]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[116108] ==true){
                          $scope.item.obj[116109] = false
                      }
                       
                    }

                })
            $scope.$watch('item.obj[116109]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[116109] ==true){
                          $scope.item.obj[116108] = false
                      }
                       
                    }

                })
            $scope.$watch('item.obj[116063]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[116063] !=null ){
                          $scope.item.obj[116065] = $scope.cc.namapasien
                          $scope.item.obj[116066] = 'PASIEN'
                          
                      }
                       
                    }

                })
            $scope.$watch('item.obj[116111]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[116111] !=null ){

                                  var txtFirstNumberValue =  $scope.item.obj[116110];
                                  var txtSecondNumberValue =  $scope.item.obj[116111];
                                  var result = parseFloat(txtFirstNumberValue) / (parseFloat(txtSecondNumberValue) * parseFloat(txtSecondNumberValue));

                            if (result <= 18.4) {
                                $scope.item.obj[116112] = false
                                $scope.item.obj[116113] = false
                                $scope.item.obj[116114] = true
                            }
                            if (result >= 18.5 && result <=24.9) {
                                $scope.item.obj[116112] = false
                                $scope.item.obj[116113] = true
                                $scope.item.obj[116114] = false
                            }
                            if (result > 25) {
                                $scope.item.obj[116112] = true
                                $scope.item.obj[116113] = false
                                $scope.item.obj[116114] = false
                            }
                          
                      }
                       
                    }

                })
            $scope.$watch('item.obj[116110]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if($scope.item.obj[116110] !=null ){
                                  var txtFirstNumberValue =  $scope.item.obj[116110];
                                  var txtSecondNumberValue =  $scope.item.obj[116111];
                                  var result = parseFloat(txtFirstNumberValue) / (parseFloat(txtSecondNumberValue) * parseFloat(txtSecondNumberValue));
                                  if (!isNaN(result)) {
                                     $scope.item.obj[1] = result;
                            }
                             if (result <= 18.4) {
                                $scope.item.obj[116112] = false
                                $scope.item.obj[116113] = false
                                $scope.item.obj[116114] = true
                            }
                            if (result >= 18.5 && result <=24.9) {
                                $scope.item.obj[116112] = false
                                $scope.item.obj[116113] = true
                                $scope.item.obj[116114] = false
                            }
                            if (result > 25) {
                                $scope.item.obj[116112] = true
                                $scope.item.obj[116113] = false
                                $scope.item.obj[116114] = false
                            }
                          
                      }
                       
                    }

                })
                
            $scope.SkorSkalaFlacc[21008224] = 0;
            $scope.SkorSkalaFlacc[21008229] = 0;
            $scope.SkorSkalaFlacc[21008234] = 0;
            $scope.SkorSkalaFlacc[21008239] = 0;
            $scope.SkorSkalaFlacc[21008244] = 0;
            $scope.getSkorSkalaFlacc = function (jawab) {
                var arrobj = Object.keys($scope.item.obj);
                var arrSave = []
                
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    if (arrobj[i] == jawab.id) {
                        if ($scope.item.obj[parseFloat(arrobj[i])] == true) {
                            $scope.SkorSkalaFlacc[jawab.target] = $scope.SkorSkalaFlacc[jawab.target] + parseFloat(jawab.descNilai)
                            break
                        } else {
                            $scope.SkorSkalaFlacc[jawab.target] = $scope.SkorSkalaFlacc[jawab.target] - parseFloat(jawab.descNilai)
                            break
                        }
                    } else {
                    }
                }

                $scope.item.obj[jawab.target] = $scope.SkorSkalaFlacc[jawab.target]
                setSkor();
            }


            function setSkor()
            {
                var nilai1 = $scope.SkorSkalaFlacc[21008224]
                var nilai2 = $scope.SkorSkalaFlacc[21008229]
                var nilai3 = $scope.SkorSkalaFlacc[21008234]
                var nilai4 = $scope.SkorSkalaFlacc[21008239]
                var nilai5 = $scope.SkorSkalaFlacc[21008244]
            
                var total = nilai1 + nilai2 + nilai3 + nilai4 + nilai5
                $scope.item.obj[21008245] = total;
                
            }
   
            $scope.getSkorNutrisi = function (jawab) {
                var arrobj = Object.keys($scope.item.obj);
                var arrSave = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    if (arrobj[i] == jawab.id) {
                        if ($scope.item.obj[parseFloat(arrobj[i])] == true) {
                            $scope.skorNutrisi = $scope.skorNutrisi + parseFloat(jawab.descNilai)
                            break
                        } else {
                            $scope.skorNutrisi = $scope.skorNutrisi - parseFloat(jawab.descNilai)
                            break
                        }
                    } else {
                    }
                }

                $scope.item.obj[21008395] = $scope.skorNutrisi
            }
            $scope.$watch('item.obj[115952]', function (nilai) {

                if (nilai == undefined) return
                nilai = parseInt(nilai)


                if (nilai >=7 && nilai <=11 ) {
                    $scope.item.obj[115953] = true
                    $scope.item.obj[115954] = false
                   
                }
                if (nilai >= 12) {
                    $scope.item.obj[115953] = false
                    $scope.item.obj[115954] = true
                 
                }
                
            })


            
                

            $scope.getSkalaNyeri = function (data, stat) {
                $scope.activeStatus = stat.descNilai
                var nilai = stat.descNilai
                if (nilai >= 0 && nilai <= 1) {
                    $scope.item.obj[116125] = true
                    $scope.item.obj[116126] = false
                    $scope.item.obj[116127] = false
                    $scope.item.obj[116128] = false
                    $scope.item.obj[116129] = false
                    $scope.item.obj[116130] = false
                }
                if (nilai >= 2 && nilai <= 3) {
                    $scope.item.obj[116125] = false
                    $scope.item.obj[116126] = true
                    $scope.item.obj[116127] = false
                    $scope.item.obj[116128] = false
                    $scope.item.obj[116129] = false
                    $scope.item.obj[116130] = false
                }
                if (nilai >= 4 && nilai <= 5) {
                    $scope.item.obj[116125] = false
                    $scope.item.obj[116126] = false
                    $scope.item.obj[116127] = true
                    $scope.item.obj[116128] = false
                    $scope.item.obj[116129] = false
                    $scope.item.obj[116130] = false
                }
                if (nilai >= 6 && nilai <= 7) {
                    $scope.item.obj[116125] = false
                    $scope.item.obj[116126] = false
                    $scope.item.obj[116127] = false
                    $scope.item.obj[116128] = true
                    $scope.item.obj[116129] = false
                    $scope.item.obj[116130] = false
                }
                if (nilai >= 8 && nilai <= 9) {
                    $scope.item.obj[116125] = false
                    $scope.item.obj[116126] = false
                    $scope.item.obj[116127] = false
                    $scope.item.obj[116128] = false
                    $scope.item.obj[116129] = true
                    $scope.item.obj[116130] = false
                }

                if (nilai == 10) {
                    $scope.item.obj[116125] = false
                    $scope.item.obj[116126] = false
                    $scope.item.obj[116127] = false
                    $scope.item.obj[116128] = false
                    $scope.item.obj[116129] = false
                    $scope.item.obj[116130] = true
                }

            }

            $scope.getSkor = function (stat) {

                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    if (arrobj[i] == stat.id) {
                        if ($scope.item.obj[parseFloat(arrobj[i])] == true) {
                            $scope.totalSkor = $scope.totalSkor + parseFloat(stat.descNilai)
                            break
                        } else {
                            $scope.totalSkor = $scope.totalSkor - parseFloat(stat.descNilai)
                            break
                        }


                    } else {

                    }
                }
                $scope.item.obj[3152] = $scope.totalSkor + $scope.totalSkor2
                setSkorAkhir($scope.item.obj[3152])
            }
            $scope.getSkoralegi = function (stat) {

                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    if (arrobj[i] == stat.id) {
                        if ($scope.item.obj[parseFloat(arrobj[i])] == true) {
                            $scope.totalSkor = $scope.totalSkor + parseFloat(stat.reportdisplay)
                            break
                        } else {
                            $scope.totalSkor = $scope.totalSkor - parseFloat(stat.reportdisplay)
                            break
                        }


                    } 
                }
                $scope.item.obj[21000092] = $scope.totalSkor
            }
            $scope.$watch('item.obj[115855]', function(newValue,oldValue){
                    if(newValue!=oldValue){
                
                      if(parseInt($scope.item.obj[21000092]) == 0 ){
                          $scope.item.obj[21000093] ='Nyaman'
                      }
                      else if(parseInt($scope.item.obj[21000092]) >= 1 && parseInt($scope.item.obj[21000092]) <= 3){
                          $scope.item.obj[21000093] ='Kurang Nyaman' 
                      }
                      else if(parseInt($scope.item.obj[21000092]) >= 4 && parseInt($scope.item.obj[21000092]) <= 6){
                          $scope.item.obj[21000093] ='Nyeri Sedang' 
                      }
                      else if(parseInt($scope.item.obj[21000092]) >= 7 && parseInt($scope.item.obj[21000092]) <= 10){
                          $scope.item.obj[21000093] ='Nyeri Berat' 
                      }
                      else
                      $scope.item.obj[21000093] =''
                       
                    }
                })
            $scope.getSkor4 = function (stat) {

                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    if (arrobj[i] == stat.id) {
                        if ($scope.item.obj[parseFloat(arrobj[i])] == true) {
                            $scope.totalSkor4 = $scope.totalSkor4 + parseFloat(stat.descNilai)
                            break
                        } else {
                            $scope.totalSkor4 = $scope.totalSkor4 - parseFloat(stat.descNilai)
                            break
                        }


                    } else {

                    }
                }
                $scope.item.obj[115952] = $scope.totalSkor4
            }
                // setSkorAkhir($scope.item.obj[3152])
            $scope.totalSkorAses = 0
            $scope.getSkorAsesmen = function (stat, skor) {
                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    if (arrobj[i] == stat.id) {
                        if ($scope.item.obj[parseFloat(arrobj[i])] == true) {
                            $scope.totalSkorAses = $scope.totalSkorAses + parseFloat(skor.descNilai)
                            break
                        } else {
                            $scope.totalSkorAses = $scope.totalSkorAses - parseFloat(skor.descNilai)
                            break
                        }
                    } else {

                    }
                }
                $scope.item.obj[5194] = $scope.totalSkorAses
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
                $scope.item.obj[5084] = $scope.totalSkor + $scope.totalSkor2
                // setSkorAkhir($scope.item.obj[3152])
            }
            $scope.skorGizi = 0
            $scope.getSkorGizi= function (stat) {
                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    if (arrobj[i] == stat.id) {
                        if ($scope.item.obj[parseFloat(arrobj[i])] == true) {
                            $scope.skorGizi = $scope.skorGizi + parseFloat(stat.descNilai)
                            break
                        } else {
                            $scope.skorGizi = $scope.skorGizi - parseFloat(stat.descNilai)
                            break
                        }
                    } else {
                    }
                }
                $scope.item.obj[115928] = $scope.skorGizi
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
            $scope.$watch('item.obj[14432]', function (nilai) {

                if (nilai == undefined) return
                nilai = parseInt(nilai)


                if (nilai < 4 ) {
                    $scope.item.obj[14433] = true
                    $scope.item.obj[14434] = false
                   
                }
                if (nilai >= 4) {
                    $scope.item.obj[14433] = false
                    $scope.item.obj[14434] = true
                 
                }
            })
            $scope.kembali = function () {
                $rootScope.showRiwayat()
            }

            $scope.Save = function () {

                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    if ($scope.item.obj[parseInt(arrobj[i])] instanceof Date)
                        $scope.item.obj[parseInt(arrobj[i])] = moment($scope.item.obj[parseInt(arrobj[i])]).format('YYYY-MM-DD HH:mm')
                     // $scope.item.obj[parseInt(arrobj[i])] = moment($scope.item.obj[parseInt(arrobj[i])]).format('HH:mm')
                    arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])] })
                }
                $scope.cc.jenisemr = 'asesmen'
                var jsonSave = {
                    head: $scope.cc,
                    data: arrSave
                }
                medifirstService.post('emr/save-emr-dinamis', jsonSave).then(function (e) {
                    var confirm = $mdDialog.confirm()
                        .title('Informasi')
                        .textContent('EMR SUDAH TERSIMPAN, KLIK YA UNTUK KONFIRMASI')
                        .ariaLabel('Lucky day')
                        .cancel('')
                        .ok('Ya')
                    $mdDialog.show(confirm).then(function () {
                        medifirstService.postLogging('EMR', 'norec emrpasien_t', e.data.data.norec,  
                    'RM.11 Lembar Masuk dan Keluar ' + ' dengan No EMR - ' +e.data.data.noemr +  'Sudah Klik ya pada EMR No Registrasi ' 
                    + $scope.cc.noregistrasi).then(function (res) {
                    })
                    })
                    
                    // $state.go("RekamMedis.OrderJadwalBedah.ProsedurKeselamatan", {
                    //     namaEMR : $scope.cc.emrfk,
                    //     nomorEMR : e.data.data.noemr 
                    // });
                    medifirstService.postLogging('EMR', 'norec emrpasien_t', e.data.data.norec,  
                    'RM.11 Lembar Masuk dan Keluar ' + ' dengan No EMR - ' +e.data.data.noemr +  ' pada No Registrasi ' 
                    + $scope.cc.noregistrasi).then(function (res) {
                    })

                    var arrStr = {
                        0: e.data.data.noemr
                    }
                    cacheHelper.set('cacheNomorEMR', arrStr);
                });
            }
        }
    ]);
});
