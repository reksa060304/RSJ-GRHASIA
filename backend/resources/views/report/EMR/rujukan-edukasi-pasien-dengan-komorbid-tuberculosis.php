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
    <title>Rujukan Edukasi Pasien dengan Tuberculosis</title>
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
            font-family: 'Arial'
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
            line-height: 1.6;
        }

        .container-edukasi h2 {
            font-size: 1.2em;
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
    <section style="font-family:Arial;padding:5mm 5mm 5mm 5mm;page-break-after: page;">
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
                    <th colspan="3" style="padding-top: 20px;">RUJUKAN EDUKASI PASIEN JIWA DENGAN TUBERCULOSIS</th>
                </tr>
        </table>

        <table style="width: 100%; margin-top: 20px;">
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
                <td>Tanggal</td>
                <td>:</td>
                <td>
                    <?php echo date('d/m/Y', strtotime(isset($item[1901306000]) ? $item[1901306000] : '')); ?>
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
                    if (isset($item[1901306003])) {
                        if ($item[1901306003] == 1) {
                            echo 'Laki-laki';
                        } elseif ($item[1901306004] == 1) {
                            echo 'Perempuan';
                        } else {
                            echo '';
                        }
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
                <td><b>Riwayat Perawatan</b></td>
                <td>:</td>
                <td><?php echo nl2br(htmlspecialchars(isset($item[1901306006]) ? $item[1901306006] : '', ENT_QUOTES, 'UTF-8')); ?></td>
            </tr>
        </table>

        <div class="container-edukasi">
            <h2>Rekomendasi Edukasi dan Tindak Lanjut di Puskesmas</h2>
            <ol>
                <li>Melanjutkan pengobatan OAT (Obat Anti Tuberkulosis)
                    <p>Lama pengobatan biasanya: 6 bulan untuk TBC sensitif obat. Bisa lebih lama untuk kasus tertentu (TBC ekstra paru, komplikasi).</p>
                    <p>Walaupun sudah merasa sehat, obat harus tetap diminum sampai selesai untuk mencegah resistensi dan kekambuhan. Minum OAT saat perut kosong (1 jam sebelum makan atau 2 jam setelah makan). Obat jiwa umumnya diminum sesudah makan. Minum obat pada jam yang sama setiap hari dan gunakan air putih.</p>
                </li>

                <li>Penjelasan Terkait Efek Samping Obat :
                    <p>Efek yang normal:</p>
                    <ul class="arrow-list">
                        <li>Urine merah/oranye (rifampisin)</li>
                        <li>Mual ringan</li>
                        <li>Nafsu makan menurun ringan</li>
                    </ul>
                    <p>Efek yang harus segera dilaporkan:</p>
                    <ul class="arrow-list">
                        <li>Mata atau kulit kuning</li>
                        <li>Mual muntah berat</li>
                        <li>Penglihatan kabur</li>
                        <li>Ruam berat</li>
                        <li>Kesemutan berat</li>
                    </ul>
                    <div class="instruction-block">
                        <strong>Instruksi:</strong>
                        <p style="margin-left: 20px; margin-top: 5px;">Jika mual saat minum obat dengan perut kosong → minum obat bersama sedikit makanan ringan (bukan makanan berat) atau geser ke malam hari sebelum tidur untuk meminimalisir rasa tidak nyaman selama beraktivitas.</p>
                        <p style="margin-left: 20px;">Jika ada keluhan berat → segera ke Puskesmas atau fasilitas kesehatan.</p>
                    </div>
                </li>

                <li>Edukasi pencegahan penularan
                    <p>Terutama pada fase awal pengobatan:</p>
                    <p>Pasien dianjurkan:</p>
                    <ul class="arrow-list">
                        <li>Pakai masker saat dekat orang lain</li>
                        <li>Tutup mulut saat batuk</li>
                        <li>Tidak meludah sembarangan</li>
                        <li>Rumah dengan ventilasi baik</li>
                        <li>Buka jendela setiap hari</li>
                    </ul>
                    <p>Biasanya setelah 8 minggu pengobatan,akan dilakukan pengecekan dahak ulang → risiko penularan turun drastis</p>
                </li>

                <li>Edukasi pentingnya kontrol di Puskesmas
                    <ul class="arrow-list">
                        <li>Pengobatan dilanjutkan di Puskesmas</li>
                        <li>Obat diberikan gratis oleh program TBC nasional</li>
                        <li>Ketaatan minum obat akan dipantau oleh petugas TBC dan PMO (Pengawas Minum Obat) yaitu anggota keluarga, petugas kesehatan, kader kesehatan</li>
                        <li>Tugas PMO: memastikan pasien minum obat setiap hari (memastikan obat tertelan) dan mencatat di kartu kontrol.</li>
                    </ul>
                </li>

                <li>Edukasi tambahan penting
                    <ol type="a">
                        <li>Nutrisi
                            <ul class="arrow-list">
                                <li>Makan cukup protein : telur, ikan, ayam</li>
                                <li>Sayur dan buah</li>
                                <li>Tidak ada pantangan khusus</li>
                            </ul>
                        </li>
                        <li>Aktivitas
                            <p>Pasien boleh:</p>
                            <ul class="arrow-list">
                                <li>Aktivitas ringan–sedang sesuai kondisi</li>
                                <li>Istirahat cukup</li>
                            </ul>
                        </li>
                    </ol>
                </li>

                <li>Skrining kontak serumah
                    <p>Sangat penting:</p>
                    <ul class="arrow-list">
                        <li>Semua anggota keluarga serumah diperiksa</li>
                        <li>Terutama anak-anak dan lansia</li>
                        <li>Dilakukan di Puskesmas</li>
                    </ul>
                </li>

                <li>Tanda bahaya yang perlu segera ke fasilitas kesehatan
                    <ul class="arrow-list">
                        <li>Sesak napas berat</li>
                        <li>Batuk darah banyak</li>
                        <li>Demam tinggi menetap</li>
                        <li>Muntah terus</li>
                        <li>Mata atau kulit kuning</li>
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