@extends('template.template')

@section('content')


    <div align="center">
        {{-- penting gais ini buat urlnya kalo localhost dan server itu beda --}}
        
        <!-- <table border="0" width="{{$pageWidth}}" bgcolor="#FFFFFF">
            <thead>
                <tr>
                    <td width="2%">
                        <p align="left" style="margin: 0%">
                            @if(stripos(\Request::url(), 'localhost') !== FALSE)
                            <img src="{{ asset('img/logo_grhasia.png') }}" style="width: 90px; padding-left: 40px; ">
                            @else
                            <img src="{{ asset('service/img/logo_grhasia.png') }}" style="width: 90px; padding-left: 40px; ">
                            @endif
                            {{-- <font style="font-size: 10pt;" color="#000000" face="Arial"><b>RSJ GRHASIA</b></font><br> --}}
                        </p>
                        <p align="left" style="margin: 0%">
                            <font style="font-size: 10pt;  padding-left: 40px;" color="#000000" face="Arial"><b>RSJ
                                    GRHASIA</b></font><br>
                        </p>
                    </td>
                    <td width="48%" border="0">
                        <p align="left" style="margin: 0">
                            <font style="font-size: 11pt;" color="#000000" face="Arial"><b>RUMAH SAKIT JIWA GRHASIA</b>
                            </font><br>
                        </p>
                        <p align="left" style="margin: 0">
                            @if(stripos(\Request::url(), 'localhost') !== FALSE)
                            <img src="{{ asset('img/Aksara Jawa_Surat.png') }}" style="width: 170px; ">
                            @else
                            <img src="{{ asset('service/img/Aksara Jawa_Surat.png') }}" style="width: 170px; ">
                            @endif
                        </p>
                        <p align="left" style="margin: 0px;">
                            <font style="font-size: 8pt;line-height: 1px" color="#000000" face="Arial">
                                Jalan Kaliurang Km 17 Sleman, Telepon: (0274) 895143, 895297 <br>
                                Laman: grhasia.jogjaprov.go.id, Surel: <u>grhasiamentalhospital@gjogjaprov.go.id</u>
                            </font><br>
                        </p>

                    </td>
                </tr>
            </thead>
        </table> -->
        <table border="0" width="{{$pageWidth}}" bgcolor="#FFFFFF">
            <thead>
                <tr>
                    <td colspan="3">
                        <p align="center" style="margin-right: 30px; margin-top: 50px; margin-bottom:50px">
                            <font style="font-size: 15pt; " color="#000000" face="Arial">
                                <u>
                                    <b>LAPORAN ORDER DAN KIRIM BARANG</b>
                                </u>
                            </font>
                            <br>
                            <font style="font-size: 13pt; vertical-align: top;" color="#000000" face="Arial">
                                <b>Periode : </b>{{$tglAwal}} </b>s/d {{$tglAkhir}}
                            </font>
                        </p>
                    </td>
                </tr>

            </thead>
        </table>
        <table border="1" width="{{$pageWidth}}" bgcolor="#FFFFFF">
                <tr>
                    <td width="150" style="padding-left: 60px; font-weight: bold ">Nama Obat</td>
                    <td width="50" style="padding-left: 20px; font-weight: bold  ">Qty Order</td>
                    <td width="50" style="padding-left: 20px; font-weight: bold  ">Qty Kirim</td>
                </tr>
                @foreach ($data as $tb)
                <tr>
                    <td width="150" style="padding-left: 60px ">{{$tb->namaproduk}}</td>
                    <td width="50" style="padding-left: 20px ">{{$tb->jumlahorder}}</td>
                    <td width="50" style="padding-left: 20px ">{{$tb->jumlahkirim}}</td>
                </tr>
                @endforeach
        </table>
    </div>
@endsection