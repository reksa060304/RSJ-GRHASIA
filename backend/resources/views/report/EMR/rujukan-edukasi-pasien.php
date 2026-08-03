<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SURAT KETERANGAN RUJUKAN</title>
    <style>
        @page {
            size: A4;
            margin: 10mm 15mm 10mm 15mm;
        }

        body, table, td, th, div, span, p {
            font-family: Tahoma, Geneva, sans-serif;
            font-size: 10.5pt;
            line-height: 1.4;
            color: #000;
        }

        body {
            margin: 0;
            padding: 0;
            background: #fff;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        .report-title {
            text-align: center;
            margin: 15px 0 15px 0;
        }

        .report-title .main-title {
            font-size: 12pt;
            font-weight: bold;
            text-decoration: underline;
            display: block;
        }

        .report-title .no-title {
            font-size: 10.5pt;
            display: block;
            margin-top: 4px;
        }
    </style>
</head>

<body class="A4">
    <section style="padding: 0; page-break-after: page;">
        <!-- Kop Header -->
        <table cellspacing="0" cellpadding="0" border="0" style="border-bottom: 2px solid #000; margin-bottom: 6px; padding-bottom: 5px;">
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

        <!-- Tanggal -->
        <table style="margin-top: 10px;">
            <tr>
                <td style="width: 60%;"></td>
                <td style="width: 40%; text-align: left;">
                    Sleman, <?php echo isset($item[1901310026]) ? htmlspecialchars($item[1901310026], ENT_QUOTES, 'UTF-8') : '........................'; ?>
                </td>
            </tr>
        </table>

        <!-- Kepada Yth -->
        <table style="margin-top: 10px;">
            <tr>
                <td colspan="3">Kepada :</td>
            </tr>
            <tr>
                <td style="width: 8%; vertical-align: top; padding: 2px 0;">Yth.</td>
                <td style="width: 2%; vertical-align: top; padding: 2px 0;">:</td>
                <td style="width: 90%; vertical-align: top; padding: 2px 0;">
                    <?php 
                    if (isset($item[1901310027]) && trim($item[1901310027]) !== '') {
                        echo nl2br(htmlspecialchars($item[1901310027], ENT_QUOTES, 'UTF-8'));
                    } else {
                        echo '....................................................................................';
                    }
                    ?>
                </td>
            </tr>
            <tr>
                <td style="vertical-align: top; padding: 2px 0;">di</td>
                <td style="vertical-align: top; padding: 2px 0;">:</td>
                <td style="vertical-align: top; padding: 2px 0;">
                    <?php echo isset($item[1901310028]) && trim($item[1901310028]) !== '' ? htmlspecialchars($item[1901310028], ENT_QUOTES, 'UTF-8') : '....................................................................................'; ?>
                </td>
            </tr>
        </table>

        <!-- Judul Laporan -->
        <div class="report-title">
            <span class="main-title">SURAT KETERANGAN RUJUKAN</span>
            <span class="no-title">Nomor : </span>
        </div>

        <!-- Detail Pasien -->
        <table style="margin-top: 10px;">
            <tr>
                <td colspan="3" style="padding-bottom: 6px;">Bersama ini kami kirimkan penderita/klien :</td>
            </tr>
            <tr>
                <td style="width: 25%; padding: 3px 0;">Nama</td>
                <td style="width: 3%; padding: 3px 0;">:</td>
                <td style="width: 72%; padding: 3px 0;"><?php echo htmlspecialchars(isset($item[1901310029]) ? $item[1901310029] : '', ENT_QUOTES, 'UTF-8'); ?></td>
            </tr>
            <tr>
                <td style="padding: 3px 0;">Umur</td>
                <td style="padding: 3px 0;">:</td>
                <td style="padding: 3px 0;"><?php echo htmlspecialchars(isset($item[1901310030]) ? $item[1901310030] : '', ENT_QUOTES, 'UTF-8'); ?></td>
            </tr>
            <tr>
                <td style="padding: 3px 0;">Pekerjaan</td>
                <td style="padding: 3px 0;">:</td>
                <td style="padding: 3px 0;"><?php echo htmlspecialchars(isset($item[1901310031]) ? $item[1901310031] : '', ENT_QUOTES, 'UTF-8'); ?></td>
            </tr>
            <tr>
                <td style="padding: 3px 0;">Alamat</td>
                <td style="padding: 3px 0;">:</td>
                <td style="padding: 3px 0;"><?php echo htmlspecialchars(isset($item[1901310032]) ? $item[1901310032] : '', ENT_QUOTES, 'UTF-8'); ?></td>
            </tr>
        </table>

        <!-- Pemeriksaan / Perawatan Lanjutan -->
        <table style="margin-top: 15px;">
            <tr>
                <td colspan="3" style="padding-bottom: 6px;">Mohon pemeriksaan / perawatan lanjutan :</td>
            </tr>
            <tr>
                <td style="width: 25%; vertical-align: top; padding: 4px 0;">Diagnosa sementara</td>
                <td style="width: 3%; vertical-align: top; padding: 4px 0;">:</td>
                <td style="width: 72%; vertical-align: top; padding: 4px 0;">
                    <?php 
                    if(isset($item[1901310033]) && trim($item[1901310033]) !== '') {
                        echo nl2br(htmlspecialchars($item[1901310033], ENT_QUOTES, 'UTF-8'));
                    } else {
                        echo '-';
                    }
                    ?>
                </td>
            </tr>
            <tr>
                <td style="vertical-align: top; padding: 4px 0;">Pengobatan Terakhir</td>
                <td style="vertical-align: top; padding: 4px 0;">:</td>
                <td style="vertical-align: top; padding: 4px 0;">
                    <?php 
                    if(isset($item[1901310034]) && trim($item[1901310034]) !== '') {
                        echo nl2br(htmlspecialchars($item[1901310034], ENT_QUOTES, 'UTF-8'));
                    } else {
                        echo '-';
                    }
                    ?>
                </td>
            </tr>
        </table>

        <!-- Penutup -->
        <div style="margin-top: 20px;">
            Atas bantuan dan perhatiannya kami ucapkan terima kasih.
        </div>

        <!-- Tanda Tangan Dokter -->
        <table style="margin-top: 30px;">
            <tr>
                <td style="width: 50%;"></td>
                <td style="width: 50%; text-align: center;">
                    Dokter Pemeriksa,
                    <br><br><br><br><br>
                    <span style="text-decoration: underline; font-weight: bold;">
                        ( <?php echo htmlspecialchars(isset($item[1901310035]) ? $item[1901310035] : '', ENT_QUOTES, 'UTF-8'); ?> )
                    </span>
                    <br>
                    NIP. <?php echo htmlspecialchars(isset($data[0]->nip_dokter) ? $data[0]->nip_dokter : '', ENT_QUOTES, 'UTF-8'); ?>
                </td>
            </tr>
        </table>
    </section>
</body>

</html>