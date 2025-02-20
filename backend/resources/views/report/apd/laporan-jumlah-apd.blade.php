<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>LAPORAN PENGGUNAAN APD</title>
    <style>
        @page {
            size: 21.5cm 33cm;
            margin: 1cm;
        }
        * {
            box-sizing: border-box;
        }
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            font-size: 11pt;
            line-height: 1.3;
        }
        p {
            margin: 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        .content {
            padding: 6px 8px;
            border: 1px solid black;
            font-size: 11pt;
            vertical-align: middle;
        }
        th.content {
            background-color: #f0f0f0;
            font-weight: bold;
        }
        td.content {
            height: 25px;
        }
        @media print {
            body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
            table {
                page-break-inside: auto;
            }
            tr {
                page-break-inside: avoid;
                page-break-after: auto;
            }
            thead {
                display: table-header-group;
            }
            tfoot {
                display: table-footer-group;
            }
        }
    </style>
</head>
<body>
    {{-- Header --}}
    <table cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 4rem; text-align:center; font-weight:bold;">
        <tr>
            <td>LAPORAN PENGGUNAAN APD</td>
        </tr>
        <tr>
            <td>
                DI RS JIWA GRHASIA DIY TAHUN 
                @if ($jumlahAPD && count($jumlahAPD) > 0)
                    {{ date_format(date_create($jumlahAPD[0]->tanggal_apd), 'Y') }}
                @else
                    {{ date('Y') }}
                @endif
            </td>
        </tr>
    </table>

    {{-- Deskripsi --}}
    <table style="width: auto; margin-bottom: 1rem;font-weight:bold;">
        <thead>
            <tr><td></td></tr>
            <tr><td></td></tr>
            <tr><td></td></tr>
        </thead>
        <tbody>
            <tr>
                <td>RUANGAN</td>
                <td style="padding-left: 1em; padding-right: 1em">:</td>
                <td>
                    @if (request()->has('objectruanganfk') && $jumlahAPD && count($jumlahAPD) > 0)
                        {{ $jumlahAPD[0]->namaruangan }}
                    @else
                        SEMUA RUANGAN
                    @endif
                </td>
            </tr>
            <tr>
                <td>BULAN</td>
                <td style="padding-left: 1em; padding-right: 1em">:</td>
                <td>
                    @if (request()->has('bulan'))
                        {{ date('F Y', strtotime('01-'.request()->get('bulan'))) }}
                    @else
                        {{ date('F Y') }}
                    @endif
                </td>
            </tr>
        </tbody>
    </table>

    {{-- Content --}}
    <table cellspacing="0" cellpadding="0" border="0" width="100%" style="border: 1px solid black; border-collapse: collapse;">
        <thead>
            <tr>
                <th class="content">Kegiatan</th>
                <th class="content">Jumlah</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="content"><b>Pilihan APD</b></td>
                <td class="content"></td>
            </tr>
            @foreach ($masterAPD as $row)
                @php
                    $jumlah = 0;
                    foreach ($jumlahAPD as $item) {
                        if($row->id == $item->idmasterapd){
                            $jumlah = $item->jumlah_pemakaian;
                        }
                    }
                @endphp
                <tr>
                    <td class="content">{{ $row->description }}</td>
                    <td class="content">{{ $jumlah }}</td>
                </tr>
            @endforeach
            <tr>
                <td class="content"><b>Kesesuaian</b></td>
                <td class="content"></td>
            </tr>
            @foreach ($masterkesesuaian as $row)
                @php
                    $jumlah = 0;
                    foreach ($jumlahAPD as $item) {
                        if($row->id == $item->idmasterapd){
                            $jumlah = $item->jumlah_pemakaian;
                        }
                    }
                @endphp
                <tr>
                    <td class="content">{{ $row->description }}</td>
                    <td class="content">{{ $jumlah }}</td>
                </tr>
            @endforeach
            <!-- <tr>
                <td class="content"><b>Cuci tangan sebelum menggunakan APD</b></td>
                <td class="content"></td>
            </tr>
            @foreach ($mastercuci as $row)
                @php
                    $jumlah = 0;
                    foreach ($jumlahAPD as $item) {
                        if($row->id == $item->idmasterapd){
                            $jumlah = $item->jumlah_pemakaian;
                        }
                    }
                @endphp
                <tr>
                    <td class="content">{{ $row->description }}</td>
                    <td class="content">{{ $jumlah }}</td>
                </tr>
            @endforeach -->
        </tbody>
    </table>

    <script>
        window.print()
    </script>
</body>
</html>