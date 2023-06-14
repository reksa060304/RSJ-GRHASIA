@extends('report.dom')
@section('content')

    <body>
        <section style="font-family:Tahoma;padding:10mm">
            <table cellspacing="0" cellpadding="0" border="0" width="100%">
                <tbody>
                    <tr>
                        <td width="10%" style="padding: 5px">
                            {{-- @if (stripos(\Request::url(), 'localhost') !== false) --}}
                                <img src="img/logo_only.png" alt="Logo" style="width: 90px;">
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
                        <td width="50%" style="padding: 10px">
                            <div class="box" style="text-align: left">
                                <table style="padding: 3px;">
                                    <tr>
                                        <td class="f-s-15 bold  text-top" style="width: 100px">No. RM</td>
                                        <td class="f-s-15 bold  text-top">:</td>
                                        <td class="f-s-15 bold text-top"><b>{{ $data[0]->nocm }}</b></td>
                                    </tr>
                                    <tr>
                                        <td class="f-s-15 bold  text-top">Nama</td>
                                        <td class="f-s-15 bold  text-top">:</td>
                                        <td class="f-s-15 bold  text-top"><b>{{ $data[0]->namapasien }}</b>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="f-s-15 bold  text-top">Jenis Kelamin</td>
                                        <td class="f-s-15 bold  text-top">:</td>
                                        <td class="f-s-15 bold  text-top">
                                            <b>{{ $data[0]->jeniskelamin }}</b>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="f-s-15 bold  text-top">Tgl Lahir</td>
                                        <td class="f-s-15 bold  text-top">:</td>
                                        <td class="f-s-15 bold  text-top">
                                            <b>{{ date('d-m-Y', strtotime($data[0]->tgllahir)) }}</b>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="f-s-15 bold  text-top">Ruangan</td>
                                        <td class="f-s-15 bold  text-top">:</td>
                                        <td class="f-s-15 bold  text-top"><b>{{ $data[0]->namaruangan }}</b>
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
                    <th>SOAP</th>
                </tr>
                @if (isset($item[111348]))
                    <tr>
                        <td>{{ isset($item[111348]) ? $item[111348] : '' }}</td>
                        <td>{{ isset($item[111349]) ? $item[111349] : '' }}</td>
                        <td>
                            {{ isset($item[111350]) ? $item[111350] : '' }}
                            <p> {{ isset($item[111351]) ? $item[111351] : '' }}</p>
                        </td>
                        <td>{{ isset($item[111354]) ? $item[111354] : '' }}</td>
                        <td>
                            {{ isset($item[111355]) ? $item[111355] : '' }}
                            <p> {{ isset($item[111356]) ? $item[111356] : '' }}</p>
                            <p> {{ isset($item[111357]) ? $item[111357] : '' }}

                            </p>
                        </td>
                    </tr>
                @endif
                @if (isset($item[111358]))
                    <tr>
                        <td>{{ isset($item[111358]) ? $item[111358] : '' }}</td>
                        <td>{{ isset($item[111359]) ? $item[111359] : '' }}</td>
                        <td>
                            {{ isset($item[111360]) ? $item[111360] : '' }}
                            <p> {{ isset($item[111361]) ? $item[111361] : '' }}</p>
                        </td>
                        <td>{{ isset($item[111364]) ? $item[111364] : '' }}</td>
                        <td>
                            {{ isset($item[111395]) ? $item[111395] : '' }}
                            <p> {{ isset($item[111396]) ? $item[111396] : '' }}</p>
                            <p> {{ isset($item[111397]) ? $item[111397] : '' }}</p>
                        </td>
                    </tr>
                @endif
                @if (isset($item[111368]))
                    <tr>
                        <td> {{ isset($item[111368]) ? $item[111368] : '' }}</td>
                        <td>{{ isset($item[111369]) ? $item[111369] : '' }}</td>
                        <td>
                            {{ isset($item[111370]) ? $item[111370] : '' }}
                            <p> {{ isset($item[111371]) ? $item[111371] : '' }}</p>
                        </td>
                        <td>{{ isset($item[111374]) ? $item[111374] : '' }}</td>
                        <td>
                            {{ isset($item[111435]) ? $item[111435] : '' }}
                            <p> {{ isset($item[111436]) ? $item[111436] : '' }}</p>
                            <p> {{ isset($item[111437]) ? $item[111437] : '' }}</p>
                        </td>
                    </tr>
                @endif
                @if (isset($item[111378]))
                    <tr>
                        <td> {{ isset($item[111378]) ? $item[111378] : '' }}</td>
                        <td>{{ isset($item[111379]) ? $item[111379] : '' }}</td>
                        <td>
                            {{ isset($item[111380]) ? $item[111380] : '' }}
                            <p> {{ isset($item[111381]) ? $item[111381] : '' }}</p>
                        </td>
                        <td>{{ isset($item[111384]) ? $item[111384] : '' }}</td>
                        <td>
                            {{ isset($item[111480]) ? $item[111480] : '' }}
                            <p> {{ isset($item[111481]) ? $item[111481] : '' }}</p>
                            <p> {{ isset($item[111482]) ? $item[111482] : '' }}</p>
                        </td>
                    </tr>
                @endif
                @if (isset($item[111388]))
                    <tr>
                        <td> {{ isset($item[111388]) ? $item[111388] : '' }}</td>
                        <td>{{ isset($item[111389]) ? $item[111389] : '' }}</td>
                        <td>
                            {{ isset($item[111390]) ? $item[111390] : '' }}
                            <p> {{ isset($item[111391]) ? $item[111391] : '' }}</p>
                        </td>
                        <td>{{ isset($item[111394]) ? $item[111394] : '' }}</td>
                        <td>
                            {{ isset($item[111520]) ? $item[111520] : '' }}
                            <p> {{ isset($item[111521]) ? $item[111521] : '' }}</p>
                            <p> {{ isset($item[111522]) ? $item[111522] : '' }}</p>
                        </td>
                    </tr>
                @endif
                @if (isset($item[111398]))
                    <tr>
                        <td> {{ isset($item[111398]) ? $item[111398] : '' }}</td>
                        <td>{{ isset($item[111399]) ? $item[111399] : '' }}</td>
                        <td>
                            {{ isset($item[111400]) ? $item[111400] : '' }}
                            <p> {{ isset($item[111401]) ? $item[111401] : '' }}</p>
                        </td>
                        <td>{{ isset($item[111404]) ? $item[111404] : '' }}</td>
                        <td>
                            {{ isset($item[111560]) ? $item[111560] : '' }}
                            <p> {{ isset($item[111561]) ? $item[111561] : '' }}</p>
                            <p> {{ isset($item[111562]) ? $item[111562] : '' }}</p>
                        </td>
                    </tr>
                @endif
                @if (isset($item[111408]))
                    <tr>
                        <td> {{ isset($item[111408]) ? $item[111408] : '' }}</td>
                        <td>{{ isset($item[111409]) ? $item[111409] : '' }}</td>
                        <td>
                            {{ isset($item[111410]) ? $item[111410] : '' }}
                            <p> {{ isset($item[111411]) ? $item[111411] : '' }}</p>
                        </td>
                        <td>{{ isset($item[111414]) ? $item[111414] : '' }}</td>
                        <td>
                            {{ isset($item[21040380]) ? $item[21040380] : '' }}
                            <p> {{ isset($item[21040381]) ? $item[21040381] : '' }}</p>
                            <p> {{ isset($item[21040382]) ? $item[21040382] : '' }}</p>
                        </td>
                    </tr>
                @endif
                @if (isset($item[111418]))
                    <tr>
                        <td> {{ isset($item[111418]) ? $item[111418] : '' }}</td>
                        <td>{{ isset($item[111419]) ? $item[111419] : '' }}</td>
                        <td>
                            {{ isset($item[111420]) ? $item[111420] : '' }}
                            <p> {{ isset($item[111421]) ? $item[111421] : '' }}</p>
                        </td>
                        <td>{{ isset($item[111424]) ? $item[111424] : '' }}</td>
                        <td>
                            {{ isset($item[21040383]) ? $item[21040383] : '' }}
                            <p> {{ isset($item[21040384]) ? $item[21040384] : '' }}</p>
                            <p> {{ isset($item[21040385]) ? $item[21040385] : '' }}</p>
                        </td>
                    </tr>
                @endif
                @if (isset($item[111428]))
                    <tr>
                        <td> {{ isset($item[111428]) ? $item[111428] : '' }}</td>
                        <td>{{ isset($item[111429]) ? $item[111429] : '' }}</td>
                        <td>
                            {{ isset($item[111430]) ? $item[111430] : '' }}
                            <p> {{ isset($item[111431]) ? $item[111431] : '' }}</p>
                        </td>
                        <td>{{ isset($item[111434]) ? $item[111434] : '' }}</td>
                        <td>
                            {{ isset($item[21040386]) ? $item[21040386] : '' }}
                            <p> {{ isset($item[21040387]) ? $item[21040387] : '' }}</p>
                            <p> {{ isset($item[21040388]) ? $item[21040388] : '' }}</p>
                        </td>
                    </tr>
                @endif
                @if (isset($item[111438]))
                    <tr>
                        <td> {{ isset($item[111438]) ? $item[111438] : '' }}</td>
                        <td>{{ isset($item[111439]) ? $item[111439] : '' }}</td>
                        <td>
                            {{ isset($item[111440]) ? $item[111440] : '' }}
                            <p> {{ isset($item[111441]) ? $item[111441] : '' }}</p>
                        </td>
                        <td>{{ isset($item[111444]) ? $item[111444] : '' }}</td>
                        <td>
                            {{ isset($item[21040389]) ? $item[21040389] : '' }}
                            <p> {{ isset($item[21040390]) ? $item[21040390] : '' }}</p>
                            <p> {{ isset($item[21040391]) ? $item[21040391] : '' }}</p>
                        </td>
                    </tr>
                @endif
                @if (isset($item[111448]))
                    <tr>
                        <td> {{ isset($item[111448]) ? $item[111448] : '' }}</td>
                        <td>{{ isset($item[111449]) ? $item[111449] : '' }}</td>
                        <td>
                            {{ isset($item[111450]) ? $item[111450] : '' }}
                            <p> {{ isset($item[111451]) ? $item[111451] : '' }}</p>
                        </td>
                        <td>{{ isset($item[111454]) ? $item[111454] : '' }}</td>
                        <td>
                            {{ isset($item[21040392]) ? $item[21040392] : '' }}
                            <p> {{ isset($item[21040393]) ? $item[21040393] : '' }}</p>
                            <p> {{ isset($item[21040394]) ? $item[21040394] : '' }}</p>
                        </td>
                    </tr>
                @endif
                @if (isset($item[111458]))
                    <tr>
                        <td> {{ isset($item[111458]) ? $item[111458] : '' }}</td>
                        <td>{{ isset($item[111459]) ? $item[111459] : '' }}</td>
                        <td>
                            {{ isset($item[111460]) ? $item[111460] : '' }}
                            <p> {{ isset($item[111460]) ? $item[111460] : '' }}</p>
                        </td>
                        <td>{{ isset($item[111464]) ? $item[111464] : '' }}</td>
                        <td>
                            {{ isset($item[21040395]) ? $item[21040395] : '' }}
                            <p> {{ isset($item[21040396]) ? $item[21040396] : '' }}</p>
                            <p> {{ isset($item[21040397]) ? $item[21040397] : '' }}</p>
                        </td>
                    </tr>
                @endif
                @if (isset($item[111473]))
                    <tr>
                        <td> {{ isset($item[111473]) ? $item[111473] : '' }}</td>
                        <td>{{ isset($item[111474]) ? $item[111474] : '' }}</td>
                        <td>
                            {{ isset($item[111475]) ? $item[111475] : '' }}
                            <p> {{ isset($item[111476]) ? $item[111476] : '' }}</p>
                        </td>
                        <td>{{ isset($item[111479]) ? $item[111479] : '' }}</td>
                        <td>
                            {{ isset($item[21040398]) ? $item[21040398] : '' }}
                            <p> {{ isset($item[21040399]) ? $item[21040399] : '' }}</p>
                            <p> {{ isset($item[21040400]) ? $item[21040400] : '' }}</p>
                        </td>
                    </tr>
                @endif
                @if (isset($item[111483]))
                    <tr>
                        <td> {{ isset($item[111483]) ? $item[111483] : '' }}</td>
                        <td>{{ isset($item[111484]) ? $item[111484] : '' }}</td>
                        <td>
                            {{ isset($item[111485]) ? $item[111485] : '' }}
                            <p> {{ isset($item[111486]) ? $item[111486] : '' }}</p>
                        </td>
                        <td>{{ isset($item[111489]) ? $item[111489] : '' }}</td>
                        <td>
                            {{ isset($item[21040401]) ? $item[21040401] : '' }}
                            <p> {{ isset($item[21040402]) ? $item[21040402] : '' }}</p>
                            <p> {{ isset($item[21040403]) ? $item[21040403] : '' }}</p>
                        </td>
                    </tr>
                @endif
                @if (isset($item[111493]))
                    <tr>
                        <td> {{ isset($item[111493]) ? $item[111493] : '' }}</td>
                        <td>{{ isset($item[111494]) ? $item[111494] : '' }}</td>
                        <td>
                            {{ isset($item[111495]) ? $item[111495] : '' }}
                            <p> {{ isset($item[111496]) ? $item[111496] : '' }}</p>
                        </td>
                        <td>{{ isset($item[111499]) ? $item[111499] : '' }}</td>
                        <td>
                            {{ isset($item[21040404]) ? $item[21040404] : '' }}
                            <p> {{ isset($item[21040405]) ? $item[21040405] : '' }}</p>
                            <p> {{ isset($item[21040406]) ? $item[21040406] : '' }}</p>
                        </td>
                    </tr>
                @endif
                @if (isset($item[111503]))
                    <tr>
                        <td> {{ isset($item[111503]) ? $item[111503] : '' }}</td>
                        <td>{{ isset($item[111504]) ? $item[111504] : '' }}</td>
                        <td>
                            {{ isset($item[111505]) ? $item[111505] : '' }}
                            <p> {{ isset($item[111506]) ? $item[111506] : '' }}</p>
                        </td>
                        <td>{{ isset($item[111509]) ? $item[111509] : '' }}</td>
                        <td>
                            {{ isset($item[21040407]) ? $item[21040407] : '' }}
                            <p> {{ isset($item[21040408]) ? $item[21040408] : '' }}</p>
                            <p> {{ isset($item[21040409]) ? $item[21040409] : '' }}</p>
                        </td>
                    </tr>
                @endif
                @if (isset($item[111513]))
                    <tr>
                        <td> {{ isset($item[111513]) ? $item[111513] : '' }}</td>
                        <td>{{ isset($item[111514]) ? $item[111514] : '' }}</td>
                        <td>
                            {{ isset($item[111515]) ? $item[111515] : '' }}
                            <p> {{ isset($item[111516]) ? $item[111516] : '' }}</p>
                        </td>
                        <td>{{ isset($item[111519]) ? $item[111519] : '' }}</td>
                        <td>
                            {{ isset($item[21040410]) ? $item[21040410] : '' }}
                            <p> {{ isset($item[21040411]) ? $item[21040411] : '' }}</p>
                            <p> {{ isset($item[21040412]) ? $item[21040412] : '' }}</p>
                        </td>
                    </tr>
                @endif
                @if (isset($item[111523]))
                    <tr>
                        <td> {{ isset($item[111523]) ? $item[111523] : '' }}</td>
                        <td>{{ isset($item[111524]) ? $item[111524] : '' }}</td>
                        <td>
                            {{ isset($item[111525]) ? $item[111525] : '' }}
                            <p> {{ isset($item[111526]) ? $item[111526] : '' }}</p>
                        </td>
                        <td>{{ isset($item[111529]) ? $item[111529] : '' }}</td>
                        <td>
                            {{ isset($item[21040413]) ? $item[21040413] : '' }}
                            <p> {{ isset($item[21040414]) ? $item[21040414] : '' }}</p>
                            <p> {{ isset($item[21040415]) ? $item[21040415] : '' }}</p>
                        </td>
                    </tr>
                @endif
            </table>

            
        </section>
        
    </body>
@endsection
