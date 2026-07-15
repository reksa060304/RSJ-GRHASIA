<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="css/report/paper.css">
    <link rel="stylesheet" href="css/report/table.css">
    <link rel="stylesheet" href="css/report/tabel.css">

    <link href="css/style.css" rel="stylesheet">
    <title>Rujukan Edukasi Pasien dengan Epilepsi</title>
    <style>
        @page {
            size: A4;
            margin-top: 5mm;
        }

        @page: first {
            size: A4
        }

        @media print {
            table {
                page-break-after: auto;
                widows: 2;
                orphans: 2;
            }

            td {
                page-break-inside: avoid;
            }

            thead {
                display: table-header-group;
            }

            tfoot {
                display: table-footer-group;
            }

            /* Prevent header and content from breaking apart - lebih aggressive */
            tr[data-section-header] {
                page-break-after: avoid !important;
                page-break-inside: avoid !important;
            }

            tr[data-section-header]+tr {
                page-break-before: avoid !important;
                page-break-inside: avoid !important;
            }

            /* Newer break-inside property */
            tr[data-section-header] {
                break-after: avoid;
                break-inside: avoid;
            }

            tr[data-section-header]+tr {
                break-before: avoid;
                break-inside: avoid;
            }
        }

        .double-border {
            border: 4px solid #000;
        }

        .double-border:before {
            border: 4px solid #fff;
        }

        .box {
            border: 2px solid black;
            /border-radius: 6px;/
        }

        .garis6 td {
            padding: 3px;
        }

        .bold {
            font-weight: bold;
        }

        .f-s-15 {
            font-size: 12px;
        }

        .underline {
            text-decoration: underline;
        }

        .top-height {
            height: 50px;
            vertical-align: text-top;
            width: 15%;
        }

        .text-top {
            vertical-align: text-top;
        }

        .footer2 {
            text-align: center;
            position: absolute;
            /* left: 67%; */
            bottom: 0%;
            /* right: 3%; */
        }

        footer {
            text-align: center;
            position: absolute;
            bottom: 0;
            right: 5%;
        }

        footer {
            position: fixed;
            bottom: 0;
        }

        body {
            font-family: 'Tahoma'
        }

        td {
            vertical-align: top
        }

        input[type="checkbox"] {
            vertical-align: middle;
            transform: scale(0.7);
            /* Mengurangi skala kotak centang */
            margin-right: 0px;
        }

        label {
            vertical-align: middle;
            line-height: 1;
            /* Tambahan gaya CSS lainnya */
        }

        div {
            display: inline-block;
            /* atau sesuaikan dengan kebutuhan desain Anda */
            vertical-align: middle;
            /* atau sesuaikan dengan kebutuhan desain Anda */
        }

        td {
            margin: 0;
            padding: 3px;

            /* Juga pastikan padding disetel ke nol jika Anda ingin menghilangkan padding */
        }

        .container-edukasi {
            width: 100%;
            box-sizing: border-box;
            line-height: 1;
            font-family: Tahoma, Arial, sans-serif !important;
            font-size: 12pt;
            text-align: justify;
            padding: 0 20px;
        }

        .container-edukasi h2 {
            font-size: 12pt;
            line-height: 1;
            font-weight: bold;
            text-align: left;
        }

        .container-edukasi>ol {
            margin: 0;
            padding-left: 20px;
        }

        .container-edukasi>ol>li {
            font-weight: bold;
            margin-bottom: 15px;
        }

        .container-edukasi p {
            font-weight: normal;
            margin: 5px 0 10px 0;
        }

        .container-edukasi ol[type="a"] {
            font-weight: normal;
            margin-top: 5px;
            padding-left: 20px;
        }

        .container-edukasi ol[type="a"]>li {
            margin-bottom: 5px;
        }

        /* Use default disc bullet for arrow-list (dot) */
        .container-edukasi ul.arrow-list {
            list-style-type: disc;
            /* give space for default marker */
            padding-left: 30px;
            margin-top: 5px;
            margin-bottom: 10px;
        }

        .container-edukasi ul.arrow-list>li {
            margin-bottom: 3px;
        }
    </style>
</head>

<body class="A4" style="font-family:Tahoma;height: auto">
    <section style="font-family:Tahoma;padding:5mm 5mm 5mm 5mm;page-break-after: page;">
        <table cellspacing="0" cellpadding="0" border="0" width="100%">
            <tbody>
                <tr>
                    <td style="text-align: center;" width="10%">
                        <img src="img/diy.png" alt="Logo" style="width: 100px; margin: 0 !important;
                        padding: 0 !important;">
                    </td>
                    <td style="text-align: center;vertical-align: top" width="55%">
                        <b>
                            <span style="font-size: 9pt;"><?php echo htmlspecialchars($res['profile']->baris1, ENT_QUOTES, 'UTF-8'); ?></span>
                            <br>
                            <span style="font-size: 10pt;"><?php echo htmlspecialchars($res['profile']->baris2, ENT_QUOTES, 'UTF-8'); ?></span>
                            <br>
                            <span style="font-size: 10pt;"><?php echo htmlspecialchars(strtoupper($res['profile']->namalengkap), ENT_QUOTES, 'UTF-8'); ?></span>
                            <br>
                            <img src="img/aksara_jawa-com.png" alt="Logo" style="width: 140px;">
                            <br>
                            <span style="font-size: 7pt; font-weight: normal">Jalan Kaliurang KM 17 Sleman Kode Pos 55582, Telepon:
                                <?php echo htmlspecialchars($res['profile']->fixedphone, ENT_QUOTES, 'UTF-8'); ?>
                                <br style="margin: 0px">
                                Laman: <?php echo htmlspecialchars($res['profile']->website, ENT_QUOTES, 'UTF-8'); ?>, Surel: <?php echo htmlspecialchars($res['profile']->alamatemail, ENT_QUOTES, 'UTF-8'); ?>
                            </span>

                        </b>
                    </td>
                    <td width="35%" style="vertical-align: middle">
                        <img src="img/logo_grhasia_full.png" alt="Logo" style="width: 180px; margin: 0 !important;
                        padding: 0 !important;">
                    </td>
                </tr>
                <tr>
                    <td colspan="3">
                        <hr>
                    </td>
                </tr>
                <tr>
                    <th colspan="3" style="padding-top: 20px;">RUJUKAN EDUKASI PASIEN DENGAN EPILEPSI</th>
                </tr>
        </table>

        <table style="width: 100%; margin-top: 20px; margin-left: 20px; font-size: 10.5pt !important;">
            <tr>
                <td style="width: 20%;">Rumah Sakit</td>
                <td style="width: 2%;">:</td>
                <td style="width: 78%;">RSJ Grhasia DIY</td>
            </tr>
            <tr>
                <td>Puskesmas Tujuan</td>
                <td>:</td>
                <td><?php echo htmlspecialchars(isset($item[1901307000]) ? $item[1901307000] : '', ENT_QUOTES, 'UTF-8'); ?></td>
            </tr>
            <tr>
                <td>Tanggal Masuk</td>
                <td>:</td>
                <td>
                    <?php echo date('d/m/Y', strtotime(isset($item[1901306000]) ? $item[1901306000] : '')); ?>
                </td>
            </tr>
            <tr>
                <td>Nama Pasien</td>
                <td>:</td>
                <td><?php echo htmlspecialchars(isset($item[1901306001]) ? $item[1901306001] : '', ENT_QUOTES, 'UTF-8'); ?></td>
            </tr>
            <tr>
                <td>Umur</td>
                <td>:</td>
                <td><?php echo htmlspecialchars(isset($item[1901306002]) ? $item[1901306002] : '', ENT_QUOTES, 'UTF-8'); ?></td>
            </tr>
            <tr>
                <td>Jenis Kelamin</td>
                <td>:</td>
                <td>
                    <?php
                        if (isset($item[1901306003]) && $item[1901306003] === true) {
                            echo 'Laki-laki';
                        } else if (isset($item[1901306004]) && $item[1901306004] === true) {
                            echo 'Perempuan';
                        } else {
                            echo '';
                        }
                    ?>
                </td>
            </tr>
            <tr>
                <td>Diagnosa</td>
                <td>:</td>
                <td><?php echo htmlspecialchars(isset($item[1901306005]) ? $item[1901306005] : '', ENT_QUOTES, 'UTF-8'); ?></td>
            </tr>
            <tr>
                <td><b>Pengobatan Terakhir</b></td>
                <td>:</td>
                <td><?php echo nl2br(htmlspecialchars(isset($item[1901306006]) ? $item[1901306006] : '', ENT_QUOTES, 'UTF-8')); ?></td>
            </tr>
        </table>

        <div class="container-edukasi">
            <h2>Rekomendasi Edukasi dan Tindak Lanjut di Puskesmas</h2>
            <ol style="margin-left: 20px;">
                <li>Melanjutkan pengobatan anti kejang
                    <p>Pasien agar diberikan edukasi yang jelas dan berkelanjutan tentang pentingnya konsumsi obat anti kejang setiap hari sesuai anjuran, meskipun gejala mulai membaik. Tidak boleh menghentikan obat tiba-tiba karena dapat memicu kejang. Jika lupa minum obat, segera minum begitu teringat. Jangan menggandakan dosis jika sudah mendekati waktu dosis berikutnya.</p>
                </li>

                <li>Penjelasan Terkait Tatalaksana Kejang Di Rumah
                    <ol type="a">
                        <li>Hal – hal yang harus dilakukan saat pasien kejang :
                            <ul class="arrow-list">
                                <li>Tetap tenang, jangan panik</li>
                                <li>Singkirkan benda keras/tajam di sekitar pasien</li>
                                <li>Longgarkan pakaian, terutama di leher</li>
                                <li>Posisikan pasien berbaring miring (posisi pemulihan) bila memungkinkan</li>
                                <li>Catat waktu mulai kejang</li>
                                <li>Lindungi kepala pasien (alas bantal/lipatan kain)</li>
                                <li>Biarkan kejang berhenti secara alami</li>
                                <li>Awasi pernapasan pasien</li>
                                <li>Setelah kejang berhenti, biarkan pasien istirahat</li>
                            </ul>
                        </li>
                        <li>Hal – hal yang tidak boleh dilakukan saat pasien kejang :
                            <ul class="arrow-list">
                                <li>Jangan memasukkan benda apa pun ke dalam mulut</li>
                                <li>Jangan menahan atau mengikat tubuh pasien</li>
                                <li>Jangan memberi minum atau obat saat kejang berlangsung</li>
                                <li>Jangan melakukan napas buatan saat pasien masih kejang</li>
                            </ul>
                        </li>
                    </ol>
                </li>

                <li>Penjelasan tentang pencegahan kekambuhan kejang
                    <p>Pasien diberikan edukasi mengenai risiko dan cara mencegah kekambuhan kejang, termasuk:</p>
                    <ol type="a">
                        <li>Kepatuhan minum obat: Pasien perlu diarahkan untuk meminum obat pada waktu yang sama setiap hari.</li>
                        <li>Pengawasan dosis pemberian obat : pasien dan keluarga diarahkan untuk tidak merubah dosis pemberian tanpa evaluasi dari dokter.</li>
                    </ol>
                </li>

                <li>Dukungan Psikososial
                    <p>Epilepsi atau ayan/sawan sering disalahartikan sebagai penyakit menular, gangguan jiwa, atau akibat hal mistis, sehingga perlunya edukasi terkait :</p>
                    <ol type="a">
                        <li>Edukasi keluarga tentang penyakit epilepsi juga penting untuk mengurangi stigma di rumah dan lingkungan sosial pasien.</li>
                        <li>Epilepsi dapat menimbulkan stigma sosial, sehingga pasien sering mengalami tekanan psikologis. Puskesmas perlu menyediakan dukungan psikologis atau kelompok dukungan untuk pasien epilepsi agar mereka dapat berbagi pengalaman dan mengurangi kecemasan terkait penyakit ini.</li>
                    </ol>
                </li>

                <li>Jadwal Pengawasan dan Pemantauan
                    <p>Puskesmas perlu menyusun jadwal kontrol rutin untuk memantau perkembangan kesehatan pasien termasuk:</p>
                    <ol type="a">
                        <li>Kunjungan setiap minggu untuk memeriksa kepatuhan terhadap pengobatan dan memantau tanda-tanda efek samping.</li>
                        <li>Pemantauan kondisi umum, intensitas kejang dan fungsi kognitif pasien setiap kali kunjungan dilakukan.</li>
                    </ol>
                </li>

                <li>Konseling Nutrisi untuk Mendukung Pengobatan
                    <p>Pasien epilepsi sering kali mengalami penurunan berat badan dan kelemahan. Puskesmas perlu memberikan konseling nutrisi untuk memastikan pasien mengonsumsi makanan yang tinggi kalori dan protein, seperti:</p>
                    <ol type="a">
                        <li>Sumber protein: Daging tanpa lemak, ikan, telur, dan kacang-kacangan.</li>
                        <li>Buah dan sayuran: Untuk membantu meningkatkan daya tahan tubuh.</li>
                        <li>Vitamin dan suplemen jika diperlukan, seperti vitamin B-kompleks dan asam folat.</li>
                    </ol>
                </li>

                <li>Rujukan Kembali Jika Terjadi Komplikasi
                    <p>Seringnya komplikasi muncul pada pasien epilepsi sehingga perlu pemantauan kondisi dan perlu rujukan ke rumah sakit :</p>
                    <ol type="a">
                        <li>Jika selama pemantauan terdapat tanda-tanda komplikasi seperti peningkatan frekuensi kejang walaupun dengan terapi kejang, penurunan fungsi kognitif, dan penurunan kesadaran, pasien harus segera dirujuk kembali ke rumah sakit untuk penanganan lebih lanjut.</li>
                        <li>Jika terjadi efek samping dengan gejala serius seperti kejang > 5 menit dan kejang berulang.</li>
                    </ol>
                </li>
            </ol>
        </div>

        <table style="width: 100%; margin-top: 20px; margin-right: 20px; font-size: 12pt !important;">
            <tr>
                <td style="width:50%"></td>
                <td style="width:50%; text-align: right;">Yogyakarta, <span style="border-bottom: 1px dotted #000;"><?php echo htmlspecialchars(isset($item[1901307160]) ? $item[1901307160] : '', ENT_QUOTES, 'UTF-8'); ?></span></td>
            </tr>
            <tr>
                <td></td>
                <td style="text-align: center; vertical-align: top; height: 60px;"><b>Dokter yang merujuk</b></td>
            </tr>
            <tr>
                <td></td>
                <td style="text-align: center;"><span><?php echo htmlspecialchars(isset($item[1901307170]) ? $item[1901307170] : '', ENT_QUOTES, 'UTF-8'); ?></span></td>
            </tr>
        </table>

    </section>
</body>

</html>