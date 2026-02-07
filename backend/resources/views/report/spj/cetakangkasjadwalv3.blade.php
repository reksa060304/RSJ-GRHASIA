<html>
<head>
    <title>
        Cetak Angkas v3
    </title>
        @if(stripos(\Request::url(), 'localhost') !== FALSE)
         <link href="{{ asset('css/style.css') }}" rel="stylesheet">
        @else
         <link href="{{ asset('service/css/style.css') }}" rel="stylesheet">
        @endif
 
</head>
<style>
    @page {
        margin: 10mm 5mm 35mm 17mm;
        size: landscape;
        /* margin:15mm 15mm 20mm 20mm; */

    }

    @page :first {
        margin: 10mm 5mm 35mm 17mm;
        size: landscape;
        /* margin:15mm 15mm 20mm 20mm; */
    }

    @media print {
    body {
        margin:0;
        /* width:31cm; */
    }
    }

    body {
        font-family: Arial;
    }

    table{
		font-family:'Arial';
		margin:0;
		padding:.1cm 0;
		font-size:11pt ;
	}	

    .tabel tr td{
        border: 1px solid black;
        page-break-inside: avoid;
    }
    table thead {
    display: table-header-group;
  }

    .tabel {
        width: 100%;
        border-collapse: collapse;

    }
</style>
<body>
<div>
<table cellpadding="0" cellspacing="0"  border="0" class="tabel">
        <!-- <tbody > -->
        <tr>
            <td align="center" rowspan="2" width="15%"  style="padding: 30px 30px 30px 40px; border-right: 1px solid black;" align="center">
                    <p align="center">
                            @if(stripos(\Request::url(), 'localhost') !== FALSE)
                            <img src="{{ asset('img/LOGO GRHASIA.png') }}" style="width: 120px" >
                            @else
                              <img src="{{ asset('service/img/LOGO GRHASIA.png') }}" style="width: 120px" >
                            @endif
                      
                    </p>
            </td>
            <td align="center" width="400px">
                <b style="font-size: 25px;">
                ANGGARAN KAS DAN RENCANA JADWAL TIAP SUB SUB KEGIATAN
                </b><br>
                <b style="font-size: 23px;">
                RUMAH SAKIT JIWA GRHASIA
                </b>
            </td>
             <td rowspan="2"  align="center" style="width: 100px;">
                <b style="font-size: 14pt;">
                    ANGKAS
                </b>
                <br>
                {{ $tahap[0]->tahap }}
            </td>
        </tr>
        <tr align="center">
            <td style="border-top: 1px solid black;">
                @php
                    $str = $subsubkegiatan[0]->keterangan;
                    $str1 = explode("-",$str)[count(explode("-",$str))-1];
                @endphp

                <b>Sub Sub Kegiatan : {{ $str1 }}<br>
                Tahun Anggaran {{ $tahun }}
                </b>
            </td>
        </tr>
        <!-- </tbody> -->
    </table>
    <table cellpadding="0" cellspacing="0" border="0" class = "tabel">
                <thead>
                    <tr>
                    {{-- <td align="center" style="padding: 10px; font-weight: bold ">No</td> --}}
                    <td align="center" style="padding: 10px; font-weight: bold ">Kode Rekening</td>
                    <td align="center" style="padding: 10px; font-weight: bold; ">Uraian</td>
                    <td align="center" style="padding: 10px; font-weight: bold;  ">Jan</td>
                    <td align="center" style="padding: 10px; font-weight: bold ; ">Feb</td>
                    <td align="center" style="padding: 10px; font-weight: bold;  ">Mar</td>
                    <td align="center" style="padding: 10px; font-weight: bold;  ">Apr</td>
                    <td align="center" style="padding: 10px; font-weight: bold ; ">Mei</td>
                    <td align="center" style="padding: 10px; font-weight: bold;  ">Jun</td>
                    <td align="center" style="padding: 10px; font-weight: bold;  ">Jul</td>
                    <td align="center" style="padding: 10px; font-weight: bold ; ">Agu</td>
                    <td align="center" style="padding: 10px; font-weight: bold;  ">Sep</td>
                    <td align="center" style="padding: 10px; font-weight: bold;  ">Okt</td>
                    <td align="center" style="padding: 10px; font-weight: bold ; ">Nov</td>
                    <td align="center" style="padding: 10px; font-weight: bold;  ">Des</td>
                    <td align="center" style="padding: 10px; font-weight: bold;  ">Sub Total</td>
                    <td align="center" style="padding: 10px; font-weight: bold;  ">Sumber Dana</td>
                </tr>
                </thead>
                @php
                    $totalanggaran = 0;
                    $totaljan = 0;
                    $totalfeb = 0;
                    $totalmar = 0;
                    $totalapr = 0;
                    $totalmei = 0;
                    $totaljun = 0;
                    $totaljul = 0;
                    $totalagt = 0;
                    $totalsep = 0;
                    $totalokt = 0;
                    $totalnov = 0;
                    $totaldes = 0;
                    $i = 0;
                @endphp
                @foreach ($data as $dt)
                @php
                    
                    
                @endphp
                @if($dt->kodefix != '' || $dt->asalproduk == '')
                @php
                    $totaljan += $dt->jumlahjan;
                    $totalfeb += $dt->jumlahfeb;
                    $totalmar += $dt->jumlahmar;
                    $totalapr += $dt->jumlahapr;
                    $totalmei += $dt->jumlahmei;
                    $totaljun += $dt->jumlahjun;
                    $totaljul += $dt->jumlahjul;
                    $totalagt += $dt->jumlahagt;
                    $totalsep += $dt->jumlahsep;
                    $totalokt += $dt->jumlahokt;
                    $totalnov += $dt->jumlahnov;
                    $totaldes += $dt->jumlahdes;
                    $totalanggaran += $dt->subtotal;
                    $i = 0;
                @endphp
                @else
                @php
                    $i++;
                @endphp
                @endif
                <tr>
                @if($dt->kodefix != '' || $dt->asalproduk == '')
                    {{-- <td align="center" style="padding: 10px;font-weight:bold;"></td> --}}
                    <td style="padding: 10px;font-weight:bold;">{{ $dt->kodemataanggaran }}</td>
                    <td style="padding: 10px;font-weight:bold;">{{ $dt->namamataanggaran }}</td>
                    <td style="padding: 10px;font-weight:bold;">{{ $dt->jumlahjan!= 0? number_format($dt->jumlahjan,0,',','.') : '' }}</td>
                    <td style="padding: 10px;font-weight:bold;">{{ $dt->jumlahfeb!= 0? number_format($dt->jumlahfeb,0,',','.') : '' }}</td>
                    <td style="padding: 10px;font-weight:bold;">{{ $dt->jumlahmar!= 0? number_format($dt->jumlahmar,0,',','.') : '' }}</td>
                    <td style="padding: 10px;font-weight:bold;">{{ $dt->jumlahapr!= 0? number_format($dt->jumlahapr,0,',','.') : '' }}</td>
                    <td style="padding: 10px;font-weight:bold;">{{ $dt->jumlahmei!= 0? number_format($dt->jumlahmei,0,',','.') : '' }}</td>
                    <td style="padding: 10px;font-weight:bold;">{{ $dt->jumlahjun!= 0? number_format($dt->jumlahjun,0,',','.') : '' }}</td>
                    <td style="padding: 10px;font-weight:bold;">{{ $dt->jumlahjul!= 0? number_format($dt->jumlahjul,0,',','.') : '' }}</td>
                    <td style="padding: 10px;font-weight:bold;">{{ $dt->jumlahagt!= 0? number_format($dt->jumlahagt,0,',','.') : '' }}</td>
                    <td style="padding: 10px;font-weight:bold;">{{ $dt->jumlahsep!= 0? number_format($dt->jumlahsep,0,',','.') : '' }}</td>
                    <td style="padding: 10px;font-weight:bold;">{{ $dt->jumlahokt!= 0? number_format($dt->jumlahokt,0,',','.') : '' }}</td>
                    <td style="padding: 10px;font-weight:bold;">{{ $dt->jumlahnov!= 0? number_format($dt->jumlahnov,0,',','.') : '' }}</td>
                    <td style="padding: 10px;font-weight:bold;">{{ $dt->jumlahdes!= 0? number_format($dt->jumlahdes,0,',','.') : '' }}</td>
                    <td style="padding: 10px;font-weight:bold;">{{ $dt->subtotal != 0 ?number_format($dt->subtotal,0,',','.') : '' }}</td>
                    <td style="padding: 10px;font-weight:bold;">{{ $dt->asalproduk }}</td>
                @else
                    <td align="center" style="padding: 10px;">{{ $i }}</td>
                    {{-- <td style="padding: 10px;"></td> --}}
                    <td style="padding: 10px;">{{ $dt->namamataanggaran }}</td>
                    <td style="padding: 10px;">{{ $dt->jumlahjan!= 0? number_format($dt->jumlahjan,0,',','.') : '' }}</td>
                    <td style="padding: 10px;">{{ $dt->jumlahfeb!= 0? number_format($dt->jumlahfeb,0,',','.') : '' }}</td>
                    <td style="padding: 10px;">{{ $dt->jumlahmar!= 0? number_format($dt->jumlahmar,0,',','.') : '' }}</td>
                    <td style="padding: 10px;">{{ $dt->jumlahapr!= 0? number_format($dt->jumlahapr,0,',','.') : '' }}</td>
                    <td style="padding: 10px;">{{ $dt->jumlahmei!= 0? number_format($dt->jumlahmei,0,',','.') : '' }}</td>
                    <td style="padding: 10px;">{{ $dt->jumlahjun!= 0? number_format($dt->jumlahjun,0,',','.') : '' }}</td>
                    <td style="padding: 10px;">{{ $dt->jumlahjul!= 0? number_format($dt->jumlahjul,0,',','.') : '' }}</td>
                    <td style="padding: 10px;">{{ $dt->jumlahagt!= 0? number_format($dt->jumlahagt,0,',','.') : '' }}</td>
                    <td style="padding: 10px;">{{ $dt->jumlahsep!= 0? number_format($dt->jumlahsep,0,',','.') : '' }}</td>
                    <td style="padding: 10px;">{{ $dt->jumlahokt!= 0? number_format($dt->jumlahokt,0,',','.') : '' }}</td>
                    <td style="padding: 10px;">{{ $dt->jumlahnov!= 0? number_format($dt->jumlahnov,0,',','.') : '' }}</td>
                    <td style="padding: 10px;">{{ $dt->jumlahdes!= 0? number_format($dt->jumlahdes,0,',','.') : '' }}</td>
                    <td style="padding: 10px;">{{ $dt->subtotal != 0 ?number_format($dt->subtotal,0,',','.') : '' }}</td>
                    <td style="padding: 10px;">{{ $dt->asalproduk }}</td>
                @endif
                    {{-- <td style="padding: 10px;">{{ $dt->jumlahjan!= 0? number_format($dt->jumlahjan,0,',','.') : '' }}</td>
                    <td style="padding: 10px;">{{ $dt->jumlahfeb!= 0? number_format($dt->jumlahfeb,0,',','.') : '' }}</td>
                    <td style="padding: 10px;">{{ $dt->jumlahmar!= 0? number_format($dt->jumlahmar,0,',','.') : '' }}</td>
                    <td style="padding: 10px;">{{ $dt->jumlahapr!= 0? number_format($dt->jumlahapr,0,',','.') : '' }}</td>
                    <td style="padding: 10px;">{{ $dt->jumlahmei!= 0? number_format($dt->jumlahmei,0,',','.') : '' }}</td>
                    <td style="padding: 10px;">{{ $dt->jumlahjun!= 0? number_format($dt->jumlahjun,0,',','.') : '' }}</td>
                    <td style="padding: 10px;">{{ $dt->jumlahjul!= 0? number_format($dt->jumlahjul,0,',','.') : '' }}</td>
                    <td style="padding: 10px;">{{ $dt->jumlahagt!= 0? number_format($dt->jumlahagt,0,',','.') : '' }}</td>
                    <td style="padding: 10px;">{{ $dt->jumlahsep!= 0? number_format($dt->jumlahsep,0,',','.') : '' }}</td>
                    <td style="padding: 10px;">{{ $dt->jumlahokt!= 0? number_format($dt->jumlahokt,0,',','.') : '' }}</td>
                    <td style="padding: 10px;">{{ $dt->jumlahnov!= 0? number_format($dt->jumlahnov,0,',','.') : '' }}</td>
                    <td style="padding: 10px;">{{ $dt->jumlahdes!= 0? number_format($dt->jumlahdes,0,',','.') : '' }}</td>
                    <td style="padding: 10px;">{{ $dt->subtotal != 0 ?number_format($dt->subtotal,0,',','.') : '' }}</td>
                    <td style="padding: 10px;">{{ $dt->asalproduk }}</td> --}}
                </tr>
                @endforeach
                <tr>
                    <td colspan="2" align="center" style="padding: 10px; font-weight: bold ">Jumlah Total</td>
                    <td align="center" style="padding: 10px;font-weight: bold">{{ $totaljan != 0 ? number_format($totaljan,0,',','.') : ''}}</td>
                    <td align="center" style="padding: 10px;font-weight: bold">{{ $totalfeb != 0 ? number_format($totalfeb,0,',','.') : ''}}</td>
                    <td align="center" style="padding: 10px;font-weight: bold">{{ $totalmar != 0 ? number_format($totalmar,0,',','.') : ''}}</td>
                    <td align="center" style="padding: 10px;font-weight: bold">{{ $totalapr != 0 ? number_format($totalapr,0,',','.') : ''}}</td>
                    <td align="center" style="padding: 10px;font-weight: bold">{{ $totalmei != 0 ? number_format($totalmei,0,',','.') : ''}}</td>
                    <td align="center" style="padding: 10px;font-weight: bold">{{ $totaljun != 0 ? number_format($totaljun,0,',','.') : ''}}</td>
                    <td align="center" style="padding: 10px;font-weight: bold">{{ $totaljul != 0 ? number_format($totaljul,0,',','.') : ''}}</td>
                    <td align="center" style="padding: 10px;font-weight: bold">{{ $totalagt != 0 ? number_format($totalagt,0,',','.') : ''}}</td>
                    <td align="center" style="padding: 10px;font-weight: bold">{{ $totalsep != 0 ? number_format($totalsep,0,',','.') : ''}}</td>
                    <td align="center" style="padding: 10px;font-weight: bold">{{ $totalokt != 0 ? number_format($totalokt,0,',','.') : ''}}</td>
                    <td align="center" style="padding: 10px;font-weight: bold">{{ $totalnov != 0 ? number_format($totalnov,0,',','.') : ''}}</td>
                    <td align="center" style="padding: 10px;font-weight: bold">{{ $totaldes != 0 ? number_format($totaldes,0,',','.') : ''}}</td>
                    <td align="center" style="padding: 10px;font-weight: bold">{{ $totalanggaran != 0 ? number_format($totalanggaran,0,',','.') : '' }}</td>
                    <td align="center" style="padding: 10px;font-weight: bold"></td>
                </tr>
        </table>
</div>
<script>
    window.print()
</script>
</body>
</html>
