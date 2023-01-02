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
    <table cellspacing="0" cellpadding="0" bgcolor="#FFFFFF" border="0" width="{{$pageWidth}}" style="height: 700px;">
        <tbody>
        <tr>
            <td colspan="8" align="center">
                <font style="font-size: 14pt" color="#000000">SURAT TANDA SETORAN</font>
            </td>
        </tr>
        <tr>
            <td colspan="8" align="center">
                <font style="font-size: 14pt" color="#000000">(STS)</font>
            </td>
        </tr>
        <tr>
            <td colspan="8" align="center" style="height: 30px;"></td>
        </tr>
        </tbody>
        <tbody>
        <tr>
            <td colspan="3" align="left">
                <font style="font-size: 12pt" color="#000000">No. STS: {{$detail[0]->nosts}}</font>
            </td>
            <td colspan="5" align="left">
                <font style="font-size: 12pt" color="#000000">No. Giro: 041-111-000043</font>
            </td>
        </tr>
        <tr>
            <td colspan="3" align="left">
                <font style="font-size: 12pt" color="#000000">Harap menerima uang sebesar:</font>
            </td>
            <td colspan="5" align="left">
                <font style="font-size: 12pt" color="#000000">Rp. {{ number_format($detail[0]->totalsetoran,0,',','.') }}</font>
            </td>
        </tr>
        <tr>
            <td colspan="8" align="left">
                <font style="font-size: 12pt" color="#000000">Terbilang: {{$detail[0]->terbilang}}</font>
            </td>
        </tr>
        <tr>
            <td colspan="8" align="left">
                <font style="font-size: 12pt" color="#000000">Yaitu: {{$detail[0]->keterangan}}</font>
            </td>
        </tr>
        <tr>
            <td align="left"></td>
            <td colspan="7" align="left">
                <font style="font-size: 12pt" color="#000000">: Tgl {{$detail[0]->tglpenerimaan}}</font>
            </td>
        </tr>
        <tr>
            <td align="left" style="height: 30px;"></td>
        </tr>
        </tbody>
        <tbody class="tabel">
        <tr style="padding: 5px;">
            <td style="padding: 5px; height: 70px;" align="center">Kode Rekening</td>
            <td style="padding: 5px; height: 70px;" align="center">No</td>
            <td style="padding: 5px; height: 70px;" align="center">Uraian Rincian Obyek</td>
            <td style="padding: 5px; height: 70px;" align="center">Vol</td>
            <td colspan="4" style="padding: 5px; height: 70px; width: 200px;" align="center">Jumlah (Rp)</td>
        </tr>
        @foreach($detail as $dt)
        <tr style="padding: 5px;">
            <td style="padding: 5px;" align="left">{{$dt->kdrekening}}</td>
            <td style="padding: 5px;" align="left">{{$dt->nomer}}</td>
            <td style="padding: 5px;" align="left">{{$dt->uraian}}</td>
            <td style="padding: 5px;" align="right">{{$dt->vol}}</td>
            @if($dt->kolom1 != null)
            <td style="padding: 5px;" align="center">Rp</td>
            @else
            <td style="padding: 5px;" align="center"></td>
            @endif
            <td style="padding: 5px;" align="right">{{ number_format($dt->kolom1,0,',','.') != 0 ? number_format($dt->kolom1,2,',','.') : number_format($dt->kolom1,0,',','.')  }}</td>
            @if($dt->kolom2 != null)
            <td style="padding: 5px;" align="center">Rp</td>
            @else
            <td style="padding: 5px;" align="center"></td>
            @endif
            <td style="padding: 5px;" align="right">{{ number_format($dt->kolom2,0,',','.') != 0 ? number_format($dt->kolom2,2,',','.') : number_format($dt->kolom2,0,',','.')  }}</td>
        </tr>
        @endforeach
        </tbody>
    </table>
    <table>
    <tbody>
        <tr style="padding: 5px;">
            <td style="padding: 5px; height: 50px;" align="center"></td>
        </tr>
        <tr style="padding: 5px;">
            <td style="padding: 5px; padding-left: 20px;" align="center">MENGETAHUI:</td>
            <td colspan="2" style="padding: 5px; width: 50px;" align="center"></td>
            <td style="padding: 5px;" align="center">TELAH DIPERIKSA</td>
            <td colspan="2" style="padding: 5px; width: 50px;" align="center"></td>
            <td style="padding: 5px;" align="center"></td>
        </tr>
        <tr style="padding: 5px;">
            <td style="padding: 5px; padding-left: 20px;" align="center">Pimpinan BLUD</td>
            <td colspan="2" style="padding: 5px; width: 50px;" align="center"></td>
            <td style="padding: 5px;" align="center">Verifikator</td>
            <td colspan="2" style="padding: 5px; width: 50px;" align="center"></td>
            <td style="padding: 5px;" align="center">Bendahara Penerima Pembantu</td>
        </tr>
        <tr style="padding: 5px;">
            <td style="padding: 5px; padding-left: 20px; height: 200px" align="center"></td>
            <td colspan="2" style="padding: 5px; height: 200px; width: 50px;" align="center"></td>
            <td style="padding: 5px; height: 200px" align="center"></td>
            <td colspan="2" style="padding: 5px; height: 200px; width: 50px;" align="center"></td>
            <td style="padding: 5px; height: 200px" align="center"></td>
        </tr>
        <tr style="padding: 5px;">
            <td style="padding: 5px; padding-left: 20px;" align="center">dr. Akhmad Akhadi S, MPH</td>
            <td colspan="2" style="padding: 5px; width: 50px;" align="center"></td>
            <td style="padding: 5px;" align="center">Reny Astuti, SE</td>
            <td colspan="2" style="padding: 5px; width: 50px;" align="center"></td>
            <td style="padding: 5px;" align="center">Suri Herlina Pratiwi, S.KM, M.PH</td>
        </tr>
        <tr style="padding: 5px;">
            <td style="padding: 5px; padding-left: 20px;" align="center">NIP. 19680714 200012 1 002</td>
            <td colspan="2" style="padding: 5px; width: 50px;" align="center"></td>
            <td style="padding: 5px;" align="center">NIP. 19700404 199303 2005</td>
            <td colspan="2" style="padding: 5px; width: 50px;" align="center"></td>
            <td style="padding: 5px;" align="center">NIP. 19860422 201101 2 013</td>
        </tr>
        </tbody>
    </table>
</section>
</div>
<script>
    window.print()
</script>
</body>
</html>