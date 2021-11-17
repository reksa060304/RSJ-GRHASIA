<!DOCTYPE html>
<html class="loading" lang="en" data-textdirection="ltr">
<!-- BEGIN: Head-->

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1.0,user-scalable=0,minimal-ui">
    <meta name="description" content="">
    <meta name="keywords" content="">
    <meta name="author" content="">
    <title>RJP Paramarta</title>
   
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;1,400;1,500;1,600" rel="stylesheet">


    <link rel="shortcut icon" type="image/x-icon" href="{!! asset('favicon.ico') !!}">

    <!-- BEGIN: Vendor CSS-->
    <link rel="stylesheet" type="text/css" href="{!! asset('vuex/app-assets/vendors/css/vendors.min.css') !!}">
    <link rel="stylesheet" type="text/css" href="{!! asset('vuex/app-assets/vendors/css/pickers/flatpickr/flatpickr.min.css') !!}">
    <!-- END: Vendor CSS-->

    <!-- BEGIN: Theme CSS-->
    <link rel="stylesheet" type="text/css" href="{!! asset('vuex/app-assets/css/bootstrap.css') !!}">
    <link rel="stylesheet" type="text/css" href="{!! asset('vuex/app-assets/css/bootstrap-extended.css') !!}">
    <link rel="stylesheet" type="text/css" href="{!! asset('vuex/app-assets/css/colors.css') !!}">
    <link rel="stylesheet" type="text/css" href="{!! asset('vuex/app-assets/css/components.css') !!}">
    <link rel="stylesheet" type="text/css" href="{!! asset('vuex/app-assets/css/themes/dark-layout.css') !!}">
    <link rel="stylesheet" type="text/css" href="{!! asset('vuex/app-assets/css/themes/bordered-layout.css') !!}">
    <link rel="stylesheet" type="text/css" href="{!! asset('vuex/app-assets/css/themes/semi-dark-layout.css') !!}">

    <!-- BEGIN: Page CSS-->
    <link rel="stylesheet" type="text/css" href="{!! asset('vuex/app-assets/css/core/menu/menu-types/horizontal-menu.css') !!}">
    <link rel="stylesheet" type="text/css" href="{!! asset('vuex/app-assets/css/plugins/forms/pickers/form-flat-pickr.css') !!}">
    <link rel="stylesheet" type="text/css" href="{!! asset('vuex/app-assets/css/pages/app-invoice.css') !!}">
    <!-- END: Page CSS-->

    <!-- BEGIN: Custom CSS-->
      <link rel="stylesheet" type="text/css" href="{!! asset('vuex/app-assets/css/pages/page-auth.min.css') !!}">
    <link rel="stylesheet" type="text/css" href="{!! asset('vuex/assets/css/style.css') !!}">
    <!-- END: Custom CSS-->
</head>
<!-- END: Head-->

<!-- BEGIN: Body-->

<body class="horizontal-layout horizontal-menu blank-page navbar-floating footer-static  " data-open="hover" data-menu="horizontal-menu" data-col="">



                     <!--    <div class="col-xl-4 col-md-4 col-12"> -->
                     
                

    <!-- BEGIN: Content-->
    <div class="app-content content " >
        <div class="content-overlay"></div>
        <div class="header-navbar-shadow"></div>
        <div class="content-wrapper">
          
            <div class="content-body"> 
               <div class="auth-wrapper auth-v1 px-2"  id="previewCaptcha">
                  <div class="auth-inner py-2">
                    <!-- Login v1 -->
                    <div class="card mb-0">
                      <div class="card-body">
                        <a href="javascript:void(0);" class="brand-logo">
                   <img style="width:90px" src="{!! asset('img/logo_paramarta.png') !!}">          
                   <h2 class="brand-text ml-1 mt-1">RSJP Paramarta</h2>
                        </a>

                        <p class="card-text mb-2">Centang untuk melanjutkan</p>

                        <form class="auth-login-form mt-2" action="index.html" method="POST" >
                          <div class="form-group mt-1 mb-2">
                           <span id="captcha" hidden></span>

                            <div class="g-recaptcha" data-callback="onReturnCallback" data-sitekey="6LeyqNAZAAAAACZ1VLkQbcuDsERKEy3btTu59GLL"></div>
                          </div>
                         <button type="button" class="btn btn-outline-danger btn-block" id="btnMasuk" onclick="lanjut()">
                                <i data-feather="log-in" class="mr-25"></i>
                                <span class="align-middle">Lanjut</span>
                        </button>
                        </form>

                      </div>
                    </div>
                    <!-- /Login v1 -->
                  </div>
                </div>

            

                <section class="invoice-preview-wrapper" style="padding:10px"  id="previewPegawai">
                    <div class="row invoice-preview">
                        <!-- Invoice -->
                        <div class="col-xl-12 col-md-12 col-12">
                            <div class="card invoice-preview-card">
                                <div class="card-body invoice-padding pb-0">
                                    <!-- Header starts -->
                                    <div class="d-flex justify-content-between flex-md-row flex-column invoice-spacing mt-0">
                                        <div>
                                            <div class="logo-wrapper">
                                                <img style="width:100px" src="{!! asset('img/logo_paramarta.png') !!}">
                                                <h3 class=" invoice-logo">RSJP Paramarta</h3>
                                            </div>
                                            <p class="card-text mb-25">Jl. Soekarno Hatta No. 581,</p>
                                            <p class="card-text mb-25"> Bandung 40266 Jawa Barat, Indonesia</p>
                                            <p class="card-text mb-0">(022)73373398</p>
                                        </div>
                                        <div class="mt-md-0 mt-2">
                                            <h4 class="invoice-title">
                                                 {!! date('d M Y') !!}
                                                <!-- <span class="invoice-number">#3492</span> -->
                                            </h4>
                                            <!-- <div class="invoice-date-wrapper">
                                                <p class="invoice-date-title">Date Issued:</p>
                                                <p class="invoice-date">25/08/2020</p>
                                            </div>
                                            <div class="invoice-date-wrapper">
                                                <p class="invoice-date-title">Due Date:</p>
                                                <p class="invoice-date">29/08/2020</p>
                                            </div> -->
                                        </div>
                                    </div>
                                    <!-- Header ends -->
                                </div>

                                <hr class="invoice-spacing" />

                                <!-- Address and Contact starts -->
                                <div class="card-body invoice-padding pt-0">
                                    <div class="row invoice-spacing">
                                        <div class="col-xl-8 p-0">
                                            <!-- <h6 class="mb-2">Invoice To:</h6> -->
                                           <table>
                                                <tbody>
                                                    <tr>
                                                        <td class="pr-1">Nama </td>
                                                        <td class="pr-1">:</td>
                                                        <td><span class="font-weight-bold">{!! $data->namalengkap !!}</span></td>
                                                    </tr>
                                                    <tr>
                                                        <td class="pr-1">NIK</td>
                                                        <td class="pr-1">:</td>
                                                        <td><span class="font-weight-bold">{!! $data->noidentitas ? $data->noidentitas:'-' !!}</span></td>
                                                    </tr>
                                                   
                                                    <!-- <tr>
                                                        <td class="pr-1">SWIFT code:</td>
                                                        <td>BR91905</td>
                                                    </tr> -->
                                                </tbody>
                                            </table>
                                        </div>
                                        <div class="col-xl-4 p-0 mt-xl-0 mt-2">
                                            <!-- <h6 class="mb-2">Payment Details:</h6> -->
                                            <table>
                                                <tbody>
                                                  
                                                    <tr>
                                                        <td class="pr-1">No. SIP</td>
                                                        <td class="pr-1">:</td>
                                                        <td><span class="font-weight-bold">{!! $data->nosip?$data->nosip:'-' !!}</span></td>
                                                    </tr>
                                                    <tr>
                                                        <td class="pr-1">Jabatan</td>
                                                        <td class="pr-1">:</td>
                                                        <td><span class="font-weight-bold">{!! $data->namajabatan ? $data->namajabatan: '-' !!}</span></td>
                                                    </tr>
                                                    <!-- <tr>
                                                        <td class="pr-1">SWIFT code:</td>
                                                        <td>BR91905</td>
                                                    </tr> -->
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                     <hr class="invoice-spacing" />

                                <!-- Invoice Note starts -->
                                <div class="card-body invoice-padding pt-0">
                                    <div class="row">
                                        <div class="col-12">
                                            <span class="font-weight-bold">Note:</span>
                                            <span>Dibuat di Rumah Sakit Khusus Jantung dan Pembuluh Darah Paramarta Bandung, pada tanggal {!! date('d M Y') !!}</span>
                                        </div>
                                    </div>
                                </div>
                               
                            </div>
                        </div>
                        <!-- /Invoice -->

                        <!-- Invoice Actions -->
                       <!--  <div class="col-xl-3 col-md-4 col-12 invoice-actions mt-md-0 mt-2">
                            <div class="card">
                                <div class="card-body">
                                    <button class="btn btn-primary btn-block mb-75" data-toggle="modal" data-target="#send-invoice-sidebar">
                                        Send Invoice
                                    </button>
                                    <button class="btn btn-outline-secondary btn-block btn-download-invoice mb-75">Download</button>
                                    <a class="btn btn-outline-secondary btn-block mb-75" href="./app-invoice-print.html" target="_blank">
                                        Print
                                    </a>
                                    <a class="btn btn-outline-secondary btn-block mb-75" href="./app-invoice-edit.html"> Edit </a>
                                    <button class="btn btn-success btn-block" data-toggle="modal" data-target="#add-payment-sidebar">
                                        Add Payment
                                    </button>
                                </div>
                            </div>
                        </div> -->
                        <!-- /Invoice Actions -->
                    </div>
                </section>

                <!-- Send Invoice Sidebar -->
                
                <!-- /Send Invoice Sidebar -->

               

            </div>
        </div>
    </div>
    <!-- END: Content-->

  
<input type="hidden" id="address" value="{!! $_SERVER['REMOTE_ADDR'] !!}">

    <!-- BEGIN: Vendor JS-->
    <script src="{!! asset('vuex/app-assets/vendors/js/vendors.min.js') !!}"></script>
    <!-- BEGIN Vendor JS-->

    <!-- BEGIN: Page Vendor JS-->
    <script src="{!! asset('vuex/app-assets/vendors/js/ui/jquery.sticky.js') !!}"></script>
    <script src="{!! asset('vuex/app-assets/vendors/js/forms/repeater/jquery.repeater.min.js') !!}"></script>
    <script src="{!! asset('vuex/app-assets/vendors/js/pickers/flatpickr/flatpickr.min.js') !!}"></script>
    <!-- END: Page Vendor JS-->

    <!-- BEGIN: Theme JS-->
    <script src="{!! asset('vuex/app-assets/js/core/app-menu.js') !!}"></script>
    <script src="{!! asset('vuex/app-assets/js/core/app.js') !!}"></script>
    <!-- END: Theme JS-->

    <!-- BEGIN: Page JS-->
    <script src="{!! asset('vuex/app-assets/js/scripts/pages/app-invoice.js') !!}"></script>
    <!-- END: Page JS-->

<script src="https://www.google.com/recaptcha/api.js" async="" defer=""></script>
    <script>
        $(window).on('load', function() {
            if (feather) {
                feather.replace({
                    width: 14,
                    height: 14
                });
            }
        })
        var pegawaiDiv = $("#previewPegawai")
        var captchaDiv = $("#previewCaptcha")

        pegawaiDiv.hide()
        var onReturnCallback = function(response) {
            var captchaResponse = response
            document.getElementById("btnMasuk").disabled = false;
            document.getElementById("captcha").innerHTML = captchaResponse;
        };

        var APP_URL = {!! json_encode(url('/')) !!}
        function lanjut(){
             pegawaiDiv.hide()
             captchaDiv.show()
            $.ajax({
                type    : 'GET',
                url     : APP_URL + '/service/medifirst2000/eoffice/cek-captcha?captchaResponse='+document.getElementById("captcha").innerHTML,
                 
                success: function(data) {
                    if(data.success){
                        pegawaiDiv.show()
                        captchaDiv.hide()
                    }else{
                        pegawaiDiv.hide()
                        captchaDiv.show()
                        alert('captcha tidak valid')
                    }
                },
                error: function(error) {
                    pegawaiDiv.hide()
                    captchaDiv.show()
                    console.log("FAIL....================="+JSON.stringfy(error));
                }
            })
        }
        
           // $captchaResponse =$data["recaptcha"];
           //  $secret = '6LdwosIZAAAAAPM9FsjT7ruqweBjFNhXbAtN3d-S';
           //  // $secret = '6LeyqNAZAAAAAKO8uCFObSxNO1YWo2vzpP44ydfS';
           //  $response = json_decode(file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret="
           //        .$secret."&response=".$captchaResponse."&remoteip=".$_SERVER['REMOTE_ADDR']), true);
              
      
    </script>
</body>
<!-- END: Body-->

</html>