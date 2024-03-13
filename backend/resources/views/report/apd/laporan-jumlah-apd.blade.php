<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>LAPORAN PENGGUNAAN APD</title>
    <style>
        table {
            border-collapse: collapse;
            max-width: 3508px;
            width: 99vw;
            max-width: 99vw;
        }

        #table-content td, th{
            width: auto;
            word-wrap: break-word;
            border: 1px solid black;
            padding: .3em .6em;
        }

        @media print{@page {size: portrait}}
    </style>
</head>
<body>
    {{-- Header --}}
    <table style="margin-bottom: 4rem; text-align:center; font-weight:bold;">
        <tr>
            <td>LAPORAN PENGGUNAAN APD</td>
        </tr>
        <tr>
            <td>DI RS JIWA GRHASIA DIY TAHUN {{ date_format(date_create($jumlahAPD[0]->tanggal_apd), 'Y') }}</td>
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
                <td>{{ $jumlahAPD[0]->namaruangan }}</td>
            </tr>
            <tr>
                <td>BULAN</td>
                <td>:</td>
                <td>{{ date_format(date_create($jumlahAPD[0]->tanggal_apd), 'm-Y') }}</td>
            </tr>
        </tbody>
    </table>

    {{-- Content --}}
    <table id="table-content">
        <thead>
            <tr>
                <th class="content">Kegiatan</th>
                <th class="content">Jumlah</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><b>Pilihan APD</b></td>
                <td></td>
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
                    <td>{{ $row->description }}</td>
                    <td>{{ $jumlah }}</td>
                </tr>
            @endforeach
            <tr>
                <td><b>Kesesuaian</b></td>
                <td></td>
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
                    <td>{{ $row->description }}</td>
                    <td>{{ $jumlah }}</td>
                </tr>
            @endforeach
            <tr>
                <td><b>Cuci tangan sebelum menggunakan APD</b></td>
                <td></td>
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
                    <td>{{ $row->description }}</td>
                    <td>{{ $jumlah }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <script>
        window.print()
    </script>
</body>
</html>