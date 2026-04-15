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
    <title>Pemantauan Terapi Obat</title>
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
    </style>
</head>

<body class="A4" style="font-family:Tahoma;height: auto">
    <section style="font-family:Arial;padding:5mm 5mm 5mm 5mm;page-break-after: page;">
        <table cellspacing="0" cellpadding="0" border="0" width="100%">
            <tbody>
                <tr>
                    <td style="text-align: center;" width="15%">
                        <img src="img/logo_grhasia_com.png" alt="Logo" style="width: 70px; margin: 0 !important;
                        padding: 0 !important;">
                        <br>
                        <span style="font-size: 7pt; font-weight: bold">RS JIWA GRHASIA</span>
                        <br>
                        <span style="font-size: 8px; font-weight: bold">Daerah Istimewa Yogyakarta</span>
                    </td>
                    <td style="text-align: center;vertical-align: top" width="50%">
                        <b>
                            <span style="font-size: 9pt;"><?php echo htmlspecialchars($res['profile']->baris1, ENT_QUOTES, 'UTF-8'); ?></span>
                            <br>
                            <span style="font-size: 10pt;"><?php echo htmlspecialchars($res['profile']->baris2, ENT_QUOTES, 'UTF-8'); ?></span>
                            <br>
                            <span style="font-size: 10pt;"><?php echo htmlspecialchars(strtoupper($res['profile']->namalengkap), ENT_QUOTES, 'UTF-8'); ?></span>
                            <br>
                            <img src="img/aksara_jawa-com.png" alt="Logo" style="width: 140px;">
                            <br>
                            <span style="font-size: 7pt; font-weight: normal">Jalan Kaliurang Km 17 Sleman, Telepon:
                                <?php echo htmlspecialchars($res['profile']->fixedphone, ENT_QUOTES, 'UTF-8'); ?>
                                <br style="margin: 0px">
                                Laman: <?php echo htmlspecialchars($res['profile']->website, ENT_QUOTES, 'UTF-8'); ?>, Surel: <?php echo htmlspecialchars($res['profile']->alamatemail, ENT_QUOTES, 'UTF-8'); ?>
                            </span>

                        </b>
                    </td>
                    {{-- @php 
                        @dd($res);
                        @endphp --}}
                    <td width="30%">
                        <div class="box" style="text-align: left">
                            <table style="padding: 1px;">
                                <tr>
                                    <td class="f-s-15  text-top" style="width: 40%">No. RM</td>
                                    <td class="f-s-15  text-top" style="width: 5%">:</td>
                                    <td class="f-s-15 text-top" style="width: 60%"><?php echo htmlspecialchars($res['d'][0]->nocm, ENT_QUOTES, 'UTF-8'); ?></td>
                                </tr>
                                <tr>
                                    <td class="f-s-15  text-top">Nama</td>
                                    <td class="f-s-15  text-top">:</td>
                                    <td class="f-s-15  text-top"><?php echo htmlspecialchars($res['d'][0]->namapasien, ENT_QUOTES, 'UTF-8'); ?>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="f-s-15  text-top">Jenis Kelamin</td>
                                    <td class="f-s-15  text-top">:</td>
                                    <td class="f-s-15  text-top"><?php echo htmlspecialchars($res['d'][0]->jeniskelamin, ENT_QUOTES, 'UTF-8'); ?></td>
                                </tr>
                                <tr>
                                    <td class="f-s-15  text-top">Tgl Lahir</td>
                                    <td class="f-s-15  text-top">:</td>
                                    <td class="f-s-15  text-top"><?php echo date('d-m-Y', strtotime($res['d'][0]->tgllahir)); ?></td>
                                </tr>
                            </table>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td colspan="3">
                        <hr>
                    </td>
                </tr>
                <tr>
                    <th colspan="3">PEMANTAUAN TERAPI OBAT</th>
                </tr>
        </table>

        <table cellspacing="0" cellpadding="0" border="1" width="100%" style="margin-top: 10px;">
            <tbody>
                <tr data-section-header>
                    <td colspan="3" style="font-weight: bold; padding: 6px 6px; background: #f4f4f4;">DATA PASIEN</td>
                </tr>
                <tr>
                    <td colspan="3">
                        <table style="width:100%; border-collapse: collapse;">
                            <tr>
                                <td style="width:20%; font-weight:bold;">Berat Badan</td>
                                <td style="width:2%;">:</td>
                                <td style="width:23%;">
                                    <?php echo htmlspecialchars(isset($item[3014250]) ? $item[3014250] : '', ENT_QUOTES, 'UTF-8'); ?> Kg
                                </td>

                                <td style="width:13%; font-weight:bold;">Tinggi Badan</td>
                                <td style="width:2%;">:</td>
                                <td style="width:20%;">
                                    <?php echo htmlspecialchars(isset($item[7890444]) ? $item[7890444] : '', ENT_QUOTES, 'UTF-8'); ?> cm
                                </td>
                            </tr>

                            <tr>
                                <td style="font-weight:bold;">Alamat</td>
                                <td>:</td>
                                <td colspan="4">
                                    <?php echo htmlspecialchars(isset($item[3014252]) ? $item[3014252] : '', ENT_QUOTES, 'UTF-8'); ?>
                                </td>
                            </tr>

                            <tr>
                                <td style="font-weight:bold;">Nomor Telepon</td>
                                <td>:</td>
                                <td colspan="4">
                                    <?php echo htmlspecialchars(isset($item[3014253]) ? $item[3014253] : '', ENT_QUOTES, 'UTF-8'); ?>
                                </td>
                            </tr>

                            <tr>
                                <td style="font-weight:bold;">Tanggal Masuk Rumah Sakit</td>
                                <td>:</td>
                                <td>
                                    <?php echo htmlspecialchars(isset($item[3014254]) ? $item[3014254] : '', ENT_QUOTES, 'UTF-8'); ?>
                                </td>

                                <td style="font-weight:bold;">Ruang Rawat Inap</td>
                                <td>:</td>
                                <td>
                                    <?php echo htmlspecialchars(isset($item[3014255]) ? $item[3014255] : '', ENT_QUOTES, 'UTF-8'); ?>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr data-section-header>
                    <td colspan="3" style="padding-top: 12px; font-weight: bold; background: #f4f4f4;">KELUHAN UTAMA</td>
                </tr>
                <tr>
                    <td colspan="3" style="white-space: pre-wrap;"><?php echo nl2br(htmlspecialchars(isset($item[3014256]) ? $item[3014256] : '', ENT_QUOTES, 'UTF-8')); ?></td>
                </tr>
                <tr data-section-header>
                    <td colspan="3" style="padding-top: 12px; font-weight: bold; background: #f4f4f4;">RIWAYAT PENYAKIT SEKARANG</td>
                </tr>
                <tr>
                    <td colspan="3" style="white-space: pre-wrap;"><?php echo nl2br(htmlspecialchars(isset($item[3014257]) ? $item[3014257] : '', ENT_QUOTES, 'UTF-8')); ?></td>
                </tr>
                <tr data-section-header>
                    <td colspan="3" style="padding-top: 12px; font-weight: bold; background: #f4f4f4;">RIWAYAT PENYAKIT TERDAHULU</td>
                </tr>
                <tr>
                    <td colspan="3" style="white-space: pre-wrap;"><?php echo nl2br(htmlspecialchars(isset($item[3014258]) ? $item[3014258] : '', ENT_QUOTES, 'UTF-8')); ?></td>
                </tr>
                <tr data-section-header>
                    <td colspan="3" style="padding-top: 12px; font-weight: bold; background: #f4f4f4;">RIWAYAT KELUARGA</td>
                </tr>
                <tr>
                    <td colspan="3" style="white-space: pre-wrap;"><?php echo nl2br(htmlspecialchars(isset($item[3014259]) ? $item[3014259] : '', ENT_QUOTES, 'UTF-8')); ?></td>
                </tr>
                <tr data-section-header>
                    <td colspan="3" style="padding-top: 12px; font-weight: bold; background: #f4f4f4;">RIWAYAT SOSIAL</td>
                </tr>
                <tr>
                    <td colspan="3" style="white-space: pre-wrap;"><?php echo nl2br(htmlspecialchars(isset($item[3014260]) ? $item[3014260] : '', ENT_QUOTES, 'UTF-8')); ?></td>
                </tr>
                <tr data-section-header>
                    <td colspan="3" style="padding-top: 12px; font-weight: bold; background: #f4f4f4;">RIWAYAT PENGGUNAAN OBAT</td>
                </tr>
                <tr>
                    <td colspan="3" style="white-space: pre-wrap;"><?php echo nl2br(htmlspecialchars(isset($item[3014261]) ? $item[3014261] : '', ENT_QUOTES, 'UTF-8')); ?></td>
                </tr>
                <tr data-section-header>
                    <td colspan="3" style="padding-top: 12px; font-weight: bold; background: #f4f4f4;">HASIL PEMERIKSAAN FISIK</td>
                </tr>
                <tr>
                    <td colspan="3" style="white-space: pre-wrap;"><?php echo nl2br(htmlspecialchars(isset($item[3014262]) ? $item[3014262] : '', ENT_QUOTES, 'UTF-8')); ?></td>
                </tr>
                <tr data-section-header>
                    <td colspan="3" style="padding-top: 12px; font-weight: bold; background: #f4f4f4;">HASIL PEMERIKSAAN LABORATORIUM</td>
                </tr>
                <?php if (!empty($labResults)): ?>
                    <tr>
                        <td colspan="3">
                            <table border="1" cellspacing="0" cellpadding="4" style="width:100%; border-collapse: collapse; font-size: 10pt;">
                                <thead style="background: #e8e8e8; font-weight: bold;">
                                    <tr>
                                        <td style="width: 10%;">Tanggal</td>
                                        <td style="width: 20%;">Nama Pemeriksaan</td>
                                        <td style="width: 20%;">Detail Pemeriksaan</td>
                                        <td style="width: 12%;">Hasil</td>
                                        <td style="width: 15%;">Nilai Normal</td>
                                        <td style="width: 15%;">Satuan</td>
                                        <td style="width: 8%;">Flag</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php foreach ($labResults as $lab): ?>
                                        <tr>
                                            <td><?php echo date('d/m/Y', strtotime($lab->tglpelayanan)); ?></td>
                                            <td><?php echo htmlspecialchars($lab->namaproduk, ENT_QUOTES, 'UTF-8'); ?></td>
                                            <td><?php echo htmlspecialchars($lab->detailpemeriksaan, ENT_QUOTES, 'UTF-8'); ?></td>
                                            <td style="text-align: <?php echo ($lab->flag != 'N' ? 'center; color: red; font-weight: bold;' : 'center;'); ?>"><?php echo htmlspecialchars($lab->hasil ?? '-', ENT_QUOTES, 'UTF-8'); ?></td>
                                            <td><?php echo htmlspecialchars($lab->nilaitext ?? '-', ENT_QUOTES, 'UTF-8'); ?></td>
                                            <td><?php echo htmlspecialchars($lab->satuanstandar ?? '-', ENT_QUOTES, 'UTF-8'); ?></td>
                                            <td style="text-align: center;"><?php echo ($lab->flag == 'N' ? '✓' : '✗'); ?></td>
                                        </tr>
                                    <?php endforeach; ?>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                <?php endif; ?>
                <tr data-section-header>
                    <td colspan="3" style="padding-top: 12px; font-weight: bold; background: #f4f4f4;">HASIL PEMERIKSAAN DIAGNOSTIK</td>
                </tr>
                <tr>
                    <td colspan="3" style="white-space: pre-wrap;"><?php echo nl2br(htmlspecialchars(isset($item[3014264]) ? $item[3014264] : '', ENT_QUOTES, 'UTF-8')); ?></td>
                </tr>
                <tr data-section-header>
                    <td colspan="3" style="padding-top: 12px; font-weight: bold; background: #f4f4f4;">HASIL PEMERIKSAAN MIKROBIOLOGI</td>
                </tr>
                <tr>
                    <td colspan="3" style="white-space: pre-wrap;"><?php echo nl2br(htmlspecialchars(isset($item[3014265]) ? $item[3014265] : '', ENT_QUOTES, 'UTF-8')); ?></td>
                </tr>
                <tr data-section-header>
                    <td colspan="3" style="padding-top: 12px; font-weight: bold; background: #f4f4f4;">DIAGNOSIS</td>
                </tr>
                <tr>
                    <td colspan="3" style="white-space: pre-wrap;"><?php echo nl2br(htmlspecialchars(isset($item[3014266]) ? $item[3014266] : '', ENT_QUOTES, 'UTF-8')); ?></td>
                </tr>
                <tr data-section-header>
                    <td colspan="3" style="padding-top: 12px; font-weight: bold; background: #f4f4f4;">PENGGUNAAN OBAT SAAT INI</td>
                </tr>
                <tr>
                    <td colspan="3" style="white-space: pre-wrap;"><?php echo nl2br(htmlspecialchars(isset($item[3014267]) ? $item[3014267] : '', ENT_QUOTES, 'UTF-8')); ?></td>
                </tr>
                <tr data-section-header>
                    <td colspan="3" style="padding-top: 12px; font-weight: bold; background: #f4f4f4;">PEMANTAUAN (S O A P)</td>
                </tr>
                <tr>
                    <td colspan="3" style="white-space: pre-wrap;"><?php echo nl2br(htmlspecialchars(isset($item[3014268]) ? $item[3014268] : '', ENT_QUOTES, 'UTF-8')); ?></td>
                </tr>
            </tbody>
        </table>
    </section>
</body>

</html>