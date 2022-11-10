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
    @page {   /* auto is the initial value */
        margin: 2cm 2cm 2cm 3cm;  /* this affects the margin in the printer settings */
    }
</style>
<style>
    tr td {
        padding: 2px 4px 2px 4px;
    }

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
<body style="background-color: #CCCCCC">
<div align="center" >
    <section >
    <table  class="bayangprint" cellspacing="0" cellpadding="0" bgcolor="#FFFFFF" border="0" width="{{$pageWidth}}">
        <tbody>
        <tr>
            <td colspan="8" style="padding: 10px" align="center">
                <font style="font-size: 14pt" color="#000000"><b>SURAT TANDA SETORAN</b></font>
            </td>
        </tr>
        <tr>
            <td colspan="8" style="padding: 0px" align="center">
                <font style="font-size: 14pt" color="#000000"><b>Periode: </b>{{$periodeawal}} s/d {{$periodeakhir}}</font>
            </td>
        </tr>
        <tr style="padding: 5px;">
            <td align="center" colspan="4" style="padding: 5px;height:50px;"></td>
        </tr>
        </tbody>
        <tbody class="tabel">
        <tr style="padding: 5px;">
            <td style="padding: 5px; width: 100px;" align="center">Tanggal</td>
            <td style="padding: 5px; width: 50px;" align="center">No. STS</td>
            <td style="padding: 5px; width: 100px;" align="center">Uraian</td>
            <td style="padding: 5px; width: 100px;" align="center">Sub Kegiatan</td>
            <td style="padding: 5px; width: 100px;" align="center">Sub Sub Kegiatan</td>
            <td style="padding: 5px; width: 50px;" align="center">Rekening</td>
            <td style="padding: 5px; width: 50px;" align="center">Sumber Dana</td>
            <td style="padding: 5px; width: 200px;" align="center">Nilai STS</td>
        </tr>
        @foreach($detail as $pr)
        <tr style="padding: 5px;">
            <td style="padding: 5px; width: 100px;" align="center">{{$pr->tglsts}}</td>
            <td style="padding: 5px; width: 50px;" align="left">{{$pr->nosts}}</td>
            <td style="padding: 5px; width: 100px;" align="left">{{$pr->uraiansts}}</td>
            <td style="padding: 5px; width: 100px;" align="left">{{$pr->subkegiatan}}</td>
            <td style="padding: 5px; width: 100px;" align="left">{{$pr->subsubkegiatan}}</td>
            <td style="padding: 5px; width: 50px;" align="left">{{$pr->mataanggaran}}</td>
            <td style="padding: 5px; width: 50px;" align="left">{{$pr->asalproduk}}</td>
            <td style="padding: 5px; width: 200px;" align="left">{{ number_format($pr->nilaists,2,',','.') }}</td>
        </tr>
        @endforeach
        </tbody>
    </table>
</section>
</div>
<script>
    window.print()
</script>
</body>
</html>