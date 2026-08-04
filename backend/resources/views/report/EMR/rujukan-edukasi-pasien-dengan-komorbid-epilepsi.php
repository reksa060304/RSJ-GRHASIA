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
            margin: 10mm 15mm 10mm 15mm;
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

        body, table, td, th, div, span, p, li {
            font-family: Tahoma, Geneva, sans-serif;
            font-size: 10.5pt;
            line-height: 1.4;
            color: #000;
        }

        body {
            font-family: Tahoma, Geneva, sans-serif;
            font-size: 10.5pt;
            text-align: justify;
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
            line-height: 1.4;
            font-family: Tahoma, Geneva, sans-serif !important;
            font-size: 10.5pt !important;
            text-align: justify;
        }

        .container-edukasi h2 {
            font-size: 11pt !important;
            line-height: 1.4;
            font-weight: bold;
            text-align: left;
        }

        .container-edukasi>ol {
            margin: 0;
            padding-left: 20px;
        }

        .container-edukasi>ol>li {
            font-weight: bold;
            margin-bottom: 10px;
        }

        .container-edukasi p {
            font-weight: normal;
            margin: 3px 0 6px 0;
        }

        .container-edukasi ol[type="a"] {
            font-weight: normal;
            margin-top: 5px;
            padding-left: 20px;
        }

        .container-edukasi ol[type="a"]>li {
            font-weight: normal;
            margin-bottom: 5px;
        }

        /* Use default disc bullet for arrow-list (dot) */
        .container-edukasi ul.arrow-list {
            list-style-type: disc;
            padding-left: 30px;
            margin-top: 5px;
            margin-bottom: 10px;
            font-weight: normal;
        }

        .container-edukasi ul.arrow-list>li {
            font-weight: normal;
            margin-bottom: 3px;
        }
    </style>
</head>

<body class="A4" style="font-family:Tahoma;height: auto">
    <section style="font-family:Tahoma;padding:0;page-break-after: page;">
        <table cellspacing="0" cellpadding="0" border="0" style="width: 100%; border-bottom: 2px solid #000; margin-bottom: 6px; padding-bottom: 5px;">
            <tr>
                <td style="text-align: left; vertical-align: middle; border: none;" width="12%">
                    <img src="img/diy.png" alt="Logo DIY" style="width: 75px; height: auto; margin: 0; padding: 0;">
                </td>
                <td style="text-align: center; vertical-align: middle; padding: 0 5px; border: none;" width="73%">
                    <span style="font-size: 12pt; font-weight: bold; color: #000;">PEMERINTAH DAERAH DAERAH ISTIMEWA YOGYAKARTA</span><br>
                    <span style="font-size: 12pt; font-weight: bold; color: #000;">DINAS KESEHATAN</span><br>
                    <span style="font-size: 12pt; font-weight: bold; color: #000;">RUMAH SAKIT JIWA GRHASIA</span><br>
                    <img src="img/aksara_jawa-com.png" alt="Aksara Jawa" style="width: 140px; height: auto; margin-top: 1px; margin-bottom: 1px;"><br>
                    <span style="font-size: 8pt; font-weight: normal; line-height: 1.2; color: #000;">
                        Jalan Kaliurang Km 17 Sleman 55582, Telepon: (0274) 895143/895297, Faksimile: (0274) 895142<br>
                        Pos-el: grhasiamentalhospital@jogjaprov.go.id&nbsp;&nbsp;Laman: grhasia.jogjaprov.go.id
                    </span>
                </td>
                <td style="text-align: right; vertical-align: middle; border: none;" width="15%">
                    <img src="img/logo_grhasia_full.png" alt="Logo Grhasia" style="width: 120px; height: auto; margin: 0; padding: 0;">
                </td>
            </tr>
        </table>
        <table cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
            <tr>
                <th colspan="3" style="padding-top: 12px; padding-bottom: 12px; border: none; text-align: center; font-size: 12pt; font-weight: bold;">RUJUKAN EDUKASI PASIEN DENGAN EPILEPSI</th>
            </tr>
        </table>

        <table class="info-table" style="width: 100%; margin-top: 20px;">
            <tr>
                <td style="width: 26%;">Rumah Sakit</td>
                <td style="width: 2%;">:</td>
                <td style="width: 72%;">RSJ Grhasia DIY</td>
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
                <td><?php echo htmlspecialchars(!empty($data[0]->namapasien) ? $data[0]->namapasien : (isset($item[1901307210]) ? $item[1901307210] : (isset($item[1901306001]) ? $item[1901306001] : '')), ENT_QUOTES, 'UTF-8'); ?></td>
            </tr>
            <tr>
                <td>Umur</td>
                <td>:</td>
                <td><?php echo htmlspecialchars(!empty($data[0]->umur) ? $data[0]->umur : (isset($item[1901307230]) ? $item[1901307230] : (isset($item[1901306002]) ? $item[1901306002] : '')), ENT_QUOTES, 'UTF-8'); ?></td>
            </tr>
            <tr>
                <td>Jenis Kelamin</td>
                <td>:</td>
                <td>
                    <?php
                        if (!empty($data[0]->jeniskelamin)) {
                            echo htmlspecialchars($data[0]->jeniskelamin, ENT_QUOTES, 'UTF-8');
                        } else if (isset($_GET['jeniskelamin']) && $_GET['jeniskelamin'] != 'undefined' && $_GET['jeniskelamin'] != '') {
                            echo htmlspecialchars($_GET['jeniskelamin'], ENT_QUOTES, 'UTF-8');
                        } else if (isset($item[1901307240]) && ($item[1901307240] == 1 || $item[1901307240] === true)) {
                            echo 'Laki-laki';
                        } else if (isset($item[1901307250]) && ($item[1901307250] == 1 || $item[1901307250] === true)) {
                            echo 'Perempuan';
                        } else if (isset($item[1901306003]) && ($item[1901306003] == 1 || $item[1901306003] === true)) {
                            echo 'Laki-laki';
                        } else if (isset($item[1901306004]) && ($item[1901306004] == 1 || $item[1901306004] === true)) {
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
                <td>Pengobatan Terakhir</td>
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

        <table style="width: 100%; margin-top: 15px; margin-right: 20px; font-size: 10.5pt !important; page-break-inside: avoid; break-inside: avoid;">
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
            <tr>
                <td></td>
                <td style="height: 45px;"></td>
            </tr>
            <tr>
                <td></td>
                <td style="text-align: center;">
                    <?php 
                        $namaDokter = '';
                        if (!empty($item[1901307170])) {
                            $namaDokter = trim(preg_replace('/[0-9~]+/', '', $item[1901307170]));
                        } elseif (isset($peg->namalengkap) && !empty($peg->namalengkap)) {
                            $namaDokter = $peg->namalengkap;
                        } elseif (isset($data[0]->namadokter) && !empty($data[0]->namadokter)) {
                            $namaDokter = $data[0]->namadokter;
                        } elseif (isset($_GET['nama']) && !empty($_GET['nama'])) {
                            $namaDokter = $_GET['nama'];
                        }
                    ?>
                    <span>( <?php echo htmlspecialchars($namaDokter, ENT_QUOTES, 'UTF-8'); ?> )</span>
                </td>
            </tr>
            <?php if (isset($peg->nippns) && $peg->nippns) { ?>
            <tr>
                <td></td>
                <td style="text-align: center;">NIP: <?php echo htmlspecialchars($peg->nippns, ENT_QUOTES, 'UTF-8'); ?></td>
            </tr>
            <?php } ?>
            <?php if (isset($sip->nosip) && $sip->nosip) { ?>
            <tr>
                <td></td>
                <td style="text-align: center;">SIP: <?php echo htmlspecialchars($sip->nosip, ENT_QUOTES, 'UTF-8'); ?></td>
            </tr>
            <?php } ?>
        </table>

    </section>
</body>

</html>