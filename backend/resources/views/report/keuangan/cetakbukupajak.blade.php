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
<body style="background-color: #CCCCCC;">
<div align="center" >
    <table bgcolor="#FFFFFF" width="{{$pageWidth}}" >
        <tbody >
            <tr>
                <td align="center" style="width: 200px;">
                @if($sumberdana == 15)
                    <b style="font-size: 22px;">
                        APBD<br>
                        00.139.762.9-542.000
                    </b>
                @else
                    <b style="font-size: 22px;">
                        BLUD<br>
                        00.139.762.9-542.000
                    </b>
                @endif
                </td>
            </tr>
        </tbody>
    </table>
        <table width="{{$pageWidth}}" bgcolor="#FFFFFF" class="tabel" style="margin-top: 50px;">
                <tr>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold; font-size: 15px; ">No.</td>
                    <td align="center" width="200" style="padding: 10px; font-weight: bold;font-size: 15px; ">Tgl Setor</td>
                    <td align="center" width="200" style="padding: 10px; font-weight: bold; font-size: 15px; ">Uraian</td>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold; font-size: 15px; ">PPh21</td>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold; font-size: 15px; ">PPh22</td>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold;font-size: 15px;  ">PPh23</td>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold ;font-size: 15px; ">PPh4(2)</td>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold ;font-size: 15px; ">PPN</td>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold ;font-size: 15px; ">Jumlah</td>
                </tr>

                <!-- APBD -->

                @php 
                    $jumlahpph21 = 0;
                    $jumlahpph22 = 0;
                    $jumlahpph23 = 0;
                    $jumlahpph4 = 0;
                    $jumlahppn = 0;
                @endphp 

                
                @if($sumberdana == 15)
                    @php 
                    $jumlahpph21 += 85800863;
                    @endphp 
                @endif
                
                
                @if($sumberdana == 15)
                <tr>
                    <td align="center" width="50" style="padding: 10px; font-size: 15px; ">1</td>
                    <td align="center" width="200" style="padding: 10px; font-size: 15px; ">01-09-{{$tahunjudul}}</td>
                    <td align="left" width="200" style="padding: 10px; font-size: 15px; ">Rumah Sakit Jiwa Grhasia Provinsi DIY</td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px; ">{{ number_format(854303,2,',','.') }}</td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "></td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px; "></td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px;  "></td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px; "></td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px; "></td>
                </tr>
                <tr>
                    <td align="center" width="50" style="padding: 10px; font-size: 15px; "></td>
                    <td align="center" width="200" style="padding: 10px; font-size: 15px; "></td>
                    <td align="left" width="200" style="padding: 10px; font-size: 15px; ">Pembayaran Gaji Rutin Pegawai  bulan September 2022</td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px; "></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "></td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px; "></td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px;  "></td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px; "></td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px; "></td>
                </tr>
                <tr>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px; "></td>
                    <td align="left" width="50" style="padding: 10px; font-size: 15px; ">ID BILLING PPh21</td>
                    <td align="left" width="200" style="padding: 10px; font-size: 15px; ">0267 5373 3114 026</td>
                    <td align="left" width="200" style="padding: 10px; font-size: 15px; "></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "></td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px; "></td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px;  "></td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px; "></td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px; "></td>
                </tr>
                <tr>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px; "></td>
                    <td align="left" width="50" style="padding: 10px; font-size: 15px; ">NTPN</td>
                    <td align="left" width="200" style="padding: 10px; font-size: 15px; ">D13A674498UFCE5A</td>
                    <td align="left" width="200" style="padding: 10px; font-size: 15px; "></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "></td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px; "></td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px;  "></td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px; "></td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px; "></td>
                </tr>

                <tr>
                    <td align="center" width="50" style="padding: 10px; font-size: 15px; ">2</td>
                    <td align="center" width="200" style="padding: 10px; font-size: 15px; ">08-{{$bulan}}-{{$tahunjudul}}</td>
                    <td align="left" width="200" style="padding: 10px; font-size: 15px; ">Rumah Sakit Jiwa Grhasia Provinsi DIY</td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px; ">{{ number_format(84946560,2,',','.') }}</td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "></td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px; "></td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px;  "></td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px; "></td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px; "></td>
                </tr>
                <tr>
                    <td align="center" width="50" style="padding: 10px; font-size: 15px; "></td>
                    <td align="center" width="200" style="padding: 10px; font-size: 15px; "></td>
                    <td align="left" width="200" style="padding: 10px; font-size: 15px; ">Pembayaran TPP PNS bulan Agustus 2022</td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px; "></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "></td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px; "></td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px;  "></td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px; "></td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px; "></td>
                </tr>
                <tr>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px; "></td>
                    <td align="left" width="50" style="padding: 10px; font-size: 15px; ">ID BILLING PPh21</td>
                    <td align="left" width="200" style="padding: 10px; font-size: 15px; ">0268 5728 4131 120</td>
                    <td align="left" width="200" style="padding: 10px; font-size: 15px; "></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "></td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px; "></td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px;  "></td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px; "></td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px; "></td>
                </tr>
                <tr>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px; "></td>
                    <td align="left" width="50" style="padding: 10px; font-size: 15px; ">NTPN</td>
                    <td align="left" width="200" style="padding: 10px; font-size: 15px; ">BDB550T5TFBQFM9G</td>
                    <td align="left" width="200" style="padding: 10px; font-size: 15px; "></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "></td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px; "></td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px;  "></td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px; "></td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px; "></td>
                </tr>
                @endif
                
                @foreach ($data as $dt)
                @php 
                    $jumlahpph21 += $dt->pph21;
                    $jumlahpph22 += $dt->pph22;
                    $jumlahpph23 += $dt->pph23;
                    $jumlahpph4 += $dt->pph4;
                    $jumlahppn += $dt->ppn;
                @endphp 
                <tr>
                    @if($sumberdana == 15)
                    <td align="center" width="50" style="padding: 10px; font-size: 15px; ">{{$dt->nourut + 2}}</td>
                    @else
                    <td align="center" width="50" style="padding: 10px; font-size: 15px; ">{{$dt->nourut}}</td>
                    @endif
                    <td align="center" width="200" style="padding: 10px; font-size: 15px; ">{{ $dt->tglrealisasi }}</td>
                    <td align="left" width="200" style="padding: 10px; font-size: 15px; ">{{ $dt->namarekanan }}</td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px; ">{{ number_format($dt->pph21,2,',','.') }}</td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; ">{{ number_format($dt->pph22,2,',','.') }}</td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px; ">{{ number_format($dt->pph23,2,',','.') }}</td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px;  ">{{ number_format($dt->pph4,2,',','.') }}</td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px; ">{{ number_format($dt->ppn,2,',','.') }}</td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px; "></td>
                </tr>
                <tr>
                    <td align="center" width="50" style="padding: 10px; font-size: 15px; "></td>
                    <td align="center" width="200" style="padding: 10px; font-size: 15px; ">{{ number_format($dt->totalbelanja,2,',','.') }}</td>
                    <td align="left" width="200" style="padding: 10px; font-size: 15px; ">NPWP: {{ $dt->npwp }}</td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px; "></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "></td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px; "></td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px;  "></td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px; "></td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px; "></td>
                </tr>
                <tr>
                    <td align="center" width="50" style="padding: 10px; font-size: 15px; "></td>
                    <td align="center" width="200" style="padding: 10px; font-size: 15px; "></td>
                    @if($dt->alamatlengkap != null)
                    <td align="left" width="200" style="padding: 10px; font-size: 15px; ">{{ $dt->alamatlengkap }}</td>
                    @else
                    <td align="left" width="200" style="padding: 10px; font-size: 15px; ">-</td>
                    @endif
                    <td align="right" width="50" style="padding: 10px; font-size: 15px; "></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "></td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px; "></td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px;  "></td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px; "></td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px; "></td>
                </tr>
                <tr>
                    <td align="center" width="50" style="padding: 10px; font-size: 15px; "></td>
                    <td align="center" width="200" style="padding: 10px; font-size: 15px; ">{{ $dt->billpph }}</td>
                    <td align="left" width="200" style="padding: 10px; font-size: 15px; ">{{ $dt->idbillpph }}</td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px; "></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "></td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px; "></td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px;  "></td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px; "></td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px; "></td>
                </tr>
                <tr>
                    <td align="center" width="50" style="padding: 10px; font-size: 15px; "></td>
                    <td align="center" width="200" style="padding: 10px; font-size: 15px; ">NTPN</td>
                    <td align="left" width="200" style="padding: 10px; font-size: 15px; ">{{ $dt->ntpnpph }}</td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px; "></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "></td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px; "></td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px;  "></td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px; "></td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px; "></td>
                </tr>
                <tr>
                    <td align="center" width="50" style="padding: 10px; font-size: 15px; "></td>
                    <td align="center" width="200" style="padding: 10px; font-size: 15px; ">{{ $dt->billppn }}</td>
                    <td align="left" width="200" style="padding: 10px; font-size: 15px; ">{{ $dt->idbillppn }}</td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px; "></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "></td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px; "></td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px;  "></td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px; "></td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px; "></td>
                </tr>
                <tr>
                    <td align="center" width="50" style="padding: 10px; font-size: 15px; "></td>
                    <td align="center" width="200" style="padding: 10px; font-size: 15px; ">NTPN</td>
                    <td align="left" width="200" style="padding: 10px; font-size: 15px; ">{{ $dt->ntpnppn }}</td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px; "></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "></td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px; "></td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px;  "></td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px; "></td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px; "></td>
                </tr>
                @endforeach
                <tr>
                    <td colspan = "3" align="center" width="200" style="padding: 10px; font-weight: bold; font-size: 15px; ">Total Bulan Sekarang</td>
                    <td align="right" width="50" style="padding: 10px; font-weight: bold; font-size: 15px; ">{{ number_format($jumlahpph21,2,',','.') }}</td>
                    <td align="right" width="50" style="padding: 10px;  font-weight: bold; font-size: 15px; ">{{ number_format($jumlahpph22,2,',','.') }}</td>
                    <td align="right" width="50" style="padding: 10px; font-weight: bold; font-size: 15px; ">{{ number_format($jumlahpph23,2,',','.') }}</td>
                    <td align="right" width="50" style="padding: 10px; font-weight: bold; font-size: 15px;  ">{{ number_format($jumlahpph4,2,',','.') }}</td>
                    <td align="right" width="50" style="padding: 10px; font-weight: bold; font-size: 15px; ">{{ number_format($jumlahppn,2,',','.') }}</td>
                    <td align="right" width="50" style="padding: 10px; font-weight: bold; font-size: 15px; "></td>
                </tr>
                <tr>
                    <td colspan = "3" align="center" width="200" style="padding: 10px; font-weight: bold; font-size: 15px; ">Total Bulan Lalu</td>
                    @if($sumberdana == 15)
                    <td align="right" width="50" style="padding: 10px; font-weight: bold; font-size: 15px; ">{{ number_format($lalu[0]->pph21 + 85800863,2,',','.') }}</td>
                    @else
                    <td align="right" width="50" style="padding: 10px; font-weight: bold; font-size: 15px; ">{{ number_format($lalu[0]->pph21,2,',','.') }}</td>
                    @endif
                    <td align="right" width="50" style="padding: 10px;  font-weight: bold; font-size: 15px; ">{{ number_format($lalu[0]->pph22,2,',','.') }}</td>
                    <td align="right" width="50" style="padding: 10px; font-weight: bold; font-size: 15px; ">{{ number_format($lalu[0]->pph23,2,',','.') }}</td>
                    <td align="right" width="50" style="padding: 10px; font-weight: bold; font-size: 15px;  ">{{ number_format($lalu[0]->pph4,2,',','.') }}</td>
                    <td align="right" width="50" style="padding: 10px; font-weight: bold; font-size: 15px; ">{{ number_format($lalu[0]->ppn,2,',','.') }}</td>
                    <td align="right" width="50" style="padding: 10px; font-weight: bold; font-size: 15px; "></td>
                </tr>
                <tr>
                    <td colspan = "3" align="center" width="200" style="padding: 10px; font-weight: bold; font-size: 15px; ">Total</td>
                    @if($sumberdana == 15)
                    <td align="right" width="50" style="padding: 10px; font-weight: bold; font-size: 15px; ">{{ number_format($lalu[0]->pph21 + 85800863 + $jumlahpph21,2,',','.') }}</td>
                    @else
                    <td align="right" width="50" style="padding: 10px; font-weight: bold; font-size: 15px; ">{{ number_format($lalu[0]->pph21 + $jumlahpph21,2,',','.') }}</td>
                    @endif
                    <td align="right" width="50" style="padding: 10px;  font-weight: bold; font-size: 15px; ">{{ number_format($lalu[0]->pph22 + $jumlahpph22,2,',','.') }}</td>
                    <td align="right" width="50" style="padding: 10px; font-weight: bold; font-size: 15px; ">{{ number_format($lalu[0]->pph23 + $jumlahpph23,2,',','.') }}</td>
                    <td align="right" width="50" style="padding: 10px; font-weight: bold; font-size: 15px;  ">{{ number_format($lalu[0]->pph4 + $jumlahpph4,2,',','.') }}</td>
                    <td align="right" width="50" style="padding: 10px; font-weight: bold; font-size: 15px; ">{{ number_format($lalu[0]->ppn + $jumlahppn,2,',','.') }}</td>
                    <td align="right" width="50" style="padding: 10px; font-weight: bold; font-size: 15px; "></td>
                </tr>
        </table>
        <table width="{{$pageWidth}}" bgcolor="#FFFFFF" style="margin-top: 50px;">
                <tr>
                    <td align="center" style="padding: 10px; font-size: 15px; "></td>
                    <td align="center" width="350" style="padding: 10px; font-size: 15px; ">Mengetahui</td>
                    <td align="center" style="padding: 10px; font-size: 15px; "></td>
                    <td align="center" width="350" style="padding: 10px; font-size: 15px;  ">Yogyakarta, {{ $tanggalcetak }}</td>
                    <td align="center" style="padding: 10px; font-size: 15px; "></td>
                </tr>
        </table>
        <table width="{{$pageWidth}}" bgcolor="#FFFFFF" style="margin-top: -20px;">
                <tr>
                    <td align="center" style="padding: 10px; font-size: 15px; "></td>
                    <td align="center" width="350" style="padding: 10px; font-size: 15px; ">Pimpinan BLUD RS. Jiwa Grhasia DIY</td>
                    <td align="center" style="padding: 10px; font-size: 15px; "></td>
                    <td align="center" width="350" style="padding: 10px; font-size: 15px;  ">Bendahara Pengeluaran</td>
                    <td align="center" style="padding: 10px; font-size: 15px; "></td>
                </tr>
        </table>
        <table width="{{$pageWidth}}" bgcolor="#FFFFFF" style="margin-top: 150px;">
                <tr>
                    <td align="center" style="padding: 10px; font-size: 15px; "></td>
                    <td align="center" width="350" style="padding: 10px; font-size: 15px; ">dr. Akhmad Akhadi Syamsudhuha, M.P.H</td>
                    <td align="center" style="padding: 10px; font-size: 15px; "></td>
                    <td align="center" width="350" style="padding: 10px; font-size: 15px;  ">Paula Sofyanita, SE.</td>
                    <td align="center" style="padding: 10px; font-size: 15px; "></td>
                </tr>
        </table>
        <table width="{{$pageWidth}}" bgcolor="#FFFFFF" style="margin-top: -20px;">
                <tr>
                    <td align="center" style="padding: 10px; font-size: 15px; "></td>
                    <td align="center" width="350" style="padding: 10px; font-size: 15px; ">NIP. 19680714 200012 1 002</td>
                    <td align="center" style="padding: 10px; font-size: 15px; "></td>
                    <td align="center" width="350" style="padding: 10px; font-size: 15px;  ">NIP. 19910622 201502 2 002</td>
                    <td align="center" style="padding: 10px; font-size: 15px; "></td>
                </tr>
        </table>
</div>
<script>
    window.print()
</script>
</body>
</html>