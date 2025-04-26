<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Laporan IPCN</title>
    <style>
        @page {
            size: 33cm 21.5cm;
            margin: 1cm;
        }
        p {
            margin: 0;
        }
        body {
            margin: 0;
        }
        .content {
            padding: 3px 5px;
            border: 1px solid black;
            font-size: 11pt;
        }
    </style>
</head>
<body>
    
    {{-- Header --}}
    <table cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 4rem; text-align:center; font-weight:bold;">
        <tr>
            <td>LAPORAN PENGGUNAAN IPCN</td>
        </tr>
        <tr>
            <td>DI RS JIWA GRHASIA DIY TAHUN {{ isset($data) ? date_format(date_create($data[0]->tanggal), 'Y') : '' }}</td>
        </tr>
    </table>

    {{-- Deskripsi --}}
    <table style="margin-bottom: 1rem;font-weight:bold;">
        <thead>
            <tr><td></td></tr>
            <tr><td></td></tr>
            <tr><td></td></tr>
        </thead>
        <tbody>
            <tr>
                <td>WISMA</td>
                <td>:</td>
                <td>{{ isset($data) ? $data[0]->namaruangan : '' }}</td>
            </tr>
            <tr>
                <td>BULAN</td>
                <td>:</td>
                <td>{{ date_format(date_create($data[0]->tanggal), 'm-Y') }}</td>
            </tr>
        </tbody>
    </table>

    <table cellspacing="0" cellpadding="0" border="0" width="100%" style="border: 1px solid black; border-collapse: collapse;">
        <thead>
            <tr>
                <th class="content">OBSERVER</th>
                <th class="content">TANGGAL</th>
                <th class="content">PROFESI YANG DIAUDIT</th>
                <th class="content">JUMLAH KESEMPATAN</th>
                @foreach ($masterIndikasi as $mI)
                    <th class="content">{{ $mI->indikasi }}</th>
                @endforeach
                @foreach ($masterHand as $mH)
                    <th class="content">{{ $mH->tindakan }}</th>
                @endforeach
                <th class="content">Gagal</th>
                <th class="content" >Jumlah Ketepatan HH</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($data as $dt)
                <tr>
                    <td class="content">{{ $dt->namaobserver }}</td>
                    <td class="content">{{ $dt->tanggal }}</td>
                    <td class="content">{{ $dt->profesiaudit }}</td>
                    <td class="content">{{ $dt->kesempatan }}</td>
                    @foreach ($masterIndikasi as $mi)
                        @if (in_array((string)$mi->id , explode(',', $dt->objectindikasifk)))
                            <td class="content">v</td>
                        @else
                            <td class="content"></td>
                        @endif
                    @endforeach
                    @foreach ($masterHand as $mh)
                        @if (in_array((string)$mh->id , explode(',', $dt->objecthygienefk)) && (in_array('3' , explode(',', $dt->objecthygienefk)) == false))
                            <td class="content">v</td>
                        @elseif(in_array('3' , explode(',', $dt->objecthygienefk)) && $mh->id == 3)
                            <td class="content">v</td>
                        @else
                            <td class="content"></td>
                        @endif

                    @endforeach
                    <td class="content">
                        @if (in_array('3' , explode(',', $dt->objecthygienefk)))
                            v
                        @else
                            {{ '' }}
                        @endif
                    </td>
                    <td class="content">{{ $dt->langkah }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

</body>
</html>