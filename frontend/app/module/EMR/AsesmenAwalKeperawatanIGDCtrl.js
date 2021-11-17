define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('AsesmenAwalKeperawatanIGDCtrl', ['$q', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($q, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, medifirstService) {


            $scope.noCM = $state.params.noCM;
            $scope.tombolSimpanVis = true
            $scope.noRecPap = cacheHelper.get('noRecPap');
            $scope.totalSkor = 0
            $scope.totalSkor2 = 0
            $scope.SkorSkalaFlacc = [];
            $scope.SkorJatuhAnak = [];
            $scope.cc = {}
            var nomorEMR = '-'
            $scope.cc.emrfk = 149
            var dataLoad = []
            var pegawaiInputDetail= ''
            $scope.isCetak = true
            var norecEMR = ''
            var cacheNomorEMR = cacheHelper.get('cacheNomorEMR');
            var cacheNoREC = cacheHelper.get('cacheNOREC_EMR');
            if(cacheNoREC!= undefined){
                norecEMR = cacheNomorEMR[1]
            }
            if (cacheNomorEMR != undefined) {
                nomorEMR = cacheNomorEMR[0]
                norecEMR = cacheNomorEMR[1]
                $scope.cc.norec_emr = nomorEMR
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
            $scope.cetakPdf = function () {
                if (norecEMR == '') return
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/e-rekammedis?cetak-emr-asesmen-awal-keperawatan-igd&id=' + $scope.cc.nocm + '&emr=' + norecEMR + '&view=true', function (response) {
                    // do something with response
                });
            }
            medifirstService.getPart('emr/get-datacombo-part-pegawai', true, true, 20).then(function (data) {
                $scope.listPegawai = data
             })
            medifirstService.getPart('emr/get-datacombo-diagnosa-jiwa', true, true, 20).then(function (data) {
                $scope.listDiagnosa = data
             })
             medifirstService.getPart('emr/get-datacombo-part-ruangan-pelayanan', true, true, 20).then(function (data) {
                $scope.listRuang = data
             })
            $scope.listHendaya = [
                { id: 5006, nama: 'Tuna Rungu' },
                { id: 5007, nama: 'Tuna Wicara' },
                { id: 5008, nama: 'Tuna Netra' },
                { id: 5009, nama: 'Lainnya :' }
            ]
            $scope.listADL = [
                { id: 5011, nama: 'Mandiri' },
                { id: 5012, nama: 'Perlu Bantuan' },
                { id: 5013, nama: 'Bantuan Total' },

            ]
            $scope.listKeluhanFisik = [
                { id: 5014, nama: 'Tidak Ada' },
                { id: 5015, nama: 'Ada, jelaskan :' },
            ]

            $scope.listvital = [
                {
                    "id": 1, "nama": "Tanda Vital",
                    "detail": [
                        { "id": 21003026, "nama": "Tekanan Darah", "type": "textbox" ,"satuan":"mmHg" },
                        { "id": 21003027, "nama": "Nadi", "type": "textbox" ,"satuan":"x/min" },
                        { "id": 21003028, "nama": "Rr", "type": "textbox" ,"satuan":"x/min" },
                        { "id": 21003029, "nama": "Suhu", "type": "textbox" ,"satuan":"C" },
                        { "id": 21003030, "nama": "Pernapasan", "type": "textbox" ,"satuan":"x/min" },
                        { "id": 21003031, "nama": "Spo2", "type": "textbox" ,"satuan":"" },
                        { "id": 21003032, "nama": "Ews", "type": "textbox" ,"satuan":"" },
                        { "id": 21003033, "nama": "Bb", "type": "textbox" ,"satuan":"Kg" },
                        { "id": 21003034, "nama": "Tb", "type": "textbox" ,"satuan":"cm" },
                        
                    ]
                },
                {
                    "id": 2, "nama": "Kesadaran",
                    "detail": [
                        { "id": 21003036, "nama": "GCS: E", "type": "textboxgcs" ,"satuan":"" },
                        { "id": 21003037, "nama": "V", "type": "textboxgcs" ,"satuan":"" },
                        { "id": 21003038, "nama": "M", "type": "textboxgcs" ,"satuan":"" },
                        { "id": 21009267, "nama": "Skor", "type": "textboxskorgcs" ,"satuan":"" },
                        { "nama": "", "type": "label"},
                        { "id": 21003039, "nama": "Refleks Cahaya: ka", "type": "textbox3" ,"satuan":"" },
                        { "id": 21003040, "nama": "Refleks Cahaya: ki", "type": "textbox3" ,"satuan":"" },
                        { "nama": "", "type": "label"},
                        { "id": 21003041, "nama": "Ukuran Pupil: ka", "type": "textbox3" ,"satuan":"mm" },
                        { "id": 21003042, "nama": "Ukuran Pupil: ki", "type": "textbox3" ,"satuan":"mm" },
                        
                    ]
                },
                {
                    "id": 3, "nama": "Sirkulasi",
                    "detail": [
                        { "id": 21003044, "nama": "Nomal", "type": "checkbox" },
                        { "id": 21003045, "nama": "Pusing", "type": "checkbox" },
                        { "id": 21003046, "nama": "Sakit Kepala", "type": "checkbox" },
                        { "id": 21003047, "nama": "Sycope", "type": "checkbox" },
                        { "id": 21003048, "nama": "Palpitasi", "type": "checkbox" },
                        { "id": 21003049, "nama": "Cyanosis", "type": "checkbox"},
                        { "id": 21003050, "nama": "Nyeri Dada", "type": "checkbox" },
                        { "id": 21003051, "nama": "Nyeri Ditungkai/betis", "type": "checkbox"},                        
                    ]
                },
                {
                    "id": 4, "nama": "Capilari Refill",
                    "detail": [
                        { "id": 21003053, "nama": "Baik", "type": "checkbox" },
                        { "id": 21003054, "nama": "Lambat", "type": "checkbox" },
                        { "id": 21003055, "nama": "<=2 detik", "type": "checkbox" },
                        { "id": 21003056, "nama": ">=2 detik", "type": "checkbox" },                        
                    ]
                },
                {
                    "id": 5, "nama": "Ekstermitas",
                    "detail": [
                        { "id": 21003058, "nama": "Hangat", "type": "checkbox" },
                        { "id": 21003059, "nama": "Dingin", "type": "checkbox" },
                        { "id": 21003060, "nama": "Basah", "type": "checkbox" },
                        { "id": 21003061, "nama": "Kering", "type": "checkbox" },
                        { "id": 21003062, "nama": "dll ex: fraktur, combustio", "type": "checkbox" },                         
                    ]
                },
                {
                    "id": 6, "nama": "Kulit",
                    "detail": [
                        { "id": 21003064, "nama": "Utuh", "type": "checkbox" },
                        { "id": 21003065, "nama": "Memar", "type": "checkbox" },
                        { "id": 21003066, "nama": "Kering", "type": "checkbox" },
                        { "id": 21003067, "nama": "Lembab", "type": "checkbox" },
                        { "id": 21003068, "nama": "Bersisik", "type": "checkbox" },
                        { "id": 21003069, "nama": "Petechiae", "type": "checkbox" },
                        { "id": 21003070, "nama": "Pucat", "type": "checkbox" },
                        { "id": 21003071, "nama": "Ikterik", "type": "checkbox" },
                        { "id": 21003072, "nama": "Kemerahan", "type": "checkbox" },                         
                    ]
                },
                {
                    "id": 7, "nama": "Luka Gangren",
                    "detail": [
                        { "id": 21003074, "nama": "Tidak ada", "type": "checkbox" },
                        { "id": 21003075, "nama": "Ada,Lokasi", "type": "textbox2","idd":21003076 },                       
                    ]
                },
                {
                    "id": 8, "nama": "Turgor",
                    "detail": [
                        { "id": 21003078, "nama": "Baik", "type": "checkbox" },
                        { "id": 21003079, "nama": "Sedang", "type": "checkbox" },
                        { "id": 21003080, "nama": "Jelek", "type": "checkbox" },                     
                    ]
                },
                {
                    "id": 9, "nama": "Obsteri dan Ginkelogi",
                    "detail": [
                        { "id": 21003082, "nama": "Ya", "type": "checkbox2","depan":"Hamil:" },
                        { "id": 21003083, "nama": "Tidak", "type": "checkbox" },
                        { "id": 21003084, "nama": "Hpht", "type": "textbox" },    
                        { "id": 21003085, "nama": "Keluhan Menstruasi", "type": "checkbox" },                 
                    ]
                },
            ]

            $scope.listStatusBio = [
                {
                    "id": 1, "nama": "Status Biologis",
                    "detail": [
                        { "id": 21003087, "nama": "Pola Malan :", "satuan": "x/hari", "type": "textbox2" },
                        { "id": 21003088, "nama": "Terakhir jam", "satuan": "", "type": "textbox2" },
                        { "id": 21003089, "nama": "Pola Minum :", "satuan": "cc/hari", "type": "textbox2" },
                        { "id": 21003090, "nama": "Terakhir jam", "satuan": "", "type": "textbox2" },
                        { "id": 21003091, "nama": "BAK :", "satuan": "x/hari", "type": "textbox2" },
                        { "id": 21003092, "nama": "Terakhir jam", "satuan": "", "type": "textbox3" },
                        { "id": 21003093, "nama": "Warna", "satuan": "", "type": "textbox3" },
                        { "id": 21003094, "nama": "BAB :", "satuan": "x/hari", "type": "textbox2" },
                        { "id": 21003095, "nama": "Terakhir jam", "satuan": "", "type": "textbox2" },

                    ]
                },
                {
                    "id": 1, "nama": "Status Psikologis",
                    "detail": [
                        { "id": 21003097, "nama": "Cemas", "type": "checkbox" },
                        { "id": 21003098, "nama": "Takut", "type": "checkbox" },
                        { "id": 21003099, "nama": "Marah", "type": "checkbox" },
                        { "id": 21003100, "nama": "Sedih", "type": "checkbox" },
                        { "id": 21003101, "nama": "Kecendrungan bunuh diri", "type": "checkbox" },
                        { "id": 21003102, "nama": "dll", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "Status Sosial",
                    "detail": [
                        { "nama": "Pekerjaan", "type": "label" },
                        { "id": 21003105, "nama": "Wiraswasta", "type": "checkbox" },
                        { "id": 21003106, "nama": "Pegawai Negeri", "type": "checkbox" },
                        { "id": 21003107, "nama": "Pegawai Swasta", "type": "checkbox" },
                        { "id": 21003108, "nama": "Tidak Bekerja", "type": "checkbox" },
                        { "id": 21003109, "nama": "Siswa/Mahasiswa", "type": "checkbox" },
                        { "id": 21003110, "nama": "Pensiun", "type": "checkbox" },
                        { "id": 21003111, "nama": "Alamat Rumah", "type": "textbox" },
                        { "id": 21003112, "nama": "No. Telepon", "type": "textbox" },

                    ]
                },
                {
                    "id": 1, "nama": "Spriritual dan Kulturasi",
                    "detail": [
                        { "nama": "Agama", "type": "label" },
                        { "id": 21003115, "nama": "Islam", "type": "checkbox" },
                        { "id": 21003116, "nama": "Protestan", "type": "checkbox" },
                        { "id": 21003117, "nama": "Katolik", "type": "checkbox" },
                        { "id": 21003118, "nama": "Hindu", "type": "checkbox" },
                        { "id": 21003119, "nama": "Budha", "type": "checkbox" },
                        { "id": 21003120, "nama": "Konghucu", "type": "checkbox" },
                        { "id": 21003121, "nama": "Lain-lain", "type": "checkbox" },
                        { "id": 21003122, "nama": "", "type": "textbox" },
                        { "nama": "Kegiatan Spiritual dan nilai nilai kepercayaan yang dilakukan", "type": "label" },
                        { "id": 21003124, "nama": "Ada, Sebutkan", "type": "checkbox" },
                        { "id": 21003125, "nama": "Tidak ada", "type": "checkbox" },
                        { "id": 21003126, "nama": "", "type": "textbox" },
                        { "nama": "Bahasa sehari-hari", "type": "label" },
                        { "id": 21003128, "nama": "Indonesia", "type": "checkbox" },
                        { "id": 21003129, "nama": "Inggris", "type": "checkbox" },
                        { "id": 21003130, "nama": "Daerah", "type": "checkbox" },
                        { "id": 21003131, "nama": "Lain-lain", "type": "textbox" },
                    ]
                },
            ]

            $scope.listStatusEkonomi = [
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "nama": "Cara Pembayaran", "type": "label" },
                        { "id": 21003133, "nama": "Pribadi", "type": "checkbox" },
                        { "id": 21003134, "nama": "Perusahaan", "type": "checkbox" },
                        { "id": 21003135, "nama": "Asuransi", "type": "checkbox" },
                        { "nama": "Pendapatan", "type": "label" },
                        { "id": 21003137, "nama": "UMR /rp", "type": "checkbox" },
                        { "id": 21003138, "nama": "UMR s/d 5 juta rp", "type": "checkbox" },
                        { "id": 21003139, "nama": "5 s/d 10 juta rp", "type": "checkbox" },
                        { "id": 21003140, "nama": "10 s/d 15 juta rp", "type": "checkbox" },
                        { "id": 21003141, "nama": "> 15 juta rp", "type": "checkbox" },
                    ]
                },
            ]

            $scope.listRiwayatKesehatanPasien = [
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21003142, "nama": "Riwayat Penyakit Sekarang", "type": "textarea" },
                        { "id": 21003143, "nama": "Riwayat Penyakit Dahulu", "type": "textarea" },
                        { "id": 21003144, "nama": "Pemeriksaan Penunjang", "type": "textarea" },
                    ]
                },
            ]

            $scope.listRiwayatAlergi = [
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21003145, "nama": "Ya, Sebutkan :", "type": "checkbox" },
                        { "id": 21003146, "nama": "Tidak", "type": "checkbox" },
                        { "id": 21003147, "nama": "", "type": "textbox" },
                        { "id": 21003148, "nama": "Sticker tanda alergi dipasang (warna merah)", "type": "checkbox2" },
                        { "id": 21003149, "nama": "", "type": "textbox" },
                    ]
                },
            ]

            $scope.listScoreGambar = [
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21003150, "nama": "0 = Tidak ada Nyeri", "type": "checkbox" },
                        { "id": 21003151, "nama": "1 - 3 = Nyeri Ringan", "type": "checkbox" },
                        { "id": 21003152, "nama": "4 - 6 = Nyeri Sedang", "type": "checkbox" },
                        { "id": 21003153, "nama": "7 - 10 = Nyeri Berat", "type": "checkbox" },
                    ]
                },
            ]

            $scope.listSkalaFlacc = [
                {
                    "id": 1, "nama": "Wajah",
                    "detail": [
                        { "id": 21003155, "nama": "Tersenyum/tidak ada ekspresi khusus", "descNilai": "0", "target":"21003158", "type": "checkbox" },
                        { "id": 21003156, "nama": "Terkadang meringis/menarik diri", "descNilai": "1", "target":"21003158", "type": "checkbox" },
                        { "id": 21003157, "nama": "Sering menggetarkan dagu mengatupkan rahang", "descNilai": "2", "target":"21003158", "type": "checkbox" },
                        { "id": 21003158, "nama": "", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "Kaki",
                    "detail": [
                        { "id": 21003160, "nama": "Gerakan normal/relaksasi", "descNilai": "0", "target":"21003163", "type": "checkbox" },
                        { "id": 21003161, "nama": "Tidak tenang/tegang", "descNilai": "1", "target":"21003163", "type": "checkbox" },
                        { "id": 21003162, "nama": "Kaki dibuat menendang/menarik diri", "descNilai": "2", "target":"21003163", "type": "checkbox" },
                        { "id": 21003163, "nama": "", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "Aktivitas",
                    "detail": [
                        { "id": 21003165, "nama": "Tidur posisi normal, mudah bergerak", "descNilai": "0", "target":"21003168", "type": "checkbox" },
                        { "id": 21003166, "nama": "Gerakan menggeliat, berguling, kaku", "descNilai": "1", "target":"21003168", "type": "checkbox" },
                        { "id": 21003167, "nama": "Melengkungkan punggung/kaki/menghentak", "descNilai": "2", "target":"21003168", "type": "checkbox" },
                        { "id": 21003168, "nama": "", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "Menangis",
                    "detail": [
                        { "id": 21003170, "nama": "Tidak menangis (bangun/tidur)", "descNilai": "0", "target":"21003173", "type": "checkbox" },
                        { "id": 21003171, "nama": "Mengerang, merengek-rengek", "descNilai": "1", "target":"21003173", "type": "checkbox" },
                        { "id": 21003172, "nama": "Menangis terus menerus, terhisak, menjerit", "descNilai": "2", "target":"21003173", "type": "checkbox" },
                        { "id": 21003173, "nama": "", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "Bersuara",
                    "detail": [
                        { "id": 21003175, "nama": "Bersuara, normal, tenang", "descNilai": "0", "target":"21003178", "type": "checkbox" },
                        { "id": 21003176, "nama": "Tenang bila dipeluk, digendong atau diajak bicara", "descNilai": "1", "target":"21003178", "type": "checkbox" },
                        { "id": 21003177, "nama": "Kaki dibuat menendang/menarik diri", "descNilai": "2", "target":"21003178", "type": "checkbox" },
                        { "id": 21003178, "nama": "", "type": "textbox" },
                    ]
                },
            ]

            $scope.listPenilaianNyeri = [
                {
                    "id": 1, "nama": "Penilaian Nyeri",
                    "detail": [
                        { "nama": "Provokatif", "type": "label" },
                        { "id": 21003186, "nama": "Ruda paksa", "type": "checkbox" },
                        { "id": 21003187, "nama": "Benturan", "type": "checkbox" },
                        { "id": 21003188, "nama": "Sayatan", "type": "checkbox" },
                        { "id": 21003189, "nama": "dll", "type": "textbox" },
                        { "nama": "Quality", "type": "label" },
                        { "id": 21003191, "nama": "Tertusuk", "type": "checkbox" },
                        { "id": 21003192, "nama": "Tertekan/tertindih", "type": "checkbox" },
                        { "id": 21003193, "nama": "Diiris-iris", "type": "checkbox" },
                        { "id": 21003194, "nama": "dll", "type": "textbox" },
                        { "nama": "Regional", "type": "label" },
                        { "id": 21003196, "nama": "Lokasi", "type": "checkbox1" },
                        { "id": 21003197, "nama": "", "type": "textbox2" },
                        { "nama": "Menjalar", "type": "label" },
                        { "id": 21003199, "nama": "Tidak", "type": "checkbox" },
                        { "id": 21003200, "nama": "Ya, Ke :", "type": "checkbox2" },
                        { "id": 21003201, "nama": "", "type": "textbox" },
                        { "nama": "Scala", "type": "label" },
                        { "id": 21003203, "nama": "", "type": "textbox" },
                        { "nama": "Time", "type": "label" },
                        { "id": 21003205, "nama": "Jarang", "type": "checkbox" },
                        { "id": 21003206, "nama": "Hilang timbul", "type": "checkbox" },
                        { "id": 21003207, "nama": "Terus menerus", "type": "checkbox" },
                    ]
                },
            ]

            $scope.listPengkajianSkorJatuhPasienAnak = [
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "nama": "1.", "type": "label", "rowspan": 4, },
                        { "nama": "Umur", "type": "label", "rowspan": 4, },
                        { "id": 21003210, "nama": "1. < 3 Tahun", "descNilai": "4", "target":"21003214", "type": "checkbox" },
                        { "nama": "4", "type": "label" },
                        { "id": 21003214, "nama": "", "type": "textarea", "rowspan": 4 },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21003211, "nama": "2. 3 - 7 Tahun", "descNilai": "3", "target":"21003214", "type": "checkbox" },
                        { "nama": "3", "type": "label" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21003212, "nama": "3. 8 - 13 Tahun", "descNilai": "2", "target":"21003214", "type": "checkbox" },
                        { "nama": "2", "type": "label" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21003213, "nama": "4. 14 - 18 Tahun", "descNilai": "1", "target":"21003214", "type": "checkbox" },
                        { "nama": "1", "type": "label" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "nama": "2.", "type": "label", "rowspan": 2, },
                        { "nama": "Jenis Kelamin", "type": "label", "rowspan": 2, },
                        { "id": 21003216, "nama": "1. Laki-laki", "descNilai": "2", "target":"21003218", "type": "checkbox" },
                        { "nama": "2", "type": "label" },
                        { "id": 21003218, "nama": "", "type": "textarea", "rowspan": 2 },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21003217, "nama": "2. Perempuan", "descNilai": "1", "target":"21003218", "type": "checkbox" },
                        { "nama": "1", "type": "label" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "nama": "3.", "type": "label", "rowspan": 4, },
                        { "nama": "Diagnosa", "type": "label", "rowspan": 4, },
                        { "id": 21003220, "nama": "1. Kelainan", "descNilai": "4", "target":"21003224", "type": "checkbox" },
                        { "nama": "4", "type": "label" },
                        { "id": 21003224, "nama": "", "type": "textarea", "rowspan": 4 },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21003221, "nama": "2. Gangguan oksigenisasi (pernafasan, anemia, dehidrasi, anoreksia, sinkope, sakit kepala)", "descNilai": "3", "target":"21003224", "type": "checkbox" },
                        { "nama": "3", "type": "label" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21003222, "nama": "3. Kelemahan fisik / kelainan psikologis", "descNilai": "2", "target":"21003224", "type": "checkbox" },
                        { "nama": "2", "type": "label" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21003223, "nama": "4. Diagnosa lain", "descNilai": "1", "target":"21003224", "type": "checkbox" },
                        { "nama": "1", "type": "label" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "nama": "4.", "type": "label", "rowspan": 3, },
                        { "nama": "Gangguan kognitif memori", "type": "label", "rowspan": 3, },
                        { "id": 21003226, "nama": "1. Tidak memahami keterbatasan", "descNilai": "3", "target":"21003229", "type": "checkbox" },
                        { "nama": "3", "type": "label" },
                        { "id": 21003229, "nama": "", "type": "textarea", "rowspan": 3 },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21003227, "nama": "2. Lupa Keterbatasan", "descNilai": "2", "target":"21003229", "type": "checkbox" },
                        { "nama": "2", "type": "label" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21003228, "nama": "3. Orientasi terhadap kelemahan", "descNilai": "1", "target":"21003229", "type": "checkbox" },
                        { "nama": "1", "type": "label" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "nama": "5.", "type": "label", "rowspan": 4, },
                        { "nama": "Lingkungan", "type": "label", "rowspan": 4, },
                        { "id": 21003231, "nama": "1. Riwayat jatuh dari tempat tidur saat bayi - anak", "descNilai": "4", "target":"21003235", "type": "checkbox" },
                        { "nama": "4", "type": "label" },
                        { "id": 21003235, "nama": "", "type": "textarea", "rowspan": 4 },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21003232, "nama": "2. Menggunakan alat bantu (Box/Mebel)", "descNilai": "3", "target":"21003235", "type": "checkbox" },
                        { "nama": "3", "type": "label" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21003233, "nama": "3. Pasien berada di tempat tidur", "descNilai": "2", "target":"21003235", "type": "checkbox" },
                        { "nama": "2", "type": "label" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21003234, "nama": "4. Pasien berada di area ruang", "descNilai": "1", "target":"21003235", "type": "checkbox" },
                        { "nama": "1", "type": "label" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "nama": "6.", "type": "label", "rowspan": 3, },
                        { "nama": "Respon operasi/obat penenang/efek anesthesi", "type": "label", "rowspan": 3, },
                        { "id": 21003237, "nama": "1. < 24 jam", "descNilai": "3", "target":"21003240", "type": "checkbox" },
                        { "nama": "3", "type": "label" },
                        { "id": 21003240, "nama": "", "type": "textarea", "rowspan": 3 },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21003238, "nama": "2. < 48 jam", "descNilai": "2", "target":"21003240", "type": "checkbox" },
                        { "nama": "2", "type": "label" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21003239, "nama": "3. > 48 jam", "descNilai": "1", "target":"21003240", "type": "checkbox" },
                        { "nama": "1", "type": "label" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "nama": "7.", "type": "label", "rowspan": 3, },
                        { "nama": "Penggunaan obat", "type": "label", "rowspan": 3, },
                        { "id": 21003242, "nama": "1. obat sedative (kecuali pasien di NICU/PICU yang menggunakan sedasi dan paraiisis), hipotonik, barbiturate dan phenotiazin, antidepresan, laksative diuretic, narcotice/metadon", "descNilai": "3", "target":"21003245", "type": "checkbox" },
                        { "nama": "3", "type": "label" },
                        { "id": 21003245, "nama": "", "type": "textarea", "rowspan": 3 },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21003243, "nama": "2. salah satu obat diatas", "descNilai": "2", "target":"21003245", "type": "checkbox" },
                        { "nama": "2", "type": "label" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21003244, "nama": "3. pengobatan lain", "descNilai": "1", "target":"21003245", "type": "checkbox" },
                        { "nama": "1", "type": "label" },
                    ]
                },
            ]

            $scope.listPengkajianSkorJatuhPasienDewasa = [
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "nama": "1.", "type": "label", "rowspan": 2, },
                        { "nama": "Apakah ada riwayat jatuh dalam waktu 3 bulan sebab apapun", "type": "label", "rowspan": 2, },
                        { "id": 21003250, "nama": "Ya", "descNilai": "25", "type": "checkbox" },
                        { "nama": "25", "type": "label" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21003251, "nama": "Tidak", "descNilai": "0", "type": "checkbox" },
                        { "nama": "0", "type": "label" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "nama": "2.", "type": "label", "rowspan": 2, },
                        { "nama": "Apakah mempunyai penyakit penyerta atau diagnosa skunder", "type": "label", "rowspan": 2, },
                        { "id": 21003253, "nama": "Ya", "descNilai": "15", "type": "checkbox" },
                        { "nama": "15", "type": "label" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21003254, "nama": "Tidak", "descNilai": "0", "type": "checkbox" },
                        { "nama": "0", "type": "label" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "nama": "3.", "type": "label" },
                        { "nama": "Alat bantu berjalan", "type": "label", "colspan": 3 },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "nama": "", "type": "label" },
                        { "nama": "Dibantu perawat/tidak menggunakan alat bantu", "type": "label" },
                        { "id": 21003257, "nama": "Ya", "descNilai": "0", "type": "checkbox" },
                        { "nama": "0", "type": "label" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "nama": "", "type": "label" },
                        { "nama": "Menggunakan alat bantu kruck/tongkat, kursi roda", "type": "label" },
                        { "id": 21003259, "nama": "Ya", "descNilai": "15", "type": "checkbox" },
                        { "nama": "15", "type": "label" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "nama": "", "type": "label" },
                        { "nama": "Merambat dengan berpegangan pada meja, kursi (furniture)", "type": "label" },
                        { "id": 21003261, "nama": "Ya", "descNilai": "30", "type": "checkbox" },
                        { "nama": "30", "type": "label" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "nama": "4.", "type": "label", "rowspan": 2, },
                        { "nama": "Apakah terpasang infuse/pemberian anticoagulant (heparin). Obat lain yang mempunyai efek jatuh", "type": "label", "rowspan": 2, },
                        { "id": 21003263, "nama": "Ya", "descNilai": "20", "type": "checkbox" },
                        { "nama": "20", "type": "label" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21003264, "nama": "Tidak", "descNilai": "0", "type": "checkbox" },
                        { "nama": "0", "type": "label" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "nama": "5.", "type": "label" },
                        { "nama": "Kondisi untuk melakukan gerakan berpindah/mobilisasi :", "type": "label", "colspan": 3 },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "nama": "", "type": "label" },
                        { "nama": "Dibantu perawat/tidak menggunakan alat bantu", "type": "label" },
                        { "id": 21003267, "nama": "Ya", "descNilai": "0", "type": "checkbox" },
                        { "nama": "0", "type": "label" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "nama": "", "type": "label" },
                        { "nama": "Menggunakan alat bantu kruck/tongkat, kursi roda", "type": "label" },
                        { "id": 21003269, "nama": "Ya", "descNilai": "10", "type": "checkbox" },
                        { "nama": "10", "type": "label" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "nama": "", "type": "label" },
                        { "nama": "Merambat dengan berpegangan pada meja, kursi (furniture)", "type": "label" },
                        { "id": 21003271, "nama": "Ya", "descNilai": "20", "type": "checkbox" },
                        { "nama": "20", "type": "label" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "nama": "6.", "type": "label" },
                        { "nama": "Kondisi status mental", "type": "label", "colspan": 3 },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "nama": "", "type": "label" },
                        { "nama": "Menyadari kelemahannya", "type": "label" },
                        { "id": 21003274, "nama": "Ya", "descNilai": "0", "type": "checkbox" },
                        { "nama": "0", "type": "label" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "nama": "", "type": "label" },
                        { "nama": "Tidak menyadari kelemahannya", "type": "label" },
                        { "id": 21003276, "nama": "Ya", "descNilai": "15", "type": "checkbox" },
                        { "nama": "15", "type": "label" },
                    ]
                },
            ]

            $scope.listAssementFungsional = [
                {
                    "id": 1, "nama": "Sensorik",
                    "detail": [
                        { "nama": "Penglihatan", "type": "label" },
                        { "id": 21003281, "nama": "Normal", "type": "checkbox" },
                        { "id": 21003282, "nama": "Kabur", "type": "checkbox" },
                        { "id": 21003283, "nama": "Kacamata", "type": "checkbox" },
                        { "id": 21003284, "nama": "Lensa kotak", "type": "checkbox" },
                        { "nama": "Penciuman", "type": "label" },
                        { "id": 21003286, "nama": "Normal", "type": "checkbox" },
                        { "id": 21003287, "nama": "Tidak", "type": "checkbox" },
                        { "nama": "Pendengaran", "type": "label" },
                        { "id": 21003289, "nama": "Normal", "type": "checkbox" },
                        { "id": 21003290, "nama": "Tuli kanan/kiri", "type": "checkbox" },
                        { "id": 21003291, "nama": "Alat bantu dengan kanan/kiri", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "nama": "Kognitif",
                    "detail": [
                        { "id": 21003293, "nama": "Orientasi penuh", "type": "checkbox" },
                        { "id": 21003294, "nama": "Pelupa", "type": "checkbox" },
                        { "id": 21003295, "nama": "Bingung", "type": "checkbox" },
                        { "id": 21003296, "nama": "Tidak dapat dimengerti", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "nama": "Motorik",
                    "detail": [
                        { "nama": "Aktifitas sehari-hari", "type": "label" },
                        { "id": 21003299, "nama": "Mandiri", "type": "checkbox" },
                        { "id": 21003300, "nama": "Bantuan Minimal", "type": "checkbox" },
                        { "id": 21003301, "nama": "Bantuan Sebagian", "type": "checkbox" },
                        { "id": 21003302, "nama": "Ketergantungan Total", "type": "checkbox" },
                        { "nama": "Berjalan", "type": "label" },
                        { "id": 21003304, "nama": "Tidak ada kesulitan", "type": "checkbox" },
                        { "id": 21003305, "nama": "Perlu bantuan", "type": "checkbox" },
                        { "id": 21003306, "nama": "Sering Jatuh", "type": "checkbox" },
                        { "id": 21003307, "nama": "Kelumpuhan", "type": "checkbox" },
                    ]
                },
            ]

            $scope.listNutrisional = [
                {
                    "id": 1, "no": 1, "nama": "Apakah ada penurunan berat badan yang tidak diinginkan selama 6 bulan terakhir ?",
                    "detail": [
                        { "id": 21003310, "nama": "a. Tidak", "descNilai" : "0", "type": "checkbox" },
                        { "id": 21003311, "nama": "b. Tidak Yakin", "descNilai" : "2", "type": "checkbox" },
                        { "nama": "(Tanda: ukuran baju atau celana menjadi lebih longgar)", "type": "label" },
                        { "id": 21003313, "nama": "c. Ya, 1-5 Kg", "descNilai" : "1", "type": "checkbox" },
                        { "id": 21003314, "nama": "6-10 Kg", "descNilai" : "2", "type": "checkbox" },
                        { "id": 21003315, "nama": "11-15 Kg", "descNilai" : "3", "type": "checkbox" },
                        { "id": 21003316, "nama": "> 15 Kg", "descNilai" : "4", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "no": 2, "nama": "Apakah asupan makan menurun yang dikarenakan adanya penurunan nafsu makan/kesulitan menerima makan ?",
                    "detail": [
                        { "id": 21003318, "nama": "Tidak", "descNilai" : "0", "type": "checkbox" },
                        { "id": 21003319, "nama": "Tidak yakin", "descNilai" : "1", "type": "checkbox" },
                    ]
                },
            ]

            $scope.listKebutuhanEdukasi = [
                {
                    "id": 1, "nama": "A. Terdapat hambatan dalam pembelajaran",
                    "detail": [
                        { "id": 21003322, "nama": "Tidak", "type": "checkbox" },
                        { "id": 21003323, "nama": "Ya", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "nama": "B. Jika ya, sebutkan hambatan (bisa dipilih lebih dari satu) :",
                    "detail": [
                        { "id": 21003325, "nama": "Pendengaran", "type": "checkbox" },
                        { "id": 21003326, "nama": "Penglihatan", "type": "checkbox" },
                        { "id": 21003327, "nama": "Kognitif", "type": "checkbox" },
                        { "id": 21003328, "nama": "Fisik", "type": "checkbox" },
                        { "id": 21003329, "nama": "Budaya", "type": "checkbox" },
                        { "id": 21003330, "nama": "Agama", "type": "checkbox" },
                        { "id": 21003331, "nama": "Emosi", "type": "checkbox" },
                        { "id": 21003332, "nama": "Bahasa", "type": "checkbox" },
                        { "id": 21003333, "nama": "Lain-lain", "type": "checkbox" },
                        { "id": 21003334, "nama": "", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "C. Dibutuhkan penerjemah",
                    "detail": [
                        { "id": 21003336, "nama": "Tidak", "type": "checkbox" },
                        { "id": 21003337, "nama": "Ya, jika ya sebutkan", "type": "checkbox" },
                        { "id": 21003338, "nama": "", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "D. Kebutuhan pembelajaran pasien (pilih topik pembelajaran pada kotak yang tersedia)",
                    "detail": [
                        { "id": 21003340, "nama": "Diagnosa & Manajemen", "type": "checkbox" },
                        { "id": 21003341, "nama": "Obat-obtan", "type": "checkbox" },
                        { "id": 21003342, "nama": "Perawatan Luka", "type": "checkbox" },
                        { "id": 21003343, "nama": "Rehabilitasi", "type": "checkbox" },
                        { "id": 21003344, "nama": "Manajemen nyeri", "type": "checkbox" },
                        { "id": 21003345, "nama": "Diet dan nutrisi", "type": "checkbox" },
                        { "id": 21003346, "nama": "Lain-lainnya", "type": "checkbox" },
                        { "id": 21003347, "nama": "", "type": "textbox" },
                    ]
                },
            ]

            $scope.listPerencanaanPulang = [
                {
                    "id": 1, "nama": "Kriteria Discharge Planning :",
                    "detail": [
                        { "nama": "A. Umur > 65", "type": "label" },
                        { "id": 21003350, "nama": "Ya", "type": "checkbox" },
                        { "id": 21003351, "nama": "Tidak", "type": "checkbox" },
                        { "nama": "B. Keterbatasan mobilitas", "type": "label" },
                        { "id": 21003353, "nama": "Ya", "type": "checkbox" },
                        { "id": 21003354, "nama": "Tidak", "type": "checkbox" },
                        { "nama": "C. Perawatan atau pengobatan lanjutan", "type": "label" },
                        { "id": 21003356, "nama": "Ya", "type": "checkbox" },
                        { "id": 21003357, "nama": "Tidak", "type": "checkbox" },
                        { "nama": "D. Bantuan untuk melakukan aktifitas sehari - hari", "type": "label" },
                        { "id": 21003359, "nama": "Ya", "type": "checkbox" },
                        { "id": 21003360, "nama": "Tidak", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "nama": "Bila salah satu jawaban 'Ya' dari kriteria perencanaan pulang diatas, maka akan dilanjutkan dengan perencanaan pulang sebagai berikut :",
                    "detail": [
                        { "id": 21003362, "nama": "Perawatan diri (mandi, BAB, BAK)", "type": "checkbox2" },
                        { "id": 21003363, "nama": "Latihan fisik lanjutan", "type": "checkbox2" },
                        { "id": 21003364, "nama": "Pemantauan pemberian obat", "type": "checkbox2" },
                        { "id": 21003365, "nama": "Pendampingan tenaga khusus di rumah", "type": "checkbox2" },
                        { "id": 21003366, "nama": "Pemantauan diet", "type": "checkbox2" },
                        { "id": 21003367, "nama": "Bantuan medis/perawat di rumah (home care)", "type": "checkbox2" },
                        { "id": 21003368, "nama": "Perawatan luka", "type": "checkbox2" },
                        { "id": 21003369, "nama": "Bantuan untuk melakukan aktifitas fisik (kursi roda, alat bantu jalan)", "type": "checkbox2" },
                    ]
                },
            ]

            $scope.listDiagnosaKeperawatan = [
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21003371, "nama": "Bersihan Jalan Nafas Tidak Efektif", "type": "checkbox" },
                        { "id": 21003372, "nama": "Kerusakan pertukaran gas", "type": "checkbox" },
                        { "id": 21003373, "nama": "Pola nafas tidak efektif", "type": "checkbox" },
                        { "id": 21003374, "nama": "Nyeri", "type": "checkbox" },
                        { "id": 21003375, "nama": "Penurunan curah jantung", "type": "checkbox" },
                        { "id": 21003376, "nama": "Intoleransi Aktifitas", "type": "checkbox" },
                        { "id": 21003377, "nama": "Koping individu tidak efektif", "type": "checkbox" },
                        { "id": 21003378, "nama": "Kelebihan/kekurangan volume cairan", "type": "checkbox" },
                        { "id": 21003379, "nama": "Perubahan perfusi jaringan jantung paru/jaringan otak/perifer", "type": "checkbox" },
                        { "id": 21003380, "nama": "Perdarahan", "type": "checkbox" },
                        { "id": 21003381, "nama": "Risiko Komplikasi Syok Anafilatik", "type": "checkbox" },
                        { "id": 21003382, "nama": "Keseimbangan Cairan & Elektrolit", "type": "checkbox" },
                        { "id": 21003383, "nama": "Gangguan Integritas Kulit/Jaringan", "type": "checkbox" },
                        { "id": 21003384, "nama": "Hipertermia/Hipotermia", "type": "checkbox" },
                        { "id": 21003385, "nama": "Inkontinesia", "type": "checkbox" },
                        { "id": 21003386, "nama": "Gangguan Komunikasi Verbal", "type": "checkbox" },
                        { "id": 21003387, "nama": "Retensia Urin", "type": "checkbox" },
                        { "id": 21003388, "nama": "Diagnosa Kebidanan", "type": "checkboxtextbox", "idd": 21003389 },
                        { "id": 21003390, "nama": "Lain-lain", "type": "checkboxtextbox", "idd": 21003391 },
                    ]
                },
            ]

            $scope.listRencanaAsuhan = [
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21003392, "nama": "Atur posisi", "type": "checkbox" },
                        { "id": 21003393, "nama": "Pasang IV line, lokasi", "type": "checkboxtextbox", "idd": 21003394, "satuan": "L/menit" },
                        { "id": 21003395, "nama": "Ukur tanda vital", "type": "checkbox" },
                        { "id": 21003396, "nama": "", "type": "checkboxtextbox", "idd": 21003397, "satuan": "" },
                        { "id": 21003398, "nama": "Pengambilan Sample lab", "type": "checkbox" },
                        { "id": 21003399, "nama": "", "type": "checkboxtextbox", "idd": 21003400, "satuan": "" },
                        { "id": 21003401, "nama": "Rekam EKG/Monitor EKG", "type": "checkbox" },
                        { "id": 21003402, "nama": "", "type": "checkboxtextbox", "idd": 21003403, "satuan": "" },
                        { "id": 21003404, "nama": "Berikan oksigen", "type": "checkboxtextbox", "idd": 21003405, "satuan": "L/menit" },
                        { "id": 21003406, "nama": "", "type": "checkboxtextbox", "idd": 21003407, "satuan": "" },
                    ]
                },
            ]

            $scope.listTindakan15 = [
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21003408, "nama": "", "type": "datetime" },
                        { "id": 21003409, "nama": "", "type": "textbox" },
                        { "id": 21003410, "nama": "", "type": "combobox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21003411, "nama": "", "type": "datetime" },
                        { "id": 21003412, "nama": "", "type": "textbox" },
                        { "id": 21003413, "nama": "", "type": "combobox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21003414, "nama": "", "type": "datetime" },
                        { "id": 21003415, "nama": "", "type": "textbox" },
                        { "id": 21003416, "nama": "", "type": "combobox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21003420, "nama": "", "type": "datetime" },
                        { "id": 21003421, "nama": "", "type": "textbox" },
                        { "id": 21003422, "nama": "", "type": "combobox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21009232, "nama": "", "type": "datetime" },
                        { "id": 21009233, "nama": "", "type": "textbox" },
                        { "id": 21009234, "nama": "", "type": "combobox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21009235, "nama": "", "type": "datetime" },
                        { "id": 21009236, "nama": "", "type": "textbox" },
                        { "id": 21009237, "nama": "", "type": "combobox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21009238, "nama": "", "type": "datetime" },
                        { "id": 21009239, "nama": "", "type": "textbox" },
                        { "id": 21009240, "nama": "", "type": "combobox" },
                    ]
                },{
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21009241, "nama": "", "type": "datetime" },
                        { "id": 21009242, "nama": "", "type": "textbox" },
                        { "id": 21009243, "nama": "", "type": "combobox" },
                    ]
                },{
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21009244, "nama": "", "type": "datetime" },
                        { "id": 21009245, "nama": "", "type": "textbox" },
                        { "id": 21009246, "nama": "", "type": "combobox" },
                    ]
                },{
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21009247, "nama": "", "type": "datetime" },
                        { "id": 21009248, "nama": "", "type": "textbox" },
                        { "id": 21009249, "nama": "", "type": "combobox" },
                    ]
                },{
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21009250, "nama": "", "type": "datetime" },
                        { "id": 21009251, "nama": "", "type": "textbox" },
                        { "id": 21009252, "nama": "", "type": "combobox" },
                    ]
                },{
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21009253, "nama": "", "type": "datetime" },
                        { "id": 21009254, "nama": "", "type": "textbox" },
                        { "id": 21009255, "nama": "", "type": "combobox" },
                    ]
                },{
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21009256, "nama": "", "type": "datetime" },
                        { "id": 21009257, "nama": "", "type": "textbox" },
                        { "id": 21009258, "nama": "", "type": "combobox" },
                    ]
                },{
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21009259, "nama": "", "type": "datetime" },
                        { "id": 21009260, "nama": "", "type": "textbox" },
                        { "id": 21009261, "nama": "", "type": "combobox" },
                    ]
                },{
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21009262, "nama": "", "type": "datetime" },
                        { "id": 21009263, "nama": "", "type": "textbox" },
                        { "id": 21009264, "nama": "", "type": "combobox" },
                    ]
                },
            ]

            $scope.listNamaPengkaji = [
                {
                    "id": 1, "nama": "Tanggal & Jam",
                    "detail": [
                        { "id": 21003417, "nama": "", "type": "datetime" },
                    ]
                },
                {
                    "id": 1, "nama": "Nama Perawat/Bidan",
                    "detail": [
                        { "id": 21003418, "nama": "", "type": "combobox" },
                    ]
                },
                {
                    "id": 1, "nama": "Tanda Tangan",
                    "detail": [
                        { "id": 21003419, "nama": "", "type": "combobox" },
                    ]
                }
            ]

            var cacheNomorEMR = cacheHelper.get('cacheNomorEMR');
            if (cacheNomorEMR != undefined) {
                nomorEMR = cacheNomorEMR[0]
                $scope.cc.norec_emr = nomorEMR
            }

            // var chacePeriode = cacheHelper.get('cacheHeader');
            // if (chacePeriode != undefined) {

            //     chacePeriode.umur = dateHelper.CountAge(new Date(chacePeriode.tgllahir), new Date());
            //     var bln = chacePeriode.umur.month,
            //         thn = chacePeriode.umur.year,
            //         day = chacePeriode.umur.day


            //     chacePeriode.umur = thn + 'thn ' + bln + 'bln ' + day + 'hr '
            //     $scope.cc.nocm = chacePeriode.nocm
            //     $scope.cc.namapasien = chacePeriode.namapasien;
            //     $scope.cc.jeniskelamin = chacePeriode.jeniskelamin;
            //     $scope.cc.tgllahir = chacePeriode.tgllahir;
            //     $scope.cc.umur = chacePeriode.umur;
            //     $scope.cc.alamatlengkap = chacePeriode.alamatlengkap;
            //     $scope.cc.notelepon = chacePeriode.notelepon;

            // }
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
                if (nomorEMR == '-') {
                    $scope.cc.norec_emr = '-'
                } else {
                    $scope.cc.norec_emr = nomorEMR
                }
            }
             medifirstService.get("emr/get-rekam-medis-dynamic?emrid=" + 149).then(function (e) {

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
                    if (element.kodeexternal == 'shiftjaga2') {
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
            })
            var chekedd = false
            $scope.totalSkorAses =0
            $scope.totalSkorAses2 =0
            $scope.totalSkor2=0

            medifirstService.get("emr/get-emr-transaksi-detail?noemr=" + nomorEMR + "&emrfk=" + $scope.cc.emrfk, true).then(function (dat) {
                $scope.item.obj = []
                $scope.item.obj2 = []
                $scope.item.obj[5000]=$scope.now
                $scope.item.obj[5001]=$scope.now
                $scope.item.obj[15691]={ value: $scope.cc.iddpjp, text: $scope.cc.dokterdpjp }
                dataLoad = dat.data.data
                medifirstService.get("emr/get-vital-sign?noregistrasi=" + $scope.cc.noregistrasi + "&objectidawal=4241&objectidakhir=4246&idemr=147", true).then(function (datas) {
                    if (datas.data.data.length>0){
                        if ($scope.item.obj[5002] == undefined) {
                            $scope.item.obj[5002]=datas.data.data[0].value
                        }
                        if ($scope.item.obj[5004]==undefined) {
                            $scope.item.obj[5004]=datas.data.data[3].value
                        }
                        if ($scope.item.obj[5003]==undefined) {
                            $scope.item.obj[5003]=datas.data.data[4].value
                        }
                        if ($scope.item.obj[5005]==undefined) {
                            $scope.item.obj[5005]=datas.data.data[5].value
                        }

                    }
                })
                for (var i = 0; i <= dataLoad.length - 1; i++) {
                    if (parseFloat($scope.cc.emrfk) == dataLoad[i].emrfk) {

                        if (dataLoad[i].type == "textbox") {
                            $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                                if (dataLoad[i].emrdfk ==  '15086')
                                $scope.totalSkorAses =parseFloat( dataLoad[i].value)
                                if (dataLoad[i].emrdfk=='5194') 
                            $scope.totalSkorAses2 =parseFloat( dataLoad[i].value)
                        if (dataLoad[i].emrdfk=='16733') 
                            $scope.totalSkor2 =parseFloat( dataLoad[i].value)
                        
                        }
                        if (dataLoad[i].type == "checkbox") {
                            chekedd = false
                            if (dataLoad[i].value == '1') {
                                chekedd = true
                            }
                            $scope.item.obj[dataLoad[i].emrdfk] = chekedd
                            if (dataLoad[i].emrdfk >= 5046 && dataLoad[i].emrdfk <= 5051 && chekedd) {
                                $scope.getSkalaNyeri(1, { descNilai: dataLoad[i].reportdisplay })
                            }
                            // if (dataLoad[i].emrdfk >= 5053 && dataLoad[i].emrdfk <= 5084 && dataLoad[i].reportdisplay != null) {
                            //     var datass = { id: dataLoad[i].emrdfk, descNilai: dataLoad[i].reportdisplay }
                            //     $scope.getSkor2(datass)
                            // }
                            if (dataLoad[i].emrdfk >= 5085 && dataLoad[i].emrdfk <= 5093 && dataLoad[i].reportdisplay != null) {
                                var datass = { id: dataLoad[i].emrdfk, descNilai: dataLoad[i].reportdisplay }
                                $scope.getSkorNutrisi(datass)
                            }


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
                        pegawaiInputDetail = dataLoad[i].pegawaifk
                    }

                }
                //  if( $scope.cc.norec_emr !='-' && pegawaiInputDetail !='' && pegawaiInputDetail !=null){
                //     if(pegawaiInputDetail != medifirstService.getPegawaiLogin().id){
                //         $scope.allDisabled =true
                //         // toastr.warning('Hanya Bisa melihat data','Peringatan')
                //         // return
                //     }
                // }
            })

            $scope.GCSKuantitatif = function ()
            {
                let e = parseInt($scope.item.obj[21003036]) || 0;
                let v = parseInt($scope.item.obj[21003037]) || 0;
                let m = parseInt($scope.item.obj[21003038]) || 0;
                let hasil =  e + v + m;
                console.log(hasil);
                if(hasil >= 14 && hasil <=15)
                {
                    $scope.item.obj[21009267] = hasil + " Compos mentis";
                } else if(hasil >= 12 && hasil <= 13)
                {
                    $scope.item.obj[21009267] = hasil + " Apatis";
                } else if(hasil >= 11 && hasil <= 12)
                {
                    $scope.item.obj[21009267] = hasil + " Somnolent";
                }else if(hasil >= 8 && hasil <= 10)
                {
                    $scope.item.obj[21009267] = hasil + " Stupor";
                }else if(hasil < 5)
                {
                    $scope.item.obj[21009267] = hasil + " Koma";
                }else
                {
                    $scope.item.obj[21009267] = "";
                }
            }

            $scope.MaxGCSValue = function (e, id) {
                switch (id)
                {
                    case 21003036:
                        if(e.which !== 49 && e.which !== 50 && e.which !== 51 && e.which !== 52)
                            e.preventDefault()
                        break;
                    case 21003037:
                        if(e.which !== 49 && e.which !== 50 && e.which !== 51 && e.which !== 52 && e.which !== 53)
                            e.preventDefault()
                        break;
                    case 21003038:
                        if(e.which !== 49 && e.which !== 50 && e.which !== 51 && e.which !== 52 && e.which !== 53 && e.which !== 54)
                            e.preventDefault()
                        break;
                }
            }

            $scope.$watch('item.obj[5041]', function (nilai) {

                if (nilai == undefined) return
                nilai = parseInt(nilai)


                if (nilai == 0) {
                    $scope.item.obj[5042] = true
                    $scope.item.obj[5043] = false
                    $scope.item.obj[5044] = false
                    $scope.item.obj[5045] = false
                }
                if (nilai >= 1 && nilai <= 3) {
                    $scope.item.obj[5042] = false
                    $scope.item.obj[5043] = true
                    $scope.item.obj[5044] = false
                    $scope.item.obj[5045] = false
                }
                if (nilai >= 4 && nilai <= 6) {
                    $scope.item.obj[5042] = false
                    $scope.item.obj[5043] = false
                    $scope.item.obj[5044] = true
                    $scope.item.obj[5045] = false
                }
                if (nilai >= 7 && nilai <= 10) {
                    $scope.item.obj[5042] = false
                    $scope.item.obj[5043] = false
                    $scope.item.obj[5044] = false
                    $scope.item.obj[5045] = true
                }
            });

            $scope.getSkalaNyeri = function (data, stat) {
                $scope.activeStatus = stat.descNilai
                var nilai = stat.descNilai
                if (nilai >= 0 && nilai <= 1) {
                    $scope.item.obj[5046] = true
                    $scope.item.obj[5047] = false
                    $scope.item.obj[5048] = false
                    $scope.item.obj[5049] = false
                    $scope.item.obj[5050] = false
                    $scope.item.obj[5051] = false
                }
                if (nilai >= 2 && nilai <= 3) {
                    $scope.item.obj[5046] = false
                    $scope.item.obj[5047] = true
                    $scope.item.obj[5048] = false
                    $scope.item.obj[5049] = false
                    $scope.item.obj[5050] = false
                    $scope.item.obj[5051] = false
                }
                if (nilai >= 4 && nilai <= 5) {
                    $scope.item.obj[5046] = false
                    $scope.item.obj[5047] = false
                    $scope.item.obj[5048] = true
                    $scope.item.obj[5049] = false
                    $scope.item.obj[5050] = false
                    $scope.item.obj[5051] = false
                }
                if (nilai >= 6 && nilai <= 7) {
                    $scope.item.obj[5046] = false
                    $scope.item.obj[5047] = false
                    $scope.item.obj[5048] = false
                    $scope.item.obj[5049] = true
                    $scope.item.obj[5050] = false
                    $scope.item.obj[5051] = false
                }
                if (nilai >= 8 && nilai <= 9) {
                    $scope.item.obj[5046] = false
                    $scope.item.obj[5047] = false
                    $scope.item.obj[5048] = false
                    $scope.item.obj[5049] = false
                    $scope.item.obj[5050] = true
                    $scope.item.obj[5051] = false
                }

                if (nilai == 10) {
                    $scope.item.obj[5046] = false
                    $scope.item.obj[5047] = false
                    $scope.item.obj[5048] = false
                    $scope.item.obj[5049] = false
                    $scope.item.obj[5050] = false
                    $scope.item.obj[5051] = true
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
                $scope.item.obj[16733] = $scope.totalSkor2
                // setSkorAkhir($scope.item.obj[3152])
            }
            $scope.$watch('item.obj[16733]', function (nilai) {

                if (nilai == undefined) return
                nilai = parseInt(nilai)


                if (nilai < 90 ) {
                    $scope.item.obj[16844] = true
                    $scope.item.obj[16845] = false
                   
                }
                if (nilai >= 90) {
                    $scope.item.obj[16844] = false
                    $scope.item.obj[16845] = true
                 
                }
            })
            // $scope.totalSkorAses =0
            // $scope.getSkorAsesmen = function(stat,skor){
            //     var arrobj = Object.keys($scope.item.obj)
            //     var arrSave = []
            //     for (var i = arrobj.length - 1; i >= 0; i--) {
            //         if (arrobj[i] == stat.id) {
            //             if ($scope.item.obj[parseFloat(arrobj[i])] == true) {
            //                 $scope.totalSkorAses = $scope.totalSkorAses + parseFloat(skor.descNilai)
            //                 break
            //             } else {
            //                 $scope.totalSkorAses = $scope.totalSkorAses - parseFloat(skor.descNilai)
            //                 break
            //             }
            //         } else {

            //         }
            //     }
            //     $scope.item.obj[5194] = $scope.totalSkorAses 
            // }
             $scope.getSkorAsesmen = function(stat,skor){
                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    if (arrobj[i] == stat.id) {
                        if ($scope.item.obj[parseFloat(arrobj[i])] == true) {
                            if (stat.baris == 1) {
                                $scope.totalSkorAses = $scope.totalSkorAses + parseFloat(skor.descNilai)

                            }
                            if (stat.baris == 2) {
                                $scope.totalSkorAses2 = $scope.totalSkorAses2 + parseFloat(skor.descNilai)

                            }
                            break
                        }
                        if ($scope.item.obj[parseFloat(arrobj[i])] == false) {
                            if (stat.baris == 1) {
                                $scope.totalSkorAses = $scope.totalSkorAses - parseFloat(skor.descNilai)

                            }
                            if (stat.baris == 2) {
                                $scope.totalSkorAses2 = $scope.totalSkorAses2 - parseFloat(skor.descNilai)

                            }
                            break
                        }
                    } else {

                    }
                }
                $scope.item.obj[15086] = $scope.totalSkorAses 
                $scope.item.obj[5194] = $scope.totalSkorAses2 
            }   
            $scope.skorNutrisi = 0
            $scope.getSkorNutrisi = function (stat) {
                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    if (arrobj[i] == stat.id) {
                        if ($scope.item.obj[parseFloat(arrobj[i])] == true) {
                            $scope.skorNutrisi = $scope.skorNutrisi + parseFloat(stat.descNilai)
                            break
                        } else {
                            $scope.skorNutrisi = $scope.skorNutrisi - parseFloat(stat.descNilai)
                            break
                        }
                    } else {
                    }
                }
                $scope.item.obj[21003320] = $scope.skorNutrisi
            }

            $scope.skorMorse = 0
            $scope.getSkorMorse = function (stat) {
                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    if (arrobj[i] == stat.id) {
                        if ($scope.item.obj[parseFloat(arrobj[i])] == true) {
                            $scope.skorMorse = $scope.skorMorse + parseFloat(stat.descNilai)
                            break
                        } else {
                            $scope.skorMorse = $scope.skorMorse - parseFloat(stat.descNilai)
                            break
                        }
                    } else {
                    }
                }
                $scope.item.obj[21003277] = $scope.skorMorse
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

            $scope.SkorSkalaFlacc[21003158] = 0;
            $scope.SkorSkalaFlacc[21003163] = 0;
            $scope.SkorSkalaFlacc[21003168] = 0;
            $scope.SkorSkalaFlacc[21003173] = 0;
            $scope.SkorSkalaFlacc[21003178] = 0;
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
                setSkorFlacc();
            }


            function setSkorFlacc()
            {
                var nilai1 = $scope.SkorSkalaFlacc[21003158]
                var nilai2 = $scope.SkorSkalaFlacc[21003163]
                var nilai3 = $scope.SkorSkalaFlacc[21003168]
                var nilai4 = $scope.SkorSkalaFlacc[21003173]
                var nilai5 = $scope.SkorSkalaFlacc[21003178]
            
                var total = nilai1 + nilai2 + nilai3 + nilai4 + nilai5
                $scope.item.obj[21003179] = total;
                
            }

            $scope.SkorJatuhAnak[21003214] = 0;
            $scope.SkorJatuhAnak[21003218] = 0;
            $scope.SkorJatuhAnak[21003224] = 0;
            $scope.SkorJatuhAnak[21003229] = 0;
            $scope.SkorJatuhAnak[21003235] = 0;
            $scope.SkorJatuhAnak[21003240] = 0;
            $scope.SkorJatuhAnak[21003245] = 0;
            $scope.getSkorJatuhAnak = function (jawab) {
                var arrobj = Object.keys($scope.item.obj);
                var arrSave = []
                
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    if (arrobj[i] == jawab.id) {
                        if ($scope.item.obj[parseFloat(arrobj[i])] == true) {
                            $scope.SkorJatuhAnak[jawab.target] = $scope.SkorJatuhAnak[jawab.target] + parseFloat(jawab.descNilai)
                            break
                        } else {
                            $scope.SkorJatuhAnak[jawab.target] = $scope.SkorJatuhAnak[jawab.target] - parseFloat(jawab.descNilai)
                            break
                        }
                    } else {
                    }
                }

                $scope.item.obj[jawab.target] = $scope.SkorJatuhAnak[jawab.target]
                setSkorJatuhAnak();
            }


            function setSkorJatuhAnak()
            {
                var nilai1 = $scope.SkorJatuhAnak[21003214]
                var nilai2 = $scope.SkorJatuhAnak[21003218]
                var nilai3 = $scope.SkorJatuhAnak[21003224]
                var nilai4 = $scope.SkorJatuhAnak[21003229]
                var nilai5 = $scope.SkorJatuhAnak[21003235]
                var nilai6 = $scope.SkorJatuhAnak[21003240]
                var nilai7 = $scope.SkorJatuhAnak[21003245]
            
                var total = nilai1 + nilai2 + nilai3 + nilai4 + nilai5 + nilai6 + nilai7
                $scope.item.obj[21003246] = total;
                
            }

            $scope.kembali = function () {
                $rootScope.showRiwayat()
            }

            $scope.Save = function () {
                //  if( $scope.cc.norec_emr !='-' && pegawaiInputDetail !='' && pegawaiInputDetail !=null){
                //     if(pegawaiInputDetail != medifirstService.getPegawaiLogin().id){
                //         toastr.warning('Hanya Bisa melihat data','Peringatan')
                //         return
                //     }
                // }

                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    if ($scope.item.obj[parseInt(arrobj[i])] instanceof Date)
                        $scope.item.obj[parseInt(arrobj[i])] = moment($scope.item.obj[parseInt(arrobj[i])]).format('YYYY-MM-DD HH:mm')
                    arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])] })
                }
                $scope.cc.jenisemr = 'asesmen'
                var jsonSave = {
                    head: $scope.cc,
                    data: arrSave
                }
                medifirstService.post('emr/save-emr-dinamis', jsonSave).then(function (e) {
                    medifirstService.postLogging('EMR', 'norec emrpasien_t', e.data.data.norec,
                    'Asesmen Awal Keperawatan I G D'+ ' dengan No EMR - ' + e.data.data.noemr + ' pada No Registrasi '
                    + $scope.cc.noregistrasi).then(function (res) {
                    })
                    $rootScope.loadRiwayat()
                    var arrStr = {
                        0: e.data.data.noemr
                    }
                    cacheHelper.set('cacheNomorEMR', arrStr);

                });
            }

        }
    ]);
    initialize.directive('disableContents', function() {
        return {
            compile: function(tElem, tAttrs) {
                var inputs = tElem.find('input');
                var inputsArea = tElem.find('textarea');
                inputs.attr('ng-disabled', tAttrs['disableContents']);
                inputsArea.attr('ng-disabled', tAttrs['disableContents']);
                for (var i = 0; i < inputs.length; i++) {
                }
            }
        }
    });
});