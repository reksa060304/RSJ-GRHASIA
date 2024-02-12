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
        size: potrait;
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
</style>
<body style="background-color: #CCCCCC">
<div align="center" >
    <section >
    <table cellspacing="0" cellpadding="0" bgcolor="#FFFFFF" border="0" width="{{$pageWidth}}" style="height: 700px;">
        <tbody>
        <tr>
            <td colspan="2" style="padding: 30px; text-align:left">
                <b>
                    <font style="font-size: 12pt" color="#000000">Lembar : I/II/III/IV/V</font>
                </b> 
            </td>
            <td style="padding-right: 30px" align="right"></td>
            <td colspan="2" style="padding-right: 30px" align="right">
                <b>
                    <font style="font-size: 12pt" color="#000000">Model : Bend. 26. a</font>
                </b> 
            </td>
        </tr>
        <tr>
            <td colspan="5" style="padding: 10px" align="center">
            @if($tampilsumberdana == true)
                <b>
                    <font style="font-size: 14pt" color="#000000"><u> BUKTI PENGELUARAN </u></font>
                </b>
            @else
            <b>
                    <font style="font-size: 14pt" color="#000000"><u> BUKTI KAS PENGELUARAN </u></font>
                </b>
            @endif 
            </td>
        </tr>
        </tbody>
        <tbody>
        <tr>
            <td colspan="5">
                <table>
                    <tr>
                        <td colspan="2" style="text-align:left; padding-left: 45px; padding-bottom: 5px; padding-top: 15px;">
                            <font style="font-size: 12pt" color="#000000">Terima dari</font>
                        </td>
                        <td colspan="4" style="padding: 10px; padding-bottom: 5px; padding-top: 5px;" align="left">
                            <font style="font-size: 12pt" color="#000000">: Direktur Rumah Sakit Jiwa Grhasia</font>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" style="text-align:left; padding-left: 45px; padding-bottom: 5px; padding-top: 5px;">
                            <font style="font-size: 12pt" color="#000000">Uang Sebesar</font>
                        </td>
                        <td colspan="4" style="padding: 10px; padding-bottom: 5px; padding-top: 5px;" align="left">
                            <font style="font-size: 12pt" color="#000000">: {{ucwords($terbilang)}}</font>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        
        <tr>
            <td colspan="4" style="text-align:left; padding-left: 50px; padding-bottom: 5px; padding-top: 15px;">
                <font style="font-size: 12pt" color="#000000">
               Yaitu untuk membayar: </font>
            </td>
        </tr>
        <tr>
            <td colspan="5" style="text-align:justify; padding-left: 50px; padding-bottom: 10px; padding-top: 10px; padding-right: 40px;">
                @php
                    $str = $kegiatan[0]->ktsubsub;
                    $str1 = explode("-",$str)[count(explode("-",$str))-1];
                @endphp
                <font style="font-size: 12pt" color="#000000">{{$mataanggaran[0]->namamataanggaran}} ({{$mataanggaran[0]->kodemataanggaran}}) pada sub kegiatan {{ $kegiatan[0]->ktsub }} sub sub kegiatan {{ $str1 }}
                @if( $spj[0]->deskripsi != null)
                    @if ($spj[0]->deskripsi == "" || $spj[0]->deskripsi == "-")
                    @else
                        berdasarkan {{$spj[0]->deskripsi}} 
                    @endif
                @else
                @endif
                dengan rincian biaya sebagai berikut :</font>
            </td>
        </tr>
        </tbody>
        <tbody>
        @foreach($detail AS $dt)
        <tr style="padding: 5px; width: 10%;">
            <td colspan="5">
                <table>
                    <tr>
                        <td style="padding-left: 45px; width: 1%;" align="center">
                        {{$dt->nomor}}
                    </td>
                    <td style="padding: 5px; width: 40%;" align="left">
                        {{$dt->uraian}}
                    </td>
                    @php
                        $digitharga = strlen(substr(strrchr(sprintf("%s", $dt->harga), "."), 1));
                        $digitsubtotal = strlen(substr(strrchr(sprintf("%s", $dt->subtotal), "."), 1));
                    @endphp
                    <td style="padding: 5px; width: 15%;" align="left">
                        @ {{ number_format($dt->harga,$digitharga,',','.') }} x {{$dt->jml}} {{$dt->satuan}}
                    </td>
                    <td style="padding: 5px; width: 1%;" align="center">
                        =
                    </td>
                    <td style="padding: 5px; width: 10%;" align="left">
                        {{ number_format($dt->subtotal,$digitsubtotal,',','.') }}
                    </td>
                    </tr>
                </table>
            </td>
        </tr>
            @endforeach

        @php
            $digitterbilang = strlen(substr(strrchr(sprintf("%s", $jumlah[0]->totalfix), "."), 1));
        @endphp
        <tr>
            <td colspan="2" style="text-align:left; padding-left: 50px; padding-bottom: 5px; padding-top: 15px;">
                <font style="font-size: 12pt" color="#000000">Terbilang: {{ number_format($jumlah[0]->totalfix,$digitterbilang,',','.') }}</font>
            </td>
        </tr>
        @if($tampilsumberdana == true)
        <tr>
            <td colspan="2" style="text-align:center; padding-left: 50px; padding-bottom: 5px; padding-top: 5px; width: 100px;">
                <font style="font-size: 12pt" color="#000000"></font>
            </td>
            <td style="width: 100px;"></td>
            <td colspan="2" style="padding: 10px; padding-bottom: 5px; padding-top: 5px; width: 100px;" align="center">
                <font style="font-size: 12pt" color="#000000"></font>
            </td>
        </tr>
        <tr>
            <td  colspan="2" style="text-align:center; padding-left: 50px; padding-bottom: 80px; padding-top: 5px; width: 100px;">
                <font style="font-size: 12pt" color="#000000"></font>
            </td>
            <td style="text-align:center; padding-left: 50px; padding-bottom: 80px; padding-top: 5px; width: 100px;">
                <font style="font-size: 12pt" color="#000000"></font>
            </td>
            <td  colspan="2" style="padding: 10px; padding-bottom: 80px; padding-top: 5px; width: 100px;" align="center">
                <font style="font-size: 12pt" color="#000000">Pejabat Pelaksana<br>Teknis Kegiatan (PPTK)</font>
            </td>
        </tr>
        <tr>
            <td colspan="2" style="text-align:center; padding-left: 50px; padding-bottom: 5px; padding-top: 5px; width: 120px;">
                <font style="font-size: 12pt" color="#000000"></font>
            </td>
            <td style="text-align:center; padding-left: 50px; padding-bottom: 5px; padding-top: 5px; width: 80px;">
                <font style="font-size: 12pt" color="#000000"></font>
            </td>
            <td colspan="2" style="padding: 10px; padding-bottom: 5px; padding-top: 5px; width: 100px;" align="center">
                <font style="font-size: 12pt" color="#000000"><u>{{ $kegiatan[0]->namalengkap}}</u><br>NIP. {{ $kegiatan[0]->nippns}}</font>
            </td>
        </tr>
        @endif
        <tr>
            <td colspan="5" style="text-align:right; padding-right: 50px; padding-bottom: 5px; padding-top: 30px;">
                <font style="font-size: 12pt" color="#000000"> </font>
            </td>
        </tr>
        <tr>
            <td colspan="5">
                <table border=0>
                    <tr>
                        <td   style="text-align:center; padding-left: 50px; padding-bottom: 80px; padding-top: 5px; width: 300px;">
                            <font style="font-size: 12pt" color="#000000">Mengetahui dan Menyetujui<br>Direktur Selaku KPA</font>
                        </td>
                        <td style="text-align:center;  padding-bottom: 80px; padding-top: 5px; width: 250px;">
                            <font style="font-size: 12pt" color="#000000">Bendahara Pengeluaran</font>
                        </td>
                        <td  style="padding: 10px; padding-bottom: 80px; padding-top: 5px; width: 300px;" align="center">
                            <font style="font-size: 12pt" color="#000000">Yogyakarta, &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; {{$kegiatan[0]->tahun}} <br> Yang menerima,<br>Tanda Tangan</font>
                        </td>
                    </tr>
                    <tr>
                        <td  style="text-align:center; padding-left: 50px; padding-bottom: 5px; padding-top: 5px; width: 120px;">
                            <font style="font-size: 12pt" color="#000000"><u>{{$settingrba[0]->namalengkap}}</u><br>NIP. {{$settingrba[0]->nippns}}</font>
                        </td>
                        <td style="text-align:center; padding-bottom: 5px; padding-top: 5px; width: 80px;">
                            <font style="font-size: 12pt" color="#000000"><u>{{ $spj[0]->namabendahara}}</u><br>NIP. {{ $spj[0]->nipbendahara}}</font>
                        </td>
                        <td  style="padding: 10px; padding-bottom: 5px; padding-top: 5px; width: 100px;" align="center">
                            <font style="font-size: 12pt" color="#000000"><u>{{ $spj[0]->namarekanan}}</u></font>
                        </td>
                    </tr>
                    <tr>
                </table>
            </td>
        </tr>
        <tr>
            <td colspan="5">
                <table border=0>
                    <tr>
                        <td  style="text-align:center; padding-left: 50px; padding-bottom: 0px; width: 250px; border-top: 4px solid black; ">
                        </td>
                        <td style="text-align:center;  padding-bottom: 0px; width: 300px; border-top: 4px solid black">
                        </td>
                        <td  style="padding: 10px; padding-bottom: 0px; width: 300px; border-top: 4px solid black" align="center">
                        </td>
                    </tr>
                    <tr>
                        <td  style="text-align:center; padding-left: 50px; padding-bottom: 5px; padding-top: -5px; width: 120px; border-top: 2px solid black; ">
                        </td>
                        <td style="text-align:center; padding-left: 50px; padding-bottom: 5px; padding-top: -5px; width: 80px; border-top: 2px solid black; border-left: 2px solid black">
                        </td>
                        <td  style="padding: 10px; padding-bottom: 5px; padding-top: -5px; width: 100px; border-top: 2px solid black; border-left: 2px solid black" align="center">
                        </td>
                    </tr>
                    <tr>
                        <td  style="text-align:center; padding-left: 50px; width: 120px;">
                            <font style="font-size: 12pt" color="#000000">
                            </font>
                        </td>
                        <td style="text-align:center; padding-left: 0px; width: 80px; border-left: 2px solid black">
                            <font style="font-size: 12pt" color="#000000">Telah dipungut:</font>
                        </td>
                        <td  style="padding: 10px; width: padding-left: 30px; 100px; border-left: 2px solid black" align="center">
                            <font style="font-size: 12pt" csolor="#000000">Telah dibukukan:</font>
                        </td>
                    </tr>
                    <tr>
                        <td  style="text-align:center; padding-left: 50px; width: 120px;">
                            <font style="font-size: 12pt" color="#000000"> Barang tersebut telah diterima dengan cukup dan baik
                            </font>
                        </td>
                        <td style="text-align:center; padding-left: 20px; padding-right: 20px; width: 80px; border-left: 2px solid black">
                            <table width=100%>
                                <tr>
                                    <td style="text-align:left; padding-left: 5px; width: 50px; border-left: 0px solid black">
                                        <font style="font-size: 12pt" color="#000000">PPN</font>
                                    </td>
                                    <td style="text-align:center; padding-left: 5px; width: 10px; border-left: 0px solid black">
                                        <font style="font-size: 12pt" color="#000000">:</font>
                                    </td>
                                    <td style="text-align:right; padding-left: 5px; width: 150px; border-left: 0px solid black">
                                        <font style="font-size: 12pt" color="#000000">{{ number_format($spj[0]->ppn,$digitterbilang,',','.') }}</font>
                                    </td>
                                </tr>
                            </table>
                        </td>
                        <td  style=" width: 100px; padding-left: 30px; border-left: 2px solid black" align="left">
                            <font style="font-size: 12pt" csolor="#000000">BK Tgl. ..............No...............</font>
                        </td>
                    </tr>
                    <tr>
                        <td  style="text-align:center; padding-left: 80px; width: 120px;">
                            <font style="font-size: 12pt" color="#000000">
                            </font>
                        </td>
                        <td style="text-align:center; padding-left: 20px; padding-right: 20px; width: 80px; border-left: 2px solid black">
                        <table width=100%>
                                <tr>
                                    <td style="text-align:left; padding-left: 5px; width: 50px">
                                        <font style="font-size: 12pt" color="#000000">PPh</font>
                                    </td>
                                    <td style="text-align:center; padding-left: 5px; width: 10px">
                                        <font style="font-size: 12pt" color="#000000">:</font>
                                    </td>
                                    <td style="text-align:right; padding-left: 5px; width: 150px; border-bottom: 1px solid black">
                                        <font style="font-size: 12pt" color="#000000">{{ number_format($spj[0]->pph,$digitterbilang,',','.') }}</font>
                                    </td>
                                </tr>
                            </table>                            
                        </td>
                        <td  style="width: 100px; padding-left: 30px; border-left: 2px solid black" align="left">
                            <font style="font-size: 12pt" csolor="#000000">No. Rek: {{$mataanggaran[0]->kodepermendagri}}</font>
                        </td>
                    </tr>
                    <tr>
                        <td  style="text-align:center; padding-left: 50px; width: 120px;">
                            <font style="font-size: 12pt" color="#000000">
                            </font>
                        </td>
                        <td style="text-align:center; padding-left: 20px; padding-right: 20px; width: 80px; border-left: 2px solid black">
                        <table width=100%; border=0>
                                <tr>
                                    <td style="text-align:left; padding-left: 5px; width: 50px; border-left: 0px solid black">
                                        <font style="font-size: 12pt" color="#000000">Total</font>
                                    </td>
                                    <td style="text-align:center; padding-left: 5px; width: 10px; border-left: 0px solid black">
                                        <font style="font-size: 12pt" color="#000000">:</font>
                                    </td>
                                    <td style="text-align:right; padding-left: 5px; width: 150px; border-left: 0px solid black">
                                        <font style="font-size: 12pt" color="#000000">{{ number_format($spj[0]->totalpp,$digitterbilang,',','.') }}</font>
                                    </td>
                                </tr>
                            </table>                                                        
                        </td>
                        <td  style="width: 100px; padding-left: 30px; border-left: 2px solid black" align="left">
                            <font style="font-size: 12pt" csolor="#000000">Kode Kegiatan: {{$kegiatan[0]->kodesubsub}}</font>
                        </td>
                    </tr>
                    <tr>
                        <td  style="text-align:center; padding-left: 50px; padding-bottom: 10px; width: 120px;">
                            <font style="font-size: 12pt" color="#000000"><u>{{ $spj[0]->namapenerima}}</u><br> {{ ($spj[0]->namapenerima<>'') ? 'NIP. '.$spj[0]->nippenerima : ''}}
                            </font>
                        </td>
                        <td style="text-align:center; padding-left: 0px; padding-bottom: 10px;  width: 80px; border-left: 2px solid black">
                            <font style="font-size: 12pt;" color="#000000"></font>
                        </td>
                        <td  style="width: 100px; padding-left: 30px; padding-bottom: 10px; border-left: 2px solid black" align="left">
                            <font style="font-size: 12pt" csolor="#000000">Tahun Anggaran: {{$kegiatan[0]->tahun}}<br>&nbsp;</font>
                        </td>
                    </tr>
                    <tr>
                        <td  style="text-align:center; padding-left: 50px; padding-bottom: 50px; width: 120px;">
                            <font style="font-size: 12pt" color="#000000">
                            </font>
                        </td>
                        <td style="text-align:center; padding-left: 0px; padding-bottom: 50px; width: 80px; border-left: 2px solid black">
                            <font style="font-size: 12pt;" color="#000000">Paraf</font>
                        </td>
                        <td  style="width: 100px; padding-left: 30px; padding-bottom: 50px; border-left: 2px solid black" align="center">
                            <font style="font-size: 12pt" csolor="#000000">Paraf</font>
                        </td>
                    </tr>
                    <tr>
                        <td  style="text-align:center; padding-left: 50px; width: 120px;">
                            <font style="font-size: 12pt" color="#000000">
                            </font>
                        </td>
                        <td style="text-align:center; padding-left: 0px; width: 80px; border-left: 2px solid black">
                            <font style="font-size: 12pt;" color="#000000"></font>
                        </td>
                        <td  style="text-align:center; padding-left: 30px; width: 100px; border-left: 2px solid black">
                            <font style="font-size: 12pt" csolor="#000000"></font>
                        </td>
                    </tr>
                    <tr>
                        <td  style="text-align:center; padding-left: 50px; width: 120px;">
                            <font style="font-size: 12pt" color="#000000">
                            </font>
                        </td>
                        <td style="text-align:center; padding-left: 0px; width: 80px; border-left: 2px solid black">
                            <font style="font-size: 12pt;" color="#000000">(............................)</font>
                        </td>
                        <td  style="text-align:center; padding-left: 30px; width: 100px; border-left: 2px solid black">
                            <font style="font-size: 12pt" csolor="#000000">(............................)</font>
                        </td>
                    </tr>
                    <tr>
                        <td  style="text-align:center; padding-left: 50px; width: 120px;">
                            <font style="font-size: 12pt" color="#000000">
                            </font>
                        </td>
                        <td style="text-align:center; padding-left: 30px; width: 80px; border-left: 2px solid black">
                            <font style="font-size: 12pt;" color="#000000"></font>
                        </td>
                        <td  style="text-align:center; padding-left: 30px; width: 100px; border-left: 2px solid black">
                            <font style="font-size: 12pt" csolor="#000000"></font>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        {{-- <!-- <tr>
            <td colspan="2" style="text-align:center; padding-left: 10px; padding-top: 80px; width: 100px;">
                <font style="font-size: 12pt" color="#000000">{{$spj[0]->norealisasi}}</font>
            </td>
            <td style="width: 100px; padding-top: 80px;"></td>
            <td colspan="2" style="padding-top: 80px; width: 100px;" align="center">
            </td>
        </tr> --> --}}
        </tbody>
        
    </table>
</section>
@include('template.footerspj')
</div>
<script>
    window.print()
</script>
</body>
</html>