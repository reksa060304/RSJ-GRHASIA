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
        table{
            border-collapse: collapse;
            font-size: 11pt;
        }
        table tr th,td{
            border: 1px solid black;
            padding: .3em;
            overflow: hidden; 
            text-overflow: ellipsis; 
            word-wrap: break-word;
        }
    </style>
</head>
<body>
    <div style="width: 100%">
        <table style="width:100%;">
            <tbody>
                <tr>
                    <td style="padding: 5px; width: 50px;">
                        <p align="center">
                            @if(stripos(\Request::url(), 'localhost') !== FALSE)
                            <img src="{{ asset('img/LOGO GRHASIA.png') }}" style="width: 100%;height=60%;" >
                            @else
                            <img src="{{ asset('service/img/LOGO GRHASIA.png') }}" style="width: 100%;height=60%;" >
                            @endif
                        </p>
                    </td>
                    <td align="center" style="width: 300px;">
                        <b style="font-size: 25px;">
                            RENCANA BISNIS DAN ANGGARAN<br>
                            BADAN LAYANAN UMUM DAERAH<br>
                            RSJ GRHASIA
                        </b>
                    </td>
                    <td align="center" style="width: 50px;">
                        <b style="font-size: 25px;">
                            RBA
                        </b>
                        <br>
                        {{ $kegiatan[0]->tahap }}
                    </td>
                </tr>
                <tr>
                    <td colspan="3">
                        <p align="center" style="margin-top: 10px; margin-bottom:10px">
                            <font style="font-size: 12pt; ">
                                <b>REKAP ANGGARAN TIAP SUB KEGIATAN (JENIS ANGGARAN) <br> TAHUN ANGGARAN {{ $tahun }}</b>
                            </font>
                            <br>
                        </p>
                    </td>
                </tr>
            </tbody>
        </table>

        {{-- kegiatan --}}
        <div style="padding: .5em; border-left:1px solid black; border-right:1px solid black; border-top:1px solid black;">
            <table style="width:100%;">
                <tbody>
                    <tr>
                        <td style="border:none; padding:0;">Program</td>
                        <td style="border:none; padding:0;"> : </td>
                        <td style="border:none; padding:0;"> {{ $kegiatan[0]->kodeprogram }} - {{ $kegiatan[0]->keteranganprogram }}</td>
                    </tr>
                    <tr>
                        <td style="border:none; padding:0;">Kegiatan</td>
                        <td style="border:none; padding:0;"> : </td>
                        <td style="border:none; padding:0;"> {{ $kegiatan[0]->kodekegiatan }} - {{ $kegiatan[0]->keterangankegiatan }}</td>
                    </tr>
                    <tr>
                        <td style="border:none; padding:0;">Sub Kegiatan</td>
                        <td style="border:none; padding:0;"> : </td>
                        <td style="border:none; padding:0;"> {{ $kegiatan[0]->kodesubkegiatan }} - {{ $kegiatan[0]->keterangansubkegiatan }}</td>
                    </tr>
                    <tr>
                        <td style="border:none; padding:0;">Sub Sub Kegiatan</td>
                        <td style="border:none; padding:0;"> : </td>
                        <td style="border:none; padding:0;"> {{ $kegiatan[0]->kodesubsubkegiatan }} - {{ $kegiatan[0]->keterangansubsubkegiatan }}</td>
                    </tr>
                    <tr>
                        <td style="border:none; padding:0;">Waktu Pelaksanaan</td>
                        <td style="border:none; padding:0;"> : </td>
                        <td style="border:none; padding:0;"> {{ $tahun }}</td>
                    </tr>
                    <tr>
                        <td style="border:none; padding:0;">Lokasi Kegiatan</td>
                        <td style="border:none; padding:0;"> : </td>
                        <td style="border:none; padding:0;"> RSJ Grhasia</td>
                    </tr>
                </tbody>
            </table>
        </div>
    
        {{-- indikator tolok ukur target kinerja --}}
        <div>
            <table style="width: 100%;">
                <thead>
                    <tr>
                        <th>Indikator</th>
                        <th>Tolok Ukur</th>
                        <th>Target Kinerja</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Masukan</td>
                        <td>{{ $kegiatan[0]->indikatormasuk }}</td>
                        <td>
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
                        <td>Keluaran</td>
                        <td>
                            @php
                            $indikatorkeluaran = explode(chr(10), $kegiatan[0]->indikatorkeluaran);            
                            for ($i = 0; $i < count($indikatorkeluaran); $i++) {
                                echo "$indikatorkeluaran[$i]";
                                echo "<br>";
                            }
                            @endphp
                        </td>
                        <td>
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
                        <td>Hasil</td>
                        <td>
                            {{ $kegiatan[0]->indikatorhasil }}
                        </td>
                        <td>
                            {{ $kegiatan[0]->targethasil }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    
        {{-- data --}}
        <table style="width: 100%;">
            <thead>
                <tr>
                    <th rowspan="2" colspan="4">No Rekening</th>
                    <th rowspan="2">Komponen Biaya</th>
                    <th colspan="3">Rincian Biaya</th>
                    <th colspan="{{ count($asalproduk) }}">Jumlah Anggaran (Sumber Dana)</th>
                </tr>
                <tr>
                    <th>Jumlah</th>
                    <th>Satuan</th>
                    <th>Harga Satuan</th>
                    @foreach ($asalproduk as $ap)
                        <th>{{ $ap->asalproduk }}</th>
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
                            <td>
                                @php
                                    $split1 = explode('.', $item->kodemataanggaran1);
                                @endphp
                                {{ end($split1) }}
                            </td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>{{ $item->namamataanggaran1 }}</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            @foreach ($asalproduk as $ap)
                                <td style="text-align:right;">
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
                            <td></td>
                            <td>
                                @php
                                    $split2 = explode('.', $item->kodemataanggaran2);
                                @endphp
                                {{ end($split2) }}
                            </td>
                            <td></td>
                            <td></td>
                            <td>{{ $item->namamataanggaran2 }}</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            @foreach ($asalproduk as $ap)
                                <td style="text-align:right;">
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
                            <td></td>
                            <td></td>
                            <td>
                                @php
                                    $split3 = explode('.', $item->kodemataanggaran3);
                                @endphp
                                {{ end($split3) }}
                            </td>
                            <td></td>
                            <td>{{ $item->namamataanggaran3 }}</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            @foreach ($asalproduk as $ap)
                                <td style="text-align:right;">
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
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>
                                @php
                                    $split = explode('.', $item->kodemataanggaran);
                                    $getKode = array_slice($split, -2, 2, true)
                                @endphp
                                {{ array_values($getKode)[0] }}.{{ end($getKode) }}
                            </td>
                            <td>{{ $item->namamataanggaran }}</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            @foreach ($asalproduk as $ap)
                                <td style="text-align:right;">
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
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>{{ $item->keteranganbelanja }}</td>
                        <td style="text-align:right;">{{ $item->jml }}</td>
                        <td style="text-align:center;">{{ $item->satuan }}</td>
                        <td style="text-align:right;">{{ number_format($item->hargasatuan,0,',','.') }}</td>
                        @foreach ($asalproduk as $ap)
                            <td style="text-align:right;">
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
                    <td colspan="8" style="text-align: center;">Jumlah Total</td>
                    @foreach ($asalproduk as $ap)
                        <td style="text-align:right;">
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