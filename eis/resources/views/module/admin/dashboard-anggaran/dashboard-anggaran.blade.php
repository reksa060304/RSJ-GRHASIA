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
          .ui-datepicker-calendar {
            display: none;
            }
    </style>
@endsection
@section('content-body')
  <a href="javascript:" id="return-to-top"><i class="fa fa-chevron-up"></i></a>
    <div class="page-wrapper pad" style="margin-top:20px">
        <div class="page-body">
            <div class="card">
                <div class="card-header">
                    <h5>Dashboard Anggaran Belanja</h5>
                </div>
                <div class="card-block tab-icon">
                    <form action="{!! route("show_page", ["role" => session('role'), "pages" => $r->pages ]) !!}" method="get">
                        <div class="row">
                            <div class="col-lg-3">
                            </div>
                            <div class="col-lg-3" style="margin-top: 5px">
                            <select class="js-example-basic-single" name="tahap" id="tahap">
                                @forelse($tahap as $item)
                                <option value="{{$item->id}}" {{ $r->tahap == $item->id ? "selected" : ""}}>{{$item->tahap}}</option>
                                @empty
                                <option value=""></option>
                                @endforelse
                            </select>
                            </div>
                            <div class="col-lg-3" style="margin-top: 5px">
                            <select class="js-example-basic-single" name="asalproduk" id="asalproduk">
                                @forelse($dataAsalProduk as $item)
                                <option value="{{$item->id}}" {{ $r->asalproduk == $item->id ? "selected" : ""}}>{{$item->asalproduk}}</option>
                                @empty
                                <option value=""></option>
                                @endforelse
                            </select>
                            </div>
                            <div class="col-lg-2" style="margin-top: 5px">
                                <div class="input-group" >
                                    <span class="input-group-addon" id="basic-addon1"><i class="ti-calendar"></i></span>
                                    <input type="text" id="tahun" name="tahun" class="date-custom form-control" value="{{request()->get("tahun")}}" >
                                </div>

                            </div>
                            <div class="col-lg-1" style="margin-top: 5px" >
                                <button class="btn btn-success  btn-outline-success"  type="submit">
                                    <i class="icofont icofont-search"></i>Search</button>
                            </div>
                        </div>
                        <div class="row" style="margin-top:10px ">
                            <div class="col-lg-12 col-md-12">
                                <div class="card">
                                    <div class="panel panel-maroon">
                                        <div class="panel-heading bg-c-maroon">
                                            <span style="color:white">Data Deviasi Anggaran Belanja</span>
                                        </div>
                                        <div class="panel-body">
                                            @php
                                                $klaim = App\Http\Controllers\MainController::getDataDeviasi(request()->get("tahun"), request()->get("tahap"), request()->get("asalproduk"));
                                            @endphp
                                            <div class="row" style="padding:10px;">
                                                <div class="col-md-12">
                                                    <div class="table-responsive" >
                                                        <table class="table table-striped"
                                                               style="width:100%">
                                                            <thead>
                                                            {{-- <tr>
                                                                <th style="text-align: center;color:#000000;white-space: pre-wrap;">Tahap Anggaran</th>
                                                                <th style="text-align: center;color:#000000;white-space: pre-wrap;">Kode Kegiatan</th>
                                                                <th style="text-align: center;color:#000000;white-space: pre-wrap">Sub Sub Kegiatan</th>
                                                                <th style="text-align: center;color:#000000;white-space: pre-wrap">Tahun</th>
                                                                <th style="text-align: center;color:#000000;white-space: pre-wrap">Jumlah Anggaran</th>
                                                                <th style="text-align: center;color:#000000;white-space: pre-wrap">Jumlah Realisasi</th>
                                                                <th style="text-align: center;color:#000000;white-space: pre-wrap">Jumlah Deviasi</th>
                                                            </tr> --}}
                                                            {{-- <tr>
                                                                <th style="text-align: center;color:#000000;white-space: pre-wrap;">Kode</th>
                                                                <th style="text-align: center;color:#000000;white-space: pre-wrap;">Keterangan</th>
                                                                <th style="text-align: center;color:#000000;white-space: pre-wrap">PPTK</th>
                                                                <th style="text-align: center;color:#000000;white-space: pre-wrap">Tahap Anggaran</th>
                                                                <th style="text-align: center;color:#000000;white-space: pre-wrap">Tahun Anggaran</th>
                                                                <th style="text-align: center;color:#000000;white-space: pre-wrap">Jumlah Anggaran Total</th>
                                                                <th style="text-align: center;color:#000000;white-space: pre-wrap">div</th>
                                                            </tr> --}}
                                                            <tr>
                                                                <th rowspan="2" style="text-align: center; width: 5%;">Kode</th>
                                                                <th rowspan="2" style="text-align: center; width: 30%;">Nama Sub Sub Kegiatan</th>
                                                                <th rowspan="2" style="text-align: center; width: 10%;">PPTK</th>
                                                                <th rowspan="2" style="text-align: center; width: 10%;">Tahap Anggaran</th>
                                                                <th rowspan="2" style="text-align: center; width: 10%;">Tahun Anggaran</th>
                                                                <th rowspan="2" style="text-align: center; width: 15%;">Jumlah Anggaran Total</th>
                                                                <th colspan="2" style="text-align: center; width: 15%;">Jumlah Anggaran s/d Bulan Ini</th>
                                                                <th colspan="2" style="text-align: center; width: 15%;">Jumlah Realisasi s/d Bulan Ini</th>
                                                                <th rowspan="2" style="text-align: center; width: 10%;">Deviasi (%)</th>
                                                            </tr>
                                                            <tr>
                                                                <th style="text-align: center;">Jumlah</th>
                                                                <th style="text-align: center;">%</th>
                                                                <th style="text-align: center;">Jumlah</th>
                                                                <th style="text-align: center;">%</th>
                                                            </tr>
                                                            </thead>
                                                            <tbody>
                                                            {{-- <tr >
                                                                <td style="color:#000000;text-align: right;white-space: pre-wrap">{{ $items->tahap }}</td>
                                                                <td style="color:#000000;text-align: left;white-space: pre-wrap">{{ $items->kodeanggaran }}</td>
                                                                <td style="color:#000000;text-align: left;white-space: pre-wrap">{{ $items->keterangan }}</td>
                                                                <td style="color:#000000;text-align: right;white-space: pre-wrap">{{ $items->tahun }}</td>
                                                                <td style="color:#000000;text-align: right;white-space: pre-wrap">{{ number_format($items->subtotal,2,',','.') }}</td>
                                                                <td style="color:#000000;text-align: right;white-space: pre-wrap">{{ number_format($items->jumlahrealisasi,2,',','.') }}</td>
                                                                <td style="color:#000000;text-align: right;white-space: pre-wrap">{{ number_format($items->deviasi,2,',','.') }}</td>
                                                            </tr> --}}
                                                            @foreach($klaim as $items)
                                                                <tr >
                                                                    <td style="color:#000000;text-align: left;white-space: pre-wrap">{{ $items->kode }}</td>
                                                                    <td style="color:#000000;text-align: left;white-space: pre-wrap">{{ $items->keterangan }}</td>
                                                                    <td style="color:#000000;text-align: left;white-space: pre-wrap">{{ $items->namalengkap }}</td>
                                                                    <td style="color:#000000;text-align: left;white-space: pre-wrap">{{ $items->tahap }}</td>
                                                                    <td style="color:#000000;text-align: center;white-space: pre-wrap">{{ $items->tahun }}</td>
                                                                    <td style="color:#000000;text-align: right;white-space: pre-wrap">
                                                                        {{ number_format($items->targetmasuk ?? 0, 2, ',', '.') }}
                                                                    </td>
                                                                    
                                                                    <td style="color:#000000;text-align: right;white-space: pre-wrap">
                                                                        {{ number_format($items->total_anggaran ?? 0, 2, ',', '.') }}
                                                                    </td>
                                                                    
                                                                    <td style="color:#000000;text-align: left;white-space: pre-wrap">
                                                                        {{ $items->targetmasuk > 0 ? number_format(($items->total_anggaran / $items->targetmasuk) * 100, 0, ',', '.') . ' %' : '0 %' }}
                                                                    </td>
                                                                    
                                                                    <td style="color:#000000;text-align: right;white-space: pre-wrap">
                                                                        {{ number_format($items->total_realisasi ?? 0, 2, ',', '.') }}
                                                                    </td>
                                                                    
                                                                    <td style="color:#000000;text-align: left;white-space: pre-wrap">
                                                                        {{ $items->targetmasuk > 0 ? number_format(($items->total_realisasi / $items->targetmasuk) * 100, 0, ',', '.') . ' %' : '0 %' }}
                                                                    </td>
                                                                    
                                                                    <td style="color:#000000;text-align: left;white-space: pre-wrap">
                                                                        {{ $items->targetmasuk > 0 ? number_format((($items->total_anggaran / $items->targetmasuk) * 100) - (($items->total_realisasi / $items->targetmasuk) * 100), 0, ',', '.') . ' %' : '0 %' }}
                                                                    </td>
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
                        </div >
                    </form>
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

        $(function() {
            $( "#tglawal" ).datepicker({dateFormat: 'yy'});
        });
    </script>

@endsection
