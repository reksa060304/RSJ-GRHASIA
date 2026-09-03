
@extends('template.template')
@section('content-body')
    {{--<hr--}}
    <tr>

        <td bordercolor="#808080" height="13">
            <font style="font-size: 11pt" face="Arial" color="#000000">
                    <span style="font-weight: 700;font-size: 12pt">
                        HASIL PEMERIKSAAN RADIOLOGI
                    </span>
            </font>
        </td>
    </tr>
    <tr>
        <td bordercolor="#808080" height="13"></td>
    </tr>
    <tr>
        <td bordercolor="#808080" height="13">
            <table cellspacing="0" cellpadding="0" border="0" width="100%">
                <tbody>
                <tr>
                    <td height="25" width="100">
                        <font style="font-size: 12pt" face="Arial">No Foto</font>
                    </td>
                    <td>:</td>
                    <td height="25" width="401"><b><font style="font-size: 12pt" face="Arial"> {{ $raw->nofoto }}</font></b></td>
                    <td height="25" width="105">
                        <font style="font-size: 12pt" face="Arial">No Radiologi</font>
                    </td>
                    <td>:</td>
                    <td height="25"><b><font style="font-size: 12pt" face="Arial">{{   $raw->noregistrasi  }}</font></b></td>

                </tr>
                <tr>
                    <td height="25" width="100">
                        <font style="font-size: 12pt" face="Arial">No Rekam Medis</font>
                    </td>
                    <td>:</td>
                    <td height="25" width="401"><b><font style="font-size: 12pt" face="Arial">{{   $raw->nocm }} </font></b></td>
                    <td height="25" width="105">
                        <font style="font-size: 12pt" face="Arial">Kelamin</font>
                    </td>
                    <td>:</td>
                    <td height="25"><b><font style="font-size: 12pt" face="Arial">{{  $raw->jeniskelamin    }} </font></b></td>

                </tr>
                <tr>
                    <td height="25" width="100">
                        <font style="font-size: 12pt" face="Arial">Nama</font>
                    </td>
                    <td>:</td>
                    <td height="25" width="401"><b><font style="font-size: 12pt" face="Arial">{{ $raw->namapasien   }} </font></b></td>
                    <td height="25" width="105">
                        <font style="font-size: 12pt" face="Arial">Alamat</font>
                    </td>
                    <td>:</td>
                    <td height="25"><b><font style="font-size: 12pt" face="Arial">{{  $raw->alamatlengkap }} </font></b></td>

                </tr>
                <tr>
                    <td height="25" width="92">
                        <font style="font-size: 12pt" face="Arial">Umur</font>
                    </td>
                    <td>:</td>
                    <td height="25" width="401"><b><font style="font-size: 12pt" face="Arial">{{ $raw->umur  }} </font></b></td>
                    <td height="25" width="105">
                        <font style="font-size: 12pt" face="Arial">Cara Bayar</font>
                    </td>
                    <td>:</td>
                    <td height="25"><b><font style="font-size: 12pt" face="Arial">{{ $raw->kelompokpasien  }}  </font></b></td>

                </tr>
                <tr>
                    <td height="25" width="92">
                        <font style="font-size: 12pt" face="Arial">Asal Pasien</font>
                    </td>
                    <td>:</td>
                    <td height="25" width="401"><b><font style="font-size: 12pt" face="Arial">{{ $raw->namaruangan }} </font></b></td>
                    <td height="25" width="105">
                        <font style="font-size: 12pt" face="Arial">Cetak</font>
                    </td>
                    <td>:</td>
                    <td height="25"><b><font style="font-size: 12pt" face="Arial">{{ App\Traits\Valet::getDateIndo(date('Y-m-d')).date(' H:i:s')   }}  </font></b></td>

                </tr>
                <tr>
                    <td height="25" width="92">
                        <font style="font-size: 12pt" face="Arial">Tgl Transaksi</font>
                    </td>
                    <td>:</td>
                    <td height="25" width="401"><b><font style="font-size: 12pt" face="Arial">{{ App\Traits\Valet::getDateIndo($raw->tanggal).' '.substr($raw->tanggal,10,9)   }} </font></b></td>
                    <td height="25" width="105">
                        <font style="font-size: 12pt" face="Arial">Dokter Perujuk</font>
                    </td>
                    <td>:</td>
                    <td height="25"><b><font style="font-size: 12pt" face="Arial">{{ $raw->perujuk  }}  </font></b></td>

                </tr>
                </tbody>
            </table>

        </td>
    </tr>
    <tr>
        <td bordercolor="#808080" height="13"></td>
    </tr>
    <tr >
        <td bordercolor="#808080" height="13" style="padding:10px ">
            <p style="text-align: left;font-weight: bold"> Hasil Pemeriksaan</p>
            <hr>
            <p  style="text-align: left;font-weight: bold">{{ (string) $raw->namaproduk}}</p>

            @php
                $exper = explode('~',$raw->keterangan);
                //dd($exper);
                $datas =[];
                foreach ($exper as $r){
                    $datas [] = array(
                        'ket' =>(string)  $r
                    );
                }
            // dd($datas);

            @endphp
            <div style="text-align: left;font-size: 12pt">
            
                <p style="margin-block-start: 0px;
                margin-block-end: 0px;
                margin-inline-start: 0px;
                margin-inline-end: 0px;">
                @foreach($datas as $e => $val)
                    @if($val['ket']!="")
                    {!!  nl2br(str_replace('~','<br />',$val['ket'].'<br />' )) !!}
                    @endif
                    @if($val['ket']=="")
                    {!!  '<br />' !!}
                    @endif
{{--                    {!! nl2br(str_replace(" ", " &nbsp;", $val['ket'])) !!}--}}                
                @endforeach
                </p>
            </div>

            <hr>
{{--            <table style="border-collapse: collapse" cellspacing="0" cellpadding="0" bordercolor="#000000" border="1" width="100%">--}}
{{--                <tbody>--}}
{{--                <tr>--}}
{{--                    <td ><b style="font-size: 8pt" face="Arial" color="#000000">&nbsp;<b></b> {{ (string) $raw->namaproduk}}</b></td>--}}
{{--                 </tr>--}}
{{--                <tr>--}}
{{--                    <td ><font style="font-size: 8pt" face="Arial" color="#000000">&nbsp; {{ (string) $raw->keterangan}}</font></td>--}}
{{--                </tr>--}}
{{--                </tbody>--}}
{{--            </table>--}}
            
        </td>
    </tr>

        <tr >
            <td>
                <table style="margin-top:15px;">
                    <tr>
                        <td width="600"></td>
                    </tr>
                    <tr>
                        <td ></td>
                        <td width="250" style="text-align: center; vertical-align:top;">
                            <font style="font-size: 12pt" face="Arial">Sleman, {{ App\Traits\Valet::getDateIndo(date('Y-m-d'))   }}</font>
                            <br>
                            <font style="font-size: 12pt;" face="Arial">Pemeriksa</font>
                        </td>
                    </tr>

                    <tr>
                        <td height="200"></td>
                        <td width="300" style="text-align: center; vertical-align:top;">
                            @if (file_exists(public_path('img/radiologi/'.$raw->pgid.'.jpeg')))
                            <img src="{{ asset('service/img/radiologi/'.$raw->pgid.'.jpeg') }}"
                                 style="max-width:200px;height:100px;margin-top: -40px;" border="0">
                            @endif
                        <br>
                        <div style="display:inline-block; width:75px; height:75px; margin:5px auto;">
                        {!! $qrcode !!}
                        </div>
                        <div style="margin-top:5px;"></div>
                        <br>
                            <font face="Arial" style="font-size: 12pt"><b>{{ '( '. $raw->dokterrad .' )'}} </b><br><i>NIP :  {{ $raw->nippns != null? $raw->nippns:'-' }} </i></font>
                        <br>
                            <span style="font-weight: bold;color: #ccc">Ditandatangani secara elektronik</span>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>


@endsection
