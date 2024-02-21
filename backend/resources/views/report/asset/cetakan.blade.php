<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Cetakan KIBB Label Barang</title>
</head>
<body style="padding: .5em;">

    <style>
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

        @media print{@page {size: landscape}}
    </style>
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
                <th style="width: 10%; border: 1px solid black;">Nibar</th>
                <th style="width: 8%; border: 1px solid black;">Ruang</th>
                <th style="width: 8%; border: 1px solid black;">Uraian barang</th>
                <th style="width: 8%; border: 1px solid black;">Kode Register</th>
                <th style="width: 8%; border: 1px solid black;">Nilai akumulasi barang</th>
                <th style="width: 8%; border: 1px solid black;">Tahun perolehan</th>
                <th style="width: 8%; border: 1px solid black;">Deskripsi barang</th>
                <th style="width: 8%; border: 1px solid black;">Keterangan</th>
                <th style="width: 8%; border: 1px solid black;">Merktype</th>
                <th style="border: 1px solid black;">Label</th>
            </tr>
        </thead>
        <tbody>
            @foreach($data as $key=>$row)
                <tr>
                    <td style="padding: 5px 10px; border: 1px solid black;">20230307703</td>
                    <td style="padding: 5px 10px; border: 1px solid black;">{{ $row->namaruanganasal }}</td>
                    <td style="padding: 5px 10px; border: 1px solid black;">{{ $row->namaproduk }}</td>
                    <td style="padding: 5px 10px; border: 1px solid black; text-align:center;">{{ $row->koderegisterrs }}</td>
                    <td style="padding: 5px 10px; border: 1px solid black;">{{ $row->hargaperolehan  }}</td>
                    <td style="padding: 5px 10px; border: 1px solid black; text-align:center;">{{ $row->tahunperolehan }}</td>
                    <td style="padding: 5px 10px; border: 1px solid black;">{{ ($row->spesifikasi != null) ? $row->spesifikasi : '-' }}</td>
                    {{-- Mengambil data dari relasi produk_m dari nilai deskripsibarang --}}
                    <td style="padding: 5px 10px; border: 1px solid black;">{{ $row->deskripsiproduk }}</td>
                    <td style="padding: 5px 10px; border: 1px solid black;">{{ ($row->merkproduk) ? $row->merkproduk : '-' }}</td>
                    <td style="padding: 5px 10px; border: 1px solid black;">
                        {{-- <table style="border-collapse:collapse;">
                            <tr>
                                <td>
                                    <p style="border: 1px solid black;">11.01.34.00.1.02.2.22.0.00.01.0004.{{ $row->tahunperolehan }}</p>
                                    <br>
                                    <p style="border: 1px solid black;">{{ $row->kdbmn }}</p>
                                </td>
                            </tr>
                        </table> --}}
                        <p style="padding: 5px 10px; margin: 0; border: 1px solid black; border-bottom: 0px">11.01.34.00.1.02.2.22.0.00.01.0004.{{ $row->tahunperolehan }}</p>
                        <p style="padding: 5px 10px; margin: 0; border: 1px solid black;">{{ $row->kdbmn }}</p>
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <script>
        var css = '@page { size: landscape; }',
        head = document.head || document.getElementsByTagName('head')[0],
        style = document.createElement('style');

        style.type = 'text/css';
        style.media = 'print';

        if (style.styleSheet){
        style.styleSheet.cssText = css;
        } else {
        style.appendChild(document.createTextNode(css));
        }

        head.appendChild(style);

        window.print()
    </script>
</body>
</html>