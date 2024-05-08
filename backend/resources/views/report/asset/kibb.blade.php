<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Kartu Inventaris Barang (KIB)B</title>
    <style>
        table {
            border-collapse: collapse;
            max-width: 3508px;
            width: 100vw;
        }
        /* .content{
            border: 1px solid black;
            padding: 5px 20px;
        } */

        #table-content td, th{
            width: auto;
            word-wrap: break-word;
            border: 1px solid black;
            padding: .3em .6em;
        }

        /* #table-content th{
            width: auto;
            word-wrap: break-word;
            overflow: hidden;
            border: 1px solid black;
            border-collapse: collapse;
            padding: 5px 20px;
        } */
        @media print{@page {size: landscape}}
    </style>
</head>
<body>
    {{-- Header --}}
    <table style="margin-bottom: 4rem; text-align:center; font-weight:bold;">
        <tr>
            <td>KARTU INVENTARIS BARANG (KIB) B</td>
        </tr>
        <tr>
            <td>PERALATAN DAN MESIN</td>
        </tr>
        <tr>
            <td>TAHUN ANGGARAN 2023</td>
        </tr>
    </table>

    {{-- Deskripsi --}}
    <table style="margin-bottom: 1rem;font-weight:bold;">
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
                <td>OPD</td>
                <td>:</td>
                <td>102.1.4.0.0 - RUMAH SAKIT JIWA GRHASIA (KANTOR)</td>
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

                <td>KODEALOKASI</td>
                <td>:</td>
                <td>12.000.12.04.100104.00000.00000000</td>
            </tr>
            <tr>
                <td>KLASIFIKASI</td>
                <td>:</td>
                <td>SEMUA KLASIFIKASI</td>
            </tr>
            <tr>
                <td>TRIWULAN</td>
                <td>:</td>
                <td>TRIWULAN III</td>
            </tr>
        </tbody>
    </table>

    {{-- Content --}}
    <table id="table-content">
        <thead>
            <tr>
                <th rowspan="2" class="content">No.</th>
                <th rowspan="2" class="content">Jenis Barang / Nama Barang</th>
                <th rowspan="2" class="content">Kode Barang</th>
                <th rowspan="2" class="content">Register</th>
                <th rowspan="2" class="content">Merek / Type</th>
                <th rowspan="2" class="content">Bahan</th>
                <th rowspan="2" class="content">Tahun Pembelian</th>
                <th colspan="5" class="content">Nomor</th>
                <th rowspan="2" class="content">Asal Usul</th>
                <th rowspan="2" class="content">Harga</th>
                <th rowspan="2" class="content">Deskripsi Barang</th>
                <th rowspan="2" class="content">Keterangan</th>
                <th rowspan="2" class="content">OPD</th>
            </tr>
            <tr>
                <th class="content">Pabrik</th>
                <th class="content">Rangka</th>
                <th class="content">Mesin</th>
                <th class="content">Polisi</th>
                <th class="content">BPKB</th>
            </tr>
        </thead>
        <tbody>
            @php
                $nomor = 1;
                $idcha1 = '';    
                $idcha2 = '';    
                $idcha3 = '';    
                $idcha4 = '';    
                $idcha5 = '';

            @endphp

            @foreach ($data as $key=>$item)
                @if($item->idcha1 && ($item->idcha1 !== $idcha1))
                    @php
                        $totalcha1 = 0;
                        foreach ($data as $row) {
                            if($row->idcha1 == $item->idcha1){
                                $totalcha1 = $totalcha1 + $row->hargaperolehan;
                            }
                        }
                    @endphp
                    <tr>
                        <td class="content"></td>
                        <td class="content"><b>{{ $item->uriancha1 }}</b></td>
                        <td class="content"><b>{{ $item->kodeakuncha1 }}</b></td>
                        <td class="content"></td>
                        <td class="content"></td>
                        <td class="content"></td>
                        <td class="content"></td>
                        <td class="content"></td>
                        <td class="content"></td>
                        <td class="content"></td>
                        <td class="content"></td>
                        <td class="content"></td>
                        <td class="content"></td>
                        <td class="content" style="text-align: right;"><b>{{number_format( $totalcha1, 2, '.', ',') }}</b></td>
                        <td class="content"></td>
                        <td class="content"></td>
                        <td class="content"></td>
                    </tr>
                @endif
                @if($item->idcha2 && ($item->idcha2 !== $idcha2))
                    @php
                        $totalcha2 = 0;
                        foreach ($data as $row) {
                            if($row->idcha2 == $item->idcha2){
                                $totalcha2 = $totalcha2 + $row->hargaperolehan;
                            }
                        }
                    @endphp
                    <tr>
                        <td class="content"></td>
                        <td class="content" ><b>{{ $item->uriancha2 }}</b></td>
                        <td class="content"><b>{{ $item->kodeakuncha2 }}</b></td>
                        <td class="content"></td>
                        <td class="content"></td>
                        <td class="content"></td>
                        <td class="content"></td>
                        <td class="content"></td>
                        <td class="content"></td>
                        <td class="content"></td>
                        <td class="content"></td>
                        <td class="content"></td>
                        <td class="content"></td>
                        <td class="content" style="text-align: right;"><b>{{number_format(  $totalcha2, 2, '.', ',') }}</b></td>
                        <td class="content"></td>
                        <td class="content"></td>
                        <td class="content"></td>
                    </tr>
                @endif
                @if($item->idcha3 && ($item->idcha3 !== $idcha3))
                    @php
                        $totalcha3 = 0;
                        foreach ($data as $row) {
                            if($row->idcha3 == $item->idcha3){
                                $totalcha3 = $totalcha3 + $row->hargaperolehan;
                            }
                        }
                    @endphp
                    <tr>
                        <td class="content"></td>
                        <td class="content"><b>{{ $item->uriancha3 }}</b></td>
                        <td class="content"><b>{{ $item->kodeakuncha3 }}</b></td>
                        <td class="content"></td>
                        <td class="content"></td>
                        <td class="content"></td>
                        <td class="content"></td>
                        <td class="content"></td>
                        <td class="content"></td>
                        <td class="content"></td>
                        <td class="content"></td>
                        <td class="content"></td>
                        <td class="content"></td>
                        <td class="content" style="text-align: right;"><b>{{number_format(  $totalcha3, 2, '.', ',') }}</b></td>
                        <td class="content"></td>
                        <td class="content"></td>
                        <td class="content"></td>
                    </tr>
                @endif
                @if($item->idcha4 && ($item->idcha4 !== $idcha4))
                    @php
                        $totalcha4 = 0;
                        foreach ($data as $row) {
                            if($row->idcha4 == $item->idcha4){
                                $totalcha4 = $totalcha4 + $row->hargaperolehan;
                            }
                        }
                    @endphp
                    <tr>
                        <td class="content"></td>
                        <td class="content"><b>{{ $item->uriancha4 }}</b></td>
                        <td class="content"><b>{{ $item->kodeakuncha4 }}</b></td>
                        <td class="content"></td>
                        <td class="content"></td>
                        <td class="content"></td>
                        <td class="content"></td>
                        <td class="content"></td>
                        <td class="content"></td>
                        <td class="content"></td>
                        <td class="content"></td>
                        <td class="content"></td>
                        <td class="content"></td>
                        <td class="content" style="text-align: right;"><b>{{number_format(  $totalcha4, 2, '.', ',') }}</b></td>
                        <td class="content"></td>
                        <td class="content"></td>
                        <td class="content"></td>
                    </tr>
                @endif

                @if($item->idcha5 && ($item->idcha5 !== $idcha5))

                    @php
                        $totalcha5 = 0;
                        foreach ($data as $row) {
                            if($row->idcha5 == $item->idcha5){
                                $totalcha5 = $totalcha5 + $row->hargaperolehan;
                            }
                        }
                    @endphp
                    <tr>
                        <td class="content"></td>
                        <td class="content"><b>{{ $item->uriancha5 }}</b></td>
                        <td class="content"><b>{{ $item->kodeakuncha5 }}</b></td>
                        <td class="content"></td>
                        <td class="content"></td>
                        <td class="content"></td>
                        <td class="content"></td>
                        <td class="content"></td>
                        <td class="content"></td>
                        <td class="content"></td>
                        <td class="content"></td>
                        <td class="content"></td>
                        <td class="content"></td>
                        <td class="content" style="text-align: right;"><b>{{ number_format(  $totalcha5, 2, '.', ',') }}</b></td>
                        <td class="content"></td>
                        <td class="content"></td>
                        <td class="content"></td>
                    </tr>
                @endif

                <tr>
                    <td class="content">{{ $nomor }}</td>
                    <td class="content">{{ $item->uriancha6 }}</td>
                    <td class="content">{{ $item->kodeakuncha6 }}</td>
                    <td class="content">{{ $item->koderegisterrs }}</td>
                    <td class="content">{{ $item->merkproduk }}</td>
                    <td class="content">{{ $item->namabahanproduk }}</td>
                    <td class="content">{{ $item->tahunperolehan }}</td>
                    <td class="content"></td>
                    <td class="content">{{ $item->norangka }}</td>
                    <td class="content">{{ $item->nomesin }}</td>
                    <td class="content">{{ $item->nopolisi }}</td>
                    <td class="content">{{ $item->nobpkb }}</td>
                    <td class="content">{{ $item->asalproduk }}</td>
                    <td class="content" style="text-align: right;">{{ number_format( $item->hargaperolehan, 2, '.', ',') }}</td>
                    <td class="content">{{ $item->deskripsiproduk }}</td>
                    <td class="content">Keterangan</td>
                    <td class="content">1.02.01.04.00.000 - RUMAH SAKIT JIWA GRHASIA</td>
                </tr>
                @php
                    $idcha1 = $item->idcha1;    
                    $idcha2 = $item->idcha2;    
                    $idcha3 = $item->idcha3;    
                    $idcha4 = $item->idcha4;
                    $idcha5 = $item->idcha5;
                    $nomor++;
                @endphp
            @endforeach
        </tbody>
    </table>

    <script>
        window.print()
    </script>
</body>
</html>