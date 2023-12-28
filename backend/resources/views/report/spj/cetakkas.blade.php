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
		font-size:10pt ;
	}	

    .tabel tr td{
        border: 1px solid black;
        page-break-inside: avoid;
    }

    .tabel {
        width: 100%;
        border-collapse: collapse;

    }
</style>
<body style="width:100%;">
<table cellpadding="0" cellspacing="0"  border="0" class="tabel" width="100%">
        <tbody >
        <tr >
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
                ANGGARAN KAS {{ $tahap[0]->tahap }}
                </b><br>
                <b style="font-size: 23px;">
                RS Jiwa GRHASIA DINKES DIY
                </b>
            </td>
        </tr>
        <tr align="center">
            <td style="border-top: 1px solid black;">
                <b>Tahun Anggaran {{ $tahun }}
                </b>
            </td>
        </tr>
        </tbody>
    </table>
    <table cellpadding="0" cellspacing="0"  border="0" class="tabel" width="100%">
                <tr>
                    <td align="center" style="padding: 5px; font-weight: bold ">Kode Rekening</td>
                    <td align="center" style="padding: 5px; font-weight: bold; ">Uraian</td>
                    <td align="center" style="padding: 5px; font-weight: bold;  ">Pagu</td>
                    <td align="center" style="padding: 5px; font-weight: bold;  ">Jan</td>
                    <td align="center" style="padding: 5px; font-weight: bold ; ">Feb</td>
                    <td align="center" style="padding: 5px; font-weight: bold;  ">Mar</td>
                    <td align="center" style="padding: 5px; font-weight: bold;  ">Apr</td>
                    <td align="center" style="padding: 5px; font-weight: bold ; ">Mei</td>
                    <td align="center" style="padding: 5px; font-weight: bold;  ">Jun</td>
                    <td align="center" style="padding: 5px; font-weight: bold;  ">Jul</td>
                    <td align="center" style="padding: 5px; font-weight: bold ; ">Agu</td>
                    <td align="center" style="padding: 5px; font-weight: bold;  ">Sep</td>
                    <td align="center" style="padding: 5px; font-weight: bold;  ">Okt</td>
                    <td align="center" style="padding: 5px; font-weight: bold ; ">Nov</td>
                    <td align="center" style="padding: 5px; font-weight: bold;  ">Des</td>
                    <td align="center" style="padding: 5px; font-weight: bold;  ">Sub Total</td>
                </tr>
                @foreach ($data as $dt)
                <tr>
                    @if($dt->bold == 'iya')
                    <td style="padding: 3px;font-weight:bold;">{{ $dt->kode }}</td>
                    <td style="padding: 3px;font-weight:bold;">{{ $dt->keterangan }}</td>
                    <td style="padding: 3px;font-weight:bold;">{{ $dt->jumlahanggaran != 0? number_format($dt->jumlahanggaran,0,',','.') : '' }}</td>
                    <td style="padding: 3px;font-weight:bold;">{{ $dt->jumlahjan!= 0? number_format($dt->jumlahjan,0,',','.') : '' }}</td>
                    <td style="padding: 3px;font-weight:bold;">{{ $dt->jumlahfeb!= 0? number_format($dt->jumlahfeb,0,',','.') : '' }}</td>
                    <td style="padding: 3px;font-weight:bold;">{{ $dt->jumlahmar!= 0? number_format($dt->jumlahmar,0,',','.') : '' }}</td>
                    <td style="padding: 3px;font-weight:bold;">{{ $dt->jumlahapr!= 0? number_format($dt->jumlahapr,0,',','.') : '' }}</td>
                    <td style="padding: 3px;font-weight:bold;">{{ $dt->jumlahmei!= 0? number_format($dt->jumlahmei,0,',','.') : '' }}</td>
                    <td style="padding: 3px;font-weight:bold;">{{ $dt->jumlahjun!= 0? number_format($dt->jumlahjun,0,',','.') : '' }}</td>
                    <td style="padding: 3px;font-weight:bold;">{{ $dt->jumlahjul!= 0? number_format($dt->jumlahjul,0,',','.') : '' }}</td>
                    <td style="padding: 3px;font-weight:bold;">{{ $dt->jumlahagt!= 0? number_format($dt->jumlahagt,0,',','.') : '' }}</td>
                    <td style="padding: 3px;font-weight:bold;">{{ $dt->jumlahsep!= 0? number_format($dt->jumlahsep,0,',','.') : '' }}</td>
                    <td style="padding: 3px;font-weight:bold;">{{ $dt->jumlahokt!= 0? number_format($dt->jumlahokt,0,',','.') : '' }}</td>
                    <td style="padding: 3px;font-weight:bold;">{{ $dt->jumlahnov!= 0? number_format($dt->jumlahnov,0,',','.') : '' }}</td>
                    <td style="padding: 3px;font-weight:bold;">{{ $dt->jumlahdes!= 0? number_format($dt->jumlahdes,0,',','.') : '' }}</td>
                    <td style="padding: 3px;font-weight:bold;">{{ $dt->subtotal != 0 ?number_format($dt->subtotal,0,',','.') : '' }}</td>
                    @else
                        @if($dt->tkode == 'iya')
                            <td style="padding: 3px;">{{ $dt->kode }}</td>
                            <td style="padding: 3px;">{{ $dt->keterangan }}</td>
                            <td style="padding: 3px;">{{ $dt->jumlahanggaran != 0? number_format($dt->jumlahanggaran,0,',','.') : '' }}</td>
                            <td style="padding: 3px;">{{ $dt->jumlahjan!= 0? number_format($dt->jumlahjan,0,',','.') : '' }}</td>
                            <td style="padding: 3px;">{{ $dt->jumlahfeb!= 0? number_format($dt->jumlahfeb,0,',','.') : '' }}</td>
                            <td style="padding: 3px;">{{ $dt->jumlahmar!= 0? number_format($dt->jumlahmar,0,',','.') : '' }}</td>
                            <td style="padding: 3px;">{{ $dt->jumlahapr!= 0? number_format($dt->jumlahapr,0,',','.') : '' }}</td>
                            <td style="padding: 3px;">{{ $dt->jumlahmei!= 0? number_format($dt->jumlahmei,0,',','.') : '' }}</td>
                            <td style="padding: 3px;">{{ $dt->jumlahjun!= 0? number_format($dt->jumlahjun,0,',','.') : '' }}</td>
                            <td style="padding: 3px;">{{ $dt->jumlahjul!= 0? number_format($dt->jumlahjul,0,',','.') : '' }}</td>
                            <td style="padding: 3px;">{{ $dt->jumlahagt!= 0? number_format($dt->jumlahagt,0,',','.') : '' }}</td>
                            <td style="padding: 3px;">{{ $dt->jumlahsep!= 0? number_format($dt->jumlahsep,0,',','.') : '' }}</td>
                            <td style="padding: 3px;">{{ $dt->jumlahokt!= 0? number_format($dt->jumlahokt,0,',','.') : '' }}</td>
                            <td style="padding: 3px;">{{ $dt->jumlahnov!= 0? number_format($dt->jumlahnov,0,',','.') : '' }}</td>
                            <td style="padding: 3px;">{{ $dt->jumlahdes!= 0? number_format($dt->jumlahdes,0,',','.') : '' }}</td>
                            <td style="padding: 3px;">{{ $dt->subtotal != 0 ?number_format($dt->subtotal,0,',','.') : '' }}</td>
                        @else
                            <td style="padding: 3px;"></td>
                            <td style="padding: 3px;">{{ $dt->keterangan }}</td>
                            <td style="padding: 3px;">{{ $dt->jumlahanggaran != 0? number_format($dt->jumlahanggaran,0,',','.') : '' }}</td>
                            <td style="padding: 3px;">{{ $dt->jumlahjan!= 0? number_format($dt->jumlahjan,0,',','.') : '' }}</td>
                            <td style="padding: 3px;">{{ $dt->jumlahfeb!= 0? number_format($dt->jumlahfeb,0,',','.') : '' }}</td>
                            <td style="padding: 3px;">{{ $dt->jumlahmar!= 0? number_format($dt->jumlahmar,0,',','.') : '' }}</td>
                            <td style="padding: 3px;">{{ $dt->jumlahapr!= 0? number_format($dt->jumlahapr,0,',','.') : '' }}</td>
                            <td style="padding: 3px;">{{ $dt->jumlahmei!= 0? number_format($dt->jumlahmei,0,',','.') : '' }}</td>
                            <td style="padding: 3px;">{{ $dt->jumlahjun!= 0? number_format($dt->jumlahjun,0,',','.') : '' }}</td>
                            <td style="padding: 3px;">{{ $dt->jumlahjul!= 0? number_format($dt->jumlahjul,0,',','.') : '' }}</td>
                            <td style="padding: 3px;">{{ $dt->jumlahagt!= 0? number_format($dt->jumlahagt,0,',','.') : '' }}</td>
                            <td style="padding: 3px;">{{ $dt->jumlahsep!= 0? number_format($dt->jumlahsep,0,',','.') : '' }}</td>
                            <td style="padding: 3px;">{{ $dt->jumlahokt!= 0? number_format($dt->jumlahokt,0,',','.') : '' }}</td>
                            <td style="padding: 3px;">{{ $dt->jumlahnov!= 0? number_format($dt->jumlahnov,0,',','.') : '' }}</td>
                            <td style="padding: 3px;">{{ $dt->jumlahdes!= 0? number_format($dt->jumlahdes,0,',','.') : '' }}</td>
                            <td style="padding: 3px;">{{ $dt->subtotal != 0 ?number_format($dt->subtotal,0,',','.') : '' }}</td>
                        @endif
                    @endif
                </tr>
                @endforeach
        </table>
<script>
    window.print()
</script>
</body>
</html>