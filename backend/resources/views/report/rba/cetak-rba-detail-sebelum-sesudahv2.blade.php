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
            size: auto;
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
            font-size: 10pt;
        }
        table tbody tr td {
            border: 1px solid black;
        }
        table thead tr th {
            border: 1px solid black;
        }
    </style>
</head>
<body>
    {{-- Head 1 --}}
    <table cellpadding="0" cellspacing="0"  border="0" width="100%" class="tabel">
        <tbody >
            <tr>
                <td rowspan="2" style="padding: 10px; width: 100px;" align="center">
                    <p align="center">
                            @if(stripos(\Request::url(), 'localhost') !== FALSE)
                            <img src="{{ asset('img/LOGO GRHASIA.png') }}" style="width: 120px" >
                            @else
                                <img src="{{ asset('service/img/LOGO GRHASIA.png') }}" style="width: 120px" >
                            @endif
                        
                    </p>
                </td>
                <td align="center" style="width: 300px;">
                    <b style="font-size: 14pt;">
                        RENCANA BISNIS DAN ANGGARAN<br>
                        BADAN LAYANAN UMUM DAERAH
                    </b>
                </td>
                <td rowspan="2"  align="center" style="width: 100px;">
                    <b style="font-size: 14pt;">
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
            <td style="border: 0; width: 4cm; padding-left: 1em;">Program</td>
            <td style="border: 0; padding-left: 1em;">: {{ $program[0]->kodeprogram.' - '.$program[0]->keteranganprogram }}</td>
        </tr>

        <tr>
            <td style="border: 0; width: 4cm; padding-left: 1em;">Kegiatan</td>
            <td style="border: 0; padding-left: 1em;">: {{ $program[0]->kodekegiatan.' - '.$program[0]->keterangankegiatan }}</td>
        </tr>

        <tr>
            <td style="border: 0; width: 4cm; padding-left: 1em;">Sub Kegiatan</td>
            <td style="border: 0; padding-left: 1em;">: {{ $program[0]->kodesubkegiatan.' - '.$program[0]->keterangansubkegiatan }}</td>
        </tr>

        <tr>
            <td style="border: 0; width: 4cm; padding-left: 1em;">Sub Sub Kegiatan</td>
            @php
                $arr = explode('-', $program[0]->keterangansubsubkegiatan);

                $keteranganSubSub = end($arr);
            @endphp
            <td style="border: 0; padding-left: 1em;">: {{ $program[0]->kodesubsubkegiatan}} - {{ $keteranganSubSub }}</td>
        </tr>

        <tr>
            <td style="border: 0; width: 4cm; padding-left: 1em;">Waktu Pelaksanaan</td>
            <td style="border: 0; padding-left: 1em;">: {{ $program[0]->tahun }}</td>
        </tr>

        <tr>
            <td style="border: 0; width: 4cm; padding-left: 1em;">Lokasi Kegiatan</td>
            <td style="border: 0; padding-left: 1em;">: RS Jiwa GRHASIA DINKES DIY</td>
        </tr>
            
    </table>

    {{-- Indikator --}}
    <table style="border: 0;" cellpadding="0" cellspacing="0"  border="0" width="100%">
        <thead>
            <tr>
                <th style="width:8%; text-align:center; padding:5px;" rowspan="2"><b>Indikator</b></th>
                <th style="width:46%; text-align:center; padding:5px;" colspan="2"><b>Sebelum Perubahan</b></th>
                <th style="width:46%; text-align:center; padding:5px;" colspan="2"><b>Sesudah Perubahan</b></th>
            </tr>
            <tr>
                <th style="width:34%; text-align:center; padding:5px;"><b>Tolok Ukur</b></th>
                <th style="width:12%; text-align:center; padding:5px;"><b>Target Kinerja</b></th>
                <th style="width:34%; text-align:center; padding:5px;"><b>Tolok Ukur</b></th>
                <th style="width:12%; text-align:center; padding:5px;"><b>Target Kinerja</b></th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td style="padding:5px; width:8%;">Masukan</td>
                <td style="padding:5px; width:34%;">{{ $data[0]->indikatormasuk }}</td>
                <td style="padding:5px; width:12%;">
                    @php
                        $totalSesudah = 0;
                        foreach ($data as $key => $item) {
                            $totalSesudah += ( (int)$item->jml_sesudah * (int)$item->hargasatuan_sesudah );
                        }
                    @endphp
                    Rp. {{ number_format($totalSesudah,2,',','.') }}</td>
                <td style="padding:5px; width:34%;">{{ $data[0]->indikatormasuk }}</td>
                <td style="padding:5px; width:12%;">
                    @php
                        $totalSebelum = 0;
                        foreach ($data as $key => $item) {
                            $totalSebelum += ( (int)$item->jml * (int)$item->hargasatuan );
                        }
                    @endphp
                    Rp. {{ number_format($totalSebelum,2,',','.') }}</td>
                </td>
            </tr>
            <tr>
                <td style="padding:5px; width:8%;">Keluaran</td>
                <td style="padding:5px; width:34%;">
                    @php
                        $indikatorkeluaranSesudah = explode(chr(10), $data[0]->indikatorkeluaran_sesudah);            
                        for ($i = 0; $i < count($indikatorkeluaranSesudah); $i++) {
                            echo "$indikatorkeluaranSesudah[$i]";
                            echo "<br>";
                        }
                    @endphp
                </td>
                <td style="padding:5px; width:12%;">
                    @php
                        $targetkeluaranSesudah = explode(chr(10), $data[0]->targetkeluaran_sesudah);            
                        for ($i = 0; $i < count($targetkeluaranSesudah); $i++) {
                            echo "$targetkeluaranSesudah[$i]";
                            echo "<br>";
                        }
                    @endphp
                </td>
                <td style="padding:5px; width:34%;">
                    @php
                        $indikatorkeluaran = explode(chr(10), $data[0]->indikatorkeluaran);            
                        for ($i = 0; $i < count($indikatorkeluaran); $i++) {
                            echo "$indikatorkeluaran[$i]";
                            echo "<br>";
                        }
                    @endphp
                </td>
                <td style="padding:5px; width:12%;">
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
                <td style="padding:5px; width:8%; border-bottom: 0;">Hasil</td>
                <td style="padding:5px; width:34%; border-bottom: 0;">{{ $data[0]->indikatorhasil_sesudah }}</td>
                <td style="padding:5px; width:12%; border-bottom: 0;">{{ $data[0]->targethasil_sesudah }}</td>
                <td style="padding:5px; width:34%; border-bottom: 0;">{{ $data[0]->indikatorhasil }}</td>
                <td style="padding:5px; width:12%; border-bottom: 0;">{{ $data[0]->targethasil }}</td>
            </tr>
        </tbody>
    </table>

    {{-- Content --}}
    <table style="border-top:0; font-size:9pt;" cellpadding="0" cellspacing="0"  border="0" width="100%" class="tabel">
        <thead>
            <tr style="text-align: center;">
                <th style="width:25%; padding:5px;" colspan="5"><b>Anggaran Belanja</b></th>
                <th style="width:30%; padding:5px;" colspan="{{ count($asalproduk)+3 }}"><b>Sebelum Perubahan</b></th>
                <th style="width:30%; padding:5px;" colspan="{{ count($asalproduk)+3 }}"><b>Sesudah Perubahan</b></th>
                <th style="width:10%; padding:5px;" rowspan="3">Bertambah/ Berkurang</th>
                <th style="width:5%; padding:5px;" rowspan="3">%</th>
            </tr>

            <tr style="text-align: center;">
                <th style="width:13%; padding:5px;" rowspan="2" colspan="4"><b>No Rekening</b></th>
                <th style="width:12%; padding:5px;" rowspan="2"><b>Komponen Biaya</b></th>
                <th style="width:10%; padding:5px;" colspan="3"><b>Rincian Biaya</b></th>
                <th style="width:20%; padding:5px;" colspan="{{ count($asalproduk) }}"><b>Jumlah Anggaran</b></th>
                <th style="widht:10%; padding:5px;" colspan="3"><b>Rincian Biaya</b></th>
                <th style="width:20%; padding:5px;" colspan="{{ count($asalproduk) }}"><b>Jumlah Anggaran</b></th>
            </tr>
            
            <tr style="text-align: center;">
                <th style="padding:5px;"><b>Jumlah</b></th>
                <th style="padding:5px;"><b>Satuan</b></th>
                <th style="padding:5px;"><b>Harga Satuan</b></th>

                @foreach ($asalproduk as $item)
                    <th style="padding:5px;"><b>{{ $item->asalproduk }}</b></th>
                @endforeach
                
                <th style="padding:5px;">Jumlah</th>
                <th style="padding:5px;">Satuan</th>
                <th style="padding:5px;">Harga Satuan</th>
                
                @foreach ($asalproduk as $item)
                    <th style="padding:5px;"><b>{{ $item->asalproduk }}</b></th>
                @endforeach
            </tr>
        </thead>
        <tbody>
            @php
                $parent1 = null;
                $parent2 = null;
                $parent3 = null;
                $parent4 = null;
                $totalSemua = 0;
                $totalSemuaSesudah =0;
            @endphp
            @foreach ($data as $item)

                {{-- Mata anggaran 1 --}}
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
                    @endphp

                    <tr>
                        <td style="padding:5px;"><b>{{ $item->kode_mataanggaran1 }}</b></td>
                        <td style="padding:5px;"></td>
                        <td style="padding:5px;"></td>
                        <td style="padding:5px;"></td>
                        <td style="padding:5px;"><b>{{ $item->nama_mataanggaran1 }}</b></td>
                        <td style="padding:5px;"></td>
                        <td style="padding:5px;"></td>
                        <td style="padding:5px;"></td>

                        @foreach ($asalproduk as $ap)
                            {{-- untuk menghitung total setiap belanja berdasarkan asal produk --}}
                            {{-- mengambil jml_sesudah dan hargasatuan_sesudah --}}
                            @php
                                $ap->subtotal = 0;
                                foreach ($data as $ma1) {
                                    if($ma1->id_mataanggaran1 === $item->id_mataanggaran1){
                                        if($ma1->objectasalprodukfk == $ap->id){
                                            $ap->subtotal += ( (int)$ma1->jml_sesudah * (int)$ma1->hargasatuan_sesudah );
                                        }
                                    }
                                }
                            @endphp

                            @if ($ap->id == $item->objectasalprodukfk)
                                <td style="text-align: right; padding:5px;">{{ number_format($ap->subtotal,0,',','.') }}</td>
                            @else
                                <td style="text-align: right; padding:5px;">{{ number_format($ap->subtotal,0,',','.') }}</td>
                            @endif
                        @endforeach


                        <td style="padding:5px;"></td>
                        <td style="padding:5px;"></td>
                        <td style="padding:5px;"></td>
                        
                        @foreach ($asalproduk as $ap)
                            {{-- untuk menghitung total setiap belanja berdasarkan asal produk --}}
                            {{-- mengambil jml dan hargasatuan --}}
                            @php
                                $ap->subtotal = 0;
                                foreach ($data as $ma1) {
                                    if($ma1->id_mataanggaran1 === $item->id_mataanggaran1){
                                        if($ma1->objectasalprodukfk == $ap->id){
                                            $ap->subtotal += ( (int)$ma1->jml * (int)$ma1->hargasatuan );
                                        }
                                    }
                                }
                            @endphp
                            
                            @if ($ap->id == $item->objectasalprodukfk)
                                <td style="text-align: right; padding:5px;">{{ number_format($ap->subtotal,0,',','.') }}</td>
                            @else
                                <td style="text-align: right; padding:5px;">{{ number_format($ap->subtotal,0,',','.') }}</td>
                            @endif
                        @endforeach

                        <td style="text-align: right; padding:5px;">{{ number_format($selisihParent1,0,',','.') }}</td>
                        <td style="text-align: right; padding:5px;">0</td>
                    </tr>
                @endif

                {{-- Mata anggaran 2 --}}
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
                    @endphp
                    <tr>
                        <td style="padding:5px;"></td>
                        <td style="padding:5px;"><b>{{ $item->kode_mataanggaran2 }}</b></td>
                        <td style="padding:5px;"></td>
                        <td style="padding:5px;"></td>
                        <td style="padding:5px;"><b>{{ $item->nama_mataanggaran2 }}</b></td>
                        <td style="padding:5px;"></td>
                        <td style="padding:5px;"></td>
                        <td style="padding:5px;"></td>

                        @foreach ($asalproduk as $ap)
                            {{-- untuk menghitung total setiap belanja berdasarkan asal produk --}}
                            {{-- mengambil jml_sesudah dan hargasatuan_sesudah --}}
                            @php
                                $ap->subtotal = 0;
                                foreach ($data as $ma2) {
                                    if($ma2->id_mataanggaran2 === $item->id_mataanggaran2){
                                        if($ma2->objectasalprodukfk == $ap->id){
                                            $ap->subtotal += ( (int)$ma2->jml_sesudah * (int)$ma2->hargasatuan_sesudah );
                                        }
                                    }
                                }
                            @endphp

                            @if ($ap->id == $item->objectasalprodukfk)
                                <td style="text-align: right; padding:5px;">{{ number_format($ap->subtotal,0,',','.') }}</td>
                            @else
                                <td style="text-align: right; padding:5px;">{{ number_format($ap->subtotal,0,',','.') }}</td>
                            @endif
                        @endforeach


                        <td style="padding:5px;"></td>
                        <td style="padding:5px;"></td>
                        <td style="padding:5px;"></td>

                        @foreach ($asalproduk as $ap)
                            {{-- untuk menghitung total setiap belanja berdasarkan asal produk --}}
                            {{-- mengambil jml dan hargasatuan --}}
                            @php
                                $ap->subtotal = 0;
                                foreach ($data as $ma2) {
                                    if($ma2->id_mataanggaran2 === $item->id_mataanggaran2){
                                        if($ma2->objectasalprodukfk == $ap->id){
                                            $ap->subtotal += ( (int)$ma2->jml * (int)$ma2->hargasatuan );
                                        }
                                    }
                                }
                            @endphp
                            
                            @if ($ap->id == $item->objectasalprodukfk)
                                <td style="text-align: right; padding:5px;">{{ number_format($ap->subtotal,0,',','.') }}</td>
                            @else
                                <td style="text-align: right; padding:5px;">{{ number_format($ap->subtotal,0,',','.') }}</td>
                            @endif
                        @endforeach

                        <td style="text-align: right; padding:5px;"><b>{{ number_format($selisihParent2,0,',','.') }}</b></td>
                        <td style="text-align: right; padding:5px;">0</td>
                    </tr>
                @endif

                {{-- Mata anggaran 3 --}}
                @if ($item->id_mataanggaran3 && ($item->id_mataanggaran3 !== $parent3) && $item->kode_mataanggaran1 !== 'III')
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
                    @endphp

                    <tr>
                        <td style="padding:5px;"></td>
                        <td style="padding:5px;"></td>
                        <td style="padding:5px;"><b>{{ $item->kode_mataanggaran3 }}</b></td>
                        <td style="padding:5px;"></td>
                        <td style="padding:5px;"><b>{{ $item->nama_mataanggaran3 }}</b></td>
                        <td style="padding:5px;"></td>
                        <td style="padding:5px;"></td>
                        <td style="padding:5px;"></td>
                        
                        @foreach ($asalproduk as $ap)
                            {{-- untuk menghitung total setiap belanja berdasarkan asal produk --}}
                            {{-- mengambil jml_sesudah dan hargasatuan_sesudah --}}
                            @php
                                $ap->subtotal = 0;
                                foreach ($data as $ma3) {
                                    if($ma3->id_mataanggaran3 === $item->id_mataanggaran3){
                                        if($ma3->objectasalprodukfk == $ap->id){
                                            $ap->subtotal += ( (int)$ma3->jml_sesudah * (int)$ma3->hargasatuan_sesudah );
                                        }
                                    }
                                }
                            @endphp

                            @if ($ap->id == $item->objectasalprodukfk)
                                <td style="text-align: right; padding:5px;">{{ number_format($ap->subtotal,0,',','.') }}</td>
                            @else
                                <td style="text-align: right; padding:5px;">{{ number_format($ap->subtotal,0,',','.') }}</td>
                            @endif
                        @endforeach

                        <td style="padding:5px;"></td>
                        <td style="padding:5px;"></td>
                        <td style="padding:5px;"></td>
                        {{-- <td style="text-align:right; padding:5px;">{{ number_format($totalParent3Sesudah,0,',','.') }}</td> --}}
                        
                        
                        @foreach ($asalproduk as $ap)
                            {{-- untuk menghitung total setiap belanja berdasarkan asal produk --}}
                            {{-- mengambil jml dan hargasatuan --}}
                            @php
                                $ap->subtotal = 0;
                                foreach ($data as $ma3) {
                                    if($ma3->id_mataanggaran3 === $item->id_mataanggaran3){
                                        if($ma3->objectasalprodukfk == $ap->id){
                                            $ap->subtotal += ( (int)$ma3->jml * (int)$ma3->hargasatuan );
                                        }
                                    }
                                }
                            @endphp
                            
                            @if ($ap->id == $item->objectasalprodukfk)
                                <td style="text-align: right; padding:5px;">{{ number_format($ap->subtotal,0,',','.') }}</td>
                            @else
                                <td style="text-align: right; padding:5px;">{{ number_format($ap->subtotal,0,',','.') }}</td>
                            @endif
                        @endforeach
                        

                        <td style="text-align:right; padding:5px;">{{ number_format($selisihParent3,0,',','.') }}</td>
                        <td style="text-align: right; padding:5px;">0</td>
                    </tr>
                @endif

                {{-- Mata anggaran 4 --}}
                @if ($item->id_mataanggaran4 && ($item->id_mataanggaran4 !== $parent4))
                    @php
                        $totalParent4 = 0;
                        $totalParent4Sesudah = 0;
                        
                        foreach ($data as $ma4) {
                            if($ma4->id_mataanggaran4 === $item->id_mataanggaran4){
                                $totalParent4 = $totalParent4 + ( (int)$ma4->jml * (int)$ma4->hargasatuan );
                                $totalParent4Sesudah = $totalParent4Sesudah + ( (int)$ma4->jml_sesudah * (int)$ma4->hargasatuan_sesudah );
                            }
                        }
                        $selisihParent4 = (int)$totalParent4 - (int)$totalParent4Sesudah;
                        // $persenParent4 = (abs($selisihParent4) / ($totalParent4 + $totalParent4Sesudah) * 100);
                    @endphp
                    <tr>
                        <td style="padding:5px;"></td>
                        <td style="padding:5px;"></td>
                        <td style="padding:5px;"></td>
                        <td style="padding:5px;"><b>{{ $item->kode_mataanggaran4 }}</b></td>
                        <td style="padding:5px;">{{ $item->nama_mataanggaran4 }}</td>
                        <td style="padding:5px;"></td>
                        <td style="padding:5px;"></td>
                        <td style="text-align: right; padding:5px;"></td>
                        
                        {{-- total setiap asal produk sudah benar --}}
                        @foreach ($asalproduk as $ap)
                            {{-- untuk menghitung total setiap belanja berdasarkan asal produk --}}
                            {{-- mengambil jml_sesudah dan hargasatuan_sesudah --}}
                            @php
                                $ap->subtotal = 0;
                                foreach ($data as $ma4) {
                                    if($ma4->id_mataanggaran4 === $item->id_mataanggaran4){
                                        if($ma4->objectasalprodukfk == $ap->id){
                                            $ap->subtotal += ( (int)$ma4->jml_sesudah * (int)$ma4->hargasatuan_sesudah );
                                        }
                                    }
                                }
                            @endphp

                            @if ($ap->id == $item->objectasalprodukfk)
                                <td style="text-align: right; padding:5px;">{{ number_format($ap->subtotal,0,',','.') }}</td>
                            @else
                                <td style="text-align: right; padding:5px;">{{ number_format($ap->subtotal,0,',','.') }}</td>
                            @endif
                        @endforeach
                        
                        <td></td>
                        <td></td>
                        <td></td>
                        
                        {{-- total setiap asal produk sudah benar --}}
                        @foreach ($asalproduk as $ap)
                            {{-- untuk menghitung total setiap belanja berdasarkan asal produk --}}
                            {{-- mengambil jml dan hargasatuan --}}
                            @php
                                $ap->subtotal = 0;
                                foreach ($data as $ma4) {
                                    if($ma4->id_mataanggaran4 === $item->id_mataanggaran4){
                                        if($ma4->objectasalprodukfk == $ap->id){
                                            $ap->subtotal += ( (int)$ma4->jml * (int)$ma4->hargasatuan );
                                        }
                                    }
                                }
                            @endphp
                            
                            @if ($ap->id == $item->objectasalprodukfk)
                                <td style="text-align: right; padding:5px;">{{ number_format($ap->subtotal,0,',','.') }}</td>
                            @else
                                <td style="text-align: right; padding:5px;">{{ number_format($ap->subtotal,0,',','.') }}</td>
                            @endif
                        @endforeach
                            
                        <td style="text-align: right; padding:5px;">{{ number_format($selisihParent4,0,',','.') }}</td>
                        <td style="text-align: right; padding:5px;">0</td>
                    </tr>
                @endif
                
                {{-- Belanja --}}
                @php
                    $totalKB = ( (int)$item->jml * (int)$item->hargasatuan );
                    $totalKBSesudah = ( (int)$item->jml_sesudah * (int)$item->hargasatuan_sesudah );
                    $selisih = $totalKB - $totalKBSesudah;
                @endphp
                
                <tr>
                    <td style="padding: .2em .4em;"></td>
                    <td style="padding: .2em .4em;"></td>
                    <td style="padding: .2em .4em;"></td>
                    <td style="padding: .2em .4em;"></td>
                    <td style="padding: .2em .4em;">{{ $item->keteranganbelanja }}</td>
                    <td style="padding: .2em .4em;">{{ $item->jml_sesudah }}</td>
                    <td style="padding: .2em .4em;">{{ $item->satuan_sesudah }}</td>
                    <td style="text-align: right; padding: .2em .4em;">{{ number_format($item->hargasatuan_sesudah,0,',','.') }}</td>
                    
                    @foreach ($asalproduk as $ap)
                        @if ($ap->id == $item->objectasalprodukfk)
                            <td style="text-align: right; padding: .2em .4em;">{{ number_format( $totalKBSesudah,0,',','.' ) }}</td>
                        @else
                            <td style="text-align: right; padding: .2em .4em;">0</td>
                        @endif
                    @endforeach
                    
                    <td style="text-align: right; padding: .2em .4em;">{{ $item->jml }}</td>
                    <td style="text-align: center; padding: .2em .4em;">{{ $item->satuan }}</td>
                    <td style="text-align: right; padding: .2em .4em;">{{ number_format($item->hargasatuan,0,',','.') }}</td>
                    
                    @foreach ($asalproduk as $ap)
                        @if ($ap->id == $item->objectasalprodukfk)
                            <td style="text-align: right; padding: .2em .4em;">{{ number_format($totalKB,0,',','.') }}</td>
                        @else
                            <td style="text-align: right; padding: .2em .4em;">0</td>
                        @endif
                    @endforeach
                    
                    {{-- selisih masih salah karena cara asal produk lebih dua --}}
                    <td style="text-align: right; padding: .2em .4em;">{{ number_format($selisih,0,',','.') }}</td>
                    <td style="text-align: right; padding: .2em .4em;">0</td>
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
                <td colspan="8" style="text-align: center; padding:5px;"><b>Total</b></td>

                @foreach ($asalproduk as $ap_sesudah)
                    @php
                        $ap_sesudah->subtotal = 0;

                        foreach ($data as $dt) {
                            if($dt->objectasalprodukfk == $ap_sesudah->id){
                                $ap_sesudah->subtotal += ( (int)$dt->jml_sesudah * (int)$dt->hargasatuan_sesudah );
                            }
                        }
                    @endphp

                    <td style="text-align: right; padding:5px;">{{ number_format($ap_sesudah->subtotal,0,',','.') }}</td>
                @endforeach

                <td colspan="3" style="text-align: center; padding:5px;"><b></b></td>
                
                @foreach ($asalproduk as $ap)
                    @php
                        $ap->subtotal = 0;

                        foreach ($data as $dt) {
                            if($dt->objectasalprodukfk == $ap->id){
                                $ap->subtotal += ( (int)$dt->jml * (int)$dt->hargasatuan );
                            }
                        }
                    @endphp

                    <td style="text-align: right; padding:5px;">{{ number_format($ap->subtotal,0,',','.') }}</td>
                @endforeach

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
                                Yogyakarta, {{ isset($tanggalcetak) ? $tanggalcetak : '' }}
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

    <script>
        window.print()
    </script>
</body>
</html>