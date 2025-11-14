<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <title>Cetak Order Barang Asset</title>
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
            font-size: 15px;
            margin: 5px 0 6px 0;
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
                <div style="font-size:14px;">
                    <strong>RS Jiwa Grhasia</strong><br>
                    INSTALASI LABORATORIUM KLINIK<br>
                    Jl. Kaliurang KM.17, Duwetsari, Pakembinangun, Kec. Pakem,<br>
                    Kabupaten Sleman, Daerah Istimewa Yogyakarta 55582
                </div>
            </td>

            <td style="width:25%; border-bottom:3px solid black; padding-bottom:1em; text-align:center;">
                <img src="img/logo_grhasiafull.png" alt="Logo Grhasia" style="width:100%;">
            </td>
        </tr>
    </table>
    <br>
    <div style="text-align: center; font-size: 17px;"><b>BUKTI ORDER BARANG ASSET</b></div>
    <div style="text-align: center; font-size: 13px;">Nomor : {{ $dataReport['datas']->noorder }}</div>
    <br>
    <br>
    <div>
        <table>
            <tr>
                <td>
                    <span style="font-size: 12px;">Tanggal Order</span>
                </td>
                <td>
                    <span style="font-size: 12px;">:</span>
                </td>
                <td>
                    {{ $dataReport['datas']->tglorder }}
                </td>
            </tr>
            <tr>
                <td>
                    <span style="font-size: 12px;">Ruangan Pemesan</span>
                </td>
                <td>
                    <span style="font-size: 12px;">:</span>
                </td>
                <td>
                    {{ $dataReport['datas']->ruangan }}
                </td>
            </tr>
            <tr>
                <td>
                    <span style="font-size: 12px;">Ruangan Tujuan</span>
                </td>
                <td>
                    <span style="font-size: 12px;">:</span>
                </td>
                <td>
                    {{ $dataReport['datas']->ruangantujuan }}
                </td>
            </tr>
            <tr>
                <td>
                    <span style="font-size: 12px;">Petugas Order</span>
                </td>
                <td>
                    <span style="font-size: 12px;">:</span>
                </td>
                <td>
                    {{ $dataReport['datas']->penanggungjawab }}
                </td>
            </tr>
            <tr>
                <td>
                    <span style="font-size: 12px;">Keterangan</span>
                </td>
                <td>
                    <span style="font-size: 12px;">:</span>
                </td>
                <td>
                    {{ $dataReport['datas']->keteranganorder }}
                </td>
            </tr>
        </table>
    </div>
    <br>
    <div>
        <table class="result">
            <tr>
                <th>
                    <span style="font-size: 12px;">No</span>
                </th>
                <th>
                    <span style="font-size: 12px;">Nama Barang</span>
                </th>
                <th>
                    <span style="font-size: 12px;">Jumlah</span>
                </th>
            </tr>
            @php 
                $nomor = 1;                            
            @endphp
            @foreach($dataReport['detail'] as $item)
            <tr>
                <td>
                    {{ $nomor }}
                </td>
                <td>
                    <span style="font-size: 12px;">
                        {{ $item->namaproduk }}
                    </span>
                </td>
                <td>
                    <span style="font-size: 12px;">
                        {{ $item->qtyproduk }}
                    </span>
                </td>
            </tr>
                @php
                    $nomor = $nomor + 1;
                @endphp
            @endforeach
        </table>
    </div>

    <div style="margin-top: 30px; text-align: right;">
        <span style="font-size: 12px;">
            Yogyakarta, {{ \Carbon\Carbon::parse($item->tglorder)->format('d-m-Y') }}
        </span>
    </div>
    <br><br><br>

    <div>
        <table style="width: 100%; text-align: center;">
            <tr>
                <td width="50%"></td>
                <td width="50%" style="text-align: right;">
                    <span style="font-size: 12px;"><b>Pegawai Meminta</b></span>
                    <br><br><br><br><br><br><br><br>
                    {{ $dataReport['datas']->penanggungjawab }}<br />
                    @if(in_array($dataReport['datas']->objectjenispegawaifk, [1, 14]))
                        SIP : {{ $dataReport['datas']->sippenanggungjawab }}
                    @else
                        NIP : {{ $dataReport['datas']->nippns }}
                    @endif
                </td>
                <!-- <td>
                    <span style="font-size: 12px;"><b>Petugas Mengetahui</b></span>
                    <br><br><br><br><br><br><br><br>
                    {{ $dataReport['datas']->namalengkap }}<br />
                    @if(in_array($dataReport['datas']->objectpetugasfk, [1, 14]))
                        SIP : {{ $dataReport['datas']->sipmengetahui }}
                    @else
                        NIP : {{ $dataReport['datas']->nippns }}
                    @endif
                </td> -->
            </tr>
        </table>
    </div>

</body>
</html>