@extends('auth.base-login')

@section('content')
@php
$configData = \App\Helpers\Helper::applClasses();

@endphp
<style type="text/css">
.login-bg-logo img {

    display: table;
    /* margin: 0 auto; */
    width: 100px;
    height: auto;
    margin-top: -60px;
    margin-right: 0;
    /* margin-bottom: 20px; */
    margin-left: auto;

}
</style>
<div class="container">

    <div class="row justify-content-center">

        <div class="col-md-8">
            <div class="card-group" style="    -webkit-box-shadow: 0 1px 20px 0 rgba(69,90,100,.08);
    box-shadow: 5px 10px 20px 0 rgb(69 90 100 / 22%);
    border-radius: 24px;
    border: none;
">
                <div class="card p-4">
                    <div class="card-body">
                        <h1>Login</h1>
                        <p class="text-muted"> {!! $configData['title'] !!}</p>
                        <form method="POST" action="{{ route('login_validation') }}">
                            @csrf
                            <div class="input-group mb-3">
                                <div class="input-group-prepend">
                                    <span class="input-group-text">
                                        <svg class="c-icon">
                                            <use xlink:href="{!! asset('coreui/assets/icons/coreui/free-symbol-defs.svg#cui-user')!!}"></use>
                                        </svg>
                                    </span>
                                </div>
                                <input class="form-control" type="text" placeholder="Username" name="username" value="{{request()->get("username")}}" required autofocus>
                            </div>
                            <div class="input-group mb-4">
                                <div class="input-group-prepend">
                                    <span class="input-group-text">
                                        <svg class="c-icon">
                                            <use xlink:href="{!! asset('coreui/assets/icons/coreui/free-symbol-defs.svg#cui-lock-locked') !!}"></use>
                                        </svg>
                                    </span>
                                </div>
                                <input class="form-control" type="password" placeholder="Password" name="password" required>
                            </div>
                        <!--     <span id="captcha" hidden></span>
                            <div class="input-group mb-4">
                                <div class="g-recaptcha" data-callback="onReturnCallback" data-sitekey="6LdwosIZAAAAALF5LATNjFt7raOiBmI_37rB0bVe" ></div>

                            </div> -->
                            <div class="row">
                                <div class="col-6">
                                    <button  class="btn btn-info px-4" type="submit" style="background-color: var(--v-primary-base);" id="btnMasuk">Continue</button>
                                    <div style=" text-align: center;margin-top: 10px;margin-left: -5px;display: none">
                                        <img style="position: fixed; opacity: 1;" id="isLoading" src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                                    </div>
                                </div>
                        </form>

                    </div>
                </div>
            </div>
            <div class="card text-white  py-5 d-md-down-none" style="width:44%;background-color: var(--v-primary-base);">
                <div class="card-body ">
                    <div class="login-bg-logo"><img src="{{ asset('images/logo_only.png')}}"></div>
                    <div style="margin-top: -20px">
                        <!-- <div style="margin-top: 15px"> -->
                        <h1 style="color:white">Executive Information System </h1>
                      
                    </div>
                </div>
            </div>

        </div>
    </div>
</div>
</div>

@endsection
<script type="text/javascript">
    /*
   var onReturnCallback = function(response) {
        var captchaResponse = response
        document.getElementById("btnMasuk").disabled = false;
        document.getElementById("captcha").innerHTML = captchaResponse;
    };
    var width = $('.g-recaptcha').parent().width();
if (width < 302) {
    var scale = width / 302;
    $('.g-recaptcha').css('transform', 'scale(' + scale + ')');
    $('.g-recaptcha').css('-webkit-transform', 'scale(' + scale + ')');
    $('.g-recaptcha').css('transform-origin', '0 0');
    $('.g-recaptcha').css('-webkit-transform-origin', '0 0');
}
*/
</script>
@section('javascript')

@include('template.toast')

@endsection
