@extends('auth.base-login')

@section('content')
@php
$configData = \App\Helpers\Helper::applClasses();
@endphp

<style type="text/css">
.login-bg-logo img {
    display: table;
    width: 100px;
    height: auto;
    margin-top: -60px;
    margin-right: 0;
    margin-left: auto;
}
</style>

<!-- Load Google reCAPTCHA Script -->
@if(isset($showCaptcha) && $showCaptcha)
<script src="https://www.google.com/recaptcha/api.js" async defer></script>
@endif

<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card-group" style="-webkit-box-shadow: 0 1px 20px 0 rgba(69,90,100,.08);
    box-shadow: 5px 10px 20px 0 rgb(69 90 100 / 22%);
    border-radius: 24px;
    border: none;">
                <div class="card p-4">
                    <div class="card-body">
                        <h1>Login</h1>
                        <p class="text-muted">{!! $configData['title'] !!}</p>
                        
                        <form method="POST" action="{{ route('login_validation') }}" id="loginForm">
                            @csrf
                            
                            <!-- Username Input -->
                            <div class="input-group mb-3">
                                <div class="input-group-prepend">
                                    <span class="input-group-text">
                                        <svg class="c-icon">
                                            <use xlink:href="{!! asset('coreui/assets/icons/coreui/free-symbol-defs.svg#cui-user')!!}"></use>
                                        </svg>
                                    </span>
                                </div>
                                <input class="form-control" type="text" placeholder="Username" name="username" value="{{request()->get('username')}}" required autofocus>
                            </div>
                            
                            <!-- Password Input -->
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

                            <!-- Google reCAPTCHA - Hanya tampil untuk domain tertentu -->
                            @if(isset($showCaptcha) && $showCaptcha)
                            <div class="form-group mb-3">
                                <div class="g-recaptcha" data-sitekey="{{ $recaptchaSiteKey ?? '' }}" data-callback="onRecaptchaSuccess"></div>
                                <small class="text-muted">Silakan centang "I'm not a robot" untuk melanjutkan</small>
                            </div>
                            @endif
                            
                            <!-- Submit Button -->
                            <div class="row">
                                <div class="col-6">
                                    <button class="btn btn-info px-4" type="submit" style="background-color: var(--v-primary-base);" id="btnMasuk" @if(isset($showCaptcha) && $showCaptcha) disabled @endif>
                                        Continue
                                    </button>
                                    <div style="text-align: center; margin-top: 10px; margin-left: -5px; display: none" id="loadingDiv">
                                        <img style="position: fixed; opacity: 1;" id="isLoading" src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                
                <!-- Right Side Panel -->
                <div class="card text-white py-5 d-md-down-none" style="width:44%; background-color: #abb9c9">
                    <div class="card-body">
                        <div class="login-bg-logo">
                            <img src="{{ asset('images/grhasia-bg-white.png')}}">
                        </div>
                        <div style="margin-top: -20px">
                            <h1 style="color:rgb(56, 56, 56)">Executive Information System</h1>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

@endsection

@section('javascript')
<script type="text/javascript">
    // Callback ketika reCAPTCHA berhasil diverifikasi
    function onRecaptchaSuccess() {
        document.getElementById("btnMasuk").disabled = false;
    }

    // Scale reCAPTCHA untuk mobile responsive
    @if(isset($showCaptcha) && $showCaptcha)
    window.addEventListener('load', function() {
        var recaptchaElement = document.querySelector('.g-recaptcha');
        if (recaptchaElement) {
            var width = recaptchaElement.parentElement.offsetWidth;
            if (width < 302) {
                var scale = width / 302;
                recaptchaElement.style.transform = 'scale(' + scale + ')';
                recaptchaElement.style.webkitTransform = 'scale(' + scale + ')';
                recaptchaElement.style.transformOrigin = '0 0';
                recaptchaElement.style.webkitTransformOrigin = '0 0';
            }
        }
    });
    @endif

    // Show loading saat submit
    document.getElementById('loginForm').addEventListener('submit', function() {
        document.getElementById('loadingDiv').style.display = 'block';
    });
</script>

@include('template.toast')
@endsection