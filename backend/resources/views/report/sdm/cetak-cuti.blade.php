<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Formulir Cuti</title>

    <style>
        @page {
            size: A4 portrait;
            margin: 10mm;
        }

        body {
            font-family: Arial, sans-serif;
            line-height: 1.35;
            margin: 0;
            font-size: 10pt;
        }

        td { vertical-align: top; }

        h3 {
            margin: 5px 0 12px 0;
            font-size: 11pt;
        }

        .signature-box {
            width: 100%;
            margin-top: 25px;
            font-size: 10pt;
        }

        .signature-right {
            width: 40%;
            text-align: left;
            float: right;
        }

        /* Barcode kiri bawah (naikkan lebih tinggi agar tidak mentok) */
        .barcode-box {
            position: fixed;
            bottom: 12mm; /* NAIK dari 5mm → 12mm */
            left: 5mm;
            text-align: left;
            font-size: 8pt;
        }

        .barcode-placeholder {
            width: 110px;
            height: 35px;
            border: 1px dashed #000;
            margin-bottom: 3px;
        }
    </style>
</head>

<body>

<section>

    <!-- HEADER -->
    <table width="100%">
        <tr>
            <td  style="text-align: center;" width="15%" >
                <img src="img/logo_grhasia_com.png" alt="Logo" style="width: 70px; margin: 0 !important;
                padding: 0 !important;">
                <br>
                <span style="font-size: 7pt; font-weight: bold">RS JIWA GRHASIA</span>
                <br>
                <span style="font-size: 8px; font-weight: bold">Daerah Istimewa Yogyakarta</span>
            </td>
            <td style="text-align: center;vertical-align: top" width="85%">
                <b>
                    <span style="font-size: 9pt;">{!! $res['profile']->baris1 !!}</span>
                    <br>
                    <span style="font-size: 10pt;">{!! $res['profile']->baris2 !!}</span>
                    <br>
                    <span style="font-size: 10pt;">{!! strtoupper($res['profile']->namalengkap) !!}</span>
                    <br>
                    <img src="img/aksara_jawa-com.png" alt="Logo" style="width: 140px;">
                    <br>
                    <span style="font-size: 7pt; font-weight: normal">Jalan Kaliurang Km 17 Sleman, Telepon: {!!$res['profile']->fixedphone!!}
                    <br style="margin: 0px">
                    Laman: {!!$res['profile']->website!!}, Surel: {!!$res['profile']->alamatemail!!}
                    </span>

                </b>
            </td>
        </tr>
    </table>

    <hr style="margin: 8px 0;">

    <h3 style="text-align:center;">SURAT PERMOHONAN CUTI</h3>

    <table width="100%" style="font-size:10pt;">
        <tr>
            <td width="23%">No Permohonan</td>
            <td>: {{ $noplanning }}</td>
        </tr>
    </table>

    <br><br><br><br>

    <b>Yang bertanda tangan di bawah ini:</b>
    <br><br>

    <table width="100%" style="font-size:10pt;">
        <tr><td width="23%">Nama</td><td>: {{ $firstData['namalengkap'] }}</td></tr>
        <tr><td>NIP</td><td>: {{ $firstData['nip'] }}</td></tr>
        <tr><td>Jabatan</td><td>: {{ $firstData['namajabatan'] }}</td></tr>
        <tr><td>Unit Kerja</td><td>: {{ $firstData['unitkerja'] }}</td></tr>
    </table>

    <br>

    <p style="text-align:justify; font-size:10pt;">
        Dengan ini mengajukan permohonan cuti <b>{{ $firstData['statuspermohonan'] }}</b> selama <b>{{ $totalDays }}</b> hari, terhitung mulai tanggal 
        <b>{{ $startDate }}</b> sampai dengan tanggal <b>{{ $endDate }}</b>. Demikian permohonan ini saya ajukan. Atas perhatian 
        dan persetujuannya, saya ucapkan terima kasih.
    </p>

    <!-- Tanda tangan kanan -->
    <div class="signature-box">
        <div class="signature-right">
            Yogyakarta, {{ $tanggal_pengajuan }}<br>
            Pemohon,<br><br><br><br>
            <b>ADE KURNIAWAN,<br>S.Kom., M.P.H.</b>
        </div>
    </div>

</section>

<!-- Barcode kiri bawah (lebih naik) -->
@if($firstData['approvalstatus'] == 1 )
    <div class="barcode-box">

        <!-- QR Code -->
        <div>
            {{-- {!! $qrcode !!} --}}
            <img src="data:image/png;base64,{!! $qrcode !!}" >
        </div>

        {{-- <div style="margin-top:3px;">No. Record: {{ $uuid }}</div> --}}
        <div>Status: Sudah Diverifikasi</div>
    </div>
@else
    &nbsp;&nbsp;&nbsp;
@endif


</body>
</html>
