<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>LAPORAN PENGGUNAAN Hygiene</title>
    <style>
        @page {
            size: 21.5cm 33cm;
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
            <td>LAPORAN PENGGUNAAN HYGIENE</td>
        </tr>
        <tr>
            <td>DI RS JIWA GRHASIA DIY TAHUN {{ date_format(date_create($jumlahHygiene[0]->tanggal_hygiene), 'Y') }}</td>
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
                <td>{{ $jumlahHygiene[0]->namaruangan }}</td>
            </tr>
            <tr>
                <td>BULAN</td>
                <td>:</td>
                <td>{{ date_format(date_create($jumlahHygiene[0]->tanggal_hygiene), 'm-Y') }}</td>
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
                <td class="content"><b>Sebelum kontak dengan pasien</b></td>
                <td class="content"></td>
            </tr>
            @foreach ($masterSebelumKontak as $row)
                @php
                    $jumlah = 0;
                    foreach ($jumlahHygiene as $item) {
                        if($row->id == $item->idmasterhygiene){
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
                <td class="content"><b>Sebelum melakukan prosedur bersih/tindakan aseptik</b></td>
                <td class="content"></td>
            </tr>
            @foreach ($masterSebelumProsedur as $row)
                @php
                    $jumlah = 0;
                    foreach ($jumlahHygiene as $item) {
                        if($row->id == $item->idmasterhygiene){
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
                <td class="content"><b>Setelah kontak dengan cairan tubuh pasien</b></td>
                <td class="content"></td>
            </tr>
            @foreach ($masterSetelahCairan as $row)
                @php
                    $jumlah = 0;
                    foreach ($jumlahHygiene as $item) {
                        if($row->id == $item->idmasterhygiene){
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
                <td class="content"><b>Setelah kontak dengan pasien</b></td>
                <td class="content"></td>
            </tr>
            @foreach ($masterSetelahKontak as $row)
                @php
                    $jumlah = 0;
                    foreach ($jumlahHygiene as $item) {
                        if($row->id == $item->idmasterhygiene){
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
                <td class="content"><b>Setelah kontak dengan lingkungan pasien</b></td>
                <td class="content"></td>
            </tr>
            @foreach ($masterSetelahLingkungan as $row)
                @php
                    $jumlah = 0;
                    foreach ($jumlahHygiene as $item) {
                        if($row->id == $item->idmasterhygiene){
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
                <td class="content"><b>Lain-lain</b></td>
                <td class="content"></td>
            </tr>
            @foreach ($masterLainLain as $row)
                @php
                    $jumlah = 0;
                    foreach ($jumlahHygiene as $item) {
                        if($row->id == $item->idmasterhygiene){
                            $jumlah = $item->jumlah_pemakaian;
                        }
                    }
                @endphp
                <tr>
                    <td class="content">{{ $row->description }}</td>
                    <td class="content">{{ $jumlah }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <script>
        window.print()
    </script>
</body>
</html>