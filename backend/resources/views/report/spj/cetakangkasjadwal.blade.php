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
<style>
    @page {
        margin:15mm 15mm 20mm 20mm;
        size: landscape;

    }

    @page :first {
        margin:15mm 15mm 20mm 20mm;

    }

    @media print {
    body {
        margin:0;
        width:31cm;
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
<body style="width:1500px;">
<div>
<table width="{{$pageWidth}}" bgcolor="#FFFFFF" class="tabel">
        <tbody >
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
            <td align="center" width="100%">
                <b style="font-size: 25px;">
                ANGGARAN KAS DAN RENCANA JADWAL TIAP SUB KEGIATAN
                </b><br>
                <b style="font-size: 23px;">
                RS Jiwa GRHASIA DINKES DIY
                </b>
            </td>
        </tr>
        <tr align="center">
            <td style="border-top: 1px solid black;">
                <b>Sub Kegiatan : {{ $subkegiatan[0]->keterangan.' - '.$subsubkegiatan[0]->keterangan }}<br>
                Tahun Anggaran {{ $tahun }}
                </b>
            </td>
        </tr>
        </tbody>
    </table>
    <table cellpadding="0" cellspacing="0" width="100%"  border="0" class="tabel">
                <thead>
                    <tr>
                    <td align="center" style="padding: 10px; font-weight: bold ">No</td>
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
                @if($dt->kodefix != '')
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
                @if($dt->kodefix != '')
                    <td align="center" style="padding: 10px;font-weight:bold;">{{ $dt->kodefix }}</td>
                    <td style="padding: 10px;font-weight:bold;">{{ $dt->namamataanggaran }}</td>
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
                @else
                    <td align="center" style="padding: 10px;">{{ $i }}</td>
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
                    <td align="center" style="padding: 10px;">{{ $totaljan != 0 ? number_format($totaljan,0,',','.') : ''}}</td>
                    <td align="center" style="padding: 10px;">{{ $totalfeb != 0 ? number_format($totalfeb,0,',','.') : ''}}</td>
                    <td align="center" style="padding: 10px;">{{ $totalmar != 0 ? number_format($totalmar,0,',','.') : ''}}</td>
                    <td align="center" style="padding: 10px;">{{ $totalapr != 0 ? number_format($totalapr,0,',','.') : ''}}</td>
                    <td align="center" style="padding: 10px;">{{ $totalmei != 0 ? number_format($totalmei,0,',','.') : ''}}</td>
                    <td align="center" style="padding: 10px;">{{ $totaljun != 0 ? number_format($totaljun,0,',','.') : ''}}</td>
                    <td align="center" style="padding: 10px;">{{ $totaljul != 0 ? number_format($totaljul,0,',','.') : ''}}</td>
                    <td align="center" style="padding: 10px;">{{ $totalagt != 0 ? number_format($totalagt,0,',','.') : ''}}</td>
                    <td align="center" style="padding: 10px;">{{ $totalsep != 0 ? number_format($totalsep,0,',','.') : ''}}</td>
                    <td align="center" style="padding: 10px;">{{ $totalokt != 0 ? number_format($totalokt,0,',','.') : ''}}</td>
                    <td align="center" style="padding: 10px;">{{ $totalnov != 0 ? number_format($totalnov,0,',','.') : ''}}</td>
                    <td align="center" style="padding: 10px;">{{ $totaldes != 0 ? number_format($totaldes,0,',','.') : ''}}</td>
                    <td align="center" style="padding: 10px;">{{ $totalanggaran != 0 ? number_format($totalanggaran,0,',','.') : '' }}</td>
                    <td align="center" style="padding: 10px;"></td>
                </tr>
        </table>
</div>
<script>
    window.print()
</script>
</body>
</html>