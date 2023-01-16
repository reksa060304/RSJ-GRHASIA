<!DOCTYPE html>
<html lang="en">
<head>
     @if(stripos(\Request::url(), 'localhost') !== FALSE)
         <link href="{{ asset('css/style.css') }}" rel="stylesheet">
        @else
         <link href="{{ asset('service/css/style.css') }}" rel="stylesheet">
        @endif
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <style type="text/css" media="print">
    @page {
        size: auto;   /* auto is the initial value */
        margin: 0;  /* this affects the margin in the printer settings */
    }
</style>
<style>
    

    .borderss {
        border-bottom: 1px solid black;
    }

    body {
        font-family: Arial;
    }
    .space{
        padding-left: 125px;
        padding-bottom: 15px;
        width: 150px
    }
    #name{

    }
</style>
</head>
<body style="background-color: #CCCCCC" onload="window.print()" onafterprint="window.close()">
    <div align="center">
        <table class="bayangprint" cellspacing="0" cellpadding="0" bgcolor="#FFFFFF" border="0" width="{{$pageWidth}}" >
                            @foreach ($data as $d)

            <thead>
                <tr>
                    <td colspan="3">
                        <p align="center">
                            <br>
                            <br>
                            <br>
                            <br>
                            <br>
                            @if (stripos(\Request::url(), 'localhost') !== FALSE)
                                <img src="{{ asset('img/LOGO GRHASIA.png') }}" style="width: 110px" border="0">
                            @else
                                <img src="{{ asset('service/img/LOGO GRHASIA.png') }}" style="width: 110px" border="0">
                            @endif
                            {{-- <img src="{{ asset('service/img/LOGO GRHASIA.png') }}" style="width: 110px" border="0"> --}}
                            <p align="center" style="font-size:25px;font-weight: bold; margin: 0px 0px 0px 0px">RSJ GRHASIA</p>
                            <p align="center" style="font-size:13px;font-weight: bolder; margin: 0px 0px 0px 0px">Daerah Istimewa Yogyakarta</p>
                            <br>
                            <h1 align="center" style="margin: 0px 0px 0px 0px">SURAT KETERANGAN</h1>
                            <p align="Center" style="font-size:15px;font-weight: normal; margin: 0px 0px 0px 0px">NO: {{$d->nosertifikat}}</p>
                            <br>
                        </p>
                    </td>
                </tr>
                
            </thead>
            <tbody>
                <tr>
                    <td colspan="3" class="space">
                            <p>Yang bertanda tangan dibawah ini:</p>
                    </td>
                </tr>
                <tr style="font-weight: bold">
                    <td class="space">
                        NAMA
                    </td>
                    <td>
                        :
                    </td>
                    <td>
                        dr. Akhmad Akhadi S., MPH
                    </td>
                </tr>
                <tr style="font-weight: bold">
                    <td class="space" >
                        NIP
                    </td>
                    <td>
                        :
                    </td>
                    <td>
                        196807142000121002
                    </td>
                </tr>
                <tr style="font-weight: bold">
                    <td class="space">
                        Pangkat/Gol
                    </td>
                    <td>
                        :
                    </td>
                    <td>
                        Pembina Tingkat I IV/B
                    </td>
                </tr>
                <tr style="font-weight: bold">
                    <td class="space">
                        Jabatan
                    </td>
                    <td>
                        :
                    </td>
                    <td>
                        Direktur Rumah Sakit Jiwa Grhasia
                    </td>
                </tr>
                <tr>
                    <td colspan="3" class="space">
                            <p>Dengan Ini Menerangkan Bahwa:</p>
                    </td>
                </tr>
                <tr style="font-weight: bold">
                    <td class="space">
                        NAMA
                    </td>
                    <td>
                        :
                    </td>
                    <td>
                        {{$d->nama}}
                    </td>
                </tr>
                <tr style="font-weight: bold">
                    <td class="space">
                        NIM
                    </td>
                    <td>
                        :
                    </td>
                    <td>
                        {{$d->nim}}
                    </td>
                </tr>
                <tr style="font-weight: bold">
                    <td class="space">
                        Institusi
                    </td>
                    <td>
                        :
                    </td>
                    <td>
                        {{$d->institusipendidikan}}
                    </td>
                </tr>
            </tbody>
          
            <tfoot>
                <tr>
                    <td colspan="3" class="space">
                            <p>Telah Selesai melaksanakan <strong>{{$d->detailjenisproduk}}</strong> DI Rumah Sakit Jiwa
grhasia D.I Yogyakarta <br> Pada tanggal {{$d->tanggalmulai}} S/D {{$d->tanggalselesai}} </p>
<p>Demikian Surat Keterangan Ini dibuat untuk dapat dipergunakan sebagaimana mestinya</p>
                    </td>
                </tr>
                <tr align="right" >
                    <td></td>
                    <td colspan="3" style="padding-right: 30px;text-align: center">
                        <p>
                            <strong>Yogyakarta, {{$d->tanggal_sekarang}}</strong>
                        </p>
                        <p>
                            <strong>Disyahkan Oleh</strong>
                        </p>
                    </td>
                </tr>
                <tr height="100">
                    <td></td>
                    <td colspan="3" style="padding-right: 40px;text-align: center">
                        @if(stripos(\Request::url(), 'localhost') !== FALSE)
                            <img src="{{ asset('img/tt_dir.png') }}" alt="ttd_dir" width="250px" style="position: absolute; right: 230px; top:980px;">
                            <img src="{{ asset('img/caprsjgrhasia.png') }}" alt="cap ttd" width="120px" style="position: absolute; right: 330px; top:970px;z-index: 0;">
                        @else
                            <img src="{{ asset('service/img/tt_dir.png') }}" alt="ttd_dir" width="250px" style="position: absolute; right: 230px; top:980px;">
                            <img src="{{ asset('service/img/caprsjgrhasia.png') }}" alt="cap ttd" width="120px" style="position: absolute; right: 330px; top:970px;z-index: 0;">
                        @endif
                    </td>
                </tr>
                <tr align="right" class="space">
                    <td></td>
                    <td style="padding-right: 40px;padding-bottom:235px;text-align: center" colspan="3">
                        <p style="margin: 0px 0px 0px 0px">
                            <strong>
                                <u>
                                dr. Akhmad Akhadi S., MPH 
                            </u>
                            </strong>
                            
                        </p>
                        <p style="margin: 0px 0px 0px 0px"> <strong>
                                
                        NIP : 196807142000121002
                                </strong></p>
                    </td>
                </tr>
            </tfoot>
                @endforeach

        </table>
    </div>
    
</body>

</html>