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
        margin: 10mm 5mm 35mm 17mm;
        size: auto;
    }

    @page :first {
        margin: 10mm 5mm 35mm 17mm;
        size: auto;
    }

    @media print {
    body {
        /* margin: 10mm 5mm 10mm 15mm; */
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
    }

    .tabel {
        width: 100%;
        border-collapse: collapse;

    }
</style>
<!-- <body style="width:19.5cm;"> -->
<body>
    <div>
        <table cellpadding="0" cellspacing="0" width="100%"  border="0" class="tabel">
            <tbody >
                <tr>
                    <td align="center" style="padding: 10px;" style="padding: 5px; width: 30px;">
                        <p>
                            @if(stripos(\Request::url(), 'localhost') !== FALSE)
                            <img src="{{ asset('img/LOGO GRHASIA.png') }}" style="width: 100px" >
                            @else
                            <img src="{{ asset('service/img/LOGO GRHASIA.png') }}" style="width: 100px" >
                            @endif
                        </p>
                    </td>
                    <td align="center" style="padding: 3px;" style="padding: 5px; width: 350px;">
                        <b style="font-size: 23px;">
                            RENCANA BISNIS DAN ANGGARAN<br>
                            BADAN LAYANAN UMUM DAERAH<br>
                            {{ strtoupper($settingrba[0]->pengelolakeuanganblud) }}

                        </b>
                    </td>
                    <td align="center" style="padding: 3px;" style="padding: 5px; width: 70px;">
                        <b style="font-size: 23px;">
                            RBA
                        </b><br>
                        {{ $tahap->tahap }}
                    </td>
                </tr>
                <tr >
                    <td colspan="3">
                        <p align="center" style="margin-top: 10px; margin-bottom:10px">
                            <font style="font-size: 12pt; " color="#000000">
                            <b>REKAP ANGGARAN TIAP KEGIATAN DAN SUMBER DANA <br> TAHUN ANGGARAN {{ $tahun }}</b>
                            </font>
                            <br>
                        </p>
                    </td>
                </tr>
            </tbody>
        </table>
        <table cellpadding="0" cellspacing="0" width="100%"  border="0" class="tabel">
            <thead>
                <tr>
                    <td align="center" width="10" style="padding: 10px; font-weight: bold ">KODE KEGIATAN</td>
                    <td align="center" width="150" style="padding: 10px; font-weight: bold; ">NAMA KEGIATAN</td>
                    @foreach ($asalproduk as $ap)
                        <td align="center" width="150" style="padding: 10px; font-weight: bold; ">{{ $ap->asalproduk }}</td>
                    @endforeach
                    <td align="center" width="50" style="padding: 10px; font-weight: bold;  ">SUB TOTAL</td>
                </tr>
            </thead>
                
            @php
            $idkegiatan = null;
            $idka2 = null;
            $idka3 = null    
            @endphp
            @foreach ($data as $dt)

                @if ($dt->idka2 && ($dt->idka2 !== $idka2))
                    <tr style="font-weight: bold;">
                        <td width="20" style="padding: 10px;">{{ $dt->kodeka2 }}</td>
                        <td width="20" style="padding: 10px;">{{ $dt->keteranganka2 }}</td>
                        @foreach ($asalproduk as $ap)
                            @php
                                $ap->jumlahanggaran = 0;

                                foreach ($data as $row) {
                                    if($row->idasalproduk == $ap->id && $row->idka2 == $dt->idka2){
                                        $ap->jumlahanggaran += $row->jumlahanggaran;
                                    }
                                }
                            @endphp

                            <td align="right" width="50" style="padding: 10px; ">{{ $ap->jumlahanggaran > 0 ? number_format($ap->jumlahanggaran,0,',','.') : '' }}</td>
                        @endforeach
                        <td align="right" width="50" style="padding: 10px; ">
                            @php
                                $subtotalkeg2 = 0;
                                foreach ($data as $subtot) {
                                    if($subtot->idka2 == $dt->idka2){
                                        $subtotalkeg2 += $subtot->jumlahanggaran;
                                    }
                                }
                            @endphp
                            {{ $subtotalkeg2 > 0 ? number_format($subtotalkeg2,0,',','.') : ''}}
                        </td>
                    </tr>
                @endif

                @if ($dt->idka3 && ($dt->idka3 !== $idka3))
                    <tr style="font-weight: bold;">
                        <td width="20" style="padding: 10px;">{{ $dt->kodeka3 }}</td>
                        <td width="20" style="padding: 10px;">{{ $dt->keteranganka3 }}</td>
                        @foreach ($asalproduk as $ap)
                            @php
                                $ap->jumlahanggaran = 0;

                                foreach ($data as $row) {
                                    if($row->idasalproduk == $ap->id && $row->idka3 == $dt->idka3){
                                        $ap->jumlahanggaran += $row->jumlahanggaran;
                                    }
                                }
                            @endphp

                            <td align="right" width="50" style="padding: 10px; ">{{ $ap->jumlahanggaran > 0 ? number_format($ap->jumlahanggaran,0,',','.') : '' }}</td>
                        @endforeach
                        <td align="right" width="50" style="padding: 10px; ">
                            @php
                                $subtotalkeg3 = 0;
                                foreach ($data as $subtot) {
                                    if($subtot->idka3 == $dt->idka3){
                                        $subtotalkeg3 += $subtot->jumlahanggaran;
                                    }
                                }
                            @endphp
                            {{ $subtotalkeg3 > 0 ? number_format($subtotalkeg3,0,',','.') : '' }}
                        </td>
                    </tr>
                @endif   
            
                <tr>
                    <td width="20" style="padding: 10px;">{{ $dt->kode }}</td>
                    <td width="20" style="padding: 10px;">{{ $dt->keterangan }}</td>
                    @foreach ($asalproduk as $ap)
                        <td align="right" width="50" style="padding: 10px; ">{{ ($ap->id == $dt->idasalproduk) ? $dt->jumlahanggaran > 0 ? number_format($dt->jumlahanggaran,0,',','.') : '' : '' }}</td>
                    @endforeach
                    <td align="right" width="50" style="padding: 10px; ">
                        @php
                            $subtotalkeg = 0;
                            foreach ($data as $subtot) {
                                if($subtot->idka == $dt->idka){
                                    $subtotalkeg += $subtot->jumlahanggaran;
                                }
                            }
                        @endphp
                        {{ number_format($subtotalkeg,0,',','.') }}
                    </td>
                </tr>

                @php
                    $idka2 = $dt->idka2;
                    $idka3 = $dt->idka3;
                @endphp
            @endforeach

            <tr>
                <td colspan="2" width="20" style="padding: 10px; font-weight: bold; text-align: center;">JUMLAH TOTAL</td>
                @foreach ($asalproduk as $ap)
                    @php
                        $ap->jumlahanggaran = 0;

                        foreach ($data as $row) {
                            if($row->idasalproduk == $ap->id){
                                $ap->jumlahanggaran += $row->jumlahanggaran;
                            }
                        }
                    @endphp

                    <td width="50" style="padding: 10px; font-weight: bold; ">{{ $ap->jumlahanggaran ? number_format($ap->jumlahanggaran,0,',','.') : ''}}</td>
                @endforeach
                <td width="50" style="padding: 10px; font-weight: bold; ">
                    @php
                        $jumlahtotalSubtotal = 0;
                        foreach ($data as $dt) {
                            $jumlahtotalSubtotal += $dt->jumlahanggaran;
                        }
                    @endphp
                    {{ $jumlahtotalSubtotal ? number_format($jumlahtotalSubtotal,0,',','.') : ''}}
                </td>
            </tr>
            
        </table>
        
        <table cellpadding="0" cellspacing="0" width="100%"  border="0">
            <thead>
                <tr>
                    <td width="700">
                    </td>
                    <td>
                    </td>
                    <td>
                        <p align="center" style="margin-top: 50px;">
                            <font style="font-size: 12pt; " color="#000000" face="Arial">
                                    Yogyakarta, {{ $tanggalcetak }}
                            </font>
                        </p>
                    </td>
                </tr>
                <tr>
                    <td width="700">
                    </td>
                    <td>
                    </td>
                    <td>
                        <p align="center" style="margin-bottom:50px">
                            <font style="font-size: 12pt; " color="#000000" face="Arial">
                                    Direktur
                            </font>
                        </p>
                    </td>
                </tr>
                <tr></tr>
                <tr></tr>
                <tr></tr>
                <tr></tr>
                <tr>
                    <td width="700">
                    </td>
                    <td>
                    </td>
                    <td>
                        <p align="center" style="margin-top: 50px;">
                            <font style="font-size: 12pt; " color="#000000" face="Arial">
                                   <u>{{$settingrba[0]->namalengkap}}</u>
                            </font>
                        </p>
                    </td>
                </tr>
                <tr>
                    <td width="700">
                    </td>
                    <td>
                    </td>
                    <td>
                        <p align="center">
                            <font style="font-size: 12pt; " color="#000000" face="Arial">
                            NIP. {{$settingrba[0]->nippns}}
                            </font>
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