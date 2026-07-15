<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Rujukan Edukasi Pasien</title>
    <style>
        @page {
            size: A4;
            margin: 0;
        }

        @media print {
            body {
                margin: 0;
                padding: 0;
            }

            table {
                page-break-after: auto;
            }
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: Tahoma, Geneva, sans-serif;
            font-size: 10pt;
            line-height: 1.35;
            color: #000;
            background: #fff;
        }

        .page {
            width: 100%;
            height: auto;
            margin: 0 auto;
            padding: 10mm 12mm 10mm 12mm;
            background: white;
            position: relative;
        }

        /* Header Section */
        .header-section {
            width: 100%;
            margin-bottom: 6px;
            padding-bottom: 5px;
            border-bottom: 2px solid #000;
        }

        .header-table {
            width: 100%;
            text-align: center;
        }

        .header-table td {
            padding: 0;
            vertical-align: middle;
        }

        .logo-cell {
            width: 13%;
            text-align: center;
        }

        .logo-cell img {
            width: 70px;
            height: auto;
            margin: 0;
            padding: 0;
        }

        .title-cell {
            width: 74%;
            padding: 0 8px;
            text-align: center;
        }

        .title-cell b {
            display: block;
            font-weight: bold;
            line-height: 1.3;
        }

        .title-cell .hospital-name {
            display: block;
            font-size: 11pt;
            font-weight: bold;
            margin: 1px 0;
        }

        .title-cell .gov-name,
        .title-cell .dept-name {
            display: block;
            font-size: 10pt;
            font-weight: bold;
            margin: 0.5px 0;
            letter-spacing: 0.3px;
        }

        .title-cell .javanese-script {
            margin: 0.5px 0;
        }

        .title-cell .javanese-script img {
            width: 100px;
            height: auto;
        }

        .title-cell .address-info {
            font-size: 7pt;
            font-weight: normal;
            line-height: 1.1;
            margin-top: 0.5px;
        }

        .title-cell a {
            color: blue;
            text-decoration: underline;
        }

        .logo-right {
            width: 13%;
            text-align: center;
        }

        .logo-right img {
            width: 100px;
            height: auto;
            margin: 0;
            padding: 0;
        }

        /* Content Section */
        .content-section {
            width: 100%;
            margin-top: 8px;
        }

        /* Tanggal dan Tempat */
        .date-info {
            margin-bottom: 8px;
            font-size: 10pt;
        }

        .date-info .label {
            display: inline-block;
            width: 50px;
            font-weight: normal;
        }

        .date-line {
            display: inline-block;
            width: 200px;
            text-align: center;
        }

        /* Kepada Yth */
        .recipient-section {
            margin-bottom: 10px;
            font-size: 10pt;
        }

        .recipient-label {
            /* font-weight: bold; */
            margin-bottom: 2px;
        }

        .recipient-table {
            margin-left: 0;
            width: 100%;
            border-collapse: collapse;
        }

        .recipient-table tr {
            height: auto;
        }

        .recipient-table tr td:first-child {
            width: 35px;
            font-weight: normal;
            padding-right: 5px;
            padding-top: 3px;
            padding-bottom: 3px;
            vertical-align: top;
            white-space: nowrap;
        }

        .recipient-table tr td:last-child {
            padding-bottom: 4px;
            padding-top: 3px;
            min-height: 20px;
        }

        .recipient-table tr td.colon {
            width: 15px;
            text-align: center;
            padding: 0;
            vertical-align: top;
            padding-top: 3px;
        }

        /* Judul Laporan */
        .report-title {
            text-align: center;
            margin: 12px 0 12px 0;
            font-size: 11pt;
            font-weight: bold;
        }

        .report-title .main-title {
            text-decoration: underline;
            display: block;
            letter-spacing: 0.5px;
            margin-bottom: 3px;
        }

        .report-title .no-title {
            display: block;
            font-size: 10pt;
            margin-top: 3px;
        }

        .no-line {
            display: inline-block;
            width: 350px;
            text-align: center;
        }

        /* Detail Pasien */
        .patient-section {
            margin-bottom: 20px;
            font-size: 10pt;
            line-height: 1.4;
        }

        .patient-intro {
            margin-bottom: 2px;
            font-weight: normal;
            font-size: 10pt;
        }

        .patient-table {
            margin-left: 0;
            width: 100%;
            font-size: 10pt;
            border-collapse: collapse;
        }

        .patient-table tr td:first-child {
            width: 90px;
            padding-right: 5px;
            padding-top: 0;
            padding-bottom: 0;
        }

        .patient-table tr td.colon {
            width: 12px;
            text-align: center;
            padding: 0;
        }

        .patient-table tr td:last-child {
            width: calc(100% - 102px);
            padding-bottom: 0;
            padding-top: 0;
            min-height: 15px;
        }

        .patient-table tr {
            height: 30px;
        }

        /* Pemeriksaan / Perawatan */
        .examination-section {
            margin-top: 15px;
            margin-bottom: 20px;
            font-size: 10pt;
            line-height: 1.4;
        }

        .examination-title {
            /* font-weight: bold; */
            margin-bottom: 5px;
        }

        .examination-table {
            width: 100%;
            margin: 0;
            padding: 0;
            border-collapse: collapse;
        }

        .examination-table tr td:first-child {
            width: 175px;
            vertical-align: top;
            padding-top: 0;
            padding-right: 5px;
            padding-bottom: 10px;
            font-size: 10pt;
            white-space: nowrap;
        }

        .examination-table tr td.colon {
            width: 12px;
            text-align: center;
            vertical-align: top;
            padding: 0 0 10px 0;
        }

        .examination-table tr td:last-child {
            vertical-align: top;
            padding-top: 0;
            padding-bottom: 10px;
        }

        .examination-row {
            margin-bottom: 3px;
        }

        .diagnosis-line {
            display: block;
            margin-bottom: 1px;
            min-height: 12px;
            line-height: 1.4;
        }

        .therapy-line {
            display: block;
            margin-bottom: 1px;
            min-height: 12px;
            line-height: 1.4;
        }

        /* Penutup */
        .closing-section {
            margin-top: 15px;
            margin-bottom: 20px;
            font-size: 10pt;
            line-height: 1.3;
        }

        /* Tanda Tangan */
        .signature-section {
            width: 100%;
            margin-top: 25px;
            font-size: 10pt;
        }

        .signature-table {
            width: 100%;
            padding: 0;
            margin: 0;
        }

        .signature-table tr {
            height: auto;
        }

        .signature-left {
            width: 50%;
            text-align: left;
        }

        .signature-right {
            width: 50%;
            text-align: center;
            padding-left: 20px;
        }

        .signature-box {
            min-width: 240px;
            max-width: 100%;
            margin-left: auto;
            margin-right: 0;
            text-align: center;
        }

        .signature-title {
            font-weight: normal;
            margin-bottom: 40px;
            display: block;
            font-size: 10pt;
            color: #000;
        }

        .signature-name {
            border-bottom: 1px solid #000;
            min-height: 20px;
            line-height: 20px;
            margin-bottom: 2px;
            font-size: 10pt;
            color: #000;
            padding: 0 5px;
            white-space: nowrap;
        }

        .nip-line {
            text-align: left;
            font-size: 10pt;
            margin-top: 2px;
            color: #000;
        }

        /* Utility Classes */
        .dotted-line {
            display: inline-block;
        }

        .empty-space {
            min-height: 60px;
        }

        input[type="checkbox"] {
            vertical-align: middle;
            transform: scale(0.8);
            margin-right: 5px;
            accent-color: #000;
        }

        label {
            vertical-align: middle;
            margin-left: 3px;
        }
    </style>
</head>

<body>
    <div class="page">
        <!-- Header Section -->
        <div class="header-section">
            <table class="header-table" cellspacing="0" cellpadding="0" border="0">
                <tr>
                    <td class="logo-cell">
                        <img src="img/diy.png" alt="Logo DIY">
                    </td>
                    <td class="title-cell">
                        <span class="gov-name">PEMERINTAH DAERAH DAERAH ISTIMEWA YOGYAKARTA</span>
                        <span class="dept-name">DINAS KESEHATAN</span>
                        <span class="hospital-name">RUMAH SAKIT JIWA GRHASIA</span>
                        <div class="javanese-script">
                            <img src="img/aksara_jawa-com.png" alt="Aksara Jawa">
                        </div>
                        <div class="address-info">
                            Jalan Kaliurang KM 17 Sleman, Kode Pos 55582, Telepon: (0274) 895297<br>
                            Faksimile: (0274) 895142, Pos-el: <a href="mailto:grhasiamentalhospital@jogjaprov.go.id">grhasiamentalhospital@jogjaprov.go.id</a><br>
                            Laman: <a href="http://grhasia.jogjaprov.go.id" style="text-decoration: none; color: #000;">grhasia.jogjaprov.go.id</a>
                        </div>
                    </td>
                    <td class="logo-right">
                        <img src="img/logo_grhasia_full.png" alt="Logo Grhasia">
                    </td>
                </tr>
            </table>
        </div>

        <!-- Content Section -->
        <div class="content-section">
            <!-- Tanggal -->
            <div class="date-info">
                <span class="label">Sleman,</span>
                <span class="date-line"><?php echo isset($item[1901310026]) ? htmlspecialchars($item[1901310026], ENT_QUOTES, 'UTF-8') : '&nbsp;'; ?></span>
            </div>

            <!-- Kepada Yth -->
            <div class="recipient-section">
                <div class="recipient-label">Kepada :</div>
                <table class="recipient-table" cellspacing="0" cellpadding="0" border="0">
                    <tr>
                        <td>Yth.</td>
                        <td class="colon">:</td>
                        <td>
                            <?php 
                            if (isset($item[1901310027]) && trim($item[1901310027]) !== '') {
                                echo nl2br(htmlspecialchars($item[1901310027], ENT_QUOTES, 'UTF-8'));
                            } else {
                                echo '&nbsp;';
                            }
                            ?>
                        </td>
                    </tr>
                    <tr>
                        <td>di</td>
                        <td class="colon">:</td>
                        <td>
                            <?php echo isset($item[1901310028]) && trim($item[1901310028]) !== '' ? htmlspecialchars($item[1901310028], ENT_QUOTES, 'UTF-8') : '&nbsp;'; ?>
                        </td>
                    </tr>
                </table>
            </div>

            <!-- Judul Laporan -->
            <div class="report-title">
                <span class="main-title">SURAT KETERANGAN RUJUKAN</span>
                <span class="no-title">Nomor : </span>
            </div>

            <!-- Detail Pasien -->
            <div class="patient-section">
                <div class="patient-intro">Bersama ini kami kirimkan penderita/klien :</div>
                <table class="patient-table" cellspacing="0" cellpadding="3" border="0">
                    <tr>
                        <td>Nama</td>
                        <td class="colon">:</td>
                        <td><?php echo htmlspecialchars(isset($item[1901310029]) ? $item[1901310029] : '', ENT_QUOTES, 'UTF-8'); ?></td>
                    </tr>
                    <tr>
                        <td>Umur</td>
                        <td class="colon">:</td>
                        <td><?php echo htmlspecialchars(isset($item[1901310030]) ? $item[1901310030] : '', ENT_QUOTES, 'UTF-8'); ?></td>
                    </tr>
                    <tr>
                        <td>Pekerjaan</td>
                        <td class="colon">:</td>
                        <td><?php echo htmlspecialchars(isset($item[1901310031]) ? $item[1901310031] : '', ENT_QUOTES, 'UTF-8'); ?></td>
                    </tr>
                    <tr>
                        <td>Alamat</td>
                        <td class="colon">:</td>
                        <td><?php echo htmlspecialchars(isset($item[1901310032]) ? $item[1901310032] : '', ENT_QUOTES, 'UTF-8'); ?></td>
                    </tr>
                </table>
            </div>

            <!-- Pemeriksaan / Perawatan Lanjutan -->
            <div class="examination-section">
                <div class="examination-title">Mohon pemeriksaan / perawatan lanjutan :</div>
                <table class="examination-table" cellspacing="0" cellpadding="0" border="0">
                    <tr class="examination-row">
                        <td>Diagnosa sementara</td>
                        <td class="colon">:</td>
                        <td>
                            <?php 
                            if(isset($item[1901310033]) && trim($item[1901310033]) !== '') {
                                echo '<span class="diagnosis-line">' . nl2br(htmlspecialchars($item[1901310033], ENT_QUOTES, 'UTF-8')) . '</span>';
                            } else {
                                echo '<span class="diagnosis-line"></span>';
                                echo '<span class="diagnosis-line"></span>';
                            }
                            ?>
                        </td>
                    </tr>
                    <tr class="examination-row" style="margin-top: 15px; padding-top: 10px;">
                        <td>Pengobatan Terakhir</td>
                        <td class="colon">:</td>
                        <td>
                            <?php 
                            if(isset($item[1901310034]) && trim($item[1901310034]) !== '') {
                                echo '<span class="therapy-line">' . nl2br(htmlspecialchars($item[1901310034], ENT_QUOTES, 'UTF-8')) . '</span>';
                            } else {
                                echo '<span class="therapy-line"></span>';
                                echo '<span class="therapy-line"></span>';
                            }
                            ?>
                        </td>
                    </tr>
                </table>
            </div>

            <!-- Penutup -->
            <div class="closing-section">
                Atas bantuan dan perhatiannya kami ucapkan terima kasih.
            </div>

            <!-- Tanda Tangan -->
            <div class="signature-section">
                <table class="signature-table" cellspacing="0" cellpadding="0" border="0">
                    <tr>
                        <td class="signature-left"></td>
                        <td class="signature-right">
                            <div class="signature-box">
                                <span class="signature-title">Dokter Pemeriksa,</span>
                                <div class="signature-name">
                                    ( <?php echo htmlspecialchars(isset($item[1901310035]) ? $item[1901310035] : '', ENT_QUOTES, 'UTF-8'); ?> )
                                </div>
                                <div class="nip-line">
                                    NIP. <?php echo htmlspecialchars(isset($data[0]->nip_dokter) ? $data[0]->nip_dokter : '', ENT_QUOTES, 'UTF-8'); ?>
                                </div>
                            </div>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
</body>

</html>