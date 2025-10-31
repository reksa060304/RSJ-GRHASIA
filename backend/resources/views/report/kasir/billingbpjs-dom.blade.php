<!DOCTYPE html>
<html>
<head>
    <title>Billing</title>
    <link rel="stylesheet" href="css/style.css">
</head>
 <style>
    @page { margin: 0px; }
    body { 
        margin: 0px;
        font-family: Tahoma, "Trebuchet MS", sans-serif;
        font-size: 9pt;
        padding: 20px;
    }
</style>
<body>
    <table width="100%" style="border-bottom:2px solid black;">
        <tr>
            <td  style="text-align: center;" width="20%" >
                <img src="img/logo_grhasia_com.png" alt="Logo" style="width: 70px; margin: 0 !important;
                padding: 0 !important;">
                <br>
                <span style="font-size: 7pt; font-weight: bold">RS JIWA GRHASIA</span>
                <br>
                <span style="font-size: 8px; font-weight: bold">Daerah Istimewa Yogyakarta</span>
            </td>
            <td style="text-align: center;vertical-align: top" width="80%">
                <b>
                    <span style="font-size: 9pt;">{!! $res['profile']->baris1 !!}</span>
                    <br>
                    <span style="font-size: 10pt;">{!! $res['profile']->baris2 !!}</span>
                    <br>
                    <span style="font-size: 10pt;">{!! strtoupper($res['profile']->namalengkap) !!}</span>
                    <br>
                    <img src="img/aksara_jawa-com.png" alt="Logo" style="width: 140px;">
                    <br>
                    <span style="font-size: 7pt; font-weight: normal">Jalan Kaliurang Km 17 Sleman, Telepon: {!!$res['profile']->fixedphone!!}
                    <br style="margin: 0px">
                    Laman: {!!$res['profile']->website!!}, Surel: {!!$res['profile']->alamatemail!!}
                    </span>

                </b>
            </td>
        </tr>
    </table>
    <table width="100%" style="border-bottom:2px solid black;">
        <tr>
            <td class="text-center">
                <span class="text-judul">RINCIAN BIAYA PELAYANAN</span>
            </td>
        </tr>
    </table>
    <table width="100%">
        <tr>
            <td width="15%">
                <span style="font-size: 9pt;">No. Registrasi</span>
            </td>
            <td width="35%">
                <span style="font-size: 9pt;">:
                    {{ $res['identitas']->noregistrasi }}</span>
            </td>

            <td width="15%">
                <span style="font-size: 9pt;">Unit</span>
            </td>
            <td width="35%">
                <span style="font-size: 9pt;">:
                    {{ $res['identitas']->namadepartemen }}</span>
            </td>
        </tr>
        <tr>

            <td width="15%">
                <span style="font-size: 9pt;">No. RM</span>
            </td>
            <td width="35%">
                <span style="font-size: 9pt;">: {{ $res['identitas']->nocm }}
                </span>
            </td>


            <td width="15%">
                <span style="font-size: 9pt;">Ruang</span>
            </td>
            <td width="35%">
                <span style="font-size: 9pt;">:
                    {{ $res['identitas']->namaruangan }}
                    -
                    {{ $res['identitas']->nobed }}

                </span>
            </td>
        </tr>
        <tr>

            <td width="15%">
                <span style="font-size: 9pt;">Nama Pasien</span>
            </td>
            <td width="35%">
                <span style="font-size: 9pt;">:
                    {{ $res['identitas']->namapasien  }}</span>
            </td>


            <td width="15%">
                <span style="font-size: 9pt;">Kelas</span>
            </td>
            <td width="35%">
                <span style="font-size: 9pt;">:
                    {{ $res['identitas']->namakelas }}</span>
            </td>
        </tr>
        <tr>
            <td width="15%">
                <span style="font-size: 9pt;">Tgl Lahir Pasien</span>
            </td>
            <td width="35%">
                <span style="font-size: 9pt;">:
                    {{ $res['identitas']->tgllahir }}</span>
            </td>
            <td width="15%">
                <span style="font-size: 9pt;">DPJP</span>
            </td>
            <td width="35%">
                <span style="font-size: 9pt;">:
                    {{ $res['identitas']->namalengkap }}</span>
            </td>
        </tr>
        <tr>
            <td width="15%">
                <span style="font-size: 9pt;">Tgl Masuk</span>
            </td>
            <td width="35%">
                <span style="font-size: 9pt;">:
                    {{ date_format(date_create($res['identitas']->tglregistrasi), 'd/m/Y H:i') }}</span>
            </td>

            <td width="15%">
                <span style="font-size: 9pt;">Penjamin</span>
            </td>
            <td width="35%">
                <span style="font-size: 9pt;">:
                    @if ($res['identitas']->namarekanan == null)
                        {{ $res['identitas']->kelompokpasien }}
                    @else
                    {{ $res['identitas']->namarekanan }}
                    @endif
                </span>
            </td>
        </tr>
        <tr>
            
            <td width="15%">
                <span style="font-size: 9pt;">Tgl Pulang</span>
            </td>
            <td width="35%">
                <span style="font-size: 9pt;">:
                    {{ date_format(date_create($res['identitas']->tglpulang), 'd/m/Y H:i') }}</span>
            </td>

            <td width="15%">
                <span style="font-size: 9pt;">No SEP</span>
            </td>
            <td width="35%">
                <span style="font-size: 9pt;">:
                    {{ $res['identitas']->nosep }}</span>
            </td>
        </tr>
        <tr>
            <td width="15%">
                <span style="font-size: 9pt;">Nama Penanggung Jawab</span>
            </td>
            <td width="35%">
                <span style="font-size: 9pt;">:
                    {{ $res['identitas']->penanggungjawab }}</span>
            </td>

            <td width="15%">
                <span style="font-size: 9pt;">No. Invoice</span>
            </td>
            <td width="35%">
                <span style="font-size: 9pt;">:
                    {{ $res['identitas']->noverifikasi }}
                </span>
            </td>
        </tr>
    </table>
    <table width="100%" cellspacing="0" cellpadding="1">
        <tr>
            <th class="th-class text-left">
                <span style="font-size: 9pt;">No</span>
            </th>
            <th class="th-class  text-center">
                <span style="font-size: 9pt;">Tanggal</span>
            </th>
            <th class="th-class text-left">
                <span style="font-size: 9pt;">Deskripsi</span>
            </th>
            {{-- <th class="th-class text-left">
                <span style="font-size: 9pt;">Kelas</span>
            </th> --}}
            <th class="th-class text-left">
                <span style="font-size: 9pt;">Dokter</span>
            </th>
            <th class="th-class  text-center">
                <span style="font-size: 9pt;">Qty</span>
            </th>
            <th class="th-class  text-center">
                <span style="font-size: 9pt;">Tarif</span>
            </th>
            <th class="th-class  text-center">
                <span style="font-size: 9pt;">Diskon</span>
            </th>
            <th class="th-class  text-right">
                <span style="font-size: 9pt;">Sub Total</span>
            </th>
        </tr>
        @php
        $nomor = 1;
        $totaltagihan = 0;
        $totaldiskon = 0;
        $jumlahbill = 0;
        $totaldiklaim = 0;
        @endphp
        @foreach ($res['billing'] as $ruangan)
        <tr style="background: #d6d4d4;">
            <td colspan="9">
                <span class="text-normal bold">
                    <b>   {{ strtoupper($ruangan[0]->namaruangan) }}</b>
                </span>
            </td>

        </tr>
        @foreach ($ruangan->groupBy('jenisproduk') as $item)
            <tr  style="font-style:italic">
                <td colspan="9">
                    <span class="text-normal">
                        <b>     JENIS: {{ strtoupper($item[0]->jenisproduk) }}</b>
                    </span>
                </td>
            </tr>
            @php
                $total = 0;
                $diskon = 0;
            @endphp
            @foreach ($item as $data)
                <tr>
                    <td class="text-top text-left">
                        <span class="text">{{ $nomor }}</span>
                    </td>
                    <td class="text-top text-center">
                        <span class="text">
                            {{ date_format(date_create($data->tglpelayanan), 'd/m/Y') }}</span>
                    </td>
                    <td class="text-top text-left">
                        <span class="text">{{ $data->namaproduk }}</span>
                    </td>
                    {{-- <td class="text-top text-left">
                        <span class="text">{{ $data->namakelas }}</span>
                    </td> --}}
                    @if ($data->penulisresep === null && in_array($data->objectdetailjenisprodukfk, [1965, 2023, 1969, 1970]))
                        <td class="text-top text-left">
                            <span class="text">{{ $data->dokter }}</span>
                        </td>
                    @else
                        <td class="text-top text-left">
                            -
                            {{-- <span class="text">{{ $data->penulisresep }} </span> --}}
                        </td>
                    @endif
                    <td class="text-top text-center">
                        <span class="text">{{ $data->jumlah }}</span>
                    </td>
                    <td class="text-top text-right">
                        <span class="text"> {{ number_format($data->hargasatuan) }}</span>
                    </td>
                    <td class="text-top text-center">
                        <span class="text">{{ number_format($data->diskon) }}</span>
                    </td>
                    <td class="text-top text-right">
                        <span class="text"> {{ number_format($data->total) }}</span>
                    </td>
                </tr>
                @php
                    $nomor = $nomor + 1;
                    $total = $total + $data->total;
                    $diskon = $diskon + $data->diskon;
                @endphp
            @endforeach
            <tr>
                <td class="text-right" colspan="9">
                    <span class="text">
                        {{ number_format($total) }}
                    </span>
                </td>
            </tr>
            @php
                $totaltagihan = $totaltagihan + $total;
                $totaldiskon = $totaldiskon + $diskon;
                $jumlahbill = $totaltagihan - $totaldiskon;
            @endphp
        @endforeach
        @endforeach
        @if (count($res['paket']) > 0)
        
        <tr style="background: #d6d4d4;">
            <td colspan="9">
                <span class=" bold" style="font-size: 9pt;">
                    <b>PAKET</b>
                </span>
            </td>
        </tr>
        @php
        $total = 0;
      
        @endphp
        @foreach ($res['paket'] as $item)
        <tr>
            <td class="text-top text-left">
                <span style="font-size: 9pt;">{{ $nomor }}</span>
            </td>
            <td class="text-top text-center">
                <span style="font-size: 9pt;">
                    {{ date_format(date_create($item->tglpelayanan), 'd/m/Y') }}</span>
            </td>
            <td class="text-top text-left">
                <span style="font-size: 9pt;">{{ $item->namapaket }}</span>
            </td>
            <td class="text-top text-left">
                -
                {{-- <span style="font-size: 9pt;">{{ $item->penulisresep }} </span> --}}
            </td>
            <td class="text-top text-center">
                <span style="font-size: 9pt;">1</span>
            </td>
            <td class="text-top text-right">
                <span style="font-size: 9pt;">{{ number_format($item->hargapaket) }}</span>
            </td>
            <td class="text-top text-center">
                <span style="font-size: 9pt;">{{ number_format(0) }}</span>
            </td>
            <td class="text-top text-right">
                <span style="font-size: 9pt;"> {{ number_format($item->hargapaket) }}</span>
            </td>
        </tr>
        @php
                $nomor = $nomor + 1;
             $total = $total + $item->hargapaket;
        @endphp
        @endforeach
        <tr>
            <td class="text-right" colspan="9">
                <span style="font-size: 9pt;">
                    {{ number_format($total) }}
                </span>
            </td>
        </tr>
    @endif
       
    </table>
    <table width="100%" cellspacing="0" cellpadding="0" style="border-top:2px solid black;">
        <tr>
            <td width="50%"></td>
            <td width="20%" class="text-left">
                <span class="text-biasa">TOTAL TAGIHAN</span>
            </td>
            <td class="text-center">
                <span class="text-biasa">:</span>
            </td>
            <td class="text-right">
                <span class="text-biasa">
                    {{ number_format( $res['total'] ) }}</span>
            </td>
        </tr>
        <!-- <tr>
            <td width="50%"></td>
            <td width="20%" class="text-left">
                <span class="text-biasa">DEPOSIT - UANG MUKA</span>
            </td>
            <td class="text-center">
                <span class="text-biasa">:</span>
            </td>
            <td class="text-right">
                <span class="text-biasa bold">
                    {{ number_format( $res['deposit']) }}</span>
            </td>
        </tr>
        {{-- <tr>
            <td width="50%"></td>
            <td width="20%" class="text-left">
                <span class="text-biasa">DISKON</span>
            </td>
            <td class="text-center">
                <span class="text-biasa">:</span>
            </td>
            <td class="text-right">
                <span class="text-biasa ">
                    {{ number_format($totaldiskon) }}</span>
            </td>
        </tr> --}}
      
        <tr>
            <td width="50%"></td>
            <td width="20%" class="text-left">
                <span class="text-biasa">TOTAL BAYAR </span>
            </td>
            <td class="text-center">
                <span class="text-biasa">:</span>
            </td>
            <td class="text-right">
                <span class="text-biasa">
                    {{ number_format($res['dibayar']) }}</span>
            </td>
        </tr>
        <tr>
            <td width="50%"></td>
            <td width="20%" class="text-left">
                <span class="text-biasa">TOTAL DIKLAIM</span>
            </td>
            <td class="text-center">
                <span class="text-biasa">:</span>
            </td>
            <td class="text-right">
                <span class="text-biasa">
                    {{ number_format( $res['klaim']) }}</span>
            </td>
        </tr>
        <tr>
            <td width="50%"></td>
            <td width="20%" class="text-left">
                <span class="text-biasa">SISA HARUS BAYAR</span>
            </td>
            <td class="text-center">
                <span class="text-biasa">:</span>
            </td>
            <td class="text-right">
                <span class="text-biasa bold">
                    {{ number_format($res['sisa']) }}</span>
            </td>
        </tr> -->
    </table>
    <table width="100%" cellspacing="0" cellpadding="0">
        <tr>
            <td width="100%" class="text-center"><div style="margin: 10px 0;">&nbsp;</div>
            </td>
        </tr>
        <tr>
            <td width="50%" class="text-center">
                <span style="font-size: 9pt; font-weight: bold;" class="text-center"></span>
            </td>
            <td width="50%" class="text-center">
                <span style="font-size: 9pt; font-weight: bold;">{!! $profile->namakota !!},
                    &nbsp;&nbsp;{{ date('d/m/Y') }}</span>
            </td>
        </tr>
        <tr>
            <td width="50%" class="text-center"><span style="font-size: 9pt; font-weight: bold;"></span>
            </td>
            <td width="50%" class="text-center"><span style="font-size: 9pt; font-weight: bold;">Administrasi</span>
            </td>
        </tr>
        <tr>
            <td height="80" valign="bottom" height="100" width="25%" class="text-center">
                <span style="font-size: 9pt; font-weight: bold;">
                    
                </span>
            </td>
            <td height="80" valign="bottom" height="100"width="25%" class="text-center">
                @if ($r['keluser'] == 20 || $r['keluser'] == 52)
                <span class="text-biasa">{{$res['user']}}</span>
                @else
                <span class="text-biasa">{{$res['identitas']->namaclosing}}</span>    
                @endif
            </td>
        </tr>
    </table>
    <table width="100%">
        <tr>
            <td colspan="4" style="padding:0px 30px 0px 30px;">
                <span class="text-normal" style="font-size: 9px;">
                    Print by {{ $res['user'] }} &nbsp;&nbsp;&nbsp;
                    {{ date('d/m/Y H:i') }}
                </span>
            </td>
        </tr>
    </table>
</body>
</html>
