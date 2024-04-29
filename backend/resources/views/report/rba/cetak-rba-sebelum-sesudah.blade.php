<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Laporan RBA</title>

    <style>
        @font-face {
            font-family: 'BookmanOldStyle';
            src: url('{{ asset('fonts/BookmanOldStyle.TTF') }}')
        }
        @page {
            size: 33cm 21.5cm;
            margin: 1cm;
        }
        p {
            margin: 0;
        }
        body {
            font-family: Arial, Helvetica, sans-serif;
            margin: 0;
        }
        .content {
            padding: 3px 5px;
            border: 1px solid black;
            font-size: 11pt;
        }
        table {
            border-collapse: collapse;
        }
        table tr td {
            border: 1px solid black;
            page-break-inside: avoid;
        }
    </style>
</head>
<body>
    {{-- Head 1 --}}
    <table cellpadding="0" cellspacing="0"  border="0" width="100%" class="tabel">
        <tbody >
            <tr>
                <td rowspan="2"  style="padding: 10px; width: 100px;" align="center">
                    <p align="center">
                            @if(stripos(\Request::url(), 'localhost') !== FALSE)
                            <img src="{{ asset('img/LOGO GRHASIA.png') }}" style="width: 120px" >
                            @else
                                <img src="{{ asset('service/img/LOGO GRHASIA.png') }}" style="width: 120px" >
                            @endif
                        
                    </p>
                </td>
                <td align="center" style="width: 300px;">
                    <b style="font-size: 25px;">
                        RENCANA BISNIS DAN ANGGARAN<br>
                        BADAN LAYANAN UMUM DAERAH
                    </b>
                </td>
                <td rowspan="2"  align="center" style="width: 100px;">
                    <b style="font-size: 25px;">
                        RBA
                    </b>
                    <br>
                    {{ $data[0]->tahap }}
                </td>
            </tr>
            <tr align="center">
                <td>
                    <b>RS Jiwa GRHASIA<br>TAHUN {{ $data[0]->tahun }}</b>
                </td>
            </tr>
            <tr>
                <td colspan="3">
                    <p align="center" style="margin-top: 10px; margin-bottom:10px">
                        <font style="font-size: 12pt; " color="#000000" face="Arial">
                                <b>REKAP ANGGARAN TIAP SUB KEGIATAN (JENIS ANGGARAN) <br> TAHUN ANGGARAN {{ $data[0]->tahun }}</b>
                        </font>
                        <br>
                    </p>
                </td>
            </tr>
        </tbody>
    </table>

    {{-- Program, Kegiatan, Sub --}}
    <table style="border-top: 0; border-left: 1px solid black; border-right: 1px solid black" cellpadding="0" cellspacing="0" width="100%" border="0">
        <tr>
            <td style="border: 0; padding-left: 1em;">Program</td>
            <td style="border: 0; padding-left: 1em;">: {{ $program[0]->kodeprogram.' - '.$program[0]->keteranganprogram }}</td>
        </tr>

        <tr>
            <td style="border: 0; padding-left: 1em;">Kegiatan</td>
            <td style="border: 0; padding-left: 1em;">: {{ $program[0]->kodekegiatan.' - '.$program[0]->keterangankegiatan }}</td>
        </tr>

        <tr>
            <td style="border: 0; padding-left: 1em;">Sub Kegiatan</td>
            <td style="border: 0; padding-left: 1em;">: {{ $program[0]->kodesubkegiatan.' - '.$program[0]->keterangansubkegiatan }}</td>
        </tr>

        <tr>
            <td style="border: 0; padding-left: 1em;">Sub Sub Kegiatan</td>
            @php
                $arr = explode('-', $program[0]->keterangansubsubkegiatan);

                $keteranganSubSub = end($arr);
            @endphp
            <td style="border: 0; padding-left: 1em;">: {{ $program[0]->kodesubsubkegiatan}} - {{ $keteranganSubSub }}</td>
        </tr>

        <tr>
            <td style="border: 0; padding-left: 1em;">Waktu Pelaksanaan</td>
            <td style="border: 0; padding-left: 1em;">: {{ $program[0]->tahun }}</td>
        </tr>

        <tr>
            <td style="border: 0; padding-left: 1em;">Lokasi Kegiatan</td>
            <td style="border: 0; padding-left: 1em;">: RS Jiwa GRHASIA DINKES DIY</td>
        </tr>
            
    </table>

    {{-- Indikator --}}
    <table style="border: 0;" cellpadding="0" cellspacing="0"  border="0" width="100%">
        <tr>
            <td style="text-align: center; padding: .2em .4em;" rowspan="2"><b>Indikator</b></td>
            <td style="text-align: center; padding: .2em .4em;" colspan="2"><b>Sebelum Perubahan</b></td>
            <td style="text-align: center; padding: .2em .4em;" colspan="2"><b>Sesudah Perubahan</b></td>
        </tr>
        <tr>
            <td style="text-align: center; padding: .2em .4em;"><b>Tolok Ukur</b></td>
            <td style="text-align: center; padding: .2em .4em;"><b>Target Kinerja</b></td>
            <td style="text-align: center; padding: .2em .4em;"><b>Tolok Ukur</b></td>
            <td style="text-align: center; padding: .2em .4em;"><b>Target Kinerja</b></td>
        </tr>
        <tr>
            <td style="padding: .2em .4em;">Masukan</td>
            {{-- <td style="padding: .2em .4em;">{{ $data[0]->indikatormasuk_sesudah }}</td> --}}
            <td style="padding: .2em .4em;">{{ $data[0]->indikatormasuk }}</td>
            {{-- <td style="padding: .2em .4em;">{{ $data[0]->targetmasuk }}</td> --}}
            <td style="padding: .2em .4em;">{{ $data[0]->targetmasuk_sesudah }}</td>
            {{-- <td style="padding: .2em .4em;">{{ $data[0]->indikatormasuk_sesudah }}</td> --}}
            <td style="padding: .2em .4em;">{{ $data[0]->indikatormasuk }}</td>
            {{-- <td style="padding: .2em .4em;">{{ $data[0]->targetmasuk_sesudah }}</td> --}}
            <td style="padding: .2em .4em;">{{ $data[0]->targetmasuk }}</td>
        </tr>
        <tr>
            <td style="padding: .2em .4em;">Keluaran</td>
            <td style="padding: .2em .4em;">
                {{-- @php
                    $indikatorkeluaran = explode(chr(10), $data[0]->indikatorkeluaran);            
                    for ($i = 0; $i < count($indikatorkeluaran); $i++) {
                        echo "$indikatorkeluaran[$i]";
                        echo "<br>";
                    }
                @endphp --}}
                @php
                    $indikatorkeluaranSesudah = explode(chr(10), $data[0]->indikatorkeluaran_sesudah);            
                    for ($i = 0; $i < count($indikatorkeluaranSesudah); $i++) {
                        echo "$indikatorkeluaranSesudah[$i]";
                        echo "<br>";
                    }
                @endphp
            </td>
            <td style="padding: .2em .4em;">
                {{-- @php
                    $targetkeluaran = explode(chr(10), $data[0]->targetkeluaran);            
                    for ($i = 0; $i < count($targetkeluaran); $i++) {
                        echo "$targetkeluaran[$i]";
                        echo "<br>";
                    }
                @endphp --}}
                @php
                    $targetkeluaranSesudah = explode(chr(10), $data[0]->targetkeluaran_sesudah);            
                    for ($i = 0; $i < count($targetkeluaranSesudah); $i++) {
                        echo "$targetkeluaranSesudah[$i]";
                        echo "<br>";
                    }
                @endphp
            </td>
            <td style="padding: .2em .4em;">
                {{-- @php
                    $indikatorkeluaranSesudah = explode(chr(10), $data[0]->indikatorkeluaran_sesudah);            
                    for ($i = 0; $i < count($indikatorkeluaranSesudah); $i++) {
                        echo "$indikatorkeluaranSesudah[$i]";
                        echo "<br>";
                    }
                @endphp --}}
                @php
                    $indikatorkeluaran = explode(chr(10), $data[0]->indikatorkeluaran);            
                    for ($i = 0; $i < count($indikatorkeluaran); $i++) {
                        echo "$indikatorkeluaran[$i]";
                        echo "<br>";
                    }
                @endphp
            </td>
            <td style="padding: .2em .4em;">
                {{-- @php
                    $targetkeluaranSesudah = explode(chr(10), $data[0]->targetkeluaran_sesudah);            
                    for ($i = 0; $i < count($targetkeluaranSesudah); $i++) {
                        echo "$targetkeluaranSesudah[$i]";
                        echo "<br>";
                    }
                @endphp --}}
                @php
                    $targetkeluaran = explode(chr(10), $data[0]->targetkeluaran);            
                    for ($i = 0; $i < count($targetkeluaran); $i++) {
                        echo "$targetkeluaran[$i]";
                        echo "<br>";
                    }
                @endphp
            </td>
        </tr>
        <tr>
            <td style="padding: .2em .4em; border-bottom: 0;">Hasil</td>
            {{-- <td style="padding: .2em .4em; border-bottom: 0;">{{ $data[0]->indikatorhasil }}</td> --}}
            <td style="padding: .2em .4em; border-bottom: 0;">{{ $data[0]->indikatorhasil_sesudah }}</td>
            {{-- <td style="padding: .2em .4em; border-bottom: 0;">{{ $data[0]->targethasil }}</td> --}}
            <td style="padding: .2em .4em; border-bottom: 0;">{{ $data[0]->targethasil_sesudah }}</td>
            {{-- <td style="padding: .2em .4em; border-bottom: 0;">{{ $data[0]->indikatorhasil_sesudah }}</td> --}}
            <td style="padding: .2em .4em; border-bottom: 0;">{{ $data[0]->indikatorhasil }}</td>
            {{-- <td style="padding: .2em .4em; border-bottom: 0;">{{ $data[0]->targethasil_sesudah }}</td> --}}
            <td style="padding: .2em .4em; border-bottom: 0;">{{ $data[0]->targethasil }}</td>
        </tr>
    </table>

    {{-- Content --}}
    <table style="border-top: 0;" cellpadding="0" cellspacing="0"  border="0" width="100%" class="tabel">
        <tbody>
            <tr style="text-align: center;">
                <td style="width: 40%; padding: .2em .4em;" colspan="5"><b>Anggaran Belanja</b></td>
                <td style="padding: .2em .4em;" colspan="4"><b>Sebelum Perubahan</b></td>
                <td style="padding: .2em .4em;" colspan="4"><b>Sesudah Perubahan</b></td>
                <td style="padding: .2em .4em;" rowspan="3">
                    Bertambah/
                    Berkurang
                </td>
                <td style="padding: .2em .4em;" rowspan="3">%</td>
                
            </tr>
            <tr style="text-align: center;">
                <td style="padding: .2em .4em;" rowspan="2" colspan="4"><b>No Rekening</b></td>
                <td style="padding: .2em .4em;" rowspan="2"><b>Komponen Biaya</b></td>
                <td style="padding: .2em .4em;" colspan="3"><b>Rincian Biaya</b></td>
                <td style="padding: .2em .4em;"><b>Jumlah Anggaran</b></td>
                <td style="padding: .2em .4em;" colspan="3"><b>Rincian Biaya</b></td>
                <td style="padding: .2em .4em;"><b>Jumlah Anggaran</b></td>
            </tr>
            <tr style="text-align: center;">
                <td style="padding: .2em .4em;"><b>Jumlah</b></td>
                <td style="padding: .2em .4em;"><b>Satuan</b></td>
                <td style="padding: .2em .4em;"><b>Harga Satuan</b></td>
                @foreach ($asalproduk as $ap)
                    @if ($ap->id == $data[0]->objectasalprodukfk)
                        <td style="padding: .2em .4em;"><b>{{ $ap->asalproduk }}</b></td>
                    @endif
                @endforeach
                <td style="padding: .2em .4em;">Jumlah</td>
                <td style="padding: .2em .4em;">Satuan</td>
                <td style="padding: .2em .4em;">Harga Satuan</td>
                @foreach ($asalproduk as $ap)
                    @if ($ap->id == $data[0]->objectasalprodukfk_sesudah)
                        <td style="padding: .2em .4em;"><b>{{ $ap->asalproduk }}</b></td>
                    @endif
                @endforeach
            </tr>

            @php
                $parent1 = null;
                $parent2 = null;
                $parent3 = null;
                $parent4 = null;
                $totalSemua = 0;
                $totalSemuaSesudah =0;
            @endphp

            @foreach ($data as $item)
                
                @if ($item->id_mataanggaran1 && ($item->id_mataanggaran1 !== $parent1))
                    @php
                        $totalParent1 = 0;
                        $totalParent1Sesudah = 0;
                        foreach ($data as $kb) {
                            if($kb->id_mataanggaran1 === $item->id_mataanggaran1){
                                $totalParent1 = $totalParent1 + ( (int)$kb->jml * (int)$kb->hargasatuan );
                                $totalParent1Sesudah = $totalParent1Sesudah + ( (int)$kb->jml_sesudah * (int)$kb->hargasatuan_sesudah );
                            }
                        }
                        $selisihParent1 = (int)$totalParent1 - (int)$totalParent1Sesudah;
                        $persenParent1 = (abs($selisihParent1) / ($totalParent1 + $totalParent1Sesudah) * 100);
                    @endphp

                    <tr>
                        <td style="padding: .2em .4em;"><b>{{ $item->kode_mataanggaran1 }}</b></td>
                        <td style="padding: .2em .4em;"></td>
                        <td style="padding: .2em .4em;"></td>
                        <td style="padding: .2em .4em;"></td>
                        <td style="padding: .2em .4em;"><b>{{ $item->nama_mataanggaran1 }}</b></td>
                        <td style="padding: .2em .4em;"></td>
                        <td style="padding: .2em .4em;"></td>
                        <td style="padding: .2em .4em;"></td>
                        {{-- <td style="text-align: right; padding: .2em .4em;">{{ number_format($totalParent1,0,',','.') }}</td> --}}
                        <td style="text-align: right; padding: .2em .4em;">{{ number_format($totalParent1Sesudah,0,',','.') }}</td>
                        <td style="padding: .2em .4em;"></td>
                        <td style="padding: .2em .4em;"></td>
                        <td style="padding: .2em .4em;"></td>
                        {{-- <td style="text-align: right; padding: .2em .4em;">{{ number_format($totalParent1Sesudah,0,',','.') }}</td> --}}
                        <td style="text-align: right; padding: .2em .4em;">{{ number_format($totalParent1,0,',','.') }}</td>
                        <td style="text-align: right; padding: .2em .4em;">{{ number_format(abs($selisihParent1),0,',','.') }}</td>
                        <td style="text-align: right; padding: .2em .4em;">{{ number_format($persenParent1, 3) }}</td>
                    </tr>
                @endif

                @if ($item->id_mataanggaran2 && ($item->id_mataanggaran2 !== $parent2))
                    @php
                        $totalParent2 = 0;
                        $totalParent2Sesudah = 0;
                        foreach ($data as $kb) {
                            if($kb->id_mataanggaran2 === $item->id_mataanggaran2){
                                $totalParent2 = $totalParent2 + ( (int)$kb->jml * (int)$kb->hargasatuan );
                                $totalParent2Sesudah = $totalParent2Sesudah + ( (int)$kb->jml_sesudah * (int)$kb->hargasatuan_sesudah );
                            }
                        }
                        $selisihParent2 =  (int)$totalParent2 - (int)$totalParent2Sesudah;
                        $persenParent2 = (abs($selisihParent2) / ($totalParent2 + $totalParent2Sesudah) * 100);
                    @endphp
                    <tr>
                        <td style="padding: .2em .4em;"></td>
                        <td style="padding: .2em .4em;"><b>{{ $item->kode_mataanggaran2 }}</b></td>
                        <td style="padding: .2em .4em;"></td>
                        <td style="padding: .2em .4em;"></td>
                        <td style="padding: .2em .4em;"><b>{{ $item->nama_mataanggaran2 }}</b></td>
                        <td style="padding: .2em .4em;"></td>
                        <td style="padding: .2em .4em;"></td>
                        <td style="padding: .2em .4em;"></td>
                        {{-- <td style="text-align:right; padding: .2em .4em;"><b>{{ number_format($totalParent2,0,',','.') }}</b></td> --}}
                        <td style="text-align:right; padding: .2em .4em;"><b>{{ number_format($totalParent2Sesudah,0,',','.') }}</b></td>
                        <td style="padding: .2em .4em;"></td>
                        <td style="padding: .2em .4em;"></td>
                        <td style="padding: .2em .4em;"></td>
                        {{-- <td style="text-align: right; padding: .2em .4em;"><b>{{ number_format($totalParent2Sesudah,0,',','.') }}</b></td> --}}
                        <td style="text-align: right; padding: .2em .4em;"><b>{{ number_format($totalParent2,0,',','.') }}</b></td>
                        <td style="text-align: right; padding: .2em .4em;"><b>{{ number_format(abs($selisihParent2),0,',','.') }}</b></td>
                        <td style="text-align: right; padding: .2em .4em;">{{ number_format($persenParent2, 3) }}</td>
                    </tr>
                @endif

                @if ($item->id_mataanggaran3 && ($item->id_mataanggaran3 !== $parent3))
                    @php
                        $totalParent3 = 0;
                        $totalParent3Sesudah = 0;
                        foreach ($data as $kb) {
                            if($kb->id_mataanggaran3 === $item->id_mataanggaran3){
                                $totalParent3 = $totalParent3 + ( (int)$kb->jml * (int)$kb->hargasatuan );
                                $totalParent3Sesudah = $totalParent3Sesudah + ( (int)$kb->jml_sesudah * (int)$kb->hargasatuan_sesudah );
                            }
                        }
                        $selisihParent3 = (int)$totalParent3 - (int)$totalParent3Sesudah;
                        $persenParent3 = (abs($selisihParent3) / ($totalParent3 + $totalParent3Sesudah) * 100);
                    @endphp
                    <tr>
                        <td style="padding: .2em .4em;"></td>
                        <td style="padding: .2em .4em;"></td>
                        <td style="padding: .2em .4em;"><b>{{ $item->kode_mataanggaran3 }}</b></td>
                        <td style="padding: .2em .4em;"></td>
                        <td style="padding: .2em .4em;"><b>{{ $item->nama_mataanggaran3 }}</b></td>
                        <td style="padding: .2em .4em;"></td>
                        <td style="padding: .2em .4em;"></td>
                        <td style="padding: .2em .4em;"></td>
                        {{-- <td style="text-align:right; padding: .2em .4em;">{{ number_format($totalParent3,0,',','.') }}</td> --}}
                        <td style="text-align:right; padding: .2em .4em;">{{ number_format($totalParent3Sesudah,0,',','.') }}</td>
                        <td style="padding: .2em .4em;"></td>
                        <td style="padding: .2em .4em;"></td>
                        <td style="padding: .2em .4em;"></td>
                        {{-- <td style="text-align:right; padding: .2em .4em;">{{ number_format($totalParent3Sesudah,0,',','.') }}</td> --}}
                        <td style="text-align:right; padding: .2em .4em;">{{ number_format($totalParent3,0,',','.') }}</td>
                        <td style="text-align:right; padding: .2em .4em;">{{ number_format(abs($selisihParent3),0,',','.') }}</td>
                        <td style="text-align:right; padding: .2em .4em;">{{ number_format($persenParent3, 3) }}</td>
                    </tr>
                @endif
                
                @if ($item->id_mataanggaran4 && ($item->id_mataanggaran4 !== $parent4))
                    @php
                        $totalParent4 = 0;
                        $totalParent4Sesudah = 0;
                        foreach ($data as $kb) {
                            if($kb->id_mataanggaran4 === $item->id_mataanggaran4){
                                $totalParent4 = $totalParent4 + ( (int)$kb->jml * (int)$kb->hargasatuan );
                                $totalParent4Sesudah = $totalParent4Sesudah + ( (int)$kb->jml_sesudah * (int)$kb->hargasatuan_sesudah );
                            }
                        }
                        $selisihParent4 = (int)$totalParent4- (int)$totalParent4Sesudah;
                        $persenParent4 = (abs($selisihParent4) / ($totalParent4 + $totalParent4Sesudah) * 100);
                    @endphp
                    <tr>
                        <td style="padding: .2em .4em;"></td>
                        <td style="padding: .2em .4em;"></td>
                        <td style="padding: .2em .4em;"></td>
                        <td style="padding: .2em .4em;"><b>{{ $item->kode_mataanggaran4 }}</b></td>
                        <td style="padding: .2em .4em;">{{ $item->nama_mataanggaran4 }}</td>
                        <td style="padding: .2em .4em;"></td>
                        <td style="padding: .2em .4em;"></td>
                        <td style="text-align: right; padding: .2em .4em;"></td>
                        {{-- <td style="text-align: right; padding: .2em .4em;">{{ number_format($totalParent4,0,',','.') }}</td> --}}
                        <td style="text-align: right; padding: .2em .4em;">{{ number_format($totalParent4Sesudah,0,',','.') }}</td>
                        <td style="padding: .2em .4em;"></td>
                        <td style="padding: .2em .4em;"></td>
                        <td style="padding: .2em .4em;"></td>
                        {{-- <td style="text-align: right; padding: .2em .4em;">{{ number_format($totalParent4Sesudah,0,',','.') }}</td> --}}
                        <td style="text-align: right; padding: .2em .4em;">{{ number_format($totalParent4,0,',','.') }}</td>
                        <td style="text-align: right; padding: .2em .4em;">{{ number_format(abs($selisihParent4),0,',','.') }}</td>
                        <td style="text-align: right; padding: .2em .4em;">{{ number_format($persenParent4, 3) }}</td>
                    </tr>
                @endif

                @php
                    $totalKB = ( (int)$item->jml * (int)$item->hargasatuan );
                    $totalKBSesudah = ( (int)$item->jml_sesudah * (int)$item->hargasatuan_sesudah );
                    $selisih = $totalKB - $totalKBSesudah;
                    $persen = (abs($selisih) / ($totalKB + $totalKBSesudah) * 100);
                @endphp
                <tr>
                    <td style="padding: .2em .4em;"></td>
                    <td style="padding: .2em .4em;"></td>
                    <td style="padding: .2em .4em;"></td>
                    <td style="padding: .2em .4em;"></td>
                    <td style="padding: .2em .4em;">{{ $item->keteranganbelanja }}</td>
                    {{-- <td style="padding: .2em .4em;">{{ $item->jml }}</td> --}}
                    <td style="padding: .2em .4em;">{{ $item->jml_sesudah }}</td>
                    {{-- <td style="padding: .2em .4em;">{{ $item->satuan }}</td> --}}
                    <td style="padding: .2em .4em;">{{ $item->satuan_sesudah }}</td>
                    {{-- <td style="text-align: right; padding: .2em .4em;">{{ number_format($item->hargasatuan,0,',','.') }}</td> --}}
                    <td style="text-align: right; padding: .2em .4em;">{{ number_format($item->hargasatuan_sesudah,0,',','.') }}</td>
                    {{-- <td style="text-align: right; padding: .2em .4em;">{{ number_format( $totalKB,0,',','.' ) }}</td> --}}
                    <td style="text-align: right; padding: .2em .4em;">{{ number_format( $totalKBSesudah,0,',','.' ) }}</td>
                    {{-- <td style="text-align: right; padding: .2em .4em;">{{ $item->jml_sesudah }}</td> --}}
                    <td style="text-align: right; padding: .2em .4em;">{{ $item->jml }}</td>
                    {{-- <td style="text-align: center; padding: .2em .4em;">{{ $item->satuan_sesudah }}</td> --}}
                    <td style="text-align: center; padding: .2em .4em;">{{ $item->satuan }}</td>
                    {{-- <td style="text-align: right; padding: .2em .4em;">{{ number_format($item->hargasatuan_sesudah,0,',','.') }}</td> --}}
                    <td style="text-align: right; padding: .2em .4em;">{{ number_format($item->hargasatuan,0,',','.') }}</td>
                    {{-- <td style="text-align: right; padding: .2em .4em;">{{ number_format($totalKBSesudah,0,',','.') }}</td> --}}
                    <td style="text-align: right; padding: .2em .4em;">{{ number_format($totalKB,0,',','.') }}</td>
                    <td style="text-align: right; padding: .2em .4em;">{{ number_format(abs($selisih),0,',','.') }}</td>
                    <td style="text-align: right; padding: .2em .4em;">{{ number_format($persen, 3) }}</td>
                </tr>

                @php
                    $parent1 = $item->id_mataanggaran1;
                    $parent2 = $item->id_mataanggaran2;
                    $parent3 = $item->id_mataanggaran3;
                    $parent4 = $item->id_mataanggaran4;
                    $totalSemua = $totalSemua + $totalKB;
                    $totalSemuaSesudah = $totalSemuaSesudah + $totalKBSesudah
                @endphp

            @endforeach
            
            <tr>
                <td colspan="8" style="text-align: center; padding: .2em .4em;"><b>Total</b></td>
                {{-- <td style="text-align: right; padding: .2em .4em;"><b>{{ number_format($totalSemua,0,',','.') }}</b></td> --}}
                <td style="text-align: right; padding: .2em .4em;"><b>{{ number_format($totalSemuaSesudah,0,',','.') }}</b></td>
                <td colspan="3" style="text-align: center; padding: .2em .4em;"><b></b></td>
                {{-- <td style="text-align: right; padding: .2em .4em;"><b>{{ number_format($totalSemuaSesudah,0,',','.') }}</b></td> --}}
                <td style="text-align: right; padding: .2em .4em;"><b>{{ number_format($totalSemua,0,',','.') }}</b></td>
                <td></td>
                <td></td>
            </tr>
        </tbody>
    </table>

    {{-- Footer --}}
    <table cellpadding="0" cellspacing="0" width="100%"  border="0">
        <thead>
            <tr>
                <td style="border: 0;" width="700">
                </td>
                <td style="border: 0;">
                </td>
                <td style="border: 0;">
                    <p align="center" style="margin-top: 50px;">
                        <font style="font-size: 12pt; " color="#000000" face="Arial">
                                Yogyakarta, {{ $tanggalcetak }}
                        </font>
                    </p>
                </td>
            </tr>
            <tr>
                <td style="border: 0;" width="700">
                </td>
                <td style="border: 0;">
                </td>
                <td style="border: 0;">
                    <p align="center" style="margin-bottom:50px">
                        <font style="font-size: 12pt; " color="#000000" face="Arial">
                                Kepala BLUD RS Jiwa GRHASIA
                        </font>
                    </p>
                </td>
            </tr>
            <tr></tr>
            <tr></tr>
            <tr></tr>
            <tr></tr>
            <tr>
                <td style="border: 0;" width="700">
                </td>
                <td style="border: 0;">
                </td>
                <td style="border: 0;">
                    <p align="center" style="margin-top: 50px;">
                        <font style="font-size: 12pt; " color="#000000" face="Arial">
                                <u>{{$settingrba[0]->namalengkap}}</u>
                        </font>
                    </p>
                </td>
            </tr>
            <tr>
                <td style="border: 0;" width="700">
                </td>
                <td style="border: 0;">
                </td>
                <td style="border: 0;">
                    <p align="center">
                        <font style="font-size: 12pt; " color="#000000" face="Arial">
                        NIP. {{$settingrba[0]->nippns}}
                        </font>
                    </p>
                </td>
            </tr>
    </table>
</body>
</html>