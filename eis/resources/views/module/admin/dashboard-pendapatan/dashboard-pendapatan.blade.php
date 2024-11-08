@extends('template.template3')
@section('css')
    <style>
        .pcoded .pcoded-inner-content {
            padding: 10px 0 10px 0;
        }

        .class-icon {
            font-size: 50px;

            padding: 5px;
            border-radius: 5px;
            background: #bcbcbc8a;
        }
        .pad{
            padding-top: 3rem;
        }
        @media (min-width: 992px) {
            .pad {
                padding-top: 1.8rem;
            }
        }
        .modal-lg .kons{
            width:1140px;
        }
        @media only screen and (max-width: 575px) {
            .latest-update-card .card-block .latest-update-box .update-meta {
                z-index: 2;
                min-width: 0;
                text-align: left !important;
                margin-bottom: 15px;
                border-top: 1px solid #f1f1f1;
                padding-top: 15px;
            }
        }
         #return-to-top {
            z-index: 999;
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #404e67;
            width: 50px;
            height: 50px;
            display: block;
            text-decoration: none;
            -webkit-border-radius: 35px;
            -moz-border-radius: 35px;
            border-radius: 35px;
            display: none;
            -webkit-transition: all 0.3s linear;
            -moz-transition: all 0.3s ease;
            -ms-transition: all 0.3s ease;
            -o-transition: all 0.3s ease;
            transition: all 0.3s ease;
            }
         #return-to-top i {
            color: #fff;
            margin: 0;
            position: relative;
            left: 16px;
            top: 13px;
            font-size: 19px;
            -webkit-transition: all 0.3s ease;
            -moz-transition: all 0.3s ease;
            -ms-transition: all 0.3s ease;
            -o-transition: all 0.3s ease;
            transition: all 0.3s ease;
            }
           #return-to-top:hover {
             background: rgba(0, 0, 0, 0.62);
           }
          #return-to-top:hover i {
            color: #fff;
            top: 5px;
          }
    </style>
@endsection
@section('content-body')
  <a href="javascript:" id="return-to-top"><i class="fa fa-chevron-up"></i></a>
    <div class="page-wrapper pad" style="margin-top:20px">
        <div class="page-body">
            <div class="card">
                <div class="card-header">
                    <h5>Dashboard Pendapatan</h5>
                </div>
                <div class="card-block tab-icon">
                    <form action="{!! route("show_page", ["role" => session('role'), "pages" => $r->pages ]) !!}" method="get">
                        <div class="row">
                            <div class="col-lg-1">
                            </div>
                            <div class="col-lg-2" style="margin-top: 5px">
                                <div class="input-group" >
                                    <span class="input-group-addon" id="basic-addon1"><i class="ti-calendar"></i></span>
                                    <input type="text" id="tglawal" name="tglawal" class="date-custom form-control" value="{{request()->get("tglawal")}}" >
                                </div>

                            </div>
                            <div class="col-lg-2" style="margin-top: 5px">
                                <div class="input-group">
                                    <span class="input-group-addon" id="basic-addon1"><i class="ti-calendar"></i></span>
                                    <input type="text" id="tglakhir" name="tglakhir"  class="date-custom form-control" value="{{request()->get("tglakhir")}}" >
                                </div>
                            </div>
                            <div class="col-lg-2" style="margin-top: 5px">
                                <select class="js-example-basic-single form-control" name="departemen" id="departemen">
                                    <option value="">All Departemen</option> <!-- Default option for All -->
                                    @forelse($departemen as $item)
                                        <option value="{{$item->id}}" {{ $r->departemen == $item->id ? "selected" : "" }}>
                                            {{$item->namadepartemen}}
                                        </option>
                                    @empty
                                        <option value="">No Data Available</option>
                                    @endforelse
                                </select>
                            </div>
                            <div class="col-lg-2" style="margin-top: 5px">
                                <select class="js-example-basic-single form-control" name="ruangan" id="ruangan">
                                    <option value="">All Ruangan</option> <!-- Default option for All -->
                                    @forelse($ruangan as $item)
                                        <option value="{{$item->id}}" {{ $r->ruangan == $item->id ? "selected" : "" }}>
                                            {{$item->namaruangan}}
                                        </option>
                                    @empty
                                        <option value="">No Data Available</option>
                                    @endforelse
                                </select>
                            </div>
                            <div class="col-lg-1" style="margin-top: 5px" >
                                <button class="btn btn-success  btn-outline-success"  type="submit">
                                    <i class="icofont icofont-search"></i>Search</button>
                            </div>
                        </div>
                        <div class="row" style="margin-top:10px ">
                            <div class="col-lg-12 col-md-12">
                                <div class="card">
                                    <div class="panel panel-primary">
                                        <div class="panel-heading bg-primary">
                                            Pendapatan Akrual
                                        </div>
                                        <div class="panel-body">
                                            @php
                                                $res['pendapatanakrual'] = App\Http\Controllers\MainController::getPendapatanAkrual(request()->get("tglawal"),request()->get("tglakhir"),session('kdProfile'));
                                            @endphp
                                            <div id="chartPendapatanAkrual"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-12 col-md-12">
                                <div class="card">
                                    <div class="panel panel-primary">
                                        <div class="panel-heading bg-c-pink" style="color:white;">
                                            Pendapatan Potensial
                                        </div>
                                        <div class="panel-body">
                                            @php
                                                $res['pendapatanpotensial'] = App\Http\Controllers\MainController::getPendapatanPotensial(request()->get("tglawal"),request()->get("tglakhir"),session('kdProfile'));
                                            @endphp
                                            <div id="chartPendapatanPotensial"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-12 col-md-12">
                                <div class="card">
                                    <div class="panel panel-purple">
                                        <div class="panel-heading bg-purple">
                                            Jumlah Pendapatan Per Kelompok Pasien
                                        </div>
                                        <div class="panel-body">
                                            @php
                                                $res['pendapatanperkelompokpasien'] = App\Http\Controllers\MainController::getPendapatanPerKelompokPasien(request()->get("tglawal"),request()->get("tglakhir"),session('kdProfile'));
                                            @endphp
                                            <div id="chartPendapatanPerKelompokPasien"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-12 col-md-12">
                                <div class="card">
                                    <div class="panel panel-warning">
                                        <div class="panel-heading  bg-green">
                                            Rincian Jumlah Obat Per DPJP
                                        </div>
                                        @php  
                                            $array =   App\Http\Controllers\MainController::getLaporanLayananDPJP(request()->get("tglawal"),request()->get("tglakhir"),session('kdProfile'));
                                        @endphp
                                        <div class="panel-body" >
                                            <div class="row" style="padding:10px 20px;">
                                                <div class="col-md-12">
                                                    <div class="table-responsive" >
                                                        <table class="table  table-striped table-sm table-styling" id="t_Layanan"
                                                               style="width:100%">
                                                            <thead class="table-default">
                                                            <tr>
                                                                <th style="color:black;width: 10%">NO </th>
                                                                <th style="color:black">DOKTER </th>
                                                                <th style="color:black">KELOMPOK PASIEN</th>
                                                                <th style="color:black">NAMA OBAT</th>
                                                                <th style="color:black;width: 10%">JUMLAH OBAT</th>
                                                                <th style="color:black;">TOTAL HARGA</th>
                                                            </tr>
                                                            </thead>
                                                            <tbody>

                                                            @forelse($array as $i => $d)

                                                                <tr>
                                                                    <td >{{ $i +1 }}</td>
                                                                    <td >{{ $d->namalengkap }}</td>
                                                                    <td >{{ $d->kelompokpasien }}</td>
                                                                    <td >{{ $d->namaproduk }}</td>
                                                                    <td >{{ $d->jumlahobat }}</td>
                                                                    <td style="text-align: right;">{{ number_format($d->harga,2,',','.') }}</td>
                                                                </tr>
                                                            @empty
                                                                <tr>
                                                                    <td colspan="3" style="text-align: center">Data Tidak ada</td>
                                                                </tr>
                                                            @endforelse

                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-12 col-md-12">
                                <div class="card">
                                    <div class="panel panel-warning">
                                        <div class="panel-heading bg-purple">
                                            Rincian Jumlah Obat Per DPJP Pasien Umum dan Karyawan
                                        </div>
                                        @php  
                                            $array = App\Http\Controllers\MainController::getLaporanLayananDPJPPasienUmum(request()->get("tglawal"),request()->get("tglakhir"),session('kdProfile'));
                                        @endphp
                                        <div class="panel-body" >
                                            <div class="row" style="padding:10px 20px;">
                                                <div class="col-md-12">
                                                    <div class="table-responsive" >
                                                        <table class="table table-striped table-sm table-styling"
                                                               style="width:100%">
                                                            <thead class="table-default">
                                                            <tr>
                                                                <th style="color:black;width: 10%">NO </th>
                                                                <th style="color:black">DOKTER </th>
                                                                <th style="color:black">KELOMPOK PASIEN</th>
                                                                <th style="color:black">NAMA OBAT</th>
                                                                <th style="color:black;width: 10%">JUMLAH OBAT</th>
                                                                <th style="color:black;">TOTAL HARGA</th>
                                                            </tr>
                                                            </thead>
                                                            <tbody>

                                                            @forelse($array as $i => $d)

                                                                <tr>
                                                                    <td >{{ $i +1 }}</td>
                                                                    <td >{{ $d->namalengkap }}</td>
                                                                    <td >{{ $d->kelompokpasien }}</td>
                                                                    <td >{{ $d->namaproduk }}</td>
                                                                    <td >{{ $d->jumlahobat }}</td>
                                                                    <td style="text-align: right;">{{ number_format($d->harga,2,',','.') }}</td>
                                                                </tr>
                                                            @empty
                                                                <tr>
                                                                    <td colspan="3" style="text-align: center">Data Tidak ada</td>
                                                                </tr>
                                                            @endforelse

                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-12 col-md-12">
                                <div class="card">
                                    <div class="panel panel-warning">
                                        <div class="panel-heading  bg-c-kuning">
                                            Pendapatan PerInstalasi
                                        </div>
                                        @php

                                            $sama = false;
                                            $resultSumDep = [];
                                            $array = $res['pendapatan']['data'];
                                           // dd($array);
                                            for ($i = 0; $i < count($array); $i++) {
                                                $sama = false;
                                                if(count($resultSumDep) > 0){
                                                   for ($x = 0; $x < count($resultSumDep); $x++) {
                                                        if ($resultSumDep[$x]['namadepartemen'] == $array[$i]->namadepartemen) {
                                                            $sama = true;
                                                            $resultSumDep[$x]['total'] = (float) $resultSumDep[$x]['total']+  (float)$array[$i]->total;
                                                        }
                                                    }
                                                }
                                                if ($sama == false) {
                                                    $resultSumDep []= [
                                                        'namadepartemen' =>  $array[$i]->namadepartemen,
                                                        'total' =>  $array[$i]->total,
                                                    ];
                                                }
                                            }

                                        @endphp
                                        <div class="panel-body" >
                                            <div class="row" style="padding:10px 20px;">
                                                <div class="col-md-12">
                                                    <div class="table-responsive" >
                                                        <table class="table  table-striped table-sm table-styling"
                                                               style="width:100%">
                                                           <thead class="table-default">
                                                            <tr>
                                                                <th style="color:black;width: 10%">NO </th>
                                                                <th style="color:black">NAMA INSTALASI </th>
                                                                <th style="text-align: right;color:black">JUMLAH </th>
                                                            </tr>
                                                            </thead>
                                                            <tbody>
                                                            @php
                                                                $total = 0;
                                                            @endphp
                                                            @forelse($resultSumDep as $i => $d)
                                                                @php
                                                                    $total = $total+$d['total']
                                                                @endphp
                                                                <tr>
                                                                    <td >{{ $i +1 }}</td>
                                                                    <td >{{ $d['namadepartemen'] }}</td>
                                                                    <td  style="text-align: right"> {{ App\Http\Controllers\MainController::formatRp($d['total']) }}</td>
                                                                </tr>
                                                            @empty
                                                                <tr>
                                                                    <td colspan="3" style="text-align: center">Data Tidak ada</td>
                                                                </tr>
                                                            @endforelse
                                                            <tr style="background:rgba(0,0,0,.3);">
                                                                <td colspan="2">TOTAL</td>
                                                                <td style="text-align: right">{{App\Http\Controllers\MainController::formatRp($total)}}</td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-6 col-md-12">
                                <div class="card">
                                    <div class="panel panel-success">
                                        <div class="panel-heading bg-success">
                                            Pendapatan PerJenis Pasien
                                        </div>
                                        <div class="panel-body">
                                            <div class="tab-content card-block">
                                                <div class="tab-pane active" id="home1" role="tabpanel">
                                                    <div id="chartPerKelompokPasienPie"></div>
                                                </div>
                                                <div class="tab-pane" id="profile1" role="tabpanel">
                                                    <div id="chartPerKelompokPasien"></div>
                                                </div>
                                            </div>
                                            <ul class="nav nav-tabs tabs" role="tablist">
                                                <li class="nav-item">
                                                    <a class="nav-link active" data-toggle="tab"
                                                       href="#home1" role="tab">Pie Chart</a>
                                                </li>
                                                <li class="nav-item">
                                                    <a class="nav-link" data-toggle="tab" href="#profile1" role="tab">
                                                        Bar Chart</a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-6 col-md-12">
                                <div class="card">
                                    <div class="panel panel-danger">
                                        <div class="panel-heading bg-danger">
                                            Penerimaan Rumah Sakit
                                        </div>
                                        @php
                                            $res['penerimaan'] = App\Http\Controllers\MainController::getPenerimaanKasir(request()->get("tglawal"),request()->get("tglakhir"),session('kdProfile'));
                                        @endphp
                                        <div class="panel-body">
                                          <!--   <span style="float: right;font-weight:bold">
                                                <span id="totalPenerimaanKasir"></span>&nbsp;&nbsp;</span> -->


                                            <div class="tab-content card-block">
                                                <div class="tab-pane active" id="home2" role="tabpanel">
                                                    <div id="chartPenerimaan"></div>
                                                </div>
                                                <div class="tab-pane" id="profile2" role="tabpanel">
                                                    <div id="chartPenerimaanNonLayanan"></div>
                                                </div>
                                            </div>
                                            <ul class="nav nav-tabs tabs" role="tablist">
                                                <li class="nav-item">
                                                    <a class="nav-link active" data-toggle="tab"
                                                       href="#home2" role="tab">Layanan</a>
                                                </li>
                                                <li class="nav-item">
                                                    <a class="nav-link" data-toggle="tab" href="#profile2" role="tab">
                                                        Non Layanan</a>
                                                </li>
                                            </ul>

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-12 col-xl-12">
                                <div class="card">
                                    <div class="panel panel-primary">
                                        <div class="panel-heading bg-primary">
                                            Trend Pendapatan Rumah Sakit
                                        </div>
                                        <div class="panel-body">
                                            @php
                                                $res['pendapatan_mg'] = App\Http\Controllers\MainController::getPendapatanRumahSakit(request()->get("tglawal"),request()->get("tglakhir"),session('kdProfile'),'seminggu',request()->get("departemen"),request()->get("ruangan"));
                                            @endphp
                                            <div id="chartTrendPendapatan"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-12 col-md-12">
                                <div class="card">
                                    <div class="panel panel-maroon">
                                        <div class="panel-heading bg-c-maroon">
                                            <span style="color:white"> Informasi Trend BPJS</span>
                                        </div>
                                        <div class="panel-body">
                                            @php
                                                $klaim = App\Http\Controllers\MainController::getAllMonitoringKlaim();
                                            @endphp
                                            <div class="row" style="padding:10px;">
                                                <div class="col-md-12">
                                                    <div class="table-responsive" >
                                                        <table class="table table-striped"
                                                               style="width:100%">
                                                            <thead>
                                                            <tr>
                                                                <th style="white-space: pre-wrap;" rowspan="2">Tahun</th>
                                                                <th style="white-space: pre-wrap;" rowspan="2">Bulan</th>
                                                                <th colspan="5" style="text-align:center;color:#448cff;white-space: pre-wrap">Rawat Jalan</th>
                                                                <th colspan="5" style="text-align:center;color:red;white-space: pre-wrap;">Rawat Inap</th>
                                                            </tr>
                                                            <tr>
                                                                <th style="color:#448cff;white-space: pre-wrap;">Jumlah Kasus</th>
                                                                <th style="color:#448cff;white-space: pre-wrap">Jumlah Kasus Pending</th>
                                                                <th style="color:#448cff;white-space: pre-wrap">Pengajuan Klaim</th>
                                                                <th style="color:#448cff;white-space: pre-wrap">Pending / Tidak Layak</th>
                                                                <th style="color:#448cff;white-space: pre-wrap">Realisasi Klaim</th>
                                                                <th style="color:red;white-space: pre-wrap">Jumlah Kasus</th>
                                                                <th style="color:red;white-space: pre-wrap">Jumlah Kasus Pending</th>
                                                                <th style="color:red;white-space: pre-wrap">Pengajuan Klaim</th>
                                                                <th style="color:red;white-space: pre-wrap">Pending / Tidak Layak</th>
                                                                <th style="color:red;white-space: pre-wrap">Realisasi Klaim</th>
                                                            </tr>
                                                            </thead>
                                                            <tbody>
                                                            @foreach($klaim as $items)
                                                                <tr >
                                                                    <td>{{ $items['tahun'] }}</td>
                                                                    <td>{{ $items['bulan'] }}</td>
                                                                    <td style="color:#448cff;text-align: right;white-space: pre-wrap">{{ $items['jmlkasus_rj'] }}</td>
                                                                    <td style="color:#448cff;text-align: right;white-space: pre-wrap">{{ $items['jmlkasuspending_rj'] }}</td>
                                                                    <td style="color:#448cff;text-align: right;white-space: pre-wrap">{{ $items['pengajuan_rj'] }}</td>
                                                                    <td style="color:#448cff;text-align: right;white-space: pre-wrap">{{ $items['pending_rj'] }}</td>
                                                                    <td style="color:#448cff;text-align: right;white-space: pre-wrap">{{ $items['klaim_rj'] }}</td>
                                                                    <td style="color:red;text-align: right;white-space: pre-wrap">{{ $items['jmlkasus_ri'] }}</td>
                                                                    <td style="color:red;text-align: right;white-space: pre-wrap">{{ $items['jmlkasuspending_ri'] }}</td>
                                                                    <td style="color:red;text-align: right;white-space: pre-wrap">{{ $items['pengajuan_ri'] }}</td>
                                                                    <td style="color:red;text-align: right;white-space: pre-wrap">{{ $items['pending_ri'] }}</td>
                                                                    <td style="color:red;text-align: right;white-space: pre-wrap">{{ $items['klaim_ri'] }}</td>
                                                                </tr>
                                                            @endforeach
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-12 col-md-12">
                                <div class="card">
                                    <div class="panel panel-maroon">
                                        <div class="panel-heading bg-c-maroon">
                                            <span style="color:white"> Informasi  Target dan Realisasi</span>
                                        </div>
                                        <div class="panel-body">
                                            {{-- @php
                                                $klaim = App\Http\Controllers\MainController::loadDataRincian(request()->get("tglawal"),request()->get("tglakhir"),session('kdProfile'));
                                            @endphp --}}
                                            @php
                                                $result = App\Http\Controllers\MainController::cetakSTSV2(request()->get("tglawal"),request()->get("tglakhir"),session('kdProfile'));
                                            @endphp
                                            <div class="row" style="padding:10px;">
                                                <div class="col-md-12">
                                                    <div class="table-responsive" >
                                                        <table class="table table-striped"
                                                               style="width:100%">
                                                            <thead>
                                                            <tr>
                                                                <th rowspan="2" style="color:#448cff;white-space: pre-wrap;">Kode Rekening</th>
                                                                <th rowspan="2" style="color:#448cff;white-space: pre-wrap">Uraian</th>
                                                                <th colspan="3" style="text-align:center;color:#448cff;white-space: pre-wrap">Target Pendapatan</th>
                                                                {{-- <th colspan="5" style="text-align:center;color:red;white-space: pre-wrap;">Realisasi</th> --}}
                                                            </tr>
                                                            <tr>
                                                                <th style="color:#448cff;white-space: pre-wrap;">s.d bulan lalu</th>
                                                                <th style="color:#448cff;white-space: pre-wrap">bulan ini</th>
                                                                <th style="color:#448cff;white-space: pre-wrap">sd.bulan ini</th>
                                                                {{-- <th style="color:#448cff;white-space: pre-wrap">Keterangan</th>
                                                                <th style="color:#448cff;white-space: pre-wrap">Target Pendapatan</th>
                                                                <th style="color:#448cff;white-space: pre-wrap">Tahun</th>
                                                                <th style="color:#448cff;white-space: pre-wrap">Tahap</th>
                                                                <th style="color:red;white-space: pre-wrap"></th>
                                                                <th style="color:red;white-space: pre-wrap"></th>
                                                                <th style="color:red;white-space: pre-wrap"></th>
                                                                <th style="color:red;white-space: pre-wrap"></th>
                                                                <th style="color:red;white-space: pre-wrap"></th> --}}
                                                            </tr>
                                                            </thead>
                                                            @php
                                                            $idlevel1 = 0;
                                                            $idlevel2 = 0;
                                                            $idlevel3 = 0;
                                                            $idlevel4 = 0;
                                                            $idlevel5 = 0;
                                                            $idlevel6 = 0;
                                                            $idlevel7 = 0;
                                                            @endphp
                                                            <tbody>
                                                            {{-- @foreach($klaim as $items)
                                                                <tr >
                                                                    <td style="color:#448cff;text-align: right;white-space: pre-wrap">{{ $items->koderekening }}</td>
                                                                    <td style="color:#448cff;text-align: right;white-space: pre-wrap">{{ $items->uraian }}</td>
                                                                    <td style="color:#448cff;text-align: right;white-space: pre-wrap">{{ $items->keterangan }}</td>
                                                                    <td style="color:#448cff;text-align: right;white-space: pre-wrap">{{ $items->jumlahpendapatan }}</td>
                                                                    <td style="color:#448cff;text-align: right;white-space: pre-wrap">{{ $items->tahun }}</td>
                                                                    <td style="color:#448cff;text-align: right;white-space: pre-wrap">{{ $items->tahap }}</td>
                                                                    
                                                                </tr>
                                                            @endforeach --}}
                                                            @foreach ($result['rekening'] as $rek)
            
                                                            {{-- level-1 --}}
                                                            @if ($rek->idlevel1 && ($rek->idlevel1 !== $idlevel1))
                                                                <tr>
                                                                    <td>{{ $rek->koderekeninglevel1 }}</td>
                                                                    <td>{{ $rek->namarekeninglevel1 }}</td>
                                                                    <td>
                                                                        @php
                                                                            $jmllevel1 = 0;
                                                                            foreach ($result['data'] as $key => $row) {
                                                                                if($rek->idlevel1 == $row->idlevel1){
                                                                                    $jmllevel1 += $row->totaldibayarclosing;
                                                                                }
                                                                            }
                                                                        @endphp
                                                                        {{ number_format($jmllevel1, 2, '.', ',') }}
                                                                    </td>
                                                                </tr>
                                                            @endif
                                                
                                                            {{-- level-2 --}}
                                                            @if ($rek->idlevel2 && ($rek->idlevel2 !== $idlevel2))
                                                                <tr>
                                                                    <td>{{ $rek->koderekeninglevel2 }}</td>
                                                                    <td>{{ $rek->namarekeninglevel2 }}</td>
                                                                    <td>
                                                                        @php
                                                                            $jmllevel2 = 0;
                                                                            foreach ($result['data'] as $key => $row) {
                                                                                if($rek->idlevel2 == $row->idlevel2){
                                                                                    $jmllevel2 += $row->totaldibayarclosing;
                                                                                }
                                                                            }
                                                                        @endphp
                                                                        {{ number_format($jmllevel2, 2, '.', ',') }}
                                                                    </td>
                                                                </tr>
                                                            @endif
                                                
                                                            {{-- level-3 --}}
                                                            @if ($rek->idlevel3 && ($rek->idlevel3 !== $idlevel3))
                                                                <tr>
                                                                    <td style="font-weight:bold;">{{ $rek->koderekeninglevel3 }}</td>
                                                                    <td style="font-weight:bold;">{{ $rek->namarekeninglevel3 }}</td>
                                                                    <td style="font-weight:bold;">
                                                                        @php
                                                                            $jmllevel3 = 0;
                                                                            foreach ($result['data'] as $key => $row) {
                                                                                if($rek->idlevel3 == $row->idlevel3){
                                                                                    $jmllevel3 += $row->totaldibayarclosing;
                                                                                }
                                                                            }
                                                                        @endphp
                                                                        {{ number_format($jmllevel3, 2, '.', ',') }}
                                                                    </td>
                                                                </tr>
                                                            @endif
                                                
                                                            {{-- level-4 --}}
                                                            @if ($rek->idlevel4 && ($rek->idlevel4 !== $idlevel4))
                                                                <tr>
                                                                    <td>{{ $rek->koderekeninglevel4 }}</td>
                                                                    <td>{{ $rek->namarekeninglevel4 }}</td>
                                                                    <td>
                                                                        @php
                                                                            $jmllevel4 = 0;
                                                                            foreach ($result['data'] as $key => $row) {
                                                                                if($rek->idlevel4 == $row->idlevel4){
                                                                                    $jmllevel4 += $row->totaldibayarclosing;
                                                                                }
                                                                            }
                                                                        @endphp
                                                                        {{ number_format($jmllevel4, 2, '.', ',') }}
                                                                    </td>
                                                                </tr>
                                                            @endif
                                                
                                                            {{-- level-5 --}}
                                                            @if ($rek->idlevel5 && ($rek->idlevel5 !== $idlevel5))
                                                                <tr>
                                                                    <td>{{ $rek->koderekeninglevel5 }}</td>
                                                                    <td>{{ $rek->namarekeninglevel5 }}</td>
                                                                    <td>
                                                                        @php
                                                                            $jmllevel5 = 0;
                                                                            foreach ($result['data'] as $key => $row) {
                                                                                if($rek->idlevel5 == $row->idlevel5){
                                                                                    $jmllevel5 += $row->totaldibayarclosing;
                                                                                }
                                                                            }
                                                                        @endphp
                                                                        {{ number_format($jmllevel5, 2, '.', ',') }}
                                                                    </td>
                                                                </tr>
                                                            @endif
                                                
                                                            {{-- level-6 --}}
                                                            @if ($rek->idlevel6 && ($rek->idlevel6 !== $idlevel6))
                                                                <tr>
                                                                    <td>{{ $rek->koderekeninglevel6 }}</td>
                                                                    <td>{{ $rek->namarekeninglevel6 }}</td>
                                                                    <td>
                                                                        @php
                                                                            $jmllevel6 = 0;
                                                                            foreach ($result['data'] as $key => $row) {
                                                                                if($rek->idlevel6 == $row->idlevel6){
                                                                                    $jmllevel6 += $row->totaldibayarclosing;
                                                                                }
                                                                            }
                                                                        @endphp
                                                                        {{ number_format($jmllevel6, 2, '.', ',') }}
                                                                    </td>
                                                                </tr>
                                                            @endif
                                                
                                                            {{-- level-7 --}}
                                                            @if ($rek->idlevel7 && ($rek->idlevel7 !== $idlevel7))
                                                                <tr>
                                                                    <td style="font-weight:bold;">{{ $rek->koderekeninglevel7 }}</td>
                                                                    <td style="font-weight:bold;">{{ $rek->namarekeninglevel7 }}</td>
                                                                    <td style="font-weight:bold;">
                                                                        @php
                                                                            $jmllevel7 = 0;
                                                                            foreach ($result['data'] as $key => $row) {
                                                                                if($rek->idlevel7 == $row->idlevel7){
                                                                                    $jmllevel7 += $row->totaldibayarclosing;
                                                                                }
                                                                            }
                                                                        @endphp
                                                                        {{ number_format($jmllevel7, 2, '.', ',') }}
                                                                    </td>
                                                                </tr>
                                                            @endif
                                                
                                                            <tr>
                                                                <td>{{ $rek->koderekening }}</td>
                                                                <td>{{ $rek->namarekening }}</td>
                                                                <td>
                                                                    @php
                                                                        $jmllevel8 = 0;
                                                                        foreach ($result['data'] as $key => $row) {
                                                                            if($rek->idrekening == $row->idrekening){
                                                                                $jmllevel8 += $row->totaldibayarclosing;
                                                                            }
                                                                        }
                                                                    @endphp
                                                                    {{ number_format($jmllevel8, 2, '.', ',') }}
                                                                    
                                                                </td>
                                                            </tr>
                                                            
                                                
                                                            @php
                                                                $idlevel1 = $rek->idlevel1;
                                                                $idlevel2 = $rek->idlevel2;
                                                                $idlevel3 = $rek->idlevel3;
                                                                $idlevel4 = $rek->idlevel4;
                                                                $idlevel5 = $rek->idlevel5;
                                                                $idlevel6 = $rek->idlevel6;
                                                                $idlevel7 = $rek->idlevel7;
                                                            @endphp
                                                        @endforeach
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div >
                    </form>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="modalKunjungan" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-lg"  role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title"><span id="titleModalKun"></span></h4>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body" id="load_kunjungan">
                </div>

                <div class="modal-footer">
                </div>
            </div>
        </div>
    </div>
@endsection

@section('javascript')
    <script>
        $(document).ready(function() {
            $('.js-example-basic-single').select2()
        })
        var APP_URL = {!! json_encode(url('/')) !!}
        function formatRupiah(value, currency) {
            return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
        }
        setChartPendapatan()
        setChartNonLayanan()
        setChartTren()
        setChartPendapatanAkrual()
        setChartPendapatanPotensial()
        setChartPendapatanPerKelompokPasien()
        function setChartPendapatan() {
            this.dataChartPendapatan =  @json($res['pendapatan']);
            let array = this.dataChartPendapatan.data
            let series = [];

            // totalkeun hela
            for (let i in array) {
                array[i].total = parseFloat(array[i].total)//total
            }
            // looping nu sarua deapartemena na jumlahkeun
            let samateuuu = false
            let resultSumRuangan = [];
            for (let i in array) {
                samateuuu = false
                for (let x in resultSumRuangan) {
                    if (resultSumRuangan[x].namaruangan == array[i].namaruangan) {
                        resultSumRuangan[x].total = parseFloat(resultSumRuangan[x].total) + parseFloat(array[i].total)
                        // resultSumRuangan[x].namaruangan = array[i].namaruangan
                        samateuuu = true;
                    }
                }
                if (samateuuu == false) {
                    let result = {
                        namaruangan: array[i].namaruangan,
                        total: array[i].total,
                        namadepartemen: array[i].namadepartemen,
                        kelompokpasien: array[i].kelompokpasien,
                    }
                    resultSumRuangan.push(result)
                }
            }


            let sama = false
            let resultSumDep = [];
            for (let i in array) {
                sama = false
                for (let x in resultSumDep) {
                    if (resultSumDep[x].namadepartemen == array[i].namadepartemen) {
                        sama = true;
                        resultSumDep[x].total = parseFloat(resultSumDep[x].total) + parseFloat(array[i].total)
                        // resultSumDep[x].namadepartemen = array[i].namadepartemen
                    }
                }
                // let resultGroupingRuangan = []
                if (sama == false) {
                    var dataDetail0 = [];
                    for (var f = 0; f < resultSumRuangan.length; f++) {
                        if (array[i].namadepartemen == resultSumRuangan[f].namadepartemen) {
                            dataDetail0.push([resultSumRuangan[f].namaruangan, resultSumRuangan[f].total]);
                        };
                    }
                    let result = {
                        id: array[i].namadepartemen,
                        name: array[i].namadepartemen,
                        namadepartemen: array[i].namadepartemen,
                        total: array[i].total,
                        data: dataDetail0
                    }
                    resultSumDep.push(result)
                }
            }

            // console.log(resultSumDep)
            // drilldown ruangan
            // asupkeun kana series data di CHART
            let totalAll = 0;
            for (let z in resultSumDep) {
                totalAll = totalAll + parseFloat(resultSumDep[z].total)
                let datana = [];
                datana.push({
                    y: parseFloat(resultSumDep[z].total),
                    color: this.colors[z],
                    drilldown: resultSumDep[z].namadepartemen
                });
                series.push({
                    name: resultSumDep[z].namadepartemen,
                    data: datana
                });
            }
            console.log('total all '+ totalAll)
            console.log('total all f '+ formatRupiah(totalAll,''))

            this.totalPerinstalasi = 0
            for (let j = 0; j < resultSumDep.length; j++) {
                const element = resultSumDep[j];
                this.totalPerinstalasi = this.totalPerinstalasi + element.total
            }
            this.totalPerinstalasi = 'Rp. ' + formatRupiah(this.totalPerinstalasi, '');
            var dataKanggeGrid = resultSumDep
            for (let i = 0; i < dataKanggeGrid.length; i++) {
                const element = dataKanggeGrid[i];
                element.total = 'Rp. ' + formatRupiah(element.total, '');
            }

            this.dataSouceInstalasiPend = dataKanggeGrid
            var tglAwal = $("#tglawal").val()
            var tglAkhir = $("#tglakhir").val()
            this.isShowTrend = false;
            // Highcharts.chart('chartPendapatan', {

            //     chart: {
            //         type: 'column'
            //     },
            //     title: {
            //         text: ''
            //     },
            //     subtitle: {
            //         text: ''
            //     },
            //     xAxis: {
            //         // categories: [" "],
            //         // labels: {
            //         //     align: 'center',
            //         //     style: {
            //         //         fontSize: '7px',
            //         //         fontFamily: 'Verdana, sans-serif'
            //         //     }
            //         // },
            //         type: 'category'
            //     },
            //     yAxis: {
            //         title: {
            //             text: 'Realisasi Pendapatan'
            //         }
            //     },
            //     legend: {
            //         enabled: true,
            //         borderRadius: 5,
            //         borderWidth: 1
            //     },
            //     // legend: {
            //     //     enabled: false
            //     // },
            //     plotOptions: {
            //         column: {
            //             // url:"#",
            //             cursor: 'pointer',

            //             dataLabels: {
            //                 enabled: true,
            //                 color: this.colors[1],

            //                 formatter: function () {
            //                     return 'Rp. ' + formatRupiah(this.y,  '');
            //                 }
            //             },
            //             showInLegend: true
            //         },
            //         series: {
            //             cursor: 'pointer',
            //             borderWidth: 0,
            //             // dataLabels: {
            //             //     enabled: true,
            //             //     format: '{point.y:.1f}%'
            //             // },
            //             point: {
            //                 events: {
            //                     click: function () {
            //                         if (this.name == undefined) return;
            //                         getDetailChartPen(event.point.name, tglAwal, tglAkhir)
            //                         // alert( "point this.name = [" + this.name + tglAwal+ "], this.category = [" + this.category + "]")
            //                     }
            //                     // click: function (event) {
            //                     //     if (event.point.name == undefined) return;
            //                     //      getDetailChartPen(event.point.name, tglAwal, tglAkhir)
            //                     // }.bind(this)
            //                 },
            //                 // }
            //             }
            //         },

            //     },
            //     // tooltip: {
            //     //     formatter: function () {
            //     //         let point = this.point,
            //     //             s = this.series.name + ': Rp. ' + Highcharts.numberFormat(this.y, 0, '.', ',') + ' <br/>';
            //     //         return s;

            //     //     }

            //     // },
            //     credits: {
            //         text: 'Total : Rp. ' + formatRupiah(totalAll,''),
            //         style: {
            //             color:"black",
            //             cursor: "pointer",
            //             fontSize: "12px"
            //         }
            //     },
            //     series: series,
            //     drilldown: {
            //         series: resultSumDep,

            //     }

            // })


            //   kelompok pasien
            let samakan = false
            let resultSumKelPasien = [];
            for (let i in array) {
                samakan = false
                for (let x in resultSumKelPasien) {
                    if (resultSumKelPasien[x].namaruangan == array[i].namaruangan &&
                        resultSumKelPasien[x].kelompokpasien == array[i].kelompokpasien) {
                        samakan = true;
                        resultSumKelPasien[x].total = parseFloat(resultSumKelPasien[x].total) + parseFloat(array[i].total)
                        // resultSumKelPasien[x].namaruangan = array[i].namaruangan
                    }
                }
                if (samakan == false) {
                    let result = {
                        namaruangan: array[i].namaruangan,
                        total: array[i].total,
                        namadepartemen: array[i].namadepartemen,
                        kelompokpasien: array[i].kelompokpasien,
                    }
                    resultSumKelPasien.push(result)
                }
            }
            let seriesKelPasien = []
            let sarua = false
            let resultSumKelompokPasien = [];
            for (let i in array) {
                sarua = false
                for (let x in resultSumKelompokPasien) {
                    if (resultSumKelompokPasien[x].kelompokpasien == array[i].kelompokpasien) {
                        sarua = true;
                        resultSumKelompokPasien[x].total = parseFloat(resultSumKelompokPasien[x].total) + parseFloat(array[i].total)
                        // resultSumKelompokPasien[x].kelompokpasien = array[i].kelompokpasien
                    }
                }
                if (sarua == false) {
                    var details = [];
                    var rinci = [];
                    for (var f = 0; f < resultSumKelPasien.length; f++) {
                        if (array[i].kelompokpasien == resultSumKelPasien[f].kelompokpasien) {
                            details.push([resultSumKelPasien[f].namaruangan, resultSumKelPasien[f].total]);
                            rinci.push(resultSumKelPasien[f]);
                        };
                    }
                    let result = {
                        kelompokpasien: array[i].kelompokpasien,
                        total: array[i].total,
                        id: array[i].kelompokpasien,
                        name: array[i].kelompokpasien,
                        data: details,
                        rincian: rinci
                    }
                    resultSumKelompokPasien.push(result)
                }
            }
            //  console.log(resultSumKelompokPasien)
            // asupkeun kana series data di CHART
            let dataKelPasienPie = []
            let slice = true
            for (let z in resultSumKelompokPasien) {
                let datana = [];
                datana.push({
                    y: parseFloat(resultSumKelompokPasien[z].total),
                    color: this.colors[z],
                    drilldown: resultSumKelompokPasien[z].kelompokpasien
                });

                seriesKelPasien.push({
                    name: resultSumKelompokPasien[z].kelompokpasien,
                    data: datana
                });
                dataKelPasienPie.push({
                    name: resultSumKelompokPasien[z].kelompokpasien,
                    y: parseFloat(resultSumKelompokPasien[z].total),
                    sliced: slice,
                    selected: slice
                });
                slice = false;
            }
            Highcharts.chart('chartPerKelompokPasien', {
                chart: {
                    type: 'column',

                },

                title: {
                    text: ''
                },
                xAxis: {
                    type: 'category',
                    // categories: ["Jumlah "],
                    // labels: {
                    //     align: 'center',
                    //     style: {
                    //         fontSize: '13px',
                    //         fontFamily: 'Verdana, sans-serif'
                    //     }
                    // }
                },
                yAxis: {
                    title: {
                        text: 'Realisasi Pendapatan'
                    }
                },
                plotOptions: {
                    column: {
                        // url:"#",
                        cursor: 'pointer',

                        dataLabels: {
                            enabled: true,
                            color: this.colors[1],

                            formatter: function () {
                                return 'Rp. ' + formatRupiah(this.y, '');
                            }
                        },
                        showInLegend: true
                    },
                    series: {
                        cursor: 'pointer',
                    }
                },
                // tooltip: {
                //     formatter: function () {
                //         let point = this.point,
                //             s = this.series.name + ': Rp. ' + Highcharts.numberFormat(this.y, 0, '.', ',') + ' <br/>';
                //         return s;

                //     }

                // },
                series: seriesKelPasien,
                drilldown: {
                    series: resultSumKelompokPasien
                },
                exporting: {
                    enabled: false
                },
                credits: {
                    // enabled: false
                    text: 'Total : Rp. ' + formatRupiah(totalAll,''),
                    style: {
                        color:"black",
                        cursor: "pointer",
                        fontSize: "12px"
                    }
                },
                legend: {
                    enabled: true,
                    borderRadius: 5,
                    borderWidth: 1
                },

            })

            Highcharts.chart('chartPerKelompokPasienPie', {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: '',

                },
                tooltip: {
                    formatter: function (e) {
                        let point = this.point,
                            s = this.series.name + ': Rp. ' + formatRupiah(this.y, '') + ' <br/>';
                        return s;

                    }

                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            color: '#000000',
                            connectorColor: '#000000',
                            formatter: function () {
                                return this.percentage.toFixed(2) + ' %';
                            }
                        },
                        showInLegend: true
                    },

                },
                credits: {
                    text: 'Total : Rp. ' + formatRupiah(totalAll, ''),
                    style: {
                        color:"black",
                        cursor: "pointer",
                        fontSize: "12px"
                    }
                    // enabled: false
                },
                legend: {
                    enabled: true,
                    borderRadius: 5,
                    borderWidth: 1
                },
                series: [{
                    type: 'pie',
                    name: 'Total',
                    // colorByPoint: true,
                    data: dataKelPasienPie

                }]
            })
        }
        function setChartPendapatanAkrual(){
            this.datapendapatanakrual  =@json($res['pendapatanakrual']);
            let categories = []
            let series = [];
            let jumlah = 0;
            for (let i in this.datapendapatanakrual) {
                categories.push(this.datapendapatanakrual[i].ruangan);
                let dataz2 = [];
                dataz2.push({
                    y: parseFloat(this.datapendapatanakrual[i].jumlah),
                    color: this.colors[i]
                });
                jumlah = jumlah + parseFloat(this.datapendapatanakrual[i].jumlah);
                // if (loopIndex > 0)
                series.push({
                    name: this.datapendapatanakrual[i].ruangan,
                    data: dataz2
                });
                // loopIndex++;

            }
            Highcharts.chart('chartPendapatanAkrual', {
                chart: {
                    type: 'column',
                },

                title: {
                    text: ''
                },
                xAxis: {
                    categories: ["Total : Rp. " + formatRupiah(jumlah,'')],
                    labels: {
                        align: 'center',
                        style: {
                            fontSize: '13px',
                            fontFamily: 'Verdana, sans-serif',
                            fontWeight: 'bold'
                        }
                    }
                },
                yAxis: {
                    title: {
                        text: 'Jumlah Pendapatan'
                    }
                },
                plotOptions: {
                    column: {
                        // url:"#",
                        cursor: 'pointer',

                        dataLabels: {
                            enabled: true,
                            color: this.colors[1],

                            formatter: function () {
                                return 'Rp. ' + formatRupiah(this.y, '');
                            }
                        },
                        showInLegend: true
                    }
                },
                tooltip: {
                    formatter: function (e) {
                        let point = this.point,
                            s = this.series.name + ': Rp. ' + formatRupiah(this.y, '') + ' <br/>';
                        return s;

                    }

                },
                series: series,
                exporting: {
                    enabled: false
                },
                credits: {
                    enabled: false
                },
                legend: {
                    enabled: true,
                    borderRadius: 5,
                    borderWidth: 1
                },

            })
        }
        function setChartPendapatanPotensial(){
            this.datapendapatanakrual  =@json($res['pendapatanpotensial']);
            let categories = []
            let series = [];
            let jumlah = 0;
            for (let i in this.datapendapatanakrual) {
                categories.push(this.datapendapatanakrual[i].ruangan);
                let dataz2 = [];
                dataz2.push({
                    y: parseFloat(this.datapendapatanakrual[i].jumlah),
                    color: this.colors[i]
                });
                jumlah = jumlah + parseFloat(this.datapendapatanakrual[i].jumlah);
                // if (loopIndex > 0)
                series.push({
                    name: this.datapendapatanakrual[i].ruangan,
                    data: dataz2
                });
                // loopIndex++;

            }
            Highcharts.chart('chartPendapatanPotensial', {
                chart: {
                    type: 'column',
                },

                title: {
                    text: ''
                },
                xAxis: {
                    categories: ["Total : Rp. " + formatRupiah(jumlah,'')],
                    labels: {
                        align: 'center',
                        style: {
                            fontSize: '13px',
                            fontFamily: 'Verdana, sans-serif',
                            fontWeight: 'bold'
                        }
                    }
                },
                yAxis: {
                    title: {
                        text: 'Jumlah Pendapatan'
                    }
                },
                plotOptions: {
                    column: {
                        // url:"#",
                        cursor: 'pointer',

                        dataLabels: {
                            enabled: true,
                            color: this.colors[1],

                            formatter: function () {
                                return 'Rp. ' + formatRupiah(this.y, '');
                            }
                        },
                        showInLegend: true
                    }
                },
                tooltip: {
                    formatter: function (e) {
                        let point = this.point,
                            s = this.series.name + ': Rp. ' + formatRupiah(this.y, '') + ' <br/>';
                        return s;

                    }

                },
                series: series,
                exporting: {
                    enabled: false
                },
                credits: {
                    enabled: false
                },
                legend: {
                    enabled: true,
                    borderRadius: 5,
                    borderWidth: 1
                },

            })
        }
        function setChartPendapatanPerKelompokPasien(){
            this.datapendapatanperkelompokpasien  =@json($res['pendapatanperkelompokpasien']);
            let categories = []
            let series = [];
            let jumlah = 0;
            for (let i in this.datapendapatanperkelompokpasien) {
                categories.push(this.datapendapatanperkelompokpasien[i].kelompokpasien);
                let dataz2 = [];
                dataz2.push({
                    y: parseFloat(this.datapendapatanperkelompokpasien[i].totalfix),
                    color: this.colors[i]
                });
                jumlah = jumlah + parseFloat(this.datapendapatanperkelompokpasien[i].totalfix);
                // if (loopIndex > 0)
                series.push({
                    name: this.datapendapatanperkelompokpasien[i].kelompokpasien,
                    data: dataz2
                });
                // loopIndex++;

            }
            Highcharts.chart('chartPendapatanPerKelompokPasien', {
                chart: {
                    type: 'column',
                },

                title: {
                    text: ''
                },
                xAxis: {
                    categories: ["Total : Rp. " + formatRupiah(jumlah,'')],
                    labels: {
                        align: 'center',
                        style: {
                            fontSize: '13px',
                            fontFamily: 'Verdana, sans-serif',
                            fontWeight: 'bold'
                        }
                    }
                },
                yAxis: {
                    title: {
                        text: 'Jumlah Pendapatan'
                    }
                },
                plotOptions: {
                    column: {
                        // url:"#",
                        cursor: 'pointer',

                        dataLabels: {
                            enabled: true,
                            color: this.colors[1],

                            formatter: function () {
                                return 'Rp. ' + formatRupiah(this.y, '');
                            }
                        },
                        showInLegend: true
                    }
                },
                tooltip: {
                    formatter: function (e) {
                        let point = this.point,
                            s = this.series.name + ': Rp. ' + formatRupiah(this.y, '') + ' <br/>';
                        return s;

                    }

                },
                series: series,
                exporting: {
                    enabled: false
                },
                credits: {
                    enabled: false
                },
                legend: {
                    enabled: true,
                    borderRadius: 5,
                    borderWidth: 1
                },

            })
        }
        function setChartNonLayanan(){

            this.dataChartPenerimaan = @json($res['penerimaan']);
            // this.loading = false;
            this.dataGrid = this.dataChartPenerimaan.data
            let array = this.dataChartPenerimaan.data
            let seriesTerima = [];
            let seriesTerimaNonLayanan = [];

            // looping nu sarua deapartemena na jumlahkeun
            let sama = false
            let resultSum = [];
            for (let i in array) {

                sama = false
                for (let x in resultSum) {
                    if (resultSum[x].namadepartemen == array[i].namadepartemen) {
                        sama = true;
                        resultSum[x].totaldibayar = parseFloat(resultSum[x].totaldibayar) + parseFloat(array[i].totaldibayar)
                        resultSum[x].namadepartemen = array[i].namadepartemen
                    }
                }
                if (sama == false) {
                    let result = {
                        namadepartemen: array[i].namadepartemen,
                        totaldibayar: array[i].totaldibayar,
                    }
                    resultSum.push(result)
                }
            }
            // asupkeun kana series data di CHART
            let totalAll = 0;
            let totalNonLayanan = 0
            for (let z in resultSum) {
                if (resultSum[z].namadepartemen != null) {
                    totalAll = totalAll + parseFloat(resultSum[z].totaldibayar)
                    let datana = [];
                    datana.push({
                        y: parseFloat(resultSum[z].totaldibayar),
                        color: this.colors[z],
                        drilldown: true
                    });

                    seriesTerima.push({
                        type: 'column',
                        name: resultSum[z].namadepartemen,
                        data: datana
                    });
                } else {
                    totalNonLayanan = totalNonLayanan + parseFloat(resultSum[z].totaldibayar)
                    let datana = [];
                    datana.push({
                        y: parseFloat(resultSum[z].totaldibayar),
                        color: this.colors[0],
                        drilldown: true
                    });

                    seriesTerimaNonLayanan.push({
                        type: 'column',
                        name: 'Non Layanan',
                        data: datana
                    });
                }

            }
            // document.getElementById("totalPenerimaanKasir").innerHTML =   'Rp. ' + Highcharts.numberFormat((totalAll + totalNonLayanan), 0, '.', ',');

            Highcharts.chart('chartPenerimaan', {
                chart: {
                    // type: 'column',
                    events: {
                        drilldown: function (e) {
                            if (!e.seriesOptions) {

                                var chart = this,
                                    drilldowns = {
                                        'Animals': {
                                            name: 'Animals',
                                            data: [
                                                ['Cows', 2],
                                                ['Sheep', 3]
                                            ]
                                        },
                                        'Fruits': {
                                            name: 'Fruits',
                                            data: [
                                                ['Apples', 5],
                                                ['Oranges', 7],
                                                ['Bananas', 2]
                                            ]
                                        },
                                        'Cars': {
                                            name: 'Cars',
                                            data: [
                                                ['Toyota', 1],
                                                ['Volkswagen', 2],
                                                ['Opel', 5]
                                            ]
                                        }
                                    },
                                    series = drilldowns[e.point.name];

                                // Show the loading label
                                // chart.showLoading('Simulating Ajax ...');

                                setTimeout(function () {
                                    chart.hideLoading();
                                    chart.addSeriesAsDrilldown(e.point, series);
                                }, 1000);
                            }

                        }
                    }
                },

                title: {
                    text: ''
                },
                xAxis: {
                    categories: ["Jumlah "],
                    labels: {
                        align: 'center',
                        style: {
                            fontSize: '13px',
                            fontFamily: 'Verdana, sans-serif'
                        }
                    }
                },
                yAxis: {
                    title: {
                        text: 'Penerimaan'
                    }
                },
                plotOptions: {
                    column: {
                        // url:"#",
                        cursor: 'pointer',

                        dataLabels: {
                            enabled: true,
                            color: this.colors[1],

                            formatter: function () {
                                return 'Rp. ' + formatRupiah(this.y,'');
                            }
                        },
                        showInLegend: true
                    },
                    series: {
                        cursor: 'pointer',
                    }
                },
                tooltip: {
                    formatter: function () {
                        let point = this.point,
                            s = this.series.name + ': Rp. ' + formatRupiah(this.y,'') + ' <br/>';
                        return s;

                    }

                },
                series: seriesTerima,
                drilldown: {
                    series: []
                },
                exporting: {
                    enabled: false
                },
                credits: {
                    // enabled: false
                    text: 'Total : Rp. ' + formatRupiah(totalAll,''),
                    style: {
                        color:"black",
                        cursor: "pointer",
                        fontSize: "12px"
                    }
                },
                legend: {
                    enabled: true,
                    borderRadius: 5,
                    borderWidth: 1
                },

            })
            // chart Penerimaan Non Layanan
            Highcharts.chart('chartPenerimaanNonLayanan', {
                chart: {
                    // type: 'column',
                    events: {
                        drilldown: function (e) {
                            if (!e.seriesOptions) {

                                var chart = this,
                                    drilldowns = {
                                        'Animals': {
                                            name: 'Animals',
                                            data: [
                                                ['Cows', 2],
                                                ['Sheep', 3]
                                            ]
                                        },
                                        'Fruits': {
                                            name: 'Fruits',
                                            data: [
                                                ['Apples', 5],
                                                ['Oranges', 7],
                                                ['Bananas', 2]
                                            ]
                                        },
                                        'Cars': {
                                            name: 'Cars',
                                            data: [
                                                ['Toyota', 1],
                                                ['Volkswagen', 2],
                                                ['Opel', 5]
                                            ]
                                        }
                                    },
                                    series = drilldowns[e.point.name];

                                // Show the loading label
                                // chart.showLoading('Simulating Ajax ...');

                                setTimeout(function () {
                                    chart.hideLoading();
                                    chart.addSeriesAsDrilldown(e.point, series);
                                }, 1000);
                            }

                        }
                    }
                },

                title: {
                    text: ''
                },
                xAxis: {
                    categories: ["Jumlah "],
                    labels: {
                        align: 'center',
                        style: {
                            fontSize: '13px',
                            fontFamily: 'Verdana, sans-serif'
                        }
                    }
                },
                yAxis: {
                    title: {
                        text: 'Penerimaan'
                    }
                },
                plotOptions: {
                    column: {
                        // url:"#",
                        cursor: 'pointer',

                        dataLabels: {
                            enabled: true,
                            color: this.colors[1],

                            formatter: function () {
                                return 'Rp. ' + formatRupiah(this.y, '');
                            }
                        },
                        showInLegend: true
                    },
                    series: {
                        cursor: 'pointer',
                    }
                },
                tooltip: {
                    formatter: function () {
                        let point = this.point,
                            s = this.series.name + ': Rp. ' +formatRupiah(this.y, '') + ' <br/>';
                        return s;

                    }

                },
                series: seriesTerimaNonLayanan,
                drilldown: {
                    series: []
                },
                exporting: {
                    enabled: false
                },
                credits: {
                    // enabled: false
                    text: 'Total : Rp. ' + formatRupiah(totalNonLayanan, ''),
                    style: {
                        color:"black",
                        cursor: "pointer",
                        fontSize: "12px"
                    }
                },
                legend: {
                    enabled: true,
                    borderRadius: 5,
                    borderWidth: 1
                },

            })
        }
        function setChartTren(){
            this.dataChartTend =@json($res['pendapatan_mg']);
            let array = this.dataChartTend.data
            let categories = []
            let periodeCatego = []
            // totalkeun hela
            for (let i in array) {
                array[i].tgl = new Date(array[i].tglpencarian).toDateString()//.substring(4, 10)
                array[i].total = parseFloat(array[i].total)
            }
            let samateuuu = false
            let sumKeun = [];
            for (let i in array) {
                samateuuu = false
                for (let x in sumKeun) {
                    if (sumKeun[x].tgl == array[i].tgl) {
                        sumKeun[x].total = parseFloat(sumKeun[x].total) + parseFloat(array[i].total)
                        sumKeun[x].tgl = array[i].tgl
                        samateuuu = true;
                    }
                }
                if (samateuuu == false) {
                    let result = {
                        tgl: array[i].tgl,
                        total: array[i].total,
                    }
                    sumKeun.push(result)
                }
            }
            let dataSeries = []
            for (let i in sumKeun) {
                dataSeries.push(sumKeun[i].total
                );
                categories.push(sumKeun[i].tgl.substring(4, 10))
                periodeCatego.push(sumKeun[i].tgl)
            }
            this.isShowTrendPen = false
            //console.log(sumKeun)
            Highcharts.chart('chartTrendPendapatan',{
                chart: {
                    type: 'area',
                    spacingBottom: 30
                },
                title: {
                    text: ''
                },

                subtitle: {
                    text: ''
                },
                xAxis: {
                    categories: categories,
                },
                yAxis: {
                    title: {
                        text: 'Jumlah'
                    }
                },

                legend: {
                    layout: 'horizontal',
                    // align: 'right',
                    borderRadius: 5,
                    borderWidth: 1,
                    // verticalAlign: 'middle'
                },
                plotOptions: {
                    // area: {
                    //     stacking: 'normal',
                    //     lineColor: '#666666',
                    //     lineWidth: 1,
                    //     marker: {
                    //         lineWidth: 1,
                    //         lineColor: '#666666'
                    //     }
                    // },
                    // line: {
                    //     dataLabels: {
                    //         enabled: true,
                    //         color: this.colors[1],

                    //         formatter: function () {
                    //             return 'Rp. ' + Highcharts.numberFormat(this.y, 0, '.', ',');
                    //         }
                    //     },
                    //     enableMouseTracking: false
                    // },
                    area: {
                        // url:"#",
                        cursor: 'pointer',

                        dataLabels: {
                            enabled: true,
                            color: this.colors[1],

                            formatter: function () {
                                return 'Rp. ' +formatRupiah(this.y, '');
                            }
                        },
                        showInLegend: true
                    },
                    series: {
                        cursor: 'pointer',
                    }
                },
                tooltip: {
                    formatter: function () {
                        let point = this.point,
                            s = this.series.name + ': Rp. ' +formatRupiah(this.y,'') + ' <br/>';
                        return s;

                    }

                },
                // plotOptions: {
                //     series: {
                //         label: {
                //             connectorAllowed: false
                //         },
                //         pointStart: 2010
                //     }
                // },

                series: [{
                    name: 'Trend Pendapatan Rumah Sakit Per-Minggu',
                    data: dataSeries,
                    color: '#00c0ef'
                }],
                credits: {
                    enabled: false
                },

                responsive: {
                    rules: [{
                        condition: {
                            maxWidth: 500
                        },
                        chartOptions: {
                            legend: {
                                layout: 'horizontal',
                                align: 'center',
                                verticalAlign: 'bottom'
                            }
                        }
                    }]
                }
            })
        }
        function getDetailChartPen(namess, tglawal, tglakhir) {
            $.ajax({
                type    : 'GET',
                url     : APP_URL+'/get-detail-pendapatan',
                data    : {tglawal:tglawal,tglakhir:tglakhir,ruangan:namess},
                success : function(respond){
                    document.getElementById("titleModalKun").innerHTML =   namess
                    $('#modalKunjungan').modal("show");
                    $("#load_kunjungan").html(respond);
                }
            })
        }
         setTimeout(function(){
             
                 window.location.reload();
           
        }, 60000);

    </script>

@endsection
