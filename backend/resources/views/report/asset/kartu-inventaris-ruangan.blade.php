<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>KARTU INVENTARIS RUANGAN</title>
    <style>
        table {
            border-collapse: collapse;
            max-width: 3508px;
            width: 100%;
        }

        #table-content {
            margin-top: 2em;
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
</head>
<body>
    {{-- Judul --}}
    <table>
        <tr>
            <td style="text-align:center">KARTU INVENTARIS RUANGAN</td>
        </tr>
        <tr>
            <td style="text-align:center">TAHUN ANGGARAN 2023</td>
        </tr>
    </table>

    {{-- Detail --}}
    <table style="margin-top: 2em;">
        <thead>
            <tr><td></td></tr>
            <tr><td></td></tr>
            <tr><td></td></tr>
            <tr><td></td></tr>
            <tr><td></td></tr>
            <tr><td></td></tr>
        </thead>
        <tbody>
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
            <tr>
                <td>SATUAN KERJA</td>
                <td>:</td>
                <td></td>
            </tr>
            <tr>
                <td>UNIT/SUBUNIT</td>
                <td>:</td>
                <td>102.1.4.0.0 - RUMAH SAKIT JIWA GRHASIA (KANTOR)</td>
            </tr>
            <tr>
                <td>RUANGAN</td>
                <td>:</td>
                <td>RUANG LAB KOMPUTER PDTI</td>
            </tr>
            <tr>
                <td>KLASIFIKASI</td>
                <td>:</td>
                <td>SEMUA KLASIFIKASI</td>
            </tr>
        </tbody>
    </table>

    {{-- Data --}}
    <table id="table-content">
        <thead>
            <tr>
                <th rowspan="2">No. urt</th>
                <th rowspan="2">Nama / Jenis Barang</th>
                <th rowspan="2">Merek/Model</th>
                <th rowspan="2">No. Seri Pabrik</th>
                <th rowspan="2">No. Rangka</th>
                <th rowspan="2">No. Mesin</th>
                <th rowspan="2">No. BPKB</th>
                <th rowspan="2">No. Polisi</th>
                <th rowspan="2">Ukuran</th>
                <th rowspan="2">Bahan</th>
                <th rowspan="2">Judul</th>
                <th rowspan="2">Tahun Pembuatan / Pembelian</th>
                <th rowspan="2">No. Kode Barang</th>
                <th rowspan="2">Jumlah Barang/Register</th>
                <th rowspan="2">Harga Beli / Perolehan</th>
                <th colspan="3">Keadaan Barang</th>
                <th rowspan="2">Keterangan Mutasi</th>
            </tr>
            <tr>
                <th>Baik (B)</th>
                <th>Kurang Baik (KB)</th>
                <th>Rusak Berat (RB)</th>
            </tr>
            <tr style="font-size: 8px;">
                <th>1</th>
                <th>2</th>
                <th>3</th>
                <th>4</th>
                <th>5</th>
                <th>6</th>
                <th>7</th>
                <th>8</th>
                <th>9</th>
                <th>10</th>
                <th>11</th>
                <th>12</th>
                <th>13</th>
                <th>14</th>
                <th>15</th>
                <th>16</th>
                <th>17</th>
                <th>18</th>
                <th>19</th>
            </tr>
        </thead>
        <tbody>
            @php
             $i = 1   
            @endphp
            @foreach($data as $key=>$row)
                <tr>
                    <td>{{ $i }}</td>
                    <td>{{ $row->namaproduk }}</td>
                    <td>{{ $row->merkproduk }}</td>
                    <td>{{ ($row->noseri != null) ? $row->noseri : '-' }}</td>
                    <td>{{ ($row->norangka != null) ? $row->noseri : '-' }}</td>
                    <td>{{ ($row->nomesin != null) ? $row->nomesin : '-' }}</td>
                    <td>{{ ($row->nobpkb != null) ? $row->nobpkb : '-' }}</td>
                    <td>{{ ($row->nopolisi != null) ? $row->nopolisi : '-' }}</td>
                    <td>100Watt</td>
                    <td>{{ $row->namabahanproduk }}</td>
                    <td>null</td>
                    <td>{{ $row->tahun }}</td>
                    <td>{{ $row->kdbmn }}</td>
                    <td>{{ $row->registerasset }}</td>
                    <td>{{ $row->hargaperolehan }}</td>
                    <td>Baik</td>
                    <td></td>
                    <td></td>
                    <td>BOR Listrik DC, PDTI</td>
                </tr>
                @php
                    $i++
                @endphp
            @endforeach
        </tbody>
    </table>

    {{-- Tanda tangan --}}
    <div style="margin-top:6rem; width: 100%; display:flex; justify-content:center;">
        <div style="width: 70%;">
            <table style="width:100%;">
                <tr>
                    <td style="text-align:center;">Kepala</td>
                    <td style="text-align:center;">Penanggung Jawab</td>
                </tr>
                <tr>
                    <td style="text-align:center; padding-top: 5rem">{{ $dataKepala->namalengkap }}</td>
                    <td style="text-align:center; padding-top: 5rem">{{ $dataPenanggung->namalengkap }}</td>
                </tr>
                <tr>
                    <td style="text-align:center;"">NIP. {{ $dataKepala->nip }}</td>
                    <td style="text-align:center;"">NIP. {{ $dataPenanggung->nip }}</td>
                </tr>
            </table>
        </div>
    </div>

    <script>
        window.print()
    </script>
</body>
</html>