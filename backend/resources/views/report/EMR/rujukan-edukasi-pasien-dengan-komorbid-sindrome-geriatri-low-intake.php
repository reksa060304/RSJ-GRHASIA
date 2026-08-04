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
    <title>Rujukan Edukasi Pasien dengan Low Geriatri Intake</title>
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

        .info-table td,
        .signature-table td {
            font-size: 10.5pt !important;
        }

        p, li, .container-edukasi, .container-edukasi h2, .container-edukasi div {
            font-family: Tahoma, Geneva, sans-serif !important;
            font-size: 10.5pt !important;
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
        }

        .container-edukasi h2 {
            font-size: 11pt !important;
            font-weight: bold;
            margin-bottom: 20px;
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
            font-weight: normal;
            margin-bottom: 5px;
        }

        /* Use default disc bullet for arrow-list (dot) */
        .container-edukasi ul.arrow-list {
            list-style-type: disc;
            /* give space for default marker */
            padding-left: 30px;
            margin-top: 5px;
            margin-bottom: 10px;
            font-weight: normal;
        }

        .container-edukasi ul.arrow-list > li {
            font-weight: normal;
            position: relative;
            padding-left: 25px;
            margin-bottom: 3px;
        }
    </style>
</head>

<body class="A4" style="font-family:Tahoma;height: auto">
    <section style="padding:0;page-break-after: page;">
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
                <th colspan="3" style="padding-top: 12px; padding-bottom: 12px; border: none; text-align: center; font-size: 12pt; font-weight: bold;">RUJUKAN EDUKASI PASIEN DENGAN SINDROMA GERIATRI <br> DENGAN LOW INTAKE</th>
            </tr>
        </table>

        <table style="width: 100%; margin-top: 20px;">
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
            <ol>
                <li>Penjelasan tentang Sindrom Geriatri dengan Low Intake
                    <p>Pasien dan keluarga diberikan edukasi bahwa sindrom geriatri merupakan kumpulan kondisi yang sering terjadi pada usia lanjut, seperti penurunan fungsi fisik, kognitif, dan sosial, yang dapat memengaruhi nafsu makan dan asupan nutrisi.</p>
                    <p>Low intake pada pasien geriatri dapat disebabkan oleh penurunan nafsu makan, gangguan menelan, masalah gigi dan mulut, penyakit kronis, efek samping obat, serta faktor psikosocial. Kondisi ini dapat menyebabkan penurunan berat badan, kelemahan, dan meningkatkan risiko komplikasi</p>
                </li>

                <li>Melakukan Pemeriksaan Rutin dan Evaluasi Berat Badan (BB)
                    <p>Pasien dianjurkan untuk:</p>
                    <ul class="arrow-list">
                        <li>Melakukan kontrol rutin ke Puskesmas sesuai jadwal</li>
                        <li>Pemantauan berat badan secara berkala (minimal 1 kali per bulan)</li>
                        <li>Evaluasi status gizi dan tanda dehidrasi</li>
                        <li>Mencatat perubahan berat badan, nafsu makan, dan jumlah asupan harian</li>
                        <li>Segera melapor bila terjadi penurunan berat badan yang signifikan atau mendadak</li>
                    </ul>
                </li>

                <li>Penjelasan tentang Konsumsi Obat
                    <p>Pasien dan keluarga diberikan edukasi mengenai:</p>
                    <ul class="arrow-list">
                        <li>Pentingnya konsumsi obat sesuai resep dan waktu yang dianjurkan</li>
                        <li>Tidak menghentikan atau mengubah dosis obat tanpa konsultasi tenaga kesehatan</li>
                        <li>Jika lupa minum obat, segera minum begitu teringat. Jangan menggandakan dosis jika sudah mendekati waktu dosis berikutnya.</li>
                        <li>Efek samping obat yang dapat mempengaruhi nafsu makan, mual, atau gangguan menelan</li>
                        <li>Cara pemberian obat yang aman pada pasien geriatri, termasuk pengawasan oleh keluarga atau <em>caregiver</em></li>
                        <li>Minta keluarga atau <em>caregiver</em> untuk melapor jika pasien menjadi sangat mengantuk, tidak bisa menelan, atau sembelit.</li>
                    </ul>
                </li>

                <li>Dukungan Psikososial
                    <p>Pasien dan keluarga diberikan dukungan psikososial berupa:</p>
                    <ul class="arrow-list">
                        <li>Edukasi bahwa penurunan asupan pada lansia merupakan kondisi yang dapat ditangani dengan pendampingan</li>
                        <li>Peran aktif keluarga atau <em>caregiver</em> dalam membantu makan dan minum</li>
                        <li>Penciptaan suasana makan yang nyaman dan tidak terburu-buru</li>
                        <li>Identifikasi dan penanganan masalah psikologis seperti depresi, kecemasan, atau isolasi sosial</li>
                        <li>Rujukan ke konseling bila diperlukan</li>
                    </ul>
                </li>

                <li>Konseling Nutrisi untuk Mendukung Pengobatan
                    <p>Pasien diberikan konseling nutrisi meliputi:</p>
                    <ul class="arrow-list">
                        <li>Pemberian makanan tinggi energi dan protein sesuai toleransi</li>
                        <li>Penyesuaian tekstur makanan (lunak, lembek, atau cair kental) bila terdapat gangguan mengunyah atau menelan</li>
                        <li>Pemberian porsi kecil tetapi sering</li>
                        <li>Anjuran suplementasi nutrisi oral bila diperlukan</li>
                        <li>Pemantauan respon terhadap intervensi nutrisi secara berkala</li>
                    </ul>
                </li>

                <li>Penjelasan Kebutuhan Intake Makanan dan Cairan pada Pasien Geriatri dengan Low Intake di Rumah
                    <p>Pasien dan keluarga diberikan edukasi mengenai:</p>
                    <ul class="arrow-list">
                        <li>Kebutuhan energi dan protein harian sesuai kondisi pasien</li>
                        <li>Pemberian cairan yang cukup untuk mencegah dehidrasi, dengan penyesuaian pada kondisi medis tertentu</li>
                        <li>Cara memantau kecukupan asupan harian di rumah</li>
                        <li>Tanda-tanda kurang asupan dan dehidrasi yang perlu diwaspadai</li>
                        <li>Pentingnya jadwal makan dan minum yang teratur</li>
                    </ul>
                </li>

                <li>Rujukan Kembali Jika Terjadi Komplikasi
                    <p>Pasien direncanakan untuk dirujuk kembali ke fasilitas kesehatan rujukan apabila terjadi:</p>
                    <ul class="arrow-list">
                        <li>Penurunan berat badan berlanjut atau tidak ada perbaikan intake</li>
                        <li>Tanda dehidrasi atau malnutrisi berat</li>
                        <li>Gangguan menelan berat atau aspirasi</li>
                        <li>Penurunan kesadaran atau kondisi umum memburuk</li>
                        <li>Kecurigaan infeksi atau komplikasi medis lainnya</li>
                    </ul>
                </li>
            </ol>
        </div>

        <table style="width: 100%;">
            <tr>
                <td style="width:60%"></td>
                <td style="width:40%; text-align: right;">Yogyakarta, <span style="border-bottom: 1px dotted #000;"><?php echo htmlspecialchars(isset($item[1901307160]) ? $item[1901307160] : '', ENT_QUOTES, 'UTF-8'); ?></span></td>
            </tr>
            <tr>
                <td></td>
                <td style="text-align: center; vertical-align: top; height: 60px;"><b>Dokter yang merujuk</b></td>
            </tr>
            <tr>
                <td></td>
                <td style="text-align: center;"><span ><?php echo htmlspecialchars(isset($item[1901307170]) ? $item[1901307170] : '', ENT_QUOTES, 'UTF-8'); ?></span></td>
            </tr>
        </table>

    </section>
</body>

</html>