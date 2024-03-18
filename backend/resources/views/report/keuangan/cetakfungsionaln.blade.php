<html>
<head>
    <title>
        Report
    </title>
        @if(stripos(\Request::url(), 'localhost') !== FALSE)
         <link href="{{ asset('css/style.css') }}" rel="stylesheet">
        @else
         <link href="{{ asset('service/css/style.css') }}" rel="stylesheet">
        @endif
 
</head>
<style type="text/css" media="print">
    @page {
        size: auto;   /* auto is the initial value */
        margin: 30;  /* this affects the margin in the printer settings */
    }
    @media print {
        div {
            display: block;
            break-inside: avoid;
            
        }
    }
</style>
<style>

    .borderss {
        border-bottom: 1px solid black;
    }

    body {
        font-family: Arial;
    }

    .tabel tr td{
        border: 1px solid black;
    }

    .tabel {
        width: 100%;
        border-collapse: collapse;

    }
</style>
<body style="background-color: #f7f7f7;">
<div align="center" >
    <table bgcolor="#FFFFFF" width="{{$pageWidth}}" >
        <tbody >
            <tr>
                <td align="center" style="width: 200px;">
                    <b style="font-size: 22px;">
                        PEMERINTAH DAERAH DAERAH ISTIMEWA YOGYAKARTA<br>
                        LAPORAN PERTANGGUNGJAWABAN BENDAHARA PENGELUARAN<br>
                        (SPJ BELANJA - FUNGSIONAL)<br>
                    </b>
                </td>
            </tr>
        </tbody>
    </table>
    <table bgcolor="#FFFFFF" width="{{$pageWidth}}" >
        <tbody >
            <tr>
                <td align="left">
                    <p style="text-align: left; font-size: 20px; margin-top:11px; ">SKPD</p>
                </td>
                <td></td>
                <td align="left">
                    <p style="text-align: left; font-size: 20px; margin-top:11px;">: 1.02.2.22.0.00.01.0004-RS Jiwa GRHASIA DINKES DIY</p>
                </td>
            </tr>
            <tr>
                <td align="left">
                    <p style="text-align: left; font-size: 20px; margin-top:-5px;">Kuasa Pengguna Anggaran</p>
                </td>
                <td></td>
                <td align="left">
                    <p style="text-align: left; font-size: 20px; margin-top:-5px;">: dr. Akhmad Akhadi Syamsudhuha, M.P.H</p>
                </td>
            </tr>
            <tr>
                <td align="left">
                    <p style="text-align: left; font-size: 20px; margin-top:-5px;">Bendahara</p>
                </td>
                <td></td>
                <td align="left">
                    <p style="text-align: left; font-size: 20px; margin-top:-5px;">: Paula Sofyanita, SE.</p>
                </td>
            </tr>
            <tr>
                <td align="left">
                    <p style="text-align: left; font-size: 20px; margin-top:-5px;">Tahun Anggaran</p>
                </td>
                <td></td>
                <td align="left">
                    <p style="text-align: left; font-size: 20px; margin-top:-5px;">: {{$tahun}}</p>
                </td>
            </tr>
            <tr>
                <td align="left">
                    <p style="text-align: left; font-size: 20px; margin-top:-5px;">Periode s/d</p>
                </td>
                <td></td>
                <td align="left">
                    <p style="text-align: left; font-size: 20px; margin-top:-5px;">: {{substr($tanggaljudul, 0, -5)}}</p>
                </td>
            </tr>
        </tbody>
    </table>
        <table width="{{$pageWidth}}" bgcolor="#FFFFFF" class="tabel" style="margin-top: 50px;">
                <tr>
                    <td align="center" rowspan="2" width="50" style="padding: 10px; font-weight: bold;font-size: 11px; ">KODE REKENING</td>
                    <td align="center" rowspan="2" width="50" style="padding: 10px; font-weight: bold;font-size: 11px; ">URAIAN</td>
                    <td align="center" rowspan="2" width="200" style="padding: 10px; font-weight: bold; font-size: 11px; ">JUMLAH ANGGARAN</td>
                    <td align="center" colspan="3" width="50" style="padding: 10px; font-weight: bold;font-size: 11px;  ">REALISASI GU/TU/UP/LS</td>
                    <td align="center" rowspan="2" width="50" style="padding: 10px; font-weight: bold ;font-size: 11px; ">SISA ANGGARAN</td>
                    <td align="center" rowspan="2" width="50" style="padding: 10px; font-weight: bold ;font-size: 11px; ">PENGEMBALIAN BELANJA</td>
                    <td align="center" rowspan="2" width="50" style="padding: 10px; font-weight: bold ;font-size: 11px; ">PENGELUARAN BELANJA BERSIH</td>
                </tr>
                <tr>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold;font-size: 11px; ">Bulan lalu</td>
                    <td align="center" width="100" style="padding: 10px; font-weight: bold;font-size: 11px; ">Bulan ini</td>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold; font-size: 11px; ">Jumlah</td>
                </tr>
                @foreach ($allData as $dt)
                @if((strpos($dt->kode, 'I') !== false || strpos($dt->kode, '1') !== false) && strlen($dt->kode) != 6)
                    @if($dt->div == 1 || $dt->div == 2 || $dt->div == 3)
                        <tr>
                            <td align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; ">{{ $dt->kode }}</td>
                            <td align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; ">{{ $dt->text }}</td>
                            <td align="right" width="50" style="font-weight: bold; padding: 10px; font-size: 11px;  ">{{ number_format($dt->subtotal,2,',','.') }}</td>
                            <td align="right" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; ">{{ number_format($dt->totalbulanlalu,2,',','.') }}</td>
                            <td align="right" width="100" style="font-weight: bold; padding: 10px; font-size: 11px; ">{{ number_format($dt->totalbulanini,2,',','.') }}</td>
                            <td align="right" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; ">{{ number_format($dt->totalbulanlalu + $dt->totalbulanini,2,',','.') }}</td>
                            <td align="right" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; ">{{ number_format($dt->subtotal - $dt->totalbulanlalu - $dt->totalbulanini,2,',','.') }}</td>
                            <td align="right" width="100" style="font-weight: bold; padding: 10px; font-size: 11px; ">{{ number_format($dt->jumlahpengembalian,2,',','.') }}</td>
                            <td align="right" width="100" style="font-weight: bold; padding: 10px; font-size: 11px; ">{{ number_format($dt->totalbulanlalu + $dt->totalbulanini - $dt->jumlahpengembalian,2,',','.') }}</td>
                        </tr>
                    @else
                        @if(strpos($dt->kode, 'I') !== false)
                            @php
                                    // Cari posisi titik pertama dalam string kode
                                    $dotPosition = strpos($dt->kode, '.');
                            
                                    // Inisialisasi nilai marginLeft
                                    $marginLeft = 0;
                            
                                    // Jika titik pertama ditemukan dan panjang string lebih dari atau sama dengan 3 karakter setelah titik pertama
                                    if ($dotPosition !== false && strlen($dt->kode) >= ($dotPosition + 2)) {
                                        // Hitung panjang karakter setelah titik pertama
                                        $lengthAfterDot = strlen(substr($dt->kode, $dotPosition + 1));
                            
                                        // Tentukan nilai marginLeft berdasarkan panjang karakter setelah titik pertama
                                        if (($lengthAfterDot >= 1) &&  ($lengthAfterDot <= 2)) {
                                            $marginLeft = 20;
                                        } else if (($lengthAfterDot >= 2) &&  ($lengthAfterDot <= 3)) {
                                            $marginLeft = 30;
                                        } else if (($lengthAfterDot >= 3) &&  ($lengthAfterDot <= 7)) {
                                            $marginLeft = 35;
                                        }
                                        else {
                                            $marginLeft = 35;
                                        }
                                    }
                            @endphp
                            <tr>
                                <td align="left" width="50" style="padding: 10px; font-size: 11px; "></td>
                                <td align="left" width="50" style="padding: 10px; font-size: 11px"><span style="margin-left: {{ $marginLeft }}px;">{{ $dt->kode }}. {{ $dt->text }}</span></td>
                                {{-- <td align="left" width="50" style="padding: 10px; font-size: 11px; ">{{ $dt->kode }}. {{ $dt->text }}</td> --}}
                                <td align="right" width="50" style="padding: 10px; font-size: 11px;  ">{{ number_format($dt->subtotal,2,',','.') }}</td>
                                <td align="right" width="50" style="padding: 10px; font-size: 11px; ">{{ number_format($dt->totalbulanlalu,2,',','.') }}</td>
                                <td align="right" width="100" style="padding: 10px; font-size: 11px; ">{{ number_format($dt->totalbulanini,2,',','.') }}</td>
                                <td align="right" width="50" style="padding: 10px; font-size: 11px; ">{{ number_format($dt->totalbulanlalu + $dt->totalbulanini,2,',','.') }}</td>
                                <td align="right" width="50" style="padding: 10px; font-size: 11px; ">{{ number_format($dt->subtotal - $dt->totalbulanlalu - $dt->totalbulanini,2,',','.') }}</td>
                                <td align="right" width="100" style="padding: 10px; font-size: 11px; ">{{ number_format($dt->jumlahpengembalian,2,',','.') }}</td>
                                <td align="right" width="100" style="padding: 10px; font-size: 11px; ">{{ number_format($dt->totalbulanlalu + $dt->totalbulanini - $dt->jumlahpengembalian,2,',','.') }}</td>
                            </tr>
                        @else
                            <tr>
                                <td align="left" width="50" style="padding: 10px; font-size: 11px; ">{{ $dt->kode }}</td>
                                <td align="left" width="50" style="padding: 10px; font-size: 11px; ">{{ $dt->text }}</td>
                                <td align="right" width="50" style="padding: 10px; font-size: 11px;  ">{{ number_format($dt->subtotal,2,',','.') }}</td>
                                <td align="right" width="50" style="padding: 10px; font-size: 11px; ">{{ number_format($dt->totalbulanlalu,2,',','.') }}</td>
                                <td align="right" width="100" style="padding: 10px; font-size: 11px; ">{{ number_format($dt->totalbulanini,2,',','.') }}</td>
                                <td align="right" width="50" style="padding: 10px; font-size: 11px; ">{{ number_format($dt->totalbulanlalu + $dt->totalbulanini,2,',','.') }}</td>
                                <td align="right" width="50" style="padding: 10px; font-size: 11px; ">{{ number_format($dt->subtotal - $dt->totalbulanlalu - $dt->totalbulanini,2,',','.') }}</td>
                                <td align="right" width="100" style="padding: 10px; font-size: 11px; ">{{ number_format($dt->jumlahpengembalian,2,',','.') }}</td>
                                <td align="right" width="100" style="padding: 10px; font-size: 11px; ">{{ number_format($dt->totalbulanlalu + $dt->totalbulanini - $dt->jumlahpengembalian,2,',','.') }}</td>
                            </tr>
                        @endif
                    @endif    
                    
                @else
                    @if($dt->text == 'STS' || $dt->text == 'PENERIMAAN:' || $dt->text == 'PPN:' || $dt->text == 'PPh:' ||  $dt->text == 'Transfer Bendahara Penerima' || $dt->text == 'Jasa Giro' || $dt->text == 'Potongan Pajak' || $dt->text == 'JUMLAH PENERIMAAN:' || $dt->text == 'PENGELUARAN:' || $dt->text == 'SPJ' || $dt->text == 'Jasa Giro' || $dt->text == 'Penyetoran Pajak' || $dt->text == 'JUMLAH PENGELUARAN:' || $dt->text == 'SALDO KAS')
                        @if($dt->text == 'STS' || $dt->text == 'Transfer Bendahara Penerima' || $dt->text == 'Jasa Giro' || $dt->text == 'Potongan Pajak' || $dt->text == 'PPN:' || $dt->text == 'PPh:' || $dt->text == 'SPJ' || $dt->text == 'Jasa Giro' || $dt->text == 'Penyetoran Pajak')
                            <tr>
                                <td colspan="2" align="left" width="50" style="font-weight: bold; padding: 10px; padding-left: 30px; font-size: 11px; ">{{ $dt->text }}</td>
                                <td align="right" width="50" style="font-weight: bold; padding: 10px; padding-left: 30px; font-size: 11px;  ">{{ number_format($dt->subtotal,2,',','.') }}</td>
                                <td align="right" width="50" style="font-weight: bold; padding: 10px; padding-left: 30px; font-size: 11px; ">{{ number_format($dt->totalbulanlalu,2,',','.') }}</td>
                                <td align="right" width="100" style="font-weight: bold; padding: 10px; padding-left: 30px; font-size: 11px; ">{{ number_format($dt->totalbulanini,2,',','.') }}</td>
                                <td align="right" width="50" style="font-weight: bold; padding: 10px; padding-left: 30px; font-size: 11px; ">{{ number_format($dt->totalbulanlalu + $dt->totalbulanini,2,',','.') }}</td>
                                <td align="right" width="50" style="font-weight: bold; padding: 10px; padding-left: 30px; font-size: 11px; ">{{ number_format($dt->subtotal - $dt->totalbulanlalu - $dt->totalbulanini,2,',','.') }}</td>
                                <td align="right" width="100" style="font-weight: bold; padding: 10px; padding-left: 30px; font-size: 11px; "></td>
                                <td align="right" width="100" style="font-weight: bold; padding: 10px; padding-left: 30px; font-size: 11px; "></td>
                            </tr>
                        @else
                            @if($dt->text == 'PENERIMAAN:' || $dt->text == 'PENGELUARAN:')
                                <tr>
                                    <td colspan="2" align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; ">{{ $dt->text }}</td>
                                    <td align="right" width="50" style="font-weight: bold; padding: 10px; font-size: 11px;  "></td>
                                    <td align="right" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                                    <td align="right" width="100" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                                    <td align="right" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                                    <td align="right" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                                    <td align="right" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                                    <td align="right" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                                </tr>
                            @else
                                <tr>
                                    <td colspan="2" align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; ">{{ $dt->text }}</td>
                                    <td align="right" width="50" style="font-weight: bold; padding: 10px; font-size: 11px;  ">{{ number_format($dt->subtotal,2,',','.') }}</td>
                                    <td align="right" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; ">{{ number_format($dt->totalbulanlalu,2,',','.') }}</td>
                                    <td align="right" width="100" style="font-weight: bold; padding: 10px; font-size: 11px; ">{{ number_format($dt->totalbulanini,2,',','.') }}</td>
                                    <td align="right" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; ">{{ number_format($dt->totalbulanlalu + $dt->totalbulanini,2,',','.') }}</td>
                                    <td align="right" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; ">{{ number_format($dt->subtotal - $dt->totalbulanlalu - $dt->totalbulanini,2,',','.') }}</td>
                                    <td align="right" width="100" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                                    <td align="right" width="100" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                                </tr>
                            @endif
                        @endif
                    @else
                        @if(strpos($dt->kode, 'I') !== false)
                        <tr>
                            <td align="left" width="50" style="padding: 10px; font-size: 11px; "></td>
                            <td align="left" width="50" style="padding: 10px; font-size: 11px; ">{{ $dt->kode }}. {{ $dt->text }}</td>
                            <td align="right" width="50" style="padding: 10px; font-size: 11px;  ">{{ number_format($dt->subtotal,2,',','.') }}</td>
                            <td align="right" width="50" style="padding: 10px; font-size: 11px; ">{{ number_format($dt->totalbulanlalu,2,',','.') }}</td>
                            <td align="right" width="100" style="padding: 10px; font-size: 11px; ">{{ number_format($dt->totalbulanini,2,',','.') }}</td>
                            <td align="right" width="50" style="padding: 10px; font-size: 11px; ">{{ number_format($dt->totalbulanlalu + $dt->totalbulanini,2,',','.') }}</td>
                            <td align="right" width="50" style="padding: 10px; font-size: 11px; ">{{ number_format($dt->subtotal - $dt->totalbulanlalu - $dt->totalbulanini,2,',','.') }}</td>
                            <td align="right" width="100" style="padding: 10px; font-size: 11px; "></td>
                            <td align="right" width="100" style="padding: 10px; font-size: 11px; "></td>
                        </tr>
                        @else
                        <tr>
                            <td align="left" width="50" style="padding: 10px; font-size: 11px; "></td>
                            <td align="left" width="50" style="padding: 10px; font-size: 11px; ">{{ $dt->text }}</td>
                            <td align="right" width="50" style="padding: 10px; font-size: 11px;  ">{{ number_format($dt->subtotal,2,',','.') }}</td>
                            <td align="right" width="50" style="padding: 10px; font-size: 11px; ">{{ number_format($dt->totalbulanlalu,2,',','.') }}</td>
                            <td align="right" width="100" style="padding: 10px; font-size: 11px; ">{{ number_format($dt->totalbulanini,2,',','.') }}</td>
                            <td align="right" width="50" style="padding: 10px; font-size: 11px; ">{{ number_format($dt->totalbulanlalu + $dt->totalbulanini,2,',','.') }}</td>
                            <td align="right" width="50" style="padding: 10px; font-size: 11px; ">{{ number_format($dt->subtotal - $dt->totalbulanlalu - $dt->totalbulanini,2,',','.') }}</td>
                            <td align="right" width="100" style="padding: 10px; font-size: 11px; "></td>
                            <td align="right" width="100" style="padding: 10px; font-size: 11px; "></td>
                        </tr>
                        @endif
                    @endif
                @endif
                @endforeach
        </table>
       

        <table width="{{$pageWidth}}" bgcolor="#FFFFFF" class="tabel" style="margin-top: 50px;">
            <tr>
                <td align="center" rowspan="2" width="50" style="padding: 10px; font-weight: bold;font-size: 11px; ">KODE REKENING</td>
                <td align="center" rowspan="2" width="50" style="padding: 10px; font-weight: bold;font-size: 11px; ">URAIAN</td>
                <td align="center" rowspan="2" width="200" style="padding: 10px; font-weight: bold; font-size: 11px; ">JUMLAH ANGGARAN</td>
                <td align="center" colspan="3" width="50" style="padding: 10px; font-weight: bold;font-size: 11px;  ">REALISASI GU/TU/UP/LS</td>
                <td align="center" rowspan="2" width="50" style="padding: 10px; font-weight: bold ;font-size: 11px; ">SISA ANGGARAN</td>
                <td align="center" rowspan="2" width="50" style="padding: 10px; font-weight: bold ;font-size: 11px; ">PENGEMBALIAN BELANJA</td>
                <td align="center" rowspan="2" width="50" style="padding: 10px; font-weight: bold ;font-size: 11px; ">PENGELUARAN BELANJA BERSIH</td>
            </tr>
            <tr>
                <td align="center" width="50" style="padding: 10px; font-weight: bold;font-size: 11px; ">Bulan lalu</td>
                <td align="center" width="100" style="padding: 10px; font-weight: bold;font-size: 11px; ">Bulan ini</td>
                <td align="center" width="50" style="padding: 10px; font-weight: bold; font-size: 11px; ">Jumlah</td>
            </tr>
            <tr>
                <td  colspan="2" align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
            </tr>
            <tr>
                <td  colspan="2" align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; ">PENERIMAAN :</td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
            </tr>
            <tr>
                <td  colspan="2" align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; ">- Transfer Bendahara Penerima :</td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; ">Rp.{{number_format($tfBp[0]->totalbulanlalu,2,',','.')}}</td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; ">Rp.{{number_format($tfBp[0]->totalbulanini,2,',','.')}}</td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; ">Rp. {{ number_format($tfBp[0]->totalbulanlalu + $tfBp[0]->totalbulanini,2,',','.') }}</td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
            </tr>
            <tr>
                <td  colspan="2" align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; ">- Jasa Giro :</td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                <td align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px;">
                    @if(!empty($jGiro[0]->totalbulanlalu))
                        Rp.{{ number_format($jGiro[0]->totalbulanlalu, 2, ',', '.') }}
                    @else
                        Rp.0
                    @endif
                </td>
                <td align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px;">
                    @if(!empty($jGiro[0]->totalbulanini))
                        Rp.{{ number_format($jGiro[0]->totalbulanini, 2, ',', '.') }}
                    @else
                        Rp.0
                    @endif
                </td>
                <td align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px;">
                    @if(!empty($jGiro[0]->totalbulanlalu) && !empty($jGiro[0]->totalbulanini))
                        Rp. {{ number_format($jGiro[0]->totalbulanlalu + $jGiro[0]->totalbulanini, 2, ',', '.') }}
                    @else
                        Rp. 0
                    @endif
                </td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
            </tr>
            <tr>
                <td  colspan="2" align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; ">- Potongan Pajak :</td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                <td align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px;">
                    Rp.{{ isset($potonganPajak[0]->totalbulanlalu) ? number_format($potonganPajak[0]->totalbulanlalu, 2, ',', '.') : '0' }}
                </td>
                <td align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px;">
                    Rp.{{ isset($potonganPajak[0]->totalbulanini) ? number_format($potonganPajak[0]->totalbulanini, 2, ',', '.') : '0' }}
                </td>
                <td align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px;">
                    Rp.{{ isset($potonganPajak[0]->totalbulanlalu) && isset($potonganPajak[0]->totalbulanini) ? number_format($potonganPajak[0]->totalbulanlalu + $potonganPajak[0]->totalbulanini, 2, ',', '.') : '0' }}
                </td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
            </tr>
            <tr>
                <td  colspan="2" align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "><span style="padding-left:20px;"></span> a. PPN :</td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                <td align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px;">
                    Rp.{{ isset($PPN[0]->totalbulanlalu) ? number_format($PPN[0]->totalbulanlalu, 2, ',', '.') : '0' }}
                </td>
                <td align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px;">
                    Rp.{{ isset($PPN[0]->totalbulanini) ? number_format($PPN[0]->totalbulanini, 2, ',', '.') : '0' }}
                </td>
                <td align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px;">
                    Rp.{{ isset($PPN[0]->totalbulanlalu) && isset($PPN[0]->totalbulanini) ? number_format($PPN[0]->totalbulanlalu + $PPN[0]->totalbulanini, 2, ',', '.') : '0' }}
                </td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
            </tr>
            <tr>
                <td  colspan="2" align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "><span style="padding-left:20px;"></span> b. PPh 21 :</td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                <td align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px;">
                    Rp.{{ isset($PPH1[1]->totalbulanlalu) ? number_format($PPH1[1]->totalbulanlalu, 2, ',', '.') : '0' }}
                </td>
                <td align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px;">
                    Rp.{{ isset($PPH1[1]->totalbulanini) ? number_format($PPH1[1]->totalbulanini, 2, ',', '.') : '0' }}
                </td>
                <td align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px;">
                    Rp.{{ isset($PPH1[1]->totalbulanlalu) && isset($PPH1[1]->totalbulanini) ? number_format($PPH1[1]->totalbulanlalu + $PPH1[1]->totalbulanini, 2, ',', '.') : '0' }}
                </td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
            </tr>
            <tr>
                <td  colspan="2" align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "><span style="padding-left:20px;"></span> c. PPh 22 :</td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                <td align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px;">
                    Rp.{{ isset($PPH1[2]->totalbulanlalu) ? number_format($PPH1[2]->totalbulanlalu, 2, ',', '.') : '0' }}
                </td>
                <td align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px;">
                    Rp.{{ isset($PPH1[2]->totalbulanini) ? number_format($PPH1[2]->totalbulanini, 2, ',', '.') : '0' }}
                </td>
                <td align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px;">
                    Rp.{{ isset($PPH1[2]->totalbulanlalu) && isset($PPH1[2]->totalbulanini) ? number_format($PPH1[2]->totalbulanlalu + $PPH1[2]->totalbulanini, 2, ',', '.') : '0' }}
                </td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
            </tr>
            <tr>
                <td  colspan="2" align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "><span style="padding-left:20px;"></span> d. PPh 23 :</td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                <td align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px;">
                    Rp.{{ isset($PPH1[4]->totalbulanlalu) ? number_format($PPH1[4]->totalbulanlalu, 2, ',', '.') : '0' }}
                </td>
                <td align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px;">
                    Rp.{{ isset($PPH1[4]->totalbulanini) ? number_format($PPH1[4]->totalbulanini, 2, ',', '.') : '0' }}
                </td>
                <td align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px;">
                    Rp.{{ isset($PPH1[4]->totalbulanlalu) && isset($PPH1[4]->totalbulanini) ? number_format($PPH1[4]->totalbulanlalu + $PPH1[4]->totalbulanini, 2, ',', '.') : '0' }}
                </td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
            </tr>
            <tr>
                <td  colspan="2" align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "><span style="padding-left:20px;"></span> e. PPh 4 (2) :</td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                <td align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px;">
                    Rp.{{ isset($PPH1[3]->totalbulanlalu) ? number_format($PPH1[3]->totalbulanlalu, 2, ',', '.') : '0' }}
                </td>
                <td align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px;">
                    Rp.{{ isset($PPH1[3]->totalbulanini) ? number_format($PPH1[3]->totalbulanini, 2, ',', '.') : '0' }}
                </td>
                <td align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px;">
                    Rp.{{ isset($PPH1[3]->totalbulanlalu) && isset($PPH1[3]->totalbulanini) ? number_format($PPH1[3]->totalbulanlalu + $PPH1[3]->totalbulanini, 2, ',', '.') : '0' }}
                </td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
            </tr>
            <tr>
                <td  colspan="2" align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; ">JUMLAH PENERIMAAN :</td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                <td align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px;">
                    Rp.{{ isset($jmlPenerimaan[0]->totalbulanlalu) ? number_format($jmlPenerimaan[0]->totalbulanlalu, 2, ',', '.') : '0' }}
                </td>
                <td align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px;">
                    Rp.{{ isset($jmlPenerimaan[0]->totalbulanini) ? number_format($jmlPenerimaan[0]->totalbulanini, 2, ',', '.') : '0' }}
                </td>
                <td align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px;">
                    Rp.{{ isset($jmlPenerimaan[0]->totalbulanlalu) && isset($jmlPenerimaan[0]->totalbulanini) ? number_format($jmlPenerimaan[0]->totalbulanlalu + $jmlPenerimaan[0]->totalbulanini, 2, ',', '.') : '0' }}
                </td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
            </tr>
            <tr>
                <td  colspan="2" align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; ">PENGELUARAN :</td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
            </tr>
            <tr>
                <td  colspan="2" align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; ">- SPJ :</td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                <td align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px;">
                    Rp.{{ isset($SPJ[0]->totalbulanlalu) ? number_format($SPJ[0]->totalbulanlalu, 2, ',', '.') : '0' }}
                </td>
                <td align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px;">
                    Rp.{{ isset($SPJ[0]->totalbulanini) ? number_format($SPJ[0]->totalbulanini, 2, ',', '.') : '0' }}
                </td>
                <td align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px;">
                    Rp.{{ isset($SPJ[0]->totalbulanlalu) && isset($SPJ[0]->totalbulanini) ? number_format($SPJ[0]->totalbulanlalu + $SPJ[0]->totalbulanini, 2, ',', '.') : '0' }}
                </td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
            </tr>
            <tr>
                <td  colspan="2" align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; ">- Jasa Giro :</td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                <td align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px;">
                    Rp.{{ isset($jGiro[0]->totalbulanlalu) ? number_format($jGiro[0]->totalbulanlalu, 2, ',', '.') : '0' }}
                </td>
                <td align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px;">
                    Rp.{{ isset($jGiro[0]->totalbulanini) ? number_format($jGiro[0]->totalbulanini, 2, ',', '.') : '0' }}
                </td>
                <td align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px;">
                    Rp.{{ isset($jGiro[0]->totalbulanlalu) && isset($jGiro[0]->totalbulanini) ? number_format($jGiro[0]->totalbulanlalu + $jGiro[0]->totalbulanini, 2, ',', '.') : '0' }}
                </td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
            </tr>
            <tr>
                <td  colspan="2" align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; ">- Penyetoran Pajak :</td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                <td align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px;">
                    Rp.{{ isset($potonganPajak[0]->totalbulanlalu) ? number_format($potonganPajak[0]->totalbulanlalu, 2, ',', '.') : '0' }}
                </td>
                <td align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px;">
                    Rp.{{ isset($potonganPajak[0]->totalbulanini) ? number_format($potonganPajak[0]->totalbulanini, 2, ',', '.') : '0' }}
                </td>
                <td align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px;">
                    Rp.{{ isset($potonganPajak[0]->totalbulanlalu) && isset($potonganPajak[0]->totalbulanini) ? number_format($potonganPajak[0]->totalbulanlalu + $potonganPajak[0]->totalbulanini, 2, ',', '.') : '0' }}
                </td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
            </tr>
            <tr>
                <td  colspan="2" align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "><span style="padding-left:20px;"></span> a. PPN :</td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                <td align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px;">
                    Rp.{{ isset($PPN[0]->totalbulanlalu) ? number_format($PPN[0]->totalbulanlalu, 2, ',', '.') : '0' }}
                </td>
                <td align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px;">
                    Rp.{{ isset($PPN[0]->totalbulanini) ? number_format($PPN[0]->totalbulanini, 2, ',', '.') : '0' }}
                </td>
                <td align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px;">
                    Rp.{{ isset($PPN[0]->totalbulanlalu) && isset($PPN[0]->totalbulanini) ? number_format($PPN[0]->totalbulanlalu + $PPN[0]->totalbulanini, 2, ',', '.') : '0' }}
                </td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
            </tr>
            <tr>
                <td  colspan="2" align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "><span style="padding-left:20px;"></span> b. PPh 21 :</td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                <td align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px;">
                    Rp.{{ isset($PPH2[1]->totalbulanlalu) ? number_format($PPH2[1]->totalbulanlalu, 2, ',', '.') : '0' }}
                </td>
                <td align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px;">
                    Rp.{{ isset($PPH2[1]->totalbulanini) ? number_format($PPH2[1]->totalbulanini, 2, ',', '.') : '0' }}
                </td>
                <td align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px;">
                    Rp.{{ isset($PPH2[1]->totalbulanlalu) && isset($PPH2[1]->totalbulanini) ? number_format($PPH2[1]->totalbulanlalu + $PPH2[1]->totalbulanini, 2, ',', '.') : '0' }}
                </td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
            </tr>
            <tr>
                <td  colspan="2" align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "><span style="padding-left:20px;"></span> c. PPh 22 :</td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                <td align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px;">
                    Rp.{{ isset($PPH2[3]->totalbulanlalu) ? number_format($PPH2[3]->totalbulanlalu, 2, ',', '.') : '0' }}
                </td>
                <td align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px;">
                    Rp.{{ isset($PPH2[3]->totalbulanini) ? number_format($PPH2[3]->totalbulanini, 2, ',', '.') : '0' }}
                </td>
                <td align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px;">
                    Rp.{{ isset($PPH2[3]->totalbulanlalu) && isset($PPH2[3]->totalbulanini) ? number_format($PPH2[3]->totalbulanlalu + $PPH2[3]->totalbulanini, 2, ',', '.') : '0' }}
                </td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
            </tr>
            <tr>
                <td  colspan="2" align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "><span style="padding-left:20px;"></span> d. PPh 23 :</td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                <td align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px;">
                    Rp.{{ isset($PPH2[0]->totalbulanlalu) ? number_format($PPH2[0]->totalbulanlalu, 2, ',', '.') : '0' }}
                </td>
                <td align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px;">
                    Rp.{{ isset($PPH2[0]->totalbulanini) ? number_format($PPH2[0]->totalbulanini, 2, ',', '.') : '0' }}
                </td>
                <td align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px;">
                    Rp.{{ isset($PPH2[0]->totalbulanlalu) && isset($PPH2[0]->totalbulanini) ? number_format($PPH2[0]->totalbulanlalu + $PPH2[0]->totalbulanini, 2, ',', '.') : '0' }}
                </td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
            </tr>
            <tr>
                <td  colspan="2" align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "><span style="padding-left:20px;"></span> e. PPh 4 (2) :</td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                <td align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px;">
                    Rp.{{ isset($PPH2[2]->totalbulanlalu) ? number_format($PPH2[2]->totalbulanlalu, 2, ',', '.') : '0' }}
                </td>
                <td align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px;">
                    Rp.{{ isset($PPH2[2]->totalbulanini) ? number_format($PPH2[2]->totalbulanini, 2, ',', '.') : '0' }}
                </td>
                <td align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px;">
                    Rp.{{ isset($PPH2[2]->totalbulanlalu) && isset($PPH2[2]->totalbulanini) ? number_format($PPH2[2]->totalbulanlalu + $PPH2[2]->totalbulanini, 2, ',', '.') : '0' }}
                </td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
            </tr>
            {{-- <tr>
                <td  colspan="2" align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; ">- Pengembalian Belanja :</td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
            </tr> --}}
            <tr>
                <td  colspan="2" align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; ">JUMLAH PENGELUARAN :</td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                <td align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px;">
                    Rp.{{ isset($jmlPengeluaran[0]->totalbulanlalu) ? number_format($jmlPengeluaran[0]->totalbulanlalu, 2, ',', '.') : '0' }}
                </td>
                <td align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px;">
                    Rp.{{ isset($jmlPengeluaran[0]->totalbulanini) ? number_format($jmlPengeluaran[0]->totalbulanini, 2, ',', '.') : '0' }}
                </td>
                <td align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px;">
                    Rp.{{ isset($jmlPengeluaran[0]->totalbulanlalu) && isset($jmlPengeluaran[0]->totalbulanini) ? number_format($jmlPengeluaran[0]->totalbulanlalu + $jmlPengeluaran[0]->totalbulanini, 2, ',', '.') : '0' }}
                </td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
                <td   align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 11px; "></td>
            </tr>
        </table>

        <table style="width: 100%; margin-top:50px; padding:0px; font-weight:bold; font-size:13px;" bgcolor="#FFFFFF">
            <tr>
                <td style="width: 5%;">SALDO KAS BLUD</td>
                <td style="width: 5%;"></td>
                <td align="center">Mengetahu</td>
                <td align="center">Yogyakarta, Januari 2024</td>
                <td></td>
            </tr>
            <tr>
                <td>Terdiri Dari :</td>
                <td></td>
                <td align="center">Pimpinan BLUD</td>
                <td align="center">Bendahara Pengeluaran BLUD</td>
                <td></td>
            </tr>
            <tr>
                <td>- Tunai : </td>
                <td style="text-align: right">Rp. </td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td>- Sisa Bank : </td>
                <td style="text-align: right">Rp. {{number_format($saldoKasBuld[0]->jml_sisa_bank,2,',','.')}}</td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td>- Surat Berharga : </td>
                <td style="text-align: right">Rp. </td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td>- Uang Muka Kerja : </td>
                <td style="text-align: right">Rp. {{number_format($saldoKasBuld[0]->jml_uang_muka_kerja,2,',','.')}}</td>
                <td align="center">dr. Akhmad Akhadi Syamsudhuha, M.P.H</td>
                <td align="center">Paula Sofyanita, SE.</td>
                <td></td>
            </tr>
            <tr>
                <td colspan="2">_______________________________________________________</td>
                <td align="center">NIP. 19680714 200011 1 002</td>
                <td align="center">NIP. 19910622 201502 2 002</td>
                <td></td>
            </tr>
            <tr>
                <td>Jumlah : </td>
                <td style="text-align: right">Rp.{{number_format($saldoKasBuld[0]->jml_total_saldo,2,',','.')}}</td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
        </table>
</div>
<script>
    window.print()
</script>
</body>
</html>