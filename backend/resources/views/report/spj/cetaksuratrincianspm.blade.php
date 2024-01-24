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
        margin: 0;  /* this affects the margin in the printer settings */
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

    .tabel2 tr td{
        border: none;
    }

    .tabel {
        width: 100%;
        border-collapse: collapse;

    }
</style>
<body style="background-color: #CCCCCC">
<div align="center" >
    <section >
    <table  class="bayangprint" cellspacing="0" cellpadding="0" bgcolor="#FFFFFF" border="0" width="{{$pageWidth}}" style="height: 700px;padding-right: 50px;padding-left: 30px;">
        <tbody>
        <tr style="padding: 5px;">
            <td align="center" colspan="4" style="padding: 5px;height:30px;"></td>
        </tr>
        <tr>
            <td colspan="5" style="padding: 0px" align="center">
                <font style="font-size: 14pt" color="#000000">SURAT PERINTAH MEMBAYAR</font>
            </td>
        </tr>
        <tr>
            <td colspan="5" align="center">
                <font style="font-size: 14pt" color="#000000">TAHUN ANGGARAN {{ date('Y', strtotime($detail[0]->tglspm)) }}</font>
            </td>
        </tr>
        <tr style="padding: 5px;">
            <td align="center" colspan="4" style="padding: 5px;height:20px;"></td>
        </tr>
        <tr>
            <td colspan="5" align="right">
                <font style="font-size: 14pt" color="#000000">UP / <strike>GU</strike> / <strike>TU</strike> / <strike>LS</strike></font>
            </td>
        </tr>
        <tr>
            <td colspan="5" align="right">
                <font style="font-size: 14pt" color="#000000">Nomor: {{$detail[0]->nospm}}</font>
            </td>
        </tr>
        <tr style="padding: 5px;">
            <td align="center" colspan="4" style="padding: 5px;height:10px;"></td>
        </tr>
        </tbody>
        <tbody class="tabel" style="padding-right: 50px; padding-left: 50px;">
        <tr style="padding: 5px;">
            <td colspan="5" style="padding: 5px;" align="center">(Diisi oleh PPK-SKPD)</td>
        </tr>
        <tr style="padding: 5px;">
            <td colspan="2" style="padding: 5px;height:50px;width: 100px;" align="left"><b>KUASA BENDAHARA UMUM DAERAH<br>PEMERINTAH DAERAH DAERAH ISTIMEWA YOGYAKARTA</b><br><br><br>Supaya menerbitkan SP2D kepada :</td>
            <td colspan="3" style="padding: 5px;height:50px;width: 100px;" align="left">Potongan-potongan :<br><br><br><br><br><br></td>
        </tr>
        <tr style="padding: 5px;">
            <td class="parent" colspan="2" style="padding: 5px;height:200px;width: 100px;" align="left">
                <table cellspacing="0" cellpadding="0" class="tabel2">
                    <tr>
                        <td class="child" colspan="1" style="padding: 5px;" align="left">
                            SKPD
                        </td>
                        <td class="child" colspan="1" style="padding: 5px;" align="left">
                        : 1.02.2.22.0.00.01.0004 - RS Jiwa Grhasia DIY
                        </td>
                    </tr>
                    <tr>
                        <td class="child" colspan="1" style="padding: 5px;" align="left">
                            Bendahara / <strike>Pihak ketiga</strike> *)
                        </td>
                        <td class="child" colspan="1" style="padding: 5px;" align="left">
                        : Christina Dewi Isti Paramita, S.E. Bendahara Pengeluaran
                        </td>
                    </tr>
                    <tr>
                        <td class="child" colspan="1" style="padding: 5px;" align="left">
                            Nomor Rekening Bank
                        </td>
                        <td class="child" colspan="1" style="padding: 5px;" align="left">
                        : 041111000044- BPD DIY
                        </td>
                    </tr>
                    <tr>
                        <td class="child" colspan="1" style="padding: 5px;" align="left">
                            NPWP
                        </td>
                        <td class="child" colspan="1" style="padding: 5px;" align="left">
                        : -
                        </td>
                    </tr>
                    <tr>
                        <td class="child" colspan="1" style="padding: 5px;" align="left">
                            Dasar Pembayaran No - Tanggal SPD
                        </td>
                        <td class="child" colspan="1" style="padding: 5px;" align="left">
                        @if($tglspd != '')
                        : - {{$tglspd}}
                        @else
                        : - -
                        @endif
                        </td>
                    </tr>
                </table>
            </td>
            <td colspan="3" style="padding: 5px;height:200px;width: 100px;" align="left">
                <table cellspacing="0" cellpadding="0" class="tabel">
                    <tr>
                        <td class="child" colspan="1" style="padding: 5px;" align="left">No</td>
                        <td class="child" colspan="1" style="padding: 5px;" align="left">Uraian</td>
                        <td class="child" colspan="1" style="padding: 5px;" align="left">Jumlah (Rp)</td>
                        <td class="child" colspan="1" style="padding: 5px;" align="left">Keterangan</td>
                    </tr>
                    <tr>
                        <td class="child" colspan="1" style="padding: 5px;" align="left">1</td>
                        <td class="child" colspan="1" style="padding: 5px;" align="left"></td>
                        <td class="child" colspan="1" style="padding: 5px;" align="left"></td>
                        <td class="child" colspan="1" style="padding: 5px;" align="left"></td>
                    </tr>
                    <tr>
                        <td class="child" colspan="1" style="padding: 5px;" align="left">2</td>
                        <td class="child" colspan="1" style="padding: 5px;" align="left"></td>
                        <td class="child" colspan="1" style="padding: 5px;" align="left"></td>
                        <td class="child" colspan="1" style="padding: 5px;" align="left"></td>
                    </tr>
                    <tr>
                        <td class="child" colspan="1" style="padding: 5px;" align="left">3</td>
                        <td class="child" colspan="1" style="padding: 5px;" align="left"></td>
                        <td class="child" colspan="1" style="padding: 5px;" align="left"></td>
                        <td class="child" colspan="1" style="padding: 5px;" align="left"></td>
                    </tr>
                    <tr>
                        <td class="child" colspan="1" style="padding: 5px;" align="left">4</td>
                        <td class="child" colspan="1" style="padding: 5px;" align="left"></td>
                        <td class="child" colspan="1" style="padding: 5px;" align="left"></td>
                        <td class="child" colspan="1" style="padding: 5px;" align="left"></td>
                    </tr>
                    <tr>
                        <td class="child" colspan="1" style="padding: 5px;" align="left"></td>
                        <td class="child" colspan="1" style="padding: 5px;" align="left">Jumlah potongan</td>
                        <td class="child" colspan="1" style="padding: 5px;" align="left"></td>
                        <td class="child" colspan="1" style="padding: 5px;" align="left"></td>
                    </tr>
                    <tr>
                        <td class="child" colspan="4" style="padding: 5px;" align="left"><i>Informasi : (tidak mengurangi jumlah pembayaran SPM)</i></td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr style="padding: 5px;">
            <td class="parent" colspan="2" style="padding: 5px;height:200px;width: 100px;" align="left">
                <table cellspacing="0" cellpadding="0" class="tabel2">
                    <tr>
                        <td class="child" colspan="1" style="padding: 5px;" align="left">
                            Untuk Keperlulan
                        </td>
                        <td class="child" colspan="1" style="padding: 5px;" align="left">
                        : {{$detail[0]->untukpengeluaran}} RS Jiwa GRHASIA DINKES DIY <br> Tahun Anggaran {{ date('Y', strtotime($detail[0]->tglspm)) }}
                        </td>
                    </tr>
                    @if($detail[0]->objectasalprodukfk == 18)
                    <tr>
                        <td class="child" colspan="2" style="padding: 5px;" align="left">
                        <strike>1. Belanja Tidak Langsung </strike> **)
                        </td>
                    </tr>
                    @elseif($detail[0]->objectasalprodukfk == 15)
                    <tr>
                        <td class="child" colspan="2" style="padding: 5px;" align="left">
                        1. Belanja Tidak Langsung **)
                        </td>
                    </tr>
                    @endif
                    <tr>
                        <td class="child" colspan="2" style="padding: 5px;" align="left">
                        2. Belanja Langsung **)
                        </td>
                    </tr>
                    <tr>
                        <td class="child" colspan="1" style="padding: 5px;" align="left">
                        Pembebanan Pada Kode Rekening :
                        </td>
                        <td class="child" colspan="1" style="padding: 5px;" align="left">
                        </td>
                    </tr>
                    <tr>
                        <td class="child" colspan="1" style="padding: 5px;" align="right">
                        1.02.2.22.0.00.01.0004
                        </td>
                        <td class="child" colspan="1" style="padding: 5px;" align="right">
                        : Rp {{ number_format($detail[0]->nilaispm,2,',','.') }}
                        </td>
                    </tr>
                </table>
            </td>
            <td colspan="3" style="padding: 5px;height:200px;width: 100px;" align="left">
                <table cellspacing="0" cellpadding="0" class="tabel">
                    <tr>
                        <td class="child" colspan="1" style="padding: 5px;" align="left">No</td>
                        <td class="child" colspan="1" style="padding: 5px;" align="left">Uraian</td>
                        <td class="child" colspan="1" style="padding: 5px;" align="left">Jumlah (Rp)</td>
                        <td class="child" colspan="1" style="padding: 5px;" align="left">Keterangan</td>
                    </tr>
                    <tr>
                        <td class="child" colspan="1" style="padding: 5px;" align="left">1</td>
                        <td class="child" colspan="1" style="padding: 5px;" align="left"></td>
                        <td class="child" colspan="1" style="padding: 5px;" align="left"></td>
                        <td class="child" colspan="1" style="padding: 5px;" align="left"></td>
                    </tr>
                    <tr>
                        <td class="child" colspan="1" style="padding: 5px;" align="left">2</td>
                        <td class="child" colspan="1" style="padding: 5px;" align="left"></td>
                        <td class="child" colspan="1" style="padding: 5px;" align="left"></td>
                        <td class="child" colspan="1" style="padding: 5px;" align="left"></td>
                    </tr>
                    <tr>
                        <td class="child" colspan="1" style="padding: 5px;" align="left">3</td>
                        <td class="child" colspan="1" style="padding: 5px;" align="left"></td>
                        <td class="child" colspan="1" style="padding: 5px;" align="left"></td>
                        <td class="child" colspan="1" style="padding: 5px;" align="left"></td>
                    </tr>
                    <tr>
                        <td class="child" colspan="1" style="padding: 5px;" align="left"></td>
                        <td class="child" colspan="1" style="padding: 5px;" align="left">Jumlah pajak</td>
                        <td class="child" colspan="1" style="padding: 5px;" align="left"></td>
                        <td class="child" colspan="1" style="padding: 5px;" align="left"></td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr style="padding: 5px;">
            <td class="parent" colspan="2" style="padding: 5px;height:200px;width: 100px;" align="left">
                <table cellspacing="0" cellpadding="0" class="tabel2">
                    <tr>
                        <td class="child" colspan="1" style="padding: 5px;" align="left">
                        Jumlah SPP Yang Diminta :
                        </td>
                        <td class="child" colspan="1" style="padding: 5px;" align="left">
                        Rp {{ number_format($detail[0]->nilaispm,2,',','.') }}
                        </td>
                    </tr>
                    <tr>
                        <td class="child" colspan="2" style="padding: 5px;" align="center">
                        ({{$terbilang}})
                        </td>
                    </tr>
                    <tr>
                        <td class="child" colspan="2" style="padding: 5px;" align="center">
                        <br><br><br>
                        Nomor dan Tanggal SPP :
                        </td>
                    </tr>
                    <tr>
                        <td class="child" colspan="2" style="padding: 5px;" align="left">
                        {{$detail[0]->nospm}} dan {{$tgl}}
                        </td>
                    </tr>
                </table>
            </td>
            <td colspan="3" style="padding: 5px;height:200px;width: 100px;" align="left">
                <table class="tabel2">
                    <tr>
                        <td class="child" colspan="1" style="padding: 5px;" align="left">
                        Jumlah SPM
                        </td>
                        <td class="child" colspan="1" style="padding: 5px;" align="left">
                        Rp {{ number_format($detail[0]->nilaispm,2,',','.') }}
                        </td>
                    </tr>
                    <tr>
                        <td class="child" colspan="2" style="padding: 5px;" align="center">
                        Uang Sejumlah : ({{$terbilang}})
                        </td>
                    </tr>
                    <tr>
                        <td class="child" colspan="2" style="padding: 5px;" align="center">
                        YOGYAKARTA,{{$tgl}}<br>
                        Direktur<br><br><br><br><br><br><br><br><br>
                        dr. Akhmad Akhadi Syamsudhuha, M.P.H<br>
                        NIP. 19680714 200012 1 002<br>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr style="padding: 5px;">
            <td colspan="5" style="padding: 5px;" align="center">SPM ini sah apabila telah ditandatangani dan distempel oleh SKPD</td>
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