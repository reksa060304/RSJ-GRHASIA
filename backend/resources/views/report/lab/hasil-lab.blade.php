<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <title>Cetak Hasil Laboratorium</title>
    <link rel="stylesheet" href="css/report/paper.css">
    <link rel="stylesheet" href="css/report/table.css">
    <link rel="stylesheet" href="css/report/tabel.css">

    <link href="css/style.css" rel="stylesheet">
    <style>
        /* Ukuran halaman A4 (portrait) */
        @page {
            size: A4;
            margin: 1.2cm 1.2cm 1.2cm 1.2cm;
        }

        body {
            width: 19cm;
            /* Biar konten ngepas margin A4 */
            margin: 0 auto;
            font-family: Arial, sans-serif;
            font-size: 11px;
            color: #000;
        }

        .kop {
            display: flex;
            align-items: center;
            border-bottom: 2px solid #000;
            padding-bottom: 6px;
            margin-bottom: 6px;
        }

        .kop img {
            width: 60px;
            height: 60px;
            margin-right: 12px;
        }

        .kop .title {
            font-size: 12px;
            line-height: 1.4;
        }

        .kop .title strong {
            font-size: 14px;
        }

        .judul {
            text-align: center;
            font-weight: bold;
            font-size: 20px;
            margin: 10px 0 8px 0;
            border-bottom: 1px solid #000;
            padding-bottom: 3px;
        }

        .info {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 6px;
        }

        .info td {
            padding: 3px 4px;
            vertical-align: top;
            font-size: 10.5px;
        }

        .section-title {
            background: #e8e8e8;
            font-weight: bold;
            padding: 3px 4px;
            font-size: 11px;
            margin-top: 6px;
        }

        table.result {
            width: 100%;
            border-collapse: collapse;
            margin-top: 2px;
            font-size: 10.5px;
        }

        table.result th,
        table.result td {
            border: 1px solid #000;
            padding: 3px 4px;
        }

        table.result th {
            background: #f5f5f5;
            text-align: center;
            font-weight: bold;
        }

        .footer {
            width: 100%;
            margin-top: 40px;
            font-size: 12px;
        }

        .footer table {
            width: 100%;
            border-collapse: collapse;
        }

        .footer td {
            vertical-align: top;
            padding-top: 10px;
        }

        .footer .center {
            text-align: center;
        }

        .footer .right {
            text-align: right;
            font-size: 11px;
            margin-top: 15px;
        }

        .footer .sign-space {
            height: 100px;
            /* FIXED: ruang untuk tanda tangan elektronik */
        }

        .center {
            text-align: center;
        }

        .right {
            text-align: right;
        }

        .page-break {
            page-break-before: always;
        }

        @media print {
            .footer {
                page-break-inside: avoid !important;
                break-inside: avoid !important;
            }
        }


        @media print {
            body {
                margin: 0;
                box-shadow: none;
            }
        }
    </style>
</head>

<body onload="window.print()">

    {{-- HEADER --}}
    <table style="width:100%; border-collapse:collapse;">
        <tr>
            <td style="width:15%; border-bottom:3px solid black; padding-bottom:1em; text-align:center;">
                <img src="img/diy.png" alt="Logo DIY" style="width:100%;">
            </td>

            <td
                style="width:60%; border-bottom:3px solid black; padding-bottom:1em; text-align:center; vertical-align:middle;">
                <div style="font-size:16px; line-height: 1.3;">
                    <strong style="font-size: 22px;">RS JIWA GRHASIA</strong><br>
                    <span style="font-size: 18px; font-weight: bold;">INSTALASI LABORATORIUM KLINIK</span><br>
                    <span style="font-size: 14px;">Jl. Kaliurang KM.17, Duwetsari, Pakembinangun, Kec. Pakem,<br>
                    Kabupaten Sleman, Daerah Istimewa Yogyakarta 55582</span>
                </div>
            </td>

            <td style="width:25%; border-bottom:3px solid black; padding-bottom:1em; text-align:center;">
                <img src="img/logo_grhasiafull.png" alt="Logo Grhasia" style="width:100%;">
            </td>
        </tr>
    </table>
    <div class="judul">Hasil Laboratorium</div>
    <table class="info">
        <tr>
            <td><strong>No. RM</strong></td>
            <td>: {{ $data->nocm ?? '-' }}</td>
            <td><strong>Tgl. Pelayanan</strong></td>
            <td>: {{ $data->tglpelayanan ?? '-' }}</td>
        </tr>
        <tr>
            <td><strong>No. Pendaftaran</strong></td>
            <td>: {{ $data->noregistrasi ?? '-' }}</td>
            <td><strong>Dokter Perujuk</strong></td>
            <td>: {{ $data->dokterperiksa ?? '-' }}</td>
        </tr>
        <tr>
            <td><strong>Nama Pasien</strong></td>
            <td>: {{ $data->namapasien ?? '-' }}</td>
            <td><strong>Tgl. Lahir</strong></td>
            <td>: {{ $data->tgllahir ?? '-' }}</td>
        </tr>
        <tr>
            <td><strong>Umur / JK</strong></td>
            <td>: {{ $umur ?? '-' }} / {{ $data->jeniskelamin ?? '-' }}</td>
            <td><strong>Ruangan Perujuk</strong></td>
            <td>: {{ $data->ruanganperejuk ?? '-' }}</td>
        </tr>
        <tr>
            <td><strong>Alamat</strong></td>
            <td colspan="3">: {{ $data->alamatlengkap ?? '-' }}</td>
        </tr>
        <tr>
            <td><strong>Jenis Pasien</strong></td>
            <td colspan="3">: {{ $data->kelompokpasien ?? '-' }}</td>
        </tr>
    </table>


    @php $i = 0;
    $count = count($grouped); @endphp
    @foreach ($grouped as $jenis => $items)
        <div class="section-title">{{ strtoupper($jenis) }}</div>
            <table class="result">
                <thead>
                    <tr>
                        <th style="width:30%">Pemeriksaan</th>
                        <th style="width:15%">Hasil</th>
                        <th style="width:30%">Nilai Rujukan</th>
                        <th style="width:15%">Satuan</th>
                        <th style="width:30%">Keterangan</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($items as $r)
                        <tr>
                            <td>{{ $r->detailpemeriksaan ?? '-' }}</td>
                            <td class="center" @if($r->flag == 'Y') style="color:red; font-weight:bold;" @endif>
                                {{ $r->hasil ?? '-' }}
                            </td>
                            <td class="center">{{ $r->nilaitext ?? '-' }}</td>
                            <td class="center">{{ $r->satuanstandar ?? '-' }}</td>
                            <td>{{ $r->keterangan ?? '-' }}</td>
                        </tr>
                    @endforeach
                </tbody>
        </table>
    @endforeach

    <div class="footer">
        <table style="width:100%; margin-bottom:20px;">
            <tr>
                <td class="left" colspan="2">
                    <strong>Catatan :</strong> {{ (empty($catatan) || $catatan == 'undefined') ? '-' : $catatan }}
                </td>
            </tr>
        </table>

        <table style="width:100%;">
            <tr>
                <td width="50%" class="center">
                    <strong>Penanggung Jawab</strong>
                    <div class="sign-space">
                       @if(!empty($data->ttd_dpjp))
                        <img src="{{ $data->ttd_dpjp }}" alt="TTD DPJP" height="80">
                    @endif
                    </div>
                    <strong><u>{{ $dokterr ?? '-' }}</u></strong>

                </td>
                <td width="50%" class="center">
                    <strong>Validator</strong>
                    <div class="sign-space">
                       @if(!empty($data->ttd_validator))
                        <img src="{{ $data->ttd_validator }}" alt="TTD Validator" height="80">
                    @endif
                    </div>
                    <strong><u>{{ $user ?? '-' }}</u></strong>
                </td>
            </tr>
        </table>
      
  @if ($tte == 'true')
    <footer style="
        position: fixed;
        bottom: 60px; /* dinaikkan biar gak mepet */
        left: 40px;
        right: 40px;
        font-size: 10px;
        color: #333;
        text-align: left;
        border-top: 1px solid #999;
        padding-top: 8px;
        ">
        <table style="width:100%; border-collapse: collapse;">
             <tr>   
                    {{-- Logo BSrE --}}
                 <td style="width:12%; text-align:center; vertical-align:middle;">
                        <img src="img/bsre.png" alt="BSrE" style="width:60px; object-fit:contain;">
                </td>

                       {{-- Posisi tengah (pake <p>$</p>) --}}
                 <td style="width:15%; text-align:center; vertical-align:middle;">
                     <p style="width:60px; object-fit:contain;">
                            $
                    </p>
                </td>
                   <td  style="width:73%; text-align:justify; line-height:1.4;">
                       <i>
                            Dokumen ini telah ditandatangani secara elektronik menggunakan
                            sertifikat elektronik yang diterbitkan oleh
                            Balai Sertifikasi Elektronik (BSrE),
                            Badan Siber dan Sandi Negara.
                        </i>
                    </td>
                </tr>
            </table>
        </footer>
    @endif
    </div>

</body>
</html>