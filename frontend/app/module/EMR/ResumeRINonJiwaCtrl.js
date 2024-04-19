define(['initialize', 'Configuration'], function (initialize, config) {
    'use strict';
    initialize.controller('ResumeRINonJiwaCtrl', ['$q', '$scope', '$state', 'MedifirstService', '$timeout', 'CacheHelper', '$rootScope',
        function ($q, $scope, $state, medifirstService, $timeout, cacheHelper, $rootScope) {
            $scope.isRouteLoading = false;
            $scope.now = new Date()
            $scope.item = {}
            // $scope.item = {
            //     tglresume: $scope.now,
            //     // alasanDirawat: ''
            // }
            $scope.cc = {
            }  // set defined object
            $scope.isGrid = true
            $scope.isNext = true
            var data2 = []
            $scope.norecAPD = $state.params.noRec
            $scope.pegawaiLogin = JSON.parse(localStorage.getItem('pegawai'))
            var cookie = document.cookie.split(';')
            var kelompokUser = cookie[0].split('=')
            var getCache = cacheHelper.get('cacheRekamMedis')
            if (getCache != undefined) {
                $scope.nocm = getCache[0]
                $scope.norecPd = getCache[8]
                if (!$scope.norecAPD)
                    $scope.norecAPD = getCache[7]
                $scope.item.namaruangan = getCache[12]
            }
            loadisiDiagnosa();
            $scope.listPemeriksaanFisik = [
                {
                    "id": 1, "nama": "Pemeriksaan Fisik", "detail": [
                        { "id": 1, "nama": "Loboratorium" },
                        { "id": 2, "nama": "Rotgen" },
                        { "id": 3, "nama": "CT Scan/MRI/USG" },
                    ]
                }
            ]
            $scope.listKondisi = [              
                    
                    { "id": 1, "nama": "Sembuh" },
                    { "id": 2, "nama": "Belum Sembuh" },
                    { "id": 3, "nama": "Pulang atas Permintaan Sendiri" },
                    { "id": 4, "nama": "Membaik" },
                    // { "id": 5, "nama": "Meninggal" },
                    // { "id": 6, "nama": "Pindah RS Lain" },
                    
                
            ]
            $scope.listPengobatan = [
                {
                    "id": 2, "nama": "9. Intruksi / Foloow Up Tindak Lanjut :", "detail": [
                        { "id": 1, "nama": "a. Minum obat sesuai aturan" },
                        { "id": 2, "nama": "b. Kontrol Klinik " },
                        { "id": 3, "nama": "" },
                        { "id": 4, "nama": "Dokter Luar" },
                    ]
                }
            ]

            $scope.listYa = [
                { "id": 1, "nama": "Ya" },
                { "id": 2, "nama": "Tidak" },
                
            ]

            $scope.resumeOpt = {
                toolbar: [{
                    name: "create", text: "Tambah",
                    template: '<button ng-click="inputBaru()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah</button>'
                },],
                selectable: "row",
                pageable: true,
                scrollable: true,
                columns: [
                    // { field: "rowNumber", title: "#", width: 40, width: 40, attributes: { style: "text-align:right; padding-right: 15px;"}, hideMe: true},
                    { field: "no", title: "No", width: 40 },
                    { field: "namaobat", title: "Nama Obat", width: 200 },
                    { field: "jumlah", title: "Jumlah", width: 120 },
                    { field: "dosis", title: "Dosis", width: 120 },
                    { field: "frekuensi", title: "Frekuensi", width: 120 },
                    { field: "carapemberian", title: "Cara Pemberian", width: 150 },
                    { command: [{ imageClass: "k-icon k-delete", text: "Hapus", click: hapusData2 }, { name: "edit", text: "Edit", click: editData2 }], title: "&nbsp;", width: 120 }
                    // {command: [{name: "destroy", text: "Hapus"},{name: "edit", text: "Edit"}], title: "&nbsp;", width: 120 }
                ],

            };
            $scope.resumeOptHead = {
                // toolbar: [{
                //     name: "create", text: "Tambah",
                //     template: '<button ng-click="showInput()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah</button>'
                // },],
                selectable: "row",
                pageable: true,
                scrollable: true,
                columns: [
                    { field: "no", title: "No", width: 40 },
                    { field: "tglresume", title: "Tgl Resume", width: 150 },
                    { field: "koderesume", title: "Kode Resume", width: 150 },
                    { field: "noregistrasi", title: "No Registrasi", width: 150 },
                    { field: "namaruangan", title: "Ruangan", width: 150 },
                    { field: "namadokter", title: "Pegawai", width: 150 },
                    { field: "kddiagnosismasuk[1]", title: "Diagnosis Masuk", width: 150 },
                    { field: "kddiagnosisawal[1]", title: "Diagnosi Utama", width: 150, },
                    { field: "kddiagnosistambahanall", title: "Diagnosi Tambahan", width: 150, },
                    // { field: "tindakanprosedur", title: "Tindakan", width: 150 },
                    { field: "ringkasanriwayatpenyakit", title: "Kondisi Pasien Waktu Pulang	", width: 250 },
                    { field: "pemeriksaanfisik", title: "Pemerisaan Fisik", width: 250 },
                    { field: "terapi", title: "Terapi", width: 120 },
                    // { field: "hasilkonsultasi", title: "Hasil Konsultasi", width: 150 },
                    { field: "keadaankeluarj", title: "Kondisi Saat Pulang", width: 150 },
                    { field: "instruksianjuran", title: "Tindak Lanjut/Anjuran/Edukasi", width: 150 },
                    // { field: "pengobatandilanjutkan", title: "Pengobatan Lanjutan", width: 150 },
                    // { field: "tglkontrolpoli", title: "Tanggal Kontrol Poli", width: 150 },
                    // { field: "rumahsakittujuan", title: "Rumah Sakit", width: 150 },

                    // { command: [{ imageClass: "k-icon k-delete", text: "Hapus", click: hapusHead }, { name: "edit", text: "Edit", click: editHead }], title: "&nbsp;", width: 120 }
                ],

            };

            $scope.data2 = function (dataItem) {
                for (var i = 0; i < dataItem.details.length; i++) {
                    dataItem.details[i].no = i + 1
                }
                return {
                    dataSource: new kendo.data.DataSource({
                        data: dataItem.details,

                    }),
                    columns: [
                        { field: "no", title: "No", width: 40 },
                        { field: "namaobat", title: "Nama Obat", width: 200 },
                        { field: "jumlah", title: "Jumlah", width: 120 },
                        { field: "dosis", title: "Dosis", width: 120 },
                        { field: "frekuensi", title: "Frekuensi", width: 120 },
                        { field: "carapemberian", title: "Cara Pemberian", width: 150 },
                    ]
                }
            };
            $scope.inputBaru = function () {
                $scope.popUp.center().open()
            }
            $scope.batal = function () {
                $scope.popUp.close()
            }
            init();

            $scope.showInput = function () {
                
                $scope.isEdit = true
                $scope.isGrid = false
                $scope.item = {}
                data2 = []
                $scope.sourceResume = new kendo.data.DataSource({
                    data: data2
                });
                
                loadDataPemeriksaan();
            }

            function loadDataPemeriksaan() {
                medifirstService.get("emr/get-ringkasan-pulang21?noregistrasi=" + $scope.cc.noregistrasi).then(
                    function (dat) {
                    $scope.item.alasanDirawat = dat.data.data[0] != undefined ? dat.data.data[0].value : undefined
                    $scope.item.diagnosamasuktext = dat.data.data3[0] != undefined ? dat.data.data3[0].value : undefined
                    $scope.item.axis2 = dat.data.data3[1] != undefined ? dat.data.data3[1].value : undefined
                    $scope.item.axis3 = dat.data.data3[2] != undefined ? dat.data.data3[2].value : undefined
                    $scope.item.axis4 = dat.data.data3[3] != undefined ? dat.data.data3[3].value : undefined
                    $scope.item.axis5 = dat.data.data3[4] != undefined ? dat.data.data3[4].value : undefined
                    var a = ""
                    var b = ""
                    var ha = dat.data.data2
                    var psi = dat.data.data4
                    var td = "";
                    var nadi = "";
                    var suhu = "";
                    var res = "";
                    var sat = "";
                    var generalis = "";
                    var kesadaran = "";
                    var orientasi = "";
                    // $scope.item.hasilfisik= "Tekanan Darah : "+ ha[0]+ " "
                    for (var i = dat.data.data2.length - 1; i >= 0; i--) {
                        if(ha[i].id == 120113){
                            td = "Tekanan Darah : " + ha[i].value
                        }
                        if(ha[i].id== 120114){
                            nadi = "Nadi : " + ha[i].value
                        }
                        if(ha[i].id== 120115){
                            suhu = "Suhu : " + ha[i].value
                        }
                        if(ha[i].id== 120116){
                            res = "Respirasi : " + ha[i].value
                        }
                        if(ha[i].id== 120309){
                            sat = "Saturasi : " + ha[i].value
                        }
                        if(ha[i].id== 120117){
                            generalis = "Status Generalis dan Neurologis : " + ha[i].value
                        }
                    }
                    $scope.item.hasilfisik = td + "   "+ nadi + "   "+ suhu + "   "+ res + "   "+ sat + "\n"+ generalis
                    // $scope.item.hasilfisik = a.slice(1, a.length)
                    // console.log ($scope.item.alasanDirawat)
                   // $scope.item.hasilfisik = dat.data.data2[0].value, dat.data.data2[1].value,  dat.data.data2[2].value,  dat.data.data2[3].value,  dat.data.data2[4].value, dat.data.data2[5].value


                //Hasil Psikiatri
                var ksm = ""
                var aA = ""
                var bA = ""
                var kesadaranlain =""
                var orang = ""
                var tempat = ""
                var waktu = ""
                var situasi = ""
                var aD = ""
                var bD = ""
                var aD1 = ""
                var bD1 = ""
                var disaktif =""
                var hiperaktif = ""
                var disaktiflain =""
                var sikap = ""
                var sikaplain = ""
                var dbn =""
                var hipoaktif =""
                var aE = ""
                var bE = ""
                var bentukpikir = ""
                var isipikir =""
                var isipikirlain =""
                var aE1 = ""
                var bE1 = ""
                var aE2 = ""
                var bE2 = ""
                var aE3 = ""
                var bE3 = ""
                var kualitatif = ""
                var kuantitatif =""
                var kualitatiflain =""
                var kuantitatiflain =""
                var prosespikir =""
                var aF = ""
                var bF = ""
                var mood =""
                var moodlain =""
                var aG = ""
                var bG = ""
                var afek =""
                var afeklain =""
                var aH = ""
                var bH = ""
                var persepsi =""
                var persepsilain =""
                var aI = ""
                var bI = ""
                var memori =""
                var memorilain =""
                var aJ = ""
                var bJ = ""
                var Intelegensi =""
                var intelegensilain=""
                var aK = ""
                var bK = ""
                var hubungan=""
                var aL = ""
                var bL = ""
                var perhatian=""
                var aM = ""
                var bM = ""
                var insight =""
                   for (var i = dat.data.data4.length - 1; i >= 0; i--) {
                    //A. Kesan Umum
                    if(psi[i].id == 120118){
                        ksm = "A. Kesan Umum : " + psi[i].value
                    }
                    //B. Kesadaran
                    if(psi[i].id== 120120 || psi[i].id== 120121 || psi[i].id== 120122 || psi[i].id== 120123
                        || psi[i].id== 120124 || psi[i].id== 120125 || psi[i].id== 120126 ||psi[i].id== 120127
                        || psi[i].id== 120128 || psi[i].id== 120129 && psi[i].value==true){
                           
                                var cA = dat.data.data4[i].caption
                                bA = ", " + cA
                                aA  = aA + bA
                    }
                    if(psi[i].id== 120130){
                        kesadaranlain = "Lainnya : " + psi[i].value
                    }
                    
                    //C. Orientasi
                    if(psi[i].id== 120131){
                        orang = "Orang : " + psi[i].value + ","
                    }
                    if(psi[i].id== 120132){
                        tempat = "Tempat : " + psi[i].value + ","
                    }
                    if(psi[i].id== 120133){
                        waktu = "Waktu : " + psi[i].value + ","
                    }
                    if(psi[i].id== 120133){
                        situasi = "Situasi : " + psi[i].value+ ","
                    }

                    //D. Sikap Dan Tingkah Laku :
                    if(psi[i].id== 120135){
                        dbn = psi[i].caption+ ","
                    }
                    if(psi[i].id== 120136){
                        hipoaktif =  psi[i].caption+ ","
                    }
                    //Disaktif
                    if(psi[i].id== 120137 && psi[i].value==true){
                        if(psi[i].id== 120138 || psi[i].id== 120139 || psi[i].id== 120140 || psi[i].id== 120141 ||psi[i].id== 120142
                            || psi[i].id== 120143 || psi[i].id== 120144 ||  psi[i].id== 120145 || psi[i].id== 120146 || psi[i].id== 120147
                            && psi[i].value==true){
                        
                                var cD = dat.data.data4[i].caption
                                bD = ", " + cD
                                aD  = aD + bD

                        }
                     }
                     if(psi[i].id== 120148){
                        disaktiflain = "Lainnya : " + psi[i].value
                    }
                     //Hiperaktif
                     if(psi[i].id== 120149 && psi[i].value==true){
                        if(psi[i].id== 120150 || psi[i].id== 120151 || psi[i].id== 120152 && psi[i].value==true){
                        
                                var cD1 = dat.data.data4[i].caption
                                bD1 = ", " + cD1
                                aD1  = aD1 + bD1

                        }
                     }

                    if(psi[i].id== 120153){
                        sikaplain = "Lainnya : " + psi[i].value
                    }

                      //E. Proses Pikir :
                      //Bentuk Pikir
                      if(psi[i].id== 120155 || psi[i].id== 120156 || psi[i].id== 120157 || psi[i].id== 120158
                        || psi[i].id== 120159 || psi[i].id== 120160 && psi[i].value==true){
                           
                                var cE = dat.data.data4[i].caption
                                bE = ", " + cE
                                aE  = aE + bE
                         }

                    //Isi Pikir
                    if(psi[i].id== 120162 || psi[i].id== 120163 || psi[i].id== 120164 || psi[i].id== 120165
                        || psi[i].id== 120166 || psi[i].id== 120167 || psi[i].id== 120168 ||psi[i].id== 120169
                        || psi[i].id== 120170 || psi[i].id== 120171  || psi[i].id== 120172 || psi[i].id== 120173 || psi[i].id== 120174 ||psi[i].id== 120175
                        || psi[i].id== 120176 || psi[i].id== 120177 || psi[i].id== 120178 ||psi[i].id== 120179
                         && psi[i].value==true){
                           
                                var cE1 = dat.data.data4[i].caption
                                bE1 = ", " + cE1
                                aE1  = aE1 + bE1
                         }
                    if(psi[i].id== 120180){
                        isipikirlain = "Lainnya : " + psi[i].value
                    }
                    //Progresi fikir Kualitatif
                    if(psi[i].id== 120182 || psi[i].id== 120183 || psi[i].id== 120184 || psi[i].id== 120185
                        || psi[i].id== 120186 || psi[i].id== 120187 || psi[i].id== 120188 ||psi[i].id== 120189
                        || psi[i].id== 120190 || psi[i].id== 120191  || psi[i].id== 120192 || psi[i].id== 120193 || psi[i].id== 120194 
                         && psi[i].value==true){
                           
                                var cE2 = dat.data.data4[i].caption
                                bE2 = ", " + cE2
                                aE2  = aE2 + bE2
                         }
                         if(psi[i].id== 120195){
                            kualitatiflain = "Lainnya : " + psi[i].value
                        }

                          //Progresi fikir Kuantitatif
                          if(psi[i].id== 120197 || psi[i].id== 120198 || psi[i].id== 120199 || psi[i].id== 120200
                            || psi[i].id== 120233
                             && psi[i].value==true){
                               
                                    var cE3 = dat.data.data4[i].caption
                                    bE3 = ", " + cE3
                                    aE3  = aE3 + bE3
                             }
                             if(psi[i].id== 120234){
                                kuantitatiflain = "Lainnya : " + psi[i].value
                            }

                            //F. Mood
                            if(psi[i].id== 120201 || psi[i].id== 120202 || psi[i].id== 120203 || psi[i].id== 120204
                                || psi[i].id== 120205
                                && psi[i].value==true){
                                
                                        var cF = dat.data.data4[i].caption
                                        bF = ", " + cF
                                        aF  = aF + bF
                                }
                                if(psi[i].id== 120206){
                                    moodlain = "Lainnya : " + psi[i].value
                                }

                            //G. Afek
                            if(psi[i].id== 120207 || psi[i].id== 120208 || psi[i].id== 120209 || psi[i].id== 120210
                                || psi[i].id== 120211 || psi[i].id== 120212 || psi[i].id== 120213 || psi[i].id== 120214
                                || psi[i].id== 120215 || psi[i].id== 120216 || psi[i].id== 120217 || psi[i].id== 120218
                                || psi[i].id== 120219 || psi[i].id== 120220 || psi[i].id== 120221 || psi[i].id== 120222
                                && psi[i].value==true){
                                
                                        var cG = dat.data.data4[i].caption
                                        bG = ", " + cG
                                        aG  = aG + bG
                                }
                                if(psi[i].id== 120223){
                                    afeklain = "Lainnya : " + psi[i].value
                                }

                            //H. Gangguan Persepsi
                            if(psi[i].id== 120224 || psi[i].id== 120225 || psi[i].id== 120226 || psi[i].id== 120227
                                || psi[i].id== 120228 || psi[i].id== 120229 || psi[i].id== 120230
                                && psi[i].value==true){
                                
                                        var cH = dat.data.data4[i].caption
                                        bH = ", " + cH
                                        aH  = aH + bH
                                }
                                if(psi[i].id== 120232){
                                    persepsilain = "Lainnya : " + psi[i].value
                                }

                                  //I. Gangguan Memori
                            if(psi[i].id== 119998 || psi[i].id== 120236
                                && psi[i].value==true){
                                
                                        var cI = dat.data.data4[i].caption
                                        bI = ", " + cI
                                        aI  = aI + bI
                                }
                                if(psi[i].id== 120235){
                                    memorilain = "Lainnya : " + psi[i].value
                                }

                                 //J. Gangguan Intelegensi 
                            if(psi[i].id== 119999 || psi[i].id== 120238
                                && psi[i].value==true){
                                
                                        var cJ = dat.data.data4[i].caption
                                        bJ = ", " + cJ
                                        aJ  = aJ + bJ
                                }
                                if(psi[i].id== 120237){
                                    intelegensilain = "Lainnya : " + psi[i].value
                                }

                                  //K. Hubungan Jiwa
                            if(psi[i].id== 120239 || psi[i].id== 120240
                                && psi[i].value==true){
                                
                                        var cK = dat.data.data4[i].caption
                                        bK = ", " + cK
                                        aK  = aK + bK
                                }

                                //L. Perhatian :
                            if(psi[i].id== 120241 || psi[i].id== 120242 || psi[i].id== 120243 || psi[i].id== 120244
                                && psi[i].value==true){
                                
                                        var cL = dat.data.data4[i].caption
                                        bL = ", " + cL
                                        aL  = aL + bL
                                }
                                
                                
                                 //M. Insight :
                            if(psi[i].id== 120245 || psi[i].id== 120246 || psi[i].id== 120247 || psi[i].id== 120248
                                || psi[i].id== 120249 || psi[i].id== 120250 || psi[i].id== 120251 || psi[i].id== 120252
                                || psi[i].id== 120253
                                && psi[i].value==true){
                                
                                        var cM = dat.data.data4[i].caption
                                        bM = ", " + cM
                                        aM  = aM + bM
                                }
                    
                }
                kesadaran = "B. Kesadaran Kualitatif : " + aA.slice(1, aA.length) + kesadaranlain
                orientasi = "C. Orientasi : " + orang + tempat + waktu + situasi
                disaktif = "Disaktif : "  + aD.slice(1, aD.length)
                hiperaktif = "Hiperaktif : " +  aD1.slice(1, aD1.length)
                sikap = "D. Sikap Dan Tingkah Laku : " + dbn + hipoaktif +  + disaktiflain  + sikaplain
                bentukpikir = "Bentuk Pikir : "  + aE.slice(1, aE.length)
                isipikir = "Isi Pikir : " + aE1.slice(1, aE1.length) + isipikirlain
                kualitatif = "Kualitatif :" + aE2.slice(1, aE2.length) + kualitatiflain
                kuantitatif = "Kuantitatif :" + aE3.slice(1, aE3.length) + kuantitatiflain
                prosespikir = "E. Proses pikir" + isipikir + bentukpikir + kualitatif + kuantitatif
                mood = "F. Mood : " + aF.slice(1, aF.length) + moodlain
                afek = "G. Afek :" + aG.slice(1, aG.length) + afeklain
                persepsi = "H. Persepsi :" + aH.slice(1, aH.length) + persepsilain
                memori = "I. Gangguan Memori : " + aI.slice(1, aI.length) + memorilain
                Intelegensi ="J. Gangguan Intelegensi :" + aJ.slice(1, aJ.length)+ intelegensilain
                hubungan = "K. Hubungan Jiwa : "  + aK.slice(1, aK.length)
                perhatian = "L. Perhatian : "  + aL.slice(1, aL.length)
                insight ="M. Insight : " +  aM.slice(1, aM.length)



                $scope.item.hasilpsikiatri = ksm + "\n"+ kesadaran + "\n"+ orientasi + "\n"+ sikap + "\n"+ prosespikir + "\n"+ mood +
                "\n"+ afek + "\n"+ persepsi +"\n"+ memori + "\n"+ Intelegensi + "\n"+ perhatian +"\n"+ insight 


                var lab = ''
                var aaaa = ''
                var bbbb = ''
                for (let i = 0; i < dat.data.data5lab.length; i++) {
                    const element = dat.data.data5lab[i];
                    var cccc = 'Tgl: '+element.tglpelayanan + ". Detail Pemeriksaan: " + element.detailpemeriksaan + ". Hasil: " + element.hasil
                    bbbb = "\n" + cccc
                    aaaa = aaaa + bbbb
                }
                var aaaaa = ''
                var bbbbb = ''
                var wkwkw = ''
                for (let i = 0; i < dat.data.data5rad.length; i++) {
                    const element = dat.data.data5rad[i];
                    wkwkw = element.keterangan.split("Kesan")
                    console.log(wkwkw);
                    var ccccc = "Kesan: " + wkwkw[1].replace(/~/ig, "\n")
                    bbbbb = "\n" + ccccc
                    aaaaa = aaaaa + bbbbb
                }


                $scope.item.hasilpenunjang = 'Hasil Laboratorium\n' + aaaa.slice(1, aaaa.length) + '\n\nHasil Radiologi\n' + aaaaa
                var nonracika = ''
                var nonracikb = ''
                var racika = ''
                var racikb = ''
                var racikd = ''
                var racikccccc = ''
                var arrracik = []
                for (let i = 0; i < dat.data.dataresep.length; i++) {
                    const element = dat.data.dataresep[i];
                    if(element.jeniskemasanfk == 2){
                        var nonracikc = element.namaproduk + " " + element.dosis + "" + element.satuandosis + " " + element.jenisracikan+" "+element.keteranganpakai
                        nonracikb = "\n"+nonracikc
                        nonracika = nonracika+ nonracikb
                    }
                    if(element.jeniskemasanfk == 1){
                        var racikc = element.namaproduk 
                        racikb = "+" + racikc
                        var racikd = ''
                        racika = racika + racikb
                        if(element.nomor == 1){
                            racikd = element.dosis + element.satuandosis + " " + element.jenisracikan + " " + element.keteranganpakai
                            racika = racika.slice(1, racika.length)+' '+racikd
                            arrracik.push(racika)
                            racika = ''
                            racikd = ''
                        }

                    }

                }
                console.log(arrracik);
                var aha = ''
                aha = nonracika != '' ? 'Non Racikan:\n' + nonracika.slice(1, nonracika.length) : ''
                var aja = ''
                aja = arrracik.length == 0 ? '' : "\nRacikan:\n" + arrracik.join('\n')
                $scope.item.terapipulang = aha + aja
                
                for (let i = 0; i < dat.data.datasoap.length; i++) {
                    const element = dat.data.datasoap[i];
                    const matchA = element.soap.match(/\nA\s[:;]\s*(.*)/);
                    console.log(matchA);
                    if (matchA) {
                        const dataA = matchA[1].trim();
                        console.log(dataA); // Output: F25.0
                        $scope.item.diagnosautamatext = dataA
                    } else {
                        console.log("Data A tidak ditemukan.");
                    }
                }
                for (let i = 0; i < dat.data.pasiendaftar.length; i++) {
                    const element = dat.data.pasiendaftar[i];
                    $scope.item.tglmasuk = element.tglregistrasi
                    $scope.item.tglpulang = element.tglpulang
                    $scope.item.kelas = element.namakelas
                    $scope.item.wisma = element.namaruangan
                }
            })
                medifirstService.get("emr/get-data-perawatan?norec_apd=" + $scope.norecAPD).then(function (data) {                 
                    var datas = data.data;                   
                    if (datas.diagnosaawal.length > 0) {
                        for (let i = 0; i < datas.diagnosaawal.length; i++) {
                            const element = datas.diagnosaawal[i];
                            if (element != undefined) {
                                $scope.item.diagnosamasuktext = element.kodenama;
                                break;                                                         
                            }
                        }
                    }
                
                    if (datas.pemeriksaan != undefined) {
                        $scope.item.riwayatPenyakit = datas.pemeriksaan.value
                    }
                                  
                })
            }
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
                
            }
            

            

            function loadisiDiagnosa() {
                medifirstService.getPart("emr/get-combo-icd10", true, true, 10).then(function (data) {
                    $scope.listDiagnosa = data;
                })
            }

            $scope.Back = function () {
                $scope.isEdit = false
                $scope.isGrid = true
            }

            function hapusData2(e) {
                e.preventDefault();
                var grid = this
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                if (!dataItem) {
                    toastr.error("Data Tidak Ditemukan");
                    return
                }
                for (var i = data2.length - 1; i >= 0; i--) {
                    if (data2[i].no == dataItem.no) {
                        data2.splice(i, 1);
                    }
                }
                grid.removeRow(dataItem);

            }
 
            $scope.editGrid = function () {
                $scope.item.norec = $scope.modelGrid.norec
                $scope.item.pasien = $scope.modelGrid.pasien

                $scope.item.diagnosamasuktext = $scope.modelGrid.diagnosismasuk
                $scope.item.diagnosamasuk = $scope.modelGrid.kddiagnosismasuk[0] == null ? '' : {
                    id: $scope.modelGrid.kddiagnosismasuk[0],
                    kodeNama: $scope.modelGrid.kddiagnosismasuk[1] + ' - ' + $scope.modelGrid.kddiagnosismasuk[2]
                }
                $scope.item.diagnosautamatext = $scope.modelGrid.diagnosisawal
                $scope.item.diagnosautama = $scope.modelGrid.kddiagnosisawal[0] == null ? '' : {
                    id: $scope.modelGrid.kddiagnosisawal[0],
                    kodeNama: $scope.modelGrid.kddiagnosisawal[1] + ' - ' + $scope.modelGrid.kddiagnosisawal[2]
                }
                $scope.item.diagnosatambahantext = $scope.modelGrid.diagnosistambahan
                $scope.item.diagnosatambahan = $scope.modelGrid.kddiagnosistambahan[0] == null ? '' : {
                    id: $scope.modelGrid.kddiagnosistambahan[0],
                    kodeNama: $scope.modelGrid.kddiagnosistambahan[1] + ' - ' + $scope.modelGrid.kddiagnosistambahan[2]
                }
                $scope.item.diagnosatambahantex2 = $scope.modelGrid.diagnosistambahan2
                $scope.item.diagnosatambahan2 = $scope.modelGrid.kddiagnosistambahan2[0] == null ? '' : {
                    id: $scope.modelGrid.kddiagnosistambahan2[0],
                    kodeNama: $scope.modelGrid.kddiagnosistambahan2[1] + ' - ' + $scope.modelGrid.kddiagnosistambahan2[2]
                }
                $scope.item.diagnosatambahantex3 = $scope.modelGrid.diagnosistambahan3
                $scope.item.diagnosatambahan3 = $scope.modelGrid.kddiagnosistambahan3[0] == null ? '' : {
                    id: $scope.modelGrid.kddiagnosistambahan3[0],
                    kodeNama: $scope.modelGrid.kddiagnosistambahan3[1] + ' - ' + $scope.modelGrid.kddiagnosistambahan3[1]
                }
                $scope.item.diagnosatambahantex4 = $scope.modelGrid.diagnosistambahan4
                $scope.item.diagnosatambahan4 = $scope.modelGrid.kddiagnosistambahan4[0] == null ? '' : {
                    id: $scope.modelGrid.kddiagnosistambahan4[0],
                    kodeNama: $scope.modelGrid.kddiagnosistambahan4[1] + ' - ' + $scope.modelGrid.kddiagnosistambahan4[2]
                }
                $scope.item.tglmasuk = $scope.modelGrid.tglmasuk
                $scope.item.tglpulang = $scope.modelGrid.tglpulang
                $scope.item.wisma = $scope.modelGrid.wisma
                $scope.item.kelas = $scope.modelGrid.kelas
                $scope.item.hasilfisik = $scope.modelGrid.hasilfisik
                $scope.item.indikasi = $scope.modelGrid.indikasi
                $scope.item.hasilpsikiatri = $scope.modelGrid.hasilpsikiatri
                $scope.item.hasilpenunjang = $scope.modelGrid.hasilpenunjang
                $scope.item.terapipulang = $scope.modelGrid.terapipulang
                $scope.item.axis2 = $scope.modelGrid.axis2
                $scope.item.axis3 = $scope.modelGrid.axis3
                $scope.item.axis4 = $scope.modelGrid.axis4
                $scope.item.axis5 = $scope.modelGrid.axis5
                $scope.item.kontrolklinik = $scope.modelGrid.kontrolklinik
                $scope.item.kondisiwaktukeluare = $scope.modelGrid.kondisiwaktukeluare
                $scope.item.alasanDirawat = $scope.modelGrid.alasandirawat
                $scope.item.riwayatPenyakit = $scope.modelGrid.ringkasanriwayatpenyakit
                $scope.item.pemeriksaanfisik = $scope.modelGrid.pemeriksaanfisik
                $scope.item.terapi = $scope.modelGrid.terapi
                $scope.item.hasilKonsultasi = $scope.modelGrid.hasilkonsultasi
                $scope.item.kondisi = $scope.modelGrid.kondisiwaktukeluar
                $scope.item.TerapiTindakan = $scope.modelGrid.instruksianjuran
                $scope.item.pengobatan = $scope.modelGrid.pengobatandilanjutkan
                $scope.item.tglkontrolpoli = $scope.modelGrid.tglkontrolpoli
                $scope.item.rumahsakittujuan = $scope.modelGrid.rumahsakittujuan
                $scope.item.edukasipulang = $scope.modelGrid.edukasi
                $scope.item.RiwayatKesehatan = $scope.modelGrid.riwayatlalu
                $scope.item.Lainlain = $scope.modelGrid.lainlain
                $scope.item.Rujuk = $scope.modelGrid.rujuk
                $scope.item.alergi = $scope.modelGrid.alergi
                var rdAlergi
                if($scope.modelGrid.ralergi == "1"){
                    rdAlergi = document.getElementById("rdYa");
                    rdAlergi.checked = true;
                }
                if($scope.modelGrid.ralergi == "2"){
                    rdAlergi = document.getElementById("rdTidak");
                    rdAlergi.checked = true;
                }

                var rdKeadaan
                if($scope.modelGrid.rkeadaankeluar == "1"){
                    rdKeadaan = document.getElementById("rdPer");
                    rdKeadaan.checked = true;
                }
                if($scope.modelGrid.rkeadaankeluar == "2"){
                    rdKeadaan = document.getElementById("rdSembuh");
                    rdKeadaan.checked = true;
                }
                if($scope.modelGrid.rkeadaankeluar == "3"){
                    rdKeadaan = document.getElementById("rdPulang");
                    rdKeadaan.checked = true;
                }

                var rdCaraKeluar
                if($scope.modelGrid.rcarapulang == "1"){
                    rdCaraKeluar = document.getElementById("rdAPD");
                    rdCaraKeluar.checked = true;
                }
                if($scope.modelGrid.rcarapulang == "2"){
                    rdCaraKeluar = document.getElementById("rdRujuk");
                    rdCaraKeluar.checked = true;
                }
                if($scope.modelGrid.rcarapulang == "3"){
                    rdCaraKeluar = document.getElementById("rdAPS");
                    rdCaraKeluar.checked = true;
                }
                if($scope.modelGrid.rcarapulang == "4"){
                    rdCaraKeluar = document.getElementById("rdLain");
                    rdCaraKeluar.checked = true;
                }
               
                $scope.norecAPD = $scope.modelGrid.noregistrasifk
                data2 = $scope.modelGrid.details
                for (let index = 0; index < data2.length; index++) {
                    data2[index].no = index + 1;
                }
                $scope.sourceResume = new kendo.data.DataSource({
                    data: data2
                });
                $scope.isGrid = false
                $scope.isEdit = true
            }
           
            function editData2(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                if (!dataItem) {
                    toastr.error("Data Tidak Ditemukan");
                    return
                }
                $scope.item.no = dataItem.no
                $scope.item.namaobat = dataItem.namaobat
                $scope.item.jumlah = dataItem.jumlah
                $scope.item.dosis = dataItem.dosis
                $scope.item.frekuensi = dataItem.frekuensi
                $scope.item.carapemberian = dataItem.carapemberian

                $scope.popUp.center().open()

            }
            function init() {
                $scope.isRouteLoading = true;
                medifirstService.get("emr/get-combo").then(function (e) {
                    $scope.listDokter = e.data.dokter
                })
                medifirstService.getPart("emr/get-combo-icd10", true, true, 10).then(function (data) {
                    $scope.listDiagnosa = data;
                })

                $q.all([
                    medifirstService.get("emr/get-resume-medis-inap-nonjiwa/" + $scope.nocm )
                ]).then(function (res) {
                    if (res[0].statResponse) {
                        var result = res[0].data.data
                        if (result.length > 0) {
                            for (let index = 0; index < result.length; index++) {
                                result[index].no = index + 1
                            }
                        }

                        $scope.sourceResumeHead = new kendo.data.DataSource({
                            data: result,
                            pageSize: 20,

                        });
                    }

                    $scope.isRouteLoading = false;
                }, (error) => {
                    $scope.isRouteLoading = false;
                    throw error;
                })
            };

            $scope.Save = function (data) {
                var nilaiAlergi = "";
                var opsiAlergi = document.querySelectorAll('input[name="Alergi"]');

                for (var i = 0; i < opsiAlergi.length; i++) {
                    if (opsiAlergi[i].checked) {
                        nilaiAlergi = opsiAlergi[i].value;
                        break; // Keluar dari loop saat menemukan radio button yang terpilih
                    }
                }
                var nilaiKeadaan = "";
                var opsiKeadaan = document.querySelectorAll('input[name="keadaanKeluar"]');

                for (var i = 0; i < opsiKeadaan.length; i++) {
                    if (opsiKeadaan[i].checked) {
                        nilaiKeadaan = opsiKeadaan[i].value;
                        break; // Keluar dari loop saat menemukan radio button yang terpilih
                    }
                }
                var nilaiCaraKeluar = "";
                var opsiCaraKeluar = document.querySelectorAll('input[name="CaraKeluar"]');

                for (var i = 0; i < opsiCaraKeluar.length; i++) {
                    if (opsiCaraKeluar[i].checked) {
                        nilaiCaraKeluar = opsiCaraKeluar[i].value;
                        break; // Keluar dari loop saat menemukan radio button yang terpilih
                    }
                }
                var item = {
                    "norec": $scope.item.norec != undefined ? $scope.item.norec : "",
                    "tglmasuk":$scope.item.tglmasuk != undefined ? $scope.item.tglmasuk :"",
                    "tglpulang":$scope.item.tglpulang != undefined ? $scope.item.tglpulang :"",
                    "wisma":$scope.item.wisma != undefined ? $scope.item.wisma :"",
                    "kelas":$scope.item.kelas != undefined ? $scope.item.kelas :"",
                    "indikasi": $scope.item.indikasi != undefined ? $scope.item.indikasi : "",
                    "diagnosismasuk": $scope.item.diagnosamasuktext != undefined ? $scope.item.diagnosamasuktext : "",
                    "kddiagnosismasuk": $scope.item.diagnosamasuk != undefined ? $scope.item.diagnosamasuk.id : "",
                    "pemeriksaanfisik": $scope.item.pemeriksaanfisik != undefined ? $scope.item.pemeriksaanfisik : "", 
                    "riwayatlalu": $scope.item.RiwayatKesehatan != undefined ? $scope.item.RiwayatKesehatan : "",
                    "ralergi":nilaiAlergi ,
                    "alergi": $scope.item.alergi != undefined ? $scope.item.alergi : "",
                    "hasilpenunjang": $scope.item.hasilpenunjang != undefined ? $scope.item.hasilpenunjang : "",
                    "diagnosisutama": $scope.item.diagnosautamatext != undefined ? $scope.item.diagnosautamatext : "",
                    "kddiagnosisutama": $scope.item.diagnosautama != undefined ? $scope.item.diagnosautama.id : "",
                    "axis2": $scope.item.axis2 != undefined ? $scope.item.axis2 : "",
                    "kddiagnosistambahan": $scope.item.diagnosatambahan != undefined ? $scope.item.diagnosatambahan.id : null,
                    "instruksianjuran": $scope.item.TerapiTindakan != undefined ? $scope.item.TerapiTindakan : null,
                    "terapi": $scope.item.terapi != undefined ? $scope.item.terapi : null,
                    "terapipulang": $scope.item.terapipulang != undefined ? $scope.item.terapipulang : null,
                    "edukasi": $scope.item.edukasipulang != undefined ? $scope.item.edukasipulang : null,
                    "ringkasanriwayatpenyakit": $scope.item.riwayatPenyakit != undefined ? $scope.item.riwayatPenyakit : "",
                    "rkeadaankeluar":nilaiKeadaan ,
                    "rcarapulang":nilaiCaraKeluar ,
                    "rujuk": $scope.item.Rujuk != undefined ? $scope.item.Rujuk : "",
                    "lainlain": $scope.item.Lainlain != undefined ? $scope.item.Lainlain : "",
                    "keteranganringkasanpulang": 'Non Jiwa',
                    "noregistrasifk": $scope.norecAPD,
                    "pasien": $scope.item.pasien!= undefined ? $scope.item.pasien : '',
 
                  
                    "detail": data2
                }

                medifirstService.post('emr/post-resume-medis-inap/save', item).then(function (e) {
                    // delete $scope.item;
                    clear()
                    init();
                    medifirstService.postLogging('Resume Medis', 'Norec resumemedis_t', e.data.resume.norec, 'Resume RI').then(function (res) {
                    })
                });
            };
            function clear() {
                $scope.item = {}

            }
            $scope.hapusGrid = function () {
                var item = {
                    "norec": $scope.modelGrid.norec
                }
                medifirstService.post('emr/post-resume-medis-inap/delete', item).then(function (e) {
                    clear()
                    init();
                });
            }
            function categoryDropDownEditor(container, options) {
                $('<input required name="' + options.field + '"/>')
                    .appendTo(container)
                    .kendoDropDownList({
                        dataTextField: "jenisJabatan",
                        dataValueField: "id",
                        dataSource: $scope.listJenisJabatan
                    });
            }
            var timeoutPromise;
            $scope.$watch('item.filterRiwayat', function (newVal, oldVal) {
                if (newVal != oldVal) {
                    applyFilter("ringkasanriwayatpenyakit", newVal)
                }
            })
            $scope.$watch('item.filterPemeriksaanfisik', function (newVal, oldVal) {
                $timeout.cancel(timeoutPromise);
                timeoutPromise = $timeout(function () {
                    if (newVal != oldVal) {
                        applyFilter("pemeriksaanfisik", newVal)
                    }
                }, 500)
            })
            $scope.$watch('item.filterPemeriksaanPenunjang', function (newVal, oldVal) {
                $timeout.cancel(timeoutPromise);
                timeoutPromise = $timeout(function () {
                    if (newVal != oldVal) {
                        applyFilter("pemeriksaanpenunjang", newVal)
                    }
                }, 500)
            })

            function applyFilter(filterField, filterValue) {
                var dataGrid = $("#gridResumeHead").data("kendoGrid");
                var currFilterObject = dataGrid.dataSource.filter();
                var currentFilters = currFilterObject ? currFilterObject.filters : [];

                if (currentFilters && currentFilters.length > 0) {
                    for (var i = 0; i < currentFilters.length; i++) {
                        if (currentFilters[i].field == filterField) {
                            currentFilters.splice(i, 1);
                            break;
                        }
                    }
                }

                if (filterValue.id) {
                    currentFilters.push({
                        field: filterField,
                        operator: "eq",
                        value: filterValue.id
                    });
                } else {
                    currentFilters.push({
                        field: filterField,
                        operator: "contains",
                        value: filterValue
                    })
                }

                dataGrid.dataSource.filter({
                    logic: "and",
                    filters: currentFilters
                })
            }
            $scope.resetFilter = function () {
                var dataGrid = $("#gridResume").data("kendoGrid");
                dataGrid.dataSource.filter({});
                delete $scope.item.filterRiwayat
                delete $scope.item.filterPemeriksaanfisik
                delete $scope.item.filterPemeriksaanPenunjang
            }

            $scope.cetak = function () {
                if ($scope.modelGrid == undefined) {
                    toastr.error('Pilih data dulu')
                    return
                }
                if (confirm('View Resume? ')) {
                    var stt = 'true';
                } else {
                    var stt = 'false'
                }
                // Do nothing!
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/rekammedis?cetak-resume-ri=' + $scope.nocm
                    + '&noRec=' + $scope.modelGrid.norec
                    + '&noReg=' + $scope.norecAPD
                    + '&view=' + stt
                    , function (response) {
                    });
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
            $scope.Tambah = function () {
                var nomor = 0
                if ($scope.sourceResume == undefined) {
                    nomor = 1
                } else {
                    nomor = data2.length + 1
                }
                var data = {};
                if ($scope.item.no != undefined) {
                    for (var i = data2.length - 1; i >= 0; i--) {
                        if (data2[i].no == $scope.item.no) {
                            data.no = $scope.item.no
                            data.namaobat = $scope.item.namaobat
                            data.jumlah = $scope.item.jumlah
                            data.dosis = $scope.item.dosis
                            data.frekuensi = $scope.item.frekuensi
                            data.carapemberian = $scope.item.carapemberian

                            data2[i] = data;
                            $scope.sourceResume = new kendo.data.DataSource({
                                data: data2
                            });
                        }
                    }
                } else {
                    data = {
                        no: nomor,
                        namaobat: $scope.item.namaobat,
                        jumlah: $scope.item.jumlah,
                        dosis: $scope.item.dosis,
                        frekuensi: $scope.item.frekuensi,
                        carapemberian: $scope.item.carapemberian,
                    }
                    data2.push(data)
                    $scope.sourceResume = new kendo.data.DataSource({
                        data: data2
                    });

                }
                kosongkan()
            }
            function kosongkan() {
                delete $scope.item.no
                delete $scope.item.namaobat
                delete $scope.item.jumlah
                delete $scope.item.dosis
                delete $scope.item.frekuensi
                delete $scope.item.carapemberian
            }
            $scope.cetakBlade = function () {
                if ($scope.modelGrid == undefined) {
                    toastr.error('Pilih data dulu')
                    return
                }
                var local = JSON.parse(localStorage.getItem('profile'))
                var nama = medifirstService.getPegawaiLogin().namaLengkap

                window.open(config.baseApiBackend + "report/cetak-resume-medis?norec="
                    + $scope.modelGrid.norec + '&kdprofile=' + local.id
                    + '&nama=' + nama, '_blank');
            }
            $scope.cetakBladeV2 = function(){
                if ($scope.modelGrid == undefined) {
                    toastr.error('Pilih data dulu')
                    return
                }
                var local = JSON.parse(localStorage.getItem('profile'))
                var nama = medifirstService.getPegawaiLogin().namaLengkap

                window.open(config.baseApiBackend + "report/cetak-resume-medis-v2?norec=" +
                    $scope.modelGrid.norec + '&kdprofile=' + local.id +
                    '&nama=' + nama, '_blank');
            }
            $scope.cetakBladeV3 = function(){
                if ($scope.modelGrid == undefined) {
                    toastr.error('Pilih data dulu')
                    return
                }
                var local = JSON.parse(localStorage.getItem('profile'))
                var nama = medifirstService.getPegawaiLogin().namaLengkap

                window.open(config.baseApiBackend + "report/cetak-resume-medis-v3?norec=" +
                    $scope.modelGrid.norec + '&kdprofile=' + local.id +
                    '&nama=' + nama, '_blank');
            }
            $scope.ttdElek = function () {
                if ($scope.modelGrid == undefined) {
                    toastr.error('Pilih data dulu')
                    return
                }

                // var confirm = $mdDialog.confirm()
                //   .title('Info')
                //   .textContent('Yakin mau tanda tangani dokumen ini ? ')
                //   .ariaLabel('Lucky day')
                //   .cancel('Tidak')
                //   .ok('Ya')
                // $mdDialog.show(confirm).then(function () {
                $scope.winDialog.center().open()
                // })
            }
            $scope.savePengajuanTTE = function (pegawai) {
                if (pegawai == undefined) {
                    return
                }
                var local = JSON.parse(localStorage.getItem('profile'))
                var nama = medifirstService.getPegawaiLogin().namaLengkap
                $scope.isRouteLoading = true
                medifirstService.get('report/cetak-resume-medis-v3?norec=' + $scope.modelGrid.norec +
                    '&isttd=true'+'&kdprofile=' + local.id +
                        '&nama=' + nama + "&emrfk=" + 21081 + "&pegawaittd=" + pegawai.id+
                        '&noregistrasi=' + $scope.cc.noregistrasi+
                        '&nocm=' + $scope.cc.nocm + '&norec_pd=' + $scope.cc.norec_pd

                ).then(function (e) {
                    console.log(e);
                    if (e.data.status == 201) {
                        toastr.success(e.data.message)
                        $scope.winDialog.close()
                    } else {
                        toastr.error(e.data.message)
                    }
                    $scope.isRouteLoading = false

                })
            }

        }
    ]);
});