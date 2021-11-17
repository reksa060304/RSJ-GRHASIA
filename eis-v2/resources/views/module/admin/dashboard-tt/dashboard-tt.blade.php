
@extends('template.template3')
@section('css')
    <style>
        .form-control {
            display: block;
            width: 100%;
            padding: .5rem .75rem;
            font-size: 1rem;
            /* line-height: 1.25; */
            color: #495057;
            background-color: #fff;
            background-image: none;
            background-clip: padding-box;
            border: 1px solid rgba(0,0,0,.15);
            border-radius: .25rem;
            transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
        }
        body table tr td {
            font-size: 15px;
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

        .pad{
            padding-top: 3rem;
        }
        @media (min-width: 992px) {
            .pad {
                padding-top: 1.8rem;
            }
        }

        /*.modal-lg .kons{*/
        /*    width:1140px;*/
        /*}*/
        .bg-isi{
            background:  #00c0ef!important;
        }
        .bg-kosong{
            background: #d81b60c4!important;
        }
        .color-text {
           color: white
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
<div class="page-wrapper pad" id="id_template"  style="margin-top:20px">

    <!-- <div class="page-header">
        <div class="row align-items-end">
            <div class="col-lg-12">
                <div class="page-header-title">
                    <div class="d-inline" style="text-align: center">
                        <h4 >Informasi Kamar  </h4>
                    </div>
                </div>
            </div>

        </div>
    </div> -->
    <!-- Page-body start -->
    <div class="page-body">
        <div class="row">
            <div class="col-md-12 col-xs-12">
                <div class="card">
                    <div class="card-header" style="padding: .75rem 1.25rem;">
                       <h5>Informasi Kamar </h5>
                        <div class="card-header-right">
                            <ul class="list-unstyled card-option">
                                <li><i class="feather icon-maximize full-card"></i></li>
                                <li><i class="feather icon-minus minimize-card"></i></li>
                                <li><i class="feather icon-trash-2 close-card"></i></li>
                            </ul>
                        </div>
                    </div>
                    <div class="card-block">
                        <div class="row" style="margin-top:10px">
                            <div class="col-md-12 col-xl-3">
                                <div class="card widget-card-1"  style="border: 1px solid rgba(69, 90, 100, 0.14);">
                                    <div class="card-block-small">
                                        <i class="icofont icofont-bed-patient bg-c-blue card1-icon"></i>
                                        <span class="text-c-blue f-w-600">TOTAL KAMAR</span>
                                        <h4>{!!    $res['totalKamar'] !!}</h4>
                                        <div>
                                            <span class="f-left m-t-10 text-muted">
                                                <i class="text-c-blue f-16 feather icon-alert-triangle m-r-10"></i>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-12 col-xl-3">
                                <div class="card widget-card-1"  style="border: 1px solid rgba(69, 90, 100, 0.14);">
                                    <div class="card-block-small">
                                        <i class="icofont icofont-listine-dots bg-c-pink card1-icon"></i>
                                        <span class="text-c-pink f-w-600">TOTAL BED</span>
                                        <h4>{!! $res['totalBed'] !!}</h4>
                                        <div>
                                            <span class="f-left m-t-10 text-muted">
                                                <i class="text-c-pink f-16 feather icon-calendar m-r-10"></i>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-12 col-xl-3">
                                <div class="card widget-card-1"  style="border: 1px solid rgba(69, 90, 100, 0.14);">
                                    <div class="card-block-small">
                                        <i class="icofont icofont-hospital bg-c-green card1-icon"></i>
                                        <span class="text-c-green f-w-600">TERISI</span>
                                        <h4>{!! $res['totalIsi'] !!}</h4>
                                        <div>
                                            <span class="f-left m-t-10 text-muted">
                                                <i class="text-c-green f-16 feather icon-tag m-r-10"></i>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-12 col-xl-3">
                                <div class="card widget-card-1"  style="border: 1px solid rgba(69, 90, 100, 0.14);">
                                    <div class="card-block-small">
                                        <i class="icofont icofont-bed bg-c-yellow card1-icon"></i>
                                        <span class="text-c-yellow f-w-600">KOSONG</span>
                                        <h4>{!! $res['totalKosong'] !!}</h4>
                                        <div>
                                            <span class="f-left m-t-10 text-muted">
                                                <i class="text-c-yellow f-16 feather icon-watch m-r-10"></i>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>


                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            @foreach($res['tt'] as $key => $v)
            
                 <div class="col-md-12 col-xl-3 mytooltip tooltip-effect-5 tooltip-item" style="cursor: pointer" onclick="klikDetails({!! $v['idruangan'] !!},'{!! $v['namaruangan'] !!}')">
                    <span class="tooltip-content clearfix">
                    <span class="tooltip-text">Klik untuk melihat detail</span>
                    </span>
               
                     @php
                     $color ='bg-isi2';
                     $text ='';
                     if($v['kosong'] == 0){
                       $color ='bg-kosong';
                       $text ='color:white';
                     }
                     @endphp
                <div class="card widget-statstic-card {!! $color !!}"  >
                    <div class="card-header">
                        <div class="card-header-left">
                            <h5 style="{!! $text !!}">{!!  $v['namaruangan'] !!} </h5>

                        </div>
                    </div>
                    <div class="card-block">
                        <div class="row">
                            <div class="col-md-4" style="padding: 0 2px 0 2px">
                                <div class="card text-center text-white bg-c-green">
                                    <div class="card-block">
                                        <h4 class="m-t-10 m-b-10">{!!  $v['bed'] !!}</h4>
                                        <h6 style="font-size: 12px;" class="m-b-0">Bed</h6>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4" style="padding: 0 2px 0 2px">
                                <div class="card text-center text-white bg-c-merah">
                                    <div class="card-block">
                                        <h4 class="m-t-10 m-b-10">{!!  $v['isi'] !!}</h4>
                                        <h6 style="font-size: 12px;" class="m-b-0">Terisi</h6>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4" style="padding: 0 2px 0 2px">
                                <div class="card text-center text-white bg-c-1">
                                    <div class="card-block">
                                        <h4 class="m-t-10 m-b-10">{!!  $v['kosong'] !!}</h4>
                                        <h6 style="font-size: 12px;" class="m-b-0">Tersedia</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <i class="icofont icofont-bed st-icon bg-c-blue"></i>
                    </div>
                </div>
            </div>
            @endforeach
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
    var APP_URL = {!! json_encode(url('/')) !!}
    function klikDetails(kode,title){
        $.ajax({
            type    : 'GET',
            url     : APP_URL+'/get-detail-kamar',
            data    : {ruanganId:kode},
            cache   : false,
            success : function(respond){
                document.getElementById("titleModalKun").innerHTML =   title
                $('#modalKunjungan').modal("show");
                $("#load_kunjungan").html(respond);
            }
        })
    }
</script>
@endsection
