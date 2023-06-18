@extends('report.dom')
@section('content')
    
    <body>
        <section style="font-family:Tahoma;padding:10mm">
            <table cellspacing="0" cellpadding="0" border="0" width="100%">
                <tbody>
                    <tr>
                        <td width="10%" style="padding: 5px">
                            {{-- @if (stripos(\Request::url(), 'localhost') !== false) --}}
                                <img src="img/logo_grhasia_com.png" alt="Logo" style="width: 90px;">
                            {{-- @else --}}
                                {{-- <img src="service/img/logo_only.png" alt="" style="width: 90px;"> --}}
                            {{-- @endif --}}
                        </td>
                        <td style="text-align: left">
                            <b>
                                <span style="font-size: 16px">{!! $res['profile']->namalengkap !!}</span>
                                </br>
                                </br>
                                <span style="font-size: 14px;">{!! $res['profile']->alamatlengkap !!}</span>
                            </b>
                        </td>
                        @php
                            $reportController = new \App\Http\Controllers\Report\ReportController;
                        @endphp
                        <td width="50%" style="padding: 10px">
                            <div class="box" style="text-align: left">
                                <table style="padding: 3px;">
                                    <tr>
                                        <td class="f-s-15 bold  text-top" style="width: 100px">No. RM</td>
                                        <td class="f-s-15 bold  text-top">:</td>
                                        <td class="f-s-15 bold text-top"><b>{{ $res['datapasien']->nocm }}</b></td>
                                    </tr>
                                    <tr>
                                        <td class="f-s-15 bold  text-top">Nama</td>
                                        <td class="f-s-15 bold  text-top">:</td>
                                        <td class="f-s-15 bold  text-top"><b>{{ $res['datapasien']->namapasien }}</b>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="f-s-15 bold  text-top">Jenis Kelamin</td>
                                        <td class="f-s-15 bold  text-top">:</td>
                                        <td class="f-s-15 bold  text-top">
                                            <b>{{ $res['datapasien']->jeniskelamin }}</b>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="f-s-15 bold  text-top">Tgl Lahir</td>
                                        <td class="f-s-15 bold  text-top">:</td>
                                        <td class="f-s-15 bold  text-top">
                                            <b>{{ $reportController->tanggal_indonesia(date('Y-m-d', strtotime($res['datapasien']->tgllahir))) }}</b>
                                            
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="f-s-15 bold  text-top">Ruangan</td>
                                        <td class="f-s-15 bold  text-top">:</td>
                                        <td class="f-s-15 bold  text-top"><b>{{ $res['datapasien']->namaruangan }}</b>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <hr style="border:2px solid #000;margin-bottom:0px">
            <hr style="border:0.5px solid #000;margin-top:2px">
            <table>
                <tr>
                    <td>
                        <table style="text-align: center">
                            <tr style="text-align: center">
                                <th style="font-size: 20px;text-align: center">CATATAN PERKEMBANGAN PASIEN
                                    TERINTEGRASI
                                </th>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>

            <table width="100%" border="1" bordercolor="#000000" cellspacing="0" cellpadding="0" class="garis6"
                style="margin-left: 2px">
                <tr>
                    <th rowspan="2">Tanggal/Jam</th>
                    <th rowspan="2">Profesional Pemberi Asuhan</th>
                    <th>Hasil Asesmen Pasien Dan Pemberian Pelayanan</th>
                    <th rowspan="2">Intruksi PPA</th>
                    <th rowspan="2"> Riview & Verifikasi DPJP</th>
                </tr>
                <tr>
                    <th >SOAP</th>
                </tr>
                @foreach ($res['d'] as $r)
                    <tr>
                        <td>{{$r->tgljam}}</td>
                        <td>{{$r->jenisppa}}</td>
                        <td style="white-space: pre-line;">
                        {{$r->soap}}

                             <br><br> {{$r->tenagamedis}}</td>
                        <td style="vertical-align: top">{{$r->ppa}}</td>
                        <td><span style="vertical-align: top">{{$r->dpjp}}
                            </span> <br><br> <span style="vertical-align: bottom"> {{$r->tgldpjp}} <br> <br>{{$r->dropdpjp}}</span></td>
                    </tr>
                @endforeach
            </table>

            
        </section>
        
    </body>
@endsection
