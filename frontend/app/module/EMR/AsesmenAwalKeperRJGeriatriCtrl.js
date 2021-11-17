define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('AsesmenAwalKeperRJGeriatriCtrl', ['$q', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($q, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, medifirstService) {

            $scope.myVar = true
            $scope.noCM = $state.params.noCM;
            $scope.tombolSimpanVis = true
            $scope.isCetak = false
            $scope.noRecPap = cacheHelper.get('noRecPap');
            $scope.totalSkor = 0
            $scope.skorNutrisi = 0
            $scope.SkorNorton = []
            $scope.totalSkor2 = 0
            $scope.totalSkor4 = 0
            $scope.cc = {}
            var nomorEMR = '-'
            $scope.cc.emrfk = 210223
            var dataLoad = []
            var pegawaiInputDetail= ''
            $scope.item.kasusbaru = true
            $scope.item.kasuslama = false

            medifirstService.getPart('emr/get-datacombo-part-pegawai', true, true, 20).then(function (data) {
                $scope.listPegawai = data
            })
            medifirstService.getPart('emr/get-datacombo-part-ruangan-pelayanan', true, true, 20).then(function (data) {
                $scope.listRuangan = data
            })
            medifirstService.getPart('emr/get-datacombo-part-diagnosa', true, true, 20).then(function (data) {
                $scope.listDiagnosa = data
            })
            
            $scope.listStatusFisik = [
                {
                    "id": 1, "nama": "A. Tanda Vital",
                    "detail": [
                        { "id": 22035168, "nama": "Suhu", "satuan": "°C", "type": "textbox" },
                        { "id": 22035169, "nama": "Nadi", "satuan": "x/mnt", "type": "textbox" },
                        { "id": 22035170, "nama": "Teratur", "satuan": "", "type": "checkbox" },
                        { "id": 22035171, "nama": "Tidak Teratur ", "satuan": "", "type": "checkbox" },
                        { "id": 22035172, "nama": "Kuat", "satuan": "", "type": "checkbox" },
                        { "id": 22035173, "nama": "Lemah", "satuan": "", "type": "checkbox" },
                        { "id": 22035174, "nama": "Tekanan Darah", "satuan": "mmHg", "type": "textbox2" },
                        { "id": 22035175, "nama": "Pernafasan", "satuan": "x/mnt", "type": "textbox2" },
                    ]
                },
                {
                    "id": 1, "nama": "B. Kesadaran",
                    "detail": [
                        { "nama": "GCS", "satuan": "", "type": "label" },
                        { "id": 22035176, "nama": "E", "satuan": "", "type": "textboxgcs" },
                        { "id": 22035177, "nama": "V", "satuan": "", "type": "textboxgcs" },
                        { "id": 22035178, "nama": "M", "satuan": "", "type": "textboxgcs" },
                        { "id": 22035179, "nama": "Skor", "satuan": "", "type": "textboxskorgcs" },
                        { "nama": "Refleks Cahaya", "satuan": "", "type": "label" },
                        { "id": 22035180, "nama": "ka", "satuan": "", "type": "textbox" },
                        { "id": 22035181, "nama": "ki", "satuan": "", "type": "textbox" },
                        { "nama": "Ukuran Pupil", "satuan": "", "type": "label" },
                        { "id": 22035182, "nama": "ka", "satuan": "mm", "type": "textbox" },
                        { "id": 22035183, "nama": "ki", "satuan": "mm", "type": "textbox" },
                        { "id": 22035184, "nama": "ESPO2", "satuan": "", "type": "textbox2" },
                        { "id": 22035185, "nama": "EWS", "satuan": "", "type": "textbox2" },
                    ]
                },
                {
                    "id": 1, "nama": "C. Rambut Kepala",
                    "detail": [
                        { "id": 22035186, "nama": "Bersih", "satuan": "", "type": "checkbox" },
                        { "id": 22035187, "nama": "Kotor", "satuan": "", "type": "checkbox" },
                        { "id": 22035188, "nama": "Kusam", "satuan": "", "type": "checkbox" },
                        { "id": 22035189, "nama": "Rontok", "satuan": "", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "nama": "D. Mata",
                    "detail": [
                        { "id": 22035190, "nama": "Normal", "satuan": "", "type": "checkbox" },
                        { "id": 22035191, "nama": "Sklera ikterik", "satuan": "", "type": "checkbox" },
                        { "id": 22035192, "nama": "Bersekret", "satuan": "", "type": "checkbox" },
                        { "id": 22035193, "nama": "Konjungtivita anemis", "satuan": "", "type": "checkbox" },
                        { "id": 22035194, "nama": "Katarak", "satuan": "", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "nama": "E. Hidung",
                    "detail": [
                        { "id": 22035195, "nama": "Tidak Bermasalah", "satuan": "", "type": "checkbox" },
                        { "id": 22035196, "nama": "Tersumbat", "satuan": "", "type": "checkbox" },
                        { "id": 22035197, "nama": "Secret (+)", "satuan": "", "type": "checkbox" },
                        { "id": 22035198, "nama": "Epistaksis", "satuan": "", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "nama": "F. Mulut",
                    "detail": [
                        { "id": 22035199, "nama": "Bersih", "satuan": "", "type": "checkbox" },
                        { "id": 22035200, "nama": "Kotor", "satuan": "", "type": "checkbox" },
                        { "id": 22035201, "nama": "Berbau", "satuan": "", "type": "checkbox" },
                        { "id": 22035202, "nama": "Mokusa kering", "satuan": "", "type": "checkbox" },
                        { "id": 22035203, "nama": "Stomatitis", "satuan": "", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "nama": "Bibir",
                    "detail": [
                        { "id": 22035204, "nama": "Normal", "satuan": "", "type": "checkbox" },
                        { "id": 22035205, "nama": "Kering", "satuan": "", "type": "checkbox" },
                        { "id": 22035206, "nama": "Sumbing", "satuan": "", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "nama": "Lidah",
                    "detail": [
                        { "id": 22035207, "nama": "Bersih", "satuan": "", "type": "checkbox" },
                        { "id": 22035208, "nama": "Kotor", "satuan": "", "type": "checkbox" },
                        { "id": 22035209, "nama": "Hiperemik", "satuan": "", "type": "checkbox" },
                        { "id": 22035210, "nama": "Putih", "satuan": "", "type": "checkbox" },
                        { "id": 22035211, "nama": "Kering", "satuan": "", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "nama": "Gigi",
                    "detail": [
                        { "id": 22035212, "nama": "Bersih", "satuan": "", "type": "checkbox" },
                        { "id": 22035213, "nama": "Kotor", "satuan": "", "type": "checkbox" },
                        { "id": 22035214, "nama": "Ompong", "satuan": "", "type": "checkbox" },
                        { "id": 22035215, "nama": "Kawat gigi", "satuan": "", "type": "checkbox" },
                        { "id": 22035216, "nama": "Gigi palsu", "satuan": "", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "nama": "G. Telingan",
                    "detail": [
                        { "id": 22035217, "nama": "Bersih", "satuan": "", "type": "checkbox" },
                        { "id": 22035218, "nama": "Kotor", "satuan": "", "type": "checkbox" },
                        { "id": 22035219, "nama": "Otitis media", "satuan": "", "type": "checkbox" },
                        { "id": 22035220, "nama": "Tinitus", "satuan": "", "type": "checkbox" },
                        { "id": 22035221, "nama": "", "satuan": "", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "H. Leher",
                    "detail": [
                        { "id": 22035222, "nama": "Normal", "satuan": "", "type": "checkbox" },
                        { "id": 22035223, "nama": "Ada benjolan", "satuan": "", "type": "checkbox" },
                        { "id": 22035224, "nama": "Kaku duduk", "satuan": "", "type": "checkbox" },
                        { "id": 22035225, "nama": "Trecheostomi", "satuan": "", "type": "checkbox" },
                        { "id": 22035226, "nama": "", "satuan": "", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "I. Dada",
                    "detail": [
                        { "id": 22035227, "nama": "Normal", "satuan": "", "type": "checkbox" },
                        { "id": 22035228, "nama": "Bentuk Asimetris", "satuan": "", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "nama": "Payudara",
                    "detail": [
                        { "id": 22035229, "nama": "Normal", "satuan": "", "type": "checkbox" },
                        { "id": 22035230, "nama": "Ada Benjolan, Lokasi", "satuan": "", "type": "checkbox" },
                        { "id": 22035231, "nama": "", "satuan": "", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "J. Recpirasi",
                    "detail": [
                        { "id": 22035232, "nama": "Normal", "satuan": "", "type": "checkbox" },
                        { "id": 22035233, "nama": "Dyspnea", "satuan": "", "type": "checkbox" },
                        { "id": 22035234, "nama": "Ronchi", "satuan": "", "type": "checkbox" },
                        { "id": 22035235, "nama": "Wheezing", "satuan": "", "type": "checkbox" },
                        { "id": 22035236, "nama": "Cyanosis", "satuan": "", "type": "checkbox" },
                        { "id": 22035237, "nama": "Nyeri saat nafas", "satuan": "", "type": "checkbox" },
                        { "id": 22035238, "nama": "Retraksi Dada", "satuan": "", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "nama": "Batuk",
                    "detail": [
                        { "id": 22035239, "nama": "Tidak ada", "satuan": "", "type": "checkbox" },
                        { "id": 22035240, "nama": "Ada", "satuan": "", "type": "checkbox" },
                        { "id": 22035241, "nama": "Tidak produktif", "satuan": "", "type": "checkbox" },
                        { "id": 22035242, "nama": "Produktif warna :", "satuan": "", "type": "checkbox" },
                        { "id": 22035243, "nama": "", "satuan": "", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "K. Sirkulasi",
                    "detail": [
                        { "id": 22035244, "nama": "Normal", "satuan": "", "type": "checkbox" },
                        { "id": 22035245, "nama": "Pusing", "satuan": "", "type": "checkbox" },
                        { "id": 22035246, "nama": "Sakit Kepala", "satuan": "", "type": "checkbox" },
                        { "id": 22035247, "nama": "Syncope", "satuan": "", "type": "checkbox" },
                        { "id": 22035248, "nama": "Palpitasi", "satuan": "", "type": "checkbox" },
                        { "id": 22035249, "nama": "Cyanosis", "satuan": "", "type": "checkbox" },
                        { "id": 22035250, "nama": "Nyeri Dada", "satuan": "", "type": "checkbox" },
                        { "id": 22035251, "nama": "Nyeri ditungkai/Betis", "satuan": "", "type": "checkbox" },
                        { "id": 22035252, "nama": "Baal/Numbness", "satuan": "", "type": "checkbox" },
                        { "id": 22035253, "nama": "Edema Lokasi :", "satuan": "", "type": "checkbox" },
                        { "id": 22035254, "nama": "", "satuan": "", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "Capilari refill",
                    "detail": [
                        { "id": 22035255, "nama": "Baik", "satuan": "", "type": "checkbox" },
                        { "id": 22035256, "nama": "Lambat", "satuan": "", "type": "checkbox" },
                        { "id": 22035257, "nama": "<= 2 detik", "satuan": "", "type": "checkbox" },
                        { "id": 22035258, "nama": ">= 2 detik", "satuan": "", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "nama": "Ekstremitas",
                    "detail": [
                        { "id": 22035259, "nama": "Hangat", "satuan": "", "type": "checkbox" },
                        { "id": 22035260, "nama": "Dingin", "satuan": "", "type": "checkbox" },
                        { "id": 22035261, "nama": "Basah", "satuan": "", "type": "checkbox" },
                        { "id": 22035262, "nama": "Kering", "satuan": "", "type": "checkbox" },
                        { "id": 22035263, "nama": "dll", "satuan": "", "type": "checkbox" },
                        { "nama": "ex : Fraktur Combustio", "satuan": "", "type": "label2" },
                    ]
                },
                {
                    "id": 1, "nama": "L. Gastrointastinal",
                    "detail": [
                        { "id": 22035264, "nama": "Normal", "satuan": "", "type": "checkbox" },
                        { "id": 22035265, "nama": "Kembung", "satuan": "", "type": "checkbox" },
                        { "id": 22035266, "nama": "Asites", "satuan": "", "type": "checkbox" },
                        { "id": 22035267, "nama": "Defans muscular", "satuan": "", "type": "checkbox" },
                        { "id": 22035268, "nama": "Mual", "satuan": "", "type": "checkbox" },
                        { "id": 22035269, "nama": "Muntah", "satuan": "", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "nama": "Benjolan/Massa",
                    "detail": [
                        { "id": 22035270, "nama": "Tidak Ada", "satuan": "", "type": "checkbox" },
                        { "id": 22035271, "nama": "Ada, Lokasi", "satuan": "", "type": "checkbox" },
                        { "id": 22035272, "nama": "", "satuan": "", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "Defakasi",
                    "detail": [
                        { "id": 22035273, "nama": "Frekuensi : ", "satuan": "", "type": "checkbox" },
                        { "id": 22035274, "nama": "", "satuan": "", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "Terakhir Defakasi",
                    "detail": [
                        { "id": 22035275, "nama": "", "satuan": "", "type": "textbox2" },
                    ]
                },
                {
                    "id": 1, "nama": "Konstipasi",
                    "detail": [
                        { "id": 22035276, "nama": "Tidak ", "satuan": "", "type": "checkbox" },
                        { "id": 22035277, "nama": "Ya, ", "satuan": "", "type": "checkbox" },
                        { "id": 22035278, "nama": "Pemakaian Obat Pencahar", "satuan": "", "type": "checkbox" },
                        { "id": 22035279, "nama": "", "satuan": "", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "M. Kulit",
                    "detail": [
                        { "id": 22035280, "nama": "Utuh", "satuan": "", "type": "checkbox" },
                        { "id": 22035281, "nama": "Memar", "satuan": "", "type": "checkbox" },
                        { "id": 22035282, "nama": "Kering", "satuan": "", "type": "checkbox" },
                        { "id": 22035283, "nama": "Lembab", "satuan": "", "type": "checkbox" },
                        { "id": 22035284, "nama": "Bersisik", "satuan": "", "type": "checkbox" },
                        { "id": 22035285, "nama": "Peechiae", "satuan": "", "type": "checkbox" },
                        { "id": 22035286, "nama": "Pucat", "satuan": "", "type": "checkbox" },
                        { "id": 22035287, "nama": "Ikterik", "satuan": "", "type": "checkbox" },
                        { "id": 22035288, "nama": "Kemerahan", "satuan": "", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "nama": "Luka Gangren",
                    "detail": [
                        { "id": 22035289, "nama": "Tidak Ada", "satuan": "", "type": "checkbox" },
                        { "id": 22035290, "nama": "Ada, Lokasi", "satuan": "", "type": "checkbox" },
                        { "id": 22035291, "nama": "", "satuan": "", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "Turgor",
                    "detail": [
                        { "id": 22035292, "nama": "Baik", "satuan": "", "type": "checkbox" },
                        { "id": 22035293, "nama": "Sedang", "satuan": "", "type": "checkbox" },
                        { "id": 22035294, "nama": "Jelek", "satuan": "", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "nama": "N. Urinari",
                    "detail": [
                        { "id": 22035295, "nama": "Normal", "satuan": "", "type": "checkbox" },
                        { "id": 22035296, "nama": "Inkontinensia", "satuan": "", "type": "checkbox" },
                        { "id": 22035297, "nama": "Dysuria", "satuan": "", "type": "checkbox" },
                        { "id": 22035298, "nama": "Nocturia", "satuan": "", "type": "checkbox" },
                        { "id": 22035299, "nama": "Retensi", "satuan": "", "type": "checkbox" },
                        { "id": 22035300, "nama": "Hematuni", "satuan": "", "type": "checkbox" },
                        { "id": 22035301, "nama": "Pyuria", "satuan": "", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "nama": "O. Muskulo-skelatal",
                    "detail": [
                        { "id": 22035302, "nama": "Normal", "satuan": "", "type": "checkbox" },
                        { "id": 22035303, "nama": "Skoliosis", "satuan": "", "type": "checkbox" },
                        { "id": 22035304, "nama": "Lordosis", "satuan": "", "type": "checkbox" },
                        { "id": 22035305, "nama": "Kiposis", "satuan": "", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "nama": "P. Abdomen",
                    "detail": [
                        { "id": 22035306, "nama": "Normal", "satuan": "", "type": "checkbox" },
                        { "id": 22035307, "nama": "Benjolan/Masa", "satuan": "", "type": "checkbox" },
                        { "id": 22035308, "nama": "Nyeri Tekan/Lepas/Ketuk", "satuan": "", "type": "checkbox" },
                        { "id": 22035309, "nama": "Jejas", "satuan": "", "type": "checkbox" },
                        { "id": 22035310, "nama": "Luka", "satuan": "", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "nama": "Q. Genitalia",
                    "detail": [
                        { "id": 22035311, "nama": "Normal", "satuan": "", "type": "checkbox" },
                        { "id": 22035312, "nama": "Benjolan/Masa", "satuan": "", "type": "checkbox" },
                        { "id": 22035313, "nama": "Luka", "satuan": "", "type": "checkbox" },
                    ]
                },
            ]

            $scope.listStatusBio = [
                {
                    "id": 1, "nama": "Status Biologis",
                    "detail": [
                        { "id": 22035314, "nama": "Pola Malan :", "satuan": "x/hari", "type": "textbox1" },
                        { "id": 22035315, "nama": "Terakhir jam :", "satuan": "", "type": "textbox1" },
                        { "id": 22035316, "nama": "Pola Minum :", "satuan": "cc/hari", "type": "textbox1" },
                        { "id": 22035317, "nama": "Terakhir jam :", "satuan": "", "type": "textbox1" },
                        { "id": 22035318, "nama": "BAK :", "satuan": "x/hari", "type": "textbox1" },
                        { "id": 22035319, "nama": "Terakhir jam :", "satuan": "", "type": "textbox2" },
                        { "id": 22035320, "nama": "Warna", "satuan": "", "type": "textbox2" },
                        { "id": 22035321, "nama": "BAB :", "satuan": "x/hari", "type": "textbox1" },
                        { "id": 22035322, "nama": "Terakhir jam :", "satuan": "", "type": "textbox1" },

                    ]
                },
                {
                    "id": 1, "nama": "Status Psikologis",
                    "detail": [
                        { "id": 22035323, "nama": "Cemas", "type": "checkbox" },
                        { "id": 22035324, "nama": "Takut", "type": "checkbox" },
                        { "id": 22035325, "nama": "Marah", "type": "checkbox" },
                        { "id": 22035326, "nama": "Sedih", "type": "checkbox" },
                        { "id": 22035327, "nama": "Kecenderungan bunuh diri", "type": "checkbox" },
                        { "id": 22035328, "nama": "dll", "type": "textbox" },
                        { "nama": "Status Mental", "type": "label" },
                        { "id": 22035329, "nama": "Kooperatif", "type": "checkbox" },
                        { "id": 22035330, "nama": "Tidak Kooperatif", "type": "checkbox" },
                        { "id": 22035331, "nama": "Gelisah atau delirum dan berontak", "type": "checkbox" },
                        { "id": 22035332, "nama": "Ketidakmampuan dalam mengikuti perintah", "type": "checkbox" },
                        { "nama": "Restrain", "type": "label" },
                        { "id": 22035333, "nama": "Tidak", "type": "checkbox" },
                        { "id": 22035334, "nama": "Ya, Lakukan Pengkajian Restrain", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "nama": "Status Sosial",
                    "detail": [
                        { "id": 22035335, "nama": "Pekerjaan :", "type": "textbox1" },
                        { "id": 22035336, "nama": "Kegiatan Sekarang :", "type": "textbox1" },
                        { "id": 22035337, "nama": "Nama Orang Terdekat :", "type": "textbox1" },
                        { "id": 22035338, "nama": "Orang yang tinggal serumah :", "type": "textbox1" },
                        { "id": 22035339, "nama": "Jumlah Anak :", "type": "textbox2" },
                        { "id": 22035340, "nama": "Jumlah Cucu :", "type": "textbox2" },
                        { "id": 22035341, "nama": "Jumlah Cicit :", "type": "textbox2" },
                        { "id": 22035342, "nama": "Alamat Rumah :", "type": "textbox" },
                        { "id": 22035343, "nama": "No. Telepon :", "type": "textbox" },

                    ]
                },
                {
                    "id": 1, "nama": "Spriritual dan Kulturasi",
                    "detail": [
                        { "nama": "Agama", "type": "label" },
                        { "id": 22035344, "nama": "Islam", "type": "checkbox" },
                        { "id": 22035345, "nama": "Protestan", "type": "checkbox" },
                        { "id": 22035346, "nama": "Katolik", "type": "checkbox" },
                        { "id": 22035347, "nama": "Hindu", "type": "checkbox" },
                        { "id": 22035348, "nama": "Budha", "type": "checkbox" },
                        { "id": 22035349, "nama": "Konghucu", "type": "checkbox" },
                        { "id": 22035350, "nama": "Lain-lain", "type": "checkbox" },
                        { "id": 22035351, "nama": "", "type": "textbox" },
                        { "nama": "Kegiatan Spiritual dan nilai nilai kepercayaan yang dilakukan", "type": "label" },
                        { "id": 22035352, "nama": "Ada, Sebutkan", "type": "checkbox" },
                        { "id": 22035353, "nama": "Tidak ada", "type": "checkbox" },
                        { "id": 22035354, "nama": "", "type": "textbox" },
                        { "nama": "Bahasa sehari-hari", "type": "label" },
                        { "id": 22035355, "nama": "Indonesia", "type": "checkbox" },
                        { "id": 22035356, "nama": "Inggris", "type": "checkbox" },
                        { "id": 22035357, "nama": "Daerah", "type": "checkbox" },
                        { "id": 22035358, "nama": "Lain-lain", "type": "textbox" },
                    ]
                },
            ]

            $scope.listStatusEkonomi = [
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "nama": "Cara Pembayaran", "type": "label" },
                        { "id": 22035359, "nama": "Pribadi", "type": "checkbox" },
                        { "id": 22035360, "nama": "Perusahaan", "type": "checkbox" },
                        { "id": 22035361, "nama": "Asuransi", "type": "checkbox" },
                        { "nama": "Pendapatan", "type": "label" },
                        { "id": 22035362, "nama": "UMR/rp", "type": "checkbox" },
                        { "id": 22035363, "nama": "UMR s/d 5 juta rp", "type": "checkbox" },
                        { "id": 22035364, "nama": "5 s/d 10 juta rp", "type": "checkbox" },
                        { "id": 22035365, "nama": "10 s/d 15 juta rp", "type": "checkbox" },
                        { "id": 22035366, "nama": "> 15 juta rp", "type": "checkbox" },
                    ]
                },
            ]

            $scope.listRiwayatKesehatanPasien = [
                {
                    "id": 1, "nama": "A. Pernah dirawat",
                    "detail": [
                        { "id": 22035367, "nama": "Ya", "type": "checkbox1" },
                        { "id": 22035368, "nama": "Kapan", "type": "textbox" },
                        { "id": 22035369, "nama": "Diagnosa", "type": "textbox" },
                        { "nama": "", "type": "label" },
                        { "id": 22035370, "nama": "Tidak", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "nama": "B. Apakah anda pernah mendapat obat pengencer darah (aspirin, warfarin, plavix)",
                    "detail": [
                        { "id": 22035371, "nama": "Tidak", "type": "checkbox" },
                        { "id": 22035372, "nama": "Ya, Kapan dihentikan ?", "type": "checkbox" },
                        { "id": 22035373, "nama": "", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "C. Apakah akhir-kahir ini Anda berpegian ke daerah Endemic Malaria (Lombok, NTT, Irian Jaya)",
                    "detail": [
                        { "id": 22035374, "nama": "Tidak", "type": "checkbox" },
                        { "id": 22035375, "nama": "Ya, Kapan", "type": "checkbox2" },
                        { "id": 22035376, "nama": "", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "D. Riwayat Kemoterapi",
                    "detail": [
                        { "id": 22035377, "nama": "Tidak", "type": "checkbox" },
                        { "id": 22035378, "nama": "Ya, Kapan", "type": "checkbox2" },
                        { "id": 22035379, "nama": "", "type": "textbox" },
                        { "id": 22035380, "nama": "", "satuan":"kali", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "E. Riwayat Ketergantungan",
                    "detail": [
                        { "id": 22035381, "nama": "Tidak Ada", "type": "checkbox" },
                        { "nama": "", "type": "label" },
                        { "id": 22035382, "nama": "Ada, berupa :", "type": "checkbox2" },
                        { "id": 22035383, "nama": "Obat-obatan", "type": "checkbox" },
                        { "id": 22035384, "nama": "Rokok", "type": "checkbox" },
                        { "id": 22035385, "nama": "Alkohol", "type": "checkbox" },
                        { "id": 22035386, "nama": "Sebutkan", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "F. Riwayat Pembedahan/Pemblusan",
                    "detail": [
                        { "nama": "Pernahkah Pasien dioperasi", "type": "label" },
                        { "id": 22035387, "nama": "Tidak Ada", "type": "checkbox2" },
                        { "id": 22035388, "nama": "", "type": "textbox" },
                        { "id": 22035389, "nama": "Operasi", "type": "textbox" },
                        { "nama": "", "type": "label" },
                        { "id": 22035390, "nama": "Tidak", "type": "checkbox" },
                        { "nama": "Pernahkah ada masalah dengan operasi/pembiusan Pasien", "type": "label" },
                        { "id": 22035391, "nama": "Ya, Sebutkan", "type": "checkbox2" },
                        { "id": 22035392, "nama": "", "type": "textbox" },
                        { "nama": "", "type": "label" },
                        { "id": 22035393, "nama": "Tidak", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "nama": "G. Penyakit Jantung & Pembuluh Darah",
                    "detail": [
                        { "id": 22035394, "nama": "Tidak Ada", "type": "checkbox" },
                        { "nama": "", "type": "label" },
                        { "id": 22035395, "nama": "Ada :", "type": "checkbox2" },
                        { "id": 22035396, "nama": "Infrak", "type": "checkbox" },
                        { "nama": "", "type": "label" },
                        { "id": 22035397, "nama": "Gangguan Irama Jantung, Pacemaker", "type": "checkbox" },
                        { "id": 22035398, "nama": "Ya", "type": "checkbox1" },
                        { "nama": "", "type": "label" },
                        { "id": 22035399, "nama": "Hypertensi", "type": "checkbox" },
                        { "id": 22035400, "nama": "Stroke/CVA", "type": "checkbox" },
                        { "id": 22035401, "nama": "Deep Vein Thrombosis", "type": "checkbox" },
                        { "nama": "", "type": "label" },
                        { "id": 22035402, "nama": "Lain-lain", "type": "checkbox2" },
                        { "id": 22035403, "nama": "", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "H. Penyakit Saluran Pernapasan",
                    "detail": [
                        { "id": 22035404, "nama": "Tidak Ada", "type": "checkbox" },
                        { "nama": "", "type": "label" },
                        { "id": 22035405, "nama": "Ada :", "type": "checkbox2" },
                        { "id": 22035406, "nama": "Asthma", "type": "checkbox2" },
                        { "id": 22035407, "nama": "TBC", "type": "checkbox2" },
                        { "id": 22035408, "nama": "Lain-lain", "type": "checkbox2" },
                        { "id": 22035409, "nama": "", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "I. Penyakit Infeksi",
                    "detail": [
                        { "id": 22035410, "nama": "Tidak Ada", "type": "checkbox" },
                        { "nama": "", "type": "label" },
                        { "id": 22035411, "nama": "Ada :", "type": "checkbox2" },
                        { "id": 22035412, "nama": "Typhus", "type": "checkbox" },
                        { "id": 22035413, "nama": "Gastro Enteritis", "type": "checkbox" },
                        { "nama": "", "type": "label" },
                        { "id": 22035414, "nama": "Hepatitis", "type": "checkbox2" },
                        { "id": 22035415, "nama": "A", "type": "checkbox1" },
                        { "id": 22035416, "nama": "B", "type": "checkbox1" },
                        { "id": 22035417, "nama": "C", "type": "checkbox1" },
                        { "nama": "", "type": "label" },
                        { "id": 22035418, "nama": "Lain-lain", "type": "checkbox2" },
                        { "id": 22035419, "nama": "", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "J. Penyakit Endokrin",
                    "detail": [
                        { "id": 22035420, "nama": "Tidak Ada", "type": "checkbox" },
                        { "nama": "", "type": "label" },
                        { "id": 22035421, "nama": "Ada :", "type": "checkbox2" },
                        { "id": 22035422, "nama": "Diabetes Melitus", "type": "checkbox2" },
                        { "id": 22035423, "nama": "Tyroid", "type": "checkbox2" },
                        { "id": 22035424, "nama": "Lain-lain", "type": "checkbox2" },
                        { "id": 22035425, "nama": "", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "K. Penyakit Ginjal & Saluran Kencing",
                    "detail": [
                        { "id": 22035426, "nama": "Tidak Ada", "type": "checkbox" },
                        { "nama": "", "type": "label" },
                        { "id": 22035427, "nama": "Ada :", "type": "checkbox2" },
                        { "id": 22035428, "nama": "Penyakit Ginjal", "type": "checkbox" },
                        { "nama": "", "type": "label" },
                        { "id": 22035429, "nama": "On Dialysis, AV Shunt", "type": "checkbox" },
                        { "id": 22035430, "nama": "Ya", "type": "checkbox1" },
                        { "id": 22035431, "nama": "Tidak", "type": "checkbox1" },
                        { "nama": "", "type": "label" },
                        { "id": 22035432, "nama": "Batu Ureter", "type": "checkbox" },
                        { "id": 22035433, "nama": "Lain-lain", "type": "checkbox2" },
                        { "id": 22035434, "nama": "", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "L. Penyakit Hematologi",
                    "detail": [
                        { "id": 22035435, "nama": "Tidak Ada", "type": "checkbox" },
                        { "nama": "", "type": "label" },
                        { "id": 22035436, "nama": "Ada :", "type": "checkbox2" },
                        { "id": 22035437, "nama": "Gangguan Pendarahan", "type": "checkbox" },
                        { "id": 22035438, "nama": "Mudah Hematom", "type": "checkbox" },
                        { "nama": "Pernahkah menerima transfusi", "type": "label" },
                        { "id": 22035439, "nama": "Tidak", "type": "checkbox" },
                        { "id": 22035440, "nama": "Ya, Reaksi", "type": "checkbox2" },
                        { "id": 22035441, "nama": "", "type": "textbox" },
                        { "nama": "", "type": "label" },
                        { "id": 22035442, "nama": "Lain-lain", "type": "checkbox2" },
                        { "id": 22035443, "nama": "", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "M. Lain - lain",
                    "detail": [
                        { "id": 22035444, "nama": "Tidak Ada", "type": "checkbox" },
                        { "nama": "", "type": "label" },
                        { "id": 22035445, "nama": "Ada :", "type": "checkbox2" },
                        { "id": 22035446, "nama": "Hemoroid", "type": "checkbox" },
                        { "id": 22035447, "nama": "Stoma", "type": "checkbox" },
                        { "id": 22035448, "nama": "Melena", "type": "checkbox" },
                        { "id": 22035449, "nama": "Hematemesis", "type": "checkbox" },
                        { "id": 22035450, "nama": "Lain-lain", "type": "checkbox2" },
                        { "id": 22035451, "nama": "", "type": "textbox" },
                    ]
                },
            ]

            $scope.listRiwayatAlergi = [
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 22035452, "nama": "Ya, Sebutkan :", "type": "checkbox" },
                        { "id": 22035453, "nama": "Tidak", "type": "checkbox" },
                        { "id": 22035454, "nama": "", "type": "textbox" },
                        { "id": 22035455, "nama": "Sticker tanda alergi dipasang (warna merah)", "type": "checkbox2" },
                        { "id": 22035456, "nama": "", "type": "textbox" },
                    ]
                },
            ]

            $scope.listScoreGambar = [
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 22035457, "nama": "0 = Tidak ada Nyeri", "type": "checkbox" },
                        { "id": 22035458, "nama": "1 - 3 = Nyeri Ringan", "type": "checkbox" },
                        { "id": 22035459, "nama": "4 - 6 = Nyeri Sedang", "type": "checkbox" },
                        { "id": 22035460, "nama": "7 - 10 = Nyeri Berat", "type": "checkbox" },
                    ]
                },
            ]

            $scope.listPenilaianNyeri = [
                {
                    "id": 1, "nama": "Penilaian Nyeri",
                    "detail": [
                        { "nama": "Provokatif", "type": "label" },
                        { "id": 22035461, "nama": "Ruda paksa", "type": "checkbox" },
                        { "id": 22035462, "nama": "Benturan", "type": "checkbox" },
                        { "id": 22035463, "nama": "Sayatan", "type": "checkbox" },
                        { "id": 22035464, "nama": "dll", "type": "textbox" },
                        { "nama": "Quality", "type": "label" },
                        { "id": 22035465, "nama": "Tertusuk", "type": "checkbox" },
                        { "id": 22035466, "nama": "Tertekan/tertindih", "type": "checkbox" },
                        { "id": 22035467, "nama": "Diiris-iris", "type": "checkbox" },
                        { "id": 22035468, "nama": "dll", "type": "textbox" },
                        { "nama": "Regional", "type": "label" },
                        { "id": 22035469, "nama": "Lokasi", "type": "checkbox1" },
                        { "id": 22035470, "nama": "", "type": "textbox" },
                        { "nama": "Menjalar", "type": "label" },
                        { "id": 22035471, "nama": "Tidak", "type": "checkbox" },
                        { "id": 22035472, "nama": "Ya, Ke :", "type": "checkbox2" },
                        { "id": 22035473, "nama": "", "type": "textbox" },
                        { "nama": "Scala", "type": "label" },
                        { "id": 22035474, "nama": "", "type": "textbox" },
                        { "nama": "Time", "type": "label" },
                        { "id": 22035475, "nama": "Jarang", "type": "checkbox" },
                        { "id": 22035476, "nama": "Hilang timbul", "type": "checkbox" },
                        { "id": 22035477, "nama": "Terus menerus", "type": "checkbox" },
                    ]
                },
            ]

            $scope.listPengkajian = [
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "nama": "A", "type": "label" },
                        { "nama": "Cara Bejalan Pasien (salah satu atau lebih) <br> 1. Tidak seimbang/sempoyongan/limbung <br> 2. Jalan dengan menggunakan alat bantu (kruk, tripot, kursi roda, orang lain)", "type": "label" },
                        { "id": 22035478, "nama": "", "type": "checkbox" },
                        { "id": 22035479, "nama": "", "type": "checkbox" },

                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "nama": "B", "type": "label" },
                        { "nama": "Menopang saat akan duduk : tampak memegang pinggiran kursi atau meja/benda lain sebagai penopang saat akan duduk.", "type": "label" },
                        { "id": 22035480, "nama": "", "type": "checkbox" },
                        { "id": 22035481, "nama": "", "type": "checkbox" },
                    ]
                }
            ]
            $scope.listHasil = [
                {
                    "id": 1, "nama": "1.",
                    "detail": [
                        { "nama": "Tidak Beresiko", "type": "label" },
                        { "nama": "Tidak ditemukan A & B", "type": "label" },
                        { "id": 22035482, "nama": "", "type": "textarea" },
                    ]
                },
                {
                    "id": 1, "nama": "2.",
                    "detail": [
                        { "nama": "Risiko Rendah", "type": "label" },
                        { "nama": "Ditemukan salah satu A/B", "type": "label" },
                        { "id": 22035483, "nama": "", "type": "textarea" },
                    ]
                },
                {
                    "id": 1, "nama": "3.",
                    "detail": [
                        { "nama": "Risiko tinggi", "type": "label" },
                        { "nama": "Ditemukan A & B", "type": "label" },
                        { "id": 22035484, "nama": "", "type": "textarea" },
                    ]
                },
                
            ]
            $scope.listTindakan = [
                {
                    "id": 1, "nama": "1.",
                    "detail": [
                        { "nama": "Tidak beresiko", "type": "label" },
                        { "nama": "Tidak ada tindakan", "type": "label" },
                        { "id": 22035485, "nama": "", "type": "checkbox" },
                        { "id": 22035486, "nama": "", "type": "checkbox" },
                        { "id": 22035487, "nama": "", "type": "combobox" },
                    ]
                },
                {
                    "id": 1, "nama": "2.",
                    "detail": [
                        { "nama": "Resiko rendah", "type": "label" },
                        { "nama": "Edukasi", "type": "label" },
                        { "id": 22035488, "nama": "", "type": "checkbox" },
                        { "id": 22035489, "nama": "", "type": "checkbox" },
                        { "id": 22035490, "nama": "", "type": "combobox" },
                    ]
                },
                {
                    "id": 1, "nama": "3.",
                    "detail": [
                        { "nama": "Resiko tinggi", "type": "label" },
                        { "nama": "Pasang pita/stiker resiko jatuh", "type": "label" },
                        { "id": 22035491, "nama": "", "type": "checkbox" },
                        { "id": 22035492, "nama": "", "type": "checkbox" },
                        { "id": 22035493, "nama": "", "type": "combobox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "nama": "", "type": "label" },
                        { "nama": "Edukasi", "type": "label" },
                        { "id": 22035494, "nama": "", "type": "checkbox" },
                        { "id": 22035495, "nama": "", "type": "checkbox" },
                        { "id": 22035496, "nama": "", "type": "combobox" },
                    ]
                },
            ]

            $scope.listAssementFungsional = [
                {
                    "id": 1, "nama": "Sensorik",
                    "detail": [
                        { "nama": "Penglihatan", "type": "label" },
                        { "id": 22035497, "nama": "Normal", "type": "checkbox" },
                        { "id": 22035498, "nama": "Kabur", "type": "checkbox" },
                        { "id": 22035499, "nama": "Kacamata", "type": "checkbox" },
                        { "id": 22035500, "nama": "Lensa kotak", "type": "checkbox" },
                        { "nama": "Penciuman", "type": "label" },
                        { "id": 22035501, "nama": "Normal", "type": "checkbox" },
                        { "id": 22035502, "nama": "Tidak", "type": "checkbox" },
                        { "nama": "Pendengaran", "type": "label" },
                        { "id": 22035503, "nama": "Normal", "type": "checkbox" },
                        { "id": 22035504, "nama": "Tuli kanan/kiri", "type": "checkbox" },
                        { "id": 22035505, "nama": "Alat bantu dengan kanan/kiri", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "nama": "Kognitif",
                    "detail": [
                        { "id": 22035506, "nama": "Orientasi penuh", "type": "checkbox" },
                        { "id": 22035507, "nama": "Pelupa", "type": "checkbox" },
                        { "id": 22035508, "nama": "Bingung", "type": "checkbox" },
                        { "id": 22035509, "nama": "Tidak dapat dimengerti", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "nama": "Motorik",
                    "detail": [
                        { "nama": "Aktifitas sehari-hari", "type": "label" },
                        { "id": 22035510, "nama": "Mandiri", "type": "checkbox" },
                        { "id": 22035511, "nama": "Bantuan Minimal", "type": "checkbox" },
                        { "id": 22035512, "nama": "Bantuan Sebagian", "type": "checkbox" },
                        { "id": 22035513, "nama": "Ketergantungan Total", "type": "checkbox" },
                        { "nama": "Berjalan", "type": "label" },
                        { "id": 22035514, "nama": "Tidak ada kesulitan", "type": "checkbox" },
                        { "id": 22035515, "nama": "Perlu bantuan", "type": "checkbox" },
                        { "id": 22035516, "nama": "Sering Jatuh", "type": "checkbox" },
                        { "id": 22035517, "nama": "Kelumpuhan", "type": "checkbox" },
                    ]
                },
            ]

            $scope.listNutrisional = [
                {
                    "id": 1, "no": 1, "nama": "Apakah ada penurunan berat badan yang tidak diinginkan selama 6 bulan terakhir ?",
                    "detail": [
                        { "id": 22035518, "nama": "a. Tidak", "descNilai" : "0", "type": "checkbox" },
                        { "id": 22035519, "nama": "b. Tidak Yakin", "descNilai" : "2", "type": "checkbox" },
                        { "nama": "(Tanda: ukuran baju atau celana menjadi lebih longgar)", "type": "label" },
                        { "id": 22035520, "nama": "c. Ya, 1-5 Kg", "descNilai" : "1", "type": "checkbox" },
                        { "id": 22035521, "nama": "6-10 Kg", "descNilai" : "2", "type": "checkbox" },
                        { "id": 22035522, "nama": "11-15 Kg", "descNilai" : "3", "type": "checkbox" },
                        { "id": 22035523, "nama": "> 15 Kg", "descNilai" : "4", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "no": 2, "nama": "Apakah asupan makan menurun yang dikarenakan adanya penurunan nafsu makan/kesulitan menerima makan ?",
                    "detail": [
                        { "id": 22035524, "nama": "Tidak", "descNilai" : "0", "type": "checkbox" },
                        { "id": 22035525, "nama": "Tidak yakin", "descNilai" : "1", "type": "checkbox" },
                    ]
                },
            ]

            $scope.listNorton = [
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "nama": "1", "type": "label" },
                        { "nama": "Baik", "type": "label" },
                        { "id": 22035527, "nama": "", "descNilai": "1", "target": "22035532", "type": "checkbox" },
                        { "nama": "Waspada", "type": "label" },
                        { "id": 22035528, "nama": "", "descNilai": "1", "target": "22035532", "type": "checkbox" },
                        { "nama": "Ambulasi baik", "type": "label" },
                        { "id": 22035529, "nama": "", "descNilai": "1", "target": "22035532", "type": "checkbox" },
                        { "nama": "Penuh", "type": "label" },
                        { "id": 22035530, "nama": "", "descNilai": "1", "target": "22035532", "type": "checkbox" },
                        { "nama": "Kontinen", "type": "label" },
                        { "id": 22035531, "nama": "", "descNilai": "1", "target": "22035532", "type": "checkbox" },
                        { "id": 22035532, "nama": "", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "nama": "2", "type": "label" },
                        { "nama": "Cukup", "type": "label" },
                        { "id": 22035533, "nama": "", "descNilai": "2", "target": "22035538", "type": "checkbox" },
                        { "nama": "Apatis", "type": "label" },
                        { "id": 22035534, "nama": "", "descNilai": "2", "target": "22035538", "type": "checkbox" },
                        { "nama": "Perlu bantuan", "type": "label" },
                        { "id": 22035535, "nama": "", "descNilai": "2", "target": "22035538", "type": "checkbox" },
                        { "nama": "Terbatas", "type": "label" },
                        { "id": 22035536, "nama": "", "descNilai": "2", "target": "22035538", "type": "checkbox" },
                        { "nama": "Kadang inkontinen", "type": "label" },
                        { "id": 22035537, "nama": "", "descNilai": "2", "target": "22035538", "type": "checkbox" },
                        { "id": 22035538, "nama": "", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "nama": "3", "type": "label" },
                        { "nama": "Lemah", "type": "label" },
                        { "id": 22035539, "nama": "", "descNilai": "3", "target": "22035544", "type": "checkbox" },
                        { "nama": "Bingun", "type": "label" },
                        { "id": 22035540, "nama": "", "descNilai": "3", "target": "22035544", "type": "checkbox" },
                        { "nama": "Tidak bisa pindah bed", "type": "label" },
                        { "id": 22035541, "nama": "", "descNilai": "3", "target": "22035544", "type": "checkbox" },
                        { "nama": "Sangat Terbatas", "type": "label" },
                        { "id": 22035542, "nama": "", "descNilai": "3", "target": "22035544", "type": "checkbox" },
                        { "nama": "Inkontinen BAK", "type": "label" },
                        { "id": 22035543, "nama": "", "descNilai": "3", "target": "22035544", "type": "checkbox" },
                        { "id": 22035544, "nama": "", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "nama": "4", "type": "label" },
                        { "nama": "Sangat lemah", "type": "label" },
                        { "id": 22035545, "nama": "", "descNilai": "4", "target": "22035550", "type": "checkbox" },
                        { "nama": "Tak sadar", "type": "label" },
                        { "id": 22035546, "nama": "", "descNilai": "4", "target": "22035550", "type": "checkbox" },
                        { "nama": "Tidak bergerak", "type": "label" },
                        { "id": 22035547, "nama": "", "descNilai": "4", "target": "22035550", "type": "checkbox" },
                        { "nama": "Imobilisasi", "type": "label" },
                        { "id": 22035548, "nama": "", "descNilai": "4", "target": "22035550", "type": "checkbox" },
                        { "nama": "Inkontinen BAB & BAK", "type": "label" },
                        { "id": 22035549, "nama": "", "descNilai": "4", "target": "22035550", "type": "checkbox" },
                        { "id": 22035550, "nama": "", "type": "textbox" },
                    ]
                },
            ]

            $scope.listKebutuhanEdukasi = [
                {
                    "id": 1, "nama": "A. Terdapat hambatan dalam pembelajaran",
                    "detail": [
                        { "id": 22035553, "nama": "Tidak", "type": "checkbox" },
                        { "id": 22035554, "nama": "Ya", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "nama": "B. Jika ya, sebutkan hambatan (bisa dipilih lebih dari satu) :",
                    "detail": [
                        { "id": 22035555, "nama": "Pendengaran", "type": "checkbox" },
                        { "id": 22035556, "nama": "Penglihatan", "type": "checkbox" },
                        { "id": 22035557, "nama": "Kognitif", "type": "checkbox" },
                        { "id": 22035558, "nama": "Fisik", "type": "checkbox" },
                        { "id": 22035559, "nama": "Budaya", "type": "checkbox" },
                        { "id": 22035560, "nama": "Agama", "type": "checkbox" },
                        { "id": 22035561, "nama": "Emosi", "type": "checkbox" },
                        { "id": 22035562, "nama": "Bahasa", "type": "checkbox" },
                        { "id": 22035563, "nama": "Lain-lain", "type": "checkbox" },
                        { "id": 22035564, "nama": "", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "C. Dibutuhkan penerjemah",
                    "detail": [
                        { "id": 22035565, "nama": "Tidak", "type": "checkbox" },
                        { "id": 22035566, "nama": "Ya, jika ya sebutkan", "type": "checkbox" },
                        { "id": 22035567, "nama": "", "type": "textbox" },
                    ]
                },
                {
                    "id": 1, "nama": "D. Kebutuhan pembelajaran pasien (pilih topik pembelajaran pada kotak yang tersedia)",
                    "detail": [
                        { "id": 22035568, "nama": "Diagnosa & Manajemen", "type": "checkbox" },
                        { "id": 22035569, "nama": "Obat-obtan", "type": "checkbox" },
                        { "id": 22035570, "nama": "Perawatan Luka", "type": "checkbox" },
                        { "id": 22035571, "nama": "Rehabilitasi", "type": "checkbox" },
                        { "id": 22035572, "nama": "Manajemen nyeri", "type": "checkbox" },
                        { "id": 22035573, "nama": "Diet dan nutrisi", "type": "checkbox" },
                        { "id": 22035574, "nama": "Lain-lainnya", "type": "checkbox" },
                        { "id": 22035575, "nama": "", "type": "textbox" },
                    ]
                },
            ]

            $scope.listPerencanaanPulang = [
                {
                    "id": 1, "nama": "Kriteria Discharge Planning :",
                    "detail": [
                        { "nama": "A. Umur > 65 tahun", "type": "label" },
                        { "id": 22035576, "nama": "Ya", "type": "checkbox" },
                        { "id": 22035577, "nama": "Tidak", "type": "checkbox" },
                        { "nama": "B. Keterbatasan mobilitas", "type": "label" },
                        { "id": 22035578, "nama": "Ya", "type": "checkbox" },
                        { "id": 22035579, "nama": "Tidak", "type": "checkbox" },
                        { "nama": "C. Perawatan atau pengobatan lanjutan", "type": "label" },
                        { "id": 22035580, "nama": "Ya", "type": "checkbox" },
                        { "id": 22035581, "nama": "Tidak", "type": "checkbox" },
                        { "nama": "D. Bantuan untuk melakukan aktifitas sehari-hari", "type": "label" },
                        { "id": 22035582, "nama": "Ya", "type": "checkbox" },
                        { "id": 22035583, "nama": "Tidak", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "nama": "Bila salah satu jawaban 'Ya' dari kriteria perencanaan pulang diatas, maka akan dilanjutkan dengan perencanaan pulang sebagai berikut :",
                    "detail": [
                        { "id": 22035584, "nama": "Perawatan diri (mandi, BAB, BAK)", "type": "checkbox2" },
                        { "id": 22035585, "nama": "Latihan fisik lanjutan", "type": "checkbox2" },
                        { "id": 22035586, "nama": "Pemantauan pemberian obat", "type": "checkbox2" },
                        { "id": 22035587, "nama": "Pendampingan tenaga khusus di rumah", "type": "checkbox2" },
                        { "id": 22035588, "nama": "Pemantauan diet", "type": "checkbox2" },
                        { "id": 22035589, "nama": "Bantuan medis/perawat di rumah (home care)", "type": "checkbox2" },
                        { "id": 22035590, "nama": "Perawatan luka", "type": "checkbox2" },
                        { "id": 22035591, "nama": "Bantuan untuk melakukan aktifitas fisik (kursi roda, alat bantu jalan)", "type": "checkbox2" },
                    ]
                },
            ]

            $scope.listDiagnosaKeperatawan = [
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 22035592, "nama": "Nyeri", "type": "checkbox" },
                        { "id": 22035593, "nama": "Suhu Tubuh", "type": "checkbox" },
                        { "id": 22035594, "nama": "Prefusi Jaringan", "type": "checkbox" },
                        { "id": 22035595, "nama": "Pola Tidur", "type": "checkbox" },
                        { "id": 22035596, "nama": "Eliminasi", "type": "checkbox" },
                        { "id": 22035597, "nama": "Konflik Peran", "type": "checkbox" },
                        { "id": 22035598, "nama": "Mobilitas/Aktivitas", "type": "checkbox" },
                        { "id": 22035599, "nama": "Pengetahuan/Komunikasi", "type": "checkbox" },
                        { "id": 22035600, "nama": "Jalan Nafas/Pertukaran Gas", "type": "checkbox" },
                        { "id": 22035601, "nama": "Integrasi Kulit", "type": "checkbox" },
                        { "id": 22035602, "nama": "Keseimbangan Cairan dan Elektrolit", "type": "checkbox" },
                        { "id": 22035603, "nama": "Lain-lain", "type": "checkbox2" },
                        { "id": 22035604, "nama": "", "type": "textbox" },
                        { "id": 22035605, "nama": "Sensori Persepsi", "type": "checkbox" },
                        { "id": 22035606, "nama": "Cemas", "type": "checkbox" },
                        { "id": 22035607, "nama": "Resti Infeksi", "type": "checkbox" },
                    ]
                },
                {
                    "id": 1, "nama": "Data Penunjang",
                    "detail": [
                        { "id": 22035608, "nama": "Lab", "type": "checkbox" },
                        { "id": 22035609, "nama": "Radiologi", "type": "checkbox" },
                        { "id": 22035610, "nama": "EKG", "type": "checkbox" },
                    ]
                },
            ]

            $scope.listNamaPengkaji = [
                {
                    "id": 1, "nama": "Tanggal & Jam",
                    "detail": [
                        { "id": 22035611, "nama": "", "type": "datetime" },
                    ]
                },
                {
                    "id": 1, "nama": "Nama Perawat",
                    "detail": [
                        { "id": 22035612, "nama": "", "type": "combobox" },
                    ]
                    
                },
            ]

            $scope.listSkorWong = [
                {
                    "id": 1, "nama": "Score ",
                    "detail": [
                        { "id": 22035613, "nama": "0 - 1= Tidak Ada Nyeri", "type": "checkbox"},
                        { "id": 22035614, "nama": "2 - 3= Sedikit Nyeri", "type": "checkbox"},
                        { "id": 22035615, "nama": "4 - 5= Cukup Nyeri", "type": "checkbox" },
                        { "id": 22035616, "nama": "6 - 7= Lumayan Nyeri", "type": "checkbox"},
                        { "id": 22035617, "nama": "8 - 9= Sangat Nyeri", "type": "checkbox"},
                        { "id": 22035618, "nama": "10= Amat Sangat Nyeri", "type": "checkbox", },
                    ]
                },
            ]

            var cacheNomorEMR = cacheHelper.get('cacheNomorEMR');
            if (cacheNomorEMR != undefined) {
                nomorEMR = cacheNomorEMR[0]
                $scope.cc.norec_emr = nomorEMR
                $scope.cc.tanggalEmrl = cacheNomorEMR[2]
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
                $scope.cc.alamat = chacePeriode[15]
                $scope.cc.tglLahir = chacePeriode[18]
                if (nomorEMR == '-') {
                    $scope.cc.norec_emr = '-'
                } else {
                    $scope.cc.norec_emr = nomorEMR
                }
            }
            var chekedd = false

            // // RESEP OBAT
            // $scope.columnGrid = [
            //     {
            //         "field": "no",
            //         "title": "No",
            //         "width": "30px",
            //     },
            //     {
            //         "field": "namaruangandepo",
            //         "title": "Depo",
            //         "width": "100px",
            //     },
            //     {
            //         "field": "namaproduk",
            //         "title": "Deskripsi",
            //         "width": "200px",
            //     },
            //     {
            //         "field": "jumlah",
            //         "title": "Qty",
            //         "width": "40px",
            //     },
            //     {
            //         "field": "dosis",
            //         "title": "Dosis",
            //         "width": "40px",
            //     },
            //     // {
            //     //     "template": "<input type='checkbox' class='checkbox' ng-click='onClick($event)' />",
            //     //     "width": 40
            //     // },
            //     // {
            //     //     "field": "tglpelayanan",
            //     //     "title": "Tgl Pelayanan",
            //     //     "width": "90px",
            //     // },
            //     // {
            //     //     "field": "noregistrasi",
            //     //     "title": "No.Registrasi",
            //     //     "width": "100px",
            //     // },
            //     // {
            //     //     "field": "noresep",
            //     //     "title": "No.Resep",
            //     //     "width": "100px",
            //     // },
            //     // {
            //     //     "field": "rke",
            //     //     "title": "R/ke",
            //     //     "width": "30px",
            //     // },
            //     // {
            //     //     "field": "jeniskemasan",
            //     //     "title": "Kemasan",
            //     //     "width": "80px",
            //     // },
            //     // {
            //     //     "field": "satuanstandar",
            //     //     "title": "Satuan",
            //     //     "width": "80px",
            //     // },
            //     // {
            //     //     "field": "hargasatuan",
            //     //     "title": "Harga Satuan",
            //     //     "width": "100px",
            //     //     "template": "<span class='style-right'>{{formatRupiah('#: hargasatuan #', '')}}</span>"
            //     // },
            //     // {
            //     //     "field": "hargadiscount",
            //     //     "title": "Harga Discount",
            //     //     "width": "100px",
            //     //     "template": "<span class='style-right'>{{formatRupiah('#: hargadiscount #', '')}}</span>"
            //     // },
            //     // {
            //     //     "field": "jasa",
            //     //     "title": "Jasa",
            //     //     "width": "70px",
            //     //     "template": "<span class='style-right'>{{formatRupiah('#: jasa #', '')}}</span>"
            //     // },
            //     // {
            //     //     "field": "total",
            //     //     "title": "Total",
            //     //     "width": "100px",
            //     //     "template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>"
            //     // },
            //     // {
            //     //     "field": "nostruk",
            //     //     "title": "No Struk",
            //     //     "width": "100px"
            //     // }
            // ];

            // medifirstService.get("farmasi/get-transaksi-pelayanan?noReg=" + $scope.cc.noregistrasi).then(function (dat) {
            //     $scope.isRouteLoading = false;
            //     for (var i = 0; i < dat.data.length; i++) {
            //         dat.data[i].no = i + 1
            //         dat.data[i].total = parseFloat(dat.data[i].jumlah) * (parseFloat(dat.data[i].hargasatuan) - parseFloat(dat.data[i].hargadiscount))
            //         dat.data[i].total = parseFloat(dat.data[i].total) + parseFloat(dat.data[i].jasa)
            //     }
            //     $scope.dataGrid = dat.data;

            // });


            // // END RESEPOBAT


            // // DIAGNOSA
            // medifirstService.getPart("emr/get-combo-icd9", true, true, 10).then(function (data) {
            //     $scope.listDiagnosaTindakan = data;
            // });
            // medifirstService.getPart("emr/get-combo-icd10", true, true, 10).then(function (data) {
            //     $scope.listDiagnosa = data;
            // });
            // medifirstService.get('emr/get-combo-diagnosis').then(function (data) {
            //     $scope.listJenisDiagnosa = data.data.jenisdiagnosa;
            // });

            
            // // ICD 10
            // function validasiIcd10() {
            //     var listRawRequired = [
            //         "item.diagnosa|k-ng-model|kode / Nama Diagnosa",
            //         "item.jenisDiagnosis|k-ng-model|kode / Jenis Diagnosa"
            //     ]
            //     var isValid = ModelItem.setValidation($scope, listRawRequired);
            //     if (isValid.status) {
            //         var norec_diagnosapasien = "";
            //         var tglinput = "";
            //         if ($scope.dataIcd10Selected != undefined) {
            //             norec_diagnosapasien = $scope.dataIcd10Selected.norec_diagnosapasien
            //             tglinput = $scope.dataIcd10Selected.tglinputdiagnosa
            //         } else {
            //             tglinput = moment($scope.now).format('YYYY-MM-DD hh:mm:ss')
            //         }
            //         var keterangan = "";
            //         if ($scope.item.keterangan == undefined) {
            //             keterangan = "-"
            //         }
            //         else {
            //             keterangan = $scope.item.keterangan
            //         }

            //         $scope.now = new Date();
            //         var data = {
            //             norec_dp: norec_diagnosapasien,
            //             noregistrasifk: $scope.cc.norec,
            //             tglregistrasi: moment($scope.item.tglregistrasi).format('YYYY-MM-DD hh:mm:ss'),
            //             objectdiagnosafk: $scope.item.diagnosa.id,
            //             objectjenisdiagnosafk: $scope.item.jenisDiagnosis.id,
            //             tglinputdiagnosa: tglinput,
            //             keterangan: keterangan,
            //             kasusbaru: $scope.item.kasusbaru,
            //             kasuslama: $scope.item.kasuslama
            //         }
            //         $scope.objSave = {
            //             detaildiagnosapasien: data,
            //         }
            //     } else {
            //         ModelItem.showMessages(isValid.messages)
            //     }
            // }


            // $scope.saveIcd10 = function () {
            //     if(medifirstService.getPegawai().jenisPegawai != undefined && medifirstService.getPegawai().jenisPegawai.jenispegawai !='DOKTER'){
            //         toastr.error('Hanya Dokter yang bisa mengisi Diagnosis','Peringatan')
            //         return
            //     }
            //     validasiIcd10();
            //     console.log(JSON.stringify($scope.objSave));
            //     medifirstService.post('emr/save-diagnosa-pasien', $scope.objSave).then(function (e) {
            //         $scope.savePeriksaDokter()
            //         medifirstService.postLogging('Diagnosis', 'Norec DiagnosaPasien_T', e.data.data.norec,
            //             'Input Diagnosis ICD 10 ( ' + $scope.item.diagnosa.kdDiagnosa + '-' + $scope.item.diagnosa.namaDiagnosa + ' )' + ' No Registrasi ' + $scope.item.noregistrasi
            //             + '/ ' + $scope.item.noMr
            //         ).then(function (res) {
            //         })
            //         delete $scope.item.jenisDiagnosis;
            //         delete $scope.item.diagnosa;
            //         delete $scope.item.keterangan;
            //         delete $scope.dataIcd10Selected;
            //         loadDiagnosa()
            //     })
            // }


            // $scope.savePeriksaDokter=  function(){debugger
            //     var kelompokUser = medifirstService.getKelompokUser()
            //     // var chacePeriode = cacheHelper.get('InputTindakanPelayananDokterRevCtrl');
            //     if(kelompokUser== 'dokter' ){
            //         var data ={
            //             "norec_apd" :$scope.cc.norec,
            //             "kelompokUser" : kelompokUser
            //         }

            //         medifirstService.postNonMessage('rawatjalan/save-periksa',data)
            //         .then(function (res) {

            //         })
            //     }
            // }

            // $scope.deleteIcd10 = function () {
            //     if ($scope.item.diagnosa == undefined) {
            //         alert("Pilih data yang mau di hapus!!")
            //         return
            //     }
            //     debugger
            //     var diagnosa = {
            //         norec_dp: $scope.dataIcd10Selected.norec_diagnosapasien
            //     }
            //     debugger
            //     var objDelete =
            //     {
            //         diagnosa: diagnosa,
            //     }
            //     debugger
            //     medifirstService.post('emr/delete-diagnosa-pasien', objDelete).then(function (e) {
            //     debugger
            //         medifirstService.postLogging('Diagnosis', 'Norec DiagnosaPasien_T', '',
            //             'Hapus Diagnosis ICD 10 ( ' + $scope.dataIcd10Selected.kddiagnosa + '-' + $scope.dataIcd10Selected.namadiagnosa + ' )' + ' No Registrasi ' + $scope.item.noregistrasi
            //             + '/ ' + $scope.item.noMr

            //         ).then(function (res) {
            //         })
            //         delete $scope.item.jenisDiagnosis;
            //         delete $scope.item.diagnosa;
            //         delete $scope.item.keterangan;
            //         delete $scope.dataIcd10Selected
            //         loadDiagnosa()


            //     })
            // }

            // // ICD 9
            // function validasi() {
            //     var listRawRequired = [
            //         "item.diagnosaTindakan|k-ng-model|kode / Nama Diagnosa"
            //     ]
            //     var isValid = ModelItem.setValidation($scope, listRawRequired);
            //     if (isValid.status) {debugger
            //         var norec_diagnosapasien = "";
            //         if ($scope.dataIcd9Selected != undefined) {
            //             norec_diagnosapasien = $scope.dataIcd9Selected.norec_diagnosapasien
            //         }
            //         var ketTindakans = "";
            //         if ($scope.item.ketTindakan != undefined) {
            //             ketTindakans = $scope.item.ketTindakan
            //         }
            //         var data = {
            //             norec_dp: norec_diagnosapasien,
            //             objectpasienfk: $scope.cc.norec,
            //             tglpendaftaran: $scope.item.tglRegistrasi,
            //             objectdiagnosatindakanfk: $scope.item.diagnosaTindakan.id,
            //             keterangantindakan: ketTindakans
            //         }

            //         $scope.objSave =
            //             {
            //                 detaildiagnosatindakanpasien: data,
            //             }
            //     } else {debugger
            //         ModelItem.showMessages(isValid.messages)
            //     }
            // }
            // $scope.saveIcd9 = function () {
            //      if(medifirstService.getPegawai().jenisPegawai != undefined && medifirstService.getPegawai().jenisPegawai.jenispegawai !='DOKTER'){
            //         toastr.error('Hanya Dokter yang bisa mengisi Diagnosis','Peringatan')
            //         return
            //     }
            //     validasi();
            //     debugger
            //     console.log(JSON.stringify($scope.objSave));
            //     medifirstService.post('emr/save-diagnosa-tindakan-pasien', $scope.objSave).then(function (e) {

            //         medifirstService.postLogging('Diagnosis', 'Norec DiagnosaTindakanPasien_T', e.data.data.norec,
            //             'Input Diagnosis ICD 9 ( ' + $scope.item.diagnosaTindakan.kdDiagnosaTindakan + '-' + $scope.item.diagnosaTindakan.namaDiagnosaTindakan + ' )' + ' No Registrasi ' + $scope.item.noregistrasi
            //             + '/ ' + $scope.item.noMr

            //         ).then(function (res) {
            //         })
            //         delete $scope.item.diagnosaTindakan;
            //         delete $scope.item.ketTindakan;
            //         delete $scope.dataIcd9Selected;
            //         loadDiagnosa()
            //     })
            // }
            // $scope.deleteIcd9 = function () {
            //     if ($scope.item.diagnosaTindakan == undefined) {
            //         alert("Pilih data yang mau di hapus!!")
            //         return
            //     }
            //     var diagnosa = {
            //         norec_dp: $scope.dataIcd9Selected.norec_diagnosapasien
            //     }
            //     var objDelete =
            //     {
            //         diagnosa: diagnosa,
            //     }
            //     medifirstService.post('emr/delete-diagnosa-tindakan-pasien', objDelete).then(function (e) {
            //         medifirstService.postLogging('Diagnosis', 'Norec DiagnosaTindakanPasien_T', '',
            //             'Hapus Diagnosis ICD 9 ( ' + $scope.dataIcd9Selected.kddiagnosatindakan + '-' + $scope.dataIcd9Selected.namadiagnosatindakan + ' )' + ' No Registrasi ' + $scope.item.noregistrasi
            //             + '/ ' + $scope.item.noMr

            //         ).then(function (res) {
            //         })
            //         delete $scope.item.diagnosaTindakan;
            //         delete $scope.item.ketTindakan;
            //         delete $scope.dataIcd9Selected
            //         loadDiagnosa()

            //     })
            // }



            // $scope.batal = function () {
            //     delete $scope.item.diagnosaTindakan;
            //     delete $scope.item.ketTindakan;
            //     delete $scope.item.jenisDiagnosis;
            //     delete $scope.item.diagnosa;
            //     delete $scope.item.keterangan;
            // }

            // loadDiagnosa();
            // function loadDiagnosa() {
            //     $scope.isRouteLoading = true;
            //     var param =""
            //     if($scope.item.isNoRegis == true)
            //        param = "noReg=" + $scope.item.noregistrasi;
            //     else
            //       param = "noCm=" + $scope.item.noMr;
              
            //     medifirstService.get("emr/get-diagnosapasienbynoregicd9?"
            //         + param
            //     ).then(function (data) {
            //         $scope.isRouteLoading = false;
            //         var dataICD9 = data.data.datas;
            //         $scope.dataSourceDiagnosaIcd9 = new kendo.data.DataSource({
            //             data: dataICD9,
            //             pageSize: 10
            //         });
            //     });

            //     medifirstService.get("emr/get-diagnosapasienbynoreg?"
            //         + param
            //     ).then(function (data) {
            //         // $scope.isRouteLoading = false;
            //         var dataICD10 = data.data.datas;
            //         $scope.dataSourceDiagnosaIcd10 = new kendo.data.DataSource({
            //             data: dataICD10,
            //             pageSize: 10
            //         });
            //     });
            // }



            // $scope.columnDiagnosaIcd9 = [{
            //     "title": "No",
            //     "template": "{{dataSourceDiagnosaIcd9.indexOf(dataItem) + 1}}",
            //     // "width": "30px"
            // }, 
            // {
            //     "field": "noregistrasi",
            //     "title": "No Registrasi",
            //     // "width": "100px"
            // }, {
            //     "field": "kddiagnosatindakan",
            //     "title": "Kode ICD 9",
            //     // "width": "100px"
            // }, {
            //     "field": "namadiagnosatindakan",
            //     "title": "Nama ICD 9",
            //     // "width": "300px"
            // }, {
            //     "field": "keterangantindakan",
            //     "title": "Keterangan",
            //     // "width": "200px"
            // }, {
            //     "field": "namaruangan",
            //     "title": "Ruangan",
            //     // "width": "200px"
            // },
            // {
            //     "field": "namalengkap",
            //     "title": "Penginput",
            //     // "width": "200px"
            // },
            // {
            //     "field": "tglinputdiagnosa",
            //     "title": "Tgl Input",
            //     // "width": "200px"
            // }];
            // $scope.columnDiagnosaIcd10 = [{
            //     "title": "No",
            //     "template": "{{dataSourceDiagnosaIcd10.indexOf(dataItem) + 1}}",
            //     // "width": "30px"
            // }, 
            // {
            //     "field": "noregistrasi",
            //     "title": "No Registrasi",
            //     // "width": "100px"
            // },{
            //     "field": "jenisdiagnosa",
            //     "title": "Jenis Diagnosis",
            //     // "width": "150px"
            // }, {
            //     "field": "kddiagnosa",
            //     "title": "Kode ICD 10",
            //     // "width": "100px"
            // }, {
            //     "field": "namadiagnosa",
            //     "title": "Nama ICD 10",
            //     // "width": "300px"
            // }, {
            //     "field": "keterangan",
            //     "title": "Keterangan",
            //     // "width": "200px"
            // }, {
            //     "field": "namaruangan",
            //     "title": "Ruangan",
            //     // "width": "150px"
            // },
            // {
            //     "field": "namalengkap",
            //     "title": "Penginput",
            //     // "width": "200px"
            // },
            // {
            //     "field": "tglinputdiagnosa",
            //     "title": "Tgl Input",
            //     // "width": "200px"
            // }];

            // // END DIAGNOSA




            // // TINDAKAN

            // // getTindakan

            // medifirstService.get("rawatjalan/get-tindakan?noReg=" + $scope.cc.noregistrasi).then(function (res){

            //     for (var i = 0; i < res.data.length; i++) {
            //         res.data[i].no = i + 1
            //     }
            //     $scope.dataTindakan = res.data;

            // });

            // $scope.columnDataTindakan =
            //     [
            //         {
            //             "field": "no",
            //             "title": "No",
            //             "width": "40px",
            //         },
            //         {
            //             "field": "namaproduk",
            //             "title": "Nama Pelayanan",
            //             "width": "200px",
            //         },
            //         {
            //             "field": "jumlah",
            //             "title": "Jumlah",
            //             "width": "200px",
            //         },
            //         {
            //             "field": "harganetto",
            //             "title": "Harga",
            //             "width": "200px",
            //         },
            //     ];
            // // END TINDAKAN

            medifirstService.get("emr/get-emr-transaksi-detail?noemr=" + nomorEMR + "&emrfk=" + $scope.cc.emrfk, true).then(function (dat) {
                $scope.item.obj = []
                $scope.item.obj2 = []
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
                
            $scope.SkorNorton[22035532] = 0;
            $scope.SkorNorton[22035538] = 0;
            $scope.SkorNorton[22035544] = 0;
            $scope.SkorNorton[22035550] = 0;
            $scope.getSkorNorton = function (jawab) {
                var arrobj = Object.keys($scope.item.obj);
                var arrSave = []
                
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    if (arrobj[i] == jawab.id) {
                        if ($scope.item.obj[parseFloat(arrobj[i])] == true) {
                            $scope.SkorNorton[jawab.target] = $scope.SkorNorton[jawab.target] + parseFloat(jawab.descNilai)
                            break
                        } else {
                            $scope.SkorNorton[jawab.target] = $scope.SkorNorton[jawab.target] - parseFloat(jawab.descNilai)
                            break
                        }
                    } else {
                    }
                }

                $scope.item.obj[jawab.target] = $scope.SkorNorton[jawab.target]
                setSkorNorton()
            }

            function setSkorNorton()
            {
                var nilai1 = $scope.SkorNorton[22035532]
                var nilai2 = $scope.SkorNorton[22035538]
                var nilai3 = $scope.SkorNorton[22035544]
                var nilai4 = $scope.SkorNorton[22035550]
            
                var total = nilai1 + nilai2 + nilai3 + nilai4
                $scope.item.obj[22035551] = total;
                
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

                $scope.item.obj[22035526] = $scope.skorNutrisi
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
                $scope.activeStatus = stat
                var nilai = stat
                if (nilai >= 0 && nilai <= 1) {
                    $scope.item.obj[22035613] = true
                    $scope.item.obj[22035614] = false
                    $scope.item.obj[22035615] = false
                    $scope.item.obj[22035616] = false
                    $scope.item.obj[22035617] = false
                    $scope.item.obj[22035618] = false
                }
                if (nilai >= 2 && nilai <= 3) {
                    $scope.item.obj[22035613] = false
                    $scope.item.obj[22035614] = true
                    $scope.item.obj[22035615] = false
                    $scope.item.obj[22035616] = false
                    $scope.item.obj[22035617] = false
                    $scope.item.obj[22035618] = false
                }
                if (nilai >= 4 && nilai <= 5) {
                    $scope.item.obj[22035613] = false
                    $scope.item.obj[22035614] = false
                    $scope.item.obj[22035615] = true
                    $scope.item.obj[22035616] = false
                    $scope.item.obj[22035617] = false
                    $scope.item.obj[22035618] = false
                }
                if (nilai >= 6 && nilai <= 7) {
                    $scope.item.obj[22035613] = false
                    $scope.item.obj[22035614] = false
                    $scope.item.obj[22035615] = false
                    $scope.item.obj[22035616] = true
                    $scope.item.obj[22035617] = false
                    $scope.item.obj[22035618] = false
                }
                if (nilai >= 8 && nilai <= 9) {
                    $scope.item.obj[22035613] = false
                    $scope.item.obj[22035614] = false
                    $scope.item.obj[22035615] = false
                    $scope.item.obj[22035616] = false
                    $scope.item.obj[22035617] = true
                    $scope.item.obj[22035618] = false
                }

                if (nilai == 10) {
                    $scope.item.obj[22035613] = false
                    $scope.item.obj[22035614] = false
                    $scope.item.obj[22035615] = false
                    $scope.item.obj[22035616] = false
                    $scope.item.obj[22035617] = false
                    $scope.item.obj[22035618] = true
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

            $scope.GCSKuantitatif = function ()
            {
                let e = parseInt($scope.item.obj[22035176]) || 0;
                let v = parseInt($scope.item.obj[22035177]) || 0;
                let m = parseInt($scope.item.obj[22035178]) || 0;
                let hasil =  e + v + m;
                
                if(hasil >= 14 && hasil <=15)
                {
                    $scope.item.obj[22035179] = hasil + " Compos mentis";
                } else if(hasil >= 12 && hasil <= 13)
                {
                    $scope.item.obj[22035179] = hasil + " Apatis";
                } else if(hasil >= 11 && hasil <= 12)
                {
                    $scope.item.obj[22035179] = hasil + " Somnolent";
                }else if(hasil >= 8 && hasil <= 10)
                {
                    $scope.item.obj[22035179] = hasil + " Stupor";
                }else if(hasil < 5)
                {
                    $scope.item.obj[22035179] = hasil + " Koma";
                }else
                {
                    $scope.item.obj[22035179] = "";
                }
            }

            $scope.MaxGCSValue = function (e, id) {
                switch (id)
                {
                    case 22035176:
                        if(e.which !== 49 && e.which !== 50 && e.which !== 51 && e.which !== 52)
                            e.preventDefault()
                        break;
                    case 22035177:
                        if(e.which !== 49 && e.which !== 50 && e.which !== 51 && e.which !== 52 && e.which !== 53)
                            e.preventDefault()
                        break;
                    case 22035178:
                        if(e.which !== 49 && e.which !== 50 && e.which !== 51 && e.which !== 52 && e.which !== 53 && e.which !== 54)
                            e.preventDefault()
                        break;
                }
            }

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
                    // $state.go("RekamMedis.OrderJadwalBedah.ProsedurKeselamatan", {
                    //     namaEMR : $scope.cc.emrfk,
                    //     nomorEMR : e.data.data.noemr 
                    // });
                    medifirstService.postLogging('EMR', 'norec emrpasien_t', e.data.data.norec,  
                    'AsesmenUlangKeperRJGeriatriCtrl ' + ' dengan No EMR - ' +e.data.data.noemr +  ' pada No Registrasi ' 
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