
@extends('template.template')
@section('content-body')
{{--<hr--}}
<style type="text/css">

</style>
    <tr>

        <td bordercolor="#808080" height="13">
            <font style="font-size: 11pt" face="Arial" color="#000000">
                    <span style="font-weight: 700;font-size: 12pt">
                        HASIL PEMERIKSAAN LABORATORIUM
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
                    <td height="25" width="82">
                        <font style="font-size: 9pt" face="Arial">No Lab / No RM</font>
                    </td>
                    <td>:</td>
                    <td height="25" width="401"><b><font style="font-size: 9pt" face="Arial"> {{ $raw->noorder .' / '. $raw->nocm }}</font></b></td>
                    <td height="25" width="105">
                        <font style="font-size: 9pt" face="Arial">Tgl Pemeriksaan</font>
                    </td>
                    <td>:</td>
                    <td height="25"><b><font style="font-size: 9pt" face="Arial">{{ date ('d-m-Y H:i:s', strtotime($data['res'][0]->reg_date ))   }}</font></b></td>

                </tr>
                <tr>
                    <td height="25" width="82">
                        <font style="font-size: 9pt" face="Arial">Nama Pasien</font>
                    </td>
                    <td>:</td>
                    <td height="25" width="401"><b><font style="font-size: 9pt" face="Arial">{{   $raw->namapasien }} </font></b></td>
                    <td height="25" width="105">
                        <font style="font-size: 9pt" face="Arial">Tgl Hasil Selesai</font>
                    </td>
                    <td>:</td>
                   
                    <td height="25"><b><font style="font-size: 9pt" face="Arial">{{    date ('d-m-Y H:i:s', strtotime($data['res'][0]->visit_date))   }} </font></b></td>

                </tr>
                <tr>
                    <td height="25" width="82">
                        <font style="font-size: 9pt" face="Arial">Umur / Jenis Kelamin</font>
                    </td>
                    <td>:</td>
                    <td height="25" width="401"><b><font style="font-size: 9pt" face="Arial">{{ $raw->umur . ' / '. $raw->jeniskelamin  }} </font></b></td>
                    <td height="25" width="105">
                        <font style="font-size: 9pt" face="Arial">Dokter</font>
                    </td>
                    <td>:</td>
                    <td height="25"><b><font style="font-size: 9pt" face="Arial">{{  $raw->dokterverif == null ? '-':$raw->dokterverif }} </font></b></td>

                </tr>
                <tr>
                    <td height="25" width="92">
                        <font style="font-size: 9pt" face="Arial">Tgl Lahir</font>
                    </td>
                    <td>:</td>
                    <td height="25" width="401"><b><font style="font-size: 9pt" face="Arial">{{  date('d-m-Y', strtotime($raw->tgllahir))  }} </font></b></td>
                    <td height="25" width="105">
                        <font style="font-size: 9pt" face="Arial">Ruang</font>
                    </td>
                    <td>:</td>
                    <td height="25"><b><font style="font-size: 9pt" face="Arial">{{ $raw->namaruangan  }}  </font></b></td>

                </tr>
                <tr>
                    <td height="25" width="92">
                        <font style="font-size: 9pt" face="Arial">Alamat</font>
                    </td>
                    <td>:</td>
                    <td height="25" width="401"><b><font style="font-size: 9pt" face="Arial">{{ $raw->alamatlengkap }} </font></b></td>
                    <td height="25" width="105">
                        <font style="font-size: 9pt" face="Arial">Penanggung Jawab</font>
                    </td>
                    <td>:</td>
                    <td height="25"><b><font style="font-size: 9pt" face="Arial">{{   $raw->djp  }}  </font></b></td>

                </tr>
                <tr>
                    <td height="25" width="92">
                        <font style="font-size: 9pt" face="Arial">Diagnosa</font>
                    </td>
                    <td>:</td>
                    <td height="25" width="401"><b><font style="font-size: 9pt" face="Arial">{{ $raw->diagnosa  }} </font></b></td>
                    <td height="25" width="105">
                        <font style="font-size: 9pt" face="Arial">Cara Bayar</font>
                    </td>
                    <td>:</td>
                    <td height="25"><b><font style="font-size: 9pt" face="Arial">{{ $raw->kelompokpasien  }}  </font></b></td>

                </tr>
                </tbody>
            </table>

        </td>
    </tr>
    <tr>
        <td bordercolor="#808080" height="13"></td>
    </tr>
    <tr>
        <td bordercolor="#808080" height="13">
            <table style="border-collapse: collapse" cellspacing="0" cellpadding="0" bordercolor="#000000" border="1" width="100%" rules=none>
                <tbody>
                <tr  style="border:1px solid #000000">
{{--                    <td rowspan="2" bgcolor="#ffffff" align="center" height="25" width="1%"><font style="font-size: 9pt" face="Arial" color="#000000"><b>NO</b></font></td>--}}
                    <td  bgcolor="#ffffff" align="center" height="25" width="20%"><font style="font-size: 9pt" face="Arial" color="#000000"><b>Nama Test</b></font></td>
                    <td  bgcolor="#ffffff" align="center" height="25" width="3%"><font style="font-size: 9pt" face="Arial" color="#000000"><b>Flag</b></font></td>
                    <td  bgcolor="#ffffff" align="center" height="25" width="10%"><font style="font-size: 9pt" face="Arial" color="#000000"><b>Hasil</b></font></td>
                    <td  bgcolor="#ffffff" align="center" height="25" width="10%"><font style="font-size: 9pt" face="Arial" color="#000000"><b>Satuan</b></font></td>
                    <td  bgcolor="#ffffff" align="center" height="25" width="15%"><font style="font-size: 9pt" face="Arial" color="#000000"><b>Nilai Rujukan</b></font></td>
                    <td  bgcolor="#ffffff" align="center" height="25" width="10%"><font style="font-size: 9pt" face="Arial" color="#000000"><b>Metode</b></font></td>
{{--                    <td rowspan="2" bgcolor="#ffffff" align="center" height="25" width="1%"><font style="font-size: 9pt" face="Arial" color="#000000"><b>KERJA</b></font></td>--}}

                </tr>
                @if($data['jenis'] == 'bridging')
                    @php
                        $ru ='';
                    @endphp
                    @forelse($data['res'] as $key => $dat)
                        @if($ru != $dat->treatment_name)
                            @if(  isset($dat->treatment_name ))
                                <tr>
                                    <td style="color: black;text-align:
                                     left; background-color: #ffffff;font-weight: bold;
                                      font-size: 10pt"
                                        colspan="6">
                                        {{ $dat->treatment_name }}
                                    </td>
                                </tr>
                            @else

                            @endif
                            @php
                                $ru =  $dat->treatment_name;
                            @endphp
                        @endif
                        <tr style="border:0">
{{--                            <td align="center"><font style="font-size: 8pt" face="Arial" color="#000000"> {{$key +1}}</td></td>--}}
                            <td ><font style="font-size: 8pt" face="Arial" color="#000000">&nbsp; {{ (string) $dat->examination_name}}</font></td>
                            <td ><font style="font-size: 8pt" face="Arial" color="#000000">&nbsp; {{$dat->flag}}</font></td>
                            <td ><font style="font-size: 8pt" face="Arial" color="#000000">&nbsp; {{$dat->result_value}}</font></td>
                            <td ><font style="font-size: 8pt" face="Arial" color="#000000">&nbsp; {{$dat->unit}}</font></td>
                            <td ><font style="font-size: 8pt" face="Arial" color="#000000">&nbsp; {{$dat->normal_value}}</font></td>
                            <td ><font style="font-size: 8pt" face="Arial" color="#000000">&nbsp; {{$dat->metode}}</font></td>
                        </tr>
{{--                            @endforeach--}}
                    @empty
                    @endforelse
                 @endif

          {{--       @if($data['jenis'] == 'nonbridging')
                    @php
                        $ru ='';
                    @endphp
                    @forelse($data['res'] as $key => $dat)
                        @if($ru != $dat->KEL_PEMERIKSAAN)
                            @if(  isset($dat->KEL_PEMERIKSAAN ))
                                <tr>
                                    <td style="color: black;text-align:
                                     left; background-color: #ffffff;font-weight: bold;
                                      font-size: 10pt"
                                        colspan="6">
                                        {{ $dat->KEL_PEMERIKSAAN }}
                                    </td>
                                </tr>
                            @else

                            @endif
                            @php
                                $ru =  $dat->KEL_PEMERIKSAAN;
                            @endphp
                        @endif
                        <tr>
                            <td ><font style="font-size: 8pt" face="Arial" color="#000000">&nbsp; {{ (string) $dat->PARAMETER_NAME}}</font></td>
                            <td ><font style="font-size: 8pt" face="Arial" color="#000000">&nbsp; {{$dat->FLAG_HL}}</font></td>
                            <td ><font style="font-size: 8pt" face="Arial" color="#000000">&nbsp; {{$dat->HASIL}}</font></td>
                            <td ><font style="font-size: 8pt" face="Arial" color="#000000">&nbsp; {{$dat->SATUAN}}</font></td>
                            <td ><font style="font-size: 8pt" face="Arial" color="#000000">&nbsp; {{$dat->NILAI_RUJUKAN}}</font></td>
                            <td ><font style="font-size: 8pt" face="Arial" color="#000000">&nbsp; {{$dat->METODE_PERIKSA}}</font></td>
                        </tr>
              
                    @empty
                    @endforelse
                 @endif--}}


                   @if($data['jenis'] == 'nonbridging')
                    @php
                        $ru ='';
                    @endphp
                    @forelse($data['res']->groupBy('KEL_PEMERIKSAAN') as $key => $dats)
                     
                        <tr>
                            <td style="color: black;text-align:
                             left; background-color: #ffffff;font-weight: bold;
                              font-size: 10pt"
                                colspan="6">
                                {{ $key }}
                            </td>
                        </tr>
                          @foreach ($dats->groupBy('TARIF_NAME')  as $key2 => $datss) 
                          @php
                            $jml = count($dats->groupBy('TARIF_NAME'));
                          @endphp
                          @if( $jml > 1)
                          <tr>
                            <td style="color: black;text-align:
                             left; background-color: #ffffff;font-weight: bold;font-size: 8pt"
                                colspan="6">
                                &nbsp; {{ $key2 }}
                            </td>
                        </tr>
                        @endif
                         @foreach ($datss as $dat) 
                            <tr>
                                <td ><font style="font-size: 8pt" face="Arial" color="#000000">&nbsp; &nbsp; {{ $dat->PARAMETER_NAME}}</font></td>
                                <td ><font style="font-size: 8pt" face="Arial" color="#000000">&nbsp; &nbsp; {{$dat->FLAG_HL}}</font></td>
                                <td ><font style="font-size: 8pt" face="Arial" color="#000000">&nbsp; &nbsp; {{$dat->HASIL}}</font></td>
                                <td ><font style="font-size: 8pt" face="Arial" color="#000000">&nbsp; &nbsp; {{$dat->SATUAN}}</font></td>
                                <td ><font style="font-size: 8pt" face="Arial" color="#000000">&nbsp; &nbsp; {{$dat->NILAI_RUJUKAN}}</font></td>
                                <td ><font style="font-size: 8pt" face="Arial" color="#000000">&nbsp; &nbsp; {{$dat->METODE_PERIKSA}}</font></td>
                            </tr>
                              @endforeach
                        @endforeach
              
                    @empty
                    @endforelse
                 @endif
                </tbody>
            </table>
        </td>
    </tr>
@endsection
