require.config({
    baseUrl: '/',
    
    paths: {
        'LoginService': window.root + 'javascripts/Services/LoginService',
        'HttpServices': window.root + 'javascripts/Services/HttpServices',
        'core': window.root + 'javascripts/core',
        'Configuration': window.root + 'javascripts/Setting',
        'Service': window.root + 'javascripts/Services/Service',
        'Helper': window.root + 'javascripts/Helper',    
    },
    shim: {
    }
});
require(['LoginService', 'core', "kendo.angular", 'Configuration', 'Helper', 'jQuery', 'Service', 'HttpServices'],
    function (LoginService, core, kendo, conf, helper, MedifirstService) {
        angular.module('myApp', ["kendo.directives", "core", 'LoginServices', 'LocalStorageModule', 'Services', 'HttpServices'])
            .controller('Controller', [
                'socket', '$rootScope', '$scope', '$timeout', 'LoginService', 'localStorageService',
                function (socket, $rootScope, $scope, $timeout, loginService, localStorageService) {
   
                    // ===== CAPTCHA CONFIGURATION =====
                    // Mode Testing: set true untuk testing di localhost, false untuk production only
                    // var TESTING_MODE = true; // <-- Ubah ke false saat deploy production
                    var TESTING_MODE = false; // <-- Ubah ke false saat deploy production
                    
                    $scope.captchaEnabled = TESTING_MODE || window.location.hostname === 'simrs-grhasia.jogjaprov.go.id';
                    $scope.captchaQuestion = '';
                    $scope.captchaAnswer = '';
                    $scope.userCaptchaInput = '';

                    // DEBUG - Hapus setelah testing
                    console.log('=== CAPTCHA DEBUG ===');
                    console.log('TESTING_MODE:', TESTING_MODE);
                    console.log('Hostname:', window.location.hostname);
                    console.log('captchaEnabled:', $scope.captchaEnabled);

                    // Generate CAPTCHA
                    $scope.generateCaptcha = function() {
                        if ($scope.captchaEnabled) {
                            var num1 = Math.floor(Math.random() * 10) + 1;
                            var num2 = Math.floor(Math.random() * 10) + 1;
                            var operators = ['+', '-'];
                            var operator = operators[Math.floor(Math.random() * operators.length)];
                            
                            $scope.captchaQuestion = num1 + ' ' + operator + ' ' + num2;
                            
                            if (operator === '+') {
                                $scope.captchaAnswer = num1 + num2;
                            } else {
                                $scope.captchaAnswer = num1 - num2;
                            }
                            
                            console.log('CAPTCHA Generated:', $scope.captchaQuestion, '=', $scope.captchaAnswer);
                        }
                    };

                    // Validate CAPTCHA
                    $scope.validateCaptcha = function() {
                        if (!$scope.captchaEnabled) {
                            return true; // Bypass jika bukan domain produksi
                        }
                        
                        if (!$scope.userCaptchaInput || $scope.userCaptchaInput === '') {
                            window.messageContainer.error('Silakan isi jawaban CAPTCHA');
                            return false;
                        }
                        
                        if (parseInt($scope.userCaptchaInput) !== $scope.captchaAnswer) {
                            window.messageContainer.error('Jawaban CAPTCHA salah, silakan coba lagi');
                            $scope.userCaptchaInput = '';
                            $scope.generateCaptcha(); // Generate ulang
                            return false;
                        }
                        
                        return true;
                    };

                    // Initialize CAPTCHA saat load
                    $scope.generateCaptcha();

                    var goLogin = function (userName, password) {
                        window.localStorage.clear();
                        var delete_cookie = function (name) {
                            var today = new Date();
                            var expr = new Date(today.getTime() + (-1 * 24 * 60 * 60 * 1000));
                            document.cookie = name + '=;expires=' + (expr.toGMTString());
                        }
                        delete_cookie('authorization');
                        delete_cookie('statusCode');
                        delete_cookie('io');

                        loginService.authentication({
                            namaUser: userName,
                            kataSandi: password
                        }).then(function (data) {

                            if (data.data.messages.message) {
                                window.messageContainer.error(data.data.messages.message);
                                $scope.isBusy = false;
                                // Reset CAPTCHA setelah login gagal
                                $scope.userCaptchaInput = '';
                                $scope.generateCaptcha();
                                return;
                            }
                            var cookieStr = "statusCode=" + data.data.data.kelompokUser.kelompokUser + ';';
                            document.cookie = cookieStr;
                            document.cookie = 'authorization=' + data.data.messages['X-AUTH-TOKEN'] + ";";

                            var dataUserLogin = {
                                id: data.data.data.id,
                                kdUser: data.data.data.namaUser,
                                kdProfile: data.data.data.kdProfile,
                                waktuLogin: new Date(),
                                endWaktuLogin: new Date(new Date().getTime() + (1 * 24 * 60 * 60 * 1000))
                            };

                            window.localStorage.setItem('datauserlogin', JSON.stringify(dataUserLogin));
                            window.localStorage.setItem('pegawai', JSON.stringify(data.data.data.pegawai));
                            if (data.data.data.mapLoginUserToRuangan)
                                window.localStorage.setItem('mapLoginUserToRuangan', JSON.stringify(data.data.data.mapLoginUserToRuangan));
                            if (data.data.data.profile)
                                window.localStorage.setItem('profile', JSON.stringify(data.data.data.profile));
                            var dataUrlRoute = [];

                            $.when(
                                $.getJSON(conf.urlRoute, function (data) {
                                    dataUrlRoute = data;
                                }),
                                $.getJSON(conf.urlRoutePelayanan, function (data) {
                                    dataUrlRoutePelayanan = data;
                                }),
                                $.getJSON(conf.urlRouteSDM, function (data) {
                                    dataUrlRouteSDM = data;
                                }),
                                $.getJSON(conf.urlRouteSarpras, function (data) {
                                    dataUrlRouteSarpras = data;
                                }),
                                $.getJSON(conf.urlRouteManagemen, function (data) {
                                    dataUrlRouteManagemen = data;
                                }),
                                $.getJSON(conf.urlRouteKeuangan, function (data) {
                                    dataUrlRouteKeuangan = data;
                                })

                            ).then(function () {
                                var msgError = "";
                                var arrDataConfig = [dataUrlRoute, dataUrlRoutePelayanan, dataUrlRouteSDM, dataUrlRouteSarpras, dataUrlRouteManagemen, dataUrlRouteKeuangan];
                                var dataConfig = [];
                                dataConfig.push({
                                    "nameDep": "jQuery",
                                    "urlDep": "../jquery"
                                });
                                for (var i = 0; i < arrDataConfig.length; i++) {
                                    for (var k = 0; k < arrDataConfig[i].length; k++) {
                                        dataConfig.push(arrDataConfig[i][k]);
                                    }
                                }

                                if (msgError == "") {
                                    socket.emit('login', data.data.data.pegawai);
                                    window.localStorage.setItem('urlBind', JSON.stringify(dataConfig));
                                    setTimeout(function () {
                                        window.location = "/app/#/home";
                                        $scope.isBusy = false;
                                    }, 1000);
                                }
                            });
                        },
                            function (error) {
                                if (error.data != null)
                                    window.messageContainer.error(error.data.messages)
                                else
                                    window.messageContainer.error('Login Gagal, Koneksi Internet Tidak Stabil')
                                $scope.isBusy = false;
                                // Reset CAPTCHA setelah error
                                $scope.userCaptchaInput = '';
                                $scope.generateCaptcha();
                            });

                    };

                    $scope.isBusy = true;
                    $scope.login = function (userName, password) {
                        // Validasi CAPTCHA terlebih dahulu
                        if (!$scope.validateCaptcha()) {
                            return; // Stop jika CAPTCHA salah
                        }

                        var datauserlogin = JSON.parse(window.localStorage.getItem("datauserlogin"));
                        var blmLogout = !(datauserlogin == undefined || datauserlogin == null);

                        if (blmLogout) {
                            loginService.logout().then(function (e) {
                                var pegawai = JSON.parse(window.localStorage.getItem("pegawai"));
                                socket.emit('logout.otomatis', pegawai);
                                goLogin(userName, password);
                            }, function (e) {
                                goLogin(userName, password);
                            });
                        } else {
                            goLogin(userName, password);
                        }
                    };
                }
            ]);
        angular.bootstrap(document, ['myApp']);
    }
);

