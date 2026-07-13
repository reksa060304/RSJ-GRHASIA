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
    <title>Rujukan Edukasi Psikiatri</title>
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
                    <th colspan="3" style="padding-top: 20px;">RUJUKAN EDUKASI PSIKIATRI</th>
                </tr>
        </table>

        <table style="width: 100%; margin-top: 20px; margin-left: 20px; font-size: 10.5pt !important; border-collapse: collapse;">
            <tr>
                <td style="width: 20%; padding: 3px 0;">Rumah Sakit</td>
                <td style="width: 2%; padding: 3px 0;">:</td>
                <td style="width: 78%; padding: 3px 0;">RSJ Grhasia DIY</td>
            </tr>
            <tr>
                <td style="padding: 3px 0;">Puskesmas Tujuan</td>
                <td style="padding: 3px 0;">:</td>
                <td style="padding: 3px 0;"><?php echo htmlspecialchars(isset($item[1901307000]) ? $item[1901307000] : '', ENT_QUOTES, 'UTF-8'); ?></td>
            </tr>
            <tr>
                <td style="padding: 3px 0;">Tanggal</td>
                <td style="padding: 3px 0;">:</td>
                <td style="padding: 3px 0;">
                    <?php echo date('d/m/Y H:i', strtotime(isset($item[1901306000]) ? $item[1901306000] : '')); ?>
                </td>
            </tr>
            <tr>
                <td style="padding: 3px 0;">Nama Pasien</td>
                <td style="padding: 3px 0;">:</td>
                <td style="padding: 3px 0;"><?php echo htmlspecialchars(isset($item[1901307210]) ? $item[1901307210] : '', ENT_QUOTES, 'UTF-8'); ?></td>
            </tr>
            <tr>
                <td style="padding: 3px 0;">Umur</td>
                <td style="padding: 3px 0;">:</td>
                <td style="padding: 3px 0;"><?php echo htmlspecialchars(isset($item[1901307230]) ? $item[1901307230] : '', ENT_QUOTES, 'UTF-8'); ?></td>
            </tr>
            <tr>
                <td style="padding: 3px 0;">Jenis Kelamin</td>
                <td style="padding: 3px 0;">:</td>
                <td style="padding: 3px 0;">
                    <?php
                        if (isset($item[1901307240]) && ($item[1901307240] == 1 || $item[1901307240] === true)) {
                            echo 'Laki-laki';
                        } else if (isset($item[1901307250]) && ($item[1901307250] == 1 || $item[1901307250] === true)) {
                            echo 'Perempuan';
                        } else {
                            echo '';
                        }
                    ?>
                </td>
            </tr>
            <tr>
                <td style="padding: 3px 0;">Diagnosa</td>
                <td style="padding: 3px 0;">:</td>
                <td style="padding: 3px 0;"><?php echo htmlspecialchars(isset($item[1901307260]) ? $item[1901307260] : '', ENT_QUOTES, 'UTF-8'); ?></td>
            </tr>
            <tr>
                <td style="padding: 3px 0;"><b>Riwayat Perawatan</b></td>
                <td style="padding: 3px 0;">:</td>
                <td style="padding: 3px 0;"><?php echo nl2br(htmlspecialchars(isset($item[1901307270]) ? $item[1901307270] : '', ENT_QUOTES, 'UTF-8')); ?></td>
            </tr>
        </table>

        <?php
        if (!function_exists('checkedMark')) {
            function checkedMark($item, $id)
            {
                return (isset($item[$id]) && $item[$id] === true) || (is_array($item) && isset($item['obj'][$id]) && $item['obj'][$id] === true);
            }

            function itemValue($item, $id)
            {
                if (isset($item[$id])) {
                    return $item[$id];
                }
                if (is_array($item) && isset($item['obj'][$id])) {
                    return $item['obj'][$id];
                }
                return '';
            }

            function renderCheckbox($item, $id)
            {
                $checked = checkedMark($item, $id) ? ' checked' : '';
                return '<input type="checkbox" disabled style="transform: scale(1.2); margin-top:-1px; margin-right:5px;"' . $checked . ' />';
            }

            function renderCustomText($item, $textId)
            {
                $text = trim(itemValue($item, $textId));
                if ($text !== '') {
                    return htmlspecialchars($text, ENT_QUOTES, 'UTF-8');
                }
                return '<span style="display:inline-block; width:50%; border-bottom:1px dotted #000; line-height:1.2;">&nbsp;</span>';
            }
        }
        ?>

        <table style="width: 100%; margin-top: 20px; margin-left: 20px; font-size: 10.5pt !important; border-collapse: collapse;">
            <tr>
                <td colspan="3" style="padding-top: 55px;"><strong>A. Latar Belakang :</strong></td>
            </tr>
            <tr>
                <td style="width: 4%; vertical-align: top;"><?php echo renderCheckbox($item, 1901306001); ?></td>
                <td colspan="2">Putus Obat Berulang</td>
            </tr>
            <tr>
                <td><?php echo renderCheckbox($item, 1901306002); ?></td>
                <td colspan="2">Risiko Kambuh Ulang</td>
            </tr>
            <tr>
                <td><?php echo renderCheckbox($item, 1901306003); ?></td>
                <td colspan="2">Riwayat Perilaku Agresif</td>
            </tr>
            <tr>
                <td><?php echo renderCheckbox($item, 1901306004); ?></td>
                <td colspan="2">Riwayat Percobaan Bunuh Diri</td>
            </tr>
            <tr>
                <td><?php echo renderCheckbox($item, 1901306005); ?></td>
                <td colspan="2">Dukungan Keluarga Kurang</td>
            </tr>
            <tr>
                <td><?php echo renderCheckbox($item, 1901306006); ?></td>
                <td colspan="2">Kepatuhan Kontrol Kurang</td>
            </tr>
            <tr>
                <td><?php echo renderCheckbox($item, 1901306007); ?></td>
                <td colspan="2"><?php echo renderCustomText($item, 1901306008); ?></td>
            </tr>

            <tr>
                <td colspan="3" style="padding-top: 55px;"><strong>B. Penilaian Kondisi Pasien Saat Ini :</strong></td>
            </tr>
            <tr>
                <td><?php echo renderCheckbox($item, 1901306011); ?></td>
                <td colspan="2">Stabil</td>
            </tr>
            <tr>
                <td><?php echo renderCheckbox($item, 1901306012); ?></td>
                <td colspan="2">Perbaikan</td>
            </tr>
            <tr>
                <td><?php echo renderCheckbox($item, 1901306013); ?></td>
                <td colspan="2">Masih Melakukan Pengawasan</td>
            </tr>
            <tr>
                <td><?php echo renderCheckbox($item, 1901306014); ?></td>
                <td colspan="2"><?php echo renderCustomText($item, 1901306015); ?></td>
            </tr>

            <tr>
                <td colspan="3" style="padding-top: 55px;"><strong>C. Risiko Yang Masih Ditemukan :</strong></td>
            </tr>
            <tr>
                <td><?php echo renderCheckbox($item, 1901306021); ?></td>
                <td colspan="2">Risiko Putus Obat</td>
            </tr>
            <tr>
                <td><?php echo renderCheckbox($item, 1901306022); ?></td>
                <td colspan="2">Risiko Kekambuhan</td>
            </tr>
            <tr>
                <td><?php echo renderCheckbox($item, 1901306023); ?></td>
                <td colspan="2">Risiko Perilaku Agresif</td>
            </tr>
            <tr>
                <td><?php echo renderCheckbox($item, 1901306024); ?></td>
                <td colspan="2">Risiko Bunuh Diri</td>
            </tr>
            <tr>
                <td><?php echo renderCheckbox($item, 1901306025); ?></td>
                <td colspan="2">Risiko Menolak Kontrol</td>
            </tr>
            <tr>
                <td><?php echo renderCheckbox($item, 1901306026); ?></td>
                <td colspan="2"><?php echo renderCustomText($item, 1901306027); ?></td>
            </tr>

            <tr>
                <td colspan="3" style="padding-top: 55px;"><strong>D. Kemampuan Keluarga Dalam Merawat Pasien :</strong></td>
            </tr>
            <tr>
                <td><?php echo renderCheckbox($item, 1901306031); ?></td>
                <td colspan="2">Baik</td>
            </tr>
            <tr>
                <td><?php echo renderCheckbox($item, 1901306032); ?></td>
                <td colspan="2">Cukup</td>
            </tr>
            <tr>
                <td><?php echo renderCheckbox($item, 1901306033); ?></td>
                <td colspan="2">Masih Memerlukan Pendampingan</td>
            </tr>
            <tr>
                <td><?php echo renderCheckbox($item, 1901306035); ?></td>
                <td colspan="2"><?php echo renderCustomText($item, 1901306036); ?></td>
            </tr>

            <tr>
                <td colspan="3" style="padding-top: 55px;"><strong>E. Rekomendasi :</strong></td>
            </tr>
            <tr>
                <td></td>
                <td colspan="2"><strong>Mohon bantuan pihak Puskesmas untuk :</strong></td>
            </tr>
            <tr>
                <td><?php echo renderCheckbox($item, 1901306041); ?></td>
                <td colspan="2">Monitoring Kepatuhan Minum Obat</td>
            </tr>
            <tr>
                <td><?php echo renderCheckbox($item, 1901306042); ?></td>
                <td colspan="2">Monitoring Tanda Kekambuhan</td>
            </tr>
            <tr>
                <td><?php echo renderCheckbox($item, 1901306043); ?></td>
                <td colspan="2">Edukasi Kesehatan Jiwa Lanjutan</td>
            </tr>
            <tr>
                <td><?php echo renderCheckbox($item, 1901306044); ?></td>
                <td colspan="2">Pendampingan Kontrol Rutin</td>
            </tr>
            <tr>
                <td><?php echo renderCheckbox($item, 1901306045); ?></td>
                <td colspan="2">Home Visit Jika Diperlukan</td>
            </tr>
            <tr>
                <td><?php echo renderCheckbox($item, 1901306046); ?></td>
                <td colspan="2">Koordinasi Rujukan Kembali Jika Kondisi Memburuk</td>
            </tr>
            <tr>
                <td><?php echo renderCheckbox($item, 1901306047); ?></td>
                <td colspan="2"><?php echo renderCustomText($item, 1901306048); ?></td>
            </tr>
            <tr>
                <td colspan="3" style="padding-top: 10px;">Catatan Tambahan :</td>
            </tr>
            <tr>
                <td colspan="3" style="padding-left: 1.5em;">
                    <?php echo nl2br(htmlspecialchars(itemValue($item, 1901306049), ENT_QUOTES, 'UTF-8')); ?>
                </td>
            </tr>
        </table>

        <table style="width: 100%; margin-top: 20px; margin-right: 20px; font-size: 12pt !important;">
            <tr>
                <td style="width:50%"></td>
                <td style="width:50%; text-align: right;">Yogyakarta, <span style="border-bottom: 1px dotted #000;"><?php echo htmlspecialchars(isset($item[1901307160]) ? $item[1901307160] : '', ENT_QUOTES, 'UTF-8'); ?></span></td>
            </tr>
            <tr>
                <td></td>
                <td style="text-align: center; vertical-align: top; height: 60px;"><b>DPJP</b></td>
            </tr>
            <tr>
                <td></td>
                <td style="text-align: center;"><span><?php echo htmlspecialchars(isset($item[1901307170]) ? $item[1901307170] : '', ENT_QUOTES, 'UTF-8'); ?></span></td>
            </tr>
        </table>

    </section>
</body>

</html>