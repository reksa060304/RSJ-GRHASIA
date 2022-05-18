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
                    <h5>Executive Information System</h5>
                </div>
                <div class="card-block tab-icon">
                    <form action="{!! route("show_page", ["role" => session('role'), "pages" => $r->pages ]) !!}" method="get">
                        <div class="row">
                            <div class="col-lg-3">
                            </div>
                            <div class="col-lg-2" style="margin-top: 5px; margin-left: 50px;">
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
                            <div class="col-lg-2" style="margin-top: 5px" >
                                <button class="btn btn-success  btn-outline-success"  type="submit">
                                    <i class="icofont icofont-search"></i>Search</button>
                            </div>
                            <div class="col-lg-3 col-md-12"></div>
                        </div>

                        <div class="row" style="margin-top: 50px;">
                            <div class="col-lg-3 col-md-12"></div>
                            <div class="col-lg-6 col-md-12">
                                <div class="card">
                                    <div class="panel panel-purple">
                                        <div class="panel-heading bg-purple">
                                            Data Kegiatan Pelayanan Rumah Sakit
                                        </div>
                                        <div class="panel-body">
                                            @php
                                                $bor = App\Http\Controllers\MainController::getBorLosToi(request()->get("tglawal"),request()->get("tglakhir"),session('kdProfile'));
                                            @endphp
                                            <div class="row" style="padding: 10px">
                                                <div class="col-md-12 col-xl-4">
                                                    <div class="card widget-card-1" style="background: rgba(69, 90, 100, 0.08);">
                                                    <div class="card-block-small">
                                                            <i class="icofont icofont-bed bg-c-blue card1-icon" style="padding-right:0"></i>
                                                            <span class="text-c-hitam f-w-600">BOR</span>
                                                            <h4>{!! $bor[0]['bor'] !!}</h4>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-md-12 col-xl-4">
                                                    <div class="card widget-card-1" style="background: rgba(69, 90, 100, 0.08);">
                                                        <div class="card-block-small">
                                                            <i class="icofont icofont-prescription bg-c-pink card1-icon" style="padding-right:0"></i>
                                                            <span class="text-c-hitam f-w-600">ALOS</span>
                                                            <h4>{!! $bor[0]['alos'] !!}</h4>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-md-12 col-xl-4">
                                                    <div class="card widget-card-1" style="background: rgba(69, 90, 100, 0.08);">
                                                        <div class="card-block-small">
                                                            <i class="icofont icofont-disabled bg-c-green card1-icon" style="padding-right:0"></i>
                                                            <span class="text-c-hitam f-w-600">TOI</span>
                                                            <h4>{!! $bor[0]['toi'] !!}</h4>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-md-12 col-xl-4">
                                                    <div class="card widget-card-1" style="background: rgba(69, 90, 100, 0.08);">
                                                        <div class="card-block-small">
                                                            <i class="icofont icofont-first-aid bg-success card1-icon" style="padding-right:0"></i>
                                                            <span class="text-c-hitam f-w-600">BTO</span>
                                                            <h4>{!! $bor[0]['bto'] !!}</h4>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-md-12 col-xl-4">
                                                    <div class="card widget-card-1" style="background: rgba(69, 90, 100, 0.08);">
                                                        <div class="card-block-small">
                                                            <i class="icofont icofont-operation-theater bg-c-merah card1-icon" style="padding-right:0"></i>
                                                            <span class="text-c-hitam f-w-600">NDR</span>
                                                            <h4>{!! $bor[0]['ndr'] !!}</h4>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-md-12 col-xl-4">
                                                    <div class="card widget-card-1" style="background: rgba(69, 90, 100, 0.08);">
                                                        <div class="card-block-small">
                                                            <i class="icofont icofont-pulse bg-c-ungu card1-icon" style="padding-right:0"></i>
                                                            <span class="text-c-hitam f-w-600">GDR</span>
                                                            <h4>{!! $bor[0]['gdr'] !!}</h4>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-3 col-md-12"></div>
                        </div >

                    </form>
                </div>
            </div>
        </div>
    </div>

    
@endsection

