<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Laporan RBA Detail</title>

    <style>
        @page {
            size: auto;
            margin: 1cm;
            font-family: Arial, Helvetica, sans-serif;
            overflow: hidden;
        }
        body{
            font-family: Arial, Helvetica, sans-serif;
        }
        p{
            margin: 0;
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
    <div style="width: 100%">

        {{-- Kop --}}
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
                        {{ $kegiatan[0]->tahap }}
                    </td>
                </tr>
                <tr align="center">
                    <td>
                        <b>RS Jiwa GRHASIA<br>TAHUN {{ $tahun }}</b>
                    </td>
                </tr>
                <tr>
                    <td colspan="3">
                        <p align="center" style="margin-top: 10px; margin-bottom:10px">
                            <font style="font-size: 12pt; " color="#000000" face="Arial">
                                    <b>REKAP ANGGARAN TIAP SUB KEGIATAN (JENIS ANGGARAN) <br> TAHUN ANGGARAN {{ $tahun }}</b>
                            </font>
                            <br>
                        </p>
                    </td>
                </tr>
            </tbody>
        </table>

        {{-- kegiatan --}}
        <table style="border-top: 0; border-left: 1px solid black; border-right: 1px solid black" cellpadding="0" cellspacing="0" width="100%" border="0">
            <tbody>
                <tr>
                    <td style="border: 0; width: 4cm; padding-left: 1em;">Program</td>
                    <td style="border: 0; padding-left: 1em;">: {{ $kegiatan[0]->kodeprogram }} - {{ $kegiatan[0]->keteranganprogram }}</td>
                </tr>
                <tr>
                    <td style="border: 0; width: 4cm; padding-left: 1em;">Kegiatan</td>
                    <td style="border: 0; padding-left: 1em;">: {{ $kegiatan[0]->kodekegiatan }} - {{ $kegiatan[0]->keterangankegiatan }}</td>
                </tr>
                <tr>
                    <td style="border: 0; width: 4cm; padding-left: 1em;">Sub Kegiatan</td>
                    <td style="border: 0; padding-left: 1em;">: {{ $kegiatan[0]->kodesubkegiatan }} - {{ $kegiatan[0]->keterangansubkegiatan }}</td>
                </tr>
                <tr>
                    <td style="border: 0; width: 4cm; padding-left: 1em;">Sub Sub Kegiatan</td>
                    <td style="border: 0; padding-left: 1em;">: {{ $kegiatan[0]->kodesubsubkegiatan }} - {{ $kegiatan[0]->keterangansubsubkegiatan }}</td>
                </tr>
                <tr>
                    <td style="border: 0; width: 4cm; padding-left: 1em;">Waktu Pelaksanaan</td>
                    <td style="border: 0; padding-left: 1em;">: {{ $tahun }}</td>
                </tr>
                <tr>
                    <td style="border: 0; width: 4cm; padding-left: 1em;">Lokasi Kegiatan</td>
                    <td style="border: 0; padding-left: 1em;">: RSJ Grhasia</td>
                </tr>
            </tbody>
        </table>
    
        {{-- indikator tolok ukur target kinerja --}}
        <div>
            <table style="width: 100%;">
                <thead>
                    <tr>
                        <th style="width:8%; padding:5px;">Indikator</th>
                        <th style="width:46%; padding:5px;">Tolok Ukur</th>
                        <th style="width:46%; padding:5px;">Target Kinerja</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="padding:5px;">Masukan</td>
                        <td style="padding:5px;">{{ $kegiatan[0]->indikatormasuk }}</td>
                        <td style="padding:5px;">
                            @php
                                $total = 0;
                                foreach ($data as $key => $item) {
                                    $total += (float)$item->subtotal;
                                }
                            @endphp
                            Rp. {{ number_format($total,2,',','.') }}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:5px;">Keluaran</td>
                        <td style="padding:5px;">
                            @php
                            $indikatorkeluaran = explode(chr(10), $kegiatan[0]->indikatorkeluaran);            
                            for ($i = 0; $i < count($indikatorkeluaran); $i++) {
                                echo "$indikatorkeluaran[$i]";
                                echo "<br>";
                            }
                            @endphp
                        </td>
                        <td style="padding:5px;">
                            @php
                            $targetkeluaran = explode(chr(10), $kegiatan[0]->targetkeluaran);            
                            for ($i = 0; $i < count($targetkeluaran); $i++) {
                                echo "$targetkeluaran[$i]";
                                echo "<br>";
                            }
                            @endphp
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:5px;">Hasil</td>
                        <td style="padding:5px;">
                            {{ $kegiatan[0]->indikatorhasil }}
                        </td>
                        <td style="padding:5px;">
                            {{ $kegiatan[0]->targethasil }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    
        {{-- data --}}
        <table style="border-top:0;" cellpadding="0" cellspacing="0"  border="0" width="100%" class="tabel">
            <thead>
                <tr>
                    <th style="width:10%; padding:5px;" rowspan="2">No Rekening</th>
                    <th style="width:26%; padding:5px;" rowspan="2">Komponen Biaya</th>
                    <th style="width:27%; padding:5px;" colspan="3">Rincian Biaya</th>
                    <th style="width:37%; padding:5px;" colspan="{{ count($asalproduk) }}">Jumlah Anggaran (Sumber Dana)</th>
                </tr>
                <tr>
                    <th style="width:8.5%; padding:5px;">Jumlah</th>
                    <th style="width:8.5%; padding:5px;">Satuan</th>
                    <th style="width:10%; padding:5px;">Harga Satuan</th>
                    @foreach ($asalproduk as $ap)
                        <th style="padding:5px;">{{ $ap->asalproduk }}</th>
                    @endforeach
                </tr>
            </thead>
            <tbody>
                @php
                    $idmataanggaran = null;
                    $idmataanggaran1 = null;
                    $idmataanggaran2 = null;
                    $idmataanggaran3 = null;
                @endphp
    
                @foreach ($data as $item)
                    
                    @if ($item->idmataanggaran1 && ($item->idmataanggaran1 !== $idmataanggaran1))
                        <tr style="font-weight: bold">
                            <td style="padding:5px;">{{ $item->kodemataanggaran1 }}</td>
                            <td style="padding:5px;">{{ $item->namamataanggaran1 }}</td>
                            <td style="padding:5px;"></td>
                            <td style="padding:5px;"></td>
                            <td style="padding:5px;"></td>
                            @foreach ($asalproduk as $ap)
                                <td style="padding:5px; text-align:right;">
                                    @php
                                        $total1 = 0;
                                        foreach ($data as $key => $dt) {
                                            if($dt->idasalproduk == $ap->id && ($dt->idmataanggaran1 == $item->idmataanggaran1)){
                                                $total1 += (float)$dt->subtotal;
                                            }
                                        }
                                    @endphp
                                    {{ $total1 > 0 ? number_format($total1,0,',','.') : '' }}
                                </td>
                            @endforeach
                        </tr>
                    @endif
    
                    @if ($item->idmataanggaran2 && ($item->idmataanggaran2 !== $idmataanggaran2) && $item->kodemataanggaran1 !== 'III')
                        <tr style="font-weight: bold">
                            <td style="padding:5px;">{{ $item->kodemataanggaran2 }}</td>
                            <td style="padding:5px;">{{ $item->namamataanggaran2 }}</td>
                            <td style="padding:5px;"></td>
                            <td style="padding:5px;"></td>
                            <td style="padding:5px;"></td>
                            @foreach ($asalproduk as $ap)
                                <td style="padding:5px; text-align:right;">
                                    @php
                                        $total2 = 0;
                                        foreach ($data as $key => $dt) {
                                            if($dt->idasalproduk == $ap->id && ($dt->idmataanggaran2 == $item->idmataanggaran2)){
                                                $total2 += (float)$dt->subtotal;
                                            }
                                        }
                                    @endphp
                                    {{ $total2 > 0 ? number_format($total2,0,',','.') : '' }}
                                </td>
                            @endforeach
                        </tr>
                    @endif
    
                    @if ($item->idmataanggaran3 && ($item->idmataanggaran3 !== $idmataanggaran3))
                    
                        <tr style="font-weight: bold">
                            <td style="padding:5px;">{{ $item->kodemataanggaran3 }}</td>
                            <td style="padding:5px;">{{ $item->namamataanggaran3 }}</td>
                            <td style="padding:5px;"></td>
                            <td style="padding:5px;"></td>
                            <td style="padding:5px;"></td>
                            @foreach ($asalproduk as $ap)
                                <td style="padding:5px; text-align:right;">
                                    @php
                                        $total3 = 0;
                                        foreach ($data as $key => $dt) {
                                            if($dt->idasalproduk == $ap->id && ($dt->idmataanggaran3 == $item->idmataanggaran3)){
                                                $total3 += (float)$dt->subtotal;
                                            }
                                        }
                                    @endphp
                                    {{ $total3 > 0 ? number_format($total3,0,',','.') : '' }}
                                </td>
                            @endforeach
                        </tr>
                    @endif
    
                    @if ($item->idmataanggaran && ($item->idmataanggaran !== $idmataanggaran))
                        <tr style="font-weight: bold">
                            <td style="padding:5px;">{{ $item->kodemataanggaran }}</td>
                            <td style="padding:5px;">{{ $item->namamataanggaran }}</td>
                            <td style="padding:5px;"></td>
                            <td style="padding:5px;"></td>
                            <td style="padding:5px;"></td>
                            @foreach ($asalproduk as $ap)
                                <td style="padding:5px; text-align:right;">
                                    @php
                                        $total4 = 0;
                                        foreach ($data as $key => $dt) {
                                            if($dt->idasalproduk == $ap->id && ($dt->idmataanggaran == $item->idmataanggaran)){
                                                $total4 += (float)$dt->subtotal;
                                            }
                                        }
                                    @endphp
                                    {{ $total4 > 0 ? number_format($total4,0,',','.') : '' }}
                                </td>
                            @endforeach
                        </tr>
                    @endif
    
                    <tr>
                        <td style="padding:5px;"></td>
                        <td style="padding:5px;">{{ $item->keteranganbelanja }}</td>
                        <td style="padding:5px; text-align:right;">{{ $item->jml }}</td>
                        <td style="padding:5px; text-align:center;">{{ $item->satuan }}</td>
                        <td style="padding:5px; text-align:right;">{{ number_format($item->hargasatuan,0,',','.') }}</td>
                        @foreach ($asalproduk as $ap)
                            <td style="padding:5px; text-align:right;">
                                @if ($ap->id == $item->idasalproduk)
                                    {{ number_format($item->subtotal,0,',','.') }}
                                @else
                                   
                                @endif
                            </td>
                        @endforeach
                    </tr>
    
                    @php
                        $idmataanggaran = $item->idmataanggaran;
                        $idmataanggaran1 = $item->idmataanggaran1;
                        $idmataanggaran2 = $item->idmataanggaran2;
                        $idmataanggaran3 = $item->idmataanggaran3;
                    @endphp
    
                @endforeach
    
                <tr style="font-weight: bold;">
                    <td colspan="5" style="padding:5px; text-align: center;">Jumlah Total</td>
                    @foreach ($asalproduk as $ap)
                        <td style="padding:5px; text-align:right;">
                            @php
                                $semua = 0;
                                foreach ($data as $key => $dt) {
                                    if($dt->idasalproduk == $ap->id){
                                        $semua += (float)$dt->subtotal;
                                    }
                                }
                            @endphp
                            {{ $semua > 0 ? number_format($semua,0,',','.') : '' }}
                        </td>
                    @endforeach
                </tr>
            </tbody>
        </table>
    
        {{-- tanda tangan --}}
        <table style="width: 100%;">
            <thead>
                <tr>
                    <td style="width:60%; border:none;">
                    </td>
                    <td style="border:none;">
                        <p align="center" style="margin-top: 50px;">
                            Yogyakarta, {{ isset($tanggalcetak) ? $tanggalcetak : '' }}
                        </p>
                    </td>
                </tr>
                <tr>
                    <td style="width:60%; border:none;">
                    </td>
                    <td style="border:none;">
                        <p align="center" style="margin-bottom:50px">
                            Direktur
                        </p>
                    </td>
                </tr>
                <tr>
                    <td style="width:60%; border:none;">
                    </td>
                    <td style="border:none;">
                        <p align="center" style="margin-top: 50px;">
                            {{$settingrba[0]->namalengkap}}
                        </p>
                    </td>
                </tr>
                <tr>
                    <td style="width:60%; border:none;">
                    </td>
                    <td style="border:none;">
                        <p align="center">
                            NIP. {{$settingrba[0]->nippns}}
                        </p>
                    </td>
                </tr>
        </table>
    </div>

    <script>
        window.print()
    </script>
</body>
</html>