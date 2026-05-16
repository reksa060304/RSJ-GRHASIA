<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>
            Rekap RBA Jenis Anggaran
        </title>

    
    </head>
    <style>
        @page {
            size: 550mm 297mm;
            margin: 5mm 8mm;
            padding: 0;
        }

        @page :first {
            size: 550mm 297mm;
            margin: 5mm 8mm;
        }

        @media print {
            body {
                margin: 0;
            }
        }

        body {
            font-family: Arial;
        }

        table {
            font-family: 'Arial';
            margin: 0;
            padding: 0;
            font-size: 9pt;
        }

        #kop {
            width: 100%;
            text-align: center;
            border-collapse: collapse;
        }
        #kop tbody tr td{
            border: 1px solid black;
        }

        #konten{
            width: 100%;
            text-align: center;
            border-collapse: collapse;
        }
        #konten tr td{
            border: 1px solid black;
            padding: 4px 5px;
        }
        #konten thead td{
            font-weight: bold;
            text-transform: uppercase;
        }
    </style>
    <body>
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
                <td style="padding: 0;">
                    {{-- Kop --}}
                    <table id="kop" cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                            <tr>
                                <td style="padding: 5px; width: 15%;">
                                    <p align="center">
                                        @if(stripos(\Request::url(), 'localhost') !== FALSE)
                                        <img src="{{ asset('img/LOGO GRHASIA.png') }}" style="width: 100px" >
                                        @else
                                        <img src="{{ asset('service/img/LOGO GRHASIA.png') }}" style="width: 100px" >
                                        @endif
                                    </p>
                                </td>
                                <td align="center" style="padding: 5px; width: auto;">
                                    <b style="font-size: 23px;">
                                        RENCANA BISNIS DAN ANGGARAN<br>
                                        BADAN LAYANAN UMUM DAERAH<br>
                                        RS JIWA GRHASIA
                                    </b>
                                </td>
                                <td align="center" style="padding: 5px; width: 15%;">
                                    <b style="font-size: 23px;">
                                        RBA
                                    </b>
                                    <br>
                                    {{ $tahap[0]->tahap }}
                                </td>
                            </tr>
                            <tr>
                                <td colspan="3">
                                    <p align="center" style="margin-top: 10px; margin-bottom:10px">
                                        <font style="font-size: 12pt; " color="#000000">
                                            <b>REKAP ANGGARAN TIAP SUB KEGIATAN (JENIS ANGGARAN) <br> TAHUN ANGGARAN {{ date('Y') }}</b>
                                        </font>
                                        <br>
                                    </p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
            <tr>
                <td style="padding: 0;">
                    {{-- data --}}
                    <table id="konten" width="100%">
            <thead>
                <tr>
                    <td rowspan="3" style="min-width: 80px;">Kode Kegiatan</td>
                    <td rowspan="3" style="min-width: 400px;">Nama Kegiatan</td>
                    <td colspan="6">Anggaran Sebelum Perubahan</td>
                    <td colspan="6">Anggaran Sesudah Perubahan</td>
                    <td rowspan="3">Bertambah / Berkurang</td>
                </tr>
                <tr>
                    <td rowspan="2">Pegawai</td>
                    <td rowspan="2">Barang Jasa</td>
                    <td colspan="3">Modal</td>
                    <td rowspan="2">Subtotal</td>
                    <td rowspan="2">Pegawai</td>
                    <td rowspan="2">Barang Jasa</td>
                    <td colspan="3">Modal</td>
                    <td rowspan="2">Subtotal</td>
                </tr>
                <tr>
                    <td>Modal Gedung</td>
                    <td>Modal Alat dan Mesin</td>
                    <td>Modal Lainnya</td>
                    <td>Modal Gedung</td>
                    <td>Modal Alat dan Mesin</td>
                    <td>Modal Lainnya</td>
                </tr>
            </thead>
            <tbody>
                @php
                    $kodeKegiatan3 = '';
                    $kodeKegiatan2 = '';
                @endphp

                @foreach ($data as $row)
                    
                    @if ($row->kode2 && ($row->kode2 !== $kodeKegiatan2))
                        <tr>
                            <td style="text-align:left; font-weight:bold;">{{ $row->kode2 }}</td>
                            <td style="text-align:left; font-weight:bold;">{{ $row->keterangan2 }}</td>
                            @php
                                // sesudah
                                $belanjapegawai_lv2 = 0;
                                $belanjabarangjasa_lv2 = 0;
                                $belanjamodalgedung_lv2 = 0;
                                $belanjamodalalatmesin_lv2 = 0;
                                $belanjamodallainnya_lv2 = 0;
                                $subtotal_lv2 = 0;

                                // sebelum
                                $belanjapegawai2_lv2 = 0;
                                $belanjabarangjasa2_lv2 = 0;
                                $belanjamodalgedung2_lv2 = 0;
                                $belanjamodalalatmesin2_lv2 = 0;
                                $belanjamodallainnya2_lv2 = 0;
                                $subtotal2_lv2 = 0;

                                foreach($data as $d2){
                                    if($d2->kode2 == $row->kode2){
                                        // sesudah
                                        $belanjapegawai_lv2 = $belanjapegawai_lv2 + (int)$d2->belanjapegawai;
                                        $belanjabarangjasa_lv2 = $belanjabarangjasa_lv2 + (int)$d2->belanjabarangjasa;
                                        $belanjamodalgedung_lv2 = $belanjamodalgedung_lv2 + (int)$d2->belanjamodalgedung;
                                        $belanjamodalalatmesin_lv2 = $belanjamodalalatmesin_lv2 + (int)$d2->belanjamodalalatmesin;
                                        $belanjamodallainnya_lv2 = $belanjamodallainnya_lv2 + (int)$d2->belanjamodallainnya;
                                        $subtotal_lv2 = $subtotal_lv2 + (int)$d2->total;

                                        // sebelum 
                                        $belanjapegawai2_lv2 = $belanjapegawai2_lv2 + (int)$d2->belanjapegawai2;
                                        $belanjabarangjasa2_lv2 = $belanjabarangjasa2_lv2 + (int)$d2->belanjabarangjasa2;
                                        $belanjamodalgedung2_lv2 = $belanjamodalgedung2_lv2 + (int)$d2->belanjamodalgedung2;
                                        $belanjamodalalatmesin2_lv2 = $belanjamodalalatmesin2_lv2 + (int)$d2->belanjamodalalatmesin2;
                                        $belanjamodallainnya2_lv2 = $belanjamodallainnya2_lv2 + (int)$d2->belanjamodallainnya2;
                                        $subtotal2_lv2 = $subtotal2_lv2 + (int)$d2->total2;
                                    }
                                }
                            @endphp

                            {{-- sebelum --}}
                            <td style="text-align:right; font-weight:bold;">{{ $belanjapegawai2_lv2 == 0 ? '' : number_format($belanjapegawai2_lv2, 2, '.', ',') }}</td>
                            <td style="text-align:right; font-weight:bold;">{{ $belanjabarangjasa2_lv2 == 0 ? '' : number_format($belanjabarangjasa2_lv2, 2, '.', ',') }}</td>
                            <td style="text-align:right; font-weight:bold;">{{ $belanjamodalgedung2_lv2 == 0 ? '' : number_format($belanjamodalgedung2_lv2, 2, '.', ',') }}</td>
                            <td style="text-align:right; font-weight:bold;">{{ $belanjamodalalatmesin2_lv2 == 0 ? '' : number_format($belanjamodalalatmesin2_lv2, 2, '.', ',') }}</td>
                            <td style="text-align:right; font-weight:bold;">{{ $belanjamodallainnya2_lv2 == 0 ? '' : number_format($belanjamodallainnya2_lv2, 2, '.', ',') }}</td>
                            <td style="text-align:right; font-weight:bold;">{{ $subtotal2_lv2 == 0 ? '' : number_format($subtotal2_lv2, 2, '.', ',') }}</td>
                            
                            {{-- sesudah --}}
                            <td style="text-align:right; font-weight:bold;">{{ $belanjapegawai_lv2 == 0 ? '' : number_format($belanjapegawai_lv2, 2, '.', ',') }}</td>
                            <td style="text-align:right; font-weight:bold;">{{ $belanjabarangjasa_lv2 == 0 ? '' : number_format($belanjabarangjasa_lv2, 2, '.', ',') }}</td>
                            <td style="text-align:right; font-weight:bold;">{{ $belanjamodalgedung_lv2 == 0 ? '' : number_format($belanjamodalgedung_lv2, 2, '.', ',') }}</td>
                            <td style="text-align:right; font-weight:bold;">{{ $belanjamodalalatmesin_lv2 == 0 ? '' : number_format($belanjamodalalatmesin_lv2, 2, '.', ',') }}</td>
                            <td style="text-align:right; font-weight:bold;">{{ $belanjamodallainnya_lv2 == 0 ? '' : number_format($belanjamodallainnya_lv2, 2, '.', ',') }}</td>
                            <td style="text-align:right; font-weight:bold;">{{ $subtotal_lv2 == 0 ? '' : number_format($subtotal_lv2, 2, '.', ',') }}</td>
                            
                            {{-- berkurang/bertambah --}}
                            <td style="text-align:right; font-weight:bold;">{{ number_format(abs($subtotal2_lv2 - $subtotal_lv2), 2, '.', ',') }}</td>
                        </tr>
                    @endif
                    
                    @if ($row->kode3 && ($row->kode3 !== $kodeKegiatan3))
                        <tr>
                            <td style="text-align:left; font-weight:bold;">{{ $row->kode3 }}</td>
                            <td style="text-align:left; font-weight:bold;">{{ $row->keterangan3 }}</td>
                            @php
                                // sesudah
                                $belanjapegawai_lv3 = 0;
                                $belanjabarangjasa_lv3 = 0;
                                $belanjamodalgedung_lv3 = 0;
                                $belanjamodalalatmesin_lv3 = 0;
                                $belanjamodallainnya_lv3 = 0;
                                $subtotal_lv3 = 0;

                                // sebelum
                                $belanjapegawai2_lv3 = 0;
                                $belanjabarangjasa2_lv3 = 0;
                                $belanjamodalgedung2_lv3 = 0;
                                $belanjamodalalatmesin2_lv3 = 0;
                                $belanjamodallainnya2_lv3 = 0;
                                $subtotal2_lv3 = 0;

                                foreach($data as $d3){
                                    if($d3->kode3 == $row->kode3){
                                        // sesudah
                                        $belanjapegawai_lv3 = $belanjapegawai_lv3 + (int)$d3->belanjapegawai;
                                        $belanjabarangjasa_lv3 = $belanjabarangjasa_lv3 + (int)$d3->belanjabarangjasa;
                                        $belanjamodalgedung_lv3 = $belanjamodalgedung_lv3 + (int)$d3->belanjamodalgedung;
                                        $belanjamodalalatmesin_lv3 = $belanjamodalalatmesin_lv3 + (int)$d3->belanjamodalalatmesin;
                                        $belanjamodallainnya_lv3 = $belanjamodallainnya_lv3 + (int)$d3->belanjamodallainnya;
                                        $subtotal_lv3 = $subtotal_lv3 + (int)$d3->total;
                                        
                                        // sebelum 
                                        $belanjapegawai2_lv3 = $belanjapegawai2_lv3 + (int)$d3->belanjapegawai2;
                                        $belanjabarangjasa2_lv3 = $belanjabarangjasa2_lv3 + (int)$d3->belanjabarangjasa2;
                                        $belanjamodalgedung2_lv3 = $belanjamodalgedung2_lv3 + (int)$d3->belanjamodalgedung2;
                                        $belanjamodalalatmesin2_lv3 = $belanjamodalalatmesin2_lv3 + (int)$d3->belanjamodalalatmesin2;
                                        $belanjamodallainnya2_lv3 = $belanjamodallainnya2_lv3 + (int)$d3->belanjamodallainnya2;
                                        $subtotal2_lv3 = $subtotal2_lv3 + (int)$d3->total2;
                                    }
                                }
                            @endphp
                            
                            {{-- sebelum --}}
                            <td style="text-align:right; font-weight:bold;">{{ $belanjapegawai2_lv3 == 0 ? '' : number_format($belanjapegawai2_lv3, 2, '.', ',') }}</td>
                            <td style="text-align:right; font-weight:bold;">{{ $belanjabarangjasa2_lv3 == 0 ? '' : number_format($belanjabarangjasa2_lv3, 2, '.', ',') }}</td>
                            <td style="text-align:right; font-weight:bold;">{{ $belanjamodalgedung2_lv3 == 0 ? '' : number_format($belanjamodalgedung2_lv3, 2, '.', ',') }}</td>
                            <td style="text-align:right; font-weight:bold;">{{ $belanjamodalalatmesin2_lv3 == 0 ? '' : number_format($belanjamodalalatmesin2_lv3, 2, '.', ',') }}</td>
                            <td style="text-align:right; font-weight:bold;">{{ $belanjamodallainnya2_lv3 == 0 ? '' : number_format($belanjamodallainnya2_lv3, 2, '.', ',') }}</td>
                            <td style="text-align:right; font-weight:bold;">{{ $subtotal2_lv3 == 0 ? '' : number_format($subtotal2_lv3, 2, '.', ',') }}</td>
                            
                            {{-- sesudah --}}
                            <td style="text-align:right; font-weight:bold;">{{ $belanjapegawai_lv3 == 0 ? '' : number_format($belanjapegawai_lv3, 2, '.', ',') }}</td>
                            <td style="text-align:right; font-weight:bold;">{{ $belanjabarangjasa_lv3 == 0 ? '' : number_format($belanjabarangjasa_lv3, 2, '.', ',') }}</td>
                            <td style="text-align:right; font-weight:bold;">{{ $belanjamodalgedung_lv3 == 0 ? '' : number_format($belanjamodalgedung_lv3, 2, '.', ',') }}</td>
                            <td style="text-align:right; font-weight:bold;">{{ $belanjamodalalatmesin_lv3 == 0 ? '' : number_format($belanjamodalalatmesin_lv3, 2, '.', ',') }}</td>
                            <td style="text-align:right; font-weight:bold;">{{ $belanjamodallainnya_lv3 == 0 ? '' : number_format($belanjamodallainnya_lv3, 2, '.', ',') }}</td>
                            <td style="text-align:right; font-weight:bold;">{{ $subtotal_lv3 == 0 ? '' : number_format($subtotal_lv3, 2, '.', ',') }}</td>
                            
                            {{-- bertambah/berkurang --}}
                            <td style="text-align:right; font-weight:bold;">{{ number_format(abs($subtotal2_lv3 - $subtotal_lv3), 2, '.', ',') }}</td>
                        </tr>
                    @endif

                    <tr>
                        <td style="text-align: left;">{{ $row->kode }}</td>
                        @php
                            $ket = explode('-', $row->keterangan);
                        @endphp

                        {{-- sebelum --}}
                        <td style="text-align:left;">{{ end($ket) }}</td>
                        <td style="text-align:right;">{{ $row->belanjapegawai2 == 0 ? '' : number_format($row->belanjapegawai2, 2, '.', ',') }}</td>
                        <td style="text-align:right;">{{ $row->belanjabarangjasa2 == 0 ? '' : number_format($row->belanjabarangjasa2, 2, '.', ',') }}</td>
                        <td style="text-align:right;">{{ $row->belanjamodalgedung2 == 0 ? '' : number_format($row->belanjamodalgedung2, 2, '.', ',') }}</td>
                        <td style="text-align:right;">{{ $row->belanjamodalalatmesin2 == 0 ? '' : number_format($row->belanjamodalalatmesin2, 2, '.', ',') }}</td>
                        <td style="text-align:right;">{{ $row->belanjamodallainnya2 == 0 ? '' : number_format($row->belanjamodallainnya2, 2, '.', ',') }}</td>
                        <td style="text-align:right;">{{ $row->total2 == 0 ? '' : number_format($row->total2, 2, '.', ',') }}</td>

                        {{-- sesudah --}}
                        <td style="text-align:right;">{{ $row->belanjapegawai == 0 ? '' : number_format($row->belanjapegawai, 2, '.', ',') }}</td>
                        <td style="text-align:right;">{{ $row->belanjabarangjasa == 0 ? '' : number_format($row->belanjabarangjasa, 2, '.', ',') }}</td>
                        <td style="text-align:right;">{{ $row->belanjamodalgedung == 0 ? '' : number_format($row->belanjamodalgedung, 2, '.', ',') }}</td>
                        <td style="text-align:right;">{{ $row->belanjamodalalatmesin == 0 ? '' : number_format($row->belanjamodalalatmesin, 2, '.', ',') }}</td>
                        <td style="text-align:right;">{{ $row->belanjamodallainnya == 0 ? '' : number_format($row->belanjamodallainnya, 2, '.', ',') }}</td>
                        <td style="text-align:right;">{{ $row->total == 0 ? '' : number_format($row->total, 2, '.', ',') }}</td>
                        
                        {{-- bertambah/berkurang --}}
                        <td style="text-align:right;">{{ number_format(abs($row->total2 - $row->total), 2, '.', ',') }}</td>
                    </tr>

                    @php
                        $kodeKegiatan2 = $row->kode2;
                        $kodeKegiatan3 = $row->kode3;
                    @endphp

                @endforeach

                <tr>
                    <td colspan="2" style="font-weight:bold;">Jumlah</td>
                    @php
                        // sesudah
                        $totalbelanjapegawai = 0;
                        $totalbelanjabarangjasa = 0;
                        $totalbelanjamodalgedung = 0;
                        $totalbelanjamodalalatmesin = 0;
                        $totalbelanjamodallainnya = 0;
                        $totalsemua = 0;

                        // sebelum
                        $totalbelanjapegawai2 = 0;
                        $totalbelanjabarangjasa2 = 0;
                        $totalbelanjamodalgedung2 = 0;
                        $totalbelanjamodalalatmesin2 = 0;
                        $totalbelanjamodallainnya2 = 0;
                        $totalsemua2 = 0;

                        $totalbertambahberkurang = 0;

                        foreach ($data as $tot) {
                            
                            // sesudah
                            $totalbelanjapegawai = $totalbelanjapegawai + (int)$tot->belanjapegawai;
                            $totalbelanjabarangjasa = $totalbelanjabarangjasa + (int)$tot->belanjabarangjasa;
                            $totalbelanjamodalgedung = $totalbelanjamodalgedung + (int)$tot->belanjamodalgedung;
                            $totalbelanjamodalalatmesin = $totalbelanjamodalalatmesin + (int)$tot->belanjamodalalatmesin;
                            $totalbelanjamodallainnya = $totalbelanjamodallainnya + (int)$tot->belanjamodallainnya;
                            $totalsemua = $totalsemua + (int)$tot->total;

                            // sebelum
                            $totalbelanjapegawai2 = $totalbelanjapegawai2 + (int)$tot->belanjapegawai2;
                            $totalbelanjabarangjasa2 = $totalbelanjabarangjasa2 + (int)$tot->belanjabarangjasa2;
                            $totalbelanjamodalgedung2 = $totalbelanjamodalgedung2 + (int)$tot->belanjamodalgedung2;
                            $totalbelanjamodalalatmesin2 = $totalbelanjamodalalatmesin2 + (int)$tot->belanjamodalalatmesin2;
                            $totalbelanjamodallainnya2 = $totalbelanjamodallainnya2 + (int)$tot->belanjamodallainnya2;
                            $totalsemua2 = $totalsemua2 + (int)$tot->total2;

                            // bertambah berkurang per baris
                            $totalbertambahberkurang = $totalbertambahberkurang + abs((int)$tot->total2 - (int)$tot->total);
                        }
                    @endphp
                    
                    {{-- sebelum --}}
                    <td style="font-weight:bold; text-align:right;">{{ $totalbelanjapegawai2 == 0 ? '' : number_format($totalbelanjapegawai2, 2, '.', ',') }}</td>
                    <td style="font-weight:bold; text-align:right;">{{ $totalbelanjabarangjasa2 == 0 ? '' : number_format($totalbelanjabarangjasa2, 2, '.', ',') }}</td>
                    <td style="font-weight:bold; text-align:right;">{{ $totalbelanjamodalgedung2 == 0 ? '' : number_format($totalbelanjamodalgedung2, 2, '.', ',') }}</td>
                    <td style="font-weight:bold; text-align:right;">{{ $totalbelanjamodalalatmesin2 == 0 ? '' : number_format($totalbelanjamodalalatmesin2, 2, '.', ',') }}</td>
                    <td style="font-weight:bold; text-align:right;">{{ $totalbelanjamodallainnya2 == 0 ? '' : number_format($totalbelanjamodallainnya2, 2, '.', ',') }}</td>
                    <td style="font-weight:bold; text-align:right;">{{ $totalsemua2 == 0 ? '' : number_format($totalsemua2, 2, '.', ',') }}</td>
                    
                    {{-- sesudah --}}
                    <td style="font-weight:bold; text-align:right;">{{ $totalbelanjapegawai == 0 ? '' : number_format($totalbelanjapegawai, 2, '.', ',') }}</td>
                    <td style="font-weight:bold; text-align:right;">{{ $totalbelanjabarangjasa == 0 ? '' : number_format($totalbelanjabarangjasa, 2, '.', ',') }}</td>
                    <td style="font-weight:bold; text-align:right;">{{ $totalbelanjamodalgedung == 0 ? '' : number_format($totalbelanjamodalgedung, 2, '.', ',') }}</td>
                    <td style="font-weight:bold; text-align:right;">{{ $totalbelanjamodalalatmesin == 0 ? '' : number_format($totalbelanjamodalalatmesin, 2, '.', ',') }}</td>
                    <td style="font-weight:bold; text-align:right;">{{ $totalbelanjamodallainnya == 0 ? '' : number_format($totalbelanjamodallainnya, 2, '.', ',') }}</td>
                    <td style="font-weight:bold; text-align:right;">{{ $totalsemua == 0 ? '' : number_format($totalsemua, 2, '.', ',') }}</td>

                    {{-- bertambah berkurang --}}
                    <td style="font-weight:bold; text-align:right;">{{ $totalbertambahberkurang == 0 ? '' : number_format($totalbertambahberkurang, 2, '.', ',') }}</td>
                </tr>
            </tbody>
        </table>

        <table cellpadding="0" cellspacing="0" width="300" border="0" style="margin-left: auto; margin-right: 0;">
            <thead>
                <tr>
                    <td>
                        <p align="center" style="margin-top: 20px; margin-bottom: 0;">
                            <font style="font-size: 12pt;" color="#000000" face="Arial">
                                Yogyakarta, {{ $tanggalcetak }}
                            </font>
                        </p>
                        <p align="center" style="margin: 0 0 60px 0;">
                            <font style="font-size: 12pt;" color="#000000" face="Arial">
                                Direktur
                            </font>
                        </p>
                        <p align="center" style="margin: 0;">
                            <font style="font-size: 12pt;" color="#000000" face="Arial">
                                <u>{{ isset($settingrba[0]) ? $settingrba[0]->namalengkap : '' }}</u>
                            </font>
                        </p>
                        <p align="center" style="margin: 0;">
                            <font style="font-size: 12pt;" color="#000000" face="Arial">
                                NIP. {{ isset($settingrba[0]) ? $settingrba[0]->nippns : '' }}
                            </font>
                        </p>
                    </td>
                </tr>
            </thead>
        </table>

        <script>
            window.print()
        </script>
    </body>
</html>