<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Cetakan KIBB Label Barang</title>

    <style>
        @page {
            size: 33cm 21.5cm;
            margin: 1.5cm 2cm 4cm 1.9cm 
        }

        table {
            border-collapse: collapse;
            max-width: 3508px;
            width: 100%;
            height: 100%;
        }

        #table-content td, th{
            width: auto;
            word-wrap: break-word;
            overflow: hidden;
            border: 1px solid black;
            padding: .3em .6em;
        }
    </style>
</head>
<body>

    <table style="margin-bottom: 4em;">
        <tr>
            <td style="padding: 1rem; border: 1px solid green; text-align: center;">KIB B LABEL BARANG</td>
        </tr>
    </table>

    <table style="margin-bottom: 1em;">
        <tr>
            <td>SKPD</td>
            <td>:</td>
            <td>RUMAH SAKIT JIWA GRHASIA</td>
        </tr>
        <tr>
            <td>KABUPATEN</td>
            <td>:</td>
            <td>DAERAH ISTIMEWA YOGYAKARTA</td>
        </tr>
        <tr>
            <td>PROVINSI</td>
            <td>:</td>
            <td>D.I. YOGYAKARTA</td>
        </tr>
    </table>

    <table style="border: 1px solid black;" id="table-content">
        <thead>
            <tr>
                <th style="width: 10%;">Nibar</th>
                <th style="width: 8%;">Ruang</th>
                <th style="width: 8%;">Uraian barang</th>
                <th style="width: 8%;">Kode Register</th>
                <th style="width: 8%;">Nilai akumulasi barang</th>
                <th style="width: 8%;">Tahun perolehan</th>
                <th style="width: 8%;">Deskripsi barang</th>
                <th style="width: 8%;">Keterangan</th>
                <th style="width: 8%;">Merktype</th>
                <th>Label</th>
            </tr>
        </thead>
        <tbody>
            @foreach($data as $key=>$row)
                <tr>
                    <td style="padding: 5px 10px;">20230307703</td>
                    <td style="padding: 5px 10px;">{{ $row->namaruanganasal }}</td>
                    <td style="padding: 5px 10px;">{{ $row->namaproduk }}</td>
                    <td style="padding: 5px 10px; text-align:center;">{{ $row->koderegisterrs }}</td>
                    <td style="padding: 5px 10px;">{{ $row->hargaperolehan  }}</td>
                    <td style="padding: 5px 10px; text-align:center;">{{ $row->tahunperolehan }}</td>
                    <td style="padding: 5px 10px;">{{ ($row->spesifikasi != null) ? $row->spesifikasi : '-' }}</td>
                    {{-- Mengambil data dari relasi produk_m dari nilai deskripsibarang --}}
                    <td style="padding: 5px 10px;">{{ $row->deskripsiproduk }}</td>
                    <td style="padding: 5px 10px;">{{ ($row->merkproduk) ? $row->merkproduk : '-' }}</td>
                    <td style="padding: 5px 10px;">
                        <p style="padding: 5px 10px; margin: 0; border: 1px solid black; border-bottom: 0px">11.01.34.00.1.02.2.22.0.00.01.0004.{{ $row->tahunperolehan }}</p>
                        <p style="padding: 5px 10px; margin: 0; border: 1px solid black;">{{ $row->kdbmn }}</p>
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>

    
</body>
</html>