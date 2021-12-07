<!DOCTYPE html>

@php
$configData = \App\Helpers\Helper::applClasses();

@endphp
<html lang="en">
<head>
<!--    <base href="./">-->
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no">
    <meta name="description" content="">

    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300&amp;display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,600,800" rel="stylesheet">
    <link rel="icon" type="image/x-icon" href="{{ asset($configData['favicon']) }}" />
    <meta name="keyword" content="">
    <title>{!! $configData['title'] !!} </title>

    <meta name="theme-color" content="#ffffff">
    <!-- Icons-->
    <script src="{{ asset('js/jquery/jquery-3.5.1.min.js') }}"></script>
    <link href="{{ asset('coreui/css/free.min.css') }}" rel="stylesheet"> <!-- icons -->
<!--    <link href="{{ asset('coreui/css/flag-icon.min.css') }}" rel="stylesheet">-->
    <!-- Main styles for this application-->
    <link href="{{ asset('css/css_awal.css') }}" rel="stylesheet">

    <link href="{{ asset('coreui/css/style.css') }}" rel="stylesheet">

    <!-- Global site tag (gtag.js) - Google Analytics-->
<!--    <script async="" src="https://www.googletagmanager.com/gtag/js?id=UA-118965717-3"></script>-->
    @toastr_css
    @toastr_js
    <script>
        window.dataLayer = window.dataLayer || [];

        function gtag() {
            dataLayer.push(arguments);
        }
        gtag('js', new Date());
        // Shared ID
        gtag('config', 'UA-118965717-3');
        // Bootstrap ID
        gtag('config', 'UA-118965717-5');
    </script>

<!--    <link href="{{ asset('coreui/css/coreui-chartjs.css') }}" rel="stylesheet">-->

</head>
<style>
    .bg-primary {
        background-color: var(--v-error-lighten1) !important;
    }
    .btn-info.disabled, .btn-info:disabled {
        color: #fff;
        background-color: #8C489F;
        border-color: #8C489F;
    }
 /*   .bg-primary {
        background-color: #8C489F !important;
    }*/
    .btn-info {
        color: #fff;
        background-color: var( --v-error-base);
        border-color:var(--v-error-lighten5);
    }
     .btn-info:hover {
        color: #fff;
        background-color: var(--v-error-base);

    }
    .btn-info:not(:disabled):not(.disabled):active, .show > .btn-info.dropdown-toggle {
    color: #fff;
    background-color: var(--v-primary-base);
    border-color: var(--v-primary-base);

}
input, button, select, optgroup, textarea {
    margin: 0;
     font-family: 'Poppins', sans-serif;
    font-size: inherit;
    line-height: inherit;
}
</style>
<body class="c-app flex-row align-items-center" style="
    background: url({!! asset('images/cover1.jpg') !!}) top/cover no-repeat fixed;
    display: flex;
    flex-direction: row;
    padding: 0;
    height: 100vh;">
<div id="toast"></div>
@toastr_render
@yield('content')

<!-- CoreUI and necessary plugins-->
<script src="{{ asset('coreui/js/coreui.bundle.min.js') }}"></script>
<!-- <script src="https://www.google.com/recaptcha/api.js" async="" defer=""></script> -->
@yield('javascript')

</body>
</html>
